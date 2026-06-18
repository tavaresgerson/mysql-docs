#### 8.4.1.2 Caching de Autenticação Conectada SHA-2

O MySQL oferece dois plugins de autenticação que implementam a criptografia SHA-256 para as senhas das contas de usuário:

- `caching_sha2_password`: Implementa autenticação SHA-256 (como o descontinuado `sha256_password`), mas utiliza cache no lado do servidor para melhor desempenho e possui recursos adicionais para uma aplicação mais ampla.

- `sha256_password`: Implementa autenticação básica SHA-256. Este recurso é desatualizado a partir do MySQL 8.0.16 e está sujeito à remoção no futuro.

Esta seção descreve o plugin de autenticação com cache SHA-2. Para informações sobre o plugin básico original (sem cache), consulte a Seção 8.4.1.3, “Autenticação Personalizável SHA-256”.

Importante

No MySQL 8.0, `caching_sha2_password` é o plugin de autenticação padrão, em vez de `mysql_native_password`. Para obter informações sobre as implicações dessa mudança para o funcionamento do servidor e a compatibilidade do servidor com clientes e conectores, consulte caching\_sha2\_password como o plugin de autenticação preferido.

Importante

Para se conectar ao servidor usando uma conta que autentica com o plugin `caching_sha2_password`, você deve usar uma conexão segura ou uma conexão não criptografada que suporte a troca de senha usando um par de chaves RSA, conforme descrito mais adiante nesta seção. De qualquer forma, o plugin `caching_sha2_password` usa as capacidades de criptografia do MySQL. Veja a Seção 8.3, “Usando Conexões Criptografadas”.

Nota

No nome `sha256_password`, “sha256” refere-se ao comprimento de digestão de 256 bits que o plugin usa para criptografia. No nome `caching_sha2_password`, “sha2” refere-se mais genericamente à classe de algoritmos de criptografia SHA-2, da qual a criptografia de 256 bits é uma instância. A escolha desse último nome permite espaço para futuras expansões de possíveis comprimentos de digestão sem alterar o nome do plugin.

O plugin `caching_sha2_password` tem essas vantagens, em comparação com o `sha256_password`:

- No lado do servidor, um cache de memória permite uma reautenticação mais rápida dos usuários que se conectaram anteriormente, quando eles se conectam novamente.

- A troca de senhas baseada em RSA está disponível independentemente da biblioteca SSL contra a qual o MySQL está vinculado.

- O suporte é fornecido para conexões de clientes que utilizam os protocolos Unix socket-file e compartilhamento de memória.

A tabela a seguir mostra os nomes dos plugins no lado do servidor e no lado do cliente.

**Tabela 8.17 Nomes de plugins e bibliotecas para autenticação SHA-2**

<table summary="Nomes para os plugins e o arquivo de biblioteca usados para autenticação de senha SHA-2."><thead><tr> <th>Plugin ou arquivo</th> <th>Nome do Plugin ou do Arquivo</th> </tr></thead><tbody><tr> <td>Plugin no lado do servidor</td> <td>[[<code>caching_sha2_password</code>]]</td> </tr><tr> <td>Plugin no lado do cliente</td> <td>[[<code>caching_sha2_password</code>]]</td> </tr><tr> <td>Arquivo da biblioteca</td> <td>Nenhum (os plugins são integrados)</td> </tr></tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para o cache de autenticação substituível SHA-2:

- Instalando Autenticação Conectada SHA-2
- Usando autenticação substituível SHA-2
- Operação de cache para autenticação substituível SHA-2

Para obter informações gerais sobre autenticação plugável no MySQL, consulte a Seção 8.2.17, “Autenticação Plugável”.

##### Instalando Autenticação Conectada SHA-2

O plugin `caching_sha2_password` existe em formulários de servidor e cliente:

- O plugin do lado do servidor é integrado ao servidor, não precisa ser carregado explicitamente e não pode ser desativado descarregando-o.

- O plugin do lado do cliente é integrado à biblioteca de cliente `libmysqlclient` e está disponível para qualquer programa vinculado a `libmysqlclient`.

O plugin do lado do servidor usa o plugin de auditoria `sha2_cache_cleaner` como um assistente para gerenciar o cache de senhas. `sha2_cache_cleaner`, assim como `caching_sha2_password`, é integrado e não precisa ser instalado.

##### Usando autenticação substituível SHA-2

Para configurar uma conta que use o plugin `caching_sha2_password` para hash de senha SHA-256, use a seguinte declaração, onde `password` é a senha desejada da conta:

```
CREATE USER 'sha2user'@'localhost'
IDENTIFIED WITH caching_sha2_password BY 'password';
```

O servidor atribui o plugin `caching_sha2_password` à conta e usa-o para criptografar a senha usando SHA-256, armazenando esses valores nas colunas `plugin` e `authentication_string` da tabela do sistema `mysql.user`.

As instruções anteriores não assumem que o plugin de autenticação `caching_sha2_password` seja o padrão. Se o plugin de autenticação `caching_sha2_password` for o padrão, uma sintaxe mais simples do `CREATE USER` pode ser usada.

Para iniciar o servidor com o plugin de autenticação padrão definido como `caching_sha2_password`, coloque essas linhas no arquivo de opções do servidor:

```
[mysqld]
default_authentication_plugin=caching_sha2_password
```

Isso faz com que o plugin `caching_sha2_password` seja usado por padrão para novas contas. Como resultado, é possível criar a conta e definir sua senha sem nomear o plugin explicitamente:

```
CREATE USER 'sha2user'@'localhost' IDENTIFIED BY 'password';
```

Outra consequência de definir `default_authentication_plugin` para `caching_sha2_password` é que, para usar outro plugin para a criação de contas, você deve especificar esse plugin explicitamente. Por exemplo, para usar o plugin desatualizado `mysql_native_password`, use esta declaração:

```
CREATE USER 'nativeuser'@'localhost'
IDENTIFIED WITH mysql_native_password BY 'password';
```

`caching_sha2_password` suporta conexões por meio de transporte seguro. Se você seguir o procedimento de configuração RSA fornecido mais adiante nesta seção, ele também suporta a troca de senhas criptografadas usando RSA em conexões não criptografadas. O suporte RSA tem essas características:

- No lado do servidor, duas variáveis de sistema nomeiam os arquivos de par de chaves RSA privada e pública: `caching_sha2_password_private_key_path` e `caching_sha2_password_public_key_path`. O administrador do banco de dados deve definir essas variáveis no início do servidor se os arquivos de chave a serem usados tiverem nomes diferentes dos valores padrão da variável do sistema.

- O servidor usa a variável de sistema `caching_sha2_password_auto_generate_rsa_keys` para determinar se os arquivos de par de chaves RSA devem ser gerados automaticamente. Veja a Seção 8.3.3, “Criando Certificados e Chaves SSL e RSA”.

- A variável de status `Caching_sha2_password_rsa_public_key` exibe o valor da chave pública RSA usada pelo plugin de autenticação `caching_sha2_password`.

- Os clientes que possuem a chave pública RSA podem realizar a troca de senha com base em pares de chaves RSA com o servidor durante o processo de conexão, conforme descrito mais adiante.

- Para conexões por contas que autenticam com `caching_sha2_password` e troca de senha baseada em par de chaves RSA, o servidor não envia a chave pública RSA para os clientes por padrão. Os clientes podem usar uma cópia do lado do cliente da chave pública necessária ou solicitar a chave pública do servidor.

  O uso de uma cópia local confiável da chave pública permite que o cliente evite uma ida e volta no protocolo cliente/servidor e é mais seguro do que solicitar a chave pública do servidor. Por outro lado, solicitar a chave pública do servidor é mais conveniente (não requer a gestão de um arquivo no lado do cliente) e pode ser aceitável em ambientes de rede seguros.

  - Para clientes de linha de comando, use a opção `--server-public-key-path` para especificar o arquivo da chave pública RSA. Use a opção `--get-server-public-key` para solicitar a chave pública do servidor. Os seguintes programas suportam as duas opções: **mysql**, **mysqlsh**, **mysqladmin**, **mysqlbinlog**, **mysqlcheck**, **mysqlbinlog**, **mysqldump**, **mysqlimport**, **mysqlpump**, **mysqlshow**, **mysqlslap**, **mysqltest**, **mysql\_upgrade**.

  - Para programas que utilizam a API C, chame `mysql_options()` para especificar o arquivo da chave pública RSA, passando a opção `MYSQL_SERVER_PUBLIC_KEY` e o nome do arquivo, ou solicite a chave pública ao servidor, passando a opção `MYSQL_OPT_GET_SERVER_PUBLIC_KEY`.

  - Para réplicas, use a declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) com a opção `SOURCE_PUBLIC_KEY_PATH` | `MASTER_PUBLIC_KEY_PATH` para especificar o arquivo da chave pública RSA, ou a opção `GET_SOURCE_PUBLIC_KEY` | `GET_MASTER_PUBLIC_KEY` para solicitar a chave pública da fonte. Para a replicação de grupo, as variáveis de sistema `group_replication_recovery_public_key_path` e `group_replication_recovery_get_public_key` têm o mesmo propósito.

  Em todos os casos, se a opção for dada para especificar um arquivo de chave pública válido, ele terá precedência sobre a opção de solicitar a chave pública do servidor.

Para clientes que usam o plugin `caching_sha2_password`, as senhas nunca são exibidas em texto claro ao se conectar ao servidor. A forma como a transmissão da senha ocorre depende se uma conexão segura ou criptografia RSA é usada:

- Se a conexão for segura, um par de chaves RSA não é necessário e não é usado. Isso se aplica a conexões TCP criptografadas usando TLS, bem como conexões de Unix socket-file e conexões de memória compartilhada. A senha é enviada em texto simples, mas não pode ser interceptada porque a conexão é segura.

- Se a conexão não for segura, um par de chaves RSA é usado. Isso se aplica a conexões TCP não criptografadas usando TLS e conexões de named-pipe. O RSA é usado apenas para a troca de senhas entre o cliente e o servidor, para evitar a escuta de senhas. Quando o servidor recebe a senha criptografada, ele a descriptografa. Uma mistura é usada na criptografia para evitar ataques repetidos.

Para permitir o uso de um par de chaves RSA para a troca de senhas durante o processo de conexão do cliente, use o procedimento a seguir:

1. Crie os arquivos de par de chaves privadas e públicas RSA usando as instruções na Seção 8.3.3, “Criando Certificados e Chaves SSL e RSA”.

2. Se os arquivos de chave privada e pública estiverem localizados no diretório de dados e tiverem os nomes `private_key.pem` e `public_key.pem` (os valores padrão das variáveis de sistema `caching_sha2_password_private_key_path` e `caching_sha2_password_public_key_path`), o servidor os usará automaticamente ao iniciar.

   Caso contrário, para nomear os arquivos-chave explicitamente, defina as variáveis do sistema com os nomes dos arquivos-chave no arquivo de opção do servidor. Se os arquivos estiverem localizados no diretório de dados do servidor, você não precisa especificar seus nomes completos de caminho:

   ```
   [mysqld]
   caching_sha2_password_private_key_path=myprivkey.pem
   caching_sha2_password_public_key_path=mypubkey.pem
   ```

   Se os arquivos de chave não estiverem localizados no diretório de dados, ou para tornar suas localizações explícitas nos valores da variável do sistema, use nomes de caminho completos:

   ```
   [mysqld]
   caching_sha2_password_private_key_path=/usr/local/mysql/myprivkey.pem
   caching_sha2_password_public_key_path=/usr/local/mysql/mypubkey.pem
   ```

3. Se você quiser alterar o número de rodadas de hash usadas pelo `caching_sha2_password` durante a geração da senha, defina a variável de sistema `caching_sha2_password_digest_rounds`. Por exemplo:

   ```
   [mysqld]
   caching_sha2_password_digest_rounds=10000
   ```

4. Reinicie o servidor, conecte-se a ele e verifique o valor da variável `Caching_sha2_password_rsa_public_key`. O valor exibido realmente difere do mostrado aqui, mas deve ser não vazio:

   ```
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

   Se o valor estiver vazio, o servidor encontrou algum problema com os arquivos de chave. Verifique o log de erro para obter informações de diagnóstico.

Depois que o servidor foi configurado com os arquivos de chave RSA, as contas que se autenticam com o plugin `caching_sha2_password` têm a opção de usar esses arquivos de chave para se conectar ao servidor. Como mencionado anteriormente, tais contas podem usar uma conexão segura (neste caso, o RSA não é usado) ou uma conexão não criptografada que realiza a troca de senha usando RSA. Suponha que uma conexão não criptografada seja usada. Por exemplo:

```
$> mysql --ssl-mode=DISABLED -u sha2user -p
Enter password: password
```

Para essa tentativa de conexão por `sha2user`, o servidor determina que `caching_sha2_password` é o plugin de autenticação apropriado e o invoca (porque foi esse o plugin especificado na época de `CREATE USER`). O plugin descobre que a conexão não está criptografada e, portanto, exige que a senha seja transmitida usando criptografia RSA. No entanto, o servidor não envia a chave pública para o cliente, e o cliente não forneceu nenhuma chave pública, então não pode criptografar a senha e a conexão falha:

```
ERROR 2061 (HY000): Authentication plugin 'caching_sha2_password'
reported error: Authentication requires secure connection.
```

Para solicitar a chave pública RSA do servidor, especifique a opção `--get-server-public-key`:

```
$> mysql --ssl-mode=DISABLED -u sha2user -p --get-server-public-key
Enter password: password
```

Nesse caso, o servidor envia a chave pública RSA para o cliente, que a usa para criptografar a senha e retorna o resultado ao servidor. O plugin usa a chave privada RSA no lado do servidor para descriptografar a senha e aceita ou rejeita a conexão com base se a senha estiver correta.

Alternativamente, se o cliente tiver um arquivo contendo uma cópia local da chave pública RSA necessária pelo servidor, ele pode especificar o arquivo usando a opção `--server-public-key-path`:

```
$> mysql --ssl-mode=DISABLED -u sha2user -p --server-public-key-path=file_name
Enter password: password
```

Nesse caso, o cliente usa a chave pública para criptografar a senha e retorna o resultado ao servidor. O plugin usa a chave privada RSA no lado do servidor para descriptografar a senha e aceita ou rejeita a conexão com base se a senha estiver correta.

O valor da chave pública no arquivo nomeado pela opção `--server-public-key-path` deve ser o mesmo do valor da chave no arquivo do lado do servidor nomeado pela variável de sistema `caching_sha2_password_public_key_path`. Se o arquivo de chave contiver um valor de chave pública válido, mas o valor estiver incorreto, ocorrerá um erro de acesso negado. Se o arquivo de chave não contiver uma chave pública válida, o programa cliente não poderá usá-la.

Os usuários do cliente podem obter a chave pública RSA de duas maneiras:

- O administrador do banco de dados pode fornecer uma cópia do arquivo de chave pública.

- Um usuário cliente que puder se conectar ao servidor de outra forma pode usar uma declaração `SHOW STATUS LIKE 'Caching_sha2_password_rsa_public_key'` e salvar o valor da chave retornado em um arquivo.

##### Operação de cache para autenticação substituível SHA-2

No lado do servidor, o plugin `caching_sha2_password` utiliza um cache em memória para uma autenticação mais rápida de clientes que se conectaram anteriormente. As entradas consistem em pares nome\_conta/hash\_senha. O cache funciona da seguinte maneira:

1. Quando um cliente se conecta, `caching_sha2_password` verifica se o cliente e a senha correspondem a alguma entrada de cache. Se sim, a autenticação é bem-sucedida.

2. Se não houver uma entrada de cache correspondente, o plugin tenta verificar o cliente contra as credenciais na tabela do sistema `mysql.user`. Se isso for bem-sucedido, `caching_sha2_password` adiciona uma entrada para o cliente ao hash. Caso contrário, a autenticação falha e a conexão é rejeitada.

Dessa forma, quando um cliente se conecta pela primeira vez, ocorre a autenticação contra a tabela do sistema `mysql.user`. Quando o cliente se conecta posteriormente, a autenticação mais rápida ocorre contra o cache.

As operações de cache de senha, além da adição de entradas, são gerenciadas pelo plugin de auditoria `sha2_cache_cleaner`, que executa essas ações em nome de `caching_sha2_password`:

- Ele limpa a entrada do cache para qualquer conta que seja renomeada ou excluída, ou qualquer conta para a qual as credenciais ou o plugin de autenticação sejam alterados.

- Ela libera o cache quando a instrução `FLUSH PRIVILEGES` é executada.

- Esvazia o cache ao desligar o servidor. (Isso significa que o cache não é persistente após o reinício do servidor.)

As operações de limpeza do cache afetam os requisitos de autenticação para as conexões subsequentes do cliente. Para cada conta de usuário, a primeira conexão do cliente para o usuário após qualquer uma das seguintes operações deve usar uma conexão segura (feita usando TCP com credenciais TLS, um arquivo de soquete Unix ou memória compartilhada) ou troca de senha baseada em par de chaves RSA:

- Após a criação da conta.

- Após uma alteração da senha da conta.

- Após `RENAME USER` para a conta.

- Após `FLUSH PRIVILEGES`.

`FLUSH PRIVILEGES` limpa todo o cache e afeta todas as contas que utilizam o plugin `caching_sha2_password`. As outras operações limpam entradas específicas do cache e afetam apenas as contas que fazem parte da operação.

Depois que o usuário se autentica com sucesso, a conta é inserida no cache e as conexões subsequentes não exigem uma conexão segura ou o par de chaves RSA, até que ocorra outro evento de limpeza do cache que afete a conta. (Quando o cache pode ser usado, o servidor utiliza um mecanismo de desafio-resposta que não utiliza a transmissão de senha em texto claro e não exige uma conexão segura.)
