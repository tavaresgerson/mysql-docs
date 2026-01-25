#### 26.4.3.30 As Views schema_table_statistics_with_buffer e x$schema_table_statistics_with_buffer

Essas views resumem as estatísticas da tabela, incluindo estatísticas do Buffer Pool do `InnoDB`. Por padrão, as linhas são ordenadas pelo tempo total de espera decrescente (tabelas com maior contenção primeiro).

Essas views usam uma view auxiliar, `x$ps_schema_table_statistics_io`.

As views `schema_table_statistics_with_buffer` e `x$schema_table_statistics_with_buffer` possuem as seguintes colunas:

* `table_schema`

  O schema que contém a tabela.

* `table_name`

  O nome da tabela.

* `rows_fetched`

  O número total de linhas lidas da tabela.

* `fetch_latency`

  O tempo total de espera de eventos de I/O de leitura cronometrados para a tabela.

* `rows_inserted`

  O número total de linhas inseridas na tabela.

* `insert_latency`

  O tempo total de espera de eventos de I/O de inserção cronometrados para a tabela.

* `rows_updated`

  O número total de linhas atualizadas na tabela.

* `update_latency`

  O tempo total de espera de eventos de I/O de atualização cronometrados para a tabela.

* `rows_deleted`

  O número total de linhas excluídas da tabela.

* `delete_latency`

  O tempo total de espera de eventos de I/O de exclusão cronometrados para a tabela.

* `io_read_requests`

  O número total de requisições de leitura (read requests) para a tabela.

* `io_read`

  O número total de bytes lidos da tabela.

* `io_read_latency`

  O tempo total de espera de leituras da tabela.

* `io_write_requests`

  O número total de requisições de escrita (write requests) para a tabela.

* `io_write`

  O número total de bytes escritos na tabela.

* `io_write_latency`

  O tempo total de espera de escritas na tabela.

* `io_misc_requests`

  O número total de requisições diversas (miscellaneous) de I/O para a tabela.

* `io_misc_latency`

  O tempo total de espera de requisições diversas de I/O para a tabela.

* `innodb_buffer_allocated`

  O número total de bytes do Buffer do `InnoDB` alocados para a tabela.

* `innodb_buffer_data`

  O número total de bytes de dados do `InnoDB` alocados para a tabela.

* `innodb_buffer_free`

  O número total de bytes não-dados do `InnoDB` alocados para a tabela (`innodb_buffer_allocated` − `innodb_buffer_data`).

* `innodb_buffer_pages`

  O número total de pages do `InnoDB` alocadas para a tabela.

* `innodb_buffer_pages_hashed`

  O número total de pages com hash do `InnoDB` alocadas para a tabela.

* `innodb_buffer_pages_old`

  O número total de pages antigas (old pages) do `InnoDB` alocadas para a tabela.

* `innodb_buffer_rows_cached`

  O número total de linhas em cache do `InnoDB` para a tabela.