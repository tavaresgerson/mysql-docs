#### 26.4.3.12 As visualizações io_global_by_file_by_latency e x$io_global_by_file_by_latency

Esses gráficos resumem os consumidores globais de E/S para exibir o tempo de espera por E/S, agrupados por arquivo. Por padrão, as linhas são ordenadas em ordem decrescente de latência total.

As vistas `io_global_by_file_by_latency` e `x$io_global_by_file_by_latency` possuem essas colunas:

- `arquivo`

  O nome do caminho do arquivo.

- `total`

  O número total de eventos de entrada/saída para o arquivo.

- `total_latency`

  O tempo total de espera de eventos de E/S temporizados para o arquivo.

- `count_read`

  O número total de eventos de leitura/escrita do arquivo.

- `latência_de_leitura`

  O tempo total de espera de eventos de E/S de leitura com temporizador para o arquivo.

- `count_write`

  O número total de eventos de E/S de escrita para o arquivo.

- `latency_de_escrita`

  O tempo total de espera de eventos de E/S de escrita temporizados para o arquivo.

- `count_misc`

  O número total de outros eventos de E/S para o arquivo.

- `misc_latency`

  O tempo total de espera de outros eventos de E/S com temporizador para o arquivo.
