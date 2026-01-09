### 4.4.4 mysql\_secure\_installation — Melhorar a segurança da instalação do MySQL

Este programa permite que você melhore a segurança da sua instalação do MySQL das seguintes maneiras:

- Você pode definir uma senha para as contas `root`.

- Você pode remover contas `root` que são acessíveis de fora do host local.

- Você pode remover contas de usuários anônimos.

- Você pode remover o banco de dados `test` (que, por padrão, pode ser acessado por todos os usuários, mesmo usuários anônimos) e os privilégios que permitem que qualquer pessoa acesse bancos de dados com nomes que comecem com `test_`.

O **mysql\_secure\_installation** ajuda você a implementar recomendações de segurança semelhantes às descritas na Seção 2.9.4, “Segurança da Conta Inicial do MySQL”.

O uso normal é conectar-se ao servidor MySQL local; invocar **mysql\_secure\_installation** sem argumentos:

```sql
mysql_secure_installation
```

Quando executado, **mysql\_secure\_installation** solicita que você determine quais ações executar.

O plugin `validate_password` pode ser usado para verificar a força da senha. Se o plugin não estiver instalado, o **mysql\_secure\_installation** solicita ao usuário se ele deseja instalá-lo. Quaisquer senhas inseridas posteriormente serão verificadas usando o plugin se ele estiver ativado.

A maioria das opções do cliente MySQL padrão, como `--host` e `--port`, pode ser usada na linha de comando e em arquivos de opção. Por exemplo, para se conectar ao servidor local via IPv6 usando a porta 3307, use este comando:

```sql
mysql_secure_installation --host=::1 --port=3307
```

O **mysql\_secure\_installation** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysql_secure_installation]` e `[client]` de um arquivo de opções. Para obter informações sobre os arquivos de opções usados pelos programas do MySQL, consulte a Seção 4.2.2.2, “Usando arquivos de opções”.

**Tabela 4.10 Opções de mysql\_secure\_installation**

<table frame="box" rules="all" summary="Opções de linha de comando disponíveis para mysql_secure_installation."><col style="width: 31%"/><col style="width: 56%"/><col style="width: 12%"/><thead><tr><th>Nome da Opção</th> <th>Descrição</th> <th>Introduzido</th> </tr></thead><tbody><tr><th><a class="link" href="option-file-options.html#option_general_defaults-extra-file">--defaults-extra-file</a></th> <td>Leia o arquivo de opção nomeado, além dos arquivos de opção usuais</td> <td></td> </tr><tr><th><a class="link" href="option-file-options.html#option_general_defaults-file">--defaults-file</a></th> <td>Arquivo de opção de leitura apenas nomeado</td> <td></td> </tr><tr><th><a class="link" href="option-file-options.html#option_general_defaults-group-suffix">--defaults-group-suffix</a></th> <td>Valor do sufixo do grupo de opções</td> <td></td> </tr><tr><th><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_help">--help</a></th> <td>Exibir mensagem de ajuda e sair</td> <td></td> </tr><tr><th><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_host">--host</a></th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> </tr><tr><th><a class="link" href="option-file-options.html#option_general_no-defaults">--no-defaults</a></th> <td>Não ler arquivos de opção</td> <td></td> </tr><tr><th><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_password">--password</a></th> <td>Aceito, mas sempre ignorado. Sempre que o mysql_secure_installation é invocado, o usuário é solicitado a fornecer uma senha, independentemente</td> <td></td> </tr><tr><th><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_port">--port</a></th> <td>Número de porta TCP/IP para a conexão</td> <td></td> </tr><tr><th><a class="link" href="option-file-options.html#option_general_print-defaults">--print-defaults</a></th> <td>Opções padrão de impressão</td> <td></td> </tr><tr><th><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_protocol">--protocol</a></th> <td>Protocolo de transporte a ser utilizado</td> <td></td> </tr><tr><th><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_socket">--socket</a></th> <td>Arquivo de soquete Unix ou tubo nomeado do Windows a ser usado</td> <td></td> </tr><tr><th><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl</a></th> <td>Ative a criptografia de conexão</td> <td></td> </tr><tr><th><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-ca</a></th> <td>Arquivo que contém a lista de Autoridades de Certificação SSL confiáveis</td> <td></td> </tr><tr><th><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-capath</a></th> <td>Diretório que contém arquivos de certificados de Autoridade de Certificação SSL confiáveis</td> <td></td> </tr><tr><th><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-cert</a></th> <td>Arquivo que contém o certificado X.509</td> <td></td> </tr><tr><th><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-cipher</a></th> <td>Cifras permitidas para criptografia de conexão</td> <td></td> </tr><tr><th><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-crl</a></th> <td>Arquivo que contém listas de revogação de certificados</td> <td></td> </tr><tr><th><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-crlpath</a></th> <td>Diretório que contém arquivos de lista de revogação de certificados</td> <td></td> </tr><tr><th><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-chave</a></th> <td>Arquivo que contém a chave X.509</td> <td></td> </tr><tr><th><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-mode</a></th> <td>Estado de segurança desejado da conexão com o servidor</td> <td>5.7.11</td> </tr><tr><th><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-verify-server-cert</a></th> <td>Verifique o nome do host contra a identidade do Nome comum do certificado do servidor</td> <td></td> </tr><tr><th><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_tls-version">--tls-version</a></th> <td>Protocolos TLS permitidos para conexões criptografadas</td> <td>5.7.10</td> </tr><tr><th><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_use-default">--use-default</a></th> <td>Execute sem interatividade do usuário</td> <td></td> </tr><tr><th><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_user">--user</a></th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> </tr></tbody></table>

- `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--defaults-extra-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Leia este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-file=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para arquivo de falhas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-file=file_name</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Use apenas o arquivo de opção fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-group-suffix=str</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, **mysql\_secure\_installation** normalmente lê os grupos `[client]` e `[mysql_secure_installation]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, **mysql\_secure\_installation** também lê os grupos `[client_other]` e `[mysql_secure_installation_other]`.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para o anfitrião"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--host</code>]]</td> </tr></tbody></table>

  Conecte-se ao servidor MySQL no host fornecido.

- `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades sem penalidades"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--no-defaults</code>]]</td> </tr></tbody></table>

  Não leia nenhum arquivo de opções. Se a inicialização do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, o `--no-defaults` pode ser usado para impedir que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se ele existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql\_config\_editor**. Veja a Seção 4.6.6, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--password=password`, `-p senha`

  <table frame="box" rules="all" summary="Propriedades para senha"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--password=password</code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Esta opção é aceita, mas ignorada. Independentemente de ser usada ou não, o **mysql\_secure\_installation** sempre solicita uma senha ao usuário.

- `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para porto"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--port=port_num</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code>3306</code>]]</td> </tr></tbody></table>

  Para conexões TCP/IP, o número de porta a ser usado.

- `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para padrões de impressão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--print-defaults</code>]]</td> </tr></tbody></table>

  Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivo de opções”.

- `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para obter detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

- `--socket=caminho`, `-S caminho`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Para conexões ao `localhost`, o arquivo de socket Unix a ser usado ou, no Windows, o nome do tubo nomeado a ser usado.

  No Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por named pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

- `--ssl*`

  As opções que começam com `--ssl` especificam se você deseja se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.

- `--tls-version=lista_protocolos`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 6.3.2, “Protocolos e cifra TLS de conexão criptografada”.

  Essa opção foi adicionada no MySQL 5.7.10.

- `--use-default`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Execute sem interação. Esta opção pode ser usada para operações de instalação sem supervisão.

- `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  O nome de usuário da conta MySQL a ser usado para se conectar ao servidor.
