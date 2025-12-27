### 6.2.3 Opções de Comando para Conectar ao Servidor

Esta seção descreve as opções suportadas pela maioria dos programas clientes MySQL que controlam como os programas clientes estabelecem conexões com o servidor, se as conexões são criptografadas e se as conexões são comprimidas. Essas opções podem ser fornecidas na linha de comando ou em um arquivo de opções.

* Opções de Comando para Estabelecimento de Conexão
* Opções de Comando para Conexões Criptografadas
* Opções de Comando para Compressão de Conexão

#### Opções de Comando para Estabelecimento de Conexão

Esta seção descreve opções que controlam como os programas clientes estabelecem conexões com o servidor. Para informações adicionais e exemplos de como usá-las, consulte a Seção 6.2.4, “Conectando ao Servidor MySQL Usando Opções de Comando”.

**Tabela 6.4 Resumo das Opções de Estabelecimento de Conexão**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para estabelecer conexões com o servidor.">
<col style="width: 35%"/><col style="width: 64%"/>
<thead><tr><th>Nome da Opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="connection-options.html#option_general_default-auth">--default-auth</a></td> <td>Plugin de autenticação a ser usado</td> </tr><tr><td><a class="link" href="connection-options.html#option_general_host">--host</a></td> <td>Servidor no qual o servidor MySQL está localizado</td> </tr><tr><td><a class="link" href="connection-options.html#option_general_password">--password</a></td> <td>Senha a ser usada ao se conectar ao servidor</td> </tr><tr><td><a class="link" href="connection-options.html#option_general_password1">--password1</a></td> <td>Primeira senha de autenticação multifator a ser usada ao se conectar ao servidor</td> </tr><tr><td><a class="link" href="connection-options.html#option_general_password2">--password2</a></td> <td>Segunda senha de autenticação multifator a ser usada ao se conectar ao servidor</td> </tr><tr><td><a class="link" href="connection-options.html#option_general_password3">--password3</a></td> <td>Terceira senha de autenticação multifator a ser usada ao se conectar ao servidor</td> </tr><tr><td><a class="link" href="connection-options.html#option_general_pipe">--pipe</a></td> <td>Conectar ao servidor usando um pipe nomeado (apenas Windows)</td> </tr><tr><td><a class="link" href="connection-options.html#option_general_plugin-dir">--plugin-dir</a></td> <td>Diretório onde os plugins estão instalados</td> </tr><tr><td><a class="link" href="connection-options.html#option_general_port">--port</a></td> <td>Número de porta TCP/IP para a conexão</td> </tr><tr><td><a class="link" href="connection-options.html#option_general_protocol">--protocol</a></td> <td>Protocolo de transporte a ser usado</td> </tr><tr><td><a class="link" href="connection-options.html#option_general_shared-memory-base-name">--shared-memory-base-name</a></td> <td>Nome da memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> </tr><tr><td><a class="link" href="connection-options.html#option_general_socket">--socket</a></td> <td>Arquivo de socket Unix ou pipe nomeado (Windows) a ser usado</td> </tr><tr><td><a class="link" href="connection-options.html#option_general_user">--user</a></td> <td>Nome do usuário MySQL a ser usado ao se conectar ao servidor</td> </tr></tbody></table>

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Propriedades para autenticação de plugin do lado do cliente"><tr><th>Formato de linha de comando</th> <td><code class="literal">--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></table>

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 8.2.17, “Autenticação Personalizável”.

* `--host=nome_do_host`, `-h nome_do_host`

  <table frame="box" rules="all" summary="Propriedades para host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--host=nome_do_host</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">localhost</code></td> </tr></table>

  O host em que o servidor MySQL está em execução. O valor pode ser um nome de host, endereço IPv4 ou endereço IPv6. O valor padrão é `localhost`.

* `--password[=pass_val]`, `-p[pass_val]`

  <table frame="box" rules="all" summary="Propriedades para senha"><tr><th>Formato de linha de comando</th> <td><code class="literal">--password[=senha]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhuma]</code></td> </tr></table>

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o programa cliente solicitará uma. Se fornecido, não deve haver *espaço* entre `--password=` ou `-p` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é enviar nenhuma senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.

Para especificar explicitamente que não há senha e que o programa cliente não deve solicitar uma, use a opção `--skip-password`.

* `--password1[=pass_val]`

  <table frame="box" rules="all" summary="Propriedades para password1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--password1[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o programa cliente solicitará uma. Se for fornecido, não deve haver *espaço* entre `--password1=` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar nenhuma senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.

  Para especificar explicitamente que não há senha e que o programa cliente não deve solicitar uma, use a opção `--skip-password1`.

  `--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

* `--password2[=pass_val]`

  <table frame="box" rules="all" summary="Propriedades para password2"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--password2[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica da opção `--password1`; consulte a descrição dessa opção para obter detalhes.

* `--password3[=pass_val]`

  <table frame="box" rules="all" summary="Propriedades para password3"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--password3[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A senha para o fator de autenticação multifator 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica da opção `--password1`; consulte a descrição dessa opção para obter detalhes.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Propriedades para pipe"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--pipe</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Em Windows, conecte-se ao servidor usando um pipe nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Propriedades para plugin-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--plugin-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr></tbody></table>

O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o programa cliente não o encontrar. Veja a Seção 8.2.17, “Autenticação Extensível”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para a porta"><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--port=port_num</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">3306</code></td> </tr></table>

  Para conexões TCP/IP, o número de porta a ser usado. O número de porta padrão é 3306.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para default-auth"><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></table>0

  Esta opção especifica explicitamente qual protocolo de transporte usar para se conectar ao servidor. É útil quando outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Por exemplo, conexões em Unix para `localhost` são feitas usando um arquivo de socket Unix por padrão:

  ```
  mysql --host=localhost
  ```

  Para forçar o uso do transporte TCP/IP em vez disso, especifique uma opção `--protocol`:

  ```
  mysql --host=localhost --protocol=TCP
  ```

  A tabela a seguir mostra os valores permitidos da opção `--protocol` e indica as plataformas aplicáveis para cada valor. Os valores não são case-sensitive.

<table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>1

  Veja também a Seção 6.2.7, “Protocolos de transporte de conexão”

* `--shared-memory-base-name=nome`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>2

  Em Windows, o nome da memória compartilhada a ser usado para conexões feitas usando memória compartilhada para um servidor local. O valor padrão é `MYSQL`. O nome da memória compartilhada é sensível a maiúsculas e minúsculas.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--socket=caminho`, `-S caminho`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>3

  Em Unix, o nome do arquivo de soquete Unix a ser usado para conexões feitas usando um tubo nomeado para um servidor local. O nome padrão do arquivo de soquete Unix é `/tmp/mysql.sock`.

  Em Windows, o nome do tubo nomeado a ser usado para conexões a um servidor local. O nome padrão do tubo em Windows é `MySQL`. O nome do tubo não é sensível a maiúsculas e minúsculas.

Em Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por named pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><tr><th>Formato de linha de comando</th><td><code class="literal">--default-auth=plugin</code></td> </tr><tr><th>Tipo</th><td>String</td> </tr></tbody></table>4

  O nome de usuário da conta MySQL a ser usado para se conectar ao servidor. O nome de usuário padrão é `ODBC` em Windows ou o nome de login do Unix no Unix.

#### Opções de Comando para Conexões Encriptadas

Esta seção descreve opções para programas cliente que especificam se devem usar conexões encriptadas ao servidor, os nomes dos arquivos de certificado e chave, e outros parâmetros relacionados ao suporte a conexões encriptadas. Para exemplos de uso sugerido e como verificar se uma conexão é encriptada, consulte a Seção 8.3.1, “Configurando o MySQL para Usar Conexões Encriptadas”.

Nota

Essas opções têm efeito apenas para conexões que usam um protocolo de transporte sujeito à encriptação; ou seja, conexões TCP/IP e conexões de socket-arquivo Unix. Consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”

Para informações sobre o uso de conexões encriptadas a partir da API C do MySQL, consulte Suporte para Conexões Encriptadas.

**Tabela 6.5 Resumo da Opção de Encriptação de Conexão**

<table frame="box" rules="all" summary="Propriedades para autenticação padrão">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--default-auth=plugin</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  </tbody>
</table>5

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--default-auth=plugin</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
  </tbody>
</table>6

  Solicitar ao servidor a chave pública necessária para a troca de senhas com base em pares de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senhas com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.1, “Cacheamento de Pluggable Authentication SHA-2”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--default-auth=plugin</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
  </tbody>
</table>7

O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas baseada em pares de chaves RSA. Esta opção aplica-se a clientes que autenticam-se com o plugin de autenticação `sha256_password` (desatualizado) ou `caching_sha2_password`. Esta opção é ignorada para contas que não autenticam-se com um desses plugins. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

Esta opção está disponível apenas se o MySQL foi compilado usando OpenSSL.

Para informações sobre os plugins `sha256_password` (desatualizado) e `caching_sha2_password`, consulte a Seção 8.4.1.2, “Autenticação Personalizável SHA-256”, e a Seção 8.4.1.1, “Autenticação Personalizável SHA-2”.

* `--ssl-ca=file_name`

  <table frame="box" rules="all" summary="Propriedades para autenticação padrão"><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>8

  O nome do caminho do arquivo do certificado da Autoridade de Certificação (CA) no formato PEM. O arquivo contém uma lista de Autoridades de Certificação SSL confiáveis.

  Para indicar ao cliente que não autentique o certificado do servidor ao estabelecer uma conexão criptografada com o servidor, não especifique nem `--ssl-ca` nem `--ssl-capath`. O servidor ainda verifica o cliente de acordo com quaisquer requisitos aplicáveis estabelecidos para a conta do cliente e ainda usa quaisquer valores das variáveis de sistema `ssl_ca` ou `ssl_capath` especificados no lado do servidor.

Para especificar o arquivo CA do servidor, defina a variável de sistema `ssl_ca`.

* `--ssl-capath=dir_name`

  <table frame="box" rules="all" summary="Propriedades para auth-padrão"><tr><th>Formato de linha de comando</th> <td><code class="literal">--default-auth=plugin</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>9

  O nome do caminho do diretório que contém os arquivos de autoridade de certificação SSL (CA) de certificado confiáveis no formato PEM.

  Para informar ao cliente para não autenticar o certificado do certificado do servidor ao estabelecer uma conexão criptografada com o servidor, não especifique `--ssl-ca` nem `--ssl-capath`. O servidor ainda verifica o cliente de acordo com quaisquer requisitos aplicáveis estabelecidos para a conta do cliente e ainda usa quaisquer valores das variáveis de sistema `ssl_ca` ou `ssl_capath` especificados no lado do servidor.

  Para especificar o diretório CA do servidor, defina a variável de sistema `ssl_capath`.

* `--ssl-cert=file_name`

  <table frame="box" rules="all" summary="Propriedades para host"><tr><th>Formato de linha de comando</th> <td><code class="literal">--host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">localhost</code></td> </tr></tbody></table>0

  O nome do caminho do arquivo de certificado público da chave SSL do cliente no formato PEM. Certificados SSL em cadeia são suportados.

  Para especificar o arquivo de certificado público da chave SSL do servidor, defina a variável de sistema `ssl_cert`.

* `--ssl-cipher=cipher_list`

<table frame="box" rules="all" summary="Propriedades para o host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">localhost</code></td> </tr></tbody></table>1

  A lista de criptocódigos permitidos para conexões que utilizam TLSv1.2. Se nenhum criptocódigo na lista for suportado, as conexões criptografadas que utilizam esses protocolos TLS não funcionarão.

  Para maior portabilidade, *`cipher_list`* deve ser uma lista de um ou mais nomes de criptocódigos, separados por colchetes. Exemplos:

  ```
  --ssl-cipher=AES128-SHA
  --ssl-cipher=DHE-RSA-AES128-GCM-SHA256:AES128-SHA
  ```

  O OpenSSL suporta a sintaxe para especificar criptocódigos descritos na documentação do OpenSSL em <https://www.openssl.org/docs/manmaster/man1/ciphers.html>.

  Para obter informações sobre quais criptocódigos de criptografia o MySQL suporta, consulte a Seção 8.3.2, “Protocolos e criptocódigos TLS de conexão criptografada”.

  Para especificar os criptocódigos de criptografia para o servidor, defina a variável de sistema `ssl_cipher`.

* `--ssl-crl=nome_arquivo_file`

  <table frame="box" rules="all" summary="Propriedades para o host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">localhost</code></td> </tr></tbody></table>2

  O nome do caminho do arquivo que contém listas de revogação de certificados no formato PEM.

  Se nem `--ssl-crl` nem `--ssl-crlpath` for fornecido, nenhuma verificação de CRL será realizada, mesmo que o caminho da CA contenha listas de revogação de certificados.

  Para especificar o arquivo de lista de revogação para o servidor, defina a variável de sistema `ssl_crl`.

* `--ssl-crlpath=caminho_dir`

<table frame="box" rules="all" summary="Propriedades para o host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">localhost</code></td> </tr></tbody></table>3

  O nome do caminho do diretório que contém arquivos da lista de revogação de certificados no formato PEM.

  Se não for fornecido o parâmetro `--ssl-crl` nem `--ssl-crlpath`, não serão realizadas verificações de CRL, mesmo que o caminho da CA contenha listas de revogação de certificados.

  Para especificar o diretório de lista de revogação para o servidor, defina a variável de sistema `ssl_crlpath`.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Propriedades para o host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">localhost</code></td> </tr></tbody></table>4

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Consulte a Seção 8.8, “Suporte FIPS”.

  Esses valores de `--ssl-fips-mode` são permitidos:

  + `OFF`: Desabilitar o modo FIPS.
  + `ON`: Habilitar o modo FIPS.
  + `STRICT`: Habilitar o modo FIPS “estricto”.

  Observação

  Se o Módulo de Objeto FIPS do OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente emita uma mensagem de aviso na inicialização e opere no modo não FIPS.

Para especificar o modo FIPS para o servidor, defina a variável de sistema `ssl_fips_mode`.

* `--ssl-key=nome_arquivo`

  <table frame="box" rules="all" summary="Propriedades para o host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--host=nome_do_host</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">localhost</code></td> </tr></tbody></table>5

  O nome do caminho do arquivo de chave privada SSL do cliente no formato PEM. Para maior segurança, use um certificado com um tamanho de chave RSA de pelo menos 2048 bits.

  Se o arquivo de chave estiver protegido por uma senha, o programa cliente solicita ao usuário a senha. A senha deve ser fornecida interativamente; não pode ser armazenada em um arquivo. Se a senha estiver incorreta, o programa continua como se não pudesse ler a chave.

  Para especificar o arquivo de chave privada SSL do servidor, defina a variável de sistema `ssl_key`.

* `--ssl-mode=modo`

  <table frame="box" rules="all" summary="Propriedades para o host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--host=nome_do_host</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">localhost</code></td> </tr></tbody></table>6

  Esta opção especifica o estado de segurança desejado da conexão com o servidor. Esses valores de modo são permitidos, em ordem crescente de rigor:

  + `DESABILITADO`: Estabelecer uma conexão não criptografada.

  + `PREFERRED`: Estabelecer uma conexão criptografada se o servidor suportar conexões criptografadas, revertendo para uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Isso é o padrão se `--ssl-mode` não for especificado.

As conexões por meio de arquivos de soquete Unix não são criptografadas com o modo `PREFERRED`. Para impor a criptografia para conexões por meio de arquivos de soquete Unix, use um modo de `REQUERIDO` ou mais rigoroso. (No entanto, o transporte por meio de arquivos de soquete é seguro por padrão, portanto, criptografar uma conexão por meio de arquivos de soquete não a torna mais segura e aumenta a carga da CPU.)

  + `REQUERIDO`: Estabeleça uma conexão criptografada se o servidor suportar conexões criptografadas. A tentativa de conexão falha se uma conexão criptografada não puder ser estabelecida.

  + `VERIFY_CA`: Como `REQUERIDO`, mas também verifique o certificado da Autoridade de Certificação (CA) do servidor contra os certificados de CA configurados. A tentativa de conexão falha se não forem encontrados certificados de CA válidos.

  + `VERIFY_IDENTITY`: Como `VERIFY_CA`, mas também realize a verificação da identidade do nome do host, verificando o nome do host que o cliente usa para se conectar ao servidor contra a identidade no certificado que o servidor envia ao cliente:

    - Se o cliente usar o OpenSSL 1.0.2 ou superior, o cliente verifica se o nome do host que ele usa para se conectar corresponde ao valor de Nome Alternativo do Sujeito ou ao valor de Nome Comum no certificado do servidor. A verificação da identidade do nome do host também funciona com certificados que especificam o Nome Comum usando asteriscos.

    - Caso contrário, o cliente verifica se o nome do host que ele usa para se conectar corresponde ao valor de Nome Comum no certificado do servidor.

A conexão falha se houver um desajuste. Para conexões criptografadas, essa opção ajuda a prevenir ataques de intermediário.

Nota

A verificação de identidade do nome do host com `VERIFY_IDENTITY` não funciona com certificados autoassinados que são criados automaticamente pelo servidor (consulte a Seção 8.3.3.1, “Criando Certificados SSL e RSA e Chaves usando MySQL”). Tais certificados autoassinados não contêm o nome do servidor como o valor do Nome Comum.

Importante

A configuração padrão, `--ssl-mode=PREFERRED`, produz uma conexão criptografada se as outras configurações padrão não forem alteradas. No entanto, para ajudar a prevenir ataques sofisticados de intermediário, é importante que o cliente verifique a identidade do servidor. As configurações `--ssl-mode=VERIFY_CA` e `--ssl-mode=VERIFY_IDENTITY` são uma escolha melhor do que a configuração padrão para ajudar a prevenir esse tipo de ataque. Para implementar uma dessas configurações, você deve primeiro garantir que o certificado CA do servidor esteja disponível de forma confiável para todos os clientes que o utilizam em seu ambiente, caso contrário, problemas de disponibilidade resultarão. Por essa razão, elas não são a configuração padrão.

A opção `--ssl-mode` interage com as opções de certificados CA da seguinte forma:

+ Se `--ssl-mode` não for explicitamente definido de outra forma, o uso de `--ssl-ca` ou `--ssl-capath` implica `--ssl-mode=VERIFY_CA`.

+ Para valores de `--ssl-mode` de `VERIFY_CA` ou `VERIFY_IDENTITY`, `--ssl-ca` ou `--ssl-capath` também é necessário, para fornecer um certificado CA que corresponda ao usado pelo servidor.

+ Uma opção `--ssl-mode` explícita com um valor diferente de `VERIFY_CA` ou `VERIFY_IDENTITY`, juntamente com uma opção `--ssl-ca` ou `--ssl-capath` explícita, produz um aviso de que não é realizada nenhuma verificação do certificado do servidor, apesar de uma opção de certificado CA ser especificada.

Para exigir o uso de conexões criptografadas por uma conta MySQL, use `CREATE USER` para criar a conta com uma cláusula `REQUIRE SSL`, ou use `ALTER USER` para uma conta existente para adicionar uma cláusula `REQUIRE SSL`. Isso faz com que as tentativas de conexão por clientes que usam a conta sejam rejeitadas, a menos que o MySQL suporte conexões criptografadas e uma conexão criptografada possa ser estabelecida.

A cláusula `REQUIRE` permite outras opções relacionadas à criptografia, que podem ser usadas para impor requisitos de segurança mais rigorosos do que `REQUIRE SSL`. Para obter detalhes adicionais sobre quais opções de comando podem ou devem ser especificadas por clientes que se conectam usando contas configuradas usando as várias opções `REQUIRE`, consulte Opções de Criação de Usuário SSL/TLS.

* `--ssl-session-data=file_name`

  <table frame="box" rules="all" summary="Propriedades para o host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">localhost</code></td> </tr></tbody></table>7

  O nome do caminho do arquivo de dados de sessão SSL do cliente em formato PEM para reutilização de sessão.

  Quando você invoca um programa cliente MySQL com a opção `--ssl-session-data`, o cliente tenta deserializar os dados da sessão do arquivo, se fornecido, e então usá-los para estabelecer uma nova conexão. Se você fornecer um arquivo, mas a sessão não for reutilizada, então a conexão falha, a menos que você também tenha especificado a opção `--ssl-session-data-continue-on-failed-reuse` na linha de comando quando você invocou o programa cliente.

O comando **mysql**, `ssl_session_data_print`, gera o arquivo de dados da sessão (veja a Seção 6.5.1.2, “Comandos do Cliente mysql”).

* `ssl-session-data-continue-on-failed-reuse`

<table frame="box" rules="all" summary="Propriedades para o host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">localhost</code></td> </tr></tbody></table>8

  Controla se uma nova conexão é iniciada para substituir uma conexão tentada que tentou, mas não conseguiu, reutilizar os dados de sessão especificados com a opção de linha de comando `--ssl-session-data`. Por padrão, a opção de linha de comando `--ssl-session-data-continue-on-failed-reuse` está desativada, o que faz com que um programa cliente retorne um erro de conexão quando os dados de sessão são fornecidos e não reutilizados.

  Para garantir que uma nova conexão não relacionada seja aberta após a reutilização da sessão falhar silenciosamente, inicie programas cliente MySQL com as opções de linha de comando `--ssl-session-data` e `--ssl-session-data-continue-on-failed-reuse`.

* `--tls-ciphersuites=ciphersuite_list`

<table frame="box" rules="all" summary="Propriedades para o host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--host=host_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">localhost</code></td> </tr></tbody></table>9

  Esta opção especifica quais ciphersuites o cliente permite para conexões criptografadas que usam TLSv1.3. O valor é uma lista de zero ou mais nomes de ciphersuites separados por vírgula. Por exemplo:

  ```
  mysql --tls-ciphersuites="suite1:suite2:suite3"
  ```

As suítes de cifra que podem ser nomeadas para essa opção dependem da biblioteca SSL usada para compilar o MySQL. Se essa opção não for definida, o cliente permite o conjunto padrão de suítes de cifra. Se a opção for definida como uma string vazia, nenhuma suítes de cifra é habilitada e conexões criptografadas não podem ser estabelecidas. Para mais informações, consulte a Seção 8.3.2, “Protocolos e Suítes de Cifra TLS de Conexão Criptografada”.

Para especificar quais suítes de cifra o servidor permite, defina a variável de sistema `tls_ciphersuites`.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Propriedades para senha">
    <col style="width: 30%"/><col style="width: 70%"/>
    <tbody>
      <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--password[=senha]</code></td> </tr>
      <tr><th>Tipo</th> <td>String</td> </tr>
      <tr><th>Valor Padrão</th> <td><code class="literal">[none]</code></td> </tr>
    </tbody>
  </table>0

  Essa opção especifica os protocolos TLS que o cliente permite para conexões criptografadas. O valor é uma lista de uma ou mais versões de protocolo separadas por vírgula. Por exemplo:

  ```
  mysql --tls-version="TLSv1.2,TLSv1.3"
  ```

  Os protocolos que podem ser nomeados para essa opção dependem da biblioteca SSL usada para compilar o MySQL e da versão do MySQL Server.

  Importante

  + Clientes, incluindo o MySQL Shell, que suportam a opção `--tls-version` não podem fazer uma conexão TLS/SSL com o protocolo definido como TLSv1 ou TLSv1.1. Se um cliente tentar se conectar usando esses protocolos, para conexões TCP, a conexão falha e um erro é retornado ao cliente. Para conexões de socket, se `--ssl-mode` for definido como `REQUIRED`, a conexão falha, caso contrário, a conexão é feita, mas com TLS/SSL desativado. Consulte a Remoção do Suporte aos Protocolos TLSv1 e TLSv1.1 para mais informações.

O suporte ao protocolo TLSv1.3 está disponível no MySQL Server, desde que o MySQL Server tenha sido compilado usando o OpenSSL 1.1.1 ou superior. O servidor verifica a versão do OpenSSL no início e, se for menor que 1.1.1, o TLSv1.3 é removido do valor padrão das variáveis do sistema do servidor relacionadas à versão TLS (como a variável de sistema `tls_version`).

Os protocolos permitidos devem ser escolhidos para não deixar "buracos" na lista. Por exemplo, esses valores não têm buracos:

```
  --tls-version="TLSv1.2,TLSv1.3"
  --tls-version="TLSv1.3"
  ```

Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifra de conexão TLS Encriptada”.

Para especificar quais protocolos TLS o servidor permite, defina a variável de sistema `tls_version`.

#### Opções de Comando para Compressão de Conexão

Esta seção descreve opções que permitem que os programas cliente controlem o uso de compressão para conexões com o servidor. Para obter informações adicionais e exemplos de como usá-las, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

**Tabela 6.6 Resumo das Opções de Compressão de Conexão**

<table frame="box" rules="all" summary="Propriedades para senha"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--password[=senha]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>1

* `--compress`, `-C`

<table frame="box" rules="all" summary="Propriedades para senha"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--password[=senha]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>2

Compressar todas as informações enviadas entre o cliente e o servidor, se possível.

Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL. Consulte Configuração da Compressão de Conexão Legado.

* `--compression-algorithms=valor`

  <table frame="box" rules="all" summary="Propriedades para senha">
    <col style="width: 30%"/><col style="width: 70%"/>
    <tbody>
      <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--password[=senha]</code></td> </tr>
      <tr><th>Tipo</th> <td>String</td> </tr>
      <tr><th>Valor Padrão</th> <td><code class="literal">[nenhuma]</code></td> </tr>
    </tbody>
  </table>3

  Os algoritmos de compressão permitidos para conexões com o servidor. Os algoritmos disponíveis são os mesmos que a variável de sistema `protocol_compression_algorithms`. O valor padrão é `não comprimido`.

* `--zstd-compression-level=nível`

  <table frame="box" rules="all" summary="Propriedades para senha">
    <col style="width: 30%"/><col style="width: 70%"/>
    <tbody>
      <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--password[=senha]</code></td> </tr>
      <tr><th>Tipo</th> <td>String</td> </tr>
      <tr><th>Valor Padrão</th> <td><code class="literal">[nenhuma]</code></td> </tr>
    </tbody>
  </table>4

  O nível de compressão a ser usado para conexões com o servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos variam de 1 a 22, com níveis maiores indicando níveis crescentes de compressão. O nível de compressão padrão `zstd` é 3. O ajuste do nível de compressão não tem efeito em conexões que não utilizam compressão `zstd`.