#### 30.4.3.25 As visualizações schema\_index\_statistics e x$schema\_index\_statistics

Essas visualizações fornecem estatísticas de índices. Por padrão, as linhas são ordenadas em ordem decrescente de latência total do índice.

As visualizações `schema_index_statistics` e `x$schema_index_statistics` têm as seguintes colunas:

* `table_schema`

  O esquema que contém a tabela.

* `table_name`

  A tabela que contém o índice.

* `index_name`

  O nome do índice.

* `rows_selected`

  O número total de linhas lidas usando o índice.

* `select_latency`

  O tempo total de espera de leituras temporizadas usando o índice.

* `rows_inserted`

  O número total de linhas inseridas no índice.

* `insert_latency`

  O tempo total de espera de inserções temporizadas no índice.

* `rows_updated`

  O número total de linhas atualizadas no índice.

* `update_latency`

  O tempo total de espera de atualizações temporizadas no índice.

* `rows_deleted`

  O número total de linhas excluídas do índice.

* `delete_latency`

  O tempo total de espera de exclusões temporizadas do índice.