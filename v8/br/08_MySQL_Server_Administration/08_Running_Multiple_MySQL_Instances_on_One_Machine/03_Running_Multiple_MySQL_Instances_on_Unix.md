### 7.8.3 Executando múltiplas instâncias do MySQL no Unix

Nota

A discussão aqui usa **mysqld\_safe** para iniciar várias instâncias do MySQL. Para a instalação do MySQL usando uma distribuição RPM, o início e o desligamento do servidor são gerenciados pelo systemd em várias plataformas Linux. Nessas plataformas, **mysqld\_safe** não é instalado porque é desnecessário. Para obter informações sobre como usar o systemd para gerenciar várias instâncias do MySQL, consulte a Seção 2.5.9, “Gerenciando o servidor MySQL com o systemd”.

Uma maneira de executar várias instâncias do MySQL no Unix é compilar diferentes servidores com portas TCP/IP padrão diferentes e arquivos de soquete Unix, para que cada um ouça em diferentes interfaces de rede. A compilação em diretórios de base diferentes para cada instalação também resulta automaticamente em um diretório de dados separado, um arquivo de log e um arquivo de PID separados para cada servidor.

Suponha que um servidor existente de 5.7 esteja configurado com o número de porta TCP/IP padrão (3306) e o arquivo de soquete Unix (`/tmp/mysql.sock`). Para configurar um novo servidor de 8.0.44 com parâmetros de operação diferentes, use um comando **CMake** como este:

```
$> cmake . -DMYSQL_TCP_PORT=port_number \
             -DMYSQL_UNIX_ADDR=file_name \
             -DCMAKE_INSTALL_PREFIX=/usr/local/mysql-8.0.44
```

Aqui, `port_number` e `file_name` devem ser diferentes do número de porta TCP/IP padrão e do nome do caminho de arquivo de soquete Unix, e o valor `CMAKE_INSTALL_PREFIX` deve especificar um diretório de instalação diferente daquele em que a instalação existente do MySQL está localizada.

Se você tem um servidor MySQL ouvindo em um número de porta específico, você pode usar o seguinte comando para descobrir quais parâmetros de operação ele está usando para várias variáveis configuráveis importantes, incluindo o diretório base e o nome do arquivo de soquete Unix:

```
$> mysqladmin --host=host_name --port=port_number variables
```

Com as informações exibidas por esse comando, você pode determinar quais valores de opção *não* devem ser usados ao configurar um servidor adicional.

Se você especificar `localhost` como o nome do host, o **mysqladmin** usa, por padrão, um arquivo de socket Unix em vez de TCP/IP. Para especificar explicitamente o protocolo de transporte, use a opção `--protocol={TCP|SOCKET|PIPE|MEMORY}`.

Você não precisa compilar um novo servidor MySQL apenas para começar com um arquivo de socket Unix diferente e um número de porta TCP/IP. Também é possível usar o mesmo binário do servidor e iniciar cada chamada dele com diferentes valores de parâmetros em tempo de execução. Uma maneira de fazer isso é usando opções de linha de comando:

```
$> mysqld_safe --socket=file_name --port=port_number
```

Para iniciar um segundo servidor, forneça diferentes valores de opções `--socket` e `--port` e passe uma opção `--datadir=dir_name` para o **mysqld\_safe** para que o servidor use um diretório de dados diferente.

Alternativamente, coloque as opções de cada servidor em um arquivo de opção diferente, e então inicie cada servidor usando uma opção `--defaults-file` que especifica o caminho para o arquivo de opção apropriado. Por exemplo, se os arquivos de opção para duas instâncias de servidor forem chamados de `/usr/local/mysql/my.cnf` e `/usr/local/mysql/my.cnf2`, inicie os servidores da seguinte forma: comando:

```
$> mysqld_safe --defaults-file=/usr/local/mysql/my.cnf
$> mysqld_safe --defaults-file=/usr/local/mysql/my.cnf2
```

Outra maneira de obter um efeito semelhante é usar variáveis de ambiente para definir o nome do arquivo de socket Unix e o número da porta TCP/IP:

```
$> MYSQL_UNIX_PORT=/tmp/mysqld-new.sock
$> MYSQL_TCP_PORT=3307
$> export MYSQL_UNIX_PORT MYSQL_TCP_PORT
$> bin/mysqld --initialize --user=mysql
$> mysqld_safe --datadir=/path/to/datadir &
```

Esta é uma maneira rápida de iniciar um segundo servidor para uso em testes. A vantagem deste método é que as configurações da variável de ambiente se aplicam a quaisquer programas cliente que você invocar a partir do mesmo shell. Assim, as conexões para esses clientes são direcionadas automaticamente para o segundo servidor.

A seção 6.9, “Variáveis de ambiente”, inclui uma lista de outras variáveis de ambiente que você pode usar para afetar os programas do MySQL.

No Unix, o script **mysqld\_multi** oferece outra maneira de iniciar vários servidores. Veja a Seção 6.3.4, “mysqld\_multi — Gerenciar vários servidores MySQL”.
