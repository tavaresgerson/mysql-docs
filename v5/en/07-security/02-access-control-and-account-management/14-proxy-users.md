### 6.2.14 Usuários Proxy

O MySQL server autentica as conexões de CLIENTs usando AUTHENTICATION PLUGINs. O PLUGIN que autentica uma determinada conexão pode solicitar que o USER (externo) de conexão seja tratado como um USER diferente para fins de verificação de privilégios. Isso permite que o USER externo seja um PROXY para o segundo USER; ou seja, assumir os privilégios do segundo USER:

* O USER externo é um "proxy user" (um USER que pode se passar ou ser reconhecido como outro USER).
* O segundo USER é um "proxied user" (um USER cuja identidade e privilégios podem ser assumidos por um proxy user).

Esta seção descreve como funciona a capacidade de proxy user. Para obter informações gerais sobre AUTHENTICATION PLUGINs, consulte [Section 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication"). Para obter informações sobre PLUGINs específicos, consulte [Section 6.4.1, “Authentication Plugins”](authentication-plugins.html "6.4.1 Authentication Plugins"). Para obter informações sobre como escrever AUTHENTICATION PLUGINs que suportam proxy users, consulte [Implementing Proxy User Support in Authentication Plugins](/doc/extending-mysql/5.7/en/writing-authentication-plugins-proxy-users.html).

* [Requisitos para Suporte a Proxy User](proxy-users.html#proxy-users-support-requirements "Requirements for Proxy User Support")
* [Exemplo Simples de Proxy User](proxy-users.html#proxy-users-example "Simple Proxy User Example")
* [Prevenindo LOGIN Direto em Contas Proxied](proxy-users.html#preventing-proxied-account-direct-login "Preventing Direct Login to Proxied Accounts")
* [Concedendo e Revogando o PROXY Privilege](proxy-users.html#proxy-users-granting-proxy-privilege "Granting and Revoking the PROXY Privilege")
* [Proxy Users Padrão](proxy-users.html#default-proxy-users "Default Proxy Users")
* [Conflitos entre Proxy User Padrão e USER Anônimo](proxy-users.html#proxy-users-conflicts "Default Proxy User and Anonymous User Conflicts")
* [Suporte do Server para Mapeamento de Proxy User](proxy-users.html#proxy-users-server-user-mapping "Server Support for Proxy User Mapping")
* [Variáveis de Sistema de Proxy User](proxy-users.html#proxy-users-system-variables "Proxy User System Variables")

#### Requisitos para Suporte a Proxy User

Para que o proxying ocorra para um determinado AUTHENTICATION PLUGIN, estas condições devem ser satisfeitas:

* O proxying deve ser suportado, seja pelo PLUGIN em si, ou pelo MySQL server em nome do PLUGIN. Neste último caso, o suporte do server pode precisar ser habilitado explicitamente; consulte [Server Support for Proxy User Mapping](proxy-users.html#proxy-users-server-user-mapping "Server Support for Proxy User Mapping").

* O ACCOUNT para o proxy user externo deve ser configurado para ser autenticado pelo PLUGIN. Use o comando [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") para associar um ACCOUNT a um AUTHENTICATION PLUGIN, ou [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") para alterar seu PLUGIN.

* O ACCOUNT para o proxied user deve existir e ter os privilégios concedidos que serão assumidos pelo proxy user. Use os comandos [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") e [`GRANT`](grant.html "13.7.1.4 GRANT Statement") para isso.

* Normalmente, o proxied user é configurado para que possa ser usado apenas em cenários de proxying e não para LOGINS diretos.

* O ACCOUNT do proxy user deve ter o [`PROXY`](privileges-provided.html#priv_proxy) privilege para o ACCOUNT proxied. Use o comando [`GRANT`](grant.html "13.7.1.4 GRANT Statement") para isso.

* Para que um CLIENT que se conecta ao ACCOUNT PROXY seja tratado como um proxy user, o AUTHENTICATION PLUGIN deve retornar um USER name diferente do USER name do CLIENT, para indicar o USER name do ACCOUNT proxied que define os privilégios a serem assumidos pelo proxy user.

* Alternativamente, para PLUGINs que recebem mapeamento PROXY pelo SERVER, o proxied user é determinado a partir do [`PROXY`](privileges-provided.html#priv_proxy) privilege detido pelo proxy user.

O mecanismo PROXY permite mapear apenas o USER name do CLIENT externo para o USER name proxied. Não há previsão para mapeamento de HOST names:

* Quando um CLIENT se conecta ao server, o server determina o ACCOUNT apropriado com base no USER name passado pelo programa CLIENT e no HOST de onde o CLIENT se conecta.

* Se esse ACCOUNT for um ACCOUNT PROXY, o server tenta determinar o ACCOUNT proxied apropriado encontrando uma correspondência para um ACCOUNT proxied usando o USER name retornado pelo AUTHENTICATION PLUGIN e o HOST name do ACCOUNT PROXY. O HOST name no ACCOUNT proxied é ignorado.

#### Exemplo Simples de Proxy User

Considere as seguintes definições de ACCOUNTs:

```sql
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

Quando um CLIENT se conecta como `employee_ext` a partir do HOST local, o MySQL usa o PLUGIN chamado `my_auth_plugin` para realizar a AUTHENTICATION. Suponha que `my_auth_plugin` retorne um USER name `employee` para o server, com base no conteúdo de `'my_auth_string'` e talvez consultando algum sistema de AUTHENTICATION externo. O nome `employee` difere de `employee_ext`, então retornar `employee` serve como uma solicitação ao server para tratar o USER externo `employee_ext`, para fins de verificação de privilégios, como o USER local `employee`.

Neste caso, `employee_ext` é o proxy user e `employee` é o proxied user.

O server verifica se a AUTHENTICATION PROXY para `employee` é possível para o USER `employee_ext`, verificando se `employee_ext` (o proxy user) tem o [`PROXY`](privileges-provided.html#priv_proxy) privilege para `employee` (o proxied user). Se este privilégio não tiver sido concedido, ocorre um erro. Caso contrário, `employee_ext` assume os privilégios de `employee`. O server verifica os comandos executados durante a sessão do CLIENT por `employee_ext` em relação aos privilégios concedidos a `employee`. Neste caso, `employee_ext` pode acessar tabelas no DATABASE `employees`.

O ACCOUNT proxied, `employee`, usa o AUTHENTICATION PLUGIN `mysql_no_login` para evitar que CLIENTs usem o ACCOUNT para fazer LOGIN diretamente. (Isso pressupõe que o PLUGIN esteja instalado. Para instruções, consulte [Section 6.4.1.10, “No-Login Pluggable Authentication”](no-login-pluggable-authentication.html "6.4.1.10 No-Login Pluggable Authentication").) Para métodos alternativos de proteção de ACCOUNTs proxied contra uso direto, consulte [Preventing Direct Login to Proxied Accounts](proxy-users.html#preventing-proxied-account-direct-login "Preventing Direct Login to Proxied Accounts").

Quando o proxying ocorre, as funções [`USER()`](information-functions.html#function_user) e [`CURRENT_USER()`](information-functions.html#function_current-user) podem ser usadas para ver a diferença entre o USER que se conecta (o proxy user) e o ACCOUNT cujos privilégios se aplicam durante a sessão atual (o proxied user). Para o exemplo recém-descrito, essas funções retornam estes valores:

```sql
mysql> SELECT USER(), CURRENT_USER();
+------------------------+--------------------+
| USER()                 | CURRENT_USER()     |
+------------------------+--------------------+
| employee_ext@localhost | employee@localhost |
+------------------------+--------------------+
```

No comando [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") que cria o ACCOUNT do proxy user, a cláusula `IDENTIFIED WITH` que nomeia o AUTHENTICATION PLUGIN que suporta PROXY é opcionalmente seguida por uma cláusula `AS 'auth_string'` especificando uma string que o server passa ao PLUGIN quando o USER se conecta. Se presente, a string fornece informações que ajudam o PLUGIN a determinar como mapear o USER name do CLIENT PROXY (externo) para um USER name proxied. Cabe a cada PLUGIN decidir se ele requer a cláusula `AS`. Nesse caso, o formato da string de AUTHENTICATION depende de como o PLUGIN pretende usá-la. Consulte a documentação de um dado PLUGIN para obter informações sobre os valores de string de AUTHENTICATION que ele aceita.

#### Prevenindo LOGIN Direto em Contas Proxied

ACCOUNTs proxied geralmente são destinados a serem usados apenas por meio de ACCOUNTs PROXY. Ou seja, os CLIENTs se conectam usando um ACCOUNT PROXY, e então são mapeados para o proxied user apropriado e assumem seus privilégios.

Existem várias maneiras de garantir que um ACCOUNT proxied não possa ser usado diretamente:

* Associe o ACCOUNT com o AUTHENTICATION PLUGIN `mysql_no_login`. Neste caso, o ACCOUNT não pode ser usado para LOGINS diretos sob nenhuma circunstância. Isso pressupõe que o PLUGIN esteja instalado. Para instruções, consulte [Section 6.4.1.10, “No-Login Pluggable Authentication”](no-login-pluggable-authentication.html "6.4.1.10 No-Login Pluggable Authentication").

* Inclua a opção `ACCOUNT LOCK` ao criar o ACCOUNT. Consulte [Section 13.7.1.2, “CREATE USER Statement”](create-user.html "13.7.1.2 CREATE USER Statement"). Com este método, inclua também uma password para que, se o ACCOUNT for desbloqueado posteriormente, ele não possa ser acessado sem uma password. (Se o PLUGIN `validate_password` estiver habilitado, ele não permite criar um ACCOUNT sem uma password, mesmo que o ACCOUNT esteja bloqueado. Consulte [Section 6.4.3, “The Password Validation Plugin”](validate-password.html "6.4.3 The Password Validation Plugin").)

* Crie o ACCOUNT com uma password, mas não revele a password a ninguém. Se você não permitir que ninguém saiba a password do ACCOUNT, os CLIENTs não poderão usá-la para se conectar diretamente ao MySQL server.

#### Concedendo e Revogando o PROXY Privilege

O [`PROXY`](privileges-provided.html#priv_proxy) privilege é necessário para permitir que um USER externo se conecte como e tenha os privilégios de outro USER. Para conceder este privilégio, use o comando [`GRANT`](grant.html "13.7.1.4 GRANT Statement"). Por exemplo:

```sql
GRANT PROXY ON 'proxied_user' TO 'proxy_user';
```

O comando cria uma linha na tabela de GRANT `mysql.proxies_priv`.

No momento da conexão, *`proxy_user`* deve representar um USER MySQL válido autenticado externamente, e *`proxied_user`* deve representar um USER válido autenticado localmente. Caso contrário, a tentativa de conexão falha.

A sintaxe [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") correspondente é:

```sql
REVOKE PROXY ON 'proxied_user' FROM 'proxy_user';
```

As extensões de sintaxe [`GRANT`](grant.html "13.7.1.4 GRANT Statement") e [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") do MySQL funcionam como de costume. Exemplos:

```sql
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

O [`PROXY`](privileges-provided.html#priv_proxy) privilege pode ser concedido nestes casos:

* Por um USER que tenha `GRANT PROXY ... WITH GRANT OPTION` para *`proxied_user`*.

* Por *`proxied_user`* para si mesmo: O valor de [`USER()`](information-functions.html#function_user) deve corresponder exatamente a [`CURRENT_USER()`](information-functions.html#function_current-user) e *`proxied_user`*, tanto para as partes de USER name quanto de HOST name do ACCOUNT name.

O ACCOUNT `root` inicial criado durante a instalação do MySQL tem o [`PROXY ... WITH GRANT OPTION`](privileges-provided.html#priv_proxy) privilege para `''@''`, ou seja, para todos os USERs e todos os HOSTs. Isso permite que `root` configure proxy users, bem como delegue a outros ACCOUNTs a autoridade para configurar proxy users. Por exemplo, `root` pode fazer isso:

```sql
CREATE USER 'admin'@'localhost'
  IDENTIFIED BY 'admin_password';
GRANT PROXY
  ON ''@''
  TO 'admin'@'localhost'
  WITH GRANT OPTION;
```

Esses comandos criam um USER `admin` que pode gerenciar todos os mapeamentos `GRANT PROXY`. Por exemplo, `admin` pode fazer isso:

```sql
GRANT PROXY ON sally TO joe;
```

#### Proxy Users Padrão

Para especificar que alguns ou todos os USERs devem se conectar usando um determinado AUTHENTICATION PLUGIN, crie um ACCOUNT MySQL "em branco" com um USER name e um HOST name vazios (`''@''`), associe-o a esse PLUGIN e deixe o PLUGIN retornar o USER name autenticado real (se diferente do USER em branco). Suponha que exista um PLUGIN chamado `ldap_auth` que implementa AUTHENTICATION LDAP e mapeia USERs de conexão para um ACCOUNT de developer ou manager. Para configurar o proxying de USERs para esses ACCOUNTs, use os seguintes comandos:

```sql
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

Agora, suponha que um CLIENT se conecte da seguinte forma:

```sql
$> mysql --user=myuser --password ...
Enter password: myuser_password
```

O server não encontra `myuser` definido como um USER MySQL, mas como existe um ACCOUNT de USER em branco (`''@''`) que corresponde ao USER name e HOST name do CLIENT, o server autentica o CLIENT contra esse ACCOUNT: O server invoca o AUTHENTICATION PLUGIN `ldap_auth` e passa `myuser` e *`myuser_password`* para ele como USER name e password.

Se o PLUGIN `ldap_auth` encontrar no diretório LDAP que *`myuser_password`* não é a password correta para `myuser`, a AUTHENTICATION falha e o server rejeita a conexão.

Se a password estiver correta e `ldap_auth` descobrir que `myuser` é um developer, ele retornará o USER name `developer` para o MySQL server, em vez de `myuser`. Retornar um USER name diferente do USER name do CLIENT (`myuser`) sinaliza para o server que ele deve tratar `myuser` como um PROXY. O server verifica se `''@''` pode autenticar como `developer` (porque `''@''` tem o [`PROXY`](privileges-provided.html#priv_proxy) privilege para fazê-lo) e aceita a conexão. A sessão prossegue com `myuser` tendo os privilégios do proxied user `developer`. (Estes privilégios devem ser configurados pelo DBA usando comandos [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), não mostrado.) As funções [`USER()`](information-functions.html#function_user) e [`CURRENT_USER()`](information-functions.html#function_current-user) retornam estes valores:

```sql
mysql> SELECT USER(), CURRENT_USER();
+------------------+---------------------+
| USER()           | CURRENT_USER()      |
+------------------+---------------------+
| myuser@localhost | developer@localhost |
+------------------+---------------------+
```

Se o PLUGIN, em vez disso, encontrar no diretório LDAP que `myuser` é um manager, ele retornará `manager` como o USER name e a sessão prosseguirá com `myuser` tendo os privilégios do proxied user `manager`.

```sql
mysql> SELECT USER(), CURRENT_USER();
+------------------+-------------------+
| USER()           | CURRENT_USER()    |
+------------------+-------------------+
| myuser@localhost | manager@localhost |
+------------------+-------------------+
```

Para simplificar, a AUTHENTICATION externa não pode ser multinível: Nem as credenciais para `developer` nem as para `manager` são levadas em consideração no exemplo anterior. No entanto, elas ainda são usadas se um CLIENT tentar se conectar e autenticar diretamente como o ACCOUNT `developer` ou `manager`, razão pela qual esses ACCOUNTs proxied devem ser protegidos contra LOGIN direto (consulte [Preventing Direct Login to Proxied Accounts](proxy-users.html#preventing-proxied-account-direct-login "Preventing Direct Login to Proxied Accounts")).

#### Conflitos entre Proxy User Padrão e USER Anônimo

Se você pretende criar um default proxy user (proxy user padrão), verifique a existência de outros ACCOUNTs "que correspondem a qualquer USER" que tenham precedência sobre o default proxy user, pois eles podem impedir que esse USER funcione conforme o esperado.

Na discussão anterior, o ACCOUNT de default proxy user tem `''` na parte do HOST, que corresponde a qualquer HOST. Se você configurar um default proxy user, tome cuidado para verificar também se existem ACCOUNTs não-PROXY com a mesma parte de USER e `'%'` na parte do HOST, porque `'%'` também corresponde a qualquer HOST, mas tem precedência sobre `''` pelas regras que o server usa para ordenar as linhas de ACCOUNT internamente (conssulte [Section 6.2.5, “Access Control, Stage 1: Connection Verification”](connection-access.html "6.2.5 Access Control, Stage 1: Connection Verification")).

Suponha que uma instalação MySQL inclua estes dois ACCOUNTs:

```sql
-- create default proxy account
CREATE USER ''@''
  IDENTIFIED WITH some_plugin
  AS 'some_auth_string';
-- create anonymous account
CREATE USER ''@'%'
  IDENTIFIED BY 'anon_user_password';
```

O primeiro ACCOUNT (`''@''`) é destinado a ser o default proxy user, usado para autenticar conexões para USERs que, de outra forma, não correspondem a um ACCOUNT mais específico. O segundo ACCOUNT (`''@'%'`) é um ACCOUNT de USER anônimo, que pode ter sido criado, por exemplo, para permitir que USERs sem seu próprio ACCOUNT se conectem anonimamente.

Ambos os ACCOUNTs têm a mesma parte de USER (`''`), que corresponde a qualquer USER. E cada ACCOUNT tem uma parte de HOST que corresponde a qualquer HOST. No entanto, há uma prioridade no ACCOUNT matching para tentativas de conexão, porque as regras de matching classificam um HOST de `'%'` à frente de `''`. Para ACCOUNTs que não correspondem a nenhum ACCOUNT mais específico, o server tenta autenticá-los contra `''@'%'` (o USER anônimo) em vez de `''@''` (o default proxy user). Como resultado, o default proxy account nunca é usado.

Para evitar este problema, use uma das seguintes estratégias:

* Remova o ACCOUNT anônimo para que ele não entre em conflito com o default proxy user.

* Use um default proxy user mais específico que corresponda antes do USER anônimo. Por exemplo, para permitir apenas conexões PROXY de `localhost`, use `''@'localhost'`:

```sql
  CREATE USER ''@'localhost'
    IDENTIFIED WITH some_plugin
    AS 'some_auth_string';
  ```

Além disso, modifique quaisquer comandos `GRANT PROXY` para nomear `''@'localhost'` em vez de `''@''` como o proxy user.

Esteja ciente de que esta estratégia impede conexões de USER anônimo a partir de `localhost`.

* Use um ACCOUNT padrão nomeado em vez de um ACCOUNT padrão anônimo. Para um exemplo desta técnica, consulte as instruções para usar o PLUGIN `authentication_windows`. Consulte [Section 6.4.1.8, “Windows Pluggable Authentication”](windows-pluggable-authentication.html "6.4.1.8 Windows Pluggable Authentication").

* Crie múltiplos proxy users, um para conexões locais e outro para "todo o resto" (conexões remotas). Isso pode ser útil, particularmente quando os USERs locais devem ter privilégios diferentes dos USERs remotos.

Crie os proxy users:

```sql
  -- create proxy user for local connections
  CREATE USER ''@'localhost'
    IDENTIFIED WITH some_plugin
    AS 'some_auth_string';
  -- create proxy user for remote connections
  CREATE USER ''@'%'
    IDENTIFIED WITH some_plugin
    AS 'some_auth_string';
  ```

Crie os proxied users:

```sql
  -- create proxied user for local connections
  CREATE USER 'developer'@'localhost'
    IDENTIFIED WITH mysql_no_login;
  -- create proxied user for remote connections
  CREATE USER 'developer'@'%'
    IDENTIFIED WITH mysql_no_login;
  ```

Conceda a cada ACCOUNT PROXY o [`PROXY`](privileges-provided.html#priv_proxy) privilege para o ACCOUNT proxied correspondente:

```sql
  GRANT PROXY
    ON 'developer'@'localhost'
    TO ''@'localhost';
  GRANT PROXY
    ON 'developer'@'%'
    TO ''@'%';
  ```

Finalmente, conceda privilégios apropriados aos proxied users locais e remotos (não mostrado).

Assuma que a combinação `some_plugin`/`'some_auth_string'` faz com que `some_plugin` mapeie o USER name do CLIENT para `developer`. Conexões locais correspondem ao proxy user `''@'localhost'`, que mapeia para o proxied user `'developer'@'localhost'`. Conexões remotas correspondem ao proxy user `''@'%'`, que mapeia para o proxied user `'developer'@'%'`.

#### Suporte do Server para Mapeamento de Proxy User

Alguns AUTHENTICATION PLUGINs implementam o mapeamento de proxy user por conta própria (por exemplo, os AUTHENTICATION PLUGINs PAM e Windows). Outros AUTHENTICATION PLUGINs não suportam proxy users por padrão. Desses, alguns podem solicitar que o próprio MySQL server mapeie proxy users de acordo com os privilégios PROXY concedidos: `mysql_native_password`, `sha256_password`. Se a variável de sistema [`check_proxy_users`](server-system-variables.html#sysvar_check_proxy_users) estiver habilitada, o server executa o mapeamento de proxy user para quaisquer AUTHENTICATION PLUGINs que façam tal solicitação:

* Por padrão, [`check_proxy_users`](server-system-variables.html#sysvar_check_proxy_users) está desabilitado, então o server não executa mapeamento de proxy user, mesmo para AUTHENTICATION PLUGINs que solicitem suporte do server para proxy users.

* Se [`check_proxy_users`](server-system-variables.html#sysvar_check_proxy_users) estiver habilitado, também pode ser necessário habilitar uma variável de sistema específica do PLUGIN para aproveitar o suporte de mapeamento de proxy user do server:

  + Para o PLUGIN `mysql_native_password`, habilite [`mysql_native_password_proxy_users`](server-system-variables.html#sysvar_mysql_native_password_proxy_users).

  + Para o PLUGIN `sha256_password`, habilite [`sha256_password_proxy_users`](server-system-variables.html#sysvar_sha256_password_proxy_users).

Por exemplo, para habilitar todas as capacidades anteriores, inicie o server com estas linhas no arquivo `my.cnf`:

```sql
[mysqld]
check_proxy_users=ON
mysql_native_password_proxy_users=ON
sha256_password_proxy_users=ON
```

Assumindo que as variáveis de sistema relevantes foram habilitadas, crie o proxy user como de costume usando [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), então conceda a ele o [`PROXY`](privileges-provided.html#priv_proxy) privilege para um único outro ACCOUNT a ser tratado como o proxied user. Quando o server recebe uma solicitação de conexão bem-sucedida para o proxy user, ele descobre que o USER tem o [`PROXY`](privileges-provided.html#priv_proxy) privilege e o usa para determinar o proxied user adequado.

```sql
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

Para usar o ACCOUNT PROXY, conecte-se ao server usando seu nome e password:

```sql
$> mysql -u proxy_user -p
Enter password: (enter proxy_user password here)
```

A AUTHENTICATION é bem-sucedida, o server descobre que `proxy_user` tem o [`PROXY`](privileges-provided.html#priv_proxy) privilege para `proxied_user`, e a sessão prossegue com `proxy_user` tendo os privilégios de `proxied_user`.

O mapeamento de proxy user realizado pelo server está sujeito a estas restrições:

* O server não faz PROXY para ou a partir de um USER anônimo, mesmo que o [`PROXY`](privileges-provided.html#priv_proxy) privilege associado seja concedido.

* Quando a um único ACCOUNT são concedidos privilégios PROXY para mais de um ACCOUNT proxied, o mapeamento de proxy user do server é não determinístico. Portanto, não é recomendado conceder privilégios PROXY a um único ACCOUNT para múltiplos ACCOUNTs proxied.

#### Variáveis de Sistema de Proxy User

Duas variáveis de sistema ajudam a rastrear o processo de LOGIN PROXY:

* [`proxy_user`](server-system-variables.html#sysvar_proxy_user): Este valor é `NULL` se o proxying não for usado. Caso contrário, ele indica o ACCOUNT do proxy user. Por exemplo, se um CLIENT se autenticar através do ACCOUNT PROXY `''@''`, esta variável é definida da seguinte forma:

```sql
  mysql> SELECT @@proxy_user;
  +--------------+
  | @@proxy_user |
  +--------------+
  | ''@''        |
  +--------------+
  ```

* [`external_user`](server-system-variables.html#sysvar_external_user): Às vezes, o AUTHENTICATION PLUGIN pode usar um USER externo para autenticar-se no MySQL server. Por exemplo, ao usar a AUTHENTICATION nativa do Windows, um PLUGIN que autentica usando a API do Windows não precisa do LOGIN ID que lhe é passado. No entanto, ele ainda usa um USER ID do Windows para autenticar. O PLUGIN pode retornar este USER ID externo (ou os primeiros 512 bytes UTF-8 dele) para o server usando a variável de sessão somente leitura `external_user`. Se o PLUGIN não definir esta variável, seu valor é `NULL`.