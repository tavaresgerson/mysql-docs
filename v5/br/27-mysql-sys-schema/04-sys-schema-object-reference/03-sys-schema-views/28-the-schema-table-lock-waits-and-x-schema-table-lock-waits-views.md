#### 26.4.3.28 As Views schema_table_lock_waits e x$schema_table_lock_waits

Estas views exibem quais sessions estão bloqueadas esperando por metadata locks, e o que as está bloqueando.

As descrições das colunas aqui são breves. Para informações adicionais, consulte a descrição da tabela `metadata_locks` do Performance Schema na Seção 25.12.12.1, “The metadata_locks Table”.

As views `schema_table_lock_waits` e `x$schema_table_lock_waits` contêm as seguintes colunas:

* `object_schema`

  O schema que contém o objeto a ser bloqueado.

* `object_name`

  O nome do objeto instrumentado.

* `waiting_thread_id`

  O Thread ID da Thread que está esperando pelo Lock.

* `waiting_pid`

  O ID da processlist da Thread que está esperando pelo Lock.

* `waiting_account`

  A Account associada à session que está esperando pelo Lock.

* `waiting_lock_type`

  O tipo do Lock em espera.

* `waiting_lock_duration`

  Há quanto tempo o Lock em espera está aguardando.

* `waiting_query`

  O Statement que está esperando pelo Lock.

* `waiting_query_secs`

  Há quanto tempo o Statement está esperando, em segundos.

* `waiting_query_rows_affected`

  O número de rows afetadas pelo Statement.

* `waiting_query_rows_examined`

  O número de rows lidas dos storage engines pelo Statement.

* `blocking_thread_id`

  O Thread ID da Thread que está bloqueando o Lock em espera.

* `blocking_pid`

  O ID da processlist da Thread que está bloqueando o Lock em espera.

* `blocking_account`

  A Account associada à Thread que está bloqueando o Lock em espera.

* `blocking_lock_type`

  O tipo de Lock que está bloqueando o Lock em espera.

* `blocking_lock_duration`

  Há quanto tempo o Lock bloqueador tem sido mantido.

* `sql_kill_blocking_query`

  O Statement `KILL` a ser executado para encerrar (kill) o Statement bloqueador.

* `sql_kill_blocking_connection`

  O Statement `KILL` a ser executado para encerrar (kill) a session que está executando o Statement bloqueador.