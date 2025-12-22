### 7.8.3 Executar várias instâncias do MySQL no Unix

::: info Note

A discussão aqui usa **mysqld\_safe** para iniciar várias instâncias do MySQL. Para a instalação do MySQL usando uma distribuição RPM, a inicialização e o desligamento do servidor são gerenciados pelo systemd em várias plataformas Linux. Nessas plataformas, **mysqld\_safe** não é instalado porque é desnecessário. Para informações sobre o uso do systemd para lidar com várias instâncias do MySQL, consulte a Seção 2.5.9, Gerenciando o MySQL Server com o systemd.

:::

Uma maneira de executar várias instâncias do MySQL no Unix é compilar diferentes servidores com diferentes portas TCP / IP padrão e arquivos de soquete Unix para que cada um escute em diferentes interfaces de rede.

Suponha que um servidor 8.3 existente esteja configurado para o número de porta TCP/IP padrão (3306) e o arquivo de soquete do Unix (`/tmp/mysql.sock`). Para configurar um novo servidor 8.4.6 para ter diferentes parâmetros operacionais, use um comando **CMake** algo como este:

```
$> cmake . -DMYSQL_TCP_PORT=port_number \
             -DMYSQL_UNIX_ADDR=file_name \
             -DCMAKE_INSTALL_PREFIX=/usr/local/mysql-8.4.6
```

Aqui, `port_number` e `file_name` devem ser diferentes do número de porta TCP/IP padrão e do nome do caminho do arquivo do soquete Unix, e o valor `CMAKE_INSTALL_PREFIX` deve especificar um diretório de instalação diferente do diretório sob o qual a instalação existente do MySQL está localizada.

Se você tem um servidor MySQL ouvindo em um determinado número de porta, você pode usar o seguinte comando para descobrir quais parâmetros operacionais ele está usando para várias variáveis configuráveis importantes, incluindo o diretório base e o nome do arquivo do soquete Unix:

```
$> mysqladmin --host=host_name --port=port_number variables
```

Com as informações exibidas por esse comando, você pode dizer quais valores de opção \* não \* usar ao configurar um servidor adicional.

Se você especificar `localhost` como o nome do host, `mysqladmin` por padrão usa um arquivo de soquete Unix em vez de TCP/IP. Para especificar explicitamente o protocolo de transporte, use a opção `--protocol={TCP|SOCKET|PIPE|MEMORY}`.

Você não precisa compilar um novo servidor MySQL apenas para começar com um arquivo de soquete Unix diferente e número de porta TCP/IP. Também é possível usar o mesmo servidor binário e iniciar cada invocação dele com valores de parâmetros diferentes no tempo de execução. Uma maneira de fazê-lo é usando as opções da linha de comando:

```
$> mysqld_safe --socket=file_name --port=port_number
```

Para iniciar um segundo servidor, forneça diferentes valores de opção `--socket` e `--port`, e passe uma opção `--datadir=dir_name` para **mysqld\_safe** para que o servidor use um diretório de dados diferente.

Alternativamente, coloque as opções para cada servidor em um arquivo de opções diferente, e então inicie cada servidor usando uma opção `--defaults-file` que especifique o caminho para o arquivo de opções apropriado. Por exemplo, se os arquivos de opções para duas instâncias de servidor são nomeados `/usr/local/mysql/my.cnf` e `/usr/local/mysql/my.cnf2`, inicie os servidores assim: comando:

```
$> mysqld_safe --defaults-file=/usr/local/mysql/my.cnf
$> mysqld_safe --defaults-file=/usr/local/mysql/my.cnf2
```

Outra maneira de alcançar um efeito semelhante é usar variáveis de ambiente para definir o nome do arquivo do socket do Unix e o número da porta TCP / IP:

```
$> MYSQL_UNIX_PORT=/tmp/mysqld-new.sock
$> MYSQL_TCP_PORT=3307
$> export MYSQL_UNIX_PORT MYSQL_TCP_PORT
$> bin/mysqld --initialize --user=mysql
$> mysqld_safe --datadir=/path/to/datadir &
```

Esta é uma maneira rápida de iniciar um segundo servidor para usar para testes. A coisa legal sobre este método é que as configurações de variáveis de ambiente se aplicam a qualquer programa cliente que você invoca a partir do mesmo shell. Assim, as conexões para esses clientes são direcionadas automaticamente para o segundo servidor.

A seção 6.9, "Variaveis de ambiente", inclui uma lista de outras variáveis de ambiente que você pode usar para afetar programas MySQL.

No Unix, o script **mysqld\_multi** fornece outra maneira de iniciar vários servidores.
