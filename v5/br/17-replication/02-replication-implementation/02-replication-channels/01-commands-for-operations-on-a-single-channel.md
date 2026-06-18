#### 16.2.2.1 Comandos para Operações em um Único Channel

Para permitir que as operações de replicação do MySQL ajam em replication channels individuais, use a cláusula `FOR CHANNEL channel` com os seguintes statements de replicação:

* `CHANGE MASTER TO`
* `START SLAVE`
* `STOP SLAVE`
* `SHOW RELAYLOG EVENTS`
* `FLUSH RELAY LOGS`

* `SHOW SLAVE STATUS`
* `RESET SLAVE`

Similarmente, um parâmetro `channel` adicional é introduzido para as seguintes functions:

* `MASTER_POS_WAIT()`
* `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`

Os seguintes statements não são permitidos para o `group_replication_recovery channel`:

* `START SLAVE`
* `STOP SLAVE`

Os seguintes statements não são permitidos para o `group_replication_applier channel`:

* `START SLAVE`
* `STOP SLAVE`
* `SHOW SLAVE STATUS`
* `FLUSH RELAY LOGS`