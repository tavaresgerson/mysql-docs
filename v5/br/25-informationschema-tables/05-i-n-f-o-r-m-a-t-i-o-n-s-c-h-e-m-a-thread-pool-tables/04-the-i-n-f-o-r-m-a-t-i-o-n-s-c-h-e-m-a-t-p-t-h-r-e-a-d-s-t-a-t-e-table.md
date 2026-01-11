### 24.5.4 A tabela INFORMATION_SCHEMA TP_THREAD_STATE

A tabela [`TP_THREAD_STATE`](https://pt.wikipedia.org/wiki/TP_THREAD_STATE) tem uma linha por thread criado pelo pool de threads para lidar com as conexões.

A tabela [`TP_THREAD_STATE`](https://pt.wikipedia.org/wiki/TP_THREAD_STATE) tem as seguintes colunas:

- `TP_GROUP_ID`

  O ID do grupo de fios.

- `TP_THREAD_NUMBER`

  O ID do tópico dentro do seu grupo de tópicos. `TP_GROUP_ID` e `TP_THREAD_NUMBER` juntos fornecem uma chave única na tabela.

- `PROCESSO_CONTADO`

  O intervalo de 10 ms no qual a declaração que usa essa thread está sendo executada atualmente. 0 significa que nenhuma declaração está sendo executada, 1 significa que está nos primeiros 10 ms, e assim por diante.

- `WAIT_TYPE`

  O tipo de espera para o fio. `NULL` significa que o fio não está bloqueado. Caso contrário, o fio está bloqueado por uma chamada a `thd_wait_begin()`, e o valor especifica o tipo de espera. As colunas `xxx_WAIT` da tabela `[TP_THREAD_GROUP_STATS]` (information-schema-tp-thread-group-stats-table.html) acumulam contagens para cada tipo de espera.

  O valor `WAIT_TYPE` é uma string que descreve o tipo de espera, conforme mostrado na tabela a seguir.

  **Tabela 24.8 TP_THREAD_STATE Tabela WAIT_TYPE Valores**

  <table summary="Tabela TP_THREAD_STATE valores WAIT_TYPE. A primeira coluna é o tipo de espera. A segunda coluna descreve o tipo de espera."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Aguarde Tipo</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>THD_WAIT_SLEEP</code></td> <td>Esperando dormir</td> </tr><tr> <td><code>THD_WAIT_DISKIO</code></td> <td>Esperando por IO de disco</td> </tr><tr> <td><code>THD_WAIT_ROW_LOCK</code></td> <td>Esperando por bloqueio de linha</td> </tr><tr> <td><code>THD_WAIT_GLOBAL_LOCK</code></td> <td>Esperando por bloqueio global</td> </tr><tr> <td><code>THD_WAIT_META_DATA_LOCK</code></td> <td>Esperando por bloqueio de metadados</td> </tr><tr> <td><code>THD_WAIT_TABLE_LOCK</code></td> <td>Esperando por bloqueio de mesa</td> </tr><tr> <td><code>THD_WAIT_USER_LOCK</code></td> <td>Esperando por bloqueio do usuário</td> </tr><tr> <td><code>THD_WAIT_BINLOG</code></td> <td>Esperando por binlog</td> </tr><tr> <td><code>THD_WAIT_GROUP_COMMIT</code></td> <td>Esperando pelo commit do grupo</td> </tr><tr> <td><code>THD_WAIT_SYNC</code></td> <td>Esperando por fsync</td> </tr></tbody></table>
