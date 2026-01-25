#### 21.6.15.5 A Tabela ndbinfo cluster_operations

A tabela `cluster_operations` fornece uma visão por operação (com chave primária op *stateful*) de toda a atividade no NDB Cluster do ponto de vista dos blocos de gerenciamento de dados locais (LQH) (veja [O Bloco DBLQH](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dblqh.html)).

A tabela `cluster_operations` contém as seguintes colunas:

* `node_id`

  ID do Node do bloco LQH que está reportando

* `block_instance`

  Instância do bloco LQH

* `transid`

  ID da Transaction

* `operation_type`

  Tipo de Operação (veja o texto para valores possíveis)

* `state`

  Estado da Operação (veja o texto para valores possíveis)

* `tableid`

  ID da Tabela

* `fragmentid`

  ID do Fragmento

* `client_node_id`

  ID do Node do Client

* `client_block_ref`

  Referência do bloco do Client

* `tc_node_id`

  ID do Node do Coordenador de Transaction (Transaction Coordinator)

* `tc_block_no`

  Número do bloco do Coordenador de Transaction

* `tc_block_instance`

  Instância do bloco do Coordenador de Transaction

##### Notas

O ID da Transaction é um número exclusivo de 64 bits que pode ser obtido usando o método [`getTransactionId()`](/doc/ndbapi/en/ndb-ndbtransaction.html#ndb-ndbtransaction-gettransactionid) da NDB API. (Atualmente, o MySQL Server não expõe o ID da Transaction da NDB API de uma Transaction em andamento.)

A coluna `operation_type` pode assumir qualquer um dos valores `READ`, `READ-SH`, `READ-EX`, `INSERT`, `UPDATE`, `DELETE`, `WRITE`, `UNLOCK`, `REFRESH`, `SCAN`, `SCAN-SH`, `SCAN-EX` ou `<unknown>`.

A coluna `state` pode ter qualquer um dos valores `ABORT_QUEUED`, `ABORT_STOPPED`, `COMMITTED`, `COMMIT_QUEUED`, `COMMIT_STOPPED`, `COPY_CLOSE_STOPPED`, `COPY_FIRST_STOPPED`, `COPY_STOPPED`, `COPY_TUPKEY`, `IDLE`, `LOG_ABORT_QUEUED`, `LOG_COMMIT_QUEUED`, `LOG_COMMIT_QUEUED_WAIT_SIGNAL`, `LOG_COMMIT_WRITTEN`, `LOG_COMMIT_WRITTEN_WAIT_SIGNAL`, `LOG_QUEUED`, `PREPARED`, `PREPARED_RECEIVED_COMMIT`, `SCAN_CHECK_STOPPED`, `SCAN_CLOSE_STOPPED`, `SCAN_FIRST_STOPPED`, `SCAN_RELEASE_STOPPED`, `SCAN_STATE_USED`, `SCAN_STOPPED`, `SCAN_TUPKEY`, `STOPPED`, `TC_NOT_CONNECTED`, `WAIT_ACC`, `WAIT_ACC_ABORT`, `WAIT_AI_AFTER_ABORT`, `WAIT_ATTR`, `WAIT_SCAN_AI`, `WAIT_TUP`, `WAIT_TUPKEYINFO`, `WAIT_TUP_COMMIT` ou `WAIT_TUP_TO_ABORT`. (Se o MySQL Server estiver em execução com [`ndbinfo_show_hidden`](mysql-cluster-options-variables.html#sysvar_ndbinfo_show_hidden) habilitado, você pode visualizar esta lista de estados selecionando a tabela `ndb$dblqh_tcconnect_state`, que normalmente está oculta.)

Você pode obter o nome de uma tabela `NDB` a partir do seu ID de tabela verificando a saída de [**ndb_show_tables**](mysql-cluster-programs-ndb-show-tables.html "21.5.27 ndb_show_tables — Exibir Lista de Tabelas NDB").

O `fragid` é o mesmo que o número da partition visto na saída de [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Descrever Tabelas NDB") [`--extra-partition-info`](mysql-cluster-programs-ndb-desc.html#option_ndb_desc_extra-partition-info) (forma abreviada `-p`).

Em `client_node_id` e `client_block_ref`, `client` refere-se a um node de SQL ou API do NDB Cluster (isto é, um client de NDB API ou um MySQL Server anexado ao Cluster).

As colunas `block_instance` e `tc_block_instance` fornecem, respectivamente, os números de instância do bloco [`DBLQH`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dblqh.html) e [`DBTC`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtc.html). Você pode usá-los junto com os nomes dos blocos para obter informações sobre Threads específicos da tabela [`threadblocks`](mysql-cluster-ndbinfo-threadblocks.html "21.6.15.41 A Tabela ndbinfo threadblocks").