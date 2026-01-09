#### 26.4.3.1 As visualizações host_summary e x$host_summary

Essas visualizações resumem a atividade de declarações, o acesso de arquivos e as conexões, agrupadas por host.

As views `host_summary` e `x$host_summary` possuem essas colunas:

- `host`

  O host a partir do qual o cliente se conectou. As linhas para as quais a coluna `HOST` na tabela subjacente do Gerenciamento de Desempenho é `NULL` são assumidas como pertencentes a threads de segundo plano e são relatadas com o nome do host `background`.

- `declarações`

  O número total de declarações para o anfitrião.

- `statement_latency`

  O tempo total de espera de declarações cronometradas para o host.

- `declaração_latência_média`

  O tempo médio de espera por declaração cronometrada para o anfitrião.

- `table_scans`

  O número total de varreduras de tabela para o host.

- `file_ios`

  O número total de eventos de E/S de arquivos para o host.

- `file_io_latency`

  O tempo total de espera de eventos de E/S de arquivos com temporizador para o host.

- `conexões atuais`

  O número atual de conexões para o host.

- `total_connections`

  O número total de conexões para o host.

- `usuários únicos`

  O número de usuários distintos para o host.

- `memória_atual`

  A quantidade atual de memória alocada para o host.

- `total_memory_allocated`

  O valor total de memória alocada para o host.
