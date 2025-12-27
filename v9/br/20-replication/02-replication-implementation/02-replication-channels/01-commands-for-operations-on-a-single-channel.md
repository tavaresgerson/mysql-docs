#### 19.2.2.1 Comandos para Operações em um Canal Único

Para permitir que as operações de replicação do MySQL atuem em canais de replicação individuais, use a cláusula `FOR CHANNEL channel` com as seguintes instruções de replicação:

* `CHANGE REPLICATION SOURCE TO`
* `START REPLICA`
* `STOP REPLICA`
* `SHOW RELAYLOG EVENTS`
* `FLUSH RELAY LOGS`

* `SHOW REPLICA STATUS`
* `RESET REPLICA`

A função `SOURCE_POS_WAIT()` tem um parâmetro `channel`.

`START REPLICA` e `STOP REPLICA` são desabilitados para os canais `group_replication_recovery` e `group_replication_applier`. `SHOW REPLICA STATUS` também não é permitido com o canal `group_replication_applier`.

`FLUSH RELAY LOGS` é permitido para o canal `group_replication_applier`, mas se a solicitação for recebida enquanto uma transação está sendo aplicada, a solicitação não é realizada até que a transação termine. O solicitante deve esperar enquanto a transação é concluída e a rotação ocorre. Isso previne que as transações sejam divididas, o que não é permitido para a Replicação em Grupo.