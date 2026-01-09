#### 26.4.3.52 As visualizações waits_global_by_latency e x$waits_global_by_latency

Esses pontos de vista resumem os eventos de espera, agrupados por evento. Por padrão, as linhas são ordenadas por latência total decrescente. Os eventos em espera são ignorados.

As vistas `waits_global_by_latency` e `x$waits_global_by_latency` têm essas colunas:

- eventos

  O nome do evento.

- `total`

  O número total de ocorrências do evento.

- `total_latency`

  O tempo total de espera de ocorrências temporizadas do evento.

- `avg_latency`

  O tempo médio de espera por ocorrência cronometrada do evento.

- `max_latency`

  O tempo de espera máximo de uma única ocorrência temporizada do evento.
