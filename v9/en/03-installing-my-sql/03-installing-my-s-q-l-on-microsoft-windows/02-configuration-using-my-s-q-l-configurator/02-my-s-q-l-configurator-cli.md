#### 2.3.2.2 MySQL Configurator CLI

MySQL Configurator supports GUI (default) and CLI (by passing in `--console`) modes using the `mysql_configurator.exe` executable.

Note

MySQL Configurator CLI functionality was added in MySQL Configurator 9.2.0.

Executing MySQL Configurator requires a Windows user with administrative privileges, as otherwise the system prompts for the credentials.

##### CLI Syntax

The general syntax is:

```
mysql_configurator.exe --console [--help] | [--action=action_name | -a=action_name] | ...]
```

**Table 2.6 Syntax**

<table summary="MySQL Configurator command line interface syntax"><col style="width: 20%"/><col style="width: 10%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 30%"/><thead><tr> <th>Option name</th> <th>Shortcut</th> <th>Supported values</th> <th>Usage example</th> <th>Description</th> </tr></thead><tbody><tr> <td>console</td> <td>c</td> <td>N/A</td> <td>--console</td> <td>Activates the CLI in MySQL Configurator, otherwise the GUI is launched.</td> </tr><tr> <td>action</td> <td>a</td> <td>configure, reconfigure, remove, or upgrade</td> <td>--action=configure</td> <td>Runs MySQL Configurator CLI in new configuration, reconfiguration, removal or upgrade mode.</td> </tr><tr> <td>help</td> <td>h</td> <td>N/A</td> <td>--help</td> <td>Displays general help or help for the corresponding action. If no <code class="literal">--action</code> element is provided, the general help section is displayed.</td> </tr><tr> <td>action option and value</td> <td>N/A</td> <td>See section "Configure/Reconfigure/Remove/Upgrade options" for supported values and details</td> <td>--datadir="C:\MySQL...", --port=3306</td> <td>Defines the various configuration options available for each CLI action (configuration, reconfiguration, removal or upgrade)</td> </tr></tbody></table>

##### Available Actions

Each action (configure, reconfigure, remove, and upgrade) have a specific set of options that define the elements to configure when performing the operation. The syntax is *`--action_option`*=*`action_value`* with a full list of action options below:

**Table 2.7 Action Options**

<table summary="MySQL Configurator command line interface actions"><col style="width: 15%"/><col style="width: 5%"/><col style="width: 10%"/><col style="width: 5%"/><col style="width: 5%"/><col style="width: 20%"/><col style="width: 5%"/><col style="width: 10%"/><col style="width: 20%"/><thead><tr> <th>Action option</th> <th>Shortcut</th> <th>Aliases</th> <th>Type</th> <th>Values</th> <th>Default value</th> <th>Action</th> <th>Condition</th> <th>Description</th> </tr></thead><tbody><tr> <td>datadir</td> <td>d</td> <td>data-dir, data-directory</td> <td>Path</td> <td>N/A</td> <td>"C:\ProgramData\MySQL\MySQL Server x.x" where <code class="literal">x.x</code> corresponds to the corresponding server major and minor version.</td> <td>configure</td> <td>N/A</td> <td>The path to the MySQL server data directory. This option sets the <code class="literal">datadir</code> system variable.</td> </tr><tr> <td>config-type</td> <td>N/A</td> <td>configuration-type</td> <td>list</td> <td>Developer, Server, Dedicated, Manual</td> <td>development</td> <td>configure, reconfigure</td> <td>N/A</td> <td>Optimizes system resources depending on the intended use of the server instance.</td> </tr><tr> <td>enable-tcp-ip</td> <td>N/A</td> <td>N/A</td> <td>bool</td> <td>true, false</td> <td>true</td> <td>configure, reconfigure</td> <td>N/A</td> <td>Indicates whether the server permits connections over TCP/IP.</td> </tr><tr> <td>port</td> <td>P</td> <td>N/A</td> <td>number</td> <td>N/A</td> <td>3306</td> <td>configure, reconfigure</td> <td>enable-tcp-id=true</td> <td>The port number to use when listening for TCP/IP connections.</td> </tr><tr> <td>mysqlx-port</td> <td>X</td> <td>x-port, xport</td> <td>number</td> <td>N/A</td> <td>3306</td> <td>configure, reconfigure</td> <td>enable-tcp-ip=true</td> <td>The network port on which X Plugin listens for TCP/IP connections. This is the X Plugin equivalent of <code>port</code>.</td> </tr><tr> <td>open_win_firewall</td> <td>N/A</td> <td>open-windows-firewall, openfirewall</td> <td>bool</td> <td>true, false</td> <td>true</td> <td>configure, reconfigure</td> <td>enable-tcp-ip=true</td> <td>Creates Windows Firewall rules for TCP/IP connections for both the <code>port</code> and <code>mysqlx-port</code> options.</td> </tr><tr> <td>upgrade-enterprise-firewall</td> <td>N/A</td> <td><p> upgrade-ent-fw, upgrade-ef </p></td> <td>bool</td> <td>true, false</td> <td>false</td> <td>upgrade</td> <td>N/A</td> <td>Upgrade the deprecated firefall plugin to the <a class="link" href="firewall-component.html" title="8.4.8.2 The MySQL Enterprise Firewall Component">firewall component</a>.</td> </tr><tr> <td>enable-named-pipes</td> <td>N/A</td> <td>named-pipes</td> <td>bool</td> <td>true, false</td> <td>false</td> <td>configure, reconfigure</td> <td>N/A</td> <td>Indicates whether the server permits connections over a named pipe.</td> </tr><tr> <td>socket</td> <td>N/A</td> <td>pipe-name, named-pipe-name, named-pipe, pipename</td> <td>string</td> <td>N/A</td> <td>MYSQL</td> <td>configure, reconfigure</td> <td>enable-named-pipes=true</td> <td>Specifies the pipe name to use when listening for local connections that use a named pipe. The default value is MySQL, and it is not case-sensitive.</td> </tr><tr> <td>named-pipe-full-access-group</td> <td>N/A</td> <td>full-access-group</td> <td>string</td> <td>"", <span class="emphasis"><em>everyone</em></span>, valid Windows local group name</td> <td>"" (empty string)</td> <td>configure, reconfigure</td> <td>enable-named-pipes=true</td> <td>Sets the name of a Windows local group whose members are granted sufficient access by the MySQL server to use named-pipe clients. The default value is an empty string, which means that no Windows users are granted full access to the named pipe.</td> </tr><tr> <td>shared-memory</td> <td>N/A</td> <td>enable-shared-memory</td> <td>bool</td> <td>true, false</td> <td>false</td> <td>configure, reconfigure</td> <td>N/A</td> <td>Whether the server permits shared-memory connections.</td> </tr><tr> <td>shared-memory-base-name</td> <td>N/A</td> <td>shared-memory-name, shared-mem-name</td> <td>string</td> <td>N/A</td> <td>MYSQL</td> <td>configure, reconfigure</td> <td>shared-memory=true</td> <td>Name of the shared-memory connection used to communicate with the server.</td> </tr><tr> <td>password</td> <td>p</td> <td>pwd, root-password, passwd, rootpasswd</td> <td>string</td> <td>N/A</td> <td>N/A</td> <td>configure, reconfigure</td> <td>N/A</td> <td>The password assigned to the root user during a configuration or reconfiguration. The password can't be changed during a reconfiguration, although it is required to validate a connection to the server.</td> </tr><tr> <td>configure-as-service</td> <td>N/A</td> <td>as-windows-service, as-win-service</td> <td>bool</td> <td>true, false</td> <td>true</td> <td>configure, reconfigure</td> <td>N/A</td> <td>Configures the MySQL server to run as a Windows service. By default the Windows service runs using the Standard System Account (Network Service).</td> </tr><tr> <td>windows-service-name</td> <td>N/A</td> <td>service-name, win-service-name, servicename</td> <td>string</td> <td>N/A</td> <td>"MySQLxx" where <code class="literal">xx</code> corresponds to the server major and minor version.</td> <td>configure, reconfigure</td> <td>configure-as-service=true</td> <td>The name given to the Windows service used to run MySQL Server.</td> </tr><tr> <td>windows-service-auto-start</td> <td>N/A</td> <td>win-service-auto-start, service-auto-start, auto-start, autostart</td> <td>bool</td> <td>true, false</td> <td>true</td> <td>configure, reconfigure</td> <td>configure-as-service=true</td> <td>If configured as a Windows Service, this value sets the service to start automatically at system startup.</td> </tr><tr> <td>windows-service-user</td> <td>N/A</td> <td>win-service-user, service-user</td> <td>string</td> <td>N/A</td> <td>NT AUTHORITY</td> <td>configure, reconfigure</td> <td>configure-as-service=true</td> <td>The name of a Windows User Account used to run the Windows service.</td> </tr><tr> <td>windows-service-password</td> <td>N/A</td> <td>win-service-password, win-service-pwd, service-password, service-pwd, sapass</td> <td>string</td> <td>N/A</td> <td>"" (empty string)</td> <td>configure, reconfigure</td> <td>configure-as-service=true</td> <td>The password of the Windows User Account used to run the Windows Service.</td> </tr><tr> <td>server-file-permissions-access</td> <td>N/A</td> <td>server-file-access</td> <td>list</td> <td>FullAccess, Configure, Manual</td> <td>full-access</td> <td>configure, upgrade</td> <td>N/A</td> <td>Configures the user level access for the server files (data directory and any files inside that location).</td> </tr><tr> <td>server-file-full-control-list</td> <td>N/A</td> <td>full-control-list</td> <td>comma separated list</td> <td>windows users/groups</td> <td>user running the windows service (if applicable) and Administrators group</td> <td>configure, upgrade</td> <td>server-file-permissions-access=configure</td> <td>Defines a comma-separated list of users or groups to have full access to the server files.</td> </tr><tr> <td>server-file-no-access-list</td> <td>N/A</td> <td>no-access-list</td> <td>comma separated list</td> <td>windows users/groups</td> <td>empty</td> <td>configure, upgrade</td> <td>server-file-permissions-access=configure</td> <td>Defines a comma-separated list of users or groups to have access to the server files.</td> </tr><tr> <td>enable-error-log</td> <td>N/A</td> <td>enable-err-log</td> <td>bool</td> <td>true, false</td> <td>true</td> <td>configure, reconfigure</td> <td>N/A</td> <td>Enables the error log. The error log contains a record of mysqld startup and shutdown times. It also contains diagnostic messages such as errors, warnings, and notes that occur during server startup and shutdown; and while the server is running.</td> </tr><tr> <td>log-error</td> <td>N/A</td> <td>error-log, error-log-file, errorlogname</td> <td>Path/File name</td> <td>N/A</td> <td>{host_name}.err</td> <td>configure, reconfigure</td> <td>enable-error-log=true</td> <td>Defines the error log location. If a path is not provided, the location of the file is the data directory.</td> </tr><tr> <td>slow-query-log</td> <td>N/A</td> <td>enable-slow-log</td> <td>bool</td> <td>true, false</td> <td>false</td> <td>configure, reconfigure</td> <td>N/A</td> <td>Whether the slow query log is enabled.</td> </tr><tr> <td>slow-query-log-file</td> <td>N/A</td> <td>slow-log-file, slowlogname</td> <td>File name</td> <td>N/A</td> <td>{host_name}-slow.log</td> <td>configure, reconfigure</td> <td>slow-query-log=true</td> <td>The name of the slow query log file.</td> </tr><tr> <td>general-log</td> <td>N/A</td> <td>enable-general-log, generallog</td> <td>bool</td> <td>true, false</td> <td>false</td> <td>configure, reconfigure</td> <td>N/A</td> <td>Whether the general query log is enabled.</td> </tr><tr> <td>general-log-file</td> <td>N/A</td> <td>generallogname</td> <td>File name</td> <td>N/A</td> <td>{host_name}.log</td> <td>configure, reconfigure</td> <td>general-log=true</td> <td>The name of the general query log file.</td> </tr><tr> <td>enable-log-bin</td> <td>N/A</td> <td>enable-binary-log</td> <td>bool</td> <td>true, false</td> <td>true</td> <td>configure, reconfigure</td> <td>N/A</td> <td>Enables binary logging.</td> </tr><tr> <td>log-bin</td> <td>N/A</td> <td>binary-log</td> <td>File name</td> <td>N/A</td> <td>{host_name}-bin</td> <td>configure, reconfigure</td> <td>enable-log-bin=true</td> <td>Specifies the base name to use for binary log files. With binary logging enabled, the server logs all statements that change data to the binary log, which is used for backup and replication. The binary log is a sequence of files with a base name and numeric extension.</td> </tr><tr> <td>server-id</td> <td>N/A</td> <td>serverid</td> <td>number</td> <td>N/A</td> <td>1</td> <td>configure</td> <td>N/A</td> <td>For servers that are used in a replication topology, you must specify a unique server ID for each replication server in the range from 1 to 2^32 - 1. "Unique" means that each ID must be different from every other ID in use by any other source or replica servers in the replication topology.</td> </tr><tr> <td>lower-case-table-names</td> <td>N/A</td> <td>N/A</td> <td>list</td> <td>0, 1, 2</td> <td>1</td> <td>configure</td> <td>N/A</td> <td>If set to 0, table names are stored as specified and comparisons are case-sensitive. If set to 1, table names are stored in lowercase on disk and comparisons are not case-sensitive. If set to 2, table names are stored as given but compared in lowercase. This option also applies to database names and table aliases.</td> </tr><tr> <td>install-sample-database</td> <td>N/A</td> <td>install-example-database</td> <td>list</td> <td>All, Sakila, World, None</td> <td>none</td> <td>configure, reconfigure</td> <td>N/A</td> <td>Installs the specified sample databases.</td> </tr><tr> <td>uninstall-sample-database</td> <td>N/A</td> <td>uninstall-example-database</td> <td>list</td> <td>All, Sakila, World, None</td> <td>none</td> <td>configure, reconfigure</td> <td>N/A</td> <td>Uninstalls the specified sample databases.</td> </tr><tr> <td>old-instance-protocol</td> <td>N/A</td> <td>existing-instance-protocol</td> <td>list</td> <td>Socket, Sockets, Tcp, Pipe, NamedPipe, SharedMemory, Memory</td> <td>N/A</td> <td>tcp-ip</td> <td>upgrade</td> <td>The connection protocol used by the server instance that is being upgraded.</td> </tr><tr> <td>old-instance-port</td> <td>N/A</td> <td>existing-instance-port</td> <td>number</td> <td>N/A</td> <td>3306</td> <td>upgrade</td> <td>N/A</td> <td>The port number to use by the server instance that is being upgraded when listening for TCP/IP connections</td> </tr><tr> <td>old-instance-pipe-name</td> <td>N/A</td> <td>existing-instance-pipe-name</td> <td>string</td> <td>N/A</td> <td>MYSQL</td> <td>upgrade</td> <td>N/A</td> <td>Specifies the pipe name to use by the server instance that is being upgraded when listening for local connections that use a named pipe.</td> </tr><tr> <td>old-instance-memory-name</td> <td>N/A</td> <td>old-instance-shared-memory-name, existing-instance-memory-name, existing-instance-shared-memory-name</td> <td>string</td> <td>N/A</td> <td>MYSQL</td> <td>upgrade</td> <td>N/A</td> <td>The name of the shared-memory connection used by the server instance that is being upgraded to communicate with the server.</td> </tr><tr> <td>old-instance-password</td> <td>N/A</td> <td>old-instance-pwd, old-instance-root-password, existing-instance-password, existing-instance-pwd, existing-instance-pwd</td> <td>string</td> <td>N/A</td> <td>N/A</td> <td>upgrade</td> <td>N/A</td> <td>The password of the root user used by the server instance that is being upgraded.</td> </tr><tr> <td>backup-data</td> <td>N/A</td> <td>backup-data-directory</td> <td>bool</td> <td>true, false</td> <td>true</td> <td>upgrade</td> <td>N/A</td> <td>Creates a backup of the databases to ensure data can be restored in case of any failure.</td> </tr><tr> <td>keep-data-directory</td> <td>N/A</td> <td>keep-data</td> <td>bool</td> <td>true, false</td> <td>false</td> <td>remove</td> <td>N/A</td> <td>Prevents the data directory from being deleted when other configurations are removed.</td> </tr><tr> <td>defaults-extra-file</td> <td>N/A</td> <td>password-file, pass-file, pwd-file</td> <td>Path</td> <td>N/A</td> <td>N/A</td> <td>reconfigure, upgrade</td> <td>N/A</td> <td>The path and file name of the file containing the <code>password</code> entry that specifies the password of the root user.</td> </tr><tr> <td>windows-service-account-password-file</td> <td>N/A</td> <td>windows-service-account-password-file, win-service-account-pass-file, service-account-pwd-file, win-service-account-pwd-file, service-account-password-file</td> <td>Path</td> <td>N/A</td> <td>N/A</td> <td>configure, reconfigure</td> <td>N/A</td> <td>The path and file name of the file containing the <code>password</code> entry that specifies the password of the Windows service account user associated with the Windows Service that runs the server.</td> </tr></tbody></table>

##### MySQL User Management

The configure and reconfigure actions allow you to create and edit MySQL users as per the `--add-user` option:

* --add-user='user\_name':'password'|'file\_path'|'windows\_security\_token':host:role:authentication

  Only valid for the configure (not reconfigure) action.

The username, password, and token file path must be enclosed in single or double quotes. Escape single quotes, double quotes, and back slashes if present in the username or password.

Add user examples:

```
mysql_configurator.exe --console --action=configure --add-user='john':'mypass12%':%:"Db Admin":MYSQL
mysql_configurator.exe --console --action=configure --add-user='jenny':'jenny-T480\jenny':localhost:"Administrator":Windows
```

##### General Examples

A new configuration:

```
# Simple
mysql_configurator.exe --console --action=configure --password=test

# More complex
mysql_configurator.exe --console --action=configure --password=test --port=3320 --enable-pipe-names --pipe-name=MYSQL_PIPE --server-id=2 --install-sample-database=both

# More complex, also with users
mysql_configurator.exe --console --action=configure --password=other123 --add-user='john':'pa$$':"Db Admin":MYSQL --add-user='mary':'p4ssW0rd':"Administrator":MYSQL
```

A reconfiguration:

```
# Basic reconfiguration
mysql_configurator.exe --console --action=reconfigure --password=test --port=3310

# Complex reconfiguration
mysql_configurator.exe --console --action=reconfigure --password=test --enable-shared-memory=false
```

A removal:

```
mysql_configurator.exe --console --action=remove --keep-data-directory=true
```

An upgrade:

```
# Basic removal
mysql_configurator.exe --console --action=upgrade --old-instance-password=test

# Complex removal
mysql_configurator.exe --console --action=upgrade --old-instance-password=test --backup-data=false --server-file-permissions-access=full
```

##### Root Password Handling

There are multiple ways to pass in the root user password, depending on the needs in terms of security and simplicity. The different methods, in order of precedence:

1. Pass passwords as command-line arguments:

   Pass in the `--password` (for configuration and reconfiguration) or `--old-instance-password` (for upgrades) to the command line.

2. Set passwords in the `my.ini` MySQL configuration file:

   Having the entry "password={password\_here}" directly in the `my.ini` defines the root user password.

   Having the entry "password={password\_here}" in the extra configuration file (as per `--defaults-extra-file`) can define the root user password.

3. Defining passwords using environment variables:

   `MYSQL_PWD`: Similar to the MySQL client, the value defined in the `MYSQL_PWD` environment variable can define the root user password if no other method was used to define it. This variable applies to the configure, reconfigure, and upgrade actions.

   `WIN_SERVICE_ACCOUNT_PWD`: This environment variable can set the password of the Windows service account user that is configured to run the MySQL Windows Service if the server has been configured to run as a service. This variable applies to the configure and reconfigure actions.
