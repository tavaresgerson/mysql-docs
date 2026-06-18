#### 26.4.3.3 As Views host_summary_by_file_io_type e x$host_summary_by_file_io_type

Essas Views resumem o I/O de arquivo, agrupado por Host e tipo de evento. Por padrão, as linhas são ordenadas por Host e latência total de I/O descendente.

As Views `host_summary_by_file_io_type` e `x$host_summary_by_file_io_type` possuem as seguintes colunas:

* `host`

  O Host do qual o cliente se conectou. Linhas para as quais a coluna `HOST` na tabela subjacente do Performance Schema é `NULL` são consideradas como pertencentes a *background threads* e são relatadas com o nome de Host como `background`.

* `event_name`

  O nome do evento de I/O de arquivo.

* `total`

  O número total de ocorrências do evento de I/O de arquivo para o Host.

* `total_latency`

  O tempo de espera total de ocorrências cronometradas do evento de I/O de arquivo para o Host.

* `max_latency`

  O tempo máximo de espera único de ocorrências cronometradas do evento de I/O de arquivo para o Host.