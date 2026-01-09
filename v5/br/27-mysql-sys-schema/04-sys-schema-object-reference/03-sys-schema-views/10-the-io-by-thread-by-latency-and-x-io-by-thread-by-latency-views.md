#### 26.4.3.10 As visualizações io_by_thread_by_latency e x$io_by_thread_by_latency

Esses pontos de vista resumem os consumidores de E/S para exibir o tempo de espera por E/S, agrupados por thread. Por padrão, as linhas são ordenadas em ordem decrescente de latência total de E/S.

As vistas `io_by_thread_by_latency` e `x$io_by_thread_by_latency` possuem essas colunas:

- `usuário`

  Para os threads de primeiro plano, a conta associada ao thread. Para os threads de segundo plano, o nome do thread.

- `total`

  O número total de eventos de entrada/saída para o thread.

- `total_latency`

  O tempo total de espera de eventos de E/S temporizados para a thread.

- `min_latency`

  O tempo de espera mínimo individual para eventos de E/S temporizados para a thread.

- `avg_latency`

  O tempo de espera médio por evento de E/S temporizado para a thread.

- `max_latency`

  O tempo de espera máximo de um único evento de E/S com temporizador para a thread.

- `thread_id`

  O ID do fio.

- `processlist_id`

  Para os threads de primeiro plano, o ID do processo do thread. Para os threads de segundo plano, `NULL`.
