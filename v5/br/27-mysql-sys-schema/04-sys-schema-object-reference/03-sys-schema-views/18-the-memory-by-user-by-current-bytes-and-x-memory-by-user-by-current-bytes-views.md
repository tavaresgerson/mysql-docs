#### 26.4.3.18 As Views memory_by_user_by_current_bytes e x$memory_by_user_by_current_bytes

Essas Views resumem o uso de memória, agrupado por user. Por padrão, as linhas são ordenadas pela quantidade de memória usada em ordem decrescente.

As Views `memory_by_user_by_current_bytes` e `x$memory_by_user_by_current_bytes` contêm as seguintes colunas:

* `user`

  O nome do user cliente. Linhas para as quais a coluna `USER` na tabela subjacente do Performance Schema é `NULL` são consideradas como pertencentes a background Threads e são relatadas com um nome de host de `background`.

* `current_count_used`

  O número atual de blocos de memória alocados para o user que ainda não foram liberados (freed).

* `current_allocated`

  O número atual de bytes alocados para o user que ainda não foram liberados (freed).

* `current_avg_alloc`

  O número atual de bytes alocados por bloco de memória para o user.

* `current_max_alloc`

  A maior alocação de memória atual individual em bytes para o user.

* `total_allocated`

  A alocação total de memória em bytes para o user.