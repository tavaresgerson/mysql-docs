#### 25.12.11.2 A Tabela replication_connection_status

Esta tabela mostra o status atual da Thread de I/O de replicação que gerencia a conexão da réplica com a source.

Em comparação com a tabela [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "25.12.11.1 The replication_connection_configuration Table"), [`replication_connection_status`](performance-schema-replication-connection-status-table.html "25.12.11.2 The replication_connection_status Table") muda com mais frequência. Ela contém valores que mudam durante a conexão, enquanto [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "25.12.11.1 The replication_connection_configuration Table") contém valores que definem como a réplica se conecta à source e que permanecem constantes durante a conexão.

A tabela [`replication_connection_status`](performance-schema-replication-connection-status-table.html "25.12.11.2 The replication_connection_status Table") possui as seguintes colunas:

* `CHANNEL_NAME`

  O canal de replicação que esta linha está exibindo. Há sempre um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte [Seção 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels") para mais informações.

* `GROUP_NAME`

  Se este server for um membro de um grupo, mostra o nome do grupo ao qual o server pertence.

* `SOURCE_UUID`

  O valor de [`server_uuid`](replication-options.html#sysvar_server_uuid) da source.

* `THREAD_ID`

  O ID da Thread de I/O.

* `SERVICE_STATE`

  `ON` (a Thread existe e está ativa ou ociosa), `OFF` (a Thread não existe mais), ou `CONNECTING` (a Thread existe e está se conectando à source).

* `RECEIVED_TRANSACTION_SET`

  O conjunto de GTIDs (Global Transaction IDs) correspondente a todas as transactions recebidas por esta réplica. Vazio se GTIDs não estiverem em uso. Consulte [GTID Sets](replication-gtids-concepts.html#replication-gtids-concepts-gtid-sets "GTID Sets") para mais informações.

* `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

  O número de erro e a mensagem de erro do erro mais recente que causou a parada da Thread de I/O. Um número de erro 0 e uma mensagem de string vazia significam “sem erro”. Se o valor de `LAST_ERROR_MESSAGE` não estiver vazio, os valores de erro também aparecem no error log da réplica.

  Executar [`RESET MASTER`](reset-master.html "13.4.1.2 RESET MASTER Statement") ou [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") redefine os valores mostrados nestas colunas.

* `LAST_ERROR_TIMESTAMP`

  Um timestamp no formato *`YYMMDD hh:mm:ss`* que mostra quando ocorreu o erro de I/O mais recente.

* `LAST_HEARTBEAT_TIMESTAMP`

  Um timestamp no formato *`YYMMDD hh:mm:ss`* que mostra quando o sinal de heartbeat mais recente foi recebido por uma réplica.

* `COUNT_RECEIVED_HEARTBEATS`

  O número total de sinais de heartbeat que uma réplica recebeu desde a última vez que foi reiniciada ou redefinida, ou desde que uma instrução `CHANGE MASTER TO` foi emitida.

A instrução [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") não é permitida para a tabela [`replication_connection_status`](performance-schema-replication-connection-status-table.html "25.12.11.2 The replication_connection_status Table").

A tabela a seguir mostra a correspondência entre as colunas de [`replication_connection_status`](performance-schema-replication-connection-status-table.html "25.12.11.2 The replication_connection_status Table") e as colunas de [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement").

<table summary="Correspondência entre colunas replication_connection_status e colunas SHOW SLAVE STATUS"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th>Coluna <code>replication_connection_status</code></th> <th>Coluna <code>SHOW SLAVE STATUS</code></th> </tr></thead><tbody><tr> <td><code>SOURCE_UUID</code></td> <td><code>Master_UUID</code></td> </tr><tr> <td><code>THREAD_ID</code></td> <td>None</td> </tr><tr> <td><code>SERVICE_STATE</code></td> <td><code>Slave_IO_Running</code></td> </tr><tr> <td><code>RECEIVED_TRANSACTION_SET</code></td> <td><code>Retrieved_Gtid_Set</code></td> </tr><tr> <td><code>LAST_ERROR_NUMBER</code></td> <td><code>Last_IO_Errno</code></td> </tr><tr> <td><code>LAST_ERROR_MESSAGE</code></td> <td><code>Last_IO_Error</code></td> </tr><tr> <td><code>LAST_ERROR_TIMESTAMP</code></td> <td><code>Last_IO_Error_Timestamp</code></td> </tr></tbody></table>