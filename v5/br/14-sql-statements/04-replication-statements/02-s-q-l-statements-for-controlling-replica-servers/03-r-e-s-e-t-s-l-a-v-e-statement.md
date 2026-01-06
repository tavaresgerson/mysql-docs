#### 13.4.2.3 Declaração de RESET SLAVE

```sql
RESET SLAVE [ALL] [channel_option]

channel_option:
    FOR CHANNEL channel
```

`RESET SLAVE` faz com que a replica esqueça sua posição de replicação no log binário da fonte. Esta declaração é destinada a ser usada para um início limpo: ela limpa os repositórios de metadados de replicação, exclui todos os arquivos de log de relevo e inicia um novo arquivo de log de relevo. Ela também redefine para 0 o atraso de replicação especificado com a opção `MASTER_DELAY` para `CHANGE MASTER TO`.

Nota

Todos os arquivos de registro de relé são excluídos, mesmo que não tenham sido completamente executados pelo thread de replicação do SQL. (Essa é uma condição que provavelmente existe em uma replica se você emitir uma declaração `STOP SLAVE` ou se a replica estiver muito carregada.)

Para um servidor onde os GTIDs estão em uso (`gtid_mode` é `ON`), emitir `RESET SLAVE` não tem efeito no histórico de execução do GTID. A declaração não altera os valores de `gtid_executed` ou `gtid_purged`, nem a tabela `mysql.gtid_executed`. Se você precisar reiniciar o histórico de execução do GTID, use `RESET MASTER`, mesmo que o servidor habilitado para GTID seja uma replica onde o registro binário está desativado.

O comando `RESET SLAVE` requer o privilégio `RELOAD`.

Para usar `RESET SLAVE`, os threads de replicação devem ser interrompidos, então, em uma replica em execução, use `STOP SLAVE` antes de emitir `RESET SLAVE`. Para usar `RESET SLAVE` em um membro do grupo de replicação, o status do membro deve ser `OFFLINE`, o que significa que o plugin está carregado, mas o membro atualmente não pertence a nenhum grupo. Um membro do grupo pode ser desconectado usando uma declaração `STOP GROUP REPLICATION`.

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a declaração se aplica. Ao fornecer uma cláusula `FOR CHANNEL channel`, a declaração `RESET SLAVE` é aplicada a um canal de replicação específico. Combinar uma cláusula `FOR CHANNEL channel` com a opção `ALL` exclui o canal especificado. Se nenhum canal estiver nomeado e não houver canais extras, a declaração se aplica ao canal padrão. Executar uma declaração `RESET SLAVE ALL` sem uma cláusula `FOR CHANNEL channel` quando existem vários canais de replicação exclui *todos* os canais de replicação e recria apenas o canal padrão. Consulte Seção 16.2.2, “Canais de Replicação” para obter mais informações.

O comando `RESET SLAVE` não altera nenhum parâmetro de conexão de replicação, como o nome do host da fonte e a porta, ou o nome da conta de usuário de replicação e sua senha.

- A partir do MySQL 5.7.24, quando [`master_info_repository=TABLE`](https://pt.wikipedia.org/wiki/Replicação_\(MySQL\)#op%C3%A7%C3%B5es_de_replica) é definido no servidor, os parâmetros de conexão de replicação são preservados na tabela `mysql.slave_master_info` do `InnoDB` resistente a falhas como parte da operação [`RESET SLAVE`](https://pt.wikipedia.org/wiki/Replicação_\(MySQL\)#oper%C3%A7%C3%A3o_de_reinicializa%C3%A7%C3%A3o_do_escravo), e também são mantidos na memória. No caso de uma saída inesperada do servidor ou reinício deliberado após a emissão de [`RESET SLAVE`](https://pt.wikipedia.org/wiki/Replicação_\(MySQL\)#oper%C3%A7%C3%A3o_de_reinicializa%C3%A7%C3%A3o_do_escravo) mas antes de emitir [`START SLAVE`](https://pt.wikipedia.org/wiki/Replicação_\(MySQL\)#oper%C3%A7%C3%A3o_de_inicia%C3%A7%C3%A3o_do_escravo), os parâmetros de conexão de replicação são recuperados da tabela e reutilizados para a nova conexão.

- Quando [`master_info_repository=FILE`](https://pt.wikipedia.org/wiki/Replicação_de_banco_de_dados#sysvar_master_info_repository) está definido no servidor (o que é o padrão no MySQL 5.7), os parâmetros de conexão de replicação são mantidos apenas na memória. Se a replica [**mysqld**](https://pt.wikipedia.org/wiki/Replicação_de_banco_de_dados#mysqld) for reiniciada imediatamente após a emissão de [`RESET SLAVE`](https://pt.wikipedia.org/wiki/Replicação_de_banco_de_dados#reset-slave.html) devido a uma saída inesperada do servidor ou reinício deliberado, os parâmetros de conexão são perdidos. Nesse caso, você deve emitir uma declaração [`CHANGE MASTER TO`](https://pt.wikipedia.org/wiki/Replicação_de_banco_de_dados#change-master-to.html) após o início do servidor para redefinir os parâmetros de conexão antes de emitir [`START SLAVE`](https://pt.wikipedia.org/wiki/Replicação_de_banco_de_dados#start-slave.html).

Se você quiser redefinir os parâmetros de conexão intencionalmente, você precisa usar `RESET SLAVE ALL`, que limpa os parâmetros de conexão. Nesse caso, você deve emitir uma declaração `CHANGE MASTER TO` após o início do servidor para especificar os novos parâmetros de conexão.

O comando `RESET SLAVE` causa um commit implícito de uma transação em andamento. Veja Seção 13.3.3, “Instruções que causam um commit implícito”.

Se o fio de replicação SQL estivesse em meio à replicação de tabelas temporárias quando foi interrompido e o comando `RESET SLAVE` for emitido, essas tabelas temporárias replicadas serão excluídas na replica.

Antes do MySQL 5.7.5, o comando `RESET SLAVE` também tinha o efeito de reiniciar tanto o período do batimento cardíaco (`Slave_heartbeat_period`) quanto `SSL_VERIFY_SERVER_CERT`. Esse problema foi corrigido no MySQL 5.7.5 e em versões posteriores. (Bug #18777899, Bug #18778485)

Antes do MySQL 5.7.5, o comando `RESET SLAVE ALL` não apagava a lista `IGNORE_SERVER_IDS` definida pelo comando `CHANGE MASTER TO`. No MySQL 5.7.5 e versões posteriores, a instrução apaga a lista. (Bug #18816897)

Nota

Quando usado em um nó de replicação de cluster NDB SQL, o `RESET SLAVE` limpa a tabela `mysql.ndb_apply_status`. Você deve ter em mente ao usar essa instrução que o `ndb_apply_status` usa o mecanismo de armazenamento `NDB` e, portanto, é compartilhado por todos os nós SQL conectados ao cluster de replicação.

Você pode sobrepor esse comportamento emitindo `SET` `GLOBAL @@ ndb_clear_apply_status=OFF` antes de executar `RESET SLAVE`, o que impede a replica de limpar a tabela `ndb_apply_status` nesses casos.
