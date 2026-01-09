### 6.4.2 mysql\_secure\_installation — Melhorar a Segurança da Instalação do MySQL

Este programa permite que você melhore a segurança da sua instalação do MySQL das seguintes maneiras:

* Você pode definir uma senha para as contas `root`.
* Você pode remover contas `root` que são acessíveis de fora do host local.

* Você pode remover contas de usuário anônimo.
* Você pode remover o banco de dados `test` (que, por padrão, pode ser acessado por todos os usuários, mesmo usuários anônimos), e privilégios que permitam que qualquer pessoa acesse bancos de dados com nomes que comecem com `test_`.

O **mysql\_secure\_installation** ajuda você a implementar recomendações de segurança semelhantes às descritas na Seção 2.9.4, “Segurança da Conta Inicial do MySQL”.

O uso normal é conectar-se ao servidor MySQL local; invocar **mysql\_secure\_installation** sem argumentos:

```
mysql_secure_installation
```

Quando executado, o **mysql\_secure\_installation** solicita que você determine quais ações realizar.

O componente `validate_password` pode ser usado para verificar a força da senha. Se o plugin não estiver instalado, o **mysql\_secure\_installation** solicita ao usuário se deseja instalá-lo. Quaisquer senhas inseridas posteriormente são verificadas usando o plugin se ele estiver habilitado.

A maioria das opções usuais do cliente MySQL, como `--host` e `--port`, podem ser usadas na linha de comando e em arquivos de opção. Por exemplo, para se conectar ao servidor local via IPv6 usando a porta 3307, use este comando:

```
mysql_secure_installation --host=::1 --port=3307
```

O **mysql\_secure\_installation** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysql_secure_installation]` e `[client]` de um arquivo de opção. Para informações sobre arquivos de opção usados por programas MySQL, consulte a Seção 6.2.2.2, “Usando Arquivos de Opção”.

**Tabela 6.9 Opções do mysql\_secure\_installation**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysql_secure_installation">
<tr><th>Nome da Opção</th> <th>Descrição</th></tr>
<tr><td><a class="link" href="option-file-options.html#option_general_defaults-extra-file">--defaults-extra-file</a></td> <td>Leia o arquivo de opções nomeadas além dos arquivos de opções usuais</td></tr>
<tr><td><a class="link" href="option-file-options.html#option_general_defaults-file">--defaults-file</a></td> <td>Leia apenas o arquivo de opções nomeadas</td></tr>
<tr><td><a class="link" href="option-file-options.html#option_general_defaults-group-suffix">--defaults-group-suffix</a></td> <td>Valor do sufixo do grupo de opções</td></tr>
<tr><td><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_help">--help</a></td> <td>Exibir a mensagem de ajuda e sair</td></tr>
<tr><td><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_host">--host</a></td> <td>Host em que o servidor MySQL está localizado</td></tr>
<tr><td><a class="link" href="option-file-options.html#option_general_no-defaults">--no-defaults</a></td> <td>Leia nenhum arquivo de opções</td></tr>
<tr><td><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_password">--password</a></td> <td>Aceito, mas sempre ignorado. Sempre que o mysql_secure_installation for invocado, o usuário é solicitado a fornecer uma senha, independentemente</td></tr>
<tr><td><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_port">--port</a></td> <td>Número de porta TCP/IP para a conexão</td></tr>
<tr><td><a class="link" href="option-file-options.html#option_general_print-defaults">--print-defaults</a></td> <td>Imprimir as opções padrão</td></tr>
<tr><td><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_protocol">--protocol</a></td> <td>Protocolo de transporte a ser usado</td></tr>
<tr><td><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_socket">--socket</a></td> <td>Arquivo de socket Unix ou pipe nomeado do Windows a ser usado</td></tr>
<tr><td><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-ca</a></td> <td>Arquivo que contém a lista de Autoridades de Certificados SSL confiáveis</td></tr>
<tr><td><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-capath</a></td> <td>Diretório que contém os arquivos de certificado de Autoridade de Certificados SSL confiáveis</td></tr>
<tr><td><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-cert</a></td> <td>Arquivo que contém o certificado X.509</td></tr>
<tr><td><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-cipher</a></td> <td>Cifras permitidas para criptografia da conexão</td></tr>
<tr><td><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-crl</a></td> <td>Arquivo que contém listas de revogação de certificados</td></tr>
<tr><td><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-crlpath</a></td> <td>Diretório que contém os arquivos de lista de revogação de certificados</td></tr>
<tr><td><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl-fips-mode">--ssl-fips-mode</a></td> <td>Se o modo FIPS deve ser habilitado no lado do cliente</td></tr>
<tr><td><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-key</a></td> <td>Arquivo que contém a chave X.50

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></table>

  Exibir uma mensagem de ajuda e sair.

* `--defaults-extra-file=nome_arquivo_extra`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tr><th>Formato de linha de comando</th> <td><code>--defaults-extra-file=nome_arquivo_extra</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></table>

  Ler este arquivo de opções após o arquivo de opções globais, mas (em Unix) antes do arquivo de opções do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`nome_arquivo_extra`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.

* `--defaults-file=nome_arquivo`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tr><th>Formato de linha de comando</th> <td><code>--defaults-file=nome_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></table>

  Use apenas o arquivo de opções fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`nome_arquivo`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.

* `--defaults-group-suffix=str`

<table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Leia não apenas os grupos de opções habituais, mas também grupos com os nomes habituais e um sufixo de *`str`*. Por exemplo, **mysql\_secure\_installation** normalmente lê os grupos `[client]` e `[mysql_secure_installation]`. Se esta opção for dada como `--defaults-group-suffix=_other`, **mysql\_secure\_installation** também lê os grupos `[client_other]` e `[mysql_secure_installation_other]`.

  Para informações adicionais sobre esta e outras opções de ficheiro de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de ficheiros de opções”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Formato de linha de comando</th> <td><code>--host</code></td> </tr></tbody></table>

  Conecte-se ao servidor MySQL no host fornecido.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para no-defaults"><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Não leia nenhum ficheiro de opções. Se o arranque do programa falhar devido à leitura de opções desconhecidas de um ficheiro de opções, `--no-defaults` pode ser usado para evitar que sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

Para obter informações adicionais sobre essa e outras opções de arquivo, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opção”.

* `--password=password`, `-p password`

  <table frame="box" rules="all" summary="Propriedades para senha"><tr><th>Formato de Linha de Comando</th> <td><code>--password=password</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></table>

  Esta opção é aceita, mas ignorada. Se esta opção for usada ou não, o **mysql\_secure\_installation** sempre solicita ao usuário uma senha.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para porta"><tr><th>Formato de Linha de Comando</th> <td><code>--port=port_num</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Padrão</th> <td><code>3306</code></td> </tr></table>

  Para conexões TCP/IP, o número de porta a ser usado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para print-defaults"><tr><th>Formato de Linha de Comando</th> <td><code>--print-defaults</code></td> </tr></table>

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para obter informações adicionais sobre isso e outras opções de arquivos de opção, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opção”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de transporte de conexão”.

* `--socket=caminho`, `-S caminho`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Para conexões com `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do pipe nomeado a ser usado.

  No Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de pipe nomeado. Além disso, a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

  Opções que começam com `--ssl` especificam se se deseja conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

* `--ssl-fips-mode={OFF|ON|STRICT}`

<table frame="box" rules="all" summary="Propriedades de ajuda">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--help</code></td>
  </tr>
</table>
2

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

  Estes valores de `--ssl-fips-mode` são permitidos:

  + `OFF`: Desabilitar o modo FIPS.
  + `ON`: Habilitar o modo FIPS.
  + `STRICT`: Habilitar o modo FIPS “estricto”.

  Observação

  Se o Módulo de Objeto FIPS do OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza um aviso na inicialização e opere no modo não FIPS.

  Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Propriedades de ajuda">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--help</code></td>
    </tr>
  </table>
3

  As ciphersuites permitidas para conexões criptografadas que usam TLSv1.3. O valor é uma lista de um ou mais nomes de ciphersuites separados por vírgula. As ciphersuites que podem ser nomeadas para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e Criptografadores TLS de Conexão Criptografada”.

* `--tls-sni-servername=server_name`

<table frame="box" rules="all" summary="Propriedades de ajuda">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--help</code></td>
  </tr>
</table>

  Quando especificado, o nome é passado para a biblioteca de API C `libmysqlclient` usando a opção `MYSQL_OPT_TLS_SNI_SERVERNAME` de `mysql_options()`. O nome do servidor não é case-sensitive. Para mostrar qual nome do servidor o cliente especificou para a sessão atual, se houver, verifique a variável `Tls_sni_server_name`.

  A Indicação de Nome do Servidor (SNI) é uma extensão do protocolo TLS (o OpenSSL deve ser compilado com extensões TLS para que essa opção funcione). A implementação do MySQL do SNI representa apenas o lado do cliente.

* `--tls-version=lista_protocolos`

  <table frame="box" rules="all" summary="Propriedades de ajuda">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--help</code></td>
    </tr>
  </table>

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para essa opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de conexão criptografada”.

* `--use-default`

  <table frame="box" rules="all" summary="Propriedades de ajuda">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--help</code></td>
    </tr>
  </table>

  Execute de forma não interativa. Esta opção pode ser usada para operações de instalação sem intervenção.

* `--user=nome_do_usuário`, `-u nome_do_usuário`

<table frame="box" rules="all" summary="Propriedades de ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.