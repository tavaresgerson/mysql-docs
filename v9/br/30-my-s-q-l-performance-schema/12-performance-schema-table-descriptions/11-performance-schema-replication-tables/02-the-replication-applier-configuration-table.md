#### 29.12.11.2 Tabela `replication_applier_configuration`

Esta tabela mostra os parâmetros de configuração que afetam as transações aplicadas pela replica. Os parâmetros armazenados na tabela podem ser alterados em tempo de execução com a instrução `CHANGE REPLICATION SOURCE TO`.

A tabela `replication_applier_configuration` tem as seguintes colunas:

* `CHANNEL_NAME`

  O canal de replicação que esta linha está exibindo. Há sempre um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Veja a Seção 19.2.2, “Canais de Replicação” para mais informações.

* `DESIRED_DELAY`

  O número de segundos que a replica deve ficar atrasada em relação à fonte (`opção CHANGE REPLICATION SOURCE TO`: `SOURCE_DELAY`). Veja a Seção 19.4.11, “Replicação Atrasar” para mais informações.

* `PRIVILEGE_CHECKS_USER`

  A conta de usuário que fornece o contexto de segurança para o canal (`opção CHANGE REPLICATION SOURCE TO`: `PRIVILEGE_CHECKS_USER`). Isso é escapado para que possa ser copiado em uma instrução SQL para executar transações individuais. Veja a Seção 19.3.3, “Replicação de Verificação de Privilegios” para mais informações.

* `REQUIRE_ROW_FORMAT`

  Se o canal aceita apenas eventos baseados em linhas (`opção CHANGE REPLICATION SOURCE TO`: `REQUIRE_ROW_FORMAT`). Veja a Seção 19.3.3, “Replicação de Verificação de Privilegios” para mais informações.

* `REQUIRE_TABLE_PRIMARY_KEY_CHECK`

  Se o canal requer chaves primárias sempre, nunca ou de acordo com o ajuste da fonte (`opção CHANGE REPLICATION SOURCE TO`: `REQUIRE_TABLE_PRIMARY_KEY_CHECK`). Veja a Seção 19.3.3, “Replicação de Verificação de Privilegios” para mais informações.

* `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS_TYPE`

Se o canal atribuir um GTID às transações replicadas que ainda não possuem um (`opção CHANGE REPLICATION SOURCE TO`: `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`). `OFF` significa que não são atribuídos GTIDs. `LOCAL` significa que é atribuído um GTID que inclui o UUID próprio da replica (a configuração `server_uuid`). `UUID` significa que é atribuído um GTID que inclui um UUID definido manualmente. Veja a Seção 19.1.3.6, “Replicação a partir de uma fonte sem GTIDs para uma replica com GTIDs”, para obter mais informações.

* `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS_VALUE`

O UUID que é usado como parte dos GTIDs atribuídos às transações anônimas (`opção CHANGE REPLICATION SOURCE TO`: `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`). Veja a Seção 19.1.3.6, “Replicação a partir de uma fonte sem GTIDs para uma replica com GTIDs”, para obter mais informações.

A tabela `replication_applier_configuration` tem esses índices:

* Chave primária em (`CHANNEL_NAME`)

O `TRUNCATE TABLE` não é permitido para a tabela `replication_applier_configuration`.

A tabela a seguir mostra a correspondência entre as colunas da `replication_applier_configuration` e as colunas do `SHOW REPLICA STATUS`.

<table summary="Correspondência entre as colunas da replication_applier_configuration e as colunas do SHOW REPLICA STATUS"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code>replication_applier_configuration</code> Coluna</th> <th><code>SHOW REPLICA STATUS</code> Coluna</th> </tr></thead><tbody><tr> <td><code>DESIRED_DELAY</code></td> <td><code>SQL_Delay</code></td> </tr></tbody></table>