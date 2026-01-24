### 27.6.2 Restrictions When Using the Embedded MySQL Server

The embedded server has the following limitations:

* No loadable functions.
* No stack trace on core dump.
* You cannot set this up as a source or a replica (no replication).

* Very large result sets may be unusable on low memory systems.
* You cannot connect to an embedded server from an outside process with sockets or TCP/IP. However, you can connect to an intermediate application, which in turn can connect to an embedded server on the behalf of a remote client or outside process.

* `libmysqld` does not support encrypted connections. An implication is that if an application linked against `libmysqld` establishes a connection to a remote server, the connection cannot be encrypted.

* `InnoDB` is not reentrant in the embedded server and cannot be used for multiple connections, either successively or simultaneously.

* The Event Scheduler is not available. Because of this, the [`event_scheduler`](server-system-variables.html#sysvar_event_scheduler) system variable is disabled.

* The Performance Schema is not available.
* The embedded server cannot share the same [`secure_file_priv`](server-system-variables.html#sysvar_secure_file_priv) directory with another server. As of MySQL 5.7.8, the default value for this directory can be set at build time with the [`INSTALL_SECURE_FILE_PRIV_EMBEDDEDDIR`](source-configuration-options.html#option_cmake_install_secure_file_priv_embeddeddir) **CMake** option.

Some of these limitations can be changed by editing the `mysql_embed.h` include file and recompiling MySQL.
