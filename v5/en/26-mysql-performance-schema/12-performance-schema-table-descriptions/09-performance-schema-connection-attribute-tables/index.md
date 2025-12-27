### 25.12.9 Performance Schema Connection Attribute Tables

[25.12.9.1 The session\_account\_connect\_attrs Table](performance-schema-session-account-connect-attrs-table.html)

[25.12.9.2 The session\_connect\_attrs Table](performance-schema-session-connect-attrs-table.html)

Connection attributes are key-value pairs that application programs can pass to the server at connect time. For applications based on the C API implemented by the `libmysqlclient` client library, the [`mysql_options()`](/doc/c-api/5.7/en/mysql-options.html) and [`mysql_options4()`](/doc/c-api/5.7/en/mysql-options4.html) functions define the connection attribute set. Other MySQL Connectors may provide their own attribute-definition methods.

These Performance Schema tables expose attribute information:

* [`session_account_connect_attrs`](performance-schema-session-account-connect-attrs-table.html "25.12.9.1 The session_account_connect_attrs Table"): Connection attributes for the current session, and other sessions associated with the session account

* [`session_connect_attrs`](performance-schema-session-connect-attrs-table.html "25.12.9.2 The session_connect_attrs Table"): Connection attributes for all sessions

Attribute names that begin with an underscore (`_`) are reserved for internal use and should not be created by application programs. This convention permits new attributes to be introduced by MySQL without colliding with application attributes, and enables application programs to define their own attributes that do not collide with internal attributes.

* [Available Connection Atrributes](performance-schema-connection-attribute-tables.html#performance-schema-connection-attributes-available "Available Connection Atrributes")
* [Connection Atrribute Limits](performance-schema-connection-attribute-tables.html#performance-schema-connection-attribute-limits "Connection Atrribute Limits")

#### Available Connection Atrributes

The set of connection attributes visible within a given connection varies depending on factors such as your platform, MySQL Connector used to establish the connection, or client program.

The `libmysqlclient` client library sets these attributes:

* `_client_name`: The client name (`libmysql` for the client library).

* `_client_version`: The client library version.

* `_os`: The operating system (for example, `Linux`, `Win64`).

* `_pid`: The client process ID.
* `_platform`: The machine platform (for example, `x86_64`).

* `_thread`: The client thread ID (Windows only).

Other MySQL Connectors may define their own connection attributes.

MySQL Connector/J defines these attributes:

* `_client_license`: The connector license type.

* `_runtime_vendor`: The Java runtime environment (JRE) vendor.

* `_runtime_version`: The Java runtime environment (JRE) version.

MySQL Connector/NET defines these attributes:

* `_client_version`: The client library version.

* `_os`: The operating system (for example, `Linux`, `Win64`).

* `_pid`: The client process ID.
* `_platform`: The machine platform (for example, `x86_64`).

* `_program_name`: The client name.
* `_thread`: The client thread ID (Windows only).

PHP defines attributes that depend on how it was compiled:

* Compiled using `libmysqlclient`: The standard `libmysqlclient` attributes, described previously.

* Compiled using `mysqlnd`: Only the `_client_name` attribute, with a value of `mysqlnd`.

Many MySQL client programs set a `program_name` attribute with a value equal to the client name. For example, [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") and [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") set `program_name` to `mysqladmin` and `mysqldump`, respectively.

Some MySQL client programs define additional attributes:

* [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files"):

  + `_client_role`: `binary_log_listener`

* Replica connections:

  + `program_name`: `mysqld`

  + `_client_role`: `binary_log_listener`

  + `_client_replication_channel_name`: The channel name.

* [`FEDERATED`](federated-storage-engine.html "15.8 The FEDERATED Storage Engine") storage engine connections:

  + `program_name`: `mysqld`

  + `_client_role`: `federated_storage`

#### Connection Atrribute Limits

There are limits on the amount of connection attribute data transmitted from client to server:

* A fixed limit imposed by the client prior to connect time.
* A fixed limit imposed by the server at connect time.
* A configurable limit imposed by the Performance Schema at connect time.

For connections initiated using the C API, the `libmysqlclient` library imposes a limit of 64KB on the aggregate size of connection attribute data on the client side: Calls to [`mysql_options()`](/doc/c-api/5.7/en/mysql-options.html) that cause this limit to be exceeded produce a [`CR_INVALID_PARAMETER_NO`](/doc/mysql-errors/5.7/en/client-error-reference.html#error_cr_invalid_parameter_no) error. Other MySQL Connectors may impose their own client-side limits on how much connection attribute data can be transmitted to the server.

On the server side, these size checks on connection attribute data occur:

* The server imposes a limit of 64KB on the aggregate size of connection attribute data it can accept. If a client attempts to send more than 64KB of attribute data, the server rejects the connection.

* For accepted connections, the Performance Schema checks aggregate attribute size against the value of the [`performance_schema_session_connect_attrs_size`](performance-schema-system-variables.html#sysvar_performance_schema_session_connect_attrs_size) system variable. If attribute size exceeds this value, these actions take place:

  + The Performance Schema truncates the attribute data and increments the [`Performance_schema_session_connect_attrs_lost`](performance-schema-status-variables.html#statvar_Performance_schema_session_connect_attrs_lost) status variable, which indicates the number of connections for which attribute truncation occurred.

  + The Performance Schema writes a message to the error log if the [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) system variable is greater than 1:

    ```sql
    [Warning] Connection attributes of length N were truncated
    ```
