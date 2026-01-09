#### 26.4.3.35 A análise da declaração e as visualizações x$statement_analysis

Essas visualizações listam declarações normalizadas com estatísticas agregadas. O conteúdo imita a visualização de Análise de Consulta do MySQL Enterprise Monitor. Por padrão, as linhas são ordenadas por latência total decrescente.

As views `statement_analysis` e `x$statement_analysis` possuem essas colunas:

- `consulta`

  A string de declaração normalizada.

- `db`

  O banco de dados padrão para a declaração, ou `NULL` se não houver nenhum.

- `full_scan`

  O número total de varreduras completas da tabela realizadas por ocorrências da declaração.

- `exec_count`

  O número total de vezes que a declaração foi executada.

- `err_count`

  O número total de erros produzidos por ocorrências da declaração.

- `warn_count`

  O número total de avisos gerados por ocorrências da declaração.

- `total_latency`

  O tempo total de espera de ocorrências temporizadas da declaração.

- `max_latency`

  O tempo de espera máximo de uma única ocorrência temporizada da declaração.

- `avg_latency`

  O tempo médio de espera por ocorrência cronometrada da declaração.

- `lock_latency`

  O tempo total de espera por bloqueios por ocorrências temporizadas da declaração.

- `rows_sent`

  O número total de linhas devolvidas por ocorrências da declaração.

- `rows_sent_avg`

  O número médio de linhas devolvidas por ocorrência da declaração.

- `rows_examined`

  O número total de linhas lidas dos motores de armazenamento por ocorrências da declaração.

- `rows_examined_avg`

  O número médio de linhas lidas dos motores de armazenamento por ocorrência da declaração.

- `rows_affected`

  O número total de linhas afetadas por ocorrências da declaração.

- `rows_affected_avg`

  O número médio de linhas afetadas por cada ocorrência da declaração.

- `tmp_tables`

  O número total de tabelas temporárias internas de memória criadas por ocorrências da declaração.

- `tmp_disk_tables`

  O número total de tabelas temporárias internas no disco criadas por ocorrências da declaração.

- `rows_sorted`

  O número total de linhas classificadas por ocorrências da declaração.

- `sort_merge_passes`

  O número total de passes de fusão de classificação por ocorrências da declaração.

- `digest`

  O resumo da declaração.

- `primeiro_avistado`

  O momento em que a declaração foi vista pela primeira vez.

- `última_visualização`

  O horário em que a declaração foi vista pela última vez.
