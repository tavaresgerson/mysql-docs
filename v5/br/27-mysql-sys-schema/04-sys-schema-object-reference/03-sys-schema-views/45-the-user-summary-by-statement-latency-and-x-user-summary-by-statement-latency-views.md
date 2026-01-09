#### 26.4.3.45 As visualizações user_summary_by_statement_latency e x$user_summary_by_statement_latency

Essas visualizações resumem as estatísticas gerais da declaração, agrupadas por usuário. Por padrão, as linhas são ordenadas por latência total decrescente.

As views `user_summary_by_statement_latency` e `x$user_summary_by_statement_latency` possuem essas colunas:

- `usuário`

  O nome de usuário do cliente. As linhas para as quais a coluna `USER` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas como pertencentes a threads de segundo plano e são relatadas com o nome do host `background`.

- `total`

  O número total de declarações para o usuário.

- `total_latency`

  O tempo total de espera de declarações cronometradas para o usuário.

- `max_latency`

  O tempo de espera máximo de uma única declaração com temporizador para o usuário.

- `lock_latency`

  O tempo total de espera por bloqueios por declarações cronometradas para o usuário.

- `rows_sent`

  O número total de linhas devolvidas por declarações para o usuário.

- `rows_examined`

  O número total de linhas lidas dos motores de armazenamento por declarações para o usuário.

- `rows_affected`

  O número total de linhas afetadas por declarações para o usuário.

- `full_scans`

  O número total de varreduras completas da tabela por declarações para o usuário.
