#### 30.4.3.19 As visualizações \_global\_memória\_por\_bytes\_curto\_atual e \_x$memória\_global\_por\_bytes\_curto\_atual

Essas visualizações resumem o uso da memória, agrupadas por tipo de alocação (ou seja, por evento). Por padrão, as linhas são ordenadas em ordem decrescente de quantidade de memória usada.

As visualizações `memory_global_by_current_bytes` e `x$memory_global_by_current_bytes` têm as seguintes colunas:

* `event_name`

  O nome do evento de memória.

* `current_count`

  O número total de ocorrências do evento.

* `current_alloc`

  O número atual de bytes alocados que ainda não foram liberados para o evento.

* `current_avg_alloc`

  O número atual de bytes alocados por bloco de memória para o evento.

* `high_count`

  O limite máximo de número de blocos de memória alocados para o evento.

* `high_alloc`

  O limite máximo de bytes alocados para o evento.

* `high_avg_alloc`

  O limite máximo de número médio de bytes por bloco de memória alocados para o evento.