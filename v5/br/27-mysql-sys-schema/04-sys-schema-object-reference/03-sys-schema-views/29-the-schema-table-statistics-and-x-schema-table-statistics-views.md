#### 26.4.3.29 As visualizações schema\_table\_statistics e x$schema\_table\_statistics

Essas visualizações resumem as estatísticas da tabela. Por padrão, as linhas são ordenadas em ordem decrescente de tempo de espera total (as tabelas com mais concorrência primeiro).

Essas visualizações utilizam uma visualização auxiliar, `x$ps_schema_table_statistics_io`.

As vistas `schema_table_statistics` e `x$schema_table_statistics` têm essas colunas:

- `esquema_tabela`

  O esquema que contém a tabela.

- `nome_tabela`

  O nome da tabela.

- `total_latency`

  O tempo total de espera de eventos de E/S temporizados para a tabela.

- `rows_fetched`

  O número total de linhas lidas da tabela.

- `fetch_latency`

  O tempo total de espera de eventos de E/S de leitura com temporizador para a tabela.

- `rows_inserted`

  O número total de linhas inseridas na tabela.

- `insert_latency`

  O tempo total de espera de eventos de E/S de inserção temporizados para a tabela.

- `rows_updated`

  O número total de linhas atualizadas na tabela.

- `update_latency`

  O tempo total de espera dos eventos de E/S de atualização cronometrados para a tabela.

- `rows_deleted`

  O número total de linhas excluídas da tabela.

- `delete_latency`

  O tempo total de espera dos eventos de E/S de exclusão temporizada para a tabela.

- `io_read_requests`

  O número total de solicitações de leitura para a tabela.

- `io_read`

  O número total de bytes lidos da tabela.

- `io_read_latency`

  O tempo total de espera das leituras da tabela.

- `io_write_requests`

  O número total de solicitações de escrita para a tabela.

- `io_write`

  O número total de bytes escritos na tabela.

- `io_write_latency`

  O tempo total de espera para escrever na tabela.

- `io_misc_requests`

  O número total de solicitações de E/S variadas para a tabela.

- `io_misc_latency`

  O tempo total de espera de solicitações de E/S variadas para a tabela.
