#### 8.4.1.8 Autenticação Conectada a Kerberos

::: info Nota

A autenticação conectada a Kerberos é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para obter mais informações sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

:::

A Edição Empresarial do MySQL suporta um método de autenticação que permite que os usuários se autentiquem no MySQL Server usando Kerberos, desde que os ingressos Kerberos apropriados estejam disponíveis ou possam ser obtidos.

Este método de autenticação está disponível no MySQL 8.4 para servidores e clientes do MySQL no Linux. É útil em ambientes Linux onde as aplicações têm acesso ao Microsoft Active Directory, que tem Kerberos habilitado por padrão. O plugin do lado do cliente também é suportado no Windows. O plugin do lado do servidor ainda é suportado apenas no Linux.

A autenticação conectada a Kerberos oferece essas capacidades:

* Autenticação externa: A autenticação Kerberos permite que o MySQL Server aceite conexões de usuários definidos fora das tabelas de concessão do MySQL que obtiveram os ingressos Kerberos apropriados.
* Segurança: O Kerberos usa ingressos juntamente com criptografia de chave simétrica, permitindo a autenticação sem enviar senhas pela rede. A autenticação Kerberos suporta cenários sem usuário e sem senha.

A tabela a seguir mostra os nomes dos arquivos do plugin e da biblioteca. O sufixo do nome do arquivo pode diferir no seu sistema. O arquivo deve estar localizado no diretório nomeado pela variável de sistema `plugin_dir`. Para informações de instalação, consulte Instalando Autenticação Conectada a Kerberos.

**Tabela 8.23 Nomes de Plugin e Biblioteca para Autenticação Kerberos**

<table><thead><tr> <th>Plugin ou Arquivo</th> <th>Nome do Plugin ou Arquivo</th> </tr></thead><tbody><tr> <td>Plugin do lado do servidor</td> <td><code>authentication_kerberos</code></td> </tr><tr> <td>Plugin do lado do cliente</td> <td><code>authentication_kerberos_client</code></td> </tr><tr> <td>Arquivo de biblioteca</td> <td><code>authentication_kerberos.so</code>, <code>authentication_kerberos_client.so</code></td> </tr></tbody></table>

O plugin de autenticação Kerberos do lado do servidor está incluído apenas na Edição Empresarial do MySQL. Ele não está incluído nas distribuições comunitárias do MySQL. O plugin do lado do cliente está incluído em todas as distribuições, incluindo as distribuições comunitárias. Isso permite que clientes de qualquer distribuição se conectem a um servidor que tenha o plugin do lado do servidor carregado.

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação de plugabilidade Kerberos:

*  Pré-requisitos para Autenticação de Plugabilidade Kerberos
*  Como a Autenticação Kerberos dos Usuários do MySQL Funciona
*  Instalando a Autenticação de Plugabilidade Kerberos
*  Usando a Autenticação de Plugabilidade Kerberos
*  Depuração da Autenticação Kerberos

Para informações gerais sobre autenticação plugabilidade no MySQL, consulte a Seção 8.2.17, “Autenticação Plugavel”.

##### Pré-requisitos para Autenticação de Plugabilidade Kerberos

Para usar a autenticação de plugabilidade Kerberos para o MySQL, esses pré-requisitos devem ser atendidos:

* Um serviço Kerberos deve estar disponível para que os plugins de autenticação Kerberos possam se comunicar.
* Cada usuário Kerberos (princípio) a ser autenticado pelo MySQL deve estar presente no banco de dados gerenciado pelo servidor KDC.
* Uma biblioteca de cliente Kerberos deve estar disponível nos sistemas onde o plugin de autenticação Kerberos do lado do servidor ou do lado do cliente é usado. Além disso, o GSSAPI é usado como interface para acessar a autenticação Kerberos, então uma biblioteca GSSAPI deve estar disponível.

##### Como a Autenticação Kerberos dos Usuários do MySQL Funciona

Esta seção fornece uma visão geral de como o MySQL e o Kerberos trabalham juntos para autenticar usuários do MySQL. Para exemplos que mostram como configurar contas do MySQL para usar os plugins de autenticação do Kerberos, consulte Usar o Kerberos Pluggable Authentication.

Aqui, assume-se que o usuário está familiarizado com os conceitos e o funcionamento do Kerberos. A lista a seguir define brevemente vários termos comuns do Kerberos. Você também pode achar útil a seção Glossário do [RFC 4120](https://tools.ietf.org/html/rfc4120).

*  Principal: Uma entidade nomeada, como um usuário ou servidor. Neste contexto, certos termos relacionados aos principais ocorrem com frequência:

  +  SPN: Nome do principal do serviço; o nome de um principal que representa um serviço.
  +  UPN: Nome do principal do usuário; o nome de um principal que representa um usuário.
*  KDC: O centro de distribuição de chaves, composto pelo AS e pelo TGS:

  +  AS: O servidor de autenticação; fornece o ticket de concessão inicial de ticket necessário para obter tickets adicionais.
  +  TGS: O servidor de concessão de ticket; fornece tickets adicionais aos clientes do Kerberos que possuem um TGT válido.
*  TGT: O ticket de concessão de ticket; apresentado ao TGS para obter tickets de serviço para o acesso ao serviço.
*  ST: Um ticket de serviço; fornece acesso a um serviço, como o oferecido por um servidor MySQL.

A autenticação usando o Kerberos requer um servidor KDC, por exemplo, como fornecido pelo Microsoft Active Directory.

A autenticação do Kerberos no MySQL usa a Interface de Programação de Serviço de Segurança Genérico (GSSAPI), que é uma interface de abstração de segurança. O Kerberos é uma instância de um protocolo de segurança específico que pode ser usado através dessa interface abstrata. Usando o GSSAPI, os aplicativos autenticam-se para o Kerberos para obter credenciais de serviço e, em seguida, usam essas credenciais para, por sua vez, habilitar o acesso seguro a outros serviços.

No Windows, o plugin de autenticação `authentication_kerberos_client` suporta dois modos, que o usuário do cliente pode definir em tempo de execução ou especificar em um arquivo de opção:

* Modo `SSPI`: A Security Support Provider Interface (SSPI) implementa o GSSAPI (consulte os comandos para clientes Windows no modo SSPI). O SSPI, embora seja compatível com o GSSAPI no nível de cabo, só suporta o cenário de login único no Windows e se refere especificamente ao usuário logado. O SSPI é o modo padrão na maioria dos clientes Windows.
* Modo `GSSAPI`: Suporta o GSSAPI através da biblioteca MIT Kerberos no Windows (consulte os comandos para clientes Windows no modo GSSAPI).

Com os plugins de autenticação Kerberos, aplicativos e servidores MySQL podem usar o protocolo de autenticação Kerberos para autenticar mutuamente usuários e serviços MySQL. Dessa forma, tanto o usuário quanto o servidor podem verificar a identidade um do outro. Nenhuma senha é enviada pela rede e as mensagens do protocolo Kerberos são protegidas contra interceptação e ataques de replay.

A autenticação Kerberos segue estes passos, onde as partes do lado do servidor e do cliente são realizadas usando os plugins de autenticação `authentication_kerberos` e `authentication_kerberos_client`, respectivamente:

1. O servidor MySQL envia ao aplicativo cliente o nome do principal de serviço. Este SPN deve estar registrado no sistema Kerberos e é configurado no lado do servidor usando a variável de sistema `authentication_kerberos_service_principal`.
2. Usando o GSSAPI, o aplicativo cliente cria uma sessão de autenticação do lado do cliente Kerberos e troca mensagens Kerberos com o KDC Kerberos:

   * O cliente obtém um ticket de concessão de ticket do servidor de autenticação.
   * Usando o TGT, o cliente obtém um ticket de serviço para MySQL do serviço de concessão de ticket.

Este passo pode ser ignorado ou parcialmente ignorado se o TGT, o ST ou ambos já estiverem armazenados localmente no cache. O aplicativo cliente pode, opcionalmente, usar um arquivo de chavetab do cliente para obter um TGT e um ST sem fornecer uma senha.
3. Usando o GSSAPI, o aplicativo cliente apresenta o ST do MySQL ao servidor MySQL.
4. Usando o GSSAPI, o servidor MySQL cria uma sessão de autenticação no lado do servidor com Kerberos. O servidor valida a identidade do usuário e a validade do pedido do usuário. Ele autentica o ST usando a chave de serviço configurada em seu arquivo de chavetab de serviço para determinar se a autenticação é bem-sucedida ou não, e retorna o resultado da autenticação ao cliente.

As aplicações podem se autenticar usando um nome de usuário e senha fornecidos ou usando um TGT ou ST armazenados localmente no cache (por exemplo, criados usando `kinit` ou algo semelhante). Esse design, portanto, abrange casos de uso que vão desde conexões completamente sem usuário e sem senha, onde os ingressos de serviço Kerberos são obtidos de um cache local de Kerberos, até conexões onde o nome de usuário e a senha são fornecidos e usados para obter um ingresso de serviço Kerberos válido de um KDC, para enviar ao servidor MySQL.

Como indicado na descrição anterior, a autenticação Kerberos do MySQL usa dois tipos de arquivos de chavetab:

* No host do cliente, um arquivo de chavetab do cliente pode ser usado para obter um TGT e um ST sem fornecer uma senha. Consulte Parâmetros de Configuração do Cliente para Autenticação Kerberos.
* No host do servidor MySQL, um arquivo de chavetab de serviço no lado do servidor é usado para verificar ingressos de serviço recebidos pelo servidor MySQL de clientes. O nome do arquivo de chavetab é configurado usando a variável de sistema `authentication_kerberos_service_key_tab`.

Para informações sobre arquivos de chavetab, consulte <https://web.mit.edu/kerberos/krb5-latest/doc/basic/keytab_def.html>.

##### Instalando Kerberos Pluggable Authentication

Esta seção descreve como instalar o plugin de autenticação Kerberos no lado do servidor. Para informações gerais sobre como instalar plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

::: info Nota

O plugin no lado do servidor é suportado apenas em sistemas Linux. Em sistemas Windows, apenas o plugin no lado do cliente é suportado, que pode ser usado em um sistema Windows para se conectar a um servidor Linux que usa autenticação Kerberos.

:::

Para ser utilizável pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` na inicialização do servidor.

O nome base do arquivo da biblioteca do plugin no lado do servidor é `authentication_kerberos`. O sufixo do nome do arquivo para sistemas Unix e sistemas semelhantes ao Unix é `.so`.

Para carregar o plugin na inicialização do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com esse método de carregamento de plugins, a opção deve ser fornecida toda vez que o servidor iniciar. Além disso, especifique valores para quaisquer variáveis de sistema fornecidas pelo plugin que você deseja configurar. O plugin expõe essas variáveis de sistema, permitindo que sua operação seja configurada:

*  `authentication_kerberos_service_principal`: O nome do principal do serviço MySQL (SPN). Esse nome é enviado aos clientes que tentam autenticar usando Kerberos. O SPN deve estar presente no banco de dados gerenciado pelo servidor KDC. O padrão é `mysql/host_name@realm_name`.
*  `authentication_kerberos_service_key_tab`: O arquivo keytab para autenticar ingressos recebidos de clientes. Esse arquivo deve existir e conter uma chave válida para o SPN, ou a autenticação dos clientes falhará. O padrão é `mysql.keytab` no diretório de dados.

Para detalhes sobre todas as variáveis de sistema de autenticação Kerberos, consulte a Seção 8.4.1.13, “Variáveis do Sistema de Autenticação Personalizável”.

Para carregar o plugin e configurá-lo, coloque linhas como estas no seu arquivo `my.cnf`, usando valores para as variáveis do sistema que sejam apropriadas para sua instalação:

```
[mysqld]
plugin-load-add=authentication_kerberos.so
authentication_kerberos_service_principal=mysql/krbauth.example.com@MYSQL.LOCAL
authentication_kerberos_service_key_tab=/var/mysql/data/mysql.keytab
```

Após modificar o `my.cnf`, reinicie o servidor para fazer com que as novas configurações entrem em vigor.

Alternativamente, para carregar o plugin em tempo de execução, use esta declaração:

```
INSTALL PLUGIN authentication_kerberos
  SONAME 'authentication_kerberos.so';
```

`INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela `mysql.plugins` do sistema para fazer com que o servidor o carregue para cada inicialização normal subsequente, sem a necessidade de `--plugin-load-add`.

Quando você instala o plugin em tempo de execução sem configurar suas variáveis do sistema no arquivo `my.cnf`, a variável do sistema `authentication_kerberos_service_key_tab` é definida para o valor padrão de `mysql.keytab` no diretório de dados. O valor desta variável do sistema não pode ser alterado em tempo de execução, então, se você precisar especificar um arquivo diferente, você precisa adicionar a configuração ao seu arquivo `my.cnf` e, em seguida, reiniciar o servidor MySQL. Por exemplo:

```
[mysqld]
authentication_kerberos_service_key_tab=/var/mysql/data/mysql.keytab
```

Se o arquivo keytab não estiver no lugar correto ou não contiver uma chave SPN válida, o servidor MySQL não valida isso, mas os clientes retornam erros de autenticação até que você resolva o problema.

A variável do sistema `authentication_kerberos_service_principal` pode ser definida e persistente em tempo de execução sem reiniciar o servidor, usando uma declaração `SET PERSIST`:

```
SET PERSIST authentication_kerberos_service_principal='mysql/krbauth.example.com@MYSQL.LOCAL';
```

`SET PERSIST` define um valor para a instância MySQL em execução. Também salva o valor, fazendo com que ele seja carregado em reinicializações subsequentes do servidor. Para alterar um valor para a instância MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`. Veja a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

Para verificar a instalação do plugin, examine a tabela do Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (veja a Seção 7.6.2, “Obtendo Informações de Plugins do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME = 'authentication_kerberos';
+-------------------------+---------------+
| PLUGIN_NAME             | PLUGIN_STATUS |
+-------------------------+---------------+
| authentication_kerberos | ACTIVE        |
+-------------------------+---------------+
```

Se um plugin não conseguir se inicializar, verifique o log de erros do servidor em busca de mensagens de diagnóstico.

Para associar contas do MySQL ao plugin Kerberos, consulte Usar autenticação pluga de Kerberos.

##### Usar autenticação pluga de Kerberos

Esta seção descreve como habilitar contas do MySQL para se conectarem ao servidor MySQL usando autenticação pluga de Kerberos. Assume-se que o servidor está sendo executado com o plugin do lado do servidor habilitado, conforme descrito em Instalar autenticação pluga de Kerberos, e que o plugin do lado do cliente está disponível no host do cliente.

* Verificar a disponibilidade do Kerberos
* Criar uma conta do MySQL que use autenticação Kerberos
* Usar a conta do MySQL para se conectar ao servidor MySQL
* Parâmetros de configuração do cliente para autenticação Kerberos

###### Verificar disponibilidade do Kerberos

O exemplo a seguir mostra como testar a disponibilidade do Kerberos no Active Directory. O exemplo faz as seguintes suposições:

* O Active Directory está sendo executado no host chamado `krbauth.example.com` com o endereço IP `198.51.100.11`.
* A autenticação Kerberos relacionada ao MySQL usa o domínio `MYSQL.LOCAL` e também usa `MYSQL.LOCAL` como o nome do domínio.
* Uma principal chamada `karl@MYSQL.LOCAL` está registrada no KDC. (Em uma discussão posterior, esse nome de principal será associado à conta do MySQL que autentica-se ao servidor MySQL usando Kerberos.)

Com essas suposições atendidas, siga este procedimento:

1. Verifique se a biblioteca Kerberos está instalada e configurada corretamente no sistema operacional. Por exemplo, para configurar um domínio e um nome de domínio `MYSQL.LOCAL` para uso durante a autenticação do MySQL, o arquivo de configuração Kerberos `/etc/krb5.conf` deve conter algo como:

   ```
   [realms]
     MYSQL.LOCAL = {
       kdc = krbauth.example.com
       admin_server = krbauth.example.com
       default_domain = MYSQL.LOCAL
     }
   ```
2. Você pode precisar adicionar uma entrada no `/etc/hosts` para o host do servidor:

   ```
   198.51.100.11 krbauth krbauth.example.com
   ```
3. Verifique se a autenticação Kerberos funciona corretamente:

   1. Use `kinit` para autenticar-se no Kerberos:

      ```
      $> kinit karl@MYSQL.LOCAL
      Password for karl@MYSQL.LOCAL: (enter password here)
      ```

O comando autentica para o principal Kerberos nomeado `karl@MYSQL.LOCAL`. Insira a senha do principal quando o comando solicitar. O KDC retorna um TGT que é armazenado no lado do cliente para uso por outras aplicações que reconhecem o Kerberos.
1. Use `klist` para verificar se o TGT foi obtido corretamente. A saída deve ser semelhante a esta:

```
      $> klist
      Ticket cache: FILE:/tmp/krb5cc_244306
      Default principal: karl@MYSQL.LOCAL

      Valid starting       Expires              Service principal
      03/23/2021 08:18:33  03/23/2021 18:18:33  krbtgt/MYSQL.LOCAL@MYSQL.LOCAL
      ```

###### Crie uma Conta MySQL que Use Autenticação Kerberos

A autenticação do MySQL usando o plugin de autenticação `authentication_kerberos` é baseada em um nome de principal de usuário Kerberos (UPN). As instruções aqui assumem que um usuário MySQL nomeado `karl` se autentica no MySQL usando Kerberos, que o domínio Kerberos é nomeado `MYSQL.LOCAL` e que o nome do principal de usuário é `karl@MYSQL.LOCAL`. Este UPN deve ser registrado em vários lugares:

* O administrador do Kerberos deve registrar o nome do usuário como um principal Kerberos. Esse nome inclui um nome de domínio. Os clientes usam o nome do principal e a senha para se autenticar com o Kerberos e obter um ticket-granting ticket (TGT).
* O DBA do MySQL deve criar uma conta que corresponda ao nome do principal Kerberos e que se autentique usando o plugin Kerberos.

Assuma que o nome do principal de usuário Kerberos foi registrado pelo administrador do serviço apropriado, e que, como descrito anteriormente em Instalando Kerberos Pluggable Authentication, o servidor MySQL foi iniciado com configurações apropriadas para o plugin Kerberos do lado do servidor. Para criar uma conta MySQL que corresponda a um UPN Kerberos de `user@realm_name`, o DBA do MySQL usa uma declaração como esta:

```
CREATE USER user
  IDENTIFIED WITH authentication_kerberos
  BY 'realm_name';
```

A conta nomeada por *`user`* pode incluir ou omitir a parte do nome do host. Se o nome do host for omitido, ele será preenchido com `%` como de costume. O *`realm_name`* é armazenado como o valor `authentication_string` para a conta na tabela `mysql.user` do sistema.

Para criar uma conta MySQL que corresponda ao UPN `karl@MYSQL.LOCAL`, use esta declaração:

```
CREATE USER 'karl'
  IDENTIFIED WITH authentication_kerberos
  BY 'MYSQL.LOCAL';
```

Se o MySQL precisar construir o UPN para essa conta, por exemplo, para obter ou validar ingressos (TGTs ou STs), ele faz isso combinando o nome da conta (ignorando qualquer parte do nome do host) e o nome do domínio. Por exemplo, o nome completo da conta resultante da declaração anterior `CREATE USER` é `'karl'@'%'`. O MySQL constrói o UPN a partir da parte do nome de usuário `karl` (ignorando a parte do nome do host) e do nome do domínio `MYSQL.LOCAL` para produzir `karl@MYSQL.LOCAL`.

::: info Nota

Observe que, ao criar uma conta que autentica usando `authentication_kerberos`, a declaração `CREATE USER` não inclui o domínio do UPN como parte do nome de usuário. Em vez disso, especifique o domínio (`MYSQL.LOCAL` neste caso) como a string de autenticação na cláusula `BY`. Isso difere da criação de contas que usam o plugin de autenticação LDAP SASL `authentication_ldap_sasl` com o método de autenticação GSSAPI/Kerberos. Para tais contas, a declaração `CREATE USER` inclui o domínio do UPN como parte do nome de usuário. Veja Como criar uma conta MySQL que usa GSSAPI/Kerberos para autenticação LDAP.

:::

Com a conta configurada, os clientes podem usá-la para se conectar ao servidor MySQL. O procedimento depende se o host do cliente executa Linux ou Windows, conforme indicado na discussão a seguir.

O uso de `authentication_kerberos` está sujeito à restrição de que UPNs com a mesma parte do usuário, mas uma parte do domínio diferente, não são suportados. Por exemplo, você não pode criar contas MySQL que correspondam a esses dois UPNs:

```
kate@MYSQL.LOCAL
kate@EXAMPLE.COM
```

Ambos os UPNs têm uma parte do usuário de `kate`, mas diferem na parte do domínio (`MYSQL.LOCAL` versus `EXAMPLE.COM`). Isso é proibido.

###### Use a Conta MySQL para Conectar-se ao Servidor MySQL

Após configurar uma conta MySQL que autentica usando Kerberos, os clientes podem usá-la para se conectar ao servidor MySQL da seguinte forma:

1. Autentique-se no Kerberos com o nome do principal de usuário (UPN) e sua senha para obter um ticket de concessão de acesso (TGT).
2. Use o TGT para obter um ticket de serviço (ST) para o MySQL.
3. Autentique-se no servidor MySQL apresentando o ST do MySQL.

O primeiro passo (autenticação no Kerberos) pode ser realizado de várias maneiras:

* Antes de se conectar ao MySQL:

  + No Linux ou no Windows no modo `GSSAPI`, inicie o `kinit` para obter o TGT e salve-o no cache de credenciais do Kerberos.
  + No Windows no modo `SSPI`, a autenticação já pode ter sido realizada no momento do login, o que salva o TGT para o usuário logado no cache de memória do Windows. O `kinit` não é usado e não há cache do Kerberos.
* Ao se conectar ao MySQL, o próprio programa cliente pode obter o TGT, se puder determinar o UPN e a senha do Kerberos necessários:

  + Essas informações podem vir de fontes como opções de comando ou o sistema operacional.
  + No Linux, os clientes também podem usar um arquivo `keytab` ou o arquivo de configuração `/etc/krb5.conf`. Os clientes do Windows no modo `GSSAPI` usam um arquivo de configuração. Os clientes do Windows no modo `SSPI` não usam nenhum.

Os detalhes dos comandos do cliente para se conectar ao servidor MySQL diferem para Linux e Windows, então cada tipo de host é discutido separadamente, mas essas propriedades dos comandos se aplicam independentemente do tipo de host:

* Cada comando mostrado inclui as seguintes opções, mas cada uma pode ser omitida sob certas condições:

+ A opção `--default-auth` especifica o nome do plugin de autenticação do lado do cliente (`authentication_kerberos_client`). Esta opção pode ser omitida quando a opção `--user` é especificada, pois, nesse caso, o MySQL pode determinar o plugin a partir das informações da conta de usuário enviadas pelo servidor MySQL.
  + A opção `--plugin-dir` indica ao programa cliente o local do plugin `authentication_kerberos_client`. Esta opção pode ser omitida se o plugin estiver instalado na localização padrão (incorporada).
* Os comandos também devem incluir quaisquer outras opções, como `--host` ou `--port`, que são necessárias para especificar qual servidor MySQL se conectar.
* Insira cada comando em uma única linha. Se o comando incluir uma opção `--password` para solicitar uma senha, insira a senha do UPN Kerberos associado à conta de usuário do MySQL quando solicitado.

**Comandos de Conexão para Clientes Linux**

No Linux, o comando apropriado para o cliente para se conectar ao servidor MySQL varia dependendo se o comando autentica usando um TGT do cache Kerberos ou com base em opções de comando para o nome do usuário do MySQL e a senha do UPN:

* Antes de invocar o programa cliente MySQL, o usuário do cliente pode obter um TGT do KDC independentemente do MySQL. Por exemplo, o usuário do cliente pode usar `kinit` para autenticar-se no Kerberos fornecendo um nome de principal de usuário Kerberos e a senha principal:

  ```
  $> kinit karl@MYSQL.LOCAL
  Password for karl@MYSQL.LOCAL: (enter password here)
  ```

  O TGT resultante para o UPN é armazenado no cache e torna-se disponível para uso por outras aplicações conscientes do Kerberos, como programas que usam o plugin de autenticação Kerberos do lado do cliente. Neste caso, inicie o cliente sem especificar uma opção de nome de usuário ou senha:

  ```
  mysql
    --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
  ```

  O plugin do lado do cliente encontra o TGT no cache, usa-o para obter um ST MySQL e usa o ST para autenticar-se no servidor MySQL.

Como descrito anteriormente, quando o TGT para o UPN é armazenado na cache, as opções de nome de usuário e senha não são necessárias no comando do cliente. Se o comando incluir essas opções de qualquer maneira, elas são tratadas da seguinte forma:

+ Este comando inclui uma opção de nome de usuário:

    ```
    mysql
      --default-auth=authentication_kerberos_client
      --plugin-dir=path/to/plugin/directory
      --user=karl
    ```

    Neste caso, a autenticação falha se o nome de usuário especificado pela opção não corresponder à parte do UPN no TGT.
+ Este comando inclui uma opção de senha, que você digita quando solicitado:

    ```
    mysql
      --default-auth=authentication_kerberos_client
      --plugin-dir=path/to/plugin/directory
      --password
    ```

    Neste caso, o plugin do lado do cliente ignora a senha. Como a autenticação é baseada no TGT, ela pode ser bem-sucedida *mesmo que a senha fornecida pelo usuário seja incorreta*. Por essa razão, o plugin produz uma mensagem de aviso se um TGT válido for encontrado que faz com que a senha seja ignorada.
* Se a cache do Kerberos não contiver nenhum TGT, o próprio plugin de autenticação Kerberos do lado do cliente pode obter o TGT do KDC. Inicie o cliente com as opções para o nome de usuário do MySQL e a senha, e então insira a senha do UPN quando solicitado:

    ```
  mysql --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --user=karl
    --password
  ```

    O plugin de autenticação Kerberos do lado do cliente combina o nome de usuário (`karl`) e o domínio especificado na conta do usuário (`MYSQL.LOCAL`) para construir o UPN (`karl@MYSQL.LOCAL`). O plugin do lado do cliente usa o UPN e a senha para obter um TGT, usa o TGT para obter um ST do MySQL e usa o ST para autenticar-se no servidor MySQL.

Ou, suponha que a cache do Kerberos não contenha nenhum TGT e o comando especifique uma opção de senha, mas nenhuma opção de nome de usuário:

    ```
  mysql --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --password
  ```

    O plugin de autenticação Kerberos do lado do cliente usa o nome de login do sistema operacional como o nome de usuário do MySQL. Ele combina esse nome de usuário e o domínio na conta do usuário do MySQL para construir o UPN. O plugin do lado do cliente usa o UPN e a senha para obter um TGT, usa o TGT para obter um ST do MySQL e usa o ST para autenticar-se no servidor MySQL.

Se você não tiver certeza se um TGT existe, você pode usar `klist` para verificar.

::: info Nota

Quando o próprio plugin de autenticação Kerberos do lado do cliente obtém o TGT, o usuário do cliente pode não querer que o TGT seja reutilizado. Como descrito no Parâmetros de configuração do cliente para autenticação Kerberos, o arquivo local `/etc/krb5.conf` pode ser usado para fazer o plugin do lado do cliente destruir o TGT quando ele estiver pronto.

:::

**Comandos de Conexão para Clientes Windows no Modo SSPI**

No Windows, usando a opção padrão do plugin do lado do cliente (SSPI), o comando apropriado para conectar ao servidor MySQL varia dependendo se o comando autentica com base nas opções de comando para o nome de usuário do MySQL e a senha UPN, ou em vez disso, usa um TGT do cache em memória do Windows. Para detalhes sobre o modo GSSAPI no Windows, consulte Comandos para Clientes Windows no Modo GSSAPI.

Um comando pode especificar explicitamente opções para o nome de usuário do MySQL e a senha UPN, ou o comando pode omitir essas opções:

* Este comando inclui opções para o nome de usuário do MySQL e a senha UPN:

  ```
  mysql --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --user=karl
    --password
  ```

  O plugin de autenticação Kerberos do lado do cliente combina o nome de usuário (`karl`) e o domínio especificado na conta de usuário (`MYSQL.LOCAL`) para construir a UPN (`karl@MYSQL.LOCAL`). O plugin do lado do cliente usa a UPN e a senha para obter um TGT, usa o TGT para obter um ST do MySQL, e usa o ST para autenticar-se no servidor MySQL.

Qualquer informação no cache em memória do Windows é ignorada; os valores das opções de nome de usuário e senha têm precedência.
* Este comando inclui uma opção para a senha UPN, mas não para o nome de usuário do MySQL:

  ```
  mysql
    --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --password
  ```

  O plugin de autenticação Kerberos do lado do cliente usa o nome de usuário logado como o nome de usuário do MySQL e combina esse nome de usuário e o domínio na conta do usuário do MySQL para construir a UPN. O plugin do lado do cliente usa a UPN e a senha para obter um TGT, usa o TGT para obter um ST do MySQL, e usa o ST para autenticar-se no servidor MySQL.
* Este comando não inclui nenhuma opção para o nome de usuário ou senha do MySQL:

O plugin do lado do cliente obtém o TGT do cache em memória do Windows, usa o TGT para obter um ST do MySQL e usa o ST para autenticar-se no servidor MySQL.

Essa abordagem exige que o host do cliente faça parte do domínio do Active Directory (AD) do Windows Server. Se isso não for o caso, ajude o cliente MySQL a descobrir o endereço IP do domínio AD, digitando manualmente o servidor e o domínio do AD como servidor e prefixo DNS:

1. Inicie o `console.exe` e selecione o Centro de Rede e Compartilhamento.
2. Na barra lateral da janela do Centro de Rede e Compartilhamento, selecione Alterar configurações do adaptador.
3. Na janela Conexões de Rede, clique com o botão direito na conexão de rede ou VPN para configurar e selecionar Propriedades.
4. Na guia Rede, localize e clique em Protocolo de Internet versão 4 (TCP/IPv4) e, em seguida, clique em Propriedades.
5. Clique em Avançado no diálogo Propriedades do Protocolo de Internet versão 4 (TCP/IPv4). O diálogo Configurações TCP/IP Avançadas é aberto.
6. Na guia DNS, adicione o servidor e o domínio do Active Directory como servidor e prefixo DNS.
* Esse comando inclui uma opção para o nome do usuário MySQL, mas não para a senha UPN:

  ```
  mysql
    --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
  ```

O plugin de autenticação Kerberos do lado do cliente compara o nome especificado pela opção nome_do_usuario com o nome do usuário logado. Se os nomes forem os mesmos, o plugin usa o TGT do usuário logado para autenticação. Se os nomes forem diferentes, a autenticação falha.

**Comandos de Conexão para Clientes Windows no Modo GSSAPI**

No Windows, o usuário do cliente deve especificar explicitamente o modo `GSSAPI` usando a opção do plugin `plugin_authentication_kerberos_client_mode` para habilitar o suporte através da biblioteca MIT Kerberos. O modo padrão é `SSPI` (veja Comandos para clientes Windows no modo SSPI).

É possível especificar o modo `GSSAPI`:
* Antes de invocar o programa do cliente MySQL em um arquivo de opção. O nome da variável do plugin é válido usando underscores ou hífens:

  ```
  mysql
    --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --user=karl
  ```

Ou:

```
  [mysql]
  plugin_authentication_kerberos_client_mode=GSSAPI
  ```
* Em tempo de execução a partir da linha de comando usando os programas de cliente `mysql` ou `mysqldump`. Por exemplo, os seguintes comandos (com sublinhados ou travessões) fazem com que o `mysql` se conecte ao servidor através da biblioteca MIT Kerberos no Windows.

  ```
  [mysql]
  plugin-authentication-kerberos-client-mode=GSSAPI
  ```

  Ou:

  ```
  mysql [connection-options] --plugin_authentication_kerberos_client_mode=GSSAPI
  ```
* Os usuários do cliente podem selecionar o modo `GSSAPI` no MySQL Workbench e em alguns conectores do MySQL. Em hosts cliente que executam o Windows, você pode substituir a localização padrão de:

  + O arquivo de configuração Kerberos definindo a variável de ambiente `KRB5_CONFIG`.
  + O nome padrão do cache de credenciais com a variável de ambiente `KRB5CCNAME` (por exemplo, `KRB5CCNAME=DIR:/mydir/`).

  Para informações específicas sobre plugins do lado do cliente, consulte a documentação em  https://dev.mysql.com/doc/.

O comando apropriado do cliente para se conectar ao servidor MySQL varia dependendo se o comando autentica usando um TGT do cache MIT Kerberos ou com base nas opções de comando para o nome de usuário do MySQL e a senha UPN. O suporte GSSAPI através da biblioteca MIT no Windows é semelhante ao GSSAPI no Linux (veja Comandos para clientes Linux), com as seguintes exceções:

* Os ingressos são sempre recuperados ou colocados no cache MIT Kerberos em hosts que executam o Windows.
* O `kinit` é executado com Contas Funcionais em Windows que têm permissões restritas e papéis específicos. O usuário do cliente não conhece a senha do `kinit`. Para uma visão geral, consulte <https://docs.oracle.com/en/java/javase/11/tools/kinit.html>.
* Se o usuário do cliente fornecer uma senha, a biblioteca MIT Kerberos no Windows decide se deve usá-la ou confiar no ingresso existente.
* O parâmetro `destroy_tickets`, descrito em Parâmetros de Configuração do Cliente para Autenticação Kerberos, não é suportado porque a biblioteca MIT Kerberos no Windows não suporta o membro da API requerido (`get_profile_boolean`) para ler seu valor do arquivo de configuração.

###### Parâmetros de Configuração do Cliente para Autenticação Kerberos

Esta seção aplica-se apenas a hosts clientes que executam Linux, não a hosts clientes que executam Windows.

::: info Nota

Um host cliente que executa Windows com o plugin Kerberos de lado do cliente `authentication_kerberos_client` configurado no modo `GSSAPI` suporta, em geral, os parâmetros de configuração do cliente, mas a biblioteca MIT Kerberos no Windows não suporta o parâmetro `destroy_tickets` descrito nesta seção.

:::

Se não existir um ticket-granting ticket (TGT) válido no momento da invocação do aplicativo cliente MySQL, o próprio aplicativo pode obter e armazenar o TGT. Se, durante o processo de autenticação Kerberos, o aplicativo cliente causar que um TGT seja armazenado em cache, qualquer TGT adicionado pode ser destruído após não ser mais necessário, definindo o parâmetro de configuração apropriado.

O plugin Kerberos de lado do cliente `authentication_kerberos_client` lê o arquivo local `/etc/krb5.conf`. Se este arquivo estiver ausente ou inacessível, ocorrerá um erro. Supondo que o arquivo esteja acessível, ele pode incluir uma seção opcional `[appdefaults]` para fornecer informações usadas pelo plugin. Coloque as informações dentro da parte `mysql` da seção. Por exemplo:

```
  mysql [connection-options] --plugin-authentication-kerberos-client-mode=GSSAPI
  ```

O plugin de lado do cliente reconhece esses parâmetros na seção `mysql`:

* O valor `destroy_tickets` indica se o plugin de lado do cliente destrói o TGT após obtê-lo e usá-lo. Por padrão, `destroy_tickets` é `false`, mas pode ser definido para `true` para evitar a reutilização do TGT. (Esta configuração aplica-se apenas aos TGTs criados pelo plugin de lado do cliente, não aos TGTs criados por outros plugins ou externamente ao MySQL.)

No host cliente, um arquivo de chavetab pode ser usado para obter um TGT e TS sem fornecer uma senha. Para informações sobre arquivos de chavetab, consulte <https://web.mit.edu/kerberos/krb5-latest/doc/basic/keytab_def.html>.

##### Depuração da Autenticação Kerberos

A variável de ambiente `AUTHENTICATION_KERBEROS_CLIENT_LOG` habilita ou desabilita a saída de depuração para a autenticação Kerberos.

::: info Nota

Apesar de `CLIENT` no nome `AUTHENTICATION_KERBEROS_CLIENT_LOG`, a mesma variável de ambiente se aplica ao plugin do lado do servidor, assim como ao plugin do lado do cliente.

:::

No lado do servidor, os valores permitidos são 0 (desativado) e 1 (ativado). As mensagens de log são escritas no log de erro do servidor, sujeito ao nível de granularidade de registro de erros do servidor. Por exemplo, se você estiver usando a filtragem de log com base na prioridade, a variável de sistema `log_error_verbosity` controla a granularidade, conforme descrito na Seção 7.4.2.5, “Filtragem de Log de Erro com Base em Prioridade (`log_filter_internal`)”.

No lado do cliente, os valores permitidos são de 1 a 5 e são escritos na saída padrão de erro. A tabela a seguir mostra o significado de cada valor de nível de log.

<table><thead><tr> <th>Nível de Log</th> <th>Significado</th> </tr></thead><tbody><tr> <td>1 ou não definido</td> <td>Sem registro</td> </tr><tr> <td>2</td> <td>Mensagens de erro</td> </tr><tr> <td>3</td> <td>Mensagens de erro e aviso</td> </tr><tr> <td>4</td> <td>Mensagens de erro, aviso e informações</td> </tr><tr> <td>5</td> <td>Mensagens de erro, aviso, informações e depuração</td> </tr></tbody></table>