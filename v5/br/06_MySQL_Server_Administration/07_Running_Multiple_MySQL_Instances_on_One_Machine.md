## 5.7 Executando múltiplas instâncias do MySQL em uma máquina

Em alguns casos, você pode querer executar várias instâncias do MySQL em uma única máquina. Você pode querer testar uma nova versão do MySQL enquanto deixa uma configuração de produção existente sem perturbar. Ou você pode querer dar a diferentes usuários acesso a diferentes servidores `mysqld` que eles gerenciam por conta própria. (Por exemplo, você pode ser um provedor de serviços de Internet que deseja fornecer instalações independentes do MySQL para diferentes clientes.)

É possível usar um binário de servidor MySQL diferente por instância, ou usar o mesmo binário para múltiplas instâncias, ou qualquer combinação das duas abordagens. Por exemplo, você pode executar um servidor do MySQL 5.6 e outro do MySQL 5.7, para ver como diferentes versões lidam com uma carga de trabalho específica. Ou você pode executar múltiplas instâncias da versão atual de produção, cada uma gerenciando um conjunto diferente de bancos de dados.

Se você usa ou não binários de servidor distintos, cada instância que você executa deve ser configurada com valores únicos para vários parâmetros de operação. Isso elimina o potencial de conflito entre as instâncias. Os parâmetros podem ser definidos na string de comando, em arquivos de opção ou definindo variáveis de ambiente. Veja a Seção 4.2.2, “Especificando Opções de Programa”. Para ver os valores usados por uma instância específica, conecte-se a ela e execute uma declaração `SHOW VARIABLES`.

O recurso principal gerenciado por uma instância MySQL é o diretório de dados. Cada instância deve usar um diretório de dados diferente, cujo local é especificado usando a opção `--datadir=dir_name`. Para métodos de configuração de cada instância com seu próprio diretório de dados, e avisos sobre os perigos de não fazer isso, consulte a Seção 5.7.1, “Configurando Múltiplos Diretórios de Dados”.

Além de usar diferentes diretórios de dados, várias outras opções devem ter valores diferentes para cada instância do servidor:

* `--port=port_num`

`--port` controla o número de porta para conexões TCP/IP. Alternativamente, se o host tiver múltiplos endereços de rede, você pode definir a variável de sistema `bind_address` para fazer com que cada servidor ouça um endereço diferente.

* `--socket={file_name|pipe_name}`

`--socket` controla o caminho do arquivo de socket Unix em Unix ou o nome da mangueira em nomeados em Windows. Em Windows, é necessário especificar nomes de mangueira distintos apenas para aqueles servidores configurados para permitir conexões em mangueiras nomeadas.

* `--shared-memory-base-name=name`

Esta opção é usada apenas no Windows. Ela designa o nome de memória compartilhada usado por um servidor do Windows para permitir que os clientes se conectem usando memória compartilhada. É necessário especificar nomes de memória compartilhada distintos apenas para os servidores configurados para permitir conexões de memória compartilhada.

* `--pid-file=file_name`

Esta opção indica o nome do caminho do arquivo no qual o servidor escreve seu ID de processo.

Se você usar as seguintes opções de arquivo de registro, seus valores devem ser diferentes para cada servidor:

* `--general_log_file=file_name`
* `--log-bin[=file_name]`
* `--slow_query_log_file=file_name`
* `--log-error[=file_name]`

Para mais informações sobre as opções dos arquivos de registro, consulte a Seção 5.4, “Logs do servidor MySQL”.

Para obter um melhor desempenho, você pode especificar a opção a seguir de forma diferente para cada servidor, para espalhar a carga entre vários discos físicos:

* `--tmpdir=dir_name`

Ter diretórios temporários diferentes também facilita a determinação de qual servidor MySQL criou um determinado arquivo temporário.

Se você tem várias instalações do MySQL em diferentes locais, pode especificar o diretório base para cada instalação com a opção `--basedir=dir_name`. Isso faz com que cada instância use automaticamente um diretório de dados, arquivos de registro e arquivo PID diferentes, porque o padrão para cada um desses parâmetros é relativo ao diretório base. Nesse caso, as únicas outras opções que você precisa especificar são as opções `--socket` e `--port`. Suponha que você instale diferentes versões do MySQL usando distribuições binárias de arquivo `tar`. Essas são instaladas em diferentes locais, então você pode iniciar o servidor para cada instalação usando o comando **bin/`mysqld_safe`** sob seu diretório base correspondente. `mysqld_safe` determina a opção adequada `--basedir` a ser passada para `mysqld`, e você precisa especificar apenas as opções `--socket` e `--port` para `mysqld_safe`.

Como discutido nas seções a seguir, é possível iniciar servidores adicionais especificando opções de comando apropriadas ou definindo variáveis de ambiente. No entanto, se você precisar executar vários servidores de forma mais permanente, é mais conveniente usar arquivos de opção para especificar para cada servidor os valores dessas opções que devem ser exclusivos para ele. A opção `--defaults-file` é útil para esse propósito.

### 5.7.1 Configurando diretórios de dados múltiplos

Cada instância do MySQL em uma máquina deve ter seu próprio diretório de dados. A localização é especificada usando a opção `--datadir=dir_name`.

Existem diferentes métodos para configurar um diretório de dados para uma nova instância:

* Crie um novo diretório de dados. * Copie um diretório de dados existente.

A discussão a seguir fornece mais detalhes sobre cada método.

Aviso

Normalmente, você nunca deve ter dois servidores que atualizam dados nos mesmos bancos de dados. Isso pode levar a surpresas desagradáveis se o seu sistema operacional não suportar bloqueio de sistema livre de falhas. Se (a despeito deste aviso) você executar vários servidores usando o mesmo diretório de dados e eles tiverem registro habilitado, você deve usar as opções apropriadas para especificar nomes de arquivos de registro que são exclusivos para cada servidor. Caso contrário, os servidores tentam registrar em os mesmos arquivos.

Mesmo quando as precauções anteriores são observadas, esse tipo de configuração funciona apenas com as tabelas `MyISAM` e `MERGE`, e não com nenhuma das outras engines de armazenamento. Além disso, esse aviso contra a compartilhamento de um diretório de dados entre servidores sempre se aplica em um ambiente NFS. Permitir que vários servidores MySQL acessem um diretório de dados comum através do NFS é uma *ideia muito ruim*. O principal problema é que o NFS é o gargalo de velocidade. Não é destinado a tal uso. Outro risco com o NFS é que você deve elaborar uma maneira de garantir que dois ou mais servidores não interfiram uns com os outros. Geralmente, o bloqueio de arquivos NFS é gerenciado pelo daemon `lockd`, mas, no momento, não há uma plataforma que realize o bloqueio de forma 100% confiável em todas as situações.

#### Crie um novo diretório de dados

Com esse método, o diretório de dados está no mesmo estado em que você instalou o MySQL pela primeira vez. Ele possui o conjunto padrão de contas do MySQL e nenhum dado do usuário.

Em Unix, inicialize o diretório de dados. Veja a Seção 2.9, “Configuração e teste pós-instalação”.

Em Windows, o diretório de dados está incluído na distribuição do MySQL:

* As distribuições de arquivos Zip do MySQL para Windows contêm um diretório de dados não modificado. Você pode desempacotar uma dessas distribuições em um local temporário e, em seguida, copiá-la para o diretório `data` onde você está configurando a nova instância.

* Os instaladores de pacotes MSI do Windows criam e configuram o diretório de dados que o servidor instalado utiliza, mas também criam um diretório de dados "template" puro chamado `data` sob o diretório de instalação. Após uma instalação ter sido realizada usando um pacote MSI, o diretório de dados do modelo pode ser copiado para configurar instâncias adicionais do MySQL.

#### Copiar um diretório de dados existente

Com esse método, todas as contas do MySQL ou dados do usuário presentes no diretório de dados são transferidos para o novo diretório de dados.

1. Parar a instância MySQL existente usando o diretório de dados. Isso deve ser um desligamento limpo para que a instância limpe quaisquer alterações pendentes no disco.

2. Copie o diretório de dados para o local onde o novo diretório de dados deve ser.

3. Copie o arquivo de opção `my.cnf` ou `my.ini` usado pela instância existente. Isso serve como base para a nova instância.

4. Modifique o novo arquivo de opções para que quaisquer caminhos que se refiram ao diretório de dados original se refiram ao novo diretório de dados. Além disso, modifique quaisquer outras opções que devam ser únicas por instância, como o número da porta TCP/IP e os arquivos de registro. Para uma lista de parâmetros que devem ser únicos por instância, consulte a Seção 5.7, “Executando várias instâncias do MySQL em uma máquina”.

5. Inicie a nova instância, dizendo-lhe que deve usar o novo arquivo de opção.

### 5.7.2 Executando múltiplas instâncias do MySQL no Windows

Você pode executar vários servidores no Windows iniciando-os manualmente a partir da string de comando, cada um com os parâmetros operacionais apropriados, ou instalando vários servidores como serviços do Windows e executando-os dessa maneira. As instruções gerais para executar o MySQL a partir da string de comando ou como um serviço são fornecidas na Seção 2.3, “Instalando MySQL no Microsoft Windows”. As seções seguintes descrevem como iniciar cada servidor com diferentes valores para as opções que devem ser únicas por servidor, como o diretório de dados. Essas opções estão listadas na Seção 5.7, “Executando Múltiplas Instâncias do MySQL em uma Máquina”.

#### 5.7.2.1 Iniciar múltiplas instâncias do MySQL na string de comando do Windows

O procedimento para iniciar um único servidor MySQL manualmente a partir da string de comando é descrito na Seção 2.3.4.6, “Iniciando o MySQL a partir da string de comando do Windows”. Para iniciar vários servidores dessa maneira, você pode especificar as opções apropriadas na string de comando ou em um arquivo de opções. É mais conveniente colocar as opções em um arquivo de opções, mas é necessário garantir que cada servidor receba seu próprio conjunto de opções. Para fazer isso, crie um arquivo de opções para cada servidor e diga ao servidor o nome do arquivo com uma opção `--defaults-file` quando você executá-lo.

Suponha que você queira executar uma instância do `mysqld` na porta 3307 com um diretório de dados do `C:\mydata1`, e outra instância na porta 3308 com um diretório de dados do `C:\mydata2`. Use este procedimento:

1. Certifique-se de que cada diretório de dados exista, incluindo sua própria cópia do banco de dados `mysql` que contém as tabelas de concessão.

2. Crie dois arquivos de opção. Por exemplo, crie um arquivo chamado `C:\my-opts1.cnf` que tenha a seguinte aparência:

   ```sql
   [mysqld]
   datadir = C:/mydata1
   port = 3307
   ```

Crie um segundo arquivo com o nome `C:\my-opts2.cnf` que se parece com este:

   ```sql
   [mysqld]
   datadir = C:/mydata2
   port = 3308
   ```

3. Use a opção `--defaults-file` para iniciar cada servidor com seu próprio arquivo de opção:

   ```sql
   C:\> C:\mysql\bin\mysqld --defaults-file=C:\my-opts1.cnf
   C:\> C:\mysql\bin\mysqld --defaults-file=C:\my-opts2.cnf
   ```

Cada servidor começa no plano de fundo (não aparece mais nenhum prompt até que o servidor saia mais tarde), então você deve emitir esses dois comandos em janelas de console separadas.

Para desligar os servidores, conecte-se a cada um deles usando o número de porta apropriado:

```sql
C:\> C:\mysql\bin\mysqladmin --port=3307 --host=127.0.0.1 --user=root --password shutdown
C:\> C:\mysql\bin\mysqladmin --port=3308 --host=127.0.0.1 --user=root --password shutdown
```

Os servidores configurados conforme descrito permitem que os clientes se conectem via TCP/IP. Se sua versão do Windows suporta pipes nomeados e você também deseja permitir conexões por pipes nomeados, especifique opções que habilitem o pipe nomeado e especifique seu nome. Cada servidor que suporte conexões por pipes nomeados deve usar um nome de pipe exclusivo. Por exemplo, o arquivo `C:\my-opts1.cnf` pode ser escrito da seguinte forma:

```sql
[mysqld]
datadir = C:/mydata1
port = 3307
enable-named-pipe
socket = mypipe1
```

Modifique `C:\my-opts2.cnf` de forma semelhante para uso pelo segundo servidor. Em seguida, inicie os servidores conforme descrito anteriormente.

Um procedimento semelhante se aplica para servidores que você deseja permitir conexões de memória compartilhada. Ative essas conexões iniciando o servidor com a variável de sistema `shared_memory` habilitada e especifique um nome único de memória compartilhada para cada servidor, definindo a variável de sistema `shared_memory_base_name`.

#### 5.7.2.2 Iniciar múltiplas instâncias do MySQL como serviços do Windows

Em Windows, um servidor MySQL pode ser executado como um serviço do Windows. Os procedimentos para instalar, controlar e remover um único serviço MySQL são descritos na Seção 2.3.4.8, “Iniciar o MySQL como um serviço do Windows”.

Para configurar vários serviços MySQL, você deve garantir que cada instância utilize um nome de serviço diferente, além dos outros parâmetros que devem ser únicos por instância.

Para as instruções a seguir, suponha que você queira executar o servidor `mysqld` a partir de duas versões diferentes do MySQL que estão instaladas em `C:\mysql-5.7.9` e `C:\mysql-5.7.44`, respectivamente. (Isso pode ser o caso se você estiver executando 5.7.9 como seu servidor de produção, mas também queira realizar testes usando 5.7.44.)

Para instalar o MySQL como um serviço do Windows, use a opção `--install` ou `--install-manual`. Para obter informações sobre essas opções, consulte a Seção 2.3.4.8, “Iniciar o MySQL como um serviço do Windows”.

Com base nas informações anteriores, você tem várias maneiras de configurar vários serviços. As instruções a seguir descrevem alguns exemplos. Antes de tentar qualquer um deles, desligue e remova quaisquer serviços MySQL existentes.

* **Abordagem 1:** Especifique as opções para todos os serviços em um dos arquivos de opção padrão. Para fazer isso, use um nome de serviço diferente para cada servidor. Suponha que você queira executar o `mysqld` 5.7.9 usando o nome de serviço de `mysqld1` e o `mysqld` 5.7.44 usando o nome de serviço `mysqld2`. Neste caso, você pode usar o grupo `[mysqld1]` para 5.7.9 e o grupo `[mysqld2]` para 5.7.44. Por exemplo, você pode configurar `C:\my.cnf` da seguinte forma:

  ```sql
  # options for mysqld1 service
  [mysqld1]
  basedir = C:/mysql-5.7.9
  port = 3307
  enable-named-pipe
  socket = mypipe1

  # options for mysqld2 service
  [mysqld2]
  basedir = C:/mysql-5.7.44
  port = 3308
  enable-named-pipe
  socket = mypipe2
  ```

Instale os serviços da seguinte forma, usando os nomes completos dos caminhos do servidor para garantir que o Windows registre o programa executável correto para cada serviço:

  ```sql
  C:\> C:\mysql-5.7.9\bin\mysqld --install mysqld1
  C:\> C:\mysql-5.7.44\bin\mysqld --install mysqld2
  ```

Para iniciar os serviços, use o gerenciador de serviços, ou **NET START** ou **SC START** com os nomes de serviço apropriados:

  ```sql
  C:\> SC START mysqld1
  C:\> SC START mysqld2
  ```

Para interromper os serviços, use o gerenciador de serviços, ou use **NET STOP** ou **SC STOP** com os nomes de serviço apropriados:

  ```sql
  C:\> SC STOP mysqld1
  C:\> SC STOP mysqld2
  ```

* **Abordagem 2:** Especifique as opções para cada servidor em arquivos separados e use `--defaults-file` ao instalar os serviços para indicar a cada servidor qual arquivo usar. Neste caso, cada arquivo deve listar as opções usando um grupo `[mysqld]`.

Com essa abordagem, para especificar opções para o 5.7.9 `mysqld`, crie um arquivo `C:\my-opts1.cnf` que tenha a seguinte aparência:

  ```sql
  [mysqld]
  basedir = C:/mysql-5.7.9
  port = 3307
  enable-named-pipe
  socket = mypipe1
  ```

Para o 5.7.44 `mysqld`, crie um arquivo `C:\my-opts2.cnf` que tenha a seguinte aparência:

  ```sql
  [mysqld]
  basedir = C:/mysql-5.7.44
  port = 3308
  enable-named-pipe
  socket = mypipe2
  ```

Instale os serviços da seguinte forma (entre cada comando em uma única string):

  ```sql
  C:\> C:\mysql-5.7.9\bin\mysqld --install mysqld1
             --defaults-file=C:\my-opts1.cnf
  C:\> C:\mysql-5.7.44\bin\mysqld --install mysqld2
             --defaults-file=C:\my-opts2.cnf
  ```

Quando você instala um servidor MySQL como um serviço e usa uma opção `--defaults-file`, o nome do serviço deve preceder a opção.

Após instalar os serviços, inicie e pare-os da mesma maneira que no exemplo anterior.

Para remover vários serviços, use **SC DELETE *`mysqld_service_name`*** para cada um. Alternativamente, use **mysqld --remove** para cada um, especificando um nome de serviço seguindo a opção `--remove`. Se o nome do serviço for o padrão (`MySQL`), você pode omitir isso ao usar **mysqld --remove**.

### 5.7.3 Executando múltiplas instâncias do MySQL no Unix

Nota

A discussão aqui usa `mysqld_safe` para iniciar várias instâncias do MySQL. Para a instalação do MySQL usando uma distribuição RPM, o início e o desligamento do servidor são gerenciados pelo systemd em várias plataformas Linux. Nessas plataformas, `mysqld_safe` não é instalado porque é desnecessário. Para informações sobre o uso do systemd para lidar com várias instâncias do MySQL, consulte a Seção 2.5.10, “Gerenciando o servidor MySQL com o systemd”.

Uma maneira de executar várias instâncias do MySQL no Unix é compilar diferentes servidores com diferentes portas TCP/IP padrão e arquivos de soquete Unix, para que cada um ouça em diferentes interfaces de rede. Compilar em diretórios de base diferentes para cada instalação também resulta automaticamente em um diretório de dados separado, um arquivo de log e um local de arquivo PID para cada servidor.

Suponha que um servidor existente de 5.6 esteja configurado para o número de porta TCP/IP padrão (3306) e arquivo de soquete Unix (`/tmp/mysql.sock`). Para configurar um novo servidor de 5.7.44 com parâmetros operacionais diferentes, use um comando **CMake** como este:

```sql
$> cmake . -DMYSQL_TCP_PORT=port_number \
             -DMYSQL_UNIX_ADDR=file_name \
             -DCMAKE_INSTALL_PREFIX=/usr/local/mysql-5.7.44
```

Aqui, *`port_number`* e *`file_name`* devem ser diferentes do número padrão de porta TCP/IP e do nome do caminho de arquivo de soquete Unix, e o valor `CMAKE_INSTALL_PREFIX` deve especificar um diretório de instalação diferente daquele em que a instalação existente do MySQL está localizada.

Se você tem um servidor MySQL ouvindo em um número de porta específico, pode usar o seguinte comando para descobrir quais parâmetros operacionais está usando para várias variáveis configuráveis importantes, incluindo o diretório base e o nome do arquivo de soquete Unix:

```sql
$> mysqladmin --host=host_name --port=port_number variables
```

Com as informações exibidas por esse comando, você pode dizer quais valores de opção *não* devem ser usados ao configurar um servidor adicional.

Se você especificar `localhost` como o nome do host, o **mysqladmin** por padrão usa um arquivo de socket Unix em vez de TCP/IP. Para especificar explicitamente o protocolo de transporte, use a opção `--protocol={TCP|SOCKET|PIPE|MEMORY}`.

Você não precisa compilar um novo servidor MySQL apenas para começar com um arquivo de socket Unix diferente e um número de porta TCP/IP. Também é possível usar o mesmo binário do servidor e iniciar cada invocação dele com diferentes valores de parâmetros no runtime. Uma maneira de fazer isso é usando opções de string de comando:

```sql
$> mysqld_safe --socket=file_name --port=port_number
```

Para iniciar um segundo servidor, forneça diferentes valores de opções de `--socket` e `--port`, e passe uma opção de `--datadir=dir_name` para `mysqld_safe` para que o servidor use um diretório de dados diferente.

Como alternativa, coloque as opções de cada servidor em um arquivo de opção diferente, e, em seguida, inicie cada servidor usando uma opção `--defaults-file` que especifica o caminho para o arquivo de opção apropriado. Por exemplo, se os arquivos de opção para duas instâncias de servidor são nomeados `/usr/local/mysql/my.cnf` e `/usr/local/mysql/my.cnf2`, inicie os servidores da seguinte forma: comando:

```sql
$> mysqld_safe --defaults-file=/usr/local/mysql/my.cnf
$> mysqld_safe --defaults-file=/usr/local/mysql/my.cnf2
```

Outra maneira de obter um efeito semelhante é usar variáveis de ambiente para definir o nome do arquivo do socket Unix e o número da porta TCP/IP:

```sql
$> MYSQL_UNIX_PORT=/tmp/mysqld-new.sock
$> MYSQL_TCP_PORT=3307
$> export MYSQL_UNIX_PORT MYSQL_TCP_PORT
$> mysqld --initialize --user=mysql
...set root password...
$> mysqld_safe --datadir=/path/to/datadir &
```

Esta é uma maneira rápida de iniciar um segundo servidor para uso de teste. A boa coisa sobre esse método é que as configurações das variáveis de ambiente se aplicam a quaisquer programas de cliente que você invoque a partir do mesmo shell. Assim, as conexões para esses clientes são direcionadas automaticamente para o segundo servidor.

A Seção 4.9, “Variáveis de ambiente”, inclui uma lista de outras variáveis de ambiente que você pode usar para afetar os programas do MySQL.

Em Unix, o script `mysqld_multi` oferece outra maneira de iniciar vários servidores. Veja a Seção 4.3.4, “mysqld_multi — Gerenciar vários servidores MySQL”.

### 5.7.4 Uso de programas do cliente em um ambiente com múltiplos servidores

Para se conectar a um programa de cliente a um servidor MySQL que está ouvindo diferentes interfaces de rede das que foram compiladas no seu cliente, você pode usar um dos seguintes métodos:

* Inicie o cliente com `--host=host_name` `--port=port_number` para se conectar usando TCP/IP a um servidor remoto, com `--host=127.0.0.1` `--port=port_number` para se conectar usando TCP/IP a um servidor local, ou com `--host=localhost` `--socket=file_name` para se conectar a um servidor local usando um arquivo de socket Unix ou uma tubulação nomeada do Windows.

* Inicie o cliente com `--protocol=TCP` para se conectar usando TCP/IP, `--protocol=SOCKET` para se conectar usando um arquivo de socket Unix, `--protocol=PIPE` para se conectar usando um pipe nomeado, ou `--protocol=MEMORY` para se conectar usando memória compartilhada. Para conexões TCP/IP, você também pode precisar especificar as opções `--host` e `--port`. Para os outros tipos de conexões, você pode precisar especificar uma opção `--socket` para especificar um arquivo de socket Unix ou nome de pipe nomeado do Windows, ou uma opção `--shared-memory-base-name` para especificar o nome da memória compartilhada. As conexões de memória compartilhada são suportadas apenas no Windows.

* Em Unix, configure as variáveis de ambiente `MYSQL_UNIX_PORT` e `MYSQL_TCP_PORT` para apontar para o arquivo de socket Unix e o número da porta TCP/IP antes de iniciar seus clientes. Se você normalmente usa um arquivo de socket específico ou um número de porta, pode colocar comandos para definir essas variáveis de ambiente em seu arquivo `.login` para que elas sejam aplicadas cada vez que você faz login. Veja a Seção 4.9, “Variáveis de Ambiente”.

* Especifique o arquivo de socket Unix padrão e o número da porta TCP/IP no grupo `[client]` de um arquivo de opções. Por exemplo, você pode usar `C:\my.cnf` no Windows, ou o arquivo `.my.cnf` no diretório doméstico no Unix. Veja a Seção 4.2.2.2, “Usando Arquivos de Opções”.

* Em um programa em C, você pode especificar os argumentos de arquivo de soquete ou número de porta na chamada `mysql_real_connect()`. Você também pode fazer o programa ler arquivos de opção chamando `mysql_options()`. Veja as descrições básicas das funções da API C.

* Se você estiver usando o módulo `DBD::mysql` do Perl, você pode ler opções de arquivos de opção do MySQL. Por exemplo:

  ```sql
  $dsn = "DBI:mysql:test;mysql_read_default_group=client;"
          . "mysql_read_default_file=/usr/local/mysql/data/my.cnf";
  $dbh = DBI->connect($dsn, $user, $password);
  ```

Veja a Seção 27.9, “MySQL Perl API”.

Outras interfaces de programação podem oferecer capacidades semelhantes para leitura de arquivos de opção.

