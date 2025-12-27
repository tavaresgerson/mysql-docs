#### 17.2.1.3 User Credentials

Group Replication uses the asynchronous replication protocol to achieve [Section 17.9.5, “Distributed Recovery”](group-replication-distributed-recovery.html "17.9.5 Distributed Recovery"), synchronizing group members before joining them to the group. The distributed recovery process relies on a replication channel named `group_replication_recovery` which is used to transfer transactions from donor members to members that join the group. Therefore you need to set up a replication user with the correct permissions so that Group Replication can establish direct member-to-member recovery replication channels.

Start the MySQL server instance and then connect a client to it. Create a MySQL user with the [`REPLICATION SLAVE`](privileges-provided.html#priv_replication-slave) privilege. This process can be captured in the binary log and then you can rely on distributed recovery to replicate the statements used to create the user. Alternatively, you can disable binary logging using `SET SQL_LOG_BIN=0;` and then create the user manually on each member, for example if you want to avoid the changes being propagated to other server instances. If you do decide to disable binary logging, ensure you renable it once you have configured the user.

In the following example the user *`rpl_user`* with the password *`password`* is shown. When configuring your servers use a suitable user name and password.

```sql
mysql> CREATE USER rpl_user@'%' IDENTIFIED BY 'password';
mysql> GRANT REPLICATION SLAVE ON *.* TO rpl_user@'%';
mysql> FLUSH PRIVILEGES;
```

If binary logging was disabled, enable it again once the user has been created using `SET SQL_LOG_BIN=1;`.

Once the user has been configured, use the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement to configure the server to use the given credentials for the `group_replication_recovery` replication channel the next time it needs to recover its state from another member. Issue the following, replacing *`rpl_user`* and *`password`* with the values used when creating the user.

```sql
mysql> CHANGE MASTER TO MASTER_USER='rpl_user', MASTER_PASSWORD='password' \\
		      FOR CHANNEL 'group_replication_recovery';
```

Distributed recovery is the first step taken by a server that joins the group and does not have the same set of transactions as the group members. If these credentials are not set correctly for the `group_replication_recovery` replication channel and the `rpl_user` as shown, the server cannot connect to the donor members and run the distributed recovery process to gain synchrony with the other group members, and hence ultimately cannot join the group. See [Section 17.9.5, “Distributed Recovery”](group-replication-distributed-recovery.html "17.9.5 Distributed Recovery").

Similarly, if the server cannot correctly identify the other members via the server's `hostname` the recovery process can fail. It is recommended that operating systems running MySQL have a properly configured unique `hostname`, either using DNS or local settings. This `hostname` can be verified in the `Member_host` column of the [`performance_schema.replication_group_members`](performance-schema-replication-group-members-table.html "25.12.11.8 The replication_group_members Table") table. If multiple group members externalize a default `hostname` set by the operating system, there is a chance of the member not resolving to the correct member address and not being able to join the group. In such a situation use [`report_host`](replication-options-replica.html#sysvar_report_host) to configure a unique `hostname` to be externalized by each of the servers.
