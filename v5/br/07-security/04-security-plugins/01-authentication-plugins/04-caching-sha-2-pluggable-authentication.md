#### 6.4.1.4 Caching de Autenticação Conectada SHA-2

O MySQL oferece dois plugins de autenticação que implementam a criptografia SHA-256 para as senhas das contas de usuário:

- `sha256_password`: Implementa autenticação básica SHA-256.

- `caching_sha2_password`: Implementa autenticação SHA-256 (como `sha256_password`), mas utiliza o cache no lado do servidor para melhor desempenho e possui recursos adicionais para uma aplicação mais ampla. (No MySQL 5.7, `caching_sha2_password` é implementado apenas no lado do cliente, conforme descrito mais adiante nesta seção.)

Esta seção descreve o plugin de autenticação com cache SHA-2, disponível a partir do MySQL 5.7.23. Para informações sobre o plugin básico original (sem cache), consulte Seção 6.4.1.5, “Autenticação Personalizável SHA-256”.

Importante

No MySQL 5.7, o plugin de autenticação padrão é `mysql_native_password`. A partir do MySQL 8.0, o plugin de autenticação padrão é alterado para `caching_sha2_password`. Para permitir que os clientes do MySQL 5.7 se conectem a servidores 8.0 e superiores usando contas que autenticam com `caching_sha2_password`, a biblioteca de clientes do MySQL 5.7 e os programas de clientes suportam o plugin de autenticação do lado do cliente `caching_sha2_password`. Isso melhora a compatibilidade da capacidade de conexão do cliente do MySQL 5.7 em relação aos servidores MySQL 8.0 e superiores, apesar das diferenças no plugin de autenticação padrão.

Limitar o suporte `caching_sha2_password` no MySQL 5.7 ao plugin no lado do cliente na biblioteca do cliente tem essas implicações em comparação com o MySQL 8.0:

- O plugin `caching_sha2_password` para o lado do servidor não está implementado no MySQL 5.7.

- Os servidores do MySQL 5.7 não suportam a criação de contas que se autenticam com `caching_sha2_password`.

- Os servidores MySQL 5.7 não implementam variáveis de sistema e status específicas para o suporte do lado do servidor `caching_sha2_password`: `caching_sha2_password_auto_generate_rsa_keys`, `caching_sha2_password_private_key_path`, `caching_sha2_password_public_key_path`, `Caching_sha2_password_rsa_public_key`.

Além disso, não há suporte para réplicas do MySQL 5.7 conectarem-se aos servidores de origem da replicação do MySQL 8.0 usando contas que autenticam com `caching_sha2_password`. Isso implicaria em uma origem replicando para uma réplica com um número de versão menor que a versão da origem, enquanto as origens normalmente replicam para réplicas com uma versão igual ou maior que a versão da origem.

Importante

Para se conectar a um servidor MySQL 8.0 ou superior usando uma conta que autentica com o plugin `caching_sha2_password`, você deve usar uma conexão segura ou uma conexão não criptografada que suporte a troca de senha usando um par de chaves RSA, conforme descrito mais adiante nesta seção. De qualquer forma, o plugin `caching_sha2_password` utiliza as capacidades de criptografia do MySQL. Veja Seção 6.3, “Usando Conexões Criptografadas”.

Nota

No nome `sha256_password`, “sha256” refere-se ao comprimento de digestão de 256 bits que o plugin usa para criptografia. No nome `caching_sha2_password`, “sha2” refere-se mais genericamente à classe de algoritmos de criptografia SHA-2, da qual a criptografia de 256 bits é uma instância. A escolha desse nome permite espaço para futuras expansões de possíveis comprimentos de digestão sem alterar o nome do plugin.

O plugin `caching_sha2_password` tem essas vantagens em comparação com `sha256_password`:

- No lado do servidor, um cache em memória permite uma reautenticação mais rápida dos usuários que se conectaram anteriormente quando se conectam novamente. (Esse comportamento no lado do servidor é implementado apenas no MySQL 8.0 e versões posteriores.)

- O suporte é fornecido para conexões de clientes que utilizam os protocolos Unix socket-file e compartilhamento de memória.

A tabela a seguir mostra o nome do plugin no lado do cliente.

**Tabela 6.10 Nomes de plugins e bibliotecas para autenticação SHA-2**

<table summary="Nomes para o plugin e o arquivo de biblioteca usados para autenticação de senha SHA-2."><thead><tr> <th>Plugin ou arquivo</th> <th>Nome do Plugin ou do Arquivo</th> </tr></thead><tbody><tr> <td>Plugin no lado do cliente</td> <td>[[<code class="literal">caching_sha2_password</code>]]</td> </tr><tr> <td>Arquivo da biblioteca</td> <td>Nenhum (o plugin está embutido)</td> </tr></tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para o cache de autenticação substituível SHA-2:

- Instalando Autenticação Pluggable SHA-2
- Usando autenticação substituível SHA-2
- Operação de cache para autenticação substituível SHA-2

Para obter informações gerais sobre autenticação plugável no MySQL, consulte Seção 6.2.13, “Autenticação Plugável”.

##### Instalando Autenticação Conectada SHA-2

No MySQL 5.7, o plugin `caching_sha2_password` existe na forma de cliente. O plugin do lado do cliente é integrado à biblioteca de cliente `libmysqlclient` e está disponível para qualquer programa vinculado ao `libmysqlclient`.

##### Usando autenticação substituível SHA-2

No MySQL 5.7, o plugin `caching_sha2_password` no lado do cliente permite a conexão com servidores MySQL 8.0 ou superiores usando contas que autenticam com o plugin `caching_sha2_password` no lado do servidor. A discussão aqui assume que uma conta chamada `'sha2user'@'localhost'` existe no servidor MySQL 8.0 ou superior. Por exemplo, a seguinte declaração cria uma conta desse tipo, onde *`password`* é a senha desejada:

```sql
CREATE USER 'sha2user'@'localhost'
IDENTIFIED WITH caching_sha2_password BY 'password';
```

`caching_sha2_password` suporta conexões em transporte seguro. `caching_sha2_password` também suporta a troca de senhas criptografadas usando RSA em conexões não criptografadas, se essas condições forem atendidas:

- A biblioteca de clientes e os programas de clientes do MySQL 5.7 são compilados usando o OpenSSL, não o yaSSL. O `caching_sha2_password` funciona com distribuições compiladas usando qualquer um desses pacotes, mas o suporte ao RSA requer o OpenSSL.

  Nota

  É possível compilar o MySQL usando o yaSSL como alternativa ao OpenSSL apenas antes do MySQL 5.7.28. A partir do MySQL 5.7.28, o suporte ao yaSSL é removido e todas as compilações do MySQL usam o OpenSSL.

- O servidor MySQL 8.0 ou superior ao qual você deseja se conectar está configurado para suportar RSA (usando o procedimento de configuração RSA fornecido mais adiante nesta seção).

O suporte do RSA possui essas características, onde todos os aspectos que pertencem ao lado do servidor exigem um servidor MySQL 8.0 ou superior:

- No lado do servidor, duas variáveis de sistema nomeiam os arquivos de par de chave privada e pública RSA: `caching_sha2_password_private_key_path` e `caching_sha2_password_public_key_path`. O administrador do banco de dados deve definir essas variáveis no início do servidor se os arquivos de chave a serem usados tiverem nomes que diferem dos valores padrão da variável do sistema.

- O servidor usa a variável de sistema `caching_sha2_password_auto_generate_rsa_keys` para determinar se deve gerar automaticamente os arquivos de par de chaves RSA. Veja Seção 6.3.3, “Criando Certificados e Chaves SSL e RSA”.

- A variável de status `Caching_sha2_password_rsa_public_key` exibe o valor da chave pública RSA usada pelo plugin de autenticação `caching_sha2_password`.

- Os clientes que possuem a chave pública RSA podem realizar a troca de senha com base em pares de chaves RSA com o servidor durante o processo de conexão, conforme descrito mais adiante.

- Para conexões por contas que autenticam com `caching_sha2_password` e troca de senha baseada em par de chaves RSA, o servidor não envia a chave pública RSA para os clientes por padrão. Os clientes podem usar uma cópia do lado do cliente da chave pública necessária ou solicitar a chave pública do servidor.

  O uso de uma cópia local confiável da chave pública permite que o cliente evite uma ida e volta no protocolo cliente/servidor e é mais seguro do que solicitar a chave pública do servidor. Por outro lado, solicitar a chave pública do servidor é mais conveniente (não requer a gestão de um arquivo no lado do cliente) e pode ser aceitável em ambientes de rede seguros.

  - Para clientes de linha de comando, use a opção `--server-public-key-path` para especificar o arquivo da chave pública RSA. Use a opção `--get-server-public-key` para solicitar a chave pública do servidor. Os seguintes programas suportam as duas opções: **mysql**, **mysqladmin**, **mysqlbinlog**, **mysqlcheck**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, \[**mysqlbinlog**]\(mysqlbinlog

  - Para programas que utilizam a API C, chame `mysql_options()` para especificar o arquivo da chave pública RSA passando a opção `MYSQL_SERVER_PUBLIC_KEY` e o nome do arquivo, ou solicite a chave pública ao servidor passando a opção `MYSQL_OPT_GET_SERVER_PUBLIC_KEY`.

  Em todos os casos, se a opção for dada para especificar um arquivo de chave pública válido, ele terá precedência sobre a opção de solicitar a chave pública do servidor.

Para clientes que usam o plugin `caching_sha2_password`, as senhas nunca são exibidas em texto claro ao se conectar ao servidor MySQL 8.0 ou superior. A forma como a transmissão da senha ocorre depende se uma conexão segura ou criptografia RSA é usada:

- Se a conexão for segura, um par de chaves RSA não é necessário e não é usado. Isso se aplica a conexões TCP criptografadas usando TLS, bem como conexões de Unix socket-file e conexões de memória compartilhada. A senha é enviada em texto simples, mas não pode ser interceptada porque a conexão é segura.

- Se a conexão não for segura, um par de chaves RSA é usado. Isso se aplica a conexões TCP não criptografadas usando TLS e conexões de named-pipe. O RSA é usado apenas para a troca de senhas entre o cliente e o servidor, para evitar a escuta de senhas. Quando o servidor recebe a senha criptografada, ele a descriptografa. Uma mistura é usada na criptografia para evitar ataques repetidos.

- Se uma conexão segura não for usada e a criptografia RSA não estiver disponível, a tentativa de conexão falhará porque a senha não pode ser enviada sem ser exposta como texto simples.

Como mencionado anteriormente, o criptoamento de senhas RSA está disponível apenas se o MySQL 5.7 foi compilado usando o OpenSSL. A implicação para clientes de distribuições do MySQL 5.7 compiladas usando o yaSSL é que, para usar senhas SHA-2, os clientes *devem* usar uma conexão criptografada para acessar o servidor. Veja Seção 6.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”.

Supondo que o MySQL 5.7 tenha sido compilado com o OpenSSL, use o procedimento a seguir para habilitar o uso de um par de chaves RSA para a troca de senhas durante o processo de conexão do cliente.

Importante

Os aspectos desse procedimento que se referem à configuração do servidor devem ser feitos no servidor MySQL 8.0 ou superior ao qual você deseja se conectar usando clientes MySQL 5.7, *não* no seu servidor MySQL 5.7.

1. Crie os arquivos de par de chaves privadas e públicas RSA usando as instruções na Seção 6.3.3, “Criando Certificados e Chaves SSL e RSA”.

2. Se os arquivos de chave privada e pública estiverem localizados no diretório de dados e tiverem os nomes `private_key.pem` e `public_key.pem` (os valores padrão das variáveis de sistema `caching_sha2_password_private_key_path` e `caching_sha2_password_public_key_path`), o servidor usá-los automaticamente ao iniciar.

   Caso contrário, para nomear os arquivos-chave explicitamente, defina as variáveis do sistema com os nomes dos arquivos-chave no arquivo de opção do servidor. Se os arquivos estiverem localizados no diretório de dados do servidor, você não precisa especificar seus nomes completos de caminho:

   ```sql
   [mysqld]
   caching_sha2_password_private_key_path=myprivkey.pem
   caching_sha2_password_public_key_path=mypubkey.pem
   ```

   Se os arquivos de chave não estiverem localizados no diretório de dados, ou para tornar suas localizações explícitas nos valores da variável do sistema, use nomes de caminho completos:

   ```sql
   [mysqld]
   caching_sha2_password_private_key_path=/usr/local/mysql/myprivkey.pem
   caching_sha2_password_public_key_path=/usr/local/mysql/mypubkey.pem
   ```

3. Reinicie o servidor, depois conecte-se a ele e verifique o valor da variável de status `Caching_sha2_password_rsa_public_key`. O valor real difere do mostrado aqui, mas deve ser não vazio:

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

   Se o valor estiver vazio, o servidor encontrou algum problema com os arquivos de chave. Verifique o log de erro para obter informações de diagnóstico.

Depois que o servidor foi configurado com os arquivos de chave RSA, as contas que se autenticam com o plugin `caching_sha2_password` têm a opção de usar esses arquivos de chave para se conectar ao servidor. Como mencionado anteriormente, tais contas podem usar uma conexão segura (neste caso, o RSA não é usado) ou uma conexão não criptografada que realiza a troca de senha usando RSA. Suponha que uma conexão não criptografada seja usada. Por exemplo:

```sql
$> mysql --ssl-mode=DISABLED -u sha2user -p
Enter password: password
```

Para essa tentativa de conexão pelo `sha2user`, o servidor determina que `caching_sha2_password` é o plugin de autenticação apropriado e o invoca (porque foi esse o plugin especificado no momento de `CREATE USER`. O plugin descobre que a conexão não está criptografada e, portanto, exige que a senha seja transmitida usando criptografia RSA. No entanto, o servidor não envia a chave pública para o cliente, e o cliente não forneceu nenhuma chave pública, então não pode criptografar a senha e a conexão falha:

```sql
ERROR 2061 (HY000): Authentication plugin 'caching_sha2_password'
reported error: Authentication requires secure connection.
```

Para solicitar a chave pública RSA do servidor, especifique a opção `--get-server-public-key`:

```sql
$> mysql --ssl-mode=DISABLED -u sha2user -p --get-server-public-key
Enter password: password
```

Nesse caso, o servidor envia a chave pública RSA para o cliente, que a usa para criptografar a senha e retorna o resultado ao servidor. O plugin usa a chave privada RSA no lado do servidor para descriptografar a senha e aceita ou rejeita a conexão com base se a senha estiver correta.

Alternativamente, se o cliente tiver um arquivo contendo uma cópia local da chave pública RSA necessária pelo servidor, ele pode especificar o arquivo usando a opção `--server-public-key-path`:

```sql
$> mysql --ssl-mode=DISABLED -u sha2user -p --server-public-key-path=file_name
Enter password: password
```

Nesse caso, o cliente usa a chave pública para criptografar a senha e retorna o resultado ao servidor. O plugin usa a chave privada RSA no lado do servidor para descriptografar a senha e aceita ou rejeita a conexão com base se a senha estiver correta.

O valor da chave pública no arquivo nomeado pela opção `--server-public-key-path` deve ser o mesmo do valor da chave no arquivo do lado do servidor nomeado pela variável de sistema `caching_sha2_password_public_key_path`. Se o arquivo da chave contiver um valor de chave pública válido, mas o valor estiver incorreto, ocorrerá um erro de acesso negado. Se o arquivo da chave não contiver uma chave pública válida, o programa cliente não poderá usá-la.

Os usuários do cliente podem obter a chave pública RSA de duas maneiras:

- O administrador do banco de dados pode fornecer uma cópia do arquivo de chave pública.

- Um usuário cliente que puder se conectar ao servidor de outra forma pode usar a instrução `SHOW STATUS LIKE 'Caching_sha2_password_rsa_public_key'` e salvar o valor da chave retornado em um arquivo.

##### Operação de cache para autenticação substituível SHA-2

No lado do servidor, o plugin `caching_sha2_password` usa um cache em memória para uma autenticação mais rápida de clientes que se conectaram anteriormente. Para o MySQL 5.7, que suporta apenas o plugin de autenticação no lado do cliente `caching_sha2_password`, esse cache no lado do servidor ocorre no servidor MySQL 8.0 ou superior ao qual você se conecta usando clientes MySQL 5.7. Para informações sobre a operação do cache, consulte Operação de Cache para Autenticação Flexível SHA-2, no *Manual de Referência do MySQL 8.0*.
