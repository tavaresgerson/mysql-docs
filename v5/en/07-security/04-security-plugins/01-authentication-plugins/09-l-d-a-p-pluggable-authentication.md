#### 6.4.1.9 Autenticação Pluggable LDAP

Nota

A Autenticação Pluggable LDAP é uma extensão incluída no MySQL Enterprise Edition, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A partir do MySQL 5.7.19, o MySQL Enterprise Edition oferece suporte a um método de authentication que permite ao MySQL Server usar o LDAP (Lightweight Directory Access Protocol) para autenticar usuários MySQL acessando serviços de directory, como o X.500. O MySQL usa LDAP para buscar informações de user, credential e group.

A Autenticação Pluggable LDAP oferece as seguintes funcionalidades:

* External authentication: A authentication LDAP permite que o MySQL Server aceite conexões de users definidos fora das tabelas de concessão (grant tables) do MySQL, nos LDAP directories.

* Proxy user support: A authentication LDAP pode retornar ao MySQL um user name diferente do user name externo passado pelo programa client, com base nos LDAP groups dos quais o user externo é membro. Isso significa que um LDAP plugin pode retornar o user MySQL que define os privileges que o user externo autenticado via LDAP deve possuir. Por exemplo, um user LDAP chamado `joe` pode se conectar e ter os privileges de um user MySQL chamado `developer`, se o LDAP group para `joe` for `developer`.

* Security: Usando TLS, as conexões com o LDAP server podem ser seguras.

As tabelas a seguir mostram os nomes dos arquivos de plugin e library para authentication LDAP simples e baseada em SASL. O sufixo do nome do arquivo pode ser diferente em seu sistema. Os arquivos devem estar localizados no diretório nomeado pela variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir).

**Table 6.15 Nomes de Plugin e Library para Autenticação LDAP Simples**

<table summary="Nomes para os plugins e o arquivo library usados para authentication de senha LDAP simples."><thead><tr> <th>Plugin ou Arquivo</th> <th>Nome do Plugin ou Arquivo</th> </tr></thead><tbody><tr> <td>Nome do plugin do lado do Server</td> <td><code>authentication_ldap_simple</code></td> </tr><tr> <td>Nome do plugin do lado do Client</td> <td><code>mysql_clear_password</code></td> </tr><tr> <td>Nome do arquivo Library</td> <td><code>authentication_ldap_simple.so</code></td> </tr> </tbody></table>

**Table 6.16 Nomes de Plugin e Library para Autenticação LDAP Baseada em SASL**

<table summary="Nomes para os plugins e o arquivo library usados para authentication de senha LDAP baseada em SASL."><thead><tr> <th>Plugin ou Arquivo</th> <th>Nome do Plugin ou Arquivo</th> </tr></thead><tbody><tr> <td>Nome do plugin do lado do Server</td> <td><code>authentication_ldap_sasl</code></td> </tr><tr> <td>Nome do plugin do lado do Client</td> <td><code>authentication_ldap_sasl_client</code></td> </tr><tr> <td>Nomes dos arquivos Library</td> <td><code>authentication_ldap_sasl.so</code>, <code>authentication_ldap_sasl_client.so</code></td> </tr> </tbody></table>

Os arquivos library incluem apenas os authentication plugins `authentication_ldap_XXX`. O plugin do lado do client `mysql_clear_password` é embutido na client library `libmysqlclient`.

Cada LDAP plugin do lado do server funciona com um plugin do lado do client específico:

* O plugin do lado do server `authentication_ldap_simple` executa authentication LDAP simples. Para conexões por accounts que usam este plugin, os programas client usam o plugin do lado do client `mysql_clear_password`, que envia a password para o server como cleartext. Nenhuma hash de password ou encryption é usada, portanto, é recomendável uma secure connection entre o MySQL client e o server para evitar a exposição da password.

* O plugin do lado do server `authentication_ldap_sasl` executa authentication LDAP baseada em SASL. Para conexões por accounts que usam este plugin, os programas client usam o plugin do lado do client `authentication_ldap_sasl_client`. Os SASL LDAP plugins do lado do client e do lado do server usam SASL messages para transmissão segura de credentials dentro do protocolo LDAP, para evitar o envio da cleartext password entre o MySQL client e o server.

Os authentication plugins LDAP do lado do server estão incluídos apenas no MySQL Enterprise Edition. Eles não estão incluídos nas distribuições da comunidade MySQL (community distributions). O SASL LDAP plugin do lado do client está incluído em todas as distribuições, incluindo as community distributions e, como mencionado anteriormente, o plugin do lado do client `mysql_clear_password` é embutido na client library `libmysqlclient`, que também está incluída em todas as distribuições. Isso permite que clients de qualquer distribuição se conectem a um server que tenha o plugin do lado do server apropriado carregado.

As seções a seguir fornecem informações de instalação e uso específicas para a Autenticação Pluggable LDAP:

* [Prerequisites for LDAP Pluggable Authentication](ldap-pluggable-authentication.html#ldap-pluggable-authentication-prerequisites "Pré-requisitos para Autenticação Pluggable LDAP")
* [How LDAP Authentication of MySQL Users Works](ldap-pluggable-authentication.html#ldap-pluggable-authentication-how-it-works "Como Funciona a Autenticação LDAP de Usuários MySQL")
* [Installing LDAP Pluggable Authentication](ldap-pluggable-authentication.html#ldap-pluggable-authentication-installation "Instalando a Autenticação Pluggable LDAP")
* [Uninstalling LDAP Pluggable Authentication](ldap-pluggable-authentication.html#ldap-pluggable-authentication-uninstallation "Desinstalando a Autenticação Pluggable LDAP")
* [LDAP Pluggable Authentication and ldap.conf](ldap-pluggable-authentication.html#ldap-pluggable-authentication-ldap-conf "Autenticação Pluggable LDAP e ldap.conf")
* [Using LDAP Pluggable Authentication](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage "Usando a Autenticação Pluggable LDAP")
* [Simple LDAP Authentication (Without Proxying)](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage-simple "Autenticação LDAP Simples (Sem Proxying)")
* [SASL-Based LDAP Authentication (Without Proxying)](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage-sasl "Autenticação LDAP Baseada em SASL (Sem Proxying)")
* [LDAP Authentication with Proxying](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage-proxying "Autenticação LDAP com Proxying")
* [LDAP Authentication Group Preference and Mapping Specification](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage-group-mapping "Especificação de Mapeamento e Preferência de Group na Autenticação LDAP")
* [LDAP Authentication User DN Suffixes](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage-user-dn-suffix "Sufixos DN de User na Autenticação LDAP")
* [LDAP Authentication Methods](ldap-pluggable-authentication.html#ldap-pluggable-authentication-auth-methods "Métodos de Autenticação LDAP")

Para informações gerais sobre pluggable authentication no MySQL, consulte [Section 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication"). Para obter informações sobre o plugin `mysql_clear_password`, consulte [Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”](cleartext-pluggable-authentication.html "6.4.1.6 Client-Side Cleartext Pluggable Authentication"). Para informações de proxy user, consulte [Section 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users").

Nota

Se o seu sistema suporta PAM e permite LDAP como um método de authentication PAM, outra maneira de usar LDAP para authentication de user MySQL é usar o plugin do lado do server `authentication_pam`. Consulte [Section 6.4.1.7, “PAM Pluggable Authentication”](pam-pluggable-authentication.html "6.4.1.7 PAM Pluggable Authentication").

##### Pré-requisitos para Autenticação Pluggable LDAP

Para usar a Autenticação Pluggable LDAP para MySQL, estes pré-requisitos devem ser atendidos:

* Um LDAP server deve estar disponível para que os LDAP authentication plugins se comuniquem.

* Os users LDAP a serem autenticados pelo MySQL devem estar presentes no directory gerenciado pelo LDAP server.

* Uma LDAP client library deve estar disponível em sistemas onde o plugin do lado do server `authentication_ldap_sasl` ou `authentication_ldap_simple` é usado. Atualmente, as libraries suportadas são a Windows native LDAP library, ou a OpenLDAP library em sistemas que não sejam Windows.

* Para usar authentication LDAP baseada em SASL:

  + O LDAP server deve ser configurado para se comunicar com um SASL server.

  + Uma SASL client library deve estar disponível em sistemas onde o plugin do lado do client `authentication_ldap_sasl_client` é usado. Atualmente, a única library suportada é a Cyrus SASL library.

##### Como Funciona a Autenticação LDAP de Usuários MySQL

Esta seção fornece uma visão geral de como o MySQL e o LDAP trabalham juntos para autenticar usuários MySQL. Para exemplos que mostram como configurar MySQL accounts para usar LDAP authentication plugins específicos, consulte [Using LDAP Pluggable Authentication](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage "Using LDAP Pluggable Authentication").

O client se conecta ao MySQL server, fornecendo o MySQL client user name e a LDAP password:

* Para authentication LDAP simples, os plugins do lado do client e do lado do server comunicam a password como cleartext. É recomendada uma secure connection entre o MySQL client e o server para evitar a exposição da password.

* Para authentication LDAP baseada em SASL, os plugins do lado do client e do lado do server evitam enviar a cleartext password entre o MySQL client e o server. Por exemplo, os plugins podem usar SASL messages para transmissão segura de credentials dentro do protocolo LDAP.

Se o client user name e o host name não corresponderem a nenhuma MySQL account, a conexão é rejeitada.

Se houver uma MySQL account correspondente, ocorre a authentication contra o LDAP. O LDAP server procura uma entry que corresponda ao user e autentica a entry em relação à LDAP password:

* Se a MySQL account nomear um user distinguished name (DN) LDAP, a authentication LDAP usará esse valor e a LDAP password fornecida pelo client. (Para associar um user DN LDAP a uma MySQL account, inclua uma cláusula `BY` que especifique uma authentication string na instrução [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") que cria a account.)

* Se a MySQL account não nomear um user DN LDAP, a authentication LDAP usará o user name e a LDAP password fornecidos pelo client. Neste caso, o authentication plugin primeiro faz um *bind* (conexão) ao LDAP server usando o root DN e a password como credentials para encontrar o user DN com base no client user name e, em seguida, autentica esse user DN em relação à LDAP password. Este bind usando as root credentials falhará se o root DN e a password estiverem definidos com valores incorretos, ou se estiverem vazios (não definidos) e o LDAP server não permitir conexões anônimas.

Se o LDAP server não encontrar correspondência ou encontrar múltiplas correspondências, a authentication falha e a conexão do client é rejeitada.

Se o LDAP server encontrar uma única correspondência, a authentication LDAP é bem-sucedida (assumindo que a password esteja correta), o LDAP server retorna a LDAP entry, e o authentication plugin determina o nome do user autenticado com base nessa entry:

* Se a LDAP entry tiver um group attribute (por padrão, o attribute `cn`), o plugin retorna seu valor como o authenticated user name.

* Se a LDAP entry não tiver um group attribute, o authentication plugin retorna o client user name como o authenticated user name.

O MySQL server compara o client user name com o authenticated user name para determinar se ocorrerá proxying para a client session:

* Se os nomes forem os mesmos, não ocorrerá proxying: A MySQL account que corresponde ao client user name é usada para privilege checking.

* Se os nomes diferirem, ocorrerá proxying: O MySQL procura uma account que corresponda ao authenticated user name. Essa account se torna o proxied user, que é usado para privilege checking. A MySQL account que correspondeu ao client user name é tratada como o external proxy user.

##### Instalando a Autenticação Pluggable LDAP

Esta seção descreve como instalar os LDAP authentication plugins do lado do server. Para informações gerais sobre a instalação de plugins, consulte [Section 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

Para serem utilizáveis pelo server, os arquivos library do plugin devem estar localizados no diretório de plugins do MySQL (o diretório nomeado pela variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir)). Se necessário, configure o local do diretório de plugins definindo o valor de [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) na inicialização do server.

Os nomes base dos arquivos library do plugin do lado do server são `authentication_ldap_simple` e `authentication_ldap_sasl`. O sufixo do nome do arquivo difere por plataforma (por exemplo, `.so` para sistemas Unix e tipo Unix, `.dll` para Windows).

Para carregar os plugins na inicialização do server, use as opções [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) para nomear os arquivos library que os contêm. Com este método de carregamento de plugin, as opções devem ser fornecidas toda vez que o server iniciar. Além disso, especifique valores para quaisquer system variables fornecidas pelo plugin que você deseja configurar.

Cada LDAP plugin do lado do server expõe um conjunto de system variables que permitem que sua operação seja configurada. Definir a maioria delas é opcional, mas você deve definir as variáveis que especificam o host do LDAP server (para que o plugin saiba onde se conectar) e o base distinguished name para operações de LDAP bind (para limitar o escopo das buscas e obter buscas mais rápidas). Para detalhes sobre todas as LDAP system variables, consulte [Section 6.4.1.13, “Pluggable Authentication System Variables”](pluggable-authentication-system-variables.html#pluggable-authentication-system-variables "6.4.1.13 Pluggable Authentication System Variables").

Para carregar os plugins e definir o host do LDAP server e o base distinguished name para operações de LDAP bind, insira linhas como estas em seu arquivo `my.cnf`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```sql
[mysqld]
plugin-load-add=authentication_ldap_simple.so
authentication_ldap_simple_server_host=127.0.0.1
authentication_ldap_simple_bind_base_dn="dc=example,dc=com"
plugin-load-add=authentication_ldap_sasl.so
authentication_ldap_sasl_server_host=127.0.0.1
authentication_ldap_sasl_bind_base_dn="dc=example,dc=com"
```

Após modificar `my.cnf`, reinicie o server para que as novas configurações entrem em vigor.

Alternativamente, para carregar os plugins em tempo de execução (runtime), use estas instruções, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```sql
INSTALL PLUGIN authentication_ldap_simple
  SONAME 'authentication_ldap_simple.so';
INSTALL PLUGIN authentication_ldap_sasl
  SONAME 'authentication_ldap_sasl.so';
```

[`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") carrega o plugin imediatamente e também o registra na system table `mysql.plugins` para fazer com que o server o carregue em cada inicialização normal subsequente sem a necessidade de [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add).

Após instalar os plugins em tempo de execução, suas system variables tornam-se disponíveis e você pode adicionar configurações para elas ao seu arquivo `my.cnf` para configurar os plugins para reinicializações subsequentes. Por exemplo:

```sql
[mysqld]
authentication_ldap_simple_server_host=127.0.0.1
authentication_ldap_simple_bind_base_dn="dc=example,dc=com"
authentication_ldap_sasl_server_host=127.0.0.1
authentication_ldap_sasl_bind_base_dn="dc=example,dc=com"
```

Após modificar `my.cnf`, reinicie o server para que as novas configurações entrem em vigor.

Para verificar a instalação do plugin, examine a tabela [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") do Information Schema ou use a instrução [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") (consulte [Section 5.5.2, “Obtaining Server Plugin Information”](obtaining-plugin-information.html "5.5.2 Obtaining Server Plugin Information")). Por exemplo:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%ldap%';
+----------------------------+---------------+
| PLUGIN_NAME                | PLUGIN_STATUS |
+----------------------------+---------------+
| authentication_ldap_sasl   | ACTIVE        |
| authentication_ldap_simple | ACTIVE        |
+----------------------------+---------------+
```

Se um plugin falhar ao inicializar, verifique o error log do server para mensagens de diagnóstico.

Para associar MySQL accounts a um LDAP plugin, consulte [Using LDAP Pluggable Authentication](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage "Using LDAP Pluggable Authentication").

Notas Adicionais para SELinux

Em sistemas rodando EL6 ou EL que têm SELinux habilitado, são necessárias mudanças na política SELinux para permitir que os MySQL LDAP plugins se comuniquem com o serviço LDAP:

1. Crie um arquivo `mysqlldap.te` com este conteúdo:

   ```sql
   module mysqlldap 1.0;

   require {
           type ldap_port_t;
           type mysqld_t;
           class tcp_socket name_connect;
   }

   #============= mysqld_t ==============

   allow mysqld_t ldap_port_t:tcp_socket name_connect;
   ```

2. Compile o security policy module em uma representação binária:

   ```sql
   checkmodule -M -m mysqlldap.te -o mysqlldap.mod
   ```

3. Crie um SELinux policy module package:

   ```sql
   semodule_package -m mysqlldap.mod  -o mysqlldap.pp
   ```

4. Instale o module package:

   ```sql
   semodule -i mysqlldap.pp
   ```

5. Quando as alterações na política SELinux tiverem sido feitas, reinicie o MySQL server:

   ```sql
   service mysqld restart
   ```

##### Desinstalando a Autenticação Pluggable LDAP

O método usado para desinstalar os LDAP authentication plugins depende de como você os instalou:

* Se você instalou os plugins na inicialização do server usando as opções [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add), reinicie o server sem essas opções.

* Se você instalou os plugins em tempo de execução usando [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement"), eles permanecem instalados em todas as reinicializações do server. Para desinstalá-los, use [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement"):

  ```sql
  UNINSTALL PLUGIN authentication_ldap_simple;
  UNINSTALL PLUGIN authentication_ldap_sasl;
  ```

Além disso, remova do seu arquivo `my.cnf` quaisquer opções de inicialização que definam system variables relacionadas ao LDAP plugin.

##### Autenticação Pluggable LDAP e ldap.conf

Para instalações que usam OpenLDAP, o arquivo `ldap.conf` fornece defaults globais para LDAP clients. Opções podem ser definidas neste arquivo para afetar os LDAP clients, incluindo os LDAP authentication plugins. O OpenLDAP usa opções de configuration nesta ordem de precedência:

* Configuration especificada pelo LDAP client.
* Configuration especificada no arquivo `ldap.conf`. Para desabilitar o uso deste arquivo, defina a environment variable `LDAPNOINIT`.

* Defaults embutidos na OpenLDAP library.

Se os library defaults ou os valores de `ldap.conf` não resultarem em valores de opção apropriados, um LDAP authentication plugin pode ser capaz de definir variáveis relacionadas para afetar a configuração LDAP diretamente. Por exemplo, os LDAP plugins podem sobrescrever parâmetros de `ldap.conf` para TLS configuration: System variables estão disponíveis para habilitar TLS e controlar a CA configuration, como [`authentication_ldap_simple_tls`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_tls) e [`authentication_ldap_simple_ca_path`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_ca_path) para authentication LDAP simples, e [`authentication_ldap_sasl_tls`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_tls) e [`authentication_ldap_sasl_ca_path`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_ca_path) para authentication LDAP SASL.

Para mais informações sobre `ldap.conf`, consulte a página man `ldap.conf(5)`.

##### Usando a Autenticação Pluggable LDAP

Esta seção descreve como habilitar MySQL accounts para se conectarem ao MySQL server usando a Autenticação Pluggable LDAP. Assume-se que o server esteja rodando com os plugins do lado do server apropriados habilitados, conforme descrito em [Installing LDAP Pluggable Authentication](ldap-pluggable-authentication.html#ldap-pluggable-authentication-installation "Instalando a Autenticação Pluggable LDAP"), e que os plugins do lado do client apropriados estejam disponíveis no host do client.

Esta seção não descreve configuration ou administration LDAP. Assume-se que você esteja familiarizado com esses tópicos.

Os dois plugins LDAP do lado do server funcionam cada um com um plugin do lado do client específico:

* O plugin do lado do server `authentication_ldap_simple` executa authentication LDAP simples. Para conexões por accounts que usam este plugin, os programas client usam o plugin do lado do client `mysql_clear_password`, que envia a password para o server como cleartext. Nenhuma hash de password ou encryption é usada, portanto, é recomendável uma secure connection entre o MySQL client e o server para evitar a exposição da password.

* O plugin do lado do server `authentication_ldap_sasl` executa authentication LDAP baseada em SASL. Para conexões por accounts que usam este plugin, os programas client usam o plugin do lado do client `authentication_ldap_sasl_client`. Os SASL LDAP plugins do lado do client e do lado do server usam SASL messages para transmissão segura de credentials dentro do protocolo LDAP, para evitar o envio da cleartext password entre o MySQL client e o server.

Requisitos gerais para authentication LDAP de usuários MySQL:

* Deve haver uma LDAP directory entry para cada user a ser autenticado.

* Deve haver uma MySQL user account que especifique um LDAP authentication plugin do lado do server e opcionalmente nomeie o user distinguished name (DN) LDAP associado. (Para associar um user DN LDAP a uma MySQL account, inclua uma cláusula `BY` na instrução [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") que cria a account.) Se uma account não nomear uma LDAP string, a authentication LDAP usará o user name especificado pelo client para encontrar a LDAP entry.

* Os programas client se conectam usando o método de conexão apropriado para o authentication plugin do lado do server que a MySQL account usa. Para authentication LDAP, as conexões requerem o MySQL user name e a LDAP password. Além disso, para accounts que usam o plugin do lado do server `authentication_ldap_simple`, invoque os programas client com a opção `--enable-cleartext-plugin` para habilitar o plugin do lado do client `mysql_clear_password`.

As instruções aqui assumem o seguinte cenário:

* Os usuários MySQL `betsy` e `boris` autenticam-se nas LDAP entries para `betsy_ldap` e `boris_ldap`, respectivamente. (Não é necessário que os user names do MySQL e do LDAP sejam diferentes. O uso de nomes diferentes nesta discussão ajuda a esclarecer se um contexto de operação é MySQL ou LDAP.)

* As LDAP entries usam o attribute `uid` para especificar os user names. Isso pode variar dependendo do LDAP server. Alguns LDAP servers usam o attribute `cn` para user names em vez de `uid`. Para alterar o attribute, modifique a system variable [`authentication_ldap_simple_user_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_user_search_attr) ou [`authentication_ldap_sasl_user_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_user_search_attr) de forma apropriada.

* Estas LDAP entries estão disponíveis no directory gerenciado pelo LDAP server, para fornecer distinguished name values que identificam exclusivamente cada user:

  ```sql
  uid=betsy_ldap,ou=People,dc=example,dc=com
  uid=boris_ldap,ou=People,dc=example,dc=com
  ```

* As instruções [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") que criam MySQL accounts nomeiam um user LDAP na cláusula `BY`, para indicar em qual LDAP entry a MySQL account se autentica.

As instruções para configurar uma account que usa authentication LDAP dependem de qual LDAP plugin do lado do server é usado. As seções a seguir descrevem vários cenários de uso.

##### Autenticação LDAP Simples (Sem Proxying)

O procedimento descrito nesta seção exige que [`authentication_ldap_simple_group_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_group_search_attr) seja definido como uma string vazia, assim:

```sql
SET GLOBAL.authentication_ldap_simple_group_search_attr='';
```

Caso contrário, o proxying é usado por padrão.

Para configurar uma MySQL account para authentication LDAP simples, use uma instrução [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") para especificar o plugin `authentication_ldap_simple`, incluindo opcionalmente o LDAP user distinguished name (DN), conforme mostrado aqui:

```sql
CREATE USER user
  IDENTIFIED WITH authentication_ldap_simple
  [BY 'LDAP user DN'];
```

Suponha que o user MySQL `betsy` tenha esta entry no LDAP directory:

```sql
uid=betsy_ldap,ou=People,dc=example,dc=com
```

Então a instrução para criar a MySQL account para `betsy` fica assim:

```sql
CREATE USER 'betsy'@'localhost'
  IDENTIFIED WITH authentication_ldap_simple
  AS 'uid=betsy_ldap,ou=People,dc=example,dc=com';
```

A authentication string especificada na cláusula `BY` não inclui a LDAP password. Isso deve ser fornecido pelo client user no momento da conexão (connect time).

Clients se conectam ao MySQL server fornecendo o MySQL user name e a LDAP password, e habilitando o plugin do lado do client `mysql_clear_password`:

```sql
$> mysql --user=betsy --password --enable-cleartext-plugin
Enter password: betsy_ldap_password
```

Nota

O authentication plugin do lado do client `mysql_clear_password` deixa a password intacta, então os programas client a enviam para o MySQL server como cleartext. Isso permite que a password seja passada como está para o LDAP server. Uma cleartext password é necessária para usar a LDAP library do lado do server sem SASL, mas pode ser um problema de security em algumas configurações. Estas medidas minimizam o risco:

* Para tornar o uso inadvertido do plugin `mysql_clear_password` menos provável, os MySQL clients devem habilitá-lo explicitamente (por exemplo, com a opção `--enable-cleartext-plugin`). Consulte [Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”](cleartext-pluggable-authentication.html "6.4.1.6 Client-Side Cleartext Pluggable Authentication").

* Para evitar a exposição da password com o plugin `mysql_clear_password` habilitado, os MySQL clients devem se conectar ao MySQL server usando uma encrypted connection. Consulte [Section 6.3.1, “Configuring MySQL to Use Encrypted Connections”](using-encrypted-connections.html "6.3.1 Configuring MySQL to Use Encrypted Connections").

O authentication process ocorre da seguinte forma:

1. O plugin do lado do client envia `betsy` e *`betsy_password`* como o client user name e LDAP password para o MySQL server.

2. A tentativa de conexão corresponde à account `'betsy'@'localhost'`. O LDAP plugin do lado do server descobre que esta account tem uma authentication string de `'uid=betsy_ldap,ou=People,dc=example,dc=com'` para nomear o LDAP user DN. O plugin envia esta string e a LDAP password para o LDAP server.

3. O LDAP server encontra a LDAP entry para `betsy_ldap` e a password corresponde, então a authentication LDAP é bem-sucedida.

4. A LDAP entry não tem group attribute, então o plugin do lado do server retorna o client user name (`betsy`) como o authenticated user. Este é o mesmo user name fornecido pelo client, então não ocorre proxying e a client session usa a account `'betsy'@'localhost'` para privilege checking.

Se a instrução [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") não contivesse uma cláusula `BY` para especificar o distinguished name LDAP de `betsy_ldap`, as tentativas de authentication usariam o user name fornecido pelo client (neste caso, `betsy`). Na ausência de uma LDAP entry para `betsy`, a authentication falharia.

##### Autenticação LDAP Baseada em SASL (Sem Proxying)

O procedimento descrito nesta seção exige que [`authentication_ldap_sasl_group_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_group_search_attr) seja definido como uma string vazia, assim:

```sql
SET GLOBAL.authentication_ldap_sasl_group_search_attr='';
```

Caso contrário, o proxying é usado por padrão.

Para configurar uma MySQL account para authentication LDAP SASL, use uma instrução [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") para especificar o plugin `authentication_ldap_sasl`, incluindo opcionalmente o LDAP user distinguished name (DN), conforme mostrado aqui:

```sql
CREATE USER user
  IDENTIFIED WITH authentication_ldap_sasl
  [BY 'LDAP user DN'];
```

Suponha que o user MySQL `boris` tenha esta entry no LDAP directory:

```sql
uid=boris_ldap,ou=People,dc=example,dc=com
```

Então a instrução para criar a MySQL account para `boris` fica assim:

```sql
CREATE USER 'boris'@'localhost'
  IDENTIFIED WITH authentication_ldap_sasl
  AS 'uid=boris_ldap,ou=People,dc=example,dc=com';
```

A authentication string especificada na cláusula `BY` não inclui a LDAP password. Isso deve ser fornecido pelo client user no momento da conexão (connect time).

Clients se conectam ao MySQL server fornecendo o MySQL user name e a LDAP password:

```sql
$> mysql --user=boris --password
Enter password: boris_ldap_password
```

Para o plugin do lado do server `authentication_ldap_sasl`, os clients usam o plugin do lado do client `authentication_ldap_sasl_client`. Se um programa client não encontrar o plugin do lado do client, especifique uma opção [`--plugin-dir`](connection-options.html#option_general_plugin-dir) que nomeia o diretório onde o arquivo library do plugin está instalado.

O authentication process para `boris` é semelhante ao descrito anteriormente para `betsy` com authentication LDAP simples, exceto que os SASL LDAP plugins do lado do client e do lado do server usam SASL messages para transmissão segura de credentials dentro do protocolo LDAP, para evitar o envio da cleartext password entre o MySQL client e o server.

##### Autenticação LDAP com Proxying

Os LDAP authentication plugins suportam proxying, permitindo que um user se conecte ao MySQL server como um user, mas assuma os privileges de um user diferente. Esta seção descreve o suporte básico a LDAP plugin proxy. Os LDAP plugins também suportam a especificação de group preference e mapeamento de proxy user; consulte [LDAP Authentication Group Preference and Mapping Specification](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage-group-mapping "Especificação de Mapeamento e Preferência de Group na Autenticação LDAP").

A implementação de proxying descrita aqui é baseada no uso de LDAP group attribute values para mapear usuários MySQL que se autenticam usando LDAP para outras MySQL accounts que definem diferentes conjuntos de privileges. Os users não se conectam diretamente através das accounts que definem os privileges. Em vez disso, eles se conectam através de uma default proxy account autenticada com LDAP, de modo que todos os logins externos são mapeados para as MySQL accounts com proxy (proxied accounts) que detêm os privileges. Qualquer user que se conecta usando a proxy account é mapeado para uma dessas proxied MySQL accounts, cujos privileges determinam as database operations permitidas ao user externo.

As instruções aqui assumem o seguinte cenário:

* As LDAP entries usam os attributes `uid` e `cn` para especificar os user name e group values, respectivamente. Para usar diferentes user e group attribute names, defina as system variables apropriadas específicas do plugin:

  + Para o plugin `authentication_ldap_simple`: Defina [`authentication_ldap_simple_user_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_user_search_attr) e [`authentication_ldap_simple_group_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_group_search_attr).

  + Para o plugin `authentication_ldap_sasl`: Defina [`authentication_ldap_sasl_user_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_user_search_attr) e [`authentication_ldap_sasl_group_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_group_search_attr).

* Estas LDAP entries estão disponíveis no directory gerenciado pelo LDAP server, para fornecer distinguished name values que identificam exclusivamente cada user:

  ```sql
  uid=basha,ou=People,dc=example,dc=com,cn=accounting
  uid=basil,ou=People,dc=example,dc=com,cn=front_office
  ```

  No connect time, os group attribute values se tornam os authenticated user names, então eles nomeiam as proxied accounts `accounting` e `front_office`.

* Os exemplos assumem o uso de authentication LDAP SASL. Faça os ajustes apropriados para authentication LDAP simples.

Crie a default proxy MySQL account:

```sql
CREATE USER ''@'%'
  IDENTIFIED WITH authentication_ldap_sasl;
```

A definição da proxy account não possui uma cláusula `AS 'auth_string'` para nomear um LDAP user DN. Assim:

* Quando um client se conecta, o client user name torna-se o user name LDAP a ser pesquisado.

* Espera-se que a LDAP entry correspondente inclua um group attribute nomeando a proxied MySQL account que define os privileges que o client deve ter.

Nota

Se sua instalação MySQL tiver anonymous users, eles podem entrar em conflito com o default proxy user. Para mais informações sobre este problema e formas de resolvê-lo, consulte [Default Proxy User and Anonymous User Conflicts](proxy-users.html#proxy-users-conflicts "Default Proxy User and Anonymous User Conflicts").

Crie as proxied accounts e conceda a cada uma os privileges que ela deve ter:

```sql
CREATE USER 'accounting'@'localhost'
  IDENTIFIED WITH mysql_no_login;
CREATE USER 'front_office'@'localhost'
  IDENTIFIED WITH mysql_no_login;

GRANT ALL PRIVILEGES
  ON accountingdb.*
  TO 'accounting'@'localhost';
GRANT ALL PRIVILEGES
  ON frontdb.*
  TO 'front_office'@'localhost';
```

As proxied accounts usam o `mysql_no_login` authentication plugin para impedir que os clients usem as accounts para fazer login diretamente no MySQL server. Em vez disso, espera-se que os users que se autenticam usando LDAP usem a default `''@'%'` proxy account. (Isso pressupõe que o plugin `mysql_no_login` esteja instalado. Para obter instruções, consulte [Section 6.4.1.10, “No-Login Pluggable Authentication”](no-login-pluggable-authentication.html "6.4.1.10 No-Login Pluggable Authentication").) Para métodos alternativos de proteção de proxied accounts contra uso direto, consulte [Preventing Direct Login to Proxied Accounts](proxy-users.html#preventing-proxied-account-direct-login "Preventing Direct Login to Proxied Accounts").

Conceda à proxy account o privilege [`PROXY`](privileges-provided.html#priv_proxy) para cada proxied account:

```sql
GRANT PROXY
  ON 'accounting'@'localhost'
  TO ''@'%';
GRANT PROXY
  ON 'front_office'@'localhost'
  TO ''@'%';
```

Use o client de linha de comando [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") para se conectar ao MySQL server como `basha`.

```sql
$> mysql --user=basha --password
Enter password: basha_password (basha LDAP password)
```

A authentication ocorre da seguinte forma:

1. O server autentica a conexão usando a default `''@'%'` proxy account, para o client user `basha`.

2. A LDAP entry correspondente é:

   ```sql
   uid=basha,ou=People,dc=example,dc=com,cn=accounting
   ```

3. A LDAP entry correspondente tem o group attribute `cn=accounting`, então `accounting` torna-se o authenticated proxied user.

4. O authenticated user difere do client user name `basha`, com o resultado de que `basha` é tratado como um proxy para `accounting`, e `basha` assume os privileges da proxied account `accounting`. A seguinte query retorna output conforme mostrado:

   ```sql
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-----------------+----------------------+--------------+
   | USER()          | CURRENT_USER()       | @@proxy_user |
   +-----------------+----------------------+--------------+
   | basha@localhost | accounting@localhost | ''@'%'       |
   +-----------------+----------------------+--------------+
   ```

Isso demonstra que `basha` usa os privileges concedidos à proxied MySQL account `accounting`, e que o proxying ocorre através da default proxy user account.

Agora conecte-se como `basil`:

```sql
$> mysql --user=basil --password
Enter password: basil_password (basil LDAP password)
```

O authentication process para `basil` é semelhante ao descrito anteriormente para `basha`:

1. O server autentica a conexão usando a default `''@'%'` proxy account, para o client user `basil`.

2. A LDAP entry correspondente é:

   ```sql
   uid=basil,ou=People,dc=example,dc=com,cn=front_office
   ```

3. A LDAP entry correspondente tem o group attribute `cn=front_office`, então `front_office` torna-se o authenticated proxied user.

4. O authenticated user difere do client user name `basil`, com o resultado de que `basil` é tratado como um proxy para `front_office`, e `basil` assume os privileges da proxied account `front_office`. A seguinte query retorna output conforme mostrado:

   ```sql
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-----------------+------------------------+--------------+
   | USER()          | CURRENT_USER()         | @@proxy_user |
   +-----------------+------------------------+--------------+
   | basil@localhost | front_office@localhost | ''@'%'       |
   +-----------------+------------------------+--------------+
   ```

Isso demonstra que `basil` usa os privileges concedidos à proxied MySQL account `front_office`, e que o proxying ocorre através da default proxy user account.

##### Especificação de Mapeamento e Preferência de Group na Autenticação LDAP

Conforme descrito em [LDAP Authentication with Proxying](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage-proxying "Autenticação LDAP com Proxying"), o basic LDAP authentication proxying funciona pelo princípio de que o plugin usa o primeiro group name retornado pelo LDAP server como o MySQL proxied user account name. Esta capacidade simples não permite especificar nenhuma preference sobre qual group name usar se o LDAP server retornar múltiplos group names, ou especificar qualquer nome diferente do group name como o proxied user name.

A partir do MySQL 5.7.25, para MySQL accounts que usam authentication LDAP, a authentication string pode especificar as seguintes informações para permitir maior flexibilidade de proxying:

* Uma lista de groups em ordem de preference, de modo que o plugin use o primeiro group name na lista que corresponda a um group retornado pelo LDAP server.

* Um mapping de group names para proxied user names, de modo que um group name, quando correspondido, possa fornecer um nome especificado para ser usado como o proxied user. Isso fornece uma alternativa ao uso do group name como o proxied user.

Considere a seguinte MySQL proxy account definition:

```sql
CREATE USER ''@'%'
  IDENTIFIED WITH authentication_ldap_sasl
  AS '+ou=People,dc=example,dc=com#grp1=usera,grp2,grp3=userc';
```

A authentication string tem um user DN suffix `ou=People,dc=example,dc=com` prefixado pelo caractere `+`. Assim, conforme descrito em [LDAP Authentication User DN Suffixes](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage-user-dn-suffix "Sufixos DN de User na Autenticação LDAP"), o full user DN é construído a partir do user DN suffix conforme especificado, mais o client user name como o attribute `uid`.

A parte restante da authentication string começa com `#`, o que significa o início das informações de group preference e mapping. Esta parte da authentication string lista group names na ordem `grp1`, `grp2`, `grp3`. O LDAP plugin compara essa lista com o conjunto de group names retornado pelo LDAP server, procurando na ordem da lista por uma correspondência contra os nomes retornados. O plugin usa a primeira correspondência, ou se não houver correspondência, a authentication falha.

Suponha que o LDAP server retorne os groups `grp3`, `grp2` e `grp7`. O LDAP plugin usa `grp2` porque é o primeiro group na authentication string que corresponde, mesmo que não seja o primeiro group retornado pelo LDAP server. Se o LDAP server retornar `grp4`, `grp2` e `grp1`, o plugin usa `grp1` mesmo que `grp2` também corresponda. `grp1` tem uma precedence maior que `grp2` porque está listado antes na authentication string.

Assumindo que o plugin encontre uma correspondência de group name, ele executa o mapping daquele group name para o MySQL proxied user name, se houver um. Para a proxy account de exemplo, o mapping ocorre da seguinte forma:

* Se o group name correspondente for `grp1` ou `grp3`, eles estão associados na authentication string com os user names `usera` e `userc`, respectivamente. O plugin usa o user name associado correspondente como o proxied user name.

* Se o group name correspondente for `grp2`, não há user name associado na authentication string. O plugin usa `grp2` como o proxied user name.

Se o LDAP server retornar um group em formato DN, o LDAP plugin analisa o group DN para extrair o group name dele.

Para especificar informações de LDAP group preference e mapping, estes princípios se aplicam:

* Comece a parte de group preference e mapping da authentication string com um caractere prefixo `#`.

* A especificação de group preference e mapping é uma lista de um ou mais itens, separados por vírgulas. Cada item tem a forma `group_name=user_name` ou *`group_name`*. Os itens devem ser listados na ordem de group name preference. Para um group name selecionado pelo plugin como uma correspondência do conjunto de group names retornados pelo LDAP server, as duas sintaxes diferem em efeito da seguinte forma:

  + Para um item especificado como `group_name=user_name` (com um user name), o group name mapeia para o user name, que é usado como o MySQL proxied user name.

  + Para um item especificado como *`group_name`* (sem user name), o group name é usado como o MySQL proxied user name.

* Para citar um group ou user name que contenha special characters, como espaço, cerque-o com caracteres de double quote (`"`). Por exemplo, se um item tiver group e user names de `my group name` e `my user name`, ele deve ser escrito em um group mapping usando quotes:

  ```sql
  "my group name"="my user name"
  ```

* Se um item tiver group e user names de `my_group_name` e `my_user_name` (que não contêm special characters), ele pode ou não ser escrito usando quotes. Qualquer um dos seguintes é válido:

  ```sql
  my_group_name=my_user_name
  my_group_name="my_user_name"
  "my_group_name"=my_user_name
  "my_group_name"="my_user_name"
  ```

* Para escapar um caractere, preceda-o com uma backslash (`\`). Isso é útil particularmente para incluir uma double quote ou backslash literal, que de outra forma não seriam incluídas literalmente.

* Um user DN não precisa estar presente na authentication string, mas se estiver, deve preceder a parte de group preference e mapping. Um user DN pode ser fornecido como um full user DN, ou como um user DN suffix com um caractere prefixo `+`. (Consulte [LDAP Authentication User DN Suffixes](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage-user-dn-suffix "Sufixos DN de User na Autenticação LDAP").)

##### Sufixos DN de User na Autenticação LDAP

A partir do MySQL 5.7.21, os LDAP authentication plugins permitem que a authentication string que fornece informações de user DN comece com um caractere prefixo `+`:

* Na ausência de um caractere `+`, o valor da authentication string é tratado como está, sem modificação.

* Se a authentication string começar com `+`, o plugin constrói o full user DN value a partir do user name enviado pelo client, juntamente com o DN especificado na authentication string (com o `+` removido). No DN construído, o client user name torna-se o valor do attribute que especifica os LDAP user names. Este é `uid` por padrão; para alterar o attribute, modifique a system variable apropriada ([`authentication_ldap_simple_user_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_user_search_attr) ou [`authentication_ldap_sasl_user_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_user_search_attr)). A authentication string é armazenada conforme fornecida na system table `mysql.user`, com o full user DN construído on the fly antes da authentication.

A authentication string desta account não tem `+` no início, então é considerada o full user DN:

```sql
CREATE USER 'baldwin'
  IDENTIFIED WITH authentication_ldap_simple
  AS 'uid=admin,ou=People,dc=example,dc=com';
```

O client se conecta com o user name especificado na account (`baldwin`). Neste caso, esse nome não é usado porque a authentication string não tem prefixo e, portanto, especifica totalmente o user DN.

A authentication string desta account tem `+` no início, então é considerada apenas parte do user DN:

```sql
CREATE USER 'accounting'
  IDENTIFIED WITH authentication_ldap_simple
  AS '+ou=People,dc=example,dc=com';
```

O client se conecta com o user name especificado na account (`accounting`), que neste caso é usado como o attribute `uid` juntamente com a authentication string para construir o user DN: `uid=accounting,ou=People,dc=example,dc=com`

As accounts nos exemplos precedentes têm um user name não vazio, então o client sempre se conecta ao MySQL server usando o mesmo nome especificado na account definition. Se uma account tiver um user name vazio, como a default anonymous `''@'%'` proxy account descrita em [LDAP Authentication with Proxying](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage-proxying "Autenticação LDAP com Proxying"), os clients podem se conectar ao MySQL server com user names variados. Mas o princípio é o mesmo: Se a authentication string começar com `+`, o plugin usa o user name enviado pelo client juntamente com a authentication string para construir o user DN.

##### Métodos de Autenticação LDAP

Os LDAP authentication plugins usam um authentication method configurável. A system variable apropriada e as opções de método disponíveis são específicas do plugin:

* Para o plugin `authentication_ldap_simple`: Configure o method definindo a system variable [`authentication_ldap_simple_auth_method_name`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_auth_method_name). As opções permitidas são `SIMPLE` e `AD-FOREST`.

* Para o plugin `authentication_ldap_sasl`: Configure o method definindo a system variable [`authentication_ldap_sasl_auth_method_name`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_auth_method_name). A única opção permitida é `SCRAM-SHA-1`.

Consulte as descrições das system variables para obter informações sobre cada method permitido.