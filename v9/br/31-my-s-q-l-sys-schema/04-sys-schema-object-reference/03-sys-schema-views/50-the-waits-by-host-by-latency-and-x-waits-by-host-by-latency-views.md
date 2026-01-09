#### 30.4.3.50 As visualizações waits_by_host_by_latency e x$waits_by_host_by_latency

Essas visualizações resumem os eventos de espera, agrupados por host e evento. Por padrão, as linhas são ordenadas por host e por tempo de latência decrescente. Os eventos em espera são ignorados.

As visualizações `waits_by_host_by_latency` e `x$waits_by_host_by_latency` têm as seguintes colunas:

* `host`

  O host de onde a conexão se originou.

* `event`

  O nome do evento.

* `total`

  O número total de ocorrências do evento para o host.

* `total_latency`

  O tempo total de espera de ocorrências temporizadas do evento para o host.

* `avg_latency`

  O tempo de espera médio por ocorrência temporizada do evento para o host.

* `max_latency`

  O tempo de espera máximo de uma única ocorrência temporizada do evento para o host.