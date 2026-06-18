#### 26.4.3.52 As Views waits_global_by_latency e x$waits_global_by_latency

Essas views resumem eventos de espera (wait events), agrupados por evento. Por padrão, as linhas são ordenadas pela latência total (total latency) decrescente. Eventos ociosos (idle events) são ignorados.

As views `waits_global_by_latency` e `x$waits_global_by_latency` possuem as seguintes colunas:

* `events`

  O nome do evento.

* `total`

  O número total de ocorrências do evento.

* `total_latency`

  O tempo total de espera (wait time) das ocorrências cronometradas do evento.

* `avg_latency`

  O tempo médio de espera (wait time) por ocorrência cronometrada do evento.

* `max_latency`

  O tempo máximo de espera (wait time) individual das ocorrências cronometradas do evento.