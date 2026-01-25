### 6.2.2 Privilégios Fornecidos pelo MySQL

Os privilégios concedidos a uma conta MySQL determinam quais operações a conta pode realizar. Os privilégios MySQL diferem nos contextos em que se aplicam e nos diferentes níveis de operação:

* Privilégios Administrativos permitem que os usuários gerenciem a operação do MySQL Server. Esses privilégios são globais porque não são específicos de um Database particular.

* Privilégios de Database aplicam-se a um Database e a todos os objetos dentro dele. Esses privilégios podem ser concedidos para Databases específicos, ou globalmente, de modo que se apliquem a todos os Databases.

* Privilégios para Objetos de Database, como Tables, Indexes, Views e Stored Routines, podem ser concedidos para objetos específicos dentro de um Database, para todos os objetos de um determinado tipo dentro de um Database (por exemplo, todas as Tables em um Database) ou globalmente para todos os objetos de um determinado tipo em todos os Databases.

As informações sobre os privilégios da conta são armazenadas nas *grant tables* no *system database* `mysql`. Para uma descrição da estrutura e conteúdo dessas tabelas, veja [Seção 6.2.3, “Grant Tables”](grant-tables.html "6.2.3 Grant Tables"). O MySQL Server lê o conteúdo das *grant tables* para a memória quando inicia, e as recarrega nas circunstâncias indicadas em [Seção 6.2.9, “When Privilege Changes Take Effect”](privilege-changes.html "6.2.9 When Privilege Changes Take Effect"). O Server baseia as decisões de controle de acesso nas cópias das *grant tables* armazenadas em memória.

Importante

Algumas versões do MySQL introduzem alterações nas *grant tables* para adicionar novos privilégios ou recursos. Para garantir que você possa aproveitar quaisquer novos recursos, atualize suas *grant tables* para a estrutura atual sempre que fizer um *upgrade* do MySQL. Veja [Seção 2.10, “Upgrading MySQL”](upgrading.html "2.10 Upgrading MySQL").

As seções a seguir resumem os privilégios disponíveis, fornecem descrições mais detalhadas de cada privilégio e oferecem diretrizes de uso.

* [Resumo dos Privilégios Disponíveis](privileges-provided.html#privileges-provided-summary "Summary of Available Privileges")
* [Descrições de Privilégios](privileges-provided.html#privileges-provided-static "Privilege Descriptions")
* [Diretrizes para Concessão de Privilégios](privileges-provided.html#privileges-provided-guidelines "Privilege-Granting Guidelines")

#### Resumo dos Privilégios Disponíveis

A tabela a seguir mostra os nomes dos privilégios usados nas instruções [`GRANT`](grant.html "13.7.1.4 GRANT Statement") e [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement"), juntamente com o nome da coluna associada a cada privilégio nas *grant tables* e o contexto no qual o privilégio se aplica.

**Tabela 6.2 Privilégios Permitidos para GRANT e REVOKE**

<table><col style="width: 30%"/><col style="width: 33%"/><col style="width: 37%"/><thead><tr> <th>Privilégio</th> <th>Coluna da Grant Table</th> <th>Contexto</th> </tr></thead><tbody><tr> <th><code>ALL [PRIVILEGES]</code></th> <td>Sinônimo para "todos os privilégios"</td> <td>Administração do Server</td> </tr><tr> <th><code>ALTER</code></th> <td><code>Alter_priv</code></td> <td>Tables</td> </tr><tr> <th><code>ALTER ROUTINE</code></th> <td><code>Alter_routine_priv</code></td> <td>Stored Routines</td> </tr><tr> <th><code>CREATE</code></th> <td><code>Create_priv</code></td> <td>Databases, Tables ou Indexes</td> </tr><tr> <th><code>CREATE ROUTINE</code></th> <td><code>Create_routine_priv</code></td> <td>Stored Routines</td> </tr><tr> <th><code>CREATE TABLESPACE</code></th> <td><code>Create_tablespace_priv</code></td> <td>Administração do Server</td> </tr><tr> <th><code>CREATE TEMPORARY TABLES</code></th> <td><code>Create_tmp_table_priv</code></td> <td>Tables</td> </tr><tr> <th><code>CREATE USER</code></th> <td><code>Create_user_priv</code></td> <td>Administração do Server</td> </tr><tr> <th><code>CREATE VIEW</code></th> <td><code>Create_view_priv</code></td> <td>Views</td> </tr><tr> <th><code>DELETE</code></th> <td><code>Delete_priv</code></td> <td>Tables</td> </tr><tr> <th><code>DROP</code></th> <td><code>Drop_priv</code></td> <td>Databases, Tables ou Views</td> </tr><tr> <th><code>EVENT</code></th> <td><code>Event_priv</code></td> <td>Databases</td> </tr><tr> <th><code>EXECUTE</code></th> <td><code>Execute_priv</code></td> <td>Stored Routines</td> </tr><tr> <th><code>FILE</code></th> <td><code>File_priv</code></td> <td>Acesso a arquivos no host do Server</td> </tr><tr> <th><code>GRANT OPTION</code></th> <td><code>Grant_priv</code></td> <td>Databases, Tables ou Stored Routines</td> </tr><tr> <th><code>INDEX</code></th> <td><code>Index_priv</code></td> <td>Tables</td> </tr><tr> <th><code>INSERT</code></th> <td><code>Insert_priv</code></td> <td>Tables ou Colunas</td> </tr><tr> <th><code>LOCK TABLES</code></th> <td><code>Lock_tables_priv</code></td> <td>Databases</td> </tr><tr> <th><code>PROCESS</code></th> <td><code>Process_priv</code></td> <td>Administração do Server</td> </tr><tr> <th><code>PROXY</code></th> <td>Veja a tabela <code>proxies_priv</code></td> <td>Administração do Server</td> </tr><tr> <th><code>REFERENCES</code></th> <td><code>References_priv</code></td> <td>Databases ou Tables</td> </tr><tr> <th><code>RELOAD</code></th> <td><code>Reload_priv</code></td> <td>Administração do Server</td> </tr><tr> <th><code>REPLICATION CLIENT</code></th> <td><code>Repl_client_priv</code></td> <td>Administração do Server</td> </tr><tr> <th><code>REPLICATION SLAVE</code></th> <td><code>Repl_slave_priv</code></td> <td>Administração do Server</td> </tr><tr> <th><code>SELECT</code></th> <td><code>Select_priv</code></td> <td>Tables ou Colunas</td> </tr><tr> <th><code>SHOW DATABASES</code></th> <td><code>Show_db_priv</code></td> <td>Administração do Server</td> </tr><tr> <th><code>SHOW VIEW</code></th> <td><code>Show_view_priv</code></td> <td>Views</td> </tr><tr> <th><code>SHUTDOWN</code></th> <td><code>Shutdown_priv</code></td> <td>Administração do Server</td> </tr><tr> <th><code>SUPER</code></th> <td><code>Super_priv</code></td> <td>Administração do Server</td> </tr><tr> <th><code>TRIGGER</code></th> <td><code>Trigger_priv</code></td> <td>Tables</td> </tr><tr> <th><code>UPDATE</code></th> <td><code>Update_priv</code></td> <td>Tables ou Colunas</td> </tr><tr> <th><code>USAGE</code></th> <td>Sinônimo para "nenhum privilégio"</td> <td>Administração do Server</td> </tr> </tbody></table>

#### Descrições de Privilégios

A lista a seguir fornece descrições gerais de cada privilégio disponível no MySQL. Instruções SQL específicas podem ter requisitos de privilégio mais específicos do que os indicados aqui. Se for o caso, a descrição da instrução em questão fornecerá os detalhes.

* [`ALL`](privileges-provided.html#priv_all), [`ALL PRIVILEGES`](privileges-provided.html#priv_all)

  Estes especificadores de privilégio são abreviações para "todos os privilégios disponíveis em um determinado nível de privilégio" (exceto [`GRANT OPTION`](privileges-provided.html#priv_grant-option)). Por exemplo, conceder [`ALL`](privileges-provided.html#priv_all) no nível global ou de tabela concede todos os privilégios globais ou todos os privilégios de nível de tabela, respectivamente.

* [`ALTER`](privileges-provided.html#priv_alter)

  Permite o uso da instrução [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") para alterar a estrutura das Tables. [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") também exige os privilégios [`CREATE`](privileges-provided.html#priv_create) e [`INSERT`](privileges-provided.html#priv_insert). Renomear uma tabela exige [`ALTER`](privileges-provided.html#priv_alter) e [`DROP`](privileges-provided.html#priv_drop) na tabela antiga, [`CREATE`](privileges-provided.html#priv_create) e [`INSERT`](privileges-provided.html#priv_insert) na tabela nova.

* [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine)

  Permite o uso de instruções que alteram ou eliminam (*drop*) *stored routines* (*stored procedures* e *functions*).

* [`CREATE`](privileges-provided.html#priv_create)

  Permite o uso de instruções que criam novos Databases e Tables.

* [`CREATE ROUTINE`](privileges-provided.html#priv_create-routine)

  Permite o uso de instruções que criam *stored routines* (*stored procedures* e *functions*).

* [`CREATE TABLESPACE`](privileges-provided.html#priv_create-tablespace)

  Permite o uso de instruções que criam, alteram ou eliminam *tablespaces* e grupos de arquivos de *log*.

* [`CREATE TEMPORARY TABLES`](privileges-provided.html#priv_create-temporary-tables)

  Permite a criação de *temporary tables* usando a instrução [`CREATE TEMPORARY TABLE`](create-temporary-table.html "13.1.18.2 CREATE TEMPORARY TABLE Statement").

  Após uma sessão ter criado uma *temporary table*, o Server não realiza mais verificações de privilégios sobre a tabela. A sessão criadora pode executar qualquer operação na tabela, como [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement"), [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement") ou [`SELECT`](select.html "13.2.9 SELECT Statement"). Para mais informações, veja [Seção 13.1.18.2, “CREATE TEMPORARY TABLE Statement”](create-temporary-table.html "13.1.18.2 CREATE TEMPORARY TABLE Statement").

* [`CREATE USER`](privileges-provided.html#priv_create-user)

  Permite o uso das instruções [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"), [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), [`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement"), [`RENAME USER`](rename-user.html "13.7.1.5 RENAME USER Statement") e [`REVOKE ALL PRIVILEGES`](revoke.html "13.7.1.6 REVOKE Statement").

* [`CREATE VIEW`](privileges-provided.html#priv_create-view)

  Permite o uso da instrução [`CREATE VIEW`](create-view.html "13.1.21 CREATE VIEW Statement").

* [`DELETE`](privileges-provided.html#priv_delete)

  Permite que linhas sejam excluídas de Tables em um Database.

* [`DROP`](privileges-provided.html#priv_drop)

  Permite o uso de instruções que eliminam (*drop*) Databases, Tables e Views existentes. O privilégio [`DROP`](privileges-provided.html#priv_drop) é necessário para usar a instrução `ALTER TABLE ... DROP PARTITION` em uma tabela particionada. O privilégio [`DROP`](privileges-provided.html#priv_drop) também é necessário para [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement").

* [`EVENT`](privileges-provided.html#priv_event)

  Permite o uso de instruções que criam, alteram, eliminam ou exibem eventos para o *Event Scheduler*.

* [`EXECUTE`](privileges-provided.html#priv_execute)

  Permite o uso de instruções que executam *stored routines* (*stored procedures* e *functions*).

* [`FILE`](privileges-provided.html#priv_file)

  Afeta as seguintes operações e comportamentos do Server:

  + Permite a leitura e escrita de arquivos no host do Server usando as instruções [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") e [`SELECT ... INTO OUTFILE`](select-into.html "13.2.9.1 SELECT ... INTO Statement") e a função [`LOAD_FILE()`](string-functions.html#function_load-file). Um usuário que tem o privilégio [`FILE`](privileges-provided.html#priv_file) pode ler qualquer arquivo no host do Server que seja legível globalmente (*world-readable*) ou legível pelo MySQL Server. (Isso implica que o usuário pode ler qualquer arquivo em qualquer diretório de Database, pois o Server pode acessar qualquer um desses arquivos.)

  + Permite a criação de novos arquivos em qualquer diretório onde o MySQL Server tenha acesso de escrita. Isso inclui o diretório de dados do Server que contém os arquivos que implementam as *privilege tables*.

  + A partir do MySQL 5.7.17, permite o uso da opção de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY` para a instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement").

  Como medida de segurança, o Server não sobrescreve arquivos existentes.

  Para limitar o local onde os arquivos podem ser lidos e escritos, defina a variável de sistema [`secure_file_priv`](server-system-variables.html#sysvar_secure_file_priv) para um diretório específico. Veja [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

* [`GRANT OPTION`](privileges-provided.html#priv_grant-option)

  Permite que você conceda ou revogue de outros usuários os privilégios que você mesmo possui.

* [`INDEX`](privileges-provided.html#priv_index)

  Permite o uso de instruções que criam ou eliminam (*drop*) Indexes. [`INDEX`](privileges-provided.html#priv_index) se aplica a Tables existentes. Se você tiver o privilégio [`CREATE`](privileges-provided.html#priv_create) para uma tabela, você pode incluir definições de Index na instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement").

* [`INSERT`](privileges-provided.html#priv_insert)

  Permite que linhas sejam inseridas em Tables em um Database. [`INSERT`](privileges-provided.html#priv_insert) também é necessário para as instruções de manutenção de tabela [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement"), [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") e [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement").

* [`LOCK TABLES`](privileges-provided.html#priv_lock-tables)

  Permite o uso de instruções [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") explícitas para bloquear Tables para as quais você tem o privilégio [`SELECT`](privileges-provided.html#priv_select). Isso inclui o uso de *write locks*, que impede que outras sessões leiam a tabela bloqueada.

* [`PROCESS`](privileges-provided.html#priv_process)

  O privilégio [`PROCESS`](privileges-provided.html#priv_process) controla o acesso a informações sobre *threads* em execução dentro do Server (isto é, informações sobre instruções sendo executadas por sessões). As informações de *Thread* disponíveis usando a instrução [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement"), o comando [**mysqladmin processlist**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"), a tabela [`INFORMATION_SCHEMA.PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table") e a tabela [`processlist`](performance-schema-processlist-table.html "25.12.16.3 The processlist Table") do Performance Schema são acessíveis da seguinte forma:

  + Com o privilégio [`PROCESS`](privileges-provided.html#priv_process), um usuário tem acesso a informações sobre todos os *threads*, mesmo aqueles pertencentes a outros usuários.

  + Sem o privilégio [`PROCESS`](privileges-provided.html#priv_process), usuários não anônimos têm acesso a informações sobre seus próprios *threads*, mas não sobre *threads* de outros usuários, e usuários anônimos não têm acesso a informações de *thread*.

  Nota

  A tabela [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") do Performance Schema também fornece informações de *thread*, mas o acesso à tabela utiliza um modelo de privilégio diferente. Veja [Seção 25.12.16.4, “The threads Table”](performance-schema-threads-table.html "25.12.16.4 The threads Table").

  O privilégio [`PROCESS`](privileges-provided.html#priv_process) também permite o uso da instrução [`SHOW ENGINE`](show-engine.html "13.7.5.15 SHOW ENGINE Statement"), acesso às tabelas `InnoDB` do `INFORMATION_SCHEMA` (tabelas com nomes que começam com `INNODB_`), e (a partir do MySQL 5.7.31) acesso à tabela [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") do `INFORMATION_SCHEMA`.

* [`PROXY`](privileges-provided.html#priv_proxy)

  Permite que um usuário se passe ou se torne conhecido como outro usuário. Veja [Seção 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users").

* [`REFERENCES`](privileges-provided.html#priv_references)

  A criação de uma restrição de *foreign key* requer o privilégio [`REFERENCES`](privileges-provided.html#priv_references) para a tabela pai.

* [`RELOAD`](privileges-provided.html#priv_reload)

  O privilégio [`RELOAD`](privileges-provided.html#priv_reload) permite as seguintes operações:

  + Uso da instrução [`FLUSH`](flush.html "13.7.6.3 FLUSH Statement").

  + Uso de comandos [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") que são equivalentes a operações [`FLUSH`](flush.html "13.7.6.3 FLUSH Statement"): `flush-hosts`, `flush-logs`, `flush-privileges`, `flush-status`, `flush-tables`, `flush-threads`, `refresh` e `reload`.

    O comando `reload` instrui o Server a recarregar as *grant tables* na memória. `flush-privileges` é um sinônimo para `reload`. O comando `refresh` fecha e reabre os arquivos de *log* e descarrega (*flushes*) todas as Tables. Os outros comandos `flush-xxx` realizam funções semelhantes a `refresh`, mas são mais específicos e podem ser preferíveis em alguns casos. Por exemplo, se você deseja descarregar apenas os arquivos de *log*, `flush-logs` é uma escolha melhor do que `refresh`.

  + Uso de opções [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") que realizam várias operações [`FLUSH`](flush.html "13.7.6.3 FLUSH Statement"): [`--flush-logs`](mysqldump.html#option_mysqldump_flush-logs) e [`--master-data`](mysqldump.html#option_mysqldump_master-data).

  + Uso da instrução [`RESET`](reset.html "13.7.6.6 RESET Statement").

* [`REPLICATION CLIENT`](privileges-provided.html#priv_replication-client)

  Permite o uso das instruções [`SHOW MASTER STATUS`](show-master-status.html "13.7.5.23 SHOW MASTER STATUS Statement"), [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") e [`SHOW BINARY LOGS`](show-binary-logs.html "13.7.5.1 SHOW BINARY LOGS Statement").

* [`REPLICATION SLAVE`](privileges-provided.html#priv_replication-slave)

  Permite que a conta solicite atualizações que foram feitas em Databases no *source server*, usando as instruções [`SHOW SLAVE HOSTS`](show-slave-hosts.html "13.7.5.33 SHOW SLAVE HOSTS Statement"), [`SHOW RELAYLOG EVENTS`](show-relaylog-events.html "13.7.5.32 SHOW RELAYLOG EVENTS Statement") e [`SHOW BINLOG EVENTS`](show-binlog-events.html "13.7.5.2 SHOW BINLOG EVENTS Statement"). Este privilégio também é exigido para usar as opções [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") [`--read-from-remote-server`](mysqlbinlog.html#option_mysqlbinlog_read-from-remote-server) (`-R`) e [`--read-from-remote-master`](mysqlbinlog.html#option_mysqlbinlog_read-from-remote-master). Conceda este privilégio a contas que são usadas por *replica servers* para se conectar ao Server atual como sua *source*.

* [`SELECT`](privileges-provided.html#priv_select)

  Permite que linhas sejam selecionadas de Tables em um Database. As instruções [`SELECT`](select.html "13.2.9 SELECT Statement") exigem o privilégio [`SELECT`](privileges-provided.html#priv_select) somente se elas realmente acessarem Tables. Algumas instruções [`SELECT`](select.html "13.2.9 SELECT Statement") não acessam Tables e podem ser executadas sem permissão para qualquer Database. Por exemplo, você pode usar [`SELECT`](select.html "13.2.9 SELECT Statement") como uma calculadora simples para avaliar expressões que não fazem referência a Tables:

  ```sql
  SELECT 1+1;
  SELECT PI()*2;
  ```

  O privilégio [`SELECT`](privileges-provided.html#priv_select) também é necessário para outras instruções que leem valores de coluna. Por exemplo, [`SELECT`](privileges-provided.html#priv_select) é necessário para colunas referenciadas no lado direito da atribuição *`col_name`*=*`expr`* em instruções [`UPDATE`](update.html "13.2.11 UPDATE Statement") ou para colunas nomeadas na cláusula `WHERE` de instruções [`DELETE`](delete.html "13.2.2 DELETE Statement") ou [`UPDATE`](update.html "13.2.11 UPDATE Statement").

  O privilégio [`SELECT`](privileges-provided.html#priv_select) é necessário para Tables ou Views usadas com [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement"), incluindo quaisquer Tables subjacentes em definições de View.

* [`SHOW DATABASES`](privileges-provided.html#priv_show-databases)

  Permite que a conta veja nomes de Databases emitindo a instrução `SHOW DATABASE`. Contas que não possuem este privilégio veem apenas Databases para os quais possuem alguns privilégios, e não podem usar a instrução se o Server foi iniciado com a opção [`--skip-show-database`](server-options.html#option_mysqld_skip-show-database).

  Cuidado

  Como um privilégio global é considerado um privilégio para todos os Databases, *qualquer* privilégio global permite que um usuário veja todos os nomes de Database com [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") ou examinando a tabela [`SCHEMATA`](information-schema-schemata-table.html "24.3.22 The INFORMATION_SCHEMA SCHEMATA Table") do `INFORMATION_SCHEMA`.

* [`SHOW VIEW`](privileges-provided.html#priv_show-view)

  Permite o uso da instrução [`SHOW CREATE VIEW`](show-create-view.html "13.7.5.13 SHOW CREATE VIEW Statement"). Este privilégio também é necessário para Views usadas com [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement").

* [`SHUTDOWN`](privileges-provided.html#priv_shutdown)

  Permite o uso da instrução [`SHUTDOWN`](shutdown.html "13.7.6.7 SHUTDOWN Statement"), o comando [**mysqladmin shutdown**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") e a função C API [`mysql_shutdown()`](/doc/c-api/5.7/en/mysql-shutdown.html).

* [`SUPER`](privileges-provided.html#priv_super)

  Afeta as seguintes operações e comportamentos do Server:

  + Permite alterações na configuração do Server modificando variáveis de sistema globais. Para algumas variáveis de sistema, definir o valor da sessão também requer o privilégio [`SUPER`](privileges-provided.html#priv_super). Se uma variável de sistema for restrita e exigir um privilégio especial para definir o valor da sessão, a descrição da variável indica essa restrição. Exemplos incluem [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format), [`sql_log_bin`](replication-options-binary-log.html#sysvar_sql_log_bin) e [`sql_log_off`](server-system-variables.html#sysvar_sql_log_off). Veja também [Seção 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges").

  + Permite alterações nas características de transação global (veja [Seção 13.3.6, “SET TRANSACTION Statement”](set-transaction.html "13.3.6 SET TRANSACTION Statement")).

  + Permite que a conta inicie e pare a replicação, incluindo *Group Replication*.

  + Permite o uso das instruções [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") e [`CHANGE REPLICATION FILTER`](change-replication-filter.html "13.4.2.2 CHANGE REPLICATION FILTER Statement").

  + Permite o controle do *binary log* por meio das instruções [`PURGE BINARY LOGS`](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement") e [`BINLOG`](binlog.html "13.7.6.1 BINLOG Statement").

  + Permite definir o ID de autorização efetivo ao executar uma View ou *stored program*. Um usuário com este privilégio pode especificar qualquer conta no atributo `DEFINER` de uma View ou *stored program*.

  + Permite o uso das instruções [`CREATE SERVER`](create-server.html "13.1.17 CREATE SERVER Statement"), [`ALTER SERVER`](alter-server.html "13.1.7 ALTER SERVER Statement") e [`DROP SERVER`](drop-server.html "13.1.28 DROP SERVER Statement").

  + Permite o uso do comando [**mysqladmin debug**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program").

  + Permite a rotação da chave de criptografia do `InnoDB`.

  + Permite a leitura do arquivo de chave DES pela função [`DES_ENCRYPT()`](encryption-functions.html#function_des-encrypt).

  + Permite a execução de funções de *Version Tokens*.
  + Permite controle sobre as conexões de cliente não permitidas a contas não-[`SUPER`](privileges-provided.html#priv_super):

    - Permite o uso da instrução [`KILL`](kill.html "13.7.6.4 KILL Statement") ou do comando [**mysqladmin kill**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") para encerrar *threads* pertencentes a outras contas. (Uma conta sempre pode encerrar seus próprios *threads*.)

    - O Server não executa o conteúdo da variável de sistema [`init_connect`](server-system-variables.html#sysvar_init_connect) quando clientes [`SUPER`](privileges-provided.html#priv_super) se conectam.

    - O Server aceita uma conexão de um cliente [`SUPER`](privileges-provided.html#priv_super) mesmo se o limite de conexão configurado pela variável de sistema [`max_connections`](server-system-variables.html#sysvar_max_connections) for atingido.

    - Um Server em modo *offline* ([`offline_mode`](server-system-variables.html#sysvar_offline_mode) habilitado) não encerra conexões de clientes [`SUPER`](privileges-provided.html#priv_super) na próxima solicitação do cliente e aceita novas conexões de clientes [`SUPER`](privileges-provided.html#priv_super).

    - Atualizações podem ser realizadas mesmo quando a variável de sistema [`read_only`](server-system-variables.html#sysvar_read_only) estiver habilitada. Isso se aplica a atualizações explícitas de Tables e ao uso de instruções de gerenciamento de conta, como [`GRANT`](grant.html "13.7.1.4 GRANT Statement") e [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement"), que atualizam Tables implicitamente.

  Você também pode precisar do privilégio [`SUPER`](privileges-provided.html#priv_super) para criar ou alterar *stored functions* se o *binary logging* estiver habilitado, conforme descrito em [Seção 23.7, “Stored Program Binary Logging”](stored-programs-logging.html "23.7 Stored Program Binary Logging").

* [`TRIGGER`](privileges-provided.html#priv_trigger)

  Permite operações de *Trigger*. Você deve ter este privilégio para uma tabela para criar, eliminar, executar ou exibir *Triggers* para essa tabela.

  Quando um *Trigger* é ativado (por um usuário que tem privilégios para executar instruções [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement") ou [`DELETE`](delete.html "13.2.2 DELETE Statement") para a tabela associada ao *Trigger*), a execução do *Trigger* exige que o usuário que definiu o *Trigger* ainda tenha o privilégio [`TRIGGER`](privileges-provided.html#priv_trigger) para a tabela.

* [`UPDATE`](privileges-provided.html#priv_update)

  Permite que linhas sejam atualizadas em Tables em um Database.

* [`USAGE`](privileges-provided.html#priv_usage)

  Este especificador de privilégio significa "nenhum privilégio". Ele é usado no nível global com [`GRANT`](grant.html "13.7.1.4 GRANT Statement") para modificar atributos da conta, como limites de recursos ou características SSL, sem nomear privilégios específicos na lista de privilégios. [`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement") exibe [`USAGE`](privileges-provided.html#priv_usage) para indicar que uma conta não tem privilégios em um determinado nível de privilégio.

#### Diretrizes para Concessão de Privilégios

É uma boa prática conceder a uma conta apenas os privilégios de que ela necessita. Você deve ter cautela especial ao conceder os privilégios [`FILE`](privileges-provided.html#priv_file) e privilégios administrativos:

* [`FILE`](privileges-provided.html#priv_file) pode ser abusado para ler em uma tabela de Database quaisquer arquivos que o MySQL Server possa ler no host do Server. Isso inclui todos os arquivos legíveis globalmente (*world-readable*) e arquivos no diretório de dados do Server. A tabela pode então ser acessada usando [`SELECT`](select.html "13.2.9 SELECT Statement") para transferir seu conteúdo para o host do cliente.

* [`GRANT OPTION`](privileges-provided.html#priv_grant-option) permite que os usuários concedam seus privilégios a outros usuários. Dois usuários que têm privilégios diferentes e o privilégio [`GRANT OPTION`](privileges-provided.html#priv_grant-option) são capazes de combinar privilégios.

* [`ALTER`](privileges-provided.html#priv_alter) pode ser usado para subverter o sistema de privilégios, renomeando Tables.

* [`SHUTDOWN`](privileges-provided.html#priv_shutdown) pode ser abusado para negar serviço a outros usuários inteiramente, encerrando o Server.

* [`PROCESS`](privileges-provided.html#priv_process) pode ser usado para visualizar o texto simples das instruções atualmente em execução, incluindo instruções que definem ou alteram senhas.

* [`SUPER`](privileges-provided.html#priv_super) pode ser usado para encerrar outras sessões ou alterar o modo como o Server opera.

* Privilégios concedidos para o *system database* `mysql` em si podem ser usados para alterar senhas e outras informações de privilégio de acesso:

  + Senhas são armazenadas criptografadas, então um usuário mal-intencionado não pode simplesmente lê-las para saber a senha em texto simples. No entanto, um usuário com acesso de escrita à coluna `authentication_string` da tabela de sistema `mysql.user` pode alterar a senha de uma conta e, em seguida, conectar-se ao servidor MySQL usando essa conta.

  + [`INSERT`](privileges-provided.html#priv_insert) ou [`UPDATE`](privileges-provided.html#priv_update) concedidos para o *system database* `mysql` permitem que um usuário adicione privilégios ou modifique privilégios existentes, respectivamente.

  + [`DROP`](privileges-provided.html#priv_drop) para o *system database* `mysql` permite que um usuário elimine *privilege tables*, ou mesmo o próprio Database.