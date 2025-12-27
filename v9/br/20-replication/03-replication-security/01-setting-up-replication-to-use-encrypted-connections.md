### 19.3.1 Configurando a Replicação para Usar Conexões Encriptadas

Para usar uma conexão encriptada para a transferência do log binário necessário durante a replicação, tanto o servidor de origem quanto o servidor replica devem suportar conexões de rede encriptadas. Se qualquer um dos servidores não suportar conexões encriptadas (porque não foi compilado ou configurado para isso), a replicação por meio de uma conexão encriptada não é possível.

Configurar conexões encriptadas para a replicação é semelhante a fazer isso para conexões cliente/servidor. Você deve obter (ou criar) um certificado de segurança adequado que você pode usar na origem e um certificado semelhante (da mesma autoridade de certificação) em cada replica. Você também deve obter arquivos de chave adequados.

Para obter mais informações sobre como configurar um servidor e um cliente para conexões encriptadas, consulte a Seção 8.3.1, “Configurando o MySQL para Usar Conexões Encriptadas”.

Para habilitar conexões encriptadas na origem, você deve criar ou obter arquivos de certificado e chave adequados e, em seguida, adicionar os seguintes parâmetros de configuração à seção `[mysqld]` do arquivo `my.cnf` da origem, alterando os nomes dos arquivos conforme necessário:

```
[mysqld]
ssl_ca=cacert.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
```

Os caminhos para os arquivos podem ser relativos ou absolutos; recomendamos que você sempre use caminhos completos para esse propósito.

Os parâmetros de configuração são os seguintes:

* `ssl_ca`: O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA). (`ssl_capath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de certificados de CA.)

* `ssl_cert`: O nome do caminho do arquivo de certificado da chave pública do servidor. Este certificado pode ser enviado ao cliente e autenticado contra o certificado de CA que ele possui.

* `ssl_key`: O nome do caminho do arquivo de chave privada do servidor.

Para habilitar conexões criptografadas na replica, use a instrução `CHANGE REPLICATION SOURCE TO`.

* Para nomear os arquivos de certificado e chave privada SSL da replica usando `CHANGE REPLICATION SOURCE TO`, adicione as opções apropriadas `SOURCE_SSL_xxx`, como este:

  ```
      -> SOURCE_SSL_CA = 'ca_file_name',
      -> SOURCE_SSL_CAPATH = 'ca_directory_name',
      -> SOURCE_SSL_CERT = 'cert_file_name',
      -> SOURCE_SSL_KEY = 'key_file_name',
  ```

  Essas opções correspondem às opções `--ssl-xxx` com os mesmos nomes, conforme descrito nas Opções de Comando para Conexões Criptografadas. Para que essas opções tenham efeito, `SOURCE_SSL=1` também deve ser definido. Para uma conexão de replicação, especificar um valor para `SOURCE_SSL_CA` ou `SOURCE_SSL_CAPATH` corresponde a definir `--ssl-mode=VERIFY_CA`. A tentativa de conexão só terá sucesso se um certificado válido da Autoridade de Certificação (CA) for encontrado usando as informações especificadas.

* Para ativar a verificação de identidade de nome de host, adicione a opção `SOURCE_SSL_VERIFY_SERVER_CERT`, como este:

  ```
      -> SOURCE_SSL_VERIFY_SERVER_CERT=1,
  ```

  Para uma conexão de replicação, especificar `SOURCE_SSL_VERIFY_SERVER_CERT=1` corresponde a definir `--ssl-mode=VERIFY_IDENTITY`, conforme descrito nas Opções de Comando para Conexões Criptografadas. Para que essa opção tenha efeito, `SOURCE_SSL=1` também deve ser definido. A verificação de identidade de nome de host não funciona com certificados autoassinados.

* Para ativar verificações de lista de revogação de certificados (CRL), adicione as opções `SOURCE_SSL_CRL` ou `SOURCE_SSL_CRLPATH`, como mostrado aqui:

  ```
      -> SOURCE_SSL_CRL = 'crl_file_name',
      -> SOURCE_SSL_CRLPATH = 'crl_directory_name',
  ```

  Essas opções correspondem às opções `--ssl-xxx` com os mesmos nomes, conforme descrito nas Opções de Comando para Conexões Criptografadas. Se não forem especificadas, nenhuma verificação de CRL será realizada.

* Para especificar listas de cifra, suítes de cifra e protocolos de criptografia permitidos pela replica para a conexão de replicação, use as opções `SOURCE_SSL_CIPHER`, `SOURCE_TLS_VERSION` e `SOURCE_TLS_CIPHERSUITES`, como este:

```
      -> SOURCE_SSL_CIPHER = 'cipher_list',
      -> SOURCE_TLS_VERSION = 'protocol_list',
      -> SOURCE_TLS_CIPHERSUITES = 'ciphersuite_list',
  ```

  + A opção `SOURCE_SSL_CIPHER` especifica uma lista separada por vírgula de um ou mais criptogramas permitidos pela réplica para a conexão de replicação.

  + A opção `SOURCE_TLS_VERSION` especifica uma lista separada por vírgula dos protocolos de criptografia TLS permitidos pela réplica para a conexão de replicação, em um formato como o da variável de sistema `tls_version`. O procedimento de conexão negocia o uso da versão TLS mais alta que tanto a fonte quanto a réplica permitem. Para se conectar, a réplica deve ter pelo menos uma versão TLS em comum com a fonte.

  + A opção `SOURCE_TLS_CIPHERSUITES` especifica uma lista separada por vírgula de um ou mais conjuntos de criptogramas permitidos pela réplica para a conexão de replicação, se o TLSv1.3 for usado para a conexão. Se esta opção for definida como `NULL` quando o TLSv1.3 for usado (o que é o padrão se você não definir a opção), os conjuntos de criptogramas habilitados por padrão são permitidos. Se você definir a opção para uma string vazia, nenhum conjunto de criptogramas é permitido, e o TLSv1.3, portanto, não é usado.

  Os protocolos, criptogramas e conjuntos de criptogramas que você pode especificar nessas listas dependem da biblioteca SSL usada para compilar o MySQL. Para informações sobre os formatos, os valores permitidos e os padrões se você não especificar as opções, consulte a Seção 8.3.2, “Protocolos e Criptogramas TLS de Conexão Encriptada”.

  Nota

  Você pode usar a opção `SOURCE_TLS_CIPHERSUITES` para especificar qualquer seleção de conjuntos de criptogramas, incluindo apenas conjuntos de criptogramas não padrão, se desejar.

* Após as informações da fonte terem sido atualizadas, inicie o processo de replicação na réplica, da seguinte forma:

  ```
  mysql> START REPLICA;
  ```

  Você pode usar a declaração `SHOW REPLICA STATUS` para confirmar que uma conexão encriptada foi estabelecida com sucesso.

* Exigir conexões criptografadas na replica não garante que a fonte exija conexões criptografadas das réplicas. Se você deseja garantir que a fonte aceite apenas réplicas que se conectam usando conexões criptografadas, crie uma conta de usuário de replicação na fonte usando a opção `REQUER SSL`, e, em seguida, conceda ao usuário o privilégio `REPLICAÇÃO ESCRIVA`. Por exemplo:

  ```
  mysql> CREATE USER 'repl'@'%.example.com' IDENTIFIED BY 'password'
      -> REQUIRE SSL;
  mysql> GRANT REPLICATION SLAVE ON *.*
      -> TO 'repl'@'%.example.com';
  ```

  Se você tiver uma conta de usuário de replicação existente na fonte, pode adicionar `REQUER SSL` a ela com esta declaração:

  ```
  mysql> ALTER USER 'repl'@'%.example.com' REQUIRE SSL;
  ```