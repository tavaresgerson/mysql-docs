#### 30.4.3.51 As visualizações waits\_by\_user\_by\_latency e x$waits\_by\_user\_by\_latency

Essas visualizações resumem os eventos de espera, agrupados por usuário e evento. Por padrão, as linhas são ordenadas por usuário e por tempo total de espera em ordem decrescente. Os eventos em espera são ignorados.

As visualizações `waits_by_user_by_latency` e `x$waits_by_user_by_latency` têm as seguintes colunas:

* `user`

  O usuário associado à conexão.

* `event`

  O nome do evento.

* `total`

  O número total de ocorrências do evento para o usuário.

* `total_latency`

  O tempo total de espera de ocorrências temporizadas do evento para o usuário.

* `avg_latency`

  O tempo médio de espera por ocorrência temporizada do evento para o usuário.

* `max_latency`

  O tempo de espera único máximo de ocorrências temporizadas do evento para o usuário.