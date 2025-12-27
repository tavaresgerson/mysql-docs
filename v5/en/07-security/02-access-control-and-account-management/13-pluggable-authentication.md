### 6.2.13 Pluggable Authentication

When a client connects to the MySQL server, the server uses the user name provided by the client and the client host to select the appropriate account row from the `mysql.user` system table. The server then authenticates the client, determining from the account row which authentication plugin applies to the client:

* If the server cannot find the plugin, an error occurs and the connection attempt is rejected.

* Otherwise, the server invokes that plugin to authenticate the user, and the plugin returns a status to the server indicating whether the user provided the correct password and is permitted to connect.

Pluggable authentication enables these important capabilities:

* **Choice of authentication methods.** Pluggable authentication makes it easy for DBAs to choose and change the authentication method used for individual MySQL accounts.

* **External authentication.** Pluggable authentication makes it possible for clients to connect to the MySQL server with credentials appropriate for authentication methods that store credentials elsewhere than in the `mysql.user` system table. For example, plugins can be created to use external authentication methods such as PAM, Windows login IDs, LDAP, or Kerberos.

* **Proxy users:** If a user is permitted to connect, an authentication plugin can return to the server a user name different from the name of the connecting user, to indicate that the connecting user is a proxy for another user (the proxied user). While the connection lasts, the proxy user is treated, for purposes of access control, as having the privileges of the proxied user. In effect, one user impersonates another. For more information, see [Section 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users").

Note

If you start the server with the [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) option, authentication plugins are not used even if loaded because the server performs no client authentication and permits any client to connect. Because this is insecure, you might want to use [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) in conjunction with enabling the [`skip_networking`](server-system-variables.html#sysvar_skip_networking) system variable to prevent remote clients from connecting.

* [Available Authentication Plugins](pluggable-authentication.html#pluggable-authentication-available-plugins "Available Authentication Plugins")
* [Authentication Plugin Usage](pluggable-authentication.html#pluggable-authentication-usage "Authentication Plugin Usage")
* [Restrictions on Pluggable Authentication](pluggable-authentication.html#pluggable-authentication-restrictions "Restrictions on Pluggable Authentication")

#### Available Authentication Plugins

MySQL 5.7 provides these authentication plugins:

* Plugins that perform native authentication; that is, authentication based on the password hashing methods in use from before the introduction of pluggable authentication in MySQL. The `mysql_native_password` plugin implements authentication based on the native password hashing method. The `mysql_old_password` plugin implements native authentication based on the older (pre-4.1) password hashing method (and is deprecated and removed in MySQL 5.7.5). See [Section 6.4.1.1, “Native Pluggable Authentication”](native-pluggable-authentication.html "6.4.1.1 Native Pluggable Authentication"), and [Section 6.4.1.2, “Old Native Pluggable Authentication”](old-native-pluggable-authentication.html "6.4.1.2 Old Native Pluggable Authentication").

* Plugins that perform authentication using SHA-256 password hashing. This is stronger encryption than that available with native authentication. See [Section 6.4.1.5, “SHA-256 Pluggable Authentication”](sha256-pluggable-authentication.html "6.4.1.5 SHA-256 Pluggable Authentication"), and [Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”](caching-sha2-pluggable-authentication.html "6.4.1.4 Caching SHA-2 Pluggable Authentication").

* A client-side plugin that sends the password to the server without hashing or encryption. This plugin is used in conjunction with server-side plugins that require access to the password exactly as provided by the client user. See [Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”](cleartext-pluggable-authentication.html "6.4.1.6 Client-Side Cleartext Pluggable Authentication").

* A plugin that performs external authentication using PAM (Pluggable Authentication Modules), enabling MySQL Server to use PAM to authenticate MySQL users. This plugin supports proxy users as well. See [Section 6.4.1.7, “PAM Pluggable Authentication”](pam-pluggable-authentication.html "6.4.1.7 PAM Pluggable Authentication").

* A plugin that performs external authentication on Windows, enabling MySQL Server to use native Windows services to authenticate client connections. Users who have logged in to Windows can connect from MySQL client programs to the server based on the information in their environment without specifying an additional password. This plugin supports proxy users as well. See [Section 6.4.1.8, “Windows Pluggable Authentication”](windows-pluggable-authentication.html "6.4.1.8 Windows Pluggable Authentication").

* Plugins that perform authentication using LDAP (Lightweight Directory Access Protocol) to authenticate MySQL users by accessing directory services such as X.500. These plugins support proxy users as well. See [Section 6.4.1.9, “LDAP Pluggable Authentication”](ldap-pluggable-authentication.html "6.4.1.9 LDAP Pluggable Authentication").

* A plugin that prevents all client connections to any account that uses it. Use cases for this plugin include proxied accounts that should never permit direct login but are accessed only through proxy accounts and accounts that must be able to execute stored programs and views with elevated privileges without exposing those privileges to ordinary users. See [Section 6.4.1.10, “No-Login Pluggable Authentication”](no-login-pluggable-authentication.html "6.4.1.10 No-Login Pluggable Authentication").

* A plugin that authenticates clients that connect from the local host through the Unix socket file. See [Section 6.4.1.11, “Socket Peer-Credential Pluggable Authentication”](socket-pluggable-authentication.html "6.4.1.11 Socket Peer-Credential Pluggable Authentication").

* A test plugin that checks account credentials and logs success or failure to the server error log. This plugin is intended for testing and development purposes, and as an example of how to write an authentication plugin. See [Section 6.4.1.12, “Test Pluggable Authentication”](test-pluggable-authentication.html "6.4.1.12 Test Pluggable Authentication").

Note

For information about current restrictions on the use of pluggable authentication, including which connectors support which plugins, see [Restrictions on Pluggable Authentication](pluggable-authentication.html#pluggable-authentication-restrictions "Restrictions on Pluggable Authentication").

Third-party connector developers should read that section to determine the extent to which a connector can take advantage of pluggable authentication capabilities and what steps to take to become more compliant.

If you are interested in writing your own authentication plugins, see [Writing Authentication Plugins](/doc/extending-mysql/5.7/en/writing-authentication-plugins.html).

#### Authentication Plugin Usage

This section provides general instructions for installing and using authentication plugins. For instructions specific to a given plugin, see the section that describes that plugin under [Section 6.4.1, “Authentication Plugins”](authentication-plugins.html "6.4.1 Authentication Plugins").

In general, pluggable authentication uses a pair of corresponding plugins on the server and client sides, so you use a given authentication method like this:

* If necessary, install the plugin library or libraries containing the appropriate plugins. On the server host, install the library containing the server-side plugin, so that the server can use it to authenticate client connections. Similarly, on each client host, install the library containing the client-side plugin for use by client programs. Authentication plugins that are built in need not be installed.

* For each MySQL account that you create, specify the appropriate server-side plugin to use for authentication. If the account is to use the default authentication plugin, the account-creation statement need not specify the plugin explicitly. The [`default_authentication_plugin`](server-system-variables.html#sysvar_default_authentication_plugin) system variable configures the default authentication plugin.

* When a client connects, the server-side plugin tells the client program which client-side plugin to use for authentication.

In the case that an account uses an authentication method that is the default for both the server and the client program, the server need not communicate to the client which client-side plugin to use, and a round trip in client/server negotiation can be avoided. This is true for accounts that use native MySQL authentication.

For standard MySQL clients such as [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") and [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"), the [`--default-auth=plugin_name`](mysql-command-options.html#option_mysql_default-auth) option can be specified on the command line as a hint about which client-side plugin the program can expect to use, although the server overrides this if the server-side plugin associated with the user account requires a different client-side plugin.

If the client program does not find the client-side plugin library file, specify a [`--plugin-dir=dir_name`](mysql-command-options.html#option_mysql_plugin-dir) option to indicate the plugin library directory location.

#### Restrictions on Pluggable Authentication

The first part of this section describes general restrictions on the applicability of the pluggable authentication framework described at [Section 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication"). The second part describes how third-party connector developers can determine the extent to which a connector can take advantage of pluggable authentication capabilities and what steps to take to become more compliant.

The term “native authentication” used here refers to authentication against passwords stored in the `mysql.user` system table. This is the same authentication method provided by older MySQL servers, before pluggable authentication was implemented. “Windows native authentication” refers to authentication using the credentials of a user who has already logged in to Windows, as implemented by the Windows Native Authentication plugin (“Windows plugin” for short).

* [General Pluggable Authentication Restrictions](pluggable-authentication.html#pluggable-authentication-restrictions-general "General Pluggable Authentication Restrictions")
* [Pluggable Authentication and Third-Party Connectors](pluggable-authentication.html#pluggable-authentication-restrictions-third-party-connectors "Pluggable Authentication and Third-Party Connectors")

##### General Pluggable Authentication Restrictions

* **Connector/C++:** Clients that use this connector can connect to the server only through accounts that use native authentication.

  Exception: A connector supports pluggable authentication if it was built to link to `libmysqlclient` dynamically (rather than statically) and it loads the current version of `libmysqlclient` if that version is installed, or if the connector is recompiled from source to link against the current `libmysqlclient`.

* **Connector/NET:** Clients that use Connector/NET can connect to the server through accounts that use native authentication or Windows native authentication.

* **Connector/PHP:** Clients that use this connector can connect to the server only through accounts that use native authentication, when compiled using the MySQL native driver for PHP (`mysqlnd`).

* **Windows native authentication:** Connecting through an account that uses the Windows plugin requires Windows Domain setup. Without it, NTLM authentication is used and then only local connections are possible; that is, the client and server must run on the same computer.

* **Proxy users:** Proxy user support is available to the extent that clients can connect through accounts authenticated with plugins that implement proxy user capability (that is, plugins that can return a user name different from that of the connecting user). For example, the PAM and Windows plugins support proxy users. The `mysql_native_password` and `sha256_password` authentication plugins do not support proxy users by default, but can be configured to do so; see [Server Support for Proxy User Mapping](proxy-users.html#proxy-users-server-user-mapping "Server Support for Proxy User Mapping").

* **Replication**: Replicas can employ not only source accounts using native authentication, but can also connect through source accounts that use nonnative authentication if the required client-side plugin is available. If the plugin is built into `libmysqlclient`, it is available by default. Otherwise, the plugin must be installed on the replica side in the directory named by the replica [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) system variable.

* **[`FEDERATED`](federated-storage-engine.html "15.8 The FEDERATED Storage Engine") tables:** A [`FEDERATED`](federated-storage-engine.html "15.8 The FEDERATED Storage Engine") table can access the remote table only through accounts on the remote server that use native authentication.

##### Pluggable Authentication and Third-Party Connectors

Third-party connector developers can use the following guidelines to determine readiness of a connector to take advantage of pluggable authentication capabilities and what steps to take to become more compliant:

* An existing connector to which no changes have been made uses native authentication and clients that use the connector can connect to the server only through accounts that use native authentication. *However, you should test the connector against a recent version of the server to verify that such connections still work without problem.*

  Exception: A connector might work with pluggable authentication without any changes if it links to `libmysqlclient` dynamically (rather than statically) and it loads the current version of `libmysqlclient` if that version is installed.

* To take advantage of pluggable authentication capabilities, a connector that is `libmysqlclient`-based should be relinked against the current version of `libmysqlclient`. This enables the connector to support connections though accounts that require client-side plugins now built into `libmysqlclient` (such as the cleartext plugin needed for PAM authentication and the Windows plugin needed for Windows native authentication). Linking with a current `libmysqlclient` also enables the connector to access client-side plugins installed in the default MySQL plugin directory (typically the directory named by the default value of the local server's [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) system variable).

  If a connector links to `libmysqlclient` dynamically, it must be ensured that the newer version of `libmysqlclient` is installed on the client host and that the connector loads it at runtime.

* Another way for a connector to support a given authentication method is to implement it directly in the client/server protocol. Connector/NET uses this approach to provide support for Windows native authentication.

* If a connector should be able to load client-side plugins from a directory different from the default plugin directory, it must implement some means for client users to specify the directory. Possibilities for this include a command-line option or environment variable from which the connector can obtain the directory name. Standard MySQL client programs such as [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") and [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") implement a `--plugin-dir` option. See also [C API Client Plugin Interface](/doc/c-api/5.7/en/c-api-plugin-interface.html).

* Proxy user support by a connector depends, as described earlier in this section, on whether the authentication methods that it supports permit proxy users.
