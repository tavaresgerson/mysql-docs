#### B.3.2.5 Too many connections

If clients encounter `Too many connections` errors when attempting to connect to the **mysqld** server, all available connections are in use by other clients.

The permitted number of connections is controlled by the `max_connections` system variable. To support more connections, set `max_connections` to a larger value.

**mysqld** actually permits `max_connections`

+ 1 client connections. The extra connection is reserved for use by accounts that have the `CONNECTION_ADMIN` privilege (or the deprecated `SUPER` privilege). By granting the privilege to administrators and not to normal users (who should not need it), an administrator can connect to the server and use `SHOW PROCESSLIST` to diagnose problems even if the maximum number of unprivileged clients are connected. See Section 15.7.7.29, “SHOW PROCESSLIST Statement”.

The server also permits administrative connections on a dedicated interface. For more information about how the server handles client connections, see Section 7.1.12.1, “Connection Interfaces”.
