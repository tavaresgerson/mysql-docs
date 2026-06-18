### 19.3.1 Configurando a replicação para usar conexões criptografadas

Para usar uma conexão criptografada para a transferência do log binário necessário durante a replicação, tanto o servidor de origem quanto o servidor de replicação devem suportar conexões de rede criptografadas. Se qualquer um dos servidores não suportar conexões criptografadas (porque não foram compilados ou configurados para isso), a replicação através de uma conexão criptografada não é possível.

Configurar conexões criptografadas para replicação é semelhante a fazer isso para conexões cliente/servidor. Você deve obter (ou criar) um certificado de segurança adequado que você pode usar na fonte e um certificado semelhante (da mesma autoridade de certificação) em cada replica. Você também deve obter arquivos de chave adequados.

Para obter mais informações sobre a configuração de um servidor e um cliente para conexões criptografadas, consulte a Seção 8.3.1, “Configurando o MySQL para usar conexões criptografadas”.

Para habilitar conexões criptografadas na fonte, você deve criar ou obter os arquivos de certificado e chave adequados e, em seguida, adicionar os seguintes parâmetros de configuração à seção `[mysqld]` do arquivo fonte `my.cnf`, alterando os nomes dos arquivos conforme necessário:

```
[mysqld]
ssl_ca=cacert.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
```

Os caminhos para os arquivos podem ser relativos ou absolutos; recomendamos que você sempre use caminhos completos para esse propósito.

Os parâmetros de configuração são os seguintes:

- `ssl_ca`: O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA). (`ssl_capath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de certificados da CA.)

- `ssl_cert`: O nome do caminho do arquivo de certificado da chave pública do servidor. Este certificado pode ser enviado ao cliente e autenticado contra o certificado da CA que ele possui.

- `ssl_key`: O nome do caminho do arquivo de chave privada do servidor.

Para habilitar conexões criptografadas na replica, use a instrução `CHANGE REPLICATION SOURCE TO` (MySQL 8.0.23 e versões posteriores) ou a instrução `CHANGE MASTER TO` (antes do MySQL 8.0.23).

- Para nomear os arquivos de certificado e chave privada SSL da réplica usando `CHANGE REPLICATION SOURCE TO` (`CHANGE MASTER TO`), adicione as opções apropriadas `SOURCE_SSL_xxx` (`MASTER_SSL_xxx`) assim:

  ```
      -> SOURCE_SSL_CA = 'ca_file_name',
      -> SOURCE_SSL_CAPATH = 'ca_directory_name',
      -> SOURCE_SSL_CERT = 'cert_file_name',
      -> SOURCE_SSL_KEY = 'key_file_name',
  ```

  Essas opções correspondem às opções `--ssl-xxx` com os mesmos nomes, conforme descrito nas Opções de Comando para Conexões Encriptadas. Para que essas opções tenham efeito, o `SOURCE_SSL=1` também deve ser definido. Para uma conexão de replicação, especificar um valor para qualquer uma das opções `SOURCE_SSL_CA` ou `SOURCE_SSL_CAPATH` corresponde a definir o `--ssl-mode=VERIFY_CA`. A tentativa de conexão só terá sucesso se um certificado válido da Autoridade de Certificação (CA) for encontrado usando as informações especificadas.

- Para ativar a verificação de identidade do nome do host, adicione a opção `SOURCE_SSL_VERIFY_SERVER_CERT`, da seguinte forma:

  ```
      -> SOURCE_SSL_VERIFY_SERVER_CERT=1,
  ```

  Esta opção corresponde à opção `--ssl-verify-server-cert`, que está desatualizada no MySQL 5.7 e foi removida no MySQL 8.0. Para uma conexão de replicação, especificar `MASTER_SSL_VERIFY_SERVER_CERT=1` corresponde a definir `--ssl-mode=VERIFY_IDENTITY`, conforme descrito nas Opções de comando para conexões criptografadas. Para que essa opção tenha efeito, `SOURCE_SSL=1` também deve ser definido. A verificação da identidade do nome do host não funciona com certificados autoassinados.

- Para ativar as verificações da lista de revogação de certificados (CRL), adicione a opção `SOURCE_SSL_CRL` ou `SOURCE_SSL_CRLPATH`, conforme mostrado aqui:

  ```
      -> SOURCE_SSL_CRL = 'crl_file_name',
      -> SOURCE_SSL_CRLPATH = 'crl_directory_name',
  ```

  Essas opções correspondem às opções `--ssl-xxx` com os mesmos nomes, conforme descrito nas Opções de Comando para Conexões Encriptadas. Se não forem especificadas, nenhuma verificação de CRL será realizada.

- Para especificar listas de cifra, suites de cifra e protocolos de criptografia permitidos pela réplica para a conexão de replicação, use as opções `SOURCE_SSL_CIPHER`, `SOURCE_TLS_VERSION` e `SOURCE_TLS_CIPHERSUITES`, da seguinte forma:

  ```
      -> SOURCE_SSL_CIPHER = 'cipher_list',
      -> SOURCE_TLS_VERSION = 'protocol_list',
      -> SOURCE_TLS_CIPHERSUITES = 'ciphersuite_list',
  ```

  - A opção `SOURCE_SSL_CIPHER` especifica uma lista separada por vírgula de um ou mais cifrados permitidos pela réplica para a conexão de replicação.

  - A opção `SOURCE_TLS_VERSION` especifica uma lista separada por vírgula dos protocolos de criptografia TLS permitidos pela réplica para a conexão de replicação, em um formato semelhante ao da variável de sistema `tls_version`. O procedimento de conexão negocia o uso da versão mais alta de TLS que tanto a fonte quanto a réplica permitem. Para poder se conectar, a réplica deve ter pelo menos uma versão de TLS em comum com a fonte.

  - A opção `SOURCE_TLS_CIPHERSUITES` (disponível a partir do MySQL 8.0.19) especifica uma lista separada por vírgula de uma ou mais suítes de cifra permitidas pela replica para a conexão de replicação se o TLSv1.3 for usado para a conexão. Se esta opção for definida como `NULL` quando o TLSv1.3 for usado (o que é o padrão se você não definir a opção), as suítes de cifra habilitadas por padrão serão permitidas. Se você definir a opção para uma string vazia, nenhuma suíte de cifra será permitida, e, portanto, o TLSv1.3 não será usado.

  Os protocolos, cifra e suites de cifra que você pode especificar nessas listas dependem da biblioteca SSL usada para compilar o MySQL. Para obter informações sobre os formatos, os valores permitidos e os valores padrão se você não especificar as opções, consulte a Seção 8.3.2, “Protocolos e cifra de conexão TLS criptografada”.

  Nota

  No MySQL 8.0.16 a 8.0.18, o MySQL suporta TLSv1.3, mas a opção `SOURCE_TLS_CIPHERSUITES` não está disponível. Nesses lançamentos, se TLSv1.3 for usado para conexões entre uma fonte e uma replica, a fonte deve permitir o uso de pelo menos um conjunto de criptografia TLSv1.3 habilitado por padrão. A partir do MySQL 8.0.19, você pode usar a opção para especificar qualquer seleção de conjuntos de criptografia, incluindo apenas conjuntos de criptografia não padrão, se desejar.

- Depois que as informações de origem forem atualizadas, inicie o processo de replicação na réplica, da seguinte forma:

  ```
  mysql> START SLAVE;
  ```

  A partir do MySQL 8.0.22, `START REPLICA` é preferível, conforme mostrado aqui:

  ```
  mysql> START REPLICA;
  ```

  Você pode usar a instrução `SHOW REPLICA STATUS` (antes do MySQL 8.0.22, `SHOW SLAVE STATUS`) para confirmar se uma conexão criptografada foi estabelecida com sucesso.

- Exigir conexões criptografadas na replica não garante que a fonte exija conexões criptografadas das réplicas. Se você deseja garantir que a fonte aceite apenas réplicas que se conectam usando conexões criptografadas, crie uma conta de usuário de replicação na fonte usando a opção `REQUIRE SSL`, e, em seguida, conceda ao usuário o privilégio `REPLICATION SLAVE`. Por exemplo:

  ```
  mysql> CREATE USER 'repl'@'%.example.com' IDENTIFIED BY 'password'
      -> REQUIRE SSL;
  mysql> GRANT REPLICATION SLAVE ON *.*
      -> TO 'repl'@'%.example.com';
  ```

  Se você tiver uma conta de usuário de replicação existente na fonte, você pode adicionar `REQUIRE SSL` a ela com esta declaração:

  ```
  mysql> ALTER USER 'repl'@'%.example.com' REQUIRE SSL;
  ```
