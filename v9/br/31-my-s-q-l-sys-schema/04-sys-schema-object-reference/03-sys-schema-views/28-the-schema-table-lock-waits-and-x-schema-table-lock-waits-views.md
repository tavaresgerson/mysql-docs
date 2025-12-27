#### 30.4.3.28 As vistas `schema\_table\_lock\_waits` e `x$schema\_table\_lock\_waits`

Essas vistas mostram quais sessões estão bloqueadas esperando por bloqueios de metadados e o que está bloqueando-as.

As descrições das colunas aqui são breves. Para obter informações adicionais, consulte a descrição da tabela do Schema de Desempenho `metadata\_locks` na Seção 29.12.13.3, “A tabela `metadata\_locks’”.

As vistas `schema\_table\_lock\_waits` e `x$schema\_table\_lock\_waits` têm essas colunas:

* `object_schema`

  O esquema que contém o objeto a ser bloqueado.

* `object_name`

  O nome do objeto instrumentado.

* `waiting_thread_id`

  O ID de thread do thread que está esperando pelo bloqueio.

* `waiting_pid`

  O ID de processo do thread que está esperando pelo bloqueio.

* `waiting_account`

  A conta associada à sessão que está esperando pelo bloqueio.

* `waiting_lock_type`

  O tipo do bloqueio de espera.

* `waiting_lock_duration`

  Quanto tempo o bloqueio de espera está esperando.

* `waiting_query`

  A instrução que está esperando pelo bloqueio.

* `waiting_query_secs`

  Quanto tempo a instrução está esperando, em segundos.

* `waiting_query_rows_affected`

  O número de linhas afetadas pela instrução.

* `waiting_query_rows_examined`

  O número de linhas lidas dos motores de armazenamento pela instrução.

* `blocking_thread_id`

  O ID de thread do thread que está bloqueando o bloqueio de espera.

* `blocking_pid`

  O ID de processo do thread que está bloqueando o bloqueio de espera.

* `blocking_account`

  A conta associada ao thread que está bloqueando o bloqueio de espera.

* `blocking_lock_type`

  O tipo de bloqueio que está bloqueando o bloqueio de espera.

* `blocking_lock_duration`

  Quanto tempo o bloqueio está sendo mantido.

* `sql_kill_blocking_query`

A instrução `KILL` para executar para matar a instrução de bloqueio.

* `sql_kill_blocking_connection`

A instrução `KILL` para executar para matar a sessão que está executando a instrução de bloqueio.