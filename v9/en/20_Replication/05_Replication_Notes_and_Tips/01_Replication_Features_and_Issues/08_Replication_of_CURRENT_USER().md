#### 19.5.1.8 Replication of CURRENT\_USER()

The following statements support use of the `CURRENT_USER()` function to take the place of the name of, and possibly the host for, an affected user or a definer:

* `DROP USER`
* `RENAME USER`
* `GRANT`
* `REVOKE`
* `CREATE FUNCTION`
* `CREATE PROCEDURE`
* `CREATE TRIGGER`
* `CREATE EVENT`
* `CREATE VIEW`
* `ALTER EVENT`
* `ALTER VIEW`
* `SET PASSWORD`

When binary logging is enabled and `CURRENT_USER()` or `CURRENT_USER` is used as the definer in any of these statements, MySQL Server ensures that the statement is applied to the same user on both the source and the replica when the statement is replicated. In some cases, such as statements that change passwords, the function reference is expanded before it is written to the binary log, so that the statement includes the user name. For all other cases, the name of the current user on the source is replicated to the replica as metadata, and the replica applies the statement to the current user named in the metadata, rather than to the current user on the replica.
