#### 30.4.3.39 As visualizações \_statements\_with\_sorting e x$statements\_with\_sorting

Essas visualizações listam declarações normalizadas que realizaram ordenamentos. Por padrão, as linhas são ordenadas por latência total decrescente.

As visualizações `statements_with_sorting` e `x$statements_with_sorting` possuem essas colunas:

- `query`

  A string de declaração normalizada.

- `db`

  O banco de dados padrão para a declaração, ou `NULL` se não houver nenhum.

- `exec_count`

  O número total de vezes que a declaração foi executada.

- `total_latency`

  O tempo total de espera de ocorrências temporizadas da declaração.

- `sort_merge_passes`

  O número total de passes de fusão de classificação por ocorrências da declaração.

- `avg_sort_merges`

  O número médio de passes de fusão de classificação por ocorrência da declaração.

- `sorts_using_scans`

  O número total de tipos que usam varreduras de tabela por ocorrências da declaração.

- `sort_using_range`

  O número total de tipos que usam acessos de intervalo por ocorrências da declaração.

- `rows_sorted`

  O número total de linhas classificadas por ocorrências da declaração.

- `avg_rows_sorted`

  O número médio de linhas ordenadas por ocorrência da declaração.

- `first_seen`

  O momento em que a declaração foi vista pela primeira vez.

- `last_seen`

  O horário em que a declaração foi vista pela última vez.

- `digest`

  O resumo da declaração.
