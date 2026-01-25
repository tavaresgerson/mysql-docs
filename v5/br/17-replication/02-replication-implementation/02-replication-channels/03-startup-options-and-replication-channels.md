#### 16.2.2.3 Opções de Inicialização e Canais de Replicação

Esta seção descreve as opções de inicialização que são afetadas pela adição de canais de replicação.

As seguintes configurações de inicialização *devem* ser configuradas corretamente para usar a replicação multi-source.

* [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository).

  Este deve ser definido como `TABLE`. Se esta variável for definida como `FILE`, a tentativa de adicionar mais sources a uma replica falhará com [`ER_SLAVE_NEW_CHANNEL_WRONG_REPOSITORY`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_slave_new_channel_wrong_repository).

* [`master_info_repository`](replication-options-replica.html#sysvar_master_info_repository)

  Este deve ser definido como `TABLE`. Se esta variável for definida como `FILE`, a tentativa de adicionar mais sources a uma replica falhará com [`ER_SLAVE_NEW_CHANNEL_WRONG_REPOSITORY`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_slave_new_channel_wrong_repository).

As seguintes opções de inicialização agora afetam *todos* os canais em uma topologia de replicação.

* [`--log-slave-updates`](replication-options-binary-log.html#sysvar_log_slave_updates)

  Todas as transações recebidas pela replica (mesmo de múltiplas sources) são escritas no binary log.

* [`--relay-log-purge`](replication-options-replica.html#sysvar_relay_log_purge)

  Quando definido, cada canal purga seu próprio relay log automaticamente.

* [`--slave_transaction_retries`](replication-options-replica.html#sysvar_slave_transaction_retries)

  As Applier Threads de todos os canais fazem retry das transações.

* [`--skip-slave-start`](replication-options-replica.html#option_mysqld_skip-slave-start)

  Nenhuma Replication Thread é iniciada em nenhum dos canais.

* [`--slave-skip-errors`](replication-options-replica.html#sysvar_slave_skip_errors)

  A execução continua e os erros são ignorados (skipped) para todos os canais.

Os valores definidos para as seguintes opções de inicialização se aplicam a cada canal; visto que estas são opções de inicialização do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), elas são aplicadas em todos os canais.

* `--max-relay-log-size=size`

  Tamanho máximo do arquivo de relay log individual para cada canal; após atingir este limite, o arquivo é rotacionado.

* `--relay-log-space-limit=size`

  Limite superior para o tamanho total de todos os relay logs combinados, para cada canal individual. Para *`N`* canais, o tamanho combinado desses logs é limitado a [`relay_log_space_limit * N`](replication-options-replica.html#sysvar_relay_log_space_limit).

* `--slave-parallel-workers=value`

  Número de Worker Threads por canal.

* [`slave_checkpoint_group`](replication-options-replica.html#sysvar_slave_checkpoint_group)

  Tempo de espera de uma I/O Thread para cada source.

* `--relay-log-index=filename`

  Nome base para o arquivo index do relay log de cada canal. Veja [Section 16.2.2.4, “Convenções de Nomenclatura de Canais de Replicação”](channels-naming-conventions.html "16.2.2.4 Convenções de Nomenclatura de Canais de Replicação").

* `--relay-log=filename`

  Denota o nome base do arquivo de relay log de cada canal. Veja [Section 16.2.2.4, “Convenções de Nomenclatura de Canais de Replicação”](channels-naming-conventions.html "16.2.2.4 Convenções de Nomenclatura de Canais de Replicação").

* `--slave_net-timeout=N`

  Este valor é definido por canal, de modo que cada canal aguarda *`N`* segundos para verificar uma broken connection.

* `--slave-skip-counter=N`

  Este valor é definido por canal, de modo que cada canal pula *`N`* eventos de sua source.