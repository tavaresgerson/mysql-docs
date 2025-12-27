#### 6.1.2.3 Passwords and Logging

Passwords can be written as plain text in SQL statements such as [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement"), and statements that invoke the [`PASSWORD()`](encryption-functions.html#function_password) function. If such statements are logged by the MySQL server as written, passwords in them become visible to anyone with access to the logs.

Statement logging avoids writing passwords as cleartext for the following statements:

```sql
CREATE USER ... IDENTIFIED BY ...
ALTER USER ... IDENTIFIED BY ...
GRANT ... IDENTIFIED BY ...
SET PASSWORD ...
SLAVE START ... PASSWORD = ...
CREATE SERVER ... OPTIONS(... PASSWORD ...)
ALTER SERVER ... OPTIONS(... PASSWORD ...)
```

Passwords in those statements are rewritten to not appear literally in statement text written to the general query log, slow query log, and binary log. Rewriting does not apply to other statements. In particular, [`INSERT`](insert.html "13.2.5 INSERT Statement") or [`UPDATE`](update.html "13.2.11 UPDATE Statement") statements for the `mysql.user` system table that refer to literal passwords are logged as is, so you should avoid such statements. (Direct modification of grant tables is discouraged, anyway.)

For the general query log, password rewriting can be suppressed by starting the server with the [`--log-raw`](server-options.html#option_mysqld_log-raw) option. For security reasons, this option is not recommended for production use. For diagnostic purposes, it may be useful to see the exact text of statements as received by the server.

Contents of the audit log file produced by the audit log plugin are not encrypted. For security reasons, this file should be written to a directory accessible only to the MySQL server and users with a legitimate reason to view the log. See [Section 6.4.5.3, “MySQL Enterprise Audit Security Considerations”](audit-log-security.html "6.4.5.3 MySQL Enterprise Audit Security Considerations").

Statements received by the server may be rewritten if a query rewrite plugin is installed (see [Query Rewrite Plugins](/doc/extending-mysql/5.7/en/plugin-types.html#query-rewrite-plugin-type)). In this case, the [`--log-raw`](server-options.html#option_mysqld_log-raw) option affects statement logging as follows:

* Without [`--log-raw`](server-options.html#option_mysqld_log-raw), the server logs the statement returned by the query rewrite plugin. This may differ from the statement as received.

* With [`--log-raw`](server-options.html#option_mysqld_log-raw), the server logs the original statement as received.

An implication of password rewriting is that statements that cannot be parsed (due, for example, to syntax errors) are not written to the general query log because they cannot be known to be password free. Use cases that require logging of all statements including those with errors should use the [`--log-raw`](server-options.html#option_mysqld_log-raw) option, bearing in mind that this also bypasses password rewriting.

Password rewriting occurs only when plain text passwords are expected. For statements with syntax that expect a password hash value, no rewriting occurs. If a plain text password is supplied erroneously for such syntax, the password is logged as given, without rewriting. For example, the following statement is logged as shown because a password hash value is expected:

```sql
CREATE USER 'user1'@'localhost' IDENTIFIED BY PASSWORD 'not-so-secret';
```

To guard log files against unwarranted exposure, locate them in a directory that restricts access to the server and the database administrator. If the server logs to tables in the `mysql` database, grant access to those tables only to the database administrator.

Replicas store the password for the replication source in the source info repository, which can be either a file or a table (see [Section 16.2.4, “Relay Log and Replication Metadata Repositories”](replica-logs.html "16.2.4 Relay Log and Replication Metadata Repositories")). Ensure that the repository can be accessed only by the database administrator. An alternative to storing the password in a file is to use the [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statement to specify credentials for connecting to the source.

Use a restricted access mode to protect database backups that include log tables or log files containing passwords.
