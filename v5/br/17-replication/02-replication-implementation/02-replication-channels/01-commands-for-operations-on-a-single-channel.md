#### 16.2.2.1 Comandos para operações em um único canal

Para permitir que as operações de replicação do MySQL atuem em canais de replicação individuais, use a cláusula `FOR CHANNEL channel` com as seguintes instruções de replicação:

- `MUDAR MASTER PARA`

- `START SLAVE`

- `STOP SLAVE`

- `Mostre eventos do RELAYLOG`

- `Limpar logs do repositório de mensagens de correio eletrônico`

- `Mostre o status do escravo`

- `RESET SLAVE`

Da mesma forma, um parâmetro adicional `channel` é introduzido para as seguintes funções:

- `MASTER_POS_WAIT()`
- `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`

As seguintes declarações são desaconselhadas para o canal `group_replication_recovery`:

- `START SLAVE`
- `STOP SLAVE`

As seguintes declarações são desaconselhadas para o canal `group_replication_applier`:

- `START SLAVE`
- `STOP SLAVE`
- `Mostre o status do escravo`
- `Limpar logs do repositório de mensagens de correio eletrônico`
