#### 8.4.1.7 Kerberos Pluggable Authentication

Note

Kerberos pluggable authentication is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

MySQL Enterprise Edition supports an authentication method that enables users to authenticate to MySQL Server using Kerberos, provided that appropriate Kerberos tickets are available or can be obtained.

This authentication method is available in MySQL 9.5 for MySQL servers and clients on Linux. It is useful in Linux environments where applications have access to Microsoft Active Directory, which has Kerberos enabled by default. The client-side plugin is supported on Windows as well. The server-side plugin is still supported only on Linux.

Kerberos pluggable authentication provides these capabilities:

* External authentication: Kerberos authentication enables MySQL Server to accept connections from users defined outside the MySQL grant tables who have obtained the proper Kerberos tickets.

* Security: Kerberos uses tickets together with symmetric-key cryptography, enabling authentication without sending passwords over the network. Kerberos authentication supports userless and passwordless scenarios.

The following table shows the plugin and library file names. The file name suffix might differ on your system. The file must be located in the directory named by the `plugin_dir` system variable. For installation information, see Installing Kerberos Pluggable Authentication.

**Table 8.22 Plugin and Library Names for Kerberos Authentication**

<table summary="Names for the plugins and library file used for Kerberos authentication."><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code class="literal">authentication_kerberos</code></td> </tr><tr> <td>Client-side plugin</td> <td><code class="literal">authentication_kerberos_client</code></td> </tr><tr> <td>Library file</td> <td><code class="filename">authentication_kerberos.so</code>, <code class="filename">authentication_kerberos_client.so</code></td> </tr></tbody></table>

The server-side Kerberos authentication plugin is included only in MySQL Enterprise Edition. It is not included in MySQL community distributions. The client-side plugin is included in all distributions, including community distributions. This enables clients from any distribution to connect to a server that has the server-side plugin loaded.

The following sections provide installation and usage information specific to Kerberos pluggable authentication:

* Prerequisites for Kerberos Pluggable Authentication
* How Kerberos Authentication of MySQL Users Works
* Installing Kerberos Pluggable Authentication
* Using Kerberos Pluggable Authentication
* Kerberos Authentication Debugging

For general information about pluggable authentication in MySQL, see Section 8.2.17, “Pluggable Authentication”.

##### Prerequisites for Kerberos Pluggable Authentication

To use Kerberos pluggable authentication for MySQL, these prerequisites must be satisfied:

* A Kerberos service must be available for the Kerberos authentication plugins to communicate with.

* Each Kerberos user (principal) to be authenticated by MySQL must be present in the database managed by the KDC server.

* A Kerberos client library must be available on systems where either the server-side or client-side Kerberos authentication plugin is used. In addition, GSSAPI is used as the interface for accessing Kerberos authentication, so a GSSAPI library must be available.

##### How Kerberos Authentication of MySQL Users Works

This section provides an overview of how MySQL and Kerberos work together to authenticate MySQL users. For examples showing how to set up MySQL accounts to use the Kerberos authentication plugins, see Using Kerberos Pluggable Authentication.

Familiarity is assumed here with Kerberos concepts and operation. The following list briefly defines several common Kerberos terms. You may also find the Glossary section of [RFC 4120](https://tools.ietf.org/html/rfc4120) helpful.

* Principal: A named entity, such as a user or server. In this discussion, certain principal-related terms occur frequently:

  + SPN: Service principal name; the name of a principal that represents a service.

  + UPN: User principal name; the name of a principal that represents a user.

* KDC: The key distribution center, comprising the AS and TGS:

  + AS: The authentication server; provides the initial ticket-granting ticket needed to obtain additional tickets.

  + TGS: The ticket-granting server; provides additional tickets to Kerberos clients that possess a valid TGT.

* TGT: The ticket-granting ticket; presented to the TGS to obtain service tickets for service access.

* ST: A service ticket; provides access to a service such as that offered by a MySQL server.

Authentication using Kerberos requires a KDC server, for example, as provided by Microsoft Active Directory.

Kerberos authentication in MySQL uses Generic Security Service Application Program Interface (GSSAPI), which is a security abstraction interface. Kerberos is an instance of a specific security protocol that can be used through that abstract interface. Using GSSAPI, applications authenticate to Kerberos to obtain service credentials, then use those credentials in turn to enable secure access to other services.

On Windows, the `authentication_kerberos_client` authentication plugin supports two modes, which the client user can set at runtime or specify in an option file:

* `SSPI` mode: Security Support Provider Interface (SSPI) implements GSSAPI (see Commands for Windows Clients in SSPI Mode). SSPI, while being compatible with GSSAPI at the wire level, only supports the Windows single sign-on scenario and specifically refers to the logged-on user. SSPI is the default mode on most Windows clients.

* `GSSAPI` mode: Supports GSSAPI through the MIT Kerberos library on Windows (see Commands for Windows Clients in GSSAPI Mode).

With the Kerberos authentication plugins, applications and MySQL servers are able to use the Kerberos authentication protocol to mutually authenticate users and MySQL services. This way both the user and the server are able to verify each other's identity. No passwords are sent over the network and Kerberos protocol messages are protected against eavesdropping and replay attacks.

Kerberos authentication follows these steps, where the server-side and client-side parts are performed using the `authentication_kerberos` and `authentication_kerberos_client` authentication plugins, respectively:

1. The MySQL server sends to the client application its service principal name. This SPN must be registered in the Kerberos system, and is configured on the server side using the `authentication_kerberos_service_principal` system variable.

2. Using GSSAPI, the client application creates a Kerberos client-side authentication session and exchanges Kerberos messages with the Kerberos KDC:

   * The client obtains a ticket-granting ticket from the authentication server.

   * Using the TGT, the client obtains a service ticket for MySQL from the ticket-granting service.

   This step can be skipped or partially skipped if the TGT, ST, or both are already cached locally. The client optionally may use a client keytab file to obtain a TGT and ST without supplying a password.

3. Using GSSAPI, the client application presents the MySQL ST to the MySQL server.

4. Using GSSAPI, the MySQL server creates a Kerberos server-side authentication session. The server validates the user identity and the validity of the user request. It authenticates the ST using the service key configured in its service keytab file to determine whether authentication succeeds or fails, and returns the authentication result to the client.

Applications are able to authenticate using a provided user name and password, or using a locally cached TGT or ST (for example, created using **kinit** or similar). This design therefore covers use cases ranging from completely userless and passwordless connections, where Kerberos service tickets are obtained from a locally stored Kerberos cache, to connections where both user name and password are provided and used to obtain a valid Kerberos service ticket from a KDC, to send to the MySQL server.

As indicated in the preceding description, MySQL Kerberos authentication uses two kinds of keytab files:

* On the client host, a client keytab file may be used to obtain a TGT and ST without supplying a password. See Client Configuration Parameters for Kerberos Authentication.

* On the MySQL server host, a server-side service keytab file is used to verify service tickets received by the MySQL server from clients. The keytab file name is configured using the `authentication_kerberos_service_key_tab` system variable.

For information about keytab files, see <https://web.mit.edu/kerberos/krb5-latest/doc/basic/keytab_def.html>.

##### Installing Kerberos Pluggable Authentication

This section describes how to install the server-side Kerberos authentication plugin. For general information about installing plugins, see Section 7.6.1, “Installing and Uninstalling Plugins”.

Note

The server-side plugin is supported only on Linux systems. On Windows systems, only the client-side plugin is supported, which can be used on a Windows system to connect to a Linux server that uses Kerberos authentication.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

The server-side plugin library file base name is `authentication_kerberos`. The file name suffix for Unix and Unix-like systems is `.so`.

To load the plugin at server startup, use the `--plugin-load-add` option to name the library file that contains it. With this plugin-loading method, the option must be given each time the server starts. Also, specify values for any plugin-provided system variables you wish to configure. The plugin exposes these system variables, enabling its operation to be configured:

* `authentication_kerberos_service_principal`: The MySQL service principal name (SPN). This name is sent to clients that attempt to authenticate using Kerberos. The SPN must be present in the database managed by the KDC server. The default is `mysql/host_name@realm_name`.

* `authentication_kerberos_service_key_tab`: The keytab file for authenticating tickets received from clients. This file must exist and contain a valid key for the SPN or authentication of clients will fail. The default is `mysql.keytab` in the data directory.

For details about all Kerberos authentication system variables, see Section 8.4.1.13, “Pluggable Authentication System Variables”.

To load the plugin and configure it, put lines such as these in your `my.cnf` file, using values for the system variables that are appropriate for your installation:

```
[mysqld]
plugin-load-add=authentication_kerberos.so
authentication_kerberos_service_principal=mysql/krbauth.example.com@MYSQL.LOCAL
authentication_kerberos_service_key_tab=/var/mysql/data/mysql.keytab
```

After modifying `my.cnf`, restart the server to cause the new settings to take effect.

Alternatively, to load the plugin at runtime, use this statement:

```
INSTALL PLUGIN authentication_kerberos
  SONAME 'authentication_kerberos.so';
```

`INSTALL PLUGIN` loads the plugin immediately, and also registers it in the `mysql.plugins` system table to cause the server to load it for each subsequent normal startup without the need for `--plugin-load-add`.

When you install the plugin at runtime without configuring its system variables in the `my.cnf` file, the system variable `authentication_kerberos_service_key_tab` is set to the default value of `mysql.keytab` in the data directory. The value of this system variable cannot be changed at runtime, so if you need to specify a different file, you need to add the setting to your `my.cnf` file then restart the MySQL server. For example:

```
[mysqld]
authentication_kerberos_service_key_tab=/var/mysql/data/mysql.keytab
```

If the keytab file is not in the correct place or does not contain a valid SPN key, the MySQL server does not validate this, but clients return authentication errors until you fix the issue.

The `authentication_kerberos_service_principal` system variable can be set and persisted at runtime without restarting the server, by using a `SET PERSIST` statement:

```
SET PERSIST authentication_kerberos_service_principal='mysql/krbauth.example.com@MYSQL.LOCAL';
```

`SET PERSIST` sets a value for the running MySQL instance. It also saves the value, causing it to carry over to subsequent server restarts. To change a value for the running MySQL instance without having it carry over to subsequent restarts, use the `GLOBAL` keyword rather than `PERSIST`. See Section 15.7.6.1, “SET Syntax for Variable Assignment”.

To verify plugin installation, examine the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 7.6.2, “Obtaining Server Plugin Information”). For example:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME = 'authentication_kerberos';
+-------------------------+---------------+
| PLUGIN_NAME             | PLUGIN_STATUS |
+-------------------------+---------------+
| authentication_kerberos | ACTIVE        |
+-------------------------+---------------+
```

If a plugin fails to initialize, check the server error log for diagnostic messages.

To associate MySQL accounts with the Kerberos plugin, see Using Kerberos Pluggable Authentication.

##### Using Kerberos Pluggable Authentication

This section describes how to enable MySQL accounts to connect to the MySQL server using Kerberos pluggable authentication. It is assumed that the server is running with the server-side plugin enabled, as described in Installing Kerberos Pluggable Authentication, and that the client-side plugin is available on the client host.

* Verify Kerberos Availability
* Create a MySQL Account That Uses Kerberos Authentication
* Use the MySQL Account to Connect to the MySQL Server
* Client Configuration Parameters for Kerberos Authentication

###### Verify Kerberos Availability

The following example shows how to test availability of Kerberos in Active Directory. The example makes these assumptions:

* Active Directory is running on the host named `krbauth.example.com` with IP address `198.51.100.11`.

* MySQL-related Kerberos authentication uses the `MYSQL.LOCAL` domain, and also uses `MYSQL.LOCAL` as the realm name.

* A principal named `karl@MYSQL.LOCAL` is registered with the KDC. (In later discussion, this principal name is associated with the MySQL account that authenticates to the MySQL server using Kerberos.)

With those assumptions satisfied, follow this procedure:

1. Verify that the Kerberos library is installed and configured correctly in the operating system. For example, to configure a `MYSQL.LOCAL` domain and realm for use during MySQL authentication, the `/etc/krb5.conf` Kerberos configuration file should contain something like this:

   ```
   [realms]
     MYSQL.LOCAL = {
       kdc = krbauth.example.com
       admin_server = krbauth.example.com
       default_domain = MYSQL.LOCAL
     }
   ```

2. You may need to add an entry to `/etc/hosts` for the server host:

   ```
   198.51.100.11 krbauth krbauth.example.com
   ```

3. Check whether Kerberos authentication works correctly:

   1. Use **kinit** to authenticate to Kerberos:

      ```
      $> kinit karl@MYSQL.LOCAL
      Password for karl@MYSQL.LOCAL: (enter password here)
      ```

      The command authenticates for the Kerberos principal named `karl@MYSQL.LOCAL`. Enter the principal's password when the command prompts for it. The KDC returns a TGT that is cached on the client side for use by other Kerberos-aware applications.

   2. Use **klist** to check whether the TGT was obtained correctly. The output should be similar to this:

      ```
      $> klist
      Ticket cache: FILE:/tmp/krb5cc_244306
      Default principal: karl@MYSQL.LOCAL

      Valid starting       Expires              Service principal
      03/23/2021 08:18:33  03/23/2021 18:18:33  krbtgt/MYSQL.LOCAL@MYSQL.LOCAL
      ```

###### Create a MySQL Account That Uses Kerberos Authentication

MySQL authentication using the `authentication_kerberos` authentication plugin is based on a Kerberos user principal name (UPN). The instructions here assume that a MySQL user named `karl` authenticates to MySQL using Kerberos, that the Kerberos realm is named `MYSQL.LOCAL`, and that the user principal name is `karl@MYSQL.LOCAL`. This UPN must be registered in several places:

* The Kerberos administrator should register the user name as a Kerberos principal. This name includes a realm name. Clients use the principal name and password to authenticate with Kerberos and obtain a ticket-granting ticket (TGT).

* The MySQL DBA should create an account that corresponds to the Kerberos principal name and that authenticates using the Kerberos plugin.

Assume that the Kerberos user principal name has been registered by the appropriate service administrator, and that, as previously described in Installing Kerberos Pluggable Authentication, the MySQL server has been started with appropriate configuration settings for the server-side Kerberos plugin. To create a MySQL account that corresponds to a Kerberos UPN of `user@realm_name`, the MySQL DBA uses a statement like this:

```
CREATE USER user
  IDENTIFIED WITH authentication_kerberos
  BY 'realm_name';
```

The account named by *`user`* can include or omit the host name part. If the host name is omitted, it defaults to `%` as usual. The *`realm_name`* is stored as the `authentication_string` value for the account in the `mysql.user` system table.

To create a MySQL account that corresponds to the UPN `karl@MYSQL.LOCAL`, use this statement:

```
CREATE USER 'karl'
  IDENTIFIED WITH authentication_kerberos
  BY 'MYSQL.LOCAL';
```

If MySQL must construct the UPN for this account, for example, to obtain or validate tickets (TGTs or STs), it does so by combining the account name (ignoring any host name part) and the realm name. For example, the full account name resulting from the preceding `CREATE USER` statement is `'karl'@'%'`. MySQL constructs the UPN from the user name part `karl` (ignoring the host name part) and the realm name `MYSQL.LOCAL` to produce `karl@MYSQL.LOCAL`.

Note

Observe that when creating an account that authenticates using `authentication_kerberos`, the `CREATE USER` statement does not include the UPN realm as part of the user name. Instead, specify the realm (`MYSQL.LOCAL` in this case) as the authentication string in the `BY` clause. This differs from creating accounts that use the `authentication_ldap_sasl` SASL LDAP authentication plugin with the GSSAPI/Kerberos authentication method. For such accounts, the `CREATE USER` statement does include the UPN realm as part of the user name. See Create a MySQL Account That Uses GSSAPI/Kerberos for LDAP Authentication.

With the account set up, clients can use it to connect to the MySQL server. The procedure depends on whether the client host runs Linux or Windows, as indicated in the following discussion.

Use of `authentication_kerberos` is subject to the restriction that UPNs with the same user part but a different realm part are not supported. For example, you cannot create MySQL accounts that correspond to both these UPNs:

```
kate@MYSQL.LOCAL
kate@EXAMPLE.COM
```

Both UPNs have a user part of `kate` but differ in the realm part (`MYSQL.LOCAL` versus `EXAMPLE.COM`). This is disallowed.

###### Use the MySQL Account to Connect to the MySQL Server

After a MySQL account that authenticates using Kerberos has been set up, clients can use it to connect to the MySQL server as follows:

1. Authenticate to Kerberos with the user principal name (UPN) and its password to obtain a ticket-granting ticket (TGT).

2. Use the TGT to obtain a service ticket (ST) for MySQL.
3. Authenticate to the MySQL server by presenting the MySQL ST.

The first step (authenticating to Kerberos) can be performed various ways:

* Prior to connecting to MySQL:

  + On Linux or on Windows in `GSSAPI` mode, invoke **kinit** to obtain the TGT and save it in the Kerberos credentials cache.

  + On Windows in `SSPI` mode, authentication may already have been done at login time, which saves the TGT for the logged-in user in the Windows in-memory cache. **kinit** is not used and there is no Kerberos cache.

* When connecting to MySQL, the client program itself can obtain the TGT, if it can determine the required Kerberos UPN and password:

  + That information can come from sources such as command options or the operating system.

  + On Linux, clients also can use a keytab file or the `/etc/krb5.conf` configuration file. Windows clients in `GSSAPI` mode use a configuration file. Windows clients in `SSPI` mode use neither.

Details of the client commands for connecting to the MySQL server differ for Linux and Windows, so each host type is discussed separately, but these command properties apply regardless of host type:

* Each command shown includes the following options, but each one may be omitted under certain conditions:

  + The `--default-auth` option specifies the name of the client-side authentication plugin (`authentication_kerberos_client`). This option may be omitted when the `--user` option is specified because in that case MySQL can determine the plugin from the user account information sent by MySQL server.

  + The `--plugin-dir` option indicates to the client program the location of the `authentication_kerberos_client` plugin. This option may be omitted if the plugin is installed in the default (compiled-in) location.

* Commands should also include any other options such as `--host` or `--port` that are required to specify which MySQL server to connect to.

* Enter each command on a single line. If the command includes a `--password` option to solicit a password, enter the password of the Kerberos UPN associated with the MySQL user when prompted.

**Connection Commands for Linux Clients**

On Linux, the appropriate client command for connecting to the MySQL server varies depending on whether the command authenticates using a TGT from the Kerberos cache, or based on command options for the MySQL user name and the UPN password:

* Prior to invoking the MySQL client program, the client user can obtain a TGT from the KDC independently of MySQL. For example, the client user can use **kinit** to authenticate to Kerberos by providing a Kerberos user principal name and the principal password:

  ```
  $> kinit karl@MYSQL.LOCAL
  Password for karl@MYSQL.LOCAL: (enter password here)
  ```

  The resulting TGT for the UPN is cached and becomes available for use by other Kerberos-aware applications, such as programs that use the client-side Kerberos authentication plugin. In this case, invoke the client without specifying a user-name or password option:

  ```
  mysql
    --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
  ```

  The client-side plugin finds the TGT in the cache, uses it to obtain a MySQL ST, and uses the ST to authenticate to the MySQL server.

  As just described, when the TGT for the UPN is cached, user-name and password options are not needed in the client command. If the command includes them anyway, they are handled as follows:

  + This command includes a user-name option:

    ```
    mysql
      --default-auth=authentication_kerberos_client
      --plugin-dir=path/to/plugin/directory
      --user=karl
    ```

    In this case, authentication fails if the user name specified by the option does not match the user name part of the UPN in the TGT.

  + This command includes a password option, which you enter when prompted:

    ```
    mysql
      --default-auth=authentication_kerberos_client
      --plugin-dir=path/to/plugin/directory
      --password
    ```

    In this case, the client-side plugin ignores the password. Because authentication is based on the TGT, it can succeed *even if the user-provided password is incorrect*. For this reason, the plugin produces a warning if a valid TGT is found that causes a password to be ignored.

* If the Kerberos cache contains no TGT, the client-side Kerberos authentication plugin itself can obtain the TGT from the KDC. Invoke the client with options for the MySQL user name and the password, then enter the UPN password when prompted:

  ```
  mysql --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --user=karl
    --password
  ```

  The client-side Kerberos authentication plugin combines the user name (`karl`) and the realm specified in the user account (`MYSQL.LOCAL`) to construct the UPN (`karl@MYSQL.LOCAL`). The client-side plugin uses the UPN and password to obtain a TGT, uses the TGT to obtain a MySQL ST, and uses the ST to authenticate to the MySQL server.

  Or, suppose that the Kerberos cache contains no TGT and the command specifies a password option but no user-name option:

  ```
  mysql --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --password
  ```

  The client-side Kerberos authentication plugin uses the operating system login name as the MySQL user name. It combines that user name and the realm in the user' MySQL account to construct the UPN. The client-side plugin uses the UPN and the password to obtain a TGT, uses the TGT to obtain a MySQL ST, and uses the ST to authenticate to the MySQL server.

If you are uncertain whether a TGT exists, you can use **klist** to check.

Note

When the client-side Kerberos authentication plugin itself obtains the TGT, the client user may not want the TGT to be reused. As described in Client Configuration Parameters for Kerberos Authentication, the local `/etc/krb5.conf` file can be used to cause the client-side plugin to destroy the TGT when done with it.

**Connection Commands for Windows Clients in SSPI Mode**

On Windows, using the default client-side plugin option (SSPI), the appropriate client command for connecting to the MySQL server varies depending on whether the command authenticates based on command options for the MySQL user name and the UPN password, or instead uses a TGT from the Windows in-memory cache. For details about GSSAPI mode on Windows, see Commands for Windows Clients in GSSAPI Mode.

A command can explicitly specify options for the MySQL user name and the UPN password, or the command can omit those options:

* This command includes options for the MySQL user name and UPN password:

  ```
  mysql --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --user=karl
    --password
  ```

  The client-side Kerberos authentication plugin combines the user name (`karl`) and the realm specified in the user account (`MYSQL.LOCAL`) to construct the UPN (`karl@MYSQL.LOCAL`). The client-side plugin uses the UPN and password to obtain a TGT, uses the TGT to obtain a MySQL ST, and uses the ST to authenticate to the MySQL server.

  Any information in the Windows in-memory cache is ignored; the user-name and password option values take precedence.

* This command includes an option for the UPN password but not for the MySQL user name:

  ```
  mysql
    --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --password
  ```

  The client-side Kerberos authentication plugin uses the logged-in user name as the MySQL user name and combines that user name and the realm in the user's MySQL account to construct the UPN. The client-side plugin uses the UPN and the password to obtain a TGT, uses the TGT to obtain a MySQL ST, and uses the ST to authenticate to the MySQL server.

* This command includes no options for the MySQL user name or UPN password:

  ```
  mysql
    --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
  ```

  The client-side plugin obtains the TGT from the Windows in-memory cache, uses the TGT to obtain a MySQL ST, and uses the ST to authenticate to the MySQL server.

  This approach requires the client host to be part of the Windows Server Active Directory (AD) domain. If that is not the case, help the MySQL client discover the IP address for the AD domain by manually entering the AD server and realm as the DNS server and prefix:

  1. Start `console.exe` and select Network and Sharing Center.

  2. From the sidebar of the Network and Sharing Center window, select Change adapter settings.

  3. In the Network Connections window, right-click the network or VPN connection to configure and select Properties.

  4. From the Network tab, locate and click Internet Protocol Version 4 (TCP/IPv4), and then click Properties.

  5. Click Advanced in the Internet Protocol Version 4 (TCP/IPv4) Properties dialog. The Advanced TCP/IP Settings dialog opens.

  6. From the DNS tab, add the Active Directory server and realm as a DNS server and prefix.

* This command includes an option for the MySQL user name but not for the UPN password:

  ```
  mysql
    --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --user=karl
  ```

  The client-side Kerberos authentication plugin compares the name specified by the user-name option against the logged-in user name. If the names are the same, the plugin uses the logged-in user TGT for authentication. If the names differ, authentication fails.

**Connection Commands for Windows Clients in GSSAPI Mode**

On Windows, the client user must specify `GSSAPI` mode explicitly using the `plugin_authentication_kerberos_client_mode` plugin option to enable support through the MIT Kerberos library. The default mode is `SSPI` (see Commands for Windows Clients in SSPI Mode).

It is possible to specify `GSSAPI` mode:

* Prior to invoking the MySQL client program in an option file. The plugin variable name is valid using either underscores or dashes:

  ```
  [mysql]
  plugin_authentication_kerberos_client_mode=GSSAPI
  ```

  Or:

  ```
  [mysql]
  plugin-authentication-kerberos-client-mode=GSSAPI
  ```

* At runtime from the command line using the **mysql** or **mysqldump** client programs. For example, the following commands (with underscores or dashes) causes **mysql** to connect to the server through the MIT Kerberos library on Windows.

  ```
  mysql [connection-options] --plugin_authentication_kerberos_client_mode=GSSAPI
  ```

  Or:

  ```
  mysql [connection-options] --plugin-authentication-kerberos-client-mode=GSSAPI
  ```

* Client users can select `GSSAPI` mode from MySQL Workbench and some MySQL connectors. On client hosts running Windows, you can override the default location of:

  + The Kerberos configuration file by setting the `KRB5_CONFIG` environment variable.

  + The default credential cache name with the `KRB5CCNAME` environment variable (for example, `KRB5CCNAME=DIR:/mydir/`).

  For specific client-side plugin information, see the documentation at https://dev.mysql.com/doc/.

The appropriate client command for connecting to the MySQL server varies depending on whether the command authenticates using a TGT from the MIT Kerberos cache, or based on command options for the MySQL user name and the UPN password. GSSAPI support through the MIT library on Windows is similar to GSSAPI on Linux (see Commands for Linux Clients), with the following exceptions:

* Tickets are always retrieved from or placed into the MIT Kerberos cache on hosts running Windows.

* **kinit** runs with Functional Accounts on Windows that have narrow permissions and specific roles. The client user does not know the **kinit** password. For an overview, see <https://docs.oracle.com/en/java/javase/11/tools/kinit.html>.

* If the client user supplies a password, the MIT Kerberos library on Windows decides whether to use it or rely on the existing ticket.

* The `destroy_tickets` parameter, described in Client Configuration Parameters for Kerberos Authentication, is not supported because the MIT Kerberos library on Windows does not support the required API member (`get_profile_boolean`) to read its value from configuration file.

###### Client Configuration Parameters for Kerberos Authentication

This section applies only for client hosts running Linux, not client hosts running Windows.

Note

A client host running Windows with the `authentication_kerberos_client` client-side Kerberos plugin set to `GSSAPI` mode does support client configuration parameters, in general, but the MIT Kerberos library on Windows does not support the `destroy_tickets` parameter described in this section.

If no valid ticket-granting ticket (TGT) exists at the time of MySQL client application invocation, the application itself may obtain and cache the TGT. If during the Kerberos authentication process the client application causes a TGT to be cached, any such TGT that was added can be destroyed after it is no longer needed, by setting the appropriate configuration parameter.

The `authentication_kerberos_client` client-side Kerberos plugin reads the local `/etc/krb5.conf` file. If this file is missing or inaccessible, an error occurs. Assuming that the file is accessible, it can include an optional `[appdefaults]` section to provide information used by the plugin. Place the information within the `mysql` part of the section. For example:

```
[appdefaults]
  mysql = {
    destroy_tickets = true
  }
```

The client-side plugin recognizes these parameters in the `mysql` section:

* The `destroy_tickets` value indicates whether the client-side plugin destroys the TGT after obtaining and using it. By default, `destroy_tickets` is `false`, but can be set to `true` to avoid TGT reuse. (This setting applies only to TGTs created by the client-side plugin, not TGTs created by other plugins or externally to MySQL.)

On the client host, a client keytab file may be used to obtain a TGT and TS without supplying a password. For information about keytab files, see <https://web.mit.edu/kerberos/krb5-latest/doc/basic/keytab_def.html>.

##### Kerberos Authentication Debugging

The `AUTHENTICATION_KERBEROS_CLIENT_LOG` environment variable enables or disables debug output for Kerberos authentication.

Note

Despite `CLIENT` in the name `AUTHENTICATION_KERBEROS_CLIENT_LOG`, the same environment variable applies to the server-side plugin as well as the client-side plugin.

On the server side, the permitted values are 0 (off) and 1 (on). Log messages are written to the server error log, subject to the server error-logging verbosity level. For example, if you are using priority-based log filtering, the `log_error_verbosity` system variable controls verbosity, as described in Section 7.4.2.5, “Priority-Based Error Log Filtering (log\_filter\_internal)”").

On the client side, the permitted values are from 1 to 5 and are written to the standard error output. The following table shows the meaning of each log-level value.

<table summary="Permitted client-side AUTHENTICATION_KERBEROS_CLIENT_LOG log levels and corresponding meanings"><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th>Log Level</th> <th>Meaning</th> </tr></thead><tbody><tr> <td>1 or not set</td> <td>No logging</td> </tr><tr> <td>2</td> <td>Error messages</td> </tr><tr> <td>3</td> <td>Error and warning messages</td> </tr><tr> <td>4</td> <td>Error, warning, and information messages</td> </tr><tr> <td>5</td> <td>Error, warning, information, and debug messages</td> </tr></tbody></table>
