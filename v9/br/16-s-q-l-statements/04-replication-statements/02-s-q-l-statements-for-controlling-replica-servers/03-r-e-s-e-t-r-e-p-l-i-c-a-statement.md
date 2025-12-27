#### 15.4.2.3 Declaração de RESET REPLICA

```
RESET REPLICA [ALL] [channel_option]

channel_option:
    FOR CHANNEL channel
```

`RESET REPLICA` faz com que a replica esqueça sua posição no log binário da fonte.

Esta declaração é usada para um início limpo; ela limpa os repositórios de metadados de replicação, exclui todos os arquivos de log de relevo e inicia um novo arquivo de log de relevo. Ela também redefere para 0 o atraso de replicação especificado com a opção `SOURCE_DELAY` da declaração `CHANGE REPLICATION SOURCE TO`.

Nota

Todos os arquivos de log de relevo são excluídos, mesmo que não tenham sido completamente executados pelo thread de SQL de replicação. (Esta é uma condição que provavelmente existe em uma replica se você tiver emitido uma declaração `STOP REPLICA` ou se a replica estiver muito carregada.)

Para um servidor onde GTIDs estão em uso (`gtid_mode` é `ON`), emitir `RESET REPLICA` não tem efeito no histórico de execução de GTIDs. A declaração não altera os valores de `gtid_executed` ou `gtid_purged`, ou a tabela `mysql.gtid_executed`. Se você precisar resetar o histórico de execução de GTIDs, use `RESET BINARY LOGS AND GTIDS`, mesmo que o servidor habilitado para GTIDs seja uma replica onde o registro binário está desativado.

`RESET REPLICA` requer o privilégio `RELOAD`.

Para usar `RESET REPLICA`, o thread de SQL de replicação e o thread de I/O de replicação (receptor) devem ser parados, então, em uma replica em execução, use `STOP REPLICA` antes de emitir `RESET REPLICA`. Para usar `RESET REPLICA` em um membro do grupo de replicação em grupo, o status do membro deve ser `OFFLINE`, o que significa que o plugin está carregado, mas o membro não pertence a nenhum grupo atualmente. Um membro do grupo pode ser desconectado usando uma declaração `STOP GROUP REPLICATION`.

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a declaração se aplica. Ao fornecer uma cláusula `FOR CHANNEL channel`, a declaração `RESET REPLICA` é aplicada a um canal de replicação específico. Combinar uma cláusula `FOR CHANNEL channel` com a opção `ALL` exclui o canal especificado. Se nenhum canal estiver nomeado e não houver canais extras, a declaração se aplica ao canal padrão. Ao emitir uma declaração `RESET REPLICA ALL` sem uma cláusula `FOR CHANNEL channel` quando existem vários canais de replicação, exclui *todos* os canais de replicação e recria apenas o canal padrão. Consulte a Seção 19.2.2, “Canais de Replicação”, para obter mais informações.

`RESET REPLICA` não altera nenhum dos parâmetros de conexão de replicação, que incluem o nome do host e a porta da fonte, a conta de usuário de replicação e sua senha, a conta `PRIVILEGE_CHECKS_USER`, a opção `REQUIRE_ROW_FORMAT`, a opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK` e a opção `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`. Se você quiser alterar algum dos parâmetros de conexão de replicação, pode fazer isso usando uma declaração `CHANGE REPLICATION SOURCE TO` após o servidor ser iniciado. Se você quiser remover todos os parâmetros de conexão de replicação, use `RESET REPLICA ALL`. `RESET REPLICA ALL` também limpa a lista `IGNORE_SERVER_IDS` definida por `CHANGE REPLICATION SOURCE TO`. Quando você tiver usado `RESET REPLICA ALL`, se quiser usar a instância como replica novamente, você precisa emitir uma declaração `CHANGE REPLICATION SOURCE TO` após o início do servidor para especificar novos parâmetros de conexão.

Você pode definir a opção `GTID_ONLY` na declaração `CHANGE REPLICATION SOURCE TO` para impedir que um canal de replicação persista nomes de arquivos e posições de arquivos nos repositórios de metadados de replicação. Quando você executa `RESET REPLICA`, os repositórios de metadados de replicação são sincronizados. `RESET REPLICA ALL` exclui, em vez de atualizar, os repositórios, então eles são sincronizados implicitamente.

Em caso de uma saída inesperada do servidor ou reinício deliberado após a execução de `RESET REPLICA`, mas antes de executar `START REPLICA`, os parâmetros de conexão de replicação são preservados nas tabelas `mysql.slave_master_info` e `mysql.slave_relay_log_info` do `InnoDB` resistentes a falhas como parte da operação `RESET REPLICA`. Eles também são retidos na memória. Em caso de uma saída inesperada do servidor ou reinício deliberado após a execução de `RESET REPLICA`, mas antes de executar `START REPLICA`, os parâmetros de conexão de replicação são recuperados das tabelas e reaplicados ao canal. Isso se aplica tanto aos repositórios de metadados de conexão quanto aos repositórios de metadados de aplicável.

`RESET REPLICA` não altera as configurações de filtros de replicação (como `--replicate-ignore-table`) para canais afetados pela declaração. No entanto, `RESET REPLICA ALL` remove os filtros de replicação que foram definidos nos canais excluídos pela declaração. Quando o canal ou canais excluídos são recriados, quaisquer filtros de replicação globais especificados para a replica são copiados para eles e nenhum filtro de replicação específico do canal é aplicado. Para mais informações, consulte a Seção 19.2.5.4, “Filtros Baseados em Canais de Replicação”.

`RESET REPLICA` causa um commit implícito de uma transação em andamento. Veja a Seção 15.3.3, “Declarações que Causam um Commit Implícito”.

Se o fio de replicação SQL estivesse em meio à replicação de tabelas temporárias quando foi interrompido e o comando `RESET REPLICA` for emitido, essas tabelas temporárias replicadas serão excluídas na replica.

Observação

Quando usado em um nó SQL de replica de NDB Cluster, o `RESET REPLICA` limpa a tabela `mysql.ndb_apply_status`. Você deve ter em mente ao usar essa instrução que `ndb_apply_status` usa o mecanismo de armazenamento `NDB` e, portanto, é compartilhado por todos os nós SQL conectados ao cluster.

Você pode sobrepor esse comportamento emitindo `SET` `GLOBAL @@``ndb_clear_apply_status=OFF` antes de executar `RESET REPLICA`, o que impede a replica de limpar a tabela `ndb_apply_status` nesses casos.