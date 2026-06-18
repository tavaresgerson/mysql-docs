#### 29.12.11.4 A tabela replication\_applier\_status\_by\_coordinator

Para uma replica multithreading, a replica usa vários threads de trabalho e um thread de coordenador para gerenciá-los, e esta tabela mostra o status do thread de coordenador. Para uma replica de único thread, esta tabela está vazia. Para uma replica multithreading, a tabela `replication_applier_status_by_worker` mostra o status dos threads de trabalho. Esta tabela fornece informações sobre a última transação que foi armazenada na fila de um trabalhador pelo thread de coordenador, bem como a transação que está atualmente sendo armazenada. O timestamp de início refere-se ao momento em que este thread leu o primeiro evento da transação do log de retransmissão para armazená-lo na fila de um trabalhador, enquanto o timestamp de fim refere-se ao momento em que o último evento terminou de ser armazenado na fila de um trabalhador.

A tabela `replication_applier_status_by_coordinator` tem essas colunas:

- `CHANNEL_NAME`

  O canal de replicação que esta linha está exibindo. Há sempre um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte a Seção 19.2.2, “Canais de Replicação”, para obter mais informações.

- `THREAD_ID`

  O ID do fio do coordenador SQL.

- `SERVICE_STATE`

  `ON` (o tópico existe e está ativo ou em espera) ou `OFF` (o tópico não existe mais).

- `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

  O número do erro e a mensagem de erro do erro mais recente que causou o término do thread SQL/coordenador. Um número de erro de 0 e uma mensagem que é uma string vazia significa “sem erro”. Se o valor `LAST_ERROR_MESSAGE` não estiver vazio, os valores de erro também aparecem no log de erro da replica.

  A emissão de `RESET MASTER` ou `RESET REPLICA` redefiniu os valores exibidos nessas colunas.

  Todos os códigos e mensagens de erro exibidos nas colunas `LAST_ERROR_NUMBER` e `LAST_ERROR_MESSAGE` correspondem aos valores de erro listados na Referência de Mensagem de Erro do Servidor.

- `LAST_ERROR_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando ocorreu o erro SQL/coordenador mais recente.

- `LAST_PROCESSED_TRANSACTION`

  O ID global da transação (GTID) da última transação processada por este coordenador.

- `LAST_PROCESSED_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação processada por este coordenador foi confirmada na fonte original.

- `LAST_PROCESSED_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação processada por este coordenador foi confirmada na fonte imediata.

- `LAST_PROCESSED_TRANSACTION_START_BUFFER_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando este fio de coordenador começou a escrever a última transação no buffer de um fio de trabalhador.

- `LAST_PROCESSED_TRANSACTION_END_BUFFER_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação foi escrita no buffer de um thread de trabalhador por este thread de coordenador.

- `PROCESSING_TRANSACTION`

  O ID global da transação (GTID) da transação que este fio de coordenador está processando atualmente.

- `PROCESSING_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a transação atualmente em processamento foi confirmada na fonte original.

- `PROCESSING_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a transação atualmente em processamento foi confirmada na fonte imediata.

- `PROCESSING_TRANSACTION_START_BUFFER_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando este fio de coordenador começou a escrever a transação atualmente processada no buffer de um fio de trabalhador.

Quando o Schema de Desempenho é desativado, as informações de temporização locais não são coletadas, portanto, os campos que mostram os timestamps de início e fim para transações em buffer são zero.

A tabela `replication_applier_status_by_coordinator` tem esses índices:

- Chave primária em (`CHANNEL_NAME`)
- Índice sobre (`THREAD_ID`)

A tabela a seguir mostra a correspondência entre as colunas `replication_applier_status_by_coordinator` e as colunas `SHOW REPLICA STATUS`.

<table summary="Correspondência entre as colunas replication_applier_status_by_coordinator e as colunas SHOW SLAVE STATUS"><thead><tr> <th>[[PH_HTML_CODE_<code>Last_SQL_Error_Timestamp</code>] Coluna</th> <th>[[PH_HTML_CODE_<code>Last_SQL_Error_Timestamp</code>] Coluna</th> </tr></thead><tbody><tr> <td>[[<code>THREAD_ID</code>]]</td> <td>Nenhum</td> </tr><tr> <td>[[<code>SERVICE_STATE</code>]]</td> <td>[[<code>Replica_SQL_Running</code>]]</td> </tr><tr> <td>[[<code>LAST_ERROR_NUMBER</code>]]</td> <td>[[<code>Last_SQL_Errno</code>]]</td> </tr><tr> <td>[[<code>LAST_ERROR_MESSAGE</code>]]</td> <td>[[<code>Last_SQL_Error</code>]]</td> </tr><tr> <td>[[<code>LAST_ERROR_TIMESTAMP</code>]]</td> <td>[[<code>Last_SQL_Error_Timestamp</code>]]</td> </tr></tbody></table>
