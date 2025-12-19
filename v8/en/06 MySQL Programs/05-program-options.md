### 6.2.2 Specifying Program Options

There are several ways to specify options for MySQL programs:

* List the options on the command line following the program name. This is common for options that apply to a specific invocation of the program.
* List the options in an option file that the program reads when it starts. This is common for options that you want the program to use each time it runs.
* List the options in environment variables (see Section 6.2.9, “Setting Environment Variables”). This method is useful for options that you want to apply each time the program runs. In practice, option files are used more commonly for this purpose, but  Section 7.8.3, “Running Multiple MySQL Instances on Unix”, discusses one situation in which environment variables can be very helpful. It describes a handy technique that uses such variables to specify the TCP/IP port number and Unix socket file for the server and for client programs.

Options are processed in order, so if an option is specified multiple times, the last occurrence takes precedence. The following command causes  **mysql** to connect to the server running on `localhost`:

```
mysql -h example.com -h localhost
```

There is one exception: For  **mysqld**, the *first* instance of the `--user` option is used as a security precaution, to prevent a user specified in an option file from being overridden on the command line.

If conflicting or related options are given, later options take precedence over earlier options. The following command runs **mysql** in “no column names” mode:

```
mysql --column-names --skip-column-names
```

MySQL programs determine which options are given first by examining environment variables, then by processing option files, and then by checking the command line. Because later options take precedence over earlier ones, the processing order means that environment variables have the lowest precedence and command-line options the highest.

For the server, one exception applies: The **mysqld-auto.cnf** option file in the data directory is processed last, so it takes precedence even over command-line options.

You can take advantage of the way that MySQL programs process options by specifying default option values for a program in an option file. That enables you to avoid typing them each time you run the program while enabling you to override the defaults if necessary by using command-line options.
