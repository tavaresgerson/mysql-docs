## 8.14 Análise das informações do thread (processo) do servidor

Para verificar o que seu servidor MySQL está fazendo, pode ser útil examinar a lista de processos, que indica as operações atualmente sendo realizadas pelo conjunto de threads que estão executando dentro do servidor. Por exemplo:

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

Os threads podem ser interrompidos com a instrução `KILL`. Consulte a Seção 13.7.6.4, “Instrução KILL”.
