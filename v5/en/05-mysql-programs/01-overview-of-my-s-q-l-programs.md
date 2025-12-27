## 4.1 Overview of MySQL Programs

There are many different programs in a MySQL installation. This section provides a brief overview of them. Later sections provide a more detailed description of each one, with the exception of NDB Cluster programs. Each program's description indicates its invocation syntax and the options that it supports. Section 21.5, “NDB Cluster Programs”, describes programs specific to NDB Cluster.

Most MySQL distributions include all of these programs, except for those programs that are platform-specific. (For example, the server startup scripts are not used on Windows.) The exception is that RPM distributions are more specialized. There is one RPM for the server, another for client programs, and so forth. If you appear to be missing one or more programs, see Chapter 2, *Installing and Upgrading MySQL*, for information on types of distributions and what they contain. It may be that you have a distribution that does not include all programs and you need to install an additional package.

Each MySQL program takes many different options. Most programs provide a `--help` option that you can use to get a description of the program's different options. For example, try **mysql --help**.

You can override default option values for MySQL programs by specifying options on the command line or in an option file. See Section 4.2, “Using MySQL Programs”, for general information on invoking programs and specifying program options.

The MySQL server, **mysqld**, is the main program that does most of the work in a MySQL installation. The server is accompanied by several related scripts that assist you in starting and stopping the server:

* **mysqld**

  The SQL daemon (that is, the MySQL server). To use client programs, **mysqld** must be running, because clients gain access to databases by connecting to the server. See Section 4.3.1, “mysqld — The MySQL Server”.

* **mysqld\_safe**

  A server startup script. **mysqld\_safe** attempts to start **mysqld**. See Section 4.3.2, “mysqld\_safe — MySQL Server Startup Script”.

* **mysql.server**

  A server startup script. This script is used on systems that use System V-style run directories containing scripts that start system services for particular run levels. It invokes **mysqld\_safe** to start the MySQL server. See Section 4.3.3, “mysql.server — MySQL Server Startup Script”.

* **mysqld\_multi**

  A server startup script that can start or stop multiple servers installed on the system. See Section 4.3.4, “mysqld\_multi — Manage Multiple MySQL Servers”.

Several programs perform setup operations during MySQL installation or upgrading:

* **comp\_err**

  This program is used during the MySQL build/installation process. It compiles error message files from the error source files. See Section 4.4.1, “comp\_err — Compile MySQL Error Message File”.

* **mysql\_install\_db**

  This program initializes the MySQL data directory, creates the `mysql` database and initializes its grant tables with default privileges, and sets up the `InnoDB` system tablespace. It is usually executed only once, when first installing MySQL on a system. See Section 4.4.2, “mysql\_install\_db — Initialize MySQL Data Directory”, and Section 2.9, “Postinstallation Setup and Testing”.

* **mysql\_plugin**

  This program configures MySQL server plugins. See Section 4.4.3, “mysql\_plugin — Configure MySQL Server Plugins”.

* **mysql\_secure\_installation**

  This program enables you to improve the security of your MySQL installation. See Section 4.4.4, “mysql\_secure\_installation — Improve MySQL Installation Security”.

* **mysql\_ssl\_rsa\_setup**

  This program creates the SSL certificate and key files and RSA key-pair files required to support secure connections, if those files are missing. Files created by **mysql\_ssl\_rsa\_setup** can be used for secure connections using SSL or RSA. See Section 4.4.5, “mysql\_ssl\_rsa\_setup — Create SSL/RSA Files”.

* **mysql\_tzinfo\_to\_sql**

  This program loads the time zone tables in the `mysql` database using the contents of the host system zoneinfo database (the set of files describing time zones). See Section 4.4.6, “mysql\_tzinfo\_to\_sql — Load the Time Zone Tables”.

* **mysql\_upgrade**

  This program is used after a MySQL upgrade operation. It updates the grant tables with any changes that have been made in newer versions of MySQL, and checks tables for incompatibilities and repairs them if necessary. See Section 4.4.7, “mysql\_upgrade — Check and Upgrade MySQL Tables”.

MySQL client programs that connect to the MySQL server:

* **mysql**

  The command-line tool for interactively entering SQL statements or executing them from a file in batch mode. See Section 4.5.1, “mysql — The MySQL Command-Line Client”.

* **mysqladmin**

  A client that performs administrative operations, such as creating or dropping databases, reloading the grant tables, flushing tables to disk, and reopening log files. **mysqladmin** can also be used to retrieve version, process, and status information from the server. See Section 4.5.2, “mysqladmin — A MySQL Server Administration Program”.

* **mysqlcheck**

  A table-maintenance client that checks, repairs, analyzes, and optimizes tables. See Section 4.5.3, “mysqlcheck — A Table Maintenance Program”.

* **mysqldump**

  A client that dumps a MySQL database into a file as SQL, text, or XML. See Section 4.5.4, “mysqldump — A Database Backup Program”.

* **mysqlimport**

  A client that imports text files into their respective tables using `LOAD DATA`. See Section 4.5.5, “mysqlimport — A Data Import Program”.

* **mysqlpump**

  A client that dumps a MySQL database into a file as SQL. See Section 4.5.6, “mysqlpump — A Database Backup Program”.

* **mysqlsh**

  MySQL Shell is an advanced client and code editor for MySQL Server. See MySQL Shell 8.0. In addition to the provided SQL functionality, similar to **mysql**, MySQL Shell provides scripting capabilities for JavaScript and Python and includes APIs for working with MySQL. X DevAPI enables you to work with both relational and document data, see Chapter 19, *Using MySQL as a Document Store*. AdminAPI enables you to work with InnoDB Cluster, see MySQL AdminAPI.

* **mysqlshow**

  A client that displays information about databases, tables, columns, and indexes. See Section 4.5.7, “mysqlshow — Display Database, Table, and Column Information”.

* **mysqlslap**

  A client that is designed to emulate client load for a MySQL server and report the timing of each stage. It works as if multiple clients are accessing the server. See Section 4.5.8, “mysqlslap — A Load Emulation Client”.

MySQL administrative and utility programs:

* **innochecksum**

  An offline `InnoDB` offline file checksum utility. See Section 4.6.1, “innochecksum — Offline InnoDB File Checksum Utility”.

* **myisam\_ftdump**

  A utility that displays information about full-text indexes in `MyISAM` tables. See Section 4.6.2, “myisam\_ftdump — Display Full-Text Index information”.

* **myisamchk**

  A utility to describe, check, optimize, and repair `MyISAM` tables. See Section 4.6.3, “myisamchk — MyISAM Table-Maintenance Utility”.

* **myisamlog**

  A utility that processes the contents of a `MyISAM` log file. See Section 4.6.4, “myisamlog — Display MyISAM Log File Contents”.

* **myisampack**

  A utility that compresses `MyISAM` tables to produce smaller read-only tables. See Section 4.6.5, “myisampack — Generate Compressed, Read-Only MyISAM Tables”.

* **mysql\_config\_editor**

  A utility that enables you to store authentication credentials in a secure, encrypted login path file named `.mylogin.cnf`. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

* **mysqlbinlog**

  A utility for reading statements from a binary log. The log of executed statements contained in the binary log files can be used to help recover from a crash. See Section 4.6.7, “mysqlbinlog — Utility for Processing Binary Log Files”.

* **mysqldumpslow**

  A utility to read and summarize the contents of a slow query log. See Section 4.6.8, “mysqldumpslow — Summarize Slow Query Log Files”.

MySQL program-development utilities:

* **mysql\_config**

  A shell script that produces the option values needed when compiling MySQL programs. See Section 4.7.1, “mysql\_config — Display Options for Compiling Clients”.

* **my\_print\_defaults**

  A utility that shows which options are present in option groups of option files. See Section 4.7.2, “my\_print\_defaults — Display Options from Option Files”.

* **resolve\_stack\_dump**

  A utility program that resolves a numeric stack trace dump to symbols. See Section 4.7.3, “resolve\_stack\_dump — Resolve Numeric Stack Trace Dump to Symbols”.

Miscellaneous utilities:

* **lz4\_decompress**

  A utility that decompresses **mysqlpump** output that was created using LZ4 compression. See Section 4.8.1, “lz4\_decompress — Decompress mysqlpump LZ4-Compressed Output”.

* **perror**

  A utility that displays the meaning of system or MySQL error codes. See Section 4.8.2, “perror — Display MySQL Error Message Information”.

* **replace**

  A utility program that performs string replacement in the input text. See Section 4.8.3, “replace — A String-Replacement Utility”.

* **resolveip**

  A utility program that resolves a host name to an IP address or vice versa. See Section 4.8.4, “resolveip — Resolve Host name to IP Address or Vice Versa”.

* **zlib\_decompress**

  A utility that decompresses **mysqlpump** output that was created using ZLIB compression. See Section 4.8.5, “zlib\_decompress — Decompress mysqlpump ZLIB-Compressed Output”.

Oracle Corporation also provides the MySQL Workbench GUI tool, which is used to administer MySQL servers and databases, to create, execute, and evaluate queries, and to migrate schemas and data from other relational database management systems for use with MySQL.

MySQL client programs that communicate with the server using the MySQL client/server library use the following environment variables.

<table summary="Environment variables used by MySQL client programs that communicate with the server using the MySQL client/server library."><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Environment Variable</th> <th>Meaning</th> </tr></thead><tbody><tr> <td><code class="literal">MYSQL_UNIX_PORT</code></td> <td>The default Unix socket file; used for connections to <code class="literal">localhost</code></td> </tr><tr> <td><code class="literal">MYSQL_TCP_PORT</code></td> <td>The default port number; used for TCP/IP connections</td> </tr><tr> <td><code class="literal">MYSQL_PWD</code></td> <td>The default password</td> </tr><tr> <td><code class="literal">MYSQL_DEBUG</code></td> <td>Debug trace options when debugging</td> </tr><tr> <td><code class="literal">TMPDIR</code></td> <td>The directory where temporary tables and files are created</td> </tr></tbody></table>

For a full list of environment variables used by MySQL programs, see Section 4.9, “Environment Variables”.

Use of `MYSQL_PWD` is insecure. See Section 6.1.2.1, “End-User Guidelines for Password Security”.
