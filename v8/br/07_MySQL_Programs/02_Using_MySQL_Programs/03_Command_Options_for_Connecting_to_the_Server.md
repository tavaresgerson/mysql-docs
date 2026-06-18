### 6.2.3 Opções de comando para conectar ao servidor

Esta seção descreve as opções suportadas pela maioria dos programas clientes do MySQL que controlam como os programas clientes estabelecem conexões com o servidor, se as conexões são criptografadas e se as conexões são comprimidas. Essas opções podem ser fornecidas na linha de comando ou em um arquivo de opção.

- Opções de comando para estabelecimento de conexão
- Opções de comando para conexões criptografadas
- Opções de comando para compressão de conexão

#### Opções de comando para estabelecimento de conexão

Esta seção descreve as opções que controlam a forma como os programas cliente estabelecem conexões com o servidor. Para obter informações adicionais e exemplos de como usá-las, consulte a Seção 6.2.4, “Conectando-se ao Servidor MySQL Usando Opções de Comando”.

**Tabela 6.4 Resumo da Opção de Estabelecimento de Conexão**

<table summary="Opções de linha de comando disponíveis para estabelecer conexões com o servidor."><thead><tr><th scope="col">Nome da Opção</th> <th scope="col">Descrição</th> <th scope="col">Introduzido</th> </tr></thead><tbody><tr><th>--default-auth</th> <td>Plugin de autenticação a ser usado</td> <td></td> </tr><tr><th>--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> </tr><tr><th>--senha</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> </tr><tr><th>--senha1</th> <td>Primeira senha de autenticação multifator a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> </tr><tr><th>--senha2</th> <td>Segunda senha de autenticação multifator a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> </tr><tr><th>--senha3</th> <td>Terceira senha de autenticação multifator a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> </tr><tr><th>--pipe</th> <td>Conecte-se ao servidor usando o pipe nomeado (apenas Windows)</td> <td></td> </tr><tr><th>--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> </tr><tr><th>--port</th> <td>Número de porta TCP/IP para a conexão</td> <td></td> </tr><tr><th>--protocolo</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> </tr><tr><th>--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> </tr><tr><th>--socket</th> <td>Arquivo de soquete Unix ou tubo nomeado do Windows a ser usado</td> <td></td> </tr><tr><th>--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> </tr></tbody></table>

- `--default-auth=plugin`

  <table summary="Propriedades para autenticação padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 8.2.17, “Autenticação Personalizável”.

- `--host=host_name`, `-h host_name`

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host=host_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>localhost</code>]]</td> </tr></tbody></table>

  O host em que o servidor MySQL está rodando. O valor pode ser um nome de host, endereço IPv4 ou endereço IPv6. O valor padrão é `localhost`.

- `--password[=pass_val]`, `-p[pass_val]`

  <table summary="Propriedades para senha"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--password[=passwor<code>[none]</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o programa cliente solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que o segue. Se nenhuma opção de senha for especificada, o padrão é não enviar nenhuma senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

  Para especificar explicitamente que não há senha e que o programa cliente não deve solicitar uma senha, use a opção `--skip-password`.

- `--password1[=pass_val]`

  <table summary="Propriedades para password1"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--password1[=password]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.27</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o programa cliente solicitará uma. Se for fornecida, não deve haver *espaço* entre `--password1=` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar nenhuma senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Consulte a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

  Para especificar explicitamente que não há senha e que o programa cliente não deve solicitar uma senha, use a opção `--skip-password1`.

  `--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

- `--password2[=pass_val]`

  <table summary="Propriedades para password2"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--password2[=password]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.27</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica do `--password1`; consulte a descrição dessa opção para obter detalhes.

- `--password3[=pass_val]`

  <table summary="Propriedades para password3"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--password3[=password]</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.27</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  A senha para o fator de autenticação multifator 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica do `--password1`; consulte a descrição dessa opção para obter detalhes.

- `--pipe`, `-W`

  <table summary="Propriedades para tubulação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--pipe</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  No Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--plugin-dir=dir_name`

  <table summary="Propriedades para plugin-dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--plugin-dir=dir_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o programa cliente não encontrá-lo. Veja a Seção 8.2.17, “Autenticação Personalizável”.

- `--port=port_num`, `-P port_num`

  <table summary="Propriedades para porto"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--port=port_num</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>3306</code>]]</td> </tr></tbody></table>

  Para conexões TCP/IP, o número de porta a ser usado. O número de porta padrão é 3306.

- `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table summary="Propriedades para autenticação padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>0

  Esta opção especifica explicitamente qual protocolo de transporte usar para se conectar ao servidor. É útil quando outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Por exemplo, as conexões no Unix para `localhost` são feitas usando um arquivo de socket Unix por padrão:

  ```
  mysql --host=localhost
  ```

  Para forçar o uso do transporte TCP/IP em vez disso, especifique uma opção `--protocol`:

  ```
  mysql --host=localhost --protocol=TCP
  ```

  A tabela a seguir mostra os valores permitidos da opção `--protocol` e indica as plataformas aplicáveis para cada valor. Os valores não são sensíveis ao caso.

  <table summary="Propriedades para autenticação padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>1

  Veja também a Seção 6.2.7, “Protocolos de Transporte de Conexão”

- `--shared-memory-base-name=name`

  <table summary="Propriedades para autenticação padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>2

  Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada para um servidor local. O valor padrão é \[\[`MYSQL`]. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

  Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

- `--socket=path`, `-S path`

  <table summary="Propriedades para autenticação padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>3

  Em Unix, o nome do arquivo de soquete Unix a ser usado para conexões feitas usando um tubo nomeado para um servidor local. O nome padrão do arquivo de soquete Unix é `/tmp/mysql.sock`.

  No Windows, o nome do pipe nomeado a ser usado para conexões a um servidor local. O nome padrão do pipe do Windows é `MySQL`. O nome do pipe não é case-sensitive.

  No Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--user=user_name`, `-u user_name`

  <table summary="Propriedades para autenticação padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>4

  O nome de usuário da conta MySQL a ser usado para se conectar ao servidor. O nome de usuário padrão é `ODBC` no Windows ou o nome de login do Unix no Unix.

#### Opções de comando para conexões criptografadas

Esta seção descreve as opções para programas cliente que especificam se devem ser usadas conexões criptografadas com o servidor, os nomes dos arquivos de certificado e chave, e outros parâmetros relacionados ao suporte de conexões criptografadas. Para exemplos de uso sugerido e como verificar se uma conexão está criptografada, consulte a Seção 8.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”.

Nota

Essas opções têm efeito apenas para conexões que utilizam um protocolo de transporte sujeito à criptografia; ou seja, conexões TCP/IP e Unix socket-file. Veja a Seção 6.2.7, “Protocolos de Transporte de Conexão”

Para obter informações sobre o uso de conexões criptografadas a partir da API C do MySQL, consulte Suporte para Conexões Criptografadas.

**Tabela 6.5 Resumo da opção de criptografia de conexão**

<table summary="Propriedades para autenticação padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>5

- `--get-server-public-key`

  <table summary="Propriedades para autenticação padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>6

  Peça à rede o par de chaves públicas necessário para a troca de senhas com base em pares de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Para obter informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Conectada a SHA-2”.

- `--server-public-key-path=file_name`

  <table summary="Propriedades para autenticação padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>7

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas com par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

  Esta opção está disponível apenas se o MySQL foi construído com o OpenSSL.

  Para obter informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação Conectada a SHA-256”, e a Seção 8.4.1.2, “Cache de Autenticação Conectada a SHA-2”.

- `--ssl-ca=file_name`

  <table summary="Propriedades para autenticação padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>8

  O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA) no formato PEM. O arquivo contém uma lista de Autoridades de Certificação SSL confiáveis.

  Para informar o cliente que não deve autenticar o certificado do servidor ao estabelecer uma conexão criptografada com o servidor, não especifique nem `--ssl-ca` nem `--ssl-capath`. O servidor ainda verifica o cliente de acordo com quaisquer requisitos aplicáveis estabelecidos para a conta do cliente e ainda usa quaisquer valores das variáveis de sistema `ssl_ca` ou `ssl_capath` especificados no lado do servidor.

  Para especificar o arquivo CA para o servidor, defina a variável de sistema `ssl_ca`.

- `--ssl-capath=dir_name`

  <table summary="Propriedades para autenticação padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--default-auth=plugin</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>9

  O nome do caminho do diretório que contém os arquivos de certificado da autoridade de certificação SSL (CA) confiável no formato PEM.

  Para informar o cliente que não deve autenticar o certificado do servidor ao estabelecer uma conexão criptografada com o servidor, não especifique nem `--ssl-ca` nem `--ssl-capath`. O servidor ainda verifica o cliente de acordo com quaisquer requisitos aplicáveis estabelecidos para a conta do cliente e ainda usa quaisquer valores das variáveis de sistema `ssl_ca` ou `ssl_capath` especificados no lado do servidor.

  Para especificar o diretório da CA do servidor, defina a variável de sistema `ssl_capath`.

- `--ssl-cert=file_name`

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host=host_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>localhost</code>]]</td> </tr></tbody></table>0

  O nome do caminho do arquivo de certificado público de SSL do cliente no formato PEM.

  Para especificar o arquivo de certificado da chave pública SSL do servidor, defina a variável de sistema `ssl_cert`.

  Nota

  O suporte a certificados SSL encadeados foi adicionado na versão 8.0.30; anteriormente, apenas o primeiro certificado era lido.

- `--ssl-cipher=cipher_list`

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host=host_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>localhost</code>]]</td> </tr></tbody></table>1

  A lista de cifra de criptografia permitida para conexões que utilizam protocolos TLS até o TLSv1.2. Se nenhuma cifra na lista for suportada, as conexões criptografadas que utilizam esses protocolos TLS não funcionarão.

  Para maior portabilidade, `cipher_list` deve ser uma lista de um ou mais nomes de cifra, separados por colchetes. Exemplos:

  ```
  --ssl-cipher=AES128-SHA
  --ssl-cipher=DHE-RSA-AES128-GCM-SHA256:AES128-SHA
  ```

  O OpenSSL suporta a sintaxe para especificar cifrares descritos na documentação do OpenSSL em <https://www.openssl.org/docs/manmaster/man1/ciphers.html>.

  Para obter informações sobre os criptogramas de encriptação suportados pelo MySQL, consulte a Seção 8.3.2, “Protocolos e criptogramas de conexão TLS encriptados”.

  Para especificar os criptogramas de criptografia para o servidor, defina a variável de sistema `ssl_cipher`.

- `--ssl-crl=file_name`

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host=host_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>localhost</code>]]</td> </tr></tbody></table>2

  O nome do caminho do arquivo que contém as listas de revogação de certificados no formato PEM.

  Se nem o `--ssl-crl` nem o `--ssl-crlpath` forem fornecidos, nenhuma verificação de CRL será realizada, mesmo que o caminho da CA contenha listas de revogação de certificados.

  Para especificar o arquivo da lista de revogação para o servidor, defina a variável de sistema `ssl_crl`.

- `--ssl-crlpath=dir_name`

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host=host_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>localhost</code>]]</td> </tr></tbody></table>3

  O nome do caminho do diretório que contém arquivos da lista de revogação de certificados no formato PEM.

  Se nem o `--ssl-crl` nem o `--ssl-crlpath` forem fornecidos, nenhuma verificação de CRL será realizada, mesmo que o caminho da CA contenha listas de revogação de certificados.

  Para especificar o diretório da lista de revogação para o servidor, defina a variável de sistema `ssl_crlpath`.

- `--ssl-fips-mode={OFF|ON|STRICT}`

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host=host_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>localhost</code>]]</td> </tr></tbody></table>4

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para determinar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

  Estes valores `--ssl-fips-mode` são permitidos:

  - `OFF`: Desative o modo FIPS.
  - `ON`: Habilitar o modo FIPS.
  - `STRICT`: Habilitar o modo FIPS "estricto".

  Nota

  Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente emita um aviso na inicialização e opere no modo não FIPS.

  Para especificar o modo FIPS do servidor, defina a variável de sistema `ssl_fips_mode`.

- `--ssl-key=file_name`

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host=host_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>localhost</code>]]</td> </tr></tbody></table>5

  O nome do caminho do arquivo de chave privada SSL do cliente no formato PEM. Para maior segurança, use um certificado com um tamanho de chave RSA de pelo menos 2048 bits.

  Se o arquivo de chave estiver protegido por uma senha, o programa cliente solicita ao usuário a senha. A senha deve ser fornecida interativamente; ela não pode ser armazenada em um arquivo. Se a senha estiver incorreta, o programa continua como se não conseguisse ler a chave.

  Para especificar o arquivo de chave privada SSL do servidor, defina a variável de sistema `ssl_key`.

- `--ssl-mode=mode`

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host=host_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>localhost</code>]]</td> </tr></tbody></table>6

  Esta opção especifica o estado de segurança desejado da conexão com o servidor. Esses valores de modo são permitidos, em ordem de rigor crescente:

  - `DISABLED`: Estabeleça uma conexão não criptografada.

  - `PREFERRED`: Estabeleça uma conexão criptografada se o servidor suportar conexões criptografadas, revertendo para uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Isso é o padrão se `--ssl-mode` não for especificado.

    As conexões através de arquivos de soquete Unix não são criptografadas com o modo `PREFERRED`. Para impor a criptografia para conexões de arquivos de soquete Unix, use um modo de `REQUIRED` ou mais rigoroso. (No entanto, o transporte de arquivos de soquete é seguro por padrão, portanto, criptografar uma conexão de arquivo de soquete não a torna mais segura e aumenta a carga da CPU.)

  - `REQUIRED`: Estabeleça uma conexão criptografada se o servidor suportar conexões criptografadas. A tentativa de conexão falha se uma conexão criptografada não puder ser estabelecida.

  - `VERIFY_CA`: Como `REQUIRED`, mas, adicionalmente, verifique o certificado da Autoridade de Certificação (CA) do servidor contra os certificados da CA configurados. A tentativa de conexão falha se nenhum certificado de CA correspondente válido for encontrado.

  - `VERIFY_IDENTITY`: Como `VERIFY_CA`, mas, além disso, realize a verificação da identidade do nome do host, verificando o nome do host que o cliente usa para se conectar ao servidor contra a identidade no certificado que o servidor envia ao cliente:

    - A partir do MySQL 8.0.12, se o cliente estiver usando o OpenSSL 1.0.2 ou superior, o cliente verifica se o nome do host que ele usa para se conectar corresponde ao valor da Alternativa de Nome do Assunto ou ao valor do Nome Comum no certificado do servidor. A verificação da identidade do nome do host também funciona com certificados que especificam o Nome Comum usando asteriscos.

    - Caso contrário, o cliente verifica se o nome do host que ele usa para se conectar corresponde ao valor do Nome Comum no certificado do servidor.

    A conexão falha se houver uma incompatibilidade. Para conexões criptografadas, essa opção ajuda a prevenir ataques de homem no meio.

    Nota

    A verificação de identidade do nome do host com `VERIFY_IDENTITY` não funciona com certificados autoassinados que são criados automaticamente pelo servidor ou manualmente usando **mysql\_ssl\_rsa\_setup** (consulte a Seção 8.3.3.1, “Criando Certificados e Chaves SSL e RSA Usando o MySQL”). Esses certificados autoassinados não contêm o nome do servidor como valor do Nome Comum.

  Importante

  A configuração padrão, `--ssl-mode=PREFERRED`, gera uma conexão criptografada se as outras configurações padrão não forem alteradas. No entanto, para ajudar a prevenir ataques sofisticados de intermediário, é importante que o cliente verifique a identidade do servidor. As configurações `--ssl-mode=VERIFY_CA` e `--ssl-mode=VERIFY_IDENTITY` são uma escolha melhor do que a configuração padrão para ajudar a prevenir esse tipo de ataque. Para implementar uma dessas configurações, você deve primeiro garantir que o certificado da CA do servidor esteja disponível de forma confiável para todos os clientes que o utilizam em seu ambiente, caso contrário, problemas de disponibilidade ocorrerão. Por essa razão, elas não são a configuração padrão.

  A opção `--ssl-mode` interage com as opções de certificado CA da seguinte forma:

  - Se `--ssl-mode` não for explicitamente definido de outra forma, o uso de `--ssl-ca` ou `--ssl-capath` implica em `--ssl-mode=VERIFY_CA`.

  - Para valores de `--ssl-mode` de `VERIFY_CA` ou `VERIFY_IDENTITY`, também é necessário `--ssl-ca` ou `--ssl-capath`, para fornecer um certificado CA que corresponda ao usado pelo servidor.

  - Uma opção explícita `--ssl-mode` com um valor diferente de `VERIFY_CA` ou `VERIFY_IDENTITY`, juntamente com uma opção explícita `--ssl-ca` ou `--ssl-capath`, produz um aviso de que não é realizada nenhuma verificação do certificado do servidor, apesar de uma opção de certificado CA ter sido especificada.

  Para exigir o uso de conexões criptografadas por uma conta MySQL, use `CREATE USER` para criar a conta com uma cláusula `REQUIRE SSL`, ou use `ALTER USER` para uma conta existente para adicionar uma cláusula `REQUIRE SSL`. Isso faz com que as tentativas de conexão por clientes que usam a conta sejam rejeitadas, a menos que o MySQL suporte conexões criptografadas e uma conexão criptografada possa ser estabelecida.

  A cláusula `REQUIRE` permite outras opções relacionadas à criptografia, que podem ser usadas para impor requisitos de segurança mais rigorosos do que `REQUIRE SSL`. Para obter detalhes adicionais sobre quais opções de comando podem ou devem ser especificadas por clientes que se conectam usando contas configuradas usando as várias opções `REQUIRE`, consulte Opções de Criação de Usuário SSL/TLS.

- `--ssl-session-data=file_name`

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host=host_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>localhost</code>]]</td> </tr></tbody></table>7

  O nome do caminho do arquivo de dados da sessão SSL do cliente no formato PEM para reutilização da sessão.

  Quando você invoca um programa cliente MySQL com a opção `--ssl-session-data`, o cliente tenta deserializar os dados da sessão do arquivo, se fornecido, e, em seguida, usá-los para estabelecer uma nova conexão. Se você fornecer um arquivo, mas a sessão não for reutilizada, a conexão falhará, a menos que você também tenha especificado a opção `--ssl-session-data-continue-on-failed-reuse` na linha de comando quando invocou o programa cliente.

  O comando **mysql**, `ssl_session_data_print`, gera o arquivo de dados da sessão (consulte a Seção 6.5.1.2, “Comandos do cliente MySQL”).

- `ssl-session-data-continue-on-failed-reuse`

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host=host_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>localhost</code>]]</td> </tr></tbody></table>8

  Controla se uma nova conexão é iniciada para substituir uma conexão que tentou, mas falhou, em reutilizar os dados da sessão especificados com a opção de linha de comando `--ssl-session-data`. Por padrão, a opção de linha de comando `--ssl-session-data-continue-on-failed-reuse` está desativada, o que faz com que um programa cliente retorne um erro de conexão quando os dados da sessão são fornecidos e não reutilizados.

  Para garantir que uma nova conexão não relacionada seja aberta após a reinicialização da sessão ocorrer sem erros, invocando os programas do cliente MySQL com as opções de linha de comando `--ssl-session-data` e `--ssl-session-data-continue-on-failed-reuse`.

- `--tls-ciphersuites=ciphersuite_list`

  <table summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host=host_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>localhost</code>]]</td> </tr></tbody></table>9

  Esta opção especifica quais conjuntos de cifra o cliente permite para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de nomes de conjuntos de cifra separados por vírgula ou mais. Por exemplo:

  ```
  mysql --tls-ciphersuites="suite1:suite2:suite3"
  ```

  As suítes de cifra que podem ser nomeadas para essa opção dependem da biblioteca SSL usada para compilar o MySQL. Se essa opção não for definida, o cliente permite o conjunto padrão de suítes de cifra. Se a opção for definida como uma string vazia, nenhuma suíte de cifra será habilitada e conexões criptografadas não poderão ser estabelecidas. Para mais informações, consulte a Seção 8.3.2, “Protocolos e Suítes de Cifra de Conexão Encriptada”.

  Essa opção foi adicionada no MySQL 8.0.16.

  Para especificar quais conjuntos de cifra o servidor permite, defina a variável de sistema `tls_ciphersuites`.

- `--tls-version=protocol_list`

  <table summary="Propriedades para senha"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--password[=passwor<code>[none]</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>0

  Esta opção especifica os protocolos TLS que o cliente permite para conexões criptografadas. O valor é uma lista de uma ou mais versões de protocolo separadas por vírgula. Por exemplo:

  ```
  mysql --tls-version="TLSv1.2,TLSv1.3"
  ```

  Os protocolos que podem ser nomeados para essa opção dependem da biblioteca SSL usada para compilar o MySQL e da versão do MySQL Server.

  Importante

  - O suporte aos protocolos de conexão TLSv1 e TLSv1.1 foi removido do MySQL Server a partir do MySQL 8.0.28. Os protocolos foram desatualizados a partir do MySQL 8.0.26, embora os clientes do MySQL Server não retornem avisos ao usuário se uma versão desatualizada do protocolo TLS for usada. A partir do MySQL 8.0.28, clientes, incluindo o MySQL Shell, que suportam a opção `--tls-version`, não podem fazer uma conexão TLS/SSL com o protocolo definido como TLSv1 ou TLSv1.1. Se um cliente tentar se conectar usando esses protocolos, para conexões TCP, a conexão falha e um erro é retornado ao cliente. Para conexões de soquete, se `--ssl-mode` for definido como `REQUIRED`, a conexão falha, caso contrário, a conexão é feita, mas com TLS/SSL desativado. Consulte a Remoção do Suporte aos Protocolos TLSv1 e TLSv1.1 para obter mais informações.

  - O suporte ao protocolo TLSv1.3 está disponível no MySQL Server a partir do MySQL 8.0.16, desde que o MySQL Server tenha sido compilado com o OpenSSL 1.1.1 ou superior. O servidor verifica a versão do OpenSSL no momento do início, e se for menor que 1.1.1, o TLSv1.3 é removido do valor padrão das variáveis do sistema do servidor relacionadas à versão TLS (como a variável `tls_version`).

  Os protocolos permitidos devem ser escolhidos para não deixar "buracos" na lista. Por exemplo, esses valores não têm buracos:

  ```
  --tls-version="TLSv1,TLSv1.1,TLSv1.2,TLSv1.3"
  --tls-version="TLSv1.1,TLSv1.2,TLSv1.3"
  --tls-version="TLSv1.2,TLSv1.3"
  --tls-version="TLSv1.3"

  From MySQL 8.0.28, only the last two values are suitable.
  ```

  Esses valores têm buracos e não devem ser usados:

  ```
  --tls-version="TLSv1,TLSv1.2"
  --tls-version="TLSv1.1,TLSv1.3"
  ```

  Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifra de conexão criptografada TLS”.

  Para especificar quais protocolos TLS o servidor permite, defina a variável de sistema `tls_version`.

#### Opções de comando para compressão de conexão

Esta seção descreve as opções que permitem aos programas cliente controlar o uso da compressão para conexões com o servidor. Para obter informações adicionais e exemplos de como usá-las, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

**Tabela 6.6 Resumo da opção de compressão de conexão**

<table summary="Propriedades para senha"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--password[=passwor<code>[none]</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>1

- `--compress`, `-C`

  <table summary="Propriedades para senha"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--password[=passwor<code>[none]</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>2

  Compressa todas as informações enviadas entre o cliente e o servidor, se possível.

  A partir do MySQL 8.0.18, essa opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL. Consulte Configurando a Compressão de Conexão Legado.

- `--compression-algorithms=value`

  <table summary="Propriedades para senha"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--password[=passwor<code>[none]</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>3

  Os algoritmos de compressão permitidos para conexões ao servidor. Os algoritmos disponíveis são os mesmos da variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

  Essa opção foi adicionada no MySQL 8.0.18.

- `--zstd-compression-level=level`

  <table summary="Propriedades para senha"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--password[=passwor<code>[none]</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>4

  O nível de compressão a ser usado para conexões com o servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos variam de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão `zstd` é 3. A configuração do nível de compressão não afeta conexões que não utilizam a compressão `zstd`.

  Essa opção foi adicionada no MySQL 8.0.18.
