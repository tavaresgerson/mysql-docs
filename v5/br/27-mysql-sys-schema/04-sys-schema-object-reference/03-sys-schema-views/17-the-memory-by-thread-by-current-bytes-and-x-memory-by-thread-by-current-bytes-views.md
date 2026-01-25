#### 26.4.3.17 As Views memory_by_thread_by_current_bytes e x$memory_by_thread_by_current_bytes

Essas Views resumem o uso de memory, agrupado por Thread. Por padrão, as linhas são ordenadas pela quantidade decrescente de memory utilizada.

As Views `memory_by_thread_by_current_bytes` e `x$memory_by_thread_by_current_bytes` possuem estas colunas:

* `thread_id`

  O ID da Thread.

* `user`

  O user da Thread ou nome da Thread.

* `current_count_used`

  O número atual de memory blocks allocated que ainda não foram liberados para a Thread.

* `current_allocated`

  O número atual de bytes allocated que ainda não foram liberados para a Thread.

* `current_avg_alloc`

  O número atual de bytes allocated por memory block para a Thread.

* `current_max_alloc`

  A maior alocação única de memory atual, em bytes, para a Thread.

* `total_allocated`

  A alocação total de memory, em bytes, para a Thread.