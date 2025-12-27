#### 25.6.15.8 A tabela de operações de cluster ndbinfo

A tabela `cluster_operations` fornece uma visão por operação (chave primária estatisticamente atualizada) de toda a atividade no NDB Cluster do ponto de vista dos blocos de gerenciamento de dados locais (LQH) (consulte o bloco DBLQH).

A tabela `cluster_operations` contém as seguintes colunas:

* `node_id`

  ID do nó do bloco LQH de relatório

* `block_instance`

  Instância do bloco LQH

* `transid`

  ID da transação

* `operation_type`

  Tipo de operação (consulte o texto para os possíveis valores)

* `state`

  Estado da operação (consulte o texto para os possíveis valores)

* `tableid`

  ID da tabela

* `fragmentid`

  ID do fragmento

* `client_node_id`

  ID do nó do cliente

* `client_block_ref`

  Referência do bloco do cliente

* `tc_node_id`

  ID do nó do coordenador da transação

* `tc_block_no`

  Número do bloco do coordenador da transação

* `tc_block_instance`

  Instância do bloco do coordenador da transação

##### Notas

O ID da transação é um número único de 64 bits que pode ser obtido usando o método `getTransactionId()` da API NDB. (Atualmente, o MySQL Server não exibe o ID da transação NDB da API de uma transação em andamento.)

A coluna `operation_type` pode assumir qualquer um dos valores `READ`, `READ-SH`, `READ-EX`, `INSERT`, `UPDATE`, `DELETE`, `WRITE`, `UNLOCK`, `REFRESH`, `SCAN`, `SCAN-SH`, `SCAN-EX`, ou `<unknown>`.

A coluna `state` pode ter qualquer um dos valores `ABORT_QUEUED`, `ABORT_STOPPED`, `COMMITTED`, `COMMIT_QUEUED`, `COMMIT_STOPPED`, `COPY_CLOSE_STOPPED`, `COPY_FIRST_STOPPED`, `COPY_STOPPED`, `COPY_TUPKEY`, `IDLE`, `LOG_ABORT_QUEUED`, `LOG_COMMIT_QUEUED`, `LOG_COMMIT_QUEUED_WAIT_SIGNAL`, `LOG_COMMIT_WRITTEN`, `LOG_COMMIT_WRITTEN_WAIT_SIGNAL`, `LOG_QUEUED`, `PREPARED`, `PREPARED_RECEIVED_COMMIT`, `SCAN_CHECK_STOPPED`, `SCAN_CLOSE_STOPPED`, `SCAN_FIRST_STOPPED`, `SCAN_RELEASE_STOPPED`, `SCAN_STATE_USED`, `SCAN_STOPPED`, `SCAN_TUPKEY`, `STOPPED`, `TC_NOT_CONNECTED`, `WAIT_ACC`, `WAIT_ACC_ABORT`, `WAIT_AI_AFTER_ABORT`, `WAIT_ATTR`, `WAIT_SCAN_AI`, `WAIT_TUP`, `WAIT_TUPKEYINFO`, `WAIT_TUP_COMMIT`, ou `WAIT_TUP_TO_ABORT`. (Se o servidor MySQL estiver rodando com `ndbinfo_show_hidden` habilitado, você pode visualizar essa lista de estados selecionando a tabela `ndb$dblqh_tcconnect_state`, que normalmente é oculta.)

Você pode obter o nome de uma tabela `NDB` a partir de seu ID de tabela verificando a saída de **ndb\_show\_tables**.

O `fragid` é o mesmo que o número de partição visto na saída de **ndb\_desc** `--extra-partition-info` (forma abreviada `-p`).

Em `client_node_id` e `client_block_ref`, `client` refere-se a uma API do NDB Cluster ou a um nó SQL (ou seja, um cliente da API NDB ou um servidor MySQL conectado ao cluster).

As colunas `block_instance` e `tc_block_instance` fornecem, respectivamente, os números de instância de bloco `DBLQH` e `DBTC`. Você pode usar esses valores junto com os nomes dos blocos para obter informações sobre threads específicas da tabela `threadblocks`.