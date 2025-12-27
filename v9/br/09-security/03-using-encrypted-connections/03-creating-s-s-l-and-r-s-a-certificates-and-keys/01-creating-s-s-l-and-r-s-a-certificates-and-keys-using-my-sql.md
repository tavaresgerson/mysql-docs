#### 8.3.3.1 Criando certificados SSL e RSA e chaves usando MySQL

O MySQL oferece essas maneiras de criar os arquivos de certificado SSL e chave, bem como os arquivos de par de chaves RSA, necessários para suportar conexões criptografadas usando SSL e troca segura de senhas usando RSA em conexões não criptografadas, caso esses arquivos estejam ausentes:

* O servidor pode gerar automaticamente esses arquivos na inicialização, para as distribuições do MySQL.

Importante

A autogeração do servidor ajuda a reduzir a barreira para o uso do SSL, facilitando a geração dos arquivos necessários. No entanto, os certificados gerados por esse método são autoassinados, o que pode não ser muito seguro. Após ganhar experiência com isso, considere obter o material de certificado e chave de uma autoridade de certificação registrada.

Importante

Se um cliente que se conecta a uma instância do servidor MySQL usar um certificado SSL com a extensão `extendedKeyUsage` (uma extensão X.509 v3), o uso estendido da chave deve incluir autenticação de cliente (`clientAuth`). Se o certificado SSL for especificado apenas para autenticação do servidor (`serverAuth`) e outros propósitos de certificado não relacionados ao cliente, a verificação do certificado falha e a conexão do cliente com a instância do servidor MySQL falha. Não há extensão `extendedKeyUsage` nos certificados SSL gerados pelo MySQL Server. Se você usar seu próprio certificado cliente criado de outra maneira, garanta que qualquer extensão `extendedKeyUsage` inclua autenticação de cliente.

* Geração automática de arquivos SSL e RSA
* Características dos arquivos SSL e RSA

Para as distribuições do MySQL compiladas com o OpenSSL, o servidor MySQL tem a capacidade de gerar automaticamente os arquivos SSL e RSA ausentes durante o inicialização. As variáveis de sistema `auto_generate_certs`, `sha256_password_auto_generate_rsa_keys` e `caching_sha2_password_auto_generate_rsa_keys` controlam a geração automática desses arquivos. Essas variáveis são ativadas por padrão. Elas podem ser ativadas durante o inicialização e inspecionadas, mas não podem ser definidas durante a execução.

Durante o inicialização, o servidor gera automaticamente os arquivos de certificado e chave SSL do lado do servidor e do lado do cliente no diretório de dados se a variável de sistema `auto_generate_certs` estiver ativada, não houver opções SSL especificadas e os arquivos SSL do lado do servidor estiverem ausentes do diretório de dados. Esses arquivos permitem conexões cliente criptografadas usando SSL; veja a Seção 8.3.1, “Configurando o MySQL para usar conexões criptografadas”.

1. O servidor verifica o diretório de dados em busca de arquivos SSL com os seguintes nomes:

   ```
   ca.pem
   server-cert.pem
   server-key.pem
   ```

2. Se algum desses arquivos estiver presente, o servidor não cria arquivos SSL. Caso contrário, ele os cria, além de alguns arquivos adicionais:

   ```
   ca.pem               Self-signed CA certificate
   ca-key.pem           CA private key
   server-cert.pem      Server certificate
   server-key.pem       Server private key
   client-cert.pem      Client certificate
   client-key.pem       Client private key
   ```

3. Se o servidor gerar automaticamente arquivos SSL, ele usa os nomes dos arquivos `ca.pem`, `server-cert.pem` e `server-key.pem` para definir as variáveis de sistema correspondentes (`ssl_ca`, `ssl_cert`, `ssl_key`).

Ao inicializar, o servidor gera automaticamente arquivos de par de chaves privadas/públicas RSA no diretório de dados se todas essas condições estiverem verdadeiras: a variável de sistema `sha256_password_auto_generate_rsa_keys` ou `caching_sha2_password_auto_generate_rsa_keys` estiver habilitada; nenhuma opção RSA for especificada; os arquivos RSA estiverem ausentes do diretório de dados. Esses arquivos de par de chaves permitem a troca segura de senhas usando RSA em conexões não criptografadas para contas autenticadas pelo plugin `sha256_password` (desatualizado) ou `caching_sha2_password`; consulte a Seção 8.4.1.2, “Autenticação Conectada por SHA-256”, e a Seção 8.4.1.1, “Autenticação Conectada por SHA-2”.

1. O servidor verifica o diretório de dados em busca de arquivos RSA com os seguintes nomes:

   ```
   private_key.pem      Private member of private/public key pair
   public_key.pem       Public member of private/public key pair
   ```

2. Se algum desses arquivos estiver presente, o servidor não cria arquivos RSA. Caso contrário, eles são criados.

3. Se o servidor gerar automaticamente os arquivos RSA, ele usa seus nomes para definir as variáveis de sistema correspondentes (`sha256_password_private_key_path` e `sha256_password_public_key_path`; `caching_sha2_password_private_key_path` e `caching_sha2_password_public_key_path`).

##### Características dos Arquivos SSL e RSA

Os arquivos SSL e RSA criados automaticamente pelo servidor têm essas características:

* As chaves SSL e RSA têm um tamanho de 2048 bits.
* O certificado da CA SSL é autoassinado.
* Os certificados do servidor e do cliente SSL são assinados com o certificado e a chave da CA, usando o algoritmo de assinatura `sha256WithRSAEncryption`.

* Os certificados SSL usam esses valores de Nome Comum (CN), com o tipo de certificado apropriado (CA, Servidor, Cliente):

  ```
  ca.pem:         MySQL_Server_suffix_Auto_Generated_CA_Certificate
  server-cert.pm: MySQL_Server_suffix_Auto_Generated_Server_Certificate
  client-cert.pm: MySQL_Server_suffix_Auto_Generated_Client_Certificate
  ```

  O valor do *`suffix`* é baseado no número da versão do MySQL.

Para arquivos gerados pelo servidor, se os valores resultantes de CN excederem 64 caracteres, a parte "_suffix" do nome é omitida.

* Arquivos SSL têm valores em branco para País (C), Estado ou Província (ST), Organização (O), Nome da Unidade da Organização (OU) e endereço de e-mail.

* Arquivos SSL criados pelo servidor são válidos por dez anos a partir do momento da geração.

* Arquivos RSA não expiram.
* Arquivos SSL têm números de série diferentes para cada par de certificado/chave (1 para CA, 2 para servidor, 3 para cliente).

* Arquivos criados automaticamente pelo servidor são de propriedade da conta que executa o servidor.

* Em sistemas Unix e Unix-like, o modo de acesso do arquivo é 644 para arquivos de certificado (ou seja, legíveis para o mundo) e 600 para arquivos de chave (ou seja, acessíveis apenas pela conta que executa o servidor).

Para ver o conteúdo de um certificado SSL (por exemplo, para verificar a faixa de datas em que é válido), invoque o **openssl** diretamente:

```
openssl x509 -text -in ca.pem
openssl x509 -text -in server-cert.pem
openssl x509 -text -in client-cert.pem
```

Também é possível verificar as informações de expiração do certificado SSL usando esta instrução SQL:

```
mysql> SHOW STATUS LIKE 'Ssl_server_not%';
+-----------------------+--------------------------+
| Variable_name         | Value                    |
+-----------------------+--------------------------+
| Ssl_server_not_after  | Apr 28 14:16:39 2027 GMT |
| Ssl_server_not_before | May  1 14:16:39 2017 GMT |
+-----------------------+--------------------------+
```