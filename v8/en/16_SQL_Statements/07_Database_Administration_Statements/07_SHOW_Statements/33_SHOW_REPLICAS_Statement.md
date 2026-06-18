#### 15.7.7.33 SHOW REPLICAS Statement

```
{SHOW REPLICAS}
```

Displays a list of replicas currently registered with the
source. From MySQL 8.0.22, use [`SHOW
REPLICAS`](show-replicas.html "15.7.7.33 SHOW REPLICAS Statement") in place of [`SHOW SLAVE
HOSTS`](show-slave-hosts.html "15.7.7.34 SHOW SLAVE HOSTS | SHOW REPLICAS Statement"), which is deprecated from that release. In
releases before MySQL 8.0.22, use [`SHOW
SLAVE HOSTS`](show-slave-hosts.html "15.7.7.34 SHOW SLAVE HOSTS | SHOW REPLICAS Statement"). `SHOW REPLICAS` requires
the [`REPLICATION SLAVE`](privileges-provided.html#priv_replication-slave) privilege.

`SHOW REPLICAS` should be executed on a server
that acts as a replication source. The statement displays
information about servers that are or have been connected as
replicas, with each row of the result corresponding to one
replica server, as shown here:

```
mysql> SHOW REPLICAS;
+------------+-----------+------+-----------+--------------------------------------+
| Server_id  | Host      | Port | Source_id | Replica_UUID                         |
+------------+-----------+------+-----------+--------------------------------------+
|         10 | iconnect2 | 3306 |         3 | 14cb6624-7f93-11e0-b2c0-c80aa9429562 |
|         21 | athena    | 3306 |         3 | 07af4990-f41f-11df-a566-7ac56fdaf645 |
+------------+-----------+------+-----------+--------------------------------------+
```

* `Server_id`: The unique server ID of the
  replica server, as configured in the replica server's
  option file, or on the command line with
  [`--server-id=value`](replication-options.html#sysvar_server_id).

* `Host`: The host name of the replica
  server, as specified on the replica with the
  [`--report-host`](replication-options-replica.html#sysvar_report_host) option. This
  can differ from the machine name as configured in the
  operating system.

* `User`: The replica server user name, as
  specified on the replica with the
  [`--report-user`](replication-options-replica.html#sysvar_report_user) option.
  Statement output includes this column only if the source
  server is started with the
  [`--show-replica-auth-info`](replication-options-source.html#option_mysqld_show-replica-auth-info) or
  [`--show-slave-auth-info`](replication-options-source.html#option_mysqld_show-slave-auth-info)
  option.

* `Password`: The replica server password, as
  specified on the replica with the
  [`--report-password`](replication-options-replica.html#sysvar_report_password) option.
  Statement output includes this column only if the source
  server is started with the
  [`--show-replica-auth-info`](replication-options-source.html#option_mysqld_show-replica-auth-info) or
  [`--show-slave-auth-info`](replication-options-source.html#option_mysqld_show-slave-auth-info)
  option.

* `Port`: The port on the source to which the
  replica server is listening, as specified on the replica
  with the [`--report-port`](replication-options-replica.html#sysvar_report_port)
  option.

  A zero in this column means that the replica port
  ([`--report-port`](replication-options-replica.html#sysvar_report_port)) was not set.

* `Source_id`: The unique server ID of the
  source server that the replica server is replicating from.
  This is the server ID of the server on which `SHOW
  REPLICAS` is executed, so this same value is listed
  for each row in the result.

* `Replica_UUID`: The globally unique ID of
  this replica, as generated on the replica and found in the
  replica's `auto.cnf` file.