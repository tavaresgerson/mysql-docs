### 6.2.3 Tabelas de subsídios

O banco de dados do sistema `mysql` inclui várias tabelas de concessão que contêm informações sobre as contas de usuário e os privilégios que elas possuem. Esta seção descreve essas tabelas. Para informações sobre outras tabelas no banco de dados do sistema, consulte Seção 5.3, “O Banco de Dados do Sistema mysql”.

A discussão aqui descreve a estrutura subjacente das tabelas de permissões e como o servidor usa seu conteúdo ao interagir com os clientes. No entanto, normalmente você não modifica as tabelas de permissões diretamente. As modificações ocorrem indiretamente quando você usa declarações de gerenciamento de contas, como `CREATE USER`, `GRANT` e `REVOKE` para configurar contas e controlar os privilégios disponíveis para cada uma. Veja Seção 13.7.1, “Declarações de Gerenciamento de Contas”. Quando você usa essas declarações para realizar manipulações de contas, o servidor modifica as tabelas de permissões em seu nome.

Nota

A modificação direta das tabelas de concessão usando instruções como `INSERT`, `UPDATE` ou `DELETE` é desencorajada e feita por sua própria conta e risco. O servidor tem a liberdade de ignorar linhas que se tornam malformadas como resultado dessas modificações.

A partir do MySQL 5.7.18, para qualquer operação que modifique uma tabela de concessão, o servidor verifica se a tabela possui a estrutura esperada e produz um erro se não for o caso. Para atualizar as tabelas para a estrutura esperada, execute o procedimento de atualização do MySQL. Consulte Seção 2.10, “Atualizando o MySQL”.

- Resumo da Tabela de Créditos
- Tabelas de permissões do usuário e da base de dados
- As tabelas\_priv e as colunas\_priv Conceder Tabelas
- Tabela de Concessões procs\_priv
- A tabela de concessões proxies\_priv
- Propriedades da coluna de escopo da tabela de concessão Grant Table Scope Column Properties
- Propriedades da coluna de privilégio da tabela de concessão

#### Resumo da Tabela de Concessões

Essas tabelas de banco de dados `mysql` contêm informações de concessão:

- `user`: Contas de usuário, privilégios globais e outras colunas não de privilégio.

- `db`: Privilégios de nível de banco de dados.

- `tables_priv`: Privilégios de nível de tabela.

- `columns_priv`: Privilégios de nível de coluna.

- `procs_priv`: Permissões de procedimentos armazenados e funções.

- `proxies_priv`: Privilegios do usuário proxy.

Cada tabela de concessão contém colunas de escopo e colunas de privilégio:

- As colunas de escopo determinam o escopo de cada linha nas tabelas; ou seja, o contexto em que a linha se aplica. Por exemplo, uma linha da tabela `user` com os valores `Host` e `User` de `'h1.example.net'` e `'bob'` se aplica à autenticação de conexões feitas ao servidor a partir do host `h1.example.net` por um cliente que especifica um nome de usuário de `bob`. Da mesma forma, uma linha da tabela `db` com os valores das colunas `Host`, `User` e `Db` de `'h1.example.net'`, `'bob'` e `'reports'` se aplica quando `bob` se conecta a partir do host `h1.example.net` para acessar o banco de dados `reports`. As tabelas `tables_priv` e `columns_priv` contêm colunas de escopo que indicam tabelas ou combinações de tabela/coluna às quais cada linha se aplica. As colunas de escopo `procs_priv` indicam a rotina armazenada à qual cada linha se aplica.

- As colunas de privilégio indicam quais privilégios uma linha de tabela concede, ou seja, quais operações ela permite que sejam realizadas. O servidor combina as informações das várias tabelas de concessão para formar uma descrição completa dos privilégios de um usuário. Seção 6.2.6, “Controle de Acesso, Etapa 2: Verificação de Solicitação”, descreve as regras para isso.

Além disso, uma tabela de concessão pode conter colunas usadas para fins diferentes da avaliação de escopo ou privilégio.

O servidor utiliza as tabelas de concessão da seguinte maneira:

- As colunas de escopo da tabela `user` determinam se as conexões recebidas devem ser rejeitadas ou permitidas. Para conexões permitidas, quaisquer privilégios concedidos na tabela `user` indicam os privilégios globais do usuário. Quaisquer privilégios concedidos nesta tabela se aplicam a *todas* as bases de dados no servidor.

  Cuidado

  Como um privilégio global é considerado um privilégio para todas as bases de dados, *qualquer* privilégio global permite que um usuário veja todos os nomes de bases de dados com `SHOW DATABASES` ou examinando a tabela `INFORMATION_SCHEMA` `SCHEMATA`.

- As colunas de escopo da tabela `db` determinam quais usuários podem acessar quais bancos de dados de quais hosts. As colunas de privilégio determinam as operações permitidas. Um privilégio concedido ao nível do banco de dados se aplica ao banco de dados e a todos os objetos no banco de dados, como tabelas e programas armazenados.

- As tabelas `tables_priv` e `columns_priv` são semelhantes à tabela `db`, mas são mais detalhadas: Elas se aplicam aos níveis de tabela e coluna, em vez de ao nível do banco de dados. Um privilégio concedido ao nível da tabela se aplica à tabela e a todas as suas colunas. Um privilégio concedido ao nível da coluna se aplica apenas a uma coluna específica.

- A tabela `procs_priv` se aplica a rotinas armazenadas (procedimentos e funções armazenadas). Um privilégio concedido ao nível da rotina aplica-se apenas a um único procedimento ou função.

- A tabela `proxies_priv` indica quais usuários podem atuar como proxies para outros usuários e se um usuário pode conceder o privilégio `PROXY` a outros usuários.

O servidor lê o conteúdo das tabelas de concessão na memória quando ele é iniciado. Você pode dizer ao servidor para recarregar as tabelas emitindo uma declaração `FLUSH PRIVILEGES` ou executando um comando **mysqladmin flush-privileges** ou **mysqladmin reload**. As alterações nas tabelas de concessão entram em vigor conforme indicado em Seção 6.2.9, “Quando as Alterações de Privilégios Entram em Vigor”.

Quando você modifica uma conta, é uma boa ideia verificar se suas alterações tiveram o efeito desejado. Para verificar os privilégios de uma conta específica, use a instrução `SHOW GRANTS`. Por exemplo, para determinar os privilégios concedidos a uma conta com os valores de nome do usuário e nome do host `bob` e `pc84.example.com`, use esta instrução:

```sql
SHOW GRANTS FOR 'bob'@'pc84.example.com';
```

Para exibir propriedades não privilegiadas de uma conta, use `SHOW CREATE USER`:

```sql
SHOW CREATE USER 'bob'@'pc84.example.com';
```

#### Tabelas de usuários e tabelas de permissões do banco de dados

O servidor utiliza as tabelas `user` e `db` no banco de dados `mysql` nas duas primeiras etapas do controle de acesso (consulte Seção 6.2, “Controle de Acesso e Gerenciamento de Contas”). As colunas das tabelas `user` e `db` são mostradas aqui.

**Tabela 6.3 Colunas de tabelas usuário e banco de dados**

<table><col style="width: 40%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th scope="col">Nome da tabela</th> <th scope="col">[[PH_HTML_CODE_<code class="literal">Insert_priv</code>]</th> <th scope="col">[[PH_HTML_CODE_<code class="literal">Insert_priv</code>]</th> </tr></thead><tbody><tr> <th scope="row"><span class="bold"><strong>Colunas de escopo</strong></span></th> <td>[[PH_HTML_CODE_<code class="literal">Update_priv</code>]</td> <td>[[PH_HTML_CODE_<code class="literal">Delete_priv</code>]</td> </tr><tr> <th scope="row"></th> <td>[[PH_HTML_CODE_<code class="literal">Delete_priv</code>]</td> <td>[[PH_HTML_CODE_<code class="literal">Index_priv</code>]</td> </tr><tr> <th scope="row"></th> <td></td> <td>[[PH_HTML_CODE_<code class="literal">Index_priv</code>]</td> </tr><tr> <th scope="row"><span class="bold"><strong>Colunas de privilégio</strong></span></th> <td>[[PH_HTML_CODE_<code class="literal">Alter_priv</code>]</td> <td>[[PH_HTML_CODE_<code class="literal">Alter_priv</code>]</td> </tr><tr> <th scope="row"></th> <td>[[PH_HTML_CODE_<code class="literal">Create_priv</code>]</td> <td>[[<code class="literal">Insert_priv</code>]]</td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">db</code><code class="literal">Insert_priv</code>]</td> <td>[[<code class="literal">Update_priv</code>]]</td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Delete_priv</code>]]</td> <td>[[<code class="literal">Delete_priv</code>]]</td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Index_priv</code>]]</td> <td>[[<code class="literal">Index_priv</code>]]</td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Alter_priv</code>]]</td> <td>[[<code class="literal">Alter_priv</code>]]</td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Create_priv</code>]]</td> <td>[[<code class="literal">Host</code><code class="literal">Insert_priv</code>]</td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Host</code><code class="literal">Insert_priv</code>]</td> <td>[[<code class="literal">Host</code><code class="literal">Update_priv</code>]</td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Host</code><code class="literal">Delete_priv</code>]</td> <td>[[<code class="literal">Host</code><code class="literal">Delete_priv</code>]</td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Host</code><code class="literal">Index_priv</code>]</td> <td>[[<code class="literal">Host</code><code class="literal">Index_priv</code>]</td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Host</code><code class="literal">Alter_priv</code>]</td> <td>[[<code class="literal">Host</code><code class="literal">Alter_priv</code>]</td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Host</code><code class="literal">Create_priv</code>]</td> <td>[[<code class="literal">Host</code><code class="literal">Insert_priv</code>]</td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Host</code><code class="literal">Insert_priv</code>]</td> <td>[[<code class="literal">Host</code><code class="literal">Update_priv</code>]</td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Host</code><code class="literal">Delete_priv</code>]</td> <td>[[<code class="literal">Host</code><code class="literal">Delete_priv</code>]</td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Host</code><code class="literal">Index_priv</code>]</td> <td>[[<code class="literal">Host</code><code class="literal">Index_priv</code>]</td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Host</code><code class="literal">Alter_priv</code>]</td> <td>[[<code class="literal">Host</code><code class="literal">Alter_priv</code>]</td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Host</code><code class="literal">Create_priv</code>]</td> <td>[[<code class="literal">User</code><code class="literal">Insert_priv</code>]</td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">User</code><code class="literal">Insert_priv</code>]</td> <td>[[<code class="literal">User</code><code class="literal">Update_priv</code>]</td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">User</code><code class="literal">Delete_priv</code>]</td> <td>[[<code class="literal">User</code><code class="literal">Delete_priv</code>]</td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">User</code><code class="literal">Index_priv</code>]</td> <td></td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">User</code><code class="literal">Index_priv</code>]</td> <td></td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">User</code><code class="literal">Alter_priv</code>]</td> <td></td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">User</code><code class="literal">Alter_priv</code>]</td> <td></td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">User</code><code class="literal">Create_priv</code>]</td> <td></td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Db</code><code class="literal">Insert_priv</code>]</td> <td></td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Db</code><code class="literal">Insert_priv</code>]</td> <td></td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Db</code><code class="literal">Update_priv</code>]</td> <td></td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Db</code><code class="literal">Delete_priv</code>]</td> <td></td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Db</code><code class="literal">Delete_priv</code>]</td> <td></td> </tr><tr> <th scope="row"><span class="bold"><strong>Colunas de segurança</strong></span></th> <td>[[<code class="literal">Db</code><code class="literal">Index_priv</code>]</td> <td></td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Db</code><code class="literal">Index_priv</code>]</td> <td></td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Db</code><code class="literal">Alter_priv</code>]</td> <td></td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Db</code><code class="literal">Alter_priv</code>]</td> <td></td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Db</code><code class="literal">Create_priv</code>]</td> <td></td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">User</code><code class="literal">Insert_priv</code>]</td> <td></td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">User</code><code class="literal">Insert_priv</code>]</td> <td></td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">User</code><code class="literal">Update_priv</code>]</td> <td></td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">User</code><code class="literal">Delete_priv</code>]</td> <td></td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">User</code><code class="literal">Delete_priv</code>]</td> <td></td> </tr><tr> <th scope="row"><span class="bold"><strong>Colunas de controle de recursos</strong></span></th> <td>[[<code class="literal">User</code><code class="literal">Index_priv</code>]</td> <td></td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">User</code><code class="literal">Index_priv</code>]</td> <td></td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">User</code><code class="literal">Alter_priv</code>]</td> <td></td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">User</code><code class="literal">Alter_priv</code>]</td> <td></td> </tr></tbody></table>

As colunas `user` `plugin` e `authentication_string` da tabela `plugin` armazenam informações de autenticação do plugin e credenciais.

O servidor usa o plugin nomeado na coluna `plugin` de uma linha de conta para autenticar as tentativas de conexão para a conta.

A coluna `plugin` deve estar preenchida. Ao iniciar e durante a execução, quando o comando `FLUSH PRIVILEGES` (flush.html#flush-privileges) é executado, o servidor verifica as linhas da tabela `user`. Para qualquer linha com a coluna `plugin` vazia, o servidor escreve uma mensagem de aviso no log de erros deste formulário:

```sql
[Warning] User entry 'user_name'@'host_name' has an empty plugin
value. The user will be ignored and no one can login with this user
anymore.
```

Para resolver esse problema, consulte Seção 6.4.1.3, “Migrando para fora da hashing de senhas pré-4.1 e do plugin mysql\_old\_password”.

A coluna `password_expired` permite que os DBAs expiram as senhas das contas e exijam que os usuários redefinam suas senhas. O valor padrão de `password_expired` é `'N'`, mas pode ser definido como `'Y'` com a instrução `ALTER USER`. Após a expiração da senha de uma conta, todas as operações realizadas pela conta em conexões subsequentes ao servidor resultam em um erro até que o usuário emita uma instrução `ALTER USER` para estabelecer uma nova senha da conta.

Nota

Embora seja possível "redefinir" uma senha expirada, definindo-a para seu valor atual, é preferível, por questão de boa política, escolher uma senha diferente.

`password_last_changed` é uma coluna `TIMESTAMP` que indica quando a senha foi alterada pela última vez. O valor não é `NULL` apenas para contas que usam métodos de autenticação integrados do MySQL (contas que usam um plugin de autenticação de `mysql_native_password` ou `sha256_password`). O valor é `NULL` para outras contas, como aquelas autenticadas usando um sistema de autenticação externo.

`password_last_changed` é atualizado pelas instruções `CREATE USER` (create-user.html), `ALTER USER` (alter-user.html) e `SET PASSWORD` (set-password.html), e pelas instruções `GRANT` (grant.html) que criam uma conta ou alteram a senha de uma conta.

`password_lifetime` indica a duração da senha da conta, em dias. Se a senha estiver vencida (avaliada usando a coluna `password_last_changed`), o servidor considera que a senha expirou quando os clientes se conectam usando a conta. Um valor de *`N`* maior que zero significa que a senha deve ser alterada a cada *`N`* dias. Um valor de 0 desabilita a expiração automática da senha. Se o valor for `NULL` (o padrão), a política de expiração global será aplicada, conforme definido pela variável de sistema `default_password_lifetime`.

`account_locked` indica se a conta está bloqueada (consulte Seção 6.2.15, “Bloqueio de Conta”).

#### As tabelas\_priv e as colunas\_priv Conceder tabelas

Durante a segunda etapa do controle de acesso, o servidor realiza a verificação da solicitação para garantir que cada cliente tenha privilégios suficientes para cada solicitação que emite. Além das tabelas `user` e `db`, o servidor também pode consultar as tabelas `tables_priv` e `columns_priv` para solicitações que envolvem tabelas. Essas últimas tabelas fornecem um controle de privilégio mais preciso aos níveis de tabela e coluna. Elas possuem as colunas mostradas na tabela a seguir.

**Tabela 6.4 Colunas da tabela tables\_priv e colunas da tabela columns\_priv**

<table><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col">Nome da tabela</th> <th scope="col">[[PH_HTML_CODE_<code class="literal">Column_name</code>]</th> <th scope="col">[[PH_HTML_CODE_<code class="literal">Column_name</code>]</th> </tr></thead><tbody><tr> <th scope="row"><span class="bold"><strong>Colunas de escopo</strong></span></th> <td>[[PH_HTML_CODE_<code class="literal">Column_priv</code>]</td> <td>[[PH_HTML_CODE_<code class="literal">Column_priv</code>]</td> </tr><tr> <th scope="row"></th> <td>[[PH_HTML_CODE_<code class="literal">Timestamp</code>]</td> <td>[[PH_HTML_CODE_<code class="literal">Timestamp</code>]</td> </tr><tr> <th scope="row"></th> <td>[[PH_HTML_CODE_<code class="literal">Grantor</code>]</td> <td>[[<code class="literal">User</code>]]</td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Table_name</code>]]</td> <td>[[<code class="literal">Table_name</code>]]</td> </tr><tr> <th scope="row"></th> <td></td> <td>[[<code class="literal">Column_name</code>]]</td> </tr><tr> <th scope="row"><span class="bold"><strong>Colunas de privilégio</strong></span></th> <td>[[<code class="literal">columns_priv</code><code class="literal">Column_name</code>]</td> <td>[[<code class="literal">Column_priv</code>]]</td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Column_priv</code>]]</td> <td></td> </tr><tr> <th scope="row"><span class="bold"><strong>Outras colunas</strong></span></th> <td>[[<code class="literal">Timestamp</code>]]</td> <td>[[<code class="literal">Timestamp</code>]]</td> </tr><tr> <th scope="row"></th> <td>[[<code class="literal">Grantor</code>]]</td> <td></td> </tr></tbody></table>

As colunas `Timestamp` e `Grantor` são definidas para o timestamp atual e o valor de `CURRENT_USER`, respectivamente, mas, de outra forma, não são utilizadas.

#### A tabela de concessão procs\_priv

Para a verificação de solicitações que envolvem rotinas armazenadas, o servidor pode consultar a tabela `procs_priv`, que possui as colunas mostradas na tabela a seguir.

**Tabela 6.5 Colunas da tabela procs\_priv**

<table><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>Nome da tabela</th> <th>[[<code class="literal">procs_priv</code>]]</th> </tr></thead><tbody><tr> <td><span class="bold"><strong>Colunas de escopo</strong></span></td> <td>[[<code class="literal">Host</code>]]</td> </tr><tr> <td></td> <td>[[<code class="literal">Db</code>]]</td> </tr><tr> <td></td> <td>[[<code class="literal">User</code>]]</td> </tr><tr> <td></td> <td>[[<code class="literal">Routine_name</code>]]</td> </tr><tr> <td></td> <td>[[<code class="literal">Routine_type</code>]]</td> </tr><tr> <td><span class="bold"><strong>Colunas de privilégio</strong></span></td> <td>[[<code class="literal">Proc_priv</code>]]</td> </tr><tr> <td><span class="bold"><strong>Outras colunas</strong></span></td> <td>[[<code class="literal">Timestamp</code>]]</td> </tr><tr> <td></td> <td>[[<code class="literal">Grantor</code>]]</td> </tr></tbody></table>

A coluna `Routine_type` é uma coluna `[ENUM]` com valores de `'FUNCTION'` ou `'PROCEDURE'` para indicar o tipo de rotina a que a linha se refere. Essa coluna permite que privilégios sejam concedidos separadamente para uma função e um procedimento com o mesmo nome.

As colunas `Timestamp` e `Grantor` não são usadas.

#### A tabela de concessão proxies\_priv

A tabela `proxies_priv` registra informações sobre contas de proxy. Ela possui as seguintes colunas:

- `Host`, `User`: A conta do proxy; ou seja, a conta que possui o privilégio `PROXY` para a conta proxy.

- `Proxied_host`, `Proxied_user`: A conta proxy.

- `Grantor`, `Timestamp`: Não utilizado.

- `With_grant`: Se a conta de proxy pode conceder o privilégio `PROXY` a outras contas.

Para que uma conta possa conceder o privilégio `PROXY` a outras contas, ela deve ter uma linha na tabela `proxies_priv` com `With_grant` definida como 1 e `Proxied_host` e `Proxied_user` definidos para indicar a conta ou contas para as quais o privilégio pode ser concedido. Por exemplo, a conta `'root'@'localhost'` criada durante a instalação do MySQL tem uma linha na tabela `proxies_priv` que permite conceder o privilégio `PROXY` para `''@''`, ou seja, para todos os usuários e todos os hosts. Isso permite que o `root` configure usuários proxy, bem como delegar a outras contas a autoridade para configurar usuários proxy. Veja Seção 6.2.14, “Usuários Proxy”.

#### Atribuir propriedades de coluna ao escopo da tabela

As colunas de escopo nas tabelas de concessão contêm cadeias de caracteres. O valor padrão para cada uma é a cadeia vazia. A tabela a seguir mostra o número de caracteres permitidos em cada coluna.

**Tabela 6.6 Comprimento das Colunas da Tabela de Concessão**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Nome da Coluna</th> <th>Máximo de caracteres permitidos</th> </tr></thead><tbody><tr> <td>[[<code class="literal">Host</code>]], [[<code class="literal">Proxied_host</code>]]</td> <td>60</td> </tr><tr> <td>[[<code class="literal">User</code>]], [[<code class="literal">Proxied_user</code>]]</td> <td>32</td> </tr><tr> <td>[[<code class="literal">Password</code>]]</td> <td>41</td> </tr><tr> <td>[[<code class="literal">Db</code>]]</td> <td>64</td> </tr><tr> <td>[[<code class="literal">Table_name</code>]]</td> <td>64</td> </tr><tr> <td>[[<code class="literal">Column_name</code>]]</td> <td>64</td> </tr><tr> <td>[[<code class="literal">Routine_name</code>]]</td> <td>64</td> </tr></tbody></table>

Os valores `Host` e `Proxied_host` são convertidos para minúsculas antes de serem armazenados nas tabelas de concessão.

Para fins de verificação de acesso, as comparações dos valores de `User`, `Proxied_user`, `Password`, `authentication_string`, `Db` e `Table_name` são sensíveis ao caso. As comparações dos valores de `Host`, `Proxied_host`, `Column_name` e `Routine_name` não são sensíveis ao caso.

#### Atribuir propriedades de coluna de privilégio à tabela de concessão

As tabelas `user` e `db` listam cada privilégio em uma coluna separada, declarada como `ENUM('N','Y') DEFAULT 'N'`. Em outras palavras, cada privilégio pode ser desativado ou ativado, com o padrão sendo desativado.

As tabelas `tables_priv`, `columns_priv` e `procs_priv` declaram as colunas de privilégio como colunas `SET` (set.html). Os valores nessas colunas podem conter qualquer combinação dos privilégios controlados pela tabela. Apenas os privilégios listados no valor da coluna estão habilitados.

**Tabela 6.7 Valores das Colunas de Privilegio de Tipo de Conjunto**

<table><col style="width: 20%"/><col style="width: 25%"/><col style="width: 45%"/><thead><tr> <th scope="col">Nome da tabela</th> <th scope="col">Nome da Coluna</th> <th scope="col">Possíveis elementos do conjunto</th> </tr></thead><tbody><tr> <th scope="row">[[PH_HTML_CODE_<code class="literal">Proc_priv</code>]</th> <td>[[PH_HTML_CODE_<code class="literal">Proc_priv</code>]</td> <td>[[<code class="literal">'Select', 'Insert', 'Update', 'Delete', 'Create', 'Drop', 'Grant', 'References', 'Index', 'Alter', 'Create View', 'Show view', 'Trigger'</code>]]</td> </tr><tr> <th scope="row">[[<code class="literal">tables_priv</code>]]</th> <td>[[<code class="literal">Column_priv</code>]]</td> <td>[[<code class="literal">'Select', 'Insert', 'Update', 'References'</code>]]</td> </tr><tr> <th scope="row">[[<code class="literal">columns_priv</code>]]</th> <td>[[<code class="literal">Column_priv</code>]]</td> <td>[[<code class="literal">'Select', 'Insert', 'Update', 'References'</code>]]</td> </tr><tr> <th scope="row">[[<code class="literal">procs_priv</code>]]</th> <td>[[<code class="literal">Proc_priv</code>]]</td> <td>[[<code class="literal">Table_priv</code><code class="literal">Proc_priv</code>]</td> </tr></tbody></table>

Apenas a tabela `user` especifica privilégios administrativos, como `RELOAD` e `SHUTDOWN`. As operações administrativas são operações no próprio servidor e não são específicas do banco de dados, portanto, não há motivo para listar esses privilégios nas outras tabelas de concessão. Consequentemente, o servidor precisa consultar apenas a tabela `user` para determinar se um usuário pode realizar uma operação administrativa.

O privilégio `FILE` também é especificado apenas na tabela `user`. Não é um privilégio administrativo em si, mas a capacidade de um usuário de ler ou escrever arquivos no host do servidor é independente do banco de dados a ser acessado.
