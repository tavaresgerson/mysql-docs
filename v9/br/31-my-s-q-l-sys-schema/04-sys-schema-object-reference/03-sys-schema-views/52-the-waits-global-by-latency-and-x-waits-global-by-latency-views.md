#### 30.4.3.52 As visualizações waits\_global\_by\_latency e x$waits\_global\_by\_latency

Essas visualizações resumem os eventos de espera, agrupados por evento. Por padrão, as linhas são ordenadas em ordem decrescente de latência total. Os eventos em espera são ignorados.

As visualizações `waits_global_by_latency` e `x$waits_global_by_latency` têm as seguintes colunas:

* `events`

  O nome do evento.

* `total`

  O número total de ocorrências do evento.

* `total_latency`

  O tempo total de espera das ocorrências temporizadas do evento.

* `avg_latency`

  O tempo médio de espera por ocorrência temporizada do evento.

* `max_latency`

  O tempo de espera máximo de uma única ocorrência temporizada do evento.