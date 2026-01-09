#### 30.4.3.3 As visualizações host_summary_by_file_io_type e x$host_summary_by_file_io_type

Essas visualizações resumem o I/O de arquivos, agrupadas por host e tipo de evento. Por padrão, as linhas são ordenadas por host e latência total descendente do evento.

As visualizações `host_summary_by_file_io_type` e `x$host_summary_by_file_io_type` têm essas colunas:

* `host`

  O host do qual o cliente se conectou. As linhas para as quais a coluna `HOST` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas como pertencentes a threads de segundo plano e são relatadas com o nome do host `background`.

* `event_name`

  O nome do evento de I/O de arquivo.

* `total`

  O número total de ocorrências do evento de I/O de arquivo para o host.

* `total_latency`

  O tempo de espera total das ocorrências temporizadas do evento de I/O de arquivo para o host.

* `max_latency`

  O tempo de espera máximo de uma única ocorrência temporizada do evento de I/O de arquivo para o host.