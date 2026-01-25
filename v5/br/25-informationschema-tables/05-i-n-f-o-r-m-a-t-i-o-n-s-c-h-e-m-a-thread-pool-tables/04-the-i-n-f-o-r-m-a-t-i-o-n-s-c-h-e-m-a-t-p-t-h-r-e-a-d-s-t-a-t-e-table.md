### 24.5.4 A Tabela TP_THREAD_STATE do INFORMATION_SCHEMA

A tabela [`TP_THREAD_STATE`](information-schema-tp-thread-state-table.html "24.5.4 The INFORMATION_SCHEMA TP_THREAD_STATE Table") possui uma linha por `thread` criada pelo `thread pool` para manipular conexões.

A tabela [`TP_THREAD_STATE`](information-schema-tp-thread-state-table.html "24.5.4 The INFORMATION_SCHEMA TP_THREAD_STATE Table") possui estas colunas:

* `TP_GROUP_ID`

  O ID do grupo de `thread`.

* `TP_THREAD_NUMBER`

  O ID da `thread` dentro do seu grupo de `thread`. `TP_GROUP_ID` e `TP_THREAD_NUMBER` juntos fornecem uma `key` única dentro da tabela.

* `PROCESS_COUNT`

  O intervalo de 10ms no qual o *statement* que utiliza esta `thread` está sendo executado atualmente. 0 significa que nenhum *statement* está sendo executado, 1 significa que está nos primeiros 10ms, e assim por diante.

* `WAIT_TYPE`

  O tipo de espera (`wait`) da `thread`. `NULL` significa que a `thread` não está bloqueada. Caso contrário, a `thread` está bloqueada por uma chamada a `thd_wait_begin()` e o valor especifica o tipo de espera. As colunas `xxx_WAIT` da tabela [`TP_THREAD_GROUP_STATS`](information-schema-tp-thread-group-stats-table.html "24.5.3 The INFORMATION_SCHEMA TP_THREAD_GROUP_STATS Table") acumulam contagens para cada tipo de espera.

  O valor de `WAIT_TYPE` é uma *string* que descreve o tipo de espera, conforme mostrado na tabela a seguir.

  **Tabela 24.8 Valores de WAIT_TYPE da Tabela TP_THREAD_STATE**

  <table summary="Valores de WAIT_TYPE da tabela TP_THREAD_STATE. A primeira coluna é o tipo de espera. A segunda coluna descreve o tipo de espera."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Tipo de Espera</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>THD_WAIT_SLEEP</code></td> <td>Esperando por *sleep* (espera)</td> </tr><tr> <td><code>THD_WAIT_DISKIO</code></td> <td>Esperando por Disk IO</td> </tr><tr> <td><code>THD_WAIT_ROW_LOCK</code></td> <td>Esperando por `row lock`</td> </tr><tr> <td><code>THD_WAIT_GLOBAL_LOCK</code></td> <td>Esperando por `global lock`</td> </tr><tr> <td><code>THD_WAIT_META_DATA_LOCK</code></td> <td>Esperando por `metadata lock`</td> </tr><tr> <td><code>THD_WAIT_TABLE_LOCK</code></td> <td>Esperando por `table lock`</td> </tr><tr> <td><code>THD_WAIT_USER_LOCK</code></td> <td>Esperando por `user lock`</td> </tr><tr> <td><code>THD_WAIT_BINLOG</code></td> <td>Esperando por `binlog`</td> </tr><tr> <td><code>THD_WAIT_GROUP_COMMIT</code></td> <td>Esperando por `group commit`</td> </tr><tr> <td><code>THD_WAIT_SYNC</code></td> <td>Esperando por `fsync`</td> </tr> </tbody></table>