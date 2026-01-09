#### 25.6.15.55 Tabela `server_operations` do ndbinfo

A tabela `server_operations` contém entradas para todas as operações `NDB` em andamento nas quais o nó SQL atual (MySQL Server) está envolvido. Ela é, efetivamente, um subconjunto da tabela `cluster_operations`, na qual as operações para outros nós SQL e API não são exibidas.

A tabela `server_operations` contém as seguintes colunas:

* `mysql_connection_id`

  ID de conexão do MySQL Server

* `node_id`

  ID do nó

* `block_instance`

  Instância de bloco

* `transid`

  ID de transação

* `operation_type`

  Tipo de operação (consulte o texto para os possíveis valores)

* `state`

  Estado da operação (consulte o texto para os possíveis valores)

* `tableid`

  ID da tabela

* `fragmentid`

  ID de fragmento

* `client_node_id`

  ID do nó cliente

* `client_block_ref`

  Referência do bloco cliente

* `tc_node_id`

  ID do nó coordenador da transação

* `tc_block_no`

  Número do bloco coordenador da transação

* `tc_block_instance`

  Instância do bloco coordenador da transação

##### Notas

O `mysql_connection_id` é o mesmo ID de conexão ou sessão exibido na saída de `SHOW PROCESSLIST`. Ele é obtido a partir da tabela `INFORMATION_SCHEMA` `NDB_TRANSID_MYSQL_CONNECTION_MAP`.

`block_instance` refere-se a uma instância de um bloco do kernel. Juntamente com o nome do bloco, esse número pode ser usado para procurar uma instância específica na tabela `threadblocks`.

O ID de transação (`transid`) é um número único de 64 bits que pode ser obtido usando o método `getTransactionId()` da API NDB. (Atualmente, o MySQL Server não exibe o ID de transação da API NDB de uma transação em andamento.)

A coluna `operation_type` pode assumir qualquer um dos valores `READ`, `READ-SH`, `READ-EX`, `INSERT`, `UPDATE`, `DELETE`, `WRITE`, `UNLOCK`, `REFRESH`, `SCAN`, `SCAN-SH`, `SCAN-EX`, ou `<unknown>`.

A coluna `state` pode ter qualquer um dos valores `ABORT_QUEUED`, `ABORT_STOPPED`, `COMMITTED`, `COMMIT_QUEUED`, `COMMIT_STOPPED`, `COPY_CLOSE_STOPPED`, `COPY_FIRST_STOPPED`, `COPY_STOPPED`, `COPY_TUPKEY`, `IDLE`, `LOG_ABORT_QUEUED`, `LOG_COMMIT_QUEUED`, `LOG_COMMIT_QUEUED_WAIT_SIGNAL`, `LOG_COMMIT_WRITTEN`, `LOG_COMMIT_WRITTEN_WAIT_SIGNAL`, `LOG_QUEUED`, `PREPARED`, `PREPARED_RECEIVED_COMMIT`, `SCAN_CHECK_STOPPED`, `SCAN_CLOSE_STOPPED`, `SCAN_FIRST_STOPPED`, `SCAN_RELEASE_STOPPED`, `SCAN_STATE_USED`, `SCAN_STOPPED`, `SCAN_TUPKEY`, `STOPPED`, `TC_NOT_CONNECTED`, `WAIT_ACC`, `WAIT_ACC_ABORT`, `WAIT_AI_AFTER_ABORT`, `WAIT_ATTR`, `WAIT_SCAN_AI`, `WAIT_TUP`, `WAIT_TUPKEYINFO`, `WAIT_TUP_COMMIT`, ou `WAIT_TUP_TO_ABORT`. (Se o servidor MySQL estiver rodando com `ndbinfo_show_hidden` habilitado, você pode visualizar essa lista de estados selecionando a tabela `ndb$dblqh_tcconnect_state`, que normalmente é oculta.)

Você pode obter o nome de uma tabela `NDB` a partir de seu ID de tabela verificando a saída de **ndb_show_tables**.

O `fragid` é o mesmo que o número de partição visto na saída de **ndb_desc** `--extra-partition-info` (forma abreviada `-p`).

Em `client_node_id` e `client_block_ref`, `client` refere-se a uma API do NDB Cluster ou a um nó SQL (ou seja, um cliente da API NDB ou um servidor MySQL conectado ao cluster).

As colunas `block_instance` e `tc_block_instance` fornecem os números de instâncias de bloco do kernel NDB. Você pode usá-las para obter informações sobre threads específicos a partir da tabela `threadblocks`.