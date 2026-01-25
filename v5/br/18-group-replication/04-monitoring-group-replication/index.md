## 17.4 Monitoramento do Group Replication

[17.4.1 Estados do Servidor do Group Replication](group-replication-server-states.html)

[17.4.2 A Tabela replication_group_members](group-replication-replication-group-members.html)

[17.4.3 A Tabela replication_group_member_stats](group-replication-replication-group-member-stats.html)

Você pode usar o [Performance Schema](performance-schema.html "Capítulo 25 MySQL Performance Schema") do MySQL para monitorar o Group Replication. Estas tabelas do Performance Schema exibem informações específicas do Group Replication:

* [`replication_group_member_stats`](performance-schema-replication-group-member-stats-table.html "25.12.11.7 A Tabela replication_group_member_stats"): Veja [Seção 17.4.3, “A Tabela replication_group_member_stats”](group-replication-replication-group-member-stats.html "17.4.3 A Tabela replication_group_member_stats").

* [`replication_group_members`](performance-schema-replication-group-members-table.html "25.12.11.8 A Tabela replication_group_members"): Veja [Seção 17.4.2, “A Tabela replication_group_members”](group-replication-replication-group-members.html "17.4.2 A Tabela replication_group_members").

Estas tabelas de replication do Performance Schema também mostram informações relacionadas ao Group Replication:

* [`replication_connection_status`](performance-schema-replication-connection-status-table.html "25.12.11.2 A Tabela replication_connection_status") mostra informações referentes ao Group Replication, como transações recebidas do grupo e enfileiradas na applier queue (relay log).

* [`replication_applier_status`](performance-schema-replication-applier-status-table.html "25.12.11.4 A Tabela replication_applier_status") mostra os estados dos channels e threads relacionados ao Group Replication. Estes também podem ser usados para monitorar o que os worker threads individuais estão fazendo.

Os channels de Replication criados pelo plugin Group Replication estão listados aqui:

* `group_replication_recovery`: Usado para alterações de replication relacionadas à distributed recovery.

* `group_replication_applier`: Usado para as alterações de entrada do grupo, para aplicar transações vindas diretamente do grupo.

Para informações sobre system variables que afetam o Group Replication, veja [Seção 17.7.1, “System Variables do Group Replication”](group-replication-system-variables.html "17.7.1 System Variables do Group Replication"). Veja [Seção 17.7.2, “Status Variables do Group Replication”](group-replication-status-variables.html "17.7.2 Status Variables do Group Replication"), para status variables que fornecem informações sobre o Group Replication.

Note

Se você estiver monitorando uma ou mais instâncias secundárias usando [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — Um Programa de Administração de Servidor MySQL"), você deve estar ciente de que uma instrução [`FLUSH STATUS`](flush.html#flush-status) executada por esta utilidade cria um evento GTID na instância local, o que pode impactar futuras operações do grupo.
