### 6.2.14 Usuários de Proxy

O servidor MySQL autentica as conexões do cliente usando plugins de autenticação. O plugin que autentica uma conexão específica pode solicitar que o usuário conectado (externo) seja tratado como um usuário diferente para fins de verificação de privilégios. Isso permite que o usuário externo seja um proxy para o segundo usuário; ou seja, assuma os privilégios do segundo usuário:

- O usuário externo é um "usuário proxy" (um usuário que pode se passar por outro usuário ou se tornar conhecido como outro usuário).
- O segundo usuário é um "usuário proxy" (um usuário cuja identidade e privilégios podem ser assumidos por um usuário proxy).

Esta seção descreve como a capacidade de usuário proxy funciona. Para informações gerais sobre plugins de autenticação, consulte Seção 6.2.13, “Autenticação Conectada”. Para informações sobre plugins específicos, consulte Seção 6.4.1, “Plugins de Autenticação”. Para informações sobre como escrever plugins de autenticação que suportam usuários proxy, consulte Implementando Suporte a Usuários Proxy em Plugins de Autenticação.

- Requisitos para Suporte ao Usuário Proxy
- Exemplo de usuário do proxy simples
- Prevenção do Login Direto em Contas Proxy
- Concedendo e Revogando o Privilegio de Proxy
- Usuários de Proxy Padrão
- Conflitos entre Usuários de Proxy Padrão e Usuários Anônimos
- Suporte do servidor para mapeamento de usuários do proxy
- Variáveis do sistema de usuários de proxy

#### Requisitos para Suporte de Usuário Proxy

Para que a proxy ocorra para um plugin de autenticação específico, essas condições devem ser atendidas:

- A proxy deve ser suportada, seja pelo próprio plugin, seja pelo servidor MySQL em nome do plugin. Neste último caso, pode ser necessário habilitar o suporte do servidor explicitamente; consulte Suporte do Servidor para Mapeamento de Usuários Proxy.

- A conta do usuário proxy externo deve ser configurada para ser autenticada pelo plugin. Use a instrução `CREATE USER` para associar uma conta a um plugin de autenticação ou `ALTER USER` para alterar seu plugin.

- A conta do usuário proxy deve existir e ter os privilégios concedidos para que o usuário proxy possa assumir. Use as instruções `CREATE USER` e `GRANT` para isso.

- Normalmente, o usuário proxy é configurado para que ele possa ser usado apenas em cenários de proxy e não para logins diretos.

- A conta de usuário proxy deve ter o privilégio `PROXY` para a conta proxy. Use a instrução `GRANT` para isso.

- Para que um cliente que se conecta à conta do proxy seja tratado como um usuário do proxy, o plugin de autenticação deve retornar um nome de usuário diferente do nome de usuário do cliente, para indicar o nome de usuário da conta proxy que define os privilégios a serem assumidos pelo usuário do proxy.

  Alternativamente, para plugins que fornecem mapeamento de proxy pelo servidor, o usuário proxy é determinado a partir do privilégio `PROXY` mantido pelo usuário proxy.

O mecanismo de proxy permite mapear apenas o nome do usuário do cliente externo para o nome do usuário proxy. Não há nenhuma disposição para mapear nomes de host:

- Quando um cliente se conecta ao servidor, o servidor determina a conta correta com base no nome de usuário passado pelo programa do cliente e no host a partir do qual o cliente se conecta.

- Se essa conta for uma conta proxy, o servidor tenta determinar a conta proxy apropriada, encontrando uma correspondência para uma conta proxy usando o nome de usuário retornado pelo plugin de autenticação e o nome do host da conta proxy. O nome do host na conta proxy é ignorado.

#### Exemplo de usuário do Proxy Simples

Considere as seguintes definições de contas:

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

Quando um cliente se conecta como `employee_ext` do host local, o MySQL usa o plugin chamado `my_auth_plugin` para realizar a autenticação. Suponha que `my_auth_plugin` retorne o nome de usuário `employee` ao servidor, com base no conteúdo de `'my_auth_string'` e, possivelmente, consultando algum sistema de autenticação externo. O nome `employee` difere de `employee_ext`, então retornar `employee` serve como um pedido ao servidor para tratar o usuário externo `employee_ext`, para fins de verificação de privilégios, como o usuário local `employee`.

Neste caso, `employee_ext` é o usuário proxy e `employee` é o usuário proxy.

O servidor verifica se a autenticação de proxy para `employee` é possível para o usuário `employee_ext` verificando se `employee_ext` (o usuário proxy) possui o privilégio `PROXY` para `employee` (o usuário proxy). Se este privilégio não tiver sido concedido, ocorre um erro. Caso contrário, `employee_ext` assume os privilégios de `employee`. O servidor verifica as declarações executadas durante a sessão do cliente por `employee_ext` contra os privilégios concedidos a `employee`. Neste caso, `employee_ext` pode acessar tabelas no banco de dados `employees`.

A conta proxy, `employee`, usa o plugin de autenticação `mysql_no_login` para impedir que os clientes usem a conta para fazer login diretamente. (Isso pressupõe que o plugin esteja instalado. Para instruções, consulte Seção 6.4.1.10, “Autenticação Pluggable sem Login”.) Para métodos alternativos de proteção de contas proxy contra uso direto, consulte Prevenção de Login Direto em Contas Proxy.

Quando ocorre o redirecionamento, as funções `USER()` e `CURRENT_USER()` podem ser usadas para ver a diferença entre o usuário conectado (o usuário proxy) e a conta cujos privilégios se aplicam durante a sessão atual (o usuário redirecionado). Para o exemplo descrito, essas funções retornam esses valores:

```sql
mysql> SELECT USER(), CURRENT_USER();
+------------------------+--------------------+
| USER()                 | CURRENT_USER()     |
+------------------------+--------------------+
| employee_ext@localhost | employee@localhost |
+------------------------+--------------------+
```

Na instrução `CREATE USER` que cria a conta de usuário proxy, a cláusula `IDENTIFIED WITH` que nomeia o plugin de autenticação que suporta o proxy é opcionalmente seguida por uma cláusula `AS 'auth_string'` que especifica uma string que o servidor passa para o plugin quando o usuário se conecta. Se presente, a string fornece informações que ajudam o plugin a determinar como mapear o nome do usuário do cliente proxy (externo) para um nome de usuário proxy. Cabe a cada plugin decidir se requer a cláusula `AS`. Se assim for, o formato da string de autenticação depende de como o plugin pretende usá-la. Consulte a documentação do plugin específico para obter informações sobre os valores da string de autenticação que ele aceita.

#### Prevenção do login direto em contas proxy

As contas proxy são geralmente destinadas a serem usadas apenas por meio de contas proxy. Ou seja, os clientes se conectam usando uma conta proxy e são mapeados e assumem os privilégios do usuário proxy apropriado.

Existem várias maneiras de garantir que uma conta proxy não possa ser usada diretamente:

- Associe a conta ao plugin de autenticação `mysql_no_login`. Nesse caso, a conta não pode ser usada para logins diretos em nenhuma circunstância. Isso pressupõe que o plugin esteja instalado. Para obter instruções, consulte Seção 6.4.1.10, “Autenticação Pluggable sem Login”.

- Inclua a opção `ACCOUNT LOCK` ao criar a conta. Veja Seção 13.7.1.2, “Instrução CREATE USER”. Com esse método, inclua também uma senha para que, se a conta for desbloqueada posteriormente, ela não possa ser acessada sem a senha. (Se o plugin `validate_password` estiver habilitado, ele não permite a criação de uma conta sem senha, mesmo que a conta esteja bloqueada. Veja Seção 6.4.3, “O Plugin de Validação de Senha”.)

- Crie a conta com uma senha, mas não diga a ninguém a senha. Se você não permitir que ninguém saiba a senha da conta, os clientes não poderão usá-la para se conectar diretamente ao servidor MySQL.

#### Concedendo e revogando o privilégio de PROXY

O privilégio `PROXY` é necessário para permitir que um usuário externo se conecte como outro usuário e tenha os privilégios desse usuário. Para conceder esse privilégio, use a instrução `GRANT`. Por exemplo:

```sql
GRANT PROXY ON 'proxied_user' TO 'proxy_user';
```

A declaração cria uma linha na tabela de concessão `mysql.proxies_priv`.

No momento da conexão, *`proxy_user`* deve representar um usuário MySQL autenticado externamente válido, e *`proxied_user`* deve representar um usuário autenticado localmente válido. Caso contrário, a tentativa de conexão falhará.

A sintaxe correspondente a `REVOKE` é:

```sql
REVOKE PROXY ON 'proxied_user' FROM 'proxy_user';
```

As extensões de sintaxe de `GRANT` (grant.html) e `REVOKE` (revoke.html) do MySQL funcionam normalmente. Exemplos:

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

O privilégio `PROXY` pode ser concedido nestes casos:

- Por um usuário que tenha `GRANT PROXY ... WITH GRANT OPTION` para *`proxied_user`*.

- Por *`proxied_user`* para si mesmo: O valor de `USER()` deve corresponder exatamente a `CURRENT_USER()` e *`proxied_user`*, tanto para as partes do nome de usuário quanto do nome do host do nome da conta.

A conta `root` inicial criada durante a instalação do MySQL tem o privilégio \`PROXY ... COM OPÇÃO DE CONCEDIMENTO DE PERMISSÃO para `''@''`, ou seja, para todos os usuários e todos os hosts. Isso permite que o `root`configure usuários proxy, além de delegar a outras contas a autoridade para configurar usuários proxy. Por exemplo, o`root\` pode fazer isso:

```sql
CREATE USER 'admin'@'localhost'
  IDENTIFIED BY 'admin_password';
GRANT PROXY
  ON ''@''
  TO 'admin'@'localhost'
  WITH GRANT OPTION;
```

Essas declarações criam um usuário `admin` que pode gerenciar todas as mapeamentos `GRANT PROXY`. Por exemplo, o `admin` pode fazer isso:

```sql
GRANT PROXY ON sally TO joe;
```

#### Usuários de proxy padrão

Para especificar que alguns ou todos os usuários devem se conectar usando um plugin de autenticação específico, crie uma conta MySQL “vazia” com um nome de usuário e nome de host em branco (`''@''`), associe-a a esse plugin e deixe o plugin retornar o nome real do usuário autenticado (se diferente do usuário em branco). Suponha que exista um plugin chamado `ldap_auth` que implementa a autenticação LDAP e mapeia os usuários conectados para uma conta de desenvolvedor ou gerente. Para configurar o encaminhamento dos usuários para essas contas, use as seguintes instruções:

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

Agora, suponha que um cliente se conecte da seguinte forma:

```sh
$> mysql --user=myuser --password ...
Enter password: myuser_password
```

O servidor não encontra `myuser` definido como um usuário MySQL, mas, como há uma conta de usuário em branco (`''@''`) que corresponde ao nome do usuário e ao nome do host do cliente, o servidor autentica o cliente contra essa conta: O servidor invoca o plugin de autenticação `ldap_auth` e passa `myuser` e *`myuser_password`* como o nome do usuário e a senha.

Se o plugin `ldap_auth` encontrar no diretório LDAP que *`myuser_password`* não é a senha correta para `myuser`, a autenticação falha e o servidor rejeita a conexão.

Se a senha estiver correta e o `ldap_auth` verificar que `myuser` é um desenvolvedor, ele retornará o nome do usuário `developer` ao servidor MySQL, em vez de `myuser`. Retornar um nome de usuário diferente do nome do usuário do cliente de `myuser` sinaliza ao servidor que ele deve tratar `myuser` como um proxy. O servidor verifica que `''@''` pode autenticar-se como `developer` (porque `''@''` tem o privilégio `PROXY` para fazer isso) e aceita a conexão. A sessão prossegue com `myuser` tendo os privilégios do usuário proxy `developer`. (Esses privilégios devem ser configurados pelo DBA usando declarações `GRANT`, não mostradas.) As funções `USER()` e `CURRENT_USER()` retornam esses valores:

```sql
mysql> SELECT USER(), CURRENT_USER();
+------------------+---------------------+
| USER()           | CURRENT_USER()      |
+------------------+---------------------+
| myuser@localhost | developer@localhost |
+------------------+---------------------+
```

Se o plugin, em vez disso, encontrar no diretório LDAP que `myuser` é um gerente, ele retornará `manager` como o nome do usuário e a sessão prosseguirá com `myuser` tendo os privilégios do usuário `manager` proxy.

```sql
mysql> SELECT USER(), CURRENT_USER();
+------------------+-------------------+
| USER()           | CURRENT_USER()    |
+------------------+-------------------+
| myuser@localhost | manager@localhost |
+------------------+-------------------+
```

Por simplicidade, a autenticação externa não pode ser múltipla: nem as credenciais para `desenvolvedor` nem para `gerente` são consideradas no exemplo anterior. No entanto, elas ainda são usadas se um cliente tentar se conectar e autenticar diretamente como a conta `desenvolvedor` ou `gerente`, e é por isso que essas contas proxy devem ser protegidas contra login direto (consulte Prevenção de login direto em contas proxy).

#### Conflitos de Usuário Proxy Padrão e Usuário Anônimo

Se você pretende criar um usuário proxy padrão, verifique se há outras contas "qualquer usuário" existentes que tenham precedência sobre o usuário proxy padrão, pois elas podem impedir que o usuário funcione conforme o esperado.

Na discussão anterior, a conta de usuário de proxy padrão tem `''` na parte do host, o que corresponde a qualquer host. Se você configurar uma conta de usuário de proxy, certifique-se de verificar se existem contas sem proxy com a mesma parte do usuário e `'%'` na parte do host, porque `'%'` também corresponde a qualquer host, mas tem precedência sobre `''` pelas regras que o servidor usa para ordenar as linhas de conta internamente (veja Seção 6.2.5, “Controle de Acesso, Etapa 1: Verificação de Conexão”).

Suponha que uma instalação do MySQL inclua essas duas contas:

```sql
-- create default proxy account
CREATE USER ''@''
  IDENTIFIED WITH some_plugin
  AS 'some_auth_string';
-- create anonymous account
CREATE USER ''@'%'
  IDENTIFIED BY 'anon_user_password';
```

A primeira conta (`''@''`) é destinada ao usuário proxy padrão, usado para autenticar conexões para usuários que não correspondem a uma conta mais específica. A segunda conta (`''@'%'`) é uma conta de usuário anônimo, que pode ter sido criada, por exemplo, para permitir que usuários sem sua própria conta se conectem anonimamente.

Ambas as contas têm a mesma parte de usuário (`''`), que corresponde a qualquer usuário. E cada conta tem uma parte de host que corresponde a qualquer host. No entanto, há uma prioridade na correspondência de contas para tentativas de conexão, porque as regras de correspondência classificam um host de `'%'` antes de `''`. Para contas que não correspondem a nenhuma conta mais específica, o servidor tenta autenticá-las contra `''@'%'` (o usuário anônimo) em vez de `''@''` (o usuário proxy padrão). Como resultado, a conta proxy padrão nunca é usada.

Para evitar esse problema, use uma das seguintes estratégias:

- Remova a conta anônima para que ela não conflita com o usuário do proxy padrão.

- Use um usuário proxy padrão mais específico que antecipe o usuário anônimo. Por exemplo, para permitir apenas conexões de proxy `localhost`, use `''@'localhost'`:

  ```sql
  CREATE USER ''@'localhost'
    IDENTIFIED WITH some_plugin
    AS 'some_auth_string';
  ```

  Além disso, modifique quaisquer declarações `GRANT PROXY` para nomear `''@'localhost'` em vez de `''@''` como o usuário do proxy.

  Tenha em mente que essa estratégia impede as conexões de usuários anônimos de `localhost`.

- Use uma conta padrão nomeada em vez de uma conta padrão anônima. Para obter um exemplo dessa técnica, consulte as instruções para usar o plugin `authentication_windows`. Veja Seção 6.4.1.8, “Autenticação Pluggable Windows”.

- Crie vários usuários proxy, um para conexões locais e outro para "tudo o mais" (conexões remotas). Isso pode ser útil, especialmente quando os usuários locais devem ter privilégios diferentes dos usuários remotos.

  Crie os usuários proxy:

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

  Crie os usuários proxy:

  ```sql
  -- create proxied user for local connections
  CREATE USER 'developer'@'localhost'
    IDENTIFIED WITH mysql_no_login;
  -- create proxied user for remote connections
  CREATE USER 'developer'@'%'
    IDENTIFIED WITH mysql_no_login;
  ```

  Atribua ao respectivo serviço proxy a permissão `PROXY` para a conta proxy correspondente:

  ```sql
  GRANT PROXY
    ON 'developer'@'localhost'
    TO ''@'localhost';
  GRANT PROXY
    ON 'developer'@'%'
    TO ''@'%';
  ```

  Por fim, conceda privilégios apropriados aos usuários proxy locais e remotos (não mostrados).

  Suponha que a combinação `some_plugin`/`'some_auth_string'` faça com que o `some_plugin` mapeie o nome do usuário do cliente para `developer`. As conexões locais correspondem ao usuário do proxy `''@'localhost'`, que é mapeado para o usuário proxied `'developer'@'localhost'`. As conexões remotas correspondem ao usuário do proxy `''@'%'`, que é mapeado para o usuário proxied `'developer'@'%'`.

#### Suporte ao servidor para mapeamento de usuários proxy

Alguns plugins de autenticação implementam mapeamento de usuários proxy para si mesmos (por exemplo, os plugins de autenticação PAM e Windows). Outros plugins de autenticação não suportam usuários proxy por padrão. Destes, alguns podem solicitar que o próprio servidor MySQL mapeie usuários proxy de acordo com os privilégios de proxy concedidos: `mysql_native_password`, `sha256_password`. Se a variável de sistema `check_proxy_users` estiver habilitada, o servidor realiza o mapeamento de usuários proxy para quaisquer plugins de autenticação que façam tal solicitação:

- Por padrão, `check_proxy_users` está desativado, portanto, o servidor não realiza mapeamento de usuários proxy, mesmo para plugins de autenticação que solicitam suporte do servidor para usuários proxy.

- Se `check_proxy_users` estiver habilitado, também pode ser necessário habilitar uma variável de sistema específica do plugin para aproveitar o suporte ao mapeamento de usuários do proxy do servidor:

  - Para o plugin `mysql_native_password`, habilite `mysql_native_password_proxy_users`.

  - Para o plugin `sha256_password`, habilite `sha256_password_proxy_users`.

Por exemplo, para habilitar todas as capacidades anteriores, inicie o servidor com essas linhas no arquivo `my.cnf`:

```
[mysqld]
check_proxy_users=ON
mysql_native_password_proxy_users=ON
sha256_password_proxy_users=ON
```

Supondo que as variáveis do sistema relevantes tenham sido habilitadas, crie o usuário proxy normalmente usando `CREATE USER`, e, em seguida, conceda-lhe o privilégio `PROXY` a uma única outra conta que será tratada como o usuário proxy. Quando o servidor recebe uma solicitação de conexão bem-sucedida para o usuário proxy, ele verifica que o usuário possui o privilégio `PROXY` e usa-o para determinar o usuário proxy apropriado.

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

Para usar a conta de proxy, conecte-se ao servidor usando seu nome e senha:

```sh
$> mysql -u proxy_user -p
Enter password: (enter proxy_user password here)
```

A autenticação é bem-sucedida, o servidor verifica que `proxy_user` tem o privilégio `PROXY` para `proxied_user`, e a sessão prossegue com `proxy_user` tendo os privilégios de `proxied_user`.

A mapeamento de usuários proxy realizado pelo servidor está sujeito a essas restrições:

- O servidor não encaminha para ou a partir de um usuário anônimo, mesmo que o privilégio associado `PROXY` seja concedido.

- Quando uma única conta recebe privilégios de proxy para mais de uma conta proxy, o mapeamento de usuários do proxy do servidor não é determinístico. Portanto, não é recomendado conceder privilégios de proxy a uma única conta para múltiplas contas proxy.

#### Variáveis de sistema de usuário proxy

Duas variáveis do sistema ajudam a rastrear o processo de login do proxy:

- `proxy_user`: Este valor é `NULL` se a proxy não estiver sendo usada. Caso contrário, ele indica a conta de usuário da proxy. Por exemplo, se um cliente se autenticar através da conta `''@''` da proxy, essa variável será definida da seguinte forma:

  ```sql
  mysql> SELECT @@proxy_user;
  +--------------+
  | @@proxy_user |
  +--------------+
  | ''@''        |
  +--------------+
  ```

- `external_user`: Às vezes, o plugin de autenticação pode usar um usuário externo para autenticar-se no servidor MySQL. Por exemplo, ao usar a autenticação nativa do Windows, um plugin que autentica usando a API do Windows não precisa do ID de login passado para ele. No entanto, ele ainda usa um ID de usuário do Windows para autenticar. O plugin pode retornar esse ID de usuário externo (ou os primeiros 512 bytes UTF-8) ao servidor usando a variável de sessão `external_user` somente de leitura. Se o plugin não definir essa variável, seu valor será `NULL`.
