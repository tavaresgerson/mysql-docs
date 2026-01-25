#### 25.12.11.4 A Tabela replication_applier_status

Esta tabela mostra o status atual de execução geral das transações na replica. A tabela fornece informações sobre aspectos gerais do status do *applier* de transações que não são específicos de nenhum Thread envolvido. Informações de status específicas de Thread estão disponíveis na tabela [`replication_applier_status_by_coordinator`](performance-schema-replication-applier-status-by-coordinator-table.html "25.12.11.5 A Tabela replication_applier_status_by_coordinator") (e [`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "25.12.11.6 A Tabela replication_applier_status_by_worker") se a replica for multithreaded).

A tabela [`replication_applier_status`](performance-schema-replication-applier-status-table.html "25.12.11.4 A Tabela replication_applier_status") possui estas colunas:

* `CHANNEL_NAME`

  O canal de Replication que esta linha está exibindo. Há sempre um canal de Replication padrão, e mais canais de Replication podem ser adicionados. Consulte [Seção 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels") para mais informações.

* `SERVICE_STATE`

  Mostra `ON` quando os Threads *applier* do canal de Replication estão ativos ou inativos (*idle*), `OFF` significa que os Threads *applier* não estão ativos.

* `REMAINING_DELAY`

  Se a replica estiver esperando que `DESIRED_DELAY` segundos se passem desde que a source aplicou um evento, este campo contém o número de segundos de atraso restantes. Em outros momentos, este campo é `NULL`. (O valor de `DESIRED_DELAY` é armazenado na tabela [`replication_applier_configuration`](performance-schema-replication-applier-configuration-table.html "25.12.11.3 A Tabela replication_applier_configuration").)

* `COUNT_TRANSACTIONS_RETRIES`

  Mostra o número de tentativas (*retries*) que foram feitas porque o Thread SQL de Replication falhou ao aplicar uma transação. O número máximo de retries para uma determinada transação é definido pela variável de sistema [`slave_transaction_retries`](replication-options-replica.html#sysvar_slave_transaction_retries).

O [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") não é permitido para a tabela [`replication_applier_status`](performance-schema-replication-applier-status-table.html "25.12.11.4 A Tabela replication_applier_status").

A tabela a seguir mostra a correspondência entre as colunas de [`replication_applier_status`](performance-schema-replication-applier-status-table.html "25.12.11.4 A Tabela replication_applier_status") e as colunas de [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement").

<table summary="Correspondência entre as colunas replication_applier_status e as colunas SHOW SLAVE STATUS"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th>Coluna <code>replication_applier_status</code></th> <th>Coluna <code>SHOW SLAVE STATUS</code></th> </tr></thead><tbody><tr> <td><code>SERVICE_STATE</code></td> <td>Nenhum</td> </tr><tr> <td><code>REMAINING_DELAY</code></td> <td><code>SQL_Remaining_Delay</code></td> </tr></tbody></table>