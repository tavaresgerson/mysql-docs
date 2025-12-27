#### 30.4.3.38 Declarações\_com\_tempo\_de\_execução\_no\_95º\_percentil e x$declarações\_com\_tempo\_de\_execução\_no\_95º\_percentil Visualizações

Esses visualizações listam declarações com tempos de execução no 95º percentil. Por padrão, as linhas são ordenadas por latência média decrescente.

Ambas as visualizações usam duas visualizações auxiliares, `x$ps_digest_avg_latency_distribution` e `x$ps_digest_95th_percentile_by_avg_us`.

As visualizações `declarações_com_tempo_de_execução_no_95º_percentil` e `x$declarações_com_tempo_de_execução_no_95º_percentil` têm essas colunas:

* `query`

  A string normalizada da declaração.

* `db`

  O banco de dados padrão para a declaração, ou `NULL` se não houver nenhum.

* `full_scan`

  O número total de varreduras completas da tabela realizadas por ocorrências da declaração.

* `exec_count`

  O número total de vezes que a declaração foi executada.

* `err_count`

  O número total de erros produzidos por ocorrências da declaração.

* `warn_count`

  O número total de avisos produzidos por ocorrências da declaração.

* `total_latency`

  O tempo total de espera das ocorrências temporizadas da declaração.

* `max_latency`

  O tempo de espera máximo de uma única ocorrência temporizada da declaração.

* `avg_latency`

  O tempo de espera médio por ocorrência temporizada da declaração.

* `rows_sent`

  O número total de linhas retornadas por ocorrências da declaração.

* `rows_sent_avg`

  O número médio de linhas retornadas por ocorrência da declaração.

* `rows_examined`

  O número total de linhas lidas dos mecanismos de armazenamento por ocorrências da declaração.

* `rows_examined_avg`

  O número médio de linhas lidas dos mecanismos de armazenamento por ocorrência da declaração.

* `first_seen`

  O momento em que a declaração foi vista pela primeira vez.

* `last_seen`

  O momento em que a declaração foi vista pela última vez.

* `digest`

  O digest da declaração.