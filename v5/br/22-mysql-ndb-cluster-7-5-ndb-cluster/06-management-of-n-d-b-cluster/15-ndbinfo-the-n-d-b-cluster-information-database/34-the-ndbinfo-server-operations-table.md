#### 21.6.15.34 A Tabela ndbinfo server_operations

A tabela `server_operations` contém entradas para todas as operações `NDB` em andamento nas quais o SQL node atual (MySQL Server) está envolvido. Ela é efetivamente um subconjunto da tabela [`cluster_operations`](mysql-cluster-ndbinfo-cluster-operations.html "21.6.15.5 The ndbinfo cluster_operations Table"), na qual operações para outros SQL nodes e API nodes não são exibidas.

A tabela `server_operations` contém as seguintes colunas:

* `mysql_connection_id`

  ID de conexão do MySQL Server

* `node_id`

  Node ID

* `block_instance`

  Block instance

* `transid`

  Transaction ID

* `operation_type`

  Tipo de operação (veja o texto para valores possíveis)

* `state`

  Estado da operação (veja o texto para valores possíveis)

* `tableid`

  ID da Tabela

* `fragmentid`

  Fragment ID

* `client_node_id`

  Node ID do Cliente

* `client_block_ref`

  Referência do Block do Cliente

* `tc_node_id`

  Node ID do Coordenador de Transaction

* `tc_block_no`

  Número do Block do Coordenador de Transaction

* `tc_block_instance`

  Block instance do Coordenador de Transaction

##### Notas

O `mysql_connection_id` é o mesmo que o ID de conexão ou de sessão exibido na saída de [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement"). Ele é obtido da tabela `INFORMATION_SCHEMA` [`NDB_TRANSID_MYSQL_CONNECTION_MAP`](information-schema-ndb-transid-mysql-connection-map-table.html "24.3.13 The INFORMATION_SCHEMA ndb_transid_mysql_connection_map Table").

`block_instance` se refere a uma instance de um kernel block. Juntamente com o nome do block, este número pode ser usado para procurar uma determinada instance na tabela [`threadblocks`](mysql-cluster-ndbinfo-threadblocks.html "21.6.15.41 The ndbinfo threadblocks Table").

O Transaction ID (`transid`) é um número exclusivo de 64 bits que pode ser obtido usando o método [`getTransactionId()`](/doc/ndbapi/en/ndb-ndbtransaction.html#ndb-ndbtransaction-gettransactionid) da NDB API. (Atualmente, o MySQL Server não expõe o Transaction ID da NDB API de uma transaction em andamento.)

A coluna `operation_type` pode assumir qualquer um dos valores `READ`, `READ-SH`, `READ-EX`, `INSERT`, `UPDATE`, `DELETE`, `WRITE`, `UNLOCK`, `REFRESH`, `SCAN`, `SCAN-SH`, `SCAN-EX`, ou `<unknown>`.

A coluna `state` pode ter qualquer um dos valores `ABORT_QUEUED`, `ABORT_STOPPED`, `COMMITTED`, `COMMIT_QUEUED`, `COMMIT_STOPPED`, `COPY_CLOSE_STOPPED`, `COPY_FIRST_STOPPED`, `COPY_STOPPED`, `COPY_TUPKEY`, `IDLE`, `LOG_ABORT_QUEUED`, `LOG_COMMIT_QUEUED`, `LOG_COMMIT_QUEUED_WAIT_SIGNAL`, `LOG_COMMIT_WRITTEN`, `LOG_COMMIT_WRITTEN_WAIT_SIGNAL`, `LOG_QUEUED`, `PREPARED`, `PREPARED_RECEIVED_COMMIT`, `SCAN_CHECK_STOPPED`, `SCAN_CLOSE_STOPPED`, `SCAN_FIRST_STOPPED`, `SCAN_RELEASE_STOPPED`, `SCAN_STATE_USED`, `SCAN_STOPPED`, `SCAN_TUPKEY`, `STOPPED`, `TC_NOT_CONNECTED`, `WAIT_ACC`, `WAIT_ACC_ABORT`, `WAIT_AI_AFTER_ABORT`, `WAIT_ATTR`, `WAIT_SCAN_AI`, `WAIT_TUP`, `WAIT_TUPKEYINFO`, `WAIT_TUP_COMMIT`, ou `WAIT_TUP_TO_ABORT`. (Se o MySQL Server estiver em execução com [`ndbinfo_show_hidden`](mysql-cluster-options-variables.html#sysvar_ndbinfo_show_hidden) habilitado, você pode visualizar esta lista de estados selecionando a partir da tabela `ndb$dblqh_tcconnect_state`, que normalmente fica oculta.)

Você pode obter o nome de uma tabela `NDB` a partir do seu ID de tabela verificando a saída de [**ndb_show_tables**](mysql-cluster-programs-ndb-show-tables.html "21.5.27 ndb_show_tables — Display List of NDB Tables").

O `fragid` é o mesmo que o número da partição visto na saída de [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables") [`--extra-partition-info`](mysql-cluster-programs-ndb-desc.html#option_ndb_desc_extra-partition-info) (forma abreviada `-p`).

Em `client_node_id` e `client_block_ref`, `client` (cliente) refere-se a um NDB Cluster API node ou SQL node (ou seja, um NDB API client ou um MySQL Server anexado ao cluster).

As colunas `block_instance` e `tc_block_instance` fornecem números de instance de NDB kernel block. Você pode usá-los para obter informações sobre threads específicos da tabela [`threadblocks`](mysql-cluster-ndbinfo-threadblocks.html "21.6.15.41 The ndbinfo threadblocks Table").