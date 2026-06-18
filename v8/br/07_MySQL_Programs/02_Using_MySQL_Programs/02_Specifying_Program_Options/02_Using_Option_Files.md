#### 6.2.2.2 Uso de arquivos de opção

A maioria dos programas do MySQL pode ler as opções de inicialização de arquivos de opções (às vezes chamados de arquivos de configuração). Os arquivos de opções fornecem uma maneira conveniente de especificar opções comumente usadas, para que elas não precisem ser inseridas na linha de comando toda vez que você executar um programa.

Para determinar se um programa lê arquivos de opções, invocá-lo com a opção `--help`. (Para o **mysqld**, use `--verbose` e `--help`.). Se o programa ler arquivos de opções, a mensagem de ajuda indica quais arquivos ele procura e quais grupos de opções ele reconhece.

Nota

Um programa do MySQL que começa com a opção `--no-defaults` não lê outros arquivos de opção além de `.mylogin.cnf`.

Um servidor que começa com a variável de sistema `persisted_globals_load` desativada não lê `mysqld-auto.cnf`.

Muitos arquivos de opções são arquivos de texto simples, criados usando qualquer editor de texto. As exceções são:

- O arquivo `.mylogin.cnf` que contém opções de caminho de login. Este é um arquivo criptografado criado pelo utilitário **mysql\_config\_editor**. Veja a Seção 6.6.7, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”. Um “caminho de login” é um grupo de opções que permite apenas certas opções: `host`, `user`, `password`, `port` e `socket`. Os programas cliente especificam qual caminho de login deve ser lido a partir de `.mylogin.cnf` usando a opção `--login-path`.

  Para especificar um nome alternativo de arquivo de caminho de login, defina a variável de ambiente `MYSQL_TEST_LOGIN_FILE`. Esta variável é usada pelo utilitário de teste **mysql-test-run.pl**, mas também é reconhecida pelo **mysql\_config\_editor** e pelos clientes MySQL, como **mysql**, **mysqladmin** e outros.

- O arquivo `mysqld-auto.cnf` no diretório de dados. Este arquivo no formato JSON contém configurações persistentes de variáveis do sistema. Ele é criado pelo servidor após a execução das instruções `SET PERSIST` ou `SET PERSIST_ONLY`. Veja a Seção 7.1.9.3, “Variáveis de Sistema Persistentes”. A gestão do `mysqld-auto.cnf` deve ser deixada para o servidor e não realizada manualmente.

- Ordem de Processamento de Arquivo de Opção

- Sintaxe do arquivo de opção

- Inclusões no arquivo de opção

##### Ordem de Processamento de Arquivo de Opção

O MySQL procura por arquivos de opção na ordem descrita na discussão a seguir e lê quaisquer que existam. Se um arquivo de opção que você deseja usar não existir, crie-o usando o método apropriado, como foi discutido.

Nota

Para obter informações sobre os arquivos de opção usados com os programas do NDB Cluster, consulte a Seção 25.4, “Configuração do NDB Cluster”.

No Windows, os programas do MySQL leem as opções de inicialização dos arquivos mostrados na tabela a seguir, na ordem especificada (os arquivos listados primeiro são lidos primeiro, os arquivos lidos posteriormente têm precedência).

**Tabela 6.1 Arquivos de Opções Lidos em Sistemas Windows**

<table summary="Arquivos de opção lidos por programas MySQL em sistemas Windows."><thead><tr> <th>Nome do arquivo</th> <th>Objetivo</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>SET PERSIST</code>]\my.ini</code>, [[PH_HTML_CODE_<code>SET PERSIST</code>]\my.cnf</code></td> <td>Opções globais</td> </tr><tr> <td>[[<code>C:\my.ini</code>]], [[<code>C:\my.cnf</code>]]</td> <td>Opções globais</td> </tr><tr> <td>[[<code><em class="replaceable"><code>BASEDIR</code>]]</em>\my.ini</code>, [[<code><em class="replaceable"><code>BASEDIR</code>]]</em>\my.cnf</code></td> <td>Opções globais</td> </tr><tr> <td>[[<code>defaults-extra-file</code>]]</td> <td>O arquivo especificado com [[<code>--defaults-extra-file</code>]], se houver</td> </tr><tr> <td>[[<code><code>%APPDATA%</code>]]\MySQL\.mylogin.cnf</code></td> <td>Opções de caminho de login (apenas para clientes)</td> </tr><tr> <td>[[<code><em class="replaceable"><code>DATADIR</code>]]</em>\mysqld-auto.cnf</code></td> <td>As variáveis do sistema persistiram com [[<code>SET PERSIST</code>]] ou [[<code><code>%WINDIR%</code><code>SET PERSIST</code>] (apenas para o servidor)</td> </tr></tbody></table>

Na tabela anterior, `%WINDIR%` representa a localização do diretório do Windows. Isso geralmente é `C:\WINDOWS`. Use o seguinte comando para determinar sua localização exata a partir do valor da variável de ambiente `WINDIR`:

```
C:\> echo %WINDIR%
```

`%APPDATA%` representa o valor do diretório de dados do aplicativo do Windows. Use o seguinte comando para determinar sua localização exata a partir do valor da variável de ambiente `APPDATA`:

```
C:\> echo %APPDATA%
```

`BASEDIR` representa o diretório de instalação da base MySQL. Quando o MySQL 8.0 foi instalado usando o Instalador do MySQL, este é tipicamente `C:\PROGRAMDIR\MySQL\MySQL Server 8.0` onde `PROGRAMDIR` representa o diretório de programas (geralmente `Program Files` para versões em inglês do Windows). Veja a Seção 2.3.3, “Instalador do MySQL para Windows”.

Importante

Embora o Instalador do MySQL coloque a maioria dos arquivos em `PROGRAMDIR`, ele instala o `my.ini` no diretório `C:\ProgramData\MySQL\MySQL Server 8.0\` por padrão.

`DATADIR` representa o diretório de dados do MySQL. Como usado para encontrar `mysqld-auto.cnf`, seu valor padrão é a localização do diretório de dados construído quando o MySQL foi compilado, mas pode ser alterado por `--datadir`, especificado como um arquivo de opção ou opção de linha de comando processado antes de `mysqld-auto.cnf` ser processado.

Nos sistemas Unix e similares, os programas do MySQL leem as opções de inicialização dos arquivos mostrados na tabela a seguir, na ordem especificada (os arquivos listados primeiro são lidos primeiro, os arquivos lidos posteriormente têm precedência).

Nota

Em plataformas Unix, o MySQL ignora arquivos de configuração que são acessíveis para todos. Isso é feito intencionalmente como uma medida de segurança.

**Tabela 6.2 Arquivos de Opções Lidos em Sistemas Unix e Unix-Like**

<table summary="Arquivos de opção lidos por programas MySQL em sistemas Unix e semelhantes ao Unix."><thead><tr> <th>Nome do arquivo</th> <th>Objetivo</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>SET PERSIST_ONLY</code>]</td> <td>Opções globais</td> </tr><tr> <td>[[PH_HTML_CODE_<code>SET PERSIST_ONLY</code>]</td> <td>Opções globais</td> </tr><tr> <td>[[<code><em class="replaceable"><code>SYSCONFDIR</code>]]</em>/my.cnf</code></td> <td>Opções globais</td> </tr><tr> <td>[[<code>$MYSQL_HOME/my.cnf</code>]]</td> <td>Opções específicas do servidor (apenas para o servidor)</td> </tr><tr> <td>[[<code>defaults-extra-file</code>]]</td> <td>O arquivo especificado com [[<code>--defaults-extra-file</code>]], se houver</td> </tr><tr> <td>[[<code>~/.my.cnf</code>]]</td> <td>Opções específicas para o usuário</td> </tr><tr> <td>[[<code>~/.mylogin.cnf</code>]]</td> <td>Opções de caminho de login específicas para o usuário (apenas para clientes)</td> </tr><tr> <td>[[<code><em class="replaceable"><code>DATADIR</code>]]</em>/mysqld-auto.cnf</code></td> <td>As variáveis do sistema persistiram com [[<code>SET PERSIST</code>]] ou [[<code>SET PERSIST_ONLY</code>]] (apenas para o servidor)</td> </tr></tbody></table>

Na tabela anterior, `~` representa o diretório inicial do usuário atual (o valor de `$HOME`).

`SYSCONFDIR` representa o diretório especificado com a opção `SYSCONFDIR` para o **CMake** quando o MySQL foi compilado. Por padrão, este é o diretório `etc`, localizado sob o diretório de instalação integrado.

`MYSQL_HOME` é uma variável de ambiente que contém o caminho para o diretório onde o arquivo específico do servidor `my.cnf` reside. Se `MYSQL_HOME` não for definido e você iniciar o servidor usando o programa **mysqld\_safe**, **mysqld\_safe** define-o como `BASEDIR`, o diretório de instalação da base do MySQL.

`DATADIR` representa o diretório de dados do MySQL. Como usado para encontrar `mysqld-auto.cnf`, seu valor padrão é a localização do diretório de dados construído quando o MySQL foi compilado, mas pode ser alterado por `--datadir`, especificado como um arquivo de opção ou opção de linha de comando processado antes de `mysqld-auto.cnf` ser processado.

Se forem encontradas várias instâncias de uma opção específica, a última instância prevalece, com uma exceção: para o **mysqld**, a *primeira* instância da opção `--user` é usada como uma precaução de segurança, para evitar que um usuário especificado em um arquivo de opção seja sobrescrito na linha de comando.

##### Sintaxe do arquivo de opção

A descrição a seguir sobre a sintaxe do arquivo de opções se aplica a arquivos que você edita manualmente. Isso exclui `.mylogin.cnf`, que é criado usando o **mysql\_config\_editor** e é criptografado, e `mysqld-auto.cnf`, que o servidor cria no formato JSON.

Qualquer opção longa que possa ser fornecida na linha de comando ao executar um programa MySQL também pode ser fornecida em um arquivo de opções. Para obter a lista de opções disponíveis para um programa, execute-o com a opção `--help`. (Para o **mysqld**, use `--verbose` e `--help`.)

A sintaxe para especificar opções em um arquivo de opções é semelhante à sintaxe da linha de comando (consulte a Seção 6.2.2.1, “Usando Opções na Linha de Comando”). No entanto, em um arquivo de opções, você omite as duas barras inclinadas iniciais do nome da opção e especifica apenas uma opção por linha. Por exemplo, `--quick` e `--host=localhost` na linha de comando devem ser especificados como `quick` e `host=localhost` em linhas separadas em um arquivo de opções. Para especificar uma opção do tipo `--loose-opt_name` em um arquivo de opções, escreva-a como `loose-opt_name`.

Linhas vazias em arquivos de opções são ignoradas. Linhas não vazias podem ter qualquer uma das seguintes formas:

- `#comment`, `;comment`

  As linhas de comentário começam com `#` ou `;`. Uma linha de comentário `#` também pode começar no meio de uma linha.

- `[group]`

  `group` é o nome do programa ou grupo para o qual você deseja definir opções. Após uma linha de grupo, quaisquer linhas de definição de opções se aplicam ao grupo nomeado até o final do arquivo de opções ou até que outra linha de grupo seja fornecida. Os nomes dos grupos de opções não são sensíveis ao caso.

- `opt_name`

  Isso é equivalente a `--opt_name` na linha de comando.

- `opt_name=value`

  Isso é equivalente a `--opt_name=value` na linha de comando. Em um arquivo de opções, você pode ter espaços ao redor do caractere `=`, algo que não é verdade na linha de comando. O valor pode ser opcionalmente fechado entre aspas simples ou duplas, o que é útil se o valor contiver um caractere de comentário `#`.

Espaços de início e de fim são automaticamente excluídos dos nomes e valores das opções.

Você pode usar as sequências de escape `\b`, `\t`, `\n`, `\r`, `\\` e `\s` nos valores das opções para representar os caracteres de retrocesso, tabulação, nova linha, retorno de carro, barra invertida e espaço. Nos arquivos de opções, essas regras de escape se aplicam:

- Um backslash seguido por um caractere de sequência de escape válido é convertido para o caractere representado pela sequência. Por exemplo, `\s` é convertido para um espaço.

- Um backslash não seguido por um caractere de sequência de escape válido permanece inalterado. Por exemplo, `\S` é mantido como está.

As regras anteriores significam que um backslash literal pode ser fornecido como `\\`, ou como `\` se não for seguido por um caractere de sequência de escape válido.

As regras para sequências de escape em arquivos de opções diferem ligeiramente das regras para sequências de escape em literais de string em declarações SQL. No último contexto, se “`x`” não for um caractere de sequência de escape válido, `\x` se torna “`x`” em vez de `\x`. Veja a Seção 11.1.1, “Literais de String”.

As regras de escape para valores de arquivos de opções são especialmente relevantes para nomes de caminho do Windows, que usam `\` como separador de caminho. Um separador em um nome de caminho do Windows deve ser escrito como `\\` se for seguido por um caractere de sequência de escape. Pode ser escrito como `\\` ou `\` se não for. Alternativamente, `/` pode ser usado em nomes de caminho do Windows e é tratado como `\`. Suponha que você queira especificar um diretório base de `C:\Program Files\MySQL\MySQL Server 8.0` em um arquivo de opção. Isso pode ser feito de várias maneiras. Alguns exemplos:

```
basedir="C:\Program Files\MySQL\MySQL Server 8.0"
basedir="C:\\Program Files\\MySQL\\MySQL Server 8.0"
basedir="C:/Program Files/MySQL/MySQL Server 8.0"
basedir=C:\\Program\sFiles\\MySQL\\MySQL\sServer\s8.0
```

Se o nome de um grupo de opções for o mesmo que o nome de um programa, as opções do grupo se aplicam especificamente a esse programa. Por exemplo, os grupos `[mysqld]` e `[mysql]` se aplicam ao servidor **mysqld** e ao programa cliente **mysql**, respectivamente.

O grupo de opções `[client]` é lido por todos os programas cliente fornecidos nas distribuições do MySQL (mas *não* pelo **mysqld**). Para entender como programas cliente de terceiros que usam a API C podem usar arquivos de opções, consulte a documentação da API C em mysql\_options().

O grupo `[client]` permite que você especifique opções que se aplicam a todos os clientes. Por exemplo, `[client]` é o grupo apropriado para usar para especificar a senha para se conectar ao servidor. (Mas certifique-se de que o arquivo de opções seja acessível apenas por você, para que outras pessoas não descubram sua senha.) Não coloque uma opção no grupo `[client]` a menos que seja reconhecida por *todos* os programas de cliente que você usa. Programas que não entendem a opção saem após exibir uma mensagem de erro se você tentar executá-los.

Liste os grupos de opções mais gerais primeiro e os grupos mais específicos depois. Por exemplo, um grupo `[client]` é mais geral porque é lido por todos os programas cliente, enquanto um grupo `[mysqldump]` é lido apenas pelo **mysqldump**. As opções especificadas mais tarde substituem as opções especificadas anteriormente, então colocar os grupos de opções na ordem `[client]`, `[mysqldump]` permite que as opções específicas do **mysqldump** substituam as opções do `[client]`.

Aqui está um arquivo de opção global típico:

```
[client]
port=3306
socket=/tmp/mysql.sock

[mysqld]
port=3306
socket=/tmp/mysql.sock
key_buffer_size=16M
max_allowed_packet=128M

[mysqldump]
quick
```

Aqui está um arquivo de opção de usuário típico:

```
[client]
# The following password is sent to all standard MySQL clients
password="my password"

[mysql]
no-auto-rehash
connect_timeout=2
```

Para criar grupos de opções que só possam ser lidos pelos servidores do **mysqld** a partir de séries específicas de versões do MySQL, use grupos com nomes como `[mysqld-5.7]`, `[mysqld-8.0]` e assim por diante. O seguinte grupo indica que o ajuste `sql_mode` deve ser usado apenas por servidores do MySQL com números de versão 8.0.x:

```
[mysqld-8.0]
sql_mode=TRADITIONAL
```

##### Inclusões no arquivo de opção

É possível usar as diretivas `!include` em arquivos de opções para incluir outros arquivos de opções e `!includedir` para procurar diretórios específicos por arquivos de opções. Por exemplo, para incluir o arquivo `/home/mydir/myopt.cnf`, use a seguinte diretiva:

```
!include /home/mydir/myopt.cnf
```

Para pesquisar o diretório `/home/mydir` e ler os arquivos de opção encontrados lá, use esta diretiva:

```
!includedir /home/mydir
```

O MySQL não garante a ordem em que os arquivos de opção no diretório são lidos.

Nota

Quaisquer arquivos que devem ser encontrados e incluídos usando a diretiva `!includedir` em sistemas operacionais Unix *devem* ter nomes de arquivos terminando em `.cnf`. No Windows, essa diretiva verifica arquivos com as extensões `.ini` ou `.cnf`.

Escreva o conteúdo de um arquivo de opção incluído como qualquer outro arquivo de opção. Ou seja, ele deve conter grupos de opções, cada um precedido por uma linha `[group]` que indica o programa ao qual as opções se aplicam.

Enquanto um arquivo incluído está sendo processado, apenas as opções dos grupos que o programa atual está procurando são usadas. Outros grupos são ignorados. Suponha que um arquivo `my.cnf` contenha esta linha:

```
!include /home/mydir/myopt.cnf
```

E suponha que `/home/mydir/myopt.cnf` pareça assim:

```
[mysqladmin]
force

[mysqld]
key_buffer_size=16M
```

Se o arquivo for processado pelo **mysqld**, apenas o grupo `[mysqld]` em `/home/mydir/myopt.cnf` será usado. Se o arquivo for processado pelo **mysqladmin**, apenas o grupo `[mysqladmin]` será usado. Se o arquivo for processado por qualquer outro programa, nenhuma opção em `/home/mydir/myopt.cnf` será usada.

A diretiva `!includedir` é processada de maneira semelhante, exceto que todos os arquivos de opção no diretório nomeado são lidos.

Se um arquivo de opções contiver diretivas `!include` ou `!includedir`, os arquivos nomeados por essas diretivas são processados sempre que o arquivo de opções é processado, independentemente de onde apareçam no arquivo.

Para que as diretivas de inclusão funcionem, o caminho do arquivo não deve ser especificado entre aspas e não deve conter sequências de escape. Por exemplo, as seguintes declarações fornecidas em `my.ini` leem o arquivo de opções `myopts.ini`:

```
!include C:/ProgramData/MySQL/MySQL Server/myopts.ini
!include C:\ProgramData\MySQL\MySQL Server\myopts.ini
!include C:\\ProgramData\\MySQL\\MySQL Server\\myopts.ini
```

No Windows, se `!include /path/to/extra.ini` for a última linha do arquivo, certifique-se de que uma nova linha seja anexada no final; caso contrário, a linha será ignorada.
