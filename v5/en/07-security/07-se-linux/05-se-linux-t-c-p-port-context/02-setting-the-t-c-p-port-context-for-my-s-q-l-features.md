#### 6.7.5.2 Setting the TCP Port Context for MySQL Features

If you enable certain MySQL features, you might need to set the SELinux TCP port context for additional ports used by those features. If ports used by MySQL features do not have the correct SELinux context, the features might not function correctly.

The following sections describe how to set port contexts for MySQL features. Generally, the same method can be used to set the port context for any MySQL features. For information about ports used by MySQL features, refer to the [MySQL Port Reference](/doc/mysql-port-reference/en/).

##### Setting the TCP Port Context for Group Replication

If SELinux is enabled, you must set the port context for the Group Replication communication port, which is defined by the [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address) variable. [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") must be able to bind to the Group Replication communication port and listen there. InnoDB Cluster relies on Group Replication so this applies equally to instances used in a cluster. To view ports currently used by MySQL, issue:

```sql
semanage port -l | grep mysqld
```

Assuming the Group Replication communication port is 33061, set the port context by issuing:

```sql
semanage port -a -t mysqld_port_t -p tcp 33061
```

##### Setting the TCP Port Context for Document Store

If SELinux is enabled, you must set the port context for the communication port used by X Plugin, which is defined by the [`mysqlx_port`](x-plugin-options-system-variables.html#sysvar_mysqlx_port) variable. [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") must be able to bind to the X Plugin communication port and listen there.

Assuming the X Plugin communication port is 33060, set the port context by issuing:

```sql
semanage port -a -t mysqld_port_t -p tcp 33060
```
