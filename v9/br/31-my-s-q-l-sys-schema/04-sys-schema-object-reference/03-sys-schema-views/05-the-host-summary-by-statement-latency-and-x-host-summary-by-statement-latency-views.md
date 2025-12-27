#### 30.4.3.5 Visitas `host_summary_by_statement_latency` e `x$host_summary_by_statement_latency`

Essas vistas resumem as estatísticas gerais das declarações, agrupadas por host. Por padrão, as linhas são ordenadas em ordem decrescente de latência total.

As vistas `host_summary_by_statement_latency` e `x$host_summary_by_statement_latency` têm as seguintes colunas:

* `host`

  O host a partir do qual o cliente se conectou. As linhas para as quais a coluna `HOST` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas como pertencentes a threads de segundo plano e são relatadas com o nome do host `background`.

* `total`

  O número total de declarações para o host.

* `total_latency`

  O tempo total de espera de declarações temporizadas para o host.

* `max_latency`

  O tempo máximo de espera de declarações temporizadas para o host.

* `lock_latency`

  O tempo total de espera por bloqueios de declarações temporizadas para o host.

* `cpu_latency`

  O tempo gasto no CPU para o thread atual.

* `rows_sent`

  O número total de linhas devolvidas por declarações para o host.

* `rows_examined`

  O número total de linhas lidas dos motores de armazenamento por declarações para o host.

* `rows_affected`

  O número total de linhas afetadas por declarações para o host.

* `full_scans`

  O número total de varreduras completas de tabelas por declarações para o host.