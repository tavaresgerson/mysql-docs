#### B.3.2.2 Não é possível conectar ao MySQL server [local]

Um MySQL client no Unix pode se conectar ao **mysqld** server de duas maneiras diferentes: Usando um Unix socket file para conectar-se através de um arquivo no sistema de arquivos (o padrão é `/tmp/mysql.sock`), ou usando TCP/IP, que conecta através de um número de port. Uma conexão por Unix socket file é mais rápida que TCP/IP, mas só pode ser usada ao se conectar a um Server no mesmo computador. Um Unix socket file é usado se você não especificar um nome de host ou se especificar o nome de host especial `localhost`.

Se o MySQL server estiver rodando no Windows, você pode se conectar usando TCP/IP. Se o Server for iniciado com a variável de sistema [`named_pipe`](server-system-variables.html#sysvar_named_pipe) habilitada, você também pode se conectar com named pipes se executar o Client no host onde o Server está rodando. O nome do named pipe é `MySQL` por padrão. Se você não fornecer um nome de host ao se conectar ao **mysqld**, um MySQL client tentará primeiro se conectar ao named pipe. Se isso não funcionar, ele se conecta à port TCP/IP. Você pode forçar o uso de named pipes no Windows usando `.` como nome de host.

O erro (2002) `Can't connect to ...` normalmente significa que não há um MySQL server em execução no sistema ou que você está usando um nome de Unix socket file ou número de port TCP/IP incorreto ao tentar se conectar ao Server. Você também deve verificar se a port TCP/IP que está usando não foi bloqueada por um Firewall ou por um serviço de bloqueio de port.

O erro (2003) `Can't connect to MySQL server on 'server' (10061)` indica que a conexão de rede foi recusada. Você deve verificar se há um MySQL server em execução, se ele tem conexões de rede habilitadas e se a port de rede que você especificou é aquela configurada no Server.

Comece verificando se há um Process chamado **mysqld** em execução no seu host Server. (Use **ps xa | grep mysqld** no Unix ou o Task Manager no Windows.) Se não houver tal Process, você deve iniciar o Server. Consulte [Section 2.9.2, “Starting the Server”].

Se um Process **mysqld** estiver em execução, você pode verificá-lo tentando os seguintes comandos. O número da port ou o nome do Unix socket file pode ser diferente na sua configuração. `host_ip` representa o endereço IP da máquina onde o Server está rodando.

```sql
$> mysqladmin version
$> mysqladmin variables
$> mysqladmin -h `hostname` version variables
$> mysqladmin -h `hostname` --port=3306 version
$> mysqladmin -h host_ip version
$> mysqladmin --protocol=SOCKET --socket=/tmp/mysql.sock version
```

Observe o uso de *backticks* (crases) em vez de aspas com o comando **hostname**; isso faz com que a saída de **hostname** (ou seja, o nome do host atual) seja substituída no comando **mysqladmin**. Se você não tiver o comando **hostname** ou estiver rodando no Windows, você pode digitar manualmente o nome do host da sua máquina (sem crases) após a opção `-h`. Você também pode tentar `-h 127.0.0.1` para conectar-se com TCP/IP ao host local.

Certifique-se de que o Server não foi configurado para ignorar conexões de rede ou (se você estiver tentando conectar remotamente) que ele não foi configurado para escutar apenas localmente em suas interfaces de rede. Se o Server foi iniciado com a variável de sistema [`skip_networking`](server-system-variables.html#sysvar_skip_networking) habilitada, ele não aceitará nenhuma conexão TCP/IP. Se o Server foi iniciado com a variável de sistema [`bind_address`](server-system-variables.html#sysvar_bind_address) definida como `127.0.0.1`, ele escuta por conexões TCP/IP apenas localmente na interface Loopback e não aceita conexões remotas.

Verifique se não há um Firewall bloqueando o acesso ao MySQL. Seu Firewall pode estar configurado com base na aplicação sendo executada, ou no número da port usada pelo MySQL para comunicação (3306 por padrão). No Linux ou Unix, verifique sua configuração de IP tables (ou similar) para garantir que a port não foi bloqueada. No Windows, aplicações como ZoneAlarm ou Windows Firewall podem precisar ser configuradas para não bloquear a port do MySQL.

Aqui estão algumas razões pelas quais o erro `Can't connect to local MySQL server` pode ocorrer:

* **mysqld** não está rodando no host local. Verifique a lista de Processos do seu sistema operacional para garantir que o Process **mysqld** esteja presente.

* Você está rodando um MySQL server no Windows com muitas conexões TCP/IP. Se você está experimentando que seus Clients recebem esse erro com frequência, você pode encontrar uma solução alternativa aqui: [Section B.3.2.2.1, “Connection to MySQL Server Failing on Windows”].

* Alguém removeu o Unix socket file que o **mysqld** usa (`/tmp/mysql.sock` por padrão). Por exemplo, você pode ter um **cron** job que remove arquivos antigos do diretório `/tmp`. Você pode sempre executar **mysqladmin version** para verificar se o Unix socket file que o **mysqladmin** está tentando usar realmente existe. A correção neste caso é mudar o **cron** job para não remover `mysql.sock` ou colocar o socket file em outro lugar. Consulte [Section B.3.3.6, “How to Protect or Change the MySQL Unix Socket File”].

* Você iniciou o **mysqld** server com a opção [`--socket=/path/to/socket`](server-options.html#option_mysqld_socket), mas esqueceu de informar aos programas Client o novo nome do socket file. Se você alterar o nome do caminho do socket para o Server, você também deve notificar os MySQL clients. Você pode fazer isso fornecendo a mesma opção [`--socket`](connection-options.html#option_general_socket) ao executar programas Client. Você também precisa garantir que os Clients tenham permissão para acessar o arquivo `mysql.sock`. Para descobrir onde está o socket file, você pode fazer:

  ```sql
  $> netstat -ln | grep mysql
  ```

  Consulte [Section B.3.3.6, “How to Protect or Change the MySQL Unix Socket File”].

* Você está usando Linux e um Thread do Server falhou (dumped core). Neste caso, você deve matar os outros Threads **mysqld** (por exemplo, com **kill**) antes de poder reiniciar o MySQL server. Consulte [Section B.3.3.3, “What to Do If MySQL Keeps Crashing”].

* O Server ou o programa Client pode não ter os privilégios de acesso adequados para o diretório que contém o Unix socket file ou o próprio socket file. Neste caso, você deve alterar os privilégios de acesso para o diretório ou socket file para que o Server e os Clients possam acessá-los, ou reiniciar o **mysqld** com uma opção [`--socket`](server-options.html#option_mysqld_socket) que especifique um nome de socket file em um diretório onde o Server possa criá-lo e onde os programas Client possam acessá-lo.

Se você receber a mensagem de erro `Can't connect to MySQL server on some_host`, você pode tentar o seguinte para descobrir qual é o problema:

* Verifique se o Server está rodando naquele host executando `telnet some_host 3306` e pressionando a tecla Enter algumas vezes. (3306 é o número de port padrão do MySQL. Altere o valor se o seu Server estiver escutando em uma port diferente.) Se houver um MySQL server em execução e escutando na port, você deverá obter uma resposta que inclua o número da versão do Server. Se você receber um erro como `telnet: Unable to connect to remote host: Connection refused`, então não há Server rodando na port fornecida.

* Se o Server estiver rodando no host local, tente usar **mysqladmin -h localhost variables** para conectar-se usando o Unix socket file. Verifique o número da port TCP/IP que o Server está configurado para escutar (é o valor da variável [`port`](server-system-variables.html#sysvar_port)).

* Se você estiver rodando no Linux e o Security-Enhanced Linux (SELinux) estiver habilitado, consulte [Section 6.7, “SELinux”].

##### B.3.2.2.1 Falha na Conexão com o MySQL Server no Windows

Quando você está rodando um MySQL server no Windows com muitas conexões TCP/IP, e está percebendo que seus Clients recebem um erro `Can't connect to MySQL server` com bastante frequência, a razão pode ser que o Windows não permite ports efêmeras (de curta duração) suficientes para servir essas conexões.

O propósito do `TIME_WAIT` é manter uma conexão aceitando pacotes mesmo após a conexão ter sido fechada. Isso ocorre porque o roteamento da Internet pode fazer com que um pacote siga uma rota lenta até seu destino e pode chegar depois que ambos os lados concordaram em fechar. Se a port estiver em uso para uma nova conexão, esse pacote da conexão antiga poderá quebrar o protocolo ou comprometer informações pessoais da conexão original. O atraso `TIME_WAIT` previne isso, garantindo que a port não possa ser reutilizada até que tenha decorrido algum tempo para a chegada desses pacotes atrasados.

É seguro reduzir drasticamente o `TIME_WAIT` em conexões LAN porque há pouca chance de pacotes chegarem com atrasos muito longos, como poderia acontecer pela Internet com suas distâncias e latências comparativamente grandes.

O Windows permite ports TCP efêmeras (de curta duração) ao usuário. Depois que qualquer port é fechada, ela permanece no status `TIME_WAIT` por 120 segundos. A port não fica disponível novamente até que esse tempo expire. O range padrão de números de port depende da versão do Windows, com um número mais limitado de ports em versões mais antigas:

* Windows até Server 2003: Ports no range 1025–5000

* Windows Vista, Server 2008 e mais recentes: Ports no range 49152–65535

Com uma pilha pequena de ports TCP disponíveis (5000) e um grande número de ports TCP sendo abertas e fechadas em um curto período de tempo juntamente com o status `TIME_WAIT`, há uma boa chance de você ficar sem ports. Existem duas maneiras de resolver este problema:

* Reduzir o número de ports TCP consumidas rapidamente, investigando o *connection pooling* ou conexões persistentes onde for possível

* Ajustar algumas configurações no Registry do Windows (veja abaixo)

Importante

O procedimento a seguir envolve a modificação do Registry do Windows. Antes de modificar o Registry, certifique-se de fazer um backup e que você entende como restaurá-lo se ocorrer um problema. Para obter informações sobre como fazer backup, restaurar e editar o Registry, consulte o seguinte artigo na Microsoft Knowledge Base: <http://support.microsoft.com/kb/256986/EN-US/>.

1. Inicie o Registry Editor (`Regedt32.exe`).

2. Localize a seguinte Key no Registry:

   ```sql
   HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters
   ```

3. No menu `Edit`, clique em `Add Value` (Adicionar Valor) e adicione o seguinte Registry Value:

   ```sql
   Value Name: MaxUserPort
   Data Type: REG_DWORD
   Value: 65534
   ```

   Isso define o número de ports efêmeras disponíveis para qualquer usuário. O range válido está entre 5000 e 65534 (decimal). O valor padrão é 0x1388 (5000 decimal).

4. No menu `Edit`, clique em `Add Value` (Adicionar Valor) e adicione o seguinte Registry Value:

   ```sql
   Value Name: TcpTimedWaitDelay
   Data Type: REG_DWORD
   Value: 30
   ```

   Isso define o número de segundos para manter uma conexão de port TCP no estado `TIME_WAIT` antes de fechar. O range válido está entre 30 e 300 decimal, embora você possa querer verificar com a Microsoft os valores permitidos mais recentes. O valor padrão é 0x78 (120 decimal).

5. Saia do Registry Editor.
6. Reinicialize a máquina.

Nota: Desfazer o que foi feito acima deve ser tão simples quanto deletar as entradas do Registry que você criou.