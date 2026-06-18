#### 30.4.3.41 O resumo do usuário e as visualizações do resumo do usuário x$

Essas visualizações resumem a atividade de declarações, o acesso de arquivos e as conexões, agrupadas por usuário. Por padrão, as linhas são ordenadas por latência total decrescente.

As visualizações `user_summary` e `x$user_summary` possuem essas colunas:

- `user`

  O nome de usuário do cliente. As linhas para as quais a coluna `USER` na tabela subjacente do Schema de Desempenho é `NULL` são assumidas para serem para threads de segundo plano e são relatadas com um nome de host de `background`.

- `statements`

  O número total de declarações para o usuário.

- `statement_latency`

  O tempo total de espera de declarações cronometradas para o usuário.

- `statement_avg_latency`

  O tempo médio de espera por declaração cronometrada para o usuário.

- `table_scans`

  O número total de varreduras de tabela para o usuário.

- `file_ios`

  O número total de eventos de entrada/saída de arquivos para o usuário.

- `file_io_latency`

  O tempo total de espera de eventos de E/S de arquivos com temporizador para o usuário.

- `current_connections`

  O número atual de conexões para o usuário.

- `total_connections`

  O número total de conexões para o usuário.

- `unique_hosts`

  O número de hosts distintos de onde as conexões do usuário se originaram.

- `current_memory`

  A quantidade atual de memória alocada para o usuário.

- `total_memory_allocated`

  O valor total de memória alocada para o usuário.
