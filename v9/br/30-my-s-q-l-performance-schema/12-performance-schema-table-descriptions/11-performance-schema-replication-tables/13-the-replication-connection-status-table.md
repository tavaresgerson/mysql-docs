#### 29.12.11.13 A tabela `replication\_connection\_status`

Esta tabela mostra o status atual da thread de I/O que lida com a conexão da réplica com a fonte, informações sobre a última transação enfileirando-se no log de retransmissão e informações sobre a transação atualmente enfileirando-se no log de retransmissão.

Comparada à tabela `replication_connection_configuration`, a `replication_connection_status` muda com mais frequência. Ela contém valores que mudam durante a conexão, enquanto a `replication_connection_configuration` contém valores que definem como a réplica se conecta à fonte e que permanecem constantes durante a conexão.

A tabela `replication_connection_status` tem as seguintes colunas:

* `CHANNEL_NAME`

  O canal de replicação que esta linha está exibindo. Há sempre um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Veja a Seção 19.2.2, “Canais de Replicação” para mais informações.

* `GROUP_NAME`

  Se este servidor é membro de um grupo, mostra o nome do grupo ao qual o servidor pertence.

* `SOURCE_UUID`

  O valor `server_uuid` da fonte.

* `THREAD_ID`

  O ID da thread de I/O.

* `SERVICE_STATE`

  `ON` (a thread existe e está ativa ou em espera), `OFF` (a thread não existe mais) ou `CONNECTING` (a thread existe e está se conectando à fonte).

* `RECEIVED_TRANSACTION_SET`

  O conjunto de IDs de transações globais (GTIDs) correspondentes a todas as transações recebidas por esta réplica. Vazio se os GTIDs não estiverem em uso. Veja Conjuntos de GTIDs para mais informações.

* `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

O número de erro e a mensagem de erro do erro mais recente que causou o término da thread de E/S. Um número de erro de 0 e uma mensagem de string vazia significam “sem erro”. Se o valor de `LAST_ERROR_MESSAGE` não estiver vazio, os valores de erro também aparecem no log de erro da replica.

A emissão de `RESET BINARY LOGS AND GTIDS` ou `RESET REPLICA` redefiniu os valores exibidos nessas colunas.

* `LAST_ERROR_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando o erro de E/S mais recente ocorreu.

* `LAST_HEARTBEAT_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando o sinal de batida de coração mais recente foi recebido por uma replica.

* `COUNT_RECEIVED_HEARTBEATS`

  O número total de sinais de batida de coração que uma replica recebeu desde a última vez que foi reiniciada ou o comando `CHANGE REPLICATION SOURCE TO` foi emitido.

* `LAST_QUEUED_TRANSACTION`

  O ID de transação global (GTID) da última transação que foi colocada na fila do log de retransmissão.

* `LAST_QUEUED_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação colocada na fila do log de retransmissão foi comprometida na fonte original.

* `LAST_QUEUED_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação colocada na fila do log de retransmissão foi comprometida na fonte imediata.

* `LAST_QUEUED_TRANSACTION_START_QUEUE_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação foi colocada na fila da retransmissão por essa thread de E/S.

* `LAST_QUEUED_TRANSACTION_END_QUEUE_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que indica quando a última transação foi colocada na fila dos arquivos de log do retransmissor.

* `QUEUEING_TRANSACTION`

  O ID global da transação (GTID) da transação atualmente na fila no log do retransmissor.

* `QUEUEING_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP`

  Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que indica quando a transação atualmente na fila foi comprometida na fonte original.

* `QUEUEING_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP`

  Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que indica quando a transação atualmente na fila foi comprometida na fonte imediata.

* `QUEUEING_TRANSACTION_START_QUEUE_TIMESTAMP`

  Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que indica quando o primeiro evento da transação atualmente na fila foi escrito no log do retransmissor por este fio de E/S.

Quando o Schema de Desempenho é desativado, as informações de temporização locais não são coletadas, portanto, os campos que mostram os marcadores de tempo de início e fim das transações em fila são zero.

A tabela `replication_connection_status` tem esses índices:

* Chave primária em (`CHANNEL_NAME`)
* Índice em (`THREAD_ID`)

A tabela a seguir mostra a correspondência entre as colunas `replication_connection_status` e as colunas `SHOW REPLICA STATUS`.

<table summary="Correspondência entre as colunas `replication_connection_status` e `SHOW REPLICA STATUS`">
<col style="width: 60%"/><col style="width: 40%"/>
<thead><tr>
<th><code>replication_connection_status</code></th>
<th><code>SHOW REPLICA STATUS</code></th>
</tr></thead>
<tbody>
<tr>
<td><code>SOURCE_UUID</code></td>
<td><code>Master_UUID</code></td>
</tr>
<tr>
<td><code>THREAD_ID</code></td>
<td>Nenhum</td>
</tr>
<tr>
<td><code>SERVICE_STATE</code></td>
<td><code>Replica_IO_Running</code></td>
</tr>
<tr>
<td><code>RECEIVED_TRANSACTION_SET</code></td>
<td><code>Retrieved_Gtid_Set</code></td>
</tr>
<tr>
<td><code>LAST_ERROR_NUMBER</code></td>
<td><code>Last_IO_Errno</code></td>
</tr>
<tr>
<td><code>LAST_ERROR_MESSAGE</code></td>
<td><code>Last_IO_Error</code></td>
</tr>
<tr>
<td><code>LAST_ERROR_TIMESTAMP</code></td>
<td><code>Last_IO_Error_Timestamp</code></td>
</tr>
</tbody></table>