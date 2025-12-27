### 8.2.2 Privilegios Fornecidos pelo MySQL

Os privilégios concedidos a uma conta do MySQL determinam quais operações a conta pode realizar. Os privilégios do MySQL diferem nos contextos em que se aplicam e em diferentes níveis de operação:

* Os privilégios administrativos permitem que os usuários gerenciem a operação do servidor MySQL. Esses privilégios são globais porque não são específicos de um banco de dados particular.

* Os privilégios de banco de dados se aplicam a um banco de dados e a todos os objetos dentro dele. Esses privilégios podem ser concedidos para bancos de dados específicos ou globalmente para que se apliquem a todos os bancos de dados.

* Os privilégios para objetos de banco de dados, como tabelas, índices, visualizações e rotinas armazenadas, podem ser concedidos para objetos específicos dentro de um banco de dados, para todos os objetos de um determinado tipo dentro de um banco de dados (por exemplo, todas as tabelas em um banco de dados) ou globalmente para todos os objetos de um determinado tipo em todos os bancos de dados.

Os privilégios também diferem em termos de serem estáticos (integrados ao servidor) ou dinâmicos (definidos em tempo de execução). Se um privilégio é estático ou dinâmico afeta sua disponibilidade para ser concedido a contas de usuário e papéis. Para informações sobre as diferenças entre privilégios estáticos e dinâmicos, consulte Privilegios Estáticos versus Dinâmicos.)

As informações sobre os privilégios da conta são armazenadas nas tabelas de concessão no banco de dados do sistema `mysql`. Para uma descrição da estrutura e conteúdo dessas tabelas, consulte a Seção 8.2.3, “Tabelas de Concessão”. O servidor MySQL lê o conteúdo das tabelas de concessão na memória quando ele é iniciado e os recarrega nas circunstâncias indicadas na Seção 8.2.13, “Quando os Privilegios Mudam de Efeito”. O servidor baseia as decisões de controle de acesso nas cópias em memória das tabelas de concessão.

Importante

Algumas versões do MySQL introduzem alterações nas tabelas de concessão para adicionar novos privilégios ou recursos. Para garantir que você possa aproveitar quaisquer novas funcionalidades, atualize suas tabelas de concessão para a estrutura atual sempre que atualizar o MySQL. Veja o Capítulo 3, *Atualizando o MySQL*.

As seções a seguir resumem os privilégios disponíveis, fornecem descrições mais detalhadas de cada privilégio e oferecem diretrizes de uso.

* Resumo dos Privilegios Disponíveis
* Descrições Estáticas de Privilegios
* Descrições Dinâmicas de Privilegios
* Diretrizes de Concessão de Privilegios
* Privilegios Estáticos versus Privilegios Dinâmicos
* Migrando Contas de SUPER para Privilegios Dinâmicos

<table><col style="width: 30%"/><col style="width: 33%"/><col style="width: 37%"/><thead><tr> <th scope="col">Privilegio</th> <th scope="col">Coluna da Tabela de Contexto</th> <th scope="col">Contexto</th> </tr></thead><tbody><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_all"><code class="literal">ALL [PRIVILEGES]</code></a></th> <td>Símbolo de <span class="quote">“<span class="quote">todas as privilégios</span>”</span></td> <td>Administração do servidor</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_alter"><code class="literal">ALTER</code></a></th> <td><code class="literal">Alter_priv</code></td> <td>Tabelas</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_alter-routine"><code class="literal">ALTER ROUTINE</code></a></th> <td><code class="literal">Alter_routine_priv</code></td> <td>Rotinas armazenadas</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_create"><code class="literal">CREATE</code></a></th> <td><code class="literal">Create_priv</code></td> <td>Bases de dados, tabelas ou índices</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_create-role"><code class="literal">CREATE ROLE</code></a></th> <td><code class="literal">Create_role_priv</code></td> <td>Administração do servidor</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_create-routine"><code class="literal">CREATE ROUTINE</code></a></th> <td><code class="literal">Create_routine_priv</code></td> <td>Rotinas armazenadas</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_create-tablespace"><code class="literal">CREATE TABLESPACE</code></a></th> <td><code class="literal">Create_tablespace_priv</code></td> <td>Administração do servidor</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_create-temporary-tables"><code class="literal">CREATE TEMPORARY TABLES</code></a></th> <td><code class="literal">Create_tmp_table_priv</code></td> <td>Tabelas</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_create-user"><code class="literal">CREATE USER</code></a></th> <td><code class="literal">Create_user_priv</code></td> <td>Administração do servidor</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_create-view"><code class="literal">CREATE VIEW</code></a></th> <td><code class="literal">Create_view_priv</code></td> <td>Visões</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_delete"><code class="literal">DELETE</code></a></th> <td><code class="literal">Delete_priv</code></td> <td>Tabelas</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_drop"><code class="literal">DROP</code></a></th> <td><code class="literal">Drop_priv</code></td> <td>Bases de dados, tabelas ou visões</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_drop-role"><code class="literal">DROP ROLE</code></a></th> <td><code class="literal">Drop_role_priv</code></td> <td>Administração do servidor</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_event"><code class="literal">EVENT</code></a></th> <td><code class="literal">Event_priv</code></td> <td>Bases de dados</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_execute"><code class="literal">EXECUTE</code></a></th> <td><code class="literal">Execute_priv</code></td> <td>Rotinas armazenadas</td> </tr><tr> <th scope="row"><a class

A tabela a seguir mostra os nomes de privilégios dinâmicos usados nas instruções `GRANT` e `REVOKE`, juntamente com o contexto em que o privilégio se aplica.

**Tabela 8.3 Privilégios Dinâmicos Permitidos para GRANT e REVOKE**

<table><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Privilegio</th> <th>Contexto</th> </tr></thead><tbody><tr> <td><a class="link" href="privileges-provided.html#priv_allow-nonexistent-definer"><code class="literal">ALLOW_NONEXISTENT_DEFINER</code></a></td> <td>Proteção de objeto órfão</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_application-password-admin"><code class="literal">APPLICATION_PASSWORD_ADMIN</code></a></td> <td>Administração de senha dupla</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_audit-abort-exempt"><code class="literal">AUDIT_ABORT_EXEMPT</code></a></td> <td>Permitir consultas bloqueadas pelo filtro do log de auditoria</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_audit-admin"><code class="literal">AUDIT_ADMIN</code></a></td> <td>Administração do log de auditoria</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_authentication-policy-admin"><code class="literal">AUTHENTICATION_POLICY_ADMIN</code></a></td> <td>Administração de autenticação</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_backup-admin"><code class="literal">BACKUP_ADMIN</code></a></td> <td>Administração de backup</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_binlog-admin"><code class="literal">BINLOG_ADMIN</code></a></td> <td>Administração de backup e replicação</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_binlog-encryption-admin"><code class="literal">BINLOG_ENCRYPTION_ADMIN</code></a></td> <td>Administração de criptografia de backup e replicação</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_clone-admin"><code class="literal">CLONE_ADMIN</code></a></td> <td>Administração de clone</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_connection-admin"><code class="literal">CONNECTION_ADMIN</code></a></td> <td>Administração do servidor</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_create-spatial-reference-system"><code class="literal">CREATE_SPATIAL_REFERENCE_SYSTEM</code></a></td> <td>Administração de SIG</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_encryption-key-admin"><code class="literal">ENCRYPTION_KEY_ADMIN</code></a></td> <td>Administração de servidor</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_export-query-results"><code class="literal">EXPORT_QUERY_RESULTS</code></a></td> <td>Permitir que o usuário exporte resultados de consulta</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_firewall-admin"><code class="literal">FIREWALL_ADMIN</code></a></td> <td>Administração do firewall</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_firewall-exempt"><code class="literal">FIREWALL_EXEMPT</code></a></td> <td>Administração do firewall (desatualizado)</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_firewall-user"><code class="literal">FIREWALL_USER</code></a></td> <td>Administração do firewall (desatualizado)</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_flush-optimizer-costs"><code class="literal">FLUSH_OPTIMIZER_COSTS</code></a></td> <td>Administração do servidor</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_flush-privileges"><code class="literal">FLUSH_PRIVILEGES</code></a> (Desatualizado)</td> <td>Administração do servidor</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_flush-status"><code class="literal">FLUSH_STATUS</code></a></td> <td>Administração do servidor</td>

#### Descrições de Privilégios Estáticos

Os privilégios estáticos são incorporados ao servidor, em contraste com os privilégios dinâmicos, que são definidos em tempo de execução. A lista a seguir descreve cada privilégio estático disponível no MySQL.

Algumas instruções SQL específicas podem ter requisitos de privilégio mais específicos do que os indicados aqui. Se assim for, a descrição da instrução em questão fornece os detalhes.

* `ALL`, `ALL PRIVILEGES`

  Esses especifadores de privilégio são abreviações para “todos os privilégios disponíveis em um determinado nível de privilégio” (exceto `GRANT OPTION`). Por exemplo, conceder `ALL` no nível global ou de tabela concede todos os privilégios globais ou todos os privilégios de nível de tabela, respectivamente.

* `ALTER`

  Habilita o uso da instrução `ALTER TABLE` para alterar a estrutura de tabelas. `ALTER TABLE` também requer os privilégios `CREATE` e `INSERT`. Renomear uma tabela requer `ALTER` e `DROP` na tabela antiga, `CREATE` e `INSERT` na nova tabela.

* `ALTER ROUTINE`

  Habilita o uso de instruções que alteram ou excluem rotinas armazenadas (procedimentos armazenados e funções). Para rotinas que estão dentro do escopo em que o privilégio é concedido e para as quais o usuário não é o usuário nomeado como o `DEFINER` da rotina, também habilita o acesso a propriedades da rotina além da definição da rotina.

* `CREATE`

  Habilita o uso de instruções que criam novas bases de dados e tabelas.

* `CREATE ROLE`

  Habilita o uso da instrução `CREATE ROLE`. (O privilégio `CREATE USER` também habilita o uso da instrução `CREATE ROLE`.) Veja a Seção 8.2.10, “Usando Rotulos”.

Os privilégios `CREATE ROLE` e `DROP ROLE` não são tão poderosos quanto os `CREATE USER`, pois só podem ser usados para criar e excluir contas. Eles não podem ser usados como os `CREATE USER` podem, para modificar atributos de contas ou renomear contas. Veja a intercâmbio de usuários e papéis.

* `CREATE ROUTINE`

  Habilita o uso de instruções que criam rotinas armazenadas (procedimentos e funções armazenados). Para rotinas que estão dentro do escopo em que o privilégio é concedido e para as quais o usuário não é o usuário nomeado como o `DEFINER` da rotina, também habilita o acesso a propriedades da rotina além da definição da rotina.

* `CREATE TABLESPACE`

  Habilita o uso de instruções que criam, alteram ou excluem tablespaces e grupos de arquivos de log.

* `CREATE TEMPORARY TABLES`

  Habilita a criação de tabelas temporárias usando a instrução `CREATE TEMPORARY TABLE`.

* `CREATE USER`

  Habilita o uso das instruções `ALTER USER`, `CREATE ROLE`, `CREATE USER`, `DROP ROLE`, `DROP USER`, `RENAME USER` e `REVOKE ALL PRIVILEGES`.

* `CREATE VIEW`

  Habilita o uso da instrução `CREATE VIEW`.

* `DELETE`

  Habilita a exclusão de linhas de tabelas em um banco de dados.

* `DROP`

  Habilita o uso de instruções que excluem (removem) bancos de dados, tabelas e visualizações existentes. O privilégio `DROP` é necessário para usar a instrução `ALTER TABLE ... DROP PARTITION` em uma tabela particionada. O privilégio `DROP` também é necessário para `TRUNCATE TABLE`.

* `DROP ROLE`

Permite o uso da instrução `DROP ROLE`. (O privilégio `CREATE USER` também permite o uso da instrução `DROP ROLE`.) Veja a Seção 8.2.10, “Usando papéis”.

Os privilégios `CREATE ROLE` e `DROP ROLE` não são tão poderosos quanto o `CREATE USER` porque só podem ser usados para criar e excluir contas. Eles não podem ser usados como o `CREATE USER` pode modificar atributos de contas ou renomear contas. Veja Interchangabilidade de Usuário e Papel.

* `EVENT`

  Permite o uso de instruções que criam, alteram, excluem ou exibem eventos para o Agendamento de Eventos.

* `EXECUTE`

  Permite o uso de instruções que executam rotinas armazenadas (procedimentos e funções armazenadas). Para rotinas que estão dentro do escopo em que o privilégio é concedido e para as quais o usuário não é o usuário nomeado como o `DEFINER` da rotina, também permite o acesso a propriedades da rotina além da definição da rotina.

* `FILE`

  Afeta as seguintes operações e comportamentos do servidor:

  + Permite a leitura e a escrita de arquivos no host do servidor usando as instruções `LOAD DATA` e `SELECT ... INTO OUTFILE` e a função `LOAD_FILE()`. Um usuário que tem o privilégio `FILE` pode ler qualquer arquivo no host do servidor que seja legível por todos ou legível pelo servidor MySQL. (Isso implica que o usuário pode ler qualquer arquivo em qualquer diretório de banco de dados, porque o servidor pode acessar qualquer um desses arquivos.)

  + Permite a criação de novos arquivos em qualquer diretório onde o servidor MySQL tenha acesso de escrita. Isso inclui o diretório de dados do servidor que contém os arquivos que implementam as tabelas de privilégio.

  + Permite o uso da opção de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY` para a instrução `CREATE TABLE`.

Como medida de segurança, o servidor não sobrescreve arquivos existentes.

Para limitar a localização em que os arquivos podem ser lidos e escritos, defina a variável de sistema `secure_file_priv` para um diretório específico. Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”.

* `GRANT OPTION`

  Permite que você conceda ou revogue de outros usuários os privilégios que você mesmo possui.

* `INDEX`

  Permite o uso de instruções que criam ou excluem (removem) índices. `INDEX` se aplica a tabelas existentes. Se você tiver o privilégio `CREATE` para uma tabela, pode incluir definições de índices na instrução `CREATE TABLE`.

* `INSERT`

  Permite que linhas sejam inseridas em tabelas de um banco de dados. `INSERT` também é necessário para as instruções de manutenção de tabelas `ANALYZE TABLE`, `OPTIMIZE TABLE` e `REPAIR TABLE`.

* `LOCK TABLES`

  Permite o uso de instruções explícitas `LOCK TABLES` para bloquear tabelas para as quais você tenha o privilégio `SELECT`. Isso inclui o uso de bloqueios de escrita, que impede que outras sessões leiam a tabela bloqueada.

* `PROCESS`

  O privilégio `PROCESS` controla o acesso a informações sobre os threads que estão sendo executados no servidor (ou seja, informações sobre instruções sendo executadas por sessões). As informações sobre os threads disponíveis usando a instrução `SHOW PROCESSLIST`, o comando **mysqladmin processlist**, a tabela `PROCESSLIST` do Schema de Informações e a tabela `processlist` do Schema de Desempenho são acessíveis da seguinte forma:

  + Com o privilégio `PROCESS`, um usuário tem acesso a informações sobre todos os threads, mesmo aqueles pertencentes a outros usuários.

  + Sem o privilégio `PROCESS`, usuários não anônimos têm acesso a informações sobre seus próprios threads, mas não sobre threads de outros usuários, e usuários anônimos não têm acesso às informações sobre threads.

Nota

A tabela do Schema de Desempenho `threads` também fornece informações sobre os threads, mas o acesso à tabela utiliza um modelo de privilégio diferente. Veja a Seção 29.12.22.10, “A tabela threads”.

O privilégio `PROCESS` também permite o uso da instrução `SHOW ENGINE`, o acesso às tabelas do `INFORMATION_SCHEMA` `InnoDB` (tabelas com nomes que começam com `INNODB_`) e o acesso à tabela `INFORMATION_SCHEMA` `FILES`.

* `PROXY`

  Permite que um usuário se identifique como outro usuário ou seja conhecido como outro usuário. Veja a Seção 8.2.19, “Usuários Proxy”.

* `REFERENCES`

  A criação de uma restrição de chave estrangeira requer o privilégio `REFERENCES` para a tabela pai.

* `RELOAD`

  O `RELOAD` permite as seguintes operações:

  + Uso da instrução `FLUSH`.

  + Uso dos comandos do **mysqladmin** que são equivalentes às operações `FLUSH`: `flush-hosts`, `flush-logs`, `flush-privileges`, `flush-status`, `flush-tables`, `refresh` e `reload`.

    O comando `reload` indica ao servidor que recarregue as tabelas de concessão na memória. `flush-privileges` é um sinônimo de `reload`. O comando `refresh` fecha e reabre os arquivos de log e recarga todas as tabelas. Os outros comandos `flush-xxx` realizam funções semelhantes a `refresh`, mas são mais específicos e podem ser preferíveis em algumas situações. Por exemplo, se você quiser recarregar apenas os arquivos de log, `flush-logs` é uma escolha melhor do que `refresh`.

  + Uso das opções do **mysqldump** que realizam várias operações `FLUSH`: `--flush-logs` e `--source-data`.

  + Uso das instruções `RESET BINARY LOGS AND GTIDS` e `RESET REPLICA`.

* `REPLICATION CLIENT`

  Permite o uso das instruções `SHOW BINARY LOG STATUS`, `SHOW REPLICA STATUS` e `SHOW BINARY LOGS`.

* `REPLICATION SLAVE`

Permite que a conta solicite atualizações feitas em bancos de dados no servidor de origem da replicação, usando as instruções `SHOW REPLICAS`, `SHOW RELAYLOG EVENTS` e `SHOW BINLOG EVENTS`. Esse privilégio também é necessário para usar as opções **mysqlbinlog** `--read-from-remote-server` (`-R`) e `--read-from-remote-source`. Conceda esse privilégio às contas que são usadas pelas réplicas para se conectarem ao servidor atual como seu servidor de origem da replicação.

* `SELECT`

  Permite que as linhas sejam selecionadas a partir de tabelas em um banco de dados. As instruções `SELECT` exigem o privilégio `SELECT` apenas se elas realmente acessarem tabelas. Algumas instruções `SELECT` não acessam tabelas e podem ser executadas sem permissão para qualquer banco de dados. Por exemplo, você pode usar `SELECT` como um simples calculador para avaliar expressões que não fazem referência a tabelas:

  ```
  SELECT 1+1;
  SELECT PI()*2;
  ```

  O privilégio `SELECT` também é necessário para outras instruções que leem valores de colunas. Por exemplo, `SELECT` é necessário para colunas referenciadas no lado direito da atribuição `col_name`*=*`expr`* em instruções `UPDATE` ou para colunas nomeadas na cláusula `WHERE` de instruções `DELETE` ou `UPDATE`.

  O privilégio `SELECT` é necessário para tabelas ou visualizações usadas com `EXPLAIN`, incluindo quaisquer tabelas subjacentes nas definições de visualizações.

* `SHOW DATABASES`

  Permite que a conta veja os nomes dos bancos de dados emitindo a instrução `SHOW DATABASE`. Contas que não têm esse privilégio veem apenas os bancos de dados para os quais têm algum privilégio e não podem usar a instrução de forma alguma se o servidor foi iniciado com a opção `--skip-show-database`.

Cuidado

Como qualquer privilégio global estático é considerado um privilégio para todas as bases de dados, qualquer privilégio global estático permite que um usuário veja todos os nomes de bases de dados com o comando `SHOW DATABASES` ou examinando a tabela `SCHEMATA` do `INFORMATION_SCHEMA`, exceto as bases de dados que foram restringidas ao nível da base de dados por revogações parciais.

* `SHOW VIEW`

  Permite o uso do comando `SHOW CREATE VIEW`. Este privilégio também é necessário para vistas usadas com `EXPLAIN`.

* `SHUTDOWN`

  Permite o uso dos comandos `SHUTDOWN` e `RESTART`, do comando **mysqladmin shutdown** e da função C API `mysql_shutdown()`.

* `SUPER`

  `SUPER` é um privilégio poderoso e de grande alcance e não deve ser concedido levemente. Se uma conta precisa realizar apenas um subconjunto das operações de `SUPER`, pode ser possível obter o conjunto de privilégios desejado concedendo em vez disso um ou mais privilégios dinâmicos, cada um dos quais confere capacidades mais limitadas. Veja Descrições de Privilégios Dinâmicos.

  Nota

  `SUPER` está desatualizado e você deve esperar que ele seja removido em uma versão futura do MySQL. Veja Migrar Contas de `SUPER` para Privilégios Dinâmicos.

  `SUPER` afeta as seguintes operações e comportamentos do servidor:

  + Permite alterações de variáveis de sistema em tempo de execução:

    - Permite alterações na configuração do servidor para variáveis de sistema globais com `SET GLOBAL` e `SET PERSIST`.

      O privilégio dinâmico correspondente é `SYSTEM_VARIABLES_ADMIN`.

    - Permite definir variáveis de sistema de sessão restritas que requerem um privilégio especial.

      O privilégio dinâmico correspondente é `SESSION_VARIABLES_ADMIN`.

  Veja também Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

  + Permite alterações nas características de transação global (veja Seção 15.3.7, “Instrução SET TRANSACTION”).

O privilégio dinâmico correspondente é `SYSTEM_VARIABLES_ADMIN`.

  + Permite que a conta inicie e pare a replicação, incluindo a replicação em grupo.

    O privilégio dinâmico correspondente é `REPLICATION_SLAVE_ADMIN` para a replicação regular, `GROUP_REPLICATION_ADMIN` para a replicação em grupo.

  + Permite o uso das instruções `ALTER REPLICATION SOURCE` e `ALTER REPLICATION FILTER`.

    O privilégio dinâmico correspondente é `REPLICATION_SLAVE_ADMIN`.

  + Permite o controle do log binário por meio das instruções `PURGE BINARY LOGS` e `BINLOG`.

    O privilégio dinâmico correspondente é `BINLOG_ADMIN`.

  + Permite definir o ID de autorização efetivo ao executar uma visualização ou um programa armazenado. Um usuário com este privilégio pode especificar qualquer conta no atributo `DEFINER` de uma visualização ou um programa armazenado.

    Os privilégios dinâmicos correspondentes são `SET_ANY_DEFINER` e `ALLOW_NONEXISTENT_DEFINER`.

  + Permite o uso das instruções `CREATE SERVER`, `ALTER SERVER` e `DROP SERVER`.

  + Permite o uso do comando **mysqladmin debug**.

  + Permite a rotação da chave de criptografia do **InnoDB**.

    O privilégio dinâmico correspondente é `ENCRYPTION_KEY_ADMIN`.

  + Permite a execução de funções de Tokens de Versão obsoletas.

    O privilégio dinâmico correspondente é `VERSION_TOKEN_ADMIN`, que está obsoleto.

  + Permite a concessão e revogação de papéis, o uso da cláusula `WITH ADMIN OPTION` da instrução `GRANT` e o conteúdo de um elemento `<graphml>` não vazio no resultado da função `ROLES_GRAPHML()`.

    O privilégio dinâmico correspondente é `ROLE_ADMIN`.

  + Permite o controle sobre as conexões do cliente que não são permitidas para contas não `SUPER`:

- Permite o uso da instrução `KILL` ou do comando `mysqladmin kill` para matar threads pertencentes a outras contas. (Uma conta pode sempre matar suas próprias threads.)

- O servidor não executa o conteúdo da variável de sistema `init_connect` quando clientes `SUPER` se conectam.

- O servidor aceita uma conexão de um cliente `SUPER` mesmo que o limite de conexões configurado pela variável de sistema `max_connections` seja atingido.

- Um servidor em modo offline (`offline_mode` habilitado) não encerra as conexões de clientes `SUPER` na próxima solicitação de cliente e aceita novas conexões de clientes `SUPER`.

- As atualizações podem ser realizadas mesmo quando a variável de sistema `read_only` está habilitada. Isso se aplica a atualizações explícitas de tabelas e ao uso de declarações de gerenciamento de contas, como `GRANT` e `REVOKE`, que atualizam tabelas implicitamente.

O privilégio dinâmico correspondente para as operações de controle de conexão anteriores é `CONNECTION_ADMIN`.

Você também pode precisar do privilégio `SUPER` para criar ou alterar funções armazenadas se o registro binário estiver habilitado, conforme descrito na Seção 27.9, “Registro Binário de Programas Armazenados”.

* `TRIGGER`

- Permite operações de gatilho. Você deve ter esse privilégio para que uma tabela crie, elimine, execute ou exiba gatilhos para aquela tabela.

- Quando um gatilho é ativado (por um usuário que tem privilégios para executar instruções `INSERT`, `UPDATE` ou `DELETE` para a tabela associada ao gatilho), a execução do gatilho requer que o usuário que definiu o gatilho ainda tenha o privilégio `TRIGGER` para a tabela.

* `UPDATE`

- Permite que as linhas sejam atualizadas em tabelas de um banco de dados.

* `USAGE`

Este especificador de privilégio significa "sem privilégios". Ele é usado no nível global com `GRANT` para especificar cláusulas como `WITH GRANT OPTION` sem nomear privilégios específicos da conta na lista de privilégios. `SHOW GRANTS` exibe `USAGE` para indicar que uma conta não tem privilégios em um nível de privilégio.

#### Descrições Dinâmicas de Privilégios

Os privilégios dinâmicos são definidos em tempo de execução, em contraste com os privilégios estáticos, que são incorporados ao servidor. A lista a seguir descreve cada privilégio dinâmico disponível no MySQL.

A maioria dos privilégios dinâmicos é definida no início do servidor. Outros são definidos por um componente ou plugin específico, conforme indicado nas descrições de privilégios. Nesses casos, o privilégio não está disponível, a menos que o componente ou plugin que o define esteja habilitado.

Algumas instruções SQL específicas podem ter requisitos de privilégios mais específicos do que o indicado aqui. Se assim for, a descrição da instrução em questão fornece os detalhes.

* `ALLOW_NONEXISTENT_DEFINER`

  Habilita a supressão de verificações de segurança projetadas para prevenir operações que (provavelmente inadvertidamente) causem objetos armazenados a ficarem órfãos ou que causem a adoção de objetos armazenados que estão atualmente órfãos. Sem este privilégio, qualquer tentativa de produzir um procedimento, função ou visão SQL órfã resulta em um erro. Uma tentativa de produzir objetos órfãos usando `CREATE PROCEDURE`, `CREATE FUNCTION`, `CREATE TRIGGER`, `CREATE EVENT` ou `CREATE VIEW` também requer `SET_ANY_DEFINER` além de `ALLOW_NONEXISTENT_DEFINER`, para que um definidor diferente do usuário atual seja permitido.

  Para detalhes, consulte Objetos Armazenados Órfãos.

* `APPLICATION_PASSWORD_ADMIN`

Para a capacidade de usar duas senhas, este privilégio permite o uso das cláusulas `RETAIN CURRENT PASSWORD` e `DISCARD OLD PASSWORD` para as instruções `ALTER USER` e `SET PASSWORD` que se aplicam à sua própria conta. Este privilégio é necessário para manipular sua própria senha secundária, pois a maioria dos usuários requer apenas uma senha.

Se uma conta deve ser permitida para manipular senhas secundárias para todas as contas, ela deve ser concedida o privilégio `CREATE USER` em vez de `APPLICATION_PASSWORD_ADMIN`.

Para mais informações sobre o uso de duas senhas, consulte a Seção 8.2.15, “Gestão de Senhas”.

* `AUDIT_ABORT_EXEMPT`

Permite consultas bloqueadas por um item “abort” no filtro do log de auditoria. Este privilégio é definido pelo plugin `audit_log`; consulte a Seção 8.4.6, “Auditorias do MySQL Enterprise”.

As contas criadas com o privilégio `SYSTEM_USER` têm o privilégio `AUDIT_ABORT_EXEMPT` atribuído automaticamente quando são criadas. O privilégio `AUDIT_ABORT_EXEMPT` também é atribuído às contas existentes com o privilégio `SYSTEM_USER` quando você executa um procedimento de atualização, se nenhuma conta existente tiver esse privilégio atribuído. As contas com o privilégio `SYSTEM_USER` podem, portanto, ser usadas para recuperar o acesso a um sistema após uma má configuração de auditoria.

* `AUDIT_ADMIN`

Habilita a configuração do log de auditoria. Este privilégio é definido pelo plugin `audit_log`; consulte a Seção 8.4.6, “Auditorias do MySQL Enterprise”.

* `BACKUP_ADMIN`

Habilita a execução da instrução `LOCK INSTANCE FOR BACKUP` e o acesso à tabela `log_status` do Schema de Desempenho.

Nota

Além do `BACKUP_ADMIN`, o privilégio `SELECT` na tabela `log_status` também é necessário para seu acesso.

O privilégio `BACKUP_ADMIN` é concedido automaticamente aos usuários com o privilégio `RELOAD` ao realizar uma atualização local para o MySQL 9.5 a partir de uma versão anterior.

* `AUTHENTICATION_POLICY_ADMIN`

  A variável de sistema `authentication_policy` impõe certas restrições sobre como as cláusulas relacionadas à autenticação das instruções `CREATE USER` e `ALTER USER` podem ser usadas. Um usuário que possui o privilégio `AUTHENTICATION_POLICY_ADMIN` não está sujeito a essas restrições. (Um aviso é exibido para instruções que, de outra forma, não seriam permitidas.)

  Para obter detalhes sobre as restrições impostas pela `authentication_policy`, consulte a descrição dessa variável.

* `BINLOG_ADMIN`

  Habilita o controle do log binário por meio das instruções `PURGE BINARY LOGS` e `BINLOG`.

* `BINLOG_ENCRYPTION_ADMIN`

  Habilita a definição da variável de sistema `binlog_encryption`, que ativa ou desativa a criptografia para os arquivos de log binário e os arquivos de log de relevo. Essa capacidade não é fornecida pelos privilégios `BINLOG_ADMIN`, `SYSTEM_VARIABLES_ADMIN` ou `SESSION_VARIABLES_ADMIN`. A variável de sistema relacionada `binlog_rotate_encryption_master_key_at_startup`, que rotação da chave mestre do log binário automaticamente quando o servidor é reiniciado, não requer esse privilégio.

* `CLONE_ADMIN`

  Habilita a execução das instruções `CLONE`. Inclui os privilégios `BACKUP_ADMIN` e `SHUTDOWN`.

* `CONNECTION_ADMIN`

  Habilita o uso da instrução `KILL` ou do comando **mysqladmin kill** para matar threads pertencentes a outras contas. (Uma conta sempre pode matar suas próprias threads.)

Permite definir variáveis de sistema relacionadas às conexões de clientes ou contornar restrições relacionadas às conexões de clientes. O privilégio `CONNECTION_ADMIN` é necessário para ativar o modo offline do MySQL Server, o que é feito alterando o valor da variável de sistema `offline_mode` para `ON`.

O privilégio `CONNECTION_ADMIN` permite que os administradores com ele contornem os efeitos dessas variáveis de sistema:

+ `init_connect`: O servidor não executa o conteúdo da variável de sistema `init_connect` quando os clientes `CONNECTION_ADMIN` se conectam.

+ `max_connections`: O servidor aceita uma conexão de um cliente `CONNECTION_ADMIN` mesmo que o limite de conexões configurado pela variável de sistema `max_connections` seja atingido.

+ `offline_mode`: Um servidor em modo offline (`offline_mode` habilitado) não termina as conexões de clientes `CONNECTION_ADMIN` na próxima solicitação de cliente e aceita novas conexões de clientes `CONNECTION_ADMIN`.

+ `read_only`: As atualizações de clientes `CONNECTION_ADMIN` podem ser realizadas mesmo quando a variável de sistema `read_only` está habilitada. Isso se aplica a atualizações explícitas de tabelas e a declarações de gerenciamento de contas como `GRANT` e `REVOKE` que atualizam tabelas implicitamente.

Os membros do grupo de replicação de grupo precisam do privilégio `CONNECTION_ADMIN` para que as conexões de replicação de grupo não sejam terminadas se um dos servidores envolvidos for colocado em modo offline. Se a pilha de comunicação MySQL estiver em uso (`group_replication_communication_stack = MYSQL`), sem esse privilégio, um membro que for colocado em modo offline é expulso do grupo.

* `CREATE_SPATIAL_REFERENCE_SYSTEM`

Permite o uso das instruções `CREATE SPATIAL REFERENCE SYSTEM`, `CREATE OR REPLACE SPATIAL REFERENCE SYSTEM` e `DROP SPATIAL REFERENCE SYSTEM`. Tentar executar qualquer uma dessas instruções sem esse privilégio (ou o privilégio `SUPER`) agora gera o erro `ER_CMD_NEED_SUPER_OR_CREATE_SPATIAL_REFERENCE_SYSTEM`.

O uso desse privilégio é destinado a substituir o uso do `SUPER` para esse propósito, que deve ser considerado obsoleto.

* `ENCRYPTION_KEY_ADMIN`

  Habilita a rotação da chave de criptografia do `InnoDB`.

* `EXPORT_QUERY_RESULTS`

  Permite que o usuário exporte os resultados das consultas para um repositório de objetos OCI ou AWS.

  Aplica-se apenas ao MySQL HeatWave.

* `FIREWALL_ADMIN`

  Habilita o usuário a administrar regras de firewall para qualquer usuário. Esse privilégio é definido pelo plugin `MYSQL_FIREWALL`; consulte a Seção 8.4.8, “Firewall Empresarial MySQL”.

* `FIREWALL_EXEMPT`

  Um usuário com esse privilégio está isento das restrições de firewall. Esse privilégio é definido pelo plugin `MYSQL_FIREWALL`; consulte a Seção 8.4.8, “Firewall Empresarial MySQL”.

* `FIREWALL_USER`

  Habilita os usuários a atualizar suas próprias regras de firewall. Esse privilégio é definido pelo plugin MySQL Enterprise Firewall (consulte a Seção 8.4.8.1, “O Plugin do Firewall Empresarial MySQL”).

  Como o plugin de firewall, esse privilégio é obsoleto e, portanto, sujeito à remoção em uma versão futura do MySQL. O `FIREWALL_USER` não é suportado pelo componente MySQL Enterprise Firewall (consulte a Seção 8.4.8.2, “O Componente do Firewall Empresarial MySQL”), que substitui o plugin.

* `FLUSH_OPTIMIZER_COSTS`

  Habilita o uso da instrução `FLUSH OPTIMIZER_COSTS`.

* `FLUSH_PRIVILEGES`

  Habilita o uso da instrução `FLUSH PRIVILEGES`.

Desatualizado, juntamente com a declaração `FLUSH PRIVILEGES`; espere que este privilégio seja removido em uma versão futura do MySQL. A concessão do privilégio `FLUSH_PRIVILEGES` aciona uma advertência de desatualização.

* `FLUSH_STATUS`

  Habilita o uso da declaração `FLUSH STATUS`.

* `FLUSH_TABLES`

  Habilita o uso da declaração `FLUSH TABLES`.

* `FLUSH_USER_RESOURCES`

  Habilita o uso da declaração `FLUSH USER_RESOURCES`.

* `GROUP_REPLICATION_ADMIN`

  Habilita a conta para iniciar e parar a replicação de grupo usando as declarações `START GROUP REPLICATION` e `STOP GROUP REPLICATION`, para alterar o ajuste global para a variável de sistema `group_replication_consistency`, e para usar as funções `group_replication_set_write_concurrency()` e `group_replication_set_communication_protocol()`. Conceda este privilégio às contas que são usadas para administrar servidores que são membros de um grupo de replicação.

* `GROUP_REPLICATION_STREAM`

  Permite que uma conta de usuário seja usada para estabelecer as conexões de comunicação de grupo da replicação. Deve ser concedida a um usuário de recuperação quando a pilha de comunicação MySQL for usada para a replicação de grupo (`group_replication_communication_stack=MYSQL`).

* `INNODB_REDO_LOG_ARCHIVE`

  Habilita a conta para ativar e desativar o arquivamento do log de redo.

* `INNODB_REDO_LOG_ENABLE`

  Habilita o uso da declaração `ALTER INSTANCE {ENABLE|DISABLE} INNODB REDO_LOG` para habilitar ou desabilitar o registro de redo.

  Veja Desabilitar o Registro de Redo.

* `MASKING_DICTIONARIES_ADMIN`

Permite que a conta adicione e remova termos do dicionário usando as funções de componentes `masking_dictionary_term_add()` e `masking_dictionary_term_remove()`. As contas também requerem esse privilégio dinâmico para remover um dicionário completo usando a função `masking_dictionary_remove()`, que remove todos os termos associados ao dicionário nomeado atualmente na tabela `mysql.masking_dictionaries`.

Veja a Seção 8.5, “MySQL Enterprise Data Masking”.

* `NDB_STORED_USER`

  Permite que o usuário ou o papel e seus privilégios sejam compartilhados e sincronizados entre todos os servidores MySQL habilitados para `NDB` assim que eles se juntarem a um determinado NDB Cluster. Esse privilégio está disponível apenas se o motor de armazenamento `NDB` estiver habilitado.

  Quaisquer alterações ou revogações de privilégios feitas para o usuário ou papel fornecidos são sincronizadas imediatamente com todos os servidores MySQL conectados (nós SQL). Você deve estar ciente de que não há garantia de que múltiplas declarações que afetam privilégios originadas de diferentes nós SQL sejam executadas em todos os nós SQL na mesma ordem. Por essa razão, é altamente recomendável que toda administração de usuários seja feita a partir de um único nó SQL designado.

  `NDB_STORED_USER` é um privilégio global e deve ser concedido ou revogado usando `ON *.*`. Tentar definir qualquer outro escopo para esse privilégio resulta em um erro. Esse privilégio pode ser concedido à maioria dos usuários de aplicação e administrativos, mas não pode ser concedido a contas reservadas do sistema, como `mysql.session@localhost` ou `mysql.infoschema@localhost`.

Um usuário que recebeu o privilégio `NDB_STORED_USER` é armazenado em `NDB` (e, portanto, compartilhado por todos os nós do SQL), assim como um papel com esse privilégio. Um usuário que recebe apenas um papel com o privilégio `NDB_STORED_USER` *não* é armazenado em `NDB`; cada usuário armazenado em `NDB` deve receber o privilégio explicitamente.

Para obter informações mais detalhadas sobre como isso funciona em `NDB`, consulte a Seção 25.6.13, “Sincronização de privilégios e NDB_STORED_USER”.

* `OPTIMIZE_LOCAL_TABLE`

Habilita o uso das instruções `OPTIMIZE LOCAL TABLE` e `OPTIMIZE NO_WRITE_TO_BINLOG TABLE`.

* `OPTION_TRACKER_OBSERVER`

Este privilégio fornece acesso de escrita à tabela `mysql_option.option_usage`; tanto o privilégio quanto a tabela são fornecidos pelo componente Option Tracker. Para mais informações, consulte a Seção 7.5.8, “Compósito Option Tracker”.

* `OPTION_TRACKER_UPDATER`

Este privilégio é necessário para acesso de escrita à tabela `mysql_option.option_usage`; tanto o privilégio quanto a tabela são fornecidos pelo componente Option Tracker. Para mais informações, consulte a Seção 7.5.8, “Compósito Option Tracker”.

* `PASSWORDLESS_USER_ADMIN`

Este privilégio se aplica a contas de usuário sem senha:

+ Para a criação de contas, um usuário que executa `CREATE USER` para criar uma conta sem senha deve possuir o privilégio `PASSWORDLESS_USER_ADMIN`.

+ No contexto de replicação, o privilégio `PASSWORDLESS_USER_ADMIN` se aplica a usuários de replicação e permite a replicação de instruções `ALTER USER ... MODIFY` para contas de usuário configuradas para autenticação sem senha.

Para informações sobre autenticação sem senha, consulte Autenticação sem senha do WebAuthn.

* `PERSIST_RO_VARIABLES_ADMIN`

Para usuários que também têm `SYSTEM_VARIABLES_ADMIN`, `PERSIST_RO_VARIABLES_ADMIN` habilita o uso de `SET PERSIST_ONLY` para persistir variáveis de sistema globais no arquivo de opção `mysqld-auto.cnf` no diretório de dados. Esta declaração é semelhante a `SET PERSIST`, mas não modifica o valor da variável de sistema global em tempo de execução. Isso torna `SET PERSIST_ONLY` adequado para configurar variáveis de sistema de leitura apenas que podem ser definidas apenas no início do servidor.

Veja também a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

* `REPLICATION_APPLIER`

  Habilita a conta a atuar como o `PRIVILEGE_CHECKS_USER` para um canal de replicação e a executar instruções `BINLOG` na saída de **mysqlbinlog**. Conceda este privilégio a contas que são atribuídas usando `CHANGE REPLICATION SOURCE TO` para fornecer um contexto de segurança para os canais de replicação e para lidar com erros de replicação nesses canais. Além do privilégio `REPLICATION_APPLIER`, você também deve dar à conta os privilégios necessários para executar as transações recebidas pelo canal de replicação ou contidas na saída de **mysqlbinlog**, por exemplo, para atualizar as tabelas afetadas. Para mais informações, consulte a Seção 19.3.3, “Verificação de Privilégios de Replicação”.

* `REPLICATION_SLAVE_ADMIN`

  Habilita a conta a se conectar ao servidor de origem da replicação, iniciar e parar a replicação usando as instruções `START REPLICA` e `STOP REPLICA`, e usar as instruções `CHANGE REPLICATION SOURCE TO` e `CHANGE REPLICATION FILTER`. Conceda este privilégio a contas que são usadas por réplicas para se conectarem ao servidor atual como seu servidor de origem de replicação. Este privilégio não se aplica à Replicação por Grupo; use `GROUP_REPLICATION_ADMIN` para isso.

* `RESOURCE_GROUP_ADMIN`

Permite a gestão de grupos de recursos, que inclui a criação, alteração e eliminação de grupos de recursos, bem como a atribuição de threads e declarações a grupos de recursos. Um utilizador com este privilégio pode realizar qualquer operação relacionada com os grupos de recursos.

* `RESOURCE_GROUP_USER`

  Permite a atribuição de threads e declarações a grupos de recursos. Um utilizador com este privilégio pode utilizar a instrução `SET RESOURCE GROUP` e a dica de otimização `RESOURCE_GROUP`.

* `ROLE_ADMIN`

  Permite a concessão e revogação de papéis, o uso da cláusula `WITH ADMIN OPTION` da instrução `GRANT` e o conteúdo de elementos `<graphml>` não vazios no resultado da função `ROLES_GRAPHML()`. Necessário para definir o valor da variável de sistema `mandatory_roles`.

* `SENSITIVE_VARIABLES_OBSERVER`

  Permite que o titular visualize os valores das variáveis de sistema sensíveis nas tabelas do Schema de Desempenho `global_variables`, `session_variables`, `variables_by_thread` e `persisted_variables`, emita instruções `SELECT` para retornar os seus valores e acompanhar as alterações nelas efetuadas nos rastreadores de sessão para conexões. Os utilizadores sem este privilégio não podem visualizar ou acompanhar esses valores das variáveis de sistema. Consulte Persistência de Variáveis de Sistema Sensíveis.

* `SERVICE_CONNECTION_ADMIN`

  Permite conexões à interface de rede que permite apenas conexões administrativas (ver Seção 7.1.12.1, “Interfaces de Conexão”).

* `SESSION_VARIABLES_ADMIN`

  Para a maioria das variáveis de sistema, definir o valor da sessão não requer privilégios especiais e pode ser feito por qualquer utilizador para afetar a sessão atual. Para algumas variáveis de sistema, definir o valor da sessão pode ter efeitos fora da sessão atual e, portanto, é uma operação restrita. Para estas, o privilégio `SESSION_VARIABLES_ADMIN` permite ao utilizador definir o valor da sessão.

Se uma variável de sistema estiver restrita e exigir um privilégio especial para definir o valor da sessão, a descrição da variável indica essa restrição. Exemplos incluem `binlog_format`, `sql_log_bin` e `sql_log_off`.

O privilégio `SESSION_VARIABLES_ADMIN` é um subconjunto dos privilégios `SYSTEM_VARIABLES_ADMIN` e `SUPER`. Um usuário que tenha qualquer um desses privilégios também é autorizado a definir variáveis de sessão restritas e, efetivamente, tem `SESSION_VARIABLES_ADMIN` por implicação e não precisa ser concedido `SESSION_VARIABLES_ADMIN` explicitamente.

Veja também a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

* `SET_ANY_DEFINER`

  Habilita a definição do ID de autorização efetivo ao executar uma visualização ou programa armazenado. Um usuário com esse privilégio pode especificar qualquer conta como o atributo `DEFINER` para `CREATE PROCEDURE`, `CREATE FUNCTION`, `CREATE TRIGGER`, `CREATE EVENT`, `ALTER EVENT`, `CREATE VIEW` e `ALTER VIEW`. Sem esse privilégio, apenas o ID de autenticação efetivo pode ser especificado.

  Os programas armazenados são executados com os privilégios da conta especificada, portanto, certifique-se de seguir as diretrizes de minimização de riscos listadas na Seção 27.8, “Controle de Acesso a Objetos Armazenados”.

* `SHOW_ROUTINE`

  Habilita o usuário a acessar definições e propriedades de todas as rotinas armazenadas (procedimentos e funções armazenados), mesmo aquelas para as quais o usuário não é nomeado como o `DEFINER` da rotina. Esse acesso inclui:

  + O conteúdo da tabela do Schema de Informações `ROUTINES`.

  + As declarações `SHOW CREATE FUNCTION` e `SHOW CREATE PROCEDURE`.

  + As declarações `SHOW FUNCTION CODE` e `SHOW PROCEDURE CODE`.

  + As declarações `SHOW FUNCTION STATUS` e `SHOW PROCEDURE STATUS`.

`SHOW_ROUTINE` pode ser concedido como um privilégio com um escopo mais restrito que permite o acesso às definições de rotinas. (Ou seja, um administrador pode revogar o `SELECT` global de usuários que não precisam dele e conceder `SHOW_ROUTINE` em vez disso.) Isso permite que uma conta faça backup de rotinas armazenadas sem exigir um privilégio amplo.

* `SKIP_QUERY_REWRITE`

  Consultas emitidas por um usuário com este privilégio não são sujeitas à reescrita pelo plugin `Rewriter` (consulte Seção 7.6.4, “O Plugin de Reescrita de Consultas do Rewriter”).

  Este privilégio deve ser concedido a usuários que emitem declarações administrativas ou de controle que não devem ser reescritas, bem como às contas `PRIVILEGE_CHECKS_USER` (consulte Seção 19.3.3, “Verificações de Privilégios de Replicação”) usadas para aplicar declarações de uma fonte de replicação.

* `SYSTEM_USER`

  O privilégio `SYSTEM_USER` distingue usuários do sistema de usuários regulares:

  + Um usuário com o privilégio `SYSTEM_USER` é um usuário do sistema.

  + Um usuário sem o privilégio `SYSTEM_USER` é um usuário regular.

  O privilégio `SYSTEM_USER` tem efeito nas contas às quais um determinado usuário pode aplicar seus outros privilégios, bem como se o usuário está protegido de outras contas:

  + Um usuário do sistema pode modificar tanto contas do sistema quanto contas regulares. Isso significa que um usuário que tem os privilégios apropriados para realizar uma operação específica em contas regulares é habilitado pela posse de `SYSTEM_USER` para realizar a operação também em contas do sistema. Uma conta do sistema só pode ser modificada por usuários do sistema com privilégios apropriados, não por usuários regulares.

  + Um usuário regular com privilégios apropriados pode modificar contas regulares, mas não contas do sistema. Uma conta regular pode ser modificada por usuários do sistema e regulares com privilégios apropriados.

Isso também significa que os objetos de banco de dados criados por usuários com o privilégio `SYSTEM_USER` não podem ser modificados ou excluídos por usuários sem esse privilégio. Isso também se aplica a rotinas para as quais o definidor possui esse privilégio.

Para obter mais informações, consulte a Seção 8.2.11, “Categorias de Conta”.

A proteção contra modificação por contas regulares que é concedida às contas de sistema pelo privilégio `SYSTEM_USER` não se aplica a contas regulares que possuem privilégios no esquema de sistema `mysql` e, portanto, podem modificar diretamente as tabelas de concessão nesse esquema. Para proteção total, não conceda privilégios do esquema `mysql` a contas regulares. Consulte Proteger Contas de Sistema Contra Manipulação por Contas Regulares.

Se o plugin `audit_log` estiver em uso (consulte a Seção 8.4.6, “Auditoria do MySQL Enterprise”), as contas com o privilégio `SYSTEM_USER` são automaticamente atribuídas o privilégio `AUDIT_ABORT_EXEMPT`, que permite que suas consultas sejam executadas mesmo que um item de “abort” configurado no filtro o bloqueie. Portanto, contas com o privilégio `SYSTEM_USER` podem ser usadas para recuperar o acesso a um sistema após uma má configuração de auditoria.

* `SYSTEM_VARIABLES_ADMIN`

  Afeta as seguintes operações e comportamentos do servidor:

  + Habilita alterações de variáveis de sistema em tempo de execução:

    - Habilita alterações de configuração do servidor para variáveis de sistema globais com `SET GLOBAL` e `SET PERSIST`.

    - Habilita alterações de configuração do servidor para variáveis de sistema globais com `SET PERSIST_ONLY`, se o usuário também tiver `PERSIST_RO_VARIABLES_ADMIN`.

    - Habilita a definição de variáveis de sistema de sessão restritas que requerem um privilégio especial. Na prática, `SYSTEM_VARIABLES_ADMIN` implica `SESSION_VARIABLES_ADMIN` sem conceder explicitamente `SESSION_VARIABLES_ADMIN`.

Veja também a Seção 7.1.9.1, “Privilégios de Variáveis do Sistema”.

  + Permite alterações nas características das transações globais (consulte a Seção 15.3.7, “Instrução SET TRANSACTION”).

* `TABLE_ENCRYPTION_ADMIN`

  Permite que um usuário substitua as configurações de criptografia padrão quando o `table_encryption_privilege_check` estiver habilitado; consulte Definindo um Padrão de Criptografia para Esquemas e Espaços de Tabelas Gerais.

* `TELEMETRY_LOG_ADMIN`

  Habilita a configuração do log de telemetria. Esse privilégio é definido pelo plugin `telemetry_log`, que é implantado através do MySQL HeatWave na AWS.

* `TP_CONNECTION_ADMIN`

  Habilita a conexão com o servidor com uma conexão privilegiada. Quando o limite definido por `thread_pool_max_transactions_limit` for atingido, novas conexões não serão permitidas, a menos que sejam substituídas por `thread_pool_longrun_trx_limit`. Uma conexão privilegiada ignora o limite de transação e permite conectar-se ao servidor para aumentar o limite de transação, remover o limite ou interromper transações em execução. Esse privilégio não é concedido a nenhum usuário por padrão. Para estabelecer uma conexão privilegiada, o usuário que inicia a conexão deve ter o privilégio `TP_CONNECTION_ADMIN`.

  Uma conexão privilegiada pode executar instruções e iniciar transações quando o limite definido por `thread_pool_max_transactions_limit` for atingido. Uma conexão privilegiada é colocada no grupo de threads `Admin`. Consulte Conexões Privilegiadas.

* `TRANSACTION_GTID_TAG`

  Requerido para definir a variável de sistema `gtid_next` para `AUTOMATIC:TAG` ou `UUID:TAG:NUMBER` em um servidor de fonte de replicação. Além disso, pelo menos um dos `SYSTEM_VARIABLES_ADMIN`, `SESSION_VARIABLES_ADMIN` ou `REPLICATION_APPLIER` também é necessário para definir `gtid_next` para um desses valores na fonte.

O `REPLICATION_CHECKS_APPLIER` também deve ter esse privilégio, assim como o privilégio `REPLICATION_APPLIER` para definir `gtid_next` para `AUTOMATIC:TAG`. Isso é verificado ao iniciar o thread do aplicável de replicação.

Este privilégio também é necessário para definir a variável de sistema `gtid_purged`.

Para mais informações sobre o uso de GTIDs marcados, consulte a descrição de `gtid_next`, bem como a Seção 19.1.4, “Mudando o Modo GTID em Servidores Online”.

* `VERSION_TOKEN_ADMIN`

Habilita a execução das funções dos Tokens de Versão. Este privilégio é desatualizado. É definido pelo plugin `version_tokens` (também desatualizado); consulte Tokens de Versão.

* `XA_RECOVER_ADMIN`

Habilita a execução da instrução `XA RECOVER`; consulte a Seção 15.3.8.1, “Instruções SQL de Transações XA”.

Antes do MySQL 9.5, qualquer usuário poderia executar a instrução `XA RECOVER` para descobrir os valores de XID para transações preparadas pendentes XA, o que poderia levar ao commit ou rollback de uma transação XA por um usuário diferente do que a iniciou. No MySQL 9.5, `XA RECOVER` é permitido apenas para usuários que têm o privilégio `XA_RECOVER_ADMIN`, que é esperado ser concedido apenas a usuários administrativos que tenham necessidade disso. Isso pode ser o caso, por exemplo, para administradores de um aplicativo XA se ele falhou e é necessário encontrar transações pendentes iniciadas pelo aplicativo para que possam ser revertidas. Essa exigência de privilégio impede que os usuários descubram os valores de XID para transações preparadas pendentes XA que não sejam suas próprias. Isso não afeta o commit ou rollback normais de uma transação XA porque o usuário que a iniciou conhece seu XID.

#### Diretrizes de Concessão de Privilégios

É uma boa ideia conceder a uma conta apenas os privilégios que ela precisa. Você deve ter cuidado especial ao conceder os privilégios `FILE` e administrativos:

* O `FILE` pode ser abusado para ler em uma tabela de banco de dados quaisquer arquivos que o servidor MySQL possa ler no host do servidor. Isso inclui todos os arquivos legíveis por qualquer pessoa e arquivos no diretório de dados do servidor. A tabela pode então ser acessada usando `SELECT` para transferir seu conteúdo para o host do cliente.

* A `GRANT OPTION` permite que os usuários dêem seus privilégios a outros usuários. Dois usuários que têm privilégios diferentes e com o privilégio `GRANT OPTION` podem combinar privilégios.

* `ALTER` pode ser usado para subverter o sistema de privilégios renomeando tabelas.

* `SHUTDOWN` pode ser abusado para negar o serviço a outros usuários inteiramente ao encerrar o servidor.

* `PROCESS` pode ser usado para visualizar o texto simples das instruções atualmente executadas, incluindo instruções que definem ou alteram senhas.

* `SUPER` pode ser usado para encerrar outras sessões ou alterar como o servidor opera.

* Os privilégios concedidos para o próprio banco de dados do sistema `mysql` podem ser usados para alterar senhas e outras informações de privilégios de acesso:

  + As senhas são armazenadas criptografadas, então um usuário malicioso não pode simplesmente lê-las para saber a senha em texto simples. No entanto, um usuário com acesso de escrita à coluna `authentication_string` da tabela do sistema `mysql.user` pode alterar a senha de uma conta e, em seguida, se conectar ao servidor MySQL usando essa conta.

  + `INSERT` ou `UPDATE` concedidos para o banco de dados do sistema `mysql` permitem que um usuário adicione privilégios ou modifique privilégios existentes, respectivamente.

  + `DROP` para o banco de dados do sistema `mysql` permite que um usuário remova tabelas de privilégios ou até mesmo o próprio banco de dados.

O MySQL suporta privilégios estáticos e dinâmicos:

* Os privilégios estáticos são incorporados ao servidor. Eles estão sempre disponíveis para serem concedidos às contas de usuário e não podem ser desregistrados.

* Os privilégios dinâmicos podem ser registrados e desregistrados em tempo de execução. Isso afeta sua disponibilidade: um privilégio dinâmico que não foi registrado não pode ser concedido.

Por exemplo, os privilégios `SELECT` e `INSERT` são estáticos e sempre estão disponíveis, enquanto um privilégio dinâmico só se torna disponível se o componente que o implementa tiver sido habilitado.

O restante desta seção descreve como os privilégios dinâmicos funcionam no MySQL. A discussão usa o termo “componentes”, mas se aplica igualmente a plugins.

Nota

Os administradores do servidor devem estar cientes de quais componentes do servidor definem privilégios dinâmicos. Para as distribuições do MySQL, a documentação dos componentes que definem privilégios dinâmicos descreve esses privilégios.

Componentes de terceiros também podem definir privilégios dinâmicos; um administrador deve entender esses privilégios e não instalar componentes que possam conflitar ou comprometer o funcionamento do servidor. Por exemplo, um componente conflita com outro se ambos definirem um privilégio com o mesmo nome. Os desenvolvedores de componentes podem reduzir a probabilidade dessa ocorrência escolhendo nomes de privilégios com um prefixo baseado no nome do componente.

O servidor mantém o conjunto de privilégios dinâmicos registrados internamente na memória. O desregistro ocorre ao desligar o servidor.

Normalmente, um componente que define privilégios dinâmicos os registra quando é instalado, durante sua sequência de inicialização. Quando desinstalado, um componente não desregistra seus privilégios dinâmicos registrados. (Essa é a prática atual, não uma exigência. Ou seja, os componentes podem, mas não desregistram, a qualquer momento, os privilégios que registram.)

Não ocorre nenhum aviso ou erro para tentativas de registrar um privilégio dinâmico já registrado. Considere a seguinte sequência de declarações:

```
INSTALL COMPONENT 'my_component';
UNINSTALL COMPONENT 'my_component';
INSTALL COMPONENT 'my_component';
```

A primeira declaração `INSTALL COMPONENT` registra quaisquer privilégios definidos pelo componente `my_component`, mas `UNINSTALL COMPONENT` não os desregistra. Para a segunda declaração `INSTALL COMPONENT`, os privilégios do componente que ele registra são encontrados como já registrados, mas não ocorrem avisos ou erros.

Os privilégios dinâmicos aplicam-se apenas ao nível global. O servidor armazena informações sobre as atribuições atuais de privilégios dinâmicos para contas de usuário na tabela do sistema `mysql.global_grants`:

* O servidor registra automaticamente os privilégios nomeados em `global_grants` durante a inicialização do servidor (a menos que a opção `--skip-grant-tables` seja fornecida).

* As declarações `GRANT` e `REVOKE` modificam o conteúdo de `global_grants`.

* As atribuições de privilégios dinâmicos listadas em `global_grants` são persistentes. Elas não são removidas na parada do servidor.

Exemplo: A seguinte declaração concede ao usuário `u1` os privilégios necessários para controlar a replicação (incluindo a Replicação de Grupo) em uma replica, e para modificar variáveis de sistema:

```
GRANT REPLICATION_SLAVE_ADMIN, GROUP_REPLICATION_ADMIN, BINLOG_ADMIN
ON *.* TO 'u1'@'localhost';
```

Os privilégios dinâmicos concedidos aparecem na saída da declaração `SHOW GRANTS` e na tabela `USER_PRIVILEGES` do `INFORMATION_SCHEMA`.

Para `GRANT` e `REVOKE` no nível global, quaisquer privilégios nomeados não reconhecidos como estáticos são verificados contra o conjunto atual de privilégios dinâmicos registrados e concedidos se encontrados. Caso contrário, ocorre um erro para indicar um identificador de privilégio desconhecido.

Para `GRANT` e `REVOKE`, o significado de `ALL [PRIVILEGES]` no nível global inclui todos os privilégios globais estáticos, bem como todos os privilégios dinâmicos registrados atualmente:

* `GRANT ALL` no nível global concede todos os privilégios globais estáticos e todos os privilégios dinâmicos registrados atualmente. Um privilégio dinâmico registrado subsequente à execução da declaração `GRANT` não é concedido retroativamente a nenhuma conta.

* `REVOKE ALL` no nível global revoga todos os privilégios globais estáticos concedidos e todos os privilégios dinâmicos concedidos.

A declaração `FLUSH PRIVILEGES` lê a tabela `global_grants` para atribuições de privilégios dinâmicos e registra quaisquer privilégios não registrados encontrados.

Para descrições dos privilégios dinâmicos fornecidos pelo MySQL Server e componentes incluídos nas distribuições do MySQL, consulte a Seção 8.2.2, “Privilégios Fornecidos pelo MySQL”.

#### Migrando Contas de SUPER para Privilegios Dinâmicos

No MySQL 9.5, muitas operações que anteriormente exigiam o privilégio `SUPER` também estão associadas a um privilégio dinâmico de escopo mais limitado. (Para descrições desses privilégios, consulte a Seção 8.2.2, “Privilégios Fornecidos pelo MySQL”.) Cada operação pode ser permitida a uma conta concedendo o privilégio dinâmico associado em vez de `SUPER`. Essa mudança melhora a segurança, permitindo que os administradores de banco de dados evitem conceder `SUPER` e adaptem os privilégios dos usuários mais de perto às operações permitidas. `SUPER` é agora desatualizado; espere que ele seja removido em uma versão futura do MySQL.

Quando a remoção do `SUPER` ocorrer, as operações que antes exigiam `SUPER` falharão, a menos que as contas que receberam `SUPER` sejam migradas para os privilégios dinâmicos apropriados. Use as instruções a seguir para alcançar esse objetivo, para que as contas estejam prontas antes da remoção do `SUPER`:

1. Execute esta consulta para identificar as contas que receberam `SUPER`:

   ```
   SELECT GRANTEE FROM INFORMATION_SCHEMA.USER_PRIVILEGES
   WHERE PRIVILEGE_TYPE = 'SUPER';
   ```

2. Para cada conta identificada pela consulta anterior, determine as operações para as quais ela precisa de `SUPER`. Em seguida, conceda os privilégios dinâmicos correspondentes a essas operações e revogue `SUPER`.

Por exemplo, se `'u1'@'localhost'` requer `SUPER` para a purga do log binário e a modificação de variáveis de sistema, essas instruções fazem as alterações necessárias na conta:

```
   GRANT BINLOG_ADMIN, SYSTEM_VARIABLES_ADMIN ON *.* TO 'u1'@'localhost';
   REVOKE SUPER ON *.* FROM 'u1'@'localhost';
   ```

Depois de ter modificado todas as contas aplicáveis, a consulta `INFORMATION_SCHEMA` no primeiro passo deve produzir um conjunto de resultados vazio.