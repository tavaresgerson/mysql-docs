### 8.2.3 Tabelas de subsídios

O banco de dados do sistema `mysql` inclui várias tabelas de concessão que contêm informações sobre as contas de usuário e os privilégios que elas possuem. Esta seção descreve essas tabelas. Para obter informações sobre outras tabelas no banco de dados do sistema, consulte a Seção 7.3, “O Esquema do Sistema mysql”.

A discussão aqui descreve a estrutura subjacente das tabelas de permissões e como o servidor usa seu conteúdo ao interagir com os clientes. No entanto, normalmente você não modifica as tabelas de permissões diretamente. As modificações ocorrem indiretamente quando você usa declarações de gerenciamento de contas, como `CREATE USER`, `GRANT` e `REVOKE`, para configurar contas e controlar os privilégios disponíveis para cada uma. Veja a Seção 15.7.1, “Declarações de Gerenciamento de Contas”. Quando você usa essas declarações para realizar manipulações de contas, o servidor modifica as tabelas de permissões em seu nome.

Nota

A modificação direta das tabelas de subsídios usando declarações como `INSERT`, `UPDATE` ou `DELETE` é desencorajada e feita por sua própria conta e risco. O servidor tem a liberdade de ignorar linhas que se tornam malformadas como resultado dessas modificações.

Para qualquer operação que modifique uma tabela de concessão, o servidor verifica se a tabela possui a estrutura esperada e produz um erro se não for o caso. Para atualizar as tabelas para a estrutura esperada, execute o procedimento de atualização do MySQL. Consulte o Capítulo 3, *Atualizando o MySQL*.

- Resumo da Tabela de Concessões
- Tabelas de usuários e tabelas de permissões do banco de dados
- As tabelas\_priv e as colunas\_priv Conceder tabelas
- A tabela de concessão procs\_priv
- A tabela de concessão proxies\_priv
- A Tabela de Bolsas global\_grants
- A tabela de concessão default\_roles
- A tabela de concessão role\_edges
- A tabela de permissão password\_history
- Atribuir propriedades de coluna ao escopo da tabela
- Atribuir propriedades de coluna de privilégio à tabela de concessão
- Concorrência na Tabela de Concessão

#### Resumo da Tabela de Concessões

Essas tabelas de banco de dados `mysql` contêm informações de concessão:

- `user`: Contas de usuário, privilégios globais estáticos e outras colunas não de privilégio.

- `global_grants`: Privilegios globais dinâmicos.

- `db`: Privilégios de nível de banco de dados.

- `tables_priv`: Privilégios de nível de tabela.

- `columns_priv`: Privilégios em nível de coluna.

- `procs_priv`: Privilégios de procedimentos armazenados e funções.

- `proxies_priv`: Privilegios do usuário proxy.

- `default_roles`: Papéis de usuário padrão.

- `role_edges`: Bordas para subgrafos de papéis.

- `password_history`: Histórico de alteração da senha.

Para obter informações sobre as diferenças entre privilégios globais estáticos e dinâmicos, consulte Privilegios estáticos versus dinâmicos.)

No MySQL 8.0, as tabelas de concessão usam o mecanismo de armazenamento `InnoDB` e são transacionais. Antes do MySQL 8.0, as tabelas de concessão usavam o mecanismo de armazenamento `MyISAM` e eram não transacionais. Essa mudança no mecanismo de armazenamento das tabelas de concessão permite uma mudança acompanhante no comportamento das declarações de gerenciamento de contas, como `CREATE USER` ou `GRANT`. Anteriormente, uma declaração de gerenciamento de conta que nomeava vários usuários poderia ter sucesso para alguns usuários e falhar para outros. Agora, cada declaração é transacional e ou tem sucesso para todos os usuários nomeados ou é revertida e não tem efeito se ocorrer algum erro.

Cada tabela de concessão contém colunas de escopo e colunas de privilégio:

- As colunas de escopo determinam o escopo de cada linha nas tabelas; ou seja, o contexto em que a linha se aplica. Por exemplo, uma linha da tabela `user` com os valores `Host` e `User` de `'h1.example.net'` e `'bob'` se aplica para autenticar conexões feitas ao servidor a partir do host `h1.example.net` por um cliente que especifica um nome de usuário de `bob`. Da mesma forma, uma linha da tabela `db` com os valores das colunas `Host`, `User` e `Db` de `'h1.example.net'`, `'bob'` e `'reports'` se aplica quando `bob` se conecta a partir do host `h1.example.net` para acessar o banco de dados `reports`. As tabelas `tables_priv` e `columns_priv` contêm colunas de escopo que indicam tabelas ou combinações de tabela/coluna às quais cada linha se aplica. As colunas de escopo `procs_priv` indicam a rotina armazenada à qual cada linha se aplica.

- As colunas de privilégio indicam quais privilégios uma linha de tabela concede, ou seja, quais operações ela permite que sejam realizadas. O servidor combina as informações das várias tabelas de concessão para formar uma descrição completa dos privilégios de um usuário. A seção 8.2.7, “Controle de Acesso, Etapa 2: Verificação de Solicitação”, descreve as regras para isso.

Além disso, uma tabela de concessão pode conter colunas usadas para fins diferentes da avaliação de escopo ou privilégio.

O servidor utiliza as tabelas de concessão da seguinte maneira:

- As colunas de escopo da tabela `user` determinam se as conexões recebidas devem ser rejeitadas ou permitidas. Para conexões permitidas, quaisquer privilégios concedidos na tabela `user` indicam os privilégios globais estáticos do usuário. Quaisquer privilégios concedidos nesta tabela se aplicam a *todas* as bases de dados no servidor.

  Cuidado

  Como qualquer privilégio global estático é considerado um privilégio para todas as bases de dados, qualquer privilégio global estático permite que um usuário veja todos os nomes de base de dados com `SHOW DATABASES` ou examinando a tabela `SCHEMATA` de `INFORMATION_SCHEMA`, exceto as bases de dados que foram restringidas ao nível da base de dados por revogações parciais.

- A tabela `global_grants` lista as atribuições atuais de privilégios globais dinâmicos às contas de usuário. Para cada linha, as colunas de escopo determinam qual usuário possui o privilégio nomeado na coluna de privilégio.

- As colunas de escopo da tabela `db` determinam quais usuários podem acessar quais bancos de dados a partir de quais hosts. As colunas de privilégio determinam as operações permitidas. Um privilégio concedido ao nível do banco de dados se aplica ao banco de dados e a todos os objetos no banco de dados, como tabelas e programas armazenados.

- As tabelas `tables_priv` e `columns_priv` são semelhantes à tabela `db`, mas são mais detalhadas: Elas são aplicadas aos níveis de tabela e coluna, em vez de ao nível do banco de dados. Um privilégio concedido ao nível da tabela é aplicado à tabela e a todas as suas colunas. Um privilégio concedido ao nível da coluna é aplicado apenas a uma coluna específica.

- A tabela `procs_priv` se aplica a rotinas armazenadas (procedimentos e funções armazenados). Um privilégio concedido ao nível da rotina aplica-se apenas a um único procedimento ou função.

- A tabela `proxies_priv` indica quais usuários podem atuar como proxies para outros usuários e se um usuário pode conceder o privilégio `PROXY` a outros usuários.

- As tabelas `default_roles` e `role_edges` contêm informações sobre as relações de papéis.

- A tabela `password_history` mantém as senhas escolhidas anteriormente para permitir restrições sobre o uso repetido de senhas. Veja a Seção 8.2.15, “Gerenciamento de Senhas”.

O servidor lê o conteúdo das tabelas de concessão na memória quando ele é iniciado. Você pode dizer ao servidor para recarregar as tabelas emitindo uma declaração `FLUSH PRIVILEGES` ou executando um comando **mysqladmin flush-privileges** ou **mysqladmin reload**. As alterações nas tabelas de concessão entram em vigor conforme indicado na Seção 8.2.13, “Quando as Alterações de Privilégios Entram em Vigor”.

Quando você modifica uma conta, é uma boa ideia verificar se suas alterações tiveram o efeito desejado. Para verificar os privilégios de uma conta específica, use a instrução `SHOW GRANTS`. Por exemplo, para determinar os privilégios concedidos a uma conta com os valores de nome de usuário e nome de host `bob` e `pc84.example.com`, use esta instrução:

```
SHOW GRANTS FOR 'bob'@'pc84.example.com';
```

Para exibir propriedades não privilegiadas de uma conta, use `SHOW CREATE USER`:

```
SHOW CREATE USER 'bob'@'pc84.example.com';
```

#### Tabelas de usuários e tabelas de permissões do banco de dados

O servidor utiliza as tabelas `user` e `db` no banco de dados `mysql` nas duas primeiras etapas do controle de acesso (ver Seção 8.2, “Controle de Acesso e Gerenciamento de Contas”). As colunas das tabelas `user` e `db` são mostradas aqui.

**Tabela 8.4 Colunas de tabelas usuário e banco de dados**

<table><thead><tr> <th scope="col">Nome da tabela</th> <th scope="col">[[PH_HTML_CODE_<code>Insert_priv</code>]</th> <th scope="col">[[PH_HTML_CODE_<code>Insert_priv</code>]</th> </tr></thead><tbody><tr> <th><span class="bold"><strong>Colunas de escopo</strong></span></th> <td>[[PH_HTML_CODE_<code>Update_priv</code>]</td> <td>[[PH_HTML_CODE_<code>Delete_priv</code>]</td> </tr><tr> <th></th> <td>[[PH_HTML_CODE_<code>Delete_priv</code>]</td> <td>[[PH_HTML_CODE_<code>Index_priv</code>]</td> </tr><tr> <th></th> <td></td> <td>[[PH_HTML_CODE_<code>Index_priv</code>]</td> </tr><tr> <th><span class="bold"><strong>Colunas de privilégio</strong></span></th> <td>[[PH_HTML_CODE_<code>Alter_priv</code>]</td> <td>[[PH_HTML_CODE_<code>Alter_priv</code>]</td> </tr><tr> <th></th> <td>[[PH_HTML_CODE_<code>Create_priv</code>]</td> <td>[[<code>Insert_priv</code>]]</td> </tr><tr> <th></th> <td>[[<code>db</code><code>Insert_priv</code>]</td> <td>[[<code>Update_priv</code>]]</td> </tr><tr> <th></th> <td>[[<code>Delete_priv</code>]]</td> <td>[[<code>Delete_priv</code>]]</td> </tr><tr> <th></th> <td>[[<code>Index_priv</code>]]</td> <td>[[<code>Index_priv</code>]]</td> </tr><tr> <th></th> <td>[[<code>Alter_priv</code>]]</td> <td>[[<code>Alter_priv</code>]]</td> </tr><tr> <th></th> <td>[[<code>Create_priv</code>]]</td> <td>[[<code>Host</code><code>Insert_priv</code>]</td> </tr><tr> <th></th> <td>[[<code>Host</code><code>Insert_priv</code>]</td> <td>[[<code>Host</code><code>Update_priv</code>]</td> </tr><tr> <th></th> <td>[[<code>Host</code><code>Delete_priv</code>]</td> <td>[[<code>Host</code><code>Delete_priv</code>]</td> </tr><tr> <th></th> <td>[[<code>Host</code><code>Index_priv</code>]</td> <td>[[<code>Host</code><code>Index_priv</code>]</td> </tr><tr> <th></th> <td>[[<code>Host</code><code>Alter_priv</code>]</td> <td>[[<code>Host</code><code>Alter_priv</code>]</td> </tr><tr> <th></th> <td>[[<code>Host</code><code>Create_priv</code>]</td> <td>[[<code>Host</code><code>Insert_priv</code>]</td> </tr><tr> <th></th> <td>[[<code>Host</code><code>Insert_priv</code>]</td> <td>[[<code>Host</code><code>Update_priv</code>]</td> </tr><tr> <th></th> <td>[[<code>Host</code><code>Delete_priv</code>]</td> <td>[[<code>Host</code><code>Delete_priv</code>]</td> </tr><tr> <th></th> <td>[[<code>Host</code><code>Index_priv</code>]</td> <td>[[<code>Host</code><code>Index_priv</code>]</td> </tr><tr> <th></th> <td>[[<code>Host</code><code>Alter_priv</code>]</td> <td>[[<code>Host</code><code>Alter_priv</code>]</td> </tr><tr> <th></th> <td>[[<code>Host</code><code>Create_priv</code>]</td> <td>[[<code>User</code><code>Insert_priv</code>]</td> </tr><tr> <th></th> <td>[[<code>User</code><code>Insert_priv</code>]</td> <td>[[<code>User</code><code>Update_priv</code>]</td> </tr><tr> <th></th> <td>[[<code>User</code><code>Delete_priv</code>]</td> <td>[[<code>User</code><code>Delete_priv</code>]</td> </tr><tr> <th></th> <td>[[<code>User</code><code>Index_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>User</code><code>Index_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>User</code><code>Alter_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>User</code><code>Alter_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>User</code><code>Create_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>Db</code><code>Insert_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>Db</code><code>Insert_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>Db</code><code>Update_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>Db</code><code>Delete_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>Db</code><code>Delete_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>Db</code><code>Index_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>Db</code><code>Index_priv</code>]</td> <td></td> </tr><tr> <th><span class="bold"><strong>Colunas de segurança</strong></span></th> <td>[[<code>Db</code><code>Alter_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>Db</code><code>Alter_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>Db</code><code>Create_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>User</code><code>Insert_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>User</code><code>Insert_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>User</code><code>Update_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>User</code><code>Delete_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>User</code><code>Delete_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>User</code><code>Index_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>User</code><code>Index_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>User</code><code>Alter_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>User</code><code>Alter_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>User</code><code>Create_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>Select_priv</code><code>Insert_priv</code>]</td> <td></td> </tr><tr> <th><span class="bold"><strong>Colunas de controle de recursos</strong></span></th> <td>[[<code>Select_priv</code><code>Insert_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>Select_priv</code><code>Update_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>Select_priv</code><code>Delete_priv</code>]</td> <td></td> </tr><tr> <th></th> <td>[[<code>Select_priv</code><code>Delete_priv</code>]</td> <td></td> </tr></tbody></table>

As colunas `user` da tabela `plugin` e `authentication_string` armazenam informações de autenticação do plugin e credenciais.

O servidor usa o plugin nomeado na coluna `plugin` de uma linha de conta para autenticar as tentativas de conexão para a conta.

A coluna `plugin` deve estar preenchida. No momento do início e durante a execução do `FLUSH PRIVILEGES`, o servidor verifica as linhas da tabela `user`. Para qualquer linha com uma coluna `plugin` vazia, o servidor escreve uma mensagem de aviso no log de erros deste formulário:

```
[Warning] User entry 'user_name'@'host_name' has an empty plugin
value. The user will be ignored and no one can login with this user
anymore.
```

Para atribuir um plugin a uma conta que não possui um, use a declaração `ALTER USER`.

A coluna `password_expired` permite que os administradores de banco de dados expiram as senhas das contas e exijam que os usuários redefinam suas senhas. O valor padrão `password_expired` é `'N'`, mas pode ser definido como `'Y'` com a instrução `ALTER USER`. Após a senha de uma conta ter expirado, todas as operações realizadas pela conta em conexões subsequentes ao servidor resultam em um erro até que o usuário emita uma instrução `ALTER USER` para estabelecer uma nova senha da conta.

Nota

Embora seja possível "redefinir" uma senha expirada, definindo-a para seu valor atual, é preferível, por questão de boa prática, escolher uma senha diferente. Os administradores de banco de dados podem impor a não reutilização estabelecendo uma política apropriada de reutilização de senhas. Veja a Política de Reutilização de Senhas.

`password_last_changed` é uma coluna `TIMESTAMP` que indica quando a senha foi alterada pela última vez. O valor não é `NULL` apenas para contas que usam um plugin de autenticação integrado do MySQL (`mysql_native_password`, `sha256_password` ou `caching_sha2_password`). O valor é `NULL` para outras contas, como aquelas autenticadas usando um sistema de autenticação externo.

`password_last_changed` é atualizado pelas instruções `CREATE USER`, `ALTER USER` e `SET PASSWORD`, e pelas instruções `GRANT` que criam uma conta ou alteram a senha de uma conta.

`password_lifetime` indica a duração da senha da conta, em dias. Se a senha estiver vencida (avaliada usando a coluna `password_last_changed`), o servidor considera que a senha expirou quando os clientes se conectam usando a conta. Um valor de `N` maior que zero significa que a senha deve ser alterada a cada `N` dias. Um valor de 0 desativa a expiração automática da senha. Se o valor for `NULL` (o padrão), a política de expiração global é aplicada, conforme definido pela variável de sistema `default_password_lifetime`.

`account_locked` indica se a conta está bloqueada (consulte a Seção 8.2.20, “Bloqueio da Conta”).

`Password_reuse_history` é o valor da opção `PASSWORD HISTORY` para a conta, ou `NULL` para o histórico padrão.

`Password_reuse_time` é o valor da opção `PASSWORD REUSE INTERVAL` para a conta, ou `NULL` para o intervalo padrão.

`Password_require_current` (adicionado no MySQL 8.0.13) corresponde ao valor da opção `PASSWORD REQUIRE` para a conta, conforme mostrado na tabela a seguir.

**Tabela 8.5 Valores permitidos para Password\_require\_current**

<table summary="Valores permitidos da coluna user.Password_require_current e como eles correspondem às opções de PASSWORD REQUIRE."><thead><tr> <th>Senha_requer_atual Valor</th> <th>Opção de exigência de senha correspondente</th> </tr></thead><tbody><tr> <td>[[<code>'Y'</code>]]</td> <td>[[<code>PASSWORD REQUIRE CURRENT</code>]]</td> </tr><tr> <td>[[<code>'N'</code>]]</td> <td>[[<code>PASSWORD REQUIRE CURRENT OPTIONAL</code>]]</td> </tr><tr> <td>[[<code>NULL</code>]]</td> <td>[[<code>PASSWORD REQUIRE CURRENT DEFAULT</code>]]</td> </tr></tbody></table>

`User_attributes` (adicionado no MySQL 8.0.14) é uma coluna no formato JSON que armazena atributos da conta que não estão armazenados em outras colunas. A partir do MySQL 8.0.21, o `INFORMATION_SCHEMA` expõe esses atributos através da tabela `USER_ATTRIBUTES`.

A coluna `User_attributes` pode conter esses atributos:

- `additional_password`: A senha secundária, se houver. Consulte Suporte a Dupla Senha.

- `Restrictions`: Listas de restrições, se houver. As restrições são adicionadas por operações de revogação parcial. O valor do atributo é um array de elementos que possuem as chaves `Database` e `Restrictions`, indicando o nome de um banco de dados restrito e as restrições aplicáveis a ele (consulte a Seção 8.2.12, “Restrição de privilégio usando revogações parciais”).

- `Password_locking`: As condições para o rastreamento de logins falhos e o bloqueio temporário da conta, se houver (consulte Rastreamento de Logins Falhos e Bloqueio Temporário da Conta). O atributo `Password_locking` é atualizado de acordo com as opções `FAILED_LOGIN_ATTEMPTS` e `PASSWORD_LOCK_TIME` das instruções `CREATE USER` e `ALTER USER`. O valor do atributo é um hash com as chaves `failed_login_attempts` e `password_lock_time_days`, indicando o valor dessas opções que foram especificadas para a conta. Se uma chave estiver ausente, seu valor é implicitamente 0. Se o valor de uma chave estiver implicitamente ou explicitamente 0, a capacidade correspondente é desabilitada. Este atributo foi adicionado no MySQL 8.0.19.

- `multi_factor_authentication`: As linhas na tabela de sistema `mysql.user` possuem uma coluna `plugin` que indica um plugin de autenticação. Para autenticação de um único fator, esse plugin é o único fator de autenticação. Para formas de autenticação multifator de dois ou três fatores, esse plugin corresponde ao primeiro fator de autenticação, mas informações adicionais devem ser armazenadas para os segundo e terceiro fatores. O atributo `multi_factor_authentication` contém essas informações. Esse atributo foi adicionado no MySQL 8.0.27.

  O valor `multi_factor_authentication` é um array, onde cada elemento do array é um hash que descreve um fator de autenticação usando esses atributos:

  - `plugin`: O nome do plugin de autenticação.

  - `authentication_string`: O valor da string de autenticação.

  - `passwordless`: Uma bandeira que indica se o usuário deve ser usado sem uma senha (com um token de segurança como o único método de autenticação).

  - `requires_registration`: uma bandeira que define se a conta do usuário registrou um token de segurança.

  Os primeiros e segundos elementos da matriz descrevem os fatores de autenticação multifator 2 e 3.

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

#### As tabelas\_priv e as colunas\_priv Conceder tabelas

Durante a segunda etapa do controle de acesso, o servidor realiza a verificação da solicitação para garantir que cada cliente tenha privilégios suficientes para cada solicitação que emite. Além das tabelas de concessão `user` e `db`, o servidor também pode consultar as tabelas `tables_priv` e `columns_priv` para solicitações que envolvem tabelas. Essas últimas tabelas fornecem um controle de privilégio mais preciso aos níveis de tabela e coluna. Elas possuem as colunas mostradas na tabela a seguir.

**Tabela 8.6 colunas\_priv e tabelas\_priv Colunas da tabela**

<table><thead><tr> <th scope="col">Nome da tabela</th> <th scope="col">[[PH_HTML_CODE_<code>Column_name</code>]</th> <th scope="col">[[PH_HTML_CODE_<code>Column_name</code>]</th> </tr></thead><tbody><tr> <th><span class="bold"><strong>Colunas de escopo</strong></span></th> <td>[[PH_HTML_CODE_<code>Column_priv</code>]</td> <td>[[PH_HTML_CODE_<code>Column_priv</code>]</td> </tr><tr> <th></th> <td>[[PH_HTML_CODE_<code>Timestamp</code>]</td> <td>[[PH_HTML_CODE_<code>Timestamp</code>]</td> </tr><tr> <th></th> <td>[[PH_HTML_CODE_<code>Grantor</code>]</td> <td>[[<code>User</code>]]</td> </tr><tr> <th></th> <td>[[<code>Table_name</code>]]</td> <td>[[<code>Table_name</code>]]</td> </tr><tr> <th></th> <td></td> <td>[[<code>Column_name</code>]]</td> </tr><tr> <th><span class="bold"><strong>Colunas de privilégio</strong></span></th> <td>[[<code>columns_priv</code><code>Column_name</code>]</td> <td>[[<code>Column_priv</code>]]</td> </tr><tr> <th></th> <td>[[<code>Column_priv</code>]]</td> <td></td> </tr><tr> <th><span class="bold"><strong>Outras colunas</strong></span></th> <td>[[<code>Timestamp</code>]]</td> <td>[[<code>Timestamp</code>]]</td> </tr><tr> <th></th> <td>[[<code>Grantor</code>]]</td> <td></td> </tr></tbody></table>

As colunas `Timestamp` e `Grantor` são definidas com o timestamp atual e o valor `CURRENT_USER`, respectivamente, mas, de outra forma, não são utilizadas.

#### A tabela de concessão procs\_priv

Para a verificação de solicitações que envolvem rotinas armazenadas, o servidor pode consultar a tabela `procs_priv`, que possui as colunas mostradas na tabela a seguir.

**Tabela 8.7 Colunas da tabela procs\_priv**

<table><thead><tr> <th>Nome da tabela</th> <th>[[<code>procs_priv</code>]]</th> </tr></thead><tbody><tr> <td><span class="bold"><strong>Colunas de escopo</strong></span></td> <td>[[<code>Host</code>]]</td> </tr><tr> <td></td> <td>[[<code>Db</code>]]</td> </tr><tr> <td></td> <td>[[<code>User</code>]]</td> </tr><tr> <td></td> <td>[[<code>Routine_name</code>]]</td> </tr><tr> <td></td> <td>[[<code>Routine_type</code>]]</td> </tr><tr> <td><span class="bold"><strong>Colunas de privilégio</strong></span></td> <td>[[<code>Proc_priv</code>]]</td> </tr><tr> <td><span class="bold"><strong>Outras colunas</strong></span></td> <td>[[<code>Timestamp</code>]]</td> </tr><tr> <td></td> <td>[[<code>Grantor</code>]]</td> </tr></tbody></table>

A coluna `Routine_type` é uma coluna `ENUM` com valores de `'FUNCTION'` ou `'PROCEDURE'` para indicar o tipo de rotina a que a linha se refere. Essa coluna permite que privilégios sejam concedidos separadamente para uma função e um procedimento com o mesmo nome.

As colunas `Timestamp` e `Grantor` não são usadas.

#### A tabela de concessão proxies\_priv

A tabela `proxies_priv` registra informações sobre contas de proxy. Ela possui as seguintes colunas:

- `Host`, `User`: A conta de proxy; ou seja, a conta que possui o privilégio `PROXY` para a conta proxy.

- `Proxied_host`, `Proxied_user`: A conta proxy.

- `Grantor`, `Timestamp`: Não utilizado.

- `With_grant`: Se a conta de proxy pode conceder o privilégio `PROXY` para outras contas.

Para que uma conta possa conceder o privilégio `PROXY` a outras contas, ela deve ter uma linha na tabela `proxies_priv` com `With_grant` definida como 1 e `Proxied_host` e `Proxied_user` definidos para indicar a conta ou contas para as quais o privilégio pode ser concedido. Por exemplo, a conta `'root'@'localhost'` criada durante a instalação do MySQL tem uma linha na tabela `proxies_priv` que permite conceder o privilégio `PROXY` para `''@''`, ou seja, para todos os usuários e todos os hosts. Isso permite que o `root` configure usuários proxy, bem como delegar a outras contas a autoridade para configurar usuários proxy. Veja a Seção 8.2.19, “Usuários Proxy”.

#### A Tabela de Bolsas global\_grants

A tabela `global_grants` lista as atribuições atuais de privilégios globais dinâmicos às contas de usuário. A tabela tem as seguintes colunas:

- `USER`, `HOST`: O nome do usuário e o nome do host da conta à qual o privilégio é concedido.

- `PRIV`: O nome do privilégio.

- `WITH_GRANT_OPTION`: Se a conta pode conceder o privilégio a outras contas.

#### A tabela de concessão default\_roles

A tabela `default_roles` lista os papéis de usuário padrão. Ela tem as seguintes colunas:

- `HOST`, `USER`: A conta ou o papel ao qual o papel padrão se aplica.

- `DEFAULT_ROLE_HOST`, `DEFAULT_ROLE_USER`: O papel padrão.

#### A tabela de concessão role\_edges

A tabela `role_edges` lista arestas para subgrafos de papéis. Ela tem essas colunas:

- `FROM_HOST`, `FROM_USER`: A conta que recebe um papel.

- `TO_HOST`, `TO_USER`: O papel concedido à conta.

- `WITH_ADMIN_OPTION`: Se a conta pode conceder o papel a outras contas e revogá-lo delas usando `WITH ADMIN OPTION`.

#### A tabela de permissão password\_history

A tabela `password_history` contém informações sobre as alterações de senha. Ela possui as seguintes colunas:

- `Host`, `User`: A conta para a qual a alteração da senha ocorreu.

- `Password_timestamp`: O horário em que a alteração da senha ocorreu.

- `Password`: O novo valor do hash da senha.

A tabela `password_history` acumula um número suficiente de senhas não vazias por conta para permitir que o MySQL realize verificações tanto sobre o histórico de comprimento da senha da conta quanto sobre o intervalo de reutilização. A poda automática das entradas que estão fora de ambos os limites ocorre quando ocorrem tentativas de alteração de senha.

Nota

A senha vazia não é contabilizada no histórico de senhas e pode ser reutilizada a qualquer momento.

Se uma conta for renomeada, suas entradas serão renomeadas para corresponder. Se uma conta for excluída ou seu plugin de autenticação for alterado, suas entradas serão removidas.

#### Atribuir propriedades de coluna ao escopo da tabela

As colunas de escopo nas tabelas de concessão contêm cadeias de caracteres. O valor padrão para cada uma é a cadeia vazia. A tabela a seguir mostra o número de caracteres permitidos em cada coluna.

**Tabela 8.8 Comprimento das Colunas da Tabela de Concessão**

<table><thead><tr> <th>Nome da Coluna</th> <th>Máximo de caracteres permitidos</th> </tr></thead><tbody><tr> <td>[[<code>Host</code>]], [[<code>Proxied_host</code>]]</td> <td>255 (60 antes do MySQL 8.0.17)</td> </tr><tr> <td>[[<code>User</code>]], [[<code>Proxied_user</code>]]</td> <td>32</td> </tr><tr> <td>[[<code>Db</code>]]</td> <td>64</td> </tr><tr> <td>[[<code>Table_name</code>]]</td> <td>64</td> </tr><tr> <td>[[<code>Column_name</code>]]</td> <td>64</td> </tr><tr> <td>[[<code>Routine_name</code>]]</td> <td>64</td> </tr></tbody></table>

Os valores `Host` e `Proxied_host` são convertidos para minúsculas antes de serem armazenados nas tabelas de concessão.

Para fins de verificação de acesso, as comparações dos valores de `User`, `Proxied_user`, `authentication_string`, `Db` e `Table_name` são sensíveis ao caso. As comparações dos valores de `Host`, `Proxied_host`, `Column_name` e `Routine_name` não são sensíveis ao caso.

#### Atribuir propriedades de coluna de privilégio à tabela de concessão

As tabelas `user` e `db` listam cada privilégio em uma coluna separada que é declarada como `ENUM('N','Y') DEFAULT 'N'`. Em outras palavras, cada privilégio pode ser desativado ou ativado, com o padrão sendo desativado.

As tabelas `tables_priv`, `columns_priv` e `procs_priv` declaram as colunas de privilégio como colunas `SET`. Os valores nessas colunas podem conter qualquer combinação dos privilégios controlados pela tabela. Apenas os privilégios listados no valor da coluna estão habilitados.

**Tabela 8.9 Valores das Colunas de Privilegio de Tipo de Conjunto**

<table><thead><tr> <th scope="col">Nome da tabela</th> <th scope="col">Nome da Coluna</th> <th scope="col">Possíveis elementos do conjunto</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>Proc_priv</code>]</th> <td>[[PH_HTML_CODE_<code>Proc_priv</code>]</td> <td>[[<code>'Select', 'Insert', 'Update', 'Delete', 'Create', 'Drop', 'Grant', 'References', 'Index', 'Alter', 'Create View', 'Show view', 'Trigger'</code>]]</td> </tr><tr> <th>[[<code>tables_priv</code>]]</th> <td>[[<code>Column_priv</code>]]</td> <td>[[<code>'Select', 'Insert', 'Update', 'References'</code>]]</td> </tr><tr> <th>[[<code>columns_priv</code>]]</th> <td>[[<code>Column_priv</code>]]</td> <td>[[<code>'Select', 'Insert', 'Update', 'References'</code>]]</td> </tr><tr> <th>[[<code>procs_priv</code>]]</th> <td>[[<code>Proc_priv</code>]]</td> <td>[[<code>Table_priv</code><code>Proc_priv</code>]</td> </tr></tbody></table>

Apenas as tabelas `user` e `global_grants` especificam privilégios administrativos, como `RELOAD`, `SHUTDOWN` e `SYSTEM_VARIABLES_ADMIN`. As operações administrativas são operações no próprio servidor e não são específicas do banco de dados, portanto, não há motivo para listar esses privilégios nas outras tabelas de concessão. Consequentemente, o servidor precisa consultar apenas as tabelas `user` e `global_grants` para determinar se um usuário pode realizar uma operação administrativa.

O privilégio `FILE` também é especificado apenas na tabela `user`. Não é um privilégio administrativo em si, mas a capacidade de um usuário de ler ou escrever arquivos no host do servidor é independente do banco de dados a ser acessado.

#### Concorrência na Tabela de Concessão

A partir do MySQL 8.0.22, para permitir operações simultâneas de DML e DDL nas tabelas grant do MySQL, as operações de leitura que anteriormente adquiriram bloqueios de linha nas tabelas grant do MySQL são executadas como leituras sem bloqueio. As operações que são realizadas como leituras sem bloqueio nas tabelas grant do MySQL incluem:

- `SELECT` declarações e outras declarações de leitura somente que leem dados de tabelas de concessão por meio de listas de junção e subconsultas, incluindo `SELECT ... FOR SHARE` declarações, usando qualquer nível de isolamento de transação.

- Operações DML que leem dados de tabelas de concessão (através de listas de junção ou subconsultas), mas não as modificam, usando qualquer nível de isolamento de transação.

Declarações que não mais obtêm bloqueios de linha ao ler dados de tabelas de concessão relatam um aviso se executadas enquanto estão usando a replicação baseada em declarações.

Ao usar -`binlog_format=mixed`, as operações de DML que leem dados de tabelas de concessão são escritas no log binário como eventos de linha para tornar as operações seguras para a replicação em modo misto.

As declarações `SELECT ... FOR SHARE` que leem dados de tabelas de concessão geram um aviso. Com a cláusula `FOR SHARE`, os bloqueios de leitura não são suportados em tabelas de concessão.

As operações DML que leem dados de tabelas de concessão e são executadas usando o nível de isolamento `SERIALIZABLE` geram um aviso. As bloqueadoras de leitura que normalmente seriam adquiridas ao usar o nível de isolamento `SERIALIZABLE` não são suportadas em tabelas de concessão.
