#### 30.4.3.1 As visualizações host\_summary e x$host\_summary

Essas visualizações resumem a atividade de declarações, o acesso de arquivos e as conexões, agrupadas por host.

As visualizações `host_summary` e `x$host_summary` possuem essas colunas:

- `host`

  O host a partir do qual o cliente se conectou. As linhas para as quais a coluna `HOST` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas para serem para threads de segundo plano e são relatadas com o nome do host `background`.

- `statements`

  O número total de declarações para o anfitrião.

- `statement_latency`

  O tempo total de espera de declarações cronometradas para o host.

- `statement_avg_latency`

  O tempo médio de espera por declaração cronometrada para o anfitrião.

- `table_scans`

  O número total de varreduras de tabela para o host.

- `file_ios`

  O número total de eventos de E/S de arquivos para o host.

- `file_io_latency`

  O tempo total de espera de eventos de E/S de arquivos com temporizador para o host.

- `current_connections`

  O número atual de conexões para o host.

- `total_connections`

  O número total de conexões para o host.

- `unique_users`

  O número de usuários distintos para o host.

- `current_memory`

  A quantidade atual de memória alocada para o host.

- `total_memory_allocated`

  O valor total de memória alocada para o host.
