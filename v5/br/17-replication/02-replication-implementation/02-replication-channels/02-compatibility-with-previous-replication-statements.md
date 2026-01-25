#### 16.2.2.2 Compatibilidade com Declarações de Replication Anteriores

Quando uma replica possui múltiplos channels e a opção `FOR CHANNEL channel` não é especificada, uma declaração válida geralmente age em todos os channels disponíveis, com algumas exceções específicas.

Por exemplo, as seguintes declarações se comportam conforme o esperado para todos, exceto para determinados channels de Group Replication:

* [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") inicia os replication threads para todos os channels, exceto os channels `group_replication_recovery` e `group_replication_applier`.

* [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") para os replication threads para todos os channels, exceto os channels `group_replication_recovery` e `group_replication_applier`.

* [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") reporta o status para todos os channels, exceto o channel `group_replication_applier`.

* [`FLUSH RELAY LOGS`](flush.html "13.7.6.3 FLUSH Statement") faz o flush dos relay logs para todos os channels, exceto o channel `group_replication_applier`.

* [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") faz o reset de todos os channels.

Aviso

Use `RESET SLAVE` com cautela, pois esta declaração deleta todos os channels existentes, purga seus relay log files e recria apenas o channel padrão.

Algumas declarações de replication não podem operar em todos os channels. Neste caso, o erro 1964 Multiple channels exist on the slave. Please provide channel name as an argument. é gerado. As seguintes declarações e funções geram este erro quando utilizadas em uma topologia de multi-source replication e quando a opção `FOR CHANNEL channel` não é usada para especificar em qual channel agir:

* [`SHOW RELAYLOG EVENTS`](show-relaylog-events.html "13.7.5.32 SHOW RELAYLOG EVENTS Statement")
* [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement")
* [`MASTER_POS_WAIT()`](miscellaneous-functions.html#function_master-pos-wait)
* [`WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`](gtid-functions.html#function_wait-until-sql-thread-after-gtids)

Note que um channel padrão sempre existe em uma topologia de single source replication, onde as declarações e funções se comportam como nas versões anteriores do MySQL.