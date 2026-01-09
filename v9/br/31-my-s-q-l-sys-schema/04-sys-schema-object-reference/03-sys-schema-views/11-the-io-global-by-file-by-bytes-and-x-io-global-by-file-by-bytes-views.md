#### 30.4.3.11 As visualizações io_global_by_file_by_bytes e x$io_global_by_file_by_bytes

Essas visualizações resumem os consumidores de E/S globais para exibir a quantidade de E/S, agrupada por arquivo. Por padrão, as linhas são ordenadas em ordem decrescente do total de E/S (bytes lidos e escritos).

As colunas das visualizações `io_global_by_file_by_bytes` e `x$io_global_by_file_by_bytes` são:

* `file`

  O nome do caminho do arquivo.

* `count_read`

  O número total de eventos de leitura para o arquivo.

* `total_read`

  O número total de bytes lidos do arquivo.

* `avg_read`

  O número médio de bytes por leitura do arquivo.

* `count_write`

  O número total de eventos de escrita para o arquivo.

* `total_written`

  O número total de bytes escritos para o arquivo.

* `avg_write`

  O número médio de bytes por escrita para o arquivo.

* `total`

  O número total de bytes lidos e escritos para o arquivo.

* `write_pct`

  A porcentagem do total de bytes de E/S que foram escritas.