#### 29.12.16.4 Tabela tp\_thread\_state

A tabela `tp_thread_state` tem uma linha por thread criada pelo pool de threads para gerenciar as conexões.

A tabela `tp_thread_state` tem as seguintes colunas:

* `TP_GROUP_ID`

  O ID do grupo de threads.

* `TP_THREAD_NUMBER`

  O ID do thread dentro do seu grupo de threads. `TP_GROUP_ID` e `TP_THREAD_NUMBER` juntos fornecem uma chave única na tabela.

* `PROCESS_COUNT`

  O intervalo de 10ms em que a instrução que usa este thread está atualmente sendo executada. 0 significa que nenhuma instrução está sendo executada, 1 significa que está nos primeiros 10ms, e assim por diante.

* `WAIT_TYPE`

  O tipo de espera para o thread. `NULL` significa que o thread não está bloqueado. Caso contrário, o thread está bloqueado por uma chamada a `thd_wait_begin()` e o valor especifica o tipo de espera. As colunas `xxx_WAIT` da tabela `tp_thread_group_stats` acumulam contagens para cada tipo de espera.

  O valor `WAIT_TYPE` é uma string que descreve o tipo de espera, conforme mostrado na tabela a seguir.

**Tabela 29.4 Tabela tp\_thread\_state Valores de WAIT\_TYPE**

<table summary="valores do tipo de estado de thread TP_thread_state. A primeira coluna é o tipo de espera. A segunda coluna descreve o tipo de espera."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Tipo de Esperança</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>THD_WAIT_SLEEP</code></td> <td>Esperando por sono</td> </tr><tr> <td><code>THD_WAIT_DISKIO</code></td> <td>Esperando por I/O de disco</td> </tr><tr> <td><code>THD_WAIT_ROW_LOCK</code></td> <td>Esperando por bloqueio de linha</td> </tr><tr> <td><code>THD_WAIT_GLOBAL_LOCK</code></td> <td>Esperando por bloqueio global</td> </tr><tr> <td><code>THD_WAIT_META_DATA_LOCK</code></td> <td>Esperando por bloqueio de metadados</td> </tr><tr> <td><code>THD_WAIT_TABLE_LOCK</code></td> <td>Esperando por bloqueio de tabela</td> </tr><tr> <td><code>THD_WAIT_USER_LOCK</code></td> <td>Esperando por bloqueio de usuário</td> </tr><tr> <td><code>THD_WAIT_BINLOG</code></td> <td>Esperando por binlog</td> </tr><tr> <td><code>THD_WAIT_GROUP_COMMIT</code></td> <td>Esperando por commit de grupo</td> </tr><tr> <td><code>THD_WAIT_SYNC</code></td> <td>Esperando por fsync</td> </tr></tbody></table>

* `TP_THREAD_TYPE`

  O tipo de thread. O valor mostrado nesta coluna é um dos `CONNECTION_HANDLER_WORKER_THREAD`, `LISTENER_WORKER_THREAD`, `QUERY_WORKER_THREAD` ou `TIMER_WORKER_THREAD`.

* `ID_DO_THREAD`:

  O identificador único deste thread. O valor é o mesmo usado na coluna `ID_DO_THREAD` da tabela `threads` do Schema de Desempenho.

* `TIME_OF_ATTACH`:

  O timestamp que mostra quando o thread foi anexado, se anexado a uma conexão; caso contrário, `NULL`.

* `MARKED_STALLED`:

Isso é `Verdadeiro` se este fio tiver sido marcado como parado pelo fio de verificação de travamento.

* `STATE`:

  Os valores possíveis dependem do tipo de fio, conforme mostrado na coluna `TP_THREAD_TYPE`:

  + Para fios de trabalhador (`QUERY_WORKER_THREAD`), este é um dos valores `Gerenciando`, `Monitorando`, `Processando Direto`, `Processando Agendado`, `Consumidor Dormindo` ou `Reserva Dormindo`.

  + Para fios de manipulador de conexão (`CONNECTION_HANDLER_WORKER_THREAD`), este é um dos valores `CH Processamento`, `CH Tempo Dormindo Temporizado` ou `CH Tempo Dormindo Indefinido`.

  + Para o fio de verificador de travamento (`TIMER_WORKER_THREAD`), este é um dos valores `SC Verificando`, `SC Tempo Dormindo Curto` ou `SC Tempo Dormindo Longo`.

* `EVENT_COUNT`:

  O número acumulado de eventos processados por este fio.

* `ACCUMULATED_EVENT_TIME`:

  O tempo do relógio de parede gasto processando eventos.

* `EXEC_COUNT`:

  O número acumulado de consultas (instruções) passadas ao servidor para execução.

* `ACCUMULATED_EXEC_TIME`:

  O tempo do relógio de parede gasto processando consultas pelo servidor.

A tabela `tp_thread_state` tem um índice; este é um índice único nas colunas `TP_GROUP_ID` e `TP_THREAD_NUMBER`.

`TRUNCATE TABLE` não é permitido para a tabela `tp_thread_state`.