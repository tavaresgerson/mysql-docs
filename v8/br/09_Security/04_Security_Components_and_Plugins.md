## 8.4 Componentes e plugins de segurança

O MySQL inclui vários componentes e plugins que implementam recursos de segurança:

* Plugins para autenticação de tentativas de conexão de clientes ao servidor MySQL. Os plugins estão disponíveis para vários protocolos de autenticação. Para discussão geral sobre o processo de autenticação, consulte a Seção 8.2.17, “Autenticação Conectada”. Para características de plugins de autenticação específicos, consulte a Seção 8.4.1, “Plugins de Autenticação”.

* Um componente de validação de senha para implementar políticas de força de senha e avaliar a força de senhas potenciais. Veja a Seção 8.4.3, “O Componente de Validação de Senha”.

* Plugins de cartela de identificação que oferecem armazenamento seguro para informações sensíveis. Veja a Seção 8.4.4, “O Keyring do MySQL”.

* (Apenas para a Edição Empresarial do MySQL) O MySQL Enterprise Audit, implementado usando um plugin do servidor, utiliza a API de auditoria aberta do MySQL para permitir o monitoramento e registro padrão, baseado em políticas, da atividade de conexão e consulta executada em servidores MySQL específicos. Projetado para atender à especificação de auditoria da Oracle, o MySQL Enterprise Audit oferece uma solução de auditoria e conformidade fácil de usar, pronta para uso, para aplicativos que são regidos por diretrizes regulatórias internas e externas. Veja a Seção 8.4.5, “MySQL Enterprise Audit”.

* Uma função permite que as aplicações adicionem seus próprios eventos de mensagem ao registro de auditoria. Veja a Seção 8.4.6, “O componente de mensagem de auditoria”.

* (Apenas para a Edição Empresarial do MySQL) O MySQL Enterprise Firewall, um firewall de nível de aplicativo que permite que os administradores de banco de dados permitam ou negam a execução de declarações SQL com base na correspondência com listas de padrões de declarações aceitos. Isso ajuda a proteger o MySQL Server contra ataques como injeção SQL ou tentativas de explorar aplicativos usando-os fora de suas características legítimas de carga de consulta. Veja a Seção 8.4.7, “MySQL Enterprise Firewall”.

* (Apenas para a Edição Empresarial do MySQL) Mascaramento e Desidentificação de Dados do MySQL Enterprise, implementado como uma biblioteca de plugins que contém um plugin e um conjunto de funções. O mascaramento de dados oculta informações sensíveis, substituindo os valores reais por substitutos. As funções de Mascaramento e Desidentificação de Dados do MySQL Enterprise permitem o mascaramento de dados existentes usando vários métodos, como o ofuscamento (removendo características identificáveis), a geração de dados aleatórios formatados e a substituição ou substituição de dados. Veja a Seção 8.5, “Mascaramento e Desidentificação de Dados do MySQL Enterprise”.

### 8.4.1 Plugins de autenticação

Nota

Se você está procurando informações sobre o plugin `authentication_oci`, ele é apenas para o MySQL HeatWave Service. Veja [plugin de autenticação oci][(https://docs.oracle.com/en-us/iaas/mysql-database/doc/connecting-db-system.html#MYAAS-GUID-232CA959-1FDD-4AA8-A77D-0A551C881C09)], no manual do *MySQL HeatWave Service*.

As seções a seguir descrevem os métodos de autenticação intercambiáveis disponíveis no MySQL e os plugins que implementam esses métodos. Para discussão geral sobre o processo de autenticação, consulte a Seção 8.2.17, “Autenticação Intercambiável”.

O plugin de autenticação padrão é determinado conforme descrito em O plugin de autenticação padrão.

#### 8.4.1.1 Autenticação Native Pluggable

O MySQL inclui um plugin `mysql_native_password` que implementa autenticação nativa; ou seja, autenticação baseada no método de hashing de senha utilizado antes da introdução da autenticação permutavel.

Nota

O plugin de autenticação `mysql_native_password` é desatualizado a partir do MySQL 8.0.34, desativado por padrão no MySQL 8.4 e removido a partir do MySQL 9.0.0.

A tabela a seguir mostra os nomes dos plugins dos lados do servidor e do cliente.

**Tabela 8.16 Nomes de plugins e bibliotecas para autenticação de senha nativa**

<table summary="Names for the plugins and library file used for native password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Nome do plugin ou do arquivo</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>mysql_native_password</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>mysql_native_password</code></td> </tr><tr> <td>Library file</td> <td>Nenhum (os plugins são construídos)</td> </tr></tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para autenticação nativa plugável:

* Instalar Autenticação Pluggable Nativa * Usar Autenticação Pluggable Nativa

Para informações gerais sobre autenticação conectada no MySQL, consulte a Seção 8.2.17, “Autenticação Conectada”.

##### Instalação de Autenticação Native Pluggable

O plugin `mysql_native_password` existe em formas de servidor e cliente:

* O plugin do lado do servidor é integrado ao servidor, não precisa ser carregado explicitamente e não pode ser desativado descarregando-o.

* O plugin do lado do cliente é integrado à biblioteca de clientes `libmysqlclient` e está disponível para qualquer programa vinculado ao `libmysqlclient`.

##### Usando Autenticação Native Pluggable

Os programas de cliente do MySQL usam `mysql_native_password` por padrão. A opção `--default-auth` pode ser usada como uma dica sobre qual plugin do lado do cliente o programa pode esperar usar:

```
$> mysql --default-auth=mysql_native_password ...
```

#### 8.4.1.2 Cacheamento de Autenticação Substituível SHA-2

O MySQL oferece dois plugins de autenticação que implementam a criptografia SHA-256 para as senhas das contas de usuário:

* `caching_sha2_password`: Implementa autenticação SHA-256 (como a descontinuada `sha256_password`), mas utiliza cache no lado do servidor para melhor desempenho e possui recursos adicionais para uma aplicabilidade mais ampla.

* `sha256_password`: Implementa autenticação básica SHA-256. Este é descontinuado a partir do MySQL 8.0.16 e está sujeito à remoção no futuro.

Esta seção descreve o plugin de autenticação com cache SHA-2. Para informações sobre o plugin básico original (sem cache), consulte a Seção 8.4.1.3, “Autenticação substituível SHA-256”.

Importante

No MySQL 8.0, `caching_sha2_password` é o plugin de autenticação padrão em vez de `mysql_native_password`. Para informações sobre as implicações dessa mudança para o funcionamento do servidor e a compatibilidade do servidor com clientes e conectores, consulte `caching_sha2_password` como o plugin de autenticação preferido.

Importante

Para se conectar ao servidor usando uma conta que se autentica com o plugin `caching_sha2_password`, você deve usar uma conexão segura ou uma conexão não criptografada que suporte a troca de senha usando um par de chaves RSA, conforme descrito mais adiante nesta seção. De qualquer forma, o plugin `caching_sha2_password` usa as capacidades de criptografia do MySQL. Veja a Seção 8.3, “Usando Conexões Criptografadas”.

Nota

Em nome `sha256_password`, “sha256” se refere ao comprimento de digestão de 256 bits que o plugin usa para criptografia. No nome `caching_sha2_password`, “sha2” se refere mais genericamente à classe SHA-2 de algoritmos de criptografia, das quais a criptografia de 256 bits é uma instância. A escolha do nome posterior deixa espaço para a expansão futura de possíveis comprimentos de digestão sem alterar o nome do plugin.

O plugin `caching_sha2_password` tem essas vantagens, em comparação com o `sha256_password`:

* No lado do servidor, um cache de memória permite uma reautenticação mais rápida de usuários que se conectaram anteriormente quando se conectam novamente.

* A troca de senhas com base em RSA está disponível independentemente da biblioteca SSL contra a qual o MySQL está vinculado.

* O suporte é fornecido para conexões de clientes que utilizam os protocolos de arquivo de socket Unix e memória compartilhada.

A tabela a seguir mostra os nomes dos plugins dos lados do servidor e do cliente.

**Tabela 8.17 Nomes de plugins e bibliotecas para autenticação SHA-2**

<table summary="Names for the plugins and library file used for SHA-2 password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Nome do plugin ou do arquivo</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>caching_sha2_password</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>caching_sha2_password</code></td> </tr><tr> <td>Library file</td> <td>Nenhum (os plugins são construídos)</td> </tr></tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para o cache de autenticação substituível SHA-2:

* Instalar autenticação substituível SHA-2
* Usar autenticação substituível SHA-2
* Operação de cache para autenticação substituível SHA-2

Para informações gerais sobre autenticação conectada no MySQL, consulte a Seção 8.2.17, “Autenticação Conectada”.

##### Instalação da Autenticação Conectada SHA-2

O plugin `caching_sha2_password` existe em formas de servidor e cliente:

* O plugin do lado do servidor é integrado ao servidor, não precisa ser carregado explicitamente e não pode ser desativado descarregando-o.

* O plugin do lado do cliente é integrado à biblioteca de clientes `libmysqlclient` e está disponível para qualquer programa vinculado ao `libmysqlclient`.

O plugin do lado do servidor usa o plugin de auditoria `sha2_cache_cleaner` como um auxiliar para realizar a gestão do cache de senhas. `sha2_cache_cleaner`, assim como `caching_sha2_password`, é integrado e não precisa ser instalado.

##### Uso do Autenticação Deslocável SHA-2

Para configurar uma conta que utilize o plugin `caching_sha2_password` para hashing de senha SHA-256, use a seguinte declaração, onde *`password`* é a senha desejada da conta:

```
CREATE USER 'sha2user'@'localhost'
IDENTIFIED WITH caching_sha2_password BY 'password';
```

O servidor atribui o plugin `caching_sha2_password` à conta e o usa para criptografar a senha usando SHA-256, armazenando esses valores nas colunas `plugin` e `authentication_string` da tabela do sistema `mysql.user`.

As instruções anteriores não assumem que `caching_sha2_password` seja o plugin de autenticação padrão. Se `caching_sha2_password` for o plugin de autenticação padrão, pode-se usar uma sintaxe mais simples `CREATE USER`(create-user.html "15.7.1.3 CREATE USER Statement").

Para iniciar o servidor com o plugin de autenticação padrão definido como `caching_sha2_password`, coloque essas linhas no arquivo de opção do servidor:

```
[mysqld]
default_authentication_plugin=caching_sha2_password
```

Isso faz com que o plugin `caching_sha2_password` seja usado por padrão para novas contas. Como resultado, é possível criar a conta e definir sua senha sem nomear o plugin explicitamente:

```
CREATE USER 'sha2user'@'localhost' IDENTIFIED BY 'password';
```

Outra consequência de definir `default_authentication_plugin` para `caching_sha2_password` é que, para usar outro plugin para a criação de contas, você deve especificar esse plugin explicitamente. Por exemplo, para usar o plugin descontinuado `mysql_native_password`, use esta declaração:

```
CREATE USER 'nativeuser'@'localhost'
IDENTIFIED WITH mysql_native_password BY 'password';
```

`caching_sha2_password` suporta conexões em transporte seguro. Se você seguir o procedimento de configuração RSA dado mais adiante nesta seção, também suporta a troca de senha criptografada usando RSA em conexões não criptografadas. O suporte RSA tem essas características:

* No lado do servidor, duas variáveis do sistema nomeiam os arquivos de chave privada e pública do RSA: `caching_sha2_password_private_key_path` e `caching_sha2_password_public_key_path`. O administrador do banco de dados deve definir essas variáveis no início do servidor, se os arquivos de chave a serem usados tiverem nomes que diferem dos valores padrão da variável do sistema.

* O servidor utiliza a variável de sistema `caching_sha2_password_auto_generate_rsa_keys` para determinar se deve gerar automaticamente os arquivos de par de chaves RSA. Veja a Seção 8.3.3, “Criando Certificados e Chaves SSL e RSA”.

* A variável de status `Caching_sha2_password_rsa_public_key` exibe o valor da chave pública RSA utilizada pelo plugin de autenticação `caching_sha2_password`.

* Os clientes que possuem a chave pública RSA podem realizar a troca de senha com base em par de chaves RSA com o servidor durante o processo de conexão, conforme descrito mais adiante.

* Para conexões por contas que autenticam com `caching_sha2_password` e troca de senha com par de chave RSA, o servidor não envia a chave pública RSA para os clientes por padrão. Os clientes podem usar uma cópia do lado do cliente da chave pública necessária, ou solicitar a chave pública do servidor.

O uso de uma cópia local confiável da chave pública permite que o cliente evite uma viagem de ida e volta no protocolo cliente/servidor e é mais seguro do que solicitar a chave pública do servidor. Por outro lado, solicitar a chave pública do servidor é mais conveniente (não requer gerenciamento de um arquivo do lado do cliente) e pode ser aceitável em ambientes de rede seguros.

+ Para clientes de linha de comando, use a opção `--server-public-key-path` para especificar o arquivo da chave pública RSA. Use a opção `--get-server-public-key` para solicitar a chave pública do servidor. Os seguintes programas suportam as duas opções: **mysql**, **mysqlsh**, **mysqladmin**, **mysqlbinlog**, **mysqlcheck**, **mysqldump**, **mysqlimport**, **mysqlpump**, **mysqlshow**, **mysqlslap**, **mysqltest**, **mysql_upgrade**.

+ Para programas que utilizam a API C, chame `mysql_options()` para especificar o arquivo da chave pública RSA, passando a opção `MYSQL_SERVER_PUBLIC_KEY` e o nome do arquivo, ou solicite a chave pública do servidor, passando a opção `MYSQL_OPT_GET_SERVER_PUBLIC_KEY`.

+ Para réplicas, use a declaração `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (do MySQL 8.0.23) ou a declaração `CHANGE MASTER TO`(change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes do MySQL 8.0.23) com a opção `SOURCE_PUBLIC_KEY_PATH` | `MASTER_PUBLIC_KEY_PATH` para especificar o arquivo da chave pública RSA, ou a opção `GET_SOURCE_PUBLIC_KEY` | `GET_MASTER_PUBLIC_KEY` para solicitar a chave pública da fonte. Para a Replicação de Grupo, as variáveis de sistema `group_replication_recovery_public_key_path` e `group_replication_recovery_get_public_key` servem o mesmo propósito.

Em todos os casos, se a opção for dada para especificar um arquivo de chave pública válido, ela tem precedência sobre a opção de solicitar a chave pública do servidor.

Para clientes que utilizam o plugin `caching_sha2_password`, as senhas nunca são expostas como texto claro ao se conectar ao servidor. A forma como a transmissão da senha ocorre depende se uma conexão segura ou criptografia RSA é utilizada:

* Se a conexão for segura, um par de chaves RSA não é necessário e não é usado. Isso se aplica a conexões TCP criptografadas usando TLS, bem como conexões de Unix socket-file e conexões de memória compartilhada. A senha é enviada como texto claro, mas não pode ser explorada porque a conexão é segura.

* Se a conexão não for segura, um par de chaves RSA é usado. Isso se aplica a conexões TCP não criptografadas usando TLS e conexões de canal nomeado. O RSA é usado apenas para troca de senha entre cliente e servidor, para evitar o roubo de senha. Quando o servidor recebe a senha criptografada, ele a descriptografa. Um código é usado na criptografia para evitar ataques repetidos.

Para habilitar o uso de um par de chaves RSA para troca de senha durante o processo de conexão do cliente, use o procedimento a seguir:

1. Crie os arquivos de chave privada e pública do RSA usando as instruções na Seção 8.3.3, “Criando certificados e chaves SSL e RSA”.

2. Se os arquivos das chaves privadas e públicas estiverem localizados no diretório de dados e tiverem os nomes `private_key.pem` e `public_key.pem` (os valores padrão das variáveis de sistema `caching_sha2_password_private_key_path` e `caching_sha2_password_public_key_path`), o servidor os utiliza automaticamente na inicialização.

Caso contrário, para nomear os arquivos principais explicitamente, defina as variáveis do sistema com os nomes dos arquivos chave no arquivo de opção do servidor. Se os arquivos estiverem localizados no diretório de dados do servidor, você não precisa especificar seus nomes completos de caminho:

   ```
   [mysqld]
   caching_sha2_password_private_key_path=myprivkey.pem
   caching_sha2_password_public_key_path=mypubkey.pem
   ```

Se os arquivos de chave não estiverem localizados no diretório de dados, ou para tornar suas localizações explícitas nos valores das variáveis do sistema, use nomes de caminho completos:

   ```
   [mysqld]
   caching_sha2_password_private_key_path=/usr/local/mysql/myprivkey.pem
   caching_sha2_password_public_key_path=/usr/local/mysql/mypubkey.pem
   ```

3. Se você deseja alterar o número de rodadas de hash usadas pelo `caching_sha2_password` durante a geração da senha, defina a variável de sistema `caching_sha2_password_digest_rounds`. Por exemplo:

   ```
   [mysqld]
   caching_sha2_password_digest_rounds=10000
   ```

4. Reinicie o servidor, conecte-se a ele e verifique o valor da variável `Caching_sha2_password_rsa_public_key`. O valor exibido na verdade difere do mostrado aqui, mas deve ser não vazio:

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

Após o servidor ter sido configurado com os arquivos da chave RSA, as contas que se autenticam com o plugin `caching_sha2_password` têm a opção de usar esses arquivos de chave para se conectar ao servidor. Como mencionado anteriormente, tais contas podem usar uma conexão segura (neste caso, o RSA não é usado) ou uma conexão não criptografada que realiza a troca de senha usando RSA. Suponha que uma conexão não criptografada seja usada. Por exemplo:

```
$> mysql --ssl-mode=DISABLED -u sha2user -p
Enter password: password
```

Para essa tentativa de conexão por `sha2user`, o servidor determina que `caching_sha2_password` é o plugin de autenticação apropriado e o invoca (porque foi o plugin especificado na época de `CREATE USER`). O plugin descobre que a conexão não está criptografada e, portanto, requer que a senha seja transmitida usando criptografia RSA. No entanto, o servidor não envia a chave pública ao cliente, e o cliente não forneceu nenhuma chave pública, então não pode criptografar a senha e a conexão falha:

```
ERROR 2061 (HY000): Authentication plugin 'caching_sha2_password'
reported error: Authentication requires secure connection.
```

Para solicitar a chave pública RSA do servidor, especifique a opção `--get-server-public-key`:

```
$> mysql --ssl-mode=DISABLED -u sha2user -p --get-server-public-key
Enter password: password
```

Neste caso, o servidor envia a chave pública RSA ao cliente, que a usa para criptografar a senha e retorna o resultado ao servidor. O plugin usa a chave privada RSA do lado do servidor para descriptografar a senha e aceita ou rejeita a conexão com base no fato de a senha estar correta.

Como alternativa, se o cliente tiver um arquivo contendo uma cópia local da chave pública RSA necessária pelo servidor, pode especificar o arquivo usando a opção `--server-public-key-path`:

```
$> mysql --ssl-mode=DISABLED -u sha2user -p --server-public-key-path=file_name
Enter password: password
```

Neste caso, o cliente usa a chave pública para criptografar a senha e retorna o resultado ao servidor. O plugin usa a chave privada RSA do lado do servidor para descriptografar a senha e aceita ou rejeita a conexão com base no fato de a senha estar correta.

O valor da chave pública no arquivo denominado pela opção `--server-public-key-path` deve ser o mesmo que o valor da chave no arquivo do lado do servidor denominado pela variável de sistema `caching_sha2_password_public_key_path`. Se o arquivo da chave contiver um valor de chave pública válido, mas o valor estiver incorreto, ocorrerá um erro de acesso negado. Se o arquivo da chave não contiver uma chave pública válida, o programa cliente não poderá usá-la.

Os usuários do cliente podem obter a chave pública RSA de duas maneiras:

* O administrador do banco de dados pode fornecer uma cópia do arquivo da chave pública.

* Um usuário cliente que pode se conectar ao servidor de outra forma pode usar uma declaração `SHOW STATUS LIKE 'Caching_sha2_password_rsa_public_key'` e salvar o valor da chave retornado em um arquivo.

##### Operação de cache para autenticação substituível SHA-2

No lado do servidor, o plugin `caching_sha2_password` usa um cache de memória para uma autenticação mais rápida de clientes que se conectaram anteriormente. As entradas consistem em pares nome da conta/hash da senha. O cache funciona da seguinte forma:

1. Quando um cliente se conecta, `caching_sha2_password` verifica se o cliente e a senha correspondem a alguma entrada de cache. Se sim, a autenticação é bem-sucedida.

2. Se não houver uma entrada de cache correspondente, o plugin tenta verificar o cliente contra as credenciais na tabela do sistema `mysql.user`. Se isso for bem-sucedido, o `caching_sha2_password` adiciona uma entrada para o cliente ao hash. Caso contrário, a autenticação falha e a conexão é rejeitada.

Dessa forma, quando um cliente se conecta pela primeira vez, a autenticação contra a tabela do sistema `mysql.user` ocorre. Quando o cliente se conecta posteriormente, a autenticação mais rápida ocorre contra o cache.

As operações de cache de senha que não são a adição de entradas são gerenciadas pelo plugin de auditoria `sha2_cache_cleaner`, que realiza essas ações em nome do `caching_sha2_password`:

* Limpa a entrada do cache para qualquer conta que seja renomeada ou removida, ou qualquer conta para a qual as credenciais ou o plugin de autenticação sejam alterados.

* Apaga o cache quando a declaração `FLUSH PRIVILEGES` (flush.html#flush-privileges) é executada.

* Apaga o cache ao desligar o servidor. (Isso significa que o cache não é persistente após o reinício do servidor.)

As operações de limpeza do cache afetam os requisitos de autenticação para conexões subsequentes do cliente. Para cada conta de usuário, a primeira conexão do cliente para o usuário após qualquer uma das seguintes operações deve usar uma conexão segura (feita usando TCP com credenciais TLS, um arquivo de soquete Unix ou memória compartilhada) ou troca de senha baseada em par de chaves RSA:

* Após a criação da conta. * Após uma alteração da senha da conta. * Após `RENAME USER` para a conta.

* Após `FLUSH PRIVILEGES`.

`FLUSH PRIVILEGES` limpa todo o cache e afeta todas as contas que utilizam o plugin `caching_sha2_password`. As outras operações limpam entradas de cache específicas e afetam apenas as contas que fazem parte da operação.

Uma vez que o usuário se autentique com sucesso, a conta é inserida no cache e as conexões subsequentes não exigem uma conexão segura ou o par de chaves RSA, até que ocorra outro evento de limpeza do cache que afete a conta. (Quando o cache pode ser usado, o servidor utiliza um mecanismo de desafio-resposta que não utiliza transmissão de senha em texto claro e não exige uma conexão segura.)

#### 8.4.1.3 Autenticação substituível SHA-256

O MySQL oferece dois plugins de autenticação que implementam a criptografia SHA-256 para as senhas das contas de usuário:

* `caching_sha2_password`: Implementa autenticação SHA-256 (como a descontinuada `sha256_password`), mas utiliza cache no lado do servidor para melhor desempenho e possui recursos adicionais para uma aplicabilidade mais ampla.

* `sha256_password`: Implementa autenticação básica SHA-256. Este é descontinuado a partir do MySQL 8.0.16 e está sujeito à remoção no futuro.

Esta seção descreve o plugin de autenticação SHA-2 original sem cache. Para informações sobre o plugin de cache, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação SHA-2”.

Importante

No MySQL 8.0, `caching_sha2_password` é o plugin de autenticação padrão, em vez de `mysql_native_password`. Para informações sobre as implicações dessa mudança para o funcionamento do servidor e a compatibilidade do servidor com clientes e conectores, consulte `caching_sha2_password` como o plugin de autenticação preferido.

Como o `caching_sha2_password` é o plugin de autenticação padrão no MySQL 8.0 e oferece um conjunto superconjunto das capacidades do plugin de autenticação `sha256_password`, o `sha256_password` é descontinuado; espere que ele seja removido em uma versão futura do MySQL. As contas do MySQL que autenticam usando o `sha256_password` devem ser migradas para usar o `caching_sha2_password` em vez disso.

Importante

Para se conectar ao servidor usando uma conta que se autentica com o plugin `sha256_password`, você deve usar uma conexão TLS ou uma conexão não criptografada que suporte a troca de senha usando um par de chaves RSA, conforme descrito mais adiante nesta seção. De qualquer forma, o plugin `sha256_password` utiliza as capacidades de criptografia do MySQL. Veja a Seção 8.3, “Usando Conexões Criptografadas”.

Nota

Em nome `sha256_password`, “sha256” se refere ao comprimento de digestão de 256 bits que o plugin usa para criptografia. No nome `caching_sha2_password`, “sha2” se refere mais genericamente à classe SHA-2 de algoritmos de criptografia, das quais a criptografia de 256 bits é uma instância. A escolha do nome posterior deixa espaço para a expansão futura de possíveis comprimentos de digestão sem alterar o nome do plugin.

A tabela a seguir mostra os nomes dos plugins dos lados do servidor e do cliente.

**Tabela 8.18 Nomes de plugins e bibliotecas para autenticação SHA-256**

<table summary="Names for the plugins and library file used for SHA-256 password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Nome do plugin ou do arquivo</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>sha256_password</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>sha256_password</code></td> </tr><tr> <td>Library file</td> <td>Nenhum (os plugins são construídos)</td> </tr></tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para autenticação plugável SHA-256:

* Instalar autenticação substituível SHA-256
* Usar autenticação substituível SHA-256

Para informações gerais sobre autenticação conectada no MySQL, consulte a Seção 8.2.17, “Autenticação Conectada”.

##### Instalação do SHA-256 Pluggable Authentication

O plugin `sha256_password` existe em formas de servidor e cliente:

* O plugin do lado do servidor é integrado ao servidor, não precisa ser carregado explicitamente e não pode ser desativado descarregando-o.

* O plugin do lado do cliente é integrado à biblioteca de clientes `libmysqlclient` e está disponível para qualquer programa vinculado ao `libmysqlclient`.

##### Uso do SHA-256 Pluggable Authentication

Para configurar uma conta que utilize o plugin descontinuado `sha256_password` para hashing de senha SHA-256, use a seguinte declaração, onde *`password`* é a senha desejada da conta:

```
CREATE USER 'sha256user'@'localhost'
IDENTIFIED WITH sha256_password BY 'password';
```

O servidor atribui o plugin `sha256_password` à conta e o usa para criptografar a senha usando SHA-256, armazenando esses valores nas colunas `plugin` e `authentication_string` da tabela do sistema `mysql.user`.

As instruções anteriores não assumem que `sha256_password` seja o plugin de autenticação padrão. Se `sha256_password` for o plugin de autenticação padrão, uma sintaxe mais simples `CREATE USER` pode ser usada.

Para iniciar o servidor com o plugin de autenticação padrão definido como `sha256_password`, coloque essas linhas no arquivo de opção do servidor:

```
[mysqld]
default_authentication_plugin=sha256_password
```

Isso faz com que o plugin `sha256_password` seja usado por padrão para novas contas. Como resultado, é possível criar a conta e definir sua senha sem nomear o plugin explicitamente:

```
CREATE USER 'sha256user'@'localhost' IDENTIFIED BY 'password';
```

Outra consequência de definir `default_authentication_plugin` para `sha256_password` é que, para usar outro plugin para a criação de contas, você deve especificar esse plugin explicitamente. Por exemplo, para usar o plugin `mysql_native_password`, use esta declaração:

```
CREATE USER 'nativeuser'@'localhost'
IDENTIFIED WITH mysql_native_password BY 'password';
```

`sha256_password` suporta conexões em transporte seguro. `sha256_password` também suporta a troca de senhas criptografadas usando RSA em conexões não criptografadas, se o MySQL for compilado com OpenSSL, e o servidor MySQL ao qual você deseja se conectar esteja configurado para suportar RSA (usando o procedimento de configuração RSA dado mais adiante nesta seção).

O suporte da RSA possui essas características:

* No lado do servidor, duas variáveis do sistema nomeiam os arquivos de chave privada e pública do RSA: `sha256_password_private_key_path` e `sha256_password_public_key_path`. O administrador do banco de dados deve definir essas variáveis no início do servidor, se os arquivos de chave a serem usados tiverem nomes que diferem dos valores padrão da variável do sistema.

* O servidor utiliza a variável de sistema `sha256_password_auto_generate_rsa_keys` para determinar se os arquivos de par de chaves RSA devem ser gerados automaticamente. Veja a Seção 8.3.3, “Criando certificados e chaves SSL e RSA”.

* A variável de status `Rsa_public_key` exibe o valor da chave pública RSA utilizada pelo plugin de autenticação `sha256_password`.

* Os clientes que possuem a chave pública RSA podem realizar a troca de senha com base em par de chaves RSA com o servidor durante o processo de conexão, conforme descrito mais adiante.

* Para conexões por contas que autenticam com `sha256_password` e troca de senha com par de chave pública RSA, o servidor envia a chave pública RSA ao cliente conforme necessário. No entanto, se uma cópia da chave pública estiver disponível no host do cliente, o cliente pode usá-la para salvar uma viagem de ida e volta no protocolo cliente/servidor:

+ Para esses clientes de linha de comando, use a opção `--server-public-key-path` para especificar o arquivo da chave pública RSA: **mysql**, **mysqladmin**, **mysqlbinlog**, **mysqlcheck**, **mysqldump**, **mysqlimport**, **mysqlpump**, **mysqlshow**, **mysqlslap**, **mysqltest**, **mysql_upgrade**.

+ Para programas que utilizam a API C, chame `mysql_options()` para especificar o arquivo da chave pública RSA, passando a opção `MYSQL_SERVER_PUBLIC_KEY` e o nome do arquivo.

+ Para réplicas, use a declaração `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (do MySQL 8.0.23) ou a declaração `CHANGE MASTER TO`(change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes do MySQL 8.0.23) com a opção `SOURCE_PUBLIC_KEY_PATH` | `MASTER_PUBLIC_KEY_PATH` para especificar o arquivo da chave pública RSA. Para a Replicação de Grupo, a variável de sistema `group_replication_recovery_get_public_key` serve o mesmo propósito.

Para clientes que utilizam o plugin `sha256_password`, as senhas nunca são expostas como texto claro ao se conectar ao servidor. A forma como a transmissão da senha ocorre depende se uma conexão segura ou criptografia RSA é utilizada:

* Se a conexão for segura, um par de chaves RSA não é necessário e não é usado. Isso se aplica a conexões criptografadas usando TLS. A senha é enviada como texto claro, mas não pode ser espiada porque a conexão é segura.

Nota

Ao contrário do `caching_sha2_password`, o plugin `sha256_password` não trata as conexões de memória compartilhada como seguras, embora o transporte de memória compartilhada seja seguro por padrão.

* Se a conexão não for segura e um par de chaves RSA estiver disponível, a conexão permanecerá não criptografada. Isso se aplica a conexões que não são criptografadas usando TLS. O RSA é usado apenas para troca de senhas entre cliente e servidor, para evitar o roubo de senhas. Quando o servidor recebe a senha criptografada, ele a descriptografa. Um código é usado na criptografia para evitar ataques repetidos.

* Se uma conexão segura não for usada e a criptografia RSA não estiver disponível, a tentativa de conexão falha porque a senha não pode ser enviada sem ser exposta como texto claro.

Nota

Para usar a criptografia de senha RSA com `sha256_password`, o cliente e o servidor devem ser compilados usando OpenSSL, não apenas um deles.

Supondo que o MySQL tenha sido compilado usando o OpenSSL, use o procedimento a seguir para habilitar o uso de um par de chaves RSA para troca de senha durante o processo de conexão do cliente:

1. Crie os arquivos de chave privada e pública do RSA usando as instruções na Seção 8.3.3, “Criando certificados e chaves SSL e RSA”.

2. Se os arquivos das chaves privadas e públicas estiverem localizados no diretório de dados e tiverem os nomes `private_key.pem` e `public_key.pem` (os valores padrão das variáveis de sistema `sha256_password_private_key_path` e `sha256_password_public_key_path`), o servidor os utiliza automaticamente na inicialização.

Caso contrário, para nomear os arquivos principais explicitamente, defina as variáveis do sistema com os nomes dos arquivos chave no arquivo de opção do servidor. Se os arquivos estiverem localizados no diretório de dados do servidor, você não precisa especificar seus nomes completos de caminho:

   ```
   [mysqld]
   sha256_password_private_key_path=myprivkey.pem
   sha256_password_public_key_path=mypubkey.pem
   ```

Se os arquivos de chave não estiverem localizados no diretório de dados, ou para tornar suas localizações explícitas nos valores das variáveis do sistema, use nomes de caminho completos:

   ```
   [mysqld]
   sha256_password_private_key_path=/usr/local/mysql/myprivkey.pem
   sha256_password_public_key_path=/usr/local/mysql/mypubkey.pem
   ```

3. Reinicie o servidor, conecte-se a ele e verifique o valor da variável `Rsa_public_key`. O valor exibido na verdade difere do mostrado aqui, mas deve ser não vazio:

   ```
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

Após o servidor ter sido configurado com os arquivos da chave RSA, as contas que se autenticam com o plugin `sha256_password` têm a opção de usar esses arquivos de chave para se conectar ao servidor. Como mencionado anteriormente, tais contas podem usar uma conexão segura (neste caso, o RSA não é usado) ou uma conexão não criptografada que realiza a troca de senha usando RSA. Suponha que uma conexão não criptografada seja usada. Por exemplo:

```
$> mysql --ssl-mode=DISABLED -u sha256user -p
Enter password: password
```

Para essa tentativa de conexão por `sha256user`, o servidor determina que `sha256_password` é o plugin de autenticação apropriado e o invoca (porque foi o plugin especificado na época de `CREATE USER`). O plugin descobre que a conexão não está criptografada e, portanto, requer que a senha seja transmitida usando criptografia RSA. Neste caso, o plugin envia a chave pública RSA ao cliente, que a usa para criptografar a senha e retorna o resultado ao servidor. O plugin usa a chave privada RSA no lado do servidor para descriptografar a senha e aceita ou rejeita a conexão com base no fato de a senha ser correta.

O servidor envia a chave pública RSA ao cliente conforme necessário. No entanto, se o cliente tiver um arquivo contendo uma cópia local da chave pública RSA necessária pelo servidor, ele pode especificar o arquivo usando a opção `--server-public-key-path`:

```
$> mysql --ssl-mode=DISABLED -u sha256user -p --server-public-key-path=file_name
Enter password: password
```

O valor da chave pública no arquivo denominado pela opção `--server-public-key-path` deve ser o mesmo que o valor da chave no arquivo do lado do servidor denominado pela variável de sistema `sha256_password_public_key_path`. Se o arquivo da chave contiver um valor de chave pública válido, mas o valor estiver incorreto, ocorrerá um erro de acesso negado. Se o arquivo da chave não contiver uma chave pública válida, o programa cliente não poderá usá-la. Neste caso, o plugin `sha256_password` envia a chave pública ao cliente como se não tivesse sido especificada a opção `--server-public-key-path`.

Os usuários do cliente podem obter a chave pública RSA de duas maneiras:

* O administrador do banco de dados pode fornecer uma cópia do arquivo da chave pública.

* Um usuário cliente que pode se conectar ao servidor de outra forma pode usar uma declaração `SHOW STATUS LIKE 'Rsa_public_key'` e salvar o valor da chave retornado em um arquivo.

#### 8.4.1.4 Autenticação transparente de texto claro do lado do cliente

Um plugin de autenticação do lado do cliente está disponível e permite que os clientes enviem senhas para o servidor como texto claro, sem hashing ou criptografia. Esse plugin está integrado à biblioteca de clientes MySQL.

A tabela a seguir mostra o nome do plugin.

**Tabela 8.19 Nomes de plugins e bibliotecas para autenticação de texto claro**

<table summary="Names for the plugins and library file used for cleartext password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Nome do plugin ou do arquivo</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td>Nenhum, veja a discussão</td> </tr><tr> <td>Client-side plugin</td> <td><code>mysql_clear_password</code></td> </tr><tr> <td>Library file</td> <td>Nenhum (o plugin está embutido)</td> </tr></tbody></table>

Muitos plugins de autenticação do lado do cliente realizam a criptografia ou hashing de uma senha antes de o cliente enviá-la ao servidor. Isso permite que os clientes evitem enviar senhas em texto claro.

A criptografia ou hashing não pode ser realizada em esquemas de autenticação que exigem que o servidor receba a senha conforme inserida no lado do cliente. Nesses casos, o plugin `mysql_clear_password` do lado do cliente é utilizado, que permite que o cliente envie a senha ao servidor como texto claro. Não há um plugin correspondente do lado do servidor. Em vez disso, o `mysql_clear_password` pode ser utilizado do lado do cliente em conjunto com qualquer plugin do lado do servidor que precise de uma senha em texto claro. (Exemplos são os plugins de autenticação PAM e LDAP simples; veja Seção 8.4.1.5, “Autenticação Conectada a PAM” e Seção 8.4.1.7, “Autenticação Conectada a LDAP”).

A discussão a seguir fornece informações de uso específicas para autenticação conectada em texto claro. Para informações gerais sobre autenticação conectada no MySQL, consulte a Seção 8.2.17, “Autenticação Conectada”.

Nota

Enviar senhas como texto claro pode ser um problema de segurança em algumas configurações. Para evitar problemas, se houver a possibilidade de a senha ser interceptada, os clientes devem se conectar ao servidor MySQL usando um método que proteja a senha. As possibilidades incluem SSL (consulte a Seção 8.3, “Usando conexões criptografadas”), IPsec ou uma rede privada.

Para tornar menos provável o uso inadvertido do plugin `mysql_clear_password`, os clientes do MySQL devem habilitá-lo explicitamente. Isso pode ser feito de várias maneiras:

* Defina a variável de ambiente `LIBMYSQL_ENABLE_CLEARTEXT_PLUGIN` para um valor que comece com `1`, `Y` ou `y`. Isso habilita o plugin para todas as conexões do cliente.

Os programas de cliente **mysql**, **mysqladmin**, **mysqlcheck**, **mysqldump**, **mysqlshow** e **mysqlslap** suportam a opção `--enable-cleartext-plugin` que permite o uso do plugin por solicitação.

* A função `mysql_options()` C API suporta uma opção `MYSQL_ENABLE_CLEARTEXT_PLUGIN` que permite o uso do plugin por conexão. Além disso, qualquer programa que use `libmysqlclient` e leia arquivos de opção pode habilitar o plugin, incluindo uma opção `enable-cleartext-plugin` em um grupo de opções lido pela biblioteca do cliente.

#### 8.4.1.5 PAM Pluggable Authentication

Nota

A autenticação plugável PAM é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL suporta um método de autenticação que permite ao MySQL Server usar módulos de autenticação configuráveis (PAM) para autenticar usuários do MySQL. O PAM permite que um sistema use uma interface padrão para acessar vários tipos de métodos de autenticação, como senhas tradicionais do Unix ou um diretório LDAP.

A autenticação plugável do PAM oferece essas capacidades:

* Autenticação externa: a autenticação PAM permite que o MySQL Server aceite conexões de usuários definidos fora das tabelas de concessão do MySQL e que se autentiquem usando métodos suportados pelo PAM.

* Suporte ao usuário proxy: a autenticação PAM pode retornar um nome de usuário diferente do nome de usuário externo passado pelo programa cliente para o MySQL, com base nos grupos PAM do usuário externo que ele é membro e na string de autenticação fornecida. Isso significa que o plugin pode retornar o usuário MySQL que define os privilégios que o usuário externo autenticado por PAM deve ter. Por exemplo, um usuário de sistema operacional chamado `joe` pode se conectar e ter os privilégios de um usuário MySQL chamado `developer`.

A autenticação conectada do PAM foi testada no Linux e no macOS; observe que o Windows não suporta o PAM.

A tabela a seguir mostra os nomes dos arquivos de plugin e biblioteca. O sufixo do nome do arquivo pode diferir no seu sistema. O arquivo deve estar localizado no diretório nomeado pela variável de sistema `plugin_dir`. Para informações de instalação, consulte Instalar PAM Pluggable Authentication.

**Tabela 8.20 Nomes de plugins e bibliotecas para autenticação PAM**

<table summary="Names for the plugins and library file used for PAM password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>authentication_pam</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>mysql_clear_password</code></td> </tr><tr> <td>Library file</td> <td><code>authentication_pam.so</code></td> </tr></tbody></table>

O plugin de texto claro `mysql_clear_password` do lado do cliente que se comunica com o plugin PAM do lado do servidor está integrado à biblioteca de clientes `libmysqlclient` e está incluído em todas as distribuições, incluindo as distribuições comunitárias. A inclusão do plugin de texto claro do lado do cliente em todas as distribuições MySQL permite que clientes de qualquer distribuição se conectem a um servidor que tenha o plugin PAM do lado do servidor carregado.

As seções a seguir fornecem informações de instalação e uso específicas para autenticação plugável PAM:

* Como funciona a autenticação PAM de usuários do MySQL
* Instalar autenticação plugável PAM
* Desinstalar autenticação plugável PAM
* Usar autenticação plugável PAM
* Autenticação PAM de senha Unix sem usuários de proxy
* Autenticação PAM LDAP sem usuários de proxy
* Autenticação PAM de senha Unix com usuários de proxy e mapeamento de grupo
* Acesso à autenticação PAM ao armazenamento de senha Unix
* Depuração da autenticação PAM

Para informações gerais sobre autenticação plugável no MySQL, consulte a Seção 8.2.17, “Autenticação Plugável”. Para informações sobre o plugin `mysql_clear_password`, consulte a Seção 8.4.1.4, “Autenticação de Texto Aberto Plugável do Lado do Cliente”. Para informações sobre informações de usuário do proxy, consulte a Seção 8.2.19, “Usuários do Proxy”.

##### Como a Autenticação PAM de Usuários do MySQL Funciona

Esta seção fornece uma visão geral de como o MySQL e o PAM trabalham juntos para autenticar usuários do MySQL. Para exemplos que mostram como configurar contas do MySQL para usar serviços PAM específicos, consulte Usar autenticação cabível do PAM.

1. O programa do cliente e o servidor se comunicam, com o cliente enviando ao servidor o nome do usuário do cliente (o nome do usuário do sistema operacional por padrão) e senha:

* O nome de usuário do cliente é o nome de usuário externo.
* Para contas que utilizam o plugin de autenticação do lado do servidor PAM, o plugin correspondente do lado do cliente é `mysql_clear_password`. Este plugin do lado do cliente não realiza hashing de senha, com o resultado de que o cliente envia a senha para o servidor como texto claro.

2. O servidor encontra uma conta MySQL correspondente com base no nome do usuário externo e no host a partir do qual o cliente se conecta. O plugin PAM usa as informações passadas para ele pelo MySQL Server (como nome do usuário, nome do host, senha e string de autenticação). Quando você define uma conta MySQL que autentica usando PAM, a string de autenticação contém:

* Um nome de serviço do PAM, que é um nome que o administrador do sistema pode usar para se referir a um método de autenticação para uma aplicação específica. Pode haver várias aplicações associadas a uma única instância do servidor de banco de dados, portanto, a escolha do nome do serviço é deixada ao desenvolvedor de aplicativos SQL.

* Opcionalmente, se o proxeamento deve ser usado, uma mapeo de grupos PAM para nomes de usuários do MySQL.

3. O plugin usa o serviço PAM nomeado na string de autenticação para verificar as credenciais do usuário e retorna `'Authentication succeeded, Username is user_name'` ou `'Authentication failed'`. A senha deve ser apropriada para o armazenamento de senhas utilizado pelo serviço PAM. Exemplos:

* Para senhas tradicionais do Unix, o serviço procura senhas armazenadas no arquivo `/etc/shadow`.

* Para LDAP, o serviço busca senhas armazenadas em um diretório LDAP.

Se a verificação das credenciais falhar, o servidor recusa a conexão.

4. Caso contrário, a string de autenticação indica se ocorre o encaminhamento. Se a string não contiver mapeamento de grupo PAM, o encaminhamento não ocorre. Nesse caso, o nome do usuário do MySQL é o mesmo que o nome do usuário externo.

5. Caso contrário, o proxy é indicado com base na mapeo do grupo PAM, com o nome de usuário do MySQL determinado com base no primeiro grupo correspondente na lista de mapeo. O significado de "grupo PAM" depende do serviço PAM. Exemplos:

* Para senhas tradicionais do Unix, os grupos são grupos Unix definidos no arquivo `/etc/group`, possivelmente complementados com informações adicionais do PAM em um arquivo como `/etc/security/group.conf`.

* Para LDAP, os grupos são grupos LDAP definidos em um diretório LDAP.

Se o usuário proxy (o usuário externo) tiver o privilégio `PROXY` para o nome do usuário MySQL proxy, o proxy ocorrerá, com o usuário proxy assumindo os privilégios do usuário proxy.

##### Instalação do PAM Pluggable Authentication

Esta seção descreve como instalar o plugin de autenticação PAM do lado do servidor. Para informações gerais sobre a instalação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para ser utilizável pelo servidor, o arquivo da biblioteca de plugins deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin, definindo o valor de `plugin_dir` na inicialização do servidor.

O nome de arquivo da biblioteca de plugins é `authentication_pam`, e geralmente é compilado com o sufixo `.so`.

Para carregar o plugin no início da inicialização do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com este método de carregamento de plugins, a opção deve ser dada toda vez que o servidor é iniciado. Por exemplo, coloque essas linhas no arquivo do servidor `my.cnf`:

```
[mysqld]
plugin-load-add=authentication_pam.so
```

Após modificar `my.cnf`, reinicie o servidor para que as novas configurações sejam aplicadas.

Como alternativa, para carregar o plugin em tempo de execução, use esta declaração, ajustando o sufixo `.so` conforme necessário:

```
INSTALL PLUGIN authentication_pam SONAME 'authentication_pam.so';
```

`INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela do sistema `mysql.plugins`, fazendo com que o servidor o carregue para cada inicialização normal subsequente, sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 7.6.2, “Obtenção de Informações do Plugin do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%pam%';
+--------------------+---------------+
| PLUGIN_NAME        | PLUGIN_STATUS |
+--------------------+---------------+
| authentication_pam | ACTIVE        |
+--------------------+---------------+
```

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

Para associar contas do MySQL ao plugin PAM, consulte o uso do PAM Pluggable Authentication.

##### Desinstalando o PAM Pluggable Authentication

O método usado para desinstalar o plugin de autenticação PAM depende de como você o instalou:

* Se você instalou o plugin na inicialização do servidor usando uma opção `--plugin-load-add`, reinicie o servidor sem a opção.

* Se você instalou o plugin em tempo de execução usando uma declaração `INSTALL PLUGIN`, ele permanece instalado após as reinicializações do servidor. Para desinstalá-lo, use `UNINSTALL PLUGIN`:

  ```
  UNINSTALL PLUGIN authentication_pam;
  ```

##### Uso do PAM Pluggable Authentication

Esta seção descreve, em termos gerais, como usar o plugin de autenticação PAM para se conectar a partir de programas cliente MySQL ao servidor. As seções seguintes fornecem instruções para usar a autenticação PAM de maneiras específicas. Assume-se que o servidor está sendo executado com o plugin PAM de lado de servidor habilitado, conforme descrito em Instalar Autenticação de Pluggable PAM.

Para se referir ao plugin de autenticação PAM na cláusula `IDENTIFIED WITH` de uma declaração `CREATE USER`, use o nome `authentication_pam`. Por exemplo:

```
CREATE USER user
  IDENTIFIED WITH authentication_pam
  AS 'auth_string';
```

A string de autenticação especifica os seguintes tipos de informações:

* O nome do serviço do PAM (ver Como funciona a autenticação do PAM de usuários do MySQL). Os exemplos na discussão a seguir usam um nome de serviço de `mysql-unix` para autenticação usando senhas tradicionais do Unix, e `mysql-ldap` para autenticação usando LDAP.

* Para suporte de proxy, o PAM fornece uma maneira para um módulo PAM retornar ao servidor um nome de usuário MySQL diferente do nome de usuário externo passado pelo programa cliente quando ele se conecta ao servidor. Use a string de autenticação para controlar a mapeo de nomes de usuário externos para nomes de usuário MySQL. Se você deseja aproveitar as capacidades do usuário proxy, a string de autenticação deve incluir esse tipo de mapeo.

Por exemplo, se uma conta usa o nome de serviço `mysql-unix` do PAM e deve mapear usuários do sistema operacional nos grupos `root` e `users` do PAM aos usuários do MySQL `developer` e `data_entry`, respectivamente, use uma declaração como esta:

```
CREATE USER user
  IDENTIFIED WITH authentication_pam
  AS 'mysql-unix, root=developer, users=data_entry';
```

A sintaxe da string de autenticação para o plugin de autenticação PAM segue estas regras:

* A cadeia consiste em um nome de serviço PAM, opcionalmente seguido de uma lista de mapeamento de grupo PAM, que consiste em um ou mais pares de palavras-chave/valores, cada um especificando um nome de grupo PAM e um nome de usuário MySQL:

  ```
  pam_service_name[,pam_group_name=mysql_user_name]...
  ```

O plugin analisa a string de autenticação para cada tentativa de conexão que utiliza a conta. Para minimizar o overhead, mantenha a string o mais curta possível.

* Cada par `pam_group_name=mysql_user_name` deve ser precedido por uma vírgula.

* Espaços principais e finais que não estão dentro de aspas duplas são ignorados.

Os valores *`pam_service_name`*, *`pam_group_name`* e *`mysql_user_name`* não citados podem conter qualquer coisa, exceto sinal de igual, vírgula ou espaço.

* Se um valor de *`pam_service_name`*, *`pam_group_name`* ou *`mysql_user_name`* for citado com aspas duplas, tudo entre as aspas faz parte do valor. Isso é necessário, por exemplo, se o valor contiver caracteres de espaço. Todos os caracteres são legais, exceto as aspas duplas e a barra invertida (`\`). Para incluir qualquer um desses caracteres, escape-o com uma barra invertida.

Se o plugin autenticar com sucesso o nome do usuário externo (o nome passado pelo cliente), ele procura uma lista de mapeamento de grupo PAM na string de autenticação e, se presente, usa-a para retornar um nome de usuário diferente ao servidor MySQL com base no qual os grupos PAM são membros do usuário externo:

* Se a string de autenticação não contiver uma lista de mapeamento de grupo PAM, o plugin retorna o nome externo.

* Se a string de autenticação contiver uma lista de mapeamento de grupo PAM, o plugin examina cada par `pam_group_name=mysql_user_name` na lista da esquerda para a direita e tenta encontrar uma correspondência para o valor *`pam_group_name`* em um diretório não MySQL dos grupos atribuídos ao usuário autenticado e retorna *`mysql_user_name`* para a primeira correspondência que encontra. Se o plugin não encontrar nenhuma correspondência para qualquer grupo PAM, ele retorna o nome externo. Se o plugin não for capaz de procurar um grupo em um diretório, ele ignora a lista de mapeamento de grupo PAM e retorna o nome externo.

As seções a seguir descrevem como configurar vários cenários de autenticação que utilizam o plugin de autenticação PAM:

* Sem usuários proxy. Isso usa o PAM apenas para verificar nomes de login e senhas. Todo usuário externo autorizado a se conectar ao MySQL Server deve ter uma conta correspondente no MySQL que seja definida para usar autenticação PAM. (Para uma conta MySQL de `'user_name'@'host_name'` para corresponder ao usuário externo, *`user_name`* deve ser o nome do usuário externo e *`host_name`* deve corresponder ao host do qual o cliente se conecta.) A autenticação pode ser realizada por vários métodos suportados pelo PAM. A discussão posterior mostra como autenticar as credenciais do cliente usando senhas tradicionais do Unix e senhas no LDAP.

A autenticação PAM, quando não realizada por meio de usuários proxy ou grupos PAM, exige que o nome do usuário do MySQL seja o mesmo que o nome do usuário do sistema operacional. Os nomes de usuário do MySQL estão limitados a 32 caracteres (consulte a Seção 8.2.3, “Tabelas de Concessão”), o que limita a autenticação não-proxy PAM a contas Unix com nomes de no máximo 32 caracteres.

* Apenas para usuários proxy, com mapeamento de grupo PAM. Para este cenário, crie uma ou mais contas MySQL que definam diferentes conjuntos de privilégios. (Idealmente, ninguém deve se conectar diretamente usando essas contas.) Em seguida, defina um usuário padrão que se autentique através do PAM e use algum esquema de mapeamento (geralmente baseado nos grupos PAM externos dos quais os usuários são membros) para mapear todos os nomes de usuário externos para as poucas contas MySQL que possuem os conjuntos de privilégios. Qualquer cliente que se conecte e especifique um nome de usuário externo como o nome do usuário do cliente será mapeado para uma das contas MySQL e usará seus privilégios. A discussão mostra como configurar isso usando senhas tradicionais do Unix, mas outros métodos PAM, como LDAP, podem ser usados em vez disso.

São possíveis variações desses cenários:

* Você pode permitir que alguns usuários façam login diretamente (sem proxy) e exigir que outros se conectem por meio de contas proxy.

* Você pode usar um método de autenticação PAM para alguns usuários e outro método para outros usuários, usando nomes diferentes de serviços PAM entre suas contas autenticadas por PAM. Por exemplo, você pode usar o serviço PAM `mysql-unix` para alguns usuários e `mysql-ldap` para outros.

Os exemplos fazem as seguintes suposições. Você pode precisar fazer alguns ajustes se o seu sistema estiver configurado de maneira diferente.

* O nome de login e a senha são `antonio` e *`antonio_password`*, respectivamente. Altere esses valores para corresponder ao usuário que você deseja autenticar.

* O diretório de configuração do PAM é `/etc/pam.d`.

* O nome do serviço PAM corresponde ao método de autenticação (`mysql-unix` ou `mysql-ldap` nesta discussão). Para usar um serviço PAM específico, você deve configurar um arquivo PAM com o mesmo nome no diretório de configuração do PAM (criando o arquivo se ele não existir). Além disso, você deve nomear o serviço PAM na string de autenticação da declaração `CREATE USER` para qualquer conta que autentique usando esse serviço PAM.

O plugin de autenticação PAM verifica no momento da inicialização se o valor `AUTHENTICATION_PAM_LOG` do ambiente está definido no ambiente de inicialização do servidor. Se sim, o plugin habilita a registro de mensagens de diagnóstico na saída padrão. Dependendo de como seu servidor é iniciado, a mensagem pode aparecer na consola ou no log de erro. Essas mensagens podem ser úteis para depuração de problemas relacionados ao PAM que ocorrem quando o plugin realiza a autenticação. Para mais informações, consulte Depuração da Autenticação PAM.

##### Autenticação de senha PAM Unix sem Proxy de Usuários

Este cenário de autenticação utiliza o PAM para verificar usuários externos definidos em termos de nomes de usuário do sistema operacional e senhas Unix, sem proxy. Cada usuário externo autorizado a se conectar ao MySQL Server deve ter uma conta correspondente no MySQL que seja definida para usar autenticação PAM através do armazenamento tradicional de senhas Unix.

Nota

As senhas tradicionais do Unix são verificadas usando o arquivo `/etc/shadow`. Para informações sobre possíveis problemas relacionados a este arquivo, consulte Autenticação de acesso à senha do Unix do PAM.

1. Verifique se a autenticação Unix permite logins no sistema operacional com o nome de usuário `antonio` e senha *`antonio_password`*.

2. Configure o PAM para autenticar as conexões do MySQL usando senhas tradicionais do Unix, criando um arquivo de serviço PAM `mysql-unix` chamado `/etc/pam.d/mysql-unix`. O conteúdo do arquivo depende do sistema, então verifique os arquivos relacionados ao login no diretório `/etc/pam.d` para ver como eles aparecem. No Linux, o arquivo `mysql-unix` pode parecer assim:

   ```
   #%PAM-1.0
   auth            include         password-auth
   account         include         password-auth
   ```

Para o macOS, use `login` em vez de `password-auth`.

O formato do arquivo PAM pode diferir em alguns sistemas. Por exemplo, em Ubuntu e outros sistemas baseados no Debian, use esses conteúdos de arquivo em vez disso:

   ```
   @include common-auth
   @include common-account
   @include common-session-noninteractive
   ```

3. Crie uma conta MySQL com o mesmo nome de usuário do sistema operacional e defina-a para autenticar usando o plugin PAM e o serviço PAM `mysql-unix`:

   ```
   CREATE USER 'antonio'@'localhost'
     IDENTIFIED WITH authentication_pam
     AS 'mysql-unix';
   GRANT ALL PRIVILEGES
     ON mydb.*
     TO 'antonio'@'localhost';
   ```

Aqui, a string de autenticação contém apenas o nome do serviço PAM, `mysql-unix`, que autentica senhas Unix.

4. Use o cliente de linha de comando **mysql** para se conectar ao servidor MySQL como `antonio`. Por exemplo:

   ```
   $> mysql --user=antonio --password --enable-cleartext-plugin
   Enter password: antonio_password
   ```

O servidor deve permitir a conexão e a seguinte consulta retorna o resultado conforme mostrado:

   ```
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-------------------+-------------------+--------------+
   | USER()            | CURRENT_USER()    | @@proxy_user |
   +-------------------+-------------------+--------------+
   | antonio@localhost | antonio@localhost | NULL         |
   +-------------------+-------------------+--------------+
   ```

Isso demonstra que o usuário do sistema operacional `antonio` está autenticado e tem os privilégios concedidos ao usuário `antonio` do MySQL, e que não houve nenhum proxying.

Nota

O plugin de autenticação `mysql_clear_password` do lado do cliente deixa a senha intocada, então os programas do cliente enviam-na para o servidor MySQL como texto claro. Isso permite que a senha seja passada como é para o PAM. Uma senha em texto claro é necessária para usar a biblioteca PAM do lado do servidor, mas pode ser um problema de segurança em algumas configurações. Essas medidas minimizam o risco:

* Para tornar menos provável o uso inadvertido do plugin `mysql_clear_password`, os clientes do MySQL devem habilitá-lo explicitamente (por exemplo, com a opção [[`--enable-cleartext-plugin`]). Veja a Seção 8.4.1.4, “Autenticação Cleartext Pluggable do Lado do Cliente”.

* Para evitar a exposição da senha com o plugin `mysql_clear_password` ativado, os clientes do MySQL devem se conectar ao servidor MySQL usando uma conexão criptografada. Veja a Seção 8.3.1, “Configurando o MySQL para usar conexões criptografadas”.

##### Autenticação PAM LDAP sem Proxy Usuários

Este cenário de autenticação utiliza o PAM para verificar usuários externos definidos em termos de nomes de usuário do sistema operacional e senhas LDAP, sem proxy. Cada usuário externo que é permitido conectar ao MySQL Server deve ter uma conta correspondente no MySQL que seja definida para usar autenticação PAM através do LDAP.

Para usar autenticação pluggable PAM LDAP para MySQL, esses pré-requisitos devem ser atendidos:

* Um servidor LDAP deve estar disponível para que o serviço PAM LDAP possa se comunicar.

* Cada usuário LDAP que deve ser autenticado pelo MySQL deve estar presente no diretório gerenciado pelo servidor LDAP.

Nota

Outra maneira de usar o LDAP para autenticação de usuários do MySQL é usar os plugins de autenticação específicos do LDAP. Veja a Seção 8.4.1.7, “Autenticação Pluggable LDAP”.

Configure o MySQL para autenticação PAM LDAP da seguinte forma:

1. Verifique se a autenticação Unix permite logins no sistema operacional com o nome de usuário `antonio` e senha *`antonio_password`*.

2. Configure o PAM para autenticar conexões do MySQL usando LDAP, criando um arquivo de serviço PAM `mysql-ldap`. O conteúdo do arquivo depende do sistema, então verifique os arquivos relacionados ao login existentes no diretório `/etc/pam.d` para ver como eles se parecem. No Linux, o arquivo `mysql-ldap` pode parecer assim:

   ```
   #%PAM-1.0
   auth        required    pam_ldap.so
   account     required    pam_ldap.so
   ```

Se os arquivos de objeto do PAM tiverem um sufixo diferente de `.so` no seu sistema, substitua o sufixo correto.

O formato do arquivo PAM pode diferir em alguns sistemas.

3. Crie uma conta MySQL com o mesmo nome de usuário do sistema operacional e defina-a para autenticar usando o plugin PAM e o serviço PAM `mysql-ldap`:

   ```
   CREATE USER 'antonio'@'localhost'
     IDENTIFIED WITH authentication_pam
     AS 'mysql-ldap';
   GRANT ALL PRIVILEGES
     ON mydb.*
     TO 'antonio'@'localhost';
   ```

Aqui, a string de autenticação contém apenas o nome do serviço PAM, `mysql-ldap`, que autentica usando LDAP.

4. Conectar ao servidor é o mesmo que descrito na Autenticação de senha do PAM Unix sem usuários Proxy.

##### Autenticação de senha PAM Unix com usuários proxy e mapeamento de grupos

O esquema de autenticação descrito aqui utiliza mapeamento de grupo PAM e proxy para mapear usuários do MySQL que se autenticam usando PAM em outros perfis do MySQL que definem diferentes conjuntos de privilégios. Os usuários não se conectam diretamente através das contas que definem os privilégios. Em vez disso, eles se conectam através de uma conta proxy padrão autenticada usando PAM, de modo que todos os usuários externos sejam mapeados para as contas do MySQL que possuem os privilégios. Qualquer usuário que se conecte usando a conta proxy é mapeado para uma dessas contas do MySQL, cujos privilégios determinam as operações de banco de dados permitidas ao usuário externo.

O procedimento mostrado aqui utiliza autenticação de senha Unix. Para usar o LDAP em vez disso, consulte os primeiros passos da Autenticação LDAP do PAM sem usuários de proxy.

Nota

As senhas tradicionais do Unix são verificadas usando o arquivo `/etc/shadow`. Para informações sobre possíveis problemas relacionados a este arquivo, consulte Autenticação de acesso à senha do Unix do PAM.

1. Verifique se a autenticação Unix permite logins no sistema operacional com o nome de usuário `antonio` e senha *`antonio_password`*.

2. Verifique se `antonio` é membro do grupo `root` ou `users` do PAM.

3. Configure o PAM para autenticar o serviço `mysql-unix` PAM através dos usuários do sistema operacional, criando um arquivo denominado `/etc/pam.d/mysql-unix`. O conteúdo do arquivo depende do sistema, então verifique os arquivos relacionados ao login existentes no diretório `/etc/pam.d` para ver como eles se parecem. No Linux, o arquivo `mysql-unix` pode parecer assim:

   ```
   #%PAM-1.0
   auth            include         password-auth
   account         include         password-auth
   ```

Para o macOS, use `login` em vez de `password-auth`.

O formato do arquivo PAM pode diferir em alguns sistemas. Por exemplo, em Ubuntu e outros sistemas baseados no Debian, use esses conteúdos de arquivo em vez disso:

   ```
   @include common-auth
   @include common-account
   @include common-session-noninteractive
   ```

4. Crie um usuário proxy padrão (`''@''`) que mapeie usuários externos do PAM para as contas proxy:

   ```
   CREATE USER ''@''
     IDENTIFIED WITH authentication_pam
     AS 'mysql-unix, root=developer, users=data_entry';
   ```

Aqui, a string de autenticação contém o nome do serviço PAM, `mysql-unix`, que autentica senhas Unix. A string de autenticação também mapeia usuários externos nos grupos PAM `root` e `users` para os nomes de usuário do MySQL `developer` e `data_entry`, respectivamente.

A lista de mapeamento do grupo PAM que segue o nome do serviço PAM é necessária quando você configura usuários proxy. Caso contrário, o plugin não consegue determinar como realizar o mapeamento de nomes de usuários externos para os nomes de usuário adequados do MySQL proxy.

Nota

Se a sua instalação do MySQL tiver usuários anônimos, eles podem entrar em conflito com o usuário proxy padrão. Para obter mais informações sobre esse problema e formas de lidar com ele, consulte Usuário Proxy Padrão e Conflitos de Usuários Anônimos.

5. Crie as contas proxy e conceda a cada uma delas os privilégios que ela deve ter:

   ```
   CREATE USER 'developer'@'localhost'
     IDENTIFIED WITH mysql_no_login;
   CREATE USER 'data_entry'@'localhost'
     IDENTIFIED WITH mysql_no_login;

   GRANT ALL PRIVILEGES
     ON mydevdb.*
     TO 'developer'@'localhost';
   GRANT ALL PRIVILEGES
     ON mydb.*
     TO 'data_entry'@'localhost';
   ```

As contas proxy utilizam o plugin de autenticação `mysql_no_login` para impedir que os clientes usem as contas para fazer login diretamente no servidor MySQL. Em vez disso, espera-se que os usuários que se autentiquem usando o PAM usem a conta `developer` ou `data_entry` por proxy com base em seu grupo PAM. (Isso pressupõe que o plugin esteja instalado. Para instruções, consulte a Seção 8.4.1.9, “Autenticação Pluggable sem Login”). Para métodos alternativos de proteção de contas proxy contra uso direto, consulte Prevenindo Login Direto em Contas Proxy.

6. Conceda ao `PROXY` o privilégio para cada conta proxy:

   ```
   GRANT PROXY
     ON 'developer'@'localhost'
     TO ''@'';
   GRANT PROXY
     ON 'data_entry'@'localhost'
     TO ''@'';
   ```

7. Use o cliente de linha de comando **mysql** para se conectar ao servidor MySQL como `antonio`.

   ```
   $> mysql --user=antonio --password --enable-cleartext-plugin
   Enter password: antonio_password
   ```

O servidor autentica a conexão usando a conta de proxy padrão `''@''`. Os privilégios resultantes para `antonio` dependem dos grupos PAM de que `antonio` é membro. Se `antonio` é membro do grupo PAM `root`, o plugin PAM mapeia `root` para o nome do usuário `developer` do MySQL e retorna esse nome para o servidor. O servidor verifica que `''@''` tem o privilégio `PROXY` para `developer` e permite a conexão. A seguinte consulta retorna o resultado conforme mostrado:

   ```
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-------------------+---------------------+--------------+
   | USER()            | CURRENT_USER()      | @@proxy_user |
   +-------------------+---------------------+--------------+
   | antonio@localhost | developer@localhost | ''@''        |
   +-------------------+---------------------+--------------+
   ```

Isso demonstra que o usuário do sistema operacional `antonio` está autenticado e tem os privilégios concedidos ao usuário `developer` do MySQL, e que a proxy ocorre através da conta de proxy padrão.

Se `antonio` não for membro do grupo `root` PAM, mas sim do grupo `users` PAM, um processo semelhante ocorre, mas o plugin mapeia a associação do grupo `user` PAM ao nome de usuário `data_entry` do MySQL e retorna esse nome para o servidor:

   ```
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-------------------+----------------------+--------------+
   | USER()            | CURRENT_USER()       | @@proxy_user |
   +-------------------+----------------------+--------------+
   | antonio@localhost | data_entry@localhost | ''@''        |
   +-------------------+----------------------+--------------+
   ```

Isso demonstra que o usuário do sistema operacional `antonio` está autenticado para ter os privilégios do usuário `data_entry` do MySQL, e que a proxy ocorre através da conta de proxy padrão.

Nota

O plugin de autenticação `mysql_clear_password` do lado do cliente deixa a senha intocada, então os programas do cliente enviam-na para o servidor MySQL como texto claro. Isso permite que a senha seja passada como é para o PAM. Uma senha em texto claro é necessária para usar a biblioteca PAM do lado do servidor, mas pode ser um problema de segurança em algumas configurações. Essas medidas minimizam o risco:

* Para tornar menos provável o uso inadvertido do plugin `mysql_clear_password`, os clientes do MySQL devem habilitá-lo explicitamente (por exemplo, com a opção [[`--enable-cleartext-plugin`]). Veja a Seção 8.4.1.4, “Autenticação Cleartext Pluggable do Lado do Cliente”.

* Para evitar a exposição da senha com o plugin `mysql_clear_password` ativado, os clientes do MySQL devem se conectar ao servidor MySQL usando uma conexão criptografada. Veja a Seção 8.3.1, “Configurando o MySQL para usar conexões criptografadas”.

##### Autenticação PAM Acesso ao armazenamento de senhas Unix

Em alguns sistemas, a autenticação Unix usa um banco de senhas, como `/etc/shadow`, um arquivo que geralmente tem permissões de acesso restritas. Isso pode fazer com que a autenticação baseada em PAM do MySQL falhe. Infelizmente, a implementação do PAM não permite distinguir entre "senha não pode ser verificada" (devido, por exemplo, à incapacidade de ler `/etc/shadow`) e "senha não corresponde". Se você está usando o banco de senhas Unix para autenticação PAM, você pode ser capaz de habilitar o acesso a ele no MySQL usando um dos seguintes métodos:

* Supondo que o servidor MySQL seja executado a partir da conta do sistema operacional `mysql`, coloque essa conta no grupo `shadow` que tem acesso ao `/etc/shadow`:

1. Crie um grupo `shadow` em `/etc/group`.

2. Adicione o usuário do sistema operacional `mysql` ao grupo `shadow` em `/etc/group`.

3. Atribua `/etc/group` ao grupo `shadow` e habilite a permissão de leitura do grupo:

     ```
     chgrp shadow /etc/shadow
     chmod g+r /etc/shadow
     ```

4. Reinicie o servidor MySQL.
* Se você estiver usando o módulo `pam_unix` e o utilitário **unix_chkpwd**, habilite o acesso ao armazenamento de senhas da seguinte forma:

  ```
  chmod u-s /usr/sbin/unix_chkpwd
  setcap cap_dac_read_search+ep /usr/sbin/unix_chkpwd
  ```

Ajuste o caminho para **unix_chkpwd** conforme necessário para sua plataforma.

##### Depuração da Autenticação PAM

O plugin de autenticação PAM verifica no momento da inicialização se o valor do ambiente `AUTHENTICATION_PAM_LOG` está definido. No MySQL 8.0.35 e versões anteriores, o valor não importa. Se assim for, o plugin habilita o registro de mensagens de diagnóstico na saída padrão. Essas mensagens podem ser úteis para depuração de problemas relacionados ao PAM que ocorrem quando o plugin realiza a autenticação. Você deve estar ciente de que, nessas versões, as senhas estão incluídas nessas mensagens.

Começando com o MySQL 8.0.36, definir `AUTHENTICATION_PAM_LOG=1` (ou algum outro valor arbitrário) produz as mesmas mensagens de diagnóstico, mas *não* inclui senhas. Se você deseja incluir senhas nessas mensagens, defina `AUTHENTICATION_PAM_LOG=PAM_LOG_WITH_SECRET_INFO`.

Algumas mensagens incluem referência aos arquivos de origem do plugin PAM e números de linha, o que permite que as ações do plugin sejam vinculadas mais estreitamente à localização no código onde elas ocorrem.

Outra técnica para depurar falhas de conexão e determinar o que está acontecendo durante as tentativas de conexão é configurar a autenticação PAM para permitir todas as conexões e, em seguida, verificar os arquivos de registro do sistema. Essa técnica deve ser usada apenas de forma *temporária* e não em um servidor de produção.

Configure um arquivo de serviço PAM com o nome `/etc/pam.d/mysql-any-password` com esses conteúdos (o formato pode diferir em alguns sistemas):

```
#%PAM-1.0
auth        required    pam_permit.so
account     required    pam_permit.so
```

Crie uma conta que utilize o plugin PAM e nomeie o serviço `mysql-any-password` PAM:

```
CREATE USER 'testuser'@'localhost'
  IDENTIFIED WITH authentication_pam
  AS 'mysql-any-password';
```

O arquivo de serviço `mysql-any-password` faz com que qualquer tentativa de autenticação retorne verdadeiro, mesmo para senhas incorretas. Se uma tentativa de autenticação falhar, isso indica que o problema de configuração está no lado do MySQL. Caso contrário, o problema está no lado do sistema operacional/PAM. Para ver o que pode estar acontecendo, verifique os arquivos de log do sistema, como `/var/log/secure`, `/var/log/audit.log`, `/var/log/syslog` ou `/var/log/messages`.

Após determinar qual é o problema, remova o arquivo de serviço `mysql-any-password` PAM para desabilitar o acesso com qualquer senha.

#### 8.4.1.6 Autenticação Conectada a Janela  
#### 8.4.1.6 Windows Pluggable Authentication

Nota

A autenticação plugável do Windows é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL para Windows suporta um método de autenticação que realiza autenticação externa no Windows, permitindo que o MySQL Server use serviços nativos do Windows para autenticar conexões de clientes. Usuários que se cadastraram no Windows podem se conectar ao servidor a partir de programas cliente do MySQL com base nas informações de seu ambiente, sem precisar especificar uma senha adicional.

O cliente e o servidor trocam pacotes de dados no aperto de autenticação. Como resultado dessa troca, o servidor cria um objeto de contexto de segurança que representa a identidade do cliente no sistema operacional Windows. Essa identidade inclui o nome da conta do cliente. A autenticação plugável do Windows usa a identidade do cliente para verificar se é uma conta específica ou um membro de um grupo. Por padrão, a negociação usa Kerberos para autenticação, e depois NTLM se o Kerberos estiver indisponível.

A autenticação plugável do Windows oferece essas capacidades:

* Autenticação externa: A autenticação do Windows permite que o MySQL Server aceite conexões de usuários definidos fora das tabelas de concessão do MySQL que se cadastrarem no Windows.

* Suporte ao usuário proxy: A autenticação do Windows pode retornar um nome de usuário diferente do nome de usuário externo passado pelo programa cliente para o MySQL. Isso significa que o plugin pode retornar o usuário MySQL que define os privilégios que o usuário autenticado pelo Windows externo deve ter. Por exemplo, um usuário do Windows com o nome `joe` pode se conectar e ter os privilégios de um usuário MySQL com o nome `developer`.

A tabela a seguir mostra os nomes dos arquivos de plugin e biblioteca. O arquivo deve estar localizado no diretório nomeado pela variável de sistema `plugin_dir`.

**Tabela 8.21 Nomes de plugins e bibliotecas para autenticação do Windows**

<table summary="Names for the plugins and library file used for Windows password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>authentication_windows</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>authentication_windows_client</code></td> </tr><tr> <td>Library file</td> <td><code>authentication_windows.dll</code></td> </tr></tbody></table>

O arquivo da biblioteca inclui apenas o plugin do lado do servidor. O plugin do lado do cliente é incorporado à biblioteca do cliente `libmysqlclient`.

O plugin de autenticação do lado do servidor do Windows é incluído apenas na Edição Empresarial do MySQL. Não é incluído nas distribuições comunitárias do MySQL. O plugin do lado do cliente é incluído em todas as distribuições, incluindo as distribuições comunitárias. Isso permite que clientes de qualquer distribuição se conectem a um servidor que tenha o plugin do lado do servidor carregado.

As seções a seguir fornecem informações de instalação e uso específicas para autenticação plugável do Windows:

* Instalar Autenticação Pluggable do Windows * Desinstalar Autenticação Pluggable do Windows * Usar Autenticação Pluggable do Windows

Para informações gerais sobre autenticação conectada no MySQL, consulte a Seção 8.2.17, “Autenticação Conectada”. Para informações sobre usuários proxy, consulte a Seção 8.2.19, “Usuários Proxy”.

##### Instalação do Windows Pluggable Authentication

Esta seção descreve como instalar o plugin de autenticação do Windows no lado do servidor. Para informações gerais sobre a instalação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para ser utilizável pelo servidor, o arquivo da biblioteca de plugins deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin, definindo o valor de `plugin_dir` na inicialização do servidor.

Para carregar o plugin no início da inicialização do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com este método de carregamento de plugins, a opção deve ser dada toda vez que o servidor é iniciado. Por exemplo, coloque essas linhas no arquivo do servidor `my.cnf`:

```
[mysqld]
plugin-load-add=authentication_windows.dll
```

Após modificar `my.cnf`, reinicie o servidor para que as novas configurações sejam aplicadas.

Como alternativa, para carregar o plugin no tempo de execução, use esta declaração:

```
INSTALL PLUGIN authentication_windows SONAME 'authentication_windows.dll';
```

`INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela do sistema `mysql.plugins`, fazendo com que o servidor o carregue para cada inicialização normal subsequente, sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 7.6.2, “Obtenção de Informações do Plugin do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%windows%';
+------------------------+---------------+
| PLUGIN_NAME            | PLUGIN_STATUS |
+------------------------+---------------+
| authentication_windows | ACTIVE        |
+------------------------+---------------+
```

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

Para associar contas do MySQL ao plugin de autenticação do Windows, consulte o uso do plugin de autenticação compatível com o Windows. O controle adicional do plugin é fornecido pelas variáveis de sistema `authentication_windows_use_principal_name` e `authentication_windows_log_level`. Veja a Seção 7.1.8, “Variáveis do sistema do servidor”.

##### Desinstalando o Windows Pluggable Authentication

O método usado para desinstalar o plugin de autenticação do Windows depende de como você o instalou:

* Se você instalou o plugin na inicialização do servidor usando uma opção `--plugin-load-add`, reinicie o servidor sem a opção.

* Se você instalou o plugin em tempo de execução usando uma declaração `INSTALL PLUGIN`, ele permanece instalado mesmo após a reinicialização do servidor. Para desinstalá-lo, use `UNINSTALL PLUGIN`:

  ```
  UNINSTALL PLUGIN authentication_windows;
  ```

Além disso, remova todas as opções de inicialização que definem variáveis de sistema relacionadas a plugins do Windows.

##### Usando a Autenticação Plugável do Windows

O plugin de autenticação do Windows suporta o uso de contas MySQL, de modo que os usuários que se cadastraram no Windows podem se conectar ao servidor MySQL sem precisar especificar uma senha adicional. Assume-se que o servidor esteja em execução com o plugin do lado do servidor habilitado, conforme descrito em Instalar Pluggable Authentication do Windows. Uma vez que o DBA tenha habilitado o plugin do lado do servidor e configurado contas para usá-lo, os clientes podem se conectar usando essas contas sem nenhuma outra configuração necessária por parte deles.

Para se referir ao plugin de autenticação do Windows na cláusula `IDENTIFIED WITH` de uma declaração `CREATE USER`, use o nome `authentication_windows`. Suponha que os usuários do Windows `Rafal` e `Tasha` devam ser permitidos para se conectar ao MySQL, assim como quaisquer usuários no grupo `Administrators` ou `Power Users`. Para configurar isso, crie uma conta MySQL com o nome `sql_admin` que use o plugin do Windows para autenticação:

```
CREATE USER sql_admin
  IDENTIFIED WITH authentication_windows
  AS 'Rafal, Tasha, Administrators, "Power Users"';
```

O nome do plugin é `authentication_windows`. A string que segue a palavra-chave `AS` é a string de autenticação. Especifica que os usuários do Windows com os nomes `Rafal` ou `Tasha` têm permissão para se autenticar no servidor como o usuário MySQL `sql_admin`, assim como qualquer usuário do Windows no grupo `Administrators` ou `Power Users`. O nome do grupo deste último contém um espaço, então ele deve ser citado com caracteres de aspas duplas.

Depois de criar a conta `sql_admin`, um usuário que tenha iniciado sessão no Windows pode tentar se conectar ao servidor usando essa conta:

```
C:\> mysql --user=sql_admin
```

Não é necessário fornecer uma senha aqui. O plugin `authentication_windows` usa a API de segurança do Windows para verificar qual usuário do Windows está se conectando. Se esse usuário for chamado de `Rafal` ou `Tasha`, ou for membro do grupo `Administrators` ou `Power Users`, o servidor concede acesso e o cliente é autenticado como `sql_admin` e possui quaisquer privilégios concedidos à conta `sql_admin`. Caso contrário, o servidor nega o acesso.

A sintaxe da string de autenticação para o plugin de autenticação do Windows segue estas regras:

* A cadeia consiste em um ou mais mapeamentos de usuário separados por vírgulas.

* Cada mapeamento de usuário associa um nome de usuário ou grupo do Windows com um nome de usuário do MySQL:

  ```
  win_user_or_group_name=mysql_user_name
  win_user_or_group_name
  ```

Para a sintaxe do último caso, sem o valor *`mysql_user_name`*, o valor implícito é o usuário MySQL criado pela declaração `CREATE USER`. Assim, essas declarações são equivalentes:

  ```
  CREATE USER sql_admin
    IDENTIFIED WITH authentication_windows
    AS 'Rafal, Tasha, Administrators, "Power Users"';

  CREATE USER sql_admin
    IDENTIFIED WITH authentication_windows
    AS 'Rafal=sql_admin, Tasha=sql_admin, Administrators=sql_admin,
        "Power Users"=sql_admin';
  ```

* Cada caractere barra invertida (`\`) em um valor deve ser duplicado, pois a barra invertida é o caractere de escape em strings do MySQL.

* Espaços principais e finais que não estão dentro de aspas duplas são ignorados.

Os valores *`win_user_or_group_name`* e *`mysql_user_name`* não citados podem conter qualquer coisa, exceto sinal de igual, vírgula ou espaço.

* Se um valor de *`win_user_or_group_name`* e ou *`mysql_user_name`* for citado com aspas duplas, tudo entre as aspas faz parte do valor. Isso é necessário, por exemplo, se o nome contiver caracteres de espaço. Todos os caracteres dentro das aspas são legais, exceto as aspas duplas e a barra invertida. Para incluir qualquer um desses caracteres, escape-o com uma barra invertida.

* Os valores de *`win_user_or_group_name`* utilizam sintaxe convencional para princípios do Windows, locais ou em um domínio. Exemplos (note a duplicação de barras invertidas):

  ```
  domain\\user
  .\\user
  domain\\group
  .\\group
  BUILTIN\\WellKnownGroup
  ```

Quando invocado pelo servidor para autenticar um cliente, o plugin examina a string de autenticação de esquerda para direita em busca de um usuário ou grupo que corresponda ao usuário do Windows. Se houver uma correspondência, o plugin retorna o *`mysql_user_name`* correspondente ao servidor MySQL. Se não houver correspondência, a autenticação falha.

Uma correspondência de nome de usuário prevalece sobre uma correspondência de nome de grupo. Suponha que o usuário do Windows com o nome `win_user` seja membro de `win_group` e que a string de autenticação pareça assim:

```
'win_group = sql_user1, win_user = sql_user2'
```

Quando o `win_user` se conecta ao servidor MySQL, há uma correspondência tanto para `win_group` quanto para `win_user`. O plugin autentica o usuário como `sql_user2`, porque a correspondência de usuário mais específica tem precedência sobre a correspondência de grupo, mesmo que o grupo esteja listado primeiro na string de autenticação.

A autenticação do Windows sempre funciona para conexões do mesmo computador em que o servidor está sendo executado. Para conexões entre computadores, ambos os computadores devem estar registrados no Microsoft Active Directory. Se estiverem no mesmo domínio do Windows, não é necessário especificar um nome de domínio. Também é possível permitir conexões de um domínio diferente, como neste exemplo:

```
CREATE USER sql_accounting
  IDENTIFIED WITH authentication_windows
  AS 'SomeDomain\\Accounting';
```

Aqui `SomeDomain` é o nome do outro domínio. O caractere barra invertida é duplicado porque é o caractere de escape MySQL dentro das strings.

O MySQL suporta o conceito de usuários proxy, onde um cliente pode se conectar e autenticar no servidor MySQL usando uma conta, mas, enquanto conectado, possui os privilégios de outra conta (veja Seção 8.2.19, “Usuários Proxy”). Suponha que você queira que os usuários do Windows se conectem usando um único nome de usuário, mas sejam mapeados com base em seus nomes de usuário e grupos do Windows em contas específicas do MySQL da seguinte forma:

* Os usuários locais e de domínio `local_user` e `MyDomain\domain_user` do Windows devem ser mapeados para a conta `local_wlad` do MySQL.

* Os usuários do grupo de domínio `MyDomain\Developers` devem ser mapeados para a conta MySQL `local_dev`.

* Os administradores de máquinas locais devem mapear para a conta `local_admin` do MySQL.

Para configurar isso, crie uma conta proxy para os usuários do Windows para se conectarem e configure essa conta para que os usuários e grupos sejam mapeados para as contas apropriadas do MySQL (`local_wlad`, `local_dev`, `local_admin`). Além disso, conceda às contas do MySQL os privilégios apropriados às operações que elas precisam realizar. As instruções a seguir usam `win_proxy` como conta proxy e `local_wlad`, `local_dev` e `local_admin` como contas proxy.

1. Crie a conta do proxy MySQL:

   ```
   CREATE USER win_proxy
     IDENTIFIED WITH  authentication_windows
     AS 'local_user = local_wlad,
         MyDomain\\domain_user = local_wlad,
         MyDomain\\Developers = local_dev,
         BUILTIN\\Administrators = local_admin';
   ```

2. Para que o proxy funcione, as contas proxy devem existir, então crie-as:

   ```
   CREATE USER local_wlad
     IDENTIFIED WITH mysql_no_login;
   CREATE USER local_dev
     IDENTIFIED WITH mysql_no_login;
   CREATE USER local_admin
     IDENTIFIED WITH mysql_no_login;
   ```

As contas proxy utilizam o plugin de autenticação `mysql_no_login` para impedir que os clientes usem as contas para fazer login diretamente no servidor MySQL. Em vez disso, espera-se que os usuários que se autentiquem usando o Windows usem a conta proxy `win_proxy`. (Isso pressupõe que o plugin esteja instalado. Para instruções, consulte a Seção 8.4.1.9, “Autenticação Pluggable sem Login”.) Para métodos alternativos de proteção de contas proxy contra uso direto, consulte Prevenindo Login Direto em Contas Proxy.

Você também deve executar as instruções `GRANT` (não mostrada) que concedem a cada conta proxy os privilégios necessários para o acesso ao MySQL.

3. Conceda ao `PROXY` o privilégio para cada conta proxy:

   ```
   GRANT PROXY ON local_wlad TO win_proxy;
   GRANT PROXY ON local_dev TO win_proxy;
   GRANT PROXY ON local_admin TO win_proxy;
   ```

Agora, os usuários do Windows `local_user` e `MyDomain\domain_user` podem se conectar ao servidor MySQL como `win_proxy` e, quando autenticados, têm os privilégios da conta fornecida na string de autenticação (neste caso, `local_wlad`). Um usuário no grupo `MyDomain\Developers` que se conecta como `win_proxy` tem os privilégios da conta `local_dev`. Um usuário no grupo `BUILTIN\Administrators` tem os privilégios da conta `local_admin`.

Para configurar a autenticação de modo que todos os usuários do Windows que não possuem sua própria conta MySQL passem por uma conta proxy, substitua a conta proxy padrão (`''@''`) por `win_proxy` nas instruções anteriores. Para informações sobre contas de proxy padrão, consulte a Seção 8.2.19, “Usuários de Proxy”.

Nota

Se a sua instalação do MySQL tiver usuários anônimos, eles podem entrar em conflito com o usuário proxy padrão. Para obter mais informações sobre esse problema e formas de lidar com ele, consulte Usuário Proxy Padrão e Conflitos de Usuários Anônimos.

Para usar o plugin de autenticação do Windows com as cadeias de conexão do Connector/NET no Connector/NET 8.0 e superior, consulte Autenticação do Connector/NET.

#### 8.4.1.7 Autenticação Pluggable LDAP

Nota

A autenticação conectada LDAP é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL suporta um método de autenticação que permite ao MySQL Server usar o LDAP (Lightweight Directory Access Protocol) para autenticar usuários do MySQL acessando serviços de diretório, como X.500. O MySQL usa o LDAP para obter informações de usuário, credenciais e grupos.

A autenticação conectada ao LDAP oferece essas capacidades:

* Autenticação externa: a autenticação LDAP permite que o MySQL Server aceite conexões de usuários definidos fora das tabelas de concessão do MySQL em diretórios LDAP.

* Suporte de usuário proxy: a autenticação LDAP pode retornar ao MySQL um nome de usuário diferente do nome de usuário externo passado pelo programa cliente, com base nos grupos LDAP dos quais o usuário externo é membro. Isso significa que um plugin LDAP pode retornar o usuário MySQL que define os privilégios que o usuário externo autenticado pelo LDAP deve ter. Por exemplo, um usuário LDAP com o nome `joe` pode se conectar e ter os privilégios de um usuário MySQL com o nome `developer`, se o grupo LDAP para `joe` for `developer`.

* Segurança: O uso do TLS permite que as conexões ao servidor LDAP sejam seguras.

Os plugins de servidor e cliente estão disponíveis para autenticação LDAP simples e baseada em SASL. No Microsoft Windows, o plugin de servidor para autenticação LDAP baseada em SASL não é suportado, mas o plugin de cliente é.

As tabelas a seguir mostram os nomes dos arquivos de plugin e biblioteca para autenticação LDAP simples e baseada em SASL. O sufixo do nome do arquivo pode diferir no seu sistema. Os arquivos devem estar localizados no diretório nomeado pela variável de sistema `plugin_dir`.

**Tabela 8.22 Nomes de plugins e bibliotecas para autenticação LDAP simples**

<table summary="Names for the plugins and library file used for simple LDAP password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin ou arquivo</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Nome do plugin no lado do servidor</td> <td><code>authentication_ldap_simple</code></td> </tr><tr> <td>Nome do plugin do lado do cliente</td> <td><code>mysql_clear_password</code></td> </tr><tr> <td>Nome do arquivo da biblioteca</td> <td><code>authentication_ldap_simple.so</code></td> </tr></tbody></table>

**Tabela 8.23 Nomes de plugins e bibliotecas para autenticação LDAP baseada em SASL**

<table summary="Names for the plugins and library file used for SASL-based LDAP password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin ou arquivo</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Nome do plugin no lado do servidor</td> <td><code>authentication_ldap_sasl</code></td> </tr><tr> <td>Nome do plugin do lado do cliente</td> <td><code>authentication_ldap_sasl_client</code></td> </tr><tr> <td>Nomes de arquivos da biblioteca</td> <td><code>authentication_ldap_sasl.so</code>, <code>authentication_ldap_sasl_client.so</code></td> </tr></tbody></table>

Os arquivos da biblioteca incluem apenas os plugins de autenticação `authentication_ldap_XXX`. O plugin `mysql_clear_password` do lado do cliente é incorporado à biblioteca do cliente `libmysqlclient`.

Cada plugin LDAP do lado do servidor funciona com um plugin específico do lado do cliente:

* O plugin `authentication_ldap_simple` do lado do servidor realiza autenticação LDAP simples. Para conexões por contas que utilizam este plugin, os programas cliente utilizam o plugin `mysql_clear_password` do lado do cliente, que envia a senha para o servidor como texto claro. Não é usada a codificação ou criptografia de senha, portanto, uma conexão segura entre o cliente e o servidor MySQL é recomendada para evitar a exposição da senha.

* O plugin `authentication_ldap_sasl` do lado do servidor realiza autenticação LDAP baseada em SASL. Para conexões por contas que utilizam este plugin, os programas cliente utilizam o plugin `authentication_ldap_sasl_client` do lado do cliente. Os plugins SASL LDAP do lado do cliente e do servidor utilizam mensagens SASL para transmissão segura de credenciais dentro do protocolo LDAP, para evitar o envio da senha em texto claro entre o cliente e o servidor MySQL.

Nota

Em Microsoft Windows, o plugin do servidor para autenticação LDAP baseada em SASL não é suportado, mas o plugin do cliente é suportado. Em outras plataformas, os plugins do servidor e do cliente são suportados.

Os plugins de autenticação LDAP do lado do servidor estão incluídos apenas na Edição Empresarial do MySQL. Eles não estão incluídos nas distribuições comunitárias do MySQL. O plugin SASL LDAP do lado do cliente está incluído em todas as distribuições, incluindo as distribuições comunitárias, e, como mencionado anteriormente, o plugin `mysql_clear_password` do lado do cliente está integrado à biblioteca do cliente `libmysqlclient`, que também está incluída em todas as distribuições. Isso permite que clientes de qualquer distribuição se conectem a um servidor que tenha o plugin do lado do servidor apropriado carregado.

As seções a seguir fornecem informações de instalação e uso específicas para autenticação plugável LDAP:

* Pré-requisitos para Autenticação Pluggable LDAP
* Como a Autenticação LDAP de Usuários do MySQL Funciona
* Instalação da Autenticação Pluggable LDAP
* Desinstalação da Autenticação Pluggable LDAP
* Autenticação Pluggable LDAP e ldap.conf
* Uso da Autenticação Pluggable LDAP
* Autenticação LDAP Simples (Sem Proxy)")
* Autenticação LDAP Baseada em SASL (Sem Proxy)")
* Autenticação LDAP com Proxy
* Especificação da Preferência e Mapeamento do Grupo de Autenticação LDAP
* Sufixos de DN do Usuário de Autenticação LDAP
* Métodos de Autenticação LDAP
* O Método de Autenticação GSSAPI/Kerberos
* Referência de Pesquisa LDAP

Para informações gerais sobre autenticação plugável no MySQL, consulte a Seção 8.2.17, “Autenticação Plugável”. Para informações sobre o plugin `mysql_clear_password`, consulte a Seção 8.4.1.4, “Autenticação de Texto Aberto Plugável do Lado do Cliente”. Para informações sobre informações de usuário do proxy, consulte a Seção 8.2.19, “Usuários do Proxy”.

Nota

Se o seu sistema suporta o PAM e permite o LDAP como método de autenticação PAM, outra maneira de usar o LDAP para autenticação de usuários do MySQL é usar o plugin `authentication_pam` do lado do servidor. Veja a Seção 8.4.1.5, “Autenticação Plugável PAM”.

##### Pré-requisitos para autenticação compatível com LDAP

Para usar autenticação de plugue LDAP para MySQL, esses pré-requisitos devem ser atendidos:

* Um servidor LDAP deve estar disponível para que os plugins de autenticação LDAP possam se comunicar.

* Os usuários LDAP que devem ser autenticados pelo MySQL devem estar presentes no diretório gerenciado pelo servidor LDAP.

* Uma biblioteca de clientes LDAP deve estar disponível nos sistemas onde o plugin `authentication_ldap_sasl` ou `authentication_ldap_simple` do lado do servidor é utilizado. Atualmente, as bibliotecas suportadas são a biblioteca nativa LDAP do Windows ou a biblioteca OpenLDAP em sistemas que não são do Windows.

* Para usar autenticação LDAP baseada em SASL:

+ O servidor LDAP deve ser configurado para se comunicar com um servidor SASL.

+ Uma biblioteca de cliente SASL deve estar disponível em sistemas onde o plugin `authentication_ldap_sasl_client` do lado do cliente é usado. Atualmente, a única biblioteca compatível é a biblioteca Cyrus SASL.

+ Para usar um método de autenticação SASL específico, todos os outros serviços necessários para esse método devem estar disponíveis. Por exemplo, para usar GSSAPI/Kerberos, uma biblioteca GSSAPI e serviços Kerberos devem estar disponíveis.

##### Como a Autenticação LDAP de Usuários do MySQL Funciona

Esta seção fornece uma visão geral de como o MySQL e o LDAP trabalham juntos para autenticar usuários do MySQL. Para exemplos que mostram como configurar contas do MySQL para usar plugins de autenticação específicos do LDAP, consulte Usando plugins de autenticação legíveis. Para informações sobre os métodos de autenticação disponíveis para os plugins do LDAP, consulte Métodos de autenticação do LDAP.

O cliente se conecta ao servidor MySQL, fornecendo o nome de usuário do cliente do MySQL e uma senha:

* Para autenticação simples LDAP, os plugins do lado do cliente e do lado do servidor comunicam a senha como texto claro. Uma conexão segura entre o cliente e o servidor MySQL é recomendada para evitar a exposição da senha.

* Para autenticação LDAP baseada em SASL, os plugins do lado do cliente e do lado do servidor evitam enviar a senha em texto claro entre o cliente e o servidor MySQL. Por exemplo, os plugins podem usar mensagens SASL para transmissão segura de credenciais dentro do protocolo LDAP. Para o método de autenticação GSSAPI, os plugins do lado do cliente e do lado do servidor comunicam-se de forma segura usando Kerberos sem usar diretamente mensagens LDAP.

Se o nome de usuário do cliente e o nome do host não corresponderem a nenhuma conta MySQL, a conexão é rejeitada.

Se houver uma conta correspondente no MySQL, a autenticação ocorre contra o LDAP. O servidor LDAP procura uma entrada que corresponda ao usuário e autentica a entrada contra a senha do LDAP:

* Se a conta MySQL nomear o nome de distintivo do usuário LDAP (DN), a autenticação LDAP usa esse valor e a senha LDAP fornecida pelo cliente. (Para associar um DN de usuário LDAP a uma conta MySQL, inclua uma cláusula `BY` que especifique uma string de autenticação na declaração [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") que cria a conta.)

* Se a conta MySQL não indicar um DN de usuário LDAP, a autenticação LDAP usa o nome do usuário e a senha LDAP fornecidos pelo cliente. Neste caso, o plugin de autenticação primeiro se vincula ao servidor LDAP usando o DN raiz e a senha como credenciais para encontrar o DN do usuário com base no nome do usuário do cliente, e depois autentica esse DN do usuário contra a senha LDAP. Esse vínculo usando as credenciais de raiz falha se o DN raiz e a senha forem configurados com valores incorretos ou estiverem vazios (não configurados) e o servidor LDAP não permitir conexões anônimas.

Se o servidor LDAP não encontrar nenhuma correspondência ou múltiplas correspondências, a autenticação falha e a conexão do cliente é rejeitada.

Se o servidor LDAP encontrar uma única correspondência, a autenticação LDAP é bem-sucedida (assumindo que a senha está correta), o servidor LDAP retorna a entrada LDAP, e o plugin de autenticação determina o nome do usuário autenticado com base nessa entrada:

* Se a entrada LDAP tiver um atributo de grupo (por padrão, o atributo `cn`, o plugin retorna seu valor como o nome do usuário autenticado.

* Se a entrada LDAP não tiver nenhum atributo de grupo, o plugin de autenticação retorna o nome do usuário do cliente como o nome do usuário autenticado.

O servidor MySQL compara o nome do usuário do cliente com o nome do usuário autenticado para determinar se ocorre o encaminhamento para a sessão do cliente:

* Se os nomes forem os mesmos, não ocorre proxeamento: A conta do MySQL que corresponde ao nome do usuário do cliente é usada para verificação de privilégios.

* Se os nomes forem diferentes, ocorre a proxy: o MySQL procura uma conta que corresponda ao nome do usuário autenticado. Essa conta se torna o usuário proxy, que é usado para verificação de privilégios. A conta do MySQL que correspondeu ao nome do usuário do cliente é tratada como o usuário proxy externo.

##### Instalação do LDAP Pluggable Authentication

Esta seção descreve como instalar os plugins de autenticação LDAP do lado do servidor. Para informações gerais sobre a instalação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para ser utilizável pelo servidor, os arquivos da biblioteca de plugins devem estar localizados no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin, definindo o valor de `plugin_dir` na inicialização do servidor.

Os nomes de arquivo da biblioteca de plugins do lado do servidor são `authentication_ldap_simple` e `authentication_ldap_sasl`. O sufixo do nome do arquivo difere por plataforma (por exemplo, `.so` para Unix e sistemas semelhantes ao Unix, `.dll` para Windows).

Nota

No Microsoft Windows, o plugin do servidor para autenticação LDAP baseada em SASL não é suportado, mas o plugin do cliente é suportado. Em outras plataformas, os plugins do servidor e do cliente são suportados.

Para carregar os plugins na inicialização do servidor, use as opções `--plugin-load-add` para nomear os arquivos da biblioteca que os contêm. Com esse método de carregamento de plugins, as opções devem ser fornecidas toda vez que o servidor é iniciado. Além disso, especifique valores para quaisquer variáveis de sistema fornecidas pelo plugin que você deseja configurar.

Cada plugin LDAP do lado do servidor expõe um conjunto de variáveis do sistema que permitem que sua operação seja configurada. Definir a maioria dessas variáveis é opcional, mas você deve definir as variáveis que especificam o host do servidor LDAP (para que o plugin saiba onde se conectar) e o nome distinguido de base para operações de vinculação LDAP (para limitar o escopo das pesquisas e obter pesquisas mais rápidas). Para obter detalhes sobre todas as variáveis do sistema LDAP, consulte a Seção 8.4.1.13, “Variáveis do Sistema de Autenticação Conectada”.

Para carregar os plugins e definir o host do servidor LDAP e o nome distinto base para operações de vinculação LDAP, coloque linhas como estas no seu arquivo `my.cnf`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
[mysqld]
plugin-load-add=authentication_ldap_simple.so
authentication_ldap_simple_server_host=127.0.0.1
authentication_ldap_simple_bind_base_dn="dc=example,dc=com"
plugin-load-add=authentication_ldap_sasl.so
authentication_ldap_sasl_server_host=127.0.0.1
authentication_ldap_sasl_bind_base_dn="dc=example,dc=com"
```

Após modificar `my.cnf`, reinicie o servidor para que as novas configurações sejam aplicadas.

Como alternativa, para carregar os plugins no tempo de execução, use essas declarações, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
INSTALL PLUGIN authentication_ldap_simple
  SONAME 'authentication_ldap_simple.so';
INSTALL PLUGIN authentication_ldap_sasl
  SONAME 'authentication_ldap_sasl.so';
```

`INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela do sistema `mysql.plugins`, fazendo com que o servidor o carregue para cada inicialização normal subsequente, sem a necessidade de `--plugin-load-add`.

Após instalar os plugins no tempo de execução, as variáveis de sistema que eles exibem ficam disponíveis e você pode adicionar configurações para eles ao seu arquivo `my.cnf` para configurar os plugins para reinicializações subsequentes. Por exemplo:

```
[mysqld]
authentication_ldap_simple_server_host=127.0.0.1
authentication_ldap_simple_bind_base_dn="dc=example,dc=com"
authentication_ldap_sasl_server_host=127.0.0.1
authentication_ldap_sasl_bind_base_dn="dc=example,dc=com"
```

Após modificar `my.cnf`, reinicie o servidor para que as novas configurações sejam aplicadas.

Para definir e persistir cada valor no tempo de execução, em vez de na inicialização, use essas declarações:

```
SET PERSIST authentication_ldap_simple_server_host='127.0.0.1';
SET PERSIST authentication_ldap_simple_bind_base_dn='dc=example,dc=com';
SET PERSIST authentication_ldap_sasl_server_host='127.0.0.1';
SET PERSIST authentication_ldap_sasl_bind_base_dn='dc=example,dc=com';
```

`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") define um valor para a instância MySQL em execução. Também salva o valor, fazendo com que ele seja carregado em reinicializações subsequentes do servidor. Para alterar um valor para a instância MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`. Veja a Seção 15.7.6.1, “Sintaxe SET para atribuição de variáveis”.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 7.6.2, “Obtenção de Informações do Plugin do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%ldap%';
+----------------------------+---------------+
| PLUGIN_NAME                | PLUGIN_STATUS |
+----------------------------+---------------+
| authentication_ldap_sasl   | ACTIVE        |
| authentication_ldap_simple | ACTIVE        |
+----------------------------+---------------+
```

Se um plugin não conseguir se inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

Para associar contas do MySQL a um plugin LDAP, consulte o uso de autenticação compatível com LDAP.

Observações adicionais para SELinux

Em sistemas que executam EL6 ou EL e que possuem SELinux habilitado, são necessárias alterações nas políticas do SELinux para permitir que os plugins MySQL LDAP comuniquem com o serviço LDAP:

1. Crie um arquivo `mysqlldap.te` com o seguinte conteúdo:

   ```
   module mysqlldap 1.0;

   require {
           type ldap_port_t;
           type mysqld_t;
           class tcp_socket name_connect;
   }

   #============= mysqld_t ==============

   allow mysqld_t ldap_port_t:tcp_socket name_connect;
   ```

2. Compile o módulo de política de segurança em uma representação binária:

   ```
   checkmodule -M -m mysqlldap.te -o mysqlldap.mod
   ```

3. Crie um pacote de módulo de política SELinux:

   ```
   semodule_package -m mysqlldap.mod  -o mysqlldap.pp
   ```

4. Instale o pacote do módulo:

   ```
   semodule -i mysqlldap.pp
   ```

5. Quando as alterações nas políticas SELinux forem feitas, reinicie o servidor MySQL:

   ```
   service mysqld restart
   ```

##### Desinstalando LDAP Pluggable Authentication

O método usado para desinstalar os plugins de autenticação LDAP depende de como você os instalou:

* Se você instalou os plugins na inicialização do servidor usando as opções `--plugin-load-add`, reinicie o servidor sem essas opções.

* Se você instalou os plugins em tempo de execução usando `INSTALL PLUGIN`, eles permanecem instalados após a reinicialização do servidor. Para desinstalá-los, use `UNINSTALL PLUGIN`:

  ```
  UNINSTALL PLUGIN authentication_ldap_simple;
  UNINSTALL PLUGIN authentication_ldap_sasl;
  ```

Além disso, remova do seu arquivo `my.cnf` todas as opções de inicialização que definem variáveis de sistema relacionadas ao plugin LDAP. Se você usou `SET PERSIST` para persistir variáveis de sistema LDAP, use `RESET PERSIST` para remover as configurações.

##### LDAP Pluggable Authentication e ldap.conf

Para instalações que utilizam OpenLDAP, o arquivo `ldap.conf` fornece configurações globais para clientes LDAP. As opções podem ser definidas neste arquivo para afetar os clientes LDAP, incluindo os plugins de autenticação LDAP. O OpenLDAP utiliza as opções de configuração nesta ordem de precedência:

* Configuração especificada pelo cliente LDAP. * Configuração especificada no arquivo `ldap.conf`. Para desabilitar o uso deste arquivo, defina a variável de ambiente `LDAPNOINIT`.

* Definições padrão da biblioteca OpenLDAP embutida.

Se a biblioteca não fornecer valores adequados para os valores de `ldap.conf` ou se os valores de `ldap.conf` não fornecem valores adequados para as opções, um plugin de autenticação LDAP pode ser capaz de definir variáveis relacionadas para afetar a configuração LDAP diretamente. Por exemplo, os plugins LDAP podem substituir `ldap.conf` para parâmetros como estes:

* Configuração TLS: As variáveis do sistema estão disponíveis para habilitar o TLS e controlar a configuração da CA, como `authentication_ldap_simple_tls` e `authentication_ldap_simple_ca_path` para autenticação LDAP simples, e `authentication_ldap_sasl_tls` e `authentication_ldap_sasl_ca_path` para autenticação LDAP SASL.

* Referência LDAP. Veja Referência de Pesquisa LDAP.

Para mais informações sobre `ldap.conf`, consulte a página de manual `ldap.conf(5)`.

##### Uso do LDAP Pluggable Authentication

Esta seção descreve como habilitar contas do MySQL para se conectarem ao servidor MySQL usando autenticação pluggable do LDAP. Assume-se que o servidor esteja em execução com os plugins apropriados habilitados do lado do servidor, conforme descrito em Instalar Autenticação Pluggable do LDAP, e que os plugins apropriados do lado do cliente estejam disponíveis no host do cliente.

Esta seção não descreve a configuração ou administração do LDAP. Você é suposto estar familiarizado com esses tópicos.

Os dois plugins LDAP do lado do servidor trabalham cada um com um plugin específico do lado do cliente:

* O plugin `authentication_ldap_simple` do lado do servidor realiza autenticação LDAP simples. Para conexões por contas que utilizam este plugin, os programas cliente utilizam o plugin `mysql_clear_password` do lado do cliente, que envia a senha para o servidor como texto claro. Não é usada a codificação ou criptografia de senha, portanto, uma conexão segura entre o cliente e o servidor MySQL é recomendada para evitar a exposição da senha.

* O plugin `authentication_ldap_sasl` do lado do servidor realiza autenticação LDAP baseada em SASL. Para conexões por contas que utilizam este plugin, os programas cliente utilizam o plugin `authentication_ldap_sasl_client` do lado do cliente. Os plugins SASL LDAP do lado do cliente e do servidor utilizam mensagens SASL para transmissão segura de credenciais dentro do protocolo LDAP, para evitar o envio da senha em texto claro entre o cliente e o servidor MySQL.

Requisitos gerais para autenticação LDAP de usuários do MySQL:

* Deve haver uma entrada de diretório LDAP para cada usuário que será autenticado.

* Deve haver uma conta de usuário do MySQL que especifique um plugin de autenticação LDAP do lado do servidor e, opcionalmente, nomeie o nome distinguido do usuário (DN) associado ao LDAP. (Para associar um DN de usuário LDAP a uma conta do MySQL, inclua uma cláusula `BY` na declaração `CREATE USER` que cria a conta.) Se uma conta não especificar uma string LDAP, a autenticação LDAP usa o nome do usuário especificado pelo cliente para encontrar a entrada do LDAP.

* Os programas de cliente se conectam usando o método de conexão apropriado para o plugin de autenticação do lado do servidor que a conta do MySQL utiliza. Para autenticação LDAP, as conexões requerem o nome de usuário do MySQL e a senha do LDAP. Além disso, para contas que utilizam o plugin `authentication_ldap_simple` do lado do servidor, invoque programas de cliente com a opção `--enable-cleartext-plugin` para habilitar o plugin `mysql_clear_password` do lado do cliente.

As instruções aqui assumem o seguinte cenário:

* Os usuários do MySQL `betsy` e `boris` autenticam-se nas entradas do LDAP para `betsy_ldap` e `boris_ldap`, respectivamente. (Não é necessário que os nomes dos usuários do MySQL e do LDAP sejam diferentes. O uso de nomes diferentes nesta discussão ajuda a esclarecer se o contexto de operação é MySQL ou LDAP.)

* As entradas LDAP utilizam o atributo `uid` para especificar nomes de usuário. Isso pode variar dependendo do servidor LDAP. Alguns servidores LDAP utilizam o atributo `cn` para nomes de usuário em vez de `uid`. Para alterar o atributo, modifique a variável de sistema `authentication_ldap_simple_user_search_attr` ou `authentication_ldap_sasl_user_search_attr` de forma apropriada.

* Essas entradas LDAP estão disponíveis no diretório gerenciado pelo servidor LDAP, para fornecer valores de nome distinto que identificam de forma única cada usuário:

  ```
  uid=betsy_ldap,ou=People,dc=example,dc=com
  uid=boris_ldap,ou=People,dc=example,dc=com
  ```

As declarações `CREATE USER` que criam contas MySQL nomeiam um usuário LDAP na cláusula `BY`, para indicar qual entrada LDAP a conta MySQL autentica.

As instruções para configurar uma conta que utiliza autenticação LDAP dependem do plugin LDAP do lado do servidor que é utilizado. As seções a seguir descrevem vários cenários de uso.

##### Autenticação simples LDAP (sem proxy)

O procedimento descrito nesta seção exige que `authentication_ldap_simple_group_search_attr` seja definido como uma string vazia, assim:

```
SET GLOBAL.authentication_ldap_simple_group_search_attr='';
```

Caso contrário, o proxy é usado por padrão.

Para configurar uma conta MySQL para autenticação simples LDAP, use uma declaração `CREATE USER` para especificar o plugin `authentication_ldap_simple`, incluindo opcionalmente o nome distinguido do usuário LDAP (DN), conforme mostrado aqui:

```
CREATE USER user
  IDENTIFIED WITH authentication_ldap_simple
  [BY 'LDAP user DN'];
```

Suponha que o usuário MySQL `betsy` tenha esta entrada no diretório LDAP:

```
uid=betsy_ldap,ou=People,dc=example,dc=com
```

Então, a declaração para criar a conta MySQL para `betsy` é a seguinte:

```
CREATE USER 'betsy'@'localhost'
  IDENTIFIED WITH authentication_ldap_simple
  AS 'uid=betsy_ldap,ou=People,dc=example,dc=com';
```

A string de autenticação especificada na cláusula `BY` não inclui a senha do LDAP. Isso deve ser fornecido pelo usuário do cliente no momento da conexão.

Os clientes se conectam ao servidor MySQL fornecendo o nome de usuário do MySQL e a senha do LDAP, e habilitando o plugin `mysql_clear_password` no lado do cliente:

```
$> mysql --user=betsy --password --enable-cleartext-plugin
Enter password: betsy_ldap_password
```

Nota

O plugin de autenticação `mysql_clear_password` do lado do cliente deixa a senha intocada, então os programas do cliente enviam-na para o servidor MySQL como texto claro. Isso permite que a senha seja passada como é para o servidor LDAP. Uma senha em texto claro é necessária para usar a biblioteca LDAP do lado do servidor sem SASL, mas pode ser um problema de segurança em algumas configurações. Essas medidas minimizam o risco:

* Para tornar menos provável o uso inadvertido do plugin `mysql_clear_password`, os clientes do MySQL devem habilitá-lo explicitamente (por exemplo, com a opção [[`--enable-cleartext-plugin`]). Veja a Seção 8.4.1.4, “Autenticação Cleartext Pluggable do Lado do Cliente”.

* Para evitar a exposição da senha com o plugin `mysql_clear_password` ativado, os clientes do MySQL devem se conectar ao servidor MySQL usando uma conexão criptografada. Veja a Seção 8.3.1, “Configurando o MySQL para usar conexões criptografadas”.

O processo de autenticação ocorre da seguinte forma:

1. O plugin do lado do cliente envia `betsy` e *`betsy_password`* como o nome do usuário do cliente e senha LDAP para o servidor MySQL.

2. A tentativa de conexão corresponde à conta `'betsy'@'localhost'`. O plugin LDAP do lado do servidor descobre que essa conta tem uma string de autenticação de `'uid=betsy_ldap,ou=People,dc=example,dc=com'` para nomear o DN do usuário LDAP. O plugin envia essa string e a senha do LDAP para o servidor LDAP.

3. O servidor LDAP encontra a entrada LDAP para `betsy_ldap` e a senha corresponde, portanto, a autenticação LDAP é bem-sucedida.

4. A entrada LDAP não tem atributo de grupo, portanto, o plugin do lado do servidor retorna o nome do usuário do cliente (`betsy`) como o usuário autenticado. Este é o mesmo nome de usuário fornecido pelo cliente, portanto, não ocorre nenhum encaminhamento e a sessão do cliente usa a conta `'betsy'@'localhost'` para verificação de privilégios.

Se a declaração `CREATE USER` não tivesse nenhuma cláusula `BY` para especificar o nome distinguido LDAP `betsy_ldap`, as tentativas de autenticação usariam o nome do usuário fornecido pelo cliente (neste caso, `betsy`). Na ausência de uma entrada LDAP para `betsy`, a autenticação falharia.

##### Autenticação LDAP com base em SASL (sem proxy)

O procedimento descrito nesta seção exige que `authentication_ldap_sasl_group_search_attr` seja definido como uma string vazia, assim:

```
SET GLOBAL.authentication_ldap_sasl_group_search_attr='';
```

Caso contrário, o proxy é usado por padrão.

Para configurar uma conta MySQL para autenticação SALS LDAP, use uma declaração `CREATE USER` para especificar o plugin `authentication_ldap_sasl`, incluindo opcionalmente o nome distinguido do usuário LDAP (DN), conforme mostrado aqui:

```
CREATE USER user
  IDENTIFIED WITH authentication_ldap_sasl
  [BY 'LDAP user DN'];
```

Suponha que o usuário MySQL `boris` tenha esta entrada no diretório LDAP:

```
uid=boris_ldap,ou=People,dc=example,dc=com
```

Então, a declaração para criar a conta MySQL para `boris` é a seguinte:

```
CREATE USER 'boris'@'localhost'
  IDENTIFIED WITH authentication_ldap_sasl
  AS 'uid=boris_ldap,ou=People,dc=example,dc=com';
```

A string de autenticação especificada na cláusula `BY` não inclui a senha do LDAP. Isso deve ser fornecido pelo usuário do cliente no momento da conexão.

Os clientes se conectam ao servidor MySQL fornecendo o nome de usuário do MySQL e a senha do LDAP:

```
$> mysql --user=boris --password
Enter password: boris_ldap_password
```

Para o plugin `authentication_ldap_sasl` do lado do servidor, os clientes usam o plugin `authentication_ldap_sasl_client` do lado do cliente. Se um programa de cliente não encontrar o plugin do lado do cliente, especifique uma opção `--plugin-dir` que nomeie o diretório onde o arquivo da biblioteca do plugin está instalado.

O processo de autenticação para `boris` é semelhante ao descrito anteriormente para `betsy`, com autenticação LDAP simples, exceto que os plugins SASL LDAP do lado do cliente e do lado do servidor utilizam mensagens SASL para a transmissão segura de credenciais dentro do protocolo LDAP, para evitar o envio da senha em texto claro entre o cliente e o servidor MySQL.

##### Autenticação LDAP com Proxy

Os plugins de autenticação LDAP suportam o encaminhamento, permitindo que um usuário se conecte ao servidor MySQL como um usuário, mas assuma os privilégios de um usuário diferente. Esta seção descreve o suporte básico ao proxy de plugins LDAP. Os plugins LDAP também suportam a especificação da preferência do grupo e o mapeamento do usuário do proxy; consulte Especificação de Preferência e Mapeamento de Preferência de Grupo de Autenticação LDAP.

A implementação de proxy descrita aqui é baseada no uso de valores de atributos de grupo LDAP para mapear usuários do MySQL que se autenticam usando LDAP em outras contas do MySQL que definem diferentes conjuntos de privilégios. Os usuários não se conectam diretamente através das contas que definem os privilégios. Em vez disso, eles se conectam através de uma conta de proxy padrão autenticada com LDAP, de modo que todos os logins externos sejam mapeados para as contas do MySQL proxy que possuem os privilégios. Qualquer usuário que se conecte usando a conta do proxy é mapeado para uma dessas contas do MySQL proxy, cujos privilégios determinam as operações de banco de dados permitidas ao usuário externo.

As instruções aqui assumem o seguinte cenário:

* As entradas LDAP utilizam os atributos `uid` e `cn` para especificar o nome do usuário e os valores do grupo, respectivamente. Para usar nomes de atributos de usuário e grupo diferentes, defina as variáveis de sistema específicas do plugin apropriadas:

+ Para o plugin `authentication_ldap_simple`: Defina `authentication_ldap_simple_user_search_attr` e `authentication_ldap_simple_group_search_attr`.

+ Para o plugin `authentication_ldap_sasl`: Defina `authentication_ldap_sasl_user_search_attr` e `authentication_ldap_sasl_group_search_attr`.

* Essas entradas LDAP estão disponíveis no diretório gerenciado pelo servidor LDAP, para fornecer valores de nome distinto que identificam de forma única cada usuário:

  ```
  uid=basha,ou=People,dc=example,dc=com,cn=accounting
  uid=basil,ou=People,dc=example,dc=com,cn=front_office
  ```

No momento da conexão, os valores dos atributos do grupo se tornam os nomes dos usuários autenticados, e eles nomeiam as contas proxy `accounting` e `front_office`.

* Os exemplos assumem o uso da autenticação SASL LDAP. Faça os ajustes apropriados para autenticação LDAP simples.

Crie a conta de proxy padrão do MySQL:

```
CREATE USER ''@'%'
  IDENTIFIED WITH authentication_ldap_sasl;
```

A definição da conta proxy não possui a cláusula `AS 'auth_string'` para nomear um DN de usuário LDAP. Assim:

* Quando um cliente se conecta, o nome de usuário do cliente se torna o nome de usuário do LDAP para pesquisa.

* A entrada LDAP correspondente deve incluir um atributo de grupo que nomeie a conta MySQL proxy, definindo os privilégios que o cliente deve ter.

Nota

Se a sua instalação do MySQL tiver usuários anônimos, eles podem entrar em conflito com o usuário proxy padrão. Para obter mais informações sobre esse problema e formas de lidar com ele, consulte Usuário Proxy Padrão e Conflitos de Usuários Anônimos.

Crie as contas proxy e conceda a cada uma delas os privilégios que ela deve ter:

```
CREATE USER 'accounting'@'localhost'
  IDENTIFIED WITH mysql_no_login;
CREATE USER 'front_office'@'localhost'
  IDENTIFIED WITH mysql_no_login;

GRANT ALL PRIVILEGES
  ON accountingdb.*
  TO 'accounting'@'localhost';
GRANT ALL PRIVILEGES
  ON frontdb.*
  TO 'front_office'@'localhost';
```

As contas proxy utilizam o plugin de autenticação `mysql_no_login` para impedir que os clientes usem as contas para fazer login diretamente no servidor MySQL. Em vez disso, espera-se que os usuários que se autentiquem usando LDAP usem a conta proxy padrão `''@'%'`. (Isso pressupõe que o plugin `mysql_no_login` esteja instalado. Para instruções, consulte a Seção 8.4.1.9, “Autenticação Plugável sem Login”.) Para métodos alternativos de proteção de contas proxy contra uso direto, consulte Prevenindo Login Direto em Contas Proxy.

Concede ao endereço proxy o privilégio `PROXY` para cada endereço proxy:

```
GRANT PROXY
  ON 'accounting'@'localhost'
  TO ''@'%';
GRANT PROXY
  ON 'front_office'@'localhost'
  TO ''@'%';
```

Use o cliente de linha de comando **mysql** para se conectar ao servidor MySQL como `basha`.

```
$> mysql --user=basha --password
Enter password: basha_password (basha LDAP password)
```

A autenticação ocorre da seguinte forma:

1. O servidor autentica a conexão usando a conta de proxy padrão `''@'%'`, para o usuário do cliente `basha`.

2. A entrada correspondente no LDAP é:

   ```
   uid=basha,ou=People,dc=example,dc=com,cn=accounting
   ```

3. A entrada LDAP correspondente tem o atributo de grupo `cn=accounting`, então `accounting` se torna o usuário autenticado proxy.

4. O usuário autenticado difere do nome do usuário do cliente `basha`, de modo que `basha` é tratado como um proxy para `accounting`, e `basha` assume os privilégios da conta proxy `accounting`. A seguinte consulta retorna o resultado mostrado:

   ```
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-----------------+----------------------+--------------+
   | USER()          | CURRENT_USER()       | @@proxy_user |
   +-----------------+----------------------+--------------+
   | basha@localhost | accounting@localhost | ''@'%'       |
   +-----------------+----------------------+--------------+
   ```

Isso demonstra que o `basha` utiliza os privilégios concedidos à conta MySQL `accounting` proxy, e que a proxy ocorre através da conta de usuário do proxy padrão.

Agora conecte-se como `basil` em vez disso:

```
$> mysql --user=basil --password
Enter password: basil_password (basil LDAP password)
```

O processo de autenticação para `basil` é semelhante ao descrito anteriormente para `basha`:

1. O servidor autentica a conexão usando a conta de proxy padrão `''@'%'`, para o usuário do cliente `basil`.

2. A entrada correspondente no LDAP é:

   ```
   uid=basil,ou=People,dc=example,dc=com,cn=front_office
   ```

3. A entrada LDAP correspondente tem o atributo de grupo `cn=front_office`, então `front_office` se torna o usuário autenticado proxy.

4. O usuário autenticado difere do nome de usuário do cliente `basil`, de modo que `basil` é tratado como um proxy para `front_office`, e `basil` assume os privilégios da conta proxy `front_office`. A seguinte consulta retorna o resultado mostrado:

   ```
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-----------------+------------------------+--------------+
   | USER()          | CURRENT_USER()         | @@proxy_user |
   +-----------------+------------------------+--------------+
   | basil@localhost | front_office@localhost | ''@'%'       |
   +-----------------+------------------------+--------------+
   ```

Isso demonstra que o `basil` utiliza os privilégios concedidos à conta MySQL `front_office` proxy, e que a proxy ocorre através da conta de usuário do proxy padrão.

Especificação de Preferência e Mapeamento de Grupo de Autenticação LDAP #####

Como descrito na Autenticação LDAP com Proxy, a autenticação básica LDAP por proxy funciona com o princípio de que o plugin usa o primeiro nome de grupo retornado pelo servidor LDAP como o nome da conta de usuário proxy do MySQL. Essa capacidade simples não permite especificar nenhuma preferência sobre qual nome de grupo usar se o servidor LDAP retornar vários nomes de grupo, ou especificar qualquer nome diferente do nome do grupo como o nome do usuário proxy.

A partir do MySQL 8.0.14, para contas do MySQL que utilizam autenticação LDAP, a string de autenticação pode especificar as seguintes informações para permitir maior flexibilidade de proxeamento:

* Uma lista de grupos em ordem de preferência, de modo que o plugin use o primeiro nome de grupo na lista que corresponda a um grupo retornado pelo servidor LDAP.

* Um mapeamento de nomes de grupos para nomes de usuários proxy, de modo que um nome de grupo, quando correspondido, possa fornecer um nome especificado para ser usado como o usuário proxy. Isso oferece uma alternativa ao uso do nome de grupo como usuário proxy.

Considere a seguinte definição de conta de proxy do MySQL:

```
CREATE USER ''@'%'
  IDENTIFIED WITH authentication_ldap_sasl
  AS '+ou=People,dc=example,dc=com#grp1=usera,grp2,grp3=userc';
```

A string de autenticação tem um sufixo de DN do usuário `ou=People,dc=example,dc=com` prefixado pelo caractere `+`. Assim, conforme descrito em Sufixos de DN de usuário de autenticação LDAP, o DN completo do usuário é construído a partir do sufixo do DN do usuário conforme especificado, mais o nome do usuário do cliente como o atributo `uid`.

A parte restante da string de autenticação começa com `#`, o que indica o início das informações de preferência e mapeamento do grupo. Essa parte da string de autenticação lista os nomes dos grupos na ordem `grp1`, `grp2`, `grp3`. O plugin LDAP compara essa lista com o conjunto de nomes de grupo retornados pelo servidor LDAP, procurando na ordem da lista uma correspondência com os nomes retornados. O plugin usa a primeira correspondência, ou se não houver correspondência, a autenticação falha.

Suponha que o servidor LDAP retorne os grupos `grp3`, `grp2` e `grp7`. O plugin LDAP usa `grp2`, pois é o primeiro grupo na string de autenticação que corresponde, mesmo que não seja o primeiro grupo retornado pelo servidor LDAP. Se o servidor LDAP retornar `grp4`, `grp2` e `grp1`, o plugin usa `grp1`, embora `grp2` também corresponda. `grp1` tem uma precedência maior que `grp2`, pois é listado anteriormente na string de autenticação.

Supondo que o plugin encontre uma correspondência de nome de grupo, ele realiza a mapeo desse nome de grupo para o nome de usuário proxy do MySQL, se houver um. Para a conta de proxy do exemplo, a mapeo ocorre da seguinte forma:

* Se o nome do grupo correspondente for `grp1` ou `grp3`, esses estão associados na string de autenticação com os nomes de usuário `usera` e `userc`, respectivamente. O plugin usa o nome de usuário associado correspondente como o nome de usuário proxy.

* Se o nome do grupo correspondente for `grp2`, não há nome de usuário associado na string de autenticação. O plugin usa `grp2` como nome de usuário proxy.

Se o servidor LDAP retornar um grupo no formato DN, o plugin LDAP analisa o DN do grupo para extrair o nome do grupo.

Para especificar as preferências e informações de mapeamento de grupo LDAP, esses princípios se aplicam:

* Comece a parte da preferência e mapeo de grupo da string de autenticação com o caractere de prefixo `#`.

* A preferência do grupo e a especificação de mapeamento é uma lista de um ou mais itens, separados por vírgulas. Cada item tem a forma `group_name=user_name` ou *`group_name`*. Os itens devem ser listados na ordem de preferência do nome do grupo. Para um nome de grupo selecionado pelo plugin como correspondência de um conjunto de nomes de grupo retornados pelo servidor LDAP, as duas sintaxes diferem em efeito da seguinte forma:

+ Para um item especificado como `group_name=user_name` (com um nome de usuário), o nome do grupo corresponde ao nome do usuário, que é usado como o nome de usuário proxy do MySQL.

+ Para um item especificado como *`group_name`* (sem nome de usuário), o nome do grupo é usado como nome de usuário proxy do MySQL.

* Para citar um grupo ou nome de usuário que contenha caracteres especiais, como espaço, envolva-o em caracteres de aspas duplas (`"`). Por exemplo, se um item tiver nomes de grupo e usuário de `my group name` e `my user name`, ele deve ser escrito em uma mapeia de grupo usando aspas:

  ```
  "my group name"="my user name"
  ```

Se um item tiver nomes de grupo e usuário de `my_group_name` e `my_user_name` (que não contenham caracteres especiais), ele pode, mas não precisa ser escrito com aspas. Qualquer um dos seguintes é válido:

  ```
  my_group_name=my_user_name
  my_group_name="my_user_name"
  "my_group_name"=my_user_name
  "my_group_name"="my_user_name"
  ```

* Para escapar de um caractere, antecede-o com uma barra invertida (`\`). Isso é útil, em particular, para incluir uma citação dupla literal ou barra invertida, que, de outra forma, não são incluídas literalmente.

* Um DN de usuário não precisa estar presente na string de autenticação, mas, se estiver presente, ele deve preceder a parte de preferência e mapeamento do grupo. Um DN de usuário pode ser fornecido como um DN de usuário completo ou como um sufixo de DN de usuário com um caractere de prefixo `+`. (Veja Sufixos de DN de usuário de autenticação LDAP.)

##### Sufixos de DN de autenticação LDAP do usuário

Os plugins de autenticação LDAP permitem que a string de autenticação que fornece informações de DN do usuário comece com um caractere de prefixo `+`:

* Na ausência de um caractere `+`, o valor da string de autenticação é tratado como está, sem modificação.

* Se a string de autenticação começar com `+`, o plugin constrói o valor completo do DN do usuário a partir do nome do usuário enviado pelo cliente, juntamente com o DN especificado na string de autenticação (com o `+` removido). No DN construído, o nome do usuário do cliente se torna o valor do atributo que especifica os nomes de usuário do LDAP. Isso é `uid` por padrão; para alterar o atributo, modifique a variável do sistema apropriada (`authentication_ldap_simple_user_search_attr` ou `authentication_ldap_sasl_user_search_attr`). A string de autenticação é armazenada conforme especificado na tabela do sistema `mysql.user`, com o DN completo do usuário construído em tempo real antes da autenticação.

Essa string de autenticação da conta não tem `+` no início, então é considerada como o DN completo do usuário:

```
CREATE USER 'baldwin'
  IDENTIFIED WITH authentication_ldap_simple
  AS 'uid=admin,ou=People,dc=example,dc=com';
```

O cliente se conecta com o nome do usuário especificado na conta (`baldwin`). Neste caso, esse nome não é usado porque a string de autenticação não tem prefixo e, portanto, especifica completamente o DN do usuário.

Essa string de autenticação da conta não tem `+` no início, então é considerada apenas parte do DN do usuário:

```
CREATE USER 'accounting'
  IDENTIFIED WITH authentication_ldap_simple
  AS '+ou=People,dc=example,dc=com';
```

O cliente se conecta com o nome de usuário especificado na conta (`accounting`), que, neste caso, é usado como o atributo `uid` juntamente com a string de autenticação para construir o DN do usuário: `uid=accounting,ou=People,dc=example,dc=com`

As contas nos exemplos anteriores têm um nome de usuário não vazio, portanto, o cliente sempre se conecta ao servidor MySQL usando o mesmo nome especificado na definição da conta. Se uma conta tiver um nome de usuário vazio, como a conta anônima padrão `''@'%'` descrita na Autenticação LDAP com Proxy, os clientes podem se conectar ao servidor MySQL com nomes de usuário variados. Mas o princípio é o mesmo: se a string de autenticação começa com `+`, o plugin usa o nome de usuário enviado pelo cliente junto com a string de autenticação para construir o DN do usuário.

##### Métodos de autenticação LDAP

Os plugins de autenticação LDAP utilizam um método de autenticação configurável. As variáveis do sistema apropriadas e as opções de método disponíveis são específicas do plugin:

* Para o plugin `authentication_ldap_simple`: Defina a variável de sistema `authentication_ldap_simple_auth_method_name` para configurar o método. As opções permitidas são `SIMPLE` e `AD-FOREST`.

* Para o plugin `authentication_ldap_sasl`: Defina a variável de sistema `authentication_ldap_sasl_auth_method_name` para configurar o método. As opções permitidas são `SCRAM-SHA-1`, `SCRAM-SHA-256` e `GSSAPI`. (Para determinar quais métodos SASL LDAP estão disponíveis no sistema do host, verifique o valor da variável de status `Authentication_ldap_sasl_supported_methods`.

Consulte as descrições das variáveis do sistema para obter informações sobre cada método permitido. Além disso, dependendo do método, pode ser necessária uma configuração adicional, conforme descrito nas seções a seguir.

##### Método de Autenticação GSSAPI/Kerberos

A Interface de Programação de Serviço de Segurança Genérico (GSSAPI) é uma interface de abstração de segurança. O Kerberos é uma instância de um protocolo de segurança específico que pode ser usado por meio dessa interface abstrata. Usando o GSSAPI, os aplicativos autenticam-se no Kerberos para obter credenciais de serviço, e, em seguida, usam essas credenciais para, por sua vez, habilitar o acesso seguro a outros serviços.

Um desses serviços é o LDAP, que é utilizado pelos plugins de autenticação SASL LDAP do lado do cliente e do lado do servidor. Quando a variável de sistema `authentication_ldap_sasl_auth_method_name` é definida como `GSSAPI`, esses plugins utilizam o método de autenticação GSSAPI/Kerberos. Neste caso, os plugins se comunicam de forma segura usando o método Kerberos sem utilizar diretamente mensagens LDAP. O plugin do lado do servidor, em seguida, se comunica com o servidor LDAP para interpretar mensagens de autenticação LDAP e recuperar grupos LDAP.

O GSSAPI/Kerberos é suportado como um método de autenticação LDAP para servidores e clientes MySQL no Linux. É útil em ambientes Linux onde os aplicativos têm acesso ao LDAP através do Microsoft Active Directory, que tem Kerberos habilitado por padrão.

A discussão a seguir fornece informações sobre os requisitos de configuração para usar o método GSSAPI. Assume-se familiaridade com os conceitos e operação do Kerberos. A lista a seguir define brevemente vários termos comuns do Kerberos. Você também pode achar útil a seção Glossário do [RFC 4120][(https://tools.ietf.org/html/rfc4120)].

* Principal: Uma entidade nomeada, como um usuário ou servidor.

* KDC: O centro de distribuição de chaves, que inclui o AS e o TGS:

+ AS: O servidor de autenticação; fornece o ticket inicial que concede o direito de obter tickets adicionais.

+ TGS: O servidor de concessão de ingressos; fornece ingressos adicionais aos clientes Kerberos que possuem um TGT válido.

* TGT: Bilhete de concessão de passagem; apresentado ao TGS para obter passagens de serviço para o acesso ao serviço.

A autenticação LDAP usando Kerberos requer tanto um servidor KDC quanto um servidor LDAP. Essa exigência pode ser atendida de diferentes maneiras:

* O Active Directory inclui tanto servidores, com autenticação Kerberos habilitada por padrão no servidor LDAP do Active Directory.

* O OpenLDAP fornece um servidor LDAP, mas pode ser necessário um servidor KDC separado, com configuração adicional do Kerberos necessária.

O Kerberos também deve estar disponível no host do cliente. Um cliente entra em contato com o AS usando uma senha para obter um TGT. O cliente, em seguida, usa o TGT para obter acesso do TGS a outros serviços, como LDAP.

As seções a seguir discutem os passos de configuração para usar GSSAPI/Kerberos para autenticação LDAP SASL no MySQL:

* Verifique a disponibilidade do Kerberos e do LDAP
* Configure o plugin de autenticação LDAP de lado do servidor para GSSAPI/Kerberos
* Crie uma conta MySQL que use GSSAPI/Kerberos para autenticação LDAP
* Use a conta MySQL para se conectar ao servidor MySQL
* Parâmetros de configuração do cliente para autenticação LDAP

###### Verifique a disponibilidade do Kerberos e do LDAP

O exemplo a seguir mostra como testar a disponibilidade do Kerberos no Active Directory. O exemplo faz as seguintes suposições:

* O Active Directory está em execução no host com o nome `ldap_auth.example.com` e endereço IP `198.51.100.10`.

* A autenticação Kerberos relacionada ao MySQL e as consultas LDAP utilizam o domínio `MYSQL.LOCAL`.

* Um administrador chamado `bredon@MYSQL.LOCAL` está registrado no KDC. (Em discussões posteriores, esse nome do administrador também está associado à conta do MySQL que se autentica no servidor MySQL usando GSSAPI/Kerberos.)

Com essas suposições satisfeitas, siga este procedimento:

1. Verifique se a biblioteca Kerberos está instalada e configurada corretamente no sistema operacional. Por exemplo, para configurar um domínio `MYSQL.LOCAL` para uso durante a autenticação do MySQL, o arquivo de configuração `/etc/krb5.conf` do Kerberos deve conter algo como o seguinte:

   ```
   [realms]
     MYSQL.LOCAL = {
       kdc = ldap_auth.example.com
       admin_server = ldap_auth.example.com
       default_domain = MYSQL.LOCAL
     }
   ```

2. Você pode precisar adicionar uma entrada para o host do servidor em `/etc/hosts`:

   ```
   198.51.100.10 ldap_auth ldap_auth.example.com
   ```

3. Verifique se a autenticação Kerberos funciona corretamente:

1. Use **kinit** para autenticar-se no Kerberos:

      ```
      $> kinit bredon@MYSQL.LOCAL
      Password for bredon@MYSQL.LOCAL: (enter password here)
      ```

O comando autentica para o principal Kerberos denominado `bredon@MYSQL.LOCAL`. Digite a senha do principal quando o comando solicitar. O KDC retorna um TGT que é armazenado em cache no lado do cliente para uso por outros aplicativos que reconhecem Kerberos.

2. Use **klist** para verificar se o TGT foi obtido corretamente. A saída deve ser semelhante a esta:

      ```
      $> klist
      Ticket cache: FILE:/tmp/krb5cc_244306
      Default principal: bredon@MYSQL.LOCAL

      Valid starting       Expires              Service principal
      03/23/2021 08:18:33  03/23/2021 18:18:33  krbtgt/MYSQL.LOCAL@MYSQL.LOCAL
      ```

4. Verifique se o **ldapsearch** funciona com o TGT Kerberos usando este comando, que busca usuários no domínio `MYSQL.LOCAL`:

   ```
   ldapsearch -h 198.51.100.10 -Y GSSAPI -b "dc=MYSQL,dc=LOCAL"
   ```

###### Configure o Plugin de Autenticação LDAP SASL do lado do servidor para GSSAPI/Kerberos

Supondo que o servidor LDAP seja acessível através do Kerberos, conforme descrito acima, configure o plugin de autenticação LDAP do lado do servidor para usar o método de autenticação GSSAPI/Kerberos. (Para informações gerais sobre a instalação do plugin LDAP, consulte Instalar autenticação legível por plug-in LDAP.) Aqui está um exemplo de configurações relacionadas ao plugin que o arquivo `my.cnf` do servidor pode conter:

```
[mysqld]
plugin-load-add=authentication_ldap_sasl.so
authentication_ldap_sasl_auth_method_name="GSSAPI"
authentication_ldap_sasl_server_host=198.51.100.10
authentication_ldap_sasl_server_port=389
authentication_ldap_sasl_bind_root_dn="cn=admin,cn=users,dc=MYSQL,dc=LOCAL"
authentication_ldap_sasl_bind_root_pwd="password"
authentication_ldap_sasl_bind_base_dn="cn=users,dc=MYSQL,dc=LOCAL"
authentication_ldap_sasl_user_search_attr="sAMAccountName"
```

Esses ajustes do arquivo de opções configuram o plugin SASL LDAP da seguinte forma:

* A opção `--plugin-load-add` carrega o plugin (ajuste o sufixo `.so` para sua plataforma conforme necessário). Se você carregou o plugin anteriormente usando uma declaração `INSTALL PLUGIN`, esta opção é desnecessária.

* `authentication_ldap_sasl_auth_method_name` deve ser configurado como `GSSAPI` para usar GSSAPI/Kerberos como método de autenticação LDAP SASL.

* `authentication_ldap_sasl_server_host` e `authentication_ldap_sasl_server_port` indicam o endereço IP e o número de porta do servidor do Active Directory para autenticação.

* `authentication_ldap_sasl_bind_root_dn` e `authentication_ldap_sasl_bind_root_pwd` configuram o DN raiz e a senha para a capacidade de busca de grupo. Essa capacidade é necessária, mas os usuários podem não ter privilégios para pesquisar. Nesses casos, é necessário fornecer informações sobre o DN raiz:

+ No valor da opção DN, `admin` deve ser o nome de uma conta administrativa LDAP que tenha privilégios para realizar pesquisas de usuários.

+ No valor da opção de senha, *`password`* deve ser a senha da conta `admin`.

* `authentication_ldap_sasl_bind_base_dn` indica o caminho base da DN do usuário, de modo que as pesquisas busquem usuários no domínio `MYSQL.LOCAL`.

* `authentication_ldap_sasl_user_search_attr` especifica um atributo padrão de pesquisa do Active Directory, `sAMAccountName`. Este atributo é usado em pesquisas para corresponder a nomes de logon; os valores do atributo não são os mesmos que os valores do DN do usuário.

###### Crie uma conta MySQL que use GSSAPI/Kerberos para autenticação LDAP

A autenticação MySQL usando o plugin de autenticação SASL LDAP com o método GSSAPI/Kerberos é baseado em um usuário que é uma principal Kerberos. A discussão a seguir usa uma principal chamada `bredon@MYSQL.LOCAL` como este usuário, que deve ser registrado em vários lugares:

* O administrador do Kerberos deve registrar o nome do usuário como um principal Kerberos. Esse nome deve incluir um nome de domínio. Os clientes usam o nome do principal e a senha para autenticar-se com o Kerberos e obter um TGT.

* O administrador do LDAP deve registrar o nome do usuário em uma entrada do LDAP. Por exemplo:

  ```
  uid=bredon,dc=MYSQL,dc=LOCAL
  ```

Nota

Em Active Directory (que utiliza Kerberos como método de autenticação padrão), ao criar um usuário, são criados tanto o principal Kerberos quanto a entrada LDAP.

* O DBA do MySQL deve criar uma conta que tenha o nome do principal Kerberos como nome de usuário e que autentique usando o plugin SASL LDAP.

Suponha que o principal Kerberos e a entrada LDAP tenham sido registrados pelos administradores do serviço apropriados, e que, como descrito anteriormente em Instalar o plugin de autenticação LDAP pluggable, e Configure o plugin de autenticação LDAP SASL do lado do servidor para GSSAPI/Kerberos, o servidor MySQL tenha sido iniciado com configurações apropriadas para o plugin LDAP SASL do lado do servidor. O DBA do MySQL, em seguida, cria uma conta MySQL que corresponde ao nome do principal Kerberos, incluindo o nome do domínio.

Nota

O plugin SASL LDAP usa um DN de usuário constante para autenticação Kerberos e ignora qualquer DN de usuário configurado a partir do MySQL. Isso tem certas implicações:

* Para qualquer conta MySQL que utilize autenticação GSSAPI/Kerberos, a string de autenticação nas declarações `CREATE USER` ou `ALTER USER` não deve conter o DN do usuário, pois ele não tem efeito.

* Como a string de autenticação não contém DN do usuário, ela deve conter informações de mapeamento de grupo, para permitir que o usuário seja tratado como um usuário proxy mapeado no usuário desejado proxy. Para obter informações sobre o proxeamento com o plugin de autenticação LDAP, consulte Autenticação LDAP com Proxeamento.

As seguintes declarações criam um usuário proxy chamado `bredon@MYSQL.LOCAL` que assume os privilégios do usuário proxy chamado `proxied_krb_usr`. Outros usuários GSSAPI/Kerberos que devem ter os mesmos privilégios podem ser criados de maneira semelhante como usuários proxy para o mesmo usuário proxy.

```
-- create proxy account
CREATE USER 'bredon@MYSQL.LOCAL'
  IDENTIFIED WITH authentication_ldap_sasl
  BY '#krb_grp=proxied_krb_user';

-- create proxied account and grant its privileges;
-- use mysql_no_login plugin to prevent direct login
CREATE USER 'proxied_krb_user'
  IDENTIFIED WITH mysql_no_login;
GRANT ALL
  ON krb_user_db.*
  TO 'proxied_krb_user';

-- grant to proxy account the
-- PROXY privilege for proxied account
GRANT PROXY
  ON 'proxied_krb_user'
  TO 'bredon@MYSQL.LOCAL';
```

Observe atentamente a citação para o nome da conta de proxy na primeira declaração `CREATE USER` e na declaração `GRANT PROXY`(grant.html "15.7.1.6 GRANT Statement"):

* Para a maioria das contas do MySQL, o usuário e o host são partes separadas do nome da conta e, portanto, são citados separadamente como `'user_name'@'host_name'`.

* Para autenticação LDAP Kerberos, a parte do usuário do nome da conta inclui o domínio principal, então `'bredon@MYSQL.LOCAL'` é citado como um único valor. Como não é fornecida nenhuma parte de host, o nome completo da conta MySQL usa o padrão de `'%'` como parte do host: `'bredon@MYSQL.LOCAL'@'%'`

Nota

Ao criar uma conta que autentica usando o plugin de autenticação SASL LDAP `authentication_ldap_sasl` com o método de autenticação GSSAPI/Kerberos, a declaração `CREATE USER`(create-user.html "15.7.1.3 CREATE USER Statement") inclui o domínio como parte do nome do usuário. Isso difere da criação de contas que usam o plugin Kerberos `authentication_kerberos`. Para tais contas, a declaração `CREATE USER`(create-user.html "15.7.1.3 CREATE USER Statement") não inclui o domínio como parte do nome do usuário. Em vez disso, especifique o domínio como a string de autenticação na cláusula `BY`. Veja Criar uma Conta MySQL que Usa Autenticação Kerberos.

A conta proxy usa o plugin de autenticação `mysql_no_login` para impedir que os clientes usem a conta para fazer login diretamente no servidor MySQL. Em vez disso, espera-se que os usuários que se autentiquem usando LDAP usem a conta proxy `bredon@MYSQL.LOCAL`. (Isso pressupõe que o plugin `mysql_no_login` esteja instalado. Para instruções, consulte a Seção 8.4.1.9, “Autenticação Pluggable sem Login”.) Para métodos alternativos de proteção de contas proxy contra uso direto, consulte Prevenindo Login Direto em Contas Proxy.

###### Use a Conta MySQL para se conectar ao servidor MySQL

Após configurar uma conta MySQL que autentica usando GSSAPI/Kerberos, os clientes podem usá-la para se conectar ao servidor MySQL. A autenticação Kerberos pode ocorrer antes ou no momento da invocação do programa cliente MySQL:

* Antes de invocar o programa cliente MySQL, o usuário do cliente pode obter um TGT do KDC de forma independente do MySQL. Por exemplo, o usuário do cliente pode usar **kinit** para autenticar-se no Kerberos fornecendo um nome de principal Kerberos e a senha da principal:

  ```
  $> kinit bredon@MYSQL.LOCAL
  Password for bredon@MYSQL.LOCAL: (enter password here)
  ```

O TGT resultante é armazenado em cache e torna-se disponível para uso por outros aplicativos que reconhecem o Kerberos, como programas que utilizam o plugin de autenticação SASL LDAP do lado do cliente. Neste caso, o programa cliente MySQL autentica-se no servidor MySQL usando o TGT, então invoque o cliente sem especificar um nome de usuário ou senha:

  ```
  mysql --default-auth=authentication_ldap_sasl_client
  ```

Como descrito acima, quando o TGT é armazenado em cache, as opções de nome de usuário e senha não são necessárias no comando do cliente. Se o comando as incluir de qualquer maneira, elas são tratadas da seguinte forma:

+ Se o comando incluir um nome de usuário, a autenticação falha se esse nome não corresponder ao nome principal no TGT.

+ Se o comando incluir uma senha, o plugin do lado do cliente a ignora. Como a autenticação é baseada no TGT, ele pode ter sucesso *mesmo que a senha fornecida pelo usuário esteja incorreta*. Por esse motivo, o plugin emite um aviso se um TGT válido for encontrado, o que faz com que a senha seja ignorada.

* Se o cache Kerberos não contiver TGT, o próprio plugin de autenticação SASL LDAP do lado do cliente pode obter o TGT do KDC. Inicie o cliente com as opções para o nome e a senha do principal Kerberos associado à conta MySQL (entre no comando em uma única linha, em seguida, entre a senha do principal quando solicitado):

  ```
  mysql --default-auth=authentication_ldap_sasl_client
    --user=bredon@MYSQL.LOCAL
    --password
  ```

* Se o cache Kerberos não contiver TGT e o comando do cliente não especificar nenhum nome de principal como nome de usuário, a autenticação falha.

Se você não tiver certeza se um TGT existe, você pode usar o **klist** para verificar.

A autenticação ocorre da seguinte forma:

1. O cliente usa o TGT para autenticar usando Kerberos. 2. O servidor encontra a entrada LDAP para o principal e usa-a para autenticar a conexão para a conta do proxy do MySQL `bredon@MYSQL.LOCAL`.

3. O mapeamento do grupo nas informações da string de autenticação da conta proxy (`'#krb_grp=proxied_krb_user'`) indica que o usuário autenticado proxy deve ser `proxied_krb_user`.

4. `bredon@MYSQL.LOCAL` é tratado como um proxy para `proxied_krb_user`, e a seguinte consulta retorna o resultado conforme mostrado:

   ```
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +------------------------------+--------------------+--------------------------+
   | USER()                       | CURRENT_USER()     | @@proxy_user             |
   +------------------------------+--------------------+--------------------------+
   | bredon@MYSQL.LOCAL@localhost | proxied_krb_user@% | 'bredon@MYSQL.LOCAL'@'%' |
   +------------------------------+--------------------+--------------------------+
   ```

O valor `USER()` indica o nome do usuário utilizado para o comando do cliente (`bredon@MYSQL.LOCAL`) e o host a partir do qual o cliente se conectou (`localhost`).

O valor `CURRENT_USER()` é o nome completo da conta de usuário proxy, que consiste na parte de usuário `proxied_krb_user` e na parte de host `%`.

O valor `@@proxy_user` indica o nome completo da conta usada para fazer a conexão com o servidor MySQL, que consiste na parte de usuário `bredon@MYSQL.LOCAL` e na parte de host `%`.

Isso demonstra que a proxy ocorre através da conta de usuário proxy `bredon@MYSQL.LOCAL`, e que `bredon@MYSQL.LOCAL` assume os privilégios concedidos à conta de usuário proxy `proxied_krb_user`.

Um TGT obtido uma vez é armazenado em cache no lado do cliente e pode ser usado até que expire sem precisar especificar a senha novamente. No entanto, independentemente de como o TGT é obtido, o plugin do lado do cliente o usa para adquirir ingressos de serviço e se comunicar com o plugin do lado do servidor.

Nota

Quando o próprio plugin de autenticação do lado do cliente obtém o TGT, o usuário do cliente pode não querer que o TGT seja reutilizado. Como descrito nos Parâmetros de Configuração do Cliente para Autenticação LDAP, o arquivo local `/etc/krb5.conf` pode ser usado para fazer com que o plugin do lado do cliente destrua o TGT quando estiver pronto para usá-lo.

O plugin do lado do servidor não tem acesso ao TGT em si ou à senha do Kerberos usada para obtê-lo.

Os plugins de autenticação LDAP não têm controle sobre o mecanismo de cache (armazenamento em um arquivo local, em memória, etc.), mas as ferramentas Kerberos, como **kswitch**, podem estar disponíveis para esse propósito.

###### Parâmetros de Configuração do Cliente para Autenticação LDAP

O plugin SASL LDAP do lado do cliente `authentication_ldap_sasl_client` lê o arquivo local `/etc/krb5.conf`. Se este arquivo estiver ausente ou inacessível, ocorrerá um erro. Supondo que o arquivo esteja acessível, ele pode incluir uma seção opcional `[appdefaults]` para fornecer informações usadas pelo plugin. Coloque as informações dentro da parte `mysql` da seção. Por exemplo:

```
[appdefaults]
  mysql = {
    ldap_server_host = "ldap_host.example.com"
    ldap_destroy_tgt = true
  }
```

O plugin do lado do cliente reconhece esses parâmetros na seção `mysql`:

* O valor `ldap_server_host` especifica o host do servidor LDAP e pode ser útil quando esse host difere do host do servidor KDC especificado na seção `[realms]`. Por padrão, o plugin usa o host do servidor KDC como o host do servidor LDAP.

* O valor `ldap_destroy_tgt` indica se o plugin do lado do cliente destrói o TGT após obtê-lo e usá-lo. Por padrão, `ldap_destroy_tgt` é `false`, mas pode ser definido como `true` para evitar a reutilização do TGT. (Essa configuração aplica-se apenas a TGTs criados pelo plugin do lado do cliente, não a TGTs criados por outros plugins ou externamente ao MySQL.)

##### Referência de pesquisa LDAP

Um servidor LDAP pode ser configurado para delegar pesquisas LDAP para outro servidor LDAP, uma funcionalidade conhecida como referência LDAP. Suponha que o servidor `a.example.com` possua um DN raiz `"dc=example,dc=com"` e queira delegar pesquisas para outro servidor `b.example.com`. Para habilitar isso, `a.example.com` seria configurado com um objeto de referência nomeado com esses atributos:

```
dn: dc=subtree,dc=example,dc=com
objectClass: referral
objectClass: extensibleObject
dc: subtree
ref: ldap://b.example.com/dc=subtree,dc=example,dc=com
```

Um problema ao habilitar a referência LDAP é que as pesquisas podem falhar com erros de operação LDAP quando a base de DN de pesquisa é o DN raiz e os objetos de referência não estão definidos. Um DBA do MySQL pode querer evitar tais erros de referência para os plugins de autenticação LDAP, embora a referência LDAP possa estar definida globalmente no arquivo de configuração `ldap.conf`. Para configurar, em uma base específica do plugin, se o servidor LDAP deve usar referência LDAP ao se comunicar com cada plugin, defina as variáveis de sistema `authentication_ldap_simple_referral` e `authentication_ldap_sasl_referral`. Definir qualquer uma das variáveis em `ON` ou `OFF` faz com que o plugin de autenticação LDAP correspondente diga ao servidor LDAP se deve usar referência durante a autenticação do MySQL. Cada variável tem um efeito específico do plugin e não afeta outras aplicações que se comunicam com o servidor LDAP. Ambas as variáveis são `OFF` por padrão.

#### 8.4.1.8 Autenticação Conectada ao Kerberos

Nota

A autenticação legível por Kerberos é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL suporta um método de autenticação que permite que os usuários se autentiquem no MySQL Server usando Kerberos, desde que os ingressos Kerberos apropriados estejam disponíveis ou possam ser obtidos.

Este método de autenticação está disponível no MySQL 8.0.26 e versões posteriores, para servidores e clientes MySQL no Linux. É útil em ambientes Linux onde as aplicações têm acesso ao Microsoft Active Directory, que tem Kerberos habilitado por padrão. A partir do MySQL 8.0.27 (MySQL 8.0.32 para Kerberos MIT), o plugin do lado do cliente também é suportado no Windows. O plugin do lado do servidor ainda é suportado apenas no Linux.

A autenticação legível por Kerberos oferece essas capacidades:

* Autenticação externa: A autenticação Kerberos permite que o MySQL Server aceite conexões de usuários definidos fora das tabelas de concessão do MySQL que obtiveram os tickets Kerberos adequados.

* Segurança: O Kerberos utiliza ingressos juntamente com criptografia de chave simétrica, permitindo autenticação sem enviar senhas pela rede. A autenticação Kerberos suporta cenários sem usuário e sem senha.

A tabela a seguir mostra os nomes dos arquivos de plugin e biblioteca. O sufixo do nome do arquivo pode diferir no seu sistema. O arquivo deve estar localizado no diretório nomeado pela variável de sistema `plugin_dir`. Para informações de instalação, consulte Instalar Kerberos Pluggable Authentication.

**Tabela 8.24 Nomes de plugins e bibliotecas para autenticação Kerberos**

<table summary="Names for the plugins and library file used for Kerberos authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>authentication_kerberos</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>authentication_kerberos_client</code></td> </tr><tr> <td>Library file</td> <td><code>authentication_kerberos.so</code>, <code>authentication_kerberos_client.so</code></td> </tr></tbody></table>

O plugin de autenticação Kerberos do lado do servidor é incluído apenas na Edição Empresarial do MySQL. Não é incluído nas distribuições comunitárias do MySQL. O plugin do lado do cliente é incluído em todas as distribuições, incluindo as distribuições comunitárias. Isso permite que clientes de qualquer distribuição se conectem a um servidor que tenha o plugin do lado do servidor carregado.

As seções a seguir fornecem informações de instalação e uso específicas para autenticação pluggable do Kerberos:

* Pré-requisitos para Autenticação Pluggable do Kerberos
* Como a Autenticação do Kerberos de Usuários do MySQL Funciona
* Instalando Autenticação Pluggable do Kerberos
* Usando Autenticação Pluggable do Kerberos
* Depuração da Autenticação do Kerberos

Para informações gerais sobre autenticação conectada no MySQL, consulte a Seção 8.2.17, “Autenticação Conectada”.

##### Pré-requisitos para autenticação compatível com Kerberos

Para usar autenticação de pluggable Kerberos para MySQL, esses pré-requisitos devem ser atendidos:

* Um serviço Kerberos deve estar disponível para que os plugins de autenticação Kerberos possam se comunicar.

* Cada usuário Kerberos (princípio) que deve ser autenticado pelo MySQL deve estar presente no banco de dados gerenciado pelo servidor KDC.

* Uma biblioteca de cliente Kerberos deve estar disponível nos sistemas onde o plugin de autenticação Kerberos do lado do servidor ou do lado do cliente é usado. Além disso, o GSSAPI é usado como a interface para acessar a autenticação Kerberos, então uma biblioteca GSSAPI deve estar disponível.

##### Como funciona a autenticação Kerberos de usuários do MySQL

Esta seção fornece uma visão geral de como o MySQL e o Kerberos trabalham juntos para autenticar usuários do MySQL. Para exemplos que mostram como configurar contas do MySQL para usar os plugins de autenticação do Kerberos, consulte Usando Pluggable Authentication com Kerberos.

Aqui, é assumido conhecimento sobre os conceitos e funcionamento do Kerberos. A lista a seguir define brevemente vários termos comuns do Kerberos. Você também pode achar útil a seção Glossário do [RFC 4120][(https://tools.ietf.org/html/rfc4120)].

* Principal: Uma entidade nomeada, como um usuário ou servidor. Nesta discussão, certos termos relacionados ao principal ocorrem com frequência:

+ SPN: Nome do principal do serviço; o nome de um principal que representa um serviço.

+ UPN: Nome principal do usuário; o nome de um principal que representa um usuário.

* KDC: O centro de distribuição de chaves, que inclui o AS e o TGS:

+ AS: O servidor de autenticação; fornece o ticket inicial que concede o direito de obter tickets adicionais.

+ TGS: O servidor de concessão de ingressos; fornece ingressos adicionais aos clientes Kerberos que possuem um TGT válido.

* TGT: Bilhete de concessão de passagem; apresentado ao TGS para obter passagens de serviço para o acesso ao serviço.

* ST: Um ticket de serviço; oferece acesso a um serviço como o oferecido por um servidor MySQL.

A autenticação usando Kerberos requer um servidor KDC, por exemplo, como o fornecido pelo Microsoft Active Directory.

A autenticação Kerberos no MySQL utiliza a Generic Security Service Application Program Interface (GSSAPI), que é uma interface de abstração de segurança. O Kerberos é uma instância de um protocolo de segurança específico que pode ser usado por meio dessa interface abstrata. Usando a GSSAPI, as aplicações autenticam-se no Kerberos para obter credenciais de serviço, e, em seguida, usam essas credenciais para, por sua vez, habilitar o acesso seguro a outros serviços.

No Windows, o plugin de autenticação `authentication_kerberos_client` suporta dois modos, que o usuário do cliente pode definir em tempo de execução ou especificar em um arquivo de opção:

* `SSPI` modo: Interface de Suporte de Segurança (SSPI) implementa GSSAPI (veja os comandos para clientes Windows no modo SSPI). O SSPI, embora seja compatível com GSSAPI no nível de fio, só suporta o cenário de login único do Windows e se refere especificamente ao usuário conectado. O SSPI é o modo padrão na maioria dos clientes Windows.

* Modo `GSSAPI`: Suporta GSSAPI através da biblioteca MIT Kerberos no Windows (consulte Comandos para clientes Windows no modo GSSAPI).

Com os plugins de autenticação Kerberos, aplicativos e servidores MySQL podem usar o protocolo de autenticação Kerberos para autenticar mutuamente usuários e serviços MySQL. Dessa forma, tanto o usuário quanto o servidor podem verificar a identidade do outro. Nenhuma senha é enviada pela rede e as mensagens do protocolo Kerberos são protegidas contra interceptação e ataques de reprodução.

A autenticação Kerberos segue esses passos, onde as partes do lado do servidor e do lado do cliente são realizadas usando os plugins de autenticação `authentication_kerberos` e `authentication_kerberos_client`, respectivamente:

1. O servidor MySQL envia ao aplicativo cliente seu nome principal de serviço. Este SPN deve ser registrado no sistema Kerberos e configurado no lado do servidor usando a variável de sistema `authentication_kerberos_service_principal`.

2. Usando o GSSAPI, o aplicativo cliente cria uma sessão de autenticação do lado do cliente Kerberos e troca mensagens Kerberos com o KDC Kerberos:

* O cliente obtém um bilhete de concessão de bilhete do servidor de autenticação.

* Usando o TGT, o cliente obtém um ticket de serviço para MySQL do serviço de concessão de tickets.

Esse passo pode ser ignorado ou parcialmente ignorado se o TGT, o ST ou ambos já estiverem armazenados localmente. O cliente pode, opcionalmente, usar um arquivo de chave de cliente para obter um TGT e ST sem fornecer uma senha.

3. Usando o GSSAPI, o aplicativo cliente apresenta o ST MySQL ao servidor MySQL.

4. Usando o GSSAPI, o servidor MySQL cria uma sessão de autenticação do lado do servidor Kerberos. O servidor valida a identidade do usuário e a validade do pedido do usuário. Ele autentica o ST usando a chave de serviço configurada em seu arquivo service keytab para determinar se a autenticação é bem-sucedida ou não, e retorna o resultado da autenticação ao cliente.

As aplicações podem autenticar-se usando um nome de usuário e senha fornecidos, ou usando um TGT ou ST armazenado localmente (por exemplo, criado usando **kinit** ou semelhante). Esse design, portanto, abrange casos de uso que vão desde conexões completamente sem usuário e sem senha, onde os ingressos de serviço Kerberos são obtidos de um cache Kerberos armazenado localmente, até conexões onde tanto o nome de usuário quanto a senha são fornecidos e usados para obter um ingresso de serviço Kerberos válido de um KDC, para enviar ao servidor MySQL.

Como indicado na descrição anterior, a autenticação MySQL Kerberos utiliza dois tipos de arquivos de keytab:

* No host do cliente, um arquivo de chave do cliente pode ser usado para obter um TGT e ST sem fornecer uma senha. Consulte Parâmetros de Configuração do Cliente para Autenticação Kerberos.

* No servidor do MySQL, um arquivo de chavetab do serviço do lado do servidor é usado para verificar os ingressos de serviço recebidos pelo servidor MySQL dos clientes. O nome do arquivo keytab é configurado usando a variável de sistema `authentication_kerberos_service_key_tab`.

Para informações sobre arquivos keytab, consulte <https://web.mit.edu/kerberos/krb5-latest/doc/basic/keytab_def.html>.

##### Instalação do Kerberos Pluggable Authentication

Esta seção descreve como instalar o plugin de autenticação Kerberos do lado do servidor. Para informações gerais sobre a instalação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Nota

O plugin do lado do servidor é suportado apenas em sistemas Linux. Em sistemas Windows, apenas o plugin do lado do cliente é suportado (a partir do MySQL 8.0.27), que pode ser usado em um sistema Windows para se conectar a um servidor Linux que usa autenticação Kerberos.

Para ser utilizável pelo servidor, o arquivo da biblioteca de plugins deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin, definindo o valor de `plugin_dir` na inicialização do servidor.

O nome de arquivo da biblioteca de plugins do lado do servidor é `authentication_kerberos`. O sufixo do nome do arquivo para sistemas Unix e Unix-like é `.so`.

Para carregar o plugin no início da inicialização do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com este método de carregamento de plugins, a opção deve ser dada toda vez que o servidor é iniciado. Além disso, especifique valores para quaisquer variáveis do sistema fornecidas pelo plugin que você deseja configurar. O plugin expõe essas variáveis do sistema, permitindo que sua operação seja configurada:

* `authentication_kerberos_service_principal`: O nome principal do serviço MySQL (SPN). Esse nome é enviado aos clientes que tentam autenticar usando Kerberos. O SPN deve estar presente no banco de dados gerenciado pelo servidor KDC. O padrão é `mysql/host_name@realm_name`.

* `authentication_kerberos_service_key_tab`: O arquivo keytab para autenticação de ingressos recebidos dos clientes. Este arquivo deve existir e conter uma chave válida para o SPN, caso contrário, a autenticação dos clientes falhará. O padrão é `mysql.keytab` no diretório de dados.

Para obter detalhes sobre todas as variáveis do sistema de autenticação Kerberos, consulte a Seção 8.4.1.13, “Variáveis do Sistema de Autenticação Conectada”.

Para carregar o plugin e configurá-lo, coloque linhas como estas no seu arquivo `my.cnf`, usando valores para as variáveis do sistema que são apropriados para sua instalação:

```
[mysqld]
plugin-load-add=authentication_kerberos.so
authentication_kerberos_service_principal=mysql/krbauth.example.com@MYSQL.LOCAL
authentication_kerberos_service_key_tab=/var/mysql/data/mysql.keytab
```

Após modificar `my.cnf`, reinicie o servidor para que as novas configurações sejam aplicadas.

Como alternativa, para carregar o plugin no tempo de execução, use esta declaração:

```
INSTALL PLUGIN authentication_kerberos
  SONAME 'authentication_kerberos.so';
```

`INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela do sistema `mysql.plugins`, fazendo com que o servidor o carregue para cada inicialização normal subsequente, sem a necessidade de `--plugin-load-add`.

Quando você instala o plugin em tempo de execução sem configurar suas variáveis de sistema no arquivo `my.cnf`, a variável de sistema `authentication_kerberos_service_key_tab` é definida pelo valor padrão de `mysql.keytab` no diretório de dados. O valor dessa variável de sistema não pode ser alterado em tempo de execução, portanto, se você precisar especificar um arquivo diferente, você precisa adicionar a configuração ao seu arquivo `my.cnf` e, em seguida, reiniciar o servidor MySQL. Por exemplo:

```
[mysqld]
authentication_kerberos_service_key_tab=/var/mysql/data/mysql.keytab
```

Se o arquivo keytab não estiver no local correto ou não contiver uma chave SPN válida, o servidor MySQL não valida isso, mas os clientes retornam erros de autenticação até que você resolva o problema.

A variável de sistema `authentication_kerberos_service_principal` pode ser definida e persistida em tempo de execução sem reiniciar o servidor, usando uma declaração [[`SET PERSIST`][(set-variable.html "15.7.6.1 SET Syntax for Variable Assignment")]]:

```
SET PERSIST authentication_kerberos_service_principal='mysql/krbauth.example.com@MYSQL.LOCAL';
```

`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") define um valor para a instância MySQL em execução. Também salva o valor, fazendo com que ele seja carregado em reinicializações subsequentes do servidor. Para alterar um valor para a instância MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`. Veja a Seção 15.7.6.1, “Sintaxe SET para atribuição de variáveis”.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 7.6.2, “Obtenção de Informações do Plugin do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME = 'authentication_kerberos';
+-------------------------+---------------+
| PLUGIN_NAME             | PLUGIN_STATUS |
+-------------------------+---------------+
| authentication_kerberos | ACTIVE        |
+-------------------------+---------------+
```

Se um plugin não conseguir se inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

Para associar contas do MySQL ao plugin Kerberos, consulte o uso do Autenticação Personalizável Kerberos.

##### Usando Kerberos Pluggable Authentication

Esta seção descreve como habilitar contas do MySQL para se conectarem ao servidor MySQL usando autenticação pluggable do Kerberos. Assume-se que o servidor esteja em execução com o plugin do lado do servidor habilitado, conforme descrito em Instalar Autenticação Pluggable do Kerberos, e que o plugin do lado do cliente esteja disponível no host do cliente.

* Verificar a disponibilidade do Kerberos
* Criar uma conta MySQL que use autenticação Kerberos
* Usar a conta MySQL para se conectar ao servidor MySQL
* Parâmetros de configuração do cliente para autenticação Kerberos

###### Verificar a disponibilidade do Kerberos

O exemplo a seguir mostra como testar a disponibilidade do Kerberos no Active Directory. O exemplo faz as seguintes suposições:

* O Active Directory está em execução no host com o nome `krbauth.example.com` e endereço IP `198.51.100.11`.

* A autenticação Kerberos relacionada ao MySQL utiliza o domínio `MYSQL.LOCAL` e também utiliza `MYSQL.LOCAL` como o nome do domínio.

* Um administrador chamado `karl@MYSQL.LOCAL` está registrado no KDC. (Em discussões posteriores, esse nome do administrador está associado à conta MySQL que se autentica no servidor MySQL usando Kerberos.)

Com essas suposições satisfeitas, siga este procedimento:

1. Verifique se a biblioteca Kerberos está instalada e configurada corretamente no sistema operacional. Por exemplo, para configurar um domínio e um domínio `MYSQL.LOCAL` para uso durante a autenticação do MySQL, o arquivo de configuração `/etc/krb5.conf` do Kerberos deve conter algo como o seguinte:

   ```
   [realms]
     MYSQL.LOCAL = {
       kdc = krbauth.example.com
       admin_server = krbauth.example.com
       default_domain = MYSQL.LOCAL
     }
   ```

2. Você pode precisar adicionar uma entrada para o host do servidor em `/etc/hosts`:

   ```
   198.51.100.11 krbauth krbauth.example.com
   ```

3. Verifique se a autenticação Kerberos funciona corretamente:

1. Use **kinit** para autenticar-se no Kerberos:

      ```
      $> kinit karl@MYSQL.LOCAL
      Password for karl@MYSQL.LOCAL: (enter password here)
      ```

O comando autentica para o principal Kerberos denominado `karl@MYSQL.LOCAL`. Digite a senha do principal quando o comando solicitar. O KDC retorna um TGT que é armazenado em cache no lado do cliente para uso por outros aplicativos que reconhecem Kerberos.

2. Use **klist** para verificar se o TGT foi obtido corretamente. A saída deve ser semelhante a esta:

      ```
      $> klist
      Ticket cache: FILE:/tmp/krb5cc_244306
      Default principal: karl@MYSQL.LOCAL

      Valid starting       Expires              Service principal
      03/23/2021 08:18:33  03/23/2021 18:18:33  krbtgt/MYSQL.LOCAL@MYSQL.LOCAL
      ```

###### Crie uma conta MySQL que use autenticação Kerberos

A autenticação MySQL usando o plugin de autenticação `authentication_kerberos` é baseada em um nome de principal de usuário Kerberos (UPN). As instruções aqui assumem que um usuário MySQL chamado `karl` autentica-se no MySQL usando Kerberos, que o domínio Kerberos é chamado `MYSQL.LOCAL` e que o nome do principal de usuário é `karl@MYSQL.LOCAL`. Este UPN deve ser registrado em vários lugares:

* O administrador do Kerberos deve registrar o nome do usuário como um principal Kerberos. Esse nome inclui um nome de domínio. Os clientes usam o nome do principal e a senha para autenticar-se com o Kerberos e obter um ticket-granting ticket (TGT).

* O DBA do MySQL deve criar uma conta que corresponda ao nome do principal Kerberos e que autentique usando o plugin Kerberos.

Suponha que o nome do principal de usuário Kerberos tenha sido registrado pelo administrador do serviço apropriado e que, conforme descrito anteriormente em Instalar Kerberos Pluggable Authentication, o servidor MySQL tenha sido iniciado com configurações apropriadas para o plugin Kerberos do lado do servidor. Para criar uma conta MySQL que corresponda a um UPN Kerberos de `user@realm_name`, o DBA do MySQL usa uma declaração como esta:

```
CREATE USER user
  IDENTIFIED WITH authentication_kerberos
  BY 'realm_name';
```

A conta denominada por *`user`* pode incluir ou omitir a parte do nome do host. Se o nome do host for omitido, ele será predefinido como `%` como de costume. O *`realm_name`* é armazenado como o valor `authentication_string` para a conta na tabela do sistema `mysql.user`.

Para criar uma conta MySQL que corresponda ao UPN `karl@MYSQL.LOCAL`, use esta declaração:

```
CREATE USER 'karl'
  IDENTIFIED WITH authentication_kerberos
  BY 'MYSQL.LOCAL';
```

Se o MySQL precisar construir o UPN para essa conta, por exemplo, para obter ou validar ingressos (TGTs ou STs), ele faz isso combinando o nome da conta (ignorando qualquer parte do nome de host) e o nome do domínio. Por exemplo, o nome completo da conta resultante da declaração anterior `CREATE USER` é `'karl'@'%'`. O MySQL constrói o UPN a partir da parte do nome do usuário `karl` (ignorando a parte do nome de host) e o nome do domínio `MYSQL.LOCAL` para produzir `karl@MYSQL.LOCAL`.

Nota

Observe que, ao criar uma conta que autentica usando `authentication_kerberos`, a declaração `CREATE USER` não inclui o domínio UPN como parte do nome do usuário. Em vez disso, especifique o domínio (`MYSQL.LOCAL` neste caso) como a string de autenticação na cláusula `BY`. Isso difere da criação de contas que usam o plugin de autenticação SASL LDAP `authentication_ldap_sasl` com o método de autenticação GSSAPI/Kerberos. Para tais contas, a declaração `CREATE USER` inclui o domínio UPN como parte do nome do usuário. Consulte Criar uma Conta MySQL que usa GSSAPI/Kerberos para Autenticação LDAP.

Com a conta configurada, os clientes podem usá-la para se conectar ao servidor MySQL. O procedimento depende se o host do cliente executa Linux ou Windows, conforme indicado na discussão a seguir.

O uso de `authentication_kerberos` está sujeito à restrição de que UPNs com a mesma parte de usuário, mas uma parte de domínio diferente, não são suportadas. Por exemplo, você não pode criar contas MySQL que correspondam a essas UPNs:

```
kate@MYSQL.LOCAL
kate@EXAMPLE.COM
```

Ambas as UPNs têm uma parte de usuário de `kate`, mas diferem na parte do domínio (`MYSQL.LOCAL` versus `EXAMPLE.COM`). Isso não é permitido.

###### Use a Conta MySQL para se conectar ao servidor MySQL

Depois que uma conta do MySQL que autentica usando Kerberos foi configurada, os clientes podem usá-la para se conectar ao servidor MySQL da seguinte forma:

1. Autentique-se no Kerberos com o nome do principal de usuário (UPN) e sua senha para obter um ticket-granting ticket (TGT).

2. Use o TGT para obter um ticket de serviço (ST) para o MySQL.  
3. Autentique-se no servidor MySQL apresentando o ST do MySQL.

O primeiro passo (autenticação no Kerberos) pode ser realizado de várias maneiras:

* Antes de se conectar ao MySQL:

+ Em Linux ou em `GSSAPI` no modo Windows, invoque o **kinit** para obter o TGT e salve-o no cache de credenciais do Kerberos.

+ Em Windows no modo `SSPI`, a autenticação já pode ter sido feita no momento do login, o que salva o TGT para o usuário conectado no cache de memória do Windows. **kinit** não é usado e não há cache Kerberos.

* Ao se conectar ao MySQL, o próprio programa cliente pode obter o TGT, se puder determinar o UPN e a senha Kerberos necessários:

+ Essas informações podem vir de fontes como opções de comando ou do sistema operacional.

+ Em Linux, os clientes também podem usar um arquivo keytab ou o arquivo de configuração `/etc/krb5.conf`. Os clientes Windows no modo `GSSAPI` usam um arquivo de configuração. Os clientes Windows no modo `SSPI` não usam nenhum.

Os detalhes dos comandos do cliente para conectar-se ao servidor MySQL diferem para Linux e Windows, então cada tipo de host é discutido separadamente, mas essas propriedades dos comandos se aplicam independentemente do tipo de host:

* Cada comando mostrado inclui as seguintes opções, mas cada uma pode ser omitida sob certas condições:

+ A opção `--default-auth` especifica o nome do plugin de autenticação do lado do cliente (`authentication_kerberos_client`). Esta opção pode ser omitida quando a opção `--user` é especificada, porque, nesse caso, o MySQL pode determinar o plugin a partir das informações da conta do usuário enviadas pelo servidor MySQL.

+ A opção `--plugin-dir` indica ao programa cliente a localização do plugin `authentication_kerberos_client`. Esta opção pode ser omitida se o plugin estiver instalado na localização padrão (incorporada).

* Os comandos também devem incluir quaisquer outras opções, como `--host` ou `--port`, que são necessárias para especificar qual servidor MySQL se conectar.

* Insira cada comando em uma única linha. Se o comando incluir uma opção `--password` para solicitar uma senha, insira a senha do Kerberos UPN associado ao usuário do MySQL quando solicitado.

**Comandos de conexão para clientes Linux**

Em Linux, o comando apropriado para se conectar ao servidor MySQL varia dependendo se o comando autentica usando um TGT do cache Kerberos ou com base nas opções de comando para o nome do usuário MySQL e a senha UPN:

* Antes de invocar o programa cliente MySQL, o usuário do cliente pode obter um TGT do KDC de forma independente do MySQL. Por exemplo, o usuário do cliente pode usar **kinit** para autenticar-se no Kerberos, fornecendo um nome de principal de usuário do Kerberos e a senha da principal:

  ```
  $> kinit karl@MYSQL.LOCAL
  Password for karl@MYSQL.LOCAL: (enter password here)
  ```

O TGT resultante para o UPN é armazenado em cache e torna-se disponível para uso por outros aplicativos que reconhecem o Kerberos, como programas que utilizam o plugin de autenticação Kerberos do lado do cliente. Neste caso, invoque o cliente sem especificar uma opção de nome de usuário ou senha:

  ```
  mysql
    --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
  ```

O plugin do lado do cliente encontra o TGT no cache, usa-o para obter um ST MySQL e usa o ST para autenticar-se no servidor MySQL.

Como descrito acima, quando o TGT para o UPN é armazenado na cache, as opções de nome de usuário e senha não são necessárias no comando do cliente. Se o comando as incluir de qualquer maneira, elas são tratadas da seguinte forma:

+ Este comando inclui uma opção de nome de usuário:

    ```
    mysql
      --default-auth=authentication_kerberos_client
      --plugin-dir=path/to/plugin/directory
      --user=karl
    ```

Neste caso, a autenticação falha se o nome de usuário especificado pela opção não corresponder à parte do nome de usuário do UPN no TGT.

+ Esse comando inclui uma opção de senha, que você deve inserir quando solicitado:

    ```
    mysql
      --default-auth=authentication_kerberos_client
      --plugin-dir=path/to/plugin/directory
      --password
    ```

Neste caso, o plugin do lado do cliente ignora a senha. Como a autenticação é baseada no TGT, pode ser bem-sucedida *mesmo que a senha fornecida pelo usuário seja incorreta*. Por essa razão, o plugin emite um aviso se um TGT válido for encontrado, o que faz com que a senha seja ignorada.

* Se o cache Kerberos não contiver TGT, o próprio plugin de autenticação Kerberos do lado do cliente pode obter o TGT do KDC. Inicie o cliente com as opções para o nome de usuário do MySQL e a senha, e, em seguida, insira a senha UPN quando solicitado:

  ```
  mysql --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --user=karl
    --password
  ```

O plugin de autenticação Kerberos do lado do cliente combina o nome do usuário (`karl`) e o domínio especificado na conta do usuário (`MYSQL.LOCAL`) para construir o UPN (`karl@MYSQL.LOCAL`). O plugin do lado do cliente usa o UPN e a senha para obter um TGT, usa o TGT para obter um ST MySQL e usa o ST para autenticar no servidor MySQL.

Ou, suponha que o cache Kerberos não contenha TGT e o comando especifique uma opção de senha, mas nenhuma opção de nome de usuário:

  ```
  mysql --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --password
  ```

O plugin de autenticação Kerberos do lado do cliente usa o nome de login do sistema operacional como o nome de usuário do MySQL. Ele combina esse nome de usuário e o domínio na conta do usuário do MySQL para construir o UPN. O plugin do lado do cliente usa o UPN e a senha para obter um TGT, usa o TGT para obter um ST do MySQL e usa o ST para autenticar no servidor MySQL.

Se você não tiver certeza se um TGT existe, você pode usar o **klist** para verificar.

Nota

Quando o próprio plugin de autenticação Kerberos do lado do cliente obtém o TGT, o usuário do cliente pode não querer que o TGT seja reutilizado. Como descrito nos Parâmetros de Configuração do Cliente para Autenticação Kerberos, o arquivo local `/etc/krb5.conf` pode ser usado para fazer com que o plugin do lado do cliente destrua o TGT quando estiver pronto para usá-lo.

**Comandos de conexão para clientes Windows no modo SSPI**

Em Windows, usando a opção de plugin padrão do lado do cliente (SSPI), o comando apropriado para se conectar ao servidor MySQL varia dependendo se o comando autentica com base nas opções de comando para o nome de usuário do MySQL ou, em vez disso, usa um TGT do cache de memória do Windows. Para obter detalhes sobre o modo GSSAPI em Windows, consulte os comandos para clientes do Windows no modo GSSAPI.

Um comando pode especificar explicitamente as opções para o nome do usuário do MySQL e a senha UPN, ou o comando pode omitir essas opções:

* Este comando inclui opções para o nome do usuário do MySQL e a senha UPN:

  ```
  mysql --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --user=karl
    --password
  ```

O plugin de autenticação Kerberos do lado do cliente combina o nome do usuário (`karl`) e o domínio especificado na conta do usuário (`MYSQL.LOCAL`) para construir o UPN (`karl@MYSQL.LOCAL`). O plugin do lado do cliente usa o UPN e a senha para obter um TGT, usa o TGT para obter um ST MySQL e usa o ST para autenticar no servidor MySQL.

Qualquer informação na cache de memória em tempo real do Windows é ignorada; os valores das opções de nome de usuário e senha têm precedência.

* Este comando inclui uma opção para a senha UPN, mas não para o nome de usuário do MySQL:

  ```
  mysql
    --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --password
  ```

O plugin de autenticação Kerberos do lado do cliente usa o nome de usuário conectado como o nome de usuário do MySQL e combina esse nome de usuário e o domínio na conta do usuário do MySQL para construir o UPN. O plugin do lado do cliente usa o UPN e a senha para obter um TGT, usa o TGT para obter um ST do MySQL e usa o ST para autenticar no servidor MySQL.

* Este comando não inclui opções para o nome do usuário do MySQL ou senha UPN:

  ```
  mysql
    --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
  ```

O plugin do lado do cliente obtém o TGT do cache de memória do Windows, usa o TGT para obter um ST MySQL e usa o ST para autenticar-se no servidor MySQL.

Essa abordagem exige que o host do cliente faça parte do domínio do Windows Server Active Directory (AD). Se esse não for o caso, ajude o cliente MySQL a descobrir o endereço IP do domínio AD, inserindo manualmente o servidor AD e o domínio como servidor DNS e prefixo:

1. Inicie `console.exe` e selecione Centro de Rede e Compartilhamento.

2. Na barra lateral da janela do Centro de Rede e Compartilhamento, selecione Alterar configurações de adaptador.

3. Na janela Conexões de rede, clique com o botão direito do mouse na conexão de rede ou VPN para configurar e selecionar Propriedades.

4. Na guia Rede, localize e clique em Protocolo de Internet versão 4 (TCP/IPv4) e, em seguida, clique em Propriedades.

5. Clique em Avançado no diálogo Propriedades da versão 4 do Protocolo de Internet (TCP/IPv4). O diálogo Configurações avançadas TCP/IP é aberto.

6. Na guia DNS, adicione o servidor do Active Directory e o domínio como um servidor e prefixo DNS.

* Este comando inclui uma opção para o nome do usuário do MySQL, mas não para a senha do UPN:

  ```
  mysql
    --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --user=karl
  ```

O plugin de autenticação Kerberos do lado do cliente compara o nome especificado pela opção nome_de_usuário contra o nome do usuário conectado. Se os nomes forem os mesmos, o plugin usa o TGT do usuário conectado para autenticação. Se os nomes forem diferentes, a autenticação falha.

**Comandos de conexão para clientes Windows no modo GSSAPI**

No Windows, o usuário do cliente deve especificar explicitamente o modo `GSSAPI` usando a opção de plugin `plugin_authentication_kerberos_client_mode` para habilitar o suporte através da biblioteca MIT Kerberos. O modo padrão é `SSPI` (consulte [Comandos para clientes Windows no modo SSPI][(kerberos-pluggable-authentication.html#kerberos-usage-win-sspi-client-commands)]).

É possível especificar o modo `GSSAPI`:

* Antes de invocar o programa cliente MySQL em um arquivo de opção. O nome da variável do plugin é válido usando underscores ou traços:

  ```
  [mysql]
  plugin_authentication_kerberos_client_mode=GSSAPI
  ```

Ou:

  ```
  [mysql]
  plugin-authentication-kerberos-client-mode=GSSAPI
  ```

* Em tempo de execução a partir da linha de comando usando os programas de cliente **mysql** ou **mysqldump**. Por exemplo, os seguintes comandos (com sublinhados ou traços) fazem com que o **mysql** se conecte ao servidor através da biblioteca MIT Kerberos no Windows.

  ```
  mysql [connection-options] --plugin_authentication_kerberos_client_mode=GSSAPI
  ```

Ou:

  ```
  mysql [connection-options] --plugin-authentication-kerberos-client-mode=GSSAPI
  ```

* Os usuários do cliente podem selecionar o modo `GSSAPI` no MySQL Workbench e em alguns conectores do MySQL. Em hosts do cliente que executam o Windows, você pode substituir a localização padrão de:

+ O arquivo de configuração do Kerberos, definindo a variável de ambiente `KRB5_CONFIG`.

+ O nome padrão do cache de credenciais com a variável de ambiente `KRB5CCNAME` (por exemplo, `KRB5CCNAME=DIR:/mydir/`).

Para informações específicas sobre plugins do lado do cliente, consulte a documentação em https://dev.mysql.com/doc/.

O comando apropriado para o cliente para se conectar ao servidor MySQL varia dependendo se o comando autentica usando um TGT do cache MIT Kerberos ou com base em opções de comando para o nome do usuário do MySQL e a senha UPN. O suporte GSSAPI através da biblioteca MIT no Windows é semelhante ao GSSAPI no Linux (consulte [Comandos para clientes Linux][(kerberos-pluggable-authentication.html#kerberos-usage-linux-client-commands)]), com as seguintes exceções:

* Os tickets são sempre recuperados ou colocados na cache MIT Kerberos nos hosts que executam o Windows.

* **kinit** funciona com Contas Funcionais em sistemas Windows que possuem permissões restritas e papéis específicos. O usuário do cliente não conhece a senha do **kinit**. Para uma visão geral, consulte <https://docs.oracle.com/en/java/javase/11/tools/kinit.html>.

* Se o usuário cliente fornecer uma senha, a biblioteca MIT Kerberos no Windows decide se deve usá-la ou confiar no ingresso existente.

* O parâmetro `destroy_tickets`, descrito nos Parâmetros de Configuração do Cliente para Autenticação Kerberos, não é suportado porque a biblioteca MIT Kerberos no Windows não suporta o membro da API exigido (`get_profile_boolean`) para ler seu valor a partir do arquivo de configuração.

###### Parâmetros de Configuração do Cliente para Autenticação Kerberos

Esta seção se aplica apenas aos hosts de clientes que executam Linux, não aos hosts de clientes que executam Windows.

Nota

Um host cliente que executa o plugin Kerberos do lado do cliente `authentication_kerberos_client` configurado para o modo `GSSAPI` geralmente suporta os parâmetros de configuração do cliente, mas a biblioteca MIT Kerberos no Windows não suporta o parâmetro `destroy_tickets` descrito nesta seção.

Se não houver um bilhete válido que concede acesso (TGT) no momento da invocação da aplicação cliente MySQL, a própria aplicação pode obter e armazenar o TGT. Se, durante o processo de autenticação Kerberos, a aplicação cliente causar que um TGT seja armazenado em cache, qualquer TGT que tenha sido adicionado pode ser destruído depois que não for mais necessário, definindo o parâmetro de configuração apropriado.

O plugin Kerberos do lado do cliente `authentication_kerberos_client` lê o arquivo local `/etc/krb5.conf`. Se este arquivo estiver ausente ou inacessível, ocorrerá um erro. Supondo que o arquivo esteja acessível, ele pode incluir uma seção opcional `[appdefaults]` para fornecer informações usadas pelo plugin. Coloque as informações dentro da parte `mysql` da seção. Por exemplo:

```
[appdefaults]
  mysql = {
    destroy_tickets = true
  }
```

O plugin do lado do cliente reconhece esses parâmetros na seção `mysql`:

* O valor `destroy_tickets` indica se o plugin do lado do cliente destrói o TGT após obtê-lo e usá-lo. Por padrão, `destroy_tickets` é `false`, mas pode ser definido como `true` para evitar a reutilização do TGT. (Essa configuração aplica-se apenas a TGTs criados pelo plugin do lado do cliente, não a TGTs criados por outros plugins ou externamente ao MySQL.)

No host do cliente, um arquivo de chave de cliente pode ser usado para obter um TGT e TS sem fornecer uma senha. Para informações sobre arquivos de chave de cliente, consulte <https://web.mit.edu/kerberos/krb5-latest/doc/basic/keytab_def.html>.

##### Depuração da Autenticação Kerberos

A variável de ambiente `AUTHENTICATION_KERBEROS_CLIENT_LOG` habilita ou desabilita a saída de depuração para autenticação Kerberos.

Nota

Apesar de `CLIENT` no nome `AUTHENTICATION_KERBEROS_CLIENT_LOG`, a mesma variável de ambiente se aplica ao plugin do lado do servidor, bem como ao plugin do lado do cliente.

No lado do servidor, os valores permitidos são 0 (desativado) e 1 (ativado). As mensagens de log são escritas no log de erro do servidor, sujeito ao nível de verbosidade do registro de erro do servidor. Por exemplo, se você estiver usando o filtro de log baseado em prioridade, a variável de sistema `log_error_verbosity` controla a verbosidade, conforme descrito na Seção 7.4.2.5, “Filtro de log baseado em prioridade (log_filter_internal)”).

Do lado do cliente, os valores permitidos são de 1 a 5 e são escritos na saída padrão de erro. O quadro a seguir mostra o significado de cada valor do nível de log.

<table summary="Permitted client-side AUTHENTICATION_KERBEROS_CLIENT_LOG log levels and corresponding meanings"><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th>Log Level</th> <th>Significado</th> </tr></thead><tbody><tr> <td>1 or not set</td> <td>Sem registro</td> </tr><tr> <td>2</td> <td>Mensagens de erro</td> </tr><tr> <td>3</td> <td>Mensagens de erro e de alerta</td> </tr><tr> <td>4</td> <td>Mensagens de erro, aviso e informações</td> </tr><tr> <td>5</td> <td>Mensagens de erro, aviso, informações e depuração</td> </tr></tbody></table>

#### 8.4.1.9 Autenticação Plugável sem Login

O plugin de autenticação de lado do servidor `mysql_no_login` impede todas as conexões do cliente em qualquer conta que o utilize. Os casos de uso para este plugin incluem:

* As contas devem ser capazes de executar programas e visualizações armazenadas com privilégios elevados, sem expor esses privilégios a usuários comuns.

* Contas proxy que nunca devem permitir login direto, mas devem ser acessadas apenas por meio de contas proxy.

A tabela a seguir mostra os nomes dos arquivos de plugin e biblioteca. O sufixo do nome do arquivo pode diferir no seu sistema. O arquivo deve estar localizado no diretório nomeado pela variável de sistema `plugin_dir`.

**Tabela 8.25 Nomes de plugins e bibliotecas para autenticação sem login**

<table summary="Names for the plugins and library file used for no-login password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>mysql_no_login</code></td> </tr><tr> <td>Client-side plugin</td> <td>None</td> </tr><tr> <td>Library file</td> <td><code>mysql_no_login.so</code></td> </tr></tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para autenticação plugável sem login:

* Instalando Autenticação Plugável sem Login
* Desinstalando Autenticação Plugável sem Login
* Usando Autenticação Plugável sem Login

Para informações gerais sobre autenticação conectada no MySQL, consulte a Seção 8.2.17, “Autenticação Conectada”. Para informações sobre usuários proxy, consulte a Seção 8.2.19, “Usuários Proxy”.

##### Instalação de Autenticação Plugável sem Login

Esta seção descreve como instalar o plugin de autenticação sem login. Para informações gerais sobre a instalação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para ser utilizável pelo servidor, o arquivo da biblioteca de plugins deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin, definindo o valor de `plugin_dir` na inicialização do servidor.

O nome de arquivo da biblioteca de plugins é `mysql_no_login`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para carregar o plugin na inicialização do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com esse método de carregamento de plugin, a opção deve ser dada toda vez que o servidor é iniciado. Por exemplo, coloque essas linhas no arquivo do servidor `my.cnf`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
[mysqld]
plugin-load-add=mysql_no_login.so
```

Após modificar `my.cnf`, reinicie o servidor para que as novas configurações sejam aplicadas.

Como alternativa, para carregar o plugin no tempo de execução, use esta declaração, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
INSTALL PLUGIN mysql_no_login SONAME 'mysql_no_login.so';
```

`INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela do sistema `mysql.plugins`, fazendo com que o servidor o carregue para cada inicialização normal subsequente, sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 7.6.2, “Obtenção de Informações do Plugin do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%login%';
+----------------+---------------+
| PLUGIN_NAME    | PLUGIN_STATUS |
+----------------+---------------+
| mysql_no_login | ACTIVE        |
+----------------+---------------+
```

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

Para associar contas do MySQL ao plugin sem login, consulte o uso do plugin de autenticação sem login.

##### Desinstalando Autenticação Plugável sem Login

O método usado para desinstalar o plugin de autenticação sem login depende de como você o instalou:

* Se você instalou o plugin na inicialização do servidor usando uma opção `--plugin-load-add`, reinicie o servidor sem a opção.

* Se você instalou o plugin em tempo de execução usando uma declaração `INSTALL PLUGIN`, ele permanece instalado mesmo após a reinicialização do servidor. Para desinstalá-lo, use `UNINSTALL PLUGIN`:

  ```
  UNINSTALL PLUGIN mysql_no_login;
  ```

##### Usando autenticação plugável sem login

Esta seção descreve como usar o plugin de autenticação sem login para impedir que as contas sejam usadas para conectar programas de cliente MySQL ao servidor. Assume-se que o servidor esteja em execução com o plugin sem login habilitado, conforme descrito em Instalar Autenticação Plugável Sem Login.

Para se referir ao plugin de autenticação sem login na cláusula `IDENTIFIED WITH` de uma declaração `CREATE USER`, use o nome `mysql_no_login`.

Uma conta que autentica usando `mysql_no_login` pode ser usada como `DEFINER` para objetos de programas armazenados e visualização. Se tal definição de objeto também incluir `SQL SECURITY DEFINER`, ela é executada com os privilégios daquela conta. Os DBAs podem usar esse comportamento para fornecer acesso a dados confidenciais ou sensíveis que são expostos apenas por meio de interfaces bem controladas.

O exemplo a seguir ilustra esses princípios. Ele define uma conta que não permite conexões de clientes e a associa a uma visão que expõe apenas certas colunas da tabela do sistema `mysql.user`:

```
CREATE DATABASE nologindb;
CREATE USER 'nologin'@'localhost'
  IDENTIFIED WITH mysql_no_login;
GRANT ALL ON nologindb.*
  TO 'nologin'@'localhost';
GRANT SELECT ON mysql.user
  TO 'nologin'@'localhost';
CREATE DEFINER = 'nologin'@'localhost'
  SQL SECURITY DEFINER
  VIEW nologindb.myview
  AS SELECT User, Host FROM mysql.user;
```

Para fornecer acesso protegido à visualização a um usuário comum, faça o seguinte:

```
GRANT SELECT ON nologindb.myview
  TO 'ordinaryuser'@'localhost';
```

Agora, o usuário comum pode usar a visualização para acessar as informações limitadas que ela apresenta:

```
SELECT * FROM nologindb.myview;
```

As tentativas do usuário de acessar colunas que não são as expostas pela visualização resultam em um erro, assim como as tentativas de seleção na visualização por usuários que não têm acesso a ela.

Nota

Como a conta `nologin` não pode ser usada diretamente, as operações necessárias para configurar os objetos que ela utiliza devem ser realizadas pela conta `root` ou uma conta semelhante que tenha os privilégios necessários para criar os objetos e definir os valores de `DEFINER`.

O plugin `mysql_no_login` também é útil em cenários de proxy. (Para uma discussão sobre os conceitos envolvidos em proxy, consulte a Seção 8.2.19, “Usuários de Proxy”.) Uma conta que autentica usando `mysql_no_login` pode ser usada como um usuário proxy para contas proxy:

```
-- create proxied account
CREATE USER 'proxied_user'@'localhost'
  IDENTIFIED WITH mysql_no_login;
-- grant privileges to proxied account
GRANT ...
  ON ...
  TO 'proxied_user'@'localhost';
-- permit proxy_user to be a proxy account for proxied account
GRANT PROXY
  ON 'proxied_user'@'localhost'
  TO 'proxy_user'@'localhost';
```

Isso permite que os clientes acessem o MySQL através da conta do proxy (`proxy_user`) mas não para contornar o mecanismo do proxy conectando-se diretamente como o usuário proxy (`proxied_user`). Um cliente que se conecta usando a conta `proxy_user` tem os privilégios da conta `proxied_user`, mas o próprio `proxied_user` não pode ser usado para se conectar.

Para métodos alternativos de proteção de contas proxy contra o uso direto, consulte Prevenindo o login direto em contas proxy.

#### 8.4.1.10 Peer-Credential Pluggable Authentication de Soquete

O plugin de autenticação `auth_socket` do lado do servidor autentica clientes que se conectam a partir do host local através do arquivo de socket Unix. O plugin usa a opção de socket `SO_PEERCRED` para obter informações sobre o usuário que está executando o programa cliente. Assim, o plugin só pode ser usado em sistemas que suportam a opção `SO_PEERCRED`, como o Linux.

O código-fonte deste plugin pode ser examinado como um exemplo relativamente simples que demonstra como escrever um plugin de autenticação carregável.

A tabela a seguir mostra os nomes dos arquivos de plugin e biblioteca. O arquivo deve estar localizado no diretório nomeado pela variável de sistema `plugin_dir`.

**Tabela 8.26 Nomes de plugins e bibliotecas para autenticação de pares de rede Socket**

<table summary="Names for the plugins and library file used for socket peer-credential password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>auth_socket</code></td> </tr><tr> <td>Client-side plugin</td> <td>None, see discussion</td> </tr><tr> <td>Library file</td> <td><code>auth_socket.so</code></td> </tr></tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para autenticação com plugue de soquete:

* Instalar Autenticação de Conexão Conectada
* Desinstalar Autenticação de Conexão Conectada
* Usar Autenticação de Conexão Conectada

Para informações gerais sobre autenticação conectada no MySQL, consulte a Seção 8.2.17, “Autenticação Conectada”.

##### Instalação de Autenticação de Conexão Conectada

Esta seção descreve como instalar o plugin de autenticação de socket. Para informações gerais sobre a instalação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para ser utilizável pelo servidor, o arquivo da biblioteca de plugins deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin, definindo o valor de `plugin_dir` na inicialização do servidor.

Para carregar o plugin na inicialização do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com este método de carregamento de plugins, a opção deve ser dada toda vez que o servidor é iniciado. Por exemplo, coloque essas linhas no arquivo do servidor `my.cnf`:

```
[mysqld]
plugin-load-add=auth_socket.so
```

Após modificar `my.cnf`, reinicie o servidor para que as novas configurações sejam aplicadas.

Como alternativa, para carregar o plugin no tempo de execução, use esta declaração:

```
INSTALL PLUGIN auth_socket SONAME 'auth_socket.so';
```

`INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela do sistema `mysql.plugins`, fazendo com que o servidor o carregue para cada inicialização normal subsequente, sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 7.6.2, “Obtenção de Informações do Plugin do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%socket%';
+-------------+---------------+
| PLUGIN_NAME | PLUGIN_STATUS |
+-------------+---------------+
| auth_socket | ACTIVE        |
+-------------+---------------+
```

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

Para associar contas do MySQL ao plugin de soquete, consulte o uso do Autenticação de Soquete Plugável.

##### Desinstalação da Autenticação Conectada por Conectores de Soquete

O método usado para desinstalar o plugin de autenticação de socket depende de como você o instalou:

* Se você instalou o plugin na inicialização do servidor usando uma opção `--plugin-load-add`, reinicie o servidor sem a opção.

* Se você instalou o plugin em tempo de execução usando uma declaração `INSTALL PLUGIN`, ele permanece instalado mesmo após a reinicialização do servidor. Para desinstalá-lo, use `UNINSTALL PLUGIN`:

  ```
  UNINSTALL PLUGIN auth_socket;
  ```

##### Uso do Autenticação Conectada por Conectores de Soquete

O plugin de soquete verifica se o nome do usuário do socket (o nome do usuário do sistema operacional) corresponde ao nome do usuário do MySQL especificado pelo programa cliente para o servidor. Se os nomes não corresponderem, o plugin verifica se o nome do usuário do socket corresponde ao nome especificado na coluna `authentication_string` da linha da tabela do sistema `mysql.user`. Se uma correspondência for encontrada, o plugin permite a conexão. O valor `authentication_string` pode ser especificado usando uma cláusula `IDENTIFIED ...AS` com `CREATE USER` ou `ALTER USER`.

Suponha que uma conta MySQL seja criada para um usuário do sistema operacional chamado `valerie` que deve ser autenticado pelo plugin `auth_socket` para conexões do host local através do arquivo de soquete:

```
CREATE USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket;
```

Se um usuário no host local com um nome de login de `stefanie` invocar o **mysql** com a opção `--user=valerie` para se conectar através do arquivo de soquete, o servidor usa `auth_socket` para autenticar o cliente. O plugin determina que o valor da opção `--user` (`valerie`) difere do nome do usuário do cliente (`stephanie`) e recusa a conexão. Se um usuário com o nome de `valerie` tentar a mesma coisa, o plugin descobre que o nome do usuário e o nome do usuário do MySQL são ambos `valerie` e permite a conexão. No entanto, o plugin recusa a conexão mesmo para `valerie` se a conexão for feita usando um protocolo diferente, como TCP/IP.

Para permitir que os usuários do sistema operacional `valerie` e `stephanie` acessem o MySQL por meio de conexões de arquivo de soquete que utilizem a conta, isso pode ser feito de duas maneiras:

* Nomeie ambos os usuários no momento da criação da conta, um seguindo `CREATE USER`, e o outro na string de autenticação:

  ```
  CREATE USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket AS 'stephanie';
  ```

* Se você já usou `CREATE USER` para criar a conta para um único usuário, use (create-user.html "15.7.1.3 CREATE USER Statement") para adicionar o segundo usuário:

  ```
  CREATE USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket;
  ALTER USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket AS 'stephanie';
  ```

Para acessar a conta, tanto o `valerie` quanto o `stephanie` especificam o `--user=valerie` no momento da conexão.

#### 8.4.1.11 Autenticação Desconectada FIDO

Nota

A autenticação FIDO pluggable é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL suporta um método de autenticação que permite que os usuários se autentiquem no MySQL Server usando autenticação FIDO. Esse método de autenticação é descontinuado a partir do MySQL 8.0.35 e está sujeito à remoção em uma versão futura do MySQL. Para funcionalidades semelhantes, considere fazer o upgrade para o MySQL 8.2 (ou superior), onde os usuários podem se autenticar no MySQL Server usando autenticação [WebAuthn][(/doc/refman/8.4/en/webauthn-pluggable-authentication.html)]. Você precisa entender o modelo de lançamento para inovações e versões de suporte a longo prazo (LTS) do MySQL antes de prosseguir com o upgrade. Para mais informações, consulte a Seção 3.2, “Caminhos de Upgrade”.

FIDO significa Fast Identity Online, que fornece padrões de autenticação que não exigem o uso de senhas.

A autenticação FIDO pluggable oferece essas capacidades:

* O FIDO permite a autenticação no servidor MySQL usando dispositivos como cartões inteligentes, chaves de segurança e leitores biométricos.

* Como a autenticação pode ocorrer de forma diferente da fornecimento de uma senha, o FIDO permite a autenticação sem senha.

* Por outro lado, a autenticação de dispositivo é frequentemente usada em conjunto com a autenticação por senha, portanto, a autenticação FIDO pode ser usada com bons resultados para contas do MySQL que utilizam autenticação multifator; veja a Seção 8.2.18, “Autenticação Multifator”.

O quadro a seguir mostra os nomes dos arquivos de plugin e biblioteca. O sufixo do nome do arquivo pode diferir no seu sistema. Sufixos comuns são `.so` para sistemas Unix e similares ao Unix, e `.dll` para Windows. O arquivo deve estar localizado no diretório nomeado pela variável de sistema `plugin_dir`. Para informações de instalação, consulte Instalar FIDO Pluggable Authentication.

**Tabela 8.27 Nomes de plugins e bibliotecas para autenticação FIDO**

<table summary="Names for the plugins and library file used for FIDO authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>authentication_fido</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>authentication_fido_client</code></td> </tr><tr> <td>Library file</td> <td><code>authentication_fido.so</code>, <code>authentication_fido_client.so</code></td> </tr></tbody></table>

Nota

Uma biblioteca `libfido2` deve estar disponível em sistemas onde o plugin de autenticação FIDO do lado do servidor ou do lado do cliente é usado. Se uma máquina hospedeira tiver mais de um dispositivo FIDO, a biblioteca `libfido2` decide qual dispositivo usar para registro e autenticação. A biblioteca `libfido2` não oferece uma facilidade para seleção de dispositivo.

O plugin de autenticação FIDO do lado do servidor é incluído apenas na Edição Empresarial do MySQL. Não é incluído nas distribuições comunitárias do MySQL. O plugin do lado do cliente é incluído em todas as distribuições, incluindo as distribuições comunitárias, o que permite que clientes de qualquer distribuição se conectem a um servidor que tenha o plugin do lado do servidor carregado.

As seções a seguir fornecem informações de instalação e uso específicas para autenticação plugável FIDO:

* Instalar FIDO Pluggable Authentication
* Usar autenticação FIDO
* Autenticação FIDO sem senha
* Descadastro de dispositivo FIDO
* Como a autenticação FIDO de usuários do MySQL funciona

Para informações gerais sobre autenticação conectada no MySQL, consulte a Seção 8.2.17, “Autenticação Conectada”.

##### Instalação do FIDO Pluggable Authentication

Esta seção descreve como instalar o plugin de autenticação FIDO do lado do servidor. Para informações gerais sobre a instalação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para ser utilizável pelo servidor, o arquivo da biblioteca de plugins deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin, definindo o valor de `plugin_dir` na inicialização do servidor.

O nome de arquivo da biblioteca de plugins do lado do servidor é `authentication_fido`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para Unix e sistemas semelhantes ao Unix, `.dll` para Windows).

Para carregar o plugin na inicialização do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com este método de carregamento de plugin, a opção deve ser dada toda vez que o servidor é iniciado.

Para carregar o plugin, coloque uma linha como esta em seu arquivo `my.cnf`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
[mysqld]
plugin-load-add=authentication_fido.so
```

Após modificar `my.cnf`, reinicie o servidor para que o novo ajuste seja aplicado.

Como alternativa, para carregar o plugin no tempo de execução, use esta declaração, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
INSTALL PLUGIN authentication_fido
  SONAME 'authentication_fido.so';
```

`INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela do sistema `mysql.plugins`, fazendo com que o servidor o carregue para cada inicialização normal subsequente, sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 7.6.2, “Obtenção de Informações do Plugin do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME = 'authentication_fido';
+---------------------+---------------+
| PLUGIN_NAME         | PLUGIN_STATUS |
+---------------------+---------------+
| authentication_fido | ACTIVE        |
+---------------------+---------------+
```

Se um plugin não conseguir se inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

Para associar contas do MySQL ao plugin de autenticação FIDO, consulte o uso da autenticação FIDO.

##### Uso da Autenticação FIDO

A autenticação FIDO é tipicamente usada no contexto da autenticação multifatorial (consulte a Seção 8.2.18, “Autenticação Multifatorial”). Esta seção mostra como incorporar a autenticação baseada em dispositivos FIDO em uma conta multifatorial, usando o plugin `authentication_fido`.

Na discussão a seguir, assume-se que o servidor está em execução com o plugin de autenticação FIDO do lado do servidor habilitado, conforme descrito em Instalar FIDO Pluggable Authentication, e que o plugin FIDO do lado do cliente está disponível no diretório de plugins no host do cliente.

Nota

Em Windows, a autenticação FIDO funciona apenas se o processo do cliente estiver executando como um usuário com privilégios de administrador.

Também se assume que a autenticação FIDO é usada em conjunto com autenticação não FIDO (o que implica uma conta de 2FA ou 3FA). O FIDO também pode ser usado por si só para criar contas 1FA que se autenticam de forma sem senha. Neste caso, o processo de configuração difere um pouco. Para instruções, consulte Autenticação FIDO sem senha.

Uma conta configurada para usar o plugin `authentication_fido` está associada a um dispositivo FIDO. Por isso, é necessário um passo de registro único do dispositivo antes que a autenticação FIDO possa ocorrer. O processo de registro do dispositivo tem essas características:

* Qualquer dispositivo FIDO associado a uma conta deve ser registrado antes que a conta possa ser usada.

* O registro exige que um dispositivo FIDO esteja disponível no host do cliente, ou o registro falha.

* O usuário deve realizar a ação apropriada do dispositivo FIDO quando solicitado durante o registro (por exemplo, tocar no dispositivo ou realizar uma varredura biométrica).

* Para realizar o registro do dispositivo, o usuário do cliente deve invocar o programa cliente **mysql** ou o Shell MySQL e especificar a opção `--fido-register-factor` para especificar o fator ou fatores para os quais um dispositivo está sendo registrado. Por exemplo, se a conta estiver configurada para usar FIDO como o segundo fator de autenticação, o usuário invoca o **mysql** com a opção `--fido-register-factor=2`.

* Se a conta do usuário estiver configurada com o plugin `authentication_fido` definido como o segundo ou terceiro fator, a autenticação para todos os fatores anteriores deve ser bem-sucedida antes que o passo de registro possa prosseguir.

* O servidor sabe, com base nas informações da conta do usuário, se o dispositivo FIDO requer registro ou já foi registrado. Quando o programa de cliente se conecta, o servidor coloca a sessão do cliente no modo sandbox se o dispositivo precisar ser registrado, para que o registro ocorra antes de qualquer outra coisa ser feita. O modo sandbox usado para o registro do dispositivo FIDO é semelhante ao usado para o tratamento de senhas expiradas. Veja a Seção 8.2.16, “Tratamento do servidor de senhas expiradas”.

* No modo sandbox, não são permitidas declarações que não sejam `ALTER USER`. O registro é realizado usando formas desta declaração. Quando invocado com a opção `--fido-register-factor`, o cliente **mysql** gera as declarações `ALTER USER` necessárias para realizar o registro. Após o registro ter sido concluído, o servidor desvia a sessão do modo sandbox, e o cliente pode prosseguir normalmente. Para informações sobre as declarações `ALTER USER` geradas, consulte a descrição `--fido-register-factor`.

* Quando o registro do dispositivo foi realizado para a conta, o servidor atualiza a linha da tabela do sistema `mysql.user` para essa conta para atualizar o status do registro do dispositivo e armazenar a chave pública e o ID de credencial.

* O passo de registro só pode ser realizado pelo usuário nomeado na conta. Se um usuário tentar realizar o registro para outro usuário, ocorrerá um erro.

* O usuário deve usar o mesmo dispositivo FIDO durante o registro e autenticação. Se, após registrar um dispositivo FIDO no host do cliente, o dispositivo for redefinido ou um dispositivo diferente for inserido, a autenticação falha. Nesse caso, o dispositivo associado à conta deve ser desregistrado e o registro deve ser feito novamente.

Suponha que você queira uma conta para se autenticar primeiro usando o plugin `caching_sha2_password` e, em seguida, usando o plugin `authentication_fido`. Crie uma conta multifator usando uma declaração como esta:

```
CREATE USER 'u2'@'localhost'
  IDENTIFIED WITH caching_sha2_password
    BY 'sha2_password'
  AND IDENTIFIED WITH authentication_fido;
```

Para se conectar, forneça a senha do fator 1 para satisfazer a autenticação desse fator e, para iniciar o registro do dispositivo FIDO, defina o `--fido-register-factor` para o fator 2.

```
$> mysql --user=u2 --password1 --fido-register-factor=2
Enter password: (enter factor 1 password)
```

Assim que a senha do fator 1 for aceita, a sessão do cliente entra no modo sandbox para que o registro do dispositivo possa ser realizado para o fator 2. Durante o registro, você será solicitado a realizar a ação apropriada do dispositivo FIDO, como tocar no dispositivo ou realizar uma varredura biométrica.

Quando o processo de registro estiver concluído, a conexão com o servidor será permitida.

Nota

A conexão com o servidor é permitida após o registro, independentemente dos fatores de autenticação adicionais na cadeia de autenticação da conta. Por exemplo, se a conta no exemplo anterior fosse definida com um terceiro fator de autenticação (usando autenticação não FIDO), a conexão seria permitida após um registro bem-sucedido sem autenticar o terceiro fator. No entanto, conexões subsequentes exigiriam autenticar todos os três fatores.

Autenticação sem senha FIDO

Esta seção descreve como o FIDO pode ser usado sozinho para criar contas de 1FA que se autenticam de maneira sem senha. Neste contexto, “sem senha” significa que a autenticação ocorre, mas usa um método diferente de uma senha, como uma chave de segurança ou uma varredura biométrica. Isso não se refere a uma conta que usa um plugin de autenticação baseado em senha, para o qual a senha é vazia. Esse tipo de “sem senha” é completamente inseguro e não é recomendado.

Os seguintes pré-requisitos se aplicam ao uso do plugin `authentication_fido` para obter autenticação sem senha:

* O usuário que cria uma conta de autenticação sem senha requer o privilégio `PASSWORDLESS_USER_ADMIN`, além do privilégio `CREATE USER`](privileges-provided.html#priv_create-user).

* O primeiro elemento do valor `authentication_policy` deve ser um asterisco (`*`) e não o nome de um plugin. Por exemplo, o valor padrão `authentication_policy` suporta a autenticação sem senha porque o primeiro elemento é um asterisco:

  ```
  authentication_policy='*,,'
  ```

Para obter informações sobre a configuração do valor `authentication_policy`, consulte Configurando a Política de Autenticação Multifator.

Para usar `authentication_fido` como um método de autenticação sem senha, a conta deve ser criada com `authentication_fido` como o primeiro método de autenticação de fator. A cláusula `INITIAL AUTHENTICATION IDENTIFIED BY` também deve ser especificada para o primeiro fator (não é suportada com fatores 2º ou 3º). Esta cláusula especifica se uma senha gerada aleatoriamente ou especificada pelo usuário será usada para o registro do dispositivo FIDO. Após o registro do dispositivo, o servidor exclui a senha e modifica a conta para fazer com que `authentication_fido` seja o único método de autenticação (o método 1FA).

A sintaxe necessária para o `CREATE USER` é a seguinte:

```
CREATE USER user
  IDENTIFIED WITH authentication_fido
  INITIAL AUTHENTICATION IDENTIFIED BY {RANDOM PASSWORD | 'auth_string'};
```

O exemplo a seguir utiliza a sintaxe `RANDOM PASSWORD`:

```
mysql> CREATE USER 'u1'@'localhost'
         IDENTIFIED WITH authentication_fido
         INITIAL AUTHENTICATION IDENTIFIED BY RANDOM PASSWORD;
+------+-----------+----------------------+-------------+
| user | host      | generated password   | auth_factor |
+------+-----------+----------------------+-------------+
| u1   | localhost | 9XHK]M{l2rnD;VXyHzeF |           1 |
+------+-----------+----------------------+-------------+
```

Para realizar o registro, o usuário deve autenticar-se no servidor com a senha associada à cláusula `INITIAL AUTHENTICATION IDENTIFIED BY`, seja a senha gerada aleatoriamente, seja o valor da `'auth_string'`. Se a conta foi criada como mostrado anteriormente, o usuário executa este comando e cola a senha gerada aleatoriamente anterior (`9XHK]M{l2rnD;VXyHzeF`) na prompt:

```
$> mysql --user=u1 --password --fido-register-factor=2
Enter password:
```

A opção `--fido-register-factor=2` é usada porque a cláusula `INITIAL AUTHENTICATION IDENTIFIED BY` está atuando atualmente como o primeiro método de autenticação de fator. Portanto, o usuário deve fornecer a senha temporária usando o segundo fator. Após um registro bem-sucedido, o servidor remove a senha temporária e revisa a entrada da conta na tabela do sistema `mysql.user` para listar `authentication_fido` como o único método de autenticação (1FA).

Ao criar uma conta de autenticação sem senha, é importante incluir a cláusula `INITIAL AUTHENTICATION IDENTIFIED BY` na declaração `CREATE USER`. O servidor aceitará uma declaração sem a cláusula, mas a conta resultante será inutilizável, pois não há como se conectar ao servidor para registrar o dispositivo. Suponha que você execute uma declaração como esta:

```
CREATE USER 'u2'@'localhost'
  IDENTIFIED WITH authentication_fido;
```

As tentativas subsequentes de usar a conta para se conectar falham assim:

```
$> mysql --user=u2 --skip-password
Failed to open FIDO device.
ERROR 1 (HY000): Unknown MySQL error
```

Nota

A autenticação sem senha é alcançada usando o protocolo Universal 2nd Factor (U2F), que não suporta medidas de segurança adicionais, como definir um PIN no dispositivo a ser registrado. Portanto, é responsabilidade do titular do dispositivo garantir que o dispositivo seja manuseado de maneira segura.

Descadastro do Dispositivo FIDO #####

É possível desinscrever dispositivos FIDO associados a uma conta MySQL. Isso pode ser desejável ou necessário em várias circunstâncias:

* Um dispositivo FIDO deve ser substituído por um dispositivo diferente. O dispositivo anterior deve ser desregistrado e o novo dispositivo deve ser registrado.

Neste caso, o proprietário da conta ou qualquer usuário que tenha o privilégio `CREATE USER` pode desinscrever o dispositivo. O proprietário da conta pode registrar o novo dispositivo.

* Um dispositivo FIDO é redefinido ou perdido. As tentativas de autenticação falharão até que o dispositivo atual seja desregistrado e um novo registro seja realizado.

Neste caso, o proprietário da conta, não podendo autenticar, não pode desinscrever o dispositivo atual e deve entrar em contato com o DBA (ou qualquer usuário que tenha o privilégio `CREATE USER` para fazer isso). Em seguida, o proprietário da conta pode re-inscrever o dispositivo redefinido ou registrar um novo dispositivo.

O descadastro de um dispositivo FIDO pode ser feito pelo proprietário da conta ou por qualquer usuário que tenha o privilégio [[`CREATE USER`][(create-user.html "15.7.1.3 CREATE USER Statement")]]. Use a seguinte sintaxe:

```
ALTER USER user {2 | 3} FACTOR UNREGISTER;
```

Para re-registrar um dispositivo ou realizar um novo registro, consulte as instruções em Usar autenticação FIDO.

##### Como a Autenticação FIDO de Usuários do MySQL Funciona

Esta seção fornece uma visão geral de como o MySQL e o FIDO trabalham juntos para autenticar usuários do MySQL. Para exemplos que mostram como configurar contas do MySQL para usar os plugins de autenticação FIDO, consulte Usando autenticação FIDO.

Uma conta que utiliza autenticação FIDO deve realizar uma etapa de registro inicial do dispositivo antes de poder se conectar ao servidor. Após o dispositivo ter sido registrado, a autenticação pode prosseguir. O processo de registro de dispositivo FIDO é o seguinte:

1. O servidor envia um desafio aleatório, ID do usuário e ID da parte confiável (que identifica de forma única um servidor) ao cliente. O ID da parte confiável é definido pela variável de sistema `authentication_fido_rp_id`. O valor padrão é `MySQL`.

O cliente recebe essas informações e as envia para o plugin de autenticação FIDO do lado do cliente, que, por sua vez, as fornece ao dispositivo FIDO.

3. Após o usuário realizar a ação apropriada no dispositivo (por exemplo, tocar no dispositivo ou realizar uma varredura biométrica), o dispositivo FIDO gera um par de chaves pública/privada, um handle de chave, um certificado X.509 e uma assinatura, que é devolvida ao servidor.

4. O plugin de autenticação FIDO do lado do servidor verifica a assinatura. Após a verificação bem-sucedida, o servidor armazena o ID de credencial e a chave pública na tabela do sistema `mysql.user`.

Após o registro ter sido realizado com sucesso, a autenticação FIDO segue este processo:

1. O servidor envia um desafio aleatório, ID do usuário, ID da parte confiável e credenciais ao cliente.

2. O cliente envia as mesmas informações para o dispositivo FIDO. 3. O dispositivo FIDO solicita ao usuário que realize a ação apropriada do dispositivo, com base na seleção feita durante o registro.

4. Essa ação desbloqueia a chave privada e o desafio é assinado.

5. Esse desafio assinado é devolvido ao servidor. 6. O plugin de autenticação FIDO do lado do servidor verifica a assinatura com a chave pública e responde para indicar o sucesso ou o fracasso da autenticação.

#### 8.4.1.12 Teste de Autenticação Conectada

O MySQL inclui um plugin de teste que verifica as credenciais da conta e registra o sucesso ou o fracasso no registro de erros do servidor. Este é um plugin carregável (não integrado) e deve ser instalado antes do uso.

O código-fonte do plugin de teste é separado do código-fonte do servidor, ao contrário do plugin nativo integrado, então ele pode ser examinado como um exemplo relativamente simples que demonstra como escrever um plugin de autenticação carregável.

Nota

Este plugin é destinado a fins de teste e desenvolvimento e não deve ser usado em ambientes de produção ou em servidores que estejam expostos a redes públicas.

A tabela a seguir mostra os nomes dos arquivos de plugin e biblioteca. O sufixo do nome do arquivo pode diferir no seu sistema. O arquivo deve estar localizado no diretório nomeado pela variável de sistema `plugin_dir`.

**Tabela 8.28 Nomes de plugins e bibliotecas para autenticação de teste**

<table summary="Names for the plugins and library file used for test password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>test_plugin_server</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>auth_test_plugin</code></td> </tr><tr> <td>Library file</td> <td><code>auth_test_plugin.so</code></td> </tr></tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para autenticação testável:

* Instalar Autenticação Conectada a Testes * Desinstalar Autenticação Conectada a Testes * Usar Autenticação Conectada a Testes

Para informações gerais sobre autenticação conectada no MySQL, consulte a Seção 8.2.17, “Autenticação Conectada”.

##### Instalação de Pluggable Authentication Test

Esta seção descreve como instalar o plugin de autenticação de teste do lado do servidor. Para informações gerais sobre a instalação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para ser utilizável pelo servidor, o arquivo da biblioteca de plugins deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin, definindo o valor de `plugin_dir` na inicialização do servidor.

Para carregar o plugin na inicialização do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com esse método de carregamento de plugin, a opção deve ser dada toda vez que o servidor é iniciado. Por exemplo, coloque essas linhas no arquivo do servidor `my.cnf`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
[mysqld]
plugin-load-add=auth_test_plugin.so
```

Após modificar `my.cnf`, reinicie o servidor para que as novas configurações sejam aplicadas.

Como alternativa, para carregar o plugin no tempo de execução, use esta declaração, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
INSTALL PLUGIN test_plugin_server SONAME 'auth_test_plugin.so';
```

`INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela do sistema `mysql.plugins`, fazendo com que o servidor o carregue para cada inicialização normal subsequente, sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 7.6.2, “Obtenção de Informações do Plugin do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%test_plugin%';
+--------------------+---------------+
| PLUGIN_NAME        | PLUGIN_STATUS |
+--------------------+---------------+
| test_plugin_server | ACTIVE        |
+--------------------+---------------+
```

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

Para associar contas do MySQL ao plugin de teste, consulte o uso de autenticação testável.

##### Desinstalando a Autenticação Testável Plugável

O método usado para desinstalar o plugin de autenticação de teste depende de como você o instalou:

* Se você instalou o plugin na inicialização do servidor usando uma opção `--plugin-load-add`, reinicie o servidor sem a opção.

* Se você instalou o plugin em tempo de execução usando uma declaração `INSTALL PLUGIN`, ele permanece instalado mesmo após a reinicialização do servidor. Para desinstalá-lo, use `UNINSTALL PLUGIN`:

  ```
  UNINSTALL PLUGIN test_plugin_server;
  ```

##### Usando Pluggable Authentication Test

Para usar o plugin de autenticação de teste, crie uma conta e nomeie esse plugin na cláusula `IDENTIFIED WITH`:

```
CREATE USER 'testuser'@'localhost'
IDENTIFIED WITH test_plugin_server
BY 'testpassword';
```

O plugin de autenticação de teste também exige a criação de um usuário proxy da seguinte forma:

```
CREATE USER testpassword@localhost;
GRANT PROXY ON testpassword@localhost TO testuser@localhost;
```

Em seguida, forneça as opções `--user` e `--password` para essa conta ao se conectar ao servidor. Por exemplo:

```
$> mysql --user=testuser --password
Enter password: testpassword
```

O plugin obtém a senha recebida do cliente e a compara com o valor armazenado na coluna `authentication_string` da linha da conta na tabela do sistema `mysql.user`. Se os dois valores corresponderem, o plugin retorna o valor `authentication_string` como o novo ID de usuário efetivo.

Você pode procurar no registro de erro do servidor uma mensagem que indique se a autenticação foi bem-sucedida (observe que a senha é relatada como o “usuário”):

```
[Note] Plugin test_plugin_server reported:
'successfully authenticated user testpassword'
```

#### 8.4.1.13 Variáveis do Sistema de Autenticação Conectada

Essas variáveis não estão disponíveis, a menos que o plugin apropriado do lado do servidor esteja instalado:

* `authentication_ldap_sasl` para variáveis de sistema com nomes na forma `authentication_ldap_sasl_xxx`

* `authentication_ldap_simple` para variáveis de sistema com nomes na forma `authentication_ldap_simple_xxx`

**Tabela 8.29 Resumo das variáveis do sistema de plugin de autenticação**

<table frame="box" rules="all" summary="Reference for authentication plugin system variables."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th scope="col">Name</th> <th scope="col">Cmd-Line</th> <th scope="col">Option File</th> <th scope="col">System Var</th> <th scope="col">Status Var</th> <th scope="col">Var Scope</th> <th scope="col">Dynamic</th> </tr></thead><tbody><tr><th scope="row">authentication_fido_rp_id</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_kerberos_service_key_tab</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">authentication_kerberos_service_principal</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_auth_method_name</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_bind_base_dn</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_bind_root_dn</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_bind_root_pwd</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_ca_path</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_group_search_attr</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_group_search_filter</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_init_pool_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_log_status</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_max_pool_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_referral</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_server_host</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_server_port</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_tls</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_user_search_attr</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_auth_method_name</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_bind_base_dn</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_bind_root_dn</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_bind_root_pwd</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_ca_path</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_group_search_attr</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_group_search_filter</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_init_pool_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_log_status</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_max_pool_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_referral</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_server_host</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_server_port</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_tls</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_user_search_attr</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_policy</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_windows_log_level</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">authentication_windows_use_principal_name</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr></tbody></table>

* `authentication_fido_rp_id`

  <table frame="box" rules="all" summary="Properties for authentication_fido_rp_id"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-fido-rp-id=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.27</td> </tr><tr><th>Deprecated</th> <td>8.0.35</td> </tr><tr><th>System Variable</th> <td><code>authentication_fido_rp_id</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>MySQL</code></td> </tr></tbody></table>

Esta variável especifica o ID da parte dependente usada para o registro do dispositivo FIDO e autenticação FIDO. Se a autenticação FIDO for realizada e este valor não for o esperado pelo dispositivo FIDO, o dispositivo assume que não está falando com o servidor correto e ocorre um erro. O comprimento máximo do valor é de 255 caracteres.

Nota

A partir do MySQL 8.0.35, essa variável do plugin é desatualizada e sujeita à remoção em um lançamento futuro do MySQL.

* `authentication_kerberos_service_key_tab`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>Introduced</th> <td>8.0.26</td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_key_tab</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>

O nome do arquivo de tabela de chave do lado do servidor (keytab) que contém as chaves do serviço Kerberos para autenticar os ingressos do serviço MySQL recebidos dos clientes. O nome do arquivo deve ser fornecido como um nome de caminho absoluto. Se essa variável não for definida, o padrão é `mysql.keytab` no diretório de dados.

O arquivo deve existir e conter uma chave válida para o nome do principal do serviço (SPN) ou a autenticação dos clientes falhará. (O SPN e a mesma chave também devem ser criados no servidor Kerberos.) O arquivo pode conter vários nomes de principais de serviço e suas respectivas combinações de chave.

O arquivo deve ser gerado pelo administrador do servidor Kerberos e copiado para um local acessível pelo servidor MySQL. O arquivo pode ser validado para garantir que ele esteja correto e que tenha sido copiado corretamente usando este comando:

  ```
  klist -k file_name
  ```

Para informações sobre arquivos keytab, consulte <https://web.mit.edu/kerberos/krb5-latest/doc/basic/keytab_def.html>.

* `authentication_kerberos_service_principal`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.26</td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_principal</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql/host_name@realm_name</code></td> </tr></tbody></table>

O nome do principal do serviço Kerberos (SPN) que o servidor MySQL envia aos clientes.

O valor é composto pelo nome do serviço (`mysql`), um nome de host e um nome de domínio. O valor padrão é `mysql/host_name@realm_name`. O domínio no nome do principal do serviço permite a recuperação da chave exata do serviço.

Para usar um valor não padrão, defina o valor usando o mesmo formato. Por exemplo, para usar um nome de host de `krbauth.example.com` e um domínio de `MYSQL.LOCAL`, defina `authentication_kerberos_service_principal` para `mysql/krbauth.example.com@MYSQL.LOCAL`.

O nome do principal do serviço e a chave do serviço devem estar já presentes no banco de dados gerenciado pelo servidor KDC.

Pode haver nomes de nomes principais de serviço que diferem apenas pelo nome do domínio.

* `authentication_ldap_sasl_auth_method_name`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>SCRAM-SHA-1</code></td> </tr><tr><th>Valores válidos (≥ 8.0.23)</th> <td><p class="valid-value"><code>SCRAM-SHA-1</code></p><p class="valid-value"><code>SCRAM-SHA-256</code></p><p class="valid-value"><code>GSSAPI</code></p></td> </tr><tr><th>Valores válidos (≥ 8.0.20, ≤ 8.0.22)</th> <td><p class="valid-value"><code>SCRAM-SHA-1</code></p><p class="valid-value"><code>GSSAPI</code></p></td> </tr><tr><th>Valores válidos (≤ 8.0.19)</th> <td><code>SCRAM-SHA-1</code></td> </tr></tbody></table>

Para autenticação SASL LDAP, o nome do método de autenticação. A comunicação entre o plugin de autenticação e o servidor LDAP ocorre de acordo com este método de autenticação para garantir a segurança da senha.

Estes são os valores permitidos para o método de autenticação:

+ `SCRAM-SHA-1`: Use um mecanismo de desafio-resposta SASL.

O plugin `authentication_ldap_sasl_client` do lado do cliente comunica-se com o servidor SASL, usando a senha para criar um desafio e obter um buffer de solicitação SASL, e, em seguida, passa esse buffer para o plugin SASL LDAP do lado do servidor `authentication_ldap_sasl`. Os plugins SASL LDAP do lado do cliente e do lado do servidor usam mensagens SASL para a transmissão segura de credenciais dentro do protocolo LDAP, para evitar o envio da senha em texto claro entre o cliente e o servidor MySQL.

+ `SCRAM-SHA-256`: Use um mecanismo de desafio-resposta SASL.

Este método é semelhante ao `SCRAM-SHA-1`, mas é mais seguro. Está disponível no MySQL 8.0.23 e superior. Requer um servidor OpenLDAP construído usando Cyrus SASL 2.1.27 ou superior.

+ `GSSAPI`: Use o Kerberos, um protocolo sem senha e baseado em ingressos.

O GSSAPI/Kerberos é suportado como um método de autenticação para clientes e servidores MySQL apenas no Linux. É útil em ambientes Linux onde os aplicativos acessam o LDAP usando o Microsoft Active Directory, que tem Kerberos habilitado por padrão.

O plugin `authentication_ldap_sasl_client` do lado do cliente obtém um ticket de serviço usando o ticket-granting ticket (TGT) do Kerberos, mas não usa diretamente os serviços LDAP. O plugin `authentication_ldap_sasl` do lado do servidor encaminha as mensagens do Kerberos entre o plugin do lado do cliente e o servidor LDAP. Usando as credenciais assim obtidas, o plugin do lado do servidor, em seguida, comunica-se com o servidor LDAP para interpretar mensagens de autenticação LDAP e recuperar grupos LDAP.

* `authentication_ldap_sasl_bind_base_dn`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>

Para autenticação SASL LDAP, o nome distinto de base (DN). Essa variável pode ser usada para limitar o escopo das pesquisas ancorando-as em um determinado local (a "base") dentro da árvore de pesquisa.

Suponha que os membros de um conjunto de entradas de usuário do LDAP tenham cada um essa forma:

  ```
  uid=user_name,ou=People,dc=example,dc=com
  ```

E que os membros de outro conjunto de entradas de usuário do LDAP tenham cada um essa forma:

  ```
  uid=user_name,ou=Admin,dc=example,dc=com
  ```

Em seguida, as pesquisas funcionam da seguinte forma para diferentes valores de DN de base:

+ Se o DN de base for `ou=People,dc=example,dc=com`: As pesquisas encontram entradas de usuário apenas no primeiro conjunto.

+ Se o DN de base for `ou=Admin,dc=example,dc=com`: As pesquisas encontram entradas de usuário apenas no segundo conjunto.

+ Se o DN de base for `ou=dc=example,dc=com`: As pesquisas encontram entradas do usuário no primeiro ou segundo conjunto.

Em geral, valores de DN de base mais específicos resultam em pesquisas mais rápidas, pois limitam o escopo da pesquisa mais.

* `authentication_ldap_sasl_bind_root_dn`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_root_dn"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-bind-root-dn=value</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_bind_root_dn</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>

Para autenticação SASL LDAP, o nome distinto raiz (DN). Esta variável é usada em conjunto com `authentication_ldap_sasl_bind_root_pwd` como as credenciais para autenticação no servidor LDAP com o propósito de realizar pesquisas. A autenticação utiliza uma ou duas operações de vinculação LDAP, dependendo se o nome da conta MySQL identifica um DN de usuário LDAP:

+ Se a conta não nomear um usuário DN: `authentication_ldap_sasl` realiza uma ligação inicial LDAP usando `authentication_ldap_sasl_bind_root_dn` e `authentication_ldap_sasl_bind_root_pwd`. (Ambos são vazios por padrão, portanto, se não forem definidos, o servidor LDAP deve permitir conexões anônimas.) O handle de ligação LDAP resultante é usado para pesquisar o DN do usuário, com base no nome do usuário do cliente. `authentication_ldap_sasl` realiza uma segunda ligação usando o DN do usuário e a senha fornecida pelo cliente.

+ Se a conta não nomear um DN do usuário: A primeira operação de vinculação é desnecessária neste caso. `authentication_ldap_sasl` realiza uma única vinculação usando o DN do usuário e a senha fornecida pelo cliente. Isso é mais rápido do que se a conta do MySQL não especificar um DN de usuário LDAP.

* `authentication_ldap_sasl_bind_root_pwd`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_root_pwd"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-bind-root-pwd=value</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_bind_root_pwd</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>

Para autenticação SASL LDAP, a senha para o nome distinto raiz. Esta variável é usada em conjunto com `authentication_ldap_sasl_bind_root_dn`. Veja a descrição daquela variável.

* `authentication_ldap_sasl_ca_path`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_ca_path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-ca-path=value</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_ca_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>

Para autenticação SASL LDAP, o caminho absoluto do arquivo da autoridade de certificação. Especifique este arquivo se deseja que o plugin de autenticação realize a verificação do certificado do servidor LDAP.

Nota

Além de definir a variável `authentication_ldap_sasl_ca_path` com o nome do arquivo, você deve adicionar os certificados apropriados da autoridade de certificação ao arquivo e habilitar a variável de sistema `authentication_ldap_sasl_tls`. Essas variáveis podem ser definidas para substituir a configuração padrão de OpenLDAP TLS; consulte LDAP Pluggable Authentication e ldap.conf

* `authentication_ldap_sasl_group_search_attr`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_group_search_attr"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-group-search-attr=value</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_group_search_attr</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>cn</code></td> </tr></tbody></table>

Para autenticação SASL LDAP, o nome do atributo que especifica os nomes dos grupos nas entradas de diretório LDAP. Se `authentication_ldap_sasl_group_search_attr` tiver seu valor padrão de `cn`, as pesquisas retornarão o valor `cn` como o nome do grupo. Por exemplo, se uma entrada LDAP com um valor de `uid` de `user1` tiver um atributo `cn` de `mygroup`, as pesquisas para `user1` retornarão `mygroup` como o nome do grupo.

Essa variável deve ser uma string vazia se você não quiser autenticação de grupo ou proxy.

Se o atributo de busca de grupo for `isMemberOf`, a autenticação LDAP recupera diretamente o valor do atributo do usuário `isMemberOf` e o atribui como informação de grupo. Se o atributo de busca de grupo não for `isMemberOf`, a autenticação LDAP busca todos os grupos onde o usuário é membro. (Este último é o comportamento padrão.) Esse comportamento é baseado na forma como as informações de grupo do LDAP podem ser armazenadas de duas maneiras: 1) Uma entrada de grupo pode ter um atributo com o nome `memberUid` ou `member` com um valor que é um nome de usuário; 2) Uma entrada de usuário pode ter um atributo com o nome `isMemberOf` com valores que são nomes de grupo.

* `authentication_ldap_sasl_group_search_filter`

  <table frame="box" rules="all" summary="Properties for authentication_fido_rp_id"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-fido-rp-id=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.27</td> </tr><tr><th>Deprecated</th> <td>8.0.35</td> </tr><tr><th>System Variable</th> <td><code>authentication_fido_rp_id</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>MySQL</code></td> </tr></tbody></table>0

Para autenticação SASL LDAP, o filtro de pesquisa de grupo personalizado.

O valor do filtro de pesquisa pode conter a notação `{UA}` e `{UD}` para representar o nome do usuário e o DN completo do usuário. Por exemplo, `{UA}` é substituído por um nome de usuário, como `"admin"`, enquanto `{UD}` é substituído por um DN completo, como `"uid=admin,ou=People,dc=example,dc=com"`. O valor seguinte é o padrão, que suporta tanto o OpenLDAP quanto o Active Directory:

  ```
  (|(&(objectClass=posixGroup)(memberUid={UA}))
    (&(objectClass=group)(member={UD})))
  ```

Em alguns casos, para o cenário do usuário, `memberOf` é um atributo de usuário simples que não contém informações de grupo. Para maior flexibilidade, um prefixo opcional `{GA}` pode ser usado com o atributo de busca de grupo. Qualquer atributo de grupo com um prefixo {GA} é tratado como um atributo de usuário com nomes de grupo. Por exemplo, com um valor de `{GA}MemberOf`, se o valor do grupo for o DN, o primeiro valor do atributo do grupo DN é retornado como o nome do grupo.

* `authentication_ldap_sasl_init_pool_size`

  <table frame="box" rules="all" summary="Properties for authentication_fido_rp_id"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-fido-rp-id=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.27</td> </tr><tr><th>Deprecated</th> <td>8.0.35</td> </tr><tr><th>System Variable</th> <td><code>authentication_fido_rp_id</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>MySQL</code></td> </tr></tbody></table>1

Para autenticação SASL LDAP, o tamanho inicial do conjunto de conexões ao servidor LDAP. Escolha o valor para essa variável com base no número médio de solicitações de autenticação concorrentes ao servidor LDAP.

O plugin usa `authentication_ldap_sasl_init_pool_size` e `authentication_ldap_sasl_max_pool_size` juntos para gerenciamento de pool de conexão:

+ Quando o plugin de autenticação é inicializado, ele cria conexões `authentication_ldap_sasl_init_pool_size`, a menos que `authentication_ldap_sasl_max_pool_size=0` para desabilitar o agrupamento.

+ Se o plugin receber uma solicitação de autenticação quando não houver conexões livres no pool de conexões atual, o plugin pode criar uma nova conexão, até o tamanho máximo do pool de conexões dado por `authentication_ldap_sasl_max_pool_size`.

+ Se o plugin receber uma solicitação quando o tamanho do pool já estiver no seu máximo e não houver conexões livres, a autenticação falha.

+ Quando o plugin é descarregado, ele fecha todas as conexões agrupadas.

Alterações nas configurações das variáveis do sistema de plugins podem não ter efeito em conexões já no pool. Por exemplo, modificar o host, a porta ou as configurações de TLS do servidor LDAP não afeta conexões existentes. No entanto, se os valores originais das variáveis fossem inválidos e o pool de conexões não pudesse ser inicializado, o plugin tenta reiniiciar o pool para o próximo pedido LDAP. Neste caso, os novos valores das variáveis do sistema são usados para a tentativa de reiniicialização.

Se `authentication_ldap_sasl_max_pool_size=0` for desativado, cada conexão LDAP aberta pelo plugin utiliza os valores das variáveis do sistema naquela época.

* `authentication_ldap_sasl_log_status`

  <table frame="box" rules="all" summary="Properties for authentication_fido_rp_id"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-fido-rp-id=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.27</td> </tr><tr><th>Deprecated</th> <td>8.0.35</td> </tr><tr><th>System Variable</th> <td><code>authentication_fido_rp_id</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>MySQL</code></td> </tr></tbody></table>2

Para autenticação SASL LDAP, o nível de registro para mensagens escritas no registro de erro. O seguinte quadro mostra os valores de nível permitidos e seus significados.

**Tabela 8.30 Níveis de registro para autenticação_ldap_sasl_log_status**

  <table frame="box" rules="all" summary="Properties for authentication_fido_rp_id"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-fido-rp-id=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.27</td> </tr><tr><th>Deprecated</th> <td>8.0.35</td> </tr><tr><th>System Variable</th> <td><code>authentication_fido_rp_id</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>MySQL</code></td> </tr></tbody></table>3

O nível de registro 6 está disponível a partir do MySQL 8.0.18.

Do lado do cliente, as mensagens podem ser registradas na saída padrão, definindo a variável de ambiente `AUTHENTICATION_LDAP_CLIENT_LOG`. Os valores permitidos e padrão são os mesmos que para `authentication_ldap_sasl_log_status`.

A variável de ambiente `AUTHENTICATION_LDAP_CLIENT_LOG` só se aplica à autenticação SASL LDAP. Não tem efeito para a autenticação LDAP simples, porque o plugin do cliente nesse caso é `mysql_clear_password`, que não sabe nada sobre operações LDAP.

* `authentication_ldap_sasl_max_pool_size`

  <table frame="box" rules="all" summary="Properties for authentication_fido_rp_id"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-fido-rp-id=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.27</td> </tr><tr><th>Deprecated</th> <td>8.0.35</td> </tr><tr><th>System Variable</th> <td><code>authentication_fido_rp_id</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>MySQL</code></td> </tr></tbody></table>4

Para autenticação SASL LDAP, o tamanho máximo do conjunto de conexões ao servidor LDAP. Para desabilitar o agrupamento de conexões, defina essa variável para 0.

Essa variável é usada em conjunto com `authentication_ldap_sasl_init_pool_size`. Veja a descrição dessa variável.

* `authentication_ldap_sasl_referral`

  <table frame="box" rules="all" summary="Properties for authentication_fido_rp_id"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-fido-rp-id=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.27</td> </tr><tr><th>Deprecated</th> <td>8.0.35</td> </tr><tr><th>System Variable</th> <td><code>authentication_fido_rp_id</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>MySQL</code></td> </tr></tbody></table>5

Para autenticação SASL LDAP, se deseja habilitar a referência de pesquisa LDAP. Consulte Referência de Pesquisa LDAP.

Essa variável pode ser definida para substituir a configuração padrão de referência OpenLDAP; consulte LDAP Pluggable Authentication e ldap.conf

* `authentication_ldap_sasl_server_host`

  <table frame="box" rules="all" summary="Properties for authentication_fido_rp_id"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-fido-rp-id=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.27</td> </tr><tr><th>Deprecated</th> <td>8.0.35</td> </tr><tr><th>System Variable</th> <td><code>authentication_fido_rp_id</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>MySQL</code></td> </tr></tbody></table>6

O host do servidor LDAP para autenticação SASL LDAP; isso pode ser um nome de host ou endereço IP.

* `authentication_ldap_sasl_server_port`

  <table frame="box" rules="all" summary="Properties for authentication_fido_rp_id"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-fido-rp-id=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.27</td> </tr><tr><th>Deprecated</th> <td>8.0.35</td> </tr><tr><th>System Variable</th> <td><code>authentication_fido_rp_id</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>MySQL</code></td> </tr></tbody></table>7

Para autenticação SASL LDAP, o número da porta TCP/IP do servidor LDAP.

A partir do MySQL 8.0.14, se o número da porta LDAP estiver configurado como 636 ou 3269, o plugin usa LDAPS (LDAP over SSL) em vez de LDAP. (LDAPS difere de `startTLS`.

* `authentication_ldap_sasl_tls`

  <table frame="box" rules="all" summary="Properties for authentication_fido_rp_id"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-fido-rp-id=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.27</td> </tr><tr><th>Deprecated</th> <td>8.0.35</td> </tr><tr><th>System Variable</th> <td><code>authentication_fido_rp_id</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>MySQL</code></td> </tr></tbody></table>8

Para autenticação SASL LDAP, se as conexões do plugin com o servidor LDAP são seguras. Se esta variável estiver habilitada, o plugin usa TLS para se conectar de forma segura ao servidor LDAP. Esta variável pode ser definida para substituir a configuração padrão de TLS do OpenLDAP; consulte LDAP Pluggable Authentication e ldap.conf. Se você habilitar esta variável, também pode querer definir a variável [[`authentication_ldap_sasl_ca_path`].

Os plugins MySQL LDAP suportam o método StartTLS, que inicializa o TLS em cima de uma conexão LDAP simples.

A partir do MySQL 8.0.14, o LDAPS pode ser usado definindo a variável de sistema `authentication_ldap_sasl_server_port`.

* `authentication_ldap_sasl_user_search_attr`

  <table frame="box" rules="all" summary="Properties for authentication_fido_rp_id"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-fido-rp-id=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.27</td> </tr><tr><th>Deprecated</th> <td>8.0.35</td> </tr><tr><th>System Variable</th> <td><code>authentication_fido_rp_id</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>MySQL</code></td> </tr></tbody></table>9

Para autenticação SASL LDAP, o nome do atributo que especifica os nomes de usuário nas entradas de diretório LDAP. Se o nome de distintivo do usuário não for fornecido, o plugin de autenticação busca o nome usando este atributo. Por exemplo, se o valor `authentication_ldap_sasl_user_search_attr` for `uid`, uma busca pelo nome do usuário `user1` encontra entradas com um valor `uid` de `user1`.

* `authentication_ldap_simple_auth_method_name`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>Introduced</th> <td>8.0.26</td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_key_tab</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>0

Para autenticação simples LDAP, o nome do método de autenticação. A comunicação entre o plugin de autenticação e o servidor LDAP ocorre de acordo com este método de autenticação.

Nota

Para todos os métodos de autenticação LDAP simples, é recomendável definir também os parâmetros TLS para exigir que a comunicação com o servidor LDAP ocorra por meio de conexões seguras.

Estes são os valores permitidos para o método de autenticação:

+ `SIMPLE`: Use autenticação LDAP simples. Este método utiliza uma ou duas operações de vinculação LDAP, dependendo se o nome da conta MySQL identifica um nome de usuário distinguido do LDAP. Veja a descrição de `authentication_ldap_simple_bind_root_dn`.

+ `AD-FOREST`: Uma variação de `SIMPLE`, de modo que as pesquisas de autenticação realizem todos os domínios na floresta do Active Directory, realizando uma ligação LDAP em cada domínio do Active Directory até que o usuário seja encontrado em algum domínio.

* `authentication_ldap_simple_bind_base_dn`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>Introduced</th> <td>8.0.26</td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_key_tab</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>1

Para autenticação simples LDAP, o nome distinguido de base (DN). Essa variável pode ser usada para limitar o escopo das pesquisas ancorando-as em um determinado local (a "base") dentro da árvore de pesquisa.

Suponha que os membros de um conjunto de entradas de usuário do LDAP tenham cada um essa forma:

  ```
  uid=user_name,ou=People,dc=example,dc=com
  ```

E que os membros de outro conjunto de entradas de usuário do LDAP tenham cada um essa forma:

  ```
  uid=user_name,ou=Admin,dc=example,dc=com
  ```

Em seguida, as pesquisas funcionam da seguinte forma para diferentes valores de DN de base:

+ Se o DN de base for `ou=People,dc=example,dc=com`: As pesquisas encontram entradas de usuário apenas no primeiro conjunto.

+ Se o DN de base for `ou=Admin,dc=example,dc=com`: As pesquisas encontram entradas de usuário apenas no segundo conjunto.

+ Se o DN de base for `ou=dc=example,dc=com`: As pesquisas encontram entradas do usuário no primeiro ou segundo conjunto.

Em geral, valores de DN de base mais específicos resultam em pesquisas mais rápidas, pois limitam o escopo da pesquisa mais.

* `authentication_ldap_simple_bind_root_dn`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>Introduced</th> <td>8.0.26</td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_key_tab</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>2

Para autenticação simples LDAP, o nome distinto raiz (DN). Esta variável é usada em conjunto com `authentication_ldap_simple_bind_root_pwd` como as credenciais para autenticação no servidor LDAP para fins de realização de pesquisas. A autenticação utiliza uma ou duas operações de vinculação LDAP, dependendo se o nome da conta MySQL identifica um DN de usuário LDAP:

+ Se a conta não nomear um DN do usuário: `authentication_ldap_simple` realiza uma ligação inicial LDAP usando `authentication_ldap_simple_bind_root_dn` e `authentication_ldap_simple_bind_root_pwd`. (Ambos são vazios por padrão, portanto, se não forem definidos, o servidor LDAP deve permitir conexões anônimas.) O handle de ligação LDAP resultante é usado para pesquisar o DN do usuário, com base no nome do usuário do cliente. `authentication_ldap_simple` realiza uma segunda ligação usando o DN do usuário e a senha fornecida pelo cliente.

+ Se a conta não nomear um DN do usuário: A primeira operação de vinculação é desnecessária neste caso. `authentication_ldap_simple` realiza uma única vinculação usando o DN do usuário e a senha fornecida pelo cliente. Isso é mais rápido do que se a conta do MySQL não especificar um DN de usuário LDAP.

* `authentication_ldap_simple_bind_root_pwd`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>Introduced</th> <td>8.0.26</td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_key_tab</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>3

Para autenticação simples LDAP, a senha para o nome distinto raiz. Esta variável é usada em conjunto com `authentication_ldap_simple_bind_root_dn`. Veja a descrição daquela variável.

* `authentication_ldap_simple_ca_path`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>Introduced</th> <td>8.0.26</td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_key_tab</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>4

Para autenticação simples LDAP, o caminho absoluto do arquivo da autoridade de certificação. Especifique este arquivo se deseja que o plugin de autenticação realize a verificação do certificado do servidor LDAP.

Nota

Além de definir a variável `authentication_ldap_simple_ca_path` com o nome do arquivo, você deve adicionar os certificados apropriados da autoridade de certificação ao arquivo e habilitar a variável de sistema `authentication_ldap_simple_tls`. Essas variáveis podem ser definidas para substituir a configuração padrão de OpenLDAP TLS; consulte LDAP Pluggable Authentication e ldap.conf

* `authentication_ldap_simple_group_search_attr`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>Introduced</th> <td>8.0.26</td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_key_tab</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>5

Para autenticação simples LDAP, o nome do atributo que especifica os nomes dos grupos nas entradas de diretório LDAP. Se `authentication_ldap_simple_group_search_attr` tiver seu valor padrão de `cn`, as pesquisas retornarão o valor `cn` como o nome do grupo. Por exemplo, se uma entrada LDAP com um valor de `uid` de `user1` tiver um atributo de `cn`, as pesquisas para `user1` retornarão `mygroup` como o nome do grupo.

Se o atributo de busca de grupo for `isMemberOf`, a autenticação LDAP recupera diretamente o valor do atributo do usuário `isMemberOf` e o atribui como informação de grupo. Se o atributo de busca de grupo não for `isMemberOf`, a autenticação LDAP busca todos os grupos nos quais o usuário é membro. (Este último é o comportamento padrão.) Esse comportamento é baseado na forma como as informações de grupo do LDAP podem ser armazenadas de duas maneiras: 1) Uma entrada de grupo pode ter um atributo com o nome `memberUid` ou `member` com um valor que é um nome de usuário; 2) Uma entrada de usuário pode ter um atributo com o nome `isMemberOf` com valores que são nomes de grupo.

* `authentication_ldap_simple_group_search_filter`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>Introduced</th> <td>8.0.26</td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_key_tab</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>6

Para autenticação simples LDAP, o filtro de pesquisa de grupo personalizado.

O valor do filtro de pesquisa pode conter a notação `{UA}` e `{UD}` para representar o nome do usuário e o DN completo do usuário. Por exemplo, `{UA}` é substituído por um nome de usuário, como `"admin"`, enquanto `{UD}` é substituído por um DN completo, como `"uid=admin,ou=People,dc=example,dc=com"`. O valor seguinte é o padrão, que suporta tanto o OpenLDAP quanto o Active Directory:

  ```
  (|(&(objectClass=posixGroup)(memberUid={UA}))
    (&(objectClass=group)(member={UD})))
  ```

Em alguns casos, para o cenário do usuário, `memberOf` é um atributo de usuário simples que não contém informações de grupo. Para maior flexibilidade, um prefixo opcional `{GA}` pode ser usado com o atributo de busca de grupo. Qualquer atributo de grupo com um prefixo {GA} é tratado como um atributo de usuário com nomes de grupo. Por exemplo, com um valor de `{GA}MemberOf`, se o valor do grupo for o DN, o primeiro valor do atributo do grupo DN é retornado como o nome do grupo.

* `authentication_ldap_simple_init_pool_size`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>Introduced</th> <td>8.0.26</td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_key_tab</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>7

Para autenticação simples LDAP, o tamanho inicial do conjunto de conexões ao servidor LDAP. Escolha o valor para essa variável com base no número médio de solicitações de autenticação concorrentes ao servidor LDAP.

O plugin utiliza `authentication_ldap_simple_init_pool_size` e `authentication_ldap_simple_max_pool_size` juntos para gerenciamento de pool de conexão:

+ Quando o plugin de autenticação é inicializado, ele cria conexões `authentication_ldap_simple_init_pool_size`, a menos que `authentication_ldap_simple_max_pool_size=0` para desabilitar o agrupamento.

+ Se o plugin receber uma solicitação de autenticação quando não houver conexões livres no pool de conexões atual, o plugin pode criar uma nova conexão, até o tamanho máximo do pool de conexões dado por `authentication_ldap_simple_max_pool_size`.

+ Se o plugin receber uma solicitação quando o tamanho do pool já estiver no seu máximo e não houver conexões livres, a autenticação falha.

+ Quando o plugin é descarregado, ele fecha todas as conexões agrupadas.

Alterações nas configurações das variáveis do sistema de plugins podem não ter efeito em conexões já no pool. Por exemplo, modificar o host, a porta ou as configurações de TLS do servidor LDAP não afeta conexões existentes. No entanto, se os valores originais das variáveis fossem inválidos e o pool de conexões não pudesse ser inicializado, o plugin tenta reiniiciar o pool para o próximo pedido LDAP. Neste caso, os novos valores das variáveis do sistema são usados para a tentativa de reiniicialização.

Se `authentication_ldap_simple_max_pool_size=0` for desativado, cada conexão LDAP aberta pelo plugin utiliza os valores das variáveis do sistema naquela época.

* `authentication_ldap_simple_log_status`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>Introduced</th> <td>8.0.26</td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_key_tab</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>8

Para autenticação simples LDAP, o nível de registro para mensagens escritas no registro de erro. O quadro a seguir mostra os valores de nível permitidos e seus significados.

**Tabela 8.31 Níveis de registro para autenticação_ldap_simple_log_status**

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>Introduced</th> <td>8.0.26</td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_key_tab</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>9

O nível de registro 6 está disponível a partir do MySQL 8.0.18.

* `authentication_ldap_simple_max_pool_size`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.26</td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_principal</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql/host_name@realm_name</code></td> </tr></tbody></table>0

Para autenticação simples LDAP, o tamanho máximo do conjunto de conexões ao servidor LDAP. Para desabilitar o agrupamento de conexões, defina essa variável para 0.

Essa variável é usada em conjunto com `authentication_ldap_simple_init_pool_size`. Veja a descrição dessa variável.

* `authentication_ldap_simple_referral`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.26</td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_principal</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql/host_name@realm_name</code></td> </tr></tbody></table>1

Para autenticação simples LDAP, se deseja habilitar a referência de pesquisa LDAP. Veja Referência de Pesquisa LDAP.

* `authentication_ldap_simple_server_host`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.26</td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_principal</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql/host_name@realm_name</code></td> </tr></tbody></table>2

Para autenticação simples LDAP, o host do servidor LDAP. Os valores permitidos para essa variável dependem do método de autenticação:

+ Para `authentication_ldap_simple_auth_method_name=SIMPLE`: O host do servidor LDAP pode ser um nome de host ou um endereço IP.

+ Para `authentication_ldap_simple_auth_method_name=AD-FOREST`. O host do servidor LDAP pode ser um nome de domínio do Active Directory. Por exemplo, para um URL do servidor LDAP de `ldap://example.mem.local:389`, o nome de domínio pode ser `mem.local`.

Uma configuração de floresta do Active Directory pode ter vários domínios (IPs do servidor LDAP), que podem ser descobertos usando DNS. Em sistemas Unix e semelhantes, pode ser necessário realizar uma configuração adicional para configurar seu servidor DNS com registros SRV que especifiquem os servidores LDAP do domínio do Active Directory. Para informações sobre DNS SRV, consulte [RFC 2782][(https://tools.ietf.org/html/rfc2782)].

Suponha que sua configuração tenha essas propriedades:

- O servidor de nomes que fornece informações sobre domínios do Active Directory tem o endereço IP `10.172.166.100`.

- Os servidores LDAP têm os nomes `ldap1.mem.local` até `ldap3.mem.local` e endereços IP `10.172.166.101` até `10.172.166.103`.

Você deseja que os servidores LDAP sejam descobertos usando pesquisas SRV. Por exemplo, na linha de comando, um comando como este deve listar os servidores LDAP:

    ```
    host -t SRV _ldap._tcp.mem.local
    ```

Realize a configuração do DNS da seguinte forma:

1. Adicione uma linha a `/etc/resolv.conf` para especificar o servidor de nomes que fornece informações sobre os domínios do Active Directory:

       ```
       nameserver 10.172.166.100
       ```

2. Configure o arquivo de zona apropriado para o servidor de nomes com registros SRV para os servidores LDAP:

       ```
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap1.mem.local.
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap2.mem.local.
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap3.mem.local.
       ```

3. Também pode ser necessário especificar o endereço IP dos servidores LDAP em `/etc/hosts` se o host do servidor não puder ser resolvido. Por exemplo, adicione linhas como esta ao arquivo:

       ```
       10.172.166.101 ldap1.mem.local
       10.172.166.102 ldap2.mem.local
       10.172.166.103 ldap3.mem.local
       ```

Com o DNS configurado conforme descrito acima, o plugin LDAP do lado do servidor pode descobrir os servidores LDAP e tenta autenticar em todos os domínios até que a autenticação seja bem-sucedida ou não haja mais servidores.

O Windows não precisa de configurações como as descritas acima. Dado o endereço do servidor LDAP no valor `authentication_ldap_simple_server_host`, a biblioteca LDAP do Windows pesquisa todos os domínios e tenta autenticar.

* `authentication_ldap_simple_server_port`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.26</td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_principal</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql/host_name@realm_name</code></td> </tr></tbody></table>3

Para autenticação simples LDAP, o número da porta TCP/IP do servidor LDAP.

A partir do MySQL 8.0.14, se o número da porta LDAP estiver configurado como 636 ou 3269, o plugin usa LDAPS (LDAP over SSL) em vez de LDAP. (LDAPS difere de `startTLS`.

* `authentication_ldap_simple_tls`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.26</td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_principal</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql/host_name@realm_name</code></td> </tr></tbody></table>4

Para autenticação simples LDAP, se as conexões do plugin ao servidor LDAP são seguras. Se esta variável estiver habilitada, o plugin usa TLS para se conectar de forma segura ao servidor LDAP. Esta variável pode ser definida para substituir a configuração padrão de TLS do OpenLDAP; consulte LDAP Pluggable Authentication e ldap.conf. Se você habilitar esta variável, também pode querer definir a variável [[`authentication_ldap_simple_ca_path`].

Os plugins MySQL LDAP suportam o método StartTLS, que inicializa o TLS em cima de uma conexão LDAP simples.

A partir do MySQL 8.0.14, o LDAPS pode ser usado definindo a variável de sistema `authentication_ldap_simple_server_port`.

* `authentication_ldap_simple_user_search_attr`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.26</td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_principal</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql/host_name@realm_name</code></td> </tr></tbody></table>5

Para autenticação simples LDAP, o nome do atributo que especifica os nomes dos usuários nas entradas de diretório LDAP. Se o nome de distintivo do usuário não for fornecido, o plugin de autenticação procura pelo nome usando este atributo. Por exemplo, se o valor `authentication_ldap_simple_user_search_attr` for `uid`, uma busca pelo nome do usuário `user1` encontra entradas com um valor `uid` de `user1`.

### 8.4.2 Plugins de Controle de Conexão

O MySQL Server inclui uma biblioteca de plugins que permite que os administradores introduzam um atraso crescente na resposta do servidor a tentativas de conexão após um número configurável de tentativas consecutivas malsucedidas. Essa capacidade fornece um mecanismo dissuasivo que desacelera ataques de força bruta contra contas de usuários do MySQL. A biblioteca de plugins contém dois plugins:

* `CONNECTION_CONTROL` verifica as tentativas de conexão recebidas e adiciona um atraso nas respostas do servidor, conforme necessário. Este plugin também expõe variáveis do sistema que permitem a configuração de sua operação e uma variável de status que fornece informações de monitoramento rudimentares.

O plugin `CONNECTION_CONTROL` usa a interface do plugin de auditoria (veja Escrever plugins de auditoria). Para coletar informações, ele se inscreve na classe de evento `MYSQL_AUDIT_CONNECTION_CLASSMASK`, e processa os subeventos `MYSQL_AUDIT_CONNECTION_CONNECT` e `MYSQL_AUDIT_CONNECTION_CHANGE_USER` para verificar se o servidor deve introduzir um atraso antes de responder às tentativas de conexão.

* `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` implementa uma tabela `INFORMATION_SCHEMA` que expõe informações de monitoramento mais detalhadas para tentativas de conexão falhadas. Para mais informações sobre essa tabela, consulte a Seção 28.6.2, “A tabela INFORMATION_SCHEMA CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS”.

As seções a seguir fornecem informações sobre a instalação e configuração do plugin de controle de conexão.

#### 8.4.2.1 Instalação do Plugin de Controle de Conexão

Esta seção descreve como instalar os plugins de controle de conexão, `CONNECTION_CONTROL` e `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS`. Para informações gerais sobre como instalar plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para ser utilizável pelo servidor, o arquivo da biblioteca de plugins deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin, definindo o valor de `plugin_dir` na inicialização do servidor.

O nome de arquivo da biblioteca de plugins é `connection_control`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para Unix e sistemas similares, `.dll` para Windows).

Para carregar os plugins na inicialização do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que os contém. Com esse método de carregamento de plugins, a opção deve ser dada toda vez que o servidor é iniciado. Por exemplo, coloque essas linhas no arquivo do servidor `my.cnf`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
[mysqld]
plugin-load-add=connection_control.so
```

Após modificar `my.cnf`, reinicie o servidor para que as novas configurações sejam aplicadas.

Como alternativa, para carregar os plugins em tempo de execução, use essas declarações, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
INSTALL PLUGIN CONNECTION_CONTROL
  SONAME 'connection_control.so';
INSTALL PLUGIN CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS
  SONAME 'connection_control.so';
```

`INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela de sistema `mysql.plugins`, fazendo com que o servidor o carregue para cada inicialização normal subsequente, sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 7.6.2, “Obtenção de Informações do Plugin do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'connection%';
+------------------------------------------+---------------+
| PLUGIN_NAME                              | PLUGIN_STATUS |
+------------------------------------------+---------------+
| CONNECTION_CONTROL                       | ACTIVE        |
| CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS | ACTIVE        |
+------------------------------------------+---------------+
```

Se um plugin não conseguir se inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

Se os plugins tiverem sido previamente registrados com `INSTALL PLUGIN` ou forem carregados com `--plugin-load-add`, você pode usar as opções `--connection-control` e `--connection-control-failed-login-attempts` na inicialização do servidor para controlar a ativação dos plugins. Por exemplo, para carregar os plugins na inicialização e impedir que sejam removidos durante a execução, use essas opções:

```
[mysqld]
plugin-load-add=connection_control.so
connection-control=FORCE_PLUS_PERMANENT
connection-control-failed-login-attempts=FORCE_PLUS_PERMANENT
```

Se desejar impedir que o servidor seja executado sem um plugin de controle de conexão específico, use um valor de opção de `FORCE` ou `FORCE_PLUS_PERMANENT` para forçar o fracasso da inicialização do servidor se o plugin não for inicializado com sucesso.

Nota

É possível instalar um plugin sem o outro, mas ambos devem ser instalados para ter capacidade de controle completo da conexão. Em particular, instalar apenas o plugin `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` é pouco útil, porque, sem o plugin `CONNECTION_CONTROL` para fornecer os dados que preenchem a tabela `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS`, a tabela sempre estará vazia.

* Configuração de atraso de conexão
* Avaliação de falha de conexão
* Monitoramento de falha de conexão

Configuração de Retardo de Conexão

Para permitir a configuração de sua operação, o plugin `CONNECTION_CONTROL` expõe essas variáveis do sistema:

* `connection_control_failed_connections_threshold`: O número de tentativas consecutivas de conexão falhadas permitidas para contas antes que o servidor adicione um atraso para tentativas de conexão subsequentes. Para desabilitar o contagem de conexões falhadas, defina `connection_control_failed_connections_threshold` como zero.

* `connection_control_min_connection_delay`: O atraso mínimo em milissegundos para falhas de conexão acima do limite.

* `connection_control_max_connection_delay`: O atraso máximo em milissegundos para falhas de conexão acima do limite.

Se `connection_control_failed_connections_threshold` não for nulo, o contagem de conexões falhadas está habilitada e tem as seguintes propriedades:

* O atraso é zero até `connection_control_failed_connections_threshold` tentativas consecutivas de conexão falhadas.

* Em seguida, o servidor adiciona um atraso crescente para tentativas consecutivas subsequentes, até que ocorra uma conexão bem-sucedida. Os atrasos iniciais não ajustados começam em 1000 milissegundos (1 segundo) e aumentam em 1000 milissegundos por tentativa. Ou seja, uma vez que o atraso tenha sido ativado para uma conta, os atrasos não ajustados para tentativas subsequentes não bem-sucedidas são de 1000 milissegundos, 2000 milissegundos, 3000 milissegundos, e assim por diante.

* O atraso real experimentado por um cliente é o atraso não ajustado, ajustado para ficar dentro dos valores das variáveis de sistema `connection_control_min_connection_delay` e `connection_control_max_connection_delay`, inclusive.

* Uma vez que o atraso tenha sido ativado para uma conta, a primeira conexão bem-sucedida subsequente pela conta também experimenta um atraso, mas o contagem de falhas é redefinida para conexões subsequentes.

Por exemplo, com o valor padrão `connection_control_failed_connections_threshold` de 3, não há atraso para as três primeiras tentativas consecutivas de conexão falha por uma conta. Os atrasos ajustados reais experimentados pela conta para as quatro e subsequentes conexões falhas dependem dos valores `connection_control_min_connection_delay` e `connection_control_max_connection_delay`:

* Se `connection_control_min_connection_delay` e `connection_control_max_connection_delay` forem 1000 e 20000, os atrasos ajustados são os mesmos dos atrasos não ajustados, até um máximo de 20000 milissegundos. As conexões falhadas do quarto e subsequentes são atrasadas por 1000 milissegundos, 2000 milissegundos, 3000 milissegundos, e assim por diante.

* Se `connection_control_min_connection_delay` e `connection_control_max_connection_delay` forem 1500 e 20000, os atrasos ajustados para as conexões falhadas do quarto e subsequentes serão de 1500 milissegundos, 2000 milissegundos, 3000 milissegundos, e assim por diante, até um máximo de 20000 milissegundos.

* Se `connection_control_min_connection_delay` e `connection_control_max_connection_delay` forem 2000 e 3000, os atrasos ajustados para as conexões falhadas do quarto e subsequentes serão de 2000 milissegundos, 2000 milissegundos e 3000 milissegundos, com todas as conexões falhadas subsequentes também atrasadas por 3000 milissegundos.

Você pode definir as variáveis de sistema `CONNECTION_CONTROL` no início ou durante o funcionamento do servidor. Suponha que você queira permitir quatro tentativas consecutivas de conexão falhadas antes que o servidor comece a demorar suas respostas, com um atraso mínimo de 2000 milissegundos. Para definir as variáveis relevantes no início do servidor, coloque essas linhas no arquivo `my.cnf` do servidor:

```
[mysqld]
plugin-load-add=connection_control.so
connection-control-failed-connections-threshold=4
connection-control-min-connection-delay=2000
```

Para definir e persistir as variáveis no tempo de execução, use essas declarações:

```
SET PERSIST connection_control_failed_connections_threshold = 4;
SET PERSIST connection_control_min_connection_delay = 2000;
```

`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") define um valor para a instância MySQL em execução. Também salva o valor, fazendo com que ele seja carregado em reinicializações subsequentes do servidor. Para alterar um valor para a instância MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`. Veja a Seção 15.7.6.1, “Sintaxe SET para atribuição de variáveis”.

As variáveis de sistema `connection_control_min_connection_delay` e `connection_control_max_connection_delay` têm valores mínimo e máximo de 1000 e 2147483647. Além disso, a faixa permitida de valores de cada variável também depende do valor atual da outra:

* `connection_control_min_connection_delay` não pode ser definido maior que o valor atual de `connection_control_max_connection_delay`.

* `connection_control_max_connection_delay` não pode ser definido menos que o valor atual de `connection_control_min_connection_delay`.

Assim, para fazer as alterações necessárias para algumas configurações, você pode precisar definir as variáveis em um determinado ordem. Suponha que os atrasos mínimo e máximo atuais sejam 1000 e 2000, e que você queira defini-los em 3000 e 5000. Você não pode primeiro definir `connection_control_min_connection_delay` para 3000 porque isso é maior que o valor atual `connection_control_max_connection_delay` de 2000. Em vez disso, defina `connection_control_max_connection_delay` para 5000, em seguida, defina `connection_control_min_connection_delay` para 3000.

Avaliação de Falha de Conexão

Quando o plugin `CONNECTION_CONTROL` é instalado, ele verifica as tentativas de conexão e registra se elas falham ou têm sucesso. Para esse propósito, uma tentativa de conexão falha é aquela para a qual o usuário e o host do cliente correspondem a uma conta MySQL conhecida, mas as credenciais fornecidas são incorretas ou não correspondem a nenhuma conta conhecida.

O contagem de conexões falhadas é baseado na combinação de usuário/host para cada tentativa de conexão. A determinação do nome de usuário e do nome de host aplicável leva em conta o proxy e ocorre da seguinte forma:

* Se o usuário cliente proxy outro usuário, a conta para contagem de conexões falhadas é do usuário que está proxy, e não do usuário proxy. Por exemplo, se `external_user@example.com` proxy `proxy_user@example.com`, a contagem de conexões usa o usuário proxy, `external_user@example.com`, em vez do usuário proxy, `proxy_user@example.com`. Tanto `external_user@example.com` quanto `proxy_user@example.com` devem ter entradas válidas na tabela do sistema `mysql.user` e uma relação de proxy entre eles deve ser definida na tabela do sistema `mysql.proxies_priv` (ver Seção 8.2.19, “Usuários Proxy”).

* Se o usuário cliente não proxy outro usuário, mas corresponder a uma entrada `mysql.user`, o contagem utiliza o valor `CURRENT_USER()` correspondente a essa entrada. Por exemplo, se um usuário `user1` conectando-se a partir de um host `host1.example.com` corresponder a uma entrada `user1@host1.example.com`, o contagem utiliza `user1@host1.example.com`. Se o usuário corresponder a uma entrada `user1@%.example.com`, `user1@%.com` ou `user1@%`, em vez disso, o contagem utiliza `user1@%.example.com`, `user1@%.com` ou `user1@%`, respectivamente.

Nos casos descritos acima, a tentativa de conexão corresponde a alguma entrada do `mysql.user`, e se o pedido é bem-sucedido ou não depende se o cliente fornece as credenciais de autenticação corretas. Por exemplo, se o cliente apresentar uma senha incorreta, a tentativa de conexão falha.

Se a tentativa de conexão não corresponder a nenhuma entrada de `mysql.user`, a tentativa falha. Nesse caso, nenhum valor de `CURRENT_USER()` está disponível e o contagem de falha de conexão usa o nome de usuário fornecido pelo cliente e o host do cliente, conforme determinado pelo servidor. Por exemplo, se um cliente tenta se conectar como usuário `user2` a partir do host `host2.example.com`, a parte do nome de usuário está disponível na solicitação do cliente e o servidor determina as informações do host. A combinação de usuário/host usada para contagem é `user2@host2.example.com`.

Nota

O servidor mantém informações sobre quais hosts do cliente podem se conectar ao servidor (essencialmente a união dos valores de host para as entradas `mysql.user`). Se um cliente tenta se conectar de qualquer outro host, o servidor rejeita a tentativa em uma fase inicial da configuração da conexão:

```
ERROR 1130 (HY000): Host 'host_name' is not
allowed to connect to this MySQL server
```

Como esse tipo de rejeição ocorre tão cedo, o `CONNECTION_CONTROL` não a vê e não a contabiliza.

Monitoramento de falha de conexão

Para monitorar conexões falhadas, use essas fontes de informação:

* A variável de status `Connection_control_delay_generated` indica o número de vezes que o servidor adicionou um atraso à sua resposta para uma tentativa de conexão falhada. Isso não conta tentativas que ocorrem antes de atingir o limite definido pela variável de sistema `connection_control_failed_connections_threshold`.

* A tabela `INFORMATION_SCHEMA` `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` fornece informações sobre o número atual de tentativas de conexão consecutivas falhadas por conta (combinação de usuário/host). Isso conta todas as tentativas falhadas, independentemente de elas terem sido adiadas.

Atribuir um valor a `connection_control_failed_connections_threshold` no momento da execução tem esses efeitos:

* Todos os contadores acumulados de falha de conexão são zerados.

* A variável de status `Connection_control_delay_generated` é redefinida para zero.

* A tabela `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` fica vazia.

#### 8.4.2.2 Sistema de Plugin de Controle de Conexão e Variáveis de Status

Esta seção descreve as variáveis de sistema e status que o plugin `CONNECTION_CONTROL` fornece para permitir que sua operação seja configurada e monitorada.

* Variáveis do sistema de plugins de controle de conexão * Variáveis de status do plugin de controle de conexão

##### Variáveis de sistema do plugin de controle de conexão

Se o plugin `CONNECTION_CONTROL` estiver instalado, ele expõe essas variáveis do sistema:

* `connection_control_failed_connections_threshold`

  <table frame="box" rules="all" summary="Properties for connection_control_failed_connections_threshold"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connection-control-failed-connections-threshold=#</code></td> </tr><tr><th>System Variable</th> <td><code>connection_control_failed_connections_threshold</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>3</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>2147483647</code></td> </tr></tbody></table>

Número de tentativas consecutivas de conexão não bem-sucedidas permitidas para contas antes de o servidor adicionar um atraso para tentativas de conexão subsequentes:

+ Se a variável tiver um valor não nulo *`N`*, o servidor adiciona um atraso começando com tentativa falha consecutiva *`N`*+1. Se uma conta tiver alcançado o ponto em que as respostas de conexão são atrasadas, um atraso também ocorre para a próxima conexão subsequente bem-sucedida.

+ Definindo essa variável como zero, o contagem de conexões falhadas é desativada. Nesse caso, o servidor nunca adiciona atrasos.

Para informações sobre como o `connection_control_failed_connections_threshold` interage com outros sistemas de controle de conexão e variáveis de status, consulte a Seção 8.4.2.1, “Instalação do Plugin de Controle de Conexão”.

* `connection_control_max_connection_delay`

  <table frame="box" rules="all" summary="Properties for connection_control_max_connection_delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connection-control-max-connection-delay=#</code></td> </tr><tr><th>System Variable</th> <td><code>connection_control_max_connection_delay</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>2147483647</code></td> </tr><tr><th>Minimum Value</th> <td><code>1000</code></td> </tr><tr><th>Maximum Value</th> <td><code>2147483647</code></td> </tr><tr><th>Unit</th> <td>milliseconds</td> </tr></tbody></table>

O atraso máximo em milissegundos para a resposta do servidor em tentativas de conexão falhadas, se `connection_control_failed_connections_threshold` for maior que zero.

Para informações sobre como o `connection_control_max_connection_delay` interage com outros sistemas de controle de conexão e variáveis de status, consulte a Seção 8.4.2.1, “Instalação do Plugin de Controle de Conexão”.

* `connection_control_min_connection_delay`

  <table frame="box" rules="all" summary="Properties for connection_control_min_connection_delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connection-control-min-connection-delay=#</code></td> </tr><tr><th>System Variable</th> <td><code>connection_control_min_connection_delay</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1000</code></td> </tr><tr><th>Minimum Value</th> <td><code>1000</code></td> </tr><tr><th>Maximum Value</th> <td><code>2147483647</code></td> </tr><tr><th>Unit</th> <td>milliseconds</td> </tr></tbody></table>

O atraso mínimo em milissegundos para a resposta do servidor em tentativas de conexão falhadas, se `connection_control_failed_connections_threshold` for maior que zero.

Para informações sobre como o `connection_control_min_connection_delay` interage com outros sistemas de controle de conexão e variáveis de status, consulte a Seção 8.4.2.1, “Instalação do Plugin de Controle de Conexão”.

##### Variáveis de status do plugin de controle de conexão

Se o plugin `CONNECTION_CONTROL` estiver instalado, ele expõe essa variável de status:

* `Connection_control_delay_generated`

O número de vezes que o servidor adicionou um atraso à sua resposta a uma tentativa de conexão falhada. Isso não conta tentativas que ocorrem antes de atingir o limite definido pela variável de sistema `connection_control_failed_connections_threshold`.

Essa variável fornece um contador simples. Para informações mais detalhadas sobre o controle de conexão, examine a tabela `INFORMATION_SCHEMA` `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS`; veja a Seção 28.6.2, “A tabela INFORMATION_SCHEMA CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS”.

Atribuir um valor a `connection_control_failed_connections_threshold` no momento da execução redefinirá `Connection_control_delay_generated` para zero.

### 8.4.3 O componente de validação de senha

O componente `validate_password` serve para melhorar a segurança, exigindo senhas de conta e permitindo testes de força de senhas potenciais. Esse componente expõe variáveis do sistema que permitem configurar a política de senha e variáveis de status para monitoramento do componente.

Nota

No MySQL 8.0, o plugin `validate_password` foi reimplementado como o componente `validate_password`. (Para informações gerais sobre componentes, consulte a Seção 7.5, “Componentes do MySQL”.) As instruções a seguir descrevem como usar o componente, não o plugin. Para instruções sobre o uso do formulário de plugin do `validate_password`, consulte O Plugin de Validação de Senha, no Manual de Referência do MySQL 5.7.

O formulário de plugin do `validate_password` ainda está disponível, mas é desatualizado; espere que ele seja removido em uma versão futura do MySQL. As instalações do MySQL que utilizam o plugin devem fazer a transição para o uso do componente em vez disso. Veja a Seção 8.4.3.3, “Transição para o Componente de Validação de Senha”.

O componente `validate_password` implementa essas capacidades:

* Para declarações SQL que atribuem uma senha fornecida como um valor em texto claro, `validate_password` verifica a senha contra a política de senha atual e rejeita a senha se ela for fraca (a declaração retorna um erro `ER_NOT_VALID_PASSWORD`). Isso se aplica às declarações `ALTER USER`, `CREATE USER` e `SET PASSWORD`.

* Para as declarações de `CREATE USER`, `validate_password` exige que uma senha seja fornecida e que ela satisfaça a política de senha. Isso é verdade mesmo que uma conta seja bloqueada inicialmente, pois caso contrário, desbloquear a conta posteriormente causaria que ela se tornasse acessível sem uma senha que satisfaça a política.

* `validate_password` implementa uma função SQL `VALIDATE_PASSWORD_STRENGTH()` que avalia a força das senhas potenciais. Essa função recebe um argumento de senha e retorna um número inteiro de 0 (fraco) a 100 (forte).

Nota

Para declarações que atribuem ou modificam senhas de conta (`ALTER USER`, `CREATE USER` e `SET PASSWORD`), as capacidades `validate_password` descritas aqui se aplicam apenas a contas que utilizam um plugin de autenticação que armazena as credenciais internamente no MySQL. Para contas que utilizam plugins que realizam autenticação contra um sistema de credenciais externo ao MySQL, o gerenciamento de senhas deve ser realizado externamente contra esse sistema também. Para mais informações sobre armazenamento de credenciais internas, consulte a Seção 8.2.15, “Gerenciamento de Senhas”.

A restrição anterior não se aplica ao uso da função `VALIDATE_PASSWORD_STRENGTH()`, porque ela não afeta diretamente as contas.

Exemplos:

* `validate_password` verifica a senha em texto claro na seguinte declaração. De acordo com a política de senha padrão, que exige que as senhas tenham pelo menos 8 caracteres, a senha é fraca e a declaração produz um erro:

  ```
  mysql> ALTER USER USER() IDENTIFIED BY 'abc';
  ERROR 1819 (HY000): Your password does not satisfy the current
  policy requirements
  ```

* Senhas especificadas como valores hash não são verificadas porque o valor original da senha não está disponível para verificação:

  ```
  mysql> ALTER USER 'jeffrey'@'localhost'
         IDENTIFIED WITH mysql_native_password
         AS '*0D3CED9BEC10A777AEC23CCC353A8C08A633045E';
  Query OK, 0 rows affected (0.01 sec)
  ```

* A declaração de criação da conta falha, mesmo que a conta esteja inicialmente bloqueada, porque não inclui uma senha que satisfaça a política de senha atual:

  ```
  mysql> CREATE USER 'juanita'@'localhost' ACCOUNT LOCK;
  ERROR 1819 (HY000): Your password does not satisfy the current
  policy requirements
  ```

* Para verificar uma senha, use a função `VALIDATE_PASSWORD_STRENGTH()`:

  ```
  mysql> SELECT VALIDATE_PASSWORD_STRENGTH('weak');
  +------------------------------------+
  | VALIDATE_PASSWORD_STRENGTH('weak') |
  +------------------------------------+
  |                                 25 |
  +------------------------------------+
  mysql> SELECT VALIDATE_PASSWORD_STRENGTH('lessweak$_@123');
  +----------------------------------------------+
  | VALIDATE_PASSWORD_STRENGTH('lessweak$_@123') |
  +----------------------------------------------+
  |                                           50 |
  +----------------------------------------------+
  mysql> SELECT VALIDATE_PASSWORD_STRENGTH('N0Tweak$_@123!');
  +----------------------------------------------+
  | VALIDATE_PASSWORD_STRENGTH('N0Tweak$_@123!') |
  +----------------------------------------------+
  |                                          100 |
  +----------------------------------------------+
  ```

Para configurar a verificação de senha, modifique as variáveis do sistema com nomes do tipo `validate_password.xxx`; esses são os parâmetros que controlam a política de senha. Veja a Seção 8.4.3.2, “Opções e Variáveis de Validação de Senha”.

Se o `validate_password` não estiver instalado, as variáveis do sistema `validate_password.xxx` não estarão disponíveis, as senhas nas declarações não serão verificadas e a função `VALIDATE_PASSWORD_STRENGTH()` sempre retornará 0. Por exemplo, sem o plugin instalado, as contas podem receber senhas mais curtas que 8 caracteres ou sem senha alguma.

Supondo que o `validate_password` esteja instalado, ele implementa três níveis de verificação de senha: `LOW`, `MEDIUM` e `STRONG`. O padrão é `MEDIUM`; para alterar isso, modifique o valor de `validate_password.policy`. As políticas implementam testes de senha cada vez mais rigorosos. As descrições a seguir referem-se aos valores dos parâmetros padrão, que podem ser modificados alterando as variáveis do sistema apropriadas.

* Os testes de políticas `LOW` só testam o comprimento da senha. As senhas devem ter pelo menos 8 caracteres. Para alterar esse comprimento, modifique `validate_password.length`.

* A política `MEDIUM` adiciona as condições de que as senhas devem conter pelo menos 1 caractere numérico, 1 caractere minúsculo, 1 caractere maiúsculo e 1 caractere especial (não alfanumérico). Para alterar esses valores, modifique `validate_password.number_count`, `validate_password.mixed_case_count` e `validate_password.special_char_count`.

* A política `STRONG` adiciona a condição de que substratos de senha de comprimento igual ou superior a 4 não devem corresponder a palavras no arquivo de dicionário, se um tiver sido especificado. Para especificar o arquivo de dicionário, modifique `validate_password.dictionary_file`.

Além disso, `validate_password` suporta a capacidade de rejeitar senhas que correspondem à parte do nome do usuário da conta de usuário efetiva para a sessão atual, seja para frente ou para trás. Para fornecer controle sobre essa capacidade, `validate_password` expõe uma variável de sistema `validate_password.check_user_name`, que é habilitada por padrão.

#### 8.4.3.1 Instalação e Desinstalação do Componente de Validação de Senha

Esta seção descreve como instalar e desinstalar o componente de validação de senha `validate_password`. Para informações gerais sobre instalação e desinstalação de componentes, consulte a Seção 7.5, “Componentes MySQL”.

Nota

Se você instalar o MySQL 8.0 usando o [repositório MySQL Yum][(https://dev.mysql.com/downloads/repo/yum/)], [repositório SLES MySQL][(https://dev.mysql.com/downloads/repo/suse/)] ou [pacotes RPM fornecidos pela Oracle][(linux-installation-rpm.html "2.5.4 Installing MySQL on Linux Using RPM Packages from Oracle")], o componente `validate_password` é ativado por padrão após você iniciar seu servidor MySQL pela primeira vez.

As atualizações do MySQL 8.0 a partir da versão 5.7 usando pacotes Yum ou RPM deixam o plugin `validate_password` em vigor. Para fazer a transição do plugin `validate_password` para o componente `validate_password`, consulte a Seção 8.4.3.3, “Transição para o Componente de Validação de Senha”.

Para ser utilizável pelo servidor, o arquivo da biblioteca de componentes deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin, definindo o valor de `plugin_dir` na inicialização do servidor.

Para instalar o componente `validate_password`, use esta declaração:

```
INSTALL COMPONENT 'file://component_validate_password';
```

A instalação do componente é uma operação única que não precisa ser feita por inicialização do servidor. `INSTALL COMPONENT` (install-component.html "15.7.4.3 INSTALL COMPONENT Statement") carrega o componente e também o registra na tabela do sistema `mysql.component` para que ele seja carregado durante as subsequentes inicializações do servidor.

Para desinstalar o componente `validate_password`, use esta declaração:

```
UNINSTALL COMPONENT 'file://component_validate_password';
```

`UNINSTALL COMPONENT` descarrega o componente e o desregistra da tabela de sistema `mysql.component`, para que ele não seja carregado durante as subsequentes inicializações do servidor.

#### 8.4.3.2 Opções e variáveis de validação de senha

Esta seção descreve as variáveis de sistema e status que o `validate_password` fornece para permitir que sua operação seja configurada e monitorada.

* Componentes de validação de senha Variáveis de sistema * Variáveis de status do componente de validação de senha * Opções do plugin de validação de senha * Variáveis de sistema do plugin de validação de senha * Variáveis de status do plugin de validação de senha

##### Sistema de validação de senha Componentes Variáveis

Se o componente `validate_password` estiver habilitado, ele expõe várias variáveis do sistema que permitem a configuração da verificação de senha:

```
mysql> SHOW VARIABLES LIKE 'validate_password.%';
+-------------------------------------------------+--------+
| Variable_name                                   | Value  |
+-------------------------------------------------+--------+
| validate_password.changed_characters_percentage | 0      |
| validate_password.check_user_name               | ON     |
| validate_password.dictionary_file               |        |
| validate_password.length                        | 8      |
| validate_password.mixed_case_count              | 1      |
| validate_password.number_count                  | 1      |
| validate_password.policy                        | MEDIUM |
| validate_password.special_char_count            | 1      |
+-------------------------------------------------+--------+
```

Para alterar a forma como as senhas são verificadas, você pode definir essas variáveis do sistema no início do servidor ou no runtime. A lista a seguir descreve o significado de cada variável.

* `validate_password.changed_characters_percentage`

  <table frame="box" rules="all" summary="Properties for validate_password.changed_characters_percentage"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.changed-characters-percentage[=value]</code></td> </tr><tr><th>Introduced</th> <td>8.0.34</td> </tr><tr><th>System Variable</th> <td><code>validate_password.changed_characters_percentage</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>100</code></td> </tr></tbody></table>

Indica o número mínimo de caracteres, como uma porcentagem de todos os caracteres, em uma senha que um usuário deve alterar antes que o `validate_password` aceite uma nova senha para a conta do usuário. Isso se aplica apenas ao alterar uma senha existente e não tem efeito ao definir a senha inicial de uma conta de usuário.

Essa variável não está disponível, a menos que `validate_password` esteja instalado.

Por padrão, `validate_password.changed_characters_percentage` permite que todos os caracteres da senha atual sejam reutilizados na nova senha. A faixa de porcentagem válida é de 0 a 100. Se configurada em 100 por cento, todos os caracteres da senha atual são rejeitados, independentemente da formatação. Os caracteres '`abc`' e '`ABC`' são considerados os mesmos caracteres. Se `validate_password` rejeitar a nova senha, ele reporta um erro indicando o número mínimo de caracteres que devem diferir.

Se a declaração `ALTER USER` não fornecer a senha existente em uma cláusula `REPLACE`, essa variável não será aplicada. Se a cláusula `REPLACE` é necessária está sujeita à política de verificação de senha, conforme ela se aplica a uma conta específica. Para uma visão geral da política, consulte a Política de Verificação de Senha-Requerida.

* `validate_password.check_user_name`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.check_user_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

Se `validate_password` comparar as senhas com a parte do nome de usuário da conta de usuário efetiva para a sessão atual e rejeitá-las se elas corresponderem. Esta variável não está disponível, a menos que `validate_password` esteja instalado.

Por padrão, `validate_password.check_user_name` está habilitado. Essa variável controla a correspondência do nome do usuário independentemente do valor de `validate_password.policy`.

Quando o `validate_password.check_user_name` está habilitado, ele tem esses efeitos:

O controle ocorre em todos os contextos para os quais o `validate_password` é invocado, o que inclui o uso de declarações como `ALTER USER` ou `SET PASSWORD` para alterar a senha do usuário atual, e a invocação de funções como `VALIDATE_PASSWORD_STRENGTH()`.

+ Os nomes de usuário utilizados para comparação são retirados dos valores das funções `USER()` e `CURRENT_USER()` para a sessão atual. Uma implicação é que um usuário que tem privilégios suficientes para definir a senha de outro usuário pode definir a senha para o nome desse usuário e não pode definir a senha desse usuário para o nome do usuário que está executando a declaração. Por exemplo, `'root'@'localhost'` pode definir a senha para `'jeffrey'@'localhost'` para `'jeffrey'`, mas não pode definir a senha para `'root`.

+ Apenas a parte do nome do usuário das funções `USER()` e `CURRENT_USER()` é usada, não a parte do nome do host. Se o nome do usuário estiver vazio, não ocorre nenhuma comparação.

+ Se uma senha for igual ao nome do usuário ou ao seu reverso, ocorre uma correspondência e a senha é rejeitada.

+ A correspondência de nome de usuário é sensível ao caso. Os valores de senha e nome de usuário são comparados como strings binárias, caracter a caractere.

+ Se uma senha corresponder ao nome do usuário, `VALIDATE_PASSWORD_STRENGTH()` retorna 0, independentemente de como as outras variáveis do sistema `validate_password` estão configuradas.

* `validate_password.dictionary_file`

  <table frame="box" rules="all" summary="Properties for validate_password.dictionary_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.dictionary-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.dictionary_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

O nome do caminho do arquivo do dicionário que o `validate_password` usa para verificar senhas. Essa variável não está disponível, a menos que o `validate_password` esteja instalado.

Por padrão, essa variável tem um valor vazio e as verificações de dicionário não são realizadas. Para que as verificações de dicionário ocorram, o valor da variável deve ser não vazio. Se o arquivo estiver nomeado como um caminho relativo, ele será interpretado em relação ao diretório de dados do servidor. O conteúdo do arquivo deve ser minúsculo, uma palavra por linha. O conteúdo é tratado como tendo um conjunto de caracteres de `utf8mb3`. O tamanho máximo permitido do arquivo é de 1 MB.

Para que o arquivo do dicionário seja usado durante a verificação da senha, a política de senha deve ser definida como 2 (`STRONG`); veja a descrição da variável de sistema `validate_password.policy`. Supondo que isso seja verdade, cada subdivisão da senha com comprimento de 4 a 100 é comparada com as palavras no arquivo do dicionário. Qualquer correspondência faz com que a senha seja rejeitada. As comparações não são sensíveis ao caso.

Para `VALIDATE_PASSWORD_STRENGTH()`, a senha é verificada em todas as políticas, incluindo `STRONG`, portanto, a avaliação de força inclui a verificação de dicionário, independentemente do valor de `validate_password.policy`.

`validate_password.dictionary_file` pode ser configurado em tempo de execução e, ao atribuir um valor, o arquivo nomeado é lido sem necessidade de reiniciar o servidor.

* `validate_password.length`

  <table frame="box" rules="all" summary="Properties for validate_password.length"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.length=#</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.length</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>8</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr></tbody></table>

O número mínimo de caracteres que o `validate_password` exige para que as senhas tenham. Esta variável não está disponível, a menos que o `validate_password` esteja instalado.

O valor mínimo do `validate_password.length` é uma função de várias outras variáveis relacionadas do sistema. O valor não pode ser definido em menos do que o valor desta expressão:

  ```
  validate_password.number_count
  + validate_password.special_char_count
  + (2 * validate_password.mixed_case_count)
  ```

Se `validate_password` ajustar o valor de `validate_password.length` devido à restrição anterior, ele escreve uma mensagem no log de erro.

* `validate_password.mixed_case_count`

  <table frame="box" rules="all" summary="Properties for validate_password.mixed_case_count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.mixed-case-count=#</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.mixed_case_count</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr></tbody></table>

O número mínimo de caracteres minúsculas e maiúsculas que o `validate_password` exige que as senhas tenham se a política de senha for `MEDIUM` ou mais forte. Esta variável não está disponível a menos que o `validate_password` esteja instalado.

Para um valor específico de `validate_password.mixed_case_count`, a senha deve ter tantas letras minúsculas e tantas letras maiúsculas.

* `validate_password.number_count`

  <table frame="box" rules="all" summary="Properties for validate_password.number_count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.number-count=#</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.number_count</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr></tbody></table>

O número mínimo de caracteres numéricos (alfanuméricos) que o `validate_password` exige que as senhas tenham se a política de senha for `MEDIUM` ou mais forte. Esta variável não está disponível a menos que o `validate_password` esteja instalado.

* `validate_password.policy`

  <table frame="box" rules="all" summary="Properties for validate_password.policy"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.policy=value</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.policy</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>0</code></p><p class="valid-value"><code>1</code></p><p class="valid-value"><code>2</code></p></td> </tr></tbody></table>

A política de senha aplicada por `validate_password`. Esta variável não está disponível, a menos que `validate_password` esteja instalado.

`validate_password.policy` afeta a forma como `validate_password` utiliza suas outras variáveis de sistema de definição de políticas, exceto para verificar senhas contra nomes de usuário, que é controlada de forma independente por `validate_password.check_user_name`.

O valor `validate_password.policy` pode ser especificado usando valores numéricos 0, 1, 2 ou os valores simbólicos correspondentes `LOW`, `MEDIUM`, `STRONG`. O seguinte quadro descreve os testes realizados para cada política. Para o teste de comprimento, o comprimento necessário é o valor da variável do sistema `validate_password.length`. Da mesma forma, os valores necessários para os outros testes são fornecidos por outras variáveis `validate_password.xxx`.

  <table summary="Password policies enforced by the validate_password component and the tests performed for each policy."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Política</th> <th>Tests Performed</th> </tr></thead><tbody><tr> <td><code>0</code>ou<code>LOW</code></td> <td>Length</td> </tr><tr> <td><code>1</code>ou<code>MEDIUM</code></td> <td>Length; numeric, lowercase/uppercase, and special characters</td> </tr><tr> <td><code>2</code>ou<code>STRONG</code></td> <td>Length; numeric, lowercase/uppercase, and special characters; dictionary file</td> </tr></tbody></table>

* `validate_password.special_char_count`

  <table frame="box" rules="all" summary="Properties for validate_password.special_char_count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.special-char-count=#</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.special_char_count</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr></tbody></table>

O número mínimo de caracteres não alfanuméricos que o `validate_password` exige que as senhas tenham se a política de senha for `MEDIUM` ou mais forte. Esta variável não está disponível a menos que o `validate_password` esteja instalado.

##### Variáveis de status do componente de validação de senha

Se o componente `validate_password` estiver habilitado, ele expõe variáveis de status que fornecem informações operacionais:

```
mysql> SHOW STATUS LIKE 'validate_password.%';
+-----------------------------------------------+---------------------+
| Variable_name                                 | Value               |
+-----------------------------------------------+---------------------+
| validate_password.dictionary_file_last_parsed | 2019-10-03 08:33:49 |
| validate_password.dictionary_file_words_count | 1902                |
+-----------------------------------------------+---------------------+
```

A lista a seguir descreve o significado de cada variável de status.

* `validate_password.dictionary_file_last_parsed`

Quando o arquivo do dicionário foi analisado pela última vez. Essa variável não está disponível, a menos que `validate_password` esteja instalado.

* `validate_password.dictionary_file_words_count`

O número de palavras lidas a partir do arquivo do dicionário. Esta variável não está disponível, a menos que `validate_password` esteja instalado.

Opções do Plugin de Validação de Senha #####

Nota

No MySQL 8.0, o plugin `validate_password` foi reimplementado como o componente `validate_password`. O plugin `validate_password` é desatualizado; espere que ele seja removido em uma versão futura do MySQL. Consequentemente, suas opções também são desatualizadas, e você deve esperar que elas também sejam removidas. As instalações do MySQL que usam o plugin devem fazer a transição para o uso do componente em vez disso. Veja a Seção 8.4.3.3, “Transição para o Componente de Validação de Senha”.

Para controlar a ativação do plugin `validate_password`, use esta opção:

* `--validate-password[=value]`

  <table frame="box" rules="all" summary="Properties for validate-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

Esta opção controla como o servidor carrega o plugin desatualizado `validate_password` no início. O valor deve ser um dos disponíveis para as opções de carregamento de plugins, conforme descrito na Seção 7.6.1, “Instalando e Desinstalando Plugins”. Por exemplo, `--validate-password=FORCE_PLUS_PERMANENT` informa ao servidor que carregue o plugin no início e impeça que ele seja removido enquanto o servidor estiver em execução.

Esta opção está disponível apenas se o plugin `validate_password` tiver sido previamente registrado com `INSTALL PLUGIN` ou estiver carregado com `--plugin-load-add`. Veja a Seção 8.4.3.1, “Instalação e Desinstalação do Componente de Validação de Senha”.

##### Plugin de validação de senha Variáveis de sistema

Nota

No MySQL 8.0, o plugin `validate_password` foi reimplementado como o componente `validate_password`. O plugin `validate_password` é desatualizado; espere que ele seja removido em uma versão futura do MySQL. Consequentemente, suas variáveis de sistema também são desatualizadas e você deve esperar que elas também sejam removidas. Use as variáveis de sistema correspondentes do componente `validate_password`; veja Variáveis de sistema do componente de validação de senha. As instalações do MySQL que usam o plugin devem fazer a transição para usar o componente em vez disso. Veja Seção 8.4.3.3, “Transição para o Componente de Validação de Senha”.

* `validate_password_check_user_name`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.check_user_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>0

Essa variável do sistema de plugin `validate_password` é desatualizada; espere que ela seja removida em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.check_user_name` do componente `validate_password` em vez disso.

* `validate_password_dictionary_file`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.check_user_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>1

Essa variável do sistema de plugin `validate_password` é desatualizada; espere que ela seja removida em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.dictionary_file` do componente `validate_password` em vez disso.

* `validate_password_length`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.check_user_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>2

Essa variável do sistema de plugin `validate_password` é desatualizada; espere que ela seja removida em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.length` do componente `validate_password` em vez disso.

* `validate_password_mixed_case_count`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.check_user_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>3

Essa variável do sistema de plugin `validate_password` é desatualizada; espere que ela seja removida em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.mixed_case_count` do componente `validate_password` em vez disso.

* `validate_password_number_count`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.check_user_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>4

Essa variável do sistema de plugin `validate_password` é desatualizada; espere que ela seja removida em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.number_count` do componente `validate_password` em vez disso.

* `validate_password_policy`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.check_user_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>5

Essa variável do sistema de plugin `validate_password` é desatualizada; espere que ela seja removida em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.policy` do componente `validate_password` em vez disso.

* `validate_password_special_char_count`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.check_user_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>6

Essa variável do sistema de plugin `validate_password` é desatualizada; espere que ela seja removida em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.special_char_count` do componente `validate_password` em vez disso.

Variáveis de status do plugin de validação de senha #####

Nota

No MySQL 8.0, o plugin `validate_password` foi reimplementado como o componente `validate_password`. O plugin `validate_password` é desatualizado; espere que ele seja removido em uma versão futura do MySQL. Consequentemente, suas variáveis de status também são desatualizadas; espere que elas sejam removidas. Use as variáveis de status correspondentes do componente `validate_password`; veja Variáveis de Status do Componente de Validação de Senha. As instalações do MySQL que usam o plugin devem fazer a transição para usar o componente em vez disso. Veja a Seção 8.4.3.3, “Transição para o Componente de Validação de Senha”.

* `validate_password_dictionary_file_last_parsed`

Essa variável de status do plugin `validate_password` é desatualizada; espere que ela seja removida em uma versão futura do MySQL. Use a variável de status correspondente `validate_password.dictionary_file_last_parsed` do componente `validate_password` em vez disso.

* `validate_password_dictionary_file_words_count`

Essa variável de status do plugin `validate_password` é desatualizada; espere que ela seja removida em uma versão futura do MySQL. Use a variável de status correspondente `validate_password.dictionary_file_words_count` do componente `validate_password` em vez disso.

#### 8.4.3.3 Transição para o componente de validação de senha

Nota

No MySQL 8.0, o plugin `validate_password` foi reimplementado como o componente `validate_password`. O plugin `validate_password` é desatualizado; espere que ele seja removido em uma versão futura do MySQL.

As instalações do MySQL que atualmente utilizam o plugin `validate_password` devem fazer a transição para o uso do componente `validate_password` em vez disso. Para fazer isso, use o procedimento a seguir. O procedimento instala o componente antes de desinstalar o plugin, para evitar uma janela de tempo durante a qual não ocorre validação de senha. (O componente e o plugin podem ser instalados simultaneamente. Neste caso, o servidor tenta usar o componente, revertendo para o plugin se o componente estiver indisponível.)

1. Instale o componente `validate_password`:

   ```
   INSTALL COMPONENT 'file://component_validate_password';
   ```

2. Teste o componente `validate_password` para garantir que ele funcione conforme o esperado. Se você precisar definir quaisquer variáveis de sistema do sistema `validate_password.xxx`, pode fazê-lo em tempo de execução usando `SET GLOBAL`. (Quaisquer alterações em arquivos de opção que devem ser feitas são realizadas na etapa seguinte.)

3. Ajuste quaisquer referências ao sistema de plugins e às variáveis de status para se referirem aos sistemas e variáveis de status correspondentes. Suponha que, anteriormente, você configurou o plugin na inicialização usando um arquivo de opção como este:

   ```
   [mysqld]
   validate-password=FORCE_PLUS_PERMANENT
   validate_password_dictionary_file=/usr/share/dict/words
   validate_password_length=10
   validate_password_number_count=2
   ```

Esses ajustes são apropriados para o plugin, mas devem ser modificados para se aplicar ao componente. Para ajustar o arquivo de opção, omita a opção `--validate-password` (ela se aplica apenas ao plugin, não ao componente), e modifique as referências das variáveis do sistema de nomes sem ponto apropriados para o plugin para nomes com ponto apropriados para o componente:

   ```
   [mysqld]
   validate_password.dictionary_file=/usr/share/dict/words
   validate_password.length=10
   validate_password.number_count=2
   ```

Ajustes semelhantes são necessários para aplicações que fazem referência ao sistema de plugins `validate_password` e às variáveis de status no momento da execução. Altere os nomes de variáveis de plugins sem ponto para os nomes de variáveis de componentes com ponto correspondentes.

4. Desinstale o plugin `validate_password`:

   ```
   UNINSTALL PLUGIN validate_password;
   ```

Se o plugin `validate_password` for carregado na inicialização do servidor usando uma opção `--plugin-load` ou `--plugin-load-add`, omita essa opção do procedimento de inicialização do servidor. Por exemplo, se a opção estiver listada em um arquivo de opções do servidor, remova-a do arquivo.

5. Reinicie o servidor.

### 8.4.4 O Keyring do MySQL

O MySQL Server suporta um chaveiro que permite que os componentes internos do servidor e os plugins armazenem informações sensíveis de forma segura para recuperação posterior. A implementação compreende esses elementos:

* Componentes e plugins do Keyring que gerenciam um armazenamento de suporte ou se comunicam com um backend de armazenamento. O uso do Keyring envolve a instalação de um dos componentes e plugins disponíveis. Tanto os componentes quanto os plugins do Keyring gerenciam dados do Keyring, mas são configurados de maneira diferente e podem ter diferenças operacionais (consulte Seção 8.4.4.1, “Componentes do Keyring Versus Plugins do Keyring”).

Esses componentes do chaveiro estão disponíveis:

+ `component_keyring_file`: Armazena dados do chaveiro em um arquivo local ao host do servidor. Disponível nas edições MySQL Community Edition e MySQL Enterprise Edition a partir do MySQL 8.0.24. Veja a Seção 8.4.4.4, “Usando o componente_chaveiro_file Componente de chaveiro baseado em arquivo”.

+ `component_keyring_encrypted_file`: Armazena dados do chaveiro em um arquivo criptografado e protegido por senha, localizado no host do servidor. Disponível nas distribuições da Edição Empresarial do MySQL a partir do MySQL 8.0.24. Veja [Seção 8.4.4.5, “Usando o componente_chaveiro_encrypted_file Componente de chaveiro baseado em arquivo criptografado”][(keyring-encrypted-file-component.html "8.4.4.5 Using the component_keyring_encrypted_file Encrypted File-Based Keyring Component")].

+ `component_keyring_oci`: Armazena dados do chaveiro no Oracle Cloud Infrastructure Vault. Disponível nas distribuições da Edição Empresarial do MySQL a partir do MySQL 8.0.31. Veja a Seção 8.4.4.11, “Usando o componente de chaveiro do Oracle Cloud Infrastructure Vault”.

Estes plugins para chaveiro estão disponíveis:

+ `keyring_file` (desatualizado a partir do MySQL 8.0.34): Armazena dados do chaveiro em um arquivo local ao host do servidor. Disponível nas distribuições da Edição Comunitária do MySQL e na Edição Empresarial do MySQL. Veja a Seção 8.4.4.6, “Usando o plugin de chaveiro baseado em arquivo keyring_file”.

+ `keyring_encrypted_file` (desatualizado a partir do MySQL 8.0.34): Armazena dados do chaveiro em um arquivo criptografado e protegido por senha, localizado no host do servidor. Disponível nas distribuições da Edição Empresarial do MySQL. Veja a Seção 8.4.4.7, “Usando o plugin de chaveiro criptografado de arquivo encrypted_file”.

+ `keyring_okv`: Um plugin KMIP 1.1 para uso com produtos de armazenamento de chave de rede compatíveis com KMIP, como o Oracle Key Vault e o Gemalto SafeNet KeySecure Appliance. Disponível em distribuições da Edição Empresarial do MySQL. Veja a Seção 8.4.4.8, “Usando o plugin keyring_okv KMIP”.

+ `keyring_aws`: Comunica-se com o Serviço de Gerenciamento de Chave do Amazon Web Services para geração de chaves e utiliza um arquivo local para armazenamento de chaves. Disponível nas distribuições da Edição Empresarial do MySQL. Veja a Seção 8.4.4.9, “Usando o plugin keyring_aws Amazon Web Services Keyring”.

+ `keyring_hashicorp`: Comunica-se com o HashiCorp Vault para armazenamento de back end. Disponível nas distribuições da Edição Empresarial do MySQL a partir do MySQL 8.0.18. Veja a Seção 8.4.4.10, “Usando o Plugin de Keychain do HashiCorp Vault”.

+ `keyring_oci` (descontinuada a partir do MySQL 8.0.31): Comunica-se com o Oracle Cloud Infrastructure Vault para armazenamento de back end. Disponível nas distribuições da Edição Empresarial do MySQL a partir do MySQL 8.0.22. Veja a Seção 8.4.4.12, “Usando o Oracle Cloud Infrastructure Vault Keyring Plugin”.

* Uma interface de serviço de chave de chave para gerenciamento de chaves de chave. Este serviço é acessível em dois níveis:

+ Interface SQL: Nas declarações SQL, chame as funções descritas na Seção 8.4.4.15, “Funções de gerenciamento de chave de cartela de propósito geral”.

+ Interface C: No código em linguagem C, chame as funções do serviço de chave de registro descritas na Seção 7.6.9.2, “O serviço de chave de registro”.

* Acesso a metadados chave:

+ A tabela Schema de desempenho `keyring_keys` exibe metadados para as chaves no chaveiro. Os metadados das chaves incluem IDs de chave, proprietários de chave e IDs de chave de backend. A tabela `keyring_keys` não exibe dados sensíveis do chaveiro, como o conteúdo das chaves. Disponível a partir do MySQL 8.0.16. Veja a Seção 29.12.18.2, “A tabela chaveiro_chave”.

+ A tabela do Schema de desempenho `keyring_component_status` fornece informações de status sobre o componente de chave de segurança em uso, se um deles estiver instalado. Disponível a partir do MySQL 8.0.24. Veja a Seção 29.12.18.1, “A tabela keyring_component_status”.

* Uma capacidade migratória fundamental. O MySQL suporta a migração de chaves entre keystores, permitindo que os administradores de banco de dados mudem uma instalação do MySQL de um keystore para outro. Veja a Seção 8.4.4.14, “Migrando chaves entre keystores de keyring”.

* A implementação de plugins de chave de segurança é revisada a partir do MySQL 8.0.24 para usar a infraestrutura do componente. Isso é facilitado usando o plugin embutido chamado `daemon_keyring_proxy_plugin` que atua como uma ponte entre as APIs do serviço de plugin e componente. Veja a Seção 7.6.8, “O Plugin de Ponte do Proxy de Chave de Segurança”.

Aviso

Para a gestão de chaves de criptografia, os componentes `component_keyring_file` e `component_keyring_encrypted_file` e os plugins `keyring_file` e `keyring_encrypted_file` não são destinados como uma solução de conformidade regulatória. Padrões de segurança, como PCI, FIPS e outros, exigem o uso de sistemas de gestão de chaves para proteger, gerenciar e proteger as chaves de criptografia em cofres de chave ou módulos de segurança de hardware (HSMs).

Entre os consumidores do serviço de chave de segurança no MySQL estão:

* O motor de armazenamento `InnoDB` utiliza a chave do conjunto de chaves para armazenar sua chave para criptografia de espaço de tabela. Veja a Seção 17.13, “Criptografia de dados em repouso do InnoDB”.

* O MySQL Enterprise Audit usa a chave de criptografia do arquivo de registro de auditoria. Veja Criptografar arquivos de registro de auditoria.

* O gerenciamento de logs binários e logs de retransmissão suporta criptografia com chave de segurança para arquivos de log. Com a criptografia de arquivos de log ativada, a chave de segurança armazena as chaves usadas para criptografar senhas para os arquivos de log binários e arquivos de log de retransmissão. Veja a Seção 19.3.2, “Criptografando arquivos de log binários e arquivos de log de retransmissão”.

* A chave mestre para descriptografar a chave do arquivo que descriptografa os valores persistentes de variáveis de sistema sensíveis é armazenada no chaveiro. Um componente do chaveiro deve ser habilitado na instância do servidor MySQL para suportar o armazenamento seguro para valores de variáveis de sistema persistentes, em vez de um plugin do chaveiro, que não suportam a função. Veja Persistindo Variáveis de Sistema Sensíveis.

Para obter instruções gerais de instalação do chaveiro, consulte a Seção 8.4.4.2, “Instalação do componente do chaveiro”, e a Seção 8.4.4.3, “Instalação do plugin do chaveiro”. Para obter informações de instalação e configuração específicas de um componente ou plugin de chaveiro dado, consulte a seção que o descreve.

Para obter informações sobre o uso das funções do chaveiro, consulte a Seção 8.4.4.15, “Funções de gerenciamento de chave do chaveiro de uso geral”.

Componentes de cartela de identificação, plugins e funções acessam um serviço de cartela de identificação que fornece a interface para a cartela de identificação. Para obter informações sobre como acessar esse serviço e escrever plugins para a cartela de identificação, consulte a Seção 7.6.9.2, “O Serviço de Cartela de Identificação” e Escrevendo Plugins para a Cartela de Identificação.

#### 8.4.4.1 Componentes do chaveiro versus plugins do chaveiro

O Keyring do MySQL originalmente implementou capacidades de keystore usando plugins do servidor, mas começou a fazer a transição para usar a infraestrutura do componente no MySQL 8.0.24. Esta seção compara brevemente os componentes e plugins do keyring para fornecer uma visão geral de suas diferenças. Isso pode ajudá-lo a fazer a transição de plugins para componentes, ou, se você está apenas começando a usar o keyring, ajudá-lo a escolher se deve usar um componente em relação ao uso de um plugin.

* O carregamento do plugin do cartela de identificação utiliza a opção [[`--early-plugin-load`]. O carregamento do componente do cartela de identificação utiliza um manifesto.

* A configuração do plugin de cartela de identificação é baseada em variáveis de sistema específicas do plugin. Para componentes de cartela de identificação, não são utilizadas variáveis de sistema. Em vez disso, cada componente tem seu próprio arquivo de configuração.

* Os componentes do cartela têm menos restrições do que os plugins de cartela em relação aos tipos e comprimentos de chave. Veja a Seção 8.4.4.13, “Tipos e comprimentos de chave suportados na cartela”.

Nota

`component_keyring_oci` (assim como o plugin `keyring_oci`) só pode gerar chaves do tipo `AES` com um tamanho de 16, 24 ou 32 bytes.

* Os componentes do cartela de identificação suportam o armazenamento seguro para valores de variáveis de sistema persistentes, enquanto os plugins de cartela de identificação não suportam essa função.

Um componente de chave de acesso deve ser habilitado na instância do servidor MySQL para suportar o armazenamento seguro de valores de variáveis de sistema persistentes. Os dados sensíveis que podem ser protegidos dessa forma incluem itens como chaves privadas e senhas que aparecem nos valores das variáveis de sistema. No arquivo do sistema operacional onde as variáveis de sistema persistentes são armazenadas, os nomes e valores das variáveis de sistema sensíveis são armazenados em um formato criptografado, juntamente com uma chave de arquivo gerada para decifrá-los. A chave de arquivo gerada é, por sua vez, criptografada usando uma chave mestre que é armazenada em um componente de chave de acesso. Veja Persistindo Variáveis de Sistema Sensíveis.

#### 8.4.4.2 Instalação do componente do porta-chave

Os consumidores do serviço de chaveiro exigem que um componente ou plugin de chaveiro seja instalado:

* Para usar um componente de chaveiro, comece com as instruções aqui.

* Para usar um plugin de chaveiro em vez disso, comece com a Seção 8.4.4.3, “Instalação do Plugin de Chaveiro”.

* Se você pretende usar as funções do chaveiro em conjunto com o componente ou plugin de chaveiro escolhido, instale as funções após instalar esse componente ou plugin, usando as instruções na Seção 8.4.4.15, "Funções de gerenciamento de chave de chaveiro de propósito geral".

Nota

Apenas um componente ou plugin do chaveiro deve ser ativado de cada vez. A ativação de vários componentes ou plugins do chaveiro não é suportada e os resultados podem não ser os esperados.

MySQL oferece essas opções de componentes de chave:

* `component_keyring_file`: Armazena dados do chaveiro em um arquivo local ao host do servidor. Disponível nas distribuições da Edição Comunitária do MySQL e da Edição Empresarial do MySQL.

* `component_keyring_encrypted_file`: Armazena dados do chaveiro em um arquivo criptografado e protegido por senha, localizado no host do servidor. Disponível em distribuições da Edição Empresarial do MySQL.

* `component_keyring_oci`: Armazena dados do chaveiro no Vault da Oracle Cloud Infrastructure. Disponível em distribuições da Edição Empresarial do MySQL.

Para ser utilizável pelo servidor, o arquivo da biblioteca de componentes deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin, definindo o valor de `plugin_dir` na inicialização do servidor.

Um componente ou plugin de chave de acesso deve ser carregado cedo durante a sequência de inicialização do servidor, para que outros componentes possam acessá-lo conforme necessário durante sua própria inicialização. Por exemplo, o mecanismo de armazenamento `InnoDB` usa a chave de acesso para a criptografia do espaço de tabela, portanto, um componente ou plugin de chave de acesso deve ser carregado e disponível antes da inicialização do `InnoDB`.

Nota

Um componente de chave de segurança deve ser habilitado na instância do servidor MySQL se você precisar suportar armazenamento seguro para valores de variáveis de sistema persistentes. O plugin de chave de segurança não suporta essa função. Veja Persistência de Variáveis de Sistema Sensíveis.

Ao contrário dos plugins de chave de segurança, os componentes da chave de segurança não são carregados usando a opção do servidor `--early-plugin-load` ou configurados usando variáveis do sistema. Em vez disso, o servidor determina qual componente da chave de segurança deve ser carregado durante o início usando um manifesto, e o componente carregado consulta seu próprio arquivo de configuração quando é inicializado. Portanto, para instalar um componente da chave de segurança, você deve:

1. Escreva um manifesto que diga ao servidor qual componente do chaveiro deve ser carregado.

2. Escreva um arquivo de configuração para esse componente do chaveiro.

O primeiro passo para instalar um componente de chaveiro é escrever um manifesto que indique qual componente deve ser carregado. Durante a inicialização, o servidor lê um arquivo de manifesto global ou um arquivo de manifesto global emparelhado com um arquivo de manifesto local:

* O servidor tenta ler seu arquivo de manifesto global do diretório onde o servidor está instalado.

* Se o arquivo de manifesto global indicar o uso de um arquivo de manifesto local, o servidor tenta ler seu arquivo de manifesto local do diretório de dados.

* Embora os arquivos de manifesto globais e locais estejam localizados em diretórios diferentes, o nome do arquivo é `mysqld.my` em ambos os locais.

* Não é um erro que um arquivo manifesto não exista. Nesse caso, o servidor não tenta carregar nenhum componente associado ao arquivo.

Os arquivos de manifesto locais permitem configurar o carregamento de componentes para múltiplas instâncias do servidor, de modo que as instruções de carregamento para cada instância do servidor sejam específicas para uma instância de diretório de dados dado. Isso permite que diferentes instâncias do MySQL usem componentes de chave diferentes.

Os arquivos de manifesto do servidor têm essas propriedades:

* Um arquivo de manifesto deve estar em formato JSON válido.
* Um arquivo de manifesto permite esses itens:

+ `"read_local_manifest"`: Este item é permitido apenas no arquivo de manifesto global. Se o item não estiver presente, o servidor usa apenas o arquivo de manifesto global. Se o item estiver presente, seu valor é `true` ou `false`, indicando se o servidor deve ler informações de carregamento de componentes do arquivo de manifesto local.

Se o item `"read_local_manifest"` estiver presente no arquivo de manifesto global, juntamente com outros itens, o servidor verifica o valor do item `"read_local_manifest"` primeiro:

- Se o valor for `false`, o servidor processa os outros itens no arquivo de manifesto global e ignora o arquivo de manifesto local.

- Se o valor for `true`, o servidor ignora os outros itens no arquivo de manifesto global e tenta ler o arquivo de manifesto local.

+ `"components"`: Este item indica qual componente deve ser carregado. O valor do item é uma string que especifica um URN de componente válido, como `"file://component_keyring_file"`. Um URN de componente começa com `file://` e indica o nome base do arquivo de biblioteca localizado no diretório do plugin MySQL que implementa o componente.

* O acesso do servidor a um arquivo de manifesto deve ser apenas de leitura. Por exemplo, um arquivo de manifesto de servidor `mysqld.my` pode ser de propriedade de `root` e ser lido/escrito em `root`, mas deve ser apenas de leitura para a conta usada para executar o servidor MySQL. Se o arquivo de manifesto for encontrado durante a inicialização como sendo lido/escrito naquela conta, o servidor escreve um aviso no log de erro sugerindo que o arquivo seja tornado apenas de leitura.

* O administrador do banco de dados tem a responsabilidade de criar quaisquer arquivos de manifesto a serem utilizados e de garantir que seu modo de acesso e conteúdo estejam corretos. Se ocorrer um erro, o início do servidor falha e o administrador deve corrigir quaisquer problemas indicados pelos diagnósticos no log de erro do servidor.

Dadas as propriedades do arquivo manifesto anterior, para configurar o servidor para carregar `component_keyring_file`, crie um arquivo manifesto global com o nome `mysqld.my` no diretório de instalação do **mysqld** e, opcionalmente, crie um arquivo manifesto local, também com o nome `mysqld.my`, no diretório de dados. As instruções a seguir descrevem como carregar `component_keyring_file`. Para carregar um componente de chave diferente, substitua seu nome por `component_keyring_file`.

* Para usar apenas um arquivo de manifesto global, o conteúdo do arquivo é o seguinte:

  ```
  {
    "components": "file://component_keyring_file"
  }
  ```

Crie este arquivo no diretório onde o **mysqld** está instalado.

* Alternativamente, para usar um par de arquivos de manifesto global e local, o arquivo global é o seguinte:

  ```
  {
    "read_local_manifest": true
  }
  ```

Crie este arquivo no diretório onde o **mysqld** está instalado.

O arquivo local parece assim:

  ```
  {
    "components": "file://component_keyring_file"
  }
  ```

Crie este arquivo no diretório de dados.

Com o manifesto em vigor, proceda a configuração do componente da chave de segurança. Para isso, verifique as notas do componente da chave de segurança escolhido para obter instruções de configuração específicas para esse componente:

* `component_keyring_file`: Seção 8.4.4.4, “Usando o componente_keyring_file Component Component File-Based Keyring”.

* `component_keyring_encrypted_file`: [Seção 8.4.4.5, “Usando o componente_keyring_encrypted_file Componente de cartela de chaves criptografado com arquivo”](keyring-encrypted-file-component.html "8.4.4.5 Using the component_keyring_encrypted_file Encrypted File-Based Keyring Component").

* `component_keyring_oci`: Seção 8.4.4.11, “Usando o componente de carteirinha de chave do Oracle Cloud Infrastructure”.

Após realizar qualquer configuração específica para o componente, inicie o servidor. Verifique a instalação do componente examinando a tabela do Schema de desempenho `keyring_component_status`:

```
mysql> SELECT * FROM performance_schema.keyring_component_status;
+---------------------+-------------------------------------------------+
| STATUS_KEY          | STATUS_VALUE                                    |
+---------------------+-------------------------------------------------+
| Component_name      | component_keyring_file                          |
| Author              | Oracle Corporation                              |
| License             | GPL                                             |
| Implementation_name | component_keyring_file                          |
| Version             | 1.0                                             |
| Component_status    | Active                                          |
| Data_file           | /usr/local/mysql/keyring/component_keyring_file |
| Read_only           | No                                              |
+---------------------+-------------------------------------------------+
```

Um valor `Component_status` de `Active` indica que o componente foi inicializado com sucesso.

Se o componente não puder ser carregado, o início do servidor falha. Verifique o log de erro do servidor para mensagens de diagnóstico. Se o componente for carregado, mas não conseguir inicializar devido a problemas de configuração, o servidor será iniciado, mas o valor `Component_status` será `Disabled`. Verifique o log de erro do servidor, corrija os problemas de configuração e use a declaração `ALTER INSTANCE RELOAD KEYRING` para recarregar a configuração.

Os componentes do carteiro de bolso devem ser carregados apenas usando um arquivo de manifesto, não usando a declaração `INSTALL COMPONENT`(install-component.html "15.7.4.3 INSTALL COMPONENT Statement"). Os componentes do carteiro de bolso carregados usando essa declaração podem estar disponíveis muito tarde na sequência de inicialização do servidor para certos componentes que usam o carteiro de bolso, como `InnoDB`, porque eles são registrados na tabela do sistema `mysql.component` e carregados automaticamente para reinicializações subsequentes do servidor. Mas `mysql.component` é uma tabela `InnoDB`, então quaisquer componentes nomeados nela podem ser carregados durante a inicialização apenas após a inicialização de `InnoDB`.

Se nenhum componente ou plugin do chaveiro estiver disponível quando um componente tenta acessar o serviço do chaveiro, o serviço não poderá ser usado por esse componente. Como resultado, o componente pode falhar em inicializar ou pode inicializar com funcionalidade limitada. Por exemplo, se o `InnoDB` encontrar que há espaços de tabela criptografados quando ele é inicializado, ele tenta acessar o chaveiro. Se o chaveiro não estiver disponível, o `InnoDB` pode acessar apenas espaços de tabela não criptografados.

#### 8.4.4.3 Instalação do Plugin de Carteira de Chaves

Os consumidores do serviço de chaveiro exigem que um componente ou plugin de chaveiro seja instalado:

* Para usar um plugin de chaveiro, comece com as instruções aqui. (Além disso, para informações gerais sobre a instalação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.)

* Para usar um componente de chaveiro em vez disso, comece com a Seção 8.4.4.2, “Instalação do componente de chaveiro”.

* Se você pretende usar as funções do chaveiro em conjunto com o componente ou plugin de chaveiro escolhido, instale as funções após instalar esse componente ou plugin, usando as instruções na Seção 8.4.4.15, "Funções de gerenciamento de chave de chaveiro de propósito geral".

Nota

Apenas um componente ou plugin do chaveiro deve ser ativado de cada vez. A ativação de vários componentes ou plugins do chaveiro não é suportada e os resultados podem não ser os esperados.

Um componente de chave de acesso deve ser habilitado na instância do servidor MySQL se você precisar suportar armazenamento seguro para valores de variáveis de sistema persistentes, em vez de um plugin de chave de acesso, que não suportam a função. Veja Persistência de Variáveis de Sistema Sensíveis.

MySQL oferece essas opções de plugin de chave:

* `keyring_file` (descontinuada a partir do MySQL 8.0.34): Armazena dados do chaveiro em um arquivo local ao host do servidor. Disponível nas distribuições da Edição Comunitária do MySQL e da Edição Empresarial do MySQL. Para instruções sobre a instalação do componente que substitui este plugin, consulte Seção 8.4.4.2, “Instalação do Componente de Chaveiro”.

* `keyring_encrypted_file` (descontinuada a partir do MySQL 8.0.34): Armazena os dados do chaveiro em um arquivo criptografado e protegido por senha, localizado no host do servidor. Disponível em distribuições da Edição Empresarial do MySQL. Para instruções sobre a instalação do componente que substitui este plugin, consulte a Seção 8.4.4.2, “Instalação do Componente de Chaveiro”.

* `keyring_okv`: Um plugin KMIP 1.1 para uso com produtos de armazenamento de chave de rede compatíveis com KMIP, como o Oracle Key Vault e o Gemalto SafeNet KeySecure Appliance. Disponível em distribuições da Edição Empresarial do MySQL.

* `keyring_aws`: Comunica-se com o Serviço de Gerenciamento de Chave do Amazon Web Services como um backend para geração de chave e utiliza um arquivo local para armazenamento de chave. Disponível em distribuições da Edição Empresarial do MySQL.

* `keyring_hashicorp`: Comunica-se com HashiCorp Vault para armazenamento de back end. Disponível em distribuições da Edição Empresarial do MySQL.

* `keyring_oci` (desatualizado a partir do MySQL 8.0.31): Comunica-se com o Oracle Cloud Infrastructure Vault para armazenamento de back end. Veja a Seção 8.4.4.12, “Usando o Oracle Cloud Infrastructure Vault Keyring Plugin”.

Para ser utilizável pelo servidor, o arquivo da biblioteca de plugins deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin, definindo o valor de `plugin_dir` na inicialização do servidor.

Um componente ou plugin de chave de acesso deve ser carregado cedo durante a sequência de inicialização do servidor, para que outros componentes possam acessá-lo conforme necessário durante sua própria inicialização. Por exemplo, o mecanismo de armazenamento `InnoDB` usa a chave de acesso para a criptografia do espaço de tabela, portanto, um componente ou plugin de chave de acesso deve ser carregado e disponível antes da inicialização do `InnoDB`.

A instalação para cada plugin de chaveiro é semelhante. As instruções a seguir descrevem como instalar `keyring_file`. Para usar um plugin de chaveiro diferente, substitua seu nome por `keyring_file`.

O nome de arquivo da biblioteca de plugin `keyring_file` é `keyring_file`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para carregar o plugin, use a opção `--early-plugin-load` para nomear o arquivo da biblioteca do plugin que o contém. Por exemplo, em plataformas onde o sufixo do arquivo da biblioteca do plugin é `.so`, use essas linhas no arquivo do servidor `my.cnf`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
[mysqld]
early-plugin-load=keyring_file.so
```

Antes de iniciar o servidor, verifique as notas do seu plugin de chave de segurança escolhido para obter instruções de configuração específicas para esse plugin:

* `keyring_file`: Seção 8.4.4.6, “Usando o plugin de cartela de segurança baseado em arquivo keyring_file”.

* `keyring_encrypted_file`: Seção 8.4.4.7, “Usando o plugin de chave de arquivo criptografado keyring_encrypted_file”.

* `keyring_okv`: Seção 8.4.4.8, “Usando o plugin keyring_okv KMIP”.

* `keyring_aws`: Seção 8.4.4.9, “Usando o keyring_aws Amazon Web Services Keyring Plugin”

* `keyring_hashicorp`: Seção 8.4.4.10, “Usando o Plugin de Carteira de Chaves HashiCorp Vault”

* `keyring_oci`: Seção 8.4.4.12, “Usando o Oracle Cloud Infrastructure Vault Keyring Plugin”

Após realizar qualquer configuração específica do plugin, inicie o servidor. Verifique a instalação do plugin examinando a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 7.6.2, “Obtenção de Informações do Plugin do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'keyring%';
+--------------+---------------+
| PLUGIN_NAME  | PLUGIN_STATUS |
+--------------+---------------+
| keyring_file | ACTIVE        |
+--------------+---------------+
```

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

Os plugins podem ser carregados por métodos diferentes do `--early-plugin-load`, como a opção `--plugin-load` ou `--plugin-load-add` ou a declaração `INSTALL PLUGIN`. No entanto, os plugins do chaveiro carregados usando esses métodos podem estar disponíveis tarde demais na sequência de inicialização do servidor para certos componentes que usam o chaveiro, como `InnoDB`:

* O carregamento do plugin ocorre usando `--plugin-load` ou `--plugin-load-add` após a inicialização do `InnoDB`.

* Os plugins instalados usando `INSTALL PLUGIN` são registrados na tabela do sistema (install-plugin.html "15.7.4.4 INSTALL PLUGIN Statement") e carregados automaticamente para reinicializações subsequentes do servidor. No entanto, como o `mysql.plugin` é uma tabela `InnoDB`, quaisquer plugins mencionados nela podem ser carregados durante a inicialização apenas após a inicialização do `InnoDB`.

Se nenhum componente ou plugin do chaveiro estiver disponível quando um componente tenta acessar o serviço do chaveiro, o serviço não poderá ser usado por esse componente. Como resultado, o componente pode falhar em inicializar ou pode inicializar com funcionalidade limitada. Por exemplo, se `InnoDB` encontrar que há espaços de tabela criptografados ao inicializar, ele tentará acessar o chaveiro. Se o chaveiro não estiver disponível, `InnoDB` pode acessar apenas espaços de tabela não criptografados. Para garantir que `InnoDB` possa acessar espaços de tabela criptografados também, use `--early-plugin-load` para carregar o plugin do chaveiro.

#### 8.4.4.4 Usando o componente_keyring_file Componentente de cartela de chave baseado em arquivo

O componente de chave de `component_keyring_file` armazena dados de chave em um arquivo localizado no host do servidor.

Aviso

Para o gerenciamento de chaves de criptografia, os componentes `component_keyring_file` e `component_keyring_encrypted_file` não são destinados como uma solução de conformidade regulatória. Padrões de segurança, como PCI, FIPS e outros, exigem o uso de sistemas de gerenciamento de chaves para proteger, gerenciar e proteger as chaves de criptografia em cofres de chave ou módulos de segurança de hardware (HSMs).

Para usar `component_keyring_file` para gerenciamento de chave de segurança no cenário mais comum, crie dois arquivos: um arquivo de manifesto que indica ao servidor para carregar `component_keyring_file`, e um arquivo de configuração que especifica onde armazenar as chaves. Ambos os arquivos devem ser legíveis apenas pelo usuário apropriado que executa o servidor, tipicamente `mysql`.

O arquivo de manifesto deve ser nomeado `mysqld.my` e adicionado ao mesmo diretório onde o **mysqld** está instalado. O arquivo tem a seguinte aparência:

```
{
  "components": "file://component_keyring_file"
}
```

O arquivo de configuração deve ser chamado `component_keyring_file.cnf` e adicionado ao diretório do plugin. Ele contém o caminho do arquivo onde o servidor armazena as chaves:

```
{
  "path": "/usr/local/mysql/keyring/component_keyring_file.keys",
  "read_only": false
}
```

Após adicionar os dois arquivos, reinicie o **mysqld**. Verifique a instalação do componente examinando a tabela do Schema de desempenho `keyring_component_status`:

```
mysql> SELECT * FROM performance_schema.keyring_component_status;
```

Um valor de `Component_status` de `Active` indica que o componente foi inicializado com sucesso.

Se a inicialização do servidor falhar ou o valor `Component_status` for `Disabled`, verifique o log de erro do servidor.

Para obter mais detalhes e revisar outros cenários, consulte a Seção 8.4.4.2, “Instalação do componente do Keychain” e Notas de Configuração.

* Notas de configuração
* Uso do componente do carteiro
*

Observações de configuração #####

Quando é inicializado, `component_keyring_file` lê um arquivo de configuração global ou um arquivo de configuração global emparelhado com um arquivo de configuração local:

* O componente tenta ler seu arquivo de configuração global do diretório onde o arquivo da biblioteca do componente está instalado (ou seja, o diretório do plugin do servidor).

* Se o arquivo de configuração global indicar o uso de um arquivo de configuração local, o componente tenta ler seu arquivo de configuração local do diretório de dados.

* Embora os arquivos de configuração global e local estejam localizados em diretórios diferentes, o nome do arquivo é `component_keyring_file.cnf` em ambos os locais.

* É um erro se não existir nenhum arquivo de configuração. `component_keyring_file` não pode ser inicializado sem uma configuração válida.

Os arquivos de configuração locais permitem configurar múltiplas instâncias do servidor para usar `component_keyring_file`, de modo que a configuração do componente para cada instância do servidor seja específica para uma instância de diretório de dados dado. Isso permite que o mesmo componente de chave seja usado com um arquivo de dados distinto para cada instância.

Os arquivos de configuração do `component_keyring_file` têm essas propriedades:

* Um arquivo de configuração deve estar em formato JSON válido.
* Um arquivo de configuração permite esses itens de configuração:

+ `"read_local_config"`: Este item é permitido apenas no arquivo de configuração global. Se o item não estiver presente, o componente usa apenas o arquivo de configuração global. Se o item estiver presente, seu valor é `true` ou `false`, indicando se o componente deve ler informações de configuração do arquivo de configuração local.

Se o item `"read_local_config"` estiver presente no arquivo de configuração global, juntamente com outros itens, o componente verifica o valor do item `"read_local_config"` primeiro:

- Se o valor for `false`, o componente processa os outros itens no arquivo de configuração global e ignora o arquivo de configuração local.

- Se o valor for `true`, o componente ignora os outros itens no arquivo de configuração global e tenta ler o arquivo de configuração local.

+ `"path"`: O valor do item é uma string que nomeia o arquivo a ser usado para armazenar dados do chaveiro. O arquivo deve ser nomeado usando um caminho absoluto, não um caminho relativo. Este item é obrigatório na configuração. Se não especificado, a inicialização de `component_keyring_file` falha.

+ `"read_only"`: O valor do item indica se o arquivo de dados do chaveiro é somente leitura. O valor do item é `true` (somente leitura) ou `false` (leitura/escrita). Este item é obrigatório na configuração. Se não especificado, a inicialização de `component_keyring_file` falha.

* O administrador do banco de dados tem a responsabilidade de criar quaisquer arquivos de configuração a serem utilizados e de garantir que seus conteúdos estejam corretos. Se ocorrer um erro, o início do servidor falha e o administrador deve corrigir quaisquer problemas indicados pelos diagnósticos no log de erro do servidor.

Dada as propriedades do arquivo de configuração anterior, para configurar o `component_keyring_file`, crie um arquivo de configuração global com o nome `component_keyring_file.cnf` no diretório onde o arquivo da biblioteca `component_keyring_file` está instalado e, opcionalmente, crie um arquivo de configuração local, também com o nome `component_keyring_file.cnf`, no diretório de dados. As instruções seguintes assumem que um arquivo de dados de chave de criptografia com o nome `/usr/local/mysql/keyring/component_keyring_file.keys` será usado de forma de leitura/escrita.

Nota

Para sistemas Windows, o caminho para o arquivo `/usr/local/mysql/keyring/component_keyring_file.keys` pode estar em `C:\ProgramData`. Não deve estar em `C:\Program Files`.

* Para usar apenas um arquivo de configuração global, o conteúdo do arquivo é o seguinte:

  ```
  {
    "path": "/usr/local/mysql/keyring/component_keyring_file.keys",
    "read_only": false
  }
  ```

Crie este arquivo no diretório onde o arquivo da biblioteca `component_keyring_file` está instalado.

Este caminho não deve apontar para o diretório de dados do MySQL ou incluí-lo. O caminho deve ser legível e gravável pelo usuário do sistema MySQL (Windows: `NETWORK SERVICES`; Linux: usuário `mysql` e MacOS: usuário `_mysql`). Não deve ser acessível a outros usuários.

* Alternativamente, para usar um par de arquivos de configuração global e local, o arquivo global é o seguinte:

  ```
  {
    "read_local_config": true
  }
  ```

Crie este arquivo no diretório onde o arquivo da biblioteca `component_keyring_file` está instalado.

O arquivo local parece assim:

  ```
  {
    "path": "/usr/local/mysql/keyring/component_keyring_file.keys",
    "read_only": false
  }
  ```

Este caminho não deve apontar para o diretório de dados do MySQL ou incluí-lo. O caminho deve ser legível e gravável pelo usuário do sistema MySQL (Windows: `NETWORK SERVICES`; Linux: usuário `mysql`; MacOS: usuário `_mysql`). Não deve ser acessível a outros usuários.

##### Uso do componente do cartela de identificação

As operações de chaveiro são transacionais: `component_keyring_file` usa um arquivo de backup durante as operações de escrita para garantir que possa retornar ao arquivo original se uma operação falhar. O arquivo de backup tem o mesmo nome que o arquivo de dados, com um sufixo de `.backup`.

`component_keyring_file` suporta as funções que compõem a interface padrão do serviço de Keyring do MySQL. As operações de Keyring realizadas por essas funções são acessíveis em declarações SQL, conforme descrito na Seção 8.4.4.15, “Funções de Gerenciamento de Chaves de Keyring de Propósito Geral”.

Exemplo:

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para informações sobre as características dos valores-chave permitidos por `component_keyring_file`, consulte a Seção 8.4.4.13, “Tipos e comprimentos de chave do keyring suportado”.

#### 8.4.4.5 Usando o componente_keyring_encrypted_file Componente de cartela de chaves criptografado com arquivo criptografado

Nota

`component_keyring_encrypted_file` é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

O componente de chave de acesso `component_keyring_encrypted_file` armazena dados de chave de acesso em um arquivo criptografado e protegido por senha, localizado no servidor.

Aviso

Para o gerenciamento de chaves de criptografia, os componentes `component_keyring_file` e `component_keyring_encrypted_file` não são destinados como uma solução de conformidade regulatória. Padrões de segurança, como PCI, FIPS e outros, exigem o uso de sistemas de gerenciamento de chaves para proteger, gerenciar e proteger as chaves de criptografia em cofres de chave ou módulos de segurança de hardware (HSMs).

Para usar `component_keyring_encrypted_file` para gerenciamento de chave de segurança no cenário mais comum, crie dois arquivos: um arquivo de manifesto que indica ao servidor para carregar `component_keyring_encrypted_file`, e um arquivo de configuração que especifica onde armazenar as chaves. Ambos os arquivos devem ser legíveis apenas pelo usuário apropriado que executa o servidor, tipicamente `mysql`.

O arquivo de manifesto deve ser nomeado `mysqld.my` e adicionado ao mesmo diretório onde o **mysqld** está instalado. O arquivo tem a seguinte aparência:

```
{
  "components": "file://component_keyring_encrypted_file"
}
```

O arquivo de configuração deve ser denominado `component_keyring_encrypted_file.cnf` e adicionado ao diretório do plugin. Ele contém o caminho do arquivo onde o servidor armazena as chaves:

```
{
  "path": "/usr/local/mysql/keyring/component_keyring_encrypted_file.keys",
  "password": "password",
  "read_only": false
}
```

Após adicionar os dois arquivos, reinicie o **mysqld**. Verifique a instalação do componente examinando a tabela do Schema de desempenho `keyring_component_status`:

```
mysql> SELECT * FROM performance_schema.keyring_component_status;
```

Um valor `Component_status` de `Active` indica que o componente foi inicializado com sucesso.

Se a inicialização do servidor falhar ou o valor `Component_status` for `Disabled`, verifique o log de erro do servidor.

Para obter mais detalhes e revisar outros cenários, consulte a Seção 8.4.4.2, “Instalação do componente do Keychain” e Notas de Configuração.

* Notas de configuração
* Uso do componente de cartela criptografada

Observações de configuração #####

Quando é inicializado, `component_keyring_encrypted_file` lê um arquivo de configuração global ou um arquivo de configuração global emparelhado com um arquivo de configuração local:

* O componente tenta ler seu arquivo de configuração global do diretório onde o arquivo da biblioteca do componente está instalado (ou seja, o diretório do plugin do servidor).

* Se o arquivo de configuração global indicar o uso de um arquivo de configuração local, o componente tenta ler seu arquivo de configuração local do diretório de dados.

* Embora os arquivos de configuração global e local estejam localizados em diretórios diferentes, o nome do arquivo é `component_keyring_encrypted_file.cnf` em ambos os locais.

* Se o `component_keyring_encrypted_file` não conseguir encontrar o arquivo de configuração, ocorrerá um erro e o componente não poderá ser inicializado.

Os arquivos de configuração locais permitem configurar múltiplas instâncias do servidor para usar `component_keyring_encrypted_file`, de modo que a configuração do componente para cada instância do servidor seja específica para uma instância de diretório de dados dado. Isso permite que o mesmo componente de chave seja usado com um arquivo de dados distinto para cada instância.

Os arquivos de configuração do `component_keyring_encrypted_file` têm essas propriedades:

* Um arquivo de configuração deve estar em formato JSON válido.
* Um arquivo de configuração permite esses itens de configuração:

+ `"read_local_config"`: Este item é permitido apenas no arquivo de configuração global. Se o item não estiver presente, o componente usa apenas o arquivo de configuração global. Se o item estiver presente, seu valor é `true` ou `false`, indicando se o componente deve ler informações de configuração do arquivo de configuração local.

Se o item `"read_local_config"` estiver presente no arquivo de configuração global, juntamente com outros itens, o componente verifica o valor do item `"read_local_config"` primeiro:

- Se o valor for `false`, o componente processa os outros itens no arquivo de configuração global e ignora o arquivo de configuração local.

- Se o valor for `true`, o componente ignora os outros itens no arquivo de configuração global e tenta ler o arquivo de configuração local.

+ `"path"`: O valor do item é uma string que nomeia o arquivo a ser usado para armazenar dados do chaveiro. O arquivo deve ser nomeado usando um caminho absoluto, não um caminho relativo. Este item é obrigatório na configuração. Se não especificado, a inicialização de `component_keyring_encrypted_file` falha.

+ `"password"`: O valor do item é uma string que especifica a senha para acessar o arquivo de dados. Este item é obrigatório na configuração. Se não especificado, a inicialização de `component_keyring_encrypted_file` falha.

+ `"read_only"`: O valor do item indica se o arquivo de dados do chaveiro é somente leitura. O valor do item é `true` (somente leitura) ou `false` (leitura/escrita). Este item é obrigatório na configuração. Se não especificado, a inicialização de `component_keyring_encrypted_file` falha.

* O administrador do banco de dados tem a responsabilidade de criar quaisquer arquivos de configuração a serem utilizados e de garantir que seus conteúdos estejam corretos. Se ocorrer um erro, o início do servidor falha e o administrador deve corrigir quaisquer problemas indicados pelos diagnósticos no log de erro do servidor.

* Qualquer arquivo de configuração que armazene uma senha deve ter um modo restritivo e ser acessível apenas à conta usada para executar o servidor MySQL.

Dada as propriedades do arquivo de configuração anterior, para configurar o `component_keyring_encrypted_file`, crie um arquivo de configuração global com o nome `component_keyring_encrypted_file.cnf` no diretório onde o arquivo da biblioteca `component_keyring_encrypted_file` está instalado e, opcionalmente, crie um arquivo de configuração local, também com o nome `component_keyring_encrypted_file.cnf`, no diretório de dados. As instruções seguintes assumem que um arquivo de dados de chave de criptografia com o nome `/usr/local/mysql/keyring/component_keyring_encrypted_file.keys` será usado de forma de leitura/escrita. Você também deve escolher uma senha.

Nota

Para sistemas Windows, o caminho para o arquivo `/usr/local/mysql/keyring/component_keyring_encrypted_file.keys` pode estar em `C:\ProgramData`. Não deve estar em `C:\Program Files`.

* Para usar apenas um arquivo de configuração global, o conteúdo do arquivo é o seguinte:

  ```
  {
    "path": "/usr/local/mysql/keyring/component_keyring_encrypted_file.keys",
    "password": "password",
    "read_only": false
  }
  ```

Crie este arquivo no diretório onde o arquivo da biblioteca `component_keyring_encrypted_file` está instalado.

Este caminho não deve apontar para o diretório de dados do MySQL ou incluí-lo. O caminho deve ser legível e gravável pelo usuário do sistema MySQL (Windows: `NETWORK SERVICES`; Linux: usuário `mysql` e MacOS: usuário `_mysql`). Não deve ser acessível a outros usuários.

* Alternativamente, para usar um par de arquivos de configuração global e local, o arquivo global é o seguinte:

  ```
  {
    "read_local_config": true
  }
  ```

Crie este arquivo no diretório onde o arquivo da biblioteca `component_keyring_encrypted_file` está instalado.

O arquivo local parece assim:

  ```
  {
    "path": "/usr/local/mysql/keyring/component_keyring_encrypted_file.keys",
    "password": "password",
    "read_only": false
  }
  ```

Este caminho não deve apontar para o diretório de dados do MySQL ou incluí-lo. O caminho deve ser legível e gravável pelo usuário do sistema MySQL (Windows: `NETWORK SERVICES`; Linux: usuário `mysql`; MacOS: usuário `_mysql`). Não deve ser acessível a outros usuários.

##### Uso do componente de cartela criptografada

As operações de chaveiro são transacionais: `component_keyring_encrypted_file` usa um arquivo de backup durante as operações de escrita para garantir que possa retornar ao arquivo original se uma operação falhar. O arquivo de backup tem o mesmo nome que o arquivo de dados com um sufixo de `.backup`.

`component_keyring_encrypted_file` suporta as funções que compõem a interface padrão do serviço de Keyring do MySQL. As operações de Keyring realizadas por essas funções são acessíveis em declarações SQL, conforme descrito na Seção 8.4.4.15, “Funções de Gerenciamento de Chaves de Keyring de Propósito Geral”.

Exemplo:

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para informações sobre as características dos valores-chave permitidos por `component_keyring_encrypted_file`, consulte a Seção 8.4.4.13, “Tipos e comprimentos de chave do keyring suportado”.

#### 8.4.4.6 Usando o plugin de cartela de segurança com base em arquivo keyring_file

O plugin de chave de acesso `keyring_file` armazena os dados da chave de acesso em um arquivo localizado no host do servidor.

A partir do MySQL 8.0.34, este plugin é desatualizado e está sujeito à remoção em uma futura versão do MySQL. Em vez disso, considere usar o componente `component_keyring_file` para armazenar dados do chaveiro (consulte Seção 8.4.4.4, “Usando o componente_chaveiro_file File-Based Keyring Component”).

Aviso

Para o gerenciamento de chaves de criptografia, o plugin `keyring_file` não é destinado como uma solução de conformidade regulatória. Padrões de segurança, como PCI, FIPS e outros, exigem o uso de sistemas de gerenciamento de chaves para proteger, gerenciar e proteger as chaves de criptografia em cofres de chave ou módulos de segurança de hardware (HSMs).

Para instalar o `keyring_file`, use as instruções gerais encontradas na Seção 8.4.4.3, “Instalação do Plugin de Carteira de Chaves”, juntamente com as informações de configuração específicas para o `keyring_file` encontradas aqui.

Para ser utilizável durante o processo de inicialização do servidor, `keyring_file` deve ser carregado usando a opção `--early-plugin-load`. A variável de sistema `keyring_file_data` configura opcionalmente a localização do arquivo usado pelo plugin `keyring_file` para armazenamento de dados. O valor padrão é específico da plataforma. Para configurar a localização do arquivo explicitamente, defina o valor da variável na inicialização. Por exemplo, use essas linhas no arquivo do servidor `my.cnf`, ajustando o sufixo `.so` e a localização do arquivo para sua plataforma conforme necessário:

```
[mysqld]
early-plugin-load=keyring_file.so
keyring_file_data=/usr/local/mysql/mysql-keyring/keyring
```

Se `keyring_file_data` estiver configurado em um novo local, o plugin de chave de segurança cria um novo arquivo vazio que não contém nenhuma chave; isso significa que as tabelas criptografadas existentes não podem mais ser acessadas.

As operações de chaveiro são transacionais: o plugin `keyring_file` usa um arquivo de backup durante as operações de escrita para garantir que possa retornar ao arquivo original se uma operação falhar. O arquivo de backup tem o mesmo nome que o valor da variável do sistema `keyring_file_data`, com um sufixo de `.backup`.

Para informações adicionais sobre `keyring_file_data`, consulte a Seção 8.4.4.19, “Variáveis do Sistema de Chave”.

Para garantir que as chaves sejam descartadas apenas quando o arquivo correto de armazenamento de chave está presente, `keyring_file` armazena um checksum SHA-256 da chave em arquivo. Antes de atualizar o arquivo, o plugin verifica se ele contém o checksum esperado.

O plugin `keyring_file` suporta as funções que compõem a interface padrão do serviço de Keyring do MySQL. As operações de Keyring realizadas por essas funções são acessíveis em dois níveis:

* Interface SQL: Nas declarações SQL, chame as funções descritas na Seção 8.4.4.15, “Funções de gerenciamento de chave de cartela de propósito geral”.

* Interface C: No código em linguagem C, chame as funções do serviço de chave de registro descritas na Seção 7.6.9.2, “O serviço de chave de registro”.

Exemplo (usando a interface SQL):

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para informações sobre as características dos valores-chave permitidos por `keyring_file`, consulte a Seção 8.4.4.13, “Tipos e comprimentos de chave do keyring suportado”.

#### 8.4.4.7 Usando o plugin de cartela de chave criptografada keyring_encrypted_file

Nota

O plugin `keyring_encrypted_file` é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

O plugin de chave de acesso `keyring_encrypted_file` armazena os dados da chave de acesso em um arquivo criptografado e protegido por senha, localizado no servidor.

A partir do MySQL 8.0.34, este plugin é desatualizado e está sujeito à remoção em uma futura versão do MySQL. Em vez disso, considere usar o componente `component_encrypted_keyring_file` para armazenar dados do chaveiro (consulte [Seção 8.4.4.5, “Usando o componente_chaveiro_encriptado Arquivo Encriptado de Chaveiro”][(keyring-encrypted-file-component.html "8.4.4.5 Using the component_keyring_encrypted_file Encrypted File-Based Keyring Component")]).

Aviso

Para o gerenciamento de chaves de criptografia, o plugin `keyring_encrypted_file` não é destinado como uma solução de conformidade regulatória. Padrões de segurança, como PCI, FIPS e outros, exigem o uso de sistemas de gerenciamento de chaves para proteger, gerenciar e proteger as chaves de criptografia em cofres de chave ou módulos de segurança de hardware (HSMs).

Para instalar o `keyring_encrypted_file`, use as instruções gerais encontradas na Seção 8.4.4.3, “Instalação do Plugin de Carteira de Chaves”, juntamente com as informações de configuração específicas para o `keyring_encrypted_file` encontradas aqui.

Para ser utilizável durante o processo de inicialização do servidor, `keyring_encrypted_file` deve ser carregado usando a opção `--early-plugin-load`. Para especificar a senha para criptografar o arquivo de dados do chaveiro, defina a variável de sistema `keyring_encrypted_file_password`. (A senha é obrigatória; se não for especificada na inicialização do servidor, a inicialização do `keyring_encrypted_file` falha.) A variável de sistema `keyring_encrypted_file_data` configura opcionalmente a localização do arquivo usado pelo plugin `keyring_encrypted_file` para armazenamento de dados. O valor padrão é específico da plataforma. Para configurar a localização do arquivo explicitamente, defina o valor da variável na inicialização. Por exemplo, use essas linhas no arquivo do servidor `my.cnf`, ajustando o sufixo `.so` e a localização do arquivo para sua plataforma conforme necessário e substituindo sua senha escolhida:

```
[mysqld]
early-plugin-load=keyring_encrypted_file.so
keyring_encrypted_file_data=/usr/local/mysql/mysql-keyring/keyring-encrypted
keyring_encrypted_file_password=password
```

Como o arquivo `my.cnf` armazena uma senha quando escrito como mostrado, ele deve ter um modo restrito e ser acessível apenas à conta usada para executar o servidor MySQL.

As operações de chaveiro são transacionais: o plugin `keyring_encrypted_file` usa um arquivo de backup durante as operações de escrita para garantir que possa retornar ao arquivo original se uma operação falhar. O arquivo de backup tem o mesmo nome que o valor da variável do sistema `keyring_encrypted_file_data` com um sufixo de `.backup`.

Para obter informações adicionais sobre as variáveis do sistema usadas para configurar o plugin `keyring_encrypted_file`, consulte a Seção 8.4.4.19, “Variáveis do sistema do Keychain”.

Para garantir que as chaves sejam descartadas apenas quando o arquivo correto de armazenamento do chaveiro existe, `keyring_encrypted_file` armazena um checksum SHA-256 do chaveiro no arquivo. Antes de atualizar o arquivo, o plugin verifica se ele contém o checksum esperado. Além disso, `keyring_encrypted_file` criptografa o conteúdo do arquivo usando AES antes de escrever o arquivo e descriptografa o conteúdo do arquivo após ler o arquivo.

O plugin `keyring_encrypted_file` suporta as funções que compõem a interface padrão do serviço de Keyring do MySQL. As operações de Keyring realizadas por essas funções são acessíveis em dois níveis:

* Interface SQL: Nas declarações SQL, chame as funções descritas na Seção 8.4.4.15, “Funções de gerenciamento de chave de cartela de propósito geral”.

* Interface C: No código em linguagem C, chame as funções do serviço de chave de registro descritas na Seção 7.6.9.2, “O serviço de chave de registro”.

Exemplo (usando a interface SQL):

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para informações sobre as características dos valores-chave permitidos por `keyring_encrypted_file`, consulte a Seção 8.4.4.13, “Tipos e comprimentos de chave do keyring suportado”.

#### 8.4.4.8 Usando o plugin keyring_okv KMIP

Nota

O plugin `keyring_okv` é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

O Protocolo de Interoperabilidade de Gestão de Chave (KMIP) permite a comunicação de chaves criptográficas entre um servidor de gestão de chave e seus clientes. O plugin `keyring_okv` keyring utiliza o protocolo KMIP 1.1 para se comunicar de forma segura como um cliente de um back-end KMIP. O material do keyring é gerado exclusivamente pelo back-end, não pelo `keyring_okv`. O plugin funciona com esses produtos compatíveis com KMIP:

* Oracle Key Vault
* Gemalto SafeNet KeySecure Appliance
* Townsend Alliance Key Manager
* Entrust KeyControl

Cada instância do servidor MySQL deve ser registrada separadamente como um cliente para o KMIP. Se duas ou mais instâncias do servidor MySQL utilizarem o mesmo conjunto de credenciais, elas podem interferir no funcionamento umas das outras.

O plugin `keyring_okv` suporta as funções que compõem a interface padrão do serviço de Keyring do MySQL. As operações de Keyring realizadas por essas funções são acessíveis em dois níveis:

* Interface SQL: Nas declarações SQL, chame as funções descritas na Seção 8.4.4.15, “Funções de gerenciamento de chave de cartela de propósito geral”.

* Interface C: No código em linguagem C, chame as funções do serviço de chave de registro descritas na Seção 7.6.9.2, “O serviço de chave de registro”.

Exemplo (usando a interface SQL):

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para informações sobre as características dos valores-chave permitidos por `keyring_okv`, veja a Seção 8.4.4.13, “Tipos e comprimentos de chave de carteiro-chave suportados”.

Para instalar o `keyring_okv`, use as instruções gerais encontradas na Seção 8.4.4.3, “Instalação do Plugin de Keychain”, juntamente com as informações de configuração específicas para o `keyring_okv` encontradas aqui.

* Configuração geral keyring_okv
* Configurando keyring_okv para o Oracle Key Vault
* Configurando keyring_okv para o Gemalto SafeNet KeySecure Appliance
* Configurando keyring_okv para o Townsend Alliance Key Manager
* Configurando keyring_okv para o Entrust KeyControl
* Protegendo a senha do arquivo de chave keyring_okv

##### Chaveiro geral_okv Configuração

Independentemente do backend do KMIP que o plugin `keyring_okv` usa para armazenamento de chave, a variável de sistema `keyring_okv_conf_dir` configura a localização do diretório usado pelo `keyring_okv` para seus arquivos de suporte. O valor padrão é vazio, então você deve definir a variável para nomear um diretório corretamente configurado antes que o plugin possa se comunicar com o backend do KMIP. A menos que você faça isso, `keyring_okv` escreve uma mensagem no log de erro durante o início do servidor que não pode se comunicar:

```
[Warning] Plugin keyring_okv reported: 'For keyring_okv to be
initialized, please point the keyring_okv_conf_dir variable to a directory
containing Oracle Key Vault configuration file and ssl materials'
```

A variável `keyring_okv_conf_dir` deve nomear um diretório que contenha os seguintes itens:

* `okvclient.ora`: Um arquivo que contém detalhes do backend KMIP com o qual `keyring_okv` se comunica.

* `ssl`: Um diretório que contém os arquivos de certificado e chave necessários para estabelecer uma conexão segura com o back-end KMIP: `CA.pem`, `cert.pem` e `key.pem`. Se o arquivo de chave estiver protegido por senha, o diretório `ssl` pode conter um arquivo de texto de uma única linha com o nome `password.txt` contendo a senha necessária para descriptografar o arquivo de chave.

Tanto o arquivo `okvclient.ora` quanto o diretório `ssl`, com os arquivos de certificado e chave, são necessários para que o `keyring_okv` funcione corretamente. O procedimento usado para preencher o diretório de configuração com esses arquivos depende do backend KMIP usado com `keyring_okv`, conforme descrito em outro lugar.

O diretório de configuração usado pelo `keyring_okv` como local para seus arquivos de suporte deve ter um modo restritivo e ser acessível apenas à conta usada para executar o servidor MySQL. Por exemplo, em sistemas Unix e semelhantes, para usar o diretório `/usr/local/mysql/mysql-keyring-okv`, os seguintes comandos (executados como `root`) criam o diretório e definem seu modo e propriedade:

```
cd /usr/local/mysql
mkdir mysql-keyring-okv
chmod 750 mysql-keyring-okv
chown mysql mysql-keyring-okv
chgrp mysql mysql-keyring-okv
```

Para ser utilizável durante o processo de inicialização do servidor, `keyring_okv` deve ser carregado usando a opção `--early-plugin-load`. Além disso, defina a variável de sistema `keyring_okv_conf_dir` para informar ao `keyring_okv` onde encontrar seu diretório de configuração. Por exemplo, use essas linhas no arquivo do servidor `my.cnf`, ajustando o sufixo `.so` e a localização do diretório para sua plataforma, conforme necessário:

```
[mysqld]
early-plugin-load=keyring_okv.so
keyring_okv_conf_dir=/usr/local/mysql/mysql-keyring-okv
```

Para informações adicionais sobre `keyring_okv_conf_dir`, consulte a Seção 8.4.4.19, “Variáveis do Sistema de Chave”.

##### Configurando keyring_okv para o Oracle Key Vault

A discussão aqui assume que você está familiarizado com o Oracle Key Vault. Algumas fontes de informações pertinentes:

* [Site do Oracle Key Vault][(http://www.oracle.com/technetwork/database/options/key-management/overview/index.html)]

* [Documentação do Oracle Key Vault][(http://www.oracle.com/technetwork/database/options/key-management/documentation/index.html)]

Na terminologia do Oracle Key Vault, os clientes que usam o Oracle Key Vault para armazenar e recuperar objetos de segurança são chamados de pontos finais. Para se comunicar com o Oracle Key Vault, é necessário se registrar como um ponto final e se inscrever baixando e instalando os arquivos de suporte do ponto final. Observe que você deve registrar um ponto final separado para cada instância do servidor MySQL. Se duas ou mais instâncias do servidor MySQL usarem o mesmo ponto final, elas podem interferir no funcionamento umas das outras.

O procedimento a seguir resume brevemente o processo de configuração do `keyring_okv` para uso com o Oracle Key Vault:

1. Crie o diretório de configuração para o plugin `keyring_okv` a ser usado.

2. Registre um ponto final com o Oracle Key Vault para obter um token de inscrição.

3. Use o token de inscrição para obter o download do software cliente `okvclient.jar`.

4. Instale o software do cliente para preencher o diretório de configuração `keyring_okv` que contém os arquivos de suporte do Oracle Key Vault.

Utilize o procedimento a seguir para configurar o `keyring_okv` e o Oracle Key Vault para trabalhar juntos. Esta descrição resume apenas como interagir com o Oracle Key Vault. Para obter detalhes, visite o site [Oracle Key Vault][(http://www.oracle.com/technetwork/database/options/key-management/overview/index.html)] e consulte o *Guia do Administrador do Oracle Key Vault*.

1. Crie o diretório de configuração que contém os arquivos de suporte do Oracle Key Vault e certifique-se de que a variável de sistema `keyring_okv_conf_dir` esteja definida com o nome desse diretório (para detalhes, consulte Configuração geral keyring_okv).

2. Faça login no console de gerenciamento do Oracle Key Vault como um usuário que tenha o papel de Administrador do sistema.

3. Selecione a guia Pontos finais para chegar à página Pontos finais. Na página Pontos finais, clique em Adicionar.

4. Forneça as informações do ponto final necessárias e clique em Registrar. O tipo de ponto final deve ser Outro. O registro bem-sucedido resulta em um token de inscrição.

5. Faça logout do servidor do Oracle Key Vault. 6. Conecte-se novamente ao servidor do Oracle Key Vault, desta vez sem fazer login. Use o token de inscrição do ponto de extremidade para se inscrever e solicitar o download do software `okvclient.jar`. Salve este arquivo no seu sistema.

7. Instale o arquivo `okvclient.jar` usando o seguinte comando (você deve ter o JDK 1.4 ou superior):

   ```
   java -jar okvclient.jar -d dir_name [-v]
   ```

O nome do diretório que segue a opção `-d` é o local onde os arquivos extraídos serão instalados. A opção `-v`, se fornecida, faz com que informações de log sejam produzidas, que podem ser úteis se o comando falhar.

Quando o comando pedir uma senha do ponto de extremidade do Oracle Key Vault, não forneça uma. Em vez disso, pressione **Enter**. (O resultado é que não é necessária senha quando o ponto de extremidade se conecta ao Oracle Key Vault.)

O comando anterior produz um arquivo `okvclient.ora`, que deve estar neste local sob o diretório denominado pela opção `-d` no comando anterior **java -jar**:

   ```
   install_dir/conf/okvclient.ora
   ```

Os conteúdos esperados do arquivo incluem linhas que parecem assim:

   ```
   SERVER=host_ip:port_num
   STANDBY_SERVER=host_ip:port_num
   ```

A variável `SERVER` é obrigatória, e a variável `STANDBY_SERVER` é opcional. O plugin `keyring_okv` tenta se comunicar com o servidor que está em execução no host nomeado pela variável `SERVER` e, se isso falhar, volta para `STANDBY_SERVER`.

Nota

Se o arquivo existente não estiver nesse formato, então crie um novo arquivo com as linhas mostradas no exemplo anterior. Além disso, considere fazer um backup do arquivo `okvclient.ora` antes de executar o comando **okvutil**. Restaure o arquivo conforme necessário.

A partir do MySQL 8.0.29, você pode especificar mais de um servidor de espera (até um máximo de 64). Se você fizer isso, o plugin `keyring_okv` itera sobre eles até que consiga estabelecer uma conexão e falha se não conseguir. Para adicionar servidores de espera adicionais, edite o arquivo `okvclient.ora` para especificar os endereços IP e os números de porta dos servidores como uma lista de endereços separados por vírgula no valor da variável `STANDBY_SERVER`. Por exemplo:

   ```
   STANDBY_SERVER=host_ip:port_num,host_ip:port_num,host_ip:port_num,host_ip:port_num
   ```

Certifique-se de que a lista de servidores de espera seja mantida curta, precisa e atualizada, e que os servidores que não são mais válidos sejam removidos. Há uma espera de 20 segundos para cada tentativa de conexão, portanto, a presença de uma longa lista de servidores inválidos pode afetar significativamente o tempo de conexão do plugin `keyring_okv` e, portanto, o tempo de inicialização do servidor.

8. Vá para o diretório do instalador do Oracle Key Vault e teste a configuração executando este comando:

   ```
   okvutil/bin/okvutil list
   ```

A saída deve parecer algo assim:

   ```
   Unique ID                               Type            Identifier
   255AB8DE-C97F-482C-E053-0100007F28B9	Symmetric Key	-
   264BF6E0-A20E-7C42-E053-0100007FB29C	Symmetric Key	-
   ```

Para um servidor do Oracle Key Vault fresco (um servidor sem nenhuma chave nele), a saída parece assim, para indicar que não há chaves no cofre:

   ```
   no objects found
   ```

9. Use este comando para extrair o diretório `ssl` contendo materiais SSL do arquivo `okvclient.jar`:

   ```
   jar xf okvclient.jar ssl
   ```

10. Copie os arquivos de suporte do Oracle Key Vault (o arquivo `okvclient.ora` e o diretório `ssl`) para o diretório de configuração.

11. (Opcional) Se você deseja proteger o arquivo de chave com senha, use as instruções na Protegendo a senha do arquivo de chave keyring_okv.

Após completar o procedimento anterior, reinicie o servidor MySQL. Ele carrega o plugin `keyring_okv` e o `keyring_okv` usa os arquivos em seu diretório de configuração para se comunicar com o Oracle Key Vault.

##### Configurando keyring_okv para o dispositivo Gemalto SafeNet KeySecure

O Gemalto SafeNet KeySecure Appliance utiliza o protocolo KMIP (versão 1.1 ou 1.2). O plugin `keyring_okv` (que suporta KMIP 1.1) pode usar o KeySecure como seu backend KMIP para armazenamento de chaveiro.

Utilize o procedimento a seguir para configurar o `keyring_okv` e o KeySecure para trabalhar juntos. A descrição resume apenas como interagir com o KeySecure. Para detalhes, consulte a seção intitulada "Adicionar um servidor KMIP" no [Guia do Usuário do KeySecure][(https://www2.gemalto.com/aws-marketplace/usage/vks/uploadedFiles/Support_and_Downloads/AWS/007-012362-001-keysecure-appliance-user-guide-v7.1.0.pdf)].

1. Crie o diretório de configuração que contém os arquivos de suporte do KeySecure e certifique-se de que a variável de sistema `keyring_okv_conf_dir` esteja definida com o nome desse diretório (para detalhes, consulte Configuração geral keyring_okv).

2. No diretório de configuração, crie um subdiretório chamado `ssl` para armazenar os arquivos de certificado SSL e chave necessários.

3. No diretório de configuração, crie um arquivo chamado `okvclient.ora`. Ele deve ter o seguinte formato:

   ```
   SERVER=host_ip:port_num
   STANDBY_SERVER=host_ip:port_num
   ```

Por exemplo, se o KeySecure estiver rodando no host 198.51.100.20 e ouvindo na porta 9002, e também rodando no host alternativo 203.0.113.125 e ouvindo na porta 8041, o arquivo `okvclient.ora` parece assim:

   ```
   SERVER=198.51.100.20:9002
   STANDBY_SERVER=203.0.113.125:8041
   ```

A partir do MySQL 8.0.29, você pode especificar mais de um servidor de espera (até um máximo de 64). Se você fizer isso, o plugin `keyring_okv` itera sobre eles até que consiga estabelecer uma conexão e falha se não conseguir. Para adicionar servidores de espera adicionais, edite o arquivo `okvclient.ora` para especificar os endereços IP e os números de porta dos servidores como uma lista de endereços separados por vírgula no valor da variável `STANDBY_SERVER`. Por exemplo:

   ```
   STANDBY_SERVER=host_ip:port_num,host_ip:port_num,host_ip:port_num,host_ip:port_num
   ```

Certifique-se de que a lista de servidores de espera seja mantida curta, precisa e atualizada, e que os servidores que não são mais válidos sejam removidos. Há uma espera de 20 segundos para cada tentativa de conexão, portanto, a presença de uma longa lista de servidores inválidos pode afetar significativamente o tempo de conexão do plugin `keyring_okv` e, portanto, o tempo de inicialização do servidor.

4. Conecte-se ao Console de Gerenciamento KeySecure como administrador com credenciais para acesso às Autoridades de Certificação.

5. Navegue até Segurança >> CA local e crie uma autoridade de certificação local (CA).

6. Vá para Listas de CA Confiáveis. Selecione Padrão e clique em Propriedades. Em seguida, selecione Editar para Lista de Autoridade de Certificado Confiável e adicione a CA recém-criada.

7. Faça o download do CA e salve-o no diretório `ssl` como um arquivo denominado `CA.pem`.

8. Navegue até Segurança >> Solicitações de certificado e crie um certificado. Em seguida, você pode baixar um arquivo **tar** comprimido que contém arquivos PEM de certificado.

9. Extraia os arquivos PEM do arquivo baixado. Por exemplo, se o nome do arquivo for `csr_w_pk_pkcs8.gz`, descomprima e desempaquete-o usando este comando:

   ```
   tar zxvf csr_w_pk_pkcs8.gz
   ```

Duas pastas resultam da operação de extração: `certificate_request.pem` e `private_key_pkcs8.pem`.

10. Use este comando do **openssl** para descriptografar a chave privada e criar um arquivo chamado `key.pem`:

    ```
    openssl pkcs8 -in private_key_pkcs8.pem -out key.pem
    ```

11. Copie o arquivo `key.pem` para o diretório `ssl`.

12. Copie o pedido de certificado em `certificate_request.pem` no clipboard.

13. Navegue até Segurança >> ACs Locais. Selecione a mesma CA que você criou anteriormente (a que você baixou para criar o arquivo `CA.pem`), e clique em Solicitar Assinatura. Cole o Pedido de Certificado do clipboard, escolha um propósito de certificado de Cliente (o chaveiro é um cliente da KeySecure), e clique em Solicitar Assinatura. O resultado é um certificado assinado com a CA selecionada em uma nova página.

14. Copie o certificado assinado para a área de transferência, em seguida, salve o conteúdo da área de transferência como um arquivo com o nome `cert.pem` no diretório `ssl`.

15. (Opcional) Se você deseja proteger o arquivo de chave com senha, use as instruções na Protegendo a senha do arquivo de chave keyring_okv.

Após completar o procedimento anterior, reinicie o servidor MySQL. Ele carrega o plugin `keyring_okv` e `keyring_okv` usa os arquivos em seu diretório de configuração para se comunicar com o KeySecure.

##### Configurando keyring_okv para o Gestor de Chave Townsend Alliance

O Townsend Alliance Key Manager utiliza o protocolo KMIP. O plugin `keyring_okv` para chave de chave pode utilizar o Alliance Key Manager como seu backend KMIP para armazenamento de chave. Para informações adicionais, consulte [Alliance Key Manager para MySQL][(https://www.townsendsecurity.com/product/encryption-key-management-mysql)].

##### Configurando keyring_okv para Entrust KeyControl

Entregue o KeyControl usa o protocolo KMIP. O plugin `keyring_okv` de chave pode usar o KeyControl da Entrust como seu backend KMIP para armazenamento de chave. Para informações adicionais, consulte o [Guia de Integração Oracle MySQL e Entrust KeyControl com nShield HSM][(https://www.entrust.com/-/media/documentation/integration-guides/oracle-mysql-enterprise-keycontrol-nshield-ig.pdf)].

##### Protegendo a senha do arquivo de chave_okv

Você pode, opcionalmente, proteger o arquivo de chave com uma senha e fornecer um arquivo contendo a senha para permitir que o arquivo de chave seja descriptografado. Para fazer isso, mude a localização para o diretório `ssl` e realize os seguintes passos:

1. Criptografar o arquivo de chave `key.pem`. Por exemplo, use um comando como este e insira a senha de criptografia nas solicitações:

   ```
   $> openssl rsa -des3 -in key.pem -out key.pem.new
   Enter PEM pass phrase:
   Verifying - Enter PEM pass phrase:
   ```

2. Salve a senha de criptografia em um arquivo de texto de uma única linha com o nome `password.txt` no diretório `ssl`.

3. Verifique se o arquivo de chave criptografado pode ser descriptografado usando o seguinte comando. O arquivo descriptografado deve ser exibido no console:

   ```
   $> openssl rsa -in key.pem.new -passin file:password.txt
   ```

4. Remova o arquivo original `key.pem` e renomeie `key.pem.new` para `key.pem`.

5. Altere a propriedade e o modo de acesso do novo arquivo `key.pem` e do arquivo `password.txt` conforme necessário, para garantir que eles tenham as mesmas restrições que os outros arquivos no diretório `ssl`.

#### 8.4.4.9 Usando o plugin keyring_aws do Amazon Web Services Keyring

Nota

O plugin `keyring_aws` é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

O plugin de chave de `keyring_aws` comunica-se com o Serviço de Gerenciamento de Chaves da Amazon Web Services (AWS KMS) como um backend para geração de chaves e utiliza um arquivo local para armazenamento de chaves. Todo o material da chave é gerado exclusivamente pelo servidor da AWS, não pelo `keyring_aws`.

A MySQL Enterprise Edition pode funcionar com `keyring_aws` no Red Hat Enterprise Linux, SUSE Linux Enterprise Server, Debian, Ubuntu, macOS e Windows. A MySQL Enterprise Edition não suporta o uso de `keyring_aws` nessas plataformas:

* EL6
* Linux genérico (glibc2.12)
* SLES 12 (com versões após o MySQL Server 5.7)
* Solaris

A discussão aqui assume que você está familiarizado com o AWS em geral e o KMS em particular. Algumas fontes de informações pertinentes:

* [site da AWS](https://aws.amazon.com/kms/)
* [documentação do KMS](https://docs.aws.amazon.com/kms/)

As seções a seguir fornecem informações de configuração e uso para o plugin de chave de segurança `keyring_aws`:

* chave_aws Configuração
* chave_aws Operação
* chave_aws Alterações de Credenciais

##### chave_aws Configuração

Para instalar o `keyring_aws`, use as instruções gerais encontradas na Seção 8.4.4.3, “Instalação do Plugin de Keyring”, juntamente com as informações de configuração específicas do plugin encontradas aqui.

O arquivo da biblioteca de plugins contém o plugin `keyring_aws` e duas funções carregáveis, `keyring_aws_rotate_cmk()` e `keyring_aws_rotate_keys()`.

Para configurar o `keyring_aws`, você deve obter uma chave de acesso secreta que forneça credenciais para comunicação com o AWS KMS e escrevê-la em um arquivo de configuração:

1. Crie uma conta do AWS KMS. 2. Use o AWS KMS para criar uma chave de acesso secreta e uma chave de acesso secreta. A chave de acesso serve para verificar a identidade sua e das suas aplicações.

3. Use a conta do AWS KMS para criar um ID de chave do KMS. Ao iniciar o MySQL, defina a variável de sistema `keyring_aws_cmk_id` para o valor do ID CMK. Esta variável é obrigatória e não tem um valor padrão. (Seu valor pode ser alterado em tempo real, se desejado, usando `SET GLOBAL` (set-variable.html "15.7.6.1 SET Syntax for Variable Assignment").)

4. Se necessário, crie o diretório em que o arquivo de configuração deve ser localizado. O diretório deve ter um modo restritivo e ser acessível apenas à conta usada para executar o servidor MySQL. Por exemplo, em muitos sistemas Unix e semelhantes, como o Oracle Enterprise Linux, para usar `/usr/local/mysql/mysql-keyring/keyring_aws_conf` como o nome do arquivo, os seguintes comandos (executados como `root`) criam seu diretório pai e definem o modo e a propriedade do diretório:

   ```
   $> cd /usr/local/mysql
   $> mkdir mysql-keyring
   $> chmod 750 mysql-keyring
   $> chown mysql mysql-keyring
   $> chgrp mysql mysql-keyring
   ```

Na inicialização do MySQL, defina a variável de sistema `keyring_aws_conf_file` para `/usr/local/mysql/mysql-keyring/keyring_aws_conf` para indicar o local do arquivo de configuração ao servidor.

A localização do arquivo de configuração pode variar de acordo com a distribuição do Linux; o diretório para este arquivo também pode já ser fornecido por um módulo do sistema ou por outra aplicação, como o AppArmor. Por exemplo, sob o AppArmor em edições recentes do Ubuntu Linux, o diretório do chaveiro é especificado como `/var/lib/mysql-keyring`. Consulte [Ubuntu Server: AppArmor][(https://documentation.ubuntu.com/server/how-to/security/apparmor/index.html)] para obter mais informações sobre o uso do AppArmor em sistemas Ubuntu; consulte também [este exemplo de arquivo de configuração MySQL][(https://exampleconfig.com/view/mysql-ubuntu20-04-etc-apparmor-d-usr-sbin-mysqld)]. Para outras plataformas operacionais, consulte a documentação do sistema para orientação.

5. Prepare o arquivo de configuração `keyring_aws`, que deve conter duas linhas:

* Linha 1: O ID da chave de acesso secreta
   * Linha 2: A chave de acesso secreta

Por exemplo, se o ID da chave é `wwwwwwwwwwwwwEXAMPLE` e a chave é `xxxxxxxxxxxxx/yyyyyyy/zzzzzzzzEXAMPLEKEY`, o arquivo de configuração parece assim:

   ```
   wwwwwwwwwwwwwEXAMPLE
   xxxxxxxxxxxxx/yyyyyyy/zzzzzzzzEXAMPLEKEY
   ```

Para ser utilizável durante o processo de inicialização do servidor, `keyring_aws` deve ser carregado usando a opção `--early-plugin-load`. A variável de sistema `keyring_aws_cmk_id` é obrigatória e configura o ID da chave KMS obtido do servidor KMS da AWS. As variáveis de sistema `keyring_aws_conf_file` e `keyring_aws_data_file` configuram opcionalmente os locais dos arquivos utilizados pelo plugin `keyring_aws` para informações de configuração e armazenamento de dados. Os valores padrão das variáveis de localização de arquivo são específicos da plataforma. Para configurar os locais explicitamente, defina os valores da variável na inicialização. Por exemplo, use essas linhas no arquivo do servidor `my.cnf`, ajustando o sufixo `.so` e as localizações de arquivo para sua plataforma conforme necessário:

```
[mysqld]
early-plugin-load=keyring_aws.so
keyring_aws_cmk_id='arn:aws:kms:us-west-2:111122223333:key/abcd1234-ef56-ab12-cd34-ef56abcd1234'
keyring_aws_conf_file=/usr/local/mysql/mysql-keyring/keyring_aws_conf
keyring_aws_data_file=/usr/local/mysql/mysql-keyring/keyring_aws_data
```

Para que o plugin `keyring_aws` comece com sucesso, o arquivo de configuração deve existir e conter informações válidas sobre a chave de acesso secreta, inicializadas conforme descrito anteriormente. O arquivo de armazenamento não precisa existir. Se não existir, o `keyring_aws` tenta criá-lo (assim como seu diretório pai, se necessário).

Importante

A região padrão da AWS é `us-east-1`. Para qualquer outra região, você também deve definir explicitamente `keyring_aws_region` em `my.cnf`.

Para obter informações adicionais sobre as variáveis do sistema usadas para configurar o plugin `keyring_aws`, consulte a Seção 8.4.4.19, “Variáveis do sistema do Keychain”.

Inicie o servidor MySQL e instale as funções associadas ao plugin `keyring_aws`. Esta é uma operação única, realizada executando as seguintes instruções, ajustando o sufixo `.so` para sua plataforma, conforme necessário:

```
CREATE FUNCTION keyring_aws_rotate_cmk RETURNS INTEGER
  SONAME 'keyring_aws.so';
CREATE FUNCTION keyring_aws_rotate_keys RETURNS INTEGER
  SONAME 'keyring_aws.so';
```

Para informações adicionais sobre as funções do `keyring_aws`, consulte a Seção 8.4.4.16, “Funções de Gerenciamento de Chave de Carteira Específicas de Plugin”.

##### chave_aws_operação

Ao iniciar o plugin, o plugin `keyring_aws` lê a chave de acesso secreta da AWS e a chave do seu arquivo de configuração. Ele também lê quaisquer chaves criptografadas contidas em seu arquivo de armazenamento no cache de memória.

Durante a operação, `keyring_aws` mantém chaves criptografadas no cache de memória e utiliza o arquivo de armazenamento como armazenamento persistente local. Cada operação do chaveiro é transacional: `keyring_aws` altera com sucesso tanto o cache de chave na memória quanto o arquivo de armazenamento do chaveiro, ou a operação falha e o estado do chaveiro permanece inalterado.

Para garantir que as chaves sejam descartadas apenas quando o arquivo correto de armazenamento de chave está presente, `keyring_aws` armazena um checksum SHA-256 da chave em arquivo. Antes de atualizar o arquivo, o plugin verifica se ele contém o checksum esperado.

O plugin `keyring_aws` suporta as funções que compõem a interface padrão do serviço de Keyring do MySQL. As operações de Keyring realizadas por essas funções são acessíveis em dois níveis:

* Interface SQL: Nas declarações SQL, chame as funções descritas na Seção 8.4.4.15, “Funções de gerenciamento de chave de cartela de propósito geral”.

* Interface C: No código em linguagem C, chame as funções do serviço de chave de registro descritas na Seção 7.6.9.2, “O serviço de chave de registro”.

Exemplo (usando a interface SQL):

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Além disso, as funções `keyring_aws_rotate_cmk()` e `keyring_aws_rotate_keys()` “estende” a interface do plugin de chave de acesso para fornecer capacidades relacionadas à AWS que não são cobertas pela interface padrão do serviço de chave de acesso. Essas capacidades são acessíveis apenas ao chamar essas funções usando SQL. Não há funções correspondentes de serviço de chave em linguagem C.

Para informações sobre as características dos valores-chave permitidos por `keyring_aws`, consulte a Seção 8.4.4.13, “Tipos e comprimentos de chave de carteira-chave suportados”.

##### chave_aws Alterações de Credenciais

Supondo que o plugin `keyring_aws` tenha sido inicializado corretamente na inicialização do servidor, é possível alterar as credenciais usadas para a comunicação com o AWS KMS:

1. Use o AWS KMS para criar uma nova ID de chave de acesso secreto e uma chave de acesso secreto.

2. Armazene as novas credenciais no arquivo de configuração (o arquivo nomeado pela variável de sistema `keyring_aws_conf_file`). O formato do arquivo é conforme descrito anteriormente.

3. Reiniicie o plugin `keyring_aws` para que ele leia novamente o arquivo de configuração. Supondo que as novas credenciais sejam válidas, o plugin deve ser iniciado com sucesso.

Existem duas maneiras de reinicializar o plugin:

* Reinicie o servidor. Isso é mais simples e não tem efeitos colaterais, mas não é adequado para instalações que exigem o mínimo de tempo de inatividade do servidor com o menor número possível de reinicializações.

* Reiniicie o plugin sem reiniciar o servidor executando as seguintes instruções, ajustando o sufixo `.so` para sua plataforma conforme necessário:

     ```
     UNINSTALL PLUGIN keyring_aws;
     INSTALL PLUGIN keyring_aws SONAME 'keyring_aws.so';
     ```

Nota

Além de carregar um plugin no tempo de execução, `INSTALL PLUGIN` tem o efeito colateral de registrar o plugin no `mysql.plugin` sistema de tabela. Por isso, se você decidir parar de usar `keyring_aws`, não é suficiente remover a opção `--early-plugin-load` do conjunto de opções usadas para iniciar o servidor. Isso para o plugin de carregar cedo, mas o servidor ainda tenta carregá-lo quando chega ao ponto na sequência de inicialização onde ele carrega os plugins registrados em `mysql.plugin`.

Consequentemente, se você executar a sequência `UNINSTALL PLUGIN` mais `INSTALL PLUGIN` descrita acima para alterar as credenciais do AWS KMS, então para parar de usar `keyring_aws`, é necessário executar novamente `UNINSTALL PLUGIN`](uninstall-plugin.html "15.7.4.6 UNINSTALL PLUGIN Statement") para desinscrever o plugin, além de remover a opção `--early-plugin-load`.

#### 8.4.4.10 Usando o Plugin de Keychain de Chaves do HashiCorp Vault

Nota

O plugin `keyring_hashicorp` é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

O plugin chaveiro `keyring_hashicorp` comunica-se com o HashiCorp Vault para armazenamento de backend. O plugin suporta a autenticação do HashiCorp Vault AppRole. Nenhuma informação chave é armazenada permanentemente no armazenamento local do servidor MySQL. (Um cache de chave opcional de memória pode ser usado como armazenamento intermediário.) A geração aleatória de chaves é realizada no lado do servidor MySQL, com as chaves subsequentemente armazenadas no Hashicorp Vault.

O plugin `keyring_hashicorp` suporta as funções que compõem a interface padrão do serviço de Keyring do MySQL. As operações de Keyring realizadas por essas funções são acessíveis em dois níveis:

* Interface SQL: Nas declarações SQL, chame as funções descritas na Seção 8.4.4.15, “Funções de gerenciamento de chave de cartela de propósito geral”.

* Interface C: No código em linguagem C, chame as funções do serviço de chave de registro descritas na Seção 7.6.9.2, “O serviço de chave de registro”.

Exemplo (usando a interface SQL):

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para informações sobre as características dos valores-chave permitidos por `keyring_hashicorp`, consulte a Seção 8.4.4.13, “Tipos e comprimentos de chave de carteiro-chave suportados”.

Para instalar o `keyring_hashicorp`, use as instruções gerais encontradas na Seção 8.4.4.3, “Instalação do Plugin de Keychain”, juntamente com as informações de configuração específicas para o `keyring_hashicorp` encontradas aqui. A configuração específica do plugin inclui a preparação dos arquivos de certificado e chave necessários para se conectar ao HashiCorp Vault, bem como a configuração do próprio HashiCorp Vault. As seções a seguir fornecem as instruções necessárias.

* Preparação de certificado e chave
* Configuração do HashiCorp Vault
* configuração keyring_hashicorp

##### Preparação do Certificado e da Chave

O plugin `keyring_hashicorp` requer uma conexão segura com o servidor HashiCorp Vault, utilizando o protocolo HTTPS. Uma configuração típica inclui um conjunto de arquivos de certificado e chave:

* `company.crt`: Um certificado CA personalizado pertencente à organização. Este arquivo é utilizado tanto pelo servidor HashiCorp Vault quanto pelo plugin `keyring_hashicorp`.

* `vault.key`: A chave privada da instância do servidor HashiCorp Vault. Este arquivo é usado pelo servidor HashiCorp Vault.

* `vault.crt`: O certificado da instância do servidor HashiCorp Vault. Este arquivo deve ser assinado pelo certificado da CA da organização.

As instruções a seguir descrevem como criar os arquivos de certificado e chave usando o OpenSSL. (Se você já tiver esses arquivos, prossiga com o Configuração do HashiCorp Vault.) As instruções mostradas se aplicam a plataformas Linux e podem exigir ajustes para outras plataformas.

Importante

Os certificados gerados por essas instruções são autoassinados, o que pode não ser muito seguro. Depois de ganhar experiência usando esses arquivos, considere obter material de certificado/chave de uma autoridade de certificado registrada.

1. Prepare as chaves da empresa e do servidor HashiCorp Vault.

Use os seguintes comandos para gerar os arquivos de chave:

   ```
   openssl genrsa -aes256 -out company.key 4096
   openssl genrsa -aes256 -out vault.key 2048
   ```

Os comandos produzem arquivos que contêm a chave privada da empresa (`company.key`) e a chave privada do servidor Vault (`vault.key`). As chaves são chaves RSA geradas aleatoriamente de 4.096 e 2.048 bits, respectivamente.

Cada comando solicita uma senha. Para fins de teste, a senha não é necessária. Para desabilitar, omita o argumento `-aes256`.

Os arquivos chave contêm informações sensíveis e devem ser armazenados em um local seguro. A senha (também sensível) é necessária posteriormente, então anote-a e armazene-a em um local seguro.

(Opcional) Para verificar o conteúdo e a validade do arquivo de chave, use os seguintes comandos:

   ```
   openssl rsa -in company.key -check
   openssl rsa -in vault.key -check
   ```

2. Crie o certificado da empresa CA.

Use o seguinte comando para criar um arquivo de certificado CA da empresa com o nome `company.crt` que é válido por 365 dias (entre no comando em uma única linha):

   ```
   openssl req -x509 -new -nodes -key company.key
     -sha256 -days 365 -out company.crt
   ```

Se você usou o argumento `-aes256` para realizar a criptografia de chave durante a geração de chave, você será solicitado a fornecer a senha da chave da empresa durante a criação do certificado CA. Você também será solicitado a fornecer informações sobre o detentor do certificado (ou seja, você ou sua empresa), conforme mostrado aqui:

   ```
   Country Name (2 letter code) [AU]:
   State or Province Name (full name) [Some-State]:
   Locality Name (eg, city) []:
   Organization Name (eg, company) [Internet Widgits Pty Ltd]:
   Organizational Unit Name (eg, section) []:
   Common Name (e.g. server FQDN or YOUR name) []:
   Email Address []:
   ```

Responda às perguntas com os valores apropriados.

3. Crie uma solicitação de assinatura de certificado.

Para criar um certificado do servidor HashiCorp Vault, um Pedido de Sinais de Assinatura (CSR) deve ser preparado para a chave do servidor recém-criada. Crie um arquivo de configuração com o nome `request.conf` contendo as seguintes linhas. Se o servidor HashiCorp Vault não estiver em execução no host local, substitua os valores apropriados de CN e IP, e faça quaisquer outras alterações necessárias.

   ```
   [req]
   distinguished_name = vault
   x509_entensions = v3_req
   prompt = no

   [vault]
   C = US
   ST = CA
   L = RWC
   O = Company
   CN = 127.0.0.1

   [v3_req]
   subjectAltName = @alternatives
   authorityKeyIdentifier = keyid,issuer
   basicConstraints = CA:TRUE

   [alternatives]
   IP = 127.0.0.1
   ```

Use este comando para criar o pedido de assinatura:

   ```
   openssl req -new -key vault.key -config request.conf -out request.csr
   ```

O arquivo de saída (`request.csr`) é um arquivo intermediário que serve como entrada para a criação do certificado do servidor.

4. Crie o certificado do servidor HashiCorp Vault.

Assine as informações combinadas da chave do servidor HashiCorp Vault (`vault.key`) e do CSR (`request.csr`) com o certificado da empresa (`company.crt`) para criar o certificado do servidor HashiCorp Vault (`vault.crt`). Use o seguinte comando para fazer isso (entre no comando em uma única linha):

   ```
   openssl x509 -req -in request.csr
     -CA company.crt -CAkey company.key -CAcreateserial
     -out vault.crt -days 365 -sha256
   ```

Para tornar o certificado do servidor `vault.crt` útil, adicione o conteúdo do certificado da empresa `company.crt` a ele. Isso é necessário para que o certificado da empresa seja entregue junto com o certificado do servidor em solicitações.

   ```
   cat company.crt >> vault.crt
   ```

Se você exibir o conteúdo do arquivo `vault.crt`, ele deve parecer assim:

   ```
   -----BEGIN CERTIFICATE-----
   ... content of HashiCorp Vault server certificate ...
   -----END CERTIFICATE-----
   -----BEGIN CERTIFICATE-----
   ... content of company certificate ...
   -----END CERTIFICATE-----
   ```

##### Configuração do HashiCorp Vault

As instruções a seguir descrevem como criar uma configuração do HashiCorp Vault que facilita o teste do plugin `keyring_hashicorp`.

Importante

Uma configuração de teste é semelhante a uma configuração de produção, mas o uso de produção do HashiCorp Vault implica em considerações de segurança adicionais, como o uso de certificados não autoassinados e o armazenamento do certificado da empresa no armazenamento de confiança do sistema. Você deve implementar quaisquer etapas de segurança adicionais necessárias para atender aos seus requisitos operacionais.

Essas instruções assumem a disponibilidade dos arquivos de certificado e chave criados na Preparação de Certificado e Chave. Veja essa seção se você não tiver esses arquivos.

1. Pegue o binário do HashiCorp Vault.

Baixe o binário do HashiCorp Vault apropriado para sua plataforma em <https://www.vaultproject.io/downloads.html>.

Extraia o conteúdo do arquivo para produzir o comando executável **vault**, que é usado para realizar operações do HashiCorp Vault. Se necessário, adicione o diretório onde você instala o comando ao caminho do sistema.

(Opcional) O HashiCorp Vault suporta opções de autocompletamento que facilitam o uso. Para mais informações, consulte <https://learn.hashicorp.com/vault/getting-started/install#command-completion>.

2. Crie o arquivo de configuração do servidor HashiCorp Vault.

Prepare um arquivo de configuração com o nome `config.hcl` com o seguinte conteúdo. Para os valores `tls_cert_file`, `tls_key_file` e `path`, substitua os nomes de caminho apropriados para o seu sistema.

   ```
   listener "tcp" {
     address="127.0.0.1:8200"
     tls_cert_file="/home/username/certificates/vault.crt"
     tls_key_file="/home/username/certificates/vault.key"
   }

   storage "file" {
     path = "/home/username/vaultstorage/storage"
   }

   ui = true
   ```

3. Inicie o servidor HashiCorp Vault.

Para iniciar o servidor do Vault, use o seguinte comando, onde a opção `-config` especifica o caminho do arquivo de configuração recém-criado:

   ```
   vault server -config=config.hcl
   ```

Durante esta etapa, você pode ser solicitado a fornecer uma senha para a chave privada do servidor Vault armazenada no arquivo `vault.key`.

O servidor deve começar, exibindo algumas informações no console (IP, porta, etc.).

Para que você possa inserir os comandos restantes, coloque o comando **vault server** em segundo plano ou abra outro terminal antes de continuar.

4. Inicie o servidor HashiCorp Vault.

Nota

As operações descritas neste passo são necessárias apenas ao iniciar o Vault pela primeira vez, para obter a chave de desbloqueio e o token raiz. Os reinícios subsequentes da instância do Vault exigem apenas o desbloqueio usando a chave de desbloqueio.

Emita os seguintes comandos (assumindo a sintaxe da shell Bourne):

   ```
   export VAULT_SKIP_VERIFY=1
   vault operator init -n 1 -t 1
   ```

O primeiro comando permite que o comando **vault** ignore temporariamente o fato de que nenhum certificado da empresa foi adicionado ao armazenamento de confiança do sistema. Isso compensa o fato de que nossa CA autoassinada não está adicionada a esse armazenamento. (Para uso em produção, esse certificado deve ser adicionado.)

O segundo comando cria uma única chave de desbloqueio com a exigência de que uma única chave de desbloqueio esteja presente para o desbloqueio. (Para uso em produção, uma instância teria várias chaves de desbloqueio, com até tantas chaves necessárias para serem inseridas para desbloqueá-la. As chaves de desbloqueio devem ser entregues aos guardiões de chave dentro da empresa. O uso de uma única chave pode ser considerado um problema de segurança, pois isso permite que o cofre seja desbloqueado por um único guardião de chave.)

O Vault deve responder com informações sobre a chave de desbloqueio e o token raiz, além de algum texto adicional (os valores reais da chave de desbloqueio e do token raiz diferem dos mostrados aqui):

   ```
   ...
   Unseal Key 1: I2xwcFQc892O0Nt2pBiRNlnkHzTUrWS+JybL39BjcOE=
   Initial Root Token: s.vTvXeo3tPEYehfcd9WH7oUKz
   ...
   ```

Armazene a chave de desbloqueio e o token de raiz em um local seguro.

5. Descongele o servidor HashiCorp Vault.

Use este comando para desativar o servidor do Vault:

   ```
   vault operator unseal
   ```

Quando solicitado a inserir a chave de desbloqueio, use a chave obtida anteriormente durante a inicialização do Vault.

Vault deve produzir uma saída indicando que a configuração está completa e o cofre está aberto.

6. Faça login no servidor do HashiCorp Vault e verifique seu status.

Prepare as variáveis de ambiente necessárias para fazer login como root:

   ```
   vault login s.vTvXeo3tPEYehfcd9WH7oUKz
   ```

Para o valor do token nesse comando, substitua o conteúdo do token raiz obtido anteriormente durante a inicialização do Vault.

Verifique o status do servidor do Vault:

   ```
   vault status
   ```

A saída deve conter essas linhas (entre outras):

   ```
   ...
   Initialized     true
   Sealed          false
   ...
   ```

7. Configure a autenticação e o armazenamento do HashiCorp Vault.

Nota

As operações descritas nesta etapa são necessárias apenas na primeira vez que a instância do Vault é executada. Elas não precisam ser repetidas posteriormente.

Ative o método de autenticação AppRole e verifique se ele está na lista de métodos de autenticação:

   ```
   vault auth enable approle
   vault auth list
   ```

Ative o motor de armazenamento Vault KeyValue:

   ```
   vault secrets enable -version=1 kv
   ```

Crie e configure um papel para uso com o plugin `keyring_hashicorp` (entre no comando em uma única linha):

   ```
   vault write auth/approle/role/mysql token_num_uses=0
     token_ttl=20m token_max_ttl=30m secret_id_num_uses=0
   ```

8. Adicione uma política de segurança AppRole.

Nota

As operações descritas nesta etapa são necessárias apenas na primeira vez que a instância do Vault é executada. Elas não precisam ser repetidas posteriormente.

Prepare uma política que permita ao papel criado anteriormente acessar segredos apropriados. Crie um novo arquivo com o nome `mysql.hcl` com o seguinte conteúdo:

   ```
   path "kv/mysql/*" {
     capabilities = ["create", "read", "update", "delete", "list"]
   }
   ```

Nota

`kv/mysql/` neste exemplo pode precisar de ajuste de acordo com as políticas de instalação e requisitos de segurança locais. Se assim for, faça o mesmo ajuste em qualquer outro lugar onde `kv/mysql/` aparece nessas instruções.

Importe o arquivo de política no servidor do Vault para criar uma política com o nome `mysql-policy`, e, em seguida, atribua a política ao novo papel:

   ```
   vault policy write mysql-policy mysql.hcl
   vault write auth/approle/role/mysql policies=mysql-policy
   ```

Obtenha o ID do papel recém-criado e armazene-o em um local seguro:

   ```
   vault read auth/approle/role/mysql/role-id
   ```

Gere uma ID secreta para o papel e armazene-a em um local seguro:

   ```
   vault write -f auth/approle/role/mysql/secret-id
   ```

Após a geração dessas credenciais de ID de papel do AppRole e ID secreto, espera-se que elas permaneçam válidas indefinidamente. Não é necessário gerar novamente e o plugin `keyring_hashicorp` pode ser configurado com elas para uso contínuo. Para mais informações sobre autenticação AuthRole, visite <https://www.vaultproject.io/docs/auth/approle.html>.

##### chave_de_criptar_hashicorp Configuração

O arquivo da biblioteca de plugins contém o plugin `keyring_hashicorp` e uma função carregável, `keyring_hashicorp_update_config()`. Quando o plugin é inicializado e encerrado, ele carrega e descarrega automaticamente a função. Não é necessário carregar e descarregar a função manualmente.

O plugin `keyring_hashicorp` suporta os parâmetros de configuração mostrados na tabela a seguir. Para especificar esses parâmetros, atribua valores às variáveis do sistema correspondentes.

<table summary="keyring_hashicorp configuration parameters and corresponding system variables."><col style="width: 35%"/><col style="width: 50%"/><col style="width: 15%"/><thead><tr> <th scope="col">Configuration Parameter</th> <th scope="col">System Variable</th> <th scope="col">Mandatory</th> </tr></thead><tbody><tr> <th scope="row">HashiCorp Server URL</th> <td><code>keyring_hashicorp_server_url</code></td> <td>No</td> </tr><tr> <th scope="row">AppRole role ID</th> <td><code>keyring_hashicorp_role_id</code></td> <td>Yes</td> </tr><tr> <th scope="row">AppRole secret ID</th> <td><code>keyring_hashicorp_secret_id</code></td> <td>Yes</td> </tr><tr> <th scope="row">Store path</th> <td><code>keyring_hashicorp_store_path</code></td> <td>Yes</td> </tr><tr> <th scope="row">Authorization Path</th> <td><code>keyring_hashicorp_auth_path</code></td> <td>No</td> </tr><tr> <th scope="row">CA certificate file path</th> <td><code>keyring_hashicorp_ca_path</code></td> <td>No</td> </tr><tr> <th scope="row">Cache control</th> <td><code>keyring_hashicorp_caching</code></td> <td>No</td> </tr></tbody></table>

Para ser utilizável durante o processo de inicialização do servidor, `keyring_hashicorp` deve ser carregado usando a opção `--early-plugin-load`. Como indicado na tabela anterior, várias variáveis de sistema relacionadas a plugins são obrigatórias e também devem ser definidas. Por exemplo, use essas linhas no arquivo do servidor `my.cnf`, ajustando o sufixo `.so` e as localizações de arquivo para sua plataforma, conforme necessário:

```
[mysqld]
early-plugin-load=keyring_hashicorp.so
keyring_hashicorp_role_id='ee3b495c-d0c9-11e9-8881-8444c71c32aa'
keyring_hashicorp_secret_id='0512af29-d0ca-11e9-95ee-0010e00dd718'
keyring_hashicorp_store_path='/v1/kv/mysql'
keyring_hashicorp_auth_path='/v1/auth/approle/login'
```

Nota

De acordo com a documentação da HashiCorp [(https://www.vaultproject.io/api-docs)], todas as rotas da API são prefixadas com uma versão do protocolo (que você pode ver no exemplo anterior como `/v1/` nos valores `keyring_hashicorp_store_path` e `keyring_hashicorp_auth_path`). Se a HashiCorp desenvolver novas versões de protocolo, pode ser necessário alterar `/v1/` para outra coisa na sua configuração.

O MySQL Server autentica-se contra o HashiCorp Vault usando autenticação AppRole. A autenticação bem-sucedida requer que dois segredos sejam fornecidos ao Vault, um ID de papel e um ID de segredo, que são semelhantes em conceito ao nome de usuário e senha. Os valores do ID de papel e do ID de segredo a serem usados são aqueles obtidos durante o procedimento de configuração do HashiCorp Vault realizado anteriormente. Para especificar os dois IDs, atribua seus respectivos valores às variáveis de sistema `keyring_hashicorp_role_id` e `keyring_hashicorp_secret_id`. O procedimento de configuração também resulta em um caminho de armazenamento de `/v1/kv/mysql`, que é o valor a ser atribuído a `keyring_hashicorp_commit_store_path`.

No momento da inicialização do plugin, `keyring_hashicorp` tenta se conectar ao servidor HashiCorp Vault usando os valores de configuração. Se a conexão for bem-sucedida, o plugin armazena os valores em variáveis de sistema correspondentes que têm `_commit_` em seu nome. Por exemplo, após a conexão bem-sucedida, o plugin armazena os valores de `keyring_hashicorp_role_id` e `keyring_hashicorp_store_path` em `keyring_hashicorp_commit_role_id` e `keyring_hashicorp_commit_store_path`.

A reconfiguração em tempo de execução pode ser realizada com a assistência da função `keyring_hashicorp_update_config()`:

1. Use as declarações `SET` para atribuir os novos valores desejados às variáveis do sistema de configuração mostradas na tabela anterior. Essas atribuições, por si sós, não têm efeito sobre a operação contínua do plugin.

2. Invoque `keyring_hashicorp_update_config()` para fazer o plugin se reconectar ao servidor HashiCorp Vault usando os novos valores da variável.

3. Se a conexão for bem-sucedida, o plugin armazena os valores de configuração atualizados em variáveis do sistema correspondentes que têm `_commit_` em seu nome.

Por exemplo, se você reconfigurou o HashiCorp Vault para ouvir na porta 8201 em vez do padrão 8200, reconfigure o `keyring_hashicorp` da seguinte forma:

```
mysql> SET GLOBAL keyring_hashicorp_server_url = 'https://127.0.0.1:8201';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT keyring_hashicorp_update_config();
+--------------------------------------+
| keyring_hashicorp_update_config()    |
+--------------------------------------+
| Configuration update was successful. |
+--------------------------------------+
1 row in set (0.03 sec)
```

Se o plugin não conseguir se conectar ao HashiCorp Vault durante a inicialização ou reconfiguração e não houvesse uma conexão existente, as variáveis do sistema `_commit_` são definidas como `'Not committed'` para variáveis com valor de string e `OFF` para variáveis com valor de Booleano. Se o plugin não conseguir se conectar, mas houver uma conexão existente, essa conexão permanece ativa e as variáveis `_commit_` refletem os valores usados para ela.

Nota

Se você não definir as variáveis de sistema obrigatórias na inicialização do servidor, ou se ocorrer algum outro erro de inicialização do plugin, a inicialização falha. Nesse caso, você pode usar o procedimento de reconfiguração em tempo de execução para inicializar o plugin sem reiniciar o servidor.

Para obter informações adicionais sobre as variáveis de sistema específicas do plugin `keyring_hashicorp` e as funções, consulte a Seção 8.4.4.19, “Variáveis do sistema de chaveiro”, e a Seção 8.4.4.16, “Funções de gerenciamento de chaveiro específicas do plugin”.

#### 8.4.4.11 Usando o componente de carteirinha de chave do Oracle Cloud Infrastructure

Nota

O componente chaveiro Vault do Oracle Cloud Infrastructure está incluído na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

`component_keyring_oci` faz parte da infraestrutura de componente que se comunica com o Oracle Cloud Infrastructure Vault para armazenamento de back end. Nenhuma informação chave é armazenada permanentemente no armazenamento local do servidor MySQL. Todas as chaves são armazenadas no Oracle Cloud Infrastructure Vault, tornando este componente bem adequado para clientes da Oracle Cloud Infrastructure MySQL para a gestão das suas chaves da Edição Empresarial MySQL.

No MySQL 8.0.24, o MySQL Keyring começou a migrar de plugins para usar a infraestrutura do componente. A introdução do `component_keyring_oci` no MySQL 8.0.31 é uma continuação desse esforço. Para mais informações, consulte [Componentes do Keyring em oposição aos plugins do Keyring][(keyring-component-plugin-comparison.html "8.4.4.1 Keyring Components Versus Keyring Plugins")].

Nota

Apenas um componente ou plugin do chaveiro deve ser ativado de cada vez. A ativação de vários componentes ou plugins do chaveiro não é suportada e os resultados podem não ser os esperados.

Para usar `component_keyring_oci` para gerenciamento de chave de segurança, você deve:

1. Escreva um manifesto que diga ao servidor para carregar `component_keyring_oci`, conforme descrito na Seção 8.4.4.2, “Instalação do componente do Keychain”.

2. Escreva um arquivo de configuração para `component_keyring_oci`, conforme descrito aqui.

Depois de escrever um manifesto e um arquivo de configuração, você deve ser capaz de acessar as chaves que foram criadas usando o plugin `keyring_oci`, desde que você especifique o mesmo conjunto de opções de configuração para inicializar o componente do chaveiro. A compatibilidade reversa integrada do `component_keyring_oci` simplifica a migração do plugin do chaveiro para o componente.

* Notas de configuração
* Verificar a instalação do componente
* Uso do componente Vault Keyring

Observações de configuração #####

Quando é inicializado, `component_keyring_oci` lê um arquivo de configuração global ou um arquivo de configuração global emparelhado com um arquivo de configuração local:

* O componente tenta ler seu arquivo de configuração global do diretório onde o arquivo da biblioteca do componente está instalado (ou seja, o diretório do plugin do servidor).

* Se o arquivo de configuração global indicar o uso de um arquivo de configuração local, o componente tenta ler seu arquivo de configuração local do diretório de dados.

* Embora os arquivos de configuração global e local estejam localizados em diretórios diferentes, o nome do arquivo é `component_keyring_oci.cnf` em ambos os locais.

* É um erro se não existir nenhum arquivo de configuração. `component_keyring_oci` não pode ser inicializado sem uma configuração válida.

Os arquivos de configuração locais permitem configurar múltiplas instâncias do servidor para usar `component_keyring_oci`, de modo que a configuração do componente para cada instância do servidor seja específica para uma instância de diretório de dados dado. Isso permite que o mesmo componente de chave seja usado com um Vault distinto da Oracle Cloud Infrastructure para cada instância.

Supõe-se que você esteja familiarizado com os conceitos da Infraestrutura da Oracle Cloud, mas a documentação a seguir pode ser útil ao configurar os recursos que serão utilizados pelo `component_keyring_oci`:

* [Visão geral do Vault](https://docs.cloud.oracle.com/iaas/Content/KeyManagement/Concepts/keyoverview.htm)

* Chaves e OCIDs necessários (https://docs.cloud.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm)

* [Gerenciamento de Chaves](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingkeys.htm)

* Gerenciamento de compartimentos (https://docs.cloud.oracle.com/en-us/iaas/Content/Identity/Tasks/managingcompartments.htm)

* [Gerenciamento de Armazéns de Arquivos](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm)

* Gerenciar Segredos (https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingsecrets.htm)

Os arquivos de configuração do `component_keyring_oci` têm essas propriedades:

* Um arquivo de configuração deve estar em formato JSON válido.
* Um arquivo de configuração permite esses itens de configuração:

+ `"read_local_config"`: Este item é permitido apenas no arquivo de configuração global. Se o item não estiver presente, o componente usa apenas o arquivo de configuração global. Se o item estiver presente, seu valor é `true` ou `false`, indicando se o componente deve ler informações de configuração do arquivo de configuração local.

Se o item `"read_local_config"` estiver presente no arquivo de configuração global, juntamente com outros itens, o componente verifica o valor do item `"read_local_config"` primeiro:

- Se o valor for `false`, o componente processa os outros itens no arquivo de configuração global e ignora o arquivo de configuração local.

- Se o valor for `true`, o componente ignora os outros itens no arquivo de configuração global e tenta ler o arquivo de configuração local.

+ `“user”`: O ID de OC do usuário da Infraestrutura da Nuvem da Oracle que o `component_keyring_oci` usa para conexões. Antes de usar o `component_keyring_oci`, a conta do usuário deve existir e ter acesso para usar os recursos de arrendamento, compartimento e cofre configurados da Infraestrutura da Nuvem da Oracle. Para obter o ID de OC do usuário a partir do Console, use as instruções em [Chaves e ID de OC Requeridos][(https://docs.cloud.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm)].

Este valor é obrigatório.

+ `“tenancy”`: O OCID da tenência da Infraestrutura da Nuvem da Oracle que `component_keyring_oci` usa como localização do compartimento do MySQL. Antes de usar `component_keyring_oci`, você deve criar uma tenência se ela não existir. Para obter o OCID da tenência a partir do Console, use as instruções em [Chaves e OCIDs Requeridos][(https://docs.cloud.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm)].

Este valor é obrigatório.

+ `“compartment”`: O OCID do compartimento de hospedagem que o `component_keyring_oci` utiliza como local das chaves MySQL. Antes de usar o `component_keyring_oci`, você deve criar um compartimento ou subcompartimento MySQL, se ele não existir. Esse compartimento não deve conter chaves de vault ou segredos de vault. Ele não deve ser usado por sistemas que não sejam o Keyring de Chaves MySQL. Para obter informações sobre a gestão de compartimentos e obter o OCID, consulte [Gestão de Compatimentos][(https://docs.cloud.oracle.com/en-us/iaas/Content/Identity/Tasks/managingcompartments.htm)].

Este valor é obrigatório.

+ `“virtual_vault”`: O ID do cofre da Oracle Cloud Infrastructure que o `component_keyring_oci` usa para operações de criptografia. Antes de usar `component_keyring_oci`, você deve criar um novo cofre no compartimento MySQL, se ele não existir. (Alternativamente, você pode reutilizar um cofre existente que esteja em um compartimento pai do compartimento MySQL.) Os usuários do compartimento podem ver e usar apenas as chaves em seus respectivos compartimentos. Para obter informações sobre como criar um cofre e obter o ID do cofre, consulte [Gerenciamento de cofres][(https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm)].

Este valor é obrigatório.

+ `“encryption_endpoint”`: O ponto final do servidor de criptografia da Infraestrutura da Nuvem da Oracle que o `component_keyring_oci` usa para gerar informações criptografadas ou codificadas (texto cifrado) para novas chaves. O ponto final de criptografia é específico do cofre e a Infraestrutura da Nuvem da Oracle o atribui no momento da criação do cofre. Para obter o ponto final OCID, consulte os detalhes da configuração do seu cofre keyring_oci, usando as instruções em [Gerenciamento de Cofres](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm).

Este valor é obrigatório.

+ `"management_endpoint"`: O ponto final do servidor de gerenciamento de chave da Oracle Cloud Infrastructure que o `component_keyring_oci` usa para listar chaves existentes. O ponto final de gerenciamento de chave é específico do cofre e a Oracle Cloud Infrastructure o atribui no momento da criação do cofre. Para obter o ponto final OCID, consulte os detalhes da configuração do seu cofre keyring_oci, usando as instruções em [Gerenciamento de cofres](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm).

Este valor é obrigatório.

+ `“vaults_endpoint”`: O ponto final do servidor de cofres do Oracle Cloud Infrastructure que o `component_keyring_oci` usa para obter o valor dos segredos. O ponto final do cofre é específico do cofre e a Oracle Cloud Infrastructure o atribui no momento da criação do cofre. Para obter o ponto final OCID, consulte os detalhes da configuração do seu cofre keyring_oci, usando as instruções em [Gerenciamento de cofres](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm).

Este valor é obrigatório.

+ `“secrets_endpoint”`: O ponto final do servidor de segredos da Oracle Cloud Infrastructure que o `component_keyring_oci` usa para listar, criar e aposentar segredos. O ponto final de segredos é específico do cofre e a Oracle Cloud Infrastructure o atribui no momento da criação do cofre. Para obter o ponto final OCID, consulte os detalhes da configuração do seu cofre keyring_oci, usando as instruções em [Gerenciamento de cofres](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm).

Este valor é obrigatório.

+ `“master_key”`: O OCID da chave de criptografia mestre da Infraestrutura de Nuvem Oracle que o `component_keyring_oci` usa para criptografar segredos. Antes de usar o `component_keyring_oci`, você deve criar uma chave criptográfica para o compartimento da Infraestrutura de Nuvem Oracle, se ele não existir. Forneça um nome específico para MySQL para a chave gerada e não use-o para outros fins. Para obter informações sobre a criação de chaves, consulte [Gerenciamento de Chaves](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingkeys.htm).

Este valor é obrigatório.

+ `“key_file”`: O nome do caminho do arquivo que contém a chave privada RSA que o `component_keyring_oci` usa para autenticação na Oracle Cloud Infrastructure. Você também deve fazer o upload da chave pública correspondente RSA usando o Console. O Console exibe o valor do perfil da chave, que você pode usar para definir o valor do `"key_fingerprint"`. Para obter informações sobre a geração e o upload de chaves de API, consulte [Chaves e OCIDs Requeridas][(https://docs.cloud.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm)].

Este valor é obrigatório.

+ `“key_fingerprint”`: A impressão digital da chave privada RSA que `component_keyring_oci` usa para autenticação na Infraestrutura de Nuvem Oracle. Para obter a impressão digital da chave ao criar as chaves de API, execute este comando:

    ```
    openssl rsa -pubout -outform DER -in ~/.oci/oci_api_key.pem | openssl md5 -c
    ```

Como alternativa, obtenha a impressão digital do Console, que exibe automaticamente a impressão digital quando você carrega a chave pública RSA. Para obter informações sobre como obter impressões digitais de chave, consulte [Chaves necessárias e OCIDs][(https://docs.cloud.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm)].

Este valor é obrigatório.

+ `“ca_certificate”`: O nome do caminho do arquivo do pacote de certificados CA que o componente `component_keyring_oci` utiliza para verificação de certificados da Oracle Cloud Infrastructure. O arquivo contém um ou mais certificados para verificação de pares. Se nenhum arquivo for especificado, o pacote de CA padrão instalado no sistema é utilizado. Se o valor for definido como `disabled` (sensível a maiúsculas e minúsculas), `component_keyring_oci` não realiza nenhuma verificação de certificados.

Nos sistemas Windows, isso deve ser configurado como `disabled`, ou como o caminho para um arquivo de pacote de certificados CA.

Dada as propriedades do arquivo de configuração anterior, para configurar o `component_keyring_oci`, crie um arquivo de configuração global com o nome `component_keyring_oci.cnf` no diretório onde o arquivo da biblioteca `component_keyring_oci` está instalado e, opcionalmente, crie um arquivo de configuração local, também com o nome `component_keyring_oci.cnf`, no diretório de dados.

##### Verifique a instalação do componente

Após realizar qualquer configuração específica para o componente, inicie o servidor. Verifique a instalação do componente examinando a tabela do Schema de desempenho `keyring_component_status`:

```
mysql> SELECT * FROM performance_schema.keyring_component_status;
+---------------------+--------------------------------------------------------------------+
| STATUS_KEY          | STATUS_VALUE                                                       |
+---------------------+--------------------------------------------------------------------+
| Component_name      | component_keyring_oci                                              |
| Author              | Oracle Corporation                                                 |
| License             | PROPRIETARY                                                        |
| Implementation_name | component_keyring_oci                                              |
| Version             | 1.0                                                                |
| Component_status    | Active                                                             |
| user                | ocid1.user.oc1..aaaaaaaasqly<...>                                  |
| tenancy             | ocid1.tenancy.oc1..aaaaaaaai<...>                                  |
| compartment         | ocid1.compartment.oc1..aaaaaaaah2swh<...>                          |
| virtual_vault       | ocid1.vault.oc1.iad.bbo5xyzkaaeuk.abuwcljtmvxp4r<...>              |
| master_key          | ocid1.key.oc1.iad.bbo5xyzkaaeuk.abuwcljrbsrewgap<...>              |
| encryption_endpoint | bbo5xyzkaaeuk-crypto.kms.us-<...>                                  |
| management_endpoint | bbo5xyzkaaeuk-management.kms.us-<...>                              |
| vaults_endpoint     | vaults.us-<...>                                                    |
| secrets_endpoint    | secrets.vaults.us-<...>                                            |
| key_file            | ~/.oci/oci_api_key.pem                                             |
| key_fingerprint     | ca:7c:e1:fa:86:b6:40:af:39:d6<...>                                 |
| ca_certificate      | disabled                                                           |
+---------------------+--------------------------------------------------------------------+
```

Um valor de `Component_status` de `Active` indica que o componente foi inicializado com sucesso.

Se o componente não puder ser carregado, o início do servidor falha. Verifique o log de erro do servidor para mensagens de diagnóstico. Se o componente for carregado, mas não conseguir inicializar devido a problemas de configuração, o servidor será iniciado, mas o valor `Component_status` será `Disabled`. Verifique o log de erro do servidor, corrija os problemas de configuração e use a declaração `ALTER INSTANCE RELOAD KEYRING` para recarregar a configuração.

É possível consultar o servidor MySQL para obter a lista de chaves existentes. Para ver quais chaves existem, examine a tabela do Gerador de desempenho `keyring_keys`.

```
mysql> SELECT * FROM performance_schema.keyring_keys;
+-----------------------------+--------------+----------------+
| KEY_ID                      | KEY_OWNER    | BACKEND_KEY_ID |
+-----------------------------+--------------+----------------+
| audit_log-20210322T130749-1 |              |                |
| MyKey                       | me@localhost |                |
| YourKey                     | me@localhost |                |
+-----------------------------+--------------+----------------+
```

##### Uso do componente de cartela de chave de vault

`component_keyring_oci` suporta as funções que compõem a interface padrão do serviço de Keyring do MySQL. As operações de Keyring realizadas por essas funções são acessíveis em declarações SQL, conforme descrito na Seção 8.4.4.15, “Funções de Gerenciamento de Chaves de Keyring de Propósito Geral”.

Exemplo:

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para informações sobre as características dos valores-chave permitidos por `component_keyring_oci`, consulte a Seção 8.4.4.13, “Tipos e comprimentos de chave de carteiro-chave suportados”.

#### 8.4.4.12 Usando o Plugin de Keychain do Oracle Cloud Infrastructure Vault

Nota

O plugin `keyring_oci` é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

O plugin `keyring_oci` é um plugin de chaveiro que se comunica com o Oracle Cloud Infrastructure Vault para armazenamento de backend. Nenhuma informação chave é armazenada permanentemente no armazenamento local do servidor MySQL. Todas as chaves são armazenadas no Oracle Cloud Infrastructure Vault, tornando este plugin adequado para clientes do Oracle Cloud Infrastructure MySQL para gerenciamento de suas chaves da Edição Empresarial do MySQL.

A partir do MySQL 8.0.31, este plugin é desatualizado e está sujeito à remoção em uma futura versão do MySQL. Em vez disso, considere usar o componente `component_keyring_oci` para armazenar dados do chaveiro (consulte Seção 8.4.4.11, “Usando o componente de chaveiro do Oracle Cloud Infrastructure Vault”).

O plugin `keyring_oci` suporta as funções que compõem a interface padrão do serviço de Keyring do MySQL. As operações de Keyring realizadas por essas funções são acessíveis em dois níveis:

* Interface SQL: Nas declarações SQL, chame as funções descritas na Seção 8.4.4.15, “Funções de gerenciamento de chave de cartela de propósito geral”.

* Interface C: No código em linguagem C, chame as funções do serviço de chave de registro descritas na Seção 7.6.9.2, “O serviço de chave de registro”.

Exemplo (usando a interface SQL):

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para informações sobre as características dos valores-chave permitidos por `keyring_oci`, consulte a Seção 8.4.4.13, “Tipos e comprimentos de chave de carteira suportados”.

Para instalar o `keyring_oci`, use as instruções gerais encontradas na Seção 8.4.4.3, “Instalação do Plugin de Keychain”, juntamente com as informações de configuração específicas para o `keyring_oci` encontradas aqui. A configuração específica do plugin envolve definir um número de variáveis do sistema para indicar os nomes ou valores dos recursos da Oracle Cloud Infrastructure.

Supõe-se que você esteja familiarizado com os conceitos da Oracle Cloud Infrastructure, mas a documentação a seguir pode ser útil ao configurar os recursos que serão utilizados pelo plugin `keyring_oci`:

* [Visão geral do Vault](https://docs.cloud.oracle.com/iaas/Content/KeyManagement/Concepts/keyoverview.htm)

* [Identificador de Recursos](https://docs.cloud.oracle.com/en-us/iaas/Content/General/Concepts/identifiers.htm)

* Chaves e OCIDs necessários (https://docs.cloud.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm)

* [Gerenciamento de Chaves](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingkeys.htm)

* Gerenciamento de compartimentos (https://docs.cloud.oracle.com/en-us/iaas/Content/Identity/Tasks/managingcompartments.htm)

* [Gerenciamento de Armazéns de Arquivos](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm)

* Gerenciar Segredos (https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingsecrets.htm)

O plugin `keyring_oci` suporta os parâmetros de configuração mostrados na tabela a seguir. Para especificar esses parâmetros, atribua valores às variáveis do sistema correspondentes.

<table summary="keyring_oci configuration parameters and corresponding system variables."><col style="width: 35%"/><col style="width: 50%"/><col style="width: 15%"/><thead><tr> <th scope="col">Configuration Parameter</th> <th scope="col">System Variable</th> <th scope="col">Mandatory</th> </tr></thead><tbody><tr> <th scope="row">User OCID</th> <td><code>keyring_oci_user</code></td> <td>Yes</td> </tr><tr> <th scope="row">Tenancy OCID</th> <td><code>keyring_oci_tenancy</code></td> <td>Yes</td> </tr><tr> <th scope="row">Compartment OCID</th> <td><code>keyring_oci_compartment</code></td> <td>Yes</td> </tr><tr> <th scope="row">Vault OCID</th> <td><code>keyring_oci_virtual_vault</code></td> <td>Yes</td> </tr><tr> <th scope="row">Master key OCID</th> <td><code>keyring_oci_master_key</code></td> <td>Yes</td> </tr><tr> <th scope="row">Encryption server endpoint</th> <td><code>keyring_oci_encryption_endpoint</code></td> <td>Yes</td> </tr><tr> <th scope="row">Key management server endpoint</th> <td><code>keyring_oci_management_endpoint</code></td> <td>Yes</td> </tr><tr> <th scope="row">Vaults server endpoint</th> <td><code>keyring_oci_vaults_endpoint</code></td> <td>Yes</td> </tr><tr> <th scope="row">Secrets server endpoint</th> <td><code>keyring_oci_secrets_endpoint</code></td> <td>Yes</td> </tr><tr> <th scope="row">RSA private key file</th> <td><code>keyring_oci_key_file</code></td> <td>Yes</td> </tr><tr> <th scope="row">RSA private key fingerprint</th> <td><code>keyring_oci_key_fingerprint</code></td> <td>Yes</td> </tr><tr> <th scope="row">CA certificate bundle file</th> <td><code>keyring_oci_ca_certificate</code></td> <td>No</td> </tr></tbody></table>

Para ser utilizável durante o processo de inicialização do servidor, `keyring_oci` deve ser carregado usando a opção `--early-plugin-load`. Como indicado na tabela anterior, várias variáveis de sistema relacionadas a plugins são obrigatórias e também devem ser definidas:

* A Oracle Cloud Infrastructure utiliza extensamente as Identidades de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de Nível de N

+ Deve existir um usuário para se conectar à Oracle Cloud Infrastructure. Crie o usuário, se necessário, e atribua o OCID do usuário à variável de sistema `keyring_oci_user`.

+ A tenência da Infraestrutura da Oracle Cloud que será usada deve existir, assim como o compartimento MySQL dentro da tenência e o cofre dentro do compartimento. Crie esses recursos, se necessário, e certifique-se de que o usuário está habilitado a usá-los. Atribua os OCIDs para a tenência, compartimento e cofre às variáveis de sistema `keyring_oci_tenancy`, `keyring_oci_compartment` e `keyring_oci_virtual_vault`.

+ Deve existir uma chave mestre para criptografia. Crie-a, se necessário, e atribua seu OCID à variável de sistema `keyring_oci_master_key`.

* Vários pontos finais do servidor devem ser especificados. Esses pontos finais são específicos do cofre e a Oracle Cloud Infrastructure os atribui no momento da criação do cofre. Obtenha seus valores da página de detalhes do cofre e atribua-os às variáveis de sistema `keyring_oci_encryption_endpoint`, `keyring_oci_management_endpoint`, `keyring_oci_vaults_endpoint` e `keyring_oci_secrets_endpoint`.

* A API da Infraestrutura da Nuvem do Oracle utiliza um par de chaves privadas/públicas RSA para autenticação. Para criar este par de chaves e obter o perfil de impressão digital da chave, use as instruções em [Chaves e OCIDs necessárias][(https://docs.cloud.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm)]. Atribua o nome do arquivo da chave privada e o perfil de impressão digital da chave às variáveis de sistema `keyring_oci_key_file` e `keyring_oci_key_fingerprint`.

Além das variáveis de sistema obrigatórias, `keyring_oci_ca_certificate` pode ser configurada opcionalmente para especificar um arquivo de certificado de autoridade de certificação (CA) para autenticação de pares. Em sistemas Windows, essa variável deve ser configurada para `disabled`, ou para o caminho de um arquivo de certificado de CA.

Importante

Se você copiar um parâmetro do Oracle Cloud Infrastructure Console, o valor copiado pode incluir uma parte inicial `https://`. Omita essa parte ao definir a variável de sistema correspondente `keyring_oci`.

Por exemplo, para carregar e configurar o `keyring_oci`, use essas linhas no arquivo do servidor `my.cnf` (ajuste o sufixo `.so` e a localização do arquivo conforme necessário para sua plataforma):

```
[mysqld]
early-plugin-load=keyring_oci.so
keyring_oci_user=ocid1.user.oc1..longAlphaNumericString
keyring_oci_tenancy=ocid1.tenancy.oc1..longAlphaNumericString
keyring_oci_compartment=ocid1.compartment.oc1..longAlphaNumericString
keyring_oci_virtual_vault=ocid1.vault.oc1.iad.shortAlphaNumericString.longAlphaNumericString
keyring_oci_master_key=ocid1.key.oc1.iad.shortAlphaNumericString.longAlphaNumericString
keyring_oci_encryption_endpoint=shortAlphaNumericString-crypto.kms.us-ashburn-1.oraclecloud.com
keyring_oci_management_endpoint=shortAlphaNumericString-management.kms.us-ashburn-1.oraclecloud.com
keyring_oci_vaults_endpoint=vaults.us-ashburn-1.oci.oraclecloud.com
keyring_oci_secrets_endpoint=secrets.vaults.us-ashburn-1.oci.oraclecloud.com
keyring_oci_key_file=file_name
keyring_oci_key_fingerprint=12:34:56:78:90:ab:cd:ef:12:34:56:78:90:ab:cd:ef
```

Para informações adicionais sobre as variáveis de sistema específicas do plugin `keyring_oci`, consulte a Seção 8.4.4.19, “Variáveis do Sistema de Chave”.

O plugin `keyring_oci` não suporta reconfiguração em tempo real e nenhuma de suas variáveis de sistema pode ser modificada em tempo real. Para alterar os parâmetros de configuração, faça o seguinte:

* Modifique as configurações dos parâmetros no arquivo `my.cnf`, ou use `SET PERSIST_ONLY` para os parâmetros que são persistentes em `mysqld-auto.conf`.

* Reinicie o servidor.

#### 8.4.4.13 Tipos e comprimentos de chave de carteira suportados

O MySQL Keyring suporta chaves de diferentes tipos (algoritmos de criptografia) e comprimentos:

* Os tipos de chave disponíveis dependem do plugin de chave que está instalado.

* As comprimentos de chave permitidos estão sujeitos a vários fatores:

+ Limites de carga de interface de função geral do chaveiro (para chaves gerenciadas usando uma das funções do chaveiro de propósito geral descritas na Seção 8.4.4.15, “Funções de Gerenciamento de Chaves do Chaveiro de Propósito Geral”), ou limites de implementação do back-end. Esses limites de comprimento podem variar de acordo com o tipo de operação da chave.

+ Além dos limites gerais, os plugins de chave individual podem impor restrições sobre o comprimento da chave por tipo de chave.

A Tabela 8.32, “Limites Gerais de Comprimento de Chaves do Keyring”, mostra os limites gerais de comprimento de chave. (Os limites inferiores para `keyring_aws` são impostos pela interface do AWS KMS, não pelas funções do keyring.) Para plugins do keyring, a Tabela 8.33, “Tipos e comprimentos de chaves de plugins do keyring”, mostra os tipos de chave que cada plugin do keyring permite, bem como quaisquer restrições específicas de comprimento de chave do plugin. Para a maioria dos componentes do keyring, os limites gerais de comprimento de chave se aplicam e não há restrições de tipo de chave.

Nota

`component_keyring_oci` (assim como o plugin `keyring_oci`) só pode gerar chaves do tipo `AES` com um tamanho de 16, 24 ou 32 bytes.

**Tabela 8.32 Limites de comprimento da chave do chaveiro principal**

<table summary="General limits on keyring key lengths."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Key Operation</th> <th>Maximum Key Length</th> </tr></thead><tbody><tr> <td>Generate key</td> <td><p class="valid-value"> 16,384 bytes (2,048 prior to MySQL 8.0.18); 1,024 for <code>keyring_aws</code> </p></td> </tr><tr> <td>Store key</td> <td><p class="valid-value"> 16,384 bytes (2,048 prior to MySQL 8.0.18); 4,096 for <code>keyring_aws</code> </p></td> </tr><tr> <td>Fetch key</td> <td><p class="valid-value"> 16,384 bytes (2,048 prior to MySQL 8.0.18); 4,096 for <code>keyring_aws</code> </p></td> </tr></tbody></table>

**Tabela 8.33 Tipos e comprimentos de chaves do plug-in de carteira**

<table summary="Key types and lengths supported by keyring plugins."><col style="width: 30%"/><col style="width: 25%"/><col style="width: 45%"/><thead><tr> <th scope="col">Nome do Plugin</th> <th scope="col">Tipo de chave permitido</th> <th scope="col">Restrições de comprimento específicas para plugins</th> </tr></thead><tbody><tr> <th scope="row" valign="top"><code>keyring_aws</code></th> <td><p class="valid-value"> <code>AES</code> </p><p class="valid-value"> <code>SECRET</code> </p></td> <td><p class="valid-value">16, 24 ou 32 bytes</p><p class="valid-value">Nenhum</p></td> </tr><tr> <th scope="row" valign="top"><code>keyring_encrypted_file</code></th> <td><p class="valid-value"> <code>AES</code> </p><p class="valid-value"> <code>DSA</code> </p><p class="valid-value"> <code>RSA</code> </p><p class="valid-value"> <code>SECRET</code> </p></td> <td><p class="valid-value">Nenhum</p><p class="valid-value">Nenhum</p><p class="valid-value">Nenhum</p><p class="valid-value">Nenhum</p></td> </tr><tr> <th scope="row" valign="top"><code>keyring_file</code></th> <td><p class="valid-value"> <code>AES</code> </p><p class="valid-value"> <code>DSA</code> </p><p class="valid-value"> <code>RSA</code> </p><p class="valid-value"> <code>SECRET</code> </p></td> <td><p class="valid-value">Nenhum</p><p class="valid-value">Nenhum</p><p class="valid-value">Nenhum</p><p class="valid-value">Nenhum</p></td> </tr><tr> <th scope="row" valign="top"><code>keyring_hashicorp</code></th> <td><p class="valid-value"> <code>AES</code> </p><p class="valid-value"> <code>DSA</code> </p><p class="valid-value"> <code>RSA</code> </p><p class="valid-value"> <code>SECRET</code> </p></td> <td><p class="valid-value">Nenhum</p><p class="valid-value">Nenhum</p><p class="valid-value">Nenhum</p><p class="valid-value">Nenhum</p></td> </tr><tr> <th scope="row" valign="top"><code>keyring_oci</code></th> <td><p class="valid-value"> <code>AES</code> </p></td> <td><p class="valid-value"> 16, 24, or 32 bytes </p></td> </tr><tr> <th scope="row" valign="top"><code>keyring_okv</code></th> <td><p class="valid-value"> <code>AES</code> </p><p class="valid-value"> <code>SECRET</code> </p></td> <td><p class="valid-value">16, 24 ou 32 bytes</p><p class="valid-value">Nenhum</p></td> </tr></tbody></table>

O tipo de chave `SECRET`, disponível a partir do MySQL 8.0.19, é destinado ao armazenamento de dados sensíveis para uso geral usando o chaveiro MySQL e é suportado pela maioria dos componentes do chaveiro e dos plugins do chaveiro. O chaveiro criptografa e descriptografa os dados `SECRET` como um fluxo de bytes durante o armazenamento e a recuperação.

Exemplos de operações de chave de identificação envolvendo o tipo de chave `SECRET`:

```
SELECT keyring_key_generate('MySecret1', 'SECRET', 20);
SELECT keyring_key_remove('MySecret1');

SELECT keyring_key_store('MySecret2', 'SECRET', 'MySecretData');
SELECT keyring_key_fetch('MySecret2');
SELECT keyring_key_length_fetch('MySecret2');
SELECT keyring_key_type_fetch('MySecret2');
SELECT keyring_key_remove('MySecret2');
```

#### 8.4.4.14 Migrando Chaves entre Keystores do Keyring

Uma migração de chave de trava copia as chaves de uma chave de armazenamento para outra, permitindo que um DBA mude uma instalação do MySQL para um outro chave de armazenamento. Uma operação de migração bem-sucedida tem este resultado:

* A chave de destino do cofre de chaves contém as chaves que tinha antes da migração, além das chaves do cofre de chaves de origem.

* A chave de origem do cofre de segurança permanece a mesma antes e depois da migração (porque as chaves são copiadas, não movidas).

Se uma chave a ser copiada já existir no keystore de destino, ocorrerá um erro e o keystore de destino será restaurado ao seu estado pré-migração.

O chaveiro gerencia lojas de chave usando componentes de chaveiro e plugins de chaveiro. Isso se refere à estratégia de migração, porque a maneira como as lojas de chave de origem e destino são gerenciadas determina se um determinado tipo de migração de chave é possível e o procedimento para executá-la:

* Migração de um plug-in de chave de segurança para outro: O servidor MySQL possui um modo operacional que oferece essa capacidade.

* Migração de um plugin de chave de segurança para um componente de chave de segurança: O servidor MySQL tem um modo operacional que oferece essa capacidade a partir do MySQL 8.0.24.

* Migração de um componente de chave de segurança para outro: O utilitário **mysql_migrate_keyring** oferece essa capacidade. **mysql_migrate_keyring** está disponível a partir do MySQL 8.0.24.

* Migração de um componente de chave de segurança para um plugin de chave de segurança: Não há previsão para essa capacidade.

As seções a seguir discutem as características das migrações offline e online e descrevem como realizar as migrações.

* Migração de Chave Offline e Online
* Migração de Chave Usando um Servidor de Migração
* Migração de Chave Usando o utilitário mysql_migrate_keyring
* Migração de Chave que envolve múltiplos servidores em execução

Migrações de chave offline e online #####

Uma migração chave está offline ou online:

* Migração off-line: Para uso quando você tem certeza de que nenhum servidor em execução no host local está usando o keystore de origem ou destino. Neste caso, a operação de migração pode copiar as chaves do keystore de origem para o destino sem a possibilidade de um servidor em execução modificar o conteúdo do keystore durante a operação.

* Migração online: Para uso quando um servidor em execução no host local está usando o keystore de origem. Nesse caso, é necessário tomar cuidado para evitar que o servidor atualize os keystores durante a migração. Isso envolve se conectar ao servidor em execução e instruí-lo a pausar as operações do keyring para que as chaves possam ser copiadas com segurança do keystore de origem para o destino. Quando a cópia de chaves estiver concluída, o servidor em execução é autorizado a retomar as operações do keyring.

Quando planeja uma migração chave, use esses pontos para decidir se ela deve ser offline ou online:

* Não realize migração offline que envolva uma chave de armazenamento que esteja sendo usada por um servidor em execução.

* A interrupção das operações do chaveiro durante uma migração online é realizada conectando-se ao servidor em execução e definindo sua variável de sistema global `keyring_operations` para `OFF` antes da cópia da chave e `ON` após a cópia da chave. Isso tem várias implicações:

+ `keyring_operations` foi introduzido no MySQL 5.7.21, portanto, a migração online é possível apenas se o servidor em execução for do MySQL 5.7.21 ou superior. Se o servidor em execução for mais antigo, você deve interromper, realizar uma migração off-line e reiniciá-lo. Todas as instruções de migração em outros lugares que se referem a `keyring_operations` estão sujeitas a essa condição.

+ A conta usada para se conectar ao servidor em execução deve ter os privilégios necessários para modificar `keyring_operations`. Esses privilégios são `ENCRYPTION_KEY_ADMIN`, além de `SYSTEM_VARIABLES_ADMIN` ou o privilégio obsoleto `SUPER`.

+ Se uma operação de migração online sair anormalmente (por exemplo, se for encerrada forçadamente), é possível que o `keyring_operations` permaneça desativado no servidor em execução, deixando-o incapaz de realizar operações de chave. Neste caso, pode ser necessário se conectar ao servidor em execução e habilitar o `keyring_operations` manualmente usando esta declaração:

    ```
    SET GLOBAL keyring_operations = ON;
    ```

* A migração de chave online permite pausar operações de chaveiros em um único servidor em execução. Para realizar uma migração se vários servidores em execução estão usando as lojas de chaveiros envolvidas, use o procedimento descrito em Migração de chave envolvendo vários servidores em execução.

##### Chave de Migração Usando um Servidor de Migração

Nota

A migração de chave online usando um servidor de migração só é suportada se o servidor em execução permitir conexões de soquete ou conexões TCP/IP usando TLS; não é suportada quando, por exemplo, o servidor está em execução em uma plataforma Windows e só permite conexões de memória compartilhada.

Um servidor MySQL se torna um servidor de migração se for invocado em um modo operacional especial que suporta migração de chaves. Um servidor de migração não aceita conexões de clientes. Em vez disso, ele funciona apenas por tempo suficiente para migrar as chaves e, em seguida, sai. Um servidor de migração relata erros para o console (a saída padrão de erro).

Um servidor de migração suporta esses tipos de migração:

* Migração de um plugin de chave de segurança para outro. * Migração de um plugin de chave de segurança para um componente de chave de segurança. Essa capacidade está disponível a partir do MySQL 8.0.24. Servidores mais antigos só suportam migração de um plugin de chave de segurança para outro, nesse caso, as partes dessas instruções que se referem a componentes de chave de segurança não se aplicam.

Um servidor de migração não suporta migração de um componente de chave para outro. Para esse tipo de migração, consulte Migração de chave usando o utilitário mysql_migrate_keyring.

Para realizar uma operação de migração de chave usando um servidor de migração, determine as opções de migração de chave necessárias para especificar quais plugins ou componentes do conjunto de chaves estão envolvidos e se a migração é offline ou online:

* Para indicar o plug-in de chave de segurança de origem e o plug-in ou componente de chave de segurança de destino, especifique essas opções:

+ `--keyring-migration-source`: O plugin de chave de origem que gerencia as chaves a serem migradas.

+ `--keyring-migration-destination`: O plug-in ou componente do chaveiro de destino para o qual as chaves migradas devem ser copiadas.

+ `--keyring-migration-to-component`: Esta opção é necessária se o destino for um componente de chave de segurança em vez de um plugin de chave de segurança.

As opções `--keyring-migration-source` e `--keyring-migration-destination` indicam ao servidor que ele deve executar no modo de migração de chave. Para operações de migração de chave, ambas as opções são obrigatórias. Cada plugin ou componente é especificado usando o nome do arquivo da biblioteca, incluindo qualquer extensão específica da plataforma, como `.so` ou `.dll`. A fonte e o destino devem ser diferentes, e o servidor de migração deve suportá-los.

* Para uma migração off-line, não são necessárias opções adicionais de migração de chave.

* Para uma migração online, alguns servidores em execução atualmente estão usando o keystore de origem ou destino. Para invocar o servidor de migração, especifique opções adicionais de migração de chave que indiquem como se conectar ao servidor em execução. Isso é necessário para que o servidor de migração possa se conectar ao servidor em execução e dizer-lhe para pausar o uso do chaveiro durante a operação de migração.

O uso de qualquer uma das seguintes opções indica uma migração online:

+ `--keyring-migration-host`: O host onde o servidor em execução está localizado. Este é sempre o host local, pois o servidor de migração pode migrar chaves apenas entre cofres de chave gerenciados por plugins e componentes locais.

+ `--keyring-migration-user`, `--keyring-migration-password`: As credenciais da conta a serem usadas para se conectar ao servidor em execução.

+ `--keyring-migration-port`: Para conexões TCP/IP, o número de porta para se conectar no servidor em execução.

+ `--keyring-migration-socket`: Para conexões de arquivo de socket Unix ou tubos nomeados do Windows, o arquivo de socket ou o tubo nomeado para se conectar no servidor em execução.

Para obter informações adicionais sobre as opções de migração principais, consulte a Seção 8.4.4.18, “Opções de comando do Keychain”.

Inicie o servidor de migração com as principais opções de migração, indicando as lojas de chaves de origem e destino e se a migração é offline ou online, possivelmente com outras opções. Mantenha as seguintes considerações em mente:

* Pode ser necessário outros parâmetros de servidor, como os parâmetros de configuração para os dois plugins de chave de segurança. Por exemplo, se `keyring_file` é a fonte ou destino, você deve definir a variável de sistema `keyring_file_data` se o local do arquivo de dados da chave de segurança não for o local padrão. Outras opções não relacionadas à chave de segurança também podem ser necessárias. Uma maneira de especificar essas opções é usando `--defaults-file` para nomear um arquivo de opção que contenha as opções necessárias.

+ O servidor de migração não deve iniciar com seu próprio chaveiro. Isso significa que `--defaults-file` não deve apontar para o mesmo arquivo de opções que é usado para iniciar o servidor em execução, se ele contiver uma linha como `early-plugin-load=keyring_file.so`. Em vez disso, ele deve apontar para um arquivo separado que contenha apenas opções relevantes para a migração.

+ Se você estiver migrando de um plugin para um componente, o arquivo de manifesto do componente (`mysqld.my`) não deve estar presente no diretório `bin`. Embora, a configuração do componente (por exemplo, `component_keyring_file.cnf` no diretório do plugin) deve estar presente no diretório `bin`, para que o novo chaveiro possa ser preenchido. Após a migração ser concluída, adicione o arquivo de manifesto ao diretório e reinicie o servidor MySQL, para que o servidor comece a usar o novo chaveiro.

* O servidor de migração espera que os valores das opções de nome de caminho sejam caminhos completos. Os nomes de caminho relativos podem não ser resolvidos conforme o esperado.

* O usuário que invoca um servidor no modo de migração de chave não deve ser o usuário do sistema operacional `root`, a menos que a opção `--user` seja especificada com um nome de usuário que não seja `root` para executar o servidor como esse usuário.

* O usuário que executa um servidor no modo de migração de chave deve ter permissão para ler e escrever qualquer arquivo de chave local, como o arquivo de dados de um plugin baseado em arquivos.

Se você invocar o servidor de migração a partir de uma conta de sistema diferente daquela normalmente usada para executar o MySQL, ele pode criar diretórios ou arquivos de chaveiros que não serão acessíveis ao servidor durante o funcionamento normal. Suponha que o **mysqld** normalmente execute como o usuário do sistema operacional `mysql`, mas você invoque o servidor de migração enquanto estiver conectado como `isabel`. Quaisquer novos diretórios ou arquivos criados pelo servidor de migração são de propriedade de `isabel`. O início subsequente falha quando um servidor executado como o usuário do sistema operacional `mysql` tenta acessar objetos do sistema de arquivos de propriedade de `isabel`.

Para evitar esse problema, inicie o servidor de migração como usuário do sistema operacional `root` e forneça uma opção `--user=user_name`, onde *`user_name`* é a conta do sistema normalmente usada para executar o MySQL. Alternativamente, após a migração, examine os objetos do sistema de arquivos relacionados ao chaveiro e mude sua propriedade e permissões, se necessário, usando **chown**, **chmod** ou comandos semelhantes, para que os objetos sejam acessíveis ao servidor em execução.

Exemplo de linha de comando para migração offline entre dois plugins de chave: digite o comando em uma única linha.

```
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-source=keyring_file.so
  --keyring-migration-destination=keyring_encrypted_file.so
  --keyring_encrypted_file_password=password
```

Exemplo de linha de comando para migração online entre dois plugins de chave:

```
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-source=keyring_file.so
  --keyring-migration-destination=keyring_encrypted_file.so
  --keyring_encrypted_file_password=password
  --keyring-migration-host=127.0.0.1
  --keyring-migration-user=root
  --keyring-migration-password=root_password
```

Para realizar uma migração quando o destino é um componente de chave de segurança em vez de um plugin de chave de segurança, especifique a opção `--keyring-migration-to-component` e nomeie o componente como o valor da opção `--keyring-migration-destination`.

Exemplo de linha de comando para migração offline de um plugin de chave de segurança para um componente de chave de segurança:

```
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-to-component
  --keyring-migration-source=keyring_file.so
  --keyring-migration-destination=component_keyring_encrypted_file.so
```

Observe que, neste caso, nenhum valor de `keyring_encrypted_file_password` é especificado. A senha para o arquivo de dados do componente está listada no arquivo de configuração do componente.

Exemplo de linha de comando para migração online de um plugin de chave de segurança para um componente de chave de segurança:

```
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-to-component
  --keyring-migration-source=keyring_file.so
  --keyring-migration-destination=component_keyring_encrypted_file.so
  --keyring-migration-host=127.0.0.1
  --keyring-migration-user=root
  --keyring-migration-password=root_password
```

O servidor de migração principal realiza uma operação de migração da seguinte forma:

1. (Apenas migração online) Conecte-se ao servidor em execução usando as opções de conexão.

2. (Apenas migração online) Desative `keyring_operations` no servidor em execução.

3. Carregue as bibliotecas de plugins/componentes de chave para as lojas de chave de origem e destino.

4. Copie as chaves do keystore de origem para o destino. 5. Descarregue as bibliotecas de plugins/componentes do keystore de origem e do keystore de destino.

6. (Apenas migração online) Ative `keyring_operations` no servidor em execução.

7. (Apenas migração online) Desconecte do servidor em execução.

Se ocorrer um erro durante a migração de chaves, a chave de destino é restaurada ao seu estado pré-migração.

Após uma operação bem-sucedida de migração de chave online, o servidor em execução pode precisar ser reiniciado:

* Se o servidor em execução estava usando o keystore de origem antes da migração e deve continuar a usá-lo após a migração, ele não precisa ser reiniciado após a migração.

* Se o servidor em execução estava usando o keystore de destino antes da migração e deve continuar a usá-lo após a migração, ele deve ser reiniciado após a migração para carregar todas as chaves migradas para o keystore de destino.

* Se o servidor em execução estava usando o keystore de origem antes da migração, mas deve usar o keystore de destino após a migração, ele deve ser reconfigurado para usar o keystore de destino e reiniciado. Neste caso, esteja ciente de que, embora o servidor em execução esteja parado de modificar o keystore de origem durante a própria migração, ele não está parado durante o intervalo entre a migração e o subsequente reinício. Deve-se ter cuidado para que o servidor não modifique o keystore de origem durante esse intervalo, porque quaisquer alterações não serão refletidas no keystore de destino.

##### Chave de migração Usando a Ferramenta mysql_migrate_keyring

O utilitário **mysql_migrate_keyring** migra as chaves de um componente de chave para outro. Ele não suporta migrações que envolvem plugins de chave. Para esse tipo de migração, use um servidor MySQL que esteja operando no modo de migração de chave; veja Migração de chave usando um servidor de migração.

Para realizar uma operação de migração de chave usando **mysql_migrate_keyring**, determine as opções de migração de chave necessárias para especificar quais componentes do chaveiro estão envolvidos e se a migração é offline ou online:

* Para indicar os componentes do chaveiro de origem e destino e sua localização, especifique essas opções:

+ `--source-keyring`: O componente de chave de origem que gerencia as chaves a serem migradas.

+ `--destination-keyring`: O componente do chaveiro de destino para o qual as chaves migradas devem ser copiadas.

+ `--component-dir`: O diretório que contém os arquivos da biblioteca de componentes do chaveiro. Geralmente, esse é o valor da variável de sistema `plugin_dir` do servidor MySQL local.

Todas as três opções são obrigatórias. Cada nome de componente do chaveiro é o nome de um arquivo de biblioteca de componentes especificado sem qualquer extensão específica da plataforma, como `.so` ou `.dll`. Por exemplo, para usar o componente para o qual o arquivo de biblioteca é `component_keyring_file.so`, especifique a opção como `--source-keyring=component_keyring_file`. A fonte e o destino devem ser diferentes, e o **mysql_migrate_keyring** deve suportar ambos.

* Para uma migração off-line, não são necessárias opções adicionais.

* Para uma migração online, alguns servidores em execução atualmente estão usando o keystore de origem ou destino. Neste caso, especifique a opção `--online-migration` para indicar uma migração online. Além disso, especifique as opções de conexão, indicando como se conectar ao servidor em execução, para que o **mysql_migrate_keyring** possa conectá-lo e dizer que deve pausar o uso do keyring durante a operação de migração.

A opção `--online-migration` é comumente usada em conjunto com opções de conexão, como estas:

+ `--host`: O host onde o servidor em execução está localizado. Este é sempre o host local, porque o **mysql_migrate_keyring** pode migrar chaves apenas entre keystores gerenciados por componentes locais.

+ `--user`, `--password`: As credenciais da conta a serem usadas para se conectar ao servidor em execução.

+ `--port`: Para conexões TCP/IP, o número de porta para se conectar no servidor em execução.

+ `--socket`: Para conexões de arquivo de socket Unix ou tubos nomeados do Windows, o arquivo de socket ou o tubo nomeado para se conectar no servidor em execução.

Para descrições de todas as opções disponíveis, consulte a Seção 6.6.8, “mysql_migrate_keyring — Ferramenta de migração de chave do Keyring”.

Inicie o **mysql_migrate_keyring** com opções que indiquem os keystores de origem e destino e se a migração é offline ou online, possivelmente com outras opções. Mantenha as seguintes considerações em mente:

* O usuário que invoca **mysql_migrate_keyring** não deve ser o usuário do sistema operacional `root`.

* O usuário que invoca **mysql_migrate_keyring** deve ter permissão para ler e escrever qualquer arquivo de chave local, como o arquivo de dados de um plugin baseado em arquivos.

Se você invocar **mysql_migrate_keyring** a partir de uma conta de sistema diferente daquela normalmente usada para executar o MySQL, isso pode criar diretórios ou arquivos de chaveiro inacessíveis ao servidor durante o funcionamento normal. Suponha que o **mysqld** normalmente execute como o usuário do sistema operacional `mysql`, mas você invoque **mysql_migrate_keyring** enquanto estiver conectado como `isabel`. Quaisquer novos diretórios ou arquivos criados pelo **mysql_migrate_keyring** são de propriedade de `isabel`. O início subsequente falha quando um servidor executado como o usuário do sistema operacional `mysql` tenta acessar objetos do sistema de arquivos de propriedade de `isabel`.

Para evitar esse problema, invoque o **mysql_migrate_keyring** como o usuário do sistema operacional `mysql`. Alternativamente, após a migração, examine os objetos do sistema de arquivos relacionados ao chaveiro e mude sua propriedade e permissões, se necessário, usando **chown**, **chmod** ou comandos semelhantes, para que os objetos sejam acessíveis ao servidor em execução.

Suponha que você queira migrar as chaves de `component_keyring_file` para `component_keyring_encrypted_file`, e que o servidor local armazene seus arquivos de biblioteca de componentes de chave em `/usr/local/mysql/lib/plugin`.

Se nenhum servidor em execução estiver usando o chaveiro, uma migração off-line é permitida. Inicie o **mysql_migrate_keyring** da seguinte forma (entre no comando em uma única linha):

```
mysql_migrate_keyring
  --component-dir=/usr/local/mysql/lib/plugin
  --source-keyring=component_keyring_file
  --destination-keyring=component_keyring_encrypted_file
```

Se um servidor em execução estiver usando o chaveiro, você deve realizar uma migração online. Nesse caso, a opção `--online-migration` deve ser fornecida, juntamente com quaisquer opções de conexão necessárias para especificar qual servidor conectar e qual conta do MySQL usar.

O comando a seguir realiza uma migração online. Ele se conecta ao servidor local usando uma conexão TCP/IP e a conta `admin`. O comando solicita uma senha, que você deve inserir quando solicitado:

```
mysql_migrate_keyring
  --component-dir=/usr/local/mysql/lib/plugin
  --source-keyring=component_keyring_file
  --destination-keyring=component_keyring_encrypted_file
  --online-migration --host=127.0.0.1 --user=admin --password
```

**mysql_migrate_keyring** realiza uma operação de migração da seguinte forma:

1. (Apenas migração online) Conecte-se ao servidor em execução usando as opções de conexão.

2. (Apenas migração online) Desative `keyring_operations` no servidor em execução.

3. Carregue as bibliotecas de componentes de chaveiros de origem e destino.

4. Copie as chaves do keystore de origem para o destino. 5. Descarregue as bibliotecas de componentes do keyring para os keystores de origem e destino.

6. (Apenas migração online) Ative `keyring_operations` no servidor em execução.

7. (Apenas migração online) Desconecte do servidor em execução.

Se ocorrer um erro durante a migração de chaves, a chave de destino é restaurada ao seu estado pré-migração.

Após uma operação bem-sucedida de migração de chave online, o servidor em execução pode precisar ser reiniciado:

* Se o servidor em execução estava usando o keystore de origem antes da migração e deve continuar a usá-lo após a migração, ele não precisa ser reiniciado após a migração.

* Se o servidor em execução estava usando o keystore de destino antes da migração e deve continuar a usá-lo após a migração, ele deve ser reiniciado após a migração para carregar todas as chaves migradas para o keystore de destino.

* Se o servidor em execução estava usando o keystore de origem antes da migração, mas deve usar o keystore de destino após a migração, ele deve ser reconfigurado para usar o keystore de destino e reiniciado. Neste caso, esteja ciente de que, embora o servidor em execução esteja parado de modificar o keystore de origem durante a própria migração, ele não está parado durante o intervalo entre a migração e o subsequente reinício. Deve-se ter cuidado para que o servidor não modifique o keystore de origem durante esse intervalo, porque quaisquer alterações não serão refletidas no keystore de destino.

##### Chave de Migração que envolve múltiplos servidores em execução

A migração de chave online permite pausar operações de chaveiros em um único servidor em execução. Para realizar uma migração se vários servidores em execução estão usando as lojas de chave envolvidas, use este procedimento:

1. Conecte-se manualmente a cada servidor em execução e defina `keyring_operations=OFF`. Isso garante que nenhum servidor em execução esteja usando o keystore de origem ou destino e atende à condição necessária para migração off-line.

2. Use um servidor de migração ou **mysql_migrate_keyring** para realizar uma migração de chave off-line para cada servidor em pausa.

3. Conecte-se manualmente a cada servidor em execução e defina `keyring_operations=ON`.

Todos os servidores em execução devem suportar a variável de sistema `keyring_operations`. Qualquer servidor que não o faça deve ser parado antes da migração e reiniciado depois.

#### 8.4.4.15 Funções de gestão de chaves de chave de porta-chaves para uso geral

O MySQL Server suporta um serviço de chave de segurança que permite que componentes internos e plugins armazenem informações sensíveis de forma segura para recuperação posterior.

O MySQL Server também inclui uma interface SQL para gerenciamento de chaves de chaveiros, implementada como um conjunto de funções de propósito geral que acessam as capacidades fornecidas pelo serviço interno de chaveiros. As funções de chaveiros estão contidas em um arquivo de biblioteca de plugins, que também contém um plugin `keyring_udf` que deve ser habilitado antes da invocação da função. Para que essas funções sejam usadas, um plugin de chaveiro, como `keyring_file` ou `keyring_okv`, ou um componente de chaveiro, como `component_keyring_file` ou `component_keyring_encrypted_file`, deve ser habilitado.

As funções descritas aqui são de propósito geral e destinadas ao uso com qualquer componente ou plugin do chaveiro. Um componente ou plugin de chaveiro específico pode também fornecer funções próprias que são destinadas ao uso apenas com esse componente ou plugin; veja Seção 8.4.4.16, “Funções de Gestão de Chaves Específicas do Chaveiro do Plugin”.

As seções a seguir fornecem instruções de instalação para as funções do chaveiro e demonstram como usá-las. Para informações sobre as funções do serviço de chaveiro invocadas por essas funções, consulte a Seção 7.6.9.2, “O Serviço de Chaveiro”. Para informações gerais sobre o chaveiro, consulte a Seção 8.4.4, “O Keyring MySQL”.

* Instalar ou desinstalar funções de chaveiro de uso geral
* Usar funções de chaveiro de uso geral
* Referência da função de chaveiro de uso geral

##### Instalar ou desinstalar funções de chaveiro de uso geral

Esta seção descreve como instalar ou desinstalar as funções do chaveiro, que são implementadas em um arquivo de biblioteca de plugins que também contém um plugin `keyring_udf`. Para informações gerais sobre como instalar ou desinstalar plugins e funções carregáveis, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”, e a Seção 7.7.1, “Instalando e Desinstalando Funções Carregáveis”.

As funções do chaveiro permitem operações de gerenciamento de chaves do chaveiro, mas o plugin `keyring_udf` também deve ser instalado, pois as funções não funcionam corretamente sem ele. As tentativas de usar as funções sem o plugin `keyring_udf` resultam em um erro.

Para ser utilizável pelo servidor, o arquivo da biblioteca de plugins deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin, definindo o valor de `plugin_dir` na inicialização do servidor.

O nome de arquivo da biblioteca de plugins é `keyring_udf`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para instalar o plugin `keyring_udf` e as funções do chaveiro, use as declarações `INSTALL PLUGIN` e (install-plugin.html "15.7.4.4 INSTALL PLUGIN Statement") e `CREATE FUNCTION` e (create-function.html "15.1.14 CREATE FUNCTION Statement") e ajuste o sufixo `.so` para sua plataforma conforme necessário:

```
INSTALL PLUGIN keyring_udf SONAME 'keyring_udf.so';
CREATE FUNCTION keyring_key_generate RETURNS INTEGER
  SONAME 'keyring_udf.so';
CREATE FUNCTION keyring_key_fetch RETURNS STRING
  SONAME 'keyring_udf.so';
CREATE FUNCTION keyring_key_length_fetch RETURNS INTEGER
  SONAME 'keyring_udf.so';
CREATE FUNCTION keyring_key_type_fetch RETURNS STRING
  SONAME 'keyring_udf.so';
CREATE FUNCTION keyring_key_store RETURNS INTEGER
  SONAME 'keyring_udf.so';
CREATE FUNCTION keyring_key_remove RETURNS INTEGER
  SONAME 'keyring_udf.so';
```

Se o plugin e as funções forem utilizados em um servidor de replicação de origem, instale-os em todas as réplicas também para evitar problemas de replicação.

Uma vez instalado, conforme descrito anteriormente, o plugin e as funções permanecem instalados até serem desinstalados. Para removê-los, use as declarações `UNINSTALL PLUGIN` e `DROP FUNCTION`:

```
UNINSTALL PLUGIN keyring_udf;
DROP FUNCTION keyring_key_generate;
DROP FUNCTION keyring_key_fetch;
DROP FUNCTION keyring_key_length_fetch;
DROP FUNCTION keyring_key_type_fetch;
DROP FUNCTION keyring_key_store;
DROP FUNCTION keyring_key_remove;
```

##### Usando as funções do cartela de identificação de uso geral

Antes de usar as funções do bloco de teclas de uso geral, instale-as de acordo com as instruções fornecidas em Instalar ou Desinstalar Funções de Bloco de Teclas de Uso Geral.

As funções do chaveiro estão sujeitas a essas restrições:

* Para usar qualquer função do chaveiro, o plugin `keyring_udf` deve estar habilitado. Caso contrário, ocorrerá um erro:

  ```
  ERROR 1123 (HY000): Can't initialize function 'keyring_key_generate';
  This function requires keyring_udf plugin which is not installed.
  Please install
  ```

Para instalar o plugin `keyring_udf`, consulte a instalação ou desinstalação das funções de chave de propósito geral.

* As funções do chaveiro invocam funções do serviço de chaveiro (consulte a Seção 7.6.9.2, “O Serviço de Chaveiro”). As funções do serviço, por sua vez, utilizam qualquer plugin de chaveiro instalado (por exemplo, `keyring_file` ou `keyring_okv`). Portanto, para usar qualquer função do chaveiro, algum plugin de chaveiro subjacente deve estar habilitado. Caso contrário, ocorre um erro:

  ```
  ERROR 3188 (HY000): Function 'keyring_key_generate' failed because
  underlying keyring service returned an error. Please check if a
  keyring plugin is installed and that provided arguments are valid
  for the keyring you are using.
  ```

Para instalar um plugin de chave, consulte a Seção 8.4.4.3, “Instalação de Plugin de Chave”.

* Um usuário deve possuir o privilégio global `EXECUTE` para usar qualquer função de chave. Caso contrário, ocorre um erro:

  ```
  ERROR 1123 (HY000): Can't initialize function 'keyring_key_generate';
  The user is not privileged to execute this function. User needs to
  have EXECUTE
  ```

Para conceder o privilégio global `EXECUTE` a um usuário, use esta declaração:

  ```
  GRANT EXECUTE ON *.* TO user;
  ```

Como alternativa, se você preferir evitar conceder o privilégio global `EXECUTE`, permitindo ainda que os usuários acessem operações específicas de gerenciamento de chaves, programas armazenados "wrapper" podem ser definidos (uma técnica descrita mais tarde nesta seção).

* Uma chave armazenada no chaveiro por um usuário específico pode ser manipulada posteriormente apenas pelo mesmo usuário. Isso significa que o valor da função `CURRENT_USER()` no momento da manipulação da chave deve ter o mesmo valor do momento em que a chave foi armazenada no chaveiro. (Essa restrição exclui o uso das funções do chaveiro para manipulação de chaves de nível de instância, como as criadas por `InnoDB` para suportar a criptografia de tablespace.)

Para permitir que vários usuários realizem operações na mesma chave, programas armazenados em "wrapper" podem ser definidos (uma técnica descrita mais adiante nesta seção).

* As funções do cartela de identificação suportam os tipos e comprimentos de chave suportados pelo plugin de cartela de identificação subjacente. Para informações sobre chaves específicas de um plugin de cartela de identificação em particular, consulte a Seção 8.4.4.13, “Tipos e comprimentos de chave de cartela de identificação suportados”.

Para criar uma nova chave aleatória e armazená-la no chaveiro, chame `keyring_key_generate()`, passando a ele um ID para a chave, juntamente com o tipo de chave (método de criptografia) e seu comprimento em bytes. O seguinte chamado cria uma chave criptografada DSA de 2.048 bits chamada `MyKey`:

```
mysql> SELECT keyring_key_generate('MyKey', 'DSA', 256);
+-------------------------------------------+
| keyring_key_generate('MyKey', 'DSA', 256) |
+-------------------------------------------+
|                                         1 |
+-------------------------------------------+
```

Um valor de retorno de 1 indica sucesso. Se a chave não puder ser criada, o valor de retorno é `NULL` e ocorre um erro. Uma das razões para isso pode ser que o plugin de chave subjacente não suporte a combinação especificada de tipo de chave e comprimento da chave; veja Seção 8.4.4.13, “Tipos e comprimentos de chave do chaveiro suportados”.

Para poder verificar o tipo de retorno, independentemente de ocorrer um erro, use `SELECT ... INTO @var_name` e teste o valor da variável:

```
mysql> SELECT keyring_key_generate('', '', -1) INTO @x;
ERROR 3188 (HY000): Function 'keyring_key_generate' failed because
underlying keyring service returned an error. Please check if a
keyring plugin is installed and that provided arguments are valid
for the keyring you are using.
mysql> SELECT @x;
+------+
| @x   |
+------+
| NULL |
+------+
mysql> SELECT keyring_key_generate('x', 'AES', 16) INTO @x;
mysql> SELECT @x;
+------+
| @x   |
+------+
|    1 |
+------+
```

Essa técnica também se aplica a outras funções do chaveiro que, em caso de falha, retornam um valor e um erro.

O ID passado para `keyring_key_generate()` fornece um meio pelo qual se pode referir à chave em chamadas subsequentes de funções. Por exemplo, use o ID da chave para recuperar seu tipo como uma string ou seu comprimento em bytes como um inteiro:

```
mysql> SELECT keyring_key_type_fetch('MyKey');
+---------------------------------+
| keyring_key_type_fetch('MyKey') |
+---------------------------------+
| DSA                             |
+---------------------------------+
mysql> SELECT keyring_key_length_fetch('MyKey');
+-----------------------------------+
| keyring_key_length_fetch('MyKey') |
+-----------------------------------+
|                               256 |
+-----------------------------------+
```

Para recuperar um valor de chave, passe o ID da chave para `keyring_key_fetch()`. O exemplo a seguir usa `HEX()` para exibir o valor da chave, pois ele pode conter caracteres não imprimíveis. O exemplo também usa uma chave curta para brevidade, mas esteja ciente de que chaves mais longas oferecem melhor segurança:

```
mysql> SELECT keyring_key_generate('MyShortKey', 'DSA', 8);
+----------------------------------------------+
| keyring_key_generate('MyShortKey', 'DSA', 8) |
+----------------------------------------------+
|                                            1 |
+----------------------------------------------+
mysql> SELECT HEX(keyring_key_fetch('MyShortKey'));
+--------------------------------------+
| HEX(keyring_key_fetch('MyShortKey')) |
+--------------------------------------+
| 1DB3B0FC3328A24C                     |
+--------------------------------------+
```

As funções de chaveira tratam os IDs, tipos e valores das chaves como strings binárias, portanto, as comparações são sensíveis ao caso. Por exemplo, os IDs de `MyKey` e `mykey` referem-se a chaves diferentes.

Para remover uma chave, passe o ID da chave para `keyring_key_remove()`:

```
mysql> SELECT keyring_key_remove('MyKey');
+-----------------------------+
| keyring_key_remove('MyKey') |
+-----------------------------+
|                           1 |
+-----------------------------+
```

Para ofuscar e armazenar uma chave que você fornece, passe o ID da chave, o tipo e o valor para `keyring_key_store()`:

```
mysql> SELECT keyring_key_store('AES_key', 'AES', 'Secret string');
+------------------------------------------------------+
| keyring_key_store('AES_key', 'AES', 'Secret string') |
+------------------------------------------------------+
|                                                    1 |
+------------------------------------------------------+
```

Como indicado anteriormente, um usuário deve ter o privilégio global `EXECUTE` para chamar funções de chaveiro, e o usuário que armazena uma chave no chaveiro inicialmente deve ser o mesmo usuário que realiza operações subsequentes na chave posteriormente, conforme determinado pelo valor `CURRENT_USER()` em vigor para cada chamada de função. Para permitir operações de chave a usuários que não têm o privilégio global `EXECUTE` ou que podem não ser o "proprietário" da chave, use essa técnica:

1. Defina programas armazenados "wrapper" que encapsulam as operações necessárias e têm um valor `DEFINER` igual ao do proprietário da chave.

2. Conceda o privilégio `EXECUTE` para programas armazenados específicos aos usuários individuais que devem ser capazes de invocá-los.

3. Se as operações implementadas pelos programas armazenados pelo wrapper não incluem a criação de chaves, crie as chaves necessárias com antecedência, usando a conta denominada como `DEFINER` nas definições dos programas armazenados.

Essa técnica permite que as chaves sejam compartilhadas entre os usuários e oferece aos administradores de banco de dados um controle mais detalhado sobre quem pode fazer o que com as chaves, sem precisar conceder privilégios globais.

O exemplo a seguir mostra como configurar uma chave compartilhada denominada `SharedKey` que pertence ao DBA e uma função armazenada `get_shared_key()` que fornece acesso ao valor atual da chave. O valor pode ser recuperado por qualquer usuário com o privilégio `EXECUTE` para essa função, que é criada no esquema `key_schema`.

A partir de uma conta administrativa do MySQL (`'root'@'localhost'` neste exemplo), crie o esquema administrativo e a função armazenada para acessar a chave:

```
mysql> CREATE SCHEMA key_schema;

mysql> CREATE DEFINER = 'root'@'localhost'
       FUNCTION key_schema.get_shared_key()
       RETURNS BLOB READS SQL DATA
       RETURN keyring_key_fetch('SharedKey');
```

Na conta administrativa, certifique-se de que a chave compartilhada existe:

```
mysql> SELECT keyring_key_generate('SharedKey', 'DSA', 8);
+---------------------------------------------+
| keyring_key_generate('SharedKey', 'DSA', 8) |
+---------------------------------------------+
|                                           1 |
+---------------------------------------------+
```

Do aplicativo administrativo, crie uma conta de usuário comum à qual o acesso chave será concedido:

```
mysql> CREATE USER 'key_user'@'localhost'
       IDENTIFIED BY 'key_user_pwd';
```

A partir da conta `key_user`, verifique se, sem o devido privilégio `EXECUTE`, a nova conta não pode acessar a chave compartilhada:

```
mysql> SELECT HEX(key_schema.get_shared_key());
ERROR 1370 (42000): execute command denied to user 'key_user'@'localhost'
for routine 'key_schema.get_shared_key'
```

Na conta administrativa, conceda `EXECUTE` a `key_user` para a função armazenada:

```
mysql> GRANT EXECUTE ON FUNCTION key_schema.get_shared_key
       TO 'key_user'@'localhost';
```

A partir da conta `key_user`, verifique se a chave agora está acessível:

```
mysql> SELECT HEX(key_schema.get_shared_key());
+----------------------------------+
| HEX(key_schema.get_shared_key()) |
+----------------------------------+
| 9BAFB9E75CEEB013                 |
+----------------------------------+
```

##### Referência da função de chaveiro para uso geral

Para cada função do bloco de teclas de propósito geral, esta seção descreve seu propósito, sequência de chamada e valor de retorno. Para informações sobre as condições sob as quais essas funções podem ser invocadas, consulte o uso de funções do bloco de teclas de propósito geral.

* `keyring_key_fetch(key_id)`

Dado um ID chave, desobfusa e retorna o valor da chave.

Argumentos:

+ *`key_id`*: Uma cadeia que especifica o ID da chave.

Valor de retorno:

Retorna o valor da chave como uma string para sucesso, `NULL` se a chave não existir, ou `NULL` e um erro para falha.

Nota

Os valores-chave recuperados usando `keyring_key_fetch()` estão sujeitos aos limites gerais da função de chave de registro descritos na Seção 8.4.4.13, “Tipos e comprimentos de chave de registro suportados”. Um valor-chave mais longo que esse comprimento pode ser armazenado usando uma função de serviço de chave de registro (consulte Seção 7.6.9.2, “O serviço de chave de registro”), mas se recuperado usando `keyring_key_fetch()`, é truncado até o limite da função de chave de registro geral.

Exemplo:

  ```
  mysql> SELECT keyring_key_generate('RSA_key', 'RSA', 16);
  +--------------------------------------------+
  | keyring_key_generate('RSA_key', 'RSA', 16) |
  +--------------------------------------------+
  |                                          1 |
  +--------------------------------------------+
  mysql> SELECT HEX(keyring_key_fetch('RSA_key'));
  +-----------------------------------+
  | HEX(keyring_key_fetch('RSA_key')) |
  +-----------------------------------+
  | 91C2253B696064D3556984B6630F891A  |
  +-----------------------------------+
  mysql> SELECT keyring_key_type_fetch('RSA_key');
  +-----------------------------------+
  | keyring_key_type_fetch('RSA_key') |
  +-----------------------------------+
  | RSA                               |
  +-----------------------------------+
  mysql> SELECT keyring_key_length_fetch('RSA_key');
  +-------------------------------------+
  | keyring_key_length_fetch('RSA_key') |
  +-------------------------------------+
  |                                  16 |
  +-------------------------------------+
  ```

O exemplo usa `HEX()` para exibir o valor da chave porque ele pode conter caracteres não imprimíveis. O exemplo também usa uma chave curta para brevidade, mas esteja ciente de que chaves mais longas oferecem melhor segurança.

* `keyring_key_generate(key_id, key_type, key_length)`(keyring-functions-general-purpose.html#function_keyring-key-generate)

Gera uma nova chave aleatória com um ID, tipo e comprimento definidos e a armazena no chaveiro. Os valores de tipo e comprimento devem ser consistentes com os valores suportados pelo plugin do chaveiro subjacente. Consulte a Seção 8.4.4.13, “Tipos e comprimentos de chave suportados no chaveiro”.

Argumentos:

+ *`key_id`*: Uma cadeia que especifica o ID da chave.

+ *`key_type`*: Uma cadeia que especifica o tipo de chave.

+ *`key_length`*: Um número inteiro que especifica o comprimento da chave em bytes.

Valor de retorno:

Retorna 1 para sucesso, ou `NULL` e um erro para falha.

Exemplo:

  ```
  mysql> SELECT keyring_key_generate('RSA_key', 'RSA', 384);
  +---------------------------------------------+
  | keyring_key_generate('RSA_key', 'RSA', 384) |
  +---------------------------------------------+
  |                                           1 |
  +---------------------------------------------+
  ```

* `keyring_key_length_fetch(key_id)`

Dado um ID chave, retorna o comprimento da chave.

Argumentos:

+ *`key_id`*: Uma cadeia que especifica o ID da chave.

Valor de retorno:

Retorna o comprimento da chave em bytes como um inteiro para sucesso, `NULL` se a chave não existir, ou `NULL` e um erro para falha.

Exemplo:

Veja a descrição de `keyring_key_fetch()`.

* `keyring_key_remove(key_id)`

Remove a chave com o ID especificado do chaveiro.

Argumentos:

+ *`key_id`*: Uma cadeia que especifica o ID da chave.

Valor de retorno:

Retorna 1 para sucesso, ou `NULL` para falha.

Exemplo:

  ```
  mysql> SELECT keyring_key_remove('AES_key');
  +-------------------------------+
  | keyring_key_remove('AES_key') |
  +-------------------------------+
  |                             1 |
  +-------------------------------+
  ```

* `keyring_key_store(key_id, key_type, key)`(keyring-functions-general-purpose.html#function_keyring-key-store)

Oculta e armazena uma chave no chaveiro.

Argumentos:

+ *`key_id`*: Uma cadeia que especifica o ID da chave.

+ *`key_type`*: Uma cadeia que especifica o tipo de chave.

+ *`key`*: Uma cadeia que especifica o valor da chave.

Valor de retorno:

Retorna 1 para sucesso, ou `NULL` e um erro para falha.

Exemplo:

  ```
  mysql> SELECT keyring_key_store('new key', 'DSA', 'My key value');
  +-----------------------------------------------------+
  | keyring_key_store('new key', 'DSA', 'My key value') |
  +-----------------------------------------------------+
  |                                                   1 |
  +-----------------------------------------------------+
  ```

* `keyring_key_type_fetch(key_id)`

Dado um ID chave, retorna o tipo de chave.

Argumentos:

+ *`key_id`*: Uma cadeia que especifica o ID da chave.

Valor de retorno:

Retorna o tipo de chave como uma string para sucesso, `NULL` se a chave não existir, ou `NULL` e um erro para falha.

Exemplo:

Veja a descrição de `keyring_key_fetch()`.

#### 8.4.4.16 Funções de Gerenciamento de Chaves do Keyring Específicas ao Plugin

Para cada função específica do plug-in do chaveiro, esta seção descreve seu propósito, sequência de chamada e valor de retorno. Para informações sobre funções de gerenciamento de chaveiro de propósito geral, consulte a Seção 8.4.4.15, “Funções de Gerenciamento de Chaveiro de Propósito Geral”.

* `keyring_aws_rotate_cmk()`

Plug-in de chave associado: `keyring_aws`

`keyring_aws_rotate_cmk()` rotação da chave do AWS KMS. A rotação altera apenas a chave que o AWS KMS usa para operações subsequentes de criptografia de chave de dados. O AWS KMS mantém as versões anteriores do CMK, portanto, as chaves geradas usando CMKs anteriores permanecem descriptografáveis após a rotação.

A rotação altera o valor CMK usado dentro do AWS KMS, mas não altera a ID usada para referenciá-lo, portanto, não é necessário alterar a variável de sistema `keyring_aws_cmk_id` após a chamada de `keyring_aws_rotate_cmk()`.

Essa função requer o privilégio `SUPER`.

Argumentos:

  None.

Valor de retorno:

Retorna 1 para sucesso, ou `NULL` e um erro para falha.

* `keyring_aws_rotate_keys()`

Plug-in de chave associado: `keyring_aws`

`keyring_aws_rotate_keys()` rotação de chaves armazenadas no arquivo de armazenamento `keyring_aws` nomeado pela variável de sistema `keyring_aws_data_file`. A rotação envia cada chave armazenada no arquivo para o AWS KMS para re-encriptação usando o valor da variável de sistema `keyring_aws_cmk_id` como o valor CMK, e armazena as novas chaves criptografadas no arquivo.

`keyring_aws_rotate_keys()` é útil para re-encriptação de chave sob essas circunstâncias:

+ Após a rotação do CMK; ou seja, após a invocação da função `keyring_aws_rotate_cmk()`.

+ Após alterar a variável de sistema `keyring_aws_cmk_id` para um valor de chave diferente.

Essa função requer o privilégio `SUPER`.

Argumentos:

  None.

Valor de retorno:

Retorna 1 para sucesso, ou `NULL` e um erro para falha.

* `keyring_hashicorp_update_config()`

Plug-in de chave associado: `keyring_hashicorp`

Quando invocada, a função `keyring_hashicorp_update_config()` faz com que `keyring_hashicorp` realize uma reconfiguração em tempo de execução, conforme descrito na configuração keyring_hashicorp.

Essa função requer o privilégio `SYSTEM_VARIABLES_ADMIN`, pois modifica variáveis de sistema globais.

Argumentos:

  None.

Valor de retorno:

Retorna a string `'Configuration update was successful.'` para sucesso, ou `'Configuration update failed.'` para falha.

#### 8.4.4.17 Metadados do chaveiro

Esta seção descreve as fontes de informação sobre o uso do chaveiro.

Para verificar se um plugin de chave de acesso está carregado, verifique a tabela do esquema de informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 7.6.2, “Obtenção de informações do plugin do servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'keyring%';
+--------------+---------------+
| PLUGIN_NAME  | PLUGIN_STATUS |
+--------------+---------------+
| keyring_file | ACTIVE        |
+--------------+---------------+
```

Para ver quais chaves existem, verifique a tabela do Schema de desempenho `keyring_keys`:

```
mysql> SELECT * FROM performance_schema.keyring_keys;
+-----------------------------+--------------+----------------+
| KEY_ID                      | KEY_OWNER    | BACKEND_KEY_ID |
+-----------------------------+--------------+----------------+
| audit_log-20210322T130749-1 |              |                |
| MyKey                       | me@localhost |                |
| YourKey                     | me@localhost |                |
+-----------------------------+--------------+----------------+
```

Para verificar se um componente de chaveiro está carregado, verifique a tabela do Schema de desempenho `keyring_component_status`. Por exemplo:

```
mysql> SELECT * FROM performance_schema.keyring_component_status;
+---------------------+-------------------------------------------------+
| STATUS_KEY          | STATUS_VALUE                                    |
+---------------------+-------------------------------------------------+
| Component_name      | component_keyring_file                          |
| Author              | Oracle Corporation                              |
| License             | GPL                                             |
| Implementation_name | component_keyring_file                          |
| Version             | 1.0                                             |
| Component_status    | Active                                          |
| Data_file           | /usr/local/mysql/keyring/component_keyring_file |
| Read_only           | No                                              |
+---------------------+-------------------------------------------------+
```

Um valor `Component_status` de `Active` indica que o componente foi inicializado com sucesso. Se o componente foi carregado, mas não conseguiu ser inicializado, o valor é `Disabled`.

#### 8.4.4.18 Opções de comando do keyring

O MySQL suporta as seguintes opções de linha de comando relacionadas ao chaveiro:

* `--keyring-migration-destination=plugin`

  <table frame="box" rules="all" summary="Properties for keyring-migration-destination"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-destination=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

O plugin de chave de destino para migração de chaves. Veja a Seção 8.4.4.14, “Migrando Chaves entre Keystores de Chave de Armazenamento”. A interpretação do valor da opção depende de `--keyring-migration-to-component` ser especificado:

+ Se não, o valor da opção é um plugin de chave, interpretado da mesma maneira que para `--keyring-migration-source`.

+ Se sim, o valor da opção é um componente de chave, especificado como o nome da biblioteca de componentes no diretório do plugin, incluindo qualquer extensão específica da plataforma, como `.so` ou `.dll`.

Nota

`--keyring-migration-source` e `--keyring-migration-destination` são obrigatórios para todas as operações de migração de chave. Os plugins de origem e destino devem ser diferentes, e o servidor de migração deve suportar ambos os plugins.

* `--keyring-migration-host=host_name`

  <table frame="box" rules="all" summary="Properties for keyring-migration-host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>

O local de hospedagem do servidor em execução que está atualmente usando um dos keystores de chave de migração. Veja a Seção 8.4.4.14, “Migrar Chaves entre Keystores de Keyring”. A migração sempre ocorre no host local, portanto, a opção sempre especifica um valor para conectar a um servidor local, como `localhost`, `127.0.0.1`, `::1` ou o endereço IP do host local ou o nome do host.

* `--keyring-migration-password[=password]`

  <table frame="box" rules="all" summary="Properties for keyring-migration-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

A senha da conta do MySQL usada para se conectar ao servidor em execução que está atualmente usando um dos keystores de chave de migração. Veja a Seção 8.4.4.14, “Migrar chaves entre keystores do Keychain”.

O valor da senha é opcional. Se não for fornecido, o servidor solicitará um. Se for fornecido, não deve haver *espaço* entre `--keyring-migration-password=` e a senha que o segue. Se não for especificada nenhuma opção de senha, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Consulte a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”. Você pode usar um arquivo de opção para evitar fornecer a senha na linha de comando. Neste caso, o arquivo deve ter um modo restritivo e ser acessível apenas à conta usada para executar o servidor de migração.

* `--keyring-migration-port=port_num`

  <table frame="box" rules="all" summary="Properties for keyring-migration-port"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-port=port_num</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>3306</code></td> </tr></tbody></table>

Para conexões TCP/IP, o número de porta para se conectar ao servidor em execução que está atualmente usando um dos keystores de chave de migração. Veja a Seção 8.4.4.14, “Migrando Chaves entre Keystores de Keyring”.

* `--keyring-migration-socket=path`

  <table frame="box" rules="all" summary="Properties for keyring-migration-socket"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-socket={file_name|pipe_name}</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Para conexões de arquivo de socket Unix ou tubos nomeados do Windows, o arquivo de socket ou o tubo nomeado para conectar ao servidor em execução que está atualmente usando um dos keystores de chave de migração. Veja a Seção 8.4.4.14, “Migrando Chaves entre Keystores de Keyring”.

* `--keyring-migration-source=plugin`

  <table frame="box" rules="all" summary="Properties for keyring-migration-source"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-source=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

O plugin de chave de origem para migração de chaves. Veja a Seção 8.4.4.14, “Migrando chaves entre chaves de chave de origem”.

O valor da opção é semelhante ao de `--plugin-load`, exceto que apenas uma biblioteca de plugins pode ser especificada. O valor é dado como *`plugin_library`* ou *`name`*`=`*`plugin_library`, onde *`plugin_library`* é o nome de um arquivo de biblioteca que contém código de plugins, e *`name`* é o nome de um plugin a ser carregado. Se uma biblioteca de plugins for nomeada sem qualquer nome de plugin anterior, o servidor carrega todos os plugins da biblioteca. Com um nome de plugin anterior, o servidor carrega apenas o plugin nomeado da biblioteca. O servidor procura arquivos de biblioteca de plugins no diretório nomeado pela variável de sistema `plugin_dir`.

Nota

`--keyring-migration-source` e `--keyring-migration-destination` são obrigatórios para todas as operações de migração de chave. Os plugins de origem e destino devem ser diferentes, e o servidor de migração deve suportar ambos os plugins.

* `--keyring-migration-to-component`

  <table frame="box" rules="all" summary="Properties for keyring-migration-to-component"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-to-component[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>8.0.24</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Indica que uma chave migração é de um plugin de chave de segurança para um componente de chave de segurança. Esta opção permite migrar chaves de qualquer plugin de chave de segurança para qualquer componente de chave de segurança, o que facilita a transição de uma instalação MySQL de plugins de chave de segurança para componentes de chave de segurança.

Para migrar as chaves de um componente de chaveiro para outro, use o utilitário **mysql_migrate_keyring**. A migração de um componente de chaveiro para um plugin de chaveiro não é suportada. Consulte a Seção 8.4.4.14, “Migrando chaves entre chaveiros de chave”.

* `--keyring-migration-user=user_name`

  <table frame="box" rules="all" summary="Properties for keyring-migration-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-user=user_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

O nome de usuário da conta MySQL usado para se conectar ao servidor em execução que está atualmente usando um dos keystores de chave de migração. Veja a Seção 8.4.4.14, “Migrar chaves entre keystores de chave de carteira”.

#### 8.4.4.19 Variáveis do sistema de chaveiro

Os plugins do Keyring do MySQL suportam as seguintes variáveis de sistema. Use-as para configurar a operação do plugin do Keyring. Essas variáveis não estão disponíveis a menos que o plugin do Keyring apropriado esteja instalado (consulte Seção 8.4.4.3, “Instalação do Plugin do Keyring”).

* `keyring_aws_cmk_id`

  <table frame="box" rules="all" summary="Properties for keyring_aws_cmk_id"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-cmk-id=value</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_cmk_id</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

O ID da chave do KMS obtido do servidor do AWS KMS e utilizado pelo plugin `keyring_aws`. Essa variável não está disponível, a menos que esse plugin esteja instalado.

Essa variável é obrigatória. Se não for especificada, a inicialização de `keyring_aws` falha.

* `keyring_aws_conf_file`

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>

A localização do arquivo de configuração para o plugin `keyring_aws`. Essa variável não está disponível, a menos que o plugin esteja instalado.

Ao iniciar o plugin, `keyring_aws` lê a chave de acesso secreta do AWS e a chave do arquivo de configuração. Para que o plugin `keyring_aws` comece com sucesso, o arquivo de configuração deve existir e conter informações válidas sobre a chave de acesso secreta, inicializadas conforme descrito na Seção 8.4.4.9, “Usando o plugin Amazon Web Services Keyring keyring_aws”.

O nome padrão do arquivo é `keyring_aws_conf`, localizado no diretório padrão do arquivo de chave. O local desse diretório padrão é o mesmo que para a variável de sistema `keyring_file_data`. Consulte a descrição dessa variável para obter detalhes, bem como considerações a serem levadas em conta se você criar o diretório manualmente.

* `keyring_aws_data_file`

  <table frame="box" rules="all" summary="Properties for keyring_aws_data_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-data-file</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_data_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>

O local do arquivo de armazenamento para o plugin `keyring_aws`. Essa variável não está disponível, a menos que o plugin esteja instalado.

Ao iniciar o plugin, se o valor atribuído a `keyring_aws_data_file` especificar um arquivo que não existe, o plugin `keyring_aws` tenta criá-lo (assim como seu diretório pai, se necessário). Se o arquivo existir, `keyring_aws` lê quaisquer chaves criptografadas contidas no arquivo em sua cache de memória. `keyring_aws` não cacheia chaves não criptografadas na memória.

O nome padrão do arquivo é `keyring_aws_data`, localizado no diretório padrão do arquivo de chave. O local desse diretório padrão é o mesmo que para a variável de sistema `keyring_file_data`. Consulte a descrição dessa variável para obter detalhes, bem como considerações a serem levadas em conta se você criar o diretório manualmente.

* `keyring_aws_region`

  <table frame="box" rules="all" summary="Properties for keyring_aws_region"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-region=value</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_region</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>us-east-1</code></td> </tr><tr><th>Valores válidos (≥ 8.0.30)</th> <td><p class="valid-value"><code>af-south-1</code></p><p class="valid-value"><code>ap-east-1</code></p><p class="valid-value"><code>ap-northeast-1</code></p><p class="valid-value"><code>ap-northeast-2</code></p><p class="valid-value"><code>ap-northeast-3</code></p><p class="valid-value"><code>ap-south-1</code></p><p class="valid-value"><code>ap-southeast-1</code></p><p class="valid-value"><code>ap-southeast-2</code></p><p class="valid-value"><code>ca-central-1</code></p><p class="valid-value"><code>cn-north-1</code></p><p class="valid-value"><code>cn-northwest-1</code></p><p class="valid-value"><code>eu-central-1</code></p><p class="valid-value"><code>eu-north-1</code></p><p class="valid-value"><code>eu-south-1</code></p><p class="valid-value"><code>eu-west-1</code></p><p class="valid-value"><code>eu-west-2</code></p><p class="valid-value"><code>eu-west-3</code></p><p class="valid-value"><code>me-south-1</code></p><p class="valid-value"><code>sa-east-1</code></p><p class="valid-value"><code>us-east-1</code></p><p class="valid-value"><code>us-east-2</code></p><p class="valid-value"><code>us-gov-east-1</code></p><p class="valid-value"><code>us-iso-east-1</code></p><p class="valid-value"><code>us-iso-west-1</code></p><p class="valid-value"><code>us-isob-east-1</code></p><p class="valid-value"><code>us-west-1</code></p><p class="valid-value"><code>us-west-2</code></p></td> </tr><tr><th>Valores válidos (≥ 8.0.17, ≤ 8.0.29)</th> <td><p class="valid-value"><code>ap-northeast-1</code></p><p class="valid-value"><code>ap-northeast-2</code></p><p class="valid-value"><code>ap-south-1</code></p><p class="valid-value"><code>ap-southeast-1</code></p><p class="valid-value"><code>ap-southeast-2</code></p><p class="valid-value"><code>ca-central-1</code></p><p class="valid-value"><code>cn-north-1</code></p><p class="valid-value"><code>cn-northwest-1</code></p><p class="valid-value"><code>eu-central-1</code></p><p class="valid-value"><code>eu-west-1</code></p><p class="valid-value"><code>eu-west-2</code></p><p class="valid-value"><code>eu-west-3</code></p><p class="valid-value"><code>sa-east-1</code></p><p class="valid-value"><code>us-east-1</code></p><p class="valid-value"><code>us-east-2</code></p><p class="valid-value"><code>us-west-1</code></p><p class="valid-value"><code>us-west-2</code></p></td> </tr><tr><th>Valores válidos (≤ 8.0.16)</th> <td><p class="valid-value"><code>ap-northeast-1</code></p><p class="valid-value"><code>ap-northeast-2</code></p><p class="valid-value"><code>ap-south-1</code></p><p class="valid-value"><code>ap-southeast-1</code></p><p class="valid-value"><code>ap-southeast-2</code></p><p class="valid-value"><code>eu-central-1</code></p><p class="valid-value"><code>eu-west-1</code></p><p class="valid-value"><code>sa-east-1</code></p><p class="valid-value"><code>us-east-1</code></p><p class="valid-value"><code>us-west-1</code></p><p class="valid-value"><code>us-west-2</code></p></td> </tr></tbody></table>

A região da AWS para o plugin `keyring_aws`. Essa variável não está disponível, a menos que o plugin esteja instalado.

Se não estiver definida, a região da AWS por padrão é `us-east-1`. Assim, para qualquer outra região, essa variável deve ser definida explicitamente.

* `keyring_encrypted_file_data`

  <table frame="box" rules="all" summary="Properties for keyring_encrypted_file_data"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-encrypted-file-data=file_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.34</td> </tr><tr><th>System Variable</th> <td><code>keyring_encrypted_file_data</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>

Nota

A partir do MySQL 8.0.34, o plugin `keyring_encrypted_file` é desatualizado e está sujeito à remoção em uma versão futura do MySQL. Considere usar `component_keyring_encrypted_file` em vez disso; o componente `component_keyring_encrypted_file` substitui o plugin `keyring_encrypted_file`.

O nome do caminho do arquivo de dados usado para armazenamento seguro de dados pelo plugin `keyring_encrypted_file`. Essa variável não está disponível a menos que o plugin seja instalado. O local do arquivo deve estar em um diretório considerado para uso apenas por plugins de chave de segurança. Por exemplo, não localize o arquivo sob o diretório de dados.

As operações de chaveiro são transacionais: o plugin `keyring_encrypted_file` usa um arquivo de backup durante as operações de escrita para garantir que possa retornar ao arquivo original se uma operação falhar. O arquivo de backup tem o mesmo nome que o valor da variável do sistema `keyring_encrypted_file_data` com um sufixo de `.backup`.

Não use o mesmo arquivo de dados `keyring_encrypted_file` para múltiplas instâncias do MySQL. Cada instância deve ter seu próprio arquivo de dados único.

O nome padrão do arquivo é `keyring_encrypted`, localizado em um diretório que é específico da plataforma e depende do valor da opção `INSTALL_LAYOUT` **CMake**, conforme mostrado na tabela a seguir. Para especificar o diretório padrão do arquivo explicitamente se você está construindo a partir de fonte, use a opção `INSTALL_MYSQLKEYRINGDIR` **CMake**.

  <table summary="The default keyring_encrypted_file_data value for different INSTALL_LAYOUT values."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th><code>INSTALL_LAYOUT</code>Valor</th> <th>Default <code>keyring_encrypted_file_data</code> Value</th> </tr></thead><tbody><tr> <td><code>DEB</code>,<code>RPM</code>,<code>SVR4</code></td> <td><code>/var/lib/mysql-keyring/keyring_encrypted</code></td> </tr><tr> <td>Caso contrário</td> <td><code>keyring/keyring_encrypted</code> under the <code>CMAKE_INSTALL_PREFIX</code> value</td> </tr></tbody></table>

Ao iniciar o plugin, se o valor atribuído a `keyring_encrypted_file_data` especificar um arquivo que não existe, o plugin `keyring_encrypted_file` tenta criá-lo (assim como seu diretório pai, se necessário).

Se você criar o diretório manualmente, ele deve ter um modo restritivo e ser acessível apenas à conta usada para executar o servidor MySQL. Por exemplo, em sistemas Unix e Unix-like, para usar o diretório `/usr/local/mysql/mysql-keyring`, os seguintes comandos (executados como `root`) criam o diretório e definem seu modo e propriedade:

  ```
  cd /usr/local/mysql
  mkdir mysql-keyring
  chmod 750 mysql-keyring
  chown mysql mysql-keyring
  chgrp mysql mysql-keyring
  ```

Se o plugin `keyring_encrypted_file` não conseguir criar ou acessar seu arquivo de dados, ele escreve uma mensagem de erro no log de erro. Se uma tentativa de atribuição de tempo de execução para `keyring_encrypted_file_data` resultar em um erro, o valor da variável permanece inalterado.

Importante

Uma vez que o plugin `keyring_encrypted_file` tenha criado seu arquivo de dados e começado a usá-lo, é importante não removê-lo. A perda do arquivo faz com que os dados criptografados usando suas chaves se tornem inacessíveis. (É permitido renomear ou mover o arquivo, desde que você mude o valor de `keyring_encrypted_file_data` para corresponder.)

* `keyring_encrypted_file_password`

  <table frame="box" rules="all" summary="Properties for keyring_encrypted_file_password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-encrypted-file-password=password</code></td> </tr><tr><th>Deprecated</th> <td>8.0.34</td> </tr><tr><th>System Variable</th> <td><code>keyring_encrypted_file_password</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Nota

A partir do MySQL 8.0.34, o plugin `keyring_encrypted_file` é desatualizado e está sujeito à remoção em uma versão futura do MySQL. Considere usar `component_keyring_encrypted_file` em vez disso; o componente `component_keyring_encrypted_file` substitui o plugin `keyring_encrypted_file`.

A senha usada pelo plugin `keyring_encrypted_file`. Essa variável não está disponível, a menos que o plugin seja instalado.

Essa variável é obrigatória. Se não for especificada, a inicialização de `keyring_encrypted_file` falha.

Se essa variável for especificada em um arquivo de opção, o arquivo deve ter um modo restritivo e ser acessível apenas à conta usada para executar o servidor MySQL.

Importante

Uma vez que o valor `keyring_encrypted_file_password` tenha sido definido, alterá-lo não rotaciona a senha do chaveiro e pode tornar o servidor inacessível. Se uma senha incorreta for fornecida, o plugin `keyring_encrypted_file` não pode carregar chaves do arquivo do chaveiro criptografado.

O valor da senha não pode ser exibido em tempo de execução com `SHOW VARIABLES` ou na tabela do Schema de desempenho `global_variables`, porque o valor de exibição é ofuscado.

* `keyring_file_data`

  <table frame="box" rules="all" summary="Properties for keyring_file_data"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-file-data=file_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.34</td> </tr><tr><th>System Variable</th> <td><code>keyring_file_data</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>

Nota

A partir do MySQL 8.0.34, o plugin `keyring_file` é desatualizado e está sujeito à remoção em uma versão futura do MySQL. Considere usar `component_keyring_file` em vez disso; o componente `component_keyring_file` substitui o plugin `keyring_file`.

O nome do caminho do arquivo de dados usado para armazenamento seguro de dados pelo plugin `keyring_file`. Essa variável não está disponível, a menos que esse plugin esteja instalado. O local do arquivo deve estar em um diretório considerado para uso apenas por plugins de chave de segurança. Por exemplo, não localize o arquivo sob o diretório de dados.

As operações de chaveiro são transacionais: o plugin `keyring_file` usa um arquivo de backup durante as operações de escrita para garantir que possa retornar ao arquivo original se uma operação falhar. O arquivo de backup tem o mesmo nome que o valor da variável do sistema `keyring_file_data`, com um sufixo de `.backup`.

Não use o mesmo arquivo de dados `keyring_file` para múltiplas instâncias do MySQL. Cada instância deve ter seu próprio arquivo de dados único.

O nome padrão do arquivo é `keyring`, localizado em um diretório que é específico da plataforma e depende do valor da opção `INSTALL_LAYOUT` **CMake**, conforme mostrado na tabela a seguir. Para especificar o diretório padrão do arquivo explicitamente se você está construindo a partir de fonte, use a opção `INSTALL_MYSQLKEYRINGDIR` **CMake**.

  <table summary="The default keyring_file_data value for different INSTALL_LAYOUT values."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th><code>INSTALL_LAYOUT</code>Valor</th> <th>Default <code>keyring_file_data</code> Value</th> </tr></thead><tbody><tr> <td><code>DEB</code>,<code>RPM</code>,<code>SVR4</code></td> <td><code>/var/lib/mysql-keyring/keyring</code></td> </tr><tr> <td>Caso contrário</td> <td><code>keyring/keyring</code> under the <code>CMAKE_INSTALL_PREFIX</code> value</td> </tr></tbody></table>

Ao iniciar o plugin, se o valor atribuído a `keyring_file_data` especificar um arquivo que não existe, o plugin `keyring_file` tenta criá-lo (assim como seu diretório pai, se necessário).

Se você criar o diretório manualmente, ele deve ter um modo restritivo e ser acessível apenas à conta usada para executar o servidor MySQL. Por exemplo, em sistemas Unix e Unix-like, para usar o diretório `/usr/local/mysql/mysql-keyring`, os seguintes comandos (executados como `root`) criam o diretório e definem seu modo e propriedade:

  ```
  cd /usr/local/mysql
  mkdir mysql-keyring
  chmod 750 mysql-keyring
  chown mysql mysql-keyring
  chgrp mysql mysql-keyring
  ```

Se o plugin `keyring_file` não conseguir criar ou acessar seu arquivo de dados, ele escreve uma mensagem de erro no log de erro. Se uma tentativa de atribuição de tempo de execução para `keyring_file_data` resultar em um erro, o valor da variável permanece inalterado.

Importante

Uma vez que o plugin `keyring_file` tenha criado seu arquivo de dados e começado a usá-lo, é importante não removê-lo. Por exemplo, o `InnoDB` usa o arquivo para armazenar a chave mestre usada para descriptografar os dados em tabelas que usam a criptografia do espaço de tabela `InnoDB`; veja a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”. A perda do arquivo faz com que os dados dessas tabelas se tornem inacessíveis. (É permitido renomear ou mover o arquivo, desde que você mude o valor de `keyring_file_data` para corresponder.) Recomenda-se que você crie um backup separado do arquivo de dados do chaveiro imediatamente após criar a primeira tabela criptografada e antes e depois da rotação da chave mestre.

* `keyring_hashicorp_auth_path`

  <table frame="box" rules="all" summary="Properties for keyring_hashicorp_auth_path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-hashicorp-auth-path=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>System Variable</th> <td><code>keyring_hashicorp_auth_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>/v1/auth/approle/login</code></td> </tr></tbody></table>

O caminho de autenticação onde a autenticação AppRole é habilitada no servidor HashiCorp Vault, para uso pelo plugin `keyring_hashicorp`. Esta variável não está disponível, a menos que esse plugin esteja instalado.

* `keyring_hashicorp_ca_path`

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>0

O nome absoluto do caminho de um arquivo local acessível ao servidor MySQL que contém uma autoridade de certificação TLS formatada corretamente para uso pelo plugin `keyring_hashicorp`. Essa variável não está disponível, a menos que esse plugin esteja instalado.

Se essa variável não for definida, o plugin `keyring_hashicorp` abre uma conexão HTTPS sem usar verificação de certificado do servidor e confia em qualquer certificado entregue pelo servidor HashiCorp Vault. Para que isso seja seguro, deve-se assumir que o servidor Vault não é malicioso e que não é possível um ataque de meio-caminho. Se essas suposições forem inválidas, defina `keyring_hashicorp_ca_path` para o caminho de um certificado de CA confiável. (Por exemplo, para as instruções na Preparação de Certificado e Chave, este é o arquivo `company.crt`.)

* `keyring_hashicorp_caching`

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>1

Se deve habilitar o cache de chave opcional de memória em cache usado pelo plugin `keyring_hashicorp` para armazenar chaves do servidor HashiCorp Vault. Essa variável não está disponível a menos que esse plugin esteja instalado. Se o cache estiver habilitado, o plugin o preencherá durante a inicialização. Caso contrário, o plugin preencherá apenas a lista de chaves durante a inicialização.

Habilitar o cache é um compromisso: melhora o desempenho, mas mantém uma cópia de informações sensíveis na memória, o que pode ser indesejável por motivos de segurança.

* `keyring_hashicorp_commit_auth_path`

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>2

Essa variável está associada a `keyring_hashicorp_auth_path`, da qual ela obtém seu valor durante a inicialização do plugin `keyring_hashicorp`. Essa variável não está disponível a menos que o plugin esteja instalado. Ela reflete o valor "comprometido" realmente usado para a operação do plugin se a inicialização for bem-sucedida. Para informações adicionais, consulte Configuração keyring_hashicorp.

* `keyring_hashicorp_commit_ca_path`

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>3

Essa variável está associada a `keyring_hashicorp_ca_path`, da qual ela obtém seu valor durante a inicialização do plugin `keyring_hashicorp`. Essa variável não está disponível a menos que o plugin esteja instalado. Ela reflete o valor "comprometido" realmente usado para a operação do plugin se a inicialização for bem-sucedida. Para informações adicionais, consulte Configuração keyring_hashicorp.

* `keyring_hashicorp_commit_caching`

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>4

Essa variável está associada a `keyring_hashicorp_caching`, da qual ela obtém seu valor durante a inicialização do plugin `keyring_hashicorp`. Essa variável não está disponível a menos que o plugin esteja instalado. Ela reflete o valor "comprometido" realmente usado para a operação do plugin se a inicialização for bem-sucedida. Para informações adicionais, consulte Configuração keyring_hashicorp.

* `keyring_hashicorp_commit_role_id`

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>5

Essa variável está associada a `keyring_hashicorp_role_id`, da qual ela obtém seu valor durante a inicialização do plugin `keyring_hashicorp`. Essa variável não está disponível a menos que o plugin esteja instalado. Ela reflete o valor "comprometido" realmente usado para a operação do plugin se a inicialização for bem-sucedida. Para informações adicionais, consulte Configuração keyring_hashicorp.

* `keyring_hashicorp_commit_server_url`

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>6

Essa variável está associada a `keyring_hashicorp_server_url`, da qual ela obtém seu valor durante a inicialização do plugin `keyring_hashicorp`. Essa variável não está disponível a menos que o plugin esteja instalado. Ela reflete o valor "comprometido" realmente usado para a operação do plugin se a inicialização for bem-sucedida. Para informações adicionais, consulte Configuração keyring_hashicorp.

* `keyring_hashicorp_commit_store_path`

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>7

Essa variável está associada a `keyring_hashicorp_store_path`, da qual ela obtém seu valor durante a inicialização do plugin `keyring_hashicorp`. Essa variável não está disponível a menos que o plugin esteja instalado. Ela reflete o valor "comprometido" realmente usado para a operação do plugin se a inicialização for bem-sucedida. Para informações adicionais, consulte Configuração keyring_hashicorp.

* `keyring_hashicorp_role_id`

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>8

O ID de autenticação HashiCorp Vault AppRole, para uso do plugin `keyring_hashicorp`. Esta variável não está disponível, a menos que esse plugin esteja instalado. O valor deve estar no formato UUID.

Essa variável é obrigatória. Se não for especificada, a inicialização de `keyring_hashicorp` falha.

* `keyring_hashicorp_secret_id`

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>9

O HashiCorp Vault AppRole autenticação secreta ID, para uso do plugin `keyring_hashicorp`. Esta variável não está disponível, a menos que esse plugin esteja instalado. O valor deve estar no formato UUID.

Essa variável é obrigatória. Se não for especificada, a inicialização de `keyring_hashicorp` falha.

O valor desta variável é sensível, portanto, seu valor é mascarado por `*` caracteres quando exibido.

* `keyring_hashicorp_server_url`

  <table frame="box" rules="all" summary="Properties for keyring_aws_data_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-data-file</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_data_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>0

O URL do servidor HashiCorp Vault, para uso do plugin `keyring_hashicorp`. Essa variável não está disponível, a menos que esse plugin esteja instalado. O valor deve começar com `https://`.

* `keyring_hashicorp_store_path`

  <table frame="box" rules="all" summary="Properties for keyring_aws_data_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-data-file</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_data_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>1

Um caminho de loja dentro do servidor HashiCorp Vault que é legível quando as credenciais do AppRole apropriadas são fornecidas pelo plugin `keyring_hashicorp`. Esta variável não está disponível a menos que esse plugin esteja instalado. Para especificar as credenciais, defina as variáveis de sistema `keyring_hashicorp_role_id` e `keyring_hashicorp_secret_id` (por exemplo, como mostrado na configuração keyring_hashicorp).

Essa variável é obrigatória. Se não for especificada, a inicialização de `keyring_hashicorp` falha.

* `keyring_oci_ca_certificate`

  <table frame="box" rules="all" summary="Properties for keyring_aws_data_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-data-file</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_data_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>2

O nome do caminho do arquivo do pacote de certificados CA que o plugin `keyring_oci` usa para a verificação de certificados da Oracle Cloud Infrastructure. Essa variável não está disponível, a menos que o plugin seja instalado.

O arquivo contém um ou mais certificados para verificação entre pares. Se não for especificado nenhum arquivo, o pacote CA padrão instalado no sistema é utilizado. Se o valor for `disabled` (sensível a maiúsculas e minúsculas), `keyring_oci` não realiza verificação de certificados.

* `keyring_oci_compartment`

  <table frame="box" rules="all" summary="Properties for keyring_aws_data_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-data-file</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_data_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>3

O OCID do compartimento de locações que o plugin `keyring_oci` usa como localização das chaves do MySQL. Essa variável não está disponível, a menos que o plugin esteja instalado.

Antes de usar `keyring_oci`, você deve criar um compartimento ou subcompartimento MySQL, se ele não existir. Esse compartimento não deve conter chaves de vault ou segredos de vault. Não deve ser usado por sistemas que não sejam o MySQL Keyring.

Para informações sobre a gestão de compartimentos e obtenção do OCID, consulte [Gerenciamento de Compras][(https://docs.cloud.oracle.com/en-us/iaas/Content/Identity/Tasks/managingcompartments.htm)].

Essa variável é obrigatória. Se não for especificada, a inicialização de `keyring_oci` falha.

* `keyring_oci_encryption_endpoint`

  <table frame="box" rules="all" summary="Properties for keyring_aws_data_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-data-file</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_data_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>4

O ponto final do servidor de criptografia da Oracle Cloud Infrastructure que o plugin `keyring_oci` usa para gerar texto cifrado para novas chaves. Essa variável não está disponível, a menos que o plugin seja instalado.

O ponto final de criptografia é específico do cofre e a Oracle Cloud Infrastructure o atribui no momento da criação do cofre. Para obter o OCID do ponto final, consulte os detalhes da configuração do seu cofre `keyring_oci`, usando as instruções em [Gerenciamento de cofres][(https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm)].

Essa variável é obrigatória. Se não for especificada, a inicialização de `keyring_oci` falha.

* `keyring_oci_key_file`

  <table frame="box" rules="all" summary="Properties for keyring_aws_data_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-data-file</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_data_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>5

O nome do caminho do arquivo que contém a chave privada RSA que o plugin `keyring_oci` usa para autenticação na Oracle Cloud Infrastructure. Essa variável não está disponível, a menos que o plugin esteja instalado.

Você também deve fazer o upload da chave pública RSA correspondente usando o Console. O Console exibe o valor do perfil da chave, que você pode usar para definir a variável do sistema `keyring_oci_key_fingerprint`.

Para obter informações sobre a geração e o upload de chaves de API, consulte [Chaves e OCIDs necessárias][(https://docs.cloud.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm)].

Essa variável é obrigatória. Se não for especificada, a inicialização de `keyring_oci` falha.

* `keyring_oci_key_fingerprint`

  <table frame="box" rules="all" summary="Properties for keyring_aws_data_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-data-file</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_data_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>6

A impressão digital da chave privada RSA que o plugin `keyring_oci` usa para autenticação na Infraestrutura da Nuvem da Oracle. Essa variável não está disponível, a menos que o plugin esteja instalado.

Para obter a impressão digital da chave ao criar as chaves da API, execute este comando:

  ```
  openssl rsa -pubout -outform DER -in ~/.oci/oci_api_key.pem | openssl md5 -c
  ```

Como alternativa, obtenha a impressão digital do Console, que exibe automaticamente a impressão digital quando você carrega a chave pública RSA.

Para obter informações sobre a obtenção de impressões digitais chave, consulte [Chaves e OCIDs necessárias][(https://docs.cloud.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm)].

Essa variável é obrigatória. Se não for especificada, a inicialização de `keyring_oci` falha.

* `keyring_oci_management_endpoint`

  <table frame="box" rules="all" summary="Properties for keyring_aws_data_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-data-file</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_data_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>7

O ponto final do servidor de gerenciamento de chave da Oracle Cloud Infrastructure que o plugin `keyring_oci` usa para listar chaves existentes. Essa variável não está disponível, a menos que o plugin seja instalado.

O ponto final de gerenciamento chave é específico para o cofre e a Oracle Cloud Infrastructure o atribui no momento da criação do cofre. Para obter o OCID do ponto final, consulte os detalhes da configuração do seu cofre `keyring_oci`, usando as instruções em [Gerenciamento de cofres](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm).

Essa variável é obrigatória. Se não for especificada, a inicialização de `keyring_oci` falha.

* `keyring_oci_master_key`

  <table frame="box" rules="all" summary="Properties for keyring_aws_data_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-data-file</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_data_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>8

O OCID da chave de criptografia mestre da Infraestrutura de Nuvem da Oracle que o plugin `keyring_oci` usa para criptografar segredos. Essa variável não está disponível, a menos que o plugin seja instalado.

Antes de usar `keyring_oci`, você deve criar uma chave criptográfica para o compartimento da Infraestrutura da Oracle Cloud, se ele não existir. Forneça um nome específico para MySQL para a chave gerada e não use-o para outros fins.

Para informações sobre a criação de chaves, consulte [Gerenciamento de Chaves][(https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingkeys.htm)].

Essa variável é obrigatória. Se não for especificada, a inicialização de `keyring_oci` falha.

* `keyring_oci_secrets_endpoint`

  <table frame="box" rules="all" summary="Properties for keyring_aws_data_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-data-file</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_data_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>9

O ponto final do servidor de segredos da Oracle Cloud Infrastructure que o plugin `keyring_oci` usa para listar, criar e aposentar segredos. Essa variável não está disponível, a menos que o plugin seja instalado.

O endpoint de segredos é específico para o cofre e a Oracle Cloud Infrastructure o atribui no momento da criação do cofre. Para obter o OCID do endpoint, consulte os detalhes da configuração do seu cofre `keyring_oci`, usando as instruções em [Gerenciamento de cofres][(https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm)].

Essa variável é obrigatória. Se não for especificada, a inicialização de `keyring_oci` falha.

* `keyring_oci_tenancy`

  <table frame="box" rules="all" summary="Properties for keyring_aws_region"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-region=value</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_region</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>us-east-1</code></td> </tr><tr><th>Valores válidos (≥ 8.0.30)</th> <td><p class="valid-value"><code>af-south-1</code></p><p class="valid-value"><code>ap-east-1</code></p><p class="valid-value"><code>ap-northeast-1</code></p><p class="valid-value"><code>ap-northeast-2</code></p><p class="valid-value"><code>ap-northeast-3</code></p><p class="valid-value"><code>ap-south-1</code></p><p class="valid-value"><code>ap-southeast-1</code></p><p class="valid-value"><code>ap-southeast-2</code></p><p class="valid-value"><code>ca-central-1</code></p><p class="valid-value"><code>cn-north-1</code></p><p class="valid-value"><code>cn-northwest-1</code></p><p class="valid-value"><code>eu-central-1</code></p><p class="valid-value"><code>eu-north-1</code></p><p class="valid-value"><code>eu-south-1</code></p><p class="valid-value"><code>eu-west-1</code></p><p class="valid-value"><code>eu-west-2</code></p><p class="valid-value"><code>eu-west-3</code></p><p class="valid-value"><code>me-south-1</code></p><p class="valid-value"><code>sa-east-1</code></p><p class="valid-value"><code>us-east-1</code></p><p class="valid-value"><code>us-east-2</code></p><p class="valid-value"><code>us-gov-east-1</code></p><p class="valid-value"><code>us-iso-east-1</code></p><p class="valid-value"><code>us-iso-west-1</code></p><p class="valid-value"><code>us-isob-east-1</code></p><p class="valid-value"><code>us-west-1</code></p><p class="valid-value"><code>us-west-2</code></p></td> </tr><tr><th>Valores válidos (≥ 8.0.17, ≤ 8.0.29)</th> <td><p class="valid-value"><code>ap-northeast-1</code></p><p class="valid-value"><code>ap-northeast-2</code></p><p class="valid-value"><code>ap-south-1</code></p><p class="valid-value"><code>ap-southeast-1</code></p><p class="valid-value"><code>ap-southeast-2</code></p><p class="valid-value"><code>ca-central-1</code></p><p class="valid-value"><code>cn-north-1</code></p><p class="valid-value"><code>cn-northwest-1</code></p><p class="valid-value"><code>eu-central-1</code></p><p class="valid-value"><code>eu-west-1</code></p><p class="valid-value"><code>eu-west-2</code></p><p class="valid-value"><code>eu-west-3</code></p><p class="valid-value"><code>sa-east-1</code></p><p class="valid-value"><code>us-east-1</code></p><p class="valid-value"><code>us-east-2</code></p><p class="valid-value"><code>us-west-1</code></p><p class="valid-value"><code>us-west-2</code></p></td> </tr><tr><th>Valores válidos (≤ 8.0.16)</th> <td><p class="valid-value"><code>ap-northeast-1</code></p><p class="valid-value"><code>ap-northeast-2</code></p><p class="valid-value"><code>ap-south-1</code></p><p class="valid-value"><code>ap-southeast-1</code></p><p class="valid-value"><code>ap-southeast-2</code></p><p class="valid-value"><code>eu-central-1</code></p><p class="valid-value"><code>eu-west-1</code></p><p class="valid-value"><code>sa-east-1</code></p><p class="valid-value"><code>us-east-1</code></p><p class="valid-value"><code>us-west-1</code></p><p class="valid-value"><code>us-west-2</code></p></td> </tr></tbody></table>0

O OCID (Identificador de Conta de Instalação) da infraestrutura da Oracle Cloud que o plugin `keyring_oci` usa como localização do compartimento do MySQL. Essa variável não está disponível, a menos que o plugin esteja instalado.

Antes de usar `keyring_oci`, você deve criar uma locação, se não existir. Para obter o OCID da locação no Console, use as instruções em [Chaves e OCIDs Requeridos][(https://docs.cloud.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm)].

Essa variável é obrigatória. Se não for especificada, a inicialização de `keyring_oci` falha.

* `keyring_oci_user`

  <table frame="box" rules="all" summary="Properties for keyring_aws_region"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-region=value</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_region</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>us-east-1</code></td> </tr><tr><th>Valores válidos (≥ 8.0.30)</th> <td><p class="valid-value"><code>af-south-1</code></p><p class="valid-value"><code>ap-east-1</code></p><p class="valid-value"><code>ap-northeast-1</code></p><p class="valid-value"><code>ap-northeast-2</code></p><p class="valid-value"><code>ap-northeast-3</code></p><p class="valid-value"><code>ap-south-1</code></p><p class="valid-value"><code>ap-southeast-1</code></p><p class="valid-value"><code>ap-southeast-2</code></p><p class="valid-value"><code>ca-central-1</code></p><p class="valid-value"><code>cn-north-1</code></p><p class="valid-value"><code>cn-northwest-1</code></p><p class="valid-value"><code>eu-central-1</code></p><p class="valid-value"><code>eu-north-1</code></p><p class="valid-value"><code>eu-south-1</code></p><p class="valid-value"><code>eu-west-1</code></p><p class="valid-value"><code>eu-west-2</code></p><p class="valid-value"><code>eu-west-3</code></p><p class="valid-value"><code>me-south-1</code></p><p class="valid-value"><code>sa-east-1</code></p><p class="valid-value"><code>us-east-1</code></p><p class="valid-value"><code>us-east-2</code></p><p class="valid-value"><code>us-gov-east-1</code></p><p class="valid-value"><code>us-iso-east-1</code></p><p class="valid-value"><code>us-iso-west-1</code></p><p class="valid-value"><code>us-isob-east-1</code></p><p class="valid-value"><code>us-west-1</code></p><p class="valid-value"><code>us-west-2</code></p></td> </tr><tr><th>Valores válidos (≥ 8.0.17, ≤ 8.0.29)</th> <td><p class="valid-value"><code>ap-northeast-1</code></p><p class="valid-value"><code>ap-northeast-2</code></p><p class="valid-value"><code>ap-south-1</code></p><p class="valid-value"><code>ap-southeast-1</code></p><p class="valid-value"><code>ap-southeast-2</code></p><p class="valid-value"><code>ca-central-1</code></p><p class="valid-value"><code>cn-north-1</code></p><p class="valid-value"><code>cn-northwest-1</code></p><p class="valid-value"><code>eu-central-1</code></p><p class="valid-value"><code>eu-west-1</code></p><p class="valid-value"><code>eu-west-2</code></p><p class="valid-value"><code>eu-west-3</code></p><p class="valid-value"><code>sa-east-1</code></p><p class="valid-value"><code>us-east-1</code></p><p class="valid-value"><code>us-east-2</code></p><p class="valid-value"><code>us-west-1</code></p><p class="valid-value"><code>us-west-2</code></p></td> </tr><tr><th>Valores válidos (≤ 8.0.16)</th> <td><p class="valid-value"><code>ap-northeast-1</code></p><p class="valid-value"><code>ap-northeast-2</code></p><p class="valid-value"><code>ap-south-1</code></p><p class="valid-value"><code>ap-southeast-1</code></p><p class="valid-value"><code>ap-southeast-2</code></p><p class="valid-value"><code>eu-central-1</code></p><p class="valid-value"><code>eu-west-1</code></p><p class="valid-value"><code>sa-east-1</code></p><p class="valid-value"><code>us-east-1</code></p><p class="valid-value"><code>us-west-1</code></p><p class="valid-value"><code>us-west-2</code></p></td> </tr></tbody></table>1

O ID de OC do usuário da Oracle Cloud Infrastructure que o plugin `keyring_oci` utiliza para conexões na nuvem. Essa variável não está disponível, a menos que o plugin esteja instalado.

Antes de usar `keyring_oci`, esse usuário deve existir e ter acesso para usar os recursos de tenência, compartimento e cofre configurados na Infraestrutura da Nuvem Oracle.

Para obter o OCID do usuário a partir do Console, use as instruções em [Chaves e OCIDs necessárias][(https://docs.cloud.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm)].

Essa variável é obrigatória. Se não for especificada, a inicialização de `keyring_oci` falha.

* `keyring_oci_vaults_endpoint`

  <table frame="box" rules="all" summary="Properties for keyring_aws_region"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-region=value</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_region</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>us-east-1</code></td> </tr><tr><th>Valores válidos (≥ 8.0.30)</th> <td><p class="valid-value"><code>af-south-1</code></p><p class="valid-value"><code>ap-east-1</code></p><p class="valid-value"><code>ap-northeast-1</code></p><p class="valid-value"><code>ap-northeast-2</code></p><p class="valid-value"><code>ap-northeast-3</code></p><p class="valid-value"><code>ap-south-1</code></p><p class="valid-value"><code>ap-southeast-1</code></p><p class="valid-value"><code>ap-southeast-2</code></p><p class="valid-value"><code>ca-central-1</code></p><p class="valid-value"><code>cn-north-1</code></p><p class="valid-value"><code>cn-northwest-1</code></p><p class="valid-value"><code>eu-central-1</code></p><p class="valid-value"><code>eu-north-1</code></p><p class="valid-value"><code>eu-south-1</code></p><p class="valid-value"><code>eu-west-1</code></p><p class="valid-value"><code>eu-west-2</code></p><p class="valid-value"><code>eu-west-3</code></p><p class="valid-value"><code>me-south-1</code></p><p class="valid-value"><code>sa-east-1</code></p><p class="valid-value"><code>us-east-1</code></p><p class="valid-value"><code>us-east-2</code></p><p class="valid-value"><code>us-gov-east-1</code></p><p class="valid-value"><code>us-iso-east-1</code></p><p class="valid-value"><code>us-iso-west-1</code></p><p class="valid-value"><code>us-isob-east-1</code></p><p class="valid-value"><code>us-west-1</code></p><p class="valid-value"><code>us-west-2</code></p></td> </tr><tr><th>Valores válidos (≥ 8.0.17, ≤ 8.0.29)</th> <td><p class="valid-value"><code>ap-northeast-1</code></p><p class="valid-value"><code>ap-northeast-2</code></p><p class="valid-value"><code>ap-south-1</code></p><p class="valid-value"><code>ap-southeast-1</code></p><p class="valid-value"><code>ap-southeast-2</code></p><p class="valid-value"><code>ca-central-1</code></p><p class="valid-value"><code>cn-north-1</code></p><p class="valid-value"><code>cn-northwest-1</code></p><p class="valid-value"><code>eu-central-1</code></p><p class="valid-value"><code>eu-west-1</code></p><p class="valid-value"><code>eu-west-2</code></p><p class="valid-value"><code>eu-west-3</code></p><p class="valid-value"><code>sa-east-1</code></p><p class="valid-value"><code>us-east-1</code></p><p class="valid-value"><code>us-east-2</code></p><p class="valid-value"><code>us-west-1</code></p><p class="valid-value"><code>us-west-2</code></p></td> </tr><tr><th>Valores válidos (≤ 8.0.16)</th> <td><p class="valid-value"><code>ap-northeast-1</code></p><p class="valid-value"><code>ap-northeast-2</code></p><p class="valid-value"><code>ap-south-1</code></p><p class="valid-value"><code>ap-southeast-1</code></p><p class="valid-value"><code>ap-southeast-2</code></p><p class="valid-value"><code>eu-central-1</code></p><p class="valid-value"><code>eu-west-1</code></p><p class="valid-value"><code>sa-east-1</code></p><p class="valid-value"><code>us-east-1</code></p><p class="valid-value"><code>us-west-1</code></p><p class="valid-value"><code>us-west-2</code></p></td> </tr></tbody></table>2

O ponto final do servidor de valetas do Oracle Cloud Infrastructure que o plugin `keyring_oci` usa para obter o valor dos segredos. Essa variável não está disponível, a menos que o plugin seja instalado.

O ponto final de armazém é específico do armazém e a Oracle Cloud Infrastructure o atribui no momento da criação do armazém. Para obter o OCID do ponto final, consulte os detalhes da configuração do seu armazém `keyring_oci`, usando as instruções em [Gerenciamento de armazéns](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm).

Essa variável é obrigatória. Se não for especificada, a inicialização de `keyring_oci` falha.

* `keyring_oci_virtual_vault`

  <table frame="box" rules="all" summary="Properties for keyring_aws_region"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-region=value</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_region</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>us-east-1</code></td> </tr><tr><th>Valores válidos (≥ 8.0.30)</th> <td><p class="valid-value"><code>af-south-1</code></p><p class="valid-value"><code>ap-east-1</code></p><p class="valid-value"><code>ap-northeast-1</code></p><p class="valid-value"><code>ap-northeast-2</code></p><p class="valid-value"><code>ap-northeast-3</code></p><p class="valid-value"><code>ap-south-1</code></p><p class="valid-value"><code>ap-southeast-1</code></p><p class="valid-value"><code>ap-southeast-2</code></p><p class="valid-value"><code>ca-central-1</code></p><p class="valid-value"><code>cn-north-1</code></p><p class="valid-value"><code>cn-northwest-1</code></p><p class="valid-value"><code>eu-central-1</code></p><p class="valid-value"><code>eu-north-1</code></p><p class="valid-value"><code>eu-south-1</code></p><p class="valid-value"><code>eu-west-1</code></p><p class="valid-value"><code>eu-west-2</code></p><p class="valid-value"><code>eu-west-3</code></p><p class="valid-value"><code>me-south-1</code></p><p class="valid-value"><code>sa-east-1</code></p><p class="valid-value"><code>us-east-1</code></p><p class="valid-value"><code>us-east-2</code></p><p class="valid-value"><code>us-gov-east-1</code></p><p class="valid-value"><code>us-iso-east-1</code></p><p class="valid-value"><code>us-iso-west-1</code></p><p class="valid-value"><code>us-isob-east-1</code></p><p class="valid-value"><code>us-west-1</code></p><p class="valid-value"><code>us-west-2</code></p></td> </tr><tr><th>Valores válidos (≥ 8.0.17, ≤ 8.0.29)</th> <td><p class="valid-value"><code>ap-northeast-1</code></p><p class="valid-value"><code>ap-northeast-2</code></p><p class="valid-value"><code>ap-south-1</code></p><p class="valid-value"><code>ap-southeast-1</code></p><p class="valid-value"><code>ap-southeast-2</code></p><p class="valid-value"><code>ca-central-1</code></p><p class="valid-value"><code>cn-north-1</code></p><p class="valid-value"><code>cn-northwest-1</code></p><p class="valid-value"><code>eu-central-1</code></p><p class="valid-value"><code>eu-west-1</code></p><p class="valid-value"><code>eu-west-2</code></p><p class="valid-value"><code>eu-west-3</code></p><p class="valid-value"><code>sa-east-1</code></p><p class="valid-value"><code>us-east-1</code></p><p class="valid-value"><code>us-east-2</code></p><p class="valid-value"><code>us-west-1</code></p><p class="valid-value"><code>us-west-2</code></p></td> </tr><tr><th>Valores válidos (≤ 8.0.16)</th> <td><p class="valid-value"><code>ap-northeast-1</code></p><p class="valid-value"><code>ap-northeast-2</code></p><p class="valid-value"><code>ap-south-1</code></p><p class="valid-value"><code>ap-southeast-1</code></p><p class="valid-value"><code>ap-southeast-2</code></p><p class="valid-value"><code>eu-central-1</code></p><p class="valid-value"><code>eu-west-1</code></p><p class="valid-value"><code>sa-east-1</code></p><p class="valid-value"><code>us-east-1</code></p><p class="valid-value"><code>us-west-1</code></p><p class="valid-value"><code>us-west-2</code></p></td> </tr></tbody></table>3

O OCID do Vault da Oracle Cloud Infrastructure que o plugin `keyring_oci` usa para operações de criptografia. Essa variável não está disponível, a menos que o plugin esteja instalado.

Antes de usar `keyring_oci`, você deve criar um novo cofre no compartimento MySQL, se ele não existir. (Alternativamente, você pode reutilizar um cofre existente que esteja em um compartimento pai do compartimento MySQL.) Os usuários do compartimento podem ver e usar apenas as chaves em seus respectivos compartimentos.

Para obter informações sobre como criar um cofre e obter o OCID do cofre, consulte [Gerenciamento de cofres][(https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm)].

Essa variável é obrigatória. Se não for especificada, a inicialização de `keyring_oci` falha.

* `keyring_okv_conf_dir`

  <table frame="box" rules="all" summary="Properties for keyring_aws_region"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-region=value</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_region</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>us-east-1</code></td> </tr><tr><th>Valores válidos (≥ 8.0.30)</th> <td><p class="valid-value"><code>af-south-1</code></p><p class="valid-value"><code>ap-east-1</code></p><p class="valid-value"><code>ap-northeast-1</code></p><p class="valid-value"><code>ap-northeast-2</code></p><p class="valid-value"><code>ap-northeast-3</code></p><p class="valid-value"><code>ap-south-1</code></p><p class="valid-value"><code>ap-southeast-1</code></p><p class="valid-value"><code>ap-southeast-2</code></p><p class="valid-value"><code>ca-central-1</code></p><p class="valid-value"><code>cn-north-1</code></p><p class="valid-value"><code>cn-northwest-1</code></p><p class="valid-value"><code>eu-central-1</code></p><p class="valid-value"><code>eu-north-1</code></p><p class="valid-value"><code>eu-south-1</code></p><p class="valid-value"><code>eu-west-1</code></p><p class="valid-value"><code>eu-west-2</code></p><p class="valid-value"><code>eu-west-3</code></p><p class="valid-value"><code>me-south-1</code></p><p class="valid-value"><code>sa-east-1</code></p><p class="valid-value"><code>us-east-1</code></p><p class="valid-value"><code>us-east-2</code></p><p class="valid-value"><code>us-gov-east-1</code></p><p class="valid-value"><code>us-iso-east-1</code></p><p class="valid-value"><code>us-iso-west-1</code></p><p class="valid-value"><code>us-isob-east-1</code></p><p class="valid-value"><code>us-west-1</code></p><p class="valid-value"><code>us-west-2</code></p></td> </tr><tr><th>Valores válidos (≥ 8.0.17, ≤ 8.0.29)</th> <td><p class="valid-value"><code>ap-northeast-1</code></p><p class="valid-value"><code>ap-northeast-2</code></p><p class="valid-value"><code>ap-south-1</code></p><p class="valid-value"><code>ap-southeast-1</code></p><p class="valid-value"><code>ap-southeast-2</code></p><p class="valid-value"><code>ca-central-1</code></p><p class="valid-value"><code>cn-north-1</code></p><p class="valid-value"><code>cn-northwest-1</code></p><p class="valid-value"><code>eu-central-1</code></p><p class="valid-value"><code>eu-west-1</code></p><p class="valid-value"><code>eu-west-2</code></p><p class="valid-value"><code>eu-west-3</code></p><p class="valid-value"><code>sa-east-1</code></p><p class="valid-value"><code>us-east-1</code></p><p class="valid-value"><code>us-east-2</code></p><p class="valid-value"><code>us-west-1</code></p><p class="valid-value"><code>us-west-2</code></p></td> </tr><tr><th>Valores válidos (≤ 8.0.16)</th> <td><p class="valid-value"><code>ap-northeast-1</code></p><p class="valid-value"><code>ap-northeast-2</code></p><p class="valid-value"><code>ap-south-1</code></p><p class="valid-value"><code>ap-southeast-1</code></p><p class="valid-value"><code>ap-southeast-2</code></p><p class="valid-value"><code>eu-central-1</code></p><p class="valid-value"><code>eu-west-1</code></p><p class="valid-value"><code>sa-east-1</code></p><p class="valid-value"><code>us-east-1</code></p><p class="valid-value"><code>us-west-1</code></p><p class="valid-value"><code>us-west-2</code></p></td> </tr></tbody></table>4

O nome do caminho do diretório que armazena as informações de configuração usadas pelo plugin `keyring_okv`. Essa variável não está disponível a menos que esse plugin esteja instalado. O local deve ser um diretório considerado para uso apenas pelo plugin `keyring_okv`. Por exemplo, não localize o diretório sob o diretório de dados.

O valor padrão `keyring_okv_conf_dir` está vazio. Para que o plugin `keyring_okv` possa acessar o Oracle Key Vault, o valor deve ser definido para um diretório que contenha a configuração e os materiais SSL do Oracle Key Vault. Para obter instruções sobre a configuração desse diretório, consulte a Seção 8.4.4.8, “Usando o plugin keyring_okv KMIP”.

O diretório deve ter um modo restritivo e ser acessível apenas à conta usada para executar o servidor MySQL. Por exemplo, em sistemas Unix e Unix-like, para usar o diretório `/usr/local/mysql/mysql-keyring-okv`, os seguintes comandos (executados como `root`) criam o diretório e definem seu modo e propriedade:

  ```
  cd /usr/local/mysql
  mkdir mysql-keyring-okv
  chmod 750 mysql-keyring-okv
  chown mysql mysql-keyring-okv
  chgrp mysql mysql-keyring-okv
  ```

Se o valor atribuído a `keyring_okv_conf_dir` especificar um diretório que não existe ou que não contém informações de configuração que permitam estabelecer uma conexão com o Oracle Key Vault, `keyring_okv` escreve uma mensagem de erro no log de erro. Se uma tentativa de atribuição de tempo de execução a `keyring_okv_conf_dir` resultar em um erro, o valor da variável e a operação do chaveiro permanecem inalterados.

* `keyring_operations`

  <table frame="box" rules="all" summary="Properties for keyring_aws_region"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-region=value</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_region</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>us-east-1</code></td> </tr><tr><th>Valores válidos (≥ 8.0.30)</th> <td><p class="valid-value"><code>af-south-1</code></p><p class="valid-value"><code>ap-east-1</code></p><p class="valid-value"><code>ap-northeast-1</code></p><p class="valid-value"><code>ap-northeast-2</code></p><p class="valid-value"><code>ap-northeast-3</code></p><p class="valid-value"><code>ap-south-1</code></p><p class="valid-value"><code>ap-southeast-1</code></p><p class="valid-value"><code>ap-southeast-2</code></p><p class="valid-value"><code>ca-central-1</code></p><p class="valid-value"><code>cn-north-1</code></p><p class="valid-value"><code>cn-northwest-1</code></p><p class="valid-value"><code>eu-central-1</code></p><p class="valid-value"><code>eu-north-1</code></p><p class="valid-value"><code>eu-south-1</code></p><p class="valid-value"><code>eu-west-1</code></p><p class="valid-value"><code>eu-west-2</code></p><p class="valid-value"><code>eu-west-3</code></p><p class="valid-value"><code>me-south-1</code></p><p class="valid-value"><code>sa-east-1</code></p><p class="valid-value"><code>us-east-1</code></p><p class="valid-value"><code>us-east-2</code></p><p class="valid-value"><code>us-gov-east-1</code></p><p class="valid-value"><code>us-iso-east-1</code></p><p class="valid-value"><code>us-iso-west-1</code></p><p class="valid-value"><code>us-isob-east-1</code></p><p class="valid-value"><code>us-west-1</code></p><p class="valid-value"><code>us-west-2</code></p></td> </tr><tr><th>Valores válidos (≥ 8.0.17, ≤ 8.0.29)</th> <td><p class="valid-value"><code>ap-northeast-1</code></p><p class="valid-value"><code>ap-northeast-2</code></p><p class="valid-value"><code>ap-south-1</code></p><p class="valid-value"><code>ap-southeast-1</code></p><p class="valid-value"><code>ap-southeast-2</code></p><p class="valid-value"><code>ca-central-1</code></p><p class="valid-value"><code>cn-north-1</code></p><p class="valid-value"><code>cn-northwest-1</code></p><p class="valid-value"><code>eu-central-1</code></p><p class="valid-value"><code>eu-west-1</code></p><p class="valid-value"><code>eu-west-2</code></p><p class="valid-value"><code>eu-west-3</code></p><p class="valid-value"><code>sa-east-1</code></p><p class="valid-value"><code>us-east-1</code></p><p class="valid-value"><code>us-east-2</code></p><p class="valid-value"><code>us-west-1</code></p><p class="valid-value"><code>us-west-2</code></p></td> </tr><tr><th>Valores válidos (≤ 8.0.16)</th> <td><p class="valid-value"><code>ap-northeast-1</code></p><p class="valid-value"><code>ap-northeast-2</code></p><p class="valid-value"><code>ap-south-1</code></p><p class="valid-value"><code>ap-southeast-1</code></p><p class="valid-value"><code>ap-southeast-2</code></p><p class="valid-value"><code>eu-central-1</code></p><p class="valid-value"><code>eu-west-1</code></p><p class="valid-value"><code>sa-east-1</code></p><p class="valid-value"><code>us-east-1</code></p><p class="valid-value"><code>us-west-1</code></p><p class="valid-value"><code>us-west-2</code></p></td> </tr></tbody></table>5

Se as operações de chave de bolso estão habilitadas. Esta variável é usada durante as operações de migração de chave. Veja a Seção 8.4.4.14, “Migrando Chaves entre Keystores de Chave de Bolso”. Os privilégios necessários para modificar esta variável são `ENCRYPTION_KEY_ADMIN`, além de `SYSTEM_VARIABLES_ADMIN` ou o privilégio obsoleto `SUPER`.

### 8.4.5 Auditoria da MySQL Enterprise

Nota

O MySQL Enterprise Audit é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL inclui o MySQL Enterprise Audit, implementado usando um plugin de servidor chamado `audit_log`. O MySQL Enterprise Audit utiliza a API de auditoria aberta do MySQL para permitir monitoramento, registro e bloqueio padrão baseado em políticas de atividade de conexão e consulta executada em servidores MySQL específicos. Projetado para atender à especificação de auditoria da Oracle, o MySQL Enterprise Audit oferece uma solução de auditoria e conformidade fácil de usar, pronta para uso, para aplicativos que são regidos por diretrizes regulatórias internas e externas.

Quando instalado, o plugin de auditoria permite que o MySQL Server produza um arquivo de registro contendo um registro de auditoria da atividade do servidor. O conteúdo do log inclui quando os clientes se conectam e desconectam, e quais ações eles realizam enquanto estão conectados, como quais bancos de dados e tabelas eles acessam. A partir do MySQL 8.0.30, você pode adicionar estatísticas para o tempo e o tamanho de cada consulta para detectar valores atípicos.

Por padrão, o MySQL Enterprise Audit usa tabelas no banco de dados do sistema `mysql` para armazenamento persistente de dados de filtro e contas de usuário. Para usar um banco de dados diferente, defina a variável de sistema `audit_log_database` na inicialização do servidor (a partir do MySQL 8.0.33).

Depois de instalar o plugin de auditoria (consulte a Seção 8.4.5.2, “Instalando ou Desinstalando Auditoria MySQL Enterprise”), ele escreve um arquivo de registro de auditoria. Por padrão, o arquivo é denominado `audit.log` no diretório de dados do servidor. Para alterar o nome do arquivo, defina a variável de sistema `audit_log_file` na inicialização do servidor.

Por padrão, o conteúdo do arquivo de registro de auditoria é escrito no formato XML de novo estilo, sem compressão ou criptografia. Para selecionar o formato do arquivo, defina a variável de sistema `audit_log_format` na inicialização do servidor. Para obter detalhes sobre o formato e o conteúdo do arquivo, consulte a Seção 8.4.5.4, “Formatos de Arquivos de Registro de Auditoria”.

Para obter mais informações sobre como controlar a ocorrência do registro, incluindo o nomeação e a seleção do formato do arquivo de registro de auditoria, consulte a Seção 8.4.5.5, “Configurando as Características do Registro de Auditoria”. Para realizar o filtro de eventos auditados, consulte a Seção 8.4.5.7, “Filtro do Registro de Auditoria”. Para descrições dos parâmetros usados para configurar o plugin de registro de auditoria, consulte Opções e Variáveis do Registro de Auditoria.

Se o plugin de registro de auditoria estiver habilitado, o Schema de desempenho (consulte o Capítulo 29, *Schema de desempenho do MySQL*) possui instrumentação para isso. Para identificar os instrumentos relevantes, use esta consulta:

```
SELECT NAME FROM performance_schema.setup_instruments
WHERE NAME LIKE '%/alog/%';
```

#### 8.4.5.1 Elementos da Auditoria da MySQL Enterprise

O MySQL Enterprise Audit é baseado no plugin de registro de auditoria e nos elementos relacionados:

* Um plugin do lado do servidor chamado `audit_log` examina eventos audíveis e determina se devem ser escritos no log de auditoria.

* Um conjunto de funções permite a manipulação de definições de filtragem que controlam o comportamento de registro, a senha de criptografia e a leitura de arquivos de registro.

* As tabelas no banco de dados do sistema `mysql` fornecem armazenamento persistente de dados de filtro e de conta de usuário, a menos que você defina a variável de sistema `audit_log_database` na inicialização do servidor para especificar um banco de dados diferente.

* As variáveis do sistema permitem a configuração do log de auditoria e as variáveis de status fornecem informações operacionais em tempo real.

* O privilégio `AUDIT_ADMIN` permite que os usuários administrem o registro de auditoria, e (a partir do MySQL 8.0.28) o privilégio `AUDIT_ABORT_EXEMPT` permite que os usuários do sistema executem consultas que, de outra forma, seriam bloqueadas por um item "abort" no filtro do registro de auditoria.

#### 8.4.5.2 Instalar ou desinstalar o MySQL Enterprise Audit

Esta seção descreve como instalar ou desinstalar o MySQL Enterprise Audit, que é implementado usando o plugin de registro de auditoria e elementos relacionados descritos na Seção 8.4.5.1, “Elementos do MySQL Enterprise Audit”. Para informações gerais sobre a instalação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

As atualizações de plugins não são automáticas quando você atualiza uma instalação do MySQL e algumas funções carregáveis de plugin devem ser carregadas manualmente (consulte Instalar funções carregáveis). Alternativamente, você pode reinstalar o plugin após atualizar o MySQL para carregar novas funções.

Importante

Leia toda essa seção antes de seguir as instruções. Algumas partes do procedimento diferem dependendo do seu ambiente.

Nota

Se instalado, o plugin `audit_log` envolve um pequeno sobrecarga mesmo quando desativado. Para evitar essa sobrecarga, não instale o MySQL Enterprise Audit a menos que você planeje usá-lo.

Para ser utilizável pelo servidor, o arquivo da biblioteca de plugins deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin, definindo o valor de `plugin_dir` na inicialização do servidor.

Para instalar o MySQL Enterprise Audit, procure no diretório `share` da sua instalação do MySQL e escolha o script apropriado para sua plataforma. Os scripts disponíveis diferem no nome do arquivo usado para se referir ao script:

* `audit_log_filter_win_install.sql`
* `audit_log_filter_linux_install.sql`

Execute o script da seguinte forma. O exemplo aqui usa o script de instalação do Linux. Faça a substituição apropriada para o seu sistema.

Antes do MySQL 8.0.34:

```
$> mysql -u root -p < audit_log_filter_linux_install.sql
Enter password: (enter root password here)
```

MySQL 8.0.34 e superior:

```
$> mysql -u root -p -D mysql < audit_log_filter_linux_install.sql
Enter password: (enter root password here)
```

A partir do MySQL 8.0.34, é possível selecionar um banco de dados para armazenar tabelas de filtro JSON ao executar o script de instalação. Crie o banco de dados primeiro; seu nome não deve exceder 64 caracteres. Por exemplo:

```
mysql> CREATE DATABASE IF NOT EXISTS database-name;
```

Em seguida, execute o script usando o nome alternativo do banco de dados.

```
$> mysql -u root -p -D database-name < audit_log_filter_linux_install.sql
Enter password: (enter root password here)
```

Nota

Algumas versões do MySQL introduziram mudanças na estrutura das tabelas de Auditoria do MySQL Enterprise. Para garantir que suas tabelas estejam atualizadas para atualizações de versões anteriores do MySQL 8.0, realize o procedimento de atualização do MySQL, garantindo que use a opção que força uma atualização (consulte o Capítulo 3, *Atualizando o MySQL*). Se você preferir executar as declarações de atualização apenas para as tabelas de Auditoria do MySQL Enterprise, consulte a discussão a seguir.

A partir do MySQL 8.0.12, para novas instalações do MySQL, as colunas `USER` e `HOST` na tabela `audit_log_user` usada pelo MySQL Enterprise Audit têm definições que correspondem melhor às definições das colunas `User` e `Host` na tabela de sistema [[`mysql.user`]. Para atualizações para uma instalação para a qual o MySQL Enterprise Audit já está instalado, é recomendável alterar as definições da tabela da seguinte forma:

```
ALTER TABLE mysql.audit_log_user
  DROP FOREIGN KEY audit_log_user_ibfk_1;
ALTER TABLE mysql.audit_log_filter
  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci;
ALTER TABLE mysql.audit_log_user
  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci;
ALTER TABLE mysql.audit_log_user
  MODIFY COLUMN USER VARCHAR(32);
ALTER TABLE mysql.audit_log_user
  ADD FOREIGN KEY (FILTERNAME) REFERENCES mysql.audit_log_filter(NAME);
```

Nota

Para usar o MySQL Enterprise Audit no contexto da replicação de origem/replica, Replicação por Grupo ou InnoDB Cluster, você deve preparar os nós da replicação antes de executar o script de instalação no nó de origem. Isso é necessário porque a declaração `INSTALL PLUGIN` no script não é replicada.

1. Em cada nó replica, extraia a declaração `INSTALL PLUGIN` do script de instalação e execute-a manualmente.

2. No nó de origem, execute o script de instalação conforme descrito anteriormente.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 7.6.2, “Obtenção de Informações do Plugin do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'audit%';
+-------------+---------------+
| PLUGIN_NAME | PLUGIN_STATUS |
+-------------+---------------+
| audit_log   | ACTIVE        |
+-------------+---------------+
```

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

Após a instalação do MySQL Enterprise Audit, você pode usar a opção `--audit-log` para o início subsequente do servidor para controlar a ativação do plugin `audit_log`. Por exemplo, para impedir que o plugin seja removido em tempo de execução, use esta opção:

```
[mysqld]
audit-log=FORCE_PLUS_PERMANENT
```

Se quiser impedir que o servidor seja executado sem o plugin de auditoria, use `--audit-log` com um valor de `FORCE` ou `FORCE_PLUS_PERMANENT` para forçar o fracasso da inicialização do servidor se o plugin não for iniciado com sucesso.

Importante

Por padrão, o filtro de logs de auditoria baseado em regras não registra eventos audíveis para nenhum usuário. Isso difere do comportamento do registro de auditoria legítimo, que registra todos os eventos audíveis para todos os usuários (consulte a Seção 8.4.5.10, “Filtro de Registro de Auditoria de Modo Legado”). Se você deseja produzir um comportamento de registro de tudo com filtro baseado em regras, crie um filtro simples para habilitar o registro e atribua-o à conta padrão:

```
SELECT audit_log_filter_set_filter('log_all', '{ "filter": { "log": true } }');
SELECT audit_log_filter_set_user('%', 'log_all');
```

O filtro atribuído a `%` é usado para conexões de qualquer conta que não tenha um filtro explicitamente atribuído (o que inicialmente é verdadeiro para todas as contas).

Quando instalado conforme descrito, o MySQL Enterprise Audit permanece instalado até que seja desinstalado. Para removê-lo no MySQL 8.0.35 e versões posteriores, execute o script de desinstalação localizado no diretório `share` da sua instalação do MySQL. O exemplo aqui especifica o banco de dados padrão do sistema, `mysql`. Faça a substituição apropriada para o seu sistema.

```
$> mysql -u root -p -D mysql < audit_log_filter_uninstall.sql
Enter password: (enter root password here)
```

Se o script não estiver disponível, execute as seguintes instruções para remover as tabelas, o plugin e as funções manualmente.

```
DROP TABLE IF EXISTS mysql.audit_log_user;
DROP TABLE IF EXISTS mysql.audit_log_filter;
UNINSTALL PLUGIN audit_log;
DROP FUNCTION audit_log_filter_set_filter;
DROP FUNCTION audit_log_filter_remove_filter;
DROP FUNCTION audit_log_filter_set_user;
DROP FUNCTION audit_log_filter_remove_user;
DROP FUNCTION audit_log_filter_flush;
DROP FUNCTION audit_log_encryption_password_get;
DROP FUNCTION audit_log_encryption_password_set;
DROP FUNCTION audit_log_read;
DROP FUNCTION audit_log_read_bookmark;
DROP FUNCTION audit_log_rotate;
```

#### 8.4.5.3 Considerações de segurança de auditoria do MySQL Enterprise

Por padrão, o conteúdo dos arquivos de registro de auditoria produzidos pelo plugin de registro de auditoria não são criptografados e podem conter informações sensíveis, como o texto das instruções SQL. Por razões de segurança, os arquivos de registro de auditoria devem ser escritos em um diretório acessível apenas ao servidor MySQL e aos usuários que têm um motivo legítimo para visualizar o log. O nome padrão do arquivo é `audit.log` no diretório de dados. Isso pode ser alterado definindo a variável de sistema `audit_log_file` na inicialização do servidor. Outros arquivos de registro de auditoria podem existir devido à rotação do log.

Para maior segurança, habilite a criptografia do arquivo de registro de auditoria. Veja Criptografar arquivos de registro de auditoria.

#### 8.4.5.4 Fóruns de arquivos de registro de auditoria

O servidor MySQL chama o plugin de registro de auditoria para escrever um registro de auditoria em seu arquivo de registro sempre que um evento audível ocorrer. Tipicamente, o primeiro registro de auditoria escrito após a inicialização do plugin contém a descrição do servidor e as opções de inicialização. Os elementos que seguem esse registro representam eventos como eventos de conexão e desconexão do cliente, declarações SQL executadas, e assim por diante. Apenas as declarações de nível superior são registradas, não as declarações dentro de programas armazenados, como gatilhos ou procedimentos armazenados. O conteúdo dos arquivos referenciados por declarações como `LOAD DATA`(load-data.html "15.2.9 LOAD DATA Statement") não é registrado.

Para selecionar o formato de registro que o plugin de registro de auditoria usa para escrever seu arquivo de registro, defina a variável de sistema `audit_log_format` na inicialização do servidor. Esses formatos estão disponíveis:

* Novo formato XML (`audit_log_format=NEW`): Um formato XML que tem melhor compatibilidade com o Oracle Audit Vault do que o formato XML de estilo antigo. O MySQL 8.0 usa o novo formato XML por padrão.

* Formato XML de estilo antigo (`audit_log_format=OLD`): O formato original do registro de auditoria usado por padrão nas versões mais antigas do MySQL.

* Formato JSON (`audit_log_format=JSON`): Escreve o registro de auditoria como um array JSON. Apenas este formato suporta as estatísticas opcionais de tempo e tamanho da consulta, que estão disponíveis a partir do MySQL 8.0.30.

Por padrão, o conteúdo do arquivo de registro de auditoria é escrito no formato XML de novo estilo, sem compressão ou criptografia.

Se você alterar `audit_log_format`, é recomendável que você também altere `audit_log_file`. Por exemplo, se você definir `audit_log_format` para `JSON`, defina `audit_log_file` para `audit.json`. Caso contrário, os arquivos de registro mais recentes terão um formato diferente dos arquivos mais antigos, mas todos eles terão o mesmo nome de base, sem nada que indique quando o formato foi alterado.

* Novo formato de arquivo de registro de auditoria XML
* Antigo formato de arquivo de registro de auditoria XML
* Formato de arquivo de registro de auditoria JSON

##### Novo formato de arquivo de registro de auditoria XML

Aqui está um arquivo de registro de exemplo no formato XML de novo estilo (`audit_log_format=NEW`), reformatado ligeiramente para melhor legibilidade:

```
<?xml version="1.0" encoding="utf-8"?>
<AUDIT>
 <AUDIT_RECORD>
  <TIMESTAMP>2019-10-03T14:06:33 UTC</TIMESTAMP>
  <RECORD_ID>1_2019-10-03T14:06:33</RECORD_ID>
  <NAME>Audit</NAME>
  <SERVER_ID>1</SERVER_ID>
  <VERSION>1</VERSION>
  <STARTUP_OPTIONS>/usr/local/mysql/bin/mysqld
    --socket=/usr/local/mysql/mysql.sock
    --port=3306</STARTUP_OPTIONS>
  <OS_VERSION>i686-Linux</OS_VERSION>
  <MYSQL_VERSION>5.7.21-log</MYSQL_VERSION>
 </AUDIT_RECORD>
 <AUDIT_RECORD>
  <TIMESTAMP>2019-10-03T14:09:38 UTC</TIMESTAMP>
  <RECORD_ID>2_2019-10-03T14:06:33</RECORD_ID>
  <NAME>Connect</NAME>
  <CONNECTION_ID>5</CONNECTION_ID>
  <STATUS>0</STATUS>
  <STATUS_CODE>0</STATUS_CODE>
  <USER>root</USER>
  <OS_LOGIN/>
  <HOST>localhost</HOST>
  <IP>127.0.0.1</IP>
  <COMMAND_CLASS>connect</COMMAND_CLASS>
  <CONNECTION_TYPE>SSL/TLS</CONNECTION_TYPE>
  <CONNECTION_ATTRIBUTES>
   <ATTRIBUTE>
    <NAME>_pid</NAME>
    <VALUE>42794</VALUE>
   </ATTRIBUTE>
   ...
   <ATTRIBUTE>
    <NAME>program_name</NAME>
    <VALUE>mysqladmin</VALUE>
   </ATTRIBUTE>
  </CONNECTION_ATTRIBUTES>
  <PRIV_USER>root</PRIV_USER>
  <PROXY_USER/>
  <DB>test</DB>
 </AUDIT_RECORD>

...

 <AUDIT_RECORD>
  <TIMESTAMP>2019-10-03T14:09:38 UTC</TIMESTAMP>
  <RECORD_ID>6_2019-10-03T14:06:33</RECORD_ID>
  <NAME>Query</NAME>
  <CONNECTION_ID>5</CONNECTION_ID>
  <STATUS>0</STATUS>
  <STATUS_CODE>0</STATUS_CODE>
  <USER>root[root] @ localhost [127.0.0.1]</USER>
  <OS_LOGIN/>
  <HOST>localhost</HOST>
  <IP>127.0.0.1</IP>
  <COMMAND_CLASS>drop_table</COMMAND_CLASS>
  <SQLTEXT>DROP TABLE IF EXISTS t</SQLTEXT>
 </AUDIT_RECORD>

...

 <AUDIT_RECORD>
  <TIMESTAMP>2019-10-03T14:09:39 UTC</TIMESTAMP>
  <RECORD_ID>8_2019-10-03T14:06:33</RECORD_ID>
  <NAME>Quit</NAME>
  <CONNECTION_ID>5</CONNECTION_ID>
  <STATUS>0</STATUS>
  <STATUS_CODE>0</STATUS_CODE>
  <USER>root</USER>
  <OS_LOGIN/>
  <HOST>localhost</HOST>
  <IP>127.0.0.1</IP>
  <COMMAND_CLASS>connect</COMMAND_CLASS>
  <CONNECTION_TYPE>SSL/TLS</CONNECTION_TYPE>
 </AUDIT_RECORD>

...

 <AUDIT_RECORD>
  <TIMESTAMP>2019-10-03T14:09:43 UTC</TIMESTAMP>
  <RECORD_ID>11_2019-10-03T14:06:33</RECORD_ID>
  <NAME>Quit</NAME>
  <CONNECTION_ID>6</CONNECTION_ID>
  <STATUS>0</STATUS>
  <STATUS_CODE>0</STATUS_CODE>
  <USER>root</USER>
  <OS_LOGIN/>
  <HOST>localhost</HOST>
  <IP>127.0.0.1</IP>
  <COMMAND_CLASS>connect</COMMAND_CLASS>
  <CONNECTION_TYPE>SSL/TLS</CONNECTION_TYPE>
 </AUDIT_RECORD>
 <AUDIT_RECORD>
  <TIMESTAMP>2019-10-03T14:09:45 UTC</TIMESTAMP>
  <RECORD_ID>12_2019-10-03T14:06:33</RECORD_ID>
  <NAME>NoAudit</NAME>
  <SERVER_ID>1</SERVER_ID>
 </AUDIT_RECORD>
</AUDIT>
```

O arquivo de registro de auditoria é escrito em XML, usando UTF-8 (até 4 bytes por caractere). O elemento raiz é `<AUDIT>`. O elemento raiz contém elementos `<AUDIT_RECORD>`, cada um dos quais fornece informações sobre um evento auditado. Quando o plugin de registro de auditoria começa a escrever um novo arquivo de registro, ele escreve a declaração XML e o elemento raiz de abertura `<AUDIT>`. Quando o plugin fecha um arquivo de registro, ele escreve o elemento raiz de fechamento `</AUDIT>`. O tag de fechamento não está presente enquanto o arquivo está aberto.

Os elementos dentro dos elementos `<AUDIT_RECORD>` têm essas características:

* Alguns elementos aparecem em todos os elementos `<AUDIT_RECORD>`. Outros são opcionais e podem aparecer dependendo do tipo de registro de auditoria.

* A ordem dos elementos dentro de um elemento `<AUDIT_RECORD>` não é garantida.

* Os valores dos elementos não têm comprimento fixo. Os valores longos podem ser truncados conforme indicado nas descrições dos elementos fornecidas mais adiante.

Os caracteres `<`, `>`, `"` e `&` são codificados como `&lt;`, `&gt;`, `&quot;` e `&amp;`, respectivamente. Os bytes NUL (U+00) são codificados como o caractere `?`.

* Caracteres não válidos como caracteres XML são codificados usando referências de caracteres numéricos. Caracteres válidos XML são:

  ```
  #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
  ```

Os seguintes elementos são obrigatórios em todos os elementos `<AUDIT_RECORD>`:

* `<NAME>`

Uma cadeia que representa o tipo de instrução que gerou o evento de auditoria, como um comando que o servidor recebeu de um cliente.

Exemplo:

  ```
  <NAME>Query</NAME>
  ```

Alguns valores comuns do `<NAME>`:

  ```
  Audit    When auditing starts, which may be server startup time
  Connect  When a client connects, also known as logging in
  Query    An SQL statement (executed directly)
  Prepare  Preparation of an SQL statement; usually followed by Execute
  Execute  Execution of an SQL statement; usually follows Prepare
  Shutdown Server shutdown
  Quit     When a client disconnects
  NoAudit  Auditing has been turned off
  ```

Os valores possíveis são `Audit`, `Binlog Dump`, `Change user`, `Close stmt`, `Connect Out`, `Connect`, `Create DB`, `Daemon`, `Debug`, `Delayed insert`, `Drop DB`, `Execute`, `Fetch`, `Field List`, `Init DB`, `Kill`, `Long Data`, `NoAudit`, `Ping`, `Prepare`, `Processlist`, `Query`, `Quit`, `Refresh`, `Register Slave`, `Reset stmt`, `Set option`, `Shutdown`, `Sleep`, `Statistics`, `Table Dump`, `TableDelete`, `TableInsert`, `TableRead`, `TableUpdate`, `Time`.

Muitos desses valores correspondem aos valores dos comandos `COM_xxx` listados no arquivo de cabeçalho `my_command.h`. Por exemplo, `Create DB` e `Change user` correspondem a `COM_CREATE_DB` e `COM_CHANGE_USER`, respectivamente.

Eventos com valores de `<NAME>` de `TableXXX` acompanham eventos de `Query`. Por exemplo, a seguinte declaração gera um evento de `Query`, dois eventos de `TableRead` e um evento de `TableInsert`:

  ```
  INSERT INTO t3 SELECT t1.* FROM t1 JOIN t2;
  ```

Cada evento `TableXXX` contém `<table>` and `<db>` elements to identify the table to which the event refers and the database that contains the table.

* `<record_id>`

  A unique identifier for the audit record. The value is composed from a sequence number and timestamp, in the format `SEQ_TIMESTAMP`. When the audit log plugin opens the audit log file, it initializes the sequence number to the size of the audit log file, then increments the sequence by 1 for each record logged. The timestamp is a UTC value in `YYYY-MM-DDThh:mm:ss` format indicating the date and time when the audit log plugin opened the file.

  Example:

  ```
  <RECORD_ID>12_2019-10-03T14:06:33</RECORD_ID>
  ```

* `<timestamp>`

  A string representing a UTC value in `YYYY-MM-DDThh:mm:ss UTC` format indicating the date and time when the audit event was generated. For example, the event corresponding to execution of an SQL statement received from a client has a `<timestamp>` value occurring after the statement finishes, not when it was received.

  Example:

  ```
  <TIMESTAMP>2019-10-03T14:09:45 UTC</TIMESTAMP>
  ```

The following elements are optional in `<audit_record>` elements. Many of them occur only with specific `<name>` element values.

* `<command_class>`

  A string that indicates the type of action performed.

  Example:

  ```
  <COMMAND_CLASS>drop_table</COMMAND_CLASS>
  ```

  The values correspond to the `statement/sql/xxx` command counters. For example, *`xxx`* is `drop_table` and `select` for [`DROP TABLE`](drop-table.html "15.1.32 DROP TABLE Statement") and `SELECT` statements, respectively. The following statement displays the possible names:

  ```
  SELECT REPLACE(EVENT_NAME, 'statement/sql/', '') AS name
  FROM performance_schema.events_statements_summary_global_by_event_name
  WHERE EVENT_NAME LIKE 'statement/sql/%'
  ORDER BY name;
  ```

* `<connection_attributes>`

  As of MySQL 8.0.19, events with a `<command_class>` value of `connect` may include a `<connection_attributes>` element to display the connection attributes passed by the client at connect time. (For information about these attributes, which are also exposed in Performance Schema tables, see Section 29.12.9, “Performance Schema Connection Attribute Tables”.)

  The `<connection_attributes>` element contains one `<attribute>` element per attribute, each of which contains `<name>` and `<value>` elements to indicate the attribute name and value, respectively.

  Example:

  ```
  <CONNECTION_ATTRIBUTES>
   <ATTRIBUTE>
    <NAME>_pid</NAME>
    <VALUE>42794</VALUE>
   </ATTRIBUTE>
   <ATTRIBUTE>
    <NAME>_os</NAME>
    <VALUE>macos0.14</VALUE>
   </ATTRIBUTE>
   <ATTRIBUTE>
    <NAME>_platform</NAME>
    <VALUE>x86_64</VALUE>
   </ATTRIBUTE>
   <ATTRIBUTE>
    <NAME>_client_version</NAME>
    <VALUE>8.0.19</VALUE>
   </ATTRIBUTE>
   <ATTRIBUTE>
    <NAME>_client_name</NAME>
    <VALUE>libmysql</VALUE>
   </ATTRIBUTE>
   <ATTRIBUTE>
    <NAME>program_name</NAME>
    <VALUE>mysqladmin</VALUE>
   </ATTRIBUTE>
  </CONNECTION_ATTRIBUTES>
  ```

  If no connection attributes are present in the event, none are logged and no `<connection_attributes>` element appears. This can occur if the connection attempt is unsuccessful, the client passes no attributes, or the connection occurs internally such as during server startup or when initiated by a plugin.

* `<connection_id>`

  An unsigned integer representing the client connection identifier. This is the same as the value returned by the `CONNECTION_ID()` function within the session.

  Example:

  ```
  <CONNECTION_ID>127</CONNECTION_ID>
  ```

* `<connection_type>`

  The security state of the connection to the server. Permitted values are `TCP/IP` (TCP/IP connection established without encryption), `SSL/TLS` (TCP/IP connection established with encryption), `Socket` (Unix socket file connection), `Named Pipe` (Windows named pipe connection), and `Shared Memory` (Windows shared memory connection).

  Example:

  ```
  <CONNECTION_TYPE>SSL/TLS</CONNECTION_TYPE>
  ```

* `<db>`

  A string representing a database name.

  Example:

  ```
  <DB>test</DB>
  ```

  For connect events, this element indicates the default database; the element is empty if there is no default database. For table-access events, the element indicates the database to which the accessed table belongs.

* `<host>`

  A string representing the client host name.

  Example:

  ```
  <HOST>localhost</HOST>
  ```

* `<ip>`

  A string representing the client IP address.

  Example:

  ```
  <IP>127.0.0.1</IP>
  ```

* `<mysql_version>`

  A string representing the MySQL server version. This is the same as the value of the `VERSION()` function or `version` system variable.

  Example:

  ```
  <MYSQL_VERSION>5.7.21-log</MYSQL_VERSION>
  ```

* `<os_login>`

  A string representing the external user name used during the authentication process, as set by the plugin used to authenticate the client. With native (built-in) MySQL authentication, or if the plugin does not set the value, this element is empty. The value is the same as that of the `external_user` system variable (see Section 8.2.19, “Proxy Users”).

  Example:

  ```
  <OS_LOGIN>jeffrey</OS_LOGIN>
  ```

* `<os_version>`

  A string representing the operating system on which the server was built or is running.

  Example:

  ```
  <OS_VERSION>x86_64-Linux</OS_VERSION>
  ```

* `<priv_user>`

  A string representing the user that the server authenticated the client as. This is the user name that the server uses for privilege checking, and may differ from the `<user>` value.

  Example:

  ```
  <PRIV_USER>jeffrey</PRIV_USER>
  ```

* `<proxy_user>`

  A string representing the proxy user (see Section 8.2.19, “Proxy Users”). The value is empty if user proxying is not in effect.

  Example:

  ```
  <PROXY_USER>developer</PROXY_USER>
  ```

* `<server_id>`

  An unsigned integer representing the server ID. This is the same as the value of the `server_id` system variable.

  Example:

  ```
  <SERVER_ID>1</SERVER_ID>
  ```

* `<sqltext>`

  A string representing the text of an SQL statement. The value can be empty. Long values may be truncated. The string, like the audit log file itself, is written using UTF-8 (up to 4 bytes per character), so the value may be the result of conversion. For example, the original statement might have been received from the client as an SJIS string.

  Example:

  ```
  <SQLTEXT>DELETE FROM t1</SQLTEXT>
  ```

* `<startup_options>`

  A string representing the options that were given on the command line or in option files when the MySQL server was started. The first option is the path to the server executable.

  Example:

  ```
  <STARTUP_OPTIONS>/usr/local/mysql/bin/mysqld
    --port=3306 --log_output=FILE</STARTUP_OPTIONS>
  ```

* `<status>`

  An unsigned integer representing the command status: 0 for success, nonzero if an error occurred. This is the same as the value of the `mysql_errno()` C API function. See the description for `<status_code>` for information about how it differs from `<status>`.

  The audit log does not contain the SQLSTATE value or error message. To see the associations between error codes, SQLSTATE values, and messages, see Server Error Message Reference.

  Warnings are not logged.

  Example:

  ```
  <STATUS>1051</STATUS>
  ```

* `<status_code>`

  An unsigned integer representing the command status: 0 for success, 1 if an error occurred.

  The `STATUS_CODE` value differs from the `STATUS` value: `STATUS_CODE` is 0 for success and 1 for error, which is compatible with the EZ_collector consumer for Audit Vault. `STATUS` is the value of the `mysql_errno()` C API function. This is 0 for success and nonzero for error, and thus is not necessarily 1 for error.

  Example:

  ```
  <STATUS_CODE>0</STATUS_CODE>
  ```

* `<table>`

  A string representing a table name.

  Example:

  ```
  <TABLE>t3</TABLE>
  ```

* `<user>`

  A string representing the user name sent by the client. This may differ from the `<priv_user>` value.

  Example:

  ```
  <USER>root[root] @ localhost [127.0.0.1]</USER>
  ```

* `<version>`

  An unsigned integer representing the version of the audit log file format.

  Example:

  ```
  <VERSION>1</VERSION>
  ```

##### Old-Style XML Audit Log File Format

Here is a sample log file in old-style XML format (`audit_log_format=OLD`), reformatted slightly for readability:

```
<?xml version="1.0" encoding="utf-8"?>
<AUDIT>
  <AUDIT_RECORD
    TIMESTAMP="2019-10-03T14:25:00 UTC"
    RECORD_ID="1_2019-10-03T14:25:00"
    NAME="Audit"
    SERVER_ID="1"
    VERSION="1"
    STARTUP_OPTIONS="--port=3306"
    OS_VERSION="i686-Linux"
    MYSQL_VERSION="5.7.21-log"/>
  <AUDIT_RECORD
    TIMESTAMP="2019-10-03T14:25:24 UTC"
    RECORD_ID="2_2019-10-03T14:25:00"
    NAME="Connect"
    CONNECTION_ID="4"
    STATUS="0"
    STATUS_CODE="0"
    USER="root"
    OS_LOGIN=""
    HOST="localhost"
    IP="127.0.0.1"
    COMMAND_CLASS="connect"
    CONNECTION_TYPE="SSL/TLS"
    PRIV_USER="root"
    PROXY_USER=""
    DB="test"/>

...

  <AUDIT_RECORD
    TIMESTAMP="2019-10-03T14:25:24 UTC"
    RECORD_ID="6_2019-10-03T14:25:00"
    NAME="Query"
    CONNECTION_ID="4"
    STATUS="0"
    STATUS_CODE="0"
    USER="root[root] @ localhost [127.0.0.1]"
    OS_LOGIN=""
    HOST="localhost"
    IP="127.0.0.1"
    COMMAND_CLASS="drop_table"
    SQLTEXT="DROP TABLE IF EXISTS t"/>

...

  <AUDIT_RECORD
    TIMESTAMP="2019-10-03T14:25:24 UTC"
    RECORD_ID="8_2019-10-03T14:25:00"
    NAME="Quit"
    CONNECTION_ID="4"
    STATUS="0"
    STATUS_CODE="0"
    USER="root"
    OS_LOGIN=""
    HOST="localhost"
    IP="127.0.0.1"
    COMMAND_CLASS="connect"
    CONNECTION_TYPE="SSL/TLS"/>
  <AUDIT_RECORD
    TIMESTAMP="2019-10-03T14:25:32 UTC"
    RECORD_ID="12_2019-10-03T14:25:00"
    NAME="NoAudit"
    SERVER_ID="1"/>
</AUDIT>
```

The audit log file is written as XML, using UTF-8 (up to 4 bytes per character). The root element is `<audit>`. The root element contains `<audit_record>` elements, each of which provides information about an audited event. When the audit log plugin begins writing a new log file, it writes the XML declaration and opening `<audit>` root element tag. When the plugin closes a log file, it writes the closing `</audit>` root element tag. The closing tag is not present while the file is open.

Attributes of `<audit_record>` elements have these characteristics:

* Some attributes appear in every `<audit_record>` element. Others are optional and may appear depending on the audit record type.

* Order of attributes within an `<audit_record>` element is not guaranteed.

* Attribute values are not fixed length. Long values may be truncated as indicated in the attribute descriptions given later.

* The `&lt;`, `&gt;`, `"`, and `&amp;` characters are encoded as `&lt;`, `&gt;`, `"`, and `&amp;`, respectively. NUL bytes (U+00) are encoded as the `?` character.

* Characters not valid as XML characters are encoded using numeric character references. Valid XML characters are:

  ```
  #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
  ```

The following attributes are mandatory in every `<audit_record>` element:

* `NAME`

  A string representing the type of instruction that generated the audit event, such as a command that the server received from a client.

  Example: `NAME="Query"`

  Some common `NAME` values:

  ```
  Audit    When auditing starts, which may be server startup time
  Connect  When a client connects, also known as logging in
  Query    An SQL statement (executed directly)
  Prepare  Preparation of an SQL statement; usually followed by Execute
  Execute  Execution of an SQL statement; usually follows Prepare
  Shutdown Server shutdown
  Quit     When a client disconnects
  NoAudit  Auditing has been turned off
  ```

  The possible values are `Audit`, `Binlog Dump`, `Change user`, `Close stmt`, `Connect Out`, `Connect`, `Create DB`, `Daemon`, `Debug`, `Delayed insert`, `Drop DB`, `Execute`, `Fetch`, `Field List`, `Init DB`, `Kill`, `Long Data`, `NoAudit`, `Ping`, `Prepare`, `Processlist`, `Query`, `Quit`, `Refresh`, `Register Slave`, `Reset stmt`, `Set option`, `Shutdown`, `Sleep`, `Statistics`, `Table Dump`, `TableDelete`, `TableInsert`, `TableRead`, `TableUpdate`, `Time`.

  Many of these values correspond to the `COM_xxx` command values listed in the `my_command.h` header file. For example, `"Create DB"` and `"Change user"` correspond to `COM_CREATE_DB` and `COM_CHANGE_USER`, respectively.

  Events having `NAME` values of `TableXXX` accompany `Query` events. For example, the following statement generates one `Query` event, two `TableRead` events, and a `TableInsert` events:

  ```
  INSERT INTO t3 SELECT t1.* FROM t1 JOIN t2;
  ```

  Each `TableXXX` event has `TABLE` and `DB` attributes to identify the table to which the event refers and the database that contains the table.

  `Connect` events for old-style XML audit log format do not include connection attributes.

* `RECORD_ID`

  A unique identifier for the audit record. The value is composed from a sequence number and timestamp, in the format `SEQ_TIMESTAMP`. When the audit log plugin opens the audit log file, it initializes the sequence number to the size of the audit log file, then increments the sequence by 1 for each record logged. The timestamp is a UTC value in `YYYY-MM-DDThh:mm:ss` format indicating the date and time when the audit log plugin opened the file.

  Example: `RECORD_ID="12_2019-10-03T14:25:00"`

* `TIMESTAMP`

  A string representing a UTC value in `YYYY-MM-DDThh:mm:ss UTC` format indicating the date and time when the audit event was generated. For example, the event corresponding to execution of an SQL statement received from a client has a `TIMESTAMP` value occurring after the statement finishes, not when it was received.

  Example: `TIMESTAMP="2019-10-03T14:25:32 UTC"`

The following attributes are optional in `<audit_record>` elements. Many of them occur only for elements with specific values of the `NAME` attribute.

* `COMMAND_CLASS`

  A string that indicates the type of action performed.

  Example: `COMMAND_CLASS="drop_table"`

  The values correspond to the `statement/sql/xxx` command counters. For example, *`xxx`* is `drop_table` and `select` for [`DROP TABLE`](drop-table.html "15.1.32 DROP TABLE Statement") and `SELECT` statements, respectively. The following statement displays the possible names:

  ```
  SELECT REPLACE(EVENT_NAME, 'statement/sql/', '') AS name
  FROM performance_schema.events_statements_summary_global_by_event_name
  WHERE EVENT_NAME LIKE 'statement/sql/%'
  ORDER BY name;
  ```

* `CONNECTION_ID`

  An unsigned integer representing the client connection identifier. This is the same as the value returned by the `CONNECTION_ID()` function within the session.

  Example: `CONNECTION_ID="127"`

* `CONNECTION_TYPE`

  The security state of the connection to the server. Permitted values are `TCP/IP` (TCP/IP connection established without encryption), `SSL/TLS` (TCP/IP connection established with encryption), `Socket` (Unix socket file connection), `Named Pipe` (Windows named pipe connection), and `Shared Memory` (Windows shared memory connection).

  Example: `CONNECTION_TYPE="SSL/TLS"`

* `DB`

  A string representing a database name.

  Example: `DB="test"`

  For connect events, this attribute indicates the default database; the attribute is empty if there is no default database. For table-access events, the attribute indicates the database to which the accessed table belongs.

* `HOST`

  A string representing the client host name.

  Example: `HOST="localhost"`

* `IP`

  A string representing the client IP address.

  Example: `IP="127.0.0.1"`

* `MYSQL_VERSION`

  A string representing the MySQL server version. This is the same as the value of the `VERSION()` function or `version` system variable.

  Example: `MYSQL_VERSION="5.7.21-log"`

* `OS_LOGIN`

  A string representing the external user name used during the authentication process, as set by the plugin used to authenticate the client. With native (built-in) MySQL authentication, or if the plugin does not set the value, this attribute is empty. The value is the same as that of the `external_user` system variable (see Section 8.2.19, “Proxy Users”).

  Example: `OS_LOGIN="jeffrey"`

* `OS_VERSION`

  A string representing the operating system on which the server was built or is running.

  Example: `OS_VERSION="x86_64-Linux"`

* `PRIV_USER`

  A string representing the user that the server authenticated the client as. This is the user name that the server uses for privilege checking, and it may differ from the `USER` value.

  Example: `PRIV_USER="jeffrey"`

* `PROXY_USER`

  A string representing the proxy user (see Section 8.2.19, “Proxy Users”). The value is empty if user proxying is not in effect.

  Example: `PROXY_USER="developer"`

* `SERVER_ID`

  An unsigned integer representing the server ID. This is the same as the value of the `server_id` system variable.

  Example: `SERVER_ID="1"`

* `SQLTEXT`

  A string representing the text of an SQL statement. The value can be empty. Long values may be truncated. The string, like the audit log file itself, is written using UTF-8 (up to 4 bytes per character), so the value may be the result of conversion. For example, the original statement might have been received from the client as an SJIS string.

  Example: `SQLTEXT="DELETE FROM t1"`

* `STARTUP_OPTIONS`

  A string representing the options that were given on the command line or in option files when the MySQL server was started.

  Example: `STARTUP_OPTIONS="--port=3306 --log_output=FILE"`

* `STATUS`

  An unsigned integer representing the command status: 0 for success, nonzero if an error occurred. This is the same as the value of the `mysql_errno()` C API function. See the description for `STATUS_CODE` for information about how it differs from `STATUS`.

  The audit log does not contain the SQLSTATE value or error message. To see the associations between error codes, SQLSTATE values, and messages, see Server Error Message Reference.

  Warnings are not logged.

  Example: `STATUS="1051"`

* `STATUS_CODE`

  An unsigned integer representing the command status: 0 for success, 1 if an error occurred.

  The `STATUS_CODE` value differs from the `STATUS` value: `STATUS_CODE` is 0 for success and 1 for error, which is compatible with the EZ_collector consumer for Audit Vault. `STATUS` is the value of the `mysql_errno()` C API function. This is 0 for success and nonzero for error, and thus is not necessarily 1 for error.

  Example: `STATUS_CODE="0"`

* `TABLE`

  A string representing a table name.

  Example: `TABLE="t3"`

* `USER`

  A string representing the user name sent by the client. This may differ from the `PRIV_USER` value.

* `VERSION`

  An unsigned integer representing the version of the audit log file format.

  Example: `VERSION="1"`

##### JSON Audit Log File Format

For JSON-format audit logging (`audit_log_format=JSON`), the log file contents form a `JSON` array with each array element representing an audited event as a `JSON` hash of key-value pairs. Examples of complete event records appear later in this section. The following is an excerpt of partial events:

```
[
  {
    "timestamp": "2019-10-03 13:50:01",
    "id": 0,
    "class": "audit",
    "event": "startup",
    ...
  },
  {
    "timestamp": "2019-10-03 15:02:32",
    "id": 0,
    "class": "connection",
    "event": "connect",
    ...
  },
  ...
  {
    "timestamp": "2019-10-03 17:37:26",
    "id": 0,
    "class": "table_access",
    "event": "insert",
      ...
  }
  ...
]
```

The audit log file is written using UTF-8 (up to 4 bytes per character). When the audit log plugin begins writing a new log file, it writes the opening `[` array marker. When the plugin closes a log file, it writes the closing `]` array marker. The closing marker is not present while the file is open.

Items within audit records have these characteristics:

* Some items appear in every audit record. Others are optional and may appear depending on the audit record type.

* Order of items within an audit record is not guaranteed.
* Item values are not fixed length. Long values may be truncated as indicated in the item descriptions given later.

* The `"` and `\` characters are encoded as `\"` and `\\`, respectively.

JSON format is the only audit log file format that supports the optional query time and size statistics, which are available from MySQL 8.0.30. This data is available in the slow query log for qualifying queries, and in the context of the audit log it similarly helps to detect outliers for activity analysis.

To add the query statistics to the log file, you must set them up as a filter using the `audit_log_filter_set_filter()` audit log function as the service element of the JSON filtering syntax. For instructions to do this, see Adding Query Statistics for Outlier Detection. For the `bytes_sent` and `bytes_received` fields to be populated, the system variable `log_slow_extra` must be set to ON.

The following examples show the JSON object formats for different event types (as indicated by the `class` and `event` items), reformatted slightly for readability:

Auditing startup event:

```
{ "timestamp": "2019-10-03 14:21:56",
  "id": 0,
  "class": "audit",
  "event": "startup",
  "connection_id": 0,
  "startup_data": { "server_id": 1,
                    "os_version": "i686-Linux",
                    "mysql_version": "5.7.21-log",
                    "args": ["/usr/local/mysql/bin/mysqld",
                             "--loose-audit-log-format=JSON",
                             "--log-error=log.err",
                             "--pid-file=mysqld.pid",
                             "--port=3306" ] } }
```

When the audit log plugin starts as a result of server startup (as opposed to being enabled at runtime), `connection_id` is set to 0, and `account` and `login` are not present.

Auditing shutdown event:

```
{ "timestamp": "2019-10-03 14:28:20",
  "id": 3,
  "class": "audit",
  "event": "shutdown",
  "connection_id": 0,
  "shutdown_data": { "server_id": 1 } }
```

When the audit log plugin is uninstalled as a result of server shutdown (as opposed to being disabled at runtime), `connection_id` is set to 0, and `account` and `login` are not present.

Connect or change-user event:

```
{ "timestamp": "2019-10-03 14:23:18",
  "id": 1,
  "class": "connection",
  "event": "connect",
  "connection_id": 5,
  "account": { "user": "root", "host": "localhost" },
  "login": { "user": "root", "os": "", "ip": "::1", "proxy": "" },
  "connection_data": { "connection_type": "ssl",
                       "status": 0,
                       "db": "test",
                       "connection_attributes": {
                         "_pid": "43236",
                         ...
                         "program_name": "mysqladmin"
                       } }
}
```

Disconnect event:

```
{ "timestamp": "2019-10-03 14:24:45",
  "id": 3,
  "class": "connection",
  "event": "disconnect",
  "connection_id": 5,
  "account": { "user": "root", "host": "localhost" },
  "login": { "user": "root", "os": "", "ip": "::1", "proxy": "" },
  "connection_data": { "connection_type": "ssl" } }
```

Query event:

```
{ "timestamp": "2019-10-03 14:23:35",
  "id": 2,
  "class": "general",
  "event": "status",
  "connection_id": 5,
  "account": { "user": "root", "host": "localhost" },
  "login": { "user": "root", "os": "", "ip": "::1", "proxy": "" },
  "general_data": { "command": "Query",
                    "sql_command": "show_variables",
                    "query": "SHOW VARIABLES",
                    "status": 0 } }
```

Query event with optional query statistics for outlier detection:

```
{ "timestamp": "2022-01-28 13:09:30",
  "id": 0,
  "class": "general",
  "event": "status",
  "connection_id": 46,
  "account": { "user": "user", "host": "localhost" },
  "login": { "user": "user", “os": "", “ip": "127.0.0.1", “proxy": "" },
  "general_data": { "command": "Query",
                    "sql_command": "insert",
	            "query": "INSERT INTO audit_table VALUES(4)",
	            "status": 1146 }
  "query_statistics": { "query_time": 0.116250,
                        "bytes_sent": 18384,
                        "bytes_received": 78858,
                        "rows_sent": 3,
                        "rows_examined": 20878 } }
```

Table access event (read, delete, insert, update):

```
{ "timestamp": "2019-10-03 14:23:41",
  "id": 0,
  "class": "table_access",
  "event": "insert",
  "connection_id": 5,
  "account": { "user": "root", "host": "localhost" },
  "login": { "user": "root", "os": "", "ip": "127.0.0.1", "proxy": "" },
  "table_access_data": { "db": "test",
                         "table": "t1",
                         "query": "INSERT INTO t1 (i) VALUES(1),(2),(3)",
                         "sql_command": "insert" } }
```

The items in the following list appear at the top level of JSON-format audit records: Each item value is either a scalar or a `JSON` hash. For items that have a hash value, the description lists only the item names within that hash. For more complete descriptions of second-level hash items, see later in this section.

* `account`

  The MySQL account associated with the event. The value is a hash containing these items equivalent to the value of the `CURRENT_USER()` function within the section: `user`, `host`.

  Example:

  ```
  "account": { "user": "root", "host": "localhost" }
  ```

* `class`

  A string representing the event class. The class defines the type of event, when taken together with the `event` item that specifies the event subclass.

  Example:

  ```
  "class": "connection"
  ```

  The following table shows the permitted combinations of `class` and `event` values.

  **Table 8.34 Audit Log Class and Event Combinations**

  <table summary="Permitted combinations of audit log class and event values."><col style="width: 30%"/><col style="width: 40%"/><thead><tr> <th>Class Value</th> <th>Valores permitidos para eventos</th> </tr></thead><tbody><tr> <td><code>audit</code></td> <td><code>startup</code>,<code>shutdown</code></td> </tr><tr> <td><code>connection</code></td> <td><code>connect</code>,<code>change_user</code>,<code>disconnect</code></td> </tr><tr> <td><code>general</code></td> <td><code>status</code></td> </tr><tr> <td><code>table_access_data</code></td> <td><code>read</code>,<code>delete</code>,<code>insert</code>,<code>update</code></td> </tr></tbody></table></audit_record></audit_record></audit_record></audit_record></audit_record></audit_record></audit></version></priv_user></user></table></status_code></status></status_code></status></startup_options></sqltext></server_id></proxy_user></user></priv_user></os_version></os_login></mysql_version></ip></host></db></connection_type></connection_id></connection_attributes></value></name></attribute></connection_attributes></connection_attributes></command_class></connection_attributes></command_class></name></audit_record></timestamp></timestamp></record_id></db></table>

* `connection_data`

Informações sobre uma conexão de cliente. O valor é um hash contendo esses itens: `connection_type`, `status`, `db` e, possivelmente, `connection_attributes`. Este item ocorre apenas para registros de auditoria com um valor de `class` de `connection`.

Exemplo:

  ```
  "connection_data": { "connection_type": "ssl",
                       "status": 0,
                       "db": "test" }
  ```

A partir do MySQL 8.0.19, os eventos com um valor de `class` de `connection` e um valor de `event` de `connect` podem incluir um item de `connection_attributes` para exibir os atributos de conexão passados pelo cliente no momento da conexão. (Para informações sobre esses atributos, que também estão disponíveis nas tabelas do Gerador de Desempenho, consulte a Seção 29.12.9, “Tabelas de Atributos de Conexão do Gerador de Desempenho”.)

O valor `connection_attributes` é um hash que representa cada atributo pelo seu nome e valor.

Exemplo:

  ```
  "connection_attributes": {
    "_pid": "43236",
    "_os": "macos0.14",
    "_platform": "x86_64",
    "_client_version": "8.0.19",
    "_client_name": "libmysql",
    "program_name": "mysqladmin"
  }
  ```

Se não houver atributos de conexão presentes no evento, nenhum deles será registrado e o item `connection_attributes` não aparecerá. Isso pode ocorrer se a tentativa de conexão não for bem-sucedida, o cliente não passar nenhum atributo ou a conexão ocorrer internamente, como durante o início do servidor ou quando iniciada por um plugin.

* `connection_id`

Um inteiro não assinado que representa o identificador de conexão do cliente. Isso é o mesmo valor retornado pela função `CONNECTION_ID()` dentro da sessão.

Exemplo:

  ```
  "connection_id": 5
  ```

* `event`

Uma cadeia que representa a subclasse da classe de evento. A subclasse define o tipo de evento, quando tomada em conjunto com o item `class`, que especifica a classe de evento. Para mais informações, consulte a descrição do item `class`.

Exemplo:

  ```
  "event": "connect"
  ```

* `general_data`

Informações sobre uma declaração ou comando executado. O valor é um hash contendo esses itens: `command`, `sql_command`, `query`, `status`. Este item ocorre apenas para registros de auditoria com um valor de `class` de `general`.

Exemplo:

  ```
  "general_data": { "command": "Query",
                    "sql_command": "show_variables",
                    "query": "SHOW VARIABLES",
                    "status": 0 }
  ```

* `id`

Um número inteiro não assinado que representa um ID de evento.

Exemplo:

  ```
  "id": 2
  ```

Para os registros de auditoria que têm o mesmo valor de `timestamp`, seus valores de `id` os distinguem e formam uma sequência. Dentro do log de auditoria, os pares `timestamp`/`id` são únicos. Esses pares são marcadores que identificam os locais dos eventos dentro do log.

* `login`

Informações que indicam como um cliente se conectou ao servidor. O valor é um hash contendo esses itens: `user`, `os`, `ip`, `proxy`.

Exemplo:

  ```
  "login": { "user": "root", "os": "", "ip": "::1", "proxy": "" }
  ```

* `query_statistics`

Estatísticas de consulta opcionais para detecção de valores atípicos. O valor é um hash contendo os seguintes itens: `query_time`, `rows_sent`, `rows_examined`, `bytes_received`, `bytes_sent`. Para obter instruções sobre como configurar as estatísticas de consulta, consulte Adicionar estatísticas de consulta para detecção de valores atípicos.

Exemplo:

  ```
  "query_statistics": { "query_time": 0.116250,
                        "bytes_sent": 18384,
                        "bytes_received": 78858,
                        "rows_sent": 3,
                        "rows_examined": 20878 }
  ```

* `shutdown_data`

Informações sobre a conclusão do plugin de registro de auditoria. O valor é um hash contendo esses itens: `server_id` Este item ocorre apenas para registros de auditoria com os valores `class` e `event` de `audit` e `shutdown`, respectivamente.

Exemplo:

  ```
  "shutdown_data": { "server_id": 1 }
  ```

* `startup_data`

Informações relacionadas à inicialização do plugin de registro de auditoria. O valor é um hash contendo esses itens: `server_id`, `os_version`, `mysql_version`, `args`. Este item ocorre apenas para registros de auditoria com os valores `class` e `event` de `audit` e `startup`, respectivamente.

Exemplo:

  ```
  "startup_data": { "server_id": 1,
                    "os_version": "i686-Linux",
                    "mysql_version": "5.7.21-log",
                    "args": ["/usr/local/mysql/bin/mysqld",
                             "--loose-audit-log-format=JSON",
                             "--log-error=log.err",
                             "--pid-file=mysqld.pid",
                             "--port=3306" ] }
  ```

* `table_access_data`

Informações sobre acesso a uma tabela. O valor é um hash contendo esses itens: `db`, `table`, `query`, `sql_command`, Este item ocorre apenas para registros de auditoria com um valor `class` de `table_access`.

Exemplo:

  ```
  "table_access_data": { "db": "test",
                         "table": "t1",
                         "query": "INSERT INTO t1 (i) VALUES(1),(2),(3)",
                         "sql_command": "insert" }
  ```

* `time`

Este campo é semelhante ao do campo `timestamp`, mas o valor é um número inteiro e representa o valor do timestamp UNIX que indica a data e a hora em que o evento de auditoria foi gerado.

Exemplo:

  ```
  "time" : 1618498687
  ```

O campo `time` ocorre apenas em arquivos de registro no formato JSON se a variável de sistema `audit_log_format_unix_timestamp` estiver habilitada.

* `timestamp`

Uma cadeia que representa um valor UTC no formato *`YYYY-MM-DD hh:mm:ss`*, indicando a data e a hora em que o evento de auditoria foi gerado. Por exemplo, o evento correspondente à execução de uma declaração SQL recebida de um cliente tem um valor `timestamp` que ocorre após a declaração terminar, não quando foi recebida.

Exemplo:

  ```
  "timestamp": "2019-10-03 13:50:01"
  ```

Para os registros de auditoria que têm o mesmo valor de `timestamp`, seus valores de `id` os distinguem e formam uma sequência. Dentro do log de auditoria, os pares `timestamp`/`id` são únicos. Esses pares são marcadores que identificam os locais dos eventos dentro do log.

Esses itens aparecem dentro de valores de hash associados a itens de nível superior de registros de auditoria em formato JSON:

* `args`

Uma série de opções que foram fornecidas na linha de comando ou em arquivos de opção quando o servidor MySQL foi iniciado. A primeira opção é o caminho para o executável do servidor.

Exemplo:

  ```
  "args": ["/usr/local/mysql/bin/mysqld",
           "--loose-audit-log-format=JSON",
           "--log-error=log.err",
           "--pid-file=mysqld.pid",
           "--port=3306" ]
  ```

* `bytes_received`

O número de bytes recebidos do cliente. Este item faz parte das estatísticas de consulta opcionais. Para que este campo seja preenchido, a variável do sistema `log_slow_extra` deve ser definida como `ON`.

Exemplo:

  ```
  "bytes_received": 78858
  ```

* `bytes_sent`

O número de bytes enviados ao cliente. Este item faz parte das estatísticas de consulta opcionais. Para que este campo seja preenchido, a variável do sistema `log_slow_extra` deve ser definida como `ON`.

Exemplo:

  ```
  "bytes_sent": 18384
  ```

* `command`

Uma cadeia que representa o tipo de instrução que gerou o evento de auditoria, como um comando que o servidor recebeu de um cliente.

Exemplo:

  ```
  "command": "Query"
  ```

* `connection_type`

O estado de segurança da conexão com o servidor. Os valores permitidos são `tcp/ip` (conexão TCP/IP estabelecida sem encriptação), `ssl` (conexão TCP/IP estabelecida com encriptação), `socket` (conexão de arquivo de soquete Unix), `named_pipe` (conexão de canal nomeado do Windows) e `shared_memory` (conexão de memória compartilhada do Windows).

Exemplo:

  ```
  "connection_type": "tcp/tcp"
  ```

* `db`

Uma cadeia que representa o nome de um banco de dados. Para `connection_data`, é o banco de dados padrão. Para `table_access_data`, é o banco de dados da tabela.

Exemplo:

  ```
  "db": "test"
  ```

* `host`

Uma cadeia que representa o nome do host do cliente.

Exemplo:

  ```
  "host": "localhost"
  ```

* `ip`

Uma cadeia que representa o endereço IP do cliente.

Exemplo:

  ```
  "ip": "::1"
  ```

* `mysql_version`

Uma cadeia que representa a versão do servidor MySQL. Isso é o mesmo que o valor da função `VERSION()` ou da variável de sistema `version`.

Exemplo:

  ```
  "mysql_version": "5.7.21-log"
  ```

* `os`

Uma cadeia que representa o nome do usuário externo usado durante o processo de autenticação, conforme definido pelo plugin usado para autenticar o cliente. Com autenticação nativa (incorporada) do MySQL, ou se o plugin não definir o valor, este atributo está vazio. O valor é o mesmo do `external_user` variável do sistema. Veja a Seção 8.2.19, “Usuários Proxy”.

Exemplo:

  ```
  "os": "jeffrey"
  ```

* `os_version`

Uma cadeia que representa o sistema operacional no qual o servidor foi construído ou está sendo executado.

Exemplo:

  ```
  "os_version": "i686-Linux"
  ```

* `proxy`

Uma cadeia que representa o usuário proxy (consulte a Seção 8.2.19, “Usuários Proxy”). O valor é vazio se o proxeamento do usuário não estiver em vigor.

Exemplo:

  ```
  "proxy": "developer"
  ```

* `query`

Uma cadeia que representa o texto de uma declaração SQL. O valor pode ser vazio. Valores longos podem ser truncados. A cadeia, assim como o próprio arquivo de registro de auditoria, é escrita usando UTF-8 (até 4 bytes por caractere), portanto, o valor pode ser o resultado de uma conversão. Por exemplo, a declaração original pode ter sido recebida do cliente como uma cadeia SJIS.

Exemplo:

  ```
  "query": "DELETE FROM t1"
  ```

* `query_time`

O tempo de execução da consulta em microsegundos (se o tipo de dados `longlong` for selecionado) ou segundos (se o tipo de dados `double` for selecionado). Este item faz parte das estatísticas de consulta opcionais.

Exemplo:

  ```
  "query_time": 0.116250
  ```

* `rows_examined`

O número de linhas acessadas durante a consulta. Este item faz parte das estatísticas opcionais da consulta.

Exemplo:

  ```
  "rows_examined": 20878
  ```

* `rows_sent`

O número de linhas enviadas ao cliente como resultado. Este item faz parte das estatísticas de consulta opcionais.

Exemplo:

  ```
  "rows_sent": 3
  ```

* `server_id`

Um inteiro não assinado que representa o ID do servidor. Isso é o mesmo que o valor da variável do sistema `server_id`.

Exemplo:

  ```
  "server_id": 1
  ```

* `sql_command`

Uma cadeia que indica o tipo de declaração SQL.

Exemplo:

  ```
  "sql_command": "insert"
  ```

Os valores correspondem aos contadores dos comandos `statement/sql/xxx`. Por exemplo, *`xxx`* é `drop_table` e `select` para as declarações [`DROP TABLE`](drop-table.html "15.1.32 DROP TABLE Statement") e `SELECT`, respectivamente. A seguinte declaração exibe os nomes possíveis:

  ```
  SELECT REPLACE(EVENT_NAME, 'statement/sql/', '') AS name
  FROM performance_schema.events_statements_summary_global_by_event_name
  WHERE EVENT_NAME LIKE 'statement/sql/%'
  ORDER BY name;
  ```

* `status`

Um inteiro não assinado que representa o status do comando: 0 para sucesso, não nulo se ocorreu um erro. Isso é o mesmo que o valor da função `mysql_errno()` da API C.

O registro de auditoria não contém o valor SQLSTATE ou a mensagem de erro. Para ver as associações entre códigos de erro, valores SQLSTATE e mensagens, consulte a Referência de Mensagem de Erro do Servidor.

As advertências não são registradas.

Exemplo:

  ```
  "status": 1051
  ```

* `table`

Uma cadeia que representa o nome de uma tabela.

Exemplo:

  ```
  "table": "t1"
  ```

* `user`

Uma cadeia que representa um nome de usuário. O significado difere dependendo do item no qual `user` ocorre:

+ Dentro dos itens `account`, `user` é uma string que representa o usuário pelo qual o servidor autenticou o cliente. Esse é o nome do usuário que o servidor usa para verificação de privilégios.

+ Dentro dos itens `login`, `user` é uma string que representa o nome do usuário enviado pelo cliente.

Exemplo:

  ```
  "user": "root"
  ```

#### 8.4.5.5 Configurando características de registro de auditoria

Esta seção descreve como configurar as características de registro de auditoria, como o arquivo para o qual o plugin de registro de auditoria escreve eventos, o formato dos eventos escritos, se é necessário habilitar a compressão e criptografia do arquivo de registro e a gestão de espaço.

* Convenções de Nomenclatura para Arquivos de Registro de Auditoria
* Selecionando o Formato do Arquivo de Registro de Auditoria
* Habilitando a Tarefa de Limpeza do Registro de Auditoria
* Adicionando Estatísticas de Consulta para Detecção de Anomalias
* Compactação de Arquivos de Registro de Auditoria
* Criptografia de Arquivos de Registro de Auditoria
* Descompactação e Decriptografia Manuais de Arquivos de Registro de Auditoria
* Criptografia de Arquivos de Registro de Auditoria Antes do MySQL 8.0.17
* Gestão de Espaço de Arquivos de Registro de Auditoria
* Estratégias de Escrita para Registro de Auditoria

Nota

As capacidades de criptografia descritas aqui se aplicam a partir do MySQL 8.0.17, com exceção da seção que compara as capacidades de criptografia atuais com as capacidades anteriores mais limitadas; consulte Criptografia de arquivo de registro de auditoria antes do MySQL 8.0.17.

Para obter informações adicionais sobre as funções e as variáveis do sistema que afetam o registro de auditoria, consulte Funções do Registro de Auditoria e Opções e Variáveis do Registro de Auditoria.

O plugin do registro de auditoria também pode controlar quais eventos auditados são escritos no arquivo do registro de auditoria, com base no conteúdo do evento ou na conta de onde os eventos se originam. Veja a Seção 8.4.5.7, “Filtragem do Registro de Auditoria”.

##### Convenções de Nomenclatura para Arquivos de Registro de Auditoria

Para configurar o nome do arquivo de registro de auditoria, defina a variável de sistema `audit_log_file` no início da inicialização do servidor. O nome padrão é `audit.log` no diretório de dados do servidor. Para a melhor segurança, escreva o registro de auditoria em um diretório acessível apenas ao servidor MySQL e aos usuários que têm um motivo legítimo para visualizar o registro.

O plugin interpreta o valor `audit_log_file` como composto por um nome de diretório opcional, um nome base e um sufixo opcional. Se a compressão ou criptografia estiverem habilitadas, o nome efetivo do arquivo (o nome realmente usado para criar o arquivo de log) difere do nome do arquivo configurado porque possui sufixos adicionais:

* Se a compressão estiver habilitada, o plugin adiciona um sufixo de `.gz`.

* Se a criptografia estiver habilitada, o plugin adiciona um sufixo de `.pwd_id.enc`, onde *`pwd_id`* indica qual senha de criptografia usar para operações de arquivo de registro. O plugin de registro de auditoria armazena senhas de criptografia no chaveiro; veja Criptografando Arquivos de Registro de Auditoria.

O nome efetivo do arquivo de registro de auditoria é o nome resultante da adição de sufixos de compressão e criptografia aplicáveis ao nome do arquivo configurado. Por exemplo, se o valor configurado `audit_log_file` for `audit.log`, o nome efetivo do arquivo é um dos valores mostrados na tabela a seguir.

<table summary="audit_log effective file names for various combinations of the compression and encryption features."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Enabled Features</th> <th>Effective File Name</th> </tr></thead><tbody><tr> <td>No compression or encryption</td> <td><code>audit.log</code></td> </tr><tr> <td>Compression</td> <td><code>audit.log.gz</code></td> </tr><tr> <td>Encryption</td> <td><code>audit.log.<em class="replaceable"><code>pwd_id</code></em>.enc</code></td> </tr><tr> <td>Compression, encryption</td> <td><code>audit.log.gz.<em class="replaceable"><code>pwd_id</code></em>.enc</code></td> </tr></tbody></table>

*`pwd_id`* indica o ID da senha usada para criptografar ou descriptografar um arquivo. O formato *`pwd_id`* é *`pwd_timestamp-seq`*, onde:

* *`pwd_timestamp`* é um valor UTC no formato `YYYYMMDDThhmmss` que indica quando a senha foi criada.

* *`seq`* é um número de sequência. Os números de sequência começam em 1 e aumentam para senhas que têm o mesmo valor de *`pwd_timestamp`*.

Aqui estão alguns exemplos de valores de ID de senha *`pwd_id`*:

```
20190403T142359-1
20190403T142400-1
20190403T142400-2
```

Para construir os IDs correspondentes do chaveiro para armazenar senhas no chaveiro, o plugin de registro de auditoria adiciona um prefixo de `audit_log-` aos valores *`pwd_id`*. Para os IDs de senha de exemplo que foram mostrados, os IDs correspondentes do chaveiro são:

```
audit_log-20190403T142359-1
audit_log-20190403T142400-1
audit_log-20190403T142400-2
```

O ID da senha atualmente usado para criptografia pelo plugin de registro de auditoria é aquele que tem o maior valor *`pwd_timestamp`*. Se várias senhas tiverem esse valor *`pwd_timestamp`*, o ID atual da senha é aquele com o número de sequência maior. Por exemplo, no conjunto de IDs de senha anterior, dois deles têm o maior timestamp, `20190403T142400`, então o ID atual da senha é aquele com o maior número de sequência (`2`).

O plugin de registro de auditoria realiza certas ações durante a inicialização e término com base no nome efetivo do arquivo de registro de auditoria:

* Durante a inicialização, o plugin verifica se um arquivo com o nome do arquivo de registro de auditoria já existe e renomeia-o, se existir. (Neste caso, o plugin assume que a invocação anterior do servidor saiu inesperadamente com o plugin de registro de auditoria em execução.) O plugin então escreve em um novo arquivo de registro de auditoria vazio.

* Durante a finalização, o plugin renomeia o arquivo de registro de auditoria.
* O renomeamento do arquivo (seja durante a inicialização ou finalização do plugin) ocorre de acordo com as regras usuais para rotação automática de arquivos de registro baseada no tamanho; veja "Rotação Automática do Arquivo de Registro de Auditoria (Antes do MySQL 8.0.31)".

##### Selecionar o formato do arquivo de registro de auditoria

Para configurar o formato do arquivo de registro de auditoria, defina a variável de sistema `audit_log_format` no início da inicialização do servidor. Esses formatos estão disponíveis:

* `NEW`: Novo formato XML. Este é o padrão.

* `OLD`: Formato XML antigo.
* `JSON`: Formato JSON. Escreve o log de auditoria como um array JSON. Apenas este formato suporta as estatísticas opcionais de tempo e tamanho da consulta, que estão disponíveis a partir do MySQL 8.0.30.

Para obter detalhes sobre cada formato, consulte a Seção 8.4.5.4, “Formatos de arquivo de registro de auditoria”.

##### Habilitar a Tarefa de Limpeza do Log de Auditoria

A partir do MySQL 8.0.34, o MySQL Enterprise Audit oferece a capacidade de definir um intervalo de atualização para descartar o cache em memória automaticamente. Uma tarefa de limpeza configurada usando a variável de sistema `audit_log_flush_interval_seconds` tem um valor padrão de zero, o que significa que a tarefa não está agendada para ser executada.

Quando a tarefa é configurada para ser executada (o valor é diferente de zero), o MySQL Enterprise Audit tenta chamar o componente de agendamento em sua inicialização e configurar um esvaziamento regular e recorrente de seu cache de memória:

* Se o registro de auditoria não encontrar uma implementação do serviço de registro do agendamento, ele não agendará o esvaziamento e continuará carregando.

* O registro de auditoria implementa o serviço `dynamic_loader_services_loaded_notification` e escuta novos registros de `mysql_scheduler` para que o registro de auditoria possa registrar sua tarefa agendada no cronograma recém-carregado.

* O registro de auditoria só se registra na primeira implementação de agendamento carregada.

Da mesma forma, o MySQL Enterprise Audit chama o componente `scheduler` em sua desinicialização e desconfigura o esvaziamento recorrente que ele programou. Ele mantém uma referência ativa ao serviço de registro do agendamento até que a tarefa agendada seja desregistrada, garantindo que o componente `scheduler` não possa ser descarregado enquanto houver tarefas agendadas ativas. Todos os resultados da execução do agendamento e de suas tarefas são escritos no log de erro do servidor.

Para agendar uma tarefa de esvaziamento do registro de auditoria:

1. Confirme que o componente `scheduler` está carregado e habilitado. O componente está habilitado (`ON`) por padrão (consulte `component_scheduler.enabled`).

   ```
   SELECT * FROM mysql.components;
   +--------------+--------------------+----------------------------+
   | component_id | component_group_id | component_urn              |
   +--------------+--------------------+----------------------------+
   |            1 |                  1 | file://component_scheduler |
   +--------------+--------------------+----------------------------+
   ```

2. Instale o plugin `audit_log`, se ainda não estiver instalado (consulte a Seção 8.4.5.2, “Instalando ou Desinstalando Auditoria MySQL Enterprise”).

3. Inicie o servidor usando `audit_log_flush_interval_seconds` e defina o valor em um número maior que 59. O limite superior do valor varia de acordo com a plataforma. Por exemplo, para configurar a tarefa de limpeza para ocorrer a cada dois minutos:

   ```
   $> mysqld --audit_log_flush_interval_seconds=120
   ```

Para mais informações, consulte a variável de sistema `audit_log_flush_interval_seconds`.

##### Adicionar estatísticas de consulta para detecção de outliers

No MySQL 8.0.30 e versões posteriores, você pode estender arquivos de registro no formato JSON com campos de dados opcionais para mostrar o tempo da consulta, o número de bytes enviados e recebidos, o número de linhas devolvidas ao cliente e o número de linhas examinadas. Esses dados estão disponíveis no registro de consultas lentas para consultas qualificadas e, no contexto do registro de auditoria, ajudam de maneira semelhante a detectar valores atípicos para análise de atividade. Os campos de dados estendidos podem ser adicionados apenas quando o registro de auditoria está no formato JSON (`audit_log_format=JSON`), que não é a configuração padrão.

As estatísticas da consulta são entregues ao registro de auditoria por meio de serviços de componente que você configura como uma função de filtragem de registro de auditoria. Os serviços são nomeados `mysql_audit_print_service_longlong_data_source` e `mysql_audit_print_service_double_data_source`. Você pode escolher qualquer tipo de dados para cada item de saída. Para o tempo da consulta, `longlong` exibe o valor em microsegundos e `double` exibe o valor em segundos.

Você adiciona as estatísticas da consulta usando a função `audit_log_filter_set_filter()` do log de auditoria, como o elemento `service` da sintaxe de filtragem JSON, da seguinte forma:

```
SELECT audit_log_filter_set_filter('QueryStatistics',
                                   '{ "filter": { "class": { "name": "general", "event": { "name": "status", "print" : '
                                   '{ "service": { "implementation": "mysql_server", "tag": "query_statistics", "element": [ '
                                   '{ "name": "query_time",     "type": "double" }, '
                                   '{ "name": "bytes_sent",     "type": "longlong" }, '
                                   '{ "name": "bytes_received", "type": "longlong" }, '
                                   '{ "name": "rows_sent",      "type": "longlong" }, '
                                   '{ "name": "rows_examined",  "type": "longlong" } ] } } } } } }');
```

Para que os campos `bytes_sent` e `bytes_received` sejam preenchidos, a variável de sistema `log_slow_extra` deve ser definida como `ON`. Se o valor da variável de sistema for `OFF`, um valor nulo é escrito no arquivo de registro para esses campos.

Se você deseja parar de coletar as estatísticas de consulta, use a função `audit_log_filter_set_filter()` do registro de auditoria para remover o filtro, por exemplo:

```
SELECT audit_log_filter_remove_filter('QueryStatistics');
```

##### Compactação de arquivos de registro de auditoria

A compactação do arquivo de registro de auditoria pode ser habilitada para qualquer formato de registro.

Para configurar a compressão do arquivo de registro de auditoria, defina a variável de sistema `audit_log_compression` na inicialização do servidor. Os valores permitidos são `NONE` (sem compressão; o padrão) e `GZIP` (compressão GNU Zip).

Se a compressão e a criptografia estiverem habilitadas, a compressão ocorre antes da criptografia. Para recuperar o arquivo original manualmente, primeiro descriptografá-lo e, em seguida, descomprimir. Veja Descomprimiendo e descriptografando manualmente os arquivos de registro de auditoria.

##### Criptografar arquivos de registro de auditoria

A criptografia do arquivo de registro de auditoria pode ser habilitada para qualquer formato de registro. A criptografia é baseada em senhas definidas pelo usuário (com exceção da senha inicial que o plugin de registro de auditoria gera). Para usar esse recurso, o chaveiro MySQL deve ser habilitado, pois o registro de auditoria o usa para armazenamento de senhas. Qualquer componente ou plugin do chaveiro pode ser usado; para instruções, consulte a Seção 8.4.4, “O Chaveiro MySQL”.

Para configurar a criptografia do arquivo de registro de auditoria, defina a variável de sistema `audit_log_encryption` no início da inicialização do servidor. Os valores permitidos são `NONE` (sem criptografia; o padrão) e `AES` (criptografia com cifra AES-256-CBC).

Para definir ou obter uma senha de criptografia em tempo de execução, use essas funções de registro de auditoria:

* Para definir a senha de criptografia atual, invoque `audit_log_encryption_password_set()`. Esta função armazena a nova senha no chaveiro. Se a criptografia estiver habilitada, também realiza uma operação de rotação de arquivo de registro que renomeia o arquivo de registro atual e inicia um novo arquivo de registro criptografado com a senha. O renomeamento do arquivo ocorre de acordo com as regras usuais para rotação automática de arquivo de registro baseada no tamanho; consulte "Rotação Automática de Arquivo de Registro de Auditoria Manual (Antes do MySQL 8.0.31)".")

Se a variável de sistema `audit_log_password_history_keep_days` não for nula, a invocação de `audit_log_encryption_password_set()` também faz com que as senhas de criptografia dos registros de auditoria arquivados antigos expirem. Para obter informações sobre o histórico de senhas de registro de auditoria, incluindo arquivamento e expiração de senhas, consulte a descrição dessa variável.

* Para obter a senha de criptografia atual, invoque `audit_log_encryption_password_get()` sem argumento. Para obter uma senha por ID, passe um argumento que especifique o ID do chaveiro da senha atual ou uma senha arquivada.

Para determinar quais IDs de chave de registro de auditoria existem, consulte a tabela do Schema de desempenho `keyring_keys`:

  ```
  mysql> SELECT KEY_ID FROM performance_schema.keyring_keys
         WHERE KEY_ID LIKE 'audit_log%'
         ORDER BY KEY_ID;
  +-----------------------------+
  | KEY_ID                      |
  +-----------------------------+
  | audit_log-20190415T152248-1 |
  | audit_log-20190415T153507-1 |
  | audit_log-20190416T125122-1 |
  | audit_log-20190416T141608-1 |
  +-----------------------------+
  ```

Para obter informações adicionais sobre as funções de criptografia do log de auditoria, consulte Funções de log de auditoria.

Quando o plugin do registro de auditoria é inicializado, se ele encontrar que o criptografamento do arquivo de registro está habilitado, ele verifica se o chaveiro contém uma senha de criptografia do registro de auditoria. Se não, o plugin gera automaticamente uma senha de criptografia inicial aleatória e a armazena no chaveiro. Para descobrir essa senha, invoque `audit_log_encryption_password_get()`.

Se a compressão e a criptografia estiverem habilitadas, a compressão ocorre antes da criptografia. Para recuperar o arquivo original manualmente, primeiro descriptografá-lo e, em seguida, descomprimir. Veja Descomprimiendo e descriptografando manualmente os arquivos de registro de auditoria.

##### Descompactar e descriptografar manualmente os arquivos de registro de auditoria

Os arquivos de registro de auditoria podem ser descompactados e descriptografados usando ferramentas padrão. Isso deve ser feito apenas para arquivos de registro que tenham sido fechados (arquivados) e que não estejam mais em uso, e não para o arquivo de registro que o plugin de registro de auditoria está escrevendo atualmente. Você pode reconhecer os arquivos de registro arquivados porque eles foram renomeados pelo plugin de registro de auditoria para incluir um timestamp no nome do arquivo logo após o nome básico.

Para essa discussão, vamos assumir que `audit_log_file` esteja configurado como `audit.log`. Nesse caso, um arquivo de registro de auditoria arquivado tem um dos nomes mostrados na tabela a seguir.

<table summary="audit_log archived file names for various combinations of the compression and encryption features."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Enabled Features</th> <th>Nome do arquivo arquivado</th> </tr></thead><tbody><tr> <td>No compression or encryption</td> <td><code>audit.<em class="replaceable"><code>timestamp</code></em>.log</code></td> </tr><tr> <td>Compression</td> <td><code>audit.<em class="replaceable"><code>timestamp</code></em>.log.gz</code></td> </tr><tr> <td>Encryption</td> <td><code>audit.<em class="replaceable"><code>timestamp</code></em>.log.<em class="replaceable"><code>pwd_id</code></em>.enc</code></td> </tr><tr> <td>Compression, encryption</td> <td><code>audit.<em class="replaceable"><code>timestamp</code></em>.log.gz.<em class="replaceable"><code>pwd_id</code></em>.enc</code></td> </tr></tbody></table>

Como discutido nas Convenções de Nomenclatura para Arquivos de Registro de Auditoria, o formato *`pwd_id`* é *`pwd_timestamp-seq`*. Assim, os nomes dos arquivos de registro criptografados arquivados realmente contêm dois timestamps. O primeiro indica o tempo de rotação do arquivo, e o segundo indica quando a senha de criptografia foi criada.

Considere o seguinte conjunto de nomes de arquivos de registro criptografados arquivados:

```
audit.20190410T205827.log.20190403T185337-1.enc
audit.20190410T210243.log.20190403T185337-1.enc
audit.20190415T145309.log.20190414T223342-1.enc
audit.20190415T151322.log.20190414T223342-2.enc
```

Cada nome de arquivo tem um timestamp de tempo de rotação único. Em contraste, os timestamps de senha não são únicos:

* Os dois primeiros arquivos têm o mesmo ID de senha e número de sequência (`20190403T185337-1`). Eles têm a mesma senha de criptografia.

* Os dois arquivos seguintes têm o mesmo ID de senha (`20190414T223342`) mas números de sequência diferentes (`1`, `2`). Esses arquivos têm senhas de criptografia diferentes.

Para descomprimir um arquivo de registro comprimido manualmente, use **gunzip**, **gzip -d** ou um comando equivalente. Por exemplo:

```
gunzip -c audit.timestamp.log.gz > audit.timestamp.log
```

Para descriptografar um arquivo de registro criptografado manualmente, use o comando **openssl**. Por exemplo:

```
openssl enc -d -aes-256-cbc -pass pass:password -md sha256
    -in audit.timestamp.log.pwd_id.enc
    -out audit.timestamp.log
```

Para executar esse comando, você deve obter *`password`*, a senha de criptografia. Para fazer isso, use `audit_log_encryption_password_get()`. Por exemplo, se o nome do arquivo de registro de auditoria é `audit.20190415T151322.log.20190414T223342-2.enc`, o ID da senha é `20190414T223342-2` e o ID do chaveiro é `audit-log-20190414T223342-2`. Recupere a senha do chaveiro da seguinte forma:

```
SELECT audit_log_encryption_password_get('audit-log-20190414T223342-2');
```

Se a compressão e a criptografia estiverem habilitadas para o registro de auditoria, a compressão ocorrerá antes da criptografia. Nesse caso, o nome do arquivo terá os sufixos `.gz` e `.pwd_id.enc` adicionados, correspondendo à ordem em que essas operações ocorrem. Para recuperar o arquivo original manualmente, realize as operações em ordem inversa. Ou seja, primeiro decifre o arquivo, em seguida, descomprima-o:

```
openssl enc -d -aes-256-cbc -pass pass:password -md sha256
    -in audit.timestamp.log.gz.pwd_id.enc
    -out audit.timestamp.log.gz
gunzip -c audit.timestamp.log.gz > audit.timestamp.log
```

##### Encriptação do arquivo de registro de auditoria antes do MySQL 8.0.17

Esta seção abrange as diferenças nas capacidades de criptografia de arquivos de registro de auditoria anteriores e a partir do MySQL 8.0.17, que é quando o histórico de senhas foi implementado (que inclui arquivamento e expiração de senhas). Também indica como o plugin de registro de auditoria lida com atualizações para o MySQL 8.0.17 ou superior a partir de versões inferiores a 8.0.17.

<table summary="Comparison of audit log encryption prior to and as of MySQL 8.0.17."><col style="width: 30%"/><col style="width: 35%"/><col style="width: 35%"/><thead><tr> <th scope="col">Característica</th> <th scope="col">Antes do MySQL 8.0.17</th> <th scope="col">A partir do MySQL 8.0.17</th> </tr></thead><tbody><tr> <th scope="row">Número de senhas</th> <td>Apenas senha única</td> <td>Permitidas múltiplas senhas</td> </tr><tr> <th scope="row">Nomes de arquivos de registro criptografados</th> <td><code>.enc</code>sufixo</td> <td><code>.<em class="replaceable"><code>pwd_id</code></em>.enc</code>sufixo</td> </tr><tr> <th scope="row">Password keyring ID</th> <td><code>audit_log</code></td> <td><code>audit_log-<em class="replaceable"><code>pwd_id</code></em></code></td> </tr><tr> <th scope="row">Password history</th> <td>No</td> <td>Yes</td> </tr></tbody></table>

Antes do MySQL 8.0.17, não há histórico de senha, portanto, definir uma nova senha torna a senha antiga inacessível, o que impede que o MySQL Enterprise Audit leia arquivos de registro criptografados com a senha antiga. Se você antecipar a necessidade de descriptografar esses arquivos manualmente, você deve manter um registro das senhas anteriores.

Se o arquivo de registro de auditoria estiver criptografado quando você atualizar para o MySQL 8.0.17 ou superior a partir de uma versão anterior, o plugin de registro de auditoria realiza essas ações de atualização:

* Durante a inicialização do plugin, o plugin verifica uma senha de criptografia com um ID de chave de criptografia de `audit_log`. Se encontrar uma, o plugin duplica a senha usando um ID de chave de criptografia no formato `audit_log-pwd_id` e a usa como senha de criptografia atual. (Para detalhes sobre a sintaxe de *`pwd_id`*, consulte as Convenções de Nomenclatura para Arquivos de Registro de Auditoria.)

* Os arquivos de registro criptografados existentes têm um sufixo de `.enc`. O plugin não renomeia esses arquivos para ter um sufixo de `.pwd_id.enc`, mas pode lê-los desde que a chave com o ID de `audit_log` permaneça no chaveiro.

* Quando a limpeza de senhas ocorrer, se o plugin expira qualquer senha com um ID de chave de criptografia no formato `audit_log-pwd_id`, também expira a senha com um ID de chave de criptografia de `audit_log`, se existir. (Neste ponto, os arquivos de registro criptografados que têm um sufixo de `.enc` em vez de `.pwd_id.enc` tornam-se ilegíveis pelo plugin, portanto, presume-se que você não os precise mais.)

##### Gerenciamento de Espaço de Arquivos de Registro de Auditoria

O arquivo de registro de auditoria pode crescer bastante e consumir uma grande quantidade de espaço em disco. Se você está coletando as estatísticas opcionais de tempo e tamanho de consulta, que estão disponíveis a partir do MySQL 8.0.30, isso aumenta os requisitos de espaço. As estatísticas de consulta são suportadas apenas com o formato JSON.

Para gerenciar o espaço utilizado, utilize esses métodos:

* Rotação do arquivo de registro. Isso envolve a rotação do arquivo de registro atual, renomeando-o, e, em seguida, abrindo um novo arquivo de registro atual usando o nome original. A rotação pode ser realizada manualmente ou configurada para ocorrer automaticamente.

* Remoção de arquivos de registro em formato JSON rotados, se a rotação automática estiver habilitada. A remoção pode ser realizada com base na idade do arquivo de registro (a partir do MySQL 8.0.24) ou no tamanho combinado do arquivo de registro (a partir do MySQL 8.0.26).

Para configurar a gestão do espaço do arquivo de registro de auditoria, use as seguintes variáveis do sistema:

* Se `audit_log_rotate_on_size` for 0 (o padrão), a rotação automática do arquivo de registro é desativada.

+ Não há rotação, a menos que seja realizada manualmente.
+ Para rotular o arquivo atual, use um dos seguintes métodos:

- Antes do MySQL 8.0.31, renomeie manualmente o arquivo, depois habilite `audit_log_flush` para fechá-lo e abra um novo arquivo de registro atual usando o nome original. Esse método de rotação de arquivos e a variável `audit_log_flush` são desatualizados no MySQL 8.0.31.

Com esse método de rotação de arquivos, a poda de arquivos de registro em formato JSON rotado não ocorre; `audit_log_max_size` e `audit_log_prune_seconds` não têm efeito.

- A partir do MySQL 8.0.31, execute `SELECT audit_log_rotate();` para renomear o arquivo e abrir um novo arquivo de registro de auditoria usando o nome original.

Com esse método de rotação de arquivos, a poda de arquivos de registro em formato JSON rotado ocorre se `audit_log_max_size` ou `audit_log_prune_seconds` tiver um valor maior que 0.

Veja o arquivo de registro de auditoria manual (antes do MySQL 8.0.31).

* Se `audit_log_rotate_on_size` for maior que 0, o registro automático de rotação do arquivo é habilitado:

+ A rotação automática ocorre quando uma escrita no arquivo de registro atual faz com que seu tamanho exceda o valor `audit_log_rotate_on_size`, além de sob certas outras condições; veja Rotação Automática do Arquivo de Registro de Auditoria. Quando ocorre a rotação automática, o plugin de registro de auditoria renomeia o arquivo de registro atual e abre um novo arquivo de registro atual usando o nome original.

O podamento dos arquivos de registro em formato JSON rotado ocorre se `audit_log_max_size` ou `audit_log_prune_seconds` tiver um valor maior que 0.

+ `audit_log_flush` não tem efeito.

Nota

Para arquivos de registro no formato JSON, a rotação também ocorre quando o valor da variável de sistema `audit_log_format_unix_timestamp` é alterado no runtime. No entanto, isso não ocorre por motivos de gerenciamento de espaço, mas sim para que, para um arquivo de registro no formato JSON específico, todos os registros no arquivo incluam ou não o campo `time`.

Nota

Os arquivos de registro rotados (renomeados) não são removidos automaticamente. Por exemplo, com rotação de arquivos de registro baseada no tamanho, os arquivos de registro renomeados têm nomes exclusivos e acumulam indefinidamente. Eles não rodam fora do final da sequência de nomes. Para evitar o uso excessivo de espaço:

* a partir do MySQL 8.0.24 (para arquivos de registro no formato JSON): habilite a poda de arquivos de registro conforme descrito na poda de arquivo de registro de auditoria.

* Caso contrário (para arquivos que não são JSON, ou antes do MySQL 8.0.24 para todos os formatos de log): Remova os arquivos antigos periodicamente, fazendo uma cópia de segurança deles primeiro, se necessário. Se os arquivos de log de cópia de segurança estiverem criptografados, também faça uma cópia de segurança das senhas de criptografia correspondentes em um local seguro, caso você precise descriptografar os arquivos posteriormente.

As seções a seguir descrevem a rotação e a poda de arquivos de registro com mais detalhes.

* Rotação manual do arquivo de registro de auditoria (antes do MySQL 8.0.31) ") * Rotação manual do arquivo de registro de auditoria (a partir do MySQL 8.0.31) * Rotação automática do arquivo de registro de auditoria * Remoção de registros do arquivo de registro de auditoria

###### Rotação do arquivo de registro de auditoria manual (antes do MySQL 8.0.31)

Nota

A partir do MySQL 8.0.31, a variável `audit_log_flush` e este método de rotação de arquivo de registro de auditoria são desaconselhados; espera-se que o suporte seja removido em uma versão futura do MySQL.

Se `audit_log_rotate_on_size` for 0 (o padrão), não ocorrerá rotação de log, a menos que seja realizada manualmente. Neste caso, o plugin de log fecha e reabre o arquivo de log quando o valor de `audit_log_flush` muda de desativado para ativado. O renomeamento do arquivo de log deve ser feito externamente ao servidor. Suponha que o nome do arquivo de log seja `audit.log` e que você queira manter os três arquivos de log mais recentes, alternando entre os nomes `audit.log.1` até `audit.log.3`. Em Unix, realize a rotação manualmente da seguinte forma:

1. Na linha de comando, renomeie os arquivos de registro atuais:

   ```
   mv audit.log.2 audit.log.3
   mv audit.log.1 audit.log.2
   mv audit.log audit.log.1
   ```

Essa estratégia sobrescreve os conteúdos atuais do `audit.log.3`, estabelecendo um limite para o número de arquivos de registro arquivados e o espaço que eles utilizam.

2. Neste ponto, o plugin ainda está escrevendo no arquivo de registro atual, que foi renomeado para `audit.log.1`. Conecte-se ao servidor e limpe o arquivo de registro para que o plugin o feche e abra um novo arquivo `audit.log`:

   ```
   SET GLOBAL audit_log_flush = ON;
   ```

`audit_log_flush` é especial porque seu valor permanece `OFF` para que você não precise desativá-lo explicitamente antes de ativá-lo novamente para realizar outro esvaziamento.

Nota

Se a compressão ou criptografia estiverem habilitadas, os nomes dos arquivos de registro incluem sufixos que indicam os recursos habilitados, além de um ID de senha se a criptografia estiver habilitada. Se os nomes dos arquivos incluir um ID de senha, certifique-se de reter o ID no nome de quaisquer arquivos que você renomear manualmente, para que a senha que será usada para as operações de descriptografia possa ser determinada.

Nota

Para o registro no formato JSON, renomear manualmente os arquivos de registro os torna indisponíveis para as funções de leitura de registro, pois o plugin de registro de auditoria não pode mais determinar que fazem parte da sequência do arquivo de registro (consulte a Seção 8.4.5.6, “Leitura de Arquivos de Registro de Auditoria”). Considere definir `audit_log_rotate_on_size` maior que 0 para usar rotação baseada no tamanho.

###### Rotação do arquivo de registro de auditoria manual (de MySQL 8.0.31)

Se `audit_log_rotate_on_size` for 0 (o padrão), não ocorrerá rotação de log, a menos que seja realizada manualmente.

Para rotular o arquivo de registro de auditoria manualmente, execute `SELECT audit_log_rotate();` para renomear o arquivo de registro de auditoria atual e abrir um novo arquivo de registro de auditoria. Os arquivos são renomeados de acordo com as convenções descritas nas Convenções de Nomenclatura para Arquivos de Registro de Auditoria.

O privilégio `AUDIT_ADMIN` é necessário para usar a função `audit_log_rotate()`.

Gerenciar o número de arquivos de registro arquivados (os arquivos que foram renomeados) e o espaço que eles utilizam é uma tarefa manual que envolve a remoção de arquivos de registro de auditoria arquivados que não são mais necessários do seu sistema de arquivos.

O conteúdo dos arquivos de registro de auditoria que são renomeados usando a função `audit_log_rotate()` pode ser lido pela função `audit_log_read()`.

###### Rotação automática do arquivo de registro de auditoria

Se `audit_log_rotate_on_size` for maior que 0, definir `audit_log_flush` não tem efeito. Em vez disso, sempre que uma escrita no arquivo de registro atual faz com que seu tamanho exceda o valor de `audit_log_rotate_on_size`, o plugin de registro de auditoria renomeia automaticamente o arquivo de registro atual e abre um novo arquivo de registro atual usando o nome original.

A rotação automática com base no tamanho também ocorre nessas condições:

* Durante a inicialização do plugin, se um arquivo com o nome do log de auditoria já existir (consulte Convenções de Nomenclatura para Arquivos de Log de Auditoria).

* Durante a interrupção do plugin. * Quando a função `audit_log_encryption_password_set()` é chamada para definir a senha de criptografia, se a criptografia estiver habilitada. (A rotação não ocorre se a criptografia estiver desativada.)

O plugin renomeia o arquivo original inserindo um timestamp logo após seu nome básico. Por exemplo, se o nome do arquivo é `audit.log`, o plugin o renomeia para um valor como `audit.20210115T140633.log`. O timestamp é um valor UTC no formato `YYYYMMDDThhmmss`. Para o registro XML, o timestamp indica o tempo de rotação. Para o registro JSON, o timestamp é o do último evento escrito no arquivo.

Se os arquivos de registro estiverem criptografados, o nome original do arquivo já contém um timestamp indicando o tempo de criação da senha de criptografia (consulte as Convenções de Nomenclatura para Arquivos de Registro de Auditoria). Neste caso, o nome do arquivo após a rotação contém dois timestamps. Por exemplo, um arquivo de registro criptografado com o nome `audit.log.20210110T130749-1.enc` é renomeado para um valor como `audit.20210115T140633.log.20210110T130749-1.enc`.

###### Remoção de arquivo de registro de auditoria

O plugin de registro de auditoria suporta a poda de arquivos de registro de auditoria em formato JSON rotado, se a rotação automática de arquivos de registro estiver habilitada. Para usar essa capacidade:

* Defina `audit_log_format` para `JSON`. (Além disso, considere também alterar `audit_log_file`; veja Selecionando o formato do arquivo de registro de auditoria.)

* Defina `audit_log_rotate_on_size` maior que 0 para especificar o tamanho em bytes em que a rotação automática do arquivo de registro ocorre.

* Por padrão, não ocorre poda de arquivos de registro em formato JSON rotado automaticamente. Para habilitar a poda, defina uma dessas variáveis do sistema em um valor maior que 0:

+ Defina `audit_log_max_size` maior que 0 para especificar o limite em bytes sobre o tamanho combinado dos arquivos de registro rotados, acima do qual os arquivos passam a estar sujeitos à poda. `audit_log_max_size` está disponível a partir do MySQL 8.0.26.

+ Defina `audit_log_prune_seconds` maior que 0 para especificar o número de segundos após os arquivos de registro rotados passarem a ser sujeitos à poda. `audit_log_prune_seconds` está disponível a partir do MySQL 8.0.24.

Os valores não nulos de `audit_log_max_size` têm precedência sobre os valores não nulos de `audit_log_prune_seconds`. Se ambos forem definidos como maiores que 0 na inicialização do plugin, um aviso é escrito no log de erro do servidor. Se um cliente definir ambos como maiores que 0 durante a execução, um aviso é retornado ao cliente.

Nota

As advertências para o log de erro são escritas como Notas, que são mensagens de informação. Para garantir que essas mensagens apareçam no log de erro e não sejam descartadas, certifique-se de que a granularidade do registro de erro é suficiente para incluir mensagens de informação. Por exemplo, se você está usando a filtragem de log baseada na prioridade, conforme descrito na Seção 7.4.2.5, “Filtragem de log baseada na prioridade (log_filter_internal)”), defina a variável de sistema `log_error_verbosity` para um valor de 3.

A poda dos arquivos de registro no formato JSON, se habilitada, ocorre da seguinte forma:

* Quando a rotação automática ocorre; para as condições sob as quais isso acontece, consulte Rotação automática do arquivo de registro de auditoria.

* Quando a variável de sistema global `audit_log_max_size` ou `audit_log_prune_seconds` é definida em tempo de execução.

Para a poda baseada no tamanho combinado dos arquivos de registro rotados, se o tamanho combinado for maior que o limite especificado por `audit_log_max_size`, o plugin de registro de auditoria remove os arquivos mais antigos até que seu tamanho combinado não exceda o limite.

Para a poda baseada na idade do arquivo de registro girado, o ponto de poda é o horário atual menos o valor de `audit_log_prune_seconds`. Nos arquivos de registro em formato JSON girados, a parte do timestamp de cada nome de arquivo indica o timestamp do último evento escrito no arquivo. O plugin de registro de auditoria usa timestamps de nomes de arquivos para determinar quais arquivos contêm apenas eventos mais antigos que o ponto de poda e os remove.

##### Escreva estratégias para registro de auditoria

O plugin de registro de auditoria pode usar qualquer uma das várias estratégias para gravações de registro. Independentemente da estratégia, o registro ocorre de forma de melhor esforço, sem garantia de consistência.

Para especificar uma estratégia de escrita, defina a variável de sistema `audit_log_strategy` no início da inicialização do servidor. Por padrão, o valor da estratégia é `ASYNCHRONOUS` e o plugin registra ativamente em um buffer, aguardando se o buffer estiver cheio. Você pode dizer ao plugin para não aguardar (`PERFORMANCE`) ou para registrar de forma síncrona, usando cache do sistema de arquivos (`SEMISYNCHRONOUS`) ou forçando a saída com uma chamada `sync()` após cada solicitação de escrita (`SYNCHRONOUS`).

Para a estratégia de escrita assíncrona, a variável de sistema `audit_log_buffer_size` é o tamanho do buffer em bytes. Defina essa variável no início do servidor para alterar o tamanho do buffer. O plugin usa um único buffer, que ele aloca quando inicializa e remove quando termina. O plugin não aloca esse buffer para estratégias de escrita não assíncronas.

A estratégia de registro assíncrono tem essas características:

* Impacto mínimo no desempenho e na escalabilidade do servidor. * Bloqueio de threads que geram eventos de auditoria pelo menor tempo possível; ou seja, tempo para alocar o buffer mais o tempo para copiar o evento para o buffer.

* A saída vai para o buffer. Um fio separado lida com as escritas do buffer no arquivo de log.

Com o registro assíncrono, a integridade do arquivo de registro pode ser comprometida se ocorrer um problema durante uma escrita no arquivo ou se o plugin não fechar corretamente (por exemplo, no caso de o servidor hospedeiro sair inesperadamente). Para reduzir esse risco, configure `audit_log_strategy` para usar registro síncrono.

Uma desvantagem da estratégia `PERFORMANCE` é que ela elimina eventos quando o buffer está cheio. Para um servidor com muitos usuários, o registro de auditoria pode ter eventos ausentes.

#### 8.4.5.6 Leitura de arquivos de registro de auditoria

O plugin de registro de auditoria suporta funções que fornecem uma interface SQL para leitura de arquivos de registro de auditoria em formato JSON. (Essa capacidade não se aplica a arquivos de registro escritos em outros formatos.)

Quando o plugin de registro de auditoria é inicializado e configurado para registro JSON, ele usa o diretório que contém o arquivo atual de registro de auditoria como a localização para procurar arquivos de registro de auditoria legíveis. O plugin determina a localização do arquivo, o nome base e o sufixo pelo valor da variável de sistema `audit_log_file`, e depois procura arquivos com nomes que correspondem ao seguinte padrão, onde `[...]` indica partes opcionais do nome do arquivo:

```
basename[.timestamp].suffix[.gz][[.pwd_id].enc]
```

Se o nome de um arquivo terminar com `.enc`, o arquivo está criptografado e a leitura de seu conteúdo não criptografado requer uma senha de descriptografia obtida do chaveiro. O plugin de registro de auditoria determina o ID do chaveiro da senha de descriptografia da seguinte forma:

* Se `.enc` é precedido por *`pwd_id`*, o ID do chaveiro é `audit_log-pwd_id`.

* Se `.enc` não for precedido por *`pwd_id`*, o arquivo tem um nome antigo de antes da implementação da senha do histórico de criptografia do log de auditoria. O ID do chaveiro é `audit_log`.

Para obter mais informações sobre arquivos de registro de auditoria criptografados, consulte Criptografar arquivos de registro de auditoria.

O plugin ignora arquivos que foram renomeados manualmente e não correspondem ao padrão, e arquivos que foram criptografados com uma senha que não está mais disponível no chaveiro. O plugin abre cada arquivo candidato restante, verifica se o arquivo realmente contém eventos de auditoria `JSON`, e ordena os arquivos usando os timestamps do primeiro evento de cada arquivo. O resultado é uma sequência de arquivos que estão sujeitos ao acesso usando as funções de leitura de log:

* `audit_log_read()` lê eventos do registro de auditoria ou fecha o processo de leitura.

* `audit_log_read_bookmark()` retorna um marcador para o evento de registro de auditoria mais recentemente escrito. Esse marcador é adequado para ser passado para `audit_log_read()` para indicar onde começar a leitura.

`audit_log_read()` aceita um argumento opcional `JSON` de cadeia de caracteres, e o resultado retornado de uma chamada bem-sucedida a qualquer uma dessas funções é uma cadeia de caracteres `JSON`.

Para usar as funções para ler o registro de auditoria, siga esses princípios:

* Chame `audit_log_read()` para ler eventos que começam a partir de uma posição dada ou da posição atual, ou para fechar a leitura:

+ Para inicializar uma sequência de leitura de registro de auditoria, passe um argumento que indique a posição em que se deve começar. Uma maneira de fazer isso é passar o marcador retornado por `audit_log_read_bookmark()`:

    ```
    SELECT audit_log_read(audit_log_read_bookmark());
    ```

+ Para continuar lendo a partir da posição atual na sequência, chame `audit_log_read()` sem especificar posição:

    ```
    SELECT audit_log_read();
    ```

+ Para fechar explicitamente a sequência de leitura, passe um argumento `JSON` `null`:

    ```
    SELECT audit_log_read('null');
    ```

Não é necessário fechar a leitura explicitamente. A leitura é fechada implicitamente quando a sessão termina ou uma nova sequência de leitura é iniciada ao chamar `audit_log_read()` com um argumento que indica a posição em que se deve começar.

* Uma chamada bem-sucedida para `audit_log_read()` para ler eventos retorna uma string `JSON` contendo um array de eventos de auditoria:

+ Se o valor final da matriz retornada não for um valor de `JSON` `null`, há mais eventos seguindo aqueles que foram lidos e `audit_log_read()` pode ser chamado novamente para ler mais deles.

+ Se o valor final da matriz de retorno for um valor `JSON` `null`, não há mais eventos para serem lidos na sequência de leitura atual.

Cada elemento de matriz não `null` é um evento representado como um `JSON` hash. Por exemplo:

  ```
  [
    {
      "timestamp": "2020-05-18 13:39:33", "id": 0,
      "class": "connection", "event": "connect",
      ...
    },
    {
      "timestamp": "2020-05-18 13:39:33", "id": 1,
      "class": "general", "event": "status",
      ...
    },
    {
      "timestamp": "2020-05-18 13:39:33", "id": 2,
      "class": "connection", "event": "disconnect",
      ...
    },
    null
  ]
  ```

Para mais informações sobre o conteúdo dos eventos de auditoria no formato JSON, consulte o formato do arquivo de registro de auditoria JSON.

* Uma chamada `audit_log_read()` para ler eventos que não especifica uma posição produz um erro em qualquer uma dessas condições:

+ Uma sequência de leitura ainda não foi iniciada ao passar uma posição para `audit_log_read()`.

+ Não há mais eventos restantes para serem lidos na sequência atual de leitura; ou seja, `audit_log_read()` anteriormente retornou um array que termina com um valor `JSON` `null`.

+ A sequência de leitura mais recente foi fechada ao passar um valor `JSON` `null` para `audit_log_read()`.

Para ler eventos nessas condições, é necessário inicializar uma sequência de leitura, chamando `audit_log_read()` com um argumento que especifique uma posição.

Para especificar uma posição para `audit_log_read()`, inclua um argumento que indique onde começar a leitura. Por exemplo, passe um marcador, que é um `JSON` hash contendo elementos `timestamp` e `id` que identificam de forma única um evento particular. Aqui está um exemplo de marcador, obtido ao chamar a função `audit_log_read_bookmark()`:

```
mysql> SELECT audit_log_read_bookmark();
+-------------------------------------------------+
| audit_log_read_bookmark()                       |
+-------------------------------------------------+
| { "timestamp": "2020-05-18 21:03:44", "id": 0 } |
+-------------------------------------------------+
```

Passar o marcador atual para `audit_log_read()` inicia a leitura de eventos a partir da posição do marcador:

```
mysql> SELECT audit_log_read(audit_log_read_bookmark());
+-----------------------------------------------------------------------+
| audit_log_read(audit_log_read_bookmark())                             |
+-----------------------------------------------------------------------+
| [ {"timestamp":"2020-05-18 22:41:24","id":0,"class":"connection", ... |
+-----------------------------------------------------------------------+
```

O argumento para `audit_log_read()` é opcional. Se presente, pode ser um valor de `JSON` `null` para fechar a sequência de leitura, ou um hash de `JSON`.

Dentro de um argumento de hash para `audit_log_read()`, os itens são opcionais e controlam aspectos da operação de leitura, como a posição em que começar a leitura ou quantos eventos devem ser lidos. Os seguintes itens são significativos (outros itens são ignorados):

* `start`: A posição dentro do registro de auditoria do primeiro evento a ser lido. A posição é dada como um timestamp e a leitura começa a partir do primeiro evento que ocorre no valor do timestamp ou após ele. O item `start` tem esse formato, onde *`value`* é um valor literal de timestamp:

  ```
  "start": { "timestamp": "value" }
  ```

O item `start` é permitido a partir do MySQL 8.0.22.

* `timestamp`, `id`: A posição dentro do registro de auditoria do primeiro evento a ser lido. Os itens `timestamp` e `id` juntos compõem um marcador que identifica de forma única um evento particular. Se um argumento `audit_log_read()` incluir qualquer um desses itens, ele deve incluir ambos para especificar completamente uma posição ou ocorrerá um erro.

* `max_array_length`: O número máximo de eventos a serem lidos do log. Se este item for omitido, o padrão é ler até o final do log ou até que o buffer de leitura esteja cheio, o que ocorrer primeiro.

Para especificar uma posição inicial para `audit_log_read()`, passe um argumento de hash que inclua um item de `start` ou um marcador composto por itens de `timestamp` e `id`. Se um argumento de hash incluir tanto um item de `start` quanto um marcador, ocorrerá um erro.

Se um argumento hash não especificar nenhuma posição inicial, a leitura continua a partir da posição atual.

Se um valor de marcação de tempo não incluir uma parte de hora, é assumido uma parte de hora de `00:00:00`.

Exemplos de argumentos aceitos por `audit_log_read()`:

* Leia eventos que começam com o primeiro evento que ocorre no ou após o horário de marcação especificado:

  ```
  audit_log_read('{ "start": { "timestamp": "2020-05-24 12:30:00" } }')
  ```

* Como o exemplo anterior, mas leia no máximo 3 eventos:

  ```
  audit_log_read('{ "start": { "timestamp": "2020-05-24 12:30:00" }, "max_array_length": 3 }')
  ```

* Leia os eventos que começam com o primeiro evento que ocorre em ou após `2020-05-24 00:00:00` (o timestamp não inclui parte de hora, então `00:00:00` é assumido):

  ```
  audit_log_read('{ "start": { "timestamp": "2020-05-24" } }')
  ```

* Leia eventos que começam com o evento que tem o horário exato e o ID do evento:

  ```
  audit_log_read('{ "timestamp": "2020-05-24 12:30:00", "id": 0 }')
  ```

* Como o exemplo anterior, mas leia no máximo 3 eventos:

  ```
  audit_log_read('{ "timestamp": "2020-05-24 12:30:00", "id": 0, "max_array_length": 3 }')
  ```

* Leia eventos a partir da posição atual na sequência de leitura:

  ```
  audit_log_read()
  ```

* Leia no máximo 5 eventos que começam na posição atual na sequência de leitura:

  ```
  audit_log_read('{ "max_array_length": 5 }')
  ```

* Fechar a sequência de leitura atual:

  ```
  audit_log_read('null')
  ```

Uma string `JSON` devolvida por qualquer função de leitura de log pode ser manipulada conforme necessário. Suponha que uma chamada para obter um marcador produza esse valor:

```
mysql> SET @mark := audit_log_read_bookmark();
mysql> SELECT @mark;
+-------------------------------------------------+
| @mark                                           |
+-------------------------------------------------+
| { "timestamp": "2020-05-18 16:10:28", "id": 2 } |
+-------------------------------------------------+
```

Chamando `audit_log_read()` com esse argumento, pode-se retornar vários eventos. Para limitar `audit_log_read()` a leitura de no máximo *`N`* eventos, adicione ao texto um item `max_array_length` com esse valor. Por exemplo, para ler um único evento, modifique o texto da seguinte forma:

```
mysql> SET @mark := JSON_SET(@mark, '$.max_array_length', 1);
mysql> SELECT @mark;
+----------------------------------------------------------------------+
| @mark                                                                |
+----------------------------------------------------------------------+
| {"id": 2, "timestamp": "2020-05-18 16:10:28", "max_array_length": 1} |
+----------------------------------------------------------------------+
```

A cadeia modificada, quando passada para `audit_log_read()`, produz um resultado que contém no máximo um evento, independentemente de quantos estão disponíveis.

Antes do MySQL 8.0.19, os valores de retorno de cadeia de caracteres das funções do log de auditoria são cadeias binárias. Para usar uma cadeia binária com funções que exigem uma cadeia de caracteres não binária (como funções que manipulam os valores do `JSON`), converta-a em uma cadeia de caracteres não binária. Por exemplo, antes de passar um marcador para o `JSON_SET()`, converta-o em `utf8mb4` da seguinte forma:

```
SET @mark = CONVERT(@mark USING utf8mb4);
```

Essa declaração pode ser usada mesmo para o MySQL 8.0.19 e versões superiores; para essas versões, é essencialmente uma operação sem efeito e é inócua.

Se uma função de registro de auditoria for invocada dentro do cliente **mysql**, os resultados de cadeia binária são exibidos usando notação hexadecimal, dependendo do valor do `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando MySQL”.

Para definir um limite no número de bytes que o `audit_log_read()` lê, defina a variável de sistema `audit_log_read_buffer_size`. A partir do MySQL 8.0.12, essa variável tem um valor padrão de 32 KB e pode ser definida em tempo de execução. Cada cliente deve definir seu valor de sessão de `audit_log_read_buffer_size` de forma apropriada para seu uso de `audit_log_read()`.

Cada chamada para `audit_log_read()` retorna tantos eventos disponíveis quanto cabem no tamanho do buffer. Os eventos que não cabem no tamanho do buffer são ignorados e geram avisos. Considerando esse comportamento, considere esses fatores ao avaliar o tamanho adequado do buffer para uma aplicação:

* Há um compromisso entre o número de chamadas para `audit_log_read()` e os eventos retornados por chamada:

+ Com um tamanho de buffer menor, as chamadas retornam menos eventos, então são necessárias mais chamadas.

+ Com um tamanho de buffer maior, as chamadas retornam mais eventos, então são necessárias menos chamadas.

* Com um tamanho de buffer menor, como o tamanho padrão de 32 KB, há uma maior chance de os eventos ultrapassarem o tamanho do buffer e, assim, serem ignorados.

Antes do MySQL 8.0.12, `audit_log_read_buffer_size` tem um valor padrão de 1 MB, afeta todos os clientes e pode ser alterado apenas na inicialização do servidor.

Para obter informações adicionais sobre as funções de leitura do log de auditoria, consulte Funções de log de auditoria.

#### 8.4.5.7 Filtragem do Log de Auditoria

Nota

Para que o filtro do log de auditoria funcione conforme descrito aqui, o plugin de log de auditoria *e as tabelas e funções de auditoria que o acompanham* devem ser instalados. Se o plugin for instalado sem as tabelas e funções de auditoria que acompanham necessárias para o filtro baseado em regras, o plugin opera no modo de filtragem legada, descrito na Seção 8.4.5.10, “Filtro de Log de Auditoria em Modo Legado”. O modo legítimo (descontinuado no MySQL 8.0.34) é o comportamento de filtragem como era antes do MySQL 5.7.13; ou seja, antes da introdução do filtro baseado em regras.

* Propriedades do Filtro do Log de Auditoria
* Restrições sobre as Funções de Filtro do Log de Auditoria
* Uso das Funções de Filtro do Log de Auditoria

##### Propriedades do Filtro do Log de Auditoria

O plugin de registro de auditoria tem a capacidade de controlar o registro de eventos auditados, filtrando-os:

* Eventos auditados podem ser filtrados usando essas características:

+ Conta do usuário
  + Classe de evento de auditoria
  + Subclasse de evento de auditoria
  + Campos de evento de auditoria, como aqueles que indicam o status da operação ou a declaração SQL executada

* O filtro de auditoria é baseado em regras:

+ Uma definição de filtro cria um conjunto de regras de auditoria. As definições podem ser configuradas para incluir ou excluir eventos para registro com base nas características descritas anteriormente.

+ As regras de filtro têm a capacidade de bloquear (interromper) a execução de eventos qualificados, além das capacidades existentes para registro de eventos.

+ Podem ser definidos vários filtros, e qualquer filtro pode ser atribuído a qualquer número de contas de usuário.

+ É possível definir um filtro padrão para usar com qualquer conta de usuário que não tenha um filtro explicitamente atribuído.

O filtro do registro de auditoria é usado para implementar serviços de componentes do MySQL 8.0.30. Para obter as estatísticas de consulta opcionais disponíveis nessa versão, configure-as como um filtro usando o componente do serviço, que implementa os serviços que escrevem as estatísticas no registro de auditoria. Para obter instruções sobre como configurar esse filtro, consulte Adicionar estatísticas de consulta para detecção de outliers.

Para obter informações sobre como escrever regras de filtragem, consulte a Seção 8.4.5.8, “Escrevendo definições de filtro de registro de auditoria”.

* Os filtros dos registros de auditoria podem ser definidos e modificados usando uma interface SQL com base em chamadas de função. Por padrão, as definições dos filtros de registro de auditoria são armazenadas no banco de dados do sistema `mysql`, e é possível exibir filtros de auditoria fazendo uma consulta à tabela `mysql.audit_log_filter`. É possível usar um banco de dados diferente para esse propósito, nesse caso, você deve fazer uma consulta à tabela `database_name.audit_log_filter`. Consulte a Seção 8.4.5.2, “Instalando ou Desinstalando Auditoria MySQL Enterprise”, para obter mais informações.

* Dentro de uma sessão específica, o valor da variável de sistema `audit_log_filter_id` de leitura somente indica se um filtro é atribuído à sessão.

Nota

Por padrão, o filtro de logs de auditoria baseado em regras não registra eventos audíveis para nenhum usuário. Para registrar todos os eventos audíveis para todos os usuários, use as seguintes declarações, que criam um filtro simples para habilitar o registro e atribuí-lo à conta padrão:

```
SELECT audit_log_filter_set_filter('log_all', '{ "filter": { "log": true } }');
SELECT audit_log_filter_set_user('%', 'log_all');
```

O filtro atribuído a `%` é usado para conexões de qualquer conta que não tenha um filtro explicitamente atribuído (o que inicialmente é verdadeiro para todas as contas).

Como mencionado anteriormente, a interface SQL para controle de filtragem de auditoria é baseada em funções. A lista a seguir resume brevemente essas funções:

* `audit_log_filter_set_filter()`: Defina um filtro.

* `audit_log_filter_remove_filter()`: Remova um filtro.

* `audit_log_filter_set_user()`: Começar a filtrar uma conta de usuário.

* `audit_log_filter_remove_user()`: Parar o filtro de uma conta de usuário.

* `audit_log_filter_flush()`: Limpe as alterações manuais nas tabelas de filtro para afetar o filtro em andamento.

Para exemplos de uso e detalhes completos sobre as funções de filtragem, consulte o artigo Usando funções de filtragem de registro de auditoria e Funções de registro de auditoria.

##### Restrições sobre as funções de filtragem do log de auditoria

As funções de filtragem do log de auditoria estão sujeitas a essas restrições:

* Para usar qualquer função de filtragem, o plugin `audit_log` deve estar habilitado ou ocorrerá um erro. Além disso, as tabelas de auditoria devem existir ou ocorrerá um erro. Para instalar o plugin `audit_log` e suas funções e tabelas associadas, consulte a Seção 8.4.5.2, “Instalando ou Desinstalando Auditoria MySQL Enterprise”.

* Para usar qualquer função de filtragem, o usuário deve possuir o privilégio `AUDIT_ADMIN` `SUPER` ou ocorrerá um erro. Para conceder um desses privilégios a uma conta de usuário, use esta declaração:

  ```
  GRANT privilege ON *.* TO user;
  ```

Como alternativa, se você preferir evitar conceder o privilégio `AUDIT_ADMIN` ou `SUPER` enquanto ainda permite que os usuários acessem funções de filtragem específicas, programas armazenados "wrapper" podem ser definidos. Essa técnica é descrita no contexto das funções de chave de registro em Usando funções de chave de registro de uso geral; ela pode ser adaptada para uso com funções de filtragem.

* O plugin `audit_log` opera no modo legado se ele for instalado, mas as tabelas de auditoria e funções que o acompanham não forem criadas. O plugin escreve essas mensagens no log de erro na inicialização do servidor:

  ```
  [Warning] Plugin audit_log reported: 'Failed to open the audit log filter tables.'
  [Warning] Plugin audit_log reported: 'Audit Log plugin supports a filtering,
  which has not been installed yet. Audit Log plugin will run in the legacy
  mode, which will be disabled in the next release.'
  ```

No modo legado, que é descontinuado a partir do MySQL 8.0.34, a filtragem pode ser feita com base apenas na conta ou no status do evento. Para detalhes, consulte a Seção 8.4.5.10, “Filtragem do Registro de Auditoria no Modo Legado”.

* Teoricamente, um usuário com permissões suficientes pode, por engano, criar um item de "abort" no filtro do registro de auditoria que impeça a si mesmo e outros administradores de acessar o sistema. A partir do MySQL 8.0.28, o privilégio `AUDIT_ABORT_EXEMPT` está disponível para permitir que as consultas de uma conta de usuário sejam sempre executadas, mesmo que um item de "abort" as bloqueie. As contas com este privilégio podem, portanto, ser usadas para recuperar o acesso a um sistema após uma configuração incorreta de auditoria. A consulta ainda é registrada no registro de auditoria, mas, em vez de ser rejeitada, é permitida devido ao privilégio.

As contas criadas no MySQL 8.0.28 ou posterior com o privilégio `SYSTEM_USER` têm o privilégio `AUDIT_ABORT_EXEMPT` atribuído automaticamente quando são criadas. O privilégio `AUDIT_ABORT_EXEMPT` também é atribuído às contas existentes com o privilégio `SYSTEM_USER` quando você realiza um procedimento de atualização com o MySQL 8.0.28 ou posterior, se nenhuma conta existente tiver esse privilégio atribuído.

##### Usando funções de filtragem do registro de auditoria

Antes de usar as funções do log de auditoria, instale-as de acordo com as instruções fornecidas na Seção 8.4.5.2, “Instalando ou Desinstalando Auditoria MySQL Enterprise”. O privilégio `AUDIT_ADMIN` ou `SUPER` é necessário para usar qualquer uma dessas funções.

As funções de filtragem do registro de auditoria permitem o controle de filtragem, fornecendo uma interface para criar, modificar e remover definições de filtro e atribuir filtros a contas de usuário.

As definições de filtro são valores de `JSON`. Para informações sobre o uso dos dados de `JSON` no MySQL, consulte a Seção 13.5, “O tipo de dados JSON”. Esta seção mostra algumas definições de filtro simples. Para mais informações sobre definições de filtro, consulte a Seção 8.4.5.8, “Escrevendo definições de filtro de registro de auditoria”.

Quando uma conexão chega, o plugin do registro de auditoria determina qual filtro usar para a nova sessão, procurando o nome da conta do usuário nas atribuições de filtro atuais:

* Se um filtro for atribuído ao usuário, o registro de auditoria usa esse filtro.

* Caso contrário, se não houver uma atribuição de filtro específica para o usuário, mas houver um filtro atribuído à conta padrão (`%`, o registro de auditoria usa o filtro padrão.

* Caso contrário, o registro de auditoria não seleciona eventos de auditoria da sessão para processamento.

Se uma operação de mudança de usuário ocorrer durante uma sessão (consulte mysql_change_user()), a atribuição de filtro para a sessão é atualizada usando as mesmas regras, mas para o novo usuário.

Por padrão, nenhuma conta tem um filtro atribuído, portanto, não há processamento de eventos audíveis para nenhuma conta.

Suponha que você queira alterar o padrão para registrar apenas atividades relacionadas à conexão (por exemplo, para ver eventos de conectar, alterar usuário e desconectar, mas não as instruções SQL que os usuários executam enquanto conectados). Para isso, defina um filtro (mostrado aqui com o nome `log_conn_events`) que permita registrar apenas eventos na classe `connection`, e atribua esse filtro à conta padrão, representado pelo nome da conta `%`:

```
SET @f = '{ "filter": { "class": { "name": "connection" } } }';
SELECT audit_log_filter_set_filter('log_conn_events', @f);
SELECT audit_log_filter_set_user('%', 'log_conn_events');
```

Agora, o registro de auditoria usa esse filtro de conta padrão para conexões de qualquer conta que não tenha um filtro definido explicitamente.

Para atribuir um filtro explicitamente a uma conta de usuário ou contas específicas, defina o filtro e, em seguida, atribua-o às contas relevantes:

```
SELECT audit_log_filter_set_filter('log_all', '{ "filter": { "log": true } }');
SELECT audit_log_filter_set_user('user1@localhost', 'log_all');
SELECT audit_log_filter_set_user('user2@localhost', 'log_all');
```

Agora, o registro completo está habilitado para `user1@localhost` e `user2@localhost`. As conexões de outras contas continuam sendo filtradas usando o filtro de conta padrão.

Para desassociar uma conta de usuário de seu filtro atual, desvincule o filtro ou atribua um filtro diferente:

* Para desassociar o filtro da conta do usuário:

  ```
  SELECT audit_log_filter_remove_user('user1@localhost');
  ```

O filtro das sessões atuais para a conta permanece inalterado. As conexões subsequentes da conta são filtradas usando o filtro padrão da conta, se houver um, e não são registradas de outra forma.

* Para atribuir um filtro diferente à conta do usuário:

  ```
  SELECT audit_log_filter_set_filter('log_nothing', '{ "filter": { "log": false } }');
  SELECT audit_log_filter_set_user('user1@localhost', 'log_nothing');
  ```

O filtro das sessões atuais para a conta permanece inalterado. As conexões subsequentes da conta são filtradas usando o novo filtro. Para o filtro mostrado aqui, isso significa que não há registro para novas conexões de `user1@localhost`.

Para a filtragem do log de auditoria, as comparações de nome de usuário e nome de host são sensíveis ao caso. Isso difere das comparações para verificação de privilégios, para as quais as comparações de nome de host não são sensíveis ao caso.

Para remover um filtro, faça o seguinte:

```
SELECT audit_log_filter_remove_filter('log_nothing');
```

Remover um filtro também desfaz a associação dele com quaisquer usuários aos quais ele foi atribuído, incluindo quaisquer sessões atuais para esses usuários.

As funções de filtragem que acabamos de descrever afetam o filtro de auditoria imediatamente e atualizam as tabelas do log de auditoria no banco de dados do sistema `mysql`, que armazenam filtros e contas de usuário (consulte Tabelas de Log de Auditoria). É também possível modificar as tabelas de log de auditoria diretamente usando declarações como `INSERT`, `UPDATE` e `DELETE`, mas tais alterações não afetam o filtragem imediatamente. Para limpar suas alterações e torná-las operacionais, chame `audit_log_filter_flush()`:

```
SELECT audit_log_filter_flush();
```

Aviso

`audit_log_filter_flush()` deve ser usado apenas após modificar as tabelas de auditoria diretamente, para forçar a recarga de todos os filtros. Caso contrário, essa função deve ser evitada. É, na verdade, uma versão simplificada da descarga e recarga do plugin `audit_log` com `UNINSTALL PLUGIN` mais `INSTALL PLUGIN`.

`audit_log_filter_flush()` afeta todas as sessões atuais e as desvincula de seus filtros anteriores. As sessões atuais não são mais registradas, a menos que elas se desconectem e se reconectem, ou executem uma operação de mudança de usuário.

Para determinar se um filtro está atribuído à sessão atual, verifique o valor da variável de sistema `audit_log_filter_id` de leitura somente. Se o valor for 0, nenhum filtro está atribuído. Um valor não nulo indica o ID mantido internamente do filtro atribuído:

```
mysql> SELECT @@audit_log_filter_id;
+-----------------------+
| @@audit_log_filter_id |
+-----------------------+
|                     2 |
+-----------------------+
```

#### 8.4.5.8 Definições de filtro do registro de auditoria de escrita

As definições de filtro são os valores de `JSON`. Para informações sobre o uso dos dados de `JSON` no MySQL, consulte a Seção 13.5, “O tipo de dados JSON”.

As definições de filtro têm essa forma, onde *`actions`* indica como o filtro é realizado:

```
{ "filter": actions }
```

A discussão a seguir descreve os construtos permitidos nas definições de filtro.

* Registro de todos os eventos
* Registro de classes específicas de eventos
* Registro de subclasses específicas de eventos
* Registro inclusivo e exclusivo
* Testando os valores dos campos de eventos
* Bloqueando a execução de eventos específicos
* Operadores lógicos
* Referenciando variáveis pré-definidas
* Referenciando funções pré-definidas
* Substituição dos valores dos campos de eventos
* Substituindo um filtro do usuário

##### Registro de todos os eventos

Para habilitar ou desabilitar explicitamente o registro de todos os eventos, use um item `log` no filtro:

```
{
  "filter": { "log": true }
}
```

O valor `log` pode ser `true` ou `false`.

O filtro anterior permite o registro de todos os eventos. É equivalente a:

```
{
  "filter": { }
}
```

O comportamento de registro depende do valor de `log` e se os itens `class` ou `event` são especificados:

* Com `log` especificado, seu valor dado é usado.

* Sem a especificação de `log`, o registro é `true` se não houver item especificado de `class` ou `event`, e `false`, caso contrário (neste caso, `class` ou `event` podem incluir seu próprio item `log`).

##### Registro de Classes Específicas de Eventos

Para registrar eventos de uma classe específica, use um item `class` no filtro, com seu campo `name` indicando o nome da classe a ser registrada:

```
{
  "filter": {
    "class": { "name": "connection" }
  }
}
```

O valor `name` pode ser `connection`, `general` ou `table_access` para registrar eventos de conexão, gerais ou de acesso a tabelas, respectivamente.

O filtro anterior permite o registro de eventos na classe `connection`. É equivalente ao seguinte filtro com os itens `log` explicitados:

```
{
  "filter": {
    "log": false,
    "class": { "log": true,
               "name": "connection" }
  }
}
```

Para habilitar o registro de múltiplas classes, defina o valor `class` como um elemento do array `JSON` que nomeie as classes:

```
{
  "filter": {
    "class": [
      { "name": "connection" },
      { "name": "general" },
      { "name": "table_access" }
    ]
  }
}
```

Nota

Quando várias instâncias de um item específico aparecem no mesmo nível dentro de uma definição de filtro, os valores do item podem ser combinados em uma única instância desse item dentro de um valor de matriz. A definição anterior pode ser escrita da seguinte forma:

```
{
  "filter": {
    "class": [
      { "name": [ "connection", "general", "table_access" ] }
    ]
  }
}
```

##### Registro de Subclasses Específicas de Eventos

Para selecionar subcategorias específicas de eventos, use um item `event` que contenha um item `name` que nomeie as subcategorias. A ação padrão para eventos selecionados por um item `event` é fazer o registro deles. Por exemplo, este filtro habilita o registro para as subcategorias de eventos nomeadas:

```
{
  "filter": {
    "class": [
      {
        "name": "connection",
        "event": [
          { "name": "connect" },
          { "name": "disconnect" }
        ]
      },
      { "name": "general" },
      {
        "name": "table_access",
        "event": [
          { "name": "insert" },
          { "name": "delete" },
          { "name": "update" }
        ]
      }
    ]
  }
}
```

O item `event` também pode conter itens explícitos `log` para indicar se os eventos qualificados devem ser registrados. Este item `event` seleciona vários eventos e indica explicitamente o comportamento de registro para eles:

```
"event": [
  { "name": "read", "log": false },
  { "name": "insert", "log": true },
  { "name": "delete", "log": true },
  { "name": "update", "log": true }
]
```

O item `event` também pode indicar se os eventos qualificados devem ser bloqueados, se ele contiver um item `abort`. Para obter detalhes, consulte Bloqueando a execução de eventos específicos.

A Tabela 8.35, “Combinações de Classe e Subclasse de Evento”, descreve os valores permitidos para cada classe de evento.

**Tabela 8.35 Combinações de Classe e Subclasse de Evento**

<table summary="Permitted combiniations of event class and subclass values."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 60%"/><thead><tr> <th scope="col">Event Class</th> <th scope="col">Event Subclass</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row"><code>connection</code></th> <td><code>connect</code></td> <td>Connection initiation (successful or unsuccessful)</td> </tr><tr> <th scope="row"><code>connection</code></th> <td><code>change_user</code></td> <td>User re-authentication with different user/password during session</td> </tr><tr> <th scope="row"><code>connection</code></th> <td><code>disconnect</code></td> <td>Connection termination</td> </tr><tr> <th scope="row"><code>general</code></th> <td><code>status</code></td> <td>General operation information</td> </tr><tr> <th scope="row"><code>message</code></th> <td><code>internal</code></td> <td>Internally generated message</td> </tr><tr> <th scope="row"><code>message</code></th> <td><code>user</code></td> <td>Message generated by <code>audit_api_message_emit_udf()</code></td> </tr><tr> <th scope="row"><code>table_access</code></th> <td><code>read</code></td> <td>Declarações de leitura de tabela, como<code>SELECT</code>ou<a class="link" href="insert-select.html" title="15.2.7.1 INSERT ... SELECT Statement"><code class="literal">INSERT INTO ... SELECT</code></a></td> </tr><tr> <th scope="row"><code>table_access</code></th> <td><code>delete</code></td> <td>Declarações de exclusão de tabela, como<code>DELETE</code>ou<code>TRUNCATE TABLE</code></td> </tr><tr> <th scope="row"><code>table_access</code></th> <td><code>insert</code></td> <td>Tabelas com declarações de inserção, como<code>INSERT</code>ou<code>REPLACE</code></td> </tr><tr> <th scope="row"><code>table_access</code></th> <td><code>update</code></td> <td>Declarações de atualização de tabela, como<code>UPDATE</code></td> </tr></tbody></table>

A Tabela 8.36, “Características de registro e interrupção por combinação de classe e subclasse de evento”, descreve para cada subclasse de evento se ela pode ser registrada ou interrompida.

**Tabela 8.36 Características de registro e interrupção por combinação de classe e subclasse de evento**

<table summary="Log and abort characteristics for event class and subclass combinations."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th scope="col">Classe de evento</th> <th scope="col">Subclasse de evento</th> <th scope="col">Pode ser registrado</th> <th scope="col">Pode ser interrompido</th> </tr></thead><tbody><tr> <th scope="row"><code>connection</code></th> <td><code>connect</code></td> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row"><code>connection</code></th> <td><code>change_user</code></td> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row"><code>connection</code></th> <td><code>disconnect</code></td> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row"><code>general</code></th> <td><code>status</code></td> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row"><code>message</code></th> <td><code>internal</code></td> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>message</code></th> <td><code>user</code></td> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>table_access</code></th> <td><code>read</code></td> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>table_access</code></th> <td><code>delete</code></td> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>table_access</code></th> <td><code>insert</code></td> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>table_access</code></th> <td><code>update</code></td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Registro Inclusivo e Exclusivo

Um filtro pode ser definido em modo inclusivo ou exclusivo:

* O modo inclusivo registra apenas itens explicitamente especificados. * O modo exclusivo registra tudo, exceto itens explicitamente especificados.

Para realizar o registro inclusivo, desative o registro globalmente e habilite o registro para classes específicas. Este filtro registra os eventos `connect` e `disconnect` na classe `connection`, e eventos na classe `general`:

```
{
  "filter": {
    "log": false,
    "class": [
      {
        "name": "connection",
        "event": [
          { "name": "connect", "log": true },
          { "name": "disconnect", "log": true }
        ]
      },
      { "name": "general", "log": true }
    ]
  }
}
```

Para realizar o registro exclusivo, habilite o registro globalmente e desative o registro para classes específicas. Esse filtro registra tudo, exceto eventos na classe `general`:

```
{
  "filter": {
    "log": true,
    "class":
      { "name": "general", "log": false }
  }
}
```

Este filtro registra eventos `change_user` na classe `connection`, eventos `message` e eventos `table_access`, em virtude de não registrar tudo o resto:

```
{
  "filter": {
    "log": true,
    "class": [
      {
        "name": "connection",
        "event": [
          { "name": "connect", "log": false },
          { "name": "disconnect", "log": false }
        ]
      },
      { "name": "general", "log": false }
    ]
  }
}
```

##### Campo de eventos de teste de valores

Para habilitar o registro com base em valores específicos de campos de evento, especifique um item `field` dentro do item `log` que indique o nome do campo e seu valor esperado:

```
{
  "filter": {
    "class": {
    "name": "general",
      "event": {
        "name": "status",
        "log": {
          "field": { "name": "general_command.str", "value": "Query" }
        }
      }
    }
  }
}
```

Cada evento contém campos específicos da classe do evento que podem ser acessados dentro de um filtro para realizar filtragem personalizada.

Um evento na classe `connection` indica quando uma atividade relacionada à conexão ocorre durante uma sessão, como um usuário conectando-se ou desconectando-se do servidor. A Tabela 8.37, “Campos de Evento de Conexão”, indica os campos permitidos para eventos `connection`.

**Tabela 8.37 Campos de Evento de Conexão**

<table summary="Permitted fields for connection events."><col style="width: 35%"/><col style="width: 20%"/><col style="width: 45%"/><thead><tr> <th scope="col">Field Name</th> <th scope="col">Field Type</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row"><code>status</code></th> <td>integer</td> <td><p class="valid-value">Status do evento:</p><p class="valid-value">0: Ok</p><p class="valid-value">Caso contrário: Falhou</p></td> </tr><tr> <th scope="row"><code>connection_id</code></th> <td>unsigned integer</td> <td>Connection ID</td> </tr><tr> <th scope="row"><code>user.str</code></th> <td>string</td> <td>User name specified during authentication</td> </tr><tr> <th scope="row"><code>user.length</code></th> <td>unsigned integer</td> <td>User name length</td> </tr><tr> <th scope="row"><code>priv_user.str</code></th> <td>string</td> <td>Nome de usuário autenticado (nome de usuário da conta)</td> </tr><tr> <th scope="row"><code>priv_user.length</code></th> <td>unsigned integer</td> <td>Authenticated user name length</td> </tr><tr> <th scope="row"><code>external_user.str</code></th> <td>string</td> <td>Nome do usuário externo (fornecido pelo plugin de autenticação de terceiros)</td> </tr><tr> <th scope="row"><code>external_user.length</code></th> <td>unsigned integer</td> <td>External user name length</td> </tr><tr> <th scope="row"><code>proxy_user.str</code></th> <td>string</td> <td>Proxy user name</td> </tr><tr> <th scope="row"><code>proxy_user.length</code></th> <td>unsigned integer</td> <td>Proxy user name length</td> </tr><tr> <th scope="row"><code>host.str</code></th> <td>string</td> <td>Connected user host</td> </tr><tr> <th scope="row"><code>host.length</code></th> <td>unsigned integer</td> <td>Connected user host length</td> </tr><tr> <th scope="row"><code>ip.str</code></th> <td>string</td> <td>Connected user IP address</td> </tr><tr> <th scope="row"><code>ip.length</code></th> <td>inteiro não assinado</td> <td>Tamanho do endereço IP do usuário conectado</td> </tr><tr> <th scope="row"><code>database.str</code></th> <td>string</td> <td>Nome do banco de dados especificado no momento da conexão</td> </tr><tr> <th scope="row"><code>database.length</code></th> <td>unsigned integer</td> <td>Database name length</td> </tr><tr> <th scope="row"><code>connection_type</code></th> <td>integer</td> <td><p class="valid-value"> Connection type: </p><p class="valid-value"> 0 or <code>"::undefined"</code>: Undefined </p><p class="valid-value"> 1 or <code>"::tcp/ip"</code>: TCP/IP </p><p class="valid-value"> 2 or <code>"::socket"</code>: Socket </p><p class="valid-value"> 3 or <code>"::named_pipe"</code>: Named pipe </p><p class="valid-value"> 4 or <code>"::ssl"</code>: TCP/IP with encryption </p><p class="valid-value"> 5 or <code>"::shared_memory"</code>: Shared memory </p></td> </tr></tbody></table>

Os valores de `"::xxx"` são pseudo-constantes simbólicas que podem ser fornecidos em vez dos valores numéricos literais. Eles devem ser citados como strings e são sensíveis ao caso.

Um evento na classe `general` indica o código de status de uma operação e seus detalhes. A Tabela 8.38, “Campos de Evento Geral”, indica os campos permitidos para eventos `general`.

**Tabela 8.38 Campos Gerais de Evento**

<table summary="Permitted field types for general events."><col style="width: 35%"/><col style="width: 20%"/><col style="width: 45%"/><thead><tr> <th scope="col">Field Name</th> <th scope="col">Field Type</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row"><code>general_error_code</code></th> <td>integer</td> <td><p class="valid-value">Status do evento:</p><p class="valid-value">0: Ok</p><p class="valid-value">Caso contrário: Falhou</p></td> </tr><tr> <th scope="row"><code>general_thread_id</code></th> <td>unsigned integer</td> <td>Connection/thread ID</td> </tr><tr> <th scope="row"><code>general_user.str</code></th> <td>string</td> <td>User name specified during authentication</td> </tr><tr> <th scope="row"><code>general_user.length</code></th> <td>unsigned integer</td> <td>User name length</td> </tr><tr> <th scope="row"><code>general_command.str</code></th> <td>string</td> <td>Command name</td> </tr><tr> <th scope="row"><code>general_command.length</code></th> <td>unsigned integer</td> <td>Command name length</td> </tr><tr> <th scope="row"><code>general_query.str</code></th> <td>string</td> <td>SQL statement text</td> </tr><tr> <th scope="row"><code>general_query.length</code></th> <td>unsigned integer</td> <td>SQL statement text length</td> </tr><tr> <th scope="row"><code>general_host.str</code></th> <td>string</td> <td>Host name</td> </tr><tr> <th scope="row"><code>general_host.length</code></th> <td>unsigned integer</td> <td>Host name length</td> </tr><tr> <th scope="row"><code>general_sql_command.str</code></th> <td>string</td> <td>SQL command type name</td> </tr><tr> <th scope="row"><code>general_sql_command.length</code></th> <td>inteiro não assinado</td> <td>Nome do tipo de comando SQL do comprimento</td> </tr><tr> <th scope="row"><code>general_external_user.str</code></th> <td>string</td> <td>Nome do usuário externo (fornecido pelo plugin de autenticação de terceiros)</td> </tr><tr> <th scope="row"><code>general_external_user.length</code></th> <td>unsigned integer</td> <td>External user name length</td> </tr><tr> <th scope="row"><code>general_ip.str</code></th> <td>string</td> <td>Connected user IP address</td> </tr><tr> <th scope="row"><code>general_ip.length</code></th> <td>inteiro não assinado</td> <td>Tamanho do endereço IP do usuário de conexão</td> </tr></tbody></table>

`general_command.str` indica um nome de comando: `Query`, `Execute`, `Quit` ou `Change user`.

Um evento `general` com o campo `general_command.str` definido como `Query` ou `Execute` contém `general_sql_command.str` definido com um valor que especifica o tipo de comando SQL: `alter_db`, `alter_db_upgrade`, `admin_commands`, e assim por diante. Os valores disponíveis de `general_sql_command.str` podem ser vistos como os últimos componentes dos instrumentos do Schema de Desempenho exibidos por esta declaração:

```
mysql> SELECT NAME FROM performance_schema.setup_instruments
       WHERE NAME LIKE 'statement/sql/%' ORDER BY NAME;
+---------------------------------------+
| NAME                                  |
+---------------------------------------+
| statement/sql/alter_db                |
| statement/sql/alter_db_upgrade        |
| statement/sql/alter_event             |
| statement/sql/alter_function          |
| statement/sql/alter_instance          |
| statement/sql/alter_procedure         |
| statement/sql/alter_server            |
...
```

Um evento na classe `table_access` fornece informações sobre um tipo específico de acesso a uma tabela. A Tabela 8.39, “Campos de Evento de Acesso à Tabela”, indica os campos permitidos para eventos `table_access`.

**Tabela 8.39 Campos de eventos de acesso a tabela**

<table summary="Permitted fields for table-access events."><col style="width: 35%"/><col style="width: 20%"/><col style="width: 45%"/><thead><tr> <th scope="col">Field Name</th> <th scope="col">Field Type</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row"><code>connection_id</code></th> <td>unsigned integer</td> <td>Event connection ID</td> </tr><tr> <th scope="row"><code>sql_command_id</code></th> <td>integer</td> <td>SQL command ID</td> </tr><tr> <th scope="row"><code>query.str</code></th> <td>string</td> <td>SQL statement text</td> </tr><tr> <th scope="row"><code>query.length</code></th> <td>unsigned integer</td> <td>SQL statement text length</td> </tr><tr> <th scope="row"><code>table_database.str</code></th> <td>string</td> <td>Database name associated with event</td> </tr><tr> <th scope="row"><code>table_database.length</code></th> <td>unsigned integer</td> <td>Database name length</td> </tr><tr> <th scope="row"><code>table_name.str</code></th> <td>string</td> <td>Table name associated with event</td> </tr><tr> <th scope="row"><code>table_name.length</code></th> <td>unsigned integer</td> <td>Table name length</td> </tr></tbody></table>

A lista a seguir mostra quais declarações geram quais eventos de acesso a tabela:

* `read` evento:

+ `SELECT`
  + `INSERT ... SELECT` (para tabelas referenciadas na cláusula `SELECT`).

+ `REPLACE ... SELECT` (para tabelas referenciadas na cláusula `SELECT`)

+ `UPDATE ... WHERE` (para tabelas referenciadas na cláusula `WHERE`)

+ `HANDLER ... READ`
* `delete` evento:

+ `DELETE`
  + `TRUNCATE TABLE`
* evento `insert`:

+ `INSERT`
  + `INSERT ... SELECT` (para a tabela referenciada na cláusula `INSERT`)

+ `REPLACE`
  + `REPLACE ... SELECT` (para a tabela referenciada na cláusula de `REPLACE`

+ `LOAD DATA`
  + `LOAD XML`
* evento `update`:

+ `UPDATE`
  + `UPDATE ... WHERE` (para tabelas referenciadas na cláusula `UPDATE`).

##### Bloqueando a execução de eventos específicos

Os itens `event` podem incluir um item `abort` que indica se os eventos qualificados devem ou não ser executados. `abort` permite a escrita de regras que bloqueiam a execução de declarações SQL específicas.

Importante

Teoricamente, um usuário com permissões suficientes pode, por engano, criar um item `abort` no filtro do registro de auditoria que impeça a si mesmo e outros administradores de acessar o sistema. A partir do MySQL 8.0.28, o privilégio `AUDIT_ABORT_EXEMPT` está disponível para permitir que as consultas de uma conta de usuário sejam sempre executadas, mesmo que um item `abort` as bloqueie. As contas com este privilégio podem, portanto, ser usadas para recuperar o acesso a um sistema após uma configuração incorreta de auditoria. A consulta ainda é registrada no registro de auditoria, mas, em vez de ser rejeitada, é permitida devido ao privilégio.

As contas criadas no MySQL 8.0.28 ou posterior com o privilégio `SYSTEM_USER` recebem automaticamente o privilégio `AUDIT_ABORT_EXEMPT` quando são criadas. O privilégio `AUDIT_ABORT_EXEMPT` também é atribuído às contas existentes com o privilégio `SYSTEM_USER` quando você realiza um procedimento de atualização com o MySQL 8.0.28 ou posterior, se nenhuma conta existente tiver esse privilégio atribuído.

O item `abort` deve aparecer dentro de um item `event`. Por exemplo:

```
"event": {
  "name": qualifying event subclass names
  "abort": condition
}
```

Para subcategorias de eventos selecionadas pelo item `name`, a ação `abort` é verdadeira ou falsa, dependendo da avaliação de *`condition`*. Se a condição for avaliada como verdadeira, o evento é bloqueado. Caso contrário, o evento continua sendo executado.

A especificação *`condition`* pode ser tão simples quanto `true` ou `false`, ou pode ser mais complexa, de modo que a avaliação dependa das características do evento.

Este filtro bloqueia as declarações `INSERT`, `UPDATE` e `DELETE`:

```
{
  "filter": {
    "class": {
      "name": "table_access",
      "event": {
        "name": [ "insert", "update", "delete" ],
        "abort": true
      }
    }
  }
}
```

Este filtro mais complexo bloqueia as mesmas declarações, mas apenas para uma tabela específica (`finances.bank_account`):

```
{
  "filter": {
    "class": {
      "name": "table_access",
      "event": {
        "name": [ "insert", "update", "delete" ],
        "abort": {
          "and": [
            { "field": { "name": "table_database.str", "value": "finances" } },
            { "field": { "name": "table_name.str", "value": "bank_account" } }
          ]
        }
      }
    }
  }
}
```

As declarações que correspondem e são bloqueadas pelo filtro retornam um erro ao cliente:

```
ERROR 1045 (28000): Statement was aborted by an audit log filter
```

Nem todos os eventos podem ser bloqueados (consulte a Tabela 8.36, “Características de registro e abortos por combinação de classe e subclasse de evento”). Para um evento que não pode ser bloqueado, o registro de auditoria escreve um aviso no registro de erro em vez de bloqueá-lo.

Para tentativas de definir um filtro no qual o item `abort` apareça em outro lugar que não em um item do `event`, ocorre um erro.

##### Operadores Lógicos

Os operadores lógicos (`and`, `or`, `not`) permitem a construção de condições complexas, permitindo a escrita de configurações de filtragem mais avançadas. O seguinte item `log` registra apenas eventos `general` com campos `general_command` que possuem um valor e comprimento específicos:

```
{
  "filter": {
    "class": {
      "name": "general",
      "event": {
        "name": "status",
        "log": {
          "or": [
            {
              "and": [
                { "field": { "name": "general_command.str",    "value": "Query" } },
                { "field": { "name": "general_command.length", "value": 5 } }
              ]
            },
            {
              "and": [
                { "field": { "name": "general_command.str",    "value": "Execute" } },
                { "field": { "name": "general_command.length", "value": 7 } }
              ]
            }
          ]
        }
      }
    }
  }
}
```

##### Referenciando Variáveis Predefinidas

Para se referir a uma variável predefinida em uma condição de `log`, use um item de `variable`, que recebe os itens `name` e `value` e testa a igualdade da variável nomeada contra um valor dado:

```
"variable": {
  "name": "variable_name",
  "value": comparison_value
}
```

Isso é verdadeiro se *`variable_name`* tiver o valor *`comparison_value`*, falso caso contrário.

Exemplo:

```
{
  "filter": {
    "class": {
      "name": "general",
      "event": {
        "name": "status",
        "log": {
          "variable": {
            "name": "audit_log_connection_policy_value",
            "value": "::none"
          }
        }
      }
    }
  }
}
```

Cada variável predefinida corresponde a uma variável do sistema. Ao escrever um filtro que testa uma variável predefinida, você pode modificar a operação do filtro definindo a variável do sistema correspondente, sem precisar redefinir o filtro. Por exemplo, ao escrever um filtro que testa o valor da variável predefinida `audit_log_connection_policy_value`, você pode modificar a operação do filtro alterando o valor da variável do sistema `audit_log_connection_policy`.

As variáveis de sistema `audit_log_xxx_policy` são usadas para o registro de auditoria do modo legado obsoleto (consulte a Seção 8.4.5.10, “Filtragem do Registro de Auditoria do Modo Legado”). Com a filtragem de registro de auditoria baseada em regras, essas variáveis permanecem visíveis (por exemplo, usando `SHOW VARIABLES`(show-variables.html "15.7.7.41 SHOW VARIABLES Statement")), mas as alterações nelas não têm efeito, a menos que você escreva filtros que contenham construções que se refiram a elas.

A lista a seguir descreve as variáveis prédefinidas permitidas para os itens de `variable`:

* `audit_log_connection_policy_value`

Essa variável corresponde ao valor da variável do sistema `audit_log_connection_policy`. O valor é um inteiro não assinado. A Tabela 8.40, “Valores de audit_log_connection_policy_value”, mostra os valores permitidos e os valores correspondentes `audit_log_connection_policy`.

**Tabela 8.40 audit_log_connection_policy_value Valores**

  <table summary="Permitted audit_log_connection_policy_value values and the corresponding audit_log_connection_policy values."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Valor</th> <th>Corresponding audit_log_connection_policy Value</th> </tr></thead><tbody><tr> <td><code>0</code>ou<code>"::none"</code></td> <td><code>NONE</code></td> </tr><tr> <td><code>1</code>ou<code>"::errors"</code></td> <td><code>ERRORS</code></td> </tr><tr> <td><code>2</code>ou<code>"::all"</code></td> <td><code>ALL</code></td> </tr></tbody></table>

Os valores `"::xxx"` são pseudo-constantes simbólicas que podem ser fornecidos em vez dos valores numéricos literais. Eles devem ser citados como strings e são sensíveis ao caso.

* `audit_log_policy_value`

Essa variável corresponde ao valor da variável do sistema `audit_log_policy`. O valor é um inteiro não assinado. A Tabela 8.41, “Valores de audit_log_policy_value”, mostra os valores permitidos e os valores correspondentes `audit_log_policy`.

**Tabela 8.41 audit_log_policy_value Valores**

  <table summary="Permitted audit_log_policy_value values and the corresponding audit_log_policy values."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Valor</th> <th>Corresponding audit_log_policy Value</th> </tr></thead><tbody><tr> <td><code>0</code>ou<code>"::none"</code></td> <td><code>NONE</code></td> </tr><tr> <td><code>1</code>ou<code>"::logins"</code></td> <td><code>LOGINS</code></td> </tr><tr> <td><code>2</code>ou<code>"::all"</code></td> <td><code>ALL</code></td> </tr><tr> <td><code>3</code>ou<code>"::queries"</code></td> <td><code>QUERIES</code></td> </tr></tbody></table>

Os valores de `"::xxx"` são pseudo-constantes simbólicas que podem ser fornecidos em vez dos valores numéricos literais. Eles devem ser citados como strings e são sensíveis ao caso.

* `audit_log_statement_policy_value`

Essa variável corresponde ao valor da variável do sistema `audit_log_statement_policy`. O valor é um inteiro não assinado. A Tabela 8.42, “Valores de política de declaração de audit_log”, mostra os valores permitidos e os valores correspondentes ao `audit_log_statement_policy`.

**Tabela 8.42 audit_log_statement_policy_value Valores**

  <table summary="Permitted audit_log_statement_policy_value values and the corresponding audit_log_statement_policy values."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Valor</th> <th>Corresponding audit_log_statement_policy Value</th> </tr></thead><tbody><tr> <td><code>0</code>ou<code>"::none"</code></td> <td><code>NONE</code></td> </tr><tr> <td><code>1</code>ou<code>"::errors"</code></td> <td><code>ERRORS</code></td> </tr><tr> <td><code>2</code>ou<code>"::all"</code></td> <td><code>ALL</code></td> </tr></tbody></table>

Os valores `"::xxx"` são pseudo-constantes simbólicas que podem ser fornecidos em vez dos valores numéricos literais. Eles devem ser citados como strings e são sensíveis ao caso.

##### Referência a funções pré-definidas

Para se referir a uma função predefinida em uma condição de `log`, use um item de `function`, que recebe os itens `name` e `args` para especificar o nome da função e seus argumentos, respectivamente:

```
"function": {
  "name": "function_name",
  "args": arguments
}
```

O item `name` deve especificar apenas o nome da função, sem parênteses ou lista de argumentos.

O item `args` deve satisfazer essas condições:

* Se a função não receber argumentos, não deve ser fornecido nenhum item `args`.

* Se a função receber argumentos, é necessário um item `args`, e os argumentos devem ser fornecidos na ordem listada na descrição da função. Os argumentos podem se referir a variáveis predefinidas, campos de evento ou constantes numéricas ou de string.

Se o número de argumentos estiver incorreto ou se os argumentos não tiverem os tipos de dados corretos exigidos pela função, ocorrerá um erro.

Exemplo:

```
{
  "filter": {
    "class": {
      "name": "general",
      "event": {
        "name": "status",
        "log": {
          "function": {
            "name": "find_in_include_list",
            "args": [ { "string": [ { "field": "user.str" },
                                    { "string": "@"},
                                    { "field": "host.str" } ] } ]
          }
        }
      }
    }
  }
}
```

O filtro anterior determina se deve registrar eventos da classe `general` do `status`, dependendo se o usuário atual está encontrado na variável de sistema `audit_log_include_accounts`. Esse usuário é construído usando campos no evento.

A lista a seguir descreve as funções pré-definidas permitidas para os itens `function`:

* `audit_log_exclude_accounts_is_null()`

Verifica se a variável de sistema `audit_log_exclude_accounts` é `NULL`. Esta função pode ser útil ao definir filtros que correspondam à implementação do registro de auditoria legítimo.

Argumentos:

  None.

* `audit_log_include_accounts_is_null()`

Verifica se a variável de sistema `audit_log_include_accounts` é `NULL`. Esta função pode ser útil ao definir filtros que correspondam à implementação do registro de auditoria legítimo.

Argumentos:

  None.

* `debug_sleep(millisec)`

Dormir por um número determinado de milissegundos. Esta função é usada durante a medição de desempenho.

`debug_sleep()` está disponível apenas para builds de depuração.

Argumentos:

+ *`millisec`*: Um inteiro não assinado que especifica o número de milissegundos para dormir.

* `find_in_exclude_list(account)`

Verifica se uma cadeia de contas existe na lista de exclusão do registro de auditoria (o valor da variável de sistema `audit_log_exclude_accounts`).

Argumentos:

+ *`account`*: Uma cadeia que especifica o nome da conta do usuário.

* `find_in_include_list(account)`

Verifica se uma cadeia de contas existe na lista de registro de auditoria (o valor da variável de sistema `audit_log_include_accounts`).

Argumentos:

+ *`account`*: Uma cadeia que especifica o nome da conta do usuário.

* `query_digest([str])`

Essa função tem comportamento diferente dependendo se um argumento é dado:

Sem argumento, `query_digest` retorna o valor do digest de declaração correspondente ao texto literal da declaração no evento atual.

+ Com um argumento, `query_digest` retorna um Booleano que indica se o argumento é igual ao digest atual da declaração.

Argumentos:

+ *`str`*: Este argumento é opcional. Se fornecido, especifica um resumo de declaração a ser comparado com o resumo da declaração no evento atual.

Exemplos:

Este item `function` não inclui argumento, portanto, `query_digest` retorna o digest atual da declaração como uma string:

  ```
  "function": {
    "name": "query_digest"
  }
  ```

Este item `function` inclui um argumento, portanto, `query_digest` retorna um Booleano que indica se o argumento é igual ao digest atual da declaração:

  ```
  "function": {
    "name": "query_digest",
    "args": "SELECT ?"
  }
  ```

Essa função foi adicionada no MySQL 8.0.26.

* `string_find(text, substr)`

Verifica se o valor de `substr` está contido no valor de `text`. Essa pesquisa é sensível ao caso.

Argumentos:

+ *`text`*: A string de texto para pesquisar.

+ *`substr`*: A subdivisão a ser pesquisada em *`text`*.

##### Substituição de valores de campos de evento

A partir do MySQL 8.0.26, as definições de filtro de auditoria suportam a substituição de certos campos de eventos de auditoria, de modo que os eventos registrados contenham o valor de substituição em vez do valor original. Essa capacidade permite que os registros de auditoria registrados incluam descriptografias de declarações em vez de declarações literais, o que pode ser útil para implantações do MySQL para as quais as declarações podem expor valores sensíveis.

A substituição de campo em eventos de auditoria funciona da seguinte forma:

* As substituições de campo são especificadas nas definições do filtro de auditoria, portanto, o filtro do registro de auditoria deve ser habilitado conforme descrito na Seção 8.4.5.7, “Filtro do Registro de Auditoria”.

* Nem todos os campos podem ser substituídos. A Tabela 8.43, “Campos de Evento Suscetíveis à Substituição”, mostra quais campos são substituíveis em quais classes de evento.

**Tabela 8.43 Campos de evento sujeitos a substituição**

  <table summary="Event fields that are subject to replacement during event filtering."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Event Class</th> <th>Field Name</th> </tr></thead><tbody><tr> <td><code>general</code></td> <td><code>general_query.str</code></td> </tr><tr> <td><code>table_access</code></td> <td><code>query.str</code></td> </tr></tbody></table>

* A substituição é condicional. Cada especificação de substituição em uma definição de filtro inclui uma condição, permitindo que um campo substituível seja alterado ou deixado inalterado, dependendo do resultado da condição.

* Se ocorrer substituição, a especificação de substituição indica o valor de substituição usando uma função que é permitida para esse propósito.

Como a Tabela 8.43, “Campos de Evento Suscetíveis a Substituição”, mostra, atualmente, os únicos campos substituíveis são aqueles que contêm texto de declaração (que ocorre em eventos das classes `general` e `table_access`). Além disso, a única função permitida para especificar o valor de substituição é `query_digest`. Isso significa que a única operação de substituição permitida é substituir o texto literal de declaração pelo seu digest correspondente.

Como a substituição de campo ocorre em uma fase inicial de auditoria (durante o filtro), a escolha de escrever texto literal de declaração ou valores de digestão se aplica independentemente do formato de registro escrito posteriormente (ou seja, se o plugin de registro de auditoria produz saída XML ou JSON).

A substituição de campo pode ocorrer em diferentes níveis de granularidade do evento:

* Para realizar a substituição de campo para todos os eventos em uma classe, filtre os eventos no nível da classe.

* Para realizar substituições com base em uma análise mais detalhada, inclua itens adicionais de seleção de eventos. Por exemplo, você pode realizar substituições de campo apenas para subcategorias específicas de uma classe de evento dada, ou apenas em eventos para os quais os campos possuem certas características.

Dentro de uma definição de filtro, especifique a substituição de campo, incluindo um item `print`, que tem a seguinte sintaxe:

```
"print": {
  "field": {
    "name": "field_name",
    "print": condition,
    "replace": replacement_value
  }
}
```

Dentro do item `print`, seu item `field` leva esses três itens para indicar como ocorre a substituição:

* `name`: O campo para o qual a substituição (potencialmente) ocorre. *`field_name`* deve ser um dos campos mostrados na Tabela 8.43, “Campos de Evento Submetidos a Substituição”.

* `print`: A condição que determina se o valor original do campo deve ser mantido ou substituído:

+ Se *`condition`* for avaliado como `true`, o campo permanece inalterado.

+ Se *`condition`* for avaliado como `false`, a substituição ocorre, utilizando o valor do item `replace`.

Para substituir incondicionalmente um campo, especifique a condição da seguinte forma:

  ```
  "print": false
  ```

* `replace`: O valor de substituição a ser utilizado quando a condição `print` for avaliada como `false`. Especifique *`replacement_value`* usando um item `function`.

Por exemplo, essa definição de filtro se aplica a todos os eventos na classe `general`, substituindo o texto literal da declaração pelo seu resumo:

```
{
  "filter": {
    "class": {
      "name": "general",
      "print": {
        "field": {
          "name": "general_query.str",
          "print": false,
          "replace": {
            "function": {
              "name": "query_digest"
            }
          }
        }
      }
    }
  }
}
```

O filtro anterior usa este item `print` para substituir incondicionalmente o texto literal da declaração contida em `general_query.str` pelo seu valor de digestão:

```
"print": {
  "field": {
    "name": "general_query.str",
    "print": false,
    "replace": {
      "function": {
        "name": "query_digest"
      }
    }
  }
}
```

Os itens `print` podem ser escritos de diferentes maneiras para implementar diferentes estratégias de substituição. O item `replace` que acabou de ser mostrado especifica o texto de substituição usando esse `function` para retornar uma string que representa o digest atual da declaração:

```
"function": {
  "name": "query_digest"
}
```

A função `query_digest` também pode ser usada de outra maneira, como um comparador que retorna um Booleano, o que permite seu uso na condição `print`. Para isso, forneça um argumento que especifique um digest de declaração de comparação:

```
"function": {
  "name": "query_digest",
  "args": "digest"
}
```

Neste caso, `query_digest` retorna `true` ou `false`, dependendo se o digest atual da declaração é o mesmo que o digest de comparação. Usando `query_digest` dessa maneira, as definições de filtro podem detectar declarações que correspondem a digests específicos. A condição no seguinte trecho é verdadeira apenas para declarações que têm um digest igual a `SELECT ?`, afetando assim a substituição apenas para declarações que não correspondem ao digest:

```
"print": {
  "field": {
    "name": "general_query.str",
    "print": {
      "function": {
        "name": "query_digest",
        "args": "SELECT ?"
      }
    },
    "replace": {
      "function": {
        "name": "query_digest"
      }
    }
  }
}
```

Para realizar a substituição apenas para as declarações que correspondem ao digest, use `not` para inverter a condição:

```
"print": {
  "field": {
    "name": "general_query.str",
    "print": {
      "not": {
        "function": {
          "name": "query_digest",
          "args": "SELECT ?"
        }
      }
    },
    "replace": {
      "function": {
        "name": "query_digest"
      }
    }
  }
}
```

Suponha que você queira que o registro de auditoria contenha apenas digests de declarações e não declarações literais. Para isso, você deve realizar a substituição em todos os eventos que contêm texto de declaração; ou seja, eventos nas classes `general` e `table_access`. Uma definição de filtro anterior mostrou como substituir incondicionalmente o texto de declaração para eventos `general`. Para fazer o mesmo para eventos `table_access`, use um filtro que seja semelhante, mas mude a classe de `general` para `table_access` e o nome do campo de `general_query.str` para `query.str`:

```
{
  "filter": {
    "class": {
      "name": "table_access",
      "print": {
        "field": {
          "name": "query.str",
          "print": false,
          "replace": {
            "function": {
              "name": "query_digest"
            }
          }
        }
      }
    }
  }
}
```

Combinar os filtros `general` e `table_access` resulta em um único filtro que realiza substituição para todos os eventos que contêm texto de declaração:

```
{
  "filter": {
    "class": [
      {
        "name": "general",
        "print": {
          "field": {
            "name": "general_query.str",
            "print": false,
            "replace": {
              "function": {
                "name": "query_digest"
              }
            }
          }
        }
      },
      {
        "name": "table_access",
        "print": {
          "field": {
            "name": "query.str",
            "print": false,
            "replace": {
              "function": {
                "name": "query_digest"
              }
            }
          }
        }
      }
    ]
  }
}
```

Para realizar substituições apenas em alguns eventos dentro de uma classe, adicione itens ao filtro que indiquem mais especificamente quando a substituição ocorre. O seguinte filtro se aplica a eventos na classe `table_access`, mas realiza substituição apenas para eventos `insert` e `update` (deixando os eventos `read` e `delete` inalterados):

```
{
  "filter": {
    "class": {
      "name": "table_access",
      "event": {
        "name": [
          "insert",
          "update"
        ],
        "print": {
          "field": {
            "name": "query.str",
            "print": false,
            "replace": {
              "function": {
                "name": "query_digest"
              }
            }
          }
        }
      }
    }
  }
}
```

Este filtro realiza a substituição dos eventos da classe `general` correspondentes às declarações de gestão de contas listadas (o efeito é ocultar os valores de credenciais e dados nas declarações):

```
{
  "filter": {
    "class": {
      "name": "general",
      "event": {
        "name": "status",
        "print": {
          "field": {
            "name": "general_query.str",
            "print": false,
            "replace": {
              "function": {
                "name": "query_digest"
              }
            }
          }
        },
        "log": {
          "or": [
            {
              "field": {
                "name": "general_sql_command.str",
                "value": "alter_user"
              }
            },
            {
              "field": {
                "name": "general_sql_command.str",
                "value": "alter_user_default_role"
              }
            },
            {
              "field": {
                "name": "general_sql_command.str",
                "value": "create_role"
              }
            },
            {
              "field": {
                "name": "general_sql_command.str",
                "value": "create_user"
              }
            }
          ]
        }
      }
    }
  }
}
```

Para obter informações sobre os possíveis valores de `general_sql_command.str`, consulte Valores de campo de evento de teste.

##### Substituindo um filtro de usuário

Em alguns casos, a definição do filtro pode ser alterada dinamicamente. Para isso, defina uma configuração `filter` dentro de um `filter` existente. Por exemplo:

```
{
  "filter": {
    "id": "main",
    "class": {
      "name": "table_access",
      "event": {
        "name": [ "update", "delete" ],
        "log": false,
        "filter": {
          "class": {
            "name": "general",
            "event" : { "name": "status",
                        "filter": { "ref": "main" } }
          },
          "activate": {
            "or": [
              { "field": { "name": "table_name.str", "value": "temp_1" } },
              { "field": { "name": "table_name.str", "value": "temp_2" } }
            ]
          }
        }
      }
    }
  }
}
```

Um novo filtro é ativado quando o item `activate` dentro de um subfiltro é avaliado como `true`. Não é permitido usar `activate` em um `filter` de nível superior.

Um novo filtro pode ser substituído pelo original usando um item `ref` dentro do subfiltro para se referir ao filtro original `id`.

O filtro mostrado funciona da seguinte maneira:

* O filtro `main` aguarda eventos de `table_access`, que podem ser `update` ou `delete`.

* Se o evento `update` ou `delete` `table_access` ocorrer na tabela `temp_1` ou `temp_2`, o filtro é substituído pelo interno (sem um `id`, uma vez que não há necessidade de referenciá-lo explicitamente).

* Se o fim do comando for sinalizado (evento `general` / `status`), uma entrada é escrita no arquivo de registro de auditoria e o filtro é substituído pelo filtro `main`.

O filtro é útil para registrar declarações que atualizam ou excluem qualquer coisa das tabelas `temp_1` ou `temp_2`, como esta:

```
UPDATE temp_1, temp_3 SET temp_1.a=21, temp_3.a=23;
```

A declaração gera vários eventos `table_access`, mas o arquivo de registro de auditoria contém apenas entradas `general` / `status`.

Nota

Qualquer valor `id` utilizado na definição é avaliado apenas em relação a essa definição. Eles não têm nada a ver com o valor da variável do sistema `audit_log_filter_id`.

#### 8.4.5.9 Desativando o registro de auditoria

A variável `audit_log_disable`, introduzida no MySQL 8.0.28, permite desabilitar o registro de auditoria para todas as sessões de conexão e conectadas. A variável `audit_log_disable` pode ser definida em um arquivo de opção do MySQL Server, em uma string de inicialização de linha de comando ou em tempo de execução usando uma declaração `SET`; por exemplo:

```
SET GLOBAL audit_log_disable = true;
```

Definir `audit_log_disable` como verdadeiro desabilita o plugin do registro de auditoria. O plugin é reativado quando `audit_log_disable` é definido de volta para `false`, que é o ajuste padrão.

Iniciar o plugin do registro de auditoria com `audit_log_disable = true` gera um aviso (`ER_WARN_AUDIT_LOG_DISABLED`) com a seguinte mensagem: O registro de auditoria está desativado. Ative-o com audit_log_disable = false. Definir `audit_log_disable` para false também gera um aviso. Quando `audit_log_disable` é definido como true, as chamadas de função do registro de auditoria e as alterações de variáveis geram um aviso de sessão.

Definir o valor de execução de `audit_log_disable` requer o privilégio `AUDIT_ADMIN`, além do privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio descontinuado `SUPER`, normalmente necessário para definir o valor de execução de uma variável de sistema global).

#### 8.4.5.10 Filtragem do Registro de Auditoria no Modo Legado

Nota

Esta seção descreve a filtragem do registro de auditoria de legado, que se aplica se o plugin `audit_log` for instalado sem as tabelas e funções de auditoria que acompanham, necessárias para a filtragem baseada em regras.

O filtro do registro de auditoria no modo legado é descontinuado a partir do MySQL 8.0.34.

O plugin de registro de auditoria pode filtrar eventos auditados. Isso permite que você controle se os eventos auditados são escritos no arquivo de registro de auditoria com base na conta de onde os eventos se originam ou no status do evento. O filtro de status ocorre separadamente para eventos de conexão e eventos de declaração.

* Filtro de eventos de legado por conta
* Filtro de eventos de legado por status

##### Filtro de eventos de legado por conta

Para filtrar eventos auditados com base na conta de origem, defina uma (não ambas) das seguintes variáveis do sistema na inicialização ou no runtime do servidor. Essas variáveis obsoletas se aplicam apenas ao filtro de registro de auditoria legítimo.

* `audit_log_include_accounts`: As contas a serem incluídas no registro de auditoria. Se esta variável for definida, apenas essas contas serão auditadas.

* `audit_log_exclude_accounts`: As contas a serem excluídas do registro de auditoria. Se esta variável for definida, todas as contas, exceto essas, são auditadas.

O valor para qualquer uma das variáveis pode ser `NULL` ou uma string que contenha um ou mais nomes de contas separados por vírgula, cada um no formato `user_name@host_name`. Por padrão, ambas as variáveis são `NULL`, nesse caso, não é realizada nenhuma filtragem de contas e a auditoria ocorre para todas as contas.

As modificações em `audit_log_include_accounts` ou `audit_log_exclude_accounts` afetam apenas as conexões criadas após a modificação, e não as conexões existentes.

Exemplo: Para habilitar o registro de auditoria apenas para as contas de host locais `user1` e `user2`, defina a variável de sistema `audit_log_include_accounts` da seguinte forma:

```
SET GLOBAL audit_log_include_accounts = 'user1@localhost,user2@localhost';
```

Apenas um dos `audit_log_include_accounts` ou `audit_log_exclude_accounts` pode ser não `NULL` de cada vez:

* Se você definir `audit_log_include_accounts`, o servidor define `audit_log_exclude_accounts` como `NULL`.

* Se você tentar definir `audit_log_exclude_accounts`, ocorrerá um erro, a menos que `audit_log_include_accounts` esteja definido como `NULL`. Nesse caso, você deve primeiro limpar `audit_log_include_accounts`, definindo-a como `NULL`.

```
-- This sets audit_log_exclude_accounts to NULL
SET GLOBAL audit_log_include_accounts = value;

-- This fails because audit_log_include_accounts is not NULL
SET GLOBAL audit_log_exclude_accounts = value;

-- To set audit_log_exclude_accounts, first set
-- audit_log_include_accounts to NULL
SET GLOBAL audit_log_include_accounts = NULL;
SET GLOBAL audit_log_exclude_accounts = value;
```

Se você verificar o valor de qualquer uma das variáveis, esteja ciente de que `SHOW VARIABLES` exibe `NULL` como uma string vazia. Para exibir `NULL` como `NULL`, use `SELECT` em vez disso:

```
mysql> SHOW VARIABLES LIKE 'audit_log_include_accounts';
+----------------------------+-------+
| Variable_name              | Value |
+----------------------------+-------+
| audit_log_include_accounts |       |
+----------------------------+-------+
mysql> SELECT @@audit_log_include_accounts;
+------------------------------+
| @@audit_log_include_accounts |
+------------------------------+
| NULL                         |
+------------------------------+
```

Se o nome de usuário ou o nome do host exigir citação porque contém uma vírgula, espaço ou outro caractere especial, cite-o usando aspas simples. Se o próprio valor da variável for citado com aspas simples, duplique as aspas simples internas ou escape-as com uma barra invertida. As seguintes declarações permitem o registro de auditoria para a conta local `root` e são equivalentes, embora os estilos de citação sejam diferentes:

```
SET GLOBAL audit_log_include_accounts = 'root@localhost';
SET GLOBAL audit_log_include_accounts = '''root''@''localhost''';
SET GLOBAL audit_log_include_accounts = '\'root\'@\'localhost\'';
SET GLOBAL audit_log_include_accounts = "'root'@'localhost'";
```

A última afirmação não funciona se o modo SQL `ANSI_QUOTES` estiver habilitado, porque, nesse modo, as aspas duplas significam citação de identificador, não de string.

##### Filtro de eventos de legado por status

Para filtrar eventos auditados com base no status, defina as seguintes variáveis do sistema na inicialização ou no runtime do servidor. Essas variáveis obsoletas se aplicam apenas ao filtro de registro de auditoria legítimo. Para o filtro de registro de auditoria JSON, variáveis de status diferentes se aplicam; consulte Opções e Variáveis do Registro de Auditoria.

* `audit_log_connection_policy`: Política de registro para eventos de conexão

* `audit_log_statement_policy`: Política de registro para eventos de declaração

Cada variável assume um valor de `ALL` (registrar todos os eventos associados; este é o padrão), `ERRORS` (registrar apenas eventos falhos) ou `NONE` (não registrar eventos). Por exemplo, para registrar todos os eventos de declaração, mas apenas eventos de conexão falhos, use essas configurações:

```
SET GLOBAL audit_log_statement_policy = ALL;
SET GLOBAL audit_log_connection_policy = ERRORS;
```

Outra variável do sistema de políticas, `audit_log_policy`, está disponível, mas não oferece tanto controle quanto `audit_log_connection_policy` e `audit_log_statement_policy`. Ela só pode ser definida na inicialização do servidor.

Nota

A variável de sistema `audit_log_policy` no modo legado é descontinuada a partir do MySQL 8.0.34.

Em tempo de execução, é uma variável somente de leitura. Ela recebe um valor de `ALL` (registrar todos os eventos; este é o padrão), `LOGINS` (registrar eventos de conexão), `QUERIES` (registrar eventos de declaração) ou `NONE` (não registrar eventos). Para qualquer um desses valores, o plugin de registro de auditoria registra todos os eventos selecionados sem distinção de sucesso ou falha. O uso de `audit_log_policy` no início funciona da seguinte forma:

* Se você não definir `audit_log_policy` ou definir-o como o padrão `ALL`, quaisquer configurações explícitas para `audit_log_connection_policy` ou `audit_log_statement_policy` se aplicam conforme especificado. Se não especificado, eles têm como padrão `ALL`.

* Se você definir `audit_log_policy` para um valor não `ALL`, esse valor terá precedência e será usado para definir `audit_log_connection_policy` e `audit_log_statement_policy`, conforme indicado na tabela a seguir. Se você também definir qualquer uma dessas variáveis para um valor diferente do seu padrão de `ALL`, o servidor escreverá uma mensagem no log de erro para indicar que seus valores estão sendo substituídos.

  <table summary="How the server uses audit_log_policy to set audit_log_connection_policy and audit_log_statement_policy at startup."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th scope="col">Startup audit_log_policy Value</th> <th scope="col">Resulting audit_log_connection_policy Value</th> <th scope="col">Resulting audit_log_statement_policy Value</th> </tr></thead><tbody><tr> <th scope="row"><code>LOGINS</code></th> <td><code>ALL</code></td> <td><code>NONE</code></td> </tr><tr> <th scope="row"><code>QUERIES</code></th> <td><code>NONE</code></td> <td><code>ALL</code></td> </tr><tr> <th scope="row"><code>NONE</code></th> <td><code>NONE</code></td> <td><code>NONE</code></td> </tr></tbody></table>

#### 8.4.5.11 Referência do registro de auditoria

As seções a seguir fornecem uma referência aos elementos de auditoria do MySQL Enterprise:

* Tabelas do Log de Auditoria
* Funções do Log de Auditoria
* Referência de Opções e Variáveis do Log de Auditoria
* Opções e Variáveis do Log de Auditoria
* Variáveis de Status do Log de Auditoria

Para instalar as tabelas e funções do registro de auditoria, use as instruções fornecidas na Seção 8.4.5.2, “Instalando ou Desinstalando o Registro de Auditoria MySQL Enterprise”. A menos que esses objetos sejam instalados, o plugin `audit_log` opera no modo legado (desatualizado no MySQL 8.0.34). Veja a Seção 8.4.5.10, “Filtragem do Registro de Auditoria no Modo Legado”.

Tabelas do Log de Auditoria

O MySQL Enterprise Audit utiliza tabelas no banco de dados do sistema `mysql` para armazenamento persistente de dados de filtro e contas de usuário. As tabelas só podem ser acessadas por usuários que tenham privilégios para esse banco de dados. Para usar um banco de dados diferente, defina a variável de sistema `audit_log_database` na inicialização do servidor. As tabelas utilizam o mecanismo de armazenamento `InnoDB`.

Se essas tabelas estiverem ausentes, o plugin `audit_log` opera no modo (desatualizado) legado. Veja a Seção 8.4.5.10, “Filtragem do Diário de Auditoria do Modo Legado”.

A tabela `audit_log_filter` armazena definições de filtro. A tabela tem as seguintes colunas:

* `NAME`

O nome do filtro.

* `FILTER`

A definição do filtro associada ao nome do filtro. As definições são armazenadas como valores `JSON`.

A tabela `audit_log_user` armazena informações de conta de usuário. A tabela tem as seguintes colunas:

* `USER`

A parte do nome de usuário de uma conta. Para uma conta `user1@localhost`, a parte `user1` é `user1`.

* `HOST`

A parte do nome de host de uma conta. Para uma conta `user1@localhost`, a parte `HOST` é `localhost`.

* `FILTERNAME`

O nome do filtro atribuído à conta. O nome do filtro associa a conta a um filtro definido na tabela `audit_log_filter`.

Funções do Log de Auditoria #####

Esta seção descreve, para cada função do registro de auditoria, seu propósito, sequência de chamada e valor de retorno. Para informações sobre as condições sob as quais essas funções podem ser invocadas, consulte a Seção 8.4.5.7, “Filtragem do Registro de Auditoria”.

Cada função de registro de auditoria retorna uma string que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: message` indica falha.

A partir do MySQL 8.0.19, as funções de registro de auditoria convertem argumentos de string em `utf8mb4` e os valores de retorno de string são strings `utf8mb4`. Antes do MySQL 8.0.19, as funções de registro de auditoria tratam argumentos de string como strings binárias (o que significa que elas não distinguem maiúsculas e minúsculas), e os valores de retorno de string são strings binárias.

Se uma função de registro de auditoria for invocada dentro do cliente **mysql**, os resultados de cadeia binária são exibidos usando notação hexadecimal, dependendo do valor do `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando MySQL”.

Para verificar a instalação das funções do log de auditoria, use este comando:

```
SELECT * FROM performance_schema.user_defined_functions;
```

Para saber mais, consulte a Seção 7.7.2, “Obtenção de informações sobre funções carregáveis”.

Essas funções do log de auditoria estão disponíveis:

* `audit_log_encryption_password_get([keyring_id])`

Essa função recupera uma senha de criptografia de registro de auditoria do chaveiro MySQL, que deve estar habilitada ou ocorrerá um erro. Qualquer componente ou plugin do chaveiro pode ser usado; para instruções, consulte a Seção 8.4.4, “O Chaveiro MySQL”.

Sem argumento, a função recupera a senha de criptografia atual como uma string binária. Pode-se fornecer um argumento para especificar qual senha de criptografia do log de auditoria deve ser recuperada. O argumento deve ser o ID do chaveiro da senha atual ou uma senha arquivada.

Para obter informações adicionais sobre criptografia do log de auditoria, consulte Criptografar arquivos de log de auditoria.

Argumentos:

*`keyring_id`*: A partir do MySQL 8.0.17, este argumento opcional indica o ID do chaveiro da senha a ser recuperada. O comprimento máximo permitido é de 766 bytes. Se omitido, a função recupera a senha atual.

Antes do MySQL 8.0.17, nenhum argumento é permitido. A função sempre recupera a senha atual.

Valor de retorno:

A string de senha para sucesso (até 766 bytes), ou `NULL` e um erro para falha.

Exemplo:

Recuperar a senha atual:

  ```
  mysql> SELECT audit_log_encryption_password_get();
  +-------------------------------------+
  | audit_log_encryption_password_get() |
  +-------------------------------------+
  | secret                              |
  +-------------------------------------+
  ```

Para recuperar uma senha por ID, você pode determinar quais IDs de chave de registro de registro de auditoria existem, fazendo uma consulta à tabela do Schema de desempenho `keyring_keys`:

  ```
  mysql> SELECT KEY_ID FROM performance_schema.keyring_keys
         WHERE KEY_ID LIKE 'audit_log%'
         ORDER BY KEY_ID;
  +-----------------------------+
  | KEY_ID                      |
  +-----------------------------+
  | audit_log-20190415T152248-1 |
  | audit_log-20190415T153507-1 |
  | audit_log-20190416T125122-1 |
  | audit_log-20190416T141608-1 |
  +-----------------------------+
  mysql> SELECT audit_log_encryption_password_get('audit_log-20190416T125122-1');
  +------------------------------------------------------------------+
  | audit_log_encryption_password_get('audit_log-20190416T125122-1') |
  +------------------------------------------------------------------+
  | segreto                                                          |
  +------------------------------------------------------------------+
  ```

* `audit_log_encryption_password_set(password)`

Define a senha de criptografia do log de auditoria atual como o argumento e armazena a senha no chaveiro MySQL. A partir do MySQL 8.0.19, a senha é armazenada como uma string `utf8mb4`. Antes do MySQL 8.0.19, a senha é armazenada em formato binário.

Se a criptografia estiver habilitada, esta função realiza uma operação de rotação de arquivo de registro que renomeia o arquivo de registro atual e começa um novo arquivo de registro criptografado com a senha. O chaveiro deve estar habilitado ou ocorrerá um erro. Qualquer componente ou plugin do chaveiro pode ser usado; para instruções, consulte a Seção 8.4.4, “O Chaveiro MySQL”.

Para obter informações adicionais sobre criptografia do log de auditoria, consulte Criptografar arquivos de log de auditoria.

Argumentos:

*`password`*: A string de senha. O comprimento máximo permitido é de 766 bytes.

Valor de retorno:

1 para sucesso, 0 para falha.

Exemplo:

  ```
  mysql> SELECT audit_log_encryption_password_set(password);
  +---------------------------------------------+
  | audit_log_encryption_password_set(password) |
  +---------------------------------------------+
  | 1                                           |
  +---------------------------------------------+
  ```

* `audit_log_filter_flush()`

Chamar qualquer uma das outras funções de filtragem afeta imediatamente o filtro do log de auditoria operacional e atualiza as tabelas do log de auditoria. Se, em vez disso, você modificar o conteúdo dessas tabelas diretamente usando declarações como `INSERT`, `UPDATE` e `DELETE`, as mudanças não afetam imediatamente o filtro. Para limpar suas alterações e torná-las operacionais, chame `audit_log_filter_flush()`.

Aviso

`audit_log_filter_flush()` deve ser usado apenas após modificar as tabelas de auditoria diretamente, para forçar a recarga de todos os filtros. Caso contrário, essa função deve ser evitada. É, na verdade, uma versão simplificada da descarga e recarga do plugin `audit_log` com `UNINSTALL PLUGIN` mais `INSTALL PLUGIN`.

`audit_log_filter_flush()` afeta todas as sessões atuais e as desvincula de seus filtros anteriores. As sessões atuais não são mais registradas, a menos que se desconectem e se reconectem, ou executem uma operação de mudança de usuário.

Se essa função falhar, uma mensagem de erro é retornada e o registro de auditoria é desativado até o próximo chamado bem-sucedido ao `audit_log_filter_flush()`.

Argumentos:

  None.

Valor de retorno:

Uma cadeia que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: message` indica falha.

Exemplo:

  ```
  mysql> SELECT audit_log_filter_flush();
  +--------------------------+
  | audit_log_filter_flush() |
  +--------------------------+
  | OK                       |
  +--------------------------+
  ```

* `audit_log_filter_remove_filter(filter_name)`

Dado um nome de filtro, remove o filtro do conjunto atual de filtros. Não é um erro se o filtro não existir.

Se um filtro removido for atribuído a quaisquer contas de usuário, esses usuários deixam de ser filtrados (são removidos da tabela `audit_log_user`). A interrupção do filtro inclui todas as sessões atuais desses usuários: eles são desconectados do filtro e não são mais registrados.

Argumentos:

+ *`filter_name`*: Uma cadeia que especifica o nome do filtro.

Valor de retorno:

Uma cadeia que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: message` indica falha.

Exemplo:

  ```
  mysql> SELECT audit_log_filter_remove_filter('SomeFilter');
  +----------------------------------------------+
  | audit_log_filter_remove_filter('SomeFilter') |
  +----------------------------------------------+
  | OK                                           |
  +----------------------------------------------+
  ```

* `audit_log_filter_remove_user(user_name)`

Dado o nome da conta do usuário, faça com que o usuário não seja mais atribuído a um filtro. Não é um erro se o usuário não tiver nenhum filtro atribuído. O filtro de sessões atuais para o usuário permanece inalterado. Novas conexões para o usuário são filtradas usando o filtro de conta padrão, se houver um, e não são registradas de outra forma.

Se o nome for `%`, a função remove o filtro de conta padrão que é usado para qualquer conta de usuário que não tenha um filtro explicitamente atribuído.

Argumentos:

+ *`user_name`*: O nome da conta do usuário como uma string no formato `user_name@host_name` ou `%` para representar a conta padrão.

Valor de retorno:

Uma cadeia que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: message` indica falha.

Exemplo:

  ```
  mysql> SELECT audit_log_filter_remove_user('user1@localhost');
  +-------------------------------------------------+
  | audit_log_filter_remove_user('user1@localhost') |
  +-------------------------------------------------+
  | OK                                              |
  +-------------------------------------------------+
  ```

* `audit_log_filter_set_filter(filter_name, definition)`(audit-log-reference.html#function_audit-log-filter-set-filter)

Dado um nome e uma definição de filtro, adiciona o filtro ao conjunto atual de filtros. Se o filtro já existir e ser usado por qualquer sessão atual, essas sessões são desconectadas do filtro e não são mais registradas. Isso ocorre porque a nova definição de filtro tem um novo ID de filtro que difere de seu ID anterior.

Argumentos:

+ *`filter_name`*: Uma cadeia que especifica o nome do filtro.

+ *`definition`*: Um valor `JSON` que especifica a definição do filtro.

Valor de retorno:

Uma cadeia que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: message` indica falha.

Exemplo:

  ```
  mysql> SET @f = '{ "filter": { "log": false } }';
  mysql> SELECT audit_log_filter_set_filter('SomeFilter', @f);
  +-----------------------------------------------+
  | audit_log_filter_set_filter('SomeFilter', @f) |
  +-----------------------------------------------+
  | OK                                            |
  +-----------------------------------------------+
  ```

* `audit_log_filter_set_user(user_name, filter_name)`(audit-log-reference.html#function_audit-log-filter-set-user)

Dado um nome de conta do usuário e um nome de filtro, atribui o filtro ao usuário. Um usuário pode ser atribuído apenas um filtro, portanto, se o usuário já tiver sido atribuído um filtro, a atribuição é substituída. A filtragem de sessões atuais para o usuário permanece inalterada. Novas conexões são filtradas usando o novo filtro.

Como um caso especial, o nome `%` representa a conta padrão. O filtro é usado para conexões de qualquer conta de usuário que não tenha um filtro explicitamente atribuído.

Argumentos:

+ *`user_name`*: O nome da conta do usuário como uma string no formato `user_name@host_name` ou `%` para representar a conta padrão.

+ *`filter_name`*: Uma cadeia que especifica o nome do filtro.

Valor de retorno:

Uma cadeia que indica se a operação foi bem-sucedida. `OK` indica sucesso. `ERROR: message` indica falha.

Exemplo:

  ```
  mysql> SELECT audit_log_filter_set_user('user1@localhost', 'SomeFilter');
  +------------------------------------------------------------+
  | audit_log_filter_set_user('user1@localhost', 'SomeFilter') |
  +------------------------------------------------------------+
  | OK                                                         |
  +------------------------------------------------------------+
  ```

* `audit_log_read([arg])`

Leitura do registro de auditoria e retorno de um resultado da string `JSON`. Se o formato do registro de auditoria não for `JSON`, ocorre um erro.

Sem argumento ou argumento de hash `JSON`, `audit_log_read()` lê eventos do registro de auditoria e retorna uma cadeia de `JSON`, contendo um array de eventos de auditoria. Os itens do argumento de hash influenciam a ocorrência da leitura, conforme descrito mais adiante. Cada elemento do array retornado é um evento representado como um hash `JSON`, com exceção de que o último elemento pode ser um valor `JSON` `null` para indicar que não há eventos seguintes disponíveis para leitura.

Com um argumento que consiste em um valor de `JSON` `null`, `audit_log_read()` fecha a sequência de leitura atual.

Para obter informações adicionais sobre o processo de leitura do registro de auditoria, consulte a Seção 8.4.5.6, “Leitura de arquivos de registro de auditoria”.

Argumentos:

Para obter um marcador para o evento mais recentemente escrito, ligue para `audit_log_read_bookmark()`.

*`arg`*: O argumento é opcional. Se omitido, a função lê eventos a partir da posição atual. Se presente, o argumento pode ser um valor `JSON` `null` para fechar a sequência de leitura, ou um `JSON` hash. Dentro de um argumento hash, os itens são opcionais e controlam aspectos da operação de leitura, como a posição em que começar a leitura ou quantas eventos devem ser lidos. Os seguintes itens são significativos (outros itens são ignorados):

+ `start`: A posição dentro do registro de auditoria do primeiro evento a ser lido. A posição é dada como um timestamp e a leitura começa a partir do primeiro evento que ocorre no valor do timestamp ou após ele. O item `start` tem esse formato, onde *`value`* é um valor literal de timestamp:

    ```
    "start": { "timestamp": "value" }
    ```

O item `start` é permitido a partir do MySQL 8.0.22.

+ `timestamp`, `id`: A posição dentro do registro de auditoria do primeiro evento a ser lido. Os itens `timestamp` e `id` juntos compõem um marcador que identifica de forma única um evento particular. Se um argumento `audit_log_read()` incluir qualquer um desses itens, ele deve incluir ambos para especificar completamente uma posição ou ocorrerá um erro.

+ `max_array_length`: O número máximo de eventos a serem lidos do log. Se este item for omitido, o padrão é ler até o final do log ou até que o buffer de leitura esteja cheio, o que ocorrer primeiro.

Para especificar uma posição inicial para `audit_log_read()`, passe um argumento de hash que inclua um item de `start` ou um marcador composto por itens de `timestamp` e `id`. Se um argumento de hash incluir tanto um item de `start` quanto um marcador, ocorrerá um erro.

Se um argumento hash não especificar nenhuma posição inicial, a leitura continua a partir da posição atual.

Se um valor de marcação de tempo não incluir uma parte de hora, é assumido uma parte de hora de `00:00:00`.

Valor de retorno:

Se a chamada for bem-sucedida, o valor de retorno é uma string `JSON` contendo um array de eventos de auditoria, ou um valor `JSON` `null` se isso foi passado como argumento para fechar a sequência de leitura. Se a chamada falhar, o valor de retorno é `NULL` e ocorre um erro.

Exemplo:

  ```
  mysql> SELECT audit_log_read(audit_log_read_bookmark());
  +-----------------------------------------------------------------------+
  | audit_log_read(audit_log_read_bookmark())                             |
  +-----------------------------------------------------------------------+
  | [ {"timestamp":"2020-05-18 22:41:24","id":0,"class":"connection", ... |
  +-----------------------------------------------------------------------+
  mysql> SELECT audit_log_read('null');
  +------------------------+
  | audit_log_read('null') |
  +------------------------+
  | null                   |
  +------------------------+
  ```

Notas:

Antes do MySQL 8.0.19, os valores de retorno de string são strings binárias `JSON`. Para obter informações sobre a conversão desses valores em strings não binárias, consulte a Seção 8.4.5.6, “Leitura de arquivos de registro de auditoria”.

* `audit_log_read_bookmark()`

Retorna uma string `JSON` que representa um marcador para o evento de registro de auditoria mais recentemente escrito. Se o formato do registro de auditoria não for `JSON`, ocorre um erro.

O marcador é um hash `JSON` com os itens `timestamp` e `id` que identificam de forma única a posição de um evento dentro do registro de auditoria. É adequado para ser passado para `audit_log_read()` para indicar àquela função a posição em que deve começar a leitura.

Para obter informações adicionais sobre o processo de leitura do registro de auditoria, consulte a Seção 8.4.5.6, “Leitura de arquivos de registro de auditoria”.

Argumentos:

  None.

Valor de retorno:

Uma string `JSON` contendo um marcador de sucesso, ou `NULL` e um erro para falha.

Exemplo:

  ```
  mysql> SELECT audit_log_read_bookmark();
  +-------------------------------------------------+
  | audit_log_read_bookmark()                       |
  +-------------------------------------------------+
  | { "timestamp": "2019-10-03 21:03:44", "id": 0 } |
  +-------------------------------------------------+
  ```

Notas:

Antes do MySQL 8.0.19, os valores de retorno de string são strings binárias `JSON`. Para obter informações sobre a conversão desses valores em strings não binárias, consulte a Seção 8.4.5.6, “Leitura de arquivos de registro de auditoria”.

* `audit_log_rotate()`

Argumentos:

  None.

Valor de retorno:

O nome do arquivo renomeado.

Exemplo:

  ```
  mysql> SELECT audit_log_rotate();
  ```

O uso de `audit_log_rotate()` requer o privilégio `AUDIT_ADMIN`.

Opção de registro de auditoria e referência de variável

**Tabela 8.44 Opção de registro de auditoria e referência de variável**

<table frame="box" rules="all" summary="Reference for audit log command-line options, system variables, and status variables."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th scope="col">Name</th> <th scope="col">Cmd-Line</th> <th scope="col">Option File</th> <th scope="col">System Var</th> <th scope="col">Status Var</th> <th scope="col">Var Scope</th> <th scope="col">Dynamic</th> </tr></thead><tbody><tr><th scope="row">audit-log</th> <td>Yes</td> <td>Yes</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th scope="row">audit_log_buffer_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">audit_log_compression</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">audit_log_connection_policy</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">audit_log_current_session</th> <td></td> <td></td> <td>Yes</td> <td></td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Audit_log_current_size</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">audit_log_database</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">audit_log_disable</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">audit_log_encryption</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Audit_log_event_max_drop_size</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Audit_log_events</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Audit_log_events_filtered</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Audit_log_events_lost</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Audit_log_events_written</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">audit_log_exclude_accounts</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">audit_log_file</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">audit_log_filter_id</th> <td></td> <td></td> <td>Yes</td> <td></td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">audit_log_flush</th> <td></td> <td></td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">audit_log_flush_interval_seconds</th> <td>Yes</td> <td></td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">audit_log_format</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">audit_log_include_accounts</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">audit_log_max_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">audit_log_password_history_keep_days</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">audit_log_policy</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">audit_log_prune_seconds</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">audit_log_read_buffer_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Varies</td> <td>Varies</td> </tr><tr><th scope="row">audit_log_rotate_on_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">audit_log_statement_policy</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">audit_log_strategy</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Audit_log_total_size</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Audit_log_write_waits</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr></tbody></table>

Opções e variáveis do log de auditoria #####

Esta seção descreve as opções de comando e as variáveis do sistema que configuram o funcionamento do MySQL Enterprise Audit. Se os valores especificados no momento do início forem incorretos, o plugin `audit_log` pode não ser iniciado corretamente e o servidor não o carregará. Nesse caso, o servidor também pode produzir mensagens de erro para outras configurações do registro de auditoria, pois não as reconhece.

Para configurar a ativação do plugin de registro de auditoria, use esta opção:

* `--audit-log[=value]`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

Esta opção controla como o servidor carrega o plugin `audit_log` no início. Está disponível apenas se o plugin tiver sido registrado anteriormente com `INSTALL PLUGIN` ou estiver carregado com `--plugin-load` ou `--plugin-load-add`. Veja a Seção 8.4.5.2, “Instalando ou Desinstalando Auditoria MySQL Enterprise”.

O valor da opção deve ser um dos disponíveis para opções de carregamento de plugins, conforme descrito na Seção 7.6.1, “Instalando e Desinstalando Plugins”. Por exemplo, `--audit-log=FORCE_PLUS_PERMANENT` informa ao servidor para carregar o plugin e impedir que ele seja removido enquanto o servidor estiver em execução.

Se o plugin do registro de auditoria estiver habilitado, ele expõe várias variáveis do sistema que permitem o controle do registro:

```
mysql> SHOW VARIABLES LIKE 'audit_log%';
+--------------------------------------+--------------+
| Variable_name                        | Value        |
+--------------------------------------+--------------+
| audit_log_buffer_size                | 1048576      |
| audit_log_compression                | NONE         |
| audit_log_connection_policy          | ALL          |
| audit_log_current_session            | OFF          |
| audit_log_database                   | mysql        |
| audit_log_disable                    | OFF          |
| audit_log_encryption                 | NONE         |
| audit_log_exclude_accounts           |              |
| audit_log_file                       | audit.log    |
| audit_log_filter_id                  | 0            |
| audit_log_flush                      | OFF          |
| audit_log_flush_interval_seconds     | 0            |
| audit_log_format                     | NEW          |
| audit_log_format_unix_timestamp      | OFF          |
| audit_log_include_accounts           |              |
| audit_log_max_size                   | 0            |
| audit_log_password_history_keep_days | 0            |
| audit_log_policy                     | ALL          |
| audit_log_prune_seconds              | 0            |
| audit_log_read_buffer_size           | 32768        |
| audit_log_rotate_on_size             | 0            |
| audit_log_statement_policy           | ALL          |
| audit_log_strategy                   | ASYNCHRONOUS |
+--------------------------------------+--------------+
```

Você pode definir qualquer uma dessas variáveis no início da inicialização do servidor e algumas delas no tempo de execução. Aquelas que estão disponíveis apenas para o filtro de registro de auditoria de modo legítimo são destacadas.

* `audit_log_buffer_size`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>

Quando o plugin de registro de auditoria escreve eventos no log de forma assíncrona, ele usa um buffer para armazenar o conteúdo dos eventos antes de escrevê-los. Esta variável controla o tamanho desse buffer, em bytes. O servidor ajusta o valor para um múltiplo de 4096. O plugin usa um único buffer, que ele aloca quando inicializa e remove quando termina. O plugin aloca esse buffer apenas se o registro for assíncrono.

* `audit_log_compression`

  <table frame="box" rules="all" summary="Properties for audit_log_compression"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-compression=value</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_compression</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>NONE</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>NONE</code></p><p class="valid-value"><code>GZIP</code></p></td> </tr></tbody></table>

O tipo de compressão para o arquivo de registro de auditoria. Os valores permitidos são `NONE` (sem compressão; o padrão) e `GZIP` (compressão GNU Zip). Para mais informações, consulte Compressão de arquivos de registro de auditoria.

* `audit_log_connection_policy`

  <table frame="box" rules="all" summary="Properties for audit_log_connection_policy"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-connection-policy=value</code></td> </tr><tr><th>Deprecated</th> <td>8.0.34</td> </tr><tr><th>System Variable</th> <td><code>audit_log_connection_policy</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ALL</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>ALL</code></p><p class="valid-value"><code>ERRORS</code></p><p class="valid-value"><code>NONE</code></p></td> </tr></tbody></table>

Nota

Essa variável descontinuada se aplica apenas ao filtro do registro de auditoria no modo legado (consulte a Seção 8.4.5.10, “Filtro do Registro de Auditoria no Modo Legado”).

A política que controla como o plugin de registro de auditoria escreve eventos de conexão em seu arquivo de registro. O seguinte quadro mostra os valores permitidos.

  <table summary="Permitted values for the audit_log_connection_policy variable."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Value</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>ALL</code></td> <td>Registre todos os eventos de conexão</td> </tr><tr> <td><code>ERRORS</code></td> <td>Registro apenas eventos de conexão falha</td> </tr><tr> <td><code>NONE</code></td> <td>Não registre eventos de conexão</td> </tr></tbody></table>

Nota

Ao iniciar o servidor, qualquer valor explícito fornecido para `audit_log_connection_policy` pode ser sobrescrito se `audit_log_policy` também for especificado, conforme descrito na Seção 8.4.5.5, “Configurando as características de registro de auditoria”.

* `audit_log_current_session`

  <table frame="box" rules="all" summary="Properties for audit_log_current_session"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>audit_log_current_session</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>depends on filtering policy</code></td> </tr></tbody></table>

Se o registro de auditoria está habilitado para a sessão atual. O valor da sessão desta variável é somente leitura. É definido quando a sessão começa com base nos valores das variáveis de sistema `audit_log_include_accounts` e `audit_log_exclude_accounts`. O plugin de registro de auditoria usa o valor da sessão para determinar se deve auditar eventos para a sessão. (Há um valor global, mas o plugin não o usa.)

* `audit_log_database`

  <table frame="box" rules="all" summary="Properties for audit_log_database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-database=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.33</td> </tr><tr><th>System Variable</th> <td><code>audit_log_database</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql</code></td> </tr></tbody></table>

Especifica qual banco de dados o plugin `audit_log` usa para encontrar suas tabelas. Essa variável é somente leitura. Para mais informações, consulte a Seção 8.4.5.2, “Instalando ou Desinstalando Auditoria MySQL Enterprise”).

* `audit_log_disable`

  <table frame="box" rules="all" summary="Properties for audit_log_disable"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-disable[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>8.0.28</td> </tr><tr><th>System Variable</th> <td><code>audit_log_disable</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Permite desabilitar o registro de auditoria para todas as sessões de conexão e conectadas. Além do privilégio `SYSTEM_VARIABLES_ADMIN`, a desativação do registro de auditoria requer o privilégio `AUDIT_ADMIN`. Veja a Seção 8.4.5.9, “Desabilitar o Registro de Auditoria”.

* `audit_log_encryption`

  <table frame="box" rules="all" summary="Properties for audit_log_encryption"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-encryption=value</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_encryption</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>NONE</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>NONE</code></p><p class="valid-value"><code>AES</code></p></td> </tr></tbody></table>

O tipo de criptografia para o arquivo de registro de auditoria. Os valores permitidos são `NONE` (sem criptografia; o padrão) e `AES` (criptografia de cifra AES-256-CBC). Para mais informações, consulte Criptografar arquivos de registro de auditoria.

* `audit_log_exclude_accounts`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>0

Nota

Essa variável descontinuada se aplica apenas ao filtro do registro de auditoria no modo legado (consulte a Seção 8.4.5.10, “Filtro do Registro de Auditoria no Modo Legado”).

As contas para as quais os eventos não devem ser registrados. O valor deve ser `NULL` ou uma string contendo uma lista de um ou mais nomes de contas separados por vírgula. Para mais informações, consulte a Seção 8.4.5.7, “Filtragem do Log de Auditoria”.

As modificações em `audit_log_exclude_accounts` afetam apenas as conexões criadas após a modificação, e não as conexões existentes.

* `audit_log_file`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>1

O nome da base e o sufixo do arquivo ao qual o plugin de registro de auditoria escreve eventos. O valor padrão é `audit.log`, independentemente do formato de registro. Para que o sufixo do nome corresponda ao formato, defina o nome explicitamente, escolhendo um sufixo diferente (por exemplo, `audit.xml` para o formato XML, `audit.json` para o formato JSON).

Se o valor de `audit_log_file` for um nome de caminho relativo, o plugin o interpreta em relação ao diretório de dados. Se o valor for um nome de caminho completo, o plugin usa o valor como está. Um nome de caminho completo pode ser útil se for desejável localizar arquivos de auditoria em um sistema de arquivos ou diretório separado. Por razões de segurança, escreva o arquivo de log de auditoria em um diretório acessível apenas ao servidor MySQL e aos usuários que têm um motivo legítimo para visualizar o log.

Para obter detalhes sobre como o plugin do registro de auditoria interpreta o valor `audit_log_file` e as regras para renomear arquivos que ocorrem na inicialização e término do plugin, consulte as Convenções de Nomenclatura para Arquivos de Registro de Auditoria.

O plugin de registro de auditoria usa o diretório que contém o arquivo de registro de auditoria (determinado pelo valor `audit_log_file`) como o local para procurar arquivos de registro de auditoria legíveis. Esses arquivos de registro e o arquivo atual, o plugin constrói uma lista dos que estão sujeitos ao uso com as funções de marcação e leitura de registro de auditoria. Veja a Seção 8.4.5.6, “Leitura de Arquivos de Registro de Auditoria”.

* `audit_log_filter_id`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>2

O valor da sessão desta variável indica o ID mantido internamente do filtro de auditoria para a sessão atual. Um valor de 0 significa que a sessão não tem nenhum filtro atribuído.

* `audit_log_flush`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>3

Nota

A variável `audit_log_flush` é descontinuada a partir do MySQL 8.0.31; espera-se que o suporte para ela seja removido em uma versão futura do MySQL. Ela é substituída pela função `audit_log_rotate()`.

Se `audit_log_rotate_on_size` for 0, o rolamento automático do arquivo de registro de auditoria é desativado e o rolamento ocorre apenas quando realizado manualmente. Nesse caso, habilitar `audit_log_flush` definindo-o como 1 ou `ON` faz com que o plugin de registro de auditoria feche e volte a abrir seu arquivo de registro para esvaziá-lo. (O valor da variável permanece `OFF` para que você não precise desativá-la explicitamente antes de ativá-la novamente para realizar outro esvaziamento.) Para mais informações, consulte a Seção 8.4.5.5, “Configurando as Características de Registro de Auditoria”.

* `audit_log_flush_interval_seconds`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>4

Essa variável do sistema depende do componente `scheduler`, que deve ser instalado e habilitado (consulte Seção 7.5.5, "Componente do Cronograma"). Para verificar o status do componente:

  ```
  SHOW VARIABLES LIKE 'component_scheduler%';
  +-----------------------------+-------+
  | Variable_name               | Value |
  +-----------------------------+-------|
  | component_scheduler.enabled | On    |
  +-----------------------------+-------+
  ```

Quando `audit_log_flush_interval_seconds` tem um valor de zero (o padrão), não ocorre atualização automática dos privilégios, mesmo que o componente `scheduler` esteja habilitado (`ON`).

Os valores de `1` e `59` não são permitidos; em vez disso, esses valores são ajustados automaticamente para `60` e o servidor emite um aviso. Valores maiores que `60` definem o número de segundos que o componente `scheduler` espera desde o início da inicialização ou desde o início da execução anterior, até que tente agendar outra execução.

Para persistir essa variável do sistema global no arquivo `mysqld-auto.cnf`, sem definir o valor da variável de execução global, antecipe o nome da variável com a palavra-chave `PERSIST_ONLY` ou o qualificador `@@PERSIST_ONLY.`.

* `audit_log_format`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>5

O formato do arquivo de registro de auditoria. Os valores permitidos são `OLD` (XML de estilo antigo), `NEW` (XML de estilo novo; o padrão) e `JSON`. Para obter detalhes sobre cada formato, consulte a Seção 8.4.5.4, “Formatos de arquivos de registro de auditoria”.

* `audit_log_format_unix_timestamp`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>6

Essa variável se aplica apenas para a saída de registro de auditoria no formato JSON. Quando isso é verdadeiro, habilitar essa variável faz com que cada registro do arquivo de registro inclua um campo `time`. O valor do campo é um número inteiro que representa o valor do timestamp UNIX, indicando a data e a hora em que o evento de auditoria foi gerado.

Alterar o valor desta variável durante a execução do programa faz com que o arquivo de registro seja rotado, de modo que, para um arquivo de registro no formato JSON específico, todos os registros no arquivo incluem ou não o campo `time`.

Definir o valor de execução de `audit_log_format_unix_timestamp` requer o privilégio `AUDIT_ADMIN`, além do privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio descontinuado `SUPER`, normalmente necessário para definir o valor de execução de uma variável de sistema global).

* `audit_log_include_accounts`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>7

Nota

Essa variável descontinuada se aplica apenas ao filtro do registro de auditoria no modo legado (consulte a Seção 8.4.5.10, “Filtro do Registro de Auditoria no Modo Legado”).

As contas para as quais os eventos devem ser registrados. O valor deve ser `NULL` ou uma string contendo uma lista de um ou mais nomes de contas separados por vírgula. Para mais informações, consulte a Seção 8.4.5.7, “Filtragem do Log de Auditoria”.

As modificações em `audit_log_include_accounts` afetam apenas as conexões criadas após a modificação, e não as conexões existentes.

* `audit_log_max_size`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>8

`audit_log_max_size` refere-se à poda do arquivo de registro de auditoria, que é suportada apenas para arquivos de registro no formato JSON. Ele controla a poda com base no tamanho combinado do arquivo de registro:

+ Um valor de 0 (padrão) desativa a poda baseada no tamanho. Não há limite de tamanho aplicado.

+ Um valor maior que 0 habilita a poda baseada no tamanho. O valor é o tamanho combinado acima do qual os arquivos de registro de auditoria passam a ser sujeitos à poda.

Se você definir `audit_log_max_size` para um valor que não é um múltiplo de 4096, ele é truncado para o próximo múltiplo. Em particular, definindo-o para um valor menor que 4096, ele é definido como 0 e não ocorre poda baseada no tamanho.

Se tanto `audit_log_max_size` quanto `audit_log_rotate_on_size` forem maiores que 0, `audit_log_max_size` deve ser mais de 7 vezes o valor de `audit_log_rotate_on_size`. Caso contrário, uma mensagem de alerta é escrita no log de erro do servidor, porque, neste caso, a "granularidade" da poda baseada em tamanho pode ser insuficiente para impedir a remoção de todos ou a maioria dos arquivos de registro rotados cada vez que isso ocorre.

Nota

Definir `audit_log_max_size` por si só não é suficiente para fazer com que o corte de arquivos de registro ocorra, porque o algoritmo de corte utiliza `audit_log_rotate_on_size`, `audit_log_max_size` e `audit_log_prune_seconds` em conjunto. Para obter detalhes, consulte Gerenciamento de Espaço de Arquivos de Registro de Auditoria.

* `audit_log_password_history_keep_days`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>9

O plugin de registro de auditoria implementa a criptografia de arquivos de registro usando senhas de criptografia armazenadas no chaveiro MySQL (consulte Criptografar arquivos de registro de auditoria). O plugin também implementa o histórico de senhas, que inclui arquivamento e expiração de senhas (remoção).

Quando o plugin do registro de auditoria cria uma nova senha de criptografia, ele arquiviza a senha anterior, se existir, para uso posterior. A variável `audit_log_password_history_keep_days` controla a remoção automática de senhas de criptografia de registro de auditoria expiradas. Seu valor indica o número de dias após o qual as senhas de criptografia de registro de auditoria arquivadas são removidas. O padrão de 0 desativa a expiração da senha: o período de retenção da senha é para sempre.

Novas senhas de criptografia do registro de auditoria são criadas nessas circunstâncias:

+ Durante a inicialização do plugin, se o plugin encontrar que a criptografia do arquivo de registro está habilitada, ele verifica se o chaveiro contém uma senha de criptografia de registro de auditoria. Se não, o plugin gera automaticamente uma senha de criptografia inicial aleatória.

+ Quando a função `audit_log_encryption_password_set()` é chamada para definir uma senha específica.

Em cada caso, o plugin armazena a nova senha no anel de chave e a usa para criptografar novos arquivos de registro.

A remoção das senhas de criptografia do registro de auditoria expiradas ocorre nessas circunstâncias:

+ Durante a inicialização do plugin.  
+ Quando a função `audit_log_encryption_password_set()` é chamada.

+ Quando o valor de execução de `audit_log_password_history_keep_days` é alterado do seu valor atual para um valor maior que 0. As alterações de valor de execução ocorrem para as declarações de `SET` que utilizam as palavras-chave `GLOBAL` ou `PERSIST`, mas não a palavra-chave `PERSIST_ONLY`. `PERSIST_ONLY` escreve o ajuste da variável em `mysqld-auto.cnf`, mas não tem efeito no valor de execução.

Quando a remoção de senha ocorre, o valor atual de `audit_log_password_history_keep_days` determina quais senhas devem ser removidas:

+ Se o valor for 0, o plugin não remove senhas.  + Se o valor for *`N`* > 0, o plugin remove senhas com mais de *`N`* dias de idade.

Nota

Tenha cuidado para não expirar senhas antigas que ainda são necessárias para ler arquivos de registro criptografados arquivados.

Se você normalmente deixar a expiração da senha desativada (ou seja, `audit_log_password_history_keep_days` tem um valor de 0), é possível realizar uma operação de limpeza sob demanda, atribuindo temporariamente à variável um valor maior que zero. Por exemplo, para expirar senhas mais antigas que 365 dias, faça isso:

  ```
  SET GLOBAL audit_log_password_history_keep_days = 365;
  SET GLOBAL audit_log_password_history_keep_days = 0;
  ```

Definir o valor de execução de `audit_log_password_history_keep_days` requer o privilégio `AUDIT_ADMIN`, além do privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio descontinuado `SUPER`), que normalmente é necessário para definir o valor de execução de uma variável de sistema global.

* `audit_log_policy`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>0

Nota

Essa variável descontinuada se aplica apenas ao filtro do registro de auditoria no modo legado (consulte a Seção 8.4.5.10, “Filtro do Registro de Auditoria no Modo Legado”).

A política que controla como o plugin de registro de auditoria escreve eventos em seu arquivo de registro. O quadro a seguir mostra os valores permitidos.

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>1

`audit_log_policy` pode ser definido apenas na inicialização do servidor. No tempo de execução, é uma variável somente de leitura. Duas outras variáveis do sistema, `audit_log_connection_policy` e `audit_log_statement_policy`, fornecem um controle mais fino sobre a política de registro e podem ser definidas na inicialização ou no tempo de execução. Se você usar `audit_log_policy` na inicialização em vez das outras duas variáveis, o servidor usa seu valor para definir essas variáveis. Para mais informações sobre as variáveis de política e sua interação, consulte a Seção 8.4.5.5, “Configurando as Características de Registro de Auditoria”.

* `audit_log_prune_seconds`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>2

`audit_log_prune_seconds` refere-se à poda do arquivo de registro de auditoria, que é suportada apenas para arquivos de registro no formato JSON. Ele controla a poda com base na idade do arquivo de registro:

+ Um valor de 0 (padrão) desativa a poda baseada na idade. Não há limite de idade aplicado.

+ Um valor maior que 0 habilita a poda baseada na idade. O valor é o número de segundos após os quais os arquivos do registro de auditoria passam a ser sujeitos à poda.

Nota

Definir `audit_log_prune_seconds` por si só não é suficiente para fazer com que o corte de arquivos de registro ocorra, porque o algoritmo de corte utiliza `audit_log_rotate_on_size`, `audit_log_max_size` e `audit_log_prune_seconds` em conjunto. Para obter detalhes, consulte Gerenciamento de Espaço de Arquivos de Registro de Auditoria.

* `audit_log_read_buffer_size`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>3

O tamanho do buffer para leitura do arquivo de registro de auditoria, em bytes. A função `audit_log_read()` não lê mais do que esse número de bytes. A leitura de arquivos de registro é suportada apenas para o formato de registro JSON. Para mais informações, consulte a Seção 8.4.5.6, “Leitura de arquivos de registro de auditoria”.

A partir do MySQL 8.0.12, essa variável tem um valor padrão de 32 KB e pode ser definida em tempo de execução. Cada cliente deve definir seu valor de sessão de `audit_log_read_buffer_size` de forma apropriada para seu uso de `audit_log_read()`. Antes do MySQL 8.0.12, `audit_log_read_buffer_size` tem um valor padrão de 1 MB, afeta todos os clientes e pode ser alterado apenas na inicialização do servidor.

* `audit_log_rotate_on_size`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>4

Se `audit_log_rotate_on_size` for 0, o plugin do log de auditoria não realiza rotação automática de arquivos de log com base no tamanho. Se a rotação ocorrer, você deve realizá-la manualmente; consulte "Rotação manual do arquivo de log de auditoria (antes do MySQL 8.0.31)".

Se `audit_log_rotate_on_size` for maior que 0, a rotação automática do arquivo de registro com base no tamanho ocorre. Sempre que uma escrita no arquivo de registro faz com que seu tamanho exceda o valor de `audit_log_rotate_on_size`, o plugin de registro de auditoria renomeia o arquivo de registro atual e abre um novo arquivo de registro atual usando o nome original.

Se você definir `audit_log_rotate_on_size` para um valor que não é um múltiplo de 4096, ele é truncado para o próximo múltiplo. Em particular, definindo-o para um valor menor que 4096, ele é definido como 0 e não ocorre rotação, exceto manualmente.

Nota

`audit_log_rotate_on_size` controla se a rotação do arquivo de registro de auditoria ocorre. Também pode ser usado em conjunto com `audit_log_max_size` e `audit_log_prune_seconds` para configurar a poda de arquivos de registro em formato JSON rotados. Para detalhes, consulte Gerenciamento de Espaço de Arquivos de Registro de Auditoria.

* `audit_log_statement_policy`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>5

Nota

Essa variável descontinuada se aplica apenas ao filtro do registro de auditoria no modo legado (consulte a Seção 8.4.5.10, “Filtro do Registro de Auditoria no Modo Legado”).

A política que controla como o plugin de registro de auditoria escreve eventos de declaração no seu arquivo de registro. O quadro a seguir mostra os valores permitidos.

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>6

Nota

Ao iniciar o servidor, qualquer valor explícito fornecido para `audit_log_statement_policy` pode ser sobrescrito se `audit_log_policy` também for especificado, conforme descrito na Seção 8.4.5.5, “Configurando as características de registro de auditoria”.

* `audit_log_strategy`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Valor máximo (plataformas de 64 bits)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Valor máximo (plataformas de 32 bits)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>7

O método de registro usado pelo plugin de registro de auditoria. Esses valores de estratégia são permitidos:

+ `ASYNCHRONOUS`: Registre de forma assíncrona. Aguarde espaço no buffer de saída.

+ `PERFORMANCE`: Registre de forma assíncrona. Descarte solicitações para as quais não há espaço suficiente no buffer de saída.

+ `SEMISYNCHRONOUS`: Faça o registro de forma síncrona. Permita o cache pelo sistema operacional.

+ `SYNCHRONOUS`: Faça o registro de forma síncrona. Chame `sync()` após cada solicitação.

Variáveis de status do log de auditoria

Se o plugin do registro de auditoria estiver habilitado, ele expõe várias variáveis de status que fornecem informações operacionais. Essas variáveis estão disponíveis para filtragem de auditoria em modo legado (desatualizada no MySQL 8.0.34) e filtragem de auditoria em modo JSON.

* `Audit_log_current_size`

O tamanho do arquivo de registro de auditoria atual. O valor aumenta quando um evento é escrito no log e é redefinido para 0 quando o log é rotado.

* `Audit_log_event_max_drop_size`

O tamanho do evento mais grande que é descartado no modo de registro de desempenho. Para uma descrição dos modos de registro, consulte a Seção 8.4.5.5, “Configurando as características de registro de auditoria”.

* `Audit_log_events`

O número de eventos tratados pelo plugin do log de auditoria, independentemente de terem sido escritos no log com base na política de filtragem (consulte a Seção 8.4.5.5, “Configurando as características de registro de auditoria”).

* `Audit_log_events_filtered`

O número de eventos tratados pelo plugin de registro de auditoria que foram filtrados (não registrados no log) com base na política de filtragem (consulte a Seção 8.4.5.5, “Configurando as características de registro de auditoria”).

* `Audit_log_events_lost`

O número de eventos perdidos no modo de registro de desempenho porque um evento era maior que o espaço disponível no buffer do registro de auditoria. Esse valor pode ser útil para avaliar como configurar `audit_log_buffer_size` para dimensionar o buffer para o modo de desempenho. Para uma descrição dos modos de registro, consulte a Seção 8.4.5.5, “Configurando as características de registro de auditoria”.

* `Audit_log_events_written`

O número de eventos registrados no log de auditoria.

* `Audit_log_total_size`

O tamanho total dos eventos escritos em todos os arquivos do log de auditoria. Ao contrário de `Audit_log_current_size`, o valor de `Audit_log_total_size` aumenta mesmo quando o log é rotado.

* `Audit_log_write_waits`

O número de vezes que um evento teve que esperar por espaço no buffer do log de auditoria no modo de registro assíncrono. Para uma descrição dos modos de registro, consulte a Seção 8.4.5.5, “Configurando as características de registro de auditoria”.

#### 8.4.5.12 Restrições do Log de Auditoria

O MySQL Enterprise Audit está sujeito a essas restrições gerais:

* Apenas as declarações SQL são registradas. As alterações feitas por APIs não SQL, como memcached, Node.JS e a API NDB, não são registradas.

* Apenas as declarações de nível superior são registradas, não as declarações dentro de programas armazenados, como gatilhos ou procedimentos armazenados.

* O conteúdo dos arquivos referenciado por declarações como `LOAD DATA` não é registrado.

**NDB Cluster.** É possível usar o MySQL Enterprise Audit com o MySQL NDB Cluster, sujeito às seguintes condições:

* Todas as alterações que devem ser registradas devem ser feitas usando a interface SQL. Alterações que utilizam interfaces não SQL, como as fornecidas pela API NDB, memcached ou ClusterJ, não são registradas.

* O plugin deve ser instalado em cada servidor MySQL que é usado para executar SQL no clúster.

* Os dados do plugin de auditoria devem ser agregados entre todos os servidores MySQL utilizados com o clúster. Essa agregação é responsabilidade do aplicativo ou do usuário.

### 8.4.6 O componente de mensagem de auditoria

A partir do MySQL 8.0.14, o componente `audit_api_message_emit` permite que as aplicações adicionem seus próprios eventos de mensagem ao registro de auditoria, usando a função `audit_api_message_emit_udf()`.

O componente `audit_api_message_emit` coopera com todos os plugins do tipo de auditoria. Para maior clareza, os exemplos utilizam o plugin `audit_log`, descrito na Seção 8.4.5, “Auditoria da Empresa MySQL”.

* Instalar ou desinstalar o componente de mensagem de auditoria * Função de Mensagem de Auditoria

#### Instalando ou Desinstalando o Componente de Mensagem de Auditoria

Para ser utilizável pelo servidor, o arquivo da biblioteca de componentes deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin, definindo o valor de `plugin_dir` na inicialização do servidor.

Para instalar o componente `audit_api_message_emit`, use esta declaração:

```
INSTALL COMPONENT "file://component_audit_api_message_emit";
```

A instalação do componente é uma operação única que não precisa ser feita por inicialização do servidor. `INSTALL COMPONENT` (install-component.html "15.7.4.3 INSTALL COMPONENT Statement") carrega o componente e também o registra na tabela do sistema `mysql.component` para que ele seja carregado durante as subsequentes inicializações do servidor.

Para desinstalar o componente `audit_api_message_emit`, use esta declaração:

```
UNINSTALL COMPONENT "file://component_audit_api_message_emit";
```

`UNINSTALL COMPONENT` descarrega o componente e o desregistra da tabela de sistema `mysql.component`, para que ele não seja carregado durante as subsequentes inicializações do servidor.

Como a instalação e desinstalação do componente `audit_api_message_emit` instalam e desinstalam a função `audit_api_message_emit_udf()` que o componente implementa, não é necessário usar `CREATE FUNCTION` ou `DROP FUNCTION` para isso.

#### Mensagem da Função de Auditoria

Esta seção descreve a função `audit_api_message_emit_udf()` implementada pelo componente `audit_api_message_emit`.

Antes de usar a função de mensagem de auditoria, instale o componente de mensagem de auditoria de acordo com as instruções fornecidas em Instalar ou Desinstalar o Componente de Mensagem de Auditoria.

* `audit_api_message_emit_udf(component, producer, message[, key, value] ...)`(audit-api-message-emit.html#function_audit-api-message-emit-udf)

Adiciona um evento de mensagem ao registro de auditoria. Os eventos de mensagem incluem as cadeias de caracteres de componente, produtor e mensagem do chamador, e opcionalmente um conjunto de pares chave-valor.

Um evento postado por essa função é enviado para todos os plugins habilitados do tipo de auditoria, cada um dos quais trata o evento de acordo com suas próprias regras. Se nenhum plugin do tipo de auditoria estiver habilitado, a postagem do evento não terá efeito.

Argumentos:

+ *`component`*: Uma cadeia que especifica o nome de um componente.

+ *`producer`*: Uma cadeia que especifica o nome do produtor.

+ *`message`*: Uma cadeia que especifica a mensagem do evento.

+ *`key`*, *`value`*: Os eventos podem incluir 0 ou mais pares chave-valor que especificam um mapa de dados fornecido pelo aplicativo. Cada argumento *`key`* é uma string que especifica um nome para seu argumento *`value`* imediatamente após. Cada argumento *`value`* especifica um valor para seu argumento *`key`* imediatamente após. Cada *`value`* pode ser uma string ou um valor numérico, ou `NULL`.

Valor de retorno:

A string `OK` para indicar sucesso. Um erro ocorre se a função falhar.

Exemplo:

  ```
  mysql> SELECT audit_api_message_emit_udf('component_text',
                                           'producer_text',
                                           'message_text',
                                           'key1', 'value1',
                                           'key2', 123,
                                           'key3', NULL) AS 'Message';
  +---------+
  | Message |
  +---------+
  | OK      |
  +---------+
  ```

Informações adicionais:

Cada plugin de auditoria que recebe um evento postado por `audit_api_message_emit_udf()` registra o evento no formato específico do plugin. Por exemplo, o plugin `audit_log` (consulte Seção 8.4.5, “Auditoramento da Empresa MySQL”) registra os valores das mensagens da seguinte forma, dependendo do formato de log configurado pela variável de sistema `audit_log_format`:

+ Formato JSON (`audit_log_format=JSON`):

    ```
    {
      ...
      "class": "message",
      "event": "user",
      ...
      "message_data": {
        "component": "component_text",
        "producer": "producer_text",
        "message": "message_text",
        "map": {
          "key1": "value1",
          "key2": 123,
          "key3": null
        }
      }
    }
    ```

+ Novo formato XML (`audit_log_format=NEW`):

    ```
    <AUDIT_RECORD>
     ...
     <NAME>Message</NAME>
     ...
     <COMMAND_CLASS>user</COMMAND_CLASS>
     <COMPONENT>component_text</COMPONENT>
     <PRODUCER>producer_text</PRODUCER>
     <MESSAGE>message_text</MESSAGE>
     <MAP>
       <ELEMENT>
         <KEY>key1</KEY>
         <VALUE>value1</VALUE>
       </ELEMENT>
       <ELEMENT>
         <KEY>key2</KEY>
         <VALUE>123</VALUE>
       </ELEMENT>
       <ELEMENT>
         <KEY>key3</KEY>
         <VALUE/>
       </ELEMENT>
     </MAP>
    </AUDIT_RECORD>
    ```

+ Formato XML de estilo antigo (`audit_log_format=OLD`):

    ```
    <AUDIT_RECORD
      ...
      NAME="Message"
      ...
      COMMAND_CLASS="user"
      COMPONENT="component_text"
      PRODUCER="producer_text"
      MESSAGE="message_text"/>
    ```

Nota

Os eventos de mensagem registrados no formato XML de estilo antigo não incluem o mapa de chave-valor devido a restrições representativas impostas por esse formato.

Mensagens publicadas por `audit_api_message_emit_udf()` têm uma classe de evento de `MYSQL_AUDIT_MESSAGE_CLASS` e uma subclasse de `MYSQL_AUDIT_MESSAGE_USER`. (Mensagens de auditoria geradas internamente têm a mesma classe e uma subclasse de `MYSQL_AUDIT_MESSAGE_INTERNAL`; essa subclasse atualmente não é usada.) Para se referir a esses eventos nas regras de filtragem do `audit_log`, use um elemento `class` com um valor `name` de `message`. Por exemplo:

  ```
  {
    "filter": {
      "class": {
        "name": "message"
      }
    }
  }
  ```

Se for necessário distinguir entre eventos de mensagens gerados pelo usuário e internamente gerados, teste o valor `subclass` contra `user` ou `internal`.

O filtro baseado nos conteúdos do mapa de chave-valor não é suportado.

Para obter informações sobre como escrever regras de filtragem, consulte a Seção 8.4.5.7, “Filtragem do Log de Auditoria”.

### 8.4.7 Firewall Empresarial MySQL

Nota

O MySQL Enterprise Firewall é uma extensão incluída na MySQL Enterprise Edition, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL inclui o MySQL Enterprise Firewall, um firewall de nível de aplicativo que permite que os administradores de banco de dados permitam ou negam a execução de instruções SQL com base na correspondência com listas de padrões de declaração aceitos. Isso ajuda a proteger o MySQL Server contra ataques como injeção SQL ou tentativas de explorar aplicativos usando-os fora de suas características legítimas de carga de consulta.

Cada conta do MySQL registrada no firewall tem sua própria declaração allowlist, permitindo que a proteção seja adaptada por conta. Para uma conta específica, o firewall pode operar no modo de gravação, proteção ou detecção, para treinamento nos padrões de declaração aceitos, proteção ativa contra declarações inaceitáveis ou detecção passiva de declarações inaceitáveis. O diagrama ilustra como o firewall processa declarações de entrada em cada modo.

**Figura 8.1 Operação do Firewall Empresarial MySQL**

![Flow chart showing how MySQL Enterprise Firewall processes incoming SQL statements in recording, protecting, and detecting modes.](images/firewall-diagram-1.png)

As seções a seguir descrevem os elementos do Firewall Empresarial MySQL, discutem como instalá-lo e usá-lo, e fornecem informações de referência para seus elementos.

#### 8.4.7.1 Elementos do Firewall Empresarial MySQL

O MySQL Enterprise Firewall é baseado em uma biblioteca de plugins que inclui esses elementos:

* Um plugin do lado do servidor chamado `MYSQL_FIREWALL` examina as instruções SQL antes de serem executadas e, com base nos perfis de firewall registrados, toma uma decisão sobre a execução ou rejeição de cada declaração.

O plugin `MYSQL_FIREWALL`, juntamente com os plugins do lado do servidor chamados `MYSQL_FIREWALL_USERS` e `MYSQL_FIREWALL_WHITELIST`, implementam o Performance Schema e as tabelas `INFORMATION_SCHEMA` que fornecem visualizações dos perfis registrados.

* Os perfis são armazenados em cache na memória para melhor desempenho. As tabelas no banco de dados do sistema `mysql` fornecem armazenamento de suporte para dados de firewall para a persistência dos perfis em caso de reinício do servidor.

* Os procedimentos armazenados realizam tarefas como registrar perfis de firewall, estabelecer seu modo operacional e gerenciar a transferência de dados do firewall entre o cache e o armazenamento persistente.

* As funções administrativas fornecem uma API para tarefas de nível inferior, como sincronizar o cache com o armazenamento persistente.

* As variáveis do sistema permitem a configuração do firewall e as variáveis de status fornecem informações operacionais em tempo real.

* Os privilégios `FIREWALL_ADMIN` e `FIREWALL_USER` permitem que os usuários administrem regras de firewall para qualquer usuário e, respectivamente, suas próprias regras de firewall.

* O privilégio `FIREWALL_EXEMPT` (disponível a partir do MySQL 8.0.27) isenta um usuário das restrições do firewall. Isso é útil, por exemplo, para qualquer administrador de banco de dados que configure o firewall, para evitar a possibilidade de uma configuração errada causar até mesmo o administrador ser bloqueado e incapaz de executar declarações.

#### 8.4.7.2 Instalar ou desinstalar o firewall empresarial MySQL

A instalação do Firewall Empresarial MySQL é uma operação única que instala os elementos descritos na Seção 8.4.7.1, “Elementos do Firewall Empresarial MySQL”. A instalação pode ser realizada usando uma interface gráfica ou manualmente:

* No Windows, o Instalador do MySQL inclui uma opção para habilitar o Firewall Empresarial do MySQL para você.

* O MySQL Workbench 6.3.4 ou superior pode instalar o MySQL Enterprise Firewall, habilitar ou desabilitar um firewall instalado ou desinstalar o firewall.

* A instalação manual do Firewall Empresarial MySQL envolve a execução de um script localizado no diretório `share` da sua instalação do MySQL.

Importante

Leia toda essa seção antes de seguir as instruções. Algumas partes do procedimento diferem dependendo do seu ambiente.

Nota

Se instalado, o MySQL Enterprise Firewall envolve um pequeno custo, mesmo quando desativado. Para evitar esse custo, não instale o firewall a menos que você planeje usá-lo.

Para obter instruções de uso, consulte a Seção 8.4.7.3, “Usando o Firewall Empresarial MySQL”. Para informações de referência, consulte a Seção 8.4.7.4, “Referência do Firewall Empresarial MySQL”.

* Instalar o Firewall do MySQL Enterprise
* Desinstalar o Firewall do MySQL Enterprise

##### Instalação do Firewall Empresarial do MySQL

Se o MySQL Enterprise Firewall já estiver instalado a partir de uma versão anterior do MySQL, desinstale-o usando as instruções fornecidas mais adiante nesta seção e, em seguida, reinicie o servidor antes de instalar a versão atual. Nesse caso, também é necessário registrar sua configuração novamente.

No Windows, você pode usar o Instalador MySQL para instalar o MySQL Enterprise Firewall, conforme mostrado na Figura 8.2, “Instalação do MySQL Enterprise Firewall no Windows”. Verifique a caixa de seleção Habilitar o Firewall do MySQL Enterprise. (A porta Aberta do Firewall para acesso à rede tem um propósito diferente. Refere-se ao Firewall do Windows e controla se o Windows bloqueia a porta TCP/IP na qual o servidor MySQL escuta conexões de clientes.)

Importante

Há um problema para o MySQL 8.0.19 instalado usando o MySQL Installer que impede o início do servidor se o Firewall Empresarial do MySQL for selecionado durante as etapas de configuração do servidor. Se a operação de inicialização do servidor falhar, clique em Cancelar para encerrar o processo de configuração e retornar ao painel. Você deve desinstalar o servidor.

A solução é executar o Instalador do MySQL sem selecionar o Firewall do MySQL Enterprise. (Ou seja, não selecione a caixa de seleção Habilitar Firewall do MySQL Enterprise.) Em seguida, instale o Firewall do MySQL Enterprise posteriormente, usando as instruções para instalação manual mais adiante nesta seção. Esse problema é corrigido no MySQL 8.0.20.

**Figura 8.2. Instalação do Firewall Empresarial MySQL no Windows**

![Content is described in the surrounding text.](images/firewall-8-windows-installer-option.png)

Para instalar o MySQL Enterprise Firewall usando o MySQL Workbench 6.3.4 ou superior, consulte a Interface do Firewall Empresarial MySQL.

Para instalar o MySQL Enterprise Firewall manualmente, procure no diretório `share` da sua instalação do MySQL e escolha o script apropriado para sua plataforma. Os scripts disponíveis diferem no nome do arquivo usado para se referir ao script:

* `win_install_firewall.sql`
* `linux_install_firewall.sql`

O script de instalação cria procedimentos armazenados no banco de dados padrão, `mysql`. Execute o script da seguinte forma na linha de comando. O exemplo aqui usa o script de instalação Linux. Faça as substituições apropriadas para o seu sistema.

```
$> mysql -u root -p < linux_install_firewall.sql
Enter password: (enter root password here)
```

Nota

Para usar o MySQL Enterprise Firewall no contexto da replicação de origem/replica, Replicação por Grupo ou InnoDB Cluster, você deve preparar os nós da replicação antes de executar o script de instalação no nó de origem. Isso é necessário porque as instruções `INSTALL PLUGIN` no script não são replicadas.

1. Em cada nó replica, extraia as declarações `INSTALL PLUGIN` do script de instalação e execute-as manualmente.

2. No nó de origem, execute o script de instalação conforme descrito anteriormente.

Instalar o MySQL Enterprise Firewall, seja usando uma interface gráfica ou manualmente, deve habilitar o firewall. Para verificar isso, conecte-se ao servidor e execute a seguinte declaração:

```
mysql> SHOW GLOBAL VARIABLES LIKE 'mysql_firewall_mode';
+---------------------+-------+
| Variable_name       | Value |
+---------------------+-------+
| mysql_firewall_mode | ON    |
+---------------------+-------+
```

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

##### Desinstalação do Firewall Empresarial MySQL

O MySQL Enterprise Firewall pode ser desinstalado usando o MySQL Workbench ou manualmente.

Para desinstalar o MySQL Enterprise Firewall usando o MySQL Workbench 6.3.4 ou superior, consulte a Interface do Firewall Empresarial MySQL, no Capítulo 33, *MySQL Workbench*.

Para desinstalar o MySQL Enterprise Firewall manualmente, execute as seguintes instruções. As instruções utilizam `IF EXISTS` porque, dependendo da versão do firewall instalada anteriormente, alguns objetos podem não existir ou podem ser eliminados implicitamente ao desinstalar o plugin que os instalou.

```
DROP TABLE IF EXISTS mysql.firewall_group_allowlist;
DROP TABLE IF EXISTS mysql.firewall_groups;
DROP TABLE IF EXISTS mysql.firewall_membership;
DROP TABLE IF EXISTS mysql.firewall_users;
DROP TABLE IF EXISTS mysql.firewall_whitelist;

UNINSTALL PLUGIN MYSQL_FIREWALL;
UNINSTALL PLUGIN MYSQL_FIREWALL_USERS;
UNINSTALL PLUGIN MYSQL_FIREWALL_WHITELIST;

DROP FUNCTION IF EXISTS firewall_group_delist;
DROP FUNCTION IF EXISTS firewall_group_enlist;
DROP FUNCTION IF EXISTS mysql_firewall_flush_status;
DROP FUNCTION IF EXISTS normalize_statement;
DROP FUNCTION IF EXISTS read_firewall_group_allowlist;
DROP FUNCTION IF EXISTS read_firewall_groups;
DROP FUNCTION IF EXISTS read_firewall_users;
DROP FUNCTION IF EXISTS read_firewall_whitelist;
DROP FUNCTION IF EXISTS set_firewall_group_mode;
DROP FUNCTION IF EXISTS set_firewall_mode;

DROP PROCEDURE IF EXISTS mysql.sp_firewall_group_delist;
DROP PROCEDURE IF EXISTS mysql.sp_firewall_group_enlist;
DROP PROCEDURE IF EXISTS mysql.sp_reload_firewall_group_rules;
DROP PROCEDURE IF EXISTS mysql.sp_reload_firewall_rules;
DROP PROCEDURE IF EXISTS mysql.sp_set_firewall_group_mode;
DROP PROCEDURE IF EXISTS mysql.sp_set_firewall_group_mode_and_user;
DROP PROCEDURE IF EXISTS mysql.sp_set_firewall_mode;
DROP PROCEDURE IF EXISTS mysql.sp_migrate_firewall_user_to_group;
```

#### 8.4.7.3 Usando o Firewall Empresarial do MySQL

Antes de usar o MySQL Enterprise Firewall, instale-o de acordo com as instruções fornecidas na Seção 8.4.7.2, “Instalando ou Desinstalando o MySQL Enterprise Firewall”.

Esta seção descreve como configurar o MySQL Enterprise Firewall usando instruções SQL. Alternativamente, o MySQL Workbench 6.3.4 ou superior oferece uma interface gráfica para o controle do firewall. Veja a Interface do MySQL Enterprise Firewall.

* Habilitar ou desabilitar o firewall
* Atribuir privilégios ao firewall
* Conceitos do firewall
* Registrar perfis de grupo do firewall
* Registrar perfis de conta do firewall
* Monitorar o firewall
* Migrar perfis de conta para perfis de grupo

##### Habilitar ou desabilitar o firewall

Para habilitar ou desabilitar o firewall, defina a variável de sistema `mysql_firewall_mode`. Por padrão, essa variável está habilitada quando o firewall é instalado. Para controlar explicitamente o estado inicial do firewall, você pode definir a variável na inicialização do servidor. Por exemplo, para habilitar o firewall em um arquivo de opção, use essas linhas:

```
[mysqld]
mysql_firewall_mode=ON
```

Após modificar `my.cnf`, reinicie o servidor para que o novo ajuste seja aplicado.

Como alternativa, para definir e manter a configuração do firewall em tempo de execução:

```
SET PERSIST mysql_firewall_mode = OFF;
SET PERSIST mysql_firewall_mode = ON;
```

`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") define um valor para a instância MySQL em execução. Também salva o valor, fazendo com que ele seja carregado em reinicializações subsequentes do servidor. Para alterar um valor para a instância MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`. Veja a Seção 15.7.6.1, “Sintaxe SET para atribuição de variáveis”.

##### Atribuição de privilégios de firewall

Com o firewall instalado, conceda os privilégios apropriados à conta ou contas do MySQL que serão usadas para administrá-la. Os privilégios dependem das operações do firewall que uma conta deve ser permitida para realizar:

* Conceda o privilégio `FIREWALL_EXEMPT` (disponível a partir do MySQL 8.0.27) a qualquer conta que deva ser isenta das restrições do firewall. Isso é útil, por exemplo, para um administrador de banco de dados que configura o firewall, para evitar a possibilidade de uma configuração errada causar até mesmo o administrador ser bloqueado e incapaz de executar declarações.

* Conceda o privilégio `FIREWALL_ADMIN` a qualquer conta que deva ter acesso completo ao firewall administrativo. (Algumas funções do firewall administrativo podem ser invocadas por contas que tenham o privilégio `FIREWALL_ADMIN` *ou* o descontinuado `SUPER`, conforme indicado nas descrições das funções individuais.)

* Conceda o privilégio `FIREWALL_USER` a qualquer conta que deva ter acesso administrativo apenas para suas próprias regras de firewall.

* Conceda o privilégio `EXECUTE` para os procedimentos armazenados do firewall no banco de dados do sistema `mysql`. Esses procedimentos podem invocar funções administrativas, portanto, o acesso aos procedimentos armazenados também requer os privilégios indicados anteriormente, que são necessários para essas funções.

Nota

Os privilégios `FIREWALL_EXEMPT`, `FIREWALL_ADMIN` e `FIREWALL_USER` só podem ser concedidos enquanto o firewall estiver instalado, pois o plugin `MYSQL_FIREWALL` define esses privilégios.

##### Conceitos de Firewall

O servidor MySQL permite que os clientes se conectem e recebe deles instruções SQL a serem executadas. Se o firewall estiver habilitado, o servidor passa para ele cada declaração de entrada que não falhe imediatamente com um erro de sintaxe. Com base no fato de o firewall aceitar a declaração, o servidor a executa ou retorna um erro ao cliente. Esta seção descreve como o firewall realiza a tarefa de aceitar ou rejeitar declarações.

* Perfis de firewall
* Alinhamento de declarações de firewall
* Modos operacionais do perfil
* Tratamento de declarações de firewall quando vários perfis são aplicados

###### Perfis de Firewall

O firewall utiliza um registro de perfis que determina se a execução da declaração deve ser permitida. Os perfis têm esses atributos:

* Uma allowlist. A allowlist é o conjunto de regras que define quais declarações são aceitáveis para o perfil.

* Um modo operacional atual. O modo permite que o perfil seja usado de diferentes maneiras. Por exemplo: o perfil pode ser colocado no modo de treinamento para estabelecer a allowlist; a allowlist pode ser usada para restringir a execução de declarações ou detecção de intrusão; o perfil pode ser desativado completamente.

* Um escopo de aplicabilidade. O escopo indica quais conexões do cliente o perfil se aplica:

+ O firewall suporta perfis baseados em contas, de modo que cada perfil corresponda a uma conta de cliente específica (combinação de nome de usuário do cliente e nome do host). Por exemplo, você pode registrar um perfil de conta para o qual a lista de permissão se aplique a conexões que se originam de `admin@localhost` e outro perfil de conta para o qual a lista de permissão se aplique a conexões que se originam de `myapp@apphost.example.com`.

+ A partir do MySQL 8.0.23, o firewall suporta perfis de grupo que podem ter várias contas como membros, com a lista de permissão do perfil aplicando-se igualmente a todos os membros. Os perfis de grupo permitem uma administração mais fácil e maior flexibilidade para implantações que exigem a aplicação de um conjunto específico de regras de lista de permissão em várias contas.

Inicialmente, não existem perfis, portanto, por padrão, o firewall aceita todas as declarações e não tem efeito sobre quais declarações as contas do MySQL podem executar. Para aplicar as capacidades de proteção do firewall, é necessária uma ação explícita:

* Registre um ou mais perfis no firewall. * Treine o firewall estabelecendo a lista de permissão para cada perfil; ou seja, os tipos de declarações que o perfil permite que os clientes executem.

* Coloque os perfis treinados no modo de proteção para endurecer o MySQL contra a execução de declarações não autorizadas:

+ O MySQL associa cada sessão do cliente com uma combinação específica de nome de usuário e nome de host. Essa combinação é a *conta da sessão*.

+ Para cada conexão do cliente, o firewall utiliza a conta de sessão para determinar quais perfis se aplicam ao tratamento de declarações recebidas do cliente.

O firewall aceita apenas declarações permitidas pelos listas de permissão do perfil aplicável.

A maioria dos princípios de firewall se aplica de forma idêntica aos perfis de grupo e aos perfis de conta. Os dois tipos de perfis diferem nesses aspectos:

* Um perfil de conta allowlist aplica-se apenas a uma conta única. Um perfil de grupo allowlist aplica-se quando a conta de sessão corresponde a qualquer conta que seja membro do grupo.

* Para aplicar uma lista de permissão a várias contas usando perfis de conta, é necessário registrar um perfil por conta e duplicar a lista de permissão em cada perfil. Isso implica em treinar cada perfil de conta individualmente, pois cada um deve ser treinado usando a única conta à qual se aplica.

Um perfil de grupo allowlist se aplica a várias contas, sem necessidade de duplicá-lo para cada conta. Um perfil de grupo pode ser treinado usando qualquer uma ou todas as contas dos membros do grupo, ou o treinamento pode ser limitado a qualquer membro. De qualquer forma, o allowlist se aplica a todos os membros.

* Os nomes dos perfis de conta são baseados em combinações específicas de nome de usuário e nome de host que dependem dos clientes que se conectam ao servidor MySQL. Os nomes dos perfis de grupo são escolhidos pelo administrador do firewall, sem restrições além do fato de que seu comprimento deve ser de 1 a 288 caracteres.

Nota

Devido às vantagens dos perfis de grupo em relação aos perfis de conta, e porque um perfil de grupo com uma única conta de membro é logicamente equivalente a um perfil de conta para essa conta, é recomendável que todos os novos perfis de firewall sejam criados como perfis de grupo. Os perfis de conta são desaconselhados a partir do MySQL 8.0.26 e estão sujeitos à remoção em uma versão futura do MySQL. Para obter assistência na conversão de perfis de conta existentes, consulte a Migração de perfis de conta para perfis de grupo.

A proteção baseada em perfil oferecida pelo firewall permite a implementação de estratégias como essas:

* Se um aplicativo tiver requisitos de proteção exclusivos, configure-o para usar uma conta que não seja usada para nenhum outro propósito e crie um perfil de grupo ou perfil de conta para essa conta.

* Se as aplicações relacionadas compartilharem requisitos de proteção, associe cada aplicativo a sua própria conta e, em seguida, adicione essas contas de aplicativos como membros do mesmo perfil de grupo. Alternativamente, configure todas as aplicações para usar a mesma conta e associe-as a um perfil de conta para essa conta.

###### Declaração de correspondência de firewall

A declaração de correspondência realizada pelo firewall não utiliza declarações SQL recebidas dos clientes. Em vez disso, o servidor converte as declarações recebidas em forma de digest normalizada e a operação do firewall utiliza esses digests. O benefício da normalização das declarações é que permite que declarações semelhantes sejam agrupadas e reconhecidas usando um único padrão. Por exemplo, essas declarações são distintas entre si:

```
SELECT first_name, last_name FROM customer WHERE customer_id = 1;
select first_name, last_name from customer where customer_id = 99;
SELECT first_name, last_name FROM customer WHERE customer_id = 143;
```

Mas todos eles têm a mesma forma de digestão normalizada:

```
SELECT `first_name` , `last_name` FROM `customer` WHERE `customer_id` = ?
```

Ao usar a normalização, as listas de permissão do firewall podem armazenar descriptografias que correspondem a várias declarações recebidas dos clientes. Para mais informações sobre normalização e descriptografias, consulte a Seção 29.10, “Descriptografias de declarações do Schema de desempenho e amostragem”.

Aviso

Definir a variável de sistema `max_digest_length` como zero desativa a produção de digestão, o que também desativa a funcionalidade do servidor que requer digestões, como o MySQL Enterprise Firewall.

###### Modos Operacionais do Perfil

Cada perfil registrado no firewall tem seu próprio modo operacional, escolhido entre esses valores:

* `OFF`: Este modo desativa o perfil. O firewall o considera inativo e o ignora.

* `RECORDING`: Este é o modo de treinamento do firewall. As declarações recebidas de um cliente que corresponde ao perfil são consideradas aceitáveis para o perfil e tornam-se parte de sua “digitação”. O firewall registra a forma normalizada do digest de cada declaração para aprender os padrões de declaração aceitáveis para o perfil. Cada padrão é uma regra, e a união das regras é a lista de permissão do perfil.

Uma diferença entre os perfis de grupo e de conta é que o registro de declarações para um perfil de grupo pode ser limitado a declarações recebidas de um único membro do grupo (o membro do treinamento).

* `PROTECTING`: Nesse modo, o perfil permite ou impede a execução de declarações. O firewall compara as declarações recebidas com a lista de permissão do perfil, aceitando apenas as que correspondem e rejeitando as que não correspondem. Após treinar um perfil no modo `RECORDING`, mude para o modo `PROTECTING` para proteger o MySQL contra acesso por declarações que se desviam da lista de permissão. Se a variável de sistema `mysql_firewall_trace` estiver habilitada, o firewall também escreve as declarações rejeitadas no log de erro.

* `DETECTING`: Este modo detecta, mas não bloqueia intrusões (as declarações que são suspeitas, porque não correspondem a nada no perfil allowlist) . No modo `DETECTING`, o firewall escreve declarações suspeitas no log de erro, mas as aceita sem negar o acesso.

Quando um perfil recebe qualquer um dos valores de modo anteriores, o firewall armazena o modo no perfil. As operações de configuração de modo do firewall também permitem um valor de modo `RESET`, mas este valor não é armazenado: configurar um perfil para o modo `RESET` faz com que o firewall exclua todas as regras do perfil e configure seu modo para `OFF`.

Nota

Mensagens escritas no log de erro no modo `DETECTING` ou porque o `mysql_firewall_trace` está habilitado são escritas como Notas, que são mensagens de informação. Para garantir que essas mensagens apareçam no log de erro e não sejam descartadas, certifique-se de que a granularidade do registro de erro é suficiente para incluir mensagens de informação. Por exemplo, se você está usando filtragem de log baseada em prioridade, conforme descrito na Seção 7.4.2.5, “Filtragem de log baseada em prioridade (log_filter_internal)”), defina a variável de sistema `log_error_verbosity` para um valor de 3.

###### Declaração de Firewall: Tratamento de múltiplos perfis aplicáveis

Por simplicidade, as seções posteriores que descrevem como configurar perfis assumem que o firewall verifica as declarações recebidas de um cliente apenas contra um único perfil, seja um perfil de grupo ou um perfil de conta. Mas a operação do firewall pode ser mais complexa:

* Um perfil de grupo pode incluir múltiplos perfis como membros.
* Uma conta pode ser membro de múltiplos perfis de grupo.
* Múltiplos perfis podem corresponder a um cliente específico.

A descrição a seguir abrange o caso geral de como o firewall funciona, quando potencialmente vários perfis se aplicam a declarações de entrada.

Como mencionado anteriormente, o MySQL associa cada sessão de cliente com uma combinação específica de nome de usuário e nome de host, conhecida como *conta de sessão*. O firewall compara a conta de sessão com perfis registrados para determinar quais perfis se aplicam ao tratamento de declarações recebidas da sessão:

* O firewall ignora perfis inativos (perfis com um modo de `OFF`).

* A conta de sessão corresponde a todos os perfis de grupo ativos que incluem um membro com o mesmo usuário e anfitrião. Pode haver mais de um perfil de grupo desse tipo.

* A conta de sessão corresponde a um perfil de conta ativa que tenha o mesmo usuário e host, se houver. Há, no máximo, um perfil de conta desse tipo.

Em outras palavras, a conta de sessão pode corresponder a 0 ou mais perfis de grupo ativos e 0 ou 1 perfis de conta ativos. Isso significa que 0, 1 ou vários perfis de firewall são aplicáveis a uma sessão dada, para a qual o firewall lida cada declaração recebida da seguinte forma:

* Se não houver perfil aplicável, o firewall não impõe restrições e aceita a declaração.

* Se houver perfis aplicáveis, seus modos determinam o tratamento das declarações:

+ O firewall registra a declaração na lista de permissão de cada perfil aplicável que está no modo `RECORDING`.

+ O firewall escreve a declaração no log de erro para cada perfil aplicável em modo `DETECTING` para o qual a declaração é suspeita (não corresponde ao perfil allowlist).

O firewall aceita a declaração se pelo menos um perfil aplicável estiver no modo `RECORDING` ou `DETECTING` (esses modos aceitam todas as declarações), ou se a declaração corresponder à lista de permissão de pelo menos um perfil aplicável no modo `PROTECTING`. Caso contrário, o firewall rejeita a declaração (e a escreve no log de erro se a variável de sistema `mysql_firewall_trace` estiver habilitada).

Com essa descrição em mente, as próximas seções voltam à simplicidade das situações em que um perfil de grupo único ou um perfil de conta único se aplicam, e cobrem como configurar cada tipo de perfil.

##### Registro de perfis de grupo de firewall

O MySQL Enterprise Firewall suporta o registro de perfis de grupo a partir do MySQL 8.0.23. Um perfil de grupo pode ter várias contas como seus membros. Para usar um perfil de grupo de firewall para proteger o MySQL contra declarações recebidas de uma conta específica, siga estes passos:

1. Registre o perfil do grupo e coloque-o no modo `RECORDING`.

2. Adicione uma conta de membro ao perfil do grupo. 3. Conecte-se ao servidor MySQL usando a conta de membro e execute as instruções que devem ser aprendidas. Isso treina o perfil do grupo e estabelece as regras que formam a lista de permissão do perfil.

4. Adicione ao perfil do grupo quaisquer outras contas que devem ser membros do grupo.

5. Mude o perfil do grupo para o modo `PROTECTING`. Quando um cliente se conecta ao servidor usando qualquer conta que seja membro do perfil do grupo, a declaração de restrição do perfil allowlist restringe a execução.

6. Se for necessário treinamento adicional, mude o perfil do grupo para o modo `RECORDING` novamente, atualize sua lista de permissão com novos padrões de declaração, e depois mude de volta para o modo `PROTECTING`.

Observe essas diretrizes para referências de contas relacionadas ao firewall:

* Tome nota do contexto em que as referências de conta ocorrem. Para nomear uma conta para operações de firewall, especifique-a como uma cadeia de caracteres entre aspas simples (`'user_name@host_name'`). Isso difere da convenção usual do MySQL para declarações como [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") e `GRANT`, para as quais você cita as partes de usuário e host de um nome de conta separadamente (`'user_name'@'host_name'`).

O requisito de nomear as contas como uma cadeia de caracteres entre aspas duplas para operações de firewall significa que você não pode usar contas que tenham caracteres embutidos `@` no nome do usuário.

* O firewall avalia as declarações em relação às contas representadas por nomes de usuário e hospedeiro reais, autenticados pelo servidor. Ao registrar contas em perfis, não use caracteres especiais ou máscaras de rede:

Suponha que uma conta chamada `me@%.example.org` exista e um cliente a use para se conectar ao servidor a partir do host `abc.example.org`.

+ O nome da conta contém um caractere de comodínculo `%`, mas o servidor autentica o cliente como tendo um nome de usuário de `me` e nome de host de `abc.example.com`, e é isso o que o firewall vê.

+ Consequentemente, o nome da conta a ser usado para operações de firewall é `me@abc.example.org` em vez de `me@%.example.org`.

O procedimento a seguir mostra como registrar um perfil de grupo com o firewall, treinar o firewall para saber as declarações aceitáveis para esse perfil (sua lista de permissão), usar o perfil para proteger o MySQL contra a execução de declarações inaceitáveis e adicionar e remover membros do grupo. O exemplo usa um nome de perfil de grupo de `fwgrp`. O perfil do exemplo é presumido para uso por clientes de uma aplicação que acessa tabelas no banco de dados `sakila` (disponível em https://dev.mysql.com/doc/index-other.html).

Use uma conta administrativa do MySQL para realizar os passos deste procedimento, exceto aqueles passos designados para execução por contas de membros do perfil do grupo de firewall. Para declarações executadas por contas de membros, o banco de dados padrão deve ser `sakila`. (Você pode usar um banco de dados diferente ajustando as instruções conforme necessário.)

1. Se necessário, crie as contas que devem ser membros do perfil de grupo `fwgrp` e conceda-lhes os privilégios de acesso apropriados. As declarações para um membro são mostradas aqui (escolha uma senha apropriada):

   ```
   CREATE USER 'member1'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL ON sakila.* TO 'member1'@'localhost';
   ```

2. Use o procedimento armazenado `sp_set_firewall_group_mode()` para registrar o perfil do grupo com o firewall e coloque o perfil no modo `RECORDING` (treinamento):

   ```
   CALL mysql.sp_set_firewall_group_mode('fwgrp', 'RECORDING');
   ```

3. Use o procedimento armazenado `sp_firewall_group_enlist()` para adicionar uma conta de membro inicial para uso no treinamento do grupo profile allowlist:

   ```
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member1@localhost');
   ```

4. Para treinar o perfil do grupo usando a conta inicial do membro, conecte-se ao servidor como `member1` do host do servidor para que o firewall veja uma conta de sessão de `member1@localhost`. Em seguida, execute algumas declarações que sejam consideradas legítimas para o perfil. Por exemplo:

   ```
   SELECT title, release_year FROM film WHERE film_id = 1;
   UPDATE actor SET last_update = NOW() WHERE actor_id = 1;
   SELECT store_id, COUNT(*) FROM inventory GROUP BY store_id;
   ```

O firewall recebe as declarações da conta `member1@localhost`. Como essa conta é membro do perfil `fwgrp`, que está no modo `RECORDING`, o firewall interpreta as declarações como aplicáveis a `fwgrp` e registra a forma de digest normalizada das declarações como regras no `fwgrp` allowlist. Essas regras, por sua vez, se aplicam a todas as contas que são membros de `fwgrp`.

Nota

Até que o perfil de grupo do `fwgrp` receba declarações no modo `RECORDING`, sua allowlist é vazia, o que é equivalente a “rejeitar tudo”. Nenhuma declaração pode corresponder a uma allowlist vazia, o que tem essas implicações:

* O perfil do grupo não pode ser alterado para o modo `PROTECTING`. Ele rejeitaria todas as declarações, proibindo efetivamente que as contas que são membros do grupo executem qualquer declaração.

* O perfil do grupo pode ser alterado para o modo `DETECTING`. Nesse caso, o perfil aceita todas as declarações, mas as registra como suspeitas.

5. Neste ponto, as informações do perfil do grupo são armazenadas em cache, incluindo seu nome, membros e allowlist. Para ver essas informações, consulte as tabelas do Firewall do Schema de Desempenho:

   ```
   mysql> SELECT MODE FROM performance_schema.firewall_groups
          WHERE NAME = 'fwgrp';
   +-----------+
   | MODE      |
   +-----------+
   | RECORDING |
   +-----------+
   mysql> SELECT * FROM performance_schema.firewall_membership
          WHERE GROUP_ID = 'fwgrp' ORDER BY MEMBER_ID;
   +----------+-------------------+
   | GROUP_ID | MEMBER_ID         |
   +----------+-------------------+
   | fwgrp    | member1@localhost |
   +----------+-------------------+
   mysql> SELECT RULE FROM performance_schema.firewall_group_allowlist
          WHERE NAME = 'fwgrp';
   +----------------------------------------------------------------------+
   | RULE                                                                 |
   +----------------------------------------------------------------------+
   | SELECT @@`version_comment` LIMIT ?                                   |
   | UPDATE `actor` SET `last_update` = NOW ( ) WHERE `actor_id` = ?      |
   | SELECT `title` , `release_year` FROM `film` WHERE `film_id` = ?      |
   | SELECT `store_id` , COUNT ( * ) FROM `inventory` GROUP BY `store_id` |
   +----------------------------------------------------------------------+
   ```

Nota

A regra `@@version_comment` vem de uma declaração enviada automaticamente pelo cliente **mysql** quando você se conecta ao servidor.

Importante

Treine o firewall em condições que correspondam ao uso da aplicação. Por exemplo, para determinar as características e capacidades do servidor, um conector MySQL específico pode enviar declarações ao servidor no início de cada sessão. Se uma aplicação normalmente for usada através desse conector, treine o firewall usando o conector também. Isso permite que essas declarações iniciais se tornem parte da lista de permissão para o perfil do grupo associado à aplicação.

6. Reinvoque `sp_set_firewall_group_mode()` novamente para mudar o perfil do grupo para o modo `PROTECTING`:

   ```
   CALL mysql.sp_set_firewall_group_mode('fwgrp', 'PROTECTING');
   ```

Importante

A mudança do perfil do grupo fora do modo `RECORDING` sincroniza seus dados armazenados nas tabelas do banco de dados do sistema `mysql`, que fornecem armazenamento persistente subjacente. Se você não mudar o modo para um perfil que está sendo gravado, os dados armazenados não serão escritos em armazenamento persistente e serão perdidos quando o servidor for reiniciado.

7. Adicione ao perfil do grupo quaisquer outras contas que devem ser membros:

   ```
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member2@localhost');
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member3@localhost');
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member4@localhost');
   ```

O perfil allowlist treinado usando a conta `member1@localhost` agora também se aplica às contas adicionais.

8. Para verificar a adesão do grupo atualizado, consulte novamente a tabela `firewall_membership`:

   ```
   mysql> SELECT * FROM performance_schema.firewall_membership
          WHERE GROUP_ID = 'fwgrp' ORDER BY MEMBER_ID;
   +----------+-------------------+
   | GROUP_ID | MEMBER_ID         |
   +----------+-------------------+
   | fwgrp    | member1@localhost |
   | fwgrp    | member2@localhost |
   | fwgrp    | member3@localhost |
   | fwgrp    | member4@localhost |
   +----------+-------------------+
   ```

9. Teste o perfil do grupo contra o firewall usando qualquer conta do grupo para executar algumas declarações aceitáveis e inaceitáveis. O firewall combina cada declaração da conta com o perfil allowlist e a aceita ou rejeita:

* Esta declaração não é idêntica a uma declaração de treinamento, mas produz a mesma declaração normalizada que uma delas, então o firewall a aceita:

     ```
     mysql> SELECT title, release_year FROM film WHERE film_id = 98;
     +-------------------+--------------+
     | title             | release_year |
     +-------------------+--------------+
     | BRIGHT ENCOUNTERS |         2006 |
     +-------------------+--------------+
     ```

* Essas declarações não correspondem a nada na lista permitida, então o firewall rejeita cada uma com um erro:

     ```
     mysql> SELECT title, release_year FROM film WHERE film_id = 98 OR TRUE;
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> SHOW TABLES LIKE 'customer%';
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> TRUNCATE TABLE mysql.slow_log;
     ERROR 1045 (28000): Statement was blocked by Firewall
     ```

* Se a variável de sistema `mysql_firewall_trace` estiver habilitada, o firewall também escreve declarações rejeitadas no log de erro. Por exemplo:

     ```
     [Note] Plugin MYSQL_FIREWALL reported:
     'ACCESS DENIED for 'member1@localhost'. Reason: No match in allowlist.
     Statement: TRUNCATE TABLE `mysql` . `slow_log`'
     ```

Essas mensagens de registro podem ser úteis para identificar a origem dos ataques, caso isso seja necessário.

10. Se os membros precisarem ser removidos do perfil do grupo, use o procedimento armazenado `sp_firewall_group_delist()` em vez de `sp_firewall_group_enlist()`:

    ```
    CALL mysql.sp_firewall_group_delist('fwgrp', 'member3@localhost');
    ```

O perfil do grupo de firewall agora é treinado para contas de membros. Quando os clientes se conectam usando qualquer conta do grupo e tentam executar declarações, o perfil protege o MySQL contra declarações que não correspondem à lista de permissão do perfil.

O procedimento que acabou de ser mostrado adicionou apenas um membro ao perfil do grupo antes de treinar sua allowlist. Fazer isso fornece um melhor controle sobre o período de treinamento, limitando quais contas podem adicionar novas declarações aceitáveis à allowlist. Se um treinamento adicional for necessário, você pode voltar o perfil para o modo `RECORDING`:

```
CALL mysql.sp_set_firewall_group_mode('fwgrp', 'RECORDING');
```

No entanto, isso permite que qualquer membro do grupo execute declarações e as adicione à lista de permissão. Para limitar o treinamento adicional a um único membro do grupo, chame `sp_set_firewall_group_mode_and_user()`, que é como `sp_set_firewall_group_mode()`, mas que leva um argumento adicional especificando qual conta é permitida para treinar o perfil no modo `RECORDING`. Por exemplo, para habilitar o treinamento apenas por `member4@localhost`, faça isso:

```
CALL mysql.sp_set_firewall_group_mode_and_user('fwgrp', 'RECORDING', 'member4@localhost');
```

Isso permite treinamento adicional pelo grupo especificado sem precisar remover os outros membros do grupo. Eles podem executar declarações, mas as declarações não são adicionadas à lista de permissão. (Lembre-se, no entanto, que no modo `RECORDING` os outros membros podem executar *qualquer* declaração.)

Nota

Para evitar comportamentos inesperados quando uma conta específica é especificada como a conta de treinamento para um perfil de grupo, sempre certifique-se de que a conta é membro do grupo.

Após o treinamento adicional, configure o perfil do grupo de volta para o modo `PROTECTING`:

```
CALL mysql.sp_set_firewall_group_mode('fwgrp', 'PROTECTING');
```

A conta de treinamento estabelecida por `sp_set_firewall_group_mode_and_user()` é salva no perfil do grupo, então o firewall a lembra caso mais treinamento seja necessário mais tarde. Assim, se você chamar `sp_set_firewall_group_mode()` (que não aceita argumento de conta de treinamento), a conta de treinamento do perfil atual, `member4@localhost`, permanece inalterada.

Para limpar a conta de treinamento, se realmente se deseja permitir que todos os membros do grupo realizem treinamento no modo `RECORDING`, chame `sp_set_firewall_group_mode_and_user()` e passe um valor `NULL` para o argumento da conta:

```
CALL mysql.sp_set_firewall_group_mode_and_user('fwgrp', 'RECORDING', NULL);
```

É possível detectar intrusões ao registrar declarações que não correspondem como suspeitas, sem negar o acesso. Primeiro, coloque o perfil do grupo no modo `DETECTING`:

```
CALL mysql.sp_set_firewall_group_mode('fwgrp', 'DETECTING');
```

Em seguida, usando uma conta de membro, execute uma declaração que não corresponda à lista de permissão do perfil do grupo. No modo `DETECTING`, o firewall permite que a declaração que não corresponde seja executada:

```
mysql> SHOW TABLES LIKE 'customer%';
+------------------------------+
| Tables_in_sakila (customer%) |
+------------------------------+
| customer                     |
| customer_list                |
+------------------------------+
```

Além disso, o firewall escreve uma mensagem no log de erro:

```
[Note] Plugin MYSQL_FIREWALL reported:
'SUSPICIOUS STATEMENT from 'member1@localhost'. Reason: No match in allowlist.
Statement: SHOW TABLES LIKE ?'
```

Para desativar um perfil de grupo, mude seu modo para `OFF`:

```
CALL mysql.sp_set_firewall_group_mode(group, 'OFF');
```

Para esquecer todo o treinamento para um perfil e desativá-lo, redefina-o:

```
CALL mysql.sp_set_firewall_group_mode(group, 'RESET');
```

A operação de redefinição faz com que o firewall exclua todas as regras do perfil e defina seu modo como `OFF`.

##### Registro de perfis de conta de firewall

O MySQL Enterprise Firewall permite que perfis sejam registrados que correspondam a contas individuais. Para usar um perfil de conta de firewall para proteger o MySQL contra declarações recebidas de uma conta específica, siga estes passos:

1. Registre o perfil da conta e coloque-o no modo `RECORDING`.

2. Conecte-se ao servidor MySQL usando a conta e execute as instruções que devem ser aprendidas. Isso treina o perfil da conta e estabelece as regras que formam a lista de permissão do perfil.

3. Mude o perfil da conta para o modo `PROTECTING`. Quando um cliente se conecta ao servidor usando a conta, o perfil de conta permite a restrição da execução da declaração.

4. Se for necessário treinamento adicional, mude o perfil da conta para o modo `RECORDING` novamente, atualize sua lista de permissão com novos padrões de declaração, e depois mude de volta para o modo `PROTECTING`.

Observe essas diretrizes para referências de contas relacionadas ao firewall:

* Tome nota do contexto em que as referências de conta ocorrem. Para nomear uma conta para operações de firewall, especifique-a como uma cadeia de caracteres entre aspas simples (`'user_name@host_name'`). Isso difere da convenção usual do MySQL para declarações como [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") e `GRANT`, para as quais você cita as partes de usuário e host de um nome de conta separadamente (`'user_name'@'host_name'`).

O requisito de nomear as contas como uma cadeia de caracteres entre aspas duplas para operações de firewall significa que você não pode usar contas que tenham caracteres embutidos `@` no nome do usuário.

* O firewall avalia as declarações em relação às contas representadas por nomes de usuário e hospedeiro reais, autenticados pelo servidor. Ao registrar contas em perfis, não use caracteres especiais ou máscaras de rede:

Suponha que uma conta chamada `me@%.example.org` exista e um cliente a use para se conectar ao servidor a partir do host `abc.example.org`.

+ O nome da conta contém um caractere de comodínculo `%`, mas o servidor autentica o cliente como tendo um nome de usuário de `me` e nome de host de `abc.example.com`, e é isso o que o firewall vê.

+ Consequentemente, o nome da conta a ser usado para operações de firewall é `me@abc.example.org` em vez de `me@%.example.org`.

O procedimento a seguir mostra como registrar um perfil de conta no firewall, treinar o firewall para saber as declarações aceitáveis para esse perfil (sua lista de permissão) e usar o perfil para proteger o MySQL contra a execução de declarações inaceitáveis pela conta. A conta de exemplo, `fwuser@localhost`, é suposta para uso por uma aplicação que acesse tabelas no banco de dados `sakila` (disponível em https://dev.mysql.com/doc/index-other.html).

Use uma conta administrativa do MySQL para realizar os passos deste procedimento, exceto aqueles passos designados para execução pela conta `fwuser@localhost` que corresponde ao perfil da conta registrada com o firewall. Para declarações executadas usando esta conta, o banco de dados padrão deve ser `sakila`. (Você pode usar um banco de dados diferente ajustando as instruções conforme necessário.)

1. Se necessário, crie a conta para usar para executar declarações (escolha uma senha apropriada) e conceda-lhe privilégios para o banco de dados `sakila`:

   ```
   CREATE USER 'fwuser'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL ON sakila.* TO 'fwuser'@'localhost';
   ```

2. Use o procedimento armazenado `sp_set_firewall_mode()` para registrar o perfil da conta com o firewall e coloque o perfil no modo `RECORDING` (treinamento):

   ```
   CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'RECORDING');
   ```

3. Para treinar o perfil da conta registrada, conecte-se ao servidor como `fwuser` do host do servidor, para que o firewall veja uma conta de sessão de `fwuser@localhost`. Em seguida, use a conta para executar algumas declarações que sejam consideradas legítimas para o perfil. Por exemplo:

   ```
   SELECT first_name, last_name FROM customer WHERE customer_id = 1;
   UPDATE rental SET return_date = NOW() WHERE rental_id = 1;
   SELECT get_customer_balance(1, NOW());
   ```

Como o perfil está no modo `RECORDING`, o firewall registra a forma normalizada do digest dos enunciados como regras no allowlist do perfil.

Nota

Até que o perfil de conta `fwuser@localhost` receba declarações no modo `RECORDING`, sua lista de permissão é vazia, o que é equivalente a “rejeitar tudo”. Nenhuma declaração pode corresponder a uma lista de permissão vazia, o que tem essas implicações:

* O perfil da conta não pode ser alterado para o modo `PROTECTING`. Ele rejeitaria todas as declarações, proibindo efetivamente a execução de qualquer declaração pela conta.

* O perfil da conta pode ser alterado para o modo `DETECTING`. Nesse caso, o perfil aceita todas as declarações, mas as registra como suspeitas.

4. Neste ponto, as informações do perfil da conta são armazenadas em cache. Para ver essas informações, consulte as tabelas do firewall `INFORMATION_SCHEMA`:

   ```
   mysql> SELECT MODE FROM INFORMATION_SCHEMA.MYSQL_FIREWALL_USERS
          WHERE USERHOST = 'fwuser@localhost';
   +-----------+
   | MODE      |
   +-----------+
   | RECORDING |
   +-----------+
   mysql> SELECT RULE FROM INFORMATION_SCHEMA.MYSQL_FIREWALL_WHITELIST
          WHERE USERHOST = 'fwuser@localhost';
   +----------------------------------------------------------------------------+
   | RULE                                                                       |
   +----------------------------------------------------------------------------+
   | SELECT `first_name` , `last_name` FROM `customer` WHERE `customer_id` = ?  |
   | SELECT `get_customer_balance` ( ? , NOW ( ) )                              |
   | UPDATE `rental` SET `return_date` = NOW ( ) WHERE `rental_id` = ?          |
   | SELECT @@`version_comment` LIMIT ?                                         |
   +----------------------------------------------------------------------------+
   ```

Nota

A regra `@@version_comment` vem de uma declaração enviada automaticamente pelo cliente **mysql** quando você se conecta ao servidor.

Importante

Treine o firewall em condições que correspondam ao uso da aplicação. Por exemplo, para determinar as características e capacidades do servidor, um conector MySQL específico pode enviar declarações ao servidor no início de cada sessão. Se uma aplicação normalmente for usada através desse conector, treine o firewall usando o conector também. Isso permite que essas declarações iniciais se tornem parte da lista de permissão para o perfil da conta associado à aplicação.

5. Reinvoque `sp_set_firewall_mode()` novamente, desta vez alternando o perfil da conta para o modo `PROTECTING`:

   ```
   CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'PROTECTING');
   ```

Importante

A troca do perfil da conta fora do modo `RECORDING` sincroniza seus dados armazenados nos bancos de dados das tabelas do sistema `mysql` que fornecem armazenamento subjacente persistente. Se você não trocar o modo para um perfil que está sendo registrado, os dados armazenados não serão escritos em armazenamento persistente e serão perdidos quando o servidor for reiniciado.

6. Teste o perfil da conta usando a conta para executar algumas declarações aceitáveis e inaceitáveis. O firewall compara cada declaração da conta com a lista de permissão do perfil e a aceita ou rejeita:

* Esta declaração não é idêntica a uma declaração de treinamento, mas produz a mesma declaração normalizada que uma delas, então o firewall a aceita:

     ```
     mysql> SELECT first_name, last_name FROM customer WHERE customer_id = '48';
     +------------+-----------+
     | first_name | last_name |
     +------------+-----------+
     | ANN        | EVANS     |
     +------------+-----------+
     ```

* Essas declarações não correspondem a nada na lista permitida, então o firewall rejeita cada uma com um erro:

     ```
     mysql> SELECT first_name, last_name FROM customer WHERE customer_id = 1 OR TRUE;
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> SHOW TABLES LIKE 'customer%';
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> TRUNCATE TABLE mysql.slow_log;
     ERROR 1045 (28000): Statement was blocked by Firewall
     ```

* Se a variável de sistema `mysql_firewall_trace` estiver habilitada, o firewall também escreve declarações rejeitadas no log de erro. Por exemplo:

     ```
     [Note] Plugin MYSQL_FIREWALL reported:
     'ACCESS DENIED for fwuser@localhost. Reason: No match in allowlist.
     Statement: TRUNCATE TABLE `mysql` . `slow_log`'
     ```

Essas mensagens de registro podem ser úteis para identificar a origem dos ataques, caso isso seja necessário.

O perfil da conta do firewall agora está treinado para a conta `fwuser@localhost`. Quando os clientes se conectam usando essa conta e tentam executar instruções, o perfil protege o MySQL contra instruções que não correspondem à lista de permissão do perfil.

É possível detectar intrusões ao registrar declarações não correspondentes como suspeitas, sem negar o acesso. Primeiro, coloque o perfil da conta no modo `DETECTING`:

```
CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'DETECTING');
```

Em seguida, usando a conta, execute uma declaração que não corresponda à lista de permissão do perfil da conta. No modo `DETECTING`, o firewall permite que a declaração que não corresponde seja executada:

```
mysql> SHOW TABLES LIKE 'customer%';
+------------------------------+
| Tables_in_sakila (customer%) |
+------------------------------+
| customer                     |
| customer_list                |
+------------------------------+
```

Além disso, o firewall escreve uma mensagem no log de erro:

```
[Note] Plugin MYSQL_FIREWALL reported:
'SUSPICIOUS STATEMENT from 'fwuser@localhost'. Reason: No match in allowlist.
Statement: SHOW TABLES LIKE ?'
```

Para desativar um perfil de conta, mude seu modo para `OFF`:

```
CALL mysql.sp_set_firewall_mode(user, 'OFF');
```

Para esquecer todo o treinamento para um perfil e desativá-lo, redefina-o:

```
CALL mysql.sp_set_firewall_mode(user, 'RESET');
```

A operação de redefinição faz com que o firewall exclua todas as regras do perfil e defina seu modo como `OFF`.

##### Monitoramento do Firewall

Para avaliar a atividade do firewall, examine suas variáveis de status. Por exemplo, após realizar o procedimento mostrado anteriormente para treinar e proteger o perfil do grupo `fwgrp`, as variáveis parecem assim:

```
mysql> SHOW GLOBAL STATUS LIKE 'Firewall%';
+----------------------------+-------+
| Variable_name              | Value |
+----------------------------+-------+
| Firewall_access_denied     | 3     |
| Firewall_access_granted    | 4     |
| Firewall_access_suspicious | 1     |
| Firewall_cached_entries    | 4     |
+----------------------------+-------+
```

As variáveis indicam o número de declarações rejeitadas, aceitas, registradas como suspeitas e adicionadas ao cache, respectivamente. O `Firewall_access_granted` conta 4 devido à declaração `@@version_comment` enviada pelo cliente **mysql** cada uma das três vezes que você se conectou usando a conta registrada, além da declaração `SHOW TABLES` que não foi bloqueada no modo `DETECTING`.

##### Migrando perfis de conta para perfis de grupo

Antes do MySQL 8.0.23, o MySQL Enterprise Firewall suporta apenas perfis de conta que se aplicam a uma única conta. A partir do MySQL 8.0.23, o firewall também suporta perfis de grupo que podem ser aplicados a várias contas. Um perfil de grupo permite uma administração mais fácil quando a mesma lista de permissão deve ser aplicada a várias contas: em vez de criar um perfil de conta por conta e duplicar a lista de permissão em todos esses perfis, crie um único perfil de grupo e faça as contas membros dele. A lista de permissão do grupo, então, se aplica a todas as contas.

Um perfil de grupo com uma única conta de membro é logicamente equivalente a um perfil de conta para essa conta, portanto, é possível administrar o firewall usando perfis de grupo exclusivamente, em vez de uma mistura de perfis de conta e de grupo. Para novas instalações de firewall, isso é feito criando uniformemente novos perfis como perfis de grupo e evitando perfis de conta.

Devido à maior flexibilidade oferecida pelos perfis de grupo, é recomendável que todos os novos perfis de firewall sejam criados como perfis de grupo. Os perfis de conta são desaconselhados a partir do MySQL 8.0.26 e estão sujeitos à remoção em uma versão futura do MySQL. Para atualizações de instalações de firewall que já contenham perfis de conta, o MySQL Enterprise Firewall no MySQL 8.0.26 e versões posteriores inclui um procedimento armazenado chamado `sp_migrate_firewall_user_to_group()` para ajudá-lo a converter perfis de conta em perfis de grupo. Para usá-lo, realize o procedimento a seguir como um usuário que possui o privilégio `FIREWALL_ADMIN`:

1. Execute o script `firewall_profile_migration.sql` para instalar o procedimento armazenado `sp_migrate_firewall_user_to_group()`. O script está localizado no diretório `share` da sua instalação do MySQL.

   ```
   $> mysql -u root -p < firewall_profile_migration.sql
   Enter password: (enter root password here)
   ```

2. Identifique quais perfis de conta existem, consultando a tabela do esquema de informações `MYSQL_FIREWALL_USERS`. Por exemplo:

   ```
   mysql> SELECT USERHOST FROM INFORMATION_SCHEMA.MYSQL_FIREWALL_USERS;
   +-------------------------------+
   | USERHOST                      |
   +-------------------------------+
   | admin@localhost               |
   | local_client@localhost        |
   | remote_client@abc.example.com |
   +-------------------------------+
   ```

3. Para cada perfil de conta identificado no passo anterior, converta-o em um perfil de grupo:

   ```
   CALL mysql.sp_migrate_firewall_user_to_group('admin@localhost', 'admins');
   CALL mysql.sp_migrate_firewall_user_to_group('local_client@localhost', 'local_clients');
   CALL mysql.sp_migrate_firewall_user_to_group('remote_client@localhost', 'remote_clients');
   ```

Em cada caso, o perfil da conta deve existir e não deve estar atualmente no modo `RECORDING`, e o perfil do grupo não deve já existir. O perfil do grupo resultante tem a conta nomeada como seu único membro inscrito, que também é definido como a conta de treinamento do grupo. O modo operacional do perfil do grupo é retirado do modo operacional do perfil da conta.

4. (Opcional) Remova `sp_migrate_firewall_user_to_group()`:

   ```
   DROP PROCEDURE IF EXISTS mysql.sp_migrate_firewall_user_to_group;
   ```

Para obter informações adicionais sobre `sp_migrate_firewall_user_to_group()`, consulte Procedimentos Armazenados Diversos do Firewall.

#### 8.4.7.4 Referência ao Firewall Empresarial do MySQL

As seções a seguir fornecem uma referência aos elementos do Firewall Empresarial MySQL:

* Tabelas do Firewall Empresarial MySQL
* Procedimentos Armazenados do Firewall Empresarial MySQL
* Funções Administrativas do Firewall Empresarial MySQL
* Variáveis do Sistema do Firewall Empresarial MySQL
* Variáveis de Status do Firewall Empresarial MySQL

##### Tabelas do Firewall Empresarial do MySQL

O MySQL Enterprise Firewall mantém as informações do perfil em uma base por grupo e por conta, usando tabelas no banco de dados do firewall para armazenamento persistente e tabelas do Esquema de Informações e do Esquema de Desempenho para fornecer visualizações de dados armazenados em memória. Quando ativado, o firewall baseia as decisões operacionais nos dados armazenados em cache. O banco de dados do firewall pode ser o `mysql` sistema de banco de dados ou um esquema personalizado (consulte Instalar o MySQL Enterprise Firewall).

As tabelas no banco de dados do firewall são abordadas nesta seção. Para informações sobre as tabelas do Esquema de Informações do Firewall do MySQL Enterprise e do Esquema de Desempenho, consulte a Seção 28.7, “Tabelas do INFORMATION_SCHEMA MySQL Enterprise Firewall”, e a Seção 29.12.17, “Tabelas do Firewall do Esquema de Desempenho”, respectivamente.

* Tabelas de perfil de grupo de firewall * Tabelas de perfil de conta de firewall

###### Tabelas de perfil de grupo de firewall

A partir do MySQL 8.0.23, o MySQL Enterprise Firewall mantém as informações do perfil do grupo usando tabelas no banco de dados do sistema `mysql` para armazenamento persistente e tabelas do Performance Schema para fornecer visualizações de dados armazenados em cache na memória.

Cada sistema e tabela do Schema de Desempenho são acessíveis apenas por contas que tenham o privilégio [[`SELECT`] para isso.

A tabela `mysql.firewall_groups` lista os nomes e os modos operacionais dos perfis de grupo de firewall registrados. A tabela tem as seguintes colunas (com a tabela correspondente do Schema de Desempenho `firewall_groups` que tem colunas semelhantes, mas não necessariamente idênticas):

* `NAME`

O nome do perfil do grupo.

* `MODE`

O modo operacional atual para o perfil. Os valores permitidos para o modo são `OFF`, `DETECTING`, `PROTECTING` e `RECORDING`. Para obter detalhes sobre seus significados, consulte Conceitos de Firewall.

* `USERHOST`

A conta de treinamento para o perfil do grupo, a ser usada quando o perfil estiver no modo `RECORDING`. O valor é `NULL`, ou uma conta que não seja `NULL` e que tenha o formato `user_name@host_name`:

+ Se o valor for `NULL`, as regras de permissão do firewall permitem listas de endereços para declarações recebidas de qualquer conta que seja membro do grupo.

+ Se o valor não for `NULL`, as regras de permissão do firewall permitem apenas declarações recebidas da conta designada (que deve ser membro do grupo).

As regras allowlist da tabela `mysql.firewall_group_allowlist` permitem listas de perfis de grupos de firewall registrados. A tabela tem as seguintes colunas (com as colunas correspondentes da tabela do Schema de Desempenho `firewall_group_allowlist` que têm colunas semelhantes, mas não necessariamente idênticas):

* `NAME`

O nome do perfil do grupo.

* `RULE`

Uma declaração normalizada que indica um padrão de declaração aceitável para o perfil. Um allowlist de perfil é a união de suas regras.

* `ID`

Uma coluna inteira que é uma chave primária para a tabela.

A tabela `mysql.firewall_membership` lista os membros (contas) dos perfis de grupo de firewall registrados. A tabela tem as seguintes colunas (com a tabela correspondente do Schema de Desempenho `firewall_membership` que tem colunas semelhantes, mas não necessariamente idênticas):

* `GROUP_ID`

O nome do perfil do grupo.

* `MEMBER_ID`

O nome de uma conta que é membro do perfil.

###### Tabelas de perfil de conta de firewall

O MySQL Enterprise Firewall mantém as informações do perfil da conta usando tabelas no banco de dados do sistema `mysql` para armazenamento persistente e tabelas `INFORMATION_SCHEMA` para fornecer visões sobre dados armazenados em memória.

Cada tabela do banco de dados do sistema `mysql` é acessível apenas por contas que possuem o privilégio `SELECT` para ela. As tabelas `INFORMATION_SCHEMA` são acessíveis por qualquer pessoa.

A partir do MySQL 8.0.26, essas tabelas são desaconselhadas e sujeitas à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.

A tabela `mysql.firewall_users` lista os nomes e os modos operacionais dos perfis de conta de firewall registrados. A tabela tem as seguintes colunas (com a tabela correspondente `MYSQL_FIREWALL_USERS` que tem colunas semelhantes, mas não necessariamente idênticas):

* `USERHOST`

O nome do perfil da conta. Cada nome de conta tem o formato `user_name@host_name`.

* `MODE`

O modo operacional atual para o perfil. Os valores permitidos para o modo são `OFF`, `DETECTING`, `PROTECTING`, `RECORDING` e `RESET`. Para obter detalhes sobre seus significados, consulte Conceitos de Firewall.

As regras allowlist da tabela `mysql.firewall_whitelist` permitem listas de perfis de contas de firewall registradas. A tabela tem as seguintes colunas (com a tabela correspondente `MYSQL_FIREWALL_WHITELIST` que tem colunas semelhantes, mas não necessariamente idênticas):

* `USERHOST`

O nome do perfil da conta. Cada nome de conta tem o formato `user_name@host_name`.

* `RULE`

Uma declaração normalizada que indica um padrão de declaração aceitável para o perfil. Um allowlist de perfil é a união de suas regras.

* `ID`

Uma coluna inteira que é uma chave primária para a tabela. Esta coluna foi adicionada no MySQL 8.0.12.

##### Procedimentos armazenados do firewall empresarial do MySQL

Os procedimentos armazenados do MySQL Enterprise Firewall realizam tarefas como registrar perfis com o firewall, estabelecer seu modo operacional e gerenciar a transferência de dados do firewall entre o cache e o armazenamento persistente. Esses procedimentos invocam funções administrativas que fornecem uma API para tarefas de nível inferior.

Os procedimentos armazenados do firewall são criados no banco de dados do sistema `mysql`. Para invocar um procedimento armazenado do firewall, faça isso enquanto `mysql` é o banco de dados padrão, ou qualifique o nome do procedimento com o nome do banco de dados. Por exemplo:

```
CALL mysql.sp_set_firewall_group_mode(group, mode);
```

* Perfil de grupo de firewall Procedimentos armazenados * Perfil de conta de firewall Procedimentos armazenados * Procedimentos armazenados de firewall Diversos

###### Perfil do grupo de firewall Procedimentos armazenados

Esses procedimentos armazenados realizam operações de gerenciamento em perfis de grupo de firewall:

* `sp_firewall_group_delist(group, user)`

Este procedimento armazenado remove uma conta de um perfil de grupo de firewall.

Se a chamada for bem-sucedida, a alteração na associação do grupo é feita tanto no cache de memória quanto no armazenamento persistente.

Argumentos:

+ *`group`*: Nome do perfil do grupo afetado.

+ *`user`*: A conta a ser removida, como uma string no formato `user_name@host_name`.

Exemplo:

  ```
  CALL sp_firewall_group_delist('g', 'fwuser@localhost');
  ```

Esse procedimento foi adicionado no MySQL 8.0.23.

* `sp_firewall_group_enlist(group, user)`

Este procedimento armazenado adiciona uma conta a um perfil de grupo de firewall. Não é necessário registrar a conta em si com o firewall antes de adicionar a conta ao grupo.

Se a chamada for bem-sucedida, a alteração na associação do grupo é feita tanto no cache de memória quanto no armazenamento persistente.

Argumentos:

+ *`group`*: Nome do perfil do grupo afetado.

+ *`user`*: A conta a ser adicionada, como uma string no formato `user_name@host_name`.

Exemplo:

  ```
  CALL sp_firewall_group_enlist('g', 'fwuser@localhost');
  ```

Esse procedimento foi adicionado no MySQL 8.0.23.

* `sp_reload_firewall_group_rules(group)`

Este procedimento armazenado fornece controle sobre a operação do firewall para perfis de grupo individuais. O procedimento utiliza funções administrativas de firewall para recarregar as regras de memória para um perfil de grupo a partir das regras armazenadas na tabela `mysql.firewall_group_allowlist`.

Argumentos:

+ *`group`*: Nome do perfil do grupo afetado.

Exemplo:

  ```
  CALL sp_reload_firewall_group_rules('myapp');
  ```

Aviso

Este procedimento limpa as regras do grupo de perfil em memória antes de recarregá-las do armazenamento persistente e define o modo do perfil para `OFF`. Se o modo do perfil não era `OFF` antes da chamada `sp_reload_firewall_group_rules()`, use `sp_set_firewall_group_mode()` para restaurar seu modo anterior após recarregar as regras. Por exemplo, se o perfil estava no modo `PROTECTING`, isso não é mais verdade após a chamada `sp_reload_firewall_group_rules()` e você deve defini-lo novamente explicitamente para `PROTECTING`.

Esse procedimento foi adicionado no MySQL 8.0.23.

* `sp_set_firewall_group_mode(group, mode)`

Este procedimento armazenado estabelece o modo operacional para um perfil de grupo de firewall, após registrar o perfil com o firewall, se ele ainda não tiver sido registrado. O procedimento também invoca as funções administrativas do firewall, conforme necessário, para transferir dados do firewall entre o cache e o armazenamento persistente. Este procedimento pode ser chamado mesmo se a variável de sistema `mysql_firewall_mode` for `OFF`, embora a definição do modo para um perfil não tenha efeito operacional até que o firewall seja habilitado.

Se o perfil já existia, qualquer limitação de gravação para ele permanece inalterada. Para definir ou limpar a limitação, chame `sp_set_firewall_group_mode_and_user()` em vez disso.

Argumentos:

+ *`group`*: Nome do perfil do grupo afetado.

+ *`mode`*: O modo operacional para o perfil, como uma string. Os valores permitidos para o modo são `OFF`, `DETECTING`, `PROTECTING` e `RECORDING`. Para obter detalhes sobre seus significados, consulte Conceitos de Firewall.

Exemplo:

  ```
  CALL sp_set_firewall_group_mode('myapp', 'PROTECTING');
  ```

Esse procedimento foi adicionado no MySQL 8.0.23.

* `sp_set_firewall_group_mode_and_user(group, mode, user)`

Este procedimento armazenado registra um grupo no firewall e estabelece seu modo operacional, semelhante ao `sp_set_firewall_group_mode()`, mas também especifica a conta de treinamento a ser usada quando o grupo estiver no modo `RECORDING`.

Argumentos:

+ *`group`*: Nome do perfil do grupo afetado.

+ *`mode`*: O modo operacional para o perfil, como uma string. Os valores permitidos para o modo são `OFF`, `DETECTING`, `PROTECTING` e `RECORDING`. Para obter detalhes sobre seus significados, consulte Conceitos de Firewall.

+ *`user`*: A conta de treinamento para o perfil do grupo, a ser usada quando o perfil estiver no modo `RECORDING`. O valor é `NULL`, ou uma conta que não seja `NULL` e que tenha o formato `user_name@host_name`:

- Se o valor for `NULL`, as regras de permissão do firewall permitem listas de endereços para declarações recebidas de qualquer conta que seja membro do grupo.

- Se o valor não for `NULL`, as regras de permissão do firewall permitem apenas declarações recebidas da conta designada (que deve ser membro do grupo).

Exemplo:

  ```
  CALL sp_set_firewall_group_mode_and_user('myapp', 'RECORDING', 'myapp_user1@localhost');
  ```

Esse procedimento foi adicionado no MySQL 8.0.23.

###### Perfil de conta do firewall Procedimentos armazenados

Esses procedimentos armazenados realizam operações de gerenciamento em perfis de contas de firewall:

* `sp_reload_firewall_rules(user)`

Este procedimento armazenado fornece controle sobre o funcionamento do firewall para perfis de conta individuais. O procedimento utiliza funções administrativas de firewall para recarregar as regras de memória para um perfil de conta a partir das regras armazenadas na tabela `mysql.firewall_whitelist`.

Argumentos:

+ *`user`*: O nome do perfil da conta afetada, como uma string no formato `user_name@host_name`.

Exemplo:

  ```
  CALL mysql.sp_reload_firewall_rules('fwuser@localhost');
  ```

Aviso

Este procedimento limpa as regras do perfil de conta em lista de memória antes de recarregá-las do armazenamento persistente e define o modo do perfil para `OFF`. Se o modo do perfil não era `OFF` antes da chamada `sp_reload_firewall_rules()`, use `sp_set_firewall_mode()` para restaurar seu modo anterior após recarregar as regras. Por exemplo, se o perfil estava no modo `PROTECTING`, isso não é mais verdade após a chamada `sp_reload_firewall_rules()` e você deve defini-lo novamente explicitamente para `PROTECTING`.

A partir do MySQL 8.0.26, esse procedimento é desaconselhado e sujeito à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.

* `sp_set_firewall_mode(user, mode)`

Este procedimento armazenado estabelece o modo operacional para um perfil de conta de firewall, após registrar o perfil com o firewall, se ele ainda não tiver sido registrado. O procedimento também invoca as funções administrativas do firewall, conforme necessário, para transferir dados do firewall entre o cache e o armazenamento persistente. Este procedimento pode ser chamado mesmo se a variável de sistema `mysql_firewall_mode` for `OFF`, embora a definição do modo para um perfil não tenha efeito operacional até que o firewall seja habilitado.

Argumentos:

+ *`user`*: O nome do perfil da conta afetada, como uma string no formato `user_name@host_name`.

+ *`mode`*: O modo operacional para o perfil, como uma string. Os valores permitidos para o modo são `OFF`, `DETECTING`, `PROTECTING`, `RECORDING` e `RESET`. Para obter detalhes sobre seus significados, consulte Conceitos de Firewall.

Mudar o perfil de uma conta para qualquer modo, exceto `RECORDING`, sincroniza os dados do cache do firewall com as tabelas do banco de dados do sistema `mysql` que fornecem armazenamento subjacente persistente. Mudar o modo de `OFF` para `RECORDING` recarrega a lista de permissão da tabela `mysql.firewall_whitelist` no cache.

Se um perfil de conta tiver uma lista de permissão vazia, seu modo não pode ser definido como `PROTECTING`, porque o perfil rejeitaria todas as declarações, proibindo efetivamente a conta de executar declarações. Em resposta a essa tentativa de definição de modo, o firewall produz uma mensagem de diagnóstico que é devolvida como um conjunto de resultados em vez de como um erro SQL:

  ```
  mysql> CALL mysql.sp_set_firewall_mode('a@b','PROTECTING');
  +----------------------------------------------------------------------+
  | set_firewall_mode(arg_userhost, arg_mode)                            |
  +----------------------------------------------------------------------+
  | ERROR: PROTECTING mode requested for a@b but the allowlist is empty. |
  +----------------------------------------------------------------------+
  ```

A partir do MySQL 8.0.26, esse procedimento é desaconselhado e sujeito à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.

###### Firewall Procedimentos Múltiplos Armazenados

Esses procedimentos armazenados realizam operações variadas de gerenciamento de firewall.

* `sp_migrate_firewall_user_to_group(user, group)`

A partir do MySQL 8.0.26, os perfis de conta são desaconselhados, pois os perfis de grupo podem fazer qualquer coisa que os perfis de conta podem fazer. O procedimento armazenado `sp_migrate_firewall_user_to_group()` converte um perfil de conta de firewall em um perfil de grupo com a conta como seu único membro registrado. Execute o script `firewall_profile_migration.sql` para instalá-lo. O procedimento de conversão é discutido em Migrar perfis de conta para perfis de grupo.

Essa rotina requer o privilégio `FIREWALL_ADMIN`.

Argumentos:

+ *`user`*: O nome do perfil de conta a ser convertido em um perfil de grupo, como uma string no formato `user_name@host_name`. O perfil de conta deve existir e não deve estar atualmente no modo `RECORDING`.

+ *`group`*: O nome do novo perfil de grupo, que não deve já existir. O novo perfil de grupo tem a conta nomeada como seu único membro inscrito, e esse membro é definido como a conta de treinamento do grupo. O modo operacional do perfil de grupo é retirado do modo operacional do perfil da conta.

Exemplo:

  ```
  CALL sp_migrate_firewall_user_to_group('fwuser@localhost', 'mygroup);
  ```

Esse procedimento foi adicionado no MySQL 8.0.26.

##### Funções administrativas do firewall empresarial do MySQL

As funções administrativas do MySQL Enterprise Firewall fornecem uma API para tarefas de nível inferior, como sincronizar o cache do firewall com as tabelas do sistema subjacente.

*Em operação normal, essas funções são invocadas pelos procedimentos armazenados do firewall, não diretamente pelos usuários. Por essa razão, essas descrições de função não incluem detalhes, como informações sobre seus argumentos e tipos de retorno.

* Funções do perfil do grupo do firewall
* Funções do perfil da conta do firewall
* Funções variadas do firewall

###### Funções do perfil de grupo do firewall

Essas funções realizam operações de gerenciamento em perfis de grupo de firewall:

* `firewall_group_delist(group, user)`(firewall-reference.html#function_firewall-group-delist)

Essa função remove uma conta de um perfil de grupo. Requer o privilégio `FIREWALL_ADMIN`.

Exemplo:

  ```
  SELECT firewall_group_delist('g', 'fwuser@localhost');
  ```

Essa função foi adicionada no MySQL 8.0.23.

* `firewall_group_enlist(group, user)`(firewall-reference.html#function_firewall-group-enlist)

Esta função adiciona uma conta a um perfil de grupo. Requer o privilégio `FIREWALL_ADMIN`.

Não é necessário registrar a conta em si com o firewall antes de adicionar a conta ao grupo.

Exemplo:

  ```
  SELECT firewall_group_enlist('g', 'fwuser@localhost');
  ```

Essa função foi adicionada no MySQL 8.0.23.

* `read_firewall_group_allowlist(group, rule)`(firewall-reference.html#function_read-firewall-group-allowlist)

Essa função agregada atualiza o cache de declaração registrada para o perfil do grupo nomeado por meio de uma declaração `SELECT` na tabela `mysql.firewall_group_allowlist`. Ela requer o privilégio `FIREWALL_ADMIN`.

Exemplo:

  ```
  SELECT read_firewall_group_allowlist('my_fw_group', fgw.rule)
  FROM mysql.firewall_group_allowlist AS fgw
  WHERE NAME = 'my_fw_group';
  ```

Essa função foi adicionada no MySQL 8.0.23.

* `read_firewall_groups(group, mode, user)`(firewall-reference.html#function_read-firewall-groups)

Essa função agregada atualiza o cache do perfil do grupo de firewall por meio de uma declaração `SELECT` na tabela `mysql.firewall_groups`. Ela requer o privilégio `FIREWALL_ADMIN`.

Exemplo:

  ```
  SELECT read_firewall_groups('g', 'RECORDING', 'fwuser@localhost')
  FROM mysql.firewall_groups;
  ```

Essa função foi adicionada no MySQL 8.0.23.

* `set_firewall_group_mode(group, mode[, user])`(firewall-reference.html#function_set-firewall-group-mode)

Essa função gerencia o cache do perfil do grupo, estabelece o modo operacional do perfil e, opcionalmente, especifica a conta de treinamento do perfil. Requer o privilégio `FIREWALL_ADMIN`.

Se o argumento opcional *`user`* não for fornecido, qualquer configuração anterior do *`user`* para o perfil permanecerá inalterada. Para alterar a configuração, chame a função com um terceiro argumento.

Se o argumento opcional *`user`* for fornecido, ele especifica a conta de treinamento para o perfil do grupo, a ser usada quando o perfil estiver no modo `RECORDING`. O valor é `NULL`, ou uma conta que não seja `NULL` e que tenha o formato `user_name@host_name`:

+ Se o valor for `NULL`, as regras de permissão do firewall permitem listas de endereços para declarações recebidas de qualquer conta que seja membro do grupo.

+ Se o valor não for `NULL`, as regras de permissão do firewall permitem apenas declarações recebidas da conta designada (que deve ser membro do grupo).

Exemplo:

  ```
  SELECT set_firewall_group_mode('g', 'DETECTING');
  ```

Essa função foi adicionada no MySQL 8.0.23.

###### Funções do perfil de conta do firewall

Essas funções realizam operações de gerenciamento em perfis de contas de firewall:

* `read_firewall_users(user, mode)`(firewall-reference.html#function_read-firewall-users)

Essa função agregada atualiza o cache do perfil da conta do firewall por meio de uma declaração `SELECT` na tabela `mysql.firewall_users`. Ela requer o privilégio `FIREWALL_ADMIN` ou o privilégio descontinuado `SUPER`.

Exemplo:

  ```
  SELECT read_firewall_users('fwuser@localhost', 'RECORDING')
  FROM mysql.firewall_users;
  ```

A partir do MySQL 8.0.26, essa função é desaconselhada e sujeita à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.

* `read_firewall_whitelist(user, rule)`(firewall-reference.html#function_read-firewall-whitelist)

Essa função agregada atualiza o cache de declarações registradas para o perfil de conta nomeado por meio de uma declaração `SELECT` na tabela `mysql.firewall_whitelist`. Ela requer o privilégio `FIREWALL_ADMIN` ou o privilégio descontinuado `SUPER`.

Exemplo:

  ```
  SELECT read_firewall_whitelist('fwuser@localhost', fw.rule)
  FROM mysql.firewall_whitelist AS fw
  WHERE USERHOST = 'fwuser@localhost';
  ```

A partir do MySQL 8.0.26, essa função é desaconselhada e sujeita à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.

* `set_firewall_mode(user, mode)`(firewall-reference.html#function_set-firewall-mode)

Essa função gerencia o cache do perfil da conta e estabelece o modo operacional do perfil. Ela requer o privilégio `FIREWALL_ADMIN` ou o privilégio descontinuado `SUPER`.

Exemplo:

  ```
  SELECT set_firewall_mode('fwuser@localhost', 'RECORDING');
  ```

A partir do MySQL 8.0.26, essa função é desaconselhada e sujeita à remoção em uma versão futura do MySQL. Veja Migrar perfis de conta para perfis de grupo.

###### Firewall Funções Diversas

Essas funções realizam operações de firewall diversas:

* `mysql_firewall_flush_status()`

Essa função redefre várias variáveis de status do firewall para 0:

+ `Firewall_access_denied`
  + `Firewall_access_granted`
  + `Firewall_access_suspicious`

Essa função requer o privilégio `FIREWALL_ADMIN` ou o privilégio descontinuado `SUPER`.

Exemplo:

  ```
  SELECT mysql_firewall_flush_status();
  ```

* `normalize_statement(stmt)`

Essa função normaliza uma declaração SQL na forma de digestão usada para regras de allowlist. Ela requer o privilégio `FIREWALL_ADMIN` ou o privilégio descontinuado `SUPER`.

Exemplo:

  ```
  SELECT normalize_statement('SELECT * FROM t1 WHERE c1 > 2');
  ```

Nota

A mesma funcionalidade de digest está disponível fora do contexto do firewall usando a função SQL `STATEMENT_DIGEST_TEXT()`.

##### Variáveis do sistema de firewall empresarial do MySQL

O MySQL Enterprise Firewall suporta as seguintes variáveis de sistema. Use-as para configurar a operação do firewall. Essas variáveis não estão disponíveis a menos que o firewall esteja instalado (consulte Seção 8.4.7.2, “Instalando ou Desinstalando o MySQL Enterprise Firewall”).

* `mysql_firewall_mode`

  <table frame="box" rules="all" summary="Properties for mysql_firewall_mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysql-firewall-mode[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>mysql_firewall_mode</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

Se o MySQL Enterprise Firewall está habilitado (o padrão) ou desabilitado.

* `mysql_firewall_trace`

  <table frame="box" rules="all" summary="Properties for mysql_firewall_trace"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysql-firewall-trace[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>mysql_firewall_trace</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Se o rastreamento do firewall empresarial do MySQL estiver habilitado ou desabilitado (o padrão). Quando o `mysql_firewall_trace` está habilitado, para o modo `PROTECTING`, o firewall escreve declarações rejeitadas no log de erro.

##### Variáveis de status do firewall empresarial do MySQL

O MySQL Enterprise Firewall suporta as seguintes variáveis de status. Use-as para obter informações sobre o status operacional do firewall. Essas variáveis não estão disponíveis a menos que o firewall esteja instalado (consulte a Seção 8.4.7.2, “Instalando ou Desinstalando o MySQL Enterprise Firewall”). As variáveis de status do firewall são definidas como 0 sempre que o plugin `MYSQL_FIREWALL` estiver instalado ou o servidor estiver iniciado. Muitas delas são redefinidas para zero pela função `mysql_firewall_flush_status()` (consulte Funções Administrativas do MySQL Enterprise Firewall).

* `Firewall_access_denied`

O número de declarações rejeitadas pelo MySQL Enterprise Firewall.

* `Firewall_access_granted`

O número de declarações aceitas pelo MySQL Enterprise Firewall.

* `Firewall_access_suspicious`

O número de declarações registradas pelo MySQL Enterprise Firewall como suspeitas para usuários que estão no modo `DETECTING`.

* `Firewall_cached_entries`

O número de declarações registradas pelo MySQL Enterprise Firewall, incluindo duplicatas.