### 6.3.4 mysqld\_multi  Gerenciar múltiplos servidores MySQL

**mysqld\_multi** é projetado para gerenciar vários processos `mysqld` que ouvem por conexões em diferentes arquivos de soquete Unix e portas TCP / IP. Ele pode iniciar ou parar servidores, ou relatar seu status atual.

::: info Note

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui o suporte do systemd para gerenciar a inicialização e o desligamento do servidor MySQL. Nessas plataformas, **mysqld\_multi** não é instalado porque é desnecessário. Para informações sobre o uso do systemd para lidar com várias instâncias do MySQL, consulte a Seção 2.5.9, Gerenciamento do MySQL Server com o systemd.

:::

Os números de grupo distinguem os grupos de opções uns dos outros e são usados como argumentos para o **mysqld\_multi** para especificar quais servidores você deseja iniciar, parar ou obter um relatório de status. As opções listadas nesses grupos são as mesmas que você usaria no grupo `[mysqldN]` usado para iniciar \*\*mysqld\_1 (ou no arquivo chamado pela opção `--defaults-file`). `N` Pode ser qualquer número inteiro positivo. Este número é referido na discussão seguinte como o número do grupo de opções, ou `GNR`. Para obter mais informações sobre o que deve ser necessário, veja a Secção 7.8  Para obter mais informações, veja a Secção 7.8  Para opções de execução em um servidor, veja a Secção 7.8  Para opções de execução em um servidor, veja a Secção 7.8  Para opções de execução em um servidor, veja a Secção 7.9

Para invocar **mysqld\_multi**, use a seguinte sintaxe:

```
mysqld_multi [options] {start|stop|reload|report} [GNR[,GNR] ...]
```

O `start`, `stop`, `reload` (parar e reiniciar) e `report` indicam qual operação executar. Você pode executar a operação designada para um único servidor ou múltiplos servidores, dependendo da lista `GNR` que segue o nome da opção. Se não houver lista, **mysqld\_multi** executa a operação para todos os servidores no arquivo de opções.

Cada valor `GNR` representa um número de grupo de opções ou um intervalo de números de grupo. O valor deve ser o número no final do nome do grupo no arquivo de opções. Por exemplo, o `GNR` para um grupo chamado `[mysqld17]` é `17`. Para especificar um intervalo de números, separe o primeiro e o último números por um traço. O `GNR` valor `10-13` representa os grupos `[mysqld10]` a `[mysqld13]`. Vários grupos ou intervalos de grupos podem ser especificados na linha de comando, separados por vírgulas. Não deve haver caracteres de espaço em branco (espaços ou guias) na lista \*`GNR`; qualquer coisa após um caractere de espaço em branco é ignorada.

Este comando inicia um único servidor usando o grupo de opções `[mysqld17]`:

```
mysqld_multi start 17
```

Este comando para vários servidores, usando grupos de opções `[mysqld8]` e `[mysqld10]` até `[mysqld13]`:

```
mysqld_multi stop 8,10-13
```

Para um exemplo de como você pode configurar um arquivo de opção, use este comando:

```
mysqld_multi --example
```

**mysqld\_multi** procura arquivos de opções da seguinte forma:

- Com `--no-defaults`, nenhum arquivo de opção é lido.

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-defaults</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>
- Com `--defaults-file=file_name`, somente o arquivo nomeado é lido.

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--defaults-file=filename</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>
- Caso contrário, os arquivos de opção na lista padrão de locais são lidos, incluindo qualquer arquivo nomeado pela opção `--defaults-extra-file=file_name`, se for dada uma. (Se a opção for dada várias vezes, o último valor é usado.)

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--defaults-extra-file=filename</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

Para obter informações adicionais sobre estas e outras opções de ficheiro de opções, consulte a secção 6.2.2.3, "Opções de linha de comando que afectam a manipulação de ficheiro de opções".

Os arquivos de opções lidos são pesquisados para os grupos de opções `[mysqld_multi]` e `[mysqldN]`. O grupo `[mysqld_multi]` pode ser usado para opções para o próprio **mysqld\_multi**. Grupos `[mysqldN]` podem ser usados para opções passadas para instâncias `mysqld` específicas.

Os grupos `[mysqld]` ou `[mysqld_safe]` podem ser usados para opções comuns lidas por todas as instâncias de `mysqld` ou **mysqld\_safe**. Você pode especificar uma opção `--defaults-file=file_name` para usar um arquivo de configuração diferente para essa instância, caso em que os grupos `[mysqld]` ou `[mysqld_safe]` desse arquivo são usados para essa instância.

**mysqld\_multi** suporta as seguintes opções.

- `--help`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--help</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Mostra uma mensagem de ajuda e sai.

- `--example`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--example</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Exibe um arquivo de opções de amostra.

- `--log=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--log=path</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>/var/log/mysqld_multi.log</code>]]</td> </tr></tbody></table>

Especifique o nome do ficheiro de registo. Se o ficheiro existir, a saída de registo é anexada a ele.

- `--mysqladmin=prog_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--mysqladmin=file</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

O `mysqladmin` binário para ser usado para parar servidores.

- `--mysqld=prog_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--mysqld=file</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

O `mysqld` binário a ser usado. Note que você pode especificar **mysqld\_safe** como o valor para esta opção também. Se você usar **mysqld\_safe** para iniciar o servidor, você pode incluir as opções `mysqld` ou `ledir` no grupo de opções `[mysqldN]` correspondente. Essas opções indicam o nome do servidor que **mysqld\_safe** deve iniciar e o nome do caminho do diretório onde o servidor está localizado. (Veja as descrições para essas opções na Seção 6.3.2, mysqld\_safe  MySQL Server Startup Script Exemplo.):

```
[mysqld38]
mysqld = mysqld-debug
ledir  = /opt/local/mysql/libexec
```

- `--no-log`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-log</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Imprima informações de log para `stdout` em vez de para o arquivo de log. Por padrão, a saída vai para o arquivo de log.

- `--password=password`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--password=string</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

A senha da conta MySQL para usar ao invocar `mysqladmin`. Note que o valor da senha não é opcional para esta opção, ao contrário de outros programas MySQL.

- `--silent`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--silent</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Modo silencioso; desativar avisos.

- `--tcp-ip`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--tcp-ip</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Conecte-se a cada servidor MySQL através da porta TCP/IP em vez do arquivo de soquete do Unix. (Se um arquivo de soquete estiver faltando, o servidor ainda pode estar em execução, mas acessível apenas através da porta TCP/IP.) Por padrão, as conexões são feitas usando o arquivo de soquete do Unix. Esta opção afeta as operações `stop` e `report`.

- `--user=user_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--user=name</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>root</code>]]</td> </tr></tbody></table>

O nome de usuário da conta MySQL a ser usado ao invocar `mysqladmin`.

- `--verbose`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--verbose</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Seja mais verboz.

- `--version`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--version</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Informações de versão e saída.

Algumas notas sobre **mysqld\_multi**:

- \*\* Mais importante\*\*: Antes de usar **mysqld\_multi**, certifique-se de que você entende o significado das opções que são passadas para os servidores `mysqld` e *por que* você gostaria de ter processos `mysqld` separados. Cuidado com os perigos de usar vários servidores `mysqld` com o mesmo diretório de dados. Use diretórios de dados separados, a menos que você *saba* o que está fazendo. Iniciar vários servidores com o mesmo diretório de dados não *dá* você desempenho extra em um sistema em thread. Veja Seção 7.8, "Executar múltiplas instâncias do MySQL em uma máquina".

  Importância

  Certifique-se de que o diretório de dados para cada servidor é totalmente acessível à conta Unix que o processo específico `mysqld` é iniciado como. \* Não use a conta Unix \* `root` \* para isso, a menos que você \* saiba \* o que está fazendo. Veja Seção 8.1.5, "Como executar o MySQL como um usuário normal".
- Certifique-se de que a conta MySQL usada para parar os servidores `mysqld` (com o programa `mysqladmin`) tenha o mesmo nome de usuário e senha para cada servidor. Também, certifique-se de que a conta tenha o privilégio `SHUTDOWN`. Se os servidores que você deseja gerenciar tiverem nomes de usuário ou senhas diferentes para as contas administrativas, você pode querer criar uma conta em cada servidor que tenha o mesmo nome de usuário e senha. Por exemplo, você pode configurar uma conta comum `multi_admin` executando os seguintes comandos para cada servidor:

  ```
  $> mysql -u root -S /tmp/mysql.sock -p
  Enter password:
  mysql> CREATE USER 'multi_admin'@'localhost' IDENTIFIED BY 'multipass';
  mysql> GRANT SHUTDOWN ON *.* TO 'multi_admin'@'localhost';
  ```

  Veja a Seção 8.2, Controlo de Acesso e Gerenciamento de Conta. Você deve fazer isso para cada servidor `mysqld`. Altere os parâmetros de conexão apropriadamente ao se conectar a cada um. Observe que a parte do nome do host do nome da conta deve permitir que você se conecte como `multi_admin` a partir do host onde você deseja executar **mysqld\_multi**.
- O arquivo de soquete Unix e o número de porta TCP/IP devem ser diferentes para cada `mysqld`. (Alternativamente, se o host tiver vários endereços de rede, você pode definir a variável de sistema `bind_address` para fazer com que diferentes servidores ouçam diferentes interfaces.)
- A opção `--pid-file` é muito importante se você estiver usando **mysqld\_safe** para iniciar `mysqld` (por exemplo, `--mysqld=mysqld_safe`) Cada `mysqld` deve ter seu próprio arquivo de ID de processo. A vantagem de usar **mysqld\_safe** em vez de `mysqld` é que **mysqld\_safe** monitora seu processo `mysqld` e o reinicia se o processo terminar devido a um sinal enviado usando `kill -9` ou por outras razões, como uma falha de segmentação.
- Você pode querer usar a opção `--user` para `mysqld`, mas para fazer isso você precisa executar o script **mysqld\_multi** como o superusuário do Unix (`root`). Ter a opção no arquivo de opções não importa; você só recebe um aviso se você não é o superusuário e os processos `mysqld` são iniciados sob sua própria conta do Unix.

O exemplo a seguir mostra como você pode configurar um arquivo de opções para uso com **mysqld\_multi**. A ordem em que os programas `mysqld` são iniciados ou interrompidos depende da ordem em que eles aparecem no arquivo de opções. Os números de grupo não precisam formar uma seqüência ininterrupta. O primeiro e o quinto grupos foram intencionalmente omitidos do exemplo para ilustrar que você pode ter gaps no arquivo de opções. Isso lhe dá mais flexibilidade.

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

Ver secção 6.2.2.2, "Utilização de ficheiros de opções".
