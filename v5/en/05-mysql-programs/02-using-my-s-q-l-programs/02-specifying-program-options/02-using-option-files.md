#### 4.2.2.2 Usando Arquivos de Opções

A maioria dos programas MySQL pode ler opções de inicialização (startup options) de arquivos de opções (às vezes chamados de arquivos de configuração). Arquivos de opções fornecem uma maneira conveniente de especificar opções comumente usadas para que não precisem ser inseridas na linha de comando (command line) toda vez que você executa um programa.

Para determinar se um programa lê arquivos de opções, invoque-o com a opção `--help`. (Para **mysqld**, use `--verbose` e `--help`.) Se o programa ler arquivos de opções, a mensagem de ajuda indicará quais arquivos ele procura e quais grupos de opções ele reconhece.

Nota

Um programa MySQL iniciado com a opção `--no-defaults` não lê nenhum arquivo de opções além de `.mylogin.cnf`.

Muitos arquivos de opções são arquivos de texto simples, criados usando qualquer editor de texto. A exceção é o arquivo `.mylogin.cnf`, que contém opções de *login path*. Este é um arquivo criptografado criado pelo utilitário **mysql_config_editor**. Veja Seção 4.6.6, “mysql_config_editor — Utilitário de Configuração MySQL”. Um “login path” é um grupo de opções que permite apenas certas opções: `host`, `user`, `password`, `port` e `socket`. Programas Client especificam qual *login path* ler de `.mylogin.cnf` usando a opção `--login-path`.

Para especificar um nome de arquivo de *login path* alternativo, defina a variável de ambiente `MYSQL_TEST_LOGIN_FILE`. Essa variável é usada pelo utilitário de teste **mysql-test-run.pl**, mas também é reconhecida pelo **mysql_config_editor** e por clientes MySQL como **mysql**, **mysqladmin** e assim por diante.

O MySQL procura por arquivos de opções na ordem descrita na discussão a seguir e lê todos os que existirem. Se um arquivo de opções que você deseja usar não existir, crie-o usando o método apropriado, conforme discutido.

Nota

Para obter informações sobre arquivos de opções usados com programas NDB Cluster, veja Seção 21.4, “Configuração do NDB Cluster”.

* Ordem de Processamento de Arquivos de Opções
* Sintaxe de Arquivos de Opções
* Inclusões de Arquivos de Opções

##### Ordem de Processamento de Arquivos de Opções

No Windows, programas MySQL leem opções de inicialização (startup options) dos arquivos mostrados na tabela a seguir, na ordem especificada (os arquivos listados primeiro são lidos primeiro, os arquivos lidos posteriormente têm precedência).

**Tabela 4.1 Arquivos de Opções Lidos em Sistemas Windows**

<table summary="Arquivos de opções lidos por programas MySQL em sistemas Windows."><thead><tr> <th>Nome do Arquivo</th> <th>Propósito</th> </tr></thead><tbody><tr> <td><code><code>%WINDIR%</code>\my.ini</code>, <code><code>%WINDIR%</code>\my.cnf</code></td> <td>Opções globais</td> </tr><tr> <td><code>C:\my.ini</code>, <code>C:\my.cnf</code></td> <td>Opções globais</td> </tr><tr> <td><code><em><code>BASEDIR</code></em>\my.ini</code>, <code><em><code>BASEDIR</code></em>\my.cnf</code></td> <td>Opções globais</td> </tr><tr> <td><code>defaults-extra-file</code></td> <td>O arquivo especificado com <code>--defaults-extra-file</code>, se houver</td> </tr><tr> <td><code><code>%APPDATA%</code>\MySQL\.mylogin.cnf</code></td> <td>Opções de login path (somente clientes)</td> </tr> </tbody></table>

Na tabela anterior, `%WINDIR%` representa a localização do seu diretório Windows. Geralmente é `C:\WINDOWS`. Use o seguinte comando para determinar sua localização exata a partir do valor da variável de ambiente `WINDIR`:

```sql
C:\> echo %WINDIR%
```

`%APPDATA%` representa o valor do diretório de dados de aplicativos (*application data directory*) do Windows. Use o seguinte comando para determinar sua localização exata a partir do valor da variável de ambiente `APPDATA`:

```sql
C:\> echo %APPDATA%
```

*`BASEDIR`* representa o diretório base de instalação do MySQL. Quando o MySQL 5.7 é instalado usando o MySQL Installer, este é tipicamente `C:\PROGRAMDIR\MySQL\MySQL Server 5.7`, onde *`PROGRAMDIR`* representa o diretório de programas (geralmente `Program Files` para versões em inglês do Windows). Veja Seção 2.3.3, “MySQL Installer for Windows”.

Importante

Embora o MySQL Installer coloque a maioria dos arquivos sob *`PROGRAMDIR`*, ele instala `my.ini` no diretório `C:\ProgramData\MySQL\MySQL Server 5.7\` por padrão.

Em sistemas Unix e Unix-like, programas MySQL leem opções de inicialização (startup options) dos arquivos mostrados na tabela a seguir, na ordem especificada (os arquivos listados primeiro são lidos primeiro, os arquivos lidos posteriormente têm precedência).

Nota

Em plataformas Unix, o MySQL ignora arquivos de configuração que são graváveis por todos (*world-writable*). Isso é intencional como uma medida de segurança.

**Tabela 4.2 Arquivos de Opções Lidos em Sistemas Unix e Unix-Like**

<table summary="Arquivos de opções lidos por programas MySQL em sistemas Unix e Unix-like."><thead><tr> <th>Nome do Arquivo</th> <th>Propósito</th> </tr></thead><tbody><tr> <td><code>/etc/my.cnf</code></td> <td>Opções globais</td> </tr><tr> <td><code>/etc/mysql/my.cnf</code></td> <td>Opções globais</td> </tr><tr> <td><code><em><code>SYSCONFDIR</code></em>/my.cnf</code></td> <td>Opções globais</td> </tr><tr> <td><code>$MYSQL_HOME/my.cnf</code></td> <td>Opções específicas do Server (somente server)</td> </tr><tr> <td><code>defaults-extra-file</code></td> <td>O arquivo especificado com <code>--defaults-extra-file</code>, se houver</td> </tr><tr> <td><code>~/.my.cnf</code></td> <td>Opções específicas do usuário</td> </tr><tr> <td><code>~/.mylogin.cnf</code></td> <td>Opções de login path específicas do usuário (somente clientes)</td> </tr> </tbody></table>

Na tabela anterior, `~` representa o diretório *home* do usuário atual (o valor de `$HOME`).

*`SYSCONFDIR`* representa o diretório especificado com a opção `SYSCONFDIR` para **CMake** quando o MySQL foi construído. Por padrão, este é o diretório `etc` localizado sob o diretório de instalação compilado.

`MYSQL_HOME` é uma variável de ambiente contendo o *path* para o diretório onde reside o arquivo `my.cnf` específico do server. Se `MYSQL_HOME` não estiver definida e você iniciar o server usando o programa **mysqld_safe**, **mysqld_safe** a define como *`BASEDIR`*, o diretório base de instalação do MySQL.

*`DATADIR`* é comumente `/usr/local/mysql/data`, embora isso possa variar por plataforma ou método de instalação. O valor é a localização do diretório de dados (*data directory*) compilada quando o MySQL foi construído, e não a localização especificada com a opção `--datadir` quando **mysqld** inicia. O uso de `--datadir` em tempo de execução não tem efeito sobre onde o server procura por arquivos de opções que ele lê antes de processar quaisquer opções.

Se múltiplas instâncias de uma determinada opção forem encontradas, a última instância tem precedência, com uma exceção: Para **mysqld**, a *primeira* instância da opção `--user` é usada como precaução de segurança, para evitar que um usuário especificado em um arquivo de opções seja substituído na linha de comando.

##### Sintaxe de Arquivos de Opções

A seguinte descrição da sintaxe de arquivos de opções se aplica a arquivos que você edita manualmente. Isso exclui `.mylogin.cnf`, que é criado usando **mysql_config_editor** e é criptografado.

Qualquer opção longa que possa ser fornecida na linha de comando ao executar um programa MySQL também pode ser fornecida em um arquivo de opções. Para obter a lista de opções disponíveis para um programa, execute-o com a opção `--help`. (Para **mysqld**, use `--verbose` e `--help`.)

A sintaxe para especificar opções em um arquivo de opções é semelhante à sintaxe da linha de comando (veja Seção 4.2.2.1, “Usando Opções na Linha de Comando”). No entanto, em um arquivo de opções, você omite os dois traços iniciais do nome da opção e especifica apenas uma opção por linha. Por exemplo, `--quick` e `--host=localhost` na linha de comando devem ser especificados como `quick` e `host=localhost` em linhas separadas em um arquivo de opções. Para especificar uma opção no formato `--loose-opt_name` em um arquivo de opções, escreva-a como `loose-opt_name`.

Linhas vazias em arquivos de opções são ignoradas. Linhas não vazias podem assumir qualquer uma das seguintes formas:

* `#comment`, `;comment`

  Linhas de comentário começam com `#` ou `;`. Um comentário `#` pode começar no meio de uma linha também.

* `[group]`

  *`group`* é o nome do programa ou grupo para o qual você deseja definir opções. Após uma linha de grupo, quaisquer linhas de definição de opção se aplicam ao grupo nomeado até o final do arquivo de opções ou até que outra linha de grupo seja fornecida. Nomes de grupos de opções não diferenciam maiúsculas de minúsculas (*case-sensitive*).

* `opt_name`

  Isso é equivalente a `--opt_name` na linha de comando.

* `opt_name=value`

  Isso é equivalente a `--opt_name=value` na linha de comando. Em um arquivo de opções, você pode ter espaços ao redor do caractere `=`, o que não é verdade na linha de comando. O valor opcionalmente pode ser colocado entre aspas simples ou aspas duplas, o que é útil se o valor contiver um caractere de comentário `#`.

Espaços iniciais e finais são automaticamente excluídos dos nomes e valores das opções.

Você pode usar as sequências de escape `\b`, `\t`, `\n`, `\r`, `\\` e `\s` nos valores das opções para representar os caracteres *backspace*, *tab*, nova linha (*newline*), retorno de carro (*carriage return*), barra invertida (*backslash*) e espaço. Em arquivos de opções, estas regras de escape se aplicam:

* Uma barra invertida seguida por um caractere de sequência de escape válido é convertida para o caractere representado pela sequência. Por exemplo, `\s` é convertido em um espaço.

* Uma barra invertida não seguida por um caractere de sequência de escape válido permanece inalterada. Por exemplo, `\S` é mantido como está.

As regras anteriores significam que uma barra invertida literal pode ser fornecida como `\\`, ou como `\` se não for seguida por um caractere de sequência de escape válido.

As regras para sequências de escape em arquivos de opções diferem ligeiramente das regras para sequências de escape em literais de string em instruções SQL. Neste último contexto, se “*`x`*” não for um caractere de sequência de escape válido, `\x` torna-se “*`x`*” em vez de `\x`. Veja Seção 9.1.1, “Literais de String”.

As regras de escape para valores de arquivos de opções são especialmente pertinentes para nomes de *path* do Windows, que usam `\` como separador de nome de *path*. Um separador em um nome de *path* do Windows deve ser escrito como `\\` se for seguido por um caractere de sequência de escape. Ele pode ser escrito como `\\` ou `\` se não for. Alternativamente, `/` pode ser usado em nomes de *path* do Windows e é tratado como `\`. Suponha que você queira especificar um diretório base de `C:\Program Files\MySQL\MySQL Server 5.7` em um arquivo de opções. Isso pode ser feito de várias maneiras. Alguns exemplos:

```sql
basedir="C:\Program Files\MySQL\MySQL Server 5.7"
basedir="C:\\Program Files\\MySQL\\MySQL Server 5.7"
basedir="C:/Program Files/MySQL/MySQL Server 5.7"
basedir=C:\\Program\sFiles\\MySQL\\MySQL\sServer\s5.7
```

Se um nome de grupo de opções for o mesmo que um nome de programa, as opções no grupo se aplicam especificamente a esse programa. Por exemplo, os grupos `[mysqld]` e `[mysql]` se aplicam ao server **mysqld** e ao programa client **mysql**, respectivamente.

O grupo de opções `[client]` é lido por todos os programas client fornecidos nas distribuições MySQL (mas *não* por **mysqld**). Para entender como programas client de terceiros que usam a API C podem usar arquivos de opções, consulte a documentação da API C em mysql_options().

O grupo `[client]` permite que você especifique opções que se aplicam a todos os clients. Por exemplo, `[client]` é o grupo apropriado para usar para especificar a *password* para conectar-se ao server. (Mas certifique-se de que o arquivo de opções seja acessível apenas por você, para que outras pessoas não possam descobrir sua *password*.) Certifique-se de não colocar uma opção no grupo `[client]` a menos que ela seja reconhecida por *todos* os programas client que você usa. Programas que não entendem a opção param após exibir uma mensagem de erro se você tentar executá-los.

Liste os grupos de opções mais gerais primeiro e os grupos mais específicos depois. Por exemplo, um grupo `[client]` é mais geral porque é lido por todos os programas client, enquanto um grupo `[mysqldump]` é lido apenas por **mysqldump**. Opções especificadas posteriormente substituem opções especificadas anteriormente, então colocar os grupos de opções na ordem `[client]`, `[mysqldump]` permite que opções específicas de **mysqldump** substituam opções de `[client]`.

Aqui está um arquivo de opções global típico:

```sql
[client]
port=3306
socket=/tmp/mysql.sock

[mysqld]
port=3306
socket=/tmp/mysql.sock
key_buffer_size=16M
max_allowed_packet=8M

[mysqldump]
quick
```

Aqui está um arquivo de opções de usuário típico:

```sql
[client]
# The following password is sent to all standard MySQL clients
password="my password"

[mysql]
no-auto-rehash
connect_timeout=2
```

Para criar grupos de opções a serem lidos apenas por servers **mysqld** de séries de lançamento MySQL específicas, use grupos com nomes de `[mysqld-5.6]`, `[mysqld-5.7]` e assim por diante. O seguinte grupo indica que a configuração `sql_mode` deve ser usada apenas por servers MySQL com números de versão 5.7.x:

```sql
[mysqld-5.7]
sql_mode=TRADITIONAL
```

##### Inclusões de Arquivos de Opções

É possível usar diretivas `!include` em arquivos de opções para incluir outros arquivos de opções e `!includedir` para procurar diretórios específicos por arquivos de opções. Por exemplo, para incluir o arquivo `/home/mydir/myopt.cnf`, use a seguinte diretiva:

```sql
!include /home/mydir/myopt.cnf
```

Para procurar no diretório `/home/mydir` e ler os arquivos de opções encontrados lá, use esta diretiva:

```sql
!includedir /home/mydir
```

O MySQL não garante a ordem em que os arquivos de opções no diretório são lidos.

Nota

Quaisquer arquivos a serem encontrados e incluídos usando a diretiva `!includedir` em sistemas operacionais Unix *devem* ter nomes de arquivo terminados em `.cnf`. No Windows, esta diretiva verifica arquivos com as extensões `.ini` ou `.cnf`.

Escreva o conteúdo de um arquivo de opções incluído como qualquer outro arquivo de opções. Ou seja, ele deve conter grupos de opções, cada um precedido por uma linha `[group]` que indica o programa ao qual as opções se aplicam.

Enquanto um arquivo incluído está sendo processado, apenas as opções nos grupos que o programa atual está procurando são usadas. Outros grupos são ignorados. Suponha que um arquivo `my.cnf` contenha esta linha:

```sql
!include /home/mydir/myopt.cnf
```

E suponha que `/home/mydir/myopt.cnf` se pareça com isto:

```sql
[mysqladmin]
force

[mysqld]
key_buffer_size=16M
```

Se `my.cnf` for processado por **mysqld**, apenas o grupo `[mysqld]` em `/home/mydir/myopt.cnf` é usado. Se o arquivo for processado por **mysqladmin**, apenas o grupo `[mysqladmin]` é usado. Se o arquivo for processado por qualquer outro programa, nenhuma opção em `/home/mydir/myopt.cnf` é usada.

A diretiva `!includedir` é processada de forma semelhante, exceto que todos os arquivos de opções no diretório nomeado são lidos.

Se um arquivo de opções contiver diretivas `!include` ou `!includedir`, os arquivos nomeados por essas diretivas são processados sempre que o arquivo de opções for processado, independentemente de onde apareçam no arquivo.

Para que as diretivas de inclusão funcionem, o *path* do arquivo não deve ser especificado entre aspas e não deve ter sequências de escape. Por exemplo, as seguintes instruções fornecidas em `my.ini` leem o arquivo de opções `myopts.ini`:

```sql
!include C:/ProgramData/MySQL/MySQL Server/myopts.ini
!include C:\ProgramData\MySQL\MySQL Server\myopts.ini
!include C:\\ProgramData\\MySQL\\MySQL Server\\myopts.ini
```

No Windows, se `!include /path/to/extra.ini` for a última linha do arquivo, certifique-se de que uma nova linha seja anexada no final ou a linha será ignorada.