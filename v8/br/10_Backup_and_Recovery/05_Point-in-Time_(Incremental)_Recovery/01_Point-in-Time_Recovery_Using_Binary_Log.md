### 9.5.1 Recuperação no Ponto de Tempo Usando Log de Binário

Esta seção explica a ideia geral de usar o log binário para realizar uma recuperação em um ponto no tempo. A próxima seção, Seção 9.5.2, “Recuperação em Ponto no Tempo Usando Posições de Eventos”, explica a operação em detalhes com um exemplo.

Nota

Muitos dos exemplos neste e na seção seguinte usam o cliente **mysql** para processar a saída do log binário produzido pelo **mysqlbinlog**. Se o seu log binário contiver caracteres `\0` (nulos), essa saída não pode ser analisada pelo **mysql**, a menos que você a invoque com a opção `--binary-mode`.

A fonte de informações para a recuperação em um ponto no tempo é o conjunto de arquivos de registro binários gerados após a operação de backup completo. Portanto, para permitir que um servidor seja restaurado a um ponto no tempo, o registro binário deve ser habilitado nele, que é o ajuste padrão para o MySQL 8.0 (veja a Seção 7.4.4, “O Registro Binário”).

Para restaurar dados do log binário, você deve conhecer o nome e a localização dos arquivos de log binário atuais. Por padrão, o servidor cria arquivos de log binário no diretório de dados, mas um nome de caminho pode ser especificado com a opção `--log-bin` para colocar os arquivos em um local diferente. Para ver uma lista de todos os arquivos de log binário, use esta declaração:

```
mysql> SHOW BINARY LOGS;
```

Para determinar o nome do arquivo de log binário atual, execute a seguinte instrução:

```
mysql> SHOW MASTER STATUS;
```

O utilitário **mysqlbinlog** converte os eventos nos arquivos de log binário do formato binário para texto, para que possam ser visualizados ou aplicados. O **mysqlbinlog** tem opções para selecionar seções do log binário com base nos tempos dos eventos ou na posição dos eventos dentro do log. Veja a Seção 6.6.9, “mysqlbinlog — Utilitário para Processamento de Arquivos de Log Binário”.

Ao aplicar eventos do log binário, as modificações de dados que eles representam são reexecutadas. Isso permite a recuperação das alterações de dados para um determinado período de tempo. Para aplicar eventos do log binário, processe a saída do **mysqlbinlog** usando o cliente **mysql**:

```
$> mysqlbinlog binlog_files | mysql -u root -p
```

Se os arquivos de log binários tiverem sido criptografados, o que pode ser feito a partir do MySQL 8.0.14 em diante, o **mysqlbinlog** não pode lê-los diretamente, como no exemplo acima, mas pode lê-los do servidor usando a opção `--read-from-remote-server` (`-R`). Por exemplo:

```
$> mysqlbinlog --read-from-remote-server --host=host_name --port=3306  --user=root --password --ssl-mode=required  binlog_files | mysql -u root -p
```

Aqui, a opção `--ssl-mode=required` foi usada para garantir que os dados dos arquivos de log binários sejam protegidos durante a transmissão, pois são enviados para o **mysqlbinlog** em um formato não criptografado.

Importante

`VERIFY_CA` e `VERIFY_IDENTITY` são melhores escolhas do que `REQUIRED` para o modo SSL, pois ajudam a prevenir ataques de homem no meio. Para implementar uma dessas configurações, você deve primeiro garantir que o certificado da CA do servidor esteja disponível de forma confiável para todos os clientes que o utilizam em seu ambiente, caso contrário, problemas de disponibilidade ocorrerão. Consulte Opções de Comando para Conexões Encriptadas.

Ver o conteúdo do log pode ser útil quando você precisa determinar os tempos ou posições dos eventos para selecionar o conteúdo parcial do log antes de executar os eventos. Para visualizar os eventos do log, envie a saída do **mysqlbinlog** para um programa de navegação:

```
$> mysqlbinlog binlog_files | more
```

Alternativamente, salve a saída em um arquivo e visualize o arquivo em um editor de texto:

```
$> mysqlbinlog binlog_files > tmpfile
$> ... edit tmpfile ...
```

Após editar o arquivo, aplique o conteúdo da seguinte forma:

```
$> mysql -u root -p < tmpfile
```

Se você tiver mais de um log binário para aplicar no servidor MySQL, use uma única conexão para aplicar o conteúdo de todos os arquivos de log binário que você deseja processar. Aqui está uma maneira de fazer isso:

```
$> mysqlbinlog binlog.000001 binlog.000002 | mysql -u root -p
```

Outra abordagem é escrever todo o log em um único arquivo e, em seguida, processar o arquivo:

```
$> mysqlbinlog binlog.000001 >  /tmp/statements.sql
$> mysqlbinlog binlog.000002 >> /tmp/statements.sql
$> mysql -u root -p -e "source /tmp/statements.sql"
```
