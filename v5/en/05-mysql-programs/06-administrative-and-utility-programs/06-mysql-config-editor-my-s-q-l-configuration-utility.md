### 4.6.6 mysql_config_editor — Utilitário de Configuração do MySQL

O utilitário **mysql_config_editor** permite armazenar credenciais de autenticação em um arquivo obfuscado de login path chamado `.mylogin.cnf`. A localização do arquivo é o diretório `%APPDATA%\MySQL` no Windows e o diretório *home* do usuário atual em sistemas não-Windows. O arquivo pode ser lido posteriormente por programas client do MySQL para obter credenciais de autenticação para conexão com o MySQL Server.

O formato não-obfuscado do arquivo de login path `.mylogin.cnf` consiste em *option groups* (grupos de opções), similar a outros arquivos de option. Cada *option group* em `.mylogin.cnf` é chamado de “login path,” que é um *group* que permite apenas certas options: `host`, `user`, `password`, `port` e `socket`. Pense em um *option group* de login path como um conjunto de options que especificam a qual MySQL server conectar e com qual conta autenticar. Aqui está um exemplo não-obfuscado:

```sql
[client]
user = mydefaultname
password = mydefaultpass
host = 127.0.0.1
[mypath]
user = myothername
password = myotherpass
host = localhost
```

Quando você invoca um programa client para conectar ao server, o client utiliza `.mylogin.cnf` em conjunto com outros arquivos de option. Sua precedência é maior do que a de outros arquivos de option, mas menor do que a das options especificadas explicitamente na command line do client. Para obter informações sobre a ordem na qual os arquivos de option são usados, veja Seção 4.2.2.2, “Using Option Files”.

Para especificar um nome de arquivo de login path alternativo, defina a environment variable `MYSQL_TEST_LOGIN_FILE`. Esta variable é reconhecida pelo **mysql_config_editor**, pelos clients padrão do MySQL (**mysql**, **mysqladmin**, e assim por diante), e pelo utilitário de *testing* **mysql-test-run.pl**.

Os programas usam os *groups* no arquivo de login path da seguinte forma:

* Por default, o **mysql_config_editor** opera no login path `client` se você não especificar a option `--login-path=name` para indicar explicitamente qual login path usar.

* Sem a option `--login-path`, os programas client leem os mesmos *option groups* do arquivo de login path que leem de outros arquivos de option. Considere este command:

  ```sql
  mysql
  ```

  Por default, o client **mysql** lê os *groups* `[client]` e `[mysql]` de outros arquivos de option, então ele os lê do arquivo de login path também.

* Com uma option `--login-path`, os programas client adicionalmente leem o login path nomeado do arquivo de login path. Os *option groups* lidos de outros arquivos de option permanecem os mesmos. Considere este command:

  ```sql
  mysql --login-path=mypath
  ```

  O client **mysql** lê `[client]` e `[mysql]` de outros arquivos de option, e `[client]`, `[mysql]` e `[mypath]` do arquivo de login path.

* Os programas client leem o arquivo de login path mesmo quando a option `--no-defaults` é usada, a menos que `--no-login-paths` esteja definida. Isso permite que passwords sejam especificadas de maneira mais segura do que na command line, mesmo que `--no-defaults` esteja presente.

O **mysql_config_editor** obfusca o arquivo `.mylogin.cnf` para que não possa ser lido como *cleartext* (texto simples), e seu conteúdo, quando desobfuscado por programas client, é usado apenas na memória. Desta forma, as passwords podem ser armazenadas em um arquivo em formato não-cleartext e usadas posteriormente sem nunca precisarem ser expostas na command line ou em uma environment variable. O **mysql_config_editor** fornece um command `print` para exibir o conteúdo do arquivo de login path, mas mesmo neste caso, os valores das passwords são mascarados para nunca aparecerem de forma que outros usuários possam vê-los.

A obfuscation usada pelo **mysql_config_editor** impede que as passwords apareçam no `.mylogin.cnf` como cleartext e fornece uma medida de segurança ao prevenir a exposição inadvertida da password. Por exemplo, se você exibir um arquivo de option `my.cnf` regular e não-obfuscado na tela, quaisquer passwords que ele contenha ficam visíveis para qualquer pessoa. Com o `.mylogin.cnf`, isso não acontece, mas a obfuscation utilizada provavelmente não deterá um atacante determinado e você não deve considerá-la inquebrável. Um usuário que consiga obter privilégios de administração de sistema em sua máquina para acessar seus arquivos poderia desobfuscar o arquivo `.mylogin.cnf` com algum esforço.

O arquivo de login path deve ser legível e gravável pelo usuário atual, e inacessível a outros usuários. Caso contrário, o **mysql_config_editor** o ignora, e os programas client também não o utilizam.

Invoque **mysql_config_editor** desta forma:

```sql
mysql_config_editor [program_options] command [command_options]
```

Se o arquivo de login path não existir, o **mysql_config_editor** o cria.

Os argumentos do command são fornecidos da seguinte forma:

* *`program_options`* consiste nas options gerais do **mysql_config_editor**.

* `command` indica qual ação deve ser executada no arquivo de login path `.mylogin.cnf`. Por exemplo, `set` escreve um login path no arquivo, `remove` remove um login path, e `print` exibe o conteúdo do login path.

* *`command_options`* indica quaisquer options adicionais específicas ao command, como o nome do login path e os valores a serem usados no login path.

A posição do nome do command dentro do conjunto de argumentos do programa é significativa. Por exemplo, estas command lines têm os mesmos argumentos, mas produzem resultados diferentes:

```sql
mysql_config_editor --help set
mysql_config_editor set --help
```

A primeira command line exibe uma mensagem de help geral do **mysql_config_editor** e ignora o command `set`. A segunda command line exibe uma mensagem de help específica para o command `set`.

Suponha que você deseje estabelecer um login path `client` que defina seus parâmetros de conexão default, e um login path adicional chamado `remote` para conectar-se ao MySQL server no host `remote.example.com`. Você deseja fazer login da seguinte forma:

* Por default, no server local com um user name e password de `localuser` e `localpass`

* No server remoto com um user name e password de `remoteuser` e `remotepass`

Para configurar os login paths no arquivo `.mylogin.cnf`, use os seguintes commands `set`. Digite cada command em uma única linha e insira as passwords apropriadas quando solicitado:

```sql
$> mysql_config_editor set --login-path=client
         --host=localhost --user=localuser --password
Enter password: enter password "localpass" here
$> mysql_config_editor set --login-path=remote
         --host=remote.example.com --user=remoteuser --password
Enter password: enter password "remotepass" here
```

O **mysql_config_editor** usa o login path `client` por default, então a option `--login-path=client` pode ser omitida do primeiro command sem alterar seu efeito.

Para ver o que o **mysql_config_editor** escreve no arquivo `.mylogin.cnf`, use o command `print`:

```sql
$> mysql_config_editor print --all
[client]
user = localuser
password = *****
host = localhost
[remote]
user = remoteuser
password = *****
host = remote.example.com
```

O command `print` exibe cada login path como um conjunto de linhas começando com um cabeçalho de *group* indicando o nome do login path entre colchetes, seguido pelos valores das options para o login path. Os valores das passwords são mascarados e não aparecem como cleartext.

Se você não especificar `--all` para exibir todos os login paths ou `--login-path=name` para exibir um login path nomeado, o command `print` exibe o login path `client` por default, se houver um.

Conforme mostrado no exemplo anterior, o arquivo de login path pode conter múltiplos login paths. Desta forma, o **mysql_config_editor** facilita a configuração de múltiplas “personalidades” para conectar a diferentes MySQL servers, ou para conectar a um dado server usando diferentes accounts. Qualquer um desses pode ser selecionado por nome posteriormente usando a option `--login-path` quando você invocar um programa client. Por exemplo, para conectar ao server remoto, use este command:

```sql
mysql --login-path=remote
```

Aqui, o **mysql** lê os *option groups* `[client]` e `[mysql]` de outros arquivos de option, e os *groups* `[client]`, `[mysql]` e `[remote]` do arquivo de login path.

Para conectar ao server local, use este command:

```sql
mysql --login-path=client
```

Como o **mysql** lê os login paths `client` e `mysql` por default, a option `--login-path` não adiciona nada neste caso. Esse command é equivalente a este:

```sql
mysql
```

Options lidas do arquivo de login path têm precedência sobre options lidas de outros arquivos de option. Options lidas de *groups* de login path que aparecem posteriormente no arquivo de login path têm precedência sobre options lidas de *groups* que aparecem mais cedo no arquivo.

O **mysql_config_editor** adiciona login paths ao arquivo na ordem em que você os cria, então você deve criar login paths mais gerais primeiro e paths mais específicos depois. Se você precisar mover um login path dentro do arquivo, você pode removê-lo e, em seguida, recriá-lo para adicioná-lo ao final. Por exemplo, um login path `client` é mais geral porque é lido por todos os programas client, enquanto um login path `mysqldump` é lido apenas pelo **mysqldump**. Options especificadas posteriormente substituem options especificadas anteriormente, de modo que colocar os login paths na ordem `client`, `mysqldump` permite que options específicas do **mysqldump** substituam options do `client`.

Quando você usa o command `set` com o **mysql_config_editor** para criar um login path, você não precisa especificar todos os possíveis valores de option (host name, user name, password, port, socket). Apenas os valores fornecidos são escritos no path. Quaisquer valores ausentes necessários posteriormente podem ser especificados ao invocar um client path para conectar ao MySQL server, seja em outros arquivos de option ou na command line. Quaisquer options especificadas na command line substituem aquelas especificadas no arquivo de login path ou em outros arquivos de option. Por exemplo, se as credenciais no login path `remote` também se aplicarem ao host `remote2.example.com`, conecte-se ao server nesse host desta forma:

```sql
mysql --login-path=remote --host=remote2.example.com
```

#### mysql_config_editor Options Gerais

O **mysql_config_editor** suporta as seguintes options gerais, que podem ser usadas precedendo qualquer command nomeado na command line. Para descrições de options específicas de command, veja mysql_config_editor Commands e Options Específicas do Command.

**Tabela 4.22 mysql_config_editor Options Gerais**

<table frame="box" rules="all" summary="Opções gerais de Command-line disponíveis para mysql_config_editor."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da Option</th> <th>Descrição</th> </tr></thead><tbody><tr><td>--debug</td> <td>Escreve log de debugging</td> </tr><tr><td>--help</td> <td>Exibe mensagem de help e sai</td> </tr><tr><td>--verbose</td> <td>Modo verbose</td> </tr><tr><td>--version</td> <td>Exibe informação da version e sai</td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Command Line</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibe uma mensagem de help geral e sai.

  Para ver uma mensagem de help específica do command, invoque **mysql_config_editor** da seguinte forma, onde *`command`* é um command diferente de `help`:

  ```sql
  mysql_config_editor command --help
  ```

* `--debug[=debug_options]`, `-# debug_options`

  <table frame="box" rules="all" summary="Propriedades para debug"><tbody><tr><th>Formato da Command Line</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Default</th> <td><code>d:t:o</code></td> </tr></tbody></table>

  Escreve um log de debugging. Uma string *`debug_options`* típica é `d:t:o,file_name`. O default é `d:t:o,/tmp/mysql_config_editor.trace`.

  Esta option está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Binários de release do MySQL fornecidos pela Oracle *não* são construídos usando esta option.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para verbose"><tbody><tr><th>Formato da Command Line</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Modo verbose. Imprime mais informações sobre o que o programa faz. Esta option pode ser útil no diagnóstico de problemas se uma operação não tiver o efeito esperado.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para version"><tbody><tr><th>Formato da Command Line</th> <td><code>--version</code></td> </tr></tbody></table>

  Exibe informações da version e sai.

#### mysql_config_editor Commands e Options Específicas do Command

Esta seção descreve os commands permitidos do **mysql_config_editor** e, para cada um, as options específicas do command permitidas após o nome do command na command line.

Além disso, o **mysql_config_editor** suporta options gerais que podem ser usadas precedendo qualquer command. Para descrições dessas options, veja mysql_config_editor Options Gerais.

O **mysql_config_editor** suporta estes commands:

* `help`

  Exibe uma mensagem de help geral e sai. Este command não aceita options subsequentes.

  Para ver uma mensagem de help específica do command, invoque **mysql_config_editor** da seguinte forma, onde *`command`* é um command diferente de `help`:

  ```sql
  mysql_config_editor command --help
  ```

* `print [options]`

  Imprime o conteúdo do arquivo de login path em formato não-obfuscado, com a exceção de que as passwords são exibidas como `*****`.

  O nome default do login path é `client` se nenhum login path for nomeado. Se ambos `--all` e `--login-path` forem fornecidos, `--all` tem precedência.

  O command `print` permite estas options após o nome do command:

  + `--help`, `-?`

    Exibe uma mensagem de help para o command `print` e sai.

    Para ver uma mensagem de help geral, use **mysql_config_editor --help**.

  + `--all`

    Imprime o conteúdo de todos os login paths no arquivo de login path.

  + `--login-path=name`, `-G name`

    Imprime o conteúdo do login path nomeado.

* `remove [options]`

  Remove um login path do arquivo de login path, ou modifica um login path removendo options dele.

  Este command remove do login path apenas as options especificadas com as options `--host`, `--password`, `--port`, `--socket` e `--user`. Se nenhuma dessas options for fornecida, `remove` remove o login path inteiro. Por exemplo, este command remove apenas a option `user` do login path `mypath`, e não o login path `mypath` inteiro:

  ```sql
  mysql_config_editor remove --login-path=mypath --user
  ```

  Este command remove o login path `mypath` inteiro:

  ```sql
  mysql_config_editor remove --login-path=mypath
  ```

  O command `remove` permite estas options após o nome do command:

  + `--help`, `-?`

    Exibe uma mensagem de help para o command `remove` e sai.

    Para ver uma mensagem de help geral, use **mysql_config_editor --help**.

  + `--host`, `-h`

    Remove o host name do login path.

  + `--login-path=name`, `-G name`

    O login path a ser removido ou modificado. O nome default do login path é `client` se esta option não for fornecida.

  + `--password`, `-p`

    Remove a password do login path.

  + `--port`, `-P`

    Remove o port number TCP/IP do login path.

  + `--socket`, `-S`

    Remove o nome do arquivo Unix socket do login path.

  + `--user`, `-u`

    Remove o user name do login path.

  + `--warn`, `-w`

    Alerta e solicita confirmação do usuário se o command tentar remover o login path default (`client`) e `--login-path=client` não foi especificado. Esta option é habilitada por default; use `--skip-warn` para desabilitá-la.

* `reset [options]`

  Esvazia o conteúdo do arquivo de login path.

  O command `reset` permite estas options após o nome do command:

  + `--help`, `-?`

    Exibe uma mensagem de help para o command `reset` e sai.

    Para ver uma mensagem de help geral, use **mysql_config_editor --help**.

* `set [options]`

  Escreve um login path no arquivo de login path.

  Este command escreve no login path apenas as options especificadas com as options `--host`, `--password`, `--port`, `--socket` e `--user`. Se nenhuma dessas options for fornecida, o **mysql_config_editor** escreve o login path como um *group* vazio.

  O command `set` permite estas options após o nome do command:

  + `--help`, `-?`

    Exibe uma mensagem de help para o command `set` e sai.

    Para ver uma mensagem de help geral, use **mysql_config_editor --help**.

  + `--host=host_name`, `-h host_name`

    O host name a ser escrito no login path.

  + `--login-path=name`, `-G name`

    O login path a ser criado. O nome default do login path é `client` se esta option não for fornecida.

  + `--password`, `-p`

    Solicita uma password para ser escrita no login path. Depois que o **mysql_config_editor** exibe o prompt, digite a password e pressione Enter. Para evitar que outros usuários vejam a password, o **mysql_config_editor** não a exibe (*echo*).

    Para especificar uma password vazia, pressione Enter no prompt de password. O login path resultante escrito no arquivo de login path inclui uma linha como esta:

    ```sql
    password =
    ```

  + `--port=port_num`, `-P port_num`

    O port number TCP/IP a ser escrito no login path.

  + `--socket=file_name`, `-S file_name`

    O nome do arquivo Unix socket a ser escrito no login path.

  + `--user=user_name`, `-u user_name`

    O user name a ser escrito no login path.

  + `--warn`, `-w`

    Alerta e solicita confirmação do usuário se o command tentar sobrescrever um login path existente. Esta option é habilitada por default; use `--skip-warn` para desabilitá-la.