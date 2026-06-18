#### 29.12.11.11 Tabela replication\_connection\_status

Esta tabela mostra o status atual da thread de E/S que lida com a conexão da réplica com a fonte, informações sobre a última transação enfileirável no log de retransmissão e informações sobre a transação atualmente enfileirável no log de retransmissão.

Comparado à tabela `replication_connection_configuration`, a tabela `replication_connection_status` muda com mais frequência. Ela contém valores que mudam durante a conexão, enquanto a tabela `replication_connection_configuration` contém valores que definem como a replica se conecta à fonte e que permanecem constantes durante a conexão.

A tabela `replication_connection_status` tem essas colunas:

- `CHANNEL_NAME`

  O canal de replicação que esta linha está exibindo. Há sempre um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte a Seção 19.2.2, “Canais de Replicação”, para obter mais informações.

- `GROUP_NAME`

  Se este servidor for membro de um grupo, mostra o nome do grupo ao qual o servidor pertence.

- `SOURCE_UUID`

  O valor `server_uuid` da fonte.

- `THREAD_ID`

  O ID da thread de E/S.

- `SERVICE_STATE`

  `ON` (o tópico existe e está ativo ou em espera), `OFF` (o tópico não existe mais) ou `CONNECTING` (o tópico existe e está se conectando à fonte).

- `RECEIVED_TRANSACTION_SET`

  O conjunto de IDs de transação global (GTIDs) correspondentes a todas as transações recebidas por esta réplica. Vazio se os GTIDs não estiverem em uso. Consulte Conjuntos de GTIDs para obter mais informações.

- `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

  O número do erro e a mensagem de erro do erro mais recente que causou o bloqueio da thread de E/S. Um número de erro de 0 e uma mensagem de string vazia significam “sem erro”. Se o valor `LAST_ERROR_MESSAGE` não estiver vazio, os valores de erro também aparecem no log de erro da replica.

  A emissão de `RESET MASTER` ou `RESET REPLICA` redefiniu os valores exibidos nessas colunas.

- `LAST_ERROR_TIMESTAMP`

  Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando ocorreu o último erro de E/S.

- `LAST_HEARTBEAT_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando o sinal de batida de coração mais recente foi recebido por uma réplica.

- `COUNT_RECEIVED_HEARTBEATS`

  O número total de sinais de batimento cardíaco que uma réplica recebeu desde a última vez que foi reiniciada ou um comunicado `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` foi emitido.

- `LAST_QUEUED_TRANSACTION`

  O ID de transação global (GTID) da última transação que foi colocada na log de retransmissão.

- `LAST_QUEUED_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação enfileirada no log de retransmissão foi confirmada na fonte original.

- `LAST_QUEUED_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação enfileirada no log de retransmissão foi confirmada na fonte imediata.

- `LAST_QUEUED_TRANSACTION_START_QUEUE_TIMESTAMP`

  Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação foi colocada na fila de log de retransmissão por esta thread de E/S.

- `LAST_QUEUED_TRANSACTION_END_QUEUE_TIMESTAMP`

  Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação foi colocada na fila dos arquivos de log do retransmissor.

- `QUEUEING_TRANSACTION`

  O ID de transação global (GTID) da transação atualmente em fila no log de retransmissão.

- `QUEUEING_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a transação atualmente em fila foi comprometida na fonte original.

- `QUEUEING_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a transação atualmente em fila foi confirmada na fonte imediata.

- `QUEUEING_TRANSACTION_START_QUEUE_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando o primeiro evento da transação atualmente em fila foi escrito no log de retransmissão por esta thread de E/S.

Quando o Schema de Desempenho é desativado, as informações de temporização locais não são coletadas, portanto, os campos que mostram os timestamps de início e fim para transações em fila são zero.

A tabela `replication_connection_status` tem esses índices:

- Chave primária em (`CHANNEL_NAME`)
- Índice sobre (`THREAD_ID`)

A tabela a seguir mostra a correspondência entre as colunas `replication_connection_status` e as colunas `SHOW REPLICA STATUS`.

<table summary="Correspondência entre as colunas replication_connection_status e SHOW REPLICA STATUS"><thead><tr> <th>[[PH_HTML_CODE_<code>Last_IO_Errno</code>] Coluna</th> <th>[[PH_HTML_CODE_<code>Last_IO_Errno</code>] Coluna</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>Last_IO_Error</code>]</td> <td>[[PH_HTML_CODE_<code>LAST_ERROR_TIMESTAMP</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>Last_IO_Error_Timestamp</code>]</td> <td>Nenhum</td> </tr><tr> <td>[[<code>SERVICE_STATE</code>]]</td> <td>[[<code>Replica_IO_Running</code>]]</td> </tr><tr> <td>[[<code>RECEIVED_TRANSACTION_SET</code>]]</td> <td>[[<code>Retrieved_Gtid_Set</code>]]</td> </tr><tr> <td>[[<code>LAST_ERROR_NUMBER</code>]]</td> <td>[[<code>Last_IO_Errno</code>]]</td> </tr><tr> <td>[[<code>SHOW REPLICA STATUS</code><code>Last_IO_Errno</code>]</td> <td>[[<code>Last_IO_Error</code>]]</td> </tr><tr> <td>[[<code>LAST_ERROR_TIMESTAMP</code>]]</td> <td>[[<code>Last_IO_Error_Timestamp</code>]]</td> </tr></tbody></table>
