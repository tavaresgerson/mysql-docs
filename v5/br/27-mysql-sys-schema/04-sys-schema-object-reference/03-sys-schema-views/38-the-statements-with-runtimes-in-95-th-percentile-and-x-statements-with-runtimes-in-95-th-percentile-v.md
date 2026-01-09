#### 26.4.3.38 declarações_com_runtimes_no_95º percentil e x$declarações_com_runtimes_no_95º percentil Visualizações

Essas visualizações listam declarações com tempos de execução no 95º percentil. Por padrão, as linhas são ordenadas por latência média decrescente.

Ambas as visualizações utilizam duas visualizações auxiliares, `x$ps_digest_avg_latency_distribution` e `x$ps_digest_95th_percentile_by_avg_us`.

As visualizações `statements_with_runtimes_in_95th_percentile` e `x$statements_with_runtimes_in_95th_percentile` possuem essas colunas:

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

- `rows_sent`

  O número total de linhas devolvidas por ocorrências da declaração.

- `rows_sent_avg`

  O número médio de linhas devolvidas por ocorrência da declaração.

- `rows_examined`

  O número total de linhas lidas dos motores de armazenamento por ocorrências da declaração.

- `rows_examined_avg`

  O número médio de linhas lidas dos motores de armazenamento por ocorrência da declaração.

- `primeiro_avistado`

  O momento em que a declaração foi vista pela primeira vez.

- `última_visualização`

  O horário em que a declaração foi vista pela última vez.

- `digest`

  O resumo da declaração.
