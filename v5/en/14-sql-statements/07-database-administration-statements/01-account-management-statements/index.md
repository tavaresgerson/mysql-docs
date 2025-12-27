### 13.7.1 Account Management Statements

[13.7.1.1 ALTER USER Statement](alter-user.html)

[13.7.1.2 CREATE USER Statement](create-user.html)

[13.7.1.3 DROP USER Statement](drop-user.html)

[13.7.1.4 GRANT Statement](grant.html)

[13.7.1.5 RENAME USER Statement](rename-user.html)

[13.7.1.6 REVOKE Statement](revoke.html)

[13.7.1.7 SET PASSWORD Statement](set-password.html)

MySQL account information is stored in the tables of the `mysql` system database. This database and the access control system are discussed extensively in [Chapter 5, *MySQL Server Administration*](server-administration.html "Chapter 5 MySQL Server Administration"), which you should consult for additional details.

Important

Some MySQL releases introduce changes to the grant tables to add new privileges or features. To make sure that you can take advantage of any new capabilities, update your grant tables to the current structure whenever you upgrade MySQL. See [Section 2.10, “Upgrading MySQL”](upgrading.html "2.10 Upgrading MySQL").

When the [`read_only`](server-system-variables.html#sysvar_read_only) system variable is enabled, account-management statements require the [`SUPER`](privileges-provided.html#priv_super) privilege, in addition to any other required privileges. This is because they modify tables in the `mysql` system database.
