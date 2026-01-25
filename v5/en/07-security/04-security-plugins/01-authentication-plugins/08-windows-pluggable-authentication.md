#### 6.4.1.8 Windows Pluggable Authentication

Note

O Windows pluggable authentication é uma extensão incluída no MySQL Enterprise Edition, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

O MySQL Enterprise Edition para Windows suporta um método de Authentication que realiza Authentication externa no Windows, permitindo que o MySQL Server use serviços nativos do Windows para autenticar Client connections. Users que fizeram login no Windows podem se conectar de programas Client MySQL ao Server com base nas informações em seu ambiente, sem especificar uma senha adicional.

O Client e o Server trocam data packets no authentication handshake. Como resultado dessa troca, o Server cria um security context object que representa a identidade do Client no Windows OS. Essa identidade inclui o nome da conta do Client. O Windows pluggable authentication usa a identidade do Client para verificar se é uma determinada conta ou um membro de um group. Por padrão, a negociação usa Kerberos para autenticar, e depois NTLM se o Kerberos não estiver disponível.

O Windows pluggable authentication fornece os seguintes recursos:

* Authentication Externa: A Windows Authentication permite que o MySQL Server aceite connections de users definidos fora das MySQL grant tables que fizeram login no Windows.

* Suporte a Proxy User: A Windows Authentication pode retornar ao MySQL um user name diferente do user name externo passado pelo Client program. Isso significa que o plugin pode retornar o MySQL user que define os privileges que o user autenticado externamente pelo Windows deve ter. Por exemplo, um user Windows chamado `joe` pode se conectar e ter os privileges de um MySQL user chamado `developer`.

A tabela a seguir mostra os nomes de plugin e de arquivo de library. O arquivo deve estar localizado no directory nomeado pela system variable [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir).

**Tabela 6.14 Nomes de Plugin e Library para Windows Authentication**

<table summary="Nomes para os Plugins e o arquivo de Library usados para a Windows password Authentication."><thead><tr> <th>Plugin ou Arquivo</th> <th>Nome do Plugin ou Arquivo</th> </tr></thead><tbody><tr> <td>Plugin do lado do Server</td> <td><code>authentication_windows</code></td> </tr><tr> <td>Plugin do lado do Client</td> <td><code>authentication_windows_client</code></td> </tr><tr> <td>Arquivo de Library</td> <td><code>authentication_windows.dll</code></td> </tr> </tbody></table>

O arquivo de library inclui apenas o plugin do lado do Server. O plugin do lado do Client é integrado à Client library `libmysqlclient`.

O plugin de Windows Authentication do lado do Server está incluído apenas no MySQL Enterprise Edition. Ele não está incluído nas distribuições da comunidade MySQL. O plugin do lado do Client está incluído em todas as distribuições, incluindo as da comunidade. Isso permite que Clients de qualquer distribuição se conectem a um Server que tenha o plugin do lado do Server carregado.

As seções a seguir fornecem informações de instalação e uso específicas para o Windows pluggable authentication:

* [Instalando o Windows Pluggable Authentication](windows-pluggable-authentication.html#windows-pluggable-authentication-installation "Instalando o Windows Pluggable Authentication")
* [Desinstalando o Windows Pluggable Authentication](windows-pluggable-authentication.html#windows-pluggable-authentication-uninstallation "Desinstalando o Windows Pluggable Authentication")
* [Usando o Windows Pluggable Authentication](windows-pluggable-authentication.html#windows-pluggable-authentication-usage "Usando o Windows Pluggable Authentication")

Para obter informações gerais sobre pluggable authentication no MySQL, consulte [Seção 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication"). Para obter informações sobre proxy user, consulte [Seção 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users").

##### Instalando o Windows Pluggable Authentication

Esta seção descreve como instalar o plugin de Windows Authentication do lado do Server. Para obter informações gerais sobre como instalar Plugins, consulte [Seção 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

Para ser utilizável pelo Server, o arquivo de plugin library deve estar localizado no MySQL plugin directory (o directory nomeado pela system variable [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir)). Se necessário, configure a localização do plugin directory definindo o valor de [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) na inicialização do Server.

Para carregar o plugin na inicialização do Server, use a opção [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) para nomear o arquivo de library que o contém. Com este método de carregamento de plugin, a opção deve ser fornecida toda vez que o Server é iniciado. Por exemplo, coloque estas linhas no arquivo `my.cnf` do Server:

```sql
[mysqld]
plugin-load-add=authentication_windows.dll
```

Após modificar o `my.cnf`, reinicie o Server para que as novas configurações entrem em vigor.

Como alternativa, para carregar o plugin em tempo de execução, use esta instrução:

```sql
INSTALL PLUGIN authentication_windows SONAME 'authentication_windows.dll';
```

O [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") carrega o plugin imediatamente e também o registra na system table `mysql.plugins` para fazer com que o Server o carregue para cada inicialização normal subsequente sem a necessidade de [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add).

Para verificar a instalação do plugin, examine a tabela [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") do Information Schema ou use a instrução [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") (consulte [Seção 5.5.2, “Obtaining Server Plugin Information”](obtaining-plugin-information.html "5.5.2 Obtaining Server Plugin Information")). Por exemplo:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%windows%';
+------------------------+---------------+
| PLUGIN_NAME            | PLUGIN_STATUS |
+------------------------+---------------+
| authentication_windows | ACTIVE        |
+------------------------+---------------+
```

Se o plugin falhar ao inicializar, verifique o server error log para mensagens de diagnóstico.

Para associar MySQL accounts ao plugin de Windows Authentication, consulte [Usando o Windows Pluggable Authentication](windows-pluggable-authentication.html#windows-pluggable-authentication-usage "Usando o Windows Pluggable Authentication"). O controle adicional do plugin é fornecido pelas system variables [`authentication_windows_use_principal_name`](server-system-variables.html#sysvar_authentication_windows_use_principal_name) e [`authentication_windows_log_level`](server-system-variables.html#sysvar_authentication_windows_log_level). Consulte [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

##### Desinstalando o Windows Pluggable Authentication

O método usado para desinstalar o plugin de Windows Authentication depende de como você o instalou:

* Se você instalou o plugin na inicialização do Server usando uma opção [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add), reinicie o Server sem a opção.

* Se você instalou o plugin em tempo de execução usando uma instrução [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement"), ele permanece instalado após as reinicializações do Server. Para desinstalá-lo, use [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement"):

  ```sql
  UNINSTALL PLUGIN authentication_windows;
  ```

Além disso, remova quaisquer opções de inicialização que definam system variables relacionadas ao plugin Windows.

##### Usando o Windows Pluggable Authentication

O plugin de Windows Authentication suporta o uso de MySQL accounts de tal forma que os users que fizeram login no Windows podem se conectar ao MySQL Server sem ter que especificar uma senha adicional. Assume-se que o Server está sendo executado com o plugin do lado do Server habilitado, conforme descrito em [Instalando o Windows Pluggable Authentication](windows-pluggable-authentication.html#windows-pluggable-authentication-installation "Instalando o Windows Pluggable Authentication"). Uma vez que o DBA tenha habilitado o plugin do lado do Server e configurado as contas para usá-lo, os Clients podem se conectar usando essas contas sem nenhuma outra configuração exigida de sua parte.

Para se referir ao plugin de Windows Authentication na cláusula `IDENTIFIED WITH` de uma instrução [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), use o nome `authentication_windows`. Suponha que os users Windows `Rafal` e `Tasha` devem ter permissão para se conectar ao MySQL, bem como quaisquer users nos groups `Administrators` ou `Power Users`. Para configurar isso, crie um MySQL account chamado `sql_admin` que usa o plugin Windows para Authentication:

```sql
CREATE USER sql_admin
  IDENTIFIED WITH authentication_windows
  AS 'Rafal, Tasha, Administrators, "Power Users"';
```

O nome do plugin é `authentication_windows`. A string que segue a keyword `AS` é a authentication string. Ela especifica que os users Windows chamados `Rafal` ou `Tasha` têm permissão para autenticar no Server como o MySQL user `sql_admin`, assim como quaisquer users Windows nos groups `Administrators` ou `Power Users`. O nome do último group contém um espaço, portanto, deve ser citado com aspas duplas.

Depois de criar a conta `sql_admin`, um user que fez login no Windows pode tentar se conectar ao Server usando essa conta:

```sql
C:\> mysql --user=sql_admin
```

Nenhuma senha é necessária aqui. O plugin `authentication_windows` usa a Windows security API para verificar qual user Windows está se conectando. Se esse user for chamado `Rafal` ou `Tasha`, ou for um membro do group `Administrators` ou `Power Users`, o Server concede acesso e o Client é autenticado como `sql_admin` e possui todos os privileges concedidos à conta `sql_admin`. Caso contrário, o Server nega o acesso.

A sintaxe da Authentication string para o plugin de Windows Authentication segue estas regras:

* A string consiste em um ou mais mapeamentos de user separados por vírgulas.

* Cada mapeamento de user associa um user ou group name Windows a um MySQL user name:

  ```sql
  win_user_or_group_name=mysql_user_name
  win_user_or_group_name
  ```

  Para a última sintaxe, sem um valor *`mysql_user_name`* fornecido, o valor implícito é o MySQL user criado pela instrução [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"). Assim, estas instruções são equivalentes:

  ```sql
  CREATE USER sql_admin
    IDENTIFIED WITH authentication_windows
    AS 'Rafal, Tasha, Administrators, "Power Users"';

  CREATE USER sql_admin
    IDENTIFIED WITH authentication_windows
    AS 'Rafal=sql_admin, Tasha=sql_admin, Administrators=sql_admin,
        "Power Users"=sql_admin';
  ```

* Cada caractere de barra invertida (`\`) em um valor deve ser duplicado porque a barra invertida é o caractere de escape em strings MySQL.

* Espaços iniciais e finais não contidos em aspas duplas são ignorados.

* Valores *`win_user_or_group_name`* e *`mysql_user_name`* não citados podem conter qualquer coisa, exceto sinal de igual, vírgula ou espaço.

* Se um valor *`win_user_or_group_name`* e/ou *`mysql_user_name`* for citado com aspas duplas, tudo entre aspas duplas fará parte do valor. Isso é necessário, por exemplo, se o nome contiver caracteres de espaço. Todos os caracteres dentro de aspas duplas são legais, exceto aspas duplas e barra invertida. Para incluir qualquer um dos caracteres, use escape com uma barra invertida.

* Os valores *`win_user_or_group_name`* usam sintaxe convencional para Windows principals, sejam locais ou em um domain. Exemplos (observe a duplicação das barras invertidas):

  ```sql
  domain\\user
  .\\user
  domain\\group
  .\\group
  BUILTIN\\WellKnownGroup
  ```

Quando invocado pelo Server para autenticar um Client, o plugin analisa a authentication string da esquerda para a direita em busca de uma correspondência de user ou group para o user Windows. Se houver uma correspondência, o plugin retorna o *`mysql_user_name`* correspondente ao MySQL Server. Se não houver correspondência, a Authentication falha.

Uma correspondência de user name tem preferência sobre uma correspondência de group name. Suponha que o user Windows chamado `win_user` seja membro de `win_group` e a authentication string se pareça com isto:

```sql
'win_group = sql_user1, win_user = sql_user2'
```

Quando `win_user` se conecta ao MySQL Server, há uma correspondência tanto com `win_group` quanto com `win_user`. O plugin autentica o user como `sql_user2` porque a correspondência de user mais específica tem precedência sobre a correspondência de group, mesmo que o group esteja listado primeiro na authentication string.

A Windows Authentication sempre funciona para connections do mesmo computador em que o Server está sendo executado. Para cross-computer connections, ambos os computadores devem estar registrados no Microsoft Active Directory. Se eles estiverem no mesmo Windows domain, não é necessário especificar um domain name. Também é possível permitir connections de um domain diferente, como neste exemplo:

```sql
CREATE USER sql_accounting
  IDENTIFIED WITH authentication_windows
  AS 'SomeDomain\\Accounting';
```

Aqui `SomeDomain` é o nome do outro domain. O caractere de barra invertida é duplicado porque é o caractere de escape do MySQL dentro de strings.

O MySQL suporta o conceito de proxy users, onde um Client pode se conectar e autenticar no MySQL Server usando uma conta, mas enquanto conectado tem os privileges de outra conta (consulte [Seção 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users")). Suponha que você queira que os users Windows se conectem usando um único user name, mas sejam mapeados com base em seus user names e group names Windows para MySQL accounts específicos, conforme segue:

* Os users Windows locais e de domain `local_user` e `MyDomain\domain_user` devem mapear para o MySQL account `local_wlad`.

* Users no domain group `MyDomain\Developers` devem mapear para o MySQL account `local_dev`.

* Administradores da máquina local devem mapear para o MySQL account `local_admin`.

Para configurar isso, crie um proxy account para os users Windows se conectarem e configure esta conta para que users e groups mapeiem para os MySQL accounts apropriados (`local_wlad`, `local_dev`, `local_admin`). Além disso, conceda aos MySQL accounts os privileges apropriados para as operações que eles precisam realizar. As seguintes instruções usam `win_proxy` como o proxy account, e `local_wlad`, `local_dev` e `local_admin` como as contas proxy.

1. Crie o MySQL proxy account:

   ```sql
   CREATE USER win_proxy
     IDENTIFIED WITH  authentication_windows
     AS 'local_user = local_wlad,
         MyDomain\\domain_user = local_wlad,
         MyDomain\\Developers = local_dev,
         BUILTIN\\Administrators = local_admin';
   ```

2. Para que o proxying funcione, as contas proxy devem existir, então crie-as:

   ```sql
   CREATE USER local_wlad
     IDENTIFIED WITH mysql_no_login;
   CREATE USER local_dev
     IDENTIFIED WITH mysql_no_login;
   CREATE USER local_admin
     IDENTIFIED WITH mysql_no_login;
   ```

   As contas proxy usam o plugin de Authentication `mysql_no_login` para impedir que Clients usem as contas para fazer login diretamente no MySQL Server. Em vez disso, espera-se que os users que autenticam usando Windows usem o proxy account `win_proxy`. (Isso assume que o plugin está instalado. Para instruções, consulte [Seção 6.4.1.10, “No-Login Pluggable Authentication”](no-login-pluggable-authentication.html "6.4.1.10 No-Login Pluggable Authentication")). Para métodos alternativos de proteção de contas proxy contra uso direto, consulte [Preventing Direct Login to Proxied Accounts](proxy-users.html#preventing-proxied-account-direct-login "Preventing Direct Login to Proxied Accounts").

   Você também deve executar instruções [`GRANT`](grant.html "13.7.1.4 GRANT Statement") (não mostradas) que concedem a cada conta proxy os privileges necessários para o MySQL access.

3. Conceda ao proxy account o privilege [`PROXY`](privileges-provided.html#priv_proxy) para cada conta proxy:

   ```sql
   GRANT PROXY ON local_wlad TO win_proxy;
   GRANT PROXY ON local_dev TO win_proxy;
   GRANT PROXY ON local_admin TO win_proxy;
   ```

Agora, os users Windows `local_user` e `MyDomain\domain_user` podem se conectar ao MySQL Server como `win_proxy` e, quando autenticados, têm os privileges da conta fornecida na authentication string (neste caso, `local_wlad`). Um user no group `MyDomain\Developers` que se conecta como `win_proxy` tem os privileges da conta `local_dev`. Um user no group `BUILTIN\Administrators` tem os privileges da conta `local_admin`.

Para configurar a Authentication para que todos os users Windows que não têm seu próprio MySQL account passem por um proxy account, substitua o default proxy account (`''@''`) por `win_proxy` nas instruções anteriores. Para obter informações sobre default proxy accounts, consulte [Seção 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users").

Note

Se sua instalação MySQL tiver anonymous users, eles podem entrar em conflito com o default proxy user. Para obter mais informações sobre esse problema e maneiras de lidar com ele, consulte [Default Proxy User and Anonymous User Conflicts](proxy-users.html#proxy-users-conflicts "Default Proxy User and Anonymous User Conflicts").

Para usar o plugin de Windows Authentication com Connector/NET connection strings no Connector/NET 8.0 e superior, consulte [Connector/NET Authentication](/doc/connector-net/en/connector-net-authentication.html).