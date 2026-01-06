#### 26.4.3.50 As visualizações waits\_by\_host\_by\_latency e x$waits\_by\_host\_by\_latency

Esses pontos de vista resumem eventos de espera, agrupados por host e evento. Por padrão, as linhas são ordenadas por host e latência total decrescente. Eventos em espera são ignorados.

As vistas `waits_by_host_by_latency` e `x$waits_by_host_by_latency` possuem essas colunas:

- `host`

  O host a partir do qual a conexão se originou.

- `evento`

  O nome do evento.

- `total`

  O número total de ocorrências do evento para o anfitrião.

- `total_latency`

  O tempo total de espera de ocorrências temporizadas do evento para o anfitrião.

- `avg_latency`

  O tempo médio de espera por ocorrência cronometrada do evento para o anfitrião.

- `max_latency`

  O tempo de espera máximo de uma única ocorrência temporizada do evento para o anfitrião.
