#### 26.4.3.19 As visualizações memory\_global\_by\_current\_bytes e x$memory\_global\_by\_current\_bytes

Esses pontos resumem o uso da memória, agrupados por tipo de alocação (ou seja, por evento). Por padrão, as linhas são ordenadas em ordem decrescente de quantidade de memória usada.

As vistas `memory_global_by_current_bytes` e `x$memory_global_by_current_bytes` possuem essas colunas:

- `nome_do_evento`

  O nome do evento de memória.

- `current_count`

  O número total de ocorrências do evento.

- `current_alloc`

  O número atual de bytes alocados que ainda não foram liberados para o evento.

- `current_avg_alloc`

  O número atual de bytes alocados por bloco de memória para o evento.

- `high_count`

  O limite máximo de blocos de memória alocados para o evento.

- `high_alloc`

  O limite máximo de bytes alocados para o evento.

- `high_avg_alloc`

  O limite máximo para o número médio de bytes por bloco de memória alocado para o evento.
