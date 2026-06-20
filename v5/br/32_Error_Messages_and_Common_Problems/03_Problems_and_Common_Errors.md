## B.3 Problemas e Erros Comuns

Esta seção lista alguns problemas comuns e mensagens de erro que você pode encontrar. Ela descreve como determinar as causas dos problemas e o que fazer para resolvê-los.

### B.3.1 Como determinar o que está causando um problema

Quando você encontra um problema, a primeira coisa que você deve fazer é descobrir qual programa ou peça de equipamento está causando isso:

* Se você tiver um dos seguintes sintomas, provavelmente é um problema de hardware (como memória, placa-mãe, CPU ou disco rígido) ou um problema no kernel:

+ O teclado não funciona. Normalmente, isso pode ser verificado pressionando a tecla Caps Lock. Se a luz do Caps Lock não mudar, você deve substituir o teclado. (Antes de fazer isso, você deve tentar reiniciar o computador e verificar todos os cabos do teclado.)

+ O ponteiro do mouse não se move.  
+ A máquina não responde aos pings de uma máquina remota.  
+ Outros programas que não estão relacionados ao MySQL não se comportam corretamente.

+ Seu sistema foi reiniciado inesperadamente. (Um programa defeituoso em nível de usuário nunca deveria ser capaz de derrubar seu sistema.)

Neste caso, você deve começar verificando todos os seus cabos e executar uma ferramenta de diagnóstico para verificar seu hardware! Você também deve verificar se há algum patch, atualização ou pacote de serviço para seu sistema operacional que possa resolver seu problema. Verifique também se todas as suas bibliotecas (como `glibc`) estão atualizadas.

É sempre bom usar uma máquina com memória ECC para descobrir problemas de memória cedo.

* Se o seu teclado estiver bloqueado, você poderá recuperá-lo ao fazer login na sua máquina a partir de outra máquina e executar `kbd_mode -a`.

* Examine o arquivo de registro do seu sistema (`/var/log/messages` ou semelhante) para encontrar as razões do seu problema. Se você acha que o problema está no MySQL, também deve examinar os arquivos de registro do MySQL. Veja a Seção 5.4, “Logs do servidor MySQL”.

* Se você não acha que tem problemas de hardware, você deve tentar descobrir qual programa está causando problemas. Tente usar **top**, **ps**, Gerenciador de Tarefas ou algum programa semelhante, para verificar qual programa está usando toda a CPU ou bloqueando a máquina.

* Use **top**, **df** ou um programa semelhante para verificar se você está sem memória, espaço em disco, descritores de arquivo ou algum outro recurso crítico.

* Se o problema for um processo descontrolado, você sempre pode tentar eliminá-lo. Se ele não quiser morrer, provavelmente há um bug no sistema operacional.

Se você examinou todas as outras possibilidades e concluiu que o servidor MySQL ou um cliente MySQL está causando o problema, é hora de criar um relatório de erro, veja a Seção 1.5, “Como relatar erros ou problemas”. No relatório de erro, tente dar uma descrição completa de como o sistema está se comportando e o que você acha que está acontecendo. Além disso, indique por que você acha que o MySQL está causando o problema. Considere todas as situações descritas neste capítulo. Descreva quaisquer problemas exatamente como eles aparecem quando você examina seu sistema. Use o método “copiar e colar” para qualquer saída e mensagens de erro de programas e arquivos de registro.

Tente descrever em detalhes qual programa não está funcionando e todos os sintomas que você vê. Já recebemos muitos relatórios de bugs no passado que afirmam apenas que "o sistema não funciona". Isso não nos fornece nenhuma informação sobre o que poderia ser o problema.

Se um programa falhar, é sempre útil saber as seguintes informações:

* O programa em questão fez uma falha de segmentação (descarregou o núcleo)?

* O programa está ocupando todo o tempo disponível da CPU? Verifique com o **top**. Deixe o programa rodando por um tempo, pode ser que ele esteja simplesmente avaliando algo que é computacionalmente intensivo.

* Se o servidor `mysqld` estiver causando problemas, você pode obter alguma resposta dele com **mysqladmin -u root ping** ou **mysqladmin -u root processlist**.

* O que diz um programa de cliente quando você tenta se conectar ao servidor MySQL? (Tente com **mysql**, por exemplo.) O cliente trava? Você obtém alguma saída do programa?

Ao enviar um relatório de erro, você deve seguir o esquema descrito na Seção 1.5, “Como relatar erros ou problemas”.

### B.3.2 Erros Comuns ao Usar Programas MySQL

Esta seção lista alguns erros que os usuários frequentemente encontram ao executar programas MySQL. Embora os problemas apareçam quando você tenta executar programas de cliente, as soluções para muitos dos problemas envolvem a alteração da configuração do servidor MySQL.

#### B.3.2.1 Acesso negado

Um erro `Access denied` pode ter muitas causas. Muitas vezes, o problema está relacionado às contas do MySQL que o servidor permite que os programas de cliente usem ao se conectar. Veja a Seção 6.2, “Controle de Acesso e Gerenciamento de Conta”, e a Seção 6.2.17, “Solucionando Problemas de Conexão ao MySQL”.

#### B.3.2.2 Não consigo conectar ao servidor MySQL [local]

Um cliente MySQL no Unix pode se conectar ao servidor `mysqld` de duas maneiras diferentes: usando um arquivo de soquete Unix para se conectar através de um arquivo no sistema de arquivos (`/tmp/mysql.sock` padrão), ou usando TCP/IP, que se conecta através de um número de porta. Uma conexão com arquivo de soquete Unix é mais rápida que TCP/IP, mas pode ser usada apenas ao se conectar a um servidor no mesmo computador. Um arquivo de soquete Unix é usado se você não especificar um nome de host ou se especificar o nome de host especial `localhost`.

Se o servidor MySQL estiver em execução no Windows, você pode se conectar usando TCP/IP. Se o servidor estiver iniciado com a variável de sistema `named_pipe` habilitada, você também pode se conectar com tubos nomeados se executar o cliente no host onde o servidor está em execução. O nome do tubo nomeado é `MySQL` por padrão. Se você não fornecer um nome de host ao se conectar ao `mysqld`, um cliente MySQL tentará primeiro se conectar ao tubo nomeado. Se isso não funcionar, ele se conecta à porta TCP/IP. Você pode forçar o uso de tubos nomeados no Windows usando `.` como o nome do host.

O erro (2002) `Can't connect to ...` normalmente significa que não há servidor MySQL em execução no sistema ou que você está usando um nome de arquivo de soquete Unix incorreto ou número de porta TCP/IP incorreto ao tentar se conectar ao servidor. Você também deve verificar se a porta TCP/IP que você está usando não foi bloqueada por um firewall ou serviço de bloqueio de porta.

O erro (2003) `Can't connect to MySQL server on 'server' (10061)` indica que a conexão de rede foi recusada. Você deve verificar se há um servidor MySQL em execução, se as conexões de rede estão habilitadas e se a porta de rede que você especificou é a mesma configurada no servidor.

Comece verificando se há um processo chamado `mysqld` em execução no seu servidor. (Use **ps xa | grep mysqld** em Unix ou o Gerenciador de Tarefas no Windows.) Se não houver esse processo, você deve iniciar o servidor. Veja a Seção 2.9.2, “Iniciando o servidor”.

Se um processo `mysqld` estiver em execução, você pode verificá-lo tentando os seguintes comandos. O número de porta ou o nome do arquivo de soquete Unix pode ser diferente na sua configuração. `host_ip` representa o endereço IP da máquina onde o servidor está em execução.

```sql
$> mysqladmin version
$> mysqladmin variables
$> mysqladmin -h `hostname` version variables
$> mysqladmin -h `hostname` --port=3306 version
$> mysqladmin -h host_ip version
$> mysqladmin --protocol=SOCKET --socket=/tmp/mysql.sock version
```

Observe o uso de travessões em vez de aspas simples com o comando **hostname**. Estes fazem com que a saída do **hostname** (ou seja, o nome atual do host) seja substituída no comando **mysqladmin**. Se você não tiver o comando **hostname** ou estiver executando em Windows, pode digitar manualmente o nome do host da sua máquina (sem travessões) seguindo a opção `-h`. Também pode tentar `-h 127.0.0.1` para se conectar com TCP/IP ao host local.

Certifique-se de que o servidor não foi configurado para ignorar conexões de rede ou (se você está tentando se conectar remotamente) que não foi configurado para ouvir apenas localmente em suas interfaces de rede. Se o servidor foi iniciado com a variável de sistema `skip_networking` habilitada, ele não aceita conexões TCP/IP de forma alguma. Se o servidor foi iniciado com a variável de sistema `bind_address` definida como `127.0.0.1`, ele escuta apenas conexões TCP/IP localmente na interface de loopback e não aceita conexões remotas.

Verifique se não há um firewall bloqueando o acesso ao MySQL. Seu firewall pode estar configurado com base na aplicação que está sendo executada ou no número de porta usado pelo MySQL para comunicação (3306 por padrão). Em Linux ou Unix, verifique a configuração de suas tabelas de IP (ou similar) para garantir que a porta não tenha sido bloqueada. Em Windows, aplicativos como ZoneAlarm ou o Firewall do Windows podem precisar ser configurados para não bloquear a porta do MySQL.

Aqui estão algumas razões pelas quais o erro `Can't connect to local MySQL server` pode ocorrer:

* `mysqld` não está rodando no host local. Verifique a lista de processos do seu sistema operacional para garantir que o processo `mysqld` esteja presente.

* Você está executando um servidor MySQL no Windows com muitas conexões TCP/IP. Se você está enfrentando isso com frequência, seus clientes recebem esse erro, você pode encontrar uma solução aqui: Seção B.3.2.2.1, "Conexão ao servidor MySQL falhando no Windows".

* Alguém removeu o arquivo de soquete Unix que o `mysqld` usa (o `/tmp/mysql.sock` por padrão). Por exemplo, você pode ter um **cron** que remove arquivos antigos do diretório `/tmp`. Você sempre pode executar **mysqladmin version** para verificar se o arquivo de soquete Unix que o **mysqladmin** está tentando usar realmente existe. A correção neste caso é alterar o **cron** para não remover o `mysql.sock` ou colocar o arquivo de soquete em outro lugar. Veja a Seção B.3.3.6, “Como proteger ou alterar o arquivo de soquete Unix do MySQL”.

* Você iniciou o servidor `mysqld` com a opção `--socket=/path/to/socket`, mas esqueceu de informar aos programas do cliente o novo nome do arquivo de soquete. Se você alterar o nome do caminho de soquete do servidor, também deve notificar os clientes do MySQL. Você pode fazer isso fornecendo a mesma opção `--socket` ao executar programas de cliente. Você também precisa garantir que os clientes tenham permissão para acessar o arquivo [[`mysql.sock`]. Para descobrir onde está o arquivo de soquete, você pode fazer:

  ```sql
  $> netstat -ln | grep mysql
  ```

Veja a Seção B.3.3.6, “Como proteger ou alterar o arquivo de soquete Unix do MySQL”.

* Você está usando o Linux e um fio do servidor morreu (dumpou o núcleo). Nesse caso, você deve matar os outros `mysqld` fios (por exemplo, com **kill**) antes de poder reiniciar o servidor MySQL. Veja a Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”.

* O servidor ou o programa cliente pode não ter os privilégios de acesso adequados para o diretório que contém o arquivo de soquete Unix ou o próprio arquivo de soquete. Neste caso, você deve alterar os privilégios de acesso para o diretório ou o arquivo de soquete para que o servidor e os clientes possam acessá-los, ou reinicie o `mysqld` com uma opção `--socket` que especifique um nome de arquivo de soquete em um diretório onde o servidor pode criá-lo e onde os programas de cliente podem acessá-lo.

Se você receber a mensagem de erro `Can't connect to MySQL server on some_host`, pode tentar as seguintes coisas para descobrir qual é o problema:

* Verifique se o servidor está em execução nesse host executando `telnet some_host 3306` e pressionando a tecla Enter algumas vezes. (3306 é o número de porta padrão do MySQL. Altere o valor se o seu servidor estiver ouvindo uma porta diferente.) Se houver um servidor MySQL em execução e ouvindo a porta, você deve receber uma resposta que inclua o número da versão do servidor. Se você receber um erro como `telnet: Unable to connect to remote host: Connection refused`, então não há servidor em execução na porta fornecida.

* Se o servidor estiver rodando no host local, tente usar **mysqladmin -h localhost variables** para se conectar usando o arquivo de socket Unix. Verifique o número da porta TCP/IP para a qual o servidor está configurado para ouvir (é o valor da variável `port`.)

* Se você estiver executando sob Linux e o Linux com Segurança Aprimorada (SELinux) estiver habilitado, consulte a Seção 6.7, “SELinux”.

##### B.3.2.2.1 Conexão com o servidor MySQL falhando no Windows

Quando você está executando um servidor MySQL no Windows com muitas conexões TCP/IP e está experimentando que seus clientes recebem frequentemente o erro `Can't connect to MySQL server`, a razão pode ser que o Windows não permite conexões efêmeras (de curta duração) suficientes para atender a essas conexões.

O propósito de `TIME_WAIT` é manter uma conexão aceitando pacotes mesmo após a conexão ter sido fechada. Isso ocorre porque o roteamento da Internet pode fazer com que um pacote tome uma rota lenta para seu destino e pode chegar depois que ambos os lados concordaram em fechar. Se a porta estiver em uso para uma nova conexão, esse pacote da conexão antiga poderia quebrar o protocolo ou comprometer informações pessoais da conexão original. O `TIME_WAIT` de atraso previne isso, garantindo que a porta não possa ser reutilizada até que algum tempo tenha sido permitido para que esses pacotes atrasados cheguem.

É seguro reduzir `TIME_WAIT` muito nas conexões LAN, pois há pouca chance de pacotes chegarem com atrasos muito longos, como poderiam fazer na Internet, com suas distâncias e latências comparativamente grandes.

O Windows permite portas TCP efêmeras (de curta duração) ao usuário. Após qualquer porta ser fechada, ela permanece no status `TIME_WAIT` por 120 segundos. A porta não estará disponível novamente até que esse tempo expire. A faixa padrão de números de porta depende da versão do Windows, com um número mais limitado de portas em versões mais antigas:

* Windows através do Server 2003: Portas na faixa de 1025 a 5000

* Windows Vista, Server 2008 e versões mais recentes: portas na faixa de 49152 a 65535

Com uma pequena pilha de portas TCP disponíveis (5000) e um grande número de portas TCP sendo abertas e fechadas em um curto período de tempo, juntamente com o status `TIME_WAIT`, você tem uma boa chance de ficar sem portas. Existem duas maneiras de resolver esse problema:

* Reduza o número de portas TCP consumidas rapidamente, investigando o agrupamento de conexões ou conexões persistentes, quando possível.

* Ajuste algumas configurações no registro do Windows (consulte abaixo)

Importante

O procedimento a seguir envolve a modificação do registro do Windows. Antes de modificar o registro, certifique-se de fazer uma cópia de segurança e verifique se entende como restaurá-lo caso ocorra um problema. Para obter informações sobre como fazer uma cópia de segurança, restaurar e editar o registro, consulte o seguinte artigo na Base de Conhecimento da Microsoft: <http://support.microsoft.com/kb/256986/EN-US/>.

1. Inicie o Editor do Registro (`Regedt32.exe`).

2. Localize a chave seguinte no registro:

   ```sql
   HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters
   ```

3. No menu `Edit`, clique em `Add Value`, e, em seguida, adicione o seguinte valor de registro:

   ```sql
   Value Name: MaxUserPort
   Data Type: REG_DWORD
   Value: 65534
   ```

Isso define o número de portas efêmeras disponíveis para qualquer usuário. O intervalo válido é entre 5000 e 65534 (decimal). O valor padrão é 0x1388 (5000 decimal).

4. No menu `Edit`, clique em `Add Value` e, em seguida, adicione o seguinte valor de registro:

   ```sql
   Value Name: TcpTimedWaitDelay
   Data Type: REG_DWORD
   Value: 30
   ```

Isso define o número de segundos para manter uma conexão de porta TCP no estado `TIME_WAIT` antes de ser fechada. A faixa válida é entre 30 e 300 decimais, embora você possa querer verificar com a Microsoft para os valores mais recentes permitidos. O valor padrão é 0x78 (120 decimal).

5. Parar o Editor do Registro. 6. Reiniciar a máquina.

Observação: Desfazer o que foi feito acima deve ser tão simples quanto excluir as entradas do registro que você criou.

#### B.3.2.3 Perda da conexão com o servidor MySQL

Existem três causas prováveis para essa mensagem de erro.

Normalmente, isso indica problemas de conectividade de rede e você deve verificar a condição da sua rede se esse erro ocorrer com frequência. Se a mensagem de erro incluir "durante a consulta", provavelmente é esse o caso que você está enfrentando.

Às vezes, o formulário "durante a consulta" acontece quando milhões de linhas estão sendo enviadas como parte de uma ou mais consultas. Se você sabe que isso está acontecendo, você deve tentar aumentar `net_read_timeout` de seu valor padrão de 30 segundos para 60 segundos ou mais, suficiente para que a transferência de dados seja concluída.

Mais raramente, isso pode acontecer quando o cliente está tentando a conexão inicial com o servidor. Neste caso, se o seu valor `connect_timeout` estiver definido apenas para alguns segundos, você pode ser capaz de resolver o problema aumentando-o para dez segundos, talvez mais se você tiver uma distância muito longa ou uma conexão lenta. Você pode determinar se está experimentando essa causa menos comum usando `SHOW GLOBAL STATUS LIKE 'Aborted_connects'`. Ele aumenta em um para cada tentativa de conexão inicial que o servidor aborrece. Você pode ver “leitura de pacote de autorização” como parte da mensagem de erro; se assim for, isso também sugere que essa é a solução que você precisa.

Se a causa não for nenhuma das que acabamos de descrever, você pode estar enfrentando um problema com os valores de `BLOB` que são maiores que `max_allowed_packet`, o que pode causar esse erro com alguns clientes. Às vezes, você pode ver um erro de `ER_NET_PACKET_TOO_LARGE`, e isso confirma que você precisa aumentar `max_allowed_packet`.

#### B.3.2.4 A senha falha quando inserida interativamente

Os programas de cliente MySQL solicitam uma senha quando invocados com uma opção `--password` ou `-p` que não tenha um valor de senha subsequente:

```sql
$> mysql -u user_name -p
Enter password:
```

Em alguns sistemas, você pode descobrir que sua senha funciona quando especificada em um arquivo de opções ou na linha de comando, mas não quando você a digita interativamente no prompt do `Enter password:`. Isso ocorre quando a biblioteca fornecida pelo sistema para ler senhas limita os valores das senhas a um pequeno número de caracteres (tipicamente oito). Esse é um problema com a biblioteca do sistema, não com o MySQL. Para contornar isso, mude sua senha do MySQL para um valor que tenha oito ou menos caracteres, ou coloque sua senha em um arquivo de opções.

#### B.3.2.5 Muitas conexões

Se os clientes encontrarem erros `Too many connections` ao tentar se conectar ao servidor `mysqld`, todas as conexões disponíveis estão sendo usadas por outros clientes.

O número permitido de conexões é controlado pela variável de sistema `max_connections`. Para suportar mais conexões, defina `max_connections` para um valor maior.

`mysqld` permite, na verdade, `max_connections`

+ 1 conexão de cliente. A conexão extra é reservada para uso por contas que possuem o privilégio `SUPER`. Ao conceder o privilégio aos administradores e não aos usuários normais (que não deveriam precisar disso), um administrador que também possui o privilégio `PROCESS` pode se conectar ao servidor e usar `SHOW PROCESSLIST` para diagnosticar problemas, mesmo que o número máximo de clientes não privilegiados estejam conectados. Veja a Seção 13.7.5.29, “Declaração SHOW PROCESSLIST”.

Para mais informações sobre como o servidor lida com as conexões dos clientes, consulte a Seção 5.1.11.1, “Interfaces de Conexão”.

#### B.3.2.6 Sem memória

Se você emitir uma consulta usando o programa cliente **mysql** e receber um erro como o seguinte, isso significa que o **mysql** não tem memória suficiente para armazenar o resultado completo da consulta:

```sql
mysql: Out of memory at line 42, 'malloc.c'
mysql: needed 8136 byte (8k), memory in use: 12481367 bytes (12189k)
ERROR 2008: MySQL client ran out of memory
```

Para remediar o problema, primeiro verifique se sua consulta está correta. É razoável que ela retorne tantas linhas? Se não for, corrija a consulta e tente novamente. Caso contrário, você pode invocar o **mysql** com a opção `--quick`. Isso faz com que ele use a função C API `mysql_use_result()` para recuperar o conjunto de resultados, o que coloca menos carga no cliente (mas mais no servidor).

#### B.3.2.7 O servidor MySQL desapareceu

Esta seção também abrange o erro relacionado `Lost connection to server during query`.

A razão mais comum para o erro `MySQL server has gone away` é que o servidor expirou o tempo e fechou a conexão. Nesse caso, você normalmente recebe um dos seguintes códigos de erro (qual você recebe depende do sistema operacional).

<table summary="MySQL server has gone away error codes and a description of each code."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Error Code</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>CR_SERVER_GONE_ERROR</code></td> <td>O cliente não conseguiu enviar uma pergunta ao servidor.</td> </tr><tr> <td><code>CR_SERVER_LOST</code></td> <td>O cliente não recebeu um erro ao escrever para o servidor, mas não recebeu uma resposta completa (ou nenhuma resposta) à pergunta.</td> </tr></tbody></table>

Por padrão, o servidor fecha a conexão após oito horas, se nada tiver acontecido. Você pode alterar o limite de tempo definindo a variável `wait_timeout` quando você iniciar o `mysqld`. Veja a Seção 5.1.7, “Variáveis do Sistema do Servidor”.

Se você tiver um script, basta emitir a consulta novamente para que o cliente faça uma reconexão automática. Isso pressupõe que você tenha a reconexão automática habilitada no cliente (o que é o padrão para o cliente de linha de comando `mysql`).

Alguns outros motivos comuns para o erro `MySQL server has gone away` são:

* Você (ou o administrador do banco de dados) matou o thread em execução com uma declaração `KILL` ou um comando **mysqladmin kill**.

* Você tentou executar uma consulta após fechar a conexão com o servidor. Isso indica um erro lógico na aplicação que deve ser corrigido.

* Um aplicativo cliente que está sendo executado em um host diferente não tem os privilégios necessários para se conectar ao servidor MySQL a partir desse host.

* Você recebeu um tempo de espera da conexão TCP/IP no lado do cliente. Isso pode acontecer se você tiver usado os comandos: `mysql_options(..., MYSQL_OPT_READ_TIMEOUT,...)` ou `mysql_options(..., MYSQL_OPT_WRITE_TIMEOUT,...)`. Nesse caso, aumentar o tempo de espera pode ajudar a resolver o problema.

* Você encontrou um tempo de espera no lado do servidor e a reconexão automática no cliente está desativada (a bandeira `reconnect` na estrutura `MYSQL` é igual a 0).

* Você está usando um cliente do Windows e o servidor perdeu a conexão (provavelmente porque `wait_timeout` expirou) antes de o comando ser emitido.

O problema no Windows é que, em alguns casos, o MySQL não recebe um erro do sistema operacional ao escrever na conexão TCP/IP com o servidor, mas, em vez disso, recebe o erro ao tentar ler a resposta da conexão.

A solução para isso é realizar uma `mysql_ping()` na conexão se há muito tempo desde a última consulta (isso é o que o Connector/ODBC faz) ou definir `wait_timeout` no servidor `mysqld` de forma tão alta que, na prática, nunca expire.

* Você também pode receber esses erros se enviar uma consulta ao servidor que está incorreta ou muito grande. Se o `mysqld` receber um pacote que é muito grande ou fora de ordem, ele assume que algo deu errado com o cliente e fecha a conexão. Se você precisar de grandes consultas (por exemplo, se você está trabalhando com grandes colunas `BLOB`, você pode aumentar o limite da consulta definindo a variável `max_allowed_packet` do servidor, que tem um valor padrão de 4 MB. Você também pode precisar aumentar o tamanho máximo do pacote no cliente. Mais informações sobre a definição do tamanho do pacote estão fornecidas na Seção B.3.2.8, “Pacote muito grande”.

Uma declaração `INSERT` ou `REPLACE` que insere um grande número de linhas também pode causar esse tipo de erro. Uma dessas declarações envia um único pedido ao servidor, independentemente do número de linhas a serem inseridas; assim, você pode frequentemente evitar o erro reduzindo o número de linhas enviadas por `INSERT` ou `REPLACE`.

* É também possível ver este erro se as consultas de nome de host falharem (por exemplo, se o servidor DNS em que o seu servidor ou rede depende falhar). Isso ocorre porque o MySQL depende do sistema de nome para a resolução de nomes, mas não tem como saber se está funcionando — do ponto de vista do MySQL, o problema é indistinguível de qualquer outro tempo de espera de rede.

Você também pode ver o erro `MySQL server has gone away` se o MySQL for iniciado com a variável de sistema `skip_networking` habilitada.

Outro problema de rede que pode causar esse erro ocorre se a porta MySQL (padrão 3306) for bloqueada pelo seu firewall, impedindo, assim, qualquer conexão com o servidor MySQL.

* Você também pode encontrar esse erro em aplicativos que criam processos filhos, todos os quais tentam usar a mesma conexão com o servidor MySQL. Isso pode ser evitado usando uma conexão separada para cada processo filho.

* Você encontrou um erro onde o servidor morreu enquanto executava a consulta.

Você pode verificar se o servidor MySQL morreu e foi reiniciado executando **mysqladmin version** e examinando o tempo de atividade do servidor. Se a conexão do cliente foi interrompida porque o `mysqld` quebrou e foi reiniciado, você deve se concentrar em encontrar a razão do acidente. Comece verificando se emitir a consulta novamente mata o servidor novamente. Veja a Seção B.3.3.3, “O que fazer se o MySQL continuar a quebrar”.

Você pode obter mais informações sobre conexões perdidas iniciando `mysqld` com a variável de sistema `log_error_verbosity` definida como 3. Isso registra algumas das mensagens de desconexão no arquivo `hostname.err`. Veja a Seção 5.4.2, “O Diário de Erros”.

Se você deseja criar um relatório de bug sobre esse problema, certifique-se de incluir as seguintes informações:

* Indique se o servidor MySQL morreu. Você pode encontrar informações sobre isso no registro de erro do servidor. Veja a Seção B.3.3.3, “O que fazer se o MySQL continuar a falhar”.

* Se uma consulta específica mata `mysqld` e as tabelas envolvidas foram verificadas com `CHECK TABLE` antes de executar a consulta, você pode fornecer um caso de teste reproduzível? Veja a Seção 5.8, “Depuração do MySQL”.

* Qual é o valor da variável de sistema `wait_timeout` no servidor MySQL? (**mysqladmin variables** lhe dá o valor desta variável.)

* Você tentou executar `mysqld` com o registro de consulta geral habilitado para determinar se a consulta problema aparece no registro? (Veja a Seção 5.4.3, “O Registro de Consulta Geral”.)

Veja também a Seção B.3.2.9, “Erros de Comunicação e Conexões Abortadas”, e a Seção 1.5, “Como Relatar Bugs ou Problemas”.

#### B.3.2.8 Pacote muito grande

Um pacote de comunicação é uma única instrução SQL enviada ao servidor MySQL, uma única linha enviada ao cliente ou um evento de registro binário enviado de um servidor de origem de replicação para uma réplica.

O pacote maior possível que pode ser transmitido para ou a partir de um servidor ou cliente MySQL 5.7 é de 1 GB.

Quando um cliente MySQL ou o servidor `mysqld` recebe um pacote maior que `max_allowed_packet` bytes, ele emite um erro `ER_NET_PACKET_TOO_LARGE` e fecha a conexão. Com alguns clientes, você também pode receber um erro `Lost connection to MySQL server during query` se o pacote de comunicação for muito grande.

Tanto o cliente quanto o servidor têm sua própria variável `max_allowed_packet`, então, se você quiser lidar com pacotes grandes, você deve aumentar essa variável tanto no cliente quanto no servidor.

Se você estiver usando o programa cliente **mysql**, sua variável padrão `max_allowed_packet` é de 16 MB. Para definir um valor maior, inicie o **mysql** da seguinte forma:

```sql
$> mysql --max_allowed_packet=32M
```

Isso define o tamanho do pacote para 32 MB.

O valor padrão do servidor `max_allowed_packet` é de 4 MB. Você pode aumentá-lo se o servidor precisar lidar com consultas grandes (por exemplo, se você estiver trabalhando com colunas grandes `BLOB`). Por exemplo, para definir a variável para 16 MB, inicie o servidor da seguinte forma:

```sql
$> mysqld --max_allowed_packet=16M
```

Você também pode usar um arquivo de opção para definir `max_allowed_packet`. Por exemplo, para definir o tamanho do servidor para 16 MB, adicione as seguintes linhas em um arquivo de opção:

```sql
[mysqld]
max_allowed_packet=16M
```

É seguro aumentar o valor desta variável, pois a memória extra é alocada apenas quando necessário. Por exemplo, `mysqld` aloca mais memória apenas quando você emite uma consulta longa ou quando `mysqld` deve retornar uma grande linha de resultado. O pequeno valor padrão da variável é uma precaução para capturar pacotes incorretos entre o cliente e o servidor e também para garantir que você não se esgote de memória ao usar pacotes grandes acidentalmente.

Você também pode ter problemas estranhos com pacotes grandes se estiver usando grandes valores de `BLOB`, mas não tiver dado ao `mysqld` acesso a memória suficiente para lidar com a consulta. Se você suspeitar que seja esse o caso, tente adicionar **ulimit -d 256000** no início do script de `mysqld_safe` e reinicie o `mysqld`.

#### B.3.2.9 Erros de comunicação e conexões interrompidas

Se ocorrerem problemas de conexão, como erros de comunicação ou conexões interrompidas, use essas fontes de informação para diagnosticar os problemas:

* O log de erro. Veja a Seção 5.4.2, “O Log de Erro”.
* O log de consulta geral. Veja a Seção 5.4.3, “O Log de Consulta Geral”.
* As variáveis de status `Aborted_xxx` e `Connection_errors_xxx`. Veja a Seção 5.1.9, “Variáveis de Status do Servidor”.

* O cache do host, que é acessível usando a tabela do Schema de desempenho `host_cache`. Veja a Seção 5.1.11.2, “Consultas DNS e o cache do host”, e a Seção 25.12.16.1, “A tabela host_cache”.

Se a variável de sistema `log_error_verbosity` estiver definida como 3, você pode encontrar mensagens como esta em seu registro de erro:

```sql
[Note] Aborted connection 854 to db: 'employees' user: 'josh'
```

Se um cliente não conseguir se conectar, o servidor incrementa a variável de status `Aborted_connects`. Tentativas de conexão não bem-sucedidas podem ocorrer por motivos como:

* Um cliente tenta acessar um banco de dados, mas não tem privilégios para isso.

* Um cliente usa uma senha incorreta. * Um pacote de conexão não contém as informações corretas.

* Leva mais de `connect_timeout` segundos para obter um pacote de conexão. Veja a Seção 5.1.7, “Variáveis do Sistema do Servidor”.

Se esses tipos de coisas acontecem, isso pode indicar que alguém está tentando invadir seu servidor! Se o registro de consulta geral estiver habilitado, as mensagens desses tipos de problemas são registradas nele.

Se um cliente se conectar com sucesso, mas depois se desconectar indevidamente ou for encerrado, o servidor incrementa a variável de status `Aborted_clients`, e registra uma mensagem de conexão Abortada no log de erro. A causa pode ser qualquer uma das seguintes:

* O programa do cliente não chamou `mysql_close()` antes de sair.

* O cliente havia dormido mais de `wait_timeout` ou `interactive_timeout` segundos sem emitir quaisquer solicitações ao servidor. Veja a Seção 5.1.7, “Variáveis do Sistema do Servidor”.

* O programa do cliente terminou abruptamente em meio a uma transferência de dados.

Outras razões para problemas com conexões interrompidas ou clientes interrompidos:

* O valor da variável `max_allowed_packet` é muito pequeno ou as consultas exigem mais memória do que a que você alocar para `mysqld`. Veja a Seção B.3.2.8, “Pacote muito grande”.

* Uso do protocolo Ethernet com Linux, tanto em modo semi-dupla quanto em modo full-duplex. Alguns drivers de Ethernet do Linux têm esse bug. Você deve testar esse bug transferindo um arquivo enorme usando FTP entre as máquinas cliente e servidor. Se uma transferência for em modo burst-pause-burst-pause, você está experimentando uma síndrome de duplex Linux. Mude o modo de duplex tanto para sua placa de rede quanto para seu hub/switch para full-duplex ou para half-duplex e teste os resultados para determinar o melhor ajuste.

* Um problema com a biblioteca de threads que causa interrupções em leituras.

* TCP/IP mal configurado. * Redes Ethernet, hubs, switches, cabos, etc., com defeito. Isso só pode ser diagnosticado corretamente substituindo o hardware.

Veja também a Seção B.3.2.7, “O servidor MySQL desapareceu”.

#### B.3.2.10 A mesa está cheia

Se ocorrer um erro de tabela cheia, pode ser que o disco esteja cheio ou que a tabela tenha atingido seu tamanho máximo. O tamanho máximo efetivo da tabela para bancos de dados MySQL é geralmente determinado pelas restrições do sistema operacional em relação ao tamanho dos arquivos, e não pelos limites internos do MySQL. Veja a Seção 8.4.6, “Limites do Tamanho da Tabela”.

#### B.3.2.11 Não é possível criar/escrever em um arquivo

Se você receber um erro do tipo seguinte para algumas consultas, isso significa que o MySQL não pode criar um arquivo temporário para o conjunto de resultados no diretório temporário:

```sql
Can't create/write to file '\\sqla3fe_0.ism'.
```

O erro anterior é uma mensagem típica do Windows; a mensagem do Unix é semelhante.

Uma solução é começar com `mysqld` com a opção `--tmpdir` ou adicionar a opção à seção `[mysqld]` do seu arquivo de opções. Por exemplo, para especificar um diretório de `C:\temp`, use essas linhas:

```sql
[mysqld]
tmpdir=C:/temp
```

O diretório `C:\temp` deve existir e ter espaço suficiente para o servidor MySQL gravar. Veja a Seção 4.2.2.2, “Usando arquivos de opção”.

Outra causa desse erro pode ser problemas de permissões. Certifique-se de que o servidor MySQL possa escrever no diretório `tmpdir`.

Verifique também o código de erro que você obtém com **perror**. Uma razão pela qual o servidor não pode escrever em uma tabela é que o sistema de arquivos está cheio:

```sql
$> perror 28
OS error code  28:  No space left on device
```

Se você receber um erro do tipo seguinte durante a inicialização, isso indica que o sistema de arquivos ou o diretório usado para armazenar arquivos de dados está protegido para escrita. Desde que o erro de escrita seja em um arquivo de teste, o erro não é grave e pode ser ignorado com segurança.

```sql
Can't create test file /usr/local/mysql/data/master.lower-test
```

#### B.3.2.12 Comandos fora de sincronia

Se você receber `Commands out of sync; you can't run this command now` em seu código de cliente, você está chamando funções de cliente na ordem errada.

Isso pode acontecer, por exemplo, se você estiver usando `mysql_use_result()` e tentar executar uma nova consulta antes de ter chamado `mysql_free_result()`. Também pode acontecer se você tentar executar duas consultas que retornam dados sem chamar `mysql_use_result()` ou `mysql_store_result()` entre elas.

#### B.3.2.13 Ignorar o usuário

Se você receber o seguinte erro, isso significa que, quando o `mysqld` foi iniciado ou quando ele recarregou as tabelas de concessão, ele encontrou uma conta na tabela `user` que tinha uma senha inválida.

`Found wrong password for user 'some_user'@'some_host'; ignoring user`

Como resultado, a conta é simplesmente ignorada pelo sistema de permissão.

A lista a seguir indica possíveis causas e correções para esse problema:

* Você pode estar executando uma nova versão do `mysqld` com uma tabela antiga do `user`. Verifique se a coluna `Password` dessa tabela tem menos de 16 caracteres. Se sim, corrija essa condição executando `mysqld_upgrade`.

* A conta tem uma senha antiga (com oito caracteres). Atualize a conta na tabela `user` para ter uma nova senha.

* Você especificou uma senha na tabela `user` sem usar a função `PASSWORD()`. Use **mysql** para atualizar a conta na tabela `user` com uma nova senha, garantindo o uso da função `PASSWORD()`:

  ```sql
  mysql> UPDATE user SET Password=PASSWORD('new_password')
      -> WHERE User='some_user' AND Host='some_host';
  ```

#### B.3.2.14 A tabela 'tbl\_name' não existe

Se você receber qualquer um dos seguintes erros, geralmente significa que não existe nenhuma tabela no banco de dados padrão com o nome fornecido:

```sql
Table 'tbl_name' doesn't exist
Can't find file: 'tbl_name' (errno: 2)
```

Em alguns casos, pode ser que a tabela exista, mas que você esteja se referindo a ela incorretamente:

* Como o MySQL utiliza diretórios e arquivos para armazenar bancos de dados e tabelas, os nomes de banco de dados e tabelas são sensíveis ao caso, se estiverem localizados em um sistema de arquivos que possui nomes de arquivos sensíveis ao caso.

* Mesmo para sistemas de arquivos que não são sensíveis ao caso, como no Windows, todas as referências a uma tabela específica em uma consulta devem usar a mesma letra.

Você pode verificar quais tabelas estão no banco de dados padrão com `SHOW TABLES`. Veja a Seção 13.7.5, “Declarações SHOW”.

#### B.3.2.15 Não é possível inicializar o conjunto de caracteres

Você pode ver um erro como esse se tiver problemas com o conjunto de caracteres:

```sql
MySQL Connection Failed: Can't initialize character set charset_name
```

Esse erro pode ter qualquer uma das seguintes causas:

* O conjunto de caracteres é um conjunto de caracteres multibyte e você não tem suporte para o conjunto de caracteres no cliente. Neste caso, você precisa recompilar o cliente executando o **CMake** com a opção `-DDEFAULT_CHARSET=charset_name` ou `-DWITH_EXTRA_CHARSETS=charset_name`. Veja a Seção 2.8.7, “Opções de Configuração de Fonte MySQL”.

Todos os binários padrão do MySQL são compilados com `-DWITH_EXTRA_CHARSETS=complex`, o que permite suporte para todos os conjuntos de caracteres multibyte. Veja a Seção 2.8.7, “Opções de Configuração de Fonte do MySQL”.

* O conjunto de caracteres é um conjunto de caracteres simples que não é compilado em `mysqld`, e os arquivos de definição do conjunto de caracteres não estão no local onde o cliente espera encontrá-los.

Neste caso, você precisa usar um dos seguintes métodos para resolver o problema:

+ Recompile o cliente com suporte para o conjunto de caracteres. Veja a Seção 2.8.7, “Opções de configuração de fonte do MySQL”.

+ Especifique ao cliente o diretório onde os arquivos de definição do conjunto de caracteres estão localizados. Para muitos clientes, você pode fazer isso com a opção `--character-sets-dir`.

+ Copie os arquivos de definição de caracteres para o caminho onde o cliente espera que eles estejam.

#### B.3.2.16 Arquivo não encontrado e erros semelhantes

Se você receber `ERROR 'file_name' not found (errno: 23)`, `Can't open file: file_name (errno: 24)` ou qualquer outro erro com `errno 23` ou `errno 24` do MySQL, isso significa que você não allocou descritores de arquivo suficientes para o servidor MySQL. Você pode usar o utilitário **perror** para obter uma descrição do que o número do erro significa:

```sql
$> perror 23
OS error code  23:  File table overflow
$> perror 24
OS error code  24:  Too many open files
$> perror 11
OS error code  11:  Resource temporarily unavailable
```

O problema aqui é que o `mysqld` está tentando manter abertos muitos arquivos simultaneamente. Você pode dizer ao `mysqld` para não abrir tantos arquivos de uma vez ou aumentar o número de descritores de arquivo disponíveis para o `mysqld`.

Para dizer ao `mysqld` que mantenha abertos menos arquivos de cada vez, você pode tornar a tabela de cache menor, reduzindo o valor da variável de sistema `table_open_cache` (o valor padrão é 64). Isso pode não impedir totalmente a escassez de descritores de arquivo, porque, em algumas circunstâncias, o servidor pode tentar estender o tamanho da cache temporariamente, conforme descrito na Seção 8.4.3.1, “Como o MySQL Abre e Fecha Tabelas”. Reduzir o valor de `max_connections` também reduz o número de arquivos abertos (o valor padrão é 100).

Para alterar o número de descritores de arquivo disponíveis para `mysqld`, você pode usar a opção `--open-files-limit` para `mysqld_safe` ou definir a variável de sistema `open_files_limit`. Veja a Seção 5.1.7, “Variáveis do Sistema do Servidor”. A maneira mais fácil de definir esses valores é adicionar uma opção ao seu arquivo de opções. Veja a Seção 4.2.2.2, “Usando Arquivos de Opções”. Se você tiver uma versão antiga do `mysqld` que não suporta a definição do limite de arquivos abertos, você pode editar o script `mysqld_safe`. Há uma linha comentada **ulimit -n 256** no script. Você pode remover o caractere `#` para desfazer a comissão dessa linha e alterar o número `256` para definir o número de descritores de arquivo que serão disponibilizados para `mysqld`.

`--open-files-limit` e **ulimit** podem aumentar o número de descritores de arquivo, mas apenas até o limite imposto pelo sistema operacional. Há também um limite "sólido" que pode ser ignorado apenas se você iniciar `mysqld_safe` ou `mysqld` como `root` (lembre-se apenas de que você também precisa iniciar o servidor com a opção `--user` neste caso, para que ele não continue a funcionar como `root` após o início). Se você precisar aumentar o limite do sistema operacional sobre o número de descritores de arquivo disponíveis para cada processo, consulte a documentação do seu sistema.

Nota

Se você executar o shell **tcsh**, o **ulimit** não funciona! O **tcsh** também reporta valores incorretos quando você solicita os limites atuais. Neste caso, você deve iniciar `mysqld_safe` usando **sh**.

#### B.3.2.17 Questões de corrupção em tabelas

Se você iniciou `mysqld` com a variável de sistema `myisam_recover_options` definida, o MySQL verifica automaticamente e tenta reparar as tabelas `MyISAM` se elas estiverem marcadas como 'não fechadas corretamente' ou 'quebradas'. Se isso acontecer, o MySQL escreve uma entrada no arquivo `hostname.err` `'Warning: Checking table ...'` que é seguida por `Warning: Repairing table` se a tabela precisar ser reparada. Se você receber muitos desses erros, sem que `mysqld` tenha morrido inesperadamente pouco antes, então algo está errado e precisa ser investigado mais a fundo.

Quando o servidor detecta a corrupção da tabela `MyISAM`, ele escreve informações adicionais no log de erro, como o nome e o número da linha do arquivo de origem e a lista de threads acessando a tabela. Exemplo: `Got an error from thread_id=1, mi_dynrec.c:368`. Essas são informações úteis para incluir em relatórios de bugs.

Veja também a Seção 5.1.6, “Opções de comando do servidor”, e a Seção 5.8.1.7, “Criando um caso de teste se você experimentar corrupção de tabela”.

### B.3.3 Questões relacionadas à administração

#### B.3.3.1 Problemas com permissões de arquivo

Se você tiver problemas com permissões de arquivo, a variável de ambiente `UMASK` ou `UMASK_DIR` pode estar configurada incorretamente quando o `mysqld` é iniciado. Por exemplo, `mysqld` pode emitir a seguinte mensagem de erro quando você cria uma tabela:

```sql
ERROR: Can't find file: 'path/with/filename.frm' (Errcode: 13)
```

Os valores padrão `UMASK` e `UMASK_DIR` são `0640` e `0750`, respectivamente. `mysqld` assume que o valor para `UMASK` ou `UMASK_DIR` está em octal se começar com um zero. Por exemplo, definir `UMASK=0600` é equivalente a `UMASK=384` porque 0600 octal é 384 decimal.

Supondo que você comece a usar `mysqld` com `mysqld_safe`, altere o valor padrão de `UMASK` da seguinte forma:

```sql
UMASK=384  # = 600 in octal
export UMASK
mysqld_safe &
```

Nota

Uma exceção se aplica ao arquivo de registro de erro se você iniciar `mysqld` usando `mysqld_safe`, que não respeita `UMASK`: `mysqld_safe` pode criar o arquivo de registro de erro se não existir antes de iniciar `mysqld`, e `mysqld_safe` usa uma máscara de arquivo definida para um valor rigoroso de `0137`. Se isso não for adequado, crie o arquivo de erro manualmente com o modo de acesso desejado antes de executar `mysqld_safe`.

Por padrão, `mysqld` cria diretórios de banco de dados com um valor de permissão de acesso de `0750`. Para modificar esse comportamento, defina a variável `UMASK_DIR`. Se você definir seu valor, novos diretórios são criados com os valores combinados de `UMASK` e `UMASK_DIR`. Por exemplo, para dar acesso ao grupo a todos os novos diretórios, inicie `mysqld_safe` da seguinte forma:

```sql
UMASK_DIR=504  # = 770 in octal
export UMASK_DIR
mysqld_safe &
```

Para obter informações adicionais, consulte a Seção 4.9, “Variáveis de ambiente”.

#### B.3.3.2 Como redefinir a senha do root

Se você nunca tiver atribuído uma senha `root` para o MySQL, o servidor não requer senha para se conectar como `root`. No entanto, isso é inseguro. Para obter instruções sobre como atribuir uma senha, consulte a Seção 2.9.4, “Segurando a Conta Inicial do MySQL”.

Se você conhece a senha `root` e deseja alterá-la, consulte a Seção 13.7.1.1, "Instrução ALTER USER", e a Seção 13.7.1.7, "Instrução SET PASSWORD".

Se você já atribuiu uma senha `root` anteriormente, mas a esqueceu, pode atribuir uma nova senha. As seções a seguir fornecem instruções para sistemas Windows e Unix e sistemas semelhantes ao Unix, bem como instruções genéricas que se aplicam a qualquer sistema.

##### B.3.3.2.1 Redefinindo a senha do sistema: Sistemas Windows

Em Windows, use o procedimento a seguir para redefinir a senha da conta MySQL `'root'@'localhost'`. Para alterar a senha de uma conta `root` com uma parte do nome de host diferente, modifique as instruções para usar esse nome de host.

1. Faça login no seu sistema como Administrador. 2. Parar o servidor MySQL se ele estiver em execução. Para um servidor que está em execução como um serviço do Windows, vá para o Gerenciador de Serviços: No menu Iniciar, selecione Painel de Controle, em seguida, Ferramentas Administrativas, em seguida, Serviços. Encontre o serviço MySQL na lista e pare-o.

Se o seu servidor não estiver rodando como um serviço, você pode precisar usar o Gerenciador de Tarefas para forçá-lo a parar.

3. Crie um arquivo de texto contendo a declaração de atribuição de senha em uma única linha. Substitua a senha pela senha que você deseja usar.

   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass';
   ```

4. Salve o arquivo. Este exemplo assume que você nomeia o arquivo `C:\mysql-init.txt`.

5. Abra uma janela do console para chegar ao prompt de comando: No menu Iniciar, selecione Executar e, em seguida, digite **cmd** como o comando a ser executado.

6. Inicie o servidor MySQL com a variável de sistema `init_file` definida para nomear o arquivo (observe que o traço duplo na opção é necessário):

   ```sql
   C:\> cd "C:\Program Files\MySQL\MySQL Server 5.7\bin"
   C:\> mysqld --init-file=C:\\mysql-init.txt
   ```

Se você instalou o MySQL em um local diferente, ajuste o comando **cd** conforme necessário.

O servidor executa o conteúdo do arquivo nomeado pela variável de sistema `init_file` no momento do início, alterando a senha da conta `'root'@'localhost'`.

Para que a saída do servidor apareça na janela do console e não em um arquivo de registro, adicione a opção `--console` ao comando `mysqld`.

Se você instalou o MySQL usando o Assistente de instalação do MySQL, talvez precise especificar uma opção `--defaults-file`. Por exemplo:

   ```sql
   C:\> mysqld
            --defaults-file="C:\\ProgramData\\MySQL\\MySQL Server 5.7\\my.ini"
            --init-file=C:\\mysql-init.txt
   ```

A configuração adequada do `--defaults-file` pode ser encontrada usando o Gerenciador de Serviços: No menu Iniciar, selecione Painel de Controle, depois Ferramentas Administrativas, e depois Serviços. Encontre o serviço MySQL na lista, clique com o botão direito do mouse nele e escolha a opção `Properties`. O campo `Path to executable` contém a configuração do `--defaults-file`.

7. Após o servidor ter sido iniciado com sucesso, exclua `C:\mysql-init.txt`.

Agora você deve ser capaz de se conectar ao servidor MySQL como `root` usando a nova senha. Parar o servidor MySQL e reiniciá-lo normalmente. Se você executar o servidor como um serviço, inicie-o a partir da janela Serviços do Windows. Se você iniciar o servidor manualmente, use qualquer comando que você normalmente use.

Se a declaração `ALTER USER` não conseguir redefinir a senha, tente repetir o procedimento usando as seguintes declarações para modificar diretamente a tabela `user`:

```sql
UPDATE mysql.user
    SET authentication_string = PASSWORD('MyNewPass'), password_expired = 'N'
    WHERE User = 'root' AND Host = 'localhost';
FLUSH PRIVILEGES;
```

##### B.3.3.2.2 Redefinindo a senha de raiz: Sistemas Unix e Unix-like

Em Unix, use o procedimento a seguir para redefinir a senha da conta MySQL `'root'@'localhost'`. Para alterar a senha de uma conta `root` com uma parte do nome de host diferente, modifique as instruções para usar esse nome de host.

As instruções assumem que você inicia o servidor MySQL a partir da conta de login Unix que você normalmente usa para executá-lo. Por exemplo, se você executar o servidor usando a conta de login `mysql`, você deve fazer login como `mysql` antes de usar as instruções. Alternativamente, você pode fazer login como `root`, mas, nesse caso, você *deve* iniciar o `mysqld` com a opção `--user=mysql`. Se você iniciar o servidor como `root` sem usar `--user=mysql`, o servidor pode criar arquivos de propriedade do `root` no diretório de dados, como arquivos de registro, e esses podem causar problemas relacionados a permissões para futuras inicializações do servidor. Se isso acontecer, você deve alterar a propriedade dos arquivos para `mysql` ou removê-los.

1. Faça login no seu sistema como o usuário Unix no qual o servidor MySQL está sendo executado (por exemplo, `mysql`).

2. Parar o servidor MySQL se ele estiver em execução. Localize o arquivo `.pid` que contém o ID do processo do servidor. A localização exata e o nome deste arquivo dependem da sua distribuição, nome de host e configuração. Locais comuns são `/var/lib/mysql/`, `/var/run/mysqld/` e `/usr/local/mysql/data/`. Geralmente, o nome do arquivo tem uma extensão de `.pid` e começa com `mysqld` ou o nome do host do seu sistema.

Pare o servidor MySQL enviando um `kill` normal (não `kill -9`) para o processo `mysqld`. Use o nome real do caminho do arquivo `.pid` no seguinte comando:

   ```sql
   $> kill `cat /mysql-data-directory/host_name.pid`
   ```

Utilize backticks (não aspas simples) com o comando `cat`. Esses causam a substituição da saída do `cat` no comando `kill`.

3. Crie um arquivo de texto contendo a declaração de atribuição de senha em uma única linha. Substitua a senha pela senha que você deseja usar.

   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass';
   ```

4. Salve o arquivo. Este exemplo assume que você nomeia o arquivo como `/home/me/mysql-init`. O arquivo contém a senha, então não o salve em um local onde ele possa ser lido por outros usuários. Se você não estiver logado como `mysql` (o usuário pelo qual o servidor é executado), certifique-se de que o arquivo tenha permissões que permitam que `mysql` o leia.

5. Inicie o servidor MySQL com a variável de sistema `init_file` definida para nomear o arquivo:

   ```sql
   $> mysqld --init-file=/home/me/mysql-init &
   ```

O servidor executa o conteúdo do arquivo nomeado pela variável de sistema `init_file` no momento do início, alterando a senha da conta `'root'@'localhost'`.

Outras opções também podem ser necessárias, dependendo de como você normalmente inicia seu servidor. Por exemplo, `--defaults-file` pode ser necessário antes do argumento `init_file`.

6. Após o servidor ter sido iniciado com sucesso, exclua `/home/me/mysql-init`.

Agora você deve ser capaz de se conectar ao servidor MySQL como `root` usando a nova senha. Parar o servidor e reiniciá-lo normalmente.

Se a declaração `ALTER USER` não conseguir redefinir a senha, tente repetir o procedimento usando as seguintes declarações para modificar diretamente a tabela `user`:

```sql
UPDATE mysql.user
    SET authentication_string = PASSWORD('MyNewPass'), password_expired = 'N'
    WHERE User = 'root' AND Host = 'localhost';
FLUSH PRIVILEGES;
```

##### B.3.3.2.3 Redefinindo a senha do root: instruções gerais

As seções anteriores fornecem instruções para redefinir a senha especificamente para Windows e sistemas Unix e Unix-like. Alternativamente, em qualquer plataforma, você pode redefinir a senha usando o cliente **mysql** (mas essa abordagem é menos segura):

1. Interrompa o servidor MySQL, se necessário, e reinicie-o com a opção `--skip-grant-tables`. Isso permite que qualquer pessoa se conecte sem senha e com todos os privilégios, e desativa declarações de gerenciamento de contas, como `ALTER USER` e `SET PASSWORD`. Como isso é inseguro, você pode querer usar `--skip-grant-tables` em conjunto com a habilitação da variável de sistema `skip_networking` para impedir que clientes remotos se conectem. Em plataformas Windows, se você habilitar `skip_networking`, também deve habilitar `shared_memory` ou `named_pipe`; caso contrário, o servidor não pode ser iniciado.

2. Conecte-se ao servidor MySQL usando o cliente **mysql; não é necessário senha, pois o servidor foi iniciado com `--skip-grant-tables`:

   ```sql
   $> mysql
   ```

3. No cliente `mysql`, diga ao servidor para recarregar as tabelas de concessão para que as declarações de gerenciamento de contas funcionem:

   ```sql
   mysql> FLUSH PRIVILEGES;
   ```

Em seguida, mude a senha da conta `'root'@'localhost'`. Substitua a senha pela senha que você deseja usar. Para alterar a senha de uma conta `root` com uma parte de nome de host diferente, modifique as instruções para usar esse nome de host.

   ```sql
   mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass';
   ```

Agora você deve ser capaz de se conectar ao servidor MySQL como `root` usando a nova senha. Parar o servidor e reiniciá-lo normalmente (sem a opção `--skip-grant-tables` e sem habilitar a variável de sistema `skip_networking`).

Se a declaração `ALTER USER` não conseguir redefinir a senha, tente repetir o procedimento usando as seguintes declarações para modificar diretamente a tabela `user`:

```sql
UPDATE mysql.user SET authentication_string = PASSWORD('MyNewPass')
WHERE User = 'root' AND Host = 'localhost';
FLUSH PRIVILEGES;
```

#### B.3.3.3 O que fazer se o MySQL continuar a falhar

Cada versão do MySQL é testada em muitas plataformas antes de ser lançada. Isso não significa que não haja bugs no MySQL, mas se houver bugs, eles devem ser muito poucos e podem ser difíceis de encontrar. Se você tiver um problema, sempre ajuda se você tentar descobrir exatamente o que está causando o crash do seu sistema, porque você tem uma chance muito melhor de resolver o problema rapidamente.

Primeiro, você deve tentar descobrir se o problema é que o servidor `mysqld` morre ou se o seu problema tem a ver com o seu cliente. Você pode verificar por quanto tempo o seu servidor `mysqld` está ativo, executando **mysqladmin versão**. Se o `mysqld` morreu e foi reiniciado, você pode encontrar a razão olhando o log de erro do servidor. Veja a Seção 5.4.2, “O Log de Erro”.

Em alguns sistemas, você pode encontrar no log de erro uma depuração de onde o `mysqld` morreu, que você pode resolver com o programa `resolve_stack_dump`. Veja a Seção 5.8, “Depuração do MySQL”. Note que os valores das variáveis escritos no log de erro nem sempre serão 100% corretos.

Muitas saídas inesperadas do servidor são causadas por arquivos de dados ou arquivos de índice corrompidos. O MySQL atualiza os arquivos no disco com a chamada `write()` após cada declaração SQL e antes de o cliente ser notificado sobre o resultado. (Isso não é verdade se você estiver executando com a variável de sistema `delay_key_write` habilitada, no caso em que os arquivos de dados são escritos, mas não os arquivos de índice.) Isso significa que o conteúdo dos arquivos de dados é seguro mesmo se o `mysqld` falhar, porque o sistema operacional garante que os dados não apagados sejam escritos no disco. Você pode forçar o MySQL a apagar tudo no disco após cada declaração SQL, iniciando o `mysqld` com a opção `--flush`.

O que precede significa que, normalmente, você não deve obter tabelas corrompidas, a menos que uma das seguintes situações ocorra:

* O servidor MySQL ou o host do servidor foi interrompido durante uma atualização.

* Você encontrou um erro em `mysqld` que o fez morrer em meio a uma atualização.

* Alguns programas externos estão manipulando arquivos de dados ou arquivos de índice ao mesmo tempo que `mysqld` sem bloquear a tabela corretamente.

* Você está executando muitos servidores `mysqld` usando o mesmo diretório de dados em um sistema que não suporta bons bloqueios de sistema de arquivos (normalmente gerenciado pelo gerenciador de bloqueio `lockd`), ou está executando vários servidores com bloqueio externo desativado.

* Você tem um arquivo de dados ou arquivo de índice que contém dados muito corrompidos que confundiram `mysqld`.

* Você encontrou um erro no código de armazenamento de dados. Isso não é provável, mas é pelo menos possível. Neste caso, você pode tentar alterar o motor de armazenamento para outro motor usando `ALTER TABLE` em uma cópia reparada da tabela.

Porque é muito difícil saber por que algo está falhando, tente primeiro verificar se as coisas que funcionam para outros resultam em uma saída inesperada para você. Experimente as seguintes coisas:

* Parar o servidor `mysqld` com **mysqladmin shutdown**, executar **myisamchk --silent --force \*/\*.MYI** a partir do diretório de dados para verificar todas as tabelas `MyISAM`, e reiniciar `mysqld`. Isso garante que você esteja executando em um estado limpo. Veja o Capítulo 5, * Administração do Servidor MySQL*.

* Inicie `mysqld` com o registro de consulta geral habilitado (consulte a Seção 5.4.3, “O Registro de Consulta Geral”). Em seguida, tente determinar, com base nas informações escritas no log, se alguma consulta específica está matando o servidor. Aproximadamente 95% de todos os bugs estão relacionados a uma consulta específica. Normalmente, essa é uma das últimas consultas no arquivo de log, logo antes do servidor reiniciar. Consulte a Seção 5.4.3, “O Registro de Consulta Geral”. Se você puder matar o MySQL repetidamente com uma consulta específica, mesmo quando verificou todas as tabelas logo antes de emiti-la, então você isolou o bug e deve enviar um relatório de bug para ele. Consulte a Seção 1.5, “Como Relatar Bugs ou Problemas”.

* Tente criar um caso de teste que possamos usar para repetir o problema. Veja a Seção 5.8, “Depuração do MySQL”.

* Experimente o script `fork_big.pl`. (Ele está localizado no diretório `tests` das distribuições de código-fonte.)

* Configurar o MySQL para depuração facilita muito a coleta de informações sobre possíveis erros, caso algo dê errado. Reconfigurar o MySQL com a opção `-DWITH_DEBUG=1` para o **CMake** e, em seguida, recompilar. Veja a Seção 5.8, “Depuração do MySQL”.

* Certifique-se de que aplicou os patches mais recentes para o seu sistema operacional.

* Use a opção `--skip-external-locking` para `mysqld`. Em alguns sistemas, o gerenciador de bloqueio `lockd` não funciona corretamente; a opção `--skip-external-locking` informa ao `mysqld` que não use bloqueio externo. (Isso significa que você não pode executar dois servidores `mysqld` no mesmo diretório de dados e que você deve ter cuidado se usar **myisamchk**. No entanto, pode ser instrutivo tentar a opção como um teste.)

* Se o `mysqld` parecer estar rodando, mas não respondendo, tente **mysqladmin -u root processlist**. Às vezes, o `mysqld` não fica parado, mesmo que pareça não responder. O problema pode ser que todas as conexões estejam sendo usadas, ou pode haver algum problema de bloqueio interno. **mysqladmin -u root processlist** geralmente consegue fazer uma conexão mesmo nesses casos, e pode fornecer informações úteis sobre o número atual de conexões e seu status.

* Execute o comando **mysqladmin -i 5 status** ou **mysqladmin -i 5 -r status** em uma janela separada para obter estatísticas enquanto executa outras consultas.

* Experimente o seguinte:

1. Inicie `mysqld` a partir do **gdb** (ou outro depurador). Veja a Seção 5.8, “Depuração do MySQL”.

2. Execute seus scripts de teste.
3. Imprima o backtrace e as variáveis locais nos três níveis mais baixos. Em **gdb**, você pode fazer isso com os seguintes comandos quando `mysqld` caiu dentro de **gdb**:

     ```sql
     backtrace
     info local
     up
     info local
     up
     info local
     ```

Com o **gdb**, você também pode examinar quais threads existem com `info threads` e alternar para um thread específico com `thread N`, onde *`N`* é o ID do thread.

* Tente simular sua aplicação com um script Perl para forçar o MySQL a sair ou a se comportar mal.

* Envie um relatório de erro normal. Veja a Seção 1.5, “Como relatar erros ou problemas”. Seja ainda mais detalhado do que o habitual. Como o MySQL funciona para muitas pessoas, o travamento pode resultar de algo que existe apenas no seu computador (por exemplo, um erro relacionado às suas bibliotecas de sistema específicas).

* Se você tem um problema com tabelas que contêm linhas de comprimento dinâmico e está usando apenas as colunas `VARCHAR` (não as colunas `BLOB` ou `TEXT`), você pode tentar alterar todas as `VARCHAR` para `CHAR` com `ALTER TABLE`. Isso força o MySQL a usar linhas de tamanho fixo. As linhas de tamanho fixo ocupam um pouco mais de espaço, mas são muito mais tolerantes à corrupção.

O código dinâmico atual de linha tem sido usado por vários anos com poucos problemas, mas as linhas de comprimento dinâmico são, por natureza, mais propensas a erros, então pode ser uma boa ideia tentar essa estratégia para ver se ajuda.

* Considere a possibilidade de falhas de hardware ao diagnosticar problemas. O hardware defeituoso pode ser a causa da corrupção de dados. Preste atenção especial à sua memória e aos subsistemas de disco ao solucionar problemas de hardware.

#### B.3.3.4 Como o MySQL lida com um disco completo

Esta seção descreve como o MySQL responde a erros de disco cheio (como "não há espaço disponível no dispositivo") e a erros de excedente de quota (como "escrita falhou" ou "limite de bloqueio do usuário atingido").

Esta seção é relevante para gravações em tabelas `MyISAM`. Ela também se aplica para gravações em arquivos de log binário e arquivo de índice de log binário, exceto que as referências a “linha” e “registro” devem ser entendidas como “evento”.

Quando ocorre uma condição de disco cheio, o MySQL faz o seguinte:

* Verifica uma vez por minuto para verificar se há espaço suficiente para escrever a linha atual. Se houver espaço suficiente, continua como se nada tivesse acontecido.

* a cada 10 minutos, escreve uma entrada no arquivo de registro, alertando sobre a condição de disco cheio.

Para aliviar o problema, tome as seguintes ações:

* Para continuar, você só precisa liberar espaço de disco suficiente para inserir todos os registros.

* Alternativamente, para abortar o fio, use **mysqladmin kill**. O fio é abortado na próxima vez que verificar o disco (em um minuto).

* Outros threads podem estar esperando pela tabela que causou a condição de disco cheio. Se você tiver vários threads "bloqueadas", matar o thread que está esperando a condição de disco cheio permite que os outros threads continuem.

As exceções ao comportamento anterior são quando você usa `REPAIR TABLE` ou `OPTIMIZE TABLE` ou quando os índices são criados em lote após `LOAD DATA` ou após uma declaração `ALTER TABLE`. Todas essas declarações podem criar grandes arquivos temporários que, se deixados sozinhos, causariam grandes problemas para o resto do sistema. Se o disco ficar cheio enquanto o MySQL está fazendo alguma dessas operações, ele remove os grandes arquivos temporários e marca a tabela como quebrada. A exceção é que, para `ALTER TABLE`, a tabela antiga é deixada inalterada.

#### B.3.3.5 Onde o MySQL armazena arquivos temporários

No Unix, o MySQL usa o valor da variável de ambiente `TMPDIR` como o nome do caminho do diretório onde os arquivos temporários serão armazenados. Se `TMPDIR` não estiver definido, o MySQL usa o padrão do sistema, que geralmente é `/tmp`, `/var/tmp` ou `/usr/tmp`.

No Windows, o MySQL verifica em ordem os valores das variáveis de ambiente `TMPDIR`, `TEMP` e `TMP`. Para o primeiro valor encontrado como sendo definido, o MySQL usa-o e não verifica os demais. Se nenhum dos valores de `TMPDIR`, `TEMP` ou `TMP` estiver definido, o MySQL usa o padrão do sistema do Windows, que geralmente é `C:\windows\temp\`.

Se o sistema de arquivos que contém o diretório do seu arquivo temporário for muito pequeno, você pode usar a opção `mysqld` `--tmpdir` para especificar um diretório em um sistema de arquivos onde você tem espaço suficiente.

A opção `--tmpdir` pode ser definida como uma lista de vários caminhos que são usados de forma rotativa. Os caminhos devem ser separados por caracteres de colon (`:`) em Unix e por caracteres de ponto e vírgula (`;`) em Windows.

Nota

Para espalhar a carga de forma eficaz, esses caminhos devem estar localizados em diferentes *discos físicos*, e não em diferentes partições do mesmo disco.

Se o servidor MySQL estiver atuando como uma replica, você pode definir a variável de sistema `slave_load_tmpdir` para especificar um diretório separado para armazenar arquivos temporários ao replicar declarações `LOAD DATA`. Esse diretório deve estar em um sistema de arquivos baseado em disco (não em um sistema de arquivos baseado em memória) para que os arquivos temporários usados para replicar LOAD DATA possam sobreviver a reinicializações da máquina. O diretório também não deve ser um que seja limpo pelo sistema operacional durante o processo de inicialização do sistema. No entanto, a replicação agora pode continuar após um reinício se os arquivos temporários tiverem sido removidos.

O MySQL garante que os arquivos temporários são removidos se o `mysqld` for encerrado. Em plataformas que o suportam (como o Unix), isso é feito desvinculando o arquivo após abri-lo. A desvantagem disso é que o nome não aparece em listas de diretórios e você não vê um grande arquivo temporário que preenche o sistema de arquivos no qual o diretório do arquivo temporário está localizado. (Nesses casos, **lsof +L1** pode ser útil para identificar arquivos grandes associados ao `mysqld`.)

Ao fazer uma classificação (`ORDER BY` ou `GROUP BY`, o MySQL normalmente usa um ou dois arquivos temporários. O espaço máximo de disco necessário é determinado pela seguinte expressão:

```sql
(length of what is sorted + sizeof(row pointer))
* number of matched rows
* 2
```

O tamanho do ponteiro de linha geralmente é de quatro bytes, mas pode aumentar no futuro para tabelas muito grandes.

Para algumas declarações, o MySQL cria tabelas SQL temporárias que não são ocultas e têm nomes que começam com `#sql`.

Algumas consultas do `SELECT` criam tabelas SQL temporárias para armazenar resultados intermediários.

As operações DDL que reconstroem a tabela e não são realizadas online usando a técnica `ALGORITHM=INPLACE` criam uma cópia temporária da tabela original no mesmo diretório da tabela original.

As operações DDL online podem usar arquivos de registro temporários para gravar DML concorrente, arquivos temporários de classificação ao criar um índice e arquivos de tabelas intermediárias temporárias ao reconstruir a tabela. Para mais informações, consulte a Seção 14.13.3, “Requisitos de Espaço DDL Online”.

`InnoDB` tabelas temporárias não comprimidas, criadas pelo usuário e tabelas temporárias internas em disco são criadas em um arquivo de espaço de tabelas temporárias chamado `ibtmp1` no diretório de dados do MySQL. Para mais informações, consulte a Seção 14.6.3.5, “O Espaço de Tabelas Temporárias”.

Veja também a Seção 14.16.7, “Tabela de informações temporárias do InnoDB do esquema de informações”. Tabelas temporárias órfãs.

#### B.3.3.6 Como proteger ou alterar o arquivo de soquete Unix do MySQL

O local padrão para o arquivo de socket Unix que o servidor usa para comunicação com clientes locais é `/tmp/mysql.sock`. (Para alguns formatos de distribuição, o diretório pode ser diferente, como `/var/lib/mysql` para RPMs.)

Em algumas versões do Unix, qualquer pessoa pode excluir arquivos no diretório `/tmp` ou em outros diretórios semelhantes usados para arquivos temporários. Se o arquivo de soquete estiver localizado em um desses diretórios no seu sistema, isso pode causar problemas.

Na maioria das versões do Unix, você pode proteger o diretório `/tmp` para que os arquivos só possam ser excluídos pelos seus proprietários ou pelo superusuário (`root`). Para fazer isso, configure o bit `sticky` no diretório `/tmp` iniciando sessão como `root` e usando o seguinte comando:

```sql
$> chmod +t /tmp
```

Você pode verificar se o bit `sticky` está definido executando `ls -ld /tmp`. Se o último caractere de permissão for `t`, o bit está definido.

Outra abordagem é alterar o local onde o servidor cria o arquivo de soquete Unix. Se você fizer isso, também deve informar aos programas cliente a nova localização do arquivo. Você pode especificar a localização do arquivo de várias maneiras:

* Especifique o caminho em um arquivo de opção global ou local. Por exemplo, coloque as seguintes linhas em `/etc/my.cnf`:

  ```sql
  [mysqld]
  socket=/path/to/socket

  [client]
  socket=/path/to/socket
  ```

Veja a Seção 4.2.2.2, “Usando arquivos de opção”.

* Especifique uma opção `--socket` na linha de comando para `mysqld_safe` e quando você executar programas de cliente.

* Defina a variável de ambiente `MYSQL_UNIX_PORT` para o caminho do arquivo de socket Unix.

* Recompile o MySQL a partir da fonte para usar um local de arquivo de soquete Unix diferente. Defina o caminho do arquivo com a opção `MYSQL_UNIX_ADDR` quando você executar o **CMake**. Veja a Seção 2.8.7, “Opções de Configuração de Fonte do MySQL”.

Você pode testar se o novo local do soquete funciona tentando se conectar ao servidor com este comando:

```sql
$> mysqladmin --socket=/path/to/socket version
```

#### B.3.3.7 Problemas com fuso horário

Se você tem um problema com o `SELECT NOW()` retornando valores em UTC e não a sua hora local, você tem que informar ao servidor seu fuso horário atual. O mesmo se aplica se o `UNIX_TIMESTAMP()` retornar o valor errado. Isso deve ser feito para o ambiente em que o servidor está rodando (por exemplo, em `mysqld_safe` ou **mysql.server**). Veja a Seção 4.9, “Variáveis de Ambiente”.

Você pode definir o fuso horário do servidor com a opção `--timezone=timezone_name` para `mysqld_safe`. Você também pode defini-lo definindo a variável de ambiente `TZ` antes de iniciar `mysqld`.

Os valores permitidos para `--timezone` ou `TZ` dependem do sistema. Consulte a documentação do seu sistema operacional para saber quais valores são aceitáveis.

### B.3.4 Questões relacionadas a consultas

#### B.3.4.1 Sensibilidade de Caso nas Pesquisas de String

Para cadeias não binárias (`CHAR`, `VARCHAR`, `TEXT`), as pesquisas de cadeia utilizam a collation dos operadores de comparação. Para cadeias binárias (`BINARY`, `VARBINARY`, `BLOB`), as comparações utilizam os valores numéricos dos bytes nos operadores; isso significa que, para caracteres alfabéticos, as comparações são sensíveis ao caso.

Uma comparação entre uma cadeia não binária e uma cadeia binária é tratada como uma comparação de cadeias binárias.

As operações de comparação simples (`>=, >, =, <, <=`, ordenação e agrupamento) são baseadas no "valor de ordenação" de cada caractere. Os caracteres com o mesmo valor de ordenação são tratados como o mesmo caractere. Por exemplo, se `e` e `é` tiverem o mesmo valor de ordenação em uma determinada ordenação, eles são comparados como iguais.

O conjunto de caracteres e a correção padrão são `latin1` e `latin1_swedish_ci`, portanto, as comparações de cadeias não binárias são sensíveis ao caso padrão. Isso significa que, se você pesquisar com `col_name LIKE 'a%'`, obterá todos os valores da coluna que começam com `A` ou `a`. Para tornar essa pesquisa sensível ao caso, certifique-se de que uma das operações tenha uma correção sensível ao caso ou binária. Por exemplo, se você estiver comparando uma coluna e uma cadeia que têm o conjunto de caracteres `latin1`, pode usar o operador `COLLATE` para fazer com que uma das operações tenha a correção `latin1_general_cs` ou `latin1_bin`:

```sql
col_name COLLATE latin1_general_cs LIKE 'a%'
col_name LIKE 'a%' COLLATE latin1_general_cs
col_name COLLATE latin1_bin LIKE 'a%'
col_name LIKE 'a%' COLLATE latin1_bin
```

Se você deseja que uma coluna sempre seja tratada de forma sensível ao caso, declare-a com uma codificação sensível ao caso ou binária. Veja a Seção 13.1.18, “Instrução CREATE TABLE”.

Para fazer uma comparação sensível ao caso das cadeias de caracteres não binárias ser insensível ao caso, use `COLLATE` para nomear uma ordenação insensível ao caso. As cadeias de caracteres no exemplo a seguir são normalmente sensíveis ao caso, mas `COLLATE` altera a comparação para ser insensível ao caso:

```sql
mysql> SET @s1 = 'MySQL' COLLATE latin1_bin,
    ->     @s2 = 'mysql' COLLATE latin1_bin;
mysql> SELECT @s1 = @s2;
+-----------+
| @s1 = @s2 |
+-----------+
|         0 |
+-----------+
mysql> SELECT @s1 COLLATE latin1_swedish_ci = @s2;
+-------------------------------------+
| @s1 COLLATE latin1_swedish_ci = @s2 |
+-------------------------------------+
|                                   1 |
+-------------------------------------+
```

Uma string binária é sensível ao caso em comparações. Para comparar a string como insensível ao caso, converta-a em uma string não binária e use `COLLATE` para nomear uma ordenação insensível ao caso:

```sql
mysql> SET @s = BINARY 'MySQL';
mysql> SELECT @s = 'mysql';
+--------------+
| @s = 'mysql' |
+--------------+
|            0 |
+--------------+
mysql> SELECT CONVERT(@s USING latin1) COLLATE latin1_swedish_ci = 'mysql';
+--------------------------------------------------------------+
| CONVERT(@s USING latin1) COLLATE latin1_swedish_ci = 'mysql' |
+--------------------------------------------------------------+
|                                                            1 |
+--------------------------------------------------------------+
```

Para determinar se um valor é uma string não binária ou binária, use a função `COLLATION()`. Este exemplo mostra que `VERSION()` retorna uma string que tem uma collation sensível a maiúsculas e minúsculas, portanto, as comparações são sensíveis a maiúsculas e minúsculas:

```sql
mysql> SELECT COLLATION(VERSION());
+----------------------+
| COLLATION(VERSION()) |
+----------------------+
| utf8_general_ci      |
+----------------------+
```

Para strings binárias, o valor da correção é `binary`, portanto, as comparações são sensíveis ao caso. Um contexto em que você pode ver `binary` é para funções de compressão, que, como regra geral, retornam strings binárias:

```sql
mysql> SELECT COLLATION(COMPRESS('x'));
+--------------------------+
| COLLATION(COMPRESS('x')) |
+--------------------------+
| binary                   |
+--------------------------+
```

Para verificar o valor de classificação de uma string, o `WEIGHT_STRING()` pode ser útil. Veja a Seção 12.8, “Funções e Operadores de String”.

#### B.3.4.2 Problemas ao usar colunas DATE

O formato de um valor `DATE` é `'YYYY-MM-DD'`. De acordo com a SQL padrão, nenhum outro formato é permitido. Você deve usar este formato nas expressões `UPDATE` e na cláusula `WHERE` das declarações `SELECT`. Por exemplo:

```sql
SELECT * FROM t1 WHERE date >= '2003-05-05';
```

Como uma conveniência, o MySQL converte automaticamente uma data em um número se a data for usada em um contexto numérico e vice-versa. O MySQL também permite um formato de string “relaxado” ao atualizar e em uma cláusula `WHERE` que compara uma data a uma coluna `DATE`, `DATETIME` ou `TIMESTAMP`. O formato “relaxado” significa que qualquer caractere de pontuação pode ser usado como separador entre as partes. Por exemplo, `'2004-08-15'` e `'2004#08#15'` são equivalentes. O MySQL também pode converter uma string que não contém separadores (como `'20040815'`, desde que faça sentido como uma data.

Quando você compara um `DATE`, `TIME`, `DATETIME` ou `TIMESTAMP` com uma string constante usando os operadores `<`, `<=`, `=`, `>=`, `>` ou `BETWEEN`, o MySQL normalmente converte a string em um inteiro longo interno para uma comparação mais rápida (e também para uma verificação de string um pouco mais "relaxada"). No entanto, essa conversão está sujeita às seguintes exceções:

* Quando você compara duas colunas
* Quando você compara uma coluna `DATE`, `TIME`, `DATETIME` ou `TIMESTAMP` a uma expressão

* Quando você usar qualquer método de comparação que não seja os que foram listados acima, como `IN` ou `STRCMP()`.

Para essas exceções, a comparação é feita convertendo os objetos em strings e realizando uma comparação de strings.

Para se proteger, suponha que as cadeias sejam comparadas como cadeias e use as funções apropriadas de cadeia se você quiser comparar um valor temporal com uma cadeia.

A data especial “zero” `'0000-00-00'` pode ser armazenada e recuperada como `'0000-00-00'.`. Quando uma data `'0000-00-00'` é usada através do Connector/ODBC, ela é automaticamente convertida em `NULL`, pois o ODBC não pode lidar com esse tipo de data.

Como o MySQL realiza as conversões descritas acima, as seguintes declarações funcionam (suponha que `idate` seja uma coluna `DATE`):

```sql
INSERT INTO t1 (idate) VALUES (19970505);
INSERT INTO t1 (idate) VALUES ('19970505');
INSERT INTO t1 (idate) VALUES ('97-05-05');
INSERT INTO t1 (idate) VALUES ('1997.05.05');
INSERT INTO t1 (idate) VALUES ('1997 05 05');
INSERT INTO t1 (idate) VALUES ('0000-00-00');

SELECT idate FROM t1 WHERE idate >= '1997-05-05';
SELECT idate FROM t1 WHERE idate >= 19970505;
SELECT MOD(idate,100) FROM t1 WHERE idate >= 19970505;
SELECT idate FROM t1 WHERE idate >= '19970505';
```

No entanto, a seguinte afirmação não funciona:

```sql
SELECT idate FROM t1 WHERE STRCMP(idate,'20030505')=0;
```

`STRCMP()` é uma função de cadeia, portanto, converte `idate` em uma cadeia no formato `'YYYY-MM-DD'` e realiza uma comparação de cadeia. Não converte `'20030505'` para a data `'2003-05-05'` e não realiza uma comparação de data.

Se você ativar o modo SQL `ALLOW_INVALID_DATES`, o MySQL permite que você armazene datas que recebem apenas verificações limitadas: o MySQL exige apenas que o dia esteja no intervalo de 1 a 31 e o mês esteja no intervalo de 1 a 12. Isso torna o MySQL muito conveniente para aplicações web onde você obtém ano, mês e dia em três campos diferentes e deseja armazenar exatamente o que o usuário inseriu (sem validação de data).

O MySQL permite que você armazene datas onde o dia ou o mês e o dia são zero. Isso é conveniente se você quiser armazenar uma data de nascimento em uma coluna `DATE` e você conhece apenas parte da data. Para não permitir partes de mês ou dia zero nas datas, habilite o modo `NO_ZERO_IN_DATE`.

O MySQL permite que você armazene um valor de "zero" de `'0000-00-00'` como uma "data fictícia". Em alguns casos, isso é mais conveniente do que usar os valores de `NULL`. Se uma data que deve ser armazenada em uma coluna de `DATE` não puder ser convertida em qualquer valor razoável, o MySQL armazena `'0000-00-00'`. Para não permitir `'0000-00-00'`, habilite o modo `NO_ZERO_DATE`.

Para que o MySQL verifique todas as datas e aceite apenas datas legais (a menos que seja sobrescrito por `IGNORE`), defina a variável de sistema `sql_mode` para `"NO_ZERO_IN_DATE,NO_ZERO_DATE"`.

#### B.3.4.3 Problemas com valores nulos

O conceito do valor `NULL` é uma fonte comum de confusão para os recém-chegados ao SQL, que muitas vezes pensam que `NULL` é a mesma coisa que uma string vazia `''`. Isso não é o caso. Por exemplo, as seguintes declarações são completamente diferentes:

```sql
mysql> INSERT INTO my_table (phone) VALUES (NULL);
mysql> INSERT INTO my_table (phone) VALUES ('');
```

Ambas as declarações inserem um valor na coluna `phone`, mas a primeira insere um valor `NULL` e a segunda insere uma string vazia. O significado da primeira pode ser considerado como “número de telefone não é conhecido” e o significado da segunda pode ser considerado como “a pessoa é conhecida por não ter telefone, e, portanto, nenhum número de telefone”.

Para ajudar no manuseio do `NULL`, você pode usar os operadores `IS NULL` e `IS NOT NULL` e a função `IFNULL()`.

Em SQL, o valor `NULL` nunca é verdadeiro em comparação com qualquer outro valor, mesmo `NULL`. Uma expressão que contém `NULL` sempre produz um valor `NULL`, a menos que haja indicação em contrário na documentação dos operadores e funções envolvidos na expressão. Todas as colunas no exemplo a seguir retornam `NULL`:

```sql
mysql> SELECT NULL, 1+NULL, CONCAT('Invisible',NULL);
```

Para procurar valores de coluna que sejam `NULL`, você não pode usar um teste `expr = NULL`. A seguinte declaração não retorna nenhuma linha, porque `expr = NULL` nunca é verdadeiro para qualquer expressão:

```sql
mysql> SELECT * FROM my_table WHERE phone = NULL;
```

Para procurar os valores de `NULL`, você deve usar o teste `IS NULL`. As seguintes declarações mostram como encontrar o número de telefone `NULL` e o número de telefone vazio:

```sql
mysql> SELECT * FROM my_table WHERE phone IS NULL;
mysql> SELECT * FROM my_table WHERE phone = '';
```

Veja a Seção 3.3.4.6, “Trabalhando com Valores NULL”, para informações adicionais e exemplos.

Você pode adicionar um índice em uma coluna que pode ter valores de `NULL` se você estiver usando o mecanismo de armazenamento `MyISAM`, `InnoDB` ou `MEMORY`. Caso contrário, você deve declarar uma coluna indexada `NOT NULL`, e não pode inserir `NULL` na coluna.

Ao ler dados com `LOAD DATA`, colunas vazias ou ausentes são atualizadas com `''`. Para carregar um valor de `NULL` em uma coluna, use `\N` no arquivo de dados. A palavra literal `NULL` também pode ser usada em algumas circunstâncias. Veja a Seção 13.2.6, “Instrução LOAD DATA”.

Ao usar `DISTINCT`, `GROUP BY` ou `ORDER BY`, todos os valores de `NULL` são considerados iguais.

Ao usar `ORDER BY`, os valores de `NULL` são apresentados primeiro, ou por último, se você especificar `DESC` para ordenar em ordem decrescente.

As funções agregadas (de grupo), como `COUNT()`, `MIN()` e `SUM()`, ignoram os valores de `NULL`. A exceção a isso é `COUNT(*)`, que conta linhas e não valores individuais de coluna. Por exemplo, a seguinte declaração produz dois contagem. A primeira é uma contagem do número de linhas na tabela, e a segunda é uma contagem do número de valores que não são `NULL` na coluna `age`:

```sql
mysql> SELECT COUNT(*), COUNT(age) FROM person;
```

Para alguns tipos de dados, o MySQL lida especialmente com os valores de `NULL`. Por exemplo, se você inserir `NULL` em uma coluna de inteiro ou ponto flutuante que tem o atributo `AUTO_INCREMENT`, o próximo número na sequência é inserido. Sob certas condições, se você inserir `NULL` em uma coluna de `TIMESTAMP`, a data e a hora atuais são inseridas; esse comportamento depende em parte do modo SQL do servidor (ver Seção 5.1.10, “Modos SQL do Servidor”) e também do valor da variável de sistema `explicit_defaults_for_timestamp`.

#### B.3.4.4 Problemas com aliases de coluna

Um alias pode ser usado em uma lista de seleção de consulta para dar a uma coluna um nome diferente. Você pode usar o alias nas cláusulas `GROUP BY`, `ORDER BY` ou `HAVING` para se referir à coluna:

```sql
SELECT SQRT(a*b) AS root FROM tbl_name
  GROUP BY root HAVING root > 0;
SELECT id, COUNT(*) AS cnt FROM tbl_name
  GROUP BY id HAVING cnt > 0;
SELECT id AS 'Customer identity' FROM tbl_name;
```

O SQL padrão não permite referências a aliases de coluna em uma cláusula `WHERE`. Essa restrição é imposta porque, quando a cláusula `WHERE` é avaliada, o valor da coluna ainda pode não ter sido determinado. Por exemplo, a seguinte consulta é ilegal:

```sql
SELECT id, COUNT(*) AS cnt FROM tbl_name
  WHERE cnt > 0 GROUP BY id;
```

A cláusula `WHERE` determina quais linhas devem ser incluídas na cláusula `GROUP BY`, mas ela se refere ao alias de um valor de coluna que não é conhecido até que as linhas tenham sido selecionadas e agrupadas pelo `GROUP BY`.

Na lista selecionada de uma consulta, um alias de coluna com citação pode ser especificado usando caracteres de citação de identificador ou cadeia:

```sql
SELECT 1 AS `one`, 2 AS 'two';
```

Em outro lugar na declaração, as referências a alias citadas devem usar citação de identificador ou a referência é tratada como um literal de string. Por exemplo, esta declaração agrupa pelos valores na coluna `id`, referenciada usando o alias `` `a` ``:

```sql
SELECT id AS 'a', COUNT(*) AS cnt FROM tbl_name
  GROUP BY `a`;
```

Essa declaração agrupa por cadeia literal `'a'` e não funciona conforme o esperado:

```sql
SELECT id AS 'a', COUNT(*) AS cnt FROM tbl_name
  GROUP BY 'a';
```

#### B.3.4.5 Falha no retorno para tabelas não transacionais

Se você receber a seguinte mensagem ao tentar realizar um `ROLLBACK`, isso significa que uma ou mais das tabelas que você usou na transação não suportam transações:

```sql
Warning: Some non-transactional changed tables couldn't be rolled back
```

Essas tabelas não transacionais não são afetadas pela declaração `ROLLBACK`.

Se você não estivesse deliberadamente misturando tabelas transacionais e não transacionais dentro da transação, a causa mais provável para esta mensagem é que uma tabela que você pensava ser transacional na verdade não é. Isso pode acontecer se você tentar criar uma tabela usando um mecanismo de armazenamento transacional que não é suportado pelo seu servidor `mysqld` (ou que foi desativado com uma opção de inicialização). Se o `mysqld` não suporta um mecanismo de armazenamento, ele cria a tabela em vez disso como uma tabela `MyISAM`, que é não transacional.

Você pode verificar o mecanismo de armazenamento de uma tabela usando qualquer uma dessas declarações:

```sql
SHOW TABLE STATUS LIKE 'tbl_name';
SHOW CREATE TABLE tbl_name;
```

Veja a Seção 13.7.5.36, “Declaração de Status da Tabela”, e a Seção 13.7.5.10, “Declaração de Criar a Tabela”.

Para verificar quais motores de armazenamento o seu servidor `mysqld` suporta, use esta declaração:

```sql
SHOW ENGINES;
```

Consulte a Seção 13.7.5.16, “Declaração de MOTORES DE EXIBIÇÃO”, para obter detalhes completos.

#### B.3.4.6 Excluindo Linhas de Tabelas Relacionadas

Se o comprimento total da declaração `DELETE` para `related_table` for superior a 1 MB (o valor padrão da variável de sistema `max_allowed_packet`), você deve dividi-la em partes menores e executar várias declarações `DELETE`. Provavelmente, obterá o `DELETE` mais rápido, especificando apenas 100 a 1.000 valores de `related_column` por declaração, se o `related_column` estiver indexado. Se o `related_column` não estiver indexado, a velocidade é independente do número de argumentos na cláusula `IN`.

#### B.3.4.7 Resolvendo problemas sem linhas correspondentes

Se você tiver uma consulta complicada que usa muitas tabelas, mas que não retorna nenhuma linha, você deve usar o procedimento a seguir para descobrir o que está errado:

1. Teste a consulta com `EXPLAIN` para verificar se você pode encontrar algo que é obviamente errado. Veja a Seção 13.8.2, “Instrução EXPLAIN”.

2. Selecione apenas as colunas que são utilizadas na cláusula `WHERE`.

3. Remova uma tabela de cada vez da consulta até que ela retorne algumas linhas. Se as tabelas forem grandes, é uma boa ideia usar `LIMIT 10` com a consulta.

4. Emitir um `SELECT` para a coluna que deve ter correspondido a uma linha contra a tabela que foi removida da consulta.

5. Se você estiver comparando as colunas `FLOAT` - FLOAT, DOUBLE") ou `DOUBLE` - FLOAT, DOUBLE") com números que têm decimais, não pode usar comparações de igualdade (`=`). Esse problema é comum na maioria dos idiomas de computador, pois nem todos os valores de ponto flutuante podem ser armazenados com precisão exata. Em alguns casos, alterar o `FLOAT` - FLOAT, DOUBLE") para um `DOUBLE` - FLOAT, DOUBLE") resolve esse problema. Veja a Seção B.3.4.8, “Problemas com Valores de Ponto Flutuante”.

6. Se você ainda não consegue descobrir o que está errado, crie um teste mínimo que possa ser executado com `mysql test < query.sql` que mostre seus problemas. Você pode criar um arquivo de teste drenando as tabelas com **mysqldump --quick db\_name *`tbl_name_1`* ... *`tbl_name_n`* > query.sql**. Abra o arquivo em um editor, remova algumas linhas de inserção (se houver mais do que o necessário para demonstrar o problema) e adicione sua declaração `SELECT` no final do arquivo.

Verifique se o arquivo de teste demonstra o problema executando esses comandos:

   ```sql
   $> mysqladmin create test2
   $> mysql test2 < query.sql
   ```

Anexe o arquivo de teste a um relatório de bug, que você pode criar seguindo as instruções na Seção 1.5, “Como relatar bugs ou problemas”.

#### B.3.4.8 Problemas com valores de ponto flutuante

Os números de ponto flutuante às vezes causam confusão porque são aproximados e não armazenados como valores exatos. Um valor de ponto flutuante conforme escrito em uma declaração SQL pode não ser o mesmo que o valor representado internamente. Tentativas de tratar valores de ponto flutuante como exatos em comparações podem levar a problemas. Eles também estão sujeitos a dependências de plataforma ou implementação. Os tipos de dados `FLOAT` - FLOAT, DOUBLE") e `DOUBLE` - FLOAT, DOUBLE") estão sujeitos a essas questões. Para as colunas `DECIMAL` - DECIMAL, NUMERIC")", o MySQL realiza operações com uma precisão de 65 dígitos decimais, o que deve resolver a maioria dos problemas de imprecisão comuns.

O exemplo a seguir usa `DOUBLE` - FLOAT, DOUBLE") para demonstrar como os cálculos que são feitos usando operações de ponto flutuante estão sujeitos a erros de ponto flutuante.

```sql
mysql> CREATE TABLE t1 (i INT, d1 DOUBLE, d2 DOUBLE);
mysql> INSERT INTO t1 VALUES (1, 101.40, 21.40), (1, -80.00, 0.00),
    -> (2, 0.00, 0.00), (2, -13.20, 0.00), (2, 59.60, 46.40),
    -> (2, 30.40, 30.40), (3, 37.00, 7.40), (3, -29.60, 0.00),
    -> (4, 60.00, 15.40), (4, -10.60, 0.00), (4, -34.00, 0.00),
    -> (5, 33.00, 0.00), (5, -25.80, 0.00), (5, 0.00, 7.20),
    -> (6, 0.00, 0.00), (6, -51.40, 0.00);

mysql> SELECT i, SUM(d1) AS a, SUM(d2) AS b
    -> FROM t1 GROUP BY i HAVING a <> b;

+------+-------+------+
| i    | a     | b    |
+------+-------+------+
|    1 |  21.4 | 21.4 |
|    2 |  76.8 | 76.8 |
|    3 |   7.4 |  7.4 |
|    4 |  15.4 | 15.4 |
|    5 |   7.2 |  7.2 |
|    6 | -51.4 |    0 |
+------+-------+------+
```

O resultado está correto. Embora os primeiros cinco registros pareçam não deverem satisfazer a comparação (os valores de `a` e `b` não parecem ser diferentes), eles podem fazê-lo porque a diferença entre os números aparece por volta do décimo decimal ou mais, dependendo de fatores como a arquitetura do computador ou a versão do compilador ou o nível de otimização. Por exemplo, diferentes CPUs podem avaliar números de ponto flutuante de maneira diferente.

Se as colunas `d1` e `d2` tivessem sido definidas como `DECIMAL` - DECIMAL, NUMERIC") em vez de `DOUBLE` - FLOAT, DOUBLE"), o resultado da consulta `SELECT` teria contido apenas uma linha — a última mostrada acima.

A maneira correta de fazer a comparação de números em ponto flutuante é decidir primeiro sobre uma tolerância aceitável para as diferenças entre os números e, em seguida, fazer a comparação contra o valor da tolerância. Por exemplo, se concordamos que os números em ponto flutuante devem ser considerados iguais se forem iguais dentro de uma precisão de um em dez mil (0,0001), a comparação deve ser escrita para encontrar diferenças maiores que o valor da tolerância:

```sql
mysql> SELECT i, SUM(d1) AS a, SUM(d2) AS b FROM t1
    -> GROUP BY i HAVING ABS(a - b) > 0.0001;
+------+-------+------+
| i    | a     | b    |
+------+-------+------+
|    6 | -51.4 |    0 |
+------+-------+------+
1 row in set (0.00 sec)
```

Por outro lado, para obter linhas onde os números são os mesmos, o teste deve encontrar diferenças dentro do valor de tolerância:

```sql
mysql> SELECT i, SUM(d1) AS a, SUM(d2) AS b FROM t1
    -> GROUP BY i HAVING ABS(a - b) <= 0.0001;
+------+------+------+
| i    | a    | b    |
+------+------+------+
|    1 | 21.4 | 21.4 |
|    2 | 76.8 | 76.8 |
|    3 |  7.4 |  7.4 |
|    4 | 15.4 | 15.4 |
|    5 |  7.2 |  7.2 |
+------+------+------+
5 rows in set (0.03 sec)
```

Os valores de ponto flutuante estão sujeitos a dependências da plataforma ou da implementação. Suponha que você execute as seguintes declarações:

```sql
CREATE TABLE t1(c1 FLOAT(53,0), c2 FLOAT(53,0));
INSERT INTO t1 VALUES('1e+52','-1e+52');
SELECT * FROM t1;
```

Em algumas plataformas, a declaração `SELECT` retorna `inf` e `-inf`. Em outras, ela retorna `0` e `-0`.

Uma implicação das questões anteriores é que, se você tentar criar uma réplica descartando o conteúdo da tabela com o **mysqldump** na fonte e recarregar o arquivo de implantação na réplica, as tabelas que contêm colunas de ponto flutuante podem diferir entre os dois hosts.

### B.3.5 Problemas relacionados ao otimizador

O MySQL utiliza um otimizador baseado em custos para determinar a melhor maneira de resolver uma consulta. Em muitos casos, o MySQL pode calcular o melhor plano de consulta possível, mas, às vezes, o MySQL não tem informações suficientes sobre os dados disponíveis e tem que fazer suposições “educativas” sobre os dados.

Para os casos em que o MySQL não faz a coisa "certa", as ferramentas que você tem disponíveis para ajudar o MySQL são:

* Use a declaração `EXPLAIN` para obter informações sobre como o MySQL processa uma consulta. Para usá-la, basta adicionar a palavra-chave `EXPLAIN` na frente da sua declaração `SELECT`:

  ```sql
  mysql> EXPLAIN SELECT * FROM t1, t2 WHERE t1.i = t2.i;
  ```

`EXPLAIN` é discutido em mais detalhes na Seção 13.8.2, “Instrução EXPLAIN”.

* Use `ANALYZE TABLE tbl_name` para atualizar as distribuições de chave para a tabela digitalizada. Veja a Seção 13.7.2.1, “Declaração ANALYZE TABLE”.

* Use `FORCE INDEX` para a tabela digitalizada para informar ao MySQL que as varreduras da tabela são muito caras em comparação com o uso do índice fornecido:

  ```sql
  SELECT * FROM t1, t2 FORCE INDEX (index_for_column)
  WHERE t1.col_name=t2.col_name;
  ```

`USE INDEX` e `IGNORE INDEX` também podem ser úteis. Veja a Seção 8.9.4, “Dicas de índice”.

* `STRAIGHT_JOIN` global e de nível de tabela. Veja a Seção 13.2.9, “Instrução SELECT”.

* Você pode ajustar variáveis de sistema globais ou específicas de fio. Por exemplo, inicie `mysqld` com a opção `--max-seeks-for-key=1000` ou use `SET max_seeks_for_key=1000` para informar ao otimizador que nenhuma varredura de chave causa mais de 1.000 buscas de chave. Veja a Seção 5.1.7, “Variáveis do Sistema do Servidor”.

### B.3.6 Questões relacionadas à definição de tabela

#### B.3.6.1 Problemas com ALTER TABLE

Se você receber um erro de chave duplicada ao usar `ALTER TABLE` para alterar o conjunto de caracteres ou a correção de um campo de caracteres, a causa é que a nova correção de coluna mapeia duas chaves para o mesmo valor ou que a tabela está corrompida. No último caso, você deve executar `REPAIR TABLE` na tabela. `REPAIR TABLE` funciona para as tabelas `MyISAM`, `ARCHIVE` e `CSV`.

Se o `ALTER TABLE` morrer com o seguinte erro, o problema pode ser que o MySQL quebrou durante uma operação anterior do `ALTER TABLE` e há uma tabela antiga chamada `A-xxx` ou `B-xxx` por aí:

```sql
Error on rename of './database/name.frm'
to './database/B-xxx.frm' (Errcode: 17)
```

Nesse caso, vá até o diretório de dados do MySQL e exclua todos os arquivos que tenham nomes começando com `A-` ou `B-`. (Você pode querer movê-los para outro lugar em vez de excluí-los.)

`ALTER TABLE` funciona da seguinte maneira:

* Crie uma nova tabela chamada `A-xxx` com as alterações estruturais solicitadas.

* Copie todas as linhas da tabela original para `A-xxx`.

* Renomeie a tabela original para `B-xxx`.

* Renomeie `A-xxx` para o nome original da sua tabela.

* Exclua `B-xxx`.

Se algo der errado com a operação de renomeamento, o MySQL tenta desfazer as alterações. Se algo der muito errado (embora isso não deva acontecer), o MySQL pode deixar a tabela antiga como `B-xxx`. Uma simples renomeação dos arquivos da tabela no nível do sistema deve recuperar seus dados.

Se você usa `ALTER TABLE` em uma tabela transacional ou se você está usando o Windows, `ALTER TABLE` desbloqueia a tabela se você tivesse feito um `LOCK TABLE` nela. Isso é feito porque `InnoDB` e esses sistemas operacionais não podem descartar uma tabela que está em uso.

#### B.3.6.2 Problemas com a Tabela TEMPORARY

As tabelas temporárias criadas com `CREATE TEMPORARY TABLE` têm as seguintes limitações:

As tabelas `TEMPORARY` são suportadas apenas pelos motores de armazenamento `InnoDB`, `MEMORY`, `MyISAM` e `MERGE`.

* As tabelas temporárias não são suportadas para o NDB Cluster. * A declaração `SHOW TABLES` não lista as tabelas `TEMPORARY`.

* Para renomear as tabelas de `TEMPORARY`, o `RENAME TABLE` não funciona. Use o `ALTER TABLE` em vez disso:

  ```sql
  ALTER TABLE old_name RENAME new_name;
  ```

* Você não pode referenciar uma tabela `TEMPORARY` mais de uma vez na mesma consulta. Por exemplo, o seguinte não funciona:

  ```sql
  SELECT * FROM temp_table JOIN temp_table AS t2;
  ```

A declaração produz este erro:

  ```sql
  ERROR 1137: Can't reopen table: 'temp_table'
  ```

* O erro de não ser possível reabrir a tabela também ocorre se você se referir a uma tabela temporária várias vezes em uma função armazenada sob diferentes aliases, mesmo que as referências ocorram em diferentes declarações dentro da função. Isso pode ocorrer para tabelas temporárias criadas fora das funções armazenadas e referenciadas em múltiplos funções chamadoras e chamadas.

* Se uma tabela `TEMPORARY` for criada com o mesmo nome que uma tabela existente sem `TEMPORARY`, a tabela sem `TEMPORARY` será ocultada até que a tabela `TEMPORARY` seja excluída, mesmo que as tabelas utilizem motores de armazenamento diferentes.

* Há problemas conhecidos ao usar tabelas temporárias com replicação. Consulte a Seção 16.4.1.29, “Replicação e Tabelas Temporárias”, para obter mais informações.

### B.3.7 Problemas Conhecidos no MySQL

Esta seção lista os problemas conhecidos nas versões recentes do MySQL.

Para informações sobre problemas específicos da plataforma, consulte as instruções de instalação e depuração na Seção 2.1, “Orientações gerais de instalação”, e na Seção 5.8, “Depuração do MySQL”.

Os problemas a seguir são conhecidos:

* A otimização de subconsultas para `IN` não é tão eficaz quanto para `=`.

* Mesmo que você use `lower_case_table_names=2` (que permite que o MySQL lembre o caso usado para bancos de dados e nomes de tabelas), o MySQL não lembra o caso usado para nomes de bancos de dados para a função `DATABASE()` ou nos vários logs (em sistemas que não são sensíveis ao caso).

* A eliminação de uma restrição `FOREIGN KEY` não funciona na replicação porque a restrição pode ter outro nome na replica.

* `REPLACE` (e `LOAD DATA` com a opção `REPLACE`) não aciona `ON DELETE CASCADE`.

* `DISTINCT` com `ORDER BY` não funciona dentro de `GROUP_CONCAT()` se você não usar todas e apenas as colunas que estão na lista do `DISTINCT`.

* Ao inserir um valor inteiro grande (entre 263 e 264−1) em uma coluna decimal ou de cadeia, ele é inserido como um valor negativo porque o número é avaliado em contexto de inteiro assinado.

* Com o registro binário baseado em declarações, o servidor fonte escreve as consultas executadas no log binário. Esse é um método de registro muito rápido, compacto e eficiente que funciona perfeitamente na maioria dos casos. No entanto, é possível que os dados do servidor fonte e da replica se tornem diferentes se uma consulta for projetada de tal forma que a modificação dos dados seja não determinística (geralmente não é uma prática recomendada, mesmo fora da replicação).

Por exemplo:

`CREATE TABLE ... SELECT` ou `INSERT ... SELECT` declarações que inserem valores nulos ou `NULL` em uma coluna `AUTO_INCREMENT`.

+ `DELETE` se você estiver excluindo linhas de uma tabela que tem chaves estrangeiras com propriedades `ON DELETE CASCADE`.

+ `REPLACE ... SELECT`, `INSERT IGNORE ... SELECT` se você tiver valores de chave duplicados nos dados inseridos.

**Se e somente se as consultas anteriores não tiverem cláusula `ORDER BY` garantindo uma ordem determinística**.

Por exemplo, para `INSERT ... SELECT` sem `ORDER BY`, o `SELECT` pode retornar linhas em uma ordem diferente (o que resulta em uma linha com diferentes classificações, e, portanto, recebe um número diferente na coluna `AUTO_INCREMENT`), dependendo das escolhas feitas pelos otimizadores na fonte e na replica.

Uma consulta é otimizada de maneira diferente na fonte e na replica apenas se:

+ A tabela é armazenada usando um motor de armazenamento diferente na fonte do que na replica. É possível usar diferentes motores de armazenamento na fonte e na replica. Por exemplo, você pode usar `InnoDB` na fonte, mas `MyISAM` na replica, se a replica tiver menos espaço em disco disponível.

Os tamanhos dos buffers do MySQL (`key_buffer_size`, e assim por diante) são diferentes na fonte e na replica.

+ A fonte e a réplica executam versões diferentes do MySQL, e o código do otimizador difere entre essas versões.

Esse problema também pode afetar a restauração de bancos de dados usando **mysqlbinlog|mysql**.

A maneira mais fácil de evitar esse problema é adicionar uma cláusula `ORDER BY` às consultas não determinísticas mencionadas anteriormente para garantir que as linhas sejam sempre armazenadas ou modificadas na mesma ordem. O uso de formato de registro baseado em linha ou misto também evita o problema.

* Os nomes dos arquivos de registro são baseados no nome do host do servidor, se você não especificar um nome de arquivo com a opção de inicialização. Para manter os mesmos nomes de arquivo de registro se você alterar o nome do seu host para algo mais, você deve usar explicitamente opções como `--log-bin=old_host_name-bin`. Veja a Seção 5.1.6, “Opções de comando do servidor”. Alternativamente, renomeie os arquivos antigos para refletir a mudança do nome do seu host. Se esses forem logs binários, você deve editar o arquivo de índice do log binário e corrigir os nomes dos arquivos de log binário lá também. (O mesmo vale para os logs de releio em uma replica.)

* **mysqlbinlog** não exclui os arquivos temporários deixados após uma declaração `LOAD DATA`. Veja a Seção 4.6.7, “mysqlbinlog — Utilitário para processamento de arquivos de log binário”.

* `RENAME` não funciona com as tabelas `TEMPORARY` ou as tabelas utilizadas em uma tabela `MERGE`.

* Ao usar `SET CHARACTER SET`, você não pode usar caracteres traduzidos em nomes de banco de dados, tabela e coluna.

* Não é possível usar `_` ou `%` com `ESCAPE` em `LIKE ... ESCAPE`.

* O servidor usa apenas os primeiros `max_sort_length` bytes ao comparar os valores dos dados. Isso significa que os valores não podem ser usados de forma confiável em `GROUP BY`, `ORDER BY` ou `DISTINCT` se eles diferirem apenas após os primeiros `max_sort_length` bytes. Para contornar isso, aumente o valor da variável. O valor padrão de `max_sort_length` é 1024 e pode ser alterado no momento da inicialização do servidor ou no runtime.

* Os cálculos numéricos são feitos com `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `DOUBLE` - FLOAT, DOUBLE") (ambos normalmente têm 64 bits de comprimento). A precisão que você obtém depende da função. A regra geral é que as funções de bits são realizadas com `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") precisão, `IF()` e `ELT()` com `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ou `DOUBLE` - FLOAT, DOUBLE") precisão, e o resto com `DOUBLE` - FLOAT, DOUBLE") precisão. Você deve tentar evitar o uso de valores unsigned long long se eles forem maiores que 63 bits (9223372036854775807) para qualquer outra coisa que não seja campos de bits.

* Você pode ter até 255 colunas `ENUM` e `SET` em uma única tabela.

* Em `MIN()`, `MAX()` e outras funções agregadas, o MySQL atualmente compara as colunas `ENUM` e `SET` pelo seu valor de string em vez da posição relativa da string no conjunto.

* Em uma declaração `UPDATE`, as colunas são atualizadas da esquerda para a direita. Se você se referir a uma coluna atualizada, você receberá o valor atualizado em vez do valor original. Por exemplo, a seguinte declaração incrementa `KEY` por `2`, **não** `1`:

  ```sql
  mysql> UPDATE tbl_name SET KEY=KEY+1,KEY=KEY+1;
  ```

* Você pode referenciar várias tabelas temporárias na mesma consulta, mas não pode referenciar nenhuma tabela temporária dada mais de uma vez. Por exemplo, o seguinte não funciona:

  ```sql
  mysql> SELECT * FROM temp_table, temp_table AS t2;
  ERROR 1137: Can't reopen table: 'temp_table'
  ```

* O otimizador pode lidar de forma diferente com `DISTINCT` quando você está usando colunas "ocultas" em uma junção do que quando não está. Em uma junção, as colunas ocultas são contadas como parte do resultado (mesmo que não sejam mostradas), enquanto em consultas normais, as colunas ocultas não participam da comparação `DISTINCT`.

Um exemplo disso é:

  ```sql
  SELECT DISTINCT mp3id FROM band_downloads
         WHERE userid = 9 ORDER BY id DESC;
  ```

e

  ```sql
  SELECT DISTINCT band_downloads.mp3id
         FROM band_downloads,band_mp3
         WHERE band_downloads.userid = 9
         AND band_mp3.id = band_downloads.mp3id
         ORDER BY band_downloads.id DESC;
  ```

No segundo caso, você pode obter duas linhas idênticas no conjunto de resultados (porque os valores na coluna oculta `id` podem diferir).

Observe que isso acontece apenas para consultas que não possuem as colunas `ORDER BY` no resultado.

* Se você executar um `PROCEDURE` em uma consulta que retorna um conjunto vazio, em alguns casos o `PROCEDURE` não transforma as colunas.

* A criação de uma tabela do tipo `MERGE` não verifica se as tabelas subjacentes são tipos compatíveis.

* Se você usar `ALTER TABLE` para adicionar um índice `UNIQUE` a uma tabela usada em uma tabela `MERGE`, e depois adicionar um índice normal na tabela `MERGE`, a ordem da chave é diferente para as tabelas se houvesse uma chave antiga, não `UNIQUE` na tabela. Isso ocorre porque `ALTER TABLE` coloca índices `UNIQUE` antes dos índices normais para poder detectar duplicatas de chaves o mais cedo possível.

* Uma declaração `UPDATE` que envolva uma tabela temporária com uma junção em uma tabela não temporária que tenha um gatilho definido nela pode resultar em um erro, mesmo que a declaração de atualização leia apenas a tabela não temporária, nos seguintes casos:

+ Com o modo de leitura somente (usando `SET GLOBAL``read_only``= 1`).

+ Com o nível de transação definido em `READ_ONLY` (ou seja, usando `SET GLOBAL TRANSACTION READ ONLY` ou `SET SESSION TRANSACTION READ ONLY`).