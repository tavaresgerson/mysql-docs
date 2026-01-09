### 22.3.1 MySQL Shell

This quick-start guide assumes a certain level of familiarity with MySQL Shell. The following section is a high level overview, see the MySQL Shell documentation for more information. MySQL Shell is a unified scripting interface to MySQL Server. It supports scripting in JavaScript and Python. SQL is the default processing mode.

#### Start MySQL Shell

After you have installed and started MySQL server, connect MySQL Shell to the server instance. You need to know the address of the MySQL server instance you plan to connect to. To be able to use the instance as a Document Store, the server instance must have X Plugin installed and you should connect to the server using X Protocol. For example to connect to the instance `ds1.example.com` on the default X Protocol port of 33060 use the network string `user@ds1.example.com:33060`.

Tip

If you connect to the instance using classic MySQL protocol, for example by using the default `port` of 3306 instead of the `mysqlx_port`, you *cannot* use the Document Store functionality shown in this tutorial. For example the `db` global object is not populated. To use the Document Store, always connect using X Protocol.

If MySQL Shell is not already running, open a terminal window and issue:

```
mysqlsh user@ds1.example.com:33060/world_x
```

Alternatively, if MySQL Shell is already running use the `\connect` command by issuing:

```
\connect user@ds1.example.com:33060/world_x
```

You need to specify the address of the MySQL server instance which you want to connect MySQL Shell to. For example in the previous example:

* *`user`* represents the user name of your MySQL account.

* `ds1.example.com` is the hostname of the server instance running MySQL. Replace this with the hostname of the MySQL server instance you are using as a Document Store.

* The default schema for this session is `world_x`. For instructions on setting up the `world_x` schema, see Section 22.3.2, “Download and Import world_x Database”.

For more information, see Section 6.2.5, “Connecting to the Server Using URI-Like Strings or Key-Value Pairs”.

Once MySQL Shell opens, the `mysql-js>` prompt indicates that the active language for this session is SQL.

```
MYSQL SQL>
```

MySQL Shell supports input-line editing as follows:

* **left-arrow** and **right-arrow** keys move horizontally within the current input line.

* **up-arrow** and **down-arrow** keys move up and down through the set of previously entered lines.

* **Backspace** deletes the character before the cursor and typing new characters enters them at the cursor position.

* **Enter** sends the current input line to the server.

#### Get Help for MySQL Shell

Type **mysqlsh --help** at the prompt of your command interpreter for a list of command-line options.

```
mysqlsh --help
```

Type `\help` at the MySQL Shell prompt for a list of available commands and their descriptions.

```
mysql-js> \help
```

Type `\help` followed by a command name for detailed help about an individual MySQL Shell command. For example, to view help on the `\connect` command, issue:

```
mysql-js> \help \connect
```

#### Quit MySQL Shell

To quit MySQL Shell, issue the following command:

```
mysql-js> \quit
```

#### Related Information

* See Interactive Code Execution for an explanation of how interactive code execution works in MySQL Shell.

* See Getting Started with MySQL Shell to learn about session and connection alternatives.
