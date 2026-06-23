## 6.2 Usando programas MySQL

### 6.2.1 Invocação de programas MySQL

Para invocar um programa MySQL a partir da linha de comando (ou seja, do seu shell ou prompt de comando), insira o nome do programa seguido de quaisquer opções ou outros argumentos necessários para instruir o programa o que você deseja que ele faça. Os seguintes comandos mostram algumas invocações de programa de exemplo. `$>` representa o prompt do seu interpretador de comandos; ele não faz parte do que você digita. O prompt específico que você vê depende do seu interpretador de comandos. Os prompts típicos são `$` para **sh**, **ksh** ou **bash**, `%` para **csh** ou **tcsh**, e `C:\>` para os interpretadores de comandos **command.com** ou **cmd.exe** do Windows.

```
$> mysql --user=root test
$> mysqladmin extended-status variables
$> mysqlshow --help
$> mysqldump -u root personnel
```

Os argumentos que começam com uma barra simples ou dupla (`-`, `--`) especificam opções de programa. As opções geralmente indicam o tipo de conexão que um programa deve fazer com o servidor ou afeta seu modo operacional. A sintaxe da opção é descrita na Seção 6.2.2, “Especificando Opções de Programa”.

Os argumentos não opcionais (argumentos sem traço inicial) fornecem informações adicionais ao programa. Por exemplo, o programa **mysql** interpreta o primeiro argumento não opcional como um nome de banco de dados, portanto, o comando `mysql --user=root test` indica que você deseja usar o banco de dados `test`.

As seções posteriores que descrevem programas individuais indicam quais opções um programa suporta e descrevem o significado de quaisquer argumentos adicionais não opcionais.

Algumas opções são comuns a vários programas. As mais utilizadas são as opções `--host` (ou `-h`), `--user` (ou `-u`) e `--password` (ou `-p`) que especificam os parâmetros de conexão. Elas indicam o host onde o servidor MySQL está sendo executado e o nome de usuário e a senha da sua conta MySQL. Todos os programas de cliente MySQL entendem essas opções; elas permitem que você especifique qual servidor conectar e a conta a ser usada nesse servidor. Outras opções de conexão são `--port` (ou `-P`) para especificar um número de porta TCP/IP e `--socket` (ou `-S`) para especificar um arquivo de soquete Unix em Unix (ou nome de canal nomeado em Windows). Para mais informações sobre opções que especificam opções de conexão, consulte a Seção 6.2.4, “Conectando ao servidor MySQL usando opções de comando”.

Você pode achar necessário invocar programas MySQL usando o nome do caminho para o diretório `bin` no qual eles estão instalados. Provavelmente será o caso se você receber um erro de “programa não encontrado” sempre que tentar executar um programa MySQL de qualquer diretório que não seja o diretório `bin`. Para torná-lo mais conveniente usar MySQL, você pode adicionar o nome do caminho do diretório `bin` ao seu ajuste da variável de ambiente `PATH`. Isso permite que você execute um programa digitando apenas seu nome, não seu nome completo. Por exemplo, se o **mysql** estiver instalado em `/usr/local/mysql/bin`, você pode executar o programa invocando-o como **mysql**, e não é necessário invocá-lo como **/usr/local/mysql/bin/mysql**.

Consulte a documentação do seu interpretador de comandos para obter instruções sobre como definir sua variável `PATH`. A sintaxe para definir variáveis de ambiente é específica do interpretador. (Algumas informações são fornecidas na Seção 6.2.9, “Definindo Variáveis de Ambiente”.) Após modificar a configuração do `PATH`, abra uma nova janela de console no Windows ou faça login novamente no Unix para que a configuração entre em vigor.

### 6.2.2 Especificando opções do programa

Existem várias maneiras de especificar opções para programas MySQL:

* Liste as opções na linha de comando após o nome do programa. Isso é comum para opções que se aplicam a uma invocação específica do programa.

* Liste as opções em um arquivo de opções que o programa lê quando ele começa. Isso é comum para as opções que você deseja que o programa use a cada vez que ele é executado.

* Liste as opções nas variáveis de ambiente (consulte a Seção 6.2.9, “Definindo Variáveis de Ambiente”). Esse método é útil para opções que você deseja aplicar cada vez que o programa é executado. Na prática, os arquivos de opção são usados mais comumente para esse propósito, mas a Seção 7.8.3, “Executando múltiplas instâncias do MySQL no Unix”, discute uma situação em que as variáveis de ambiente podem ser muito úteis. Ela descreve uma técnica útil que usa tais variáveis para especificar o número de porta TCP/IP e o arquivo de soquete Unix para o servidor e para os programas cliente.

As opções são processadas em ordem, então, se uma opção for especificada várias vezes, a última ocorrência prevalece. O comando a seguir faz com que o **mysql** se conecte ao servidor que está em execução em `localhost`:

```
mysql -h example.com -h localhost
```

Há uma exceção: para o **mysqld**, a *primeira* instância da opção `--user` é usada como uma precaução de segurança, para evitar que um usuário especificado em um arquivo de opção seja sobrescrito na linha de comando.

Se forem fornecidas opções conflitantes ou relacionadas, as opções posteriores têm precedência sobre as opções anteriores. O seguinte comando executa o **mysql** no modo "sem nomes de colunas":

```
mysql --column-names --skip-column-names
```

Os programas do MySQL determinam quais opções são dadas primeiro, examinando variáveis de ambiente, processando arquivos de opção e, em seguida, verificando a linha de comando. Como as opções posteriores têm precedência sobre as anteriores, a ordem de processamento significa que as variáveis de ambiente têm a menor precedência e as opções da linha de comando a maior.

Para o servidor, uma exceção se aplica: o arquivo de opção **mysqld-auto.cnf** no diretório de dados é processado por último, portanto, ele tem precedência mesmo sobre as opções de linha de comando.

Você pode aproveitar a forma como os programas do MySQL processam as opções, especificando valores padrão de opções para um programa em um arquivo de opções. Isso permite que você evite digitar-os cada vez que você executa o programa, ao mesmo tempo em que permite que você substitua os valores padrão, se necessário, usando opções de linha de comando.

#### 6.2.2.1 Usando opções na linha de comando

As opções do programa especificadas na linha de comando seguem estas regras:

* As opções são fornecidas após o nome do comando.
* Um argumento de opção começa com uma ou duas barras, dependendo se é uma forma curta ou longa do nome da opção. Muitas opções têm tanto formas curtas quanto longas. Por exemplo, `-?` e `--help` são as formas curta e longa da opção que instrui um programa MySQL a exibir sua mensagem de ajuda.

* Os nomes das opções são sensíveis ao caso. `-v` e `-V` são ambos legais e têm significados diferentes. (São as formas abreviadas correspondentes das opções `--verbose` e `--version`.)

* Algumas opções exigem um valor após o nome da opção. Por exemplo, `-h localhost` ou `--host=localhost` indica o host do servidor MySQL para um programa cliente. O valor da opção informa ao programa o nome do host onde o servidor MySQL está em execução.

* Para uma opção longa que recebe um valor, separe o nome da opção e o valor com um sinal `=`. Para uma opção curta que recebe um valor, o valor da opção pode seguir imediatamente a letra da opção, ou pode haver um espaço entre: `-hlocalhost` e `-h localhost` são equivalentes. Uma exceção a essa regra é a opção para especificar sua senha do MySQL. Esta opção pode ser dada em formato longo como `--password=pass_val` ou como `--password`. No último caso (sem valor de senha dado), o programa solicita interativamente a senha. A opção de senha também pode ser dada em formato curto como `-ppass_val` ou como `-p`. No entanto, para o formato curto, se o valor da senha for dado, ele deve seguir a letra da opção *sem espaço intermediário*: Se um espaço segue a letra da opção, o programa não tem como saber se um argumento subsequente é suposto ser o valor da senha ou algum outro tipo de argumento. Consequentemente, os seguintes dois comandos têm dois significados completamente diferentes:

  ```
  mysql -ptest
  mysql -p test
  ```

O primeiro comando instrui o **mysql** a usar um valor de senha de `test`, mas não especifica uma base de dados padrão. O segundo comando instrui o **mysql** a solicitar o valor da senha e a usar `test` como a base de dados padrão.

* Nos nomes das opções, traço (`-`) e sublinhado (`_`) podem ser usados de forma intercambiável na maioria dos casos, embora os traços iniciais *não possam* ser dados como sublinhados. Por exemplo, `--skip-grant-tables` e `--skip_grant_tables` são equivalentes.

Neste Manual, usamos travessões nos nomes das opções, exceto quando underscores são significativos. Este é o caso, por exemplo, de `--log-bin` e `--log_bin`, que são opções diferentes. Nós o incentivamos a fazer o mesmo.

* O servidor MySQL tem certas opções de comando que podem ser especificadas apenas no início e um conjunto de variáveis do sistema, algumas das quais podem ser definidas no início, no tempo de execução ou em ambos. Os nomes das variáveis do sistema usam sublinhados em vez de travessões, e quando referenciados no tempo de execução (por exemplo, usando as declarações `SET` ou `SELECT`, devem ser escritos usando sublinhados:

  ```
  SET GLOBAL general_log = ON;
  SELECT @@GLOBAL.general_log;
  ```

Na inicialização do servidor, a sintaxe para as variáveis do sistema é a mesma para as opções de comando, portanto, dentro dos nomes de variáveis, travessões e sublinhados podem ser usados de forma intercambiável. Por exemplo, `--general_log=ON` e `--general-log=ON` são equivalentes. (Isso também é válido para variáveis do sistema definidas em arquivos de opção.)

* Para as opções que aceitam um valor numérico, o valor pode ser fornecido com um sufixo de `K`, `M` ou `G` para indicar um multiplicador de 1024, 10242 ou

10243. A partir do MySQL 8.0.14, um sufixo também pode ser `T`, `P` e `E` para indicar um multiplicador de 10244, 10245 ou

10246. As letras do sufixo podem ser maiúsculas ou minúsculas.

Por exemplo, o seguinte comando informa ao **mysqladmin** para pingar o servidor 1024 vezes, dormindo 10 segundos entre cada ping:

  ```
  mysqladmin --count=1K --sleep=10 ping
  ```

* Ao especificar nomes de arquivos como valores de opção, evite o uso do caractere meta `~` do shell. Ele pode não ser interpretado conforme o esperado.

Os valores de opção que contêm espaços devem ser citados quando fornecidos na linha de comando. Por exemplo, a opção `--execute` (ou `-e`) pode ser usada com **mysql** para passar uma ou mais declarações SQL separadas por ponto e vírgula ao servidor. Quando esta opção é usada, **mysql** executa as declarações no valor da opção e sai. As declarações devem ser fechadas com aspas. Por exemplo:

```
$> mysql -u root -p -e "SELECT VERSION();SELECT NOW()"
Enter password: ******
+------------+
| VERSION()  |
+------------+
| 8.0.19     |
+------------+
+---------------------+
| NOW()               |
+---------------------+
| 2019-09-03 10:36:48 |
+---------------------+
$>
```

Nota

A forma longa (`--execute`) é seguida por um sinal de igual (`=`).

Para usar valores citados em uma declaração, você deve escapar as aspas internas ou usar um tipo diferente de aspas na declaração a partir das usadas para citar a própria declaração. As capacidades do seu processador de comandos ditam suas escolhas sobre se você pode usar aspas simples ou duplas e a sintaxe para escapar caracteres de citação. Por exemplo, se o seu processador de comandos suporta a citação com aspas simples ou duplas, você pode usar aspas duplas ao redor da declaração e aspas simples para quaisquer valores citados dentro da declaração.

#### 6.2.2.2 Uso de arquivos de opção

A maioria dos programas do MySQL pode ler as opções de inicialização a partir de arquivos de opção (às vezes chamados de arquivos de configuração). Os arquivos de opção fornecem uma maneira conveniente de especificar opções comumente usadas, para que elas não precisem ser inseridas na linha de comando toda vez que você executa um programa.

Para determinar se um programa lê arquivos de opções, invólcá-lo com a opção `--help`. (Para o **mysqld**, use `--verbose` e `--help`.). Se o programa lê arquivos de opções, a mensagem de ajuda indica quais arquivos ele procura e quais grupos de opções ele reconhece.

Nota

Um programa do MySQL que começa com a opção `--no-defaults` não lê outros arquivos de opção além de `.mylogin.cnf`.

Um servidor que começou com a variável de sistema `persisted_globals_load` desativada não lê `mysqld-auto.cnf`.

Muitos arquivos de opção são arquivos de texto simples, criados usando qualquer editor de texto. As exceções são:

* O arquivo `.mylogin.cnf` que contém opções de caminho de login. Este é um arquivo criptografado criado pelo utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Ferramenta de Configuração do MySQL”. Um “caminho de login” é um grupo de opções que permite apenas certas opções: `host`, `user`, `password`, `port` e `socket`. Os programas cliente especificam qual caminho de login deve ser lido de `.mylogin.cnf` usando a opção `--login-path`.

Para especificar um nome alternativo de arquivo de caminho de login, defina a variável de ambiente `MYSQL_TEST_LOGIN_FILE`. Esta variável é usada pelo utilitário de teste **mysql-test-run.pl**, mas também é reconhecida pelo **mysql_config_editor** e pelos clientes MySQL, como **mysql**, **mysqladmin** e assim por diante.

* O arquivo `mysqld-auto.cnf` no diretório de dados. Este arquivo no formato JSON contém configurações persistentes de variáveis do sistema. Ele é criado pelo servidor após a execução das declarações `SET PERSIST`(set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") ou `SET PERSIST_ONLY`(set-variable.html "15.7.6.1 SET Syntax for Variable Assignment"). Veja a Seção 7.1.9.3, “Variáveis do Sistema Persistidas”. A gestão de `mysqld-auto.cnf` deve ser deixada ao servidor e não realizada manualmente.

* Ordem de Processamento de Arquivo de Opção
* Sintaxe do Arquivo de Opção
* Inclusões do Arquivo de Opção

##### Ordem de Processamento de Arquivo de Opção

O MySQL procura arquivos de opção na ordem descrita na discussão a seguir e lê quaisquer que existam. Se um arquivo de opção que você deseja usar não existir, crie-o usando o método apropriado, como foi discutido anteriormente.

Nota

Para obter informações sobre os arquivos de opção usados com os programas do NDB Cluster, consulte a Seção 25.4, “Configuração do NDB Cluster”.

Nos sistemas Windows, os programas do MySQL leem as opções de inicialização dos arquivos mostrados na tabela a seguir, na ordem especificada (os arquivos listados primeiro são lidos primeiro, os arquivos lidos posteriormente têm precedência).

**Tabela 6.1 Arquivos de opção lidos em sistemas Windows**

<table summary="Option files read by MySQL programs on Windows systems."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>File Name</th> <th>Propósito</th> </tr></thead><tbody><tr> <td><code><code>%WINDIR%</code>\my.ini</code>, <code><code>%WINDIR%</code>\my.cnf</code></td> <td>Opções globais</td> </tr><tr> <td><code>C:\my.ini</code>, <code>C:\my.cnf</code></td> <td>Opções globais</td> </tr><tr> <td><code><em class="replaceable"><code>BASEDIR</code></em>\my.ini</code>, <code><em class="replaceable"><code>BASEDIR</code></em>\my.cnf</code></td> <td>Opções globais</td> </tr><tr> <td><code>defaults-extra-file</code></td> <td>O arquivo especificado com<code>--defaults-extra-file</code>, se houver</td> </tr><tr> <td><code><code>%APPDATA%</code>\MySQL\.mylogin.cnf</code></td> <td>Opções de caminho de login (apenas para clientes)</td> </tr><tr> <td><code><em class="replaceable"><code>DATADIR</code></em>\mysqld-auto.cnf</code></td> <td>As variáveis do sistema persistiram<code>SET PERSIST</code>ou<code>SET PERSIST_ONLY</code>(apenas para servidor)</td> </tr></tbody></table>

Na tabela anterior, `%WINDIR%` representa a localização do diretório do Windows. Isso é comumente `C:\WINDOWS`. Use o seguinte comando para determinar sua localização exata a partir do valor da variável de ambiente `WINDIR`:

```
C:\> echo %WINDIR%
```

`%APPDATA%` representa o valor do diretório de dados do aplicativo do Windows. Use o seguinte comando para determinar sua localização exata a partir do valor da variável de ambiente `APPDATA`:

```
C:\> echo %APPDATA%
```

*`BASEDIR`* representa o diretório de instalação da base MySQL. Quando o MySQL 8.0 foi instalado usando o Instalador MySQL, este é tipicamente *`C:\PROGRAMDIR\MySQL\MySQL Server 8.0`* no qual *`PROGRAMDIR`* representa o diretório de programas (geralmente *`Program Files`* para versões em inglês do Windows). Veja a Seção 2.3.3, “Instalador MySQL para Windows”.

Importante

Embora o Instalador MySQL coloque a maioria dos arquivos em *`PROGRAMDIR`*, ele instala `my.ini` sob o diretório `C:\ProgramData\MySQL\MySQL Server 8.0\` por padrão.

*`DATADIR`* representa o diretório de dados do MySQL. Como usado para encontrar `mysqld-auto.cnf`, seu valor padrão é o local do diretório de dados construído quando o MySQL foi compilado, mas pode ser alterado por `--datadir` especificado como uma opção-arquivo ou opção de linha de comando processada antes de `mysqld-auto.cnf` ser processada.

Nos sistemas Unix e semelhantes ao Unix, os programas do MySQL leem as opções de inicialização dos arquivos mostrados na tabela a seguir, na ordem especificada (os arquivos listados primeiro são lidos primeiro, os arquivos lidos posteriormente têm precedência).

Nota

Em plataformas Unix, o MySQL ignora arquivos de configuração que são legítimos para escrita por qualquer usuário. Isso é uma medida de segurança intencional.

**Tabela 6.2 Arquivos de opção lidos em sistemas Unix e Unix-like**

<table summary="Option files read by MySQL programs on Unix and Unix-like systems."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>File Name</th> <th>Propósito</th> </tr></thead><tbody><tr> <td><code>/etc/my.cnf</code></td> <td>Opções globais</td> </tr><tr> <td><code>/etc/mysql/my.cnf</code></td> <td>Opções globais</td> </tr><tr> <td><code><em class="replaceable"><code>SYSCONFDIR</code></em>/my.cnf</code></td> <td>Opções globais</td> </tr><tr> <td><code>$MYSQL_HOME/my.cnf</code></td> <td>Opções específicas para servidor (apenas para servidor)</td> </tr><tr> <td><code>defaults-extra-file</code></td> <td>O arquivo especificado com<code>--defaults-extra-file</code>, se houver</td> </tr><tr> <td><code>~/.my.cnf</code></td> <td>Opções específicas para o usuário</td> </tr><tr> <td><code>~/.mylogin.cnf</code></td> <td>Opções de caminho de login específicas para o usuário (apenas para clientes)</td> </tr><tr> <td><code><em class="replaceable"><code>DATADIR</code></em>/mysqld-auto.cnf</code></td> <td>As variáveis do sistema persistiram<code>SET PERSIST</code>ou<code>SET PERSIST_ONLY</code>(apenas para servidor)</td> </tr></tbody></table>

Na tabela anterior, `~` representa o diretório de casa do usuário atual (o valor de `$HOME`).

*`SYSCONFDIR`* representa o diretório especificado com a opção `SYSCONFDIR` para o **CMake** quando o MySQL foi compilado. Por padrão, este é o diretório `etc` localizado sob o diretório de instalação incorporado.

`MYSQL_HOME` é uma variável de ambiente que contém o caminho para o diretório em que o arquivo específico do servidor `my.cnf` reside. Se `MYSQL_HOME` não for definido e você iniciar o servidor usando o programa **mysqld_safe**, **mysqld_safe** define-o como *`BASEDIR`*, o diretório de instalação da base MySQL.

*`DATADIR`* representa o diretório de dados do MySQL. Como usado para encontrar `mysqld-auto.cnf`, seu valor padrão é o local do diretório de dados construído quando o MySQL foi compilado, mas pode ser alterado por `--datadir` especificado como uma opção-arquivo ou opção de linha de comando processada antes de `mysqld-auto.cnf` ser processada.

Se forem encontradas várias instâncias de uma opção dada, a última instância prevalece, com uma exceção: para o **mysqld**, a *primeira* instância da opção `--user` é usada como uma precaução de segurança, para evitar que um usuário especificado em um arquivo de opção seja sobrescrito na linha de comando.

##### Sintaxe do arquivo de opção

A descrição a seguir sobre a sintaxe do arquivo de opções se aplica a arquivos que você edita manualmente. Isso exclui `.mylogin.cnf`, que é criado usando o **mysql_config_editor** e é criptografado, e `mysqld-auto.cnf`, que o servidor cria em formato JSON.

Qualquer opção longa que possa ser dada na linha de comando ao executar um programa MySQL também pode ser dada em um arquivo de opções. Para obter a lista de opções disponíveis para um programa, execute-o com a opção `--help`. (Para o **mysqld**, use `--verbose` e `--help`.)

A sintaxe para especificar opções em um arquivo de opções é semelhante à sintaxe de linha de comando (consulte a Seção 6.2.2.1, “Usando opções na linha de comando”). No entanto, em um arquivo de opções, você omite as duas barras de insígnia no início do nome da opção e especifica apenas uma opção por linha. Por exemplo, `--quick` e `--host=localhost` na linha de comando devem ser especificados como `quick` e `host=localhost` em linhas separadas em um arquivo de opções. Para especificar uma opção na forma `--loose-opt_name` em um arquivo de opções, escreva-a como `loose-opt_name`.

Linhas vazias em arquivos de opções são ignoradas. Linhas não vazias podem ter qualquer uma das seguintes formas:

* `#comment`, `;comment`

As linhas de comentário começam com `#` ou `;`. Uma linha de comentário `#` também pode começar no meio de uma linha.

* `[group]`

*`group`* é o nome do programa ou grupo para o qual você deseja definir opções. Após uma linha de grupo, quaisquer linhas de definição de opções se aplicam ao grupo nomeado até o final do arquivo de opções ou até que outra linha de grupo seja dada. Os nomes dos grupos de opções não são sensíveis ao caso.

* `opt_name`

Isso é equivalente a `--opt_name` na linha de comando.

* `opt_name=value`

Isso é equivalente a `--opt_name=value` na linha de comando. Em um arquivo de opções, você pode ter espaços ao redor do caractere `=`, algo que não é verdade na linha de comando. O valor opcional pode ser fechado entre aspas simples ou duplas, o que é útil se o valor contiver um caractere de comentário `#`.

Espaços de início e de fim são automaticamente excluídos dos nomes e valores das opções.

Você pode usar as sequências de escape `\b`, `\t`, `\n`, `\r`, `\\` e `\s` nos valores de opção para representar os caracteres de apagamento, tabulação, nova linha, retorno de carro, barra invertida e espaço. Nos arquivos de opção, essas regras de escape se aplicam:

* Um traço seguido por um caractere de sequência de escape válido é convertido para o caractere representado pela sequência. Por exemplo, `\s` é convertido em um espaço.

* Um traço não seguido por um caractere de sequência de escape válido permanece inalterado. Por exemplo, `\S` é mantido como está.

As regras anteriores significam que um traço literal pode ser dado como `\\`, ou como `\` se não for seguido por um caractere de sequência de escape válido.

As regras para sequências de escape em arquivos de opção diferem ligeiramente das regras para sequências de escape em literais de string em declarações SQL. Neste último contexto, se “*`x`*” não for um caractere de sequência de escape válido, `\x` se torna “*`x`*” em vez de `\x`. Veja a Seção 11.1.1, “Literais de String”.

As regras de escape para os valores do arquivo de opções são especialmente relevantes para nomes de caminho do Windows, que usam `\` como um separador de nome de caminho. Um separador em um nome de caminho do Windows deve ser escrito como `\\` se for seguido por um caractere de sequência de escape. Pode ser escrito como `\\` ou `\` se não for. Alternativamente, `/` pode ser usado em nomes de caminho do Windows e é tratado como `\`. Suponha que você queira especificar um diretório base de `C:\Program Files\MySQL\MySQL Server 8.0` em um arquivo de opções. Isso pode ser feito de várias maneiras. Alguns exemplos:

```
basedir="C:\Program Files\MySQL\MySQL Server 8.0"
basedir="C:\\Program Files\\MySQL\\MySQL Server 8.0"
basedir="C:/Program Files/MySQL/MySQL Server 8.0"
basedir=C:\\Program\sFiles\\MySQL\\MySQL\sServer\s8.0
```

Se o nome de um grupo de opções for o mesmo que o nome de um programa, as opções do grupo se aplicam especificamente a esse programa. Por exemplo, os grupos `[mysqld]` e `[mysql]` se aplicam ao servidor **mysqld** e ao programa cliente **mysql**, respectivamente.

O grupo de opções `[client]` é lido por todos os programas cliente fornecidos nas distribuições do MySQL (mas *não* pelo **mysqld**). Para entender como os programas cliente de terceiros que usam a API C podem usar arquivos de opções, consulte a documentação da API C em mysql_options().

O grupo `[client]` permite que você especifique opções que se aplicam a todos os clientes. Por exemplo, `[client]` é o grupo apropriado para usar para especificar a senha para conectar ao servidor. (Mas certifique-se de que o arquivo de opção é acessível apenas por você, para que outras pessoas não descubram sua senha.) Certifique-se de não colocar uma opção no grupo `[client]` a menos que seja reconhecida por *todos* os programas de cliente que você usa. Os programas que não entendem a opção param após exibir uma mensagem de erro se você tentar executá-los.

Liste os grupos de opções mais gerais primeiro e os grupos mais específicos depois. Por exemplo, um grupo `[client]` é mais geral, pois é lido por todos os programas cliente, enquanto um grupo `[mysqldump]` é lido apenas pelo **mysqldump**. As opções especificadas mais tarde substituem as opções especificadas anteriormente, então colocar os grupos de opções na ordem `[client]`, `[mysqldump]` permite que as opções específicas do **mysqldump** substituam as opções do `[client]`.

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

Para criar grupos de opções que devem ser lidos apenas pelos servidores do **mysqld** de séries específicas de lançamento do MySQL, use grupos com nomes como `[mysqld-5.7]`, `[mysqld-8.0]`, e assim por diante. O seguinte grupo indica que o ajuste `sql_mode` deve ser usado apenas pelos servidores do MySQL com números de versão 8.0.x:

```
[mysqld-8.0]
sql_mode=TRADITIONAL
```

##### Opção Inclusões de arquivo

É possível usar as diretivas `!include` em arquivos de opção para incluir outros arquivos de opção e `!includedir` para procurar diretórios específicos para arquivos de opção. Por exemplo, para incluir o arquivo `/home/mydir/myopt.cnf`, use a seguinte diretiva:

```
!include /home/mydir/myopt.cnf
```

Para pesquisar o diretório `/home/mydir` e ler os arquivos de opção encontrados lá, use esta diretiva:

```
!includedir /home/mydir
```

O MySQL não garante a ordem em que os arquivos de opção no diretório são lidos.

Nota

Quaisquer arquivos que devem ser encontrados e incluídos usando a diretiva `!includedir` em sistemas operacionais Unix *devem* ter nomes de arquivo terminando em `.cnf`. Em Windows, essa diretiva verifica arquivos com a extensão `.ini` ou `.cnf`.

Escreva o conteúdo de um arquivo de opção incluído como qualquer outro arquivo de opção. Isso significa que ele deve conter grupos de opções, cada um precedido por uma linha `[group]` que indica o programa ao qual as opções se aplicam.

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

Se o arquivo `my.cnf` for processado pelo **mysqld**, apenas o grupo `[mysqld]` em `/home/mydir/myopt.cnf` será utilizado. Se o arquivo for processado pelo **mysqladmin**, apenas o grupo `[mysqladmin]` será utilizado. Se o arquivo for processado por qualquer outro programa, nenhuma opção em `/home/mydir/myopt.cnf` será utilizada.

A diretiva `!includedir` é processada de forma semelhante, exceto que todos os arquivos de opção no diretório nomeado são lidos.

Se um arquivo de opções contiver diretivas `!include` ou `!includedir`, os arquivos nomeados por essas diretivas são processados sempre que o arquivo de opções é processado, independentemente de onde apareçam no arquivo.

Para que as diretivas de inclusão funcionem, o caminho do arquivo não deve ser especificado entre aspas e não deve ter sequências de escape. Por exemplo, as seguintes declarações fornecidas em `my.ini` leem o arquivo de opção `myopts.ini`:

```
!include C:/ProgramData/MySQL/MySQL Server/myopts.ini
!include C:\ProgramData\MySQL\MySQL Server\myopts.ini
!include C:\\ProgramData\\MySQL\\MySQL Server\\myopts.ini
```

Em Windows, se `!include /path/to/extra.ini` for a última linha do arquivo, certifique-se de que uma nova linha é anexada no final; caso contrário, a linha será ignorada.

#### 6.2.2.3 Opções de linha de comando que afetam o manuseio de arquivos com Option

A maioria dos programas do MySQL que suportam arquivos de opções lida com as seguintes opções. Como essas opções afetam o manuseio de arquivos de opções, elas devem ser fornecidas na linha de comando e não em um arquivo de opção. Para funcionar corretamente, cada uma dessas opções deve ser fornecida antes das outras, com essas exceções:

* `--print-defaults` pode ser usado imediatamente após `--defaults-file`, `--defaults-extra-file` ou `--login-path`.

* Em Windows, se o servidor for iniciado com as opções `--defaults-file` e `--install`, o `--install` deve ser iniciado primeiro. Veja a Seção 2.3.4.8, “Iniciando o MySQL como um Serviço do Windows”.

Ao especificar nomes de arquivos como valores de opção, evite o uso do caractere meta `~` do shell, pois ele pode não ser interpretado conforme o esperado.

**Tabela 6.3 Resumo do arquivo de opções**

<table frame="box" rules="all" summary="Command-line options available for handling option files."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Option Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td>--defaults-extra-file</td> <td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td> </tr><tr><td>--defaults-file</td> <td>Arquivo de opção de leitura apenas nomeado</td> </tr><tr><td>--defaults-group-suffix</td> <td>Valor do sufixo do grupo de opções</td> </tr><tr><td>--login-path</td> <td>Leia as opções de caminho de login a partir de .mylogin.cnf</td> </tr><tr><td>--no-defaults</td> <td>Não leia arquivos de opção</td> </tr></tbody></table>

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=filename</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário e (em todas as plataformas) antes do arquivo de caminho de login. (Para informações sobre a ordem em que os arquivos de opção são usados, consulte a Seção 6.2.2.2, “Usando Arquivos de Opção”.) Se o arquivo não existir ou não for acessível, ocorre um erro. Se *`file_name`* não for um nome de caminho absoluto, ele é interpretado em relação ao diretório atual.

Veja a introdução desta seção sobre as restrições sobre a posição na qual essa opção pode ser especificada.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=filename</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. *`file_name`* é interpretado em relação ao diretório atual se fornecido como um nome de caminho relativo em vez de um nome de caminho completo.

Exceções: Mesmo com `--defaults-file`, o **mysqld** lê `mysqld-auto.cnf` e os programas de cliente lêem `.mylogin.cnf`.

Veja a introdução desta seção sobre as restrições sobre a posição na qual essa opção pode ser especificada.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, o cliente **mysql** normalmente lê os grupos `[client]` e `[mysql]`. Se esta opção for dada como `--defaults-group-suffix=_other`, o **mysql** também lê os grupos `[client_other]` e `[mysql_other]`.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Utilitário de Configuração MySQL”.

Um programa de cliente lê o grupo de opções correspondente ao caminho de login nomeado, além dos grupos de opções que o programa lê por padrão. Considere este comando:

  ```
  mysql --login-path=mypath
  ```

Por padrão, o cliente **mysql** lê os grupos de opções `[client]` e `[mysql]`. Portanto, para o comando mostrado, **mysql** lê `[client]` e `[mysql]` de outros arquivos de opção, e `[client]`, `[mysql]` e `[mypath]` do arquivo de caminho de login.

Os programas de cliente leem o arquivo de caminho de login mesmo quando a opção `--no-defaults` é usada.

Para especificar um nome de arquivo de caminho de login alternativo, defina a variável de ambiente `MYSQL_TEST_LOGIN_FILE`.

Veja a introdução desta seção sobre as restrições sobre a posição na qual essa opção pode ser especificada.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for no-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--no-defaults</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para evitar que elas sejam lidas.

A exceção é que os programas de cliente leem o arquivo de caminho de login `.mylogin.cnf`, se ele existir, mesmo quando o `--no-defaults` é usado. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo que o `--no-defaults` esteja presente. Para criar o `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Veja a Seção 6.6.7, “mysql_config_editor — Ferramenta de Configuração do MySQL”.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for print-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--print-defaults</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção. Os valores da senha são mascarados.

Veja a introdução desta seção sobre as restrições sobre a posição na qual essa opção pode ser especificada.

#### 6.2.2.4 Modificadores de Opção de Programa

Algumas opções são "booleanas" e controlam o comportamento que pode ser ativado ou desativado. Por exemplo, o cliente **mysql** suporta uma opção `--column-names` que determina se deve ou não exibir uma linha de nomes de colunas no início dos resultados da consulta. Por padrão, essa opção está habilitada. No entanto, você pode querer desabilitá-la em algumas situações, como ao enviar a saída do **mysql** para outro programa que espera ver apenas dados e não uma linha de cabeçalho inicial.

Para desabilitar os nomes das colunas, você pode especificar a opção usando qualquer uma dessas formas:

```
--disable-column-names
--skip-column-names
--column-names=0
```

Os prefixos `--disable` e `--skip` e o sufixo `=0` têm o mesmo efeito: eles desativam a opção.

A forma “ativada” da opção pode ser especificada de qualquer uma dessas maneiras:

```
--column-names
--enable-column-names
--column-names=1
```

Os valores `ON`, `TRUE`, `OFF` e `FALSE` também são reconhecidos para opções booleanas (não sensíveis ao caso).

Se uma opção for precedida por `--loose`, um programa não sai com um erro se não reconhecer a opção, mas em vez disso, emite apenas um aviso:

```
$> mysql --loose-no-such-option
mysql: WARNING: unknown option '--loose-no-such-option'
```

O prefixo `--loose` pode ser útil quando você executa programas a partir de várias instalações do MySQL na mesma máquina e lista opções em um arquivo de opções. Uma opção que pode não ser reconhecida por todas as versões de um programa pode ser dada usando o prefixo `--loose` (ou `loose` em um arquivo de opções). As versões do programa que reconhecem a opção processam normalmente, e as versões que não a reconhecem emitem um aviso e a ignoram.

O prefixo `--maximum` está disponível apenas para o **mysqld** e permite que um limite seja estabelecido sobre o tamanho que os programas de cliente podem definir as variáveis do sistema de sessão. Para fazer isso, use um prefixo `--maximum` com o nome da variável. Por exemplo, `--maximum-max_heap_table_size=32M` impede que qualquer cliente aumente o limite do tamanho da tabela do heap para mais de 32 M.

O prefixo `--maximum` é destinado ao uso com variáveis de sistema que possuem um valor de sessão. Se aplicado a uma variável de sistema que possui apenas um valor global, ocorre um erro. Por exemplo, com `--maximum-back_log=200`, o servidor produz este erro:

```
Maximum value of 'back_log' cannot be set
```

#### 6.2.2.5 Usando opções para definir variáveis de programa

Muitos programas do MySQL têm variáveis internas que podem ser definidas em tempo de execução usando a instrução `SET`. Veja a Seção 15.7.6.1, “Sintaxe de definição de variáveis”, e a Seção 7.1.9, “Usando variáveis do sistema”.

A maioria dessas variáveis de programa também pode ser definida na inicialização do servidor usando a mesma sintaxe que se aplica à especificação de opções de programa. Por exemplo, o **mysql** tem uma variável `max_allowed_packet` que controla o tamanho máximo do seu buffer de comunicação. Para definir a variável `max_allowed_packet` para o **mysql** em um valor de 16 MB, use um dos seguintes comandos:

```
mysql --max_allowed_packet=16777216
mysql --max_allowed_packet=16M
```

O primeiro comando especifica o valor em bytes. O segundo especifica o valor em megabytes. Para variáveis que aceitam um valor numérico, o valor pode ser dado com um sufixo de `K`, `M` ou `G` para indicar um multiplicador de 1024, 10242 ou

10243. (Por exemplo, quando usado para definir `max_allowed_packet`, os sufixos indicam unidades de kilobytes, megabytes ou gigabytes). A partir do MySQL 8.0.14, um sufixo também pode ser `T`, `P` e `E` para indicar um multiplicador de 10244, 10245 ou

10246. As letras do sufixo podem ser maiúsculas ou minúsculas.

Em um arquivo de opção, as configurações variáveis são fornecidas sem as barras de travessão no início:

```
[mysql]
max_allowed_packet=16777216
```

Ou:

```
[mysql]
max_allowed_packet=16M
```

Se desejar, os sublinhados em um nome de opção podem ser especificados como traços. Os seguintes grupos de opções são equivalentes. Ambos definem o tamanho do buffer de chave do servidor para 512 MB:

```
[mysqld]
key_buffer_size=512M

[mysqld]
key-buffer-size=512M
```

Sufixos para especificar um multiplicador de valor podem ser usados ao definir uma variável no momento da invocação do programa, mas não para definir o valor com `SET` no tempo de execução. Por outro lado, com `SET`, você pode atribuir o valor de uma variável usando uma expressão, o que não é verdade quando você define uma variável na inicialização do servidor. Por exemplo, a primeira das linhas a seguir é legal no momento da invocação do programa, mas a segunda não é:

```
$> mysql --max_allowed_packet=16M
$> mysql --max_allowed_packet=16*1024*1024
```

Por outro lado, a segunda das linhas a seguir é legal durante a execução, mas a primeira não é:

```
mysql> SET GLOBAL max_allowed_packet=16M;
mysql> SET GLOBAL max_allowed_packet=16*1024*1024;
```

#### 6.2.2.6 Opções Padrão, Opções com Valores Esperados e o Sinal de Igual (=)

Por convenção, as longas formas de opções que atribuem um valor são escritas com um sinal de igual (`=`), assim:

```
mysql --host=tonfisk --user=jon
```

Para opções que exigem um valor (ou seja, que não têm um valor padrão), o sinal de igual não é necessário, e, portanto, o seguinte também é válido:

```
mysql --host tonfisk --user jon
```

Em ambos os casos, o cliente **mysql** tenta se conectar a um servidor MySQL que está em execução no host chamado “tonfisk”, usando uma conta com o nome de usuário “jon”.

Devido a esse comportamento, problemas podem ocasionalmente surgir quando não é fornecido valor para uma opção que espera um. Considere o exemplo a seguir, onde um usuário se conecta a um servidor MySQL que está em execução no host `tonfisk` como usuário `jon`:

```
$> mysql --host 85.224.35.45 --user jon
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 3
Server version: 8.0.44 Source distribution

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql> SELECT CURRENT_USER();
+----------------+
| CURRENT_USER() |
+----------------+
| jon@%          |
+----------------+
1 row in set (0.00 sec)
```

Omitir o valor necessário para uma dessas opções gera um erro, como o mostrado aqui:

```
$> mysql --host 85.224.35.45 --user
mysql: option '--user' requires an argument
```

Neste caso, o **mysql** não conseguiu encontrar um valor após a opção `--user`, porque nada veio após ela na linha de comando. No entanto, se você omitir o valor para uma opção que *não* é a última opção a ser usada, você obterá um erro diferente que você pode não estar esperando:

```
$> mysql --host --user jon
ERROR 2005 (HY000): Unknown MySQL server host '--user' (1)
```

Porque o **mysql** assume que qualquer string que siga `--host` na linha de comando é um nome de host, `--host` `--user` é interpretado como `--host=--user`, e o cliente tenta se conectar a um servidor MySQL que está em execução em um host chamado “--user”.

As opções com valores padrão sempre exigem um sinal de igual ao atribuir um valor; não fazer isso causa um erro. Por exemplo, a opção do servidor MySQL `--log-error` tem o valor padrão `host_name.err`, onde *`host_name`* é o nome do host no qual o MySQL está sendo executado. Suponha que você esteja executando o MySQL em um computador cujo nome de host é “tonfisk”, e considere a seguinte invocação do **mysqld_safe**:

```
$> mysqld_safe &
[1] 11699
$> 080112 12:53:40 mysqld_safe Logging to '/usr/local/mysql/var/tonfisk.err'.
080112 12:53:40 mysqld_safe Starting mysqld daemon with databases from /usr/local/mysql/var
$>
```

Após desligar o servidor, reinicie-o da seguinte forma:

```
$> mysqld_safe --log-error &
[1] 11699
$> 080112 12:53:40 mysqld_safe Logging to '/usr/local/mysql/var/tonfisk.err'.
080112 12:53:40 mysqld_safe Starting mysqld daemon with databases from /usr/local/mysql/var
$>
```

O resultado é o mesmo, uma vez que `--log-error` não é seguido por nada mais na linha de comando, e fornece seu próprio valor padrão. (O caractere `&` informa ao sistema operacional que o MySQL deve ser executado em segundo plano; ele é ignorado pelo próprio MySQL.) Agora, suponha que você queira registrar erros em um arquivo chamado `my-errors.err`. Você pode tentar iniciar o servidor com `--log-error my-errors`, mas isso não tem o efeito desejado, como mostrado aqui:

```
$> mysqld_safe --log-error my-errors &
[1] 31357
$> 080111 22:53:31 mysqld_safe Logging to '/usr/local/mysql/var/tonfisk.err'.
080111 22:53:32 mysqld_safe Starting mysqld daemon with databases from /usr/local/mysql/var
080111 22:53:34 mysqld_safe mysqld from pid file /usr/local/mysql/var/tonfisk.pid ended

[1]+  Done                    ./mysqld_safe --log-error my-errors
```

O servidor tentou começar a usar `/usr/local/mysql/var/tonfisk.err` como o log de erro, mas depois desligou. Examinando as últimas linhas desse arquivo, é possível ver a razão:

```
$> tail /usr/local/mysql/var/tonfisk.err
2013-09-24T15:36:22.278034Z 0 [ERROR] Too many arguments (first extra is 'my-errors').
2013-09-24T15:36:22.278059Z 0 [Note] Use --verbose --help to get a list of available options!
2013-09-24T15:36:22.278076Z 0 [ERROR] Aborting
2013-09-24T15:36:22.279704Z 0 [Note] InnoDB: Starting shutdown...
2013-09-24T15:36:23.777471Z 0 [Note] InnoDB: Shutdown completed; log sequence number 2319086
2013-09-24T15:36:23.780134Z 0 [Note] mysqld: Shutdown complete
```

Como a opção `--log-error` fornece um valor padrão, você deve usar um sinal de igual para atribuir um valor diferente a ela, como mostrado aqui:

```
$> mysqld_safe --log-error=my-errors &
[1] 31437
$> 080111 22:54:15 mysqld_safe Logging to '/usr/local/mysql/var/my-errors.err'.
080111 22:54:15 mysqld_safe Starting mysqld daemon with databases from /usr/local/mysql/var

$>
```

Agora, o servidor foi iniciado com sucesso e está registrando erros no arquivo `/usr/local/mysql/var/my-errors.err`.

Problemas semelhantes podem surgir ao especificar valores de opção em arquivos de opção. Por exemplo, considere um arquivo `my.cnf` que contém o seguinte:

```
[mysql]

host
user
```

Quando o cliente **mysql** lê este arquivo, essas entradas são analisadas como `--host` `--user` ou `--host=--user`, com o resultado mostrado aqui:

```
$> mysql
ERROR 2005 (HY000): Unknown MySQL server host '--user' (1)
```

No entanto, em arquivos de opção, um sinal de igual não é assumido. Suponha que o arquivo `my.cnf` esteja conforme mostrado aqui:

```
[mysql]

user jon
```

Tentar iniciar o **mysql** neste caso causa um erro diferente:

```
$> mysql
mysql: unknown option '--user jon'
```

Um erro semelhante ocorreria se você escrevesse `host tonfisk` no arquivo de opções em vez de `host=tonfisk`. Em vez disso, você deve usar o sinal de igual:

```
[mysql]

user=jon
```

Agora, a tentativa de login é bem-sucedida:

```
$> mysql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 5
Server version: 8.0.44 Source distribution

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql> SELECT USER();
+---------------+
| USER()        |
+---------------+
| jon@localhost |
+---------------+
1 row in set (0.00 sec)
```

Isso não é o mesmo comportamento que com a linha de comando, onde o sinal de igual não é necessário:

```
$> mysql --user jon --host tonfisk
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 6
Server version: 8.0.44 Source distribution

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql> SELECT USER();
+---------------+
| USER()        |
+---------------+
| jon@tonfisk   |
+---------------+
1 row in set (0.00 sec)
```

Especificar uma opção que exige um valor sem um valor em um arquivo de opções faz com que o servidor abordite com um erro.

### 6.2.3 Opções de comando para conectar ao servidor

Esta seção descreve as opções suportadas pela maioria dos programas clientes do MySQL que controlam como os programas clientes estabelecem conexões com o servidor, se as conexões são criptografadas e se as conexões são comprimidas. Essas opções podem ser fornecidas na linha de comando ou em um arquivo de opção.

* Opções de comando para estabelecimento de conexão
* Opções de comando para conexões criptografadas
* Opções de comando para compressão de conexão

#### Opções de comando para estabelecimento de conexão

Esta seção descreve as opções que controlam a forma como os programas do cliente estabelecem conexões com o servidor. Para informações adicionais e exemplos que mostram como usá-las, consulte a Seção 6.2.4, “Conectando-se ao servidor MySQL usando opções de comando”.

**Tabela 6.4 Resumo da Opção de Estabelecimento de Conexão**

<table frame="box" rules="all" summary="Command-line options available for establishing connections to the server."><col style="width: 31%"/><col style="width: 56%"/><col style="width: 12%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> </tr></thead><tbody><tr><th scope="row">--default-auth</th> <td>Plugin de autenticação a ser utilizado</td> <td></td> </tr><tr><th scope="row">--host</th> <td>Anfitrião no qual o servidor MySQL está localizado</td> <td></td> </tr><tr><th scope="row">--password</th> <td>Senha para usar ao se conectar ao servidor</td> <td></td> </tr><tr><th scope="row">--password1</th> <td>Primeira senha de autenticação multifatorial a usar ao se conectar ao servidor</td> <td>8.0.27</td> </tr><tr><th scope="row">--password2</th> <td>Segunda senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> </tr><tr><th scope="row">--password3</th> <td>Terceira senha de autenticação multifatorial a ser usada ao se conectar ao servidor</td> <td>8.0.27</td> </tr><tr><th scope="row">--pipe</th> <td>Conecte-se ao servidor usando um tubo nomeado (apenas Windows)</td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Diretório onde os plugins são instalados</td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Protocolo de transporte a ser utilizado</td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Arquivo de socket Unix ou tubo nomeado do Windows a ser usado</td> <td></td> </tr><tr><th scope="row">--user</th> <td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td> <td></td> </tr></tbody></table>

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 8.2.17, “Autenticação substituível”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>

O host em que o servidor MySQL está sendo executado. O valor pode ser um nome de host, endereço IPv4 ou endereço IPv6. O valor padrão é `localhost`.

* `--password[=pass_val]`, `-p[pass_val]`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o programa de cliente solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se não for especificado nenhum tipo de senha, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o programa de cliente não deve solicitar uma senha, use a opção `--skip-password`.

* `--password1[=pass_val]`

  <table frame="box" rules="all" summary="Properties for password1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password1[=password]</code></td> </tr><tr><th>Introduced</th> <td>8.0.27</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

A senha para o fator de autenticação multifatorial 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o programa de cliente solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--password1=` e a senha que a segue. Se não for especificada nenhuma opção de senha, o padrão é não enviar senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o programa de cliente não deve solicitar uma senha, use a opção `--skip-password1`.

`--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.

* `--password2[=pass_val]`

  <table frame="box" rules="all" summary="Properties for password2"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password2[=password]</code></td> </tr><tr><th>Introduced</th> <td>8.0.27</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

A senha para o fator de autenticação multifatorial 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para obter detalhes.

* `--password3[=pass_val]`

  <table frame="box" rules="all" summary="Properties for password3"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password3[=password]</code></td> </tr><tr><th>Introduced</th> <td>8.0.27</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

A senha para o fator de autenticação multifatorial 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica para `--password1`; consulte a descrição dessa opção para detalhes.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for pipe"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--pipe</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Em Windows, conecte-se ao servidor usando um tubo nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for plugin-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--plugin-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o programa cliente não o encontrar. Veja a Seção 8.2.17, “Autenticação Conectada”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for port"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--port=port_num</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>3306</code></td> </tr></tbody></table>

Para conexões TCP/IP, o número de porta a ser usado. O número de porta padrão é 3306.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

Esta opção especifica explicitamente qual protocolo de transporte usar para se conectar ao servidor. É útil quando outros parâmetros de conexão normalmente resultam no uso de outro protocolo que não o desejado. Por exemplo, as conexões em Unix para `localhost` são feitas usando um arquivo de socket Unix por padrão:

  ```
  mysql --host=localhost
  ```

Para forçar o uso do transporte TCP/IP em vez disso, especifique uma opção `--protocol`:

  ```
  mysql --host=localhost --protocol=TCP
  ```

A tabela a seguir mostra os valores permitidos para a opção `--protocol` e indica as plataformas aplicáveis para cada valor. Os valores não são sensíveis ao caso.

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

Veja também a Seção 6.2.7, “Protocolos de Transporte de Conexão”

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

Em Unix, o nome do arquivo de soquete Unix a ser usado para conexões feitas usando um tubo nomeado para um servidor local. O nome padrão do arquivo de soquete Unix é `/tmp/mysql.sock`.

Em Windows, o nome do tubo nomeado a ser usado para conexões a um servidor local. O nome padrão do tubo do Windows é `MySQL`. O nome do tubo não é sensível ao caso.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

O nome de usuário da conta MySQL a ser usado para se conectar ao servidor. O nome de usuário padrão é `ODBC` no Windows ou o nome de login do Unix no Unix.

#### Opções de comando para conexões criptografadas

Esta seção descreve as opções para programas de cliente que especificam se devem usar conexões criptografadas com o servidor, os nomes dos arquivos de certificado e chave, e outros parâmetros relacionados ao suporte de conexão criptografada. Para exemplos de uso sugerido e como verificar se uma conexão é criptografada, consulte a Seção 8.3.1, “Configurando o MySQL para usar Conexões Criptografadas”.

Nota

Essas opções têm efeito apenas para conexões que utilizam um protocolo de transporte sujeito a criptografia; ou seja, conexões TCP/IP e conexões de arquivo Unix. Veja a Seção 6.2.7, “Protocolos de Transporte de Conexão”

Para obter informações sobre o uso de conexões criptografadas da API C do MySQL, consulte Suporte para Conexões Criptografadas.

**Tabela 6.5 Resumo da opção de criptografia de conexão**

<table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

Peça ao servidor a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Alterável SHA-2”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

O nome do caminho de um arquivo em formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Esta opção está disponível apenas se o MySQL foi construído usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação substituível SHA-256”, e a Seção 8.4.1.2, “Cache de autenticação substituível SHA-2”.

* `--ssl-ca=file_name`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA) no formato PEM. O arquivo contém uma lista de Autoridades de Certificação SSL confiáveis.

Para informar ao cliente que não autentique o certificado do servidor ao estabelecer uma conexão criptografada com o servidor, não especifique nem `--ssl-ca` nem `--ssl-capath`. O servidor ainda verifica o cliente de acordo com quaisquer requisitos aplicáveis estabelecidos para a conta do cliente e ainda usa quaisquer valores das variáveis de sistema `ssl_ca` ou `ssl_capath` especificados no lado do servidor.

Para especificar o arquivo CA para o servidor, defina a variável de sistema `ssl_ca`.

* `--ssl-capath=dir_name`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

O nome do caminho do diretório que contém os arquivos de autoridade de certificação SSL (CA) de confiança em formato PEM.

Para informar ao cliente que não autentique o certificado do servidor ao estabelecer uma conexão criptografada com o servidor, não especifique nem `--ssl-ca` nem `--ssl-capath`. O servidor ainda verifica o cliente de acordo com quaisquer requisitos aplicáveis estabelecidos para a conta do cliente e ainda usa quaisquer valores das variáveis de sistema `ssl_ca` ou `ssl_capath` especificados no lado do servidor.

Para especificar o diretório CA do servidor, defina a variável de sistema `ssl_capath`.

* `--ssl-cert=file_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>0

O nome do caminho do arquivo de certificado público da chave SSL do cliente no formato PEM.

Para especificar o arquivo de certificado da chave pública SSL do servidor, defina a variável de sistema `ssl_cert`.

Nota

O suporte para certificados SSL encadeados foi adicionado na versão 8.0.30; anteriormente, apenas o primeiro certificado era lido.

* `--ssl-cipher=cipher_list`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>1

A lista de cifra de criptografia permitida para conexões que utilizam protocolos TLS até o TLSv1.2. Se nenhuma cifra na lista for suportada, as conexões criptografadas que utilizam esses protocolos TLS não funcionam.

Para maior portabilidade, *`cipher_list`* deve ser uma lista de um ou mais nomes de cifra, separados por colchetes. Exemplos:

  ```
  --ssl-cipher=AES128-SHA
  --ssl-cipher=DHE-RSA-AES128-GCM-SHA256:AES128-SHA
  ```

O OpenSSL suporta a sintaxe para especificar cifras descritas na documentação do OpenSSL em <https://www.openssl.org/docs/manmaster/man1/ciphers.html>.

Para obter informações sobre os cifradores de criptografia que o MySQL suporta, consulte a Seção 8.3.2, “Protocolos e cifradores de conexão criptografada TLS”.

Para especificar os cifradores de criptografia para o servidor, defina a variável de sistema `ssl_cipher`.

* `--ssl-crl=file_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>2

O nome do caminho do arquivo que contém listas de revogação de certificados no formato PEM.

Se nem o `--ssl-crl` nem o `--ssl-crlpath` for fornecido, não serão realizadas verificações de CRL, mesmo que o caminho CA contenha listas de revogação de certificados.

Para especificar o arquivo da lista de revogação para o servidor, defina a variável de sistema `ssl_crl`.

* `--ssl-crlpath=dir_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>3

O nome do caminho do diretório que contém arquivos de lista de revogação de certificados em formato PEM.

Se nem o `--ssl-crl` nem o `--ssl-crlpath` for fornecido, não serão realizadas verificações de CRL, mesmo que o caminho CA contenha listas de revogação de certificados.

Para especificar o diretório da lista de revogação para o servidor, defina a variável de sistema `ssl_crlpath`.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>4

Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para determinar quais operações criptográficas devem ser permitidas. Veja a Seção 8.8, “Suporte FIPS”.

Esses valores `--ssl-fips-mode` são permitidos:

+ `OFF`: Desabilitar o modo FIPS.  
  + `ON`: Habilitar o modo FIPS.  
  + `STRICT`: Habilitar o modo FIPS "strict".

Nota

Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Neste caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza um aviso na inicialização e opere no modo não FIPS.

Para especificar o modo FIPS para o servidor, defina a variável de sistema `ssl_fips_mode`.

* `--ssl-key=file_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>5

O nome do caminho do arquivo de chave privada SSL do cliente no formato PEM. Para maior segurança, use um certificado com um tamanho de chave RSA de pelo menos 2048 bits.

Se o arquivo de chave estiver protegido por uma senha, o programa de cliente solicitará ao usuário a senha. A senha deve ser fornecida interativamente; não pode ser armazenada em um arquivo. Se a senha estiver incorreta, o programa continuará como se não pudesse ler a chave.

Para especificar o arquivo de chave privada SSL do servidor, defina a variável de sistema `ssl_key`.

* `--ssl-mode=mode`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>6

Esta opção especifica o estado de segurança desejado da conexão com o servidor. Esses valores de modo são permitidos, em ordem de estríção crescente:

+ `DISABLED`: Estabeleça uma conexão não criptografada.

+ `PREFERRED`: Estabeleça uma conexão criptografada se o servidor suportar conexões criptografadas, revertendo para uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Este é o padrão se `--ssl-mode` não for especificado.

As conexões através de arquivos de socket Unix não são criptografadas com um modo de `PREFERRED`. Para impor a criptografia para conexões de arquivo de socket Unix, use um modo de `REQUIRED` ou mais rigoroso. (No entanto, o transporte de arquivo de socket é seguro por padrão, portanto, criptografar uma conexão de arquivo de socket não a torna mais segura e aumenta a carga da CPU.)

+ `REQUIRED`: Estabeleça uma conexão criptografada se o servidor suportar conexões criptografadas. A tentativa de conexão falha se uma conexão criptografada não puder ser estabelecida.

+ `VERIFY_CA`: Como `REQUIRED`, mas, adicionalmente, verifique o certificado da Autoridade de Certificação (CA) do servidor contra os certificados CA configurados. A tentativa de conexão falha se não forem encontrados certificados CA válidos que correspondam.

+ `VERIFY_IDENTITY`: Como `VERIFY_CA`, mas, adicionalmente, realize a verificação da identidade do nome do host, verificando o nome do host que o cliente usa para se conectar ao servidor contra a identidade no certificado que o servidor envia ao cliente:

- A partir do MySQL 8.0.12, se o cliente usa o OpenSSL 1.0.2 ou superior, o cliente verifica se o nome de host que ele usa para se conectar corresponde ao valor da NOME ALTERNATIVO DO OBJETO ou ao valor do NOME COMUM no certificado do servidor. A verificação da identidade do nome de host também funciona com certificados que especificam o NOME COMUM usando caracteres de ponto e vírgula.

- Caso contrário, o cliente verifica se o nome de host que ele usa para se conectar corresponde ao valor do Nome comum no certificado do servidor.

A conexão falha se houver uma incompatibilidade. Para conexões criptografadas, essa opção ajuda a prevenir ataques de homem no meio.

Nota

A verificação de identidade do nome do host com `VERIFY_IDENTITY` não funciona com certificados autoassinados que são criados automaticamente pelo servidor ou manualmente usando **mysql_ssl_rsa_setup** (consulte Seção 8.3.3.1, “Criando certificados e chaves SSL e RSA usando MySQL”). Esses certificados autoassinados não contêm o nome do servidor como valor de Nome Comum.

Importante

A configuração padrão, `--ssl-mode=PREFERRED`, produz uma conexão criptografada se os outros ajustes padrão não forem alterados. No entanto, para ajudar a prevenir ataques sofisticados de homem no meio, é importante que o cliente verifique a identidade do servidor. As configurações `--ssl-mode=VERIFY_CA` e `--ssl-mode=VERIFY_IDENTITY` são uma escolha melhor do que a configuração padrão para ajudar a prevenir esse tipo de ataque. Para implementar uma dessas configurações, você deve primeiro garantir que o certificado CA do servidor esteja disponível de forma confiável para todos os clientes que o utilizam em seu ambiente, caso contrário, problemas de disponibilidade resultarão. Por essa razão, elas não são a configuração padrão.

A opção `--ssl-mode` interage com as opções de certificado CA da seguinte forma:

+ Se `--ssl-mode` não for explicitamente definido de outra forma, o uso de `--ssl-ca` ou `--ssl-capath` implica em `--ssl-mode=VERIFY_CA`.

Para os valores de `--ssl-mode` de `VERIFY_CA` ou `VERIFY_IDENTITY`, também é necessário `--ssl-ca` ou `--ssl-capath`, para fornecer um certificado CA que corresponda ao utilizado pelo servidor.

+ Uma opção explícita `--ssl-mode` com um valor diferente de `VERIFY_CA` ou `VERIFY_IDENTITY`, juntamente com uma opção explícita `--ssl-ca` ou `--ssl-capath`, produz um aviso de que não é realizada nenhuma verificação do certificado do servidor, apesar de uma opção de certificado CA ser especificada.

Para exigir o uso de conexões criptografadas por uma conta MySQL, use `CREATE USER` para criar a conta com uma cláusula `REQUIRE SSL`, ou use `ALTER USER` para uma conta existente para adicionar uma cláusula [[`REQUIRE SSL`]. Isso faz com que as tentativas de conexão por clientes que usam a conta sejam rejeitadas, a menos que o MySQL suporte conexões criptografadas e uma conexão criptografada possa ser estabelecida.

A cláusula `REQUIRE` permite outras opções relacionadas à criptografia, que podem ser usadas para impor requisitos de segurança mais rigorosos do que `REQUIRE SSL`. Para obter informações adicionais sobre quais opções de comando podem ou devem ser especificadas por clientes que se conectam usando contas configuradas usando as várias opções `REQUIRE`, consulte Opções de SSL/TLS para CRIAR USUÁRIO.

* `--ssl-session-data=file_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>7

O nome do caminho do arquivo de dados da sessão SSL do cliente em formato PEM para reutilização da sessão.

Quando você invoca um programa cliente MySQL com a opção `--ssl-session-data`, o cliente tenta deserializar os dados da sessão do arquivo, se fornecido, e então usá-los para estabelecer uma nova conexão. Se você fornecer um arquivo, mas a sessão não for reutilizada, então a conexão falha, a menos que você também tenha especificado a opção `--ssl-session-data-continue-on-failed-reuse` na linha de comando quando você invocou o programa cliente.

O comando **mysql**, `ssl_session_data_print`, gera o arquivo de dados da sessão (consulte a Seção 6.5.1.2, “Comandos do cliente mysql”).

* `ssl-session-data-continue-on-failed-reuse`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>8

Controla se uma nova conexão é iniciada para substituir uma conexão que tentou, mas não conseguiu reutilizar os dados de sessão especificados com a opção de linha de comando `--ssl-session-data`. Por padrão, a opção de linha de comando `--ssl-session-data-continue-on-failed-reuse` está desativada, o que faz com que um programa cliente retorne um erro de conexão quando os dados de sessão são fornecidos e não reutilizados.

Para garantir que uma nova conexão não relacionada se abra após a reutilização da sessão falhar silenciosamente, invoque os programas do cliente MySQL com as opções de linha de comando `--ssl-session-data` e `--ssl-session-data-continue-on-failed-reuse`.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>9

Esta opção especifica quais conjuntos de cifras o cliente permite para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de zero ou mais nomes de conjuntos de cifras separados por vírgula. Por exemplo:

  ```
  mysql --tls-ciphersuites="suite1:suite2:suite3"
  ```

As suítes de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Se esta opção não for definida, o cliente permite o conjunto padrão de suítes de cifra. Se a opção for definida como uma string vazia, nenhuma suítes de cifra é habilitada e conexões criptografadas não podem ser estabelecidas. Para mais informações, consulte a Seção 8.3.2, “Protocolos e cifras de conexão criptografada TLS”.

Essa opção foi adicionada no MySQL 8.0.16.

Para especificar quais conjuntos de cifra o servidor permite, defina a variável de sistema `tls_ciphersuites`.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

Esta opção especifica os protocolos TLS que o cliente permite para conexões criptografadas. O valor é uma lista de uma ou mais versões de protocolo separadas por vírgula. Por exemplo:

  ```
  mysql --tls-version="TLSv1.2,TLSv1.3"
  ```

Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL utilizada para compilar o MySQL e da versão do MySQL Server.

Importante

+ O suporte aos protocolos de conexão TLSv1 e TLSv1.1 é removido do MySQL Server a partir do MySQL 8.0.28. Os protocolos foram descontinuados a partir do MySQL 8.0.26, embora os clientes do MySQL Server não retornem avisos ao usuário se uma versão descontinuada do protocolo TLS for usada. A partir do MySQL 8.0.28, clientes, incluindo o MySQL Shell, que suportam a opção `--tls-version`, não podem fazer uma conexão TLS/SSL com o protocolo definido como TLSv1 ou TLSv1.1. Se um cliente tentar se conectar usando esses protocolos, para conexões TCP, a conexão falha e um erro é retornado ao cliente. Para conexões de soquete, se `--ssl-mode` estiver definido como `REQUIRED`, a conexão falha, caso contrário, a conexão é feita, mas com TLS/SSL desativado. Consulte a Remoção do Suporte aos Protocolos TLSv1 e TLSv1.1 para obter mais informações.

+ O suporte ao protocolo TLSv1.3 está disponível no MySQL Server a partir do MySQL 8.0.16, desde que o MySQL Server tenha sido compilado usando OpenSSL 1.1.1 ou superior. O servidor verifica a versão do OpenSSL no início e, se for inferior a 1.1.1, o TLSv1.3 é removido do valor padrão para as variáveis do sistema relacionadas à versão TLS (como a variável `tls_version`).

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

Para obter mais informações, consulte a Seção 8.3.2, “Protocolos e cifras de conexão criptografada TLS”.

Para especificar quais protocolos TLS o servidor permite, defina a variável de sistema `tls_version`.

#### Opções de comando para compressão de conexão

Esta seção descreve as opções que permitem aos programas de cliente controlar o uso da compressão para conexões ao servidor. Para informações adicionais e exemplos que mostram como usá-las, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

**Tabela 6.6 Resumo da opção de compressão de conexão**

<table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

Compressa todas as informações enviadas entre o cliente e o servidor, se possível.

A partir do MySQL 8.0.18, essa opção é desatualizada. A espera é que ela seja removida em uma versão futura do MySQL. Veja Configurando Compressão de Conexão Legada.

* `--compression-algorithms=value`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

Os algoritmos de compressão permitidos para conexões ao servidor. Os algoritmos disponíveis são os mesmos que para a variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.

Essa opção foi adicionada no MySQL 8.0.18.

* `--zstd-compression-level=level`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

O nível de compressão a ser usado para conexões ao servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis de compressão crescentes. O nível de compressão padrão `zstd` é 3. O ajuste do nível de compressão não afeta as conexões que não utilizam compressão `zstd`.

Essa opção foi adicionada no MySQL 8.0.18.

### 6.2.4 Conectando ao servidor MySQL usando opções de comando

Esta seção descreve o uso de opções de linha de comando para especificar como estabelecer conexões ao servidor MySQL, para clientes como **mysql** ou **mysqldump**. Para informações sobre estabelecer conexões usando strings de conexão semelhantes a URI ou pares chave-valor, para clientes como MySQL Shell, consulte a Seção 6.2.5, “Conectando ao servidor usando strings semelhantes a URI ou pares chave-valor”. Para informações adicionais se você não conseguir se conectar, consulte a Seção 8.2.22, “Resolvendo problemas de conexão com o MySQL”.

Para que um programa de cliente se conecte ao servidor MySQL, ele deve usar os parâmetros de conexão adequados, como o nome do host onde o servidor está sendo executado e o nome de usuário e senha da sua conta MySQL. Cada parâmetro de conexão tem um valor padrão, mas você pode substituir os valores padrão conforme necessário, usando opções de programa especificadas na linha de comando ou em um arquivo de opção.

Os exemplos aqui usam o programa cliente **mysql**, mas os princípios se aplicam a outros clientes, como **mysqldump**, **mysqladmin** ou **mysqlshow**.

Este comando invoca o **mysql** sem especificar quaisquer parâmetros de conexão explícitos:

```
mysql
```

Como não há opções de parâmetros, os valores padrão se aplicam:

* O nome de host padrão é `localhost`. Em Unix, isso tem um significado especial, conforme descrito mais adiante.

* O nome de usuário padrão é `ODBC` no Windows ou o nome de login do Unix no Unix.

* Não é enviada senha porque nem `--password` nem `-p` foi fornecida.

* Para **mysql**, o primeiro argumento não opcional é considerado o nome do banco de dados padrão. Como não há tal argumento, **mysql** não seleciona nenhum banco de dados padrão.

Para especificar o nome do host e o nome do usuário explicitamente, bem como uma senha, forneça opções apropriadas na linha de comando. Para selecionar um banco de dados padrão, adicione um argumento de nome de banco de dados. Exemplos:

```
mysql --host=localhost --user=myname --password=password mydb
mysql -h localhost -u myname -ppassword mydb
```

Para as opções de senha, o valor da senha é opcional:

* Se você usar a opção `--password` ou `-p` e especificar um valor de senha, não deve haver *espaço* entre `--password=` ou `-p` e a senha que o segue.

* Se você usar `--password` ou `-p`, mas não especificar um valor de senha, o programa do cliente solicitará que você insira a senha. A senha não será exibida enquanto você a digita. Isso é mais seguro do que fornecer a senha na linha de comando, o que pode permitir que outros usuários em seu sistema vejam a linha de senha ao executar um comando como **ps**. Veja a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.

* Para especificar explicitamente que não há senha e que o programa de cliente não deve solicitar uma senha, use a opção `--skip-password`.

Como mencionado anteriormente, incluir o valor da senha na linha de comando é um risco de segurança. Para evitar esse risco, especifique a opção `--password` ou `-p` sem qualquer valor de senha subsequente:

```
mysql --host=localhost --user=myname --password mydb
mysql -h localhost -u myname -p mydb
```

Quando a opção `--password` ou `-p` é dada sem um valor de senha, o programa de cliente exibe uma solicitação e espera que você insira a senha. (Nesses exemplos, `mydb` *não* é interpretado como uma senha porque é separado da opção de senha anterior por um espaço.)

Em alguns sistemas, a rotina da biblioteca que o MySQL usa para solicitar uma senha limita automaticamente a senha a oito caracteres. Essa limitação é uma propriedade da biblioteca do sistema, não do MySQL. Internamente, o MySQL não tem nenhum limite para o comprimento da senha. Para contornar a limitação em sistemas afetados por ela, especifique sua senha em um arquivo de opção (consulte Seção 6.2.2.2, “Usando Arquivos de Opção”). Outra solução é alterar sua senha MySQL para um valor que tenha oito ou menos caracteres, mas isso tem a desvantagem de que senhas mais curtas tendem a ser menos seguras.

Os programas do cliente determinam o tipo de conexão a ser feita da seguinte forma:

* Se o host não for especificado ou for `localhost`, ocorre uma conexão com o host local:

+ Em Windows, o cliente se conecta usando memória compartilhada, se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

+ Em Unix, os programas do MySQL tratam o nome do host `localhost` de maneira especial, de uma forma que provavelmente é diferente do que você espera em comparação com outros programas baseados em rede: o cliente se conecta usando um arquivo de soquete Unix. A opção `--socket` ou a variável de ambiente `MYSQL_UNIX_PORT` pode ser usada para especificar o nome do soquete.

* Em Windows, se `host` for `.` (período), ou se o TCP/IP não estiver habilitado e `--socket` não for especificado ou o host estiver vazio, o cliente se conecta usando um tubo nomeado, se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Se as conexões por tubo nomeado não forem suportadas ou se o usuário que está fazendo a conexão não for membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`, ocorrerá um erro.

* Caso contrário, a conexão usa TCP/IP.

A opção `--protocol` permite que você use um protocolo de transporte específico, mesmo quando outras opções normalmente resultam no uso de um protocolo diferente. Isso significa que `--protocol` especifica o protocolo de transporte explicitamente e substitui as regras anteriores, mesmo para `localhost`.

Apenas as opções de conexão que são relevantes para o protocolo de transporte selecionado são usadas ou verificadas. Outras opções de conexão são ignoradas. Por exemplo, com `--host=localhost` em Unix, o cliente tenta se conectar ao servidor local usando um arquivo de socket Unix, mesmo que uma opção `--port` ou `-P` seja dada para especificar um número de porta TCP/IP.

Para garantir que o cliente faça uma conexão TCP/IP com o servidor local, use `--host` ou `-h` para especificar um valor de nome de host de `127.0.0.1` (em vez de `localhost`), ou o endereço IP ou o nome do servidor local. Você também pode especificar explicitamente o protocolo de transporte, mesmo para `localhost`, usando a opção `--protocol=TCP`. Exemplos:

```
mysql --host=127.0.0.1
mysql --protocol=TCP
```

Se o servidor estiver configurado para aceitar conexões IPv6, os clientes podem se conectar ao servidor local através do IPv6 usando `--host=::1`. Veja a Seção 7.1.13, “Suporte IPv6”.

Em Windows, para forçar um cliente MySQL a usar uma conexão de canal nomeado, especifique a opção `--pipe` ou `--protocol=PIPE`, ou especifique `.` (período) como o nome do host. Se o servidor não foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado ou se o usuário que está fazendo a conexão não é membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`, ocorre um erro. Use a opção `--socket` para especificar o nome do canal se você não quiser usar o nome de canal padrão.

As conexões com servidores remotos utilizam TCP/IP. Este comando conecta-se ao servidor que está em execução no `remote.example.com` usando o número de porta padrão (3306):

```
mysql --host=remote.example.com
```

Para especificar um número de porta explicitamente, use a opção `--port` ou `-P`:

```
mysql --host=remote.example.com --port=13306
```

Você também pode especificar um número de porta para conexões a um servidor local. No entanto, conforme indicado anteriormente, as conexões ao `localhost` em Unix usam um arquivo de soquete por padrão, portanto, a menos que você force uma conexão TCP/IP como descrito anteriormente, qualquer opção que especifique um número de porta será ignorada.

Para este comando, o programa utiliza um arquivo de soquete no Unix e a opção `--port` é ignorada:

```
mysql --port=13306 --host=localhost
```

Para fazer com que o número do porto seja usado, force uma conexão TCP/IP. Por exemplo, invoque o programa de alguma das seguintes maneiras:

```
mysql --port=13306 --host=127.0.0.1
mysql --port=13306 --protocol=TCP
```

Para obter informações adicionais sobre as opções que controlam a forma como os programas do cliente estabelecem conexões com o servidor, consulte a Seção 6.2.3, “Opções de comando para conectar-se ao servidor”.

É possível especificar os parâmetros de conexão sem inseri-los na linha de comando cada vez que você invoca um programa cliente:

* Especifique os parâmetros de conexão na seção `[client]` de um arquivo de opções. A seção relevante do arquivo pode parecer assim:

  ```
  [client]
  host=host_name
  user=user_name
  password=password
  ```

Para mais informações, consulte a Seção 6.2.2.2, “Usando arquivos de opção”.

* Alguns parâmetros de conexão podem ser especificados usando variáveis de ambiente. Exemplos:

+ Para especificar o host para **mysql**, use `MYSQL_HOST`.

+ Em Windows, para especificar o nome do usuário do MySQL, use `USER`.

Para uma lista de variáveis de ambiente suportadas, consulte a Seção 6.9, “Variáveis de Ambiente”.

### 6.2.5 Conectando ao servidor usando strings semelhantes a URI ou pares chave-valor

Esta seção descreve o uso de cadeias de conexão semelhantes a URI ou pares chave-valor para especificar como estabelecer conexões ao servidor MySQL, para clientes como o MySQL Shell. Para informações sobre como estabelecer conexões usando opções de linha de comando, para clientes como **mysql** ou **mysqldump**, consulte a Seção 6.2.4, “Conectando ao Servidor MySQL Usando Opções de Comando”. Para informações adicionais se você não conseguir se conectar, consulte a Seção 8.2.22, “Resolvendo Problemas de Conexão ao MySQL”.

Nota

O termo "semelhante a URI" indica uma sintaxe de cadeia de conexão que é semelhante, mas não idêntica, à sintaxe de URI (identificador uniforme de recurso) definida por [RFC 3986][(https://tools.ietf.org/html/rfc3986)].

Os seguintes clientes MySQL suportam a conexão a um servidor MySQL usando uma cadeia de conexão semelhante a URI ou pares chave-valor:

* MySQL Shell * Conectadores MySQL que implementam X DevAPI

Esta seção documenta todos os parâmetros de conexão de pares de chave-valor semelhantes a strings URI válidos, muitos dos quais são semelhantes aos especificados com opções de linha de comando:

* Os parâmetros especificados com uma string semelhante a URI utilizam uma sintaxe como `myuser@example.com:3306/main-schema`. Para a sintaxe completa, consulte Conectar usando strings de conexão semelhantes a URI.

* Os parâmetros especificados com pares chave-valor utilizam uma sintaxe como `{user:'myuser', host:'example.com', port:3306, schema:'main-schema'}`. Para a sintaxe completa, consulte Conectar usando pares chave-valor.

Os parâmetros de conexão não são sensíveis ao caso. Cada parâmetro, se especificado, pode ser dado apenas uma vez. Se um parâmetro for especificado mais de uma vez, ocorrerá um erro.

Esta seção abrange os seguintes tópicos:

* Parâmetros de conexão de base
* Parâmetros de conexão adicionais
* Conectando usando cadeias de conexão semelhantes a URI
* Conectando usando pares chave-valor

#### Parâmetros de Conexão Básica

A discussão a seguir descreve os parâmetros disponíveis ao especificar uma conexão com o MySQL. Esses parâmetros podem ser fornecidos usando uma string que se conforme à sintaxe semelhante à URI (ver Conectando usando strings de conexão semelhantes a URI), ou como pares chave-valor (ver Conectando usando pares chave-valor).

* *`scheme`*: O protocolo de transporte a ser utilizado. Use `mysqlx` para conexões com X Protocol e `mysql` para conexões clássicas com o protocolo MySQL. Se nenhum protocolo for especificado, o servidor tentará adivinhar o protocolo. Conectadores que suportam DNS SRV podem usar o esquema `mysqlx+srv` (consulte Conexões que utilizam registros DNS SRV).

* *`user`*: A conta de usuário do MySQL para fornecer o processo de autenticação.

* *`password`*: A senha a ser usada no processo de autenticação.

Aviso

Especificar uma senha explícita na especificação de conexão é inseguro e não é recomendado. A discussão posterior mostra como fazer com que um prompt interativo para a senha ocorra.

* *`host`*: O host no qual a instância do servidor está sendo executada. O valor pode ser um nome de host, endereço IPv4 ou endereço IPv6. Se nenhum host for especificado, o padrão é `localhost`.

* *`port`*: A porta da rede TCP/IP na qual o servidor MySQL alvo está ouvindo conexões. Se nenhuma porta for especificada, o padrão é 33060 para conexões com protocolo X e 3306 para conexões com protocolo MySQL clássico.

* *`socket`*: O caminho para um arquivo de soquete Unix ou o nome de um tubo nomeado do Windows. Os valores são caminhos de arquivo locais. Em strings semelhantes a URI, eles devem ser codificados, usando codificação percentual ou ao envolver o caminho entre parênteses. Os parênteses eliminam a necessidade de codificar caracteres percentuais, como o caractere de separador de diretório `/`. Por exemplo, para se conectar como `root@localhost` usando o soquete Unix `/tmp/mysql.sock`, especifique o caminho usando codificação percentual como `root@localhost?socket=%2Ftmp%2Fmysql.sock`, ou usando parênteses como `root@localhost?socket=(/tmp/mysql.sock)`.

* *`schema`*: O banco de dados padrão para a conexão. Se não for especificado nenhum banco de dados, a conexão não tem um banco de dados padrão.

O tratamento de `localhost` em Unix depende do tipo de protocolo de transporte. As conexões que utilizam o protocolo clássico do MySQL tratam `localhost` da mesma maneira que outros clientes MySQL, o que significa que `localhost` é assumido para conexões baseadas em soquete. Para conexões que utilizam o Protocolo X, o comportamento de `localhost` difere, pois é assumido que ele represente o endereço de loopback, por exemplo, o endereço IPv4 127.0.0.1.

#### Parâmetros de conexão adicionais

Você pode especificar opções para a conexão, como atributos em uma string semelhante a URI, anexando `?attribute=value`, ou como pares chave-valor. As seguintes opções estão disponíveis:

* `ssl-mode`: O estado de segurança desejado para a conexão. Os seguintes modos são permitidos:

+ `DISABLED`
  + `PREFERRED`
  + `REQUIRED`
  + `VERIFY_CA`
  + `VERIFY_IDENTITY`

Importante

`VERIFY_CA` e `VERIFY_IDENTITY` são melhores escolhas do que o padrão `PREFERRED`, porque ajudam a prevenir ataques de homem no meio.

Para obter informações sobre esses modos, consulte a descrição da opção `--ssl-mode` nas Opções de comando para conexões criptografadas.

* `ssl-ca`: O caminho para o arquivo de autoridade de certificado X.509 em formato PEM.

* `ssl-capath`: O caminho para o diretório que contém os arquivos da autoridade de certificados X.509 em formato PEM.

* `ssl-cert`: O caminho para o arquivo de certificado X.509 em formato PEM.

* `ssl-cipher`: O algoritmo de criptografia a ser usado para conexões que utilizam protocolos TLS até o TLSv1.2.

* `ssl-crl`: O caminho para o arquivo que contém listas de revogação de certificados em formato PEM.

* `ssl-crlpath`: O caminho para o diretório que contém arquivos de lista de revogação de certificados em formato PEM.

* `ssl-key`: O caminho para o arquivo de chave X.509 em formato PEM.

* `tls-version`: Os protocolos TLS permitidos para conexões criptografadas com o protocolo clássico MySQL. Esta opção é suportada apenas pelo MySQL Shell. O valor de `tls-version` (singular) é uma lista separada por vírgula, por exemplo, `TLSv1.2,TLSv1.3`. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifra de conexão criptografada TLS”. Esta opção depende de a opção `ssl-mode` não estar definida como `DISABLED`.

* `tls-versions`: Os protocolos TLS permitidos para conexões criptografadas com o X Protocol. O valor de `tls-versions` (plural) é um array, como `[TLSv1.2,TLSv1.3]`. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifras TLS de conexão criptografada”. Esta opção depende de a opção `ssl-mode` não estar definida como `DISABLED`.

* `tls-ciphersuites`: As suítes de cifra TLS permitidas. O valor de `tls-ciphersuites` é uma lista de nomes de suítes de cifra IANA, conforme listado em [Suítes de cifra TLS][(https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#tls-parameters-4)]. Para detalhes, consulte a Seção 8.3.2, “Protocolos e cifras de conexão criptografada TLS”. Esta opção depende de a opção `ssl-mode` não estar definida como `DISABLED`.

* `auth-method`: O método de autenticação a ser utilizado para a conexão. O padrão é `AUTO`, o que significa que o servidor tenta adivinhar. Os seguintes métodos são permitidos:

+ `AUTO`
  + `MYSQL41`
  + `SHA256_MEMORY`
  + `FROM_CAPABILITIES`
  + `FALLBACK`
  + `PLAIN`

Para conexões do Protocolo X, qualquer `auth-method` configurado é substituído por essa sequência de métodos de autenticação: `MYSQL41`, `SHA256_MEMORY`, `PLAIN`.

* `get-server-public-key`: Solicite ao servidor a chave pública necessária para a troca de senha baseada em par de chaves RSA. Use quando se conecta a servidores MySQL 8.0 através do protocolo MySQL clássico com modo SSL `DISABLED`. Você deve especificar o protocolo neste caso. Por exemplo:

  ```
  mysql://user@localhost:3306?get-server-public-key=true
  ```

Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação SHA-2 Pluggable”.

* `server-public-key-path`: O nome do caminho de um arquivo em formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senha baseada em par de chaves RSA. Use ao se conectar a servidores MySQL 8.0 através do protocolo MySQL clássico com modo SSL `DISABLED`.

Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `get-server-public-key`.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação substituível SHA-256”, e a Seção 8.4.1.2, “Cache de autenticação substituível SHA-2”.

* `ssh`: O URI para conexão a um servidor SSH para acessar uma instância do servidor MySQL usando tunelamento SSH. O formato do URI é `[user@]host[:port]`. Use a opção `uri` para especificar o URI da instância do servidor MySQL alvo. Para informações sobre conexões de tunelamento SSH a partir do MySQL Shell, consulte Usando um tunelamento SSH.

* `uri`: O URI de uma instância do servidor MySQL que deve ser acessada por meio de um túnel SSH a partir do servidor especificado pela opção `ssh`. O formato do URI é `[scheme://][user@]host[:port]`. Não use os parâmetros de conexão básica (`scheme`, `user`, `host`, `port`) para especificar a conexão do servidor MySQL para o túnel SSH, apenas use a opção `uri`.

* `ssh-password`: A senha para a conexão com o servidor SSH.

Aviso

Especificar uma senha explícita na especificação de conexão é inseguro e não é recomendado. O MySQL Shell solicita uma senha interativamente quando é necessária.

* `ssh-config-file`: O arquivo de configuração SSH para a conexão com o servidor SSH. Você pode usar a opção de configuração do MySQL Shell `ssh.configFile` para definir um arquivo personalizado como padrão, se esta opção não for especificada. Se `ssh.configFile` não tiver sido definido, o padrão é o arquivo de configuração padrão SSH `~/.ssh/config`.

* `ssh-identity-file`: O arquivo de identidade a ser usado para a conexão com o servidor SSH. O padrão se esta opção não for especificada é qualquer arquivo de identidade configurado em um agente SSH (se usado), ou no arquivo de configuração SSH, ou o arquivo de chave privada padrão na pasta de configuração SSH (`~/.ssh/id_rsa`).

* `ssh-identity-pass`: A senha para o arquivo de identidade especificado pela opção `ssh-identity-file`.

Aviso

Especificar uma senha explícita na especificação de conexão é inseguro e não é recomendado. O MySQL Shell solicita uma senha interativamente quando é necessária.

* `connect-timeout`: Um valor inteiro usado para configurar o número de segundos que os clientes, como o MySQL Shell, esperam até parar de tentar se conectar a um servidor MySQL não responsivo.

* `compression`: Esta opção solicita ou desativa a compressão para a conexão. Até o MySQL 8.0.19, ela opera apenas para conexões com o protocolo MySQL clássico, e a partir do MySQL 8.0.20, ela também opera para conexões com o Protocolo X.

+ Até o MySQL 8.0.19, os valores para esta opção são `true` (ou 1), que habilita a compressão, e o padrão `false` (ou 0), que desativa a compressão.

+ A partir do MySQL 8.0.20, os valores para esta opção são `required`, que solicita compressão e falha se o servidor não a suportar; `preferred`, que solicita compressão e retorna a uma conexão não comprimida; e `disabled`, que solicita uma conexão não comprimida e falha se o servidor não permitir essas opções. `preferred` é o padrão para conexões com o protocolo X, e `disabled` é o padrão para conexões com o protocolo MySQL clássico. Para informações sobre o controle de compressão de conexão com o Plugin X, consulte a Seção 22.5.5, “Compressão de Conexão com Plugin X”.

Observe que diferentes clientes MySQL implementam seu suporte para compressão de conexão de maneira diferente. Consulte a documentação do seu cliente para obter detalhes.

* `compression-algorithms` e `compression-level`: Essas opções estão disponíveis no MySQL Shell 8.0.20 e versões posteriores para mais controle sobre a compressão da conexão. Você pode especiá-las para selecionar o algoritmo de compressão usado para a conexão e o nível de compressão numérica usado com esse algoritmo. Você também pode usar `compression-algorithms` no lugar de `compression` para solicitar compressão para a conexão. Para informações sobre o controle de compressão de conexão do MySQL Shell, consulte Usando Conexões Compressas.

* `connection-attributes`: Controla os pares chave-valor que os programas de aplicação passam para o servidor no momento da conexão. Para informações gerais sobre os atributos de conexão, consulte a Seção 29.12.9, “Tabelas de Atributos de Conexão do Schema de Desempenho”. Os clientes geralmente definem um conjunto padrão de atributos, que podem ser desativados ou ativados. Por exemplo:

  ```
  mysqlx://user@host?connection-attributes
  mysqlx://user@host?connection-attributes=true
  mysqlx://user@host?connection-attributes=false
  ```

O comportamento padrão é enviar o conjunto de atributos padrão. As aplicações podem especificar atributos adicionais a serem passados além dos atributos padrão. Você especifica atributos adicionais de conexão como um parâmetro `connection-attributes` em uma string de conexão. O valor do parâmetro `connection-attributes` deve ser vazio (o mesmo que especificar `true`), um valor `Boolean` (`true` ou `false` para habilitar ou desabilitar o conjunto de atributos padrão), ou uma lista ou zero ou mais especificadores `key=value` separados por vírgulas (a serem enviados além do conjunto de atributos padrão). Dentro de uma lista, um valor de chave ausente é avaliado como uma string vazia. Exemplos adicionais:

  ```
  mysqlx://user@host?connection-attributes=[attr1=val1,attr2,attr3=]
  mysqlx://user@host?connection-attributes=[]
  ```

Os nomes de atributos definidos pela aplicação não podem começar com `_`, pois tais nomes são reservados para atributos internos.

#### Conectando usando cadeias de conexão semelhantes a URI

Você pode especificar uma conexão ao MySQL Server usando uma string semelhante a uma URI. Tais strings podem ser usadas com o MySQL Shell com a opção de comando `--uri`, o comando MySQL Shell `\connect` e Conectadores MySQL que implementam X DevAPI.

Nota

O termo "semelhante a URI" indica uma sintaxe de cadeia de conexão que é semelhante, mas não idêntica, à sintaxe de URI (identificador uniforme de recurso) definida por [RFC 3986][(https://tools.ietf.org/html/rfc3986)].

Uma cadeia de conexão semelhante a URI tem a seguinte sintaxe:

```
[scheme://][user[:[password]]@]host[:port][/schema][?attribute1=value1&attribute2=value2...
```

Importante

O codificação por porcentagem deve ser usada para caracteres reservados nos elementos da string semelhante a URI. Por exemplo, se você especificar uma string que inclui o caractere `@`, o caractere deve ser substituído por `%40`. Se você incluir um ID de zona em um endereço IPv6, o caractere `%` usado como separador deve ser substituído por `%25`.

Os parâmetros que você pode usar em uma cadeia de conexão semelhante a URI são descritos em Parâmetros de conexão básica.

Os métodos `shell.parseUri()` e `shell.unparseUri()` do MySQL Shell podem ser usados para decompor e montar uma cadeia de conexão semelhante a URI. Dado uma cadeia de conexão semelhante a URI, `shell.parseUri()` retorna um dicionário contendo cada elemento encontrado na string. `shell.unparseUri()` converte um dicionário de componentes de URI e opções de conexão em uma cadeia de conexão semelhante a URI válida para conectar ao MySQL, que pode ser usada no MySQL Shell ou por Conectadores MySQL que implementam X DevAPI.

Se não for especificado uma senha na string semelhante a URI, o que é recomendado, os clientes interativos solicitam a senha. Os exemplos a seguir mostram como especificar strings semelhantes a URI com o nome de usuário *`user_name`*. Em cada caso, a senha é solicitada.

* Uma conexão com o protocolo X a uma instância do servidor local que está ouvindo na porta 33065.

  ```
  mysqlx://user_name@localhost:33065
  ```

* Uma conexão clássica ao protocolo MySQL para uma instância do servidor local que está ouvindo na porta 3333.

  ```
  mysql://user_name@localhost:3333
  ```

* Uma conexão com o Protocolo X a uma instância de servidor remoto, usando um nome de host, um endereço IPv4 e um endereço IPv6.

  ```
  mysqlx://user_name@server.example.com/
  mysqlx://user_name@198.51.100.14:123
  mysqlx://user_name@[2001:db8:85a3:8d3:1319:8a2e:370:7348]
  ```

* Uma conexão com protocolo X usando uma soquete, com o caminho fornecido usando codificação por porcentagem ou parênteses.

  ```
  mysqlx://user_name@/path%2Fto%2Fsocket.sock
  mysqlx://user_name@(/path/to/socket.sock)
  ```

* Pode ser especificado um caminho opcional, que representa um banco de dados.

  ```
  # use 'world' as the default database
  mysqlx://user_name@198.51.100.1/world

  # use 'world_x' as the default database, encoding _ as %5F
  mysqlx://user_name@198.51.100.2:33060/world%5Fx
  ```

* Pode ser especificado uma consulta opcional, composta por valores cada um dado como um par `key=value` ou como um único *`key`*. Para especificar vários valores, separe-os por caracteres `,`. Uma mistura de valores `key=value` e *`key`* é permitida. Os valores podem ser do tipo lista, com valores de lista ordenados por aparência. As strings devem ser codificadas em porcentagem ou cercadas por parênteses. O seguinte é equivalente.

  ```
  ssluser@127.0.0.1?ssl-ca=%2Froot%2Fclientcert%2Fca-cert.pem\
  &ssl-cert=%2Froot%2Fclientcert%2Fclient-cert.pem\
  &ssl-key=%2Froot%2Fclientcert%2Fclient-key

  ssluser@127.0.0.1?ssl-ca=(/root/clientcert/ca-cert.pem)\
  &ssl-cert=(/root/clientcert/client-cert.pem)\
  &ssl-key=(/root/clientcert/client-key)
  ```

* Para especificar uma versão TLS e um conjunto de cifras a serem usados para conexões criptografadas:

  ```
  mysql://user_name@198.51.100.2:3306/world%5Fx?\
  tls-versions=[TLSv1.2,TLSv1.3]&tls-ciphersuites=[TLS_DHE_PSK_WITH_AES_128_\
  GCM_SHA256, TLS_CHACHA20_POLY1305_SHA256]
  ```

Os exemplos anteriores assumem que as conexões exigem uma senha. Com clientes interativos, a senha do usuário especificado é solicitada na solicitação de login. Se a conta do usuário não tiver senha (o que é inseguro e não recomendado), ou se a autenticação de credencial de peer de soquete estiver em uso (por exemplo, com conexões de soquete Unix), você deve especificar explicitamente na string de conexão que nenhuma senha está sendo fornecida e que o prompt de senha não é necessário. Para fazer isso, coloque um `:` após o *`user_name`* na string, mas não especifique uma senha após ele. Por exemplo:

```
mysqlx://user_name:@localhost
```

#### Conectando Usando Pares Chave-Valor

No MySQL Shell e em alguns Conectadores MySQL que implementam o X DevAPI, você pode especificar uma conexão ao servidor MySQL usando pares chave-valor, fornecidos em construções naturais do idioma para a implementação. Por exemplo, você pode fornecer parâmetros de conexão usando pares chave-valor como um objeto JSON em JavaScript, ou como um dicionário em Python. Independentemente da maneira como os pares chave-valor são fornecidos, o conceito permanece o mesmo: as chaves descritas nesta seção podem ser atribuídas a valores que são usados para especificar uma conexão. Você pode especificar conexões usando pares chave-valor no método `shell.connect()` do MySQL Shell ou no método `dba.createCluster()` do InnoDB Cluster, e com alguns dos Conectadores MySQL que implementam o X DevAPI.

Geralmente, os pares chave-valor são cercados pelos caracteres `{` e `}` e o caractere `,` é usado como um separador entre os pares chave-valor. O caractere `:` é usado entre as chaves e os valores, e as strings devem ser delimitadas (por exemplo, usando o caractere `'`). Não é necessário codificar as strings em porcentagem, ao contrário das strings de conexão semelhantes a URI.

Uma conexão especificada como pares chave-valor tem o seguinte formato:

```
{ key: value, key: value, ...}
```

Os parâmetros que você pode usar como chaves para uma conexão são descritos em Parâmetros de Conexão Básica.

Se não for especificado uma senha nos pares chave-valor, o que é recomendado, os clientes interativos solicitam a senha. Os exemplos a seguir mostram como especificar conexões usando pares chave-valor com o nome de usuário `'user_name'`. Em cada caso, a senha é solicitada.

* Uma conexão com o protocolo X a uma instância do servidor local que está ouvindo na porta 33065.

  ```
  {user:'user_name', host:'localhost', port:33065}
  ```

* Uma conexão clássica ao protocolo MySQL para uma instância do servidor local que está ouvindo na porta 3333.

  ```
  {user:'user_name', host:'localhost', port:3333}
  ```

* Uma conexão com o Protocolo X a uma instância de servidor remoto, usando um nome de host, um endereço IPv4 e um endereço IPv6.

  ```
  {user:'user_name', host:'server.example.com'}
  {user:'user_name', host:198.51.100.14:123}
  {user:'user_name', host:[2001:db8:85a3:8d3:1319:8a2e:370:7348]}
  ```

* Uma conexão com protocolo X usando uma soquete.

  ```
  {user:'user_name', socket:'/path/to/socket/file'}
  ```

* Pode ser especificado um esquema opcional, que representa um banco de dados.

  ```
  {user:'user_name', host:'localhost', schema:'world'}
  ```

Os exemplos anteriores assumem que as conexões exigem uma senha. Com clientes interativos, a senha do usuário especificado é solicitada na solicitação de login. Se a conta do usuário não tiver senha (o que é inseguro e não recomendado), ou se a autenticação de credencial de peer de soquete estiver em uso (por exemplo, com conexões de soquete Unix), você deve especificar explicitamente que nenhuma senha está sendo fornecida e que a solicitação de senha não é necessária. Para fazer isso, forneça uma string vazia usando `''` após a chave `password`. Por exemplo:

```
{user:'user_name', password:'', host:'localhost'}
```

### 6.2.6 Conectando ao servidor usando registros DNS SRV

No Sistema de Nomes de Domínio (DNS), um registro SRV (registro de localização de serviço) é um tipo de registro de recurso que permite que um cliente especifique um nome que indique um serviço, protocolo e domínio. Uma pesquisa DNS sobre o nome retorna uma resposta contendo os nomes de vários servidores disponíveis no domínio que fornecem o serviço necessário. Para informações sobre o DNS SRV, incluindo como um registro define a ordem de preferência dos servidores listados, consulte [RFC 2782][(https://tools.ietf.org/html/rfc2782)].

O MySQL suporta o uso de registros DNS SRV para conectar-se a servidores. Um cliente que recebe um resultado de pesquisa DNS SRV tenta se conectar ao servidor MySQL em cada um dos hosts listados na ordem de preferência, com base na prioridade e ponderação atribuída a cada host pelo administrador do DNS. Uma falha na conexão ocorre apenas se o cliente não conseguir se conectar a nenhum dos servidores.

Quando várias instâncias do MySQL, como um grupo de servidores, fornecem o mesmo serviço para suas aplicações, os registros DNS SRV podem ser usados para auxiliar em serviços de failover, balanceamento de carga e replicação. É complicado para as aplicações gerenciar diretamente o conjunto de servidores candidatos para tentativas de conexão, e os registros DNS SRV oferecem uma alternativa:

* Os registros DNS SRV permitem que um administrador de DNS mapeie um único domínio DNS para vários servidores. Os registros DNS SRV também podem ser atualizados centralmente pelos administradores quando servidores são adicionados ou removidos da configuração ou quando seus nomes de host são alterados.

* A gestão centralizada dos registros DNS SRV elimina a necessidade de os clientes individuais identificarem cada possível host nas solicitações de conexão, ou de que as conexões sejam manipuladas por um componente de software adicional. Uma aplicação pode usar o registro DNS SRV para obter informações sobre servidores MySQL candidatos, em vez de gerenciar as informações do servidor em si.

* Os registros DNS SRV podem ser usados em combinação com o agrupamento de conexões, no caso em que as conexões aos hosts que não estão mais na lista atual de registros DNS SRV são removidos do grupo quando ficam ociosos.

O MySQL suporta o uso de registros DNS SRV para se conectar a servidores nesses contextos:

* Vários Conectadores MySQL implementam suporte ao DNS SRV; as opções específicas do conector permitem solicitar a busca de registro DNS SRV tanto para conexões com protocolo X quanto para conexões com protocolo MySQL clássico. Para informações gerais, consulte Conexões que utilizam registros DNS SRV. Para detalhes, consulte a documentação dos Conectadores MySQL individuais.

* A API C fornece uma função `mysql_real_connect_dns_srv()` que é semelhante a `mysql_real_connect()`, exceto que a lista de argumentos não especifica o host específico do servidor MySQL a ser conectado. Em vez disso, ela nomeia um registro DNS SRV que especifica um grupo de servidores. Veja mysql_real_connect_dns_srv().

* O cliente **mysql** tem a opção `--dns-srv-name` para indicar um registro DNS SRV que especifica um grupo de servidores. Veja a Seção 6.5.1, “mysql — O cliente de linha de comando MySQL”.

Um nome DNS SRV consiste em um serviço, protocolo e domínio, com o serviço e o protocolo sendo precedidos por uma sublinhado:

```
_service._protocol.domain
```

O seguinte registro DNS SRV identifica vários servidores candidatos, como os que podem ser utilizados por clientes para estabelecer conexões com o protocolo X:

```
Name                      TTL   Class  Priority Weight Port  Target
_mysqlx._tcp.example.com. 86400 IN SRV 0        5      33060 server1.example.com.
_mysqlx._tcp.example.com. 86400 IN SRV 0        10     33060 server2.example.com.
_mysqlx._tcp.example.com. 86400 IN SRV 10       5      33060 server3.example.com.
_mysqlx._tcp.example.com. 86400 IN SRV 20       5      33060 server4.example.com.
```

Aqui, `mysqlx` indica o serviço X Protocol e `tcp` indica o protocolo TCP. Um cliente pode solicitar este registro DNS SRV usando o nome `_mysqlx._tcp.example.com`. A sintaxe específica para especificar o nome na solicitação de conexão depende do tipo de cliente. Por exemplo, um cliente pode suportar a especificação do nome dentro de uma cadeia de conexão semelhante a URI ou como um par chave-valor.

Um registro DNS SRV para conexões de protocolo clássico pode parecer assim:

```
Name                     TTL   Class  Priority Weight  Port Target
_mysql._tcp.example.com. 86400 IN SRV 0        5       3306 server1.example.com.
_mysql._tcp.example.com. 86400 IN SRV 0        10      3306 server2.example.com.
_mysql._tcp.example.com. 86400 IN SRV 10       5       3306 server3.example.com.
_mysql._tcp.example.com. 86400 IN SRV 20       5       3306 server4.example.com.
```

Aqui, o nome `mysql` designa o serviço de protocolo MySQL clássico, e a porta é 3306 (a porta padrão do protocolo MySQL clássico) e não 33060 (a porta padrão do protocolo X).

Quando a pesquisa de registro DNS SRV é usada, os clientes geralmente devem aplicar essas regras para solicitações de conexão (pode haver exceções específicas para clientes ou para o conector):

* O pedido deve especificar o nome completo do registro DNS SRV, com os nomes do serviço e do protocolo prefixados com sublinhados.

* O pedido não deve especificar múltiplos nomes de host. * O pedido não deve especificar um número de porta. * Apenas conexões TCP são suportadas. Arquivos de soquetes Unix, tubos nomeados do Windows e memória compartilhada não podem ser usados.

Para obter mais informações sobre o uso de conexões baseadas em DNS SRV no X DevAPI, consulte Conexões que utilizam registros DNS SRV.

### 6.2.7 Protocolos de Transporte de Conexão

Para os programas que utilizam a biblioteca de cliente MySQL (por exemplo, **mysql** e **mysqldump**), o MySQL suporta conexões ao servidor com base em vários protocolos de transporte: TCP/IP, soquete Unix, canal nomeado e memória compartilhada. Esta seção descreve como selecionar esses protocolos e como eles são semelhantes e diferentes.

* Seleção do protocolo de transporte
* Suporte de transporte para conexões locais e remotas
* Interpretação do localhost
* Características de criptografia e segurança
* Compressão de conexão

#### Seleção do Protocolo de Transporte

Para uma conexão específica, se o protocolo de transporte não for especificado explicitamente, ele é determinado implicitamente. Por exemplo, conexões a `localhost` resultam em uma conexão de arquivo de soquete em sistemas Unix e semelhantes a Unix, e uma conexão TCP/IP para `127.0.0.1` de outra forma. Para informações adicionais, consulte a Seção 6.2.4, “Conectando ao servidor MySQL usando opções de comando”.

Para especificar o protocolo explicitamente, use a opção de comando `--protocol`. O seguinte quadro mostra os valores permitidos para `--protocol` e indica as plataformas aplicáveis para cada valor. Os valores não são sensíveis ao caso.

<table summary="Permissible transport protocol values, the resulting transport protocol used, and the applicable platforms for each value."><col style="width: 20%"/><col style="width: 50%"/><col style="width: 30%"/><thead><tr> <th scope="col"><code>--protocol</code> Value</th> <th scope="col">Transport Protocol Used</th> <th scope="col">Applicable Platforms</th> </tr></thead><tbody><tr> <th scope="row"><code>TCP</code></th> <td>TCP/IP</td> <td>All</td> </tr><tr> <th scope="row"><code>SOCKET</code></th> <td>arquivo de socket Unix</td> <td>Unix e sistemas semelhantes ao Unix</td> </tr><tr> <th scope="row"><code>PIPE</code></th> <td>Named pipe</td> <td>Windows</td> </tr><tr> <th scope="row"><code>MEMORY</code></th> <td>Shared memory</td> <td>Windows</td> </tr></tbody></table>

#### Suporte de transporte para conexões locais e remotas

O transporte TCP/IP suporta conexões a servidores MySQL locais ou remotos.

Os transportadores Socket-file, named-pipe e de memória compartilhada suportam conexões apenas a servidores MySQL locais. (O transportador named-pipe permite conexões remotas, mas essa capacidade não é implementada no MySQL.)

#### Interpretação de localhost

Se o protocolo de transporte não for especificado explicitamente, `localhost` é interpretado da seguinte forma:

* Em sistemas Unix e similares, uma conexão com `localhost` resulta em uma conexão de arquivo de soquete.

* Caso contrário, uma conexão com `localhost` resulta em uma conexão TCP/IP com `127.0.0.1`.

Se o protocolo de transporte for especificado explicitamente, `localhost` é interpretado em relação a esse protocolo. Por exemplo, com `--protocol=TCP`, uma conexão com `localhost` resulta em uma conexão TCP/IP com `127.0.0.1` em todas as plataformas.

#### Características de criptografia e segurança

Os transportes TCP/IP e socket-file estão sujeitos à criptografia TLS/SSL, usando as opções descritas nas Opções de comando para conexões criptografadas. Os transportes de pipe nomeado e de memória compartilhada não estão sujeitos à criptografia TLS/SSL.

Uma conexão é segura por padrão se feita através de um protocolo de transporte que é seguro por padrão. Caso contrário, para protocolos que estão sujeitos à criptografia TLS/SSL, uma conexão pode ser feita segura usando criptografia:

* As conexões TCP/IP não são seguras por padrão, mas podem ser criptografadas para torná-las seguras.

As conexões de arquivo de soquete são seguras por padrão. Elas também podem ser criptografadas, mas criptografar uma conexão de arquivo de soquete não a torna mais segura e aumenta a carga da CPU.

As conexões de canal nomeado não são seguras por padrão e não estão sujeitas a criptografia para torná-las seguras. No entanto, a variável de sistema `named_pipe_full_access_group` está disponível para controlar quais usuários do MySQL têm permissão para usar conexões de canal nomeado.

As conexões de memória compartilhada são seguras por padrão.

Se a variável de sistema `require_secure_transport` estiver habilitada, o servidor permite apenas conexões que utilizam alguma forma de transporte seguro. De acordo com as observações anteriores, as conexões que utilizam TCP/IP criptografado usando TLS/SSL, um arquivo de soquete ou memória compartilhada são conexões seguras. As conexões TCP/IP não criptografadas usando TLS/SSL e as conexões de named-pipe não são seguras.

Veja também Configurar conexões criptografadas como obrigatórias.

#### Compressão de Conexão

Todos os protocolos de transporte estão sujeitos ao uso de compressão no tráfego entre o cliente e o servidor. Se compressão e criptografia forem usadas para uma conexão dada, a compressão ocorre antes da criptografia. Para mais informações, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

### 6.2.8 Controle de Compressão de Conexão

As conexões ao servidor podem usar compressão no tráfego entre o cliente e o servidor para reduzir o número de bytes enviados pela conexão. Por padrão, as conexões não são comprimidas, mas podem ser comprimidas se o servidor e o cliente concordarem em um algoritmo de compressão mutuamente permitido.

As conexões compactadas têm origem no lado do cliente, mas afetam a carga da CPU tanto no lado do cliente quanto no do servidor, porque ambos os lados realizam operações de compactação e descompactação. Como a ativação da compactação diminui o desempenho, seus benefícios ocorrem principalmente quando há baixa largura de banda de rede, o tempo de transferência de rede domina o custo das operações de compactação e descompactação, e os conjuntos de resultados são grandes.

Esta seção descreve os parâmetros de configuração de controle de compressão disponíveis e as fontes de informações disponíveis para monitoramento do uso de compressão. Ela se aplica a conexões clássicas do protocolo MySQL.

O controle de compressão se aplica a conexões ao servidor por programas de cliente e por servidores que participam da replicação de origem/replica ou da Replicação em Grupo. O controle de compressão não se aplica a conexões para tabelas `FEDERATED`. Na discussão a seguir, “conexão de cliente” é uma abreviação para uma conexão ao servidor que tem origem em qualquer fonte para a qual a compressão é suportada, a menos que o contexto indique um tipo específico de conexão.

Nota

As conexões do protocolo X a uma instância do servidor MySQL suportam compressão a partir do MySQL 8.0.19, mas a compressão para conexões do protocolo X opera de forma independente da compressão para conexões clássicas do protocolo MySQL descritas aqui e é controlada separadamente. Consulte a Seção 22.5.5, “Compressão de Conexão com Plugin X”, para obter informações sobre a compressão de conexões do protocolo X.

* Configurar compressão de conexão
* Configurar compressão de conexão antiga
* Monitorar compressão de conexão

#### Configurando a Compressão de Conexão

A partir do MySQL 8.0.18, esses parâmetros de configuração estão disponíveis para controlar a compressão de conexão:

* A variável de sistema `protocol_compression_algorithms` configura quais algoritmos de compressão o servidor permite para conexões de entrada.

As opções de linha de comando `--compression-algorithms` e `--zstd-compression-level` configuram os algoritmos de compressão permitidos e o nível de compressão `zstd` para esses programas cliente: **mysql**, **mysqladmin**, **mysqlbinlog**, **mysqlcheck**, **mysqldump**, **mysqlimport**, **mysqlpump**, **mysqlshow**, **mysqlslap** e **mysqltest**, e **mysql_upgrade**. O MySQL Shell também oferece essas opções de linha de comando a partir de sua versão 8.0.20.

As opções `MYSQL_OPT_COMPRESSION_ALGORITHMS` e `MYSQL_OPT_ZSTD_COMPRESSION_LEVEL` para a função `mysql_options()` configuram os algoritmos de compressão permitidos e o nível de compressão `zstd` para os programas de cliente que utilizam a API C do MySQL.

As opções `MASTER_COMPRESSION_ALGORITHMS` e `MASTER_ZSTD_COMPRESSION_LEVEL` para a declaração `CHANGE MASTER TO` configuram os algoritmos de compressão permitidos e o nível de compressão `zstd` para servidores replica que participam da replicação de origem/replica. A partir do MySQL 8.0.23, use a declaração `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") e as opções `SOURCE_COMPRESSION_ALGORITHMS` e `SOURCE_ZSTD_COMPRESSION_LEVEL` em vez disso.

* As variáveis de sistema `group_replication_recovery_compression_algorithms` e `group_replication_recovery_zstd_compression_level` configuram os algoritmos de compressão permitidos e o nível de compressão `zstd` para conexões de recuperação de Replicação por Grupo quando um novo membro se junta a um grupo e se conecta a um doador.

Os parâmetros de configuração que permitem especificar algoritmos de compressão são de valor de cadeia e aceitam uma lista de um ou mais nomes de algoritmo de compressão separados por vírgula, em qualquer ordem, escolhidos dos seguintes itens (não sensíveis ao caso):

* `zlib`: Permita conexões que utilizem o algoritmo de compressão `zlib`.

* `zstd`: Permita conexões que utilizem o algoritmo de compressão `zstd`.

* `uncompressed`: Permita conexões não compactadas.

Nota

Como o `uncompressed` é um nome de algoritmo que pode ou não ser configurado, é possível configurar o MySQL *não* para permitir conexões não compactadas.

Exemplos:

* Para configurar quais algoritmos de compressão o servidor permite para conexões de entrada, defina a variável de sistema `protocol_compression_algorithms`. Por padrão, o servidor permite todos os algoritmos disponíveis. Para configurar essa configuração explicitamente na inicialização, use essas linhas no arquivo do servidor `my.cnf`:

  ```
  [mysqld]
  protocol_compression_algorithms=zlib,zstd,uncompressed
  ```

Para definir e persistir a variável de sistema `protocol_compression_algorithms` nesse valor no momento da execução, use a seguinte declaração:

  ```
  SET PERSIST protocol_compression_algorithms='zlib,zstd,uncompressed';
  ```

`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") define um valor para a instância MySQL em execução. Também salva o valor, fazendo com que ele seja carregado em reinicializações subsequentes do servidor. Para alterar o valor da instância MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`. Veja a Seção 15.7.6.1, "Sintaxe SET para atribuição de variáveis".

* Para permitir apenas conexões de entrada que utilizem a compressão `zstd`, configure o servidor no início da seguinte forma:

  ```
  [mysqld]
  protocol_compression_algorithms=zstd
  ```

Ou, para fazer a mudança no tempo de execução:

  ```
  SET PERSIST protocol_compression_algorithms='zstd';
  ```

* Para permitir que o cliente **mysql** inicie conexões `zlib` ou `uncompressed`, invoque-o da seguinte forma:

  ```
  mysql --compression-algorithms=zlib,uncompressed
  ```

* Para configurar réplicas para se conectarem à fonte usando conexões `zlib` ou `zstd`, com um nível de compressão de 7 para conexões `zstd`, use uma declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou uma declaração [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes do MySQL 8.0.23):

  ```
  CHANGE REPLICATION SOURCE TO
    SOURCE_COMPRESSION_ALGORITHMS = 'zlib,zstd',
    SOURCE_ZSTD_COMPRESSION_LEVEL = 7;
  ```

Isso pressupõe que a variável de sistema `replica_compressed_protocol` ou `slave_compressed_protocol` esteja desativada, por razões descritas na Configuração da Compressão de Conexão Legada.

Para a configuração de conexão bem-sucedida, ambos os lados da conexão devem concordar em um algoritmo de compressão mutuamente permitido. O processo de negociação do algoritmo tenta usar `zlib`, em seguida `zstd`, em seguida `uncompressed`. Se os dois lados não conseguirem encontrar um algoritmo comum, a tentativa de conexão falha.

Como ambos os lados devem concordar com o algoritmo de compressão, e porque `uncompressed` é um valor de algoritmo que não é necessariamente permitido, o recurso a uma conexão não comprimida não ocorre necessariamente. Por exemplo, se o servidor estiver configurado para permitir `zstd` e um cliente estiver configurado para permitir `zlib,uncompressed`, o cliente não pode se conectar de forma alguma. Neste caso, nenhum algoritmo é comum a ambos os lados, então as tentativas de conexão falham.

Os parâmetros de configuração que permitem especificar o nível de compressão `zstd` aceitam um valor inteiro de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão `zstd` é 3. O ajuste do nível de compressão não afeta as conexões que não utilizam compressão `zstd`.

Um nível de compressão configurável `zstd` permite escolher entre menos tráfego de rede e maior carga de CPU versus mais tráfego de rede e menor carga de CPU. Níveis de compressão mais altos reduzem o congestionamento de rede, mas a carga adicional de CPU pode reduzir o desempenho do servidor.

#### Configurando a Compressão de Conexão Legada

Antes do MySQL 8.0.18, esses parâmetros de configuração estão disponíveis para controlar a compressão de conexão:

* Os programas do cliente suportam uma opção de linha de comando `--compress` para especificar o uso de compressão para a conexão com o servidor.

* Para os programas que utilizam a API C do MySQL, habilitar a opção `MYSQL_OPT_COMPRESS` para a função `mysql_options()` especifica o uso de compressão para a conexão com o servidor.

* Para replicação de fonte/replica, habilitar a variável de sistema `replica_compressed_protocol` (a partir do MySQL 8.0.26) ou `slave_compressed_protocol` (antes do MySQL 8.0.26) especifica o uso de compressão para conexões de replica à fonte.

Em cada caso, quando o uso de compressão é especificado, a conexão utiliza o algoritmo de compressão `zlib` se ambas as partes permitirem, caso contrário, com fallback para uma conexão não comprimida.

A partir do MySQL 8.0.18, os parâmetros de compressão descritos acima se tornam parâmetros legados, devido aos parâmetros adicionais de compressão introduzidos para maior controle sobre a compressão da conexão, que são descritos na Configuração da compressão da conexão. Uma exceção é o MySQL Shell, onde a opção de linha de comando `--compress` permanece atual e pode ser usada para solicitar compressão sem selecionar algoritmos de compressão. Para informações sobre o controle de compressão de conexão do MySQL Shell, consulte o uso de conexões comprimidas.

Os parâmetros de compressão de legado interagem com os novos parâmetros e sua semântica muda da seguinte forma:

* O significado da opção `--compress` depende de se `--compression-algorithms` é especificado:

+ Quando `--compression-algorithms` não é especificado, `--compress` é equivalente a especificar um conjunto de algoritmos do lado do cliente de `zlib,uncompressed`.

Quando `--compression-algorithms` é especificado, `--compress` é equivalente a especificar um conjunto de algoritmos de `zlib` e o conjunto completo de algoritmos do lado do cliente é a união de `zlib` mais os algoritmos especificados por `--compression-algorithms`. Por exemplo, com tanto `--compress` quanto `--compression-algorithms=zlib,zstd`, o conjunto de algoritmos permitido é `zlib` mais `zlib,zstd`; ou seja, `zlib,zstd`. Com tanto `--compress` quanto `--compression-algorithms=zstd,uncompressed`, o conjunto de algoritmos permitido é `zlib` mais `zstd,uncompressed`; ou seja, `zlib,zstd,uncompressed`.

* O mesmo tipo de interação ocorre entre a opção `MYSQL_OPT_COMPRESS` e a opção `MYSQL_OPT_COMPRESSION_ALGORITHMS` para a função C API `mysql_options()`.

* Se a variável de sistema `replica_compressed_protocol` ou `slave_compressed_protocol` estiver habilitada, ela tem precedência sobre `MASTER_COMPRESSION_ALGORITHMS` e as conexões à fonte utilizam a compressão de `zlib` se tanto a fonte quanto a réplica permitirem esse algoritmo. Se `replica_compressed_protocol` ou `slave_compressed_protocol` estiver desativado, o valor de `MASTER_COMPRESSION_ALGORITHMS` se aplica.

Nota

Os parâmetros de controle de compactação do legado são desaconselhados a partir do MySQL 8.0.18; espere que eles sejam removidos em uma versão futura do MySQL.

#### Monitoramento da Compressão da Conexão

A variável de status `Compression` é `ON` ou `OFF` para indicar se a conexão atual utiliza compressão.

O comando do cliente **mysql** `\status` exibe uma linha que diz `Protocol: Compressed` se a compressão estiver habilitada para a conexão atual. Se essa linha não estiver presente, a conexão não está comprimida.

A partir da versão 8.0.14, o comando MySQL Shell `\status` exibe uma linha `Compression:` que diz `Disabled` ou `Enabled` para indicar se a conexão está comprimida.

A partir do MySQL 8.0.18, essas fontes adicionais de informações estão disponíveis para monitoramento da compressão de conexão:

* Para monitorar a compressão em uso para conexões de clientes, use as variáveis de status `Compression_algorithm` e `Compression_level`. Para a conexão atual, seus valores indicam o algoritmo de compressão e o nível de compressão, respectivamente.

* Para determinar quais algoritmos de compressão o servidor está configurado para permitir para conexões de entrada, verifique a variável de sistema `protocol_compression_algorithms`.

* Para conexões de replicação de fonte/replica, os algoritmos de compressão configurados e o nível de compressão estão disponíveis em várias fontes:

+ A tabela do Schema de desempenho `replication_connection_configuration` possui as colunas `COMPRESSION_ALGORITHMS` e `ZSTD_COMPRESSION_LEVEL`.

+ A tabela do sistema `mysql.slave_master_info` tem as colunas `Master_compression_algorithms` e `Master_zstd_compression_level`. Se o arquivo `master.info` existir, ele contém linhas para esses valores também.

### 6.2.9 Configuração de variáveis de ambiente

As variáveis de ambiente podem ser definidas no prompt de comando para afetar a invocação atual do seu processador de comandos, ou definidas permanentemente para afetar invocções futuras. Para definir uma variável permanentemente, você pode defini-la em um arquivo de inicialização ou usando a interface fornecida pelo seu sistema para esse propósito. Consulte a documentação do seu interpretador de comandos para detalhes específicos. A Seção 6.9, “Variáveis de Ambiente”, lista todas as variáveis de ambiente que afetam a operação do programa MySQL.

Para especificar um valor para uma variável de ambiente, use a sintaxe apropriada para o seu processador de comandos. Por exemplo, no Windows, você pode definir a variável `USER` para especificar o nome da sua conta MySQL. Para fazer isso, use esta sintaxe:

```
SET USER=your_name
```

A sintaxe no Unix depende do seu shell. Suponha que você queira especificar o número da porta TCP/IP usando a variável `MYSQL_TCP_PORT`. A sintaxe típica (como para **sh**, **ksh**, **bash**, **zsh**, e assim por diante) é a seguinte:

```
MYSQL_TCP_PORT=3306
export MYSQL_TCP_PORT
```

O primeiro comando define a variável, e o comando `export` exporta a variável para o ambiente do shell, de modo que seu valor se torne acessível ao MySQL e a outros processos.

Para **csh** e **tcsh**, use **setenv** para tornar a variável do shell disponível no ambiente:

```
setenv MYSQL_TCP_PORT 3306
```

Os comandos para definir variáveis de ambiente podem ser executados na linha de comando para produzir efeito imediatamente, mas as configurações persistem apenas até que você faça o logout. Para que as configurações produzam efeito cada vez que você faz o login, use a interface fornecida pelo seu sistema ou coloque o comando ou os comandos apropriados em um arquivo de inicialização que o interpretador de comandos lê a cada vez que ele é iniciado.

Em Windows, você pode definir variáveis de ambiente usando o Painel de Controle do Sistema (em Avançado).

No Unix, os arquivos típicos de inicialização do shell são `.bashrc` ou `.bash_profile` para **bash**, ou `.tcshrc` para **tcsh**.

Suponha que seus programas MySQL estejam instalados em `/usr/local/mysql/bin` e que você queira facilitar o acesso a esses programas. Para fazer isso, defina o valor da variável de ambiente `PATH` para incluir esse diretório. Por exemplo, se seu shell for **bash**, adicione a seguinte linha ao seu arquivo `.bashrc`:

```
PATH=${PATH}:/usr/local/mysql/bin
```

O **bash** utiliza diferentes arquivos de inicialização para shells de login e não de login, então você pode querer adicionar a configuração para `.bashrc` para shells de login e para `.bash_profile` para shells não de login para garantir que `PATH` seja definido independentemente.

Se sua concha for **tcsh**, adicione a seguinte linha ao seu arquivo `.tcshrc`:

```
setenv PATH ${PATH}:/usr/local/mysql/bin
```

Se o arquivo de inicialização apropriado não existir no seu diretório doméstico, crie-o com um editor de texto.

Após modificar o seu ajuste `PATH`, abra uma nova janela de console no Windows ou faça login novamente no Unix para que o ajuste entre em vigor.