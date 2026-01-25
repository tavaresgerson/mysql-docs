#### 25.12.11.6 A Tabela replication_applier_status_by_worker

Se a réplica não for multithreaded, esta tabela mostra o status do `applier thread`. Caso contrário, a réplica usa múltiplos `worker threads` e um `coordinator thread` para gerenciá-los, e esta tabela mostra o status dos `worker threads`. Para uma réplica multithreaded, a tabela [`replication_applier_status_by_coordinator`](performance-schema-replication-applier-status-by-coordinator-table.html "25.12.11.5 A Tabela replication_applier_status_by_coordinator") mostra o status do `coordinator thread`.

A tabela `replication_applier_status_by_worker` possui as seguintes colunas:

* `CHANNEL_NAME`

  O `replication channel` que esta linha está exibindo. Sempre há um `replication channel` padrão, e mais `replication channels` podem ser adicionados. Consulte [Seção 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels") para mais informações.

* `WORKER_ID`

  O identificador do `worker` (o mesmo valor da coluna `id` na tabela `mysql.slave_worker_info`). Após [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement"), a coluna `THREAD_ID` se torna `NULL`, mas o valor de `WORKER_ID` é preservado.

* `THREAD_ID`

  O identificador do `worker thread`.

* `SERVICE_STATE`

  `ON` (`thread` existe e está ativo ou ocioso) ou `OFF` (`thread` não existe mais).

* `LAST_SEEN_TRANSACTION`

  A transação que o `worker` viu pela última vez. O `worker` não a aplicou necessariamente, pois ainda pode estar em processo de fazê-lo.

  Se o valor da variável de sistema [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) for `OFF`, esta coluna é `ANONYMOUS`, indicando que as transações não possuem `global transaction identifiers` (GTIDs) e são identificadas apenas por arquivo e posição.

  Se [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) for `ON`, o valor da coluna é definido da seguinte forma:

  + Se nenhuma transação foi executada, a coluna está vazia.
  + Quando uma transação é executada, a coluna é definida a partir de [`gtid_next`](replication-options-gtids.html#sysvar_gtid_next) assim que [`gtid_next`](replication-options-gtids.html#sysvar_gtid_next) é definido. A partir deste momento, a coluna sempre exibe um GTID.

  + O GTID é preservado até que a próxima transação seja executada. Se ocorrer um erro, o valor da coluna é o GTID da transação que estava sendo executada pelo `worker` quando o erro ocorreu. A seguinte instrução mostra se essa transação foi ou não commitada:

    ```sql
    SELECT GTID_SUBSET(LAST_SEEN_TRANSACTION, @@GLOBAL.GTID_EXECUTED)
    FROM performance_schema.replication_applier_status_by_worker;
    ```

    Se a instrução retornar zero, a transação ainda não foi commitada, seja porque ainda está sendo processada, ou porque o `worker thread` foi parado enquanto estava sendo processada. Se a instrução retornar um valor diferente de zero, a transação foi commitada.

* `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

  O número do erro e a mensagem de erro do erro mais recente que fez com que o `worker thread` parasse. Um número de erro 0 e uma mensagem de string vazia significam "nenhum erro". Se o valor de `LAST_ERROR_MESSAGE` não estiver vazio, os valores de erro também aparecem no `error log` da réplica.

  A emissão de [`RESET MASTER`](reset-master.html "13.4.1.2 RESET MASTER Statement") ou [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") redefine os valores exibidos nestas colunas.

  Todos os códigos de erro e mensagens exibidos nas colunas `LAST_ERROR_NUMBER` e `LAST_ERROR_MESSAGE` correspondem aos valores de erro listados na [Server Error Message Reference](/doc/mysql-errors/5.7/en/server-error-reference.html).

* `LAST_ERROR_TIMESTAMP`

  Um `timestamp` no formato *`YYMMDD hh:mm:ss`* que mostra quando o erro do `worker` mais recente ocorreu.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") não é permitido para a tabela [`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "25.12.11.6 A Tabela replication_applier_status_by_worker").

A tabela a seguir mostra a correspondência entre as colunas de `replication_applier_status_by_worker` e as colunas de [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement").

<table summary="Correspondência entre as colunas de replication_applier_status_by_worker e as colunas de SHOW SLAVE STATUS"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th>Coluna <code>replication_applier_status_by_worker</code></th> <th>Coluna <code>SHOW SLAVE STATUS</code></th> </tr></thead><tbody><tr> <td><code>WORKER_ID</code></td> <td>None</td> </tr><tr> <td><code>THREAD_ID</code></td> <td>None</td> </tr><tr> <td><code>SERVICE_STATE</code></td> <td>None</td> </tr><tr> <td><code>LAST_SEEN_TRANSACTION</code></td> <td>None</td> </tr><tr> <td><code>LAST_ERROR_NUMBER</code></td> <td><code>Last_SQL_Errno</code></td> </tr><tr> <td><code>LAST_ERROR_MESSAGE</code></td> <td><code>Last_SQL_Error</code></td> </tr><tr> <td><code>LAST_ERROR_TIMESTAMP</code></td> <td><code>Last_SQL_Error_Timestamp</code></td> </tr></tbody></table>