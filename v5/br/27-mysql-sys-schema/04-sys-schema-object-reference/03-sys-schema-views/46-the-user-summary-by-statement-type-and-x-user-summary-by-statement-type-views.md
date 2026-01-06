#### 26.4.3.46 As visualizações user\_summary\_by\_statement\_type e x$user\_summary\_by\_statement\_type

Essas visualizações resumem informações sobre declarações executadas, agrupadas por usuário e tipo de declaração. Por padrão, as linhas são ordenadas por usuário e latência total decrescente.

As views `user_summary_by_statement_type` e `x$user_summary_by_statement_type` possuem essas colunas:

- `usuário`

  O nome de usuário do cliente. As linhas para as quais a coluna `USER` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas como pertencentes a threads de segundo plano e são relatadas com o nome do host `background`.

- `declaração`

  O componente final do nome do evento da declaração.

- `total`

  O número total de ocorrências do evento de declaração para o usuário.

- `total_latency`

  O tempo total de espera de ocorrências temporizadas do evento de declaração para o usuário.

- `max_latency`

  O tempo de espera máximo de uma única ocorrência temporizada do evento de declaração para o usuário.

- `lock_latency`

  O tempo total de espera por bloqueios por ocorrências temporizadas do evento de declaração para o usuário.

- `rows_sent`

  O número total de linhas retornadas por ocorrências do evento de declaração para o usuário.

- `rows_examined`

  O número total de linhas lidas dos motores de armazenamento por ocorrências do evento de declaração para o usuário.

- `rows_affected`

  O número total de linhas afetadas por ocorrências do evento de declaração para o usuário.

- `full_scans`

  O número total de varreduras completas da tabela por ocorrências do evento de declaração para o usuário.
