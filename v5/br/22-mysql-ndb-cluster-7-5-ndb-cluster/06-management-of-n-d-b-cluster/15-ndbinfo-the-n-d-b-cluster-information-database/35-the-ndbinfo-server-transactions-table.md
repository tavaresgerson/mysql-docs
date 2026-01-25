#### 21.6.15.35 A Tabela ndbinfo server_transactions

A tabela `server_transactions` é um subconjunto da tabela [`cluster_transactions`](mysql-cluster-ndbinfo-cluster-transactions.html "21.6.15.6 A Tabela ndbinfo cluster_transactions"), mas inclui apenas aquelas Transactions nas quais o SQL Node atual (MySQL Server) é um participante, enquanto inclui os Connection IDs relevantes.

A tabela `server_transactions` contém as seguintes colunas:

* `mysql_connection_id`

  Connection ID do MySQL Server

* `node_id`

  ID do Node coordenador da Transaction

* `block_instance`

  Instância do Block coordenador da Transaction

* `transid`

  ID da Transaction

* `state`

  State da Operation (veja o texto para valores possíveis)

* `count_operations`

  Número de Operations com State na Transaction

* `outstanding_operations`

  Operations ainda sendo executadas pela camada de gerenciamento de dados local (LQH blocks)

* `inactive_seconds`

  Tempo gasto esperando pela API

* `client_node_id`

  ID do Client Node

* `client_block_ref`

  Referência do Client Block

##### Notas

O `mysql_connection_id` é o mesmo que o Connection ID ou Session ID mostrado na saída de [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 Comando SHOW PROCESSLIST"). Ele é obtido da tabela `INFORMATION_SCHEMA` [`NDB_TRANSID_MYSQL_CONNECTION_MAP`](information-schema-ndb-transid-mysql-connection-map-table.html "24.3.13 A Tabela INFORMATION_SCHEMA ndb_transid_mysql_connection_map").

`block_instance` se refere a uma instância de um kernel Block. Juntamente com o nome do Block, este número pode ser usado para procurar uma determinada instância na tabela [`threadblocks`](mysql-cluster-ndbinfo-threadblocks.html "21.6.15.41 A Tabela ndbinfo threadblocks").

O Transaction ID (`transid`) é um número único de 64 bits que pode ser obtido usando o método [`getTransactionId()`](/doc/ndbapi/en/ndb-ndbtransaction.html#ndb-ndbtransaction-gettransactionid) da NDB API. (Atualmente, o MySQL Server não expõe o Transaction ID da NDB API de uma Transaction em andamento.)

A coluna `state` pode ter qualquer um dos valores `CS_ABORTING`, `CS_COMMITTING`, `CS_COMMIT_SENT`, `CS_COMPLETE_SENT`, `CS_COMPLETING`, `CS_CONNECTED`, `CS_DISCONNECTED`, `CS_FAIL_ABORTED`, `CS_FAIL_ABORTING`, `CS_FAIL_COMMITTED`, `CS_FAIL_COMMITTING`, `CS_FAIL_COMPLETED`, `CS_FAIL_PREPARED`, `CS_PREPARE_TO_COMMIT`, `CS_RECEIVING`, `CS_REC_COMMITTING`, `CS_RESTART`, `CS_SEND_FIRE_TRIG_REQ`, `CS_STARTED`, `CS_START_COMMITTING`, `CS_START_SCAN`, `CS_WAIT_ABORT_CONF`, `CS_WAIT_COMMIT_CONF`, `CS_WAIT_COMPLETE_CONF`, `CS_WAIT_FIRE_TRIG_REQ`. (Se o MySQL Server estiver rodando com [`ndbinfo_show_hidden`](mysql-cluster-options-variables.html#sysvar_ndbinfo_show_hidden) habilitado, você pode visualizar esta lista de States selecionando a tabela `ndb$dbtc_apiconnect_state`, que normalmente é oculta.)

Em `client_node_id` e `client_block_ref`, `client` refere-se a um NDB Cluster API ou SQL Node (ou seja, um NDB API client ou um MySQL Server anexado ao Cluster).

A coluna `block_instance` fornece o número da instância do kernel Block [`DBTC`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtc.html). Você pode usar isso para obter informações sobre Threads específicas da tabela [`threadblocks`](mysql-cluster-ndbinfo-threadblocks.html "21.6.15.41 A Tabela ndbinfo threadblocks").