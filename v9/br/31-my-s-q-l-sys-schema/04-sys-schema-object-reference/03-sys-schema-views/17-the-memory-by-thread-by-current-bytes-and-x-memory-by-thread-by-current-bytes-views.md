#### 30.4.3.17 Visões `memory_by_thread_by_current_bytes` e `x$memory_by_thread_by_current_bytes`

Essas visões resumem o uso da memória, agrupadas por thread. Por padrão, as linhas são ordenadas em ordem decrescente de quantidade de memória usada.

As visões `memory_by_thread_by_current_bytes` e `x$memory_by_thread_by_current_bytes` têm essas colunas:

* `thread_id`

  O ID do thread.

* `user`

  O usuário do thread ou o nome do thread.

* `current_count_used`

  O número atual de blocos de memória alocados que ainda não foram liberados para o thread.

* `current_allocated`

  O número atual de bytes alocados que ainda não foram liberados para o thread.

* `current_avg_alloc`

  O número atual de bytes alocados por bloco de memória para o thread.

* `current_max_alloc`

  A maior alocação de memória atual em bytes para o thread.

* `total_allocated`

  A alocação total de memória em bytes para o thread.