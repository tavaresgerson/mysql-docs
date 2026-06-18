#### 30.4.3.18 Visitas de memory\_by\_user\_by\_current\_bytes e x$memory\_by\_user\_by\_current\_bytes

Esses pontos resumem o uso da memória, agrupados por usuário. Por padrão, as linhas são ordenadas por quantidade de memória usada em ordem decrescente.

As visualizações `memory_by_user_by_current_bytes` e `x$memory_by_user_by_current_bytes` possuem essas colunas:

- `user`

  O nome de usuário do cliente. As linhas para as quais a coluna `USER` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas para serem para threads de segundo plano e são relatadas com um nome de host de `background`.

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
