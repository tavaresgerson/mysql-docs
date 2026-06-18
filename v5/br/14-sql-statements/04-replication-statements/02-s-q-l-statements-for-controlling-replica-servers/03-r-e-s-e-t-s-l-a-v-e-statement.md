#### 13.4.2.3 Declaração RESET SLAVE

```sql
RESET SLAVE [ALL] [channel_option]

channel_option:
    FOR CHANNEL channel
```

A declaração `RESET SLAVE` faz com que a replica esqueça sua posição de replicação no Binary Log da source. Esta declaração destina-se a ser usada para um início limpo: ela limpa os repositórios de metadados de replicação, deleta todos os arquivos de relay log e inicia um novo arquivo de relay log. Ela também redefine para 0 o atraso de replicação especificado com a opção `MASTER_DELAY` na declaração `CHANGE MASTER TO`.

Nota

Todos os arquivos de relay log são deletados, mesmo que não tenham sido completamente executados pelo SQL thread de replicação. (Esta é uma condição provável de existir em uma replica se você tiver emitido uma declaração `STOP SLAVE` ou se a replica estiver altamente carregada.)

Para um servidor onde GTIDs estão em uso (`gtid_mode` é `ON`), emitir `RESET SLAVE` não tem efeito no histórico de execução de GTID. A declaração não altera os valores de `gtid_executed` ou `gtid_purged`, ou a tabela `mysql.gtid_executed`. Se você precisar redefinir o histórico de execução de GTID, use `RESET MASTER`, mesmo que o servidor com GTID ativado seja uma replica onde o Binary Logging está desabilitado.

`RESET SLAVE` requer o privilégio `RELOAD`.

Para usar `RESET SLAVE`, os Threads de replicação devem estar parados, então em uma replica em execução use `STOP SLAVE` antes de emitir `RESET SLAVE`. Para usar `RESET SLAVE` em um membro de grupo de Group Replication, o status do membro deve ser `OFFLINE`, significando que o plugin está carregado, mas o membro atualmente não pertence a nenhum grupo. Um membro do grupo pode ser colocado offline usando uma declaração `STOP GROUP REPLICATION`.

A cláusula opcional `FOR CHANNEL channel` permite nomear a qual Replication Channel a declaração se aplica. Fornecer uma cláusula `FOR CHANNEL channel` aplica a declaração `RESET SLAVE` a um Replication Channel específico. Combinar uma cláusula `FOR CHANNEL channel` com a opção `ALL` deleta o Channel especificado. Se nenhum Channel for nomeado e não existirem Channels extras, a declaração se aplica ao default channel. Emitir uma declaração `RESET SLAVE ALL` sem uma cláusula `FOR CHANNEL channel` quando múltiplos Replication Channels existem, deleta *todos* os Replication Channels e recria apenas o default channel. Veja Section 16.2.2, “Replication Channels” para mais informações.

`RESET SLAVE` não altera nenhum parâmetro de conexão de replicação, como o nome do host e a porta da source, ou o nome da conta de usuário de replicação e sua senha.

* A partir do MySQL 5.7.24, quando `master_info_repository=TABLE` está configurado no servidor, os parâmetros de conexão de replicação são preservados na tabela `InnoDB` `mysql.slave_master_info` (com segurança contra falhas) como parte da operação `RESET SLAVE`. Eles também são mantidos na memória. No caso de uma saída inesperada do servidor ou reinício deliberado após emitir `RESET SLAVE`, mas antes de emitir `START SLAVE`, os parâmetros de conexão de replicação são recuperados da tabela e reutilizados para a nova conexão.

* Quando `master_info_repository=FILE` está configurado no servidor (o que é o padrão no MySQL 5.7), os parâmetros de conexão de replicação são mantidos apenas na memória. Se o **mysqld** da replica for reiniciado imediatamente após emitir `RESET SLAVE` devido a uma saída inesperada do servidor ou reinício deliberado, os parâmetros de conexão são perdidos. Nesse caso, você deve emitir uma declaração `CHANGE MASTER TO` após a inicialização do servidor para reespecificar os parâmetros de conexão antes de emitir `START SLAVE`.

Se você deseja redefinir intencionalmente os parâmetros de conexão, você precisa usar `RESET SLAVE ALL`, que limpa os parâmetros de conexão. Nesse caso, você deve emitir uma declaração `CHANGE MASTER TO` após a inicialização do servidor para especificar os novos parâmetros de conexão.

`RESET SLAVE` causa um commit implícito de uma Transaction em andamento. Veja Section 13.3.3, “Statements That Cause an Implicit Commit”.

Se o SQL thread de replicação estava no meio da replicação de temporary tables (tabelas temporárias) quando foi parado, e `RESET SLAVE` for emitido, essas temporary tables replicadas são deletadas na replica.

Antes do MySQL 5.7.5, `RESET SLAVE` também tinha o efeito de redefinir tanto o período de heartbeat (`Slave_heartbeat_period`) quanto `SSL_VERIFY_SERVER_CERT`. Este problema foi corrigido no MySQL 5.7.5 e versões posteriores. (Bug #18777899, Bug #18778485)

Antes do MySQL 5.7.5, `RESET SLAVE ALL` não limpava a lista `IGNORE_SERVER_IDS` definida por `CHANGE MASTER TO`. No MySQL 5.7.5 e versões posteriores, a declaração limpa a lista. (Bug #18816897)

Nota

Quando usada em um SQL node de replica NDB Cluster, `RESET SLAVE` limpa a tabela `mysql.ndb_apply_status`. Você deve ter em mente ao usar esta declaração que `ndb_apply_status` usa o storage engine `NDB` e, portanto, é compartilhada por todos os SQL nodes anexados ao cluster da replica.

Você pode anular este comportamento emitindo `SET` `GLOBAL @@``ndb_clear_apply_status=OFF` antes de executar `RESET SLAVE`, o que impede que a replica realize a purga da tabela `ndb_apply_status` em tais casos.