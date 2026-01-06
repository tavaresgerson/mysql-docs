#### 26.4.3.9 As visualizações innodb\_lock\_waits e x$innodb\_lock\_waits

Esses pontos de vista resumem as bloquagens do `InnoDB` que as transações estão esperando. Por padrão, as linhas são ordenadas por idade de bloqueio decrescente.

As vistas `innodb_lock_waits` e `x$innodb_lock_waits` possuem as seguintes colunas:

- `wait_started`

  O horário em que o bloqueio começou.

- `wait_age`

  Quanto tempo a trava foi aguardada, como um valor `TIME`.

- `wait_age_secs`

  Quanto tempo o bloqueio foi aguardado, em segundos.

- `locked_table`

  O nome da tabela bloqueada. Esta coluna contém valores combinados de nomes de esquema/tabela.

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

- `modo_bloqueio_esperando`

  O modo do bloqueio de espera.

- `blocking_trx_id`

  O ID da transação que está bloqueando o bloqueio de espera.

- `blocking_pid`

  O ID do processo da transação que está bloqueando.

- `bloquear_consulta`

  A declaração que a transação de bloqueio está executando. Este campo informa NULL se a sessão que emitiu a consulta de bloqueio ficar inativa. Para mais informações, consulte Identificando uma consulta de bloqueio após a sessão de emissão ficar inativa.

- `blocking_lock_id`

  O ID do bloqueio que está bloqueando o bloqueio de espera.

- `blocking_lock_mode`

  O modo do bloqueio que está bloqueando o bloqueio de espera.

- `bloquear_trx_started`

  O horário em que a transação de bloqueio começou.

- `bloquear_idade_trx`

  Quanto tempo a transação de bloqueio está sendo executada, como um valor `TIME`.

- `bloquear_linhas_trx_bloqueadas`

  O número de linhas bloqueadas pela transação de bloqueio.

- `bloquear_linhas_de_transação_modificadas`

  O número de linhas modificadas pela transação de bloqueio.

- `sql_kill_blocking_query`

  A instrução `KILL` para executar para matar a instrução de bloqueio.

- `sql_kill_blocking_connection`

  A instrução `KILL` para executar para matar a sessão que está executando a instrução bloqueante.
