#### 30.4.3.5 As visualizações host\_summary\_by\_statement\_latency e x$host\_summary\_by\_statement\_latency

Essas visualizações resumem as estatísticas gerais da declaração, agrupadas por host. Por padrão, as linhas são ordenadas por latência total decrescente.

As visualizações `host_summary_by_statement_latency` e `x$host_summary_by_statement_latency` possuem essas colunas:

- `host`

  O host a partir do qual o cliente se conectou. As linhas para as quais a coluna `HOST` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas para serem para threads de segundo plano e são relatadas com o nome do host `background`.

- `total`

  O número total de declarações para o anfitrião.

- `total_latency`

  O tempo total de espera de declarações cronometradas para o host.

- `max_latency`

  O tempo de espera máximo de uma única declaração cronometrada para o host.

- `lock_latency`

  O tempo total de espera por trancas por declarações cronometradas para o anfitrião.

- `cpu_latency`

  O tempo gasto na CPU para o thread atual.

- `rows_sent`

  O número total de linhas retornadas por declarações para o host.

- `rows_examined`

  O número total de linhas lidas dos motores de armazenamento por declarações para o host.

- `rows_affected`

  O número total de linhas afetadas por declarações para o host.

- `full_scans`

  O número total de varreduras completas da tabela por declarações para o host.
