#### 30.4.3.1 Resumo do host e visualizações x$host_summary

Esses visualizações resumem a atividade das declarações, o E/S de arquivos e as conexões, agrupados por host.

As visualizações `host_summary` e `x$host_summary` têm as seguintes colunas:

* `host`

  O host a partir do qual o cliente se conectou. As linhas para as quais a coluna `HOST` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas como pertencentes a threads de segundo plano e são relatadas com o nome do host `background`.

* `statements`

  O número total de declarações para o host.

* `statement_latency`

  O tempo total de espera de declarações temporizadas para o host.

* `statement_avg_latency`

  O tempo de espera médio por declaração temporizada para o host.

* `table_scans`

  O número total de varreduras de tabelas para o host.

* `file_ios`

  O número total de eventos de E/S de arquivos para o host.

* `file_io_latency`

  O tempo total de espera de eventos de E/S de arquivos temporizados para o host.

* `current_connections`

  O número atual de conexões para o host.

* `total_connections`

  O número total de conexões para o host.

* `unique_users`

  O número de usuários distintos para o host.

* `current_memory`

  A quantidade atual de memória alocada para o host.

* `total_memory_allocated`

  A quantidade total de memória alocada para o host.