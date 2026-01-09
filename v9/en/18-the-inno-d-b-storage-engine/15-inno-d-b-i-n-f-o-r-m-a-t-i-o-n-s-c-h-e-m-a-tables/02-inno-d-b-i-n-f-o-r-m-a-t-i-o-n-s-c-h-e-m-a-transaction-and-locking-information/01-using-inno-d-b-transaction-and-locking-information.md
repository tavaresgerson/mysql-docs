#### 17.15.2.1 Using InnoDB Transaction and Locking Information

This section describes the use of locking information as exposed by the Performance Schema `data_locks` and `data_lock_waits` tables.

##### Identifying Blocking Transactions

It is sometimes helpful to identify which transaction blocks another. The tables that contain information about `InnoDB` transactions and data locks enable you to determine which transaction is waiting for another, and which resource is being requested. (For descriptions of these tables, see Section 17.15.2, “InnoDB INFORMATION\_SCHEMA Transaction and Locking Information”.)

Suppose that three sessions are running concurrently. Each session corresponds to a MySQL thread, and executes one transaction after another. Consider the state of the system when these sessions have issued the following statements, but none has yet committed its transaction:

* Session A:

  ```
  BEGIN;
  SELECT a FROM t FOR UPDATE;
  SELECT SLEEP(100);
  ```

* Session B:

  ```
  SELECT b FROM t FOR UPDATE;
  ```

* Session C:

  ```
  SELECT c FROM t FOR UPDATE;
  ```

In this scenario, use the following query to see which transactions are waiting and which transactions are blocking them:

```
SELECT
  r.trx_id waiting_trx_id,
  r.trx_mysql_thread_id waiting_thread,
  r.trx_query waiting_query,
  b.trx_id blocking_trx_id,
  b.trx_mysql_thread_id blocking_thread,
  b.trx_query blocking_query
FROM       performance_schema.data_lock_waits w
INNER JOIN information_schema.innodb_trx b
  ON b.trx_id = w.blocking_engine_transaction_id
INNER JOIN information_schema.innodb_trx r
  ON r.trx_id = w.requesting_engine_transaction_id;
```

Or, more simply, use the `sys` schema `innodb_lock_waits` view:

```
SELECT
  waiting_trx_id,
  waiting_pid,
  waiting_query,
  blocking_trx_id,
  blocking_pid,
  blocking_query
FROM sys.innodb_lock_waits;
```

If a NULL value is reported for the blocking query, see Identifying a Blocking Query After the Issuing Session Becomes Idle.

<table summary="The result set of a query against the perormance_schema.data_lock_waits and INFORMATION_SCHEMA.INNODB_TRX tables, shown in the preceding text, indicating which InnoDB threads are waiting for which other threads."><col style="width: 9%"/><col style="width: 9%"/><col style="width: 33%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 33%"/><thead><tr> <th>waiting trx id</th> <th>waiting thread</th> <th>waiting query</th> <th>blocking trx id</th> <th>blocking thread</th> <th>blocking query</th> </tr></thead><tbody><tr> <th><code>A4</code></th> <td><code>6</code></td> <td><code>SELECT b FROM t FOR UPDATE</code></td> <td><code>A3</code></td> <td><code>5</code></td> <td><code>SELECT SLEEP(100)</code></td> </tr><tr> <th><code>A5</code></th> <td><code>7</code></td> <td><code>SELECT c FROM t FOR UPDATE</code></td> <td><code>A3</code></td> <td><code>5</code></td> <td><code>SELECT SLEEP(100)</code></td> </tr><tr> <th><code>A5</code></th> <td><code>7</code></td> <td><code>SELECT c FROM t FOR UPDATE</code></td> <td><code>A4</code></td> <td><code>6</code></td> <td><code>SELECT b FROM t FOR UPDATE</code></td> </tr></tbody></table>

In the preceding table, you can identify sessions by the “waiting query” or “blocking query” columns. As you can see:

* Session B (trx id `A4`, thread `6`) and Session C (trx id `A5`, thread `7`) are both waiting for Session A (trx id `A3`, thread `5`).

* Session C is waiting for Session B as well as Session A.

You can see the underlying data in the `INFORMATION_SCHEMA` `INNODB_TRX` table and Performance Schema `data_locks` and `data_lock_waits` tables.

The following table shows some sample contents of the `INNODB_TRX` table.

<table summary="Sample data from the INFORMATION_SCHEMA.INNODB_TRX table, showing the typical types of entries for each column."><col style="width: 10%"/><col style="width: 13%"/><col style="width: 36%"/><col style="width: 30%"/><col style="width: 36%"/><col style="width: 19%"/><col style="width: 23%"/><col style="width: 45%"/><thead><tr> <th>trx id</th> <th>trx state</th> <th>trx started</th> <th>trx requested lock id</th> <th>trx wait started</th> <th>trx weight</th> <th>trx mysql thread id</th> <th>trx query</th> </tr></thead><tbody><tr> <th><code>A3</code></th> <td><code>RUN­NING</code></td> <td><code>2008-01-15 16:44:54</code></td> <td><code>NULL</code></td> <td><code>NULL</code></td> <td><code>2</code></td> <td><code>5</code></td> <td><code>SELECT SLEEP(100)</code></td> </tr><tr> <th><code>A4</code></th> <td><code>LOCK WAIT</code></td> <td><code>2008-01-15 16:45:09</code></td> <td><code>A4:1:3:2</code></td> <td><code>2008-01-15 16:45:09</code></td> <td><code>2</code></td> <td><code>6</code></td> <td><code>SELECT b FROM t FOR UPDATE</code></td> </tr><tr> <th><code>A5</code></th> <td><code>LOCK WAIT</code></td> <td><code>2008-01-15 16:45:14</code></td> <td><code>A5:1:3:2</code></td> <td><code>2008-01-15 16:45:14</code></td> <td><code>2</code></td> <td><code>7</code></td> <td><code>SELECT c FROM t FOR UPDATE</code></td> </tr></tbody></table>

The following table shows some sample contents of the `data_locks` table.

<table summary="Sample data from the Performance Schema data_locks table, showing the typical types of entries for each column."><col style="width: 26%"/><col style="width: 13%"/><col style="width: 14%"/><col style="width: 21%"/><col style="width: 16%"/><col style="width: 15%"/><col style="width: 29%"/><col style="width: 20%"/><thead><tr> <th>lock id</th> <th>lock trx id</th> <th>lock mode</th> <th>lock type</th> <th>lock schema</th> <th>lock table</th> <th>lock index</th> <th>lock data</th> </tr></thead><tbody><tr> <th><code>A3:1:3:2</code></th> <td><code>A3</code></td> <td><code>X</code></td> <td><code>RECORD</code></td> <td><code>test</code></td> <td><code>t</code></td> <td><code>PRIMARY</code></td> <td><code>0x0200</code></td> </tr><tr> <th><code>A4:1:3:2</code></th> <td><code>A4</code></td> <td><code>X</code></td> <td><code>RECORD</code></td> <td><code>test</code></td> <td><code>t</code></td> <td><code>PRIMARY</code></td> <td><code>0x0200</code></td> </tr><tr> <th><code>A5:1:3:2</code></th> <td><code>A5</code></td> <td><code>X</code></td> <td><code>RECORD</code></td> <td><code>test</code></td> <td><code>t</code></td> <td><code>PRIMARY</code></td> <td><code>0x0200</code></td> </tr></tbody></table>

The following table shows some sample contents of the `data_lock_waits` table.

<table summary="Sample data from the Performance Schema data_lock_waits table, showing the typical types of entries for each column."><col style="width: 10%"/><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><thead><tr> <th>requesting trx id</th> <th>requested lock id</th> <th>blocking trx id</th> <th>blocking lock id</th> </tr></thead><tbody><tr> <th><code>A4</code></th> <td><code>A4:1:3:2</code></td> <td><code>A3</code></td> <td><code>A3:1:3:2</code></td> </tr><tr> <th><code>A5</code></th> <td><code>A5:1:3:2</code></td> <td><code>A3</code></td> <td><code>A3:1:3:2</code></td> </tr><tr> <th><code>A5</code></th> <td><code>A5:1:3:2</code></td> <td><code>A4</code></td> <td><code>A4:1:3:2</code></td> </tr></tbody></table>

##### Identifying a Blocking Query After the Issuing Session Becomes Idle

When identifying blocking transactions, a NULL value is reported for the blocking query if the session that issued the query has become idle. In this case, use the following steps to determine the blocking query:

1. Identify the processlist ID of the blocking transaction. In the `sys.innodb_lock_waits` table, the processlist ID of the blocking transaction is the `blocking_pid` value.

2. Using the `blocking_pid`, query the MySQL Performance Schema `threads` table to determine the `THREAD_ID` of the blocking transaction. For example, if the `blocking_pid` is 6, issue this query:

   ```
   SELECT THREAD_ID FROM performance_schema.threads WHERE PROCESSLIST_ID = 6;
   ```

3. Using the `THREAD_ID`, query the Performance Schema `events_statements_current` table to determine the last query executed by the thread. For example, if the `THREAD_ID` is 28, issue this query:

   ```
   SELECT THREAD_ID, SQL_TEXT FROM performance_schema.events_statements_current
   WHERE THREAD_ID = 28\G
   ```

4. If the last query executed by the thread is not enough information to determine why a lock is held, you can query the Performance Schema `events_statements_history` table to view the last 10 statements executed by the thread.

   ```
   SELECT THREAD_ID, SQL_TEXT FROM performance_schema.events_statements_history
   WHERE THREAD_ID = 28 ORDER BY EVENT_ID;
   ```

##### Correlating InnoDB Transactions with MySQL Sessions

Sometimes it is useful to correlate internal `InnoDB` locking information with the session-level information maintained by MySQL. For example, you might like to know, for a given `InnoDB` transaction ID, the corresponding MySQL session ID and name of the session that may be holding a lock, and thus blocking other transactions.

The following output from the `INFORMATION_SCHEMA` `INNODB_TRX` table and Performance Schema `data_locks` and `data_lock_waits` tables is taken from a somewhat loaded system. As can be seen, there are several transactions running.

The following `data_locks` and `data_lock_waits` tables show that:

* Transaction `77F` (executing an `INSERT`) is waiting for transactions `77E`, `77D`, and `77B` to commit.

* Transaction `77E` (executing an `INSERT`) is waiting for transactions `77D` and `77B` to commit.

* Transaction `77D` (executing an `INSERT`) is waiting for transaction `77B` to commit.

* Transaction `77B` (executing an `INSERT`) is waiting for transaction `77A` to commit.

* Transaction `77A` is running, currently executing `SELECT`.

* Transaction `E56` (executing an `INSERT`) is waiting for transaction `E55` to commit.

* Transaction `E55` (executing an `INSERT`) is waiting for transaction `19C` to commit.

* Transaction `19C` is running, currently executing an `INSERT`.

Note

There may be inconsistencies between queries shown in the `INFORMATION_SCHEMA` `PROCESSLIST` and `INNODB_TRX` tables. For an explanation, see Section 17.15.2.3, “Persistence and Consistency of InnoDB Transaction and Locking Information”.

The following table shows the contents of the `PROCESSLIST` table for a system running a heavy workload.

<table summary="Sample data from the INFORMATION_SCHEMA.PROCESSLIST table, showing the internal workings of MySQL processes under a heavy workload."><col style="width: 8%"/><col style="width: 11%"/><col style="width: 21%"/><col style="width: 10%"/><col style="width: 20%"/><col style="width: 10%"/><col style="width: 20%"/><col style="width: 25%"/><thead><tr> <th>ID</th> <th>USER</th> <th>HOST</th> <th>DB</th> <th>COMMAND</th> <th>TIME</th> <th>STATE</th> <th>INFO</th> </tr></thead><tbody><tr> <th><code>384</code></th> <td><code>root</code></td> <td><code>localhost</code></td> <td><code>test</code></td> <td><code>Query</code></td> <td><code>10</code></td> <td><code>update</code></td> <td><code>INSERT INTO t2 VALUES …</code></td> </tr><tr> <th><code>257</code></th> <td><code>root</code></td> <td><code>localhost</code></td> <td><code>test</code></td> <td><code>Query</code></td> <td><code>3</code></td> <td><code>update</code></td> <td><code>INSERT INTO t2 VALUES …</code></td> </tr><tr> <th><code>130</code></th> <td><code>root</code></td> <td><code>localhost</code></td> <td><code>test</code></td> <td><code>Query</code></td> <td><code>0</code></td> <td><code>update</code></td> <td><code>INSERT INTO t2 VALUES …</code></td> </tr><tr> <th><code>61</code></th> <td><code>root</code></td> <td><code>localhost</code></td> <td><code>test</code></td> <td><code>Query</code></td> <td><code>1</code></td> <td><code>update</code></td> <td><code>INSERT INTO t2 VALUES …</code></td> </tr><tr> <th><code>8</code></th> <td><code>root</code></td> <td><code>localhost</code></td> <td><code>test</code></td> <td><code>Query</code></td> <td><code>1</code></td> <td><code>update</code></td> <td><code>INSERT INTO t2 VALUES …</code></td> </tr><tr> <th><code>4</code></th> <td><code>root</code></td> <td><code>localhost</code></td> <td><code>test</code></td> <td><code>Query</code></td> <td><code>0</code></td> <td><code>preparing</code></td> <td><code>SELECT * FROM PROCESSLIST</code></td> </tr><tr> <th><code>2</code></th> <td><code>root</code></td> <td><code>localhost</code></td> <td><code>test</code></td> <td><code>Sleep</code></td> <td><code>566</code></td> <td><code></code></td> <td><code>NULL</code></td> </tr></tbody></table>

The following table shows the contents of the `INNODB_TRX` table for a system running a heavy workload.

<table summary="Sample data from the INFORMATION_SCHEMA.INNODB_TRX table, showing the internal workings of InnoDB transactions under a heavy workload."><col style="width: 8%"/><col style="width: 10%"/><col style="width: 19%"/><col style="width: 21%"/><col style="width: 19%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 31%"/><thead><tr> <th>trx id</th> <th>trx state</th> <th>trx started</th> <th>trx requested lock id</th> <th>trx wait started</th> <th>trx weight</th> <th>trx mysql thread id</th> <th>trx query</th> </tr></thead><tbody><tr> <th><code>77F</code></th> <td><code>LOCK WAIT</code></td> <td><code>2008-01-15 13:10:16</code></td> <td><code>77F</code></td> <td><code>2008-01-15 13:10:16</code></td> <td><code>1</code></td> <td><code>876</code></td> <td><code>INSERT INTO t09 (D, B, C) VALUES …</code></td> </tr><tr> <th><code>77E</code></th> <td><code>LOCK WAIT</code></td> <td><code>2008-01-15 13:10:16</code></td> <td><code>77E</code></td> <td><code>2008-01-15 13:10:16</code></td> <td><code>1</code></td> <td><code>875</code></td> <td><code>INSERT INTO t09 (D, B, C) VALUES …</code></td> </tr><tr> <th><code>77D</code></th> <td><code>LOCK WAIT</code></td> <td><code>2008-01-15 13:10:16</code></td> <td><code>77D</code></td> <td><code>2008-01-15 13:10:16</code></td> <td><code>1</code></td> <td><code>874</code></td> <td><code>INSERT INTO t09 (D, B, C) VALUES …</code></td> </tr><tr> <th><code>77B</code></th> <td><code>LOCK WAIT</code></td> <td><code>2008-01-15 13:10:16</code></td> <td><code>77B:733:12:1</code></td> <td><code>2008-01-15 13:10:16</code></td> <td><code>4</code></td> <td><code>873</code></td> <td><code>INSERT INTO t09 (D, B, C) VALUES …</code></td> </tr><tr> <th><code>77A</code></th> <td><code>RUN­NING</code></td> <td><code>2008-01-15 13:10:16</code></td> <td><code>NULL</code></td> <td><code>NULL</code></td> <td><code>4</code></td> <td><code>872</code></td> <td><code>SELECT b, c FROM t09 WHERE …</code></td> </tr><tr> <th><code>E56</code></th> <td><code>LOCK WAIT</code></td> <td><code>2008-01-15 13:10:06</code></td> <td><code>E56:743:6:2</code></td> <td><code>2008-01-15 13:10:06</code></td> <td><code>5</code></td> <td><code>384</code></td> <td><code>INSERT INTO t2 VALUES …</code></td> </tr><tr> <th><code>E55</code></th> <td><code>LOCK WAIT</code></td> <td><code>2008-01-15 13:10:06</code></td> <td><code>E55:743:38:2</code></td> <td><code>2008-01-15 13:10:13</code></td> <td><code>965</code></td> <td><code>257</code></td> <td><code>INSERT INTO t2 VALUES …</code></td> </tr><tr> <th><code>19C</code></th> <td><code>RUN­NING</code></td> <td><code>2008-01-15 13:09:10</code></td> <td><code>NULL</code></td> <td><code>NULL</code></td> <td><code>2900</code></td> <td><code>130</code></td> <td><code>INSERT INTO t2 VALUES …</code></td> </tr><tr> <th><code>E15</code></th> <td><code>RUN­NING</code></td> <td><code>2008-01-15 13:08:59</code></td> <td><code>NULL</code></td> <td><code>NULL</code></td> <td><code>5395</code></td> <td><code>61</code></td> <td><code>INSERT INTO t2 VALUES …</code></td> </tr><tr> <th><code>51D</code></th> <td><code>RUN­NING</code></td> <td><code>2008-01-15 13:08:47</code></td> <td><code>NULL</code></td> <td><code>NULL</code></td> <td><code>9807</code></td> <td><code>8</code></td> <td><code>INSERT INTO t2 VALUES …</code></td> </tr></tbody></table>

The following table shows the contents of the `data_lock_waits` table for a system running a heavy workload.

<table summary="Sample data from the Performance Schema data_lock_waits table, showing the internal workings of InnoDB locking under a heavy workload."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>requesting trx id</th> <th>requested lock id</th> <th>blocking trx id</th> <th>blocking lock id</th> </tr></thead><tbody><tr> <th><code>77F</code></th> <td><code>77F:806</code></td> <td><code>77E</code></td> <td><code>77E:806</code></td> </tr><tr> <th><code>77F</code></th> <td><code>77F:806</code></td> <td><code>77D</code></td> <td><code>77D:806</code></td> </tr><tr> <th><code>77F</code></th> <td><code>77F:806</code></td> <td><code>77B</code></td> <td><code>77B:806</code></td> </tr><tr> <th><code>77E</code></th> <td><code>77E:806</code></td> <td><code>77D</code></td> <td><code>77D:806</code></td> </tr><tr> <th><code>77E</code></th> <td><code>77E:806</code></td> <td><code>77B</code></td> <td><code>77B:806</code></td> </tr><tr> <th><code>77D</code></th> <td><code>77D:806</code></td> <td><code>77B</code></td> <td><code>77B:806</code></td> </tr><tr> <th><code>77B</code></th> <td><code>77B:733:12:1</code></td> <td><code>77A</code></td> <td><code>77A:733:12:1</code></td> </tr><tr> <th><code>E56</code></th> <td><code>E56:743:6:2</code></td> <td><code>E55</code></td> <td><code>E55:743:6:2</code></td> </tr><tr> <th><code>E55</code></th> <td><code>E55:743:38:2</code></td> <td><code>19C</code></td> <td><code>19C:743:38:2</code></td> </tr></tbody></table>

The following table shows the contents of the `data_locks` table for a system running a heavy workload.

<table summary="Sample data from the Performance Schema data_locks table, showing the internal workings of InnoDB locking under a heavy workload."><col style="width: 18%"/><col style="width: 9%"/><col style="width: 12%"/><col style="width: 12%"/><col style="width: 9%"/><col style="width: 8%"/><col style="width: 15%"/><col style="width: 17%"/><thead><tr> <th>lock id</th> <th>lock trx id</th> <th>lock mode</th> <th>lock type</th> <th>lock schema</th> <th>lock table</th> <th>lock index</th> <th>lock data</th> </tr></thead><tbody><tr> <th><code>77F:806</code></th> <td><code>77F</code></td> <td><code>AUTO_INC</code></td> <td><code>TABLE</code></td> <td><code>test</code></td> <td><code>t09</code></td> <td><code>NULL</code></td> <td><code>NULL</code></td> </tr><tr> <th><code>77E:806</code></th> <td><code>77E</code></td> <td><code>AUTO_INC</code></td> <td><code>TABLE</code></td> <td><code>test</code></td> <td><code>t09</code></td> <td><code>NULL</code></td> <td><code>NULL</code></td> </tr><tr> <th><code>77D:806</code></th> <td><code>77D</code></td> <td><code>AUTO_INC</code></td> <td><code>TABLE</code></td> <td><code>test</code></td> <td><code>t09</code></td> <td><code>NULL</code></td> <td><code>NULL</code></td> </tr><tr> <th><code>77B:806</code></th> <td><code>77B</code></td> <td><code>AUTO_INC</code></td> <td><code>TABLE</code></td> <td><code>test</code></td> <td><code>t09</code></td> <td><code>NULL</code></td> <td><code>NULL</code></td> </tr><tr> <th><code>77B:733:12:1</code></th> <td><code>77B</code></td> <td><code>X</code></td> <td><code>RECORD</code></td> <td><code>test</code></td> <td><code>t09</code></td> <td><code>PRIMARY</code></td> <td><code>supremum pseudo-record</code></td> </tr><tr> <th><code>77A:733:12:1</code></th> <td><code>77A</code></td> <td><code>X</code></td> <td><code>RECORD</code></td> <td><code>test</code></td> <td><code>t09</code></td> <td><code>PRIMARY</code></td> <td><code>supremum pseudo-record</code></td> </tr><tr> <th><code>E56:743:6:2</code></th> <td><code>E56</code></td> <td><code>S</code></td> <td><code>RECORD</code></td> <td><code>test</code></td> <td><code>t2</code></td> <td><code>PRIMARY</code></td> <td><code>0, 0</code></td> </tr><tr> <th><code>E55:743:6:2</code></th> <td><code>E55</code></td> <td><code>X</code></td> <td><code>RECORD</code></td> <td><code>test</code></td> <td><code>t2</code></td> <td><code>PRIMARY</code></td> <td><code>0, 0</code></td> </tr><tr> <th><code>E55:743:38:2</code></th> <td><code>E55</code></td> <td><code>S</code></td> <td><code>RECORD</code></td> <td><code>test</code></td> <td><code>t2</code></td> <td><code>PRIMARY</code></td> <td><code>1922, 1922</code></td> </tr><tr> <th><code>19C:743:38:2</code></th> <td><code>19C</code></td> <td><code>X</code></td> <td><code>RECORD</code></td> <td><code>test</code></td> <td><code>t2</code></td> <td><code>PRIMARY</code></td> <td><code>1922, 1922</code></td> </tr></tbody></table>
