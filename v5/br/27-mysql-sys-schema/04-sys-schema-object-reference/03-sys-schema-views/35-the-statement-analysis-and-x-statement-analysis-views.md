#### 26.4.3.35 As Views statement_analysis e x$statement_analysis

Essas views listam instruções (statements) normalizadas com estatísticas agregadas. O conteúdo imita a view Query Analysis do MySQL Enterprise Monitor. Por padrão, as linhas são ordenadas pela total latency decrescente.

As views `statement_analysis` e `x$statement_analysis` possuem as seguintes colunas:

* `query`

  A string da instrução normalizada.

* `db`

  O Database padrão para a instrução, ou `NULL` se não houver.

* `full_scan`

  O número total de full table scans realizadas por ocorrências da instrução.

* `exec_count`

  O número total de vezes que a instrução foi executada.

* `err_count`

  O número total de erros produzidos por ocorrências da instrução.

* `warn_count`

  O número total de avisos (warnings) produzidos por ocorrências da instrução.

* `total_latency`

  O tempo de espera total das ocorrências cronometradas da instrução.

* `max_latency`

  O tempo de espera máximo de ocorrências cronometradas da instrução.

* `avg_latency`

  O tempo de espera médio por ocorrência cronometrada da instrução.

* `lock_latency`

  O tempo total de espera por Locks por ocorrências cronometradas da instrução.

* `rows_sent`

  O número total de linhas retornadas por ocorrências da instrução.

* `rows_sent_avg`

  O número médio de linhas retornadas por ocorrência da instrução.

* `rows_examined`

  O número total de linhas lidas dos storage engines por ocorrências da instrução.

* `rows_examined_avg`

  O número médio de linhas lidas dos storage engines por ocorrência da instrução.

* `rows_affected`

  O número total de linhas afetadas por ocorrências da instrução.

* `rows_affected_avg`

  O número médio de linhas afetadas por ocorrência da instrução.

* `tmp_tables`

  O número total de temporary tables internas na memória criadas por ocorrências da instrução.

* `tmp_disk_tables`

  O número total de temporary tables internas em disco criadas por ocorrências da instrução.

* `rows_sorted`

  O número total de linhas ordenadas por ocorrências da instrução.

* `sort_merge_passes`

  O número total de sort merge passes por ocorrências da instrução.

* `digest`

  O digest da instrução.

* `first_seen`

  A hora em que a instrução foi vista pela primeira vez.

* `last_seen`

  A hora em que a instrução foi vista mais recentemente.