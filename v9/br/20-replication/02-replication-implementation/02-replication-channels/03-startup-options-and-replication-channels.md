#### 19.2.2.3 Opções de inicialização e canais de replicação

Esta seção descreve as opções de inicialização que são afetadas pela adição de canais de replicação.

As seguintes opções de inicialização agora afetam *todos* os canais em uma topologia de replicação.

* `--log-replica-updates`

  Todas as transações recebidas pela replica (mesmo de múltiplas fontes) são escritas no log binário.

* `--relay-log-purge`

  Quando definido, cada canal purga seu próprio log de retransmissão automaticamente.

* `--replica-transaction-retries`

  O número especificado de tentativas de transação pode ocorrer em todos os threads do aplicável de cada canal.

* `--skip-replica-start`

  Nenhum thread de replicação é iniciado em nenhum canal.

* `--replica-skip-errors`

  A execução continua e os erros são ignorados para todos os canais.

Os valores definidos para as seguintes opções de inicialização são aplicados em cada canal; como são opções de inicialização do `mysqld`, elas são aplicadas em todos os canais.

* `--max-relay-log-size=size`

  Tamanho máximo do arquivo de log de retransmissão individual para cada canal; após atingir esse limite, o arquivo é rotado.

* `--relay-log-space-limit=size`

  Limite superior para o tamanho total de todos os logs de retransmissão combinados, para cada canal individual. Para *N* canais, o tamanho combinado desses logs é limitado a `relay_log_space_limit * N`.

* `--replica-parallel-workers=value`

  Número de threads do aplicável de replicação por canal.

* `replica_checkpoint_group`

  Tempo de espera de um thread receptor para cada fonte.

* `--relay-log-index=filename`

  Nome base para o arquivo de índice do log de retransmissão de cada canal. Veja a Seção 19.2.2.4, “Convenções de Nomenclatura de Canais de Replicação”.

* `--relay-log=filename`

  Denota o nome base do arquivo de log de retransmissão de cada canal. Veja a Seção 19.2.2.4, “Convenções de Nomenclatura de Canais de Replicação”.

* `--replica-net-timeout=N`

Esse valor é definido por canal, para que cada canal espere por *`N`* segundos para verificar se há uma conexão interrompida.

* `--replica-skip-counter=N`

Esse valor é definido por canal, para que cada canal ignore *`N`* eventos de sua fonte.