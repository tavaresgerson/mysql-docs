#### 6.4.1.10 Autenticação Pluggable Sem Login

O Plugin de Autenticação server-side `mysql_no_login` impede todas as conexões de clientes a qualquer conta que o utilize. Os casos de uso para este Plugin incluem:

*   Contas que devem ser capazes de executar stored programs e views com privilégios elevados sem expor esses privilégios a usuários comuns.

*   Contas proxied que nunca devem permitir o Login direto, mas que se destinam a ser acessadas apenas através de contas Proxy.

A tabela a seguir mostra os nomes do Plugin e dos arquivos de Library. O sufixo do nome do arquivo pode ser diferente no seu sistema. O arquivo deve estar localizado no diretório nomeado pela variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir).

**Tabela 6.17 Nomes de Plugin e Library para Autenticação Sem Login**

<table summary="Nomes para os plugins e o arquivo de library usados para autenticação de senha sem login."><thead><tr> <th>Plugin ou Arquivo</th> <th>Nome do Plugin ou Arquivo</th> </tr></thead><tbody><tr> <td>Plugin Server-side</td> <td><code>mysql_no_login</code></td> </tr><tr> <td>Plugin Client-side</td> <td>Nenhum</td> </tr><tr> <td>Arquivo de Library</td> <td><code>mysql_no_login.so</code></td> </tr> </tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação pluggable sem login:

*   [Instalando a Autenticação Pluggable Sem Login](no-login-pluggable-authentication.html#no-login-pluggable-authentication-installation "Instalando a Autenticação Pluggable Sem Login")
*   [Desinstalando a Autenticação Pluggable Sem Login](no-login-pluggable-authentication.html#no-login-pluggable-authentication-uninstallation "Desinstalando a Autenticação Pluggable Sem Login")
*   [Usando a Autenticação Pluggable Sem Login](no-login-pluggable-authentication.html#no-login-pluggable-authentication-usage "Usando a Autenticação Pluggable Sem Login")

Para informações gerais sobre Autenticação Pluggable no MySQL, consulte [Seção 6.2.13, “Autenticação Pluggable”](pluggable-authentication.html "6.2.13 Autenticação Pluggable"). Para informações sobre usuários Proxy, consulte [Seção 6.2.14, “Usuários Proxy”](proxy-users.html "6.2.14 Usuários Proxy").

##### Instalando a Autenticação Pluggable Sem Login

Esta seção descreve como instalar o Plugin de autenticação sem login. Para informações gerais sobre a instalação de Plugins, consulte [Seção 5.5.1, “Instalando e Desinstalando Plugins”](plugin-loading.html "5.5.1 Instalando e Desinstalando Plugins").

Para ser utilizável pelo server, o arquivo de Library do Plugin deve estar localizado no diretório de Plugins do MySQL (o diretório nomeado pela variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir)). Se necessário, configure a localização do diretório de Plugins definindo o valor de [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) na inicialização do server.

O nome base do arquivo de Library do Plugin é `mysql_no_login`. O sufixo do nome do arquivo difere por plataforma (por exemplo, `.so` para sistemas Unix e similares a Unix, `.dll` para Windows).

Para carregar o Plugin na inicialização do server, use a opção [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) para nomear o arquivo de Library que o contém. Com este método de carregamento de Plugin, a opção deve ser fornecida sempre que o server for iniciado. Por exemplo, coloque estas linhas no arquivo `my.cnf` do server, ajustando o sufixo `.so` para sua plataforma, conforme necessário:

```sql
[mysqld]
plugin-load-add=mysql_no_login.so
```

Após modificar `my.cnf`, reinicie o server para que as novas configurações entrem em vigor.

Alternativamente, para carregar o Plugin em runtime, use esta instrução, ajustando o sufixo `.so` para sua plataforma, conforme necessário:

```sql
INSTALL PLUGIN mysql_no_login SONAME 'mysql_no_login.so';
```

[`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") carrega o Plugin imediatamente e também o registra na tabela de sistema `mysql.plugins` para fazer com que o server o carregue em cada inicialização normal subsequente, sem a necessidade de [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add).

Para verificar a instalação do Plugin, examine a tabela [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") do Information Schema ou use a instrução [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") (consulte [Seção 5.5.2, “Obtendo Informações do Plugin do Servidor”](obtaining-plugin-information.html "5.5.2 Obtendo Informações do Plugin do Servidor")). Por exemplo:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%login%';
+----------------+---------------+
| PLUGIN_NAME    | PLUGIN_STATUS |
+----------------+---------------+
| mysql_no_login | ACTIVE        |
+----------------+---------------+
```

Se o Plugin falhar ao inicializar, verifique o error log do server para mensagens de diagnóstico.

Para associar contas MySQL ao Plugin sem login, consulte [Usando a Autenticação Pluggable Sem Login](no-login-pluggable-authentication.html#no-login-pluggable-authentication-usage "Usando a Autenticação Pluggable Sem Login").

##### Desinstalando a Autenticação Pluggable Sem Login

O método usado para desinstalar o Plugin de autenticação sem login depende de como você o instalou:

*   Se você instalou o Plugin na inicialização do server usando uma opção [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add), reinicie o server sem a opção.

*   Se você instalou o Plugin em runtime usando uma instrução [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement"), ele permanece instalado após as reinicializações do server. Para desinstalá-lo, use [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement"):

    ```sql
  UNINSTALL PLUGIN mysql_no_login;
  ```

##### Usando a Autenticação Pluggable Sem Login

Esta seção descreve como usar o Plugin de autenticação sem login para impedir que as contas sejam usadas para conectar programas clientes MySQL ao server. Presume-se que o server esteja rodando com o Plugin sem login habilitado, conforme descrito em [Instalando a Autenticação Pluggable Sem Login](no-login-pluggable-authentication.html#no-login-pluggable-authentication-installation "Instalando a Autenticação Pluggable Sem Login").

Para referenciar o Plugin de autenticação sem login na cláusula `IDENTIFIED WITH` de uma instrução [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), use o nome `mysql_no_login`.

Uma conta que se autentica usando `mysql_no_login` pode ser usada como o `DEFINER` para stored programs e objetos de view. Se tal definição de objeto também incluir `SQL SECURITY DEFINER`, ele é executado com os privilégios dessa conta. DBAs podem usar esse comportamento para fornecer acesso a dados confidenciais ou sensíveis que são expostos apenas através de interfaces bem controladas.

O exemplo a seguir ilustra esses princípios. Ele define uma conta que não permite conexões de clientes e associa a ela uma view que expõe apenas certas colunas da tabela de sistema `mysql.user`:

```sql
CREATE DATABASE nologindb;
CREATE USER 'nologin'@'localhost'
  IDENTIFIED WITH mysql_no_login;
GRANT ALL ON nologindb.*
  TO 'nologin'@'localhost';
GRANT SELECT ON mysql.user
  TO 'nologin'@'localhost';
CREATE DEFINER = 'nologin'@'localhost'
  SQL SECURITY DEFINER
  VIEW nologindb.myview
  AS SELECT User, Host FROM mysql.user;
```

Para fornecer acesso protegido à view para um usuário comum, faça o seguinte:

```sql
GRANT SELECT ON nologindb.myview
  TO 'ordinaryuser'@'localhost';
```

Agora, o usuário comum pode usar a view para acessar as informações limitadas que ela apresenta:

```sql
SELECT * FROM nologindb.myview;
```

Tentativas do usuário de acessar colunas além daquelas expostas pela view resultam em um error, assim como tentativas de selecionar a view por usuários que não têm acesso concedido a ela.

Note

Como a conta `nologin` não pode ser usada diretamente, as operações necessárias para configurar objetos que ela usa devem ser realizadas por `root` ou conta similar que tenha os privilégios necessários para criar os objetos e definir valores `DEFINER`.

O Plugin `mysql_no_login` também é útil em cenários de Proxying. (Para uma discussão dos conceitos envolvidos no Proxying, consulte [Seção 6.2.14, “Usuários Proxy”](proxy-users.html "6.2.14 Usuários Proxy").) Uma conta que se autentica usando `mysql_no_login` pode ser usada como um usuário proxied para contas Proxy:

```sql
-- create proxied account
CREATE USER 'proxied_user'@'localhost'
  IDENTIFIED WITH mysql_no_login;
-- grant privileges to proxied account
GRANT ...
  ON ...
  TO 'proxied_user'@'localhost';
-- permit proxy_user to be a proxy account for proxied account
GRANT PROXY
  ON 'proxied_user'@'localhost'
  TO 'proxy_user'@'localhost';
```

Isso permite que os clientes acessem o MySQL através da conta Proxy (`proxy_user`), mas não ignorem o mecanismo de Proxying conectando-se diretamente como o usuário proxied (`proxied_user`). Um cliente que se conecta usando a conta `proxy_user` tem os privilégios da conta `proxied_user`, mas o próprio `proxied_user` não pode ser usado para conexão.

Para métodos alternativos de proteção de contas proxied contra uso direto, consulte [Prevenindo Login Direto em Contas Proxied](proxy-users.html#preventing-proxied-account-direct-login "Prevenindo Login Direto em Contas Proxied").