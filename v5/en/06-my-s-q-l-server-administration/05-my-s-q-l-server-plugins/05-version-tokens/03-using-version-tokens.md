#### 5.5.5.3 Using Version Tokens

Before using Version Tokens, install it according to the instructions provided at [Section 5.5.5.2, “Installing or Uninstalling Version Tokens”](version-tokens-installation.html "5.5.5.2 Installing or Uninstalling Version Tokens").

A scenario in which Version Tokens can be useful is a system that accesses a collection of MySQL servers but needs to manage them for load balancing purposes by monitoring them and adjusting server assignments according to load changes. Such a system comprises these elements:

* The collection of MySQL servers to be managed.
* An administrative or management application that communicates with the servers and organizes them into high-availability groups. Groups serve different purposes, and servers within each group may have different assignments. Assignment of a server within a certain group can change at any time.

* Client applications that access the servers to retrieve and update data, choosing servers according to the purposes assigned them. For example, a client should not send an update to a read-only server.

Version Tokens permit server access to be managed according to assignment without requiring clients to repeatedly query the servers about their assignments:

* The management application performs server assignments and establishes version tokens on each server to reflect its assignment. The application caches this information to provide a central access point to it.

  If at some point the management application needs to change a server assignment (for example, to change it from permitting writes to read only), it changes the server's version token list and updates its cache.

* To improve performance, client applications obtain cache information from the management application, enabling them to avoid having to retrieve information about server assignments for each statement. Based on the type of statements it issues (for example, reads versus writes), a client selects an appropriate server and connects to it.

* In addition, the client sends to the server its own client-specific version tokens to register the assignment it requires of the server. For each statement sent by the client to the server, the server compares its own token list with the client token list. If the server token list contains all tokens present in the client token list with the same values, there is a match and the server executes the statement.

  On the other hand, perhaps the management application has changed the server assignment and its version token list. In this case, the new server assignment may now be incompatible with the client requirements. A token mismatch between the server and client token lists occurs and the server returns an error in reply to the statement. This is an indication to the client to refresh its version token information from the management application cache, and to select a new server to communicate with.

The client-side logic for detecting version token errors and selecting a new server can be implemented different ways:

* The client can handle all version token registration, mismatch detection, and connection switching itself.

* The logic for those actions can be implemented in a connector that manages connections between clients and MySQL servers. Such a connector might handle mismatch error detection and statement resending itself, or it might pass the error to the application and leave it to the application to resend the statement.

The following example illustrates the preceding discussion in more concrete form.

When Version Tokens initializes on a given server, the server's version token list is empty. Token list maintenance is performed by calling functions. The [`SUPER`](privileges-provided.html#priv_super) privilege is required to call any of the Version Token functions, so token list modification is expected to be done by a management or administrative application that has that privilege.

Suppose that a management application communicates with a set of servers that are queried by clients to access employee and product databases (named `emp` and `prod`, respectively). All servers are permitted to process data retrieval statements, but only some of them are permitted to make database updates. To handle this on a database-specific basis, the management application establishes a list of version tokens on each server. In the token list for a given server, token names represent database names and token values are `read` or `write` depending on whether the database must be used in read-only fashion or whether it can take reads and writes.

Client applications register a list of version tokens they require the server to match by setting a system variable. Variable setting occurs on a client-specific basis, so different clients can register different requirements. By default, the client token list is empty, which matches any server token list. When a client sets its token list to a nonempty value, matching may succeed or fail, depending on the server version token list.

To define the version token list for a server, the management application calls the [`version_tokens_set()`](version-tokens-reference.html#function_version-tokens-set) function. (There are also functions for modifying and displaying the token list, described later.) For example, the application might send these statements to a group of three servers:

Server 1:

```sql
mysql> SELECT version_tokens_set('emp=read;prod=read');
+------------------------------------------+
| version_tokens_set('emp=read;prod=read') |
+------------------------------------------+
| 2 version tokens set.                    |
+------------------------------------------+
```

Server 2:

```sql
mysql> SELECT version_tokens_set('emp=write;prod=read');
+-------------------------------------------+
| version_tokens_set('emp=write;prod=read') |
+-------------------------------------------+
| 2 version tokens set.                     |
+-------------------------------------------+
```

Server 3:

```sql
mysql> SELECT version_tokens_set('emp=read;prod=write');
+-------------------------------------------+
| version_tokens_set('emp=read;prod=write') |
+-------------------------------------------+
| 2 version tokens set.                     |
+-------------------------------------------+
```

The token list in each case is specified as a semicolon-separated list of `name=value` pairs. The resulting token list values result in these server assingments:

* Any server accepts reads for either database.
* Only server 2 accepts updates for the `emp` database.

* Only server 3 accepts updates for the `prod` database.

In addition to assigning each server a version token list, the management application also maintains a cache that reflects the server assignments.

Before communicating with the servers, a client application contacts the management application and retrieves information about server assignments. Then the client selects a server based on those assignments. Suppose that a client wants to perform both reads and writes on the `emp` database. Based on the preceding assignments, only server 2 qualifies. The client connects to server 2 and registers its server requirements there by setting its [`version_tokens_session`](version-tokens-reference.html#sysvar_version_tokens_session) system variable:

```sql
mysql> SET @@SESSION.version_tokens_session = 'emp=write';
```

For subsequent statements sent by the client to server 2, the server compares its own version token list to the client list to check whether they match. If so, statements execute normally:

```sql
mysql> UPDATE emp.employee SET salary = salary * 1.1 WHERE id = 4981;
Query OK, 1 row affected (0.07 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> SELECT last_name, first_name FROM emp.employee WHERE id = 4981;
+-----------+------------+
| last_name | first_name |
+-----------+------------+
| Smith     | Abe        |
+-----------+------------+
1 row in set (0.01 sec)
```

Discrepancies between the server and client version token lists can occur two ways:

* A token name in the [`version_tokens_session`](version-tokens-reference.html#sysvar_version_tokens_session) value is not present in the server token list. In this case, an [`ER_VTOKEN_PLUGIN_TOKEN_NOT_FOUND`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_vtoken_plugin_token_not_found) error occurs.

* A token value in the [`version_tokens_session`](version-tokens-reference.html#sysvar_version_tokens_session) value differs from the value of the corresponding token in the server token list. In this case, an [`ER_VTOKEN_PLUGIN_TOKEN_MISMATCH`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_vtoken_plugin_token_mismatch) error occurs.

As long as the assignment of server 2 does not change, the client continues to use it for reads and writes. But suppose that the management application wants to change server assignments so that writes for the `emp` database must be sent to server 1 instead of server 2. To do this, it uses [`version_tokens_edit()`](version-tokens-reference.html#function_version-tokens-edit) to modify the `emp` token value on the two servers (and updates its cache of server assignments):

Server 1:

```sql
mysql> SELECT version_tokens_edit('emp=write');
+----------------------------------+
| version_tokens_edit('emp=write') |
+----------------------------------+
| 1 version tokens updated.        |
+----------------------------------+
```

Server 2:

```sql
mysql> SELECT version_tokens_edit('emp=read');
+---------------------------------+
| version_tokens_edit('emp=read') |
+---------------------------------+
| 1 version tokens updated.       |
+---------------------------------+
```

[`version_tokens_edit()`](version-tokens-reference.html#function_version-tokens-edit) modifies the named tokens in the server token list and leaves other tokens unchanged.

The next time the client sends a statement to server 2, its own token list no longer matches the server token list and an error occurs:

```sql
mysql> UPDATE emp.employee SET salary = salary * 1.1 WHERE id = 4982;
ERROR 3136 (42000): Version token mismatch for emp. Correct value read
```

In this case, the client should contact the management application to obtain updated information about server assignments, select a new server, and send the failed statement to the new server.

Note

Each client must cooperate with Version Tokens by sending only statements in accordance with the token list that it registers with a given server. For example, if a client registers a token list of `'emp=read'`, there is nothing in Version Tokens to prevent the client from sending updates for the `emp` database. The client itself must refrain from doing so.

For each statement received from a client, the server implicitly uses locking, as follows:

* Take a shared lock for each token named in the client token list (that is, in the [`version_tokens_session`](version-tokens-reference.html#sysvar_version_tokens_session) value)

* Perform the comparison between the server and client token lists

* Execute the statement or produce an error depending on the comparison result

* Release the locks

The server uses shared locks so that comparisons for multiple sessions can occur without blocking, while preventing changes to the tokens for any session that attempts to acquire an exclusive lock before it manipulates tokens of the same names in the server token list.

The preceding example uses only a few of the functions included in the Version Tokens plugin library, but there are others. One set of functions permits the server's list of version tokens to be manipulated and inspected. Another set of functions permits version tokens to be locked and unlocked.

These functions permit the server's list of version tokens to be created, changed, removed, and inspected:

* [`version_tokens_set()`](version-tokens-reference.html#function_version-tokens-set) completely replaces the current list and assigns a new list. The argument is a semicolon-separated list of `name=value` pairs.

* [`version_tokens_edit()`](version-tokens-reference.html#function_version-tokens-edit) enables partial modifications to the current list. It can add new tokens or change the values of existing tokens. The argument is a semicolon-separated list of `name=value` pairs.

* [`version_tokens_delete()`](version-tokens-reference.html#function_version-tokens-delete) deletes tokens from the current list. The argument is a semicolon-separated list of token names.

* [`version_tokens_show()`](version-tokens-reference.html#function_version-tokens-show) displays the current token list. It takes no argument.

Each of those functions, if successful, returns a binary string indicating what action occurred. The following example establishes the server token list, modifies it by adding a new token, deletes some tokens, and displays the resulting token list:

```sql
mysql> SELECT version_tokens_set('tok1=a;tok2=b');
+-------------------------------------+
| version_tokens_set('tok1=a;tok2=b') |
+-------------------------------------+
| 2 version tokens set.               |
+-------------------------------------+
mysql> SELECT version_tokens_edit('tok3=c');
+-------------------------------+
| version_tokens_edit('tok3=c') |
+-------------------------------+
| 1 version tokens updated.     |
+-------------------------------+
mysql> SELECT version_tokens_delete('tok2;tok1');
+------------------------------------+
| version_tokens_delete('tok2;tok1') |
+------------------------------------+
| 2 version tokens deleted.          |
+------------------------------------+
mysql> SELECT version_tokens_show();
+-----------------------+
| version_tokens_show() |
+-----------------------+
| tok3=c;               |
+-----------------------+
```

Warnings occur if a token list is malformed:

```sql
mysql> SELECT version_tokens_set('tok1=a; =c');
+----------------------------------+
| version_tokens_set('tok1=a; =c') |
+----------------------------------+
| 1 version tokens set.            |
+----------------------------------+
1 row in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Warning
   Code: 42000
Message: Invalid version token pair encountered. The list provided
         is only partially updated.
1 row in set (0.00 sec)
```

As mentioned previously, version tokens are defined using a semicolon-separated list of `name=value` pairs. Consider this invocation of [`version_tokens_set()`](version-tokens-reference.html#function_version-tokens-set):

```sql
mysql> SELECT version_tokens_set('tok1=b;;; tok2= a = b ; tok1 = 1\'2 3"4')
+---------------------------------------------------------------+
| version_tokens_set('tok1=b;;; tok2= a = b ; tok1 = 1\'2 3"4') |
+---------------------------------------------------------------+
| 3 version tokens set.                                         |
+---------------------------------------------------------------+
```

Version Tokens interprets the argument as follows:

* Whitespace around names and values is ignored. Whitespace within names and values is permitted. (For [`version_tokens_delete()`](version-tokens-reference.html#function_version-tokens-delete), which takes a list of names without values, whitespace around names is ignored.)

* There is no quoting mechanism.
* Order of tokens is not significant except that if a token list contains multiple instances of a given token name, the last value takes precedence over earlier values.

Given those rules, the preceding [`version_tokens_set()`](version-tokens-reference.html#function_version-tokens-set) call results in a token list with two tokens: `tok1` has the value `1'2 3"4`, and `tok2` has the value `a = b`. To verify this, call [`version_tokens_show()`](version-tokens-reference.html#function_version-tokens-show):

```sql
mysql> SELECT version_tokens_show();
+--------------------------+
| version_tokens_show()    |
+--------------------------+
| tok2=a = b;tok1=1'2 3"4; |
+--------------------------+
```

If the token list contains two tokens, why did [`version_tokens_set()`](version-tokens-reference.html#function_version-tokens-set) return the value `3 version tokens set`? That occurred because the original token list contained two definitions for `tok1`, and the second definition replaced the first.

The Version Tokens token-manipulation functions place these constraints on token names and values:

* Token names cannot contain `=` or `;` characters and have a maximum length of 64 characters.

* Token values cannot contain `;` characters. Length of values is constrained by the value of the [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) system variable.

* Version Tokens treats token names and values as binary strings, so comparisons are case-sensitive.

Version Tokens also includes a set of functions enabling tokens to be locked and unlocked:

* [`version_tokens_lock_exclusive()`](version-tokens-reference.html#function_version-tokens-lock-exclusive) acquires exclusive version token locks. It takes a list of one or more lock names and a timeout value.

* [`version_tokens_lock_shared()`](version-tokens-reference.html#function_version-tokens-lock-shared) acquires shared version token locks. It takes a list of one or more lock names and a timeout value.

* [`version_tokens_unlock()`](version-tokens-reference.html#function_version-tokens-unlock) releases version token locks (exclusive and shared). It takes no argument.

Each locking function returns nonzero for success. Otherwise, an error occurs:

```sql
mysql> SELECT version_tokens_lock_shared('lock1', 'lock2', 0);
+-------------------------------------------------+
| version_tokens_lock_shared('lock1', 'lock2', 0) |
+-------------------------------------------------+
|                                               1 |
+-------------------------------------------------+

mysql> SELECT version_tokens_lock_shared(NULL, 0);
ERROR 3131 (42000): Incorrect locking service lock name '(null)'.
```

Locking using Version Tokens locking functions is advisory; applications must agree to cooperate.

It is possible to lock nonexisting token names. This does not create the tokens.

Note

Version Tokens locking functions are based on the locking service described at [Section 5.5.6.1, “The Locking Service”](locking-service.html "5.5.6.1 The Locking Service"), and thus have the same semantics for shared and exclusive locks. (Version Tokens uses the locking service routines built into the server, not the locking service function interface, so those functions need not be installed to use Version Tokens.) Locks acquired by Version Tokens use a locking service namespace of `version_token_locks`. Locking service locks can be monitored using the Performance Schema, so this is also true for Version Tokens locks. For details, see [Locking Service Monitoring](locking-service.html#locking-service-monitoring "Locking Service Monitoring").

For the Version Tokens locking functions, token name arguments are used exactly as specified. Surrounding whitespace is not ignored and `=` and `;` characters are permitted. This is because Version Tokens simply passes the token names to be locked as is to the locking service.
