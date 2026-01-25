#### 26.4.3.25 As Views schema_index_statistics e x$schema_index_statistics

Essas Views fornecem estatísticas de Index. Por padrão, as linhas são ordenadas pela latency total do Index em ordem decrescente.

As Views `schema_index_statistics` e `x$schema_index_statistics` possuem as seguintes colunas:

* `table_schema`

  O Schema que contém a tabela.

* `table_name`

  A tabela que contém o Index.

* `index_name`

  O nome do Index.

* `rows_selected`

  O número total de linhas lidas usando o Index.

* `select_latency`

  O tempo de espera total (latency) de leituras cronometradas usando o Index.

* `rows_inserted`

  O número total de linhas inseridas no Index.

* `insert_latency`

  O tempo de espera total (latency) de inserções cronometradas no Index.

* `rows_updated`

  O número total de linhas atualizadas no Index.

* `update_latency`

  O tempo de espera total (latency) de atualizações cronometradas no Index.

* `rows_deleted`

  O número total de linhas excluídas do Index.

* `delete_latency`

  O tempo de espera total (latency) de exclusões cronometradas do Index.