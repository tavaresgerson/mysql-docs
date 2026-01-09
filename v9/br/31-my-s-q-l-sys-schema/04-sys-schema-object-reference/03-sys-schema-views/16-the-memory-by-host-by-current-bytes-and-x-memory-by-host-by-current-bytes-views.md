#### 30.4.3.16 As visualizações `memory_by_host_by_current_bytes` e `x$memory_by_host_by_current_bytes`

Essas visualizações resumem o uso da memória, agrupadas por host. Por padrão, as linhas são ordenadas em ordem decrescente de quantidade de memória usada.

As visualizações `memory_by_host_by_current_bytes` e `x$memory_by_host_by_current_bytes` têm as seguintes colunas:

* `host`

  O host do qual o cliente se conectou. As linhas para as quais a coluna `HOST` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas como pertencentes a threads de segundo plano e são relatadas com o nome do host `background`.

* `current_count_used`

  O número atual de blocos de memória alocados que ainda não foram liberados para o host.

* `current_allocated`

  O número atual de bytes alocados que ainda não foram liberados para o host.

* `current_avg_alloc`

  O número atual de bytes alocados por bloco de memória para o host.

* `current_max_alloc`

  A maior alocação de memória atual em bytes para o host.

* `total_allocated`

  A alocação total de memória em bytes para o host.