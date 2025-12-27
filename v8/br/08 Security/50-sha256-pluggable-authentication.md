#### 8.4.1.3 Autenticação Pluggable SHA-256

O MySQL fornece dois plugins de autenticação que implementam a hash SHA-256 para as senhas das contas de usuário:

* `caching_sha2_password`: Implementa a autenticação SHA-256 (como `sha256_password`), mas usa o cache no lado do servidor para melhor desempenho e possui recursos adicionais para uma aplicabilidade mais ampla.
* `sha256_password` (desatualizado): Implementa a autenticação básica SHA-256.

Esta seção descreve o plugin de autenticação SHA-2 original sem cache. Para informações sobre o plugin de cache, consulte a Seção 8.4.1.2, “Autenticação Pluggable SHA-2”.

Importante

No MySQL 8.4, `caching_sha2_password` é o plugin de autenticação padrão, em vez de `mysql_native_password` (desatualizado). Para informações sobre as implicações dessa mudança para o funcionamento do servidor e a compatibilidade do servidor com clientes e conectores, consulte `caching_sha2_password` como o Plugin de Autenticação Preferencial.

Como `caching_sha2_password` é o plugin de autenticação padrão no MySQL 8.4 e oferece um conjunto de recursos maior do que o plugin de autenticação `sha256_password`, este último é desatualizado; espere-se que seja removido em uma versão futura do MySQL. As contas do MySQL que autenticam-se usando `sha256_password` devem ser migradas para usar `caching_sha2_password` em vez disso.

Importante

Para se conectar ao servidor usando uma conta que autentica-se com o plugin `sha256_password`, você deve usar uma conexão TLS ou uma conexão não criptografada que suporte a troca de senhas usando um par de chaves RSA, conforme descrito mais adiante nesta seção. De qualquer forma, o plugin `sha256_password` usa as capacidades de criptografia do MySQL. Consulte a Seção 8.3, “Usando Conexões Criptografadas”.

::: info Nota
Português (Brasil):

Em nome `sha256_password`, “sha256” refere-se ao comprimento de digestão de 256 bits que o plugin usa para criptografia. No nome `caching_sha2_password`, “sha2” refere-se mais genericamente à classe de algoritmos de criptografia SHA-2, da qual a criptografia de 256 bits é uma instância. A escolha desse nome deixa espaço para futuras expansões de possíveis comprimentos de digestão sem alterar o nome do plugin.

A tabela a seguir mostra os nomes dos plugins no lado do servidor e do cliente.

**Tabela 8.16 Nomes de Plugins e Bibliotecas para Autenticação SHA-256**

<table><thead><tr> <th>Plugin ou Arquivo</th> <th>Nome do Plugin ou Arquivo</th> </tr></thead><tbody><tr> <td>Plugin no lado do servidor</td> <td><code>sha256_password</code></td> </tr><tr> <td>Plugin no lado do cliente</td> <td><code>sha256_password</code></td> </tr><tr> <td>Arquivo de biblioteca</td> <td>Nenhum (os plugins são construídos internamente)</td> </tr></tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação plugável SHA-256:

*  Instalando Autenticação Plugável SHA-256
*  Usando Autenticação Plugável SHA-256

Para informações gerais sobre autenticação plugável no MySQL, consulte  Seção 8.2.17, “Autenticação Plugável”.

##### Instalando Autenticação Plugável SHA-256

O plugin `sha256_password` (desatualizado) existe em formas de servidor e cliente:

* O plugin no lado do servidor é incorporado ao servidor, não precisa ser carregado explicitamente e não pode ser desativado descarregando-o.
* O plugin no lado do cliente é incorporado à biblioteca de cliente `libmysqlclient` e está disponível para qualquer programa vinculado ao `libmysqlclient`.

O servidor atribui o plugin `sha256_password` à conta e usa-o para criptografar a senha usando SHA-256, armazenando esses valores nas colunas `plugin` e `authentication_string` da tabela `mysql.user` do sistema.

(A cláusula `IDENTIFIED WITH` não é necessária se `sha256_password` for o plugin padrão; isso pode ser especificado usando `authentication_policy`.)

`sha256_password` suporta conexões em transporte seguro. `sha256_password` também suporta a troca de senhas criptografadas usando RSA em conexões não criptografadas, se o MySQL for compilado usando OpenSSL, e o servidor MySQL ao qual você deseja se conectar estiver configurado para suportar RSA (usando o procedimento de configuração RSA dado mais adiante nesta seção).

O suporte a RSA tem essas características:

* No lado do servidor, duas variáveis de sistema nomeiam os arquivos de par de chaves privada e pública RSA: `sha256_password_private_key_path` e `sha256_password_public_key_path`. O administrador do banco de dados deve definir essas variáveis no início do servidor se os arquivos de chave a serem usados tiverem nomes que diferem dos valores padrão da variável de sistema.
* O servidor usa a variável `sha256_password_auto_generate_rsa_keys` para determinar se deve gerar automaticamente os arquivos de par de chaves RSA. Veja a Seção 8.3.3, “Criando Certificados e Chaves SSL e RSA”.
* A variável de status `Rsa_public_key` exibe o valor da chave pública RSA usada pelo plugin de autenticação `sha256_password`.
* Clientes que possuem a chave pública RSA podem realizar a troca de pares de chaves RSA com o servidor durante o processo de conexão, conforme descrito mais adiante.
* Para conexões por contas que se autenticam com `sha256_password` e troca de senha baseada em par de chaves RSA, o servidor envia a chave pública RSA ao cliente conforme necessário. No entanto, se uma cópia da chave pública estiver disponível no host do cliente, o cliente pode usá-la para salvar uma ida e volta no protocolo cliente/servidor:

+ Para esses clientes de linha de comando, use a opção `--server-public-key-path` para especificar o arquivo da chave pública RSA: `mysql`, `mysqladmin`, `mysqlbinlog`, `mysqlcheck`, `mysqldump`, `mysqlimport`, `mysqlshow`, `mysqlslap`, `mysqltest`.
  + Para programas que usam a API C, chame `mysql_options()` para especificar o arquivo da chave pública RSA passando a opção `MYSQL_SERVER_PUBLIC_KEY` e o nome do arquivo.
  + Para réplicas, use a declaração `ALTERAR SOURCE DE REPRODUÇÃO PARA` com a opção `SOURCE_PUBLIC_KEY_PATH` para especificar o arquivo da chave pública RSA. Para a Replicação em Grupo, a variável de sistema `group_replication_recovery_get_public_key` serve o mesmo propósito.

Para clientes que usam o plugin `sha256_password`, as senhas nunca são expostas como texto claro ao se conectar ao servidor. A forma como a transmissão da senha ocorre depende se uma conexão segura ou criptografia RSA é usada:

* Se a conexão for segura, um par de chaves RSA é desnecessário e não é usado. Isso se aplica a conexões criptografadas usando TLS. A senha é enviada como texto claro, mas não pode ser espiada porque a conexão é segura.

  ::: info Nota

  Ao contrário do `caching_sha2_password`, o plugin `sha256_password` desatualizado não trata conexões de memória compartilhada como seguras, mesmo que o transporte de memória compartilhada seja seguro por padrão.

  :::

* Se a conexão não for segura e um par de chaves RSA estiver disponível, a conexão permanece não criptografada. Isso se aplica a conexões não criptografadas usando TLS. O RSA é usado apenas para a troca de senhas entre o cliente e o servidor, para prevenir a espiagem de senhas. Quando o servidor recebe a senha criptografada, ela é descriptografada. Um deslocamento é usado na criptografia para prevenir ataques repetidos.
* Se uma conexão segura não for usada e a criptografia RSA não estiver disponível, a tentativa de conexão falha porque a senha não pode ser enviada sem ser exposta como texto claro.

  ::: info Nota

Para usar a criptografia de senha RSA com o plugin desatualizado `sha256_password`, o cliente e o servidor devem ser compilados usando o OpenSSL, e não apenas um deles.

:::

Supondo que o MySQL foi compilado usando o OpenSSL, use o seguinte procedimento para habilitar o uso de um par de chaves RSA para a troca de senhas durante o processo de conexão do cliente:

1. Crie os arquivos de par de chaves privadas e públicas RSA usando as instruções na Seção 8.3.3, “Criando Certificados e Chaves SSL e RSA”.
2. Se os arquivos de chave privada e pública estiverem localizados no diretório de dados e tiverem os nomes `private_key.pem` e `public_key.pem` (os valores padrão das variáveis de sistema `sha256_password_private_key_path` e `sha256_password_public_key_path`), o servidor os usa automaticamente ao iniciar.

  Caso contrário, para nomear explicitamente os arquivos de chave, defina as variáveis de sistema com os nomes dos arquivos de chave no arquivo de opção do servidor. Se os arquivos estiverem localizados no diretório de dados do servidor, você não precisa especificar seus nomes de caminho completos:

   ```
CREATE USER 'sha256user'@'localhost'
IDENTIFIED WITH sha256_password BY 'password';
```

  Se os arquivos de chave não estiverem localizados no diretório de dados, ou para tornar seus locais explícitos nos valores das variáveis de sistema, use nomes de caminho completos:

   ```
   [mysqld]
   sha256_password_private_key_path=myprivkey.pem
   sha256_password_public_key_path=mypubkey.pem
   ```
3. Reinicie o servidor, então conecte-se a ele e verifique o valor da variável `Rsa_public_key` status. O valor exibido realmente difere do mostrado aqui, mas deve ser não vazio:

   ```
   [mysqld]
   sha256_password_private_key_path=/usr/local/mysql/myprivkey.pem
   sha256_password_public_key_path=/usr/local/mysql/mypubkey.pem
   ```

   Se o valor estiver vazio, o servidor encontrou algum problema com os arquivos de chave. Verifique o log de erro para obter informações de diagnóstico.

Após o servidor ter sido configurado com os arquivos de chave RSA, as contas que autenticam com o plugin desatualizado `sha256_password` têm a opção de usar esses arquivos de chave para se conectar ao servidor. Como mencionado anteriormente, tais contas podem usar uma conexão segura (neste caso, o RSA não é usado) ou uma conexão não criptografada que realiza a troca de senha usando RSA. Suponha que uma conexão não criptografada seja usada. Por exemplo:

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

Para essa tentativa de conexão do `sha256user`, o servidor determina que `sha256_password` é o plugin de autenticação apropriado e o invoca (porque foi o plugin especificado no momento da criação do usuário). O plugin verifica que a conexão não está criptografada e, portanto, requer que a senha seja transmitida usando criptografia RSA. Neste caso, o plugin envia a chave pública RSA ao cliente, que a usa para criptografar a senha e retorna o resultado ao servidor. O plugin usa a chave privada RSA no lado do servidor para descriptografar a senha e aceita ou rejeita a conexão com base se a senha estiver correta.

O servidor envia a chave pública RSA ao cliente conforme necessário. No entanto, se o cliente tiver um arquivo contendo uma cópia local da chave pública RSA necessária pelo servidor, ele pode especificar o arquivo usando a opção `--server-public-key-path`:

```
$> mysql --ssl-mode=DISABLED -u sha256user -p
Enter password: password
```

O valor da chave pública no arquivo nomeado pela opção `--server-public-key-path` deve ser o mesmo que o valor da chave no arquivo do lado do servidor nomeado pela variável de sistema `sha256_password_public_key_path`. Se o arquivo de chave contiver um valor de chave pública válido, mas o valor estiver incorreto, ocorrerá um erro de acesso negado. Se o arquivo de chave não contiver uma chave pública válida, o programa do cliente não poderá usá-la. Neste caso, o plugin `sha256_password`, desatualizado, envia a chave pública ao cliente como se não tivesse sido especificada a opção `--server-public-key-path`.

Os usuários do cliente podem obter a chave pública RSA de duas maneiras:

* O administrador da base de dados pode fornecer uma cópia do arquivo de chave pública.
* Um usuário do cliente que possa se conectar ao servidor de outra forma pode usar uma declaração `SHOW STATUS LIKE 'Rsa_public_key'` e salvar o valor da chave retornado em um arquivo.