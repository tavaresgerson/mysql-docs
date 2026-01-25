### 5.7.4 Usando Programas Client em um Ambiente de Múltiplos Servidores

Para se conectar com um programa client a um servidor MySQL que está ouvindo em interfaces de rede diferentes daquelas compiladas no seu client, você pode usar um dos seguintes métodos:

* Inicie o client com [`--host=host_name`](connection-options.html#option_general_host) [`--port=port_number`](connection-options.html#option_general_port) para se conectar usando TCP/IP a um servidor remoto, com [`--host=127.0.0.1`](connection-options.html#option_general_host) [`--port=port_number`](connection-options.html#option_general_port) para se conectar usando TCP/IP a um servidor local, ou com [`--host=localhost`](connection-options.html#option_general_host) [`--socket=file_name`](connection-options.html#option_general_socket) para se conectar a um servidor local usando um arquivo socket Unix ou um named pipe do Windows.

* Inicie o client com [`--protocol=TCP`](connection-options.html#option_general_protocol) para se conectar usando TCP/IP, [`--protocol=SOCKET`](connection-options.html#option_general_protocol) para se conectar usando um arquivo socket Unix, [`--protocol=PIPE`](connection-options.html#option_general_protocol) para se conectar usando um named pipe, ou [`--protocol=MEMORY`](connection-options.html#option_general_protocol) para se conectar usando shared memory. Para conexões TCP/IP, você também pode precisar especificar as opções [`--host`](connection-options.html#option_general_host) e [`--port`](connection-options.html#option_general_port). Para os outros tipos de conexões, você pode precisar especificar uma opção [`--socket`](connection-options.html#option_general_socket) para definir um arquivo socket Unix ou um nome de named pipe do Windows, ou uma opção [`--shared-memory-base-name`](connection-options.html#option_general_shared-memory-base-name) para especificar o nome da shared memory. Conexões via shared memory são suportadas apenas no Windows.

* No Unix, defina as variáveis de ambiente `MYSQL_UNIX_PORT` e `MYSQL_TCP_PORT` para apontar para o arquivo socket Unix e o número da port TCP/IP antes de iniciar seus clients. Se você usa normalmente um arquivo socket ou número de port específico, você pode colocar comandos para definir essas variáveis de ambiente no seu arquivo `.login` para que elas se apliquem toda vez que você fizer Login. Veja [Seção 4.9, “Environment Variables”](environment-variables.html "4.9 Environment Variables").

* Especifique o arquivo socket Unix e o número da port TCP/IP padrão no grupo `[client]` de um option file (arquivo de opções). Por exemplo, você pode usar `C:\my.cnf` no Windows, ou o arquivo `.my.cnf` no seu diretório home no Unix. Veja [Seção 4.2.2.2, “Using Option Files”](option-files.html "4.2.2.2 Using Option Files").

* Em um programa C, você pode especificar o arquivo socket ou os argumentos do número da port na chamada [`mysql_real_connect()`](/doc/c-api/5.7/en/mysql-real-connect.html). Você também pode fazer com que o programa leia option files chamando [`mysql_options()`](/doc/c-api/5.7/en/mysql-options.html). Veja [C API Basic Function Descriptions](/doc/c-api/5.7/en/c-api-function-descriptions.html).

* Se você estiver usando o módulo Perl `DBD::mysql`, você pode ler opções de option files do MySQL. Por exemplo:

  ```sql
  $dsn = "DBI:mysql:test;mysql_read_default_group=client;"
          . "mysql_read_default_file=/usr/local/mysql/data/my.cnf";
  $dbh = DBI->connect($dsn, $user, $password);
  ```

  Veja [Seção 27.9, “MySQL Perl API”](apis-perl.html "27.9 MySQL Perl API").

  Outras interfaces de programação podem fornecer capacidades semelhantes para a leitura de option files.
