#### 26.4.3.16 As Views memory_by_host_by_current_bytes e x$memory_by_host_by_current_bytes

Essas Views resumem o uso de memória, agrupado por host. Por padrão, as linhas são ordenadas pela quantidade de memória usada, em ordem decrescente.

As Views `memory_by_host_by_current_bytes` e `x$memory_by_host_by_current_bytes` possuem as seguintes colunas:

* `host`

  O host a partir do qual o cliente se conectou. As linhas em que a coluna `HOST` na tabela subjacente do Performance Schema é `NULL` são consideradas para background threads e são reportadas com um nome de host de `background`.

* `current_count_used`

  O número atual de blocos de memória alocados que ainda não foram liberados para o host.

* `current_allocated`

  O número atual de bytes alocados que ainda não foram liberados para o host.

* `current_avg_alloc`

  O número atual de bytes alocados por bloco de memória para o host.

* `current_max_alloc`

  A maior alocação de memória única atual em bytes para o host.

* `total_allocated`

  A alocação total de memória em bytes para o host.