#### 30.4.3.2 As visualizações host_summary_by_file_io e x$host_summary_by_file_io

Essas visualizações resumem o I/O de arquivos, agrupados por host. Por padrão, as linhas são ordenadas em ordem decrescente de latência total de I/O de arquivos.

As visualizações `host_summary_by_file_io` e `x$host_summary_by_file_io` têm essas colunas:

* `host`

  O host a partir do qual o cliente se conectou. As linhas para as quais a coluna `HOST` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas como pertencentes a threads de segundo plano e são relatadas com o nome do host `background`.

* `ios`

  O número total de eventos de I/O de arquivos para o host.

* `io_latency`

  O tempo total de espera dos eventos de I/O de arquivos com temporizador para o host.