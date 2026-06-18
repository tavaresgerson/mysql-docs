#### 26.4.3.51 As Views waits_by_user_by_latency e x$waits_by_user_by_latency

Essas Views resumem eventos de espera (wait events), agrupados por user e event. Por padrão, as linhas são ordenadas por user e total latency descendente. Eventos ociosos (Idle events) são ignorados.

As Views `waits_by_user_by_latency` e `x$waits_by_user_by_latency` possuem estas colunas:

* `user`

  O user associado à conexão.

* `event`

  O nome do event.

* `total`

  O número total de ocorrências do event para o user.

* `total_latency`

  O tempo total de espera (wait time) das ocorrências cronometradas do event para o user.

* `avg_latency`

  O tempo médio de espera (wait time) por ocorrência cronometrada do event para o user.

* `max_latency`

  O tempo máximo de espera (wait time) de uma única ocorrência cronometrada do event para o user.