### 6.2.4 Connecting to the MySQL Server Using Command Options

This section describes use of command-line options to specify how
to establish connections to the MySQL server, for clients such as
[**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") or [**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program"). For
information on establishing connections using URI-like connection
strings or key-value pairs, for clients such as MySQL Shell, see
[Section 6.2.5, “Connecting to the Server Using URI-Like Strings or Key-Value Pairs”](connecting-using-uri-or-key-value-pairs.html "6.2.5 Connecting to the Server Using URI-Like Strings or Key-Value Pairs"). For
additional information if you are unable to connect, see
[Section 8.2.22, “Troubleshooting Problems Connecting to MySQL”](problems-connecting.html "8.2.22 Troubleshooting Problems Connecting to MySQL").

For a client program to connect to the MySQL server, it must use
the proper connection parameters, such as the name of the host
where the server is running and the user name and password of your
MySQL account. Each connection parameter has a default value, but
you can override default values as necessary using program options
specified either on the command line or in an option file.

The examples here use the [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") client program,
but the principles apply to other clients such as
[**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program"), [**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program"), or
[**mysqlshow**](mysqlshow.html "6.5.6 mysqlshow — Display Database, Table, and Column Information").

This command invokes [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") without specifying
any explicit connection parameters:

```
mysql
```

Because there are no parameter options, the default values apply:

* The default host name is `localhost`. On
  Unix, this has a special meaning, as described later.

* The default user name is `ODBC` on Windows or
  your Unix login name on Unix.

* No password is sent because neither
  [`--password`](connection-options.html#option_general_password) nor
  `-p` is given.

* For [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client"), the first nonoption argument is
  taken as the name of the default database. Because there is no
  such argument, [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") selects no default
  database.

To specify the host name and user name explicitly, as well as a
password, supply appropriate options on the command line. To
select a default database, add a database-name argument. Examples:

```
mysql --host=localhost --user=myname --password=password mydb
mysql -h localhost -u myname -ppassword mydb
```

For password options, the password value is optional:

* If you use a [`--password`](connection-options.html#option_general_password) or
  `-p` option and specify a password value, there
  must be *no space* between
  [`--password=`](connection-options.html#option_general_password) or
  `-p` and the password following it.

* If you use [`--password`](connection-options.html#option_general_password) or
  `-p` but do not specify a password value, the
  client program prompts you to enter the password. The password
  is not displayed as you enter it. This is more secure than
  giving the password on the command line, which might enable
  other users on your system to see the password line by
  executing a command such as **ps**. See
  [Section 8.1.2.1, “End-User Guidelines for Password Security”](password-security-user.html "8.1.2.1 End-User Guidelines for Password Security").

* To explicitly specify that there is no password and that the
  client program should not prompt for one, use the
  [`--skip-password`](connection-options.html#option_general_password)
  option.

As just mentioned, including the password value on the command
line is a security risk. To avoid this risk, specify the
[`--password`](connection-options.html#option_general_password) or `-p`
option without any following password value:

```
mysql --host=localhost --user=myname --password mydb
mysql -h localhost -u myname -p mydb
```

When the [`--password`](connection-options.html#option_general_password) or
`-p` option is given with no password value, the
client program prints a prompt and waits for you to enter the
password. (In these examples, `mydb` is
*not* interpreted as a password because it is
separated from the preceding password option by a space.)

On some systems, the library routine that MySQL uses to prompt for
a password automatically limits the password to eight characters.
That limitation is a property of the system library, not MySQL.
Internally, MySQL does not have any limit for the length of the
password. To work around the limitation on systems affected by it,
specify your password in an option file (see
[Section 6.2.2.2, “Using Option Files”](option-files.html "6.2.2.2 Using Option Files")). Another workaround is to change
your MySQL password to a value that has eight or fewer characters,
but that has the disadvantage that shorter passwords tend to be
less secure.

Client programs determine what type of connection to make as
follows:

* If the host is not specified or is
  `localhost`, a connection to the local host
  occurs:

  + On Windows, the client connects using shared memory, if
    the server was started with the
    [`shared_memory`](server-system-variables.html#sysvar_shared_memory) system
    variable enabled to support shared-memory connections.

  + On Unix, MySQL programs treat the host name
    `localhost` specially, in a way that is
    likely different from what you expect compared to other
    network-based programs: the client connects using a Unix
    socket file. The [`--socket`](connection-options.html#option_general_socket)
    option or the `MYSQL_UNIX_PORT`
    environment variable may be used to specify the socket
    name.

* On Windows, if `host` is `.`
  (period), or TCP/IP is not enabled and
  [`--socket`](connection-options.html#option_general_socket) is not specified or
  the host is empty, the client connects using a named pipe, if
  the server was started with the
  [`named_pipe`](server-system-variables.html#sysvar_named_pipe) system variable
  enabled to support named-pipe connections. If named-pipe
  connections are not supported or if the user making the
  connection is not a member of the Windows group specified by
  the
  [`named_pipe_full_access_group`](server-system-variables.html#sysvar_named_pipe_full_access_group)
  system variable, an error occurs.

* Otherwise, the connection uses TCP/IP.

The [`--protocol`](connection-options.html#option_general_protocol) option enables you
to use a particular transport protocol even when other options
normally result in use of a different protocol. That is,
[`--protocol`](connection-options.html#option_general_protocol) specifies the transport
protocol explicitly and overrides the preceding rules, even for
`localhost`.

Only connection options that are relevant to the selected
transport protocol are used or checked. Other connection options
are ignored. For example, with
[`--host=localhost`](connection-options.html#option_general_host) on Unix, the
client attempts to connect to the local server using a Unix socket
file, even if a [`--port`](connection-options.html#option_general_port) or
`-P` option is given to specify a TCP/IP port
number.

To ensure that the client makes a TCP/IP connection to the local
server, use [`--host`](connection-options.html#option_general_host) or
`-h` to specify a host name value of
`127.0.0.1` (instead of
`localhost`), or the IP address or name of the
local server. You can also specify the transport protocol
explicitly, even for `localhost`, by using the
[`--protocol=TCP`](connection-options.html#option_general_protocol) option. Examples:

```
mysql --host=127.0.0.1
mysql --protocol=TCP
```

If the server is configured to accept IPv6 connections, clients
can connect to the local server over IPv6 using
[`--host=::1`](connection-options.html#option_general_host). See
[Section 7.1.13, “IPv6 Support”](ipv6-support.html "7.1.13 IPv6 Support").

On Windows, to force a MySQL client to use a named-pipe
connection, specify the [`--pipe`](connection-options.html#option_general_pipe) or
[`--protocol=PIPE`](connection-options.html#option_general_protocol) option, or specify
`.` (period) as the host name. If the server was
not started with the [`named_pipe`](server-system-variables.html#sysvar_named_pipe)
system variable enabled to support named-pipe connections or if
the user making the connection is not a member of the Windows
group specified by the
[`named_pipe_full_access_group`](server-system-variables.html#sysvar_named_pipe_full_access_group)
system variable, an error occurs. Use the
[`--socket`](connection-options.html#option_general_socket) option to specify the
name of the pipe if you do not want to use the default pipe name.

Connections to remote servers use TCP/IP. This command connects to
the server running on `remote.example.com` using
the default port number (3306):

```
mysql --host=remote.example.com
```

To specify a port number explicitly, use the
[`--port`](connection-options.html#option_general_port) or `-P`
option:

```
mysql --host=remote.example.com --port=13306
```

You can specify a port number for connections to a local server,
too. However, as indicated previously, connections to
`localhost` on Unix use a socket file by default,
so unless you force a TCP/IP connection as previously described,
any option that specifies a port number is ignored.

For this command, the program uses a socket file on Unix and the
[`--port`](connection-options.html#option_general_port) option is ignored:

```
mysql --port=13306 --host=localhost
```

To cause the port number to be used, force a TCP/IP connection.
For example, invoke the program in either of these ways:

```
mysql --port=13306 --host=127.0.0.1
mysql --port=13306 --protocol=TCP
```

For additional information about options that control how client
programs establish connections to the server, see
[Section 6.2.3, “Command Options for Connecting to the Server”](connection-options.html "6.2.3 Command Options for Connecting to the Server").

It is possible to specify connection parameters without entering
them on the command line each time you invoke a client program:

* Specify the connection parameters in the
  `[client]` section of an option file. The
  relevant section of the file might look like this:

  ```
  [client]
  host=host_name
  user=user_name
  password=password
  ```

  For more information, see [Section 6.2.2.2, “Using Option Files”](option-files.html "6.2.2.2 Using Option Files").

* Some connection parameters can be specified using environment
  variables. Examples:

  + To specify the host for [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client"), use
    `MYSQL_HOST`.

  + On Windows, to specify the MySQL user name, use
    `USER`.

  For a list of supported environment variables, see
  [Section 6.9, “Environment Variables”](environment-variables.html "6.9 Environment Variables").