#### 6.4.1.4 Autenticação Plugável SHA-2 com Caching

O MySQL fornece dois plugins de autenticação que implementam o *hashing* SHA-256 para senhas de contas de usuário:

* `sha256_password`: Implementa autenticação SHA-256 básica.

* `caching_sha2_password`: Implementa autenticação SHA-256 (como `sha256_password`), mas utiliza *caching* no lado do Server para melhor desempenho e possui recursos adicionais para maior aplicabilidade. (No MySQL 5.7, `caching_sha2_password` é implementado apenas no lado do Client, conforme descrito posteriormente nesta seção.)

Esta seção descreve o plugin de autenticação SHA-2 com caching, disponível a partir do MySQL 5.7.23. Para informações sobre o plugin básico original (sem caching), consulte [Section 6.4.1.5, “SHA-256 Pluggable Authentication”](sha256-pluggable-authentication.html "6.4.1.5 SHA-256 Pluggable Authentication").

Importante

No MySQL 5.7, o plugin de autenticação padrão é `mysql_native_password`. A partir do MySQL 8.0, o plugin de autenticação padrão é alterado para `caching_sha2_password`. Para permitir que Clients do MySQL 5.7 se conectem a Servers 8.0 e superiores usando contas que se autenticam com `caching_sha2_password`, a client library e os programas Client do MySQL 5.7 suportam o plugin de autenticação do lado do Client `caching_sha2_password`. Isso melhora a compatibilidade de conexão dos Clients do MySQL 5.7 com relação aos Servers MySQL 8.0 e superiores, apesar das diferenças no plugin de autenticação padrão.

Limitar o suporte a `caching_sha2_password` no MySQL 5.7 ao plugin do lado do Client na client library tem as seguintes implicações em comparação com o MySQL 8.0:

* O plugin `caching_sha2_password` do lado do Server não é implementado no MySQL 5.7.

* Servers MySQL 5.7 não suportam a criação de contas que se autenticam com `caching_sha2_password`.

* Servers MySQL 5.7 não implementam variáveis de sistema e de status específicas para o suporte do `caching_sha2_password` do lado do Server: [`caching_sha2_password_auto_generate_rsa_keys`](/doc/refman/8.0/en/server-system-variables.html#sysvar_caching_sha2_password_auto_generate_rsa_keys), [`caching_sha2_password_private_key_path`](/doc/refman/8.0/en/server-system-variables.html#sysvar_caching_sha2_password_private_key_path), [`caching_sha2_password_public_key_path`](/doc/refman/8.0/en/server-system-variables.html#sysvar_caching_sha2_password_public_key_path), [`Caching_sha2_password_rsa_public_key`](/doc/refman/8.0/en/server-status-variables.html#statvar_Caching_sha2_password_rsa_public_key).

Além disso, não há suporte para réplicas do MySQL 5.7 se conectarem a Servers de origem de replicação do MySQL 8.0 usando contas que se autenticam com `caching_sha2_password`. Isso envolveria uma origem replicando para uma réplica com um número de versão inferior à versão da origem, enquanto as origens normalmente replicam para réplicas com uma versão igual ou superior à versão da origem.

Importante

Para conectar-se a um Server MySQL 8.0 ou superior usando uma conta que se autentica com o plugin `caching_sha2_password`, você deve usar uma conexão segura ou uma conexão não criptografada que suporte troca de senha usando um par de chaves RSA, conforme descrito posteriormente nesta seção. De qualquer forma, o plugin `caching_sha2_password` utiliza os recursos de criptografia do MySQL. Consulte [Section 6.3, “Using Encrypted Connections”](encrypted-connections.html "6.3 Using Encrypted Connections").

Nota

No nome `sha256_password`, “sha256” refere-se ao comprimento do *digest* de 256 bits que o plugin utiliza para criptografia. No nome `caching_sha2_password`, “sha2” refere-se de forma mais geral à classe de algoritmos de criptografia SHA-2, da qual a criptografia de 256 bits é uma instância. A escolha deste último nome abre espaço para futura expansão de possíveis comprimentos de *digest* sem alterar o nome do plugin.

O plugin `caching_sha2_password` possui estas vantagens, em comparação com `sha256_password`:

* No lado do Server, um *cache* na memória permite reautenticação mais rápida de usuários que se conectaram anteriormente quando se conectam novamente. (Este comportamento do lado do Server é implementado apenas no MySQL 8.0 e superior.)

* É fornecido suporte para conexões de Client que usam protocolos de arquivo socket Unix e shared-memory.

A tabela a seguir mostra o nome do plugin no lado do Client.

**Table 6.10 Nomes de Plugin e Library para Autenticação SHA-2**

<table summary="Nomes para o plugin e arquivo de library usados para autenticação de senha SHA-2."><thead><tr> <th>Plugin ou Arquivo</th> <th>Nome do Plugin ou Arquivo</th> </tr></thead><tbody><tr> <td>Plugin do lado do Client</td> <td><code>caching_sha2_password</code></td> </tr><tr> <td>Arquivo da Library</td> <td>Nenhum (plugin é built in)</td> </tr></tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para autenticação plugável SHA-2 com caching:

* [Installing SHA-2 Pluggable Authentication](caching-sha2-pluggable-authentication.html#caching-sha2-pluggable-authentication-installation "Installing SHA-2 Pluggable Authentication") (Instalando Autenticação Plugável SHA-2)
* [Using SHA-2 Pluggable Authentication](caching-sha2-pluggable-authentication.html#caching-sha2-pluggable-authentication-usage "Using SHA-2 Pluggable Authentication") (Usando Autenticação Plugável SHA-2)
* [Cache Operation for SHA-2 Pluggable Authentication](caching-sha2-pluggable-authentication.html#caching-sha2-pluggable-authentication-cache-operation "Cache Operation for SHA-2 Pluggable Authentication") (Operação do Cache para Autenticação Plugável SHA-2)

Para informações gerais sobre autenticação plugável no MySQL, consulte [Section 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication").

##### Instalando Autenticação Plugável SHA-2

No MySQL 5.7, o plugin `caching_sha2_password` existe no formato Client. O plugin do lado do Client é *built into* a `libmysqlclient` client library e está disponível para qualquer programa linkado contra a `libmysqlclient`.

##### Usando Autenticação Plugável SHA-2

No MySQL 5.7, o plugin `caching_sha2_password` do lado do Client permite a conexão com Servers MySQL 8.0 ou superiores usando contas que se autenticam com o plugin `caching_sha2_password` do lado do Server. A discussão aqui pressupõe que uma conta chamada `'sha2user'@'localhost'` exista no Server MySQL 8.0 ou superior. Por exemplo, a seguinte instrução cria tal conta, onde *`password`* é a senha desejada:

```sql
CREATE USER 'sha2user'@'localhost'
IDENTIFIED WITH caching_sha2_password BY 'password';
```

O `caching_sha2_password` suporta conexões via transporte seguro. O `caching_sha2_password` também suporta troca de senha criptografada usando RSA sobre conexões não criptografadas se as seguintes condições forem satisfeitas:

* A client library e os programas Client do MySQL 5.7 são compilados usando OpenSSL, e não yaSSL. O `caching_sha2_password` funciona com distribuições compiladas usando qualquer pacote, mas o suporte a RSA requer OpenSSL.

  Nota

  É possível compilar o MySQL usando yaSSL como alternativa ao OpenSSL apenas antes do MySQL 5.7.28. A partir do MySQL 5.7.28, o suporte ao yaSSL é removido e todas as *builds* do MySQL usam OpenSSL.

* O Server MySQL 8.0 ou superior ao qual você deseja se conectar está configurado para suportar RSA (usando o procedimento de configuração RSA fornecido posteriormente nesta seção).

O suporte a RSA possui as seguintes características, sendo que todos os aspectos que se referem ao lado do Server exigem um Server MySQL 8.0 ou superior:

* No lado do Server, duas variáveis de sistema nomeiam os arquivos de par de chaves privada e pública RSA: [`caching_sha2_password_private_key_path`](/doc/refman/8.0/en/server-system-variables.html#sysvar_caching_sha2_password_private_key_path) e [`caching_sha2_password_public_key_path`](/doc/refman/8.0/en/server-system-variables.html#sysvar_caching_sha2_password_public_key_path). O administrador do Database deve definir essas variáveis na inicialização do Server se os arquivos Key a serem usados tiverem nomes diferentes dos valores padrão da variável de sistema.

* O Server usa a variável de sistema [`caching_sha2_password_auto_generate_rsa_keys`](/doc/refman/8.0/en/server-system-variables.html#sysvar_caching_sha2_password_auto_generate_rsa_keys) para determinar se deve gerar automaticamente os arquivos de par de chaves RSA. Consulte [Section 6.3.3, “Creating SSL and RSA Certificates and Keys”](creating-ssl-rsa-files.html "6.3.3 Creating SSL and RSA Certificates and Keys").

* A variável de status [`Caching_sha2_password_rsa_public_key`](/doc/refman/8.0/en/server-status-variables.html#statvar_Caching_sha2_password_rsa_public_key) exibe o valor da public Key RSA usado pelo plugin de autenticação `caching_sha2_password`.

* Clients que possuem a public Key RSA podem realizar troca de senha baseada em par de chaves RSA com o Server durante o processo de conexão, conforme descrito posteriormente.

* Para conexões por contas que se autenticam com `caching_sha2_password` e troca de senha baseada em par de chaves RSA, o Server não envia a public Key RSA aos Clients por padrão. Os Clients podem usar uma cópia local da public Key necessária, ou solicitar a public Key ao Server.

  O uso de uma cópia local confiável da public Key permite que o Client evite um *round trip* no protocolo Client/Server, e é mais seguro do que solicitar a public Key ao Server. Por outro lado, solicitar a public Key ao Server é mais conveniente (não exige gerenciamento de um arquivo do lado do Client) e pode ser aceitável em ambientes de rede seguros.

  + Para Clients de linha de comando, use a opção [`--server-public-key-path`](mysql-command-options.html#option_mysql_server-public-key-path) para especificar o arquivo da public Key RSA. Use a opção [`--get-server-public-key`](mysql-command-options.html#option_mysql_get-server-public-key) para solicitar a public Key ao Server. Os seguintes programas suportam as duas opções: [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"), [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files"), [**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program"), [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"), [**mysqlimport**](mysqlimport.html "4.5.5 mysqlimport — A Data Import Program"), [**mysqlpump**](mysqlpump.html "4.5.6 mysqlpump — A Database Backup Program"), [**mysqlshow**](mysqlshow.html "4.5.7 mysqlshow — Display Database, Table, and Column Information"), [**mysqlslap**](mysqlslap.html "4.5.8 mysqlslap — A Load Emulation Client"), **mysqltest**.

  + Para programas que usam a C API, chame [`mysql_options()`](/doc/c-api/5.7/en/mysql-options.html) para especificar o arquivo da public Key RSA, passando a opção `MYSQL_SERVER_PUBLIC_KEY` e o nome do arquivo, ou solicite a public Key ao Server passando a opção `MYSQL_OPT_GET_SERVER_PUBLIC_KEY`.

  Em todos os casos, se a opção for fornecida para especificar um arquivo de public Key válido, ela terá precedência sobre a opção de solicitar a public Key ao Server.

Para Clients que usam o plugin `caching_sha2_password`, as senhas nunca são expostas como *cleartext* ao se conectar ao Server MySQL 8.0 ou superior. A forma como a transmissão da senha ocorre depende se uma conexão segura ou criptografia RSA é usada:

* Se a conexão for segura, um par de chaves RSA é desnecessário e não é usado. Isso se aplica a conexões TCP criptografadas usando TLS, bem como a conexões de arquivo socket Unix e shared-memory. A senha é enviada como *cleartext*, mas não pode ser interceptada porque a conexão é segura.

* Se a conexão não for segura, um par de chaves RSA é usado. Isso se aplica a conexões TCP não criptografadas usando TLS e conexões *named-pipe*. O RSA é usado apenas para a troca de senha entre Client e Server, para evitar a interceptação da senha. Quando o Server recebe a senha criptografada, ele a descriptografa. Um *scramble* é usado na criptografia para evitar ataques de repetição.

* Se uma conexão segura não for usada e a criptografia RSA não estiver disponível, a tentativa de conexão falha porque a senha não pode ser enviada sem ser exposta como *cleartext*.

Conforme mencionado anteriormente, a criptografia de senha RSA está disponível apenas se o MySQL 5.7 tiver sido compilado usando OpenSSL. A implicação para Clients de distribuições MySQL 5.7 compiladas usando yaSSL é que, para usar senhas SHA-2, os Clients *devem* usar uma conexão criptografada para acessar o Server. Consulte [Section 6.3.1, “Configuring MySQL to Use Encrypted Connections”](using-encrypted-connections.html "6.3.1 Configuring MySQL to Use Encrypted Connections").

Assumindo que o MySQL 5.7 foi compilado usando OpenSSL, use o procedimento a seguir para habilitar o uso de um par de chaves RSA para troca de senha durante o processo de conexão do Client.

Importante

Os aspectos deste procedimento que se referem à configuração do Server devem ser feitos no Server MySQL 8.0 ou superior ao qual você deseja se conectar usando Clients MySQL 5.7, *não* no seu Server MySQL 5.7.

1. Crie os arquivos de par de chaves privada e pública RSA usando as instruções em [Section 6.3.3, “Creating SSL and RSA Certificates and Keys”](creating-ssl-rsa-files.html "6.3.3 Creating SSL and RSA Certificates and Keys").

2. Se os arquivos de chaves privada e pública estiverem localizados no data directory e forem nomeados `private_key.pem` e `public_key.pem` (os valores padrão das variáveis de sistema [`caching_sha2_password_private_key_path`](/doc/refman/8.0/en/server-system-variables.html#sysvar_caching_sha2_password_private_key_path) e [`caching_sha2_password_public_key_path`](/doc/refman/8.0/en/server-system-variables.html#sysvar_caching_sha2_password_public_key_path)), o Server os usa automaticamente na inicialização.

   Caso contrário, para nomear os arquivos Key explicitamente, defina as variáveis de sistema com os nomes dos arquivos Key no arquivo de opção do Server. Se os arquivos estiverem localizados no data directory do Server, você não precisa especificar seus nomes de caminho completo:

   ```sql
   [mysqld]
   caching_sha2_password_private_key_path=myprivkey.pem
   caching_sha2_password_public_key_path=mypubkey.pem
   ```

   Se os arquivos Key não estiverem localizados no data directory, ou para tornar suas localizações explícitas nos valores das variáveis de sistema, use nomes de caminho completo:

   ```sql
   [mysqld]
   caching_sha2_password_private_key_path=/usr/local/mysql/myprivkey.pem
   caching_sha2_password_public_key_path=/usr/local/mysql/mypubkey.pem
   ```

3. Reinicie o Server e, em seguida, conecte-se a ele e verifique o valor da variável de status [`Caching_sha2_password_rsa_public_key`](/doc/refman/8.0/en/server-status-variables.html#statvar_Caching_sha2_password_rsa_public_key). O valor real difere do mostrado aqui, mas deve ser não vazio:

   ```sql
   mysql> SHOW STATUS LIKE 'Caching_sha2_password_rsa_public_key'\G
   *************************** 1. row ***************************
   Variable_name: Caching_sha2_password_rsa_public_key
           Value: -----BEGIN PUBLIC KEY-----
   MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDO9nRUDd+KvSZgY7cNBZMNpwX6
   MvE1PbJFXO7u18nJ9lwc99Du/E7lw6CVXw7VKrXPeHbVQUzGyUNkf45Nz/ckaaJa
   aLgJOBCIDmNVnyU54OT/1lcs2xiyfaDMe8fCJ64ZwTnKbY2gkt1IMjUAB5Ogd5kJ
   g8aV7EtKwyhHb0c30QIDAQAB
   -----END PUBLIC KEY-----
   ```

   Se o valor estiver vazio, o Server encontrou algum problema com os arquivos Key. Verifique o *error log* para obter informações de diagnóstico.

Depois que o Server for configurado com os arquivos de chaves RSA, as contas que se autenticam com o plugin `caching_sha2_password` têm a opção de usar esses arquivos Key para se conectar ao Server. Conforme mencionado anteriormente, tais contas podem usar uma conexão segura (neste caso, o RSA não é usado) ou uma conexão não criptografada que realiza a troca de senha usando RSA. Suponha que uma conexão não criptografada seja usada. Por exemplo:

```sql
$> mysql --ssl-mode=DISABLED -u sha2user -p
Enter password: password
```

Para esta tentativa de conexão por `sha2user`, o Server determina que `caching_sha2_password` é o plugin de autenticação apropriado e o invoca (porque foi o plugin especificado no momento do [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement")). O plugin descobre que a conexão não está criptografada e, portanto, requer que a senha seja transmitida usando criptografia RSA. No entanto, o Server não envia a public Key ao Client, e o Client não forneceu nenhuma public Key, portanto, ele não pode criptografar a senha e a conexão falha:

```sql
ERROR 2061 (HY000): Authentication plugin 'caching_sha2_password'
reported error: Authentication requires secure connection.
```

Para solicitar a public Key RSA ao Server, especifique a opção [`--get-server-public-key`](mysql-command-options.html#option_mysql_get-server-public-key):

```sql
$> mysql --ssl-mode=DISABLED -u sha2user -p --get-server-public-key
Enter password: password
```

Neste caso, o Server envia a public Key RSA ao Client, que a usa para criptografar a senha e retorna o resultado ao Server. O plugin usa a private Key RSA no lado do Server para descriptografar a senha e aceita ou rejeita a conexão com base na correção da senha.

Alternativamente, se o Client tiver um arquivo contendo uma cópia local da public Key RSA exigida pelo Server, ele pode especificar o arquivo usando a opção [`--server-public-key-path`](mysql-command-options.html#option_mysql_server-public-key-path):

```sql
$> mysql --ssl-mode=DISABLED -u sha2user -p --server-public-key-path=file_name
Enter password: password
```

Neste caso, o Client usa a public Key para criptografar a senha e retorna o resultado ao Server. O plugin usa a private Key RSA no lado do Server para descriptografar a senha e aceita ou rejeita a conexão com base na correção da senha.

O valor da public Key no arquivo nomeado pela opção [`--server-public-key-path`](mysql-command-options.html#option_mysql_server-public-key-path) deve ser o mesmo que o valor Key no arquivo do lado do Server nomeado pela variável de sistema [`caching_sha2_password_public_key_path`](/doc/refman/8.0/en/server-system-variables.html#sysvar_caching_sha2_password_public_key_path). Se o arquivo Key contiver um valor de public Key válido, mas o valor estiver incorreto, ocorrerá um erro de acesso negado. Se o arquivo Key não contiver uma public Key válida, o programa Client não poderá usá-lo.

Os usuários Client podem obter a public Key RSA de duas maneiras:

* O administrador do Database pode fornecer uma cópia do arquivo da public Key.

* Um usuário Client que pode se conectar ao Server de outra forma pode usar uma instrução `SHOW STATUS LIKE 'Caching_sha2_password_rsa_public_key'` e salvar o valor Key retornado em um arquivo.

##### Operação do Cache para Autenticação Plugável SHA-2

No lado do Server, o plugin `caching_sha2_password` usa um *cache* na memória para autenticação mais rápida de Clients que se conectaram anteriormente. Para o MySQL 5.7, que suporta apenas o plugin `caching_sha2_password` do lado do Client, esse *caching* do lado do Server ocorre, portanto, no Server MySQL 8.0 ou superior ao qual você se conecta usando Clients MySQL 5.7. Para obter informações sobre a operação do *cache*, consulte [Cache Operation for SHA-2 Pluggable Authentication](/doc/refman/8.0/en/caching-sha2-pluggable-authentication.html#caching-sha2-pluggable-authentication-cache-operation), no *Manual de Referência do MySQL 8.0*.