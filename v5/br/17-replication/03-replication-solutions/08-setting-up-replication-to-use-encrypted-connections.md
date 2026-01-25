### 16.3.8 Configurando a Replication para Usar Conexões Criptografadas

Para usar uma conexão criptografada para a transferência do binary log exigido durante a replication, ambos os servidores source e replica devem suportar conexões de rede criptografadas. Se qualquer um dos servidores não suportar conexões criptografadas (por não ter sido compilado ou configurado para elas), a replication por meio de uma conexão criptografada não é possível.

Configurar conexões criptografadas para replication é semelhante a fazê-lo para conexões client/server. Você deve obter (ou criar) um security certificate adequado que você possa usar no source, e um certificate similar (da mesma certificate authority) em cada replica. Você também deve obter key files adequados.

Para mais informações sobre como configurar um server e client para conexões criptografadas, veja [Seção 6.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”](using-encrypted-connections.html "6.3.1 Configurando o MySQL para Usar Conexões Criptografadas").

Para habilitar conexões criptografadas no source, você deve criar ou obter certificate e key files adequados e, em seguida, adicionar os seguintes configuration parameters à configuração do source dentro da seção `[mysqld]` do arquivo `my.cnf` do source, alterando os nomes dos arquivos conforme necessário:

```sql
[mysqld]
ssl_ca=cacert.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
```

Os paths para os arquivos podem ser relativos ou absolutos; recomendamos que você sempre use paths completos para este propósito.

Os configuration parameters são os seguintes:

* [`ssl_ca`](server-system-variables.html#sysvar_ssl_ca): O path name do arquivo de certificate da Certificate Authority (CA). (`--ssl-capath` é similar, mas especifica o path name de um directory de arquivos de certificate da CA.)

* [`ssl_cert`](server-system-variables.html#sysvar_ssl_cert): O path name do arquivo de certificate de public key do server. Este certificate pode ser enviado ao client e autenticado contra o CA certificate que ele possui.

* [`ssl_key`](server-system-variables.html#sysvar_ssl_key): O path name do arquivo de private key do server.

Para habilitar conexões criptografadas no replica, use o statement [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement").

* Para nomear os certificate e SSL private key files do replica usando [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement"), adicione as opções `MASTER_SSL_xxx` apropriadas, desta forma:

  ```sql
      -> MASTER_SSL_CA = 'ca_file_name',
      -> MASTER_SSL_CAPATH = 'ca_directory_name',
      -> MASTER_SSL_CERT = 'cert_file_name',
      -> MASTER_SSL_KEY = 'key_file_name',
  ```

  Estas opções correspondem às opções `--ssl-xxx` com os mesmos nomes, conforme descrito em [Command Options for Encrypted Connections](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections"). Para que estas opções tenham efeito, `MASTER_SSL=1` também deve ser definido. Para uma replication connection, especificar um valor para `MASTER_SSL_CA` ou `MASTER_SSL_CAPATH` corresponde a definir `--ssl-mode=VERIFY_CA`. A connection attempt só é bem-sucedida se um Certificate Authority (CA) certificate correspondente válido for encontrado usando a informação especificada.

* Para ativar a verificação de identidade de host name, adicione a opção `MASTER_SSL_VERIFY_SERVER_CERT`:

  ```sql
      -> MASTER_SSL_VERIFY_SERVER_CERT=1,
  ```

  Esta opção corresponde à opção `--ssl-verify-server-cert`, que está deprecated a partir do MySQL 5.7.11 e foi removida no MySQL 8.0. Para uma replication connection, especificar `MASTER_SSL_VERIFY_SERVER_CERT=1` corresponde a definir `--ssl-mode=VERIFY_IDENTITY`, conforme descrito em [Command Options for Encrypted Connections](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections"). Para que esta opção tenha efeito, `MASTER_SSL=1` também deve ser definido. A verificação de identidade de Host name não funciona com self-signed certificates.

* Para ativar verificações de certificate revocation list (CRL), adicione a opção `MASTER_SSL_CRL` ou `MASTER_SSL_CRLPATH`, conforme mostrado aqui:

  ```sql
      -> MASTER_SSL_CRL = 'crl_file_name',
      -> MASTER_SSL_CRLPATH = 'crl_directory_name',
  ```

  Estas opções correspondem às opções `--ssl-xxx` com os mesmos nomes, conforme descrito em [Command Options for Encrypted Connections](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections"). Se elas não forem especificadas, nenhuma checagem de CRL ocorre.

* Para especificar lists de ciphers e encryption protocols permitidos pelo replica para a replication connection, adicione as opções `MASTER_SSL_CIPHER` e `MASTER_TLS_VERSION`, desta forma:

  ```sql
      -> MASTER_SSL_CIPHER = 'cipher_list',
      -> MASTER_TLS_VERSION = 'protocol_list',
      -> SOURCE_TLS_CIPHERSUITES = 'ciphersuite_list',
  ```

  A opção `MASTER_SSL_CIPHER` especifica a list de ciphers permitidos pelo replica para a replication connection, com um ou mais nomes de cipher separados por dois pontos. A opção `MASTER_TLS_VERSION` especifica os encryption protocols permitidos pelo replica para a replication connection. O format é semelhante ao da system variable [`tls_version`](server-system-variables.html#sysvar_tls_version), com uma ou mais protocol versions separadas por vírgula. Os protocols e ciphers que você pode usar nestas lists dependem da SSL library usada para compilar o MySQL. Para informações sobre os formats e valores permitidos, veja [Seção 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "6.3.2 Encrypted Connection TLS Protocols and Ciphers").

* Após as informações do source terem sido atualizadas, inicie o replication process no replica, desta forma:

  ```sql
  mysql> START SLAVE;
  ```

  Você pode usar o statement [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") para confirmar que uma conexão criptografada foi estabelecida com sucesso.

* Exigir conexões criptografadas no replica não garante que o source exija conexões criptografadas dos replicas. Se você quiser garantir que o source aceite apenas replicas que se conectam usando conexões criptografadas, crie uma replication user account no source usando a opção `REQUIRE SSL`, e então conceda a esse user o privilege [`REPLICATION SLAVE`](privileges-provided.html#priv_replication-slave). Por exemplo:

  ```sql
  mysql> CREATE USER 'repl'@'%.example.com' IDENTIFIED BY 'password'
      -> REQUIRE SSL;
  mysql> GRANT REPLICATION SLAVE ON *.*
      -> TO 'repl'@'%.example.com';
  ```

  Se você tiver uma replication user account existente no source, você pode adicionar `REQUIRE SSL` a ela com este statement:

  ```sql
  mysql> ALTER USER 'repl'@'%.example.com' REQUIRE SSL;
  ```