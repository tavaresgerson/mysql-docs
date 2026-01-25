#### 25.12.11.7 A Tabela replication_group_member_stats

Esta tabela exibe informações estatísticas para os membros do MySQL Group Replication. Ela é populada apenas quando o Group Replication está em execução.

A tabela `replication_group_member_stats` possui as seguintes colunas:

* `CHANNEL_NAME`

  Nome do canal do Group Replication.

* `VIEW_ID`

  Identificador da view atual para este grupo.

* `MEMBER_ID`

  O UUID do servidor membro. Este valor é diferente para cada membro no grupo. Ele também serve como uma key porque é único para cada membro.

* `COUNT_TRANSACTIONS_IN_QUEUE`

  O número de Transactions na queue pendentes para verificações de detecção de conflito. Uma vez que as Transactions tenham sido verificadas quanto a conflitos, se passarem na verificação, elas também são colocadas em queue para serem aplicadas.

* `COUNT_TRANSACTIONS_CHECKED`

  O número de Transactions que foram verificadas quanto a conflitos.

* `COUNT_CONFLICTS_DETECTED`

  O número de Transactions que não passaram na verificação de detecção de conflitos.

* `COUNT_TRANSACTIONS_ROWS_VALIDATING`

  Número de linhas de Transaction que podem ser usadas para certificação, mas que não foram coletadas pelo garbage collector. Pode ser considerado o tamanho atual do Database de detecção de conflitos contra o qual cada Transaction é certificada.

* `TRANSACTIONS_COMMITTED_ALL_MEMBERS`

  As Transactions que foram confirmadas (committed) com sucesso em todos os membros do grupo de replicação, mostradas como [GTID Sets](replication-gtids-concepts.html#replication-gtids-concepts-gtid-sets "GTID Sets"). Isso é atualizado em um intervalo de tempo fixo.

* `LAST_CONFLICT_FREE_TRANSACTION`

  O identificador da Transaction livre de conflitos mais recente que foi verificada.

O [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") não é permitido para a tabela [`replication_group_member_stats`](performance-schema-replication-group-member-stats-table.html "25.12.11.7 A Tabela replication_group_member_stats").