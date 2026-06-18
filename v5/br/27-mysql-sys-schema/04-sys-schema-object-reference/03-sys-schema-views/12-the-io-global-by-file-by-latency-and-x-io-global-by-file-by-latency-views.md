#### 26.4.3.12 As Views io_global_by_file_by_latency e x$io_global_by_file_by_latency

Essas views resumem os consumidores globais de I/O para exibir o tempo de espera por I/O, agrupado por arquivo. Por padrão, as linhas são ordenadas pela total latency decrescente.

As views `io_global_by_file_by_latency` e `x$io_global_by_file_by_latency` possuem estas colunas:

* `file`

  O nome do caminho do arquivo (file path name).

* `total`

  O número total de eventos de I/O para o arquivo.

* `total_latency`

  O tempo total de espera de eventos de I/O cronometrados para o arquivo.

* `count_read`

  O número total de eventos de I/O de leitura (read) para o arquivo.

* `read_latency`

  O tempo total de espera de eventos de I/O de leitura cronometrados para o arquivo.

* `count_write`

  O número total de eventos de I/O de escrita (write) para o arquivo.

* `write_latency`

  O tempo total de espera de eventos de I/O de escrita cronometrados para o arquivo.

* `count_misc`

  O número total de outros eventos de I/O para o arquivo.

* `misc_latency`

  O tempo total de espera de outros eventos de I/O cronometrados para o arquivo.