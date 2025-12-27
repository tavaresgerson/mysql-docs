### 14.21.6 The InnoDB memcached Plugin and Replication

Because the `daemon_memcached` plugin supports the MySQL binary log, updates made on a source server through the **memcached** interface can be replicated for backup, balancing intensive read workloads, and high availability. All **memcached** commands are supported with binary logging.

You do not need to set up the `daemon_memcached` plugin on replica servers. The primary advantage of this configuration is increased write throughput on the source. The speed of the replication mechanism is not affected.

The following sections show how to use the binary log capability when using the `daemon_memcached` plugin with MySQL replication. It is assumed that you have completed the setup described in Section 14.21.3, “Setting Up the InnoDB memcached Plugin”.

#### Enabling the InnoDB memcached Binary Log

1. To use the `daemon_memcached` plugin with the MySQL binary log, enable the `innodb_api_enable_binlog` configuration option on the source server. This option can only be set at server startup. You must also enable the MySQL binary log on the source server using the `--log-bin` option. You can add these options to the MySQL configuration file, or on the **mysqld** command line.

   ```sql
   mysqld ... --log-bin -–innodb_api_enable_binlog=1
   ```

2. Configure the source and replica server, as described in Section 16.1.2, “Setting Up Binary Log File Position Based Replication”.

3. Use **mysqldump** to create a source data snapshot, and sync the snapshot to the replica server.

   ```sql
   source $> mysqldump --all-databases --lock-all-tables > dbdump.db
   replica $> mysql < dbdump.db
   ```

4. On the source server, issue `SHOW MASTER STATUS` to obtain the source binary log coordinates.

   ```sql
   mysql> SHOW MASTER STATUS;
   ```

5. On the replica server, use a `CHANGE MASTER TO` statement to set up a replica server using the source binary log coordinates.

   ```sql
   mysql> CHANGE MASTER TO
          MASTER_HOST='localhost',
          MASTER_USER='root',
          MASTER_PASSWORD='',
          MASTER_PORT = 13000,
          MASTER_LOG_FILE='0.000001,
          MASTER_LOG_POS=114;
   ```

6. Start the replica.

   ```sql
   mysql> START SLAVE;
   ```

   If the error log prints output similar to the following, the replica is ready for replication.

   ```sql
   2013-09-24T13:04:38.639684Z 49 [Note] Slave I/O thread: connected to
   master 'root@localhost:13000', replication started in log '0.000001'
   at position 114
   ```

#### Testing the InnoDB memcached Replication Configuration

This example demonstrates how to test the `InnoDB` **memcached** replication configuration using the **memcached** and telnet to insert, update, and delete data. A MySQL client is used to verify results on the source and replica servers.

The example uses the `demo_test` table, which was created by the `innodb_memcached_config.sql` configuration script during the initial setup of the `daemon_memcached` plugin. The `demo_test` table contains a single example record.

1. Use the `set` command to insert a record with a key of `test1`, a flag value of `10`, an expiration value of `0`, a cas value of 1, and a value of `t1`.

   ```sql
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'.
   set test1 10 0 1
   t1
   STORED
   ```

2. On the source server, check that the record was inserted into the `demo_test` table. Assuming the `demo_test` table was not previously modified, there should be two records. The example record with a key of `AA`, and the record you just inserted, with a key of `test1`. The `c1` column maps to the key, the `c2` column to the value, the `c3` column to the flag value, the `c4` column to the cas value, and the `c5` column to the expiration time. The expiration time was set to 0, since it is unused.

   ```sql
   mysql> SELECT * FROM test.demo_test;
   +-------+--------------+------+------+------+
   | c1    | c2           | c3   | c4   | c5   |
   +-------+--------------+------+------+------+
   | AA    | HELLO, HELLO |    8 |    0 |    0 |
   | test1 | t1           |   10 |    1 |    0 |
   +-------+--------------+------+------+------+
   ```

3. Check to verify that the same record was replicated to the replica server.

   ```sql
   mysql> SELECT * FROM test.demo_test;
   +-------+--------------+------+------+------+
   | c1    | c2           | c3   | c4   | c5   |
   +-------+--------------+------+------+------+
   | AA    | HELLO, HELLO |    8 |    0 |    0 |
   | test1 | t1           |   10 |    1 |    0 |
   +-------+--------------+------+------+------+
   ```

4. Use the `set` command to update the key to a value of `new`.

   ```sql
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'.
   set test1 10 0 2
   new
   STORED
   ```

   The update is replicated to the replica server (notice that the `cas` value is also updated).

   ```sql
   mysql> SELECT * FROM test.demo_test;
   +-------+--------------+------+------+------+
   | c1    | c2           | c3   | c4   | c5   |
   +-------+--------------+------+------+------+
   | AA    | HELLO, HELLO |    8 |    0 |    0 |
   | test1 | new          |   10 |    2 |    0 |
   +-------+--------------+------+------+------+
   ```

5. Delete the `test1` record using a `delete` command.

   ```sql
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'.
   delete test1
   DELETED
   ```

   When the `delete` operation is replicated to the replica, the `test1` record on the replica is also deleted.

   ```sql
   mysql> SELECT * FROM test.demo_test;
   +----+--------------+------+------+------+
   | c1 | c2           | c3   | c4   | c5   |
   +----+--------------+------+------+------+
   | AA | HELLO, HELLO |    8 |    0 |    0 |
   +----+--------------+------+------+------+
   ```

6. Remove all rows from the table using the `flush_all` command.

   ```sql
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'.
   flush_all
   OK
   ```

   ```sql
   mysql> SELECT * FROM test.demo_test;
   Empty set (0.00 sec)
   ```

7. Telnet to the source server and enter two new records.

   ```sql
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'
   set test2 10 0 4
   again
   STORED
   set test3 10 0 5
   again1
   STORED
   ```

8. Confirm that the two records were replicated to the replica server.

   ```sql
   mysql> SELECT * FROM test.demo_test;
   +-------+--------------+------+------+------+
   | c1    | c2           | c3   | c4   | c5   |
   +-------+--------------+------+------+------+
   | test2 | again        |   10 |    4 |    0 |
   | test3 | again1       |   10 |    5 |    0 |
   +-------+--------------+------+------+------+
   ```

9. Remove all rows from the table using the `flush_all` command.

   ```sql
   telnet 127.0.0.1 11211
   Trying 127.0.0.1...
   Connected to 127.0.0.1.
   Escape character is '^]'.
   flush_all
   OK
   ```

10. Check to ensure that the `flush_all` operation was replicated on the replica server.

    ```sql
    mysql> SELECT * FROM test.demo_test;
    Empty set (0.00 sec)
    ```

#### InnoDB memcached Binary Log Notes

Binary Log Format:

* Most **memcached** operations are mapped to DML statements (analogous to insert, delete, update). Since there is no actual SQL statement being processed by the MySQL server, all **memcached** commands (except for `flush_all`) use Row-Based Replication (RBR) logging, which is independent of any server `binlog_format` setting.

* The **memcached** `flush_all` command is mapped to the `TRUNCATE TABLE` command. Since DDL commands can only use statement-based logging, the `flush_all` command is replicated by sending a `TRUNCATE TABLE` statement.

Transactions:

* The concept of transactions has not typically been part of **memcached** applications. For performance considerations, `daemon_memcached_r_batch_size` and `daemon_memcached_w_batch_size` are used to control the batch size for read and write transactions. These settings do not affect replication. Each SQL operation on the underlying `InnoDB` table is replicated after successful completion.

* The default value of `daemon_memcached_w_batch_size` is `1`, which means that each **memcached** write operation is committed immediately. This default setting incurs a certain amount of performance overhead to avoid inconsistencies in the data that is visible on the source and replica servers. The replicated records are always available immediately on the replica server. If you set `daemon_memcached_w_batch_size` to a value greater than `1`, records inserted or updated through **memcached** are not immediately visible on the source server; to view the records on the source server before they are committed, issue `SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED`.
