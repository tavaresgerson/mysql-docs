#### 19.2.3.1 Monitoramento das Threads Principais de Replicação

A declaração `SHOW PROCESSLIST` fornece informações que indicam o que está acontecendo na fonte e na réplica em relação à replicação. Para informações sobre os estados da fonte, consulte a Seção 10.14.4, “Estados de Fios de Fonte de Replicação”. Para informações sobre os estados da réplica, consulte a Seção 10.14.5, “Estados de Fios de Entrada/Saída (Receptor) de Replicação” e a Seção 10.14.6, “Estados de Fios de Replicação SQL”.

O exemplo a seguir ilustra como os três principais fios de replicação, o fio de exibição de dump do log binário, o fio de I/O de replicação (receptor) e o fio de SQL de replicação (aplicador) aparecem na saída do `SHOW PROCESSLIST`.

No servidor de origem, a saída do `SHOW PROCESSLIST` parece assim:

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

Aqui, o fio 2 é um fio `Binlog Dump` que atende a uma replica conectada. As informações `State` indicam que todas as atualizações pendentes foram enviadas para a replica e que a fonte está aguardando mais atualizações. Se você não vir nenhum fio `Binlog Dump` em um servidor de origem, isso significa que a replicação não está em execução; ou seja, nenhuma replica está conectada atualmente.

Em um servidor de replicação, o resultado do `SHOW PROCESSLIST` parece assim:

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

A informação `State` indica que o fio 10 é o fio de I/O de replicação (receptor) que está se comunicando com o servidor de origem, e o fio 11 é o fio de SQL de replicação (aplicador) que está processando as atualizações armazenadas nos logs de retransmissão. No momento em que o `SHOW PROCESSLIST` foi executado, ambos os fios estavam inativos, aguardando atualizações adicionais.

O valor na coluna `Time` pode indicar o quanto a replica está atrasada em relação à fonte. Veja a Seção A.14, “Perguntas Frequentes do MySQL 8.0: Replicação”. Se passar um tempo suficiente no lado da fonte sem atividade no fio `Binlog Dump`, a fonte determina que a replica não está mais conectada. Quanto a qualquer outra conexão de cliente, os tempos de espera dependem dos valores de `net_write_timeout` e `net_retry_count`; para mais informações sobre esses valores, consulte a Seção 7.1.8, “Variáveis do Sistema do Servidor”.

A declaração `SHOW REPLICA STATUS` fornece informações adicionais sobre o processamento de replicação em um servidor replica. Veja a Seção 19.1.7.1, “Verificar o Status da Replicação”.
