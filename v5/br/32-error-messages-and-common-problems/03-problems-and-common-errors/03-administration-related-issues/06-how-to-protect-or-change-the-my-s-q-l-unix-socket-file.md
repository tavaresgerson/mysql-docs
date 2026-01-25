#### B.3.3.6 Como Proteger ou Alterar o Arquivo Unix Socket do MySQL

A localização padrão para o arquivo Unix socket que o server usa para comunicação com clients locais é `/tmp/mysql.sock`. (Para alguns formatos de distribuição, o diretório pode ser diferente, como `/var/lib/mysql` para RPMs.)

Em algumas versões do Unix, qualquer pessoa pode excluir arquivos no diretório `/tmp` ou em outros diretórios similares usados para arquivos temporários. Se o arquivo socket estiver localizado em tal diretório no seu sistema, isso pode causar problemas.

Na maioria das versões do Unix, você pode proteger seu diretório `/tmp` para que os arquivos possam ser excluídos apenas por seus proprietários ou pelo superuser (`root`). Para fazer isso, defina o `sticky bit` no diretório `/tmp` efetuando login como `root` e usando o seguinte comando:

```sql
$> chmod +t /tmp
```

Você pode verificar se o `sticky bit` está definido executando `ls -ld /tmp`. Se o último caractere de permissão for `t`, o bit está definido.

Outra abordagem é alterar o local onde o server cria o arquivo Unix socket. Se você fizer isso, você também deve informar aos programas client a nova localização do arquivo. Você pode especificar a localização do arquivo de várias maneiras:

* Especifique o caminho em um arquivo de opção global ou local. Por exemplo, insira as seguintes linhas em `/etc/my.cnf`:

  ```sql
  [mysqld]
  socket=/path/to/socket

  [client]
  socket=/path/to/socket
  ```

  Consulte [Seção 4.2.2.2, “Using Option Files”](option-files.html "4.2.2.2 Using Option Files").

* Especifique uma opção [`--socket`](connection-options.html#option_general_socket) na linha de comando para [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") e quando você executa programas client.

* Defina a variável de ambiente `MYSQL_UNIX_PORT` para o caminho do arquivo Unix socket.

* Recompile o MySQL a partir do código fonte para usar uma localização padrão diferente para o arquivo Unix socket. Defina o caminho para o arquivo com a opção [`MYSQL_UNIX_ADDR`](source-configuration-options.html#option_cmake_mysql_unix_addr) ao executar o **CMake**. Consulte [Seção 2.8.7, “MySQL Source-Configuration Options”](source-configuration-options.html "2.8.7 MySQL Source-Configuration Options").

Você pode testar se a nova localização do socket funciona tentando se conectar ao server com este comando:

```sql
$> mysqladmin --socket=/path/to/socket version
```