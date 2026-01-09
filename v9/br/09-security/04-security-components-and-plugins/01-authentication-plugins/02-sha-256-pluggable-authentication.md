#### 8.4.1.2 Autenticação Pluggable SHA-256

O MySQL fornece dois plugins de autenticação que implementam a hashing SHA-256 para as senhas das contas de usuário:

* `sha256_password`: Implementa a autenticação básica SHA-256.

* `caching_sha2_password`: Implementa a autenticação SHA-256 (como `sha256_password`), mas usa o cache no lado do servidor para melhor desempenho e possui recursos adicionais para uma aplicabilidade mais ampla.

Esta seção descreve o plugin de autenticação SHA-2 original sem cache. Para informações sobre o plugin de cache, consulte a Seção 8.4.1.1, “Autenticação Pluggable SHA-2”.

Importante

No MySQL 9.5, o plugin de autenticação `caching_sha2_password` é o padrão; o `mysql_native_password` não está mais disponível. Para informações sobre as implicações dessa mudança para o funcionamento do servidor e a compatibilidade do servidor com clientes e conectores, consulte `caching\_sha2\_password` como o Plugin de Autenticação Preferencial.

Como o `caching_sha2_password` é o plugin de autenticação padrão no MySQL 9.5 e oferece um conjunto de recursos maior do que o plugin de autenticação `sha256_password`, o `sha256_password` é desatualizado; espere-se que seja removido em uma versão futura do MySQL. As contas do MySQL que autenticam usando `sha256_password` devem ser migradas para usar `caching_sha2_password` em vez disso.

Importante

Para se conectar ao servidor usando uma conta que autentica com o plugin `sha256_password`, você deve usar uma conexão TLS ou uma conexão não criptografada que suporte a troca de senha usando um par de chaves RSA, conforme descrito mais adiante nesta seção. De qualquer forma, o plugin `sha256_password` usa as capacidades de criptografia do MySQL. Consulte a Seção 8.3, “Usando Conexões Criptografadas”.

Nota

No nome `sha256_password`, “sha256” refere-se ao comprimento de digestão de 256 bits que o plugin usa para criptografia. No nome `caching_sha2_password`, “sha2” refere-se mais genericamente à classe de algoritmos de criptografia SHA-2, da qual a criptografia de 256 bits é uma instância. A escolha desse nome deixa espaço para futuras expansões de possíveis comprimentos de digestão sem alterar o nome do plugin.

A tabela a seguir mostra os nomes dos plugins no lado do servidor e do cliente.

**Tabela 8.15 Nomes de Plugins e Bibliotecas para Autenticação SHA-256**

<table summary="Nomes dos plugins e do arquivo de biblioteca usados para autenticação de senha SHA-256."><thead><tr> <th>Plugin ou Arquivo</th> <th>Plugin ou Nome do Arquivo</th> </tr></thead><tbody><tr> <td>Plugin no lado do servidor</td> <td><code>sha256_password</code></td> </tr><tr> <td>Plugin no lado do cliente</td> <td><code>sha256_password</code></td> </tr><tr> <td>Arquivo de biblioteca</td> <td>Nenhum (os plugins são construídos internamente)</td> </tr></tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação de plug-in SHA-256:

* Instalando Autenticação de Plug-in SHA-256
* Usando Autenticação de Plug-in SHA-256

Para informações gerais sobre autenticação de plug-in no MySQL, consulte a Seção 8.2.17, “Autenticação de Plug-in”.

##### Instalando Autenticação de Plug-in SHA-256

O plugin `sha256_password` existe em formas de servidor e cliente:

* O plugin no lado do servidor é construído no servidor, não precisa ser carregado explicitamente e não pode ser desativado descarregando-o.
* O plugin no lado do cliente é construído na biblioteca de cliente `libmysqlclient` e está disponível para qualquer programa vinculado ao `libmysqlclient`.

Para configurar uma conta que use o plugin `sha256_password` para hash de senha SHA-256, use a seguinte declaração, onde *`senha`* é a senha desejada para a conta:

```
CREATE USER 'sha256user'@'localhost'
IDENTIFIED WITH sha256_password BY 'password';
```

O servidor atribui o plugin `sha256_password` à conta e usa-o para criptografar a senha usando SHA-256, armazenando esses valores nas colunas `plugin` e `authentication_string` da tabela de sistema `mysql.user`.

(A cláusula `IDENTIFIED WITH` não é necessária se `sha256_password` for o plugin padrão; isso pode ser especificado usando `authentication_policy`.)

O `sha256_password` suporta conexões em transporte seguro. O `sha256_password` também suporta a troca de senhas criptografadas usando RSA em conexões não criptografadas se o MySQL for compilado usando OpenSSL, e o servidor MySQL ao qual você deseja se conectar estiver configurado para suportar RSA (usando o procedimento de configuração RSA dado mais adiante nesta seção).

O suporte ao RSA tem essas características:

* No lado do servidor, duas variáveis de sistema nomeiam os arquivos de par de chaves privada e pública RSA: `sha256_password_private_key_path` e `sha256_password_public_key_path`. O administrador do banco de dados deve definir essas variáveis no início do servidor se os arquivos de chave a serem usados tiverem nomes que diferem dos valores padrão da variável de sistema.

* O servidor usa a variável `sha256_password_auto_generate_rsa_keys` para determinar se deve gerar automaticamente os arquivos de par de chaves RSA. Veja a Seção 8.3.3, “Criando Certificados e Chaves SSL e RSA”.

* A variável de status `Rsa_public_key` exibe o valor da chave pública RSA usada pelo plugin de autenticação `sha256_password`.

* Clientes que possuem a chave pública RSA podem realizar a troca de par de chaves RSA com o servidor durante o processo de conexão, conforme descrito mais adiante.

* Para conexões realizadas por contas que autenticam-se com `sha256_password` e troca de senha baseada em par de chaves públicas RSA, o servidor envia a chave pública RSA ao cliente conforme necessário. No entanto, se uma cópia da chave pública estiver disponível no host do cliente, o cliente pode usá-la para salvar uma sessão completa no protocolo cliente/servidor:

  + Para esses clientes de linha de comando, use a opção `--server-public-key-path` para especificar o arquivo da chave pública RSA: **mysql**, **mysqladmin**, **mysqlbinlog**, **mysqlcheck**, **mysqlbinlog**, **mysqlimport**, **mysqlshow**, **mysqlslap**, **mysqltest**.

  + Para programas que usam a API C, chame `mysql_options()` para especificar o arquivo da chave pública RSA passando a opção `MYSQL_SERVER_PUBLIC_KEY` e o nome do arquivo.

  + Para réplicas, use a declaração `CHANGE REPLICATION SOURCE TO` com a opção `SOURCE_PUBLIC_KEY_PATH` para especificar o arquivo da chave pública RSA. Para a Replicação em Grupo, a variável de sistema `group_replication_recovery_get_public_key` serve o mesmo propósito.

Para clientes que usam o plugin `sha256_password`, as senhas nunca são expostas como texto claro ao se conectar ao servidor. A forma como a transmissão da senha ocorre depende se uma conexão segura ou criptografia RSA é usada:

* Se a conexão for segura, um par de chaves RSA é desnecessário e não é usado. Isso se aplica a conexões criptografadas usando TLS. A senha é enviada como texto claro, mas não pode ser interceptada porque a conexão é segura.

  Nota

  Ao contrário do `caching_sha2_password`, o plugin `sha256_password` não trata conexões de memória compartilhada como seguras, mesmo que o transporte de memória compartilhada seja seguro por padrão.

* Se a conexão não for segura e um par de chaves RSA estiver disponível, a conexão permanecerá não criptografada. Isso se aplica a conexões não criptografadas usando TLS. O RSA é usado apenas para a troca de senhas entre o cliente e o servidor, para evitar a escuta de senhas. Quando o servidor recebe a senha criptografada, ele a descriptografa. Um código é usado na criptografia para evitar ataques repetidos.

* Se não for usada uma conexão segura e a criptografia RSA não estiver disponível, a tentativa de conexão falha porque a senha não pode ser enviada sem ser exposta como texto claro.

Nota

Para usar a criptografia de senha RSA com `sha256_password`, o cliente e o servidor devem ser compilados usando OpenSSL, não apenas um deles.

Supondo que o MySQL tenha sido compilado usando OpenSSL, use o seguinte procedimento para habilitar o uso de um par de chaves RSA para a troca de senhas durante o processo de conexão do cliente:

1. Crie os arquivos de chave privada e pública RSA usando as instruções na Seção 8.3.3, “Criando Certificados e Chaves SSL e RSA”.

2. Se os arquivos de chave privada e pública estiverem localizados no diretório de dados e tiverem os nomes `private_key.pem` e `public_key.pem` (os valores padrão das variáveis de sistema `sha256_password_private_key_path` e `sha256_password_public_key_path`), o servidor os usa automaticamente ao iniciar.

   Caso contrário, para nomear explicitamente os arquivos de chave, defina as variáveis de sistema com os nomes dos arquivos de chave no arquivo de opção do servidor. Se os arquivos estiverem localizados no diretório de dados do servidor, você não precisa especificar seus nomes de caminho completos:

   ```
   [mysqld]
   sha256_password_private_key_path=myprivkey.pem
   sha256_password_public_key_path=mypubkey.pem
   ```

   Se os arquivos de chave não estiverem localizados no diretório de dados, ou para tornar seus locais explícitos nos valores das variáveis de sistema, use nomes de caminho completos:

   ```
   [mysqld]
   sha256_password_private_key_path=/usr/local/mysql/myprivkey.pem
   sha256_password_public_key_path=/usr/local/mysql/mypubkey.pem
   ```

3. Reinicie o servidor, depois conecte-se a ele e verifique o valor da variável `Rsa_public_key`. O valor exibido difere do mostrado aqui, mas deve ser não vazio:

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

Após o servidor ter sido configurado com os arquivos de chave RSA, as contas que se autenticam com o plugin `sha256_password` têm a opção de usar esses arquivos de chave para se conectar ao servidor. Como mencionado anteriormente, tais contas podem usar uma conexão segura (neste caso, o RSA não é usado) ou uma conexão não criptografada que realiza a troca de senha usando RSA. Suponha que uma conexão não criptografada seja usada. Por exemplo:

```
$> mysql --ssl-mode=DISABLED -u sha256user -p
Enter password: password
```

Para essa tentativa de conexão por `sha256user`, o servidor determina que `sha256_password` é o plugin de autenticação apropriado e o invoca (porque foi o plugin especificado no momento da `CREATE USER`). O plugin descobre que a conexão não está criptografada e, portanto, requer que a senha seja transmitida usando criptografia RSA. Neste caso, o plugin envia a chave pública RSA ao cliente, que a usa para criptografar a senha e retorna o resultado ao servidor. O plugin usa a chave privada RSA no lado do servidor para descriptografar a senha e aceita ou rejeita a conexão com base se a senha estiver correta.

O servidor envia a chave pública RSA ao cliente conforme necessário. No entanto, se o cliente tiver um arquivo contendo uma cópia local da chave pública RSA requerida pelo servidor, ele pode especificar o arquivo usando a opção `--server-public-key-path`:

```
$> mysql --ssl-mode=DISABLED -u sha256user -p --server-public-key-path=file_name
Enter password: password
```

O valor da chave pública no arquivo nomeado pela opção `--server-public-key-path` deve ser o mesmo do valor da chave no arquivo do lado do servidor nomeado pela variável de sistema `sha256_password_public_key_path`. Se o arquivo da chave contiver um valor de chave pública válido, mas o valor estiver incorreto, ocorrerá um erro de acesso negado. Se o arquivo da chave não contiver uma chave pública válida, o programa cliente não poderá usá-la. Nesse caso, o plugin `sha256_password` envia a chave pública ao cliente como se a opção `--server-public-key-path` não tivesse sido especificada.

Os usuários do cliente podem obter a chave pública RSA de duas maneiras:

* O administrador do banco de dados pode fornecer uma cópia do arquivo de chave pública.

* Um usuário do cliente que possa se conectar ao servidor de outra forma pode usar a instrução `SHOW STATUS LIKE 'Rsa_public_key'` e salvar o valor da chave retornado em um arquivo.