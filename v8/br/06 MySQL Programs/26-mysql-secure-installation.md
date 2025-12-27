### 6.4.2 `mysql_secure_installation` — Melhorar a Segurança da Instalação do MySQL

Este programa permite que você melhore a segurança da sua instalação do MySQL das seguintes maneiras:

* Você pode definir uma senha para as contas `root`.
* Você pode remover contas `root` que são acessíveis de fora do host local.
* Você pode remover contas de usuário anônimo.
* Você pode remover o banco de dados `test` (que, por padrão, pode ser acessado por todos os usuários, mesmo usuários anônimos) e privilégios que permitam que qualquer pessoa acesse bancos de dados com nomes que comecem com `test_`.

O `mysql_secure_installation` ajuda você a implementar recomendações de segurança semelhantes às descritas na Seção 2.9.4, “Segurança da Conta Inicial do MySQL”.

O uso normal é conectar-se ao servidor MySQL local; invocar `mysql_secure_installation` sem argumentos:

```
mysql_secure_installation
```

Quando executado, o `mysql_secure_installation` solicita que você determine quais ações realizar.

O componente `validate_password` pode ser usado para verificar a força da senha. Se o plugin não estiver instalado, o `mysql_secure_installation` solicita ao usuário se deseja instalá-lo. Quaisquer senhas inseridas posteriormente são verificadas usando o plugin se ele estiver habilitado.

A maioria das opções usuais do cliente MySQL, como `--host` e `--port`, podem ser usadas na linha de comando e em arquivos de opção. Por exemplo, para se conectar ao servidor local via IPv6 usando a porta 3307, use este comando:

```
mysql_secure_installation --host=::1 --port=3307
```

O `mysql_secure_installation` suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysql_secure_installation]` e `[client]` de um arquivo de opção. Para informações sobre arquivos de opção usados por programas MySQL, consulte a Seção 6.2.2.2, “Usando Arquivos de Opção”.

**Tabela 6.9 Opções do `mysql_secure_installation`**

<table><thead><tr><th>Nome da Opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td>--defaults-extra-file</td> <td>Ler o arquivo de opção nomeado além dos arquivos de opção usuais</td> </tr><tr><td><code>--defaults-file</code></td> <td>Ler apenas o arquivo de opção nomeado</td> </tr><tr><td><code>--defaults-group-suffix</code></td> <td>Valor do sufixo do grupo de opções</td> </tr><tr><td><code>--help</code></td> <td>Exibir a mensagem de ajuda e sair</td> </tr><tr><td><code>--host</code></td> <td>Host em que o servidor MySQL está localizado</td> </tr><tr><td><code>--no-defaults</code></td> <td>Ler nenhum arquivo de opção</td> </tr><tr><td><code>--password</code></td> <td>Aceito, mas sempre ignorado. Sempre que o mysql_secure_installation for invocado, o usuário é solicitado a fornecer uma senha, independentemente</td> </tr><tr><td><code>--port</code></td> <td>Número de porta TCP/IP para a conexão</td> </tr><tr><td><code>--print-defaults</code></td> <td>Imprimir as opções padrão</td> </tr><tr><td><code>--protocol</code></td> <td>Protocolo de transporte a ser usado</td> </tr><tr><td><code>--socket</code></td> <td>Arquivo de soquete Unix ou tubo nomeado do Windows a ser usado</td> </tr><tr><td><code>--ssl-ca</code></td> <td>Arquivo que contém a lista de Autoridades de Certificados SSL confiáveis</td> </tr><tr><td><code>--ssl-capath</code></td> <td>Diretório que contém os arquivos de certificados de Autoridade de Certificados SSL confiáveis</td> </tr><tr><td><code>--ssl-cert</code></td> <td>Arquivo que contém o certificado X.509</td> </tr><tr><td><code>--ssl-cipher</code></td> <td>Cifras permitidas para a criptografia da conexão</td> </tr><tr><td><code>--ssl-crl</code></td> <td>Arquivo que contém listas de revogação de certificados</td> </tr><tr><td><code>--ssl-crlpath</code></td> <td>Diretório que contém os arquivos de listas de revogação de certificados</td> </tr><tr><td><code>--ssl-fips-mode</code></td> <td>Se o modo FIPS deve ser habilitado no lado do cliente</td> </tr><tr><td><code>--ssl-key</code></td> <td>Arquivo que contém a chave X.509</td> </tr><tr><td><code>--ssl-mode</code></td> <td>Estado de segurança desejado da conexão com o servidor</td> </tr><tr><td><code>--ssl-session-data</code></td> <td>Arquivo que contém os dados da sessão SSL</td> </tr><tr><td><code>--ssl-session-data-continue-on-failed-reuse</code></td> <td>Se as conexões devem ser estabelecidas se a reutilização da sessão falhar</td> </tr><tr><td><code>--tls-ciphersuites</code></td> <td>Cifras permitidas TLSv1.3 para conexões criptografadas</td> </tr><tr><td><code>--tls-sni-servername</code></td> <td>Nome do servidor fornecido pelo cliente</td> </tr><tr><td><code>--tls-version</code></td> <td>Protocolos TLS permitidos para conexões criptografadas</td> </tr><tr><td><code>--use-default</code></td> <td>Executar sem interatividade do usuário</td> </tr><tr><td><code>--user</code></td> <td>Nome do usuário MySQL a ser usado ao se conectar ao servidor</td> </tr></tbody></table>

* `--help`, `-?`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibir uma mensagem de ajuda e sair.
* `--defaults-extra-file=nome_arquivo_extra`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-extra-file=nome_arquivo_extra</code></td> </tr></tbody></table>

  Ler este arquivo de opções após o arquivo de opções globais, mas (no Unix) antes do arquivo de opções do usuário. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se `nome_arquivo_extra` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.
* `--defaults-file=nome_arquivo`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-file=nome_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Use apenas o arquivo de opções fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. Se `nome_arquivo` não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.
* `--defaults-group-suffix=str`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Ler não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de `str`. Por exemplo, `mysql_secure_installation` normalmente lê os grupos `[client]` e `[mysql_secure_installation]`. Se esta opção for dada como `--defaults-group-suffix=_other`, `mysql_secure_installation` também lê os grupos `[client_other]` e `[mysql_secure_installation_other]`.

Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.
* `--host=host_name`, `-h host_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--host</code></td> </tr></tbody></table>

  Conecte-se ao servidor MySQL no host fornecido.
* `--no-defaults`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, o `--no-defaults` pode ser usado para evitar que sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário `mysql_config_editor`. Veja a Seção 6.6.7, “mysql_config_editor — Ferramenta de configuração do MySQL”.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.
* `--password=password`, `-p password`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--password=password</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Esta opção é aceita, mas ignorada. Se esta opção for usada ou não, o `mysql_secure_installation` sempre solicita ao usuário uma senha.
* `--port=port_num`, `-P port_num`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--port=port_num</code></td> </tr><tr><th>Tipo</th> <td><code>Numeric</code></td> </tr><tr><th>Valor padrão</th> <td><code>3306</code></td> </tr></tbody></table>

  Para conexões TCP/IP, o número de porta a ser usado.
* `--print-defaults`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção.

Para obter informações adicionais sobre isso e outras opções de arquivos de opção, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opção”.
* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--protocol=tipo</code></td> </tr><tr><th>Tipo</th> <td><code>String</code></td> </tr><tr><th>Valor padrão</th> <td><code>[ver texto]</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>TCP</code></p><p><code>SOCKET</code></p><p><code>PIPE</code></p><p><code>MEMORY</code></p></td> </tr></tbody></table>

O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do que você deseja. Para detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de transporte de conexão”.
* `--socket=caminho`, `-S caminho`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--socket={nome_de_arquivo|nome_de_canal}</code></td> </tr><tr><th>Tipo</th> <td><code>String</code></td> </tr></tbody></table>

Para conexões com `localhost`, o arquivo de socket Unix a ser usado, ou, no Windows, o nome do canal nomeado a ser usado.

No Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.
* `--ssl*`

Opções que começam com `--ssl` especificam se se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Consulte Opções de comando para conexões criptografadas.
* `--ssl-fips-mode={OFF|ON|STRICT}`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ssl-fips-mode={OFF|ON|STRICT}</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>OFF</code></p><p><code>ON</code></p><p><code>STRICT</code></p></td> </tr></tbody></table>

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Consulte  Seção 8.8, “Suporte FIPS”.

  Esses valores de `--ssl-fips-mode` são permitidos:

  + `OFF`: Desabilitar o modo FIPS.
  + `ON`: Habilitar o modo FIPS.
  + `STRICT`: Habilitar o modo FIPS “estricto”.

  ::: info Nota

  Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza uma mensagem de aviso no início e opere no modo não FIPS.

  :::

  Esta opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL.
*  `--tls-ciphersuites=ciphersuite_list`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--tls-ciphersuites=ciphersuite_list</code></td> </tr><tr><th>Tipo</th> <td><code>String</code></td> </tr></tbody></table>

  Os `ciphersuites` permitidos para conexões criptografadas que usam TLSv1.3. O valor é uma lista de um ou mais nomes de `ciphersuites` separados por vírgula. Os `ciphersuites` que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte Seção 8.3.2, “Protocolos e Criptografadores TLS de Conexão Criptografada”.
*  `--tls-sni-servername=server_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--tls-sni-servername=server_name</code></td> </tr><tr><th>Tipo</th> <td><code>String</code></td> </tr></tbody></table>

Quando especificado, o nome é passado para a biblioteca de API C `libmysqlclient` usando a opção `MYSQL_OPT_TLS_SNI_SERVERNAME` de `mysql_options()`. O nome do servidor não é case-sensitive. Para mostrar qual nome do servidor o cliente especificou para a sessão atual, se houver, verifique a variável `Tls_sni_server_name`.

A Indicação de Nome do Servidor (SNI) é uma extensão do protocolo TLS (o OpenSSL deve ser compilado com extensões TLS para que essa opção funcione). A implementação do MySQL do SNI representa apenas o lado do cliente.
*  `--tls-version=protocol_list`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tls-version=protocol_list</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><p><code>TLSv1,TLSv1.1,TLSv1.2,TLSv1.3</code> (OpenSSL 1.1.1 ou superior)</p><p><code>TLSv1,TLSv1.1,TLSv1.2</code> (caso contrário)</p></td> </tr></tbody></table>

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolos separados por vírgula. Os protocolos que podem ser nomeados para essa opção dependem da biblioteca SSL usada para compilar o MySQL. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifra TLS de conexão criptografada”.
*  `--use-default`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--use-default</code></td> </tr><tr><th>Tipo</th> <td><code>Boolean</code></td> </tr></tbody></table>

  Execute de forma não interativa. Esta opção pode ser usada para operações de instalação sem intervenção.
*  `--user=user_name`, `-u user_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--user=user_name</code></td> </tr><tr><th>Tipo</th> <td><code>String</code></td> </tr></tbody></table>

  O nome do usuário da conta MySQL a ser usado para se conectar ao servidor.