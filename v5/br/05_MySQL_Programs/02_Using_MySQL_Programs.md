## 4.2 Usando programas MySQL

### 4.2.1 Invocação de programas MySQL

Para invocar um programa MySQL a partir da string de comando (ou seja, do seu shell ou prompt de comando), insira o nome do programa seguido de quaisquer opções ou outros argumentos necessários para instruir o programa o que você deseja que ele faça. Os seguintes comandos mostram algumas invocações de programa de exemplo. `$>` representa o prompt para o seu interpretador de comandos; ele não faz parte do que você digita. O prompt específico que você vê depende do seu interpretador de comandos. Os prompts típicos são `$` para **sh**, **ksh** ou **bash**, `%` para **csh** ou **tcsh**, e `C:\>` para os interpretadores de comandos **command.com** ou **cmd.exe** do Windows.

```sql
$> mysql --user=root test
$> mysqladmin extended-status variables
$> mysqlshow --help
$> mysqldump -u root personnel
```

Os argumentos que começam com uma barra simples ou dupla (`-`, `--`) especificam opções de programa. As opções geralmente indicam o tipo de conexão que um programa deve fazer com o servidor ou afetar seu modo operacional. A sintaxe da opção é descrita na Seção 4.2.2, “Especificando Opções de Programa”.

Os argumentos não opcionais (argumentos sem traço inicial) fornecem informações adicionais ao programa. Por exemplo, o programa **mysql** interpreta o primeiro argumento não opcional como um nome de banco de dados, portanto, o comando `mysql --user=root test` indica que você deseja usar o banco de dados `test`.

As seções posteriores que descrevem programas individuais indicam quais opções um programa suporta e descrevem o significado de quaisquer argumentos adicionais não opcionais.

Algumas opções são comuns a vários programas. As mais utilizadas são as opções `--host` (ou `-h`) `--user` (ou `-u`) e `--password` (ou `-p`) que especificam os parâmetros de conexão. Elas indicam o host onde o servidor MySQL está sendo executado e o nome de usuário e a senha da sua conta MySQL. Todos os programas clientes MySQL entendem essas opções; elas permitem que você especifique qual servidor conectar e a conta a ser usada nesse servidor. Outras opções de conexão são `--port` (ou `-P`) para especificar um número de porta TCP/IP e `--socket` (ou `-S`) para especificar um arquivo de soquete Unix em Unix (ou nome de canal nomeado em Windows). Para mais informações sobre opções que especificam opções de conexão, consulte a Seção 4.2.4, “Conectando ao servidor MySQL usando opções de comando”.

Você pode achar necessário invocar programas MySQL usando o nome do caminho para o diretório `bin` no qual eles estão instalados. Provavelmente será o caso se você receber um erro de “programa não encontrado” sempre que tentar executar um programa MySQL de qualquer diretório que não seja o diretório `bin`. Para torná-lo mais conveniente usar MySQL, você pode adicionar o nome do caminho do diretório `bin` à sua configuração da variável de ambiente `PATH`. Isso permite que você execute um programa digitando apenas seu nome, não seu nome completo. Por exemplo, se o **mysql** estiver instalado em `/usr/local/mysql/bin`, você pode executar o programa invocando-o como **mysql**, e não é necessário invocá-lo como **/usr/local/mysql/bin/mysql**.

Consulte a documentação do seu interpretador de comandos para obter instruções sobre como definir sua variável `PATH`. A sintaxe para definir variáveis de ambiente é específica do interpretador. (Algumas informações são fornecidas na Seção 4.2.7, “Definindo Variáveis de Ambiente”.) Após modificar a configuração do `PATH`, abra uma nova janela de console no Windows ou faça login novamente no Unix para que a configuração entre em vigor.

### 4.2.2 Especificando opções do programa

Existem várias maneiras de especificar opções para programas MySQL:

* Liste as opções na string de comando após o nome do programa. Isso é comum para opções que se aplicam a uma invocação específica do programa.

* Liste as opções em um arquivo de opções que o programa lê quando ele começa. Isso é comum para as opções que você deseja que o programa use a cada vez que ele é executado.

* Liste as opções nas variáveis de ambiente (consulte a Seção 4.2.7, “Definindo Variáveis de Ambiente”). Esse método é útil para opções que você deseja aplicar cada vez que o programa é executado. Na prática, os arquivos de opção são usados mais comumente para esse propósito, mas a Seção 5.7.3, “Executando múltiplas instâncias do MySQL no Unix”, discute uma situação em que as variáveis de ambiente podem ser muito úteis. Ela descreve uma técnica útil que usa tais variáveis para especificar o número de porta TCP/IP e o arquivo de soquete Unix para o servidor e para os programas cliente.

As opções são processadas em ordem, então, se uma opção for especificada várias vezes, a última ocorrência prevalece. O comando a seguir faz com que o **mysql** se conecte ao servidor que está em execução em `localhost`:

```sql
mysql -h example.com -h localhost
```

Há uma exceção: para `mysqld`, a *primeira* instância da opção `--user` é usada como uma precaução de segurança, para evitar que um usuário especificado em um arquivo de opção seja sobrescrito na string de comando.

Se forem fornecidas opções conflitantes ou relacionadas, as opções posteriores têm precedência sobre as opções anteriores. O seguinte comando executa o **mysql** no modo "sem nomes de colunas":

```sql
mysql --column-names --skip-column-names
```

Os programas do MySQL determinam quais opções são dadas primeiro, examinando variáveis de ambiente, processando arquivos de opção e, em seguida, verificando a string de comando. Como as opções posteriores têm precedência sobre as anteriores, a ordem de processamento significa que as variáveis de ambiente têm a menor precedência e as opções da string de comando a maior.

Você pode aproveitar a forma como os programas do MySQL processam as opções, especificando valores padrão de opções para um programa em um arquivo de opções. Isso permite que você evite digitar-os cada vez que você executa o programa, ao mesmo tempo em que permite que você substitua os valores padrão, se necessário, usando opções de string de comando.

#### 4.2.2.1 Usando opções na string de comando

As opções do programa especificadas na string de comando seguem estas regras:

* As opções são fornecidas após o nome do comando.
* Um argumento de opção começa com uma ou duas barras, dependendo se é uma forma curta ou longa do nome da opção. Muitas opções têm tanto formas curtas quanto longas. Por exemplo, `-?` e `--help` são as formas curta e longa da opção que instrui um programa MySQL a exibir sua mensagem de ajuda.

* Os nomes das opções são sensíveis ao caso. `-v` e `-V` são ambos legais e têm significados diferentes. (São as formas abreviadas correspondentes das opções `--verbose` e `--version`.)

* Algumas opções exigem um valor após o nome da opção. Por exemplo, `-h localhost` ou `--host=localhost` indica o host do servidor MySQL para um programa cliente. O valor da opção informa ao programa o nome do host onde o servidor MySQL está em execução.

* Para uma opção longa que recebe um valor, separe o nome da opção e o valor com um sinal `=`. Para uma opção curta que recebe um valor, o valor da opção pode seguir imediatamente a letra da opção, ou pode haver um espaço entre: `-hlocalhost` e `-h localhost` são equivalentes. Uma exceção a essa regra é a opção para especificar sua senha do MySQL. Esta opção pode ser dada em formato longo como `--password=pass_val` ou como `--password`. No último caso (sem valor de senha dado), o programa solicita interativamente a senha. A opção de senha também pode ser dada em formato curto como `-ppass_val` ou como `-p`. No entanto, para o formato curto, se o valor da senha for dado, ele deve seguir a letra da opção *sem espaço intermediário*: Se um espaço segue a letra da opção, o programa não tem como saber se um argumento subsequente é suposto ser o valor da senha ou algum outro tipo de argumento. Consequentemente, os seguintes dois comandos têm dois significados completamente diferentes:

  ```sql
  mysql -ptest
  mysql -p test
  ```

O primeiro comando instrui o **mysql** a usar um valor de senha de `test`, mas não especifica uma base de dados padrão. O segundo comando instrui o **mysql** a solicitar o valor da senha e a usar `test` como a base de dados padrão.

* Nos nomes das opções, traço (`-`) e sublinhado (`_`) podem ser usados de forma intercambiável na maioria dos casos, embora os traços iniciais *não possam* ser dados como sublinhados. Por exemplo, `--skip-grant-tables` e `--skip_grant_tables` são equivalentes.

Neste Manual, usamos travessões nos nomes das opções, exceto quando os underscores são significativos. Este é o caso, por exemplo, de `--log-bin` e `--log_bin`, que são opções diferentes. Também o incentivamos a fazer isso.

* O servidor MySQL tem certas opções de comando que podem ser especificadas apenas no início e um conjunto de variáveis do sistema, algumas das quais podem ser definidas no início, no tempo de execução ou em ambos. Os nomes das variáveis do sistema usam sublinhados em vez de travessões, e quando referenciados no tempo de execução (por exemplo, usando as declarações `SET` ou `SELECT`, devem ser escritos usando sublinhados:

  ```sql
  SET GLOBAL general_log = ON;
  SELECT @@GLOBAL.general_log;
  ```

Na inicialização do servidor, a sintaxe para as variáveis do sistema é a mesma para as opções de comando, portanto, dentro dos nomes de variáveis, travessões e sublinhados podem ser usados de forma intercambiável. Por exemplo, `--general_log=ON` e `--general-log=ON` são equivalentes. (Isso também é verdadeiro para as variáveis do sistema definidas dentro de arquivos de opção.)

* Para as opções que aceitam um valor numérico, o valor pode ser fornecido com um sufixo de `K`, `M` ou `G` (seja maiúsculo ou minúsculo) para indicar um multiplicador de 1024, 10242 ou

10243. Por exemplo, o seguinte comando informa ao **mysqladmin** para pingar o servidor 1024 vezes, dormindo 10 segundos entre cada ping:

  ```sql
  mysqladmin --count=1K --sleep=10 ping
  ```

* Ao especificar nomes de arquivos como valores de opção, evite o uso do caractere meta `~` do shell. Ele pode não ser interpretado conforme o esperado.

Os valores de opção que contêm espaços devem ser citados quando fornecidos na string de comando. Por exemplo, a opção `--execute` (ou `-e`) pode ser usada com **mysql** para passar uma ou mais declarações SQL separadas por ponto e vírgula ao servidor. Quando esta opção é usada, **mysql** executa as declarações no valor da opção e sai. As declarações devem ser fechadas com aspas. Por exemplo:

```sql
$> mysql -u root -p -e "SELECT VERSION();SELECT NOW()"
Enter password: ******
+------------+
| VERSION()  |
+------------+
| 5.7.29     |
+------------+
+---------------------+
| NOW()               |
+---------------------+
| 2019-09-03 10:36:28 |
+---------------------+
$>
```

Nota

A forma longa (`--execute`) é seguida por um sinal de igual (`=`).

Para usar valores citados em uma declaração, você deve escapar as aspas internas ou usar um tipo diferente de aspas na declaração a partir das usadas para citar a própria declaração. As capacidades do seu processador de comandos ditam suas escolhas sobre se você pode usar aspas simples ou duplas e a sintaxe para escapar caracteres de citação. Por exemplo, se o seu processador de comandos suporta a citação com aspas simples ou duplas, você pode usar aspas duplas ao redor da declaração e aspas simples para quaisquer valores citados dentro da declaração.

#### 4.2.2.2 Usando arquivos de opção

A maioria dos programas do MySQL pode ler as opções de inicialização a partir de arquivos de opção (às vezes chamados de arquivos de configuração). Os arquivos de opção fornecem uma maneira conveniente de especificar opções comumente usadas, para que elas não precisem ser inseridas na string de comando toda vez que você executa um programa.

Para determinar se um programa lê arquivos de opções, invoque-o com a opção `--help`. (Para `mysqld`, use `--verbose` e `--help`. Se o programa lê arquivos de opções, a mensagem de ajuda indica quais arquivos ele procura e quais grupos de opções ele reconhece.

Nota

Um programa do MySQL que começa com a opção `--no-defaults` não lê outros arquivos de opção além de `.mylogin.cnf`.

Muitos arquivos de opções são arquivos de texto simples, criados usando qualquer editor de texto. A exceção é o arquivo `.mylogin.cnf`, que contém opções de caminho de login. Este é um arquivo criptografado criado pelo utilitário **mysql_config_editor**. Veja a Seção 4.6.6, “mysql_config_editor — Ferramenta de Configuração do MySQL”. Um “caminho de login” é um grupo de opções que permite apenas certas opções: `host`, `user`, `password`, `port` e `socket`. Os programas cliente especificam qual caminho de login deve ser lido de `.mylogin.cnf` usando a opção `--login-path`.

Para especificar um nome alternativo de arquivo de caminho de login, defina a variável de ambiente `MYSQL_TEST_LOGIN_FILE`. Esta variável é usada pelo utilitário de teste **mysql-test-run.pl**, mas também é reconhecida pelo **mysql_config_editor** e pelos clientes MySQL, como **mysql**, **mysqladmin** e assim por diante.

O MySQL procura arquivos de opção na ordem descrita na discussão a seguir e lê quaisquer que existam. Se um arquivo de opção que você deseja usar não existir, crie-o usando o método apropriado, como foi discutido anteriormente.

Nota

Para obter informações sobre os arquivos de opção usados com os programas do NDB Cluster, consulte a Seção 21.4, “Configuração do NDB Cluster”.

* Ordem de Processamento de Arquivo de Opção
* Sintaxe do Arquivo de Opção
* Inclusões do Arquivo de Opção

##### Ordem de Processamento de Arquivo de Opção

Nos sistemas Windows, os programas do MySQL leem as opções de inicialização dos arquivos mostrados na tabela a seguir, na ordem especificada (os arquivos listados primeiro são lidos primeiro, os arquivos lidos posteriormente têm precedência).

**Tabela 4.1 Arquivos de opção lidos em sistemas Windows**

<table>
<thead>
<tr>
<th>File Name</th>
<th>Propósito</th>
</tr>
</thead>
<tbody>
<tr>
<td><code><code>%WINDIR%</code>\my.ini</code>, <code><code>%WINDIR%</code>\my.cnf</code></td>
<td>Opções globais</td>
</tr>
<tr>
<td><code>C:\my.ini</code>, <code>C:\my.cnf</code></td>
<td>Opções globais</td>
</tr>
<tr>
<td><code><code>BASEDIR</code>\my.ini</code>, <code><code>BASEDIR</code>\my.cnf</code></td>
<td>Opções globais</td>
</tr>
<tr>
<td><code>defaults-extra-file</code></td>
<td>O arquivo especificado com<code>--defaults-extra-file</code>, se houver</td>
</tr>
<tr>
<td><code><code>%APPDATA%</code>\MySQL\.mylogin.cnf</code></td>
<td>Opções de caminho de login (apenas para clientes)</td>
</tr>
</tbody>
</table>

Na tabela anterior, `%WINDIR%` representa a localização do diretório do Windows. Isso é comumente `C:\WINDOWS`. Use o seguinte comando para determinar sua localização exata a partir do valor da variável de ambiente `WINDIR`:

```sql
C:\> echo %WINDIR%
```

`%APPDATA%` representa o valor do diretório de dados do aplicativo do Windows. Use o seguinte comando para determinar sua localização exata a partir do valor da variável de ambiente `APPDATA`:

```sql
C:\> echo %APPDATA%
```

*`BASEDIR`* representa o diretório de instalação da base MySQL. Quando o MySQL 5.7 foi instalado usando o Instalador MySQL, este é tipicamente *`C:\PROGRAMDIR\MySQL\MySQL Server 5.7`* no qual *`PROGRAMDIR`* representa o diretório de programas (geralmente *`Program Files`* para versões em inglês do Windows). Veja a Seção 2.3.3, “Instalador MySQL para Windows”.

Importante

Embora o Instalador MySQL coloque a maioria dos arquivos em *`PROGRAMDIR`*, ele instala `my.ini` sob o diretório `C:\ProgramData\MySQL\MySQL Server 5.7\` por padrão.

Nos sistemas Unix e semelhantes ao Unix, os programas do MySQL leem as opções de inicialização dos arquivos mostrados na tabela a seguir, na ordem especificada (os arquivos listados primeiro são lidos primeiro, os arquivos lidos posteriormente têm precedência).

Nota

Em plataformas Unix, o MySQL ignora arquivos de configuração que são legítimos para escrita por qualquer usuário. Isso é uma medida de segurança intencional.

**Tabela 4.2 Arquivos de opção lidos em sistemas Unix e Unix-like**

<table>
<thead>
<tr>
<th>File Name</th>
<th>Propósito</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>/etc/my.cnf</code></td>
<td>Opções globais</td>
</tr>
<tr>
<td><code>/etc/mysql/my.cnf</code></td>
<td>Opções globais</td>
</tr>
<tr>
<td><code><code>SYSCONFDIR</code>/my.cnf</code></td>
<td>Opções globais</td>
</tr>
<tr>
<td><code>$MYSQL_HOME/my.cnf</code></td>
<td>Opções específicas para servidor (apenas para servidor)</td>
</tr>
<tr>
<td><code>defaults-extra-file</code></td>
<td>O arquivo especificado com<code>--defaults-extra-file</code>, se houver</td>
</tr>
<tr>
<td><code>~/.my.cnf</code></td>
<td>Opções específicas para o usuário</td>
</tr>
<tr>
<td><code>~/.mylogin.cnf</code></td>
<td>Opções de caminho de login específicas para o usuário (apenas para clientes)</td>
</tr>
</tbody>
</table>

Na tabela anterior, `~` representa o diretório de casa do usuário atual (o valor de `$HOME`).

*`SYSCONFDIR`* representa o diretório especificado com a opção `SYSCONFDIR` para o **CMake** quando o MySQL foi compilado. Por padrão, este é o diretório `etc`, localizado sob o diretório de instalação incorporado.

`MYSQL_HOME` é uma variável de ambiente que contém o caminho para o diretório em que o arquivo específico do servidor `my.cnf` reside. Se `MYSQL_HOME` não estiver definido e você iniciar o servidor usando o programa `mysqld_safe`, `mysqld_safe` define-o como *`BASEDIR`*, o diretório de instalação da base MySQL.

*`DATADIR`* é comumente `/usr/local/mysql/data`, embora isso possa variar de acordo com a plataforma ou o método de instalação. O valor é o diretório de dados construído quando o MySQL foi compilado, não a localização especificada com a opção `--datadir` quando o `mysqld` começa. O uso de `--datadir` em tempo de execução não afeta onde o servidor procura os arquivos de opção que ele lê antes de processar quaisquer opções.

Se forem encontradas várias instâncias de uma opção específica, a última instância prevalece, com uma exceção: para `mysqld`, a *primeira* instância da opção `--user` é usada como uma precaução de segurança, para evitar que um usuário especificado em um arquivo de opção seja sobrescrito na string de comando.

##### Sintaxe do arquivo de opção

A descrição a seguir sobre a sintaxe do arquivo de opção se aplica a arquivos que você edita manualmente. Isso exclui `.mylogin.cnf`, que é criado usando **mysql_config_editor** e é criptografado.

Qualquer opção longa que possa ser dada na string de comando ao executar um programa MySQL também pode ser dada em um arquivo de opções. Para obter a lista de opções disponíveis para um programa, execute-o com a opção `--help`. (Para `mysqld`, use `--verbose` e `--help`.).

A sintaxe para especificar opções em um arquivo de opções é semelhante à sintaxe de string de comando (consulte a Seção 4.2.2.1, “Usando opções na string de comando”). No entanto, em um arquivo de opções, você omite as duas barras de insígnia no início do nome da opção e especifica apenas uma opção por string. Por exemplo, `--quick` e `--host=localhost` na string de comando devem ser especificados como `quick` e `host=localhost` em strings separadas em um arquivo de opções. Para especificar uma opção na forma `--loose-opt_name` em um arquivo de opções, escreva-a como `loose-opt_name`.

Strings vazias em arquivos de opções são ignoradas. Strings não vazias podem ter qualquer uma das seguintes formas:

* `#comment`, `;comment`

As strings de comentário começam com `#` ou `;`. Uma string de comentário `#` pode começar no meio de uma string também.

* `[group]`

*`group`* é o nome do programa ou grupo para o qual você deseja definir opções. Após uma string de grupo, quaisquer strings de definição de opções se aplicam ao grupo nomeado até o final do arquivo de opções ou até que outra string de grupo seja dada. Os nomes dos grupos de opções não são sensíveis ao caso.

* `opt_name`

Isso é equivalente a `--opt_name` na string de comando.

* `opt_name=value`

Isso é equivalente a `--opt_name=value` na string de comando. Em um arquivo de opções, você pode ter espaços ao redor do caractere `=`, algo que não é verdade na string de comando. O valor opcional pode ser fechado entre aspas simples ou duplas, o que é útil se o valor contiver um caractere de comentário `#`.

Espaços de início e de fim são automaticamente excluídos dos nomes e valores das opções.

Você pode usar as sequências de escape `\b`, `\t`, `\n`, `\r`, `\\` e `\s` nos valores de opção para representar os caracteres de apagamento, tabulação, nova string, retorno de carro, barra invertida e espaço. Nos arquivos de opção, essas regras de escape se aplicam:

* Um traço seguido por um caractere de sequência de escape válido é convertido para o caractere representado pela sequência. Por exemplo, `\s` é convertido em um espaço.

* Um traço não seguido por um caractere de sequência de escape válido permanece inalterado. Por exemplo, `\S` é mantido como está.

As regras anteriores significam que um traço literal pode ser dado como `\\`, ou como `\` se não for seguido por um caractere de sequência de escape válido.

As regras para sequências de escape em arquivos de opções diferem ligeiramente das regras para sequências de escape em literais de string em declarações SQL. Neste último contexto, se “*`x`*” não for um caractere de sequência de escape válido, `\x` se torna “*`x`*” em vez de `\x`. Veja a Seção 9.1.1, “Literais de String”.

As regras de escape para os valores do arquivo de opções são especialmente relevantes para nomes de caminho do Windows, que usam `\` como um separador de nome de caminho. Um separador em um nome de caminho do Windows deve ser escrito como `\\` se for seguido por um caractere de sequência de escape. Pode ser escrito como `\\` ou `\` se não for. Alternativamente, `/` pode ser usado em nomes de caminho do Windows e é tratado como `\`. Suponha que você queira especificar um diretório base de `C:\Program Files\MySQL\MySQL Server 5.7` em um arquivo de opções. Isso pode ser feito de várias maneiras. Alguns exemplos:

```sql
basedir="C:\Program Files\MySQL\MySQL Server 5.7"
basedir="C:\\Program Files\\MySQL\\MySQL Server 5.7"
basedir="C:/Program Files/MySQL/MySQL Server 5.7"
basedir=C:\\Program\sFiles\\MySQL\\MySQL\sServer\s5.7
```

Se o nome de um grupo de opções for o mesmo que o nome de um programa, as opções do grupo se aplicam especificamente a esse programa. Por exemplo, os grupos `[mysqld]` e `[mysql]` se aplicam ao servidor `mysqld` e ao programa cliente **mysql**, respectivamente.

O grupo de opções `[client]` é lido por todos os programas cliente fornecidos nas distribuições do MySQL (mas *não* pelo `mysqld`). Para entender como os programas cliente de terceiros que usam a API C podem usar arquivos de opções, consulte a documentação da API C em mysql_options().

O grupo `[client]` permite que você especifique opções que se aplicam a todos os clientes. Por exemplo, `[client]` é o grupo apropriado para usar para especificar a senha para conectar ao servidor. (Mas certifique-se de que o arquivo de opção é acessível apenas por você, para que outras pessoas não descubram sua senha.) Certifique-se de não colocar uma opção no grupo `[client]` a menos que seja reconhecida por *todos* os programas de cliente que você usa. Os programas que não entendem a opção param após exibir uma mensagem de erro se você tentar executá-los.

Liste os grupos de opções mais gerais primeiro e os grupos mais específicos depois. Por exemplo, um grupo `[client]` é mais geral, pois é lido por todos os programas do cliente, enquanto um grupo `[mysqldump]` é lido apenas pelo **mysqldump**. As opções especificadas mais tarde substituem as opções especificadas anteriormente, então colocar os grupos de opções na ordem `[client]`, `[mysqldump]` permite que as opções específicas do **mysqldump** substituam as opções do `[client]`.

Aqui está um arquivo de opção global típico:

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

Aqui está um arquivo de opção de usuário típico:

```sql
[client]
# The following password is sent to all standard MySQL clients
password="my password"

[mysql]
no-auto-rehash
connect_timeout=2
```

Para criar grupos de opções que devem ser lidos apenas pelos servidores `mysqld` de séries específicas de lançamento do MySQL, use grupos com nomes de `[mysqld-5.6]`, `[mysqld-5.7]` e assim por diante. O seguinte grupo indica que o ajuste `sql_mode` deve ser usado apenas pelos servidores MySQL com números de versão 5.7.x:

```sql
[mysqld-5.7]
sql_mode=TRADITIONAL
```

##### Opção Inclusões de arquivo

É possível usar as diretivas `!include` em arquivos de opção para incluir outros arquivos de opção e `!includedir` para procurar diretórios específicos para arquivos de opção. Por exemplo, para incluir o arquivo `/home/mydir/myopt.cnf`, use a seguinte diretiva:

```sql
!include /home/mydir/myopt.cnf
```

Para pesquisar o diretório `/home/mydir` e ler os arquivos de opção encontrados lá, use esta diretiva:

```sql
!includedir /home/mydir
```

O MySQL não garante a ordem em que os arquivos de opção no diretório são lidos.

Nota

Quaisquer arquivos que devem ser encontrados e incluídos usando a diretiva `!includedir` em sistemas operacionais Unix *devem* ter nomes de arquivo terminando em `.cnf`. Em Windows, essa diretiva verifica arquivos com a extensão `.ini` ou `.cnf`.

Escreva o conteúdo de um arquivo de opção incluído como qualquer outro arquivo de opção. Isso significa que ele deve conter grupos de opções, cada um precedido por uma string `[group]` que indica o programa ao qual as opções se aplicam.

Enquanto um arquivo incluído está sendo processado, apenas as opções dos grupos que o programa atual está procurando são usadas. Outros grupos são ignorados. Suponha que um arquivo `my.cnf` contenha esta string:

```sql
!include /home/mydir/myopt.cnf
```

E suponha que `/home/mydir/myopt.cnf` pareça assim:

```sql
[mysqladmin]
force

[mysqld]
key_buffer_size=16M
```

Se o arquivo `my.cnf` for processado pelo `mysqld`, apenas o grupo `[mysqld]` no `/home/mydir/myopt.cnf` será utilizado. Se o arquivo for processado pelo **mysqladmin**, apenas o grupo `[mysqladmin]` será utilizado. Se o arquivo for processado por qualquer outro programa, nenhuma opção no `/home/mydir/myopt.cnf` será utilizada.

A diretiva `!includedir` é processada de forma semelhante, exceto que todos os arquivos de opção no diretório nomeado são lidos.

Se um arquivo de opções contiver diretivas `!include` ou `!includedir`, os arquivos nomeados por essas diretivas são processados sempre que o arquivo de opções é processado, independentemente de onde apareçam no arquivo.

Para que as diretivas de inclusão funcionem, o caminho do arquivo não deve ser especificado entre aspas e não deve ter sequências de escape. Por exemplo, as seguintes declarações fornecidas em `my.ini` leem o arquivo de opção `myopts.ini`:

```sql
!include C:/ProgramData/MySQL/MySQL Server/myopts.ini
!include C:\ProgramData\MySQL\MySQL Server\myopts.ini
!include C:\\ProgramData\\MySQL\\MySQL Server\\myopts.ini
```

Em Windows, se `!include /path/to/extra.ini` for a última string do arquivo, certifique-se de que uma nova string é anexada no final ou a string é ignorada.

#### 4.2.2.3 Opções de string de comando que afetam o manuseio de arquivos com Option

A maioria dos programas do MySQL que suportam arquivos de opções lida com as seguintes opções. Como essas opções afetam o manuseio de arquivos de opções, elas devem ser fornecidas na string de comando e não em um arquivo de opção. Para funcionar corretamente, cada uma dessas opções deve ser fornecida antes das outras, com essas exceções:

* `--print-defaults` pode ser usado imediatamente após `--defaults-file`, `--defaults-extra-file` ou `--login-path`.

* Em Windows, se o servidor for iniciado com as opções `--defaults-file` e `--install`, o `--install` deve ser iniciado primeiro. Veja a Seção 2.3.4.8, “Iniciando o MySQL como um Serviço do Windows”.

Ao especificar nomes de arquivos como valores de opção, evite o uso do caractere meta `~` do shell, pois ele pode não ser interpretado conforme o esperado.

**Tabela 4.3 Resumo do arquivo de opções**

<table>
<thead>
<tr>
<th>Option Name</th>
<th>Descrição</th>
</tr>
</thead>
<tbody>
<tr>
<td>--defaults-extra-file</td>
<td>Leia o arquivo de nome de opção além dos arquivos de opção usuais</td>
</tr>
<tr>
<td>--defaults-file</td>
<td>Arquivo de opção de leitura apenas nomeado</td>
</tr>
<tr>
<td>--defaults-group-suffix</td>
<td>Valor do sufixo do grupo de opções</td>
</tr>
<tr>
<td>--login-path</td>
<td>Leia as opções de caminho de login a partir de .mylogin.cnf</td>
</tr>
<tr>
<td>--no-defaults</td>
<td>Não leia arquivos de opção</td>
</tr>
</tbody>
</table>

* `--defaults-extra-file=file_name`

<table frame="box" rules="all" summary="Properties for defaults-extra-file">
<col style="width: 30%"/>
<col style="width: 70%"/>
<tbody>
<tr>
<th>Command-Line Format</th>
<td><code>--defaults-extra-file=filename</code></td>
</tr>
<tr>
<th>Type</th>
<td>File name</td>
</tr>
<tr>
<th>Default Value</th>
<td><code>[none]</code></td>
</tr>
</tbody>
</table>

Leia este arquivo de opção após o arquivo de opção global, mas (em Unix) antes do arquivo de opção do usuário e (em todas as plataformas) antes do arquivo de caminho de login. (Para informações sobre a ordem em que os arquivos de opção são usados, consulte a Seção 4.2.2.2, “Usando Arquivos de Opção”.) Se o arquivo não existir ou não for acessível, ocorre um erro. Se *`file_name`* não for um nome de caminho absoluto, ele é interpretado em relação ao diretório atual.

Veja a introdução desta seção sobre as restrições sobre a posição na qual essa opção pode ser especificada.

* `--defaults-file=file_name`

<table frame="box" rules="all" summary="Properties for defaults-file">
<col style="width: 30%"/>
<col style="width: 70%"/>
<tbody>
<tr>
<th>Command-Line Format</th>
<td><code>--defaults-file=filename</code></td>
</tr>
<tr>
<th>Type</th>
<td>File name</td>
</tr>
<tr>
<th>Default Value</th>
<td><code>[none]</code></td>
</tr>
</tbody>
</table>

Leia apenas o arquivo de opção fornecido. Se o arquivo não existir ou não for acessível, ocorrerá um erro. *`file_name`* é interpretado em relação ao diretório atual se fornecido como um nome de caminho relativo em vez de um nome de caminho completo.

Exceção: Mesmo com `--defaults-file`, os programas de cliente leem `.mylogin.cnf`.

Veja a introdução desta seção sobre as restrições sobre a posição na qual essa opção pode ser especificada.

* `--defaults-group-suffix=str`

<table frame="box" rules="all" summary="Properties for defaults-group-suffix">
<col style="width: 30%"/>
<col style="width: 70%"/>
<tbody>
<tr>
<th>Command-Line Format</th>
<td><code>--defaults-group-suffix=string</code></td>
</tr>
<tr>
<th>Type</th>
<td>String</td>
</tr>
<tr>
<th>Default Value</th>
<td><code>[none]</code></td>
</tr>
</tbody>
</table>

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, o cliente **mysql** normalmente lê os grupos `[client]` e `[mysql]`. Se esta opção for dada como `--defaults-group-suffix=_other`, o **mysql** também lê os grupos `[client_other]` e `[mysql_other]`.

* `--login-path=name`

<table frame="box" rules="all" summary="Properties for login-path">
<col style="width: 30%"/>
<col style="width: 70%"/>
<tbody>
<tr>
<th>Command-Line Format</th>
<td><code>--login-path=name</code></td>
</tr>
<tr>
<th>Type</th>
<td>String</td>
</tr>
<tr>
<th>Default Value</th>
<td><code>[none]</code></td>
</tr>
</tbody>
</table>

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário **mysql_config_editor**. Veja a Seção 4.6.6, “mysql_config_editor — Utilitário de Configuração MySQL”.

Um programa de cliente lê o grupo de opções correspondente ao caminho de login nomeado, além dos grupos de opções que o programa lê por padrão. Considere este comando:

  ```sql
  mysql --login-path=mypath
  ```

Por padrão, o cliente **mysql** lê os grupos de opções `[client]` e `[mysql]`. Portanto, para o comando mostrado, **mysql** lê `[client]` e `[mysql]` de outros arquivos de opção, e `[client]`, `[mysql]` e `[mypath]` do arquivo de caminho de login.

Os programas de cliente leem o arquivo de caminho de login mesmo quando a opção `--no-defaults` é usada.

Para especificar um nome de arquivo de caminho de login alternativo, defina a variável de ambiente `MYSQL_TEST_LOGIN_FILE`.

Veja a introdução desta seção sobre as restrições sobre a posição na qual essa opção pode ser especificada.

* `--no-defaults`
<table frame="box" rules="all" summary="Properties for no-defaults">
<col style="width: 30%"/>
<col style="width: 70%"/>
<tbody>
<tr>
<th>Command-Line Format</th>
<td><code>--no-defaults</code></td>
</tr>
<tr>
<th>Type</th>
<td>Boolean</td>
</tr>
<tr>
<th>Default Value</th>
<td><code>false</code></td>
</tr>
</tbody>
</table>

Não leia nenhum arquivo de opções. Se o início do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, `--no-defaults` pode ser usado para evitar que elas sejam lidas.

A exceção é que os programas de cliente leem o arquivo de caminho de login `.mylogin.cnf`, se ele existir, mesmo quando o `--no-defaults` é usado. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na string de comando, mesmo que o `--no-defaults` esteja presente. Para criar o `.mylogin.cnf`, use o utilitário **mysql_config_editor**. Veja a Seção 4.6.6, “mysql_config_editor — Ferramenta de Configuração do MySQL”.

* `--print-defaults`

<table frame="box" rules="all" summary="Properties for print-defaults">
<col style="width: 30%"/>
<col style="width: 70%"/>
<tbody>
<tr>
<th>Command-Line Format</th>
<td><code>--print-defaults</code></td>
</tr>
<tr>
<th>Type</th>
<td>Boolean</td>
</tr>
<tr>
<th>Default Value</th>
<td><code>false</code></td>
</tr>
</tbody>
</table>

Imprima o nome do programa e todas as opções que ele obtém a partir de arquivos de opção. Os valores da senha são mascarados.

Veja a introdução desta seção sobre as restrições sobre a posição na qual essa opção pode ser especificada.

#### 4.2.2.4 Modificadores de Opção de Programa

Algumas opções são "booleanas" e controlam o comportamento que pode ser ativado ou desativado. Por exemplo, o cliente **mysql** suporta uma opção `--column-names` que determina se deve ou não exibir uma string de nomes de colunas no início dos resultados da consulta. Por padrão, essa opção está habilitada. No entanto, você pode querer desabilitá-la em algumas situações, como ao enviar a saída do **mysql** para outro programa que espera ver apenas dados e não uma string de cabeçalho inicial.

Para desabilitar os nomes das colunas, você pode especificar a opção usando qualquer uma dessas formas:

```sql
--disable-column-names
--skip-column-names
--column-names=0
```

Os prefixos `--disable` e `--skip` e o sufixo `=0` têm o mesmo efeito: eles desativam a opção.

A forma “ativada” da opção pode ser especificada de qualquer uma dessas maneiras:

```sql
--column-names
--enable-column-names
--column-names=1
```

Os valores `ON`, `TRUE`, `OFF` e `FALSE` também são reconhecidos para opções booleanas (não sensíveis ao caso).

Se uma opção for precedida por `--loose`, um programa não sai com um erro se não reconhecer a opção, mas em vez disso, emite apenas um aviso:

```sql
$> mysql --loose-no-such-option
mysql: WARNING: unknown option '--loose-no-such-option'
```

O prefixo `--loose` pode ser útil quando você executa programas a partir de várias instalações do MySQL na mesma máquina e lista opções em um arquivo de opções. Uma opção que pode não ser reconhecida por todas as versões de um programa pode ser dada usando o prefixo `--loose` (ou `loose` em um arquivo de opções). As versões do programa que reconhecem a opção processam normalmente, e as versões que não a reconhecem emitem um aviso e a ignoram.

O prefixo `--maximum` está disponível apenas para `mysqld` e permite que um limite seja estabelecido sobre o tamanho que os programas de cliente podem definir as variáveis do sistema de sessão. Para fazer isso, use um prefixo `--maximum` com o nome da variável. Por exemplo, `--maximum-max_heap_table_size=32M` impede que qualquer cliente aumente o limite do tamanho da tabela do heap para mais de 32 M.

O prefixo `--maximum` é destinado ao uso com variáveis de sistema que possuem um valor de sessão. Se aplicado a uma variável de sistema que possui apenas um valor global, ocorre um erro. Por exemplo, com `--maximum-back_log=200`, o servidor produz este erro:

```sql
Maximum value of 'back_log' cannot be set
```

#### 4.2.2.5 Usando opções para definir variáveis de programa

Muitos programas do MySQL têm variáveis internas que podem ser definidas em tempo de execução usando a instrução `SET`. Veja a Seção 13.7.4.1, “Sintaxe de definição de variáveis”, e a Seção 5.1.8, “Usando variáveis do sistema”.

A maioria dessas variáveis de programa também pode ser definida na inicialização do servidor usando a mesma sintaxe que se aplica à especificação de opções de programa. Por exemplo, o **mysql** tem uma variável `max_allowed_packet` que controla o tamanho máximo do seu buffer de comunicação. Para definir a variável `max_allowed_packet` para o **mysql** em um valor de 16 MB, use um dos seguintes comandos:

```sql
mysql --max_allowed_packet=16777216
mysql --max_allowed_packet=16M
```

O primeiro comando especifica o valor em bytes. O segundo especifica o valor em megabytes. Para variáveis que aceitam um valor numérico, o valor pode ser dado com um sufixo de `K`, `M` ou `G` (seja maiúscula ou minúscula) para indicar um multiplicador de 1024, 10242 ou

10243. (Por exemplo, quando usado para definir `max_allowed_packet`, os sufixos indicam unidades de kilobytes, megabytes ou gigabytes).

Em um arquivo de opção, as configurações variáveis são fornecidas sem as barras de travessão no início:

```sql
[mysql]
max_allowed_packet=16777216
```

Ou:

```sql
[mysql]
max_allowed_packet=16M
```

Se desejar, os sublinhados em um nome de opção podem ser especificados como traços. Os seguintes grupos de opções são equivalentes. Ambos definem o tamanho do buffer de chave do servidor para 512 MB:

```sql
[mysqld]
key_buffer_size=512M

[mysqld]
key-buffer-size=512M
```

Em versões mais antigas do MySQL, as opções do programa podiam ser especificadas na íntegra ou como qualquer prefixo inequívoco. Por exemplo, a opção `--compress` poderia ser dada ao **mysqldump** como `--compr`, mas não como `--comp`, porque esta última é ambígua. No MySQL 5.7, os prefixos de opções não são mais suportados; apenas as opções completas são aceitas. Isso ocorre porque os prefixos podem causar problemas quando novas opções são implementadas para programas e um prefixo que atualmente é inequívoco pode se tornar ambíguo no futuro. Algumas implicações dessa mudança:

* A opção `--key-buffer` deve agora ser especificada como `--key-buffer-size`.

* A opção `--skip-grant` deve agora ser especificada como `--skip-grant-tables`.

Sufixos para especificar um multiplicador de valor podem ser usados ao definir uma variável no momento da invocação do programa, mas não para definir o valor com `SET` no tempo de execução. Por outro lado, com `SET`, você pode atribuir o valor de uma variável usando uma expressão, o que não é verdade quando você define uma variável na inicialização do servidor. Por exemplo, a primeira das strings a seguir é legal no momento da invocação do programa, mas a segunda não é:

```sql
$> mysql --max_allowed_packet=16M
$> mysql --max_allowed_packet=16*1024*1024
```

Por outro lado, a segunda das strings a seguir é legal durante a execução, mas a primeira não é:

```sql
mysql> SET GLOBAL max_allowed_packet=16M;
mysql> SET GLOBAL max_allowed_packet=16*1024*1024;
```

#### 4.2.2.6 Opções Padrão, Valores Esperados das Opções e o Sinal de Igual (=)

Por convenção, as longas formas de opções que atribuem um valor são escritas com um sinal de igual (`=`), assim:

```sql
mysql --host=tonfisk --user=jon
```

Para opções que exigem um valor (ou seja, que não têm um valor padrão), o sinal de igual não é necessário, e, portanto, o seguinte também é válido:

```sql
mysql --host tonfisk --user jon
```

Em ambos os casos, o cliente **mysql** tenta se conectar a um servidor MySQL que está em execução no host chamado “tonfisk”, usando uma conta com o nome de usuário “jon”.

Devido a esse comportamento, problemas podem ocasionalmente surgir quando não é fornecido valor para uma opção que espera um. Considere o exemplo a seguir, onde um usuário se conecta a um servidor MySQL que está em execução no host `tonfisk` como usuário `jon`:

```sql
$> mysql --host 85.224.35.45 --user jon
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 3
Server version: 5.7.44 Source distribution

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

```sql
$> mysql --host 85.224.35.45 --user
mysql: option '--user' requires an argument
```

Neste caso, o **mysql** não conseguiu encontrar um valor após a opção `--user`, porque nada veio após ela na string de comando. No entanto, se você omitir o valor para uma opção que *não* é a última opção a ser usada, você obterá um erro diferente que você pode não estar esperando:

```sql
$> mysql --host --user jon
ERROR 2005 (HY000): Unknown MySQL server host '--user' (1)
```

Porque o **mysql** assume que qualquer string que siga `--host` na string de comando é um nome de host, `--host` `--user` é interpretado como `--host=--user`, e o cliente tenta se conectar a um servidor MySQL que está em execução em um host chamado “--user”.

As opções com valores padrão sempre exigem um sinal de igual ao atribuir um valor; não fazer isso causa um erro. Por exemplo, a opção do servidor MySQL `--log-error` tem o valor padrão `host_name.err`, onde *`host_name`* é o nome do host no qual o MySQL está em execução. Suponha que você esteja executando o MySQL em um computador cujo nome de host é “tonfisk”, e considere a seguinte invocação de `mysqld_safe`:

```sql
$> mysqld_safe &
[1] 11699
$> 080112 12:53:40 mysqld_safe Logging to '/usr/local/mysql/var/tonfisk.err'.
080112 12:53:40 mysqld_safe Starting mysqld daemon with databases from /usr/local/mysql/var
$>
```

Após desligar o servidor, reinicie-o da seguinte forma:

```sql
$> mysqld_safe --log-error &
[1] 11699
$> 080112 12:53:40 mysqld_safe Logging to '/usr/local/mysql/var/tonfisk.err'.
080112 12:53:40 mysqld_safe Starting mysqld daemon with databases from /usr/local/mysql/var
$>
```

O resultado é o mesmo, uma vez que `--log-error` não é seguido por nada mais na string de comando, e fornece seu próprio valor padrão. (O caractere `&` informa ao sistema operacional que o MySQL deve ser executado em segundo plano; ele é ignorado pelo próprio MySQL.) Agora, suponha que você queira registrar erros em um arquivo chamado `my-errors.err`. Você pode tentar iniciar o servidor com `--log-error my-errors`, mas isso não tem o efeito desejado, como mostrado aqui:

```sql
$> mysqld_safe --log-error my-errors &
[1] 31357
$> 080111 22:53:31 mysqld_safe Logging to '/usr/local/mysql/var/tonfisk.err'.
080111 22:53:32 mysqld_safe Starting mysqld daemon with databases from /usr/local/mysql/var
080111 22:53:34 mysqld_safe mysqld from pid file /usr/local/mysql/var/tonfisk.pid ended

[1]+  Done                    ./mysqld_safe --log-error my-errors
```

O servidor tentou começar a usar `/usr/local/mysql/var/tonfisk.err` como o log de erro, mas depois desligou. Examinando as últimas strings desse arquivo, é possível ver a razão:

```sql
$> tail /usr/local/mysql/var/tonfisk.err
2013-09-24T15:36:22.278034Z 0 [ERROR] Too many arguments (first extra is 'my-errors').
2013-09-24T15:36:22.278059Z 0 [Note] Use --verbose --help to get a list of available options!
2013-09-24T15:36:22.278076Z 0 [ERROR] Aborting
2013-09-24T15:36:22.279704Z 0 [Note] InnoDB: Starting shutdown...
2013-09-24T15:36:23.777471Z 0 [Note] InnoDB: Shutdown completed; log sequence number 2319086
2013-09-24T15:36:23.780134Z 0 [Note] mysqld: Shutdown complete
```

Como a opção `--log-error` fornece um valor padrão, você deve usar um sinal de igual para atribuir um valor diferente a ela, como mostrado aqui:

```sql
$> mysqld_safe --log-error=my-errors &
[1] 31437
$> 080111 22:54:15 mysqld_safe Logging to '/usr/local/mysql/var/my-errors.err'.
080111 22:54:15 mysqld_safe Starting mysqld daemon with databases from /usr/local/mysql/var

$>
```

Agora, o servidor foi iniciado com sucesso e está registrando erros no arquivo `/usr/local/mysql/var/my-errors.err`.

Problemas semelhantes podem surgir ao especificar valores de opção em arquivos de opção. Por exemplo, considere um arquivo `my.cnf` que contém o seguinte:

```sql
[mysql]

host
user
```

Quando o cliente **mysql** lê este arquivo, essas entradas são analisadas como `--host` `--user` ou `--host=--user`, com o resultado mostrado aqui:

```sql
$> mysql
ERROR 2005 (HY000): Unknown MySQL server host '--user' (1)
```

No entanto, em arquivos de opção, um sinal de igual não é assumido. Suponha que o arquivo `my.cnf` esteja conforme mostrado aqui:

```sql
[mysql]

user jon
```

Tentar iniciar o **mysql** neste caso causa um erro diferente:

```sql
$> mysql
mysql: unknown option '--user jon'
```

Um erro semelhante ocorreria se você escrevesse `host tonfisk` no arquivo de opções em vez de `host=tonfisk`. Em vez disso, você deve usar o sinal de igual:

```sql
[mysql]

user=jon
```

Agora, a tentativa de login é bem-sucedida:

```sql
$> mysql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 5
Server version: 5.7.44 Source distribution

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql> SELECT USER();
+---------------+
| USER()        |
+---------------+
| jon@localhost |
+---------------+
1 row in set (0.00 sec)
```

Isso não é o mesmo comportamento que com a string de comando, onde o sinal de igual não é necessário:

```sql
$> mysql --user jon --host tonfisk
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 6
Server version: 5.7.44 Source distribution

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

### 4.2.3 Opções de comando para conectar ao servidor

Esta seção descreve as opções suportadas pela maioria dos programas clientes do MySQL que controlam como os programas clientes estabelecem conexões com o servidor e se as conexões são criptografadas. Essas opções podem ser fornecidas na string de comando ou em um arquivo de opção.

* Opções de comando para estabelecimento de conexão
* Opções de comando para conexões criptografadas

#### Opções de comando para estabelecimento de conexão

Esta seção descreve as opções que controlam a forma como os programas do cliente estabelecem conexões com o servidor. Para informações adicionais e exemplos que mostram como usá-las, consulte a Seção 4.2.4, “Conectando-se ao servidor MySQL usando opções de comando”.

**Tabela 4.4 Resumo da Opção de Estabelecimento de Conexão**

<table frame="box" rules="all" summary="Command-line options available for establishing connections to the server.">
<col style="width: 31%"/>
<col style="width: 56%"/>
<col style="width: 12%"/>
<thead>
<tr>
<th>Option Name</th>
<th>Description</th>
<th>Deprecated</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>--default</code>-auth</th>
<td>Plugin de autenticação a ser utilizado</td>
<td></td>
</tr>
<tr>
<th><code>--host</code></th>
<td>Anfitrião no qual o servidor MySQL está localizado</td>
<td></td>
</tr>
<tr>
<th><code>--password</code></th>
<td>Senha para usar ao se conectar ao servidor</td>
<td></td>
</tr>
<tr>
<th><code>--pipe</code></th>
<td>Conecte-se ao servidor usando um pipe nomeado (apenas Windows)</td>
<td></td>
</tr>
<tr>
<th><code>--plugin</code>-dir</th>
<td>Diretório onde os plugins são instalados</td>
<td></td>
</tr>
<tr>
<th><code>--port</code></th>
<td>TCP/IP port number for connection</td>
<td></td>
</tr>
<tr>
<th><code>--protocol</code></th>
<td>Protocolo de transporte a ser utilizado</td>
<td></td>
</tr>
<tr>
<th><code>--secure</code>-auth</th>
<td>Não envie senhas para o servidor no formato antigo (pré-4.1)</td>
<td>Sim</td>
</tr>
<tr>
<th><code>--shared</code>-memory-base-name</th>
<td>Nome de memória compartilhada para conexões de memória compartilhada (apenas Windows)</td>
<td></td>
</tr>
<tr>
<th><code>--socket</code></th>
<td>Arquivo de socket Unix ou pipe nomeado do Windows a ser usado</td>
<td></td>
</tr>
<tr>
<th><code>--user</code></th>
<td>Nome do usuário do MySQL a ser usado ao se conectar ao servidor</td>
<td></td>
</tr>
</tbody>
</table>

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Uma dica sobre qual plugin de autenticação do lado do cliente deve ser usado. Veja a Seção 6.2.13, “Autenticação substituível”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>

O host em que o servidor MySQL está sendo executado. O valor pode ser um nome de host, endereço IPv4 ou endereço IPv6. O valor padrão é `localhost`.

* `--password[=pass_val]`, `-p[pass_val]`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o programa de cliente solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se não for especificado nenhum tipo de senha, o padrão é não enviar senha.

Especificar uma senha na string de comando deve ser considerado inseguro. Para evitar fornecer a senha na string de comando, use um arquivo de opção. Consulte a Seção 6.1.2.1, "Diretrizes para o Usuário Final sobre Segurança de Senhas".

Para especificar explicitamente que não há senha e que o programa de cliente não deve solicitar uma senha, use a opção `--skip-password`.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for pipe"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--pipe</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

Em Windows, conecte-se ao servidor usando um pipe nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for plugin-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--plugin-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

O diretório onde procurar plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o programa cliente não o encontrar. Veja a Seção 6.2.13, “Autenticação Conectada”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for port"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--port=port_num</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>3306</code></td> </tr></tbody></table>

Para conexões TCP/IP, o número de porta a ser usado. O número de porta padrão é 3306.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for protocol"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--protocol=type</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[see text]</code></td> </tr><tr><th>Valores válidos</th> <td><code>TCP</code><code>SOCKET</code><code>PIPE</code><code>MEMORY</code></td> </tr></tbody></table>

Esta opção especifica explicitamente qual protocolo de transporte usar para se conectar ao servidor. É útil quando outros parâmetros de conexão normalmente resultam no uso de outro protocolo que não o desejado. Por exemplo, as conexões em Unix para `localhost` são feitas usando um arquivo de socket Unix por padrão:

  ```sql
  mysql --host=localhost
  ```

Para forçar o uso do transporte TCP/IP em vez disso, especifique uma opção `--protocol`:

  ```sql
  mysql --host=localhost --protocol=TCP
  ```

A tabela a seguir mostra os valores permitidos para a opção `--protocol` e indica as plataformas aplicáveis para cada valor. Os valores não são sensíveis ao caso.

  <table summary="Permissible transport protocol values, the resulting transport protocol used, and the applicable platforms for each value."><col style="width: 20%"/><col style="width: 50%"/><col style="width: 30%"/><thead><tr> <th><code>--protocol</code> Value</th> <th>Transport Protocol Used</th> <th>Applicable Platforms</th> </tr></thead><tbody><tr> <th><code>TCP</code></th> <td>TCP/IP transport to local or remote server</td> <td>All</td> </tr><tr> <th><code>SOCKET</code></th> <td>Transporte de arquivo de socket Unix para servidor local</td> <td>Unix e sistemas semelhantes ao Unix</td> </tr><tr> <th><code>PIPE</code></th> <td>Named-pipe transport to local server</td> <td>Windows</td> </tr><tr> <th><code>MEMORY</code></th> <td>Shared-memory transport to local server</td> <td>Windows</td> </tr></tbody></table>

Veja também a Seção 4.2.5, “Protocolos de Transporte de Conexão”

* `--secure-auth`

  <table frame="box" rules="all" summary="Properties for secure-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--secure-auth</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>

Não envie senhas para o servidor no formato antigo (pré-4.1). Isso impede conexões, exceto para servidores que usam o formato de senha mais recente.

A partir do MySQL 5.7.5, essa opção é desatualizada; espere que ela seja removida em um lançamento futuro do MySQL. Ela sempre está habilitada e tentar desabilitá-la (`--skip-secure-auth`, `--secure-auth=0`) produz um erro. Antes do MySQL 5.7.5, essa opção está habilitada por padrão, mas pode ser desabilitada.

Nota

As senhas que utilizam o método de hashing pré-4.1 são menos seguras do que as senhas que utilizam o método nativo de hashing de senha e devem ser evitadas. As senhas pré-4.1 são desaconselhadas e o suporte para elas foi removido no MySQL 5.7.5. Para instruções de atualização de conta, consulte a Seção 6.4.1.3, “Migrando para fora do hashing de senha pré-4.1 e do plugin mysql_old_password”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

Em Windows, o nome de memória compartilhada a ser usado para conexões feitas usando memória compartilhada a um servidor local. O valor padrão é `MYSQL`. O nome de memória compartilhada é sensível a maiúsculas e minúsculas.

Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

Em Unix, o nome do arquivo de soquete Unix a ser usado para conexões feitas usando um pipe nomeado para um servidor local. O nome padrão do arquivo de soquete Unix é `/tmp/mysql.sock`.

Em Windows, o nome do pipe nomeado a ser usado para conexões a um servidor local. O nome padrão do pipe do Windows é `MySQL`. O nome do pipe não é sensível ao caso.

Em Windows, esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

O nome de usuário da conta MySQL a ser usado para se conectar ao servidor. O nome de usuário padrão é `ODBC` no Windows ou o nome de login do Unix no Unix.

#### Opções de comando para conexões criptografadas

Esta seção descreve as opções para programas de cliente que especificam se devem usar conexões criptografadas com o servidor, os nomes dos arquivos de certificado e chave, e outros parâmetros relacionados ao suporte de conexão criptografada. Para exemplos de uso sugerido e como verificar se uma conexão é criptografada, consulte a Seção 6.3.1, “Configurando o MySQL para usar Conexões Criptografadas”.

Nota

Essas opções têm efeito apenas para conexões que utilizam um protocolo de transporte sujeito a criptografia; ou seja, conexões TCP/IP e conexões de arquivo Unix. Veja a Seção 4.2.5, “Protocolos de Transporte de Conexão”.

Para obter informações sobre o uso de conexões criptografadas da API C do MySQL, consulte Suporte para Conexões Criptografadas.

**Tabela 4.5 Resumo da opção de criptografia de conexão**

<table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

Peça ao servidor a chave pública necessária para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não se autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele terá precedência sobre `--get-server-public-key`.

Para informações sobre o plugin `caching_sha2_password`, consulte a Seção 6.4.1.4, “Cacheamento de Autenticação Alterável SHA-2”.

A opção `--get-server-public-key` foi adicionada no MySQL 5.7.23.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

O nome do caminho de um arquivo em formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senha baseada em par de chaves RSA. Esta opção se aplica a clientes que se autenticam com o plugin de autenticação `sha256_password` ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

Esta opção está disponível apenas se o MySQL foi construído usando OpenSSL.

Para informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 6.4.1.5, “Autenticação substituível SHA-256”, e a Seção 6.4.1.4, “Cache de autenticação substituível SHA-2”.

* `--ssl`, `--skip-ssl`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

Nota

A opção `--ssl` do lado do cliente é desatualizada a partir do MySQL 5.7.11 e é removida no MySQL 8.0. Para programas cliente, use `--ssl-mode` em vez disso:

+ Use `--ssl-mode=REQUIRED` em vez de `--ssl=1` ou `--enable-ssl`.

+ Use `--ssl-mode=DISABLED` em vez de `--ssl=0`, `--skip-ssl` ou `--disable-ssl`.

+ Nenhuma opção explícita `--ssl-mode` é equivalente a nenhuma opção explícita `--ssl`.

A opção `--ssl` do lado do servidor *não* é descontinuada.

Por padrão, os programas de cliente do MySQL tentam estabelecer uma conexão criptografada se o servidor suportar conexões criptografadas, com controle adicional disponível através da opção `--ssl`: A opção `--ssl` do lado do cliente funciona da seguinte forma:

+ Na ausência de uma opção `--ssl`, os clientes tentam se conectar usando criptografia, revertendo para uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida.

+ A presença de uma opção explícita `--ssl` ou um sinônimo (`--ssl=1`, `--enable-ssl`) é prescritiva: os clientes exigem uma conexão criptografada e falham se não puder ser estabelecida.

+ Com uma opção `--ssl=0` ou um sinônimo (`--skip-ssl`, `--disable-ssl`), os clientes usam uma conexão não criptografada.

Para exigir o uso de conexões criptografadas por uma conta MySQL, use `CREATE USER` para criar a conta com uma cláusula `REQUIRE SSL`, ou use `ALTER USER` para uma conta existente para adicionar uma cláusula [[`REQUIRE SSL`]. Isso faz com que as tentativas de conexão por clientes que usam a conta sejam rejeitadas, a menos que o MySQL suporte conexões criptografadas e uma conexão criptografada possa ser estabelecida.

A cláusula `REQUIRE` permite outras opções relacionadas à criptografia, que podem ser usadas para impor requisitos de segurança mais rigorosos do que `REQUIRE SSL`. Para obter informações adicionais sobre quais opções de comando podem ou devem ser especificadas por clientes que se conectam usando contas configuradas usando as várias opções `REQUIRE`, consulte Opções de SSL/TLS para CRIAR USUÁRIO.

Para especificar parâmetros adicionais para conexões criptografadas, considere definir pelo menos as variáveis de sistema `ssl_cert` e `ssl_key` no lado do servidor e a opção `--ssl-ca` no lado do cliente. Veja a Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas”, que também descreve as capacidades do servidor para autogeração e autodescoberta de certificados e arquivos de chave.

* `--ssl-ca=file_name`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA) no formato PEM. O arquivo contém uma lista de Autoridades de Certificação SSL confiáveis.

Para informar ao cliente que não autentique o certificado do servidor ao estabelecer uma conexão criptografada com o servidor, não especifique nem `--ssl-ca` nem `--ssl-capath`. O servidor ainda verifica o cliente de acordo com quaisquer requisitos aplicáveis estabelecidos para a conta do cliente e ainda usa quaisquer valores das variáveis de sistema `ssl_ca` ou `ssl_capath` especificados no lado do servidor.

Para especificar o arquivo CA para o servidor, defina a variável de sistema `ssl_ca`.

* `--ssl-capath=dir_name`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

O nome do caminho do diretório que contém os arquivos de autoridade de certificação SSL (CA) de confiança em formato PEM. O suporte para essa capacidade depende da biblioteca SSL usada para compilar o MySQL; consulte a Seção 6.3.4, “Capacidades dependentes da biblioteca SSL”.

Para informar ao cliente que não autentique o certificado do servidor ao estabelecer uma conexão criptografada com o servidor, não especifique nem `--ssl-ca` nem `--ssl-capath`. O servidor ainda verifica o cliente de acordo com quaisquer requisitos aplicáveis estabelecidos para a conta do cliente e ainda usa quaisquer valores das variáveis de sistema `ssl_ca` ou `ssl_capath` especificados no lado do servidor.

Para especificar o diretório CA do servidor, defina a variável de sistema `ssl_capath`.

* `--ssl-cert=file_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>0

O nome do caminho do arquivo de certificado público da chave SSL do cliente no formato PEM.

Para especificar o arquivo de certificado da chave pública SSL do servidor, defina a variável de sistema `ssl_cert`.

* `--ssl-cipher=cipher_list`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>1

A lista de cifra permitida para criptografia de conexão. Se nenhuma cifra na lista for suportada, as conexões criptografadas não funcionarão.

Para maior portabilidade, *`cipher_list`* deve ser uma lista de um ou mais nomes de cifra, separados por colchetes. Esse formato é compreendido tanto pelo OpenSSL quanto pelo yaSSL. Exemplos:

  ```sql
  --ssl-cipher=AES128-SHA
  --ssl-cipher=DHE-RSA-AES128-GCM-SHA256:AES128-SHA
  ```

O OpenSSL suporta uma sintaxe mais flexível para especificar cifras, conforme descrito na documentação do OpenSSL em <https://www.openssl.org/docs/manmaster/man1/ciphers.html>. O yaSSL não suporta essa sintaxe estendida, portanto, as tentativas de usar essa sintaxe estendida falham para uma distribuição do MySQL compilada usando o yaSSL.

Para obter informações sobre os cifradores de criptografia que o MySQL suporta, consulte a Seção 6.3.2, “Protocolos e cifradores de conexão criptografada TLS”.

Para especificar os cifradores de criptografia para o servidor, defina a variável de sistema `ssl_cipher`.

* `--ssl-crl=file_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>2

O nome do caminho do arquivo que contém listas de revogação de certificados no formato PEM. O suporte para a capacidade de lista de revogação depende da biblioteca SSL usada para compilar o MySQL. Veja a Seção 6.3.4, “Capacidades Dependentes da Biblioteca SSL”.

Se nem o `--ssl-crl` nem o `--ssl-crlpath` for fornecido, não serão realizadas verificações de CRL, mesmo que o caminho CA contenha listas de revogação de certificados.

Para especificar o arquivo da lista de revogação para o servidor, defina a variável de sistema `ssl_crl`.

* `--ssl-crlpath=dir_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>3

O nome do caminho do diretório que contém arquivos de lista de revogação de certificados no formato PEM. O suporte para a capacidade de lista de revogação depende da biblioteca SSL usada para compilar o MySQL. Veja a Seção 6.3.4, “Capacidades Dependentes da Biblioteca SSL”.

Se nem o `--ssl-crl` nem o `--ssl-crlpath` for fornecido, não serão realizados verificações de CRL, mesmo que o caminho CA contenha listas de revogação de certificados.

Para especificar o diretório da lista de revogação para o servidor, defina a variável de sistema `ssl_crlpath`.

* `--ssl-key=file_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>4

O nome do caminho do arquivo de chave privada SSL do cliente no formato PEM. Para maior segurança, use um certificado com um tamanho de chave RSA de pelo menos 2048 bits.

Se o arquivo de chave estiver protegido por uma senha, o programa de cliente solicitará ao usuário a senha. A senha deve ser fornecida interativamente; não pode ser armazenada em um arquivo. Se a senha estiver incorreta, o programa continuará como se não pudesse ler a chave.

Para especificar o arquivo de chave privada SSL do servidor, defina a variável de sistema `ssl_key`.

* `--ssl-mode=mode`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>5

Esta opção especifica o estado de segurança desejado da conexão com o servidor. Esses valores de modo são permitidos, em ordem de estríção crescente:

+ `DISABLED`: Estabelecer uma conexão não criptografada. Isso é como a opção `--ssl=0` ou seus sinônimos (`--skip-ssl`, `--disable-ssl`).

+ `PREFERRED`: Estabeleça uma conexão criptografada se o servidor suportar conexões criptografadas, revertendo para uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Este é o padrão se `--ssl-mode` não for especificado.

As conexões através de arquivos de socket Unix não são criptografadas com um modo de `PREFERRED`. Para impor a criptografia para conexões de arquivo de socket Unix, use um modo de `REQUIRED` ou mais rigoroso. (No entanto, o transporte de arquivo de socket é seguro por padrão, portanto, criptografar uma conexão de arquivo de socket não a torna mais segura e aumenta a carga da CPU.)

+ `REQUIRED`: Estabeleça uma conexão criptografada se o servidor suportar conexões criptografadas. A tentativa de conexão falha se uma conexão criptografada não puder ser estabelecida.

+ `VERIFY_CA`: Como `REQUIRED`, mas, adicionalmente, verifique o certificado da Autoridade de Certificação (CA) do servidor contra os certificados CA configurados. A tentativa de conexão falha se não forem encontrados certificados CA válidos que correspondam.

+ `VERIFY_IDENTITY`: Como `VERIFY_CA`, mas, adicionalmente, realize a verificação da identidade do nome do host, verificando o nome do host que o cliente usa para se conectar ao servidor contra a identidade no certificado que o servidor envia ao cliente:

- A partir do MySQL 5.7.23, se o cliente usa o OpenSSL 1.0.2 ou superior, o cliente verifica se o nome de host que ele usa para se conectar corresponde ao valor da NOME ALTERNATIVO DO OBJETO ou ao valor do NOME COMUM no certificado do servidor. A verificação da identidade do nome de host também funciona com certificados que especificam o NOME COMUM usando caracteres de ponto e vírgula.

- Caso contrário, o cliente verifica se o nome de host que ele usa para se conectar corresponde ao valor do Nome comum no certificado do servidor.

A conexão falha se houver uma incompatibilidade. Para conexões criptografadas, essa opção ajuda a prevenir ataques de homem no meio. Isso é como a opção `--ssl-verify-server-cert` do legado.

Nota

A verificação de identidade do nome do host com `VERIFY_IDENTITY` não funciona com certificados autoassinados que são criados automaticamente pelo servidor ou manualmente usando `mysql_ssl_rsa_setup` (consulte a Seção 6.3.3.1, “Criando certificados SSL e RSA e chaves usando MySQL”). Esses certificados autoassinados não contêm o nome do servidor como valor de Nome Comum.

Importante

A configuração padrão, `--ssl-mode=PREFERRED`, produz uma conexão criptografada se os outros ajustes padrão não forem alterados. No entanto, para ajudar a prevenir ataques sofisticados de homem no meio, é importante que o cliente verifique a identidade do servidor. As configurações `--ssl-mode=VERIFY_CA` e `--ssl-mode=VERIFY_IDENTITY` são uma escolha melhor do que a configuração padrão para ajudar a prevenir esse tipo de ataque. Para implementar uma dessas configurações, você deve primeiro garantir que o certificado CA do servidor esteja disponível de forma confiável para todos os clientes que o utilizam em seu ambiente, caso contrário, problemas de disponibilidade resultarão. Por essa razão, elas não são a configuração padrão.

A opção `--ssl-mode` interage com as opções de certificado CA da seguinte forma:

+ Se `--ssl-mode` não for explicitamente definido de outra forma, o uso de `--ssl-ca` ou `--ssl-capath` implica em `--ssl-mode=VERIFY_CA`.

Para os valores de `--ssl-mode` de `VERIFY_CA` ou `VERIFY_IDENTITY`, também é necessário `--ssl-ca` ou `--ssl-capath`, para fornecer um certificado CA que corresponda ao utilizado pelo servidor.

+ Uma opção explícita `--ssl-mode` com um valor diferente de `VERIFY_CA` ou `VERIFY_IDENTITY`, juntamente com uma opção explícita `--ssl-ca` ou `--ssl-capath`, produz um aviso de que não é realizada nenhuma verificação do certificado do servidor, apesar de uma opção de certificado CA ser especificada.

A opção `--ssl-mode` foi adicionada no MySQL 5.7.11.

Para exigir o uso de conexões criptografadas por uma conta MySQL, use `CREATE USER` para criar a conta com uma cláusula `REQUIRE SSL`, ou use `ALTER USER` para uma conta existente para adicionar uma cláusula `REQUIRE SSL`. Isso faz com que as tentativas de conexão por clientes que usam a conta sejam rejeitadas, a menos que o MySQL suporte conexões criptografadas e uma conexão criptografada possa ser estabelecida.

A cláusula `REQUIRE` permite outras opções relacionadas à criptografia, que podem ser usadas para impor requisitos de segurança mais rigorosos do que `REQUIRE SSL`. Para obter informações adicionais sobre quais opções de comando podem ou devem ser especificadas por clientes que se conectam usando contas configuradas usando as várias opções `REQUIRE`, consulte Opções de SSL/TLS para CRIAR USUÁRIOS.

* `--ssl-verify-server-cert`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>6

Nota

A opção `--ssl-verify-server-cert` é descontinuada a partir do MySQL 5.7.11 e é removida no MySQL 8.0. Use `--ssl-mode=VERIFY_IDENTITY` em vez disso.

Essa opção faz com que o cliente realize a verificação de identidade de nome de host, verificando o nome de host que o cliente usa para se conectar ao servidor contra a identidade no certificado que o servidor envia ao cliente:

+ A partir do MySQL 5.7.23, se o cliente usa o OpenSSL 1.0.2 ou superior, o cliente verifica se o nome de host que ele usa para se conectar corresponde ao valor da NOME ALTERNATIVO DO OBJETO ou ao valor do NOME COMUM no certificado do servidor.

+ Caso contrário, o cliente verifica se o nome de host que ele usa para se conectar corresponde ao valor do Nome comum no certificado do servidor.

A conexão falha se houver uma incompatibilidade. Para conexões criptografadas, essa opção ajuda a prevenir ataques de homem no meio. A verificação de identidade do nome do host é desativada por padrão.

Nota

A verificação de identidade do nome do host não funciona com certificados autoassinados criados automaticamente pelo servidor, ou manualmente usando `mysql_ssl_rsa_setup` (consulte Seção 6.3.3.1, “Criando certificados SSL e RSA e chaves usando MySQL”). Esses certificados autoassinados não contêm o nome do servidor como valor de Nome Comum.

A verificação de identidade do nome do host também não funciona com certificados que especificam o Nome Comum usando caracteres de ponto e vírgula, porque esse nome é comparado literalmente ao nome do servidor.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>7

Esta opção especifica os protocolos TLS que o cliente permite para conexões criptografadas. O valor é uma lista de uma ou mais versões de protocolo separadas por vírgula. Por exemplo:

  ```sql
  mysql --tls-version="TLSv1.1,TLSv1.2"
  ```

Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Os protocolos permitidos devem ser escolhidos para não deixar "buracos" na lista. Por exemplo, estes valores não têm buracos:

  ```sql
  --tls-version="TLSv1,TLSv1.1,TLSv1.2"
  --tls-version="TLSv1.1,TLSv1.2"
  --tls-version="TLSv1.2"
  ```

Esse valor tem um buraco e não deve ser usado:

  ```sql
  --tls-version="TLSv1,TLSv1.2"
  ```

Para obter mais informações, consulte a Seção 6.3.2, “Protocolos e cifras de conexão criptografada TLS”.

Essa opção foi adicionada no MySQL 5.7.10.

Para especificar quais protocolos TLS o servidor permite, defina a variável de sistema `tls_version`.

### 4.2.4 Conectando ao servidor MySQL usando opções de comando

Esta seção descreve o uso de opções de string de comando para especificar como estabelecer conexões ao servidor MySQL, para clientes como **mysql** ou **mysqldump**. Para informações adicionais se você não conseguir se conectar, consulte a Seção 6.2.17, “Soluções para problemas de conexão com MySQL”.

Para que um programa de cliente se conecte ao servidor MySQL, ele deve usar os parâmetros de conexão adequados, como o nome do host onde o servidor está sendo executado e o nome de usuário e senha da sua conta MySQL. Cada parâmetro de conexão tem um valor padrão, mas você pode substituir os valores padrão conforme necessário, usando opções de programa especificadas na string de comando ou em um arquivo de opção.

Os exemplos aqui usam o programa cliente **mysql**, mas os princípios se aplicam a outros clientes, como **mysqldump**, **mysqladmin** ou **mysqlshow**.

Este comando invoca o **mysql** sem especificar quaisquer parâmetros de conexão explícitos:

```sql
mysql
```

Como não há opções de parâmetros, os valores padrão se aplicam:

* O nome de host padrão é `localhost`. Em Unix, isso tem um significado especial, conforme descrito mais adiante.

* O nome de usuário padrão é `ODBC` no Windows ou o nome de login do Unix no Unix.

* Não é enviada senha porque nem `--password` nem `-p` foi fornecida.

* Para **mysql**, o primeiro argumento não opcional é considerado o nome do banco de dados padrão. Como não há tal argumento, **mysql** não seleciona nenhum banco de dados padrão.

Para especificar o nome do host e o nome do usuário explicitamente, bem como uma senha, forneça opções apropriadas na string de comando. Para selecionar um banco de dados padrão, adicione um argumento de nome de banco de dados. Exemplos:

```sql
mysql --host=localhost --user=myname --password=password mydb
mysql -h localhost -u myname -ppassword mydb
```

Para as opções de senha, o valor da senha é opcional:

* Se você usar a opção `--password` ou `-p` e especificar um valor de senha, não deve haver *espaço* entre `--password=` ou `-p` e a senha que o segue.

* Se você usar `--password` ou `-p`, mas não especificar um valor de senha, o programa de cliente solicitará que você insira a senha. A senha não será exibida enquanto você a digita. Isso é mais seguro do que fornecer a senha na string de comando, o que pode permitir que outros usuários em seu sistema vejam a string de senha ao executar um comando como **ps**. Veja a Seção 6.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.

* Para especificar explicitamente que não há senha e que o programa de cliente não deve solicitar uma senha, use a opção `--skip-password`.

Como mencionado anteriormente, incluir o valor da senha na string de comando é um risco de segurança. Para evitar esse risco, especifique a opção `--password` ou `-p` sem qualquer valor de senha subsequente:

```sql
mysql --host=localhost --user=myname --password mydb
mysql -h localhost -u myname -p mydb
```

Quando a opção `--password` ou `-p` é dada sem um valor de senha, o programa de cliente exibe uma solicitação e espera que você insira a senha. (Nesses exemplos, `mydb` *não* é interpretado como uma senha porque é separado da opção de senha anterior por um espaço.)

Em alguns sistemas, a rotina da biblioteca que o MySQL usa para solicitar uma senha limita automaticamente a senha a oito caracteres. Essa limitação é uma propriedade da biblioteca do sistema, não do MySQL. Internamente, o MySQL não tem nenhum limite para o comprimento da senha. Para contornar a limitação em sistemas afetados por ela, especifique sua senha em um arquivo de opção (consulte a Seção 4.2.2.2, “Usando Arquivos de Opção”). Outra solução é alterar sua senha MySQL para um valor que tenha oito ou menos caracteres, mas isso tem a desvantagem de que senhas mais curtas tendem a ser menos seguras.

Os programas do cliente determinam o tipo de conexão a ser feita da seguinte forma:

* Se o host não for especificado ou for `localhost`, ocorre uma conexão com o host local:

+ Em Windows, o cliente se conecta usando memória compartilhada, se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.

+ Em Unix, os programas do MySQL tratam o nome do host `localhost` de maneira especial, de uma forma que provavelmente é diferente do que você espera em comparação com outros programas baseados em rede: o cliente se conecta usando um arquivo de soquete Unix. A opção `--socket` ou a variável de ambiente `MYSQL_UNIX_PORT` pode ser usada para especificar o nome do soquete.

* Em Windows, se `host` é `.` (período), ou o TCP/IP não está habilitado e `--socket` não é especificado ou o host está vazio, o cliente se conecta usando um pipe nomeado, se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Se as conexões por pipe nomeado não forem suportadas ou se o usuário que está fazendo a conexão não for membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`, ocorrerá um erro.

* Caso contrário, a conexão usa TCP/IP.

A opção `--protocol` permite que você use um protocolo de transporte específico, mesmo quando outras opções normalmente resultam no uso de um protocolo diferente. Isso significa que `--protocol` especifica o protocolo de transporte explicitamente e substitui as regras anteriores, mesmo para `localhost`.

Apenas as opções de conexão que são relevantes para o protocolo de transporte selecionado são usadas ou verificadas. Outras opções de conexão são ignoradas. Por exemplo, com `--host=localhost` em Unix, o cliente tenta se conectar ao servidor local usando um arquivo de socket Unix, mesmo que uma opção `--port` ou `-P` seja dada para especificar um número de porta TCP/IP.

Para garantir que o cliente faça uma conexão TCP/IP com o servidor local, use `--host` ou `-h` para especificar um valor de nome de host de `127.0.0.1` (em vez de `localhost`), ou o endereço IP ou o nome do servidor local. Você também pode especificar explicitamente o protocolo de transporte, mesmo para `localhost`, usando a opção `--protocol=TCP`. Exemplos:

```sql
mysql --host=127.0.0.1
mysql --protocol=TCP
```

Se o servidor estiver configurado para aceitar conexões IPv6, os clientes podem se conectar ao servidor local através do IPv6 usando `--host=::1`. Veja a Seção 5.1.12, “Suporte IPv6”.

Em Windows, para forçar um cliente MySQL a usar uma conexão de canal nomeado, especifique a opção `--pipe` ou `--protocol=PIPE`, ou especifique `.` (período) como o nome do host. Se o servidor não foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões de canal nomeado ou se o usuário que faz a conexão não é membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`, ocorre um erro. Use a opção `--socket` para especificar o nome do canal se você não quiser usar o nome de canal padrão.

As conexões com servidores remotos utilizam TCP/IP. Este comando conecta-se ao servidor que está em execução no `remote.example.com` usando o número de porta padrão (3306):

```sql
mysql --host=remote.example.com
```

Para especificar um número de porta explicitamente, use a opção `--port` ou `-P`:

```sql
mysql --host=remote.example.com --port=13306
```

Você também pode especificar um número de porta para conexões a um servidor local. No entanto, como indicado anteriormente, as conexões ao `localhost` no Unix usam um arquivo de soquete por padrão, portanto, a menos que você force uma conexão TCP/IP como descrito anteriormente, qualquer opção que especifique um número de porta será ignorada.

Para este comando, o programa utiliza um arquivo de soquete no Unix e a opção `--port` é ignorada:

```sql
mysql --port=13306 --host=localhost
```

Para fazer com que o número do porto seja usado, force uma conexão TCP/IP. Por exemplo, invoque o programa de alguma das seguintes maneiras:

```sql
mysql --port=13306 --host=127.0.0.1
mysql --port=13306 --protocol=TCP
```

Para obter informações adicionais sobre as opções que controlam a forma como os programas do cliente estabelecem conexões com o servidor, consulte a Seção 4.2.3, “Opções de comando para conectar-se ao servidor”.

É possível especificar os parâmetros de conexão sem inseri-los na string de comando cada vez que você invoca um programa cliente:

* Especifique os parâmetros de conexão na seção `[client]` de um arquivo de opção. A seção relevante do arquivo pode parecer assim:

  ```sql
  [client]
  host=host_name
  user=user_name
  password=password
  ```

Para mais informações, consulte a Seção 4.2.2.2, “Usando arquivos de opção”.

* Alguns parâmetros de conexão podem ser especificados usando variáveis de ambiente. Exemplos:

+ Para especificar o host para **mysql**, use `MYSQL_HOST`.

+ Em Windows, para especificar o nome do usuário do MySQL, use `USER`.

+ Para especificar a senha, use `MYSQL_PWD`. No entanto, isso é inseguro; veja a Seção 6.1.2.1, "Diretrizes do Usuário Final para Segurança de Senhas".

Para uma lista de variáveis de ambiente suportadas, consulte a Seção 4.9, “Variáveis de Ambiente”.

### 4.2.5 Protocolos de transporte de conexão

Para os programas que utilizam a biblioteca de cliente MySQL (por exemplo, **mysql** e **mysqldump**), o MySQL suporta conexões ao servidor com base em vários protocolos de transporte: TCP/IP, soquete Unix, canal nomeado e memória compartilhada. Esta seção descreve como selecionar esses protocolos e como eles são semelhantes e diferentes.

* Seleção do protocolo de transporte
* Suporte de transporte para conexões locais e remotas
* Interpretação do localhost
* Características de criptografia e segurança
* Compressão de conexão

#### Seleção do Protocolo de Transporte

Para uma conexão específica, se o protocolo de transporte não for especificado explicitamente, ele é determinado implicitamente. Por exemplo, conexões a `localhost` resultam em uma conexão de arquivo de soquete em sistemas Unix e semelhantes a Unix, e uma conexão TCP/IP para `127.0.0.1` de outra forma. Para informações adicionais, consulte a Seção 4.2.4, “Conectando ao servidor MySQL usando opções de comando”.

Para especificar o protocolo explicitamente, use a opção de comando `--protocol`. O seguinte quadro mostra os valores permitidos para `--protocol` e indica as plataformas aplicáveis para cada valor. Os valores não são sensíveis ao caso.

<table summary="Permissible transport protocol values, the resulting transport protocol used, and the applicable platforms for each value.">
<col style="width: 20%"/>
<col style="width: 50%"/>
<col style="width: 30%"/>
<thead>
<tr>
<th><code>--protocol</code> Value</th>
<th>Transport Protocol Used</th>
<th>Applicable Platforms</th>
</tr>
</thead>
<tbody>
<tr>
<th><code>TCP</code></th>
<td>TCP/IP</td>
<td>All</td>
</tr>
<tr>
<th><code>SOCKET</code></th>
<td>arquivo de socket Unix</td>
<td>Unix e sistemas semelhantes ao Unix</td>
</tr>
<tr>
<th><code>PIPE</code></th>
<td>Named pipe</td>
<td>Windows</td>
</tr>
<tr>
<th><code>MEMORY</code></th>
<td>Shared memory</td>
<td>Windows</td>
</tr>
</tbody>
</table>

#### Suporte de transporte para conexões locais e remotas

O transporte TCP/IP suporta conexões a servidores MySQL locais ou remotos.

Os transportadores Socket-file, named-pipe e de memória compartilhada suportam conexões apenas a servidores MySQL locais. (O transportador named-pipe permite conexões remotas, mas essa capacidade não é implementada no MySQL.)

#### Interpretação de localhost

Se o protocolo de transporte não for especificado explicitamente, `localhost` é interpretado da seguinte forma:

* Em sistemas Unix e semelhantes, uma conexão com `localhost` resulta em uma conexão de arquivo de soquete.

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

Todos os protocolos de transporte estão sujeitos ao uso de compressão no tráfego entre o cliente e o servidor. Se compressão e criptografia forem usadas para uma conexão dada, a compressão ocorre antes da criptografia. Para mais informações, consulte a Seção 4.2.6, “Controle de Compressão de Conexão”.

### 4.2.6 Controle de compressão de conexão

As conexões ao servidor podem usar compressão no tráfego entre o cliente e o servidor para reduzir o número de bytes enviados pela conexão. Por padrão, as conexões não são comprimidas, mas podem ser comprimidas se o servidor e o cliente suportarem compressão.

As conexões compactadas têm origem no lado do cliente, mas afetam a carga da CPU tanto no lado do cliente quanto no do servidor, porque ambos os lados realizam operações de compactação e descompactação. Como a ativação da compactação diminui o desempenho, seus benefícios ocorrem principalmente quando há baixa largura de banda de rede, o tempo de transferência de rede domina o custo das operações de compactação e descompactação, e os conjuntos de resultados são grandes.

O controle de compressão se aplica a conexões ao servidor por programas de cliente e por servidores que participam da replicação de origem/replica. O controle de compressão não se aplica a conexões de Replicação de Grupo, conexões com o X Protocol ou conexões para tabelas `FEDERATED`.

Esses parâmetros de configuração estão disponíveis para controlar a compressão da conexão:

* Os programas do cliente suportam uma opção de string de comando `--compress` para especificar o uso de compressão para a conexão com o servidor.

* Para os programas que utilizam a API C do MySQL, habilitar a opção `MYSQL_OPT_COMPRESS` para a função `mysql_options()` especifica o uso de compressão para a conexão com o servidor.

* Para replicação de fonte/replica, habilitar a variável de sistema `slave_compressed_protocol` especifica o uso de compressão para conexões de replica da fonte.

Em cada caso, quando o uso de compressão é especificado, a conexão utiliza o algoritmo de compressão `zlib` se ambos os lados o suportarem, e, caso contrário, faz uso de uma conexão não comprimida.

### 4.2.7 Configuração de variáveis de ambiente

As variáveis de ambiente podem ser definidas no prompt de comando para afetar a invocação atual do seu processador de comandos, ou definidas permanentemente para afetar invocções futuras. Para definir uma variável permanentemente, você pode defini-la em um arquivo de inicialização ou usando a interface fornecida pelo seu sistema para esse propósito. Consulte a documentação do seu interpretador de comandos para detalhes específicos. A Seção 4.9, “Variáveis de Ambiente”, lista todas as variáveis de ambiente que afetam a operação do programa MySQL.

Para especificar um valor para uma variável de ambiente, use a sintaxe apropriada para o seu processador de comandos. Por exemplo, no Windows, você pode definir a variável `USER` para especificar o nome da sua conta MySQL. Para fazer isso, use esta sintaxe:

```sql
SET USER=your_name
```

A sintaxe no Unix depende do seu shell. Suponha que você queira especificar o número da porta TCP/IP usando a variável `MYSQL_TCP_PORT`. A sintaxe típica (como para **sh**, **ksh**, **bash**, **zsh**, e assim por diante) é a seguinte:

```sql
MYSQL_TCP_PORT=3306
export MYSQL_TCP_PORT
```

O primeiro comando define a variável, e o comando `export` exporta a variável para o ambiente do shell, de modo que seu valor se torne acessível ao MySQL e a outros processos.

Para **csh** e **tcsh**, use **setenv** para tornar a variável do shell disponível no ambiente:

```sql
setenv MYSQL_TCP_PORT 3306
```

Os comandos para definir variáveis de ambiente podem ser executados na string de comando para produzir efeito imediatamente, mas as configurações persistem apenas até que você faça o logout. Para que as configurações produzam efeito cada vez que você faz o login, use a interface fornecida pelo seu sistema ou coloque o comando ou os comandos apropriados em um arquivo de inicialização que o interpretador de comandos lê a cada vez que ele é iniciado.

Em Windows, você pode definir variáveis de ambiente usando o Painel de Controle do Sistema (em Avançado).

No Unix, os arquivos típicos de inicialização do shell são `.bashrc` ou `.bash_profile` para **bash**, ou `.tcshrc` para **tcsh**.

Suponha que seus programas MySQL estejam instalados em `/usr/local/mysql/bin` e que você queira facilitar a invocação desses programas. Para fazer isso, defina o valor da variável de ambiente `PATH` para incluir esse diretório. Por exemplo, se seu shell for **bash**, adicione a seguinte string ao seu arquivo `.bashrc`:

```sql
PATH=${PATH}:/usr/local/mysql/bin
```

O **bash** utiliza diferentes arquivos de inicialização para shells de login e não de login, então você pode querer adicionar a configuração para `.bashrc` para shells de login e para `.bash_profile` para shells não de login para garantir que `PATH` seja definido independentemente.

Se sua concha for **tcsh**, adicione a seguinte string ao seu arquivo `.tcshrc`:

```sql
setenv PATH ${PATH}:/usr/local/mysql/bin
```

Se o arquivo de inicialização apropriado não existir no seu diretório doméstico, crie-o com um editor de texto.

Após modificar a configuração do `PATH`, abra uma nova janela do console no Windows ou faça login novamente no Unix para que a configuração entre em vigor.

