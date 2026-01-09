#### 6.4.1.10 No-Login Pluggable Authentication

The `mysql_no_login` server-side authentication plugin prevents all client connections to any account that uses it. Use cases for this plugin include:

* Accounts that must be able to execute stored programs and views with elevated privileges without exposing those privileges to ordinary users.

* Proxied accounts that should never permit direct login but are intended to be accessed only through proxy accounts.

The following table shows the plugin and library file names. The file name suffix might differ on your system. The file must be located in the directory named by the [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) system variable.

**Table 6.17 Plugin and Library Names for No-Login Authentication**

<table summary="Names for the plugins and library file used for no-login password authentication."><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>mysql_no_login</code></td> </tr><tr> <td>Client-side plugin</td> <td>None</td> </tr><tr> <td>Library file</td> <td><code class="filename">mysql_no_login.so</code></td> </tr></tbody></table>

The following sections provide installation and usage information specific to no-login pluggable authentication:

* [Installing No-Login Pluggable Authentication](no-login-pluggable-authentication.html#no-login-pluggable-authentication-installation "Installing No-Login Pluggable Authentication")
* [Uninstalling No-Login Pluggable Authentication](no-login-pluggable-authentication.html#no-login-pluggable-authentication-uninstallation "Uninstalling No-Login Pluggable Authentication")
* [Using No-Login Pluggable Authentication](no-login-pluggable-authentication.html#no-login-pluggable-authentication-usage "Using No-Login Pluggable Authentication")

For general information about pluggable authentication in MySQL, see [Section 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication"). For proxy user information, see [Section 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users").

##### Installing No-Login Pluggable Authentication

This section describes how to install the no-login authentication plugin. For general information about installing plugins, see [Section 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) system variable). If necessary, configure the plugin directory location by setting the value of [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) at server startup.

The plugin library file base name is `mysql_no_login`. The file name suffix differs per platform (for example, `.so` for Unix and Unix-like systems, `.dll` for Windows).

To load the plugin at server startup, use the [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) option to name the library file that contains it. With this plugin-loading method, the option must be given each time the server starts. For example, put these lines in the server `my.cnf` file, adjusting the `.so` suffix for your platform as necessary:

```sql
[mysqld]
plugin-load-add=mysql_no_login.so
```

After modifying `my.cnf`, restart the server to cause the new settings to take effect.

Alternatively, to load the plugin at runtime, use this statement, adjusting the `.so` suffix for your platform as necessary:

```sql
INSTALL PLUGIN mysql_no_login SONAME 'mysql_no_login.so';
```

[`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") loads the plugin immediately, and also registers it in the `mysql.plugins` system table to cause the server to load it for each subsequent normal startup without the need for [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add).

To verify plugin installation, examine the Information Schema [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") table or use the [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") statement (see [Section 5.5.2, “Obtaining Server Plugin Information”](obtaining-plugin-information.html "5.5.2 Obtaining Server Plugin Information")). For example:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%login%';
+----------------+---------------+
| PLUGIN_NAME    | PLUGIN_STATUS |
+----------------+---------------+
| mysql_no_login | ACTIVE        |
+----------------+---------------+
```

If the plugin fails to initialize, check the server error log for diagnostic messages.

To associate MySQL accounts with the no-login plugin, see [Using No-Login Pluggable Authentication](no-login-pluggable-authentication.html#no-login-pluggable-authentication-usage "Using No-Login Pluggable Authentication").

##### Uninstalling No-Login Pluggable Authentication

The method used to uninstall the no-login authentication plugin depends on how you installed it:

* If you installed the plugin at server startup using a [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) option, restart the server without the option.

* If you installed the plugin at runtime using an [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") statement, it remains installed across server restarts. To uninstall it, use [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement"):

  ```sql
  UNINSTALL PLUGIN mysql_no_login;
  ```

##### Using No-Login Pluggable Authentication

This section describes how to use the no-login authentication plugin to prevent accounts from being used for connecting from MySQL client programs to the server. It is assumed that the server is running with the no-login plugin enabled, as described in [Installing No-Login Pluggable Authentication](no-login-pluggable-authentication.html#no-login-pluggable-authentication-installation "Installing No-Login Pluggable Authentication").

To refer to the no-login authentication plugin in the `IDENTIFIED WITH` clause of a [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") statement, use the name `mysql_no_login`.

An account that authenticates using `mysql_no_login` may be used as the `DEFINER` for stored program and view objects. If such an object definition also includes `SQL SECURITY DEFINER`, it executes with that account's privileges. DBAs can use this behavior to provide access to confidential or sensitive data that is exposed only through well-controlled interfaces.

The following example illustrates these principles. It defines an account that does not permit client connections, and associates with it a view that exposes only certain columns of the `mysql.user` system table:

```sql
CREATE DATABASE nologindb;
CREATE USER 'nologin'@'localhost'
  IDENTIFIED WITH mysql_no_login;
GRANT ALL ON nologindb.*
  TO 'nologin'@'localhost';
GRANT SELECT ON mysql.user
  TO 'nologin'@'localhost';
CREATE DEFINER = 'nologin'@'localhost'
  SQL SECURITY DEFINER
  VIEW nologindb.myview
  AS SELECT User, Host FROM mysql.user;
```

To provide protected access to the view to an ordinary user, do this:

```sql
GRANT SELECT ON nologindb.myview
  TO 'ordinaryuser'@'localhost';
```

Now the ordinary user can use the view to access the limited information it presents:

```sql
SELECT * FROM nologindb.myview;
```

Attempts by the user to access columns other than those exposed by the view result in an error, as do attempts to select from the view by users not granted access to it.

Note

Because the `nologin` account cannot be used directly, the operations required to set up objects that it uses must be performed by `root` or similar account that has the privileges required to create the objects and set `DEFINER` values.

The `mysql_no_login` plugin is also useful in proxying scenarios. (For a discussion of concepts involved in proxying, see [Section 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users").) An account that authenticates using `mysql_no_login` may be used as a proxied user for proxy accounts:

```sql
-- create proxied account
CREATE USER 'proxied_user'@'localhost'
  IDENTIFIED WITH mysql_no_login;
-- grant privileges to proxied account
GRANT ...
  ON ...
  TO 'proxied_user'@'localhost';
-- permit proxy_user to be a proxy account for proxied account
GRANT PROXY
  ON 'proxied_user'@'localhost'
  TO 'proxy_user'@'localhost';
```

This enables clients to access MySQL through the proxy account (`proxy_user`) but not to bypass the proxy mechanism by connecting directly as the proxied user (`proxied_user`). A client who connects using the `proxy_user` account has the privileges of the `proxied_user` account, but `proxied_user` itself cannot be used to connect.

For alternative methods of protecting proxied accounts against direct use, see [Preventing Direct Login to Proxied Accounts](proxy-users.html#preventing-proxied-account-direct-login "Preventing Direct Login to Proxied Accounts").
