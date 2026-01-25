## 8.14 Examinando Informações de Thread (Processo) do Server

8.14.1 Acessando a Process List

8.14.2 Valores de Comando de Thread

8.14.3 Estados Gerais de Thread

8.14.4 Estados de Thread do Query Cache

8.14.5 Estados de Thread de Origem de Replication

8.14.6 Estados de Thread I/O da Réplica de Replication

8.14.7 Estados de Thread SQL da Réplica de Replication

8.14.8 Estados de Thread de Conexão da Réplica de Replication

8.14.9 Estados de Thread do NDB Cluster

8.14.10 Estados de Thread do Event Scheduler

Para determinar o que o seu MySQL Server está fazendo, pode ser útil examinar a process list, que indica as operações atualmente sendo executadas pelo conjunto de threads dentro do Server. Por exemplo:

```sql
mysql> SHOW PROCESSLIST\G
*************************** 1. row ***************************
     Id: 1
   User: event_scheduler
   Host: localhost
     db: NULL
Command: Daemon
   Time: 2756681
  State: Waiting on empty queue
   Info: NULL
*************************** 2. row ***************************
     Id: 20
   User: me
   Host: localhost:52943
     db: test
Command: Query
   Time: 0
  State: starting
   Info: SHOW PROCESSLIST
```

Threads podem ser encerradas com o comando `KILL`. Consulte a Seção 13.7.6.4, “KILL Statement”.