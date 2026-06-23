## 6.4 Programas relacionados à instalação

Os programas desta seção são usados durante a instalação ou atualização do MySQL.

### 6.4.1 comp_err — Arquivo de Mensagem de Erro de Compilação do MySQL

**comp_err** cria o arquivo `errmsg.sys` que é usado pelo **mysqld** para determinar as mensagens de erro a serem exibidas para diferentes códigos de erro. **comp_err** normalmente é executado automaticamente quando o MySQL é compilado. Ele compila o arquivo `errmsg.sys` a partir de informações de erro em formato de texto nas distribuições de fonte do MySQL:

* a partir do MySQL 8.0.19, as informações de erro vêm dos arquivos `messages_to_error_log.txt` e `messages_to_clients.txt` no diretório `share`.

Para mais informações sobre a definição de mensagens de erro, consulte os comentários dentro desses arquivos, juntamente com o arquivo `errmsg_readme.txt`.

* Antes do MySQL 8.0.19, as informações de erro vêm do arquivo `errmsg-utf8.txt` no diretório `sql/share`.

O **comp_err** também gera os arquivos de cabeçalho `mysqld_error.h`, `mysqld_ername.h` e `mysqld_errmsg.h`.

Invoque **comp_err** da seguinte forma:

```
comp_err [options]
```

**comp_err** suporta as seguintes opções.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--charset=dir_name`, `-C dir_name`

  <table frame="box" rules="all" summary="Properties for charset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--charset</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>../share/charsets</code></td> </tr></tbody></table>

O diretório do conjunto de caracteres. O padrão é `../sql/share/charsets`.

* `--debug=debug_options`, `-# debug_options`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug=options</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:O,/tmp/comp_err.trace</code></td> </tr></tbody></table>

Escreva um registro de depuração. Uma string típica *`debug_options`* é `d:t:O,file_name`. O padrão é `d:t:O,/tmp/comp_err.trace`.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Properties for debug-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

Imprima algumas informações de depuração quando o programa sair.

* `--errmsg-file=file_name`, `-H file_name`

  <table frame="box" rules="all" summary="Properties for errmsg-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--errmsg-file=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>mysqld_errmsg.h</code></td> </tr></tbody></table>

O nome do arquivo de mensagem de erro. O padrão é `mysqld_errmsg.h`. Esta opção foi adicionada no MySQL 8.0.18.

* `--header-file=file_name`, `-H file_name`

  <table frame="box" rules="all" summary="Properties for header-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--header-file=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>mysqld_error.h</code></td> </tr></tbody></table>

O nome do arquivo de cabeçalho de erro. O padrão é `mysqld_error.h`.

* `--in-file=file_name`, `-F file_name`

  <table frame="box" rules="all" summary="Properties for in-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--in-file=path</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

O nome do arquivo de entrada. O padrão é `../share/errmsg-utf8.txt`.

Essa opção foi removida no MySQL 8.0.19 e substituída pelas opções `--in-file-errlog` e `--in-file-toclient`.

* `--in-file-errlog=file_name`, `-e file_name`

  <table frame="box" rules="all" summary="Properties for in-file-errlog"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--in-file-errlog</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>../share/messages_to_error_log.txt</code></td> </tr></tbody></table>

O nome do arquivo de entrada que define as mensagens de erro que devem ser escritas no log de erro. O padrão é `../share/messages_to_error_log.txt`.

Essa opção foi adicionada no MySQL 8.0.19.

* `--in-file-toclient=file_name`, `-c file_name`

  <table frame="box" rules="all" summary="Properties for in-file-toclient"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--in-file-toclient=path</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>../share/messages_to_clients.txt</code></td> </tr></tbody></table>

O nome do arquivo de entrada que define as mensagens de erro que devem ser escritas aos clientes. O padrão é `../share/messages_to_clients.txt`.

Essa opção foi adicionada no MySQL 8.0.19.

* `--name-file=file_name`, `-N file_name`

  <table frame="box" rules="all" summary="Properties for name-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--name-file=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>mysqld_ername.h</code></td> </tr></tbody></table>

O nome do arquivo de nome do erro. O padrão é `mysqld_ername.h`.

* `--out-dir=dir_name`, `-D dir_name`

  <table frame="box" rules="all" summary="Properties for charset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--charset</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>../share/charsets</code></td> </tr></tbody></table>0

O nome do diretório de base de saída. O padrão é `../sql/share/`.

* `--out-file=file_name`, `-O file_name`

  <table frame="box" rules="all" summary="Properties for charset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--charset</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>../share/charsets</code></td> </tr></tbody></table>1

O nome do arquivo de saída. O padrão é `errmsg.sys`.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for charset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--charset</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>../share/charsets</code></td> </tr></tbody></table>2

Exibir informações da versão e sair.

### 6.4.2 mysql_secure_installation — Melhorar a segurança da instalação do MySQL

Este programa permite que você melhore a segurança da sua instalação do MySQL das seguintes maneiras:

* Você pode definir uma senha para as contas `root`. * Você pode remover contas `root` que são acessíveis de fora do host local.

* Você pode remover contas de usuários anônimos. * Você pode remover o banco de dados `test` (que, por padrão, pode ser acessado por todos os usuários, incluindo usuários anônimos) e privilégios que permitem que qualquer pessoa acesse bancos de dados com nomes que comecem com `test_`.

O **mysql_secure_installation** ajuda você a implementar recomendações de segurança semelhantes às descritas na Seção 2.9.4, “Segurança da conta inicial do MySQL”.

O uso normal é conectar-se ao servidor MySQL local; invocar **mysql_secure_installation** sem argumentos:

```
mysql_secure_installation
```

Quando executado, o **mysql_secure_installation** solicita que você determine quais ações executar.

O componente `validate_password` pode ser usado para verificar a força da senha. Se o plugin não estiver instalado, o **mysql_secure_installation** solicita ao usuário se ele deve instalá-lo. Quaisquer senhas inseridas posteriormente são verificadas usando o plugin se ele estiver habilitado.

A maioria das opções do cliente MySQL padrão, como `--host` e `--port`, pode ser usada na linha de comando e em arquivos de opção. Por exemplo, para se conectar ao servidor local via IPv6 usando a porta 3307, use este comando:

```
mysql_secure_installation --host=::1 --port=3307
```

O **mysql_secure_installation** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysql_secure_installation]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas do MySQL, consulte a Seção 6.2.2.2, “Usando arquivos de opções”.

**Tabela 6.9 Opções de mysql_secure_installation**

<table frame="box" rules="all" summary="Command-line options available for mysql_secure_installation."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--defaults-extra-file</th> <td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Não leia arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Accepted but always ignored. Whenever mysql_secure_installation is invoked, the user is prompted for a password, regardless</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th scope="row">--use-default</th> <td>Execute sem interatividade do usuário</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysql_secure_installation** normalmente lê os grupos `[client]` e `[mysql_secure_installation]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysql_secure_installation** também lê os grupos `[client_other]` e `[mysql_secure_installation_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>

Conecte-se ao servidor MySQL no host fornecido.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for no-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para evitar que elas sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Ferramenta de Configuração do MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--password=password`, `-p password`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password=password</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Essa opção é aceita, mas ignorada. Se essa opção for usada ou não, o **mysql_secure_installation** sempre solicita uma senha ao usuário.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for port"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--port=port_num</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>3306</code></td> </tr></tbody></table>

Para conexões TCP/IP, o número de porta a ser utilizado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for print-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de outro protocolo que não o desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do tubo nomeado a ser usado.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

As opções que começam com `--ssl` especificam se deve conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Veja Opções de comando para conexões criptografadas.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para determinar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

Esses valores `--ssl-fips-mode` são permitidos:

+ `OFF`: Desabilitar o modo FIPS.  
  + `ON`: Habilitar o modo FIPS.  
  + `STRICT`: Habilitar o modo FIPS "estricto".

Nota

Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Neste caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza um aviso na inicialização e opere no modo não FIPS.

A partir do MySQL 8.0.34, essa opção é desatualizada. A espera é que ela seja removida em uma versão futura do MySQL.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

As sequências de cifra permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de sequência de cifra separados por vírgula. As sequências de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL utilizada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifras de conexão criptografada TLS”.

Essa opção foi adicionada no MySQL 8.0.16.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifras TLS de conexão criptografada”.

* `--use-default`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

Execute não interativamente. Esta opção pode ser usada para operações de instalação sem supervisão.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.

### 6.4.3 mysql_ssl_rsa_setup — Criar arquivos SSL/RSA

Nota

O **mysql_ssl_rsa_setup** é descontinuado a partir do MySQL 8.0.34. Em vez disso, considere usar o servidor MySQL para gerar automaticamente os arquivos SSL e RSA ausentes no início (consulte Geração automática de arquivos SSL e RSA).

Este programa cria os arquivos de certificado SSL e chave e os arquivos de par de chave RSA necessários para suportar conexões seguras usando SSL e troca segura de senhas usando RSA em conexões não criptografadas, se esses arquivos estiverem ausentes. **mysql_ssl_rsa_setup** também pode ser usado para criar novos arquivos SSL se os existentes tiverem expirado.

Nota

**mysql_ssl_rsa_setup** utiliza o comando **openssl**, portanto, seu uso depende da instalação do OpenSSL em sua máquina.

Outra maneira de gerar arquivos SSL e RSA, para distribuições MySQL compiladas usando OpenSSL, é fazer com que o servidor os gere automaticamente. Veja a Seção 8.3.3.1, “Criando certificados e chaves SSL e RSA usando MySQL”.

Importante

O **mysql_ssl_rsa_setup** ajuda a reduzir a barreira para o uso do SSL, tornando mais fácil gerar os arquivos necessários. No entanto, os certificados gerados pelo **mysql_ssl_rsa_setup** são autoassinados, o que não é muito seguro. Depois de ganhar experiência usando os arquivos criados pelo **mysql_ssl_rsa_setup**, considere obter um certificado CA de uma autoridade de certificação registrada.

Invoque **mysql_ssl_rsa_setup** da seguinte forma:

```
mysql_ssl_rsa_setup [options]
```

As opções típicas são `--datadir` para especificar onde criar os arquivos e `--verbose` para ver os comandos do **openssl** que o **mysql_ssl_rsa_setup** executa.

O **mysql_ssl_rsa_setup** tenta criar arquivos SSL e RSA usando um conjunto padrão de nomes de arquivos. Funciona da seguinte forma:

1. **mysql_ssl_rsa_setup** verifica o binário **openssl** nos locais especificados pela variável de ambiente `PATH`. Se o **openssl** não for encontrado, **mysql_ssl_rsa_setup** não faz nada. Se o **openssl** estiver presente, **mysql_ssl_rsa_setup** procura os arquivos SSL e RSA padrão no diretório de dados do MySQL especificado pela opção `--datadir`, ou no diretório de dados incorporado se a opção `--datadir` não for fornecida.

2. **mysql_ssl_rsa_setup** verifica o diretório de dados em busca de arquivos SSL com os seguintes nomes:

   ```
   ca.pem
   server-cert.pem
   server-key.pem
   ```

3. Se algum desses arquivos estiver presente, o **mysql_ssl_rsa_setup** não cria arquivos SSL. Caso contrário, ele invoca o **openssl** para criá-los, além de alguns arquivos adicionais:

   ```
   ca.pem               Self-signed CA certificate
   ca-key.pem           CA private key
   server-cert.pem      Server certificate
   server-key.pem       Server private key
   client-cert.pem      Client certificate
   client-key.pem       Client private key
   ```

Esses arquivos permitem conexões seguras com o cliente usando SSL; veja a Seção 8.3.1, “Configurando o MySQL para usar conexões criptografadas”.

4. **mysql_ssl_rsa_setup** verifica o diretório de dados em busca de arquivos RSA com os seguintes nomes:

   ```
   private_key.pem      Private member of private/public key pair
   public_key.pem       Public member of private/public key pair
   ```

5. Se algum desses arquivos estiver presente, o **mysql_ssl_rsa_setup** não cria arquivos RSA. Caso contrário, ele invoca o **openssl** para criá-los. Esses arquivos permitem a troca segura de senhas usando RSA em conexões não criptografadas para contas autenticadas pelo plugin `sha256_password` ou `caching_sha2_password`; veja Seção 8.4.1.3, “Autenticação Plugável SHA-256”, e Seção 8.4.1.2, “Cacheamento da Autenticação Plugável SHA-2”.

Para obter informações sobre as características dos arquivos criados pelo **mysql_ssl_rsa_setup**, consulte a Seção 8.3.3.1, “Criando certificados e chaves SSL e RSA usando MySQL”.

Ao iniciar, o servidor MySQL utiliza automaticamente os arquivos SSL criados pelo **mysql_ssl_rsa_setup** para habilitar o SSL se não forem fornecidas opções SSL explícitas, exceto `--ssl` (possivelmente juntamente com `ssl_cipher`). Se você prefere designar os arquivos explicitamente, invoque clientes com as opções `--ssl-ca`, `--ssl-cert` e `--ssl-key` ao iniciar para nomear os arquivos `ca.pem`, `server-cert.pem` e `server-key.pem`, respectivamente.

O servidor também usa automaticamente os arquivos RSA criados pelo **mysql_ssl_rsa_setup** para habilitar o RSA, caso não sejam fornecidas opções explícitas de RSA.

Se o servidor estiver habilitado para SSL, os clientes usam SSL por padrão para a conexão. Para especificar explicitamente os arquivos de certificado e chave, use as opções `--ssl-ca`, `--ssl-cert` e `--ssl-key` para nomear os arquivos `ca.pem`, `client-cert.pem` e `client-key.pem`, respectivamente. No entanto, pode ser necessário realizar algumas configurações adicionais no cliente, pois o **mysql_ssl_rsa_setup** cria, por padrão, esses arquivos no diretório de dados. As permissões do diretório de dados normalmente permitem acesso apenas à conta do sistema que executa o servidor MySQL, portanto, os programas de cliente não podem usar arquivos localizados lá. Para tornar os arquivos disponíveis, copie-os para um diretório que seja legível (mas *não* gravável) pelos clientes:

* Para clientes locais, o diretório de instalação do MySQL pode ser usado. Por exemplo, se o diretório de dados for um subdiretório do diretório de instalação e sua localização atual for o diretório de dados, você pode copiar os arquivos da seguinte forma:

  ```
  cp ca.pem client-cert.pem client-key.pem ..
  ```

* Para clientes remotos, distribua os arquivos por meio de um canal seguro para garantir que não sejam adulterados durante o trânsito.

Se os arquivos SSL usados para uma instalação do MySQL expiraram, você pode usar **mysql_ssl_rsa_setup** para criar novos:

1. Parar o servidor. 2. Renomear ou remover os arquivos SSL existentes. Você pode querer fazer um backup deles primeiro. (Os arquivos RSA não expiram, então você não precisa removê-los. **mysql_ssl_rsa_setup** pode ver que eles existem e não os sobrescreve.)

3. Execute o **mysql_ssl_rsa_setup** com a opção `--datadir` para especificar onde criar os novos arquivos.

4. Reinicie o servidor.

O **mysql_ssl_rsa_setup** suporta as seguintes opções de linha de comando, que podem ser especificadas na linha de comando ou nos grupos `[mysql_ssl_rsa_setup]` e `[mysqld]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas do MySQL, consulte a Seção 6.2.2.2, “Usando arquivos de opções”.

**Tabela 6.10 Opções de mysql_ssl_rsa_setup**

<table frame="box" rules="all" summary="Command-line options available for mysql_ssl_rsa_setup."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Option Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td>--datadir</td> <td>Caminho para o diretório de dados</td> </tr><tr><td>--help</td> <td>Exibir mensagem de ajuda e sair</td> </tr><tr><td>--suffix</td> <td>Sufixo para o atributo Nome comum do certificado X.509</td> </tr><tr><td>--uid</td> <td>Nome do usuário eficaz a ser usado para permissões de arquivo</td> </tr><tr><td>--verbose</td> <td>Modo verbosos</td> </tr><tr><td>--version</td> <td>Exibir informações da versão e sair</td> </tr></tbody></table>

* `--help`, `?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma mensagem de ajuda e sair.

* `--datadir=dir_name`

  <table frame="box" rules="all" summary="Properties for datadir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--datadir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

O caminho para o diretório que o **mysql_ssl_rsa_setup** deve verificar para arquivos SSL e RSA padrão e em qual deve criar arquivos se eles estiverem ausentes. O padrão é o diretório de dados integrado.

* `--suffix=str`

  <table frame="box" rules="all" summary="Properties for suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--suffix=str</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

O sufixo para o atributo Nome Comum em certificados X.509. O valor do sufixo é limitado a 17 caracteres. O padrão é baseado no número da versão do MySQL.

* `--uid=name`, `-v`

  <table frame="box" rules="all" summary="Properties for uid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--uid=name</code></td> </tr></tbody></table>

O nome do usuário que deve ser o proprietário de quaisquer arquivos criados. O valor é um nome de usuário, não um ID de usuário numérico. Na ausência desta opção, os arquivos criados por **mysql_ssl_rsa_setup** são propriedade do usuário que os executa. Esta opção é válida apenas se você executar o programa como `root` em um sistema que suporte a chamada de sistema `chown()`.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr></tbody></table>

Modo detalhado. Produza mais informações sobre o que o programa faz. Por exemplo, o programa mostra os comandos do **openssl** que ele executa e produz saída para indicar se ele ignora a criação de arquivos SSL ou RSA porque algum arquivo padrão já existe.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for version"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--version</code></td> </tr></tbody></table>

Exibir informações da versão e sair.

### 6.4.4 mysql_tzinfo_to_sql — Carregar as tabelas de fuso horário

O programa **mysql_tzinfo_to_sql** carrega as tabelas de fuso horário no banco de dados `mysql`. Ele é usado em sistemas que possuem um banco de dados de zoneinfo (o conjunto de arquivos que descrevem fusos horários). Exemplos desses sistemas são Linux, FreeBSD, Solaris e macOS. Um local provável para esses arquivos é o diretório `/usr/share/zoneinfo` (`/usr/share/lib/zoneinfo` em Solaris). Se o seu sistema não possui um banco de dados de zoneinfo, você pode usar o pacote para download descrito na Seção 7.1.15, “Suporte de fuso horário do MySQL Server”.

**mysql_tzinfo_to_sql** pode ser invocado de várias maneiras:

```
mysql_tzinfo_to_sql tz_dir
mysql_tzinfo_to_sql tz_file tz_name
mysql_tzinfo_to_sql --leap tz_file
```

Para a sintaxe de invocação inicial, passe o nome do caminho do diretório zoneinfo para **mysql_tzinfo_to_sql** e envie a saída para o programa **mysql**. Por exemplo:

```
mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root mysql
```

O **mysql_tzinfo_to_sql** lê os arquivos de fuso horário do seu sistema e gera declarações SQL a partir deles. O **mysql** processa essas declarações para carregar as tabelas de fuso horário.

A segunda sintaxe faz com que **mysql_tzinfo_to_sql** carregue um único arquivo de fuso horário *`tz_file`* que corresponde a um nome de fuso horário *`tz_name`*:

```
mysql_tzinfo_to_sql tz_file tz_name | mysql -u root mysql
```

Se o seu fuso horário precisar considerar segundos intercalares, invoque **mysql_tzinfo_to_sql** usando o terceiro sintaxe, que inicializa as informações sobre os segundos intercalares. *`tz_file`* é o nome do seu arquivo de fuso horário:

```
mysql_tzinfo_to_sql --leap tz_file | mysql -u root mysql
```

Após executar **mysql_tzinfo_to_sql**, é melhor reiniciar o servidor para que ele não continue a usar quaisquer dados de fuso horário previamente cacheados.

### 6.4.5 mysql_upgrade — Verificar e atualizar tabelas do MySQL

Nota

A partir do MySQL 8.0.16, o servidor MySQL executa as tarefas de atualização anteriormente gerenciadas pelo **mysql_upgrade** (para detalhes, consulte a Seção 3.4, “O que o processo de atualização do MySQL atualiza”). Consequentemente, o **mysql_upgrade** não é mais necessário e é descontinuado a partir dessa versão; espere que ele seja removido em uma versão futura do MySQL. Como o **mysql_upgrade** não executa mais as tarefas de atualização, ele sai com o status 0 incondicionalmente.

Cada vez que você atualizar o MySQL, você deve executar o **mysql_upgrade**, que procura incompatibilidades com o servidor MySQL atualizado:

* Atualiza as tabelas do sistema no esquema `mysql` para que você possa aproveitar novos privilégios ou capacidades que possam ter sido adicionadas.

* Atualiza o esquema de desempenho, `INFORMATION_SCHEMA` e `sys`.

* Examina os esquemas do usuário.

Se o **mysql_upgrade** encontrar que uma tabela tem uma possível incompatibilidade, ele realiza uma verificação da tabela e, se problemas forem encontrados, tenta uma reparação da tabela. Se a tabela não puder ser reparada, consulte a Seção 3.14, “Reconstrução ou reparação de tabelas ou índices”, para estratégias de reparação manual de tabelas.

O **mysql_upgrade** comunica diretamente com o servidor MySQL, enviando-lhe as instruções SQL necessárias para realizar uma atualização.

Cuidado

Você deve sempre fazer um backup da sua instalação MySQL atual *antes* de realizar uma atualização. Veja a Seção 9.2, “Métodos de backup de banco de dados”.

Algumas incompatibilidades de atualização podem exigir um tratamento especial *antes* de atualizar sua instalação do MySQL e executar o **mysql_upgrade**. Consulte o Capítulo 3, *Atualizando o MySQL*, para obter instruções sobre como determinar se tais incompatibilidades se aplicam à sua instalação e como lidar com elas.

Use o **mysql_upgrade** da seguinte forma:

1. Certifique-se de que o servidor está em execução. 2. Inicie o **mysql_upgrade** para atualizar as tabelas do sistema no esquema `mysql` e verifique e repare as tabelas em outros esquemas:

   ```
   mysql_upgrade [options]
   ```

3. Parar o servidor e reiniciá-lo para que quaisquer alterações nas tabelas do sistema sejam efetivas.

Se você tem várias instâncias do servidor MySQL a serem atualizadas, invoque **mysql_upgrade** com os parâmetros de conexão apropriados para se conectar a cada um dos servidores desejados. Por exemplo, com servidores que rodam no host local nas partes 3306 a 3308, atualize cada um deles conectando-se à porta apropriada:

```
mysql_upgrade --protocol=tcp -P 3306 [other_options]
mysql_upgrade --protocol=tcp -P 3307 [other_options]
mysql_upgrade --protocol=tcp -P 3308 [other_options]
```

Para conexões de host local em Unix, a opção `--protocol=tcp` força uma conexão usando TCP/IP em vez do arquivo de soquete Unix.

Por padrão, o **mysql_upgrade** é executado como o usuário `root` do MySQL. Se a senha do `root` expirar quando você executar o **mysql_upgrade**, ele exibirá uma mensagem dizendo que sua senha expirou e que o **mysql_upgrade** falhou como resultado. Para corrigir isso, reconfigure a senha do `root` para que ela não expire e execute o **mysql_upgrade** novamente. Primeiro, conecte-se ao servidor como `root`:

```
$> mysql -u root -p
Enter password: ****  <- enter root password here
```

Redefinir a senha usando `ALTER USER`(alter-user.html "15.7.1.1 ALTER USER Statement"):

```
mysql> ALTER USER USER() IDENTIFIED BY 'root-password';
```

Em seguida, saia do **mysql** e execute novamente o **mysql_upgrade**:

```
$> mysql_upgrade [options]
```

Nota

Se você executar o servidor com a variável de sistema `disabled_storage_engines` definida para desabilitar determinados motores de armazenamento (por exemplo, `MyISAM`), o **mysql_upgrade** pode falhar com um erro como este:

```
mysql_upgrade: [ERROR] 3161: Storage engine MyISAM is disabled
(Table creation is disallowed).
```

Para lidar com isso, reinicie o servidor com `disabled_storage_engines` desativado. Depois disso, você deve ser capaz de executar o **mysql_upgrade** com sucesso. Após isso, reinicie o servidor com `disabled_storage_engines` definido para seu valor original.

A menos que invocado com a opção `--upgrade-system-tables`, o **mysql_upgrade** processa todas as tabelas em todos os esquemas do usuário conforme necessário. O verificação de tabelas pode levar um longo tempo para ser concluída. Cada tabela é bloqueada e, portanto, indisponível para outras sessões enquanto está sendo processada. As operações de verificação e reparo podem ser demoradas, especialmente para tabelas grandes. O verificação de tabelas usa a opção `FOR UPGRADE` da declaração `CHECK TABLE`. Para obter detalhes sobre o que essa opção implica, consulte a Seção 15.7.3.2, “Declaração CHECK TABLE”.

O **mysql_upgrade** marca todas as tabelas verificadas e reparadas com o número atual da versão do MySQL. Isso garante que, na próxima vez que você executar o **mysql_upgrade** com a mesma versão do servidor, possa ser determinado se há necessidade de verificar ou reparar novamente uma determinada tabela.

O **mysql_upgrade** salva o número da versão do MySQL em um arquivo chamado `mysql_upgrade_info` no diretório de dados. Isso é usado para verificar rapidamente se todas as tabelas foram verificadas para esta versão, para que o verificação de tabelas possa ser ignorada. Para ignorar este arquivo e realizar a verificação independentemente, use a opção `--force`.

Nota

O arquivo `mysql_upgrade_info` é desatualizado; espere que ele seja removido em uma versão futura do MySQL.

O **mysql_upgrade** verifica as linhas da tabela `mysql.user` do sistema e, para qualquer linha com uma coluna `plugin` vazia, define essa coluna para `'mysql_native_password'` se as credenciais utilizarem um formato de hash compatível com esse plugin. As linhas com um hash de senha pré-4.1 devem ser atualizadas manualmente.

O **mysql_upgrade** não atualiza o conteúdo das tabelas de fuso horário ou das tabelas de ajuda. Para obter instruções de atualização, consulte a Seção 7.1.15, “Suporte de fuso horário do MySQL Server”, e a Seção 7.1.17, “Suporte de ajuda no lado do servidor”.

A menos que invocado com a opção `--skip-sys-schema`, o **mysql_upgrade** instala o esquema `sys` se ele não estiver instalado e o atualiza para a versão atual, caso contrário. Um erro ocorre se um esquema `sys` existir, mas não tiver nenhuma visão `version`, assumindo que sua ausência indica um esquema criado pelo usuário:

```
A sys schema exists with no sys.version view. If
you have a user created sys schema, this must be renamed for the
upgrade to succeed.
```

Para fazer uma atualização neste caso, remova ou renomeie primeiro o esquema existente `sys`.

O **mysql_upgrade** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysql_upgrade]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas do MySQL, consulte a Seção 6.2.2.2, “Usando arquivos de opções”.

**Tabela 6.11 Opções de mysql_upgrade**

<table frame="box" rules="all" summary="Command-line options available for mysql_upgrade."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--bind-address</th> <td>Use a interface de rede especificada para se conectar ao servidor MySQL</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Diretório onde os conjuntos de caracteres são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compressar todas as informações enviadas entre o cliente e o servidor</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Algoritmos de compressão permitidos para conexões ao servidor</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Imprimir informações de depuração quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Imprimir informações de depuração, memória e estatísticas de CPU quando o programa sai</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Plugin de autenticação a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Especificar o conjunto de caracteres padrão</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Valor do sufixo do grupo de opções</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Force execution even if mysql_upgrade has already been executed for current MySQL version</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Solicitar chave pública RSA do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Exibir mensagem de ajuda e sair</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--max-allowed-packet</th> <td>Comprimento máximo do pacote para enviar ou receber do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--net-buffer-length</th> <td>Buffer size for TCP/IP and socket communication</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Não leia arquivos de opção</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Conecte-se ao servidor usando um tubo nomeado (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Nome do caminho para o arquivo que contém a chave pública RSA</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-sys-schema</th> <td>Não instale ou atualize o sys schema</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>Arquivo que contém o certificado X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Se deve habilitar o modo FIPS no lado do cliente</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>Arquivo que contém a chave X.509</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Estado de segurança desejado da conexão com o servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>Arquivo que contém dados da sessão SSL</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Se estabelecer conexões se a reutilização da sessão falhar</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Cifras TLSv1.3 permitidas para conexões criptografadas</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td></td> <td></td> </tr><tr><th scope="row">--upgrade-system-tables</th> <td>Atualize apenas as tabelas do sistema, não os esquemas do usuário</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version-check</th> <td>Verifique a versão correta do servidor</td> <td></td> <td></td> </tr><tr><th scope="row">--write-binlog</th> <td>Escreva todas as declarações no log binário</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Nível de compressão para conexões ao servidor que utilizam compressão zstd</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

Exibir uma breve mensagem de ajuda e sair.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

Em um computador com várias interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

O diretório onde os conjuntos de caracteres são instalados. Veja a Seção 12.15, “Configuração de Conjunto de Caracteres”.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

Compressa todas as informações enviadas entre o cliente e o servidor, se possível. Veja a Seção 6.2.8, “Controle de Compressão de Conexão”.

A partir do MySQL 8.0.18, essa opção é desatualizada. A espera é que ela seja removida em uma versão futura do MySQL. Veja Configurando Compressão de Conexão Legada.

* `--compression-algorithms=value`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>

Os algoritmos de compressão permitidos para conexões ao servidor. Os algoritmos disponíveis são os mesmos que para a variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Essa opção foi adicionada no MySQL 8.0.18.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug[=#]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:O,/tmp/mysql_upgrade.trace</code></td> </tr></tbody></table>

Escreva um registro de depuração. Uma string típica *`debug_options`* é `d:t:o,file_name`. O padrão é `d:t:O,/tmp/mysql_upgrade.trace`.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for debug-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-check</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>

Imprima algumas informações de depuração quando o programa sair.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Properties for debug-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

Imprimir informações de depuração e estatísticas de uso de memória e CPU quando o programa sai.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 8.2.17, “Autenticação substituível”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

Use *`charset_name`* como o conjunto de caracteres padrão. Veja a Seção 12.15, “Configuração do Conjunto de Caracteres”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysql_upgrade** normalmente lê os grupos `[client]` e `[mysql_upgrade]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysql_upgrade** também lê os grupos `[client_other]` e `[mysql_upgrade_other]`.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--force`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

Ignore o arquivo `mysql_upgrade_info` e force a execução mesmo que o **mysql_upgrade** já tenha sido executado para a versão atual do MySQL.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

Peça ao servidor a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Alterável SHA-2”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

Conecte-se ao servidor MySQL no host fornecido.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Utilitário de Configuração MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--max-allowed-packet=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

O tamanho máximo do buffer para comunicação cliente/servidor. O valor padrão é de 24 MB. Os valores mínimo e máximo são de 4 KB e 2 GB.

* `--net-buffer-length=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

O tamanho inicial do buffer para comunicação cliente/servidor. O valor padrão é de 1 MB a 1 KB. Os valores mínimo e máximo são de 4 KB e 16 MB.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para evitar que elas sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Ferramenta de Configuração do MySQL”.

Para informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o **mysql_upgrade** solicitará uma senha. Se for fornecida, não deve haver **espaço** entre `--password=` ou `-p` e a senha que a segue. Se não for especificado nenhum tipo de senha, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o **mysql_upgrade** não deve solicitar uma senha, use a opção `--skip-password`.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

Em Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o **mysql_upgrade** não o encontrar. Veja a Seção 8.2.17, “Autenticação Conectada”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

Para conexões TCP/IP, o número de porta a ser utilizado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de outro protocolo que não o desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de Transporte de Conexão”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

O nome do caminho de um arquivo em formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para `sha256_password`, esta opção só se aplica se o MySQL foi construído usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação substituível SHA-256”, e a Seção 8.4.1.2, “Cache de autenticação substituível SHA-2”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--skip-sys-schema`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>9

Por padrão, o **mysql_upgrade** instala o esquema `sys` se ele não estiver instalado e o atualiza para a versão atual, caso contrário. A opção `--skip-sys-schema` suprime esse comportamento.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>0

Para conexões a `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do tubo nomeado a ser usado.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

As opções que começam com `--ssl` especificam se deve conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>1

Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para determinar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

Esses valores `--ssl-fips-mode` são permitidos:

+ `OFF`: Desabilitar o modo FIPS.  
  + `ON`: Habilitar o modo FIPS.  
  + `STRICT`: Habilitar o modo FIPS "strict".

Nota

Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Neste caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza um aviso na inicialização e opere no modo não FIPS.

A partir do MySQL 8.0.34, essa opção é desatualizada. A espera é que ela seja removida em uma versão futura do MySQL.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>2

As sequências de cifra permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de sequência de cifra separados por vírgula. As sequências de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL utilizada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifras de conexão criptografada TLS”.

Essa opção foi adicionada no MySQL 8.0.16.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>3

Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifras TLS de conexão criptografada”.

* `--upgrade-system-tables`, `-s`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>4

Atualize apenas as tabelas do sistema no esquema `mysql`, não atualize os esquemas de usuários.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>5

O nome de usuário da conta MySQL a ser usado para se conectar ao servidor. O nome de usuário padrão é `root`.

* `--verbose`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>6

Modo detalhado. Imprima mais informações sobre o que o programa faz.

* `--version-check`, `-k`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>7

Verifique a versão do servidor a que o **mysql_upgrade** está se conectando para verificar se é a mesma versão para a qual o **mysql_upgrade** foi construído. Se não for, o **mysql_upgrade** sai. Esta opção é habilitada por padrão; para desabilitar a verificação, use `--skip-version-check`.

* `--write-binlog`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>8

Por padrão, o registro binário pelo **mysql_upgrade** é desativado. Inicie o programa com `--write-binlog` se quiser que suas ações sejam escritas no registro binário.

Quando o servidor estiver em execução com identificadores de transação global (GTIDs) habilitados (`gtid_mode=ON`, não habilite o registro binário pelo **mysql_upgrade**.

* `--zstd-compression-level=level`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>9

O nível de compressão a ser usado para conexões ao servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis de compressão crescentes. O nível de compressão padrão `zstd` é 3. O ajuste do nível de compressão não afeta as conexões que não utilizam compressão `zstd`.

Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Essa opção foi adicionada no MySQL 8.0.18.