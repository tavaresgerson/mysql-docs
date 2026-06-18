#### 30.4.3.9 As visualizações innodb\_lock\_waits e x$innodb\_lock\_waits

Esses pontos de vista resumem as bloqueadoras `InnoDB` nas quais as transações estão aguardando. Por padrão, as linhas são ordenadas por idade de bloqueio decrescente.

As visualizações `innodb_lock_waits` e `x$innodb_lock_waits` possuem essas colunas:

- `wait_started`

  O horário em que o bloqueio começou.

- `wait_age`

  Quanto tempo a trava foi aguardada, como um valor `TIME`.

- `wait_age_secs`

  Quanto tempo o bloqueio foi aguardado, em segundos.

- `locked_table_schema`

  O esquema que contém a tabela bloqueada.

- `locked_table_name`

  O nome da tabela bloqueada.

- `locked_table_partition`

  O nome da partição bloqueada, se houver; `NULL` caso contrário.

- `locked_table_subpartition`

  O nome da subpartição bloqueada, se houver; `NULL` caso contrário.

- `locked_index`

  O nome do índice bloqueado.

- `locked_type`

  O tipo de bloqueio de espera.

- `waiting_trx_id`

  O ID da transação pendente.

- `waiting_trx_started`

  O horário em que a transação de espera começou.

- `waiting_trx_age`

  Quanto tempo a transação de espera tem estado a aguardar, como um valor `TIME`.

- `waiting_trx_rows_locked`

  O número de linhas bloqueadas pela transação pendente.

- `waiting_trx_rows_modified`

  O número de linhas modificadas pela transação pendente.

- `waiting_pid`

  O ID do processo da transação pendente.

- `waiting_query`

  A declaração que está esperando pelo bloqueio.

- `waiting_lock_id`

  O ID do bloqueio de espera.

- `waiting_lock_mode`

  O modo do bloqueio de espera.

- `blocking_trx_id`

  O ID da transação que está bloqueando o bloqueio de espera.

- `blocking_pid`

  O ID do processo da transação que está bloqueando.

- `blocking_query`

  A declaração que a transação de bloqueio está executando. Este campo informa NULL se a sessão que emitiu a consulta de bloqueio ficar inativa. Para mais informações, consulte Identificando uma consulta de bloqueio após a sessão de emissão ficar inativa.

- `blocking_lock_id`

  O ID do bloqueio que está bloqueando o bloqueio de espera.

- `blocking_lock_mode`

  O modo do bloqueio que está bloqueando o bloqueio de espera.

- `blocking_trx_started`

  O horário em que a transação de bloqueio começou.

- `blocking_trx_age`

  Quanto tempo a transação de bloqueio está sendo executada, como um valor `TIME`.

- `blocking_trx_rows_locked`

  O número de linhas bloqueadas pela transação de bloqueio.

- `blocking_trx_rows_modified`

  O número de linhas modificadas pela transação de bloqueio.

- `sql_kill_blocking_query`

  A declaração `KILL` para executar para matar a declaração de bloqueio.

- `sql_kill_blocking_connection`

  A instrução `KILL` para executar para matar a sessão que está executando a instrução bloqueante.
