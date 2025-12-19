## 7.7 MySQL Server Loadable Functions

MySQL supports loadable functions, that is, functions that are not built in but can be loaded at runtime (either during startup or later) to extend server capabilities, or unloaded to remove capabilities. For a table describing the available loadable functions, see  Section 14.2, “Loadable Function Reference”. Loadable functions contrast with built-in (native) functions, which are implemented as part of the server and are always available; for a table, see  Section 14.1, “Built-In Function and Operator Reference”.

::: info Note

Loadable functions previously were known as user-defined functions (UDFs). That terminology was something of a misnomer because “user-defined” also can apply to other types of functions, such as stored functions (a type of stored object written using SQL) and native functions added by modifying the server source code.

:::

MySQL distributions include loadable functions that implement, in whole or in part, these server capabilities:

* Group Replication enables you to create a highly available distributed MySQL service across a group of MySQL server instances, with data consistency, conflict detection and resolution, and group membership services all built-in. See Chapter 20, *Group Replication*.
* MySQL Enterprise Edition includes functions that perform encryption operations based on the OpenSSL library. See Section 8.6, “MySQL Enterprise Encryption”.
* MySQL Enterprise Edition includes functions that provide an SQL-level API for masking and de-identification operations. See Section 8.5, “MySQL Enterprise Data Masking and De-Identification”.
* MySQL Enterprise Edition includes audit logging for monitoring and logging of connection and query activity. See  Section 8.4.5, “MySQL Enterprise Audit”, and  Section 8.4.6, “The Audit Message Component”.
* MySQL Enterprise Edition includes a firewall capability that implements an application-level firewall to enable database administrators to permit or deny SQL statement execution based on matching against patterns for accepted statement. See  Section 8.4.7, “MySQL Enterprise Firewall”.
* A query rewriter examines statements received by MySQL Server and possibly rewrites them before the server executes them. See Section 7.6.4, “The Rewriter Query Rewrite Plugin”
* Version Tokens enables creation of and synchronization around server tokens that applications can use to prevent accessing incorrect or out-of-date data. See Section 7.6.6, “Version Tokens”.
* The MySQL Keyring provides secure storage for sensitive information. See  Section 8.4.4, “The MySQL Keyring”.
* A locking service provides a locking interface for application use. See  Section 7.6.9.1, “The Locking Service”.
* A function provides access to query attributes. See Section 11.6, “Query Attributes”.

The following sections describe how to install and uninstall loadable functions, and how to determine at runtime which loadable functions are installed and obtain information about them.

In some cases, a loadable function is loaded by installing the component that implements the function, rather than by loading the function directly. For details about a particular loadable function, see the installation instructions for the server feature that includes it.

For information about writing loadable functions, see Adding Functions to MySQL.
