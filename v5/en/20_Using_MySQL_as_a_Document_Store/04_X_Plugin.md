## 19.4 X Plugin

This section explains how to configure and monitor the X Plugin.


### 19.4.1 Using Encrypted Connections with X Plugin

This section explains how to configure X Plugin to use encrypted
connections. For more background information, see
[Section 6.3, “Using Encrypted Connections”](encrypted-connections.html "6.3 Using Encrypted Connections").

To enable configuring support for encrypted connections, X Plugin
has `mysqlx_ssl_xxx`
system variables, which can have different values from the
`ssl_xxx` system
variables used with MySQL Server. For example, X Plugin can have
SSL key, certificate, and certificate authority files that differ
from those used for MySQL Server. These variables are described at
[Section 19.4.2.2, “X Plugin Options and System Variables”](x-plugin-options-system-variables.html "19.4.2.2 X Plugin Options and System Variables"). Similarly,
X Plugin has its own
`Mysqlx_ssl_xxx`
status variables that correspond to the MySQL Server
encrypted-connection
`Ssl_xxx` status
variables. See [Section 19.4.2.3, “X Plugin Status Variables”](x-plugin-status-variables.html "19.4.2.3 X Plugin Status Variables").

At initialization, X Plugin determines its configuration for
encrypted connections as follows:

* If all
  `mysqlx_ssl_xxx`
  system variables have their default values, X Plugin
  configures encrypted connections using the values of the MySQL
  Server `ssl_xxx`
  system variables.

* If any
  `mysqlx_ssl_xxx`
  variable has a nondefault value, X Plugin configures
  encrypted connections using the values of its own system
  variables. (This is the case if any
  `mysqlx_ssl_xxx`
  system variable is set to a value different from its default.)

This means that, on a server with X Plugin enabled, you can
choose to have MySQL Protocol and X Protocol connections share
the same encryption configuration by setting only the
`ssl_xxx` variables,
or have separate encryption configurations for MySQL Protocol and
X Protocol connections by configuring the
`ssl_xxx` and
`mysqlx_ssl_xxx`
variables separately.

To have MySQL Protocol and X Protocol connections use the same
encryption configuration, set only the
`ssl_xxx` system
variables in `my.cnf`:

```sql
[mysqld]
ssl_ca=ca.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
```

To configure encryption separately for MySQL Protocol and
X Protocol connections, set both the
`ssl_xxx` and
`mysqlx_ssl_xxx`
system variables in `my.cnf`:

```sql
[mysqld]
ssl_ca=ca1.pem
ssl_cert=server-cert1.pem
ssl_key=server-key1.pem

mysqlx_ssl_ca=ca2.pem
mysqlx_ssl_cert=server-cert2.pem
mysqlx_ssl_key=server-key2.pem
```

For general information about configuring connection-encryption
support, see [Section 6.3.1, “Configuring MySQL to Use Encrypted Connections”](using-encrypted-connections.html "6.3.1 Configuring MySQL to Use Encrypted Connections"). That
discussion is written for MySQL Server, but the parameter names
are similar for X Plugin. (The X Plugin
`mysqlx_ssl_xxx`
system variable names correspond to the MySQL Server
`ssl_xxx` system
variable names.)

The [`tls_version`](server-system-variables.html#sysvar_tls_version) system variable
that determines the permitted TLS versions for MySQL Protocol
connections also applies to X Protocol connections. The permitted
TLS versions for both types of connections are therefore the same.

Encryption per connection is optional, but a specific user can be
required to use encryption for X Protocol and MySQL Protocol
connections by including an appropriate `REQUIRE`
clause in the [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") statement
that creates the user. For details, see
[Section 13.7.1.2, “CREATE USER Statement”](create-user.html "13.7.1.2 CREATE USER Statement"). Alternatively, to require all users
to use encryption for X Protocol and MySQL Protocol connections,
enable the
[`require_secure_transport`](server-system-variables.html#sysvar_require_secure_transport) system
variable. For additional information, see
[Configuring Encrypted Connections as Mandatory](using-encrypted-connections.html#mandatory-encrypted-connections "Configuring Encrypted Connections as Mandatory").


### 19.4.2 X Plugin Options and Variables

This section describes the command options and system variables
that configure X Plugin, as well as the status variables
available for monitoring purposes. If configuration values
specified at startup time are incorrect, X Plugin could fail to
initialize properly and the server does not load it. In this case,
the server could also produce error messages for other X Plugin
settings because it cannot recognize them.


#### 19.4.2.1 X Plugin Option and Variable Reference

This table provides an overview of the command options, system
variables, and status variables provided by X Plugin.

**Table 19.1 X Plugin Option and Variable Reference**

<table frame="box" rules="all" summary="Reference for X Plugin command-line options, system variables, and status variables."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th>Name</th>
<th>Cmd-Line</th>
<th>Option File</th>
<th>System Var</th>
<th>Status Var</th>
<th>Var Scope</th>
<th>Dynamic</th>
</tr></thead><tbody><tr><th>mysqlx</th>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr><tr><th>Mysqlx_address</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>mysqlx_bind_address</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_bytes_received</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_bytes_sent</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>mysqlx_connect_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr><tr><th>Mysqlx_connection_accept_errors</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_connection_errors</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_connections_accepted</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_connections_closed</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_connections_rejected</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_crud_create_view</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_crud_delete</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_crud_drop_view</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_crud_find</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_crud_insert</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_crud_modify_view</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_crud_update</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_errors_sent</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_errors_unknown_message_type</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_expect_close</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_expect_open</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>mysqlx_idle_worker_thread_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr><tr><th>Mysqlx_init_error</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>mysqlx_max_allowed_packet</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr><tr><th>mysqlx_max_connections</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr><tr><th>mysqlx_min_worker_threads</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>Yes</td>
</tr><tr><th>Mysqlx_notice_other_sent</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_notice_warning_sent</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_port</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>mysqlx_port</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr><tr><th>mysqlx_port_open_timeout</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_rows_sent</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_sessions</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_sessions_accepted</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_sessions_closed</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_sessions_fatal_error</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_sessions_killed</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_sessions_rejected</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_socket</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>mysqlx_socket</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_accept_renegotiates</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_accepts</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_active</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>mysqlx_ssl_ca</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr><tr><th>mysqlx_ssl_capath</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr><tr><th>mysqlx_ssl_cert</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_cipher</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>mysqlx_ssl_cipher</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_cipher_list</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>mysqlx_ssl_crl</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr><tr><th>mysqlx_ssl_crlpath</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_ctx_verify_depth</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_ctx_verify_mode</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_finished_accepts</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>mysqlx_ssl_key</th>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td></td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_server_not_after</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_server_not_before</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_verify_depth</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_verify_mode</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_ssl_version</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_create_collection</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_create_collection_index</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_disable_notices</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_drop_collection</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_drop_collection_index</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_enable_notices</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_ensure_collection</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_execute_mysqlx</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_execute_sql</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_execute_xplugin</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_kill_client</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_list_clients</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_list_notices</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_list_objects</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_stmt_ping</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Both</td>
<td>No</td>
</tr><tr><th>Mysqlx_worker_threads</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr><tr><th>Mysqlx_worker_threads_active</th>
<td></td>
<td></td>
<td></td>
<td>Yes</td>
<td>Global</td>
<td>No</td>
</tr></tbody></table>


#### 19.4.2.2 X Plugin Options and System Variables

To control activation of X Plugin, use this option:

* [`--mysqlx[=value]`](x-plugin-options-system-variables.html#option_mysqld_mysqlx)

  <table frame="box" rules="all" summary="Properties for mysqlx"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx[=value]</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.12</td>
</tr><tr><th>Type</th>
<td>Enumeration</td>
</tr><tr><th>Default Value</th>
<td><code>ON</code></td>
</tr><tr><th>Valid Values</th>
<td><code>ON</code><code>OFF</code><code>FORCE</code><code>FORCE_PLUS_PERMANENT</code></td>
</tr></tbody></table>

  This option controls how the server loads X Plugin at
  startup. It is available only if the plugin has been
  previously registered with [`INSTALL
  PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") or is loaded with
  [`--plugin-load`](server-options.html#option_mysqld_plugin-load) or
  [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add).

  The option value should be one of those available for
  plugin-loading options, as described in
  [Section 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins"). For example,
  [`--mysqlx=FORCE_PLUS_PERMANENT`](x-plugin-options-system-variables.html#option_mysqld_mysqlx)
  tells the server to load the plugin and prevent it from
  being removed while the server is running.

If X Plugin is enabled, it exposes several system variables
that permit control over its operation:

* [`mysqlx_bind_address`](x-plugin-options-system-variables.html#sysvar_mysqlx_bind_address)

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-bind-address=addr</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.17</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_bind_address</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code>*</code></td>
</tr></tbody></table>

  The network address on which X Plugin listens for TCP/IP
  connections. This variable is not dynamic and can be
  configured only at startup. This is the X Plugin equivalent
  of the [`bind_address`](server-system-variables.html#sysvar_bind_address) system
  variable; see that variable description for more
  information.

  [`mysqlx_bind_address`](x-plugin-options-system-variables.html#sysvar_mysqlx_bind_address) accepts
  a single address value, which may specify a single
  non-wildcard IP address or host name, or one of the wildcard
  address formats that permit listening on multiple network
  interfaces (`*`,
  `0.0.0.0`, or `::`).

  An IP address can be specified as an IPv4 or IPv6 address.
  If the value is a host name, X Plugin resolves the name to
  an IP address and binds to that address. If a host name
  resolves to multiple IP addresses, X Plugin uses the first
  IPv4 address if there are any, or the first IPv6 address
  otherwise.

  X Plugin treats different types of addresses as follows:

  + If the address is `*`, X Plugin
    accepts TCP/IP connections on all server host IPv4
    interfaces, and, if the server host supports IPv6, on
    all IPv6 interfaces. Use this address to permit both
    IPv4 and IPv6 connections for X Plugin. This value is
    the default.

  + If the address is `0.0.0.0`, X Plugin
    accepts TCP/IP connections on all server host IPv4
    interfaces.

  + If the address is `::`, X Plugin
    accepts TCP/IP connections on all server host IPv4 and
    IPv6 interfaces.

  + If the address is an IPv4-mapped address, X Plugin
    accepts TCP/IP connections for that address, in either
    IPv4 or IPv6 format. For example, if X Plugin is bound
    to `::ffff:127.0.0.1`, a client such as
    MySQL Shell can connect using
    `--host=127.0.0.1` or
    `--host=::ffff:127.0.0.1`.

  + If the address is a “regular” IPv4 or IPv6
    address (such as `127.0.0.1` or
    `::1`), X Plugin accepts TCP/IP
    connections only for that IPv4 or IPv6 address.

  If binding to the address fails, X Plugin produces an error
  and the server does not load it.

* [`mysqlx_connect_timeout`](x-plugin-options-system-variables.html#sysvar_mysqlx_connect_timeout)

  <table frame="box" rules="all" summary="Properties for mysqlx_connect_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-connect-timeout=#</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.12</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_connect_timeout</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>Yes</td>
</tr><tr><th>Type</th>
<td>Integer</td>
</tr><tr><th>Default Value</th>
<td><code>30</code></td>
</tr><tr><th>Minimum Value</th>
<td><code>1</code></td>
</tr><tr><th>Maximum Value</th>
<td><code>1000000000</code></td>
</tr><tr><th>Unit</th>
<td>seconds</td>
</tr></tbody></table>

  The number of seconds X Plugin waits for the first packet
  to be received from newly connected clients. This is the
  X Plugin equivalent of
  [`connect_timeout`](server-system-variables.html#sysvar_connect_timeout); see that
  variable description for more information.

* [`mysqlx_idle_worker_thread_timeout`](x-plugin-options-system-variables.html#sysvar_mysqlx_idle_worker_thread_timeout)

  <table frame="box" rules="all" summary="Properties for mysqlx_idle_worker_thread_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-idle-worker-thread-timeout=#</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.12</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_idle_worker_thread_timeout</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>Yes</td>
</tr><tr><th>Type</th>
<td>Integer</td>
</tr><tr><th>Default Value</th>
<td><code>60</code></td>
</tr><tr><th>Minimum Value</th>
<td><code>0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code>3600</code></td>
</tr><tr><th>Unit</th>
<td>seconds</td>
</tr></tbody></table>

  The number of seconds after which idle worker threads are
  terminated.

* [`mysqlx_max_allowed_packet`](x-plugin-options-system-variables.html#sysvar_mysqlx_max_allowed_packet)

  <table frame="box" rules="all" summary="Properties for mysqlx_max_allowed_packet"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-max-allowed-packet=#</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.12</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_max_allowed_packet</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>Yes</td>
</tr><tr><th>Type</th>
<td>Integer</td>
</tr><tr><th>Default Value</th>
<td><code>67108864</code></td>
</tr><tr><th>Minimum Value</th>
<td><code>512</code></td>
</tr><tr><th>Maximum Value</th>
<td><code>1073741824</code></td>
</tr><tr><th>Unit</th>
<td>bytes</td>
</tr></tbody></table>

  The maximum size of network packets that can be received by
  X Plugin. This is the X Plugin equivalent of
  [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet); see
  that variable description for more information.

* [`mysqlx_max_connections`](x-plugin-options-system-variables.html#sysvar_mysqlx_max_connections)

  <table frame="box" rules="all" summary="Properties for mysqlx_max_connections"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-max-connections=#</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.12</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_max_connections</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>Yes</td>
</tr><tr><th>Type</th>
<td>Integer</td>
</tr><tr><th>Default Value</th>
<td><code>100</code></td>
</tr><tr><th>Minimum Value</th>
<td><code>1</code></td>
</tr><tr><th>Maximum Value</th>
<td><code>65535</code></td>
</tr></tbody></table>

  The maximum number of concurrent client connections
  X Plugin can accept. This is the X Plugin equivalent of
  [`max_connections`](server-system-variables.html#sysvar_max_connections); see that
  variable description for more information.

  For modifications to this variable, if the new value is
  smaller than the current number of connections, the new
  limit is taken into account only for new connections.

* [`mysqlx_min_worker_threads`](x-plugin-options-system-variables.html#sysvar_mysqlx_min_worker_threads)

  <table frame="box" rules="all" summary="Properties for mysqlx_min_worker_threads"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-min-worker-threads=#</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.12</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_min_worker_threads</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>Yes</td>
</tr><tr><th>Type</th>
<td>Integer</td>
</tr><tr><th>Default Value</th>
<td><code>2</code></td>
</tr><tr><th>Minimum Value</th>
<td><code>1</code></td>
</tr><tr><th>Maximum Value</th>
<td><code>100</code></td>
</tr></tbody></table>

  The minimum number of worker threads used by X Plugin for
  handling client requests.

* [`mysqlx_port`](x-plugin-options-system-variables.html#sysvar_mysqlx_port)

  <table frame="box" rules="all" summary="Properties for mysqlx_port"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-port=port_num</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.12</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_port</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>Integer</td>
</tr><tr><th>Default Value</th>
<td><code>33060</code></td>
</tr><tr><th>Minimum Value</th>
<td><code>1</code></td>
</tr><tr><th>Maximum Value</th>
<td><code>65535</code></td>
</tr></tbody></table>

  The network port on which X Plugin listens for TCP/IP
  connections. This is the X Plugin equivalent of
  [`port`](server-system-variables.html#sysvar_port); see that variable
  description for more information.

* [`mysqlx_port_open_timeout`](x-plugin-options-system-variables.html#sysvar_mysqlx_port_open_timeout)

  <table frame="box" rules="all" summary="Properties for mysqlx_port_open_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-port-open-timeout=#</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.17</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_port_open_timeout</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>Integer</td>
</tr><tr><th>Default Value</th>
<td><code>0</code></td>
</tr><tr><th>Minimum Value</th>
<td><code>0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code>120</code></td>
</tr><tr><th>Unit</th>
<td>seconds</td>
</tr></tbody></table>

  The number of seconds X Plugin waits for a TCP/IP port to
  become free.

* [`mysqlx_socket`](x-plugin-options-system-variables.html#sysvar_mysqlx_socket)

  <table frame="box" rules="all" summary="Properties for mysqlx_socket"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-socket=file_name</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.15</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_socket</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code>/tmp/mysqlx.sock</code></td>
</tr></tbody></table>

  The path to a Unix socket file which X Plugin uses for
  connections. This setting is only used by MySQL Server when
  running on Unix operating systems. Clients can use this
  socket to connect to MySQL Server using X Plugin.

  The default [`mysqlx_socket`](x-plugin-options-system-variables.html#sysvar_mysqlx_socket)
  path and file name is based on the default path and file
  name for the main socket file for MySQL Server, with the
  addition of an `x` appended to the file
  name. The default path and file name for the main socket
  file is `/tmp/mysql.sock`, therefore the
  default path and file name for the X Plugin socket file is
  `/tmp/mysqlx.sock`.

  If you specify an alternative path and file name for the
  main socket file at server startup using the
  [`socket`](server-system-variables.html#sysvar_socket) system variable,
  this does not affect the default for the X Plugin socket
  file. In this situation, if you want to store both sockets
  at a single path, you must set the
  [`mysqlx_socket`](x-plugin-options-system-variables.html#sysvar_mysqlx_socket) system
  variable as well. For example in a configuration file:

  ```sql
  socket=/home/sockets/mysqld/mysql.sock
  mysqlx_socket=/home/sockets/xplugin/xplugin.sock
  ```

  If you change the default path and file name for the main
  socket file at compile time using the
  [`MYSQL_UNIX_ADDR`](source-configuration-options.html#option_cmake_mysql_unix_addr) compile
  option, this does affect the default for the X Plugin
  socket file, which is formed by appending an
  `x` to the
  [`MYSQL_UNIX_ADDR`](source-configuration-options.html#option_cmake_mysql_unix_addr) file name. If
  you want to set a different default for the X Plugin socket
  file at compile time, use the
  [`MYSQLX_UNIX_ADDR`](source-configuration-options.html#option_cmake_mysqlx_unix_addr) compile
  option.

  The `MYSQLX_UNIX_PORT` environment variable
  can also be used to set a default for the X Plugin socket
  file at server startup (see
  [Section 4.9, “Environment Variables”](environment-variables.html "4.9 Environment Variables")). If you set this
  environment variable, it overrides the compiled
  [`MYSQLX_UNIX_ADDR`](source-configuration-options.html#option_cmake_mysqlx_unix_addr) value, but is
  overridden by the
  [`mysqlx_socket`](x-plugin-options-system-variables.html#sysvar_mysqlx_socket) value.

* [`mysqlx_ssl_ca`](x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_ca)

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-bind-address=addr</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.17</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_bind_address</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code>*</code></td>
</tr></tbody></table>0

  The [`mysqlx_ssl_ca`](x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_ca) system
  variable is like [`ssl_ca`](server-system-variables.html#sysvar_ssl_ca),
  except that it applies to X Plugin rather than the MySQL
  Server main connection interface. For information about
  configuring encryption support for X Plugin, see
  [Section 19.4.1, “Using Encrypted Connections with X Plugin”](x-plugin-encrypted-connections.html "19.4.1 Using Encrypted Connections with X Plugin").

* [`mysqlx_ssl_capath`](x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_capath)

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-bind-address=addr</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.17</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_bind_address</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code>*</code></td>
</tr></tbody></table>1

  The [`mysqlx_ssl_capath`](x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_capath)
  system variable is like
  [`ssl_capath`](server-system-variables.html#sysvar_ssl_capath), except that it
  applies to X Plugin rather than the MySQL Server main
  connection interface. For information about configuring
  encryption support for X Plugin, see
  [Section 19.4.1, “Using Encrypted Connections with X Plugin”](x-plugin-encrypted-connections.html "19.4.1 Using Encrypted Connections with X Plugin").

* [`mysqlx_ssl_cert`](x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_cert)

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-bind-address=addr</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.17</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_bind_address</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code>*</code></td>
</tr></tbody></table>2

  The [`mysqlx_ssl_cert`](x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_cert) system
  variable is like [`ssl_cert`](server-system-variables.html#sysvar_ssl_cert),
  except that it applies to X Plugin rather than the MySQL
  Server main connection interface. For information about
  configuring encryption support for X Plugin, see
  [Section 19.4.1, “Using Encrypted Connections with X Plugin”](x-plugin-encrypted-connections.html "19.4.1 Using Encrypted Connections with X Plugin").

* [`mysqlx_ssl_cipher`](x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_cipher)

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-bind-address=addr</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.17</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_bind_address</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code>*</code></td>
</tr></tbody></table>3

  The [`mysqlx_ssl_cipher`](x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_cipher)
  system variable is like
  [`ssl_cipher`](server-system-variables.html#sysvar_ssl_cipher), except that it
  applies to X Plugin rather than the MySQL Server main
  connection interface. For information about configuring
  encryption support for X Plugin, see
  [Section 19.4.1, “Using Encrypted Connections with X Plugin”](x-plugin-encrypted-connections.html "19.4.1 Using Encrypted Connections with X Plugin").

* [`mysqlx_ssl_crl`](x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_crl)

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-bind-address=addr</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.17</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_bind_address</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code>*</code></td>
</tr></tbody></table>4

  The [`mysqlx_ssl_crl`](x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_crl) system
  variable is like [`ssl_crl`](server-system-variables.html#sysvar_ssl_crl),
  except that it applies to X Plugin rather than the MySQL
  Server main connection interface. For information about
  configuring encryption support for X Plugin, see
  [Section 19.4.1, “Using Encrypted Connections with X Plugin”](x-plugin-encrypted-connections.html "19.4.1 Using Encrypted Connections with X Plugin").

* [`mysqlx_ssl_crlpath`](x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_crlpath)

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-bind-address=addr</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.17</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_bind_address</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code>*</code></td>
</tr></tbody></table>5

  The [`mysqlx_ssl_crlpath`](x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_crlpath)
  system variable is like
  [`ssl_crlpath`](server-system-variables.html#sysvar_ssl_crlpath), except that it
  applies to X Plugin rather than the MySQL Server main
  connection interface. For information about configuring
  encryption support for X Plugin, see
  [Section 19.4.1, “Using Encrypted Connections with X Plugin”](x-plugin-encrypted-connections.html "19.4.1 Using Encrypted Connections with X Plugin").

* [`mysqlx_ssl_key`](x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_key)

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqlx-bind-address=addr</code></td>
</tr><tr><th>Introduced</th>
<td>5.7.17</td>
</tr><tr><th>System Variable</th>
<td><code>mysqlx_bind_address</code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code>*</code></td>
</tr></tbody></table>6

  The [`mysqlx_ssl_key`](x-plugin-options-system-variables.html#sysvar_mysqlx_ssl_key) system
  variable is like [`ssl_key`](server-system-variables.html#sysvar_ssl_key),
  except that it applies to X Plugin rather than the MySQL
  Server main connection interface. For information about
  configuring encryption support for X Plugin, see
  [Section 19.4.1, “Using Encrypted Connections with X Plugin”](x-plugin-encrypted-connections.html "19.4.1 Using Encrypted Connections with X Plugin").


#### 19.4.2.3 X Plugin Status Variables

The X Plugin status variables have the following meanings.

* [`Mysqlx_address`](x-plugin-status-variables.html#statvar_Mysqlx_address)

  The network address which X Plugin is bound to. If the bind
  has failed, or if the
  [`skip_networking`](server-system-variables.html#sysvar_skip_networking) option has
  been used, the value shows `UNDEFINED`.

* [`Mysqlx_bytes_received`](x-plugin-status-variables.html#statvar_Mysqlx_bytes_received)

  The number of bytes received through the network.

* [`Mysqlx_bytes_sent`](x-plugin-status-variables.html#statvar_Mysqlx_bytes_sent)

  The number of bytes sent through the network.

* [`Mysqlx_connection_accept_errors`](x-plugin-status-variables.html#statvar_Mysqlx_connection_accept_errors)

  The number of connections which have caused accept errors.

* [`Mysqlx_connection_errors`](x-plugin-status-variables.html#statvar_Mysqlx_connection_errors)

  The number of connections which have caused errors.

* [`Mysqlx_connections_accepted`](x-plugin-status-variables.html#statvar_Mysqlx_connections_accepted)

  The number of connections which have been accepted.

* [`Mysqlx_connections_closed`](x-plugin-status-variables.html#statvar_Mysqlx_connections_closed)

  The number of connections which have been closed.

* [`Mysqlx_connections_rejected`](x-plugin-status-variables.html#statvar_Mysqlx_connections_rejected)

  The number of connections which have been rejected.

* [`Mysqlx_crud_create_view`](x-plugin-status-variables.html#statvar_Mysqlx_crud_create_view)

  The number of create view requests received.

* [`Mysqlx_crud_delete`](x-plugin-status-variables.html#statvar_Mysqlx_crud_delete)

  The number of delete requests received.

* [`Mysqlx_crud_drop_view`](x-plugin-status-variables.html#statvar_Mysqlx_crud_drop_view)

  The number of drop view requests received.

* [`Mysqlx_crud_find`](x-plugin-status-variables.html#statvar_Mysqlx_crud_find)

  The number of find requests received.

* [`Mysqlx_crud_insert`](x-plugin-status-variables.html#statvar_Mysqlx_crud_insert)

  The number of insert requests received.

* [`Mysqlx_crud_modify_view`](x-plugin-status-variables.html#statvar_Mysqlx_crud_modify_view)

  The number of modify view requests received.

* [`Mysqlx_crud_update`](x-plugin-status-variables.html#statvar_Mysqlx_crud_update)

  The number of update requests received.

* [`Mysqlx_errors_sent`](x-plugin-status-variables.html#statvar_Mysqlx_errors_sent)

  The number of errors sent to clients.

* [`Mysqlx_errors_unknown_message_type`](x-plugin-status-variables.html#statvar_Mysqlx_errors_unknown_message_type)

  The number of unknown message types that have been received.

* [`Mysqlx_expect_close`](x-plugin-status-variables.html#statvar_Mysqlx_expect_close)

  The number of expectation blocks closed.

* [`Mysqlx_expect_open`](x-plugin-status-variables.html#statvar_Mysqlx_expect_open)

  The number of expectation blocks opened.

* [`Mysqlx_init_error`](x-plugin-status-variables.html#statvar_Mysqlx_init_error)

  The number of errors during initialisation.

* [`Mysqlx_notice_other_sent`](x-plugin-status-variables.html#statvar_Mysqlx_notice_other_sent)

  The number of other types of notices sent back to clients.

* [`Mysqlx_notice_warning_sent`](x-plugin-status-variables.html#statvar_Mysqlx_notice_warning_sent)

  The number of warning notices sent back to clients.

* [`Mysqlx_port`](x-plugin-status-variables.html#statvar_Mysqlx_port)

  The TCP port which X Plugin is listening to. If a network
  bind has failed, or if the
  [`skip_networking`](server-system-variables.html#sysvar_skip_networking) system
  variable is enabled, the value shows
  `UNDEFINED`.

* [`Mysqlx_rows_sent`](x-plugin-status-variables.html#statvar_Mysqlx_rows_sent)

  The number of rows sent back to clients.

* [`Mysqlx_sessions`](x-plugin-status-variables.html#statvar_Mysqlx_sessions)

  The number of sessions that have been opened.

* [`Mysqlx_sessions_accepted`](x-plugin-status-variables.html#statvar_Mysqlx_sessions_accepted)

  The number of session attempts which have been accepted.

* [`Mysqlx_sessions_closed`](x-plugin-status-variables.html#statvar_Mysqlx_sessions_closed)

  The number of sessions that have been closed.

* [`Mysqlx_sessions_fatal_error`](x-plugin-status-variables.html#statvar_Mysqlx_sessions_fatal_error)

  The number of sessions that have closed with a fatal error.

* [`Mysqlx_sessions_killed`](x-plugin-status-variables.html#statvar_Mysqlx_sessions_killed)

  The number of sessions which have been killed.

* [`Mysqlx_sessions_rejected`](x-plugin-status-variables.html#statvar_Mysqlx_sessions_rejected)

  The number of session attempts which have been rejected.

* [`Mysqlx_socket`](x-plugin-status-variables.html#statvar_Mysqlx_socket)

  The Unix socket which X Plugin is listening to.

* [`Mysqlx_ssl_accept_renegotiates`](x-plugin-status-variables.html#statvar_Mysqlx_ssl_accept_renegotiates)

  The number of negotiations needed to establish the
  connection.

* [`Mysqlx_ssl_accepts`](x-plugin-status-variables.html#statvar_Mysqlx_ssl_accepts)

  The number of accepted SSL connections.

* [`Mysqlx_ssl_active`](x-plugin-status-variables.html#statvar_Mysqlx_ssl_active)

  If SSL is active.

* [`Mysqlx_ssl_cipher`](x-plugin-status-variables.html#statvar_Mysqlx_ssl_cipher)

  The current SSL cipher (empty for non-SSL connections).

* [`Mysqlx_ssl_cipher_list`](x-plugin-status-variables.html#statvar_Mysqlx_ssl_cipher_list)

  A list of possible SSL ciphers (empty for non-SSL
  connections).

* [`Mysqlx_ssl_ctx_verify_depth`](x-plugin-status-variables.html#statvar_Mysqlx_ssl_ctx_verify_depth)

  The certificate verification depth limit currently set in
  ctx.

* [`Mysqlx_ssl_ctx_verify_mode`](x-plugin-status-variables.html#statvar_Mysqlx_ssl_ctx_verify_mode)

  The certificate verification mode currently set in ctx.

* [`Mysqlx_ssl_finished_accepts`](x-plugin-status-variables.html#statvar_Mysqlx_ssl_finished_accepts)

  The number of successful SSL connections to the server.

* [`Mysqlx_ssl_server_not_after`](x-plugin-status-variables.html#statvar_Mysqlx_ssl_server_not_after)

  The last date for which the SSL certificate is valid.

* [`Mysqlx_ssl_server_not_before`](x-plugin-status-variables.html#statvar_Mysqlx_ssl_server_not_before)

  The first date for which the SSL certificate is valid.

* [`Mysqlx_ssl_verify_depth`](x-plugin-status-variables.html#statvar_Mysqlx_ssl_verify_depth)

  The certificate verification depth for SSL connections.

* [`Mysqlx_ssl_verify_mode`](x-plugin-status-variables.html#statvar_Mysqlx_ssl_verify_mode)

  The certificate verification mode for SSL connections.

* [`Mysqlx_ssl_version`](x-plugin-status-variables.html#statvar_Mysqlx_ssl_version)

  The name of the protocol used for SSL connections.

* [`Mysqlx_stmt_create_collection`](x-plugin-status-variables.html#statvar_Mysqlx_stmt_create_collection)

  The number of create collection statements received.

* [`Mysqlx_stmt_create_collection_index`](x-plugin-status-variables.html#statvar_Mysqlx_stmt_create_collection_index)

  The number of create collection index statements received.

* [`Mysqlx_stmt_disable_notices`](x-plugin-status-variables.html#statvar_Mysqlx_stmt_disable_notices)

  The number of disable notice statements received.

* [`Mysqlx_stmt_drop_collection`](x-plugin-status-variables.html#statvar_Mysqlx_stmt_drop_collection)

  The number of drop collection statements received.

* [`Mysqlx_stmt_drop_collection_index`](x-plugin-status-variables.html#statvar_Mysqlx_stmt_drop_collection_index)

  The number of drop collection index statements received.

* [`Mysqlx_stmt_enable_notices`](x-plugin-status-variables.html#statvar_Mysqlx_stmt_enable_notices)

  The number of enable notice statements received.

* [`Mysqlx_stmt_ensure_collection`](x-plugin-status-variables.html#statvar_Mysqlx_stmt_ensure_collection)

  The number of ensure collection statements received.

* [`Mysqlx_stmt_execute_mysqlx`](x-plugin-status-variables.html#statvar_Mysqlx_stmt_execute_mysqlx)

  The number of StmtExecute messages received with namespace
  set to `mysqlx`.

* [`Mysqlx_stmt_execute_sql`](x-plugin-status-variables.html#statvar_Mysqlx_stmt_execute_sql)

  The number of StmtExecute requests received for the SQL
  namespace.

* [`Mysqlx_stmt_execute_xplugin`](x-plugin-status-variables.html#statvar_Mysqlx_stmt_execute_xplugin)

  The number of StmtExecute requests received for the
  X Plugin namespace.

* [`Mysqlx_stmt_kill_client`](x-plugin-status-variables.html#statvar_Mysqlx_stmt_kill_client)

  The number of kill client statements received.

* [`Mysqlx_stmt_list_clients`](x-plugin-status-variables.html#statvar_Mysqlx_stmt_list_clients)

  The number of list client statements received.

* [`Mysqlx_stmt_list_notices`](x-plugin-status-variables.html#statvar_Mysqlx_stmt_list_notices)

  The number of list notice statements received.

* [`Mysqlx_stmt_list_objects`](x-plugin-status-variables.html#statvar_Mysqlx_stmt_list_objects)

  The number of list object statements received.

* [`Mysqlx_stmt_ping`](x-plugin-status-variables.html#statvar_Mysqlx_stmt_ping)

  The number of ping statements received.

* [`Mysqlx_worker_threads`](x-plugin-status-variables.html#statvar_Mysqlx_worker_threads)

  The number of worker threads available.

* [`Mysqlx_worker_threads_active`](x-plugin-status-variables.html#statvar_Mysqlx_worker_threads_active)

  The number of worker threads currently used.


### 19.4.3 Monitoring X Plugin

To monitor X Plugin, use the status variables that it exposes.
See [Section 19.4.2.3, “X Plugin Status Variables”](x-plugin-status-variables.html "19.4.2.3 X Plugin Status Variables").
