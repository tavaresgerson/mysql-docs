#### 19.2.2.3 Opções de inicialização e canais de replicação

Esta seção descreve as opções de inicialização que são afetadas pela adição de canais de replicação.

As variáveis de sistema `master_info_repository` e `relay_log_info_repository` não devem ser definidas como `FILE` quando você usa canais de replicação. No MySQL 8.0, o ajuste `FILE` é desatualizado e `TABLE` é o padrão, então as variáveis de sistema podem ser omitidas. A partir do MySQL 8.0.23, elas devem ser omitidas porque seu uso é desatualizado a partir dessa versão. Se essas variáveis de sistema forem definidas como `FILE`, a tentativa de adicionar mais fontes a uma replica falhará com `ER_REPLICA_NEW_CHANNEL_WRONG_REPOSITORY`.

As seguintes opções de inicialização agora afetam *todos* os canais em uma topologia de replicação.

- `--log-replica-updates` ou `--log-slave-updates`

  Todas as transações recebidas pela réplica (mesmo de várias fontes) são escritas no log binário.

- `--relay-log-purge`

  Quando configurado, cada canal limpa seu próprio log de relé automaticamente.

- `--replica-transaction-retries` ou `--slave-transaction-retries`

  O número especificado de tentativas de transação pode ocorrer em todos os threads do aplicativo de todos os canais.

- `--skip-replica-start` ou `--skip-slave-start` (ou variável de sistema `skip_replica_start` ou `skip_slave_start` definida)

  Nenhum fio de replicação é iniciado em nenhum canal.

- `--replica-skip-errors` ou `--slave-skip-errors`

  A execução continua e os erros são ignorados para todos os canais.

Os valores definidos para as seguintes opções de inicialização da startup são aplicados em cada canal; como essas são opções de inicialização da **mysqld**, elas são aplicadas em todos os canais.

- `--max-relay-log-size=size`

  Tamanho máximo do arquivo de registro individual do relé para cada canal; após atingir esse limite, o arquivo é rotado.

- `--relay-log-space-limit=size`

  Limite superior para o tamanho total de todos os registros de relé combinados, para cada canal individual. Para os canais `N`, o tamanho combinado desses registros é limitado a `relay_log_space_limit * N`.

- `--replica-parallel-workers=value` ou `--slave-parallel-workers=value`

  Número de threads do aplicativo de replicação por canal.

- `replica_checkpoint_group` ou `slave_checkpoint_group`

  Tempo de espera por um fio de receptor para cada fonte.

- `--relay-log-index=filename`

  Nome de base para o arquivo de índice do log de retransmissão de cada canal. Consulte a Seção 19.2.2.4, “Convenções de Nomenclatura de Canais de Replicação”.

- `--relay-log=filename`

  Indica o nome de base do arquivo de log de retransmissão de cada canal. Consulte a Seção 19.2.2.4, “Convenções de Nomenclatura de Canais de Replicação”.

- `--replica-net-timeout=N` ou `--slave-net-timeout=N`

  Esse valor é definido por canal, para que cada canal espere `N` segundos para verificar se há uma conexão quebrada.

- `--replica-skip-counter=N` ou `--slave-skip-counter=N`

  Esse valor é definido por canal, para que cada canal ignore os eventos `N` da sua fonte.
