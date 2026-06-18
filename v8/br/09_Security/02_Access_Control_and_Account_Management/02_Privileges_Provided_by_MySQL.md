### 8.2.2 Prêmios fornecidos pelo MySQL

Os privilégios concedidos a uma conta MySQL determinam quais operações a conta pode realizar. Os privilégios do MySQL diferem nos contextos em que se aplicam e em diferentes níveis de operação:

- Os privilégios administrativos permitem que os usuários gerenciem o funcionamento do servidor MySQL. Esses privilégios são globais, pois não são específicos de um banco de dados particular.

- Os privilégios de banco de dados se aplicam a um banco de dados e a todos os objetos dentro dele. Esses privilégios podem ser concedidos para bancos de dados específicos ou globalmente, para que se apliquem a todos os bancos de dados.

- Os privilégios para objetos de banco de dados, como tabelas, índices, visualizações e rotinas armazenadas, podem ser concedidos para objetos específicos dentro de um banco de dados, para todos os objetos de um determinado tipo dentro de um banco de dados (por exemplo, todas as tabelas em um banco de dados) ou globalmente para todos os objetos de um determinado tipo em todos os bancos de dados.

Os privilégios também diferem em termos de serem estáticos (integrados ao servidor) ou dinâmicos (definidos em tempo de execução). Se um privilégio é estático ou dinâmico afeta sua disponibilidade para ser concedido a contas e papéis de usuários. Para obter informações sobre as diferenças entre privilégios estáticos e dinâmicos, consulte Privilegios estáticos versus dinâmicos.)

As informações sobre os privilégios da conta são armazenadas nas tabelas de concessão no banco de dados do sistema `mysql`. Para uma descrição da estrutura e do conteúdo dessas tabelas, consulte a Seção 8.2.3, “Tabelas de Concessão”. O servidor MySQL lê o conteúdo das tabelas de concessão na memória quando ele é iniciado e os recarrega nas circunstâncias indicadas na Seção 8.2.13, “Quando os Privilegios Mudam de Efeito”. O servidor baseia as decisões de controle de acesso nas cópias na memória das tabelas de concessão.

Importante

Algumas versões do MySQL introduzem alterações nas tabelas de concessão para adicionar novos privilégios ou recursos. Para garantir que você possa aproveitar quaisquer novas funcionalidades, atualize suas tabelas de concessão para a estrutura atual sempre que atualizar o MySQL. Consulte o Capítulo 3, *Atualizando o MySQL*.

As seções a seguir resumem os privilégios disponíveis, fornecem descrições mais detalhadas de cada privilégio e oferecem diretrizes de uso.

- Resumo dos privilégios disponíveis
- Descrição de privilégios estáticos
- Descrição de privilégios dinâmicos
- Diretrizes de concessão de privilégios
- Privilégios estáticos versus dinâmicos
- Migrar contas do SUPER para Privilegios Dinâmicos

#### Resumo dos privilégios disponíveis

A tabela a seguir mostra os nomes dos privilégios estáticos usados nas declarações `GRANT` e `REVOKE`, juntamente com o nome da coluna associado a cada privilégio nas tabelas de concessão e o contexto em que o privilégio se aplica.

**Tabela 8.2 Permissões estáticas permitidas para GRANT e REVOKE**

<table><thead><tr> <th scope="col">Privilégio</th> <th scope="col">Coluna da Tabela de Concessão</th> <th scope="col">Contexto</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>Create_routine_priv</code>]</th> <td>Sinônimo de<span class="quote">“<span class="quote">todos os privilégios</span>”</span></td> <td>Administração de servidores</td> </tr><tr> <th>[[PH_HTML_CODE_<code>Create_routine_priv</code>]</th> <td>[[PH_HTML_CODE_<code>Create_tablespace_priv</code>]</td> <td>Tabelas</td> </tr><tr> <th>[[PH_HTML_CODE_<code>CREATE TEMPORARY TABLES</code>]</th> <td>[[PH_HTML_CODE_<code>Create_tmp_table_priv</code>]</td> <td>Rotinas armazenadas</td> </tr><tr> <th>[[PH_HTML_CODE_<code>CREATE USER</code>]</th> <td>[[PH_HTML_CODE_<code>Create_user_priv</code>]</td> <td>Bancos de dados, tabelas ou índices</td> </tr><tr> <th>[[PH_HTML_CODE_<code>CREATE VIEW</code>]</th> <td>[[PH_HTML_CODE_<code>Create_view_priv</code>]</td> <td>Administração de servidores</td> </tr><tr> <th>[[PH_HTML_CODE_<code>DELETE</code>]</th> <td>[[<code>Create_routine_priv</code>]]</td> <td>Rotinas armazenadas</td> </tr><tr> <th>[[<code>ALTER</code><code>Create_routine_priv</code>]</th> <td>[[<code>Create_tablespace_priv</code>]]</td> <td>Administração de servidores</td> </tr><tr> <th>[[<code>CREATE TEMPORARY TABLES</code>]]</th> <td>[[<code>Create_tmp_table_priv</code>]]</td> <td>Tabelas</td> </tr><tr> <th>[[<code>CREATE USER</code>]]</th> <td>[[<code>Create_user_priv</code>]]</td> <td>Administração de servidores</td> </tr><tr> <th>[[<code>CREATE VIEW</code>]]</th> <td>[[<code>Create_view_priv</code>]]</td> <td>Visões</td> </tr><tr> <th>[[<code>DELETE</code>]]</th> <td>[[<code>Alter_priv</code><code>Create_routine_priv</code>]</td> <td>Tabelas</td> </tr><tr> <th>[[<code>Alter_priv</code><code>Create_routine_priv</code>]</th> <td>[[<code>Alter_priv</code><code>Create_tablespace_priv</code>]</td> <td>Bancos de dados, tabelas ou visualizações</td> </tr><tr> <th>[[<code>Alter_priv</code><code>CREATE TEMPORARY TABLES</code>]</th> <td>[[<code>Alter_priv</code><code>Create_tmp_table_priv</code>]</td> <td>Administração de servidores</td> </tr><tr> <th>[[<code>Alter_priv</code><code>CREATE USER</code>]</th> <td>[[<code>Alter_priv</code><code>Create_user_priv</code>]</td> <td>Bancos de dados</td> </tr><tr> <th>[[<code>Alter_priv</code><code>CREATE VIEW</code>]</th> <td>[[<code>Alter_priv</code><code>Create_view_priv</code>]</td> <td>Rotinas armazenadas</td> </tr><tr> <th>[[<code>Alter_priv</code><code>DELETE</code>]</th> <td>[[<code>ALTER ROUTINE</code><code>Create_routine_priv</code>]</td> <td>Acesso a arquivos no host do servidor</td> </tr><tr> <th>[[<code>ALTER ROUTINE</code><code>Create_routine_priv</code>]</th> <td>[[<code>ALTER ROUTINE</code><code>Create_tablespace_priv</code>]</td> <td>Bancos de dados, tabelas ou rotinas armazenadas</td> </tr><tr> <th>[[<code>ALTER ROUTINE</code><code>CREATE TEMPORARY TABLES</code>]</th> <td>[[<code>ALTER ROUTINE</code><code>Create_tmp_table_priv</code>]</td> <td>Tabelas</td> </tr><tr> <th>[[<code>ALTER ROUTINE</code><code>CREATE USER</code>]</th> <td>[[<code>ALTER ROUTINE</code><code>Create_user_priv</code>]</td> <td>Tabelas ou colunas</td> </tr><tr> <th>[[<code>ALTER ROUTINE</code><code>CREATE VIEW</code>]</th> <td>[[<code>ALTER ROUTINE</code><code>Create_view_priv</code>]</td> <td>Bancos de dados</td> </tr><tr> <th>[[<code>ALTER ROUTINE</code><code>DELETE</code>]</th> <td>[[<code>Alter_routine_priv</code><code>Create_routine_priv</code>]</td> <td>Administração de servidores</td> </tr><tr> <th>[[<code>Alter_routine_priv</code><code>Create_routine_priv</code>]</th> <td>Veja a tabela [[<code>Alter_routine_priv</code><code>Create_tablespace_priv</code>]</td> <td>Administração de servidores</td> </tr><tr> <th>[[<code>Alter_routine_priv</code><code>CREATE TEMPORARY TABLES</code>]</th> <td>[[<code>Alter_routine_priv</code><code>Create_tmp_table_priv</code>]</td> <td>Bancos de dados ou tabelas</td> </tr><tr> <th>[[<code>Alter_routine_priv</code><code>CREATE USER</code>]</th> <td>[[<code>Alter_routine_priv</code><code>Create_user_priv</code>]</td> <td>Administração de servidores</td> </tr><tr> <th>[[<code>Alter_routine_priv</code><code>CREATE VIEW</code>]</th> <td>[[<code>Alter_routine_priv</code><code>Create_view_priv</code>]</td> <td>Administração de servidores</td> </tr><tr> <th>[[<code>Alter_routine_priv</code><code>DELETE</code>]</th> <td>[[<code>CREATE</code><code>Create_routine_priv</code>]</td> <td>Administração de servidores</td> </tr><tr> <th>[[<code>CREATE</code><code>Create_routine_priv</code>]</th> <td>[[<code>CREATE</code><code>Create_tablespace_priv</code>]</td> <td>Tabelas ou colunas</td> </tr><tr> <th>[[<code>CREATE</code><code>CREATE TEMPORARY TABLES</code>]</th> <td>[[<code>CREATE</code><code>Create_tmp_table_priv</code>]</td> <td>Administração de servidores</td> </tr><tr> <th>[[<code>CREATE</code><code>CREATE USER</code>]</th> <td>[[<code>CREATE</code><code>Create_user_priv</code>]</td> <td>Visões</td> </tr><tr> <th>[[<code>CREATE</code><code>CREATE VIEW</code>]</th> <td>[[<code>CREATE</code><code>Create_view_priv</code>]</td> <td>Administração de servidores</td> </tr><tr> <th>[[<code>CREATE</code><code>DELETE</code>]</th> <td>[[<code>Create_priv</code><code>Create_routine_priv</code>]</td> <td>Administração de servidores</td> </tr><tr> <th>[[<code>Create_priv</code><code>Create_routine_priv</code>]</th> <td>[[<code>Create_priv</code><code>Create_tablespace_priv</code>]</td> <td>Tabelas</td> </tr><tr> <th>[[<code>Create_priv</code><code>CREATE TEMPORARY TABLES</code>]</th> <td>[[<code>Create_priv</code><code>Create_tmp_table_priv</code>]</td> <td>Tabelas ou colunas</td> </tr><tr> <th>[[<code>Create_priv</code><code>CREATE USER</code>]</th> <td>Sinônimo de<span class="quote">“<span class="quote">sem privilégios</span>”</span></td> <td>Administração de servidores</td> </tr></tbody></table>

A tabela a seguir mostra os nomes de privilégio dinâmico usados nas declarações `GRANT` e `REVOKE`, juntamente com o contexto em que o privilégio se aplica.

**Tabela 8.3 Privilégios Dinâmicos Permitidos para GRANTE e REVOGAR**

<table><thead><tr> <th>Privilégio</th> <th>Contexto</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>FIREWALL_ADMIN</code>]</td> <td>Administração de senha dupla</td> </tr><tr> <td>[[PH_HTML_CODE_<code>FIREWALL_ADMIN</code>]</td> <td>Permitir consultas bloqueadas pelo filtro do log de auditoria</td> </tr><tr> <td>[[PH_HTML_CODE_<code>FIREWALL_USER</code>]</td> <td>Administração do log de auditoria</td> </tr><tr> <td>[[PH_HTML_CODE_<code>FLUSH_OPTIMIZER_COSTS</code>]</td> <td>Administração de autenticação</td> </tr><tr> <td>[[PH_HTML_CODE_<code>FLUSH_STATUS</code>]</td> <td>Administração de backup</td> </tr><tr> <td>[[PH_HTML_CODE_<code>FLUSH_TABLES</code>]</td> <td>Administração de backup e replicação</td> </tr><tr> <td>[[PH_HTML_CODE_<code>FLUSH_USER_RESOURCES</code>]</td> <td>Administração de backup e replicação</td> </tr><tr> <td>[[PH_HTML_CODE_<code>GROUP_REPLICATION_ADMIN</code>]</td> <td>Administração de clones</td> </tr><tr> <td>[[PH_HTML_CODE_<code>GROUP_REPLICATION_STREAM</code>]</td> <td>Administração de servidores</td> </tr><tr> <td>[[PH_HTML_CODE_<code>INNODB_REDO_LOG_ARCHIVE</code>]</td> <td>Administração de servidores</td> </tr><tr> <td>[[<code>FIREWALL_ADMIN</code>]]</td> <td>Administração do firewall</td> </tr><tr> <td>[[<code>AUDIT_ABORT_EXEMPT</code><code>FIREWALL_ADMIN</code>]</td> <td>Administração do firewall</td> </tr><tr> <td>[[<code>FIREWALL_USER</code>]]</td> <td>Administração do firewall</td> </tr><tr> <td>[[<code>FLUSH_OPTIMIZER_COSTS</code>]]</td> <td>Administração de servidores</td> </tr><tr> <td>[[<code>FLUSH_STATUS</code>]]</td> <td>Administração de servidores</td> </tr><tr> <td>[[<code>FLUSH_TABLES</code>]]</td> <td>Administração de servidores</td> </tr><tr> <td>[[<code>FLUSH_USER_RESOURCES</code>]]</td> <td>Administração de servidores</td> </tr><tr> <td>[[<code>GROUP_REPLICATION_ADMIN</code>]]</td> <td>Administração de replicação</td> </tr><tr> <td>[[<code>GROUP_REPLICATION_STREAM</code>]]</td> <td>Administração de replicação</td> </tr><tr> <td>[[<code>INNODB_REDO_LOG_ARCHIVE</code>]]</td> <td>Reorganização da administração de arquivamento de logs</td> </tr><tr> <td>[[<code>AUDIT_ADMIN</code><code>FIREWALL_ADMIN</code>]</td> <td>Refazer a administração do log</td> </tr><tr> <td>[[<code>AUDIT_ADMIN</code><code>FIREWALL_ADMIN</code>]</td> <td>Administração de servidores</td> </tr><tr> <td>[[<code>AUDIT_ADMIN</code><code>FIREWALL_USER</code>]</td> <td>Cluster NDB</td> </tr><tr> <td>[[<code>AUDIT_ADMIN</code><code>FLUSH_OPTIMIZER_COSTS</code>]</td> <td>Administração de autenticação</td> </tr><tr> <td>[[<code>AUDIT_ADMIN</code><code>FLUSH_STATUS</code>]</td> <td>Administração de servidores</td> </tr><tr> <td>[[<code>AUDIT_ADMIN</code><code>FLUSH_TABLES</code>]</td> <td>[[<code>AUDIT_ADMIN</code><code>FLUSH_USER_RESOURCES</code>] para um canal de replicação</td> </tr><tr> <td>[[<code>AUDIT_ADMIN</code><code>GROUP_REPLICATION_ADMIN</code>]</td> <td>Administração de replicação</td> </tr><tr> <td>[[<code>AUDIT_ADMIN</code><code>GROUP_REPLICATION_STREAM</code>]</td> <td>Administração de grupos de recursos</td> </tr><tr> <td>[[<code>AUDIT_ADMIN</code><code>INNODB_REDO_LOG_ARCHIVE</code>]</td> <td>Administração de grupos de recursos</td> </tr><tr> <td>[[<code>AUTHENTICATION_POLICY_ADMIN</code><code>FIREWALL_ADMIN</code>]</td> <td>Administração de servidores</td> </tr><tr> <td>[[<code>AUTHENTICATION_POLICY_ADMIN</code><code>FIREWALL_ADMIN</code>]</td> <td>Administração de servidores</td> </tr><tr> <td>[[<code>AUTHENTICATION_POLICY_ADMIN</code><code>FIREWALL_USER</code>]</td> <td>Administração de servidores</td> </tr><tr> <td>[[<code>AUTHENTICATION_POLICY_ADMIN</code><code>FLUSH_OPTIMIZER_COSTS</code>]</td> <td>Administração de servidores</td> </tr><tr> <td>[[<code>AUTHENTICATION_POLICY_ADMIN</code><code>FLUSH_STATUS</code>]</td> <td>Administração de servidores</td> </tr><tr> <td>[[<code>AUTHENTICATION_POLICY_ADMIN</code><code>FLUSH_TABLES</code>]</td> <td>Administração de servidores</td> </tr><tr> <td>[[<code>AUTHENTICATION_POLICY_ADMIN</code><code>FLUSH_USER_RESOURCES</code>]</td> <td>Administração de servidores</td> </tr><tr> <td>[[<code>AUTHENTICATION_POLICY_ADMIN</code><code>GROUP_REPLICATION_ADMIN</code>]</td> <td>Administração de servidores</td> </tr><tr> <td>[[<code>AUTHENTICATION_POLICY_ADMIN</code><code>GROUP_REPLICATION_STREAM</code>]</td> <td>Administração de servidores</td> </tr><tr> <td>[[<code>AUTHENTICATION_POLICY_ADMIN</code><code>INNODB_REDO_LOG_ARCHIVE</code>]</td> <td>Administração do log de telemetria para MySQL HeatWave na AWS</td> </tr><tr> <td>[[<code>BACKUP_ADMIN</code><code>FIREWALL_ADMIN</code>]</td> <td>Administração do pool de threads</td> </tr><tr> <td>[[<code>BACKUP_ADMIN</code><code>FIREWALL_ADMIN</code>]</td> <td>Administração de servidores</td> </tr><tr> <td>[[<code>BACKUP_ADMIN</code><code>FIREWALL_USER</code>]</td> <td>Administração de servidores</td> </tr></tbody></table>

#### Descrição de privilégios estáticos

Os privilégios estáticos são incorporados ao servidor, ao contrário dos privilégios dinâmicos, que são definidos em tempo de execução. A lista a seguir descreve cada privilégio estático disponível no MySQL.

Algumas instruções SQL específicas podem ter requisitos de privilégio mais específicos do que o indicado aqui. Nesse caso, a descrição da instrução em questão fornece os detalhes.

- `ALL`, `ALL PRIVILEGES`

  Esses especizadores de privilégio são abreviações para “todos os privilégios disponíveis em um determinado nível de privilégio” (exceto `GRANT OPTION`). Por exemplo, conceder `ALL` no nível global ou de tabela concede todos os privilégios globais ou todos os privilégios de nível de tabela, respectivamente.

- `ALTER`

  Permite o uso da declaração `ALTER TABLE` para alterar a estrutura das tabelas. `ALTER TABLE` também requer os privilégios `CREATE` e `INSERT`. Para renomear uma tabela, são necessários os privilégios `ALTER` e `DROP` na tabela antiga, `CREATE`, e `INSERT` na nova tabela.

- `ALTER ROUTINE`

  Permite o uso de declarações que alteram ou excluem rotinas armazenadas (procedimentos e funções armazenados). Para rotinas que estejam dentro do escopo em que o privilégio é concedido e para as quais o usuário não seja o usuário nomeado como a rotina `DEFINER`, também permite o acesso a propriedades da rotina, além da definição da rotina.

- `CREATE`

  Permite o uso de declarações que criam novos bancos de dados e tabelas.

- `CREATE ROLE`

  Habilita o uso da instrução `CREATE ROLE`. (O privilégio `CREATE USER` também habilita o uso da instrução `CREATE ROLE`. Consulte a Seção 8.2.10, “Usando papéis”.

  Os privilégios `CREATE ROLE` e `DROP ROLE` não são tão poderosos quanto o `CREATE USER`, pois só podem ser usados para criar e excluir contas. Eles não podem ser usados como o `CREATE USER` pode modificar atributos de contas ou renomear contas. Veja Intercambiabilidade de Usuário e Papel.

- `CREATE ROUTINE`

  Permite o uso de declarações que criam rotinas armazenadas (procedimentos e funções armazenadas). Para rotinas que estejam dentro do escopo em que o privilégio é concedido e para as quais o usuário não seja o usuário nomeado como a rotina `DEFINER`, também permite o acesso a propriedades da rotina, além da definição da rotina.

- `CREATE TABLESPACE`

  Permite o uso de declarações que criam, alteram ou eliminam espaços de tabela e grupos de arquivos de log.

- `CREATE TEMPORARY TABLES`

  Permite a criação de tabelas temporárias usando a instrução `CREATE TEMPORARY TABLE`.

  Após a criação de uma tabela temporária, o servidor não realiza mais verificações de privilégios na tabela. A sessão que criou a tabela pode realizar qualquer operação na tabela, como `DROP TABLE`, `INSERT`, `UPDATE` ou `SELECT`. Para obter mais informações, consulte a Seção 15.1.20.2, “Instrução CREATE TEMPORARY TABLE”.

- `CREATE USER`

  Permite o uso das declarações `ALTER USER`, `CREATE ROLE`, `CREATE USER`, `DROP ROLE`, `DROP USER`, `RENAME USER` e `REVOKE ALL PRIVILEGES`.

- `CREATE VIEW`

  Habilita o uso da declaração `CREATE VIEW`.

- `DELETE`

  Permite a exclusão de linhas de tabelas em um banco de dados.

- `DROP`

  Permite o uso de instruções que excluem (removem) bancos de dados, tabelas e visualizações existentes. O privilégio `DROP` é necessário para usar a instrução `ALTER TABLE ... DROP PARTITION` em uma tabela particionada. O privilégio `DROP` também é necessário para `TRUNCATE TABLE`.

- `DROP ROLE`

  Habilita o uso da instrução `DROP ROLE`. (O privilégio `CREATE USER` também habilita o uso da instrução `DROP ROLE`. Consulte a Seção 8.2.10, “Usando papéis”.

  Os privilégios `CREATE ROLE` e `DROP ROLE` não são tão poderosos quanto o `CREATE USER`, pois só podem ser usados para criar e excluir contas. Eles não podem ser usados como o `CREATE USER` pode modificar atributos de contas ou renomear contas. Veja Intercambiabilidade de Usuário e Papel.

- `EVENT`

  Permite o uso de declarações que criam, alteram, excluem ou exibem eventos para o Agendamento de Eventos.

- `EXECUTE`

  Permite o uso de declarações que executam rotinas armazenadas (procedimentos e funções armazenadas). Para rotinas que estão dentro do escopo em que o privilégio é concedido e para as quais o usuário não é o usuário nomeado como a rotina `DEFINER`, também permite o acesso a propriedades da rotina, além da definição da rotina.

- `FILE`

  Afeta as seguintes operações e comportamentos do servidor:

  - Permite a leitura e a escrita de arquivos no host do servidor usando as instruções `LOAD DATA` e `SELECT ... INTO OUTFILE` e a função `LOAD_FILE()`. Um usuário que tenha o privilégio `FILE` pode ler qualquer arquivo no host do servidor que seja legível para todos ou legível pelo servidor MySQL. (Isso implica que o usuário pode ler qualquer arquivo em qualquer diretório de banco de dados, porque o servidor pode acessar qualquer um desses arquivos.)

  - Permite a criação de novos arquivos em qualquer diretório onde o servidor MySQL tenha acesso de escrita. Isso inclui o diretório de dados do servidor, que contém os arquivos que implementam as tabelas de privilégios.

  - Habilita o uso da opção de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY` para a declaração `CREATE TABLE`.

  Como medida de segurança, o servidor não sobrescreve arquivos existentes.

  Para limitar a localização em que os arquivos podem ser lidos e escritos, defina a variável de sistema `secure_file_priv` para um diretório específico. Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”.

- `GRANT OPTION`

  Permite que você conceda ou revogue os privilégios que você mesmo possui para outros usuários.

- `INDEX`

  Permite o uso de instruções que criam ou excluem (removem) índices. `INDEX` se aplica a tabelas existentes. Se você tiver o privilégio `CREATE` para uma tabela, você pode incluir definições de índices na instrução `CREATE TABLE`.

- `INSERT`

  Permite que linhas sejam inseridas em tabelas de um banco de dados. `INSERT` também é necessário para as declarações de manutenção de tabelas `ANALYZE TABLE`, `OPTIMIZE TABLE` e `REPAIR TABLE`.

- `LOCK TABLES`

  Permite o uso de declarações explícitas `LOCK TABLES` para bloquear tabelas para as quais você tem o privilégio `SELECT`. Isso inclui o uso de bloqueios de escrita, que impede que outras sessões leiam a tabela bloqueada.

- `PROCESS`

  O privilégio `PROCESS` controla o acesso às informações sobre os threads que estão sendo executados no servidor (ou seja, informações sobre as instruções sendo executadas pelas sessões). As informações sobre os threads disponíveis usando a instrução `SHOW PROCESSLIST`, o comando **mysqladmin processlist**, a tabela Schema de Informações `PROCESSLIST` e a tabela Schema de Desempenho `processlist` são acessíveis da seguinte forma:

  - Com o privilégio `PROCESS`, um usuário tem acesso a informações sobre todas as threads, mesmo aquelas pertencentes a outros usuários.

  - Sem o privilégio `PROCESS`, os usuários não anônimos têm acesso às informações sobre seus próprios tópicos, mas não sobre os tópicos de outros usuários, e os usuários anônimos não têm acesso às informações dos tópicos.

  Nota

  A tabela do Schema de Desempenho `threads` também fornece informações sobre os threads, mas o acesso à tabela utiliza um modelo de privilégio diferente. Consulte a Seção 29.12.21.8, “A tabela de threads”.

  O privilégio `PROCESS` também permite o uso da instrução `SHOW ENGINE`, acesso às tabelas `INFORMATION_SCHEMA` `InnoDB` (tabelas com nomes que começam com `INNODB_`), e (a partir do MySQL 8.0.21) acesso à tabela `INFORMATION_SCHEMA` `FILES`.

- `PROXY`

  Permite que um usuário se identifique como outro usuário ou se torne conhecido como outro usuário. Consulte a Seção 8.2.19, “Usuários Proxy”.

- `REFERENCES`

  A criação de uma restrição de chave estrangeira requer o privilégio `REFERENCES` para a tabela pai.

- `RELOAD`

  O `RELOAD` permite as seguintes operações:

  - Uso da declaração `FLUSH`.

  - Uso dos comandos do **mysqladmin** que são equivalentes às operações `FLUSH` `flush-hosts`, `flush-logs`, `flush-privileges`, `flush-status`, `flush-tables`, `flush-threads`, `refresh` e `reload`.

    O comando `reload` indica ao servidor para recarregar as tabelas de concessão na memória. `flush-privileges` é sinônimo de `reload`. O comando `refresh` fecha e reabre os arquivos de log e esvazia todas as tabelas. Os outros comandos `flush-xxx` realizam funções semelhantes a `refresh`, mas são mais específicos e podem ser preferíveis em alguns casos. Por exemplo, se você deseja esvaziar apenas os arquivos de log, `flush-logs` é uma melhor escolha do que `refresh`.

  - Uso das opções do **mysqldump** que realizam várias operações `FLUSH`: `--flush-logs` e `--master-data`.

  - Uso das instruções `RESET MASTER` e `RESET REPLICA` (ou antes do MySQL 8.0.22, `RESET SLAVE`).

- `REPLICATION CLIENT`

  Permite o uso das instruções `SHOW MASTER STATUS`, `SHOW REPLICA STATUS` e `SHOW BINARY LOGS`.

- `REPLICATION SLAVE`

  Permite que a conta solicite atualizações que foram feitas em bancos de dados no servidor de origem da replicação, usando as instruções `SHOW REPLICAS` (ou antes do MySQL 8.0.22, `SHOW SLAVE HOSTS`), `SHOW RELAYLOG EVENTS` e `SHOW BINLOG EVENTS`. Este privilégio também é necessário para usar as opções **mysqlbinlog** `--read-from-remote-server` (`-R`), `--read-from-remote-source` e `--read-from-remote-master`. Conceda este privilégio às contas que são usadas pelas réplicas para se conectarem ao servidor atual como seu servidor de origem da replicação.

- `SELECT`

  Permite que as linhas sejam selecionadas a partir de tabelas em um banco de dados. As instruções `SELECT` exigem o privilégio `SELECT` apenas se elas realmente acessarem tabelas. Algumas instruções `SELECT` não acessam tabelas e podem ser executadas sem permissão para qualquer banco de dados. Por exemplo, você pode usar `SELECT` como uma calculadora simples para avaliar expressões que não fazem referência a tabelas:

  ```
  SELECT 1+1;
  SELECT PI()*2;
  ```

  O privilégio `SELECT` também é necessário para outras declarações que leem valores de coluna. Por exemplo, `SELECT` é necessário para colunas referenciadas no lado direito da atribuição `col_name`=`expr` em declarações `UPDATE` ou para colunas nomeadas na cláusula `WHERE` de declarações `DELETE` ou `UPDATE`.

  O privilégio `SELECT` é necessário para tabelas ou visualizações usadas com `EXPLAIN`, incluindo quaisquer tabelas subjacentes nas definições de visualizações.

- `SHOW DATABASES`

  Habilita a conta a ver os nomes dos bancos de dados ao emitir a declaração `SHOW DATABASE`. As contas que não têm esse privilégio veem apenas os bancos de dados para os quais têm alguns privilégios e não podem usar a declaração de forma alguma se o servidor foi iniciado com a opção `--skip-show-database`.

  Cuidado

  Como qualquer privilégio global estático é considerado um privilégio para todas as bases de dados, qualquer privilégio global estático permite que um usuário veja todos os nomes de base de dados com `SHOW DATABASES` ou examinando a tabela `SCHEMATA` de `INFORMATION_SCHEMA`, exceto as bases de dados que foram restringidas ao nível da base de dados por revogações parciais.

- `SHOW VIEW`

  Habilita o uso da instrução `SHOW CREATE VIEW`. Este privilégio também é necessário para visualizações usadas com `EXPLAIN`.

- `SHUTDOWN`

  Permite o uso das instruções `SHUTDOWN` e `RESTART`, do comando **mysqladmin shutdown** e da função de API em C `mysql_shutdown()`.

- `SUPER`

  `SUPER` é um privilégio poderoso e de grande alcance e não deve ser concedido sem ponderação. Se uma conta precisar realizar apenas um subconjunto das operações de `SUPER`, pode ser possível obter o conjunto de privilégios desejado concedendo, em vez disso, um ou mais privilégios dinâmicos, cada um dos quais confere capacidades mais limitadas. Veja Descrições de Privilégios Dinâmicos.

  Nota

  `SUPER` está desatualizado e você deve esperar que ele seja removido em uma versão futura do MySQL. Veja Como migrar contas de SUPER para privilégios dinâmicos.

  `SUPER` afeta as seguintes operações e comportamentos do servidor:

  - Permite alterações de variáveis do sistema em tempo de execução:

    - Permite que as alterações de configuração do servidor sejam aplicadas às variáveis do sistema global com `SET GLOBAL` e `SET PERSIST`.

      O privilégio dinâmico correspondente é `SYSTEM_VARIABLES_ADMIN`.

    - Permite definir variáveis de sistema de sessão restritas que exigem um privilégio especial.

      O privilégio dinâmico correspondente é `SESSION_VARIABLES_ADMIN`.

    Veja também a Seção 7.1.9.1, “Privilégios de Variáveis do Sistema”.

  - Permite alterações nas características de transações globais (consulte a Seção 15.3.7, "Instrução SET TRANSACTION").

    O privilégio dinâmico correspondente é `SYSTEM_VARIABLES_ADMIN`.

  - Permite que a conta inicie e pare a replicação, incluindo a replicação em grupo.

    O privilégio dinâmico correspondente é `REPLICATION_SLAVE_ADMIN` para replicação regular, `GROUP_REPLICATION_ADMIN` para replicação em grupo.

  - Permite o uso das declarações `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23), `CHANGE MASTER TO` (antes do MySQL 8.0.23) e das declarações `CHANGE REPLICATION FILTER`.

    O privilégio dinâmico correspondente é `REPLICATION_SLAVE_ADMIN`.

  - Habilita o controle do log binário por meio das instruções `PURGE BINARY LOGS` e `BINLOG`.

    O privilégio dinâmico correspondente é `BINLOG_ADMIN`.

  - Permite definir o ID de autorização efetivo ao executar uma visualização ou um programa armazenado. Um usuário com esse privilégio pode especificar qualquer conta no atributo `DEFINER` de uma visualização ou um programa armazenado.

    O privilégio dinâmico correspondente é `SET_USER_ID`.

  - Permite o uso das instruções `CREATE SERVER`, `ALTER SERVER` e `DROP SERVER`.

  - Habilita o uso do comando **mysqladmin debug**.

  - Habilita a rotação da chave de criptografia `InnoDB`.

    O privilégio dinâmico correspondente é `ENCRYPTION_KEY_ADMIN`.

  - Habilita a execução das funções dos Tokens de Versão.

    O privilégio dinâmico correspondente é `VERSION_TOKEN_ADMIN`.

  - Permite conceder e revogar papéis, usar a cláusula `WITH ADMIN OPTION` da declaração `GRANT` e o conteúdo do elemento `<graphml>` não vazio no resultado da função `ROLES_GRAPHML()`.

    O privilégio dinâmico correspondente é `ROLE_ADMIN`.

  - Permite o controle sobre as conexões do cliente que não são permitidas para contas não `SUPER`:

    - Permite o uso da instrução `KILL` ou do comando **mysqladmin kill** para matar threads pertencentes a outras contas. (Uma conta sempre pode matar suas próprias threads.)

    - O servidor não executa o conteúdo da variável de sistema `init_connect` quando os clientes `SUPER` se conectam.

    - O servidor aceita uma conexão de um cliente `SUPER`, mesmo que o limite de conexão configurado pela variável de sistema `max_connections` tenha sido atingido.

    - Um servidor em modo offline (`offline_mode` ativado) não encerra as conexões do cliente `SUPER` na próxima solicitação do cliente e aceita novas conexões de clientes `SUPER`.

    - As atualizações podem ser realizadas mesmo quando a variável de sistema `read_only` está habilitada. Isso se aplica a atualizações explícitas de tabelas e ao uso de declarações de gerenciamento de contas, como `GRANT` e `REVOKE`, que atualizam tabelas de forma implícita.

    O privilégio dinâmico correspondente para as operações de controle de conexão anteriores é `CONNECTION_ADMIN`.

  Você também pode precisar do privilégio `SUPER` para criar ou alterar funções armazenadas se o registro binário estiver habilitado, conforme descrito na Seção 27.7, “Registro Binário de Programas Armazenados”.

- `TRIGGER`

  Habilita operações de gatilho. Você deve ter esse privilégio para que uma tabela possa criar, excluir, executar ou exibir gatilhos para essa tabela.

  Quando um gatilho é ativado (por um usuário que tem privilégios para executar as instruções `INSERT`, `UPDATE` ou `DELETE` para a tabela associada ao gatilho), a execução do gatilho exige que o usuário que definiu o gatilho ainda tenha o privilégio `TRIGGER` para a tabela.

- `UPDATE`

  Permite que as linhas sejam atualizadas em tabelas de um banco de dados.

- `USAGE`

  Este especificador de privilégio significa “sem privilégios”. Ele é usado a nível global com `GRANT` para especificar cláusulas como `WITH GRANT OPTION` sem nomear privilégios específicos da conta na lista de privilégios. `SHOW GRANTS` exibe `USAGE` para indicar que uma conta não tem privilégios em um nível de privilégio.

#### Descrição de privilégios dinâmicos

Os privilégios dinâmicos são definidos em tempo de execução, em contraste com os privilégios estáticos, que são incorporados ao servidor. A lista a seguir descreve cada privilégio dinâmico disponível no MySQL.

A maioria dos privilégios dinâmicos é definida durante o início do servidor. Outros são definidos por um componente ou plugin específico, conforme indicado nas descrições dos privilégios. Nesses casos, o privilégio não está disponível, a menos que o componente ou plugin que o define esteja habilitado.

Algumas instruções SQL específicas podem ter requisitos de privilégio mais específicos do que o indicado aqui. Nesse caso, a descrição da instrução em questão fornece os detalhes.

- `APPLICATION_PASSWORD_ADMIN` (adicionado no MySQL 8.0.14)

  Para a capacidade de usar duas senhas, este privilégio permite o uso das cláusulas `RETAIN CURRENT PASSWORD` e `DISCARD OLD PASSWORD` para as instruções `ALTER USER` e `SET PASSWORD` que se aplicam à sua própria conta. Este privilégio é necessário para manipular sua própria senha secundária, pois a maioria dos usuários exige apenas uma senha.

  Se uma conta deve ser autorizada a manipular senhas secundárias para todas as contas, ela deve receber o privilégio `CREATE USER` em vez de `APPLICATION_PASSWORD_ADMIN`.

  Para obter mais informações sobre o uso de senhas duplas, consulte a Seção 8.2.15, “Gerenciamento de Senhas”.

- `AUDIT_ABORT_EXEMPT` (adicionado no MySQL 8.0.28)

  Permite consultas bloqueadas por um item "abort" no filtro do log de auditoria. Este privilégio é definido pelo plugin `audit_log`; veja a Seção 8.4.5, "Auditoria do MySQL Enterprise".

  Contas criadas no MySQL 8.0.28 ou posterior com o privilégio `SYSTEM_USER` têm o privilégio `AUDIT_ABORT_EXEMPT` atribuído automaticamente quando são criadas. O privilégio `AUDIT_ABORT_EXEMPT` também é atribuído às contas existentes com o privilégio `SYSTEM_USER` quando você executa um procedimento de atualização com o MySQL 8.0.28 ou posterior, se nenhuma conta existente tiver esse privilégio atribuído. As contas com o privilégio `SYSTEM_USER` podem, portanto, ser usadas para recuperar o acesso a um sistema após uma má configuração de auditoria.

- `AUDIT_ADMIN`

  Habilita a configuração do log de auditoria. Este privilégio é definido pelo plugin `audit_log`; veja a Seção 8.4.5, “MySQL Enterprise Audit”.

- `BACKUP_ADMIN`

  Habilita a execução da instrução `LOCK INSTANCE FOR BACKUP` e o acesso à tabela do Schema de Desempenho `log_status`.

  Nota

  Além do `BACKUP_ADMIN`, o privilégio `SELECT` na tabela `log_status` também é necessário para seu acesso.

  O privilégio `BACKUP_ADMIN` é concedido automaticamente aos usuários com o privilégio `RELOAD` ao realizar uma atualização local para o MySQL 8.0 a partir de uma versão anterior.

- `AUTHENTICATION_POLICY_ADMIN` (adicionado no MySQL 8.0.27)

  A variável de sistema `authentication_policy` estabelece certas restrições sobre como as cláusulas relacionadas à autenticação das instruções `CREATE USER` e `ALTER USER` podem ser usadas. Um usuário que possui o privilégio `AUTHENTICATION_POLICY_ADMIN` não está sujeito a essas restrições. (Um aviso é exibido para instruções que, de outra forma, não seriam permitidas.)

  Para obter detalhes sobre as restrições impostas por `authentication_policy`, consulte a descrição dessa variável.

- `BINLOG_ADMIN`

  Habilita o controle do log binário por meio das instruções `PURGE BINARY LOGS` e `BINLOG`.

- `BINLOG_ENCRYPTION_ADMIN`

  Permite definir a variável de sistema `binlog_encryption`, que ativa ou desativa a criptografia para arquivos de log binários e arquivos de log de retransmissão. Essa capacidade não é fornecida pelos privilégios `BINLOG_ADMIN`, `SYSTEM_VARIABLES_ADMIN` ou `SESSION_VARIABLES_ADMIN`. A variável de sistema relacionada `binlog_rotate_encryption_master_key_at_startup`, que rotação da chave mestre de log binário automaticamente quando o servidor é reiniciado, não requer este privilégio.

- `CLONE_ADMIN`

  Habilita a execução das instruções `CLONE`. Inclui os privilégios `BACKUP_ADMIN` e `SHUTDOWN`.

- `CONNECTION_ADMIN`

  Permite o uso da instrução `KILL` ou do comando **mysqladmin kill** para matar threads pertencentes a outras contas. (Uma conta sempre pode matar suas próprias threads.)

  Permite definir variáveis de sistema relacionadas às conexões do cliente ou contornar restrições relacionadas às conexões do cliente. A partir do MySQL 8.0.31, é necessário `CONNECTION_ADMIN` para ativar o modo offline do MySQL Server, o que é feito alterando o valor da variável de sistema `offline_mode` para `ON`.

  O privilégio `CONNECTION_ADMIN` permite que os administradores o utilizem para contornar os efeitos dessas variáveis do sistema:

  - `init_connect`: O servidor não executa o conteúdo da variável de sistema `init_connect` quando os clientes `CONNECTION_ADMIN` se conectam.

  - `max_connections`: O servidor aceita uma conexão de um cliente `CONNECTION_ADMIN` mesmo que o limite de conexões configurado pela variável de sistema `max_connections` seja atingido.

  - `offline_mode`: Um servidor em modo offline (`offline_mode` ativado) não encerra as conexões do cliente `CONNECTION_ADMIN` na próxima solicitação do cliente e aceita novas conexões de clientes `CONNECTION_ADMIN`.

  - `read_only`: As atualizações dos clientes do `CONNECTION_ADMIN` podem ser realizadas mesmo quando a variável de sistema `read_only` está habilitada. Isso se aplica a atualizações explícitas de tabelas e a declarações de gerenciamento de contas, como `GRANT` e `REVOKE`, que atualizam tabelas de forma implícita.

  Os membros do grupo de replicação em grupo precisam do privilégio `CONNECTION_ADMIN` para que as conexões de replicação em grupo não sejam encerradas se um dos servidores envolvidos for colocado no modo offline. Se a pilha de comunicação MySQL estiver em uso (`group_replication_communication_stack = MYSQL`), sem esse privilégio, um membro colocado no modo offline é expulso do grupo.

- `ENCRYPTION_KEY_ADMIN`

  Habilita a rotação da chave de criptografia `InnoDB`.

- `FIREWALL_ADMIN`

  Permite que um usuário administre regras de firewall para qualquer usuário. Esse privilégio é definido pelo plugin `MYSQL_FIREWALL`; veja a Seção 8.4.7, “Firewall Empresarial MySQL”.

- `FIREWALL_EXEMPT` (adicionado no MySQL 8.0.27)

  Um usuário com esse privilégio está isento das restrições do firewall. Esse privilégio é definido pelo plugin `MYSQL_FIREWALL`; veja a Seção 8.4.7, “Firewall Empresarial MySQL”.

- `FIREWALL_USER`

  Permite que os usuários atualizem suas próprias regras de firewall. Esse privilégio é definido pelo plugin `MYSQL_FIREWALL`; veja a Seção 8.4.7, “Firewall Empresarial MySQL”.

- `FLUSH_OPTIMIZER_COSTS` (adicionado no MySQL 8.0.23)

  Habilita o uso da declaração `FLUSH OPTIMIZER_COSTS`.

- `FLUSH_STATUS` (adicionado no MySQL 8.0.23)

  Habilita o uso da declaração `FLUSH STATUS`.

- `FLUSH_TABLES` (adicionado no MySQL 8.0.23)

  Habilita o uso da declaração `FLUSH TABLES`.

- `FLUSH_USER_RESOURCES` (adicionado no MySQL 8.0.23)

  Habilita o uso da declaração `FLUSH USER_RESOURCES`.

- `GROUP_REPLICATION_ADMIN`

  Permite que a conta inicie e pare a Replicação em Grupo usando as instruções `START GROUP REPLICATION` e `STOP GROUP REPLICATION`, para alterar o ajuste global para a variável de sistema `group_replication_consistency` e para usar as funções `group_replication_set_write_concurrency()` e `group_replication_set_communication_protocol()`. Concede este privilégio às contas que são usadas para administrar servidores que são membros de um grupo de replicação.

- `GROUP_REPLICATION_STREAM`

  Permite que uma conta de usuário seja usada para estabelecer as conexões de comunicação de grupo da Replicação em Grupo. Deve ser concedida a um usuário de recuperação quando a pilha de comunicação MySQL for usada para a Replicação em Grupo (`group_replication_communication_stack=MYSQL`).

- `INNODB_REDO_LOG_ARCHIVE`

  Permite que a conta ative e desative o arquivamento do log de refazer.

- `INNODB_REDO_LOG_ENABLE`

  Permite o uso da instrução `ALTER INSTANCE {ENABLE|DISABLE} INNODB REDO_LOG` para habilitar ou desabilitar o registro de rollback. Introduzido no MySQL 8.0.21.

  Veja Desativar o registro de refazer.

- `MASKING_DICTIONARIES_ADMIN`

  Permite que a conta adicione e remova termos do dicionário usando as funções de componentes `masking_dictionary_term_add()` e `masking_dictionary_term_remove()`. As contas também exigem esse privilégio dinâmico para remover um dicionário completo usando a função `masking_dictionary_remove()`, que remove todos os termos associados ao dicionário nomeado atualmente na tabela `mysql.masking_dictionaries`.

  Consulte a Seção 8.5, “Mascagem e Desidentificação de Dados da MySQL Enterprise”.

- `NDB_STORED_USER`

  Permite que o usuário ou o papel e seus privilégios sejam compartilhados e sincronizados entre todos os servidores MySQL habilitados para `NDB` assim que eles se juntarem a um determinado NDB Cluster. Esse privilégio está disponível apenas se o mecanismo de armazenamento `NDB` estiver habilitado.

  Quaisquer alterações ou revogações de privilégios feitas para o usuário ou papel específico são sincronizadas imediatamente com todos os servidores MySQL (nós SQL) conectados. Você deve estar ciente de que não há garantia de que múltiplas declarações que afetam os privilégios originadas de diferentes nós SQL sejam executadas em todos os nós SQL na mesma ordem. Por essa razão, é altamente recomendável que toda a administração de usuários seja feita a partir de um único nó SQL designado.

  `NDB_STORED_USER` é um privilégio global e deve ser concedido ou revogado usando `ON *.*`. Tentar definir qualquer outro escopo para este privilégio resulta em um erro. Este privilégio pode ser concedido à maioria dos usuários de aplicativos e administrativos, mas não pode ser concedido a contas reservadas do sistema, como `mysql.session@localhost` ou `mysql.infoschema@localhost`.

  Um usuário que recebeu o privilégio `NDB_STORED_USER` é armazenado em `NDB` (e, portanto, compartilhado por todos os nós do SQL), assim como um papel com esse privilégio. Um usuário que recebeu apenas um papel com o privilégio `NDB_STORED_USER` *não* é armazenado em `NDB`; cada usuário armazenado em `NDB` deve receber o privilégio explicitamente.

  Para obter informações mais detalhadas sobre como isso funciona em `NDB`, consulte a Seção 25.6.13, “Sincronização de privilégios e NDB\_STORED\_USER”.

  O privilégio `NDB_STORED_USER` está disponível a partir do NDB 8.0.18.

- `PASSWORDLESS_USER_ADMIN` (adicionado no MySQL 8.0.27)

  Este privilégio se aplica a contas de usuários sem senha:

  - Para a criação de uma conta, um usuário que executa `CREATE USER` para criar uma conta sem senha deve possuir o privilégio `PASSWORDLESS_USER_ADMIN`.

  - No contexto de replicação, o privilégio `PASSWORDLESS_USER_ADMIN` se aplica aos usuários de replicação e permite a replicação de instruções `ALTER USER ... MODIFY` para contas de usuário configuradas para autenticação sem senha.

  Para obter informações sobre autenticação sem senha, consulte Autenticação sem Senha FIDO.

- `PERSIST_RO_VARIABLES_ADMIN`

  Para usuários que também têm `SYSTEM_VARIABLES_ADMIN`, `PERSIST_RO_VARIABLES_ADMIN` permite o uso de `SET PERSIST_ONLY` para persistir variáveis de sistema globais no arquivo de opção `mysqld-auto.cnf` no diretório de dados. Esta declaração é semelhante a `SET PERSIST`, mas não modifica o valor da variável de sistema global de tempo de execução. Isso torna `SET PERSIST_ONLY` adequado para configurar variáveis de sistema somente de leitura que podem ser definidas apenas no início do servidor.

  Veja também a Seção 7.1.9.1, “Privilégios de Variáveis do Sistema”.

- `REPLICATION_APPLIER`

  Habilita a conta a atuar como o `PRIVILEGE_CHECKS_USER` para um canal de replicação e a executar instruções `BINLOG` na saída do **mysqlbinlog**. Conceda este privilégio às contas atribuídas usando `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou `CHANGE MASTER TO` (antes do MySQL 8.0.23) para fornecer um contexto de segurança para os canais de replicação e para lidar com erros de replicação nesses canais. Além do privilégio `REPLICATION_APPLIER`, você também deve dar à conta os privilégios necessários para executar as transações recebidas pelo canal de replicação ou contidas na saída do **mysqlbinlog**, por exemplo, para atualizar as tabelas afetadas. Para obter mais informações, consulte a Seção 19.3.3, “Verificação de Privilégios de Replicação”.

- `REPLICATION_SLAVE_ADMIN`

  Habilita a conta a se conectar ao servidor de origem da replicação, iniciar e parar a replicação usando as instruções `START REPLICA` e `STOP REPLICA` e usar a instrução `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a instrução `CHANGE MASTER TO` (antes do MySQL 8.0.23) e as instruções `CHANGE REPLICATION FILTER`. Conceda este privilégio às contas que são usadas pelas réplicas para se conectarem ao servidor atual como seu servidor de origem da replicação. Este privilégio não se aplica à Replicação por Grupo; use `GROUP_REPLICATION_ADMIN` para isso.

- `RESOURCE_GROUP_ADMIN`

  Permite a gestão de grupos de recursos, que inclui a criação, alteração e eliminação de grupos de recursos, bem como a atribuição de threads e declarações a grupos de recursos. Um usuário com este privilégio pode realizar qualquer operação relacionada a grupos de recursos.

- `RESOURCE_GROUP_USER`

  Permite a atribuição de threads e instruções a grupos de recursos. Um usuário com esse privilégio pode usar a instrução `SET RESOURCE GROUP` e a dica de otimização `RESOURCE_GROUP`.

- `ROLE_ADMIN`

  Permite conceder e revogar papéis, usar a cláusula `WITH ADMIN OPTION` da declaração `GRANT` e o conteúdo do elemento `<graphml>` não vazio no resultado da função `ROLES_GRAPHML()`. É necessário definir o valor da variável de sistema `mandatory_roles`.

- `SENSITIVE_VARIABLES_OBSERVER` (adicionado no MySQL 8.0.29)

  Permite que o titular visualize os valores das variáveis de sistema sensíveis nas tabelas do Schema de Desempenho `global_variables`, `session_variables`, `variables_by_thread` e `persisted_variables`, para emitir instruções `SELECT` para retornar seus valores e para rastrear alterações neles nos rastreadores de sessão para conexões. Usuários sem esse privilégio não podem visualizar ou rastrear esses valores das variáveis de sistema. Veja Persistência de Variáveis de Sistema Sensíveis.

- `SERVICE_CONNECTION_ADMIN`

  Permite conexões à interface de rede que permite apenas conexões administrativas (consulte a Seção 7.1.12.1, “Interfaces de Conexão”).

- `SESSION_VARIABLES_ADMIN` (adicionado no MySQL 8.0.14)

  Para a maioria das variáveis do sistema, definir o valor da sessão não requer privilégios especiais e pode ser feito por qualquer usuário para afetar a sessão atual. Para algumas variáveis do sistema, definir o valor da sessão pode ter efeitos fora da sessão atual e, portanto, é uma operação restrita. Para essas, o privilégio `SESSION_VARIABLES_ADMIN` permite que o usuário defina o valor da sessão.

  Se uma variável de sistema estiver restringida e exigir um privilégio especial para definir o valor da sessão, a descrição da variável indica essa restrição. Exemplos incluem `binlog_format`, `sql_log_bin` e `sql_log_off`.

  Antes do MySQL 8.0.14, quando o `SESSION_VARIABLES_ADMIN` foi adicionado, as variáveis de sistema de sessão restritas só podem ser definidas por usuários que possuem o privilégio `SYSTEM_VARIABLES_ADMIN` ou `SUPER`.

  O privilégio `SESSION_VARIABLES_ADMIN` é um subconjunto dos privilégios `SYSTEM_VARIABLES_ADMIN` e `SUPER`. Um usuário que possui qualquer um desses privilégios também tem permissão para definir variáveis de sessão restritas e, implicitamente, possui `SESSION_VARIABLES_ADMIN`, e não precisa ser concedido explicitamente `SESSION_VARIABLES_ADMIN`.

  Veja também a Seção 7.1.9.1, “Privilégios de Variáveis do Sistema”.

- `SET_USER_ID`

  Permite definir o ID de autorização efetivo ao executar uma visualização ou um programa armazenado. Um usuário com esse privilégio pode especificar qualquer conta como o atributo `DEFINER` de uma visualização ou um programa armazenado. Os programas armazenados são executados com os privilégios da conta especificada, portanto, certifique-se de seguir as diretrizes de minimização de riscos listadas na Seção 27.6, “Controle de Acesso a Objetos Armazenados”.

  A partir do MySQL 8.0.22, `SET_USER_ID` também permite a supressão de verificações de segurança projetadas para impedir operações que (provavelmente inadvertidamente) causem objetos armazenados a ficarem órfãos ou que causem a adoção de objetos armazenados que estejam atualmente órfãos. Para obter detalhes, consulte Objetos Armazenados Órfãos.

- `SHOW_ROUTINE` (adicionado no MySQL 8.0.20)

  Permite que o usuário acesse definições e propriedades de todas as rotinas armazenadas (procedimentos e funções armazenadas), mesmo aquelas para as quais o usuário não é nomeado como a rotina `DEFINER`. Esse acesso inclui:

  - O conteúdo da tabela do esquema de informações `ROUTINES`.

  - As declarações `SHOW CREATE FUNCTION` e `SHOW CREATE PROCEDURE`.

  - As declarações `SHOW FUNCTION CODE` e `SHOW PROCEDURE CODE`.

  - As declarações `SHOW FUNCTION STATUS` e `SHOW PROCEDURE STATUS`.

  Antes do MySQL 8.0.20, para que um usuário pudesse acessar definições de rotinas que ele não definiu, o usuário precisava ter o privilégio global `SELECT`, que é muito amplo. A partir do 8.0.20, `SHOW_ROUTINE` pode ser concedido como um privilégio com um escopo mais restrito que permite o acesso às definições das rotinas. (Ou seja, um administrador pode revogar o privilégio global `SELECT` de usuários que não precisam dele e conceder `SHOW_ROUTINE` em vez disso.) Isso permite que uma conta faça backup de rotinas armazenadas sem exigir um privilégio amplo.

- `SKIP_QUERY_REWRITE` (adicionado no MySQL 8.0.31)

  As consultas emitidas por um usuário com este privilégio não estão sujeitas a serem reescritas pelo plugin `Rewriter` (veja a Seção 7.6.4, “O Plugin de Reescrita de Consultas”).

  Esse privilégio deve ser concedido aos usuários que emitem declarações administrativas ou de controle que não devem ser reescritas, bem como às contas `PRIVILEGE_CHECKS_USER` (consulte a Seção 19.3.3, “Verificação de Privilégios de Replicação”) usadas para aplicar declarações de uma fonte de replicação.

- `SYSTEM_USER` (adicionado no MySQL 8.0.16)

  O privilégio `SYSTEM_USER` distingue os usuários do sistema dos usuários comuns:

  - Um usuário com o privilégio `SYSTEM_USER` é um usuário do sistema.

  - Um usuário sem o privilégio `SYSTEM_USER` é um usuário comum.

  O privilégio `SYSTEM_USER` tem um efeito nas contas às quais um usuário específico pode aplicar seus outros privilégios, bem como se o usuário está protegido de outras contas:

  - Um usuário do sistema pode modificar tanto contas de sistema quanto contas regulares. Ou seja, um usuário que tenha os privilégios apropriados para realizar uma determinada operação em contas regulares é habilitado pela posse de `SYSTEM_USER` para realizar a operação também em contas de sistema. Uma conta de sistema só pode ser modificada por usuários do sistema com privilégios apropriados, e não por usuários regulares.

  - Um usuário comum com privilégios apropriados pode modificar contas comuns, mas não contas de sistema. Uma conta comum pode ser modificada tanto por usuários comuns quanto por usuários do sistema com privilégios apropriados.

  Isso também significa que os objetos de banco de dados criados por usuários com o privilégio `SYSTEM_USER` não podem ser modificados ou excluídos por usuários sem esse privilégio. Isso também se aplica a rotinas para as quais o definidor tenha esse privilégio.

  Para mais informações, consulte a Seção 8.2.11, “Categorias de Conta”.

  A proteção contra modificações por contas regulares que é concedida às contas de sistema pelo privilégio `SYSTEM_USER` não se aplica a contas regulares que possuem privilégios no esquema de sistema `mysql` e, portanto, podem modificar diretamente as tabelas de concessão nesse esquema. Para proteção total, não conceda privilégios de esquema `mysql` a contas regulares. Veja Protegendo Contas de Sistema Contra Manipulação por Contas Regulares.

  Se o plugin `audit_log` estiver em uso (consulte a Seção 8.4.5, “Auditoramento do MySQL Enterprise”), a partir do MySQL 8.0.28, as contas com o privilégio `SYSTEM_USER` recebem automaticamente o privilégio `AUDIT_ABORT_EXEMPT`, que permite que suas consultas sejam executadas mesmo que um item “abort” configurado no filtro as bloqueie. As contas com o privilégio `SYSTEM_USER` podem, portanto, ser usadas para recuperar o acesso a um sistema após uma má configuração de auditoria.

- `SYSTEM_VARIABLES_ADMIN`

  Afeta as seguintes operações e comportamentos do servidor:

  - Permite alterações de variáveis do sistema em tempo de execução:

    - Permite que as alterações de configuração do servidor sejam aplicadas às variáveis do sistema global com `SET GLOBAL` e `SET PERSIST`.

    - Permite que as alterações de configuração do servidor sejam aplicadas às variáveis do sistema global com `SET PERSIST_ONLY`, desde que o usuário também tenha `PERSIST_RO_VARIABLES_ADMIN`.

    - Permite definir variáveis de sistema de sessão restritas que exigem um privilégio especial. Na prática, `SYSTEM_VARIABLES_ADMIN` implica em `SESSION_VARIABLES_ADMIN` sem conceder explicitamente `SESSION_VARIABLES_ADMIN`.

    Veja também a Seção 7.1.9.1, “Privilégios de Variáveis do Sistema”.

  - Permite alterações nas características de transações globais (consulte a Seção 15.3.7, "Instrução SET TRANSACTION").

- `TABLE_ENCRYPTION_ADMIN` (adicionado no MySQL 8.0.16)

  Permite que o usuário substitua as configurações de criptografia padrão quando o `table_encryption_privilege_check` estiver ativado; veja Definindo um padrão de criptografia para esquemas e tabelas gerais.

- `TELEMETRY_LOG_ADMIN`

  Habilita a configuração do log de telemetria. Esse privilégio é definido pelo plugin `telemetry_log`, que é implantado através do MySQL HeatWave na AWS.

- `TP_CONNECTION_ADMIN`

  Permite a conexão com o servidor com uma conexão privilegiada. Quando o limite definido por `thread_pool_max_transactions_limit` for atingido, novas conexões não serão permitidas. Uma conexão privilegiada ignora o limite de transação e permite a conexão com o servidor para aumentar o limite de transação, remover o limite ou interromper transações em execução. Esse privilégio não é concedido a nenhum usuário por padrão. Para estabelecer uma conexão privilegiada, o usuário que inicia a conexão deve ter o privilégio `TP_CONNECTION_ADMIN`.

  Uma conexão privilegiada pode executar instruções e iniciar transações quando o limite definido por `thread_pool_max_transactions_limit` for atingido. Uma conexão privilegiada é colocada no grupo de threads `Admin`. Consulte Conexões Privilegiadas.

- `VERSION_TOKEN_ADMIN`

  Habilita a execução das funções dos Tokens de Versão. Este privilégio é definido pelo plugin `version_tokens`; veja a Seção 7.6.6, “Tokens de Versão”.

- `XA_RECOVER_ADMIN`

  Habilita a execução da instrução `XA RECOVER`; veja a Seção 15.3.8.1, “Instruções SQL de Transação XA”.

  Antes do MySQL 8.0, qualquer usuário poderia executar a instrução `XA RECOVER` para descobrir os valores do XID para transações preparadas XA pendentes, o que poderia levar ao commit ou rollback de uma transação XA por um usuário diferente daquele que a iniciou. No MySQL 8.0, `XA RECOVER` é permitido apenas para usuários que têm o privilégio `XA_RECOVER_ADMIN`, que deve ser concedido apenas a usuários administrativos que precisem dele. Esse pode ser o caso, por exemplo, para administradores de um aplicativo XA se ele falhar e for necessário encontrar transações pendentes iniciadas pelo aplicativo para que possam ser desfeitas. Essa exigência de privilégio impede que os usuários descubram os valores do XID para transações preparadas XA pendentes que não sejam as suas. Isso não afeta o commit ou rollback normais de uma transação XA, porque o usuário que a iniciou conhece seu XID.

#### Diretrizes de concessão de privilégios

É uma boa ideia conceder a uma conta apenas os privilégios que ela precisa. Você deve ter cuidado especial ao conceder os privilégios `FILE` e administrativos:

- `FILE` pode ser abusado para ler em uma tabela de banco de dados quaisquer arquivos que o servidor MySQL possa ler no host do servidor. Isso inclui todos os arquivos que podem ser lidos por qualquer pessoa no mundo e arquivos no diretório de dados do servidor. A tabela pode então ser acessada usando `SELECT` para transferir seu conteúdo para o host do cliente.

- O `GRANT OPTION` permite que os usuários atribuam seus privilégios a outros usuários. Dois usuários que têm privilégios diferentes e com o privilégio `GRANT OPTION` podem combinar os privilégios.

- `ALTER` pode ser usado para reverter o sistema de privilégios renomeando tabelas.

- `SHUTDOWN` pode ser abusado para negar o serviço a outros usuários por completo, ao encerrar o servidor.

- `PROCESS` pode ser usado para visualizar o texto simples das instruções atualmente em execução, incluindo instruções que definem ou alteram senhas.

- `SUPER` pode ser usado para encerrar outras sessões ou alterar a forma como o servidor opera.

- Os privilégios concedidos para o próprio banco de dados do sistema `mysql` podem ser usados para alterar senhas e outras informações de privilégios de acesso:

  - As senhas são armazenadas criptografadas, portanto, um usuário malicioso não pode simplesmente lê-las para saber a senha em texto simples. No entanto, um usuário com acesso de escrita à tabela do sistema `mysql.user` e à coluna `authentication_string` pode alterar a senha de uma conta e, em seguida, se conectar ao servidor MySQL usando essa conta.

  - `INSERT` ou `UPDATE` concedidos para o banco de dados do sistema `mysql` permitem que um usuário adicione privilégios ou modifique privilégios existentes, respectivamente.

  - O `DROP` para o banco de dados do sistema `mysql` permite que um usuário remova tabelas de privilégios ou até mesmo o próprio banco de dados.

#### Privilégios estáticos versus dinâmicos

O MySQL suporta privilégios estáticos e dinâmicos:

- Os privilégios estáticos são incorporados ao servidor. Eles estão sempre disponíveis para serem concedidos às contas de usuário e não podem ser desativados.

- Os privilégios dinâmicos podem ser registrados e desregistrados em tempo de execução. Isso afeta sua disponibilidade: um privilégio dinâmico que não foi registrado não pode ser concedido.

Por exemplo, os privilégios `SELECT` e `INSERT` são estáticos e sempre disponíveis, enquanto um privilégio dinâmico só fica disponível se o componente que o implementa tiver sido habilitado.

O restante desta seção descreve como os privilégios dinâmicos funcionam no MySQL. A discussão utiliza o termo “componentes”, mas se aplica igualmente a plugins.

Nota

Os administradores de servidores devem estar cientes de quais componentes do servidor definem privilégios dinâmicos. Para as distribuições do MySQL, a documentação dos componentes que definem privilégios dinâmicos descreve esses privilégios.

Componentes de terceiros também podem definir privilégios dinâmicos; um administrador deve entender esses privilégios e não instalar componentes que possam causar conflitos ou comprometer o funcionamento do servidor. Por exemplo, um componente entra em conflito com outro se ambos definirem um privilégio com o mesmo nome. Os desenvolvedores de componentes podem reduzir a probabilidade dessa ocorrência escolhendo nomes de privilégios com um prefixo baseado no nome do componente.

O servidor mantém o conjunto de privilégios dinâmicos registrados internamente na memória. A desregistração ocorre ao desligar o servidor.

Normalmente, um componente que define privilégios dinâmicos os registra quando é instalado, durante sua sequência de inicialização. Quando desinstalado, um componente não desregistra seus privilégios dinâmicos registrados. (Essa é a prática atual, não um requisito. Ou seja, os componentes podem, mas não desregistram, a qualquer momento, os privilégios que registram.)

Não há aviso ou erro para tentativas de registrar um privilégio dinâmico já registrado. Considere a seguinte sequência de declarações:

```
INSTALL COMPONENT 'my_component';
UNINSTALL COMPONENT 'my_component';
INSTALL COMPONENT 'my_component';
```

A primeira declaração `INSTALL COMPONENT` registra quaisquer privilégios definidos pelo componente `my_component`, mas `UNINSTALL COMPONENT` não os desregistra. Para a segunda declaração `INSTALL COMPONENT`, os privilégios do componente que ela registra são encontrados como já registrados, mas não ocorrem avisos ou erros.

Os privilégios dinâmicos só se aplicam ao nível global. O servidor armazena informações sobre as atribuições atuais de privilégios dinâmicos às contas de usuário na tabela do sistema `mysql.global_grants`:

- O servidor registra automaticamente os privilégios mencionados em `global_grants` durante a inicialização do servidor (a menos que a opção `--skip-grant-tables` seja fornecida).

- As instruções `GRANT` e `REVOKE` modificam o conteúdo de `global_grants`.

- As atribuições de privilégios dinâmicas listadas em `global_grants` são persistentes. Elas não são removidas ao desligar o servidor.

Exemplo: A seguinte declaração concede ao usuário `u1` os privilégios necessários para controlar a replicação (incluindo a replicação de grupo) em uma réplica e para modificar variáveis do sistema:

```
GRANT REPLICATION_SLAVE_ADMIN, GROUP_REPLICATION_ADMIN, BINLOG_ADMIN
ON *.* TO 'u1'@'localhost';
```

Os privilégios dinâmicos concedidos aparecem na saída da declaração `SHOW GRANTS` e da tabela `INFORMATION_SCHEMA` `USER_PRIVILEGES`.

Para `GRANT` e `REVOKE` a nível global, quaisquer privilégios nomeados que não sejam reconhecidos como estáticos são verificados contra o conjunto atual de privilégios dinâmicos registrados e concedidos se forem encontrados. Caso contrário, ocorre um erro para indicar um identificador de privilégio desconhecido.

Para `GRANT` e `REVOKE`, o significado de `ALL [PRIVILEGES]` a nível global inclui todos os privilégios globais estáticos, bem como todos os privilégios dinâmicos atualmente registrados:

- `GRANT ALL` ao nível global concede todos os privilégios globais estáticos e todos os privilégios dinâmicos atualmente registrados. Um privilégio dinâmico registrado após a execução da declaração `GRANT` não é concedido retroativamente a nenhuma conta.

- `REVOKE ALL` ao nível global revoga todos os privilégios globais estáticos concedidos e todos os privilégios dinâmicos concedidos.

A declaração `FLUSH PRIVILEGES` lê a tabela `global_grants` para atribuições dinâmicas de privilégios e registra quaisquer privilégios não registrados encontrados lá.

Para descrições dos privilégios dinâmicos fornecidos pelo MySQL Server e componentes incluídos nas distribuições do MySQL, consulte a Seção 8.2.2, “Privilégios Fornecidos pelo MySQL”.

#### Migrar contas do SUPER para Privilegios Dinâmicos

No MySQL 8.0, muitas operações que anteriormente exigiam o privilégio `SUPER` também estão associadas a um privilégio dinâmico de escopo mais limitado. (Para descrições desses privilégios, consulte a Seção 8.2.2, “Privilégios Fornecidos pelo MySQL”.) Cada operação pode ser permitida a uma conta concedendo o privilégio dinâmico associado em vez de `SUPER`. Essa mudança melhora a segurança, permitindo que os administradores de banco de dados evitem conceder `SUPER` e personalizem os privilégios dos usuários de forma mais próxima das operações permitidas. `SUPER` está agora desatualizado; espere-o ser removido em uma versão futura do MySQL.

Quando a remoção de `SUPER` ocorrer, as operações que antes exigiam `SUPER` falharão, a menos que as contas concedidas `SUPER` sejam migradas para os privilégios dinâmicos apropriados. Use as instruções a seguir para alcançar esse objetivo, para que as contas estejam prontas antes da remoção de `SUPER`:

1. Execute esta consulta para identificar as contas que têm o `SUPER`:

   ```
   SELECT GRANTEE FROM INFORMATION_SCHEMA.USER_PRIVILEGES
   WHERE PRIVILEGE_TYPE = 'SUPER';
   ```

2. Para cada conta identificada pela consulta anterior, determine as operações para as quais ela precisa do `SUPER`. Em seguida, conceda os privilégios dinâmicos correspondentes a essas operações e revogue o `SUPER`.

   Por exemplo, se `'u1'@'localhost'` exige `SUPER` para a limpeza do log binário e a modificação da variável do sistema, essas instruções fazem as alterações necessárias na conta:

   ```
   GRANT BINLOG_ADMIN, SYSTEM_VARIABLES_ADMIN ON *.* TO 'u1'@'localhost';
   REVOKE SUPER ON *.* FROM 'u1'@'localhost';
   ```

   Depois de modificar todas as contas aplicáveis, a consulta `INFORMATION_SCHEMA` no primeiro passo deve produzir um conjunto de resultados vazio.
