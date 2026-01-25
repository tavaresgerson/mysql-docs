#### 25.12.11.5 A Tabela replication_applier_status_by_coordinator

Para uma réplica *multithreaded*, a réplica usa múltiplos *worker threads* e um *coordinator thread* para gerenciá-los, e esta tabela mostra o status do *coordinator thread*. Para uma réplica *single-threaded*, esta tabela está vazia. Para uma réplica *multithreaded*, a tabela [`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "25.12.11.6 The replication_applier_status_by_worker Table") mostra o status dos *worker threads*.

A tabela [`replication_applier_status_by_coordinator`](performance-schema-replication-applier-status-by-coordinator-table.html "25.12.11.5 The replication_applier_status_by_coordinator Table") possui as seguintes colunas:

* `CHANNEL_NAME`

  O canal de Replication que esta linha está exibindo. Há sempre um canal de Replication padrão, e mais canais de Replication podem ser adicionados. Consulte [Seção 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels") para mais informações.

* `THREAD_ID`

  O ID do SQL/coordinator thread.

* `SERVICE_STATE`

  `ON` (*thread* existe e está ativo ou ocioso) ou `OFF` (*thread* não existe mais).

* `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

  O número e a mensagem do erro mais recente que fez com que o SQL/coordinator thread parasse. Um número de erro 0 e uma mensagem que é uma string vazia significa “sem erro”. Se o valor de `LAST_ERROR_MESSAGE` não estiver vazio, os valores de erro também aparecerão no *error log* da réplica.

  A emissão de [`RESET MASTER`](reset-master.html "13.4.1.2 RESET MASTER Statement") ou [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") redefine (resets) os valores exibidos nestas colunas.

  Todos os códigos de erro e mensagens exibidos nas colunas `LAST_ERROR_NUMBER` e `LAST_ERROR_MESSAGE` correspondem aos valores de erro listados na [Server Error Message Reference](/doc/mysql-errors/5.7/en/server-error-reference.html).

* `LAST_ERROR_TIMESTAMP`

  Um *timestamp* no formato *`YYMMDD hh:mm:ss`* que mostra quando ocorreu o erro SQL/coordinator mais recente.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") não é permitido para a tabela [`replication_applier_status_by_coordinator`](performance-schema-replication-applier-status-by-coordinator-table.html "25.12.11.5 The replication_applier_status_by_coordinator Table").

A tabela a seguir mostra a correspondência entre as colunas de [`replication_applier_status_by_coordinator`](performance-schema-replication-applier-status-by-coordinator-table.html "25.12.11.5 The replication_applier_status_by_coordinator Table") e as colunas de [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement").

<table summary="Correspondência entre as colunas replication_applier_status_by_coordinator e as colunas SHOW SLAVE STATUS"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th>Coluna <code>replication_applier_status_by_coordinator</code></th> <th>Coluna <code>SHOW SLAVE STATUS</code></th> </tr></thead><tbody><tr> <td><code>THREAD_ID</code></td> <td>None</td> </tr><tr> <td><code>SERVICE_STATE</code></td> <td><code>Slave_SQL_Running</code></td> </tr><tr> <td><code>LAST_ERROR_NUMBER</code></td> <td><code>Last_SQL_Errno</code></td> </tr><tr> <td><code>LAST_ERROR_MESSAGE</code></td> <td><code>Last_SQL_Error</code></td> </tr><tr> <td><code>LAST_ERROR_TIMESTAMP</code></td> <td><code>Last_SQL_Error_Timestamp</code></td> </tr></tbody></table>
