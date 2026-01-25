#### 6.4.1.7 Autenticação Pluggable PAM

Observação

A autenticação pluggable PAM é uma extensão incluída no MySQL Enterprise Edition, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

O MySQL Enterprise Edition oferece suporte a um método de Authentication que permite ao MySQL Server usar o PAM (Pluggable Authentication Modules) para autenticar usuários MySQL. O PAM permite que um sistema utilize uma interface padrão para acessar vários tipos de métodos de Authentication, como senhas Unix tradicionais ou um diretório LDAP.

A autenticação pluggable PAM oferece os seguintes recursos:

* Authentication Externa: A Authentication PAM permite que o MySQL Server aceite conexões de Users definidos fora das `grant tables` do MySQL e que se autentiquem usando métodos suportados pelo PAM.

* Suporte a Proxy User: A Authentication PAM pode retornar ao MySQL um nome de usuário diferente do nome de usuário externo passado pelo programa Client, com base nos grupos PAM aos quais o User externo pertence e na string de Authentication fornecida. Isso significa que o Plugin pode retornar o User MySQL que define os Privileges que o User externo autenticado pelo PAM deve ter. Por exemplo, um User de sistema operacional chamado `joe` pode se conectar e ter os Privileges de um User MySQL chamado `developer`.

A autenticação pluggable PAM foi testada no Linux e macOS.

A tabela a seguir mostra os nomes do Plugin e do arquivo de Library. O sufixo do nome do arquivo pode ser diferente no seu sistema. O arquivo deve estar localizado no diretório nomeado pela variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir). Para informações de instalação, consulte [Installing PAM Pluggable Authentication](pam-pluggable-authentication.html#pam-pluggable-authentication-installation "Installing PAM Pluggable Authentication").

**Tabela 6.13 Nomes de Plugin e Library para Authentication PAM**

<table summary="Names for the plugins and library file used for PAM password authentication."><thead><tr> <th>Plugin ou Arquivo</th> <th>Nome do Plugin ou Arquivo</th> </tr></thead><tbody><tr> <td>Plugin do lado do Server</td> <td><code>authentication_pam</code></td> </tr><tr> <td>Plugin do lado do Client</td> <td><code>mysql_clear_password</code></td> </tr><tr> <td>Arquivo de Library</td> <td><code>authentication_pam.so</code></td> </tr></tbody></table>

O Plugin `mysql_clear_password` de texto claro do lado do Client que se comunica com o Plugin PAM do lado do Server é integrado à Library Client `libmysqlclient` e está incluído em todas as distribuições, inclusive as Community. A inclusão do Plugin de texto claro do lado do Client em todas as distribuições MySQL permite que Clients de qualquer distribuição se conectem a um Server que tenha o Plugin PAM do lado do Server carregado.

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação pluggable PAM:

* [Como Funciona a Authentication PAM de Usuários MySQL](pam-pluggable-authentication.html#pam-pluggable-authentication-process "How PAM Authentication of MySQL Users Works")
* [Instalando a Authentication Pluggable PAM](pam-pluggable-authentication.html#pam-pluggable-authentication-installation "Installing PAM Pluggable Authentication")
* [Desinstalando a Authentication Pluggable PAM](pam-pluggable-authentication.html#pam-pluggable-authentication-uninstallation "Uninstalling PAM Pluggable Authentication")
* [Usando a Authentication Pluggable PAM](pam-pluggable-authentication.html#pam-pluggable-authentication-usage "Using PAM Pluggable Authentication")
* [Authentication PAM de Senha Unix sem Proxy Users](pam-pluggable-authentication.html#pam-authentication-unix-without-proxy "PAM Unix Password Authentication without Proxy Users")
* [Authentication PAM LDAP sem Proxy Users](pam-pluggable-authentication.html#pam-authentication-ldap-without-proxy "PAM LDAP Authentication without Proxy Users")
* [Authentication PAM de Senha Unix com Proxy Users e Mapeamento de Grupo](pam-pluggable-authentication.html#pam-authentication-unix-with-proxy "PAM Unix Password Authentication with Proxy Users and Group Mapping")
* [Acesso da Authentication PAM ao Armazenamento de Senha Unix](pam-pluggable-authentication.html#pam-authentication-unix-password-store "PAM Authentication Access to Unix Password Store")
* [Debugging da Authentication PAM](pam-pluggable-authentication.html#pam-pluggable-authentication-debugging "PAM Authentication Debugging")

Para informações gerais sobre autenticação pluggable no MySQL, consulte [Section 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication"). Para informações sobre o Plugin `mysql_clear_password`, consulte [Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”](cleartext-pluggable-authentication.html "6.4.1.6 Client-Side Cleartext Pluggable Authentication"). Para informações sobre Proxy User, consulte [Section 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users").

##### Como Funciona a Authentication PAM de Usuários MySQL

Esta seção fornece uma visão geral de como o MySQL e o PAM trabalham juntos para autenticar usuários MySQL. Para exemplos que mostram como configurar contas MySQL para usar serviços PAM específicos, consulte [Using PAM Pluggable Authentication](pam-pluggable-authentication.html#pam-pluggable-authentication-usage "Using PAM Pluggable Authentication").

1. O programa Client e o Server se comunicam, com o Client enviando ao Server o nome de usuário do Client (o nome de usuário do sistema operacional por padrão) e a senha:

   * O nome de usuário do Client é o nome de usuário externo.
   * Para Accounts que usam o Plugin de Authentication PAM do lado do Server, o Plugin do lado do Client correspondente é o `mysql_clear_password`. Este Plugin do lado do Client não realiza hashing da senha, o que resulta no envio da senha para o Server como texto claro (cleartext).

2. O Server encontra uma conta MySQL correspondente com base no nome de usuário externo e no host do qual o Client se conecta. O Plugin PAM usa as informações passadas a ele pelo MySQL Server (como nome de usuário, nome do host, senha e string de Authentication). Ao definir uma conta MySQL que autentica usando PAM, a string de Authentication contém:

   * Um nome de serviço PAM, que é um nome que o administrador do sistema pode usar para se referir a um método de Authentication para uma aplicação específica. Pode haver várias aplicações associadas a uma única instância do Database Server, portanto, a escolha do nome do serviço é deixada para o desenvolvedor da aplicação SQL.

   * Opcionalmente, se o proxying for usado, um mapeamento de grupos PAM para nomes de usuários MySQL.

3. O Plugin usa o serviço PAM nomeado na string de Authentication para verificar as credenciais do User e retorna `'Authentication succeeded, Username is user_name'` ou `'Authentication failed'`. A senha deve ser apropriada para o armazenamento de senhas usado pelo serviço PAM. Exemplos:

   * Para senhas Unix tradicionais, o serviço procura as senhas armazenadas no arquivo `/etc/shadow`.

   * Para LDAP, o serviço procura as senhas armazenadas em um diretório LDAP.

   Se a verificação de credenciais falhar, o Server recusa a conexão.

4. Caso contrário, a string de Authentication indica se ocorre proxying. Se a string não contiver mapeamento de grupo PAM, o proxying não ocorre. Neste caso, o nome de usuário MySQL é o mesmo que o nome de usuário externo.

5. Caso contrário, o proxying é indicado com base no mapeamento de grupo PAM, com o nome de usuário MySQL determinado com base no primeiro grupo correspondente na lista de mapeamento. O significado de "grupo PAM" depende do serviço PAM. Exemplos:

   * Para senhas Unix tradicionais, os grupos são grupos Unix definidos no arquivo `/etc/group`, possivelmente suplementados com informações PAM adicionais em um arquivo como `/etc/security/group.conf`.

   * Para LDAP, os grupos são grupos LDAP definidos em um diretório LDAP.

   Se o Proxy User (o User externo) tiver o Privilege [`PROXY`](privileges-provided.html#priv_proxy) para o nome de usuário MySQL proxyied (intermediado), o proxying ocorre, com o Proxy User assumindo os Privileges do User proxyied.

##### Instalando a Authentication Pluggable PAM

Esta seção descreve como instalar o Plugin de Authentication PAM do lado do Server. Para informações gerais sobre a instalação de Plugins, consulte [Section 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

Para ser utilizável pelo Server, o arquivo de Library do Plugin deve estar localizado no diretório de Plugins do MySQL (o diretório nomeado pela variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir)). Se necessário, configure o local do diretório de Plugins definindo o valor de [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) na inicialização do Server.

O nome base do arquivo de Library do Plugin é `authentication_pam`. O sufixo do nome do arquivo difere por plataforma (por exemplo, `.so` para sistemas Unix e semelhantes a Unix, `.dll` para Windows).

Para carregar o Plugin na inicialização do Server, use a opção [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) para nomear o arquivo de Library que o contém. Com este método de carregamento de Plugin, a opção deve ser fornecida toda vez que o Server iniciar. Por exemplo, coloque estas linhas no arquivo `my.cnf` do Server, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```sql
[mysqld]
plugin-load-add=authentication_pam.so
```

Após modificar `my.cnf`, reinicie o Server para que as novas configurações entrem em vigor.

Alternativamente, para carregar o Plugin em runtime, use esta instrução, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```sql
INSTALL PLUGIN authentication_pam SONAME 'authentication_pam.so';
```

[`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") carrega o Plugin imediatamente e também o registra na tabela de sistema `mysql.plugins` para fazer com que o Server o carregue para cada inicialização normal subsequente sem a necessidade de [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add).

Para verificar a instalação do Plugin, examine a tabela [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") do Information Schema ou use a instrução [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") (consulte [Section 5.5.2, “Obtaining Server Plugin Information”](obtaining-plugin-information.html "5.5.2 Obtaining Server Plugin Information")). Por exemplo:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%pam%';
+--------------------+---------------+
| PLUGIN_NAME        | PLUGIN_STATUS |
+--------------------+---------------+
| authentication_pam | ACTIVE        |
+--------------------+---------------+
```

Se o Plugin falhar ao inicializar, verifique o Log de erro do Server em busca de mensagens de diagnóstico.

Para associar contas MySQL ao Plugin PAM, consulte [Using PAM Pluggable Authentication](pam-pluggable-authentication.html#pam-pluggable-authentication-usage "Using PAM Pluggable Authentication").

##### Desinstalando a Authentication Pluggable PAM

O método usado para desinstalar o Plugin de Authentication PAM depende de como você o instalou:

* Se você instalou o Plugin na inicialização do Server usando uma opção [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add), reinicie o Server sem a opção.

* Se você instalou o Plugin em runtime usando uma instrução [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement"), ele permanece instalado nas reinicializações do Server. Para desinstalá-lo, use [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement"):

  ```sql
  UNINSTALL PLUGIN authentication_pam;
  ```

##### Usando a Authentication Pluggable PAM

Esta seção descreve em termos gerais como usar o Plugin de Authentication PAM para se conectar de programas Client MySQL ao Server. As seções a seguir fornecem instruções para usar a Authentication PAM de maneiras específicas. Assume-se que o Server está em execução com o Plugin PAM do lado do Server habilitado, conforme descrito em [Installing PAM Pluggable Authentication](pam-pluggable-authentication.html#pam-pluggable-authentication-installation "Installing PAM Pluggable Authentication").

Para se referir ao Plugin de Authentication PAM na cláusula `IDENTIFIED WITH` de uma instrução [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), use o nome `authentication_pam`. Por exemplo:

```sql
CREATE USER user
  IDENTIFIED WITH authentication_pam
  AS 'auth_string';
```

A string de Authentication especifica os seguintes tipos de informação:

* O nome do serviço PAM (consulte [How PAM Authentication of MySQL Users Works](pam-pluggable-authentication.html#pam-pluggable-authentication-process "How PAM Authentication of MySQL Users Works")). Os exemplos na discussão a seguir usam um nome de serviço `mysql-unix` para Authentication usando senhas Unix tradicionais e `mysql-ldap` para Authentication usando LDAP.

* Para suporte a Proxy, o PAM oferece uma maneira de um módulo PAM retornar ao Server um nome de usuário MySQL diferente do nome de usuário externo passado pelo programa Client ao se conectar ao Server. Use a string de Authentication para controlar o mapeamento de nomes de usuários externos para nomes de usuários MySQL. Se você deseja aproveitar os recursos de Proxy User, a string de Authentication deve incluir este tipo de mapeamento.

Por exemplo, se uma conta usa o nome de serviço PAM `mysql-unix` e deve mapear usuários do sistema operacional nos grupos PAM `root` e `users` para os usuários MySQL `developer` e `data_entry`, respectivamente, use uma instrução como esta:

```sql
CREATE USER user
  IDENTIFIED WITH authentication_pam
  AS 'mysql-unix, root=developer, users=data_entry';
```

A sintaxe da string de Authentication para o Plugin de Authentication PAM segue estas regras:

* A string consiste em um nome de serviço PAM, opcionalmente seguido por uma lista de mapeamento de grupo PAM consistindo em um ou mais pares de palavra-chave/valor, cada um especificando um nome de grupo PAM e um nome de usuário MySQL:

  ```sql
  pam_service_name[,pam_group_name=mysql_user_name]...
  ```

  O Plugin analisa a string de Authentication para cada tentativa de conexão que usa a conta. Para minimizar a sobrecarga, mantenha a string o mais curta possível.

* Cada par `pam_group_name=mysql_user_name` deve ser precedido por uma vírgula.

* Espaços iniciais e finais não dentro de aspas duplas são ignorados.

* Os valores *`pam_service_name`*, *`pam_group_name`* e *`mysql_user_name`* sem aspas podem conter qualquer coisa, exceto sinal de igual, vírgula ou espaço.

* Se um valor *`pam_service_name`*, *`pam_group_name`* ou *`mysql_user_name`* estiver entre aspas duplas, tudo entre as aspas faz parte do valor. Isso é necessário, por exemplo, se o valor contiver caracteres de espaço. Todos os caracteres são legais, exceto aspas duplas e barra invertida (`\`). Para incluir qualquer um dos caracteres, escape-o com uma barra invertida.

Se o Plugin autenticar com sucesso o nome de usuário externo (o nome passado pelo Client), ele procura uma lista de mapeamento de grupo PAM na string de Authentication e, se presente, a usa para retornar um nome de usuário MySQL diferente para o MySQL Server com base em quais grupos PAM o User externo é membro:

* Se a string de Authentication não contiver uma lista de mapeamento de grupo PAM, o Plugin retorna o nome externo.

* Se a string de Authentication contiver uma lista de mapeamento de grupo PAM, o Plugin examina cada par `pam_group_name=mysql_user_name` na lista da esquerda para a direita e tenta encontrar uma correspondência para o valor *`pam_group_name`* em um diretório não-MySQL dos grupos atribuídos ao User autenticado e retorna *`mysql_user_name`* para a primeira correspondência que encontra. Se o Plugin não encontrar correspondência para nenhum grupo PAM, ele retorna o nome externo. Se o Plugin não for capaz de procurar um grupo em um diretório, ele ignora a lista de mapeamento de grupo PAM e retorna o nome externo.

As seções a seguir descrevem como configurar vários cenários de Authentication que usam o Plugin de Authentication PAM:

* Sem Proxy Users. Isso usa o PAM apenas para verificar nomes de Login e senhas. Cada User externo autorizado a se conectar ao MySQL Server deve ter uma conta MySQL correspondente que seja definida para usar a Authentication PAM. (Para que uma conta MySQL de `'user_name'@'host_name'` corresponda ao User externo, *`user_name`* deve ser o nome de usuário externo e *`host_name`* deve corresponder ao host do qual o Client se conecta.) A Authentication pode ser realizada por vários métodos suportados pelo PAM. A discussão posterior mostra como autenticar credenciais de Client usando senhas Unix tradicionais e senhas em LDAP.

  A Authentication PAM, quando não realizada por meio de Proxy Users ou grupos PAM, exige que o nome de usuário MySQL seja o mesmo que o nome de usuário do sistema operacional. Os nomes de usuário MySQL são limitados a 32 caracteres (consulte [Section 6.2.3, “Grant Tables”](grant-tables.html "6.2.3 Grant Tables")), o que limita a Authentication PAM sem Proxy a contas Unix com nomes de no máximo 32 caracteres.

* Apenas Proxy Users, com mapeamento de grupo PAM. Para este cenário, crie uma ou mais contas MySQL que definam diferentes conjuntos de Privileges. (Idealmente, ninguém deve se conectar usando essas contas diretamente.) Em seguida, defina um User padrão que autentica por meio do PAM que usa algum esquema de mapeamento (geralmente baseado nos grupos PAM externos dos quais os Users são membros) para mapear todos os nomes de usuários externos para as poucas contas MySQL que contêm os conjuntos de Privileges. Qualquer Client que se conectar e especificar um nome de usuário externo como o nome de usuário do Client é mapeado para uma das contas MySQL e usa seus Privileges. A discussão mostra como configurar isso usando senhas Unix tradicionais, mas outros métodos PAM, como LDAP, poderiam ser usados.

Variações nesses cenários são possíveis:

* Você pode permitir que alguns Users façam Login diretamente (sem proxying), mas exigir que outros se conectem por meio de contas Proxy.

* Você pode usar um método de Authentication PAM para alguns Users e outro método para outros Users, usando diferentes nomes de serviço PAM entre suas contas autenticadas por PAM. Por exemplo, você pode usar o serviço PAM `mysql-unix` para alguns Users e `mysql-ldap` para outros.

Os exemplos fazem as seguintes suposições. Talvez você precise fazer alguns ajustes se o seu sistema estiver configurado de maneira diferente.

* O nome de Login e a senha são `antonio` e *`antonio_password`*, respectivamente. Mude-os para corresponder ao User que você deseja autenticar.

* O diretório de configuração do PAM é `/etc/pam.d`.

* O nome do serviço PAM corresponde ao método de Authentication (`mysql-unix` ou `mysql-ldap` nesta discussão). Para usar um determinado serviço PAM, você deve configurar um arquivo PAM com o mesmo nome no diretório de configuração PAM (criando o arquivo se ele não existir). Além disso, você deve nomear o serviço PAM na string de Authentication da instrução [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") para qualquer conta que autentique usando esse serviço PAM.

O Plugin de Authentication PAM verifica no momento da inicialização se o valor do ambiente `AUTHENTICATION_PAM_LOG` está definido no ambiente de inicialização do Server. Em caso afirmativo, o Plugin habilita o Log de mensagens de diagnóstico para a saída padrão. Dependendo de como o seu Server é iniciado, a mensagem pode aparecer no console ou no Log de erros. Essas mensagens podem ser úteis para o Debugging de problemas relacionados ao PAM que ocorrem quando o Plugin realiza a Authentication. Para mais informações, consulte [PAM Authentication Debugging](pam-pluggable-authentication.html#pam-pluggable-authentication-debugging "PAM Authentication Debugging").

##### Authentication PAM de Senha Unix sem Proxy Users

Este cenário de Authentication usa o PAM para verificar Users externos definidos em termos de nomes de Users do sistema operacional e senhas Unix, sem proxying. Cada User externo autorizado a se conectar ao MySQL Server deve ter uma conta MySQL correspondente que seja definida para usar a Authentication PAM por meio do armazenamento de senhas Unix tradicional.

Observação

As senhas Unix tradicionais são verificadas usando o arquivo `/etc/shadow`. Para obter informações sobre possíveis problemas relacionados a este arquivo, consulte [PAM Authentication Access to Unix Password Store](pam-pluggable-authentication.html#pam-authentication-unix-password-store "PAM Authentication Access to Unix Password Store").

1. Verifique se a Authentication Unix permite Logins no sistema operacional com o nome de usuário `antonio` e a senha *`antonio_password`*.

2. Configure o PAM para autenticar conexões MySQL usando senhas Unix tradicionais, criando um arquivo de serviço PAM `mysql-unix` chamado `/etc/pam.d/mysql-unix`. O conteúdo do arquivo depende do sistema, portanto, verifique os arquivos existentes relacionados ao Login no diretório `/etc/pam.d` para ver como eles são. No Linux, o arquivo `mysql-unix` pode se parecer com isto:

   ```sql
   #%PAM-1.0
   auth            include         password-auth
   account         include         password-auth
   ```

   Para macOS, use `login` em vez de `password-auth`.

   O formato do arquivo PAM pode diferir em alguns sistemas. Por exemplo, no Ubuntu e em outros sistemas baseados em Debian, use este conteúdo de arquivo:

   ```sql
   @include common-auth
   @include common-account
   @include common-session-noninteractive
   ```

3. Crie uma conta MySQL com o mesmo nome de usuário do sistema operacional e defina-a para autenticar usando o Plugin PAM e o serviço PAM `mysql-unix`:

   ```sql
   CREATE USER 'antonio'@'localhost'
     IDENTIFIED WITH authentication_pam
     AS 'mysql-unix';
   GRANT ALL PRIVILEGES
     ON mydb.*
     TO 'antonio'@'localhost';
   ```

   Aqui, a string de Authentication contém apenas o nome do serviço PAM, `mysql-unix`, que autentica senhas Unix.

4. Use o Client de linha de comando [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") para se conectar ao MySQL Server como `antonio`. Por exemplo:

   ```sql
   $> mysql --user=antonio --password --enable-cleartext-plugin
   Enter password: antonio_password
   ```

   O Server deve permitir a conexão e a seguinte Query retorna a saída conforme mostrado:

   ```sql
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-------------------+-------------------+--------------+
   | USER()            | CURRENT_USER()    | @@proxy_user |
   +-------------------+-------------------+--------------+
   | antonio@localhost | antonio@localhost | NULL         |
   +-------------------+-------------------+--------------+
   ```

   Isso demonstra que o User do sistema operacional `antonio` está autenticado para ter os Privileges concedidos ao User MySQL `antonio`, e que nenhum proxying ocorreu.

Observação

O Plugin de Authentication `mysql_clear_password` do lado do Client deixa a senha intocada, então os programas Client a enviam para o MySQL Server como texto claro (cleartext). Isso permite que a senha seja passada como está para o PAM. Uma senha em texto claro é necessária para usar a Library PAM do lado do Server, mas pode ser um problema de segurança em algumas configurações. Estas medidas minimizam o risco:

* Para tornar o uso inadvertido do Plugin `mysql_clear_password` menos provável, os Clients MySQL devem habilitá-lo explicitamente (por exemplo, com a opção `--enable-cleartext-plugin`). Consulte [Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”](cleartext-pluggable-authentication.html "6.4.1.6 Client-Side Cleartext Pluggable Authentication").

* Para evitar a exposição da senha com o Plugin `mysql_clear_password` habilitado, os Clients MySQL devem se conectar ao MySQL Server usando uma conexão criptografada. Consulte [Section 6.3.1, “Configuring MySQL to Use Encrypted Connections”](using-encrypted-connections.html "6.3.1 Configuring MySQL to Use Encrypted Connections").

##### Authentication PAM LDAP sem Proxy Users

Este cenário de Authentication usa o PAM para verificar Users externos definidos em termos de nomes de Users do sistema operacional e senhas LDAP, sem proxying. Cada User externo autorizado a se conectar ao MySQL Server deve ter uma conta MySQL correspondente que seja definida para usar a Authentication PAM por meio de LDAP.

Para usar a Authentication pluggable PAM LDAP para MySQL, os seguintes pré-requisitos devem ser satisfeitos:

* Um Server LDAP deve estar disponível para que o serviço PAM LDAP se comunique.

* Cada User LDAP a ser autenticado pelo MySQL deve estar presente no diretório gerenciado pelo Server LDAP.

Observação

Outra forma de usar o LDAP para Authentication de Users MySQL é usar os Plugins de Authentication específicos para LDAP. Consulte [Section 6.4.1.9, “LDAP Pluggable Authentication”](ldap-pluggable-authentication.html "6.4.1.9 LDAP Pluggable Authentication").

Configure o MySQL para Authentication PAM LDAP da seguinte forma:

1. Verifique se a Authentication Unix permite Logins no sistema operacional com o nome de usuário `antonio` e a senha *`antonio_password`*.

2. Configure o PAM para autenticar conexões MySQL usando LDAP, criando um arquivo de serviço PAM `mysql-ldap` chamado `/etc/pam.d/mysql-ldap`. O conteúdo do arquivo depende do sistema, portanto, verifique os arquivos existentes relacionados ao Login no diretório `/etc/pam.d` para ver como eles são. No Linux, o arquivo `mysql-ldap` pode se parecer com isto:

   ```sql
   #%PAM-1.0
   auth        required    pam_ldap.so
   account     required    pam_ldap.so
   ```

   Se os arquivos de objeto PAM tiverem um sufixo diferente de `.so` em seu sistema, substitua pelo sufixo correto.

   O formato do arquivo PAM pode diferir em alguns sistemas.

3. Crie uma conta MySQL com o mesmo nome de usuário do sistema operacional e defina-a para autenticar usando o Plugin PAM e o serviço PAM `mysql-ldap`:

   ```sql
   CREATE USER 'antonio'@'localhost'
     IDENTIFIED WITH authentication_pam
     AS 'mysql-ldap';
   GRANT ALL PRIVILEGES
     ON mydb.*
     TO 'antonio'@'localhost';
   ```

   Aqui, a string de Authentication contém apenas o nome do serviço PAM, `mysql-ldap`, que autentica usando LDAP.

4. A conexão com o Server é a mesma descrita em [PAM Unix Password Authentication without Proxy Users](pam-pluggable-authentication.html#pam-authentication-unix-without-proxy "PAM Unix Password Authentication without Proxy Users").

##### Authentication PAM de Senha Unix com Proxy Users e Mapeamento de Grupo

O esquema de Authentication descrito aqui usa proxying e mapeamento de grupo PAM para mapear Users MySQL que se conectam e autenticam usando PAM para outras contas MySQL que definem diferentes conjuntos de Privileges. Os Users não se conectam diretamente através das contas que definem os Privileges. Em vez disso, eles se conectam através de uma conta Proxy padrão autenticada usando PAM, de modo que todos os Users externos são mapeados para as contas MySQL que contêm os conjuntos de Privileges. Qualquer User que se conectar usando a conta Proxy é mapeado para uma dessas contas MySQL, cujos Privileges determinam as operações de Database permitidas ao User externo.

O procedimento mostrado aqui usa a Authentication de senha Unix. Para usar LDAP, consulte as primeiras etapas de [PAM LDAP Authentication without Proxy Users](pam-pluggable-authentication.html#pam-authentication-ldap-without-proxy "PAM LDAP Authentication without Proxy Users").

Observação

As senhas Unix tradicionais são verificadas usando o arquivo `/etc/shadow`. Para obter informações sobre possíveis problemas relacionados a este arquivo, consulte [PAM Authentication Access to Unix Password Store](pam-pluggable-authentication.html#pam-authentication-unix-password-store "PAM Authentication Access to Unix Password Store").

1. Verifique se a Authentication Unix permite Logins no sistema operacional com o nome de usuário `antonio` e a senha *`antonio_password`*.

2. Verifique se `antonio` é membro do grupo PAM `root` ou `users`.

3. Configure o PAM para autenticar o serviço PAM `mysql-unix` através de Users do sistema operacional, criando um arquivo chamado `/etc/pam.d/mysql-unix`. O conteúdo do arquivo depende do sistema, portanto, verifique os arquivos existentes relacionados ao Login no diretório `/etc/pam.d` para ver como eles são. No Linux, o arquivo `mysql-unix` pode se parecer com isto:

   ```sql
   #%PAM-1.0
   auth            include         password-auth
   account         include         password-auth
   ```

   Para macOS, use `login` em vez de `password-auth`.

   O formato do arquivo PAM pode diferir em alguns sistemas. Por exemplo, no Ubuntu e em outros sistemas baseados em Debian, use este conteúdo de arquivo:

   ```sql
   @include common-auth
   @include common-account
   @include common-session-noninteractive
   ```

4. Crie um Proxy User padrão (`''@''`) que mapeie Users PAM externos para as contas proxyied:

   ```sql
   CREATE USER ''@''
     IDENTIFIED WITH authentication_pam
     AS 'mysql-unix, root=developer, users=data_entry';
   ```

   Aqui, a string de Authentication contém o nome do serviço PAM, `mysql-unix`, que autentica senhas Unix. A string de Authentication também mapeia Users externos nos grupos PAM `root` e `users` para os nomes de usuários MySQL `developer` e `data_entry`, respectivamente.

   A lista de mapeamento de grupo PAM após o nome do serviço PAM é obrigatória ao configurar Proxy Users. Caso contrário, o Plugin não consegue saber como realizar o mapeamento de nomes de usuários externos para os nomes de usuários MySQL proxyied apropriados.

   Observação

   Se sua instalação MySQL tiver Users anônimos, eles podem entrar em conflito com o Proxy User padrão. Para mais informações sobre este problema e formas de resolvê-lo, consulte [Default Proxy User and Anonymous User Conflicts](proxy-users.html#proxy-users-conflicts "Default Proxy User and Anonymous User Conflicts").

5. Crie as contas proxyied e conceda a cada uma os Privileges que ela deve ter:

   ```sql
   CREATE USER 'developer'@'localhost'
     IDENTIFIED WITH mysql_no_login;
   CREATE USER 'data_entry'@'localhost'
     IDENTIFIED WITH mysql_no_login;

   GRANT ALL PRIVILEGES
     ON mydevdb.*
     TO 'developer'@'localhost';
   GRANT ALL PRIVILEGES
     ON mydb.*
     TO 'data_entry'@'localhost';
   ```

   As contas proxyied usam o Plugin de Authentication `mysql_no_login` para impedir que os Clients usem as contas para fazer Login diretamente no MySQL Server. Em vez disso, espera-se que os Users que autenticam usando PAM usem a conta `developer` ou `data_entry` por Proxy com base no seu grupo PAM. (Isso pressupõe que o Plugin esteja instalado. Para obter instruções, consulte [Section 6.4.1.10, “No-Login Pluggable Authentication”](no-login-pluggable-authentication.html "6.4.1.10 No-Login Pluggable Authentication").) Para métodos alternativos de proteção de contas proxyied contra uso direto, consulte [Preventing Direct Login to Proxied Accounts](proxy-users.html#preventing-proxied-account-direct-login "Preventing Direct Login to Proxied Accounts").

6. Conceda à conta Proxy o Privilege [`PROXY`](privileges-provided.html#priv_proxy) para cada conta proxyied:

   ```sql
   GRANT PROXY
     ON 'developer'@'localhost'
     TO ''@'';
   GRANT PROXY
     ON 'data_entry'@'localhost'
     TO ''@'';
   ```

7. Use o Client de linha de comando [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") para se conectar ao MySQL Server como `antonio`.

   ```sql
   $> mysql --user=antonio --password --enable-cleartext-plugin
   Enter password: antonio_password
   ```

   O Server autentica a conexão usando a conta Proxy padrão `''@''`. Os Privileges resultantes para `antonio` dependem de quais grupos PAM `antonio` é membro. Se `antonio` for membro do grupo PAM `root`, o Plugin PAM mapeia `root` para o nome de usuário MySQL `developer` e retorna esse nome para o Server. O Server verifica se `''@''` tem o Privilege [`PROXY`](privileges-provided.html#priv_proxy) para `developer` e permite a conexão. A seguinte Query retorna a saída conforme mostrado:

   ```sql
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-------------------+---------------------+--------------+
   | USER()            | CURRENT_USER()      | @@proxy_user |
   +-------------------+---------------------+--------------+
   | antonio@localhost | developer@localhost | ''@''        |
   +-------------------+---------------------+--------------+
   ```

   Isso demonstra que o User do sistema operacional `antonio` está autenticado para ter os Privileges concedidos ao User MySQL `developer`, e que o proxying ocorre através da conta Proxy padrão.

   Se `antonio` não for membro do grupo PAM `root`, mas for membro do grupo PAM `users`, um processo semelhante ocorre, mas o Plugin mapeia a associação ao grupo PAM `user` para o nome de usuário MySQL `data_entry` e retorna esse nome para o Server:

   ```sql
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-------------------+----------------------+--------------+
   | USER()            | CURRENT_USER()       | @@proxy_user |
   +-------------------+----------------------+--------------+
   | antonio@localhost | data_entry@localhost | ''@''        |
   +-------------------+----------------------+--------------+
   ```

   Isso demonstra que o User do sistema operacional `antonio` está autenticado para ter os Privileges do User MySQL `data_entry`, e que o proxying ocorre através da conta Proxy padrão.

Observação

O Plugin de Authentication `mysql_clear_password` do lado do Client deixa a senha intocada, então os programas Client a enviam para o MySQL Server como texto claro (cleartext). Isso permite que a senha seja passada como está para o PAM. Uma senha em texto claro é necessária para usar a Library PAM do lado do Server, mas pode ser um problema de segurança em algumas configurações. Estas medidas minimizam o risco:

* Para tornar o uso inadvertido do Plugin `mysql_clear_password` menos provável, os Clients MySQL devem habilitá-lo explicitamente (por exemplo, com a opção `--enable-cleartext-plugin`). Consulte [Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”](cleartext-pluggable-authentication.html "6.4.1.6 Client-Side Cleartext Pluggable Authentication").

* Para evitar a exposição da senha com o Plugin `mysql_clear_password` habilitado, os Clients MySQL devem se conectar ao MySQL Server usando uma conexão criptografada. Consulte [Section 6.3.1, “Configuring MySQL to Use Encrypted Connections”](using-encrypted-connections.html "6.3.1 Configuring MySQL to Use Encrypted Connections").

##### Acesso da Authentication PAM ao Armazenamento de Senha Unix

Em alguns sistemas, a Authentication Unix usa um armazenamento de senhas como `/etc/shadow`, um arquivo que geralmente tem permissões de acesso restritas. Isso pode fazer com que a Authentication baseada em PAM do MySQL falhe. Infelizmente, a implementação do PAM não permite distinguir "a senha não pôde ser verificada" (devido, por exemplo, à incapacidade de ler `/etc/shadow`) de "a senha não corresponde". Se você estiver usando o armazenamento de senhas Unix para Authentication PAM, poderá habilitar o acesso a ele a partir do MySQL usando um dos seguintes métodos:

* Assumindo que o MySQL Server é executado a partir da conta de sistema operacional `mysql`, coloque essa conta no grupo `shadow` que tem acesso a `/etc/shadow`:

  1. Crie um grupo `shadow` em `/etc/group`.

  2. Adicione o User do sistema operacional `mysql` ao grupo `shadow` em `/etc/group`.

  3. Atribua `/etc/group` ao grupo `shadow` e habilite a permissão de leitura do grupo:

     ```sql
     chgrp shadow /etc/shadow
     chmod g+r /etc/shadow
     ```

  4. Reinicie o MySQL Server.
* Se você estiver usando o módulo `pam_unix` e o utilitário **unix_chkpwd**, habilite o acesso ao armazenamento de senhas da seguinte forma:

  ```sql
  chmod u-s /usr/sbin/unix_chkpwd
  setcap cap_dac_read_search+ep /usr/sbin/unix_chkpwd
  ```

  Ajuste o path para **unix_chkpwd** conforme necessário para sua plataforma.

##### Debugging da Authentication PAM

O Plugin de Authentication PAM verifica no momento da inicialização se o valor do ambiente `AUTHENTICATION_PAM_LOG` está definido. No MySQL 5.7, e no MySQL NDB Cluster anterior a NDB 7.5.33 e NDB 7.6.29, o valor não importa. O Plugin habilita o Log de mensagens de diagnóstico para a saída padrão, incluindo senhas. Essas mensagens podem ser úteis para o Debugging de problemas relacionados ao PAM que ocorrem quando o Plugin realiza a Authentication.

No MySQL NDB Cluster, a partir das versões 7.5.33 e 7.6.29, as senhas *não* são incluídas se você definir `AUTHENTICATION_PAM_LOG=1` (ou algum outro valor arbitrário); você pode habilitar o Log de mensagens de Debugging, incluindo senhas, definindo `AUTHENTICATION_PAM_LOG=PAM_LOG_WITH_SECRET_INFO`.

Algumas mensagens incluem referência a arquivos de origem e números de linha do Plugin PAM, o que permite que as ações do Plugin sejam vinculadas mais de perto ao local no código onde ocorrem.

Outra técnica para Debugging de falhas de conexão e determinação do que está acontecendo durante as tentativas de conexão é configurar a Authentication PAM para permitir todas as conexões e, em seguida, verificar os arquivos de Log do sistema. Esta técnica deve ser usada apenas *temporariamente* e não em um Server de produção.

Configure um arquivo de serviço PAM chamado `/etc/pam.d/mysql-any-password` com este conteúdo (o formato pode diferir em alguns sistemas):

```sql
#%PAM-1.0
auth        required    pam_permit.so
account     required    pam_permit.so
```

Crie uma conta que use o Plugin PAM e nomeie o serviço PAM `mysql-any-password`:

```sql
CREATE USER 'testuser'@'localhost'
  IDENTIFIED WITH authentication_pam
  AS 'mysql-any-password';
```

O arquivo de serviço `mysql-any-password` faz com que qualquer tentativa de Authentication retorne true, mesmo para senhas incorretas. Se uma tentativa de Authentication falhar, isso indica que o problema de configuração está do lado do MySQL. Caso contrário, o problema está do lado do sistema operacional/PAM. Para ver o que pode estar acontecendo, verifique os arquivos de Log do sistema, como `/var/log/secure`, `/var/log/audit.log`, `/var/log/syslog` ou `/var/log/messages`.

Após determinar qual é o problema, remova o arquivo de serviço PAM `mysql-any-password` para desabilitar o acesso com qualquer senha.