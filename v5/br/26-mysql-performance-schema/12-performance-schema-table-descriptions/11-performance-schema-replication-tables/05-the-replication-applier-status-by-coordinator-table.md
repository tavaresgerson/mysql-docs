#### 25.12.11.5 Tabela replication_applier_status_by_coordinator

Para uma replica multithreading, a replica usa vários threads de trabalhador e um thread de coordenador para gerenciá-los, e esta tabela mostra o status do thread de coordenador. Para uma replica de único thread, esta tabela está vazia. Para uma replica multithreading, a tabela `replication_applier_status_by_worker` mostra o status dos threads de trabalhador.

A tabela `replication_applier_status_by_coordinator` tem as seguintes colunas:

- `NOME_CANAL`

  O canal de replicação que esta linha está exibindo. Há sempre um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte Seção 16.2.2, “Canais de Replicação” para obter mais informações.

- `THREAD_ID`

  O ID do fio do coordenador SQL.

- `ESTADO_SERVIÇO`

  `ON` (o tópico existe e está ativo ou em espera) ou `OFF` (o tópico não existe mais).

- `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

  O número do erro e a mensagem de erro do erro mais recente que causou o término do thread SQL/coordenador. Um número de erro de 0 e uma mensagem que é uma string vazia significa “sem erro”. Se o valor `LAST_ERROR_MESSAGE` não estiver vazio, os valores do erro também aparecem no log de erro da replica.

  A emissão de `RESET MASTER` ou `RESET SLAVE` redefiniu os valores exibidos nessas colunas.

  Todos os códigos de erro e mensagens exibidos nas colunas `LAST_ERROR_NUMBER` e `LAST_ERROR_MESSAGE` correspondem aos valores de erro listados em Referência de Mensagem de Erro do Servidor.

- `LAST_ERROR_TIMESTAMP`

  Um timestamp no formato *`YYMMDD hh:mm:ss`* que mostra quando ocorreu o erro SQL/coordenador mais recente.

A operação `TRUNCATE TABLE` não é permitida para a tabela `replication_applier_status_by_coordinator`.

A tabela a seguir mostra a correspondência entre as colunas de `replication_applier_status_by_coordinator` e as colunas de `SHOW SLAVE STATUS`.

<table summary="Correspondência entre as colunas replication_applier_status_by_coordinator e as colunas SHOW SLAVE STATUS"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th>[[PH_HTML_CODE_<code>Last_SQL_Error_Timestamp</code>] Coluna</th> <th>[[PH_HTML_CODE_<code>Last_SQL_Error_Timestamp</code>] Coluna</th> </tr></thead><tbody><tr> <td>[[<code>THREAD_ID</code>]]</td> <td>Nenhum</td> </tr><tr> <td>[[<code>SERVICE_STATE</code>]]</td> <td>[[<code>Slave_SQL_Running</code>]]</td> </tr><tr> <td>[[<code>LAST_ERROR_NUMBER</code>]]</td> <td>[[<code>Last_SQL_Errno</code>]]</td> </tr><tr> <td>[[<code>LAST_ERROR_MESSAGE</code>]]</td> <td>[[<code>Last_SQL_Error</code>]]</td> </tr><tr> <td>[[<code>LAST_ERROR_TIMESTAMP</code>]]</td> <td>[[<code>Last_SQL_Error_Timestamp</code>]]</td> </tr></tbody></table>
