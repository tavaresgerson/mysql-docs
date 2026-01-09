### 4.4.5 mysql_ssl_rsa_setup — Criar arquivos SSL/RSA

Este programa cria os arquivos de certificado SSL e chave, bem como os arquivos de par de chaves RSA necessários para suportar conexões seguras usando SSL e troca segura de senhas usando RSA em conexões não criptografadas, caso esses arquivos estejam ausentes. O **mysql_ssl_rsa_setup** também pode ser usado para criar novos arquivos SSL se os existentes tiverem expirado.

::: info Nota
O **mysql_ssl_rsa_setup** utiliza o comando **openssl**, portanto, seu uso depende da instalação do OpenSSL em sua máquina.
:::

Outra maneira de gerar arquivos SSL e RSA, para distribuições MySQL compiladas com o OpenSSL, é fazer o servidor gerar automaticamente. Veja a Seção 6.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”.

::: warning Importante
O **mysql_ssl_rsa_setup** ajuda a reduzir a barreira para o uso do SSL, facilitando a geração dos arquivos necessários. No entanto, os certificados gerados pelo **mysql_ssl_rsa_setup** são autoassinados, o que não é muito seguro. Após ganhar experiência com os arquivos criados pelo **mysql_ssl_rsa_setup**, considere obter um certificado CA de uma autoridade de certificação registrada.
:::

Invoque **mysql_ssl_rsa_setup** da seguinte forma:

```sh
mysql_ssl_rsa_setup [options]
```

As opções típicas são `--datadir` para especificar o local onde os arquivos serão criados e `--verbose` para ver os comandos do **openssl** que o **mysql_ssl_rsa_setup** executa.

O **mysql_ssl_rsa_setup** tenta criar arquivos SSL e RSA usando um conjunto padrão de nomes de arquivos. Funciona da seguinte forma:

1. O **mysql_ssl_rsa_setup** verifica a presença do binário **openssl** nos locais especificados pela variável de ambiente **PATH**. Se o **openssl** não for encontrado, o **mysql_ssl_rsa_setup** não faz nada. Se o **openssl** estiver presente, o **mysql_ssl_rsa_setup** procura os arquivos SSL e RSA padrão no diretório de dados do MySQL especificado pela opção **--datadir**, ou no diretório de dados integrado se a opção **--datadir** não for fornecida.

2. O **mysql_ssl_rsa_setup** verifica o diretório de dados em busca de arquivos SSL com os seguintes nomes:

   ```sh
   ca.pem
   server-cert.pem
   server-key.pem
   ```

3. Se algum desses arquivos estiver presente, o **mysql_ssl_rsa_setup** não cria nenhum arquivo SSL. Caso contrário, ele invoca o **openssl** para criá-los, além de alguns arquivos adicionais:

   ```sh
   ca.pem               Self-signed CA certificate
   ca-key.pem           CA private key
   server-cert.pem      Server certificate
   server-key.pem       Server private key
   client-cert.pem      Client certificate
   client-key.pem       Client private key
   ```

   Esses arquivos permitem conexões seguras com o cliente usando SSL; veja a Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas”.

4. O **mysql_ssl_rsa_setup** verifica o diretório de dados em busca de arquivos RSA com os seguintes nomes:

   ```sh
   private_key.pem      Private member of private/public key pair
   public_key.pem       Public member of private/public key pair
   ```

5. Se algum desses arquivos estiver presente, o **mysql_ssl_rsa_setup** não cria arquivos RSA. Caso contrário, ele invoca o **openssl** para criá-los. Esses arquivos permitem a troca segura de senhas usando RSA em conexões não criptografadas para contas autenticadas pelo plugin `sha256_password`; veja a Seção 6.4.1.5, “Autenticação Personalizável SHA-256”.

Para obter informações sobre as características dos arquivos criados pelo **mysql_ssl_rsa_setup**, consulte a Seção 6.3.3.1, “Criando certificados e chaves SSL e RSA usando o MySQL”.

Ao iniciar, o servidor MySQL usa automaticamente os arquivos SSL criados pelo **mysql_ssl_rsa_setup** para habilitar o SSL se não forem fornecidas opções SSL explícitas, exceto `--ssl` (possível junto com `ssl_cipher`). Se você preferir designar os arquivos explicitamente, inicie os clientes com as opções `--ssl-ca`, `--ssl-cert` e `--ssl-key` para nomear os arquivos `ca.pem`, `server-cert.pem` e `server-key.pem`, respectivamente.

O servidor também usa automaticamente os arquivos RSA criados pelo **mysql_ssl_rsa_setup** para habilitar o RSA, caso não sejam fornecidas opções explícitas de RSA.

Se o servidor estiver habilitado para SSL, os clientes usam SSL por padrão para a conexão. Para especificar explicitamente os arquivos de certificado e chave, use as opções `--ssl-ca`, `--ssl-cert` e `--ssl-key` para nomear os arquivos `ca.pem`, `client-cert.pem` e `client-key.pem`, respectivamente. No entanto, pode ser necessário configurar o cliente adicionalmente, pois o **mysql_ssl_rsa_setup** cria, por padrão, esses arquivos no diretório de dados. As permissões do diretório de dados normalmente permitem o acesso apenas à conta do sistema que executa o servidor MySQL, então os programas de cliente não podem usar arquivos localizados lá. Para tornar os arquivos disponíveis, copie-os para um diretório que seja legível (mas *não* gravável) pelos clientes:

- Para clientes locais, o diretório de instalação do MySQL pode ser usado. Por exemplo, se o diretório de dados for um subdiretório do diretório de instalação e sua localização atual for o diretório de dados, você pode copiar os arquivos da seguinte maneira:

  ```sh
  cp ca.pem client-cert.pem client-key.pem ..
  ```

- Para clientes remotos, distribua os arquivos por meio de um canal seguro para garantir que não sejam adulterados durante o trânsito.

Se os arquivos SSL usados para uma instalação do MySQL expiraram, você pode usar **mysql_ssl_rsa_setup** para criar novos:

1. Pare o servidor.

2. Renomeie ou remova os arquivos SSL existentes. Você pode querer fazer um backup deles primeiro. (Os arquivos RSA não expiram, então você não precisa removê-los. **mysql_ssl_rsa_setup** percebe que eles existem e não os sobrescreve.)

3. Execute **mysql_ssl_rsa_setup** com a opção `--datadir` para especificar o local onde os novos arquivos serão criados.

4. Reinicie o servidor.

O **mysql_ssl_rsa_setup** suporta as seguintes opções de linha de comando, que podem ser especificadas na linha de comando ou nos grupos `[mysql_ssl_rsa_setup]`, `[mysql_install_db]` e `[mysqld]` de um arquivo de opções. Para obter informações sobre arquivos de opções usados por programas do MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.11 Opções de mysql_ssl_rsa_setup**

<table>
   <thead>
      <tr>
         <th>Nome da Opção</th>
         <th>Descrição</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>--datadir</td>
         <td>Caminho para o diretório de dados</td>
      </tr>
      <tr>
         <td>--help</td>
         <td>Exibir mensagem de ajuda e sair</td>
      </tr>
      <tr>
         <td>--suffix</td>
         <td>Sufixo para o atributo Nome comum do certificado X.509</td>
      </tr>
      <tr>
         <td>--uid</td>
         <td>Nome do usuário efetivo a ser usado para permissões de arquivo</td>
      </tr>
      <tr>
         <td>--verbose</td>
         <td>Modo verbosos</td>
      </tr>
      <tr>
         <td>--version</td>
         <td>Exibir informações da versão e sair</td>
      </tr>
   </tbody>
</table>

- `--help`, `?`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--datadir=dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--datadir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O caminho para o diretório que o **mysql_ssl_rsa_setup** deve verificar para arquivos SSL e RSA padrão e em que ele deve criar arquivos se eles estiverem ausentes. O padrão é o diretório de dados integrado.

- `--suffix=str`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--suffix=str</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O sufixo para o atributo Nome Comum em certificados X.509. O valor do sufixo é limitado a 17 caracteres. O padrão é baseado no número da versão do MySQL.

- `--uid=nome`, `-v`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--uid=name</code>]]</td> </tr></tbody></table>

  O nome do usuário que deve ser o proprietário de quaisquer arquivos criados. O valor é um nome de usuário, não um ID de usuário numérico. Na ausência desta opção, os arquivos criados por **mysql_ssl_rsa_setup** são de propriedade do usuário que os executa. Esta opção só é válida se você executar o programa como `root` em um sistema que suporte a chamada de sistema `chown()`.

- `--verbose`, `-v`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--verbose</code>]]</td> </tr></tbody></table>

  Modo verbose. Produza mais informações sobre o que o programa faz. Por exemplo, o programa mostra os comandos do **openssl** que ele executa e produz saída para indicar se ele ignora a criação de arquivos SSL ou RSA porque algum arquivo padrão já existe.

- `--version`, `-V`

  <table><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--version</code>]]</td> </tr></tbody></table>

  Exibir informações da versão e sair.
