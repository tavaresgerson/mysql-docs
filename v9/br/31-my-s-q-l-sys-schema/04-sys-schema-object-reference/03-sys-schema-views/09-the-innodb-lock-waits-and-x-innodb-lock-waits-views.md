#### 30.4.3.9 As visualizações `innodb_lock_waits` e `x$innodb_lock_waits`

Essas visualizações resumem os bloqueios do `InnoDB` que as transações estão aguardando. Por padrão, as linhas são ordenadas por idade do bloqueio em ordem decrescente.

As visualizações `innodb_lock_waits` e `x$innodb_lock_waits` têm as seguintes colunas:

* `wait_started`

  O momento em que o bloqueio de espera começou.

* `wait_age`

  Quanto tempo o bloqueio foi aguardado, como um valor `TIME`.

* `wait_age_secs`

  Quanto tempo o bloqueio foi aguardado, em segundos.

* `locked_table_schema`

  O esquema que contém a tabela bloqueada.

* `locked_table_name`

  O nome da tabela bloqueada.

* `locked_table_partition`

  O nome da partição bloqueada, se houver; `NULL` caso contrário.

* `locked_table_subpartition`

  O nome da subpartição bloqueada, se houver; `NULL` caso contrário.

* `locked_index`

  O nome do índice bloqueado.

* `locked_type`

  O tipo do bloqueio aguardado.

* `waiting_trx_id`

  O ID da transação que está aguardando.

* `waiting_trx_started`

  O momento em que a transação de espera começou.

* `waiting_trx_age`

  Quanto tempo a transação de espera está aguardando, como um valor `TIME`.

* `waiting_trx_rows_locked`

  O número de linhas bloqueadas pela transação de espera.

* `waiting_trx_rows_modified`

  O número de linhas modificadas pela transação de espera.

* `waiting_pid`

  O ID do processo da transação de espera.

* `waiting_query`

  A instrução que está aguardando o bloqueio.

* `waiting_lock_id`

  O ID do bloqueio aguardado.

* `waiting_lock_mode`

  O modo do bloqueio aguardado.

* `blocking_trx_id`

  O ID da transação que está bloqueando o bloqueio aguardado.

* `blocking_pid`

  O ID do processo da transação que está bloqueando.

* `blocking_query`

A declaração que a transação de bloqueio está executando. Este campo informa NULL se a sessão que emitiu a consulta de bloqueio ficar inativa. Para obter mais informações, consulte Identificando uma consulta de bloqueio após a sessão emissora ficar inativa.

* `blocking_lock_id`

  O ID do bloqueio que está bloqueando o bloqueio pendente.

* `blocking_lock_mode`

  O modo do bloqueio que está bloqueando o bloqueio pendente.

* `blocking_trx_started`

  O momento em que a transação de bloqueio começou.

* `blocking_trx_age`

  Quanto tempo a transação de bloqueio está sendo executada, como um valor `TIME`.

* `blocking_trx_rows_locked`

  O número de linhas bloqueadas pela transação de bloqueio.

* `blocking_trx_rows_modified`

  O número de linhas modificadas pela transação de bloqueio.

* `sql_kill_blocking_query`

  A declaração `KILL` a ser executada para matar a declaração de bloqueio.

* `sql_kill_blocking_connection`

  A declaração `KILL` a ser executada para matar a sessão que está executando a declaração de bloqueio.