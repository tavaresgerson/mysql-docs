#### 6.3.3.1 Criação de Certificates e Keys SSL e RSA usando MySQL

O MySQL fornece estas formas de criar os arquivos de Certificate e Key SSL e os arquivos de Key-pair RSA necessários para suportar conexões criptografadas usando SSL e troca segura de senha usando RSA em conexões não criptografadas, caso esses arquivos estejam ausentes:

* O Server pode autogerar esses arquivos no startup, para distribuições MySQL compiladas usando OpenSSL.

* Os usuários podem invocar o utilitário [**mysql_ssl_rsa_setup**](mysql-ssl-rsa-setup.html "4.4.5 mysql_ssl_rsa_setup — Create SSL/RSA Files") manualmente.

* Para alguns tipos de distribuição, como pacotes RPM e DEB, a invocação de [**mysql_ssl_rsa_setup**](mysql-ssl-rsa-setup.html "4.4.5 mysql_ssl_rsa_setup — Create SSL/RSA Files") ocorre durante a inicialização do Data Directory. Neste caso, a distribuição MySQL não precisa ter sido compilada usando OpenSSL, desde que o comando **openssl** esteja disponível.

Importante

A autogeração do Server e o [**mysql_ssl_rsa_setup**] ajudam a diminuir a barreira para o uso de SSL, tornando mais fácil gerar os arquivos necessários. No entanto, os Certificates gerados por esses métodos são *self-signed* (autoassinados), o que pode não ser muito seguro. Depois de adquirir experiência no uso desses arquivos, considere obter o material de Certificate/Key de uma autoridade certificadora registrada.

Importante

Se um Client que se conecta a uma instância do MySQL Server usar um SSL Certificate com a extensão `extendedKeyUsage` (uma extensão X.509 v3), o uso estendido da Key deve incluir autenticação do Client (`clientAuth`). Se o SSL Certificate for especificado apenas para autenticação do Server (`serverAuth`) e outros propósitos de Certificate que não sejam de Client, a verificação do Certificate falha e a conexão do Client com a instância do MySQL Server falha. Não há extensão `extendedKeyUsage` em SSL Certificates gerados pelo MySQL Server. Se você usar seu próprio Client Certificate criado de outra forma, certifique-se de que qualquer extensão `extendedKeyUsage` inclua autenticação do Client.

* [Geração Automática de Arquivos SSL e RSA](creating-ssl-rsa-files-using-mysql.html#creating-ssl-rsa-files-using-mysql-automatic "Automatic SSL and RSA File Generation")
* [Geração Manual de Arquivos SSL e RSA Usando mysql_ssl_rsa_setup](creating-ssl-rsa-files-using-mysql.html#creating-ssl-rsa-files-using-mysql-manual-using-mysql-ssl-rsa-setup "Manual SSL and RSA File Generation Using mysql_ssl_rsa_setup")
* [Características de Arquivos SSL e RSA](creating-ssl-rsa-files-using-mysql.html#creating-ssl-rsa-files-using-mysql-ssl-and-rsa-file-characteristics "SSL and RSA File Characteristics")

##### Geração Automática de Arquivos SSL e RSA

Para distribuições MySQL compiladas usando OpenSSL, o MySQL Server tem a capacidade de gerar automaticamente arquivos SSL e RSA ausentes no startup. As System Variables [`auto_generate_certs`](server-system-variables.html#sysvar_auto_generate_certs) e [`sha256_password_auto_generate_rsa_keys`](server-system-variables.html#sysvar_sha256_password_auto_generate_rsa_keys) controlam a geração automática desses arquivos. Essas variáveis são habilitadas por padrão. Elas podem ser habilitadas no startup e inspecionadas, mas não definidas em runtime.

No startup, o Server gera automaticamente arquivos de Certificate e Key SSL (tanto do lado do Server quanto do lado do Client) no Data Directory se a System Variable [`auto_generate_certs`](server-system-variables.html#sysvar_auto_generate_certs) estiver habilitada, nenhuma opção SSL diferente de [`--ssl`](server-options.html#option_mysqld_ssl) for especificada, e os arquivos SSL do lado do Server estiverem ausentes no Data Directory. Esses arquivos permitem conexões Client criptografadas usando SSL; veja [Seção 6.3.1, “Configuring MySQL to Use Encrypted Connections”](using-encrypted-connections.html "6.3.1 Configuring MySQL to Use Encrypted Connections").

1. O Server verifica o Data Directory em busca de arquivos SSL com os seguintes nomes:

   ```sql
   ca.pem
   server-cert.pem
   server-key.pem
   ```

2. Se algum desses arquivos estiver presente, o Server não cria arquivos SSL. Caso contrário, ele os cria, além de alguns arquivos adicionais:

   ```sql
   ca.pem               Self-signed CA certificate
   ca-key.pem           CA private key
   server-cert.pem      Server certificate
   server-key.pem       Server private key
   client-cert.pem      Client certificate
   client-key.pem       Client private key
   ```

3. Se o Server autogerar arquivos SSL, ele usa os nomes dos arquivos `ca.pem`, `server-cert.pem` e `server-key.pem` para definir as System Variables correspondentes ([`ssl_ca`](server-system-variables.html#sysvar_ssl_ca), [`ssl_cert`](server-system-variables.html#sysvar_ssl_cert), [`ssl_key`](server-system-variables.html#sysvar_ssl_key)).

No startup, o Server gera automaticamente arquivos de Key-pair privada/pública RSA no Data Directory se todas estas condições forem verdadeiras: A System Variable [`sha256_password_auto_generate_rsa_keys`](server-system-variables.html#sysvar_sha256_password_auto_generate_rsa_keys) estiver habilitada; nenhuma opção RSA for especificada; os arquivos RSA estiverem ausentes no Data Directory. Esses arquivos de Key-pair permitem a troca segura de senha usando RSA em conexões não criptografadas para contas autenticadas pelo Plugin `sha256_password`; veja [Seção 6.4.1.5, “SHA-256 Pluggable Authentication”](sha256-pluggable-authentication.html "6.4.1.5 SHA-256 Pluggable Authentication").

1. O Server verifica o Data Directory em busca de arquivos RSA com os seguintes nomes:

   ```sql
   private_key.pem      Private member of private/public key pair
   public_key.pem       Public member of private/public key pair
   ```

2. Se algum desses arquivos estiver presente, o Server não cria arquivos RSA. Caso contrário, ele os cria.

3. Se o Server autogerar os arquivos RSA, ele usa seus nomes para definir as System Variables correspondentes ([`sha256_password_private_key_path`](server-system-variables.html#sysvar_sha256_password_private_key_path), [`sha256_password_public_key_path`](server-system-variables.html#sysvar_sha256_password_public_key_path)).

##### Geração Manual de Arquivos SSL e RSA Usando mysql_ssl_rsa_setup

As distribuições MySQL incluem um utilitário [**mysql_ssl_rsa_setup**](mysql-ssl-rsa-setup.html "4.4.5 mysql_ssl_rsa_setup — Create SSL/RSA Files") que pode ser invocado manualmente para gerar arquivos SSL e RSA. Este utilitário está incluído em todas as distribuições MySQL, mas requer que o comando **openssl** esteja disponível. Para instruções de uso, veja [Seção 4.4.5, “mysql_ssl_rsa_setup — Create SSL/RSA Files”](mysql-ssl-rsa-setup.html "4.4.5 mysql_ssl_rsa_setup — Create SSL/RSA Files").

##### Características de Arquivos SSL e RSA

Arquivos SSL e RSA criados automaticamente pelo Server ou pela invocação de [**mysql_ssl_rsa_setup**](mysql-ssl-rsa-setup.html "4.4.5 mysql_ssl_rsa_setup — Create SSL/RSA Files") possuem estas características:

* As Keys SSL e RSA têm um tamanho de 2048 bits.
* O CA Certificate SSL é *self-signed* (autoassinado).
* Os Certificates SSL de Server e Client são assinados com o CA Certificate e Key, usando o algoritmo de assinatura `sha256WithRSAEncryption`.

* SSL Certificates usam estes valores de Common Name (CN), com o tipo de Certificate apropriado (CA, Server, Client):

  ```sql
  ca.pem:         MySQL_Server_suffix_Auto_Generated_CA_Certificate
  server-cert.pm: MySQL_Server_suffix_Auto_Generated_Server_Certificate
  client-cert.pm: MySQL_Server_suffix_Auto_Generated_Client_Certificate
  ```

  O valor de *`suffix`* é baseado no número da versão do MySQL. Para arquivos gerados por [**mysql_ssl_rsa_setup**](mysql-ssl-rsa-setup.html "4.4.5 mysql_ssl_rsa_setup — Create SSL/RSA Files"), o *suffix* pode ser especificado explicitamente usando a opção [`--suffix`](mysql-ssl-rsa-setup.html#option_mysql_ssl_rsa_setup_suffix).

  Para arquivos gerados pelo Server, se os valores de CN resultantes excederem 64 caracteres, a porção `_suffix` do nome é omitida.

* Os arquivos SSL têm valores em branco para País (C), Estado ou Província (ST), Organização (O), Nome da Unidade Organizacional (OU) e endereço de email.

* Os arquivos SSL criados pelo Server ou por [**mysql_ssl_rsa_setup**](mysql-ssl-rsa-setup.html "4.4.5 mysql_ssl_rsa_setup — Create SSL/RSA Files") são válidos por dez anos a partir do momento da geração.

* Os arquivos RSA não expiram.
* Os arquivos SSL têm números de série diferentes para cada par Certificate/Key (1 para CA, 2 para Server, 3 para Client).

* Arquivos criados automaticamente pelo Server são de propriedade da conta que executa o Server. Arquivos criados usando [**mysql_ssl_rsa_setup**](mysql-ssl-rsa-setup.html "4.4.5 mysql_ssl_rsa_setup — Create SSL/RSA Files") são de propriedade do usuário que invocou o programa. Isso pode ser alterado em sistemas que suportam a System Call `chown()` se o programa for invocado por `root` e a opção [`--uid`](mysql-ssl-rsa-setup.html#option_mysql_ssl_rsa_setup_uid) for fornecida para especificar o usuário que deve ser o proprietário dos arquivos.

* Em sistemas Unix e semelhantes a Unix, o modo de acesso ao arquivo é 644 para arquivos de Certificate (ou seja, legível por todos) e 600 para arquivos de Key (ou seja, acessível apenas pela conta que executa o Server).

Para visualizar o conteúdo de um SSL Certificate (por exemplo, para verificar o intervalo de datas durante o qual ele é válido), invoque o **openssl** diretamente:

```sql
openssl x509 -text -in ca.pem
openssl x509 -text -in server-cert.pem
openssl x509 -text -in client-cert.pem
```

Também é possível verificar as informações de expiração do SSL Certificate usando esta instrução SQL:

```sql
mysql> SHOW STATUS LIKE 'Ssl_server_not%';
+-----------------------+--------------------------+
| Variable_name         | Value                    |
+-----------------------+--------------------------+
| Ssl_server_not_after  | Apr 28 14:16:39 2027 GMT |
| Ssl_server_not_before | May  1 14:16:39 2017 GMT |
+-----------------------+--------------------------+
```
