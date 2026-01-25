#### 26.4.3.48 As Views wait_classes_global_by_avg_latency e x$wait_classes_global_by_avg_latency

Essas views resumem as average latencies (latências médias) das classes de wait, agrupadas por event class. Por padrão, as linhas são ordenadas pela average latency decrescente. Eventos Idle são ignorados.

Uma event class é determinada removendo do nome do event tudo após os três primeiros componentes. Por exemplo, a class para `wait/io/file/sql/slow_log` é `wait/io/file`.

As views `wait_classes_global_by_avg_latency` e `x$wait_classes_global_by_avg_latency` possuem estas colunas:

* `event_class`

  A event class.

* `total`

  O número total de ocorrências de events na class.

* `total_latency`

  O tempo total de wait de ocorrências temporizadas de events na class.

* `min_latency`

  O tempo mínimo de single wait de ocorrências temporizadas de events na class.

* `avg_latency`

  O tempo médio de wait por ocorrência temporizada de events na class.

* `max_latency`

  O tempo máximo de single wait de ocorrências temporizadas de events na class.