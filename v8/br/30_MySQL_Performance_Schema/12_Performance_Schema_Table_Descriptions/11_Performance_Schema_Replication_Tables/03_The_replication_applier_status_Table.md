#### 29.12.11.3 A tabela replication\_applier\_status

Esta tabela mostra o status atual da execução da transação geral na replica. A tabela fornece informações sobre aspectos gerais do status do aplicador de transações que não são específicos de qualquer thread envolvida. Informações de status específicas para cada thread estão disponíveis na tabela `replication_applier_status_by_coordinator` (e `replication_applier_status_by_worker` se a replica for multithread).

A tabela `replication_applier_status` tem essas colunas:

- `CHANNEL_NAME`

  O canal de replicação que esta linha está exibindo. Há sempre um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte a Seção 19.2.2, “Canais de Replicação”, para obter mais informações.

- `SERVICE_STATE`

  Mostra `ON` quando as threads do aplicador do canal de replicação estão ativas ou em repouso, `OFF` significa que as threads do aplicador não estão ativas.

- `REMAINING_DELAY`

  Se a replica estiver aguardando o passar de `DESIRED_DELAY` segundos desde que a fonte aplicou uma transação, este campo contém o número de segundos de atraso restantes. Em outros momentos, este campo é `NULL`. (O valor `DESIRED_DELAY` é armazenado na tabela `replication_applier_configuration`.) Consulte a Seção 19.4.11, “Replicação Atrasar”, para obter mais informações.

- `COUNT_TRANSACTIONS_RETRIES`

  Mostra o número de tentativas de reexecução que foram feitas porque o thread de replicação SQL não conseguiu aplicar uma transação. O número máximo de tentativas para uma transação específica é definido pelas variáveis de sistema `replica_transaction_retries` e `slave_transaction_retries`. A tabela `replication_applier_status_by_worker` mostra informações detalhadas sobre as tentativas de reexecução de transações para uma replica de um único ou múltiplos threads.

A tabela `replication_applier_status` tem esses índices:

- Chave primária em (`CHANNEL_NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `replication_applier_status`.

A tabela a seguir mostra a correspondência entre as colunas `replication_applier_status` e as colunas `SHOW REPLICA STATUS`.

<table summary="Correspondência entre as colunas replication_applier_status e as colunas SHOW REPLICA STATUS"><thead><tr> <th>[[<code>replication_applier_status</code>]] Coluna</th> <th>[[<code>SHOW REPLICA STATUS</code>]] Coluna</th> </tr></thead><tbody><tr> <td>[[<code>SERVICE_STATE</code>]]</td> <td>Nenhum</td> </tr><tr> <td>[[<code>REMAINING_DELAY</code>]]</td> <td>[[<code>SQL_Remaining_Delay</code>]]</td> </tr></tbody></table>
