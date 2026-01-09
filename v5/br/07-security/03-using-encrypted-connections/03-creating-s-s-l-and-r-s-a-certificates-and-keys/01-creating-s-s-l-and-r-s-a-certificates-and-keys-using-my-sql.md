#### 6.3.3.1 Criando Certificados e Chaves SSL e RSA usando MySQL

O MySQL oferece essas maneiras de criar os arquivos de certificado SSL e chave e os arquivos de par de chaves RSA necessários para suportar conexões criptografadas usando SSL e troca segura de senhas usando RSA em conexões não criptografadas, caso esses arquivos estejam ausentes:

- O servidor pode gerar automaticamente esses arquivos na inicialização, para distribuições do MySQL compiladas usando o OpenSSL.

- Os usuários podem invocar o utilitário **mysql_ssl_rsa_setup** manualmente.

- Para alguns tipos de distribuição, como pacotes RPM e DEB, a invocação de **mysql_ssl_rsa_setup** ocorre durante a inicialização do diretório de dados. Nesse caso, a distribuição do MySQL não precisa ter sido compilada com o OpenSSL, desde que o comando **openssl** esteja disponível.

Importante

A autogeração do servidor e o **mysql_ssl_rsa_setup** ajudam a reduzir a barreira para o uso do SSL, facilitando a geração dos arquivos necessários. No entanto, os certificados gerados por esses métodos são autoassinados, o que pode não ser muito seguro. Após ganhar experiência usando esses arquivos, considere obter o material de certificado/chave de uma autoridade de certificação registrada.

Importante

Se um cliente que se conecta a uma instância do servidor MySQL usar um certificado SSL com a extensão `extendedKeyUsage` (uma extensão X.509 v3), o uso de chave estendido deve incluir a autenticação do cliente (`clientAuth`). Se o certificado SSL for especificado apenas para autenticação do servidor (`serverAuth`) e para outros fins que não sejam de certificado do cliente, a verificação do certificado falhará e a conexão do cliente com a instância do servidor MySQL falhará. Não há extensão `extendedKeyUsage` em certificados SSL gerados pelo MySQL Server. Se você usar seu próprio certificado do cliente criado de outra maneira, certifique-se de que qualquer extensão `extendedKeyUsage` inclua a autenticação do cliente.

- Geração automática de arquivos SSL e RSA
- Geração de arquivos SSL e RSA manual usando mysql_ssl_rsa_setup
- Características dos arquivos SSL e RSA

##### Geração automática de arquivos SSL e RSA

Para as distribuições do MySQL compiladas com o OpenSSL, o servidor MySQL tem a capacidade de gerar automaticamente os arquivos SSL e RSA ausentes durante o inicialização. As variáveis de sistema `auto_generate_certs` e `sha256_password_auto_generate_rsa_keys` controlam a geração automática desses arquivos. Essas variáveis são ativadas por padrão. Elas podem ser ativadas durante o inicialização e inspecionadas, mas não podem ser definidas durante a execução.

Ao inicializar, o servidor gera automaticamente os arquivos de certificado e chave SSL do lado do servidor e do lado do cliente no diretório de dados se a variável de sistema `auto_generate_certs` estiver habilitada, não forem especificadas outras opções SSL além de `--ssl` e os arquivos SSL do lado do servidor estiverem ausentes do diretório de dados. Esses arquivos permitem conexões criptografadas do cliente usando SSL; veja Seção 6.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”.

1. O servidor verifica o diretório de dados em busca de arquivos SSL com os seguintes nomes:

   ```sh
   ca.pem
   server-cert.pem
   server-key.pem
   ```

2. Se algum desses arquivos estiver presente, o servidor não cria arquivos SSL. Caso contrário, ele os cria, além de alguns arquivos adicionais:

   ```sql
   ca.pem               Self-signed CA certificate
   ca-key.pem           CA private key
   server-cert.pem      Server certificate
   server-key.pem       Server private key
   client-cert.pem      Client certificate
   client-key.pem       Client private key
   ```

3. Se o servidor gerar automaticamente os arquivos SSL, ele usa os nomes dos arquivos `ca.pem`, `server-cert.pem` e `server-key.pem` para definir as variáveis do sistema correspondentes (`ssl_ca`, `ssl_cert`, `ssl_key`).

Ao inicializar, o servidor gera automaticamente arquivos de par de chaves privadas/públicas RSA no diretório de dados se todas essas condições forem verdadeiras: A variável de sistema `sha256_password_auto_generate_rsa_keys` estiver habilitada; nenhuma opção RSA for especificada; os arquivos RSA estiverem ausentes do diretório de dados. Esses arquivos de par de chaves permitem a troca segura de senhas usando RSA em conexões não criptografadas para contas autenticadas pelo plugin `sha256_password`; consulte Seção 6.4.1.5, “Autenticação Conectada a SHA-256”.

1. O servidor verifica o diretório de dados em busca de arquivos RSA com os seguintes nomes:

   ```sh
   private_key.pem      Private member of private/public key pair
   public_key.pem       Public member of private/public key pair
   ```

2. Se algum desses arquivos estiver presente, o servidor não cria arquivos RSA. Caso contrário, ele os cria.

3. Se o servidor gerar automaticamente os arquivos RSA, ele usará seus nomes para definir as variáveis do sistema correspondentes (`sha256_password_private_key_path`, `sha256_password_public_key_path`).

##### Geração de arquivos SSL e RSA manual usando mysql_ssl_rsa_setup

As distribuições do MySQL incluem um utilitário **mysql_ssl_rsa_setup** que pode ser acionado manualmente para gerar arquivos SSL e RSA. Este utilitário está incluído em todas as distribuições do MySQL, mas exige que o comando **openssl** esteja disponível. Para instruções de uso, consulte Seção 4.4.5, “mysql_ssl_rsa_setup — Criar arquivos SSL/RSA”.

##### Características dos arquivos SSL e RSA

Os arquivos SSL e RSA criados automaticamente pelo servidor ou ao invocar **mysql_ssl_rsa_setup** têm essas características:

- As chaves SSL e RSA têm um tamanho de 2048 bits.

- O certificado da CA SSL é autoassinado.

- Os certificados do servidor e do cliente SSL são assinados com o certificado e a chave da CA, usando o algoritmo de assinatura `sha256WithRSAEncryption`.

- Os certificados SSL utilizam esses valores de Nome Comum (CN), com o tipo de certificado apropriado (CA, Servidor, Cliente):

  ```sh
  ca.pem:         MySQL_Server_suffix_Auto_Generated_CA_Certificate
  server-cert.pm: MySQL_Server_suffix_Auto_Generated_Server_Certificate
  client-cert.pm: MySQL_Server_suffix_Auto_Generated_Client_Certificate
  ```

  O valor do sufixo é baseado no número da versão do MySQL. Para arquivos gerados pelo **mysql_ssl_rsa_setup**, o sufixo pode ser especificado explicitamente usando a opção `--suffix`.

  Para arquivos gerados pelo servidor, se os valores de CN resultantes ultrapassarem 64 caracteres, a parte `_suffix` do nome é omitida.

- Os arquivos SSL têm valores em branco para País (C), Estado ou Província (ST), Organização (O), Nome da Unidade da Organização (OU) e endereço de e-mail.

- Os arquivos SSL criados pelo servidor ou pelo **mysql_ssl_rsa_setup** são válidos por dez anos a partir do momento da geração.

- Os arquivos RSA não expiram.

- Os arquivos SSL têm números de série diferentes para cada par de certificado/chave (1 para CA, 2 para servidor, 3 para cliente).

- Os arquivos criados automaticamente pelo servidor são de propriedade da conta que executa o servidor. Arquivos criados usando **mysql_ssl_rsa_setup** são de propriedade do usuário que invocou esse programa. Isso pode ser alterado em sistemas que suportam a chamada de sistema `chown()`, se o programa for invocado pelo `root` e a opção `--uid` (`mysql-ssl-rsa-setup.html#option_mysql_ssl_rsa_setup_uid`) for fornecida para especificar o usuário que deve possuir os arquivos.

- Nos sistemas Unix e Unix-like, o modo de acesso ao arquivo é 644 para arquivos de certificado (ou seja, acessíveis por todos) e 600 para arquivos de chave (ou seja, acessíveis apenas pela conta que executa o servidor).

Para ver o conteúdo de um certificado SSL (por exemplo, para verificar a faixa de datas em que ele é válido), invoque o **openssl** diretamente:

```sh
openssl x509 -text -in ca.pem
openssl x509 -text -in server-cert.pem
openssl x509 -text -in client-cert.pem
```

É também possível verificar as informações de expiração do certificado SSL usando esta instrução SQL:

```sql
mysql> SHOW STATUS LIKE 'Ssl_server_not%';
+-----------------------+--------------------------+
| Variable_name         | Value                    |
+-----------------------+--------------------------+
| Ssl_server_not_after  | Apr 28 14:16:39 2027 GMT |
| Ssl_server_not_before | May  1 14:16:39 2017 GMT |
+-----------------------+--------------------------+
```
