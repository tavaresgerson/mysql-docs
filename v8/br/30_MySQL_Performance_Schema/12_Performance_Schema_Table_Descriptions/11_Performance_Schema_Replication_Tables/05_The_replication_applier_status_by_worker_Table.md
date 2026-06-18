#### 29.12.11.5 Tabela replication\_applier\_status\_by\_worker

Esta tabela fornece detalhes das transações manipuladas pelos threads do aplicador em um membro do grupo de replicação ou de um grupo de replicação por grupo. Para uma replica de um único thread, os dados são mostrados para o único thread do aplicador da replica. Para uma replica de vários threads, os dados são mostrados individualmente para cada thread do aplicador. Os threads do aplicador em uma replica de vários threads são às vezes chamados de trabalhadores. O número de threads do aplicador em uma replica ou em um membro de um grupo de replicação por grupo é definido pela variável de sistema `replica_parallel_workers` ou `slave_parallel_workers`, que é definida como zero para uma replica de um único thread. Uma replica de vários threads também tem um thread coordenador para gerenciar os threads do aplicador, e o status deste thread é mostrado na tabela `replication_applier_status_by_coordinator`.

Todos os códigos de erro e mensagens exibidas nas colunas relacionadas a erros correspondem aos valores de erro listados na Referência de Mensagem de Erro do Servidor.

Quando o Schema de Desempenho é desativado, as informações de temporização locais não são coletadas, portanto, os campos que mostram os timestamps de início e fim para as transações aplicadas são zero. Os timestamps de início nesta tabela referem-se ao momento em que o trabalhador começou a aplicar o primeiro evento, e os timestamps de fim referem-se ao momento em que o último evento da transação foi aplicado.

Quando uma réplica é reiniciada por uma declaração `START REPLICA`, as colunas que começam com `APPLYING_TRANSACTION` são redefinidas. Antes do MySQL 8.0.13, essas colunas não eram redefinidas em uma réplica que estava em modo de execução única, apenas em uma réplica multisserial.

A tabela `replication_applier_status_by_worker` tem essas colunas:

- `CHANNEL_NAME`

  O canal de replicação que esta linha está exibindo. Há sempre um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte a Seção 19.2.2, “Canais de Replicação”, para obter mais informações.

- `WORKER_ID`

  O identificador do trabalhador (mesmo valor que a coluna `id` na tabela `mysql.slave_worker_info`). Após `STOP REPLICA`, a coluna `THREAD_ID` se torna `NULL`, mas o valor de `WORKER_ID` é preservado.

- `THREAD_ID`

  O ID do fio do trabalhador.

- `SERVICE_STATE`

  `ON` (o tópico existe e está ativo ou em espera) ou `OFF` (o tópico não existe mais).

- `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

  O número do erro e a mensagem de erro do erro mais recente que causou o término do thread do trabalhador. Um número de erro de 0 e uma mensagem de string vazia significam “sem erro”. Se o valor `LAST_ERROR_MESSAGE` não estiver vazio, os valores de erro também aparecem no log de erro da replica.

  A emissão de `RESET MASTER` ou `RESET REPLICA` redefiniu os valores exibidos nessas colunas.

- `LAST_ERROR_TIMESTAMP`

  Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando ocorreu o erro mais recente do trabalhador.

- `LAST_APPLIED_TRANSACTION`

  O ID global de transação (GTID) da última transação aplicada por este trabalhador.

- `LAST_APPLIED_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação aplicada por esse trabalhador foi confirmada na fonte original.

- `LAST_APPLIED_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação aplicada por esse trabalhador foi confirmada na fonte imediata.

- `LAST_APPLIED_TRANSACTION_START_APPLY_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando esse trabalhador começou a aplicar a última transação aplicada.

- `LAST_APPLIED_TRANSACTION_END_APPLY_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando esse trabalhador terminou de aplicar a última transação aplicada.

- `APPLYING_TRANSACTION`

  O ID global da transação (GTID) da transação que esse trabalhador está aplicando atualmente.

- `APPLYING_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a transação que este trabalhador está aplicando foi confirmada na fonte original.

- `APPLYING_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a transação que este trabalhador está aplicando foi confirmada na fonte imediata.

- `APPLYING_TRANSACTION_START_APPLY_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando esse trabalhador iniciou sua primeira tentativa de aplicar a transação que está sendo aplicada atualmente. Antes do MySQL 8.0.13, esse timestamp era atualizado quando uma transação era retenteida devido a um erro transitório, então ele mostrava o timestamp da tentativa mais recente de aplicar a transação.

- `LAST_APPLIED_TRANSACTION_RETRIES_COUNT`

  O número de vezes que a última transação aplicada foi retenteida pelo trabalhador após a primeira tentativa. Se a transação foi aplicada na primeira tentativa, esse número é zero.

- `LAST_APPLIED_TRANSACTION_LAST_TRANSIENT_ERROR_NUMBER`

  O número de erro do último erro transitório que causou a repetição da transação.

- `LAST_APPLIED_TRANSACTION_LAST_TRANSIENT_ERROR_MESSAGE`

  O texto da mensagem para o último erro transitório que causou a repetição da transação.

- `LAST_APPLIED_TRANSACTION_LAST_TRANSIENT_ERROR_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` para o último erro transitório que fez com que a transação fosse repetida.

- `APPLYING_TRANSACTION_RETRIES_COUNT`

  O número de vezes que a transação que está sendo aplicada foi retenteida até este momento. Se a transação foi aplicada na primeira tentativa, este número é zero.

- `APPLYING_TRANSACTION_LAST_TRANSIENT_ERROR_NUMBER`

  O número de erro do último erro transitório que causou a repetição da transação atual.

- `APPLYING_TRANSACTION_LAST_TRANSIENT_ERROR_MESSAGE`

  O texto da mensagem para o último erro transitório que causou a repetição da transação atual.

- `APPLYING_TRANSACTION_LAST_TRANSIENT_ERROR_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` para o último erro transitório que causou a repetição da transação atual.

A tabela `replication_applier_status_by_worker` tem esses índices:

- Chave primária em (`CHANNEL_NAME`, `WORKER_ID`)

- Índice sobre (`THREAD_ID`)

A tabela a seguir mostra a correspondência entre as colunas `replication_applier_status_by_worker` e as colunas `SHOW REPLICA STATUS`.

<table summary="Correspondência entre as colunas replication_applier_status_by_worker e as colunas SHOW REPLICA STATUS"><thead><tr> <th>[[PH_HTML_CODE_<code>Last_SQL_Error_Timestamp</code>] Coluna</th> <th>[[PH_HTML_CODE_<code>Last_SQL_Error_Timestamp</code>] Coluna</th> </tr></thead><tbody><tr> <td>[[<code>WORKER_ID</code>]]</td> <td>Nenhum</td> </tr><tr> <td>[[<code>THREAD_ID</code>]]</td> <td>Nenhum</td> </tr><tr> <td>[[<code>SERVICE_STATE</code>]]</td> <td>Nenhum</td> </tr><tr> <td>[[<code>LAST_ERROR_NUMBER</code>]]</td> <td>[[<code>Last_SQL_Errno</code>]]</td> </tr><tr> <td>[[<code>LAST_ERROR_MESSAGE</code>]]</td> <td>[[<code>Last_SQL_Error</code>]]</td> </tr><tr> <td>[[<code>LAST_ERROR_TIMESTAMP</code>]]</td> <td>[[<code>Last_SQL_Error_Timestamp</code>]]</td> </tr></tbody></table>
