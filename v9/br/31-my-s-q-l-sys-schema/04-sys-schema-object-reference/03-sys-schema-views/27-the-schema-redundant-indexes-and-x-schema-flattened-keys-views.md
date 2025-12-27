#### 30.4.3.27 As vistas `schema_redundant_indexes` e `x$schema_flattened_keys`

A vista `schema_redundant_indexes` exibe índices que duplicam outros índices ou são tornados redundantes por eles. A vista `x$schema_flattened_keys` é uma vista auxiliar para `schema_redundant_indexes`.

Nas seguintes descrições de colunas, a coluna dominante é aquela que torna o índice redundante redundante.

A vista `schema_redundant_indexes` tem essas colunas:

* `table_schema`

  O esquema que contém a tabela.

* `table_name`

  A tabela que contém o índice.

* `redundant_index_name`

  O nome do índice redundante.

* `redundant_index_columns`

  Os nomes das colunas no índice redundante.

* `redundant_index_non_unique`

  O número de colunas não únicas no índice redundante.

* `dominant_index_name`

  O nome do índice dominante.

* `dominant_index_columns`

  Os nomes das colunas no índice dominante.

* `dominant_index_non_unique`

  O número de colunas não únicas no índice dominante.

* `subpart_exists`

  Se o índice indexa apenas parte de uma coluna.

* `sql_drop_index`

  A instrução a ser executada para descartar o índice redundante.

A vista `x$schema_flattened_keys` tem essas colunas:

* `table_schema`

  O esquema que contém a tabela.

* `table_name`

  A tabela que contém o índice.

* `index_name`

  Um nome de índice.

* `non_unique`

  O número de colunas não únicas no índice.

* `subpart_exists`

  Se o índice indexa apenas parte de uma coluna.

* `index_columns`

  O nome das colunas no índice.