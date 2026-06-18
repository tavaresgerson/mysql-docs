#### 26.4.3.39 As Views statements_with_sorting e x$statements_with_sorting

Estas Views listam as statements normalizadas que executaram ordenações (`sorts`). Por padrão, as linhas são ordenadas pela `total_latency` descendente.

As Views `statements_with_sorting` e `x$statements_with_sorting` possuem estas colunas:

* `query`

  A string da statement normalizada.

* `db`

  O Database padrão para a statement, ou `NULL` se não houver um.

* `exec_count`

  O número total de vezes que a statement foi executada.

* `total_latency`

  O tempo total de espera de ocorrências cronometradas da statement.

* `sort_merge_passes`

  O número total de passagens de mesclagem de ordenação (`sort merge passes`) por ocorrências da statement.

* `avg_sort_merges`

  O número médio de passagens de mesclagem de ordenação (`sort merge passes`) por ocorrência da statement.

* `sorts_using_scans`

  O número total de ordenações (`sorts`) utilizando `table scans` por ocorrências da statement.

* `sort_using_range`

  O número total de ordenações (`sorts`) utilizando acessos de `range` por ocorrências da statement.

* `rows_sorted`

  O número total de linhas ordenadas por ocorrências da statement.

* `avg_rows_sorted`

  O número médio de linhas ordenadas por ocorrência da statement.

* `first_seen`

  O momento em que a statement foi vista pela primeira vez.

* `last_seen`

  O momento em que a statement foi vista mais recentemente.

* `digest`

  O Digest da statement.