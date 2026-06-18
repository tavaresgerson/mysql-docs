### 25.6.13 Privilege Synchronization and NDB\_STORED\_USER

NDB 8.0 introduces a new mechanism for sharing and synchronizing
users, roles, and privileges between SQL nodes connected to an NDB
Cluster. This can be enabled by granting the
[`NDB_STORED_USER`](privileges-provided.html#priv_ndb-stored-user) privilege. See the
description of the privilege for usage information.

`NDB_STORED_USER` is printed in the output of
[`SHOW GRANTS`](show-grants.html "15.7.7.21 SHOW GRANTS Statement") as with any other
privilege, as shown here:

```
mysql> SHOW GRANTS for 'jon'@'localhost';
+---------------------------------------------------+
| Grants for jon@localhost                          |
+---------------------------------------------------+
| GRANT USAGE ON *.* TO `jon`@`localhost`           |
| GRANT NDB_STORED_USER ON *.* TO `jon`@`localhost` |
+---------------------------------------------------+
```

You can also verify that privileges are shared for this account
using the [**ndb\_select\_all**](mysql-cluster-programs-ndb-select-all.html "25.5.25 ndb_select_all — Print Rows from an NDB Table") utility supplied with
NDB Cluster, like this (some output wrapped to preserve
formatting):

```
$> ndb_select_all -d mysql ndb_sql_metadata | grep '`jon`@`localhost`'
12      "'jon'@'localhost'"     0       [NULL]  "GRANT USAGE ON *.* TO `jon`@`localhost`"
11      "'jon'@'localhost'"     0       2       "CREATE USER `jon`@`localhost`
IDENTIFIED WITH 'caching_sha2_password' AS
0x2441243030352466014340225A107D590E6E653B5D587922306102716D752E6656772F3038512F
6C5072776D30376D37347A384B557A4C564F70495158656A31382E45324E33
REQUIRE NONE PASSWORD EXPIRE DEFAULT ACCOUNT UNLOCK PASSWORD HISTORY DEFAULT
PASSWORD REUSE INTERVAL DEFAULT PASSWORD REQUIRE CURRENT DEFAULT"
12      "'jon'@'localhost'"     1       [NULL]  "GRANT NDB_STORED_USER ON *.* TO `jon`@`localhost`"
```

`ndb_sql_metadata` is a special
`NDB` table that is not visible using the
[**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") or other MySQL client.

A statement granting the
[`NDB_STORED_USER`](privileges-provided.html#priv_ndb-stored-user) privilege, such as
`GRANT NDB_STORED_USER ON *.* TO
'cluster_app_user'@'localhost'`, works by directing
`NDB` to create a snapshot using the queries
`SHOW CREATE USER cluster_app_user@localhost` and
`SHOW GRANTS FOR cluster_app_user@localhost`,
then storing the results in `ndb_sql_metadata`.
Any other SQL nodes are then requested to read and apply the
snapshot. Whenever a MySQL server starts up and joins the cluster
as an SQL node it executes these stored
[`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") and
[`GRANT`](grant.html "15.7.1.6 GRANT Statement") statements as part of the
cluster schema synchronization process.

Whenever an SQL statement is executed on an SQL node other than
the one where it originated, the statement is run in a utility
thread of the `NDBCLUSTER` storage engine; this
is done within a security environment equivalent to that of the
MySQL replication replica applier thread.

Beginning with NDB 8.0.27, an SQL node performing a change to user
privileges takes a global lock before doing so, which prevents
deadlocks by concurrent ACL operations on different SQL nodes.
Prior to NDB 8.0.27, changes to users with
[`NDB_STORED_USER`](privileges-provided.html#priv_ndb-stored-user) were updated in a
completely asynchronous fashion, without any locks being taken.

You should keep in mind that, because shared schema change
operations are performed synchronously, the next shared schema
change following a change to any shared user or users serves as a
synchronization point. Any pending user changes run to completion
before the schema change distribution can begin; after this the
schema change itself runs synchronously. For example, if a
[`DROP DATABASE`](drop-database.html "15.1.24 DROP DATABASE Statement") statement follows a
[`DROP USER`](drop-user.html "15.7.1.5 DROP USER Statement") of a distributed user,
the drop of the database cannot take place until the drop of the
user has completed on all SQL nodes.

In the event that multiple [`GRANT`](grant.html "15.7.1.6 GRANT Statement"),
[`REVOKE`](revoke.html "15.7.1.8 REVOKE Statement"), or other user
administration statements from multiple SQL nodes cause privileges
for a given user to diverge on different SQL nodes, you can fix
this problem by issuing `GRANT NDB_STORED_USER`
for this user on an SQL node where the privileges are known to be
correct; this causes a new snapshot of the privileges to be taken
and synchronized to the other SQL nodes.

NDB Cluster 8.0 does not support distribution of MySQL users and
privileges across SQL nodes in an NDB Cluster by altering the
MySQL privilege tables such that they used the
`NDB` storage engine as in NDB 7.6 and earlier
releases (see
[Distributed Privileges Using Shared Grant Tables](/doc/refman/5.7/en/mysql-cluster-privilege-distribution.html)).
For information about the impact of this change on upgrades to NDB
8.0 from a previous release, see
[Section 25.3.7, “Upgrading and Downgrading NDB Cluster”](mysql-cluster-upgrade-downgrade.html "25.3.7 Upgrading and Downgrading NDB Cluster").