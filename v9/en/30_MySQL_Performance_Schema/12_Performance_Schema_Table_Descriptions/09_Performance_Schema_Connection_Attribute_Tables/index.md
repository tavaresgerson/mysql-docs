### 29.12.9 Performance Schema Connection Attribute Tables

[29.12.9.1 The session\_account\_connect\_attrs Table](performance-schema-session-account-connect-attrs-table.html)

[29.12.9.2 The session\_connect\_attrs Table](performance-schema-session-connect-attrs-table.html)

Connection attributes are key-value pairs that application
programs can pass to the server at connect time. For
applications based on the C API implemented by the
`libmysqlclient` client library, the
[`mysql_options()`](/doc/c-api/9.5/en/mysql-options.html) and
[`mysql_options4()`](/doc/c-api/9.5/en/mysql-options4.html) functions
define the connection attribute set. Other MySQL Connectors may
provide their own attribute-definition methods.

These Performance Schema tables expose attribute information:

* [`session_account_connect_attrs`](performance-schema-session-account-connect-attrs-table.html "29.12.9.1 The session_account_connect_attrs Table"):
  Connection attributes for the current session, and other
  sessions associated with the session account

* [`session_connect_attrs`](performance-schema-session-connect-attrs-table.html "29.12.9.2 The session_connect_attrs Table"):
  Connection attributes for all sessions

In addition, connect events written to the audit log may include
connection attributes. See
[Section 8.4.6.4, “Audit Log File Formats”](audit-log-file-formats.html "8.4.6.4 Audit Log File Formats").

Attribute names that begin with an underscore
(`_`) are reserved for internal use and should
not be created by application programs. This convention permits
new attributes to be introduced by MySQL without colliding with
application attributes, and enables application programs to
define their own attributes that do not collide with internal
attributes.

* [Available Connection Attributes](performance-schema-connection-attribute-tables.html#performance-schema-connection-attributes-available "Available Connection Attributes")
* [Connection Attribute Limits](performance-schema-connection-attribute-tables.html#performance-schema-connection-attribute-limits "Connection Attribute Limits")

#### Available Connection Attributes

The set of connection attributes visible within a given
connection varies depending on factors such as your platform,
MySQL Connector used to establish the connection, or client
program.

The `libmysqlclient` client library sets these
attributes:

* `_client_name`: The client name
  (`libmysql` for the client library).

* `_client_version`: The client library
  version.

* `_os`: The operating system (for example,
  `Linux`, `Win64`).

* `_pid`: The client process ID.
* `_platform`: The machine platform (for
  example, `x86_64`).

* `_thread`: The client thread ID (Windows
  only).

Other MySQL Connectors may define their own connection
attributes.

MySQL Connector/C++ defines these attributes for applications that use
X DevAPI or X DevAPI for C:

* `_client_license`: The connector license
  (for example `GPL-2.0`).

* `_client_name`: The connector name
  (`mysql-connector-cpp`).

* `_client_version`: The connector version.
* `_os`: The operating system (for example,
  `Linux`, `Win64`).

* `_pid`: The client process ID.
* `_platform`: The machine platform (for
  example, `x86_64`).

* `_source_host`: The host name of the
  machine on which the client is running.

* `_thread`: The client thread ID (Windows
  only).

MySQL Connector/J defines these attributes:

* `_client_name`: The client name
* `_client_version`: The client library
  version

* `_os`: The operating system (for example,
  `Linux`, `Win64`)

* `_client_license`: The connector license
  type

* `_platform`: The machine platform (for
  example, `x86_64`)

* `_runtime_vendor`: The Java runtime
  environment (JRE) vendor

* `_runtime_version`: The Java runtime
  environment (JRE) version

MySQL Connector/NET defines these attributes:

* `_client_version`: The client library
  version.

* `_os`: The operating system (for example,
  `Linux`, `Win64`).

* `_pid`: The client process ID.
* `_platform`: The machine platform (for
  example, `x86_64`).

* `_program_name`: The client name.
* `_thread`: The client thread ID (Windows
  only).

The Connector/Python implementation defines these attributes; some values
and attributes depend on the Connector/Python implementation (pure python
or c-ext):

* `_client_license`: The license type of the
  connector; `GPL-2.0` or
  `Commercial`. (pure python only)

* `_client_name`: Set to
  `mysql-connector-python` (pure python) or
  `libmysql` (c-ext)

* `_client_version`: The connector version
  (pure python) or mysqlclient library version (c-ext).

* `_os`: The operating system with the
  connector (for example, `Linux`,
  `Win64`).

* `_pid`: The process identifier on the
  source machine (for example, `26955`)

* `_platform`: The machine platform (for
  example, `x86_64`).

* `_source_host`: The host name of the
  machine on which the connector is connecting from.

* `_connector_version`: The connector version
  (for example, `9.5.0`) (c-ext
  only).

* `_connector_license`: The license type of
  the connector; `GPL-2.0` or
  `Commercial` (c-ext only).

* `_connector_name`: Always set to
  `mysql-connector-python` (c-ext only).

PHP defines attributes that depend on how it was compiled:

* Compiled using `libmysqlclient`: The
  standard `libmysqlclient` attributes,
  described previously.

* Compiled using `mysqlnd`: Only the
  `_client_name` attribute, with a value of
  `mysqlnd`.

Many MySQL client programs set a `program_name`
attribute with a value equal to the client name. For example,
[**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") and [**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program")
set `program_name` to
`mysqladmin` and `mysqldump`,
respectively. MySQL Shell sets `program_name`
to `mysqlsh`.

Some MySQL client programs define additional attributes:

* [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client"):

  + `os_user`: The name of the operating
    system user running the program. Available on Unix and
    Unix-like systems and Windows.

  + `os_sudouser`: The value of the
    `SUDO_USER` environment variable.
    Available on Unix and Unix-like systems.

  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") connection attributes for which the
  value is empty are not sent.

* [**mysqlbinlog**](mysqlbinlog.html "6.6.9 mysqlbinlog — Utility for Processing Binary Log Files"):

  + `_client_role`:
    `binary_log_listener`

* Replica connections:

  + `program_name`:
    `mysqld`

  + `_client_role`:
    `binary_log_listener`

  + `_client_replication_channel_name`: The
    channel name.

* [`FEDERATED`](federated-storage-engine.html "18.8 The FEDERATED Storage Engine") storage engine
  connections:

  + `program_name`:
    `mysqld`

  + `_client_role`:
    `federated_storage`

#### Connection Attribute Limits

There are limits on the amount of connection attribute data
transmitted from client to server:

* A fixed limit imposed by the client prior to connect time.
* A fixed limit imposed by the server at connect time.
* A configurable limit imposed by the Performance Schema at
  connect time.

For connections initiated using the C API, the
`libmysqlclient` library imposes a limit of
64KB on the aggregate size of connection attribute data on the
client side: Calls to
[`mysql_options()`](/doc/c-api/9.5/en/mysql-options.html) that cause this
limit to be exceeded produce a
[`CR_INVALID_PARAMETER_NO`](/doc/mysql-errors/9.5/en/client-error-reference.html#error_cr_invalid_parameter_no) error.
Other MySQL Connectors may impose their own client-side limits
on how much connection attribute data can be transmitted to the
server.

On the server side, these size checks on connection attribute
data occur:

* The server imposes a limit of 64KB on the aggregate size of
  connection attribute data it accepts. If a client attempts
  to send more than 64KB of attribute data, the server rejects
  the connection. Otherwise, the server considers the
  attribute buffer valid and tracks the size of the longest
  such buffer in the
  [`Performance_schema_session_connect_attrs_longest_seen`](performance-schema-status-variables.html#statvar_Performance_schema_session_connect_attrs_longest_seen)
  status variable.

* For accepted connections, the Performance Schema checks
  aggregate attribute size against the value of the
  [`performance_schema_session_connect_attrs_size`](performance-schema-system-variables.html#sysvar_performance_schema_session_connect_attrs_size)
  system variable. If attribute size exceeds this value, these
  actions take place:

  + The Performance Schema truncates the attribute data and
    increments the
    [`Performance_schema_session_connect_attrs_lost`](performance-schema-status-variables.html#statvar_Performance_schema_session_connect_attrs_lost)
    status variable, which indicates the number of
    connections for which attribute truncation occurred.

  + The Performance Schema writes a message to the error log
    if the
    [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity)
    system variable is greater than 1:

    ```
    Connection attributes of length N were truncated
    (N bytes lost)
    for connection N, user user_name@host_name
    (as user_name), auth: {yes|no}
    ```

    The information in the warning message is intended to
    help DBAs identify clients for which attribute
    truncation occurred.

  + A `_truncated` attribute is added to
    the session attributes with a value indicating how many
    bytes were lost, if the attribute buffer has sufficient
    space. This enables the Performance Schema to expose
    per-connection truncation information in the connection
    attribute tables. This information can be examined
    without having to check the error log.