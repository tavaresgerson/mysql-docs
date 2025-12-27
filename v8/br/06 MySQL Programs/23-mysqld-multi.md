### 6.3.4 `mysqld_multi` — Gerenciamento de Múltiplos Servidores MySQL

O `mysqld_multi` é projetado para gerenciar vários processos `mysqld` que escutam conexões em diferentes arquivos de soquete Unix e portas TCP/IP. Ele pode iniciar ou parar servidores ou reportar seu status atual.

::: info Nota

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte do systemd para gerenciar o início e o desligamento do servidor MySQL. Nessas plataformas, o `mysqld_multi` não é instalado porque é desnecessário. Para obter informações sobre como usar o systemd para gerenciar múltiplas instâncias do MySQL, consulte a Seção 2.5.9, “Gerenciamento do Servidor MySQL com o systemd”.

:::

O `mysqld_multi` procura por grupos nomeados `[mysqldN]` em `my.cnf` (ou no arquivo nomeado pela opção `--defaults-file`). *`N`* pode ser qualquer inteiro positivo. Esse número é referido na discussão a seguir como o número do grupo de opções, ou *`GNR`*. Os números de grupo distinguem os grupos de opções uns dos outros e são usados como argumentos para o `mysqld_multi` para especificar quais servidores você deseja iniciar, parar ou obter um relatório de status para. As opções listadas nesses grupos são as mesmas que você usaria no grupo `[mysqld]` usado para iniciar o `mysqld`. (Veja, por exemplo, a Seção 2.9.5, “Início e Parada Automática do MySQL”.) No entanto, ao usar múltiplos servidores, é necessário que cada um use seu próprio valor para opções como o arquivo de soquete Unix e o número da porta TCP/IP. Para obter mais informações sobre quais opções devem ser únicas por servidor em um ambiente de múltiplos servidores, consulte a Seção 7.8, “Executando Múltiplas Instâncias do MySQL em uma Máquina”.

Para invocar o `mysqld_multi`, use a seguinte sintaxe:

```
mysqld_multi [options] {start|stop|reload|report} [GNR[,GNR] ...]
```

`start`, `stop`, `reload` (parar e reiniciar) e `report` indicam qual operação realizar. Você pode realizar a operação designada para um único servidor ou múltiplos servidores, dependendo da lista de *`GNR`* que segue o nome da opção. Se não houver lista, o `mysqld_multi` realiza a operação para todos os servidores no arquivo de opções.

Cada valor `GNR` representa um número de grupo de opções ou uma faixa de números de grupos. O valor deve ser o número no final do nome do grupo no arquivo de opções. Por exemplo, o `GNR` para um grupo chamado `[mysqld17]` é `17`. Para especificar uma faixa de números, separe o primeiro e o último número com um hífen. O valor `GNR` `10-13` representa os grupos `[mysqld10]` a `[mysqld13]`. Vários grupos ou faixas de grupos podem ser especificados na linha de comando, separados por vírgulas. Não deve haver caracteres de espaço em branco (espaços ou tabulações) na lista `GNR`; qualquer coisa após um caractere de espaço em branco é ignorada.

Este comando inicia um único servidor usando o grupo de opções `[mysqld17]`:

```
mysqld_multi start 17
```

Este comando para várias máquinas, usando os grupos de opções `[mysqld8]` e `[mysqld10]` a `[mysqld13]`:

```
mysqld_multi stop 8,10-13
```

Para um exemplo de como você pode configurar um arquivo de opções, use este comando:

```
mysqld_multi --example
```

O `mysqld_multi` procura arquivos de opções da seguinte forma:

* Com  `--no-defaults`, nenhum arquivo de opções é lido.

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--no-defaults</code></td> </tr><tr><th>Tipo</th> <td><code>Booleano</code></td> </tr><tr><th>Valor Padrão</th> <td><code>false</code></td> </tr></tbody></table>
* Com `--defaults-file=nome_do_arquivo`, apenas o arquivo nomeado é lido.

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-file=nome_do_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>
* Caso contrário, os arquivos de opções na lista padrão de locais são lidos, incluindo qualquer arquivo nomeado pela opção `--defaults-extra-file=nome_do_arquivo`, se uma for dada. (Se a opção for dada várias vezes, o último valor é usado.)

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-extra-file=nome_do_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

Para obter informações adicionais sobre essas e outras opções de arquivo de configuração, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o gerenciamento de arquivos de configuração”.

Os arquivos de configuração lidos são pesquisados pelos grupos de opções `[mysqld_multi]` e `[mysqldN]`. O grupo `[mysqld_multi]` pode ser usado para opções do próprio `mysqld_multi`. Os grupos `[mysqldN]` podem ser usados para opções passadas para instâncias específicas do `mysqld`.

Os grupos `[mysqld]` ou `[mysqld_safe]` podem ser usados para opções comuns lidas por todas as instâncias do `mysqld` ou `mysqld_safe`. Você pode especificar uma opção `--defaults-file=nome_arquivo` para usar um arquivo de configuração diferente para essa instância, caso em que os grupos `[mysqld]` ou `[mysqld_safe]` desse arquivo são usados para essa instância.

O `mysqld_multi` suporta as seguintes opções.

*  `--help`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr><tr><th>Tipo</th> <td><code>Booleano</code></td> </tr><tr><th>Valor padrão</th> <td><code>false</code></td> </tr></tbody></table>

  Exibir uma mensagem de ajuda e sair.
*  `--example`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--example</code></td> </tr><tr><th>Tipo</th> <td><code>Booleano</code></td> </tr><tr><th>Valor padrão</th> <td><code>false</code></td> </tr></tbody></table>

  Exibir um arquivo de exemplo de configuração.
*  `--log=nome_arquivo`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--log=caminho</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>/var/log/mysqld_multi.log</code></td> </tr></tbody></table>

  Especificar o nome do arquivo de log. Se o arquivo existir, a saída do log é anexada a ele.
*  `--mysqladmin=nome_programa`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--mysqladmin=arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  O binário `mysqladmin` a ser usado para parar os servidores.
*  `--mysqld=nome_programa`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--mysqld=arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  O binário `mysqld` a ser usado. Note que você também pode especificar `mysqld_safe` como o valor para esta opção. Se você usar `mysqld_safe` para iniciar o servidor, pode incluir as opções `mysqld` ou `ledir` no grupo de opções correspondente `[mysqldN]`. Essas opções indicam o nome do servidor que `mysqld_safe` deve iniciar e o nome do diretório onde o servidor está localizado. Exemplo:

  ```
  [mysqld38]
  mysqld = mysqld-debug
  ledir  = /opt/local/mysql/libexec
  ```
*  `--no-log`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-log</code></td> </tr><tr><th>Tipo</th> <td><code>Booleano</code></td> </tr><tr><th>Valor padrão</th> <td><code>false</code></td> </tr></tbody></table>

  Imprima as informações do log no `stdout` em vez de no arquivo de log. Por padrão, a saída vai para o arquivo de log.
*  `--password=senha`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--password=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  A senha da conta MySQL a ser usada ao invocar `mysqladmin`. Note que o valor da senha não é opcional para esta opção, ao contrário de outras aplicações MySQL.
*  `--silent`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--silent</code></td> </tr><tr><th>Tipo</th> <td><code>Booleano</code></td> </tr><tr><th>Valor padrão</th> <td><code>false</code></td> </tr></tbody></table>

  Modo silencioso; desative as mensagens de aviso.
*  `--tcp-ip`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tcp-ip</code></td> </tr><tr><th>Tipo</th> <td><code>Booleano</code></td> </tr><tr><th>Valor padrão</th> <td><code>false</code></td> </tr></tbody></table>

Conecte-se a cada servidor MySQL através da porta TCP/IP em vez do arquivo de soquete Unix. (Se um arquivo de soquete estiver ausente, o servidor ainda pode estar em execução, mas acessível apenas através da porta TCP/IP.) Por padrão, as conexões são feitas usando o arquivo de soquete Unix. Esta opção afeta as operações `stop` e `report`.
*  `--user=user_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--user=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>root</code></td> </tr></tbody></table>

  O nome do usuário da conta MySQL a ser usado ao invocar o `mysqladmin`.
*  `--verbose`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--verbose</code></td> </tr><tr><th>Tipo</th> <td><code>Booleano</code></td> </tr><tr><th>Valor padrão</th> <td><code>false</code></td> </tr></tbody></table>

  Ser mais verbose.
*  `--version`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--version</code></td> </tr><tr><th>Tipo</th> <td><code>Booleano</code></td> </tr><tr><th>Valor padrão</th> <td><code>false</code></td> </tr></tbody></table>

  Exibir informações de versão e sair.

Algumas notas sobre  `mysqld_multi`:

* **Mais importante**: Antes de usar  `mysqld_multi`, certifique-se de entender o significado das opções passadas aos servidores  `mysqld` e *por que* você gostaria de ter processos separados de  `mysqld`. Esteja ciente dos perigos de usar múltiplos servidores  `mysqld` com o mesmo diretório de dados. Use diretórios de dados separados, a menos que você *saiba* o que está fazendo. Iniciar múltiplos servidores com o mesmo diretório de dados *não* lhe dá desempenho extra em um sistema com múltiplos threads. Veja  Seção 7.8, “Executando múltiplas instâncias do MySQL em uma única máquina”.

Importante

Certifique-se de que o diretório de dados de cada servidor seja totalmente acessível à conta Unix na qual o processo específico `mysqld` é iniciado. *Não use* a conta Unix *`root`* para isso, a menos que você *saiba* o que está fazendo. Veja a Seção 8.1.5, “Como executar o MySQL como um usuário normal”.
* Certifique-se de que a conta MySQL usada para parar os servidores `mysqld` (com o programa `mysqladmin`) tenha o mesmo nome de usuário e senha para cada servidor. Além disso, certifique-se de que a conta tenha o privilégio `SHUTDOWN`. Se os servidores que você deseja gerenciar tiverem nomes de usuário ou senhas diferentes para as contas administrativas, você pode querer criar uma conta em cada servidor que tenha o mesmo nome de usuário e senha. Por exemplo, você pode configurar uma conta `multi_admin` comum executando os seguintes comandos para cada servidor:

  ```
  $> mysql -u root -S /tmp/mysql.sock -p
  Enter password:
  mysql> CREATE USER 'multi_admin'@'localhost' IDENTIFIED BY 'multipass';
  mysql> GRANT SHUTDOWN ON *.* TO 'multi_admin'@'localhost';
  ```

Veja a Seção 8.2, “Controle de Acesso e Gerenciamento de Contas”. Você precisa fazer isso para cada servidor `mysqld`. Altere os parâmetros de conexão conforme apropriado ao se conectar a cada um deles. Observe que a parte do nome do host do nome da conta deve permitir que você se conecte como `multi_admin` a partir do host onde você deseja executar `mysqld_multi`.
* O arquivo de socket Unix e o número da porta TCP/IP devem ser diferentes para cada `mysqld`. (Alternativamente, se o host tiver múltiplos endereços de rede, você pode definir a variável de sistema `bind_address` para fazer com que diferentes servidores ouçam interfaces diferentes.)
* A opção `--pid-file` é muito importante se você estiver usando `mysqld_safe` para iniciar o `mysqld` (por exemplo, `--mysqld=mysqld_safe`) Cada `mysqld` deve ter seu próprio arquivo de ID de processo. A vantagem de usar `mysqld_safe` em vez de `mysqld` é que `mysqld_safe` monitora seu processo `mysqld` e o reinicia se o processo terminar devido a um sinal enviado usando `kill -9` ou por outros motivos, como uma falha de segmentação.
* Você pode querer usar a opção `--user` para `mysqld`, mas para isso, você precisa executar o script `mysqld_multi` como o superusuário Unix (`root`). Ter a opção no arquivo de opções não importa; você apenas recebe um aviso se não for o superusuário e os processos `mysqld` forem iniciados sob sua própria conta Unix.

O exemplo a seguir mostra como você pode configurar um arquivo de opções para uso com `mysqld_multi`. A ordem em que os programas `mysqld` são iniciados ou interrompidos depende da ordem em que aparecem no arquivo de opções. Os números de grupo não precisam formar uma sequência ininterrupta. Os primeiros e os cinco grupos `[mysqldN]` foram intencionalmente omitidos do exemplo para ilustrar que você pode ter “lacunas” no arquivo de opções. Isso lhe dá mais flexibilidade.

```
# This is an example of a my.cnf file for mysqld_multi.
# Usually this file is located in home dir ~/.my.cnf or /etc/my.cnf

[mysqld_multi]
mysqld     = /usr/local/mysql/bin/mysqld_safe
mysqladmin = /usr/local/mysql/bin/mysqladmin
user       = multi_admin
password   = my_password

[mysqld2]
socket     = /tmp/mysql.sock2
port       = 3307
pid-file   = /usr/local/mysql/data2/hostname.pid2
datadir    = /usr/local/mysql/data2
language   = /usr/local/mysql/share/mysql/english
user       = unix_user1

[mysqld3]
mysqld     = /path/to/mysqld_safe
ledir      = /path/to/mysqld-binary/
mysqladmin = /path/to/mysqladmin
socket     = /tmp/mysql.sock3
port       = 3308
pid-file   = /usr/local/mysql/data3/hostname.pid3
datadir    = /usr/local/mysql/data3
language   = /usr/local/mysql/share/mysql/swedish
user       = unix_user2

[mysqld4]
socket     = /tmp/mysql.sock4
port       = 3309
pid-file   = /usr/local/mysql/data4/hostname.pid4
datadir    = /usr/local/mysql/data4
language   = /usr/local/mysql/share/mysql/estonia
user       = unix_user3

[mysqld6]
socket     = /tmp/mysql.sock6
port       = 3311
pid-file   = /usr/local/mysql/data6/hostname.pid6
datadir    = /usr/local/mysql/data6
language   = /usr/local/mysql/share/mysql/japanese
user       = unix_user4
```

Veja a Seção 6.2.2.2, “Usando Arquivos de Opções”.