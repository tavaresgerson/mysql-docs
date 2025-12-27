#### 8.4.1.1 Native Pluggable Authentication

MySQL includes a `mysql_native_password` plugin that implements native authentication; that is, authentication based on the password hashing method in use from before the introduction of pluggable authentication.

::: info Note

The `mysql_native_password` authentication plugin is deprecated as of MySQL 8.0.34, disabled by default in MySQL 8.4, and removed as of MySQL 9.0.0.

:::

The following table shows the plugin names on the server and client sides.

**Table 8.14 Plugin and Library Names for Native Password Authentication**

<table><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>mysql_native_password</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>mysql_native_password</code></td> </tr><tr> <td>Library file</td> <td>None (plugins are built in)</td> </tr></tbody></table>

The following sections provide installation and usage information specific to native pluggable authentication:

*  Installing Native Pluggable Authentication
*  Using Native Pluggable Authentication
*  Disabling Native Pluggable Authentication

For general information about pluggable authentication in MySQL, see  Section 8.2.17, “Pluggable Authentication”.

##### Installing Native Pluggable Authentication

The `mysql_native_password` plugin exists in server and client forms:

* The server-side plugin is built into the server, but is disabled by default. To enable it, start the MySQL Server with `--mysql-native-password=ON` or by including `mysql_native_password=ON` in the `[mysqld]` section of your MySQL configuration file.
* The client-side plugin is built into the `libmysqlclient` client library and is available to any program linked against `libmysqlclient`.

##### Using Native Pluggable Authentication

MySQL client programs in MySQL 8.4 (and later) use `caching_sha2_password` for authentication by default. Use the `--default-auth` option to set `mysql_native_password` as the default client-side authentication plugin, if that is what is desired, like this:

```
$> mysql --default-auth=mysql_native_password ...
```

##### Disabling Native Pluggable Authentication

In MySQL 8.4, the `mysql_native_password` server-side plugin is disabled by default. To keep it disabled, be sure the server is started without specifying the `--mysql-native-password` option. Using `--mysql-native-password=OFF` also works for this purpose, but is not required. In addition, do not enable `mysql_native_password` in your MySQL configuration file to keep it disabled.

When the plugin is disabled, all of the operations that depend on the plugin are inaccessible. Specifically:

* Defined user accounts that authenticate with `mysql_native_password` encounter an error when they attempt to connect.

  ```
  $> MYSQL -u userx -p
  ERROR 1045 (28000): Access denied for user 'userx'@'localhost' (using password: NO)
  ```

  The server writes these errors to the server log.
* Attempts to create a new user account or to alter an existing user account identified with `mysql_native_password` also fail and emit an error.

  ```
  mysql> CREATE USER userxx@localhost IDENTIFIED WITH 'mysql_native_password';
  ERROR 1524 (HY000): Plugin 'mysql_native_password' is not loaded
  mysql> ALTER USER userxy@localhost IDENTIFIED WITH 'mysql_native_password';
  ERROR 1524 (HY000): Plugin 'mysql_native_password' is not loaded
  ```

For instructions on enabling the plugin, see Installing Native Pluggable Authentication.
