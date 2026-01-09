#### 30.4.3.12 As visualizações io_global_by_file_by_latency e x$io_global_by_file_by_latency

Essas visualizações resumem os consumidores de E/S globais para exibir o tempo de espera por E/S, agrupados por arquivo. Por padrão, as linhas são ordenadas em ordem decrescente de latência total.

As visualizações `io_global_by_file_by_latency` e `x$io_global_by_file_by_latency` têm as seguintes colunas:

* `file`

  O nome do caminho do arquivo.

* `total`

  O número total de eventos de E/S para o arquivo.

* `total_latency`

  O tempo total de espera dos eventos de E/S temporizados para o arquivo.

* `count_read`

  O número total de eventos de E/S de leitura para o arquivo.

* `read_latency`

  O tempo total de espera dos eventos de E/S de leitura temporizados para o arquivo.

* `count_write`

  O número total de eventos de E/S de escrita para o arquivo.

* `write_latency`

  O tempo total de espera dos eventos de E/S de escrita temporizados para o arquivo.

* `count_misc`

  O número total de outros eventos de E/S para o arquivo.

* `misc_latency`

  O tempo total de espera dos eventos de E/S outros temporizados para o arquivo.