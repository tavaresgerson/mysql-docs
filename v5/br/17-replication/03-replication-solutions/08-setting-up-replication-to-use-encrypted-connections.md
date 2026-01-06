### 16.3.8 Configurando a replicação para usar conexões criptografadas

Para usar uma conexão criptografada para a transferência do log binário necessário durante a replicação, tanto o servidor de origem quanto o servidor de replicação devem suportar conexões de rede criptografadas. Se qualquer um dos servidores não suportar conexões criptografadas (porque não foram compilados ou configurados para isso), a replicação através de uma conexão criptografada não é possível.

Configurar conexões criptografadas para replicação é semelhante a fazer isso para conexões cliente/servidor. Você deve obter (ou criar) um certificado de segurança adequado que você pode usar na fonte e um certificado semelhante (da mesma autoridade de certificação) em cada replica. Você também deve obter arquivos de chave adequados.

Para obter mais informações sobre a configuração de um servidor e um cliente para conexões criptografadas, consulte Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas”.

Para habilitar conexões criptografadas na fonte, você deve criar ou obter os arquivos de certificado e chave adequados e, em seguida, adicionar os seguintes parâmetros de configuração à configuração da fonte na seção `[mysqld]` do arquivo `my.cnf` da fonte, alterando os nomes dos arquivos conforme necessário:

```sql
[mysqld]
ssl_ca=cacert.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
```

Os caminhos para os arquivos podem ser relativos ou absolutos; recomendamos que você sempre use caminhos completos para esse propósito.

Os parâmetros de configuração são os seguintes:

- `ssl_ca`: O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA). (`--ssl-capath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de certificados da CA.)

- `ssl_cert`: O nome do caminho do arquivo de certificado da chave pública do servidor. Este certificado pode ser enviado ao cliente e autenticado contra o certificado da CA que ele possui.

- `ssl_key`: O nome do caminho do arquivo de chave privada do servidor.

Para habilitar conexões criptografadas na replica, use a instrução `CHANGE MASTER TO`.

- Para nomear os arquivos de certificado e chave privada SSL da réplica usando `CHANGE MASTER TO`, adicione as opções apropriadas `MASTER_SSL_xxx`, como este exemplo:

  ```sql
      -> MASTER_SSL_CA = 'ca_file_name',
      -> MASTER_SSL_CAPATH = 'ca_directory_name',
      -> MASTER_SSL_CERT = 'cert_file_name',
      -> MASTER_SSL_KEY = 'key_file_name',
  ```

  Essas opções correspondem às opções `--ssl-xxx` com os mesmos nomes, conforme descrito em Opções de comando para conexões criptografadas. Para que essas opções tenham efeito, também deve ser definido `MASTER_SSL=1`. Para uma conexão de replicação, especificar um valor para `MASTER_SSL_CA` ou `MASTER_SSL_CAPATH` corresponde a definir `--ssl-mode=VERIFY_CA`. A tentativa de conexão só terá sucesso se um certificado válido da Autoridade de Certificação (CA) for encontrado usando as informações especificadas.

- Para ativar a verificação de identidade do nome do host, adicione a opção `MASTER_SSL_VERIFY_SERVER_CERT`:

  ```sql
      -> MASTER_SSL_VERIFY_SERVER_CERT=1,
  ```

  Esta opção corresponde à opção `--ssl-verify-server-cert`, que está desatualizada a partir do MySQL 5.7.11 e foi removida no MySQL 8.0. Para uma conexão de replicação, especificar `MASTER_SSL_VERIFY_SERVER_CERT=1` corresponde a definir `--ssl-mode=VERIFY_IDENTITY`, conforme descrito em Opções de comando para conexões criptografadas. Para que essa opção tenha efeito, também deve ser definida `MASTER_SSL=1`. A verificação da identidade do nome do host não funciona com certificados autoassinados.

- Para ativar as verificações da lista de revogação de certificados (CRL), adicione a opção `MASTER_SSL_CRL` ou `MASTER_SSL_CRLPATH`, conforme mostrado aqui:

  ```sql
      -> MASTER_SSL_CRL = 'crl_file_name',
      -> MASTER_SSL_CRLPATH = 'crl_directory_name',
  ```

  Essas opções correspondem às opções `--ssl-xxx` com os mesmos nomes, conforme descrito em Opções de comando para conexões criptografadas. Se não forem especificadas, nenhuma verificação de CRL será realizada.

- Para especificar listas de cifra e protocolos de criptografia permitidos pela réplica para a conexão de replicação, adicione as opções `MASTER_SSL_CIPHER` e `MASTER_TLS_VERSION`, da seguinte forma:

  ```sql
      -> MASTER_SSL_CIPHER = 'cipher_list',
      -> MASTER_TLS_VERSION = 'protocol_list',
      -> SOURCE_TLS_CIPHERSUITES = 'ciphersuite_list',
  ```

  A opção `MASTER_SSL_CIPHER` especifica a lista de criptografias permitidas pela réplica para a conexão de replicação, com um ou mais nomes de criptografia separados por colchetes. A opção `MASTER_TLS_VERSION` especifica os protocolos de criptografia permitidos pela réplica para a conexão de replicação. O formato é semelhante ao da variável de sistema `tls_version`, com uma ou mais versões de protocolos separadas por vírgulas. Os protocolos e criptografias que você pode usar nessas listas dependem da biblioteca SSL usada para compilar o MySQL. Para obter informações sobre os formatos e os valores permitidos, consulte Seção 6.3.2, “Protocolos e Criptografias TLS de Conexão Encriptada”.

- Depois que as informações de origem forem atualizadas, inicie o processo de replicação na réplica, da seguinte forma:

  ```sql
  mysql> START SLAVE;
  ```

  Você pode usar a instrução `SHOW SLAVE STATUS` para confirmar que uma conexão criptografada foi estabelecida com sucesso.

- Exigir conexões criptografadas na replica não garante que a fonte exija conexões criptografadas das réplicas. Se você deseja garantir que a fonte aceite apenas réplicas que se conectam usando conexões criptografadas, crie uma conta de usuário de replicação na fonte usando a opção `REQUER SSL`, e, em seguida, conceda ao usuário o privilégio `REPLICA SÉRVEIO`. Por exemplo:

  ```sql
  mysql> CREATE USER 'repl'@'%.example.com' IDENTIFIED BY 'password'
      -> REQUIRE SSL;
  mysql> GRANT REPLICATION SLAVE ON *.*
      -> TO 'repl'@'%.example.com';
  ```

  Se você tiver uma conta de usuário de replicação existente na fonte, você pode adicionar `REQUER SSL` a ela com esta declaração:

  ```sql
  mysql> ALTER USER 'repl'@'%.example.com' REQUIRE SSL;
  ```
