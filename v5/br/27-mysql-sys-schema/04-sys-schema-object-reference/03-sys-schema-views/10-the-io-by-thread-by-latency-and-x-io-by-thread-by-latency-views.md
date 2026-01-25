#### 26.4.3.10 As Views io_by_thread_by_latency e x$io_by_thread_by_latency

Estas Views resumem os consumidores de I/O para exibir o tempo de espera por I/O, agrupados por Thread. Por padrão, as linhas são ordenadas pela Latency total de I/O em ordem decrescente.

As Views `io_by_thread_by_latency` e `x$io_by_thread_by_latency` possuem as seguintes colunas:

* `user`

  Para Threads de primeiro plano (foreground), a conta associada à Thread. Para Threads de segundo plano (background), o nome da Thread.

* `total`

  O número total de eventos de I/O para a Thread.

* `total_latency`

  O tempo de espera total de eventos de I/O cronometrados para a Thread.

* `min_latency`

  O tempo de espera mínimo único de eventos de I/O cronometrados para a Thread.

* `avg_latency`

  O tempo de espera médio por evento de I/O cronometrado para a Thread.

* `max_latency`

  O tempo de espera máximo único de eventos de I/O cronometrados para a Thread.

* `thread_id`

  O ID da Thread.

* `processlist_id`

  Para Threads de primeiro plano (foreground), o ID do processlist da Thread. Para Threads de segundo plano (background), `NULL`.