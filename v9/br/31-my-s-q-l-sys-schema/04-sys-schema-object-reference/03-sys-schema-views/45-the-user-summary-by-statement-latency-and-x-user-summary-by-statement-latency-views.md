#### 30.4.3.45 Visitas `user_summary_by_statement_latency` e `x$user_summary_by_statement_latency`

Esses relatórios resumem as estatísticas gerais das declarações, agrupadas por usuário. Por padrão, as linhas são ordenadas em ordem decrescente de latência total.

As vistas `user_summary_by_statement_latency` e `x$user_summary_by_statement_latency` têm as seguintes colunas:

* `user`

  O nome do usuário do cliente. As linhas para as quais a coluna `USER` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas como pertencentes a threads de plano de fundo e são relatadas com o nome do host `background`.

* `total`

  O número total de declarações para o usuário.

* `total_latency`

  O tempo total de espera de declarações temporizadas para o usuário.

* `max_latency`

  O tempo máximo de espera de uma única declaração temporizada para o usuário.

* `lock_latency`

  O tempo total gasto esperando por bloqueios por declarações temporizadas para o usuário.

* `cpu_latency`

  O tempo gasto no CPU para o thread atual.

* `rows_sent`

  O número total de linhas devolvidas por declarações para o usuário.

* `rows_examined`

  O número total de linhas lidas dos motores de armazenamento por declarações para o usuário.

* `rows_affected`

  O número total de linhas afetadas por declarações para o usuário.

* `full_scans`

  O número total de varreduras completas de tabelas por declarações para o usuário.