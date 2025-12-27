### 6.2.18 SQL-Based Account Activity Auditing

Applications can use the following guidelines to perform SQL-based auditing that ties database activity to MySQL accounts.

MySQL accounts correspond to rows in the `mysql.user` system table. When a client connects successfully, the server authenticates the client to a particular row in this table. The `User` and `Host` column values in this row uniquely identify the account and correspond to the `'user_name'@'host_name'` format in which account names are written in SQL statements.

The account used to authenticate a client determines which privileges the client has. Normally, the [`CURRENT_USER()`](information-functions.html#function_current-user) function can be invoked to determine which account this is for the client user. Its value is constructed from the `User` and `Host` columns of the `user` table row for the account.

However, there are circumstances under which the [`CURRENT_USER()`](information-functions.html#function_current-user) value corresponds not to the client user but to a different account. This occurs in contexts when privilege checking is not based the client's account:

* Stored routines (procedures and functions) defined with the `SQL SECURITY DEFINER` characteristic

* Views defined with the `SQL SECURITY DEFINER` characteristic

* Triggers and events

In those contexts, privilege checking is done against the `DEFINER` account and [`CURRENT_USER()`](information-functions.html#function_current-user) refers to that account, not to the account for the client who invoked the stored routine or view or who caused the trigger to activate. To determine the invoking user, you can call the [`USER()`](information-functions.html#function_user) function, which returns a value indicating the actual user name provided by the client and the host from which the client connected. However, this value does not necessarily correspond directly to an account in the `user` table, because the [`USER()`](information-functions.html#function_user) value never contains wildcards, whereas account values (as returned by [`CURRENT_USER()`](information-functions.html#function_current-user)) may contain user name and host name wildcards.

For example, a blank user name matches any user, so an account of `''@'localhost'` enables clients to connect as an anonymous user from the local host with any user name. In this case, if a client connects as `user1` from the local host, [`USER()`](information-functions.html#function_user) and [`CURRENT_USER()`](information-functions.html#function_current-user) return different values:

```sql
mysql> SELECT USER(), CURRENT_USER();
+-----------------+----------------+
| USER()          | CURRENT_USER() |
+-----------------+----------------+
| user1@localhost | @localhost     |
+-----------------+----------------+
```

The host name part of an account can contain wildcards, too. If the host name contains a `'%'` or `'_'` pattern character or uses netmask notation, the account can be used for clients connecting from multiple hosts and the [`CURRENT_USER()`](information-functions.html#function_current-user) value does not indicate which one. For example, the account `'user2'@'%.example.com'` can be used by `user2` to connect from any host in the `example.com` domain. If `user2` connects from `remote.example.com`, [`USER()`](information-functions.html#function_user) and [`CURRENT_USER()`](information-functions.html#function_current-user) return different values:

```sql
mysql> SELECT USER(), CURRENT_USER();
+--------------------------+---------------------+
| USER()                   | CURRENT_USER()      |
+--------------------------+---------------------+
| user2@remote.example.com | user2@%.example.com |
+--------------------------+---------------------+
```

If an application must invoke [`USER()`](information-functions.html#function_user) for user auditing (for example, if it does auditing from within triggers) but must also be able to associate the [`USER()`](information-functions.html#function_user) value with an account in the `user` table, it is necessary to avoid accounts that contain wildcards in the `User` or `Host` column. Specifically, do not permit `User` to be empty (which creates an anonymous-user account), and do not permit pattern characters or netmask notation in `Host` values. All accounts must have a nonempty `User` value and literal `Host` value.

With respect to the previous examples, the `''@'localhost'` and `'user2'@'%.example.com'` accounts should be changed not to use wildcards:

```sql
RENAME USER ''@'localhost' TO 'user1'@'localhost';
RENAME USER 'user2'@'%.example.com' TO 'user2'@'remote.example.com';
```

If `user2` must be able to connect from several hosts in the `example.com` domain, there should be a separate account for each host.

To extract the user name or host name part from a [`CURRENT_USER()`](information-functions.html#function_current-user) or [`USER()`](information-functions.html#function_user) value, use the [`SUBSTRING_INDEX()`](string-functions.html#function_substring-index) function:

```sql
mysql> SELECT SUBSTRING_INDEX(CURRENT_USER(),'@',1);
+---------------------------------------+
| SUBSTRING_INDEX(CURRENT_USER(),'@',1) |
+---------------------------------------+
| user1                                 |
+---------------------------------------+

mysql> SELECT SUBSTRING_INDEX(CURRENT_USER(),'@',-1);
+----------------------------------------+
| SUBSTRING_INDEX(CURRENT_USER(),'@',-1) |
+----------------------------------------+
| localhost                              |
+----------------------------------------+
```
