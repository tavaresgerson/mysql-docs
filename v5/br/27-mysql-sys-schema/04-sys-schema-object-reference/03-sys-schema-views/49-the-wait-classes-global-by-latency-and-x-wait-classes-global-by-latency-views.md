#### 26.4.3.49 As Views wait_classes_global_by_latency e x$wait_classes_global_by_latency

Essas Views resumem as Latencies totais de classes de espera (wait class), agrupadas por classe de evento (event class). Por padrão, as linhas são ordenadas pela Latency total decrescente. Eventos inativos (Idle events) são ignorados.

Uma classe de evento é determinada removendo do nome do evento tudo após os três primeiros componentes. Por exemplo, a classe para `wait/io/file/sql/slow_log` é `wait/io/file`.

As Views `wait_classes_global_by_latency` e `x$wait_classes_global_by_latency` possuem estas colunas:

* `event_class`

  A classe do evento.

* `total`

  O número total de ocorrências de eventos na classe.

* `total_latency`

  O tempo de espera total das ocorrências temporizadas de eventos na classe (A Latency total).

* `min_latency`

  O tempo de espera mínimo de uma única ocorrência temporizada de eventos na classe (A Latency mínima).

* `avg_latency`

  O tempo de espera médio por ocorrência temporizada de eventos na classe (A Latency média).

* `max_latency`

  O tempo de espera máximo de uma única ocorrência temporizada de eventos na classe (A Latency máxima).