#### 6.2.2.2 Utilização de ficheiros de opções

A maioria dos programas MySQL pode ler as opções de inicialização de arquivos de opções (às vezes chamados de arquivos de configuração).

Para determinar se um programa lê arquivos de opção, invoque-o com a opção `--help`. (Para `mysqld`, use `--verbose` e `--help`.) Se o programa lê arquivos de opção, a mensagem de ajuda indica quais arquivos ele procura e quais grupos de opções ele reconhece.

::: info Note

Um programa MySQL iniciado com a opção `--no-defaults` não lê nenhum arquivo de opção além de `.mylogin.cnf`.

Um servidor iniciado com a variável de sistema `persisted_globals_load` desativada não lê `mysqld-auto.cnf`.

:::

Muitos arquivos de opção são arquivos de texto simples, criados usando qualquer editor de texto.

- O `.mylogin.cnf` arquivo que contém opções de caminho de login. Este é um arquivo criptografado criado pelo utilitário **mysql\_config\_editor**. Veja Seção 6.6.7, mysql\_config\_editor  MySQL Configuration Utility. Um  caminho de login é um grupo de opções que permite apenas certas opções: `host`, `user`, `password`, `port` e `socket`. Programas cliente especificam qual caminho de login ler de `.mylogin.cnf` usando a `--login-path` opção.

  Para especificar um nome de arquivo de caminho de login alternativo, defina a variável de ambiente `MYSQL_TEST_LOGIN_FILE`. Esta variável é usada pelo utilitário de teste **mysql-test-run.pl**, mas também é reconhecida pelo **mysql\_config\_editor** e por clientes MySQL como `mysql`, `mysqladmin`, e assim por diante.

- O arquivo `mysqld-auto.cnf` no diretório de dados. Este arquivo em formato JSON contém configurações de variáveis persistentes do sistema. Ele é criado pelo servidor após a execução de instruções \[`SET PERSIST`] ((set-variable.html) ou \[`SET PERSIST_ONLY` ((set-variable.html). Veja Seção 7.1.9.3, Variáveis persistentes do sistema. O gerenciamento de `mysqld-auto.cnf` deve ser deixado para o servidor e não realizado manualmente.

- Ordem de processamento de ficheiros de opção

- Síntese do arquivo de opções

- Opções de inclusão de ficheiros

##### Ordem de processamento de ficheiros de opção

O MySQL procura por arquivos de opções na ordem descrita na discussão seguinte e lê qualquer que exista. Se um arquivo de opções que você deseja usar não existe, crie-o usando o método apropriado, como acabamos de discutir.

::: info Note

Para obter informações sobre os ficheiros de opções utilizados com os programas do Cluster NDB, ver Secção 25.4, "Configuração do Cluster NDB".

:::

No Windows, os programas MySQL lêem as opções de inicialização dos arquivos mostrados na tabela a seguir, na ordem especificada (os arquivos listados primeiro são lidos primeiro, os arquivos lidos mais tarde têm precedência).

**Tabela 6.1 Arquivos de opção de leitura em sistemas Windows**

<table><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Nome do ficheiro</th> <th>Propósito</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>SET PERSIST</code>]\my.ini</code>, [[PH_HTML_CODE_<code>SET PERSIST</code>]\my.cnf</code></td> <td>Opções globais</td> </tr><tr> <td>[[<code>C:\my.ini</code>]], [[<code>C:\my.cnf</code>]]</td> <td>Opções globais</td> </tr><tr> <td>[[<code><em><code>BASEDIR</code>]]</em>"Minha Ini"</code>, [[<code><em><code>BASEDIR</code>]]</em>- O meu.</code></td> <td>Opções globais</td> </tr><tr> <td>[[<code>defaults-extra-file</code>]]</td> <td>O arquivo especificado com [[<code class="option">--defaults-extra-file</code>]], se houver</td> </tr><tr> <td>[[<code><code>%APPDATA%</code>]]\MySQL\.mylogin.cnf</code></td> <td>Opções de caminho de acesso (apenas para clientes)</td> </tr><tr> <td>[[<code><em><code>DATADIR</code>]]</em>"Auto.cnf"</code></td> <td>Variaveis do sistema persistiram com [[<code>SET PERSIST</code>]] ou [[<code><code>%WINDIR%</code><code>SET PERSIST</code>] (somente servidor)</td> </tr></tbody></table>

Na tabela anterior, `%WINDIR%` representa a localização do seu diretório do Windows. Este é comumente `C:\WINDOWS`. Use o seguinte comando para determinar sua localização exata a partir do valor da variável de ambiente `WINDIR`:

```
C:\> echo %WINDIR%
```

`%APPDATA%` representa o valor do diretório de dados do aplicativo do Windows. Use o seguinte comando para determinar sua localização exata a partir do valor da variável de ambiente `APPDATA`:

```
C:\> echo %APPDATA%
```

`BASEDIR` representa o diretório de instalação base do MySQL. Quando o MySQL 8.4 foi instalado usando o MSI, este é tipicamente `C:\PROGRAMDIR\MySQL\MySQL Server 8.4` no qual `PROGRAMDIR` representa o diretório de programas (geralmente `Program Files` para versões em inglês do Windows).

Importância

Embora o MySQL Configurator coloque a maioria dos arquivos em \* `PROGRAMDIR`\*, ele instala `my.ini` no diretório `C:\ProgramData\MySQL\MySQL Server 8.4\` por padrão.

`DATADIR` representa o diretório de dados do MySQL. Como usado para encontrar `mysqld-auto.cnf`, seu valor padrão é o local do diretório de dados incorporado quando o MySQL foi compilado, mas pode ser alterado por `--datadir` especificado como uma opção de arquivo de opção ou opção de linha de comando processada antes de `mysqld-auto.cnf` ser processado.

Em sistemas Unix e Unix-like, os programas MySQL lêem as opções de inicialização dos arquivos mostrados na tabela a seguir, na ordem especificada (os arquivos listados primeiro são lidos primeiro, os arquivos lidos mais tarde têm precedência).

::: info Note

Em plataformas Unix, o MySQL ignora arquivos de configuração que são escrevíveis no mundo.

:::

**Tabela 6.2 Arquivos de opção lidos em sistemas Unix e sistemas semelhantes a Unix**

<table><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Nome do ficheiro</th> <th>Propósito</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>SET PERSIST_ONLY</code>]</td> <td>Opções globais</td> </tr><tr> <td>[[PH_HTML_CODE_<code>SET PERSIST_ONLY</code>]</td> <td>Opções globais</td> </tr><tr> <td>[[<code><em><code>SYSCONFDIR</code>]]</em>/my.cnf</code></td> <td>Opções globais</td> </tr><tr> <td>[[<code>$MYSQL_HOME/my.cnf</code>]]</td> <td>Opções específicas de servidor (apenas servidor)</td> </tr><tr> <td>[[<code>defaults-extra-file</code>]]</td> <td>O arquivo especificado com [[<code>--defaults-extra-file</code>]], se houver</td> </tr><tr> <td>[[<code>~/.my.cnf</code>]]</td> <td>Opções específicas do utilizador</td> </tr><tr> <td>[[<code>~/.mylogin.cnf</code>]]</td> <td>Opções de caminho de acesso específicas do utilizador (apenas para clientes)</td> </tr><tr> <td>[[<code><em><code>DATADIR</code>]]</em>/mysqld-auto.cnf</code></td> <td>Variaveis do sistema persistiram com [[<code>SET PERSIST</code>]] ou [[<code>SET PERSIST_ONLY</code>]] (somente servidor)</td> </tr></tbody></table>

Na tabela anterior, `~` representa o diretório inicial do usuário atual (o valor de `$HOME`).

`SYSCONFDIR` representa o diretório especificado com a `SYSCONFDIR` opção para `CMake` quando o MySQL foi construído. Por padrão, este é o diretório `etc` localizado sob o diretório de instalação compilado.

`MYSQL_HOME` é uma variável de ambiente que contém o caminho para o diretório no qual o arquivo `my.cnf` específico do servidor reside. Se `MYSQL_HOME` não estiver definido e você iniciar o servidor usando o programa **mysqld\_safe**, **mysqld\_safe** o define como `BASEDIR`, o diretório de instalação base do MySQL.

`DATADIR` representa o diretório de dados do MySQL. Como usado para encontrar `mysqld-auto.cnf`, seu valor padrão é o local do diretório de dados incorporado quando o MySQL foi compilado, mas pode ser alterado por `--datadir` especificado como uma opção de arquivo de opção ou opção de linha de comando processada antes de `mysqld-auto.cnf` ser processado.

Se várias instâncias de uma determinada opção forem encontradas, a última instância tem precedência, com uma exceção: Para `mysqld`, a *primeira* instância da opção `--user` é usada como uma precaução de segurança, para evitar que um usuário especificado em um arquivo de opção seja substituído na linha de comando.

##### Síntese do arquivo de opções

A seguinte descrição da sintaxe de arquivo de opção se aplica a arquivos que você edita manualmente. Isso exclui `.mylogin.cnf`, que é criado usando **mysql\_config\_editor** e é criptografado, e `mysqld-auto.cnf`, que o servidor cria no formato JSON.

Qualquer opção longa que possa ser dada na linha de comando ao executar um programa MySQL também pode ser dada em um arquivo de opções. Para obter a lista de opções disponíveis para um programa, execute-o com a opção `--help`. (Para `mysqld`, use `--verbose` e `--help`.)

A sintaxe para especificar opções em um arquivo de opções é semelhante à sintaxe da linha de comando (ver Seção 6.2.2.1, "Usar Opções na Linha de Comando"). No entanto, em um arquivo de opções, você omite os dois primeiros traços do nome da opção e especifica apenas uma opção por linha. Por exemplo, `--quick` e `--host=localhost` na linha de comando devem ser especificados como `quick` e `host=localhost` em linhas separadas em um arquivo de opções. Para especificar uma opção do formato `--loose-opt_name` em um arquivo de opções, escreva-a como `loose-opt_name`.

Linhas vazias em arquivos de opções são ignoradas. Linhas não vazias podem assumir qualquer uma das seguintes formas:

- `#comment`, `;comment`

  As linhas de comentário começam com `#` ou `;`. Um comentário `#` também pode começar no meio de uma linha.
- `[group]`

  `group` é o nome do programa ou grupo para o qual você deseja definir opções. Após uma linha de grupo, qualquer linha de configuração de opção se aplica ao grupo nomeado até o final do arquivo de opção ou outra linha de grupo é dada. Os nomes de grupos de opções não são sensíveis a maiúsculas e minúsculas.
- `opt_name`

  Isso é equivalente a `--opt_name` na linha de comando.
- `opt_name=value`

  Isso é equivalente a `--opt_name=value` na linha de comando. Em um arquivo de opção, você pode ter espaços ao redor do caractere `=`, algo que não é verdade na linha de comando. O valor opcionalmente pode ser encerrado dentro de aspas simples ou aspas duplas, o que é útil se o valor contiver um caractere de comentário `#`.

Os espaços iniciais e finais são automaticamente excluídos dos nomes e valores das opções.

Você pode usar as sequências de escape `\b`, `\t`, `\n`, `\r`, `\\`, e `\s` em valores de opção para representar o backspace, tab, newline, carriage return, backslash, e caracteres de espaço. Em arquivos de opção, essas regras de escape se aplicam:

- Um backslash seguido por um caractere de sequência de escape válido é convertido para o caractere representado pela sequência. Por exemplo, `\s` é convertido para um espaço.
- Um backslash não seguido por um caractere de sequência de escape válido permanece inalterado. Por exemplo, `\S` é mantido como está.

As regras precedentes significam que uma barra invertida literal pode ser dada como `\\`, ou como `\` se não for seguida por um caractere de sequência de escape válido.

As regras para sequências de escape em arquivos de opção diferem ligeiramente das regras para sequências de escape em literais de string em instruções SQL. No último contexto, se `x` não é um caractere de sequência de escape válido, `\x` torna-se `x` em vez de `\x`.

As regras de escape para valores de arquivo de opção são especialmente pertinentes para nomes de caminho do Windows, que usam `\` como separador de nome de caminho. Um separador em um nome de caminho do Windows deve ser escrito como `\\` se for seguido por um caractere de sequência de escape. Pode ser escrito como `\\` ou `\` se não for. Alternativamente, `/` pode ser usado em nomes de caminho do Windows e é tratado como `\`.

```
basedir="C:\Program Files\MySQL\MySQL Server 8.4"
basedir="C:\\Program Files\\MySQL\\MySQL Server 8.4"
basedir="C:/Program Files/MySQL/MySQL Server 8.4"
basedir=C:\\Program\sFiles\\MySQL\\MySQL\sServer\s8.4
```

Se um nome de grupo de opções é o mesmo que um nome de programa, as opções no grupo se aplicam especificamente a esse programa. Por exemplo, os grupos `[mysqld]` e `[mysql]` se aplicam ao servidor `mysqld` e ao programa cliente `mysql`, respectivamente.

O grupo de opções `[client]` é lido por todos os programas de cliente fornecidos nas distribuições MySQL (mas não por `mysqld`). Para entender como os programas de clientes de terceiros que usam a API C podem usar arquivos de opções, consulte a documentação da API C em mysql\_options ().

O grupo `[client]` permite que você especifique opções que se aplicam a todos os clientes. Por exemplo, `[client]` é o grupo apropriado para usar para especificar a senha para se conectar ao servidor. (Mas certifique-se de que o arquivo de opções é acessível apenas por si mesmo, para que outras pessoas não possam descobrir sua senha.) Certifique-se de não colocar uma opção no grupo `[client]` a menos que seja reconhecida por \* todos \* os programas de cliente que você usa. Programas que não entendem a opção param depois de exibir uma mensagem de erro se você tentar executá-los.

Por exemplo, um grupo `[client]` é mais geral porque é lido por todos os programas clientes, enquanto um grupo `[mysqldump]` é lido apenas por `mysqldump`. Opções especificadas mais tarde substituem opções especificadas anteriormente, então colocar os grupos de opções na ordem `[client]`, `[mysqldump]` permite que opções específicas do `mysqldump` substituam as opções `[client]`.

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

Para criar grupos de opções a serem lidos apenas por servidores `mysqld` de séries de versões específicas do MySQL, use grupos com nomes de `[mysqld-8.3]`, `[mysqld-8.4]`, e assim por diante. O seguinte grupo indica que a configuração `sql_mode` deve ser usada apenas por servidores do MySQL com números de versão 8.4.x:

```
[mysqld-8.4]
sql_mode=TRADITIONAL
```

##### Opções de inclusão de ficheiros

É possível usar diretivas `!include` em arquivos de opção para incluir outros arquivos de opção e `!includedir` para pesquisar diretórios específicos de arquivos de opção. Por exemplo, para incluir o arquivo `/home/mydir/myopt.cnf`, use a seguinte diretriz:

```
!include /home/mydir/myopt.cnf
```

Para pesquisar o diretório `/home/mydir` e ler os arquivos de opções encontrados lá, use esta diretiva:

```
!includedir /home/mydir
```

O MySQL não faz nenhuma garantia sobre a ordem em que os arquivos de opção no diretório são lidos.

::: info Note

Todos os arquivos a serem encontrados e incluídos usando a diretiva `!includedir` em sistemas operacionais Unix \* devem \* ter nomes de arquivos que terminam em `.cnf`.

:::

Escreva o conteúdo de um arquivo de opção incluído como qualquer outro arquivo de opção. Isto é, ele deve conter grupos de opções, cada um precedido por uma linha `[group]` que indica o programa para o qual as opções se aplicam.

Enquanto um arquivo incluído está sendo processado, apenas as opções nos grupos que o programa atual está procurando são usadas. Outros grupos são ignorados. Suponha que um arquivo `my.cnf` contém esta linha:

```
!include /home/mydir/myopt.cnf
```

E suponha que o `/home/mydir/myopt.cnf` se pareça com isto:

```
[mysqladmin]
force

[mysqld]
key_buffer_size=16M
```

Se o `my.cnf` é processado pelo `mysqld`, apenas o grupo `[mysqld]` no `/home/mydir/myopt.cnf` é usado. Se o arquivo é processado pelo `mysqladmin`, apenas o grupo `[mysqladmin]` é usado. Se o arquivo é processado por qualquer outro programa, nenhuma opção no `/home/mydir/myopt.cnf` é usada.

A diretriz `!includedir` é processada de forma semelhante, exceto que todos os arquivos de opção no diretório nomeado são lidos.

Se um arquivo de opção contém diretivas `!include` ou `!includedir`, os arquivos nomeados por essas diretivas são processados sempre que o arquivo de opção é processado, independentemente de onde eles aparecem no arquivo.

Para que as diretivas de inclusão funcionem, o caminho do arquivo não deve ser especificado entre aspas e não deve ter sequências de escape. Por exemplo, as seguintes instruções fornecidas em `my.ini` lêem o arquivo de opção `myopts.ini`:

```
!include C:/ProgramData/MySQL/MySQL Server/myopts.ini
!include C:\ProgramData\MySQL\MySQL Server\myopts.ini
!include C:\\ProgramData\\MySQL\\MySQL Server\\myopts.ini
```

No Windows, se `!include /path/to/extra.ini` é a última linha do arquivo, certifique-se de que uma nova linha é adicionada no final; caso contrário, a linha é ignorada.
