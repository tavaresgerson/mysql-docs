### 7.8.4 Utilização de programas cliente num ambiente com vários servidores

Para se conectar com um programa cliente a um servidor MySQL que está ouvindo diferentes interfaces de rede daquelas compiladas em seu cliente, você pode usar um dos seguintes métodos:

- Inicie o cliente com `--host=host_name` `--port=port_number` para se conectar usando TCP/IP a um servidor remoto, com `--host=127.0.0.1` `--port=port_number` para se conectar usando TCP/IP a um servidor local, ou com `--host=localhost` `--socket=file_name` para se conectar a um servidor local usando um arquivo de soquete Unix ou um tubo do Windows chamado.
- Inicie o cliente com `--protocol=TCP` para se conectar usando TCP/IP, `--protocol=SOCKET` para se conectar usando um arquivo de soquete Unix, `--protocol=PIPE` para se conectar usando um tubo nomeado, ou `--protocol=MEMORY` para se conectar usando memória compartilhada. Para conexões TCP/IP, você também pode precisar especificar as opções `--host` e `--port`. Para os outros tipos de conexões, você pode precisar especificar uma opção `--socket` para especificar um nome de soquete Unix ou arquivo Windows nomeado-pipe, ou uma opção `--shared-memory-base-name` para especificar o nome de memória compartilhada. Conexões de memória compartilhada são suportadas apenas no Windows.
- No Unix, configure as variáveis de ambiente `MYSQL_UNIX_PORT` e `MYSQL_TCP_PORT` para apontar para o arquivo de soquete do Unix e o número de porta TCP/IP antes de iniciar seus clientes. Se você normalmente usa um arquivo de soquete ou número de porta específico, você pode colocar comandos para definir essas variáveis de ambiente no seu arquivo `.login` para que elas sejam aplicadas toda vez que você fizer login. Veja Seção 6.9, Variáveis de Ambiente.
- Especifique o arquivo de soquete padrão do Unix e o número de porta TCP/IP no grupo `[client]` de um arquivo de opções. Por exemplo, você pode usar `C:\my.cnf` no Windows, ou o arquivo `.my.cnf` em seu diretório inicial no Unix. Veja Seção 6.2.2.2, Using Option Files.
- Em um programa C, você pode especificar o arquivo de soquete ou os argumentos de número de porta na chamada `mysql_real_connect()`.
- Se você estiver usando o módulo `DBD::mysql` do Perl, você pode ler opções de arquivos de opções do MySQL. Por exemplo:

  ```
  $dsn = "DBI:mysql:test;mysql_read_default_group=client;"
          . "mysql_read_default_file=/usr/local/mysql/data/my.cnf";
  $dbh = DBI->connect($dsn, $user, $password);
  ```

  Ver Secção 31.9, "MySQL Perl API".

  Outras interfaces de programação podem fornecer capacidades semelhantes para arquivos de opções de leitura.
