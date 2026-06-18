#### 15.4.2.4 Declaração de REESTATE REPLICA

```
RESET REPLICA [ALL] [channel_option]

channel_option:
    FOR CHANNEL channel
```

`RESET REPLICA` faz com que a replica esqueça sua posição no log binário da fonte. A partir do MySQL 8.0.22, use `RESET REPLICA` no lugar de `RESET SLAVE`, que é desatualizado a partir dessa versão. Em versões anteriores ao MySQL 8.0.22, use `RESET SLAVE`.

Esta declaração destina-se a ser usada para um início limpo; ela limpa os repositórios de metadados de replicação, exclui todos os arquivos de log de retransmissão e inicia um novo arquivo de log de retransmissão. Ela também redefine para 0 o atraso de replicação especificado com a opção `SOURCE_DELAY` | `MASTER_DELAY` da declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou da declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23).

Nota

Todos os arquivos de registro de relé são excluídos, mesmo que não tenham sido completamente executados pelo fio de replicação do SQL. (Essa é uma condição que provavelmente existe em uma replica se você emitir uma declaração `STOP REPLICA` ou se a replica estiver muito carregada.)

Para um servidor onde os GTIDs estão em uso (`gtid_mode` é `ON`), emitir `RESET REPLICA` não tem efeito no histórico de execução do GTID. A declaração não altera os valores de `gtid_executed` ou `gtid_purged`, nem a tabela `mysql.gtid_executed`. Se você precisar reiniciar o histórico de execução do GTID, use `RESET MASTER`, mesmo que o servidor habilitado para GTID seja uma replica onde o registro binário está desativado.

`RESET REPLICA` requer o privilégio `RELOAD`.

Para usar `RESET REPLICA`, o fio de SQL de replicação e o fio de I/O de replicação (receptor) devem ser interrompidos, portanto, em uma replica em execução, use `STOP REPLICA` antes de emitir `RESET REPLICA`. Para usar `RESET REPLICA` em um membro de um grupo de replicação, o status do membro deve ser `OFFLINE`, o que significa que o plugin está carregado, mas o membro atualmente não pertence a nenhum grupo. Um membro de um grupo pode ser desconectado usando uma declaração `STOP GROUP REPLICATION`.

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a declaração se aplica. A cláusula `FOR CHANNEL channel` aplica a declaração `RESET REPLICA` a um canal de replicação específico. A combinação da cláusula `FOR CHANNEL channel` com a opção `ALL` exclui o canal especificado. Se nenhum canal estiver nomeado e não houver canais extras, a declaração se aplica ao canal padrão. A emissão de uma declaração `RESET REPLICA ALL` sem a cláusula `FOR CHANNEL channel` quando existem vários canais de replicação exclui *todos* os canais de replicação e recria apenas o canal padrão. Consulte a Seção 19.2.2, “Canais de Replicação”, para obter mais informações.

`RESET REPLICA` não altera nenhum parâmetro de conexão de replicação, que incluem o nome do host e a porta da fonte, a conta de usuário de replicação e sua senha, a conta `PRIVILEGE_CHECKS_USER`, a opção `REQUIRE_ROW_FORMAT`, a opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK` e a opção `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`. Se você quiser alterar algum dos parâmetros de conexão de replicação, pode fazer isso usando uma declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou uma declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) após o início do servidor. Se você quiser remover todos os parâmetros de conexão de replicação, use `RESET REPLICA ALL`. `RESET REPLICA ALL` também limpa a lista `IGNORE_SERVER_IDS` definida por `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`. Quando você usou `RESET REPLICA ALL`, se quiser usar a instância como replica novamente, você precisa emitir uma declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` após o início do servidor para especificar novos parâmetros de conexão.

A partir do MySQL 8.0.27, você pode definir a opção `GTID_ONLY` na instrução `CHANGE REPLICATION SOURCE TO` para impedir que um canal de replicação persista nomes de arquivos e posições de arquivos nos repositórios de metadados de replicação. Quando você emite uma instrução `RESET REPLICA`, os repositórios de metadados de replicação são sincronizados. `RESET REPLICA ALL` exclui, em vez de atualizar, os repositórios, então eles são sincronizados implicitamente.

Em caso de saída inesperada do servidor ou reinício deliberado após a emissão de `RESET REPLICA`, mas antes de emitir `START REPLICA`, a retenção dos parâmetros de conexão de replicação depende do repositório usado para os metadados de replicação:

- Quando `master_info_repository=TABLE` e `relay_log_info_repository=TABLE` são definidos no servidor (que são as configurações padrão do MySQL 8.0), os parâmetros de conexão de replicação são preservados nas tabelas `InnoDB` `mysql.slave_master_info` e `mysql.slave_relay_log_info` `RESET REPLICA` à prova de falhas, como parte da operação. Eles também são mantidos na memória. No caso de uma saída inesperada do servidor ou reinício deliberado após a emissão de `RESET REPLICA`, mas antes de emitir `START REPLICA`, os parâmetros de conexão de replicação são recuperados das tabelas e reaplicados ao canal. Esta situação se aplica a partir do MySQL 8.0.13 para o repositório de metadados de conexão e a partir do MySQL 8.0.19 para o repositório de metadados do aplicável.

- Se `master_info_repository=FILE` e `relay_log_info_repository=FILE` estiverem configurados no servidor, que é desaconselhável a partir do MySQL 8.0, ou se a versão do MySQL Server for anterior às especificadas acima, os parâmetros de conexão de replicação são mantidos apenas na memória. Se o **mysqld** da replica for reiniciado imediatamente após a emissão de `RESET REPLICA` devido a uma saída inesperada do servidor ou reinício deliberado, os parâmetros de conexão são perdidos. Nesse caso, você deve emitir uma declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou uma declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) após o início do servidor para redefinir os parâmetros de conexão antes de emitir `START REPLICA`.

`RESET REPLICA` não altera as configurações dos filtros de replicação (como `--replicate-ignore-table`) para os canais afetados pela declaração. No entanto, `RESET REPLICA ALL` remove os filtros de replicação configurados nos canais excluídos pela declaração. Quando o(s) canal(is) excluído(s) é(são) recriado(s), quaisquer filtros de replicação globais especificados para a replica são copiados para eles, e nenhum filtro de replicação específico do canal é aplicado. Para mais informações, consulte a Seção 19.2.5.4, “Filtros Baseados em Canais de Replicação”.

`RESET REPLICA` causa um commit implícito de uma transação em andamento. Veja a Seção 15.3.3, “Declarações que causam um commit implícito”.

Se o fio de replicação SQL estivesse em meio à replicação de tabelas temporárias quando foi interrompido e `RESET REPLICA` for emitido, essas tabelas temporárias replicadas serão excluídas na replica.

Nota

Quando usado em um nó de replicação de cluster NDB SQL, o `RESET REPLICA` limpa a tabela `mysql.ndb_apply_status`. Você deve ter em mente ao usar essa declaração que o `ndb_apply_status` usa o mecanismo de armazenamento `NDB` e, portanto, é compartilhado por todos os nós SQL conectados ao cluster.

Você pode sobrepor esse comportamento emitindo `SET` `GLOBAL @@``ndb_clear_apply_status=OFF` antes de executar `RESET REPLICA`, o que impede que a replica apague a tabela `ndb_apply_status` nesses casos.
