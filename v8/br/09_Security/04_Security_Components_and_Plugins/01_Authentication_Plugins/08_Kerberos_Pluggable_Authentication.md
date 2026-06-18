#### 8.4.1.8 Autenticação Conectada ao Kerberos

Nota

A autenticação compatível com Kerberos é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL suporta um método de autenticação que permite que os usuários se autentiquem no MySQL Server usando o Kerberos, desde que os ingressos Kerberos apropriados estejam disponíveis ou possam ser obtidos.

Este método de autenticação está disponível no MySQL 8.0.26 e versões superiores, para servidores e clientes MySQL no Linux. É útil em ambientes Linux onde as aplicações têm acesso ao Microsoft Active Directory, que tem o Kerberos habilitado por padrão. A partir do MySQL 8.0.27 (MySQL 8.0.32 para Kerberos MIT), o plugin do lado do cliente também é suportado no Windows. O plugin do lado do servidor ainda é suportado apenas no Linux.

A autenticação de autenticação de Kerberos oferece essas capacidades:

- Autenticação externa: a autenticação Kerberos permite que o MySQL Server aceite conexões de usuários definidos fora das tabelas de concessão do MySQL que obtiveram os ingressos Kerberos adequados.

- Segurança: O Kerberos utiliza ingressos juntamente com criptografia de chave simétrica, permitindo a autenticação sem enviar senhas pela rede. A autenticação Kerberos suporta cenários sem usuário e sem senha.

A tabela a seguir mostra os nomes dos arquivos de plugin e biblioteca. O sufixo do nome do arquivo pode variar no seu sistema. O arquivo deve estar localizado no diretório nomeado pela variável de sistema `plugin_dir`. Para obter informações sobre a instalação, consulte Instalar Autenticação de Autenticação de Kerberos.

**Tabela 8.24 Nomes de plugins e bibliotecas para autenticação Kerberos**

<table summary="Nomes para os plugins e o arquivo de biblioteca usados para autenticação Kerberos."><thead><tr> <th>Plugin ou arquivo</th> <th>Nome do Plugin ou do Arquivo</th> </tr></thead><tbody><tr> <td>Plugin no lado do servidor</td> <td>[[<code>authentication_kerberos</code>]]</td> </tr><tr> <td>Plugin no lado do cliente</td> <td>[[<code>authentication_kerberos_client</code>]]</td> </tr><tr> <td>Arquivo da biblioteca</td> <td>[[<code>authentication_kerberos.so</code>]], [[<code>authentication_kerberos_client.so</code>]]</td> </tr></tbody></table>

O plugin de autenticação Kerberos no lado do servidor está incluído apenas na Edição Empresarial do MySQL. Ele não está incluído nas distribuições comunitárias do MySQL. O plugin no lado do cliente está incluído em todas as distribuições, incluindo as comunitárias. Isso permite que clientes de qualquer distribuição se conectem a um servidor que tenha o plugin no lado do servidor carregado.

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação de pluggable Kerberos:

- Pré-requisitos para autenticação com autenticação de Kerberos
- Como funciona a autenticação Kerberos de usuários do MySQL
- Instalando Autenticação de Autenticação de Kerberos
- Usando Kerberos Pluggable Authentication
- Depuração da Autenticação Kerberos

Para obter informações gerais sobre autenticação plugável no MySQL, consulte a Seção 8.2.17, “Autenticação Plugável”.

##### Pré-requisitos para autenticação com autenticação de Kerberos

Para usar a autenticação de autenticação pluggable do Kerberos para o MySQL, esses pré-requisitos devem ser atendidos:

- Um serviço Kerberos deve estar disponível para que os plugins de autenticação Kerberos possam se comunicar.

- Cada usuário Kerberos (principais) que deve ser autenticado pelo servidor KDC deve estar presente no banco de dados gerenciado pelo servidor KDC.

- Uma biblioteca de cliente Kerberos deve estar disponível nos sistemas onde o plugin de autenticação Kerberos do lado do servidor ou do lado do cliente é usado. Além disso, o GSSAPI é usado como interface para acessar a autenticação Kerberos, então uma biblioteca GSSAPI deve estar disponível.

##### Como funciona a autenticação Kerberos de usuários do MySQL

Esta seção fornece uma visão geral de como o MySQL e o Kerberos trabalham juntos para autenticar usuários do MySQL. Para exemplos que mostram como configurar contas do MySQL para usar os plugins de autenticação Kerberos, consulte Usar autenticação compatível com Kerberos.

Aqui, assume-se que o leitor tem familiaridade com os conceitos e o funcionamento do Kerberos. A lista a seguir define brevemente vários termos comuns do Kerberos. Você também pode achar útil a seção Glossário do RFC 4120.

- Principal: Uma entidade nomeada, como um usuário ou servidor. Neste tópico, certos termos relacionados ao principal ocorrem com frequência:

  - SPN: Nome do principal do serviço; o nome de um principal que representa um serviço.

  - UPN: Nome principal do usuário; o nome de um principal que representa um usuário.

- KDC: O centro de distribuição de chaves, que inclui o AS e o TGS:

  - AS: O servidor de autenticação; fornece o ticket inicial de concessão de ticket necessário para obter tickets adicionais.

  - TGS: O servidor de concessão de ingressos; fornece ingressos adicionais aos clientes do Kerberos que possuem um TGT válido.

- TGT: O bilhete de concessão de passagem; apresentado ao TGS para obter passagens de serviço para o acesso ao serviço.

- ST: Um ticket de serviço; oferece acesso a um serviço como o oferecido por um servidor MySQL.

A autenticação usando o Kerberos requer um servidor KDC, por exemplo, como fornecido pelo Microsoft Active Directory.

A autenticação Kerberos no MySQL utiliza a Interface de Programação de Aplicativos do Serviço de Segurança Genérico (GSSAPI), que é uma interface de abstração de segurança. O Kerberos é uma instância de um protocolo de segurança específico que pode ser usado por meio dessa interface abstrata. Usando o GSSAPI, as aplicações autenticam-se no Kerberos para obter credenciais de serviço e, em seguida, usam essas credenciais para habilitar o acesso seguro a outros serviços.

No Windows, o plugin de autenticação `authentication_kerberos_client` suporta dois modos, que o usuário do cliente pode definir em tempo de execução ou especificar em um arquivo de opção:

- Modo `SSPI`: A Interface de Suporte de Segurança (SSPI) implementa o GSSAPI (veja os comandos para clientes do Windows no modo SSPI). O SSPI, embora seja compatível com o GSSAPI no nível de fio, só suporta o cenário de login único do Windows e se refere especificamente ao usuário conectado. O SSPI é o modo padrão na maioria dos clientes do Windows.

- Modo `GSSAPI`: Suporta GSSAPI através da biblioteca MIT Kerberos no Windows (consulte Comandos para clientes do Windows no modo GSSAPI).

Com os plugins de autenticação Kerberos, aplicativos e servidores MySQL podem usar o protocolo de autenticação Kerberos para autenticar mutuamente usuários e serviços MySQL. Dessa forma, tanto o usuário quanto o servidor podem verificar a identidade um do outro. Nenhuma senha é enviada pela rede e as mensagens do protocolo Kerberos são protegidas contra interceptação e ataques de reprodução.

A autenticação Kerberos segue estes passos, onde as partes do lado do servidor e do cliente são realizadas usando os plugins de autenticação `authentication_kerberos` e `authentication_kerberos_client`, respectivamente:

1. O servidor MySQL envia ao aplicativo cliente seu nome de principal de serviço. Esse SPN deve ser registrado no sistema Kerberos e configurado no lado do servidor usando a variável de sistema `authentication_kerberos_service_principal`.

2. Usando o GSSAPI, o aplicativo cliente cria uma sessão de autenticação do lado do cliente do Kerberos e troca mensagens Kerberos com o KDC Kerberos:

   - O cliente obtém um ticket de concessão de ticket do servidor de autenticação.

   - Usando o TGT, o cliente obtém um ticket de serviço para MySQL do serviço de concessão de tickets.

   Essa etapa pode ser ignorada ou parcialmente ignorada se o TGT, o ST ou ambos já estiverem armazenados localmente. O cliente pode, opcionalmente, usar um arquivo de chave de cliente para obter um TGT e um ST sem fornecer uma senha.

3. Usando o GSSAPI, o aplicativo cliente apresenta o ST MySQL ao servidor MySQL.

4. Usando o GSSAPI, o servidor MySQL cria uma sessão de autenticação no lado do servidor do Kerberos. O servidor valida a identidade do usuário e a validade do pedido do usuário. Ele autentica o ST usando a chave de serviço configurada em seu arquivo service keytab para determinar se a autenticação é bem-sucedida ou não, e retorna o resultado da autenticação ao cliente.

As aplicações podem autenticar-se usando um nome de usuário e senha fornecidos ou usando um TGT ou ST armazenado localmente (por exemplo, criado usando **kinit** ou algo semelhante). Esse design, portanto, abrange casos de uso que vão desde conexões completamente sem usuário e sem senha, onde os ingressos de serviço Kerberos são obtidos de um cache Kerberos armazenado localmente, até conexões onde tanto o nome de usuário quanto a senha são fornecidos e usados para obter um ingresso de serviço Kerberos válido de um KDC, para enviar ao servidor MySQL.

Como indicado na descrição anterior, a autenticação Kerberos do MySQL utiliza dois tipos de arquivos keytab:

- No host do cliente, um arquivo de chave de cliente pode ser usado para obter um TGT e ST sem fornecer uma senha. Consulte Parâmetros de Configuração do Cliente para Autenticação Kerberos.

- No servidor MySQL, um arquivo de chavetab do serviço no lado do servidor é usado para verificar os ingressos de serviço recebidos pelo servidor MySQL dos clientes. O nome do arquivo keytab é configurado usando a variável de sistema `authentication_kerberos_service_key_tab`.

Para obter informações sobre arquivos keytab, consulte <https://web.mit.edu/kerberos/krb5-latest/doc/basic/keytab_def.html>.

##### Instalando Autenticação de Autenticação de Kerberos

Esta seção descreve como instalar o plugin de autenticação Kerberos no lado do servidor. Para informações gerais sobre como instalar plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Nota

O plugin do lado do servidor é suportado apenas em sistemas Linux. Em sistemas Windows, apenas o plugin do lado do cliente é suportado (a partir do MySQL 8.0.27), que pode ser usado em um sistema Windows para se conectar a um servidor Linux que usa autenticação Kerberos.

Para que o plugin seja utilizado pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin configurando o valor de `plugin_dir` durante o início do servidor.

O nome de arquivo da biblioteca de plugins do lado do servidor é `authentication_kerberos`. O sufixo do nome do arquivo para sistemas Unix e sistemas semelhantes ao Unix é `.so`.

Para carregar o plugin na inicialização do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com esse método de carregamento de plugins, a opção deve ser fornecida toda vez que o servidor for iniciado. Além disso, especifique valores para quaisquer variáveis de sistema fornecidas pelo plugin que você deseja configurar. O plugin expõe essas variáveis de sistema, permitindo que sua operação seja configurada:

- `authentication_kerberos_service_principal`: O nome do principal do serviço MySQL (SPN). Esse nome é enviado aos clientes que tentam autenticar usando o Kerberos. O SPN deve estar presente no banco de dados gerenciado pelo servidor KDC. O padrão é `mysql/host_name@realm_name`.

- `authentication_kerberos_service_key_tab`: O arquivo keytab para autenticação de ingressos recebidos de clientes. Este arquivo deve existir e conter uma chave válida para o SPN, caso contrário, a autenticação dos clientes falhará. O padrão é `mysql.keytab` no diretório de dados.

Para obter detalhes sobre todas as variáveis do sistema de autenticação Kerberos, consulte a Seção 8.4.1.13, “Variáveis do Sistema de Autenticação Conectable”.

Para carregar o plugin e configurá-lo, coloque linhas como estas no seu arquivo `my.cnf`, usando valores para as variáveis do sistema que sejam apropriados para sua instalação:

```
[mysqld]
plugin-load-add=authentication_kerberos.so
authentication_kerberos_service_principal=mysql/krbauth.example.com@MYSQL.LOCAL
authentication_kerberos_service_key_tab=/var/mysql/data/mysql.keytab
```

Após modificar `my.cnf`, reinicie o servidor para que as novas configurações entrem em vigor.

Alternativamente, para carregar o plugin em tempo de execução, use esta declaração:

```
INSTALL PLUGIN authentication_kerberos
  SONAME 'authentication_kerberos.so';
```

`INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela do sistema `mysql.plugins`, fazendo com que o servidor o carregue para cada inicialização normal subsequente, sem a necessidade de `--plugin-load-add`.

Quando você instala o plugin em tempo de execução sem configurar suas variáveis de sistema no arquivo `my.cnf`, a variável de sistema `authentication_kerberos_service_key_tab` é definida pelo valor padrão de `mysql.keytab` no diretório de dados. O valor dessa variável de sistema não pode ser alterado em tempo de execução, então, se você precisar especificar um arquivo diferente, você precisa adicionar a configuração ao seu arquivo `my.cnf` e, em seguida, reiniciar o servidor MySQL. Por exemplo:

```
[mysqld]
authentication_kerberos_service_key_tab=/var/mysql/data/mysql.keytab
```

Se o arquivo keytab não estiver no local correto ou não contiver uma chave SPN válida, o servidor MySQL não valida isso, mas os clientes retornam erros de autenticação até que você resolva o problema.

A variável de sistema `authentication_kerberos_service_principal` pode ser definida e persistente durante a execução sem precisar reiniciar o servidor, usando uma instrução `SET PERSIST`:

```
SET PERSIST authentication_kerberos_service_principal='mysql/krbauth.example.com@MYSQL.LOCAL';
```

`SET PERSIST` define um valor para a instância do MySQL em execução. Ele também salva o valor, fazendo com que ele seja carregado em reinicializações subsequentes do servidor. Para alterar um valor para a instância do MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`. Veja a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a instrução `SHOW PLUGINS` (consulte a Seção 7.6.2, “Obtendo Informações do Plugin do Servidor”). Por exemplo:

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

Se um plugin não conseguir se inicializar, verifique o log de erros do servidor para mensagens de diagnóstico.

Para associar contas do MySQL ao plugin Kerberos, consulte Usar autenticação de autenticação de Kerberos.

##### Usando Kerberos Pluggable Authentication

Esta seção descreve como habilitar contas do MySQL para se conectarem ao servidor MySQL usando autenticação compatível com Kerberos. Assume-se que o servidor esteja em execução com o plugin do lado do servidor habilitado, conforme descrito em Instalar Autenticação Compatível com Kerberos, e que o plugin do lado do cliente esteja disponível no host do cliente.

- Verificar a disponibilidade do Kerberos
- Crie uma conta MySQL que use autenticação Kerberos
- Use a Conta MySQL para se conectar ao servidor MySQL
- Parâmetros de configuração do cliente para autenticação Kerberos

###### Verificar a disponibilidade do Kerberos

O exemplo a seguir mostra como testar a disponibilidade do Kerberos no Active Directory. O exemplo faz as seguintes suposições:

- O Active Directory está sendo executado no host com o nome `krbauth.example.com` e o endereço IP `198.51.100.11`.

- A autenticação Kerberos relacionada ao MySQL usa o domínio `MYSQL.LOCAL` e também usa `MYSQL.LOCAL` como o nome do domínio.

- Um principal chamado `karl@MYSQL.LOCAL` está registrado no KDC. (Em uma discussão posterior, esse nome do principal está associado à conta MySQL que autentica-se no servidor MySQL usando Kerberos.)

Com essas suposições atendidas, siga este procedimento:

1. Verifique se a biblioteca Kerberos está instalada e configurada corretamente no sistema operacional. Por exemplo, para configurar um domínio `MYSQL.LOCAL` e um domínio de domínio para uso durante a autenticação do MySQL, o arquivo de configuração `/etc/krb5.conf` Kerberos deve conter algo como:

   ```
   [realms]
     MYSQL.LOCAL = {
       kdc = krbauth.example.com
       admin_server = krbauth.example.com
       default_domain = MYSQL.LOCAL
     }
   ```

2. Você pode precisar adicionar uma entrada para `/etc/hosts` para o host do servidor:

   ```
   198.51.100.11 krbauth krbauth.example.com
   ```

3. Verifique se a autenticação Kerberos funciona corretamente:

   1. Use **kinit** para autenticar-se no Kerberos:

      ```
      $> kinit karl@MYSQL.LOCAL
      Password for karl@MYSQL.LOCAL: (enter password here)
      ```

      O comando autentica o principal Kerberos chamado \[\[`karl@MYSQL.LOCAL`]. Quando o comando solicitar a senha do principal, insira-a. O KDC retorna um TGT que é armazenado em cache no lado do cliente para uso por outros aplicativos que reconhecem o Kerberos.

   2. Use o comando **klist** para verificar se o TGT foi obtido corretamente. A saída deve ser semelhante a esta:

      ```
      $> klist
      Ticket cache: FILE:/tmp/krb5cc_244306
      Default principal: karl@MYSQL.LOCAL

      Valid starting       Expires              Service principal
      03/23/2021 08:18:33  03/23/2021 18:18:33  krbtgt/MYSQL.LOCAL@MYSQL.LOCAL
      ```

###### Crie uma conta MySQL que use autenticação Kerberos

A autenticação do MySQL usando o plugin de autenticação `authentication_kerberos` é baseada em um nome de principal de usuário Kerberos (UPN). As instruções aqui assumem que um usuário MySQL chamado `karl` se autentica no MySQL usando Kerberos, que o domínio Kerberos é chamado de `MYSQL.LOCAL` e que o nome do principal de usuário é `karl@MYSQL.LOCAL`. Esse UPN deve ser registrado em vários lugares:

- O administrador do Kerberos deve registrar o nome do usuário como um principal do Kerberos. Esse nome inclui um nome do domínio. Os clientes usam o nome do principal e a senha para se autenticar com o Kerberos e obter um ticket-granting ticket (TGT).

- O DBA do MySQL deve criar uma conta que corresponda ao nome do principal Kerberos e que autentique usando o plugin Kerberos.

Suponha que o nome do principal de usuário Kerberos tenha sido registrado pelo administrador do serviço apropriado e que, conforme descrito anteriormente em Instalar o plugin de autenticação compatível com Kerberos, o servidor MySQL tenha sido iniciado com configurações apropriadas para o plugin Kerberos do lado do servidor. Para criar uma conta MySQL que corresponda ao UPN Kerberos `user@realm_name`, o DBA do MySQL usa uma declaração como esta:

```
CREATE USER user
  IDENTIFIED WITH authentication_kerberos
  BY 'realm_name';
```

A conta nomeada por `user` pode incluir ou omitir a parte do nome do host. Se o nome do host for omitido, ele será predefinido como `%` como de costume. O `realm_name` é armazenado como o valor `authentication_string` para a conta na tabela do sistema `mysql.user`.

Para criar uma conta MySQL que corresponda ao UPN `karl@MYSQL.LOCAL`, use esta instrução:

```
CREATE USER 'karl'
  IDENTIFIED WITH authentication_kerberos
  BY 'MYSQL.LOCAL';
```

Se o MySQL precisar construir o UPN para essa conta, por exemplo, para obter ou validar ingressos (TGTs ou STs), ele faz isso combinando o nome da conta (ignorando qualquer parte do nome do host) e o nome do domínio. Por exemplo, o nome completo da conta resultante da declaração anterior `CREATE USER` é `'karl'@'%'`. O MySQL constrói o UPN a partir da parte do nome do usuário `karl` (ignorando a parte do nome do host) e do nome do domínio `MYSQL.LOCAL` para produzir `karl@MYSQL.LOCAL`.

Nota

Observe que, ao criar uma conta que autentica usando `authentication_kerberos`, a declaração `CREATE USER` não inclui o domínio UPN como parte do nome do usuário. Em vez disso, especifique o domínio (`MYSQL.LOCAL` neste caso) como a string de autenticação na cláusula `BY`. Isso difere da criação de contas que usam o plugin de autenticação SASL LDAP `authentication_ldap_sasl` com o método de autenticação GSSAPI/Kerberos. Para tais contas, a declaração `CREATE USER` inclui o domínio UPN como parte do nome do usuário. Veja Como criar uma conta MySQL que usa GSSAPI/Kerberos para autenticação LDAP.

Com a conta configurada, os clientes podem usá-la para se conectar ao servidor MySQL. O procedimento depende se o host do cliente executa Linux ou Windows, conforme indicado na discussão a seguir.

O uso de `authentication_kerberos` está sujeito à restrição de que UPNs com a mesma parte de usuário, mas uma parte de domínio diferente, não são suportadas. Por exemplo, você não pode criar contas MySQL que correspondam a essas duas UPNs:

```
kate@MYSQL.LOCAL
kate@EXAMPLE.COM
```

Ambas as UPNs têm uma parte de usuário de `kate`, mas diferem na parte do domínio (`MYSQL.LOCAL` versus `EXAMPLE.COM`). Isso é proibido.

###### Use a Conta MySQL para se conectar ao servidor MySQL

Depois que uma conta do MySQL que autentica usando Kerberos for configurada, os clientes podem usá-la para se conectar ao servidor MySQL da seguinte forma:

1. Autentique-se com o nome do principal de usuário (UPN) e sua senha no Kerberos para obter um ticket-granting ticket (TGT).

2. Use o TGT para obter um ticket de serviço (ST) para o MySQL.

3. Autentique-se no servidor MySQL apresentando o ST MySQL.

O primeiro passo (autenticação no Kerberos) pode ser realizado de várias maneiras:

- Antes de se conectar ao MySQL:

  - Em Linux ou em Windows no modo `GSSAPI`, inicie o **kinit** para obter o TGT e salve-o no cache de credenciais do Kerberos.

  - No Windows no modo `SSPI`, a autenticação já pode ter sido realizada no momento do login, o que salva o TGT para o usuário logado no cache de memória do Windows. **kinit** não é usado e não há cache Kerberos.

- Ao se conectar ao MySQL, o próprio programa cliente pode obter o TGT, se puder determinar o UPN e a senha Kerberos necessários:

  - Essas informações podem vir de fontes como opções de comando ou do sistema operacional.

  - Nos sistemas Linux, os clientes também podem usar um arquivo keytab ou o arquivo de configuração `/etc/krb5.conf`. Os clientes do Windows no modo `GSSAPI` usam um arquivo de configuração. Os clientes do Windows no modo `SSPI` não usam nenhum.

Os detalhes dos comandos do cliente para se conectar ao servidor MySQL diferem para Linux e Windows, portanto, cada tipo de host é discutido separadamente, mas essas propriedades dos comandos se aplicam independentemente do tipo de host:

- Cada comando mostrado inclui as seguintes opções, mas cada uma pode ser omitida sob certas condições:

  - A opção `--default-auth` especifica o nome do plugin de autenticação do lado do cliente (`authentication_kerberos_client`). Esta opção pode ser omitida quando a opção `--user` é especificada, pois, nesse caso, o MySQL pode determinar o plugin a partir das informações da conta do usuário enviadas pelo servidor MySQL.

  - A opção `--plugin-dir` indica ao programa cliente a localização do plugin `authentication_kerberos_client`. Esta opção pode ser omitida se o plugin estiver instalado na localização padrão (incorporada).

- As instruções também devem incluir quaisquer outras opções, como `--host` ou `--port`, que são necessárias para especificar qual servidor MySQL se deseja conectar.

- Digite cada comando em uma única linha. Se o comando incluir uma opção `--password` para solicitar uma senha, insira a senha do UPN Kerberos associado ao usuário do MySQL quando solicitado.

**Comandos de conexão para clientes Linux**

No Linux, o comando do cliente apropriado para se conectar ao servidor MySQL varia dependendo se o comando autentica usando um TGT do cache Kerberos ou com base nas opções de comando para o nome do usuário do MySQL e a senha UPN:

- Antes de invocar o programa cliente MySQL, o usuário do cliente pode obter um TGT do KDC de forma independente do MySQL. Por exemplo, o usuário do cliente pode usar **kinit** para autenticar-se no Kerberos fornecendo um nome de principal de usuário Kerberos e a senha da principal:

  ```
  $> kinit karl@MYSQL.LOCAL
  Password for karl@MYSQL.LOCAL: (enter password here)
  ```

  O TGT resultante para o UPN é armazenado na cache e torna-se disponível para uso por outros aplicativos que reconhecem o Kerberos, como programas que utilizam o plugin de autenticação Kerberos no lado do cliente. Nesse caso, inicie o cliente sem especificar a opção de nome de usuário ou senha:

  ```
  mysql
    --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
  ```

  O plugin do lado do cliente encontra o TGT no cache, usa-o para obter um ST MySQL e usa o ST para autenticar-se no servidor MySQL.

  Como descrito anteriormente, quando o TGT para o UPN é armazenado na cache, as opções de nome de usuário e senha não são necessárias no comando do cliente. Se o comando incluir essas opções, elas serão tratadas da seguinte forma:

  - Este comando inclui uma opção de nome de usuário:

    ```
    mysql
      --default-auth=authentication_kerberos_client
      --plugin-dir=path/to/plugin/directory
      --user=karl
    ```

    Neste caso, a autenticação falha se o nome de usuário especificado pela opção não corresponder à parte do nome de usuário UPN no TGT.

  - Esse comando inclui uma opção de senha, que você deve inserir quando solicitado:

    ```
    mysql
      --default-auth=authentication_kerberos_client
      --plugin-dir=path/to/plugin/directory
      --password
    ```

    Nesse caso, o plugin do lado do cliente ignora a senha. Como a autenticação é baseada no TGT, ele pode **suceder mesmo se a senha fornecida pelo usuário estiver incorreta**. Por essa razão, o plugin emite um aviso se um TGT válido for encontrado, o que faz com que a senha seja ignorada.

- Se o cache Kerberos não contiver TGT, o próprio plugin de autenticação Kerberos do lado do cliente pode obter o TGT do KDC. Inicie o cliente com as opções para o nome de usuário do MySQL e a senha, e, em seguida, insira a senha do UPN quando solicitado:

  ```
  mysql --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --user=karl
    --password
  ```

  O plugin de autenticação Kerberos do lado do cliente combina o nome do usuário (`karl`) e o domínio especificado na conta do usuário (`MYSQL.LOCAL`) para construir o UPN (`karl@MYSQL.LOCAL`). O plugin do lado do cliente usa o UPN e a senha para obter um TGT, usa o TGT para obter um ST MySQL e usa o ST para autenticar-se no servidor MySQL.

  Ou, suponha que o cache do Kerberos não contenha TGT e o comando especifique uma opção de senha, mas nenhuma opção de nome de usuário:

  ```
  mysql --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --password
  ```

  O plugin de autenticação Kerberos do lado do cliente usa o nome de login do sistema operacional como o nome de usuário do MySQL. Ele combina esse nome de usuário e o domínio na conta do usuário do MySQL para construir o UPN. O plugin do lado do cliente usa o UPN e a senha para obter um TGT, usa o TGT para obter um ST do MySQL e usa o ST para autenticar-se no servidor MySQL.

Se você não tiver certeza se um TGT existe, você pode usar o **klist** para verificar.

Nota

Quando o próprio plugin de autenticação Kerberos do lado do cliente obtém o TGT, o usuário do cliente pode não querer que o TGT seja reutilizado. Como descrito nos Parâmetros de Configuração do Cliente para Autenticação Kerberos, o arquivo local `/etc/krb5.conf` pode ser usado para fazer com que o plugin do lado do cliente destrua o TGT quando ele estiver pronto.

**Comandos de Conexão para Clientes Windows no Modo SSPI**

No Windows, usando a opção de plugin padrão do lado do cliente (SSPI), o comando apropriado para se conectar ao servidor MySQL varia dependendo se o comando autentica com base nas opções de comando para o nome de usuário do MySQL e a senha UPN, ou se usa um TGT do cache em memória do Windows. Para obter detalhes sobre o modo GSSAPI no Windows, consulte Comandos para clientes do Windows no modo GSSAPI.

Um comando pode especificar explicitamente as opções para o nome do usuário do MySQL e a senha do UPN, ou o comando pode omitir essas opções:

- Este comando inclui opções para o nome do usuário do MySQL e a senha UPN:

  ```
  mysql --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --user=karl
    --password
  ```

  O plugin de autenticação Kerberos do lado do cliente combina o nome do usuário (`karl`) e o domínio especificado na conta do usuário (`MYSQL.LOCAL`) para construir o UPN (`karl@MYSQL.LOCAL`). O plugin do lado do cliente usa o UPN e a senha para obter um TGT, usa o TGT para obter um ST MySQL e usa o ST para autenticar-se no servidor MySQL.

  Qualquer informação no cache em memória do Windows é ignorada; os valores das opções de nome de usuário e senha têm precedência.

- Este comando inclui uma opção para a senha do UPN, mas não para o nome do usuário do MySQL:

  ```
  mysql
    --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --password
  ```

  O plugin de autenticação Kerberos do lado do cliente usa o nome de usuário conectado como o nome de usuário do MySQL e combina esse nome de usuário e o domínio na conta do usuário do MySQL para construir o UPN. O plugin do lado do cliente usa o UPN e a senha para obter um TGT, usa o TGT para obter um ST do MySQL e usa o ST para autenticar-se no servidor MySQL.

- Este comando não inclui opções para o nome do usuário MySQL ou senha UPN:

  ```
  mysql
    --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
  ```

  O plugin do lado do cliente obtém o TGT do cache em memória do Windows, usa o TGT para obter um ST MySQL e usa o ST para autenticar-se no servidor MySQL.

  Essa abordagem exige que o host do cliente faça parte do domínio do Windows Server Active Directory (AD). Se esse não for o caso, ajude o cliente MySQL a descobrir o endereço IP do domínio AD, inserindo manualmente o servidor AD e o domínio como servidor DNS e prefixo:

  1. Inicie `console.exe` e selecione Centro de Rede e Compartilhamento.

  2. Na barra lateral da janela do Centro de Rede e Compartilhamento, selecione Alterar configurações do adaptador.

  3. Na janela Conexões de Rede, clique com o botão direito na conexão de rede ou VPN para configurar e selecionar Propriedades.

  4. Na guia Rede, localize e clique em Protocolo de Internet versão 4 (TCP/IPv4) e, em seguida, clique em Propriedades.

  5. Clique em Avançado no diálogo Propriedades do Protocolo de Internet versão 4 (TCP/IPv4). O diálogo Configurações avançadas de TCP/IP é aberto.

  6. Na guia DNS, adicione o servidor e o domínio do Active Directory como servidor e prefixo DNS.

- Este comando inclui uma opção para o nome do usuário do MySQL, mas não para a senha do UPN:

  ```
  mysql
    --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --user=karl
  ```

  O plugin de autenticação Kerberos do lado do cliente compara o nome especificado pela opção user-name com o nome do usuário logado. Se os nomes forem iguais, o plugin usa o TGT do usuário logado para a autenticação. Se os nomes forem diferentes, a autenticação falha.

**Comandos de Conexão para Clientes Windows no Modo GSSAPI**

No Windows, o usuário do cliente deve especificar explicitamente o modo `GSSAPI` usando a opção de plugin `plugin_authentication_kerberos_client_mode` para habilitar o suporte através da biblioteca MIT Kerberos. O modo padrão é `SSPI` (veja Comandos para clientes do Windows no modo SSPI).

É possível especificar o modo `GSSAPI`:

- Antes de invocar o programa cliente MySQL em um arquivo de opção. O nome da variável do plugin é válido usando sublinhados ou travessões:

  ```
  [mysql]
  plugin_authentication_kerberos_client_mode=GSSAPI
  ```

  Ou:

  ```
  [mysql]
  plugin-authentication-kerberos-client-mode=GSSAPI
  ```

- Em tempo de execução a partir da linha de comando usando os programas clientes **mysql** ou **mysqldump**. Por exemplo, os seguintes comandos (com sublinhados ou travessões) fazem com que o **mysql** se conecte ao servidor através da biblioteca MIT Kerberos no Windows.

  ```
  mysql [connection-options] --plugin_authentication_kerberos_client_mode=GSSAPI
  ```

  Ou:

  ```
  mysql [connection-options] --plugin-authentication-kerberos-client-mode=GSSAPI
  ```

- Os usuários do cliente podem selecionar o modo `GSSAPI` no MySQL Workbench e em alguns conectores do MySQL. Em hosts do cliente que executam o Windows, você pode substituir a localização padrão de:

  - A configuração do Kerberos pode ser feita definindo a variável de ambiente `KRB5_CONFIG`.

  - O nome padrão do cache de credenciais com a variável de ambiente `KRB5CCNAME` (por exemplo, `KRB5CCNAME=DIR:/mydir/`).

  Para informações específicas sobre plugins do lado do cliente, consulte a documentação em <https://dev.mysql.com/doc/>.

O comando apropriado para o cliente para se conectar ao servidor MySQL varia dependendo se o comando autentica usando um TGT do cache MIT Kerberos ou com base nas opções de comando para o nome do usuário do MySQL e a senha UPN. O suporte GSSAPI através da biblioteca MIT no Windows é semelhante ao GSSAPI no Linux (veja Comandos para clientes Linux), com as seguintes exceções:

- Os ingressos são sempre recuperados ou colocados no cache MIT Kerberos nos hosts que executam o Windows.

- O **kinit** funciona com Contas Funcionais em sistemas Windows que têm permissões restritas e papéis específicos. O usuário do cliente não conhece a senha do **kinit**. Para obter uma visão geral, consulte <https://docs.oracle.com/en/java/javase/11/tools/kinit.html>.

- Se o usuário cliente fornecer uma senha, a biblioteca MIT Kerberos no Windows decide se deve usá-la ou confiar no ticket existente.

- O parâmetro `destroy_tickets`, descrito nos Parâmetros de Configuração do Cliente para Autenticação Kerberos, não é suportado porque a biblioteca MIT Kerberos no Windows não suporta o membro da API necessário (`get_profile_boolean`) para ler seu valor do arquivo de configuração.

###### Parâmetros de configuração do cliente para autenticação Kerberos

Esta seção aplica-se apenas aos hosts de clientes que executam Linux, não aos hosts de clientes que executam o Windows.

Nota

Um host cliente que executa o Windows com o plugin Kerberos do lado do cliente `authentication_kerberos_client` configurado no modo `GSSAPI` suporta, em geral, os parâmetros de configuração do cliente, mas a biblioteca MIT Kerberos no Windows não suporta o parâmetro `destroy_tickets` descrito nesta seção.

Se, no momento da invocação da aplicação cliente MySQL, não existir um ticket-granting ticket (TGT) válido, a própria aplicação pode obter e armazenar o TGT. Se, durante o processo de autenticação Kerberos, a aplicação cliente causar que um TGT seja armazenado na cache, qualquer TGT adicionado pode ser destruído quando não for mais necessário, configurando o parâmetro de configuração apropriado.

O plugin Kerberos do lado do cliente `authentication_kerberos_client` lê o arquivo local `/etc/krb5.conf`. Se este arquivo estiver ausente ou inacessível, ocorrerá um erro. Supondo que o arquivo esteja acessível, ele pode incluir uma seção opcional `[appdefaults]` para fornecer informações usadas pelo plugin. Coloque as informações dentro da parte `mysql` da seção. Por exemplo:

```
[appdefaults]
  mysql = {
    destroy_tickets = true
  }
```

O plugin do lado do cliente reconhece esses parâmetros na seção `mysql`:

- O valor `destroy_tickets` indica se o plugin do lado do cliente destrói o TGT após obtê-lo e usá-lo. Por padrão, `destroy_tickets` é `false`, mas pode ser definido como `true` para evitar a reutilização do TGT. (Essa configuração aplica-se apenas aos TGTs criados pelo plugin do lado do cliente, e não aos TGTs criados por outros plugins ou externamente ao MySQL.)

No host do cliente, um arquivo de chavetab pode ser usado para obter um TGT e TS sem fornecer uma senha. Para obter informações sobre arquivos de chavetab, consulte <https://web.mit.edu/kerberos/krb5-latest/doc/basic/keytab_def.html>.

##### Depuração da Autenticação Kerberos

A variável de ambiente `AUTHENTICATION_KERBEROS_CLIENT_LOG` habilita ou desabilita a saída de depuração para a autenticação Kerberos.

Nota

Apesar de `CLIENT` no nome `AUTHENTICATION_KERBEROS_CLIENT_LOG`, a mesma variável de ambiente se aplica ao plugin do lado do servidor, assim como ao plugin do lado do cliente.

No lado do servidor, os valores permitidos são 0 (desativado) e 1 (ativado). As mensagens de log são escritas no log de erro do servidor, sujeito ao nível de granularidade do registro de erros do servidor. Por exemplo, se você estiver usando a filtragem de log com base na prioridade, a variável de sistema `log_error_verbosity` controla a granularidade, conforme descrito na Seção 7.4.2.5, “Filtragem de Log de Erro com Base na Prioridade (log\_filter\_internal)”).

Do lado do cliente, os valores permitidos são de 1 a 5 e são escritos na saída padrão de erro. A tabela a seguir mostra o significado de cada valor de nível de log.

<table summary="Níveis de log permitidos de autenticação no lado do cliente AUTHENTICATION_KERBEROS_CLIENT_LOG e significados correspondentes"><thead><tr> <th>Nível de log</th> <th>Significado</th> </tr></thead><tbody><tr> <td>1 ou não definido</td> <td>Sem registro</td> </tr><tr> <td>2</td> <td>Mensagens de erro</td> </tr><tr> <td>3</td> <td>Mensagens de erro e aviso</td> </tr><tr> <td>4</td> <td>Mensagens de erro, aviso e informações</td> </tr><tr> <td>5</td> <td>Mensagens de erro, aviso, informações e depuração</td> </tr></tbody></table>
