#### 26.4.3.50 As Views waits_by_host_by_latency e x$waits_by_host_by_latency

Essas Views sumarizam eventos de espera (wait events), agrupados por host e evento. Por padrão, as linhas são ordenadas por host e total latency descendente. Eventos inativos (Idle events) são ignorados.

As Views `waits_by_host_by_latency` e `x$waits_by_host_by_latency` contêm as seguintes colunas:

* `host`

  O host de onde a conexão se originou.

* `event`

  O nome do evento.

* `total`

  O número total de ocorrências do evento para o host.

* `total_latency`

  O tempo total de espera (wait time) de ocorrências temporizadas do evento para o host.

* `avg_latency`

  O tempo médio de espera por ocorrência temporizada do evento para o host.

* `max_latency`

  O tempo máximo de espera individual de ocorrências temporizadas do evento para o host.
