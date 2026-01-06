#### 16.2.2.3 Opções de inicialização e canais de replicação

Esta seção descreve as opções de inicialização que são afetadas pela adição de canais de replicação.

As configurações iniciais a seguir *devem* ser configuradas corretamente para usar a replicação de múltiplas fontes.

- [`relay_log_info_repository`](https://replication-options-replica.html#sysvar_relay_log_info_repository).

  Esta deve ser definida como `TABLE`. Se esta variável for definida como `FILE`, a tentativa de adicionar mais fontes a uma replica falhará com `ER_SLAVE_NEW_CHANNEL_WRONG_REPOSITORY`.

- [`master_info_repository`](https://replication-options-replica.html#sysvar_master_info_repository)

  Esta deve ser definida como `TABLE`. Se esta variável for definida como `FILE`, a tentativa de adicionar mais fontes a uma replica falhará com `ER_SLAVE_NEW_CHANNEL_WRONG_REPOSITORY`.

As seguintes opções de inicialização agora afetam *todos* os canais em uma topologia de replicação.

- [`--log-slave-updates`](https://replication-options-binary-log.html#sysvar_log_slave_updates)

  Todas as transações recebidas pela réplica (mesmo de várias fontes) são escritas no log binário.

- [`--relay-log-purge`](https://replication-options-replica.html#sysvar_relay_log_purge)

  Quando configurado, cada canal limpa seu próprio log de relé automaticamente.

- `--slave_transaction_retries`

  O aplicativo refaz as transações de todos os canais.

- [`--skip-slave-start`](https://pt.wikipedia.org/wiki/Op%C3%A9rnia_replication-options-replica.html#op%C3%A3%C3%B5%C3%A7%C3%A3o_mysqld_skip-slave-start)

  Nenhum fio de replicação é iniciado em nenhum canal.

- `--slave-skip-errors`

  A execução continua e os erros são ignorados para todos os canais.

Os valores definidos para as seguintes opções de inicialização da startup são aplicados em cada canal; como essas são opções de inicialização da **mysqld**, elas são aplicadas em todos os canais.

- `--max-relay-log-size=tamanho`

  Tamanho máximo do arquivo de registro individual do relé para cada canal; após atingir esse limite, o arquivo é rotado.

- `--relay-log-space-limit=tamanho`

  Limite superior para o tamanho total de todos os registros de relé combinados, para cada canal individual. Para *`N`* canais, o tamanho combinado desses registros é limitado a `relay_log_space_limit * N`.

- `--slave-parallel-workers=valor`

  Número de threads de trabalhador por canal.

- [`slave_checkpoint_group`](https://replication-options-replica.html#sysvar_slave_checkpoint_group)

  Tempo de espera de uma thread de E/S para cada fonte.

- `--relay-log-index=nomedoarquivo`

  Nome de base para o arquivo de índice do log de retransmissão de cada canal. Consulte Seção 16.2.2.4, “Convenções de Nomenclatura de Canais de Replicação”.

- `--relay-log=nomedoarquivo`

  Indica o nome de base do arquivo de log de retransmissão de cada canal. Consulte Seção 16.2.2.4, “Convenções de Nomenclatura de Canais de Replicação”.

- `--slave_net-timeout=N`

  Esse valor é definido por canal, para que cada canal espere por *`N`* segundos para verificar se há uma conexão quebrada.

- `--slave-skip-counter=N`

  Esse valor é definido por canal, para que cada canal ignore *`N`* eventos da sua fonte.
