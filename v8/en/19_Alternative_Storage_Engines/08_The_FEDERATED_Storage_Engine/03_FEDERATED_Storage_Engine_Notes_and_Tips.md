### 18.8.3 FEDERATED Storage Engine Notes and Tips

You should be aware of the following points when using the
`FEDERATED` storage engine:

* `FEDERATED` tables may be replicated to other
  replicas, but you must ensure that the replica servers are
  able to use the user/password combination that is defined in
  the `CONNECTION` string (or the row in the
  `mysql.servers` table) to connect to the
  remote server.

The following items indicate features that the
`FEDERATED` storage engine does and does not
support:

* The remote server must be a MySQL server.
* The remote table that a `FEDERATED` table
  points to *must* exist before you try to
  access the table through the `FEDERATED`
  table.

* It is possible for one `FEDERATED` table to
  point to another, but you must be careful not to create a
  loop.

* A `FEDERATED` table does not support indexes
  in the usual sense; because access to the table data is
  handled remotely, it is actually the remote table that makes
  use of indexes. This means that, for a query that cannot use
  any indexes and so requires a full table scan, the server
  fetches all rows from the remote table and filters them
  locally. This occurs regardless of any
  `WHERE` or `LIMIT` used with
  this [`SELECT`](select.html "15.2.13 SELECT Statement") statement; these
  clauses are applied locally to the returned rows.

  Queries that fail to use indexes can thus cause poor
  performance and network overload. In addition, since returned
  rows must be stored in memory, such a query can also lead to
  the local server swapping, or even hanging.

* Care should be taken when creating a
  `FEDERATED` table since the index definition
  from an equivalent `MyISAM` or other table
  may not be supported. For example, creating a
  `FEDERATED` table fails if the table uses an
  index prefix on any [`VARCHAR`](char.html "13.3.2 The CHAR and VARCHAR Types"),
  [`TEXT`](blob.html "13.3.4 The BLOB and TEXT Types") or
  [`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types") columns. The following
  definition using `MyISAM` is valid:

  ```
  CREATE TABLE `T1`(`A` VARCHAR(100),UNIQUE KEY(`A`(30))) ENGINE=MYISAM;
  ```

  The key prefix in this example is incompatible with the
  `FEDERATED` engine, and the equivalent
  statement fails:

  ```
  CREATE TABLE `T1`(`A` VARCHAR(100),UNIQUE KEY(`A`(30))) ENGINE=FEDERATED
    CONNECTION='MYSQL://127.0.0.1:3306/TEST/T1';
  ```

  If possible, you should try to separate the column and index
  definition when creating tables on both the remote server and
  the local server to avoid these index issues.

* Internally, the implementation uses
  [`SELECT`](select.html "15.2.13 SELECT Statement"),
  [`INSERT`](insert.html "15.2.7 INSERT Statement"),
  [`UPDATE`](update.html "15.2.17 UPDATE Statement"), and
  [`DELETE`](delete.html "15.2.2 DELETE Statement"), but not
  [`HANDLER`](handler.html "15.2.5 HANDLER Statement").

* The `FEDERATED` storage engine supports
  [`SELECT`](select.html "15.2.13 SELECT Statement"),
  [`INSERT`](insert.html "15.2.7 INSERT Statement"),
  [`UPDATE`](update.html "15.2.17 UPDATE Statement"),
  [`DELETE`](delete.html "15.2.2 DELETE Statement"),
  [`TRUNCATE TABLE`](truncate-table.html "15.1.37 TRUNCATE TABLE Statement"), and indexes. It
  does not support [`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement"),
  or any Data Definition Language statements that directly
  affect the structure of the table, other than
  [`DROP TABLE`](drop-table.html "15.1.32 DROP TABLE Statement"). The current
  implementation does not use prepared statements.

* `FEDERATED` accepts
  [`INSERT
  ... ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "15.2.7.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") statements, but if a
  duplicate-key violation occurs, the statement fails with an
  error.

* Transactions are not supported.
* `FEDERATED` performs bulk-insert handling
  such that multiple rows are sent to the remote table in a
  batch, which improves performance. Also, if the remote table
  is transactional, it enables the remote storage engine to
  perform statement rollback properly should an error occur.
  This capability has the following limitations:

  + The size of the insert cannot exceed the maximum packet
    size between servers. If the insert exceeds this size, it
    is broken into multiple packets and the rollback problem
    can occur.

  + Bulk-insert handling does not occur for
    [`INSERT
    ... ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "15.2.7.2 INSERT ... ON DUPLICATE KEY UPDATE Statement").

* There is no way for the `FEDERATED` engine to
  know if the remote table has changed. The reason for this is
  that this table must work like a data file that would never be
  written to by anything other than the database system. The
  integrity of the data in the local table could be breached if
  there was any change to the remote database.

* When using a `CONNECTION` string, you cannot
  use an '@' character in the password. You can get round this
  limitation by using the [`CREATE
  SERVER`](create-server.html "15.1.18 CREATE SERVER Statement") statement to create a server connection.

* The [`insert_id`](server-system-variables.html#sysvar_insert_id) and
  [`timestamp`](server-system-variables.html#sysvar_timestamp) options are not
  propagated to the data provider.

* Any [`DROP TABLE`](drop-table.html "15.1.32 DROP TABLE Statement") statement issued
  against a `FEDERATED` table drops only the
  local table, not the remote table.

* User-defined partitioning is not supported for
  `FEDERATED` tables.