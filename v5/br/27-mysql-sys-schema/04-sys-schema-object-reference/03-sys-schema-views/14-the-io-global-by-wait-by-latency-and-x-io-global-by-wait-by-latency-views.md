#### 26.4.3.14 As visualizações io\_global\_by\_wait\_by\_latency e x$io\_global\_by\_wait\_by\_latency

Esses pontos de vista resumem os consumidores globais de E/S para exibir a quantidade de E/S e o tempo de espera para E/S, agrupados por evento. Por padrão, as linhas são ordenadas por latência total decrescente.

As vistas `io_global_by_wait_by_latency` e `x$io_global_by_wait_by_latency` possuem essas colunas:

- `nome_do_evento`

  O nome do evento de entrada/saída, com o prefixo `wait/io/file/` removido.

- `total`

  O número total de ocorrências do evento de E/S.

- `total_latency`

  O tempo total de espera de ocorrências temporizadas do evento de E/S.

- `avg_latency`

  O tempo médio de espera por ocorrência temporizada do evento de E/S.

- `max_latency`

  O tempo de espera máximo de uma única ocorrência temporizada do evento de E/S.

- `latência_de_leitura`

  O tempo total de espera de ocorrências de leitura cronometradas do evento de E/S.

- `latency_de_escrita`

  O tempo total de espera de ocorrências de escrita temporizadas do evento de E/S.

- `misc_latency`

  O tempo total de espera de outras ocorrências temporizadas do evento de E/S.

- `count_read`

  O número de solicitações de leitura para o evento de E/S.

- `total_read`

  O número de bytes lidos para o evento de E/S.

- `avg_read`

  O número médio de bytes por leitura para o evento de E/S.

- `count_write`

  O número de solicitações de escrita para o evento de E/S.

- `total_escrito`

  O número de bytes escritos para o evento de E/S.

- `avg_escrito`

  O número médio de bytes por escrita para o evento de E/S.
