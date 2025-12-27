#### 21.6.18.2 NDB Cluster and MySQL Privileges

In this section, we discuss how the MySQL privilege system works in relation to NDB Cluster and the implications of this for keeping an NDB Cluster secure.

Standard MySQL privileges apply to NDB Cluster tables. This includes all MySQL privilege types ([`SELECT`](privileges-provided.html#priv_select) privilege, [`UPDATE`](privileges-provided.html#priv_update) privilege, [`DELETE`](privileges-provided.html#priv_delete) privilege, and so on) granted on the database, table, and column level. As with any other MySQL Server, user and privilege information is stored in the `mysql` system database. The SQL statements used to grant and revoke privileges on [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables, databases containing such tables, and columns within such tables are identical in all respects with the [`GRANT`](grant.html "13.7.1.4 GRANT Statement") and [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") statements used in connection with database objects involving any (other) MySQL storage engine. The same thing is true with respect to the [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") and [`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement") statements.

It is important to keep in mind that, by default, the MySQL grant tables use the [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") storage engine. Because of this, those tables are not normally duplicated or shared among MySQL servers acting as SQL nodes in an NDB Cluster. In other words, changes in users and their privileges do not automatically propagate between SQL nodes by default. If you wish, you can enable automatic distribution of MySQL users and privileges across NDB Cluster SQL nodes; see [Section 21.6.13, “Distributed Privileges Using Shared Grant Tables”](mysql-cluster-privilege-distribution.html "21.6.13 Distributed Privileges Using Shared Grant Tables"), for details.

Conversely, because there is no way in MySQL to deny privileges (privileges can either be revoked or not granted in the first place, but not denied as such), there is no special protection for [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables on one SQL node from users that have privileges on another SQL node; (This is true even if you are not using automatic distribution of user privileges. The definitive example of this is the MySQL `root` account, which can perform any action on any database object. In combination with empty `[mysqld]` or `[api]` sections of the `config.ini` file, this account can be especially dangerous. To understand why, consider the following scenario:

* The `config.ini` file contains at least one empty `[mysqld]` or `[api]` section. This means that the NDB Cluster management server performs no checking of the host from which a MySQL Server (or other API node) accesses the NDB Cluster.

* There is no firewall, or the firewall fails to protect against access to the NDB Cluster from hosts external to the network.

* The host name or IP address of the NDB Cluster management server is known or can be determined from outside the network.

If these conditions are true, then anyone, anywhere can start a MySQL Server with [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) [`--ndb-connectstring=management_host`](mysql-cluster-options-variables.html#option_mysqld_ndb-connectstring) and access this NDB Cluster. Using the MySQL `root` account, this person can then perform the following actions:

* Execute metadata statements such as [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") statement (to obtain a list of all [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") databases on the server) or [`SHOW TABLES FROM some_ndb_database`](show-tables.html "13.7.5.37 SHOW TABLES Statement") statement to obtain a list of all [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables in a given database

* Run any legal MySQL statements on any of the discovered tables, such as:

  + `SELECT * FROM some_table` to read all the data from any table

  + `DELETE FROM some_table` to delete all the data from a table

  + `DESCRIBE some_table` or `SHOW CREATE TABLE some_table` to determine the table schema

  + `UPDATE some_table SET column1 = some_value` to fill a table column with “garbage” data; this could actually cause much greater damage than simply deleting all the data

    More insidious variations might include statements like these:

    ```sql
    UPDATE some_table SET an_int_column = an_int_column + 1
    ```

    or

    ```sql
    UPDATE some_table SET a_varchar_column = REVERSE(a_varchar_column)
    ```

    Such malicious statements are limited only by the imagination of the attacker.

  The only tables that would be safe from this sort of mayhem would be those tables that were created using storage engines other than [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), and so not visible to a “rogue” SQL node.

  A user who can log in as `root` can also access the `INFORMATION_SCHEMA` database and its tables, and so obtain information about databases, tables, stored routines, scheduled events, and any other database objects for which metadata is stored in `INFORMATION_SCHEMA`.

  It is also a very good idea to use different passwords for the `root` accounts on different NDB Cluster SQL nodes unless you are using distributed privileges.

In sum, you cannot have a safe NDB Cluster if it is directly accessible from outside your local network.

Important

*Never leave the MySQL root account password empty*. This is just as true when running MySQL as an NDB Cluster SQL node as it is when running it as a standalone (non-Cluster) MySQL Server, and should be done as part of the MySQL installation process before configuring the MySQL Server as an SQL node in an NDB Cluster.

If you wish to employ NDB Cluster's distributed privilege capabilities, you should not simply convert the system tables in the `mysql` database to use the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine manually. Use the stored procedure provided for this purpose instead; see [Section 21.6.13, “Distributed Privileges Using Shared Grant Tables”](mysql-cluster-privilege-distribution.html "21.6.13 Distributed Privileges Using Shared Grant Tables").

Otherwise, if you need to synchronize `mysql` system tables between SQL nodes, you can use standard MySQL replication to do so, or employ a script to copy table entries between the MySQL servers.

**Summary.** The most important points to remember regarding the MySQL privilege system with regard to NDB Cluster are listed here:

1. Users and privileges established on one SQL node do not automatically exist or take effect on other SQL nodes in the cluster. Conversely, removing a user or privilege on one SQL node in the cluster does not remove the user or privilege from any other SQL nodes.

2. You can distribute MySQL users and privileges among SQL nodes using the SQL script, and the stored procedures it contains, that are supplied for this purpose in the NDB Cluster distribution.

3. Once a MySQL user is granted privileges on an [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table from one SQL node in an NDB Cluster, that user can “see” any data in that table regardless of the SQL node from which the data originated, even if you are not using privilege distribution.
