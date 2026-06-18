#### 30.4.3.28 As vistas schema\_table\_lock\_waits e x$schema\_table\_lock\_waits

Essas visualizações mostram quais sessões estão bloqueadas aguardando bloqueios de metadados e o que as está bloqueando.

As descrições das colunas aqui são breves. Para obter informações adicionais, consulte a descrição da tabela do Schema de Desempenho `metadata_locks` na Seção 29.12.13.3, “A tabela metadata\_locks”.

As visualizações `schema_table_lock_waits` e `x$schema_table_lock_waits` possuem essas colunas:

- `object_schema`

  O esquema que contém o objeto a ser bloqueado.

- `object_name`

  O nome do objeto instrumentado.

- `waiting_thread_id`

  O ID do fio do fio que está aguardando o bloqueio.

- `waiting_pid`

  O ID do processo da thread que está aguardando o bloqueio.

- `waiting_account`

  A conta associada à sessão que está aguardando o bloqueio.

- `waiting_lock_type`

  O tipo de bloqueio de espera.

- `waiting_lock_duration`

  Quanto tempo o bloqueio de espera tem estado a esperar.

- `waiting_query`

  A declaração que está esperando pelo bloqueio.

- `waiting_query_secs`

  Quanto tempo a declaração está esperando, em segundos.

- `waiting_query_rows_affected`

  O número de linhas afetadas pela declaração.

- `waiting_query_rows_examined`

  O número de linhas lidas dos motores de armazenamento pela declaração.

- `blocking_thread_id`

  O ID do fio do fio que está bloqueando o bloqueio de espera.

- `blocking_pid`

  O ID do processo da thread que está bloqueando o bloqueio de espera.

- `blocking_account`

  A conta associada ao tópico que está bloqueando o bloqueio de espera.

- `blocking_lock_type`

  O tipo de bloqueio que está bloqueando o bloqueio de espera.

- `blocking_lock_duration`

  Quanto tempo o bloqueio foi mantido.

- `sql_kill_blocking_query`

  A declaração `KILL` para executar para matar a declaração de bloqueio.

- `sql_kill_blocking_connection`

  A instrução `KILL` para executar para matar a sessão que está executando a instrução bloqueante.
