#### 30.4.3.48 As visualizações wait\_classes\_global\_by\_avg\_latency e x$wait\_classes\_global\_by\_avg\_latency

Essas visualizações resumem as latências médias das classes de espera, agrupadas por classe de evento. Por padrão, as linhas são ordenadas em ordem decrescente de latência média. Os eventos em espera são ignorados.

Uma classe de evento é determinada removendo tudo após os três primeiros componentes do nome do evento. Por exemplo, a classe para `wait/io/file/sql/slow_log` é `wait/io/file`.

As visualizações `wait_classes_global_by_avg_latency` e `x$wait_classes_global_by_avg_latency` têm essas colunas:

* `event_class`

  A classe de evento.

* `total`

  O número total de ocorrências de eventos na classe.

* `total_latency`

  O tempo total de espera de ocorrências temporizadas de eventos na classe.

* `min_latency`

  O tempo de espera único mínimo de ocorrências temporizadas de eventos na classe.

* `avg_latency`

  O tempo de espera médio por ocorrência temporizada de eventos na classe.

* `max_latency`

  O tempo de espera único máximo de ocorrências temporizadas de eventos na classe.