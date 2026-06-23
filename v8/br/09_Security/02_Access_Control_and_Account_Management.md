## 8.2 Controle de Acesso e Gerenciamento de Conta

O MySQL permite a criação de contas que permitem que os usuários clientes se conectem ao servidor e acessem dados gerenciados pelo servidor. A função principal do sistema de privilégios do MySQL é autenticar um usuário que se conecta a partir de um host específico e associar esse usuário com privilégios em um banco de dados, como `SELECT`, `INSERT`, `UPDATE` e `DELETE`. A funcionalidade adicional inclui a capacidade de conceder privilégios para operações administrativas.

Para controlar quais usuários podem se conectar, cada conta pode ser atribuída a credenciais de autenticação, como uma senha. A interface de usuário para contas MySQL consiste em declarações SQL, como `CREATE USER`, `GRANT` e `REVOKE`. Veja a Seção 15.7.1, “Declarações de Gerenciamento de Conta”.

O sistema de privilégios do MySQL garante que todos os usuários possam realizar apenas as operações permitidas a eles. Como usuário, quando você se conecta a um servidor MySQL, sua identidade é determinada por *o host do qual você se conecta* e *o nome de usuário que você especifica*. Quando você emite solicitações após se conectar, o sistema concede privilégios de acordo com sua identidade e *o que você deseja fazer*.

O MySQL considera tanto o nome do seu host quanto o nome do usuário para identificá-lo, pois não há motivo para supor que um nome de usuário específico pertença à mesma pessoa em todos os hosts. Por exemplo, o usuário `joe` que se conecta a partir de `office.example.com` não precisa ser a mesma pessoa que o usuário `joe` que se conecta a partir de `home.example.com`. O MySQL lida com isso, permitindo que você distinga usuários em diferentes hosts que, por acaso, tenham o mesmo nome: você pode conceder um conjunto de privilégios para conexões por `joe` a partir de `office.example.com`, e um conjunto de privilégios diferente para conexões por `joe` a partir de `home.example.com`. Para ver quais privilégios uma conta específica tem, use a declaração `SHOW GRANTS`. Por exemplo:

```
SHOW GRANTS FOR 'joe'@'office.example.com';
SHOW GRANTS FOR 'joe'@'home.example.com';
```

Internamente, o servidor armazena informações de privilégio nas tabelas de concessão do banco de dados do sistema `mysql`. O servidor MySQL lê o conteúdo dessas tabelas na memória quando é iniciado e baseia as decisões de controle de acesso nas cópias de memória das tabelas de concessão.

O controle de acesso do MySQL envolve duas etapas quando você executa um programa cliente que se conecta ao servidor:

**Etapa 1:** O servidor aceita ou rejeita a conexão com base na sua identidade e se você pode verificar sua identidade fornecendo a senha correta.

**Etapa 2:** Supondo que você possa se conectar, o servidor verifica cada declaração que você emite para determinar se você tem privilégios suficientes para executá-la. Por exemplo, se você tentar selecionar linhas de uma tabela em um banco de dados ou excluir uma tabela do banco de dados, o servidor verifica se você tem o privilégio `SELECT` para a tabela ou o privilégio `DROP` para o banco de dados.

Para uma descrição mais detalhada do que acontece em cada estágio, consulte a Seção 8.2.6, “Controle de Acesso, Estágio 1: Verificação de Conexão”, e a Seção 8.2.7, “Controle de Acesso, Estágio 2: Verificação de Solicitação”. Para obter ajuda no diagnóstico de problemas relacionados a privilégios, consulte a Seção 8.2.22, “Solucionando Problemas de Conexão com o MySQL”.

Se seus privilégios forem alterados (por você ou por outra pessoa) enquanto você estiver conectado, essas alterações não necessariamente terão efeito imediatamente na próxima declaração que você emitir. Para obter detalhes sobre as condições sob as quais o servidor recarrega as tabelas de concessão, consulte a Seção 8.2.13, “Quando as Alterações de Privilegio Têm Efeito”.

Há algumas coisas que você não pode fazer com o sistema de privilégios do MySQL:

* Você não pode especificar explicitamente que um usuário específico deve ser negado o acesso. Isso significa que você não pode corresponder explicitamente a um usuário e, em seguida, recusar a conexão.

* Não é possível especificar que um usuário tenha privilégios para criar ou descartar tabelas em um banco de dados, mas não para criar ou descartar o próprio banco de dados.

* Uma senha se aplica globalmente a uma conta. Você não pode associar uma senha a um objeto específico, como um banco de dados, uma tabela ou uma rotina.

### 8.2.1 Nomes de Usuários e Senhas de Conta

O MySQL armazena contas na tabela `user` do banco de dados do sistema `mysql`. Uma conta é definida em termos de um nome de usuário e o host ou hosts do cliente a partir dos quais o usuário pode se conectar ao servidor. Para informações sobre a representação da conta na tabela `user`, consulte a Seção 8.2.3, “Tabelas de Concessão”.

Uma conta também pode ter credenciais de autenticação, como uma senha. As credenciais são manipuladas pelo plugin de autenticação da conta. O MySQL suporta vários plugins de autenticação. Alguns deles usam métodos de autenticação integrados, enquanto outros permitem a autenticação usando métodos de autenticação externos. Veja a Seção 8.2.17, “Autenticação Conectada”.

Há várias distinções entre a forma como os nomes de usuário e as senhas são usados pelo MySQL e pelo seu sistema operacional:

* Os nomes de usuário, como são usados pelo MySQL para fins de autenticação, não têm nada a ver com os nomes de usuário (nomes de login) usados pelo Windows ou Unix. No Unix, a maioria dos clientes MySQL, por padrão, tenta fazer login usando o nome de usuário atual do Unix como o nome de usuário do MySQL, mas isso é apenas para conveniência. O padrão pode ser facilmente ignorado, porque os programas de cliente permitem que qualquer nome de usuário seja especificado com a opção `-u` ou `--user`. Isso significa que qualquer pessoa pode tentar se conectar ao servidor usando qualquer nome de usuário, então você não pode tornar um banco de dados seguro de nenhuma maneira, a menos que todas as contas do MySQL tenham senhas. Qualquer pessoa que especifique um nome de usuário para uma conta que não tem senha pode se conectar com sucesso ao servidor.

* Os nomes de usuário do MySQL podem ter até 32 caracteres. Os nomes de usuário do sistema operacional podem ter um comprimento máximo diferente.

Aviso

O limite de comprimento do nome do usuário do MySQL é codificado em servidores e clientes MySQL, e tentar contorná-lo modificando as definições das tabelas no banco de dados `mysql` *não funciona*.

Você nunca deve alterar a estrutura das tabelas no banco de dados `mysql` de qualquer maneira, exceto por meio do procedimento que é descrito no Capítulo 3, *Atualizando o MySQL*. Tentar redefinir as tabelas do sistema do MySQL de qualquer outra maneira resulta em comportamento indefinido e não suportado. O servidor é livre para ignorar linhas que se tornam malformadas como resultado de tais modificações.

* Para autenticar as conexões dos clientes para contas que utilizam métodos de autenticação integrados, o servidor usa senhas armazenadas na tabela `user`. Essas senhas são distintas das senhas para fazer login no seu sistema operacional. Não há conexão necessária entre a senha "externa" que você usa para fazer login em uma máquina Windows ou Unix e a senha que você usa para acessar o servidor MySQL naquela máquina.

Se o servidor autentica um cliente usando algum outro plugin, o método de autenticação que o plugin implementa pode ou não usar uma senha armazenada na tabela `user`. Nesse caso, é possível que uma senha externa também seja usada para autenticar-se no servidor MySQL.

* As senhas armazenadas na tabela `user` são criptografadas usando algoritmos específicos do plugin.

* Se o nome de usuário e a senha contiverem apenas caracteres ASCII, é possível se conectar ao servidor, independentemente das configurações do conjunto de caracteres. Para habilitar conexões quando o nome de usuário ou a senha contiverem caracteres não ASCII, as aplicações cliente devem chamar a função `mysql_options()` da API C com a opção `MYSQL_SET_CHARSET_NAME` e o nome apropriado do conjunto de caracteres como argumentos. Isso faz com que a autenticação ocorra usando o conjunto de caracteres especificado. Caso contrário, a autenticação falha, a menos que o conjunto de caracteres padrão do servidor seja o mesmo que o codificação nos padrões de autenticação padrão.

Os programas padrão de cliente MySQL suportam a opção `--default-character-set` que faz com que `mysql_options()` seja chamada conforme descrito. Além disso, a autodetecção de conjuntos de caracteres é suportada conforme descrito na Seção 12.4, “Conjunto de caracteres de conexão e colatitudes”. Para programas que usam um conector que não é baseado na API C, o conector pode fornecer um equivalente a `mysql_options()` que pode ser usado em vez disso. Verifique a documentação do conector.

As notas anteriores não se aplicam a `ucs2`, `utf16` e `utf32`, que não são permitidos como conjuntos de caracteres do cliente.

O processo de instalação do MySQL preenche as tabelas de concessão com uma conta inicial `root`, conforme descrito na Seção 2.9.4, “Segurando a Conta Inicial do MySQL”, que também discute como atribuir uma senha a ela. Posteriormente, você normalmente configura, modifica e remove contas do MySQL usando declarações como `CREATE USER`, `DROP USER`, `GRANT` e `REVOKE`. Veja a Seção 8.2.8, “Adicionar Contas, Atribuir Privilegios e Remover Contas”, e a Seção 15.7.1, “Declarações de Gerenciamento de Conta”.

Para se conectar a um servidor MySQL com um cliente de linha de comando, especifique as opções de nome de usuário e senha conforme necessário para a conta que você deseja usar:

```
$> mysql --user=finley --password db_name
```

Se você prefere opções curtas, o comando é o seguinte:

```
$> mysql -u finley -p db_name
```

Se você omitir o valor da senha após a opção `--password` ou `-p` na linha de comando (como mostrado acima), o cliente solicitará uma senha. Alternativamente, a senha pode ser especificada na linha de comando:

```
$> mysql --user=finley --password=password db_name
$> mysql -u finley -ppassword db_name
```

Se você usar a opção `-p`, não deve haver *espaço* entre `-p` e o valor da senha a seguir.

Especificar uma senha na linha de comando deve ser considerado inseguro. Consulte a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”. Para evitar fornecer a senha na linha de comando, use um arquivo de opção ou um arquivo de caminho de login. Consulte a Seção 6.2.2.2, “Usando Arquivos de Opção”, e a Seção 6.6.7, “mysql_config_editor — Ferramenta de Configuração do MySQL”.

Para obter informações adicionais sobre a especificação de nomes de usuário, senhas e outros parâmetros de conexão, consulte a Seção 6.2.4, “Conectar ao servidor MySQL usando opções de comando”.

### 8.2.2 Privilegios fornecidos pelo MySQL

Os privilégios concedidos a uma conta MySQL determinam quais operações a conta pode realizar. Os privilégios do MySQL diferem nos contextos em que se aplicam e em diferentes níveis de operação:

* Os privilégios administrativos permitem que os usuários gerenciem a operação do servidor MySQL. Esses privilégios são globais, pois não são específicos para um banco de dados particular.

* Os privilégios do banco de dados se aplicam a um banco de dados e a todos os objetos dentro dele. Esses privilégios podem ser concedidos para bancos de dados específicos ou globalmente, para que se apliquem a todos os bancos de dados.

* Os privilégios para objetos de banco de dados, como tabelas, índices, visualizações e rotinas armazenadas, podem ser concedidos para objetos específicos dentro de um banco de dados, para todos os objetos de um determinado tipo dentro de um banco de dados (por exemplo, todas as tabelas em um banco de dados) ou globalmente para todos os objetos de um determinado tipo em todos os bancos de dados.

Os privilégios também diferem em termos de serem estáticos (construídos no servidor) ou dinâmicos (definidos em tempo de execução). Se um privilégio é estático ou dinâmico afeta sua disponibilidade para ser concedido a contas e papéis de usuário. Para informações sobre as diferenças entre privilégios estáticos e dinâmicos, consulte Privilegios estáticos versus dinâmicos.)

As informações sobre os privilégios da conta são armazenadas nas tabelas de concessão no banco de dados do sistema `mysql`. Para uma descrição da estrutura e do conteúdo dessas tabelas, consulte a Seção 8.2.3, “Tabelas de Concessão”. O servidor MySQL lê o conteúdo das tabelas de concessão na memória quando é iniciado e o recarrega nas circunstâncias indicadas na Seção 8.2.13, “Quando as Alterações de Privilegio Se Tornam Efetivas”. O servidor baseia as decisões de controle de acesso nas cópias de memória das tabelas de concessão.

Importante

Algumas versões do MySQL introduzem mudanças nas tabelas de concessão para adicionar novos privilégios ou recursos. Para garantir que você possa aproveitar quaisquer novas capacidades, atualize suas tabelas de concessão para a estrutura atual sempre que atualizar o MySQL. Veja o Capítulo 3, *Atualizando o MySQL*.

As seções a seguir resumem os privilégios disponíveis, fornecem descrições mais detalhadas de cada privilégio e oferecem diretrizes de uso.

* Resumo dos privilégios disponíveis
* Descrições estáticas dos privilégios
* Descrições dinâmicas dos privilégios
* Diretrizes para concessão de privilégios
* Privilegios estáticos versus dinâmicos
* Migração de contas de SUPER para privilégios dinâmicos

#### Resumo dos privilégios disponíveis

A tabela a seguir mostra os nomes dos privilégios estáticos utilizados nas declarações `GRANT` e `REVOKE`, juntamente com o nome da coluna associada a cada privilégio nas tabelas de concessão e o contexto em que o privilégio se aplica.

**Tabela 8.2 Permissões estáticas permitidas para GRANT e REVOKE**

<table><col style="width: 30%"/><col style="width: 33%"/><col style="width: 37%"/><thead><tr> <th scope="col">Privilege</th> <th scope="col">Grant Table Column</th> <th scope="col">Context</th> </tr></thead><tbody><tr> <th scope="row"><code>ALL [PRIVILEGES]</code></th> <td>Sinônimo de “todos os privilégios”</td> <td>Administração de servidores</td> </tr><tr> <th scope="row"><code>ALTER</code></th> <td><code>Alter_priv</code></td> <td>Tables</td> </tr><tr> <th scope="row"><code>ALTER ROUTINE</code></th> <td><code>Alter_routine_priv</code></td> <td>Stored routines</td> </tr><tr> <th scope="row"><code>CREATE</code></th> <td><code>Create_priv</code></td> <td>Databases, tables, or indexes</td> </tr><tr> <th scope="row"><code>CREATE ROLE</code></th> <td><code>Create_role_priv</code></td> <td>Server administration</td> </tr><tr> <th scope="row"><code>CREATE ROUTINE</code></th> <td><code>Create_routine_priv</code></td> <td>Stored routines</td> </tr><tr> <th scope="row"><code>CREATE TABLESPACE</code></th> <td><code>Create_tablespace_priv</code></td> <td>Server administration</td> </tr><tr> <th scope="row"><code>CREATE TEMPORARY TABLES</code></th> <td><code>Create_tmp_table_priv</code></td> <td>Tables</td> </tr><tr> <th scope="row"><code>CREATE USER</code></th> <td><code>Create_user_priv</code></td> <td>Server administration</td> </tr><tr> <th scope="row"><code>CREATE VIEW</code></th> <td><code>Create_view_priv</code></td> <td>Views</td> </tr><tr> <th scope="row"><code>DELETE</code></th> <td><code>Delete_priv</code></td> <td>Tables</td> </tr><tr> <th scope="row"><code>DROP</code></th> <td><code>Drop_priv</code></td> <td>Databases, tables, or views</td> </tr><tr> <th scope="row"><code>DROP ROLE</code></th> <td><code>Drop_role_priv</code></td> <td>Server administration</td> </tr><tr> <th scope="row"><code>EVENT</code></th> <td><code>Event_priv</code></td> <td>Databases</td> </tr><tr> <th scope="row"><code>EXECUTE</code></th> <td><code>Execute_priv</code></td> <td>Stored routines</td> </tr><tr> <th scope="row"><code>FILE</code></th> <td><code>File_priv</code></td> <td>File access on server host</td> </tr><tr> <th scope="row"><code>GRANT OPTION</code></th> <td><code>Grant_priv</code></td> <td>Bases de dados, tabelas ou rotinas armazenadas</td> </tr><tr> <th scope="row"><code>INDEX</code></th> <td><code>Index_priv</code></td> <td>Tables</td> </tr><tr> <th scope="row"><code>INSERT</code></th> <td><code>Insert_priv</code></td> <td>Tables or columns</td> </tr><tr> <th scope="row"><code>LOCK TABLES</code></th> <td><code>Lock_tables_priv</code></td> <td>Databases</td> </tr><tr> <th scope="row"><code>PROCESS</code></th> <td><code>Process_priv</code></td> <td>Server administration</td> </tr><tr> <th scope="row"><code>PROXY</code></th> <td>See <code>proxies_priv</code> table</td> <td>Server administration</td> </tr><tr> <th scope="row"><code>REFERENCES</code></th> <td><code>References_priv</code></td> <td>Databases or tables</td> </tr><tr> <th scope="row"><code>RELOAD</code></th> <td><code>Reload_priv</code></td> <td>Server administration</td> </tr><tr> <th scope="row"><code>REPLICATION CLIENT</code></th> <td><code>Repl_client_priv</code></td> <td>Server administration</td> </tr><tr> <th scope="row"><code>REPLICATION SLAVE</code></th> <td><code>Repl_slave_priv</code></td> <td>Server administration</td> </tr><tr> <th scope="row"><code>SELECT</code></th> <td><code>Select_priv</code></td> <td>Tables or columns</td> </tr><tr> <th scope="row"><code>SHOW DATABASES</code></th> <td><code>Show_db_priv</code></td> <td>Server administration</td> </tr><tr> <th scope="row"><code>SHOW VIEW</code></th> <td><code>Show_view_priv</code></td> <td>Views</td> </tr><tr> <th scope="row"><code>SHUTDOWN</code></th> <td><code>Shutdown_priv</code></td> <td>Server administration</td> </tr><tr> <th scope="row"><code>SUPER</code></th> <td><code>Super_priv</code></td> <td>Server administration</td> </tr><tr> <th scope="row"><code>TRIGGER</code></th> <td><code>Trigger_priv</code></td> <td>Tables</td> </tr><tr> <th scope="row"><code>UPDATE</code></th> <td><code>Update_priv</code></td> <td>Tables or columns</td> </tr><tr> <th scope="row"><code>USAGE</code></th> <td>Synonym for “no privileges”</td> <td>Server administration</td> </tr></tbody></table>

A tabela a seguir mostra os nomes de privilégio dinâmico utilizados nas declarações `GRANT` e `REVOKE`, juntamente com o contexto em que o privilégio se aplica.

**Tabela 8.3 Privilegios Dinâmicos Permitidos para GRANDE e REVOKE**

<table><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Privilege</th> <th>Contexto</th> </tr></thead><tbody><tr> <td><code>APPLICATION_PASSWORD_ADMIN</code></td> <td>Administração de senha dupla</td> </tr><tr> <td><code>AUDIT_ABORT_EXEMPT</code></td> <td>Permitir consultas bloqueadas pelo filtro do registro de auditoria</td> </tr><tr> <td><code>AUDIT_ADMIN</code></td> <td>Administração do log de auditoria</td> </tr><tr> <td><code>AUTHENTICATION_POLICY_ADMIN</code></td> <td>Administração de autenticação</td> </tr><tr> <td><code>BACKUP_ADMIN</code></td> <td>Administração de backup</td> </tr><tr> <td><code>BINLOG_ADMIN</code></td> <td>Administração de backup e replicação</td> </tr><tr> <td><code>BINLOG_ENCRYPTION_ADMIN</code></td> <td>Administração de backup e replicação</td> </tr><tr> <td><code>CLONE_ADMIN</code></td> <td>Administração de clone</td> </tr><tr> <td><code>CONNECTION_ADMIN</code></td> <td>Administração de servidores</td> </tr><tr> <td><code>ENCRYPTION_KEY_ADMIN</code></td> <td>Administração de servidores</td> </tr><tr> <td><code>FIREWALL_ADMIN</code></td> <td>Administração do firewall</td> </tr><tr> <td><code>FIREWALL_EXEMPT</code></td> <td>Administração do firewall</td> </tr><tr> <td><code>FIREWALL_USER</code></td> <td>Administração do firewall</td> </tr><tr> <td><code>FLUSH_OPTIMIZER_COSTS</code></td> <td>Administração de servidores</td> </tr><tr> <td><code>FLUSH_STATUS</code></td> <td>Administração de servidores</td> </tr><tr> <td><code>FLUSH_TABLES</code></td> <td>Administração de servidores</td> </tr><tr> <td><code>FLUSH_USER_RESOURCES</code></td> <td>Administração de servidores</td> </tr><tr> <td><code>GROUP_REPLICATION_ADMIN</code></td> <td>Administração de replicação</td> </tr><tr> <td><code>GROUP_REPLICATION_STREAM</code></td> <td>Administração de replicação</td> </tr><tr> <td><code>INNODB_REDO_LOG_ARCHIVE</code></td> <td>Administração de arquivamento de logs refazer</td> </tr><tr> <td><code>INNODB_REDO_LOG_ENABLE</code></td> <td>Administração de log vermelho</td> </tr><tr> <td><code>MASKING_DICTIONARIES_ADMIN</code></td> <td>Administração de servidores</td> </tr><tr> <td><code>NDB_STORED_USER</code></td> <td>NDB Cluster</td> </tr><tr> <td><code>PASSWORDLESS_USER_ADMIN</code></td> <td>Administração de autenticação</td> </tr><tr> <td><code>PERSIST_RO_VARIABLES_ADMIN</code></td> <td>Administração de servidores</td> </tr><tr> <td><code>REPLICATION_APPLIER</code></td> <td><code>PRIVILEGE_CHECKS_USER</code>para um canal de replicação</td> </tr><tr> <td><code>REPLICATION_SLAVE_ADMIN</code></td> <td>Administração de replicação</td> </tr><tr> <td><code>RESOURCE_GROUP_ADMIN</code></td> <td>Administração de grupo de recursos</td> </tr><tr> <td><code>RESOURCE_GROUP_USER</code></td> <td>Administração de grupo de recursos</td> </tr><tr> <td><code>ROLE_ADMIN</code></td> <td>Administração de servidores</td> </tr><tr> <td><code>SENSITIVE_VARIABLES_OBSERVER</code></td> <td>Administração de servidores</td> </tr><tr> <td><code>SESSION_VARIABLES_ADMIN</code></td> <td>Administração de servidores</td> </tr><tr> <td><code>SET_USER_ID</code></td> <td>Administração de servidores</td> </tr><tr> <td><code>SHOW_ROUTINE</code></td> <td>Administração de servidores</td> </tr><tr> <td><code>SKIP_QUERY_REWRITE</code></td> <td>Administração de servidores</td> </tr><tr> <td><code>SYSTEM_USER</code></td> <td>Administração de servidores</td> </tr><tr> <td><code>SYSTEM_VARIABLES_ADMIN</code></td> <td>Administração de servidores</td> </tr><tr> <td><code>TABLE_ENCRYPTION_ADMIN</code></td> <td>Administração de servidores</td> </tr><tr> <td><code>TELEMETRY_LOG_ADMIN</code></td> <td>Administração de registro de telemetria para MySQL HeatWave na AWS</td> </tr><tr> <td><code>TP_CONNECTION_ADMIN</code></td> <td>Administração do pool de fios</td> </tr><tr> <td><code>VERSION_TOKEN_ADMIN</code></td> <td>Administração de servidores</td> </tr><tr> <td><code>XA_RECOVER_ADMIN</code></td> <td>Administração de servidores</td> </tr></tbody></table>

#### Descrições de privilégios estáticos

Os privilégios estáticos são construídos no servidor, em contraste com os privilégios dinâmicos, que são definidos em tempo de execução. A lista a seguir descreve cada privilégio estático disponível no MySQL.

As declarações SQL específicas podem ter requisitos de privilégio mais específicos do que o indicado aqui. Se assim for, a descrição da declaração em questão fornece os detalhes.

* `ALL`, `ALL PRIVILEGES`[(privileges-provided.html#priv_all)]

Esses especizadores de privilégio são abreviações para “todos os privilégios disponíveis em um nível de privilégio dado” (exceto `GRANT OPTION`). Por exemplo, conceder `ALL` no nível global ou de tabela concede todos os privilégios globais ou todos os privilégios de nível de tabela, respectivamente.

* `ALTER`

Permite o uso da declaração `ALTER TABLE`(alter-table.html "15.1.9 ALTER TABLE Statement") para alterar a estrutura das tabelas. `ALTER TABLE` também requer os privilégios `CREATE` e `INSERT`. Para renomear uma tabela, são necessários `ALTER` e `DROP` na tabela antiga, `CREATE`, e `INSERT` na nova tabela.

* `ALTER ROUTINE`

Permite o uso de declarações que alteram ou excluem rotinas armazenadas (procedimentos e funções armazenadas). Para rotinas que estejam dentro do escopo em que o privilégio é concedido e para as quais o usuário não seja o usuário nomeado como a rotina `DEFINER`, também permite o acesso a propriedades de rotina que não sejam a definição da rotina.

* `CREATE`

Permite o uso de declarações que criam novos bancos de dados e tabelas.

* `CREATE ROLE`

Permite o uso da declaração `CREATE ROLE` (create-role.html "15.7.1.2 CREATE ROLE Statement"). (O privilégio `CREATE USER` (privileges-provided.html#priv_create-user) também permite o uso da declaração `CREATE ROLE`. Ver Seção 8.2.10, “Usando papéis”.

Os privilégios `CREATE ROLE` e `DROP ROLE` não são tão poderosos quanto o `CREATE USER`, pois só podem ser usados para criar e descartar contas. Não podem ser usados como o `CREATE USER` pode modificar atributos de contas ou renomear contas. Veja a Interchangeabilidade de Usuários e de Papel.

* `CREATE ROUTINE`

Permite o uso de declarações que criam rotinas armazenadas (procedimentos e funções armazenadas). Para rotinas que estão dentro do escopo em que o privilégio é concedido e para as quais o usuário não é o usuário nomeado como a rotina `DEFINER`, também permite o acesso a propriedades de rotina que não são a definição da rotina.

* `CREATE TABLESPACE`

Permite o uso de declarações que criam, alteram ou eliminam espaços de tabela e grupos de arquivos de registro.

* `CREATE TEMPORARY TABLES`

Permite a criação de tabelas temporárias usando a declaração `CREATE TEMPORARY TABLE`.

Após uma sessão ter criado uma tabela temporária, o servidor não realiza mais verificações de privilégio na tabela. A sessão que criou a tabela pode realizar qualquer operação na tabela, como `DROP TABLE`, `INSERT`, `UPDATE` ou `SELECT`. Para mais informações, consulte a Seção 15.1.20.2, “Declaração CREATE TEMPORARY TABLE”.

* `CREATE USER`

Permite o uso das declarações `ALTER USER`(alter-user.html "15.7.1.1 ALTER USER Statement"), `CREATE ROLE`, `CREATE USER`, `DROP ROLE`, `DROP USER`, `RENAME USER` e `REVOKE ALL PRIVILEGES`(revoke.html "15.7.1.8 REVOKE Statement").

* `CREATE VIEW`

Permite o uso da declaração [[`CREATE VIEW`][(create-view.html "15.1.23 CREATE VIEW Statement")]].

* `DELETE`

Permite a exclusão de linhas de tabelas em um banco de dados.

* `DROP`

Permite o uso de declarações que excluem (removem) bancos de dados, tabelas e visualizações existentes. O privilégio `DROP` é necessário para usar a declaração `ALTER TABLE ... DROP PARTITION` em uma tabela particionada. O privilégio `DROP` também é necessário para `TRUNCATE TABLE`.

* `DROP ROLE`

Permite o uso da declaração `DROP ROLE`. (O privilégio `CREATE USER` também permite o uso da declaração `DROP ROLE`(drop-role.html "15.7.1.4 DROP ROLE Statement"). Veja a Seção 8.2.10, “Usando papéis”.

Os privilégios `CREATE ROLE` e `DROP ROLE` não são tão poderosos quanto o `CREATE USER`, pois só podem ser usados para criar e descartar contas. Eles não podem ser usados como o `CREATE USER` pode modificar atributos de contas ou renomear contas. Veja a Interchangeabilidade de Usuários e de Papel.

* `EVENT`

Permite o uso de declarações que criam, alteram, excluem ou exibem eventos para o Agendamento de Eventos.

* `EXECUTE`

Permite o uso de declarações que executam rotinas armazenadas (procedimentos e funções armazenadas). Para rotinas que estão dentro do escopo em que o privilégio é concedido e para as quais o usuário não é o usuário nomeado como a rotina `DEFINER`, também permite o acesso a propriedades de rotina que não são a definição da rotina.

* `FILE`

Afeta as seguintes operações e comportamentos do servidor:

+ Permite a leitura e escrita de arquivos no host do servidor usando as declarações `LOAD DATA` e [`SELECT ... INTO OUTFILE`](select-into.html "15.2.13.1 SELECT ... INTO Statement") e a função `LOAD_FILE()`. Um usuário que possui o privilégio `FILE` pode ler qualquer arquivo no host do servidor que seja legível para o mundo ou legível pelo servidor MySQL. (Isso implica que o usuário pode ler qualquer arquivo em qualquer diretório do banco de dados, porque o servidor pode acessar qualquer um desses arquivos.)

+ Permite a criação de novos arquivos em qualquer diretório onde o servidor MySQL tenha acesso de escrita. Isso inclui o diretório de dados do servidor, que contém os arquivos que implementam as tabelas de privilégio.

+ Permite o uso da opção de tabela `DATA DIRECTORY` ou `INDEX DIRECTORY` para a declaração `CREATE TABLE`.

Como medida de segurança, o servidor não sobrescreve os arquivos existentes.

Para limitar a localização em que os arquivos podem ser lidos e escritos, defina a variável de sistema `secure_file_priv` para um diretório específico. Veja a Seção 7.1.8, “Variáveis do sistema do servidor”.

* `GRANT OPTION`

Permite que você conceda ou revogue a outros usuários os privilégios que você mesmo possui.

* `INDEX`

Permite o uso de declarações que criam ou removem índices. `INDEX` se aplica a tabelas existentes. Se você tem o privilégio `CREATE` para uma tabela, você pode incluir definições de índice na declaração `CREATE TABLE`.

* `INSERT`

Permite que linhas sejam inseridas em tabelas de um banco de dados. `INSERT` também é necessário para as declarações de manutenção de tabela `ANALYZE TABLE`, `OPTIMIZE TABLE` e `REPAIR TABLE`.

* `LOCK TABLES`

Permite o uso de declarações explícitas `LOCK TABLES`(lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") para bloquear tabelas para as quais você tem o privilégio `SELECT`. Isso inclui o uso de bloqueios de escrita, que impede que outras sessões leiam a tabela bloqueada.

* `PROCESS`

O privilégio `PROCESS` controla o acesso às informações sobre os threads que estão sendo executados no servidor (ou seja, informações sobre as declarações que estão sendo executadas pelas sessões). As informações sobre os threads disponíveis usando a declaração `SHOW PROCESSLIST`, o comando **mysqladmin processlist**, a tabela do Esquema de Informações `PROCESSLIST` e a tabela do Schema de Desempenho `processlist` são acessíveis da seguinte forma:

+ Com o privilégio `PROCESS`, um usuário tem acesso a informações sobre todas as threads, mesmo aquelas pertencentes a outros usuários.

+ Sem o privilégio `PROCESS`, os usuários não anônimos têm acesso às informações sobre seus próprios tópicos, mas não sobre os tópicos de outros usuários, e os usuários anônimos não têm acesso às informações dos tópicos.

Nota

A tabela do Schema de Desempenho `threads` também fornece informações sobre os threads, mas o acesso à tabela utiliza um modelo de privilégio diferente. Veja a Seção 29.12.21.8, “A tabela de threads”.

O privilégio `PROCESS` também permite o uso da declaração (show-engine.html "15.7.7.15 SHOW ENGINE Statement"), acesso às tabelas `INFORMATION_SCHEMA` `InnoDB` (tabelas com nomes que começam com `INNODB_`), e (a partir do MySQL 8.0.21) acesso à tabela `INFORMATION_SCHEMA` `FILES`.

* `PROXY`

Permite que um usuário se imite ou se torne conhecido como outro usuário. Veja a Seção 8.2.19, “Usuários Proxy”.

* `REFERENCES`

A criação de uma restrição de chave estrangeira requer o privilégio `REFERENCES` para a tabela pai.

* `RELOAD`

O `RELOAD` permite as seguintes operações:

+ Uso da declaração `FLUSH`.

+ Uso dos comandos do **mysqladmin** que são equivalentes às operações do `FLUSH`: `flush-hosts`, `flush-logs`, `flush-privileges`, `flush-status`, `flush-tables`, `flush-threads`, `refresh` e `reload`.

O comando `reload` indica ao servidor que recarregue as tabelas de concessão na memória. `flush-privileges` é sinônimo de `reload`. O comando `refresh` fecha e reabre os arquivos de registro e esvazia todas as tabelas. Os outros comandos `flush-xxx` realizam funções semelhantes a `refresh`, mas são mais específicos e podem ser preferíveis em algumas situações. Por exemplo, se você deseja esvaziar apenas os arquivos de registro, `flush-logs` é uma escolha melhor do que `refresh`.

+ Uso das opções do **mysqldump** que realizam várias operações `FLUSH`: `--flush-logs` e `--master-data`.

+ Uso das declarações `RESET MASTER` e [`RESET REPLICA`](reset-replica.html "15.4.2.4 RESET REPLICA Statement") (ou antes do MySQL 8.0.22, [`RESET SLAVE`](reset-slave.html "15.4.2.5 RESET SLAVE Statement"))

* `REPLICATION CLIENT`

Permite o uso das declarações `SHOW MASTER STATUS`(show-master-status.html "15.7.7.23 SHOW MASTER STATUS Statement"), `SHOW REPLICA STATUS`(show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") e `SHOW BINARY LOGS`(show-binary-logs.html "15.7.7.1 SHOW BINARY LOGS Statement").

* `REPLICATION SLAVE`

Permite que a conta solicite atualizações que foram feitas em bancos de dados no servidor de origem de replicação, usando as declarações `SHOW REPLICAS`(show-replicas.html "15.7.7.33 SHOW REPLICAS Statement") (ou antes do MySQL 8.0.22, `SHOW SLAVE HOSTS`(show-slave-hosts.html "15.7.7.34 SHOW SLAVE HOSTS | SHOW REPLICAS Statement"), `SHOW RELAYLOG EVENTS`(show-relaylog-events.html "15.7.7.32 SHOW RELAYLOG EVENTS Statement") e `SHOW BINLOG EVENTS`(show-binlog-events.html "15.7.7.2 SHOW BINLOG EVENTS Statement")). Este privilégio também é necessário para usar as opções **mysqlbinlog** `--read-from-remote-server` (`-R`), `--read-from-remote-source` e `--read-from-remote-master`. Concede este privilégio às contas que são usadas pelas réplicas para se conectarem ao servidor atual como seu servidor de origem de replicação.

* `SELECT`

Permite que as linhas sejam selecionadas a partir de tabelas em um banco de dados. As declarações `SELECT` exigem o privilégio `SELECT` apenas se elas realmente acessarem tabelas. Algumas declarações `SELECT` não acessam tabelas e podem ser executadas sem permissão para qualquer banco de dados. Por exemplo, você pode usar `SELECT` como uma calculadora simples para avaliar expressões que não fazem referência a tabelas:

  ```
  SELECT 1+1;
  SELECT PI()*2;
  ```

O privilégio `SELECT` também é necessário para outras declarações que leem valores de coluna. Por exemplo, `SELECT` é necessário para colunas referenciadas no lado direito da atribuição de *`col_name`*=*`expr`* em declarações `UPDATE` ou para colunas nomeadas na cláusula `WHERE` de declarações `DELETE` ou `UPDATE`.

O privilégio `SELECT` é necessário para tabelas ou visualizações usadas com `EXPLAIN`, incluindo quaisquer tabelas subjacentes nas definições de visualizações.

* `SHOW DATABASES`

Permite que a conta veja os nomes dos bancos de dados emitindo a declaração `SHOW DATABASE`. As contas que não possuem esse privilégio veem apenas os bancos de dados para os quais possuem alguns privilégios e não podem usar a declaração de forma alguma se o servidor foi iniciado com a opção `--skip-show-database`.

Cuidado

Como qualquer privilégio global estático é considerado um privilégio para todas as bases de dados, qualquer privilégio global estático permite que um usuário veja todos os nomes de base de dados com `SHOW DATABASES` ou examinando a tabela `SCHEMATA` de `INFORMATION_SCHEMA`, exceto as bases de dados que foram restringidas no nível da base de dados por revogações parciais.

* `SHOW VIEW`

Permite o uso da declaração `SHOW CREATE VIEW`(show-create-view.html "15.7.7.13 SHOW CREATE VIEW Statement"). Este privilégio também é necessário para visualizações usadas com `EXPLAIN`.

* `SHUTDOWN`

Permite o uso das declarações `SHUTDOWN` e `RESTART`, o comando **mysqladmin shutdown** e a função de API em C `mysql_shutdown()`.

* `SUPER`

`SUPER` é um privilégio poderoso e de grande alcance e não deve ser concedido sem ponderar. Se uma conta precisar realizar apenas um subconjunto das operações de `SUPER`, é possível obter o conjunto de privilégios desejado concedendo em vez disso um ou mais privilégios dinâmicos, cada um dos quais confere capacidades mais limitadas. Veja Descrições de Privilegios Dinâmicos.

Nota

`SUPER` é descontinuado e você deve esperar que ele seja removido em uma versão futura do MySQL. Veja Migrar contas de SUPER para privilégios dinâmicos.

`SUPER` afeta as seguintes operações e comportamentos do servidor:

+ Permite alterações de variáveis do sistema em tempo de execução:

- Permite que as alterações de configuração do servidor sejam feitas em variáveis do sistema global com `SET GLOBAL` (set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") e `SET PERSIST` (set-variable.html "15.7.6.1 SET Syntax for Variable Assignment").

O privilégio dinâmico correspondente é `SYSTEM_VARIABLES_ADMIN`.

- Permite definir variáveis de sistema de sessão restritas que exigem um privilégio especial.

O privilégio dinâmico correspondente é `SESSION_VARIABLES_ADMIN`.

Veja também a Seção 7.1.9.1, “Privilegios de variáveis do sistema”.

+ Permite alterações nas características de transação global (consulte a Seção 15.3.7, “Instrução SET TRANSACTION”).

O privilégio dinâmico correspondente é `SYSTEM_VARIABLES_ADMIN`.

+ Permite que a conta comece e pare a replicação, incluindo a Replicação em Grupo.

O privilégio dinâmico correspondente é `REPLICATION_SLAVE_ADMIN` para replicação regular, `GROUP_REPLICATION_ADMIN` para replicação de grupo.

+ Permite o uso das declarações `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (do MySQL 8.0.23), `CHANGE MASTER TO` (antes do MySQL 8.0.23) e das declarações `CHANGE REPLICATION FILTER`.

O privilégio dinâmico correspondente é `REPLICATION_SLAVE_ADMIN`.

+ Permite o controle de registro binário por meio das declarações `PURGE BINARY LOGS` e `BINLOG`.

O privilégio dinâmico correspondente é `BINLOG_ADMIN`.

+ Permite definir o ID de autorização efetivo ao executar uma visão ou um programa armazenado. Um usuário com este privilégio pode especificar qualquer conta no atributo `DEFINER` de uma visão ou programa armazenado.

O privilégio dinâmico correspondente é `SET_USER_ID`.

+ Permite o uso das declarações `CREATE SERVER`(create-server.html "15.1.18 CREATE SERVER Statement"), `ALTER SERVER`(alter-server.html "15.1.8 ALTER SERVER Statement") e `DROP SERVER`(drop-server.html "15.1.30 DROP SERVER Statement").

+ Permite o uso do comando **mysqladmin debug**.

+ Habilita a rotação da chave de criptografia `InnoDB`.

O privilégio dinâmico correspondente é `ENCRYPTION_KEY_ADMIN`.

+ Permite a execução das funções de Tokens de Versão.

O privilégio dinâmico correspondente é `VERSION_TOKEN_ADMIN`.

+ Permite conceder e revogar papéis, uso da cláusula `WITH ADMIN OPTION` da declaração `GRANT`, e conteúdo de elemento `<graphml>` não vazio no resultado da função `ROLES_GRAPHML()`.

O privilégio dinâmico correspondente é `ROLE_ADMIN`.

+ Permite o controle sobre conexões de clientes que não são permitidas para contas não `SUPER`:

- Permite o uso da declaração `KILL` ou do comando **mysqladmin kill** para matar os threads pertencentes a outras contas. (Uma conta sempre pode matar seus próprios threads.)

- O servidor não executa o conteúdo da variável de sistema `init_connect` quando os clientes `SUPER` se conectam.

- O servidor aceita uma conexão de um cliente `SUPER`, mesmo que o limite de conexão configurado pela variável de sistema `max_connections` seja atingido.

- Um servidor em modo offline (habilitado `offline_mode`) não encerra as conexões do cliente `SUPER` na próxima solicitação do cliente e aceita novas conexões dos clientes `SUPER`.

- As atualizações podem ser realizadas mesmo quando a variável de sistema `read_only` está habilitada. Isso se aplica a atualizações explícitas de tabela e ao uso de declarações de gerenciamento de contas, como `GRANT` e `REVOKE` que atualizam tabelas implicitamente.

O privilégio dinâmico correspondente para as operações de controle de conexão anterior é `CONNECTION_ADMIN`.

Você também pode precisar do privilégio `SUPER` para criar ou alterar funções armazenadas se o registro binário estiver habilitado, conforme descrito na Seção 27.7, “Registro Binário de Programas Armazenados”.

* `TRIGGER`

Permite operações de gatilho. Você deve ter esse privilégio para criar, descartar, executar ou exibir gatilhos para uma tabela.

Quando um gatilho é ativado (por um usuário que tem privilégios para executar as instruções `INSERT`, `UPDATE` ou `DELETE` para a tabela associada ao gatilho), a execução do gatilho exige que o usuário que definiu o gatilho ainda tenha o privilégio `TRIGGER` para a tabela.

* `UPDATE`

Permite que as linhas sejam atualizadas em tabelas de um banco de dados.

* `USAGE`

Este especificador de privilégio significa “sem privilégios”. É usado a nível global com `GRANT` para especificar cláusulas como `WITH GRANT OPTION` sem nomear privilégios específicos da conta na lista de privilégios. `SHOW GRANTS` exibe `USAGE` para indicar que uma conta não tem privilégios em um nível de privilégio.

#### Descrições de privilégios dinâmicos

Os privilégios dinâmicos são definidos em tempo de execução, em contraste com os privilégios estáticos, que são construídos no servidor. A lista a seguir descreve cada privilégio dinâmico disponível no MySQL.

A maioria dos privilégios dinâmicos é definida na inicialização do servidor. Outros são definidos por um componente ou plugin específico, conforme indicado nas descrições dos privilégios. Nesses casos, o privilégio não está disponível, a menos que o componente ou plugin que o define esteja habilitado.

As declarações SQL específicas podem ter requisitos de privilégio mais específicos do que o indicado aqui. Se assim for, a descrição da declaração em questão fornece os detalhes.

* `APPLICATION_PASSWORD_ADMIN` (adicionado no MySQL 8.0.14)

Para a capacidade de usar duas senhas, este privilégio permite o uso das cláusulas `RETAIN CURRENT PASSWORD` e `DISCARD OLD PASSWORD` para as declarações `ALTER USER` e `SET PASSWORD` que se aplicam à sua própria conta. Este privilégio é necessário para manipular sua senha secundária, pois a maioria dos usuários exige apenas uma senha.

Se uma conta deve ser permitida para manipular senhas secundárias para todas as contas, ela deve ser concedida o privilégio `CREATE USER` em vez de `APPLICATION_PASSWORD_ADMIN`.

Para mais informações sobre o uso de senhas duplas, consulte a Seção 8.2.15, “Gestão de Senhas”.

* `AUDIT_ABORT_EXEMPT` (adicionado no MySQL 8.0.28)

Permite consultas bloqueadas por um item "abort" no filtro do registro de auditoria. Este privilégio é definido pelo plugin `audit_log`; veja a Seção 8.4.5, "Auditoria do MySQL Enterprise".

As contas criadas no MySQL 8.0.28 ou posterior com o privilégio `SYSTEM_USER` têm o privilégio `AUDIT_ABORT_EXEMPT` atribuído automaticamente quando são criadas. O privilégio `AUDIT_ABORT_EXEMPT` também é atribuído às contas existentes com o privilégio `SYSTEM_USER` quando você realiza um procedimento de atualização com o MySQL 8.0.28 ou posterior, se nenhuma conta existente tiver esse privilégio atribuído. As contas com o privilégio `SYSTEM_USER` podem, portanto, ser usadas para recuperar o acesso a um sistema após uma configuração incorreta de auditoria.

* `AUDIT_ADMIN`

Permite a configuração do log de auditoria. Este privilégio é definido pelo plugin `audit_log`; veja a Seção 8.4.5, “Auditoria da Empresa MySQL”.

* `BACKUP_ADMIN`

Permite a execução da declaração `LOCK INSTANCE FOR BACKUP` e o acesso à tabela do Schema de Desempenho (lock-instance-for-backup.html "15.3.5 LOCK INSTANCE FOR BACKUP and UNLOCK INSTANCE Statements").

Nota

Além do `BACKUP_ADMIN`, o privilégio `SELECT` na tabela `log_status` também é necessário para seu acesso.

O privilégio `BACKUP_ADMIN` é concedido automaticamente aos usuários com o privilégio `RELOAD` ao realizar uma atualização in-place para o MySQL 8.0 a partir de uma versão anterior.

* `AUTHENTICATION_POLICY_ADMIN` (adicionado no MySQL 8.0.27)

A variável de sistema `authentication_policy` estabelece certas restrições sobre a forma como as cláusulas relacionadas à autenticação das declarações `CREATE USER` e `ALTER USER` podem ser utilizadas. Um usuário que possui o privilégio `AUTHENTICATION_POLICY_ADMIN` não está sujeito a essas restrições. (Um aviso ocorre para declarações que, de outra forma, não seriam permitidas.)

Para obter detalhes sobre as restrições impostas por `authentication_policy`, consulte a descrição dessa variável.

* `BINLOG_ADMIN`

Permite o controle de registro binário por meio das declarações `PURGE BINARY LOGS` e `BINLOG`.

* `BINLOG_ENCRYPTION_ADMIN`

Permite definir a variável de sistema `binlog_encryption`, que ativa ou desativa a criptografia para arquivos de registro binários e arquivos de registro de releio. Esta capacidade não é fornecida pelos privilégios `BINLOG_ADMIN`, `SYSTEM_VARIABLES_ADMIN` ou `SESSION_VARIABLES_ADMIN`. A variável de sistema relacionada `binlog_rotate_encryption_master_key_at_startup`, que rotação da chave mestre de registro binário automaticamente quando o servidor é reiniciado, não requer este privilégio.

* `CLONE_ADMIN`

Permite a execução das declarações `CLONE`. Inclui os privilégios `BACKUP_ADMIN` e `SHUTDOWN`.

* `CONNECTION_ADMIN`

Permite o uso da declaração `KILL` ou do comando **mysqladmin kill** para matar os threads pertencentes a outras contas. (Uma conta sempre pode matar seus próprios threads.)

Permite definir variáveis de sistema relacionadas a conexões de clientes ou contornar restrições relacionadas a conexões de clientes. A partir do MySQL 8.0.31, `CONNECTION_ADMIN` é necessário para ativar o modo offline do MySQL Server, que é feito alterando o valor da variável de sistema `offline_mode` para `ON`.

O privilégio `CONNECTION_ADMIN` permite que os administradores o utilizem para contornar os efeitos dessas variáveis do sistema:

+ `init_connect`: O servidor não executa o conteúdo da variável de sistema `init_connect` quando os clientes `CONNECTION_ADMIN` se conectam.

+ `max_connections`: O servidor aceita uma conexão de um cliente `CONNECTION_ADMIN`, mesmo que o limite de conexão configurado pela variável de sistema `max_connections` seja atingido.

+ `offline_mode`: Um servidor em modo offline (`offline_mode` ativado) não encerra as conexões do cliente `CONNECTION_ADMIN` na próxima solicitação do cliente e aceita novas conexões dos clientes `CONNECTION_ADMIN`.

+ `read_only`: As atualizações dos clientes do sistema `CONNECTION_ADMIN` podem ser realizadas mesmo quando a variável de sistema `read_only` está habilitada. Isso se aplica a atualizações explícitas de tabela e a declarações de gerenciamento de contas, como `GRANT` e `REVOKE` que atualizam tabelas implicitamente.

Os membros do grupo de Replicação em grupo precisam do privilégio `CONNECTION_ADMIN` para que as conexões de Replicação em grupo não sejam terminadas se um dos servidores envolvidos for colocado no modo offline. Se a pilha de comunicação MySQL estiver em uso (`group_replication_communication_stack = MYSQL`](group-replication-system-variables.html#sysvar_group_replication_communication_stack)), sem este privilégio, um membro que for colocado no modo offline é expulso do grupo.

* `ENCRYPTION_KEY_ADMIN`

Permite a rotação da chave de criptografia `InnoDB`.

* `FIREWALL_ADMIN`

Permite que um usuário administre regras de firewall para qualquer usuário. Esse privilégio é definido pelo plugin [[`MYSQL_FIREWALL`]; consulte Seção 8.4.7, “Firewall Empresarial MySQL”.

* `FIREWALL_EXEMPT` (adicionado no MySQL 8.0.27)

Um usuário com este privilégio está isento das restrições do firewall. Este privilégio é definido pelo plugin `MYSQL_FIREWALL`; veja a Seção 8.4.7, “Firewall Empresarial MySQL”.

* `FIREWALL_USER`

Permite que os usuários atualizem suas próprias regras de firewall. Esse privilégio é definido pelo plugin `MYSQL_FIREWALL`; veja a Seção 8.4.7, “Firewall Empresarial MySQL”.

* `FLUSH_OPTIMIZER_COSTS` (adicionado no MySQL 8.0.23)

Permite o uso da declaração `FLUSH OPTIMIZER_COSTS`(flush.html#flush-optimizer-costs).

* `FLUSH_STATUS` (adicionado no MySQL 8.0.23)

Permite o uso da declaração `FLUSH STATUS`(flush.html#flush-status).

* `FLUSH_TABLES` (adicionado no MySQL 8.0.23)

Permite o uso da declaração [[`FLUSH TABLES`][(flush.html#flush-tables)]].

* `FLUSH_USER_RESOURCES` (adicionado no MySQL 8.0.23)

Permite o uso da declaração [[`FLUSH USER_RESOURCES`][(flush.html#flush-user-resources)]].

* `GROUP_REPLICATION_ADMIN`

Permite que a conta comece e pare a Replicação de Grupo usando as declarações `START GROUP REPLICATION`(start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement") e `STOP GROUP REPLICATION`(stop-group-replication.html "15.4.3.2 STOP GROUP_REPLICATION Statement"), para alterar o ajuste global para a variável de sistema `group_replication_consistency`, e para usar as funções `group_replication_set_write_concurrency()` e `group_replication_set_communication_protocol()`. Concede este privilégio às contas que são usadas para administrar servidores que são membros de um grupo de replicação.

* `GROUP_REPLICATION_STREAM`

Permite que uma conta de usuário seja usada para estabelecer conexões de comunicação de grupo da Replicação em Grupo. Deve ser concedida a um usuário de recuperação quando a pilha de comunicação MySQL é usada para Replicação em Grupo (`group_replication_communication_stack=MYSQL`).

* `INNODB_REDO_LOG_ARCHIVE`

Permite que a conta ative e desative o arquivamento do log de refazer.

* `INNODB_REDO_LOG_ENABLE`

Permite o uso da declaração `ALTER INSTANCE {ENABLE|DISABLE} INNODB REDO_LOG`(alter-instance.html "15.1.5 ALTER INSTANCE Statement") para habilitar ou desabilitar o registro de refazer. Introduzido no MySQL 8.0.21.

Veja Desabilitar o registro de refazer.

* `MASKING_DICTIONARIES_ADMIN`

Permite que a conta adicione e remova termos do dicionário usando as funções de componentes `masking_dictionary_term_add()` e `masking_dictionary_term_remove()`. As contas também requerem esse privilégio dinâmico para remover um dicionário completo usando a função `masking_dictionary_remove()`, que remove todos os termos associados ao dicionário nomeado atualmente na tabela `mysql.masking_dictionaries`.

Veja a Seção 8.5, “Mascagem de Dados Empresariais e Desidentificação do MySQL”.

* `NDB_STORED_USER`

Permite que o usuário ou o papel e seus privilégios sejam compartilhados e sincronizados entre todos os servidores MySQL habilitados para `NDB` assim que eles se juntarem a um NDB Cluster específico. Este privilégio está disponível apenas se o mecanismo de armazenamento `NDB` estiver habilitado.

Quaisquer alterações ou revogações de privilégios feitas para o usuário ou papel específico são sincronizadas imediatamente com todos os servidores MySQL conectados (nós SQL). Você deve estar ciente de que não há garantia de que múltiplas declarações que afetam privilégios originados de diferentes nós SQL sejam executadas em todos os nós SQL na mesma ordem. Por essa razão, é altamente recomendado que toda administração de usuário seja feita a partir de um único nó SQL designado.

`NDB_STORED_USER` é um privilégio global e deve ser concedido ou revogado usando `ON *.*`. Tentar definir qualquer outro escopo para este privilégio resulta em um erro. Este privilégio pode ser concedido à maioria dos usuários de aplicativos e administrativos, mas não pode ser concedido a contas reservadas do sistema, como `mysql.session@localhost` ou `mysql.infoschema@localhost`.

Um usuário que tenha sido concedido o privilégio `NDB_STORED_USER` é armazenado em `NDB` (e, portanto, compartilhado por todos os nós do SQL), assim como um papel com este privilégio. Um usuário que tenha apenas sido concedido um papel que tenha `NDB_STORED_USER` não é armazenado em `NDB`; cada usuário armazenado `NDB` deve ser concedido o privilégio explicitamente.

Para informações mais detalhadas sobre como isso funciona em `NDB`, consulte a Seção 25.6.13, “Sincronização de privilégios e NDB_STORED_USER”.

O privilégio `NDB_STORED_USER` está disponível a partir do NDB 8.0.18.

* `PASSWORDLESS_USER_ADMIN` (adicionado no MySQL 8.0.27)

Este privilégio se aplica a contas de usuários sem senha:

+ Para a criação de uma conta, um usuário que executa `CREATE USER` para criar uma conta sem senha deve possuir o privilégio `PASSWORDLESS_USER_ADMIN`.

+ No contexto de replicação, o privilégio `PASSWORDLESS_USER_ADMIN` se aplica aos usuários de replicação e permite a replicação de declarações `ALTER USER ... MODIFY` (alter-user.html "15.7.1.1 ALTER USER Statement") para contas de usuário que estão configuradas para autenticação sem senha.

Para informações sobre autenticação sem senha, consulte Autenticação sem senha FIDO.

* `PERSIST_RO_VARIABLES_ADMIN`

Para usuários que também possuem `SYSTEM_VARIABLES_ADMIN`, `PERSIST_RO_VARIABLES_ADMIN` permite o uso de [`SET PERSIST_ONLY`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") para persistir variáveis de sistema global no arquivo de opção `mysqld-auto.cnf` no diretório de dados. Esta declaração é semelhante a [`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") mas não modifica o valor da variável de sistema global de tempo de execução. Isso torna [`SET PERSIST_ONLY`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") adequado para configurar variáveis de sistema somente leitura que podem ser definidas apenas na inicialização do servidor.

Veja também a Seção 7.1.9.1, “Privilegios de variáveis do sistema”.

* `REPLICATION_APPLIER`

Permite que a conta atue como o `PRIVILEGE_CHECKS_USER` para um canal de replicação e execute as instruções `BINLOG` na saída do **mysqlbinlog**. Atenda a este privilégio às contas que são atribuídas usando `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes do MySQL 8.0.23) para fornecer um contexto de segurança para os canais de replicação e para lidar com erros de replicação nesses canais. Além do privilégio `REPLICATION_APPLIER`, você também deve conceder ao usuário os privilégios necessários para executar as transações recebidas pelo canal de replicação ou contidas na saída do **mysqlbinlog**, por exemplo, para atualizar as tabelas afetadas. Para mais informações, consulte a Seção 19.3.3, “Verificação de Privilegios de Replicação”.

* `REPLICATION_SLAVE_ADMIN`

Permite que a conta se conecte ao servidor de origem de replicação, comece e pare a replicação usando as declarações `START REPLICA`(start-replica.html "15.4.2.6 START REPLICA Statement") e `STOP REPLICA`(stop-replica.html "15.4.2.8 STOP REPLICA Statement") e use a declaração `CHANGE REPLICATION SOURCE TO` (do MySQL 8.0.23) ou a declaração `CHANGE MASTER TO`(change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes do MySQL 8.0.23) e as declarações `CHANGE REPLICATION FILTER`. Conceda este privilégio às contas que são usadas pelas réplicas para se conectarem ao servidor atual como seu servidor de origem de replicação. Este privilégio não se aplica à Replicação por Grupo; use `GROUP_REPLICATION_ADMIN` para isso.

* `RESOURCE_GROUP_ADMIN`

Permite a gestão de grupos de recursos, que consiste em criar, alterar e eliminar grupos de recursos, bem como a atribuição de threads e declarações a grupos de recursos. Um utilizador com este privilégio pode realizar qualquer operação relacionada com grupos de recursos.

* `RESOURCE_GROUP_USER`

Permite a atribuição de threads e instruções a grupos de recursos. Um usuário com este privilégio pode usar a instrução `SET RESOURCE GROUP` e a dica de otimização `RESOURCE_GROUP`.

* `ROLE_ADMIN`

Permite conceder e revogar papéis, uso da cláusula `WITH ADMIN OPTION` da declaração `GRANT` e conteúdo de elemento `<graphml>` não vazio no resultado da função `ROLES_GRAPHML()`. É necessário definir o valor da variável de sistema `mandatory_roles`.

* `SENSITIVE_VARIABLES_OBSERVER` (adicionado no MySQL 8.0.29)

Permite que um titular visualize os valores das variáveis de sistema sensíveis nas tabelas do Schema de desempenho `global_variables`, `session_variables`, `variables_by_thread` e `persisted_variables`, emita declarações `SELECT` para retornar seus valores e acompanhe as alterações neles em rastreadores de sessão para conexões. Os usuários sem esse privilégio não podem visualizar ou acompanhar esses valores das variáveis de sistema. Veja Persistência de Variáveis de Sistema Sensíveis.

* `SERVICE_CONNECTION_ADMIN`

Permite conexões à interface de rede que permite apenas conexões administrativas (consulte Seção 7.1.12.1, “Interfaces de Conexão”).

* `SESSION_VARIABLES_ADMIN` (adicionado no MySQL 8.0.14)

Para a maioria das variáveis do sistema, definir o valor da sessão não requer privilégios especiais e pode ser feito por qualquer usuário para afetar a sessão atual. Para algumas variáveis do sistema, definir o valor da sessão pode ter efeitos fora da sessão atual e, portanto, é uma operação restrita. Para essas, o privilégio `SESSION_VARIABLES_ADMIN` permite que o usuário defina o valor da sessão.

Se uma variável do sistema estiver restrita e exigir um privilégio especial para definir o valor da sessão, a descrição da variável indica essa restrição. Exemplos incluem `binlog_format`, `sql_log_bin` e `sql_log_off`.

Antes do MySQL 8.0.14, quando o `SESSION_VARIABLES_ADMIN` foi adicionado, as variáveis de sistema de sessão restritas só podem ser definidas por usuários que possuem o privilégio `SYSTEM_VARIABLES_ADMIN` ou `SUPER`.

O privilégio `SESSION_VARIABLES_ADMIN` é um subconjunto dos privilégios `SYSTEM_VARIABLES_ADMIN` e `SUPER`. Um usuário que possui qualquer um desses privilégios também é autorizado a definir variáveis de sessão restritas e, efetivamente, tem `SESSION_VARIABLES_ADMIN` por implicação e não precisa ser concedido explicitamente `SESSION_VARIABLES_ADMIN`.

Veja também a Seção 7.1.9.1, “Privilegios de variáveis do sistema”.

* `SET_USER_ID`

Permite definir o ID de autorização efetivo ao executar uma visão ou um programa armazenado. Um usuário com este privilégio pode especificar qualquer conta como o atributo `DEFINER` de uma visão ou programa armazenado. Os programas armazenados são executados com os privilégios da conta especificada, portanto, certifique-se de seguir as diretrizes de minimização de riscos listadas na Seção 27.6, “Controle de Acesso a Objetos Armazenados”.

A partir do MySQL 8.0.22, `SET_USER_ID` também permite a supressão de verificações de segurança projetadas para impedir operações que (provavelmente inadvertidamente) causem objetos armazenados a se tornarem órfãos ou que causem a adoção de objetos armazenados que atualmente são órfãos. Para detalhes, consulte Objetos Armazenados Órfãos.

* `SHOW_ROUTINE` (adicionado no MySQL 8.0.20)

Permite que um usuário acesse definições e propriedades de todas as rotinas armazenadas (procedimentos e funções armazenadas), mesmo aquelas para as quais o usuário não é nomeado como a rotina `DEFINER`. Esse acesso inclui:

+ O conteúdo da tabela do esquema de informações `ROUTINES`.

+ As declarações `SHOW CREATE FUNCTION` e `SHOW CREATE PROCEDURE`.

+ As declarações `SHOW FUNCTION CODE` e `SHOW PROCEDURE CODE`.

+ As declarações `SHOW FUNCTION STATUS` e `SHOW PROCEDURE STATUS`.

Antes do MySQL 8.0.20, para que um usuário acesse definições de rotinas que não definiu, o usuário deve ter o privilégio global `SELECT`, que é muito amplo. A partir do 8.0.20, `SHOW_ROUTINE` pode ser concedido em vez disso como um privilégio com um escopo mais restrito que permite o acesso às definições de rotinas. (Ou seja, um administrador pode revogar o privilégio global `SELECT` dos usuários que não o necessitam e conceder `SHOW_ROUTINE` em vez disso.) Isso permite que uma conta faça backup de rotinas armazenadas sem exigir um privilégio amplo.

* `SKIP_QUERY_REWRITE` (adicionado no MySQL 8.0.31)

As consultas emitidas por um usuário com este privilégio não são reescritas pelo plugin `Rewriter` (consulte a Seção 7.6.4, “O plugin de reescrita de consultas reescritoras”).

Esse privilégio deve ser concedido aos usuários que emitem declarações administrativas ou de controle que não devem ser reescritas, bem como às contas `PRIVILEGE_CHECKS_USER` (ver Seção 19.3.3, “Verificação de Privilégios de Replicação”) usadas para aplicar declarações de uma fonte de replicação.

* `SYSTEM_USER` (adicionado no MySQL 8.0.16)

O privilégio `SYSTEM_USER` distingue os usuários do sistema dos usuários regulares:

+ Um usuário com o privilégio `SYSTEM_USER` é um usuário do sistema.

+ Um usuário sem o privilégio `SYSTEM_USER` é um usuário comum.

O privilégio `SYSTEM_USER` tem efeito sobre as contas às quais um usuário dado pode aplicar seus outros privilégios, bem como se o usuário está protegido de outras contas:

+ Um usuário do sistema pode modificar tanto contas do sistema quanto contas regulares. Ou seja, um usuário que possui os privilégios apropriados para realizar uma operação específica em contas regulares é habilitado pela posse de `SYSTEM_USER` para realizar a operação também em contas do sistema. Uma conta do sistema só pode ser modificada por usuários do sistema com privilégios apropriados, e não por usuários regulares.

+ Um usuário regular com privilégios apropriados pode modificar contas regulares, mas não contas de sistema. Uma conta regular pode ser modificada tanto por usuários do sistema quanto por usuários regulares com privilégios apropriados.

Isso também significa que os objetos do banco de dados criados por usuários com o privilégio `SYSTEM_USER` não podem ser modificados ou excluídos por usuários sem esse privilégio. Isso também se aplica a rotinas para as quais o definidor tenha esse privilégio.

Para mais informações, consulte a Seção 8.2.11, “Categorias de Conta”.

A proteção contra modificação por contas regulares que é concedida às contas do sistema pelo privilégio `SYSTEM_USER` não se aplica a contas regulares que possuem privilégios no esquema de sistema `mysql`, e, portanto, podem modificar diretamente as tabelas de concessão nesse esquema. Para proteção total, não conceda privilégios de esquema `mysql` a contas regulares. Veja Protegendo contas do sistema contra manipulação por contas regulares.

Se o plugin `audit_log` estiver em uso (consulte a Seção 8.4.5, “Auditoramento da MySQL Enterprise”), a partir da MySQL 8.0.28, as contas com o privilégio `SYSTEM_USER` são automaticamente atribuídas o privilégio `AUDIT_ABORT_EXEMPT`, que permite que suas consultas sejam executadas mesmo que um item “abort” configurado no filtro as bloqueie. As contas com o privilégio `SYSTEM_USER` podem, portanto, ser usadas para recuperar o acesso a um sistema após uma configuração incorreta de auditoria.

* `SYSTEM_VARIABLES_ADMIN`

Afeta as seguintes operações e comportamentos do servidor:

+ Permite alterações de variáveis do sistema em tempo de execução:

- Permite que as alterações de configuração do servidor sejam feitas em variáveis do sistema global com `SET GLOBAL` (set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") e `SET PERSIST` (set-variable.html "15.7.6.1 SET Syntax for Variable Assignment").

- Permite que as alterações de configuração do servidor sejam feitas em variáveis do sistema global com `SET PERSIST_ONLY` e (set-variable.html "15.7.6.1 SET Syntax for Variable Assignment"), se o usuário também tiver `PERSIST_RO_VARIABLES_ADMIN`.

- Permite definir variáveis de sistema de sessão restritas que exigem um privilégio especial. Na prática, `SYSTEM_VARIABLES_ADMIN` implica `SESSION_VARIABLES_ADMIN` sem conceder explicitamente `SESSION_VARIABLES_ADMIN`.

Veja também a Seção 7.1.9.1, “Privilegios de variáveis do sistema”.

+ Permite alterações nas características de transação global (consulte a Seção 15.3.7, “Instrução SET TRANSACTION”).

* `TABLE_ENCRYPTION_ADMIN` (adicionado no MySQL 8.0.16)

Permite que o usuário substitua as configurações de criptografia padrão quando o `table_encryption_privilege_check` está habilitado; veja Definindo um padrão de criptografia para esquemas e tabelas gerais.

* `TELEMETRY_LOG_ADMIN`

Permite a configuração do registro de telemetria. Esse privilégio é definido pelo plugin `telemetry_log`, que é implantado através do MySQL HeatWave na AWS.

* `TP_CONNECTION_ADMIN`

Permite a conexão com o servidor com uma conexão privilegiada. Quando o limite definido por `thread_pool_max_transactions_limit` for atingido, novas conexões não serão permitidas. Uma conexão privilegiada ignora o limite de transação e permite a conexão com o servidor para aumentar o limite de transação, remover o limite ou interromper as transações em execução. Esse privilégio não é concedido por padrão a nenhum usuário. Para estabelecer uma conexão privilegiada, o usuário que inicia a conexão deve ter o privilégio `TP_CONNECTION_ADMIN`.

Uma conexão privilegiada pode executar declarações e iniciar transações quando o limite definido por `thread_pool_max_transactions_limit` for atingido. Uma conexão privilegiada é colocada no grupo de threads `Admin`. Veja Conexões privilegiadas.

* `VERSION_TOKEN_ADMIN`

Permite a execução das funções dos Tokens de Versão. Este privilégio é definido pelo plugin `version_tokens`; veja a Seção 7.6.6, “Tokens de Versão”.

* `XA_RECOVER_ADMIN`

Permite a execução da declaração `XA RECOVER`(xa-statements.html "15.3.8.1 XA Transaction SQL Statements"); consulte a Seção 15.3.8.1, “Declarações de Transação XA SQL”.

Antes do MySQL 8.0, qualquer usuário poderia executar a declaração `XA RECOVER`(xa-statements.html "15.3.8.1 XA Transaction SQL Statements") para descobrir os valores XID para transações preparadas pendentes de XA, o que poderia levar ao compromisso ou ao rollback de uma transação XA por um usuário diferente do que a iniciou. No MySQL 8.0, `XA RECOVER`(xa-statements.html "15.3.8.1 XA Transaction SQL Statements") é permitido apenas para usuários que possuem o privilégio `XA_RECOVER_ADMIN`, que espera-se que seja concedido apenas a usuários administrativos que o necessitem. Este pode ser o caso, por exemplo, para administradores de um aplicativo XA se ele falhou e é necessário encontrar transações pendentes iniciadas pelo aplicativo para que possam ser revertidas. Este requisito de privilégio impede que os usuários descubram os valores XID para transações preparadas pendentes de XA que não sejam as suas próprias. Isso não afeta o compromisso ou rollback normal de uma transação XA porque o usuário que a iniciou conhece seu XID.

#### Diretrizes de concessão de privilégios

É uma boa ideia conceder a uma conta apenas os privilégios que ela precisa. Você deve exercer cuidados especiais ao conceder os privilégios `FILE` e administrativos:

* `FILE` pode ser abusado para ler em uma tabela de banco de dados quaisquer arquivos que o servidor MySQL possa ler no host do servidor. Isso inclui todos os arquivos que podem ser lidos por qualquer pessoa no mundo e arquivos no diretório de dados do servidor. A tabela pode então ser acessada usando `SELECT` para transferir seu conteúdo para o host do cliente.

* `GRANT OPTION` permite que os usuários dêem seus privilégios a outros usuários. Dois usuários que têm privilégios diferentes e com o privilégio `GRANT OPTION`(privileges-provided.html#priv_grant-option) podem combinar privilégios.

* `ALTER` pode ser usado para subverter o sistema de privilégios ao renomear tabelas.

* `SHUTDOWN` pode ser abusado para negar serviço a outros usuários por completo, terminando o servidor.

* `PROCESS` pode ser usado para visualizar o texto simples das declarações atualmente em execução, incluindo as declarações que definem ou alteram senhas.

* `SUPER` pode ser usado para encerrar outras sessões ou alterar a forma como o servidor opera.

* Os privilégios concedidos para o próprio banco de dados do sistema `mysql` podem ser usados para alterar senhas e outras informações de privilégios de acesso:

+ As senhas são armazenadas criptografadas, portanto, um usuário malicioso não pode simplesmente lê-las para saber a senha em texto simples. No entanto, um usuário com acesso de escrita à tabela do sistema `mysql.user` coluna `authentication_string` pode alterar a senha de uma conta e, em seguida, se conectar ao servidor MySQL usando essa conta.

+ `INSERT` ou `UPDATE` concedidos para o banco de dados do sistema `mysql` permitem que o usuário adicione privilégios ou modifique privilégios existentes, respectivamente.

+ `DROP` para o banco de dados do sistema `mysql` permite que um usuário remova tabelas de privilégio, ou até mesmo o próprio banco de dados.

#### Privilegios Estáticos versus Dinâmicos

MySQL suporta privilégios estáticos e dinâmicos:

* Os privilégios estáticos são construídos no servidor. Eles estão sempre disponíveis para serem concedidos às contas de usuário e não podem ser desativados.

* Os privilégios dinâmicos podem ser registrados e desregistrados em tempo de execução. Isso afeta sua disponibilidade: um privilégio dinâmico que não foi registrado não pode ser concedido.

Por exemplo, os privilégios `SELECT` e `INSERT` são estáticos e sempre disponíveis, enquanto um privilégio dinâmico só se torna disponível se o componente que o implementa foi habilitado.

O restante desta seção descreve como os privilégios dinâmicos funcionam no MySQL. A discussão utiliza o termo “componentes”, mas se aplica igualmente a plugins.

Nota

Os administradores de servidores devem estar cientes de quais componentes do servidor definem privilégios dinâmicos. Para as distribuições do MySQL, a documentação dos componentes que definem privilégios dinâmicos descreve esses privilégios.

Os componentes de terceiros também podem definir privilégios dinâmicos; um administrador deve entender esses privilégios e não instalar componentes que possam causar conflitos ou comprometer a operação do servidor. Por exemplo, um componente entra em conflito com outro se ambos definirem um privilégio com o mesmo nome. Os desenvolvedores de componentes podem reduzir a probabilidade dessa ocorrência escolhendo nomes de privilégios com um prefixo baseado no nome do componente.

O servidor mantém o conjunto de privilégios dinâmicos registrados internamente na memória. A desativação ocorre ao desligar o servidor.

Normalmente, um componente que define privilégios dinâmicos os registra quando é instalado, durante sua sequência de inicialização. Quando desinstalado, um componente não desregistra seus privilégios dinâmicos registrados. (Essa é a prática atual, não um requisito. Ou seja, os componentes podem, mas não desregistram, a qualquer momento, os privilégios que registram.)

Não há aviso ou erro para tentativas de registrar um privilégio dinâmico já registrado. Considere a seguinte sequência de declarações:

```
INSTALL COMPONENT 'my_component';
UNINSTALL COMPONENT 'my_component';
INSTALL COMPONENT 'my_component';
```

A primeira declaração `INSTALL COMPONENT` registra quaisquer privilégios definidos pelo componente `my_component`, mas o `UNINSTALL COMPONENT` não os desregistra. Para a segunda declaração `INSTALL COMPONENT`(install-component.html "15.7.4.3 INSTALL COMPONENT Statement"), os privilégios do componente que ela registra são encontrados já registrados, mas não ocorrem avisos ou erros.

Os privilégios dinâmicos são aplicados apenas no nível global. O servidor armazena informações sobre as atribuições atuais de privilégios dinâmicos às contas de usuário na tabela do sistema `mysql.global_grants`:

* O servidor registra automaticamente os privilégios mencionados em `global_grants` durante a inicialização do servidor (a menos que a opção `--skip-grant-tables` seja fornecida).

As declarações `GRANT` e `REVOKE` modificam o conteúdo de `global_grants`.

* As atribuições de privilégios dinâmicas listadas em `global_grants` são persistentes. Elas não são removidas na parada do servidor.

Exemplo: A seguinte declaração concede ao usuário `u1` os privilégios necessários para controlar a replicação (incluindo a Replicação em Grupo) em uma réplica e para modificar as variáveis do sistema:

```
GRANT REPLICATION_SLAVE_ADMIN, GROUP_REPLICATION_ADMIN, BINLOG_ADMIN
ON *.* TO 'u1'@'localhost';
```

Os privilégios dinâmicos concedidos aparecem na saída da declaração `SHOW GRANTS` e da tabela `INFORMATION_SCHEMA` `USER_PRIVILEGES`.

Para `GRANT` e `REVOKE` a nível global, quaisquer privilégios nomeados que não sejam reconhecidos como estáticos são verificados contra o conjunto atual de privilégios dinâmicos registrados e concedidos se forem encontrados. Caso contrário, ocorre um erro para indicar um identificador de privilégio desconhecido.

Para `GRANT` e `REVOKE`, o significado de `ALL [PRIVILEGES]` ao nível global inclui todos os privilégios globais estáticos, bem como todos os privilégios dinâmicos atualmente registrados:

* `GRANT ALL` ao nível global concede todos os privilégios estáticos globais e todos os privilégios dinâmicos atualmente registrados. Um privilégio dinâmico registrado após a execução da declaração `GRANT` não é concedido retroativamente a nenhuma conta.

* `REVOKE ALL` ao nível global revoga todos os privilégios estáticos globais concedidos e todos os privilégios dinâmicos concedidos.

A declaração `FLUSH PRIVILEGES` lê a tabela `global_grants` para atribuições dinâmicas de privilégios e registra quaisquer privilégios não registrados encontrados nela.

Para descrições dos privilégios dinâmicos fornecidos pelo MySQL Server e componentes incluídos nas distribuições do MySQL, consulte a Seção 8.2.2, “Privilégios fornecidos pelo MySQL”.

#### Migrando contas do SUPER para Privilegios Dinâmicos

No MySQL 8.0, muitas operações que anteriormente exigiam o privilégio `SUPER` também estão associadas a um privilégio dinâmico de escopo mais limitado. (Para descrições desses privilégios, consulte a Seção 8.2.2, “Privilégios fornecidos pelo MySQL”.) Cada uma dessas operações pode ser permitida a uma conta concedendo o privilégio dinâmico associado em vez de `SUPER`. Essa mudança melhora a segurança, permitindo que os administradores de banco de dados evitem conceder `SUPER` e adaptem os privilégios dos usuários de forma mais próxima às operações permitidas. `SUPER` é agora desatualizado; espere que ele seja removido em uma versão futura do MySQL.

Quando a remoção de `SUPER` ocorrer, as operações que anteriormente exigiam `SUPER` falham, a menos que as contas concedidas `SUPER` sejam migradas para os privilégios dinâmicos apropriados. Use as instruções a seguir para alcançar esse objetivo, de modo que as contas estejam prontas antes da remoção de `SUPER`:

1. Execute esta consulta para identificar contas que tenham concedido `SUPER`:

   ```
   SELECT GRANTEE FROM INFORMATION_SCHEMA.USER_PRIVILEGES
   WHERE PRIVILEGE_TYPE = 'SUPER';
   ```

2. Para cada conta identificada pela consulta anterior, determine as operações para as quais ela precisa de `SUPER`. Em seguida, conceda os privilégios dinâmicos correspondentes a essas operações e revogue `SUPER`.

Por exemplo, se `'u1'@'localhost'` exige `SUPER` para purga de log binário e modificação de variáveis do sistema, essas declarações fazem as alterações necessárias na conta:

   ```
   GRANT BINLOG_ADMIN, SYSTEM_VARIABLES_ADMIN ON *.* TO 'u1'@'localhost';
   REVOKE SUPER ON *.* FROM 'u1'@'localhost';
   ```

Depois de ter modificado todas as contas aplicáveis, a consulta `INFORMATION_SCHEMA` no primeiro passo deve produzir um conjunto de resultados vazio.

### 8.2.3 Tabelas de subvenções

O banco de dados do sistema `mysql` inclui várias tabelas de concessão que contêm informações sobre as contas de usuário e os privilégios que elas possuem. Esta seção descreve essas tabelas. Para informações sobre outras tabelas no banco de dados do sistema, consulte a Seção 7.3, “O esquema do sistema mysql”.

A discussão aqui descreve a estrutura subjacente das tabelas de concessão e como o servidor usa seu conteúdo ao interagir com os clientes. No entanto, normalmente, você não modifica as tabelas de concessão diretamente. As modificações ocorrem indiretamente quando você usa declarações de gerenciamento de contas, como `CREATE USER`(create-user.html "15.7.1.3 CREATE USER Statement"), `GRANT` e `REVOKE` para configurar contas e controlar os privilégios disponíveis para cada uma. Veja a Seção 15.7.1, “Declarações de Gerenciamento de Conta”. Quando você usa essas declarações para realizar manipulações de conta, o servidor modifica as tabelas de concessão em seu nome.

Nota

A modificação direta das tabelas de subsídios usando declarações como `INSERT`, `UPDATE` ou `DELETE` é desencorajada e feita por sua conta e risco. O servidor é livre para ignorar linhas que se tornam malformadas como resultado de tais modificações.

Para qualquer operação que modifique uma tabela de concessão, o servidor verifica se a tabela possui a estrutura esperada e produz um erro se não o fizer. Para atualizar as tabelas para a estrutura esperada, realize o procedimento de atualização do MySQL. Veja o Capítulo 3, *Atualizando o MySQL*.

* Visão geral da tabela de concessão
* Tabelas de concessão de usuário e db
* Tabelas de concessão tables_priv e columns_priv
* Tabela de concessão procs_priv
* Tabela de concessão proxies_priv
* Tabela de concessão global_grants
* Tabela de concessão role_default
* Tabela de concessão role_edges
* Tabela de concessão password_history
* Propriedades de coluna de escopo da tabela de concessão
* Propriedades de coluna de privilégio da tabela de concessão
* Concorrência da tabela de concessão

#### Visão geral da tabela de subsídios

Esses `mysql` tabelas de banco de dados contêm informações de concessão:

* `user`: Contas de usuário, privilégios globais estáticos e outras colunas não de privilégio.

* `global_grants`: Privilegios globais dinâmicos.

* `db`: Privilegios de nível de banco de dados.

* `tables_priv`: Privilegios de nível de tabela.

* `columns_priv`: Privilegios em nível de coluna.

* `procs_priv`: Permissões de procedimentos e funções armazenadas.

* `proxies_priv`: Privilegios do usuário proxy.

* `default_roles`: Papéis de usuário padrão.

* `role_edges`: Bordas para subgrafos de papel.

* `password_history`: Histórico de alteração da senha.

Para informações sobre as diferenças entre privilégios globais estáticos e dinâmicos, consulte Estáticos versus Privilegios Dinâmicos.)

No MySQL 8.0, as tabelas de concessão utilizam o mecanismo de armazenamento `InnoDB` e são transacionais. Antes do MySQL 8.0, as tabelas de concessão utilizavam o mecanismo de armazenamento `MyISAM` e eram não transacionais. Essa mudança no mecanismo de armazenamento das tabelas de concessão permite uma mudança acompanhante no comportamento das declarações de gerenciamento de contas, como `CREATE USER` ou `GRANT`. Anteriormente, uma declaração de gerenciamento de conta que mencionava vários usuários poderia ter sucesso para alguns usuários e falhar para outros. Agora, cada declaração é transacional e ou tem sucesso para todos os usuários mencionados ou é revertida e não tem efeito se ocorrer algum erro.

Cada tabela de subsídio contém colunas de escopo e colunas de privilégio:

* As colunas de escopo determinam o escopo de cada linha nas tabelas; ou seja, o contexto em que a linha se aplica. Por exemplo, uma linha de tabela `user` com os valores `Host` e `User` de `'h1.example.net'` e `'bob'` se aplica para autenticar conexões feitas ao servidor a partir do host `h1.example.net` por um cliente que especifica um nome de usuário de `bob`. Da mesma forma, uma linha de tabela `db` com os valores das colunas `Host`, `User` e `Db` de `'h1.example.net'`, `'bob'` e `'reports'` se aplica quando `bob` se conecta a partir do host `h1.example.net` para acessar o banco de dados `reports`. As tabelas `tables_priv` e `columns_priv` contêm colunas de escopo que indicam tabelas ou combinações de tabela/coluna às quais cada linha se aplica. As colunas de escopo `procs_priv` indicam a rotina armazenada à qual cada linha se aplica.

* As colunas de privilégio indicam quais privilégios uma linha de tabela concede, ou seja, quais operações ela permite que sejam realizadas. O servidor combina as informações nas várias tabelas de concessão para formar uma descrição completa dos privilégios de um usuário. A Seção 8.2.7, “Controle de Acesso, Etapa 2: Solicitação de Verificação”, descreve as regras para isso.

Além disso, uma tabela de subsídios pode conter colunas usadas para fins que não a avaliação de escopo ou privilégio.

O servidor utiliza as tabelas de concessão da seguinte maneira:

* As colunas de escopo da tabela `user` determinam se as conexões recebidas devem ser rejeitadas ou permitidas. Para conexões permitidas, quaisquer privilégios concedidos na tabela `user` indicam os privilégios globais estáticos do usuário. Quaisquer privilégios concedidos nesta tabela se aplicam a *todas* as bases de dados no servidor.

Cuidado

Como qualquer privilégio global estático é considerado um privilégio para todas as bases de dados, qualquer privilégio global estático permite que um usuário veja todos os nomes de base de dados com `SHOW DATABASES` ou examinando a tabela `SCHEMATA` de `INFORMATION_SCHEMA`, exceto as bases de dados que foram restringidas no nível da base de dados por revogações parciais.

* A tabela `global_grants` lista as atribuições atuais de privilégios globais dinâmicos para contas de usuário. Para cada linha, as colunas de escopo determinam qual usuário tem o privilégio nomeado na coluna de privilégio.

* As colunas de escopo da tabela `db` determinam quais usuários podem acessar quais bancos de dados de quais hosts. As colunas de privilégio determinam as operações permitidas. Um privilégio concedido no nível do banco de dados aplica-se ao banco de dados e a todos os objetos no banco de dados, como tabelas e programas armazenados.

* As tabelas `tables_priv` e `columns_priv` são semelhantes à tabela `db`, mas são mais detalhadas: Elas se aplicam aos níveis de tabela e coluna, e não ao nível do banco de dados. Um privilégio concedido ao nível da tabela se aplica à tabela e a todas as suas colunas. Um privilégio concedido ao nível da coluna se aplica apenas a uma coluna específica.

* A tabela `procs_priv` se aplica a rotinas armazenadas (procedimentos e funções armazenadas). Um privilégio concedido no nível da rotina aplica-se apenas a um único procedimento ou função.

* A tabela `proxies_priv` indica quais usuários podem atuar como representantes de outros usuários e se um usuário pode conceder o privilégio `PROXY` a outros usuários.

* As tabelas `default_roles` e `role_edges` contêm informações sobre relações de papel.

* A tabela `password_history` retém senhas previamente escolhidas para permitir restrições sobre a reutilização de senhas. Veja a Seção 8.2.15, “Gestão de Senhas”.

O servidor lê o conteúdo das tabelas de concessão na memória quando ele é iniciado. Você pode dizer que ele recarregue as tabelas emitindo uma declaração `FLUSH PRIVILEGES` ou executando um comando **mysqladmin flush-privileges** ou **mysqladmin reload**. As alterações nas tabelas de concessão entram em vigor conforme indicado na Seção 8.2.13, “Quando as Alterações de Privilegio Entram em Efeito”.

Quando você modifica uma conta, é uma boa ideia verificar se suas alterações têm o efeito desejado. Para verificar os privilégios de uma conta específica, use a declaração `SHOW GRANTS` (show-grants.html "15.7.7.21 SHOW GRANTS Statement"). Por exemplo, para determinar os privilégios concedidos a uma conta com os valores de nome de usuário e nome de host de `bob` e `pc84.example.com`, use esta declaração:

```
SHOW GRANTS FOR 'bob'@'pc84.example.com';
```

Para exibir propriedades não privilegiadas de uma conta, use `SHOW CREATE USER`:

```
SHOW CREATE USER 'bob'@'pc84.example.com';
```

#### As tabelas de usuários e de concessão de acesso (db Grant)

O servidor utiliza as tabelas `user` e `db` no banco de dados `mysql` em ambas as primeiras e segundas etapas do controle de acesso (ver Seção 8.2, “Controle de Acesso e Gerenciamento de Conta”). As colunas das tabelas `user` e `db` são mostradas aqui.

**Tabela 8.4 Colunas de tabelas usuário e db**

<table><col style="width: 40%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th scope="col">Table Name</th> <th scope="col"><code>user</code></th> <th scope="col"><code>db</code></th> </tr></thead><tbody><tr> <th scope="row">Scope columns</th> <td><code>Host</code></td> <td><code>Host</code></td> </tr><tr> <th scope="row"></th> <td><code>User</code></td> <td><code>Db</code></td> </tr><tr> <th scope="row"></th> <td></td> <td><code>User</code></td> </tr><tr> <th scope="row">Privilege columns</th> <td><code>Select_priv</code></td> <td><code>Select_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Insert_priv</code></td> <td><code>Insert_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Update_priv</code></td> <td><code>Update_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Delete_priv</code></td> <td><code>Delete_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Index_priv</code></td> <td><code>Index_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Alter_priv</code></td> <td><code>Alter_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Create_priv</code></td> <td><code>Create_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Drop_priv</code></td> <td><code>Drop_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Grant_priv</code></td> <td><code>Grant_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Create_view_priv</code></td> <td><code>Create_view_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Show_view_priv</code></td> <td><code>Show_view_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Create_routine_priv</code></td> <td><code>Create_routine_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Alter_routine_priv</code></td> <td><code>Alter_routine_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Execute_priv</code></td> <td><code>Execute_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Trigger_priv</code></td> <td><code>Trigger_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Event_priv</code></td> <td><code>Event_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Create_tmp_table_priv</code></td> <td><code>Create_tmp_table_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Lock_tables_priv</code></td> <td><code>Lock_tables_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>References_priv</code></td> <td><code>References_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Reload_priv</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>Shutdown_priv</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>Process_priv</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>File_priv</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>Show_db_priv</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>Super_priv</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>Repl_slave_priv</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>Repl_client_priv</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>Create_user_priv</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>Create_tablespace_priv</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>Create_role_priv</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>Drop_role_priv</code></td> <td></td> </tr><tr> <th scope="row">Security columns</th> <td><code>ssl_type</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>ssl_cipher</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>x509_issuer</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>x509_subject</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>plugin</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>authentication_string</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>password_expired</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>password_last_changed</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>password_lifetime</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>account_locked</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>Password_reuse_history</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>Password_reuse_time</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>Password_require_current</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>User_attributes</code></td> <td></td> </tr><tr> <th scope="row">Resource control columns</th> <td><code>max_questions</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>max_updates</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>max_connections</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>max_user_connections</code></td> <td></td> </tr></tbody></table>

As colunas `user` da tabela `plugin` e `authentication_string` armazenam informações sobre o plugin de autenticação e as credenciais.

O servidor utiliza o plugin nomeado na coluna `plugin` de uma linha de conta para autenticar as tentativas de conexão para a conta.

A coluna `plugin` deve estar não vazia. No momento inicial e durante a execução do (flush.html#flush-privileges), o servidor verifica as linhas da tabela `user`. Para qualquer linha com uma coluna `plugin` vazia, o servidor escreve um aviso no log de erro deste formulário:

```
[Warning] User entry 'user_name'@'host_name' has an empty plugin
value. The user will be ignored and no one can login with this user
anymore.
```

Para atribuir um plugin a uma conta que não possui um, use a declaração `ALTER USER`.

A coluna `password_expired` permite que os DBAs expiram as senhas das contas e exijam que os usuários refaçam suas senhas. O valor padrão `password_expired` é `'N'`, mas pode ser definido como `'Y'` com a declaração [`ALTER USER`(alter-user.html "15.7.1.1 ALTER USER Statement")]. Após a senha de uma conta ter expirado, todas as operações realizadas pela conta em conexões subsequentes ao servidor resultam em um erro até que o usuário emita uma declaração `ALTER USER` para estabelecer uma nova senha da conta.

Nota

Embora seja possível "redefinir" uma senha expirada, definindo-a para seu valor atual, é preferível, por questão de boa política, escolher uma senha diferente. Os administradores de banco de dados podem impor a não reutilização estabelecendo uma política apropriada de reutilização de senha. Veja a Política de Reutilização de Senha.

`password_last_changed` é uma coluna `TIMESTAMP` que indica quando a senha foi alterada pela última vez. O valor não é `NULL` apenas para contas que utilizam um plugin de autenticação integrado do MySQL (`mysql_native_password`, `sha256_password` ou `caching_sha2_password`). O valor é `NULL` para outras contas, como aquelas autenticadas usando um sistema de autenticação externo.

`password_last_changed` é atualizado pelas declarações `CREATE USER`, `ALTER USER` e `SET PASSWORD`, e pelas declarações `GRANT` que criam uma conta ou alteram a senha de uma conta.

`password_lifetime` indica a vida útil da senha da conta, em dias. Se a senha tiver expirado (avaliada usando a coluna `password_last_changed`, o servidor considera que a senha expirou quando os clientes se conectam usando a conta. Um valor de *`N`* maior que zero significa que a senha deve ser alterada a cada *`N`* dias. Um valor de 0 desativa a expiração automática da senha. Se o valor for `NULL` (o padrão), a política de expiração global se aplica, conforme definido pela variável de sistema `default_password_lifetime`.

`account_locked` indica se a conta está bloqueada (consulte a Seção 8.2.20, “Bloqueio de conta”).

`Password_reuse_history` é o valor da opção `PASSWORD HISTORY` para a conta, ou `NULL` para o histórico padrão.

`Password_reuse_time` é o valor da opção `PASSWORD REUSE INTERVAL` para a conta, ou `NULL` para o intervalo padrão.

`Password_require_current` (adicionado no MySQL 8.0.13) corresponde ao valor da opção `PASSWORD REQUIRE` para a conta, conforme demonstrado na tabela a seguir.

**Tabela 8.5 Valores permitidos para Password_require_current**

<table summary="Permitted values of the user.Password_require_current column and how they correspond to PASSWORD REQUIRE options."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Password_require_current Value</th> <th>Opção de REQUIMENTO DE SENHA correspondente</th> </tr></thead><tbody><tr> <td><code>'Y'</code></td> <td><code>PASSWORD REQUIRE CURRENT</code></td> </tr><tr> <td><code>'N'</code></td> <td><code>PASSWORD REQUIRE CURRENT OPTIONAL</code></td> </tr><tr> <td><code>NULL</code></td> <td><code>PASSWORD REQUIRE CURRENT DEFAULT</code></td> </tr></tbody></table>

`User_attributes` (adicionado no MySQL 8.0.14) é uma coluna em formato JSON que armazena atributos da conta que não são armazenados em outras colunas. A partir do MySQL 8.0.21, o `INFORMATION_SCHEMA` expõe esses atributos através da tabela `USER_ATTRIBUTES`.

A coluna `User_attributes` pode conter esses atributos:

* `additional_password`: A senha secundária, se houver. Veja Suporte a Dupla Senha.

* `Restrictions`: Listas de restrições, se houver. As restrições são adicionadas por operações de revogação parcial. O valor do atributo é um array de elementos que cada um tem as chaves `Database` e `Restrictions` indicando o nome de um banco de dados restrito e as restrições aplicáveis a ele (ver Seção 8.2.12, “Restrição de privilégio usando revogações parciais”).

* `Password_locking`: As condições para o rastreamento de falha no login e bloqueio temporário da conta, se houver (consulte Rastreamento de falha no login e bloqueio temporário da conta). O atributo `Password_locking` é atualizado de acordo com as opções `FAILED_LOGIN_ATTEMPTS` e `PASSWORD_LOCK_TIME` das declarações `CREATE USER` e `ALTER USER`. O valor do atributo é um hash com as chaves `failed_login_attempts` e `password_lock_time_days`, indicando o valor das opções especificadas para a conta. Se uma chave estiver ausente, seu valor é implicitamente 0. Se o valor de uma chave estiver implicitamente ou explicitamente 0, a capacidade correspondente é desativada. Este atributo foi adicionado no MySQL 8.0.19.

* `multi_factor_authentication`: As linhas da tabela do sistema `mysql.user` possuem uma coluna `plugin` que indica um plugin de autenticação. Para autenticação de um único fator, esse plugin é o único fator de autenticação. Para formas de autenticação multifatorial de dois ou três fatores, esse plugin corresponde ao primeiro fator de autenticação, mas informações adicionais devem ser armazenadas para os segundo e terceiro fatores. O atributo `multi_factor_authentication` contém essas informações. Esse atributo foi adicionado no MySQL 8.0.27.

O valor `multi_factor_authentication` é um array, onde cada elemento do array é um hash que descreve um fator de autenticação usando esses atributos:

+ `plugin`: O nome do plugin de autenticação.

+ `authentication_string`: O valor da string de autenticação.

+ `passwordless`: Uma bandeira que indica se o usuário deve ser usado sem uma senha (com um token de segurança como o único método de autenticação).

+ `requires_registration`: uma bandeira que define se a conta do usuário registrou um token de segurança.

Os primeiros e segundos elementos da matriz descrevem os fatores de autenticação multifatorial 2 e 3.

Se nenhum atributo se aplicar, `User_attributes` é `NULL`.

Exemplo: Uma conta que tem uma senha secundária e privilégios de banco de dados parcialmente revogados tem os atributos `additional_password` e `Restrictions` no valor da coluna:

```
mysql> SELECT User_attributes FROM mysql.User WHERE User = 'u'\G
*************************** 1. row ***************************
User_attributes: {"Restrictions":
                   [{"Database": "mysql", "Privileges": ["SELECT"]}],
                  "additional_password": "hashed_credentials"}
```

Para determinar quais atributos estão presentes, use a função `JSON_KEYS()`:

```
SELECT User, Host, JSON_KEYS(User_attributes)
FROM mysql.user WHERE User_attributes IS NOT NULL;
```

Para extrair um atributo específico, como `Restrictions`, faça o seguinte:

```
SELECT User, Host, User_attributes->>'$.Restrictions'
FROM mysql.user WHERE User_attributes->>'$.Restrictions' <> '';
```

Aqui está um exemplo do tipo de informação armazenada para `multi_factor_authentication`:

```
{
  "multi_factor_authentication": [
    {
      "plugin": "authentication_ldap_simple",
      "passwordless": 0,
      "authentication_string": "ldap auth string",
      "requires_registration": 0
    },
    {
      "plugin": "authentication_fido",
      "passwordless": 0,
      "authentication_string": "",
      "requires_registration": 1
    }
  ]
}
```

#### Conceder tabelas_priv e colunas_priv Conceder Tabelas

Durante a segunda etapa do controle de acesso, o servidor realiza a verificação da solicitação para garantir que cada cliente tenha privilégios suficientes para cada solicitação que emite. Além das tabelas de concessão `user` e `db`, o servidor também pode consultar as tabelas `tables_priv` e `columns_priv` para solicitações que envolvem tabelas. Essas últimas tabelas fornecem um controle de privilégio mais preciso nos níveis de tabela e coluna. Elas possuem as colunas mostradas na tabela a seguir.

**Tabela 8.6 Colunas da tabela tables_priv e colunas da tabela columns_priv**

<table><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col">Table Name</th> <th scope="col"><code>tables_priv</code></th> <th scope="col"><code>columns_priv</code></th> </tr></thead><tbody><tr> <th scope="row">Scope columns</th> <td><code>Host</code></td> <td><code>Host</code></td> </tr><tr> <th scope="row"></th> <td><code>Db</code></td> <td><code>Db</code></td> </tr><tr> <th scope="row"></th> <td><code>User</code></td> <td><code>User</code></td> </tr><tr> <th scope="row"></th> <td><code>Table_name</code></td> <td><code>Table_name</code></td> </tr><tr> <th scope="row"></th> <td></td> <td><code>Column_name</code></td> </tr><tr> <th scope="row">Privilege columns</th> <td><code>Table_priv</code></td> <td><code>Column_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Column_priv</code></td> <td></td> </tr><tr> <th scope="row">Other columns</th> <td><code>Timestamp</code></td> <td><code>Timestamp</code></td> </tr><tr> <th scope="row"></th> <td><code>Grantor</code></td> <td></td> </tr></tbody></table>

As colunas `Timestamp` e `Grantor` são definidas como o timestamp atual e o valor `CURRENT_USER`, respectivamente, mas, de outra forma, não são utilizadas.

#### A tabela de concessão procs_priv

Para a verificação de solicitações que envolvem rotinas armazenadas, o servidor pode consultar a tabela `procs_priv`, que possui as colunas mostradas na tabela a seguir.

**Tabela 8.7 Colunas da tabela procs_priv**

<table><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>Table Name</th> <th><code>procs_priv</code></th> </tr></thead><tbody><tr> <td>Scope columns</td> <td><code>Host</code></td> </tr><tr> <td></td> <td><code>Db</code></td> </tr><tr> <td></td> <td><code>User</code></td> </tr><tr> <td></td> <td><code>Routine_name</code></td> </tr><tr> <td></td> <td><code>Routine_type</code></td> </tr><tr> <td>Privilege columns</td> <td><code>Proc_priv</code></td> </tr><tr> <td>Other columns</td> <td><code>Timestamp</code></td> </tr><tr> <td></td> <td><code>Grantor</code></td> </tr></tbody></table>

A coluna `Routine_type` é uma coluna `ENUM` com valores de `'FUNCTION'` ou `'PROCEDURE'` para indicar o tipo de rotina a que a linha se refere. Esta coluna permite que privilégios sejam concedidos separadamente para uma função e um procedimento com o mesmo nome.

As colunas `Timestamp` e `Grantor` não são utilizadas.

#### A tabela de concessão proxies_priv

A tabela `proxies_priv` registra informações sobre contas de proxy. Ela possui as seguintes colunas:

* `Host`, `User`: A conta proxy; ou seja, a conta que possui o privilégio `PROXY` para a conta proxy.

* `Proxied_host`, `Proxied_user`: A conta proxy.

* `Grantor`, `Timestamp`: Não utilizado.

* `With_grant`: Se a conta proxy pode conceder o privilégio `PROXY` a outras contas.

Para que uma conta possa conceder o privilégio `PROXY` a outras contas, ela deve ter uma linha na tabela `proxies_priv` com `With_grant` definido como 1 e `Proxied_host` e `Proxied_user` definidos para indicar a conta ou contas para as quais o privilégio pode ser concedido. Por exemplo, a conta `'root'@'localhost'` criada durante a instalação do MySQL tem uma linha na tabela `proxies_priv` que permite conceder o privilégio `PROXY` para `''@''`, ou seja, para todos os usuários e todos os hosts. Isso permite que `root` configure usuários proxy, bem como delegar a outras contas a autoridade para configurar usuários proxy. Veja a Seção 8.2.19, “Usuários Proxy”.

#### A tabela de subsídios global_grants

A tabela `global_grants` lista as atribuições atuais de privilégios globais dinâmicos às contas de usuário. A tabela tem as seguintes colunas:

* `USER`, `HOST`: O nome do usuário e o nome do host da conta à qual o privilégio é concedido.

* `PRIV`: O nome do privilégio.
* `WITH_GRANT_OPTION`: Se a conta pode conceder o privilégio a outras contas.

#### A tabela de concessão default_roles

A tabela `default_roles` lista os papéis de usuário padrão. Ela tem as seguintes colunas:

* `HOST`, `USER`: A conta ou o papel ao qual o papel padrão se aplica.

* `DEFAULT_ROLE_HOST`, `DEFAULT_ROLE_USER`: O papel padrão.

#### A tabela de concessão role_edges

A tabela `role_edges` lista arestas para subgrafos de papel. Ela tem essas colunas:

* `FROM_HOST`, `FROM_USER`: A conta que recebe um papel.

* `TO_HOST`, `TO_USER`: O papel que é concedido à conta.

* `WITH_ADMIN_OPTION`: Se a conta pode conceder o papel e revogá-lo de outras contas usando `WITH ADMIN OPTION`.

#### A tabela de concessão password_history

A tabela `password_history` contém informações sobre as alterações de senha. Ela possui as seguintes colunas:

* `Host`, `User`: A conta para a qual a alteração da senha ocorreu.

* `Password_timestamp`: O momento em que a alteração da senha ocorreu.

* `Password`: O novo valor do hash da senha.

A tabela `password_history` acumula um número suficiente de senhas não vazias por conta para permitir que o MySQL realize verificações tanto sobre o histórico de comprimento da senha da conta quanto sobre o intervalo de reutilização. A poda automática das entradas que estão fora dos dois limites ocorre quando ocorrem tentativas de alteração de senha.

Nota

A senha vazia não é contabilizada no histórico de senhas e pode ser reutilizada a qualquer momento.

Se uma conta for renomeada, suas entradas serão renomeadas para corresponder. Se uma conta for descartada ou seu plugin de autenticação for alterado, suas entradas serão removidas.

#### Propriedades da coluna de escopo da tabela de subsídios

As colunas de escopo nas tabelas de concessão contêm strings. O valor padrão para cada uma delas é a string vazia. O quadro a seguir mostra o número de caracteres permitidos em cada coluna.

**Tabela 8.8 Colunas de comprimento da tabela de concessão**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Column Name</th> <th>Maximum Permitted Characters</th> </tr></thead><tbody><tr> <td><code>Host</code>, <code>Proxied_host</code></td> <td>255 (60 prior to MySQL 8.0.17)</td> </tr><tr> <td><code>User</code>, <code>Proxied_user</code></td> <td>32</td> </tr><tr> <td><code>Db</code></td> <td>64</td> </tr><tr> <td><code>Table_name</code></td> <td>64</td> </tr><tr> <td><code>Column_name</code></td> <td>64</td> </tr><tr> <td><code>Routine_name</code></td> <td>64</td> </tr></tbody></table>

Os valores de `Host` e `Proxied_host` são convertidos para minúsculas antes de serem armazenados nas tabelas de concessão.

Para fins de verificação de acesso, as comparações dos valores de `User`, `Proxied_user`, `authentication_string`, `Db` e `Table_name` são sensíveis ao caso. As comparações dos valores de `Host`, `Proxied_host`, `Column_name` e `Routine_name` não são sensíveis ao caso.

#### Propriedades da coluna de privilégios da tabela de subsídio

As tabelas `user` e `db` listam cada privilégio em uma coluna separada que é declarada como `ENUM('N','Y') DEFAULT 'N'`. Em outras palavras, cada privilégio pode ser desativado ou ativado, com o padrão sendo desativado.

As tabelas `tables_priv`, `columns_priv` e `procs_priv` declaram as colunas de privilégio como colunas `SET`. Os valores nessas colunas podem conter qualquer combinação dos privilégios controlados pela tabela. Apenas os privilégios listados no valor da coluna são habilitados.

**Tabela 8.9 Valores de coluna de privilégio de tipo de conjunto**

<table><col style="width: 20%"/><col style="width: 25%"/><col style="width: 45%"/><thead><tr> <th scope="col">Table Name</th> <th scope="col">Column Name</th> <th scope="col">Possible Set Elements</th> </tr></thead><tbody><tr> <th scope="row"><code>tables_priv</code></th> <td><code>Table_priv</code></td> <td><code class="literal">'Select', 'Insert', 'Update', 'Delete', 'Create', 'Drop', 'Grant', 'References', 'Index', 'Alter', 'Create View', 'Show view', 'Trigger'</code></td> </tr><tr> <th scope="row"><code>tables_priv</code></th> <td><code>Column_priv</code></td> <td><code>'Select', 'Insert', 'Update', 'References'</code></td> </tr><tr> <th scope="row"><code>columns_priv</code></th> <td><code>Column_priv</code></td> <td><code>'Select', 'Insert', 'Update', 'References'</code></td> </tr><tr> <th scope="row"><code>procs_priv</code></th> <td><code>Proc_priv</code></td> <td><code>'Execute', 'Alter Routine', 'Grant'</code></td> </tr></tbody></table>

Apenas as tabelas `user` e `global_grants` especificam privilégios administrativos, como `RELOAD`, `SHUTDOWN` e `SYSTEM_VARIABLES_ADMIN`. As operações administrativas são operações no próprio servidor e não são específicas do banco de dados, portanto, não há motivo para listar esses privilégios nas outras tabelas de concessão. Consequentemente, o servidor precisa consultar apenas as tabelas `user` e `global_grants` para determinar se um usuário pode realizar uma operação administrativa.

O privilégio `FILE` também é especificado apenas na tabela `user`. Não é um privilégio administrativo como tal, mas a capacidade de um usuário de ler ou escrever arquivos no host do servidor é independente do banco de dados a ser acessado.

#### Tabela de concessão de concorrência

A partir do MySQL 8.0.22, para permitir operações concorrentes de DML e DDL em tabelas MySQL grant, as operações de leitura que anteriormente adquiriram bloqueios de linha em tabelas MySQL grant são executadas como leituras não bloqueantes. As operações que são realizadas como leituras não bloqueantes em tabelas MySQL grant incluem:

* As declarações `SELECT` e outras declarações de leitura que leem dados de tabelas de concessão por meio de listas de junção e subconsultas, incluindo as declarações `SELECT ... FOR SHARE`(innodb-locking-reads.html "17.7.2.4 Locking Reads"), usando qualquer nível de isolamento de transação.

* Operações DML que leem dados de tabelas de concessão (através de listas de junção ou subconsultas), mas não as modificam, usando qualquer nível de isolamento de transação.

As declarações que não adquirirem bloqueios de linha ao ler dados de tabelas de concessão relatam um aviso se executadas enquanto estão usando replicação baseada em declaração.

Ao usar -`binlog_format=mixed`, as operações de MDE que leem dados de tabelas de concessão são escritas no log binário como eventos de linha para tornar as operações seguras para replicação em modo misto.

`SELECT ... FOR SHARE` (innodb-locking-reads.html "17.7.2.4 Locking Reads") As declarações que leem dados de tabelas de concessão geram um aviso. Com a cláusula `FOR SHARE`, os bloqueios de leitura não são suportados em tabelas de concessão.

As operações DML que leem dados de tabelas de concessão e são executadas usando o nível de isolamento `SERIALIZABLE` geram um aviso. As bloqueadoras de leitura que normalmente seriam adquiridas ao usar o nível de isolamento `SERIALIZABLE` não são suportadas em tabelas de concessão.

### 8.2.4 Especificando Nomes de Conta

Os nomes de conta do MySQL consistem em um nome de usuário e um nome de host, o que permite a criação de contas distintas para usuários com o mesmo nome de usuário que se conectam a partir de hosts diferentes. Esta seção descreve a sintaxe para os nomes de conta, incluindo valores especiais e regras de caracteres curinga.

Na maioria dos aspectos, os nomes de conta são semelhantes aos nomes de papel do MySQL, com algumas diferenças descritas na Seção 8.2.5, “Especificação de Nomes de Papel”.

Os nomes das contas aparecem em declarações SQL, como `CREATE USER`, `GRANT` e [`SET PASSWORD`](set-password.html "15.7.1.10 SET PASSWORD Statement") e seguem estas regras:

* A sintaxe do nome da conta é `'user_name'@'host_name'`.

* A parte `@'host_name'` é opcional. Um nome de conta que consiste apenas em um nome de usuário é equivalente a `'user_name'@'%'`. Por exemplo, `'me'` é equivalente a `'me'@'%'`.

* O nome do usuário e o nome do host não precisam ser citados se forem identificadores legais sem citação. As citações devem ser usadas se uma string *`user_name`* contiver caracteres especiais (como espaço ou `-`), ou uma string *`host_name`* contiver caracteres especiais ou caracteres de comodinho (como `.` ou `%`). Por exemplo, no nome da conta `'test-user'@'%.com'`, tanto as partes do nome do usuário quanto do host requerem citações.

* Cite nomes de usuários e nomes de hosts como identificadores ou como strings, usando aspas duplas (`` ` ``), single quotation marks (``), or double quotation marks (`"`). For string-quoting and identifier-quoting guidelines, see Section 11.1.1, “String Literals”, and Section 11.2, “Schema Object Names”. In `SHOW` statement results, user names and host names are quoted using backticks (`` ` ``).

* As partes do nome do usuário e do nome do host, se citadas, devem ser citadas separadamente. Ou seja, escreva `'me'@'localhost'`, não `'me@localhost'`. (Esta última é, na verdade, equivalente a `'me@localhost'@'%'`, embora esse comportamento já esteja desatualizado.)

* Uma referência à função `CURRENT_USER` ou `CURRENT_USER()` é equivalente a especificar o nome de usuário e o nome do host do cliente atual literalmente.

O MySQL armazena os nomes de contas em tabelas de concessão no banco de dados do sistema `mysql`, usando colunas separadas para as partes do nome do usuário e do nome do host:

* A tabela `user` contém uma linha para cada conta. As colunas `User` e `Host` armazenam o nome do usuário e o nome do host. Esta tabela também indica quais privilégios globais a conta tem.

* Outras tabelas de concessão indicam os privilégios que uma conta tem para bancos de dados e objetos dentro dos bancos de dados. Essas tabelas têm as colunas `User` e `Host` para armazenar o nome da conta. Cada linha dessas tabelas está associada à conta na tabela `user` que tem os mesmos valores `User` e `Host`.

* Para fins de verificação de acesso, as comparações dos valores do Usuário são sensíveis ao caso. As comparações dos valores do Host não são sensíveis ao caso.

Para obter informações adicionais sobre as propriedades dos nomes de usuário e nomes de host armazenados nas tabelas de concessão, como o comprimento máximo, consulte Propriedades da coluna de escopo da tabela de concessão.

Os nomes de usuário e os nomes de host têm certos valores especiais ou convenções de caracteres curinga, conforme descrito a seguir.

A parte do nome de usuário de um nome de conta é um valor que não está em branco que corresponde literalmente ao nome de usuário das tentativas de conexão de entrada, ou um valor em branco (a string vazia) que corresponde a qualquer nome de usuário. Uma conta com um nome de usuário em branco é um usuário anônimo. Para especificar um usuário anônimo em declarações SQL, use uma parte de nome de usuário vazia citada, como `''@'localhost'`.

A parte do nome de host de um nome de conta pode assumir muitas formas, e os caracteres de comodinho são permitidos:

* Um valor de host pode ser um nome de host ou um endereço IP (IPv4 ou IPv6). O nome `'localhost'` indica o host local. O endereço IP `'127.0.0.1'` indica a interface de loopback IPv4. O endereço IP `'::1'` indica a interface de loopback IPv6.

* O uso dos caracteres de comodinho `%` e `_` é permitido nos valores de nome de host ou endereço IP, mas é desaconselhado a partir do MySQL 8.0.35 e, portanto, sujeito à remoção em uma versão futura do MySQL. Esses caracteres têm o mesmo significado que as operações de correspondência de padrões realizadas com o operador `LIKE`. Por exemplo, um valor de host de `'%'` corresponde a qualquer nome de host, enquanto um valor de `'%.mysql.com'` corresponde a qualquer host no domínio `mysql.com`. `'198.51.100.%'` corresponde a qualquer host na rede de classe C 198.51.100.

Como os valores de wildcard de IP são permitidos nos valores de host (por exemplo, `'198.51.100.%'` para corresponder a cada host em uma sub-rede), alguém poderia tentar explorar essa capacidade ao nomear um host `198.51.100.somewhere.com`. Para impedir tais tentativas, o MySQL não realiza correspondência em nomes de host que comecem com dígitos e um ponto. Por exemplo, se um host é nomeado `1.2.example.com`, seu nome nunca corresponderá à parte de host dos nomes de conta. Um valor de wildcard de IP pode corresponder apenas a endereços IP, não a nomes de host.

Se `partial_revokes` for `ON`, o MySQL trata `%` e `_` em concessões como caracteres literais, e não como caracteres asteriscos. A partir do MySQL 8.0.35, o uso desses caracteres asteriscos é desaconselhado (independentemente do valor desta variável), e você deve esperar que essa funcionalidade seja removida em uma versão futura do MySQL.

* Para um valor de host especificado como um endereço IPv4, pode-se fornecer uma máscara de rede para indicar quantos bits de endereço devem ser usados para o número de rede. A notação de máscara de rede não pode ser usada para endereços IPv6.

A sintaxe é `host_ip/netmask`. Por exemplo:

  ```
  CREATE USER 'david'@'198.51.100.0/255.255.255.0';
  ```

Isso permite que o `david` se conecte a qualquer host cliente que tenha um endereço IP *`client_ip`* para o qual a seguinte condição seja verdadeira:

  ```
  client_ip & netmask = host_ip
  ```

Ou seja, para a declaração `CREATE USER` que foi mostrada agora:

  ```
  client_ip & 255.255.255.0 = 198.51.100.0
  ```

Os endereços IP que satisfazem essa condição variam de `198.51.100.0` a `198.51.100.255`.

Uma máscara de rede geralmente começa com bits definidos como 1, seguidos por bits definidos como 0. Exemplos:

+ `198.0.0.0/255.0.0.0`: Qualquer host na rede de classe A 198

+ `198.51.0.0/255.255.0.0`: Qualquer host na rede de classe B 198.51

+ `198.51.100.0/255.255.255.0`: Qualquer host na rede de classe C 198.51.100

+ `198.51.100.1`: Apenas o host com este endereço IP específico

* a partir do MySQL 8.0.23, um valor de host especificado como um endereço IPv4 pode ser escrito usando notação CIDR, como `198.51.100.44/24`.

O servidor realiza a correspondência dos valores de host nos nomes de conta contra o host do cliente usando o valor retornado pelo resolutor DNS do sistema para o nome de host ou endereço IP do cliente. Exceto no caso em que o valor de host da conta é especificado usando notação de máscara de rede, o servidor realiza essa comparação como uma correspondência de string, mesmo para um valor de host de conta dado como um endereço IP. Isso significa que você deve especificar valores de host de conta no mesmo formato usado pelo DNS. Aqui estão exemplos de problemas a serem observados:

* Suponha que um host na rede local tenha um nome totalmente qualificado de `host1.example.com`. Se o DNS retornar pesquisas de nome para este host como `host1.example.com`, use esse nome nos valores de host da conta. Se o DNS retornar apenas `host1`, use `host1` em vez disso.

* Se o DNS retornar o endereço IP de um host dado como `198.51.100.2`, que corresponde a um valor de host de conta como `198.51.100.2`, mas não `198.051.100.2`. Da mesma forma, corresponde a um padrão de host de conta como `198.51.100.%`, mas não `198.051.100.%`.

Para evitar problemas como esses, é aconselhável verificar o formato no qual seu DNS retorna nomes e endereços de hospedagem. Use valores no mesmo formato nos nomes das contas do MySQL.

### 8.2.5 Especificando nomes de papéis

Os nomes de papel do MySQL se referem a papéis, que são coleções de privilégios. Para exemplos de uso de papel, consulte a Seção 8.2.10, “Usando papéis”.

Os nomes de role têm sintaxe e semântica semelhantes aos nomes de conta; veja a Seção 8.2.4, “Especificando Nomes de Conta”. Como armazenados nas tabelas de concessão, eles têm as mesmas propriedades que os nomes de conta, que são descritos nas Propriedades das Colunas de Alcance da Tabela de Concessão.

Os nomes dos papéis diferem dos nomes das contas nesses aspectos:

* A parte do usuário dos nomes de papéis não pode ser em branco. Assim, não há um "papel anônimo" análogo ao conceito de "usuário anônimo".

* Quanto a um nome de conta, omitir a parte do host de um nome de papel resulta em uma parte do host de `'%'`. Mas, ao contrário de `'%'` em um nome de conta, uma parte do host de `'%'` em um nome de papel não tem propriedades com caracteres curinga. Por exemplo, para um nome `'me'@'%'` usado como um nome de papel, a parte do host (`'%'`) é apenas um valor literal; não tem nenhuma propriedade de correspondência "qualquer host".

* A notação de máscara de rede na parte do host de um nome de papel não tem significado.

* Um nome de conta é permitido ser `CURRENT_USER()` em vários contextos. Um nome de papel não é.

É possível que uma linha na tabela do sistema `mysql.user` sirva tanto como uma conta quanto um papel. Nesse caso, quaisquer propriedades de nomes de usuário ou de host que correspondam não se aplicam em contextos para os quais o nome é usado como nome de papel. Por exemplo, você não pode executar a seguinte declaração na expectativa de que ela defina os papéis da sessão atual usando todos os papéis que têm uma parte de usuário de `myrole` e qualquer nome de host:

```
SET ROLE 'myrole'@'%';
```

Em vez disso, a declaração define o papel ativo para a sessão como o papel com exatamente o nome `'myrole'@'%'`.

Por essa razão, os nomes de papel são frequentemente especificados usando apenas a parte do nome do usuário e deixando a parte do nome do host implicitamente sendo `'%'`. Especificar um papel com uma parte do host que não é `'%'` pode ser útil se você pretende criar um nome que funcione tanto como um papel quanto como uma conta de usuário que é permitida para se conectar a partir do host fornecido.

### 8.2.6 Controle de Acesso, Etapa 1: Verificação de Conexão

Quando você tenta se conectar a um servidor MySQL, o servidor aceita ou rejeita a conexão com base nessas condições:

* Sua identidade e se você pode verificá-la fornecendo as credenciais adequadas.

* Se sua conta está bloqueada ou desbloqueada.

O servidor verifica as credenciais primeiro, depois o estado de bloqueio da conta. Uma falha em qualquer um desses passos faz com que o servidor negue o acesso completamente. Caso contrário, o servidor aceita a conexão e, em seguida, entra na Etapa 2 e aguarda por solicitações.

O servidor realiza verificação de identidade e credenciais usando colunas na tabela `user`, aceitando a conexão apenas se essas condições forem satisfeitas:

* O nome do host do cliente e o nome do usuário correspondem às colunas `Host` e `User` em algumas linhas da tabela `user`. Para as regras que regem os valores permitidos de `Host` e `User`, consulte a Seção 8.2.4, “Especificação de Nomes de Conta”.

* O cliente fornece as credenciais especificadas na linha (por exemplo, uma senha), conforme indicado pela coluna `authentication_string`. As credenciais são interpretadas usando o plugin de autenticação nomeado na coluna `plugin`.

* A linha indica que a conta está desbloqueada. O estado de bloqueio é registrado na coluna `account_locked`, que deve ter um valor de `'N'`. O bloqueio da conta pode ser definido ou alterado com as declarações `CREATE USER` ou `ALTER USER`.

Sua identidade é baseada em duas informações:

* O nome do usuário do MySQL. * O host do cliente a partir do qual você se conecta.

Se o valor da coluna `User` não estiver em branco, o nome do usuário em uma conexão recebida deve corresponder exatamente. Se o valor da tabela `User` estiver em branco, ele corresponderá a qualquer nome de usuário. Se a linha da tabela `user` que corresponde a uma conexão recebida tiver um nome de usuário em branco, o usuário será considerado um usuário anônimo sem nome, e não um usuário com o nome que o cliente realmente especificou. Isso significa que um nome de usuário em branco será usado para todas as verificações de acesso subsequentes durante a duração da conexão (ou seja, durante a Etapa 2).

A coluna `authentication_string` pode estar em branco. Isso não é um caractere curinga e não significa que qualquer senha corresponda. Isso significa que o usuário deve se conectar sem especificar uma senha. O método de autenticação implementado pelo plugin que autentica o cliente pode ou não usar a senha na coluna `authentication_string`. Neste caso, é possível que uma senha externa também seja usada para autenticação no servidor MySQL.

Os valores de senha não em branco armazenados na coluna `authentication_string` da tabela `user` são criptografados. O MySQL não armazena senhas em texto claro para que qualquer pessoa as veja. Em vez disso, a senha fornecida por um usuário que está tentando se conectar é criptografada (usando o método de hashing de senha implementado pelo plugin de autenticação de conta). A senha criptografada é então usada durante o processo de conexão, quando verifica-se se a senha está correta. Isso é feito sem que a senha criptografada viaje pela conexão. Veja a Seção 8.2.1, “Nomes e Senhas de Usuários da Conta”.

Do ponto de vista do servidor MySQL, a senha criptografada é a *real* senha, então você nunca deve dar acesso a ela a ninguém. Em particular, *não dê acesso de leitura a tabelas no banco de dados do sistema `mysql` a usuários que não são administrativos*.

A tabela a seguir mostra como as várias combinações dos valores de `User` e `Host` na tabela `user` se aplicam às conexões recebidas.

<table summary="How various combinations of User and Host values in the user table apply to incoming connections to a MySQL server."><col style="width: 15%"/><col style="width: 35%"/><col style="width: 50%"/><thead><tr> <th scope="col"><code>User</code> Value</th> <th scope="col"><code>Host</code> Value</th> <th scope="col">Permissible Connections</th> </tr></thead><tbody><tr> <th scope="row"><code>'fred'</code></th> <td><code>'h1.example.net'</code></td> <td><code>fred</code>, connecting from <code>h1.example.net</code></td> </tr><tr> <th scope="row"><code>''</code></th> <td><code>'h1.example.net'</code></td> <td>Any user, connecting from <code>h1.example.net</code></td> </tr><tr> <th scope="row"><code>'fred'</code></th> <td><code>'%'</code></td> <td><code>fred</code>, conectando-se a qualquer host</td> </tr><tr> <th scope="row"><code>''</code></th> <td><code>'%'</code></td> <td>Qualquer usuário, conectando-se a partir de qualquer host</td> </tr><tr> <th scope="row"><code>'fred'</code></th> <td><code>'%.example.net'</code></td> <td><code>fred</code>, conectando-se a qualquer host no<code>example.net</code>domínio</td> </tr><tr> <th scope="row"><code>'fred'</code></th> <td><code>'x.example.%'</code></td> <td><code>fred</code>, conectando-se a<code>x.example.net</code>,<code>x.example.com</code>,<code>x.example.edu</code>, e assim por diante; isso provavelmente não é útil</td> </tr><tr> <th scope="row"><code>'fred'</code></th> <td><code>'198.51.100.177'</code></td> <td><code>fred</code>, conectando-se do host com o endereço IP<code>198.51.100.177</code></td> </tr><tr> <th scope="row"><code>'fred'</code></th> <td><code>'198.51.100.%'</code></td> <td><code>fred</code>, conectando-se a qualquer host no<code>198.51.100</code>sub-rede de classe C</td> </tr><tr> <th scope="row"><code>'fred'</code></th> <td><code>'198.51.100.0/255.255.255.0'</code></td> <td>Same as previous example</td> </tr></tbody></table>

É possível que o nome do host do cliente e o nome do usuário de uma conexão recebida correspondam a mais de uma linha na tabela `user`. O conjunto de exemplos anteriores demonstra isso: Várias das entradas mostradas correspondem a uma conexão de `h1.example.net` por `fred`.

Quando há várias opções de jogos, o servidor deve determinar qual deles deve ser usado. Ele resolve esse problema da seguinte forma:

* Sempre que o servidor lê a tabela `user` na memória, ela ordena as linhas.

* Quando um cliente tenta se conectar, o servidor examina as linhas em ordem ordenada.

* O servidor usa a primeira linha que corresponde ao nome do host do cliente e ao nome do usuário.

O servidor utiliza regras de classificação que ordenam as linhas com os valores mais específicos do `Host` em primeiro lugar:

* Endereços IP e nomes de host literais são os mais específicos.
* Antes do MySQL 8.0.23, a especificidade de um endereço IP literal não é afetada pelo fato de ele ter uma máscara de rede, então `198.51.100.13` e `198.51.100.0/255.255.255.0` são considerados igualmente específicos. A partir do MySQL 8.0.23, as contas com um endereço IP na parte do host têm essa ordem de especificidade:

+ Contas que têm a parte de host fornecida como um endereço IP:

    ```
    CREATE USER 'user_name'@'127.0.0.1';
    CREATE USER 'user_name'@'198.51.100.44';
    ```

+ Contas que têm a parte de host fornecida como um endereço IP usando notação CIDR:

    ```
    CREATE USER 'user_name'@'192.0.2.21/8';
    CREATE USER 'user_name'@'198.51.100.44/16';
    ```

+ Contas que têm a parte do host fornecida como um endereço IP com uma máscara de sub-rede:

    ```
    CREATE USER 'user_name'@'192.0.2.0/255.255.255.0';
    CREATE USER 'user_name'@'198.51.0.0/255.255.0.0';
    ```

* O padrão `'%'` significa "qualquer hospedeiro" e é o menos específico.

* A string vazia `''` também significa “qualquer hospedeiro”, mas é ordenada após `'%'`.

As conexões não TCP (arquivo de soquete, tubo nomeado e memória compartilhada) são tratadas como conexões locais e correspondem a uma parte do host de `localhost` se houver tais contas, ou partes do host com caracteres especiais que correspondem a `localhost` caso contrário (por exemplo, `local%`, `l%`, `%`).

O tratamento do `'%'` como equivalente ao `localhost` é desaconselhável a partir do MySQL 8.0.35, e você deve esperar que esse comportamento seja removido de uma versão futura do MySQL.

As linhas com o mesmo valor `Host` são ordenadas com os valores mais específicos `User` em primeiro lugar. Um valor em branco `User` significa “qualquer usuário” e é o menos específico, então, para linhas com o mesmo valor `Host`, os usuários não anônimos são ordenados antes dos usuários anônimos.

Para linhas com valores igualmente específicos de `Host` e `User`, a ordem não é determinada.

Para entender como isso funciona, suponha que a tabela `user` tenha a seguinte aparência:

```
+-----------+----------+-
| Host      | User     | ...
+-----------+----------+-
| %         | root     | ...
| %         | jeffrey  | ...
| localhost | root     | ...
| localhost |          | ...
+-----------+----------+-
```

Quando o servidor lê a tabela na memória, ele ordena as linhas usando as regras descritas acima. O resultado após o ordenamento é o seguinte:

```
+-----------+----------+-
| Host      | User     | ...
+-----------+----------+-
| localhost | root     | ...
| localhost |          | ...
| %         | jeffrey  | ...
| %         | root     | ...
+-----------+----------+-
```

Quando um cliente tenta se conectar, o servidor examina as linhas ordenadas e usa a primeira correspondência encontrada. Para uma conexão de `localhost` por `jeffrey`, duas das linhas da tabela correspondem: a que tem os valores de `Host` e `User` de `'localhost'` e `''`, e a que tem os valores de `'%'` e `'jeffrey'`. A linha de `'localhost'` aparece primeiro na ordem ordenada, então é a que o servidor usa.

Aqui está outro exemplo. Suponha que a tabela `user` pareça assim:

```
+----------------+----------+-
| Host           | User     | ...
+----------------+----------+-
| %              | jeffrey  | ...
| h1.example.net |          | ...
+----------------+----------+-
```

A tabela ordenada parece assim:

```
+----------------+----------+-
| Host           | User     | ...
+----------------+----------+-
| h1.example.net |          | ...
| %              | jeffrey  | ...
+----------------+----------+-
```

A primeira linha corresponde a uma conexão por qualquer usuário de `h1.example.net`, enquanto a segunda linha corresponde a uma conexão por `jeffrey` de qualquer host.

Nota

É um equívoco comum pensar que, para um nome de usuário dado, todas as linhas que explicitamente nomeiam esse usuário são usadas primeiro quando o servidor tenta encontrar uma correspondência para a conexão. Isso não é verdade. O exemplo anterior ilustra isso, onde uma conexão de `h1.example.net` por `jeffrey` é correspondida primeiro não pela linha contendo `'jeffrey'` como o valor da coluna `User`, mas pela linha sem nome de usuário. Como resultado, `jeffrey` é autenticado como um usuário anônimo, embora ele tenha especificado um nome de usuário ao se conectar.

Se você conseguir se conectar ao servidor, mas seus privilégios não forem o que você espera, provavelmente está sendo autenticado como outra conta. Para descobrir qual conta o servidor usou para autenticá-lo, use a função `CURRENT_USER()`. (Veja a Seção 14.15, “Funções de Informação”.) Ela retorna um valor no formato `user_name@host_name` que indica os valores de `User` e `Host` da linha correspondente da tabela `user`. Suponha que `jeffrey` se conecte e emita a seguinte consulta:

```
mysql> SELECT CURRENT_USER();
+----------------+
| CURRENT_USER() |
+----------------+
| @localhost     |
+----------------+
```

O resultado mostrado aqui indica que a linha da tabela correspondente `user` tinha um valor em branco na coluna `User`. Em outras palavras, o servidor está tratando `jeffrey` como um usuário anônimo.

Outra maneira de diagnosticar problemas de autenticação é imprimir a tabela `user` e ordená-la manualmente para ver onde a primeira correspondência está sendo feita.

### 8.2.7 Controle de Acesso, Etapa 2: Solicitação de Verificação

Após o servidor aceitar uma conexão, ele entra na Etapa 2 do controle de acesso. Para cada solicitação que você emite através da conexão, o servidor determina qual operação você deseja realizar e, em seguida, verifica se seus privilégios são suficientes. É aqui que as colunas de privilégio nas tabelas de concessão entram em jogo. Esses privilégios podem vir de qualquer uma das tabelas `user`, `global_grants`, `db`, `tables_priv`, `columns_priv` ou `procs_priv`. (Você pode achar útil consultar a Seção 8.2.3, “Tabelas de Concessão”, que lista as colunas presentes em cada tabela de concessão.)

As tabelas `user` e `global_grants` concedem privilégios globais. As linhas dessas tabelas para uma conta específica indicam os privilégios da conta que se aplicam de forma global, independentemente do banco de dados padrão. Por exemplo, se a tabela `user` concedeu o privilégio `DELETE`, você pode excluir linhas de qualquer tabela em qualquer banco de dados no host do servidor. É prudente conceder privilégios na tabela `user` apenas para pessoas que precisam deles, como administradores de banco de dados. Para outros usuários, deixe todos os privilégios na tabela `user` definidos como `'N'` e conceda privilégios em níveis mais específicos apenas (para bancos de dados, tabelas, colunas ou rotinas particulares). Também é possível conceder privilégios de banco de dados globalmente, mas usar remanescentes parciais para restringi-los a serem exercidos em bancos de dados específicos (consulte Seção 8.2.12, “Restrição de privilégios usando remanescentes parciais”).

A tabela `db` concede privilégios específicos para o banco de dados. Os valores nas colunas de escopo desta tabela podem assumir as seguintes formas:

* Um valor vazio `User` corresponde ao usuário anônimo. Um valor não vazio corresponde literalmente; não há caracteres especiais nos nomes dos usuários.

* Os caracteres curinga `%` e `_` podem ser usados nas colunas `Host` e `Db`. Esses têm o mesmo significado que para operações de correspondência de padrões realizadas com o operador `LIKE`. Se você deseja usar qualquer caractere literalmente ao conceder privilégios, deve escapar com uma barra invertida. Por exemplo, para incluir o caractere sublinhado (`_`) como parte de um nome de banco de dados, especifique-o como `_` na declaração `GRANT`.

* Um valor de `'%'` ou vazio de `Host` significa “qualquer hospedeiro”.

* Um valor de `'%'` ou vazio de `Db` significa “qualquer banco de dados”.

O servidor lê a tabela `db` na memória e a ordena ao mesmo tempo em que lê a tabela `user`. O servidor ordena a tabela `db` com base nas colunas de escopo `Host`, `Db` e `User`. Assim como na tabela `user`, a ordenação coloca os valores mais específicos primeiro e os menos específicos por último, e quando o servidor procura por linhas correspondentes, ele usa a primeira correspondência que encontra.

As tabelas `tables_priv`, `columns_priv` e `procs_priv` concedem privilégios específicos para a tabela, específicos para a coluna e específicos para a rotina. Os valores nas colunas de escopo dessas tabelas podem assumir as seguintes formas:

* Os caracteres curinga `%` e `_` podem ser usados na coluna `Host`. Esses têm o mesmo significado que as operações de correspondência de padrões realizadas com o operador `LIKE`.

* Um valor de `'%'` ou vazio de `Host` significa “qualquer hospedeiro”.

As colunas `Db`, `Table_name`, `Column_name` e `Routine_name` não podem conter caracteres asteriscos ou ficar em branco.

O servidor ordena as tabelas `tables_priv`, `columns_priv` e `procs_priv` com base nas colunas `Host`, `Db` e `User`. Isso é semelhante ao ordenamento da tabela `db`, mas mais simples porque apenas a coluna `Host` pode conter caracteres asteriscos.

O servidor usa as tabelas ordenadas para verificar cada solicitação que recebe. Para solicitações que requerem privilégios administrativos, como `SHUTDOWN` ou `RELOAD`, o servidor verifica apenas as tabelas `user` e `global_privilege`, pois são as únicas tabelas que especificam privilégios administrativos. O servidor concede acesso se uma linha da conta nessas tabelas permitir a operação solicitada e, caso contrário, nega o acesso. Por exemplo, se você deseja executar **mysqladmin shutdown**, mas a linha da tabela `user` não concede o privilégio `SHUTDOWN` para você, o servidor nega o acesso, mesmo sem verificar a tabela `db`. (Esta última tabela não contém a coluna `Shutdown_priv`, portanto, não há necessidade de verificá-la.)

Para solicitações relacionadas a bancos de dados (`INSERT`, `UPDATE`, e assim por diante), o servidor verifica primeiro os privilégios globais do usuário na linha da tabela `user` (menos quaisquer restrições de privilégio impostas por revogações parciais). Se a linha permitir a operação solicitada, o acesso é concedido. Se os privilégios globais na tabela `user` forem insuficientes, o servidor determina os privilégios específicos do banco de dados do usuário a partir da tabela `db`:

* O servidor procura na tabela `db` uma correspondência nas colunas `Host`, `Db` e `User`.

As colunas `Host` e `User` são correspondidas ao nome do host do usuário conectando e ao nome do usuário do MySQL.

* A coluna `Db` é correspondida ao banco de dados que o usuário deseja acessar.

* Se não houver uma linha para `Host` e `User`, o acesso será negado.

Após determinar os privilégios específicos do banco de dados concedidos pelas linhas da tabela `db`, o servidor adiciona-os aos privilégios globais concedidos pela tabela `user`. Se o resultado permitir a operação solicitada, o acesso é concedido. Caso contrário, o servidor verifica sucessivamente os privilégios da tabela e coluna do usuário nas tabelas `tables_priv` e `columns_priv`, adiciona-os aos privilégios do usuário e permite ou nega o acesso com base no resultado. Para operações de rotina armazenada, o servidor usa a tabela `procs_priv` em vez de `tables_priv` e `columns_priv`.

Expresso em termos lógicos, a descrição anterior sobre como os privilégios de um usuário são calculados pode ser resumida da seguinte forma:

```
global privileges
OR database privileges
OR table privileges
OR column privileges
OR routine privileges
```

Pode não ser aparente por que, se os privilégios globais forem inicialmente encontrados como insuficientes para a operação solicitada, o servidor adiciona esses privilégios à tabela e aos privilégios de coluna do banco de dados posteriormente. O motivo é que um pedido pode exigir mais de um tipo de privilégio. Por exemplo, se você executar uma declaração `INSERT INTO ... SELECT`(insert-select.html "15.2.7.1 INSERT ... SELECT Statement"), você precisa dos privilégios `INSERT` e `SELECT`. Seus privilégios podem ser tais que a linha de tabela `user` concede um privilégio global e a linha de tabela `db` concede o outro especificamente para o banco de dados relevante. Neste caso, você tem os privilégios necessários para realizar o pedido, mas o servidor não pode dizer isso apenas com seus privilégios globais ou de banco de dados. Ele deve tomar uma decisão de controle de acesso com base nos privilégios combinados.

### 8.2.8 Adicionar contas, atribuir privilégios e excluir contas

Para gerenciar contas do MySQL, use as instruções SQL destinadas a esse propósito:

* `CREATE USER` e `DROP USER` criam e removem contas.

* `GRANT` e `REVOKE` atribuem privilégios e revogam privilégios de contas.

* `SHOW GRANTS` exibe as atribuições de privilégios da conta.

As declarações de gerenciamento de conta fazem com que o servidor realize as modificações apropriadas nas tabelas de concessão subjacentes, que são discutidas na Seção 8.2.3, "Tabelas de concessão".

Nota

A modificação direta das tabelas de subsídios usando declarações como `INSERT`, `UPDATE` ou `DELETE` é desencorajada e feita por sua conta e risco. O servidor é livre para ignorar linhas que se tornam malformadas como resultado de tais modificações.

Para qualquer operação que modifique uma tabela de concessão, o servidor verifica se a tabela possui a estrutura esperada e produz um erro se não o fizer. Para atualizar as tabelas para a estrutura esperada, realize o procedimento de atualização do MySQL. Veja o Capítulo 3, *Atualizando o MySQL*.

Outra opção para criar contas é usar a ferramenta gráfica MySQL Workbench. Além disso, vários programas de terceiros oferecem capacidades para administração de contas do MySQL. `phpMyAdmin` é um desses programas.

Esta seção discute os seguintes tópicos:

* Criar contas e conceder privilégios
* Verificar privilégios e propriedades da conta
* Revogar privilégios da conta
* Eliminar contas

Para informações adicionais sobre as declarações discutidas aqui, consulte a Seção 15.7.1, “Declarações de Gerenciamento de Conta”.

#### Criando Contas e Atribuindo Privilegios

Os exemplos a seguir mostram como usar o programa cliente **mysql** para configurar novas contas. Esses exemplos assumem que a conta `root` do MySQL tem o privilégio `CREATE USER` e todos os privilégios que ela concede a outras contas.

Na linha de comando, conecte-se ao servidor como o usuário `root` do MySQL, fornecendo a senha apropriada na prompt de senha:

```
$> mysql -u root -p
Enter password: (enter root password here)
```

Após se conectar ao servidor, você pode adicionar novas contas. O exemplo a seguir usa as declarações `CREATE USER` e `GRANT` para configurar quatro contas (onde você vê `'password'`, substitua uma senha apropriada):

```
CREATE USER 'finley'@'localhost'
  IDENTIFIED BY 'password';
GRANT ALL
  ON *.*
  TO 'finley'@'localhost'
  WITH GRANT OPTION;

CREATE USER 'finley'@'%.example.com'
  IDENTIFIED BY 'password';
GRANT ALL
  ON *.*
  TO 'finley'@'%.example.com'
  WITH GRANT OPTION;

CREATE USER 'admin'@'localhost'
  IDENTIFIED BY 'password';
GRANT RELOAD,PROCESS
  ON *.*
  TO 'admin'@'localhost';

CREATE USER 'dummy'@'localhost';
```

As contas criadas por essas declarações têm as seguintes propriedades:

* Duas contas têm um nome de usuário de `finley`. Ambas são contas de superusuário com privilégios globais completos para fazer qualquer coisa. A conta `'finley'@'localhost'` pode ser usada apenas ao se conectar a partir do host local. A conta `'finley'@'%.example.com'` usa o caractere curinga `'%'` na parte do host, portanto, pode ser usada para se conectar a partir de qualquer host no domínio `example.com`.

A conta `'finley'@'localhost'` é necessária se houver uma conta de usuário anônimo para `localhost`. Sem a conta `'finley'@'localhost'`, essa conta de usuário anônimo tem precedência quando o `finley` se conecta a partir do host local e o `finley` é tratado como um usuário anônimo. A razão para isso é que a conta de usuário anônimo tem um valor mais específico da coluna `Host` do que a conta `'finley'@'%'` e, portanto, vem em ordem de classificação da tabela `user` antes. (Para informações sobre a classificação da tabela `user`, consulte a Seção 8.2.6, “Controle de Acesso, Etapa 1: Verificação de Conexão”.)

* A conta `'admin'@'localhost'` só pode ser usada pelo `admin` para se conectar a partir do host local. Ela recebe os privilégios administrativos globais `RELOAD` e `PROCESS`. Esses privilégios permitem que o usuário `admin` execute os comandos **mysqladmin reload**, [**mysqladmin refresh**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program"), e [**mysqladmin flush-*`xxx`***](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") , além do **mysqladmin processlist**. Não são concedidos privilégios para acessar quaisquer bancos de dados. Você pode adicionar tais privilégios usando declarações `GRANT`.

* A conta `'dummy'@'localhost'` não tem senha (o que é inseguro e não é recomendado). Essa conta só pode ser usada para se conectar a partir do host local. Não são concedidos privilégios. Assume-se que você concede privilégios específicos à conta usando as declarações `GRANT`.

O exemplo anterior concede privilégios em nível global. O próximo exemplo cria três contas e concede-lhes acesso em níveis mais baixos, ou seja, a bancos de dados específicos ou objetos dentro dos bancos de dados. Cada conta tem um nome de usuário de `custom`, mas as partes do nome de host diferem:

```
CREATE USER 'custom'@'localhost'
  IDENTIFIED BY 'password';
GRANT ALL
  ON bankaccount.*
  TO 'custom'@'localhost';

CREATE USER 'custom'@'host47.example.com'
  IDENTIFIED BY 'password';
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP
  ON expenses.*
  TO 'custom'@'host47.example.com';

CREATE USER 'custom'@'%.example.com'
  IDENTIFIED BY 'password';
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP
  ON customer.addresses
  TO 'custom'@'%.example.com';
```

Os três perfis podem ser utilizados da seguinte forma:

* A conta `'custom'@'localhost'` possui todos os privilégios de nível de banco de dados para acessar o banco de dados `bankaccount`. A conta pode ser usada para se conectar ao servidor apenas a partir do host local.

* A conta `'custom'@'host47.example.com'` possui privilégios específicos de nível de banco de dados para acessar o banco de dados `expenses`. A conta pode ser usada para se conectar ao servidor apenas a partir do host `host47.example.com`.

* A conta `'custom'@'%.example.com'` possui privilégios específicos em nível de tabela para acessar a tabela `addresses` no banco de dados `customer`, a partir de qualquer host no domínio `example.com`. A conta pode ser usada para se conectar ao servidor a partir de todas as máquinas do domínio devido ao uso do caractere comodínio `%` na parte do host do nome da conta.

#### Privilegios e propriedades da conta corrente

Para ver os privilégios de uma conta, use `SHOW GRANTS`:

```
mysql> SHOW GRANTS FOR 'admin'@'localhost';
+-----------------------------------------------------+
| Grants for admin@localhost                          |
+-----------------------------------------------------+
| GRANT RELOAD, PROCESS ON *.* TO `admin`@`localhost` |
+-----------------------------------------------------+
```

Para ver propriedades não privilegiadas para uma conta, use `SHOW CREATE USER`:

```
mysql> SET print_identified_with_as_hex = ON;
mysql> SHOW CREATE USER 'admin'@'localhost'\G
*************************** 1. row ***************************
CREATE USER for admin@localhost: CREATE USER `admin`@`localhost`
IDENTIFIED WITH 'caching_sha2_password'
AS 0x24412430303524301D0E17054E2241362B1419313C3E44326F294133734B30792F436E77764270373039612E32445250786D43594F45354532324B6169794F47457852796E32
REQUIRE NONE PASSWORD EXPIRE DEFAULT ACCOUNT UNLOCK
PASSWORD HISTORY DEFAULT
PASSWORD REUSE INTERVAL DEFAULT
PASSWORD REQUIRE CURRENT DEFAULT
```

Ativação da variável de sistema `print_identified_with_as_hex` (disponível a partir do MySQL 8.0.17) faz com que `SHOW CREATE USER` exiba valores de hash que contêm caracteres não imprimíveis como strings hexadecimais, em vez de como literais de string regulares.

#### Retirar privilégios da conta

Para revogar os privilégios da conta, use a declaração `REVOKE`. Os privilégios podem ser revogados em diferentes níveis, assim como podem ser concedidos em diferentes níveis.

Revocar privilégios globais:

```
REVOKE ALL
  ON *.*
  FROM 'finley'@'%.example.com';

REVOKE RELOAD
  ON *.*
  FROM 'admin'@'localhost';
```

Reveja os privilégios do nível de banco de dados:

```
REVOKE CREATE,DROP
  ON expenses.*
  FROM 'custom'@'host47.example.com';
```

Revocar privilégios de nível de tabela:

```
REVOKE INSERT,UPDATE,DELETE
  ON customer.addresses
  FROM 'custom'@'%.example.com';
```

Para verificar o efeito da revogação de privilégios, use `SHOW GRANTS`:

```
mysql> SHOW GRANTS FOR 'admin'@'localhost';
+---------------------------------------------+
| Grants for admin@localhost                  |
+---------------------------------------------+
| GRANT PROCESS ON *.* TO `admin`@`localhost` |
+---------------------------------------------+
```

#### Deixar contas

Para remover uma conta, use a declaração `DROP USER`(drop-user.html "15.7.1.5 DROP USER Statement"). Por exemplo, para descartar algumas das contas criadas anteriormente:

```
DROP USER 'finley'@'localhost';
DROP USER 'finley'@'%.example.com';
DROP USER 'admin'@'localhost';
DROP USER 'dummy'@'localhost';
```

### 8.2.9 Contas Reservadas

Uma parte do processo de instalação do MySQL é a inicialização do diretório de dados (consulte a Seção 2.9.1, “Inicialização do diretório de dados”). Durante a inicialização do diretório de dados, o MySQL cria contas de usuário que devem ser consideradas reservadas:

* `'root'@'localhost`: Usado para fins administrativos. Esta conta tem todos os privilégios, é uma conta de sistema e pode realizar qualquer operação.

Estritamente falando, esse nome de conta não está reservado, no sentido de que algumas instalações renomeiam a conta `root` para algo mais, para evitar expor uma conta altamente privilegiada com um nome bem conhecido.

* `'mysql.sys'@'localhost'`: Usado como o `DEFINER` para objetos de esquema `sys`. O uso da conta `mysql.sys` evita problemas que ocorrem se um DBA renomear ou remover a conta `root`. Esta conta é bloqueada para que não possa ser usada para conexões de clientes.

* `'mysql.session'@'localhost'`: Usado internamente por plugins para acessar o servidor. Essa conta está bloqueada para que não possa ser usada para conexões de clientes. A conta é uma conta do sistema.

* `'mysql.infoschema'@'localhost'`: Usado como o `DEFINER` para as visualizações de `INFORMATION_SCHEMA`. O uso da conta `mysql.infoschema` evita problemas que ocorrem se um DBA renomear ou remover a conta raiz. Esta conta é bloqueada para que não possa ser usada para conexões de clientes.

### 8.2.10 Usando papéis

Um papel do MySQL é uma coleção nomeada de privilégios. Assim como as contas de usuário, os papéis podem ter privilégios concedidos e revogados.

Uma conta de usuário pode receber papéis, o que concede à conta os privilégios associados a cada papel. Isso permite a atribuição de conjuntos de privilégios às contas e oferece uma alternativa conveniente para a concessão de privilégios individuais, tanto para a conceituação das atribuições de privilégios desejadas quanto para a implementação delas.

A lista a seguir resume as capacidades de gerenciamento de papéis fornecidas pelo MySQL:

* `CREATE ROLE` e `DROP ROLE` criam e removem papéis.

* `GRANT` e `REVOKE` atribuem privilégios para revogar privilégios de contas e papéis de usuários.

* `SHOW GRANTS` exibe atribuições de privilégios e papéis para contas e papéis de usuários.

* `SET DEFAULT ROLE` especifica quais papéis de conta são ativos por padrão.

* `SET ROLE` altera os papéis ativos dentro da sessão atual.

* A função `CURRENT_ROLE()` exibe os papéis ativos dentro da sessão atual.

* As variáveis de sistema `mandatory_roles` e `activate_all_roles_on_login` permitem definir papéis obrigatórios e ativação automática de papéis concedidos quando os usuários fazem login no servidor.

Para descrições de declarações de manipulação de papel individual (incluindo os privilégios necessários para usá-las), consulte a Seção 15.7.1, “Declarações de Gerenciamento de Conta”. A discussão a seguir fornece exemplos de uso do papel. A menos que especificado de outra forma, as declarações SQL mostradas aqui devem ser executadas usando uma conta MySQL com privilégios administrativos suficientes, como a conta `root`.

* Criar papéis e conceder privilégios a eles
* Definir papéis obrigatórios
* Verificar privilégios de papel
* Ativando papéis
* Revogar papéis ou privilégios de papel
* Eliminar papéis
* Intercambiabilidade de usuários e papéis

#### Criando papéis e concedendo privilégios a eles

Considere este cenário:

* Um aplicativo usa um banco de dados chamado `app_db`.

* Associado à aplicação, podem haver contas para desenvolvedores que criam e mantêm a aplicação, e para usuários que interagem com ela.

* Os desenvolvedores precisam de acesso total ao banco de dados. Alguns usuários precisam apenas de acesso de leitura, outros precisam de acesso de leitura/escrita.

Para evitar conceder privilégios individualmente a possivelmente muitas contas de usuário, crie papéis como nomes para os conjuntos de privilégios necessários. Isso facilita a concessão dos privilégios necessários às contas de usuário, concedendo os papéis apropriados.

Para criar os papéis, use a declaração `CREATE ROLE`(create-role.html "15.7.1.2 CREATE ROLE Statement"):

```
CREATE ROLE 'app_developer', 'app_read', 'app_write';
```

Os nomes de papéis são muito semelhantes aos nomes de contas de usuário e consistem em uma parte de usuário e uma parte de host no formato `'user_name'@'host_name'`. A parte de host, se omitida, tem como padrão `'%'`. A parte de usuário e a parte de host podem não ser citadas, a menos que contenham caracteres especiais, como `-` ou `%`. Ao contrário dos nomes de contas, a parte de usuário dos nomes de papéis não pode ser em branco. Para informações adicionais, consulte a Seção 8.2.5, “Especificação de Nomes de Papéis”.

Para atribuir privilégios aos papéis, execute as instruções `GRANT` usando a mesma sintaxe que para atribuir privilégios a contas de usuário:

```
GRANT ALL ON app_db.* TO 'app_developer';
GRANT SELECT ON app_db.* TO 'app_read';
GRANT INSERT, UPDATE, DELETE ON app_db.* TO 'app_write';
```

Agora, suponha que inicialmente você precise de uma conta de desenvolvedor, duas contas de usuário que precisem de acesso apenas de leitura e uma conta de usuário que precise de acesso de leitura/escrita. Use `CREATE USER` para criar as contas:

```
CREATE USER 'dev1'@'localhost' IDENTIFIED BY 'dev1pass';
CREATE USER 'read_user1'@'localhost' IDENTIFIED BY 'read_user1pass';
CREATE USER 'read_user2'@'localhost' IDENTIFIED BY 'read_user2pass';
CREATE USER 'rw_user1'@'localhost' IDENTIFIED BY 'rw_user1pass';
```

Para atribuir a cada conta de usuário os privilégios necessários, você pode usar as declarações `GRANT` do mesmo formato mostrado acima, mas isso exige a enumeração de privilégios individuais para cada usuário. Em vez disso, use uma sintaxe alternativa `GRANT` que permite a concessão de papéis em vez de privilégios:

```
GRANT 'app_developer' TO 'dev1'@'localhost';
GRANT 'app_read' TO 'read_user1'@'localhost', 'read_user2'@'localhost';
GRANT 'app_read', 'app_write' TO 'rw_user1'@'localhost';
```

A declaração `GRANT` para a conta `rw_user1` concede os papéis de leitura e escrita, que combinam para fornecer os privilégios de leitura e escrita necessários.

A sintaxe `GRANT` para conceder papéis a uma conta difere da sintaxe para conceder privilégios: há uma cláusula `ON` para atribuir privilégios, enquanto não há uma cláusula `ON` para atribuir papéis. Como as sintaxes são distintas, você não pode misturar a atribuição de privilégios e papéis na mesma declaração. (É permitido atribuir tanto privilégios quanto papéis a uma conta, mas você deve usar declarações separadas `GRANT`, cada uma com sintaxe apropriada para o que deve ser concedido.) A partir do MySQL 8.0.16, os papéis não podem ser concedidos a usuários anônimos.

Um papel quando criado é bloqueado, não tem senha e é atribuído o plugin de autenticação padrão. (Esses atributos de papel podem ser alterados posteriormente com a declaração `ALTER USER`, por usuários que possuem o privilégio global `CREATE USER`.

Enquanto bloqueado, um papel não pode ser usado para autenticar-se no servidor. Se desbloqueado, um papel pode ser usado para autenticar. Isso ocorre porque papéis e usuários são ambos identificadores de autorização com muito em comum e pouco para distingui-los. Veja também Intercambiabilidade de Usuário e Papel.

#### Definindo papéis obrigatórios

É possível especificar funções como obrigatórias ao nomeá-las no valor da variável de sistema `mandatory_roles`. O servidor trata uma função obrigatória como concedida a todos os usuários, de modo que não precisa ser concedida explicitamente a nenhuma conta.

Para especificar papéis obrigatórios na inicialização do servidor, defina `mandatory_roles` no seu arquivo de servidor `my.cnf`:

```
[mysqld]
mandatory_roles='role1,role2@localhost,r3@%.example.com'
```

Para definir e persistir em `mandatory_roles` em tempo de execução, use uma declaração como esta:

```
SET PERSIST mandatory_roles = 'role1,role2@localhost,r3@%.example.com';
```

`SET PERSIST` (set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") define um valor para a instância MySQL em execução. Também salva o valor, fazendo com que ele seja carregado em reinicializações subsequentes do servidor. Para alterar o valor da instância MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`. Veja a Seção 15.7.6.1, “Sintaxe SET para atribuição de variáveis”.

Para definir `mandatory_roles`, é necessário o privilégio `ROLE_ADMIN`, além do privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio descontinuado `SUPER`, que normalmente é necessário para definir uma variável de sistema global).

Os papéis obrigatórios, assim como os papéis explicitamente concedidos, só entram em vigor quando ativados (consulte Ativação de papéis). No momento do login, a ativação dos papéis é realizada para todos os papéis concedidos se a variável de sistema `activate_all_roles_on_login` estiver habilitada, ou para os papéis que são definidos como papéis padrão, caso contrário. No momento da execução, `SET ROLE`(set-role.html "15.7.1.11 SET ROLE Statement") ativa os papéis.

Os papéis nomeados no valor de `mandatory_roles` não podem ser revogados com `REVOKE` ou removidos com `DROP ROLE` ou `DROP USER`.

Para evitar que as sessões sejam feitas como sessões do sistema por padrão, um papel que tenha o privilégio `SYSTEM_USER` não pode ser listado no valor da variável de sistema `mandatory_roles`:

* Se `mandatory_roles` receber um papel no início que tenha o privilégio `SYSTEM_USER`, o servidor escreve uma mensagem no log de erro e sai.

* Se `mandatory_roles` receber um papel no tempo de execução que tenha o privilégio `SYSTEM_USER`, ocorrerá um erro e o valor `mandatory_roles` permanecerá inalterado.

Mesmo com essa proteção, é melhor evitar conceder o privilégio `SYSTEM_USER` por meio de um papel, a fim de evitar a possibilidade de escalada de privilégios.

Se um papel nomeado no sistema `mandatory_roles` não estiver presente na tabela do sistema `mysql.user`, o papel não será concedido aos usuários. Quando o servidor tenta ativar o papel para um usuário, ele não trata o papel inexistente como obrigatório e escreve um aviso no log de erro. Se o papel for criado posteriormente e, portanto, se tornar válido, pode ser necessário `FLUSH PRIVILEGES` (flush.html#flush-privileges) para fazer com que o servidor o trate como obrigatório.

`SHOW GRANTS` exibe funções obrigatórias de acordo com as regras descritas na Seção 15.7.7.21, "Declaração de GRANTS".

#### Verificando privilégios de papel

Para verificar os privilégios atribuídos a uma conta, use `SHOW GRANTS`. Por exemplo:

```
mysql> SHOW GRANTS FOR 'dev1'@'localhost';
+-------------------------------------------------+
| Grants for dev1@localhost                       |
+-------------------------------------------------+
| GRANT USAGE ON *.* TO `dev1`@`localhost`        |
| GRANT `app_developer`@`%` TO `dev1`@`localhost` |
+-------------------------------------------------+
```

No entanto, isso mostra cada papel concedido sem “expandir” para os privilégios que o papel representa. Para mostrar os privilégios do papel também, adicione uma cláusula `USING` que nomeia os papéis concedidos para os quais os privilégios devem ser exibidos:

```
mysql> SHOW GRANTS FOR 'dev1'@'localhost' USING 'app_developer';
+----------------------------------------------------------+
| Grants for dev1@localhost                                |
+----------------------------------------------------------+
| GRANT USAGE ON *.* TO `dev1`@`localhost`                 |
| GRANT ALL PRIVILEGES ON `app_db`.* TO `dev1`@`localhost` |
| GRANT `app_developer`@`%` TO `dev1`@`localhost`          |
+----------------------------------------------------------+
```

Verifique cada tipo de usuário de maneira semelhante:

```
mysql> SHOW GRANTS FOR 'read_user1'@'localhost' USING 'app_read';
+--------------------------------------------------------+
| Grants for read_user1@localhost                        |
+--------------------------------------------------------+
| GRANT USAGE ON *.* TO `read_user1`@`localhost`         |
| GRANT SELECT ON `app_db`.* TO `read_user1`@`localhost` |
| GRANT `app_read`@`%` TO `read_user1`@`localhost`       |
+--------------------------------------------------------+
mysql> SHOW GRANTS FOR 'rw_user1'@'localhost' USING 'app_read', 'app_write';
+------------------------------------------------------------------------------+
| Grants for rw_user1@localhost                                                |
+------------------------------------------------------------------------------+
| GRANT USAGE ON *.* TO `rw_user1`@`localhost`                                 |
| GRANT SELECT, INSERT, UPDATE, DELETE ON `app_db`.* TO `rw_user1`@`localhost` |
| GRANT `app_read`@`%`,`app_write`@`%` TO `rw_user1`@`localhost`               |
+------------------------------------------------------------------------------+
```

`SHOW GRANTS` exibe os papéis obrigatórios de acordo com as regras descritas na Seção 15.7.7.21, "Declaração de GRANTS".

#### Ativação de papéis

Os papéis concedidos a uma conta de usuário podem ser ativos ou inativos dentro das sessões da conta. Se um papel concedido estiver ativo em uma sessão, seus privilégios se aplicam; caso contrário, não se aplicam. Para determinar quais papéis estão ativos na sessão atual, use a função `CURRENT_ROLE()`.

Por padrão, conceder um papel a uma conta ou nomeá-la no valor da variável de sistema `mandatory_roles` não causa automaticamente que o papel se torne ativo nas sessões da conta. Por exemplo, porque até agora, na discussão anterior, nenhum papel `rw_user1` foi ativado, se você se conectar ao servidor como `rw_user1` e invocar a função `CURRENT_ROLE()`, o resultado é `NONE` (sem papéis ativos):

```
mysql> SELECT CURRENT_ROLE();
+----------------+
| CURRENT_ROLE() |
+----------------+
| NONE           |
+----------------+
```

Para especificar quais papéis devem se tornar ativos a cada vez que um usuário se conecta ao servidor e se autentica, use `SET DEFAULT ROLE`. Para definir o padrão para todos os papéis atribuídos para cada conta criada anteriormente, use esta declaração:

```
SET DEFAULT ROLE ALL TO
  'dev1'@'localhost',
  'read_user1'@'localhost',
  'read_user2'@'localhost',
  'rw_user1'@'localhost';
```

Agora, se você se conectar como `rw_user1`, o valor inicial de `CURRENT_ROLE()` reflete as novas atribuições de papel padrão:

```
mysql> SELECT CURRENT_ROLE();
+--------------------------------+
| CURRENT_ROLE()                 |
+--------------------------------+
| `app_read`@`%`,`app_write`@`%` |
+--------------------------------+
```

Para fazer com que todos os papéis explicitamente concedidos e obrigatórios sejam ativados automaticamente quando os usuários se conectam ao servidor, habilite a variável de sistema `activate_all_roles_on_login`. Por padrão, a ativação automática do papel é desativada.

Dentro de uma sessão, um usuário pode executar `SET ROLE` para alterar o conjunto de papéis ativos. Por exemplo, para `rw_user1`:

```
mysql> SET ROLE NONE; SELECT CURRENT_ROLE();
+----------------+
| CURRENT_ROLE() |
+----------------+
| NONE           |
+----------------+
mysql> SET ROLE ALL EXCEPT 'app_write'; SELECT CURRENT_ROLE();
+----------------+
| CURRENT_ROLE() |
+----------------+
| `app_read`@`%` |
+----------------+
mysql> SET ROLE DEFAULT; SELECT CURRENT_ROLE();
+--------------------------------+
| CURRENT_ROLE()                 |
+--------------------------------+
| `app_read`@`%`,`app_write`@`%` |
+--------------------------------+
```

O primeiro `SET ROLE` desativa todos os papéis. O segundo torna o `rw_user1` efetivamente apenas para leitura. O terceiro restaura os papéis padrão.

O usuário efetivo para objetos de programa armazenado e visualização está sujeito aos atributos `DEFINER` e `SQL SECURITY`, que determinam se a execução ocorre no contexto do invocador ou do definidor (ver Seção 27.6, “Controle de Acesso a Objeto Armazenado”):

* Os objetos de programa armazenado e visualização que executam em contexto de invocável são executados com os papéis ativos na sessão atual.

Objetos de programa armazenado e visualizados que executam em contexto de definição são executados com os papéis padrão do usuário nomeado em seu atributo `DEFINER`. Se `activate_all_roles_on_login` estiver habilitado, esses objetos são executados com todos os papéis concedidos ao usuário `DEFINER`, incluindo papéis obrigatórios. Para programas armazenados, se a execução deve ocorrer com papéis diferentes dos padrões, o corpo do programa pode executar [`SET ROLE`](set-role.html "15.7.1.11 SET ROLE Statement") para ativar os papéis necessários. Isso deve ser feito com cautela, pois os privilégios atribuídos aos papéis podem ser alterados.

#### Retirar papéis ou privilégios de papel

Assim como os papéis podem ser concedidos a uma conta, eles também podem ser revogados de uma conta:

```
REVOKE role FROM user;
```

Os papéis nomeados na variável de sistema `mandatory_roles` não podem ser revogados.

`REVOKE` também pode ser aplicado a um papel para modificar os privilégios concedidos a ele. Isso afeta não apenas o próprio papel, mas qualquer conta concedida a esse papel. Suponha que você queira tornar temporariamente todos os usuários de aplicativo apenas de leitura. Para fazer isso, use `REVOKE` para revogar os privilégios de modificação do papel `app_write`:

```
REVOKE INSERT, UPDATE, DELETE ON app_db.* FROM 'app_write';
```

Como acontece, isso deixa o papel sem privilégios, como pode ser visto usando `SHOW GRANTS` (que demonstra que essa declaração pode ser usada com papéis, não apenas com usuários):

```
mysql> SHOW GRANTS FOR 'app_write';
+---------------------------------------+
| Grants for app_write@%                |
+---------------------------------------+
| GRANT USAGE ON *.* TO `app_write`@`%` |
+---------------------------------------+
```

Como a revogação de privilégios de um papel afeta os privilégios de qualquer usuário que seja atribuído ao papel modificado, o `rw_user1` não tem mais privilégios de modificação de tabela (os `INSERT`, `UPDATE` e `DELETE` não estão mais presentes):

```
mysql> SHOW GRANTS FOR 'rw_user1'@'localhost'
       USING 'app_read', 'app_write';
+----------------------------------------------------------------+
| Grants for rw_user1@localhost                                  |
+----------------------------------------------------------------+
| GRANT USAGE ON *.* TO `rw_user1`@`localhost`                   |
| GRANT SELECT ON `app_db`.* TO `rw_user1`@`localhost`           |
| GRANT `app_read`@`%`,`app_write`@`%` TO `rw_user1`@`localhost` |
+----------------------------------------------------------------+
```

Na verdade, o usuário de leitura/escrita `rw_user1` tornou-se um usuário somente de leitura. Isso também ocorre para quaisquer outras contas que recebam o papel `app_write`, ilustrando como o uso de papéis torna desnecessário modificar privilégios para contas individuais.

Para restaurar os privilégios de modificação ao papel, basta concedi-los novamente:

```
GRANT INSERT, UPDATE, DELETE ON app_db.* TO 'app_write';
```

Agora, `rw_user1` novamente tem privilégios de modificação, assim como qualquer outra conta que tenha recebido o papel `app_write`.

#### Descartando papéis

Para descartar papéis, use `DROP ROLE`:

```
DROP ROLE 'app_read', 'app_write';
```

A eliminação de um papel revoga-o de todas as contas às quais foi concedido.

Os papéis nomeados na variável de sistema `mandatory_roles` não podem ser eliminados.

#### Intercambiabilidade de Usuário e Papel

Como foi sugerido anteriormente para `SHOW GRANTS` (show-grants.html "15.7.7.21 SHOW GRANTS Statement"), que exibe subsídios para contas ou papéis de usuário, as contas e papéis podem ser usados de forma intercambiável.

Uma diferença entre papéis e usuários é que `CREATE ROLE` cria um identificador de autorização que é bloqueado por padrão, enquanto `CREATE USER` cria um identificador de autorização que é desbloqueado por padrão. Você deve ter em mente que essa distinção não é imutável; um usuário com privilégios apropriados pode bloquear ou desbloquear papéis ou (outros) usuários após eles terem sido criados.

Se um administrador de banco de dados tem a preferência de que um identificador de autorização específico deve ser um papel, um esquema de nome pode ser usado para comunicar essa intenção. Por exemplo, você pode usar um prefixo `r_` para todos os identificadores de autorização que você pretende ser papéis e nada mais.

Outra diferença entre papéis e usuários está nos privilégios disponíveis para administrá-los:

* Os privilégios `CREATE ROLE` e `DROP ROLE` permitem o uso apenas das declarações `CREATE ROLE`, respetivamente, e `DROP ROLE`, respectivamente.

* O privilégio `CREATE USER` permite o uso das declarações `ALTER USER`(alter-user.html "15.7.1.1 ALTER USER Statement"), `CREATE ROLE`, `CREATE USER`, `DROP ROLE`, `DROP USER`, `RENAME USER` e [`REVOKE ALL PRIVILEGES`(revoke.html "15.7.1.8 REVOKE Statement").

Assim, os privilégios `CREATE ROLE` e `DROP ROLE` não são tão poderosos quanto os `CREATE USER`, e podem ser concedidos a usuários que só devem ser autorizados a criar e descartar papéis, e não realizar manipulação de contas mais genérica.

Em relação aos privilégios e à intercambiabilidade de usuários e papéis, você pode tratar uma conta de usuário como um papel e conceder essa conta a outro usuário ou papel. O efeito é conceder os privilégios e papéis da conta ao outro usuário ou papel.

Este conjunto de declarações demonstra que você pode conceder um usuário a um usuário, um papel a um usuário, um usuário a um papel ou um papel a outro papel:

```
CREATE USER 'u1';
CREATE ROLE 'r1';
GRANT SELECT ON db1.* TO 'u1';
GRANT SELECT ON db2.* TO 'r1';
CREATE USER 'u2';
CREATE ROLE 'r2';
GRANT 'u1', 'r1' TO 'u2';
GRANT 'u1', 'r1' TO 'r2';
```

O resultado em cada caso é conceder ao objeto receptor os privilégios associados ao objeto concedido. Após a execução dessas declarações, cada um de `u2` e `r2` recebeu privilégios de um usuário (`u1`) e um papel (`r1`):

```
mysql> SHOW GRANTS FOR 'u2' USING 'u1', 'r1';
+-------------------------------------+
| Grants for u2@%                     |
+-------------------------------------+
| GRANT USAGE ON *.* TO `u2`@`%`      |
| GRANT SELECT ON `db1`.* TO `u2`@`%` |
| GRANT SELECT ON `db2`.* TO `u2`@`%` |
| GRANT `u1`@`%`,`r1`@`%` TO `u2`@`%` |
+-------------------------------------+
mysql> SHOW GRANTS FOR 'r2' USING 'u1', 'r1';
+-------------------------------------+
| Grants for r2@%                     |
+-------------------------------------+
| GRANT USAGE ON *.* TO `r2`@`%`      |
| GRANT SELECT ON `db1`.* TO `r2`@`%` |
| GRANT SELECT ON `db2`.* TO `r2`@`%` |
| GRANT `u1`@`%`,`r1`@`%` TO `r2`@`%` |
+-------------------------------------+
```

O exemplo anterior é apenas ilustrativo, mas a intercambiabilidade de contas e papéis de usuários tem aplicação prática, como na seguinte situação: Suponha que um projeto de desenvolvimento de aplicativos legados tenha começado antes do advento dos papéis no MySQL, então todas as contas de usuário associadas ao projeto são concedidas privilégios diretamente (em vez de conceder privilégios em virtude de serem concedidos papéis). Uma dessas contas é uma conta de desenvolvedor que foi originalmente concedida privilégios da seguinte forma:

```
CREATE USER 'old_app_dev'@'localhost' IDENTIFIED BY 'old_app_devpass';
GRANT ALL ON old_app.* TO 'old_app_dev'@'localhost';
```

Se esse desenvolvedor deixar o projeto, torna-se necessário atribuir os privilégios a outro usuário, ou talvez a vários usuários, se as atividades de desenvolvimento se expandirem. Aqui estão algumas maneiras de lidar com o problema:

* Sem usar papéis: Altere a senha da conta para que o desenvolvedor original não possa usá-la, e faça com que um novo desenvolvedor use a conta:

  ```
  ALTER USER 'old_app_dev'@'localhost' IDENTIFIED BY 'new_password';
  ```

* Usando papéis: Apague a conta para impedir que alguém a use para se conectar ao servidor:

  ```
  ALTER USER 'old_app_dev'@'localhost' ACCOUNT LOCK;
  ```

Em seguida, trate a conta como um papel. Para cada desenvolvedor novo no projeto, crie uma nova conta e conceda-lhe a conta do desenvolvedor original:

  ```
  CREATE USER 'new_app_dev1'@'localhost' IDENTIFIED BY 'new_password';
  GRANT 'old_app_dev'@'localhost' TO 'new_app_dev1'@'localhost';
  ```

O efeito é atribuir os privilégios da conta do desenvolvedor original à nova conta.

### 8.2.11 Categorias de Conta

A partir do MySQL 8.0.16, o MySQL incorpora o conceito de categorias de contas de usuário, com base no privilégio `SYSTEM_USER`.

* Contas Sistema e Contas Regulares
* Operações Afetadas pelo Privilégio SYSTEM_USER
* Sessões Sistema e Sessões Regulares
* Protegendo as Contas do Sistema Contra Manipulação por Contas Regulares

#### Sistemas e Contas Regulares

O MySQL incorpora o conceito de categorias de contas de usuário, com usuários do sistema e usuários regulares distinguidos de acordo com a presença do privilégio `SYSTEM_USER`:

* Um usuário com o privilégio `SYSTEM_USER` é um usuário do sistema.

* Um usuário sem o privilégio `SYSTEM_USER` é um usuário comum.

O privilégio `SYSTEM_USER` tem efeito sobre as contas às quais um usuário dado pode aplicar seus outros privilégios, bem como se o usuário está protegido de outras contas:

* Um usuário do sistema pode modificar tanto contas do sistema quanto contas regulares. Isso significa que um usuário que possui os privilégios apropriados para realizar uma operação específica em contas regulares é habilitado pela posse de `SYSTEM_USER` para realizar a operação também em contas do sistema. Uma conta do sistema só pode ser modificada por usuários do sistema com privilégios apropriados, e não por usuários regulares.

* Um usuário regular com privilégios apropriados pode modificar contas regulares, mas não contas de sistema. Uma conta regular pode ser modificada tanto por usuários do sistema quanto por usuários regulares com privilégios apropriados.

Se um usuário tiver os privilégios apropriados para realizar uma operação específica em contas regulares, `SYSTEM_USER` permite que o usuário também realize a operação em contas do sistema. `SYSTEM_USER` não implica nenhum outro privilégio, portanto, a capacidade de realizar uma operação em uma conta específica permanece condicionada à posse de quaisquer outros privilégios necessários. Por exemplo, se um usuário pode conceder os privilégios `SELECT` e `UPDATE` a contas regulares, então com `SYSTEM_USER`, o usuário também pode conceder `SELECT` e `UPDATE` a contas do sistema.

A distinção entre contas de sistema e contas regulares permite um melhor controle sobre certos problemas de administração de contas, protegendo contas que possuem o privilégio `SYSTEM_USER` das contas que não possuem esse privilégio. Por exemplo, o privilégio `CREATE USER` permite não apenas a criação de novas contas, mas também a modificação e remoção de contas existentes. Sem o conceito de usuário de sistema, um usuário que possui o privilégio `CREATE USER` pode modificar ou excluir qualquer conta existente, incluindo a conta `root`. O conceito de usuário de sistema permite restringir as modificações à conta `root` (própria de sistema), de modo que elas só possam ser feitas por usuários do sistema. Usuários regulares com o privilégio [`CREATE USER`](privileges-provided.html#priv_create-user) ainda podem modificar ou excluir contas existentes, mas apenas contas regulares.

#### Operações afetadas pelo privilégio SYSTEM_USER

O privilégio `SYSTEM_USER` afeta essas operações:

* Manipulação de contas.

A manipulação de contas inclui a criação e a eliminação de contas, a concessão e a revogação de privilégios, a alteração das características de autenticação da conta, como as credenciais ou o plugin de autenticação, e a alteração de outras características da conta, como a política de expiração da senha.

O privilégio `SYSTEM_USER` é necessário para manipular contas do sistema usando declarações de gerenciamento de contas, como `CREATE USER` e `GRANT`. Para impedir que uma conta modifique contas do sistema dessa maneira, faça-a uma conta regular, não concedendo-lhe o privilégio `SYSTEM_USER`. (No entanto, para proteger completamente as contas do sistema contra contas regulares, você também deve reter os privilégios de modificação para o esquema de sistema `mysql` das contas regulares. Veja Protegendo contas do sistema contra manipulação por contas regulares.)

* Matar as sessões atuais e as declarações que são executadas dentro delas.

Para matar uma sessão ou uma declaração que está executando com o privilégio `SYSTEM_USER`, sua própria sessão deve ter o privilégio `SYSTEM_USER`, além de qualquer outro privilégio necessário (`CONNECTION_ADMIN` ou o privilégio descontinuado `SUPER`).

A partir do MySQL 8.0.30, se o usuário que coloca um servidor no modo offline não tiver o privilégio `SYSTEM_USER`, os usuários clientes conectados que têm o privilégio `SYSTEM_USER` também não são desconectados. No entanto, esses usuários não podem iniciar novas conexões com o servidor enquanto este estiver no modo offline, a menos que também tenham o privilégio `CONNECTION_ADMIN` ou `SUPER`. Apenas sua conexão existente não é terminada, porque o privilégio `SYSTEM_USER` é necessário para isso.

Antes do MySQL 8.0.16, o privilégio `CONNECTION_ADMIN` (ou o privilégio descontinuado `SUPER`) é suficiente para matar qualquer sessão ou declaração.

* Definindo o atributo `DEFINER` para objetos armazenados.

Para definir o atributo `DEFINER` para um objeto armazenado em uma conta que possui o privilégio `SYSTEM_USER`, você deve ter o privilégio `SYSTEM_USER`, além de qualquer outro privilégio necessário (`SET_USER_ID` ou o privilégio descontinuado `SUPER`).

Antes do MySQL 8.0.16, o privilégio `SET_USER_ID` (ou o privilégio descontinuado `SUPER`) é suficiente para especificar qualquer valor `DEFINER` para objetos armazenados.

* Especificar papéis obrigatórios.

Um papel que possui o privilégio `SYSTEM_USER` não pode ser listado no valor da variável de sistema `mandatory_roles`.

Antes do MySQL 8.0.16, qualquer papel pode ser listado em `mandatory_roles`.

* Supressão de itens de "abort" no filtro do log de auditoria do MySQL Enterprise Audit.

A partir do MySQL 8.0.28, as contas com o privilégio `SYSTEM_USER` são automaticamente atribuídas o privilégio `AUDIT_ABORT_EXEMPT`, de modo que as consultas da conta são sempre executadas, mesmo que um item de "abort" no filtro do registro de auditoria o bloqueie. As contas com o privilégio `SYSTEM_USER` podem, portanto, ser usadas para recuperar o acesso a um sistema após uma configuração incorreta de auditoria. Veja a Seção 8.4.5, "Auditoramento da Empresa MySQL".

#### Sistema e Sessões Regulares

As sessões que são executadas no servidor são distinguidas como sessões de sistema ou regulares, de forma semelhante à distinção entre usuários de sistema e usuários regulares:

* Uma sessão que possui o privilégio `SYSTEM_USER` é uma sessão do sistema.

* Uma sessão que não possui o privilégio `SYSTEM_USER` é uma sessão regular.

Uma sessão regular pode realizar apenas operações permitidas para usuários regulares. Uma sessão de sistema, adicionalmente, pode realizar operações permitidas apenas para usuários do sistema.

Os privilégios possuídos por uma sessão são aqueles concedidos diretamente à sua conta subjacente, além dos concedidos a todos os papéis atualmente ativos dentro da sessão. Assim, uma sessão pode ser uma sessão do sistema porque sua conta foi concedida o privilégio `SYSTEM_USER` diretamente, ou porque a sessão ativou um papel que tem o privilégio `SYSTEM_USER`. Os papéis concedidos a uma conta que não estão ativos dentro da sessão não afetam os privilégios da sessão.

Como a ativação e a desativação de papéis podem alterar os privilégios possuídos pelas sessões, uma sessão pode mudar de uma sessão regular para uma sessão de sistema ou vice-versa. Se uma sessão ativa ou desativa um papel que possui o privilégio `SYSTEM_USER`, a mudança apropriada entre sessões regulares e de sistema ocorre imediatamente, apenas para aquela sessão:

* Se uma sessão regular ativar um papel com o privilégio `SYSTEM_USER`, a sessão se torna uma sessão do sistema.

* Se uma sessão do sistema desativar um papel com o privilégio `SYSTEM_USER`, a sessão se torna uma sessão regular, a menos que algum outro papel com o privilégio `SYSTEM_USER` permaneça ativo.

Essas operações não afetam as sessões existentes:

* Se o privilégio `SYSTEM_USER` for concedido ou revogado em uma conta, as sessões existentes para a conta não mudarão entre as sessões regulares e as sessões do sistema. A operação de concessão ou revogação afeta apenas as sessões para conexões subsequentes pela conta.

* As declarações executadas por um objeto armazenado invocado dentro de uma sessão são executadas com o status do sistema ou regular da sessão pai, mesmo que o atributo `DEFINER` nomeie uma conta do sistema.

Como a ativação do papel afeta apenas as sessões e não as contas, conceder um papel que tenha o privilégio `SYSTEM_USER` a uma conta regular não protege essa conta contra usuários regulares. O papel protege apenas as sessões da conta na qual o papel foi ativado e protege a sessão apenas contra ser interrompida por sessões regulares.

#### Protegendo contas do sistema contra manipulação por contas regulares

A manipulação de contas inclui a criação e a eliminação de contas, a concessão e a revogação de privilégios, a alteração das características de autenticação da conta, como as credenciais ou o plugin de autenticação, e a alteração de outras características da conta, como a política de expiração da senha.

A manipulação de contas pode ser feita de duas maneiras:

* Utilizando declarações de gestão de contas, como `CREATE USER` e `GRANT`. Esse é o método preferido.

* Por modificação direta da tabela de concessão usando declarações como `INSERT` e `UPDATE`. Esse método é desencorajado, mas possível para usuários com os privilégios apropriados no esquema do sistema `mysql` que contém as tabelas de concessão.

Para proteger completamente as contas do sistema contra modificação por uma conta específica, transforme-a em uma conta regular e não conceda privilégios de modificação para o esquema `mysql`:

* O privilégio `SYSTEM_USER` é necessário para manipular contas do sistema usando declarações de gerenciamento de contas. Para impedir que uma conta modifique contas do sistema dessa maneira, transforme-a em uma conta regular, não concedendo `SYSTEM_USER` a ela. Isso inclui não conceder `SYSTEM_USER` a quaisquer papéis concedidos à conta.

* Os privilégios para o esquema `mysql` permitem a manipulação de contas do sistema através da modificação direta das tabelas de concessão, mesmo que a conta modificada seja uma conta regular. Para restringir a modificação direta não autorizada de contas do sistema por uma conta regular, não conceda privilégios de modificação para o esquema `mysql` à conta (ou quaisquer papéis concedidos à conta). Se uma conta regular precisar de privilégios globais que se apliquem a todos os esquemas, as modificações do esquema `mysql` podem ser impedidas usando restrições de privilégio impostas por meio de revogações parciais. Veja a Seção 8.2.12, “Restrição de privilégio usando revogações parciais”.

Nota

Ao contrário do privilégio de `SYSTEM_USER`, que impede que uma conta modifique contas do sistema, mas não contas regulares, a retenção de privilégios de esquema `mysql` impede que uma conta modifique contas do sistema, bem como contas regulares. Isso não deve ser um problema, pois, como mencionado, a modificação direta da tabela de concessão é desencorajada.

Suponha que você queira criar um usuário `u1` que tenha todos os privilégios em todos os esquemas, exceto que `u1` deve ser um usuário regular sem a capacidade de modificar contas do sistema. Admitindo que a variável de sistema `partial_revokes` esteja habilitada, configure `u1` da seguinte forma:

```
CREATE USER u1 IDENTIFIED BY 'password';

GRANT ALL ON *.* TO u1 WITH GRANT OPTION;
-- GRANT ALL includes SYSTEM_USER, so at this point
-- u1 can manipulate system or regular accounts

REVOKE SYSTEM_USER ON *.* FROM u1;
-- Revoking SYSTEM_USER makes u1 a regular user;
-- now u1 can use account-management statements
-- to manipulate only regular accounts

REVOKE ALL ON mysql.* FROM u1;
-- This partial revoke prevents u1 from directly
-- modifying grant tables to manipulate accounts
```

Para impedir que uma conta acesse todo o esquema do sistema `mysql`, requeira todos os seus privilégios no esquema `mysql`, conforme mostrado acima. Também é possível permitir acesso parcial ao esquema `mysql`, como acesso apenas de leitura. O exemplo a seguir cria uma conta que tem `SELECT`, `INSERT`, `UPDATE` e `DELETE` privilégios globalmente para todos os esquemas, mas apenas `SELECT` para o esquema `mysql`:

```
CREATE USER u2 IDENTIFIED BY 'password';
GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO u2;
REVOKE INSERT, UPDATE, DELETE ON mysql.* FROM u2;
```

Outra possibilidade é revogar todos os privilégios do esquema `mysql`, mas conceder acesso a tabelas ou colunas específicas do `mysql`. Isso pode ser feito mesmo com uma revogação parcial do `mysql`. As seguintes declarações permitem acesso somente de leitura ao `u1` dentro do esquema `mysql`, mas apenas para a tabela `db` e as colunas `Host` e `User` da tabela `user`:

```
CREATE USER u3 IDENTIFIED BY 'password';
GRANT ALL ON *.* TO u3;
REVOKE ALL ON mysql.* FROM u3;
GRANT SELECT ON mysql.db TO u3;
GRANT SELECT(Host,User) ON mysql.user TO u3;
```

### 8.2.12 Restrição de privilégio usando revogações parciais

Antes do MySQL 8.0.16, não é possível conceder privilégios que se apliquem globalmente, exceto para certos esquemas. A partir do MySQL 8.0.16, isso é possível se a variável de sistema `partial_revokes` estiver habilitada. Especificamente, para usuários que têm privilégios no nível global, `partial_revokes` habilita privilégios para esquemas específicos serem revogados, mantendo os privilégios em vigor para outros esquemas. As restrições de privilégio assim impostas podem ser úteis para a administração de contas que têm privilégios globais, mas não devem ser permitidas para acessar certos esquemas. Por exemplo, é possível permitir que uma conta modifique qualquer tabela, exceto as do esquema de sistema `mysql`.

* Uso de Reversões Parciais
* Reversões Parciais em Relação a Concessões de Esquema Explicitas
* Desativação de Reversões Parciais
* Reversões Parciais e Replicação

Nota

Por simplicidade, as declarações `CREATE USER` mostradas aqui não incluem senhas. Para uso produtivo, sempre atribua senhas de conta.

#### Uso de Reivindicações Parciais

A variável de sistema `partial_revokes` controla se as restrições de privilégio podem ser aplicadas em contas. Por padrão, `partial_revokes` está desativado e as tentativas de revogar parcialmente os privilégios globais produzem um erro:

```
mysql> CREATE USER u1;
mysql> GRANT SELECT, INSERT ON *.* TO u1;
mysql> REVOKE INSERT ON world.* FROM u1;
ERROR 1141 (42000): There is no such grant defined for user 'u1' on host '%'
```

Para permitir a operação `REVOKE`, habilite `partial_revokes`:

```
SET PERSIST partial_revokes = ON;
```

`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") define um valor para a instância MySQL em execução. Também salva o valor, fazendo com que ele seja carregado em reinicializações subsequentes do servidor. Para alterar o valor da instância MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`. Veja a Seção 15.7.6.1, “Sintaxe SET para atribuição de variáveis”.

Com `partial_revokes` habilitado, a revogação parcial é bem-sucedida:

```
mysql> REVOKE INSERT ON world.* FROM u1;
mysql> SHOW GRANTS FOR u1;
+------------------------------------------+
| Grants for u1@%                          |
+------------------------------------------+
| GRANT SELECT, INSERT ON *.* TO `u1`@`%`  |
| REVOKE INSERT ON `world`.* FROM `u1`@`%` |
+------------------------------------------+
```

`SHOW GRANTS` lista as declarações de revogação parcial como `REVOKE` em sua saída. O resultado indica que `u1` tem privilégios globais de `SELECT` e `INSERT`, exceto que `INSERT` não pode ser exercido para tabelas no esquema `world`. Isso significa que o acesso por `u1` às tabelas de `world` é apenas de leitura.

O servidor registra as restrições de privilégio implementadas por meio de revogações parciais na tabela do sistema `mysql.user`. Se uma conta tiver revogações parciais, seu valor na coluna `User_attributes` possui um atributo `Restrictions`:

```
mysql> SELECT User, Host, User_attributes->>'$.Restrictions'
       FROM mysql.user WHERE User_attributes->>'$.Restrictions' <> '';
+------+------+------------------------------------------------------+
| User | Host | User_attributes->>'$.Restrictions'                   |
+------+------+------------------------------------------------------+
| u1   | %    | [{"Database": "world", "Privileges": ["INSERT"]}] |
+------+------+------------------------------------------------------+
```

Nota

Embora revogações parciais possam ser impostas para qualquer esquema, as restrições de privilégio no esquema do sistema `mysql` são especialmente úteis como parte de uma estratégia para impedir que contas regulares modifiquem contas do sistema. Veja Protegendo contas do sistema contra manipulação por contas regulares.

As operações de revogação parcial estão sujeitas a essas condições:

* É possível usar revogações parciais para colocar restrições em esquemas inexistentes, mas apenas se o privilégio revogado for concedido globalmente. Se um privilégio não for concedido globalmente, revogá-lo para um esquema inexistente produz um erro.

* As revogações parciais aplicam-se apenas ao nível do esquema. Não é possível usar revogações parciais para privilégios que se aplicam apenas globalmente (como `FILE` ou `BINLOG_ADMIN`), ou para privilégios de tabela, coluna ou rotina.

* Nas atribuições de privilégios, habilitar `partial_revokes` faz com que o MySQL interprete as ocorrências de caracteres curinga `_` e `%` não escapados do SQL em nomes de esquemas como caracteres literais, assim como se tivessem sido escapados como `_` e `\%`. Como isso altera a forma como o MySQL interpreta os privilégios, pode ser aconselhável evitar caracteres curinga não escapados nas atribuições de privilégios para instalações onde `partial_revokes` pode estar habilitado.

Como mencionado anteriormente, as reações parciais de privilégios de nível de esquema aparecem no `SHOW GRANTS` como declarações `REVOKE`. Isso difere da forma como o `SHOW GRANTS` representa os privilégios de nível de esquema “simples”:

* Quando concedidos, os privilégios de nível de esquema são representados por suas próprias declarações `GRANT` no resultado:

  ```
  mysql> CREATE USER u1;
  mysql> GRANT UPDATE ON mysql.* TO u1;
  mysql> GRANT DELETE ON world.* TO u1;
  mysql> SHOW GRANTS FOR u1;
  +---------------------------------------+
  | Grants for u1@%                       |
  +---------------------------------------+
  | GRANT USAGE ON *.* TO `u1`@`%`        |
  | GRANT UPDATE ON `mysql`.* TO `u1`@`%` |
  | GRANT DELETE ON `world`.* TO `u1`@`%` |
  +---------------------------------------+
  ```

* Quando revogados, os privilégios de nível de esquema simplesmente desaparecem da saída. Eles não aparecem como declarações `REVOKE`:

  ```
  mysql> REVOKE UPDATE ON mysql.* FROM u1;
  mysql> REVOKE DELETE ON world.* FROM u1;
  mysql> SHOW GRANTS FOR u1;
  +--------------------------------+
  | Grants for u1@%                |
  +--------------------------------+
  | GRANT USAGE ON *.* TO `u1`@`%` |
  +--------------------------------+
  ```

Quando um usuário concede um privilégio, qualquer restrição que o concedente tenha sobre o privilégio é herdada pelo beneficiário, a menos que o beneficiário já tenha o privilégio sem a restrição. Considere os seguintes dois usuários, um dos quais tem o privilégio global `SELECT`:

```
CREATE USER u1, u2;
GRANT SELECT ON *.* TO u2;
```

Suponha que um usuário administrativo `admin` tenha um privilégio global, mas parcialmente revogado `SELECT`:

```
mysql> CREATE USER admin;
mysql> GRANT SELECT ON *.* TO admin WITH GRANT OPTION;
mysql> REVOKE SELECT ON mysql.* FROM admin;
mysql> SHOW GRANTS FOR admin;
+------------------------------------------------------+
| Grants for admin@%                                   |
+------------------------------------------------------+
| GRANT SELECT ON *.* TO `admin`@`%` WITH GRANT OPTION |
| REVOKE SELECT ON `mysql`.* FROM `admin`@`%`          |
+------------------------------------------------------+
```

Se o `admin` conceder globalmente o `SELECT` ao `u1` e ao `u2`, o resultado difere para cada usuário:

* Se `admin` concede `SELECT` globalmente a `u1`, que não possui privilégio `SELECT` para começar, `u1` herda a restrição de privilégio `admin`:

  ```
  mysql> GRANT SELECT ON *.* TO u1;
  mysql> SHOW GRANTS FOR u1;
  +------------------------------------------+
  | Grants for u1@%                          |
  +------------------------------------------+
  | GRANT SELECT ON *.* TO `u1`@`%`          |
  | REVOKE SELECT ON `mysql`.* FROM `u1`@`%` |
  +------------------------------------------+
  ```

* Por outro lado, `u2` já possui um privilégio global `SELECT` sem restrições. `GRANT` só pode adicionar aos privilégios existentes de um beneficiário, não reduzindo-os, portanto, se `admin` concede `SELECT` globalmente a `u2`, `u2` não herda a restrição `admin`:

  ```
  mysql> GRANT SELECT ON *.* TO u2;
  mysql> SHOW GRANTS FOR u2;
  +---------------------------------+
  | Grants for u2@%                 |
  +---------------------------------+
  | GRANT SELECT ON *.* TO `u2`@`%` |
  +---------------------------------+
  ```

Se uma declaração `GRANT` incluir uma cláusula `AS user`, as restrições de privilégio aplicadas são as da combinação de usuário/papel especificada pela cláusula, e não as do usuário que executa a declaração. Para informações sobre a cláusula `AS`, consulte a Seção 15.7.1.6, “Declaração GRANT”.

As restrições sobre novos privilégios concedidos a uma conta são adicionadas a quaisquer restrições existentes para essa conta:

```
mysql> CREATE USER u1;
mysql> GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO u1;
mysql> REVOKE INSERT ON mysql.* FROM u1;
mysql> SHOW GRANTS FOR u1;
+---------------------------------------------------------+
| Grants for u1@%                                         |
+---------------------------------------------------------+
| GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO `u1`@`%` |
| REVOKE INSERT ON `mysql`.* FROM `u1`@`%`                |
+---------------------------------------------------------+
mysql> REVOKE DELETE, UPDATE ON db2.* FROM u1;
mysql> SHOW GRANTS FOR u1;
+---------------------------------------------------------+
| Grants for u1@%                                         |
+---------------------------------------------------------+
| GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO `u1`@`%` |
| REVOKE UPDATE, DELETE ON `db2`.* FROM `u1`@`%`          |
| REVOKE INSERT ON `mysql`.* FROM `u1`@`%`                |
+---------------------------------------------------------+
```

A agregação das restrições de privilégio se aplica tanto quando os privilégios são revogados parcialmente explicitamente (como demonstrado acima) quanto quando as restrições são herdadas implicitamente do usuário que executa a declaração ou do usuário mencionado em uma cláusula `AS user`.

Se uma conta tiver uma restrição de privilégio em um esquema:

* A conta não pode conceder a outras contas privilégios no esquema restrito ou em qualquer objeto dentro dele.

* Outra conta que não tenha a restrição pode conceder privilégios à conta restrita para o esquema ou objetos restritos dentro dela. Suponha que um usuário não restrito execute essas declarações:

  ```
  CREATE USER u1;
  GRANT SELECT, INSERT, UPDATE ON *.* TO u1;
  REVOKE SELECT, INSERT, UPDATE ON mysql.* FROM u1;
  GRANT SELECT ON mysql.user TO u1;          -- grant table privilege
  GRANT SELECT(Host,User) ON mysql.db TO u1; -- grant column privileges
  ```

A conta resultante tem esses privilégios, com a capacidade de realizar operações limitadas dentro do esquema restrito:

  ```
  mysql> SHOW GRANTS FOR u1;
  +-----------------------------------------------------------+
  | Grants for u1@%                                           |
  +-----------------------------------------------------------+
  | GRANT SELECT, INSERT, UPDATE ON *.* TO `u1`@`%`           |
  | REVOKE SELECT, INSERT, UPDATE ON `mysql`.* FROM `u1`@`%`  |
  | GRANT SELECT (`Host`, `User`) ON `mysql`.`db` TO `u1`@`%` |
  | GRANT SELECT ON `mysql`.`user` TO `u1`@`%`                |
  +-----------------------------------------------------------+
  ```

Se uma conta tiver uma restrição em um privilégio global, a restrição é removida por qualquer uma dessas ações:

* Conceder o privilégio global à conta de uma conta que não tenha restrições sobre o privilégio.

* Conceder o privilégio ao nível do esquema. * Retirar o privilégio globalmente.

Considere um usuário `u1` que possui vários privilégios globalmente, mas com restrições em `INSERT`, `UPDATE` e `DELETE`:

```
mysql> CREATE USER u1;
mysql> GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO u1;
mysql> REVOKE INSERT, UPDATE, DELETE ON mysql.* FROM u1;
mysql> SHOW GRANTS FOR u1;
+----------------------------------------------------------+
| Grants for u1@%                                          |
+----------------------------------------------------------+
| GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO `u1`@`%`  |
| REVOKE INSERT, UPDATE, DELETE ON `mysql`.* FROM `u1`@`%` |
+----------------------------------------------------------+
```

Conceder um privilégio globalmente para `u1` de uma conta sem restrições remove a restrição de privilégio. Por exemplo, para remover a restrição `INSERT`:

```
mysql> GRANT INSERT ON *.* TO u1;
mysql> SHOW GRANTS FOR u1;
+---------------------------------------------------------+
| Grants for u1@%                                         |
+---------------------------------------------------------+
| GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO `u1`@`%` |
| REVOKE UPDATE, DELETE ON `mysql`.* FROM `u1`@`%`        |
+---------------------------------------------------------+
```

Ao conceder um privilégio ao nível do esquema para `u1`, a restrição de privilégio é removida. Por exemplo, para remover a restrição de `UPDATE`:

```
mysql> GRANT UPDATE ON mysql.* TO u1;
mysql> SHOW GRANTS FOR u1;
+---------------------------------------------------------+
| Grants for u1@%                                         |
+---------------------------------------------------------+
| GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO `u1`@`%` |
| REVOKE DELETE ON `mysql`.* FROM `u1`@`%`                |
+---------------------------------------------------------+
```

Retirar um privilégio global remove o privilégio, incluindo quaisquer restrições nele. Por exemplo, para remover a restrição `DELETE` (a um custo de remoção de todo o acesso `DELETE`):

```
mysql> REVOKE DELETE ON *.* FROM u1;
mysql> SHOW GRANTS FOR u1;
+-------------------------------------------------+
| Grants for u1@%                                 |
+-------------------------------------------------+
| GRANT SELECT, INSERT, UPDATE ON *.* TO `u1`@`%` |
+-------------------------------------------------+
```

Se uma conta tiver privilégios tanto no nível global quanto no nível do esquema, você deve revogá-los no nível do esquema duas vezes para efetuar uma revogação parcial. Suponha que `u1` tenha esses privilégios, onde `INSERT` é mantido tanto globalmente quanto no esquema do `world`:

```
mysql> CREATE USER u1;
mysql> GRANT SELECT, INSERT ON *.* TO u1;
mysql> GRANT INSERT ON world.* TO u1;
mysql> SHOW GRANTS FOR u1;
+-----------------------------------------+
| Grants for u1@%                         |
+-----------------------------------------+
| GRANT SELECT, INSERT ON *.* TO `u1`@`%` |
| GRANT INSERT ON `world`.* TO `u1`@`%`   |
+-----------------------------------------+
```

Revocar `INSERT` em `world` revoga o privilégio de nível de esquema (`SHOW GRANTS` não exibe mais a declaração de nível de esquema `GRANT`):

```
mysql> REVOKE INSERT ON world.* FROM u1;
mysql> SHOW GRANTS FOR u1;
+-----------------------------------------+
| Grants for u1@%                         |
+-----------------------------------------+
| GRANT SELECT, INSERT ON *.* TO `u1`@`%` |
+-----------------------------------------+
```

Revocar `INSERT` em `world` novamente realiza uma revogação parcial do privilégio global (`SHOW GRANTS` agora inclui uma declaração de nível de esquema `REVOKE`):

```
mysql> REVOKE INSERT ON world.* FROM u1;
mysql> SHOW GRANTS FOR u1;
+------------------------------------------+
| Grants for u1@%                          |
+------------------------------------------+
| GRANT SELECT, INSERT ON *.* TO `u1`@`%`  |
| REVOKE INSERT ON `world`.* FROM `u1`@`%` |
+------------------------------------------+
```

#### Revocação Parcial Contra Opções Explicitas de Esquema

Para fornecer acesso a contas para alguns esquemas, mas não para outros, as revocações parciais oferecem uma alternativa à abordagem de conceder explicitamente acesso ao nível do esquema sem conceder privilégios globais. As duas abordagens têm vantagens e desvantagens diferentes.

Atribuição de privilégios de nível de esquema e não de privilégios globais:

* Adicionando um novo esquema: O esquema é inacessível para contas existentes por padrão. Para qualquer conta para a qual o esquema deve ser acessível, o DBA deve conceder acesso ao nível do esquema.

* Adicionando uma nova conta: O DBA deve conceder acesso ao nível do esquema para cada esquema para o qual a conta deve ter acesso.

Conceder privilégios globais em conjunto com revogações parciais:

* Adicionando um novo esquema: O esquema é acessível a contas existentes que possuem privilégios globais. Para qualquer conta que deve ser inacessível ao esquema, o DBA deve adicionar uma revogação parcial.

* Adicionando uma nova conta: O DBA deve conceder os privilégios globais, além de uma revogação parcial em cada esquema restrito.

A abordagem que utiliza concessão explícita em nível de esquema é mais conveniente para contas para as quais o acesso é limitado a poucos esquemas. A abordagem que utiliza revogações parciais é mais conveniente para contas com acesso amplo a todos os esquemas, exceto alguns.

#### Desativação de Reversões Parciais

Uma vez habilitado, `partial_revokes` não pode ser desativado se qualquer conta tiver restrições de privilégio. Se tal conta existir, a desativação de `partial_revokes` falha:

* Para tentativas de desabilitar `partial_revokes` no início, o servidor registra uma mensagem de erro e habilita `partial_revokes`.

* Para tentativas de desabilitar `partial_revokes` em tempo de execução, ocorre um erro e o valor de `partial_revokes` permanece inalterado.

Para desabilitar `partial_revokes` quando existem restrições, as restrições devem ser removidas primeiro:

1. Determine quais contas têm revogações parciais:

   ```
   SELECT User, Host, User_attributes->>'$.Restrictions'
   FROM mysql.user WHERE User_attributes->>'$.Restrictions' <> '';
   ```

2. Para cada conta desse tipo, remova suas restrições de privilégio. Suponha que a etapa anterior mostre que a conta `u1` tem essas restrições:

   ```
   [{"Database": "world", "Privileges": ["INSERT", "DELETE"]
   ```

A remoção da restrição pode ser feita de várias maneiras:

* Conceder privilégios globalmente, sem restrições:

     ```
     GRANT INSERT, DELETE ON *.* TO u1;
     ```

* Conceder privilégios ao nível do esquema:

     ```
     GRANT INSERT, DELETE ON world.* TO u1;
     ```

* Revogar os privilégios globalmente (assumindo que eles não são mais necessários):

     ```
     REVOKE INSERT, DELETE ON *.* FROM u1;
     ```

* Remova a conta em si (assumindo que ela não é mais necessária):

     ```
     DROP USER u1;
     ```

Após todas as restrições de privilégio serem removidas, é possível desativar as revocações parciais:

```
SET PERSIST partial_revokes = OFF;
```

#### Revocação Parcial e Replicação

Em cenários de replicação, se `partial_revokes` estiver habilitado em qualquer host, ele deve estar habilitado em todos os hosts. Caso contrário, as declarações `REVOKE` para revogar parcialmente um privilégio global não terão o mesmo efeito em todos os hosts em que a replicação ocorre, resultando potencialmente em inconsistências ou erros de replicação.

Quando o `partial_revokes` está habilitado, uma sintaxe estendida é registrada no log binário para as declarações do `GRANT`, incluindo o usuário atual que emitiu a declaração e seus papéis atualmente ativos. Se um usuário ou um papel registrado dessa maneira não existir na réplica, o fio do aplicador de replicação para de acordo com a declaração do `GRANT` com um erro. Certifique-se de que todas as contas de usuário que emitem ou podem emitir declarações do `GRANT` no servidor de origem da replicação também existam na réplica e tenham o mesmo conjunto de papéis que possuem na fonte.

### 8.2.13 Quando as Alterações de Privilegio Se Tornam Efetivas

Se o servidor **mysqld** for iniciado sem a opção `--skip-grant-tables`, ele lê todo o conteúdo da tabela de concessão na memória durante sua sequência de inicialização. As tabelas de memória tornam-se eficazes para o controle de acesso nesse ponto.

Se você modificar as tabelas de concessão indiretamente usando uma declaração de gerenciamento de conta, o servidor percebe essas mudanças e carrega as tabelas de concessão na memória novamente imediatamente. As declarações de gerenciamento de conta são descritas na Seção 15.7.1, “Declarações de Gerenciamento de Conta”. Exemplos incluem `GRANT`, `REVOKE`, [`SET PASSWORD`](set-password.html "15.7.1.10 SET PASSWORD Statement") e [`RENAME USER`(rename-user.html "15.7.1.7 RENAME USER Statement")].

Se você modificar as tabelas de concessão diretamente usando declarações como `INSERT`, `UPDATE` ou `DELETE` (o que não é recomendado), as alterações não terão efeito na verificação de privilégios até que você informe ao servidor para recarregar as tabelas ou reiniciá-lo. Assim, se você alterar as tabelas de concessão diretamente, mas esquecer de recarregá-las, as alterações *não terão efeito* até que você reinicie o servidor. Isso pode deixá-lo se perguntando por que suas alterações parecem não fazer diferença!

Para dizer ao servidor que recarregue as tabelas de concessão, realize uma operação de flush-privileges. Isso pode ser feito emitindo uma declaração `FLUSH PRIVILEGES` ou executando um comando **mysqladmin flush-privileges** ou **mysqladmin reload**.

Um recarregamento da tabela de subsídios afeta os privilégios de cada sessão de cliente existente da seguinte forma:

As alterações de privilégios de tabela e coluna entram em vigor na próxima solicitação do cliente.

As alterações dos privilégios do banco de dados entram em vigor na próxima vez que o cliente executar uma declaração `USE db_name`.

Nota

As aplicações cliente podem armazenar o nome do banco de dados; portanto, esse efeito pode não ser visível para elas sem realmente mudar para um banco de dados diferente.

* Os privilégios e senhas globais estáticos não são afetados para um cliente conectado. Essas alterações só entram em vigor em sessões para conexões subsequentes. As alterações aos privilégios globais dinâmicos são aplicadas imediatamente. Para informações sobre as diferenças entre privilégios estáticos e dinâmicos, consulte Privilegios estáticos versus dinâmicos.)

As alterações no conjunto de papéis ativos dentro de uma sessão têm efeito imediatamente, apenas para essa sessão. A declaração `SET ROLE`(set-role.html "15.7.1.11 SET ROLE Statement") realiza a ativação e desativação de papéis de sessão (consulte Seção 15.7.1.11, “Declaração SET ROLE”).

Se o servidor for iniciado com a opção `--skip-grant-tables`, ele não lê as tabelas de concessão ou implementa qualquer controle de acesso. Qualquer usuário pode se conectar e realizar qualquer operação, *o que é inseguro.* Para fazer com que um servidor assim iniciado leia as tabelas e habilite a verificação de acesso, limpe os privilégios.

### 8.2.14 Atribuição de Senhas de Conta

As credenciais necessárias para os clientes que se conectam ao servidor MySQL podem incluir uma senha. Esta seção descreve como atribuir senhas para contas MySQL.

MySQL armazena as credenciais na tabela `user` no banco de dados do sistema `mysql`. As operações que atribuem ou modificam senhas são permitidas apenas para usuários com o privilégio `CREATE USER`, ou, como alternativa, privilégios para o banco de dados `mysql` (prívilégio `INSERT` para criar novas contas, `UPDATE` privilégio para modificar contas existentes). Se a variável do sistema `read_only` estiver habilitada, o uso de declarações de modificação de contas, como `CREATE USER` ou `ALTER USER`, requer adicionalmente o privilégio `CONNECTION_ADMIN` (ou o privilégio descontinuado `SUPER`).

A discussão aqui resume a sintaxe apenas para as declarações de atribuição de senha mais comuns. Para detalhes completos sobre outras possibilidades, consulte a Seção 15.7.1.3, “Declaração CREATE USER”, a Seção 15.7.1.1, “Declaração ALTER USER” e a Seção 15.7.1.10, “Declaração SET PASSWORD”.

O MySQL utiliza plugins para realizar autenticação de clientes; veja a Seção 8.2.17, “Autenticação Conectada”. Nas declarações de atribuição de senha, o plugin de autenticação associado a uma conta realiza qualquer hashing exigido de uma senha em texto claro especificada. Isso permite que o MySQL ofusque as senhas antes de armazená-las na tabela do sistema `mysql.user`. Para as declarações descritas aqui, o MySQL automaticamente realiza o hashing da senha especificada. Há também sintaxe para `CREATE USER`(create-user.html "15.7.1.3 CREATE USER Statement") e `ALTER USER` que permite que valores hashed sejam especificados literalmente. Para detalhes, consulte as descrições dessas declarações.

Para atribuir uma senha ao criar uma nova conta, use `CREATE USER` e inclua uma cláusula `IDENTIFIED BY`:

```
CREATE USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
```

`CREATE USER` também suporta sintaxe para especificar o plugin de autenticação da conta. Veja a Seção 15.7.1.3, “Instrução CREATE USER”.

Para atribuir ou alterar uma senha para uma conta existente, use a declaração `ALTER USER` com uma cláusula `IDENTIFIED BY`:

```
ALTER USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
```

Se você não estiver conectado como um usuário anônimo, pode alterar sua própria senha sem nomear sua própria conta literalmente:

```
ALTER USER USER() IDENTIFIED BY 'password';
```

Para alterar uma senha de conta a partir da linha de comando, use o comando **mysqladmin**:

```
mysqladmin -u user_name -h host_name password "password"
```

A conta para a qual este comando define a senha é aquela com uma linha na tabela do sistema `mysql.user` que corresponde a *`user_name`* na coluna `User` e o host do cliente *do qual você se conecta* na coluna `Host`.

Aviso

Definir uma senha usando **mysqladmin** deve ser considerado *inseguro*. Em alguns sistemas, sua senha se torna visível para programas de status do sistema, como o **ps**, que podem ser invocados por outros usuários para exibir linhas de comando. Os clientes MySQL geralmente sobrescrevem o argumento da senha de linha de comando durante sua sequência de inicialização. No entanto, ainda há um breve intervalo durante o qual o valor é visível. Além disso, em alguns sistemas, essa estratégia de sobrescrita é ineficaz e a senha permanece visível para o **ps**. (Sistemas Unix SystemV e talvez outros estão sujeitos a esse problema.)

Se você estiver usando a Replicação MySQL, esteja ciente de que, atualmente, uma senha usada por uma réplica como parte de uma declaração `CHANGE REPLICATION SOURCE TO` (do MySQL 8.0.23) ou uma declaração `CHANGE MASTER TO`(change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes do MySQL 8.0.23) é efetivamente limitada a 32 caracteres de comprimento; se a senha for mais longa, quaisquer caracteres excedentes serão truncados. Isso não é devido a qualquer limite imposto pelo MySQL Server de forma geral, mas sim é um problema específico da Replicação MySQL.

### 8.2.15 Gerenciamento de Senhas

O MySQL suporta essas capacidades de gerenciamento de senhas:

* Expansão da senha, para exigir que as senhas sejam alteradas periodicamente.

* Restrições de reutilização de senha, para evitar que senhas antigas sejam escolhidas novamente.

* Verificação da senha, para exigir que as alterações de senha também especifiquem a senha atual a ser substituída.

* Senhas duplas, para permitir que os clientes se conectem usando uma senha primária ou secundária.

* Avaliação da força da senha, para exigir senhas fortes. * Geração aleatória de senhas, como alternativa à exigência de senhas literais especificadas explicitamente pelo administrador.

* Rastreamento de falhas de senha, para permitir o bloqueio temporário da conta após muitas falhas consecutivas de login com senha incorreta.

As seções a seguir descrevem essas capacidades, exceto a avaliação da força da senha, que é implementada usando o componente `validate_password` e é descrita na Seção 8.4.3, “O Componente de Validação de Senha”.

* Armazenamento de credenciais internas versus externas
* Política de expiração de senha
* Política de reutilização de senha
* Política de verificação de senha
* Suporte a senha dupla
* Geração aleatória de senha
* Rastreamento de falha de login e bloqueio temporário da conta

Importante

O MySQL implementa capacidades de gerenciamento de senhas usando tabelas no banco de dados do sistema `mysql`. Se você atualizar o MySQL a partir de uma versão anterior, suas tabelas do sistema podem não estar atualizadas. Nesse caso, o servidor escreve mensagens semelhantes a essas no log de erro durante o processo de inicialização (os números exatos podem variar):

```
[ERROR] Column count of mysql.user is wrong. Expected
49, found 47. The table is probably corrupted
[Warning] ACL table mysql.password_history missing.
Some operations may fail.
```

Para corrigir o problema, realize o procedimento de atualização do MySQL. Veja o Capítulo 3, *Atualizando o MySQL*. Até que isso seja feito, as alterações de senha não são possíveis.

#### Armazenamento de Credenciais Internas versus Externas

Alguns plugins de autenticação armazenam as credenciais da conta internamente no MySQL, na tabela do sistema `mysql.user`:

* `caching_sha2_password`
* `mysql_native_password` (desatualizado)
* `sha256_password` (desatualizado)

A maioria das discussões nesta seção se aplica a esses plugins de autenticação, pois a maioria das capacidades de gerenciamento de senhas descritas aqui é baseada no armazenamento de credenciais internas gerenciado pelo próprio MySQL. Outros plugins de autenticação armazenam as credenciais da conta externamente ao MySQL. Para contas que usam plugins que realizam autenticação contra um sistema de credenciais externo, o gerenciamento de senhas deve ser realizado externamente contra esse sistema também.

A exceção é que as opções de rastreamento de falha no login e bloqueio temporário de contas se aplicam a todas as contas, não apenas às contas que utilizam armazenamento de credenciais internas, porque o MySQL é capaz de avaliar o status das tentativas de login para qualquer conta, independentemente de ela utilizar armazenamento de credenciais interno ou externo.

Para informações sobre plugins de autenticação individual, consulte a Seção 8.4.1, “Plugins de Autenticação”.

#### Política de Expansão de Senha

O MySQL permite que os administradores de banco de dados expirem senhas de conta manualmente e estabeleçam uma política para a expiração automática das senhas. A política de expiração pode ser estabelecida globalmente, e as contas individuais podem ser configuradas para deferir à política global ou para substituir a política global com comportamento específico por conta.

Para expirar uma senha de conta manualmente, use a declaração `ALTER USER`:

```
ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE;
```

Esta operação marca a senha expirada na linha correspondente na tabela do sistema `mysql.user`.

A expiração da senha de acordo com a política é automática e é baseada na idade da senha, que para uma conta específica é avaliada a partir da data e hora da sua última alteração de senha. A tabela do sistema `mysql.user` indica para cada conta quando sua senha foi alterada pela última vez, e o servidor trata automaticamente a senha como expirada no momento da conexão do cliente se sua idade for maior que sua vida útil permitida. Isso funciona sem expiração explícita manual de senha.

Para estabelecer uma política automática de expiração de senha globalmente, use a variável de sistema `default_password_lifetime`. Seu valor padrão é 0, que desativa a expiração automática da senha. Se o valor de `default_password_lifetime` for um número inteiro positivo *`N`*, indica o tempo de vida permitido da senha, de modo que as senhas devem ser alteradas a cada *`N`* dias.

Exemplos:

* Para estabelecer uma política global de que as senhas tenham uma vida útil de aproximadamente seis meses, comece o servidor com essas linhas em um arquivo do servidor `my.cnf`:

  ```
  [mysqld]
  default_password_lifetime=180
  ```

* Para estabelecer uma política global de forma que as senhas nunca expirem, defina `default_password_lifetime` como 0:

  ```
  [mysqld]
  default_password_lifetime=0
  ```

* `default_password_lifetime` também pode ser definido e persistido no momento da execução:

  ```
  SET PERSIST default_password_lifetime = 180;
  SET PERSIST default_password_lifetime = 0;
  ```

`SET PERSIST` define um valor para a instância MySQL em execução. Também salva o valor para ser carregado em reinicializações subsequentes do servidor; consulte a Seção 15.7.6.1, "Sintaxe SET para atribuição de variáveis". Para alterar o valor da instância MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`.

A política global de expiração de senhas se aplica a todas as contas que não tenham sido configuradas para ignorá-la. Para estabelecer uma política para contas individuais, use a opção `PASSWORD EXPIRE` das declarações `CREATE USER` e `ALTER USER`. Veja a Seção 15.7.1.3, “Declaração CREATE USER”, e a Seção 15.7.1.1, “Declaração ALTER USER”.

Exemplos de declarações específicas para contas:

* Exigir que a senha seja alterada a cada 90 dias:

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 90 DAY;
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 90 DAY;
  ```

Esta opção de expiração substitui a política global para todas as contas nomeadas pelo extrato.

* Desativar a expiração da senha:

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
  ```

Esta opção de expiração substitui a política global para todas as contas nomeadas pelo extrato.

* Atrasar a política de expiração global para todas as contas nomeadas na declaração:

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
  ```

Quando um cliente se conecta com sucesso, o servidor determina se a senha da conta expirou:

* O servidor verifica se a senha foi expirada manualmente.

* Caso contrário, o servidor verifica se a idade da senha é maior que sua vida útil permitida de acordo com a política automática de expiração de senha. Se assim for, o servidor considera que a senha expirou.

Se a senha expirar (seja manualmente ou automaticamente), o servidor desconecta o cliente ou restringe as operações permitidas a ele (consulte Seção 8.2.16, “Tratamento do servidor de senhas expiradas”). As operações realizadas por um cliente restrito resultam em um erro até que o usuário estabeleça uma nova senha da conta:

```
mysql> SELECT 1;
ERROR 1820 (HY000): You must reset your password using ALTER USER
statement before executing this statement.

mysql> ALTER USER USER() IDENTIFIED BY 'password';
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT 1;
+---+
| 1 |
+---+
| 1 |
+---+
1 row in set (0.00 sec)
```

Após o cliente redefinir a senha, o servidor restaura o acesso normal para a sessão, bem como para as conexões subsequentes que utilizam a conta. Também é possível que um usuário administrativo redefina a senha da conta, mas quaisquer sessões restritas existentes para essa conta permanecem restritas. Um cliente que utiliza a conta deve se desconectar e se reconectar antes que as declarações possam ser executadas com sucesso.

Nota

Embora seja possível "redefinir" uma senha expirada, definindo-a para seu valor atual, é preferível, por questão de boa política, escolher uma senha diferente. Os administradores de banco de dados podem impor a não reutilização estabelecendo uma política apropriada de reutilização de senha. Veja a Política de Reutilização de Senha.

#### Política de Reutilização de Senha

O MySQL permite que restrições sejam colocadas na reutilização de senhas anteriores. As restrições de reutilização podem ser estabelecidas com base no número de alterações de senha, no tempo decorrido ou em ambos. A política de reutilização pode ser estabelecida globalmente, e as contas individuais podem ser configuradas para deferir à política global ou para ignorar a política global com comportamento específico por conta.

O histórico de senhas de uma conta consiste nas senhas que lhe foram atribuídas no passado. O MySQL pode restringir a escolha de novas senhas a partir desse histórico:

* Se uma conta for restringida com base no número de alterações de senha, uma nova senha não pode ser escolhida a partir de um número especificado das senhas mais recentes. Por exemplo, se o número mínimo de alterações de senha for definido em 3, uma nova senha não pode ser a mesma de nenhuma das 3 senhas mais recentes.

* Se uma conta for restringida com base no tempo que passou, uma nova senha não pode ser escolhida a partir de senhas do histórico que são mais recentes que um número especificado de dias. Por exemplo, se o intervalo de reutilização de senha for definido em 60, uma nova senha não pode estar entre as escolhidas anteriormente nos últimos 60 dias.

Nota

A senha vazia não é contabilizada no histórico de senhas e pode ser reutilizada a qualquer momento.

Para estabelecer uma política de reutilização de senha globalmente, use as variáveis de sistema `password_history` e `password_reuse_interval`.

Exemplos:

* Para proibir o reuso de qualquer uma das últimas 6 senhas ou senhas mais recentes que 365 dias, coloque essas linhas no arquivo do servidor `my.cnf`:

  ```
  [mysqld]
  password_history=6
  password_reuse_interval=365
  ```

* Para definir e persistir as variáveis no tempo de execução, use declarações como esta:

  ```
  SET PERSIST password_history = 6;
  SET PERSIST password_reuse_interval = 365;
  ```

`SET PERSIST` configura um valor para a instância MySQL em execução. Também salva o valor para ser carregado em reinicializações subsequentes do servidor; consulte Seção 15.7.6.1, "Sintaxe SET para atribuição de variáveis". Para alterar o valor da instância MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`.

A política global de reutilização de senhas se aplica a todas as contas que não tenham sido configuradas para ignorá-la. Para estabelecer uma política para contas individuais, use as opções `PASSWORD HISTORY` e `PASSWORD REUSE INTERVAL` das declarações `CREATE USER` e `ALTER USER`. Veja a Seção 15.7.1.3, “Declaração CREATE USER”, e a Seção 15.7.1.1, “Declaração ALTER USER”.

Exemplos de declarações específicas para contas:

* Exija um mínimo de 5 mudanças de senha antes de permitir a reutilização:

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD HISTORY 5;
  ALTER USER 'jeffrey'@'localhost' PASSWORD HISTORY 5;
  ```

Esta opção de comprimento de histórico substitui a política global para todas as contas nomeadas pela declaração.

* Exigir um mínimo de 365 dias para permitir a reutilização:

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD REUSE INTERVAL 365 DAY;
  ALTER USER 'jeffrey'@'localhost' PASSWORD REUSE INTERVAL 365 DAY;
  ```

Esta opção de intervalo de tempo substitui a política global para todas as contas nomeadas pelo relatório.

* Para combinar ambos os tipos de restrições de reutilização, use `PASSWORD HISTORY` e `PASSWORD REUSE INTERVAL` juntos:

  ```
  CREATE USER 'jeffrey'@'localhost'
    PASSWORD HISTORY 5
    PASSWORD REUSE INTERVAL 365 DAY;
  ALTER USER 'jeffrey'@'localhost'
    PASSWORD HISTORY 5
    PASSWORD REUSE INTERVAL 365 DAY;
  ```

Essas opções substituem as restrições de reutilização de políticas globais para todas as contas nomeadas pelo enunciado.

* Atrasar a política global para ambos os tipos de restrições de reutilização:

  ```
  CREATE USER 'jeffrey'@'localhost'
    PASSWORD HISTORY DEFAULT
    PASSWORD REUSE INTERVAL DEFAULT;
  ALTER USER 'jeffrey'@'localhost'
    PASSWORD HISTORY DEFAULT
    PASSWORD REUSE INTERVAL DEFAULT;
  ```

#### Política de Verificação de Senha-Requerida

A partir do MySQL 8.0.13, é possível exigir que as tentativas de alterar a senha de uma conta sejam verificadas, especificando a senha atual a ser substituída. Isso permite que os administradores de banco de dados impeçam que os usuários alterem uma senha sem comprovar que conhecem a senha atual. Essas alterações poderiam ocorrer, por exemplo, se um usuário sai de uma sessão de terminal temporariamente sem fazer logout e um usuário malicioso usa a sessão para alterar a senha do usuário original no MySQL. Isso pode ter consequências indesejadas:

* O usuário original não consegue acessar o MySQL até que a senha da conta seja redefinida por um administrador.

* Até que o reajuste da senha ocorra, o usuário malicioso pode acessar o MySQL com as credenciais alteradas do usuário benigno.

A política de verificação de senha pode ser estabelecida globalmente, e as contas individuais podem ser configuradas para deferir à política global ou para substituir a política global com comportamento específico por conta.

Para cada conta, sua linha `mysql.user` indica se há um ajuste específico da conta que exige a verificação da senha atual para tentativas de alteração de senha. O ajuste é estabelecido pela opção `PASSWORD REQUIRE` das declarações `CREATE USER`(create-user.html "15.7.1.3 CREATE USER Statement") e `ALTER USER`:

* Se a configuração da conta for `PASSWORD REQUIRE CURRENT`, as alterações de senha devem especificar a senha atual.

* Se a configuração da conta for `PASSWORD REQUIRE CURRENT OPTIONAL`, as alterações de senha podem, mas não precisam especificar a senha atual.

* Se a configuração da conta for `PASSWORD REQUIRE CURRENT DEFAULT`, a variável de sistema `password_require_current` determina a política exigida para a verificação da conta:

+ Se `password_require_current` estiver habilitado, as alterações de senha devem especificar a senha atual.

+ Se `password_require_current` estiver desativado, as alterações de senha podem, mas não precisam, especificar a senha atual.

Em outras palavras, se a configuração da conta não for `PASSWORD REQUIRE CURRENT DEFAULT`, a configuração da conta prevalece sobre a política global estabelecida pela variável de sistema `password_require_current`. Caso contrário, a conta dá preferência à configuração da `password_require_current`.

Por padrão, a verificação de senha é opcional: `password_require_current` é desativado e as contas criadas sem a opção `PASSWORD REQUIRE` têm como padrão `PASSWORD REQUIRE CURRENT DEFAULT`.

A tabela a seguir mostra como as configurações por conta interagem com os valores da variável de sistema `password_require_current` para determinar a política de verificação de senha por conta.

**Tabela 8.10 Política de Verificação de Senha**

<table summary="Interaction of mysql.user table and password_require_current system variable for password-verification policy."><col style="width: 40%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th scope="col">Configuração por Conta</th> <th scope="col">password_require_current Variável do sistema</th> <th scope="col">As alterações de senha exigem senha atual?</th> </tr></thead><tbody><tr> <th scope="row"><code>PASSWORD REQUIRE CURRENT</code></th> <td><code>OFF</code></td> <td>Yes</td> </tr><tr> <th scope="row"><code>PASSWORD REQUIRE CURRENT</code></th> <td><code>ON</code></td> <td>Yes</td> </tr><tr> <th scope="row"><code>PASSWORD REQUIRE CURRENT OPTIONAL</code></th> <td><code>OFF</code></td> <td>No</td> </tr><tr> <th scope="row"><code>PASSWORD REQUIRE CURRENT OPTIONAL</code></th> <td><code>ON</code></td> <td>No</td> </tr><tr> <th scope="row"><code>PASSWORD REQUIRE CURRENT DEFAULT</code></th> <td><code>OFF</code></td> <td>No</td> </tr><tr> <th scope="row"><code>PASSWORD REQUIRE CURRENT DEFAULT</code></th> <td><code>ON</code></td> <td>Yes</td> </tr></tbody></table>

Nota

Os usuários privilegiados podem alterar qualquer senha de conta sem especificar a senha atual, independentemente da política que exige verificação. Um usuário privilegiado é aquele que possui o privilégio global `CREATE USER` ou o privilégio `UPDATE` para o banco de dados do sistema `mysql`.

Para estabelecer uma política de verificação de senha globalmente, use a variável de sistema `password_require_current`. Seu valor padrão é `OFF`, portanto, não é necessário que as alterações de senha da conta especifiquem a senha atual.

Exemplos:

* Estabelecer uma política global de que as alterações de senha devem especificar a senha atual. Inicie o servidor com essas linhas em um arquivo do servidor `my.cnf`:

  ```
  [mysqld]
  password_require_current=ON
  ```

* Para definir e persistir em `password_require_current` em tempo de execução, use uma declaração como uma dessas:

  ```
  SET PERSIST password_require_current = ON;
  SET PERSIST password_require_current = OFF;
  ```

`SET PERSIST` define um valor para a instância MySQL em execução. Também salva o valor para ser carregado em reinicializações subsequentes do servidor; consulte Seção 15.7.6.1, "Sintaxe SET para atribuição de variáveis". Para alterar o valor da instância MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`.

A política global que exige verificação de senha se aplica a todas as contas que não tenham sido configuradas para ignorá-la. Para estabelecer uma política para contas individuais, use as opções `PASSWORD REQUIRE` das declarações `CREATE USER` e (create-user.html "15.7.1.3 CREATE USER Statement") e `ALTER USER`. Veja a Seção 15.7.1.3, “Declaração CREATE USER”, e a Seção 15.7.1.1, “Declaração ALTER USER”.

Exemplos de declarações específicas para contas:

* Exigir que as alterações de senha especifiquem a senha atual:

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT;
  ALTER USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT;
  ```

Esta opção de verificação substitui a política global para todas as contas nomeadas pelo extrato.

* Não é necessário que as alterações de senha especifiquem a senha atual (a senha atual pode, mas não precisa ser fornecida):

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT OPTIONAL;
  ALTER USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT OPTIONAL;
  ```

Esta opção de verificação substitui a política global para todas as contas nomeadas pelo extrato.

* Substitua a política global de verificação de senha necessária por todas as contas mencionadas na declaração:

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT DEFAULT;
  ALTER USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT DEFAULT;
  ```

A verificação da senha atual entra em jogo quando um usuário altera uma senha usando a declaração `ALTER USER`(alter-user.html "15.7.1.1 ALTER USER Statement") ou `SET PASSWORD`. Os exemplos usam `ALTER USER`(alter-user.html "15.7.1.1 ALTER USER Statement"), que é preferido em relação a `SET PASSWORD`(set-password.html "15.7.1.10 SET PASSWORD Statement"), mas os princípios descritos aqui são os mesmos para ambas as declarações.

Em declarações de alteração de senha, uma cláusula `REPLACE` especifica a senha atual a ser substituída. Exemplos:

* Alterar a senha do usuário atual:

  ```
  ALTER USER USER() IDENTIFIED BY 'auth_string' REPLACE 'current_auth_string';
  ```

* Alterar a senha de um usuário nomeado:

  ```
  ALTER USER 'jeffrey'@'localhost'
    IDENTIFIED BY 'auth_string'
    REPLACE 'current_auth_string';
  ```

* Alterar o plugin de autenticação de um usuário nomeado e a senha:

  ```
  ALTER USER 'jeffrey'@'localhost'
    IDENTIFIED WITH caching_sha2_password BY 'auth_string'
    REPLACE 'current_auth_string';
  ```

A cláusula `REPLACE` funciona da seguinte forma:

* `REPLACE` deve ser fornecido se as alterações de senha para a conta forem necessárias para especificar a senha atual, como uma verificação de que o usuário que tenta fazer a alteração realmente conhece a senha atual.

* `REPLACE` é opcional se as alterações de senha para a conta podem, mas não precisam especificar a senha atual.

* Se `REPLACE` for especificado, ele deve especificar a senha atual correta, ou ocorrerá um erro. Isso é verdadeiro mesmo que `REPLACE` seja opcional.

* `REPLACE` pode ser especificado apenas ao alterar a senha da conta do usuário atual. (Isso significa que, nos exemplos mostrados, as declarações que explicitamente nomeiam a conta para `jeffrey` falham, a menos que o usuário atual seja `jeffrey`. Isso é verdadeiro mesmo que a alteração seja realizada por outro usuário por um usuário privilegiado; no entanto, tal usuário pode alterar qualquer senha sem especificar `REPLACE`.

* `REPLACE` é omitido do log binário para evitar a escrita de senhas em texto claro nele.

#### Suporte a Senha Dupla

A partir do MySQL 8.0.14, as contas de usuário podem ter duas senhas, designadas como senha primária e secundária. A capacidade de duas senhas permite realizar mudanças de credenciais de forma contínua em cenários como este:

* Um sistema tem um grande número de servidores MySQL, possivelmente envolvendo replicação.

* Múltiplas aplicações se conectam a diferentes servidores MySQL. * É necessário realizar mudanças periódicas nas credenciais da conta ou contas utilizadas pelas aplicações para se conectarem aos servidores.

Considere como uma mudança de credencial deve ser realizada no tipo anterior de cenário quando uma conta é permitida apenas uma senha única. Neste caso, deve haver uma cooperação próxima no momento em que a mudança da senha da conta é feita e propagada em todos os servidores, e quando todas as aplicações que usam a conta são atualizadas para usar a nova senha. Esse processo pode envolver tempo de inatividade durante o qual os servidores ou aplicações não estarão disponíveis.

Com senhas duplas, as alterações de credenciais podem ser feitas mais facilmente, em fases, sem exigir cooperação próxima e sem tempo de inatividade:

1. Para cada conta afetada, estabeleça uma nova senha primária nos servidores, mantendo a senha atual como a senha secundária. Isso permite que os servidores reconheçam qualquer uma das senhas primária ou secundária para cada conta, enquanto as aplicações podem continuar a se conectar aos servidores usando a mesma senha que anteriormente (que agora é a senha secundária).

2. Após a mudança da senha ter sido propagada para todos os servidores, modifique as aplicações que utilizam qualquer conta afetada para se conectar usando a senha primária da conta.

3. Após todas as aplicações terem sido migradas das senhas secundárias para as senhas primárias, as senhas secundárias não são mais necessárias e podem ser descartadas. Após essa mudança ter sido propagada para todos os servidores, apenas a senha primária para cada conta pode ser usada para se conectar. A mudança de credenciais está agora completa.

O MySQL implementa a capacidade de senha dupla com sintaxe que salva e descarta senhas secundárias:

* A cláusula `RETAIN CURRENT PASSWORD` para as declarações `ALTER USER` e `SET PASSWORD` salva a senha atual da conta como sua senha secundária quando você atribui uma nova senha primária.

* A cláusula `DISCARD OLD PASSWORD` para `ALTER USER` descarta uma senha secundária da conta, deixando apenas a senha primária.

Suponha que, para o cenário de alteração de credenciais descrito anteriormente, uma conta denominada `'appuser1'@'host1.example.com'` seja usada por aplicativos para se conectar aos servidores, e que a senha da conta seja alterada de `'password_a'` para `'password_b'`.

Para realizar essa alteração de credenciais, use `ALTER USER` da seguinte forma:

1. Em cada servidor que não é uma replica, configure `'password_b'` como a nova senha primária do `appuser1`, mantendo a senha atual como a senha secundária:

   ```
   ALTER USER 'appuser1'@'host1.example.com'
     IDENTIFIED BY 'password_b'
     RETAIN CURRENT PASSWORD;
   ```

2. Aguarde a mudança da senha ser replicada em todo o sistema para todas as réplicas.

3. Modifique cada aplicativo que usa a conta `appuser1` para que ele se conecte aos servidores usando uma senha de `'password_b'` em vez de `'password_a'`.

4. Neste ponto, a senha secundária não é mais necessária. Em cada servidor que não é uma réplica, descarte a senha secundária:

   ```
   ALTER USER 'appuser1'@'host1.example.com'
     DISCARD OLD PASSWORD;
   ```

5. Após a mudança de senha de descarte ter sido replicada para todas as réplicas, a mudança de credencial está completa.

As cláusulas `RETAIN CURRENT PASSWORD` e `DISCARD OLD PASSWORD` têm os seguintes efeitos:

* `RETAIN CURRENT PASSWORD` retém uma senha atual da conta como sua senha secundária, substituindo qualquer senha secundária existente. A nova senha se torna a senha primária, mas os clientes podem usar a conta para se conectar ao servidor usando a senha primária ou secundária. (Exceção: Se a nova senha especificada pela declaração `ALTER USER` ou `SET PASSWORD` estiver vazia, a senha secundária também ficará vazia, mesmo que `RETAIN CURRENT PASSWORD` seja fornecida.)

* Se você especificar `RETAIN CURRENT PASSWORD` para uma conta que tem uma senha primária vazia, a declaração falha.

* Se uma conta tiver uma senha secundária e você alterar sua senha primária sem especificar `RETAIN CURRENT PASSWORD`, a senha secundária permanecerá inalterada.

* Para `ALTER USER`, se você alterar o plugin de autenticação atribuído à conta, a senha secundária é descartada. Se você alterar o plugin de autenticação e também especificar `RETAIN CURRENT PASSWORD`, a declaração falha.

* Para `ALTER USER`, `DISCARD OLD PASSWORD` descarta a senha secundária, se houver. A conta retém apenas sua senha primária, e os clientes podem usar a conta para se conectar ao servidor apenas com a senha primária.

As declarações que modificam senhas secundárias exigem esses privilégios:

* O privilégio `APPLICATION_PASSWORD_ADMIN` é necessário para usar a cláusula `RETAIN CURRENT PASSWORD` ou `DISCARD OLD PASSWORD` para as declarações [`ALTER USER`](alter-user.html "15.7.1.1 ALTER USER Statement") e [`SET PASSWORD`](set-password.html "15.7.1.10 SET PASSWORD Statement") que se aplicam à sua própria conta. O privilégio é necessário para manipular sua própria senha secundária, pois a maioria dos usuários requer apenas uma senha.

* Se uma conta deve ser permitida para manipular senhas secundárias para todas as contas, ela deve ser concedida o privilégio `CREATE USER` em vez de `APPLICATION_PASSWORD_ADMIN`.

#### Geração de Senha Aleatória

A partir do MySQL 8.0.18, as declarações `CREATE USER`, (create-user.html "15.7.1.3 CREATE USER Statement"), `ALTER USER` e `SET PASSWORD` têm a capacidade de gerar senhas aleatórias para contas de usuário, como alternativa à exigência de senhas literais especificadas explicitamente pelo administrador. Consulte a descrição de cada declaração para obter detalhes sobre a sintaxe. Esta seção descreve as características comuns às senhas aleatórias geradas.

Por padrão, as senhas aleatórias geradas têm um comprimento de 20 caracteres. Esse comprimento é controlado pela variável de sistema `generated_random_password_length`, que tem um intervalo de 5 a 255.

Para cada conta para a qual uma declaração gera uma senha aleatória, a declaração armazena a senha criptografada de forma apropriada para o plugin de autenticação de conta no sistema `mysql.user`. A declaração também retorna a senha em texto claro em uma linha de um conjunto de resultados para torná-la disponível para o usuário ou aplicativo que executa a declaração. As colunas do conjunto de resultados são nomeadas `user`, `host`, `generated password` e `auth_factor`, indicando os valores do nome do usuário e do nome do host que identificam a linha afetada na tabela de sistema `mysql.user`, a senha gerada em texto claro e o fator de autenticação ao qual o valor da senha exibida se aplica.

```
mysql> CREATE USER
       'u1'@'localhost' IDENTIFIED BY RANDOM PASSWORD,
       'u2'@'%.example.com' IDENTIFIED BY RANDOM PASSWORD,
       'u3'@'%.org' IDENTIFIED BY RANDOM PASSWORD;
+------+---------------+----------------------+-------------+
| user | host          | generated password   | auth_factor |
+------+---------------+----------------------+-------------+
| u1   | localhost     | iOeqf>Mh9:;XD&qn(Hl} |           1 |
| u2   | %.example.com | sXTSAEvw3St-R+_-C3Vb |           1 |
| u3   | %.org         | nEVe%Ctw/U/*Md)Exc7& |           1 |
+------+---------------+----------------------+-------------+
mysql> ALTER USER
       'u1'@'localhost' IDENTIFIED BY RANDOM PASSWORD,
       'u2'@'%.example.com' IDENTIFIED BY RANDOM PASSWORD;
+------+---------------+----------------------+-------------+
| user | host          | generated password   | auth_factor |
+------+---------------+----------------------+-------------+
| u1   | localhost     | Seiei:&cw}8]@3OA64vh |           1 |
| u2   | %.example.com | j@&diTX80l8}(NiHXSae |           1 |
+------+---------------+----------------------+-------------+
mysql> SET PASSWORD FOR 'u3'@'%.org' TO RANDOM;
+------+-------+----------------------+-------------+
| user | host  | generated password   | auth_factor |
+------+-------+----------------------+-------------+
| u3   | %.org | n&cz2xF;P3!U)+]Vw52H |           1 |
+------+-------+----------------------+-------------+
```

Uma declaração `CREATE USER`, `ALTER USER` ou `SET PASSWORD` que gera uma senha aleatória para uma conta é escrita no log binário como uma declaração `CREATE USER` ou `ALTER USER` com uma cláusula *`IDENTIFIED WITH auth_plugin AS 'auth_string'`*, onde *`auth_plugin`* é o plugin de autenticação de conta e `'auth_string'` é o valor da senha criptografada da conta.

Se o componente `validate_password` estiver instalado, a política que ele implementa não afeta as senhas geradas. (O propósito da validação de senhas é ajudar as pessoas a criar senhas melhores.)

#### Rastreamento de logins falhos e bloqueio temporário de contas

A partir do MySQL 8.0.19, os administradores podem configurar as contas de usuário de modo que muitos falhas consecutivas de login causem bloqueio temporário da conta.

“Falha no login” neste contexto significa que o cliente não forneceu uma senha correta durante uma tentativa de conexão. Isso não inclui falha em se conectar por motivos como problemas desconhecidos do usuário ou da rede. Para contas que possuem duas senhas (veja Suporte a Dupla Senha), qualquer senha da conta é considerada correta.

O número necessário de falhas de login e o tempo de bloqueio são configuráveis por conta, usando as opções `FAILED_LOGIN_ATTEMPTS` e `PASSWORD_LOCK_TIME` das declarações `CREATE USER` e `ALTER USER`. Exemplos:

```
CREATE USER 'u1'@'localhost' IDENTIFIED BY 'password'
  FAILED_LOGIN_ATTEMPTS 3 PASSWORD_LOCK_TIME 3;

ALTER USER 'u2'@'localhost'
  FAILED_LOGIN_ATTEMPTS 4 PASSWORD_LOCK_TIME UNBOUNDED;
```

Quando ocorrem muitas falhas consecutivas de login, o cliente recebe um erro que se parece com este:

```
ERROR 3957 (HY000): Access denied for user user.
Account is blocked for D day(s) (R day(s) remaining)
due to N consecutive failed logins.
```

Utilize as opções da seguinte forma:

* `FAILED_LOGIN_ATTEMPTS N`

Esta opção indica se deve monitorar as tentativas de login da conta que especificam uma senha incorreta. O número *`N`* especifica quantos tentativas de senha incorreta consecutivas causam o bloqueio temporário da conta.

* `PASSWORD_LOCK_TIME {N | UNBOUNDED}`

Esta opção indica o tempo em que a conta deve ser bloqueada após várias tentativas consecutivas de login fornecendo uma senha incorreta. O valor é um número *`N`* para especificar o número de dias que a conta permanece bloqueada, ou `UNBOUNDED` para especificar que, quando uma conta entra no estado temporariamente bloqueado, a duração desse estado é ilimitada e não termina até que a conta seja desbloqueada. As condições sob as quais o desbloqueio ocorre são descritas mais adiante.

Os valores permitidos de *`N`* para cada opção estão na faixa de 0 a 32767. Um valor de 0 desativa a opção.

O rastreamento de tentativas de login malsucedidas e o bloqueio temporário da conta têm essas características:

* Para que o rastreamento de falha no login e o bloqueio temporário ocorram para uma conta, as opções `FAILED_LOGIN_ATTEMPTS` e `PASSWORD_LOCK_TIME` devem ser ambas não nulas.

* Para `CREATE USER`, se `FAILED_LOGIN_ATTEMPTS` ou `PASSWORD_LOCK_TIME` não for especificado, seu valor padrão implícito é 0 para todas as contas nomeadas pela declaração. Isso significa que o rastreamento de falha de login e o bloqueio temporário de contas são desativados. (Esses valores padrão implícitos também se aplicam a contas criadas antes da introdução do rastreamento de falha de login.)

* Para `ALTER USER`, se `FAILED_LOGIN_ATTEMPTS` ou `PASSWORD_LOCK_TIME` não for especificado, seu valor permanece inalterado para todas as contas nomeadas pela declaração.

* Para que o bloqueio temporário da conta ocorra, as falhas de senha devem ser consecutivas. Qualquer login bem-sucedido que ocorra antes de atingir o valor `FAILED_LOGIN_ATTEMPTS` para falhas de login causa o recálculo do número de falhas. Por exemplo, se `FAILED_LOGIN_ATTEMPTS` é 4 e três falhas consecutivas de senha ocorreram, é necessário mais uma falha para que o bloqueio comece. Mas se o próximo login for bem-sucedido, o contagem de falhas de login para a conta é recarregada, de modo que quatro falhas consecutivas são novamente necessárias para o bloqueio.

* Uma vez que o bloqueio temporário comece, o login não será bem-sucedido, mesmo com a senha correta, até que a duração do bloqueio tenha passado ou a conta seja desbloqueada por um dos métodos de reposição de conta listados na discussão a seguir.

Quando o servidor lê as tabelas de concessão, ele inicializa as informações de estado para cada conta, indicando se o rastreamento de falha de login está habilitado, se a conta está temporariamente bloqueada atualmente e quando o bloqueio começou, se for o caso, e o número de falhas antes do bloqueio temporário ocorrer, se a conta não estiver bloqueada.

As informações de estado da conta podem ser redefinidas, o que significa que o contagem de falha de login é redefinida e a conta é desbloqueada, se estiver temporariamente bloqueada. Os redefinimentos de conta podem ser globais para todas as contas ou por conta:

* Um reajuste global de todas as contas ocorre para qualquer uma dessas condições:

+ Reinício do servidor.  
+ Execução de `FLUSH PRIVILEGES`(flush.html#flush-privileges). (O início do servidor com `--skip-grant-tables` faz com que as tabelas de concessão não sejam lidas, o que desativa o rastreamento de falhas de login. Neste caso, a primeira execução de `FLUSH PRIVILEGES` faz com que o servidor leia as tabelas de concessão e habilite o rastreamento de falhas de login, além de redefinir todas as contas.)

* Um reajuste por conta ocorre para qualquer uma dessas condições:

+ Login bem-sucedido para a conta.  
+ A duração do bloqueio passa. Nesse caso, o contagem de login falhado é redefinida no momento da próxima tentativa de login.

+ Elaboração de uma declaração `ALTER USER`(alter-user.html "15.7.1.1 ALTER USER Statement") para a conta que define `FAILED_LOGIN_ATTEMPTS` ou `PASSWORD_LOCK_TIME` (ou ambos) para qualquer valor (incluindo o valor atual da opção), ou elaboração de uma declaração `ALTER USER ... UNLOCK`(alter-user.html "15.7.1.1 ALTER USER Statement") para a conta.

Outras declarações `ALTER USER` para a conta não têm efeito sobre o seu número atual de tentativas de login malsucedidas ou seu estado de bloqueio.

O rastreamento de falha de login está vinculado à conta de login que é usada para verificar as credenciais. Se o encaminhamento de usuário estiver em uso, o rastreamento ocorre para o usuário do proxy, e não para o usuário encaminhado. Isso significa que o rastreamento está vinculado à conta indicada por `USER()`, e não à conta indicada por `CURRENT_USER()`. Para informações sobre a distinção entre usuários proxy e usuários encaminhados, consulte a Seção 8.2.19, “Usuários Proxy”.

### 8.2.16 Tratamento do servidor de senhas expiradas

O MySQL oferece capacidade de expiração de senha, que permite que os administradores de banco de dados exijam que os usuários redefram suas senhas. As senhas podem expirar manualmente e com base em uma política de expiração automática (consulte Seção 8.2.15, “Gestão de Senhas”).

A declaração `ALTER USER` permite a expiração da senha da conta. Por exemplo:

```
ALTER USER 'myuser'@'localhost' PASSWORD EXPIRE;
```

Para cada conexão que utiliza uma conta com uma senha expirada, o servidor ou desconecta o cliente ou restringe o cliente ao "modo sandbox", no qual o servidor permite que o cliente realize apenas as operações necessárias para redefinir a senha expirada. A ação realizada pelo servidor depende das configurações do cliente e do servidor, conforme discutido mais adiante.

Se o servidor desconectar o cliente, ele retorna um erro `ER_MUST_CHANGE_PASSWORD_LOGIN`:

```
$> mysql -u myuser -p
Password: ******
ERROR 1862 (HY000): Your password has expired. To log in you must
change it using a client that supports expired passwords.
```

Se o servidor restringir o cliente ao modo sandbox, essas operações são permitidas dentro da sessão do cliente:

* O cliente pode redefinir a senha da conta com `ALTER USER` ou `SET PASSWORD`. Após isso ter sido feito, o servidor restaura o acesso normal para a sessão, bem como para conexões subsequentes que utilizam a conta.

Nota

Embora seja possível "redefinir" uma senha expirada, definindo-a para seu valor atual, é preferível, por questão de boa política, escolher uma senha diferente. Os administradores de banco de dados podem impor a não reutilização estabelecendo uma política apropriada de reutilização de senha. Veja a Política de Reutilização de Senha.

* Antes do MySQL 8.0.27, o cliente pode usar a declaração `SET`. A partir do MySQL 8.0.27, isso não é mais permitido.

Para qualquer operação não permitida dentro da sessão, o servidor retorna um erro `ER_MUST_CHANGE_PASSWORD`:

```
mysql> USE performance_schema;
ERROR 1820 (HY000): You must reset your password using ALTER USER
statement before executing this statement.

mysql> SELECT 1;
ERROR 1820 (HY000): You must reset your password using ALTER USER
statement before executing this statement.
```

Isso é o que normalmente acontece para invocções interativas do cliente **mysql**, porque, por padrão, essas invocções são colocadas em modo sandbox. Para retomar o funcionamento normal, selecione uma nova senha.

Para invocações não interativas do cliente **mysql** (por exemplo, em modo em lote), o servidor normalmente desconecta o cliente se a senha expirar. Para permitir que as invocações não interativas do **mysql** permaneçam conectadas para que a senha possa ser alterada (usando as declarações permitidas no modo sandbox), adicione a opção `--connect-expired-password` ao comando **mysql**.

Como mencionado anteriormente, se o servidor desconecta um cliente com senha expirada ou o restringe ao modo sandbox, depende de uma combinação de configurações do cliente e do servidor. A discussão a seguir descreve as configurações relevantes e como elas interagem.

Nota

Essa discussão se aplica apenas para contas com senhas expiradas. Se um cliente se conectar usando uma senha não expirada, o servidor lida normalmente com o cliente.

Do lado do cliente, um cliente específico indica se pode lidar com o modo sandbox para senhas expiradas. Para clientes que usam a biblioteca de clientes C, há duas maneiras de fazer isso:

* Passe a bandeira `MYSQL_OPT_CAN_HANDLE_EXPIRED_PASSWORDS` para `mysql_options()` antes de conectar:

  ```
  bool arg = 1;
  mysql_options(mysql,
                MYSQL_OPT_CAN_HANDLE_EXPIRED_PASSWORDS,
                &arg);
  ```

Essa é a técnica usada dentro do cliente **mysql**, que permite `MYSQL_OPT_CAN_HANDLE_EXPIRED_PASSWORDS` se invocado interativamente ou com a opção `--connect-expired-password`.

* Passe a bandeira `CLIENT_CAN_HANDLE_EXPIRED_PASSWORDS` para `mysql_real_connect()` no momento da conexão:

  ```
  MYSQL mysql;
  mysql_init(&mysql);
  if (!mysql_real_connect(&mysql,
                          host, user, password, db,
                          port, unix_socket,
                          CLIENT_CAN_HANDLE_EXPIRED_PASSWORDS))
  {
    ... handle error ...
  }
  ```

Outros Conectivos MySQL têm suas próprias convenções para indicar prontidão para lidar com o modo sandbox. Consulte a documentação do Conectivo no qual você está interessado.

Do lado do servidor, se um cliente indicar que pode lidar com senhas expiradas, o servidor coloca-o no modo sandbox.

Se um cliente não indicar que pode lidar com senhas expiradas (ou usa uma versão mais antiga da biblioteca do cliente que não pode indicar isso), a ação do servidor depende do valor da variável de sistema `disconnect_on_expired_password`:

* Se `disconnect_on_expired_password` estiver habilitado (o padrão), o servidor desconecta o cliente com um erro `ER_MUST_CHANGE_PASSWORD_LOGIN`.

* Se `disconnect_on_expired_password` estiver desativado, o servidor coloca o cliente no modo sandbox.

### 8.2.17 Autenticação Conectada

Quando um cliente se conecta ao servidor MySQL, o servidor utiliza o nome de usuário fornecido pelo cliente e o host do cliente para selecionar a linha de conta apropriada da tabela do sistema `mysql.user`. O servidor, em seguida, autentica o cliente, determinando a partir da linha de conta qual plugin de autenticação se aplica ao cliente:

* Se o servidor não conseguir encontrar o plugin, ocorre um erro e a tentativa de conexão é rejeitada.

* Caso contrário, o servidor invoca esse plugin para autenticar o usuário, e o plugin retorna um status ao servidor, indicando se o usuário forneceu a senha correta e está autorizado a se conectar.

A autenticação conectada permite essas capacidades importantes:

* **Escolha dos métodos de autenticação.** A autenticação plugável facilita para os administradores de banco de dados escolher e alterar o método de autenticação usado para contas individuais do MySQL.

* **Autenticação externa.** A autenticação plugável permite que os clientes se conectem ao servidor MySQL com credenciais apropriadas para métodos de autenticação que armazenam as credenciais em locais diferentes da tabela do sistema `mysql.user`. Por exemplo, plugins podem ser criados para usar métodos de autenticação externa, como PAM, IDs de login do Windows, LDAP ou Kerberos.

* **Usuários proxy:** Se um usuário é autorizado a se conectar, um plugin de autenticação pode retornar ao servidor um nome de usuário diferente do nome do usuário que está se conectando, para indicar que o usuário que está se conectando é um proxy para outro usuário (o usuário proxy). Enquanto a conexão durar, o usuário proxy é tratado, para fins de controle de acesso, como tendo os privilégios do usuário proxy. Na verdade, um usuário assume a identidade de outro. Para mais informações, consulte a Seção 8.2.19, “Usuários proxy”.

Nota

Se você iniciar o servidor com a opção `--skip-grant-tables`, os plugins de autenticação não são usados, mesmo que carregados, porque o servidor não realiza nenhuma autenticação de cliente e permite que qualquer cliente se conecte. Como isso é inseguro, se o servidor for iniciado com a opção `--skip-grant-tables`, ele também desativa as conexões remotas ao habilitar `skip_networking`.

* Plugins de autenticação disponíveis
* O plugin de autenticação padrão
* Uso do plugin de autenticação
* Compatibilidade do cliente/servidor do plugin de autenticação
* Considerações sobre a escrita do conector do plugin de autenticação
* Restrições sobre autenticação plugável

#### Plugins de autenticação disponíveis

O MySQL 8.0 oferece esses plugins de autenticação:

* Um plugin que realiza autenticação nativa; ou seja, autenticação baseada no método de hashing de senha em uso antes da introdução da autenticação plugável no MySQL. O plugin `mysql_native_password` implementa autenticação com base nesse método nativo de hashing de senha. Veja a Seção 8.4.1.1, “Autenticação Plugável Nativa”.

Nota

A partir do MySQL 8.0.34, o plugin de autenticação `mysql_native_password` é desatualizado e está sujeito à remoção em uma versão futura do MySQL.

* Plugins que realizam autenticação usando hashing de senha SHA-256. Esse é um tipo de criptografia mais forte do que a disponível na autenticação nativa. Veja a Seção 8.4.1.2, “Cacheamento de Autenticação Pluga-Ável SHA-2”, e a Seção 8.4.1.3, “Autenticação Pluga-Ável SHA-256”.

* Um plugin do lado do cliente que envia a senha para o servidor sem criptografia ou hashing. Este plugin é usado em conjunto com plugins do lado do servidor que exigem acesso à senha exatamente como fornecida pelo usuário do cliente. Veja a Seção 8.4.1.4, “Autenticação Deslizável de Texto Claro do Lado do Cliente”.

* Um plugin que realiza autenticação externa usando PAM (Pluggable Authentication Modules), permitindo que o MySQL Server use PAM para autenticar usuários do MySQL. Este plugin também suporta usuários proxy. Veja a Seção 8.4.1.5, “Autenticação Pluggable PAM”.

* Um plugin que realiza autenticação externa no Windows, permitindo que o MySQL Server use serviços nativos do Windows para autenticar conexões de clientes. Usuários que se cadastraram no Windows podem se conectar a partir de programas cliente do MySQL ao servidor com base nas informações de seu ambiente, sem especificar uma senha adicional. Este plugin também suporta usuários proxy. Veja a Seção 8.4.1.6, “Autenticação Plugável do Windows”.

* Plugins que realizam autenticação usando LDAP (Lightweight Directory Access Protocol) para autenticar usuários do MySQL acessando serviços de diretório, como X.500. Esses plugins também suportam usuários proxy. Veja a Seção 8.4.1.7, “Autenticação Conectada por LDAP”.

* Um plugin que realiza autenticação usando Kerberos para autenticar usuários do MySQL que correspondem a princípios Kerberos. Veja a Seção 8.4.1.8, “Autenticação Pluggable Kerberos”.

* Um plugin que impede todas as conexões do cliente em qualquer conta que o utilize. Os casos de uso para este plugin incluem contas proxy que nunca devem permitir login direto, mas são acessadas apenas através de contas proxy e contas que devem ser capazes de executar programas e visualizações armazenadas com privilégios elevados, sem expor esses privilégios a usuários comuns. Veja a Seção 8.4.1.9, “Autenticação Plugável sem Login”.

* Um plugin que autentica clientes que se conectam a partir do host local através do arquivo de socket Unix. Veja a Seção 8.4.1.10, “Autenticação de Credenciais Peer-Socket”.

* Um plugin que autentica usuários no MySQL Server usando autenticação FIDO. Veja a Seção 8.4.1.11, “Autenticação FIDO Pluggable”.

Nota

A partir do MySQL 8.0.35, os plugins de autenticação `authentication_fido` e `authentication_fido_client` são desatualizados e estarão sujeitos à remoção em uma versão futura do MySQL.

* Um plugin de teste que verifica as credenciais da conta e registra o sucesso ou o fracasso no registro do log de erro do servidor. Este plugin é destinado a fins de teste e desenvolvimento, e como exemplo de como escrever um plugin de autenticação. Veja a Seção 8.4.1.12, “Autenticação Conectada”.

Nota

Para obter informações sobre as restrições atuais sobre o uso de autenticação plugável, incluindo quais conectores suportam quais plugins, consulte Restrições sobre Autenticação Plugável.

Os desenvolvedores de conectores de terceiros devem ler essa seção para determinar em que medida um conector pode aproveitar as capacidades de autenticação plugáveis e quais são os passos a serem tomados para se tornar mais compatível.

Se você está interessado em escrever seus próprios plugins de autenticação, veja Escrever plugins de autenticação.

#### O Plugin de Autenticação Predefinido

As declarações `CREATE USER` e `ALTER USER` têm sintaxe para especificar como uma conta autentica. Algumas formas dessa sintaxe não nomeiam explicitamente um plugin de autenticação (não há cláusula `IDENTIFIED WITH`). Por exemplo:

```
CREATE USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
```

Nesses casos, o servidor atribui o plugin de autenticação padrão à conta. Antes do MySQL 8.0.27, esse padrão é o valor da variável de sistema `default_authentication_plugin`.

A partir do MySQL 8.0.27, que introduz autenticação multifatorial, pode haver até três cláusulas que especificam como uma conta autentica. As regras que determinam o plugin de autenticação padrão para métodos de autenticação que não nomeiam nenhum plugin são específicas do fator:

* Fator 1: Se o elemento 1 de `authentication_policy` nomear um plugin de autenticação, esse plugin é o padrão. Se o elemento 1 de `authentication_policy` for `*`, o valor de `default_authentication_plugin` é o padrão.

Dadas as regras acima, a seguinte declaração cria uma conta de autenticação de dois fatores, com o primeiro método de autenticação determinado pelo ajuste `authentication_policy` ou `default_authentication_plugin`:

  ```
  CREATE USER 'wei'@'localhost' IDENTIFIED BY 'password'
    AND IDENTIFIED WITH authentication_ldap_simple;
  ```

Da mesma forma, este exemplo cria uma conta de autenticação de três fatores:

  ```
  CREATE USER 'mateo'@'localhost' IDENTIFIED BY 'password'
    AND IDENTIFIED WITH authentication_ldap_simple
    AND IDENTIFIED WITH authentication_fido;
  ```

Você pode usar `SHOW CREATE USER` para visualizar os métodos de autenticação aplicados.

* Fator 2 ou 3: Se o elemento correspondente `authentication_policy` designar um plugin de autenticação, esse plugin é o padrão. Se o elemento `authentication_policy` for `*` ou vazio, não há padrão; tentar definir um método de autenticação de conta para o fator sem designar um plugin é um erro, como nos exemplos a seguir:

  ```
  mysql> CREATE USER 'sofia'@'localhost' IDENTIFIED WITH authentication_ldap_simple
         AND IDENTIFIED BY 'abc';
  ERROR 1524 (HY000): Plugin '' is not loaded

  mysql> CREATE USER 'sofia'@'localhost' IDENTIFIED WITH authentication_ldap_simple
         AND IDENTIFIED BY 'abc';
  ERROR 1524 (HY000): Plugin '*' is not loaded
  ```

#### Uso do Plugin de Autenticação

Esta seção fornece instruções gerais para a instalação e uso de plugins de autenticação. Para instruções específicas de um plugin dado, consulte a seção que descreve esse plugin na Seção 8.4.1, “Plugins de Autenticação”.

Em geral, a autenticação conectada usa um par de plugins correspondentes nos lados do servidor e do cliente, então você usa um método de autenticação dado assim:

* Se necessário, instale a biblioteca de plugins ou as bibliotecas que contenham os plugins apropriados. No host do servidor, instale a biblioteca que contém o plugin do lado do servidor, para que o servidor possa usá-lo para autenticar conexões de clientes. Da mesma forma, em cada host de cliente, instale a biblioteca que contém o plugin do lado do cliente para uso por programas de cliente. Os plugins de autenticação que são construídos não precisam ser instalados.

* Para cada conta do MySQL que você criar, especifique o plugin apropriado para o lado do servidor que deve ser usado para autenticação. Se a conta deve usar o plugin de autenticação padrão, a declaração de criação da conta não precisa especificar o plugin explicitamente. O servidor atribui o plugin de autenticação padrão, determinado conforme descrito em O Plugin de Autenticação Padrão.

* Quando um cliente se conecta, o plugin do lado do servidor informa ao programa do cliente qual plugin do lado do cliente deve ser usado para autenticação.

No caso de uma conta usar um método de autenticação que é o padrão tanto para o servidor quanto para o programa do cliente, o servidor não precisa comunicar ao cliente qual plugin do lado do cliente deve ser usado, e uma ida e volta na negociação cliente/servidor pode ser evitada.

Para clientes padrão do MySQL, como **mysql** e **mysqladmin**, a opção `--default-auth=plugin_name` pode ser especificada na linha de comando como uma dica sobre qual plugin do lado do cliente o programa pode esperar usar, embora o servidor substitua isso se o plugin do lado do servidor associado à conta do usuário exigir um plugin do lado do cliente diferente.

Se o programa do cliente não encontrar o arquivo da biblioteca de plugins do lado do cliente, especifique uma opção `--plugin-dir=dir_name` para indicar a localização do diretório da biblioteca de plugins.

#### Compatibilidade do Plugin de Autenticação Cliente/Servidor

A autenticação conectada permite flexibilidade na escolha dos métodos de autenticação para contas do MySQL, mas, em alguns casos, as conexões do cliente não podem ser estabelecidas devido à incompatibilidade do plugin de autenticação entre o cliente e o servidor.

O princípio de compatibilidade geral para uma conexão de cliente bem-sucedida com uma conta específica em um servidor específico é que tanto o cliente quanto o servidor devem suportar o *método* de autenticação exigido pela conta. Como os métodos de autenticação são implementados por plugins de autenticação, tanto o cliente quanto o servidor devem suportar o *plugin* de autenticação exigido pela conta.

As incompatibilidades dos plugins de autenticação podem surgir de várias maneiras. Exemplos:

* Conecte-se usando um cliente MySQL 5.7 a partir de 5.7.22 ou inferior a uma conta do servidor MySQL 8.0 que autentique com `caching_sha2_password`. Isso falha porque o cliente 5.7 não reconhece o plugin, que foi introduzido no MySQL 8.0. (Esse problema é resolvido no MySQL 5.7 a partir de 5.7.23, quando o suporte do lado do cliente `caching_sha2_password` foi adicionado à biblioteca do cliente MySQL e aos programas do cliente.)

* Conecte-se usando um cliente MySQL 5.7 a uma conta do servidor pré-5.7 que autentique com `mysql_old_password`. Isso falha por vários motivos. Primeiro, tal conexão requer `--secure-auth=0`, que não é mais uma opção suportada. Mesmo que fosse suportada, o cliente 5.7 não reconhece o plugin porque foi removido no MySQL 5.7.

* Conecte-se usando um cliente MySQL 5.7 de uma distribuição comunitária a uma conta do servidor MySQL 5.7 Enterprise que autentica usando um dos plugins de autenticação LDAP exclusivos para a Enterprise. Isso falha porque o cliente comunitário não tem acesso ao plugin Enterprise.

De modo geral, esses problemas de compatibilidade não surgem quando as conexões são feitas entre um cliente e um servidor da mesma distribuição do MySQL. Quando as conexões são feitas entre um cliente e um servidor de diferentes séries do MySQL, problemas podem surgir. Esses problemas são inerentes ao processo de desenvolvimento quando o MySQL introduz novos plugins de autenticação ou remove os antigos. Para minimizar a possibilidade de incompatibilidades, atualize regularmente o servidor, os clientes e os conectores de forma oportuna.

#### Considerações sobre o Conector de Plugin de Autenticação

Existem várias implementações do protocolo cliente/servidor do MySQL. A biblioteca de clientes `libmysqlclient` C API é uma dessas implementações. Alguns conectores MySQL (tipicamente aqueles que não são escritos em C) fornecem sua própria implementação. No entanto, nem todas as implementações do protocolo tratam a autenticação de plugins da mesma maneira. Esta seção descreve um problema de autenticação que os implementadores do protocolo devem levar em consideração.

No protocolo cliente/servidor, o servidor informa aos clientes que se conectam qual plugin de autenticação ele considera o padrão. Se a implementação do protocolo usada pelo cliente tentar carregar o plugin padrão e esse plugin não existir no lado do cliente, a operação de carregamento falha. Essa é uma falha desnecessária se o plugin padrão não for o plugin realmente necessário pela conta à qual o cliente está tentando se conectar.

Se uma implementação de protocolo cliente/servidor não tiver sua própria noção de plugin de autenticação padrão e sempre tentar carregar o plugin padrão especificado pelo servidor, falhará com um erro se esse plugin não estiver disponível.

Para evitar esse problema, o protocolo de implementação utilizado pelo cliente deve ter seu próprio plugin padrão e deve usá-lo como sua primeira escolha (ou, como alternativa, recorrer a esse padrão em caso de falha na carga do plugin padrão especificado pelo servidor). Exemplo:

* No MySQL 5.7, `libmysqlclient` usa como escolha padrão `mysql_native_password` ou o plugin especificado através da opção `MYSQL_DEFAULT_AUTH` para `mysql_options()`.

* Quando um cliente 5.7 tenta se conectar a um servidor 8.0, o servidor especifica `caching_sha2_password` como seu plugin de autenticação padrão, mas o cliente ainda envia detalhes de credenciais de acordo com `mysql_native_password` ou o que for especificado através de `MYSQL_DEFAULT_AUTH`.

* A única vez que o cliente carrega o plugin especificado pelo servidor é para uma solicitação de mudança de plugin, mas, nesse caso, pode ser qualquer plugin, dependendo da conta do usuário. Neste caso, o cliente deve tentar carregar o plugin, e se esse plugin não estiver disponível, um erro não é opcional.

#### Restrições sobre autenticação plugável

A primeira parte desta seção descreve as restrições gerais sobre a aplicabilidade do framework de autenticação plugável descrito na Seção 8.2.17, “Autenticação Plugável”. A segunda parte descreve como os desenvolvedores de conectores de terceiros podem determinar em que medida um conector pode aproveitar as capacidades de autenticação plugável e quais os passos a serem tomados para se tornar mais conformista.

O termo “autenticação nativa” usado aqui se refere à autenticação contra senhas armazenadas na tabela do sistema `mysql.user`. Esse é o mesmo método de autenticação fornecido por servidores MySQL mais antigos, antes de a autenticação plugável ser implementada. “Autenticação nativa do Windows” se refere à autenticação usando as credenciais de um usuário que já iniciou sessão no Windows, conforme implementado pelo plugin de Autenticação Nativa do Windows (“plugin do Windows” abreviado).

* Restrições de autenticação geral intercambiável
* Autenticação intercambiável e Conectores de terceiros

##### Restrições Gerais de Autenticação Conectada

##### Restrições Gerais de Autenticação Conectada

This document describes the general restrictions on the use of plug-in authentication in the Microsoft Dynamics 365 for Finance and Operations environment.

Este documento descreve as restrições gerais sobre o uso de autenticação plug-in no ambiente Microsoft Dynamics 365 para Finanças e Operações.

* **Conectador/C++:** Os clientes que utilizam este conector podem se conectar ao servidor apenas através de contas que utilizam autenticação nativa.

Exceção: Um conector suporta autenticação plugável se foi construído para se conectar dinamicamente ao `libmysqlclient` (em vez de estaticamente) e carrega a versão atual do `libmysqlclient` se essa versão estiver instalada, ou se o conector for recompilado a partir de fonte para se conectar ao `libmysqlclient` atual.

Para obter informações sobre como escrever conectores para lidar com informações do servidor sobre o plugin de autenticação do lado do servidor padrão, consulte Considerações sobre Conectividade do Plugin de Autenticação.

* **Connector/NET:** Os clientes que utilizam o Connector/NET podem se conectar ao servidor por meio de contas que utilizam autenticação nativa ou autenticação nativa do Windows.

* **Conectador/PHP:** Os clientes que utilizam este conector podem se conectar ao servidor apenas através de contas que utilizam autenticação nativa, quando compilados usando o driver nativo MySQL para PHP (`mysqlnd`).

* **Autenticação nativa do Windows:** Conectar através de uma conta que utiliza o plugin do Windows requer a configuração do Domínio do Windows. Sem isso, a autenticação NTLM é usada e, então, apenas conexões locais são possíveis; ou seja, o cliente e o servidor devem rodar no mesmo computador.

* **Usuários proxy:** O suporte para usuários proxy está disponível na medida em que os clientes podem se conectar através de contas autenticadas com plugins que implementam a capacidade de usuário proxy (ou seja, plugins que podem retornar um nome de usuário diferente do do usuário que está se conectando). Por exemplo, os plugins PAM e Windows suportam usuários proxy. Os plugins de autenticação `mysql_native_password` e `sha256_password` não suportam usuários proxy por padrão, mas podem ser configurados para isso; consulte Suporte do servidor para mapeamento de usuários proxy.

* **Replicação**: As réplicas não podem apenas utilizar contas de usuário de replicação usando autenticação nativa, mas também podem se conectar através de contas de usuário de replicação que utilizam autenticação não nativa, se o plugin necessário do lado do cliente estiver disponível. Se o plugin estiver integrado ao `libmysqlclient`, ele está disponível por padrão. Caso contrário, o plugin deve ser instalado no lado da réplica no diretório nomeado pela variável de sistema `plugin_dir` da réplica.

* **Tabelas `FEDERATED`:** Uma tabela `FEDERATED` pode acessar a tabela remota apenas por meio de contas no servidor remoto que utilizem autenticação nativa.

##### Autenticação Conectada e Conectores de Terceiros

Os desenvolvedores de conectores de terceiros podem usar as seguintes diretrizes para determinar a prontidão de um conector para aproveitar as capacidades de autenticação plugável e quais passos devem ser tomados para se tornar mais compatível:

* Um conector existente que não recebeu alterações utiliza autenticação nativa e os clientes que utilizam o conector podem se conectar ao servidor apenas através de contas que utilizam autenticação nativa. * No entanto, você deve testar o conector contra uma versão recente do servidor para verificar se essas conexões ainda funcionam sem problemas.

Exceção: Um conector pode funcionar com autenticação plugável sem quaisquer alterações se ele se conectar dinamicamente a `libmysqlclient` (em vez de estaticamente) e carrega a versão atual de `libmysqlclient` se essa versão estiver instalada.

* Para aproveitar as capacidades de autenticação plugáveis, um conector baseado em `libmysqlclient` deve ser relinkado contra a versão atual de `libmysqlclient`. Isso permite que o conector suporte conexões através de contas que agora exigem plugins do lado do cliente construídos em `libmysqlclient` (como o plugin em texto claro necessário para autenticação PAM e o plugin do Windows necessário para autenticação nativa do Windows). A ligação com um `libmysqlclient` atual também permite que o conector acesse plugins do lado do cliente instalados no diretório padrão do plugin MySQL (tipicamente o diretório nomeado pelo valor padrão da variável de sistema `plugin_dir` do servidor local).

Se um conector estiver vinculado dinamicamente a `libmysqlclient`, é necessário garantir que a versão mais recente de `libmysqlclient` esteja instalada no host do cliente e que o conector a carregue no momento da execução.

* Outra maneira de um conector suportar um método de autenticação específico é implementá-lo diretamente no protocolo cliente/servidor. O Connector/NET utiliza essa abordagem para fornecer suporte à autenticação nativa do Windows.

* Se um conector deve ser capaz de carregar plugins do lado do cliente a partir de um diretório diferente do diretório padrão de plugins, ele deve implementar algum meio para que os usuários do cliente especifiquem o diretório. As possibilidades para isso incluem uma opção de linha de comando ou uma variável de ambiente a partir da qual o conector pode obter o nome do diretório. Programas padrão de clientes MySQL, como **mysql** e **mysqladmin**, implementam uma opção `--plugin-dir`. Veja também a Interface de Plugin de Cliente API C.

* O suporte de usuários proxy por um conector depende, conforme descrito anteriormente nesta seção, se os métodos de autenticação que ele suporta permitem usuários proxy.

### 8.2.18 Autenticação Multifatorial

A autenticação envolve uma parte estabelecendo sua identidade para satisfação de uma segunda parte. A autenticação multifatorial (MFA) é o uso de múltiplos valores de autenticação (ou “fatores”) durante o processo de autenticação. A MFA oferece maior segurança do que a autenticação de um fator/único (1FA/SFA), que utiliza apenas um método de autenticação, como uma senha. A MFA permite métodos de autenticação adicionais, como autenticação usando múltiplas senhas, ou autenticação usando dispositivos como cartões inteligentes, chaves de segurança e leitores biométricos.

O MySQL 8.0.27 e versões posteriores incluem suporte para autenticação multifatorial. Essa capacidade inclui formas de autenticação MFA que exigem até três valores de autenticação. Ou seja, o gerenciamento de contas do MySQL suporta contas que utilizam 2FA ou 3FA, além do suporte existente para 1FA.

Quando um cliente tenta uma conexão com o servidor MySQL usando uma conta de um único fator, o servidor invoca o plugin de autenticação indicado pela definição da conta e aceita ou rejeita a conexão, dependendo se o plugin reporta sucesso ou falha.

Para uma conta que tem vários fatores de autenticação, o processo é semelhante. O servidor invoca plugins de autenticação na ordem listada na definição da conta. Se um plugin relatar sucesso, o servidor aceita a conexão se o plugin for o último, ou prossegue para invocar o próximo plugin se houver algum restante. Se algum plugin relatar falha, o servidor rejeita a conexão.

As seções a seguir abordam a autenticação multifatorial no MySQL com mais detalhes.

* Elementos de Suporte à Autenticação Multifatorial * Configurando a Política de Autenticação Multifatorial * Começando com a Autenticação Multifatorial

#### Elementos de Suporte à Autenticação Multifatorial

Os fatores de autenticação geralmente incluem esses tipos de informações:

* Algo que você conhece, como uma senha secreta ou frase de senha.  
* Algo que você tem, como uma chave de segurança ou cartão inteligente.  
* Algo que você é; ou seja, uma característica biométrica, como uma impressão digital ou uma varredura facial.

O tipo de fator "algo que você sabe" depende de informações que são mantidas em segredo em ambos os lados do processo de autenticação. Infelizmente, os segredos podem ser comprometidos: alguém pode ver você digitar sua senha ou enganá-lo com um ataque de phishing, uma senha armazenada no lado do servidor pode ser exposta por uma violação de segurança, e assim por diante. A segurança pode ser melhorada usando múltiplas senhas, mas cada uma ainda pode ser comprometida. O uso dos outros tipos de fatores permite uma segurança melhorada com menos risco de comprometimento.

A implementação da autenticação multifatorial no MySQL compreende esses elementos:

* A variável de sistema `authentication_policy` controla quantos fatores de autenticação podem ser utilizados e os tipos de autenticação permitidos para cada fator. Isso significa que ela estabelece restrições para as declarações `CREATE USER` e `ALTER USER` em relação à autenticação multifatorial.

* `CREATE USER` e `ALTER USER` têm sintaxe que permite especificar vários métodos de autenticação para novas contas e para adicionar, modificar ou remover métodos de autenticação para contas existentes. Se uma conta usa 2FA ou 3FA, a tabela do sistema `mysql.user` armazena informações sobre os fatores de autenticação adicionais na coluna `User_attributes`.

* Para habilitar a autenticação no servidor MySQL usando contas que exigem múltiplas senhas, os programas cliente têm as opções `--password1`, `--password2` e `--password3` que permitem especificar até três senhas. Para aplicativos que usam a API C, a opção `MYSQL_OPT_USER_PASSWORD` para a função C API `mysql_options4()` habilita a mesma capacidade.

* O plugin `authentication_fido` do lado do servidor (desatualizado) permite autenticação usando dispositivos. Este plugin de autenticação FIDO do lado do servidor é incluído apenas nas distribuições da MySQL Enterprise Edition. Não é incluído nas distribuições da comunidade MySQL. No entanto, o plugin `authentication_fido_client` do lado do cliente (desatualizado) é incluído em todas as distribuições, incluindo as distribuições da comunidade. Isso permite que clientes de qualquer distribuição se conectem a contas que usam `authentication_fido` para autenticação em um servidor que tenha esse plugin carregado. Veja a Seção 8.4.1.11, “Autenticação FIDO Plugável”.

* `authentication_fido` também permite autenticação sem senha, se for o único plugin de autenticação usado por uma conta. Veja Autenticação sem senha FIDO.

* A autenticação multifatorial pode usar métodos de autenticação não FIDO MySQL, o método de autenticação FIDO ou uma combinação de ambos.

* Esses privilégios permitem que os usuários realizem certas operações relacionadas a autenticação multifatorial restrita:

+ Um usuário que possui o privilégio `AUTHENTICATION_POLICY_ADMIN` não está sujeito às restrições impostas pela variável de sistema `authentication_policy`. (Um aviso ocorre para declarações que, de outra forma, não seriam permitidas.)

+ O privilégio `PASSWORDLESS_USER_ADMIN` permite a criação de contas de autenticação sem senha e a replicação de operações nelas.

#### Configurando a Política de Autenticação Multifator

A variável de sistema `authentication_policy` define a política de autenticação multifatorial. Especificamente, define quantos fatores de autenticação as contas podem ter (ou são obrigadas a ter) e os métodos de autenticação que podem ser usados para cada fator.

O valor de `authentication_policy` é uma lista de 1, 2 ou 3 elementos separados por vírgula. Cada elemento na lista corresponde a um fator de autenticação e pode ser o nome de um plugin de autenticação, um asterisco (`*`), vazio ou ausente. (Exceção: o elemento 1 não pode ser vazio ou ausente.) A lista inteira é fechada entre aspas. Por exemplo, o seguinte valor de `authentication_policy` inclui um asterisco, um nome de plugin de autenticação e um elemento vazio:

```
authentication_policy = '*,authentication_fido,'
```

Um asterisco (`*`) indica que um método de autenticação é necessário, mas qualquer método é permitido. Um elemento vazio indica que um método de autenticação é opcional e qualquer método é permitido. Um elemento ausente (sem asterisco, elemento vazio ou nome do plugin de autenticação) indica que um método de autenticação não é permitido. Quando um nome de plugin é especificado, esse método de autenticação é necessário para o respectivo fator ao criar ou modificar uma conta.

O valor padrão `authentication_policy` é `'*,,'` (um asterisco e dois elementos vazios), que requer um primeiro fator, e, opcionalmente, permite o segundo e terceiro fatores. O valor padrão `authentication_policy` é, portanto, compatível com os existentes 1FA contas, mas também permite a criação ou modificação de contas para usar 2FA ou 3FA.

Um usuário que possui o privilégio `AUTHENTICATION_POLICY_ADMIN` não está sujeito às restrições impostas pelo ajuste `authentication_policy`. (Um aviso ocorre para declarações que, de outra forma, não seriam permitidas.)

Os valores do `authentication_policy` podem ser definidos em um arquivo de opções ou especificados usando uma declaração `SET GLOBAL`(set-variable.html "15.7.6.1 SET Syntax for Variable Assignment"):

```
SET GLOBAL authentication_policy='*,*,';
```

Existem várias regras que regem a forma como o valor do `authentication_policy` pode ser definido. Consulte a descrição da variável de sistema `authentication_policy` para uma descrição completa dessas regras. O seguinte quadro fornece vários valores de exemplo do `authentication_policy` e a política estabelecida por cada um.

**Tabela 8.11 Exemplos de valores da política de autenticação**

<table summary="Example authentication_policy values and their meanings."><col style="width: 50%"/><col style="width: 50"/><thead><tr> <th>authentication_policy Value</th> <th>Política eficaz</th> </tr></thead><tbody><tr> <td><code>'*'</code></td> <td>Permita apenas a criação ou alteração de contas com um fator.</td> </tr><tr> <td><code>'*,*'</code></td> <td>Permita apenas a criação ou alteração de contas com dois fatores.</td> </tr><tr> <td><code>'*,*,*'</code></td> <td>Permita apenas a criação ou alteração de contas com três fatores.</td> </tr><tr> <td><code>'*,'</code></td> <td>Permita a criação ou alteração de contas com um ou dois fatores.</td> </tr><tr> <td><code>'*,,'</code></td> <td>Permite a criação ou alteração de contas com um, dois ou três fatores.</td> </tr><tr> <td><code>'*,*,'</code></td> <td>Permita a criação ou alteração de contas com dois ou três fatores.</td> </tr><tr> <td><code>'*,<em class="replaceable"><code>auth_plugin</code></em>'</code></td> <td>Permita a criação ou alteração de contas com dois fatores, onde o primeiro fator pode ser qualquer método de autenticação, e o segundo fator deve ser o plugin nomeado.</td> </tr><tr> <td><code>'<em class="replaceable"><code>auth_plugin</code></em>,*,'</code></td> <td>Permita a criação ou alteração de contas com dois ou três fatores, onde o primeiro fator deve ser o plugin nomeado.</td> </tr><tr> <td><code>'<em class="replaceable"><code>auth_plugin</code></em>,'</code></td> <td>Permita a criação ou alteração de contas com um ou dois fatores, onde o primeiro fator deve ser o plugin nomeado.</td> </tr><tr> <td><code>'<em class="replaceable"><code>auth_plugin</code></em>,<em class="replaceable"><code>auth_plugin</code></em>,<em class="replaceable"><code>auth_plugin</code></em>'</code></td> <td>Permite criar ou alterar contas com três fatores, onde os fatores devem usar os plugins mencionados.</td> </tr></tbody></table>

#### Começando com Autenticação Multifatorial

Por padrão, o MySQL utiliza uma política de autenticação multifatorial que permite qualquer plugin de autenticação para o primeiro fator e, opcionalmente, permite o segundo e o terceiro fatores de autenticação. Essa política é configurável; para detalhes, consulte Configurando a Política de Autenticação Multifatorial.

Nota

Não é permitido utilizar quaisquer plugins de armazenamento de credenciais internas (`caching_sha2_password` ou `mysql_native_password`) para o fator 2 ou 3.

Suponha que você queira uma conta para se autenticar primeiro usando o plugin `caching_sha2_password`, depois usando o plugin SASL LDAP `authentication_ldap_sasl`. (Isso pressupõe que a autenticação LDAP já esteja configurada conforme descrito na Seção 8.4.1.7, “Autenticação Conectada”, e que o usuário tenha uma entrada no diretório LDAP correspondente à string de autenticação mostrada no exemplo.) Crie a conta usando uma declaração como esta:

```
CREATE USER 'alice'@'localhost'
  IDENTIFIED WITH caching_sha2_password
    BY 'sha2_password'
  AND IDENTIFIED WITH authentication_ldap_sasl
    AS 'uid=u1_ldap,ou=People,dc=example,dc=com';
```

Para se conectar, o usuário deve fornecer duas senhas. Para habilitar a autenticação no servidor MySQL usando contas que exigem múltiplas senhas, os programas cliente têm as opções `--password1`, `--password2` e `--password3` que permitem especificar até três senhas. Essas opções são semelhantes à opção `--password`, pois podem receber um valor de senha seguindo a opção na linha de comando (o que é inseguro) ou se fornecida sem um valor de senha, fazendo com que o usuário seja solicitado uma senha. Para a conta recém-criada, os fatores 1 e 2 exigem senhas, então invoque o cliente **mysql** com as opções `--password1` e `--password2`. O **mysql** solicita cada senha em ordem:

```
$> mysql --user=alice --password1 --password2
Enter password: (enter factor 1 password)
Enter password: (enter factor 2 password)
```

Suponha que você queira adicionar um terceiro fator de autenticação. Isso pode ser feito eliminando e recriando o usuário com um terceiro fator ou usando a sintaxe `ALTER USER user ADD factor` (alter-user.html "15.7.1.1 ALTER USER Statement"). Ambos os métodos são mostrados abaixo:

```
DROP USER 'alice'@'localhost';

CREATE USER 'alice'@'localhost'
  IDENTIFIED WITH caching_sha2_password
    BY 'sha2_password'
  AND IDENTIFIED WITH authentication_ldap_sasl
    AS 'uid=u1_ldap,ou=People,dc=example,dc=com'
  AND IDENTIFIED WITH authentication_fido;
```

A sintaxe do `ADD factor` inclui o número do fator e a palavra-chave `FACTOR`:

```
ALTER USER 'alice'@'localhost' ADD 3 FACTOR IDENTIFIED WITH authentication_fido;
```

A sintaxe do `ALTER USER user DROP factor` permite a eliminação de um fator. O exemplo a seguir elimina o terceiro fator (`authentication_fido`) que foi adicionado no exemplo anterior:

```
ALTER USER 'alice'@'localhost' DROP 3 FACTOR;
```

A sintaxe `ALTER USER user MODIFY factor` permite alterar o plugin ou a string de autenticação para um fator específico, desde que o fator exista. O exemplo a seguir modifica o segundo fator, alterando o método de autenticação de `authentication_ldap_sasl` para `authetication_fido`:

```
ALTER USER 'alice'@'localhost' MODIFY 2 FACTOR IDENTIFIED WITH authentication_fido;
```

Use `SHOW CREATE USER` para visualizar os métodos de autenticação definidos para uma conta:

```
SHOW CREATE USER 'u1'@'localhost'\G
*************************** 1. row ***************************
CREATE USER for u1@localhost: CREATE USER `u1`@`localhost`
IDENTIFIED WITH 'caching_sha2_password' AS 'sha2_password'
AND IDENTIFIED WITH 'authentication_fido' REQUIRE NONE
PASSWORD EXPIRE DEFAULT ACCOUNT UNLOCK PASSWORD HISTORY
DEFAULT PASSWORD REUSE INTERVAL DEFAULT PASSWORD REQUIRE
CURRENT DEFAULT
```

### 8.2.19 Usuários de Proxy

O servidor MySQL autentica as conexões dos clientes usando plugins de autenticação. O plugin que autentica uma conexão específica pode solicitar que o usuário que está se conectando (externo) seja tratado como um usuário diferente para fins de verificação de privilégios. Isso permite que o usuário externo seja um proxy para o segundo usuário; ou seja, assuma os privilégios do segundo usuário:

* O usuário externo é um "usuário proxy" (um usuário que pode se passar por outro usuário ou se tornar conhecido como outro usuário).

* O segundo usuário é um "usuário proxy" (um usuário cuja identidade e privilégios podem ser assumidos por um usuário proxy).

Esta seção descreve como a capacidade de usuário proxy funciona. Para informações gerais sobre plugins de autenticação, consulte a Seção 8.2.17, “Autenticação Conectada”. Para informações sobre plugins específicos, consulte a Seção 8.4.1, “Plugins de Autenticação”. Para informações sobre a escrita de plugins de autenticação que suportam usuários proxy, consulte Implementando Suporte ao Usuário Proxy em Plugins de Autenticação.

* Requisitos para Suporte ao Usuário Proxy
* Exemplo Simples de Usuário Proxy
* Prevenindo Login Direto em Contas Proxy
* Concedendo e Revoando o Privilegio de PROXY
* Usuários de Proxy Padrão
* Conflitos entre Usuários de Proxy Padrão e Usuário Anônimo
* Suporte do Servidor para Mapeamento de Usuário Proxy
* Variáveis do Sistema de Usuário Proxy

Nota

Um benefício administrativo que pode ser obtido com a intermediação é que o DBA pode configurar uma única conta com um conjunto de privilégios e, em seguida, habilitar vários usuários de proxy a ter esses privilégios sem precisar atribuir os privilégios individualmente a cada um desses usuários. Como alternativa aos usuários de proxy, os DBAs podem descobrir que os papéis fornecem uma maneira adequada de mapear os usuários em conjuntos específicos de privilégios nomeados. Cada usuário pode ser concedido um determinado papel único, que, na verdade, concede o conjunto apropriado de privilégios. Veja a Seção 8.2.10, “Usando Papéis”.

#### Requisitos para Suporte ao Usuário Proxy

Para que a proxy ocorra para um plugin de autenticação específico, essas condições devem ser satisfeitas:

* O proxy deve ser suportado, seja pelo próprio plugin, seja pelo servidor MySQL em nome do plugin. Neste último caso, o suporte do servidor pode precisar ser habilitado explicitamente; consulte Suporte ao servidor para mapeamento de usuários proxy.

* A conta do usuário do proxy externo deve ser configurada para ser autenticada pelo plugin. Use a declaração `CREATE USER` para associar uma conta a um plugin de autenticação, ou `ALTER USER` para alterá-lo.

* A conta do usuário proxy deve existir e ter os privilégios que serão assumidos pelo usuário proxy. Use as declarações `CREATE USER` e `GRANT` para isso.

Normalmente, o usuário proxy é configurado para que ele possa ser usado apenas em cenários de proxy e não para logins diretos.

* A conta de usuário proxy deve ter o privilégio `PROXY` para a conta proxy. Use a declaração `GRANT` para isso.

* Para que um cliente conectado à conta do proxy seja tratado como um usuário do proxy, o plugin de autenticação deve retornar um nome de usuário diferente do nome do usuário do cliente, para indicar o nome de usuário da conta proxy que define os privilégios a serem assumidos pelo usuário do proxy.

Alternativamente, para plugins que são fornecidos com mapeamento proxy pelo servidor, o usuário proxy é determinado a partir do privilégio `PROXY` mantido pelo usuário proxy.

O mecanismo de proxy permite mapear apenas o nome do usuário do cliente externo para o nome do usuário proxy. Não há disposição para mapear nomes de host:

* Quando um cliente se conecta ao servidor, o servidor determina a conta correta com base no nome do usuário passado pelo programa do cliente e no host a partir do qual o cliente se conecta.

* Se essa conta for uma conta proxy, o servidor tenta determinar a conta apropriada proxy, encontrando uma correspondência para uma conta proxy usando o nome de usuário retornado pelo plugin de autenticação e o nome do host da conta proxy. O nome do host na conta proxy é ignorado.

#### Exemplo de Usuário de Proxy Simples

Considere as seguintes definições de contas:

```
-- create proxy account
CREATE USER 'employee_ext'@'localhost'
  IDENTIFIED WITH my_auth_plugin
  AS 'my_auth_string';

-- create proxied account and grant its privileges;
-- use mysql_no_login plugin to prevent direct login
CREATE USER 'employee'@'localhost'
  IDENTIFIED WITH mysql_no_login;
GRANT ALL
  ON employees.*
  TO 'employee'@'localhost';

-- grant to proxy account the
-- PROXY privilege for proxied account
GRANT PROXY
  ON 'employee'@'localhost'
  TO 'employee_ext'@'localhost';
```

Quando um cliente se conecta como `employee_ext` do host local, o MySQL usa o plugin denominado `my_auth_plugin` para realizar a autenticação. Suponha que `my_auth_plugin` retorne um nome de usuário de `employee` ao servidor, com base no conteúdo de `'my_auth_string'` e, possivelmente, consultando algum sistema de autenticação externo. O nome `employee` difere de `employee_ext`, então retornar `employee` serve como um pedido ao servidor para tratar o usuário externo `employee_ext`, para fins de verificação de privilégios, como o usuário local `employee`.

Neste caso, `employee_ext` é o usuário proxy e `employee` é o usuário proxy.

O servidor verifica se a autenticação de proxy para `employee` é possível para o usuário `employee_ext` verificando se `employee_ext` (o usuário proxy) tem o privilégio `PROXY` para `employee` (o usuário proxy). Se este privilégio não tiver sido concedido, ocorre um erro. Caso contrário, `employee_ext` assume os privilégios de `employee`. O servidor verifica as declarações executadas durante a sessão do cliente por `employee_ext` contra os privilégios concedidos a `employee`. Neste caso, `employee_ext` pode acessar tabelas no banco de dados `employees`.

A conta proxy, `employee`, utiliza o plugin de autenticação `mysql_no_login` para impedir que os clientes usem a conta para fazer login diretamente. (Isso pressupõe que o plugin esteja instalado. Para instruções, consulte a Seção 8.4.1.9, “Autenticação Plugável sem Login”.) Para métodos alternativos de proteção de contas proxy contra uso direto, consulte Prevenindo Login Direto em Contas Proxy.

Quando ocorre o proxeamento, as funções `USER()` e `CURRENT_USER()` podem ser usadas para ver a diferença entre o usuário conectando-se (o usuário proxy) e a conta cujos privilégios se aplicam durante a sessão atual (o usuário proxeado). Para o exemplo que foi descrito, essas funções retornam esses valores:

```
mysql> SELECT USER(), CURRENT_USER();
+------------------------+--------------------+
| USER()                 | CURRENT_USER()     |
+------------------------+--------------------+
| employee_ext@localhost | employee@localhost |
+------------------------+--------------------+
```

Na declaração `CREATE USER` que cria a conta de usuário proxy, a cláusula `IDENTIFIED WITH` que nomeia o plugin de autenticação de suporte a proxy é opcionalmente seguida por uma cláusula `AS 'auth_string'` que especifica uma string que o servidor passa para o plugin quando o usuário se conecta. Se presente, a string fornece informações que ajudam o plugin a determinar como mapear o nome do usuário do cliente (externo) do proxy para um nome de usuário proxy. Cabe a cada plugin determinar se a cláusula `AS` é necessária. Se sim, o formato da string de autenticação depende de como o plugin pretende usá-la. Consulte a documentação de um plugin específico para obter informações sobre os valores da string de autenticação que ele aceita.

#### Prevenindo o Login Direto em Contas Proxy

As contas proxy são geralmente destinadas a serem usadas apenas por meio de contas proxy. Ou seja, os clientes se conectam usando uma conta proxy, e então são mapeados e assumem os privilégios do usuário apropriado proxy.

Existem várias maneiras de garantir que uma conta proxy não possa ser usada diretamente:

* Associe a conta ao plugin de autenticação `mysql_no_login`. Nesse caso, a conta não pode ser usada para logins diretos em nenhuma circunstância. Isso pressupõe que o plugin esteja instalado. Para instruções, consulte a Seção 8.4.1.9, “Autenticação Plugável sem Login”.

* Inclua a opção `ACCOUNT LOCK` ao criar a conta. Veja a Seção 15.7.1.3, “Declaração CREATE USER”. Com este método, inclua também uma senha para que, se a conta for desbloqueada posteriormente, não possa ser acessada sem senha. (Se o componente `validate_password` estiver habilitado, não é permitido criar uma conta sem senha, mesmo que a conta esteja bloqueada. Veja a Seção 8.4.3, “O Componente de Validação de Senha”.)

* Crie a conta com uma senha, mas não diga a ninguém a senha. Se você não deixar ninguém saber a senha da conta, os clientes não poderão usá-la para se conectar diretamente ao servidor MySQL.

#### Concedendo e Revogando o Privilegio de PROXY

O privilégio `PROXY` é necessário para permitir que um usuário externo se conecte e tenha os privilégios de outro usuário. Para conceder este privilégio, use a declaração `GRANT`. Por exemplo:

```
GRANT PROXY ON 'proxied_user' TO 'proxy_user';
```

A declaração cria uma linha na tabela de concessão `mysql.proxies_priv`.

No momento da conexão, *`proxy_user`* deve representar um usuário válido autenticado externamente no MySQL, e *`proxied_user`* deve representar um usuário válido autenticado localmente. Caso contrário, a tentativa de conexão falha.

A sintaxe correspondente ao `REVOKE` é:

```
REVOKE PROXY ON 'proxied_user' FROM 'proxy_user';
```

As extensões de sintaxe MySQL `GRANT` e `REVOKE` funcionam como de costume. Exemplos:

```
-- grant PROXY to multiple accounts
GRANT PROXY ON 'a' TO 'b', 'c', 'd';

-- revoke PROXY from multiple accounts
REVOKE PROXY ON 'a' FROM 'b', 'c', 'd';

-- grant PROXY to an account and enable the account to grant
-- PROXY to the proxied account
GRANT PROXY ON 'a' TO 'd' WITH GRANT OPTION;

-- grant PROXY to default proxy account
GRANT PROXY ON 'a' TO ''@'';
```

O privilégio `PROXY` pode ser concedido nestes casos:

* Por um usuário que tem `GRANT PROXY ... WITH GRANT OPTION` para *`proxied_user`*.

* Por *`proxied_user`* para si mesmo: O valor de `USER()` deve corresponder exatamente a `CURRENT_USER()` e *`proxied_user`*, tanto para as partes do nome de usuário quanto para as partes do nome do host do nome da conta.

A conta inicial `root` criada durante a instalação do MySQL tem o privilégio `PROXY ... WITH GRANT OPTION`(privileges-provided.html#priv_proxy) para `''@''`, ou seja, para todos os usuários e todos os hosts. Isso permite que `root` configure usuários proxy, bem como delegar a outras contas a autoridade para configurar usuários proxy. Por exemplo, `root` pode fazer isso:

```
CREATE USER 'admin'@'localhost'
  IDENTIFIED BY 'admin_password';
GRANT PROXY
  ON ''@''
  TO 'admin'@'localhost'
  WITH GRANT OPTION;
```

Essas declarações criam um usuário `admin` que pode gerenciar todas as mapeamentos `GRANT PROXY`. Por exemplo, `admin` pode fazer isso:

```
GRANT PROXY ON sally TO joe;
```

#### Usuários de Proxy Padrão

Para especificar que alguns ou todos os usuários devem se conectar usando um plugin de autenticação dado, crie uma conta "branca" no MySQL com um nome de usuário e nome de host vazios (`''@''`), associe-a a esse plugin e deixe o plugin retornar o nome real do usuário autenticado (se diferente do usuário branco). Suponha que exista um plugin chamado `ldap_auth` que implementa autenticação LDAP e mapeia os usuários conectados em uma conta de desenvolvedor ou gerente. Para configurar o redirecionamento dos usuários para essas contas, use as seguintes declarações:

```
-- create default proxy account
CREATE USER ''@''
  IDENTIFIED WITH ldap_auth
  AS 'O=Oracle, OU=MySQL';

-- create proxied accounts; use
-- mysql_no_login plugin to prevent direct login
CREATE USER 'developer'@'localhost'
  IDENTIFIED WITH mysql_no_login;
CREATE USER 'manager'@'localhost'
  IDENTIFIED WITH mysql_no_login;

-- grant to default proxy account the
-- PROXY privilege for proxied accounts
GRANT PROXY
  ON 'manager'@'localhost'
  TO ''@'';
GRANT PROXY
  ON 'developer'@'localhost'
  TO ''@'';
```

Agora, suponha que um cliente se conecte da seguinte forma:

```
$> mysql --user=myuser --password ...
Enter password: myuser_password
```

O servidor não encontra `myuser` definido como um usuário MySQL, mas, como há uma conta de usuário em branco (`''@''`) que corresponde ao nome do usuário e ao nome do host do cliente, o servidor autentica o cliente contra essa conta. O servidor invoca o plugin de autenticação `ldap_auth` e passa `myuser` e *`myuser_password`* como o nome do usuário e a senha.

Se o plugin `ldap_auth` encontrar no diretório LDAP que *`myuser_password`* não é a senha correta para `myuser`, a autenticação falha e o servidor rejeita a conexão.

Se a senha estiver correta e `ldap_auth` verificar que `myuser` é um desenvolvedor, ele retorna o nome do usuário `developer` ao servidor MySQL, em vez de `myuser`. Retornar um nome de usuário diferente do nome do usuário do cliente de `myuser` sinaliza para o servidor que ele deve tratar `myuser` como um proxy. O servidor verifica que `''@''` pode autenticar como `developer` (porque `''@''` tem o privilégio `PROXY` para fazer isso) e aceita a conexão. A sessão prossegue com `myuser` tendo os privilégios do usuário proxy `developer` (estes privilégios devem ser configurados pelo DBA usando declarações `GRANT`, não mostradas). As funções `USER()` e `CURRENT_USER()` retornam esses valores:

```
mysql> SELECT USER(), CURRENT_USER();
+------------------+---------------------+
| USER()           | CURRENT_USER()      |
+------------------+---------------------+
| myuser@localhost | developer@localhost |
+------------------+---------------------+
```

Se o plugin, em vez disso, encontrar no diretório LDAP que `myuser` é um gerente, ele retorna `manager` como o nome do usuário e a sessão prossegue com `myuser`, que possui os privilégios do usuário proxy `manager`.

```
mysql> SELECT USER(), CURRENT_USER();
+------------------+-------------------+
| USER()           | CURRENT_USER()    |
+------------------+-------------------+
| myuser@localhost | manager@localhost |
+------------------+-------------------+
```

Por simplicidade, a autenticação externa não pode ser múltipla: nem as credenciais para `developer` nem as para `manager` são consideradas no exemplo anterior. No entanto, elas ainda são usadas se um cliente tentar se conectar e autenticar diretamente como a conta `developer` ou `manager`, e é por isso que essas contas proxy devem ser protegidas contra login direto (veja Prevenindo login direto em contas proxy).

#### Conflitos entre o Usuário Proxy Padrão e o Usuário Anônimo

Se você pretende criar um usuário proxy padrão, verifique se há outras contas existentes que "se encaixam em qualquer usuário" e que têm precedência sobre o usuário proxy padrão, porque elas podem impedir que o usuário trabalhe conforme o esperado.

Na discussão anterior, a conta de usuário de proxy padrão tem `''` na parte do host, que corresponde a qualquer host. Se você configurar uma conta de usuário de proxy, certifique-se também de verificar se existem contas sem proxy com a mesma parte do usuário e `'%'` na parte do host, porque `'%'` também corresponde a qualquer host, mas tem precedência sobre `''` pelas regras que o servidor usa para ordenar as linhas de conta internamente (consulte Seção 8.2.6, “Controle de Acesso, Etapa 1: Verificação de Conexão”).

Suponha que uma instalação do MySQL inclua esses dois perfis:

```
-- create default proxy account
CREATE USER ''@''
  IDENTIFIED WITH some_plugin
  AS 'some_auth_string';
-- create anonymous account
CREATE USER ''@'%'
  IDENTIFIED BY 'anon_user_password';
```

A primeira conta (`''@''`) é destinada como o usuário proxy padrão, usado para autenticar conexões para usuários que, de outra forma, não correspondem a uma conta mais específica. A segunda conta (`''@'%'`) é uma conta de usuário anônimo, que pode ter sido criada, por exemplo, para permitir que usuários sem sua própria conta se conectem anonimamente.

Ambas as contas têm a mesma parte de usuário (`''`), que corresponde a qualquer usuário. E cada conta tem uma parte de host que corresponde a qualquer host. No entanto, há uma prioridade na correspondência de contas para tentativas de conexão, porque as regras de correspondência classificam um host de `'%'` à frente de `''`. Para contas que não correspondem a nenhuma conta mais específica, o servidor tenta autenticá-las contra `''@'%'` (o usuário anônimo) em vez de `''@''` (o usuário proxy padrão). Como resultado, a conta do proxy padrão nunca é usada.

Para evitar esse problema, use uma das seguintes estratégias:

* Remova a conta anônima para que ela não conflita com o usuário do proxy padrão.

* Use um usuário proxy padrão mais específico que corresponda àquele que vem antes do usuário anônimo. Por exemplo, para permitir apenas conexões de proxy do `localhost`, use `''@'localhost'`:

  ```
  CREATE USER ''@'localhost'
    IDENTIFIED WITH some_plugin
    AS 'some_auth_string';
  ```

Além disso, modifique quaisquer declarações de `GRANT PROXY` para nomear `''@'localhost'` em vez de `''@''` como o usuário proxy.

Tenha em atenção que esta estratégia impede as conexões de utilizadores anónimos de `localhost`.

* Use uma conta padrão nomeada em vez de uma conta padrão anônima. Para um exemplo dessa técnica, consulte as instruções para usar o plugin `authentication_windows`. Veja a Seção 8.4.1.6, “Autenticação Plugável do Windows”.

* Crie vários usuários proxy, um para conexões locais e outro para "tudo o resto" (conexões remotas). Isso pode ser útil, especialmente quando os usuários locais devem ter privilégios diferentes dos usuários remotos.

Crie os usuários proxy:

  ```
  -- create proxy user for local connections
  CREATE USER ''@'localhost'
    IDENTIFIED WITH some_plugin
    AS 'some_auth_string';
  -- create proxy user for remote connections
  CREATE USER ''@'%'
    IDENTIFIED WITH some_plugin
    AS 'some_auth_string';
  ```

Crie os usuários proxy:

  ```
  -- create proxied user for local connections
  CREATE USER 'developer'@'localhost'
    IDENTIFIED WITH mysql_no_login;
  -- create proxied user for remote connections
  CREATE USER 'developer'@'%'
    IDENTIFIED WITH mysql_no_login;
  ```

Concede ao respectivo endereço proxy a `PROXY` privilégio para a conta proxy correspondente:

  ```
  GRANT PROXY
    ON 'developer'@'localhost'
    TO ''@'localhost';
  GRANT PROXY
    ON 'developer'@'%'
    TO ''@'%';
  ```

Por fim, conceda privilégios apropriados aos usuários proxied local e remoto (não mostrados).

Suponha que a combinação `some_plugin`/`'some_auth_string'` faça com que o nome do usuário do cliente seja mapeado para `developer`. As conexões locais correspondem ao usuário do proxy `''@'localhost'`, que é mapeado para o usuário proxeado `'developer'@'localhost'`. As conexões remotas correspondem ao usuário do proxy `''@'%'`, que é mapeado para o usuário proxeado `'developer'@'%'`.

#### Suporte do servidor para mapeamento de usuários proxy

Alguns plugins de autenticação implementam mapeamento de usuários proxy para si mesmos (por exemplo, os plugins de autenticação PAM e Windows). Outros plugins de autenticação não suportam usuários proxy por padrão. Desses, alguns podem solicitar que o próprio servidor MySQL mapeie usuários proxy de acordo com os privilégios de proxy concedidos: `mysql_native_password`, `sha256_password`. Se a variável de sistema `check_proxy_users` estiver habilitada, o servidor realiza o mapeamento de usuários proxy para quaisquer plugins de autenticação que façam tal solicitação:

* Por padrão, `check_proxy_users` está desativado, portanto, o servidor não realiza mapeamento de usuários proxy, mesmo para plugins de autenticação que solicitam suporte do servidor para usuários proxy.

* Se o `check_proxy_users` estiver habilitado, também pode ser necessário habilitar uma variável de sistema específica do plugin para aproveitar o suporte de mapeamento de usuários do proxy do servidor:

+ Para o plugin `mysql_native_password`, habilite `mysql_native_password_proxy_users`.

+ Para o plugin `sha256_password`, habilite `sha256_password_proxy_users`.

Por exemplo, para habilitar todas as capacidades anteriores, inicie o servidor com essas linhas no arquivo `my.cnf`:

```
[mysqld]
check_proxy_users=ON
mysql_native_password_proxy_users=ON
sha256_password_proxy_users=ON
```

Supondo que as variáveis do sistema relevantes tenham sido habilitadas, crie o usuário proxy como de costume usando `CREATE USER`(create-user.html "15.7.1.3 CREATE USER Statement"), em seguida, conceda-lhe o privilégio `PROXY` a uma única outra conta que será tratada como o usuário proxy. Quando o servidor recebe um pedido de conexão bem-sucedido para o usuário proxy, ele descobre que o usuário tem o privilégio `PROXY` e usa-o para determinar o usuário proxy apropriado.

```
-- create proxy account
CREATE USER 'proxy_user'@'localhost'
  IDENTIFIED WITH mysql_native_password
  BY 'password';

-- create proxied account and grant its privileges;
-- use mysql_no_login plugin to prevent direct login
CREATE USER 'proxied_user'@'localhost'
  IDENTIFIED WITH mysql_no_login;
-- grant privileges to proxied account
GRANT ...
  ON ...
  TO 'proxied_user'@'localhost';

-- grant to proxy account the
-- PROXY privilege for proxied account
GRANT PROXY
  ON 'proxied_user'@'localhost'
  TO 'proxy_user'@'localhost';
```

Para usar a conta proxy, conecte-se ao servidor usando seu nome e senha:

```
$> mysql -u proxy_user -p
Enter password: (enter proxy_user password here)
```

A autenticação é bem-sucedida, o servidor descobre que `proxy_user` tem o privilégio `PROXY` para `proxied_user`, e a sessão prossegue com `proxy_user` tendo os privilégios de `proxied_user`.

O mapeamento de usuários proxy realizado pelo servidor está sujeito a essas restrições:

* O servidor não proxy para ou a partir de um usuário anônimo, mesmo que o privilégio associado `PROXY` seja concedido.

* Quando uma única conta recebeu privilégios de proxy para mais de uma conta proxy, o mapeamento de usuários do proxy do servidor não é determinístico. Portanto, não é aconselhável conceder privilégios de proxy a uma única conta para múltiplas contas proxy.

#### Variáveis do Sistema de Usuário Proxy

Duas variáveis do sistema ajudam a rastrear o processo de login do proxy:

* `proxy_user`: Este valor é `NULL` se a proxy não for usada. Caso contrário, indica a conta de usuário da proxy. Por exemplo, se um cliente se autentica através da conta de proxy `''@''`, esta variável é definida da seguinte forma:

  ```
  mysql> SELECT @@proxy_user;
  +--------------+
  | @@proxy_user |
  +--------------+
  | ''@''        |
  +--------------+
  ```

* `external_user`: Às vezes, o plugin de autenticação pode usar um usuário externo para autenticar-se no servidor MySQL. Por exemplo, ao usar a autenticação nativa do Windows, um plugin que autentica usando a API do Windows não precisa do ID de login passado para ele. No entanto, ele ainda usa um ID de usuário do Windows para autenticar. O plugin pode retornar esse ID do usuário externo (ou os primeiros 512 bytes UTF-8) ao servidor usando a variável de sessão `external_user` somente para leitura. Se o plugin não definir essa variável, seu valor é `NULL`.

### 8.2.20 Bloqueio da Conta

O MySQL suporta o bloqueio e o desbloqueio de contas de usuários usando as cláusulas `ACCOUNT LOCK` e `ACCOUNT UNLOCK` para as declarações [`CREATE USER`(create-user.html "15.7.1.3 CREATE USER Statement") e `ALTER USER`:

* Quando utilizado com `CREATE USER`, essas cláusulas especificam o estado de bloqueio inicial para uma nova conta. Na ausência de qualquer cláusula, a conta é criada em um estado não bloqueado.

Se o componente `validate_password` estiver habilitado, não é permitido criar uma conta sem uma senha, mesmo que a conta esteja bloqueada. Veja a Seção 8.4.3, “O componente de validação de senha”.

* Quando utilizado com `ALTER USER`, essas cláusulas especificam o novo estado de bloqueio para uma conta existente. Na ausência de qualquer cláusula, o estado de bloqueio da conta permanece inalterado.

A partir do MySQL 8.0.19, `ALTER USER ... UNLOCK`(alter-user.html "15.7.1.1 ALTER USER Statement") desbloqueia qualquer conta nomeada pela declaração que está temporariamente bloqueada devido a muitos logins fracassados. Veja a Seção 8.2.15, “Gestão de Senhas”.

O estado de bloqueio da conta é registrado na coluna `account_locked` da tabela do sistema `mysql.user`. A saída de `SHOW CREATE USER` indica se uma conta está bloqueada ou desbloqueada.

Se um cliente tentar se conectar a uma conta bloqueada, a tentativa falha. O servidor incrementa a variável de status `Locked_connects` que indica o número de tentativas de conexão a uma conta bloqueada, retorna um erro `ER_ACCOUNT_HAS_BEEN_LOCKED` e escreve uma mensagem no log de erro:

```
Access denied for user 'user_name'@'host_name'.
Account is locked.
```

A bloquagem de uma conta não afeta a capacidade de se conectar usando um usuário proxy que assume a identidade da conta bloqueada. Também não afeta a capacidade de executar programas ou visualizações armazenadas que tenham um atributo `DEFINER` que nomeia a conta bloqueada. Isso significa que a capacidade de usar uma conta proxy ou programas ou visualizações armazenadas não é afetada pela bloquagem da conta.

A capacidade de bloqueio de contas depende da presença da coluna `account_locked` na tabela do sistema `mysql.user`. Para atualizações a partir de versões do MySQL mais antigas que 5.7.6, realize o procedimento de atualização do MySQL para garantir que essa coluna exista. Veja o Capítulo 3, *Atualizando o MySQL*. Para instalações não atualizadas que não possuem a coluna `account_locked`, o servidor trata todas as contas como desbloqueadas, e o uso das cláusulas `ACCOUNT LOCK` ou `ACCOUNT UNLOCK` produz um erro.

### 8.2.21 Definindo Limites de Recursos da Conta

Uma maneira de restringir o uso dos recursos do servidor MySQL pelo cliente é definir a variável de sistema global `max_user_connections` para um valor não nulo. Isso limita o número de conexões simultâneas que podem ser feitas por qualquer conta, mas não coloca limites sobre o que um cliente pode fazer uma vez conectado. Além disso, definir `max_user_connections` não habilita a gestão de contas individuais. Ambos os tipos de controle são de interesse para os administradores do MySQL.

Para abordar essas preocupações, o MySQL permite limites para contas individuais no uso desses recursos do servidor:

* O número de consultas que uma conta pode emitir por hora
* O número de atualizações que uma conta pode emitir por hora
* O número de vezes que uma conta pode se conectar ao servidor por hora

* Número de conexões simultâneas ao servidor por uma conta

Qualquer declaração que um cliente possa emitir conta para o limite de consulta. Apenas as declarações que modificam bancos de dados ou tabelas contam para o limite de atualização.

Uma “conta” neste contexto corresponde a uma linha na tabela do sistema `mysql.user`. Ou seja, uma conexão é avaliada em relação aos valores `User` e `Host` na linha da tabela `user` que se aplica à conexão. Por exemplo, uma conta `'usera'@'%.example.com'` corresponde a uma linha na tabela `user` que tem os valores `User` e `Host` de `usera` e `%.example.com`, para permitir que `usera` se conecte de qualquer host no domínio `example.com`. Neste caso, o servidor aplica limites de recursos nesta linha coletivamente a todas as conexões por `usera` de qualquer host no domínio `example.com`, porque todas essas conexões usam a mesma conta.

Antes do MySQL 5.0, uma “conta” era avaliada com base no host real a partir do qual um usuário se conecta. Esse método mais antigo de contabilidade pode ser selecionado iniciando o servidor com a opção `--old-style-user-limits`. Neste caso, se `usera` se conectar simultaneamente a partir de `host1.example.com` e `host2.example.com`, o servidor aplica os limites do recurso da conta separadamente para cada conexão. Se `usera` se conectar novamente a partir de `host1.example.com`, o servidor aplica os limites para essa conexão juntamente com a conexão existente desse host.

Nota

A opção `--old-style-user-limits` é desatualizada no MySQL 8.0.30 e está sujeita à remoção em uma versão futura do MySQL. O uso dessa opção na linha de comando ou em um arquivo de opção no MySQL 8.0.30 ou posterior faz com que o servidor emita um aviso.

Para estabelecer limites de recursos para uma conta no momento da criação da conta, use a declaração `CREATE USER`. Para modificar os limites de uma conta existente, use `ALTER USER`. Forneça uma cláusula `WITH` que nomeie cada recurso a ser limitado. O valor padrão para cada limite é zero (sem limite). Por exemplo, para criar uma nova conta que possa acessar o banco de dados `customer`, mas apenas de forma limitada, emita essas declarações:

```
mysql> CREATE USER 'francis'@'localhost' IDENTIFIED BY 'frank'
    ->     WITH MAX_QUERIES_PER_HOUR 20
    ->          MAX_UPDATES_PER_HOUR 10
    ->          MAX_CONNECTIONS_PER_HOUR 5
    ->          MAX_USER_CONNECTIONS 2;
```

Os tipos de limite não precisam de todos serem nomeados na cláusula `WITH`, mas aqueles nomeados podem estar presentes em qualquer ordem. O valor para cada limite por hora deve ser um inteiro representando um número por hora. Para `MAX_USER_CONNECTIONS`, o limite é um inteiro representando o número máximo de conexões simultâneas por conta. Se este limite for definido como zero, o valor da variável de sistema global `max_user_connections` determina o número de conexões simultâneas. Se `max_user_connections` também for zero, não há limite para a conta.

Para modificar os limites de uma conta existente, use uma declaração `ALTER USER`. A declaração a seguir altera o limite de consulta para `francis` para 100:

```
mysql> ALTER USER 'francis'@'localhost' WITH MAX_QUERIES_PER_HOUR 100;
```

A declaração modifica apenas o valor limite especificado e deixa a conta de outra forma inalterada.

Para remover um limite, defina seu valor como zero. Por exemplo, para remover o limite de quantas vezes por hora o `francis` pode se conectar, use esta declaração:

```
mysql> ALTER USER 'francis'@'localhost' WITH MAX_CONNECTIONS_PER_HOUR 0;
```

Como mencionado anteriormente, o limite de conexão simultânea para uma conta é determinado a partir do limite `MAX_USER_CONNECTIONS` e da variável de sistema `max_user_connections`. Suponha que o valor global `max_user_connections` seja 10 e três contas tenham limites de recursos individuais especificados da seguinte forma:

```
ALTER USER 'user1'@'localhost' WITH MAX_USER_CONNECTIONS 0;
ALTER USER 'user2'@'localhost' WITH MAX_USER_CONNECTIONS 5;
ALTER USER 'user3'@'localhost' WITH MAX_USER_CONNECTIONS 20;
```

`user1` tem um limite de conexão de 10 (o valor global `max_user_connections`) porque tem um limite `MAX_USER_CONNECTIONS` de zero. `user2` e `user3` têm limites de conexão de 5 e 20, respectivamente, porque têm limites `MAX_USER_CONNECTIONS` não nulos.

O servidor armazena os limites de recursos para uma conta na linha da tabela `user` correspondente à conta. As colunas `max_questions`, `max_updates` e `max_connections` armazenam os limites por hora, e a coluna `max_user_connections` armazena o limite do `MAX_USER_CONNECTIONS`. (Veja a Seção 8.2.3, “Tabelas de Concessão”).

O contagem do uso de recursos ocorre quando qualquer conta tiver um limite não nulo colocado em seu uso de qualquer um dos recursos.

À medida que o servidor é executado, ele conta o número de vezes que cada conta usa os recursos. Se uma conta atingir seu limite de número de conexões na última hora, o servidor rejeita mais conexões para a conta até que essa hora termine. Da mesma forma, se a conta atingir seu limite de número de consultas ou atualizações, o servidor rejeita mais consultas ou atualizações até que a hora termine. Em todos esses casos, o servidor emite mensagens de erro apropriadas.

O contagem de recursos ocorre por conta, não por cliente. Por exemplo, se sua conta tiver um limite de consulta de 50, você não pode aumentar seu limite para 100 fazendo duas conexões simultâneas de cliente ao servidor. As consultas emitidas em ambas as conexões são contadas juntas.

As atualizações de contagem de uso de recursos por hora podem ser redefinidas globalmente para todas as contas ou individualmente para uma conta específica:

* Para redefinir as contagens atuais para zero em todas as contas, emita uma declaração `FLUSH USER_RESOURCES`. As contagens também podem ser redefinidas recarregando as tabelas de concessão (por exemplo, com uma declaração [`FLUSH PRIVILEGES`(flush.html#flush-privileges) ou o comando [**mysqladmin reload**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program")).

* Os contagem de uma conta individual podem ser redefinidas para zero, definindo novamente qualquer um de seus limites. Especifique um valor de limite igual ao valor atualmente atribuído à conta.

Os recálculos por hora do contador não afetam o limite `MAX_USER_CONNECTIONS`.

Todos os contagem começam em zero quando o servidor começa. As contagens não são transferidas através dos reinício do servidor.

Para o limite `MAX_USER_CONNECTIONS`, pode ocorrer um caso de borda se a conta tiver o número máximo de conexões atualmente permitidas: uma desconexão seguida rapidamente por uma conexão pode resultar em um erro (`ER_TOO_MANY_USER_CONNECTIONS` ou `ER_USER_LIMIT_REACHED`) se o servidor não tiver processado completamente a desconexão até que a conexão ocorra. Quando o servidor termina o processamento da desconexão, outra conexão é permitida novamente.

### 8.2.22 Solução de problemas com problemas de conexão ao MySQL

Se você encontrar problemas ao tentar se conectar ao servidor MySQL, os seguintes itens descrevem algumas ações que você pode tomar para corrigir o problema.

* Certifique-se de que o servidor está em execução. Se não estiver, os clientes não poderão se conectar a ele. Por exemplo, se uma tentativa de conexão com o servidor falhar com uma mensagem como uma das seguintes, uma das causas pode ser que o servidor não esteja em execução:

  ```
  $> mysql
  ERROR 2003: Can't connect to MySQL server on 'host_name' (111)
  $> mysql
  ERROR 2002: Can't connect to local MySQL server through socket
  '/tmp/mysql.sock' (111)
  ```

* É possível que o servidor esteja em execução, mas você esteja tentando se conectar usando uma porta TCP/IP, canal de comunicação ou arquivo de soquete Unix diferente daquela em que o servidor está ouvindo. Para corrigir isso quando você invoca um programa cliente, especifique uma opção `--port` para indicar o número de porta apropriado, ou uma opção `--socket` para indicar o canal de comunicação ou arquivo de soquete Unix apropriado. Para descobrir onde está o arquivo de soquete, você pode usar este comando:

  ```
  $> netstat -ln | grep mysql
  ```

* Certifique-se de que o servidor não foi configurado para ignorar conexões de rede ou (se você está tentando se conectar remotamente) que não foi configurado para ouvir apenas localmente em suas interfaces de rede. Se o servidor foi iniciado com a variável de sistema `skip_networking` habilitada, nenhuma conexão TCP/IP é aceita. Se o servidor foi iniciado com a variável de sistema `bind_address` definida como `127.0.0.1`, ele escuta conexões TCP/IP apenas localmente na interface de loopback e não aceita conexões remotas.

* Verifique para garantir que não há firewall bloqueando o acesso ao MySQL. Seu firewall pode estar configurado com base na aplicação que está sendo executada, ou no número de porta usado pelo MySQL para comunicação (3306 por padrão). Em Linux ou Unix, verifique a configuração de suas tabelas de IP (ou similar) para garantir que a porta não tenha sido bloqueada. Em Windows, aplicativos como ZoneAlarm ou o Firewall do Windows podem precisar ser configurados para não bloquear a porta do MySQL.

* As tabelas de concessão devem ser configuradas corretamente para que o servidor possa usá-las para controle de acesso. Para alguns tipos de distribuição (como distribuições binárias no Windows ou RPM e DEB no Linux), o processo de instalação inicializa o diretório de dados do MySQL, incluindo o banco de dados do sistema `mysql` que contém as tabelas de concessão. Para distribuições que não fazem isso, você deve inicializar o diretório de dados manualmente. Para detalhes, consulte a Seção 2.9, “Configuração e Teste Pós-Instalação”.

Para determinar se você precisa inicializar as tabelas de concessão, procure um diretório `mysql` no diretório de dados. (O diretório de dados normalmente é nomeado `data` ou `var` e está localizado sob o diretório de instalação do MySQL.) Certifique-se de que você tem um arquivo chamado `user.MYD` no diretório de banco de dados `mysql`. Se não, inicialize o diretório de dados. Após fazer isso e iniciar o servidor, você deve ser capaz de se conectar ao servidor.

* Após uma instalação recente, se você tentar fazer login no servidor como `root` sem usar uma senha, você pode receber a seguinte mensagem de erro.

  ```
  $> mysql -u root
  ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: NO)
  ```

Isso significa que uma senha de raiz já foi atribuída durante a instalação e ela precisa ser fornecida. Veja a Seção 2.9.4, “Segurando a Conta Inicial do MySQL”, sobre as diferentes maneiras pelas quais a senha poderia ter sido atribuída e, em alguns casos, como encontrá-la. Se você precisar redefinir a senha de raiz, veja as instruções na Seção B.3.3.2, “Como Redefinir a Senha de Raiz”. Após encontrar ou redefinir sua senha, faça login novamente como `root` usando a opção `--password` (ou `-p`):

  ```
  $> mysql -u root -p
  Enter password:
  ```

No entanto, o servidor permitirá que você se conecte como `root` sem usar uma senha se você tiver inicializado o MySQL usando [**mysqld --initialize-insecure**](mysqld.html "6.3.1 mysqld — The MySQL Server") (consulte a Seção 2.9.1, “Inicializando o Diretório de Dados” para detalhes). Esse é um risco de segurança, então você deve definir uma senha para a conta `root`; consulte a Seção 2.9.4, “Segurando a Conta Inicial do MySQL” para instruções.

* Se você atualizou uma instalação MySQL existente para uma versão mais recente, você realizou o procedimento de atualização do MySQL? Se não, faça isso. A estrutura das tabelas de concessão muda ocasionalmente quando novas funcionalidades são adicionadas, então, após uma atualização, você deve sempre garantir que suas tabelas tenham a estrutura atual. Para instruções, consulte o Capítulo 3, *Atualizando o MySQL*.

* Se um programa de cliente receber a seguinte mensagem de erro quando tenta se conectar, isso significa que o servidor espera senhas em um formato mais recente do que o cliente é capaz de gerar:

  ```
  $> mysql
  Client does not support authentication protocol requested
  by server; consider upgrading MySQL client
  ```

* Lembre-se de que os programas de cliente utilizam parâmetros de conexão especificados em arquivos de opção ou variáveis de ambiente. Se um programa de cliente parecer estar enviando parâmetros de conexão padrão incorretos quando você não os especificou na linha de comando, verifique quaisquer arquivos de opção aplicáveis e seu ambiente. Por exemplo, se você receber `Access denied` ao executar um cliente sem nenhuma opção, certifique-se de que você não especificou uma senha antiga em nenhum de seus arquivos de opção!

Você pode suprimir o uso de arquivos de opção por um programa cliente, invocando-o com a opção `--no-defaults`. Por exemplo:

  ```
  $> mysqladmin --no-defaults -u root version
  ```

Os arquivos de opção que os clientes usam estão listados na Seção 6.2.2.2, “Usando arquivos de opção”. As variáveis de ambiente estão listadas na Seção 6.9, “Variáveis de ambiente”.

* Se você receber o seguinte erro, isso significa que você está usando uma senha incorreta do `root`:

  ```
  $> mysqladmin -u root -pxxxx ver
  Access denied for user 'root'@'localhost' (using password: YES)
  ```

Se o erro anterior ocorrer mesmo quando você não especificou uma senha, isso significa que você tem uma senha incorreta listada em algum arquivo de opção. Tente a opção `--no-defaults` conforme descrito no item anterior.

Para obter informações sobre a alteração de senhas, consulte a Seção 8.2.14, “Atribuição de senhas de conta”.

Se você perdeu ou esqueceu a senha do `root`, consulte a Seção B.3.3.2, “Como redefinir a senha do root”.

* `localhost` é um sinônimo do nome do seu host local e também é o host padrão para o qual os clientes tentam se conectar se você não especificar explicitamente um host.

Você pode usar a opção `--host=127.0.0.1` para nomear o host do servidor explicitamente. Isso causa uma conexão TCP/IP com o servidor local **mysqld**. Você também pode usar TCP/IP especificando a opção `--host` que usa o nome real do host local. Neste caso, o nome do host deve ser especificado em uma linha de tabela `user` no host do servidor, mesmo que você esteja executando o programa cliente no mesmo host que o servidor.

* A mensagem de erro `Access denied` informa quem você está tentando fazer login como, o host do cliente do qual você está tentando se conectar e se você estava usando uma senha. Normalmente, você deve ter uma linha na tabela `user` que corresponda exatamente ao nome do host e ao nome de usuário que foram fornecidos na mensagem de erro. Por exemplo, se você receber uma mensagem de erro que contém `using password: NO`, isso significa que você tentou fazer login sem uma senha.

* Se você receber um erro `Access denied` ao tentar se conectar ao banco de dados com `mysql -u user_name`, você pode estar com um problema com a tabela `user`. Verifique isso executando `mysql -u root mysql` e emitindo esta declaração SQL:

  ```
  SELECT * FROM user;
  ```

O resultado deve incluir uma linha com as colunas `Host` e `User` correspondendo ao nome do host do seu cliente e ao nome do usuário do MySQL.

* Se o seguinte erro ocorrer quando você tenta se conectar a um host diferente do que o em que o servidor MySQL está em execução, isso significa que não há uma linha na tabela `user` com um valor `Host` que corresponda ao host do cliente:

  ```
  Host ... is not allowed to connect to this MySQL server
  ```

Você pode corrigir isso configurando uma conta para a combinação do nome do host do cliente e do nome de usuário que você está usando ao tentar se conectar.

Se você não conhece o endereço IP ou o nome do host da máquina da qual está se conectando, deve colocar uma linha com `'%'` como o valor da coluna `Host` na tabela `user`. Após tentar se conectar a partir da máquina do cliente, use uma consulta `SELECT USER()` para ver como você realmente se conectou. Em seguida, mude o `'%'` na linha da tabela `user` para o nome do host real que aparece no log. Caso contrário, seu sistema fica inseguro, pois permite conexões de qualquer host para o nome de usuário dado.

Em Linux, outra razão pela qual esse erro pode ocorrer é que você está usando uma versão binária do MySQL que foi compilada com uma versão diferente da biblioteca `glibc` do que a que você está usando. Nesse caso, você deve atualizar seu sistema operacional ou `glibc`, ou baixar uma distribuição de fonte da versão do MySQL e compilar manualmente. Um RPM de fonte é normalmente trivial de compilar e instalar, então isso não é um grande problema.

* Se você especificar um nome de host ao tentar se conectar, mas receber uma mensagem de erro onde o nome de host não é mostrado ou é um endereço IP, isso significa que o servidor MySQL teve um erro ao tentar resolver o endereço IP do host do cliente em um nome:

  ```
  $> mysqladmin -u root -pxxxx -h some_hostname ver
  Access denied for user 'root'@'' (using password: YES)
  ```

Se você tentar se conectar como `root` e receber o seguinte erro, isso significa que você não tem uma linha na tabela `user` com um valor na coluna `User` de `'root'` e que o **mysqld** não consegue resolver o nome do host do seu cliente:

  ```
  Access denied for user ''@'unknown'
  ```

Esses erros indicam um problema no DNS. Para corrigi-lo, execute **mysqladmin flush-hosts** para redefinir o cache de hosts interno do DNS. Veja a Seção 7.1.12.3, “Consultas de DNS e o cache de hosts”.

Algumas soluções permanentes são:

+ Descubra o que está errado com o seu servidor DNS e corrija-o.
+ Especifique endereços IP em vez de nomes de host nas tabelas de concessão do MySQL.

+ Coloque uma entrada para o nome da máquina do cliente em `/etc/hosts` em Unix ou `\windows\hosts` em Windows.

Inicie o **mysqld** com a variável de sistema `skip_name_resolve` habilitada.

Inicie o **mysqld** com a opção `--skip-host-cache`.

+ Em Unix, se você estiver executando o servidor e o cliente na mesma máquina, conecte-se a `localhost`. Para conexões a `localhost`, os programas do MySQL tentam se conectar ao servidor local usando um arquivo de socket Unix, a menos que haja parâmetros de conexão especificados para garantir que o cliente faça uma conexão TCP/IP. Para mais informações, consulte a Seção 6.2.4, “Conectando ao servidor MySQL usando opções de comando”.

+ Em Windows, se você estiver executando o servidor e o cliente na mesma máquina e o servidor suporte conexões de canal nomeado, conecte-se ao nome do host `.` (período). As conexões a `.` usam um canal nomeado em vez de TCP/IP.

* Se o `mysql -u root` funcionar, mas o `mysql -h your_hostname -u root` resultar no `Access denied` (onde *`your_hostname`* é o nome real do host local), você pode não ter o nome correto para o seu host na tabela `user`. Um problema comum aqui é que o valor `Host` na linha da tabela `user` especifica um nome de host não qualificado, mas as rotinas de resolução de nomes do seu sistema retornam um nome de domínio totalmente qualificado (ou vice-versa). Por exemplo, se você tiver uma linha com o host `'pluto'` na tabela `user`, mas seu DNS informar ao MySQL que o nome do seu host é `'pluto.example.com'`, a linha não funcionará. Tente adicionar uma linha à tabela `user` que contenha o endereço IP do seu host como o valor da coluna `Host`. (Alternativamente, você poderia adicionar uma linha à tabela `user` com um valor `Host` que contenha um caractere curinga (por exemplo, `'pluto.%'`). No entanto, o uso de valores `Host` terminando com `%` é *inseguro* e *não é recomendado!)

* Se o `mysql -u user_name` funcionar, mas o `mysql -u user_name some_db` não, você não concedeu acesso ao usuário especificado para o banco de dados denominado *`some_db`*.

* Se o `mysql -u user_name` funcionar quando executado no host do servidor, mas o `mysql -h host_name -u user_name` não funcionar quando executado em um host de cliente remoto, você não ativou o acesso ao servidor para o nome de usuário especificado a partir do host remoto.

* Se você não conseguir descobrir por que está recebendo `Access denied`, remova da tabela `user` todas as linhas que têm valores de `Host` contendo caracteres de asterisco (linhas que contêm caracteres de `'%'` ou `'_'`). Um erro muito comum é inserir uma nova linha com `Host`=`'%'` e `User`=`'some_user'`, pensando que isso permite especificar `localhost` para se conectar da mesma máquina. O motivo pelo qual isso não funciona é que os privilégios padrão incluem uma linha com `Host`=`'localhost'` e `User`=`''`. Como essa linha tem um valor de `Host` `'localhost'` que é mais específico do que `'%'`, ela é usada preferencialmente à nova linha ao se conectar a partir de `localhost`! O procedimento correto é inserir uma segunda linha com `Host`=`'localhost'` e `User`=`'some_user'`, ou excluir a linha com `Host`=`'localhost'` e `User`=`''`. Após excluir a linha, lembre-se de emitir uma declaração [`FLUSH PRIVILEGES`](flush.html#flush-privileges) para recarregar as tabelas de concessão. Veja também a Seção 8.2.6, “Controle de Acesso, Etapa 1: Verificação de Conexão”.

* Se você conseguir se conectar ao servidor MySQL, mas receber uma mensagem `Access denied` sempre que emitir uma declaração `SELECT ... INTO OUTFILE` ou `LOAD DATA`, sua linha na tabela `user` não tem o privilégio `FILE` habilitado.

* Se você alterar as tabelas de privilégios diretamente (por exemplo, usando as declarações `INSERT`, `UPDATE` ou `DELETE`), e suas alterações parecerem ignoradas, lembre-se de que você deve executar uma declaração `FLUSH PRIVILEGES` ou o comando **mysqladmin flush-privileges** para fazer o servidor recarregar as tabelas de privilégios. Caso contrário, suas alterações não terão efeito até a próxima vez que o servidor for reiniciado. Lembre-se de que, após alterar a senha do `root` com uma declaração `UPDATE`, você não precisa especificar a nova senha até depois de esvaziar os privilégios, porque o servidor não sabe disso até então.

* Se seus privilégios parecerem ter mudado em meio a uma sessão, pode ser que um administrador do MySQL os tenha alterado. Recarregar as tabelas de concessão afeta as novas conexões do cliente, mas também afeta as conexões existentes, conforme indicado na Seção 8.2.13, “Quando as Alterações de Privilegio Se Tornam Efetivas”.

* Se você tiver problemas de acesso com um programa Perl, PHP, Python ou ODBC, tente se conectar ao servidor com `mysql -u user_name db_name` ou `mysql -u user_name -ppassword db_name`. Se você conseguir se conectar usando o cliente **mysql**, o problema está com seu programa, não com os privilégios de acesso. (Não há espaço entre `-p` e a senha; você também pode usar a sintaxe `--password=password` para especificar a senha. Se você usar a opção `-p` ou `--password` sem valor de senha, o MySQL solicitará a senha.)

* Para fins de teste, inicie o servidor **mysqld** com a opção `--skip-grant-tables`. Em seguida, você pode alterar as tabelas de concessão do MySQL e usar a declaração `SHOW GRANTS` para verificar se suas modificações tiveram o efeito desejado. Quando estiver satisfeito com suas alterações, execute [**mysqladmin flush-privileges**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") para informar ao servidor **mysqld** para recarregar os privilégios. Isso permite que você comece a usar o novo conteúdo da tabela de concessão sem parar e reiniciar o servidor.

* Se tudo o mais falhar, inicie o servidor **mysqld** com uma opção de depuração (por exemplo, `--debug=d,general,query`). Isso exibe informações sobre o host e o usuário das conexões tentativas, bem como informações sobre cada comando emitido. Veja a Seção 7.9.4, “O pacote DBUG”.

* Se você tiver outros problemas com as tabelas de concessão do MySQL e quiser perguntar sobre isso no [Slack da Comunidade MySQL][(https://mysqlcommunity.slack.com/)], sempre forneça um dump das tabelas de concessão do MySQL. Você pode fazer um dump das tabelas com o comando [**mysqldump mysql**][(mysqldump.html "6.5.4 mysqldump — A Database Backup Program")]. Para fazer um relatório de erro, consulte as instruções na Seção 1.5, “Como relatar erros ou problemas”. Em alguns casos, você pode precisar reiniciar o **mysqld** com `--skip-grant-tables` para executar o **mysqldump**.

### 8.2.23 Auditoria da atividade de conta baseada em SQL

As aplicações podem usar as seguintes diretrizes para realizar auditoria baseada em SQL que vincula a atividade do banco de dados a contas do MySQL.

As contas do MySQL correspondem a linhas na tabela do sistema `mysql.user`. Quando um cliente se conecta com sucesso, o servidor autentica o cliente em uma linha específica desta tabela. Os valores das colunas `User` e `Host` nesta linha identificam de forma única a conta e correspondem ao formato `'user_name'@'host_name'` no qual os nomes das contas são escritos em declarações SQL.

A conta usada para autenticar um cliente determina quais privilégios o cliente tem. Normalmente, a função `CURRENT_USER()` pode ser invocada para determinar qual é a conta para o usuário do cliente. Seu valor é construído a partir das colunas `User` e `Host` da linha da tabela `user` para a conta.

No entanto, há circunstâncias em que o valor `CURRENT_USER()` não corresponde ao usuário do cliente, mas a uma conta diferente. Isso ocorre em contextos em que a verificação de privilégios não é baseada na conta do cliente:

* Rotinas armazenadas (procedimentos e funções) definidas com a característica `SQL SECURITY DEFINER`

* Visões definidas com a característica `SQL SECURITY DEFINER`

* Gatilhos e eventos

Nesses contextos, o verificação de privilégios é feita contra a conta `DEFINER` e `CURRENT_USER()` se refere a essa conta, não à conta do cliente que invocou a rotina ou a visualização armazenada ou que causou o disparo a ser ativado. Para determinar o usuário que está invocando, você pode chamar a função `USER()`, que retorna um valor que indica o nome real do usuário fornecido pelo cliente e o host a partir do qual o cliente se conectou. No entanto, esse valor não corresponde necessariamente diretamente a uma conta na tabela `user`, porque o valor `USER()` nunca contém caracteres de mascaramento, enquanto os valores de conta (como retornados por `CURRENT_USER()`) podem conter caracteres de mascaramento de nome de usuário e nome de host.

Por exemplo, um nome de usuário em branco corresponde a qualquer usuário, então uma conta de `''@'localhost'` permite que os clientes se conectem como um usuário anônimo a partir do host local com qualquer nome de usuário. Neste caso, se um cliente se conecta como `user1` a partir do host local, `USER()` e `CURRENT_USER()` retornam valores diferentes:

```
mysql> SELECT USER(), CURRENT_USER();
+-----------------+----------------+
| USER()          | CURRENT_USER() |
+-----------------+----------------+
| user1@localhost | @localhost     |
+-----------------+----------------+
```

A parte do nome de host de uma conta também pode conter caracteres de mascaramento. Se o nome de host contém um caractere de padrão `'%'` ou `'_'` ou usa notação de máscara de rede, a conta pode ser usada para clientes que se conectam a partir de vários hosts e o valor `CURRENT_USER()` não indica qual deles. Por exemplo, a conta `'user2'@'%.example.com'` pode ser usada por `user2` para se conectar a partir de qualquer host no domínio `example.com`. Se `user2` se conecta a partir de `remote.example.com`, `USER()` e `CURRENT_USER()` retornam valores diferentes:

```
mysql> SELECT USER(), CURRENT_USER();
+--------------------------+---------------------+
| USER()                   | CURRENT_USER()      |
+--------------------------+---------------------+
| user2@remote.example.com | user2@%.example.com |
+--------------------------+---------------------+
```

Se um aplicativo precisar invocar `USER()` para auditoria de usuários (por exemplo, se realizar auditoria a partir de triggers), mas também precisar associar o valor `USER()` a uma conta na tabela `user`, é necessário evitar contas que contenham caracteres de comodinho na coluna `User` ou `Host`. Especificamente, não permitir que `User` esteja vazio (o que cria uma conta de usuário anônimo) e não permitir caracteres de padrão ou notação de máscara de rede nos valores de `Host`. Todas as contas devem ter um valor não vazio de `User` e um valor literal de `Host`.

Em relação aos exemplos anteriores, as contas `''@'localhost'` e `'user2'@'%.example.com'` devem ser alteradas para não utilizar caracteres de mascaramento:

```
RENAME USER ''@'localhost' TO 'user1'@'localhost';
RENAME USER 'user2'@'%.example.com' TO 'user2'@'remote.example.com';
```

Se o `user2` tiver que se conectar a vários hosts no domínio `example.com`, deve haver uma conta separada para cada host.

Para extrair a parte do nome do usuário ou do nome do host de um valor `CURRENT_USER()` ou `USER()`, use a função `SUBSTRING_INDEX()`:

```
mysql> SELECT SUBSTRING_INDEX(CURRENT_USER(),'@',1);
+---------------------------------------+
| SUBSTRING_INDEX(CURRENT_USER(),'@',1) |
+---------------------------------------+
| user1                                 |
+---------------------------------------+

mysql> SELECT SUBSTRING_INDEX(CURRENT_USER(),'@',-1);
+----------------------------------------+
| SUBSTRING_INDEX(CURRENT_USER(),'@',-1) |
+----------------------------------------+
| localhost                              |
+----------------------------------------+
```
