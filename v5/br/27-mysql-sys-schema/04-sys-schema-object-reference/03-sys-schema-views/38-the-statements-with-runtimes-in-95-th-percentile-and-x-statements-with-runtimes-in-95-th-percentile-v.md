#### 26.4.3.38 As Views statements_with_runtimes_in_95th_percentile e x$statements_with_runtimes_in_95th_percentile

Estas views listam as statements com tempos de execução (runtimes) no percentil 95. Por padrão, as linhas são ordenadas pela average latency (latência média) decrescente.

Ambas as views utilizam duas views auxiliares (helper views), `x$ps_digest_avg_latency_distribution` e `x$ps_digest_95th_percentile_by_avg_us`.

As views `statements_with_runtimes_in_95th_percentile` e `x$statements_with_runtimes_in_95th_percentile` possuem as seguintes colunas:

* `query`

  O statement string normalizado.

* `db`

  O Database padrão para a statement, ou `NULL` se não houver nenhum.

* `full_scan`

  O número total de full table scans realizados pelas ocorrências da statement.

* `exec_count`

  O número total de vezes que a statement foi executada.

* `err_count`

  O número total de erros produzidos pelas ocorrências da statement.

* `warn_count`

  O número total de warnings produzidos pelas ocorrências da statement.

* `total_latency`

  O tempo de espera (wait time) total das ocorrências cronometradas da statement.

* `max_latency`

  O tempo de espera máximo único das ocorrências cronometradas da statement.

* `avg_latency`

  O tempo de espera médio (average wait time) por ocorrência cronometrada da statement.

* `rows_sent`

  O número total de rows retornadas pelas ocorrências da statement.

* `rows_sent_avg`

  O número médio de rows retornadas por ocorrência da statement.

* `rows_examined`

  O número total de rows lidas dos storage engines pelas ocorrências da statement.

* `rows_examined_avg`

  O número médio de rows lidas dos storage engines por ocorrência da statement.

* `first_seen`

  O momento em que a statement foi vista pela primeira vez.

* `last_seen`

  O momento em que a statement foi vista mais recentemente.

* `digest`

  O statement digest.