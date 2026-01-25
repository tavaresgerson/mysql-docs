### 4.2.3 Opções de Comando para Conexão ao Server

Esta seção descreve as opções suportadas pela maioria dos programas Client MySQL que controlam como os programas Client estabelecem conexões com o Server e se as conexões são criptografadas. Estas opções podem ser fornecidas na linha de comando ou em um arquivo de opção.

* Opções de Comando para Estabelecimento de Conexão
* Opções de Comando para Conexões Criptografadas

#### Opções de Comando para Estabelecimento de Conexão

Esta seção descreve as opções que controlam como os programas Client estabelecem conexões com o Server. Para informações adicionais e exemplos mostrando como usá-las, consulte a Seção 4.2.4, “Conectando ao MySQL Server Usando Opções de Comando”.

**Tabela 4.4 Resumo das Opções de Estabelecimento de Conexão**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para estabelecer conexões com o server."><col style="width: 31%"/><col style="width: 56%"/><col style="width: 12%"/><thead><tr><th>Option Name</th> <th>Descrição</th> <th>Descontinuada</th> </tr></thead><tbody><tr><th>--default-auth</th> <td>Plugin de autenticação a ser usado</td> <td></td> </tr><tr><th>--host</th> <td>Host onde o MySQL server está localizado</td> <td></td> </tr><tr><th>--password</th> <td>Senha a ser usada ao conectar-se ao server</td> <td></td> </tr><tr><th>--pipe</th> <td>Conectar-se ao server usando named pipe (somente Windows)</td> <td></td> </tr><tr><th>--plugin-dir</th> <td>Diretório onde os Plugins estão instalados</td> <td></td> </tr><tr><th>--port</th> <td>Número da porta TCP/IP para conexão</td> <td></td> </tr><tr><th>--protocol</th> <td>Protocolo de transporte a ser usado</td> <td></td> </tr><tr><th>--secure-auth</th> <td>Não enviar senhas ao server no formato antigo (pré-4.1)</td> <td>Sim</td> </tr><tr><th>--shared-memory-base-name</th> <td>Nome da shared-memory para conexões de shared-memory (somente Windows)</td> <td></td> </tr><tr><th>--socket</th> <td>Arquivo Unix socket ou Windows named pipe a ser usado</td> <td></td> </tr><tr><th>--user</th> <td>Nome de usuário MySQL a ser usado ao conectar-se ao server</td> <td></td> </tr> </tbody></table>

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para default-auth"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Uma dica sobre qual Plugin de autenticação Client-side usar. Consulte a Seção 6.2.13, “Pluggable Authentication”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>localhost</code></td> </tr></tbody></table>

  O Host no qual o MySQL server está sendo executado. O valor pode ser um nome de Host, endereço IPv4 ou endereço IPv6. O valor default é `localhost`.

* `--password[=pass_val]`, `-p[pass_val]`

  <table frame="box" rules="all" summary="Propriedades para password"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--password[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  A senha da conta MySQL usada para conectar-se ao Server. O valor da senha é opcional. Se não for fornecido, o programa Client solicitará um. Se fornecido, não deve haver *nenhum espaço* entre `--password=` ou `-p` e a senha que o segue. Se nenhuma opção de senha for especificada, o default é não enviar senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 6.1.2.1, “Diretrizes para Usuários Finais sobre Segurança de Senha”.

  Para especificar explicitamente que não há senha e que o programa Client não deve solicitá-la, use a opção `--skip-password`.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Propriedades para pipe"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--pipe</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  No Windows, conecta-se ao Server usando um named pipe. Esta opção se aplica somente se o Server foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões named-pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para plugin-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--plugin-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do Diretório</td> </tr></tbody></table>

  O diretório no qual procurar por Plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um Plugin de autenticação, mas o programa Client não o encontrar. Consulte a Seção 6.2.13, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para port"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--port=port_num</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Padrão</th> <td><code>3306</code></td> </tr></tbody></table>

  Para conexões TCP/IP, o número da porta a ser usado. O número da porta default é 3306.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para protocol"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--protocol=type</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[see text]</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>TCP</code></p><p><code>SOCKET</code></p><p><code>PIPE</code></p><p><code>MEMORY</code></p></td> </tr></tbody></table>

  Esta opção especifica explicitamente qual Protocolo de transporte usar para conectar-se ao Server. É útil quando outros parâmetros de conexão normalmente resultam no uso de um Protocolo diferente do desejado. Por exemplo, as conexões no Unix para `localhost` são feitas usando um arquivo Unix socket por default:

  ```sql
  mysql --host=localhost
  ```

  Para forçar o uso do transporte TCP/IP, especifique a opção `--protocol`:

  ```sql
  mysql --host=localhost --protocol=TCP
  ```

  A tabela a seguir mostra os valores de opção `--protocol` permitidos e indica as plataformas aplicáveis para cada valor. Os valores não diferenciam maiúsculas de minúsculas (case-sensitive).

  <table summary="Valores de protocolo de transporte permitidos, o protocolo de transporte resultante usado e as plataformas aplicáveis para cada valor."><col style="width: 20%"/><col style="width: 50%"/><col style="width: 30%"/><thead><tr> <th>Valor do <code>--protocol</code></th> <th>Protocolo de Transporte Usado</th> <th>Plataformas Aplicáveis</th> </tr></thead><tbody><tr> <th><code>TCP</code></th> <td>Transporte TCP/IP para server local ou remoto</td> <td>Todas</td> </tr><tr> <th><code>SOCKET</code></th> <td>Transporte Unix socket-file para server local</td> <td>Sistemas Unix e similares a Unix</td> </tr><tr> <th><code>PIPE</code></th> <td>Transporte Named-pipe para server local</td> <td>Windows</td> </tr><tr> <th><code>MEMORY</code></th> <td>Transporte Shared-memory para server local</td> <td>Windows</td> </tr></tbody></table>

  Consulte também a Seção 4.2.5, “Connection Transport Protocols”

* `--secure-auth`

  <table frame="box" rules="all" summary="Propriedades para secure-auth"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--secure-auth</code></td> </tr><tr><th>Descontinuada</th> <td>Sim</td> </tr></tbody></table>

  Não enviar senhas ao Server no formato antigo (pré-4.1). Isso impede conexões, exceto para servers que usam o formato de senha mais recente.

  A partir do MySQL 5.7.5, esta opção está descontinuada; espere que ela seja removida em um futuro release do MySQL. Ela está sempre habilitada, e tentar desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um erro. Antes do MySQL 5.7.5, esta opção estava habilitada por default, mas podia ser desabilitada.

  Note

  As senhas que usam o método de hashing pré-4.1 são menos seguras do que as senhas que usam o método de hashing de senha nativo e devem ser evitadas. As senhas pré-4.1 estão descontinuadas e o suporte para elas foi removido no MySQL 5.7.5. Para instruções de upgrade de conta, consulte a Seção 6.4.1.3, “Migrando do Hashing de Senha Pré-4.1 e do Plugin mysql_old_password”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Propriedades para default-auth"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  No Windows, o nome da shared-memory a ser usado para conexões feitas usando shared memory para um server local. O valor default é `MYSQL`. O nome da shared-memory é case-sensitive.

  Esta opção se aplica somente se o Server foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões shared-memory.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Propriedades para default-auth"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  No Unix, o nome do arquivo Unix socket a ser usado para conexões feitas usando um named pipe para um server local. O nome default do arquivo Unix socket é `/tmp/mysql.sock`.

  No Windows, o nome do named pipe a ser usado para conexões com um server local. O nome default do pipe Windows é `MySQL`. O nome do pipe não diferencia maiúsculas de minúsculas (not case-sensitive).

  No Windows, esta opção se aplica somente se o Server foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões named-pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para default-auth"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O nome de usuário (user name) da conta MySQL a ser usado para conectar-se ao Server. O nome de usuário default é `ODBC` no Windows ou o seu nome de login Unix no Unix.

#### Opções de Comando para Conexões Criptografadas

Esta seção descreve as opções para programas Client que especificam se devem usar conexões criptografadas para o Server, os nomes dos arquivos de certificado e chave, e outros parâmetros relacionados ao suporte a conexões criptografadas. Para exemplos de uso sugerido e como verificar se uma conexão está criptografada, consulte a Seção 6.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”.

Note

Estas opções têm efeito apenas para conexões que usam um Protocolo de transporte sujeito à criptografia; ou seja, conexões TCP/IP e Unix socket-file. Consulte a Seção 4.2.5, “Connection Transport Protocols”

Para informações sobre o uso de conexões criptografadas a partir da C API do MySQL, consulte Suporte a Conexões Criptografadas.

**Tabela 4.5 Resumo das Opções de Criptografia de Conexão**

<table frame="box" rules="all" summary="Propriedades para default-auth"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Propriedades para default-auth"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Solicita ao Server a chave pública necessária para a troca de senha baseada no par de chaves RSA. Esta opção se aplica a Clients que se autenticam com o Plugin de autenticação `caching_sha2_password`. Para esse Plugin, o Server não envia a chave pública, a menos que seja solicitada. Esta opção é ignorada para contas que não se autenticam com esse Plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o Client se conecta ao Server usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para informações sobre o Plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Propriedades para default-auth"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O nome do caminho para um arquivo em formato PEM contendo uma cópia Client-side da chave pública exigida pelo Server para troca de senha baseada em par de chaves RSA. Esta opção se aplica a Clients que se autenticam com o Plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses Plugins. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o Client se conecta ao Server usando uma conexão segura.

  Esta opção está disponível apenas se o MySQL foi construído usando OpenSSL.

  Para informações sobre os Plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “SHA-256 Pluggable Authentication” e a Seção 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

* `--ssl`, `--skip-ssl`

  <table frame="box" rules="all" summary="Propriedades para default-auth"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  <table frame="box" rules="all" summary="Propriedades para default-auth"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Note

  A opção `--ssl` Client-side está descontinuada a partir do MySQL 5.7.11 e foi removida no MySQL 8.0. Para programas Client, use `--ssl-mode` em vez disso:

  + Use `--ssl-mode=REQUIRED` em vez de `--ssl=1` ou `--enable-ssl`.

  + Use `--ssl-mode=DISABLED` em vez de `--ssl=0`, `--skip-ssl` ou `--disable-ssl`.

  + Nenhuma opção `--ssl-mode` explícita é equivalente a nenhuma opção `--ssl` explícita.

  A opção `--ssl` Server-side *não* está descontinuada.

  Por default, os programas Client MySQL tentam estabelecer uma conexão criptografada se o Server suportar conexões criptografadas, com controle adicional disponível através da opção `--ssl`: A opção `--ssl` Client-side funciona da seguinte forma:

  + Na ausência de uma opção `--ssl`, os Clients tentam conectar usando criptografia, recorrendo a uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida.

  + A presença de uma opção `--ssl` explícita ou um sinônimo (`--ssl=1`, `--enable-ssl`) é prescritiva: Os Clients exigem uma conexão criptografada e falham se uma não puder ser estabelecida.

  + Com uma opção `--ssl=0` ou um sinônimo (`--skip-ssl`, `--disable-ssl`), os Clients usam uma conexão não criptografada.

  Para exigir o uso de conexões criptografadas por uma conta MySQL, use `CREATE USER` para criar a conta com uma cláusula `REQUIRE SSL`, ou use `ALTER USER` para uma conta existente para adicionar uma cláusula `REQUIRE SSL`. Isso faz com que as tentativas de conexão por Clients que usam a conta sejam rejeitadas, a menos que o MySQL suporte conexões criptografadas e uma conexão criptografada possa ser estabelecida.

  A cláusula `REQUIRE` permite outras opções relacionadas à criptografia, que podem ser usadas para impor requisitos de segurança mais rigorosos do que `REQUIRE SSL`. Para detalhes adicionais sobre quais opções de comando podem ou devem ser especificadas pelos Clients que se conectam usando contas configuradas com as várias opções `REQUIRE`, consulte Opções CREATE USER SSL/TLS.

  Para especificar parâmetros adicionais para conexões criptografadas, considere definir pelo menos as variáveis de sistema `ssl_cert` e `ssl_key` no lado do Server e a opção `--ssl-ca` no lado do Client. Consulte a Seção 6.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”, que também descreve os recursos do Server para autogeração e autodescoberta de arquivos de certificado e chave.

* `--ssl-ca=file_name`

  <table frame="box" rules="all" summary="Propriedades para default-auth"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O nome do caminho do arquivo de certificado da Certificate Authority (CA) no formato PEM. O arquivo contém uma lista de Certificate Authorities SSL confiáveis.

  Para instruir o Client a não autenticar o certificado do Server ao estabelecer uma conexão criptografada com o Server, não especifique nem `--ssl-ca` nem `--ssl-capath`. O Server ainda verifica o Client de acordo com quaisquer requisitos aplicáveis estabelecidos para a conta Client, e ainda usa quaisquer valores de variáveis de sistema `ssl_ca` ou `ssl_capath` especificados no lado do Server.

  Para especificar o arquivo CA para o Server, defina a variável de sistema `ssl_ca`.

* `--ssl-capath=dir_name`

  <table frame="box" rules="all" summary="Propriedades para default-auth"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O nome do caminho do diretório que contém arquivos de certificado da Certificate Authority (CA) SSL confiáveis no formato PEM. O suporte para esse recurso depende da biblioteca SSL usada para compilar o MySQL; consulte a Seção 6.3.4, “Capacidades Dependentes da Biblioteca SSL”.

  Para instruir o Client a não autenticar o certificado do Server ao estabelecer uma conexão criptografada com o Server, não especifique nem `--ssl-ca` nem `--ssl-capath`. O Server ainda verifica o Client de acordo com quaisquer requisitos aplicáveis estabelecidos para a conta Client, e ainda usa quaisquer valores de variáveis de sistema `ssl_ca` ou `ssl_capath` especificados no lado do Server.

  Para especificar o diretório CA para o Server, defina a variável de sistema `ssl_capath`.

* `--ssl-cert=file_name`

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>localhost</code></td> </tr></tbody></table>

  O nome do caminho do arquivo de certificado de chave pública SSL Client no formato PEM.

  Para especificar o arquivo de certificado de chave pública SSL Server, defina a variável de sistema `ssl_cert`.

* `--ssl-cipher=cipher_list`

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>localhost</code></td> </tr></tbody></table>

  A lista de ciphers permitidos para criptografia de conexão. Se nenhum cipher na lista for suportado, as conexões criptografadas não funcionarão.

  Para maior portabilidade, *`cipher_list`* deve ser uma lista de um ou mais nomes de cipher, separados por dois pontos. Este formato é entendido tanto por OpenSSL quanto por yaSSL. Exemplos:

  ```sql
  --ssl-cipher=AES128-SHA
  --ssl-cipher=DHE-RSA-AES128-GCM-SHA256:AES128-SHA
  ```

  OpenSSL suporta uma sintaxe mais flexível para especificar ciphers, conforme descrito na documentação OpenSSL em <https://www.openssl.org/docs/manmaster/man1/ciphers.html>. yaSSL não suporta, portanto, as tentativas de usar essa sintaxe estendida falharão para uma distribuição MySQL compilada usando yaSSL.

  Para informações sobre quais ciphers de criptografia o MySQL suporta, consulte a Seção 6.3.2, “Protocolos e Ciphers TLS de Conexão Criptografada”.

  Para especificar os ciphers de criptografia para o Server, defina a variável de sistema `ssl_cipher`.

* `--ssl-crl=file_name`

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>localhost</code></td> </tr></tbody></table>

  O nome do caminho do arquivo contendo listas de revogação de certificado (CRLs) no formato PEM. O suporte para o recurso de lista de revogação depende da biblioteca SSL usada para compilar o MySQL. Consulte a Seção 6.3.4, “Capacidades Dependentes da Biblioteca SSL”.

  Se nem `--ssl-crl` nem `--ssl-crlpath` for fornecido, nenhuma verificação de CRL será realizada, mesmo que o caminho CA contenha listas de revogação de certificado.

  Para especificar o arquivo de lista de revogação para o Server, defina a variável de sistema `ssl_crl`.

* `--ssl-crlpath=dir_name`

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>localhost</code></td> </tr></tbody></table>

  O nome do caminho do diretório que contém arquivos de lista de revogação de certificado no formato PEM. O suporte para o recurso de lista de revogação depende da biblioteca SSL usada para compilar o MySQL. Consulte a Seção 6.3.4, “Capacidades Dependentes da Biblioteca SSL”.

  Se nem `--ssl-crl` nem `--ssl-crlpath` for fornecido, nenhuma verificação de CRL será realizada, mesmo que o caminho CA contenha listas de revogação de certificado.

  Para especificar o diretório de lista de revogação para o Server, defina a variável de sistema `ssl_crlpath`.

* `--ssl-key=file_name`

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>localhost</code></td> </tr></tbody></table>

  O nome do caminho do arquivo de chave privada SSL Client no formato PEM. Para melhor segurança, use um certificado com um tamanho de chave RSA de pelo menos 2048 bits.

  Se o arquivo de chave estiver protegido por uma passphrase, o programa Client solicitará a passphrase ao usuário. A senha deve ser fornecida interativamente; ela não pode ser armazenada em um arquivo. Se a passphrase estiver incorreta, o programa continua como se não pudesse ler a chave.

  Para especificar o arquivo de chave privada SSL Server, defina a variável de sistema `ssl_key`.

* `--ssl-mode=mode`

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>localhost</code></td> </tr></tbody></table>

  Esta opção especifica o estado de segurança desejado da conexão com o Server. Os seguintes valores de modo são permitidos, em ordem crescente de rigor:

  + `DISABLED`: Estabelece uma conexão não criptografada. Isso é semelhante à opção legada `--ssl=0` ou seus sinônimos (`--skip-ssl`, `--disable-ssl`).

  + `PREFERRED`: Estabelece uma conexão criptografada se o Server suportar conexões criptografadas, recorrendo a uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Este é o default se `--ssl-mode` não for especificado.

    Conexões por arquivos Unix socket não são criptografadas com o modo `PREFERRED`. Para forçar a criptografia para conexões Unix socket-file, use o modo `REQUIRED` ou mais rigoroso. (No entanto, o transporte socket-file é seguro por default, então criptografar uma conexão socket-file não a torna mais segura e aumenta a carga da CPU.)

  + `REQUIRED`: Estabelece uma conexão criptografada se o Server suportar conexões criptografadas. A tentativa de conexão falha se uma conexão criptografada não puder ser estabelecida.

  + `VERIFY_CA`: Semelhante a `REQUIRED`, mas adicionalmente verifica o certificado da Certificate Authority (CA) do Server em relação aos certificados CA configurados. A tentativa de conexão falha se nenhum certificado CA válido correspondente for encontrado.

  + `VERIFY_IDENTITY`: Semelhante a `VERIFY_CA`, mas adicionalmente executa a verificação de identidade do Host, verificando o nome do Host que o Client usa para se conectar ao Server em relação à identidade no certificado que o Server envia ao Client:

    - A partir do MySQL 5.7.23, se o Client usar OpenSSL 1.0.2 ou superior, o Client verifica se o nome do Host que ele usa para conectar corresponde ao valor Subject Alternative Name ou ao valor Common Name no certificado do Server. A verificação de identidade do Host também funciona com certificados que especificam o Common Name usando wildcards.

    - Caso contrário, o Client verifica se o nome do Host que ele usa para conectar corresponde ao valor Common Name no certificado do Server.

    A conexão falha se houver uma incompatibilidade. Para conexões criptografadas, esta opção ajuda a prevenir ataques man-in-the-middle. Isso é semelhante à opção legada `--ssl-verify-server-cert`.

    Note

    A verificação de identidade do Host com `VERIFY_IDENTITY` não funciona com certificados autoassinados que são criados automaticamente pelo Server ou manualmente usando **mysql_ssl_rsa_setup** (consulte a Seção 6.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”). Tais certificados autoassinados não contêm o nome do Server como o valor Common Name.

  Important

  A configuração default, `--ssl-mode=PREFERRED`, produz uma conexão criptografada se outras configurações default não forem alteradas. No entanto, para ajudar a prevenir ataques sofisticados man-in-the-middle, é importante que o Client verifique a identidade do Server. As configurações `--ssl-mode=VERIFY_CA` e `--ssl-mode=VERIFY_IDENTITY` são uma escolha melhor do que a configuração default para ajudar a prevenir esse tipo de ataque. Para implementar uma dessas configurações, você deve primeiro garantir que o certificado CA para o Server esteja confiavelmente disponível para todos os Clients que o usam em seu ambiente, caso contrário, problemas de disponibilidade resultarão. Por este motivo, elas não são a configuração default.

  A opção `--ssl-mode` interage com as opções de certificado CA da seguinte forma:

  + Se `--ssl-mode` não for explicitamente definido de outra forma, o uso de `--ssl-ca` ou `--ssl-capath` implica `--ssl-mode=VERIFY_CA`.

  + Para valores `--ssl-mode` de `VERIFY_CA` ou `VERIFY_IDENTITY`, `--ssl-ca` ou `--ssl-capath` também é obrigatório, para fornecer um certificado CA que corresponda ao usado pelo Server.

  + Uma opção `--ssl-mode` explícita com um valor diferente de `VERIFY_CA` ou `VERIFY_IDENTITY`, juntamente com uma opção `--ssl-ca` ou `--ssl-capath` explícita, produz um aviso de que nenhuma verificação do certificado do Server é realizada, apesar de uma opção de certificado CA ter sido especificada.

  A opção `--ssl-mode` foi adicionada no MySQL 5.7.11.

  Para exigir o uso de conexões criptografadas por uma conta MySQL, use `CREATE USER` para criar a conta com uma cláusula `REQUIRE SSL`, ou use `ALTER USER` para uma conta existente para adicionar uma cláusula `REQUIRE SSL`. Isso faz com que as tentativas de conexão por Clients que usam a conta sejam rejeitadas, a menos que o MySQL suporte conexões criptografadas e uma conexão criptografada possa ser estabelecida.

  A cláusula `REQUIRE` permite outras opções relacionadas à criptografia, que podem ser usadas para impor requisitos de segurança mais rigorosos do que `REQUIRE SSL`. Para detalhes adicionais sobre quais opções de comando podem ou devem ser especificadas pelos Clients que se conectam usando contas configuradas com as várias opções `REQUIRE`, consulte Opções CREATE USER SSL/TLS.

* `--ssl-verify-server-cert`

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>localhost</code></td> </tr></tbody></table>

  Note

  A opção `--ssl-verify-server-cert` está descontinuada a partir do MySQL 5.7.11 e foi removida no MySQL 8.0. Use `--ssl-mode=VERIFY_IDENTITY` em vez disso.

  Esta opção faz com que o Client execute a verificação de identidade do Host, verificando o nome do Host que o Client usa para se conectar ao Server em relação à identidade no certificado que o Server envia ao Client:

  + A partir do MySQL 5.7.23, se o Client usar OpenSSL 1.0.2 ou superior, o Client verifica se o nome do Host que ele usa para conectar corresponde ao valor Subject Alternative Name ou ao valor Common Name no certificado do Server.

  + Caso contrário, o Client verifica se o nome do Host que ele usa para conectar corresponde ao valor Common Name no certificado do Server.

  A conexão falha se houver uma incompatibilidade. Para conexões criptografadas, esta opção ajuda a prevenir ataques man-in-the-middle. A verificação de identidade do Host é desabilitada por default.

  Note

  A verificação de identidade do Host não funciona com certificados autoassinados criados automaticamente pelo Server, ou manualmente usando **mysql_ssl_rsa_setup** (consulte a Seção 6.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”). Tais certificados autoassinados não contêm o nome do Server como o valor Common Name.

  A verificação de identidade do Host também não funciona com certificados que especificam o Common Name usando wildcards porque esse nome é comparado literalmente ao nome do Server.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>localhost</code></td> </tr></tbody></table>

  Esta opção especifica os protocolos TLS que o Client permite para conexões criptografadas. O valor é uma lista de uma ou mais versões de protocolo separadas por vírgulas. Por exemplo:

  ```sql
  mysql --tls-version="TLSv1.1,TLSv1.2"
  ```

  Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Os protocolos permitidos devem ser escolhidos de forma a não deixar "buracos" (holes) na lista. Por exemplo, estes valores não têm buracos:

  ```sql
  --tls-version="TLSv1,TLSv1.1,TLSv1.2"
  --tls-version="TLSv1.1,TLSv1.2"
  --tls-version="TLSv1.2"
  ```

  Este valor tem um buraco e não deve ser usado:

  ```sql
  --tls-version="TLSv1,TLSv1.2"
  ```

  Para detalhes, consulte a Seção 6.3.2, “Protocolos e Ciphers TLS de Conexão Criptografada”.

  Esta opção foi adicionada no MySQL 5.7.10.

  Para especificar quais protocolos TLS o Server permite, defina a variável de sistema `tls_version`.
