#### 25.6.15.9 A tabela ndbinfo cluster_transactions

A tabela `cluster_transactions` mostra informações sobre todas as transações em andamento em um NDB Cluster.

A tabela `cluster_transactions` contém as seguintes colunas:

* `node_id`

  ID do nó do coordenador da transação

* `block_instance`

  Instância do bloco TC

* `transid`

  ID da transação

* `state`

  Estado da operação (consulte o texto para os possíveis valores)

* `count_operations`

  Número de operações de chave primária estatisticamente significativas na transação (inclui leituras com bloqueios, bem como operações DML)

* `outstanding_operations`

  Operações ainda em execução em blocos de gerenciamento de dados locais

* `inactive_seconds`

  Tempo gasto esperando pela API

* `client_node_id`

  ID do nó do cliente

* `client_block_ref`

  Referência do bloco do cliente

##### Notas

O ID da transação é um número único de 64 bits que pode ser obtido usando o método `getTransactionId()` da API NDB. (Atualmente, o MySQL Server não exibe o ID de transação da API NDB de uma transação em andamento.)

`block_instance` refere-se a uma instância de um bloco do kernel. Juntamente com o nome do bloco, esse número pode ser usado para procurar uma instância específica na tabela `threadblocks`.

A coluna `state` pode ter qualquer um dos valores `CS_ABORTING`, `CS_COMMITTING`, `CS_COMMIT_SENT`, `CS_COMPLETE_SENT`, `CS_COMPLETING`, `CS_CONNECTED`, `CS_DISCONNECTED`, `CS_FAIL_ABORTED`, `CS_FAIL_ABORTING`, `CS_FAIL_COMMITTED`, `CS_FAIL_COMMITTING`, `CS_FAIL_COMPLETED`, `CS_FAIL_PREPARED`, `CS_PREPARE_TO_COMMIT`, `CS_RECEIVING`, `CS_REC_COMMITTING`, `CS_RESTART`, `CS_SEND_FIRE_TRIG_REQ`, `CS_STARTED`, `CS_START_COMMITTING`, `CS_START_SCAN`, `CS_WAIT_ABORT_CONF`, `CS_WAIT_COMMIT_CONF`, `CS_WAIT_COMPLETE_CONF`, `CS_WAIT_FIRE_TRIG_REQ`. (Se o servidor MySQL estiver rodando com `ndbinfo_show_hidden` habilitado, você pode visualizar essa lista de estados selecionando a tabela `ndb$dbtc_apiconnect_state`, que normalmente é oculta.)

Em `client_node_id` e `client_block_ref`, `client` refere-se a uma API ou nó de SQL do NDB Cluster (ou seja, um cliente da API NDB ou um servidor MySQL conectado ao cluster).

A coluna `tc_block_instance` fornece o número da instância de bloco `DBTC`. Você pode usar isso junto com o nome do bloco para obter informações sobre threads específicas da tabela `threadblocks`.