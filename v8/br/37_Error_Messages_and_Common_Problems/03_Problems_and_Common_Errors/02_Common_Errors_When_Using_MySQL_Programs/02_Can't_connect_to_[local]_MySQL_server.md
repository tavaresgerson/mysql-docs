#### B.3.2.2 Não consigo me conectar ao servidor MySQL \[local]

Um cliente MySQL no Unix pode se conectar ao servidor **mysqld** de duas maneiras diferentes: usando um arquivo de soquete Unix para se conectar por meio de um arquivo no sistema de arquivos (padrão `/tmp/mysql.sock`), ou usando TCP/IP, que se conecta por meio de um número de porta. Uma conexão por arquivo de soquete Unix é mais rápida que TCP/IP, mas só pode ser usada ao se conectar a um servidor no mesmo computador. Um arquivo de soquete Unix é usado se você não especificar um nome de host ou se especificar o nome de host especial `localhost`.

Se o servidor MySQL estiver em execução no Windows, você pode se conectar usando TCP/IP. Se o servidor estiver iniciado com a variável de sistema `named_pipe` habilitada, você também pode se conectar com tubos nomeados se executar o cliente no host onde o servidor está em execução. O nome do tubo nomeado é `MySQL` por padrão. Se você não fornecer um nome de host ao se conectar ao **mysqld**, um cliente MySQL tentará primeiro se conectar ao tubo nomeado. Se isso não funcionar, ele se conecta à porta TCP/IP. Você pode forçar o uso de tubos nomeados no Windows usando `.` como o nome de host.

O erro (2002) `Can't connect to ...` normalmente significa que não há nenhum servidor MySQL em execução no sistema ou que você está usando um nome de arquivo de soquete Unix ou número de porta TCP/IP incorreto ao tentar se conectar ao servidor. Você também deve verificar se a porta TCP/IP que você está usando não foi bloqueada por um firewall ou serviço de bloqueio de porta.

O erro (2003) `Can't connect to MySQL server on 'server' (10061)` indica que a conexão de rede foi recusada. Você deve verificar se há um servidor MySQL em execução, se as conexões de rede estão habilitadas e se a porta de rede que você especificou é a configurada no servidor.

Comece verificando se há um processo chamado **mysqld** em execução no seu servidor. (Use **ps xa | grep mysqld** no Unix ou o Gerenciador de Tarefas no Windows.) Se não houver esse processo, você deve iniciar o servidor. Veja a Seção 2.9.2, “Iniciando o Servidor”.

Se um processo **mysqld** estiver em execução, você pode verificá-lo tentando os seguintes comandos. O número de porta ou o nome do arquivo de soquete Unix podem ser diferentes no seu ambiente de configuração. `host_ip` representa o endereço IP da máquina onde o servidor está em execução.

```
$> mysqladmin version
$> mysqladmin variables
$> mysqladmin -h `hostname` version variables
$> mysqladmin -h `hostname` --port=3306 version
$> mysqladmin -h host_ip version
$> mysqladmin --protocol=SOCKET --socket=/tmp/mysql.sock version
```

Observe o uso de travessões em vez de aspas simples com o comando **hostname**. Estes fazem com que a saída do **hostname** (ou seja, o nome atual do host) seja substituída pelo comando **mysqladmin**. Se você não tiver o comando **hostname** ou estiver executando no Windows, pode digitar manualmente o nome do host da sua máquina (sem travessões) seguindo a opção `-h`. Você também pode tentar `-h 127.0.0.1` para se conectar ao host local via TCP/IP.

Certifique-se de que o servidor não foi configurado para ignorar conexões de rede ou (se você estiver tentando se conectar remotamente) que ele não foi configurado para ouvir apenas localmente em suas interfaces de rede. Se o servidor foi iniciado com a variável de sistema `skip_networking` habilitada, ele não pode aceitar conexões TCP/IP. Se o servidor foi iniciado com a variável de sistema `bind_address` definida como `127.0.0.1`, ele escuta apenas conexões TCP/IP localmente na interface de loopback e não aceita conexões remotas.

Verifique se não há um firewall bloqueando o acesso ao MySQL. Seu firewall pode estar configurado com base na aplicação que está sendo executada ou no número de porta usado pelo MySQL para comunicação (3306 por padrão). Em Linux ou Unix, verifique a configuração de suas tabelas de IP (ou similar) para garantir que a porta não tenha sido bloqueada. Em Windows, aplicativos como o ZoneAlarm ou o Windows Firewall podem precisar ser configurados para não bloquear a porta do MySQL.

Aqui estão algumas razões pelas quais o erro `Can't connect to local MySQL server` pode ocorrer:

- O **mysqld** não está rodando no host local. Verifique a lista de processos do seu sistema operacional para garantir que o processo **mysqld** esteja presente.

- Você está executando um servidor MySQL no Windows com muitas conexões TCP/IP. Se você estiver enfrentando esse problema com frequência, seus clientes recebem esse erro, você pode encontrar uma solução aqui: Seção B.3.2.2.1, “Conexão ao servidor MySQL falhando no Windows”.

- Alguém removeu o arquivo de soquete Unix que o **mysqld** usa (`/tmp/mysql.sock` por padrão). Por exemplo, você pode ter um **cron** que remove arquivos antigos do diretório `/tmp`. Você sempre pode executar **mysqladmin versão** para verificar se o arquivo de soquete Unix que o **mysqladmin** está tentando usar realmente existe. A solução nesse caso é alterar o **cron** para não remover `mysql.sock` ou para colocar o arquivo de soquete em outro lugar. Veja a Seção B.3.3.6, “Como proteger ou alterar o arquivo de soquete Unix do MySQL”.

- Você iniciou o servidor **mysqld** com a opção `--socket=/path/to/socket`, mas esqueceu de informar aos programas clientes o novo nome do arquivo de soquete. Se você alterar o nome do caminho de soquete para o servidor, também deve notificar os clientes MySQL. Você pode fazer isso fornecendo a mesma opção `--socket` ao executar programas clientes. Você também precisa garantir que os clientes tenham permissão para acessar o arquivo `mysql.sock`. Para descobrir onde está o arquivo de soquete, você pode fazer:

  ```
  $> netstat -ln | grep mysql
  ```

  Consulte a Seção B.3.3.6, “Como proteger ou alterar o arquivo de soquete Unix do MySQL”.

- Você está usando o Linux e um fio do servidor morreu (dumpou o núcleo). Nesse caso, você deve matar os outros fios do **mysqld** (por exemplo, com **kill**) antes de poder reiniciar o servidor MySQL. Veja a Seção B.3.3.3, “O que fazer se o MySQL continuar travando”.

- O servidor ou o programa cliente podem não ter os privilégios de acesso adequados para o diretório que contém o arquivo de soquete Unix ou o próprio arquivo de soquete. Nesse caso, você deve alterar os privilégios de acesso para o diretório ou o arquivo de soquete para que o servidor e os clientes possam acessá-los, ou reiniciar o **mysqld** com uma opção `--socket` que especifique o nome de um arquivo de soquete em um diretório onde o servidor possa criá-lo e onde os programas cliente possam acessá-lo.

Se você receber a mensagem de erro `Can't connect to MySQL server on some_host`, tente as seguintes coisas para descobrir qual é o problema:

- Verifique se o servidor está em execução nesse host executando `telnet some_host 3306` e pressionando a tecla Enter algumas vezes. (3306 é o número de porta padrão do MySQL. Altere o valor se o seu servidor estiver ouvindo uma porta diferente.) Se houver um servidor MySQL em execução e ouvindo a porta, você deve receber uma resposta que inclua o número da versão do servidor. Se você receber um erro como `telnet: Unable to connect to remote host: Connection refused`, então não há nenhum servidor em execução na porta fornecida.

- Se o servidor estiver rodando no host local, tente usar **mysqladmin -h localhost variables** para se conectar usando o arquivo de socket Unix. Verifique o número da porta TCP/IP para a qual o servidor está configurado para ouvir (é o valor da variável `port`.)

- Se você estiver executando sob Linux e o SELinux (Security-Enhanced Linux) estiver habilitado, consulte a Seção 8.7, “SELinux”.

##### B.3.2.2.1 Conexão com o servidor MySQL falhando no Windows

Quando você está executando um servidor MySQL no Windows com muitas conexões TCP/IP, e você está enfrentando esse problema com frequência, onde seus clientes recebem o erro `Can't connect to MySQL server`, a razão pode ser que o Windows não permite que portas efêmeras (de curta duração) sejam usadas para atender essas conexões.

O propósito do `TIME_WAIT` é manter uma conexão aceitando pacotes mesmo após a conexão ter sido fechada. Isso ocorre porque o roteamento da Internet pode fazer com que um pacote tome uma rota lenta para seu destino e ele possa chegar depois que ambos os lados tenham concordado em fechar. Se a porta estiver em uso para uma nova conexão, esse pacote da conexão antiga poderia quebrar o protocolo ou comprometer informações pessoais da conexão original. O atraso do `TIME_WAIT` previne isso, garantindo que a porta não possa ser reutilizada até que algum tempo tenha sido permitido para que esses pacotes atrasados cheguem.

É seguro reduzir `TIME_WAIT` muito nas conexões LAN, pois há pouca chance de os pacotes chegarem com atrasos muito longos, como poderiam fazer na Internet, com suas distâncias e latências comparativamente grandes.

O Windows permite portas TCP efêmeras (de curta duração) para o usuário. Após a fechamento de qualquer porta, ela permanece no estado `TIME_WAIT` por 120 segundos. A porta não estará disponível novamente até que esse tempo expire. A faixa padrão de números de porta depende da versão do Windows, com um número de portas mais limitado em versões mais antigas:

- Windows através do Server 2003: portas na faixa de 1025 a 5000

- Windows Vista, Server 2008 e versões mais recentes: portas na faixa de 49152 a 65535

Com uma pequena pilha de portas TCP disponíveis (5000) e um grande número de portas TCP abertas e fechadas em um curto período de tempo, juntamente com o status `TIME_WAIT`, você tem uma boa chance de ficar sem portas. Existem duas maneiras de resolver esse problema:

- Reduza o número de portas TCP consumidas rapidamente investigando o agrupamento de conexões ou conexões persistentes, sempre que possível.

- Ajuste algumas configurações no registro do Windows (veja abaixo)

Importante

O procedimento a seguir envolve a modificação do registro do Windows. Antes de modificar o registro, certifique-se de fazer uma cópia de segurança e verifique se entende como restaurá-lo caso ocorra um problema. Para obter informações sobre como fazer backup, restaurar e editar o registro, consulte o seguinte artigo na Base de Conhecimento da Microsoft: <http://support.microsoft.com/kb/256986/EN-US/>.

1. Inicie o Editor do Registro (`Regedt32.exe`).

2. Localize a chave seguinte no registro:

   ```
   HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters
   ```

3. No menu `Edit`, clique em `Add Value` e, em seguida, adicione o seguinte valor de registro:

   ```
   Value Name: MaxUserPort
   Data Type: REG_DWORD
   Value: 65534
   ```

   Isso define o número de portas efêmeras disponíveis para qualquer usuário. A faixa válida é entre 5000 e 65534 (decimal). O valor padrão é 0x1388 (5000 decimal).

4. No menu `Edit`, clique em `Add Value` e, em seguida, adicione o seguinte valor de registro:

   ```
   Value Name: TcpTimedWaitDelay
   Data Type: REG_DWORD
   Value: 30
   ```

   Isso define o número de segundos para manter uma conexão de porta TCP no estado `TIME_WAIT` antes de fechar. A faixa válida é entre 30 e 300 decimais, embora você possa querer verificar com a Microsoft para obter os valores permitidos mais recentes. O valor padrão é 0x78 (120 decimais).

5. Pare o Editor do Registro.

6. Reinicie a máquina.

Observação: Desfazer o que foi feito acima deve ser tão simples quanto excluir as entradas do registro que você criou.
