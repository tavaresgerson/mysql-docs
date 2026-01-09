#### 26.4.3.6 As visualizações host_summary_by_statement_type e x$host_summary_by_statement_type

Essas visualizações resumem informações sobre declarações executadas, agrupadas por host e tipo de declaração. Por padrão, as linhas são ordenadas por host e latência total decrescente.

As views `host_summary_by_statement_type` e `x$host_summary_by_statement_type` possuem essas colunas:

- `host`

  O host a partir do qual o cliente se conectou. As linhas para as quais a coluna `HOST` na tabela subjacente do Gerenciamento de Desempenho é `NULL` são assumidas como pertencentes a threads de segundo plano e são relatadas com o nome do host `background`.

- `declaração`

  O componente final do nome do evento da declaração.

- `total`

  O número total de ocorrências do evento de declaração para o host.

- `total_latency`

  O tempo total de espera de ocorrências temporizadas do evento de declaração para o host.

- `max_latency`

  O tempo de espera máximo de uma única ocorrência temporizada do evento de declaração para o host.

- `lock_latency`

  O tempo total de espera por bloqueios por ocorrências temporizadas do evento de declaração para o host.

- `rows_sent`

  O número total de linhas retornadas por ocorrências do evento de declaração para o host.

- `rows_examined`

  O número total de linhas lidas dos motores de armazenamento por ocorrências do evento de declaração para o host.

- `rows_affected`

  O número total de linhas afetadas por ocorrências do evento de declaração para o host.

- `full_scans`

  O número total de varreduras completas da tabela por ocorrências do evento de declaração para o host.
