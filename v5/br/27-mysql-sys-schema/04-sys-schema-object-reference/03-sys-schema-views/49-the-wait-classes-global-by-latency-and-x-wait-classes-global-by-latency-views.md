#### 26.4.3.49 As visualizações wait\_classes\_global\_by\_latency e x$wait\_classes\_global\_by\_latency

Esses gráficos resumem as latências totais da classe de espera, agrupadas por classe de evento. Por padrão, as linhas são ordenadas em ordem decrescente de latência total. Os eventos em espera são ignorados.

Uma classe de evento é determinada removendo tudo após os três primeiros componentes do nome do evento. Por exemplo, a classe para `wait/io/file/sql/slow_log` é `wait/io/file`.

As views `wait_classes_global_by_latency` e `x$wait_classes_global_by_latency` possuem essas colunas:

- `event_class`

  A classe de eventos.

- `total`

  O número total de ocorrências de eventos na classe.

- `total_latency`

  O tempo total de espera de ocorrências temporizadas de eventos na classe.

- `min_latency`

  O tempo de espera mínimo para uma única ocorrência de eventos na classe.

- `avg_latency`

  O tempo médio de espera por ocorrência cronometrada de eventos na classe.

- `max_latency`

  O tempo máximo de espera de uma única ocorrência temporizada de eventos na classe.
