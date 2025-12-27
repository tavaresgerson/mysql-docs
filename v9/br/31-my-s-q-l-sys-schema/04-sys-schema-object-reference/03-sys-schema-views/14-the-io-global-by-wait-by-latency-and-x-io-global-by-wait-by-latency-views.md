#### 30.4.3.14 As visualizações io\_global\_by\_wait\_by\_latency e x$io\_global\_by\_wait\_by\_latency

Essas visualizações resumem os consumidores de E/S globais para exibir a quantidade de E/S e o tempo de espera para o E/S, agrupados por evento. Por padrão, as linhas são ordenadas em ordem decrescente de latência total.

As visualizações `io_global_by_wait_by_latency` e `x$io_global_by_wait_by_latency` têm essas colunas:

* `event_name`

  O nome do evento de E/S, com o prefixo `wait/io/file/` removido.

* `total`

  O número total de ocorrências do evento de E/S.

* `total_latency`

  O tempo total de espera das ocorrências temporizadas do evento de E/S.

* `avg_latency`

  O tempo de espera médio por ocorrência temporizada do evento de E/S.

* `max_latency`

  O tempo de espera máximo de uma única ocorrência temporizada do evento de E/S.

* `read_latency`

  O tempo total de espera das ocorrências temporizadas de leitura do E/S.

* `write_latency`

  O tempo total de espera das ocorrências temporizadas de escrita do E/S.

* `misc_latency`

  O tempo total de espera das ocorrências temporizadas de outros tipos do E/S.

* `count_read`

  O número de solicitações de leitura para o evento de E/S.

* `total_read`

  O número de bytes lidos para o evento de E/S.

* `avg_read`

  O número médio de bytes por leitura para o evento de E/S.

* `count_write`

  O número de solicitações de escrita para o evento de E/S.

* `total_written`

  O número de bytes escritos para o evento de E/S.

* `avg_written`

  O número médio de bytes por escrita para o evento de E/S.