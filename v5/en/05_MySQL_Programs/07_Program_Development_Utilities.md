## 4.7 Program Development Utilities

This section describes some utilities that you may find useful when developing MySQL programs.

In shell scripts, you can use the **my\_print\_defaults** program to parse option files and see what options would be used by a given program. The following example shows the output that **my\_print\_defaults** might produce when asked to show the options found in the `[client]` and `[mysql]` groups:

```sql
$> my_print_defaults client mysql
--port=3306
--socket=/tmp/mysql.sock
--no-auto-rehash
```

Note for developers: Option file handling is implemented in the C client library simply by processing all options in the appropriate group or groups before any command-line arguments. This works well for programs that use the last instance of an option that is specified multiple times. If you have a C or C++ program that handles multiply specified options this way but that does not read option files, you need add only two lines to give it that capability. Check the source code of any of the standard MySQL clients to see how to do this.

Several other language interfaces to MySQL are based on the C client library, and some of them provide a way to access option file contents. These include Perl and Python. For details, see the documentation for your preferred interface.

### 4.7.1 mysql_config — Display Options for Compiling Clients

**mysql\_config** provides you with useful information for compiling your MySQL client and connecting it to MySQL. It is a shell script, so it is available only on Unix and Unix-like systems.

Note

As of MySQL 5.7.9, **pkg-config** can be used as an alternative to **mysql\_config** for obtaining information such as compiler flags or link libraries required to compile MySQL applications. For more information, see Building C API Client Programs Using pkg-config.

Note

As of MySQL 5.7.4, for binary distributions for Solaris, **mysql\_config** does not provide arguments for linking with the embedded library. To get linking arguments for the embedded library, use the **mysql\_server\_config** script instead.

**mysql\_config** supports the following options.

* `--cflags`

  C Compiler flags to find include files and critical compiler flags and defines used when compiling the `libmysqlclient` library. The options returned are tied to the specific compiler that was used when the library was created and might clash with the settings for your own compiler. Use `--include` for more portable options that contain only include paths.

* `--cxxflags`

  Like `--cflags`, but for C++ compiler flags.

* `--include`

  Compiler options to find MySQL include files.

* `--libmysqld-libs`, `--embedded-libs`, `--embedded`

  Libraries and options required to link with `libmysqld`, the MySQL embedded server.

  Note

  The `libmysqld` embedded server library is deprecated as of MySQL 5.7.19 and has been removed in MySQL 8.0.

* `--libs`

  Libraries and options required to link with the MySQL client library.

* `--libs_r`

  Libraries and options required to link with the thread-safe MySQL client library. In MySQL 5.7, all client libraries are thread-safe, so this option need not be used. The `--libs` option can be used in all cases.

* `--plugindir`

  The default plugin directory path name, defined when configuring MySQL.

* `--port`

  The default TCP/IP port number, defined when configuring MySQL.

* `--socket`

  The default Unix socket file, defined when configuring MySQL.

* `--variable=var_name`

  Display the value of the named configuration variable. Permitted *`var_name`* values are `pkgincludedir` (the header file directory), `pkglibdir` (the library directory), and `plugindir` (the plugin directory).

* `--version`

  Version number for the MySQL distribution.

If you invoke **mysql\_config** with no options, it displays a list of all options that it supports, and their values:

```sql
$> mysql_config
Usage: /usr/local/mysql/bin/mysql_config [options]
Options:
  --cflags         [-I/usr/local/mysql/include/mysql -mcpu=pentiumpro]
  --cxxflags       [-I/usr/local/mysql/include/mysql -mcpu=pentiumpro]
  --include        [-I/usr/local/mysql/include/mysql]
  --libs           [-L/usr/local/mysql/lib/mysql -lmysqlclient
                    -lpthread -lm -lrt -lssl -lcrypto -ldl]
  --libs_r         [-L/usr/local/mysql/lib/mysql -lmysqlclient_r
                    -lpthread -lm -lrt -lssl -lcrypto -ldl]
  --plugindir      [/usr/local/mysql/lib/plugin]
  --socket         [/tmp/mysql.sock]
  --port           [3306]
  --version        [5.7.9]
  --libmysqld-libs [-L/usr/local/mysql/lib/mysql -lmysqld
                    -lpthread -lm -lrt -lssl -lcrypto -ldl -lcrypt]
  --variable=VAR   VAR is one of:
          pkgincludedir [/usr/local/mysql/include]
          pkglibdir     [/usr/local/mysql/lib]
          plugindir     [/usr/local/mysql/lib/plugin]
```

You can use **mysql\_config** within a command line using backticks to include the output that it produces for particular options. For example, to compile and link a MySQL client program, use **mysql\_config** as follows:

```sql
gcc -c `mysql_config --cflags` progname.c
gcc -o progname progname.o `mysql_config --libs`
```

### 4.7.2 my\_print\_defaults — Display Options from Option Files

**my\_print\_defaults** displays the options that are present in option groups of option files. The output indicates what options are used by programs that read the specified option groups. For example, the **mysqlcheck** program reads the `[mysqlcheck]` and `[client]` option groups. To see what options are present in those groups in the standard option files, invoke **my\_print\_defaults** like this:

```sql
$> my_print_defaults mysqlcheck client
--user=myusername
--password=password
--host=localhost
```

The output consists of options, one per line, in the form that they would be specified on the command line.

**my_print_defaults** supports the following options.

* `--help`, `-?`

  Display a help message and exit.

* `--config-file=file_name`, `--defaults-file=file_name`, `-c file_name`

  Read only the given option file.

* `--debug=debug_options`, `-# debug_options`

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o,/tmp/my_print_defaults.trace`.

* `--defaults-extra-file=file_name`, `--extra-file=file_name`, `-e file_name`

  Read this option file after the global option file but (on Unix) before the user option file.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=suffix`, `-g suffix`

  In addition to the groups named on the command line, read groups that have the given suffix.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--login-path=name`, `-l name`

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--no-defaults`, `-n`

  Return an empty string.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--show`, `-s`

  As of MySQL 5.7.8, **my\_print\_defaults** masks passwords by default. Use this option to display passwords in cleartext.

* `--verbose`, `-v`

  Verbose mode. Print more information about what the program does.

* `--version`, `-V`

  Display version information and exit.

### 4.7.3 resolve\_stack\_dump — Resolve Numeric Stack Trace Dump to Symbols

**resolve\_stack\_dump** resolves a numeric stack dump to symbols.

Note

**resolve\_stack\_dump** is deprecated and is removed in MySQL 8.0. Stack traces from official MySQL builds are always symbolized, so there is no need to use **resolve\_stack\_dump**.

Invoke **resolve\_stack\_dump** like this:

```sql
resolve_stack_dump [options] symbols_file [numeric_dump_file]
```

The symbols file should include the output from the **nm --numeric-sort mysqld** command. The numeric dump file should contain a numeric stack track from `mysqld`. If no numeric dump file is named on the command line, the stack trace is read from the standard input.

**resolve\_stack\_dump** supports the following options.

* `--help`, `-h`

  Display a help message and exit.

* `--numeric-dump-file=file_name`, `-n file_name`

  Read the stack trace from the given file.

* `--symbols-file=file_name`, `-s file_name`

  Use the given symbols file.

* `--version`, `-V`

  Display version information and exit.

For more information, see Section 5.8.1.5, “Using a Stack Trace”.

