### 6.6.7 mysql\_config\_editor  Utilidade de configuração MySQL

O utilitário **mysql\_config\_editor** permite que você armazene credenciais de autenticação em um arquivo de caminho de login ofuscado chamado `.mylogin.cnf`. O local do arquivo é o diretório `%APPDATA%\MySQL` no Windows e o diretório inicial do usuário atual em sistemas não Windows. O arquivo pode ser lido mais tarde por programas cliente MySQL para obter credenciais de autenticação para se conectar ao MySQL Server.

O formato não ofuscado do arquivo `.mylogin.cnf` de caminho de login consiste em grupos de opções, semelhantes a outros arquivos de opções. Cada grupo de opções em `.mylogin.cnf` é chamado de  caminho de login, que é um grupo que permite apenas certas opções: `host`, `user`, `password`, `port` e `socket`.

```
[client]
user = mydefaultname
password = mydefaultpass
host = 127.0.0.1
[mypath]
user = myothername
password = myotherpass
host = localhost
```

Quando você invoca um programa cliente para se conectar ao servidor, o cliente usa `.mylogin.cnf` em conjunto com outros arquivos de opção. Sua precedência é maior do que outros arquivos de opção, mas menor do que as opções especificadas explicitamente na linha de comando do cliente. Para informações sobre a ordem em que os arquivos de opção são usados, consulte a Seção 6.2.2.2, Using Option Files.

Para especificar um nome de arquivo de caminho de login alternativo, defina a variável de ambiente `MYSQL_TEST_LOGIN_FILE`. Esta variável é reconhecida pelo **mysql\_config\_editor**, pelos clientes padrão do MySQL (`mysql`, `mysqladmin`, e assim por diante), e pelo utilitário de teste **mysql-test-run.pl**.

Os programas usam grupos no arquivo de caminho de login da seguinte forma:

- **mysql\_config\_editor** opera no caminho de login `client` por padrão se você não especificar nenhuma opção `--login-path=name` para indicar explicitamente qual caminho de login usar.
- Sem uma opção `--login-path`, os programas cliente lêem os mesmos grupos de opções do arquivo de caminho de login que eles lêem de outros arquivos de opções. Considere este comando:

  ```
  mysql
  ```

  Por padrão, o cliente `mysql` lê os grupos `[client]` e `[mysql]` de outros arquivos de opções, então ele também os lê do arquivo de caminho de login.
- Com uma `--login-path` opção, os programas cliente adicionalmente ler o caminho de login nomeado a partir do arquivo de caminho de login. Os grupos de opções de leitura de outros arquivos de opção permanecem os mesmos. Considere este comando:

  ```
  mysql --login-path=mypath
  ```

  O cliente `mysql` lê `[client]` e `[mysql]` de outros arquivos de opção, e `[client]`, `[mysql]`, e `[mypath]` do arquivo de caminho de login.
- Os programas cliente lêem o arquivo de caminho de login mesmo quando a opção `--no-defaults` é usada, a menos que `--no-login-paths` esteja definido. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo que `--no-defaults` esteja presente.

**mysql\_config\_editor** ofusca o arquivo `.mylogin.cnf` para que ele não possa ser lido como texto claro, e seu conteúdo quando desobfuscado por programas clientes é usado apenas na memória. Desta forma, as senhas podem ser armazenadas em um arquivo em formato não-texto claro e usadas mais tarde sem precisar ser expostas na linha de comando ou em uma variável de ambiente. **mysql\_config\_editor** fornece um comando `print` para exibir o conteúdo do arquivo de caminho de login, mas mesmo nesse caso, os valores de senha são mascarados para nunca aparecerem de maneira que outros usuários possam vê-los.

A ofuscação usada pelo **mysql\_config\_editor** impede que as senhas apareçam no `.mylogin.cnf` como texto claro e fornece uma medida de segurança, impedindo a exposição inadvertida de senhas. Por exemplo, se você exibir um arquivo de opção `my.cnf` regular e não ofuscado na tela, qualquer senha que ele contenha será visível para qualquer pessoa ver. Com o `.mylogin.cnf`, isso não é verdade, mas a ofuscação usada não é provável que dissuada um atacante determinado e você não deve considerá-la inquebrável. Um usuário que possa obter privilégios de administração do sistema em sua máquina para acessar seus arquivos poderia desobstruir o arquivo `.mylogin.cnf` com algum esforço.

O arquivo de caminho de login deve ser legível e escrevível para o usuário atual, e inacessível para outros usuários. Caso contrário, **mysql\_config\_editor** o ignora, e os programas do cliente também não o usam.

Invocar **mysql\_config\_editor** assim:

```
mysql_config_editor [program_options] command [command_options]
```

Se o arquivo de caminho de login não existir, **mysql\_config\_editor** cria-o.

Os argumentos de comando são os seguintes:

- `program_options` consiste em opções gerais **mysql\_config\_editor**.
- `command` indica a ação a ser executada no arquivo `.mylogin.cnf` de caminho de login. Por exemplo, `set` escreve um caminho de login para o arquivo, `remove` remove um caminho de login, e `print` exibe o conteúdo do caminho de login.
- `command_options` indica quaisquer opções adicionais específicas do comando, como o nome do caminho de login e os valores a serem usados no caminho de login.

A posição do nome do comando dentro do conjunto de argumentos do programa é significativa. Por exemplo, estas linhas de comando têm os mesmos argumentos, mas produzem resultados diferentes:

```
mysql_config_editor --help set
mysql_config_editor set --help
```

A primeira linha de comando exibe uma mensagem de ajuda geral **mysql\_config\_editor**, e ignora o comando `set`. A segunda linha de comando exibe uma mensagem de ajuda específica para o comando `set`.

Suponha que você queira estabelecer um caminho de login `client` que defina seus parâmetros de conexão padrão, e um caminho de login adicional chamado `remote` para se conectar ao servidor MySQL do host `remote.example.com`.

- Por padrão, para o servidor local com um nome de usuário e senha de `localuser` e `localpass`
- Para o servidor remoto com um nome de usuário e senha de `remoteuser` e `remotepass`

Para configurar os caminhos de login no arquivo `.mylogin.cnf`, use os seguintes comandos `set`. Insira cada comando em uma única linha e insira as senhas apropriadas quando solicitado:

```
$> mysql_config_editor set --login-path=client
         --host=localhost --user=localuser --password
Enter password: enter password "localpass" here
$> mysql_config_editor set --login-path=remote
         --host=remote.example.com --user=remoteuser --password
Enter password: enter password "remotepass" here
```

**mysql\_config\_editor** usa o `client` caminho de login por padrão, então a `--login-path=client` opção pode ser omitida do primeiro comando sem alterar seu efeito.

Para ver o que **mysql\_config\_editor** escreve no arquivo `.mylogin.cnf`, use o comando `print`:

```
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

O comando `print` exibe cada caminho de login como um conjunto de linhas começando com um cabeçalho de grupo indicando o nome do caminho de login em parênteses quadrados, seguido pelos valores de opção para o caminho de login.

Se você não especificar `--all` para exibir todos os caminhos de login ou `--login-path=name` para exibir um caminho de login nomeado, o comando `print` exibirá o `client` caminho de login por padrão, se houver um.

Como mostrado no exemplo anterior, o arquivo de caminho de login pode conter vários caminhos de login. Desta forma, **mysql\_config\_editor** facilita a configuração de várias "personalidades" para se conectar a diferentes servidores MySQL, ou para se conectar a um determinado servidor usando diferentes contas. Qualquer um deles pode ser selecionado por nome mais tarde usando a opção `--login-path` quando você invoca um programa cliente. Por exemplo, para se conectar ao servidor remoto, use este comando:

```
mysql --login-path=remote
```

Aqui, `mysql` lê os grupos de opções `[client]` e `[mysql]` de outros arquivos de opções, e os grupos `[client]`, `[mysql]`, e `[remote]` do arquivo de caminho de login.

Para se conectar ao servidor local, use este comando:

```
mysql --login-path=client
```

Como `mysql` lê os `client` e `mysql` caminhos de login por padrão, a opção `--login-path` não adiciona nada neste caso. Esse comando é equivalente a este:

```
mysql
```

As opções lidas a partir do arquivo de caminho de login têm precedência sobre as opções lidas a partir de outros arquivos de opções.

**mysql\_config\_editor** adiciona caminhos de login para o arquivo de caminho de login na ordem em que você os cria, então você deve criar caminhos de login mais gerais primeiro e mais específicos mais tarde. Se você precisar mover um caminho de login dentro do arquivo, você pode removê-lo, depois recriá-lo para adicioná-lo ao final. Por exemplo, um `client` caminho de login é mais geral porque é lido por todos os programas do cliente, enquanto um `mysqldump` caminho de login é lido apenas por `mysqldump`. Opções especificadas mais tarde substituem opções especificadas anteriormente, então colocando os caminhos de login na ordem `client`, `mysqldump` permite que opções específicas do `mysqldump` substituam as opções `client`

Quando você usa o comando `set` com **mysql\_config\_editor** para criar um caminho de login, você não precisa especificar todos os possíveis valores de opção (nome do host, nome do usuário, senha, porta, socket). Apenas os valores dados são escritos no caminho. Quaisquer valores necessários podem ser especificados mais tarde quando você invoca um caminho do cliente para se conectar ao servidor MySQL, seja em outros arquivos de opção ou na linha de comando. Quaisquer opções especificadas na linha de comando substituem as especificadas no arquivo de caminho de login ou outros arquivos de opção. Por exemplo, se as credenciais no caminho de login `remote` também se aplicam ao host `remote2.example.com`, conecte-se ao servidor nesse host assim:

```
mysql --login-path=remote --host=remote2.example.com
```

#### mysql\_config\_editor Opções gerais

**mysql\_config\_editor** suporta as seguintes opções gerais, que podem ser usadas antes de qualquer comando nomeado na linha de comando. Para descrições de opções específicas de comando, consulte os comandos mysql\_config\_editor e as opções específicas de comando.

**Tabela 6.18 mysql\_config\_editor Opções Gerais**

<table><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Nome da opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td>--debug</td> <td>Registro de depuração</td> </tr><tr><td>- Ajuda .</td> <td>Mostrar mensagem de ajuda e sair</td> </tr><tr><td>- Verbosos.</td> <td>Modo Verbose</td> </tr><tr><td>- versão</td> <td>Informações de versão de exibição e saída</td> </tr></tbody></table>

- `--help`, `-?`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

Exibe uma mensagem de ajuda geral e saia.

Para ver uma mensagem de ajuda específica do comando, invoque **mysql\_config\_editor** da seguinte forma, onde `command` é um comando diferente de `help`:

```
mysql_config_editor command --help
```

- `--debug[=debug_options]`, `-# debug_options`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--debug[=debug_option<code>d:t:o</code></code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>d:t:o</code>]]</td> </tr></tbody></table>

Escreva um log de depuração. Uma string típica `debug_options` é `d:t:o,file_name`. O padrão é `d:t:o,/tmp/mysql_config_editor.trace`.

Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`.

- `--verbose`, `-v`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--verbose</code>]]</td> </tr></tbody></table>

Esta opção pode ser útil no diagnóstico de problemas se uma operação não tiver o efeito esperado.

- `--version`, `-V`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--version</code>]]</td> </tr></tbody></table>

Informações de versão e saída.

#### mysql\_config\_editor Comandos e Opções Específicas de Comando

Esta seção descreve os comandos **mysql\_config\_editor** permitidos e, para cada um deles, as opções específicas de comando permitidas após o nome do comando na linha de comando.

Além disso, o **mysql\_config\_editor** suporta opções gerais que podem ser usadas antes de qualquer comando.

**mysql\_config\_editor** suporta estes comandos:

- `help`

  Este comando não aceita as seguintes opções.

  Para ver uma mensagem de ajuda específica do comando, invoque **mysql\_config\_editor** da seguinte forma, onde `command` é um comando diferente de `help`:

  ```
  mysql_config_editor command --help
  ```
- `print [options]`

  Imprima o conteúdo do arquivo de caminho de login em forma não ofuscada, com a exceção de que as senhas são exibidas como `*****`.

  O nome padrão do caminho de login é `client` se nenhum caminho de login for nomeado. Se ambos `--all` e `--login-path` forem dados, `--all` terá precedência.

  O comando `print` permite estas opções após o nome do comando:

  - `--help`, `-?`

    Exibe uma mensagem de ajuda para o comando `print` e saída.

    Para ver uma mensagem de ajuda geral, use **mysql\_config\_editor --help**.
  - `--all`

    Imprimir o conteúdo de todos os caminhos de login no arquivo de caminho de login.
  - `--login-path=name`, `-G name`

    Imprima o conteúdo do caminho de entrada nomeado.
- `remove [options]`

  Remover um caminho de login do arquivo de caminho de login, ou modificar um caminho de login removendo opções dele.

  Este comando remove do caminho de login apenas as opções especificadas com as opções `--host`, `--password`, `--port`, `--socket`, e `--user`. Se nenhuma dessas opções for fornecida, `remove` remove todo o caminho de login. Por exemplo, este comando remove apenas a opção `user` do caminho de login `mypath` em vez de todo o caminho de login `mypath`:

  ```
  mysql_config_editor remove --login-path=mypath --user
  ```

  Este comando remove todo o caminho de login:

  ```
  mysql_config_editor remove --login-path=mypath
  ```

  O comando `remove` permite estas opções após o nome do comando:

  - `--help`, `-?`

    Exibe uma mensagem de ajuda para o comando `remove` e saída.

    Para ver uma mensagem de ajuda geral, use **mysql\_config\_editor --help**.
  - `--host`, `-h`

    Remova o nome do host do caminho de login.
  - `--login-path=name`, `-G name`

    O caminho de login para remover ou modificar. O nome padrão do caminho de login é `client` se esta opção não for dada.
  - `--password`, `-p`

    Remova a senha do caminho de acesso.
  - `--port`, `-P`

    Remova o número da porta TCP/IP do caminho de login.
  - `--socket`, `-S`

    Remova o nome do arquivo do soquete Unix do caminho de login.
  - `--user`, `-u`

    Remova o nome do usuário do caminho de login.
  - `--warn`, `-w`

    Avise e solicite ao usuário a confirmação se o comando tentar remover o caminho de login padrão (`client`) e `--login-path=client` não foi especificado. Esta opção está habilitada por padrão; use `--skip-warn` para desativá-la.
- `reset [options]`

  Esvaziar o conteúdo do arquivo do caminho de entrada.

  O comando `reset` permite estas opções após o nome do comando:

  - `--help`, `-?`

    Exibe uma mensagem de ajuda para o comando `reset` e saída.

    Para ver uma mensagem de ajuda geral, use **mysql\_config\_editor --help**.
- `set [options]`

  Escreva um caminho de login para o arquivo de caminho de login.

  Este comando escreve no caminho de login apenas as opções especificadas com as opções `--host`, `--password`, `--port`, `--socket`, e `--user`. Se nenhuma dessas opções for fornecida, **mysql\_config\_editor** escreve o caminho de login como um grupo vazio.

  O comando `set` permite estas opções após o nome do comando:

  - `--help`, `-?`

    Exibe uma mensagem de ajuda para o comando `set` e saída.

    Para ver uma mensagem de ajuda geral, use **mysql\_config\_editor --help**.
  - `--host=host_name`, `-h host_name`

    O nome do host para escrever no caminho de login.
  - `--login-path=name`, `-G name`

    O caminho de login para criar. O nome padrão do caminho de login é `client` se esta opção não for dada.
  - `--password`, `-p`

    Prompt para uma senha para escrever no caminho de login. Depois que **mysql\_config\_editor** exibe o prompt, digite a senha e pressione Enter. Para evitar que outros usuários vejam a senha, **mysql\_config\_editor** não a ecoa.

    Para especificar uma senha vazia, pressione Enter no prompt de senha. O caminho de login resultante escrito no arquivo de caminho de login inclui uma linha como esta:

    ```
    password =
    ```
  - `--port=port_num`, `-P port_num`

    O número da porta TCP/IP para escrever no caminho de acesso.
  - `--socket=file_name`, `-S file_name`

    O nome do ficheiro do soquete do Unix para escrever no caminho de entrada.
  - `--user=user_name`, `-u user_name`

    O nome do utilizador para escrever no caminho de entrada.
  - `--warn`, `-w`

    Avise e solicite confirmação ao usuário se o comando tentar substituir um caminho de login existente. Esta opção está habilitada por padrão; use `--skip-warn` para desativá-la.
