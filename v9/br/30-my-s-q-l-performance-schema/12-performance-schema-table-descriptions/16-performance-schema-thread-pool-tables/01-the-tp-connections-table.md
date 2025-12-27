#### 29.12.16.1 A tabela `tp_connections`

A tabela `tp_connections` contém uma linha por conexão gerenciada pelo plugin Thread Pool. Cada linha fornece informações sobre o estado atual de uma conexão do pool de threads.

A tabela `tp_connections` contém as seguintes linhas:

* `CONNECTION_ID`

  O ID da conexão conforme relatado por `SELECT` `CONNECTION_ID()`.

* `TP_GROUP_ID`

  O índice do grupo de threads na matriz global. Esta coluna e `TP_PROCESSING_THREAD_NUMBER` servem como chave estrangeira para a tabela `tp_thread_state`.

* `TP_PROCESSING_THREAD_NUMBER`

  Este pode ser `NULL` se nenhum thread estiver atualmente conectado à conexão.

* `THREAD_ID`

  O ID do thread do Schema de Desempenho.

* `STATE`

  O estado da conexão; este é um dos valores `Established`, `Armed`, `Queued`, `Waiting for Credit`, `Attached`, `Expired` ou `Killed`.

* `ACTIVE_FLAG`

  Quando este é `0`, a conexão não está conectada a nenhum thread trabalhador.

* `KILLED_STATE`

  Relata a etapa atual no processo de eliminação da conexão.

* `CLEANUP_STATE`

  Relata a etapa atual no processo de limpeza ao fechar a conexão.

* `TIME_OF_LAST_EVENT_COMPLETION`

  Marcapassos mostrando quando a conexão processou a última solicitação.

* `TIME_OF_EXPIRY`

  Marcapassos mostrando quando uma conexão inativa expirará se nenhuma nova solicitação chegar antes disso; este é `NULL` quando o thread está processando uma solicitação atualmente.

* `TIME_OF_ADD`

  Marcapassos mostrando quando a conexão foi adicionada à fila de solicitações de conexão do pool de threads.

* `TIME_OF_POP`

  Marcapassos mostrando quando a conexão foi desfilada (removida) da fila por um thread de manipulador de conexão.

* `TIME_OF_ARM`

  Marcapassos mostrando quando o descritor de arquivo da conexão foi adicionado pela última vez ao conjunto monitorado pelo `poll()` ou `epoll()`.

* `CONNECT_HANDLER_INDEX`

  O índice do fio de manipulador de conexão no grupo que processou a solicitação de conexão; um número maior indica que a carga de conexão desencadeou a criação de fios de manipulador de conexão adicionais.

* `TYPE`

  O tipo de conexão; este é um dos `User`, `Admin_interface` ou `Admin_privilege`; `Admin_privilege` significa que esta conexão estava usando a interface normal, mas foi colocada no grupo `admin` devido ao usuário ter o privilégio `TP_CONNECTION_ADMIN`.

* `DIRECT_QUERY_EVENTS`

  O número de consultas executadas diretamente por esta conexão.

* `QUEUED_QUERY_EVENTS`

  O número de consultas em fila executadas por esta conexão.

* `TIME_OF_EVENT_ARRIVAL`

  Um timestamp mostrando quando o `poll_wait()` retorna com um evento para a conexão; este valor é necessário para calcular o `MANAGEMENT_TIME`.

* `MANAGEMENT_TIME`

  O tempo acumulado entre o retorno da espera em descritores de arquivo; isso inclui o tempo gasto em fila para consultas que não são executadas diretamente.