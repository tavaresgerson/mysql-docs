#### 26.4.3.29 As Views schema_table_statistics e x$schema_table_statistics

Essas Views sumarizam estatísticas de table. Por padrão, as linhas são ordenadas pelo tempo total de espera descendente (as tables com maior contenção primeiro).

Essas Views usam uma View auxiliar, `x$ps_schema_table_statistics_io`.

As Views `schema_table_statistics` e `x$schema_table_statistics` possuem as seguintes colunas:

* `table_schema`

  O Schema que contém a table.

* `table_name`

  O nome da table.

* `total_latency`

  O tempo total de espera (wait time) dos eventos de I/O cronometrados (timed) para a table.

* `rows_fetched`

  O número total de linhas lidas (read) da table.

* `fetch_latency`

  O tempo total de espera dos eventos de I/O de leitura (read) cronometrados para a table.

* `rows_inserted`

  O número total de linhas inseridas (inserted) na table.

* `insert_latency`

  O tempo total de espera dos eventos de I/O de inserção (insert) cronometrados para a table.

* `rows_updated`

  O número total de linhas atualizadas (updated) na table.

* `update_latency`

  O tempo total de espera dos eventos de I/O de atualização (update) cronometrados para a table.

* `rows_deleted`

  O número total de linhas excluídas (deleted) da table.

* `delete_latency`

  O tempo total de espera dos eventos de I/O de exclusão (delete) cronometrados para a table.

* `io_read_requests`

  O número total de Request de leitura (read Request) para a table.

* `io_read`

  O número total de bytes lidos da table.

* `io_read_latency`

  O tempo total de espera de leituras da table.

* `io_write_requests`

  O número total de Request de escrita (write Request) para a table.

* `io_write`

  O número total de bytes escritos na table.

* `io_write_latency`

  O tempo total de espera de escritas na table.

* `io_misc_requests`

  O número total de Request de I/O diversos/miscelâneos para a table.

* `io_misc_latency`

  O tempo total de espera dos Request de I/O diversos/miscelâneos para a table.