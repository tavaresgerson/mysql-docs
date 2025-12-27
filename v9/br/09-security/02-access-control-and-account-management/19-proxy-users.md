### 8.2.19 Usuários Proxy

O servidor MySQL autentica as conexões do cliente usando plugins de autenticação. O plugin que autentica uma conexão específica pode solicitar que o usuário conectado (externo) seja tratado como um usuário diferente para fins de verificação de privilégios. Isso permite que o usuário externo seja um proxy para o segundo usuário; ou seja, assuma os privilégios do segundo usuário:

* O usuário externo é um "usuário proxy" (um usuário que pode se passar por outro usuário ou se tornar conhecido como outro usuário).

* O segundo usuário é um "usuário proxy" (um usuário cuja identidade e privilégios podem ser assumidos por um usuário proxy).

Esta seção descreve como a capacidade de usuário proxy funciona. Para informações gerais sobre plugins de autenticação, consulte a Seção 8.2.17, “Plugins de Autenticação”. Para informações sobre plugins específicos, consulte a Seção 8.4.1, “Plugins de Autenticação”. Para informações sobre como escrever plugins de autenticação que suportam usuários proxy, consulte Implementando Suporte a Usuários Proxy em Plugins de Autenticação.

* Requisitos para Suporte a Usuários Proxy
* Exemplo Simples de Usuário Proxy
* Prevenindo Login Direto em Contas Proxy
* Conceder e Retirar o Privilégio PROXY
* Usuários Proxy Padrão
* Conflitos entre Usuários Proxy e Usuários Anônimos Padrão
* Suporte do Servidor para Mapeamento de Usuários Proxy
* Variáveis do Sistema de Usuários Proxy

Nota

Um benefício administrativo obtido com o uso de um proxy é que o DBA pode configurar uma única conta com um conjunto de privilégios e, em seguida, permitir que vários usuários do proxy tenham esses privilégios sem precisar atribuir os privilégios individualmente a cada um desses usuários. Como alternativa aos usuários do proxy, os DBAs podem achar que os papéis fornecem uma maneira adequada de mapear usuários para conjuntos específicos de privilégios nomeados. Cada usuário pode ser concedido um determinado papel único, o que, na prática, concede o conjunto apropriado de privilégios. Veja a Seção 8.2.10, “Usando Papéis”.

#### Requisitos para Suporte a Usuários de Proxy

Para que o uso de proxy ocorra para um plugin de autenticação específico, essas condições devem ser atendidas:

* O uso de proxy deve ser suportado, seja pelo próprio plugin, seja pelo servidor MySQL em nome do plugin. No último caso, o suporte do servidor pode precisar ser habilitado explicitamente; veja Suporte ao Servidor para Mapeamento de Usuários Proxy.

* A conta do usuário proxy externo deve ser configurada para ser autenticada pelo plugin. Use a instrução `CREATE USER` para associar uma conta a um plugin de autenticação ou `ALTER USER` para alterá-la.

* A conta do usuário proxy deve existir e ter os privilégios concedidos para serem assumidos pelo usuário proxy. Use as instruções `CREATE USER` e `GRANT` para isso.

* Normalmente, o usuário proxy é configurado para que possa ser usado apenas em cenários de proxy e não para logins diretos.

* A conta do usuário proxy deve ter o privilégio `PROXY` para a conta proxy. Use a instrução `GRANT` para isso.

* Para que o cliente que se conecta à conta do proxy seja tratado como um usuário proxy, o plugin de autenticação deve retornar um nome de usuário diferente do nome do usuário do cliente, para indicar o nome de usuário da conta proxy que define os privilégios a serem assumidos pelo usuário proxy.

Alternativamente, para plugins que fornecem mapeamento de proxy pelo servidor, o usuário mapeado é determinado a partir do privilégio `PROXY` mantido pelo usuário proxy.

O mecanismo de proxy permite mapear apenas o nome do usuário do cliente externo para o nome do usuário mapeado. Não há disposição para mapear nomes de host:

* Quando um cliente se conecta ao servidor, o servidor determina a conta apropriada com base no nome de usuário passado pelo programa cliente e no host a partir do qual o cliente se conecta.

* Se essa conta for uma conta proxy, o servidor tenta determinar a conta mapeada apropriada encontrando uma correspondência para uma conta mapeada usando o nome de usuário retornado pelo plugin de autenticação e o nome do host da conta proxy. O nome do host na conta mapeada é ignorado.

#### Exemplo de Usuário Proxy Simples

Considere as seguintes definições de conta:

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

Quando um cliente se conecta como `employee_ext` do host local, o MySQL usa o plugin chamado `my_auth_plugin` para realizar a autenticação. Suponha que `my_auth_plugin` retorne um nome de usuário de `employee` ao servidor, com base no conteúdo de `'my_auth_string'` e talvez consultando algum sistema de autenticação externo. O nome `employee` difere de `employee_ext`, então retornar `employee` serve como um pedido ao servidor para tratar o `employee_ext` usuário externo, para fins de verificação de privilégios, como o usuário local `employee`.

Neste caso, `employee_ext` é o usuário proxy e `employee` é o usuário mapeado.

O servidor verifica se a autenticação de proxy para `employee` é possível para o usuário `employee_ext` verificando se `employee_ext` (o usuário proxy) tem o privilégio `PROXY` para `employee` (o usuário proxy). Se esse privilégio não tiver sido concedido, ocorre um erro. Caso contrário, `employee_ext` assume os privilégios de `employee`. O servidor verifica as instruções executadas durante a sessão do cliente por `employee_ext` contra os privilégios concedidos a `employee`. Neste caso, `employee_ext` pode acessar tabelas no banco de dados `employees`.

A conta proxy, `employee`, usa o plugin de autenticação `mysql_no_login` para impedir que os clientes usem a conta para fazer login diretamente. (Isso pressupõe que o plugin esteja instalado. Para instruções, consulte a Seção 8.4.1.8, “Autenticação Plugável sem Login”.) Para métodos alternativos de proteção de contas proxy contra uso direto, consulte Prevenir Login Direto em Contas Proxy.

Quando ocorre a proxy, as funções `USER()` e `CURRENT_USER()` podem ser usadas para ver a diferença entre o usuário conectado (o usuário proxy) e a conta cujos privilégios se aplicam durante a sessão atual (o usuário proxy). Para o exemplo descrito, essas funções retornam esses valores:

```
mysql> SELECT USER(), CURRENT_USER();
+------------------------+--------------------+
| USER()                 | CURRENT_USER()     |
+------------------------+--------------------+
| employee_ext@localhost | employee@localhost |
+------------------------+--------------------+
```

Na instrução `CREATE USER` que cria a conta de usuário proxy, a cláusula `IDENTIFIED WITH` que nomeia o plugin de autenticação que suporta o proxy é opcionalmente seguida por uma cláusula `AS 'auth_string'` que especifica uma string que o servidor passa ao plugin quando o usuário se conecta. Se presente, a string fornece informações que ajudam o plugin a determinar como mapear o nome do usuário do cliente (externo) do proxy para um nome de usuário proxy. Cabe a cada plugin decidir se requer a cláusula `AS`. Se assim for, o formato da string de autenticação depende de como o plugin pretende usá-la. Consulte a documentação do plugin específico para obter informações sobre os valores da string de autenticação que ele aceita.

#### Prevenindo o Login Direto em Contas Proxy

As contas proxy geralmente são destinadas a serem usadas apenas por meio de contas proxy. Ou seja, os clientes se conectam usando uma conta proxy, e depois são mapeados e assumem os privilégios do usuário proxy apropriado.

Existem várias maneiras de garantir que uma conta proxy não possa ser usada diretamente:

* Associe a conta ao plugin de autenticação `mysql_no_login`. Nesse caso, a conta não pode ser usada para logins diretos sob nenhuma circunstância. Isso pressupõe que o plugin esteja instalado. Para instruções, consulte a Seção 8.4.1.8, “Autenticação Plugável sem Login”.

* Inclua a opção `ACCOUNT LOCK` ao criar a conta. Consulte a Seção 15.7.1.3, “Instrução CREATE USER”. Com esse método, inclua também uma senha para que, se a conta for desbloqueada posteriormente, ela não possa ser acessada sem senha. (Se o componente `validate_password` estiver habilitado, não é permitido criar uma conta sem senha, mesmo que a conta esteja bloqueada. Consulte a Seção 8.4.4, “O Componente de Validação de Senha”.)

* Crie a conta com uma senha, mas não diga a ninguém a senha. Se você não permitir que ninguém saiba a senha da conta, os clientes não poderão usá-la para se conectar diretamente ao servidor MySQL.

#### Conceder e Retirar o Privilegio de PROXY

O privilégio `PROXY` é necessário para permitir que um usuário externo se conecte como outro usuário e tenha os privilégios desse outro usuário. Para conceder este privilégio, use a instrução `GRANT`. Por exemplo:

```
GRANT PROXY ON 'proxied_user' TO 'proxy_user';
```

A instrução cria uma linha na tabela `mysql.proxies_priv` de concessão.

No momento da conexão, *`proxy_user`* deve representar um usuário MySQL autenticado externamente válido, e *`proxied_user`* deve representar um usuário autenticado localmente válido. Caso contrário, a tentativa de conexão falha.

A sintaxe correspondente de `REVOKE` é:

```
REVOKE PROXY ON 'proxied_user' FROM 'proxy_user';
```

As extensões de sintaxe `GRANT` e `REVOKE` do MySQL funcionam normalmente. Exemplos:

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

* Por um usuário que tenha `GRANT PROXY ... WITH GRANT OPTION` para *`proxied_user`*.

* Por *`proxied_user`* para si mesmo: O valor de `USER()` deve corresponder exatamente a `CURRENT_USER()` e *`proxied_user`*, tanto para a parte do nome do usuário quanto para a parte do nome do host da conta.

A conta inicial `root` criada durante a instalação do MySQL tem o privilégio `PROXY ... WITH GRANT OPTION` para `''@''`, ou seja, para todos os usuários e todos os hosts. Isso permite que o `root` configure usuários proxy, bem como delegar a outras contas a autoridade para configurar usuários proxy. Por exemplo, o `root` pode fazer isso:

```
CREATE USER 'admin'@'localhost'
  IDENTIFIED BY 'admin_password';
GRANT PROXY
  ON ''@''
  TO 'admin'@'localhost'
  WITH GRANT OPTION;
```

Essas instruções criam um usuário `admin` que pode gerenciar todas as mapeamentos de `GRANT PROXY`. Por exemplo, o `admin` pode fazer isso:

```
GRANT PROXY ON sally TO joe;
```

#### Usuários Proxy Padrão
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

Para especificar que alguns ou todos os usuários devem se conectar usando um plugin de autenticação fornecido, crie uma conta MySQL “vazia” com um nome de usuário e nome de host em branco (`''@''`), associe-a a esse plugin e deixe o plugin retornar o nome real do usuário autenticado (se diferente do usuário em branco). Suponha que exista um plugin chamado `ldap_auth` que implementa a autenticação LDAP e mapeia os usuários conectados para uma conta de desenvolvedor ou gerente. Para configurar o redirecionamento dos usuários para essas contas, use as seguintes instruções:

```
$> mysql --user=myuser --password ...
Enter password: myuser_password
```

Agora, suponha que um cliente se conecte da seguinte forma:

```
mysql> SELECT USER(), CURRENT_USER();
+------------------+---------------------+
| USER()           | CURRENT_USER()      |
+------------------+---------------------+
| myuser@localhost | developer@localhost |
+------------------+---------------------+
```

O servidor não encontra `myuser` definido como um usuário MySQL, mas, como existe uma conta de usuário em branco (`''@''`) que corresponde ao nome de usuário e ao nome de host do cliente, o servidor autentica o cliente contra essa conta. O servidor invoca o plugin de autenticação `ldap_auth` e passa `myuser` e *`myuser_password`* para ele como nome de usuário e senha.

Se o plugin `ldap_auth` encontrar no diretório LDAP que *`myuser_password`* não é a senha correta para `myuser`, a autenticação falha e o servidor rejeita a conexão.

Se a senha estiver correta e o `ldap_auth` verificar que `myuser` é um desenvolvedor, ele retornará o nome de usuário `developer` ao servidor MySQL, em vez de `myuser`. Retornar um nome de usuário diferente do nome de usuário do cliente de `myuser` sinaliza ao servidor que ele deve tratar `myuser` como um proxy. O servidor verifica que `''@''` pode autenticar-se como `developer` (porque `''@''` tem o privilégio `PROXY` para fazer isso) e aceita a conexão. A sessão prossegue com `myuser` tendo os privilégios do usuário proxy `developer`. (Esses privilégios devem ser configurados pelo DBA usando declarações `GRANT`, não mostradas.) As funções `USER()` e `CURRENT_USER()` retornam esses valores:

```
mysql> SELECT USER(), CURRENT_USER();
+------------------+-------------------+
| USER()           | CURRENT_USER()    |
+------------------+-------------------+
| myuser@localhost | manager@localhost |
+------------------+-------------------+
```

Se o plugin, em vez disso, encontrar no diretório LDAP que `myuser` é um gerente, ele retornará `manager` como o nome de usuário e a sessão prossegue com `myuser` tendo os privilégios do usuário proxy `manager`.

```
-- create default proxy account
CREATE USER ''@''
  IDENTIFIED WITH some_plugin
  AS 'some_auth_string';
-- create anonymous account
CREATE USER ''@'%'
  IDENTIFIED BY 'anon_user_password';
```

Por simplicidade, a autenticação externa não pode ser múltipla: Nem as credenciais para `developer` nem para `manager` são levadas em consideração no exemplo anterior. No entanto, elas ainda são usadas se um cliente tentar se conectar e autenticar-se diretamente como a conta `developer` ou `manager`, e é por isso que essas contas proxy devem ser protegidas contra login direto (veja Prevenir Login Direto para Contas Proxy).

#### Conflitos de Usuário Proxy Padrão e Usuário Anônimo

Se você pretende criar um usuário proxy padrão, verifique se existem outras contas existentes que "combinam com qualquer usuário" que tenham precedência sobre o usuário proxy padrão, pois elas podem impedir que o usuário funcione como pretendido.

Na discussão anterior, a conta de usuário de proxy padrão tem `''` na parte do host, o que corresponde a qualquer host. Se você configurar uma conta de usuário de proxy padrão, certifique-se de verificar também se existem contas sem proxy com a mesma parte do usuário e `'%'` na parte do host, porque `'%'` também corresponde a qualquer host, mas tem precedência sobre `''` pelas regras que o servidor usa para ordenar as linhas da conta internamente (veja a Seção 8.2.6, “Controle de Acesso, Etapa 1: Verificação de Conexão”).

Suponha que uma instalação do MySQL inclua essas duas contas:

```
  CREATE USER ''@'localhost'
    IDENTIFIED WITH some_plugin
    AS 'some_auth_string';
  ```

A primeira conta (`''@''`) é destinada a ser a conta de usuário de proxy padrão, usada para autenticar conexões para usuários que, de outra forma, não correspondem a uma conta mais específica. A segunda conta (`''@'%'`) é uma conta de usuário anônimo, que pode ter sido criada, por exemplo, para permitir que usuários sem sua própria conta se conectem anonimamente.

Ambas as contas têm a mesma parte do usuário (`''`), que corresponde a qualquer usuário. E cada conta tem uma parte do host que corresponde a qualquer host. No entanto, há uma prioridade na correspondência de contas para tentativas de conexão, porque as regras de correspondência classificam um host de `'%'` antes de `''`. Para contas que não correspondem a nenhuma conta mais específica, o servidor tenta autenticá-las contra `''@'%'` (o usuário anônimo) em vez de `''@''` (a conta de proxy padrão). Como resultado, a conta de proxy padrão nunca é usada.

Para evitar esse problema, use uma das seguintes estratégias:

* Remova a conta anônima para que ela não conflita com a conta de proxy padrão.

* Use uma conta de proxy padrão mais específica que corresponda à anterior ao usuário anônimo. Por exemplo, para permitir apenas conexões de proxy `localhost`, use `''@'localhost'`:

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

Além disso, modifique quaisquer declarações `GRANT PROXY` para nomear `''@'localhost'` em vez de `''@''` como o usuário do proxy.

Tenha em mente que essa estratégia impede conexões de usuários anônimos do `localhost`.

* Use uma conta padrão nomeada em vez de uma conta padrão anônima. Para um exemplo dessa técnica, consulte as instruções para usar o plugin `authentication_windows`. Veja a Seção 8.4.1.5, “Windows Pluggable Authentication”.

* Crie vários usuários de proxy, um para conexões locais e outro para “tudo o mais” (conexões remotas). Isso pode ser útil, especialmente quando os usuários locais devem ter privilégios diferentes dos usuários remotos.

Crie os usuários de proxy:

```
  -- create proxied user for local connections
  CREATE USER 'developer'@'localhost'
    IDENTIFIED WITH mysql_no_login;
  -- create proxied user for remote connections
  CREATE USER 'developer'@'%'
    IDENTIFIED WITH mysql_no_login;
  ```

Crie os usuários proxy:

```
  GRANT PROXY
    ON 'developer'@'localhost'
    TO ''@'localhost';
  GRANT PROXY
    ON 'developer'@'%'
    TO ''@'%';
  ```

Conceda ao usuário de cada conta de proxy o privilégio `PROXY` para a conta proxy correspondente:

```
[mysqld]
check_proxy_users=ON
sha256_password_proxy_users=ON
```

Por fim, conceda os privilégios apropriados aos usuários proxy locais e remotos (não mostrados).

Assuma que a combinação `some_plugin`/`'some_auth_string'` faz com que `some_plugin` mapeie o nome do usuário do cliente para `developer`. As conexões locais correspondem ao usuário do proxy `''@'localhost'`, que mapeia para o usuário proxy `'developer'@'localhost'`. As conexões remotas correspondem ao usuário do proxy `''@'%'`, que mapeia para o usuário proxy `'developer'@'%'`.

Alguns plugins de autenticação implementam mapeamento de usuários proxy para si mesmos (por exemplo, os plugins de autenticação PAM e Windows). Outros plugins de autenticação não suportam usuários proxy por padrão. O `sha256_password` pode solicitar que o próprio servidor MySQL mapeie usuários proxy de acordo com os privilégios de proxy concedidos. Se a variável de sistema `check_proxy_users` estiver habilitada, o servidor realiza o mapeamento de usuários proxy para quaisquer plugins de autenticação que façam tal solicitação:

* Por padrão, `check_proxy_users` está desabilitada, portanto, o servidor não realiza mapeamento de usuários proxy, mesmo para plugins de autenticação que solicitam suporte do servidor para usuários proxy.

* Se `check_proxy_users` estiver habilitada, também pode ser necessário habilitar uma variável de sistema específica do plugin para aproveitar o suporte ao mapeamento de usuários proxy do servidor. Para o plugin `sha256_password`, habilite `sha256_password_proxy_users`.

Por exemplo, para habilitar todas as capacidades anteriores, inicie o servidor com essas linhas no arquivo `my.cnf`:

```
-- create proxy account
CREATE USER 'proxy_user'@'localhost'
  IDENTIFIED WITH sha256_password
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

Supondo que as variáveis de sistema relevantes tenham sido habilitadas, crie o usuário proxy normalmente usando `CREATE USER`, depois conceda-lhe o privilégio `PROXY` a uma única outra conta para ser tratada como o usuário proxy. Quando o servidor recebe uma solicitação de conexão bem-sucedida para o usuário proxy, ele descobre que o usuário tem o privilégio `PROXY` e usa-o para determinar o usuário proxy apropriado.

```
$> mysql -u proxy_user -p
Enter password: (enter proxy_user password here)
```

Para usar a conta proxy, conecte-se ao servidor usando seu nome e senha:

```
  mysql> SELECT @@proxy_user;
  +--------------+
  | @@proxy_user |
  +--------------+
  | ''@''        |
  +--------------+
  ```

A autenticação é bem-sucedida, o servidor descobre que `proxy_user` tem o privilégio `PROXY` para `proxied_user`, e a sessão prossegue com `proxy_user` tendo os privilégios de `proxied_user`.

O mapeamento de usuário proxy realizado pelo servidor está sujeito a essas restrições:

* O servidor não encaminha para ou a partir de um usuário anônimo, mesmo que o privilégio associado `PROXY` seja concedido.

* Quando uma única conta recebeu privilégios de proxy para mais de uma conta proxy, o mapeamento do usuário do proxy do servidor é não determinístico. Portanto, a concessão de privilégios de proxy a uma única conta para múltiplas contas proxy é desaconselhada.

#### Variáveis do Sistema de Usuário Proxy

Duas variáveis de sistema ajudam a rastrear o processo de login do proxy:

* `proxy_user`: Esse valor é `NULL` se o encaminhamento não for usado. Caso contrário, indica a conta do usuário do proxy. Por exemplo, se um cliente se autentica através da conta `''@''` do proxy, essa variável é definida da seguinte forma:

  

* `external_user`: Às vezes, o plugin de autenticação pode usar um usuário externo para se autenticar no servidor MySQL. Por exemplo, ao usar a autenticação nativa do Windows, um plugin que se autentica usando a API do Windows não precisa do ID de login passado a ele. No entanto, ainda usa um ID de usuário do Windows para se autenticar. O plugin pode retornar esse ID de usuário externo (ou os primeiros 512 bytes UTF-8) ao servidor usando a variável de sessão `external_user` apenas de leitura. Se o plugin não definir essa variável, seu valor é `NULL`.