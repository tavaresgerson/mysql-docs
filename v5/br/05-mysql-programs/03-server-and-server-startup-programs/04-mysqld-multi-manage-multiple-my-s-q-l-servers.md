### 4.3.4 mysqld\_multi — Gerenciar múltiplos servidores MySQL

O **mysqld\_multi** é projetado para gerenciar vários processos **mysqld** que escutam conexões em diferentes arquivos de soquete Unix e portas TCP/IP. Ele pode iniciar ou parar servidores ou relatar seu status atual.

Nota

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte ao systemd para gerenciar o início e o desligamento do servidor MySQL. Nessas plataformas, o **mysqld\_multi** não é instalado porque é desnecessário. Para obter informações sobre como usar o systemd para gerenciar múltiplas instâncias do MySQL, consulte a Seção 2.5.10, “Gerenciamento do Servidor MySQL com o systemd”.

O **mysqld\_multi** procura por grupos nomeados `[mysqldN]` em `my.cnf` (ou no arquivo nomeado pela opção `--defaults-file`). *`N`* pode ser qualquer número inteiro positivo. Esse número é referido na discussão a seguir como o número do grupo de opções, ou *`GNR`*. Os números de grupo distinguem os grupos de opções uns dos outros e são usados como argumentos para o **mysqld\_multi** para especificar quais servidores você deseja iniciar, parar ou obter um relatório de status para. As opções listadas nesses grupos são as mesmas que você usaria no grupo `[mysqld]` usado para iniciar o **mysqld**. (Veja, por exemplo, a Seção 2.9.5, “Iniciar e Parar o MySQL Automaticamente”.) No entanto, ao usar múltiplos servidores, é necessário que cada um use seu próprio valor para opções como o arquivo de soquete Unix e o número da porta TCP/IP. Para mais informações sobre quais opções devem ser únicas por servidor em um ambiente com múltiplos servidores, consulte a Seção 5.7, “Executar Instâncias Múltiplas do MySQL em Uma Máquina”.

Para invocar o **mysqld\_multi**, use a seguinte sintaxe:

```sql
mysqld_multi [options] {start|stop|reload|report} [GNR[,GNR] ...]
```

`start`, `stop`, `reload` (parar e reiniciar) e `report` indicam qual operação deve ser realizada. Você pode realizar a operação designada para um único servidor ou para vários servidores, dependendo da lista *`GNR`* que segue o nome da opção. Se não houver lista, o **mysqld\_multi** realiza a operação para todos os servidores no arquivo de opção.

Cada valor de *`GNR`* representa um número de grupo de opções ou uma faixa de números de grupo. O valor deve ser o número no final do nome do grupo no arquivo de opções. Por exemplo, o *`GNR`* para um grupo chamado `[mysqld17]` é `17`. Para especificar uma faixa de números, separe o primeiro e o último número por hífen. O valor de *`GNR`* `10-13` representa os grupos `[mysqld10]` a `[mysqld13]`. Vários grupos ou faixas de grupos podem ser especificados na linha de comando, separados por vírgulas. Não deve haver caracteres de espaço em branco (espaços ou tabulações) na lista de *`GNR`*; qualquer coisa após um caractere de espaço em branco é ignorada.

Este comando inicia um único servidor usando o grupo de opções `[mysqld17]`:

```sql
mysqld_multi start 17
```

Este comando para de vários servidores, usando grupos de opções `[mysqld8]` e `[mysqld10]` através de `[mysqld13]`:

```sql
mysqld_multi stop 8,10-13
```

Para um exemplo de como você pode configurar um arquivo de opção, use este comando:

```sql
mysqld_multi --example
```

O **mysqld\_multi** procura por arquivos de opção da seguinte forma:

- Com `--no-defaults`, nenhum arquivo de opção é lido.

  <table frame="box" rules="all" summary="Propriedades sem penalidades"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--no-defaults</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">false</code>]]</td> </tr></tbody></table>

- Com `--defaults-file=file_name`, apenas o arquivo nomeado é lido.

  <table frame="box" rules="all" summary="Propriedades para arquivo de falhas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-file=filename</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

- Caso contrário, os arquivos de opções na lista padrão de locais são lidos, incluindo qualquer arquivo nomeado pela opção `--defaults-extra-file=file_name`, se um for fornecido. (Se a opção for fornecida várias vezes, o último valor é usado.)

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-extra-file=filename</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

Para obter informações adicionais sobre essas e outras opções de arquivo de opções, consulte a Seção 4.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.

Os arquivos de opção lidos são pesquisados pelos grupos de opções `[mysqld_multi]` e `[mysqldN]`. O grupo `[mysqld_multi]` pode ser usado para opções para o **mysqld\_multi** em si. Os grupos `[mysqldN]` podem ser usados para opções passadas para instâncias específicas do **mysqld**.

Os grupos `[mysqld]` ou `[mysqld_safe]` podem ser usados para opções comuns lidas por todas as instâncias do **mysqld** ou **mysqld\_safe**. Você pode especificar uma opção `--defaults-file=file_name` para usar um arquivo de configuração diferente para essa instância, caso em que os grupos `[mysqld]` ou `[mysqld_safe]` desse arquivo são usados para essa instância.

O **mysqld\_multi** suporta as seguintes opções.

- `--help`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--help</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">false</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia.

- `--example`

  <table frame="box" rules="all" summary="Propriedades, por exemplo"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--example</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">false</code>]]</td> </tr></tbody></table>

  Exibir um arquivo de opção de amostra.

- `--log=nome_do_arquivo`

  <table frame="box" rules="all" summary="Propriedades para log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--log=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">/var/log/mysqld_multi.log</code>]]</td> </tr></tbody></table>

  Especifique o nome do arquivo de registro. Se o arquivo existir, a saída do log será anexada a ele.

- `--mysqladmin=nome_do_programa`

  <table frame="box" rules="all" summary="Propriedades para mysqladmin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--mysqladmin=file</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  O binário **mysqladmin** a ser usado para parar os servidores.

- `--mysqld=nome_do_programa`

  <table frame="box" rules="all" summary="Propriedades para mysqld"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--mysqld=file</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  O binário **mysqld** a ser usado. Note que você também pode especificar **mysqld\_safe** como o valor para essa opção. Se você usar **mysqld\_safe** para iniciar o servidor, pode incluir as opções `mysqld` ou `ledir` no grupo de opções correspondente `[mysqldN]`. Essas opções indicam o nome do servidor que **mysqld\_safe** deve iniciar e o nome do caminho do diretório onde o servidor está localizado. (Veja as descrições dessas opções na Seção 4.3.2, “mysqld\_safe — Script de Inicialização do Servidor MySQL”.) Exemplo:

  ```sql
  [mysqld38]
  mysqld = mysqld-debug
  ledir  = /opt/local/mysql/libexec
  ```

- `--no-log`

  <table frame="box" rules="all" summary="Propriedades sem registro"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--no-log</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">false</code>]]</td> </tr></tbody></table>

  Imprima as informações do log no `stdout` em vez de no arquivo de log. Por padrão, a saída vai para o arquivo de log.

- `--password=senha`

  <table frame="box" rules="all" summary="Propriedades para senha"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--password=string</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>

  A senha da conta MySQL a ser usada ao invocar o **mysqladmin**. Observe que o valor da senha não é opcional para esta opção, ao contrário de outros programas do MySQL.

- `--silent`

  <table frame="box" rules="all" summary="Propriedades para arquivo de falhas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-file=filename</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>0

  Modo silencioso; desative as advertências.

- `--tcp-ip`

  <table frame="box" rules="all" summary="Propriedades para arquivo de falhas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-file=filename</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>1

  Conecte-se a cada servidor MySQL através da porta TCP/IP em vez do arquivo de soquete Unix. (Se um arquivo de soquete estiver ausente, o servidor ainda pode estar em execução, mas será acessível apenas através da porta TCP/IP.) Por padrão, as conexões são feitas usando o arquivo de soquete Unix. Esta opção afeta as operações `stop` e `report`.

- `--user=nome_do_usuário`

  <table frame="box" rules="all" summary="Propriedades para arquivo de falhas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-file=filename</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>2

  O nome de usuário da conta MySQL a ser usado ao invocar o **mysqladmin**.

- `--verbose`

  <table frame="box" rules="all" summary="Propriedades para arquivo de falhas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-file=filename</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>3

  Seja mais verbose.

- `--version`

  <table frame="box" rules="all" summary="Propriedades para arquivo de falhas"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--defaults-file=filename</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">[none]</code>]]</td> </tr></tbody></table>4

  Exibir informações da versão e sair.

Algumas notas sobre **mysqld\_multi**:

- **Mais importante**: Antes de usar o **mysqld\_multi**, certifique-se de entender o significado das opções passadas aos servidores **mysqld** e *por que* você gostaria de ter processos **mysqld** separados. Esteja ciente dos perigos de usar múltiplos servidores **mysqld** com o mesmo diretório de dados. Use diretórios de dados separados, a menos que você *saiba* o que está fazendo. Iniciar múltiplos servidores com o mesmo diretório de dados *não* lhe dará um desempenho extra em um sistema com múltiplos threads. Veja a Seção 5.7, “Executando múltiplas instâncias do MySQL em uma única máquina”.

  Importante

  Certifique-se de que o diretório de dados de cada servidor seja totalmente acessível à conta Unix na qual o processo específico do **mysqld** é iniciado. *Não* use a conta Unix *`root`* para isso, a menos que você saiba o que está fazendo. Veja a Seção 6.1.5, “Como executar o MySQL como um usuário normal”.

- Certifique-se de que a conta do MySQL usada para interromper os servidores **mysqld** (com o programa **mysqladmin**) tenha o mesmo nome de usuário e senha para cada servidor. Além disso, certifique-se de que a conta tenha o privilégio `SHUTDOWN`. Se os servidores que você deseja gerenciar tiverem nomes de usuário ou senhas diferentes para as contas administrativas, você pode querer criar uma conta em cada servidor que tenha o mesmo nome de usuário e senha. Por exemplo, você pode configurar uma conta comum `multi_admin` executando os seguintes comandos para cada servidor:

  ```sql
  $> mysql -u root -S /tmp/mysql.sock -p
  Enter password:
  mysql> CREATE USER 'multi_admin'@'localhost' IDENTIFIED BY 'multipass';
  mysql> GRANT SHUTDOWN ON *.* TO 'multi_admin'@'localhost';
  ```

  Veja a Seção 6.2, “Controle de Acesso e Gerenciamento de Contas”. Você precisa fazer isso para cada servidor **mysqld**. Altere os parâmetros de conexão conforme apropriado ao se conectar a cada um deles. Observe que a parte do nome do host do nome da conta deve permitir que você se conecte como `multi_admin` a partir do host onde você deseja executar **mysqld\_multi**.

- O arquivo de socket Unix e o número da porta TCP/IP devem ser diferentes para cada **mysqld**. (Alternativamente, se o host tiver múltiplos endereços de rede, você pode definir a variável de sistema `bind_address` para fazer com que diferentes servidores ouçam interfaces diferentes.)

- A opção `--pid-file` é muito importante se você estiver usando **mysqld\_safe** para iniciar **mysqld** (por exemplo, `--mysqld=mysqld_safe`) Cada **mysqld** deve ter seu próprio arquivo de ID de processo. A vantagem de usar **mysqld\_safe** em vez de **mysqld** é que **mysqld\_safe** monitora seu processo **mysqld** e o reinicia se o processo terminar devido a um sinal enviado usando `kill -9` ou por outros motivos, como um erro de segmentação.

- Você pode querer usar a opção `--user` para o **mysqld**, mas para fazer isso, você precisa executar o script **mysqld\_multi** como o superusuário do Unix (`root`). Ter a opção no arquivo de opções não importa; você apenas recebe um aviso se não for o superusuário e os processos do **mysqld** forem iniciados na sua própria conta do Unix.

O exemplo a seguir mostra como você pode configurar um arquivo de opções para uso com **mysqld\_multi**. A ordem em que os programas **mysqld** são iniciados ou interrompidos depende da ordem em que aparecem no arquivo de opções. Os números dos grupos não precisam formar uma sequência ininterrupta. Os primeiros e os cinco grupos `[mysqldN]` foram intencionalmente omitidos do exemplo para ilustrar que você pode ter “lacunas” no arquivo de opções. Isso lhe dá mais flexibilidade.

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

Veja Seção 4.2.2.2, “Usando arquivos de opção”.
