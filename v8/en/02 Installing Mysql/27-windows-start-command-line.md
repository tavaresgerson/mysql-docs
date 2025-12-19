#### 2.3.3.6 Starting MySQL from the Windows Command Line

The MySQL server can be started manually from the command line. This can be done on any version of Windows.

To start the  **mysqld** server from the command line, you should start a console window (or “DOS window”) and enter this command:

```
C:\> "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld"
```

The path to  **mysqld** may vary depending on the install location of MySQL on your system.

You can stop the MySQL server by executing this command:

```
C:\> "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqladmin" -u root shutdown
```

::: info Note

If the MySQL `root` user account has a password, you need to invoke  **mysqladmin** with the `-p` option and supply the password when prompted.

:::

This command invokes the MySQL administrative utility **mysqladmin** to connect to the server and tell it to shut down. The command connects as the MySQL `root` user, which is the default administrative account in the MySQL grant system.

::: info Note

Users in the MySQL grant system are wholly independent from any operating system users under Microsoft Windows.

:::

If  **mysqld** doesn't start, check the error log to see whether the server wrote any messages there to indicate the cause of the problem. By default, the error log is located in the `C:\Program Files\MySQL\MySQL Server 8.4\data` directory. It is the file with a suffix of `.err`, or may be specified by passing in the  `--log-error` option. Alternatively, you can try to start the server with the `--console` option; in this case, the server may display some useful information on the screen to help solve the problem.

The last option is to start  **mysqld** with the `--standalone` and `--debug` options. In this case, **mysqld** writes a log file `C:\mysqld.trace` that should contain the reason why  **mysqld** doesn't start. See Section 7.9.4, “The DBUG Package”.

Use  **mysqld --verbose --help** to display all the options that  **mysqld** supports.
