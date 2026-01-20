#### 16.2.3.1 Monitoramento das Threads Principais de Replicação

A instrução `SHOW PROCESSLIST` fornece informações que indicam o que está acontecendo na fonte e na replica em relação à replicação. Para informações sobre os estados da fonte, consulte Seção 8.14.5, “Estados de Fios de Replicação da Fonte”. Para informações sobre os estados da replica, consulte Seção 8.14.6, “Estados de Fios de E/S de Replicação da Replica” e Seção 8.14.7, “Estados de Fios de SQL de Replicação da Replica”.

O exemplo a seguir ilustra como os três principais fios de replicação, o thread de exibição de exaustão do log binário, o thread de I/O de replicação e o thread de SQL de replicação aparecem na saída do `SHOW PROCESSLIST`.

No servidor de origem, o resultado da consulta `SHOW PROCESSLIST` (show-processlist.html) parece assim:

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

Aqui, o thread 2 é um thread de `Dump de Binlog` que atende a uma replica conectada. As informações de `Estado` indicam que todas as atualizações pendentes foram enviadas para a replica e que a fonte está aguardando mais atualizações. Se você não vir nenhum thread de `Dump de Binlog` em um servidor de origem, isso significa que a replicação não está em execução; ou seja, nenhuma replica está conectada atualmente.

Em um servidor de replicação, o resultado da consulta `SHOW PROCESSLIST` (show-processlist.html) parece assim:

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

A informação sobre o `Estado` indica que o thread 10 é o thread de I/O de replicação que está se comunicando com o servidor de origem, e o thread 11 é o thread de SQL de replicação que está processando as atualizações armazenadas nos logs de retransmissão. No momento em que o `SHOW PROCESSLIST` foi executado, ambos os fios estavam inativos, aguardando atualizações adicionais.

O valor na coluna `Time` pode mostrar o quanto a réplica está atrasada em relação à fonte. Veja Seção A.14, “Perguntas Frequentes do MySQL 5.7: Replicação”. Se passar tempo suficiente no lado da fonte sem atividade no thread `Binlog Dump`, a fonte determina que a réplica não está mais conectada. Quanto a qualquer outra conexão de cliente, os tempos de espera dependem dos valores de `net_write_timeout` e `net_retry_count`; para mais informações sobre esses valores, veja Seção 5.1.7, “Variáveis do Sistema do Servidor”.

A declaração `SHOW SLAVE STATUS` fornece informações adicionais sobre o processamento de replicação em um servidor replica. Consulte Seção 16.1.7.1, “Verificar o Status da Replicação”.
