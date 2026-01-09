#### 6.2.2.2 Usando Arquivos de Opções

A maioria dos programas do MySQL pode ler opções de inicialização a partir de arquivos de opções (às vezes chamados de arquivos de configuração). Arquivos de opções fornecem uma maneira conveniente de especificar opções comumente usadas, para que não precisem ser inseridas na linha de comando toda vez que você executa um programa.

Para determinar se um programa lê arquivos de opções, invólucvelo com a opção `--help`. (Para o `mysqld`, use `--verbose` e `--help`.) Se o programa ler arquivos de opções, a mensagem de ajuda indica quais arquivos ele procura e quais grupos de opções ele reconhece.

::: info Nota

Um programa do MySQL iniciado com a opção `--no-defaults` não lê outros arquivos de opções além do `.mylogin.cnf`.

Um servidor iniciado com a variável de sistema `persisted_globals_load` desabilitada não lê `mysqld-auto.cnf`.

:::

Muitos arquivos de opções são arquivos de texto simples, criados usando qualquer editor de texto. As exceções são:

* O arquivo `.mylogin.cnf` que contém opções de caminho de login. Este é um arquivo criptografado criado pelo utilitário `mysql_config_editor`. Veja a Seção 6.6.7, “`mysql_config_editor` — Utilitário de Configuração do MySQL”. Um “caminho de login” é um grupo de opções que permite apenas certas opções: `host`, `user`, `password`, `port` e `socket`. Os programas cliente especificam qual caminho de login ler a partir do `.mylogin.cnf` usando a opção  `--login-path`.

  Para especificar um nome de arquivo de caminho de login alternativo, defina a variável de ambiente `MYSQL_TEST_LOGIN_FILE`. Esta variável é usada pelo utilitário de teste `mysql-test-run.pl`, mas também é reconhecida pelo `mysql_config_editor` e pelos clientes do MySQL, como `mysql`, `mysqladmin` e assim por diante.
* O arquivo `mysqld-auto.cnf` no diretório de dados. Este arquivo no formato JSON contém configurações de variáveis de sistema persistentes. Ele é criado pelo servidor ao executar as instruções `SET PERSIST` ou `SET PERSIST_ONLY`. Veja a Seção 7.1.9.3, “Variáveis de Sistema Persistidas”. A gestão do `mysqld-auto.cnf` deve ser deixada ao servidor e não realizada manualmente.

*  Ordem de Processamento de Arquivos de Opções
*  Sintaxe de Arquivos de Opções
*  Inclusões de Arquivos de Opções

##### Ordem de Processamento de Arquivos de Opções

O MySQL procura por arquivos de opções na ordem descrita na discussão a seguir e lê quaisquer que existam. Se um arquivo de opção que você deseja usar não existir, crie-o usando o método apropriado, conforme discutido anteriormente.

::: info Nota

Para informações sobre arquivos de opções usados com programas do NDB Cluster, consulte a Seção 25.4, “Configuração do NDB Cluster”.

:::

No Windows, os programas do MySQL leem as opções de inicialização dos arquivos mostrados na tabela a seguir, na ordem especificada (os arquivos listados primeiro são lidos primeiro, os arquivos lidos posteriormente têm precedência).

**Tabela 6.1 Arquivos de Opções Lidos em Sistemas Windows**

<table><thead><tr> <th>Nome do Arquivo</th> <th>Propósito</th> </tr></thead><tbody><tr> <td><code><code>%WINDIR%</code>\my.ini</code>, <code><code>%WINDIR%</code>\my.cnf</code></td> <td>Opções globais</td> </tr><tr> <td><code>C:\my.ini</code>, <code>C:\my.cnf</code></td> <td>Opções globais</td> </tr><tr> <td><code><em><code>BASEDIR</code></em>\my.ini</code>, <code><em><code>BASEDIR</code></em>\my.cnf</code></td> <td>Opções globais</td> </tr><tr> <td><code>defaults-extra-file</code></td> <td>O arquivo especificado com <code>--defaults-extra-file</code>, se houver</td> </tr><tr> <td><code><code>%APPDATA%</code>\MySQL\.mylogin.cnf</code></td> <td>Opções de caminho de login (apenas clientes)</td> </tr><tr> <td><code><em><code>DATADIR</code></em>\mysqld-auto.cnf</code></td> <td>Variáveis do sistema persistidas com <code>SET PERSIST</code> ou <code>SET PERSIST_ONLY</code> (apenas servidor)</td> </tr></tbody></table>

Na tabela anterior, `%WINDIR%` representa a localização do seu diretório do Windows. Isso é comumente `C:\WINDOWS`. Use o seguinte comando para determinar sua localização exata a partir do valor da variável de ambiente `WINDIR`:

```
C:\> echo %WINDIR%
```

`%APPDATA%` representa o valor do diretório de dados do aplicativo do Windows. Use o seguinte comando para determinar sua localização exata a partir do valor da variável de ambiente `APPDATA`:

```
C:\> echo %APPDATA%
```

*`BASEDIR`* representa o diretório de instalação da base do MySQL. Quando o MySQL 8.4 foi instalado usando o MSI, este é tipicamente `C:\PROGRAMDIR\MySQL\MySQL Server 8.4`, onde *`PROGRAMDIR`* representa o diretório de programas (geralmente `Program Files` para versões em inglês do Windows).

Importante

Embora o MySQL Configurator coloque a maioria dos arquivos sob *`PROGRAMDIR`*, ele instala `my.ini` sob o diretório `C:\ProgramData\MySQL\MySQL Server 8.4\` por padrão.

*`DATADIR`* representa o diretório de dados do MySQL. Como usado para encontrar `mysqld-auto.cnf`, seu valor padrão é a localização do diretório de dados construído quando o MySQL foi compilado, mas pode ser alterado por `--datadir` especificado como uma opção de arquivo ou opção de linha de comando processada antes que `mysqld-auto.cnf` seja processada.

Em sistemas Unix e Unix-like, os programas do MySQL leem as opções de inicialização dos arquivos mostrados na tabela a seguir, na ordem especificada (os arquivos listados primeiro são lidos primeiro, os arquivos lidos mais tarde têm precedência).

::: info Nota

Em plataformas Unix, o MySQL ignora arquivos de configuração que são legíveis por todos. Isso é intencional como uma medida de segurança.

:::

**Tabela 6.2 Arquivos de Opções Lidos em Sistemas Unix e Unix-Like**

<table><thead><tr> <th>Nome do arquivo</th> <th>Propósito</th> </tr></thead><tbody><tr> <td><code>/etc/my.cnf</code></td> <td>Opções globais</td> </tr><tr> <td><code>/etc/mysql/my.cnf</code></td> <td>Opções globais</td> </tr><tr> <td><code><em><code>SYSCONFDIR</code></em>/my.cnf</code></td> <td>Opções globais (apenas para o servidor)</td> </tr><tr> <td><code>$MYSQL_HOME/my.cnf</code></td> <td>Opções específicas do servidor (apenas para o servidor)</td> </tr><tr> <td><code>defaults-extra-file</code></td> <td>O arquivo especificado com <code>--defaults-extra-file</code>, se houver</td> </tr><tr> <td><code>~/.my.cnf</code></td> <td>Opções específicas do usuário</td> </tr><tr> <td><code>~/.mylogin.cnf</code></td> <td>Opções de caminho de login específicas do usuário (apenas para clientes)</td> </tr><tr> <td><code><em><code>DATADIR</code></em>/mysqld-auto.cnf</code></td> <td>Variáveis de sistema persistidas com <code>SET PERSIST</code> ou <code>SET PERSIST_ONLY</code> (apenas para o servidor)</td> </tr></tbody></table>

Na tabela anterior, `~` representa o diretório de casa do usuário atual (o valor de `$HOME`).

*`SYSCONFDIR`* representa o diretório especificado com a opção `SYSCONFDIR` para o `CMake` quando o MySQL foi compilado. Por padrão, este é o diretório `etc` localizado sob o diretório de instalação integrado.

`MYSQL_HOME` é uma variável de ambiente que contém o caminho para o diretório em que o arquivo `my.cnf` específico do servidor reside. Se `MYSQL_HOME` não for definido e você iniciar o servidor usando o programa `mysqld_safe`, o `mysqld_safe` o define como *`BASEDIR`*, o diretório de instalação base do MySQL.

*`DATADIR`* representa o diretório de dados do MySQL. Como usado para encontrar `mysqld-auto.cnf`, seu valor padrão é a localização do diretório de dados embutido quando o MySQL foi compilado, mas pode ser alterado por `--datadir` especificado como um arquivo de opção ou opção de linha de comando processada antes que `mysqld-auto.cnf` seja processada.

Se forem encontradas várias instâncias de uma opção específica, a última instância prevalece, com uma exceção: para o `mysqld`, a *primeira* instância da opção `--user` é usada como uma precaução de segurança, para evitar que um usuário especificado em um arquivo de opção seja sobrescrito na linha de comando.

##### Sintaxe de Arquivo de Opções

A descrição a seguir da sintaxe de arquivos de opções se aplica a arquivos que você edita manualmente. Isso exclui o `.mylogin.cnf`, que é criado usando o `mysql_config_editor` e é criptografado, e o `mysqld-auto.cnf`, que o servidor cria no formato JSON.

Qualquer opção longa que possa ser dada na linha de comando ao executar um programa MySQL pode ser dada em um arquivo de opção também. Para obter a lista de opções disponíveis para um programa, execute-o com a opção `--help`. (Para o `mysqld`, use `--verbose` e `--help`.)

A sintaxe para especificar opções em um arquivo de opções é semelhante à sintaxe da linha de comando (veja a Seção 6.2.2.1, “Usando Opções na Linha de Comando”). No entanto, em um arquivo de opções, você omite as duas barras iniciais do nome da opção e especifica apenas uma opção por linha. Por exemplo, `--quick` e `--host=localhost` na linha de comando devem ser especificados como `quick` e `host=localhost` em linhas separadas em um arquivo de opção. Para especificar uma opção do formato `--loose-opt_name` em um arquivo de opção, escreva-a como `loose-opt_name`.

Linhas vazias em arquivos de opções são ignoradas. Linhas não vazias podem ter qualquer uma das seguintes formas:

* `#comment`, `;comment`

  As linhas de comentário começam com `#` ou `;`. Um comentário `#` pode começar no meio de uma linha também.
* `[group]`

  `group` é o nome do programa ou grupo para o qual você deseja definir opções. Após uma linha de grupo, quaisquer linhas de definição de opções se aplicam ao grupo nomeado até o final do arquivo de opção ou até que outra linha de grupo seja dada. Os nomes de grupos de opções não são case-sensitive.
* `opt_name`

  Isso é equivalente a `--opt_name` na linha de comando.
* `opt_name=value`

Isso é equivalente a `--opt_name=valor` na linha de comando. Em um arquivo de opções, você pode ter espaços ao redor do caractere `=`, algo que não é verdade na linha de comando. O valor pode ser opcionalmente fechado entre aspas simples ou duplas, o que é útil se o valor contiver o caractere de comentário `#`.

Espaços de início e fim são automaticamente removidos dos nomes e valores das opções.

Você pode usar as sequências de escape `\b`, `\t`, `\n`, `\r`, `\\` e `\s` nos valores das opções para representar os caracteres de retrocesso, tabulação, nova linha, retorno de carro, barra invertida e espaço. Em arquivos de opções, essas regras de escape se aplicam:

* Uma barra invertida seguida de um caractere de sequência de escape válido é convertida para o caractere representado pela sequência. Por exemplo, `\s` é convertido em um espaço.
* Uma barra invertida não seguida de um caractere de sequência de escape válido permanece inalterada. Por exemplo, `\S` é mantido como está.

As regras anteriores significam que uma barra invertida literal pode ser dada como `\\`, ou como `\` se não for seguida por um caractere de sequência de escape válido.

As regras para sequências de escape em arquivos de opções diferem ligeiramente das regras para sequências de escape em literais de string em declarações SQL. No último contexto, se “`x`” não for um caractere de sequência de escape válido, `\x` se torna “`x`” em vez de `\x`.

As regras de escape para valores de arquivos de opções são especialmente relevantes para nomes de caminho do Windows, que usam `\` como separador de caminho. Um separador em um nome de caminho do Windows deve ser escrito como `\\` se for seguido por um caractere de sequência de escape. Pode ser escrito como `\\` ou `\` se não for. Alternativamente, `/` pode ser usado em nomes de caminho do Windows e é tratado como `\`. Suponha que você queira especificar um diretório base de `C:\Program Files\MySQL\MySQL Server 8.4` em um arquivo de opções. Isso pode ser feito de várias maneiras. Alguns exemplos:

```
basedir="C:\Program Files\MySQL\MySQL Server 8.4"
basedir="C:\\Program Files\\MySQL\\MySQL Server 8.4"
basedir="C:/Program Files/MySQL/MySQL Server 8.4"
basedir=C:\\Program\sFiles\\MySQL\\MySQL\sServer\s8.4
```

Se o nome de um grupo de opções for o mesmo que o nome de um programa, as opções do grupo se aplicam especificamente a esse programa. Por exemplo, os grupos `[mysqld]` e `[mysql]` se aplicam ao servidor `mysqld` e ao programa cliente `mysql`, respectivamente.

O grupo de opções `[client]` é lido por todos os programas cliente fornecidos nas distribuições do MySQL (mas *não* pelo `mysqld`). Para entender como programas cliente de terceiros que usam a API C podem usar arquivos de opções, consulte a documentação da API C em `mysql_options()`.

O grupo `[client]` permite que você especifique opções que se aplicam a todos os clientes. Por exemplo, `[client]` é o grupo apropriado para especificar a senha para se conectar ao servidor. (Mas certifique-se de que o arquivo de opção seja acessível apenas por você, para que outras pessoas não descubram sua senha.) Certifique-se de não colocar uma opção no grupo `[client]` a menos que seja reconhecida por *todos* os programas cliente que você usa. Programas que não entendem a opção saem após exibir uma mensagem de erro se você tentar executá-los.

Liste grupos de opções mais gerais primeiro e grupos mais específicos depois. Por exemplo, um grupo `[client]` é mais geral porque é lido por todos os programas cliente, enquanto um grupo `[mysqldump]` é lido apenas pelo `mysqldump`. As opções especificadas mais tarde substituem opções especificadas anteriormente, então colocar os grupos de opções na ordem `[client]`, `[mysqldump]` permite que as opções específicas do `mysqldump` substituam as opções do `[client]`.

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

Para criar grupos de opções que serão lidos apenas por servidores `mysqld` de séries específicas de lançamento do MySQL, use grupos com nomes de `[mysqld-8.3]`, `[mysqld-8.4]` e assim por diante. O seguinte grupo indica que o ajuste `sql_mode` deve ser usado apenas por servidores MySQL com números de versão `8.4.x`:

```
[mysqld-8.4]
sql_mode=TRADITIONAL
```

##### Inclusões de Arquivo de Opções
English:
```
!include /home/mydir/myopt.cnf
```

É possível usar diretivas `!include` em arquivos de opções para incluir outros arquivos de opções e `!includedir` para procurar diretórios específicos em busca de arquivos de opções. Por exemplo, para incluir o arquivo `/home/mydir/myopt.cnf`, use a seguinte diretiva:

```
!includedir /home/mydir
```

Para procurar o diretório `/home/mydir` e ler os arquivos de opções encontrados lá, use esta diretiva:

```
!include /home/mydir/myopt.cnf
```

O MySQL não garante a ordem em que os arquivos de opções no diretório são lidos.

::: info Nota

Arquivos que devem ser encontrados e incluídos usando a diretiva `!includedir` em sistemas operacionais Unix *devem* ter nomes de arquivos terminando em `.cnf`. Em Windows, esta diretiva verifica arquivos com a extensão `.ini` ou `.cnf`.

:::

Escreva o conteúdo de um arquivo de opção incluído como qualquer outro arquivo de opção. Ou seja, ele deve conter grupos de opções, cada um precedido por uma linha `[group]` que indica o programa ao qual as opções se aplicam.

Enquanto um arquivo incluído está sendo processado, apenas as opções nos grupos que o programa atual está procurando são usadas. Outros grupos são ignorados. Suponha que um arquivo `my.cnf` contenha esta linha:

```
[mysqladmin]
force

[mysqld]
key_buffer_size=16M
```

E suponha que `/home/mydir/myopt.cnf` seja o seguinte:

```
!include C:/ProgramData/MySQL/MySQL Server/myopts.ini
!include C:\ProgramData\MySQL\MySQL Server\myopts.ini
!include C:\\ProgramData\\MySQL\\MySQL Server\\myopts.ini
```

Se `my.cnf` for processado pelo `mysqld`, apenas o grupo `[mysqld]` em `/home/mydir/myopt.cnf` é usado. Se o arquivo for processado pelo `mysqladmin`, apenas o grupo `[mysqladmin]` é usado. Se o arquivo for processado por qualquer outro programa, nenhuma opção em `/home/mydir/myopt.cnf` é usada.

A diretiva `!includedir` é processada de forma semelhante, exceto que todos os arquivos de opção no diretório nomeado são lidos.

Se um arquivo de opção contém diretivas `!include` ou `!includedir`, os arquivos nomeados por essas diretivas são processados sempre que o arquivo de opção é processado, independentemente de onde aparecem no arquivo.

Para que as diretivas de inclusão funcionem, o caminho do arquivo não deve ser especificado entre aspas e não deve conter sequências de escape. Por exemplo, as seguintes declarações no arquivo `my.ini` leem o arquivo de opções `myopts.ini`:



No Windows, se `!include /path/to/extra.ini` for a última linha do arquivo, certifique-se de que uma nova linha é anexada no final; caso contrário, a linha é ignorada.