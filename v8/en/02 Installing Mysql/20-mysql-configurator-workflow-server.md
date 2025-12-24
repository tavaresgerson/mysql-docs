#### 2.3.2.1 MySQL Server Configuration with MySQL Configurator

MySQL Configurator performs the initial configuration, a reconfiguration, and also functions as part of the uninstallation process.

::: info Note

Full permissions are granted to the user executing MySQL Configurator to all generated files, such as `my.ini`. This does not apply to files and directories for specific products, such as the MySQL server data directory in `%ProgramData%` that is owned by `SYSTEM`.

:::

MySQL Configurator performs the configuration of the MySQL server. For example:

* It creates the configuration file (`my.ini`) that is used to configure the MySQL server. The values written to this file are influenced by choices you make during the installation process. Some definitions are host dependent.
* By default, a Windows service for the MySQL server is added.
* Provides default installation and data paths for MySQL server.
* It can optionally create MySQL server user accounts with configurable permissions based on general roles, such as DB Administrator, DB Designer, and Backup Admin.
* Checking Show Advanced Options enables additional Logging Options to be set. This includes defining custom file paths for the error log, general log, slow query log (including the configuration of seconds it requires to execute a query), and the binary log.

The sections that follow describe the server configuration options that apply to MySQL server on Windows. The server version you installed will determine which steps and options you can configure. Configuring MySQL server may include some or all of the steps.

##### 2.3.2.1.1 MySQL Server Installations

MySQL Configurator adds an upgrade option if it finds an existing MySQL Server installation is discovered. It offers two options:

::: info Note

This upgrade functionality was added in MySQL 8.3.0.

:::

*  In-Place Upgrade of an Existing MySQL Server Installation
*  Add a Separate MySQL Server Installation

###### In-Place Upgrade of an Existing MySQL Server Installation

This replaces the existing MySQL server installation as part of the upgrade process which may also upgrade the data schema. Upon success, the existing MySQL server installation is removed from the system.

::: info Note

The existing MySQL server instance must be running for the in-place upgrade option to function.

:::

While MySQL Configurator may attempt (and succeed) to perform an in-place upgrade for other scenarios, the following table lists the scenarios officially supported by the configurator:

**Table 2.5 Supported Upgrade Paths**

<table><thead><tr> <th scope="col">A supported upgrade scenario</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <td>8.0.35+ to 8.1</td> <td>From 8.0.35 or higher to the first MySQL 8 Innovation release.</td> </tr><tr> <td>8.0.35+ to 8.4</td> <td>From 8.0.35 or higher to the MySQL next LTS release.</td> </tr><tr> <td>8.X to 8.Y where Y = X + 1</td> <td>From an Innovation release to the next consecutive Innovation release.</td> </tr><tr> <td>8.3 to 8.4</td> <td>From the last MySQL 8 Innovation release to the next MySQL 8 LTS release.</td> </tr><tr> <td>8.4.X to 8.4.Y where Y &gt; X</td> <td>From within the same LTS release.</td> </tr><tr> <td>8.4.X to 9.0.0</td> <td>From an LTS release to the first consecutive Innovation release.</td> </tr><tr> <td>8.4 to 9.7</td> <td>From an LTS release to the next consecutive LTS release.</td> </tr></tbody></table>

This dialogue prompts for the protocol (default: `TCP/IP`), port (default: `3306`), and root password for the existing installation. Execute connect and then review and confirm the MySQL instance's information (such as version, paths, and configuration file) before proceeding with the upgrade.

This upgrade may replace the file paths. For example, "MySQL Server 8.2 Data" changes to "MySQL Server 8.3 Data" when upgrading 8.2 to 8.3.

This upgrade functionality also provides these additional options: "Backup Data" allows running `mysqldump` before performing the upgrade, and "Server File Permissions" to optionally customize file permissions.

###### Add a Separate MySQL Server Installation

Configure a standard side-by-side installation with the new MySQL server installation. This means having multiple MySQL server installations installed and running on the system.

##### 2.3.2.1.2 Type and Networking

* Server Configuration Type

  Choose the MySQL server configuration type that describes your setup. This setting defines the amount of system resources (memory) to assign to your MySQL server instance.

  + **Development**: A computer that hosts many other applications, and typically this is your personal workstation. This setting configures MySQL to use the least amount of memory.
  + **Server**: Several other applications are expected to run on this computer, such as a web server. The Server setting configures MySQL to use a medium amount of memory.
  + **Dedicated**: A computer that is dedicated to running the MySQL server. Because no other major applications run on this server, this setting configures MySQL to use the majority of available memory.
  + **Manual**: Prevents MySQL Configurator from attempting to optimize the server installation, and instead, sets the default values to the server variables included in the `my.ini` configuration file. With the `Manual` type selected, MySQL Configurator uses the default value of 16M for the `tmp_table_size` variable assignment.
* Connectivity

  Connectivity options control how the connection to MySQL is made. Options include:

  + `TCP/IP`: This option is selected by default. You may disable `TCP/IP` Networking to permit local host connections only. With the `TCP/IP` connection option selected, you can modify the following items:

    - Port for classic MySQL protocol connections. The default value is `3306`.
    - X Protocol Port defaults to `33060`
    - Open Windows Firewall port for network access, which is selected by default for `TCP/IP` connections.

    If a port number is in use already, you will see the error icon (![](images/mi-info-symbol.png)) next to the default value and Next is disabled until you provide a new port number.
  + Named Pipe: Enable and define the pipe name, similar to setting the `named_pipe` system variable. The default name is `MySQL`.

    When you select Named Pipe connectivity, and then proceed to the next step, you are prompted to set the level of access control granted to client software on named-pipe connections. Some clients require only minimum access control for communication, while other clients require full access to the named pipe.

    You can set the level of access control based on the Windows user (or users) running the client as follows:

    - **Minimum access to all users (RECOMMENDED).** This level is enabled by default because it is the most secure.
    - **Full access to members of a local group.** If the minimum-access option is too restrictive for the client software, use this option to reduce the number of users who have full access on the named pipe. The group must be established on Windows before you can select it from the list. Membership in this group should be limited and managed. Windows requires a newly added member to first log out and then log in again to join a local group.
    - **Full access to all users (NOT RECOMMENDED).** This option is less secure and should be set only when other safeguards are implemented.
  + Shared Memory: Enable and define the memory name, similar to setting the `shared_memory` system variable. The default name is `MySQL`.
* Advanced Configuration

  Check Show Advanced and Logging Options to set custom logging and advanced options in later steps. The Logging Options step enables you to define custom file paths for the error log, general log, slow query log (including the configuration of seconds it requires to execute a query), and the binary log. The Advanced Options step enables you to set the unique server ID required when binary logging is enabled in a replication topology.
* MySQL Enterprise Firewall (Enterprise Edition only)

  The Enable MySQL Enterprise Firewall check box is deselected by default. Select this option to enable a security list that offers protection against certain types of attacks. Additional post-installation configuration is required (see  Section 8.4.7, “MySQL Enterprise Firewall”).

##### 2.3.2.1.3 Accounts and Roles

* Root Account Password

  Assigning a root password is required and you will be asked for it when reconfiguring with MySQL Configurator in the future. Password strength is evaluated when you repeat the password in the box provided. For descriptive information regarding password requirements or status, move your mouse pointer over the information icon (![](images/mi-info-symbol.png)) when it appears.
* MySQL User Accounts (Optional)

  Click Add User or Edit User to create or modify MySQL user accounts with predefined roles. Next, enter the required account credentials:

  + User Name: MySQL user names can be up to 32 characters long.
  + Host: Select `localhost` for local connections only or `<All Hosts (%)>` when remote connections to the server are required.
  + Role: Each predefined role, such as `DB Admin`, is configured with its own set of privileges. For example, the `DB Admin` role has more privileges than the `DB Designer` role. The Role drop-down list contains a description of each role.
  + Password: Password strength assessment is performed while you type the password. Passwords must be confirmed. MySQL permits a blank or empty password (considered to be insecure).

  **MySQL Configurator Commercial Release Only:** MySQL Enterprise Edition for Windows, a commercial product, also supports an authentication method that performs external authentication on Windows. Accounts authenticated by the Windows operating system can access the MySQL server without providing an additional password.

  To create a new MySQL account that uses Windows authentication, enter the user name and then select a value for Host and Role. Click Windows authentication to enable the `authentication_windows` plugin. In the Windows Security Tokens area, enter a token for each Windows user (or group) who can authenticate with the MySQL user name. MySQL accounts can include security tokens for both local Windows users and Windows users that belong to a domain. Multiple security tokens are separated by the semicolon character (`;`) and use the following format for local and domain accounts:

  + Local account

    Enter the simple Windows user name as the security token for each local user or group; for example, `finley;jeffrey;admin`.
  + Domain account

    Use standard Windows syntax (*`domain`*`\`*`domainuser`*) or MySQL syntax (*`domain`*`\\`*`domainuser`*) to enter Windows domain users and groups.

    For domain accounts, you may need to use the credentials of an administrator within the domain if the account running MySQL Configurator lacks the permissions to query the Active Directory. If this is the case, select Validate Active Directory users with to activate the domain administrator credentials.

  Windows authentication permits you to test all of the security tokens each time you add or modify a token. Click Test Security Tokens to validate (or revalidate) each token. Invalid tokens generate a descriptive error message along with a red `X` icon and red token text. When all tokens resolve as valid (green text without an `X` icon), you can click OK to save the changes.

##### 2.3.2.1.4 Windows Service

On the Windows platform, MySQL server can run as a named service managed by the operating system and be configured to start up automatically when Windows starts. Alternatively, you can configure MySQL server to run as an executable program that requires manual configuration.

* Configure MySQL server as a Windows service (Selected by default.)

  When the default configuration option is selected, you can also select the following:

  + Windows Service Name

    Defaults to MySQL*`XY`* where XY is 81 for MySQL 8.1.
  + Start the MySQL Server at System Startup

    When selected (default), the service startup type is set to Automatic; otherwise, the startup type is set to Manual.
  + Run Windows Service as

    When Standard System Account is selected (default), the service logs on as Network Service.

    The Custom User option must have privileges to log on to Microsoft Windows as a service. The Next button will be disabled until this user is configured with the required privileges.

    A custom user account is configured in Windows by searching for "local security policy" in the Start menu. In the Local Security Policy window, select Local Policies, User Rights Assignment, and then Log On As A Service to open the property dialog. Click Add User or Group to add the custom user and then click OK in each dialog to save the changes.

##### 2.3.2.1.5 Server File Permissions

Optionally, permissions set on the folders and files located at `C:\ProgramData\MySQL\MySQL Server X.Y\Data` can be managed during the server configuration operation. You have the following options:

* MySQL Configurator can configure the folders and files with full control granted exclusively to the user running the Windows service, if applicable, and to the Administrators group.

  All other groups and users are denied access. This is the default option.
* Have MySQL Configurator use a configuration option similar to the one just described, but also have MySQL Configurator show which users could have full control.

  You are then able to decide if a group or user should be given full control. If not, you can move the qualified members from this list to a second list that restricts all access.
* Have MySQL Configurator skip making file-permission changes during the configuration operation.

  If you select this option, you are responsible for securing the `Data` folder and its related files manually after the server configuration finishes.

##### 2.3.2.1.6 Logging Options

This step is available if the Show Advanced Configuration check box was selected during the Type and Networking step. To enable this step now, click Back to return to the Type and Networking step and select the check box.

Advanced configuration options are related to the following MySQL log files:

*  Error Log
*  General Log
*  Slow Query Log
*  Binary Log

##### 2.3.2.1.7 Advanced Options

This step is available if the Show Advanced Configuration check box was selected during the Type and Networking step. To enable this step now, click Back to return to the Type and Networking step and select the check box.

The advanced-configuration options include:

* Server ID

  Set the unique identifier used in a replication topology. If binary logging is enabled, you must specify a server ID. The default ID value depends on the server version. For more information, see the description of the `server_id` system variable.
* Table Names Case

  These options only apply to the initial configuration of the MySQL server.

  + Lower Case

    Sets the `lower_case_table_names` option value to 1 (default), in which table names are stored in lowercase on disk and comparisons are not case-sensitive.
  + Preserve Given Case

    Sets the `lower_case_table_names` option value to 2, in which table names are stored as given but compared in lowercase.

##### 2.3.2.1.8 Sample Databases

Optionally install sample databases that include test data to help develop applications with MySQL. The options include the sakila and world databases.

##### 2.3.2.1.9 Apply Configuration

All configuration settings are applied to the MySQL server when you click Execute. Use the Configuration Steps tab to follow the progress of each action; the icon for each toggles from white to green (with a check mark) on success. Otherwise, the process stops and displays an error message if an individual action times out. Click the Log tab to view the log.
