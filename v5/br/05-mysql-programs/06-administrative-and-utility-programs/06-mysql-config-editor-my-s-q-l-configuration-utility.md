### 4.6.6 mysql\_config\_editor — Ferramenta de configuração do MySQL

O utilitário **mysql\_config\_editor** permite que você armazene credenciais de autenticação em um arquivo de caminho de login ofuscado chamado `.mylogin.cnf`. O local do arquivo é o diretório `%APPDATA%\MySQL` no Windows e o diretório de casa do usuário atual em sistemas que não são do Windows. O arquivo pode ser lido posteriormente por programas clientes do MySQL para obter credenciais de autenticação para se conectar ao MySQL Server.

O formato não cifrado do arquivo de caminho de login `.mylogin.cnf` consiste em grupos de opções, semelhantes a outros arquivos de opções. Cada grupo de opções em `.mylogin.cnf` é chamado de "caminho de login", que é um grupo que permite apenas certas opções: `host`, `user`, `password`, `port` e `socket`. Pense em um grupo de opções de caminho de login como um conjunto de opções que especificam qual servidor MySQL conectar e qual conta autenticar. Aqui está um exemplo não cifrado:

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

Quando você invoca um programa cliente para se conectar ao servidor, o cliente usa `.mylogin.cnf` em conjunto com outros arquivos de opção. Sua precedência é maior do que outros arquivos de opção, mas menor do que as opções especificadas explicitamente na linha de comando do cliente. Para obter informações sobre a ordem em que os arquivos de opção são usados, consulte a Seção 4.2.2.2, “Usando arquivos de opção”.

Para especificar um nome de arquivo alternativo do caminho de login, defina a variável de ambiente `MYSQL_TEST_LOGIN_FILE`. Essa variável é reconhecida pelo **mysql\_config\_editor**, pelos clientes padrão do MySQL (**mysql**, **mysqladmin** e assim por diante) e pelo utilitário de teste **mysql-test-run.pl**.

Os programas utilizam os grupos no arquivo de caminho de login da seguinte forma:

- O **mysql\_config\_editor** opera no caminho de login `client` por padrão, se você não especificar a opção `--login-path=nome` para indicar explicitamente qual caminho de login deve ser usado.

- Sem a opção `--login-path`, os programas cliente leem os mesmos grupos de opções do arquivo de caminho de login que leem de outros arquivos de opções. Considere este comando:

  ```sql
  mysql
  ```

  Por padrão, o cliente **mysql** lê os grupos `[client]` e `[mysql]` de outros arquivos de opção, então ele também os lê do arquivo de caminho de login.

- Com a opção `--login-path`, os programas cliente também leem o caminho de login nomeado do arquivo de caminho de login. As opções de leitura de outros arquivos de opções permanecem as mesmas. Considere este comando:

  ```sql
  mysql --login-path=mypath
  ```

  O cliente **mysql** lê `[client]` e `[mysql]` de outros arquivos de opção, e `[client]`, `[mysql]` e `[mypath]` do arquivo de caminho de login.

- Os programas do cliente leem o arquivo de caminho de login mesmo quando a opção `--no-defaults` é usada, a menos que `--no-login-paths` esteja definida. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo que `--no-defaults` esteja presente.

O **mysql\_config\_editor** ofusca o arquivo `.mylogin.cnf` para que ele não possa ser lido como texto claro, e seus conteúdos, quando não ofuscados por programas de cliente, são usados apenas na memória. Dessa forma, as senhas podem ser armazenadas em um arquivo em formato não claro e usadas posteriormente sem nunca precisar ser expostas na linha de comando ou em uma variável de ambiente. O **mysql\_config\_editor** fornece um comando `print` para exibir o conteúdo do arquivo de caminho de login, mas mesmo nesse caso, os valores das senhas são mascarados para nunca aparecerem de uma maneira que outros usuários possam vê-las.

A ofuscação usada pelo **mysql\_config\_editor** impede que as senhas apareçam no `.mylogin.cnf` como texto claro e oferece uma medida de segurança ao impedir a exposição acidental das senhas. Por exemplo, se você exibe um arquivo de opção `.mylogin.cnf` regular e não ofuscado na tela, quaisquer senhas que ele contenha são visíveis para qualquer pessoa. Com o `.mylogin.cnf`, isso não é verdade, mas a ofuscação usada provavelmente não impedirá um atacante determinado, e você não deve considerá-la inquebrável. Um usuário que possa obter privilégios de administração do sistema na sua máquina para acessar seus arquivos poderia ofuscar o arquivo `.mylogin.cnf` com algum esforço.

O arquivo de caminho de login deve ser legível e gravável pelo usuário atual e inacessível para outros usuários. Caso contrário, o **mysql\_config\_editor** o ignora e os programas cliente também não o usam.

Invoque o **mysql\_config\_editor** da seguinte forma:

```sql
mysql_config_editor [program_options] command [command_options]
```

Se o arquivo de caminho de login não existir, o **mysql\_config\_editor** cria-o.

Os argumentos do comando são fornecidos da seguinte forma:

- *`program_options`* consiste em opções gerais do **mysql\_config\_editor**.

- `command` indica a ação a ser realizada no arquivo de caminho de login `.mylogin.cnf`. Por exemplo, `set` escreve um caminho de login no arquivo, `remove` remove um caminho de login e `print` exibe o conteúdo do caminho de login.

- *`command_options`* indica quaisquer opções adicionais específicas do comando, como o nome do caminho de login e os valores a serem usados no caminho de login.

A posição do nome do comando dentro do conjunto de argumentos do programa é importante. Por exemplo, essas linhas de comando têm os mesmos argumentos, mas produzem resultados diferentes:

```sql
mysql_config_editor --help set
mysql_config_editor set --help
```

A primeira linha de comando exibe uma mensagem de ajuda geral do **mysql\_config\_editor** e ignora o comando `set`. A segunda linha de comando exibe uma mensagem de ajuda específica para o comando `set`.

Suponha que você queira estabelecer um caminho de login `client` que defina seus parâmetros de conexão padrão e um caminho de login adicional chamado `remote` para se conectar ao servidor MySQL hospedado em `remote.example.com`. Você deseja fazer o login da seguinte forma:

- Por padrão, para o servidor local com um nome de usuário e senha de `localuser` e `localpass`

- Para o servidor remoto com o nome de usuário e senha `remoteuser` e `remotepass`

Para configurar as caminhos de login no arquivo `.mylogin.cnf`, use os seguintes comandos `set`. Insira cada comando em uma única linha e insira as senhas apropriadas quando solicitado:

```sql
$> mysql_config_editor set --login-path=client
         --host=localhost --user=localuser --password
Enter password: enter password "localpass" here
$> mysql_config_editor set --login-path=remote
         --host=remote.example.com --user=remoteuser --password
Enter password: enter password "remotepass" here
```

O **mysql\_config\_editor** usa o caminho de login `client` por padrão, portanto, a opção `--login-path=client` pode ser omitida do primeiro comando sem alterar seu efeito.

Para ver o que o **mysql\_config\_editor** escreve no arquivo `.mylogin.cnf`, use o comando `print`:

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

O comando `print` exibe cada caminho de login como um conjunto de linhas que começam com um cabeçalho de grupo, indicando o nome do caminho de login entre colchetes, seguido pelos valores das opções para o caminho de login. Os valores da senha são mascarados e não aparecem como texto claro.

Se você não especificar `--all` para exibir todos os caminhos de login ou `--login-path=nome` para exibir um caminho de login nomeado, o comando `print` exibe o caminho de login `client` por padrão, se houver um.

Como mostrado no exemplo anterior, o arquivo de caminho de login pode conter múltiplos caminhos de login. Dessa forma, o **mysql\_config\_editor** facilita a configuração de múltiplas "personalidades" para conectar a diferentes servidores MySQL ou para conectar a um servidor específico usando diferentes contas. Qualquer um desses pode ser selecionado pelo nome posteriormente usando a opção `--login-path` ao invocar um programa cliente. Por exemplo, para se conectar ao servidor remoto, use este comando:

```sql
mysql --login-path=remote
```

Aqui, **mysql** lê os grupos de opções `[client]` e `[mysql]` de outros arquivos de opções, e os grupos `[client]`, `[mysql]` e `[remote]` do arquivo de caminho de login.

Para se conectar ao servidor local, use este comando:

```sql
mysql --login-path=client
```

Como o **mysql** lê as permissões de login `client` e `mysql` por padrão, a opção `--login-path` não adiciona nada neste caso. Esse comando é equivalente a este:

```sql
mysql
```

As opções lidas do arquivo de caminho de login têm precedência sobre as opções lidas de outros arquivos de opções. As opções lidas de grupos de caminho de login que aparecem mais tarde no arquivo de caminho de login têm precedência sobre as opções lidas de grupos que aparecem mais cedo no arquivo.

O **mysql\_config\_editor** adiciona caminhos de login ao arquivo de caminhos de login na ordem em que você os cria, então você deve criar caminhos de login mais gerais primeiro e caminhos mais específicos depois. Se você precisar mover um caminho de login dentro do arquivo, você pode removê-lo e, em seguida, recriá-lo para adicioná-lo ao final. Por exemplo, um caminho de login `client` é mais geral porque é lido por todos os programas cliente, enquanto um caminho de login `mysqldump` é lido apenas pelo **mysqldump**. As opções especificadas mais tarde substituem as opções especificadas anteriormente, então colocar os caminhos de login na ordem `client`, `mysqldump` habilita opções específicas do **mysqldump** para substituir as opções do `client`.

Quando você usa o comando `set` com o **mysql\_config\_editor** para criar um caminho de login, você não precisa especificar todos os valores possíveis das opções (nome do host, nome do usuário, senha, porta, soquete). Apenas os valores fornecidos são escritos no caminho. Quaisquer valores faltantes necessários posteriormente podem ser especificados quando você invoca um caminho de cliente para se conectar ao servidor MySQL, seja em outros arquivos de opção ou na linha de comando. Quaisquer opções especificadas na linha de comando substituem aquelas especificadas no arquivo de caminho de login ou em outros arquivos de opção. Por exemplo, se as credenciais no caminho de login `remote` também se aplicarem ao host `remote2.example.com`, conecte-se ao servidor nesse host da seguinte maneira:

```sql
mysql --login-path=remote --host=remote2.example.com
```

#### mysql\_config\_editor Opções gerais

O **mysql\_config\_editor** suporta as seguintes opções gerais, que podem ser usadas antes de qualquer comando nomeado na linha de comando. Para descrições das opções específicas de comando, consulte Comandos e Opções Específicas de Comando do mysql\_config\_editor.

**Tabela 4.22 mysql\_config\_editor Opções Gerais**

<table frame="box" rules="all" summary="Opções de linha de comando gerais disponíveis para o mysql_config_editor."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da Opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="mysql-config-editor.html#option_mysql_config_editor_debug">--debug</a></td> <td>Escreva o log de depuração</td> </tr><tr><td><a class="link" href="mysql-config-editor.html#option_mysql_config_editor_help">--help</a></td> <td>Exibir mensagem de ajuda e sair</td> </tr><tr><td><a class="link" href="mysql-config-editor.html#option_mysql_config_editor_verbose">--verbose</a></td> <td>Modo verbosos</td> </tr><tr><td><a class="link" href="mysql-config-editor.html#option_mysql_config_editor_version">--version</a></td> <td>Exibir informações da versão e sair</td> </tr></tbody></table>

- `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda geral e saia.

  Para ver uma mensagem de ajuda específica para um comando, invoque o **mysql\_config\_editor** da seguinte forma, onde *`comando`* é um comando diferente de `help`:

  ```sql
  mysql_config_editor command --help
  ```

- `--debug[=debug_options]`, `-# debug_options`

  <table frame="box" rules="all" summary="Propriedades para depuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--debug[=debug_option<code>d:t:o</code></code>]]</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>d:t:o</code>]]</td> </tr></tbody></table>

  Escreva um log de depuração. Uma string típica de *`debug_options`* é `d:t:o,nome_do_arquivo`. O padrão é `d:t:o,/tmp/mysql_config_editor.trace`.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

- `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para verbose"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--verbose</code>]]</td> </tr></tbody></table>

  Modo verbose. Imprima mais informações sobre o que o programa faz. Esta opção pode ser útil para diagnosticar problemas se uma operação não tiver o efeito esperado.

- `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para a versão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--version</code>]]</td> </tr></tbody></table>

  Exibir informações da versão e sair.

#### mysql\_config\_editor Comandos e Opções Específicas de Comando

Esta seção descreve os comandos permitidos do **mysql\_config\_editor** e, para cada um deles, as opções específicas do comando permitidas após o nome do comando na linha de comando.

Além disso, o **mysql\_config\_editor** suporta opções gerais que podem ser usadas antes de qualquer comando. Para obter descrições dessas opções, consulte Opções Gerais do mysql\_config\_editor.

O **mysql\_config\_editor** suporta esses comandos:

- `ajuda`

  Exibir uma mensagem de ajuda geral e sair. Este comando não aceita opções adicionais.

  Para ver uma mensagem de ajuda específica para um comando, invoque o **mysql\_config\_editor** da seguinte forma, onde *`comando`* é um comando diferente de `help`:

  ```sql
  mysql_config_editor command --help
  ```

- `imprimir [opções]`

  Imprima o conteúdo do arquivo de caminho de login na forma não obfuscada, com exceção de que as senhas são exibidas como `*****`.

  O nome padrão do caminho de login é `client` se nenhum caminho de login for nomeado. Se `--all` e `--login-path` forem fornecidos, `--all` tem precedência.

  O comando `print` permite essas opções após o nome do comando:

  - `--help`, `-?`

    Exiba uma mensagem de ajuda para o comando `print` e saia.

    Para ver uma mensagem de ajuda geral, use **mysql\_config\_editor --help**.

  - `--all`

    Imprima o conteúdo de todos os caminhos de login no arquivo de caminhos de login.

  - `--login-path=nome`, `-G nome`

    Imprima o conteúdo do caminho de login nomeado.

- `remover [opções]`

  Remova um caminho de login do arquivo de caminhos de login ou modifique um caminho de login removendo opções dele.

  Este comando remove do caminho de login apenas as opções especificadas com as opções `--host`, `--password`, `--port`, `--socket` e `--user`. Se nenhuma dessas opções for fornecida, o `remove` remove todo o caminho de login `mypath`. Por exemplo, este comando remove apenas a opção `user` do caminho de login `mypath`, em vez de todo o caminho de login `mypath`:

  ```sql
  mysql_config_editor remove --login-path=mypath --user
  ```

  Este comando remove o caminho de login `mypath` inteiro:

  ```sql
  mysql_config_editor remove --login-path=mypath
  ```

  O comando `remove` permite essas opções após o nome do comando:

  - `--help`, `-?`

    Exiba uma mensagem de ajuda para o comando `remove` e saia.

    Para ver uma mensagem de ajuda geral, use **mysql\_config\_editor --help**.

  - `--host`, `-h`

    Remova o nome do host do caminho de login.

  - `--login-path=nome`, `-G nome`

    O caminho de login para remover ou modificar. O nome padrão do caminho de login é `client` se esta opção não for fornecida.

  - `--password`, `-p`

    Remova a senha do caminho de login.

  - `--port`, `-P`

    Remova o número da porta TCP/IP do caminho de login.

  - `--socket`, `-S`

    Remova o nome do arquivo de soquete Unix do caminho de login.

  - `--user`, `-u`

    Remova o nome do usuário do caminho de login.

  - `--warn`, `-w`

    Avise e peça confirmação ao usuário se o comando tentar remover o caminho de login padrão (`client`) e a opção `--login-path=client` não for especificada. Esta opção está habilitada por padrão; use `--skip-warn` para desabilitá-la.

- `reset [opções]`

  Esvazie o conteúdo do arquivo de caminho de login.

  O comando `reset` permite essas opções após o nome do comando:

  - `--help`, `-?`

    Exiba uma mensagem de ajuda para o comando `reset` e saia.

    Para ver uma mensagem de ajuda geral, use **mysql\_config\_editor --help**.

- `set [opções]`

  Escreva um caminho de login para o arquivo de caminho de login.

  Este comando escreve no caminho de login apenas as opções especificadas nas opções `--host`, `--password`, `--port`, `--socket` e `--user`. Se nenhuma dessas opções for fornecida, o **mysql\_config\_editor** escreve o caminho de login como um grupo vazio.

  O comando `set` permite essas opções após o nome do comando:

  - `--help`, `-?`

    Exiba uma mensagem de ajuda para o comando `set` e saia.

    Para ver uma mensagem de ajuda geral, use **mysql\_config\_editor --help**.

  - `--host=host_name`, `-h host_name`

    O nome do host para escrever no caminho de login.

  - `--login-path=nome`, `-G nome`

    O caminho de login para criar. O nome padrão do caminho de login é `client` se esta opção não for fornecida.

  - `--password`, `-p`

    Solicitar uma senha para gravar no caminho de login. Após o **mysql\_config\_editor** exibir o prompt, digite a senha e pressione Enter. Para evitar que outros usuários vejam a senha, o **mysql\_config\_editor** não a exibe.

    Para especificar uma senha vazia, pressione Enter na prompt de senha. O caminho de login resultante, escrito no arquivo de caminho de login, inclui uma linha como esta:

    ```sql
    password =
    ```

  - `--port=port_num`, `-P port_num`

    O número de porta TCP/IP para escrever no caminho de login.

  - `--socket=nome_arquivo`, `-S nome_arquivo`

    O nome do arquivo de socket Unix para gravar no caminho de login.

  - `--user=user_name`, `-u user_name`

    O nome de usuário para escrever na rota de login.

  - `--warn`, `-w`

    Avise e peça confirmação ao usuário se o comando tentar sobrescrever um caminho de login existente. Esta opção está habilitada por padrão; use `--skip-warn` para desabilitá-la.
