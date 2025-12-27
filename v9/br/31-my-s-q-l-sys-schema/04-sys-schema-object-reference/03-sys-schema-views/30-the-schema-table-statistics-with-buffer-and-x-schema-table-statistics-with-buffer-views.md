#### 30.4.3.30 As vistas `schema\_table\_statistics\_with\_buffer` e `x$schema\_table\_statistics\_with\_buffer`

Essas vistas resumem as estatísticas da tabela, incluindo as estatísticas do pool de buffer do `InnoDB`. Por padrão, as linhas são ordenadas em ordem decrescente de tempo de espera total (as tabelas com mais concorrência primeiro).

Essas vistas utilizam uma vista auxiliar, `x$ps_schema_table_statistics_io`.

As vistas `schema\_table\_statistics\_with\_buffer` e `x$schema\_table\_statistics\_with\_buffer` têm as seguintes colunas:

* `table_schema`

  O esquema que contém a tabela.

* `table_name`

  O nome da tabela.

* `rows_fetched`

  O número total de linhas lidas da tabela.

* `fetch_latency`

  O tempo total de espera de eventos de E/S de leitura temporizados para a tabela.

* `rows_inserted`

  O número total de linhas inseridas na tabela.

* `insert_latency`

  O tempo total de espera de eventos de E/S de inserção temporizados para a tabela.

* `rows_updated`

  O número total de linhas atualizadas na tabela.

* `update_latency`

  O tempo total de espera de eventos de E/S de atualização temporizados para a tabela.

* `rows_deleted`

  O número total de linhas excluídas da tabela.

* `delete_latency`

  O tempo total de espera de eventos de E/S de exclusão temporizados para a tabela.

* `io_read_requests`

  O número total de solicitações de leitura para a tabela.

* `io_read`

  O número total de bytes lidos da tabela.

* `io_read_latency`

  O tempo total de espera de leituras da tabela.

* `io_write_requests`

  O número total de solicitações de escrita para a tabela.

* `io_write`

  O número total de bytes escritos na tabela.

* `io_write_latency`

  O tempo total de espera de escritas na tabela.

* `io_misc_requests`

  O número total de solicitações de E/S mistas para a tabela.

* `io_misc_latency`

  O tempo total de espera de solicitações de E/S mistas para a tabela.

* `innodb_buffer_allocated`

O número total de bytes de buffer `InnoDB` alocados para a tabela.

* `innodb_buffer_data`

  O número total de bytes de dados `InnoDB` alocados para a tabela.

* `innodb_buffer_free`

  O número total de bytes nondata `InnoDB` alocados para a tabela (`innodb_buffer_allocated` − `innodb_buffer_data`).

* `innodb_buffer_pages`

  O número total de páginas `InnoDB` alocadas para a tabela.

* `innodb_buffer_pages_hashed`

  O número total de páginas `InnoDB` com hash alocadas para a tabela.

* `innodb_buffer_pages_old`

  O número total de páginas `InnoDB` antigas alocadas para a tabela.

* `innodb_buffer_rows_cached`

  O número total de linhas `InnoDB` armazenadas em cache para a tabela.