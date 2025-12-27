#### 5.7.2.1 Starting Multiple MySQL Instances at the Windows Command Line

The procedure for starting a single MySQL server manually from the command line is described in [Section 2.3.4.6, “Starting MySQL from the Windows Command Line”](windows-start-command-line.html "2.3.4.6 Starting MySQL from the Windows Command Line"). To start multiple servers this way, you can specify the appropriate options on the command line or in an option file. It is more convenient to place the options in an option file, but it is necessary to make sure that each server gets its own set of options. To do this, create an option file for each server and tell the server the file name with a [`--defaults-file`](option-file-options.html#option_general_defaults-file) option when you run it.

Suppose that you want to run one instance of [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") on port 3307 with a data directory of `C:\mydata1`, and another instance on port 3308 with a data directory of `C:\mydata2`. Use this procedure:

1. Make sure that each data directory exists, including its own copy of the `mysql` database that contains the grant tables.

2. Create two option files. For example, create one file named `C:\my-opts1.cnf` that looks like this:

   ```sql
   [mysqld]
   datadir = C:/mydata1
   port = 3307
   ```

   Create a second file named `C:\my-opts2.cnf` that looks like this:

   ```sql
   [mysqld]
   datadir = C:/mydata2
   port = 3308
   ```

3. Use the [`--defaults-file`](option-file-options.html#option_general_defaults-file) option to start each server with its own option file:

   ```sql
   C:\> C:\mysql\bin\mysqld --defaults-file=C:\my-opts1.cnf
   C:\> C:\mysql\bin\mysqld --defaults-file=C:\my-opts2.cnf
   ```

   Each server starts in the foreground (no new prompt appears until the server exits later), so you must issue those two commands in separate console windows.

To shut down the servers, connect to each using the appropriate port number:

```sql
C:\> C:\mysql\bin\mysqladmin --port=3307 --host=127.0.0.1 --user=root --password shutdown
C:\> C:\mysql\bin\mysqladmin --port=3308 --host=127.0.0.1 --user=root --password shutdown
```

Servers configured as just described permit clients to connect over TCP/IP. If your version of Windows supports named pipes and you also want to permit named-pipe connections, specify options that enable the named pipe and specify its name. Each server that supports named-pipe connections must use a unique pipe name. For example, the `C:\my-opts1.cnf` file might be written like this:

```sql
[mysqld]
datadir = C:/mydata1
port = 3307
enable-named-pipe
socket = mypipe1
```

Modify `C:\my-opts2.cnf` similarly for use by the second server. Then start the servers as described previously.

A similar procedure applies for servers that you want to permit shared-memory connections. Enable such connections by starting the server with the [`shared_memory`](server-system-variables.html#sysvar_shared_memory) system variable enabled and specify a unique shared-memory name for each server by setting the [`shared_memory_base_name`](server-system-variables.html#sysvar_shared_memory_base_name) system variable.
