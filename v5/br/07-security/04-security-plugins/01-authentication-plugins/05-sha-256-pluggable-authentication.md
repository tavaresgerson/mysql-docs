#### 6.4.1.5 Autenticação substituível SHA-256

O MySQL oferece dois plugins de autenticação que implementam a criptografia SHA-256 para as senhas das contas de usuário:

- `sha256_password`: Implementa autenticação básica SHA-256.

- `caching_sha2_password`: Implementa autenticação SHA-256 (como `sha256_password`), mas utiliza o cache no lado do servidor para melhor desempenho e possui recursos adicionais para uma aplicação mais ampla.

Esta seção descreve o plugin de autenticação SHA-2 original sem cache. Para informações sobre o plugin de cache, consulte Seção 6.4.1.4, “Autenticação Personalizável SHA-2 com Cache”.

Importante

Para se conectar ao servidor usando uma conta que autentica com o plugin `sha256_password`, você deve usar uma conexão TLS ou uma conexão não criptografada que suporte a troca de senha usando um par de chaves RSA, conforme descrito mais adiante nesta seção. De qualquer forma, o plugin `sha256_password` utiliza as capacidades de criptografia do MySQL. Veja Seção 6.3, “Usando Conexões Criptografadas”.

::: info Nota
No nome `sha256_password`, “sha256” refere-se ao comprimento de digestão de 256 bits que o plugin usa para criptografia. No nome `caching_sha2_password`, “sha2” refere-se mais genericamente à classe de algoritmos de criptografia SHA-2, da qual a criptografia de 256 bits é uma instância. A escolha desse nome permite espaço para futuras expansões de possíveis comprimentos de digestão sem alterar o nome do plugin.
:::

A tabela a seguir mostra os nomes dos plugins no lado do servidor e no lado do cliente.

**Tabela 6.11 Nomes de plugins e bibliotecas para autenticação SHA-256**

<table summary="Nomes para os plugins e o arquivo de biblioteca usados para autenticação de senha SHA-256."><thead><tr> <th>Plugin ou arquivo</th> <th>Nome do Plugin ou do Arquivo</th> </tr></thead><tbody><tr> <td>Plugin no lado do servidor</td> <td>[[<code>sha256_password</code>]]</td> </tr><tr> <td>Plugin no lado do cliente</td> <td>[[<code>sha256_password</code>]]</td> </tr><tr> <td>Arquivo da biblioteca</td> <td>Nenhum (os plugins são integrados)</td> </tr></tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação plugável SHA-256:

- Instalando Autenticação Pluggable SHA-256
- Usando autenticação plugável SHA-256

Para obter informações gerais sobre autenticação plugável no MySQL, consulte Seção 6.2.13, “Autenticação Plugável”.

##### Instalando Autenticação Conectada SHA-256

O plugin `sha256_password` existe em formulários de servidor e cliente:

- O plugin do lado do servidor é integrado ao servidor, não precisa ser carregado explicitamente e não pode ser desativado descarregando-o.

- O plugin do lado do cliente é integrado à biblioteca de clientes `libmysqlclient` e está disponível para qualquer programa vinculado ao `libmysqlclient`.

##### Usando autenticação substituível SHA-256

Para configurar uma conta que use o plugin `sha256_password` para hash de senha SHA-256, use a seguinte declaração, onde *`password`* é a senha desejada da conta:

```sql
CREATE USER 'sha256user'@'localhost'
IDENTIFIED WITH sha256_password BY 'password';
```

O servidor atribui o plugin `sha256_password` à conta e usa-o para criptografar a senha usando SHA-256, armazenando esses valores nas colunas `plugin` e `authentication_string` da tabela de sistema `mysql.user`.

As instruções anteriores não assumem que `sha256_password` é o plugin de autenticação padrão. Se `sha256_password` for o plugin de autenticação padrão, uma sintaxe mais simples do `CREATE USER` pode ser usada.

Para iniciar o servidor com o plugin de autenticação padrão definido como `sha256_password`, coloque essas linhas no arquivo de opções do servidor:

```
[mysqld]
default_authentication_plugin=sha256_password
```

Isso faz com que o plugin `sha256_password` seja usado por padrão para novas contas. Como resultado, é possível criar a conta e definir sua senha sem nomear o plugin explicitamente:

```sql
CREATE USER 'sha256user'@'localhost' IDENTIFIED BY 'password';
```

Outra consequência de definir `default_authentication_plugin` para `sha256_password` é que, para usar outro plugin para a criação de contas, você deve especificar esse plugin explicitamente. Por exemplo, para usar o plugin `mysql_native_password`, use a seguinte declaração:

```sql
CREATE USER 'nativeuser'@'localhost'
IDENTIFIED WITH mysql_native_password BY 'password';
```

`sha256_password` suporta conexões por meio de transporte seguro. `sha256_password` também suporta a troca de senhas criptografadas usando RSA em conexões não criptografadas, se essas condições forem atendidas:

- O MySQL é compilado usando o OpenSSL, não o yaSSL. O `sha256_password` funciona com distribuições compiladas usando qualquer um desses pacotes, mas o suporte ao RSA requer o OpenSSL.

  ::: info Nota
  É possível compilar o MySQL usando o yaSSL como alternativa ao OpenSSL apenas antes do MySQL 5.7.28. A partir do MySQL 5.7.28, o suporte ao yaSSL é removido e todas as compilações do MySQL usam o OpenSSL.
  :::

- O servidor MySQL ao qual você deseja se conectar está configurado para suportar RSA (usando o procedimento de configuração RSA fornecido mais adiante nesta seção).

O suporte do RSA possui essas características:

- No lado do servidor, duas variáveis de sistema nomeiam os arquivos de par de chaves RSA privada e pública: `sha256_password_private_key_path` e `sha256_password_public_key_path`. O administrador do banco de dados deve definir essas variáveis no início do servidor se os arquivos de chave a serem usados tiverem nomes que diferem dos valores padrão da variável do sistema.

- O servidor usa a variável de sistema `sha256_password_auto_generate_rsa_keys` para determinar se deve gerar automaticamente os arquivos de par de chaves RSA. Veja Seção 6.3.3, “Criando Certificados e Chaves SSL e RSA”.

- A variável de status `Rsa_public_key` exibe o valor da chave pública RSA usada pelo plugin de autenticação `sha256_password`.

- Os clientes que possuem a chave pública RSA podem realizar a troca de senha com base em pares de chaves RSA com o servidor durante o processo de conexão, conforme descrito mais adiante.

- Para conexões por contas que autenticam usando `sha256_password` e troca de senha baseada em par de chave pública RSA, o servidor envia a chave pública RSA ao cliente conforme necessário. No entanto, se uma cópia da chave pública estiver disponível no host do cliente, o cliente pode usá-la para salvar uma ida e volta no protocolo cliente/servidor:

  - Para esses clientes de linha de comando, use a opção `--server-public-key-path` para especificar o arquivo da chave pública RSA: **mysql**, **mysqltest** e (a partir do MySQL 5.7.23) **mysqladmin**, **mysqlbinlog**, **mysqlcheck**, **mysqldump**, **mysqlimport**, **mysqlpump**, **mysqlshow**, **mysqlslap**, **mysqltest**.

  - Para programas que utilizam a API C, chame `mysql_options()` para especificar o arquivo da chave pública RSA passando a opção `MYSQL_SERVER_PUBLIC_KEY` e o nome do arquivo.

  - Para réplicas, o intercâmbio de senhas baseado em pares de chaves RSA não pode ser usado para se conectar aos servidores de origem para contas que autenticam com o plugin `sha256_password`. Para essas contas, apenas conexões seguras podem ser usadas.

Para clientes que usam o plugin `sha256_password`, as senhas nunca são exibidas em texto claro ao se conectar ao servidor. A forma como a transmissão da senha ocorre depende se uma conexão segura ou criptografia RSA é usada:

- Se a conexão for segura, um par de chaves RSA não é necessário e não é usado. Isso se aplica a conexões criptografadas usando TLS. A senha é enviada em texto simples, mas não pode ser interceptada porque a conexão é segura.

  ::: info Nota
  Ao contrário do `caching_sha2_password`, o plugin `sha256_password` não considera as conexões de memória compartilhada como seguras, mesmo que o transporte de memória compartilhada seja seguro por padrão.
  :::

- Se a conexão não for segura e um par de chaves RSA estiver disponível, a conexão permanecerá não criptografada. Isso se aplica a conexões não criptografadas usando TLS. O RSA é usado apenas para a troca de senhas entre o cliente e o servidor, para evitar a escuta de senhas. Quando o servidor recebe a senha criptografada, ele a descriptografa. Uma confusão é usada na criptografia para evitar ataques repetidos.

- Se uma conexão segura não for usada e a criptografia RSA não estiver disponível, a tentativa de conexão falhará porque a senha não pode ser enviada sem ser exposta como texto simples.

Como mencionado anteriormente, o criptoamento de senhas RSA está disponível apenas se o MySQL foi compilado com o OpenSSL. A implicação para as distribuições do MySQL compiladas com o yaSSL é que, para usar senhas SHA-256, os clientes *devem* usar uma conexão criptografada para acessar o servidor. Veja Seção 6.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”.

::: info Nota
Para usar a criptografia de senha RSA com `sha256_password`, o cliente e o servidor devem ser compilados usando o OpenSSL, e não apenas um deles.
:::

Supondo que o MySQL tenha sido compilado com o OpenSSL, use o procedimento a seguir para habilitar o uso de um par de chaves RSA para a troca de senhas durante o processo de conexão do cliente:

1. Crie os arquivos de par de chaves privadas e públicas RSA usando as instruções na Seção 6.3.3, “Criando Certificados e Chaves SSL e RSA”.

2. Se os arquivos de chave privada e pública estiverem localizados no diretório de dados e tiverem os nomes `private_key.pem` e `public_key.pem` (os valores padrão das variáveis de sistema `sha256_password_private_key_path` e `sha256_password_public_key_path`), o servidor usará-os automaticamente ao iniciar.

   Caso contrário, para nomear os arquivos-chave explicitamente, defina as variáveis do sistema com os nomes dos arquivos-chave no arquivo de opção do servidor. Se os arquivos estiverem localizados no diretório de dados do servidor, você não precisa especificar seus nomes completos de caminho:

   ```
   [mysqld]
   sha256_password_private_key_path=myprivkey.pem
   sha256_password_public_key_path=mypubkey.pem
   ```

   Se os arquivos de chave não estiverem localizados no diretório de dados, ou para tornar suas localizações explícitas nos valores da variável do sistema, use nomes de caminho completos:

   ```
   [mysqld]
   sha256_password_private_key_path=/usr/local/mysql/myprivkey.pem
   sha256_password_public_key_path=/usr/local/mysql/mypubkey.pem
   ```

3. Reinicie o servidor, depois conecte-se a ele e verifique o valor da variável de status `Rsa_public_key`. O valor real difere do mostrado aqui, mas deve ser não vazio:

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

   Se o valor estiver vazio, o servidor encontrou algum problema com os arquivos de chave. Verifique o log de erro para obter informações de diagnóstico.

Depois que o servidor foi configurado com os arquivos de chave RSA, as contas que se autenticam com o plugin `sha256_password` têm a opção de usar esses arquivos de chave para se conectar ao servidor. Como mencionado anteriormente, tais contas podem usar uma conexão segura (neste caso, o RSA não é usado) ou uma conexão não criptografada que realiza a troca de senha usando RSA. Suponha que uma conexão não criptografada seja usada. Por exemplo:

```sh
$> mysql --ssl-mode=DISABLED -u sha256user -p
Enter password: password
```

Para essa tentativa de conexão do `sha256user`, o servidor determina que `sha256_password` é o plugin de autenticação apropriado e o invoca (porque foi esse o plugin especificado no momento de `CREATE USER`. O plugin descobre que a conexão não está criptografada e, portanto, requer que a senha seja transmitida usando criptografia RSA. Neste caso, o plugin envia a chave pública RSA ao cliente, que a usa para criptografar a senha e retorna o resultado ao servidor. O plugin usa a chave privada RSA no lado do servidor para descriptografar a senha e aceita ou rejeita a conexão com base na correção da senha.

O servidor envia a chave pública RSA para o cliente conforme necessário. No entanto, se o cliente tiver um arquivo contendo uma cópia local da chave pública RSA necessária pelo servidor, ele pode especificar o arquivo usando a opção `--server-public-key-path`:

```sh
$> mysql --ssl-mode=DISABLED -u sha256user -p --server-public-key-path=file_name
Enter password: password
```

O valor da chave pública no arquivo nomeado pela opção `--server-public-key-path` deve ser o mesmo do valor da chave no arquivo do lado do servidor nomeado pela variável de sistema `sha256_password_public_key_path`. Se o arquivo de chave contiver um valor de chave pública válido, mas o valor estiver incorreto, ocorrerá um erro de acesso negado. Se o arquivo de chave não contiver uma chave pública válida, o programa cliente não poderá usá-la. Nesse caso, o plugin `sha256_password` envia a chave pública ao cliente como se não tivesse sido especificada a opção `--server-public-key-path`.

Os usuários do cliente podem obter a chave pública RSA de duas maneiras:

- O administrador do banco de dados pode fornecer uma cópia do arquivo de chave pública.

- Um usuário cliente que puder se conectar ao servidor de outra forma pode usar a instrução `SHOW STATUS LIKE 'Rsa_public_key'` e salvar o valor da chave retornado em um arquivo.
