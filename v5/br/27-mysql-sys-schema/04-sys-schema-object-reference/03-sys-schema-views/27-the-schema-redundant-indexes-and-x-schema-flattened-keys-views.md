#### 26.4.3.27 As Views schema_redundant_indexes e x$schema_flattened_keys

A View `schema_redundant_indexes` exibe Indexes que duplicam outros Indexes ou que são tornados redundantes por eles. A View `x$schema_flattened_keys` é uma View auxiliar para `schema_redundant_indexes`.

Nas descrições de colunas a seguir, o *dominant index* é aquele que torna o *redundant index* redundante.

A View `schema_redundant_indexes` possui estas colunas:

* `table_schema`

  O Schema que contém a Table.

* `table_name`

  A Table que contém o Index.

* `redundant_index_name`

  O nome do Index redundante.

* `redundant_index_columns`

  Os nomes das Columns no Index redundante.

* `redundant_index_non_unique`

  O número de Columns não-únicas no Index redundante.

* `dominant_index_name`

  O nome do Index dominante.

* `dominant_index_columns`

  Os nomes das Columns no Index dominante.

* `dominant_index_non_unique`

  O número de Columns não-únicas no Index dominante.

* `subpart_exists`

  Se o Index indexa apenas parte de uma Column.

* `sql_drop_index`

  O Statement a ser executado para descartar (DROP) o Index redundante.

A View `x$schema_flattened_keys` possui estas colunas:

* `table_schema`

  O Schema que contém a Table.

* `table_name`

  A Table que contém o Index.

* `index_name`

  Um nome de Index.

* `non_unique`

  O número de Columns não-únicas no Index.

* `subpart_exists`

  Se o Index indexa apenas parte de uma Column.

* `index_columns`

  O nome das Columns no Index.