## 7.5 Recuperação Ponto no Tempo (Incremental)

A recuperação em ponto de tempo refere-se à recuperação de alterações de dados até a um determinado ponto no tempo. Tipicamente, esse tipo de recuperação é realizado após a restauração de um backup completo que traz o servidor ao seu estado no momento em que o backup foi feito. (O backup completo pode ser feito de várias maneiras, como as listadas na Seção 7.2, “Métodos de backup de banco de dados”.) A recuperação em ponto de tempo, então, atualiza o servidor incrementalmente do momento do backup completo para um momento mais recente.

### 7.5.1 Recuperação em Ponto de Tempo Usando Registro Binário

Esta seção explica a ideia geral de usar o log binário para realizar uma recuperação em um ponto no tempo. A próxima seção, Seção 7.5.2, “Recuperação em um Ponto no Tempo Usando Posições de Evento”, explica a operação em detalhes com um exemplo.

Nota

Muitos dos exemplos neste e na próxima seção usam o cliente **mysql** para processar a saída do log binário produzido pelo **mysqlbinlog**. Se o seu log binário contiver caracteres `\0` (nulos), essa saída não pode ser analisada pelo **mysql**, a menos que você a invoque com a opção `--binary-mode`.

A fonte de informação para a recuperação em um ponto no tempo é o conjunto de arquivos de registro binários gerados após a operação de backup completo. Portanto, para permitir que um servidor seja restaurado a um ponto no tempo, o registro binário deve ser habilitado nele (consulte a Seção 5.4.4, “O Registro Binário”, para detalhes).

Para restaurar dados do log binário, você deve conhecer o nome e a localização dos arquivos de log binário atuais. Por padrão, o servidor cria arquivos de log binário no diretório de dados, mas um nome de caminho pode ser especificado com a opção `--log-bin` para colocar os arquivos em um local diferente. Para ver uma lista de todos os arquivos de log binário, use esta declaração:

```sql
mysql> SHOW BINARY LOGS;
```

Para determinar o nome do arquivo de registro binário atual, execute a seguinte declaração:

```sql
mysql> SHOW MASTER STATUS;
```

O utilitário **mysqlbinlog** converte os eventos nos arquivos de registro binário do formato binário para texto, para que possam ser visualizados ou aplicados. **mysqlbinlog** tem opções para selecionar seções do registro binário com base nos tempos dos eventos ou na posição dos eventos dentro do registro. Veja a Seção 4.6.7, “mysqlbinlog — Utilitário para Processamento de Arquivos de Registro Binário”.

Aplicar eventos do log binário faz com que as modificações de dados que eles representam sejam reexecutadas. Isso permite a recuperação das alterações de dados para um determinado período de tempo. Para aplicar eventos do log binário, processe a saída do **mysqlbinlog** usando o cliente **mysql**:

```sql
$> mysqlbinlog binlog_files | mysql -u root -p
```

Ver o conteúdo do log pode ser útil quando você precisa determinar os horários ou posições dos eventos para selecionar conteúdos parciais do log antes de executar os eventos. Para visualizar os eventos do log, envie a saída do **mysqlbinlog** em um programa de navegação:

```sql
$> mysqlbinlog binlog_files | more
```

Alternativamente, salve a saída em um arquivo e veja o arquivo em um editor de texto:

```sql
$> mysqlbinlog binlog_files > tmpfile
$> ... edit tmpfile ...
```

Após editar o arquivo, aplique o conteúdo da seguinte forma:

```sql
$> mysql -u root -p < tmpfile
```

Se você tiver mais de um log binário para aplicar no servidor MySQL, use uma única conexão para aplicar o conteúdo de todos os arquivos de log binário que você deseja processar. Aqui está uma maneira de fazer isso:

```sql
$> mysqlbinlog binlog.000001 binlog.000002 | mysql -u root -p
```

Outra abordagem é escrever todo o log em um único arquivo e, em seguida, processar o arquivo:

```sql
$> mysqlbinlog binlog.000001 >  /tmp/statements.sql
$> mysqlbinlog binlog.000002 >> /tmp/statements.sql
$> mysql -u root -p -e "source /tmp/statements.sql"
```

### 7.5.2 Recuperação no Ponto de Tempo Usando Posições de Evento

A última seção, Seção 7.5.1, “Recuperação em Ponto de Tempo Usando Log Binário”, explica a ideia geral de usar o log binário para realizar uma recuperação em ponto de tempo. A seção explica a operação em detalhes com um exemplo.

Como exemplo, suponha que, por volta das 13:00:00 do dia 27 de maio de 2020, uma declaração SQL foi executada que excluiu uma tabela. Você pode realizar uma recuperação em um ponto específico para restaurar o servidor até seu estado imediatamente antes da exclusão da tabela. Esses são alguns passos amostrados para alcançar isso:

1. Restaure a última cópia de segurança completa criada antes do ponto de interesse (chame-a de `tp`, que é 13:00:00 em 27 de maio de 2020 em nosso exemplo). Ao terminar, anote a posição do log binário até a qual você restaurou o servidor para uso posterior e reinicie o servidor.

Nota

Embora a última posição do log binário recuperada também seja exibida pelo InnoDB após o restauro e o reinício do servidor, essa não é uma maneira confiável de obter a posição final do log do seu restauro, pois podem ter ocorrido eventos de DDL e alterações que não são do InnoDB após o período refletido pela posição exibida. Sua ferramenta de backup e restauração deve fornecer a última posição do log binário para sua recuperação: por exemplo, se você estiver usando **mysqlbinlog** para a tarefa, verifique a posição de parada do replay do log binário; se você estiver usando o MySQL Enterprise Backup, a última posição do log binário foi salva em seu backup. Veja a Recuperação em Ponto no Tempo.

2. Encontre a posição precisa do evento de registro binário correspondente ao ponto no tempo até o qual você deseja restaurar seu banco de dados. No nosso exemplo, dado que sabemos o horário aproximado em que a exclusão da tabela ocorreu (`tp`), podemos encontrar a posição do registro verificando o conteúdo do log por volta desse tempo usando o utilitário **mysqlbinlog**. Use as opções `--start-datetime` e `--stop-datetime` para especificar um curto período de tempo por volta de `tp`, e então procure o evento na saída. Por exemplo:

   ```sql
   $> mysqlbinlog   --start-datetime="2020-05-27 12:59:00" --stop-datetime="2020-05-27 13:06:00" \
     --verbose /var/lib/mysql/bin.123456 | grep -C 12 "DROP TABLE"
   # at 1868
   #200527 13:00:30 server id 2  end_log_pos 1985 CRC32 0x8b894489 	Query	thread_id=8	exec_time=0	error_code=0
   use `pets`/*!*/;
   SET TIMESTAMP=1590598830/*!*/;
   SET @@session.pseudo_thread_id=8/*!*/;
   SET @@session.foreign_key_checks=1, @@session.sql_auto_is_null=0, @@session.unique_checks=1, @@session.autocommit=1/*!*/;
   SET @@session.sql_mode=1436549152/*!80005 &~0x1003ff00*//*!*/;
   SET @@session.auto_increment_increment=1, @@session.auto_increment_offset=1/*!*/;
   /*!\C latin1 *//*!*/;
   SET @@session.character_set_client=8,@@session.collation_connection=8,@@session.collation_server=8/*!*/;
   SET @@session.lc_time_names=0/*!*/;
   SET @@session.collation_database=DEFAULT/*!*/;
   DROP TABLE `cats` /* generated by server */
   /*!*/;
   # at 1985
   #200527 13:05:06 server id 2  end_log_pos 2050 CRC32 0x2f8d0249 	Anonymous_GTID	last_committed=6	sequence_number=7	rbr_only=yes	original_committed_timestamp=0	immediate_commit_timestamp=0	transaction_length=0
   /*!50718 SET TRANSACTION ISOLATION LEVEL READ COMMITTED*//*!*/;
   # original_commit_timestamp=0 (1969-12-31 19:00:00.000000 EST)
   # immediate_commit_timestamp=0 (1969-12-31 19:00:00.000000 EST)
   /*!80001 SET @@session.original_commit_timestamp=0*//*!*/;
   /*!80014 SET @@session.original_server_version=0*//*!*/;
   /*!80014 SET @@session.immediate_server_version=0*//*!*/;
   SET @@SESSION.GTID_NEXT= 'ANONYMOUS'/*!*/;
   # at 2050
   #200527 13:05:06 server id 2  end_log_pos 2122 CRC32 0x56280bb1 	Query	thread_id=8	exec_time=0	error_code=0
   ```

A saída do **mysqlbinlog**, a declaração `` DROP TABLE `pets`.`cats` `` statement can be found in the segment of the binary log between the line `# em 1868` and `# em 1985`, which means the statement takes place *after* the log position 1868, and the log is at position 1985 after the `DROP TABLE`.

Nota

Utilize apenas as opções `--start-datetime` e `--stop-datetime` para ajudá-lo a encontrar as posições reais dos eventos de interesse. Não é recomendado usar as duas opções para especificar o intervalo de segmento de log binário a ser aplicado: há um risco maior de perder eventos de log binário ao usar as opções. Use `--start-position` e `--stop-position` em vez disso.

3. Aplique os eventos no arquivo de registro binário no servidor, começando com a posição de registro que você encontrou no passo 1 (assumindo que é 1006) e terminando na posição que você encontrou no passo 2 que está *antes* do seu ponto de interesse (que é 1868):

   ```sql
   $> mysqlbinlog --start-position=1006 --stop-position=1868 /var/lib/mysql/bin.123456 \
            | mysql -u root -p
   ```

O comando recupera todas as transações a partir da posição inicial até pouco antes da posição de parada. Como a saída do **mysqlbinlog** inclui as instruções `SET TIMESTAMP` antes de cada declaração SQL registrada, os dados recuperados e os registros relacionados do MySQL refletem os tempos originais em que as transações foram executadas.

Seu banco de dados foi restaurado agora ao ponto no tempo de interesse, `tp`, logo antes da tabela `pets.cats` ser descartada.

4. Além da recuperação no ponto no tempo que foi concluída, se você também quiser reexecutar todas as declarações *após* o seu ponto no tempo de interesse, use novamente **mysqlbinlog** para aplicar todos os eventos após `tp` ao servidor. Observamos no passo 2 que, após a declaração que queríamos ignorar, o log está na posição 1985; podemos usá-lo para a opção `--start-position`, para que quaisquer declarações após a posição sejam incluídas:

   ```sql
   $> mysqlbinlog --start-position=1985 /var/lib/mysql/bin.123456 \
            | mysql -u root -p
   ```

Seu banco de dados foi restaurado com a última declaração registrada no arquivo de registro binário, mas o evento selecionado foi ignorado.