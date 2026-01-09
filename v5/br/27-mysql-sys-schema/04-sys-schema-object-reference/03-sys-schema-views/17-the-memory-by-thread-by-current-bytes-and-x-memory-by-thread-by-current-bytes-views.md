#### 26.4.3.17 As visualizações memory_by_thread_by_current_bytes e x$memory_by_thread_by_current_bytes

Esses pontos resumem o uso da memória, agrupados por thread. Por padrão, as linhas são ordenadas por quantidade de memória usada em ordem decrescente.

As vistas `memory_by_thread_by_current_bytes` e `x$memory_by_thread_by_current_bytes` possuem essas colunas:

- `thread_id`

  O ID do fio.

- `usuário`

  O usuário do tópico ou o nome do tópico.

- `current_count_used`

  O número atual de blocos de memória alocados que ainda não foram liberados para o thread.

- `current_allocated`

  O número atual de bytes alocados que ainda não foram liberados para o thread.

- `current_avg_alloc`

  O número atual de bytes alocados por bloco de memória para o thread.

- `current_max_alloc`

  A maior alocação de memória de corrente atual em bytes para o thread.

- `total_allocated`

  A alocação total de memória em bytes para o thread.
