#### 26.4.3.1 As Views host_summary e x$host_summary

Essas Views resumem a atividade de *statement*, o I/O de arquivos e as *connections*, agrupadas por *host*.

As Views `host_summary` e `x$host_summary` possuem as seguintes colunas:

* `host`

  O *host* a partir do qual o cliente se conectou. Linhas para as quais a coluna `HOST` na tabela subjacente do *Performance Schema* é `NULL` são consideradas para *background threads* e são reportadas com um nome de *host* de `background`.

* `statements`

  O número total de *statements* para o *host*.

* `statement_latency`

  O tempo total de espera de *statements* cronometrados para o *host*.

* `statement_avg_latency`

  O tempo médio de espera por *statement* cronometrado para o *host*.

* `table_scans`

  O número total de *table scans* para o *host*.

* `file_ios`

  O número total de eventos de I/O de arquivo para o *host*.

* `file_io_latency`

  O tempo total de espera de eventos de I/O de arquivo cronometrados para o *host*.

* `current_connections`

  O número atual de *connections* para o *host*.

* `total_connections`

  O número total de *connections* para o *host*.

* `unique_users`

  O número de usuários distintos para o *host*.

* `current_memory`

  A quantidade atual de *memory* alocada para o *host*.

* `total_memory_allocated`

  A quantidade total de *memory* alocada para o *host*.