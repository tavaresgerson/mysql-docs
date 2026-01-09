#### 6.4.1.2 Old Native Pluggable Authentication

MySQL includes two plugins that implement native authentication; that is, authentication based on the password hashing methods in use from before the introduction of pluggable authentication. This section describes `mysql_old_password`, which implements authentication against the `mysql.user` system table using the older (pre-4.1) native password hashing method. For information about `mysql_native_password`, which implements authentication using the native password hashing method, see [Section 6.4.1.1, “Native Pluggable Authentication”](native-pluggable-authentication.html "6.4.1.1 Native Pluggable Authentication"). For information about these password hashing methods, see [Section 6.1.2.4, “Password Hashing in MySQL”](password-hashing.html "6.1.2.4 Password Hashing in MySQL").

Note

Passwords that use the pre-4.1 hashing method are less secure than passwords that use the native password hashing method and should be avoided. Pre-4.1 passwords are deprecated and support for them (including the `mysql_old_password` plugin) was removed in MySQL 5.7.5. For account upgrade instructions, see [Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin”](account-upgrades.html "6.4.1.3 Migrating Away from Pre-4.1 Password Hashing and the mysql_old_password Plugin").

The following table shows the plugin names on the server and client sides.

**Table 6.9 Plugin and Library Names for Old Native Password Authentication**

<table summary="Names for the plugins and library file used for old native password authentication."><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>mysql_old_password</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>mysql_old_password</code></td> </tr><tr> <td>Library file</td> <td>None (plugins are built in)</td> </tr></tbody></table>

The following sections provide installation and usage information specific to old native pluggable authentication:

* [Installing Old Native Pluggable Authentication](old-native-pluggable-authentication.html#old-native-pluggable-authentication-installation "Installing Old Native Pluggable Authentication")
* [Using Old Native Pluggable Authentication](old-native-pluggable-authentication.html#old-native-pluggable-authentication-usage "Using Old Native Pluggable Authentication")

For general information about pluggable authentication in MySQL, see [Section 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication").

##### Installing Old Native Pluggable Authentication

The `mysql_old_password` plugin exists in server and client forms:

* The server-side plugin is built into the server, need not be loaded explicitly, and cannot be disabled by unloading it.

* The client-side plugin is built into the `libmysqlclient` client library and is available to any program linked against `libmysqlclient`.

##### Using Old Native Pluggable Authentication

MySQL client programs can use the [`--default-auth`](mysql-command-options.html#option_mysql_default-auth) option to specify the `mysql_old_password` plugin as a hint about which client-side plugin the program can expect to use:

```sql
$> mysql --default-auth=mysql_old_password ...
```
