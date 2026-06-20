## 7.7 MySQL Server Loadable Functions

MySQL supports loadable functions, that is, functions that are not built in but can be loaded at runtime (either during startup or later) to extend server capabilities, or unloaded to remove capabilities. For a table describing the available loadable functions, see Section 14.2, “Loadable Function Reference”. Loadable functions contrast with built-in (native) functions, which are implemented as part of the server and are always available; for a table, see Section 14.1, “Built-In Function and Operator Reference”.

Note

Loadable functions previously were known as user-defined functions (UDFs). That terminology was something of a misnomer because “user-defined” also can apply to other types of functions, such as stored functions (a type of stored object written using SQL) and native functions added by modifying the server source code.

MySQL distributions include loadable functions that implement, in whole or in part, these server capabilities:

* Group Replication enables you to create a highly available distributed MySQL service across a group of MySQL server instances, with data consistency, conflict detection and resolution, and group membership services all built-in. See Chapter 20, *Group Replication*.

* MySQL Enterprise Edition includes functions that perform encryption operations based on the OpenSSL library. See Section 8.6, “MySQL Enterprise Encryption”.

* MySQL Enterprise Edition includes functions that provide an SQL-level API for masking and de-identification operations. See MySQL Enterprise Data Masking and De-Identification Elements.

* MySQL Enterprise Edition includes audit logging for monitoring and logging of connection and query activity. See Section 8.4.5, “MySQL Enterprise Audit”, and Section 8.4.6, “The Audit Message Component”.

* MySQL Enterprise Edition includes a firewall capability that implements an application-level firewall to enable database administrators to permit or deny SQL statement execution based on matching against patterns for accepted statement. See Section 8.4.7, “MySQL Enterprise Firewall”.

* A query rewriter examines statements received by MySQL Server and possibly rewrites them before the server executes them. See Section 7.6.4, “The Rewriter Query Rewrite Plugin”

* Version Tokens enables creation of and synchronization around server tokens that applications can use to prevent accessing incorrect or out-of-date data. See Section 7.6.6, “Version Tokens”.

* The MySQL Keyring provides secure storage for sensitive information. See Section 8.4.4, “The MySQL Keyring”.

* A locking service provides a locking interface for application use. See Section 7.6.9.1, “The Locking Service”.

* A function provides access to query attributes. See Section 11.6, “Query Attributes”.

The following sections describe how to install and uninstall loadable functions, and how to determine at runtime which loadable functions are installed and obtain information about them.

In some cases, a loadable function is loaded by installing the component that implements the function, rather than by loading the function directly. For details about a particular loadable function, see the installation instructions for the server feature that includes it.

For information about writing loadable functions, see Adding Functions to MySQL.


### 7.7.1 Installing and Uninstalling Loadable Functions

Loadable functions, as the name implies, must be loaded into the server before they can be used. MySQL supports automatic function loading during server startup and manual loading thereafter.

While a loadable function is loaded, information about it is available as described in Section 7.7.2, “Obtaining Information About Loadable Functions”.

* Installing Loadable Functions
* Uninstalling Loadable Functions
* Reinstalling or Upgrading Loadable Functions

#### Installing Loadable Functions

To load a loadable function manually, use the [`CREATE FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions") statement. For example:

```
CREATE FUNCTION metaphon
  RETURNS STRING
  SONAME 'udf_example.so';
```

The file base name depends on your platform. Common suffixes are `.so` for Unix and Unix-like systems, `.dll` for Windows.

[`CREATE FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions") has these effects:

* It loads the function into the server to make it available immediately.

* It registers the function in the `mysql.func` system table to make it persistent across server restarts. For this reason, [`CREATE FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions") requires the `INSERT` privilege for the `mysql` system database.

* It adds the function to the Performance Schema `user_defined_functions` table that provides runtime information about installed loadable functions. See Section 7.7.2, “Obtaining Information About Loadable Functions”.

Automatic loading of loadable functions occurs during the normal server startup sequence:

* Functions registered in the `mysql.func` table are installed.

* Components or plugins that are installed at startup may automatically install related functions.

* Automatic function installation adds the functions to the Performance Schema `user_defined_functions` table that provides runtime information about installed functions.

If the server is started with the `--skip-grant-tables` option, functions registered in the `mysql.func` table are not loaded and are unavailable. This does not apply to functions installed automatically by a component or plugin.

#### Uninstalling Loadable Functions

To remove a loadable function, use the [`DROP FUNCTION`](drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions") statement. For example:

```
DROP FUNCTION metaphon;
```

[`DROP FUNCTION`](drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions") has these effects:

* It unloads the function to make it unavailable.
* It removes the function from the `mysql.func` system table. For this reason, [`DROP FUNCTION`](drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions") requires the `DELETE` privilege for the `mysql` system database. With the function no longer registered in the `mysql.func` table, the server does not load the function during subsequent restarts.

* It removes the function from the Performance Schema `user_defined_functions` table that provides runtime information about installed loadable functions.

[`DROP FUNCTION`](drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions") cannot be used to drop a loadable function that is installed automatically by components or plugins rather than by using [`CREATE FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions"). Such a function is also dropped automatically, when the component or plugin that installed it is uninstalled.

#### Reinstalling or Upgrading Loadable Functions

To reinstall or upgrade the shared library associated with a loadable function, issue a [`DROP FUNCTION`](drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions") statement, upgrade the shared library, and then issue a [`CREATE FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions") statement. If you upgrade the shared library first and then use [`DROP FUNCTION`](drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions"), the server may unexpectedly shut down.


### 7.7.2 Obtaining Information About Loadable Functions

The Performance Schema `user_defined_functions` table contains information about the currently installed loadable functions:

```
SELECT * FROM performance_schema.user_defined_functions;
```

The `mysql.func` system table also lists installed loadable functions, but only those installed using [`CREATE FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions"). The `user_defined_functions` table lists loadable functions installed using [`CREATE FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions") as well as loadable functions installed automatically by components or plugins. This difference makes `user_defined_functions` preferable to `mysql.func` for checking which loadable functions are installed. See Section 29.12.21.10, “The user_defined_functions Table”.
