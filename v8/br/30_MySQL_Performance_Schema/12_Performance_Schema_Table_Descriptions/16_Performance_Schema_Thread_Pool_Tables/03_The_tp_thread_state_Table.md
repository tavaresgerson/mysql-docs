#### 29.12.16.3 Tabela tp\_thread\_state

Nota

A tabela Schema de Desempenho descrita aqui está disponível a partir do MySQL 8.0.14. Antes do MySQL 8.0.14, use a tabela correspondente `INFORMATION_SCHEMA`; veja a Seção 28.5.4, “A tabela TP\_THREAD\_STATE do Schema INFORMATION\_SCHEMA”.

A tabela `tp_thread_state` tem uma linha por fio criado pelo pool de threads para lidar com as conexões.

A tabela `tp_thread_state` tem essas colunas:

- `TP_GROUP_ID`

  O ID do grupo de fios.

- `TP_THREAD_NUMBER`

  O ID do tópico dentro do seu grupo de tópicos. `TP_GROUP_ID` e `TP_THREAD_NUMBER` juntos fornecem uma chave única na tabela.

- `PROCESS_COUNT`

  O intervalo de 10 ms no qual a declaração que usa essa thread está sendo executada atualmente. 0 significa que nenhuma declaração está sendo executada, 1 significa que está nos primeiros 10 ms, e assim por diante.

- `WAIT_TYPE`

  O tipo de espera para o fio. `NULL` significa que o fio não está bloqueado. Caso contrário, o fio está bloqueado por uma chamada para `thd_wait_begin()` e o valor especifica o tipo de espera. As colunas `xxx_WAIT` da tabela `tp_thread_group_stats` acumulam contagens para cada tipo de espera.

  O valor `WAIT_TYPE` é uma string que descreve o tipo de espera, conforme mostrado na tabela a seguir.

  **Tabela 29.6 tp\_thread\_state Tabela WAIT\_TYPE Valores**

  <table summary="tabela tp_thread_state valores WAIT_TYPE. A primeira coluna é o tipo de espera. A segunda coluna descreve o tipo de espera."><thead><tr> <th>Aguarde Tipo</th> <th>Significado</th> </tr></thead><tbody><tr> <td>[[<code>THD_WAIT_SLEEP</code>]]</td> <td>Esperando dormir</td> </tr><tr> <td>[[<code>THD_WAIT_DISKIO</code>]]</td> <td>Esperando por IO de disco</td> </tr><tr> <td>[[<code>THD_WAIT_ROW_LOCK</code>]]</td> <td>Esperando por bloqueio de linha</td> </tr><tr> <td>[[<code>THD_WAIT_GLOBAL_LOCK</code>]]</td> <td>Esperando por bloqueio global</td> </tr><tr> <td>[[<code>THD_WAIT_META_DATA_LOCK</code>]]</td> <td>Esperando por bloqueio de metadados</td> </tr><tr> <td>[[<code>THD_WAIT_TABLE_LOCK</code>]]</td> <td>Esperando por bloqueio de mesa</td> </tr><tr> <td>[[<code>THD_WAIT_USER_LOCK</code>]]</td> <td>Esperando por bloqueio do usuário</td> </tr><tr> <td>[[<code>THD_WAIT_BINLOG</code>]]</td> <td>Esperando por binlog</td> </tr><tr> <td>[[<code>THD_WAIT_GROUP_COMMIT</code>]]</td> <td>Esperando pelo commit do grupo</td> </tr><tr> <td>[[<code>THD_WAIT_SYNC</code>]]</td> <td>Esperando por fsync</td> </tr></tbody></table>

- `TP_THREAD_TYPE`

  O tipo de fio. O valor exibido nesta coluna é um dos `CONNECTION_HANDLER_WORKER_THREAD`, `LISTENER_WORKER_THREAD`, `QUERY_WORKER_THREAD` ou `TIMER_WORKER_THREAD`.

  Esta coluna foi adicionada no MySQL 8.0.32.

- `THREAD_ID`

  Identificador único deste fio. O valor é o mesmo usado na coluna `THREAD_ID` da tabela do Schema de Desempenho `threads`.

  Esta coluna foi adicionada no MySQL 8.0.32.

A tabela `tp_thread_state` tem esses índices:

- Índice único em (`TP_GROUP_ID`, `TP_THREAD_NUMBER`)

`TRUNCATE TABLE` não é permitido para a tabela `tp_thread_state`.
