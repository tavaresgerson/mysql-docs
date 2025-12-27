### 6.3.4 mysqld_multi — Gerenciar Vários Servidores MySQL

O **mysqld_multi** é projetado para gerenciar vários processos **mysqld** que escutam conexões em diferentes arquivos de soquete Unix e portas TCP/IP. Ele pode iniciar ou parar servidores ou reportar seu status atual.

Nota

Para algumas plataformas Linux, a instalação do MySQL a partir de pacotes RPM ou Debian inclui suporte do systemd para gerenciar o início e o desligamento do servidor MySQL. Nessas plataformas, o **mysqld_multi** não é instalado porque é desnecessário. Para obter informações sobre como usar o systemd para gerenciar múltiplas instâncias do MySQL, consulte a Seção 2.5.9, “Gerenciando o Servidor MySQL com o systemd”.

O **mysqld_multi** procura por grupos nomeados `[mysqldN]` em `my.cnf` (ou no arquivo nomeado pela opção `--defaults-file`). *`N`* pode ser qualquer inteiro positivo. Esse número é referido na discussão a seguir como o número do grupo de opção, ou *`GNR`*. Os números de grupo distinguem os grupos de opções uns dos outros e são usados como argumentos para o **mysqld_multi** para especificar quais servidores você deseja iniciar, parar ou obter um relatório de status para. As opções listadas nesses grupos são as mesmas que você usaria no grupo `[mysqld]` usado para iniciar o **mysqld**. (Veja, por exemplo, a Seção 2.9.5, “Iniciando e Parando o MySQL Automaticamente”.) No entanto, ao usar múltiplos servidores, é necessário que cada um use seu próprio valor para opções como o arquivo de soquete Unix e o número da porta TCP/IP. Para obter mais informações sobre quais opções devem ser únicas por servidor em um ambiente de múltiplos servidores, consulte a Seção 7.8, “Executando Múltiplas Instâncias do MySQL em uma Máquina”.

Para invocar o **mysqld_multi**, use a seguinte sintaxe:

```
mysqld_multi [options] {start|stop|reload|report} [GNR[,GNR] ...]
```

`start`, `stop`, `reload` (parar e reiniciar) e `report` indicam qual operação realizar. Você pode realizar a operação designada para um único servidor ou para vários servidores, dependendo da lista *`GNR`* que segue o nome da opção. Se não houver lista, o **mysqld\_multi** realiza a operação para todos os servidores no arquivo de opção.

Cada valor *`GNR`* representa um número de grupo de opções ou uma faixa de números de grupo. O valor deve ser o número no final do nome do grupo no arquivo de opção. Por exemplo, o *`GNR`* para um grupo chamado `[mysqld17]` é `17`. Para especificar uma faixa de números, separe os primeiros e últimos números com um hífen. O valor *`GNR`* `10-13` representa os grupos `[mysqld10]` a `[mysqld13]`. Vários grupos ou faixas de grupos podem ser especificados na linha de comando, separados por vírgulas. Não deve haver caracteres de espaço em branco (espaços ou tabulações) na lista *`GNR`*; qualquer coisa após um caractere de espaço em branco é ignorada.

Este comando inicia um único servidor usando o grupo de opção `[mysqld17]`:

```
mysqld_multi start 17
```

Este comando para vários servidores, usando os grupos de opção `[mysqld8]` e `[mysqld10]` a `[mysqld13]`:

```
mysqld_multi stop 8,10-13
```

Para um exemplo de como você pode configurar um arquivo de opção, use este comando:

```
mysqld_multi --example
```

O **mysqld\_multi** busca arquivos de opção da seguinte forma:

* Com `--no-defaults`, nenhum arquivo de opção é lido.

<table frame="box" rules="all" summary="Propriedades para não-padrão"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--no-defaults</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">false</code></td> </tr></tbody></table>

* Com `--defaults-file=nome_do_arquivo`, apenas o arquivo nomeado é lido.

<table frame="box" rules="all" summary="Propriedades para defaults-file">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--defaults-file=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">[nenhum]</code></td>
  </tr>
  </tbody>
</table>

* Caso contrário, os arquivos de opções na lista padrão de locais são lidos, incluindo qualquer arquivo nomeado pela opção `--defaults-extra-file=nome_do_arquivo`, se um for fornecido. (Se a opção for fornecida várias vezes, o último valor é usado.)

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--defaults-extra-file=nome_do_arquivo</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Nome do arquivo</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal">[nenhum]</code></td>
    </tr>
  </tbody>
</table>

Para obter informações adicionais sobre essas e outras opções de arquivos de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.

Os grupos de opções de arquivos lidos são pesquisados pelos grupos de opções `[mysqld_multi]` e `[mysqldN]`. O grupo `[mysqld_multi]` pode ser usado para opções do **mysqld\_multi** em si. Os grupos `[mysqldN]` podem ser usados para opções passadas a instâncias específicas do **mysqld**.

Os grupos `[mysqld]` ou `[mysqld_safe]` podem ser usados para opções comuns lidas por todas as instâncias do **mysqld** ou **mysqld\_safe**. Você pode especificar uma opção `--defaults-file=nome_do_arquivo` para usar um arquivo de configuração diferente para essa instância, caso em que os grupos `[mysqld]` ou `[mysqld_safe]` desse arquivo são usados para essa instância.

O **mysqld\_multi** suporta as seguintes opções.

* `--help`

<table frame="box" rules="all" summary="Propriedades de ajuda">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--help</code></td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">false</code></td> </tr>
  <tr><th></th></tr>
  <tr><th>Exemplo</th> <td><code class="literal">--example</code></td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">false</code></td> </tr>
  <tr><th></th></tr>
  <tr><th>Log</th> <td><code class="literal">--log=nome_do_arquivo</code></td> </tr>
  <tr><th>Tipo</th> <td>Nome do arquivo</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">/var/log/mysqld_multi.log</code></td> </tr>
  <tr><th></th></tr>
  <tr><th>mysqladmin</th> <td><code class="literal">--mysqladmin=nome_do_programa</code></td> </tr>
  <tr><th>Tipo</th> <td>Nome do arquivo</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr>
  <tr><th></th></tr>
  <tr><th>mysqld</th> <td><code class="literal">--mysqld=nome_do_programa</code></td> </tr>
</table>

Exibir uma mensagem de ajuda e sair.

* `--example`

<table frame="box" rules="all" summary="Propriedades de exemplo"><col style="width: 30%"/><col style="width: 70%"/>
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--example</code></td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">false</code></td> </tr>
  <tr><th></th></tr>
  <tr><th>Exemplo</th> <td><code class="literal">--example</code></td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">false</code></td> </tr>
  <tr><th></th></tr>
  <tr><th>Log</th> <td><code class="literal">--log=caminho</code></td> </tr>
  <tr><th>Tipo</th> <td>Nome do arquivo</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">/var/log/mysqld_multi.log</code></td> </tr>
  <tr><th></th></tr>
  <tr><th>mysqladmin</th> <td><code class="literal">--mysqladmin=arquivo</code></td> </tr>
  <tr><th>Tipo</th> <td>Nome do arquivo</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr>
  <tr><th></th></tr>
  <tr><th>mysqld</th> <td><code class="literal">--mysqld=arquivo</code></td> </tr>
</table>

Especificar o nome do arquivo de log. Se o arquivo existir, a saída do log é anexada a ele.

* `--mysqladmin=nome_do_programa`

<table frame="box" rules="all" summary="Propriedades de mysqladmin"><col style="width: 30%"/><col style="width: 70%"/>
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--mysqladmin=arquivo</code></td> </tr>
  <tr><th>Tipo</th> <td>Nome do arquivo</td> </tr>
  <tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr>
  <tr><th></th></tr>
</table>

O **binário mysqladmin** a ser usado para parar os servidores.

* `--mysqld=nome_do_programa`

<table frame="box" rules="all" summary="Propriedades para mysqld">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--mysqld=arquivo</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">[nenhum]</code></td>
  </tr>
  </tbody>
</table>

  O **binário mysqld** a ser usado. Note que você pode especificar **mysqld_safe** como o valor para essa opção também. Se você usar **mysqld_safe** para iniciar o servidor, pode incluir as opções `mysqld` ou `ledir` no grupo de opções correspondente `[mysqldN]`. Essas opções indicam o nome do servidor que **mysqld_safe** deve iniciar e o nome do diretório onde o servidor está localizado. (Veja as descrições dessas opções na Seção 6.3.2, “mysqld_safe — Script de inicialização do servidor MySQL”.) Exemplo:

  ```
  [mysqld38]
  mysqld = mysqld-debug
  ledir  = /opt/local/mysql/libexec
  ```

* `--no-log`

  <table frame="box" rules="all" summary="Propriedades para no-log">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--no-log</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Booleano</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal">false</code></td>
    </tr>
  </tbody>
</table>

  Imprima as informações do log no `stdout` em vez de no arquivo de log. Por padrão, a saída vai para o arquivo de log.

* `--password=senha`

  <table frame="box" rules="all" summary="Propriedades para senha">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--password=string</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code class="literal">[nenhum]</code></td>
    </tr>
  </tbody>
</table>

A senha da conta MySQL a ser usada ao invocar o **mysqladmin**. Note que o valor da senha não é opcional para esta opção, ao contrário de outros programas do MySQL.

* `--silent`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--defaults-file=filename</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>0

  Modo silencioso; desative as mensagens de aviso.

* `--tcp-ip`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--defaults-file=filename</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>1

  Conecte-se a cada servidor MySQL através da porta TCP/IP em vez do arquivo de socket Unix. (Se um arquivo de socket estiver ausente, o servidor ainda pode estar em execução, mas acessível apenas através da porta TCP/IP.) Por padrão, as conexões são feitas usando o arquivo de socket Unix. Esta opção afeta as operações `stop` e `report`.

* `--user=user_name`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--defaults-file=filename</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>2

  O nome de usuário da conta MySQL a ser usado ao invocar o **mysqladmin**.

<table frame="box" rules="all" summary="Propriedades para defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--defaults-file=filename</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>3

  Seja mais detalhado.

* `--version`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--defaults-file=filename</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>4

  Exibir informações da versão e sair.

Algumas notas sobre **mysqld\_multi**:

* **Mais importante**: Antes de usar **mysqld\_multi**, certifique-se de entender o significado das opções passadas aos servidores **mysqld** e *por que* você gostaria de ter processos **mysqld** separados. Tenha cuidado com os perigos de usar múltiplos servidores **mysqld** com o mesmo diretório de dados. Use diretórios de dados separados, a menos que você *saiba* o que está fazendo. Iniciar múltiplos servidores com o mesmo diretório de dados *não* lhe dá desempenho extra em um sistema com múltiplos threads. Veja a Seção 7.8, “Executando múltiplas instâncias do MySQL em uma única máquina”.

  Importante

  Certifique-se de que o diretório de dados de cada servidor seja totalmente acessível à conta Unix da qual o processo específico do **mysqld** é iniciado. *Não* use a conta Unix *`root`* para isso, a menos que você *saiba* o que está fazendo. Veja a Seção 8.1.5, “Como executar o MySQL como um usuário normal”.

* Certifique-se de que a conta do MySQL usada para interromper os servidores **mysqld** (com o programa **mysqladmin**) tenha o mesmo nome de usuário e senha para cada servidor. Além disso, certifique-se de que a conta tenha o privilégio `SHUTDOWN`. Se os servidores que você deseja gerenciar tiverem nomes de usuário ou senhas diferentes para as contas administrativas, você pode querer criar uma conta em cada servidor que tenha o mesmo nome de usuário e senha. Por exemplo, você pode configurar uma conta comum `multi_admin` executando os seguintes comandos para cada servidor:

  ```
  $> mysql -u root -S /tmp/mysql.sock -p
  Enter password:
  mysql> CREATE USER 'multi_admin'@'localhost' IDENTIFIED BY 'multipass';
  mysql> GRANT SHUTDOWN ON *.* TO 'multi_admin'@'localhost';
  ```

  Veja a Seção 8.2, “Controle de Acesso e Gerenciamento de Contas”. Você precisa fazer isso para cada servidor **mysqld**. Altere os parâmetros de conexão conforme necessário ao se conectar a cada um. Observe que a parte do nome da conta que contém o nome do host deve permitir que você se conecte como `multi_admin` a partir do host onde você deseja executar o **mysqld\_multi**.

* O arquivo de socket Unix e o número da porta TCP/IP devem ser diferentes para cada **mysqld**. (Alternativamente, se o host tiver múltiplos endereços de rede, você pode definir a variável de sistema `bind_address` para fazer com que diferentes servidores ouçam interfaces diferentes.)

* A opção `--pid-file` é muito importante se você estiver usando **mysqld\_safe** para iniciar o **mysqld** (por exemplo, `--mysqld=mysqld_safe`) Cada **mysqld** deve ter seu próprio arquivo de ID de processo. A vantagem de usar **mysqld\_safe** em vez de **mysqld** é que **mysqld\_safe** monitora seu processo **mysqld** e o reinicia se o processo terminar devido a um sinal enviado usando `kill -9` ou por outros motivos, como uma falha de segmentação.

* Você pode querer usar a opção `--user` para o **mysqld**, mas para isso, você precisa executar o script **mysqld_multi** como o superusuário do Unix (`root`). Ter a opção no arquivo de opções não importa; você apenas recebe um aviso se você não for o superusuário e os processos do **mysqld** forem iniciados na sua própria conta do Unix.

O exemplo a seguir mostra como você pode configurar um arquivo de opções para uso com o **mysqld_multi**. A ordem em que os programas do **mysqld** são iniciados ou interrompidos depende da ordem em que aparecem no arquivo de opções. Os grupos de números não precisam formar uma sequência ininterrupta. Os primeiros e os cinco grupos `[mysqldN]` foram intencionalmente omitidos do exemplo para ilustrar que você pode ter "lacunas" no arquivo de opções. Isso lhe dá mais flexibilidade.

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