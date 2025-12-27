#### 19.2.3.1 Monitoramento das Threads Principais de Replicação

A instrução `SHOW PROCESSLIST` fornece informações que indicam o que está acontecendo na fonte e na replica em relação à replicação. Para informações sobre os estados da fonte, consulte a Seção 10.14.4, “Estados das Threads de Replicação da Fonte”. Para os estados da replica, consulte a Seção 10.14.5, “Estados das Threads de E/S (Receptor) de Replicação” e a Seção 10.14.6, “Estados das Threads de SQL (Aplicador) de Replicação”.

O exemplo a seguir ilustra como os três principais threads de replicação, a thread de exibição de dump do log binário, a thread de E/S (receptor) de replicação e a thread de SQL (aplicador) de replicação aparecem na saída de `SHOW PROCESSLIST`.

No servidor de origem, a saída de `SHOW PROCESSLIST` parece assim:

```
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

Aqui, o thread 2 é uma thread de `Dump de Binlog` que atende a uma replica conectada. A informação `State` indica que todas as atualizações pendentes foram enviadas para a replica e que a fonte está aguardando mais atualizações. Se você não vir nenhuma thread de `Dump de Binlog` em um servidor de origem, isso significa que a replicação não está em execução; ou seja, nenhuma replica está atualmente conectada.

Em um servidor de replica, a saída de `SHOW PROCESSLIST` parece assim:

```
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

A informação `State` indica que o thread 10 é a thread de E/S (receptor) de replicação que está comunicando-se com o servidor de origem, e o thread 11 é a thread de SQL (aplicador) de replicação que está processando as atualizações armazenadas nos logs de relevo. No momento em que `SHOW PROCESSLIST` foi executado, ambos os threads estavam inativos, aguardando atualizações adicionais.

O valor na coluna `Time` pode mostrar o quanto a réplica está atrasada em relação à fonte. Veja a Seção A.14, “Perguntas frequentes do MySQL 9.5: Replicação”. Se passar um tempo suficiente no lado da fonte sem atividade no thread `Binlog Dump`, a fonte determina que a réplica não está mais conectada. Quanto a qualquer outra conexão de cliente, os tempos de espera dependem dos valores de `net_write_timeout` e `net_retry_count`; para mais informações sobre esses valores, consulte a Seção 7.1.8, “Variáveis do sistema do servidor”.

A instrução `SHOW REPLICA STATUS` fornece informações adicionais sobre o processamento da replicação em um servidor de réplica. Veja a Seção 19.1.7.1, “Verificar o status da replicação”.

Você também pode recuperar informações sobre os threads `Binlog Dump` da fonte com o seguinte:

```
        SELECT * FROM performance_schema.threads WHERE PROCESSLIST_COMMAND LIKE "Binlog Dump%"
```

`Binlog Dump%` é usado para recuperar `Binlog Dump` ou `Binlog Dump GTID`, dependendo do modo em que o descarte de binlog está.