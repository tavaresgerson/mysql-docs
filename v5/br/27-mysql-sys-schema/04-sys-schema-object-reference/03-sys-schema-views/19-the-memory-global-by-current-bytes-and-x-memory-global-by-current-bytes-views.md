#### 26.4.3.19 As Views memory_global_by_current_bytes e x$memory_global_by_current_bytes

Essas Views resumem o uso de memória, agrupado por tipo de alocação (isto é, por event). Por padrão, as linhas são ordenadas pela quantidade de memória usada em ordem decrescente.

As Views `memory_global_by_current_bytes` e `x$memory_global_by_current_bytes` possuem estas colunas:

* `event_name`

  O nome do memory event.

* `current_count`

  O número total de ocorrências do event.

* `current_alloc`

  O número atual de bytes alocados que ainda não foram liberados para o event.

* `current_avg_alloc`

  O número atual de bytes alocados por memory block para o event.

* `high_count`

  A marca de limite superior (high-water mark) para o número de memory blocks alocados para o event.

* `high_alloc`

  A marca de limite superior (high-water mark) para o número de bytes alocados para o event.

* `high_avg_alloc`

  A marca de limite superior (high-water mark) para o número médio de bytes por memory block alocado para o event.