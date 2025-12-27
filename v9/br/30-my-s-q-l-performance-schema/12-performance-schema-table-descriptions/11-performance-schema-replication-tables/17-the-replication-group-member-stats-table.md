#### 29.12.11.17 Tabela `replication\_group\_member\_stats`

Esta tabela mostra informações estatísticas dos membros do grupo de replicação. Ela é preenchida apenas quando a Replicação de Grupo está em execução.

A tabela `replication_group_member_stats` tem as seguintes colunas:

* `CHANNEL_NAME`

  Nome do canal de Replicação de Grupo

* `VIEW_ID`

  Identificador atual da visão para este grupo.

* `MEMBER_ID`

  O UUID do servidor membro. Este tem um valor diferente para cada membro do grupo. Isso também serve como chave porque é único para cada membro.

* `COUNT_TRANSACTIONS_IN_QUEUE`

  Número de transações na fila aguardando verificações de detecção de conflitos. Uma vez que as transações foram verificadas quanto a conflitos, se passarem na verificação, são colocadas na fila para serem aplicadas também.

* `COUNT_TRANSACTIONS_CHECKED`

  Número de transações que foram verificadas quanto a conflitos.

* `COUNT_CONFLICTS_DETECTED`

  Número de transações que não passaram na verificação de detecção de conflitos.

* `COUNT_TRANSACTIONS_ROWS_VALIDATING`

  Número de linhas de transações que podem ser usadas para certificação, mas ainda não foram coletadas. Pode ser pensado como o tamanho atual do banco de dados de detecção de conflitos contra o qual cada transação é certificada.

* `TRANSACTIONS_COMMITTED_ALL_MEMBERS`

  As transações que foram comprometidas com sucesso em todos os membros do grupo de replicação, mostradas como Conjuntos de GTID. Isso é atualizado em um intervalo de tempo fixo.

* `LAST_CONFLICT_FREE_TRANSACTION`

  O identificador de transação da última transação livre de conflitos que foi verificada.

* `COUNT_TRANSACTIONS_REMOTE_IN_APPLIER_QUEUE`

  Número de transações que este membro recebeu do grupo de replicação que estão aguardando aplicação.

* `COUNT_TRANSACTIONS_REMOTE_APPLIED`

Número de transações que esse membro recebeu do grupo e aplicou.

* `COUNT_TRANSACTIONS_LOCAL_PROPOSTAS`

Número de transações que se originaram desse membro e foram enviadas para o grupo.

* `COUNT_TRANSACTIONS_LOCAL_REVERSADAS`

Número de transações que se originaram desse membro e foram revertidas pelo grupo.

A tabela `replication_group_member_stats` não tem índices.

O `TRUNCATE TABLE` não é permitido para a tabela `replication_group_member_stats`.