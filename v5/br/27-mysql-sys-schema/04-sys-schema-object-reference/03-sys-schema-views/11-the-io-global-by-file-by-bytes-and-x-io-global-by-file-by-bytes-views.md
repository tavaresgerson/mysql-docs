#### 26.4.3.11 As Views io_global_by_file_by_bytes e x$io_global_by_file_by_bytes

Essas Views resumem os consumidores globais de I/O para exibir a quantidade de I/O, agrupada por arquivo. Por padrão, as linhas são ordenadas pelo total de I/O decrescente (bytes lidos e escritos).

As Views `io_global_by_file_by_bytes` e `x$io_global_by_file_by_bytes` possuem estas colunas:

* `file`

  O nome do caminho do arquivo (file path name).

* `count_read`

  O número total de eventos de Read para o arquivo.

* `total_read`

  O número total de bytes lidos do arquivo.

* `avg_read`

  O número médio de bytes por operação de Read do arquivo.

* `count_write`

  O número total de eventos de Write para o arquivo.

* `total_written`

  O número total de bytes escritos no arquivo.

* `avg_write`

  O número médio de bytes por operação de Write no arquivo.

* `total`

  O número total de bytes Read e Written para o arquivo.

* `write_pct`

  A porcentagem do total de bytes de I/O que foram operações de Write.