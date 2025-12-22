### 6.2.3 Opções de comando para conexão com o servidor

Esta seção descreve as opções suportadas pela maioria dos programas cliente MySQL que controlam como os programas cliente estabelecem conexões com o servidor, se as conexões são criptografadas e se as conexões são compactadas.

- Opções de comando para estabelecimento de conexão
- Opções de comando para conexões criptografadas
- Opções de comando para compressão de conexão

#### Opções de comando para estabelecimento de conexão

Esta seção descreve as opções que controlam como os programas cliente estabelecem conexões com o servidor. Para informações adicionais e exemplos mostrando como usá-las, veja a Seção 6.2.4, "Conectando-se ao Servidor MySQL Usando Opções de Comando".

**Tabela 6.4 Resumo da opção de estabelecimento de ligação**

<table><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td>--default-auth</td> <td>Plugin de autenticação a usar</td> </tr><tr><td>- Hospedeiro</td> <td>Host em que o servidor MySQL está localizado</td> </tr><tr><td>--senha</td> <td>Senha para usar quando se conectar ao servidor</td> </tr><tr><td>- Senha 1</td> <td>Primeira senha de autenticação multifator a usar ao se conectar ao servidor</td> </tr><tr><td>- Senha 2</td> <td>Segunda senha de autenticação multifator a usar ao se conectar ao servidor</td> </tr><tr><td>- Senha 3</td> <td>Terceira senha de autenticação multifator a utilizar quando se conectar ao servidor</td> </tr><tr><td>- Tubo.</td> <td>Conectar-se ao servidor usando o nome do tubo (somente Windows)</td> </tr><tr><td>--plugin-dir</td> <td>Diretório onde os plugins estão instalados</td> </tr><tr><td>- Porto</td> <td>Número de porta TCP/IP para conexão</td> </tr><tr><td>- Protocolo</td> <td>Protocolo de transporte a utilizar</td> </tr><tr><td>--shared-memory-base-name</td> <td>Nome de memória partilhada para conexões de memória partilhada (somente Windows)</td> </tr><tr><td>- Soquete</td> <td>Arquivo de soquete do Unix ou tubo nomeado do Windows para usar</td> </tr><tr><td>-- utilizador</td> <td>Nome do usuário do MySQL para usar quando se conectar ao servidor</td> </tr></tbody></table>

- `--default-auth=plugin`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Uma dica sobre qual plugin de autenticação do lado do cliente usar.

- `--host=host_name`, `-h host_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--host=host_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>localhost</code>]]</td> </tr></tbody></table>

O host em que o servidor MySQL está sendo executado. O valor pode ser um nome de host, endereço IPv4 ou endereço IPv6. O valor padrão é `localhost`.

- `--password[=pass_val]`, `-p[pass_val]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--password[=passwor<code>[none]</code></code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o programa cliente solicita um. Se for fornecido, deve haver \* nenhum espaço \* entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar senha.

A especificação de uma senha na linha de comando deve ser considerada insegura. Para evitar a indicação da senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, "Diretrizes do Usuário Final para a Segurança de Senhas".

Para especificar explicitamente que não há senha e que o programa cliente não deve solicitar uma, use a opção `--skip-password`.

- `--password1[=pass_val]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--password1[=password]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o programa cliente solicita um. Se for fornecido, deve haver \* nenhum espaço \* entre `--password1=` e a senha seguinte. Se nenhuma opção de senha for especificada, o padrão é não enviar senha.

A especificação de uma senha na linha de comando deve ser considerada insegura. Para evitar a indicação da senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, "Diretrizes do Usuário Final para a Segurança de Senhas".

Para especificar explicitamente que não há senha e que o programa cliente não deve solicitar uma, use a opção `--skip-password1`.

`--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

- `--password2[=pass_val]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--password2[=password]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica de `--password1`; veja a descrição dessa opção para detalhes.

- `--password3[=pass_val]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--password3[=password]</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

A senha para o fator de autenticação multifator 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; veja a descrição dessa opção para detalhes.

- `--pipe`, `-W`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--pipe</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

No Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção se aplica apenas se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de tubo nomeado. Além disso, o usuário que faz a conexão deve ser um membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--plugin-dir=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--plugin-dir=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

O diretório no qual procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o programa cliente não o encontrar. Veja Seção 8.2.17, Autenticação Pluggable.

- `--port=port_num`, `-P port_num`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--port=port_num</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>3306</code>]]</td> </tr></tbody></table>

Para conexões TCP/IP, o número de porta a utilizar. O número de porta padrão é 3306.

- `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--protocol=type</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>[see tex<code>TCP</code></code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>TCP</code>]]</p><p class="valid-value">[[<code>SOCKET</code>]]</p><p class="valid-value">[[<code>PIPE</code>]]</p><p class="valid-value">[[<code>MEMORY</code>]]</p></td> </tr></tbody></table>

Esta opção especifica explicitamente qual protocolo de transporte usar para se conectar ao servidor. É útil quando outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Por exemplo, conexões no Unix para `localhost` são feitas usando um arquivo de soquete Unix por padrão:

```
mysql --host=localhost
```

Para forçar o transporte TCP/IP a ser usado, especifique uma opção `--protocol`:

```
mysql --host=localhost --protocol=TCP
```

A tabela a seguir mostra os valores de opção `--protocol` permitidos e indica as plataformas aplicáveis para cada valor.

  <table><col style="width: 20%"/><col style="width: 50%"/><col style="width: 30%"/><thead><tr> <th scope="col">[<code class="option">--protocol</code>] Valor</th> <th scope="col">Protocolo de transporte utilizado</th> <th scope="col">Plataformas aplicáveis</th> </tr></thead><tbody><tr> <th>[[<code>TCP</code>]]</th> <td>Transporte TCP/IP para servidor local ou remoto</td> <td>Todos</td> </tr><tr> <th>[[<code>SOCKET</code>]]</th> <td>Transporte de ficheiro de soquete Unix para servidor local</td> <td>Unix e sistemas semelhantes a Unix</td> </tr><tr> <th>[[<code>PIPE</code>]]</th> <td>Transporte de tubos nomeados para servidor local</td> <td>Vidros</td> </tr><tr> <th>[[<code>MEMORY</code>]]</th> <td>Transporte de memória partilhada para servidor local</td> <td>Vidros</td> </tr></tbody></table>

Ver também a secção 6.2.7, "Protocolos de transporte de ligação"

- `--shared-memory-base-name=name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--shared-memory-base-name=name</code>]]</td> </tr><tr><th>Específicos da plataforma</th> <td>Vidros</td> </tr></tbody></table>

No Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada para um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúscula e minúscula.

Esta opção aplica-se apenas se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

- `--socket=path`, `-S path`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--socket={file_name|pipe_name}</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

Em Unix, o nome do arquivo de soquete Unix para usar para conexões feitas usando um tubo nomeado para um servidor local. O nome do arquivo de soquete Unix padrão é `/tmp/mysql.sock`.

No Windows, o nome do tubo nomeado para usar para conexões com um servidor local. O nome do tubo padrão do Windows é `MySQL`. O nome do tubo não é sensível a maiúsculas e minúsculas.

No Windows, essa opção se aplica apenas se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de name-pipe. Além disso, o usuário que faz a conexão deve ser um membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--user=user_name`, `-u user_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--user=user_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

O nome de usuário da conta MySQL para usar para se conectar ao servidor. O nome de usuário padrão é `ODBC` no Windows ou seu nome de login no Unix.

#### Opções de comando para conexões criptografadas

Esta seção descreve opções para programas cliente que especificam se usar conexões criptografadas para o servidor, os nomes de arquivos de certificado e chave e outros parâmetros relacionados ao suporte de conexão criptografada. Para exemplos de uso sugerido e como verificar se uma conexão é criptografada, consulte a Seção 8.3.1, "Configurando o MySQL para usar conexões criptografadas".

::: info Note

Estas opções têm efeito apenas para conexões que utilizam um protocolo de transporte sujeito a encriptação, isto é, conexões TCP/IP e de ficheiros de soquete Unix. Ver Secção 6.2.7, "Protocolos de transporte de conexão".

:::

Para informações sobre o uso de conexões criptografadas a partir da API C do MySQL, consulte Suporte para conexões criptografadas.

**Tabela 6.5 Resumo da opção de encriptação de conexão**

<table><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td>--get-server-public-key</td> <td>Solicitar a chave pública RSA do servidor</td> </tr><tr><td>--server-chave pública-caminho</td> <td>Nome do caminho para o ficheiro que contém a chave pública RSA</td> </tr><tr><td>- O quê?</td> <td>Arquivo que contém lista de autoridades de certificação SSL confiáveis</td> </tr><tr><td>--ssl-capath</td> <td>Diretório que contém ficheiros de certificados SSL confiáveis</td> </tr><tr><td>--ssl-cert</td> <td>Arquivo que contém o certificado X.509</td> </tr><tr><td>--SSL-cifrado</td> <td>Códigos permitidos para a encriptação da ligação</td> </tr><tr><td>--ssl-crl</td> <td>Arquivo que contém listas de revogação de certificados</td> </tr><tr><td>--ssl-crlpath</td> <td>Diretório que contém ficheiros de lista de revogação de certificado</td> </tr><tr><td>--ssl-fips-modo</td> <td>Ativar o modo FIPS do lado do cliente</td> </tr><tr><td>--ssl-chave</td> <td>Arquivo que contém a chave X.509</td> </tr><tr><td>- Modo SSL</td> <td>Estado de segurança desejado da ligação ao servidor</td> </tr><tr><td>--ssl-data-de-sessão</td> <td>Arquivo que contém dados de sessão SSL</td> </tr><tr><td>--ssl-session-data-continue-on-failed-reuse</td> <td>Estabelecer conexões se a reutilização da sessão falhar</td> </tr><tr><td>--tls-ciphersuites</td> <td>Suítes de encriptação TLSv1.3 permitidas para conexões criptografadas</td> </tr><tr><td>- Versão TLS</td> <td>Protocolos TLS admissíveis para ligações encriptadas</td> </tr></tbody></table>

- `--get-server-public-key`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--get-server-public-key</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr></tbody></table>

Solicitar do servidor a chave pública necessária para a troca de senhas baseada em pares de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senhas baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` é dado e especifica um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para obter informações sobre o plug-in `caching_sha2_password`, consulte a Seção 8.4.1.2, Caching SHA-2 Pluggable Authentication.

- `--server-public-key-path=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--server-public-key-path=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

O nome do caminho para um arquivo no formato PEM contendo uma cópia do lado do cliente da chave pública exigida pelo servidor para troca de senhas baseada em pares de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plug-in de autenticação `sha256_password` (obsoleto) ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plug-ins. Também é ignorada se a troca de senhas baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` é dado e especifica um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Esta opção está disponível apenas se o MySQL foi construído usando OpenSSL.

Para obter informações sobre os plugins `sha256_password` (obsoleto) e `caching_sha2_password`, consulte a Seção 8.4.1.3, SHA-256 Pluggable Authentication, e a Seção 8.4.1.2, Caching SHA-2 Pluggable Authentication.

- `--ssl-ca=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl-ca=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

Nome do caminho para o ficheiro de certificado da autoridade de certificação (CA) no formato PEM. O ficheiro contém uma lista de autoridades de certificação SSL de confiança.

Para dizer ao cliente para não autenticar o certificado do servidor ao estabelecer uma conexão criptografada com o servidor, especifique nem `--ssl-ca` nem `--ssl-capath`. O servidor ainda verifica o cliente de acordo com quaisquer requisitos aplicáveis estabelecidos para a conta do cliente, e ainda usa quaisquer valores de variáveis do sistema `ssl_ca` ou `ssl_capath` especificados no lado do servidor.

Para especificar o arquivo CA para o servidor, defina a variável de sistema `ssl_ca`.

- `--ssl-capath=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl-capath=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

Nome do caminho do diretório que contém ficheiros de certificado de autoridade de certificação SSL (CA) confiáveis no formato PEM.

Para dizer ao cliente para não autenticar o certificado do servidor ao estabelecer uma conexão criptografada com o servidor, especifique nem `--ssl-ca` nem `--ssl-capath`. O servidor ainda verifica o cliente de acordo com quaisquer requisitos aplicáveis estabelecidos para a conta do cliente, e ainda usa quaisquer valores de variáveis do sistema `ssl_ca` ou `ssl_capath` especificados no lado do servidor.

Para especificar o diretório CA para o servidor, defina a variável de sistema `ssl_capath`.

- `--ssl-cert=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl-cert=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

O nome do caminho do ficheiro de certificado de chave pública do cliente SSL no formato PEM. Os certificados SSL em cadeia são suportados.

Para especificar o arquivo de certificado de chave pública do servidor SSL, defina a variável de sistema `ssl_cert`.

- `--ssl-cipher=cipher_list`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl-cipher=name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr></tbody></table>

A lista de códigos de criptografia permitidos para conexões que usam TLSv1.2. Se nenhuma cifra na lista for suportada, as conexões criptografadas que usam esses protocolos TLS não funcionam.

Para maior portabilidade, `cipher_list` deve ser uma lista de um ou mais nomes de código, separados por dois pontos.

```
--ssl-cipher=AES128-SHA
--ssl-cipher=DHE-RSA-AES128-GCM-SHA256:AES128-SHA
```

O OpenSSL suporta a sintaxe para especificar as cifras descritas na documentação do OpenSSL em \[<https://www.openssl.org/docs/manmaster/man1/ciphers.html>]

Para obter informações sobre quais criptografias o MySQL suporta, consulte a Seção 8.3.2, Encrypted Connection TLS Protocols and Ciphers.

Para especificar as cifras de criptografia para o servidor, defina a variável de sistema `ssl_cipher`.

- `--ssl-crl=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl-crl=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

Nome do caminho do ficheiro que contém listas de revogação de certificados no formato PEM.

Se não for indicado nem o `--ssl-crl` nem o `--ssl-crlpath`, não são efectuadas verificações do LCR, mesmo que o caminho CA contenha listas de revogação de certificados.

Para especificar o arquivo de lista de revogação para o servidor, defina a variável de sistema `ssl_crl`.

- `--ssl-crlpath=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl-crlpath=dir_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do diretório</td> </tr></tbody></table>

Nome do caminho do diretório que contém ficheiros de lista de revogação de certificados no formato PEM.

Se não for indicado nem o `--ssl-crl` nem o `--ssl-crlpath`, não são efectuadas verificações do LCR, mesmo que o caminho CA contenha listas de revogação de certificados.

Para especificar o diretório de lista de revogação para o servidor, defina a variável de sistema `ssl_crlpath`.

- `--ssl-fips-mode={OFF|ON|STRICT}`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl-fips-mode={OFF|ON|STRICT}</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>STRICT</code>]]</p></td> </tr></tbody></table>

Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere das outras opções `--ssl-xxx` na medida em que não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Veja Seção 8.8, Suporte FIPS.

São permitidos os seguintes valores de \[`--ssl-fips-mode`]:

- `OFF`: Desativar o modo FIPS.
- `ON`: Ativar o modo FIPS.
- `STRICT`: Ativar o modo FIPS strict.

::: info Note

Se o módulo de objeto FIPS do OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Neste caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza um aviso na inicialização e funcione no modo não-FIPS.

:::

Para especificar o modo FIPS para o servidor, defina a variável de sistema `ssl_fips_mode`.

- `--ssl-key=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl-key=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

O nome do caminho do ficheiro de chave privada SSL do cliente no formato PEM. Para uma melhor segurança, use um certificado com um tamanho de chave RSA de pelo menos 2048 bits.

Se o arquivo de chave for protegido por uma senha, o programa cliente solicita ao usuário a senha. A senha deve ser dada interativamente; ela não pode ser armazenada em um arquivo. Se a senha for incorreta, o programa continua como se não pudesse ler a chave.

Para especificar o arquivo de chave privada do servidor SSL, defina a variável de sistema `ssl_key`.

- `--ssl-mode=mode`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl-mode=mode</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>PREFERRED</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>DISABLED</code>]]</p><p class="valid-value">[[<code>PREFERRED</code>]]</p><p class="valid-value">[[<code>REQUIRED</code>]]</p><p class="valid-value">[[<code>VERIFY_CA</code>]]</p><p class="valid-value">[[<code>VERIFY_IDENTITY</code>]]</p></td> </tr></tbody></table>

Esta opção especifica o estado de segurança desejado da conexão com o servidor.

- `DISABLED`: Estabelecer uma conexão não criptografada.
- `PREFERRED`: Estabeleça uma conexão criptografada se o servidor suportar conexões criptografadas, voltando a uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Este é o padrão se `--ssl-mode` não for especificado.

  Conexões através de arquivos de socket Unix não são criptografadas com um modo de `PREFERRED`. Para reforçar a criptografia para conexões de arquivo de socket Unix, use um modo de `REQUIRED` ou mais rigoroso. (No entanto, o transporte de arquivo de socket é seguro por padrão, então criptografar uma conexão de arquivo de socket não torna mais segura e aumenta a carga da CPU.)
- `REQUIRED`: Estabelecer uma conexão criptografada se o servidor suportar conexões criptografadas. A tentativa de conexão falha se uma conexão criptografada não puder ser estabelecida.
- `VERIFY_CA`: Como `REQUIRED`, mas verifique adicionalmente o certificado da Autoridade de Certificação (CA) do servidor contra os certificados CA configurados. A tentativa de conexão falha se não forem encontrados certificados CA correspondentes válidos.
- `VERIFY_IDENTITY`: Como `VERIFY_CA`, mas, adicionalmente, execute a verificação de identidade do nome do host, verificando o nome do host usado pelo cliente para se conectar ao servidor com a identidade no certificado que o servidor envia ao cliente:

  - Se o cliente usa o OpenSSL 1.0.2 ou superior, o cliente verifica se o nome do host que ele usa para se conectar corresponde ao valor do Nome Alternativo do Sujeto ou ao valor do Nome Comum no certificado do servidor. A verificação de identidade do nome do host também funciona com certificados que especificam o Nome Comum usando wildcards.
  - Caso contrário, o cliente verifica se o nome de host que ele usa para se conectar corresponde ao valor Common Name no certificado do servidor.

  A conexão falha se houver uma incompatibilidade. Para conexões criptografadas, esta opção ajuda a evitar ataques de homem-no-meio.

  ::: info Note

  A verificação da identidade do nome do host com `VERIFY_IDENTITY` não funciona com certificados auto-assinados que são criados automaticamente pelo servidor (ver Seção 8.3.3.1, Criação de certificados e chaves SSL e RSA usando MySQL).

  :::

Importância

A configuração padrão, `--ssl-mode=PREFERRED`, produz uma conexão criptografada se as outras configurações padrão não forem alteradas. No entanto, para ajudar a evitar ataques sofisticados de man-in-the-middle, é importante que o cliente verifique a identidade do servidor. As configurações `--ssl-mode=VERIFY_CA` e `--ssl-mode=VERIFY_IDENTITY` são uma escolha melhor do que a configuração padrão para ajudar a evitar esse tipo de ataque. Para implementar uma dessas configurações, você deve primeiro garantir que o certificado CA para o servidor esteja disponível de forma confiável para todos os clientes que o usam em seu ambiente, caso contrário, problemas de disponibilidade resultarão. Por esta razão, elas não são a configuração padrão.

A opção `--ssl-mode` interage com as opções de certificado de CA da seguinte forma:

- Se `--ssl-mode` não for explicitamente definido de outra forma, o uso de `--ssl-ca` ou `--ssl-capath` implica `--ssl-mode=VERIFY_CA`.
- Para `--ssl-mode` valores de `VERIFY_CA` ou `VERIFY_IDENTITY`, `--ssl-ca` ou `--ssl-capath` também é necessário, para fornecer um certificado CA que corresponda ao usado pelo servidor.
- Uma opção explícita `--ssl-mode` com um valor diferente de `VERIFY_CA` ou `VERIFY_IDENTITY`, juntamente com uma opção explícita `--ssl-ca` ou `--ssl-capath`, produz um aviso de que nenhuma verificação do certificado do servidor é realizada, apesar de uma opção de certificado de CA ser especificada.

Para exigir o uso de conexões criptografadas por uma conta MySQL, use `CREATE USER` para criar a conta com uma cláusula `REQUIRE SSL`, ou use `ALTER USER` para uma conta existente para adicionar uma cláusula `REQUIRE SSL`. Isso faz com que as tentativas de conexão por clientes que usam a conta sejam rejeitadas, a menos que o MySQL suporte conexões criptografadas e uma conexão criptografada possa ser estabelecida.

A cláusula `REQUIRE` permite outras opções relacionadas à criptografia, que podem ser usadas para impor requisitos de segurança mais rigorosos do que `REQUIRE SSL`.

- `--ssl-session-data=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl-session-data=file_name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr></tbody></table>

O nome do caminho do ficheiro de dados de sessão SSL do cliente no formato PEM para reutilização de sessão.

Quando você invoca um programa cliente MySQL com a `--ssl-session-data` opção, o cliente tenta deserializar dados de sessão do arquivo, se fornecido, e depois usá-lo para estabelecer uma nova conexão. Se você fornecer um arquivo, mas a sessão não é reutilizada, então a conexão falha a menos que você também tenha especificado a `--ssl-session-data-continue-on-failed-reuse` opção na linha de comando quando você invocou o programa cliente.

O comando `mysql`, `ssl_session_data_print`, gera o arquivo de dados de sessão (ver Seção 6.5.1.2, Comandos do Cliente Mysql).

- `ssl-session-data-continue-on-failed-reuse`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ssl-session-data-continue-on-failed-reuse</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Controla se uma nova conexão é iniciada para substituir uma tentativa de conexão que tentou, mas não conseguiu reutilizar os dados da sessão especificados com a opção de linha de comando `--ssl-session-data`. Por padrão, a opção de linha de comando `--ssl-session-data-continue-on-failed-reuse` está desativada, o que faz com que um programa cliente retorne uma falha de conexão quando os dados da sessão são fornecidos e não reutilizados.

Para garantir que uma nova conexão não relacionada seja aberta após a reutilização da sessão falhar silenciosamente, invoque os programas do cliente MySQL com as opções de linha de comando `--ssl-session-data` e `--ssl-session-data-continue-on-failed-reuse`.

- `--tls-ciphersuites=ciphersuite_list`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tls-ciphersuites=ciphersuite_list</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>empty string</code>]]</td> </tr></tbody></table>

Esta opção especifica que ciphersuites o cliente permite para conexões criptografadas que usam TLSv1.3. O valor é uma lista de zero ou mais nomes de ciphersuite separados por pontos. Por exemplo:

```
mysql --tls-ciphersuites="suite1:suite2:suite3"
```

Os ciphersuites que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Se esta opção não for definida, o cliente permitirá o conjunto padrão de ciphersuites. Se a opção for definida para a string vazia, nenhum ciphersuites será habilitado e conexões criptografadas não poderão ser estabelecidas. Para mais informações, consulte a Seção 8.3.2, Encrypted Connection TLS Protocols and Ciphers.

Para especificar quais suítes de criptografia o servidor permite, defina a variável de sistema `tls_ciphersuites`.

- `--tls-version=protocol_list`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tls-version=protocol_list</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td><p class="valid-value">[[<code>TLSv1,TLSv1.1,TLSv1.2,TLSv1.3</code>]] (OpenSSL 1.1.1 ou superior)</p><p class="valid-value">[[<code>TLSv1,TLSv1.1,TLSv1.2</code>]] (caso contrário)</p></td> </tr></tbody></table>

Esta opção especifica os protocolos TLS que o cliente permite para conexões criptografadas. O valor é uma lista de uma ou mais versões de protocolo separadas por vírgula. Por exemplo:

```
mysql --tls-version="TLSv1.2,TLSv1.3"
```

Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL e da versão do MySQL Server.

Importância

- Clientes, incluindo o MySQL Shell, que suportam a opção `--tls-version` não podem fazer uma conexão TLS/SSL com o protocolo definido para TLSv1 ou TLSv1.1. Se um cliente tentar se conectar usando esses protocolos, para conexões TCP, a conexão falha e um erro é retornado ao cliente. Para conexões de soquete, se `--ssl-mode` é definido para `REQUIRED`, a conexão falha, caso contrário a conexão é feita, mas com o TLS/SSL desativado. Veja a remoção do suporte para os protocolos TLSv1 e TLSv1.1 para mais informações.
- O suporte para o protocolo TLSv1.3 está disponível no MySQL Server, desde que o MySQL Server tenha sido compilado usando o OpenSSL 1.1.1 ou superior. O servidor verifica a versão do OpenSSL na inicialização e, se for inferior a 1.1.1, o TLSv1.3 é removido do valor padrão para as variáveis do sistema do servidor relacionadas à versão TLS (como a variável do sistema `tls_version`).

Os protocolos permitidos devem ser escolhidos de modo a não deixar "buracos" na lista.

```
--tls-version="TLSv1.2,TLSv1.3"
--tls-version="TLSv1.3"
```

Para mais pormenores, ver Secção 8.3.2, "Protocolos e cifras TLS de conexão criptografada".

Para especificar quais protocolos TLS o servidor permite, defina a variável de sistema `tls_version`.

#### Opções de comando para compressão de conexão

Esta secção descreve as opções que permitem aos programas cliente controlar o uso da compressão para conexões com o servidor.

**Tabela 6.6 Resumo da opção de ligação-compressão**

<table><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td>--comprimir</td> <td>Comprimir todas as informações enviadas entre o cliente e o servidor</td> </tr><tr><td>Algoritmos de compressão</td> <td>Algoritmos de compressão permitidos para ligações ao servidor</td> </tr><tr><td>--zstd-nível de compressão</td> <td>Nível de compressão para conexões com servidor que usam compressão zstd</td> </tr></tbody></table>

- `--compress`, `-C`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--compress[={OFF|ON}]</code>]]</td> </tr><tr><th>Depreciado</th> <td>Sim , sim .</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

Comprime todas as informações enviadas entre o cliente e o servidor, se possível.

Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL. Veja Configurar a Compressão de Conexão Legada.

- `--compression-algorithms=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--compression-algorithms=value</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Conjunto</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>uncompressed</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>zlib</code>]]</p><p class="valid-value">[[<code>zstd</code>]]</p><p class="valid-value">[[<code>uncompressed</code>]]</p></td> </tr></tbody></table>

Os algoritmos de compressão permitidos para conexões com o servidor. Os algoritmos disponíveis são os mesmos que para a variável do sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

- `--zstd-compression-level=level`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--zstd-compression-level=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr></tbody></table>

O nível de compressão a usar para conexões com o servidor que usam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão `zstd` padrão é 3. A configuração do nível de compressão não tem efeito em conexões que não usam a compressão `zstd`.
