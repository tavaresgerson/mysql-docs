### 6.2.3 Tabelas de Concessão (Grant Tables)

O Database de sistema `mysql` inclui diversas Grant Tables que contêm informações sobre contas de usuário e os privilégios concedidos a elas. Esta seção descreve essas tabelas. Para obter informações sobre outras tabelas no Database de sistema, consulte [Seção 5.3, “O Database de Sistema mysql”](system-schema.html "5.3 The mysql System Database").

A discussão aqui descreve a estrutura subjacente das Grant Tables e como o servidor usa seu conteúdo ao interagir com clientes. No entanto, normalmente você não modifica as Grant Tables diretamente. As modificações ocorrem indiretamente quando você usa instruções de gerenciamento de conta, como [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), [`GRANT`](grant.html "13.7.1.4 GRANT Statement") e [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement"), para configurar contas e controlar os privilégios disponíveis para cada uma. Consulte [Seção 13.7.1, “Instruções de Gerenciamento de Conta”](account-management-statements.html "13.7.1 Account Management Statements"). Ao usar tais instruções para realizar manipulações de conta, o servidor modifica as Grant Tables em seu nome.

Note

A modificação direta das Grant Tables usando instruções como [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement") ou [`DELETE`](delete.html "13.2.2 DELETE Statement") é desencorajada e feita por sua conta e risco. O servidor pode ignorar linhas que se tornem malformadas como resultado de tais modificações.

A partir do MySQL 5.7.18, para qualquer operação que modifique uma Grant Table, o servidor verifica se a tabela possui a estrutura esperada e produz um erro caso contrário. Para atualizar as tabelas para a estrutura esperada, execute o procedimento de upgrade do MySQL. Consulte [Seção 2.10, “Upgrading MySQL”](upgrading.html "2.10 Upgrading MySQL").

* [Visão Geral das Grant Tables](grant-tables.html#grant-tables-overview "Grant Table Overview")
* [As Grant Tables user e db](grant-tables.html#grant-tables-user-db "The user and db Grant Tables")
* [As Grant Tables tables_priv e columns_priv](grant-tables.html#grant-tables-tables-priv-columns-priv "The tables_priv and columns_priv Grant Tables")
* [A Grant Table procs_priv](grant-tables.html#grant-tables-procs-priv "The procs_priv Grant Table")
* [A Grant Table proxies_priv](grant-tables.html#grant-tables-proxies-priv "The proxies_priv Grant Table")
* [Propriedades da Coluna de Escopo das Grant Tables](grant-tables.html#grant-tables-scope-column-properties "Grant Table Scope Column Properties")
* [Propriedades da Coluna de Privilégio das Grant Tables](grant-tables.html#grant-tables-privilege-column-properties "Grant Table Privilege Column Properties")

#### Visão Geral das Grant Tables

Estas tabelas do Database `mysql` contêm informações de concessão:

* [`user`](grant-tables.html#grant-tables-user-db "The user and db Grant Tables"): Contas de usuário, privilégios globais e outras colunas não relacionadas a privilégios.

* [`db`](grant-tables.html#grant-tables-user-db "The user and db Grant Tables"): Privilégios no nível do Database.

* [`tables_priv`](grant-tables.html#grant-tables-tables-priv-columns-priv "The tables_priv and columns_priv Grant Tables"): Privilégios no nível da Tabela.

* [`columns_priv`](grant-tables.html#grant-tables-tables-priv-columns-priv "The tables_priv and columns_priv Grant Tables"): Privilégios no nível da Coluna.

* [`procs_priv`](grant-tables.html#grant-tables-procs-priv "The procs_priv Grant Table"): Privilégios de stored procedure e function.

* [`proxies_priv`](grant-tables.html#grant-tables-proxies-priv "The proxies_priv Grant Table"): Privilégios de usuário proxy.

Cada Grant Table contém colunas de escopo e colunas de privilégio:

* As colunas de escopo (Scope columns) determinam o escopo de cada linha nas tabelas; ou seja, o contexto em que a linha se aplica. Por exemplo, uma linha da tabela `user` com valores `Host` e `User` de `'h1.example.net'` e `'bob'` aplica-se a conexões de autenticação feitas ao servidor a partir do host `h1.example.net` por um cliente que especifica um nome de usuário de `bob`. De forma semelhante, uma linha da tabela `db` com valores de coluna `Host`, `User` e `Db` de `'h1.example.net'`, `'bob'` e `'reports'` aplica-se quando `bob` se conecta a partir do host `h1.example.net` para acessar o Database `reports`. As tabelas `tables_priv` e `columns_priv` contêm colunas de escopo que indicam as tabelas ou combinações de tabela/coluna às quais cada linha se aplica. As colunas de escopo de `procs_priv` indicam a stored routine à qual cada linha se aplica.

* As colunas de privilégio (Privilege columns) indicam quais privilégios uma linha da tabela concede; ou seja, quais operações ela permite que sejam executadas. O servidor combina as informações nas várias Grant Tables para formar uma descrição completa dos privilégios de um usuário. [Seção 6.2.6, “Controle de Acesso, Estágio 2: Verificação de Request”](request-access.html "6.2.6 Access Control, Stage 2: Request Verification"), descreve as regras para isso.

Além disso, uma Grant Table pode conter colunas usadas para outros fins além da avaliação de escopo ou privilégio.

O servidor usa as Grant Tables da seguinte maneira:

* As colunas de escopo da tabela `user` determinam se as conexões de entrada devem ser rejeitadas ou permitidas. Para conexões permitidas, quaisquer privilégios concedidos na tabela `user` indicam os privilégios globais do usuário. Quaisquer privilégios concedidos nesta tabela se aplicam a *todos* os Databases no servidor.

  Cuidado

  Como um privilégio global é considerado um privilégio para todos os Databases, *qualquer* privilégio global permite que um usuário veja todos os nomes de Database com [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") ou examinando a tabela `SCHEMATA` do `INFORMATION_SCHEMA`.

* As colunas de escopo da tabela `db` determinam quais usuários podem acessar quais Databases a partir de quais hosts. As colunas de privilégio determinam as operações permitidas. Um privilégio concedido no nível do Database se aplica ao Database e a todos os objetos no Database, como tabelas e stored programs.

* As tabelas `tables_priv` e `columns_priv` são semelhantes à tabela `db`, mas são mais refinadas: Elas se aplicam nos níveis de tabela e coluna, em vez de no nível do Database. Um privilégio concedido no nível da tabela se aplica à tabela e a todas as suas colunas. Um privilégio concedido no nível da coluna se aplica apenas a uma coluna específica.

* A tabela `procs_priv` aplica-se a stored routines (stored procedures e functions). Um privilégio concedido no nível da rotina aplica-se apenas a uma única procedure ou function.

* A tabela `proxies_priv` indica quais usuários podem atuar como proxies para outros usuários e se um usuário pode conceder o privilégio [`PROXY`](privileges-provided.html#priv_proxy) a outros usuários.

O servidor lê o conteúdo das Grant Tables na memória quando é iniciado. Você pode instruí-lo a recarregar as tabelas emitindo uma instrução [`FLUSH PRIVILEGES`](flush.html#flush-privileges) ou executando um comando [**mysqladmin flush-privileges**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") ou [**mysqladmin reload**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"). As alterações nas Grant Tables entram em vigor conforme indicado em [Seção 6.2.9, “Quando as Alterações de Privilégio Entram em Vigor”](privilege-changes.html "6.2.9 When Privilege Changes Take Effect").

Ao modificar uma conta, é recomendável verificar se suas alterações têm o efeito pretendido. Para verificar os privilégios de uma determinada conta, use a instrução [`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement"). Por exemplo, para determinar os privilégios concedidos a uma conta com nome de usuário e host de `bob` e `pc84.example.com`, use esta instrução:

```sql
SHOW GRANTS FOR 'bob'@'pc84.example.com';
```

Para exibir propriedades não relacionadas a privilégios de uma conta, use [`SHOW CREATE USER`](show-create-user.html "13.7.5.12 SHOW CREATE USER Statement"):

```sql
SHOW CREATE USER 'bob'@'pc84.example.com';
```

#### As Grant Tables user e db

O servidor usa as tabelas `user` e `db` no Database `mysql` tanto no primeiro quanto no segundo estágio do controle de acesso (consulte [Seção 6.2, “Controle de Acesso e Gerenciamento de Conta”](access-control.html "6.2 Access Control and Account Management")). As colunas nas tabelas `user` e `db` são mostradas aqui.

**Tabela 6.3 Colunas das Tabelas user e db**

<table><thead><tr> <th>Nome da Tabela</th> <th><code>user</code></th> <th><code>db</code></th> </tr></thead><tbody><tr> <th><span><strong>Colunas de Escopo</strong></span></th> <td><code>Host</code></td> <td><code>Host</code></td> </tr><tr> <th></th> <td><code>User</code></td> <td><code>Db</code></td> </tr><tr> <th></th> <td></td> <td><code>User</code></td> </tr><tr> <th><span><strong>Colunas de Privilégio</strong></span></th> <td><code>Select_priv</code></td> <td><code>Select_priv</code></td> </tr><tr> <th></th> <td><code>Insert_priv</code></td> <td><code>Insert_priv</code></td> </tr><tr> <th></th> <td><code>Update_priv</code></td> <td><code>Update_priv</code></td> </tr><tr> <th></th> <td><code>Delete_priv</code></td> <td><code>Delete_priv</code></td> </tr><tr> <th></th> <td><code>Index_priv</code></td> <td><code>Index_priv</code></td> </tr><tr> <th></th> <td><code>Alter_priv</code></td> <td><code>Alter_priv</code></td> </tr><tr> <th></th> <td><code>Create_priv</code></td> <td><code>Create_priv</code></td> </tr><tr> <th></th> <td><code>Drop_priv</code></td> <td><code>Drop_priv</code></td> </tr><tr> <th></th> <td><code>Grant_priv</code></td> <td><code>Grant_priv</code></td> </tr><tr> <th></th> <td><code>Create_view_priv</code></td> <td><code>Create_view_priv</code></td> </tr><tr> <th></th> <td><code>Show_view_priv</code></td> <td><code>Show_view_priv</code></td> </tr><tr> <th></th> <td><code>Create_routine_priv</code></td> <td><code>Create_routine_priv</code></td> </tr><tr> <th></th> <td><code>Alter_routine_priv</code></td> <td><code>Alter_routine_priv</code></td> </tr><tr> <th></th> <td><code>Execute_priv</code></td> <td><code>Execute_priv</code></td> </tr><tr> <th></th> <td><code>Trigger_priv</code></td> <td><code>Trigger_priv</code></td> </tr><tr> <th></th> <td><code>Event_priv</code></td> <td><code>Event_priv</code></td> </tr><tr> <th></th> <td><code>Create_tmp_table_priv</code></td> <td><code>Create_tmp_table_priv</code></td> </tr><tr> <th></th> <td><code>Lock_tables_priv</code></td> <td><code>Lock_tables_priv</code></td> </tr><tr> <th></th> <td><code>References_priv</code></td> <td><code>References_priv</code></td> </tr><tr> <th></th> <td><code>Reload_priv</code></td> <td></td> </tr><tr> <th></th> <td><code>Shutdown_priv</code></td> <td></td> </tr><tr> <th></th> <td><code>Process_priv</code></td> <td></td> </tr><tr> <th></th> <td><code>File_priv</code></td> <td></td> </tr><tr> <th></th> <td><code>Show_db_priv</code></td> <td></td> </tr><tr> <th></th> <td><code>Super_priv</code></td> <td></td> </tr><tr> <th></th> <td><code>Repl_slave_priv</code></td> <td></td> </tr><tr> <th></th> <td><code>Repl_client_priv</code></td> <td></td> </tr><tr> <th></th> <td><code>Create_user_priv</code></td> <td></td> </tr><tr> <th></th> <td><code>Create_tablespace_priv</code></td> <td></td> </tr><tr> <th><span><strong>Colunas de Segurança</strong></span></th> <td><code>ssl_type</code></td> <td></td> </tr><tr> <th></th> <td><code>ssl_cipher</code></td> <td></td> </tr><tr> <th></th> <td><code>x509_issuer</code></td> <td></td> </tr><tr> <th></th> <td><code>x509_subject</code></td> <td></td> </tr><tr> <th></th> <td><code>plugin</code></td> <td></td> </tr><tr> <th></th> <td><code>authentication_string</code></td> <td></td> </tr><tr> <th></th> <td><code>password_expired</code></td> <td></td> </tr><tr> <th></th> <td><code>password_last_changed</code></td> <td></td> </tr><tr> <th></th> <td><code>password_lifetime</code></td> <td></td> </tr><tr> <th></th> <td><code>account_locked</code></td> <td></td> </tr><tr> <th><span><strong>Colunas de Controle de Recursos</strong></span></th> <td><code>max_questions</code></td> <td></td> </tr><tr> <th></th> <td><code>max_updates</code></td> <td></td> </tr><tr> <th></th> <td><code>max_connections</code></td> <td></td> </tr><tr> <th></th> <td><code>max_user_connections</code></td> <td></td> </tr></tbody></table>

As colunas `plugin` e `authentication_string` da tabela `user` armazenam informações de plugin de autenticação e credenciais.

O servidor usa o plugin nomeado na coluna `plugin` de uma linha de conta para autenticar tentativas de conexão para essa conta.

A coluna `plugin` não deve estar vazia. Na inicialização e em tempo de execução quando [`FLUSH PRIVILEGES`](flush.html#flush-privileges) é executado, o servidor verifica as linhas da tabela `user`. Para qualquer linha com uma coluna `plugin` vazia, o servidor escreve um aviso no log de erros neste formato:

```sql
[Warning] User entry 'user_name'@'host_name' has an empty plugin
value. The user will be ignored and no one can login with this user
anymore.
```

Para resolver este problema, consulte [Seção 6.4.1.3, “Migrando de Hashing de Senha Pré-4.1 e o Plugin mysql_old_password”](account-upgrades.html "6.4.1.3 Migrating Away from Pre-4.1 Password Hashing and the mysql_old_password Plugin").

A coluna `password_expired` permite que DBAs expirem senhas de contas e exijam que os usuários redefinam sua senha. O valor padrão de `password_expired` é `'N'`, mas pode ser definido como `'Y'` com a instrução [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"). Depois que a senha de uma conta expira, todas as operações realizadas pela conta em conexões subsequentes ao servidor resultam em erro até que o usuário emita uma instrução [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") para estabelecer uma nova senha para a conta.

Note

Embora seja possível "redefinir" uma senha expirada definindo-a com seu valor atual, é preferível, como uma boa política, escolher uma senha diferente.

`password_last_changed` é uma coluna `TIMESTAMP` indicando quando a senha foi alterada pela última vez. O valor não é `NULL` apenas para contas que usam métodos de autenticação internos do MySQL (contas que usam um plugin de autenticação de `mysql_native_password` ou `sha256_password`). O valor é `NULL` para outras contas, como aquelas autenticadas usando um sistema de autenticação externo.

`password_last_changed` é atualizada pelas instruções [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") e [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement"), e por instruções [`GRANT`](grant.html "13.7.1.4 GRANT Statement") que criam uma conta ou alteram a senha de uma conta.

`password_lifetime` indica o tempo de vida da senha da conta, em dias. Se a senha ultrapassou seu tempo de vida (avaliado usando a coluna `password_last_changed`), o servidor considera a senha expirada quando os clientes se conectam usando a conta. Um valor de *`N`* maior que zero significa que a senha deve ser alterada a cada *`N`* dias. Um valor de 0 desabilita a expiração automática de senhas. Se o valor for `NULL` (o padrão), a política de expiração global se aplica, conforme definido pela variável de sistema [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime).

`account_locked` indica se a conta está bloqueada (consulte [Seção 6.2.15, “Bloqueio de Conta”](account-locking.html "6.2.15 Account Locking")).

#### As Grant Tables tables_priv e columns_priv

Durante o segundo estágio do controle de acesso, o servidor executa a verificação de request para garantir que cada cliente tenha privilégios suficientes para cada request que emite. Além das Grant Tables `user` e `db`, o servidor também pode consultar as tabelas `tables_priv` e `columns_priv` para requests que envolvem tabelas. Estas últimas tabelas fornecem um controle de privilégio mais refinado nos níveis de tabela e coluna. Elas possuem as colunas mostradas na tabela a seguir.

**Tabela 6.4 Colunas das Tabelas tables_priv e columns_priv**

<table><thead><tr> <th>Nome da Tabela</th> <th><code>tables_priv</code></th> <th><code>columns_priv</code></th> </tr></thead><tbody><tr> <th><span><strong>Colunas de Escopo</strong></span></th> <td><code>Host</code></td> <td><code>Host</code></td> </tr><tr> <th></th> <td><code>Db</code></td> <td><code>Db</code></td> </tr><tr> <th></th> <td><code>User</code></td> <td><code>User</code></td> </tr><tr> <th></th> <td><code>Table_name</code></td> <td><code>Table_name</code></td> </tr><tr> <th></th> <td></td> <td><code>Column_name</code></td> </tr><tr> <th><span><strong>Colunas de Privilégio</strong></span></th> <td><code>Table_priv</code></td> <td><code>Column_priv</code></td> </tr><tr> <th></th> <td><code>Column_priv</code></td> <td></td> </tr><tr> <th><span><strong>Outras Colunas</strong></span></th> <td><code>Timestamp</code></td> <td><code>Timestamp</code></td> </tr><tr> <th></th> <td><code>Grantor</code></td> <td></td> </tr></tbody></table>

As colunas `Timestamp` e `Grantor` são definidas com o timestamp atual e o valor de [`CURRENT_USER`](information-functions.html#function_current-user), respectivamente, mas são inutilizadas de outra forma.

#### A Grant Table procs_priv

Para verificação de requests que envolvem stored routines, o servidor pode consultar a tabela `procs_priv`, que possui as colunas mostradas na tabela a seguir.

**Tabela 6.5 Colunas da Tabela procs_priv**

<table><thead><tr> <th>Nome da Tabela</th> <th><code>procs_priv</code></th> </tr></thead><tbody><tr> <td><span><strong>Colunas de Escopo</strong></span></td> <td><code>Host</code></td> </tr><tr> <td></td> <td><code>Db</code></td> </tr><tr> <td></td> <td><code>User</code></td> </tr><tr> <td></td> <td><code>Routine_name</code></td> </tr><tr> <td></td> <td><code>Routine_type</code></td> </tr><tr> <td><span><strong>Colunas de Privilégio</strong></span></td> <td><code>Proc_priv</code></td> </tr><tr> <td><span><strong>Outras Colunas</strong></span></td> <td><code>Timestamp</code></td> </tr><tr> <td></td> <td><code>Grantor</code></td> </tr></tbody></table>

A coluna `Routine_type` é uma coluna [`ENUM`](enum.html "11.3.5 The ENUM Type") com valores `'FUNCTION'` ou `'PROCEDURE'` para indicar o tipo de rotina a que a linha se refere. Esta coluna permite que os privilégios sejam concedidos separadamente para uma function e uma procedure com o mesmo nome.

As colunas `Timestamp` e `Grantor` são inutilizadas.

#### A Grant Table proxies_priv

A tabela `proxies_priv` registra informações sobre contas proxy. Ela possui as seguintes colunas:

* `Host`, `User`: A conta proxy; ou seja, a conta que possui o privilégio [`PROXY`](privileges-provided.html#priv_proxy) para a conta proxyiada.

* `Proxied_host`, `Proxied_user`: A conta proxyiada.

* `Grantor`, `Timestamp`: Inutilizadas.

* `With_grant`: Se a conta proxy pode conceder o privilégio [`PROXY`](privileges-provided.html#priv_proxy) a outras contas.

Para que uma conta possa conceder o privilégio [`PROXY`](privileges-provided.html#priv_proxy) a outras contas, ela deve ter uma linha na tabela `proxies_priv` com `With_grant` definido como 1 e `Proxied_host` e `Proxied_user` definidos para indicar a conta ou contas para as quais o privilégio pode ser concedido. Por exemplo, a conta `'root'@'localhost'` criada durante a instalação do MySQL tem uma linha na tabela `proxies_priv` que permite a concessão do privilégio `PROXY` para `''@''`, ou seja, para todos os usuários e todos os hosts. Isso permite que `root` configure usuários proxy, bem como delegue a outras contas a autoridade para configurar usuários proxy. Consulte [Seção 6.2.14, “Usuários Proxy”](proxy-users.html "6.2.14 Proxy Users").

#### Propriedades da Coluna de Escopo das Grant Tables

As colunas de escopo nas Grant Tables contêm strings. O valor padrão para cada uma é a string vazia. A tabela a seguir mostra o número de caracteres permitidos em cada coluna.

**Tabela 6.6 Comprimentos das Colunas de Escopo das Grant Tables**

<table><thead><tr> <th>Nome da Coluna</th> <th>Máximo de Caracteres Permitidos</th> </tr></thead><tbody><tr> <td><code>Host</code>, <code>Proxied_host</code></td> <td>60</td> </tr><tr> <td><code>User</code>, <code>Proxied_user</code></td> <td>32</td> </tr><tr> <td><code>Password</code></td> <td>41</td> </tr><tr> <td><code>Db</code></td> <td>64</td> </tr><tr> <td><code>Table_name</code></td> <td>64</td> </tr><tr> <td><code>Column_name</code></td> <td>64</td> </tr><tr> <td><code>Routine_name</code></td> <td>64</td> </tr></tbody></table>

Os valores de `Host` e `Proxied_host` são convertidos para minúsculas antes de serem armazenados nas Grant Tables.

Para fins de verificação de acesso, as comparações dos valores de `User`, `Proxied_user`, `Password`, `authentication_string`, `Db` e `Table_name` diferenciam maiúsculas de minúsculas (case-sensitive). As comparações dos valores de `Host`, `Proxied_host`, `Column_name` e `Routine_name` não diferenciam maiúsculas de minúsculas (not case-sensitive).

#### Propriedades das Colunas de Privilégio das Grant Tables

As tabelas `user` e `db` listam cada privilégio em uma coluna separada que é declarada como `ENUM('N','Y') DEFAULT 'N'`. Em outras palavras, cada privilégio pode ser desabilitado ou habilitado, sendo o padrão desabilitado.

As tabelas `tables_priv`, `columns_priv` e `procs_priv` declaram as colunas de privilégio como colunas [`SET`](set.html "11.3.6 The SET Type"). Os valores nessas colunas podem conter qualquer combinação dos privilégios controlados pela tabela. Apenas os privilégios listados no valor da coluna são habilitados.

**Tabela 6.7 Valores de Colunas de Privilégio Tipo Set**

<table><thead><tr> <th>Nome da Tabela</th> <th>Nome da Coluna</th> <th>Elementos SET Possíveis</th> </tr></thead><tbody><tr> <th><code>tables_priv</code></th> <td><code>Table_priv</code></td> <td><code>'Select', 'Insert', 'Update', 'Delete', 'Create', 'Drop', 'Grant', 'References', 'Index', 'Alter', 'Create View', 'Show view', 'Trigger'</code></td> </tr><tr> <th><code>tables_priv</code></th> <td><code>Column_priv</code></td> <td><code>'Select', 'Insert', 'Update', 'References'</code></td> </tr><tr> <th><code>columns_priv</code></th> <td><code>Column_priv</code></td> <td><code>'Select', 'Insert', 'Update', 'References'</code></td> </tr><tr> <th><code>procs_priv</code></th> <td><code>Proc_priv</code></td> <td><code>'Execute', 'Alter Routine', 'Grant'</code></td> </tr></tbody></table>

Apenas a tabela `user` especifica privilégios administrativos, como [`RELOAD`](privileges-provided.html#priv_reload) e [`SHUTDOWN`](privileges-provided.html#priv_shutdown). Operações administrativas são operações no próprio servidor e não são específicas de Database, portanto, não há razão para listar esses privilégios nas outras Grant Tables. Consequentemente, o servidor precisa consultar apenas a tabela `user` para determinar se um usuário pode realizar uma operação administrativa.

O privilégio [`FILE`](privileges-provided.html#priv_file) também é especificado apenas na tabela `user`. Não é um privilégio administrativo como tal, mas a capacidade de um usuário ler ou gravar arquivos no host do servidor é independente do Database que está sendo acessado.