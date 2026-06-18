#### 26.4.3.9 As Views innodb_lock_waits e x$innodb_lock_waits

Essas Views resumem os Locks do `InnoDB` pelos quais as Transactions estão esperando. Por padrão, as linhas são ordenadas pela idade do Lock em ordem decrescente.

As Views `innodb_lock_waits` e `x$innodb_lock_waits` possuem as seguintes colunas:

* `wait_started`

  A hora em que a espera pelo Lock começou.

* `wait_age`

  Por quanto tempo o Lock foi esperado, como um valor `TIME`.

* `wait_age_secs`

  Por quanto tempo o Lock foi esperado, em segundos.

* `locked_table`

  O nome da table Locked. Esta coluna contém valores combinados de schema/nome da table.

* `locked_index`

  O nome do Index Locked.

* `locked_type`

  O tipo do Lock em espera.

* `waiting_trx_id`

  O ID da Transaction em espera.

* `waiting_trx_started`

  A hora em que a Transaction em espera começou.

* `waiting_trx_age`

  Há quanto tempo a Transaction em espera está esperando, como um valor `TIME`.

* `waiting_trx_rows_locked`

  O número de rows Locked pela Transaction em espera.

* `waiting_trx_rows_modified`

  O número de rows modificadas pela Transaction em espera.

* `waiting_pid`

  O ID da processlist (PID) da Transaction em espera.

* `waiting_query`

  O statement (Query) que está esperando pelo Lock.

* `waiting_lock_id`

  O ID do Lock em espera.

* `waiting_lock_mode`

  O modo do Lock em espera.

* `blocking_trx_id`

  O ID da Transaction que está bloqueando o Lock em espera.

* `blocking_pid`

  O ID da processlist (PID) da Transaction bloqueadora.

* `blocking_query`

  O statement (Query) que a Transaction bloqueadora está executando. Este campo reporta NULL se a session que emitiu a Query bloqueadora se tornar idle (ociosa). Para mais informações, consulte Identifying a Blocking Query After the Issuing Session Becomes Idle.

* `blocking_lock_id`

  O ID do Lock que está bloqueando o Lock em espera.

* `blocking_lock_mode`

  O modo do Lock que está bloqueando o Lock em espera.

* `blocking_trx_started`

  A hora em que a Transaction bloqueadora começou.

* `blocking_trx_age`

  Há quanto tempo a Transaction bloqueadora está sendo executada, como um valor `TIME`.

* `blocking_trx_rows_locked`

  O número de rows Locked pela Transaction bloqueadora.

* `blocking_trx_rows_modified`

  O número de rows modificadas pela Transaction bloqueadora.

* `sql_kill_blocking_query`

  O statement `KILL` a ser executado para finalizar o statement bloqueador.

* `sql_kill_blocking_connection`

  O statement `KILL` a ser executado para finalizar a session que está executando o statement bloqueador.