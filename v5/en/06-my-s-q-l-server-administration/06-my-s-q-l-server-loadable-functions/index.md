## 5.6 MySQL Server Loadable Functions

[5.6.1 Installing and Uninstalling Loadable Functions](function-loading.html)

[5.6.2 Obtaining Information About Loadable Functions](obtaining-loadable-function-information.html)

MySQL supports loadable functions, that is, functions that are not built in but can be loaded at runtime (either during startup or later) to extend server capabilities, or unloaded to remove capabilities. For a table describing the available loadable functions, see [Section 12.2, “Loadable Function Reference”](loadable-function-reference.html "12.2 Loadable Function Reference"). Loadable functions contrast with built-in (native) functions, which are implemented as part of the server and are always available; for a table, see [Section 12.1, “Built-In Function and Operator Reference”](built-in-function-reference.html "12.1 Built-In Function and Operator Reference").

Note

Loadable functions previously were known as user-defined functions (UDFs). That terminology was something of a misnomer because “user-defined” also can apply to other types of functions, such as stored functions (a type of stored object written using SQL) and native functions added by modifying the server source code.

MySQL distributions include loadable functions that implement, in whole or in part, these server capabilities:

* MySQL Enterprise Edition includes functions that perform encryption operations based on the OpenSSL library. See [Section 6.6, “MySQL Enterprise Encryption”](enterprise-encryption.html "6.6 MySQL Enterprise Encryption").

* MySQL Enterprise Edition includes functions that provide an SQL-level API for masking and de-identification operations. See [Section 6.5.1, “MySQL Enterprise Data Masking and De-Identification Elements”](data-masking-elements.html "6.5.1 MySQL Enterprise Data Masking and De-Identification Elements").

* MySQL Enterprise Edition includes audit logging for monitoring and logging of connection and query activity. See [Section 6.4.5, “MySQL Enterprise Audit”](audit-log.html "6.4.5 MySQL Enterprise Audit").

* MySQL Enterprise Edition includes a firewall capability that implements an application-level firewall to enable database administrators to permit or deny SQL statement execution based on matching against patterns for accepted statement. See [Section 6.4.6, “MySQL Enterprise Firewall”](firewall.html "6.4.6 MySQL Enterprise Firewall").

* A query rewriter examines statements received by MySQL Server and possibly rewrites them before the server executes them. See [Section 5.5.4, “The Rewriter Query Rewrite Plugin”](rewriter-query-rewrite-plugin.html "5.5.4 The Rewriter Query Rewrite Plugin")

* Version Tokens enables creation of and synchronization around server tokens that applications can use to prevent accessing incorrect or out-of-date data. See [Section 5.5.5, “Version Tokens”](version-tokens.html "5.5.5 Version Tokens").

* The MySQL Keyring provides secure storage for sensitive information. See [Section 6.4.4, “The MySQL Keyring”](keyring.html "6.4.4 The MySQL Keyring").

* A locking service provides a locking interface for application use. See [Section 5.5.6.1, “The Locking Service”](locking-service.html "5.5.6.1 The Locking Service").

The following sections describe how to install and uninstall loadable functions, and how to determine at runtime which loadable functions are installed and obtain information about them.

For information about writing loadable functions, see [Adding Functions to MySQL](/doc/extending-mysql/5.7/en/adding-functions.html).
