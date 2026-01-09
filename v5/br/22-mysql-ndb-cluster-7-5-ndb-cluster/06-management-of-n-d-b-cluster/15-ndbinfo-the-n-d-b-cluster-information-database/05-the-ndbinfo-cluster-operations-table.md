#### 21.6.15.5 A tabela ndbinfo cluster_operations

A tabela `cluster_operations` fornece uma visão por operação (op de chave primária declarativa) de toda a atividade no NDB Cluster do ponto de vista dos blocos de gerenciamento de dados locais (LQH) (consulte O bloco DBLQH).

A tabela `cluster_operations` contém as seguintes colunas:

- `node_id`

  ID do nó do bloco de relatórios LQH

- `block_instance`

  Instância do bloco LQH

- `transid`

  ID da transação

- `tipo_operação`

  Tipo de operação (consulte o texto para os possíveis valores)

- "estado"

  Estado de operação (consulte o texto para os possíveis valores)

- `tableid`

  Tabela ID

- `fragmentid`

  ID do fragmento

- `client_node_id`

  ID do nó do cliente

- `client_block_ref`

  Referência de bloqueio do cliente

- `tc_node_id`

  ID do nó do coordenador de transação

- `tc_block_no`

  Número do bloco do coordenador de transação

- `tc_block_instance`

  Instância de bloco do coordenador de transação

##### Notas

O ID da transação é um número único de 64 bits que pode ser obtido usando o método `getTransactionId()` da API NDB. (Atualmente, o MySQL Server não exibe o ID da transação da API NDB de uma transação em andamento.)

A coluna `operation_type` pode assumir qualquer um dos valores `READ`, `READ-SH`, `READ-EX`, `INSERT`, `UPDATE`, `DELETE`, `WRITE`, `UNLOCK`, `REFRESH`, `SCAN`, `SCAN-SH`, `SCAN-EX`, ou `<unknown>`.

A coluna `state` pode ter qualquer um dos valores `ABORT_QUEUED`, `ABORT_STOPPED`, `COMMITTED`, `COMMIT_QUEUED`, `COMMIT_STOPPED`, `COPY_CLOSE_STOPPED`, `COPY_FIRST_STOPPED`, `COPY_STOPPED`, `COPY_TUPKEY`, `IDLE`, `LOG_ABORT_QUEUED`, `LOG_COMMIT_QUEUED`, `LOG_COMMIT_QUEUED_WAIT_SIGNAL`, `LOG_COMMIT_WRITTEN`, `LOG_COMMIT_WRITTEN_WAIT_SIGNAL`, `LOG_QUEUED`, `PREPARED`, `PREPARED_RECEIVED_COMMIT`, `SCAN_CHECK_STOPPED`, `SCAN_CLOSE_STOPPED`, `SCAN_FIRST_STOPPED`, `SCAN_RELEASE_STOPPED`, `SCAN_STATE_USED`, `SCAN_STOPPED`, `SCAN_TUPKEY`, `STOPPED`, `TC_NOT_CONNECTED`, `WAIT_ACC`, `WAIT_ACC_ABORT`, `WAIT_AI_AFTER_ABORT`, `WAIT_ATTR`, `WAIT_SCAN_AI`, `WAIT_TUP`, `WAIT_TUPKEYINFO`, `WAIT_TUP_COMMIT`, ou `WAIT_TUP_TO_ABORT`. (Se o servidor MySQL estiver rodando com a opção `ndbinfo_show_hidden` habilitada, você pode visualizar essa lista de estados selecionando da tabela `ndb$dblqh_tcconnect_state`, que normalmente está oculta.)

Você pode obter o nome de uma tabela `NDB` a partir de seu ID de tabela, verificando a saída de **ndb_show_tables**.

O `fragid` é o mesmo número de partição visto na saída do **ndb_desc** `--extra-partition-info` (forma abreviada `-p`).

Em `client_node_id` e `client_block_ref`, `client` refere-se a um nó da API do NDB Cluster ou a um nó SQL (ou seja, um cliente da API NDB ou um servidor MySQL conectado ao cluster).

As colunas `block_instance` e `tc_block_instance` fornecem, respectivamente, os números de instâncias de bloco `DBLQH` e `DBTC`. Você pode usar essas informações juntamente com os nomes dos blocos para obter informações sobre threads específicas da tabela `threadblocks` (mysql-cluster-ndbinfo-threadblocks.html).
