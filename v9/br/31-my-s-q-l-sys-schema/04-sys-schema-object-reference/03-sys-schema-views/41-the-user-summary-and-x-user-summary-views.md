#### 30.4.3.41 Resumo do usuário e visualizações x$user_summary

Esses visualizações resumem a atividade de declarações, o E/S de arquivos e as conexões, agrupados por usuário. Por padrão, as linhas são ordenadas em ordem decrescente de latência total.

Os visualizações `user_summary` e `x$user_summary` têm essas colunas:

* `user`

  O nome do usuário do cliente. As linhas para as quais a coluna `USER` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas como pertencentes a threads de segundo plano e são relatadas com o nome do host `background`.

* `statements`

  O número total de declarações para o usuário.

* `statement_latency`

  O tempo total de espera de declarações temporizadas para o usuário.

* `statement_avg_latency`

  O tempo de espera médio por declaração temporizada para o usuário.

* `table_scans`

  O número total de varreduras de tabela para o usuário.

* `file_ios`

  O número total de eventos de E/S de arquivos para o usuário.

* `file_io_latency`

  O tempo total de espera de eventos de E/S de arquivos temporizados para o usuário.

* `current_connections`

  O número atual de conexões para o usuário.

* `total_connections`

  O número total de conexões para o usuário.

* `unique_hosts`

  O número de hosts distintos de onde as conexões para o usuário se originaram.

* `current_memory`

  A quantidade atual de memória alocada para o usuário.

* `total_memory_allocated`

  A quantidade total de memória alocada para o usuário.