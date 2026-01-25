#### 16.2.2.1 Comandos para Operações em um Único Channel

Para permitir que as operações de replicação do MySQL ajam em replication channels individuais, use a cláusula `FOR CHANNEL channel` com os seguintes statements de replicação:

* [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement")
* [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement")
* [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement")
* [`SHOW RELAYLOG EVENTS`](show-relaylog-events.html "13.7.5.32 SHOW RELAYLOG EVENTS Statement")
* [`FLUSH RELAY LOGS`](flush.html "13.7.6.3 FLUSH Statement")

* [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement")
* [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement")

Similarmente, um parâmetro `channel` adicional é introduzido para as seguintes functions:

* [`MASTER_POS_WAIT()`](miscellaneous-functions.html#function_master-pos-wait)
* [`WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`](gtid-functions.html#function_wait-until-sql-thread-after-gtids)

Os seguintes statements não são permitidos para o `group_replication_recovery channel`:

* [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement")
* [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement")

Os seguintes statements não são permitidos para o `group_replication_applier channel`:

* [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement")
* [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement")
* [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement")
* [`FLUSH RELAY LOGS`](flush.html "13.7.6.3 FLUSH Statement")