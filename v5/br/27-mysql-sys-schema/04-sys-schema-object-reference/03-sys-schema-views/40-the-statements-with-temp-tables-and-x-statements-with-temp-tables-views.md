#### 26.4.3.40 As declarações com tabelas temporárias e as visualizações x$declarações com tabelas temporárias

Essas visualizações listam declarações normalizadas que utilizaram tabelas temporárias. Por padrão, as linhas são ordenadas pelo número descendente de tabelas temporárias no disco usadas e pelo número descendente de tabelas temporárias na memória usadas.

As views `statements_with_temp_tables` e `x$statements_with_temp_tables` possuem as seguintes colunas:

- `consulta`

  A string de declaração normalizada.

- `db`

  O banco de dados padrão para a declaração, ou `NULL` se não houver nenhum.

- `exec_count`

  O número total de vezes que a declaração foi executada.

- `total_latency`

  O tempo total de espera de ocorrências temporizadas da declaração.

- `memory_tmp_tables`

  O número total de tabelas temporárias internas de memória criadas por ocorrências da declaração.

- `disk_tmp_tables`

  O número total de tabelas temporárias internas no disco criadas por ocorrências da declaração.

- `avg_tmp_tables_per_query`

  O número médio de tabelas temporárias internas criadas por cada ocorrência da declaração.

- `tmp_tables_to_disk_pct`

  A porcentagem de tabelas temporárias internas em memória que foram convertidas em tabelas em disco.

- `primeiro_avistado`

  O momento em que a declaração foi vista pela primeira vez.

- `última_visualização`

  O horário em que a declaração foi vista pela última vez.

- `digest`

  O resumo da declaração.
