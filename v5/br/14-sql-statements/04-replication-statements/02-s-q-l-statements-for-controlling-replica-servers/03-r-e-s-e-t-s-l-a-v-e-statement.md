#### 13.4.2.3 Declaração RESET SLAVE

```sql
RESET SLAVE [ALL] [channel_option]

channel_option:
    FOR CHANNEL channel
```

A declaração [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") faz com que a replica esqueça sua posição de replicação no Binary Log da source. Esta declaração destina-se a ser usada para um início limpo: ela limpa os repositórios de metadados de replicação, deleta todos os arquivos de relay log e inicia um novo arquivo de relay log. Ela também redefine para 0 o atraso de replicação especificado com a opção `MASTER_DELAY` na declaração `CHANGE MASTER TO`.

Nota

Todos os arquivos de relay log são deletados, mesmo que não tenham sido completamente executados pelo SQL thread de replicação. (Esta é uma condição provável de existir em uma replica se você tiver emitido uma declaração [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") ou se a replica estiver altamente carregada.)

Para um servidor onde GTIDs estão em uso ([`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) é `ON`), emitir [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") não tem efeito no histórico de execução de GTID. A declaração não altera os valores de `gtid_executed` ou `gtid_purged`, ou a tabela `mysql.gtid_executed`. Se você precisar redefinir o histórico de execução de GTID, use [`RESET MASTER`](reset-master.html "13.4.1.2 RESET MASTER Statement"), mesmo que o servidor com GTID ativado seja uma replica onde o Binary Logging está desabilitado.

[`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") requer o privilégio [`RELOAD`](privileges-provided.html#priv_reload).

Para usar [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement"), os Threads de replicação devem estar parados, então em uma replica em execução use [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") antes de emitir [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement"). Para usar [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") em um membro de grupo de Group Replication, o status do membro deve ser `OFFLINE`, significando que o plugin está carregado, mas o membro atualmente não pertence a nenhum grupo. Um membro do grupo pode ser colocado offline usando uma declaração [`STOP GROUP REPLICATION`](stop-group-replication.html "13.4.3.2 STOP GROUP_REPLICATION Statement").

A cláusula opcional `FOR CHANNEL channel` permite nomear a qual Replication Channel a declaração se aplica. Fornecer uma cláusula `FOR CHANNEL channel` aplica a declaração `RESET SLAVE` a um Replication Channel específico. Combinar uma cláusula `FOR CHANNEL channel` com a opção `ALL` deleta o Channel especificado. Se nenhum Channel for nomeado e não existirem Channels extras, a declaração se aplica ao default channel. Emitir uma declaração [`RESET SLAVE ALL`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") sem uma cláusula `FOR CHANNEL channel` quando múltiplos Replication Channels existem, deleta *todos* os Replication Channels e recria apenas o default channel. Veja [Section 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels") para mais informações.

[`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") não altera nenhum parâmetro de conexão de replicação, como o nome do host e a porta da source, ou o nome da conta de usuário de replicação e sua senha.

* A partir do MySQL 5.7.24, quando [`master_info_repository=TABLE`](replication-options-replica.html#sysvar_master_info_repository) está configurado no servidor, os parâmetros de conexão de replicação são preservados na tabela `InnoDB` `mysql.slave_master_info` (com segurança contra falhas) como parte da operação [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement"). Eles também são mantidos na memória. No caso de uma saída inesperada do servidor ou reinício deliberado após emitir [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement"), mas antes de emitir [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement"), os parâmetros de conexão de replicação são recuperados da tabela e reutilizados para a nova conexão.

* Quando [`master_info_repository=FILE`](replication-options-replica.html#sysvar_master_info_repository) está configurado no servidor (o que é o padrão no MySQL 5.7), os parâmetros de conexão de replicação são mantidos apenas na memória. Se o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") da replica for reiniciado imediatamente após emitir [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") devido a uma saída inesperada do servidor ou reinício deliberado, os parâmetros de conexão são perdidos. Nesse caso, você deve emitir uma declaração [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") após a inicialização do servidor para reespecificar os parâmetros de conexão antes de emitir [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement").

Se você deseja redefinir intencionalmente os parâmetros de conexão, você precisa usar [`RESET SLAVE ALL`](reset-slave.html "13.4.2.3 RESET SLAVE Statement"), que limpa os parâmetros de conexão. Nesse caso, você deve emitir uma declaração [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") após a inicialização do servidor para especificar os novos parâmetros de conexão.

`RESET SLAVE` causa um commit implícito de uma Transaction em andamento. Veja [Section 13.3.3, “Statements That Cause an Implicit Commit”](implicit-commit.html "13.3.3 Statements That Cause an Implicit Commit").

Se o SQL thread de replicação estava no meio da replicação de temporary tables (tabelas temporárias) quando foi parado, e [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") for emitido, essas temporary tables replicadas são deletadas na replica.

Antes do MySQL 5.7.5, `RESET SLAVE` também tinha o efeito de redefinir tanto o período de heartbeat ([`Slave_heartbeat_period`](server-status-variables.html#statvar_Slave_heartbeat_period)) quanto `SSL_VERIFY_SERVER_CERT`. Este problema foi corrigido no MySQL 5.7.5 e versões posteriores. (Bug #18777899, Bug #18778485)

Antes do MySQL 5.7.5, `RESET SLAVE ALL` não limpava a lista `IGNORE_SERVER_IDS` definida por [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement"). No MySQL 5.7.5 e versões posteriores, a declaração limpa a lista. (Bug #18816897)

Nota

Quando usada em um SQL node de replica NDB Cluster, `RESET SLAVE` limpa a tabela `mysql.ndb_apply_status`. Você deve ter em mente ao usar esta declaração que `ndb_apply_status` usa o storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") e, portanto, é compartilhada por todos os SQL nodes anexados ao cluster da replica.

Você pode anular este comportamento emitindo [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") `GLOBAL @@`[`ndb_clear_apply_status=OFF`](mysql-cluster-options-variables.html#sysvar_ndb_clear_apply_status) antes de executar `RESET SLAVE`, o que impede que a replica realize a purga da tabela `ndb_apply_status` em tais casos.