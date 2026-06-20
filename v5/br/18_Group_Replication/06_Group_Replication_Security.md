## 17.6 Segurança da Replicação em Grupo

Esta seção explica como proteger um grupo, assegurando as conexões entre os membros de um grupo, ou estabelecendo um perímetro de segurança usando a listagem de endereços IP.

### 17.6.1 Permitir a listagem de endereços IP de replicação de grupo

O plugin de replicação de grupo tem uma opção de configuração para determinar de quais hosts uma conexão de Sistema de Comunicação de Grupo recebida pode ser aceita. Esta opção é chamada `group_replication_ip_whitelist`. Se você definir esta opção em um servidor s1, então quando o servidor s2 está estabelecendo uma conexão com s1 com o propósito de engajar comunicação em grupo, s1 verifica primeiro a allowlist antes de aceitar a conexão de s2. Se s2 estiver na allowlist, então s1 aceita a tentativa de conexão de s2. Caso contrário, s1 rejeita a tentativa de conexão de s2.

Se você não especificar explicitamente uma lista de permissão, o motor de comunicação de grupo (XCom) analisa automaticamente as interfaces ativas no host e identifica aquelas com endereços em sub-redes privadas. Esses endereços e o endereço IP `localhost` para IPv4 são usados para criar uma lista de permissão automática de replicação de grupo. Portanto, a lista de permissão automática inclui quaisquer endereços IP encontrados para o host nos seguintes intervalos:

```sql
10/8 prefix       (10.0.0.0 - 10.255.255.255) - Class A
172.16/12 prefix  (172.16.0.0 - 172.31.255.255) - Class B
192.168/16 prefix (192.168.0.0 - 192.168.255.255) - Class C
127.0.0.1 - localhost for IPv4
```

Uma entrada é adicionada ao log de erro, indicando os endereços que foram automaticamente permitidos para o host.

A lista automática de endereços privados não pode ser usada para conexões de servidores externos à rede privada, portanto, um servidor, mesmo que tenha interfaces em IPs públicos, não permite, por padrão, conexões de Replicação de Grupo de hosts externos. Para conexões de Replicação de Grupo entre instâncias de servidor que estão em máquinas diferentes, você deve fornecer endereços de IP público e especiá-los como uma lista explícita de permissão. Se você especificar qualquer entrada na lista de permissão, os endereços privados e `localhost` não são adicionados automaticamente, portanto, se você usar qualquer um desses, deve especiá-los explicitamente.

Para especificar uma lista de permissão manualmente, use a opção `group_replication_ip_whitelist`. Não é possível alterar a lista de permissão em um servidor enquanto ele é um membro ativo de um grupo de replicação. Se o membro estiver ativo, você deve emitir uma declaração `STOP GROUP_REPLICATION` antes de alterar a lista de permissão, e uma declaração `START GROUP_REPLICATION` depois.

Na lista de permissão, você pode especificar qualquer combinação dos seguintes itens:

* Endereços IPv4 (por exemplo, `198.51.100.44`) * Endereços IPv4 com notação CIDR (por exemplo, `192.0.2.21/24`)

* Nomes de host, a partir do MySQL 5.7.21 (por exemplo, `example.org`)

* Nomes de host com notação CIDR, a partir do MySQL 5.7.21 (por exemplo, `www.example.com/24`)

Os endereços IPv6 e os nomes de host que resolvem para endereços IPv6 não são suportados no MySQL 5.7. Você pode usar a notação CIDR em combinação com nomes de host ou endereços IP para permitir um bloco de endereços IP com um prefixo de rede específico, mas certifique-se de que todos os endereços IP na sub-rede especificada estejam sob seu controle.

Você deve parar e reiniciar a Replicação em grupo em um membro para alterar sua allowlist. Uma vírgula deve separar cada entrada na allowlist. Por exemplo:

```sql
mysql> STOP GROUP_REPLICATION;
mysql> SET GLOBAL group_replication_ip_whitelist="192.0.2.21/24,198.51.100.44,203.0.113.0/24,example.org,www.example.com/24";
mysql> START GROUP_REPLICATION;
```

A allowlist deve conter o endereço IP ou o nome de host que é especificado na variável de sistema `group_replication_local_address` de cada membro. Esse endereço não é o mesmo que o host e a porta do protocolo SQL do servidor MySQL, e não é especificado na variável de sistema `bind_address` para a instância do servidor.

Quando um grupo de replicação é reconfigurado (por exemplo, quando um novo primário é eleito ou um membro se junta ou sai), os membros do grupo reestabelecem conexões entre si. Se um membro do grupo só for permitido em servidores que não fazem mais parte do grupo de replicação após a reconfiguração, ele não consegue se reconectar aos servidores restantes do grupo de replicação que não o permitem. Para evitar esse cenário completamente, especifique a mesma lista de permissão para todos os servidores que são membros do grupo de replicação.

Nota

É possível configurar diferentes listas de permissão em diferentes membros do grupo de acordo com os requisitos de segurança que você deseja, por exemplo, para manter diferentes sub-redes separadas. Se você precisar configurar diferentes listas de permissão para atender aos seus requisitos de segurança, certifique-se de que há uma sobreposição suficiente entre as listas de permissão no grupo de replicação para maximizar a possibilidade de os servidores poderem se reconectar na ausência de seu membro original de semente.

Para os nomes de host, a resolução de nomes ocorre apenas quando um pedido de conexão é feito por outro servidor. Um nome de host que não pode ser resolvido não é considerado para validação na lista de permissão, e uma mensagem de aviso é escrita no log de erro. A verificação de DNS reversa confirmada (FCrDNS) é realizada para nomes de host resolvidos.

Aviso

Os nomes de host são inerentemente menos seguros do que os endereços IP em uma lista de permissão. A verificação FCrDNS oferece um bom nível de proteção, mas pode ser comprometida por certos tipos de ataque. Especifique nomes de host em sua lista de permissão apenas quando estritamente necessário e garanta que todos os componentes usados para resolução de nomes, como servidores DNS, estejam sob seu controle. Você também pode implementar a resolução de nomes localmente usando o arquivo hosts, para evitar o uso de componentes externos.

### 17.6.2 Suporte à Replicação Segura da Camada de Sockets (SSL) em Grupos

As conexões de comunicação em grupo, bem como as conexões de recuperação, são protegidas usando SSL. As seções a seguir explicam como configurar as conexões.

#### Configurando SSL para Recuperação de Replicação de Grupo

A recuperação é realizada por meio de uma conexão de replicação assíncrona regular. Uma vez que o doador é selecionado, o servidor que se junta ao grupo estabelece uma conexão de replicação assíncrona. Tudo isso é automático.

No entanto, um usuário que requer uma conexão SSL deve ter sido criado antes do servidor que se junta ao grupo conectar-se ao doador. Normalmente, isso é configurado no momento em que um servidor é provisionado para se juntar ao grupo.

```sql
donor> SET SQL_LOG_BIN=0;
donor> CREATE USER 'rec_ssl_user'@'%' REQUIRE SSL;
donor> GRANT replication slave ON *.* TO 'rec_ssl_user'@'%';
donor> SET SQL_LOG_BIN=1;
```

Supondo que todos os servidores já no grupo tenham um conjunto de usuários de replicação configurado para usar SSL, você configura o servidor que está se juntando ao grupo para usar essas credenciais ao se conectar ao doador. Isso é feito de acordo com os valores das opções SSL fornecidas para o plugin de replicação do grupo.

```sql
new_member> SET GLOBAL group_replication_recovery_use_ssl=1;
new_member> SET GLOBAL group_replication_recovery_ssl_ca= '.../cacert.pem';
new_member> SET GLOBAL group_replication_recovery_ssl_cert= '.../client-cert.pem';
new_member> SET GLOBAL group_replication_recovery_ssl_key= '.../client-key.pem';
```

E, ao configurar o canal de recuperação para usar as credenciais do usuário que requer uma conexão SSL.

```sql
new_member> CHANGE MASTER TO MASTER_USER="rec_ssl_user" FOR CHANNEL "group_replication_recovery";
new_member> START GROUP_REPLICATION;
```

#### Configurando SSL para comunicação em grupo

As conexões seguras podem ser usadas para estabelecer comunicação entre os membros de um grupo. A configuração para isso depende da configuração SSL do servidor. Assim, se o servidor tiver SSL configurado, o plugin de Replicação de Grupo também terá SSL configurado. Para mais informações sobre as opções de configuração do SSL do servidor, consulte Opções de comando para conexões criptografadas. As opções que configuram a Replicação de Grupo são mostradas na tabela a seguir.

**Tabela 17.2 Opções SSL**

<table summary="Lists the server configuration options for SSL and describes their effect on the configuration of the Group Replication plugin for SSL."><col style="width: 43%"/><col style="width: 57%"/><thead><tr> <th><p> Server Configuration </p></th> <th><p>Descrição da Configuração do Plugin</p></th> </tr></thead><tbody><tr> <td><p> ssl_key </p></td> <td><p>Caminho do arquivo chave. Para ser usado como certificado do cliente e do servidor.</p></td> </tr><tr> <td><p> ssl_cert </p></td> <td><p>Caminho do arquivo de certificado. Para ser usado como certificado de cliente e servidor.</p></td> </tr><tr> <td><p> ssl_ca </p></td> <td><p>Caminho do arquivo com Autoridades de Certificação SSL que são confiáveis.</p></td> </tr><tr> <td><p> ssl_capath </p></td> <td><p>Caminho do diretório que contém certificados para Autoridades de Certificação SSL que são confiáveis.</p></td> </tr><tr> <td><p> ssl_crl </p></td> <td><p>Caminho do arquivo que contém as listas de revogação de certificados.</p></td> </tr><tr> <td><p> ssl_crlpath </p></td> <td><p>Caminho do diretório que contém listas de certificados revogados.</p></td> </tr><tr> <td><p> ssl_cipher </p></td> <td><p>Cifras permitidas para uso ao criptografar dados na conexão.</p></td> </tr><tr> <td><p> tls_version </p></td> <td><p>A comunicação segura utiliza esta versão e seus protocolos.</p></td> </tr></tbody></table>

Essas opções são opções de configuração do MySQL Server, nas quais a Replicação por Grupo se baseia para sua configuração. Além disso, há a seguinte opção específica da Replicação por Grupo para configurar o SSL no próprio plugin.

* `group_replication_ssl_mode` — especifica o estado de segurança da conexão entre os membros da Replicação em grupo.

**Tabela 17.3 valores de configuração do grupo\_replication\_ssl\_mode**

<table summary="Lists the possible values for group_replication_ssl_mode and describes their effect on how replication group members connect to each other."><col style="width: 43%"/><col style="width: 57%"/><thead><tr> <th><p> Value </p></th> <th><p>Descrição</p></th> </tr></thead><tbody><tr> <td><p> <em>DISABLED</em> </p></td> <td><p>Estabeleça uma conexão não criptografada (<em>padrão</em>). </p></td> </tr><tr> <td><p> REQUIRED </p></td> <td><p>Estabeleça uma conexão segura, se o servidor suportar conexões seguras.</p></td> </tr><tr> <td><p> VERIFY_CA </p></td> <td><p>Como REQUERIDO, mas, adicionalmente, verifique o certificado TLS do servidor contra os certificados da Autoridade de Certificação (CA) configurados.</p></td> </tr><tr> <td><p> VERIFY_IDENTITY </p></td> <td><p>Como VERIFY_CA, mas, adicionalmente, verifique se o certificado do servidor corresponde ao host ao qual a conexão é realizada.</p></td> </tr></tbody></table>

O exemplo a seguir mostra uma seção do arquivo my.cnf usada para configurar SSL em um servidor e como ativá-lo para a Replicação por Grupo.

```sql
[mysqld]
ssl_ca = "cacert.pem"
ssl_capath = "/.../ca_directory"
ssl_cert = "server-cert.pem"
ssl_cipher = "DHE-RSA-AEs256-SHA"
ssl_crl = "crl-server-revoked.crl"
ssl_crlpath = "/.../crl_directory"
ssl_key = "server-key.pem"
group_replication_ssl_mode= REQUIRED
```

A única opção de configuração específica do plugin que está listada é `group_replication_ssl_mode`. Esta opção ativa a comunicação SSL entre os membros do grupo, configurando o quadro SSL com os parâmetros `ssl_*` que são fornecidos ao servidor.

### 17.6.3 Replicação em grupo e redes privadas virtuais (VPNs)

Não há nada que impeça o Grupo de Replicação de operar em uma rede privada virtual. Em sua essência, ele simplesmente depende de um soquete IPv4 para estabelecer conexões entre servidores com o propósito de propagar mensagens entre eles.