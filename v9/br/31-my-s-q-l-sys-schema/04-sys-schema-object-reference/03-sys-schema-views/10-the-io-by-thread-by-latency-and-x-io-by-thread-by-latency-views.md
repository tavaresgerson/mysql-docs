#### 30.4.3.10 As visualizações io_by_thread_by_latency e x$io_by_thread_by_latency

Essas visualizações resumem os consumidores de I/O para exibir o tempo de espera por I/O, agrupados por thread. Por padrão, as linhas são ordenadas em ordem decrescente do tempo total de latência de I/O.

As visualizações `io_by_thread_by_latency` e `x$io_by_thread_by_latency` têm essas colunas:

* `user`

  Para threads em primeiro plano, a conta associada ao thread. Para threads em segundo plano, o nome do thread.

* `total`

  O número total de eventos de I/O para o thread.

* `total_latency`

  O tempo total de espera dos eventos de I/O com temporizador para o thread.

* `min_latency`

  O tempo de espera mínimo de um único evento de I/O com temporizador para o thread.

* `avg_latency`

  O tempo de espera médio por evento de I/O com temporizador para o thread.

* `max_latency`

  O tempo de espera máximo de um único evento de I/O com temporizador para o thread.

* `thread_id`

  O ID do thread.

* `processlist_id`

  Para threads em primeiro plano, o ID do processlist do thread. Para threads em segundo plano, `NULL`.