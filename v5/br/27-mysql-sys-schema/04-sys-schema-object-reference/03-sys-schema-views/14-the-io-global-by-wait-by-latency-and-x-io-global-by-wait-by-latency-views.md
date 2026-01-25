#### 26.4.3.14 As Views io_global_by_wait_by_latency e x$io_global_by_wait_by_latency

Essas Views resumem os consumidores globais de I/O para exibir a quantidade de I/O e o tempo de espera por I/O, agrupados por evento. Por padrão, as linhas são ordenadas pela Latency total descendente.

As Views `io_global_by_wait_by_latency` e `x$io_global_by_wait_by_latency` possuem as seguintes colunas:

* `event_name`

  O nome do evento de I/O, com o prefixo `wait/io/file/` removido.

* `total`

  O número total de ocorrências do evento de I/O.

* `total_latency`

  O tempo total de espera de ocorrências cronometradas do evento de I/O.

* `avg_latency`

  O tempo médio de espera por ocorrência cronometrada do evento de I/O.

* `max_latency`

  O tempo máximo de espera única de ocorrências cronometradas do evento de I/O.

* `read_latency`

  O tempo total de espera de ocorrências de leitura (read) cronometradas do evento de I/O.

* `write_latency`

  O tempo total de espera de ocorrências de escrita (write) cronometradas do evento de I/O.

* `misc_latency`

  O tempo total de espera de outras ocorrências cronometradas do evento de I/O.

* `count_read`

  O número de requisições de leitura (read) para o evento de I/O.

* `total_read`

  O número de bytes lidos (read) para o evento de I/O.

* `avg_read`

  O número médio de bytes por leitura (read) para o evento de I/O.

* `count_write`

  O número de requisições de escrita (write) para o evento de I/O.

* `total_written`

  O número de bytes escritos (written) para o evento de I/O.

* `avg_written`

  O número médio de bytes por escrita (write) para o evento de I/O.