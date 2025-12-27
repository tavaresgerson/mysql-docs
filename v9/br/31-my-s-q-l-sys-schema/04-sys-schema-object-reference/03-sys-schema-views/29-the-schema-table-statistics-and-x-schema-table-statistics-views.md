#### 30.4.3.29 As vistas `schema\_table\_statistics` e `x$schema\_table\_statistics`

Essas vistas resumem as estatísticas das tabelas. Por padrão, as linhas são ordenadas em ordem decrescente de tempo de espera total (as tabelas com mais concorrência primeiro).

Essas vistas utilizam uma vista auxiliar, `x$ps_schema_table_statistics_io`.

As vistas `schema\_table\_statistics` e `x$schema\_table\_statistics` têm as seguintes colunas:

* `table_schema`

  O esquema que contém a tabela.

* `table_name`

  O nome da tabela.

* `total_latency`

  O tempo de espera total de eventos de E/S com temporizador para a tabela.

* `rows_fetched`

  O número total de linhas lidas da tabela.

* `fetch_latency`

  O tempo de espera total de eventos de E/S de leitura com temporizador para a tabela.

* `rows_inserted`

  O número total de linhas inseridas na tabela.

* `insert_latency`

  O tempo de espera total de eventos de E/S de inserção com temporizador para a tabela.

* `rows_updated`

  O número total de linhas atualizadas na tabela.

* `update_latency`

  O tempo de espera total de eventos de E/S de atualização com temporizador para a tabela.

* `rows_deleted`

  O número total de linhas excluídas da tabela.

* `delete_latency`

  O tempo de espera total de eventos de E/S de exclusão com temporizador para a tabela.

* `io_read_requests`

  O número total de solicitações de leitura para a tabela.

* `io_read`

  O número total de bytes lidos da tabela.

* `io_read_latency`

  O tempo de espera total de leituras da tabela.

* `io_write_requests`

  O número total de solicitações de escrita para a tabela.

* `io_write`

  O número total de bytes escritos na tabela.

* `io_write_latency`

  O tempo de espera total de escritas na tabela.

* `io_misc_requests`

  O número total de solicitações de E/S mistas para a tabela.

* `io_misc_latency`

  O tempo de espera total de solicitações de E/S mistas para a tabela.