#### 6.4.1.9 LDAP Pluggable Authentication

Note

LDAP pluggable authentication is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

As of MySQL 5.7.19, MySQL Enterprise Edition supports an authentication method that enables MySQL Server to use LDAP (Lightweight Directory Access Protocol) to authenticate MySQL users by accessing directory services such as X.500. MySQL uses LDAP to fetch user, credential, and group information.

LDAP pluggable authentication provides these capabilities:

* External authentication: LDAP authentication enables MySQL Server to accept connections from users defined outside the MySQL grant tables in LDAP directories.

* Proxy user support: LDAP authentication can return to MySQL a user name different from the external user name passed by the client program, based on the LDAP groups the external user is a member of. This means that an LDAP plugin can return the MySQL user that defines the privileges the external LDAP-authenticated user should have. For example, an LDAP user named `joe` can connect and have the privileges of a MySQL user named `developer`, if the LDAP group for `joe` is `developer`.

* Security: Using TLS, connections to the LDAP server can be secure.

The following tables show the plugin and library file names for simple and SASL-based LDAP authentication. The file name suffix might differ on your system. The files must be located in the directory named by the [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) system variable.

**Table 6.15 Plugin and Library Names for Simple LDAP Authentication**

<table summary="Names for the plugins and library file used for simple LDAP password authentication."><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin name</td> <td><code>authentication_ldap_simple</code></td> </tr><tr> <td>Client-side plugin name</td> <td><code>mysql_clear_password</code></td> </tr><tr> <td>Library file name</td> <td><code class="filename">authentication_ldap_simple.so</code></td> </tr></tbody></table>

**Table 6.16 Plugin and Library Names for SASL-Based LDAP Authentication**

<table summary="Names for the plugins and library file used for SASL-based LDAP password authentication."><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin name</td> <td><code>authentication_ldap_sasl</code></td> </tr><tr> <td>Client-side plugin name</td> <td><code>authentication_ldap_sasl_client</code></td> </tr><tr> <td>Library file names</td> <td><code class="filename">authentication_ldap_sasl.so</code>, <code class="filename">authentication_ldap_sasl_client.so</code></td> </tr></tbody></table>

The library files include only the `authentication_ldap_XXX` authentication plugins. The client-side `mysql_clear_password` plugin is built into the `libmysqlclient` client library.

Each server-side LDAP plugin works with a specific client-side plugin:

* The server-side `authentication_ldap_simple` plugin performs simple LDAP authentication. For connections by accounts that use this plugin, client programs use the client-side `mysql_clear_password` plugin, which sends the password to the server as cleartext. No password hashing or encryption is used, so a secure connection between the MySQL client and server is recommended to prevent password exposure.

* The server-side `authentication_ldap_sasl` plugin performs SASL-based LDAP authentication. For connections by accounts that use this plugin, client programs use the client-side `authentication_ldap_sasl_client` plugin. The client-side and server-side SASL LDAP plugins use SASL messages for secure transmission of credentials within the LDAP protocol, to avoid sending the cleartext password between the MySQL client and server.

The server-side LDAP authentication plugins are included only in MySQL Enterprise Edition. They are not included in MySQL community distributions. The client-side SASL LDAP plugin is included in all distributions, including community distributions, and, as mentioned previously, the client-side `mysql_clear_password` plugin is built into the `libmysqlclient` client library, which also is included in all distributions. This enables clients from any distribution to connect to a server that has the appropriate server-side plugin loaded.

The following sections provide installation and usage information specific to LDAP pluggable authentication:

* [Prerequisites for LDAP Pluggable Authentication](ldap-pluggable-authentication.html#ldap-pluggable-authentication-prerequisites "Prerequisites for LDAP Pluggable Authentication")
* [How LDAP Authentication of MySQL Users Works](ldap-pluggable-authentication.html#ldap-pluggable-authentication-how-it-works "How LDAP Authentication of MySQL Users Works")
* [Installing LDAP Pluggable Authentication](ldap-pluggable-authentication.html#ldap-pluggable-authentication-installation "Installing LDAP Pluggable Authentication")
* [Uninstalling LDAP Pluggable Authentication](ldap-pluggable-authentication.html#ldap-pluggable-authentication-uninstallation "Uninstalling LDAP Pluggable Authentication")
* [LDAP Pluggable Authentication and ldap.conf](ldap-pluggable-authentication.html#ldap-pluggable-authentication-ldap-conf "LDAP Pluggable Authentication and ldap.conf")
* [Using LDAP Pluggable Authentication](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage "Using LDAP Pluggable Authentication")
* [Simple LDAP Authentication (Without Proxying)](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage-simple "Simple LDAP Authentication (Without Proxying)")
* [SASL-Based LDAP Authentication (Without Proxying)](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage-sasl "SASL-Based LDAP Authentication (Without Proxying)")
* [LDAP Authentication with Proxying](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage-proxying "LDAP Authentication with Proxying")
* [LDAP Authentication Group Preference and Mapping Specification](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage-group-mapping "LDAP Authentication Group Preference and Mapping Specification")
* [LDAP Authentication User DN Suffixes](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage-user-dn-suffix "LDAP Authentication User DN Suffixes")
* [LDAP Authentication Methods](ldap-pluggable-authentication.html#ldap-pluggable-authentication-auth-methods "LDAP Authentication Methods")

For general information about pluggable authentication in MySQL, see [Section 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication"). For information about the `mysql_clear_password` plugin, see [Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”](cleartext-pluggable-authentication.html "6.4.1.6 Client-Side Cleartext Pluggable Authentication"). For proxy user information, see [Section 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users").

Note

If your system supports PAM and permits LDAP as a PAM authentication method, another way to use LDAP for MySQL user authentication is to use the server-side `authentication_pam` plugin. See [Section 6.4.1.7, “PAM Pluggable Authentication”](pam-pluggable-authentication.html "6.4.1.7 PAM Pluggable Authentication").

##### Prerequisites for LDAP Pluggable Authentication

To use LDAP pluggable authentication for MySQL, these prerequisites must be satisfied:

* An LDAP server must be available for the LDAP authentication plugins to communicate with.

* LDAP users to be authenticated by MySQL must be present in the directory managed by the LDAP server.

* An LDAP client library must be available on systems where the server-side `authentication_ldap_sasl` or `authentication_ldap_simple` plugin is used. Currently, supported libraries are the Windows native LDAP library, or the OpenLDAP library on non-Windows systems.

* To use SASL-based LDAP authentication:

  + The LDAP server must be configured to communicate with a SASL server.

  + A SASL client library must be available on systems where the client-side `authentication_ldap_sasl_client` plugin is used. Currently, the only supported library is the Cyrus SASL library.

##### How LDAP Authentication of MySQL Users Works

This section provides a general overview of how MySQL and LDAP work together to authenticate MySQL users. For examples showing how to set up MySQL accounts to use specific LDAP authentication plugins, see [Using LDAP Pluggable Authentication](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage "Using LDAP Pluggable Authentication").

The client connects to the MySQL server, providing the MySQL client user name and the LDAP password:

* For simple LDAP authentication, the client-side and server-side plugins communicate the password as cleartext. A secure connection between the MySQL client and server is recommended to prevent password exposure.

* For SASL-based LDAP authentication, the client-side and server-side plugins avoid sending the cleartext password between the MySQL client and server. For example, the plugins might use SASL messages for secure transmission of credentials within the LDAP protocol.

If the client user name and host name match no MySQL account, the connection is rejected.

If there is a matching MySQL account, authentication against LDAP occurs. The LDAP server looks for an entry matching the user and authenticates the entry against the LDAP password:

* If the MySQL account names an LDAP user distinguished name (DN), LDAP authentication uses that value and the LDAP password provided by the client. (To associate an LDAP user DN with a MySQL account, include a `BY` clause that specifies an authentication string in the [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") statement that creates the account.)

* If the MySQL account names no LDAP user DN, LDAP authentication uses the user name and LDAP password provided by the client. In this case, the authentication plugin first binds to the LDAP server using the root DN and password as credentials to find the user DN based on the client user name, then authenticates that user DN against the LDAP password. This bind using the root credentials fails if the root DN and password are set to incorrect values, or are empty (not set) and the LDAP server does not permit anonymous connections.

If the LDAP server finds no match or multiple matches, authentication fails and the client connection is rejected.

If the LDAP server finds a single match, LDAP authentication succeeds (assuming that the password is correct), the LDAP server returns the LDAP entry, and the authentication plugin determines the name of the authenticated user based on that entry:

* If the LDAP entry has a group attribute (by default, the `cn` attribute), the plugin returns its value as the authenticated user name.

* If the LDAP entry has no group attribute, the authentication plugin returns the client user name as the authenticated user name.

The MySQL server compares the client user name with the authenticated user name to determine whether proxying occurs for the client session:

* If the names are the same, no proxying occurs: The MySQL account matching the client user name is used for privilege checking.

* If the names differ, proxying occurs: MySQL looks for an account matching the authenticated user name. That account becomes the proxied user, which is used for privilege checking. The MySQL account that matched the client user name is treated as the external proxy user.

##### Installing LDAP Pluggable Authentication

This section describes how to install the server-side LDAP authentication plugins. For general information about installing plugins, see [Section 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

To be usable by the server, the plugin library files must be located in the MySQL plugin directory (the directory named by the [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) system variable). If necessary, configure the plugin directory location by setting the value of [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) at server startup.

The server-side plugin library file base names are `authentication_ldap_simple` and `authentication_ldap_sasl`. The file name suffix differs per platform (for example, `.so` for Unix and Unix-like systems, `.dll` for Windows).

To load the plugins at server startup, use [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) options to name the library files that contain them. With this plugin-loading method, the options must be given each time the server starts. Also, specify values for any plugin-provided system variables you wish to configure.

Each server-side LDAP plugin exposes a set of system variables that enable its operation to be configured. Setting most of these is optional, but you must set the variables that specify the LDAP server host (so the plugin knows where to connect) and base distinguished name for LDAP bind operations (to limit the scope of searches and obtain faster searches). For details about all LDAP system variables, see [Section 6.4.1.13, “Pluggable Authentication System Variables”](pluggable-authentication-system-variables.html "6.4.1.13 Pluggable Authentication System Variables").

To load the plugins and set the LDAP server host and base distinguished name for LDAP bind operations, put lines such as these in your `my.cnf` file, adjusting the `.so` suffix for your platform as necessary:

```sql
[mysqld]
plugin-load-add=authentication_ldap_simple.so
authentication_ldap_simple_server_host=127.0.0.1
authentication_ldap_simple_bind_base_dn="dc=example,dc=com"
plugin-load-add=authentication_ldap_sasl.so
authentication_ldap_sasl_server_host=127.0.0.1
authentication_ldap_sasl_bind_base_dn="dc=example,dc=com"
```

After modifying `my.cnf`, restart the server to cause the new settings to take effect.

Alternatively, to load the plugins at runtime, use these statements, adjusting the `.so` suffix for your platform as necessary:

```sql
INSTALL PLUGIN authentication_ldap_simple
  SONAME 'authentication_ldap_simple.so';
INSTALL PLUGIN authentication_ldap_sasl
  SONAME 'authentication_ldap_sasl.so';
```

[`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") loads the plugin immediately, and also registers it in the `mysql.plugins` system table to cause the server to load it for each subsequent normal startup without the need for [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add).

After installing the plugins at runtime, their system variables become available and you can add settings for them to your `my.cnf` file to configure the plugins for subsequent restarts. For example:

```sql
[mysqld]
authentication_ldap_simple_server_host=127.0.0.1
authentication_ldap_simple_bind_base_dn="dc=example,dc=com"
authentication_ldap_sasl_server_host=127.0.0.1
authentication_ldap_sasl_bind_base_dn="dc=example,dc=com"
```

After modifying `my.cnf`, restart the server to cause the new settings to take effect.

To verify plugin installation, examine the Information Schema [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") table or use the [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") statement (see [Section 5.5.2, “Obtaining Server Plugin Information”](obtaining-plugin-information.html "5.5.2 Obtaining Server Plugin Information")). For example:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%ldap%';
+----------------------------+---------------+
| PLUGIN_NAME                | PLUGIN_STATUS |
+----------------------------+---------------+
| authentication_ldap_sasl   | ACTIVE        |
| authentication_ldap_simple | ACTIVE        |
+----------------------------+---------------+
```

If a plugin fails to initialize, check the server error log for diagnostic messages.

To associate MySQL accounts with an LDAP plugin, see [Using LDAP Pluggable Authentication](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage "Using LDAP Pluggable Authentication").

Additional Notes for SELinux

On systems running EL6 or EL that have SELinux enabled, changes to the SELinux policy are required to enable the MySQL LDAP plugins to communicate with the LDAP service:

1. Create a file `mysqlldap.te` with these contents:

   ```sql
   module mysqlldap 1.0;

   require {
           type ldap_port_t;
           type mysqld_t;
           class tcp_socket name_connect;
   }

   #============= mysqld_t ==============

   allow mysqld_t ldap_port_t:tcp_socket name_connect;
   ```

2. Compile the security policy module into a binary representation:

   ```sql
   checkmodule -M -m mysqlldap.te -o mysqlldap.mod
   ```

3. Create an SELinux policy module package:

   ```sql
   semodule_package -m mysqlldap.mod  -o mysqlldap.pp
   ```

4. Install the module package:

   ```sql
   semodule -i mysqlldap.pp
   ```

5. When the SELinux policy changes have been made, restart the MySQL server:

   ```sql
   service mysqld restart
   ```

##### Uninstalling LDAP Pluggable Authentication

The method used to uninstall the LDAP authentication plugins depends on how you installed them:

* If you installed the plugins at server startup using [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) options, restart the server without those options.

* If you installed the plugins at runtime using [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement"), they remain installed across server restarts. To uninstall them, use [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement"):

  ```sql
  UNINSTALL PLUGIN authentication_ldap_simple;
  UNINSTALL PLUGIN authentication_ldap_sasl;
  ```

In addition, remove from your `my.cnf` file any startup options that set LDAP plugin-related system variables.

##### LDAP Pluggable Authentication and ldap.conf

For installations that use OpenLDAP, the `ldap.conf` file provides global defaults for LDAP clients. Options can be set in this file to affect LDAP clients, including the LDAP authentication plugins. OpenLDAP uses configuration options in this order of precedence:

* Configuration specified by the LDAP client.
* Configuration specified in the `ldap.conf` file. To disable use of this file, set the `LDAPNOINIT` environment variable.

* OpenLDAP library built-in defaults.

If the library defaults or `ldap.conf` values do not yield appropriate option values, an LDAP authentication plugin may be able to set related variables to affect the LDAP configuration directly. For example, LDAP plugins can override `ldap.conf` parameters for TLS configuration: System variables are available to enable TLS and control CA configuration, such as [`authentication_ldap_simple_tls`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_tls) and [`authentication_ldap_simple_ca_path`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_ca_path) for simple LDAP authentication, and [`authentication_ldap_sasl_tls`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_tls) and [`authentication_ldap_sasl_ca_path`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_ca_path) for SASL LDAP authentication.

For more information about `ldap.conf` consult the `ldap.conf(5)` man page.

##### Using LDAP Pluggable Authentication

This section describes how to enable MySQL accounts to connect to the MySQL server using LDAP pluggable authentication. It is assumed that the server is running with the appropriate server-side plugins enabled, as described in [Installing LDAP Pluggable Authentication](ldap-pluggable-authentication.html#ldap-pluggable-authentication-installation "Installing LDAP Pluggable Authentication"), and that the appropriate client-side plugins are available on the client host.

This section does not describe LDAP configuration or administration. You are assumed to be familiar with those topics.

The two server-side LDAP plugins each work with a specific client-side plugin:

* The server-side `authentication_ldap_simple` plugin performs simple LDAP authentication. For connections by accounts that use this plugin, client programs use the client-side `mysql_clear_password` plugin, which sends the password to the server as cleartext. No password hashing or encryption is used, so a secure connection between the MySQL client and server is recommended to prevent password exposure.

* The server-side `authentication_ldap_sasl` plugin performs SASL-based LDAP authentication. For connections by accounts that use this plugin, client programs use the client-side `authentication_ldap_sasl_client` plugin. The client-side and server-side SASL LDAP plugins use SASL messages for secure transmission of credentials within the LDAP protocol, to avoid sending the cleartext password between the MySQL client and server.

Overall requirements for LDAP authentication of MySQL users:

* There must be an LDAP directory entry for each user to be authenticated.

* There must be a MySQL user account that specifies a server-side LDAP authentication plugin and optionally names the associated LDAP user distinguished name (DN). (To associate an LDAP user DN with a MySQL account, include a `BY` clause in the [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") statement that creates the account.) If an account names no LDAP string, LDAP authentication uses the user name specified by the client to find the LDAP entry.

* Client programs connect using the connection method appropriate for the server-side authentication plugin the MySQL account uses. For LDAP authentication, connections require the MySQL user name and LDAP password. In addition, for accounts that use the server-side `authentication_ldap_simple` plugin, invoke client programs with the `--enable-cleartext-plugin` option to enable the client-side `mysql_clear_password` plugin.

The instructions here assume the following scenario:

* MySQL users `betsy` and `boris` authenticate to the LDAP entries for `betsy_ldap` and `boris_ldap`, respectively. (It is not necessary that the MySQL and LDAP user names differ. The use of different names in this discussion helps clarify whether an operation context is MySQL or LDAP.)

* LDAP entries use the `uid` attribute to specify user names. This may vary depending on LDAP server. Some LDAP servers use the `cn` attribute for user names rather than `uid`. To change the attribute, modify the [`authentication_ldap_simple_user_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_user_search_attr) or [`authentication_ldap_sasl_user_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_user_search_attr) system variable appropriately.

* These LDAP entries are available in the directory managed by the LDAP server, to provide distinguished name values that uniquely identify each user:

  ```sql
  uid=betsy_ldap,ou=People,dc=example,dc=com
  uid=boris_ldap,ou=People,dc=example,dc=com
  ```

* [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") statements that create MySQL accounts name an LDAP user in the `BY` clause, to indicate which LDAP entry the MySQL account authenticates against.

The instructions for setting up an account that uses LDAP authentication depend on which server-side LDAP plugin is used. The following sections describe several usage scenarios.

##### Simple LDAP Authentication (Without Proxying)

The procedure outlined in this section requires that [`authentication_ldap_simple_group_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_group_search_attr) be set to an empty string, like this:

```sql
SET GLOBAL.authentication_ldap_simple_group_search_attr='';
```

Otherwise, proxying is used by default.

To set up a MySQL account for simple LDAP authentication, use a [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") statement to specify the `authentication_ldap_simple` plugin, optionally including the LDAP user distinguished name (DN), as shown here:

```sql
CREATE USER user
  IDENTIFIED WITH authentication_ldap_simple
  [BY 'LDAP user DN'];
```

Suppose that MySQL user `betsy` has this entry in the LDAP directory:

```sql
uid=betsy_ldap,ou=People,dc=example,dc=com
```

Then the statement to create the MySQL account for `betsy` looks like this:

```sql
CREATE USER 'betsy'@'localhost'
  IDENTIFIED WITH authentication_ldap_simple
  AS 'uid=betsy_ldap,ou=People,dc=example,dc=com';
```

The authentication string specified in the `BY` clause does not include the LDAP password. That must be provided by the client user at connect time.

Clients connect to the MySQL server by providing the MySQL user name and LDAP password, and by enabling the client-side `mysql_clear_password` plugin:

```sql
$> mysql --user=betsy --password --enable-cleartext-plugin
Enter password: betsy_ldap_password
```

Note

The client-side `mysql_clear_password` authentication plugin leaves the password untouched, so client programs send it to the MySQL server as cleartext. This enables the password to be passed as is to the LDAP server. A cleartext password is necessary to use the server-side LDAP library without SASL, but may be a security problem in some configurations. These measures minimize the risk:

* To make inadvertent use of the `mysql_clear_password` plugin less likely, MySQL clients must explicitly enable it (for example, with the `--enable-cleartext-plugin` option). See [Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”](cleartext-pluggable-authentication.html "6.4.1.6 Client-Side Cleartext Pluggable Authentication").

* To avoid password exposure with the `mysql_clear_password` plugin enabled, MySQL clients should connect to the MySQL server using an encrypted connection. See [Section 6.3.1, “Configuring MySQL to Use Encrypted Connections”](using-encrypted-connections.html "6.3.1 Configuring MySQL to Use Encrypted Connections").

The authentication process occurs as follows:

1. The client-side plugin sends `betsy` and *`betsy_password`* as the client user name and LDAP password to the MySQL server.

2. The connection attempt matches the `'betsy'@'localhost'` account. The server-side LDAP plugin finds that this account has an authentication string of `'uid=betsy_ldap,ou=People,dc=example,dc=com'` to name the LDAP user DN. The plugin sends this string and the LDAP password to the LDAP server.

3. The LDAP server finds the LDAP entry for `betsy_ldap` and the password matches, so LDAP authentication succeeds.

4. The LDAP entry has no group attribute, so the server-side plugin returns the client user name (`betsy`) as the authenticated user. This is the same user name supplied by the client, so no proxying occurs and the client session uses the `'betsy'@'localhost'` account for privilege checking.

Had the [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") statement contained no `BY` clause to specify the `betsy_ldap` LDAP distinguished name, authentication attempts would use the user name provided by the client (in this case, `betsy`). In the absence of an LDAP entry for `betsy`, authentication would fail.

##### SASL-Based LDAP Authentication (Without Proxying)

The procedure outlined in this section requires that [`authentication_ldap_sasl_group_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_group_search_attr) be set to an empty string, like this:

```sql
SET GLOBAL.authentication_ldap_sasl_group_search_attr='';
```

Otherwise, proxying is used by default.

To set up a MySQL account for SALS LDAP authentication, use a [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") statement to specify the `authentication_ldap_sasl` plugin, optionally including the LDAP user distinguished name (DN), as shown here:

```sql
CREATE USER user
  IDENTIFIED WITH authentication_ldap_sasl
  [BY 'LDAP user DN'];
```

Suppose that MySQL user `boris` has this entry in the LDAP directory:

```sql
uid=boris_ldap,ou=People,dc=example,dc=com
```

Then the statement to create the MySQL account for `boris` looks like this:

```sql
CREATE USER 'boris'@'localhost'
  IDENTIFIED WITH authentication_ldap_sasl
  AS 'uid=boris_ldap,ou=People,dc=example,dc=com';
```

The authentication string specified in the `BY` clause does not include the LDAP password. That must be provided by the client user at connect time.

Clients connect to the MySQL server by providing the MySQL user name and LDAP password:

```sql
$> mysql --user=boris --password
Enter password: boris_ldap_password
```

For the server-side `authentication_ldap_sasl` plugin, clients use the client-side `authentication_ldap_sasl_client` plugin. If a client program does not find the client-side plugin, specify a [`--plugin-dir`](connection-options.html#option_general_plugin-dir) option that names the directory where the plugin library file is installed.

The authentication process for `boris` is similar to that previously described for `betsy` with simple LDAP authentication, except that the client-side and server-side SASL LDAP plugins use SASL messages for secure transmission of credentials within the LDAP protocol, to avoid sending the cleartext password between the MySQL client and server.

##### LDAP Authentication with Proxying

LDAP authentication plugins support proxying, enabling a user to connect to the MySQL server as one user but assume the privileges of a different user. This section describes basic LDAP plugin proxy support. The LDAP plugins also support specification of group preference and proxy user mapping; see [LDAP Authentication Group Preference and Mapping Specification](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage-group-mapping "LDAP Authentication Group Preference and Mapping Specification").

The proxying implementation described here is based on use of LDAP group attribute values to map connecting MySQL users who authenticate using LDAP onto other MySQL accounts that define different sets of privileges. Users do not connect directly through the accounts that define the privileges. Instead, they connect through a default proxy account authenticated with LDAP, such that all external logins are mapped to the proxied MySQL accounts that hold the privileges. Any user who connects using the proxy account is mapped to one of those proxied MySQL accounts, the privileges for which determine the database operations permitted to the external user.

The instructions here assume the following scenario:

* LDAP entries use the `uid` and `cn` attributes to specify user name and group values, respectively. To use different user and group attribute names, set the appropriate plugin-specific system variables:

  + For the `authentication_ldap_simple` plugin: Set [`authentication_ldap_simple_user_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_user_search_attr) and [`authentication_ldap_simple_group_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_group_search_attr).

  + For the `authentication_ldap_sasl` plugin: Set [`authentication_ldap_sasl_user_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_user_search_attr) and [`authentication_ldap_sasl_group_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_group_search_attr).

* These LDAP entries are available in the directory managed by the LDAP server, to provide distinguished name values that uniquely identify each user:

  ```sql
  uid=basha,ou=People,dc=example,dc=com,cn=accounting
  uid=basil,ou=People,dc=example,dc=com,cn=front_office
  ```

  At connect time, the group attribute values become the authenticated user names, so they name the `accounting` and `front_office` proxied accounts.

* The examples assume use of SASL LDAP authentication. Make the appropriate adjustments for simple LDAP authentication.

Create the default proxy MySQL account:

```sql
CREATE USER ''@'%'
  IDENTIFIED WITH authentication_ldap_sasl;
```

The proxy account definition has no `AS 'auth_string'` clause to name an LDAP user DN. Thus:

* When a client connects, the client user name becomes the LDAP user name to search for.

* The matching LDAP entry is expected to include a group attribute naming the proxied MySQL account that defines the privileges the client should have.

Note

If your MySQL installation has anonymous users, they might conflict with the default proxy user. For more information about this issue, and ways of dealing with it, see [Default Proxy User and Anonymous User Conflicts](proxy-users.html#proxy-users-conflicts "Default Proxy User and Anonymous User Conflicts").

Create the proxied accounts and grant to each one the privileges it should have:

```sql
CREATE USER 'accounting'@'localhost'
  IDENTIFIED WITH mysql_no_login;
CREATE USER 'front_office'@'localhost'
  IDENTIFIED WITH mysql_no_login;

GRANT ALL PRIVILEGES
  ON accountingdb.*
  TO 'accounting'@'localhost';
GRANT ALL PRIVILEGES
  ON frontdb.*
  TO 'front_office'@'localhost';
```

The proxied accounts use the `mysql_no_login` authentication plugin to prevent clients from using the accounts to log in directly to the MySQL server. Instead, users who authenticate using LDAP are expected to use the default `''@'%'` proxy account. (This assumes that the `mysql_no_login` plugin is installed. For instructions, see [Section 6.4.1.10, “No-Login Pluggable Authentication”](no-login-pluggable-authentication.html "6.4.1.10 No-Login Pluggable Authentication").) For alternative methods of protecting proxied accounts against direct use, see [Preventing Direct Login to Proxied Accounts](proxy-users.html#preventing-proxied-account-direct-login "Preventing Direct Login to Proxied Accounts").

Grant to the proxy account the [`PROXY`](privileges-provided.html#priv_proxy) privilege for each proxied account:

```sql
GRANT PROXY
  ON 'accounting'@'localhost'
  TO ''@'%';
GRANT PROXY
  ON 'front_office'@'localhost'
  TO ''@'%';
```

Use the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") command-line client to connect to the MySQL server as `basha`.

```sql
$> mysql --user=basha --password
Enter password: basha_password (basha LDAP password)
```

Authentication occurs as follows:

1. The server authenticates the connection using the default `''@'%'` proxy account, for client user `basha`.

2. The matching LDAP entry is:

   ```sql
   uid=basha,ou=People,dc=example,dc=com,cn=accounting
   ```

3. The matching LDAP entry has group attribute `cn=accounting`, so `accounting` becomes the authenticated proxied user.

4. The authenticated user differs from the client user name `basha`, with the result that `basha` is treated as a proxy for `accounting`, and `basha` assumes the privileges of the proxied `accounting` account. The following query returns output as shown:

   ```sql
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-----------------+----------------------+--------------+
   | USER()          | CURRENT_USER()       | @@proxy_user |
   +-----------------+----------------------+--------------+
   | basha@localhost | accounting@localhost | ''@'%'       |
   +-----------------+----------------------+--------------+
   ```

This demonstrates that `basha` uses the privileges granted to the proxied `accounting` MySQL account, and that proxying occurs through the default proxy user account.

Now connect as `basil` instead:

```sql
$> mysql --user=basil --password
Enter password: basil_password (basil LDAP password)
```

The authentication process for `basil` is similar to that previously described for `basha`:

1. The server authenticates the connection using the default `''@'%'` proxy account, for client user `basil`.

2. The matching LDAP entry is:

   ```sql
   uid=basil,ou=People,dc=example,dc=com,cn=front_office
   ```

3. The matching LDAP entry has group attribute `cn=front_office`, so `front_office` becomes the authenticated proxied user.

4. The authenticated user differs from the client user name `basil`, with the result that `basil` is treated as a proxy for `front_office`, and `basil` assumes the privileges of the proxied `front_office` account. The following query returns output as shown:

   ```sql
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-----------------+------------------------+--------------+
   | USER()          | CURRENT_USER()         | @@proxy_user |
   +-----------------+------------------------+--------------+
   | basil@localhost | front_office@localhost | ''@'%'       |
   +-----------------+------------------------+--------------+
   ```

This demonstrates that `basil` uses the privileges granted to the proxied `front_office` MySQL account, and that proxying occurs through the default proxy user account.

##### LDAP Authentication Group Preference and Mapping Specification

As described in [LDAP Authentication with Proxying](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage-proxying "LDAP Authentication with Proxying"), basic LDAP authentication proxying works by the principle that the plugin uses the first group name returned by the LDAP server as the MySQL proxied user account name. This simple capability does not enable specifying any preference about which group name to use if the LDAP server returns multiple group names, or specifying any name other than the group name as the proxied user name.

As of MySQL 5.7.25, for MySQL accounts that use LDAP authentication, the authentication string can specify the following information to enable greater proxying flexibility:

* A list of groups in preference order, such that the plugin uses the first group name in the list that matches a group returned by the LDAP server.

* A mapping from group names to proxied user names, such that a group name when matched can provide a specified name to use as the proxied user. This provides an alternative to using the group name as the proxied user.

Consider the following MySQL proxy account definition:

```sql
CREATE USER ''@'%'
  IDENTIFIED WITH authentication_ldap_sasl
  AS '+ou=People,dc=example,dc=com#grp1=usera,grp2,grp3=userc';
```

The authentication string has a user DN suffix `ou=People,dc=example,dc=com` prefixed by the `+` character. Thus, as described in [LDAP Authentication User DN Suffixes](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage-user-dn-suffix "LDAP Authentication User DN Suffixes"), the full user DN is constructed from the user DN suffix as specified, plus the client user name as the `uid` attribute.

The remaining part of the authentication string begins with `#`, which signifies the beginning of group preference and mapping information. This part of the authentication string lists group names in the order `grp1`, `grp2`, `grp3`. The LDAP plugin compares that list with the set of group names returned by the LDAP server, looking in list order for a match against the returned names. The plugin uses the first match, or if there is no match, authentication fails.

Suppose that the LDAP server returns groups `grp3`, `grp2`, and `grp7`. The LDAP plugin uses `grp2` because it is the first group in the authentication string that matches, even though it is not the first group returned by the LDAP server. If the LDAP server returns `grp4`, `grp2`, and `grp1`, the plugin uses `grp1` even though `grp2` also matches. `grp1` has a precedence higher than `grp2` because it is listed earlier in the authentication string.

Assuming that the plugin finds a group name match, it performs mapping from that group name to the MySQL proxied user name, if there is one. For the example proxy account, mapping occurs as follows:

* If the matching group name is `grp1` or `grp3`, those are associated in the authentication string with user names `usera` and `userc`, respectively. The plugin uses the corresponding associated user name as the proxied user name.

* If the matching group name is `grp2`, there is no associated user name in the authentication string. The plugin uses `grp2` as the proxied user name.

If the LDAP server returns a group in DN format, the LDAP plugin parses the group DN to extract the group name from it.

To specify LDAP group preference and mapping information, these principles apply:

* Begin the group preference and mapping part of the authentication string with a `#` prefix character.

* The group preference and mapping specification is a list of one or more items, separated by commas. Each item has the form `group_name=user_name` or *`group_name`*. Items should be listed in group name preference order. For a group name selected by the plugin as a match from set of group names returned by the LDAP server, the two syntaxes differ in effect as follows:

  + For an item specified as `group_name=user_name` (with a user name), the group name maps to the user name, which is used as the MySQL proxied user name.

  + For an item specified as *`group_name`* (with no user name), the group name is used as the MySQL proxied user name.

* To quote a group or user name that contains special characters such as space, surround it by double quote (`"`) characters. For example, if an item has group and user names of `my group name` and `my user name`, it must be written in a group mapping using quotes:

  ```sql
  "my group name"="my user name"
  ```

  If an item has group and user names of `my_group_name` and `my_user_name` (which contain no special characters), it may but need not be written using quotes. Any of the following are valid:

  ```sql
  my_group_name=my_user_name
  my_group_name="my_user_name"
  "my_group_name"=my_user_name
  "my_group_name"="my_user_name"
  ```

* To escape a character, precede it by a backslash (`\`). This is useful particularly to include a literal double quote or backslash, which are otherwise not included literally.

* A user DN need not be present in the authentication string, but if present, it must precede the group preference and mapping part. A user DN can be given as a full user DN, or as a user DN suffix with a `+` prefix character. (See [LDAP Authentication User DN Suffixes](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage-user-dn-suffix "LDAP Authentication User DN Suffixes").)

##### LDAP Authentication User DN Suffixes

As of MySQL 5.7.21, LDAP authentication plugins permit the authentication string that provides user DN information to begin with a `+` prefix character:

* In the absence of a `+` character, the authentication string value is treated as is without modification.

* If the authentication string begins with `+`, the plugin constructs the full user DN value from the user name sent by the client, together with the DN specified in the authentication string (with the `+` removed). In the constructed DN, the client user name becomes the value of the attribute that specifies LDAP user names. This is `uid` by default; to change the attribute, modify the appropriate system variable ([`authentication_ldap_simple_user_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_user_search_attr) or [`authentication_ldap_sasl_user_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_user_search_attr)). The authentication string is stored as given in the `mysql.user` system table, with the full user DN constructed on the fly before authentication.

This account authentication string does not have `+` at the beginning, so it is taken as the full user DN:

```sql
CREATE USER 'baldwin'
  IDENTIFIED WITH authentication_ldap_simple
  AS 'uid=admin,ou=People,dc=example,dc=com';
```

The client connects with the user name specified in the account (`baldwin`). In this case, that name is not used because the authentication string has no prefix and thus fully specifies the user DN.

This account authentication string does have `+` at the beginning, so it is taken as just part of the user DN:

```sql
CREATE USER 'accounting'
  IDENTIFIED WITH authentication_ldap_simple
  AS '+ou=People,dc=example,dc=com';
```

The client connects with the user name specified in the account (`accounting`), which in this case is used as the `uid` attribute together with the authentication string to construct the user DN: `uid=accounting,ou=People,dc=example,dc=com`

The accounts in the preceding examples have a nonempty user name, so the client always connects to the MySQL server using the same name as specified in the account definition. If an account has an empty user name, such as the default anonymous `''@'%'` proxy account described in [LDAP Authentication with Proxying](ldap-pluggable-authentication.html#ldap-pluggable-authentication-usage-proxying "LDAP Authentication with Proxying"), clients might connect to the MySQL server with varying user names. But the principle is the same: If the authentication string begins with `+`, the plugin uses the user name sent by the client together with the authentication string to construct the user DN.

##### LDAP Authentication Methods

The LDAP authentication plugins use a configurable authentication method. The appropriate system variable and available method choices are plugin-specific:

* For the `authentication_ldap_simple` plugin: Configure the method by setting the [`authentication_ldap_simple_auth_method_name`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_auth_method_name) system variable. The permitted choices are `SIMPLE` and `AD-FOREST`.

* For the `authentication_ldap_sasl` plugin: Configure the method by setting the [`authentication_ldap_sasl_auth_method_name`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_auth_method_name) system variable. The only permitted choice is `SCRAM-SHA-1`.

See the system variable descriptions for information about each permitted method.
