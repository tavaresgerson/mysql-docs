### 5.7.3 Executando Múltiplas Instâncias MySQL no Unix

Nota

A discussão aqui usa o [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") para iniciar múltiplas instâncias do MySQL. Para instalações MySQL que usam distribuição RPM, a inicialização e o desligamento do servidor são gerenciados pelo systemd em várias plataformas Linux. Nessas plataformas, o [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") não é instalado porque é desnecessário. Para obter informações sobre como usar o systemd para gerenciar múltiplas instâncias MySQL, consulte a [Seção 2.5.10, “Gerenciando o MySQL Server com systemd”](using-systemd.html "2.5.10 Managing MySQL Server with systemd").

Uma maneira de executar múltiplas instâncias MySQL no Unix é compilar servidores diferentes com diferentes portas TCP/IP padrão e Unix socket files, de modo que cada um escute em diferentes interfaces de rede. A compilação em diferentes *base directories* para cada instalação também resulta automaticamente em um *data directory*, *log file* e localização de PID file separados e compilados para cada servidor.

Assuma que um servidor 5.6 existente esteja configurado para o número de porta TCP/IP padrão (3306) e o Unix socket file (`/tmp/mysql.sock`). Para configurar um novo servidor 5.7.44 para ter diferentes parâmetros operacionais, use um comando **CMake** como este:

```sql
$> cmake . -DMYSQL_TCP_PORT=port_number \
             -DMYSQL_UNIX_ADDR=file_name \
             -DCMAKE_INSTALL_PREFIX=/usr/local/mysql-5.7.44
```

Aqui, *`port_number`* e *`file_name`* devem ser diferentes do número da porta TCP/IP padrão e do nome do caminho do Unix socket file, e o valor de [`CMAKE_INSTALL_PREFIX`](source-configuration-options.html#option_cmake_cmake_install_prefix) deve especificar um *installation directory* diferente daquele sob o qual a instalação MySQL existente está localizada.

Se você tem um MySQL server escutando em um determinado número de porta, você pode usar o seguinte comando para descobrir quais parâmetros operacionais ele está utilizando para várias variáveis configuráveis importantes, incluindo o *base directory* e o nome do Unix socket file:

```sql
$> mysqladmin --host=host_name --port=port_number variables
```

Com as informações exibidas por esse comando, você pode saber quais valores de opção *não* usar ao configurar um servidor adicional.

Se você especificar `localhost` como o *host name*, o [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") assume o uso de um Unix socket file em vez de TCP/IP por padrão. Para especificar explicitamente o protocolo de transporte, use a opção [`--protocol={TCP|SOCKET|PIPE|MEMORY}`](connection-options.html#option_general_protocol).

Você não precisa compilar um novo MySQL server apenas para iniciar com um Unix socket file e um número de porta TCP/IP diferentes. Também é possível usar o mesmo binário do servidor e iniciar cada invocação dele com diferentes valores de parâmetro em tempo de execução (*runtime*). Uma maneira de fazer isso é usando opções de linha de comando:

```sql
$> mysqld_safe --socket=file_name --port=port_number
```

Para iniciar um segundo servidor, forneça valores diferentes para as opções [`--socket`](server-options.html#option_mysqld_socket) e [`--port`](server-options.html#option_mysqld_port), e passe uma opção [`--datadir=dir_name`](server-system-variables.html#sysvar_datadir) para o [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") para que o servidor use um *data directory* diferente.

Alternativamente, coloque as opções para cada servidor em um *option file* diferente, e então inicie cada servidor usando uma opção [`--defaults-file`](option-file-options.html#option_general_defaults-file) que especifica o caminho para o *option file* apropriado. Por exemplo, se os *option files* para duas instâncias de servidor forem denominados `/usr/local/mysql/my.cnf` e `/usr/local/mysql/my.cnf2`, inicie os servidores com este comando:

```sql
$> mysqld_safe --defaults-file=/usr/local/mysql/my.cnf
$> mysqld_safe --defaults-file=/usr/local/mysql/my.cnf2
```

Outra maneira de alcançar um efeito semelhante é usar *environment variables* para definir o nome do Unix socket file e o número da porta TCP/IP:

```sql
$> MYSQL_UNIX_PORT=/tmp/mysqld-new.sock
$> MYSQL_TCP_PORT=3307
$> export MYSQL_UNIX_PORT MYSQL_TCP_PORT
$> mysqld --initialize --user=mysql
...set root password...
$> mysqld_safe --datadir=/path/to/datadir &
```

Esta é uma maneira rápida de iniciar um segundo servidor para usar em testes. O aspecto positivo desse método é que as configurações das *environment variables* se aplicam a quaisquer *client programs* que você invoque a partir do mesmo *shell*. Assim, as conexões para esses *clients* são automaticamente direcionadas para o segundo servidor.

A [Seção 4.9, “Environment Variables”](environment-variables.html "4.9 Environment Variables"), inclui uma lista de outras *environment variables* que você pode usar para afetar os programas MySQL.

No Unix, o script [**mysqld_multi**](mysqld-multi.html "4.3.4 mysqld_multi — Manage Multiple MySQL Servers") oferece outra maneira de iniciar múltiplos servidores. Consulte a [Seção 4.3.4, “mysqld_multi — Manage Multiple MySQL Servers”](mysqld-multi.html "4.3.4 mysqld_multi — Manage Multiple MySQL Servers").