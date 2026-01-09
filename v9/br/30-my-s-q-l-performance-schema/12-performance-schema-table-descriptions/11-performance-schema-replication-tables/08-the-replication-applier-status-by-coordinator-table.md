#### 29.12.11.8 A tabela `replication\_applier\_status\_by\_coordinator`

Para uma replica multithread, a replica usa vários threads de trabalho e um thread de coordenador para gerenciá-los, e essa tabela mostra o status do thread de coordenador. Para uma replica de único thread, essa tabela está vazia. Para uma replica multithread, a tabela `replication_applier_status_by_worker` mostra o status dos threads de trabalho. Essa tabela fornece informações sobre a última transação que foi armazenada na fila de um trabalhador pelo thread de coordenador, bem como a transação que está sendo armazenada atualmente. O timestamp de início refere-se ao momento em que esse thread leu o primeiro evento da transação do log de retransmissão para armazená-lo na fila de um trabalhador, enquanto o timestamp de fim refere-se ao momento em que o último evento terminou de ser armazenado na fila de um trabalhador.

A tabela `replication_applier_status_by_coordinator` tem essas colunas:

* `CHANNEL_NAME`

  O canal de replicação que essa linha está exibindo. Há sempre um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Veja a Seção 19.2.2, “Canais de Replicação” para mais informações.

* `THREAD_ID`

  O ID do thread SQL/coordenador.

* `SERVICE_STATE`

  `ON` (o thread existe e está ativo ou em espera) ou `OFF` (o thread não existe mais).

* `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

  O número de erro e a mensagem de erro do erro mais recente que causou o término do thread SQL/coordenador. Um número de erro de 0 e uma mensagem que é uma string vazia significa “sem erro”. Se o valor de `LAST_ERROR_MESSAGE` não estiver vazio, os valores de erro também aparecem no log de erro da replica.

Executar `RESET BINARY LOGS AND GTIDS` ou `RESET REPLICA` reinicia os valores exibidos nessas colunas.

Todos os códigos de erro e mensagens exibidos nas colunas `LAST_ERROR_NUMBER` e `LAST_ERROR_MESSAGE` correspondem aos valores de erro listados na Referência de Mensagem de Erro do Servidor.

* `LAST_ERROR_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando ocorreu o último erro SQL/coordenador.

* `LAST_PROCESSED_TRANSACTION`

  O ID global da transação (GTID) da última transação processada por este coordenador.

* `LAST_PROCESSED_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação processada por este coordenador foi comprometida na fonte original.

* `LAST_PROCESSED_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação processada por este coordenador foi comprometida na fonte imediata.

* `LAST_PROCESSED_TRANSACTION_START_BUFFER_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando este thread do coordenador começou a escrever a última transação no buffer de um thread de trabalhador.

* `LAST_PROCESSED_TRANSACTION_END_BUFFER_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação foi escrita no buffer de um thread de trabalhador por este thread do coordenador.

* `PROCESSING_TRANSACTION`

  O ID global da transação (GTID) da transação que este thread do coordenador está processando atualmente.

* `PROCESSING_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a transação atualmente processada foi comprometida na fonte original.

* `PROCESSING_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP`

Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'`, que indica quando a transação atualmente em processamento foi confirmada na fonte imediata.

* `PROCESSING_TRANSACTION_START_BUFFER_TIMESTAMP`

Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'`, que indica quando este thread do coordenador começou a escrever a transação atualmente em processamento no buffer de um thread de trabalhador.

Quando o Schema de Desempenho é desativado, as informações de temporização locais não são coletadas, portanto, os campos que mostram os timestamps de início e fim para transações em buffer são zero.

A tabela `replication_applier_status_by_coordinator` tem esses índices:

* Chave primária em (`CHANNEL_NAME`)
* Índice em (`THREAD_ID`)

A tabela a seguir mostra a correspondência entre as colunas de `replication_applier_status_by_coordinator` e as colunas de `SHOW REPLICA STATUS`.

<table summary="Correspondência entre as colunas de replication_applier_status_by_coordinator e as colunas de SHOW REPLICA STATUS">
<col style="width: 60%"/><col style="width: 40%"/>
<thead>
<tr>
<th><code>replication_applier_status_by_coordinator</code> Coluna</th>
<th><code>SHOW REPLICA STATUS</code> Coluna</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>THREAD_ID</code></td>
<td>Nenhum</td>
</tr>
<tr>
<td><code>SERVICE_STATE</code></td>
<td><code>Replica_SQL_Running</code></td>
</tr>
<tr>
<td><code>LAST_ERROR_NUMBER</code></td>
<td><code>Last_SQL_Errno</code></td>
</tr>
<tr>
<td><code>LAST_ERROR_MESSAGE</code></td>
<td><code>Last_SQL_Error</code></td>
</tr>
<tr>
<td><code>LAST_ERROR_TIMESTAMP</code></td>
<td><code>Last_SQL_Error_Timestamp</code></td>
</tr>
</tbody>
</table>