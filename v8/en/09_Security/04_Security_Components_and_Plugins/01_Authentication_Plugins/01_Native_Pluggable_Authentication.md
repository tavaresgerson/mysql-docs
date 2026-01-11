#### 8.4.1.1 Native Pluggable Authentication

MySQL includes a `mysql_native_password` plugin that implements native authentication; that is, authentication based on the password hashing method in use from before the introduction of pluggable authentication.

Note

The `mysql_native_password` authentication plugin is deprecated as of MySQL 8.0.34, disabled by default in MySQL 8.4, and removed as of MySQL 9.0.0.

The following table shows the plugin names on the server and client sides.

**Table 8.16 Plugin and Library Names for Native Password Authentication**

<table summary="Names for the plugins and library file used for native password authentication."><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>mysql_native_password</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>mysql_native_password</code></td> </tr><tr> <td>Library file</td> <td>None (plugins are built in)</td> </tr></tbody></table>

The following sections provide installation and usage information specific to native pluggable authentication:

* Installing Native Pluggable Authentication
* Using Native Pluggable Authentication

For general information about pluggable authentication in MySQL, see Section 8.2.17, “Pluggable Authentication”.

##### Installing Native Pluggable Authentication

The `mysql_native_password` plugin exists in server and client forms:

* The server-side plugin is built into the server, need not be loaded explicitly, and cannot be disabled by unloading it.

* The client-side plugin is built into the `libmysqlclient` client library and is available to any program linked against `libmysqlclient`.

##### Using Native Pluggable Authentication

MySQL client programs use `mysql_native_password` by default. The `--default-auth` option can be used as a hint about which client-side plugin the program can expect to use:

```
$> mysql --default-auth=mysql_native_password ...
```
