#### 26.4.3.18 As visualizações memory_by_user_by_current_bytes e x$memory_by_user_by_current_bytes

Esses pontos resumem o uso da memória, agrupados por usuário. Por padrão, as linhas são ordenadas por quantidade de memória usada em ordem decrescente.

As views `memory_by_user_by_current_bytes` e `x$memory_by_user_by_current_bytes` possuem essas colunas:

- `usuário`

  O nome de usuário do cliente. As linhas para as quais a coluna `USER` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas como pertencentes a threads de segundo plano e são relatadas com o nome do host `background`.

- `current_count_used`

  O número atual de blocos de memória alocados que ainda não foram liberados para o usuário.

- `current_allocated`

  O número atual de bytes alocados que ainda não foram liberados para o usuário.

- `current_avg_alloc`

  O número atual de bytes alocados por bloco de memória para o usuário.

- `current_max_alloc`

  A maior alocação de memória de corrente atual em bytes para o usuário.

- `total_allocated`

  A alocação total de memória em bytes para o usuário.
