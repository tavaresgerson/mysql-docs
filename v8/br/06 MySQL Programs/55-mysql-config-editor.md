### 6.6.7 `mysql_config_editor` — Ferramenta de Configuração do MySQL

A ferramenta `mysql_config_editor` permite que você armazene credenciais de autenticação em um arquivo de caminho de login desobstruído chamado `.mylogin.cnf`. A localização do arquivo é o diretório `%APPDATA%\MySQL` no Windows e o diretório de casa do usuário atual em sistemas que não são do Windows. O arquivo pode ser lido mais tarde por programas clientes do MySQL para obter credenciais de autenticação para se conectar ao Servidor MySQL.

O formato não desobstruído do arquivo de caminho de login `.mylogin.cnf` consiste em grupos de opções, semelhantes a outros arquivos de opção. Cada grupo de opções em `.mylogin.cnf` é chamado de “caminho de login”, que é um grupo que permite apenas certas opções: `host`, `user`, `password`, `port` e `socket`. Pense em um grupo de opções de caminho de login como um conjunto de opções que especificam para qual servidor MySQL se conectar e qual conta se autenticar. Aqui está um exemplo não desobstruído:

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

Quando você invoca um programa cliente para se conectar ao servidor, o cliente usa `.mylogin.cnf` em conjunto com outros arquivos de opção. Sua precedência é maior que a de outros arquivos de opção, mas menor que as opções especificadas explicitamente na linha de comando do cliente. Para obter informações sobre a ordem em que os arquivos de opção são usados, consulte a Seção 6.2.2.2, “Usando Arquivos de Opção”.

Para especificar um nome de arquivo de caminho de login alternativo, defina a variável de ambiente `MYSQL_TEST_LOGIN_FILE`. Essa variável é reconhecida pelo `mysql_config_editor`, pelos clientes MySQL padrão ( `mysql`, `mysqladmin` e assim por diante), e pelo utilitário de teste `mysql-test-run.pl`.

Os programas usam os grupos no arquivo de caminho de login da seguinte forma:

* O `mysql_config_editor` opera no caminho de login `client` por padrão se você especificar a opção `--login-path=nome` para indicar explicitamente qual caminho de login usar.
* Sem a opção `--login-path`, os programas clientes leem os mesmos grupos de opções do arquivo de caminho de login que leem de outros arquivos de opção. Considere este comando:

  ```
  mysql
  ```

Por padrão, o cliente `mysql` lê os grupos `[client]` e `[mysql]` de outros arquivos de opção, então ele também os lê do arquivo de caminho de login.
* Com a opção `--login-path`, os programas cliente também leem o caminho de login nomeado do arquivo de caminho de login. Os grupos de opção lidos de outros arquivos de opção permanecem os mesmos. Considere este comando:

  ```
  mysql --login-path=mypath
  ```

  O cliente `mysql` lê `[client]` e `[mysql]` de outros arquivos de opção, e `[client]`, `[mysql]`, e `[mypath]` do arquivo de caminho de login.
* Os programas cliente leem o arquivo de caminho de login mesmo quando a opção `--no-defaults` é usada, a menos que `--no-login-paths` seja definida. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo que `--no-defaults` esteja presente.

 `mysql_config_editor` ofusca o arquivo `.mylogin.cnf` para que ele não possa ser lido como texto claro, e seu conteúdo quando não ofuscado por programas cliente é usado apenas na memória. Dessa forma, as senhas podem ser armazenadas em um arquivo em formato não claro e usadas mais tarde sem nunca precisar ser expostas na linha de comando ou em uma variável de ambiente. `mysql_config_editor` fornece um comando `print` para exibir o conteúdo do arquivo de caminho de login, mas mesmo nesse caso, os valores das senhas são mascarados para nunca aparecerem de uma maneira que outros usuários possam vê-los.
A ofuscação usada pelo `mysql_config_editor` impede que as senhas apareçam no `.mylogin.cnf` como texto claro e fornece uma medida de segurança ao prevenir a exposição acidental das senhas. Por exemplo, se você exibe um arquivo de opção `my.cnf` regular não ofuscado na tela, quaisquer senhas que ele contenha são visíveis para qualquer um ver. Com `.mylogin.cnf`, isso não é verdade, mas a ofuscação usada provavelmente não impedirá um atacante determinado e você não deve considerá-la inquebrável. Um usuário que pode obter privilégios de administração do sistema na sua máquina para acessar seus arquivos pode ofuscar o arquivo `.mylogin.cnf` com algum esforço.

O arquivo de caminho de login deve ser legível e gravável pelo usuário atual e inacessível para outros usuários. Caso contrário, o `mysql_config_editor` o ignora e os programas cliente também não o usam.

Inicie o `mysql_config_editor` da seguinte forma:

```
mysql_config_editor [program_options] command [command_options]
```

Se o arquivo de caminho de login não existir, o `mysql_config_editor` cria-o.

Os argumentos da comando são fornecidos da seguinte forma:

* *`program_options`* consiste em opções gerais do `mysql_config_editor`.
* `command` indica a ação a ser realizada no arquivo de caminho de login `.mylogin.cnf`. Por exemplo, `set` escreve um caminho de login no arquivo, `remove` remove um caminho de login e `print` exibe o conteúdo do caminho de login.
* *`command_options`* indica quaisquer opções adicionais específicas do comando, como o nome do caminho de login e os valores a serem usados no caminho de login.

A posição do nome do comando dentro do conjunto de argumentos do programa é importante. Por exemplo, essas linhas de comando têm os mesmos argumentos, mas produzem resultados diferentes:

```
mysql_config_editor --help set
mysql_config_editor set --help
```

A primeira linha de comando exibe uma mensagem de ajuda geral do `mysql_config_editor` e ignora o comando `set`. A segunda linha de comando exibe uma mensagem de ajuda específica do comando `set`.

Suponha que você queira estabelecer um caminho de login `client` que defina seus parâmetros de conexão padrão e um caminho de login adicional chamado `remote` para se conectar ao servidor MySQL no host `remote.example.com`. Você deseja fazer login da seguinte forma:

* Por padrão, no servidor local com um nome de usuário e senha de `localuser` e `localpass`
* No servidor remoto com um nome de usuário e senha de `remoteuser` e `remotepass`

Para configurar os caminhos de login no arquivo `.mylogin.cnf`, use os seguintes comandos `set`. Insira cada comando em uma única linha e insira as senhas apropriadas quando solicitado:

```
$> mysql_config_editor set --login-path=client
         --host=localhost --user=localuser --password
Enter password: enter password "localpass" here
$> mysql_config_editor set --login-path=remote
         --host=remote.example.com --user=remoteuser --password
Enter password: enter password "remotepass" here
```

O `mysql_config_editor` usa o caminho de login `client` por padrão, então a opção `--login-path=client` pode ser omitida do primeiro comando sem alterar seu efeito.

Para ver o que o `mysql_config_editor` escreve no arquivo `.mylogin.cnf`, use o comando `print`:

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

O comando `print` exibe cada caminho de login como um conjunto de linhas que começam com um cabeçalho de grupo indicando o nome do caminho de login entre colchetes, seguido pelos valores das opções para o caminho de login. Os valores das senhas são mascarados e não aparecem como texto claro.

Se você não especificar `--all` para exibir todos os caminhos de login ou `--login-path=nome` para exibir um caminho de login nomeado, o comando `print` exibe o caminho de login `client` por padrão, se houver um.

Como mostrado no exemplo anterior, o arquivo de caminhos de login pode conter múltiplos caminhos de login. Dessa forma, o `mysql_config_editor` facilita a configuração de múltiplas "personalidades" para conectar a diferentes servidores MySQL, ou para conectar a um servidor específico usando diferentes contas. Qualquer um desses pode ser selecionado pelo nome mais tarde usando a opção `--login-path` ao invocar um programa cliente. Por exemplo, para se conectar ao servidor remoto, use este comando:

```
mysql --login-path=remote
```

Aqui, o `mysql` lê os grupos de opções `[client]` e `[mysql]` de outros arquivos de opções, e os grupos `[client]`, `[mysql]` e `[remote]` do arquivo de caminhos de login.

Para se conectar ao servidor local, use este comando:

```
mysql --login-path=client
```

Como o `mysql` lê os caminhos de login `client` e `mysql` por padrão, a opção `--login-path` não adiciona nada neste caso. Esse comando é equivalente a este:

```
mysql
```

As opções lidas do arquivo de caminhos de login têm precedência sobre as opções lidas de outros arquivos de opções. As opções lidas dos grupos de caminhos de login que aparecem mais tarde no arquivo de caminhos de login têm precedência sobre as opções lidas de grupos que aparecem mais cedo no arquivo.

`mysql_config_editor` adiciona caminhos de login ao arquivo de caminhos de login na ordem em que você os cria, então você deve criar caminhos de login mais gerais primeiro e caminhos mais específicos depois. Se você precisar mover um caminho de login dentro do arquivo, pode removê-lo e, em seguida, recriá-lo para adicioná-lo ao final. Por exemplo, um caminho de login `client` é mais geral porque é lido por todos os programas cliente, enquanto um caminho de login `mysqldump` é lido apenas pelo `mysqldump`. As opções especificadas mais tarde substituem opções especificadas anteriormente, então colocar os caminhos de login na ordem `client`, `mysqldump` permite que as opções específicas do `mysqldump` substituam as opções do `client`.

Quando você usa o comando `set` com `mysql_config_editor` para criar um caminho de login, você não precisa especificar todos os valores possíveis de opção (nome do host, nome de usuário, senha, porta, soquete). Apenas os valores fornecidos são escritos no caminho. Quaisquer valores faltantes necessários mais tarde podem ser especificados quando você invoca um caminho cliente para se conectar ao servidor MySQL, seja em outros arquivos de opção ou na linha de comando. Quaisquer opções especificadas na linha de comando substituem as especificadas no arquivo de caminho de login ou em outros arquivos de opção. Por exemplo, se as credenciais no caminho de login `remote` também se aplicam ao host `remote2.example.com`, conecte-se ao servidor nesse host assim:

```
mysql --login-path=remote --host=remote2.example.com
```

#### Opções Gerais do `mysql_config_editor`

`mysql_config_editor` suporta as seguintes opções gerais, que podem ser usadas antes de qualquer comando nomeado na linha de comando. Para descrições de opções específicas de comando, consulte `mysql_config_editor` Comandos e Opções Específicas de Comando.

**Tabela 6.8 Opções Gerais do `mysql_config_editor`**

<table><thead><tr><th>Nome da Opção</th> <th>Descrição</th> </tr></thead><tbody><tr><td>--debug</td> <td>Escreva log de depuração</td> </tr><tr><td>--help</td> <td>Exiba mensagem de ajuda e saia</td> </tr><tr><td>--verbose</td> <td>Modo verbose</td> </tr><tr><td>--version</td> <td>Exiba informações de versão e saia</td> </tbody></table>

*  `--help`, `-?`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibir uma mensagem de ajuda geral e sair.

  Para ver uma mensagem de ajuda específica para um comando, invocando `mysql_config_editor` da seguinte forma, onde *`comando`* é um comando diferente de `help`:

  ```
  mysql_config_editor command --help
  ```
*  `--debug[=debug_options]`, `-# debug_options`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>d:t:o</code></td> </tr></tbody></table>

  Escrever um log de depuração. Uma string típica de *`debug_options`* é `d:t:o,nome_do_arquivo`. O padrão é `d:t:o,/tmp/mysql_config_editor.trace`.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de liberação do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
*  `--verbose`, `-v`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Modo verbose. Imprimir mais informações sobre o que o programa faz. Esta opção pode ser útil no diagnóstico de problemas se uma operação não tiver o efeito esperado.
*  `--version`, `-V`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--version</code></td> </tr></tbody></table>

  Exibir informações de versão e sair.

#### Comandos e Opções Específicas de Comandos do `mysql_config_editor`

Esta seção descreve os comandos permitidos do `mysql_config_editor` e, para cada um, as opções específicas do comando permitidas após o nome do comando na linha de comando.

Além disso, o `mysql_config_editor` suporta opções gerais que podem ser usadas antes de qualquer comando. Para descrições dessas opções, consulte Opções Gerais do `mysql_config_editor`.

 O `mysql_config_editor` suporta estes comandos:

* `help`

  Exibir uma mensagem de ajuda geral e sair. Este comando não aceita opções adicionais.

Para ver uma mensagem de ajuda específica para um comando, invoque `mysql_config_editor` da seguinte forma, onde *`comando`* é um comando diferente de `help`:

```
  mysql_config_editor command --help
  ```

Imprima o conteúdo do arquivo de caminho de login em forma não obfuscada, com exceção das senhas, que são exibidas como `*****`.

O nome padrão do caminho de login é `client` se nenhum caminho de login for nomeado. Se `--all` e `--login-path` forem fornecidos, `--all` tem precedência.

O comando `print` permite essas opções após o nome do comando:

+ `--help`, `-?`

Exibir uma mensagem de ajuda para o comando `print` e sair.

Para ver uma mensagem de ajuda geral, use **mysql_config_editor --help**.
+ `--all`

Imprimir o conteúdo de todos os caminhos de login no arquivo de caminho de login.
+ `--login-path=nome`, `-G nome`

Imprimir o conteúdo do caminho de login nomeado.
* `remove [opções]`

Remover um caminho de login do arquivo de caminho de login ou modificar um caminho de login removendo opções dele.

Este comando remove apenas as opções especificadas com as opções `--host`, `--password`, `--port`, `--socket` e `--user` do caminho de login. Se nenhuma dessas opções for fornecida, o `remove` remove todo o caminho de login. Por exemplo, este comando remove apenas a opção `user` do caminho de login `mypath` em vez de todo o caminho de login `mypath`:

```
  mysql_config_editor remove --login-path=mypath --user
  ```

Este comando remove todo o caminho de login `mypath`:

```
  mysql_config_editor remove --login-path=mypath
  ```

O comando `remove` permite essas opções após o nome do comando:

+ `--help`, `-?`

Exibir uma mensagem de ajuda para o comando `remove` e sair.

Para ver uma mensagem de ajuda geral, use `mysql_config_editor --help`.
+ `--host`, `-h`

Remover o nome do host do caminho de login.
+ `--login-path=nome`, `-G nome`

O caminho de login a ser removido ou modificado. O nome padrão do caminho de login é `client` se esta opção não for fornecida.
+ `--password`, `-p`

Remover a senha do caminho de login.
+ `--port`, `-P`

Remova o número da porta TCP/IP do caminho de login.
  + `--socket`, `-S`

    Remova o nome do arquivo de socket Unix do caminho de login.
  + `--user`, `-u`

    Remova o nome do usuário do caminho de login.
  + `--warn`, `-w`

    Avise e peça confirmação ao usuário se o comando tentar remover o caminho de login padrão (`client`) e a opção `--login-path=client` não tiver sido especificada. Esta opção está habilitada por padrão; use `--skip-warn` para desabilitá-la.
* `reset [opções]`

  Limpe o conteúdo do arquivo do caminho de login.

  O comando `reset` permite essas opções após o nome do comando:

  + `--help`, `-?`

    Exiba uma mensagem de ajuda para o comando `reset` e saia.

    Para ver uma mensagem de ajuda geral, use `mysql_config_editor --help`.
* `set [opções]`

  Escreva um caminho de login no arquivo do caminho de login.

  Este comando escreve apenas as opções especificadas com as opções `--host`, `--password`, `--port`, `--socket` e `--user` no caminho de login. Se nenhuma dessas opções for fornecida, o `mysql_config_editor` escreve o caminho de login como um grupo vazio.

  O comando `set` permite essas opções após o nome do comando:

  + `--help`, `-?`

    Exiba uma mensagem de ajuda para o comando `set` e saia.

    Para ver uma mensagem de ajuda geral, use `mysql_config_editor --help`.
  + `--host=nome_do_host`, `-h nome_do_host`

    O nome do host para escrever no caminho de login.
  + `--login-path=nome`, `-G nome`

    O caminho de login a ser criado. O nome padrão do caminho de login é `client` se esta opção não for fornecida.
  + `--password`, `-p`

    Solicitar uma senha para escrever no caminho de login. Após o `mysql_config_editor` exibir o prompt, digite a senha e pressione Enter. Para impedir que outros usuários vejam a senha, o `mysql_config_editor` não a exibe.

    Para especificar uma senha vazia, pressione Enter no prompt de senha. O caminho de login resultante escrito no arquivo do caminho de login inclui uma linha como esta:

    ```
    password =
    ```
  + `--port=número_de_porta`, `-P número_de_porta`

O número de porta TCP/IP para escrever na rota de login.
  + `--socket=nome_arquivo`, `-S nome_arquivo`

    O nome do arquivo de socket Unix para escrever na rota de login.
  + `--user=nome_usuario`, `-u nome_usuario`

    O nome do usuário para escrever na rota de login.
  + `--warn`, `-w`

    Avisar e solicitar confirmação ao usuário se o comando tentar sobrescrever uma rota de login existente. Esta opção está habilitada por padrão; use `--skip-warn` para desabilitá-la.