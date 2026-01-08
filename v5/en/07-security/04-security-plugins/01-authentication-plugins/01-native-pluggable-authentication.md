#### 6.4.1.1 Native Pluggable Authentication

MySQL includes two plugins that implement native authentication; that is, authentication based on the password hashing methods in use from before the introduction of pluggable authentication. This section describes `mysql_native_password`, which implements authentication against the `mysql.user` system table using the native password hashing method. For information about `mysql_old_password`, which implements authentication using the older (pre-4.1) native password hashing method, see [Section 6.4.1.2, “Old Native Pluggable Authentication”](old-native-pluggable-authentication.html "6.4.1.2 Old Native Pluggable Authentication"). For information about these password hashing methods, see [Section 6.1.2.4, “Password Hashing in MySQL”](password-hashing.html "6.1.2.4 Password Hashing in MySQL").

The following table shows the plugin names on the server and client sides.

**Table 6.8 Plugin and Library Names for Native Password Authentication**

<table summary="Names for the plugins and library file used for native password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>mysql_native_password</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>mysql_native_password</code></td> </tr><tr> <td>Library file</td> <td>None (plugins are built in)</td> </tr></tbody></table>

The following sections provide installation and usage information specific to native pluggable authentication:

* [Installing Native Pluggable Authentication](native-pluggable-authentication.html#native-pluggable-authentication-installation "Installing Native Pluggable Authentication")
* [Using Native Pluggable Authentication](native-pluggable-authentication.html#native-pluggable-authentication-usage "Using Native Pluggable Authentication")

For general information about pluggable authentication in MySQL, see [Section 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication").

##### Installing Native Pluggable Authentication

The `mysql_native_password` plugin exists in server and client forms:

* The server-side plugin is built into the server, need not be loaded explicitly, and cannot be disabled by unloading it.

* The client-side plugin is built into the `libmysqlclient` client library and is available to any program linked against `libmysqlclient`.

##### Using Native Pluggable Authentication

MySQL client programs use `mysql_native_password` by default. The [`--default-auth`](mysql-command-options.html#option_mysql_default-auth) option can be used as a hint about which client-side plugin the program can expect to use:

```sql
$> mysql --default-auth=mysql_native_password ...
```
