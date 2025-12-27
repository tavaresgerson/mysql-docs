### 6.2.3 Opções de Comando para Conectar ao Servidor

Esta seção descreve as opções suportadas pela maioria dos programas clientes MySQL que controlam como os programas clientes estabelecem conexões com o servidor, se as conexões são criptografadas e se as conexões são comprimidas. Essas opções podem ser fornecidas na linha de comando ou em um arquivo de opções.

*  Opções de Comando para Estabelecimento de Conexão
*  Opções de Comando para Conexões Criptografadas
*  Opções de Comando para Compressão de Conexão

#### Opções de Comando para Estabelecimento de Conexão

Esta seção descreve opções que controlam como os programas clientes estabelecem conexões com o servidor. Para obter informações adicionais e exemplos de como usá-las, consulte a Seção 6.2.4, “Conectando ao Servidor MySQL Usando Opções de Comando”.

**Tabela 6.4 Resumo das Opções de Estabelecimento de Conexão**

<table><thead><tr><th>Nome da Opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>--default-auth</code></td> <td>Plugin de autenticação a ser usado</td> </tr><tr><td><code>--host</code></td> <td>Host em que o servidor MySQL está localizado</td> </tr><tr><td><code>--password</code></td> <td>Senha a ser usada ao se conectar ao servidor</td> </tr><tr><td><code>--password1</code></td> <td>Primeira senha de autenticação multifator a ser usada ao se conectar ao servidor</td> </tr><tr><td><code>--password2</code></td> <td>Segunda senha de autenticação multifator a ser usada ao se conectar ao servidor</td> </tr><tr><td><code>--password3</code></td> <td>Terceira senha de autenticação multifator a ser usada ao se conectar ao servidor</td> </tr><tr><td><code>--pipe</code></td> <td>Conectar ao servidor usando um pipe nomeado (apenas Windows)</td> </tr><tr><td><code>--plugin-dir</code></td> <td>Diretório onde os plugins são instalados</td> </tr><tr><td><code>--port</code></td> <td>Número de porta TCP/IP para a conexão</td> </tr><tr><td><code>--protocol</code></td> <td>Protocolo de transporte a ser usado</td> </tr><tr><td><code>--shared-memory-base-name</code></td> <td>Nome da memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> </tr><tr><td><code>--socket</code></td> <td>Arquivo de socket Unix ou pipe nomeado (apenas Windows) a ser usado</td> </tr><tr><td><code>--user</code></td> <td>Nome do usuário MySQL a ser usado ao se conectar ao servidor</td> </tr></tbody></table>

*  `--default-auth=plugin`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Consulte  Seção 8.2.17, “Autenticação Personalizável”.

*  `--host=host_name`, `-h host_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>localhost</code></td> </tr></tbody></table>

O host em que o servidor MySQL está sendo executado. O valor pode ser um nome de host, endereço IPv4 ou endereço IPv6. O valor padrão é `localhost`.
*  `--password[=pass_val]`, `-p[pass_val]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--password[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o programa cliente solicitará uma senha. Se fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.

  Para especificar explicitamente que não há senha e que o programa cliente não deve solicitar uma, use a opção `--skip-password`.
*  `--password1[=pass_val]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--password1[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o programa cliente solicitará uma. Se fornecida, não deve haver *espaço* entre `--password1=` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.

  Para especificar explicitamente que não há senha e que o programa cliente não deve solicitar uma, use a opção `--skip-password1`.

`--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.
*  `--password2[=pass_val]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--password2[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica da opção `--password1`; consulte a descrição dessa opção para obter detalhes.
*  `--password3[=pass_val]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--password3[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A senha para o fator de autenticação multifator 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica da opção `--password1`; consulte a descrição dessa opção para obter detalhes.
*  `--pipe`, `-W`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--pipe</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Em Windows, conecte-se ao servidor usando um pipe nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.
*  `--plugin-dir=dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--plugin-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr></tbody></table>

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o programa cliente não o encontrar. Consulte a Seção 8.2.17, “Autenticação Personalizável”.
*  `--port=port_num`, `-P port_num`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--port=port_num</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>3306</code></td> </tr></tbody></table>

  Para conexões TCP/IP, o número de porta a ser usado. O número de porta padrão é 3306.
*  `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--protocol=type</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[ver texto]</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>TCP</code></p><p><code>SOCKET</code></p><p><code>PIPE</code></p><p><code>MEMORY</code></p></td> </tr></tbody></table>

  Esta opção especifica explicitamente qual protocolo de transporte usar para se conectar ao servidor. É útil quando outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do desejado. Por exemplo, as conexões em Unix para `localhost` são feitas usando um arquivo de socket Unix por padrão:

  ```
  mysql --host=localhost
  ```

  Para forçar o uso do transporte TCP/IP em vez disso, especifique uma opção `--protocol`:

  ```
  mysql --host=localhost --protocol=TCP
  ```

  A tabela a seguir mostra os valores permitidos da opção `--protocol` e indica as plataformas aplicáveis para cada valor. Os valores não são case-sensitive.

  <table><thead><tr> <th><code>--protocol</code> Valor</th> <th>Protocolo de Transporte Usado</th> <th>Plataformas Aplicaveis</th> </tr></thead><tbody><tr> <th><code>TCP</code></th> <td>Transporte TCP/IP para servidor local ou remoto</td> <td>Todas</td> </tr><tr> <th><code>SOCKET</code></th> <td>Transporte de arquivo de socket Unix para servidor local</td> <td>Unix e sistemas Unix-like</td> </tr><tr> <th><code>PIPE</code></th> <td>Transporte de canal nomeado para servidor local</td> <td>Windows</td> </tr><tr> <th><code>MEMORY</code></th> <td>Transporte de memória compartilhada para servidor local</td> <td>Windows</td> </tr></tbody></table>

  Veja também  Seção 6.2.7, “Protocolos de Transporte de Conexão”
*  `--shared-memory-base-name=name`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--shared-memory-base-name=nome</code></td> </tr><tr><th>Específico da plataforma</th> <td>Windows</td> </tr></tbody></table>

  Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada com um servidor local. O valor padrão é `MYSQL`. O nome da memória compartilhada é sensível a maiúsculas e minúsculas.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.
*  `--socket=caminho`, `-S caminho`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--socket={nome_de_arquivo|nome_de_canal}</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Em Unix, o nome do arquivo de soquete Unix a ser usado para conexões feitas usando um canal nomeado com um servidor local. O nome padrão do arquivo de soquete Unix é `/tmp/mysql.sock`.

  Em Windows, o nome do canal nomeado a ser usado para conexões com um servidor local. O nome padrão do canal em Windows é `MySQL`. O nome do canal não é sensível a maiúsculas e minúsculas.

  Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.
*  `--user=nome_de_usuario`, `-u nome_de_usuario`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--user=nome_de_usuario</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O nome de usuário da conta MySQL a ser usado para se conectar ao servidor. O nome de usuário padrão é `ODBC` em Windows ou o nome de login do Unix em Unix.

#### Opções de comando para conexões criptografadas


Esta seção descreve as opções para programas cliente que especificam se devem usar conexões criptografadas com o servidor, os nomes dos arquivos de certificado e chave e outros parâmetros relacionados ao suporte a conexões criptografadas. Para exemplos de uso sugerido e como verificar se uma conexão está criptografada, consulte a Seção 8.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”.

::: info Nota

Essas opções têm efeito apenas para conexões que usam um protocolo de transporte sujeito à criptografia; ou seja, conexões TCP/IP e conexões de socket de Unix. Consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”

:::

Para informações sobre o uso de conexões criptografadas a partir da API C do MySQL, consulte Suporte para Conexões Criptografadas.

**Tabela 6.5 Resumo das Opções de Criptografia de Conexão**

<table><thead><tr><th>Nome da Opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>--get-server-public-key</code></td> <td>Solicitar a chave pública RSA do servidor</td> </tr><tr><td><code>--server-public-key-path</code></td> <td>Nome do caminho do arquivo que contém a chave pública RSA do servidor</td> </tr><tr><td><code>--ssl-ca</code></td> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> </tr><tr><td><code>--ssl-capath</code></td> <td>Diretório que contém os arquivos de certificado de Autoridade de Certificação SSL confiáveis</td> </tr><tr><td><code>--ssl-cert</code></td> <td>Arquivo que contém o certificado X.509</td> </tr><tr><td><code>--ssl-cipher</code></td> <td>Cifras permitidas para criptografia da conexão</td> </tr><tr><td><code>--ssl-crl</code></td> <td>Arquivo que contém listas de revogação de certificados</td> </tr><tr><td><code>--ssl-crlpath</code></td> <td>Diretório que contém os arquivos de lista de revogação de certificados</td> </tr><tr><td><code>--ssl-fips-mode</code></td> <td>Se o modo FIPS deve ser habilitado no lado do cliente</td> </tr><tr><td><code>--ssl-key</code></td> <td>Arquivo que contém a chave X.509</td> </tr><tr><td><code>--ssl-mode</code></td> <td>Estado de segurança desejado da conexão com o servidor</td> </tr><tr><td><code>--ssl-session-data</code></td> <td>Arquivo que contém os dados da sessão SSL</td> </tr><tr><td><code>--ssl-session-data-continue-on-failed-reuse</code></td> <td>Se as conexões devem ser estabelecidas se a reutilização da sessão falhar</td> </tr><tr><td><code>--tls-ciphersuites</code></td> <td>Cifras permitidas das suítes TLSv1.3 para conexões criptografadas</td> </tr><tr><td><code>--tls-version</code></td> <td>Protocolos TLS permitidos para conexões criptografadas</td> </tr></tbody></table>

*  `--get-server-public-key`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Tipo</th> <td><code>Booleano</code></td> </tr></tbody></table>

Solicitar à servidor a chave pública necessária para a troca de senhas baseada em pares de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senhas baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Autenticação Personalizável SHA-2”.
*  `--server-public-key-path=file_name`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--server-public-key-path=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

O nome do caminho de um arquivo no formato PEM contendo uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas baseada em pares de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `sha256_password` (desatualizado) ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senhas baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Esta opção está disponível apenas se o MySQL foi compilado usando OpenSSL.

Para informações sobre os plugins `sha256_password` (desatualizado) e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação Personalizável SHA-2”, e a Seção 8.4.1.2, “Autenticação Personalizável SHA-2”.
*  `--ssl-ca=file_name`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--ssl-ca=nome_do_arquivo_ca</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA) no formato PEM. O arquivo contém uma lista de Autoridades de Certificação SSL confiáveis.

  Para indicar ao cliente que não autentique o certificado do servidor ao estabelecer uma conexão criptografada com o servidor, não especifique `--ssl-ca` nem `--ssl-capath`. O servidor ainda verifica o cliente de acordo com quaisquer requisitos aplicáveis estabelecidos para a conta do cliente e ainda usa quaisquer valores das variáveis de sistema `ssl_ca` ou `ssl_capath` especificados no lado do servidor.

  Para especificar o arquivo CA do servidor, defina a variável de sistema `ssl_ca`.
*  `--ssl-capath=nome_do_diretório`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--ssl-capath=nome_do_diretório</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O nome do caminho do diretório que contém arquivos de certificado de Autoridade de Certificação (CA) SSL confiáveis no formato PEM.

  Para indicar ao cliente que não autentique o certificado do servidor ao estabelecer uma conexão criptografada com o servidor, não especifique `--ssl-ca` nem `--ssl-capath`. O servidor ainda verifica o cliente de acordo com quaisquer requisitos aplicáveis estabelecidos para a conta do cliente e ainda usa quaisquer valores das variáveis de sistema `ssl_ca` ou `ssl_capath` especificados no lado do servidor.

  Para especificar o diretório CA do servidor, defina a variável de sistema `ssl_capath`.
*  `--ssl-cert=nome_do_arquivo`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--ssl-cert=nome_do_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O nome do caminho do arquivo de certificado público da chave SSL do cliente no formato PEM. Certificados SSL em cadeia são suportados.

  Para especificar o arquivo de certificado público da chave SSL do servidor, defina a variável de sistema `ssl_cert`.
*  `--ssl-cipher=lista_de_cifradores`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--ssl-cipher=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A lista de criptocódigos permitidos para conexões que utilizam TLSv1.2. Se nenhum criptocódigo na lista for suportado, as conexões criptografadas que utilizam esses protocolos TLS não funcionarão.

  Para maior portabilidade, *`cipher_list`* deve ser uma lista de um ou mais nomes de criptocódigos, separados por colchetes. Exemplos:

  ```
  --ssl-cipher=AES128-SHA
  --ssl-cipher=DHE-RSA-AES128-GCM-SHA256:AES128-SHA
  ```

  O OpenSSL suporta a sintaxe para especificar criptocódigos descritos na documentação do OpenSSL em <https://www.openssl.org/docs/manmaster/man1/ciphers.html>.

  Para obter informações sobre quais criptocódigos de criptografia o MySQL suporta, consulte a Seção 8.3.2, “Protocolos e criptocódigos TLS de conexão criptografada”.

  Para especificar os criptocódigos de criptografia para o servidor, defina a variável de sistema `ssl_cipher`.
*  `--ssl-crl=nome_arquivo`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--ssl-crl=nome_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O nome do caminho do arquivo que contém listas de revogação de certificados no formato PEM.

  Se nem `--ssl-crl` nem `--ssl-crlpath` for fornecido, não serão realizadas verificações de CRL, mesmo que o caminho do CA contenha listas de revogação de certificados.

  Para especificar o arquivo de lista de revogação para o servidor, defina a variável de sistema `ssl_crl`.
*  `--ssl-crlpath=nome_pasta`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--ssl-crlpath=nome_pasta</code></td> </tr><tr><th>Tipo</th> <td>Nome da pasta</td> </tr></tbody></table>

  O nome do caminho da pasta que contém arquivos de lista de revogação de certificados no formato PEM.

  Se nem `--ssl-crl` nem `--ssl-crlpath` for fornecido, não serão realizadas verificações de CRL, mesmo que o caminho do CA contenha listas de revogação de certificados.

  Para especificar a pasta de lista de revogação para o servidor, defina a variável de sistema `ssl_crlpath`.
*  `--ssl-fips-mode={OFF|ON|STRICT}`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ssl-fips-mode={OFF|ON|STRICT}</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>STRICT</code></p></td> </tr></tbody></table>

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Consulte  Seção 8.8, “Suporte FIPS”.

  Esses valores de `--ssl-fips-mode` são permitidos:

  + `OFF`: Desabilitar o modo FIPS.
  + `ON`: Habilitar o modo FIPS.
  + `STRICT`: Habilitar o modo FIPS “estricto”.

  ::: info Nota

  Se o Módulo de Objeto FIPS do OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza um aviso na inicialização e opere no modo não FIPS.

  :::

  Para especificar o modo FIPS para o servidor, defina a variável de sistema `ssl_fips_mode`.
*  `--ssl-key=nome_arquivo`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ssl-key=nome_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O nome do caminho do arquivo de chave privada SSL do cliente no formato PEM. Para maior segurança, use um certificado com um tamanho de chave RSA de pelo menos 2048 bits.

  Se o arquivo de chave estiver protegido por uma senha, o programa cliente solicita ao usuário a senha. A senha deve ser fornecida interativamente; não pode ser armazenada em um arquivo. Se a senha estiver incorreta, o programa continua como se não pudesse ler a chave.

  Para especificar o arquivo de chave privada SSL do servidor, defina a variável de sistema `ssl_key`.
*  `--ssl-mode=modo`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ssl-mode=mode</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>PREFERRED</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>DISABLED</code></p><p><code>PREFERRED</code></p><p><code>REQUIRED</code></p><p><code>VERIFY_CA</code></p><p><code>VERIFY_IDENTITY</code></p></td> </tr></tbody></table>

Esta opção especifica o estado de segurança desejado da conexão com o servidor. Estes valores de modo são permitidos, em ordem de rigor crescente:

+ `DISABLED`: Estabelecer uma conexão não criptografada.
+ `PREFERRED`: Estabelecer uma conexão criptografada se o servidor suportar conexões criptografadas, revertendo para uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Este é o valor padrão se o `--ssl-mode` não for especificado.

As conexões através de arquivos de soquete Unix não são criptografadas com um modo de `PREFERRED`. Para impor a criptografia para conexões de arquivos de soquete, use um modo de `REQUIRED` ou mais rigoroso. (No entanto, o transporte de arquivos de soquete é seguro por padrão, portanto, criptografar uma conexão de arquivo de soquete não a torna mais segura e aumenta a carga do CPU.)
+ `REQUIRED`: Estabelecer uma conexão criptografada se o servidor suportar conexões criptografadas. A tentativa de conexão falha se uma conexão criptografada não puder ser estabelecida.
+ `VERIFY_CA`: Como `REQUIRED`, mas adicionalmente verificar o certificado da Autoridade de Certificação (CA) do servidor contra os certificados de CA configurados. A tentativa de conexão falha se nenhum certificado de CA correspondente válido for encontrado.
+ `VERIFY_IDENTITY`: Como `VERIFY_CA`, mas realizar adicionalmente a verificação da identidade do nome do host, verificando o nome do host que o cliente usa para se conectar ao servidor contra a identidade no certificado que o servidor envia ao cliente:

- Se o cliente estiver usando o OpenSSL 1.0.2 ou superior, o cliente verifica se o nome do host que ele usa para a conexão corresponde ao valor da Nome Alternativo do Assunto ou ao valor do Nome Comum no certificado do servidor. A verificação da identidade do nome do host também funciona com certificados que especificam o Nome Comum usando asteriscos.
- Caso contrário, o cliente verifica se o nome do host que ele usa para a conexão corresponde ao valor do Nome Comum no certificado do servidor.
A conexão falha se houver uma discrepância. Para conexões encriptadas, essa opção ajuda a prevenir ataques de intermediário.

::: info Nota

A verificação da identidade do nome do host com `VERIFY_IDENTITY` não funciona com certificados autoassinados que são criados automaticamente pelo servidor (consulte a Seção 8.3.3.1, “Criando Certificados SSL e RSA e Chaves usando MySQL”). Tais certificados autoassinados não contêm o nome do servidor como o valor do Nome Comum.

:::
Importante

O ajuste padrão, `--ssl-mode=PREFERRED`, produz uma conexão encriptada se os outros ajustes padrão não forem alterados. No entanto, para ajudar a prevenir ataques sofisticados de intermediário, é importante que o cliente verifique a identidade do servidor. Os ajustes `--ssl-mode=VERIFY_CA` e `--ssl-mode=VERIFY_IDENTITY` são uma escolha melhor do que o ajuste padrão para ajudar a prevenir esse tipo de ataque. Para implementar um desses ajustes, você deve primeiro garantir que o certificado CA do servidor esteja disponível de forma confiável para todos os clientes que o usam em seu ambiente, caso contrário, problemas de disponibilidade resultarão. Por essa razão, eles não são o ajuste padrão.

A opção `--ssl-mode` interage com as opções de certificados CA da seguinte forma:

+ Se o modo `--ssl-mode` não for explicitamente definido de outra forma, o uso de `--ssl-ca` ou `--ssl-capath` implica em `--ssl-mode=VERIFY_CA`.
+ Para os valores de `--ssl-mode` de `VERIFY_CA` ou `VERIFY_IDENTITY`, `--ssl-ca` ou `--ssl-capath` também é necessário, para fornecer um certificado CA que corresponda ao usado pelo servidor.
+ Uma opção `--ssl-mode` explícita com um valor diferente de `VERIFY_CA` ou `VERIFY_IDENTITY`, juntamente com uma opção `--ssl-ca` ou `--ssl-capath` explícita, produz uma mensagem de aviso de que não será realizada a verificação do certificado do servidor, apesar de uma opção de certificado CA ter sido especificada.

+ Para exigir o uso de conexões criptografadas por uma conta MySQL, use `CREATE USER` para criar a conta com uma cláusula `REQUIRE SSL`, ou use `ALTER USER` para uma conta existente para adicionar uma cláusula `REQUIRE SSL`. Isso faz com que as tentativas de conexão por clientes que usam a conta sejam rejeitadas, a menos que o MySQL suporte conexões criptografadas e uma conexão criptografada possa ser estabelecida.

+ A cláusula `REQUIRE` permite outras opções relacionadas à criptografia, que podem ser usadas para impor requisitos de segurança mais rigorosos do que `REQUIRE SSL`. Para obter detalhes adicionais sobre quais opções de comando podem ou devem ser especificadas por clientes que se conectam usando contas configuradas usando as várias opções `REQUIRE`.
*  `--ssl-session-data=file_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ssl-session-data=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O nome do caminho do arquivo de dados de sessão SSL do cliente no formato PEM para reutilização de sessão.

+ Quando você invoca um programa cliente MySQL com a opção `--ssl-session-data`, o cliente tenta deserializar os dados da sessão do arquivo, se fornecido, e então usá-los para estabelecer uma nova conexão. Se você fornecer um arquivo, mas a sessão não for reutilizada, então a conexão falha, a menos que você também tenha especificado a opção `--ssl-session-data-continue-on-failed-reuse` na linha de comando quando você invocou o programa cliente.

O comando `mysql`, `ssl_session_data_print`, gera o arquivo de dados da sessão (consulte a Seção 6.5.1.2, “Comandos do cliente MySQL”).
*  `ssl-session-data-continue-on-failed-reuse`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--ssl-session-data-continue-on-failed-reuse</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Controla se uma nova conexão é iniciada para substituir uma conexão tentada que tentou, mas falhou, reutilizar os dados de sessão especificados com a opção de linha de comando `--ssl-session-data`. Por padrão, a opção de linha de comando `--ssl-session-data-continue-on-failed-reuse` está desativada, o que faz com que um programa cliente retorne um erro de conexão quando os dados de sessão são fornecidos e não reutilizados.

  Para garantir que uma nova conexão não relacionada seja aberta após a reutilização da sessão falhar silenciosamente, inicie programas cliente MySQL com as opções de linha de comando `--ssl-session-data` e `--ssl-session-data-continue-on-failed-reuse`.
*  `--tls-ciphersuites=ciphersuite_list`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tls-ciphersuites=ciphersuite_list</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>string vazia</code></td> </tr></tbody></table>

  Esta opção especifica quais ciphersuites o cliente permite para conexões criptografadas que usam TLSv1.3. O valor é uma lista de nomes de ciphersuites separados por vírgulas. Por exemplo:

  ```
  mysql --tls-ciphersuites="suite1:suite2:suite3"
  ```

  Os ciphersuites que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Se esta opção não for definida, o cliente permite o conjunto padrão de ciphersuites. Se a opção for definida como a string vazia, nenhum ciphersuite é habilitado e conexões criptografadas não podem ser estabelecidas. Para mais informações, consulte a Seção 8.3.2, “Protocolos e ciphers de TLS de conexão criptografada”.

Para especificar quais suites de cifra o servidor permite, defina a variável de sistema `tls_ciphersuites`.
* `--tls-version=lista_protocolos`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tls-version=lista_protocolos</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><p><code>TLSv1,TLSv1.1,TLSv1.2,TLSv1.3</code> (OpenSSL 1.1.1 ou superior)</p><p><code>TLSv1,TLSv1.1,TLSv1.2</code> (caso contrário)</p></td> </tr></tbody></table>

  Esta opção especifica os protocolos TLS que o cliente permite para conexões criptografadas. O valor é uma lista de uma ou mais versões de protocolo separadas por vírgula. Por exemplo:

  ```
  mysql --tls-version="TLSv1.2,TLSv1.3"
  ```

  Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL e da versão do MySQL Server.

  Importante

  + Clientes, incluindo o MySQL Shell, que suportam a opção `--tls-version` não podem fazer uma conexão TLS/SSL com o protocolo definido como TLSv1 ou TLSv1.1. Se um cliente tentar se conectar usando esses protocolos, para conexões TCP, a conexão falha e um erro é retornado ao cliente. Para conexões de socket, se `--ssl-mode` for definido como `REQUIRED`, a conexão falha, caso contrário, a conexão é feita, mas com TLS/SSL desativado. Veja Remoção do suporte aos protocolos TLSv1 e TLSv1.1 para mais informações.
  + O suporte ao protocolo TLSv1.3 está disponível no MySQL Server, desde que o MySQL Server tenha sido compilado usando OpenSSL 1.1.1 ou superior. O servidor verifica a versão do OpenSSL no início e, se for menor que 1.1.1, o TLSv1.3 é removido do valor padrão para as variáveis de sistema do servidor relacionadas à versão TLS (como a variável de sistema `tls_version`).

  Os protocolos permitidos devem ser escolhidos para não deixar "buracos" na lista. Por exemplo, esses valores não têm buracos:

  ```
  --tls-version="TLSv1.2,TLSv1.3"
  --tls-version="TLSv1.3"
  ```

  Para detalhes, consulte a Seção 8.3.2, "Protocolos e cifra de conexão criptografada TLS".

Para especificar quais protocolos TLS o servidor permite, defina a variável de sistema `tls_version`.

#### Opções de Comando para Compressão de Conexão

Esta seção descreve opções que permitem que os programas cliente controlem o uso de compressão para conexões com o servidor. Para obter informações adicionais e exemplos de como usá-las, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

**Tabela 6.6 Resumo das Opções de Compressão de Conexão**

<table><thead><tr><th>Nome da Opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>--compress</code></td> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> </tr><tr><td><code>--compression-algorithms</code></td> <td>Algoritmos de compressão permitidos para conexões com o servidor</td> </tr><tr><td><code>--zstd-compression-level</code></td> <td>Nível de compressão para conexões com o servidor que usam compressão zstd</td> </tr></tbody></table>

*  `--compress`, `-C`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compressar todas as informações enviadas entre o cliente e o servidor, se possível.

  Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL. Consulte Configurando Compressão de Conexão Legado.
*  `--compression-algorithms=value`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Tipo</th> <td>Conjunto</td> </tr><tr><th>Valor Padrão</th> <td><code>uncompressed</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>zlib</code></p><p><code>zstd</code></p><p><code>uncompressed</code></p></td> </tr></tbody></table>

Os algoritmos de compressão permitidos para conexões com o servidor. Os algoritmos disponíveis são os mesmos da variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.
*  `--zstd-compression-level=level`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--zstd-compression-level=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr></tbody></table>

  O nível de compressão a ser usado para conexões com o servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos variam de 1 a 22, com valores maiores indicando níveis de compressão crescentes. O nível de compressão padrão do `zstd` é 3. A configuração do nível de compressão não tem efeito em conexões que não utilizam compressão `zstd`.