#### 6.4.1.5 Autenticação Pluggable SHA-256

O MySQL fornece dois *authentication plugins* que implementam *hashing* SHA-256 para senhas de contas de usuário:

* `sha256_password`: Implementa a autenticação SHA-256 básica.

* `caching_sha2_password`: Implementa a autenticação SHA-256 (assim como `sha256_password`), mas usa *caching* no lado do servidor para melhor desempenho e possui recursos adicionais para maior aplicabilidade.

Esta seção descreve o *authentication plugin* SHA-2 original sem *caching*. Para obter informações sobre o *plugin* com *caching*, consulte [Seção 6.4.1.4, “Autenticação Pluggable SHA-2 com Caching”](caching-sha2-pluggable-authentication.html "6.4.1.4 Caching SHA-2 Pluggable Authentication").

Importante

Para se conectar ao servidor usando uma conta que autentica com o *plugin* `sha256_password`, você deve usar uma conexão TLS ou uma conexão não criptografada que suporte a troca de senha usando um par de chaves RSA, conforme descrito mais adiante nesta seção. De qualquer forma, o *plugin* `sha256_password` usa os recursos de criptografia do MySQL. Consulte [Seção 6.3, “Usando Conexões Criptografadas”](encrypted-connections.html "6.3 Using Encrypted Connections").

Nota

No nome `sha256_password`, “sha256” refere-se ao comprimento do *digest* de 256 bits que o *plugin* usa para criptografia. No nome `caching_sha2_password`, “sha2” refere-se de forma mais geral à classe de algoritmos de criptografia SHA-2, da qual a criptografia de 256 bits é uma instância. A escolha deste último nome deixa espaço para futura expansão de possíveis comprimentos de *digest* sem alterar o nome do *plugin*.

A tabela a seguir mostra os nomes dos *plugins* nos lados do servidor e do cliente.

**Tabela 6.11 Nomes de Plugins e Bibliotecas para Autenticação SHA-256**

<table summary="Nomes para os plugins e o arquivo de biblioteca usados para autenticação de senha SHA-256."><thead><tr> <th>Plugin ou Arquivo</th> <th>Nome do Plugin ou Arquivo</th> </tr></thead><tbody><tr> <td>Plugin do lado do servidor</td> <td><code>sha256_password</code></td> </tr><tr> <td>Plugin do lado do cliente</td> <td><code>sha256_password</code></td> </tr><tr> <td>Arquivo de Biblioteca</td> <td>Nenhum (os plugins são integrados)</td> </tr> </tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação *pluggable* SHA-256:

* [Instalando a Autenticação Pluggable SHA-256](sha256-pluggable-authentication.html#sha256-pluggable-authentication-installation "Instalando a Autenticação Pluggable SHA-256")
* [Usando a Autenticação Pluggable SHA-256](sha256-pluggable-authentication.html#sha256-pluggable-authentication-usage "Usando a Autenticação Pluggable SHA-256")

Para informações gerais sobre autenticação *pluggable* no MySQL, consulte [Seção 6.2.13, “Autenticação Pluggable”](pluggable-authentication.html "6.2.13 Pluggable Authentication").

##### Instalando a Autenticação Pluggable SHA-256

O *plugin* `sha256_password` existe nas formas de servidor e cliente:

* O *plugin* do lado do servidor é integrado ao servidor, não precisa ser carregado explicitamente e não pode ser desativado por meio de descarregamento (*unloading*).

* O *plugin* do lado do cliente é integrado à biblioteca cliente `libmysqlclient` e está disponível para qualquer programa lincado (*linked*) contra `libmysqlclient`.

##### Usando a Autenticação Pluggable SHA-256

Para configurar uma conta que usa o *plugin* `sha256_password` para *hashing* de senha SHA-256, use a seguinte instrução, onde *`password`* é a senha desejada para a conta:

```sql
CREATE USER 'sha256user'@'localhost'
IDENTIFIED WITH sha256_password BY 'password';
```

O servidor atribui o *plugin* `sha256_password` à conta e o usa para criptografar a senha usando SHA-256, armazenando esses valores nas colunas `plugin` e `authentication_string` da tabela de sistema `mysql.user`.

As instruções anteriores não presumem que `sha256_password` seja o *authentication plugin* padrão. Se `sha256_password` for o *authentication plugin* padrão, uma sintaxe [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") mais simples pode ser usada.

Para iniciar o servidor com o *authentication plugin* padrão definido como `sha256_password`, insira estas linhas no arquivo de opções do servidor:

```sql
[mysqld]
default_authentication_plugin=sha256_password
```

Isso faz com que o *plugin* `sha256_password` seja usado por padrão para novas contas. Como resultado, é possível criar a conta e definir sua senha sem nomear o *plugin* explicitamente:

```sql
CREATE USER 'sha256user'@'localhost' IDENTIFIED BY 'password';
```

Outra consequência de definir [`default_authentication_plugin`](server-system-variables.html#sysvar_default_authentication_plugin) como `sha256_password` é que, para usar algum outro *plugin* para criação de contas, você deve especificar esse *plugin* explicitamente. Por exemplo, para usar o *plugin* `mysql_native_password`, use esta instrução:

```sql
CREATE USER 'nativeuser'@'localhost'
IDENTIFIED WITH mysql_native_password BY 'password';
```

`sha256_password` suporta conexões sobre transporte seguro. `sha256_password` também suporta troca de senha criptografada usando RSA sobre conexões não criptografadas se as seguintes condições forem satisfeitas:

* O MySQL é compilado usando OpenSSL, não yaSSL. `sha256_password` funciona com distribuições compiladas usando qualquer um dos pacotes, mas o suporte a RSA requer OpenSSL.

  Nota

  É possível compilar o MySQL usando yaSSL como alternativa ao OpenSSL somente antes do MySQL 5.7.28. A partir do MySQL 5.7.28, o suporte ao yaSSL foi removido e todas as compilações do MySQL usam OpenSSL.

* O MySQL server ao qual você deseja se conectar está configurado para suportar RSA (usando o procedimento de configuração RSA fornecido mais adiante nesta seção).

O suporte a RSA possui as seguintes características:

* No lado do servidor, duas variáveis de sistema nomeiam os arquivos de par de chaves RSA pública e privada: [`sha256_password_private_key_path`](server-system-variables.html#sysvar_sha256_password_private_key_path) e [`sha256_password_public_key_path`](server-system-variables.html#sysvar_sha256_password_public_key_path). O administrador do *Database* deve definir essas variáveis na inicialização do servidor se os arquivos de chave a serem usados tiverem nomes diferentes dos valores padrão da variável de sistema.

* O servidor usa a variável de sistema [`sha256_password_auto_generate_rsa_keys`](server-system-variables.html#sysvar_sha256_password_auto_generate_rsa_keys) para determinar se deve gerar automaticamente os arquivos de par de chaves RSA. Consulte [Seção 6.3.3, “Criando Certificados e Chaves SSL e RSA”](creating-ssl-rsa-files.html "6.3.3 Creating SSL and RSA Certificates and Keys").

* A variável de status [`Rsa_public_key`](server-status-variables.html#statvar_Rsa_public_key) exibe o valor da chave pública RSA usado pelo *authentication plugin* `sha256_password`.

* Clientes que possuem a chave pública RSA podem realizar a troca de senha baseada no par de chaves RSA com o servidor durante o processo de conexão, conforme descrito posteriormente.

* Para conexões de contas que autenticam usando `sha256_password` e troca de senha baseada em par de chaves públicas RSA, o servidor envia a chave pública RSA para o cliente conforme necessário. No entanto, se uma cópia da chave pública estiver disponível no *host* cliente, o cliente pode usá-la para economizar um *round trip* no protocolo cliente/servidor:

  + Para estes clientes de linha de comando, use a opção [`--server-public-key-path`](mysql-command-options.html#option_mysql_server-public-key-path) para especificar o arquivo de chave pública RSA: [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), **mysqltest**, e (a partir do MySQL 5.7.23) [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"), [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files"), [**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program"), [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"), [**mysqlimport**](mysqlimport.html "4.5.5 mysqlimport — A Data Import Program"), [**mysqlpump**](mysqlpump.html "4.5.6 mysqlpump — A Database Backup Program"), [**mysqlshow**](mysqlshow.html "4.5.7 mysqlshow — Display Database, Table, and Column Information"), [**mysqlslap**](mysqlslap.html "4.5.8 mysqlslap — A Load Emulation Client"), **mysqltest**.

  + Para programas que usam a C API, chame [`mysql_options()`](/doc/c-api/5.7/en/mysql-options.html) para especificar o arquivo de chave pública RSA, passando a opção `MYSQL_SERVER_PUBLIC_KEY` e o nome do arquivo.

  + Para réplicas, a troca de senha baseada em par de chaves RSA não pode ser usada para se conectar a servidores de origem (*source servers*) para contas que autenticam com o *plugin* `sha256_password`. Para tais contas, apenas conexões seguras podem ser usadas.

Para clientes que usam o *plugin* `sha256_password`, as senhas nunca são expostas como texto simples (*cleartext*) ao se conectar ao servidor. A forma como a transmissão da senha ocorre depende se uma conexão segura ou a criptografia RSA é utilizada:

* Se a conexão for segura, um par de chaves RSA é desnecessário e não é usado. Isso se aplica a conexões criptografadas usando TLS. A senha é enviada como *cleartext*, mas não pode ser interceptada (*snooped*) porque a conexão é segura.

  Nota

  Ao contrário de `caching_sha2_password`, o *plugin* `sha256_password` não trata conexões de memória compartilhada (*shared-memory connections*) como seguras, mesmo que o transporte por memória compartilhada seja seguro por padrão.

* Se a conexão não for segura e um par de chaves RSA estiver disponível, a conexão permanecerá não criptografada. Isso se aplica a conexões não criptografadas usando TLS. O RSA é usado apenas para troca de senha entre cliente e servidor, para evitar a interceptação da senha (*password snooping*). Quando o servidor recebe a senha criptografada, ele a descriptografa. Um *scramble* é usado na criptografia para prevenir ataques de repetição (*repeat attacks*).

* Se uma conexão segura não for usada e a criptografia RSA não estiver disponível, a tentativa de conexão falhará porque a senha não pode ser enviada sem ser exposta como *cleartext*.

Conforme mencionado anteriormente, a criptografia de senha RSA está disponível apenas se o MySQL foi compilado usando OpenSSL. A implicação para as distribuições do MySQL compiladas usando yaSSL é que, para usar senhas SHA-256, os clientes *devem* usar uma conexão criptografada para acessar o servidor. Consulte [Seção 6.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”](using-encrypted-connections.html "6.3.1 Configurando o MySQL para Usar Conexões Criptografadas").

Nota

Para usar a criptografia de senha RSA com `sha256_password`, tanto o cliente quanto o servidor devem ser compilados usando OpenSSL, não apenas um deles.

Assumindo que o MySQL foi compilado usando OpenSSL, use o seguinte procedimento para habilitar o uso de um par de chaves RSA para troca de senha durante o processo de conexão do cliente:

1. Crie os arquivos de par de chaves RSA pública e privada usando as instruções em [Seção 6.3.3, “Criando Certificados e Chaves SSL e RSA”](creating-ssl-rsa-files.html "6.3.3 Creating SSL and RSA Certificates and Keys").

2. Se os arquivos de chave privada e pública estiverem localizados no diretório de dados e forem nomeados `private_key.pem` e `public_key.pem` (os valores padrão das variáveis de sistema [`sha256_password_private_key_path`](server-system-variables.html#sysvar_sha256_password_private_key_path) e [`sha256_password_public_key_path`](server-system-variables.html#sysvar_sha256_password_public_key_path)), o servidor os usará automaticamente na inicialização.

   Caso contrário, para nomear os arquivos de chave explicitamente, defina as variáveis de sistema com os nomes dos arquivos de chave no arquivo de opções do servidor. Se os arquivos estiverem localizados no diretório de dados do servidor, você não precisa especificar seus nomes de caminho completos:

   ```sql
   [mysqld]
   sha256_password_private_key_path=myprivkey.pem
   sha256_password_public_key_path=mypubkey.pem
   ```

   Se os arquivos de chave não estiverem localizados no diretório de dados, ou para tornar seus locais explícitos nos valores das variáveis de sistema, use nomes de caminho completos:

   ```sql
   [mysqld]
   sha256_password_private_key_path=/usr/local/mysql/myprivkey.pem
   sha256_password_public_key_path=/usr/local/mysql/mypubkey.pem
   ```

3. Reinicie o servidor, depois conecte-se a ele e verifique o valor da variável de status [`Rsa_public_key`](server-status-variables.html#statvar_Rsa_public_key). O valor real difere do mostrado aqui, mas deve ser não vazio:

   ```sql
   mysql> SHOW STATUS LIKE 'Rsa_public_key'\G
   *************************** 1. row ***************************
   Variable_name: Rsa_public_key
           Value: -----BEGIN PUBLIC KEY-----
   MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDO9nRUDd+KvSZgY7cNBZMNpwX6
   MvE1PbJFXO7u18nJ9lwc99Du/E7lw6CVXw7VKrXPeHbVQUzGyUNkf45Nz/ckaaJa
   aLgJOBCIDmNVnyU54OT/1lcs2xiyfaDMe8fCJ64ZwTnKbY2gkt1IMjUAB5Ogd5kJ
   g8aV7EtKwyhHb0c30QIDAQAB
   -----END PUBLIC KEY-----
   ```

   Se o valor estiver vazio, o servidor encontrou algum problema com os arquivos de chave. Verifique o *error log* para obter informações de diagnóstico.

Depois que o servidor for configurado com os arquivos de chave RSA, as contas que autenticam com o *plugin* `sha256_password` têm a opção de usar esses arquivos de chave para se conectar ao servidor. Conforme mencionado anteriormente, tais contas podem usar uma conexão segura (neste caso, o RSA não é usado) ou uma conexão não criptografada que realiza a troca de senha usando RSA. Suponha que uma conexão não criptografada seja usada. Por exemplo:

```sql
$> mysql --ssl-mode=DISABLED -u sha256user -p
Enter password: password
```

Para esta tentativa de conexão por `sha256user`, o servidor determina que `sha256_password` é o *authentication plugin* apropriado e o invoca (porque foi o *plugin* especificado no momento do [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement")). O *plugin* verifica que a conexão não está criptografada e, portanto, requer que a senha seja transmitida usando criptografia RSA. Neste caso, o *plugin* envia a chave pública RSA para o cliente, que a usa para criptografar a senha e retorna o resultado para o servidor. O *plugin* usa a chave privada RSA no lado do servidor para descriptografar a senha e aceita ou rejeita a conexão com base na correção da senha.

O servidor envia a chave pública RSA para o cliente conforme necessário. No entanto, se o cliente tiver um arquivo contendo uma cópia local da chave pública RSA exigida pelo servidor, ele pode especificar o arquivo usando a opção [`--server-public-key-path`](mysql-command-options.html#option_mysql_server-public-key-path):

```sql
$> mysql --ssl-mode=DISABLED -u sha256user -p --server-public-key-path=file_name
Enter password: password
```

O valor da chave pública no arquivo nomeado pela opção [`--server-public-key-path`](mysql-command-options.html#option_mysql_server-public-key-path) deve ser o mesmo que o valor da chave no arquivo do lado do servidor nomeado pela variável de sistema [`sha256_password_public_key_path`](server-system-variables.html#sysvar_sha256_password_public_key_path). Se o arquivo de chave contiver um valor de chave pública válido, mas o valor estiver incorreto, ocorrerá um erro de acesso negado (*access-denied*). Se o arquivo de chave não contiver uma chave pública válida, o programa cliente não poderá usá-la. Neste caso, o *plugin* `sha256_password` envia a chave pública ao cliente como se nenhuma opção [`--server-public-key-path`](mysql-command-options.html#option_mysql_server-public-key-path) tivesse sido especificada.

Os usuários clientes podem obter a chave pública RSA de duas maneiras:

* O administrador do *Database* pode fornecer uma cópia do arquivo de chave pública.

* Um usuário cliente que possa se conectar ao servidor de alguma outra forma pode usar uma instrução `SHOW STATUS LIKE 'Rsa_public_key'` e salvar o valor da chave retornado em um arquivo.