#### 8.4.1.7 Autenticação Pluggable LDAP

Nota

A autenticação plugável LDAP é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL suporta um método de autenticação que permite ao MySQL Server usar o LDAP (Lightweight Directory Access Protocol) para autenticar usuários do MySQL acessando serviços de diretório, como o X.500. O MySQL usa o LDAP para buscar informações de usuário, credenciais e grupos.

A autenticação plugável LDAP oferece essas capacidades:

- Autenticação externa: a autenticação LDAP permite que o MySQL Server aceite conexões de usuários definidos fora das tabelas de concessão do MySQL nos diretórios LDAP.

- Suporte ao usuário proxy: a autenticação LDAP pode retornar ao MySQL um nome de usuário diferente do nome de usuário externo passado pelo programa cliente, com base nos grupos LDAP dos quais o usuário externo é membro. Isso significa que um plugin LDAP pode retornar o usuário MySQL que define os privilégios que o usuário externo autenticado pelo LDAP deve ter. Por exemplo, um usuário LDAP chamado `joe` pode se conectar e ter os privilégios de um usuário MySQL chamado `developer`, se o grupo LDAP para `joe` for `developer`.

- Segurança: O uso do TLS permite que as conexões com o servidor LDAP sejam seguras.

Os plugins para servidor e cliente estão disponíveis para autenticação LDAP simples e baseada em SASL. No Microsoft Windows, o plugin para servidor de autenticação LDAP baseada em SASL não é suportado, mas o plugin para cliente é.

As tabelas a seguir mostram os nomes dos arquivos de plugin e biblioteca para autenticação LDAP simples e baseada em SASL. O sufixo do nome do arquivo pode variar no seu sistema. Os arquivos devem estar localizados no diretório nomeado pela variável de sistema `plugin_dir`.

**Tabela 8.22 Nomes de plugins e bibliotecas para autenticação LDAP simples**

<table summary="Nomes para os plugins e o arquivo de biblioteca usados para autenticação de senha LDAP simples."><thead><tr> <th>Plugin ou arquivo</th> <th>Nome do Plugin ou do Arquivo</th> </tr></thead><tbody><tr> <td>Nome do plugin no lado do servidor</td> <td>[[<code>authentication_ldap_simple</code>]]</td> </tr><tr> <td>Nome do plugin no lado do cliente</td> <td>[[<code>mysql_clear_password</code>]]</td> </tr><tr> <td>Nome do arquivo da biblioteca</td> <td>[[<code>authentication_ldap_simple.so</code>]]</td> </tr></tbody></table>

**Tabela 8.23 Nomes de plugins e bibliotecas para autenticação LDAP baseada em SASL**

<table summary="Nomes para os plugins e o arquivo de biblioteca usados para autenticação de senha com base em SASL-LDAP."><thead><tr> <th>Plugin ou arquivo</th> <th>Nome do Plugin ou do Arquivo</th> </tr></thead><tbody><tr> <td>Nome do plugin no lado do servidor</td> <td>[[<code>authentication_ldap_sasl</code>]]</td> </tr><tr> <td>Nome do plugin no lado do cliente</td> <td>[[<code>authentication_ldap_sasl_client</code>]]</td> </tr><tr> <td>Nomes de arquivos da biblioteca</td> <td>[[<code>authentication_ldap_sasl.so</code>]], [[<code>authentication_ldap_sasl_client.so</code>]]</td> </tr></tbody></table>

Os arquivos da biblioteca incluem apenas os plugins de autenticação `authentication_ldap_XXX`. O plugin `mysql_clear_password` do lado do cliente está integrado à biblioteca do cliente `libmysqlclient`.

Cada plugin do lado do servidor LDAP funciona com um plugin específico do lado do cliente:

- O plugin `authentication_ldap_simple` do lado do servidor realiza a autenticação LDAP simples. Para conexões por contas que utilizam este plugin, os programas cliente utilizam o plugin `mysql_clear_password` do lado do cliente, que envia a senha para o servidor como texto claro. Não é utilizada a hash ou criptografia da senha, portanto, uma conexão segura entre o cliente e o servidor MySQL é recomendada para evitar a exposição da senha.

- O plugin `authentication_ldap_sasl` do lado do servidor realiza a autenticação LDAP com base em SASL. Para conexões realizadas por contas que utilizam este plugin, os programas cliente utilizam o plugin `authentication_ldap_sasl_client` do lado do cliente. Os plugins SASL LDAP do lado do cliente e do lado do servidor utilizam mensagens SASL para a transmissão segura das credenciais dentro do protocolo LDAP, para evitar o envio da senha em texto claro entre o cliente e o servidor MySQL.

  Nota

  No Microsoft Windows, o plugin do servidor para autenticação LDAP baseada em SASL não é suportado, mas o plugin do cliente é suportado. Em outras plataformas, os plugins do servidor e do cliente são suportados.

Os plugins de autenticação LDAP no lado do servidor estão incluídos apenas na Edição Empresarial do MySQL. Eles não estão incluídos nas distribuições comunitárias do MySQL. O plugin SASL LDAP no lado do cliente está incluído em todas as distribuições, incluindo as comunitárias, e, como mencionado anteriormente, o plugin `mysql_clear_password` no lado do cliente está integrado à biblioteca de clientes `libmysqlclient`, que também está incluída em todas as distribuições. Isso permite que clientes de qualquer distribuição se conectem a um servidor que tenha o plugin no lado do servidor apropriado carregado.

As seções a seguir fornecem informações de instalação e uso específicas para autenticação plugável LDAP:

- Pré-requisitos para autenticação compatível com LDAP
- Como funciona a autenticação LDAP de usuários do MySQL
- Instalando Autenticação Conectada LDAP
- Desinstalação do LDAP Pluggable Authentication
- LDAP Pluggable Authentication e ldap.conf
- Usando autenticação plugável LDAP
- Autenticação LDAP simples (sem proxy) ")
- Autenticação LDAP baseada em SASL (sem proxy)
- Autenticação LDAP com Proxy
- Especificação de Preferência e Mapeamento de Grupo de Autenticação LDAP
- Sufixos de DN de Usuário de Autenticação LDAP
- Métodos de Autenticação LDAP
- O método de autenticação GSSAPI/Kerberos
- Referência de pesquisa LDAP

Para informações gerais sobre autenticação plugável no MySQL, consulte a Seção 8.2.17, “Autenticação Plugável”. Para informações sobre o plugin `mysql_clear_password`, consulte a Seção 8.4.1.4, “Autenticação Plugável em Texto Não Encriptado no Lado do Cliente”. Para informações sobre usuários de proxy, consulte a Seção 8.2.19, “Usuários de Proxy”.

Nota

Se o seu sistema suportar o PAM e permitir o LDAP como método de autenticação PAM, outra maneira de usar o LDAP para autenticação de usuários do MySQL é usar o plugin `authentication_pam` no lado do servidor. Veja a Seção 8.4.1.5, “Autenticação Extensível por PAM”.

##### Pré-requisitos para autenticação compatível com LDAP

Para usar a autenticação de pluggable LDAP para MySQL, é necessário que os seguintes pré-requisitos sejam atendidos:

- Um servidor LDAP deve estar disponível para que os plugins de autenticação LDAP possam se comunicar.

- Os usuários do LDAP que devem ser autenticados pelo MySQL devem estar presentes no diretório gerenciado pelo servidor LDAP.

- Uma biblioteca de cliente LDAP deve estar disponível nos sistemas onde o plugin `authentication_ldap_sasl` ou `authentication_ldap_simple` do lado do servidor é usado. Atualmente, as bibliotecas suportadas são a biblioteca nativa LDAP do Windows ou a biblioteca OpenLDAP em sistemas que não são do Windows.

- Para usar a autenticação LDAP baseada em SASL:

  - O servidor LDAP deve ser configurado para se comunicar com um servidor SASL.

  - Uma biblioteca de cliente SASL deve estar disponível nos sistemas onde o plugin `authentication_ldap_sasl_client` do lado do cliente é usado. Atualmente, a única biblioteca suportada é a biblioteca Cyrus SASL.

  - Para usar um método de autenticação SASL específico, todos os outros serviços necessários para esse método devem estar disponíveis. Por exemplo, para usar o GSSAPI/Kerberos, uma biblioteca GSSAPI e serviços Kerberos devem estar disponíveis.

##### Como funciona a autenticação LDAP de usuários do MySQL

Esta seção fornece uma visão geral de como o MySQL e o LDAP trabalham juntos para autenticar usuários do MySQL. Para exemplos que mostram como configurar contas do MySQL para usar plugins de autenticação LDAP específicos, consulte Usar plugins de autenticação legáveis LDAP. Para informações sobre os métodos de autenticação disponíveis para os plugins LDAP, consulte Métodos de Autenticação LDAP.

O cliente se conecta ao servidor MySQL, fornecendo o nome de usuário e a senha do cliente do MySQL:

- Para a autenticação LDAP simples, os plugins do lado do cliente e do lado do servidor comunicam a senha em texto claro. Uma conexão segura entre o cliente e o servidor MySQL é recomendada para evitar a exposição da senha.

- Para a autenticação LDAP baseada em SASL, os plugins do lado do cliente e do servidor evitam enviar a senha em texto claro entre o cliente e o servidor MySQL. Por exemplo, os plugins podem usar mensagens SASL para a transmissão segura de credenciais dentro do protocolo LDAP. Para o método de autenticação GSSAPI, os plugins do lado do cliente e do servidor se comunicam de forma segura usando o Kerberos sem usar diretamente mensagens LDAP.

Se o nome de usuário e o nome do host do cliente não corresponderem a nenhuma conta MySQL, a conexão é rejeitada.

Se houver uma conta MySQL correspondente, a autenticação no LDAP ocorre. O servidor LDAP procura uma entrada que corresponda ao usuário e autentica a entrada contra a senha do LDAP:

- Se a conta do MySQL nomear o nome distinto (DN) de um usuário do LDAP, a autenticação do LDAP usará esse valor e a senha do LDAP fornecida pelo cliente. (Para associar um DN de usuário do LDAP a uma conta do MySQL, inclua uma cláusula `BY` que especifique uma string de autenticação na declaração `CREATE USER` que cria a conta.)

- Se a conta MySQL não especificar um DN de usuário LDAP, a autenticação LDAP usa o nome do usuário e a senha LDAP fornecidos pelo cliente. Nesse caso, o plugin de autenticação se vincula primeiro ao servidor LDAP usando o DN raiz e a senha como credenciais para encontrar o DN do usuário com base no nome do usuário do cliente, e depois autentica esse DN do usuário contra a senha LDAP. Esse vínculo usando as credenciais raiz falha se o DN raiz e a senha estiverem configurados com valores incorretos ou estiverem vazios (não configurados) e o servidor LDAP não permitir conexões anônimas.

Se o servidor LDAP não encontrar nenhuma correspondência ou múltiplas correspondências, a autenticação falha e a conexão do cliente é rejeitada.

Se o servidor LDAP encontrar uma única correspondência, a autenticação LDAP terá sucesso (assumindo que a senha está correta), o servidor LDAP retorna a entrada LDAP e o plugin de autenticação determina o nome do usuário autenticado com base nessa entrada:

- Se a entrada LDAP tiver um atributo de grupo (por padrão, o atributo `cn`), o plugin retornará seu valor como o nome do usuário autenticado.

- Se a entrada LDAP não tiver o atributo de grupo, o plugin de autenticação retornará o nome do usuário do cliente como o nome do usuário autenticado.

O servidor MySQL compara o nome do usuário do cliente com o nome do usuário autenticado para determinar se ocorre o encaminhamento para a sessão do cliente:

- Se os nomes forem os mesmos, não ocorrerá nenhum encaminhamento: a conta MySQL que corresponde ao nome do usuário do cliente será usada para a verificação de privilégios.

- Se os nomes forem diferentes, ocorre o encaminhamento: o MySQL procura uma conta que corresponda ao nome do usuário autenticado. Essa conta se torna o usuário encaminhado, que é usado para verificar privilégios. A conta do MySQL que correspondeu ao nome do usuário do cliente é tratada como o usuário do proxy externo.

##### Instalando Autenticação Conectada LDAP

Esta seção descreve como instalar os plugins de autenticação LDAP no lado do servidor. Para informações gerais sobre como instalar plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para que o plugin seja utilizável pelo servidor, os arquivos da biblioteca do plugin devem estar localizados no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin configurando o valor de `plugin_dir` durante o início do servidor.

Os nomes de arquivo da biblioteca de plugins do lado do servidor são `authentication_ldap_simple` e `authentication_ldap_sasl`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Nota

No Microsoft Windows, o plugin do servidor para autenticação LDAP baseada em SASL não é suportado, mas o plugin do cliente é suportado. Em outras plataformas, os plugins do servidor e do cliente são suportados.

Para carregar os plugins na inicialização do servidor, use as opções `--plugin-load-add` para nomear os arquivos da biblioteca que os contêm. Com esse método de carregamento de plugins, as opções devem ser fornecidas toda vez que o servidor for iniciado. Além disso, especifique valores para quaisquer variáveis de sistema fornecidas pelo plugin que você deseja configurar.

Cada plugin LDAP do lado do servidor expõe um conjunto de variáveis de sistema que permitem a configuração de sua operação. A maioria dessas variáveis é opcional, mas você deve definir as variáveis que especificam o host do servidor LDAP (para que o plugin saiba onde se conectar) e o nome distinto da base para operações de vinculação LDAP (para limitar o escopo das pesquisas e obter pesquisas mais rápidas). Para obter detalhes sobre todas as variáveis de sistema LDAP, consulte a Seção 8.4.1.13, “Variáveis do Sistema de Autenticação Conectada”.

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

Após modificar `my.cnf`, reinicie o servidor para que as novas configurações entrem em vigor.

Alternativamente, para carregar os plugins em tempo de execução, use essas declarações, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
INSTALL PLUGIN authentication_ldap_simple
  SONAME 'authentication_ldap_simple.so';
INSTALL PLUGIN authentication_ldap_sasl
  SONAME 'authentication_ldap_sasl.so';
```

`INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela do sistema `mysql.plugins`, fazendo com que o servidor o carregue para cada inicialização normal subsequente, sem a necessidade de `--plugin-load-add`.

Após a instalação dos plugins em tempo de execução, as variáveis de sistema que eles exibem ficam disponíveis e você pode adicionar configurações para eles ao seu arquivo `my.cnf` para configurar os plugins para reinicializações subsequentes. Por exemplo:

```
[mysqld]
authentication_ldap_simple_server_host=127.0.0.1
authentication_ldap_simple_bind_base_dn="dc=example,dc=com"
authentication_ldap_sasl_server_host=127.0.0.1
authentication_ldap_sasl_bind_base_dn="dc=example,dc=com"
```

Após modificar `my.cnf`, reinicie o servidor para que as novas configurações entrem em vigor.

Para definir e manter cada valor em tempo de execução, em vez de no momento do início, use essas instruções:

```
SET PERSIST authentication_ldap_simple_server_host='127.0.0.1';
SET PERSIST authentication_ldap_simple_bind_base_dn='dc=example,dc=com';
SET PERSIST authentication_ldap_sasl_server_host='127.0.0.1';
SET PERSIST authentication_ldap_sasl_bind_base_dn='dc=example,dc=com';
```

`SET PERSIST` define um valor para a instância do MySQL em execução. Ele também salva o valor, fazendo com que ele seja carregado em reinicializações subsequentes do servidor. Para alterar um valor para a instância do MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`. Veja a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a instrução `SHOW PLUGINS` (consulte a Seção 7.6.2, “Obtendo Informações do Plugin do Servidor”). Por exemplo:

```
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

Para associar contas do MySQL a um plugin LDAP, consulte Usar autenticação compatível com LDAP.

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

   ```
   checkmodule -M -m mysqlldap.te -o mysqlldap.mod
   ```

3. Crie um pacote de módulo de política SELinux:

   ```
   semodule_package -m mysqlldap.mod  -o mysqlldap.pp
   ```

4. Instale o pacote do módulo:

   ```
   semodule -i mysqlldap.pp
   ```

5. Quando as alterações nas políticas do SELinux forem feitas, reinicie o servidor MySQL:

   ```
   service mysqld restart
   ```

##### Desinstalação do LDAP Pluggable Authentication

O método usado para desinstalar os plugins de autenticação LDAP depende de como você os instalou:

- Se você instalou os plugins na inicialização do servidor usando as opções `--plugin-load-add`, reinicie o servidor sem essas opções.

- Se você instalou os plugins durante a execução usando `INSTALL PLUGIN`, eles permanecem instalados após a reinicialização do servidor. Para desinstalá-los, use `UNINSTALL PLUGIN`:

  ```
  UNINSTALL PLUGIN authentication_ldap_simple;
  UNINSTALL PLUGIN authentication_ldap_sasl;
  ```

Além disso, remova das suas `my.cnf` qualquer opção de inicialização que defina variáveis de sistema relacionadas ao plugin LDAP. Se você usou `SET PERSIST` para persistir variáveis de sistema LDAP, use `RESET PERSIST` para remover as configurações.

##### LDAP Pluggable Authentication e ldap.conf

Para instalações que utilizam o OpenLDAP, o arquivo `ldap.conf` fornece configurações padrão globais para clientes LDAP. As opções podem ser definidas neste arquivo para afetar os clientes LDAP, incluindo os plugins de autenticação LDAP. O OpenLDAP utiliza as opções de configuração nesta ordem de precedência:

- Configuração especificada pelo cliente LDAP.

- Configuração especificada no arquivo `ldap.conf`. Para desabilitar o uso deste arquivo, defina a variável de ambiente `LDAPNOINIT`.

- Padrões predefinidos da biblioteca OpenLDAP embutida.

Se os valores padrão da biblioteca ou os valores de `ldap.conf` não gerarem valores de opção apropriados, um plugin de autenticação LDAP pode ser capaz de definir variáveis relacionadas para afetar diretamente a configuração do LDAP. Por exemplo, os plugins LDAP podem substituir `ldap.conf` para parâmetros como estes:

- Configuração TLS: As variáveis do sistema estão disponíveis para habilitar o TLS e controlar a configuração da CA, como `authentication_ldap_simple_tls` e `authentication_ldap_simple_ca_path` para autenticação LDAP simples e `authentication_ldap_sasl_tls` e `authentication_ldap_sasl_ca_path` para autenticação LDAP SASL.

- Referência LDAP. Veja Referência de Pesquisa LDAP.

Para mais informações sobre `ldap.conf`, consulte a página de manual `ldap.conf(5)`.

##### Usando autenticação plugável LDAP

Esta seção descreve como habilitar contas do MySQL para se conectarem ao servidor MySQL usando autenticação compatível com LDAP. Assume-se que o servidor esteja em execução com os plugins do lado do servidor apropriados habilitados, conforme descrito em Instalar Autenticação Compatível com LDAP, e que os plugins do lado do cliente apropriados estejam disponíveis no host do cliente.

Esta seção não descreve a configuração ou administração do LDAP. Você deve estar familiarizado com esses tópicos.

Os dois plugins do lado do servidor LDAP trabalham cada um com um plugin específico do lado do cliente:

- O plugin `authentication_ldap_simple` do lado do servidor realiza a autenticação LDAP simples. Para conexões por contas que utilizam este plugin, os programas cliente utilizam o plugin `mysql_clear_password` do lado do cliente, que envia a senha para o servidor como texto claro. Não é utilizada a hash ou criptografia da senha, portanto, uma conexão segura entre o cliente e o servidor MySQL é recomendada para evitar a exposição da senha.

- O plugin `authentication_ldap_sasl` do lado do servidor realiza a autenticação LDAP com base em SASL. Para conexões realizadas por contas que utilizam este plugin, os programas cliente utilizam o plugin `authentication_ldap_sasl_client` do lado do cliente. Os plugins SASL LDAP do lado do cliente e do lado do servidor utilizam mensagens SASL para a transmissão segura das credenciais dentro do protocolo LDAP, para evitar o envio da senha em texto claro entre o cliente e o servidor MySQL.

Requisitos gerais para autenticação LDAP de usuários do MySQL:

- Deve haver uma entrada no diretório LDAP para cada usuário que será autenticado.

- Deve haver uma conta de usuário MySQL que especifique um plugin de autenticação LDAP no lado do servidor e, opcionalmente, nomeie o nome distinto do usuário (DN) associado ao LDAP. (Para associar um DN de usuário LDAP a uma conta MySQL, inclua uma cláusula `BY` na instrução `CREATE USER` que cria a conta.) Se uma conta não especificar uma string LDAP, a autenticação LDAP usa o nome de usuário especificado pelo cliente para encontrar a entrada LDAP.

- Os programas de cliente se conectam usando o método de conexão apropriado para o plugin de autenticação do lado do servidor que a conta do MySQL usa. Para autenticação LDAP, as conexões exigem o nome de usuário do MySQL e a senha do LDAP. Além disso, para contas que usam o plugin `authentication_ldap_simple` do lado do servidor, invoque programas de cliente com a opção `--enable-cleartext-plugin` para habilitar o plugin `mysql_clear_password` do lado do cliente.

As instruções aqui assumem o seguinte cenário:

- Os usuários do MySQL `betsy` e `boris` autenticam-se nas entradas do LDAP para `betsy_ldap` e `boris_ldap`, respectivamente. (Não é necessário que os nomes dos usuários do MySQL e do LDAP sejam diferentes. O uso de nomes diferentes nesta discussão ajuda a esclarecer se o contexto da operação é MySQL ou LDAP.)

- As entradas do LDAP usam o atributo `uid` para especificar os nomes dos usuários. Isso pode variar dependendo do servidor LDAP. Alguns servidores LDAP usam o atributo `cn` para nomes de usuário em vez de `uid`. Para alterar o atributo, modifique a variável de sistema `authentication_ldap_simple_user_search_attr` ou `authentication_ldap_sasl_user_search_attr` conforme apropriado.

- Essas entradas LDAP estão disponíveis no diretório gerenciado pelo servidor LDAP, para fornecer valores de nome distinto que identificam de forma única cada usuário:

  ```
  uid=betsy_ldap,ou=People,dc=example,dc=com
  uid=boris_ldap,ou=People,dc=example,dc=com
  ```

- As declarações `CREATE USER` que criam contas MySQL nomeiam um usuário LDAP na cláusula `BY`, para indicar qual entrada LDAP a conta MySQL autentica.

As instruções para configurar uma conta que utiliza autenticação LDAP dependem do plugin LDAP do lado do servidor utilizado. As seções a seguir descrevem vários cenários de uso.

##### Autenticação LDAP simples (sem proxy)

O procedimento descrito nesta seção exige que `authentication_ldap_simple_group_search_attr` seja definido como uma string vazia, da seguinte forma:

```
SET GLOBAL.authentication_ldap_simple_group_search_attr='';
```

Caso contrário, o encaminhamento é usado por padrão.

Para configurar uma conta MySQL para autenticação simples LDAP, use uma declaração `CREATE USER` para especificar o plugin `authentication_ldap_simple`, incluindo opcionalmente o nome distinto do usuário LDAP (DN), conforme mostrado aqui:

```
CREATE USER user
  IDENTIFIED WITH authentication_ldap_simple
  [BY 'LDAP user DN'];
```

Suponha que o usuário MySQL `betsy` tenha esta entrada no diretório LDAP:

```
uid=betsy_ldap,ou=People,dc=example,dc=com
```

Então, a declaração para criar a conta MySQL para `betsy` é a seguinte:

```
CREATE USER 'betsy'@'localhost'
  IDENTIFIED WITH authentication_ldap_simple
  AS 'uid=betsy_ldap,ou=People,dc=example,dc=com';
```

A string de autenticação especificada na cláusula `BY` não inclui a senha do LDAP. Ela deve ser fornecida pelo usuário cliente no momento da conexão.

Os clientes se conectam ao servidor MySQL fornecendo o nome de usuário do MySQL e a senha do LDAP, e habilitando o plugin `mysql_clear_password` no lado do cliente:

```
$> mysql --user=betsy --password --enable-cleartext-plugin
Enter password: betsy_ldap_password
```

Nota

O plugin de autenticação `mysql_clear_password` do lado do cliente deixa a senha intacta, então os programas do cliente enviam-na para o servidor MySQL como texto claro. Isso permite que a senha seja passada como está para o servidor LDAP. Uma senha em texto claro é necessária para usar a biblioteca LDAP do lado do servidor sem SASL, mas pode ser um problema de segurança em algumas configurações. Essas medidas minimizam o risco:

- Para tornar menos provável o uso acidental do plugin `mysql_clear_password`, os clientes do MySQL devem habilitá-lo explicitamente (por exemplo, com a opção `--enable-cleartext-plugin`). Veja a Seção 8.4.1.4, “Autenticação Personalizável de Texto Aberto no Lado do Cliente”.

- Para evitar a exposição da senha com o plugin `mysql_clear_password` ativado, os clientes do MySQL devem se conectar ao servidor MySQL usando uma conexão criptografada. Veja a Seção 8.3.1, “Configurando o MySQL para usar conexões criptografadas”.

O processo de autenticação ocorre da seguinte forma:

1. O plugin do lado do cliente envia `betsy` e `betsy_password` como o nome do usuário do cliente e a senha do LDAP para o servidor MySQL.

2. A tentativa de conexão corresponde à conta `'betsy'@'localhost'`. O plugin LDAP do lado do servidor descobre que essa conta tem uma string de autenticação de `'uid=betsy_ldap,ou=People,dc=example,dc=com'` para nomear o DN do usuário LDAP. O plugin envia essa string e a senha LDAP para o servidor LDAP.

3. O servidor LDAP encontra a entrada LDAP para `betsy_ldap` e a senha corresponde, então a autenticação LDAP é bem-sucedida.

4. A entrada LDAP não tem o atributo de grupo, então o plugin do lado do servidor retorna o nome do usuário do cliente (`betsy`) como o usuário autenticado. Esse é o mesmo nome de usuário fornecido pelo cliente, então não ocorre nenhum encaminhamento e a sessão do cliente usa a conta `'betsy'@'localhost'` para a verificação de privilégios.

Se a declaração `CREATE USER` não contivesse nenhuma cláusula `BY` para especificar o nome distinto LDAP `betsy_ldap`, as tentativas de autenticação usariam o nome de usuário fornecido pelo cliente (neste caso, `betsy`). Na ausência de uma entrada LDAP para `betsy`, a autenticação falharia.

##### Autenticação LDAP baseada em SASL (sem proxy)

O procedimento descrito nesta seção exige que `authentication_ldap_sasl_group_search_attr` seja definido como uma string vazia, da seguinte forma:

```
SET GLOBAL.authentication_ldap_sasl_group_search_attr='';
```

Caso contrário, o encaminhamento é usado por padrão.

Para configurar uma conta MySQL para autenticação LDAP do SALS, use uma instrução `CREATE USER` para especificar o plugin `authentication_ldap_sasl`, incluindo opcionalmente o nome distinto do usuário (DN) do LDAP, conforme mostrado aqui:

```
CREATE USER user
  IDENTIFIED WITH authentication_ldap_sasl
  [BY 'LDAP user DN'];
```

Suponha que o usuário MySQL `boris` tenha esta entrada no diretório LDAP:

```
uid=boris_ldap,ou=People,dc=example,dc=com
```

Então, a declaração para criar a conta MySQL para `boris` é a seguinte:

```
CREATE USER 'boris'@'localhost'
  IDENTIFIED WITH authentication_ldap_sasl
  AS 'uid=boris_ldap,ou=People,dc=example,dc=com';
```

A string de autenticação especificada na cláusula `BY` não inclui a senha do LDAP. Ela deve ser fornecida pelo usuário cliente no momento da conexão.

Os clientes se conectam ao servidor MySQL fornecendo o nome de usuário do MySQL e a senha do LDAP:

```
$> mysql --user=boris --password
Enter password: boris_ldap_password
```

Para o plugin `authentication_ldap_sasl` do lado do servidor, os clientes usam o plugin `authentication_ldap_sasl_client` do lado do cliente. Se um programa de cliente não encontrar o plugin do lado do cliente, especifique uma opção `--plugin-dir` que nomeie o diretório onde o arquivo da biblioteca do plugin está instalado.

O processo de autenticação para `boris` é semelhante ao descrito anteriormente para `betsy`, com autenticação LDAP simples, exceto que os plugins SASL LDAP do lado do cliente e do servidor usam mensagens SASL para a transmissão segura das credenciais dentro do protocolo LDAP, para evitar o envio da senha em texto claro entre o cliente e o servidor MySQL.

##### Autenticação LDAP com Proxy

Os plugins de autenticação LDAP suportam o encaminhamento, permitindo que um usuário se conecte ao servidor MySQL como um usuário, mas assuma os privilégios de um usuário diferente. Esta seção descreve o suporte básico ao proxy de plugins LDAP. Os plugins LDAP também suportam a especificação da preferência do grupo e o mapeamento do usuário proxy; consulte Especificação de Preferência e Mapeamento de Preferência de Grupo de Autenticação LDAP.

A implementação de proxy descrita aqui é baseada no uso de valores de atributos de grupo LDAP para mapear usuários do MySQL que se autenticam usando LDAP para outras contas do MySQL que definem diferentes conjuntos de privilégios. Os usuários não se conectam diretamente através das contas que definem os privilégios. Em vez disso, eles se conectam através de uma conta de proxy padrão autenticada com LDAP, de modo que todos os logins externos sejam mapeados para as contas do MySQL proxy que possuem os privilégios. Qualquer usuário que se conecte usando a conta do proxy é mapeado para uma dessas contas do MySQL proxy, cujos privilégios determinam as operações de banco de dados permitidas ao usuário externo.

As instruções aqui assumem o seguinte cenário:

- As entradas LDAP usam os atributos `uid` e `cn` para especificar o nome do usuário e os valores do grupo, respectivamente. Para usar nomes de atributos de usuário e grupo diferentes, defina as variáveis de sistema específicas do plugin:

  - Para o plugin `authentication_ldap_simple`: Defina `authentication_ldap_simple_user_search_attr` e `authentication_ldap_simple_group_search_attr`.

  - Para o plugin `authentication_ldap_sasl`: Defina `authentication_ldap_sasl_user_search_attr` e `authentication_ldap_sasl_group_search_attr`.

- Essas entradas LDAP estão disponíveis no diretório gerenciado pelo servidor LDAP, para fornecer valores de nome distinto que identificam de forma única cada usuário:

  ```
  uid=basha,ou=People,dc=example,dc=com,cn=accounting
  uid=basil,ou=People,dc=example,dc=com,cn=front_office
  ```

  No momento da conexão, os valores do atributo de grupo se tornam os nomes dos usuários autenticados, portanto, eles nomeiam as contas proxy `accounting` e `front_office`.

- Os exemplos assumem o uso da autenticação SASL LDAP. Faça os ajustes apropriados para a autenticação LDAP simples.

Crie a conta de proxy padrão do MySQL:

```
CREATE USER ''@'%'
  IDENTIFIED WITH authentication_ldap_sasl;
```

A definição da conta de proxy não possui a cláusula `AS 'auth_string'` para nomear um DN de usuário LDAP. Assim:

- Quando um cliente se conecta, o nome de usuário do cliente se torna o nome de usuário do LDAP para pesquisa.

- A entrada LDAP correspondente deve incluir um atributo de grupo que nomeie a conta MySQL proxy, definindo os privilégios que o cliente deve ter.

Nota

Se a sua instalação do MySQL tiver usuários anônimos, eles podem entrar em conflito com o usuário padrão do proxy. Para obter mais informações sobre esse problema e maneiras de resolvê-lo, consulte Usuário padrão do proxy e conflitos com usuários anônimos.

Crie as contas proxy e conceda a cada uma delas os privilégios que ela deve ter:

```
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

As contas proxy utilizam o plugin de autenticação `mysql_no_login` para impedir que os clientes usem as contas para fazer login diretamente no servidor MySQL. Em vez disso, os usuários que se autenticam usando LDAP devem usar a conta proxy padrão `''@'%'`. (Isso pressupõe que o plugin `mysql_no_login` esteja instalado. Para instruções, consulte a Seção 8.4.1.9, “Autenticação Plugável sem Login”.) Para métodos alternativos de proteção das contas proxy contra o uso direto, consulte Como Proteger Contas Proxy contra Login Direto.

Conceda ao \[`PROXY`] privilégio para a conta de proxy para cada conta proxy:

```
GRANT PROXY
  ON 'accounting'@'localhost'
  TO ''@'%';
GRANT PROXY
  ON 'front_office'@'localhost'
  TO ''@'%';
```

Use o cliente de linha de comando **mysql** para se conectar ao servidor MySQL como `basha`.

```
$> mysql --user=basha --password
Enter password: basha_password (basha LDAP password)
```

A autenticação ocorre da seguinte forma:

1. O servidor autentica a conexão usando a conta de proxy padrão `''@'%'`, para o usuário do cliente `basha`.

2. A entrada LDAP correspondente é:

   ```
   uid=basha,ou=People,dc=example,dc=com,cn=accounting
   ```

3. A entrada LDAP correspondente tem o atributo de grupo `cn=accounting`, então `accounting` se torna o usuário autenticado proxy.

4. O usuário autenticado difere do nome de usuário do cliente `basha`, resultando em `basha` ser tratado como um proxy para `accounting`, e `basha` assumindo os privilégios da conta `accounting` proxy. A seguinte consulta retorna o resultado conforme mostrado:

   ```
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-----------------+----------------------+--------------+
   | USER()          | CURRENT_USER()       | @@proxy_user |
   +-----------------+----------------------+--------------+
   | basha@localhost | accounting@localhost | ''@'%'       |
   +-----------------+----------------------+--------------+
   ```

Isso demonstra que o `basha` utiliza os privilégios concedidos à conta MySQL `accounting` proxy, e que a proxy é realizada através da conta de usuário do proxy padrão.

Agora conecte como `basil` em vez disso:

```
$> mysql --user=basil --password
Enter password: basil_password (basil LDAP password)
```

O processo de autenticação para `basil` é semelhante ao descrito anteriormente para `basha`:

1. O servidor autentica a conexão usando a conta de proxy padrão `''@'%'`, para o usuário do cliente `basil`.

2. A entrada LDAP correspondente é:

   ```
   uid=basil,ou=People,dc=example,dc=com,cn=front_office
   ```

3. A entrada LDAP correspondente tem o atributo de grupo `cn=front_office`, então `front_office` se torna o usuário autenticado proxy.

4. O usuário autenticado difere do nome de usuário do cliente `basil`, resultando em `basil` ser tratado como um proxy para `front_office`, e `basil` assumindo os privilégios da conta `front_office` proxy. A seguinte consulta retorna o resultado conforme mostrado:

   ```
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-----------------+------------------------+--------------+
   | USER()          | CURRENT_USER()         | @@proxy_user |
   +-----------------+------------------------+--------------+
   | basil@localhost | front_office@localhost | ''@'%'       |
   +-----------------+------------------------+--------------+
   ```

Isso demonstra que o `basil` utiliza os privilégios concedidos à conta MySQL `front_office` proxy, e que a proxy é realizada através da conta de usuário do proxy padrão.

##### Especificação de Preferência e Mapeamento de Grupo de Autenticação LDAP

Como descrito na Autenticação LDAP com Proxy, o proxy de autenticação básica LDAP funciona com o princípio de que o plugin usa o primeiro nome de grupo retornado pelo servidor LDAP como o nome da conta de usuário proxy do MySQL. Essa capacidade simples não permite especificar nenhuma preferência sobre qual nome de grupo usar se o servidor LDAP retornar múltiplos nomes de grupo, ou especificar qualquer nome diferente do nome do grupo como o nome do usuário proxy.

A partir do MySQL 8.0.14, para contas do MySQL que utilizam autenticação LDAP, a string de autenticação pode especificar as seguintes informações para permitir maior flexibilidade de proxy:

- Uma lista de grupos em ordem de preferência, de modo que o plugin use o primeiro nome de grupo na lista que corresponda a um grupo retornado pelo servidor LDAP.

- Uma mapeo de nomes de grupos para nomes de usuários proxy, de modo que um nome de grupo, ao ser correspondido, possa fornecer um nome especificado para ser usado como o usuário proxy. Isso oferece uma alternativa ao uso do nome de grupo como usuário proxy.

Considere a seguinte definição de conta de proxy do MySQL:

```
CREATE USER ''@'%'
  IDENTIFIED WITH authentication_ldap_sasl
  AS '+ou=People,dc=example,dc=com#grp1=usera,grp2,grp3=userc';
```

A string de autenticação tem um sufixo DN do usuário `ou=People,dc=example,dc=com` prefixado pelo caractere `+`. Assim, conforme descrito na Autenticação LDAP, o sufixo DN do usuário é construído a partir do sufixo DN do usuário conforme especificado, mais o nome do usuário do cliente como o atributo `uid`.

A parte restante da string de autenticação começa com `#`, o que indica o início das informações de preferência e mapeamento do grupo. Essa parte da string de autenticação lista os nomes dos grupos na ordem `grp1`, `grp2`, `grp3`. O plugin LDAP compara essa lista com o conjunto de nomes de grupos retornados pelo servidor LDAP, procurando na ordem da lista por uma correspondência com os nomes retornados. O plugin usa a primeira correspondência, ou se não houver correspondência, a autenticação falha.

Suponha que o servidor LDAP retorne os grupos `grp3`, `grp2` e `grp7`. O plugin LDAP usa `grp2` porque é o primeiro grupo na string de autenticação que corresponde, mesmo que não seja o primeiro grupo retornado pelo servidor LDAP. Se o servidor LDAP retornar `grp4`, `grp2` e `grp1`, o plugin usa `grp1` mesmo que `grp2` também corresponda. `grp1` tem uma precedência maior que `grp2` porque está listado anteriormente na string de autenticação.

Supondo que o plugin encontre uma correspondência com o nome do grupo, ele realiza a mapeamento desse nome de grupo para o nome de usuário proxy do MySQL, se houver. Para a conta de proxy do exemplo, o mapeamento ocorre da seguinte forma:

- Se o nome do grupo correspondente for `grp1` ou `grp3`, esses são associados à string de autenticação com os nomes de usuário `usera` e `userc`, respectivamente. O plugin usa o nome de usuário associado correspondente como o nome de usuário proxy.

- Se o nome do grupo correspondente for `grp2`, não há nome de usuário associado na string de autenticação. O plugin usa `grp2` como o nome de usuário proxy.

Se o servidor LDAP retornar um grupo no formato DN, o plugin LDAP analisa o DN do grupo para extrair o nome do grupo.

Para especificar as preferências e informações de mapeamento do grupo LDAP, esses princípios se aplicam:

- Comece a parte de preferência de grupo e mapeamento da string de autenticação com o caractere de prefixo `#`.

- A especificação de preferência e mapeamento do grupo é uma lista de um ou mais itens, separados por vírgulas. Cada item tem a forma `group_name=user_name` ou *\[\[`group_name`]*. Os itens devem ser listados na ordem de preferência do nome do grupo. Para um nome de grupo selecionado pelo plugin como uma correspondência de um conjunto de nomes de grupo retornados pelo servidor LDAP, as duas sintaxes diferem em efeito da seguinte forma:

  - Para um item especificado como `group_name=user_name` (com um nome de usuário), o nome do grupo corresponde ao nome do usuário, que é usado como o nome de usuário proxy do MySQL.

  - Para um item especificado como `group_name` (sem nome de usuário), o nome do grupo é usado como nome de usuário proxy do MySQL.

- Para citar um grupo ou nome de usuário que contenha caracteres especiais, como espaços, rodeie-os com caracteres de aspas duplas (`"`). Por exemplo, se um item tiver nomes de grupo e usuário de `my group name` e `my user name`, ele deve ser escrito em uma mapeia de grupo usando aspas:

  ```
  "my group name"="my user name"
  ```

  Se um item tiver nomes de grupo e usuário de `my_group_name` e `my_user_name` (que não contenham caracteres especiais), ele pode, mas não precisa ser escrito com aspas. Qualquer um dos seguintes é válido:

  ```
  my_group_name=my_user_name
  my_group_name="my_user_name"
  "my_group_name"=my_user_name
  "my_group_name"="my_user_name"
  ```

- Para escapar de um caractere, anteceda-o com uma barra invertida (`\`). Isso é útil, em particular, para incluir uma citação dupla literal ou uma barra invertida, que, de outra forma, não são incluídas literalmente.

- O DN do usuário não precisa estar presente na string de autenticação, mas, se estiver presente, ele deve preceder a parte de preferência e mapeamento do grupo. O DN do usuário pode ser fornecido como o DN completo do usuário ou como um sufixo do DN do usuário com o caractere de prefixo `+`. (Consulte Sufixos de DN do Usuário de Autenticação LDAP.)

##### Sufixos de DN de Usuário de Autenticação LDAP

Os plugins de autenticação LDAP permitem que a string de autenticação que fornece informações de DN do usuário comece com o caractere de prefixo `+`:

- Na ausência de um caractere `+`, o valor da string de autenticação é tratado como está, sem modificação.

- Se a string de autenticação começar com `+`, o plugin constrói o valor completo do DN do usuário a partir do nome do usuário enviado pelo cliente, juntamente com o DN especificado na string de autenticação (com o `+` removido). No DN construído, o nome do usuário do cliente se torna o valor do atributo que especifica os nomes de usuário do LDAP. Isso é `uid` por padrão; para alterar o atributo, modifique a variável de sistema apropriada (`authentication_ldap_simple_user_search_attr` ou `authentication_ldap_sasl_user_search_attr`). A string de autenticação é armazenada conforme especificado na tabela de sistema `mysql.user`, com o DN completo do usuário construído em tempo real antes da autenticação.

Essa string de autenticação da conta não tem `+` no início, então ela é tratada como o DN completo do usuário:

```
CREATE USER 'baldwin'
  IDENTIFIED WITH authentication_ldap_simple
  AS 'uid=admin,ou=People,dc=example,dc=com';
```

O cliente se conecta com o nome de usuário especificado na conta (`baldwin`). Neste caso, esse nome não é usado porque a string de autenticação não tem prefixo e, portanto, especifica completamente o DN do usuário.

Essa string de autenticação da conta tem `+` no início, então ela é considerada apenas como parte do DN do usuário:

```
CREATE USER 'accounting'
  IDENTIFIED WITH authentication_ldap_simple
  AS '+ou=People,dc=example,dc=com';
```

O cliente se conecta com o nome de usuário especificado na conta (`accounting`), que, neste caso, é usado como o atributo `uid` juntamente com a string de autenticação para construir o DN do usuário: `uid=accounting,ou=People,dc=example,dc=com`

As contas nos exemplos anteriores têm um nome de usuário não vazio, portanto, o cliente sempre se conecta ao servidor MySQL usando o mesmo nome especificado na definição da conta. Se uma conta tiver um nome de usuário vazio, como a conta anônima padrão `''@'%'` descrita na Autenticação LDAP com Proxy, os clientes podem se conectar ao servidor MySQL com nomes de usuário variados. Mas o princípio é o mesmo: se a string de autenticação começa com `+`, o plugin usa o nome de usuário enviado pelo cliente junto com a string de autenticação para construir o DN do usuário.

##### Métodos de Autenticação LDAP

Os plugins de autenticação LDAP utilizam um método de autenticação configurável. As variáveis de sistema apropriadas e as opções de método disponíveis são específicas do plugin:

- Para o plugin `authentication_ldap_simple`: Defina a variável de sistema `authentication_ldap_simple_auth_method_name` para configurar o método. As opções permitidas são `SIMPLE` e `AD-FOREST`.

- Para o plugin `authentication_ldap_sasl`: Defina a variável de sistema `authentication_ldap_sasl_auth_method_name` para configurar o método. As opções permitidas são `SCRAM-SHA-1`, `SCRAM-SHA-256` e `GSSAPI`. (Para determinar quais métodos SASL LDAP estão realmente disponíveis no sistema do host, verifique o valor da variável de status `Authentication_ldap_sasl_supported_methods`.

Consulte as descrições das variáveis do sistema para obter informações sobre cada método permitido. Além disso, dependendo do método, pode ser necessário realizar configurações adicionais, conforme descrito nas seções a seguir.

##### O método de autenticação GSSAPI/Kerberos

A Interface de Programação de Serviço de Segurança Genérico (GSSAPI) é uma interface de abstração de segurança. O Kerberos é uma instância de um protocolo de segurança específico que pode ser usado por meio dessa interface abstrata. Usando o GSSAPI, os aplicativos autenticam-se no Kerberos para obter credenciais de serviço e, em seguida, usam essas credenciais para habilitar o acesso seguro a outros serviços.

Um desses serviços é o LDAP, que é utilizado pelos plugins de autenticação SASL LDAP do lado do cliente e do lado do servidor. Quando a variável de sistema `authentication_ldap_sasl_auth_method_name` é definida como `GSSAPI`, esses plugins utilizam o método de autenticação GSSAPI/Kerberos. Nesse caso, os plugins se comunicam de forma segura usando o Kerberos sem utilizar diretamente mensagens LDAP. O plugin do lado do servidor, então, se comunica com o servidor LDAP para interpretar mensagens de autenticação LDAP e recuperar grupos LDAP.

O GSSAPI/Kerberos é suportado como um método de autenticação LDAP para servidores e clientes MySQL no Linux. É útil em ambientes Linux onde as aplicações têm acesso ao LDAP por meio do Microsoft Active Directory, que tem o Kerberos habilitado por padrão.

A discussão a seguir fornece informações sobre os requisitos de configuração para usar o método GSSAPI. Assume-se que o leitor tem familiaridade com os conceitos e funcionamento do Kerberos. A lista a seguir define brevemente vários termos comuns do Kerberos. Você também pode achar útil a seção Glossário do RFC 4120.

- Principal: Uma entidade nomeada, como um usuário ou servidor.

- KDC: O centro de distribuição de chaves, que inclui o AS e o TGS:

  - AS: O servidor de autenticação; fornece o ticket inicial de concessão de ticket necessário para obter tickets adicionais.

  - TGS: O servidor de concessão de ingressos; fornece ingressos adicionais aos clientes do Kerberos que possuem um TGT válido.

- TGT: O bilhete de concessão de passagem; apresentado ao TGS para obter passagens de serviço para o acesso ao serviço.

A autenticação LDAP usando Kerberos requer tanto um servidor KDC quanto um servidor LDAP. Essa exigência pode ser atendida de diferentes maneiras:

- O Active Directory inclui tanto servidores, com autenticação Kerberos habilitada por padrão no servidor Active Directory LDAP.

- O OpenLDAP fornece um servidor LDAP, mas pode ser necessário um servidor KDC separado, com configuração adicional do Kerberos necessária.

O Kerberos também deve estar disponível no host do cliente. Um cliente entra em contato com o AS usando uma senha para obter um TGT. O cliente, em seguida, usa o TGT para obter acesso do TGS a outros serviços, como o LDAP.

As seções a seguir discutem os passos de configuração para usar o GSSAPI/Kerberos para autenticação SASL LDAP no MySQL:

- Verifique a disponibilidade do Kerberos e do LDAP
- Configure o plugin de autenticação LDAP SASL do lado do servidor para GSSAPI/Kerberos
- Crie uma conta MySQL que use GSSAPI/Kerberos para autenticação LDAP
- Use a Conta MySQL para se conectar ao servidor MySQL
- Parâmetros de configuração do cliente para autenticação LDAP

###### Verifique a disponibilidade do Kerberos e do LDAP

O exemplo a seguir mostra como testar a disponibilidade do Kerberos no Active Directory. O exemplo faz as seguintes suposições:

- O Active Directory está sendo executado no host com o nome `ldap_auth.example.com` e o endereço IP `198.51.100.10`.

- A autenticação Kerberos e as consultas LDAP relacionadas ao MySQL usam o domínio `MYSQL.LOCAL`.

- Um principal chamado `bredon@MYSQL.LOCAL` está registrado no KDC. (Em uma discussão posterior, esse nome do principal também está associado à conta MySQL que autentica-se no servidor MySQL usando GSSAPI/Kerberos.)

Com essas suposições atendidas, siga este procedimento:

1. Verifique se a biblioteca Kerberos está instalada e configurada corretamente no sistema operacional. Por exemplo, para configurar um domínio `MYSQL.LOCAL` para uso durante a autenticação do MySQL, o arquivo de configuração `/etc/krb5.conf` Kerberos deve conter algo como:

   ```
   [realms]
     MYSQL.LOCAL = {
       kdc = ldap_auth.example.com
       admin_server = ldap_auth.example.com
       default_domain = MYSQL.LOCAL
     }
   ```

2. Você pode precisar adicionar uma entrada para `/etc/hosts` para o host do servidor:

   ```
   198.51.100.10 ldap_auth ldap_auth.example.com
   ```

3. Verifique se a autenticação Kerberos funciona corretamente:

   1. Use **kinit** para autenticar-se no Kerberos:

      ```
      $> kinit bredon@MYSQL.LOCAL
      Password for bredon@MYSQL.LOCAL: (enter password here)
      ```

      O comando autentica o principal Kerberos chamado \[\[`bredon@MYSQL.LOCAL`]. Quando o comando solicitar a senha do principal, insira-a. O KDC retorna um TGT que é armazenado em cache no lado do cliente para uso por outros aplicativos que reconhecem o Kerberos.

   2. Use o comando **klist** para verificar se o TGT foi obtido corretamente. A saída deve ser semelhante a esta:

      ```
      $> klist
      Ticket cache: FILE:/tmp/krb5cc_244306
      Default principal: bredon@MYSQL.LOCAL

      Valid starting       Expires              Service principal
      03/23/2021 08:18:33  03/23/2021 18:18:33  krbtgt/MYSQL.LOCAL@MYSQL.LOCAL
      ```

4. Verifique se o **ldapsearch** funciona com o TGT Kerberos usando este comando, que busca por usuários no domínio `MYSQL.LOCAL`:

   ```
   ldapsearch -h 198.51.100.10 -Y GSSAPI -b "dc=MYSQL,dc=LOCAL"
   ```

###### Configure o plugin de autenticação LDAP SASL do lado do servidor para GSSAPI/Kerberos

Supondo que o servidor LDAP seja acessível através do Kerberos, conforme descrito anteriormente, configure o plugin de autenticação LDAP SASL no lado do servidor para usar o método de autenticação GSSAPI/Kerberos. (Para informações gerais sobre a instalação do plugin LDAP, consulte Instalar o LDAP Pluggable Authentication.) Aqui está um exemplo de configurações relacionadas ao plugin que o arquivo `my.cnf` do servidor pode conter:

```
[mysqld]
plugin-load-add=authentication_ldap_sasl.so
authentication_ldap_sasl_auth_method_name="GSSAPI"
authentication_ldap_sasl_server_host=198.51.100.10
authentication_ldap_sasl_server_port=389
authentication_ldap_sasl_bind_root_dn="cn=admin,cn=users,dc=MYSQL,dc=LOCAL"
authentication_ldap_sasl_bind_root_pwd="password"
authentication_ldap_sasl_bind_base_dn="cn=users,dc=MYSQL,dc=LOCAL"
authentication_ldap_sasl_user_search_attr="sAMAccountName"
```

Essas configurações do arquivo de opções configuram o plugin SASL LDAP da seguinte forma:

- A opção `--plugin-load-add` carrega o plugin (ajuste o sufixo `.so` para sua plataforma conforme necessário). Se você carregou o plugin anteriormente usando uma declaração `INSTALL PLUGIN`, essa opção é desnecessária.

- `authentication_ldap_sasl_auth_method_name` deve ser definido como `GSSAPI` para usar o GSSAPI/Kerberos como método de autenticação LDAP SASL.

- `authentication_ldap_sasl_server_host` e `authentication_ldap_sasl_server_port` indicam o endereço IP e o número de porta do host do servidor do Active Directory para autenticação.

- `authentication_ldap_sasl_bind_root_dn` e `authentication_ldap_sasl_bind_root_pwd` configuram o DN raiz e a senha para a capacidade de busca de grupos. Essa capacidade é necessária, mas os usuários podem não ter privilégios para fazer a busca. Nesses casos, é necessário fornecer informações sobre o DN raiz:

  - Na opção valor DN, `admin` deve ser o nome de uma conta administrativa LDAP que tenha privilégios para realizar pesquisas de usuários.

  - No valor da opção de senha, `password` deve ser a senha da conta `admin`.

- `authentication_ldap_sasl_bind_base_dn` indica o caminho base do DN do usuário, para que as pesquisas procurem usuários no domínio `MYSQL.LOCAL`.

- `authentication_ldap_sasl_user_search_attr` especifica um atributo padrão de pesquisa do Active Directory, `sAMAccountName`. Este atributo é usado em pesquisas para corresponder a nomes de logon; os valores do atributo não são os mesmos que os valores do DN do usuário.

###### Crie uma conta MySQL que use GSSAPI/Kerberos para autenticação LDAP

A autenticação do MySQL usando o plugin de autenticação SASL LDAP com o método GSSAPI/Kerberos é baseada em um usuário que é uma principal Kerberos. A discussão a seguir usa uma principal chamada `bredon@MYSQL.LOCAL` como esse usuário, que deve estar registrado em vários lugares:

- O administrador do Kerberos deve registrar o nome do usuário como um principal do Kerberos. Esse nome deve incluir um nome de domínio. Os clientes usam o nome do principal e a senha para se autenticar com o Kerberos e obter um TGT.

- O administrador do LDAP deve registrar o nome do usuário em uma entrada do LDAP. Por exemplo:

  ```
  uid=bredon,dc=MYSQL,dc=LOCAL
  ```

  Nota

  No Active Directory (que usa Kerberos como método de autenticação padrão), ao criar um usuário, são criadas tanto a principal Kerberos quanto a entrada LDAP.

- O DBA do MySQL deve criar uma conta com o nome do principal Kerberos como nome de usuário e que autentique usando o plugin SASL LDAP.

Suponha que o principal Kerberos e a entrada LDAP tenham sido registrados pelos administradores do serviço apropriados, e que, conforme descrito anteriormente em Instalar o plugin de autenticação LDAP pluagável para GSSAPI/Kerberos e Configurar o plugin de autenticação LDAP SASL no lado do servidor para GSSAPI/Kerberos, o servidor MySQL tenha sido iniciado com as configurações apropriadas para o plugin LDAP SASL no lado do servidor. O DBA do MySQL então cria uma conta MySQL que corresponde ao nome do principal Kerberos, incluindo o nome do domínio.

Nota

O plugin SASL LDAP usa um DN de usuário constante para autenticação Kerberos e ignora qualquer DN de usuário configurado a partir do MySQL. Isso tem certas implicações:

- Para qualquer conta MySQL que use autenticação GSSAPI/Kerberos, a string de autenticação nas instruções `CREATE USER` ou `ALTER USER` não deve conter o DN do usuário, pois ele não tem efeito.

- Como a string de autenticação não contém o DN do usuário, ela deve conter informações de mapeamento de grupo, para permitir que o usuário seja tratado como um usuário proxy mapeado para o usuário desejado que está sendo proxy. Para obter informações sobre o proxy com o plugin de autenticação LDAP, consulte Autenticação LDAP com Proxy.

As seguintes declarações criam um usuário proxy chamado `bredon@MYSQL.LOCAL` que assume os privilégios do usuário proxy chamado `proxied_krb_usr`. Outros usuários do GSSAPI/Kerberos que devem ter os mesmos privilégios podem ser criados de maneira semelhante como usuários proxy para o mesmo usuário proxy.

```
-- create proxy account
CREATE USER 'bredon@MYSQL.LOCAL'
  IDENTIFIED WITH authentication_ldap_sasl
  BY '#krb_grp=proxied_krb_user';

-- create proxied account and grant its privileges;
-- use mysql_no_login plugin to prevent direct login
CREATE USER 'proxied_krb_user'
  IDENTIFIED WITH mysql_no_login;
GRANT ALL
  ON krb_user_db.*
  TO 'proxied_krb_user';

-- grant to proxy account the
-- PROXY privilege for proxied account
GRANT PROXY
  ON 'proxied_krb_user'
  TO 'bredon@MYSQL.LOCAL';
```

Observe atentamente a citação para o nome da conta de proxy na primeira declaração `CREATE USER` e na declaração `GRANT PROXY`:

- Para a maioria das contas do MySQL, o usuário e o host são partes separadas do nome da conta e, portanto, são citados separadamente como `'user_name'@'host_name'`.

- Para autenticação LDAP Kerberos, a parte do usuário do nome da conta inclui o domínio principal, então `'bredon@MYSQL.LOCAL'` é citado como um único valor. Como não há parte de host fornecida, o nome completo da conta MySQL usa o padrão `'%'` como parte do host: `'bredon@MYSQL.LOCAL'@'%'`

Nota

Ao criar uma conta que autentica usando o plugin de autenticação SASL LDAP `authentication_ldap_sasl` com o método de autenticação GSSAPI/Kerberos, a declaração `CREATE USER` inclui o domínio como parte do nome do usuário. Isso difere da criação de contas que usam o plugin Kerberos `authentication_kerberos`. Para tais contas, a declaração `CREATE USER` não inclui o domínio como parte do nome do usuário. Em vez disso, especifique o domínio como a string de autenticação na cláusula `BY`. Veja Como criar uma conta MySQL que usa autenticação Kerberos.

A conta proxy usa o plugin de autenticação `mysql_no_login` para impedir que os clientes usem a conta para fazer login diretamente no servidor MySQL. Em vez disso, espera-se que os usuários que se autentiquem usando LDAP usem a conta de proxy `bredon@MYSQL.LOCAL`. (Isso pressupõe que o plugin `mysql_no_login` esteja instalado. Para instruções, consulte a Seção 8.4.1.9, “Autenticação Plugável sem Login”.) Para métodos alternativos de proteção de contas proxy contra uso direto, consulte Como Proteger Contas Proxy contra Login Direto.

###### Use a Conta MySQL para se conectar ao servidor MySQL

Depois que uma conta MySQL que autentica usando GSSAPI/Kerberos é configurada, os clientes podem usá-la para se conectar ao servidor MySQL. A autenticação Kerberos pode ocorrer antes ou no momento da invocação do programa cliente MySQL:

- Antes de invocar o programa cliente MySQL, o usuário do cliente pode obter um TGT do KDC de forma independente do MySQL. Por exemplo, o usuário do cliente pode usar **kinit** para autenticar-se no Kerberos fornecendo um nome de principal Kerberos e a senha da principal:

  ```
  $> kinit bredon@MYSQL.LOCAL
  Password for bredon@MYSQL.LOCAL: (enter password here)
  ```

  O TGT resultante é armazenado na cache e torna-se disponível para uso por outros aplicativos que reconhecem o Kerberos, como programas que utilizam o plugin de autenticação SASL LDAP no lado do cliente. Nesse caso, o programa cliente do MySQL autentica-se no servidor MySQL usando o TGT, então invoque o cliente sem especificar um nome de usuário ou senha:

  ```
  mysql --default-auth=authentication_ldap_sasl_client
  ```

  Como descrito anteriormente, quando o TGT é armazenado na cache, as opções de nome de usuário e senha não são necessárias no comando do cliente. Se o comando incluir essas opções, elas serão tratadas da seguinte forma:

  - Se o comando incluir um nome de usuário, a autenticação falhará se esse nome não corresponder ao nome principal no TGT.

  - Se o comando incluir uma senha, o plugin do lado do cliente a ignora. Como a autenticação é baseada no TGT, ele pode ser bem-sucedido *mesmo que a senha fornecida pelo usuário esteja incorreta*. Por essa razão, o plugin emite um aviso se um TGT válido for encontrado, o que faz com que a senha seja ignorada.

- Se o cache Kerberos não contiver TGT, o próprio plugin de autenticação SASL LDAP do lado do cliente pode obter o TGT do KDC. Inicie o cliente com as opções para o nome e a senha do principal Kerberos associado à conta MySQL (insira o comando em uma única linha, em seguida, insira a senha do principal quando solicitado):

  ```
  mysql --default-auth=authentication_ldap_sasl_client
    --user=bredon@MYSQL.LOCAL
    --password
  ```

- Se o cache do Kerberos não contiver TGT e o comando do cliente não especificar nenhum nome de principal como nome de usuário, a autenticação falhará.

Se você não tiver certeza se um TGT existe, você pode usar o **klist** para verificar.

A autenticação ocorre da seguinte forma:

1. O cliente usa o TGT para autenticar-se com o Kerberos.

2. O servidor encontra a entrada LDAP para o principal e usa-a para autenticar a conexão da conta do proxy MySQL `bredon@MYSQL.LOCAL`.

3. A informação de mapeamento do grupo na string de autenticação da conta proxy (`'#krb_grp=proxied_krb_user'`) indica que o usuário autenticado proxy deve ser `proxied_krb_user`.

4. `bredon@MYSQL.LOCAL` é tratado como um proxy para `proxied_krb_user`, e a seguinte consulta retorna o resultado conforme mostrado:

   ```
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +------------------------------+--------------------+--------------------------+
   | USER()                       | CURRENT_USER()     | @@proxy_user             |
   +------------------------------+--------------------+--------------------------+
   | bredon@MYSQL.LOCAL@localhost | proxied_krb_user@% | 'bredon@MYSQL.LOCAL'@'%' |
   +------------------------------+--------------------+--------------------------+
   ```

   O valor `USER()` indica o nome do usuário usado para o comando do cliente (`bredon@MYSQL.LOCAL`) e o host a partir do qual o cliente se conectou (`localhost`).

   O valor `CURRENT_USER()` é o nome completo da conta de usuário proxy, que consiste na parte de usuário `proxied_krb_user` e na parte de host `%`.

   O valor `@@proxy_user` indica o nome completo da conta usada para fazer a conexão com o servidor MySQL, que consiste na parte de usuário `bredon@MYSQL.LOCAL` e na parte de host `%`.

   Isso demonstra que a proxy ocorre através da conta de usuário proxy `bredon@MYSQL.LOCAL` e que `bredon@MYSQL.LOCAL` assume os privilégios concedidos à conta de usuário proxy `proxied_krb_user`.

Um TGT obtido uma vez é armazenado no lado do cliente e pode ser usado até expirar sem precisar ser especificado novamente. No entanto, independentemente de como o TGT é obtido, o plugin do lado do cliente o usa para adquirir ingressos de serviço e se comunicar com o plugin do lado do servidor.

Nota

Quando o próprio plugin de autenticação do lado do cliente obtém o TGT, o usuário do cliente pode não querer que o TGT seja reutilizado. Como descrito nos Parâmetros de Configuração do Cliente para Autenticação LDAP, o arquivo local `/etc/krb5.conf` pode ser usado para fazer com que o plugin do lado do cliente destrua o TGT quando ele estiver pronto para ser usado.

O plugin do lado do servidor não tem acesso ao TGT em si ou à senha do Kerberos usada para obtê-lo.

Os plugins de autenticação LDAP não têm controle sobre o mecanismo de cache (armazenamento em um arquivo local, na memória, etc.), mas as ferramentas Kerberos, como o **kswitch**, podem estar disponíveis para esse propósito.

###### Parâmetros de configuração do cliente para autenticação LDAP

O plugin SASL LDAP do lado do cliente `authentication_ldap_sasl_client` lê o arquivo local `/etc/krb5.conf`. Se este arquivo estiver ausente ou inacessível, ocorrerá um erro. Supondo que o arquivo esteja acessível, ele pode incluir uma seção opcional `[appdefaults]` para fornecer informações usadas pelo plugin. Coloque as informações dentro da parte `mysql` da seção. Por exemplo:

```
[appdefaults]
  mysql = {
    ldap_server_host = "ldap_host.example.com"
    ldap_destroy_tgt = true
  }
```

O plugin do lado do cliente reconhece esses parâmetros na seção `mysql`:

- O valor `ldap_server_host` especifica o host do servidor LDAP e pode ser útil quando esse host difere do host do servidor KDC especificado na seção `[realms]`. Por padrão, o plugin usa o host do servidor KDC como o host do servidor LDAP.

- O valor `ldap_destroy_tgt` indica se o plugin do lado do cliente destrói o TGT após obtê-lo e usá-lo. Por padrão, `ldap_destroy_tgt` é `false`, mas pode ser definido como `true` para evitar a reutilização do TGT. (Essa configuração aplica-se apenas aos TGTs criados pelo plugin do lado do cliente, e não aos TGTs criados por outros plugins ou externamente ao MySQL.)

##### Referência de pesquisa LDAP

Um servidor LDAP pode ser configurado para delegar pesquisas LDAP para outro servidor LDAP, uma funcionalidade conhecida como referência LDAP. Suponha que o servidor `a.example.com` possua um DN raiz `"dc=example,dc=com"` e queira delegar pesquisas para outro servidor `b.example.com`. Para habilitar isso, `a.example.com` seria configurado com um objeto de referência nomeado com esses atributos:

```
dn: dc=subtree,dc=example,dc=com
objectClass: referral
objectClass: extensibleObject
dc: subtree
ref: ldap://b.example.com/dc=subtree,dc=example,dc=com
```

Um problema ao habilitar a referência LDAP é que as pesquisas podem falhar com erros de operação do LDAP quando a base de busca DN é o DN raiz e os objetos de referência não estão configurados. Um DBA do MySQL pode querer evitar tais erros de referência para os plugins de autenticação LDAP, mesmo que a referência LDAP possa estar configurada globalmente no arquivo de configuração `ldap.conf`. Para configurar, em uma base de plugin específica, se o servidor LDAP deve usar a referência LDAP ao se comunicar com cada plugin, defina as variáveis de sistema `authentication_ldap_simple_referral` e `authentication_ldap_sasl_referral`. Definir qualquer uma das variáveis para `ON` ou `OFF` faz com que o plugin de autenticação LDAP correspondente informe ao servidor LDAP se deve usar a referência durante a autenticação do MySQL. Cada variável tem um efeito específico para o plugin e não afeta outras aplicações que se comunicam com o servidor LDAP. Ambas as variáveis são `OFF` por padrão.
