#### 16.1.6.5 Variáveis de Sistema de ID de Transação Global

As variáveis de sistema do MySQL Server descritas nesta seção são usadas para monitorar e controlar os Global Transaction Identifiers (GTIDs). Para informações adicionais, consulte [Seção 16.1.3, “Replicação com Global Transaction Identifiers”](replication-gtids.html "16.1.3 Replicação com Global Transaction Identifiers").

* [`binlog_gtid_simple_recovery`](replication-options-gtids.html#sysvar_binlog_gtid_simple_recovery)

  <table frame="box" rules="all" summary="Propriedades para binlog_gtid_simple_recovery"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--binlog-gtid-simple-recovery[={OFF|ON}]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>binlog_gtid_simple_recovery</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleana</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Esta variável controla como os Binary Log files são iterados durante a busca por GTIDs quando o MySQL inicia ou reinicia.

  Quando [`binlog_gtid_simple_recovery=TRUE`](replication-options-gtids.html#sysvar_binlog_gtid_simple_recovery), que é o padrão, os valores de [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) e [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) são calculados no startup com base nos valores de `Previous_gtids_log_event` nos Binary Log files mais recentes e mais antigos. Para uma descrição do cálculo, consulte [A Variável de Sistema `gtid_purged`](replication-gtids-lifecycle.html#replication-gtids-gtid-purged "A Variável de Sistema gtid_purged"). Essa configuração acessa apenas dois Binary Log files durante o restart do server. Se todos os Binary Logs no server foram gerados usando o MySQL 5.7.8 ou posterior e você estiver usando o MySQL 5.7.8 ou posterior, [`binlog_gtid_simple_recovery=TRUE`](replication-options-gtids.html#sysvar_binlog_gtid_simple_recovery) pode sempre ser usada com segurança.

  Com [`binlog_gtid_simple_recovery=TRUE`](replication-options-gtids.html#sysvar_binlog_gtid_simple_recovery), [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) e [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) podem ser inicializados incorretamente nas duas situações a seguir:

  + O Binary Log mais novo foi gerado pelo MySQL 5.7.5 ou anterior, e [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) estava `ON` para alguns Binary Logs, mas `OFF` para o Binary Log mais novo.

  + Um statement `SET @@GLOBAL.gtid_purged` foi emitido no MySQL 5.7.7 ou anterior, e o Binary Log que estava ativo no momento do statement `SET @@GLOBAL.gtid_purged` ainda não foi purgado.

  Se um GTID set incorreto for calculado em qualquer uma das situações, ele permanecerá incorreto mesmo que o server seja posteriormente reiniciado com [`binlog_gtid_simple_recovery=FALSE`](replication-options-gtids.html#sysvar_binlog_gtid_simple_recovery). Se alguma dessas situações se aplicar ao server, defina [`binlog_gtid_simple_recovery=FALSE`](replication-options-gtids.html#sysvar_binlog_gtid_simple_recovery) antes de iniciar ou reiniciar o server. Para verificar a segunda situação, se você estiver usando o MySQL 5.7.7 ou anterior, após emitir um statement `SET @@GLOBAL.gtid_purged`, anote o nome do Binary Log file atual, que pode ser verificado usando [`SHOW MASTER STATUS`](show-master-status.html "13.7.5.23 SHOW MASTER STATUS Statement"). Se o server for reiniciado antes que este arquivo tenha sido purgado, você deve definir [`binlog_gtid_simple_recovery=FALSE`](replication-options-gtids.html#sysvar_binlog_gtid_simple_recovery).

  Quando [`binlog_gtid_simple_recovery=FALSE`](replication-options-gtids.html#sysvar_binlog_gtid_simple_recovery) é definido, o método de cálculo de [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) e [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged), conforme descrito em [A Variável de Sistema `gtid_purged`](replication-gtids-lifecycle.html#replication-gtids-gtid-purged "A Variável de Sistema gtid_purged"), é alterado para iterar os Binary Log files da seguinte forma:

  + Em vez de usar o valor de `Previous_gtids_log_event` e eventos de log GTID do Binary Log file mais novo, o cálculo para [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) itera a partir do Binary Log file mais novo e usa o valor de `Previous_gtids_log_event` e quaisquer eventos de log GTID do primeiro Binary Log file onde ele encontra um valor de `Previous_gtids_log_event`. Se os Binary Log files mais recentes do server não tiverem eventos de log GTID, por exemplo, se [`gtid_mode=ON`](replication-options-gtids.html#sysvar_gtid_mode) foi usado, mas o server foi posteriormente alterado para [`gtid_mode=OFF`](replication-options-gtids.html#sysvar_gtid_mode), este processo pode levar muito tempo.

  + Em vez de usar o valor de `Previous_gtids_log_event` do Binary Log file mais antigo, o cálculo para [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) itera a partir do Binary Log file mais antigo e usa o valor de `Previous_gtids_log_event` do primeiro Binary Log file onde encontra um valor de `Previous_gtids_log_event` não vazio, ou pelo menos um evento de log GTID (indicando que o uso de GTIDs começa naquele ponto). Se os Binary Log files mais antigos do server não tiverem eventos de log GTID, por exemplo, se [`gtid_mode=ON`](replication-options-gtids.html#sysvar_gtid_mode) foi definido apenas recentemente no server, este processo pode levar muito tempo.

  Na versão 5.7.5 do MySQL, esta variável foi adicionada como `simplified_binlog_gtid_recovery` e na versão 5.7.6 do MySQL foi renomeada para `binlog_gtid_simple_recovery`.

* [`enforce_gtid_consistency`](replication-options-gtids.html#sysvar_enforce_gtid_consistency)

  <table frame="box" rules="all" summary="Propriedades para enforce_gtid_consistency"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--enforce-gtid-consistency[=value]</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>enforce_gtid_consistency</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>WARN</code></p></td> </tr></tbody></table>

  Dependendo do valor desta variável, o server impõe a consistência de GTID permitindo a execução apenas de statements que podem ser logados com segurança usando um GTID. Você *deve* definir esta variável como `ON` antes de habilitar a replicação baseada em GTID.

  Os valores para os quais [`enforce_gtid_consistency`](replication-options-gtids.html#sysvar_enforce_gtid_consistency) pode ser configurado são:

  + `OFF`: todas as Transactions podem violar a consistência de GTID.

  + `ON`: nenhuma Transaction pode violar a consistência de GTID.

  + `WARN`: todas as Transactions podem violar a consistência de GTID, mas um warning é gerado neste caso. `WARN` foi adicionado no MySQL 5.7.6.

  Apenas statements que podem ser logados usando statements GTID safe podem ser logados quando [`enforce_gtid_consistency`](replication-options-gtids.html#sysvar_enforce_gtid_consistency) é definido como `ON`, portanto, as operações listadas aqui não podem ser usadas com esta opção:

  + statements [`CREATE TABLE ... SELECT`](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement")

  + statements [`CREATE TEMPORARY TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") ou [`DROP TEMPORARY TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") dentro de Transactions

  + Transactions ou statements que atualizam tabelas transacionais e não transacionais. Há uma exceção que permite DML não transacional na mesma Transaction ou no mesmo statement que DML transacional, se todas as tabelas *não transacionais* forem temporárias.

  [`--enforce-gtid-consistency`](replication-options-gtids.html#sysvar_enforce_gtid_consistency) só tem efeito se o Binary Log for realizado para um statement. Se o Binary Log estiver desabilitado no server, ou se os statements não forem escritos no Binary Log porque são removidos por um filtro, a consistência de GTID não é verificada ou imposta para os statements que não são logados.

  Para mais informações, consulte [Seção 16.1.3.6, “Restrictions on Replication with GTIDs”](replication-gtids-restrictions.html "16.1.3.6 Restrictions on Replication with GTIDs").

  Antes do MySQL 5.7.6, o valor booleano [`enforce_gtid_consistency`](replication-options-gtids.html#sysvar_enforce_gtid_consistency) era padronizado para `OFF`. Para manter a compatibilidade com versões anteriores, no MySQL 5.7.6 a enumeração é padronizada para `OFF`, e a definição de [`--enforce-gtid-consistency`](replication-options-gtids.html#sysvar_enforce_gtid_consistency) sem um valor é interpretada como a definição do valor para `ON`. A variável também possui múltiplos aliases textuais para os valores: `0=OFF=FALSE`, `1=ON=TRUE`,`2=WARN`. Isso difere de outros tipos de enumeração, mas mantém a compatibilidade com o tipo booleano usado em versões anteriores. Essas alterações impactam o que é retornado pela variável. Usar `SELECT @@ENFORCE_GTID_CONSISTENCY`, `SHOW VARIABLES LIKE 'ENFORCE_GTID_CONSISTENCY'` e `SELECT * FROM INFORMATION_SCHEMA.VARIABLES WHERE 'VARIABLE_NAME' = 'ENFORCE_GTID_CONSISTENCY'` retorna a forma textual, e não a forma numérica. Esta é uma alteração incompatível, visto que `@@ENFORCE_GTID_CONSISTENCY` retorna a forma numérica para booleanos, mas retorna a forma textual para `SHOW` e para o Information Schema.

* [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed)

  <table frame="box" rules="all" summary="Propriedades para gtid_executed"><tbody><tr><th>Variável de Sistema</th> <td><code>gtid_executed</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Unidade</th> <td>conjunto de GTIDs</td> </tr></tbody></table>

  Quando usada com escopo Global, esta variável contém uma representação do conjunto de todas as Transactions executadas no server e GTIDs que foram definidos por um statement [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged). Este é o mesmo valor da coluna `Executed_Gtid_Set` na saída de [`SHOW MASTER STATUS`](show-master-status.html "13.7.5.23 SHOW MASTER STATUS Statement") e [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement"). O valor desta variável é um GTID set. Consulte [GTID Sets](replication-gtids-concepts.html#replication-gtids-concepts-gtid-sets "GTID Sets") para mais informações.

  Quando o server é iniciado, `@@GLOBAL.gtid_executed` é inicializado. Consulte [`binlog_gtid_simple_recovery`](replication-options-gtids.html#sysvar_binlog_gtid_simple_recovery) para mais informações sobre como os Binary Logs são iterados para preencher [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed). GTIDs são então adicionados ao conjunto à medida que as Transactions são executadas, ou se qualquer statement [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) for executado.

  O conjunto de Transactions que podem ser encontradas nos Binary Logs a qualquer momento é igual a [`GTID_SUBTRACT(@@GLOBAL.gtid_executed, @@GLOBAL.gtid_purged)`](gtid-functions.html#function_gtid-subtract); ou seja, a todas as Transactions no Binary Log que ainda não foram purgadas.

  A emissão de [`RESET MASTER`](reset-master.html "13.4.1.2 RESET MASTER Statement") faz com que o valor global (mas não o valor de Session) desta variável seja redefinido para uma String vazia. GTIDs não são removidos deste conjunto de outra forma, exceto quando o conjunto é limpo devido a `RESET MASTER`.

  Antes do MySQL 5.7.7, esta variável também poderia ser usada com escopo de Session, onde continha uma representação do conjunto de Transactions que são escritas no cache na Session atual. O escopo de Session foi descontinuado no MySQL 5.7.7.

* [`gtid_executed_compression_period`](replication-options-gtids.html#sysvar_gtid_executed_compression_period)

  <table frame="box" rules="all" summary="Propriedades para gtid_executed_compression_period"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--gtid-executed-compression-period=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>gtid_executed_compression_period</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1000</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Compacta a tabela `mysql.gtid_executed` a cada vez que essa quantidade de Transactions tiver sido processada. Quando o Binary Log está habilitado no server, este método de compressão não é usado e, em vez disso, a tabela `mysql.gtid_executed` é compactada a cada rotação do Binary Log. Quando o Binary Log está desabilitado no server, o Thread de compressão dorme até que o número especificado de Transactions tenha sido executado, e então acorda para realizar a compressão da tabela `mysql.gtid_executed`. Definir o valor desta variável de sistema como 0 significa que o Thread nunca acorda, portanto, este método de compressão explícita não é usado. Em vez disso, a compressão ocorre implicitamente conforme necessário.

  Consulte [mysql.gtid_executed Table Compression](replication-gtids-concepts.html#replication-gtids-gtid-executed-table-compression "mysql.gtid_executed Table Compression") para mais informações.

  Esta variável foi adicionada na versão 5.7.5 do MySQL como `executed_gtids_compression_period` e renomeada na versão 5.7.6 do MySQL para `gtid_executed_compression_period`.

* [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode)

  <table frame="box" rules="all" summary="Propriedades para gtid_mode"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--gtid-mode=MODE</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>gtid_mode</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>OFF_PERMISSIVE</code></p><p><code>ON_PERMISSIVE</code></p><p><code>ON</code></p></td> </tr></tbody></table>

  Controla se o logging baseado em GTID está habilitado e o tipo de Transactions que os logs podem conter. Antes do MySQL 5.7.6, esta variável era somente leitura e era definida usando [`--gtid-mode`](replication-options-gtids.html#sysvar_gtid_mode) apenas no startup do server. Antes do MySQL 5.7.5, iniciar o server com [`--gtid-mode=ON`](replication-options-gtids.html#sysvar_gtid_mode) exigia que o server também fosse iniciado com as opções [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) e [`--log-slave-updates`](replication-options-binary-log.html#sysvar_log_slave_updates). A partir do MySQL 5.7.5, isso não é mais um requisito. Consulte [mysql.gtid_executed Table](replication-gtids-concepts.html#replication-gtids-gtid-executed-table "mysql.gtid_executed Table").

  O MySQL 5.7.6 permite que esta variável seja definida dinamicamente. Você deve ter privilégios suficientes para definir variáveis de sistema globais. Consulte [Seção 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges"). [`enforce_gtid_consistency`](replication-options-gtids.html#sysvar_enforce_gtid_consistency) deve ser definido como `ON` antes que você possa definir [`gtid_mode=ON`](replication-options-gtids.html#sysvar_gtid_mode). Antes de modificar esta variável, consulte [Seção 16.1.4, “Changing Replication Modes on Online Servers”](replication-mode-change-online.html "16.1.4 Changing Replication Modes on Online Servers").

  As Transactions logadas no MySQL 5.7.6 e superior podem ser anônimas ou usar GTIDs. Transactions anônimas dependem do Binary Log file e da posição para identificar Transactions específicas. Transactions GTID têm um identificador único que é usado para se referir às Transactions. Os modos `OFF_PERMISSIVE` e `ON_PERMISSIVE`, adicionados no MySQL 5.7.6, permitem uma mistura desses tipos de Transaction na topologia. Os diferentes modos são agora:

  + `OFF`: Ambas Transactions, novas e replicadas, devem ser anônimas.

  + `OFF_PERMISSIVE`: Transactions novas são anônimas. Transactions replicadas podem ser anônimas ou Transactions GTID.

  + `ON_PERMISSIVE`: Transactions novas são Transactions GTID. Transactions replicadas podem ser anônimas ou Transactions GTID.

  + `ON`: Ambas Transactions, novas e replicadas, devem ser Transactions GTID.

  As mudanças de um valor para outro só podem ocorrer um passo de cada vez. Por exemplo, se [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) estiver atualmente definido como `OFF_PERMISSIVE`, é possível mudar para `OFF` ou `ON_PERMISSIVE`, mas não para `ON`.

  No MySQL 5.7.6 e superior, os valores de [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) e [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) são persistentes, independentemente do valor de [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode). Portanto, mesmo após alterar o valor de [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode), essas variáveis contêm os valores corretos. No MySQL 5.7.5 e anterior, os valores de [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) e [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) não são persistentes enquanto [`gtid_mode=OFF`](replication-options-gtids.html#sysvar_gtid_mode). Portanto, após alterar [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) para `OFF`, assim que todos os Binary Logs contendo GTIDs forem purgados, os valores dessas variáveis serão perdidos.

* [`gtid_next`](replication-options-gtids.html#sysvar_gtid_next)

  <table frame="box" rules="all" summary="Propriedades para gtid_next"><tbody><tr><th>Variável de Sistema</th> <td><code>gtid_next</code></td> </tr><tr><th>Escopo</th> <td>Sessão</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>AUTOMATIC</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>AUTOMATIC</code></p><p><code>ANONYMOUS</code></p><p><code>&lt;UUID&gt;:&lt;NUMBER&gt;</code></p></td> </tr></tbody></table>

  Esta variável é usada para especificar se e como o próximo GTID é obtido.

  Definir o valor de Session desta variável de sistema é uma operação restrita. O usuário da Session deve ter privilégios suficientes para definir variáveis de Session restritas. Consulte [Seção 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges").

  `gtid_next` pode assumir qualquer um dos seguintes valores:

  + `AUTOMATIC`: Usa o próximo Global Transaction ID gerado automaticamente.

  + `ANONYMOUS`: Transactions não possuem identificadores globais e são identificadas apenas por file e posição.

  + Um Global Transaction ID no formato *`UUID`*:*`NUMBER`*.

  Exatamente quais das opções acima são válidas depende da configuração de [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode); consulte [Seção 16.1.4.1, “Replication Mode Concepts”](replication-mode-change-online-concepts.html "16.1.4.1 Replication Mode Concepts") para mais informações. A definição desta variável não tem efeito se [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) for `OFF`.

  Depois que esta variável for definida como *`UUID`*:*`NUMBER`*, e uma Transaction tiver sido committada ou sofrido rollback, um statement `SET GTID_NEXT` explícito deve ser emitido novamente antes de qualquer outro statement.

  No MySQL 5.7.5 e superior, `DROP TABLE` ou `DROP TEMPORARY TABLE` falha com um erro explícito quando usado em uma combinação de tabelas não temporárias com tabelas temporárias, ou de tabelas temporárias usando Storage Engines transacionais com tabelas temporárias usando Storage Engines não transacionais. Antes do MySQL 5.7.5, quando GTIDs estavam habilitados, mas `gtid_next` não era `AUTOMATIC`, [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") não funcionava corretamente quando usado com qualquer uma dessas combinações de tabelas. (Bug #17620053)

  No MySQL 5.7.1, você não pode executar nenhum dos statements [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement"), [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement"), [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement"), [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement"), [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement"), [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement"), [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement"), [`CREATE SERVER`](create-server.html "13.1.17 CREATE SERVER Statement"), [`ALTER SERVER`](alter-server.html "13.1.7 ALTER SERVER Statement"), [`DROP SERVER`](drop-server.html "13.1.28 DROP SERVER Statement"), [`CACHE INDEX`](cache-index.html "13.7.6.2 CACHE INDEX Statement"), [`LOAD INDEX INTO CACHE`](load-index.html "13.7.6.5 LOAD INDEX INTO CACHE Statement"), [`FLUSH`](flush.html "13.7.6.3 FLUSH Statement"), ou [`RESET`](reset.html "13.7.6.6 RESET Statement") quando [`gtid_next`](replication-options-gtids.html#sysvar_gtid_next) é definido para qualquer valor diferente de `AUTOMATIC`; em tais casos, o statement falha com um erro. Tais statements *não* são desautorizados no MySQL 5.7.2 e posterior. (Bug #16062608, Bug #16715809, Bug #69045) (Bug #16062608)

* [`gtid_owned`](replication-options-gtids.html#sysvar_gtid_owned)

  <table frame="box" rules="all" summary="Propriedades para gtid_owned"><tbody><tr><th>Variável de Sistema</th> <td><code>gtid_owned</code></td> </tr><tr><th>Escopo</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Unidade</th> <td>conjunto de GTIDs</td> </tr></tbody></table>

  Esta variável somente leitura é principalmente para uso interno. Seu conteúdo depende de seu escopo.

  + Quando usada com escopo Global, [`gtid_owned`](replication-options-gtids.html#sysvar_gtid_owned) mantém uma lista de todos os GTIDs que estão atualmente em uso no server, com os IDs dos Threads que os possuem. Esta variável é principalmente útil para uma replica multi-threaded verificar se uma Transaction já está sendo aplicada em outro Thread. Um applier Thread assume a posse do GTID de uma Transaction durante todo o tempo em que está processando a Transaction, de modo que `@@global.gtid_owned` mostra o GTID e o proprietário pela duração do processamento. Quando uma Transaction é committada (ou sofre rollback), o applier Thread libera a posse do GTID.

  + Quando usada com escopo de Session, [`gtid_owned`](replication-options-gtids.html#sysvar_gtid_owned) mantém um único GTID que está atualmente em uso e pertence a esta Session. Esta variável é principalmente útil para testar e depurar o uso de GTIDs quando o cliente atribuiu explicitamente um GTID para a Transaction definindo [`gtid_next`](replication-options-gtids.html#sysvar_gtid_next). Neste caso, `@@session.gtid_owned` exibe o GTID durante todo o tempo em que o cliente está processando a Transaction, até que a Transaction tenha sido committada (ou sofrido rollback). Quando o cliente termina de processar a Transaction, a variável é limpa. Se [`gtid_next=AUTOMATIC`](replication-options-gtids.html#sysvar_gtid_next) for usado para a Session, [`gtid_owned`](replication-options-gtids.html#sysvar_gtid_owned) é preenchida apenas brevemente durante a execução do commit statement para a Transaction, de modo que não pode ser observada na Session em questão, embora seja listada se `@@global.gtid_owned` for lido no ponto certo. Se você precisar rastrear os GTIDs que são manipulados por um cliente em uma Session, você pode habilitar o rastreador de estado da Session controlado pela variável de sistema [`session_track_gtids`](server-system-variables.html#sysvar_session_track_gtids).

* [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged)

  <table frame="box" rules="all" summary="Propriedades para gtid_purged"><tbody><tr><th>Variável de Sistema</th> <td><code>gtid_purged</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Unidade</th> <td>conjunto de GTIDs</td> </tr></tbody></table>

  O valor global da variável de sistema [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) (`@@GLOBAL.gtid_purged`) é um GTID set que consiste nos GTIDs de todas as Transactions que foram committadas no server, mas que não existem em nenhum Binary Log file no server. [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) é um subconjunto de [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed). As seguintes categorias de GTIDs estão em [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged):

  + GTIDs de Transactions replicadas que foram committadas com o Binary Log desabilitado na replica.

  + GTIDs de Transactions que foram escritas em um Binary Log file que agora foi purgado.

  + GTIDs que foram adicionados explicitamente ao conjunto pelo statement `SET @@GLOBAL.gtid_purged`.

  Quando o server inicia ou reinicia, o valor global de [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) é inicializado para um conjunto de GTIDs. Para obter informações sobre como este GTID set é calculado, consulte [A Variável de Sistema `gtid_purged`](replication-gtids-lifecycle.html#replication-gtids-gtid-purged "A Variável de Sistema gtid_purged"). Se houver Binary Logs do MySQL 5.7.7 ou anterior presentes no server, pode ser necessário definir [`binlog_gtid_simple_recovery=FALSE`](replication-options-gtids.html#sysvar_binlog_gtid_simple_recovery) no arquivo de configuração do server para produzir o cálculo correto. Consulte a descrição de [`binlog_gtid_simple_recovery`](replication-options-gtids.html#sysvar_binlog_gtid_simple_recovery) para obter detalhes das situações em que esta configuração é necessária.

  A emissão de [`RESET MASTER`](reset-master.html "13.4.1.2 RESET MASTER Statement") faz com que o valor de [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) seja redefinido para uma String vazia.

  Você pode definir o valor de [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) para registrar no server que as Transactions em um determinado GTID set foram aplicadas, embora não existam em nenhum Binary Log no server. Um exemplo de caso de uso para esta ação é quando você está restaurando um backup de um ou mais Databases em um server, mas não tem os Binary Logs relevantes contendo as Transactions no server.

  Importante

  GTIDs estão disponíveis em uma instância de server até o número de valores não negativos para um inteiro de 64 bits com sinal (2 elevado à potência de 63, menos 1). Se você definir o valor de [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) para um número que se aproxima deste limite, commits subsequentes podem fazer com que o server fique sem GTIDs e realize a ação especificada por [`binlog_error_action`](replication-options-binary-log.html#sysvar_binlog_error_action).

  No MySQL 5.7, é possível atualizar o valor de [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) somente quando [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) for a String vazia, e, portanto, [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) for a String vazia. Este é o caso quando a replicação não foi iniciada anteriormente, ou quando a replicação não usava GTIDs anteriormente. Antes do MySQL 5.7.6, [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) também era definível apenas quando [`gtid_mode=ON`](replication-options-gtids.html#sysvar_gtid_mode). No MySQL 5.7.6 e superior, [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) é definível independentemente do valor de [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode).

  Para substituir o valor de [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) pelo seu GTID set especificado, utilize o seguinte statement:

  ```sql
  SET @@GLOBAL.gtid_purged = 'gtid_set'
  ```

  Note

  Se você estiver usando o MySQL 5.7.7 ou anterior, após emitir um statement `SET @@GLOBAL.gtid_purged`, pode ser necessário definir [`binlog_gtid_simple_recovery=FALSE`](replication-options-gtids.html#sysvar_binlog_gtid_simple_recovery) no arquivo de configuração do server antes de reiniciá-lo, caso contrário, [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) pode ser calculado incorretamente. Consulte a descrição de [`binlog_gtid_simple_recovery`](replication-options-gtids.html#sysvar_binlog_gtid_simple_recovery) para obter detalhes das situações em que esta configuração é necessária. Se todos os Binary Logs no server foram gerados usando o MySQL 5.7.8 ou posterior e você estiver usando o MySQL 5.7.8 ou posterior, [`binlog_gtid_simple_recovery=TRUE`](replication-options-gtids.html#sysvar_binlog_gtid_simple_recovery) (que é a configuração padrão a partir do MySQL 5.7.7) pode sempre ser usada com segurança.