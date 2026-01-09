#### 29.12.11.9 A tabela `replication\_applier\_status\_by\_worker`

Esta tabela fornece detalhes das transações manipuladas pelos threads de aplicador em um membro de um grupo de replicação ou de um grupo de replicação em grupo. Para uma replica com um único thread, os dados são mostrados para o único thread de aplicador da replica. Para uma replica com múltiplos threads, os dados são mostrados individualmente para cada thread de aplicador. Os threads de aplicador em uma replica com múltiplos threads são às vezes chamados de trabalhadores. O número de threads de aplicador em um membro de uma replica ou de um grupo de replicação em grupo é definido pela variável de sistema `replica_parallel_workers`. Uma replica com múltiplos threads também tem um thread coordenador para gerenciar os threads de aplicador, e o status deste thread é mostrado na tabela `replication_applier_status_by_coordinator`.

Todos os códigos de erro e mensagens exibidas nas colunas relacionadas a erros correspondem aos valores de erro listados na Referência de Mensagem de Erro do Servidor.

Quando o Schema de Desempenho é desativado, as informações de temporização local não são coletadas, portanto, os campos que mostram os timestamps de início e fim para as transações aplicadas são zero. Os timestamps de início nesta tabela referem-se ao momento em que o trabalhador começou a aplicar o primeiro evento, e os timestamps de fim referem-se ao momento em que o último evento da transação foi aplicado.

Quando uma replica é reiniciada por uma declaração `START REPLICA`, as colunas que começam com `APPLYING_TRANSACTION` são redefinidas.

A tabela `replication_applier_status_by_worker` tem essas colunas:

* `CHANNEL_NAME`

  O canal de replicação que esta linha está exibindo. Há sempre um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Veja a Seção 19.2.2, “Canais de Replicação” para mais informações.

* `WORKER_ID`

O identificador do trabalhador (mesmo valor que a coluna `id` na tabela `mysql.slave_worker_info`). Após `STOP REPLICA`, a coluna `THREAD_ID` torna-se `NULL`, mas o valor do `WORKER_ID` é preservado.

* `THREAD_ID`

  O ID do thread do trabalhador.

* `SERVICE_STATE`

  `ON` (o thread existe e está ativo ou em espera) ou `OFF` (o thread não existe mais).

* `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

  O número do erro e a mensagem de erro do erro mais recente que causou o término do thread do trabalhador. Um número de erro de 0 e uma mensagem de erro da string vazia significam “sem erro”. Se o valor de `LAST_ERROR_MESSAGE` não estiver vazio, os valores de erro também aparecem no log de erro da replica.

  A emissão de `RESET BINARY LOGS AND GTIDS` ou `RESET REPLICA` redefiniu os valores exibidos nessas colunas.

* `LAST_ERROR_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando ocorreu o erro mais recente do trabalhador.

* `LAST_APPLIED_TRANSACTION`

  O ID de transação global (GTID) da última transação aplicada por este trabalhador.

* `LAST_APPLIED_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação aplicada por este trabalhador foi comprometida na fonte original.

* `LAST_APPLIED_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a última transação aplicada por este trabalhador foi comprometida na fonte imediata.

* `LAST_APPLIED_TRANSACTION_START_APPLY_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando este trabalhador começou a aplicar a última transação aplicada.

* `LAST_APPLIED_TRANSACTION_END_APPLY_TIMESTAMP`

Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando esse trabalhador terminou de aplicar a última transação aplicada.

* `APLICANDO_TRANSACAO`

  O ID global da transação (GTID) da transação que esse trabalhador está aplicando atualmente.

* `APLICANDO_TRANSACAO_TIMESTAMP_ORIGINAL_COMMIT`

  Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a transação que esse trabalhador está aplicando atualmente foi comprometida na fonte original.

* `APLICANDO_TRANSACAO_TIMESTAMP_COMMIT_IMMEDIATO`

  Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando a transação que esse trabalhador está aplicando atualmente foi comprometida na fonte imediata.

* `APLICANDO_TRANSACAO_TIMESTAMP_INICIAL_APLICACAO`

  Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` que mostra quando esse trabalhador iniciou sua primeira tentativa de aplicar a transação que está sendo aplicada atualmente.

* `CONTADOR_DE_REPROVAS_DE_TRANSACAO_APLICADA_POR_ULTIMA_VEZ`

  O número de vezes que a última transação aplicada foi reprobada pelo trabalhador após a primeira tentativa. Se a transação foi aplicada na primeira tentativa, esse número é zero.

* `CONTADOR_DE_ERROS_TRANSITÓRIOS_DE_TRANSACAO_APLICADA_POR_ULTIMA_VEZ`

  O número de erro do último erro transitório que causou a reprovação da transação.

* `TEXTO_DE_ERRO_TRANSITÓRIO_DE_TRANSACAO_APLICADA_POR_ULTIMA_VEZ`

  O texto do erro transitório que causou a reprovação da transação.

* `TIMESTAMP_DE_ERRO_TRANSITÓRIO_DE_TRANSACAO_APLICADA_POR_ULTIMA_VEZ`

  Um marcador de tempo no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` para o último erro transitório que causou a reprovação da transação.

* `CONTADOR_DE_REPROVAS_DE_APLICACAO_TRANSACAO`

O número de vezes que a transação que está sendo aplicada foi retente até este momento. Se a transação foi aplicada na primeira tentativa, este número é zero.

* `APPLYING_TRANSACTION_LAST_TRANSIENT_ERROR_NUMBER`

  O número de erro do último erro transitório que causou a retente da transação atual.

* `APPLYING_TRANSACTION_LAST_TRANSIENT_ERROR_MESSAGE`

  O texto da mensagem para o último erro transitório que causou a retente da transação atual.

* `APPLYING_TRANSACTION_LAST_TRANSIENT_ERROR_TIMESTAMP`

  Um timestamp no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'` para o último erro transitório que causou a retente da transação atual.

A tabela `replication_applier_status_by_worker` tem esses índices:

* Chave primária em (`CHANNEL_NAME`, `WORKER_ID`)

* Índice em (`THREAD_ID`)

A tabela a seguir mostra a correspondência entre as colunas `replication_applier_status_by_worker` e as colunas `SHOW REPLICA STATUS`.

<table summary="Correspondência entre as colunas replication_applier_status_by_worker e as colunas SHOW REPLICA STATUS"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code>replication_applier_status_by_worker</code> Coluna</th> <th><code>SHOW REPLICA STATUS</code> Coluna</th> </tr></thead><tbody><tr> <td><code>WORKER_ID</code></td> <td>Nenhum</td> </tr><tr> <td><code>THREAD_ID</code></td> <td>Nenhum</td> </tr><tr> <td><code>SERVICE_STATE</code></td> <td>Nenhum</td> </tr><tr> <td><code>LAST_ERROR_NUMBER</code></td> <td><code>Last_SQL_Errno</code></td> </tr><tr> <td><code>LAST_ERROR_MESSAGE</code></td> <td><code>Last_SQL_Error</code></td> </tr><tr> <td><code>LAST_ERROR_TIMESTAMP</code></td> <td><code>Last_SQL_Error_Timestamp</code></td> </tr></tbody></table>