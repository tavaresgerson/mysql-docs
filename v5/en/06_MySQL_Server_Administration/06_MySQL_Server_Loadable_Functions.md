## 5.6 MySQL Server Loadable Functions

MySQL supports loadable functions, that is, functions that are not built in but can be loaded at runtime (either during startup or later) to extend server capabilities, or unloaded to remove capabilities. For a table describing the available loadable functions, see Section 12.2, “Loadable Function Reference”. Loadable functions contrast with built-in (native) functions, which are implemented as part of the server and are always available; for a table, see Section 12.1, “Built-In Function and Operator Reference”.

Note

Loadable functions previously were known as user-defined functions (UDFs). That terminology was something of a misnomer because “user-defined” also can apply to other types of functions, such as stored functions (a type of stored object written using SQL) and native functions added by modifying the server source code.

MySQL distributions include loadable functions that implement, in whole or in part, these server capabilities:

* MySQL Enterprise Edition includes functions that perform encryption operations based on the OpenSSL library. See Section 6.6, “MySQL Enterprise Encryption”.

* MySQL Enterprise Edition includes functions that provide an SQL-level API for masking and de-identification operations. See Section 6.5.1, “MySQL Enterprise Data Masking and De-Identification Elements”.

* MySQL Enterprise Edition includes audit logging for monitoring and logging of connection and query activity. See Section 6.4.5, “MySQL Enterprise Audit”.

* MySQL Enterprise Edition includes a firewall capability that implements an application-level firewall to enable database administrators to permit or deny SQL statement execution based on matching against patterns for accepted statement. See Section 6.4.6, “MySQL Enterprise Firewall”.

* A query rewriter examines statements received by MySQL Server and possibly rewrites them before the server executes them. See Section 5.5.4, “The Rewriter Query Rewrite Plugin”

* Version Tokens enables creation of and synchronization around server tokens that applications can use to prevent accessing incorrect or out-of-date data. See Section 5.5.5, “Version Tokens”.

* The MySQL Keyring provides secure storage for sensitive information. See Section 6.4.4, “The MySQL Keyring”.

* A locking service provides a locking interface for application use. See Section 5.5.6.1, “The Locking Service”.

The following sections describe how to install and uninstall loadable functions, and how to determine at runtime which loadable functions are installed and obtain information about them.

For information about writing loadable functions, see Adding Functions to MySQL.

### 5.6.1 Installing and Uninstalling Loadable Functions

Loadable functions, as the name implies, must be loaded into the server before they can be used. MySQL supports automatic function loading during server startup and manual loading thereafter.

While a loadable function is loaded, information about it is available as described in Section 5.6.2, “Obtaining Information About Loadable Functions”.

* Installing Loadable Functions
* Uninstalling Loadable Functions
* Reinstalling or Upgrading Loadable Functions

#### Installing Loadable Functions

To load a loadable function manually, use the `CREATE FUNCTION` statement. For example:

```sql
CREATE FUNCTION metaphon
  RETURNS STRING
  SONAME 'udf_example.so';
```

The file base name depends on your platform. Common suffixes are `.so` for Unix and Unix-like systems, `.dll` for Windows.

`CREATE FUNCTION` has these effects:

* It loads the function into the server to make it available immediately.

* It registers the function in the `mysql.func` system table to make it persistent across server restarts. For this reason, `CREATE FUNCTION` requires the `INSERT` privilege for the `mysql` system database.

Automatic loading of loadable functions occurs during the normal server startup sequence. The server loads functions registered in the `mysql.func` table. If the server is started with the `--skip-grant-tables` option, functions registered in the table are not loaded and are unavailable.

#### Uninstalling Loadable Functions

To remove a loadable function, use the `DROP FUNCTION` statement. For example:

```sql
DROP FUNCTION metaphon;
```

`DROP FUNCTION` has these effects:

* It unloads the function to make it unavailable.
* It removes the function from the `mysql.func` system table. For this reason, `DROP FUNCTION` requires the `DELETE` privilege for the `mysql` system database. With the function no longer registered in the `mysql.func` table, the server does not load the function during subsequent restarts.

While a loadable function is loaded, information about it is available from the `mysql.func` system table. See Section 5.6.2, “Obtaining Information About Loadable Functions”. `CREATE FUNCTION` adds the function to the table and `DROP FUNCTION` removes it.

#### Reinstalling or Upgrading Loadable Functions

To reinstall or upgrade the shared library associated with a loadable function, issue a `DROP FUNCTION` statement, upgrade the shared library, and then issue a `CREATE FUNCTION` statement. If you upgrade the shared library first and then use `DROP FUNCTION`, the server may unexpectedly shut down.

### 5.6.2 Obtaining Information About Loadable Functions

The `mysql.func` system table shows which loadable functions have been registered using `CREATE FUNCTION`:

```sql
SELECT * FROM mysql.func;
```

The `func` table has these columns:

* `name`

  The function name as referred to in SQL statements.

* `ret`

  The function return value type. Permitted values are 0 (`STRING`), 1 (`REAL`), 2 (`INTEGER`), 3 (`ROW`), or 4 (`DECIMAL`).

* `dl`

  The name of the function library file containing the executable function code. The file is located in the directory named by the `plugin_dir` system variable.

* `type`

  The function type, either `function` (scalar) or `aggregate`.

