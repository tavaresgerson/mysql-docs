### 7.5.1 Point-in-Time Recovery Usando Binary Log

Esta seção explica a ideia geral de usar o Binary Log para executar uma Point-in-Time Recovery. A próxima seção, Seção 7.5.2, “Point-in-Time Recovery Usando Posições de Eventos”, explica a operação em detalhes com um exemplo.

Nota

Muitos dos exemplos nesta e na próxima seção usam o cliente **mysql** para processar a saída do Binary Log produzida pelo **mysqlbinlog**. Se o seu Binary Log contiver caracteres `\0` (null), essa saída não poderá ser analisada pelo **mysql** a menos que você o invoque com a opção `--binary-mode`.

A fonte de informação para a Point-in-Time Recovery é o conjunto de arquivos de Binary Log gerados subsequentemente à operação de full backup. Portanto, para permitir que um servidor seja restaurado a um ponto no tempo, o *binary logging* deve estar ativado nele (consulte a Seção 5.4.4, “The Binary Log” para detalhes).

Para restaurar dados do Binary Log, você deve saber o nome e a localização dos arquivos de Binary Log atuais. Por padrão, o servidor cria arquivos de Binary Log no *data directory*, mas um nome de caminho pode ser especificado com a opção `--log-bin` para colocar os arquivos em um local diferente. Para ver uma listagem de todos os arquivos de Binary Log, use esta *statement*:

```sql
mysql> SHOW BINARY LOGS;
```

Para determinar o nome do arquivo de Binary Log atual, emita a seguinte *statement*:

```sql
mysql> SHOW MASTER STATUS;
```

O utilitário **mysqlbinlog** converte os eventos nos arquivos de Binary Log do formato binário para texto, para que possam ser visualizados ou aplicados. O **mysqlbinlog** possui opções para selecionar seções do Binary Log com base nos horários dos eventos ou na posição dos eventos dentro do log. Consulte a Seção 4.6.7, “mysqlbinlog — Utility for Processing Binary Log Files”.

A aplicação de eventos do Binary Log faz com que as modificações de dados que eles representam sejam reexecutadas. Isso permite a recuperação de alterações de dados por um determinado período de tempo. Para aplicar eventos do Binary Log, processe a saída do **mysqlbinlog** usando o cliente **mysql**:

```sql
$> mysqlbinlog binlog_files | mysql -u root -p
```

Visualizar o conteúdo do log pode ser útil quando você precisa determinar horários ou posições de eventos para selecionar o conteúdo parcial do log antes de executar os eventos. Para visualizar eventos do log, envie a saída do **mysqlbinlog** para um programa de paginação:

```sql
$> mysqlbinlog binlog_files | more
```

Alternativamente, salve a saída em um arquivo e visualize o arquivo em um editor de texto:

```sql
$> mysqlbinlog binlog_files > tmpfile
$> ... edit tmpfile ...
```

Após editar o arquivo, aplique o conteúdo da seguinte forma:

```sql
$> mysql -u root -p < tmpfile
```

Se você tiver mais de um Binary Log para aplicar no servidor MySQL, use uma única conexão para aplicar o conteúdo de todos os arquivos de Binary Log que você deseja processar. Aqui está uma maneira de fazer isso:

```sql
$> mysqlbinlog binlog.000001 binlog.000002 | mysql -u root -p
```

Outra abordagem é gravar o log inteiro em um único arquivo e, em seguida, processar o arquivo:

```sql
$> mysqlbinlog binlog.000001 >  /tmp/statements.sql
$> mysqlbinlog binlog.000002 >> /tmp/statements.sql
$> mysql -u root -p -e "source /tmp/statements.sql"
```