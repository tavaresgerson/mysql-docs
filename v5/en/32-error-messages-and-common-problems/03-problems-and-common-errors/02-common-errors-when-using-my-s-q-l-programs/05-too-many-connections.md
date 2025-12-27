#### B.3.2.5 Too many connections

If clients encounter `Too many connections` errors when attempting to connect to the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server, all available connections are in use by other clients.

The permitted number of connections is controlled by the [`max_connections`](server-system-variables.html#sysvar_max_connections) system variable. To support more connections, set [`max_connections`](server-system-variables.html#sysvar_max_connections) to a larger value.

[**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") actually permits [`max_connections`](server-system-variables.html#sysvar_max_connections)

+ 1 client connections. The extra connection is reserved for use by accounts that have the [`SUPER`](privileges-provided.html#priv_super) privilege. By granting the privilege to administrators and not to normal users (who should not need it), an administrator who also has the [`PROCESS`](privileges-provided.html#priv_process) privilege can connect to the server and use [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") to diagnose problems even if the maximum number of unprivileged clients are connected. See [Section 13.7.5.29, “SHOW PROCESSLIST Statement”](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement").

For more information about how the server handles client connections, see [Section 5.1.11.1, “Connection Interfaces”](connection-interfaces.html "5.1.11.1 Connection Interfaces").
