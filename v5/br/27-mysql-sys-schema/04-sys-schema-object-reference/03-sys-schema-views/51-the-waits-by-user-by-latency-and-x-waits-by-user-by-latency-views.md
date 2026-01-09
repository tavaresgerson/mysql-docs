#### 26.4.3.51 As visualizações waits_by_user_by_latency e x$waits_by_user_by_latency

Esses pontos de vista resumem eventos de espera, agrupados por usuário e evento. Por padrão, as linhas são ordenadas por usuário e latência total decrescente. Eventos em espera são ignorados.

As views `waits_by_user_by_latency` e `x$waits_by_user_by_latency` possuem essas colunas:

- `usuário`

  O usuário associado à conexão.

- `evento`

  O nome do evento.

- `total`

  O número total de ocorrências do evento para o usuário.

- `total_latency`

  O tempo total de espera de ocorrências temporizadas do evento para o usuário.

- `avg_latency`

  O tempo médio de espera por ocorrência cronometrada do evento para o usuário.

- `max_latency`

  O tempo de espera máximo de uma única ocorrência temporizada do evento para o usuário.
