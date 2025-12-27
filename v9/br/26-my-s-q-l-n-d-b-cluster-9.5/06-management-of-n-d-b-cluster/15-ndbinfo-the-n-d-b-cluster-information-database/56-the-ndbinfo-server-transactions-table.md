#### 25.6.15.56 Tabela ndbinfo\_server\_transactions

A tabela `server_transactions` é um subconjunto da tabela `cluster_transactions`, mas inclui apenas as transações nas quais o nó SQL atual (MySQL Server) é participante, incluindo os IDs de conexão relevantes.

A tabela `server_transactions` contém as seguintes colunas:

* `mysql_connection_id`

  ID de conexão do MySQL Server

* `node_id`

  ID do nó do coordenador da transação

* `block_instance`

  Instância do bloco do coordenador da transação

* `transid`

  ID da transação

* `state`

  Estado da operação (consulte o texto para os possíveis valores)

* `count_operations`

  Número de operações estatisticamente significativas na transação

* `outstanding_operations`

  Operações ainda sendo executadas pela camada de gerenciamento de dados local (blocos LQH)

* `inactive_seconds`

  Tempo gasto esperando pela API

* `client_node_id`

  ID do nó do cliente

* `client_block_ref`

  Referência do bloco do cliente

##### Notas

O `mysql_connection_id` é o mesmo ID de conexão ou sessão exibido na saída de `SHOW PROCESSLIST`. Ele é obtido a partir da tabela `INFORMATION_SCHEMA` `NDB_TRANSID_MYSQL_CONNECTION_MAP`.

`block_instance` refere-se a uma instância de um bloco do kernel. Juntamente com o nome do bloco, esse número pode ser usado para procurar uma instância específica na tabela `threadblocks`.

O ID da transação (`transid`) é um número único de 64 bits que pode ser obtido usando o método `getTransactionId()` da API NDB. (Atualmente, o MySQL Server não exibe o ID de transação da API NDB de uma transação em andamento.)

A coluna `state` pode ter qualquer um dos valores `CS_ABORTING`, `CS_COMMITTING`, `CS_COMMIT_SENT`, `CS_COMPLETE_SENT`, `CS_COMPLETING`, `CS_CONNECTED`, `CS_DISCONNECTED`, `CS_FAIL_ABORTED`, `CS_FAIL_ABORTING`, `CS_FAIL_COMMITTED`, `CS_FAIL_COMMITTING`, `CS_FAIL_COMPLETED`, `CS_FAIL_PREPARED`, `CS_PREPARE_TO_COMMIT`, `CS_RECEIVING`, `CS_REC_COMMITTING`, `CS_RESTART`, `CS_SEND_FIRE_TRIG_REQ`, `CS_STARTED`, `CS_START_COMMITTING`, `CS_START_SCAN`, `CS_WAIT_ABORT_CONF`, `CS_WAIT_COMMIT_CONF`, `CS_WAIT_COMPLETE_CONF`, `CS_WAIT_FIRE_TRIG_REQ`. (Se o servidor MySQL estiver rodando com `ndbinfo_show_hidden` habilitado, você pode visualizar essa lista de estados selecionando a tabela `ndb$dbtc_apiconnect_state`, que normalmente está oculta.)

Em `client_node_id` e `client_block_ref`, `client` refere-se a uma API do NDB Cluster ou a um nó SQL (ou seja, um cliente da API NDB ou um servidor MySQL conectado ao cluster).

A coluna `block_instance` fornece o número da instância de bloco do kernel `DBTC`. Você pode usar isso para obter informações sobre threads específicos da tabela `threadblocks`.