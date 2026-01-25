#### 26.4.3.13 As Views io_global_by_wait_by_bytes e x$io_global_by_wait_by_bytes

Essas Views resumem os consumidores globais de I/O para exibir a quantidade de I/O e o tempo de espera por I/O, agrupados por event. Por padrão, as linhas são ordenadas pelo total de I/O em ordem decrescente (bytes lidos e escritos).

As Views `io_global_by_wait_by_bytes` e `x$io_global_by_wait_by_bytes` possuem estas colunas:

* `event_name`

  O nome do event de I/O, com o prefixo `wait/io/file/` removido.

* `total`

  O número total de ocorrências do event de I/O.

* `total_latency`

  O tempo total de espera das ocorrências cronometradas do event de I/O.

* `min_latency`

  O tempo mínimo de espera única das ocorrências cronometradas do event de I/O.

* `avg_latency`

  O tempo médio de espera por ocorrência cronometrada do event de I/O.

* `max_latency`

  O tempo máximo de espera única das ocorrências cronometradas do event de I/O.

* `count_read`

  O número de requisições de leitura (read requests) para o event de I/O.

* `total_read`

  O número de bytes lidos para o event de I/O.

* `avg_read`

  O número médio de bytes por leitura para o event de I/O.

* `count_write`

  O número de requisições de escrita (write requests) para o event de I/O.

* `total_written`

  O número de bytes escritos para o event de I/O.

* `avg_written`

  O número médio de bytes por escrita para o event de I/O.

* `total_requested`

  O número total de bytes lidos e escritos para o event de I/O.