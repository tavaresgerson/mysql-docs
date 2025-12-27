#### 30.4.3.35 Análise de declarações e visualizações de x$statement_analysis

Esses visualizações listam declarações normalizadas com estatísticas agregadas. O conteúdo imita a visualização Análise de Consulta do Monitor de Empresas MySQL. Por padrão, as linhas são ordenadas em ordem decrescente de latência total.

As visualizações `statement_analysis` e `x$statement_analysis` têm essas colunas:

* `query`

  A string de declaração normalizada.

* `db`

  O banco de dados padrão para a declaração, ou `NULL` se não houver nenhum.

* `full_scan`

  O número total de varreduras completas de tabela realizadas por ocorrências da declaração.

* `exec_count`

  O número total de vezes que a declaração foi executada.

* `err_count`

  O número total de erros produzidos por ocorrências da declaração.

* `warn_count`

  O número total de avisos produzidos por ocorrências da declaração.

* `total_latency`

  O tempo total de espera das ocorrências temporizadas da declaração.

* `max_latency`

  O tempo máximo de espera de uma única ocorrência temporizada da declaração.

* `avg_latency`

  O tempo médio de espera por ocorrência temporizada da declaração.

* `lock_latency`

  O tempo total de espera por bloqueios das ocorrências temporizadas da declaração.

* `cpu_latency`

  O tempo gasto no CPU para o thread atual.

* `rows_sent`

  O número total de linhas devolvidas por ocorrências da declaração.

* `rows_sent_avg`

  O número médio de linhas devolvidas por ocorrência da declaração.

* `rows_examined`

  O número total de linhas lidas dos motores de armazenamento por ocorrências da declaração.

* `rows_examined_avg`

  O número médio de linhas lidas dos motores de armazenamento por ocorrência da declaração.

* `rows_affected`

  O número total de linhas afetadas por ocorrências da declaração.

* `rows_affected_avg`

O número médio de linhas afetadas por cada ocorrência da declaração.

* `tmp_tables`

  O número total de tabelas temporárias internas em memória criadas por ocorrências da declaração.

* `tmp_disk_tables`

  O número total de tabelas temporárias em disco internas criadas por ocorrências da declaração.

* `rows_sorted`

  O número total de linhas ordenadas por ocorrências da declaração.

* `sort_merge_passes`

  O número total de passes de fusão de ordenação por ocorrências da declaração.

* `max_controlled_memory`

  A quantidade máxima de memória controlada (bytes) usada pela declaração.

* `max_total_memory`

  A quantidade máxima de memória (bytes) usada pela declaração.

* `digest`

  O digest da declaração.

* `first_seen`

  O momento em que a declaração foi vista pela primeira vez.

* `last_seen`

  O momento em que a declaração foi vista pela última vez.