#### 25.12.11.2 Tabela replication_connection_status

Esta tabela mostra o status atual da thread de I/O de replicação que lida com a conexão da réplica com a fonte.

Em comparação com a tabela `replication_connection_configuration`, a tabela `replication_connection_status` muda com mais frequência. Ela contém valores que mudam durante a conexão, enquanto a tabela `replication_connection_configuration` contém valores que definem como a replica se conecta à fonte e que permanecem constantes durante a conexão.

A tabela `replication_connection_status` tem as seguintes colunas:

- `NOME_CANAL`

  O canal de replicação que esta linha está exibindo. Há sempre um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte Seção 16.2.2, “Canais de Replicação” para obter mais informações.

- `NOME_GRUPO`

  Se este servidor for membro de um grupo, mostra o nome do grupo ao qual o servidor pertence.

- `SOURCE_UUID`

  O valor [`server_uuid`](https://pt.wikipedia.org/wiki/Replicação_de_servidor#sysvar_server_uuid) da fonte.

- `THREAD_ID`

  O ID da thread de E/S.

- `ESTADO_SERVIÇO`

  `ON` (o tópico existe e está ativo ou em espera), `OFF` (o tópico não existe mais) ou `CONNECTING` (o tópico existe e está se conectando à fonte).

- `RECEBIDO_SET_DE_TRANSACÇÕES`

  O conjunto de IDs de transações globais (GTIDs) correspondentes a todas as transações recebidas por esta réplica. Vazio se os GTIDs não estiverem em uso. Consulte GTID Sets para obter mais informações.

- `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

  O número do erro e a mensagem de erro do erro mais recente que causou o bloqueio da thread de E/S. Um número de erro de 0 e uma mensagem de uma string vazia significam “sem erro”. Se o valor `LAST_ERROR_MESSAGE` não estiver vazio, os valores do erro também aparecem no log de erro da replica.

  A emissão de `RESET MASTER` ou `RESET SLAVE` redefiniu os valores exibidos nessas colunas.

- `LAST_ERROR_TIMESTAMP`

  Um timestamp no formato *`YYMMDD hh:mm:ss`* que mostra quando ocorreu o último erro de E/S.

- `LAST_HEARTBEAT_TIMESTAMP`

  Um timestamp no formato *`YYMMDD hh:mm:ss`* que indica quando o sinal de batida de coração mais recente foi recebido por uma réplica.

- `CONTAR_BATIDAS_CARDÍACAS_RECEBIDAS`

  O número total de sinais de batimento cardíaco que uma réplica recebeu desde a última vez que foi reiniciada ou quando uma declaração `CHANGE MASTER TO` foi emitida.

A operação `TRUNCATE TABLE` não é permitida para a tabela `replication_connection_status`.

A tabela a seguir mostra a correspondência entre as colunas de `replication_connection_status` e as colunas de `SHOW SLAVE STATUS`.

<table summary="Correspondência entre as colunas replication_connection_status e SHOW SLAVE STATUS"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th>PH_HTML_CODE_<code>Last_IO_Errno</code>] Coluna</th> <th>PH_HTML_CODE_<code>Last_IO_Errno</code>] Coluna</th> </tr></thead><tbody><tr> <td>PH_HTML_CODE_<code>Last_IO_Error</code>]</td> <td>PH_HTML_CODE_<code>LAST_ERROR_TIMESTAMP</code>]</td> </tr><tr> <td>PH_HTML_CODE_<code>Last_IO_Error_Timestamp</code>]</td> <td>Nenhum</td> </tr><tr> <td><code>SERVICE_STATE</code></td> <td><code>Slave_IO_Running</code></td> </tr><tr> <td><code>RECEIVED_TRANSACTION_SET</code></td> <td><code>Retrieved_Gtid_Set</code></td> </tr><tr> <td><code>LAST_ERROR_NUMBER</code></td> <td><code>Last_IO_Errno</code></td> </tr><tr> <td><code>SHOW SLAVE STATUS</code><code>Last_IO_Errno</code>]</td> <td><code>Last_IO_Error</code></td> </tr><tr> <td><code>LAST_ERROR_TIMESTAMP</code></td> <td><code>Last_IO_Error_Timestamp</code></td> </tr></tbody></table>
