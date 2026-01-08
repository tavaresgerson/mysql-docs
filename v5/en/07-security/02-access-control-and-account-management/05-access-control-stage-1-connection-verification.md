### 6.2.5 Access Control, Stage 1: Connection Verification

When you attempt to connect to a MySQL server, the server accepts or rejects the connection based on these conditions:

* Your identity and whether you can verify it by supplying the proper credentials.

* Whether your account is locked or unlocked.

The server checks credentials first, then account locking state. A failure at either step causes the server to deny access to you completely. Otherwise, the server accepts the connection, and then enters Stage 2 and waits for requests.

The server performs identity and credentials checking using columns in the `user` table, accepting the connection only if these conditions are satisfied:

* The client host name and user name match the `Host` and `User` columns in some `user` table row. For the rules governing permissible `Host` and `User` values, see [Section 6.2.4, “Specifying Account Names”](account-names.html "6.2.4 Specifying Account Names").

* The client supplies the credentials specified in the row (for example, a password), as indicated by the `authentication_string` column. Credentials are interpreted using the authentication plugin named in the `plugin` column.

* The row indicates that the account is unlocked. Locking state is recorded in the `account_locked` column, which must have a value of `'N'`. Account locking can be set or changed with the [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") or [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") statement.

Your identity is based on two pieces of information:

* Your MySQL user name.
* The client host from which you connect.

If the `User` column value is nonblank, the user name in an incoming connection must match exactly. If the `User` value is blank, it matches any user name. If the `user` table row that matches an incoming connection has a blank user name, the user is considered to be an anonymous user with no name, not a user with the name that the client actually specified. This means that a blank user name is used for all further access checking for the duration of the connection (that is, during Stage 2).

The `authentication_string` column can be blank. This is not a wildcard and does not mean that any password matches. It means that the user must connect without specifying a password. The authentication method implemented by the plugin that authenticates the client may or may not use the password in the `authentication_string` column. In this case, it is possible that an external password is also used to authenticate to the MySQL server.

Nonblank password values stored in the `authentication_string` column of the `user` table are encrypted. MySQL does not store passwords as cleartext for anyone to see. Rather, the password supplied by a user who is attempting to connect is encrypted (using the password hashing method implemented by the account authentication plugin). The encrypted password then is used during the connection process when checking whether the password is correct. This is done without the encrypted password ever traveling over the connection. See [Section 6.2.1, “Account User Names and Passwords”](user-names.html "6.2.1 Account User Names and Passwords").

From the MySQL server's point of view, the encrypted password is the *real* password, so you should never give anyone access to it. In particular, *do not give nonadministrative users read access to tables in the `mysql` system database*.

The following table shows how various combinations of `User` and `Host` values in the `user` table apply to incoming connections.

<table summary="How various combinations of User and Host values in the user table apply to incoming connections to a MySQL server."><col style="width: 15%"/><col style="width: 35%"/><col style="width: 50%"/><thead><tr> <th scope="col"><code>User</code> Value</th> <th scope="col"><code>Host</code> Value</th> <th scope="col">Permissible Connections</th> </tr></thead><tbody><tr> <th scope="row"><code>'fred'</code></th> <td><code>'h1.example.net'</code></td> <td><code>fred</code>, connecting from <code>h1.example.net</code></td> </tr><tr> <th scope="row"><code>''</code></th> <td><code>'h1.example.net'</code></td> <td>Any user, connecting from <code>h1.example.net</code></td> </tr><tr> <th scope="row"><code>'fred'</code></th> <td><code>'%'</code></td> <td><code>fred</code>, connecting from any host</td> </tr><tr> <th scope="row"><code>''</code></th> <td><code>'%'</code></td> <td>Any user, connecting from any host</td> </tr><tr> <th scope="row"><code>'fred'</code></th> <td><code>'%.example.net'</code></td> <td><code>fred</code>, connecting from any host in the <code>example.net</code> domain</td> </tr><tr> <th scope="row"><code>'fred'</code></th> <td><code>'x.example.%'</code></td> <td><code>fred</code>, connecting from <code>x.example.net</code>, <code>x.example.com</code>, <code>x.example.edu</code>, and so on; this is probably not useful</td> </tr><tr> <th scope="row"><code>'fred'</code></th> <td><code>'198.51.100.177'</code></td> <td><code>fred</code>, connecting from the host with IP address <code>198.51.100.177</code></td> </tr><tr> <th scope="row"><code>'fred'</code></th> <td><code>'198.51.100.%'</code></td> <td><code>fred</code>, connecting from any host in the <code>198.51.100</code> class C subnet</td> </tr><tr> <th scope="row"><code>'fred'</code></th> <td><code>'198.51.100.0/255.255.255.0'</code></td> <td>Same as previous example</td> </tr></tbody></table>

It is possible for the client host name and user name of an incoming connection to match more than one row in the `user` table. The preceding set of examples demonstrates this: Several of the entries shown match a connection from `h1.example.net` by `fred`.

When multiple matches are possible, the server must determine which of them to use. It resolves this issue as follows:

* Whenever the server reads the `user` table into memory, it sorts the rows.

* When a client attempts to connect, the server looks through the rows in sorted order.

* The server uses the first row that matches the client host name and user name.

The server uses sorting rules that order rows with the most-specific `Host` values first:

* Literal IP addresses and host names are the most specific.
* The specificity of a literal IP address is not affected by whether it has a netmask, so `198.51.100.13` and `198.51.100.0/255.255.255.0` are considered equally specific.

* The pattern `'%'` means “any host” and is least specific.

* The empty string `''` also means “any host” but sorts after `'%'`.

Non-TCP (socket file, named pipe, and shared memory) connections are treated as local connections and match a host part of `localhost` if there are any such accounts, or host parts with wildcards that match `localhost` otherwise (for example, `local%`, `l%`, `%`).

Rows with the same `Host` value are ordered with the most-specific `User` values first. A blank `User` value means “any user” and is least specific, so for rows with the same `Host` value, nonanonymous users sort before anonymous users.

For rows with equally-specific `Host` and `User` values, the order is nondeterministic.

To see how this works, suppose that the `user` table looks like this:

```sql
+-----------+----------+-
| Host      | User     | ...
+-----------+----------+-
| %         | root     | ...
| %         | jeffrey  | ...
| localhost | root     | ...
| localhost |          | ...
+-----------+----------+-
```

When the server reads the table into memory, it sorts the rows using the rules just described. The result after sorting looks like this:

```sql
+-----------+----------+-
| Host      | User     | ...
+-----------+----------+-
| localhost | root     | ...
| localhost |          | ...
| %         | jeffrey  | ...
| %         | root     | ...
+-----------+----------+-
```

When a client attempts to connect, the server looks through the sorted rows and uses the first match found. For a connection from `localhost` by `jeffrey`, two of the rows from the table match: the one with `Host` and `User` values of `'localhost'` and `''`, and the one with values of `'%'` and `'jeffrey'`. The `'localhost'` row appears first in sorted order, so that is the one the server uses.

Here is another example. Suppose that the `user` table looks like this:

```sql
+----------------+----------+-
| Host           | User     | ...
+----------------+----------+-
| %              | jeffrey  | ...
| h1.example.net |          | ...
+----------------+----------+-
```

The sorted table looks like this:

```sql
+----------------+----------+-
| Host           | User     | ...
+----------------+----------+-
| h1.example.net |          | ...
| %              | jeffrey  | ...
+----------------+----------+-
```

The first row matches a connection by any user from `h1.example.net`, whereas the second row matches a connection by `jeffrey` from any host.

Note

It is a common misconception to think that, for a given user name, all rows that explicitly name that user are used first when the server attempts to find a match for the connection. This is not true. The preceding example illustrates this, where a connection from `h1.example.net` by `jeffrey` is first matched not by the row containing `'jeffrey'` as the `User` column value, but by the row with no user name. As a result, `jeffrey` is authenticated as an anonymous user, even though he specified a user name when connecting.

If you are able to connect to the server, but your privileges are not what you expect, you probably are being authenticated as some other account. To find out what account the server used to authenticate you, use the [`CURRENT_USER()`](information-functions.html#function_current-user) function. (See [Section 12.15, “Information Functions”](information-functions.html "12.15 Information Functions").) It returns a value in `user_name@host_name` format that indicates the `User` and `Host` values from the matching `user` table row. Suppose that `jeffrey` connects and issues the following query:

```sql
mysql> SELECT CURRENT_USER();
+----------------+
| CURRENT_USER() |
+----------------+
| @localhost     |
+----------------+
```

The result shown here indicates that the matching `user` table row had a blank `User` column value. In other words, the server is treating `jeffrey` as an anonymous user.

Another way to diagnose authentication problems is to print out the `user` table and sort it by hand to see where the first match is being made.
