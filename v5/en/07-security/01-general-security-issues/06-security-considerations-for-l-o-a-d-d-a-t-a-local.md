### 6.1.6 Security Considerations for LOAD DATA LOCAL

The [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") statement loads a data file into a table. The statement can load a file located on the server host, or, if the `LOCAL` keyword is specified, on the client host.

The `LOCAL` version of [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") has two potential security issues:

* Because [`LOAD DATA LOCAL`](load-data.html "13.2.6 LOAD DATA Statement") is an SQL statement, parsing occurs on the server side, and transfer of the file from the client host to the server host is initiated by the MySQL server, which tells the client the file named in the statement. In theory, a patched server could tell the client program to transfer a file of the server's choosing rather than the file named in the statement. Such a server could access any file on the client host to which the client user has read access. (A patched server could in fact reply with a file-transfer request to any statement, not just [`LOAD DATA LOCAL`](load-data.html "13.2.6 LOAD DATA Statement"), so a more fundamental issue is that clients should not connect to untrusted servers.)

* In a Web environment where the clients are connecting from a Web server, a user could use [`LOAD DATA LOCAL`](load-data.html "13.2.6 LOAD DATA Statement") to read any files that the Web server process has read access to (assuming that a user could run any statement against the SQL server). In this environment, the client with respect to the MySQL server actually is the Web server, not a remote program being run by users who connect to the Web server.

To avoid connecting to untrusted servers, clients can establish a secure connection and verify the server identity by connecting using the [`--ssl-mode=VERIFY_IDENTITY`](connection-options.html#option_general_ssl-mode) option and the appropriate CA certificate. To implement this level of verification, you must first ensure that the CA certificate for the server is reliably available to the replica, otherwise availability issues will result. For more information, see [Command Options for Encrypted Connections](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections").

To avoid [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") issues, clients should avoid using `LOCAL`.

Adminstrators and applications can configure whether to permit local data loading as follows:

* On the server side:

  + The [`local_infile`](server-system-variables.html#sysvar_local_infile) system variable controls server-side `LOCAL` capability. Depending on the [`local_infile`](server-system-variables.html#sysvar_local_infile) setting, the server refuses or permits local data loading by clients that request local data loading.

  + By default, [`local_infile`](server-system-variables.html#sysvar_local_infile) is enabled. To cause the server to refuse or permit [`LOAD DATA LOCAL`](load-data.html "13.2.6 LOAD DATA Statement") statements explicitly (regardless of how client programs and libraries are configured at build time or runtime), start [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with [`local_infile`](server-system-variables.html#sysvar_local_infile) disabled or enabled. [`local_infile`](server-system-variables.html#sysvar_local_infile) can also be set at runtime.

* On the client side:

  + The [`ENABLED_LOCAL_INFILE`](source-configuration-options.html#option_cmake_enabled_local_infile) **CMake** option controls the compiled-in default `LOCAL` capability for the MySQL client library (see [Section 2.8.7, “MySQL Source-Configuration Options”](source-configuration-options.html "2.8.7 MySQL Source-Configuration Options")). Clients that make no explicit arrangements therefore have `LOCAL` capability disabled or enabled according to the [`ENABLED_LOCAL_INFILE`](source-configuration-options.html#option_cmake_enabled_local_infile) setting specified at MySQL build time.

  + By default, the client library in MySQL binary distributions is compiled with [`ENABLED_LOCAL_INFILE`](source-configuration-options.html#option_cmake_enabled_local_infile) enabled. If you compile MySQL from source, configure it with [`ENABLED_LOCAL_INFILE`](source-configuration-options.html#option_cmake_enabled_local_infile) disabled or enabled based on whether clients that make no explicit arrangements should have `LOCAL` capability disabled or enabled.

  + For client programs that use the C API, local data loading capability is determined by the default compiled into the MySQL client library. To enable or disable it explicitly, invoke the [`mysql_options()`](/doc/c-api/5.7/en/mysql-options.html) C API function to disable or enable the `MYSQL_OPT_LOCAL_INFILE` option. See [mysql_options()](/doc/c-api/5.7/en/mysql-options.html).

  + For the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, local data loading capability is determined by the default compiled into the MySQL client library. To disable or enable it explicitly, use the [`--local-infile=0`](mysql-command-options.html#option_mysql_local-infile) or [`--local-infile[=1]`](mysql-command-options.html#option_mysql_local-infile) option.

  + For the [**mysqlimport**](mysqlimport.html "4.5.5 mysqlimport — A Data Import Program") client, local data loading is not used by default. To disable or enable it explicitly, use the [`--local=0`](mysqlimport.html#option_mysqlimport_local) or [`--local[=1]`](mysqlimport.html#option_mysqlimport_local) option.

  + If you use [`LOAD DATA LOCAL`](load-data.html "13.2.6 LOAD DATA Statement") in Perl scripts or other programs that read the `[client]` group from option files, you can add a `local-infile` option setting to that group. To prevent problems for programs that do not understand this option, specify it using the [`loose-`](option-modifiers.html "4.2.2.4 Program Option Modifiers") prefix:

    ```sql
    [client]
    loose-local-infile=0
    ```

    or:

    ```sql
    [client]
    loose-local-infile=1
    ```

  + In all cases, successful use of a `LOCAL` load operation by a client also requires that the server permits local loading.

If `LOCAL` capability is disabled, on either the server or client side, a client that attempts to issue a [`LOAD DATA LOCAL`](load-data.html "13.2.6 LOAD DATA Statement") statement receives the following error message:

```sql
ERROR 1148: The used command is not allowed with this MySQL version
```

#### MySQL Shell and Local Data Loading

MySQL Shell provides a number of utilities to dump tables, schemas, or server instances and load them into other instances. When you use these utilities to handle the data, MySQL Shell provides additional functions such as input preprocessing, multithreaded parallel loading, file compression and decompression, and handling access to Oracle Cloud Infrastructure Object Storage buckets. To get the best functionality, always use the most recent version available of MySQL Shell's dump and dump loading utilities.

MySQL Shell's data upload utilities use [`LOAD DATA LOCAL INFILE`](load-data.html "13.2.6 LOAD DATA Statement") statements to upload data, so the [`local_infile`](server-system-variables.html#sysvar_local_infile) system variable must be set to `ON` on the target server instance. You can do this before uploading the data, and remove it again afterwards. The utilities handle the file transfer requests safely to deal with the security considerations discussed in this topic.

MySQL Shell includes these dump and dump loading utilities:

Table export utility `util.exportTable()` :   Exports a MySQL relational table into a data file, which can be uploaded to a MySQL server instance using MySQL Shell's parallel table import utility, imported to a different application, or used as a logical backup. The utility has preset options and customization options to produce different output formats.

Parallel table import utility `util.importTable()` :   Inports a data file to a MySQL relational table. The data file can be the output from MySQL Shell's table export utility or another format supported by the utility's preset and customization options. The utility can carry out input preprocessing before adding the data to the table. It can accept multiple data files to merge into a single relational table, and automatically decompresses compressed files.

Instance dump utility `util.dumpInstance()`, schema dump utility `util.dumpSchemas()`, and table dump utility `util.dumpTables()` :   Export an instance, schema, or table to a set of dump files, which can then be uploaded to a MySQL instance using MySQL Shell's dump loading utility. The utilities provide Oracle Cloud Infrastructure Object Storage streaming, MySQL HeatWave Service compatibility checks and modifications, and the ability to carry out a dry run to identify issues before proceeding with the dump.

Dump loading utility `util.loadDump()` :   Import dump files created using MySQL Shell's instance, schema, or table dump utility into a MySQL HeatWave Service DB System or a MySQL Server instance. The utility manages the upload process and provides data streaming from remote storage, parallel loading of tables or table chunks, progress state tracking, resume and reset capability, and the option of concurrent loading while the dump is still taking place. MySQL Shell’s parallel table import utility can be used in combination with the dump loading utility to modify data before uploading it to the target MySQL instance.

For details of the utilities, see [MySQL Shell Utilities](/doc/mysql-shell/8.0/en/mysql-shell-utilities.html).
