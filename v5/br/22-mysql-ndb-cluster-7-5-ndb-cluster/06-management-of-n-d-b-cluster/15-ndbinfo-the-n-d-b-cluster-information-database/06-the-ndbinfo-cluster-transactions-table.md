#### 21.6.15.6 A Tabela ndbinfo cluster_transactions

A tabela `cluster_transactions` exibe informações sobre todas as Transaction em andamento em um NDB Cluster.

A tabela `cluster_transactions` contém as seguintes colunas:

* `node_id`

  ID do Node do Transaction Coordinator

* `block_instance`

  Instância do TC block

* `transid`

  Transaction ID

* `state`

  State da Operation (consulte o texto para valores possíveis)

* `count_operations`

  Número de Primary Key operations stateful na Transaction (inclui reads com Locks, bem como DML operations)

* `outstanding_operations`

  Operations ainda sendo executadas em local data management blocks

* `inactive_seconds`

  Tempo gasto esperando pela API

* `client_node_id`

  ID do Client Node

* `client_block_ref`

  Referência do Client Block

##### Notes

O Transaction ID é um número exclusivo de 64 bits que pode ser obtido usando o método [`getTransactionId()`](/doc/ndbapi/en/ndb-ndbtransaction.html#ndb-ndbtransaction-gettransactionid) da NDB API. (Atualmente, o MySQL Server não expõe o Transaction ID da NDB API de uma Transaction em andamento.)

`block_instance` refere-se a uma instância de um kernel block. Juntamente com o nome do block, este número pode ser usado para procurar uma determinada instância na tabela [`threadblocks`](mysql-cluster-ndbinfo-threadblocks.html "21.6.15.41 The ndbinfo threadblocks Table").

A coluna `state` pode ter qualquer um dos seguintes valores: `CS_ABORTING`, `CS_COMMITTING`, `CS_COMMIT_SENT`, `CS_COMPLETE_SENT`, `CS_COMPLETING`, `CS_CONNECTED`, `CS_DISCONNECTED`, `CS_FAIL_ABORTED`, `CS_FAIL_ABORTING`, `CS_FAIL_COMMITTED`, `CS_FAIL_COMMITTING`, `CS_FAIL_COMPLETED`, `CS_FAIL_PREPARED`, `CS_PREPARE_TO_COMMIT`, `CS_RECEIVING`, `CS_REC_COMMITTING`, `CS_RESTART`, `CS_SEND_FIRE_TRIG_REQ`, `CS_STARTED`, `CS_START_COMMITTING`, `CS_START_SCAN`, `CS_WAIT_ABORT_CONF`, `CS_WAIT_COMMIT_CONF`, `CS_WAIT_COMPLETE_CONF`, `CS_WAIT_FIRE_TRIG_REQ`. (Se o MySQL Server estiver rodando com [`ndbinfo_show_hidden`](mysql-cluster-options-variables.html#sysvar_ndbinfo_show_hidden) habilitado, você pode visualizar esta lista de states selecionando a tabela `ndb$dbtc_apiconnect_state`, que normalmente está oculta.)

Em `client_node_id` e `client_block_ref`, `client` refere-se a um NDB Cluster API ou SQL node (ou seja, um NDB API client ou um MySQL Server anexado ao cluster).

A coluna `tc_block_instance` fornece o número da instância do [`DBTC`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtc.html) block. Você pode usar isso junto com o nome do block para obter informações sobre Threads específicos da tabela [`threadblocks`](mysql-cluster-ndbinfo-threadblocks.html "21.6.15.41 The ndbinfo threadblocks Table").