## 7.3 Estratégia de backup e recuperação de exemplo

7.3.1 Estabelecimento de uma Política de Backup

7.3.2 Uso de backups para recuperação

7.3.3 Resumo da Estratégia de Backup

Esta seção discute um procedimento para realizar backups que permite recuperar dados após vários tipos de falhas:

- Quebra do sistema operacional
- Falha de energia
- Quebra do sistema de arquivos
- Problema de hardware (disco rígido, placa-mãe, etc.)

Os comandos de exemplo não incluem opções como `--user` e `--password` para os programas de cliente **mysqldump** e **mysql**. Você deve incluir essas opções conforme necessário para permitir que os programas de cliente se conectem ao servidor MySQL.

Suponha que os dados estejam armazenados no mecanismo de armazenamento `InnoDB`, que oferece suporte para transações e recuperação automática em caso de falha. Além disso, suponha que o servidor MySQL esteja sob carga no momento da falha. Se não estivesse, nenhuma recuperação seria necessária.

Para casos de falhas no sistema operacional ou falhas de energia, podemos assumir que os dados do disco do MySQL estão disponíveis após um reinício. Os arquivos de dados do `InnoDB` podem não conter dados consistentes devido à falha, mas o `InnoDB` lê seus logs e encontra neles a lista de transações pendentes confirmadas e não confirmadas que não foram descarregadas para os arquivos de dados. O `InnoDB` desfaz automaticamente essas transações que não foram confirmadas e descarrega para seus arquivos de dados aquelas que foram confirmadas. As informações sobre esse processo de recuperação são transmitidas ao usuário através do log de erro do MySQL. O seguinte é um trecho de log de exemplo:

```sql
InnoDB: Database was not shut down normally.
InnoDB: Starting recovery from log files...
InnoDB: Starting log scan based on checkpoint at
InnoDB: log sequence number 0 13674004
InnoDB: Doing recovery: scanned up to log sequence number 0 13739520
InnoDB: Doing recovery: scanned up to log sequence number 0 13805056
InnoDB: Doing recovery: scanned up to log sequence number 0 13870592
InnoDB: Doing recovery: scanned up to log sequence number 0 13936128
...
InnoDB: Doing recovery: scanned up to log sequence number 0 20555264
InnoDB: Doing recovery: scanned up to log sequence number 0 20620800
InnoDB: Doing recovery: scanned up to log sequence number 0 20664692
InnoDB: 1 uncommitted transaction(s) which must be rolled back
InnoDB: Starting rollback of uncommitted transactions
InnoDB: Rolling back trx no 16745
InnoDB: Rolling back of trx no 16745 completed
InnoDB: Rollback of uncommitted transactions completed
InnoDB: Starting an apply batch of log records to the database...
InnoDB: Apply batch completed
InnoDB: Started
mysqld: ready for connections
```

Para os casos de falhas no sistema de arquivos ou problemas de hardware, podemos assumir que os dados do disco do MySQL *não* estão disponíveis após um reinício. Isso significa que o MySQL não consegue iniciar com sucesso porque alguns blocos de dados do disco deixam de ser legíveis. Nesse caso, é necessário reformatar o disco, instalá-lo novamente ou, de outra forma, corrigir o problema subjacente. Em seguida, é necessário recuperar nossos dados do MySQL a partir de backups, o que significa que os backups já devem ter sido feitos. Para garantir que seja esse o caso, projete e implemente uma política de backup.
