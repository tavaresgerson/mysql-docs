#### 16.2.3.1 Monitoramento dos Threads Principais de Replicação

A instrução [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") fornece informações que indicam o que está acontecendo no *source* e no *replica* em relação à replicação. Para obter informações sobre os *states* do *source*, consulte [Section 8.14.5, “Replication Source Thread States”](source-thread-states.html "8.14.5 Replication Source Thread States"). Para os *states* do *replica*, consulte [Section 8.14.6, “Replication Replica I/O Thread States”](replica-io-thread-states.html "8.14.6 Replication Replica I/O Thread States") e [Section 8.14.7, “Replication Replica SQL Thread States”](replica-sql-thread-states.html "8.14.7 Replication Replica SQL Thread States").

O exemplo a seguir ilustra como os três *threads* principais de replicação—o *binary log dump thread*, o *replication I/O thread* e o *replication SQL thread*—aparecem na saída do [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement").

No servidor *source*, a saída do [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") se parece com isto:

```sql
mysql> SHOW PROCESSLIST\G
*************************** 1. row ***************************
     Id: 2
   User: root
   Host: localhost:32931
     db: NULL
Command: Binlog Dump
   Time: 94
  State: Has sent all binlog to slave; waiting for binlog to
         be updated
   Info: NULL
```

Aqui, o *thread* 2 é um `Binlog Dump` thread que atende a um *replica* conectado. A informação do `State` indica que todas as atualizações pendentes foram enviadas ao *replica* e que o *source* está aguardando que mais atualizações ocorram. Se você não vir nenhum `Binlog Dump` thread em um servidor *source*, isso significa que a replicação não está em execução; ou seja, nenhum *replica* está conectado atualmente.

Em um servidor *replica*, a saída do [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") se parece com isto:

```sql
mysql> SHOW PROCESSLIST\G
*************************** 1. row ***************************
     Id: 10
   User: system user
   Host:
     db: NULL
Command: Connect
   Time: 11
  State: Waiting for master to send event
   Info: NULL
*************************** 2. row ***************************
     Id: 11
   User: system user
   Host:
     db: NULL
Command: Connect
   Time: 11
  State: Has read all relay log; waiting for the slave I/O
         thread to update it
   Info: NULL
```

A informação do `State` indica que o *thread* 10 é o *replication I/O thread* que está se comunicando com o servidor *source*, e o *thread* 11 é o *replication SQL thread* que está processando as atualizações armazenadas nos *relay logs*. No momento em que [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") foi executado, ambos os *threads* estavam ociosos, aguardando por novas atualizações.

O valor na coluna `Time` pode mostrar o quão atrasado o *replica* está em comparação com o *source*. Consulte [Section A.14, “MySQL 5.7 FAQ: Replication”](faqs-replication.html "A.14 MySQL 5.7 FAQ: Replication"). Se um tempo suficiente decorrer no lado do *source* sem atividade no `Binlog Dump` thread, o *source* determina que o *replica* não está mais conectado. Assim como acontece com qualquer outra conexão de cliente, os *timeouts* para isso dependem dos valores de `net_write_timeout` e `net_retry_count`; para mais informações sobre estas, consulte [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

A instrução [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") fornece informações adicionais sobre o processamento de replicação em um servidor *replica*. Consulte [Section 16.1.7.1, “Checking Replication Status”](replication-administration-status.html "16.1.7.1 Checking Replication Status").