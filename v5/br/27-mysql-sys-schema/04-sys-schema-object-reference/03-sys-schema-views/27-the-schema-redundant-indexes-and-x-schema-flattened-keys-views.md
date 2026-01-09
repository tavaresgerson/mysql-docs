#### 26.4.3.27 As visualizações schema_redundant_indexes e x$schema_flattened_keys

A visualização `schema_redundant_indexes` exibe índices que duplicam outros índices ou são tornados redundantes por eles. A visualização `x$schema_flattened_keys` é uma visualização auxiliar para `schema_redundant_indexes`.

Nas descrições das colunas a seguir, o índice dominante é o que torna o índice redundante redundante.

A visão `schema_redundant_indexes` tem essas colunas:

- `esquema_tabela`

  O esquema que contém a tabela.

- `nome_tabela`

  A tabela que contém o índice.

- `redundante_index_name`

  O nome do índice redundante.

- `redundant_index_columns`

  Os nomes das colunas no índice redundante.

- `redundante_index_non_unique`

  Número de colunas não únicas no índice redundante.

- `domínio_index_name`

  O nome do índice dominante.

- `domínio_index_columns`

  Os nomes das colunas no índice dominante.

- `dominante_index_não_único`

  Número de colunas não únicas no índice dominante.

- `subparte_existe`

  Se o índice indexa apenas parte de uma coluna.

- `sql_drop_index`

  A instrução a ser executada para descartar o índice redundante.

A visão `x$schema_flattened_keys` tem essas colunas:

- `esquema_tabela`

  O esquema que contém a tabela.

- `nome_tabela`

  A tabela que contém o índice.

- `nome_do_índice`

  Um nome de índice.

- `não_único`

  O número de colunas não únicas no índice.

- `subparte_existe`

  Se o índice indexa apenas parte de uma coluna.

- `index_columns`

  O nome das colunas no índice.
