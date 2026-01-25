### 17.6.2 Suporte a Secure Socket Layer (SSL) para Group Replication

Conexões de comunicação de Grupo, bem como conexões de Recovery, são protegidas usando SSL. As seções a seguir explicam como configurar as conexões.

#### Configurando SSL para Recovery do Group Replication

Recovery é realizado através de uma conexão de replicação assíncrona regular. Assim que o Donor é selecionado, o Server que está ingressando no grupo estabelece uma conexão de replicação assíncrona. Tudo isso é automático.

No entanto, um usuário que requer uma conexão SSL deve ter sido criado antes que o Server que está ingressando no grupo se conecte ao Donor. Tipicamente, isso é configurado no momento em que se está provisionando um Server para ingressar no grupo.

```sql
donor> SET SQL_LOG_BIN=0;
donor> CREATE USER 'rec_ssl_user'@'%' REQUIRE SSL;
donor> GRANT replication slave ON *.* TO 'rec_ssl_user'@'%';
donor> SET SQL_LOG_BIN=1;
```

Assumindo que todos os Servers que já estão no grupo têm um usuário de replicação configurado para usar SSL, você configura o Server que está ingressando no grupo para usar essas credenciais ao se conectar ao Donor. Isso é feito de acordo com os valores das opções SSL fornecidas para o Plugin Group Replication.

```sql
new_member> SET GLOBAL group_replication_recovery_use_ssl=1;
new_member> SET GLOBAL group_replication_recovery_ssl_ca= '.../cacert.pem';
new_member> SET GLOBAL group_replication_recovery_ssl_cert= '.../client-cert.pem';
new_member> SET GLOBAL group_replication_recovery_ssl_key= '.../client-key.pem';
```

E configurando o canal de Recovery para usar as credenciais do usuário que requer uma conexão SSL.

```sql
new_member> CHANGE MASTER TO MASTER_USER="rec_ssl_user" FOR CHANNEL "group_replication_recovery";
new_member> START GROUP_REPLICATION;
```

#### Configurando SSL para Comunicação de Grupo

Sockets seguros podem ser usados para estabelecer a comunicação entre membros em um grupo. A configuração para isso depende da configuração SSL do Server. Como tal, se o Server tiver SSL configurado, o Plugin Group Replication também terá SSL configurado. Para mais informações sobre as opções para configurar o SSL do Server, consulte [Command Options for Encrypted Connections](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections"). As opções que configuram o Group Replication são mostradas na tabela a seguir.

**Tabela 17.2 Opções SSL**

| Configuração do Server | Descrição da Configuração do Plugin |
| :--- | :--- |
| `ssl_key` | Caminho do arquivo de key. Deve ser usado como certificado Client e Server. |
| `ssl_cert` | Caminho do arquivo de certificado. Deve ser usado como certificado Client e Server. |
| `ssl_ca` | Caminho do arquivo com as Certificate Authorities (CAs) SSL que são confiáveis. |
| `ssl_capath` | Caminho do diretório contendo certificados para Certificate Authorities (CAs) SSL que são confiáveis. |
| `ssl_crl` | Caminho do arquivo contendo as listas de revogação de certificado (Certificate Revocation Lists). |
| `ssl_crlpath` | Caminho do diretório contendo as listas de certificados revogados. |
| `ssl_cipher` | Ciphers permitidos a serem usados durante a criptografia de dados pela conexão. |
| `tls_version` | A comunicação segura usa esta versão e seus protocolos. |

Essas opções são opções de configuração do MySQL Server nas quais o Group Replication confia para sua configuração. Além disso, existe a seguinte opção específica do Group Replication para configurar o SSL no próprio Plugin.

* [`group_replication_ssl_mode`](group-replication-system-variables.html#sysvar_group_replication_ssl_mode)
  - especifica o estado de segurança da conexão entre os membros do Group Replication.

**Tabela 17.3 Valores de configuração de group_replication_ssl_mode**

| Valor | Descrição |
| :--- | :--- |
| *DISABLED* | Estabelece uma conexão não criptografada (*padrão*). |
| REQUIRED | Estabelece uma conexão segura se o Server suportar conexões seguras. |
| VERIFY_CA | Semelhante a REQUIRED, mas adicionalmente verifica o certificado TLS do Server em relação aos certificados da Certificate Authority (CA) configurada. |
| VERIFY_IDENTITY | Semelhante a VERIFY_CA, mas adicionalmente verifica se o certificado do Server corresponde ao host para o qual a conexão está sendo tentada. |

O exemplo a seguir mostra uma seção de exemplo do arquivo my.cnf usada para configurar SSL em um Server e como ativá-lo para o Group Replication.

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

A única opção de configuração específica do Plugin listada é [`group_replication_ssl_mode`](group-replication-system-variables.html#sysvar_group_replication_ssl_mode). Esta opção ativa a comunicação SSL entre os membros do grupo, configurando o framework SSL com os parâmetros `ssl_*` que são fornecidos ao Server.