#### 19.2.2.1 Comandos para operações em um único canal

Para permitir que as operações de replicação do MySQL atuem em canais de replicação individuais, use a cláusula `FOR CHANNEL channel` com as seguintes declarações de replicação:

- `CHANGE REPLICATION SOURCE TO`

- `CHANGE MASTER TO`

- `START REPLICA` (ou antes do MySQL 8.0.22, `START SLAVE`)

- `STOP REPLICA` (ou antes do MySQL 8.0.22, `STOP SLAVE`)

- `SHOW RELAYLOG EVENTS`

- `FLUSH RELAY LOGS`

- `SHOW REPLICA STATUS` (ou antes do MySQL 8.0.22, `SHOW SLAVE STATUS`)

- `RESET REPLICA` (ou antes do MySQL 8.0.22, `RESET SLAVE`)

As seguintes funções têm um parâmetro `channel`:

- `MASTER_POS_WAIT()`
- `SOURCE_POS_WAIT()`

As seguintes declarações são desaconselhadas para o canal `group_replication_recovery`:

- `START REPLICA`
- `STOP REPLICA`

As seguintes declarações são desaconselhadas para o canal `group_replication_applier`:

- `START REPLICA`
- `STOP REPLICA`
- `SHOW REPLICA STATUS`

O `FLUSH RELAY LOGS` agora é permitido para o canal `group_replication_applier`, mas se o pedido for recebido enquanto uma transação está sendo aplicada, o pedido será executado após a transação terminar. O solicitante deve esperar enquanto a transação for concluída e a rotação ocorrer. Esse comportamento impede que as transações sejam divididas, o que não é permitido para a Replicação por Grupo.
