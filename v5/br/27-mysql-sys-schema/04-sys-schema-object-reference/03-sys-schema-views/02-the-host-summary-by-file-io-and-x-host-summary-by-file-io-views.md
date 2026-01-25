#### 26.4.3.2 As Views host_summary_by_file_io e x$host_summary_by_file_io

Estas views sumarizam o I/O de arquivo, agrupado por host. Por padrão, as linhas são ordenadas pela latência total de I/O de arquivo em ordem decrescente.

As views `host_summary_by_file_io` e `x$host_summary_by_file_io` possuem as seguintes colunas:

* `host`

  O host do qual o cliente se conectou. Linhas para as quais a coluna `HOST` na tabela subjacente do Performance Schema é `NULL` são consideradas como pertencentes a background threads e são reportadas com o nome de host `background`.

* `ios`

  O número total de eventos de I/O de arquivo para o host.

* `io_latency`

  O tempo de espera total de eventos de I/O de arquivo cronometrados para o host.