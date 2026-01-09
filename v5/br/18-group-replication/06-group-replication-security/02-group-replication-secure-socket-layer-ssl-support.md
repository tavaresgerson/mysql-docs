### 17.6.2 Suporte à Replicação em Grupo com Secure Socket Layer (SSL)

As conexões de comunicação em grupo, bem como as conexões de recuperação, são protegidas usando SSL. As seções a seguir explicam como configurar as conexões.

#### Configurando SSL para Recuperação de Replicação de Grupo

A recuperação é realizada por meio de uma conexão de replicação assíncrona regular. Uma vez que o doador é selecionado, o servidor que está se juntando ao grupo estabelece uma conexão de replicação assíncrona. Tudo isso é automático.

No entanto, um usuário que exige uma conexão SSL deve ter sido criado antes de o servidor que se junta ao grupo se conectar ao doador. Normalmente, isso é configurado quando um servidor é provisionado para se juntar ao grupo.

```sql
donor> SET SQL_LOG_BIN=0;
donor> CREATE USER 'rec_ssl_user'@'%' REQUIRE SSL;
donor> GRANT replication slave ON *.* TO 'rec_ssl_user'@'%';
donor> SET SQL_LOG_BIN=1;
```

Supondo que todos os servidores já no grupo tenham um conjunto de usuários de replicação configurado para usar SSL, você configura o servidor que está se juntando ao grupo para usar essas credenciais ao se conectar ao doador. Isso é feito de acordo com os valores das opções SSL fornecidas para o plugin de replicação de grupo.

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

Ferramentas de conexões seguras podem ser usadas para estabelecer comunicação entre os membros de um grupo. A configuração para isso depende da configuração SSL do servidor. Assim, se o servidor tiver SSL configurado, o plugin de Replicação de Grupo também terá SSL configurado. Para mais informações sobre as opções de configuração do SSL do servidor, consulte [Opções de Comando para Conexões Encriptadas](connection-options.html#encrypted-connection-options). As opções que configuram a Replicação de Grupo estão mostradas na tabela a seguir.

**Tabela 17.2 Opções SSL**

<table summary="Lista as opções de configuração do servidor para SSL e descreve seu efeito na configuração do plugin de replicação de grupo para SSL."><col style="width: 43%"/><col style="width: 57%"/><thead><tr> <th><p>Configuração do servidor</p></th> <th><p>Descrição da Configuração do Plugin</p></th> </tr></thead><tbody><tr> <td><p>ssl_key</p></td> <td><p>Caminho do arquivo de chave. Para ser usado como certificado do cliente e do servidor.</p></td> </tr><tr> <td><p>ssl_cert</p></td> <td><p>Caminho do arquivo de certificado. Para ser usado como certificado de cliente e servidor.</p></td> </tr><tr> <td><p>ssl_ca</p></td> <td><p>Caminho do arquivo com as Autoridades de Certificação SSL que são confiáveis.</p></td> </tr><tr> <td><p>ssl_capath</p></td> <td><p>Caminho do diretório que contém certificados para Autoridades de Certificação SSL que são confiáveis.</p></td> </tr><tr> <td><p>ssl_crl</p></td> <td><p>Caminho do arquivo que contém as listas de revogação de certificados.</p></td> </tr><tr> <td><p>ssl_crlpath</p></td> <td><p>Caminho do diretório que contém listas de certificados revogados.</p></td> </tr><tr> <td><p>ssl_cipher</p></td> <td><p>Cifras permitidas para uso durante a criptografia de dados na conexão.</p></td> </tr><tr> <td><p>tls_version</p></td> <td><p>A comunicação segura utiliza esta versão e seus protocolos.</p></td> </tr></tbody></table>

Essas opções são configurações do MySQL Server, nas quais a Replicação em Grupo se baseia para sua configuração. Além disso, há a seguinte opção específica da Replicação em Grupo para configurar o SSL no próprio plugin.

- [`grupo_replication_ssl_mode`](group-replication-system-variables.html#sysvar_grupo_replication_ssl_mode)
  - especifica o estado de segurança da conexão entre os membros da replicação em grupo.

**Tabela 17.3 valores de configuração do modo grupo_replication_ssl**

<table summary="Lista os possíveis valores para o grupo_replication_ssl_mode e descreve seu efeito sobre a forma como os membros do grupo de replicação se conectam entre si."><col style="width: 43%"/><col style="width: 57%"/><thead><tr> <th><p>Valor</p></th> <th><p>Descrição</p></th> </tr></thead><tbody><tr> <td><p> <span class="emphasis"><em>INÁBIL</em></span> </p></td> <td><p>Estabeleça uma conexão não criptografada (<span class="emphasis"><em>padrão</em></span>).</p></td> </tr><tr> <td><p>REQUERIDO</p></td> <td><p>Estabeleça uma conexão segura, se o servidor suportar conexões seguras.</p></td> </tr><tr> <td><p>VERIFICAR_CA</p></td> <td><p>Como REQUERIDO, mas, adicionalmente, verifique o certificado TLS do servidor contra os certificados da Autoridade de Certificação (CA) configurados.</p></td> </tr><tr> <td><p>VERIFICAR_IDENTIDADE</p></td> <td><p>Como VERIFY_CA, mas, além disso, verifique se o certificado do servidor corresponde ao hospedeiro ao qual a conexão é tentada.</p></td> </tr></tbody></table>

O exemplo a seguir mostra uma seção do arquivo my.cnf usada para configurar o SSL em um servidor e como ativá-lo para a Replicação por Grupo.

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

A única opção de configuração específica do plugin que está listada é [`group_replication_ssl_mode`](group-replication-system-variables.html#sysvar_group_replication_ssl_mode). Esta opção ativa a comunicação SSL entre os membros do grupo, configurando o framework SSL com os parâmetros `ssl_*` fornecidos ao servidor.
