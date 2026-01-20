#### 26.4.3.28 As vistas schema_table_lock_waits e x$schema_table_lock_waits

Essas visualizações mostram quais sessões estão bloqueadas aguardando bloqueios de metadados e o que as está bloqueando.

As descrições das colunas aqui são breves. Para obter informações adicionais, consulte a descrição da tabela `metadata_locks` do Schema de Desempenho na Seção 25.12.12.1, “A Tabela metadata_locks”.

As vistas `schema_table_lock_waits` e `x$schema_table_lock_waits` possuem as seguintes colunas:

- `objeto_esquema`

  O esquema que contém o objeto a ser bloqueado.

- `nome_objeto`

  O nome do objeto instrumentado.

- `waiting_thread_id`

  O ID do thread do thread que está aguardando o bloqueio.

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

  O ID do thread do thread que está bloqueando o bloqueio de espera.

- `blocking_pid`

  O ID do processo da thread que está bloqueando o bloqueio de espera.

- `bloquear_conta`

  A conta associada ao tópico que está bloqueando o bloqueio de espera.

- `tipo_bloqueio_de_chave`

  O tipo de bloqueio que está bloqueando o bloqueio de espera.

- `bloqueio_duração_de_bloqueio`

  Quanto tempo o bloqueio foi mantido.

- `sql_kill_blocking_query`

  A instrução `KILL` para executar para matar a instrução de bloqueio.

- `sql_kill_blocking_connection`

  A instrução `KILL` para executar para matar a sessão que está executando a instrução bloqueante.
