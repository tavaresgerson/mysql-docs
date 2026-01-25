### 6.3.1 Configurando o MySQL para Usar Conexões Criptografadas

Vários parâmetros de configuração estão disponíveis para indicar se devem ser usadas conexões criptografadas e para especificar os arquivos de Certificate e Key apropriados. Esta seção fornece orientação geral sobre a configuração do Server e Clients para conexões criptografadas:

* [Configuração de Inicialização do Lado do Server para Conexões Criptografadas](using-encrypted-connections.html#using-encrypted-connections-server-side-startup-configuration "Server-Side Startup Configuration for Encrypted Connections")
* [Configuração do Lado do Client para Conexões Criptografadas](using-encrypted-connections.html#using-encrypted-connections-client-side-configuration "Client-Side Configuration for Encrypted Connections")
* [Configurando Conexões Criptografadas como Obrigatórias](using-encrypted-connections.html#mandatory-encrypted-connections "Configuring Encrypted Connections as Mandatory")

Conexões criptografadas também podem ser usadas em outros contextos, conforme discutido nestas seções adicionais:

* Entre Source e Replica Servers. Consulte [Seção 16.3.8, “Configurando a Replication para Usar Conexões Criptografadas”](replication-encrypted-connections.html "16.3.8 Setting Up Replication to Use Encrypted Connections").

* Entre Group Replication Servers. Consulte [Seção 17.6.2, “Suporte a Secure Socket Layer (SSL) do Group Replication”](group-replication-secure-socket-layer-support-ssl.html "17.6.2 Group Replication Secure Socket Layer (SSL) Support").

* Por programas Client que são baseados na API C do MySQL. Consulte [Suporte para Conexões Criptografadas](/doc/c-api/5.7/en/c-api-encrypted-connections.html).

Instruções para a criação de quaisquer arquivos de Certificate e Key necessários estão disponíveis em [Seção 6.3.3, “Criando Certificates e Keys SSL e RSA”](creating-ssl-rsa-files.html "6.3.3 Creating SSL and RSA Certificates and Keys").

#### Configuração de Inicialização do Lado do Server para Conexões Criptografadas

No lado do Server, a opção [`--ssl`](server-options.html#option_mysqld_ssl) especifica que o Server permite, mas não exige, conexões criptografadas. Esta opção está habilitada por padrão, portanto, não precisa ser especificada explicitamente.

Para exigir que os Clients se conectem usando conexões criptografadas, habilite a System Variable [`require_secure_transport`](server-system-variables.html#sysvar_require_secure_transport). Consulte [Configurando Conexões Criptografadas como Obrigatórias](using-encrypted-connections.html#mandatory-encrypted-connections "Configuring Encrypted Connections as Mandatory").

Estas System Variables do lado do Server especificam os arquivos de Certificate e Key que o Server usa ao permitir que Clients estabeleçam conexões criptografadas:

* [`ssl_ca`](server-system-variables.html#sysvar_ssl_ca): O nome do caminho do arquivo de Certificate da Certificate Authority (CA). ([`ssl_capath`](server-system-variables.html#sysvar_ssl_capath) é semelhante, mas especifica o nome do caminho de um diretório de arquivos de Certificate CA.)

* [`ssl_cert`](server-system-variables.html#sysvar_ssl_cert): O nome do caminho do arquivo de Public Key Certificate do Server. Este Certificate pode ser enviado ao Client e autenticado em relação ao Certificate CA que ele possui.

* [`ssl_key`](server-system-variables.html#sysvar_ssl_key): O nome do caminho do arquivo de Private Key do Server.

Por exemplo, para habilitar o Server para conexões criptografadas, inicie-o com estas linhas no arquivo `my.cnf`, alterando os nomes dos arquivos conforme necessário:

```sql
[mysqld]
ssl_ca=ca.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
```

Para especificar adicionalmente que os Clients são obrigados a usar conexões criptografadas, habilite a System Variable [`require_secure_transport`](server-system-variables.html#sysvar_require_secure_transport):

```sql
[mysqld]
ssl_ca=ca.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
require_secure_transport=ON
```

Cada System Variable de Certificate e Key nomeia um arquivo no formato PEM. Caso você precise criar os arquivos de Certificate e Key necessários, consulte [Seção 6.3.3, “Criando Certificates e Keys SSL e RSA”](creating-ssl-rsa-files.html "6.3.3 Creating SSL and RSA Certificates and Keys"). MySQL Servers compilados usando OpenSSL podem gerar arquivos de Certificate e Key ausentes automaticamente na inicialização. Consulte [Seção 6.3.3.1, “Criando Certificates e Keys SSL e RSA usando MySQL”](creating-ssl-rsa-files-using-mysql.html "6.3.3.1 Creating SSL and RSA Certificates and Keys using MySQL"). Alternativamente, se você tiver uma distribuição de Source do MySQL, você pode testar sua configuração usando os arquivos de Certificate e Key de demonstração em seu diretório `mysql-test/std_data`.

O Server realiza a autodescoberta de arquivos de Certificate e Key. Se nenhuma opção explícita de conexão criptografada for fornecida além de [`--ssl`](server-options.html#option_mysqld_ssl) (possivelmente junto com [`ssl_cipher`](server-system-variables.html#sysvar_ssl_cipher)) para configurar conexões criptografadas, o Server tenta habilitar o suporte a conexões criptografadas automaticamente na inicialização:

* Se o Server descobrir arquivos de Certificate e Key válidos chamados `ca.pem`, `server-cert.pem` e `server-key.pem` no diretório de Data, ele habilita o suporte para conexões criptografadas por Clients. (Os arquivos não precisam ter sido gerados automaticamente; o que importa é que eles tenham esses nomes e sejam válidos.)

* Se o Server não encontrar arquivos de Certificate e Key válidos no diretório de Data, ele continua a execução, mas sem suporte para conexões criptografadas.

Se o Server habilitar automaticamente o suporte a conexões criptografadas, ele registra uma nota no Error Log. Se o Server descobrir que o Certificate CA é autoassinado (self-signed), ele registra um aviso no Error Log. (O Certificate é autoassinado se criado automaticamente pelo Server ou manualmente usando [**mysql_ssl_rsa_setup**](mysql-ssl-rsa-setup.html "4.4.5 mysql_ssl_rsa_setup — Create SSL/RSA Files").)

O MySQL também fornece estas System Variables para controle de conexão criptografada do lado do Server:

* [`ssl_cipher`](server-system-variables.html#sysvar_ssl_cipher): A lista de Ciphers permitidos para criptografia de Connection.

* [`ssl_crl`](server-system-variables.html#sysvar_ssl_crl): O nome do caminho do arquivo contendo listas de revogação de Certificate. ([`ssl_crlpath`](server-system-variables.html#sysvar_ssl_crlpath) é semelhante, mas especifica o nome do caminho de um diretório de arquivos de lista de revogação de Certificate.)

* [`tls_version`](server-system-variables.html#sysvar_tls_version): Quais protocolos de criptografia o Server permite para conexões criptografadas; consulte [Seção 6.3.2, “Protocolos e Ciphers TLS de Conexão Criptografada”](encrypted-connection-protocols-ciphers.html "6.3.2 Encrypted Connection TLS Protocols and Ciphers"). Por exemplo, você pode configurar [`tls_version`](server-system-variables.html#sysvar_tls_version) para impedir que Clients usem protocolos menos seguros.

#### Configuração do Lado do Client para Conexões Criptografadas

Para obter uma lista completa de opções do Client relacionadas ao estabelecimento de conexões criptografadas, consulte [Opções de Comando para Conexões Criptografadas](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections").

Por padrão, os programas Client do MySQL tentam estabelecer uma Connection criptografada se o Server suportar conexões criptografadas, com controle adicional disponível através da opção [`--ssl-mode`](connection-options.html#option_general_ssl-mode):

* Na ausência de uma opção [`--ssl-mode`](connection-options.html#option_general_ssl-mode), os Clients tentam se conectar usando criptografia, voltando a uma Connection não criptografada se uma Connection criptografada não puder ser estabelecida. Este é também o comportamento com uma opção explícita [`--ssl-mode=PREFERRED`](connection-options.html#option_general_ssl-mode).

* Com [`--ssl-mode=REQUIRED`](connection-options.html#option_general_ssl-mode), os Clients exigem uma Connection criptografada e falham se uma não puder ser estabelecida.

* Com [`--ssl-mode=DISABLED`](connection-options.html#option_general_ssl-mode), os Clients usam uma Connection não criptografada.

* Com [`--ssl-mode=VERIFY_CA`](connection-options.html#option_general_ssl-mode) ou [`--ssl-mode=VERIFY_IDENTITY`](connection-options.html#option_general_ssl-mode), os Clients exigem uma Connection criptografada e também executam a Verification contra o Certificate CA do Server e (com `VERIFY_IDENTITY`) contra o Hostname do Server em seu Certificate.

Importante

A configuração padrão, [`--ssl-mode=PREFERRED`](connection-options.html#option_general_ssl-mode), produz uma Connection criptografada se as outras configurações padrão não forem alteradas. No entanto, para ajudar a prevenir ataques sofisticados de man-in-the-middle, é importante que o Client verifique a identidade do Server. As configurações [`--ssl-mode=VERIFY_CA`](connection-options.html#option_general_ssl-mode) e [`--ssl-mode=VERIFY_IDENTITY`](connection-options.html#option_general_ssl-mode) são uma escolha melhor do que a configuração padrão para ajudar a prevenir esse tipo de ataque. `VERIFY_CA` faz com que o Client verifique se o Certificate do Server é válido. `VERIFY_IDENTITY` faz com que o Client verifique se o Certificate do Server é válido e também faz com que o Client verifique se o Hostname que o Client está usando corresponde à identidade no Certificate do Server. Para implementar uma dessas configurações, você deve primeiro garantir que o Certificate CA para o Server esteja confiavelmente disponível para todos os Clients que o utilizam em seu ambiente, caso contrário, resultarão problemas de disponibilidade. Por esse motivo, elas não são a configuração padrão.

Tentativas de estabelecer uma Connection não criptografada falham se a System Variable [`require_secure_transport`](server-system-variables.html#sysvar_require_secure_transport) estiver habilitada no lado do Server para fazer com que o Server exija conexões criptografadas. Consulte [Configurando Conexões Criptografadas como Obrigatórias](using-encrypted-connections.html#mandatory-encrypted-connections "Configurando Conexões Criptografadas como Obrigatórias").

As seguintes opções do lado do Client identificam os arquivos de Certificate e Key que os Clients usam ao estabelecer conexões criptografadas com o Server. Elas são semelhantes às System Variables [`ssl_ca`](server-system-variables.html#sysvar_ssl_ca), [`ssl_cert`](server-system-variables.html#sysvar_ssl_cert) e [`ssl_key`](server-system-variables.html#sysvar_ssl_key) usadas no lado do Server, mas [`--ssl-cert`](connection-options.html#option_general_ssl-cert) e [`--ssl-key`](connection-options.html#option_general_ssl-key) identificam a Public Key e Private Key do Client:

* [`--ssl-ca`](connection-options.html#option_general_ssl-ca): O nome do caminho do arquivo de Certificate da Certificate Authority (CA). Esta opção, se usada, deve especificar o mesmo Certificate usado pelo Server. (`--ssl-capath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de Certificate CA.)

* [`--ssl-cert`](connection-options.html#option_general_ssl-cert): O nome do caminho do arquivo de Public Key Certificate do Client.

* [`--ssl-key`](connection-options.html#option_general_ssl-key): O nome do caminho do arquivo de Private Key do Client.

Para segurança adicional em relação à fornecida pela criptografia padrão, os Clients podem fornecer um Certificate CA que corresponda ao usado pelo Server e habilitar a Verification de identidade por Hostname. Dessa forma, o Server e o Client depositam sua confiança no mesmo Certificate CA e o Client verifica se o Host ao qual ele se conectou é o pretendido:

* Para especificar o Certificate CA, use [`--ssl-ca`](connection-options.html#option_general_ssl-ca) (ou [`--ssl-capath`](connection-options.html#option_general_ssl-capath)) e especifique [`--ssl-mode=VERIFY_CA`](connection-options.html#option_general_ssl-mode).

* Para habilitar a Verification de identidade por Hostname também, use [`--ssl-mode=VERIFY_IDENTITY`](connection-options.html#option_general_ssl-mode) em vez de [`--ssl-mode=VERIFY_CA`](connection-options.html#option_general_ssl-mode).

Nota

A Verification de identidade por Hostname com `VERIFY_IDENTITY` não funciona com Certificates autoassinados que são criados automaticamente pelo Server ou manualmente usando [**mysql_ssl_rsa_setup**](mysql-ssl-rsa-setup.html "4.4.5 mysql_ssl_rsa_setup — Create SSL/RSA Files") (consulte [Seção 6.3.3.1, “Criando Certificates e Keys SSL e RSA usando MySQL”](creating-ssl-rsa-files-using-mysql.html "6.3.3.1 Creating SSL and RSA Certificates and Keys using MySQL")). Tais Certificates autoassinados não contêm o nome do Server como o valor do Common Name.

Antes do MySQL 5.7.23, a Verification de identidade por Hostname também não funciona com Certificates que especificam o Common Name usando wildcards porque esse nome é comparado literalmente com o nome do Server.

O MySQL também fornece estas opções para controle de conexão criptografada do lado do Client:

* [`--ssl-cipher`](connection-options.html#option_general_ssl-cipher): A lista de Ciphers permitidos para criptografia de Connection.

* [`--ssl-crl`](connection-options.html#option_general_ssl-crl): O nome do caminho do arquivo contendo listas de revogação de Certificate. (`--ssl-crlpath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de lista de revogação de Certificate.)

* [`--tls-version`](connection-options.html#option_general_tls-version): Os protocolos de criptografia permitidos; consulte [Seção 6.3.2, “Protocolos e Ciphers TLS de Conexão Criptografada”](encrypted-connection-protocols-ciphers.html "6.3.2 Encrypted Connection TLS Protocols and Ciphers").

Dependendo dos requisitos de criptografia da conta MySQL usada por um Client, o Client pode ser obrigado a especificar certas opções para se conectar usando criptografia ao MySQL Server.

Suponha que você queira se conectar usando uma conta que não tenha requisitos especiais de criptografia ou que foi criada usando uma instrução [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") que incluiu a cláusula `REQUIRE SSL`. Assumindo que o Server suporte conexões criptografadas, um Client pode se conectar usando criptografia sem a opção [`--ssl-mode`](connection-options.html#option_general_ssl-mode) ou com uma opção explícita [`--ssl-mode=PREFERRED`](connection-options.html#option_general_ssl-mode):

```sql
mysql
```

Ou:

```sql
mysql --ssl-mode=PREFERRED
```

Para uma conta criada com uma cláusula `REQUIRE SSL`, a tentativa de Connection falha se uma Connection criptografada não puder ser estabelecida. Para uma conta sem requisitos especiais de criptografia, a tentativa retorna a uma Connection não criptografada se uma Connection criptografada não puder ser estabelecida. Para evitar o fallback e falhar se uma Connection criptografada não puder ser obtida, conecte-se assim:

```sql
mysql --ssl-mode=REQUIRED
```

Se a conta tiver requisitos de segurança mais rigorosos, outras opções devem ser especificadas para estabelecer uma Connection criptografada:

* Para contas criadas com uma cláusula `REQUIRE X509`, os Clients devem especificar pelo menos [`--ssl-cert`](connection-options.html#option_general_ssl-cert) e [`--ssl-key`](connection-options.html#option_general_ssl-key). Além disso, [`--ssl-ca`](connection-options.html#option_general_ssl-ca) (ou [`--ssl-capath`](connection-options.html#option_general_ssl-capath)) é recomendado para que o Public Certificate fornecido pelo Server possa ser verificado. Por exemplo (digite o comando em uma única linha):

  ```sql
  mysql --ssl-ca=ca.pem
        --ssl-cert=client-cert.pem
        --ssl-key=client-key.pem
  ```

* Para contas criadas com uma cláusula `REQUIRE ISSUER` ou `REQUIRE SUBJECT`, os requisitos de criptografia são os mesmos que para `REQUIRE X509`, mas o Certificate deve corresponder ao Issuer ou Subject, respectivamente, especificado na definição da conta.

Para obter informações adicionais sobre a cláusula `REQUIRE`, consulte [Seção 13.7.1.2, “Instrução CREATE USER”](create-user.html "13.7.1.2 CREATE USER Statement").

MySQL Servers podem gerar arquivos de Client Certificate e Key que os Clients podem usar para se conectar a instâncias do MySQL Server. Consulte [Seção 6.3.3, “Criando Certificates e Keys SSL e RSA”](creating-ssl-rsa-files.html "6.3.3 Creating SSL and RSA Certificates and Keys").

Importante

Se um Client que se conecta a uma instância do MySQL Server usa um Certificate SSL com a extensão `extendedKeyUsage` (uma extensão X.509 v3), o extended key usage deve incluir a Client Authentication (`clientAuth`). Se o Certificate SSL for especificado apenas para Server Authentication (`serverAuth`) e outros propósitos de Certificate não Client, a Verification do Certificate falha e a Connection do Client para a instância do MySQL Server falha. Não há extensão `extendedKeyUsage` em Certificates SSL gerados pelo MySQL Server (conforme descrito em [Seção 6.3.3.1, “Criando Certificates e Keys SSL e RSA usando MySQL”](creating-ssl-rsa-files-using-mysql.html "6.3.3.1 Creating SSL and RSA Certificates and Keys using MySQL")), e em Certificates SSL criados usando o comando **openssl** seguindo as instruções em [Seção 6.3.3.2, “Criando Certificates e Keys SSL Usando openssl”](creating-ssl-files-using-openssl.html "6.3.3.2 Creating SSL Certificates and Keys Using openssl"). Se você usar seu próprio Client Certificate criado de outra forma, certifique-se de que qualquer extensão `extendedKeyUsage` inclua a Client Authentication.

Para impedir o uso de criptografia e anular outras opções `--ssl-xxx`, invoque o programa Client com [`--ssl-mode=DISABLED`](connection-options.html#option_general_ssl-mode):

```sql
mysql --ssl-mode=DISABLED
```

Para determinar se a Connection atual com o Server usa criptografia, verifique o valor de sessão da Status Variable [`Ssl_cipher`](server-status-variables.html#statvar_Ssl_cipher). Se o valor estiver vazio, a Connection não está criptografada. Caso contrário, a Connection está criptografada e o valor indica o Cipher de criptografia. Por exemplo:

```sql
mysql> SHOW SESSION STATUS LIKE 'Ssl_cipher';
+---------------+---------------------------+
| Variable_name | Value                     |
+---------------+---------------------------+
| Ssl_cipher    | DHE-RSA-AES128-GCM-SHA256 |
+---------------+---------------------------+
```

Para o Client [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), uma alternativa é usar o comando `STATUS` ou `\s` e verificar a linha `SSL`:

```sql
mysql> \s
...
SSL: Not in use
...
```

Ou:

```sql
mysql> \s
...
SSL: Cipher in use is DHE-RSA-AES128-GCM-SHA256
...
```

#### Configurando Conexões Criptografadas como Obrigatórias

Para algumas implantações do MySQL, pode ser não apenas desejável, mas obrigatório usar conexões criptografadas (por exemplo, para satisfazer requisitos regulatórios). Esta seção discute as configurações que permitem que você faça isso. Estes níveis de controle estão disponíveis:

* Você pode configurar o Server para exigir que os Clients se conectem usando conexões criptografadas.

* Você pode invocar programas Client individuais para exigir uma Connection criptografada, mesmo que o Server permita, mas não exija criptografia.

* Você pode configurar contas MySQL individuais para serem utilizáveis apenas através de conexões criptografadas.

Para exigir que os Clients se conectem usando conexões criptografadas, habilite a System Variable [`require_secure_transport`](server-system-variables.html#sysvar_require_secure_transport). Por exemplo, coloque estas linhas no arquivo `my.cnf` do Server:

```sql
[mysqld]
require_secure_transport=ON
```

Com [`require_secure_transport`](server-system-variables.html#sysvar_require_secure_transport) habilitado, as conexões Client com o Server são obrigadas a usar alguma forma de Secure Transport, e o Server permite apenas conexões TCP/IP que usam SSL, ou conexões que usam um arquivo de Socket (em Unix) ou Shared Memory (em Windows). O Server rejeita tentativas de Connection não seguras, que falham com um erro [`ER_SECURE_TRANSPORT_REQUIRED`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_secure_transport_required).

Para invocar um programa Client de modo que ele exija uma Connection criptografada, independentemente de o Server exigir criptografia, use um valor de opção [`--ssl-mode`](connection-options.html#option_general_ssl-mode) de `REQUIRED`, `VERIFY_CA` ou `VERIFY_IDENTITY`. Por exemplo:

```sql
mysql --ssl-mode=REQUIRED
mysqldump --ssl-mode=VERIFY_CA
mysqladmin --ssl-mode=VERIFY_IDENTITY
```

Para configurar uma conta MySQL para ser utilizável apenas por meio de conexões criptografadas, inclua uma cláusula `REQUIRE` na instrução [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") que cria a conta, especificando nessa cláusula as características de criptografia que você exige. Por exemplo, para exigir uma Connection criptografada e o uso de um Certificate X.509 válido, use `REQUIRE X509`:

```sql
CREATE USER 'jeffrey'@'localhost' REQUIRE X509;
```

Para obter informações adicionais sobre a cláusula `REQUIRE`, consulte [Seção 13.7.1.2, “Instrução CREATE USER”](create-user.html "13.7.1.2 CREATE USER Statement").

Para modificar contas existentes que não possuem requisitos de criptografia, use a instrução [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement").