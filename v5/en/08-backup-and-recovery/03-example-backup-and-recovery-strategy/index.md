## 7.3 Exemplo de Estratégia de Backup e Recovery

7.3.1 Estabelecendo uma Política de Backup

7.3.2 Usando Backups para Recovery

7.3.3 Resumo da Estratégia de Backup

Esta seção discute um procedimento para realizar backups que permite recuperar dados após vários tipos de crashes:

* Crash do Operating system
* Falha de energia
* Crash do File system
* Problema de Hardware (hard drive, motherboard e assim por diante)

Os comandos de exemplo não incluem opções como `--user` e `--password` para os programas cliente **mysqldump** e **mysql**. Você deve incluir tais opções conforme necessário para permitir que os programas cliente se conectem ao MySQL server.

Presuma que os dados estão armazenados no storage engine `InnoDB`, que oferece suporte a transactions e automatic crash recovery. Presuma também que o MySQL server está sob load no momento do crash. Se não estivesse, nenhum recovery seria necessário.

Para casos de crashes do Operating system ou falhas de energia, podemos assumir que os dados em disco do MySQL estão disponíveis após um restart. Os data files do `InnoDB` podem não conter dados consistentes devido ao crash, mas o `InnoDB` lê seus logs e encontra neles a lista de transactions pendentes, committed e não committed, que ainda não foram flushed para os data files. O `InnoDB` automaticamente rolls back as transactions que não foram committed, e flushes para seus data files aquelas que foram committed. As informações sobre esse processo de recovery são transmitidas ao usuário por meio do error log do MySQL. O seguinte é um exemplo de trecho do log:

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

Para os casos de crashes do File system ou problemas de Hardware, podemos assumir que os dados em disco do MySQL *não* estão disponíveis após um restart. Isso significa que o MySQL falha ao iniciar com sucesso porque alguns blocos de dados em disco não são mais legíveis. Nesses casos, é necessário reformatar o disco, instalar um novo, ou corrigir o problema subjacente de outra forma. Em seguida, é necessário recuperar nossos dados do MySQL a partir de backups, o que significa que os backups já devem ter sido feitos. Para garantir que este seja o caso, projete e implemente uma política de backup.