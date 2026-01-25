#### 16.1.4.1 Conceitos de Modo de Replicação

Para poder configurar com segurança o modo de Replication de um Server online, é importante entender alguns conceitos chave de Replication. Esta seção explica esses conceitos e é essencial para leitura antes de tentar modificar o modo de Replication de um Server online.

Os modos de Replication disponíveis no MySQL dependem de diferentes técnicas para identificar as Transactions que são logadas. Os tipos de Transactions usados pela Replication são os seguintes:

* As GTID transactions são identificadas por um identificador global de Transaction (GTID) no formato `UUID:NUMBER`. Toda GTID transaction em um Log é sempre precedida por um `Gtid_log_event`. As GTID transactions podem ser endereçadas usando o GTID ou usando o nome do arquivo e a Position.

* As Anonymous transactions não possuem um GTID atribuído, e o MySQL garante que toda Anonymous transaction em um Log seja precedida por um `Anonymous_gtid_log_event`. Em versões anteriores, as Anonymous transactions não eram precedidas por nenhum evento específico. As Anonymous transactions só podem ser endereçadas usando o nome do arquivo e a Position.

Ao usar GTIDs, você pode aproveitar o auto-positioning e o automatic fail-over, bem como usar [`WAIT_FOR_EXECUTED_GTID_SET()`](gtid-functions.html#function_wait-for-executed-gtid-set), [`session_track_gtids`](server-system-variables.html#sysvar_session_track_gtids), e monitorar replicated transactions usando tabelas do Performance Schema. Com GTIDs habilitados, você não pode usar [`sql_slave_skip_counter`](replication-options-replica.html#sysvar_sql_slave_skip_counter); em vez disso, use transactions vazias.

Transactions em um relay log que foi recebido de um Source rodando uma versão anterior do MySQL podem não ser precedidas por nenhum evento específico, mas após serem replayed e logadas no Binary Log da Replica, elas são precedidas por um `Anonymous_gtid_log_event`.

A capacidade de configurar o modo de Replication online significa que as variáveis [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) e [`enforce_gtid_consistency`](replication-options-gtids.html#sysvar_enforce_gtid_consistency) agora são ambas dinâmicas e podem ser definidas a partir de uma top-level statement por uma conta que tenha privilégios suficientes para definir system variables globais. Consulte [Seção 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges"). Em versões anteriores, ambas as variáveis só podiam ser configuradas usando a opção apropriada na inicialização do Server, o que significava que as alterações no modo de Replication exigiam o restart do Server. Em todas as versões, [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) podia ser definido como `ON` ou `OFF`, o que correspondia a se GTIDs eram usados para identificar Transactions ou não. Quando [`gtid_mode=ON`](replication-options-gtids.html#sysvar_gtid_mode), não é possível replicar Anonymous transactions, e quando [`gtid_mode=OFF`](replication-options-gtids.html#sysvar_gtid_mode), apenas Anonymous transactions podem ser replicadas. A partir do MySQL 5.7.6, a variável [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) tem dois estados adicionais, `OFF_PERMISSIVE` e `ON_PERMISSIVE`. Quando [`gtid_mode=OFF_PERMISSIVE`](replication-options-gtids.html#sysvar_gtid_mode), *novas* transactions são anônimas, enquanto permite que transactions replicadas sejam GTID transactions ou Anonymous transactions. Quando [`gtid_mode=ON_PERMISSIVE`](replication-options-gtids.html#sysvar_gtid_mode), *novas* transactions usam GTIDs, enquanto permite que transactions replicadas sejam GTID transactions ou Anonymous transactions. Isso significa que é possível ter uma Replication topology que tenha Servers usando Anonymous transactions e GTID transactions. Por exemplo, um Source com [`gtid_mode=ON`](replication-options-gtids.html#sysvar_gtid_mode) poderia estar replicando para uma Replica com [`gtid_mode=ON_PERMISSIVE`](replication-options-gtids.html#sysvar_gtid_mode). Os valores válidos para [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) são os seguintes e nesta ordem:

* `OFF`
* `OFF_PERMISSIVE`
* `ON_PERMISSIVE`
* `ON`

É importante notar que o estado de [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) só pode ser alterado em um passo de cada vez, com base na ordem acima. Por exemplo, se [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) estiver atualmente definido como `OFF_PERMISSIVE`, é possível mudar para `OFF` ou `ON_PERMISSIVE`, mas não para `ON`. Isso é para garantir que o processo de mudança de Anonymous transactions para GTID transactions online seja tratado corretamente pelo Server. Quando você alterna entre [`gtid_mode=ON`](replication-options-gtids.html#sysvar_gtid_mode) e [`gtid_mode=OFF`](replication-options-gtids.html#sysvar_gtid_mode), o estado do GTID (em outras palavras, o valor de [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed)) é persistente. Isso garante que o GTID set que foi aplicado pelo Server seja sempre retido, independentemente das mudanças entre os tipos de [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode).

Como parte das mudanças introduzidas pelo MySQL 5.7.6, os campos relacionados a GTIDs foram modificados para que exibam as informações corretas, independentemente do [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) atualmente selecionado. Isso significa que campos que exibem GTID sets, como [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed), [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged), `RECEIVED_TRANSACTION_SET` na tabela [`replication_connection_status`](performance-schema-replication-connection-status-table.html "25.12.11.2 The replication_connection_status Table") do Performance Schema, e os resultados relacionados a GTID de [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement"), agora retornam a string vazia quando não há GTIDs presentes. Campos que exibem um único GTID, como `CURRENT_TRANSACTION` na tabela [`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "25.12.11.6 The replication_applier_status_by_worker Table") do Performance Schema, agora exibem `ANONYMOUS` quando GTID transactions não estão sendo usadas.

A Replication a partir de um Source usando [`gtid_mode=ON`](replication-options-gtids.html#sysvar_gtid_mode) fornece a capacidade de usar auto-positioning, configurado usando a statement `CHANGE MASTER TO MASTER_AUTO_POSITION = 1;`. A Replication topology que está sendo usada afeta se é possível habilitar ou não o auto-positioning, pois esse recurso depende de GTIDs e não é compatível com Anonymous transactions. Um Error é gerado se o auto-positioning estiver habilitado e uma Anonymous transaction for encontrada. É altamente recomendável garantir que não haja Anonymous transactions restantes na topology antes de habilitar o auto-positioning. Consulte [Seção 16.1.4.2, “Habilitando GTID Transactions Online”](replication-mode-change-online-enable-gtids.html "16.1.4.2 Enabling GTID Transactions Online"). As combinações válidas de [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) e auto-positioning no Source e na Replica são mostradas na tabela a seguir, onde o [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) do Source é mostrado na horizontal e o [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) da Replica está na vertical:

**Tabela 16.1 Combinações Válidas de gtid_mode do Source e da Replica**

<table width="708"><col style="width: 2%"/><col style="width: 1%"/><col style="width: 2%"/><col style="width: 21%"/><col style="width: 17%"/><thead><tr> <th><p> <code>gtid_mode</code> </p></th> <th><p> Source <code>OFF</code> </p></th> <th><p> Source <code>OFF_PERMISSIVE</code> </p></th> <th><p> Source <code>ON_PERMISSIVE</code> </p></th> <th><p> Source <code>ON</code> </p></th> </tr></thead><tbody><tr> <th><p> Replica <code>OFF</code> </p></th> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> N </p></td> <td><p> N </p></td> </tr><tr> <th><p> Replica <code>OFF_PERMISSIVE</code> </p></th> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y* </p></td> </tr><tr> <th><p> Replica <code>ON_PERMISSIVE</code> </p></th> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y* </p></td> </tr><tr> <th><p> Replica <code>ON</code> </p></th> <td><p> N </p></td> <td><p> N </p></td> <td><p> Y </p></td> <td><p> Y* </p></td> </tr> </tbody></table>

Na tabela acima, as entradas são:

* `Y`: o [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) do Source e da Replica é compatível

* `N`: o [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) do Source e da Replica não é compatível

* `*`: auto-positioning pode ser usado

O [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) atualmente selecionado também afeta a variável [`gtid_next`](replication-options-gtids.html#sysvar_gtid_next). A tabela a seguir mostra o comportamento do Server para os diferentes valores de [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) e [`gtid_next`](replication-options-gtids.html#sysvar_gtid_next).

**Tabela 16.2 Combinações Válidas de gtid_mode e gtid_next**

<table><col style="width: 2.03%"/><col style="width: 1%"/><col style="width: 2.01%"/><col style="width: 1.92%"/><col style="width: 1.04%"/><thead><tr> <th><p> <code>gtid_next</code> </p></th> <th><p> AUTOMATIC </p><p> Binary Log ligado </p></th> <th><p> AUTOMATIC </p><p> Binary Log desligado </p></th> <th><p> ANONYMOUS </p></th> <th><p> UUID:NUMBER </p></th> </tr></thead><tbody><tr> <th><p> <code>&gt;OFF</code> </p></th> <td><p> ANONYMOUS </p></td> <td><p> ANONYMOUS </p></td> <td>ANONYMOUS</td> <td><p> Error </p></td> </tr><tr> <th><p> <code>&gt;OFF_PERMISSIVE</code> </p></th> <td><p> ANONYMOUS </p></td> <td><p> ANONYMOUS </p></td> <td><p> ANONYMOUS </p></td> <td><p> UUID:NUMBER </p></td> </tr><tr> <th><p> <code>&gt;ON_PERMISSIVE</code> </p></th> <td><p> Novo GTID </p></td> <td><p> ANONYMOUS </p></td> <td><p> ANONYMOUS </p></td> <td><p> UUID:NUMBER </p></td> </tr><tr> <th><p> <code>&gt;ON</code> </p></th> <td><p> Novo GTID </p></td> <td><p> ANONYMOUS </p></td> <td><p> Error </p></td> <td><p> UUID:NUMBER </p></td> </tr> </tbody></table>

Na tabela acima, as entradas são:

* `ANONYMOUS`: gera uma anonymous transaction.

* `Error`: gera um Error e falha ao executar `SET GTID_NEXT`.

* `UUID:NUMBER`: gera um GTID com o UUID:NUMBER especificado.

* `Novo GTID`: gera um GTID com um número gerado automaticamente.

Quando o Binary Log está desligado e [`gtid_next`](replication-options-gtids.html#sysvar_gtid_next) é definido como `AUTOMATIC`, nenhum GTID é gerado. Isso é consistente com o comportamento de versões anteriores.