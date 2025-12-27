#### 16.1.2.2 Creating a User for Replication

Each replica connects to the source using a MySQL user name and password, so there must be a user account on the source that the replica can use to connect. The user name is specified by the `MASTER_USER` option on the `CHANGE MASTER TO` command when you set up a replica. Any account can be used for this operation, providing it has been granted the [`REPLICATION SLAVE`](privileges-provided.html#priv_replication-slave) privilege. You can choose to create a different account for each replica, or connect to the source using the same account for each replica.

Although you do not have to create an account specifically for replication, you should be aware that the replication user name and password are stored in plain text in the replication metadata repositories (see [Section 16.2.4.2, “Replication Metadata Repositories”](replica-logs-status.html "16.2.4.2 Replication Metadata Repositories")). Therefore, you may want to create a separate account that has privileges only for the replication process, to minimize the possibility of compromise to other accounts.

To create a new account, use [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"). To grant this account the privileges required for replication, use the [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statement. If you create an account solely for the purposes of replication, that account needs only the [`REPLICATION SLAVE`](privileges-provided.html#priv_replication-slave) privilege. For example, to set up a new user, `repl`, that can connect for replication from any host within the `example.com` domain, issue these statements on the source:

```sql
mysql> CREATE USER 'repl'@'%.example.com' IDENTIFIED BY 'password';
mysql> GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%.example.com';
```

See [Section 13.7.1, “Account Management Statements”](account-management-statements.html "13.7.1 Account Management Statements"), for more information on statements for manipulation of user accounts.
