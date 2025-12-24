### 6.7.1 `mysql_config` — Display Options for Compiling Clients

 **`mysql_config`** provides you with useful information for compiling your MySQL client and connecting it to MySQL. It is a shell script, so it is available only on Unix and Unix-like systems.

::: info Note

`pkg-config` can be used as an alternative to `mysql_config` for obtaining information such as compiler flags or link libraries required to compile MySQL applications. For more information, see Building C API Client Programs Using pkg-config.

:::

**mysql_config** supports the following options.

*  `--cflags`

  C Compiler flags to find include files and critical compiler flags and defines used when compiling the `libmysqlclient` library. The options returned are tied to the specific compiler that was used when the library was created and might clash with the settings for your own compiler. Use `--include` for more portable options that contain only include paths.
*  `--cxxflags`

  Like  `--cflags`, but for C++ compiler flags.
*  `--include`

  Compiler options to find MySQL include files.
*  `--libs`

  Libraries and options required to link with the MySQL client library.
*  `--libs_r`

  Libraries and options required to link with the thread-safe MySQL client library. In MySQL 8.4, all client libraries are thread-safe, so this option need not be used. The  `--libs` option can be used in all cases.
*  `--plugindir`

  The default plugin directory path name, defined when configuring MySQL.
*  `--port`

  The default TCP/IP port number, defined when configuring MySQL.
*  `--socket`

  The default Unix socket file, defined when configuring MySQL.
*  `--variable=var_name`

  Display the value of the named configuration variable. Permitted *`var_name`* values are `pkgincludedir` (the header file directory), `pkglibdir` (the library directory), and `plugindir` (the plugin directory).
*  `--version`

  Version number for the MySQL distribution.

If you invoke **mysql_config** with no options, it displays a list of all options that it supports, and their values:

```
$> mysql_config
Usage: ./mysql_config [OPTIONS]
Compiler: GNU 10.4.0

Options:
  --cflags         [-I/usr/local/mysql/include/mysql]
  --cxxflags       [-I/usr/local/mysql/include/mysql]
  --include        [-I/usr/local/mysql/include/mysql]
  --libs           [-L/usr/local/mysql/lib/mysql -lmysqlclient -lpthread -ldl
                    -lssl  -lcrypto -lresolv -lm -lrt]
  --libs_r         [-L/usr/local/mysql/lib/mysql -lmysqlclient -lpthread -ldl
                    -lssl  -lcrypto -lresolv -lm -lrt]
  --plugindir      [/usr/local/mysql/lib/plugin]
  --socket         [/tmp/mysql.sock]
  --port           [3306]
  --version        [8.4.0]
  --variable=VAR   VAR is one of:
          pkgincludedir [/usr/local/mysql/include]
          pkglibdir     [/usr/local/mysql/lib]
          plugindir     [/usr/local/mysql/lib/plugin]
```

You can use **mysql_config** within a command line using backticks to include the output that it produces for particular options. For example, to compile and link a MySQL client program, use **mysql_config** as follows:

```
gcc -c `mysql_config --cflags` progname.c
gcc -o progname progname.o `mysql_config --libs`
```
