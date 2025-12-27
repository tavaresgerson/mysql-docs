#### 30.4.3.39 Visualizações com ordenação e x$visualizações com ordenação

Essas visualizações listam declarações normalizadas que realizaram ordens. Por padrão, as linhas são ordenadas por latência total decrescente.

As visualizações `declarações_com_ordenação` e `x$declarações_com_ordenação` têm essas colunas:

* `query`

  A string de declaração normalizada.

* `db`

  O banco de dados padrão para a declaração, ou `NULL` se não houver nenhum.

* `exec_count`

  O número total de vezes que a declaração foi executada.

* `total_latency`

  O tempo total de espera das ocorrências temporizadas da declaração.

* `sort_merge_passes`

  O número total de passes de fusão de ordens por ocorrências da declaração.

* `avg_sort_merges`

  O número médio de passes de fusão de ordens por ocorrência da declaração.

* `sorts_using_scans`

  O número total de ordens usando varreduras de tabela por ocorrências da declaração.

* `sort_using_range`

  O número total de ordens usando acessos de intervalo por ocorrências da declaração.

* `rows_sorted`

  O número total de linhas ordenadas por ocorrências da declaração.

* `avg_rows_sorted`

  O número médio de linhas ordenadas por ocorrência da declaração.

* `first_seen`

  O momento em que a declaração foi vista pela primeira vez.

* `last_seen`

  O momento em que a declaração foi vista pela última vez.

* `digest`

  O digest da declaração.