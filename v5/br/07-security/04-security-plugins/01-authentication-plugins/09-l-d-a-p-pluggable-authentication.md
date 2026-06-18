#### 6.4.1.9 Autenticação Pluggable LDAP

::: info Nota
A autenticação plugável LDAP é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A partir do MySQL 5.7.19, a Edição Empresarial do MySQL suporta um método de autenticação que permite ao MySQL Server usar o LDAP (Lightweight Directory Access Protocol) para autenticar usuários do MySQL acessando serviços de diretório, como o X.500. O MySQL usa o LDAP para buscar informações de usuário, credenciais e grupos.
:::

A autenticação plugável LDAP oferece essas capacidades:

- Autenticação externa: a autenticação LDAP permite que o MySQL Server aceite conexões de usuários definidos fora das tabelas de concessão do MySQL nos diretórios LDAP.

- Suporte ao usuário proxy: a autenticação LDAP pode retornar ao MySQL um nome de usuário diferente do nome de usuário externo passado pelo programa cliente, com base nos grupos LDAP dos quais o usuário externo é membro. Isso significa que um plugin LDAP pode retornar o usuário MySQL que define os privilégios que o usuário externo autenticado pelo LDAP deve ter. Por exemplo, um usuário LDAP chamado `joe` pode se conectar e ter os privilégios de um usuário MySQL chamado `developer`, se o grupo LDAP para `joe` for `developer`.

- Segurança: O uso do TLS permite que as conexões com o servidor LDAP sejam seguras.

As tabelas a seguir mostram os nomes dos arquivos de plugin e biblioteca para autenticação LDAP simples e baseada em SASL. O sufixo do nome do arquivo pode variar no seu sistema. Os arquivos devem estar localizados no diretório nomeado pela variável de sistema `plugin_dir`.

**Tabela 6.15 Nomes de plugins e bibliotecas para autenticação LDAP simples**

<table summary="Nomes para os plugins e o arquivo de biblioteca usados para autenticação de senha LDAP simples."><thead><tr> <th>Plugin ou arquivo</th> <th>Nome do Plugin ou do Arquivo</th> </tr></thead><tbody><tr> <td>Nome do plugin no lado do servidor</td> <td><code>authentication_ldap_simple</code></td> </tr><tr> <td>Nome do plugin no lado do cliente</td> <td><code>mysql_clear_password</code></td> </tr><tr> <td>Nome do arquivo da biblioteca</td> <td><code>authentication_ldap_simple.so</code></td> </tr></tbody></table>

**Tabela 6.16 Nomes de plugins e bibliotecas para autenticação LDAP baseada em SASL**

<table summary="Nomes para os plugins e o arquivo de biblioteca usados para autenticação de senha com base em SASL-LDAP."><thead><tr> <th>Plugin ou arquivo</th> <th>Nome do Plugin ou do Arquivo</th> </tr></thead><tbody><tr> <td>Nome do plugin no lado do servidor</td> <td><code>authentication_ldap_sasl</code></td> </tr><tr> <td>Nome do plugin no lado do cliente</td> <td><code>authentication_ldap_sasl_client</code></td> </tr><tr> <td>Nomes de arquivos da biblioteca</td> <td><code>authentication_ldap_sasl.so</code>, <code>authentication_ldap_sasl_client.so</code></td> </tr></tbody></table>

Os arquivos da biblioteca incluem apenas os plugins de autenticação `authentication_ldap_XXX`. O plugin `mysql_clear_password` do lado do cliente está integrado à biblioteca de clientes `libmysqlclient`.

Cada plugin do lado do servidor LDAP funciona com um plugin específico do lado do cliente:

- O plugin de autenticação `authentication_ldap_simple` do lado do servidor realiza uma autenticação LDAP simples. Para conexões realizadas por contas que utilizam este plugin, os programas cliente utilizam o plugin `mysql_clear_password` do lado do cliente, que envia a senha para o servidor como texto claro. Não é utilizada hashing ou criptografia de senhas, portanto, é recomendada uma conexão segura entre o cliente e o servidor MySQL para evitar a exposição da senha.

- O plugin de autenticação `authentication_ldap_sasl` do lado do servidor realiza a autenticação LDAP baseada em SASL. Para conexões realizadas por contas que utilizam este plugin, os programas cliente utilizam o plugin `authentication_ldap_sasl_client` do lado do cliente. Os plugins SASL LDAP do lado do cliente e do servidor utilizam mensagens SASL para a transmissão segura das credenciais dentro do protocolo LDAP, para evitar o envio da senha em texto claro entre o cliente e o servidor MySQL.

Os plugins de autenticação LDAP no lado do servidor estão incluídos apenas na Edição Empresarial do MySQL. Eles não estão incluídos nas distribuições comunitárias do MySQL. O plugin SASL LDAP no lado do cliente está incluído em todas as distribuições, incluindo as comunitárias, e, como mencionado anteriormente, o plugin `mysql_clear_password` no lado do cliente está integrado à biblioteca de clientes `libmysqlclient`, que também está incluída em todas as distribuições. Isso permite que clientes de qualquer distribuição se conectem a um servidor que tenha o plugin no lado do servidor apropriado carregado.

As seções a seguir fornecem informações de instalação e uso específicas para autenticação plugável LDAP:

- Pré-requisitos para Autenticação Pluggable LDAP
- Como a Autenticação LDAP de Usuários do MySQL Funciona
- Instalando Autenticação Conectada (LDAP)
- Desinstalação da Autenticação Conectada (LDAP)
- Autenticação Pluggable LDAP e ldap.conf
- Usando autenticação plugável LDAP
- Autenticação LDAP Simples (Sem Proxy)
- Autenticação LDAP baseada em SASL (sem proxy) (ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage-sasl)
- Autenticação LDAP com Proxy
- Especificação de Preferência e Mapeamento de Grupo de Autenticação LDAP
- Sufixos de DN de usuários de autenticação LDAP (ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage-user-dn-suffix)
- Métodos de Autenticação LDAP

Para informações gerais sobre autenticação plugável no MySQL, consulte Seção 6.2.13, “Autenticação Plugável”. Para informações sobre o plugin `mysql_clear_password`, consulte Seção 6.4.1.6, “Autenticação Plugável em Texto Aberto no Lado do Cliente”. Para informações sobre informações de usuários proxy, consulte Seção 6.2.14, “Usuários Proxy”.

Nota

Se o seu sistema suportar o PAM e permitir o LDAP como método de autenticação PAM, outra maneira de usar o LDAP para autenticação de usuários do MySQL é usar o plugin `authentication_pam` no lado do servidor. Veja Seção 6.4.1.7, “Autenticação Pluggable PAM”.

##### Pré-requisitos para autenticação compatível com LDAP

Para usar a autenticação de pluggable LDAP para MySQL, é necessário que os seguintes pré-requisitos sejam atendidos:

- Um servidor LDAP deve estar disponível para que os plugins de autenticação LDAP possam se comunicar.

- Os usuários do LDAP que devem ser autenticados pelo MySQL devem estar presentes no diretório gerenciado pelo servidor LDAP.

- Uma biblioteca de cliente LDAP deve estar disponível nos sistemas onde o plugin `authentication_ldap_sasl` ou `authentication_ldap_simple` do lado do servidor é usado. Atualmente, as bibliotecas suportadas são a biblioteca nativa LDAP do Windows ou a biblioteca OpenLDAP em sistemas que não são do Windows.

- Para usar a autenticação LDAP baseada em SASL:

  - O servidor LDAP deve ser configurado para se comunicar com um servidor SASL.

  - Uma biblioteca de cliente SASL deve estar disponível nos sistemas onde o plugin `authentication_ldap_sasl_client` do lado do cliente é usado. Atualmente, a única biblioteca suportada é a biblioteca Cyrus SASL.

##### Como funciona a autenticação LDAP de usuários do MySQL

Esta seção fornece uma visão geral geral de como o MySQL e o LDAP trabalham juntos para autenticar usuários do MySQL. Para exemplos que mostram como configurar contas do MySQL para usar plugins de autenticação LDAP específicos, consulte Usando Plugins de Autenticação Extensíveis LDAP.

O cliente se conecta ao servidor MySQL, fornecendo o nome de usuário do cliente do MySQL e a senha do LDAP:

- Para a autenticação LDAP simples, os plugins do lado do cliente e do lado do servidor comunicam a senha em texto claro. Uma conexão segura entre o cliente e o servidor MySQL é recomendada para evitar a exposição da senha.

- Para a autenticação LDAP baseada em SASL, os plugins do lado do cliente e do lado do servidor evitam enviar a senha em texto claro entre o cliente e o servidor MySQL. Por exemplo, os plugins podem usar mensagens SASL para a transmissão segura das credenciais dentro do protocolo LDAP.

Se o nome de usuário e o nome do host do cliente não corresponderem a nenhuma conta MySQL, a conexão é rejeitada.

Se houver uma conta MySQL correspondente, a autenticação no LDAP ocorre. O servidor LDAP procura uma entrada que corresponda ao usuário e autentica a entrada contra a senha do LDAP:

- Se a conta MySQL nomear o nome distinto (DN) de um usuário LDAP, a autenticação LDAP usará esse valor e a senha LDAP fornecida pelo cliente. (Para associar um DN de usuário LDAP a uma conta MySQL, inclua uma cláusula `BY` que especifique uma string de autenticação na instrução `CREATE USER` que cria a conta.)

- Se a conta MySQL não especificar um DN de usuário LDAP, a autenticação LDAP usa o nome do usuário e a senha LDAP fornecidos pelo cliente. Nesse caso, o plugin de autenticação se vincula primeiro ao servidor LDAP usando o DN raiz e a senha como credenciais para encontrar o DN do usuário com base no nome do usuário do cliente, e depois autentica esse DN do usuário contra a senha LDAP. Esse vínculo usando as credenciais raiz falha se o DN raiz e a senha estiverem configurados com valores incorretos ou estiverem vazios (não configurados) e o servidor LDAP não permitir conexões anônimas.

Se o servidor LDAP não encontrar nenhuma correspondência ou múltiplas correspondências, a autenticação falha e a conexão do cliente é rejeitada.

Se o servidor LDAP encontrar uma única correspondência, a autenticação LDAP terá sucesso (assumindo que a senha está correta), o servidor LDAP retorna a entrada LDAP e o plugin de autenticação determina o nome do usuário autenticado com base nessa entrada:

- Se a entrada LDAP tiver um atributo de grupo (por padrão, o atributo `cn`), o plugin retornará seu valor como o nome do usuário autenticado.

- Se a entrada LDAP não tiver o atributo de grupo, o plugin de autenticação retornará o nome do usuário do cliente como o nome do usuário autenticado.

O servidor MySQL compara o nome do usuário do cliente com o nome do usuário autenticado para determinar se ocorre o encaminhamento para a sessão do cliente:

- Se os nomes forem os mesmos, não ocorrerá nenhum encaminhamento: a conta MySQL que corresponde ao nome do usuário do cliente será usada para a verificação de privilégios.

- Se os nomes forem diferentes, ocorre o encaminhamento: o MySQL procura uma conta que corresponda ao nome do usuário autenticado. Essa conta se torna o usuário encaminhado, que é usado para verificar privilégios. A conta do MySQL que correspondeu ao nome do usuário do cliente é tratada como o usuário do proxy externo.

##### Instalando Autenticação Conectada LDAP

Esta seção descreve como instalar os plugins de autenticação LDAP no lado do servidor. Para informações gerais sobre como instalar plugins, consulte Seção 5.5.1, “Instalando e Desinstalando Plugins”.

Para que o plugin possa ser usado pelo servidor, os arquivos da biblioteca do plugin devem estar localizados no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` durante o início do servidor.

Os nomes de arquivo da biblioteca de plugins do lado do servidor são `authentication_ldap_simple` e `authentication_ldap_sasl`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para carregar os plugins na inicialização do servidor, use as opções `--plugin-load-add` para nomear os arquivos da biblioteca que os contêm. Com esse método de carregamento de plugins, as opções devem ser fornecidas toda vez que o servidor for iniciado. Além disso, especifique valores para quaisquer variáveis de sistema fornecidas pelo plugin que você deseja configurar.

Cada plugin LDAP do lado do servidor expõe um conjunto de variáveis de sistema que permitem a configuração de sua operação. A maioria dessas variáveis é opcional, mas você deve definir as variáveis que especificam o host do servidor LDAP (para que o plugin saiba onde se conectar) e o nome distinto da base para operações de vinculação LDAP (para limitar o escopo das pesquisas e obter pesquisas mais rápidas). Para obter detalhes sobre todas as variáveis de sistema LDAP, consulte Seção 6.4.1.13, “Variáveis do Sistema de Autenticação Conectada”.

Para carregar os plugins e definir o host do servidor LDAP e o nome distinto base para operações de vinculação LDAP, coloque linhas como estas no seu arquivo `my.cnf`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
[mysqld]
plugin-load-add=authentication_ldap_simple.so
authentication_ldap_simple_server_host=127.0.0.1
authentication_ldap_simple_bind_base_dn="dc=example,dc=com"
plugin-load-add=authentication_ldap_sasl.so
authentication_ldap_sasl_server_host=127.0.0.1
authentication_ldap_sasl_bind_base_dn="dc=example,dc=com"
```

Depois de modificar o `my.cnf`, reinicie o servidor para que as novas configurações entrem em vigor.

Como alternativa, para carregar os plugins em tempo de execução, use essas instruções, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
INSTALL PLUGIN authentication_ldap_simple
  SONAME 'authentication_ldap_simple.so';
INSTALL PLUGIN authentication_ldap_sasl
  SONAME 'authentication_ldap_sasl.so';
```

`INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela `mysql.plugins` do sistema para que o servidor o carregue em cada inicialização normal subsequente, sem a necessidade de `--plugin-load-add`.

Após instalar os plugins durante a execução, suas variáveis de sistema ficam disponíveis e você pode adicionar configurações para eles ao seu arquivo `my.cnf` para configurar os plugins para reinicializações subsequentes. Por exemplo:

```
[mysqld]
authentication_ldap_simple_server_host=127.0.0.1
authentication_ldap_simple_bind_base_dn="dc=example,dc=com"
authentication_ldap_sasl_server_host=127.0.0.1
authentication_ldap_sasl_bind_base_dn="dc=example,dc=com"
```

Depois de modificar o `my.cnf`, reinicie o servidor para que as novas configurações entrem em vigor.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 5.5.2, “Obtendo Informações de Plugins do Servidor”). Por exemplo:

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

Se um plugin não conseguir se inicializar, verifique o log de erros do servidor para mensagens de diagnóstico.

Para associar contas do MySQL a um plugin LDAP, consulte Usando autenticação compatível com LDAP.

Observações adicionais para o SELinux

Em sistemas que executam o EL6 ou o EL com o SELinux habilitado, são necessárias alterações na política do SELinux para permitir que os plugins do MySQL LDAP se comuniquem com o serviço LDAP:

1. Crie um arquivo `mysqlldap.te` com este conteúdo:

   ```
   module mysqlldap 1.0;

   require {
           type ldap_port_t;
           type mysqld_t;
           class tcp_socket name_connect;
   }

   #============= mysqld_t ==============

   allow mysqld_t ldap_port_t:tcp_socket name_connect;
   ```

2. Compile o módulo de política de segurança em uma representação binária:

  ```sh
  checkmodule -M -m mysqlldap.te -o mysqlldap.mod
  ```

3. Crie um pacote de módulo de política SELinux:

  ```sh
  semodule_package -m mysqlldap.mod  -o mysqlldap.pp
  ```

4. Instale o pacote do módulo:

  ```sh
  semodule -i mysqlldap.pp
  ```

5. Quando as alterações nas políticas do SELinux forem feitas, reinicie o servidor MySQL:

  ```sh
  service mysqld restart
  ```

##### Desinstalação do LDAP Pluggable Authentication

O método usado para desinstalar os plugins de autenticação LDAP depende de como você os instalou:

- Se você instalou os plugins na inicialização do servidor usando as opções `--plugin-load-add` (server-options.html#option_mysqld_plugin-load-add), reinicie o servidor sem essas opções.

- Se você instalou os plugins durante a execução usando `INSTALL PLUGIN`, eles permanecem instalados após a reinicialização do servidor. Para desinstalá-los, use `UNINSTALL PLUGIN`:

  ```sql
  UNINSTALL PLUGIN authentication_ldap_simple;
  UNINSTALL PLUGIN authentication_ldap_sasl;
  ```

Além disso, remova das suas configurações de inicialização no arquivo `my.cnf` quaisquer opções que definam variáveis de sistema relacionadas ao plugin LDAP.

##### LDAP Pluggable Authentication e ldap.conf

Para instalações que utilizam o OpenLDAP, o arquivo `ldap.conf` fornece configurações padrão globais para clientes LDAP. As opções podem ser definidas neste arquivo para afetar os clientes LDAP, incluindo os plugins de autenticação LDAP. O OpenLDAP utiliza as opções de configuração nesta ordem de precedência:

- Configuração especificada pelo cliente LDAP.

- Configuração especificada no arquivo `ldap.conf`. Para desabilitar o uso deste arquivo, defina a variável de ambiente `LDAPNOINIT`.

- Padrões predefinidos da biblioteca OpenLDAP embutida.

Se a biblioteca não fornecer valores adequados ou se os valores do arquivo `ldap.conf` não fornecerem valores de opção apropriados, um plugin de autenticação LDAP pode ser capaz de definir variáveis relacionadas para afetar diretamente a configuração do LDAP. Por exemplo, os plugins LDAP podem substituir os parâmetros do `ldap.conf` para a configuração TLS: as variáveis do sistema estão disponíveis para habilitar o TLS e controlar a configuração da CA, como `authentication_ldap_simple_tls` e `authentication_ldap_simple_ca_path` para autenticação LDAP simples, e `authentication_ldap_sasl_tls` e `authentication_ldap_sasl_ca_path` para autenticação LDAP SASL.

Para obter mais informações sobre `ldap.conf`, consulte a página do manual `ldap.conf(5)`.

##### Usando autenticação plugável LDAP

Esta seção descreve como habilitar contas do MySQL para se conectarem ao servidor MySQL usando autenticação compatível com LDAP. Assume-se que o servidor esteja em execução com os plugins do lado do servidor apropriados habilitados, conforme descrito em Instalando Autenticação Compatível com LDAP, e que os plugins do lado do cliente apropriados estejam disponíveis no host do cliente.

Esta seção não descreve a configuração ou administração do LDAP. Você deve estar familiarizado com esses tópicos.

Os dois plugins do lado do servidor LDAP trabalham cada um com um plugin específico do lado do cliente:

- O plugin de autenticação `authentication_ldap_simple` do lado do servidor realiza uma autenticação LDAP simples. Para conexões realizadas por contas que utilizam este plugin, os programas cliente utilizam o plugin `mysql_clear_password` do lado do cliente, que envia a senha para o servidor como texto claro. Não é utilizada hashing ou criptografia de senhas, portanto, é recomendada uma conexão segura entre o cliente e o servidor MySQL para evitar a exposição da senha.

- O plugin de autenticação `authentication_ldap_sasl` do lado do servidor realiza a autenticação LDAP baseada em SASL. Para conexões realizadas por contas que utilizam este plugin, os programas cliente utilizam o plugin `authentication_ldap_sasl_client` do lado do cliente. Os plugins SASL LDAP do lado do cliente e do servidor utilizam mensagens SASL para a transmissão segura das credenciais dentro do protocolo LDAP, para evitar o envio da senha em texto claro entre o cliente e o servidor MySQL.

Requisitos gerais para autenticação LDAP de usuários do MySQL:

- Deve haver uma entrada no diretório LDAP para cada usuário que será autenticado.

- Deve haver uma conta de usuário MySQL que especifique um plugin de autenticação LDAP no lado do servidor e, opcionalmente, nomeie o nome distinto do usuário (DN) associado ao LDAP. (Para associar um DN de usuário LDAP a uma conta MySQL, inclua uma cláusula `BY` na instrução `CREATE USER` que cria a conta.) Se uma conta não especificar uma string LDAP, a autenticação LDAP usa o nome de usuário especificado pelo cliente para encontrar a entrada LDAP.

- Os programas de cliente se conectam usando o método de conexão apropriado para o plugin de autenticação do lado do servidor que a conta do MySQL usa. Para autenticação LDAP, as conexões exigem o nome de usuário do MySQL e a senha do LDAP. Além disso, para contas que usam o plugin `authentication_ldap_simple` do lado do servidor, inicie programas de cliente com a opção `--enable-cleartext-plugin` para habilitar o plugin `mysql_clear_password` do lado do cliente.

As instruções aqui assumem o seguinte cenário:

- Os usuários do MySQL `betsy` e `boris` autenticam-se nas entradas do LDAP para `betsy_ldap` e `boris_ldap`, respectivamente. (Não é necessário que os nomes dos usuários do MySQL e do LDAP sejam diferentes. O uso de nomes diferentes nesta discussão ajuda a esclarecer se o contexto da operação é MySQL ou LDAP.)

- As entradas do LDAP usam o atributo `uid` para especificar os nomes dos usuários. Isso pode variar dependendo do servidor LDAP. Alguns servidores LDAP usam o atributo `cn` para nomes de usuário em vez de `uid`. Para alterar o atributo, modifique a variável de sistema `authentication_ldap_simple_user_search_attr` ou `authentication_ldap_sasl_user_search_attr` de forma apropriada.

- Essas entradas LDAP estão disponíveis no diretório gerenciado pelo servidor LDAP, para fornecer valores de nome distinto que identificam de forma única cada usuário:

  ```
  uid=betsy_ldap,ou=People,dc=example,dc=com
  uid=boris_ldap,ou=People,dc=example,dc=com
  ```

- As instruções `CREATE USER` que criam contas MySQL nomeiam um usuário LDAP na cláusula `BY`, para indicar qual entrada LDAP a conta MySQL autentica.

As instruções para configurar uma conta que utiliza autenticação LDAP dependem do plugin LDAP do lado do servidor utilizado. As seções a seguir descrevem vários cenários de uso.

##### Autenticação LDAP simples (sem proxy)

O procedimento descrito nesta seção exige que `authentication_ldap_simple_group_search_attr` seja definido como uma string vazia, da seguinte forma:

```sql
SET GLOBAL.authentication_ldap_simple_group_search_attr='';
```

Caso contrário, o encaminhamento é usado por padrão.

Para configurar uma conta MySQL para autenticação LDAP simples, use uma instrução `CREATE USER` para especificar o plugin `authentication_ldap_simple`, incluindo opcionalmente o nome distinto do usuário (DN) do LDAP, conforme mostrado aqui:

```sql
CREATE USER user
  IDENTIFIED WITH authentication_ldap_simple
  [BY 'LDAP user DN'];
```

Suponha que o usuário MySQL `betsy` tenha esta entrada no diretório LDAP:

```sql
uid=betsy_ldap,ou=People,dc=example,dc=com
```

Então, a declaração para criar a conta MySQL para `betsy` é a seguinte:

```sql
CREATE USER 'betsy'@'localhost'
  IDENTIFIED WITH authentication_ldap_simple
  AS 'uid=betsy_ldap,ou=People,dc=example,dc=com';
```

A string de autenticação especificada na cláusula `BY` não inclui a senha do LDAP. Ela deve ser fornecida pelo usuário cliente no momento da conexão.

Os clientes se conectam ao servidor MySQL fornecendo o nome de usuário do MySQL e a senha do LDAP, e habilitando o plugin `mysql_clear_password` no lado do cliente:

```sh
$> mysql --user=betsy --password --enable-cleartext-plugin
Enter password: betsy_ldap_password
```

Nota

O plugin de autenticação `mysql_clear_password` do lado do cliente deixa a senha intacta, então os programas do cliente enviam-na para o servidor MySQL como texto claro. Isso permite que a senha seja passada como está para o servidor LDAP. Uma senha em texto claro é necessária para usar a biblioteca LDAP do lado do servidor sem SASL, mas pode ser um problema de segurança em algumas configurações. Essas medidas minimizam o risco:

- Para tornar menos provável o uso acidental do plugin `mysql_clear_password`, os clientes MySQL devem habilitá-lo explicitamente (por exemplo, com a opção `--enable-cleartext-plugin`). Veja Seção 6.4.1.6, “Autenticação com Autenticação de Texto Aberto no Lado do Cliente”.

- Para evitar a exposição da senha com o plugin `mysql_clear_password` ativado, os clientes MySQL devem se conectar ao servidor MySQL usando uma conexão criptografada. Consulte Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas”.

O processo de autenticação ocorre da seguinte forma:

1. O plugin do lado do cliente envia `betsy` e *`betsy_password`* como o nome do usuário do cliente e a senha do LDAP para o servidor MySQL.

2. A tentativa de conexão corresponde à conta `'betsy'@'localhost'`. O plugin LDAP do lado do servidor descobre que essa conta tem uma string de autenticação de `'uid=betsy_ldap,ou=People,dc=example,dc=com'` para nomear o DN do usuário LDAP. O plugin envia essa string e a senha LDAP para o servidor LDAP.

3. O servidor LDAP encontra a entrada LDAP para `betsy_ldap` e a senha corresponde, então a autenticação LDAP é bem-sucedida.

4. A entrada LDAP não tem o atributo de grupo, então o plugin do lado do servidor retorna o nome do usuário do cliente (`betsy`) como o usuário autenticado. Esse é o mesmo nome de usuário fornecido pelo cliente, então não ocorre nenhum encaminhamento e a sessão do cliente usa a conta `'betsy'@'localhost'` para a verificação de privilégios.

Se a instrução `CREATE USER` não contivesse a cláusula `BY` para especificar o nome distinto LDAP `betsy_ldap`, as tentativas de autenticação usariam o nome de usuário fornecido pelo cliente (neste caso, `betsy`). Na ausência de uma entrada LDAP para `betsy`, a autenticação falharia.

##### Autenticação LDAP baseada em SASL (sem proxy)

O procedimento descrito nesta seção exige que `authentication_ldap_sasl_group_search_attr` seja definido como uma string vazia, da seguinte forma:

```sql
SET GLOBAL.authentication_ldap_sasl_group_search_attr='';
```

Caso contrário, o encaminhamento é usado por padrão.

Para configurar uma conta MySQL para autenticação SALS LDAP, use uma instrução `CREATE USER` para especificar o plugin `authentication_ldap_sasl`, incluindo opcionalmente o nome distinto do usuário (DN) do LDAP, conforme mostrado aqui:

```sql
CREATE USER user
  IDENTIFIED WITH authentication_ldap_sasl
  [BY 'LDAP user DN'];
```

Suponha que o usuário MySQL `boris` tenha esta entrada no diretório LDAP:

```sql
uid=boris_ldap,ou=People,dc=example,dc=com
```

Então, a declaração para criar a conta MySQL para `boris` é a seguinte:

```sql
CREATE USER 'boris'@'localhost'
  IDENTIFIED WITH authentication_ldap_sasl
  AS 'uid=boris_ldap,ou=People,dc=example,dc=com';
```

A string de autenticação especificada na cláusula `BY` não inclui a senha do LDAP. Ela deve ser fornecida pelo usuário cliente no momento da conexão.

Os clientes se conectam ao servidor MySQL fornecendo o nome de usuário do MySQL e a senha do LDAP:

```sh
$> mysql --user=boris --password
Enter password: boris_ldap_password
```

Para o plugin de autenticação `authentication_ldap_sasl` do lado do servidor, os clientes usam o plugin `authentication_ldap_sasl_client` do lado do cliente. Se um programa cliente não encontrar o plugin do lado do cliente, especifique uma opção `--plugin-dir` que nomeia o diretório onde o arquivo da biblioteca do plugin está instalado.

O processo de autenticação para `boris` é semelhante ao descrito anteriormente para `betsy`, com autenticação LDAP simples, exceto que os plugins SASL LDAP do lado do cliente e do servidor usam mensagens SASL para a transmissão segura das credenciais dentro do protocolo LDAP, para evitar o envio da senha em texto claro entre o cliente e o servidor MySQL.

##### Autenticação LDAP com Proxy

Os plugins de autenticação LDAP suportam o encaminhamento, permitindo que um usuário se conecte ao servidor MySQL como um usuário, mas assuma os privilégios de um usuário diferente. Esta seção descreve o suporte básico ao proxy de plugins LDAP. Os plugins LDAP também suportam a especificação de preferência de grupo e mapeamento de usuário proxy; consulte Especificação de Preferência e Mapeamento de Grupo de Autenticação LDAP.

A implementação de proxy descrita aqui é baseada no uso de valores de atributos de grupo LDAP para mapear usuários do MySQL que se autenticam usando LDAP para outras contas do MySQL que definem diferentes conjuntos de privilégios. Os usuários não se conectam diretamente através das contas que definem os privilégios. Em vez disso, eles se conectam através de uma conta de proxy padrão autenticada com LDAP, de modo que todos os logins externos sejam mapeados para as contas do MySQL proxy que possuem os privilégios. Qualquer usuário que se conecte usando a conta do proxy é mapeado para uma dessas contas do MySQL proxy, cujos privilégios determinam as operações de banco de dados permitidas ao usuário externo.

As instruções aqui assumem o seguinte cenário:

- As entradas LDAP usam os atributos `uid` e `cn` para especificar o nome do usuário e os valores do grupo, respectivamente. Para usar nomes de atributos de usuário e grupo diferentes, defina as variáveis de sistema específicas do plugin:

  - Para o plugin `authentication_ldap_simple`: Defina `authentication_ldap_simple_user_search_attr` e `authentication_ldap_simple_group_search_attr`.

  - Para o plugin `authentication_ldap_sasl`: Defina `authentication_ldap_sasl_user_search_attr` e `authentication_ldap_sasl_group_search_attr`.

- Essas entradas LDAP estão disponíveis no diretório gerenciado pelo servidor LDAP, para fornecer valores de nome distinto que identificam de forma única cada usuário:

  ```sql
  uid=basha,ou=People,dc=example,dc=com,cn=accounting
  uid=basil,ou=People,dc=example,dc=com,cn=front_office
  ```

  No momento da conexão, os valores do atributo de grupo se tornam os nomes dos usuários autenticados, portanto, eles nomeiam as contas proxy `accounting` e `front_office`.

- Os exemplos assumem o uso da autenticação SASL LDAP. Faça os ajustes apropriados para a autenticação LDAP simples.

Crie a conta de proxy padrão do MySQL:

```sql
CREATE USER ''@'%'
  IDENTIFIED WITH authentication_ldap_sasl;
```

A definição da conta de proxy não tem a cláusula `AS 'auth_string'` para nomear um DN de usuário LDAP. Assim:

- Quando um cliente se conecta, o nome de usuário do cliente se torna o nome de usuário do LDAP para pesquisa.

- A entrada LDAP correspondente deve incluir um atributo de grupo que nomeie a conta MySQL proxy, definindo os privilégios que o cliente deve ter.

Nota

Se a sua instalação do MySQL tiver usuários anônimos, eles podem entrar em conflito com o usuário padrão do proxy. Para obter mais informações sobre esse problema e maneiras de resolvê-lo, consulte Conflitos entre o Usuário Padrão do Proxy e o Usuário Anônimo.

Crie as contas proxy e conceda a cada uma delas os privilégios que ela deve ter:

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

As contas proxy utilizam o plugin de autenticação `mysql_no_login` para impedir que os clientes usem as contas para fazer login diretamente no servidor MySQL. Em vez disso, os usuários que se autenticam usando LDAP devem usar a conta proxy padrão `''@'%'`. (Isso pressupõe que o plugin `mysql_no_login` esteja instalado. Para instruções, consulte Seção 6.4.1.10, “Autenticação Pluggable sem Login”.) Para métodos alternativos de proteção de contas proxy contra uso direto, consulte Prevenção de Login Direto em Contas Proxy.

Atribua ao `PROXY` o privilégio à conta proxy para cada conta proxy:

```sql
GRANT PROXY
  ON 'accounting'@'localhost'
  TO ''@'%';
GRANT PROXY
  ON 'front_office'@'localhost'
  TO ''@'%';
```

Use o cliente de linha de comando **mysql** para se conectar ao servidor MySQL como `basha`.

```sh
$> mysql --user=basha --password
Enter password: basha_password (basha LDAP password)
```

A autenticação ocorre da seguinte forma:

1. O servidor autentica a conexão usando a conta de proxy padrão `''@'%'`, para o usuário do cliente `basha`.

2. A entrada LDAP correspondente é:

   ```sh
   uid=basha,ou=People,dc=example,dc=com,cn=accounting
   ```

3. A entrada LDAP correspondente tem o atributo de grupo `cn=accounting`, então `accounting` se torna o usuário autenticado proxy.

4. O usuário autenticado difere do nome de usuário do cliente `basha`, resultando em `basha` ser tratado como um proxy para `accounting`, e `basha` assumindo os privilégios da conta `accounting` proxy. A seguinte consulta retorna o resultado mostrado:

   ```sql
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-----------------+----------------------+--------------+
   | USER()          | CURRENT_USER()       | @@proxy_user |
   +-----------------+----------------------+--------------+
   | basha@localhost | accounting@localhost | ''@'%'       |
   +-----------------+----------------------+--------------+
   ```

Isso demonstra que o `basha` utiliza os privilégios concedidos à conta `accounting` MySQL proxy, e que a proxy é realizada através da conta de usuário proxy padrão.

Agora conecte-se como `basil` em vez disso:

```sh
$> mysql --user=basil --password
Enter password: basil_password (basil LDAP password)
```

O processo de autenticação para `basil` é semelhante ao descrito anteriormente para `basha`:

1. O servidor autentica a conexão usando a conta de proxy padrão `''@'%'`, para o usuário do cliente `basil`.

2. A entrada LDAP correspondente é:

   ```sh
   uid=basil,ou=People,dc=example,dc=com,cn=front_office
   ```

3. A entrada LDAP correspondente tem o atributo de grupo `cn=front_office`, então `front_office` se torna o usuário autenticado proxy.

4. O usuário autenticado difere do nome de usuário do cliente `basil`, resultando em `basil` ser tratado como um proxy para `front_office`, e `basil` assumindo os privilégios da conta `front_office` proxy. A seguinte consulta retorna o resultado mostrado:

   ```sql
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-----------------+------------------------+--------------+
   | USER()          | CURRENT_USER()         | @@proxy_user |
   +-----------------+------------------------+--------------+
   | basil@localhost | front_office@localhost | ''@'%'       |
   +-----------------+------------------------+--------------+
   ```

Isso demonstra que o `basil` utiliza os privilégios concedidos à conta MySQL `front_office` proxy e que a proxy é realizada através da conta de usuário de proxy padrão.

##### Especificação de Preferência e Mapeamento de Grupo de Autenticação LDAP

Como descrito em Autenticação LDAP com Proxy, o proxy de autenticação LDAP básico funciona com o princípio de que o plugin usa o primeiro nome de grupo retornado pelo servidor LDAP como o nome da conta de usuário proxy do MySQL. Essa capacidade simples não permite especificar nenhuma preferência sobre qual nome de grupo usar se o servidor LDAP retornar múltiplos nomes de grupo, ou especificar qualquer nome diferente do nome do grupo como o nome do usuário proxy.

A partir do MySQL 5.7.25, para contas do MySQL que utilizam autenticação LDAP, a string de autenticação pode especificar as seguintes informações para permitir maior flexibilidade de proxy:

- Uma lista de grupos em ordem de preferência, de modo que o plugin use o primeiro nome de grupo na lista que corresponda a um grupo retornado pelo servidor LDAP.

- Uma mapeo de nomes de grupos para nomes de usuários proxy, de modo que um nome de grupo, ao ser correspondido, possa fornecer um nome especificado para ser usado como o usuário proxy. Isso oferece uma alternativa ao uso do nome de grupo como usuário proxy.

Considere a seguinte definição de conta de proxy do MySQL:

```sql
CREATE USER ''@'%'
  IDENTIFIED WITH authentication_ldap_sasl
  AS '+ou=People,dc=example,dc=com#grp1=usera,grp2,grp3=userc';
```

A string de autenticação tem um sufixo de DN do usuário `ou=People,dc=example,dc=com` precedido pelo caractere `+`. Assim, conforme descrito em LDAP Authentication User DN Suffixes, o DN completo do usuário é construído a partir do sufixo do DN do usuário conforme especificado, mais o nome do usuário do cliente como o atributo `uid`.

A parte restante da string de autenticação começa com `#`, o que indica o início das informações de preferência e mapeamento do grupo. Essa parte da string de autenticação lista os nomes dos grupos na ordem `grp1`, `grp2`, `grp3`. O plugin LDAP compara essa lista com o conjunto de nomes de grupo retornados pelo servidor LDAP, procurando na ordem da lista por uma correspondência com os nomes retornados. O plugin usa a primeira correspondência, ou se não houver correspondência, a autenticação falha.

Suponha que o servidor LDAP retorne os grupos `grp3`, `grp2` e `grp7`. O plugin LDAP usa `grp2` porque é o primeiro grupo na string de autenticação que corresponde, mesmo que não seja o primeiro grupo retornado pelo servidor LDAP. Se o servidor LDAP retornar `grp4`, `grp2` e `grp1`, o plugin usa `grp1`, mesmo que `grp2` também corresponda. `grp1` tem uma precedência maior que `grp2` porque está listado anteriormente na string de autenticação.

Supondo que o plugin encontre uma correspondência com o nome do grupo, ele realiza a mapeamento desse nome de grupo para o nome de usuário proxy do MySQL, se houver. Para a conta de proxy do exemplo, o mapeamento ocorre da seguinte forma:

- Se o nome do grupo correspondente for `grp1` ou `grp3`, esses grupos estão associados à string de autenticação com os nomes de usuário `usera` e `userc`, respectivamente. O plugin usa o nome de usuário associado correspondente como o nome de usuário proxy.

- Se o nome do grupo correspondente for `grp2`, não há um nome de usuário associado na string de autenticação. O plugin usa `grp2` como o nome de usuário proxy.

Se o servidor LDAP retornar um grupo no formato DN, o plugin LDAP analisa o DN do grupo para extrair o nome do grupo.

Para especificar as preferências e informações de mapeamento do grupo LDAP, esses princípios se aplicam:

- Comece a parte de preferência e mapeamento de grupo da string de autenticação com um caractere de prefixo `#`.

- A especificação de mapeamento e preferência de grupo é uma lista de um ou mais itens, separados por vírgulas. Cada item tem a forma `grupo_nome=nome_usuario` ou *`grupo_nome`*. Os itens devem ser listados na ordem de preferência do nome do grupo. Para um nome de grupo selecionado pelo plugin como uma correspondência de um conjunto de nomes de grupo retornados pelo servidor LDAP, as duas sintaxes diferem em efeito da seguinte forma:

  - Para um item especificado como `group_name=user_name` (com um nome de usuário), o nome do grupo é mapeado para o nome de usuário, que é usado como o nome de usuário proxy do MySQL.

  - Para um item especificado como *`grupo_nome`* (sem nome de usuário), o nome do grupo é usado como o nome do usuário proxy do MySQL.

- Para citar um grupo ou nome de usuário que contenha caracteres especiais, como espaços, rodeie-os com caracteres de aspas duplas (`"`). Por exemplo, se um item tiver nomes de grupo e usuário de `meu nome de grupo` e `meu nome de usuário`, ele deve ser escrito em uma mapeia de grupo usando aspas:

  ```sql
  "my group name"="my user name"
  ```

  Se um item tiver os nomes de grupo e usuário `my_group_name` e `my_user_name` (que não contenham caracteres especiais), ele pode, mas não precisa, ser escrito com aspas. Qualquer um dos seguintes é válido:

  ```sql
  my_group_name=my_user_name
  my_group_name="my_user_name"
  "my_group_name"=my_user_name
  "my_group_name"="my_user_name"
  ```

- Para escapar de um caractere, anteceda-o com uma barra invertida (`\`). Isso é útil, em particular, para incluir uma citação dupla literal ou uma barra invertida, que, de outra forma, não são incluídas literalmente.

- O DN do usuário não precisa estar presente na string de autenticação, mas, se estiver presente, ele deve preceder a parte de preferência e mapeamento do grupo. O DN do usuário pode ser fornecido como o DN completo do usuário ou como um sufixo de DN do usuário com o caractere de prefixo `+`. (Consulte LDAP Authentication User DN Suffixes).

##### Sufixos de DN de Usuário de Autenticação LDAP

A partir do MySQL 5.7.21, os plugins de autenticação LDAP permitem que a string de autenticação que fornece informações de DN do usuário comece com o caractere de prefixo `+`:

- Na ausência de um caractere `+`, o valor da string de autenticação é tratado como está, sem modificação.

- Se a string de autenticação começar com `+`, o plugin constrói o valor completo do DN do usuário a partir do nome do usuário enviado pelo cliente, juntamente com o DN especificado na string de autenticação (com o `+` removido). No DN construído, o nome do usuário do cliente se torna o valor do atributo que especifica os nomes de usuário do LDAP. Isso é `uid` por padrão; para alterar o atributo, modifique a variável de sistema apropriada (`authentication_ldap_simple_user_search_attr` ou `authentication_ldap_sasl_user_search_attr`). A string de autenticação é armazenada conforme fornecido na tabela de sistema `mysql.user`, com o DN completo do usuário construído em tempo real antes da autenticação.

Essa string de autenticação da conta não tem `+` no início, então ela é tratada como o DN completo do usuário:

```sql
CREATE USER 'baldwin'
  IDENTIFIED WITH authentication_ldap_simple
  AS 'uid=admin,ou=People,dc=example,dc=com';
```

O cliente se conecta com o nome de usuário especificado na conta (`baldwin`). Neste caso, esse nome não é usado porque a string de autenticação não tem prefixo e, portanto, especifica completamente o DN do usuário.

Essa string de autenticação da conta tem `+` no início, então ela é considerada apenas como parte do DN do usuário:

```sql
CREATE USER 'accounting'
  IDENTIFIED WITH authentication_ldap_simple
  AS '+ou=People,dc=example,dc=com';
```

O cliente se conecta ao nome de usuário especificado na conta (`accounting`), que, neste caso, é usado como o atributo `uid`, juntamente com a string de autenticação, para construir o DN do usuário: `uid=accounting,ou=People,dc=example,dc=com`

As contas nos exemplos anteriores têm um nome de usuário não vazio, portanto, o cliente sempre se conecta ao servidor MySQL usando o mesmo nome especificado na definição da conta. Se uma conta tiver um nome de usuário vazio, como a conta anônima padrão `''@'%'` descrita em Autenticação LDAP com Proxy, os clientes podem se conectar ao servidor MySQL com nomes de usuário variados. Mas o princípio é o mesmo: se a string de autenticação começa com `+`, o plugin usa o nome de usuário enviado pelo cliente junto com a string de autenticação para construir o DN do usuário.

##### Métodos de Autenticação LDAP

Os plugins de autenticação LDAP utilizam um método de autenticação configurável. As variáveis de sistema apropriadas e as opções de método disponíveis são específicas do plugin:

- Para o plugin `authentication_ldap_simple`: Configure o método definindo a variável de sistema `authentication_ldap_simple_auth_method_name`. As opções permitidas são `SIMPLE` e `AD-FOREST`.

- Para o plugin `authentication_ldap_sasl`: Configure o método definindo a variável de sistema `authentication_ldap_sasl_auth_method_name`. A única opção permitida é `SCRAM-SHA-1`.

Consulte as descrições das variáveis do sistema para obter informações sobre cada método permitido.
