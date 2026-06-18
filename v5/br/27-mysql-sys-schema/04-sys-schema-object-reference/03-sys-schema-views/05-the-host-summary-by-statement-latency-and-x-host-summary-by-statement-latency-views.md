#### 26.4.3.5 As Views host_summary_by_statement_latency e x$host_summary_by_statement_latency

Estas Views sumarizam as estatísticas gerais de Statement, agrupadas por host. Por padrão, as linhas são ordenadas pela total_latency de forma decrescente.

As Views `host_summary_by_statement_latency` e `x$host_summary_by_statement_latency` possuem estas colunas:

* `host`

  O host a partir do qual o cliente se conectou. Linhas para as quais a coluna `HOST` na tabela subjacente do Performance Schema é `NULL` são consideradas como pertencentes a background threads e são relatadas com um nome de host de `background`.

* `total`

  O número total de Statements para o host.

* `total_latency`

  O tempo de espera total de Statements cronometrados (timed statements) para o host.

* `max_latency`

  O tempo máximo de espera individual de Statements cronometrados (timed statements) para o host.

* `lock_latency`

  O tempo total de espera por Locks por Statements cronometrados (timed statements) para o host.

* `rows_sent`

  O número total de linhas retornadas por Statements para o host.

* `rows_examined`

  O número total de linhas lidas dos storage engines por Statements para o host.

* `rows_affected`

  O número total de linhas afetadas por Statements para o host.

* `full_scans`

  O número total de Full Table Scans por Statements para o host.