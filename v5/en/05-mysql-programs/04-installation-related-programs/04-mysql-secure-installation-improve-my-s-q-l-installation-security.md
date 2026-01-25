### 4.4.4 mysql_secure_installation — Melhorar a Segurança da Instalação do MySQL

Este programa permite que você melhore a segurança da sua instalação MySQL das seguintes maneiras:

* Você pode definir uma password para as contas `root`.
* Você pode remover contas `root` que são acessíveis de fora do host local.

* Você pode remover contas de usuário anônimo.
* Você pode remover o `test` database (que por padrão pode ser acessado por todos os usuários, até mesmo usuários anônimos), e privilégios que permitem que qualquer pessoa acesse Databases com nomes que começam com `test_`.

**mysql_secure_installation** ajuda você a implementar recomendações de segurança semelhantes às descritas na Seção 2.9.4, “Securing the Initial MySQL Account”.

O uso normal é conectar-se ao servidor MySQL local; invoque **mysql_secure_installation** sem argumentos:

```sql
mysql_secure_installation
```

Quando executado, **mysql_secure_installation** solicita que você determine quais ações executar.

O plugin `validate_password` pode ser usado para verificação da força da password. Se o plugin não estiver instalado, **mysql_secure_installation** solicita ao usuário se deseja instalá-lo. Qualquer password inserida posteriormente é verificada usando o plugin, caso esteja habilitado.

A maioria das opções usuais do client MySQL, como `--host` e `--port`, pode ser usada na linha de comando e em arquivos de opção. Por exemplo, para conectar-se ao servidor local via IPv6 usando a port 3307, use este comando:

```sql
mysql_secure_installation --host=::1 --port=3307
```

**mysql_secure_installation** suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysql_secure_installation]` e `[client]` de um arquivo de opção. Para obter informações sobre arquivos de opção usados por programas MySQL, consulte a Seção 4.2.2.2, “Using Option Files”.

**Tabela 4.10 Opções de mysql_secure_installation**

| Opção | Descrição | Introduzido em |
| :--- | :--- | :--- |
| `--defaults-extra-file` | Ler arquivo de opção nomeado além dos arquivos de opção usuais | |
| `--defaults-file` | Ler apenas o arquivo de opção nomeado | |
| `--defaults-group-suffix` | Valor do sufixo do grupo de opções | |
| `--help` | Exibir mensagem de ajuda e sair | |
| `--host` | Host onde o servidor MySQL está localizado | |
| `--no-defaults` | Não ler arquivos de opção | |
| `--password` | Aceita, mas sempre ignorada. Sempre que mysql_secure_installation é invocado, é solicitada uma password ao usuário, independentemente | |
| `--port` | Número da port TCP/IP para conexão | |
| `--print-defaults` | Imprimir opções padrão | |
| `--protocol` | Protocolo de transporte a ser usado | |
| `--socket` | Arquivo Unix socket ou named pipe do Windows a ser usado | |
| `--ssl` | Habilitar a criptografia de conexão | |
| `--ssl-ca` | Arquivo que contém a lista de Certificate Authorities SSL confiáveis | |
| `--ssl-capath` | Diretório que contém arquivos de certificado de Certificate Authority SSL confiáveis | |
| `--ssl-cert` | Arquivo que contém o certificado X.509 | |
| `--ssl-cipher` | Cifras permitidas para criptografia de conexão | |
| `--ssl-crl` | Arquivo que contém listas de revogação de certificado | |
| `--ssl-crlpath` | Diretório que contém arquivos de lista de revogação de certificado | |
| `--ssl-key` | Arquivo que contém a chave X.509 | |
| `--ssl-mode` | Estado de segurança desejado da conexão com o servidor | 5.7.11 |
| `--ssl-verify-server-cert` | Verificar o nome do host em relação à identidade Common Name do certificado do servidor | |
| `--tls-version` | Protocolos TLS permitidos para conexões criptografadas | 5.7.10 |
| `--use-default` | Executar sem interação do usuário | |
| `--user` | Nome de usuário MySQL a ser usado ao conectar-se ao servidor | |

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibe uma mensagem de ajuda e sai.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Lê este arquivo de opção após o arquivo de opção global, mas (no Unix) antes do arquivo de opção do usuário. Se o arquivo não existir ou for inacessível por qualquer outro motivo, ocorre um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para informações adicionais sobre esta e outras opções de arquivos de opção, consulte a Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Usa apenas o arquivo de opção fornecido. Se o arquivo não existir ou for inacessível por qualquer outro motivo, ocorre um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para informações adicionais sobre esta e outras opções de arquivos de opção, consulte a Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Lê não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo *`str`*. Por exemplo, **mysql_secure_installation** normalmente lê os grupos `[client]` e `[mysql_secure_installation]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, **mysql_secure_installation** também lê os grupos `[client_other]` e `[mysql_secure_installation_other]`.

  Para informações adicionais sobre esta e outras opções de arquivos de opção, consulte a Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Propriedades para host"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--host</code></td> </tr></tbody></table>

  Conecta-se ao servidor MySQL no host fornecido.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para no-defaults"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Não lê nenhum arquivo de opção. Se a inicialização do programa falhar devido à leitura de opções desconhecidas de um arquivo de opção, `--no-defaults` pode ser usado para impedir que elas sejam lidas.

  A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as passwords sejam especificadas de maneira mais segura do que na linha de comando, mesmo quando `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Consulte a Seção 4.6.6, “mysql_config_editor — MySQL Configuration Utility”.

  Para informações adicionais sobre esta e outras opções de arquivos de opção, consulte a Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--password=password`, `-p password`

  <table frame="box" rules="all" summary="Propriedades para password"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--password=password</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Esta opção é aceita, mas ignorada. Independentemente de esta opção ser usada ou não, **mysql_secure_installation** sempre solicita uma password ao usuário.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Propriedades para port"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--port=port_num</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Padrão</th> <td><code>3306</code></td> </tr></tbody></table>

  Para conexões TCP/IP, o número da port a ser usado.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para print-defaults"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

  Imprime o nome do programa e todas as opções que ele obtém dos arquivos de opção.

  Para informações adicionais sobre esta e outras opções de arquivos de opção, consulte a Seção 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  O protocolo de transporte a ser usado para conectar-se ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente daquele que você deseja. Para obter detalhes sobre os valores permitidos, consulte a Seção 4.2.5, “Connection Transport Protocols”.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Para conexões a `localhost`, o arquivo Unix socket a ser usado ou, no Windows, o nome do named pipe a ser usado.

  No Windows, esta opção se aplica apenas se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões named-pipe. Além disso, o usuário que faz a conexão deve ser membro do grupo Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--ssl*`

  Opções que começam com `--ssl` especificam se deve conectar-se ao servidor usando criptografia e indicam onde encontrar chaves e certificados SSL. Consulte Command Options for Encrypted Connections.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  Esta opção foi adicionada no MySQL 5.7.10.

* `--use-default`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Executar sem interatividade. Esta opção pode ser usada para operações de instalação não assistidas.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  O nome de usuário da conta MySQL a ser usada para conectar-se ao servidor.