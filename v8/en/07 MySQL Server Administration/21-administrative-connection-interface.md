#### 7.1.12.2 Administrative Connection Management

As mentioned in Connection Volume Management, to allow for the need to perform administrative operations even when  `max_connections` connections are already established on the interfaces used for ordinary connections, the MySQL server permits a single administrative connection to users who have the `CONNECTION_ADMIN` privilege (or the deprecated  `SUPER` privilege).

The server also permits dedicating a TCP/IP port for administrative connections, as described in the following sections.

*  Administrative Interface Characteristics
*  Administrative Interface Support for Encrypted Connections

##### Administrative Interface Characteristics

The administrative connection interface has these characteristics:

* The server enables the interface only if the `admin_address` system variable is set at startup to indicate the IP address for it. If `admin_address` is not set, the server maintains no administrative interface.
* The  `admin_port` system variable specifies the interface TCP/IP port number (default 33062).
* There is no limit on the number of administrative connections, but connections are permitted only for users who have the `SERVICE_CONNECTION_ADMIN` privilege.
* The `create_admin_listener_thread` system variable enables DBAs to choose at startup whether the administrative interface has its own separate thread. The default is `OFF`; that is, the manager thread for ordinary connections on the main interface also handles connections for the administrative interface.

These lines in the server `my.cnf` file enable the administrative interface on the loopback interface and configure it to use port number 33064 (that is, a port different from the default):

```
[mysqld]
admin_address=127.0.0.1
admin_port=33064
```

MySQL client programs connect to either the main or administrative interface by specifying appropriate connection parameters. If the server running on the local host is using the default TCP/IP port numbers of 3306 and 33062 for the main and administrative interfaces, these commands connect to those interfaces:

```
mysql --protocol=TCP --port=3306
mysql --protocol=TCP --port=33062
```

##### Administrative Interface Support for Encrypted Connections

The administrative interface has its own configuration parameters for encrypted connections. These correspond to the main interface parameters but enable independent configuration of encrypted connections for the administrative interface:

The `admin_tls_xxx` and `admin_ssl_xxx` system variables are like the `tls_xxx` and `ssl_xxx` system variables, but they configure the TLS context for the administrative interface rather than the main interface.

For general information about configuring connection-encryption support, see Section 8.3.1, “Configuring MySQL to Use Encrypted Connections”, and Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”. That discussion is written for the main connection interface, but the parameter names are similar for the administrative connection interface. Use that discussion together with the following remarks, which provide information specific to the administrative interface.

TLS configuration for the administrative interface follows these rules:

* The administrative interface supports encrypted connections. For connections on the interface, the applicable TLS context depends on whether any nondefault administrative TLS parameter is configured:

  + If all administrative TLS parameters have their default values, the administrative interface uses the same TLS context as the main interface.
  + If any administrative TLS parameter has a nondefault value, the administrative interface uses the TLS context defined by its own parameters. (This is the case if any `admin_tls_xxx` or `admin_ssl_xxx` system variable is set to a value different from its default.) If a valid TLS context cannot be created from those parameters, the administrative interface falls back to the main interface TLS context.
* It is possible to disable encrypted connections to the administrative interface by setting the `admin_tls_version` system variable to the empty value to indicate that no TLS versions are supported. For example, these lines in the server `my.cnf` file disable encrypted connections on the administrative interface:

  ```
  [mysqld]
  admin_tls_version=''
  ```

Examples:

* This configuration in the server `my.cnf` file enables the administrative interface, but does not set any of the TLS parameters specific to that interface:

  ```
  [mysqld]
  admin_address=127.0.0.1
  ```

  As a result, the administrative interface supports encrypted connections (because encryption is supported by default when the administrative interface is enabled), and uses the main interface TLS context. When clients connect to the administrative interface, they should use the same certificate and key files as for ordinary connections on the main interface. For example (enter the command on a single line):

  ```
  mysql --protocol=TCP --port=33062
        --ssl-ca=ca.pem
        --ssl-cert=client-cert.pem
        --ssl-key=client-key.pem
  ```
* This server configuration enables the administrative interface and sets the TLS certificate and key file parameters specific to that interface:

  ```
  [mysqld]
  admin_address=127.0.0.1
  admin_ssl_ca=admin-ca.pem
  admin_ssl_cert=admin-server-cert.pem
  admin_ssl_key=admin-server-key.pem
  ```

  As a result, the administrative interface supports encrypted connections using its own TLS context. When clients connect to the administrative interface, they should use certificate and key files specific to that interface. For example (enter the command on a single line):

  ```
  mysql --protocol=TCP --port=33062
        --ssl-ca=admin-ca.pem
        --ssl-cert=admin-client-cert.pem
        --ssl-key=admin-client-key.pem
  ```
