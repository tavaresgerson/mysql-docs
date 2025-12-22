### 7.1.1 Configuring the Server

The MySQL server,  `mysqld`, has many command options and system variables that can be set at startup to configure its operation. To determine the default command option and system variable values used by the server, execute this command:

```
$> mysqld --verbose --help
```

The command produces a list of all  `mysqld` options and configurable system variables. Its output includes the default option and variable values and looks something like this:

```
activate-all-roles-on-login                                  FALSE
admin-address                                                (No default value)
admin-port                                                   33062
admin-ssl                                                    TRUE
admin-ssl-ca                                                 (No default value)
admin-ssl-capath                                             (No default value)
admin-ssl-cert                                               (No default value)
admin-ssl-cipher                                             (No default value)
admin-ssl-crl                                                (No default value)

...

transaction-prealloc-size                                    4096
transaction-read-only                                        FALSE
updatable-views-with-limit                                   YES
upgrade                                                      AUTO
validate-config                                              FALSE
validate-user-plugins                                        TRUE
verbose                                                      TRUE
wait-timeout                                                 28800
windowing-use-high-precision                                 TRUE
xa-detach-on-prepare                                         TRUE
```

To see the current system variable values actually used by the server as it runs, connect to it and execute this statement:

```
mysql> SHOW VARIABLES;
```

To see some statistical and status indicators for a running server, execute this statement:

```
mysql> SHOW STATUS;
```

System variable and status information also is available using the `mysqladmin` command:

```
$> mysqladmin variables
$> mysqladmin extended-status
```

For a full description of all command options, system variables, and status variables, see these sections:

*  Section 7.1.7, “Server Command Options”
*  Section 7.1.8, “Server System Variables”
*  Section 7.1.10, “Server Status Variables”

More detailed monitoring information is available from the Performance Schema; see  Chapter 29, *MySQL Performance Schema*. In addition, the MySQL `sys` schema is a set of objects that provides convenient access to data collected by the Performance Schema; see  Chapter 30, *MySQL sys Schema*.

If you specify an option on the command line for `mysqld` or  **mysqld\_safe**, it remains in effect only for that invocation of the server. To use the option every time the server runs, put it in an option file. See  Section 6.2.2.2, “Using Option Files”.

Windows users may execute  Section 2.3.2, “Configuration: Using MySQL Configurator” to help configure a MySQL server installation. This includes tasks such as configuring MySQL users, log files, the Windows service name, and sample databases.
