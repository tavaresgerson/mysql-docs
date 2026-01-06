## 17.4 Replicação do Grupo de Monitoramento

17.4.1 Estados dos Servidores de Replicação de Grupo

17.4.2 A tabela replication\_group\_members

Tabela replication\_group\_member\_stats

Você pode usar o MySQL Schema de Desempenho para monitorar a Replicação de Grupo. Essas tabelas do Schema de Desempenho exibem informações específicas para a Replicação de Grupo:

- `replication_group_member_stats`: Veja a Seção 17.4.3, “A tabela replication\_group\_member\_stats”.

- `replication_group_members`: Veja [Seção 17.4.2, “A tabela replication\_group\_members”](group-replication-replication-group-members.html).

Essas tabelas de replicação do Schema de Desempenho também mostram informações relacionadas à Replicação por Grupo:

- O [`replication_connection_status`](performance-schema-replication-connection-status-table.html) mostra informações sobre a Replicação por Grupo, como as transações recebidas do grupo e colocadas na fila do aplicável (registro do retransmissor).

- O [`replication_applier_status`](performance-schema-replication-applier-status-table.html) mostra os estados dos canais e threads relacionados à Replicação por Grupo. Esses dados também podem ser usados para monitorar o que as threads individuais dos trabalhadores estão fazendo.

Os canais de replicação criados pelo plugin de replicação em grupo estão listados aqui:

- `group_replication_recovery`: Usado para alterações de replicação relacionadas à recuperação distribuída.

- `group_replication_applier`: Usado para as alterações recebidas do grupo, para aplicar transações que vêm diretamente do grupo.

Para obter informações sobre as variáveis do sistema que afetam a Replicação em Grupo, consulte [Seção 17.7.1, “Variáveis do Sistema de Replicação em Grupo”](group-replication-system-variables.html). Consulte [Seção 17.7.2, “Variáveis de Status da Replicação em Grupo”](group-replication-status-variables.html), para variáveis de status que fornecem informações sobre a Replicação em Grupo.

Nota

Se você está monitorando uma ou mais instâncias secundárias usando [**mysqladmin**](mysqladmin.html), você deve estar ciente de que uma instrução [`FLUSH STATUS`](flush.html#flush-status) executada por esse utilitário cria um evento GTID na instância local, o que pode afetar operações futuras do grupo.
