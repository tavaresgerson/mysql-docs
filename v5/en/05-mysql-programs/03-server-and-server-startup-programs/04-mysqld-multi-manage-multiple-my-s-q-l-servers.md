### 4.3.4 mysqld_multi — Gerenciar Múltiplos Servidores MySQL

O **mysqld_multi** foi projetado para gerenciar diversos processos **mysqld** que escutam conexões em diferentes Unix socket files e portas TCP/IP. Ele pode iniciar ou parar servidores, ou reportar seu status atual.

Nota

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte systemd para gerenciar a inicialização e o desligamento do servidor MySQL. Nessas plataformas, o **mysqld_multi** não é instalado porque é desnecessário. Para obter informações sobre como usar o systemd para lidar com múltiplas instâncias MySQL, consulte a Seção 2.5.10, “Gerenciando o Servidor MySQL com systemd”.

O **mysqld_multi** busca por grupos nomeados `[mysqldN]` em `my.cnf` (ou no arquivo nomeado pela opção `--defaults-file`). *`N`* pode ser qualquer inteiro positivo. Este número é referido na discussão seguinte como o número do grupo de opções, ou *`GNR`*. Os números de grupo distinguem os grupos de opções uns dos outros e são usados como argumentos para o **mysqld_multi** para especificar quais servidores você deseja iniciar, parar ou para os quais deseja obter um relatório de status. As opções listadas nestes grupos são as mesmas que você usaria no grupo `[mysqld]` usado para iniciar o **mysqld**. (Veja, por exemplo, a Seção 2.9.5, “Iniciando e Parando o MySQL Automaticamente”.) No entanto, ao usar múltiplos servidores, é necessário que cada um use seu próprio valor para opções como o Unix socket file e o número da porta TCP/IP. Para obter mais informações sobre quais opções devem ser únicas por servidor em um ambiente de múltiplos servidores, consulte a Seção 5.7, “Executando Múltiplas Instâncias MySQL em Uma Máquina”.

Para invocar o **mysqld_multi**, use a seguinte sintaxe:

```sql
mysqld_multi [options] {start|stop|reload|report} [GNR[,GNR] ...]
```

`start`, `stop`, `reload` (parar e reiniciar) e `report` indicam qual operação executar. Você pode executar a operação designada para um único servidor ou múltiplos servidores, dependendo da lista *`GNR`* que segue o nome da opção. Se não houver lista, o **mysqld_multi** executa a operação para todos os servidores no option file.

Cada valor *`GNR`* representa um número de grupo de opções ou um intervalo de números de grupo. O valor deve ser o número no final do nome do grupo no option file. Por exemplo, o *`GNR`* para um grupo nomeado `[mysqld17]` é `17`. Para especificar um intervalo de números, separe o primeiro e o último número por um traço. O valor *`GNR`* `10-13` representa os grupos `[mysqld10]` até `[mysqld13]`. Múltiplos grupos ou intervalos de grupos podem ser especificados na command line, separados por vírgulas. Não deve haver caracteres de espaço em branco (espaços ou tabs) na lista *`GNR`*; qualquer coisa após um caractere de espaço em branco é ignorada.

Este comando inicia um único servidor usando o grupo de opções `[mysqld17]`:

```sql
mysqld_multi start 17
```

Este comando para diversos servidores, usando os grupos de opções `[mysqld8]` e `[mysqld10]` até `[mysqld13]`:

```sql
mysqld_multi stop 8,10-13
```

Para um exemplo de como você pode configurar um option file, use este comando:

```sql
mysqld_multi --example
```

O **mysqld_multi** busca por option files da seguinte forma:

* Com `--no-defaults`, nenhum option file é lido.

  <table frame="box" rules="all" summary="Propriedades para no-defaults"><tbody><tr><th>Formato da Command-Line</th> <td><code>--no-defaults</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>false</code></td> </tr></tbody></table>

* Com `--defaults-file=file_name`, apenas o arquivo nomeado é lido.

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody><tr><th>Formato da Command-Line</th> <td><code>--defaults-file=filename</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

* Caso contrário, os option files na lista padrão de localizações são lidos, incluindo qualquer arquivo nomeado pela opção `--defaults-extra-file=file_name`, se for fornecido. (Se a opção for fornecida várias vezes, o último valor é usado.)

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato da Command-Line</th> <td><code>--defaults-extra-file=filename</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

Para informações adicionais sobre estas e outras opções de option file, consulte a Seção 4.2.2.3, “Opções da Command-Line que Afetam o Tratamento de Option Files”.

Os option files lidos são verificados quanto aos grupos de opções `[mysqld_multi]` e `[mysqldN]`. O grupo `[mysqld_multi]` pode ser usado para opções destinadas ao próprio **mysqld_multi**. Os grupos `[mysqldN]` podem ser usados para opções passadas a instâncias **mysqld** específicas.

Os grupos `[mysqld]` ou `[mysqld_safe]` podem ser usados para opções comuns lidas por todas as instâncias do **mysqld** ou **mysqld_safe**. Você pode especificar uma opção `--defaults-file=file_name` para usar um arquivo de configuração diferente para aquela instância, caso em que os grupos `[mysqld]` ou `[mysqld_safe]` desse arquivo serão usados para aquela instância.

O **mysqld_multi** suporta as seguintes opções.

* `--help`

  <table frame="box" rules="all" summary="Propriedades para help"><tbody><tr><th>Formato da Command-Line</th> <td><code>--help</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>false</code></td> </tr></tbody></table>

  Exibe uma mensagem de ajuda e sai.

* `--example`

  <table frame="box" rules="all" summary="Propriedades para example"><tbody><tr><th>Formato da Command-Line</th> <td><code>--example</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>false</code></td> </tr></tbody></table>

  Exibe um option file de exemplo.

* `--log=file_name`

  <table frame="box" rules="all" summary="Propriedades para log"><tbody><tr><th>Formato da Command-Line</th> <td><code>--log=path</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>/var/log/mysqld_multi.log</code></td> </tr></tbody></table>

  Especifica o nome do log file. Se o arquivo existir, a saída do log é anexada a ele.

* `--mysqladmin=prog_name`

  <table frame="box" rules="all" summary="Propriedades para mysqladmin"><tbody><tr><th>Formato da Command-Line</th> <td><code>--mysqladmin=file</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  O binário **mysqladmin** a ser usado para parar servidores.

* `--mysqld=prog_name`

  <table frame="box" rules="all" summary="Propriedades para mysqld"><tbody><tr><th>Formato da Command-Line</th> <td><code>--mysqld=file</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  O binário **mysqld** a ser usado. Note que você também pode especificar **mysqld_safe** como o valor para esta opção. Se você usar o **mysqld_safe** para iniciar o servidor, você pode incluir as opções `mysqld` ou `ledir` no grupo de opções `[mysqldN]` correspondente. Estas opções indicam o nome do servidor que o **mysqld_safe** deve iniciar e o nome do caminho do diretório onde o servidor está localizado. (Veja as descrições para estas opções na Seção 4.3.2, “mysqld_safe — Script de Inicialização do Servidor MySQL”.) Exemplo:

  ```sql
  [mysqld38]
  mysqld = mysqld-debug
  ledir  = /opt/local/mysql/libexec
  ```

* `--no-log`

  <table frame="box" rules="all" summary="Propriedades para no-log"><tbody><tr><th>Formato da Command-Line</th> <td><code>--no-log</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>false</code></td> </tr></tbody></table>

  Imprime informações de log no `stdout` em vez de no log file. Por padrão, a saída vai para o log file.

* `--password=password`

  <table frame="box" rules="all" summary="Propriedades para password"><tbody><tr><th>Formato da Command-Line</th> <td><code>--password=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  A password da conta MySQL a ser usada ao invocar o **mysqladmin**. Note que o valor da password não é opcional para esta opção, diferentemente de outros programas MySQL.

* `--silent`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody><tr><th>Formato da Command-Line</th> <td><code>--defaults-file=filename</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Modo silencioso; desabilita avisos (warnings).

* `--tcp-ip`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody><tr><th>Formato da Command-Line</th> <td><code>--defaults-file=filename</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Conecta-se a cada servidor MySQL através da porta TCP/IP em vez do Unix socket file. (Se um socket file estiver faltando, o servidor ainda pode estar em execução, mas acessível apenas através da porta TCP/IP.) Por padrão, as conexões são feitas usando o Unix socket file. Esta opção afeta as operações `stop` e `report`.

* `--user=user_name`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody><tr><th>Formato da Command-Line</th> <td><code>--defaults-file=filename</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  O user name da conta MySQL a ser usada ao invocar o **mysqladmin**.

* `--verbose`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody><tr><th>Formato da Command-Line</th> <td><code>--defaults-file=filename</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Seja mais verboso.

* `--version`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody><tr><th>Formato da Command-Line</th> <td><code>--defaults-file=filename</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Exibe informações de versão e sai.

Algumas notas sobre o **mysqld_multi**:

* **Mais importante**: Antes de usar o **mysqld_multi**, certifique-se de que você entende o significado das opções que são passadas aos servidores **mysqld** e *por que* você gostaria de ter processos **mysqld** separados. Cuidado com os perigos de usar múltiplos servidores **mysqld** com o mesmo data directory. Use data directories separados, a menos que você *saiba* o que está fazendo. Iniciar múltiplos servidores com o mesmo data directory *não* lhe dará desempenho extra em um threaded system. Consulte a Seção 5.7, “Executando Múltiplas Instâncias MySQL em Uma Máquina”.

  Importante

  Certifique-se de que o data directory para cada servidor esteja totalmente acessível à conta Unix pela qual o processo **mysqld** específico é iniciado. *Não* use a conta *root* do Unix para isso, a menos que você *saiba* o que está fazendo. Consulte a Seção 6.1.5, “Como Executar o MySQL como um Usuário Normal”.

* Certifique-se de que a conta MySQL usada para parar os servidores **mysqld** (com o programa **mysqladmin**) tenha o mesmo user name e password para cada servidor. Além disso, certifique-se de que a conta tenha o privilege `SHUTDOWN`. Se os servidores que você deseja gerenciar tiverem diferentes user names ou passwords para as contas administrativas, você pode querer criar uma conta em cada servidor que tenha o mesmo user name e password. Por exemplo, você pode configurar uma conta `multi_admin` comum executando os seguintes comandos para cada servidor:

  ```sql
  $> mysql -u root -S /tmp/mysql.sock -p
  Enter password:
  mysql> CREATE USER 'multi_admin'@'localhost' IDENTIFIED BY 'multipass';
  mysql> GRANT SHUTDOWN ON *.* TO 'multi_admin'@'localhost';
  ```

  Consulte a Seção 6.2, “Controle de Acesso e Gerenciamento de Contas”. Você deve fazer isso para cada servidor **mysqld**. Altere os parâmetros de conexão apropriadamente ao se conectar a cada um. Note que a parte host name do nome da conta deve permitir que você se conecte como `multi_admin` a partir do host onde você deseja executar o [**mysqld_multi**](mysqld-multi.html "4.3.4 mysqld_multi — Gerenciar Múltiplos Servidores MySQL").

* O Unix socket file e o número da porta TCP/IP devem ser diferentes para cada [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL"). (Alternativamente, se o host tiver múltiplos endereços de rede, você pode definir a system variable [`bind_address`](server-system-variables.html#sysvar_bind_address) para fazer com que servidores diferentes escutem em interfaces diferentes.)

* A opção [`--pid-file`](mysqld-safe.html#option_mysqld_safe_pid-file) é muito importante se você estiver usando [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — Script de Inicialização do Servidor MySQL") para iniciar o [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL") (por exemplo, [`--mysqld=mysqld_safe`](mysqld-safe.html#option_mysqld_safe_mysqld)). Cada [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL") deve ter seu próprio PID file (arquivo de ID de processo). A vantagem de usar o [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — Script de Inicialização do Servidor MySQL") em vez do [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL") é que o [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — Script de Inicialização do Servidor MySQL") monitora seu processo [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL") e o reinicia se o processo terminar devido a um signal enviado usando `kill -9` ou por outras razões, como um segmentation fault.

* Você pode querer usar a opção [`--user`](server-options.html#option_mysqld_user) para o [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL"), mas para fazer isso você precisa executar o script [**mysqld_multi**](mysqld-multi.html "4.3.4 mysqld_multi — Gerenciar Múltiplos Servidores MySQL") como o superuser Unix (`root`). Ter a opção no option file não importa; você apenas receberá um aviso se não for o superuser e os processos [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL") forem iniciados sob sua própria conta Unix.

O exemplo a seguir mostra como você pode configurar um option file para uso com o [**mysqld_multi**](mysqld-multi.html "4.3.4 mysqld_multi — Gerenciar Múltiplos Servidores MySQL"). A ordem em que os programas [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL") são iniciados ou parados depende da ordem em que aparecem no option file. Os números de grupo não precisam formar uma sequência ininterrupta. Os primeiros e quintos grupos `[mysqldN]` foram intencionalmente omitidos do exemplo para ilustrar que você pode ter “lacunas” no option file. Isso lhe dá mais flexibilidade.

```sql
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

Consulte [Seção 4.2.2.2, “Usando Option Files”](option-files.html "4.2.2.2 Usando Option Files").