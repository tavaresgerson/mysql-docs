#### 8.4.1.7 Autenticação Pluggable LDAP

::: info Nota

A autenticação pluggable LDAP é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

:::

A Edição Empresarial do MySQL suporta um método de autenticação que permite ao MySQL Server usar o LDAP (Lightweight Directory Access Protocol) para autenticar usuários do MySQL acessando serviços de diretório como X.500. O MySQL usa o LDAP para buscar informações de usuário, credencial e grupo.

A autenticação pluggable LDAP oferece essas capacidades:

* Autenticação externa: a autenticação LDAP permite que o MySQL Server aceite conexões de usuários definidos fora das tabelas de concessão do MySQL nos diretórios LDAP.
* Suporte a usuários proxy: a autenticação LDAP pode retornar ao MySQL um nome de usuário diferente do nome de usuário externo passado pelo programa cliente, com base nos grupos LDAP dos quais o usuário externo é membro. Isso significa que um plugin LDAP pode retornar o usuário MySQL que define os privilégios que o usuário LDAP autenticado externo deve ter. Por exemplo, um usuário LDAP chamado `joe` pode se conectar e ter os privilégios de um usuário MySQL chamado `developer`, se o grupo LDAP para `joe` for `developer`.
* Segurança: usando TLS, as conexões ao servidor LDAP podem ser seguras.

Plugins para servidor e cliente estão disponíveis para autenticação LDAP simples e baseada em SASL. No Microsoft Windows, o plugin para servidor de autenticação LDAP baseada em SASL não é suportado, mas o plugin para cliente é.

As seguintes tabelas mostram os nomes dos arquivos de plugin e biblioteca para autenticação LDAP simples e baseada em SASL. O sufixo do nome do arquivo pode diferir no seu sistema. Os arquivos devem estar localizados no diretório nomeado pela variável de sistema `plugin_dir`.

**Tabela 8.20 Nomes de Plugin e Biblioteca para Autenticação LDAP Simples**

<table><thead><tr> <th>Plugin ou Arquivo</th> <th>Nome do Plugin ou Arquivo</th> </tr></thead><tbody><tr> <td>Nome do plugin do lado do servidor</td> <td><code>authentication_ldap_simple</code></td> </tr><tr> <td>Nome do plugin do lado do cliente</td> <td><code>mysql_clear_password</code></td> </tr><tr> <td>Nome do arquivo da biblioteca</td> <td><code>authentication_ldap_simple.so</code></td> </tr></tbody></table>

**Tabela 8.21 Nomes de Plugins e Bibliotecas para Autenticação LDAP Baseada em SASL**

<table><thead><tr> <th>Plugin ou Arquivo</th> <th>Nome do Plugin ou Arquivo</th> </tr></thead><tbody><tr> <td>Nome do plugin do lado do servidor</td> <td><code>authentication_ldap_sasl</code></td> </tr><tr> <td>Nome do plugin do lado do cliente</td> <td><code>authentication_ldap_sasl_client</code></td> </tr><tr> <td>Nomes dos arquivos da biblioteca</td> <td><code>authentication_ldap_sasl.so</code>, <code>authentication_ldap_sasl_client.so</code></td> </tr></tbody></table>

Os arquivos da biblioteca incluem apenas os plugins de autenticação `authentication_ldap_XXX`. O plugin `mysql_clear_password` do lado do cliente está integrado à biblioteca de cliente `libmysqlclient`.

Cada plugin LDAP do lado do servidor funciona com um plugin do lado do cliente específico:

* O plugin `authentication_ldap_simple` do lado do servidor realiza a autenticação LDAP simples. Para conexões por contas que usam este plugin, os programas do cliente usam o plugin do lado do cliente `mysql_clear_password`, que envia a senha para o servidor como texto claro. Nenhuma hash ou criptografia de senha é usada, portanto, uma conexão segura entre o cliente MySQL e o servidor é recomendada para evitar a exposição da senha.
* O plugin `authentication_ldap_sasl` do lado do servidor realiza a autenticação LDAP baseada em SASL. Para conexões por contas que usam este plugin, os programas do cliente usam o plugin do lado do cliente `authentication_ldap_sasl_client`. Os plugins SASL LDAP do lado do cliente e do servidor usam mensagens SASL para a transmissão segura de credenciais dentro do protocolo LDAP, para evitar a transmissão do texto claro da senha entre o cliente MySQL e o servidor.

Nas plataformas Microsoft Windows, tanto o plugin do servidor quanto o plugin do cliente são suportados para autenticação LDAP baseada em SASL.

Os plugins de autenticação LDAP do lado do servidor estão incluídos apenas na Edição Empresarial do MySQL. Eles não estão incluídos nas distribuições comunitárias do MySQL. O plugin SASL LDAP do lado do cliente está incluído em todas as distribuições, incluindo as distribuições comunitárias, e, como mencionado anteriormente, o plugin `mysql_clear_password` do lado do cliente está embutido na biblioteca de clientes `libmysqlclient`, que também está incluída em todas as distribuições. Isso permite que clientes de qualquer distribuição se conectem a um servidor que tenha o plugin do lado do servidor apropriado carregado.

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação de plugabilidade LDAP:

*  Pré-requisitos para Autenticação de Plugabilidade LDAP
*  Como a Autenticação LDAP de Usuários do MySQL Funciona
*  Instalando Autenticação de Plugabilidade LDAP
*  Desinstalando Autenticação de Plugabilidade LDAP
*  Autenticação de Plugabilidade LDAP e ldap.conf
*  Definindo Limites de Tempo para Autenticação de Plugabilidade LDAP
*  Usando Autenticação de Plugabilidade LDAP
*  Autenticação LDAP Simples (Sem Proxy)")
*  Autenticação LDAP Baseada em SASL (Sem Proxy)")
*  Autenticação LDAP com Proxy
*  Especificação de Preferência e Mapeamento de Grupo de Autenticação LDAP
*  Sufixos de DN de Usuário de Autenticação LDAP
*  Métodos de Autenticação LDAP
*  O Método de Autenticação GSSAPI/Kerberos
*  Referência de Busca LDAP

Para informações gerais sobre plugabilidade de autenticação no MySQL, consulte a Seção 8.2.17, “Plugabilidade de Autenticação”. Para informações sobre o plugin `mysql_clear_password`, consulte a Seção 8.4.1.4, “Autenticação de Plugabilidade de Texto em Texto do Lado do Cliente”. Para informações sobre usuários proxy, consulte a Seção 8.2.19, “Usuários Proxy”.

::: info Nota
Português (Brasil)

Se o seu sistema suportar o PAM e permitir o LDAP como método de autenticação PAM, outra maneira de usar o LDAP para autenticação de usuários do MySQL é usar o plugin `authentication_pam` do lado do servidor. Veja a Seção 8.4.1.5, “Autenticação Conectada ao PAM”.

:::

##### Pré-requisitos para Autenticação Conectada ao LDAP

Para usar a autenticação conectada ao LDAP para o MySQL, esses pré-requisitos devem ser atendidos:

* Um servidor LDAP deve estar disponível para que os plugins de autenticação LDAP possam se comunicar.
* Os usuários LDAP que serão autenticados pelo MySQL devem estar presentes no diretório gerenciado pelo servidor LDAP.
* Uma biblioteca de clientes LDAP deve estar disponível nos sistemas onde o plugin `authentication_ldap_sasl` ou `authentication_ldap_simple` do lado do servidor é usado. Atualmente, as bibliotecas suportadas são a biblioteca nativa do Windows LDAP ou a biblioteca OpenLDAP em sistemas que não são do Windows.
* Para usar a autenticação LDAP baseada em SASL:

  + O servidor LDAP deve ser configurado para se comunicar com um servidor SASL.
  + Uma biblioteca de clientes SASL deve estar disponível nos sistemas onde o plugin `authentication_ldap_sasl_client` do lado do cliente é usado. Atualmente, a única biblioteca suportada é a biblioteca Cyrus SASL.
  + Para usar um método de autenticação SASL específico, quaisquer outros serviços necessários para esse método devem estar disponíveis. Por exemplo, para usar o GSSAPI/Kerberos, uma biblioteca GSSAPI e serviços Kerberos devem estar disponíveis.

##### Como a Autenticação LDAP de Usuários do MySQL Funciona

Esta seção fornece uma visão geral de como o MySQL e o LDAP trabalham juntos para autenticar usuários do MySQL. Para exemplos que mostram como configurar contas do MySQL para usar plugins de autenticação LDAP específicos, consulte Usar Autenticação Conectada ao PAM. Para informações sobre os métodos de autenticação disponíveis para os plugins LDAP, consulte Métodos de Autenticação LDAP.

O cliente se conecta ao servidor MySQL, fornecendo o nome de usuário e uma senha do cliente do MySQL:

* Para autenticação LDAP simples, os plugins do lado do cliente e do servidor comunicam a senha em texto claro. Uma conexão segura entre o cliente e o servidor MySQL é recomendada para evitar a exposição da senha.
* Para autenticação LDAP baseada em SASL, os plugins do lado do cliente e do servidor evitam enviar a senha em texto claro entre o cliente e o servidor MySQL. Por exemplo, os plugins podem usar mensagens SASL para transmissão segura de credenciais dentro do protocolo LDAP. Para o método de autenticação GSSAPI, os plugins do lado do cliente e do servidor se comunicam de forma segura usando Kerberos sem usar diretamente mensagens LDAP.

Se o nome de usuário e o nome do host do usuário do cliente não corresponderem a nenhuma conta MySQL, a conexão é rejeitada.

Se houver uma conta MySQL correspondente, a autenticação ocorre contra o LDAP. O servidor LDAP procura uma entrada que corresponda ao usuário e autentica a entrada contra a senha do LDAP:

* Se a conta MySQL nomear um nome de usuário LDAP (DN), a autenticação LDAP usa esse valor e a senha LDAP fornecida pelo cliente. (Para associar um DN de usuário LDAP a uma conta MySQL, inclua uma cláusula `BY` que especifique uma string de autenticação na instrução `CREATE USER` que cria a conta.)
* Se a conta MySQL não nomear um DN de usuário LDAP, a autenticação LDAP usa o nome de usuário e a senha LDAP fornecidos pelo cliente. Neste caso, o plugin de autenticação primeiro se vincula ao servidor LDAP usando o DN raiz e a senha como credenciais para encontrar o DN do usuário com base no nome de usuário do cliente, e depois autentica esse DN do usuário contra a senha do LDAP. Esse vínculo usando as credenciais raiz falha se o DN raiz e a senha forem definidos para valores incorretos ou estiverem vazios (não definidos) e o servidor LDAP não permitir conexões anônimas.

Se o servidor LDAP não encontrar correspondência ou encontrar múltiplas correspondências, a autenticação falha e a conexão do cliente é rejeitada.

Se o servidor LDAP encontrar uma única correspondência, a autenticação LDAP terá sucesso (assumindo que a senha está correta), o servidor LDAP retorna a entrada LDAP e o plugin de autenticação determina o nome do usuário autenticado com base nessa entrada:

* Se a entrada LDAP tiver um atributo de grupo (por padrão, o atributo `cn`), o plugin retorna seu valor como o nome do usuário autenticado.
* Se a entrada LDAP não tiver um atributo de grupo, o plugin de autenticação retorna o nome do usuário cliente como o nome do usuário autenticado.

O servidor MySQL compara o nome do usuário cliente com o nome do usuário autenticado para determinar se ocorre o encaminhamento para a sessão do cliente:

* Se os nomes forem os mesmos, não ocorre encaminhamento: A conta MySQL que corresponde ao nome do usuário cliente é usada para verificação de privilégios.
* Se os nomes forem diferentes, ocorre encaminhamento: O MySQL procura uma conta que corresponda ao nome do usuário autenticado. Essa conta se torna o usuário encaminhado, que é usado para verificação de privilégios. A conta MySQL que correspondeu ao nome do usuário cliente é tratada como o usuário do proxy externo.

##### Instalando Plugins de Autenticação LDAP

Esta seção descreve como instalar os plugins de autenticação LDAP no lado do servidor. Para informações gerais sobre como instalar plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para que o plugin seja utilizável pelo servidor, os arquivos da biblioteca do plugin devem estar localizados no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` na inicialização do servidor.

Os nomes de base dos arquivos da biblioteca do plugin no lado do servidor são `authentication_ldap_simple` e `authentication_ldap_sasl`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

::: info Nota

No Microsoft Windows, o plugin do servidor para autenticação LDAP baseada em SASL não é suportado, mas o plugin do cliente é suportado. Em outras plataformas, os plugins do servidor e do cliente são suportados.

Para carregar os plugins na inicialização do servidor, use as opções `--plugin-load-add` para nomear os arquivos da biblioteca que os contêm. Com esse método de carregamento de plugins, as opções devem ser fornecidas toda vez que o servidor for iniciado. Além disso, especifique valores para quaisquer variáveis do sistema fornecidas pelo plugin que você deseja configurar.

Cada plugin LDAP do lado do servidor expõe um conjunto de variáveis do sistema que permitem que sua operação seja configurada. A maioria dessas variáveis é opcional, mas você deve definir as variáveis que especificam o host do servidor LDAP (para que o plugin saiba onde se conectar) e o nome distinto da base para operações de vinculação LDAP (para limitar o escopo das pesquisas e obter pesquisas mais rápidas). Para obter detalhes sobre todas as variáveis do sistema LDAP, consulte a Seção 8.4.1.13, “Variáveis do Sistema do Sistema de Autenticação Conectable”.

Para carregar os plugins e definir o host do servidor LDAP e o nome distinto da base para operações de vinculação LDAP, coloque linhas como estas em seu arquivo `my.cnf`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
[mysqld]
plugin-load-add=authentication_ldap_simple.so
authentication_ldap_simple_server_host=127.0.0.1
authentication_ldap_simple_bind_base_dn="dc=example,dc=com"
plugin-load-add=authentication_ldap_sasl.so
authentication_ldap_sasl_server_host=127.0.0.1
authentication_ldap_sasl_bind_base_dn="dc=example,dc=com"
```

Após modificar `my.cnf`, reinicie o servidor para fazer com que as novas configurações entrem em vigor.

Alternativamente, para carregar os plugins em tempo de execução, use essas instruções, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
INSTALL PLUGIN authentication_ldap_simple
  SONAME 'authentication_ldap_simple.so';
INSTALL PLUGIN authentication_ldap_sasl
  SONAME 'authentication_ldap_sasl.so';
```

 `INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela do sistema `mysql.plugins` para fazer com que o servidor o carregue para cada inicialização normal subsequente sem a necessidade de `--plugin-load-add`.

Após instalar os plugins em tempo de execução, as variáveis do sistema que eles expõem ficam disponíveis e você pode adicionar configurações para elas ao seu arquivo `my.cnf` para configurar os plugins para reinicializações subsequentes. Por exemplo:

```
[mysqld]
authentication_ldap_simple_server_host=127.0.0.1
authentication_ldap_simple_bind_base_dn="dc=example,dc=com"
authentication_ldap_sasl_server_host=127.0.0.1
authentication_ldap_sasl_bind_base_dn="dc=example,dc=com"
```

Após modificar `my.cnf`, reinicie o servidor para fazer com que as novas configurações entrem em vigor.

Para definir e persistir cada valor em tempo de execução, em vez de no momento do início, use essas instruções:

```
SET PERSIST authentication_ldap_simple_server_host='127.0.0.1';
SET PERSIST authentication_ldap_simple_bind_base_dn='dc=example,dc=com';
SET PERSIST authentication_ldap_sasl_server_host='127.0.0.1';
SET PERSIST authentication_ldap_sasl_bind_base_dn='dc=example,dc=com';
```

`SET PERSIST` define um valor para a instância MySQL em execução. Ele também salva o valor, fazendo com que ele seja carregado em reinicializações subsequentes do servidor. Para alterar um valor para a instância MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`. Veja a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

Para verificar a instalação do plugin, examine a tabela do Schema de Informações `PLUGINS` ou use a instrução `SHOW PLUGINS` (veja a Seção 7.6.2, “Obtendo Informações de Plugins do Servidor”). Por exemplo:

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

Se um plugin não conseguir inicializar, verifique o log de erro do servidor para mensagens de diagnóstico.

Para associar contas MySQL a um plugin LDAP, veja Usar Plugins LDAP Personalizáveis de Autenticação.

::: info

Observações Adicionais para SELinux

Em sistemas que executam EL6 ou EL e têm SELinux habilitado, as alterações na política SELinux são necessárias para habilitar os plugins MySQL LDAP a se comunicarem com o serviço LDAP:

1. Crie um arquivo `mysqlldap.te` com o seguinte conteúdo:

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
4. Instale o pacote de módulo:

   ```
   semodule -i mysqlldap.pp
   ```
5. Quando as alterações na política SELinux forem feitas, reinicie o servidor MySQL:

   ```
   service mysqld restart
   ```

:::

##### Desinstalação da Autenticação Personalizável LDAP

O método usado para desinstalar os plugins de autenticação LDAP depende de como eles foram instalados:

* Se você instalou os plugins no início do servidor usando as opções `--plugin-load-add`, reinicie o servidor sem essas opções.
* Se você instalou os plugins em tempo de execução usando `INSTALL PLUGIN`, eles permanecem instalados em reinicializações subsequentes do servidor. Para desinstalá-los, use `UNINSTALL PLUGIN`:

  ```
  UNINSTALL PLUGIN authentication_ldap_simple;
  UNINSTALL PLUGIN authentication_ldap_sasl;
  ```

Além disso, remova das suas configurações de `my.cnf` quaisquer opções de inicialização que definam variáveis de sistema relacionadas ao plugin LDAP. Se você usou `SET PERSIST` para persistir variáveis de sistema LDAP, use `RESET PERSIST` para remover as configurações.

##### LDAP Pluggable Authentication e ldap.conf

Para instalações que utilizam o OpenLDAP, o arquivo `ldap.conf` fornece configurações globais para clientes LDAP. As opções podem ser definidas neste arquivo para afetar clientes LDAP, incluindo os plugins de autenticação LDAP. O OpenLDAP usa opções de configuração nesta ordem de precedência:

* Configuração especificada pelo cliente LDAP.
* Configuração especificada no arquivo `ldap.conf`. Para desabilitar o uso deste arquivo, defina a variável de ambiente `LDAPNOINIT`.
* Padrões internos da biblioteca do OpenLDAP.

Se os valores dos padrões da biblioteca ou do `ldap.conf` não fornecerem valores apropriados para as opções, um plugin de autenticação LDAP pode ser capaz de definir variáveis relacionadas para afetar diretamente a configuração LDAP. Por exemplo, os plugins LDAP podem substituir o `ldap.conf` para parâmetros como estes:

* Configuração TLS: Variáveis de sistema estão disponíveis para habilitar o TLS e controlar a configuração da CA, como `authentication_ldap_simple_tls` e `authentication_ldap_simple_ca_path` para autenticação LDAP simples, e `authentication_ldap_sasl_tls` e `authentication_ldap_sasl_ca_path` para autenticação LDAP SASL.
* Referência LDAP. Consulte Referência de Busca LDAP.

Para obter mais informações sobre `ldap.conf`, consulte a página de manual `ldap.conf(5)`.

##### Definindo Limites de Tempo para a Autenticação LDAP Pluggable
## Português (Brasil)

Para que as contas do MySQL se conectem a um servidor MySQL usando autenticação LDAP pluggable, o servidor LDAP deve estar disponível e operacional. A interação entre os servidores MySQL e LDAP envolve dois passos. Primeiro, o servidor MySQL estabelece uma conexão com o servidor LDAP via TCP. Segundo, o servidor MySQL envia uma solicitação de vinculação LDAP sobre a conexão com o servidor LDAP e aguarda uma resposta antes de autenticar a conta. Se qualquer um desses passos falhar, a conta do MySQL não consegue se conectar ao servidor MySQL.

Timeout de curta duração que substitui os valores de timeout do sistema hospedeiro são aplicados por padrão tanto aos passos de conexão quanto de resposta. Em todos os casos, o usuário da conta recebe notificação de que sua tentativa de se conectar ao MySQL é negada se o timeout expirar. O registro do lado do cliente e do lado do servidor pode fornecer informações adicionais. No lado do cliente, defina a seguinte variável de ambiente para elevar o nível de detalhe e, em seguida, reinicie o cliente MySQL:

```
AUTHENTICATION_LDAP_CLIENT_LOG=5
export AUTHENTICATION_LDAP_CLIENT_LOG
```

As seguintes variáveis de sistema suportam timeout padrão para autenticação baseada em SASL e LDAP simples em plataformas Linux apenas.

**Tabela 8.22 Variáveis de sistema para autenticação baseada em SASL e LDAP simples**

<table><thead><tr> <th>Nome da Variável de Sistema</th> <th>Valor de Timeout Padrão</th> </tr></thead><tbody><tr> <td><code>authentication_ldap_sasl_connect_timeout</code></td> <td>30 segundos</td> </tr><tr> <td><code>authentication_ldap_sasl_response_timeout</code></td> <td>30 segundos</td> </tr><tr> <td><code>authentication_ldap_simple_connect_timeout</code></td> <td>30 segundos</td> </tr><tr> <td><code>authentication_ldap_simple_response_timeout</code></td> <td>30 segundos</td> </tr></tbody></table>

Os valores de timeout para autenticação LDAP são ajustáveis no início do servidor e durante o runtime. Se você definir um timeout para zero usando uma dessas variáveis, você efetivamente desativa e o servidor MySQL retorna ao timeout padrão do sistema hospedeiro.

::: info Nota

Sob a combinação das seguintes condições, o tempo de espera real do ajuste `authentication_ldap_sasl_connect_timeout` dobra porque (internamente) o servidor deve invocar a conexão TCP duas vezes:

* O servidor LDAP está offline.
* `authentication_ldap_sasl_connect_timeout` tem um valor maior que zero.
* O pool de conexões está em uso (especificamente, a variável de sistema `authentication_ldap_sasl_max_pool_size` tem um valor maior que zero, o que habilita o pool).

:::

##### Usando Autenticação LDAP Pluggable

Esta seção descreve como habilitar contas do MySQL para se conectarem ao servidor MySQL usando autenticação LDAP pluggable. Assume-se que o servidor está sendo executado com os plugins do lado do servidor apropriados habilitados, conforme descrito em Instalando Autenticação LDAP Pluggable, e que os plugins do lado do cliente apropriados estão disponíveis no host do cliente.

Esta seção não descreve a configuração ou administração do LDAP. Assume-se que você está familiarizado com esses tópicos.

Os dois plugins do lado do servidor LDAP trabalham com um plugin do lado do cliente específico:

* O plugin `authentication_ldap_simple` do lado do servidor realiza autenticação LDAP simples. Para conexões por contas que usam este plugin, os programas do cliente usam o plugin do lado do cliente `mysql_clear_password`, que envia a senha para o servidor como texto claro. Nenhuma hash ou criptografia de senha é usada, portanto, uma conexão segura entre o cliente MySQL e o servidor é recomendada para evitar a exposição da senha.
* O plugin `authentication_ldap_sasl` do lado do servidor realiza autenticação LDAP baseada em SASL. Para conexões por contas que usam este plugin, os programas do cliente usam o plugin do lado do cliente `authentication_ldap_sasl_client`. Os plugins LDAP SASL do lado do cliente e do lado do servidor usam mensagens SASL para a transmissão segura de credenciais dentro do protocolo LDAP, para evitar enviar a senha em texto claro entre o cliente MySQL e o servidor.

Requisitos gerais para a autenticação LDAP de usuários do MySQL:

* Deve haver uma entrada no diretório LDAP para cada usuário que será autenticado.
* Deve haver uma conta de usuário MySQL que especifique um plugin de autenticação LDAP no lado do servidor e, opcionalmente, nomeie o nome distinto do usuário (DN) do LDAP associado. (Para associar um DN de usuário LDAP a uma conta MySQL, inclua uma cláusula `BY` na instrução `CREATE USER` que cria a conta.) Se uma conta não especificar uma string LDAP, a autenticação LDAP usa o nome de usuário especificado pelo cliente para encontrar a entrada LDAP.
* Os programas clientes se conectam usando o método de conexão apropriado para o plugin de autenticação no lado do servidor que a conta MySQL usa. Para autenticação LDAP, as conexões requerem o nome de usuário MySQL e a senha LDAP. Além disso, para contas que usam o plugin `authentication_ldap_simple` no lado do servidor, inicie programas clientes com a opção `--enable-cleartext-plugin` para habilitar o plugin `mysql_clear_password` no lado do cliente.

As instruções aqui assumem o seguinte cenário:

* Os usuários MySQL `betsy` e `boris` autenticam-se nas entradas LDAP para `betsy_ldap` e `boris_ldap`, respectivamente. (Não é necessário que os nomes de usuário MySQL e LDAP sejam diferentes. O uso de nomes diferentes nesta discussão ajuda a esclarecer se um contexto de operação é MySQL ou LDAP.)
* As entradas LDAP usam o atributo `uid` para especificar nomes de usuário. Isso pode variar dependendo do servidor LDAP. Alguns servidores LDAP usam o atributo `cn` para nomes de usuário em vez de `uid`. Para alterar o atributo, modifique a variável de sistema `authentication_ldap_simple_user_search_attr` ou `authentication_ldap_sasl_user_search_attr` apropriadamente.
* Essas entradas LDAP estão disponíveis no diretório gerenciado pelo servidor LDAP, para fornecer valores de nome distinto que identificam de forma única cada usuário:

  ```
  uid=betsy_ldap,ou=People,dc=example,dc=com
  uid=boris_ldap,ou=People,dc=example,dc=com
  ```
* As instruções `CREATE USER` que criam contas MySQL nomeiam um usuário LDAP na cláusula `BY`, para indicar qual entrada LDAP a conta MySQL autentica.

As instruções para configurar uma conta que utiliza autenticação LDAP dependem do plugin LDAP do lado do servidor utilizado. As seções a seguir descrevem vários cenários de uso.

##### Autenticação LDAP Simples (Sem Proxy)

O procedimento descrito nesta seção exige que `authentication_ldap_simple_group_search_attr` seja definido como uma string vazia, da seguinte forma:

```
SET GLOBAL.authentication_ldap_simple_group_search_attr='';
```

Caso contrário, o proxy é usado por padrão.

Para configurar uma conta MySQL para autenticação LDAP simples, use uma instrução `CREATE USER` para especificar o plugin `authentication_ldap_simple`, opcionalmente incluindo o nome distinto do usuário (DN) do LDAP, conforme mostrado aqui:

```
CREATE USER user
  IDENTIFIED WITH authentication_ldap_simple
  [BY 'LDAP user DN'];
```

Suponha que o usuário MySQL `betsy` tenha esta entrada no diretório LDAP:

```
uid=betsy_ldap,ou=People,dc=example,dc=com
```

Então, a instrução para criar a conta MySQL para `betsy` parece assim:

```
CREATE USER 'betsy'@'localhost'
  IDENTIFIED WITH authentication_ldap_simple
  AS 'uid=betsy_ldap,ou=People,dc=example,dc=com';
```

A string de autenticação especificada na cláusula `BY` não inclui a senha do LDAP. Isso deve ser fornecido pelo usuário cliente no momento da conexão.

Os clientes se conectam ao servidor MySQL fornecendo o nome do usuário MySQL e a senha LDAP, e habilitando o plugin `mysql_clear_password` do lado do cliente:

```
$> mysql --user=betsy --password --enable-cleartext-plugin
Enter password: betsy_ldap_password
```

::: info Nota

O plugin de autenticação `mysql_clear_password` do lado do cliente deixa a senha intacta, então os programas cliente enviam-na para o servidor MySQL como texto claro. Isso permite que a senha seja passada como está para o servidor LDAP. Uma senha em texto claro é necessária para usar a biblioteca LDAP do lado do servidor sem SASL, mas pode ser um problema de segurança em algumas configurações. Essas medidas minimizam o risco:

* Para tornar menos provável o uso acidental do plugin `mysql_clear_password`, os clientes MySQL devem habilitá-lo explicitamente (por exemplo, com a opção `--enable-cleartext-plugin`). Veja a Seção 8.4.1.4, “Autenticação Pluggable de Texto Aberto no Lado do Cliente”.
* Para evitar a exposição da senha com o plugin `mysql_clear_password` habilitado, os clientes MySQL devem se conectar ao servidor MySQL usando uma conexão criptografada. Veja a Seção 8.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”.

:::

O processo de autenticação ocorre da seguinte forma:

1. O plugin no lado do cliente envia `betsy` e *`betsy_password`* como o nome do usuário do cliente e a senha LDAP para o servidor MySQL.
2. A tentativa de conexão corresponde à conta `'betsy'@'localhost'`. O plugin LDAP no lado do servidor encontra que essa conta tem uma string de autenticação de `'uid=betsy_ldap,ou=People,dc=example,dc=com'` para nomear o DN do usuário LDAP. O plugin envia essa string e a senha LDAP para o servidor LDAP.
3. O servidor LDAP encontra a entrada LDAP para `betsy_ldap` e a senha corresponde, então a autenticação LDAP é bem-sucedida.
4. A entrada LDAP não tem atributo de grupo, então o plugin no lado do servidor retorna o nome do usuário do cliente (`betsy`) como o usuário autenticado. Esse é o mesmo nome de usuário fornecido pelo cliente, então não ocorre nenhum encaminhamento e a sessão do cliente usa a conta `'betsy'@'localhost'` para verificação de privilégios.

Se a instrução `CREATE USER` não contivesse nenhuma cláusula `BY` para especificar o nome distinto LDAP `betsy_ldap`, as tentativas de autenticação usariam o nome de usuário fornecido pelo cliente (neste caso, `betsy`). Na ausência de uma entrada LDAP para `betsy`, a autenticação falharia.

##### Autenticação LDAP Baseada em SASL (Sem Encaminhamento)

O procedimento descrito nesta seção exige que `authentication_ldap_sasl_group_search_attr` seja definido como uma string vazia, assim:

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

Então, a instrução para criar a conta MySQL para `boris` parece assim:

```
CREATE USER 'boris'@'localhost'
  IDENTIFIED WITH authentication_ldap_sasl
  AS 'uid=boris_ldap,ou=People,dc=example,dc=com';
```

A string de autenticação especificada na cláusula `BY` não inclui a senha do LDAP. Isso deve ser fornecido pelo usuário cliente no momento da conexão.

Os clientes se conectam ao servidor MySQL fornecendo o nome do usuário MySQL e a senha LDAP:

```
$> mysql --user=boris --password
Enter password: boris_ldap_password
```

Para o plugin `authentication_ldap_sasl` do lado do servidor, os clientes usam o plugin `authentication_ldap_sasl_client` do lado do cliente. Se um programa cliente não encontrar o plugin do lado do cliente, especifique uma opção `--plugin-dir` que nomeie o diretório onde o arquivo da biblioteca do plugin está instalado.

O processo de autenticação para `boris` é semelhante ao descrito anteriormente para `betsy` com autenticação LDAP simples, exceto que os plugins SASL LDAP do lado do cliente e do servidor usam mensagens SASL para a transmissão segura das credenciais dentro do protocolo LDAP, para evitar enviar a senha em texto claro entre o cliente e o servidor MySQL.

##### Autenticação LDAP com Proxy

Os plugins de autenticação LDAP suportam o proxy, permitindo que um usuário se conecte ao servidor MySQL como um usuário, mas assuma os privilégios de um usuário diferente. Esta seção descreve o suporte básico ao proxy do plugin LDAP. Os plugins LDAP também suportam a especificação de preferência de grupo e mapeamento de usuário proxy; consulte Especificação de Preferência e Mapeamento de Preferência de Grupo de Autenticação LDAP.

A implementação de proxy descrita aqui é baseada no uso de valores de atributos de grupo LDAP para mapear usuários do MySQL que se autenticam usando LDAP para outras contas do MySQL que definem conjuntos diferentes de privilégios. Os usuários não se conectam diretamente através das contas que definem os privilégios. Em vez disso, eles se conectam através de uma conta de proxy padrão autenticada com LDAP, de modo que todos os logins externos sejam mapeados para as contas do MySQL proxy que possuem os privilégios. Qualquer usuário que se conecte usando a conta de proxy é mapeado para uma dessas contas do MySQL proxy, cujos privilégios determinam as operações de banco de dados permitidas ao usuário externo.

As instruções aqui assumem o seguinte cenário:

* As entradas LDAP usam os atributos `uid` e `cn` para especificar o nome do usuário e os valores do grupo, respectivamente. Para usar nomes de atributos de usuário e grupo diferentes, defina as variáveis de sistema específicas do plugin:

  + Para o plugin `authentication_ldap_simple`: Defina `authentication_ldap_simple_user_search_attr` e `authentication_ldap_simple_group_search_attr`.
  + Para o plugin `authentication_ldap_sasl`: Defina `authentication_ldap_sasl_user_search_attr` e `authentication_ldap_sasl_group_search_attr`.
* Essas entradas LDAP estão disponíveis no diretório gerenciado pelo servidor LDAP, para fornecer valores de nome distinto que identificam de forma única cada usuário:

  ```
  uid=basha,ou=People,dc=example,dc=com,cn=accounting
  uid=basil,ou=People,dc=example,dc=com,cn=front_office
  ```

  No momento da conexão, os valores dos atributos de grupo se tornam os nomes dos usuários autenticados, portanto, eles nomeiam as contas do `accounting` e `front_office` proxy.
* Os exemplos assumem o uso da autenticação LDAP SASL. Faça os ajustes apropriados para a autenticação LDAP simples.

Crie a conta MySQL de proxy padrão:

```
CREATE USER ''@'%'
  IDENTIFIED WITH authentication_ldap_sasl;
```

A definição da conta de proxy não tem a cláusula `AS 'auth_string'` para nomear um DN de usuário LDAP. Assim:

* Quando um cliente se conecta, o nome de usuário do cliente se torna o nome de usuário do LDAP para pesquisar.
* A entrada LDAP correspondente deve incluir um atributo de grupo que nomeie a conta MySQL proxy que define os privilégios que o cliente deve ter.

::: info Nota

Se a sua instalação do MySQL tiver usuários anônimos, eles podem entrar em conflito com o usuário proxy padrão. Para obter mais informações sobre esse problema e maneiras de lidar com ele, consulte Conflitos de Usuário Proxy Padrão e Usuário Anônimo.


:::

Crie as contas proxy e conceda a cada uma as permissões que ela deve ter:

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

As contas proxy usam o plugin de autenticação `mysql_no_login` para impedir que os clientes usem as contas para fazer login diretamente no servidor MySQL. Em vez disso, os usuários que se autenticam usando o LDAP devem usar a conta proxy padrão `''@'%'`. (Isso assume que o plugin `mysql_no_login` está instalado. Para instruções, consulte Seção 8.4.1.9, “Autenticação Pluggable No-Login”.) Para métodos alternativos de proteção das contas proxy contra o uso direto, consulte Proteger Login Direto em Contas Proxy.

Concede ao usuário proxy o privilégio `PROXY` para cada conta proxy:

```
GRANT PROXY
  ON 'accounting'@'localhost'
  TO ''@'%';
GRANT PROXY
  ON 'front_office'@'localhost'
  TO ''@'%';
```

Use o cliente de linha de comando `mysql` para se conectar ao servidor MySQL como `basha`.

```
$> mysql --user=basha --password
Enter password: basha_password (basha LDAP password)
```

A autenticação ocorre da seguinte forma:

1. O servidor autentica a conexão usando a conta proxy padrão `''@'%'`, para o usuário do cliente `basha`.
2. A entrada LDAP correspondente é:

   ```
   uid=basha,ou=People,dc=example,dc=com,cn=accounting
   ```
3. A entrada LDAP correspondente tem o atributo de grupo `cn=accounting`, então `accounting` se torna o usuário proxy autenticado.
4. O usuário autenticado difere do nome de usuário do cliente `basha`, com o resultado de que `basha` é tratado como um proxy para `accounting`, e `basha` assume os privilégios da conta proxy `accounting`. A seguinte consulta retorna o resultado mostrado:

   ```
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-----------------+----------------------+--------------+
   | USER()          | CURRENT_USER()       | @@proxy_user |
   +-----------------+----------------------+--------------+
   | basha@localhost | accounting@localhost | ''@'%'       |
   +-----------------+----------------------+--------------+
   ```

Isso demonstra que o `basha` utiliza os privilégios concedidos à conta `accounting` MySQL proxy, e que a proxy é realizada através da conta de usuário proxy padrão.

Agora, conecte-se como `basil` em vez disso:

```
$> mysql --user=basil --password
Enter password: basil_password (basil LDAP password)
```

O processo de autenticação para `basil` é semelhante ao descrito anteriormente para `basha`:

1. O servidor autentica a conexão usando a conta proxy padrão `''@'%'`, para o usuário cliente `basil`.
2. A entrada LDAP correspondente é:

   ```
   uid=basil,ou=People,dc=example,dc=com,cn=front_office
   ```
3. A entrada LDAP correspondente tem o atributo de grupo `cn=front_office`, então `front_office` se torna o usuário proxy autenticado.
4. O usuário autenticado difere do nome do usuário cliente `basil`, com o resultado de que `basil` é tratado como um proxy para `front_office`, e `basil` assume os privilégios da conta `front_office` proxy. A seguinte consulta retorna o resultado mostrado:

   ```
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-----------------+------------------------+--------------+
   | USER()          | CURRENT_USER()         | @@proxy_user |
   +-----------------+------------------------+--------------+
   | basil@localhost | front_office@localhost | ''@'%'       |
   +-----------------+------------------------+--------------+
   ```

Isso demonstra que o `basil` utiliza os privilégios concedidos à conta MySQL `front_office` proxy, e que a proxy ocorre através da conta de usuário proxy padrão.

##### Especificação de Preferência e Mapeamento de Grupo de Autenticação LDAP

Como descrito na Autenticação LDAP com Proxy, a autenticação básica de LDAP proxy funciona com o princípio de que o plugin usa o primeiro nome de grupo retornado pelo servidor LDAP como o nome da conta de usuário MySQL proxy. Essa capacidade simples não permite especificar nenhuma preferência sobre qual nome de grupo usar se o servidor LDAP retornar múltiplos nomes de grupo, ou especificar qualquer nome diferente do nome de grupo como o nome do usuário proxy.

Para contas MySQL que usam autenticação LDAP, a string de autenticação pode especificar as seguintes informações para permitir maior flexibilidade de proxy:

* Uma lista de grupos em ordem de preferência, de modo que o plugin use o primeiro nome de grupo na lista que corresponda a um grupo retornado pelo servidor LDAP.
* Um mapeamento de nomes de grupos para nomes de usuários proxy, de modo que um nome de grupo, ao corresponder, possa fornecer um nome especificado para ser usado como o nome do usuário proxy. Isso fornece uma alternativa ao uso do nome de grupo como nome do usuário proxy.

Considere a seguinte definição de conta de proxy MySQL:

```
CREATE USER ''@'%'
  IDENTIFIED WITH authentication_ldap_sasl
  AS '+ou=People,dc=example,dc=com#grp1=usera,grp2,grp3=userc';
```

A string de autenticação tem um sufixo DN de usuário `ou=People,dc=example,dc=com` prefixado pelo caractere `+`. Assim, conforme descrito na Autenticação LDAP, o sufixo DN de usuário é construído a partir do sufixo DN de usuário do usuário, além do nome do usuário do cliente como o atributo `uid`.

A parte restante da string de autenticação começa com `#`, o que indica o início das informações de preferência e mapeamento de grupo. Essa parte da string de autenticação lista os nomes de grupo na ordem `grp1`, `grp2`, `grp3`. O plugin LDAP compara essa lista com o conjunto de nomes de grupo retornados pelo servidor LDAP, procurando na ordem da lista uma correspondência com os nomes retornados. O plugin usa a primeira correspondência, ou se não houver correspondência, a autenticação falha.

Suponha que o servidor LDAP retorne os grupos `grp3`, `grp2` e `grp7`. O plugin LDAP usa `grp2` porque é o primeiro grupo na string de autenticação que corresponde, mesmo que não seja o primeiro grupo retornado pelo servidor LDAP. Se o servidor LDAP retornar `grp4`, `grp2` e `grp1`, o plugin usa `grp1` mesmo que `grp2` também corresponda. `grp1` tem uma precedência maior que `grp2` porque é listado anteriormente na string de autenticação.

Assumindo que o plugin encontra uma correspondência de nome de grupo, ele realiza o mapeamento desse nome de grupo para o nome do usuário proxy MySQL, se houver um. Para a conta de proxy de exemplo, o mapeamento ocorre da seguinte forma:

* Se o nome do grupo correspondente for `grp1` ou `grp3`, esses são associados à string de autenticação com os nomes de usuário `usera` e `userc`, respectivamente. O plugin usa o nome de usuário associado correspondente como o nome de usuário proxy.
* Se o nome do grupo correspondente for `grp2`, não há um nome de usuário associado na string de autenticação. O plugin usa `grp2` como o nome de usuário proxy.

Se o servidor LDAP retornar um grupo no formato DN, o plugin LDAP analisa o DN do grupo para extrair o nome do grupo dele.

Para especificar as informações de preferência e mapeamento de grupo LDAP, esses princípios se aplicam:

* Comece a parte de preferência e mapeamento de grupo da string de autenticação com o caractere prefixo `#`.
* A especificação de preferência e mapeamento de grupo é uma lista de um ou mais itens, separados por vírgulas. Cada item tem a forma `grupo_nome=nome_usuario` ou *`grupo_nome`*. Os itens devem ser listados na ordem de preferência do nome do grupo. Para um nome de grupo selecionado pelo plugin como uma correspondência de um conjunto de nomes de grupo retornados pelo servidor LDAP, as duas sintaxes diferem em efeito da seguinte forma:

  + Para um item especificado como `grupo_nome=nome_usuario` (com um nome de usuário), o nome do grupo é mapeado para o nome de usuário, que é usado como o nome de usuário proxy MySQL.
  + Para um item especificado como *`grupo_nome`* (sem nome de usuário), o nome do grupo é usado como o nome de usuário proxy MySQL.
* Para citar um nome de grupo ou usuário que contenha caracteres especiais, como espaço, rode-o com caracteres de aspas (`"`). Por exemplo, se um item tem nomes de grupo e usuário de `meu nome de grupo` e `meu nome de usuário`, ele deve ser escrito em um mapeamento de grupo usando aspas:

  ```
  "my group name"="my user name"
  ```

  Se um item tem nomes de grupo e usuário de `minha_grupo_nome` e `meu_nome_usuario` (que não contêm caracteres especiais), ele pode, mas não precisa, ser escrito usando aspas. Qualquer um dos seguintes é válido:

```
  my_group_name=my_user_name
  my_group_name="my_user_name"
  "my_group_name"=my_user_name
  "my_group_name"="my_user_name"
  ```
* Para escapar de um caractere, anteceda-o com uma barra invertida (`\`). Isso é útil, particularmente, para incluir uma citação dupla literal ou uma barra invertida, que, de outra forma, não seriam incluídas literalmente.
* O DN do usuário não precisa estar presente na string de autenticação, mas, se estiver presente, deve preceder a parte de preferência e mapeamento do grupo. Um DN do usuário pode ser fornecido como o DN completo do usuário ou como um sufixo de DN do usuário com o caractere de prefixo `+`. (Veja Sufixos de DN do Usuário de Autenticação LDAP.)

##### Sufixos de DN do Usuário de Autenticação LDAP

Os plugins de autenticação LDAP permitem que a string de autenticação que fornece informações de DN do usuário comece com um caractere de prefixo `+`:

* Na ausência de um caractere `+`, o valor da string de autenticação é tratado como está, sem modificação.
* Se a string de autenticação começar com `+`, o plugin constrói o valor completo do DN do usuário a partir do nome do usuário enviado pelo cliente, juntamente com o DN especificado na string de autenticação (com o `+` removido). No DN construído, o nome do usuário do cliente se torna o valor do atributo que especifica os nomes de usuário LDAP. Isso é `uid` por padrão; para alterar o atributo, modifique a variável de sistema apropriada ( `authentication_ldap_simple_user_search_attr` ou `authentication_ldap_sasl_user_search_attr`). A string de autenticação é armazenada conforme fornecido na tabela de sistema `mysql.user`, com o DN completo do usuário construído em tempo real antes da autenticação.

Esta string de autenticação de conta não tem `+` no início, então é tratada como o DN completo do usuário:

```
CREATE USER 'baldwin'
  IDENTIFIED WITH authentication_ldap_simple
  AS 'uid=admin,ou=People,dc=example,dc=com';
```

O cliente se conecta com o nome do usuário especificado na conta (`baldwin`). Neste caso, esse nome não é usado porque a string de autenticação não tem prefixo e, portanto, especifica completamente o DN do usuário.

Esta string de autenticação de conta tem `+` no início, então é tratada apenas como parte do DN do usuário:

```
CREATE USER 'accounting'
  IDENTIFIED WITH authentication_ldap_simple
  AS '+ou=People,dc=example,dc=com';
```

O cliente se conecta ao nome de usuário especificado na conta (`accounting`), que, neste caso, é usado como o atributo `uid` junto com a string de autenticação para construir o DN do usuário: `uid=accounting,ou=People,dc=example,dc=com`

As contas nos exemplos anteriores têm um nome de usuário não vazio, portanto, o cliente sempre se conecta ao servidor MySQL usando o mesmo nome especificado na definição da conta. Se uma conta tiver um nome de usuário vazio, como a conta anônima padrão `''@'%'` descrita na Autenticação LDAP com Proxy, os clientes podem se conectar ao servidor MySQL com nomes de usuário variados. Mas o princípio é o mesmo: se a string de autenticação começa com `+`, o plugin usa o nome de usuário enviado pelo cliente junto com a string de autenticação para construir o DN do usuário.

##### Métodos de Autenticação LDAP

Os plugins de autenticação LDAP usam um método de autenticação configurável. As variáveis de sistema apropriadas e as opções de método disponíveis são específicas do plugin:

* Para o plugin `authentication_ldap_simple`: Defina a variável de sistema `authentication_ldap_simple_auth_method_name` para configurar o método. As opções permitidas são `SIMPLE` e `AD-FOREST`.
* Para o plugin `authentication_ldap_sasl`: Defina a variável de sistema `authentication_ldap_sasl_auth_method_name` para configurar o método. As opções permitidas são `SCRAM-SHA-1`, `SCRAM-SHA-256` e `GSSAPI`. (Para determinar quais métodos SASL LDAP estão realmente disponíveis no sistema hospedeiro, verifique o valor da variável de status `Authentication_ldap_sasl_supported_methods`.)

Consulte as descrições das variáveis de sistema para obter informações sobre cada método permitido. Além disso, dependendo do método, pode ser necessária uma configuração adicional, conforme descrito nas seções seguintes.

##### O Método de Autenticação GSSAPI/Kerberos

A Interface de Programa de Serviço de Segurança Genérico (GSSAPI) é uma interface de abstração de segurança. O Kerberos é uma instância de um protocolo de segurança específico que pode ser usado através dessa interface abstrata. Usando o GSSAPI, os aplicativos autenticam-se no Kerberos para obter credenciais de serviço, e depois usam essas credenciais para, por sua vez, habilitar o acesso seguro a outros serviços.

Um desses serviços é o LDAP, que é usado pelos plugins de autenticação SASL LDAP do lado do cliente e do lado do servidor. Quando a variável de sistema `authentication_ldap_sasl_auth_method_name` é definida como `GSSAPI`, esses plugins usam o método de autenticação GSSAPI/Kerberos. Neste caso, os plugins comunicam-se de forma segura usando o Kerberos sem usar diretamente mensagens LDAP. O plugin do lado do servidor, então, comunica-se com o servidor LDAP para interpretar mensagens de autenticação LDAP e recuperar grupos LDAP.

O GSSAPI/Kerberos é suportado como um método de autenticação LDAP para servidores e clientes MySQL no Linux. É útil em ambientes Linux onde os aplicativos têm acesso ao LDAP através do Microsoft Active Directory, que tem o Kerberos habilitado por padrão.

A discussão a seguir fornece informações sobre os requisitos de configuração para usar o método GSSAPI. A familiaridade com os conceitos e operação do Kerberos é assumida. A lista a seguir define brevemente vários termos comuns do Kerberos. Você também pode achar a seção Glossário do RFC 4120 útil.

*  Principal: Uma entidade nomeada, como um usuário ou servidor.
*  KDC: O centro de distribuição de chaves, composto pelo AS e TGS:

  +  AS: O servidor de autenticação; fornece o ticket-granting inicial necessário para obter tickets adicionais.
  +  TGS: O servidor de ticket-granting; fornece tickets adicionais aos clientes Kerberos que possuem um TGT válido.
*  TGT: O ticket-granting; apresentado ao TGS para obter tickets de serviço para o acesso ao serviço.

A autenticação LDAP usando Kerberos requer tanto um servidor KDC quanto um servidor LDAP. Esse requisito pode ser satisfeito de diferentes maneiras:

* O Active Directory inclui tanto servidores, com autenticação Kerberos habilitada por padrão no servidor LDAP do Active Directory.
* O OpenLDAP fornece um servidor LDAP, mas pode ser necessário um servidor KDC separado, com configuração adicional do Kerberos necessária.

O Kerberos também deve estar disponível no host do cliente. O cliente entra em contato com o AS usando uma senha para obter um TGT. O cliente então usa o TGT para obter acesso do TGS a outros serviços, como o LDAP.

As seções a seguir discutem os passos de configuração para usar o GSSAPI/Kerberos para autenticação SASL LDAP no MySQL:

* Verificar a disponibilidade do Kerberos e do LDAP
* Configurar o plugin de autenticação SASL LDAP no lado do servidor para GSSAPI/Kerberos
* Criar uma conta MySQL que use GSSAPI/Kerberos para autenticação LDAP
* Usar a conta MySQL para se conectar ao servidor MySQL
* Parâmetros de configuração do cliente para autenticação LDAP

###### Verificar a disponibilidade do Kerberos e do LDAP

O exemplo a seguir mostra como testar a disponibilidade do Kerberos no Active Directory. O exemplo faz as seguintes suposições:

* O Active Directory está sendo executado no host chamado `ldap_auth.example.com` com o endereço IP `198.51.100.10`.
* A autenticação Kerberos e as consultas LDAP relacionadas ao MySQL usam o domínio `MYSQL.LOCAL`.
* Uma principal chamada `bredon@MYSQL.LOCAL` está registrada no KDC. (Em uma discussão posterior, esse nome de principal também está associado à conta MySQL que autentica-se no servidor MySQL usando GSSAPI/Kerberos.)

Com essas suposições atendidas, siga este procedimento:

1. Verifique se a biblioteca Kerberos está instalada e configurada corretamente no sistema operacional. Por exemplo, para configurar um domínio `MYSQL.LOCAL` para uso durante a autenticação do MySQL, o arquivo de configuração Kerberos `/etc/krb5.conf` deve conter algo como:

   ```
   [realms]
     MYSQL.LOCAL = {
       kdc = ldap_auth.example.com
       admin_server = ldap_auth.example.com
       default_domain = MYSQL.LOCAL
     }
   ```
2. Você pode precisar adicionar uma entrada no `/etc/hosts` para o host do servidor:

   ```
   198.51.100.10 ldap_auth ldap_auth.example.com
   ```
3. Verifique se a autenticação Kerberos funciona corretamente:

1. Use `kinit` para autenticar-se no Kerberos:

      ```
      $> kinit bredon@MYSQL.LOCAL
      Password for bredon@MYSQL.LOCAL: (enter password here)
      ```

      O comando autentica o principal Kerberos chamado `bredon@MYSQL.LOCAL`. Insira a senha do principal quando o comando solicitar. O KDC retorna um TGT que é armazenado em cache no lado do cliente para uso por outras aplicações que reconhecem o Kerberos.
   2. Use `klist` para verificar se o TGT foi obtido corretamente. A saída deve ser semelhante a esta:

      ```
      $> klist
      Ticket cache: FILE:/tmp/krb5cc_244306
      Default principal: bredon@MYSQL.LOCAL

      Valid starting       Expires              Service principal
      03/23/2021 08:18:33  03/23/2021 18:18:33  krbtgt/MYSQL.LOCAL@MYSQL.LOCAL
      ```
4. Verifique se o `ldapsearch` funciona com o TGT Kerberos usando este comando, que busca por usuários no domínio `MYSQL.LOCAL`:

   ```
   ldapsearch -h 198.51.100.10 -Y GSSAPI -b "dc=MYSQL,dc=LOCAL"
   ```

###### Configure o Plugin de Autenticação SASL LDAP no Lado do Servidor para GSSAPI/Kerberos

Supondo que o servidor LDAP seja acessível através do Kerberos como descrito anteriormente, configure o plugin de autenticação SASL LDAP no lado do servidor para usar o método de autenticação GSSAPI/Kerberos. (Para informações gerais sobre a instalação do plugin LDAP, consulte Instalando o Plugin de Autenticação Legível.) Aqui está um exemplo de configurações relacionadas ao plugin que o arquivo `my.cnf` do servidor pode conter:

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

Essas configurações de arquivos de opção configuram o plugin SASL LDAP da seguinte forma:

* A opção `--plugin-load-add` carrega o plugin (ajuste o sufixo `.so` para sua plataforma conforme necessário). Se você carregou o plugin anteriormente usando uma declaração `INSTALL PLUGIN`, esta opção é desnecessária.
*  `authentication_ldap_sasl_auth_method_name` deve ser definido como `GSSAPI` para usar GSSAPI/Kerberos como o método de autenticação SASL LDAP.
*  `authentication_ldap_sasl_server_host` e `authentication_ldap_sasl_server_port` indicam o endereço IP e o número de porta do host do servidor do Active Directory para autenticação.
*  `authentication_ldap_sasl_bind_root_dn` e `authentication_ldap_sasl_bind_root_pwd` configuram o DN raiz e a senha para a capacidade de busca de grupo. Essa capacidade é necessária, mas os usuários podem não ter privilégios para buscar. Nesse caso, é necessário fornecer informações de DN raiz:

+ No valor da opção DN, `admin` deve ser o nome de uma conta LDAP administrativa que tenha privilégios para realizar pesquisas de usuários.
  + No valor da opção senha, *`senha`* deve ser a senha da conta `admin`.
* `authentication_ldap_sasl_bind_base_dn` indica o caminho da base do DN do usuário, para que as pesquisas busquem usuários no domínio `MYSQL.LOCAL`.
* `authentication_ldap_sasl_user_search_attr` especifica um atributo padrão de pesquisa do Active Directory, `sAMAccountName`. Este atributo é usado em pesquisas para corresponder a nomes de logon; os valores do atributo não são os mesmos que os valores do DN do usuário.

###### Crie uma Conta MySQL que Use GSSAPI/Kerberos para Autenticação LDAP

A autenticação MySQL usando o plugin de autenticação LDAP SASL com o método GSSAPI/Kerberos é baseada em um usuário que é um principal Kerberos. A discussão a seguir usa um principal chamado `bredon@MYSQL.LOCAL` como este usuário, que deve ser registrado em vários lugares:

* O administrador Kerberos deve registrar o nome do usuário como um principal Kerberos. Este nome deve incluir um nome de domínio. Os clientes usam o nome do principal e a senha para autenticar com Kerberos e obter um TGT.
* O administrador LDAP deve registrar o nome do usuário em uma entrada LDAP. Por exemplo:

  ```
  uid=bredon,dc=MYSQL,dc=LOCAL
  ```

  ::: info Nota

  No Active Directory (que usa Kerberos como método de autenticação padrão), criar um usuário cria tanto o principal Kerberos quanto a entrada LDAP.

:::

Presuma que o principal Kerberos e a entrada LDAP tenham sido registrados pelos administradores do serviço apropriados, e que, conforme descrito anteriormente em Instalar o Plugin de Autenticação LDAP Pluggable, e Configurar o Plugin de Autenticação LDAP SASL no Servidor para GSSAPI/Kerberos, o servidor MySQL tenha sido iniciado com configurações apropriadas para o plugin LDAP SASL no lado do servidor. O DBA do MySQL então cria uma conta MySQL que corresponde ao nome do principal Kerberos, incluindo o nome do domínio.

::: info Nota

O plugin LDAP SASL usa um DN de usuário constante para a autenticação Kerberos e ignora qualquer DN de usuário configurado no MySQL. Isso tem certas implicações:

* Para qualquer conta MySQL que use a autenticação GSSAPI/Kerberos, a string de autenticação nas instruções `CREATE USER` ou `ALTER USER` não deve conter DN de usuário, pois não tem efeito.
* Como a string de autenticação não contém DN de usuário, ela deve conter informações de mapeamento de grupo, para permitir que o usuário seja tratado como um usuário proxy mapeado para o usuário proxy desejado. Para informações sobre o mapeamento com o plugin de autenticação LDAP, consulte Autenticação LDAP com Mapeamento.

:::

As seguintes instruções criam um usuário proxy chamado `bredon@MYSQL.LOCAL` que assume os privilégios do usuário proxy chamado `proxied_krb_usr`. Outros usuários GSSAPI/Kerberos que devem ter os mesmos privilégios podem ser criados de forma semelhante como usuários proxy para o mesmo usuário proxy.

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

Observe atentamente a citação para o nome da conta proxy na primeira instrução `CREATE USER` e na instrução `GRANT PROXY`:

* Para a maioria das contas do MySQL, o usuário e o host são partes separadas do nome da conta, e, portanto, são citados separadamente como `'user_name'@'host_name'`.
* Para a autenticação LDAP Kerberos, a parte do usuário do nome da conta inclui o domínio principal, então `'bredon@MYSQL.LOCAL'` é citado como um único valor. Como não há parte de host fornecida, o nome completo da conta do MySQL usa o padrão `'%'` como parte do host: `'bredon@MYSQL.LOCAL'@'%'`

::: info Nota

Ao criar uma conta que autentica usando o plugin de autenticação SASL LDAP `authentication_ldap_sasl` com o método de autenticação GSSAPI/Kerberos, a instrução `CREATE USER` inclui o reino como parte do nome do usuário. Isso difere da criação de contas que usam o plugin `authentication_kerberos` Kerberos. Para tais contas, a instrução `CREATE USER` não inclui o reino como parte do nome do usuário. Em vez disso, especifique o reino como a string de autenticação na cláusula `BY`. Veja Criar uma Conta do MySQL que Usa Autenticação Kerberos.

:::

A conta proxy usa o plugin de autenticação `mysql_no_login` para impedir que os clientes usem a conta para fazer login diretamente no servidor MySQL. Em vez disso, espera-se que os usuários que autenticam usando LDAP usem a conta proxy `bredon@MYSQL.LOCAL`. (Isso assume que o plugin `mysql_no_login` está instalado. Para instruções, veja Seção 8.4.1.9, “Autenticação Pluggable sem Login”.) Para métodos alternativos de proteção de contas proxy contra uso direto, veja Prevenir Login Direto em Contas Proxy.

###### Use a Conta do MySQL para Conectar-se ao Servidor MySQL

Após configurar uma conta do MySQL que autentica usando GSSAPI/Kerberos, os clientes podem usá-la para se conectar ao servidor MySQL. A autenticação Kerberos pode ocorrer antes ou no momento da invocação do programa cliente MySQL:

* Antes de invocar o programa cliente MySQL, o usuário do cliente pode obter um TGT do KDC de forma independente do MySQL. Por exemplo, o usuário do cliente pode usar `kinit` para autenticar-se no Kerberos fornecendo um nome de principal Kerberos e a senha da principal:

  ```
  $> kinit bredon@MYSQL.LOCAL
  Password for bredon@MYSQL.LOCAL: (enter password here)
  ```

  O TGT resultante é armazenado na memória cache e torna-se disponível para uso por outras aplicações que reconhecem o Kerberos, como programas que usam o plugin de autenticação LDAP SASL do lado do cliente. Neste caso, o programa cliente MySQL autentica-se no servidor MySQL usando o TGT, então inicie o cliente sem especificar um nome de usuário ou senha:

  ```
  mysql --default-auth=authentication_ldap_sasl_client
  ```

  Como descrito anteriormente, quando o TGT está armazenado na memória cache, as opções de nome de usuário e senha não são necessárias no comando do cliente. Se o comando incluir essas opções mesmo assim, elas são tratadas da seguinte forma:

  + Se o comando incluir um nome de usuário, a autenticação falha se esse nome não corresponder ao nome da principal no TGT.
  + Se o comando incluir uma senha, o plugin do lado do cliente a ignora. Como a autenticação é baseada no TGT, pode ser bem-sucedida *mesmo que a senha fornecida pelo usuário seja incorreta*. Por essa razão, o plugin produz um aviso se um TGT válido for encontrado, o que faz com que a senha seja ignorada.
* Se o cache Kerberos não contiver nenhum TGT, o próprio plugin de autenticação LDAP SASL do lado do cliente pode obter o TGT do KDC. Inicie o cliente com opções para o nome e senha da principal Kerberos associada à conta MySQL (insira o comando em uma única linha, em seguida, insira a senha da principal quando solicitado):

  ```
  mysql --default-auth=authentication_ldap_sasl_client
    --user=bredon@MYSQL.LOCAL
    --password
  ```
* Se o cache Kerberos não contiver nenhum TGT e o comando do cliente não especificar o nome da principal como o nome de usuário, a autenticação falha.

Se você não tiver certeza se um TGT existe, pode usar `klist` para verificar.

A autenticação ocorre da seguinte forma:

1. O cliente usa o TGT para autenticar-se usando o Kerberos.
2. O servidor encontra a entrada LDAP para o principal e usa-a para autenticar a conexão da conta de proxy MySQL `bredon@MYSQL.LOCAL`.
3. As informações de mapeamento de grupo na string de autenticação da conta do proxy (`'#krb_grp=proxied_krb_user'`) indicam que o usuário autenticado proxy deve ser `proxied_krb_user`.
4. `bredon@MYSQL.LOCAL` é tratado como um proxy para `proxied_krb_user`, e a seguinte consulta retorna o resultado conforme mostrado:

   ```
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +------------------------------+--------------------+--------------------------+
   | USER()                       | CURRENT_USER()     | @@proxy_user             |
   +------------------------------+--------------------+--------------------------+
   | bredon@MYSQL.LOCAL@localhost | proxied_krb_user@% | 'bredon@MYSQL.LOCAL'@'%' |
   +------------------------------+--------------------+--------------------------+
   ```

   O valor `USER()` indica o nome de usuário usado para o comando do cliente (`bredon@MYSQL.LOCAL`) e o host a partir do qual o cliente se conectou (`localhost`).

   O valor `CURRENT_USER()` é o nome completo da conta de usuário proxy, que consiste na parte `proxied_krb_user` do usuário e na parte `%` do host.

   O valor `@@proxy_user` indica o nome completo da conta usada para fazer a conexão com o servidor MySQL, que consiste na parte `bredon@MYSQL.LOCAL` do usuário e na parte `%` do host.

Isso demonstra que o proxy ocorre através da conta de usuário proxy `bredon@MYSQL.LOCAL`, e que `bredon@MYSQL.LOCAL` assume os privilégios concedidos à conta de usuário proxy `proxied_krb_user`.

Uma vez obtido o TGT, ele é armazenado no lado do cliente e pode ser usado até expirar sem precisar especificar a senha novamente. No entanto, independentemente de como o TGT é obtido, o plugin do lado do cliente usa-o para adquirir ingressos de serviço e se comunicar com o plugin do lado do servidor.

::: info Nota

Quando o próprio plugin de autenticação do lado do cliente obtém o TGT, o usuário do cliente pode não querer que o TGT seja reutilizado. Como descrito no Parâmetros de configuração do cliente para autenticação LDAP, o arquivo local `/etc/krb5.conf` pode ser usado para fazer com que o plugin do lado do cliente destrua o TGT quando ele estiver pronto.

:::

O plugin do lado do servidor não tem acesso ao TGT em si ou à senha Kerberos usada para obtê-lo.

Os plugins de autenticação LDAP não têm controle sobre o mecanismo de cache (armazenamento em um arquivo local, na memória, etc.), mas as ferramentas Kerberos, como o **kswitch**, podem estar disponíveis para esse propósito.

###### Parâmetros de Configuração do Cliente para Autenticação LDAP

O plugin de autenticação LDAP SASL do lado do cliente `authentication_ldap_sasl_client` lê o arquivo local `/etc/krb5.conf`. Se esse arquivo estiver ausente ou inacessível, ocorrerá um erro. Supondo que o arquivo esteja acessível, ele pode incluir uma seção opcional `[appdefaults]` para fornecer informações usadas pelo plugin. Coloque as informações dentro da parte `mysql` da seção. Por exemplo:

```
[appdefaults]
  mysql = {
    ldap_server_host = "ldap_host.example.com"
    ldap_destroy_tgt = true
  }
```

O plugin do lado do cliente reconhece esses parâmetros na seção `mysql`:

* O valor `ldap_server_host` especifica o host do servidor LDAP e pode ser útil quando esse host difere do host do servidor KDC especificado na seção `[realms]`. Por padrão, o plugin usa o host do servidor KDC como o host do servidor LDAP.
* O valor `ldap_destroy_tgt` indica se o plugin do lado do cliente destrói o TGT após obtê-lo e usá-lo. Por padrão, `ldap_destroy_tgt` é `false`, mas pode ser definido para `true` para evitar a reutilização do TGT. (Essa configuração aplica-se apenas aos TGTs criados pelo plugin do lado do cliente, não aos TGTs criados por outros plugins ou externamente ao MySQL.)

##### Referência de Busca LDAP

Um servidor LDAP pode ser configurado para delegar buscas LDAP para outro servidor LDAP, uma funcionalidade conhecida como referência LDAP. Suponha que o servidor `a.example.com` contenha um DN raiz `dc=example,dc=com` e queira delegar buscas para outro servidor `b.example.com`. Para habilitar isso, `a.example.com` seria configurado com um objeto de referência nomeado com esses atributos:

```
dn: dc=subtree,dc=example,dc=com
objectClass: referral
objectClass: extensibleObject
dc: subtree
ref: ldap://b.example.com/dc=subtree,dc=example,dc=com
```

Um problema ao habilitar a referência LDAP é que as pesquisas podem falhar com erros de operação do LDAP quando a base de busca DN é o DN raiz e os objetos de referência não estão configurados. Um DBA do MySQL pode querer evitar tais erros de referência para os plugins de autenticação LDAP, mesmo que a referência LDAP possa estar configurada globalmente no arquivo de configuração `ldap.conf`. Para configurar de forma específica para um plugin se o servidor LDAP deve usar a referência LDAP ao se comunicar com cada plugin, defina as variáveis de sistema `authentication_ldap_simple_referral` e `authentication_ldap_sasl_referral`. Definir qualquer uma das variáveis para `ON` ou `OFF` faz com que o plugin de autenticação LDAP informe ao servidor LDAP se deve usar a referência durante a autenticação do MySQL. Cada variável tem um efeito específico para um plugin e não afeta outras aplicações que se comunicam com o servidor LDAP. Ambas as variáveis estão definidas como `OFF` por padrão.