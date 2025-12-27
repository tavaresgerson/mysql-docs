### 8.2.3 Tabelas de Concessão

O banco de dados do sistema `mysql` inclui várias tabelas de concessão que contêm informações sobre as contas de usuário e os privilégios que elas possuem. Esta seção descreve essas tabelas. Para informações sobre outras tabelas no banco de dados do sistema, consulte a Seção 7.3, “O Esquema do Sistema mysql”.

A discussão aqui descreve a estrutura subjacente das tabelas de concessão e como o servidor usa seu conteúdo ao interagir com clientes. No entanto, normalmente você não modifica as tabelas de concessão diretamente. As modificações ocorrem indiretamente quando você usa declarações de gerenciamento de contas, como `CREATE USER`, `GRANT` e `REVOKE`, para configurar contas e controlar os privilégios disponíveis para cada uma. Consulte a Seção 15.7.1, “Declarações de Gerenciamento de Contas”. Quando você usa tais declarações para realizar manipulações de contas, o servidor modifica as tabelas de concessão em seu nome.

::: info Nota

A modificação direta das tabelas de concessão usando declarações como `INSERT`, `UPDATE` ou `DELETE` é desencorajada e feita por sua conta e risco. O servidor é livre para ignorar linhas que se tornam malformadas como resultado de tais modificações.

Para qualquer operação que modifique uma tabela de concessão, o servidor verifica se a tabela tem a estrutura esperada e produz um erro se não for o caso. Para atualizar as tabelas para a estrutura esperada, execute o procedimento de atualização do MySQL. Consulte o Capítulo 3, *Atualizando o MySQL*.

:::

*  Visão Geral da Tabela de Concessão
*  As Tabelas de Concessão `user` e `db`
*  As Tabelas de Concessão `tables_priv` e `columns_priv`
*  A Tabela de Concessão `procs_priv`
*  A Tabela de Concessão `proxies_priv`
*  A Tabela de Concessão `global_grants`
*  A Tabela de Concessão `default_roles`
*  A Tabela de Concessão `role_edges`
*  A Tabela de Concessão `password_history`
*  Propriedades de Coluna de Alcance da Tabela de Concessão
*  Propriedades de Coluna de Privilégio da Tabela de Concessão
*  Concorrência da Tabela de Concessão

*  `user`: Contas de usuário, privilégios globais estáticos e outras colunas não privilégios.
*  `global_grants`: Privilegios globais dinâmicos.
*  `db`: Privilegios de nível de banco de dados.
*  `tables_priv`: Privilegios de nível de tabela.
*  `columns_priv`: Privilegios de nível de coluna.
*  `procs_priv`: Privilegios de procedimentos armazenados e funções.
*  `proxies_priv`: Privilegios de usuário proxy.
*  `default_roles`: Papéis de usuário padrão.
*  `role_edges`: Bordas para subgrafos de papéis.
*  `password_history`: Histórico de alteração de senha.

Para obter informações sobre as diferenças entre privilégios globais estáticos e dinâmicos, consulte Privilegios Estáticos versus Dinâmicos.

As tabelas de concessão usam o mecanismo de armazenamento `InnoDB` e são transacionais. Cada instrução ou tem sucesso para todos os usuários nomeados ou é revertida e não tem efeito se ocorrer algum erro.

Cada tabela de concessão contém colunas de escopo e colunas de privilégio:

* As colunas de escopo determinam o escopo de cada linha nas tabelas; ou seja, o contexto em que a linha se aplica. Por exemplo, uma linha de tabela `user` com os valores `Host` e `User` de `'h1.example.net'` e `'bob'` se aplica à autenticação de conexões feitas ao servidor a partir do host `h1.example.net` por um cliente que especifica um nome de usuário de `bob`. Da mesma forma, uma linha de tabela `db` com os valores das colunas `Host`, `User` e `Db` de `'h1.example.net'`, `'bob'` e `'reports'` se aplica quando `bob` se conecta a partir do host `h1.example.net` para acessar o banco de dados `reports`. As tabelas `tables_priv` e `columns_priv` contêm colunas de escopo que indicam as tabelas ou combinações de tabela/coluna às quais cada linha se aplica. As colunas de escopo `procs_priv` indicam a rotina armazenada à qual cada linha se aplica.
* As colunas de privilégio indicam quais privilégios uma linha de tabela concede; ou seja, quais operações ela permite que sejam realizadas. O servidor combina as informações nas várias tabelas de concessão para formar uma descrição completa dos privilégios de um usuário. A seção 8.2.7, “Controle de Acesso, Etapa 2: Verificação de Solicitação”, descreve as regras para isso.

Além disso, uma tabela de concessão pode conter colunas usadas para fins diferentes da avaliação do escopo ou privilégio.

O servidor usa as tabelas de concessão da seguinte maneira:

* As colunas de escopo da tabela `user` determinam se as conexões recebidas devem ser rejeitadas ou permitidas. Para conexões permitidas, quaisquer privilégios concedidos na tabela `user` indicam os privilégios globais estáticos do usuário. Quaisquer privilégios concedidos nesta tabela se aplicam a *todas* as bases de dados no servidor.

Cuidado

Como qualquer privilégio global estático é considerado um privilégio para todas as bases de dados, qualquer privilégio global estático permite que um usuário veja todos os nomes de bases de dados com o comando `SHOW DATABASES` ou examinando a tabela `SCHEMATA` do `INFORMATION_SCHEMA`, exceto as bases de dados que foram restringidas ao nível da base de dados por revogações parciais.
* A tabela `global_grants` lista as atribuições atuais de privilégios globais dinâmicos para contas de usuário. Para cada linha, as colunas de escopo determinam qual usuário tem o privilégio nomeado na coluna de privilégio.
* As colunas de escopo da tabela `db` determinam quais usuários podem acessar quais bases de dados de quais hosts. As colunas de privilégio determinam as operações permitidas. Um privilégio concedido ao nível da base de dados aplica-se à base de dados e a todos os objetos na base de dados, como tabelas e programas armazenados.
* As tabelas `tables_priv` e `columns_priv` são semelhantes à tabela `db`, mas são mais detalhadas: Elas se aplicam aos níveis de tabela e coluna, em vez de ao nível da base de dados. Um privilégio concedido ao nível da tabela aplica-se à tabela e a todas as suas colunas. Um privilégio concedido ao nível da coluna aplica-se apenas a uma coluna específica.
* A tabela `procs_priv` se aplica a rotinas armazenadas (procedimentos e funções armazenados). Um privilégio concedido ao nível da rotina aplica-se apenas a um único procedimento ou função.
* A tabela `proxies_priv` indica quais usuários podem atuar como proxies para outros usuários e se um usuário pode conceder o privilégio `PROXY` a outros usuários.
* As tabelas `default_roles` e `role_edges` contêm informações sobre as relações de papel.
* A tabela `password_history` retém senhas escolhidas anteriormente para permitir restrições sobre a reutilização de senhas. Veja a Seção 8.2.15, “Gestão de Senhas”.

O servidor lê o conteúdo das tabelas de concessão na memória quando é iniciado. Você pode instruí-lo a recarregar as tabelas emitindo uma instrução `FLUSH PRIVILEGES` ou executando o comando `mysqladmin flush-privileges` ou `mysqladmin reload`. As alterações nas tabelas de concessão entram em vigor conforme indicado na Seção 8.2.13, “Quando as Alterações de Privilegios Entram em Vigor”.

Quando você modifica uma conta, é uma boa ideia verificar se suas alterações têm o efeito desejado. Para verificar os privilégios de uma conta específica, use a instrução `SHOW GRANTS`. Por exemplo, para determinar os privilégios concedidos a uma conta com valores de nome do usuário e nome do host de `bob` e `pc84.example.com`, use esta instrução:

```
SHOW GRANTS FOR 'bob'@'pc84.example.com';
```

Para exibir propriedades não de privilégio de uma conta, use `SHOW CREATE USER`:

```
SHOW CREATE USER 'bob'@'pc84.example.com';
```

#### As Tabelas de Concessão de Usuário e Banco de Dados

O servidor usa as tabelas `user` e `db` no banco de dados `mysql` nas duas primeiras etapas do controle de acesso (veja a Seção 8.2, “Controle de Acesso e Gerenciamento de Contas”). As colunas nas tabelas `user` e `db` são mostradas aqui.

**Tabela 8.4 Colunas das Tabelas de Concessão de Usuário e Banco de Dados**

<table>
   <thead>
      <tr>
         <th>Nome da Tabela</th>
         <th><code>user</code></th>
         <th><code>db</code></th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <th>Colunas de escopo</th>
         <td><code>Host</code></td>
         <td><code>Host</code></td>
      </tr>
      <tr>
         <th></th>
         <td><code>User</code></td>
         <td><code>Db</code></td>
      </tr>
      <tr>
         <th></th>
         <td></td>
         <td><code>User</code></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Select_priv</code></td>
         <td><code>Select_priv</code></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Insert_priv</code></td>
         <td><code>Insert_priv</code></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Update_priv</code></td>
         <td><code>Update_priv</code></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Delete_priv</code></td>
         <td><code>Delete_priv</code></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Index_priv</code></td>
         <td><code>Index_priv</code></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Alter_priv</code></td>
         <td><code>Alter_priv</code></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Create_priv</code></td>
         <td><code>Create_priv</code></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Drop_priv</code></td>
         <td><code>Drop_priv</code></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Grant_priv</code></td>
         <td><code>Grant_priv</code></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Create_view_priv</code></td>
         <td><code>Create_view_priv</code></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Show_view_priv</code></td>
         <td><code>Show_view_priv</code></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Create_routine_priv</code></td>
         <td><code>Create_routine_priv</code></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Alter_routine_priv</code></td>
         <td><code>Alter_routine_priv</code></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Execute_priv</code></td>
         <td><code>Execute_priv</code></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Trigger_priv</code></td>
         <td><code>Trigger_priv</code></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Event_priv</code></td>
         <td><code>Event_priv</code></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Create_tmp_table_priv</code></td>
         <td><code>Create_tmp_table_priv</code></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Lock_tables_priv</code></td>
         <td><code>Lock_tables_priv</code></td>
      </tr>
      <tr>
         <th></th>
         <td><code>References_priv</code></td>
         <td><code>References_priv</code></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Reload_priv</code></td>
         <td></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Shutdown_priv</code></td>
         <td></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Process_priv</code></td>
         <td></td>
      </tr>
      <tr>
         <th></th>
         <td><code>File_priv</code></td>
         <td></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Show_db_priv</code></td>
         <td></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Super_priv</code></td>
         <td></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Repl_slave_priv</code></td>
         <td></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Repl_client_priv</code></td>
         <td></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Create_user_priv</code></td>
         <td></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Create_tablespace_priv</code></td>
         <td></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Create_role_priv</code></td>
         <td></td>
      </tr>
      <tr>
         <th></th>
         <td><code>Drop_role_priv</code></td>
         <td></td>
      </tr>
      <tr>
         <th>Colunas de segurança</th>
         <td><code>ssl_type</code></td>
         <td></td>
      </tr>
      <tr>
         <th></th>
         <td><code>ssl_cipher</code></td>
         <td></td>
      </tr>
      <tr>
         <th></th>
         

As colunas `plugin` e `authentication_string` da tabela `user` armazenam informações de autenticação do plugin e das credenciais.

O servidor usa o plugin nomeado na coluna `plugin` de uma linha de conta para autenticar as tentativas de conexão para a conta.

A coluna `plugin` deve estar preenchida. No início e durante a execução, quando o `FLUSH PRIVILEGES` é executado, o servidor verifica as linhas da tabela `user`. Para qualquer linha com uma coluna `plugin` vazia, o servidor escreve uma mensagem de aviso no log de erro deste formulário:

```
[Warning] User entry 'user_name'@'host_name' has an empty plugin
value. The user will be ignored and no one can login with this user
anymore.
```

Para atribuir um plugin a uma conta que está faltando um, use a instrução `ALTER USER`.

A coluna `password_expired` permite que os DBA expiram as senhas das contas e exijam que os usuários redefram suas senhas. O valor padrão de `password_expired` é `'N'`, mas pode ser definido como `'Y'` com a instrução `ALTER USER`. Após a senha de uma conta ter expirado, todas as operações realizadas pela conta em conexões subsequentes ao servidor resultam em um erro até que o usuário emita uma instrução `ALTER USER` para estabelecer uma nova senha da conta.

::: info Nota

Embora seja possível "redefinir" uma senha expirada definindo-a para seu valor atual, é preferível, por questão de boa política, escolher uma senha diferente. Os DBA podem impor a não reutilização estabelecendo uma política apropriada de reutilização de senhas. Veja Política de Reutilização de Senhas.

:::

`password_last_changed` é uma coluna `TIMESTAMP` que indica quando a senha foi alterada pela última vez. O valor não é `NULL` apenas para contas que usam um plugin de autenticação interno do MySQL (`mysql_native_password`, que está desatualizado, `sha256_password`, que está desatualizado, ou `caching_sha2_password`). O valor é `NULL` para outras contas, como aquelas autenticadas usando um sistema de autenticação externo.

`password_last_changed` é atualizado pelas instruções `CREATE USER`, `ALTER USER` e `SET PASSWORD`, e por instruções `GRANT` que criam uma conta ou alteram a senha de uma conta.

`password_lifetime` indica a duração da senha da conta, em dias. Se a senha estiver vencida (avaliada usando a coluna `password_last_changed`), o servidor considera que a senha expirou quando os clientes se conectam usando a conta. Um valor de *`N`* maior que zero significa que a senha deve ser alterada a cada *`N`* dias. Um valor de 0 desativa a expiração automática da senha. Se o valor for `NULL` (o padrão), a política de expiração global é aplicada, conforme definido pela variável de sistema `default_password_lifetime`.

`account_locked` indica se a conta está bloqueada (consulte a Seção 8.2.20, “Bloqueio de Conta”).

`Password_reuse_history` é o valor da opção `PASSWORD HISTORY` para a conta, ou `NULL` para o histórico padrão.

`Password_reuse_time` é o valor da opção `PASSWORD REUSE INTERVAL` para a conta, ou `NULL` para o intervalo padrão.

`Password_require_current` corresponde ao valor da opção `PASSWORD REQUIRE` para a conta, conforme mostrado na tabela a seguir.

**Tabela 8.5 Valores permitidos para `Password_require_current`**

<table><thead><tr> <th>Valor de `Password_require_current`</th> <th>Opção correspondente `PASSWORD REQUIRE`</th> </tr></thead><tbody><tr> <td><code>'Y'</code></td> <td><code>PASSWORD REQUIRE CURRENT</code></td> </tr><tr> <td><code>'N'</code></td> <td><code>PASSWORD REQUIRE CURRENT OPTIONAL</code></td> </tr><tr> <td><code>NULL</code></td> <td><code>PASSWORD REQUIRE CURRENT DEFAULT</code></td> </tr></tbody></table>

`User_attributes` é uma coluna no formato JSON que armazena atributos da conta que não são armazenados em outras colunas. A `INFORMATION_SCHEMA` expõe esses atributos através da tabela `USER_ATTRIBUTES`.

A coluna `User_attributes` pode conter esses atributos:

* `additional_password`: A senha secundária, se houver. Consulte Suporte a Dupla Senha.
* `Restrictions`: Listas de restrições, se houver. As restrições são adicionadas por operações de revogação parcial. O valor do atributo é um array de elementos que possuem as chaves `Database` e `Restrictions`, indicando o nome de um banco de dados restrito e as restrições aplicáveis a ele (consulte Seção 8.2.12, “Restrição de Privilégios Usando Revogações Parciais”).
* `Password_locking`: As condições para o rastreamento de tentativas de login malsucedidas e o bloqueio temporário da conta, se houver (consulte Rastreamento de Tentativas de Login Malsucedidas e Bloqueio Temporário da Conta). O atributo `Password_locking` é atualizado de acordo com as opções `FAILED_LOGIN_ATTEMPTS` e `PASSWORD_LOCK_TIME` das instruções `CREATE USER` e `ALTER USER`. O valor do atributo é um hash com as chaves `failed_login_attempts` e `password_lock_time_days`, indicando o valor dessas opções que foram especificadas para a conta. Se uma chave estiver ausente, seu valor é implicitamente 0. Se o valor de uma chave for implicitamente ou explicitamente 0, a capacidade correspondente é desabilitada.
* `multi_factor_authentication`: As linhas na tabela de sistema `mysql.user` têm uma coluna `plugin` que indica um plugin de autenticação. Para a autenticação de um fator, esse plugin é o único fator de autenticação. Para as formas de autenticação multifator de dois ou três fatores, esse plugin corresponde ao primeiro fator de autenticação, mas informações adicionais devem ser armazenadas para os segundo e terceiro fatores. O atributo `multi_factor_authentication` contém essas informações.

O valor `multi_factor_authentication` é um array, onde cada elemento do array é um hash que descreve um fator de autenticação usando esses atributos:

+ `plugin`: O nome do plugin de autenticação.
+ `authentication_string`: O valor da string de autenticação.
+ `passwordless`: Uma flag que indica se o usuário deve ser usado sem uma senha (com um token de segurança como o único método de autenticação).
+ `requires_registration`: uma flag que define se a conta do usuário registrou um token de segurança.

Os primeiros e segundos elementos do array descrevem os fatores de autenticação multifatorial 2 e 3.

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

Para extrair um atributo particular, como `Restrictions`, faça isso:

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
      "plugin": "authentication_webauthn",
      "passwordless": 0,
      "authentication_string": "",
      "requires_registration": 1
    }
  ]
}
```

#### As Tabelas `tables_priv` e `columns_priv` de Concessão

Durante a segunda etapa do controle de acesso, o servidor realiza a verificação da solicitação para garantir que cada cliente tenha privilégios suficientes para cada solicitação que emite. Além das tabelas `user` e `db`, o servidor também pode consultar as tabelas `tables_priv` e `columns_priv` para solicitações que envolvem tabelas. Essas últimas tabelas fornecem controle de privilégio mais fino aos níveis de tabela e coluna. Elas têm as colunas mostradas na tabela a seguir.

**Tabela 8.6 Colunas das Tabelas `tables_priv` e `columns_priv`**

<table><thead><tr> <th>Nome da Tabela</th> <th><code>tables_priv</code></th> <th><code>columns_priv</code></th> </tr></thead><tbody><tr> <th>Colunas de escopo</th> <td><code>Host</code></td> <td><code>Host</code></td> </tr><tr> <th></th> <td><code>Db</code></td> <td><code>Db</code></td> </tr><tr> <th></th> <td><code>User</code></td> <td><code>User</code></td> </tr><tr> <th></th> <td><code>Table_name</code></td> <td><code>Table_name</code></td> </tr><tr> <th></th> <td></td> <td><code>Column_name</code></td> </tr><tr> <th>Colunas de privilégio</th> <td><code>Table_priv</code></td> <td><code>Column_priv</code></td> </tr><tr> <th></th> <td><code>Column_priv</code></td> <td></td> </tr><tr> <th>Outras colunas</th> <td><code>Timestamp</code></td> <td><code>Timestamp</code></td> </tr><tr> <th></th> <td><code>Grantor</code></td> <td></td> </tr></tbody></table>

As colunas `Timestamp` e `Grantor` são definidas como o timestamp atual e o valor `CURRENT_USER`, respectivamente, mas, de outra forma, não são utilizadas.

#### A Tabela de Concessão `procs_priv`

Para a verificação de solicitações que envolvem rotinas armazenadas, o servidor pode consultar a tabela `procs_priv`, que tem as colunas mostradas na tabela a seguir.

**Tabela 8.7 Colunas da Tabela `procs_priv`**

<table><thead><tr> <th>Nome da Tabela</th> <th><code>procs_priv</code></th> </tr></thead><tbody><tr> <td>Colunas de escopo</td> <td><code>Host</code></td> </tr><tr> <td></td> <td><code>Db</code></td> </tr><tr> <td></td> <td><code>User</code></td> </tr><tr> <td></td> <td><code>Routine_name</code></td> </tr><tr> <td></td> <td><code>Routine_type</code></td> </tr><tr> <td>Colunas de privilégio</td> <td><code>Proc_priv</code></td> </tr><tr> <td>Outras colunas</td> <td><code>Timestamp</code></td> </tr><tr> <td></td> <td><code>Grantor</code></td> </tr></tbody></table>

A coluna `Routine_type` é uma coluna `ENUM` com valores de `'FUNCTION'` ou `'PROCEDURE'` para indicar o tipo de rotina a que a linha se refere. Essa coluna permite que privilégios sejam concedidos separadamente para uma função e um procedimento com o mesmo nome.

As colunas `Timestamp` e `Grantor` estão desativadas.

#### A tabela de concessão `proxies_priv`

A tabela `proxies_priv` registra informações sobre contas de proxy. Ela tem essas colunas:

* `Host`, `User`: A conta de proxy; ou seja, a conta que tem o privilégio `PROXY` para a conta proxy.
* `Proxied_host`, `Proxied_user`: A conta proxy.
* `Grantor`, `Timestamp`: Desativadas.
* `With_grant`: Se a conta de proxy pode conceder o privilégio `PROXY` para outras contas.

Para que uma conta possa conceder o privilégio `PROXY` para outras contas, ela deve ter uma linha na tabela `proxies_priv` com `With_grant` definido como 1 e `Proxied_host` e `Proxied_user` definidos para indicar a conta ou contas para as quais o privilégio pode ser concedido. Por exemplo, a conta `'root'@'localhost'` criada durante a instalação do MySQL tem uma linha na tabela `proxies_priv` que permite a concessão do privilégio `PROXY` para `''@''`, ou seja, para todos os usuários e todos os hosts. Isso permite que o `root` configure usuários proxy, bem como delegar para outras contas a autoridade para configurar usuários proxy. Veja a Seção 8.2.19, “Usuários de Proxy”.

#### A tabela de concessão `global_grants`

A tabela `global_grants` lista as atribuições atuais de privilégios globais dinâmicos para contas de usuário. A tabela tem essas colunas:

* `USER`, `HOST`: O nome do usuário e o nome do host da conta para a qual o privilégio é concedido.
* `PRIV`: O nome do privilégio.
* `WITH_GRANT_OPTION`: Se a conta pode conceder o privilégio para outras contas.

#### A Tabela de Concessões `role_edges`

A tabela `role_edges` lista os vértices dos subgrafos de papéis. Ela possui as seguintes colunas:

* `FROM_HOST`, `FROM_USER`: A conta que recebe um papel.
* `TO_HOST`, `TO_USER`: O papel que é concedido à conta.
* `WITH_ADMIN_OPTION`: Se a conta pode conceder o papel e revogá-lo de outras contas usando `WITH ADMIN OPTION`.

#### A Tabela de Concessões `password_history`

A tabela `password_history` contém informações sobre as alterações de senha. Ela possui as seguintes colunas:

* `Host`, `User`: A conta para a qual a alteração de senha ocorreu.
* `Password_timestamp`: O momento em que a alteração de senha ocorreu.
* `Password`: O novo valor do hash da senha.

A tabela `password_history` acumula um número suficiente de senhas não vazias por conta para permitir que o MySQL realize verificações tanto sobre o comprimento do histórico de senhas da conta quanto sobre o intervalo de reutilização. A poda automática das entradas que estão fora de ambos os limites ocorre quando ocorrem tentativas de alteração de senha.

::: info Nota

A senha vazia não é contabilizada no histórico de senhas e pode ser reutilizada a qualquer momento.

:::

Se uma conta for renomeada, suas entradas são renomeadas para corresponder. Se uma conta for removida ou seu plugin de autenticação for alterado, suas entradas são removidas.

#### Propriedades da Coluna de Alcance da Tabela de Concessões

As colunas de alcance nas tabelas de concessão contêm strings. O valor padrão para cada uma é a string vazia. A tabela a seguir mostra o número de caracteres permitidos em cada coluna.

**Tabela 8.8 Larguras de Colunas de Alcance da Tabela de Concessões**

<table><thead><tr> <th>Nome da Coluna</th> <th>Máximo de Caracteres Permitidos</th> </tr></thead><tbody><tr> <td><code>Host</code>, <code>Proxied_host</code></td> <td>255</td> </tr><tr> <td><code>User</code>, <code>Proxied_user</code></td> <td>32</td> </tr><tr> <td><code>Db</code></td> <td>64</td> </tr><tr> <td><code>Table_name</code></td> <td>64</td> </tr><tr> <td><code>Column_name</code></td> <td>64</td> </tr><tr> <td><code>Routine_name</code></td> <td>64</td> </tr></tbody></table>

Os valores de `Host` e `Proxied_host` são convertidos para minúsculas antes de serem armazenados nas tabelas de concessão.

Para fins de verificação de acesso, as comparações dos valores de `User`, `Proxied_user`, `authentication_string`, `Db` e `Table_name` são sensíveis ao caso. As comparações dos valores de `Host`, `Proxied_host`, `Column_name` e `Routine_name` não são sensíveis ao caso.

#### Propriedades das Colunas de Privilegio da Tabela de Concessão

As tabelas `user` e `db` listam cada privilégio em uma coluna separada, declarada como `ENUM('N','Y') DEFAULT 'N'`. Em outras palavras, cada privilégio pode ser desativado ou ativado, com o padrão sendo desativado.

As tabelas `tables_priv`, `columns_priv` e `procs_priv` declaram as colunas de privilégio como colunas `SET`. Os valores nessas colunas podem conter qualquer combinação dos privilégios controlados pela tabela. Apenas os privilégios listados no valor da coluna estão ativados.

**Tabela 8.9 Valores de Colunas de Privilegio de Tipo Conjunto**

<table><thead><tr> <th>Nome da Tabela</th> <th>Nome da Coluna</th> <th>Elementos do Conjunto Possível</th> </tr></thead><tbody><tr> <th><code>tables_priv</code></th> <td><code>Table_priv</code></td> <td><code>'Select', 'Insert', 'Update', 'Delete', 'Create', 'Drop', 'Grant', 'References', 'Index', 'Alter', 'Create View', 'Show view', 'Trigger'</code></td> </tr><tr> <th><code>tables_priv</code></th> <td><code>Column_priv</code></td> <td><code>'Select', 'Insert', 'Update', 'References'</code></td> </tr><tr> <th><code>columns_priv</code></th> <td><code>Column_priv</code></td> <td><code>'Select', 'Insert', 'Update', 'References'</code></td> </tr><tr> <th><code>procs_priv</code></th> <td><code>Proc_priv</code></td> <td><code>'Execute', 'Alter Routine', 'Grant'</code></td> </tr></tbody></table>

Apenas as tabelas `user` e `global_grants` especificam privilégios administrativos, como `RELOAD`, `SHUTDOWN` e `SYSTEM_VARIABLES_ADMIN`. As operações administrativas são operações no próprio servidor e não são específicas do banco de dados, portanto, não há motivo para listar esses privilégios nas outras tabelas de concessão. Consequentemente, o servidor precisa consultar apenas as tabelas `user` e `global_grants` para determinar se um usuário pode realizar uma operação administrativa.

O privilégio `FILE` também é especificado apenas na tabela `user`. Não é um privilégio administrativo em si, mas a capacidade de um usuário ler ou escrever arquivos no host do servidor é independente do banco de dados a ser acessado.

#### Concorrência da Tabela de Concessão

Para permitir operações concorrentes de DML e DDL nas tabelas de concessão do MySQL, as operações de leitura que anteriormente adquiriram bloqueios de linha nas tabelas de concessão do MySQL são executadas como leituras sem bloqueio. As operações que são realizadas como leituras sem bloqueio nas tabelas de concessão do MySQL incluem:

* Instruções `SELECT` e outras instruções de leitura que leem dados de tabelas de concessão por meio de listas de junção e subconsultas, incluindo instruções `SELECT ... FOR SHARE`, usando qualquer nível de isolamento de transação.
* Operações de DML que leem dados de tabelas de concessão (por meio de listas de junção ou subconsultas) mas não os modificam, usando qualquer nível de isolamento de transação.

Instruções que não mais adquirirem bloqueios de linha ao ler dados de tabelas de concessão relatam um aviso se executadas enquanto estão usando a replicação baseada em instruções.

Ao usar
- `binlog_format=mixed`, as operações de DML que leem dados de tabelas de concessão são escritas no log binário como eventos de linha para tornar as operações seguras para replicação em modo misto.

Instruções `SELECT ... FOR SHARE` que leem dados de tabelas de concessão relatam um aviso. Com a cláusula `FOR SHARE`, os bloqueios de leitura não são suportados em tabelas de concessão.

Operações de DML que leem dados de tabelas de concessão e são executadas usando o nível de isolamento `SERIALIZABLE` relatam um aviso. Os bloqueios de leitura que normalmente seriam adquiridos ao usar o nível de isolamento `SERIALIZABLE` não são suportados em tabelas de concessão.