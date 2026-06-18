#### 29.12.11.2 Tabela replication\_applier\_configuration

Esta tabela mostra os parâmetros de configuração que afetam as transações aplicadas pela replica. Os parâmetros armazenados na tabela podem ser alterados em tempo de execução com a instrução `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a instrução `CHANGE MASTER TO` (antes do MySQL 8.0.23).

A tabela `replication_applier_configuration` tem essas colunas:

- `CHANNEL_NAME`

  O canal de replicação que esta linha está exibindo. Há sempre um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte a Seção 19.2.2, “Canais de Replicação”, para obter mais informações.

- `DESIRED_DELAY`

  O número de segundos que a réplica deve ficar atrasada em relação à fonte. (Opção `CHANGE REPLICATION SOURCE TO`: `SOURCE_DELAY`, opção `CHANGE MASTER TO`: `MASTER_DELAY`) Consulte a Seção 19.4.11, “Replicação Atrasada”, para obter mais informações.

- `PRIVILEGE_CHECKS_USER`

  A conta de usuário que fornece o contexto de segurança para o canal (opção `CHANGE REPLICATION SOURCE TO`: `PRIVILEGE_CHECKS_USER`, opção `CHANGE MASTER TO`: `PRIVILEGE_CHECKS_USER`). Isso é escapado para que possa ser copiado em uma instrução SQL para executar transações individuais. Consulte a Seção 19.3.3, “Verificação de Privilégios de Replicação” para obter mais informações.

- `REQUIRE_ROW_FORMAT`

  Se o canal aceita apenas eventos baseados em linhas (opção `CHANGE REPLICATION SOURCE TO`: `REQUIRE_ROW_FORMAT`, opção `CHANGE MASTER TO`: `REQUIRE_ROW_FORMAT`). Consulte a Seção 19.3.3, “Verificação de privilégios de replicação” para obter mais informações.

- `REQUIRE_TABLE_PRIMARY_KEY_CHECK`

  Se o canal exige chaves primárias sempre, nunca ou de acordo com a configuração da fonte (opção `CHANGE REPLICATION SOURCE TO`: `REQUIRE_TABLE_PRIMARY_KEY_CHECK`, opção `CHANGE MASTER TO`: `REQUIRE_TABLE_PRIMARY_KEY_CHECK`). Consulte a Seção 19.3.3, “Verificação de privilégios de replicação” para obter mais informações.

- `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS_TYPE`

  Se o canal atribuir um GTID às transações replicadas que ainda não possuem um (opção `CHANGE REPLICATION SOURCE TO`): `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`, opção `CHANGE MASTER TO`: `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`. `OFF` significa que nenhum GTID é atribuído. `LOCAL` significa que um GTID é atribuído que inclui o próprio UUID da replica (a configuração `server_uuid`). `UUID` significa que um GTID é atribuído que inclui um UUID definido manualmente. Consulte a Seção 19.1.3.6, “Replicação de uma Fonte Sem GTIDs para uma Replicação com GTIDs”, para obter mais informações.

- `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS_VALUE`

  O UUID que é usado como parte dos GTIDs atribuídos a transações anônimas (opção `CHANGE REPLICATION SOURCE TO`: `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`, opção `CHANGE MASTER TO`: `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`). Consulte a Seção 19.1.3.6, “Replicação de uma Fonte Sem GTIDs para uma Replicação com GTIDs”, para obter mais informações.

A tabela `replication_applier_configuration` tem esses índices:

- Chave primária em (`CHANNEL_NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `replication_applier_configuration`.

A tabela a seguir mostra a correspondência entre as colunas `replication_applier_configuration` e as colunas `SHOW REPLICA STATUS`.

<table summary="Correspondência entre as colunas replication_applier_configuration e as colunas SHOW REPLICA STATUS"><thead><tr> <th>[[<code>replication_applier_configuration</code>]] Coluna</th> <th>[[<code>SHOW REPLICA STATUS</code>]] Coluna</th> </tr></thead><tbody><tr> <td>[[<code>DESIRED_DELAY</code>]]</td> <td>[[<code>SQL_Delay</code>]]</td> </tr></tbody></table>
