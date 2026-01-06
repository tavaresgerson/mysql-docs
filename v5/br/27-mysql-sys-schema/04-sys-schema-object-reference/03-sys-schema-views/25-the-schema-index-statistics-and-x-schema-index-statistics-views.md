#### 26.4.3.25 As visualizações schema\_index\_statistics e x$schema\_index\_statistics

Essas visualizações fornecem estatísticas de índice. Por padrão, as linhas são ordenadas por latência total do índice em ordem decrescente.

As vistas `schema_index_statistics` e `x$schema_index_statistics` têm essas colunas:

- `esquema_tabela`

  O esquema que contém a tabela.

- `nome_tabela`

  A tabela que contém o índice.

- `nome_do_índice`

  O nome do índice.

- `rows_selected`

  O número total de linhas lidas usando o índice.

- `selecionar_latência`

  O tempo total de espera de leituras temporizadas usando o índice.

- `rows_inserted`

  O número total de linhas inseridas no índice.

- `insert_latency`

  O tempo total de espera para inserções temporizadas no índice.

- `rows_updated`

  O número total de linhas atualizadas no índice.

- `update_latency`

  O tempo total de espera de atualizações temporizadas no índice.

- `rows_deleted`

  O número total de linhas excluídas do índice.

- `delete_latency`

  O tempo total de espera para a exclusão temporizada do índice.
