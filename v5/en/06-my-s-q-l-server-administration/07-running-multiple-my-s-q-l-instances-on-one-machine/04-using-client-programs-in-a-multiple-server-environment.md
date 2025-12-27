### 5.7.4 Using Client Programs in a Multiple-Server Environment

To connect with a client program to a MySQL server that is listening to different network interfaces from those compiled into your client, you can use one of the following methods:

* Start the client with [`--host=host_name`](connection-options.html#option_general_host) [`--port=port_number`](connection-options.html#option_general_port) to connect using TCP/IP to a remote server, with [`--host=127.0.0.1`](connection-options.html#option_general_host) [`--port=port_number`](connection-options.html#option_general_port) to connect using TCP/IP to a local server, or with [`--host=localhost`](connection-options.html#option_general_host) [`--socket=file_name`](connection-options.html#option_general_socket) to connect to a local server using a Unix socket file or a Windows named pipe.

* Start the client with [`--protocol=TCP`](connection-options.html#option_general_protocol) to connect using TCP/IP, [`--protocol=SOCKET`](connection-options.html#option_general_protocol) to connect using a Unix socket file, [`--protocol=PIPE`](connection-options.html#option_general_protocol) to connect using a named pipe, or [`--protocol=MEMORY`](connection-options.html#option_general_protocol) to connect using shared memory. For TCP/IP connections, you may also need to specify [`--host`](connection-options.html#option_general_host) and [`--port`](connection-options.html#option_general_port) options. For the other types of connections, you may need to specify a [`--socket`](connection-options.html#option_general_socket) option to specify a Unix socket file or Windows named-pipe name, or a [`--shared-memory-base-name`](connection-options.html#option_general_shared-memory-base-name) option to specify the shared-memory name. Shared-memory connections are supported only on Windows.

* On Unix, set the `MYSQL_UNIX_PORT` and `MYSQL_TCP_PORT` environment variables to point to the Unix socket file and TCP/IP port number before you start your clients. If you normally use a specific socket file or port number, you can place commands to set these environment variables in your `.login` file so that they apply each time you log in. See [Section 4.9, “Environment Variables”](environment-variables.html "4.9 Environment Variables").

* Specify the default Unix socket file and TCP/IP port number in the `[client]` group of an option file. For example, you can use `C:\my.cnf` on Windows, or the `.my.cnf` file in your home directory on Unix. See [Section 4.2.2.2, “Using Option Files”](option-files.html "4.2.2.2 Using Option Files").

* In a C program, you can specify the socket file or port number arguments in the [`mysql_real_connect()`](/doc/c-api/5.7/en/mysql-real-connect.html) call. You can also have the program read option files by calling [`mysql_options()`](/doc/c-api/5.7/en/mysql-options.html). See [C API Basic Function Descriptions](/doc/c-api/5.7/en/c-api-function-descriptions.html).

* If you are using the Perl `DBD::mysql` module, you can read options from MySQL option files. For example:

  ```sql
  $dsn = "DBI:mysql:test;mysql_read_default_group=client;"
          . "mysql_read_default_file=/usr/local/mysql/data/my.cnf";
  $dbh = DBI->connect($dsn, $user, $password);
  ```

  See [Section 27.9, “MySQL Perl API”](apis-perl.html "27.9 MySQL Perl API").

  Other programming interfaces may provide similar capabilities for reading option files.
