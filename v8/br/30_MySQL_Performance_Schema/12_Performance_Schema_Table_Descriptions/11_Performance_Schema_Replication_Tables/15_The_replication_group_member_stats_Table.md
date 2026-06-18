#### 29.12.11.15 A tabela replication\_group\_member\_stats

Esta tabela mostra informações estatísticas para os membros do grupo de replicação. Ela é preenchida apenas quando a Replicação de Grupo está em execução.

A tabela `replication_group_member_stats` tem essas colunas:

- `CHANNEL_NAME`

  Nome do canal de replicação em grupo

- `VIEW_ID`

  Identificador de visualização atual para este grupo.

- `MEMBER_ID`

  O UUID do servidor membro. Este tem um valor diferente para cada membro do grupo. Ele também serve como uma chave porque é único para cada membro.

- `COUNT_TRANSACTIONS_IN_QUEUE`

  O número de transações na fila aguardando verificações de detecção de conflitos. Uma vez que as transações tenham sido verificadas quanto a conflitos, se passarem na verificação, elas também serão colocadas na fila para serem aplicadas.

- `COUNT_TRANSACTIONS_CHECKED`

  Número de transações que foram verificadas quanto a conflitos.

- `COUNT_CONFLICTS_DETECTED`

  O número de transações que não passaram na verificação de detecção de conflitos.

- `COUNT_TRANSACTIONS_ROWS_VALIDATING`

  Número de linhas de transação que podem ser usadas para certificação, mas ainda não foram coletadas como lixo. Pode ser pensado como o tamanho atual do banco de dados de detecção de conflitos contra o qual cada transação é certificada.

- `TRANSACTIONS_COMMITTED_ALL_MEMBERS`

  As transações que foram comprometidas com sucesso em todos os membros do grupo de replicação, mostradas como Conjuntos de GTID. Isso é atualizado em um intervalo de tempo fixo.

- `LAST_CONFLICT_FREE_TRANSACTION`

  O identificador de transação do último registro de transação livre de conflitos que foi verificado.

- `COUNT_TRANSACTIONS_REMOTE_IN_APPLIER_QUEUE`

  O número de transações que esse membro recebeu do grupo de replicação e que estão aguardando para serem aplicadas.

- `COUNT_TRANSACTIONS_REMOTE_APPLIED`

  Número de transações que esse membro recebeu do grupo e aplicou.

- `COUNT_TRANSACTIONS_LOCAL_PROPOSED`

  Número de transações que foram geradas por este membro e enviadas para o grupo.

- `COUNT_TRANSACTIONS_LOCAL_ROLLBACK`

  Número de transações que foram geradas por este membro e foram revertidas pelo grupo.

A tabela `replication_group_member_stats` não tem índices.

`TRUNCATE TABLE` não é permitido para a tabela `replication_group_member_stats`.
