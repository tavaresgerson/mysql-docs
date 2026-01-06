#### 21.6.15.6 A tabela ndbinfo cluster\_transactions

A tabela `cluster_transactions` mostra informações sobre todas as transações em andamento em um NDB Cluster.

A tabela `cluster_transactions` contém as seguintes colunas:

- `node_id`

  ID do nó do coordenador da transação

- `block_instance`

  Instância de bloqueio de TC

- `transid`

  ID da transação

- "estado"

  Estado de operação (consulte o texto para os possíveis valores)

- `contagem de operações`

  Número de operações de chave primária estendida na transação (inclui leituras com bloqueios, bem como operações de DML)

- "operações em andamento"

  Operações ainda sendo executadas em blocos locais de gerenciamento de dados

- `inactive_seconds`

  Tempo gasto esperando pela API

- `client_node_id`

  ID do nó do cliente

- `client_block_ref`

  Referência de bloqueio do cliente

##### Notas

O ID da transação é um número único de 64 bits que pode ser obtido usando o método `getTransactionId()` da API NDB. (Atualmente, o MySQL Server não exibe o ID da transação da API NDB de uma transação em andamento.)

`block_instance` refere-se a uma instância de um bloco de kernel. Juntamente com o nome do bloco, esse número pode ser usado para procurar uma instância específica na tabela `threadblocks`.

A coluna `state` pode ter qualquer um dos valores `CS_ABORTING`, `CS_COMMITTING`, `CS_COMMIT_SENT`, `CS_COMPLETE_SENT`, `CS_COMPLETING`, `CS_CONNECTED`, `CS_DISCONNECTED`, `CS_FAIL_ABORTED`, `CS_FAIL_ABORTING`, `CS_FAIL_COMMITTED`, `CS_FAIL_COMMITTING`, `CS_FAIL_COMPLETED`, `CS_FAIL_PREPARED`, `CS_PREPARE_TO_COMMIT`, `CS_RECEIVING`, `CS_REC_COMMITTING`, `CS_RESTART`, `CS_SEND_FIRE_TRIG_REQ`, `CS_STARTED`, `CS_START_COMMITTING`, `CS_START_SCAN`, `CS_WAIT_ABORT_CONF`, `CS_WAIT_COMMIT_CONF`, `CS_WAIT_COMPLETE_CONF`, `CS_WAIT_FIRE_TRIG_REQ`. (Se o servidor MySQL estiver rodando com a opção `ndbinfo_show_hidden` habilitada, você pode visualizar essa lista de estados selecionando a tabela `ndb$dbtc_apiconnect_state`, que normalmente está oculta.)

Em `client_node_id` e `client_block_ref`, `client` refere-se a um nó da API do NDB Cluster ou a um nó SQL (ou seja, um cliente da API NDB ou um servidor MySQL conectado ao cluster).

A coluna `tc_block_instance` fornece o número da instância de bloco `DBTC`. Você pode usar isso junto com o nome do bloco para obter informações sobre threads específicas da tabela `threadblocks`.
