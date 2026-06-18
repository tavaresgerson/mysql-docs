### 5.7.4 Uso de programas do cliente em um ambiente de múltiplos servidores

Para conectar um programa cliente a um servidor MySQL que está ouvindo diferentes interfaces de rede das que foram compiladas no seu cliente, você pode usar um dos seguintes métodos:

- Inicie o cliente com `--host=host_name` `--port=port_number` para se conectar usando TCP/IP a um servidor remoto, com `--host=127.0.0.1` `--port=port_number` para se conectar usando TCP/IP a um servidor local, ou com `--host=localhost` `--socket=file_name` para se conectar a um servidor local usando um arquivo de socket Unix ou um tubo nomeado do Windows.

- Comece o cliente com `--protocol=TCP` para se conectar usando TCP/IP, `--protocol=SOCKET` para se conectar usando um arquivo de socket Unix, `--protocol=PIPE` para se conectar usando um tubo nomeado ou `--protocol=MEMORY` para se conectar usando memória compartilhada. Para conexões TCP/IP, você também pode precisar especificar as opções `--host` e `--port`. Para os outros tipos de conexões, você pode precisar especificar uma opção `--socket` para especificar um arquivo de socket Unix ou o nome de um tubo nomeado do Windows, ou uma opção `--shared-memory-base-name` para especificar o nome da memória compartilhada. Conexões de memória compartilhada são suportadas apenas no Windows.

- No Unix, defina as variáveis de ambiente `MYSQL_UNIX_PORT` e `MYSQL_TCP_PORT` para apontar para o arquivo de soquete Unix e o número da porta TCP/IP antes de iniciar seus clientes. Se você normalmente usa um arquivo de soquete ou número de porta específico, pode colocar comandos para definir essas variáveis de ambiente em seu arquivo `.login` para que elas sejam aplicadas sempre que você fizer login. Veja Seção 4.9, “Variáveis de Ambiente”.

- Especifique o arquivo de soquete Unix padrão e o número da porta TCP/IP no grupo `[client]` de um arquivo de opções. Por exemplo, você pode usar `C:\my.cnf` no Windows ou o arquivo `.my.cnf` no diretório de sua casa no Unix. Veja Seção 4.2.2.2, “Usando Arquivos de Opções”.

- Em um programa em C, você pode especificar os argumentos de arquivo de soquete ou número de porta na chamada de `mysql_real_connect()`. Você também pode fazer o programa ler arquivos de opções chamando `mysql_options()`. Veja Descrição básica de funções da API C.

- Se você estiver usando o módulo `DBD::mysql` do Perl, você pode ler opções de arquivos de opções do MySQL. Por exemplo:

  ```sql
  $dsn = "DBI:mysql:test;mysql_read_default_group=client;"
          . "mysql_read_default_file=/usr/local/mysql/data/my.cnf";
  $dbh = DBI->connect($dsn, $user, $password);
  ```

  Veja Seção 27.9, “API MySQL Perl”.

  Outras interfaces de programação podem oferecer capacidades semelhantes para a leitura de arquivos de opções.
