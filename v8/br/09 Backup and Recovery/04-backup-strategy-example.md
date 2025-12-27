## 9.3 Estratégia de Backup e Recuperação

Esta seção discute um procedimento para realizar backups que permite recuperar dados após vários tipos de falhas:

* Falha no sistema operacional
* Falha de energia
* Falha no sistema de arquivos
* Problema de hardware (disco rígido, placa-mãe, etc.)

Os comandos de exemplo não incluem opções como `--user` e `--password` para os programas clientes `mysqldump` e `mysql`. Você deve incluir tais opções conforme necessário para permitir que os programas clientes se conectem ao servidor MySQL.

Suponha que os dados estejam armazenados no mecanismo de armazenamento `InnoDB`, que oferece suporte a transações e recuperação automática de falhas. Também supõe-se que o servidor MySQL esteja sob carga no momento da falha. Se não estivesse, nenhuma recuperação seria necessária.

Para casos de falhas no sistema operacional ou falhas de energia, podemos assumir que os dados do disco do MySQL estão disponíveis após um reinício. Os arquivos de dados do `InnoDB` podem não conter dados consistentes devido à falha, mas o `InnoDB` lê seus logs e encontra neles a lista de transações pendentes comprometidas e não comprometidas que não foram descarregadas nos arquivos de dados. O `InnoDB` desfaz automaticamente aquelas transações que não foram comprometidas e descarrega para seus arquivos de dados aquelas que foram comprometidas. Informações sobre esse processo de recuperação são transmitidas ao usuário através do log de erro do MySQL. O seguinte é um trecho de log de exemplo:

```
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

Para os casos de falhas no sistema de arquivos ou problemas de hardware, podemos assumir que os dados do disco do MySQL *não* estão disponíveis após um reinício. Isso significa que o MySQL não consegue iniciar com sucesso porque alguns blocos de dados do disco deixam de ser legíveis. Neste caso, é necessário reformatar o disco, instalá-lo novamente ou corrigir o problema subjacente de outra forma. Em seguida, é necessário recuperar nossos dados do MySQL a partir de backups, o que significa que os backups já devem ter sido feitos. Para garantir que seja o caso, projete e implemente uma política de backup.