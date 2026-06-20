## 17.15 InnoDB INFORMATION\_SCHEMA Tables

This section provides information and usage examples for `InnoDB` `INFORMATION_SCHEMA` tables.

`InnoDB` `INFORMATION_SCHEMA` tables provide metadata, status information, and statistics about various aspects of the `InnoDB` storage engine. You can view a list of `InnoDB` `INFORMATION_SCHEMA` tables by issuing a `SHOW TABLES` statement on the `INFORMATION_SCHEMA` database:

```
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB%';
```

For table definitions, see Section 28.4, “INFORMATION\_SCHEMA InnoDB Tables”. For general information regarding the `MySQL` `INFORMATION_SCHEMA` database, see Chapter 28, *INFORMATION\_SCHEMA Tables*.


### 17.15.1 InnoDB INFORMATION\_SCHEMA Tables about Compression

There are two pairs of `InnoDB` `INFORMATION_SCHEMA` tables about compression that can provide insight into how well compression is working overall:

* `INNODB_CMP` and `INNODB_CMP_RESET` provide information about the number of compression operations and the amount of time spent performing compression.

* `INNODB_CMPMEM` and `INNODB_CMPMEM_RESET` provide information about the way memory is allocated for compression.


#### 17.15.1.1 INNODB\_CMP and INNODB\_CMP\_RESET

The `INNODB_CMP` and `INNODB_CMP_RESET` tables provide status information about operations related to compressed tables, which are described in Section 17.9, “InnoDB Table and Page Compression”. The `PAGE_SIZE` column reports the compressed page size.

These two tables have identical contents, but reading from `INNODB_CMP_RESET` resets the statistics on compression and uncompression operations. For example, if you archive the output of `INNODB_CMP_RESET` every 60 minutes, you see the statistics for each hourly period. If you monitor the output of `INNODB_CMP` (making sure never to read `INNODB_CMP_RESET`), you see the cumulative statistics since InnoDB was started.

For the table definition, see Section 28.4.6, “The INFORMATION\_SCHEMA INNODB\_CMP and INNODB\_CMP\_RESET Tables”.


#### 17.15.1.2 INNODB\_CMPMEM and INNODB\_CMPMEM\_RESET

The `INNODB_CMPMEM` and `INNODB_CMPMEM_RESET` tables provide status information about compressed pages that reside in the buffer pool. Please consult Section 17.9, “InnoDB Table and Page Compression” for further information on compressed tables and the use of the buffer pool. The `INNODB_CMP` and `INNODB_CMP_RESET` tables should provide more useful statistics on compression.

##### Internal Details

`InnoDB` uses a buddy allocator system to manage memory allocated to pages of various sizes, from 1KB to 16KB. Each row of the two tables described here corresponds to a single page size.

The `INNODB_CMPMEM` and `INNODB_CMPMEM_RESET` tables have identical contents, but reading from `INNODB_CMPMEM_RESET` resets the statistics on relocation operations. For example, if every 60 minutes you archived the output of `INNODB_CMPMEM_RESET`, it would show the hourly statistics. If you never read `INNODB_CMPMEM_RESET` and monitored the output of `INNODB_CMPMEM` instead, it would show the cumulative statistics since `InnoDB` was started.

For the table definition, see Section 28.4.7, “The INFORMATION\_SCHEMA INNODB\_CMPMEM and INNODB\_CMPMEM\_RESET Tables”.


#### 17.15.1.3 Using the Compression Information Schema Tables

**Example 17.1 Using the Compression Information Schema Tables**

The following is sample output from a database that contains compressed tables (see Section 17.9, “InnoDB Table and Page Compression”, `INNODB_CMP`, `INNODB_CMP_PER_INDEX`, and `INNODB_CMPMEM`).

The following table shows the contents of `INFORMATION_SCHEMA.INNODB_CMP` under a light workload. The only compressed page size that the buffer pool contains is 8K. Compressing or uncompressing pages has consumed less than a second since the time the statistics were reset, because the columns `COMPRESS_TIME` and `UNCOMPRESS_TIME` are zero.

<table summary="Sample data from the INFORMATION_SCHEMA.INNODB_CMP table, showing the internal workings of InnoDB table compression under a light workload."><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col">page size</th> <th scope="col">compress ops</th> <th scope="col">compress ops ok</th> <th scope="col">compress time</th> <th scope="col">uncompress ops</th> <th scope="col">uncompress time</th> </tr></thead><tbody><tr> <th scope="row">1024</th> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr><tr> <th scope="row">2048</th> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr><tr> <th scope="row">4096</th> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr><tr> <th scope="row">8192</th> <td>1048</td> <td>921</td> <td>0</td> <td>61</td> <td>0</td> </tr><tr> <th scope="row">16384</th> <td>0</td> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr></tbody></table>

According to `INNODB_CMPMEM`, there are 6169 compressed 8KB pages in the buffer pool. The only other allocated block size is 64 bytes. The smallest `PAGE_SIZE` in `INNODB_CMPMEM` is used for block descriptors of those compressed pages for which no uncompressed page exists in the buffer pool. We see that there are 5910 such pages. Indirectly, we see that 259 (6169-5910) compressed pages also exist in the buffer pool in uncompressed form.

The following table shows the contents of `INFORMATION_SCHEMA.INNODB_CMPMEM` under a light workload. Some memory is unusable due to fragmentation of the memory allocator for compressed pages: `SUM(PAGE_SIZE*PAGES_FREE)=6784`. This is because small memory allocation requests are fulfilled by splitting bigger blocks, starting from the 16K blocks that are allocated from the main buffer pool, using the buddy allocation system. The fragmentation is this low because some allocated blocks have been relocated (copied) to form bigger adjacent free blocks. This copying of `SUM(PAGE_SIZE*RELOCATION_OPS)` bytes has consumed less than a second `(SUM(RELOCATION_TIME)=0)`.

<table summary="Sample data from the INFORMATION_SCHEMA.INNODB_CMPMEM table, showing buffer pool memory operations for InnoDB table compression under a light workload."><col style="width: 15%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col">page size</th> <th scope="col">pages used</th> <th scope="col">pages free</th> <th scope="col">relocation ops</th> <th scope="col">relocation time</th> </tr></thead><tbody><tr> <th scope="row">64</th> <td>5910</td> <td>0</td> <td>2436</td> <td>0</td> </tr><tr> <th scope="row">128</th> <td>0</td> <td>1</td> <td>0</td> <td>0</td> </tr><tr> <th scope="row">256</th> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr><tr> <th scope="row">512</th> <td>0</td> <td>1</td> <td>0</td> <td>0</td> </tr><tr> <th scope="row">1024</th> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr><tr> <th scope="row">2048</th> <td>0</td> <td>1</td> <td>0</td> <td>0</td> </tr><tr> <th scope="row">4096</th> <td>0</td> <td>1</td> <td>0</td> <td>0</td> </tr><tr> <th scope="row">8192</th> <td>6169</td> <td>0</td> <td>5</td> <td>0</td> </tr><tr> <th scope="row">16384</th> <td>0</td> <td>0</td> <td>0</td> <td>0</td> </tr></tbody></table>


### 17.15.2 InnoDB INFORMATION\_SCHEMA Transaction and Locking Information

One `INFORMATION_SCHEMA` table and two Performance Schema tables enable you to monitor `InnoDB` transactions and diagnose potential locking problems:

* `INNODB_TRX`: This `INFORMATION_SCHEMA` table provides information about every transaction currently executing inside `InnoDB`, including the transaction state (for example, whether it is running or waiting for a lock), when the transaction started, and the particular SQL statement the transaction is executing.

* `data_locks`: This Performance Schema table contains a row for each hold lock and each lock request that is blocked waiting for a held lock to be released:

  + There is one row for each held lock, whatever the state of the transaction that holds the lock (`INNODB_TRX.TRX_STATE` is `RUNNING`, `LOCK WAIT`, `ROLLING BACK` or `COMMITTING`).

  + Each transaction in InnoDB that is waiting for another transaction to release a lock (`INNODB_TRX.TRX_STATE` is `LOCK WAIT`) is blocked by exactly one blocking lock request. That blocking lock request is for a row or table lock held by another transaction in an incompatible mode. A lock request always has a mode that is incompatible with the mode of the held lock that blocks the request (read vs. write, shared vs. exclusive).

    The blocked transaction cannot proceed until the other transaction commits or rolls back, thereby releasing the requested lock. For every blocked transaction, `data_locks` contains one row that describes each lock the transaction has requested, and for which it is waiting.

* `data_lock_waits`: This Performance Schema table indicates which transactions are waiting for a given lock, or for which lock a given transaction is waiting. This table contains one or more rows for each blocked transaction, indicating the lock it has requested and any locks that are blocking that request. The `REQUESTING_ENGINE_LOCK_ID` value refers to the lock requested by a transaction, and the `BLOCKING_ENGINE_LOCK_ID` value refers to the lock (held by another transaction) that prevents the first transaction from proceeding. For any given blocked transaction, all rows in `data_lock_waits` have the same value for `REQUESTING_ENGINE_LOCK_ID` and different values for `BLOCKING_ENGINE_LOCK_ID`.

For more information about the preceding tables, see Section 28.4.28, “The INFORMATION\_SCHEMA INNODB\_TRX Table”, Section 29.12.13.1, “The data\_locks Table”, and Section 29.12.13.2, “The data\_lock\_waits Table”.


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

<table summary="The result set of a query against the perormance_schema.data_lock_waits and INFORMATION_SCHEMA.INNODB_TRX tables, shown in the preceding text, indicating which InnoDB threads are waiting for which other threads."><col style="width: 9%"/><col style="width: 9%"/><col style="width: 33%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 33%"/><thead><tr> <th scope="col">waiting trx id</th> <th scope="col">waiting thread</th> <th scope="col">waiting query</th> <th scope="col">blocking trx id</th> <th scope="col">blocking thread</th> <th scope="col">blocking query</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">A4</code></th> <td><code class="literal">6</code></td> <td><code class="literal">SELECT b FROM t FOR UPDATE</code></td> <td><code class="literal">A3</code></td> <td><code class="literal">5</code></td> <td><code class="literal">SELECT SLEEP(100)</code></td> </tr><tr> <th scope="row"><code class="literal">A5</code></th> <td><code class="literal">7</code></td> <td><code class="literal">SELECT c FROM t FOR UPDATE</code></td> <td><code class="literal">A3</code></td> <td><code class="literal">5</code></td> <td><code class="literal">SELECT SLEEP(100)</code></td> </tr><tr> <th scope="row"><code class="literal">A5</code></th> <td><code class="literal">7</code></td> <td><code class="literal">SELECT c FROM t FOR UPDATE</code></td> <td><code class="literal">A4</code></td> <td><code class="literal">6</code></td> <td><code class="literal">SELECT b FROM t FOR UPDATE</code></td> </tr></tbody></table>

In the preceding table, you can identify sessions by the “waiting query” or “blocking query” columns. As you can see:

* Session B (trx id `A4`, thread `6`) and Session C (trx id `A5`, thread `7`) are both waiting for Session A (trx id `A3`, thread `5`).

* Session C is waiting for Session B as well as Session A.

You can see the underlying data in the `INFORMATION_SCHEMA` `INNODB_TRX` table and Performance Schema `data_locks` and `data_lock_waits` tables.

The following table shows some sample contents of the `INNODB_TRX` table.

<table summary="Sample data from the INFORMATION_SCHEMA.INNODB_TRX table, showing the typical types of entries for each column."><col style="width: 10%"/><col style="width: 13%"/><col style="width: 36%"/><col style="width: 30%"/><col style="width: 36%"/><col style="width: 19%"/><col style="width: 23%"/><col style="width: 45%"/><thead><tr> <th scope="col">trx id</th> <th scope="col">trx state</th> <th scope="col">trx started</th> <th scope="col">trx requested lock id</th> <th scope="col">trx wait started</th> <th scope="col">trx weight</th> <th scope="col">trx mysql thread id</th> <th scope="col">trx query</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">A3</code></th> <td><code class="literal">RUN­NING</code></td> <td><code class="literal">2008-01-15 16:44:54</code></td> <td><code class="literal">NULL</code></td> <td><code class="literal">NULL</code></td> <td><code class="literal">2</code></td> <td><code class="literal">5</code></td> <td><code class="literal">SELECT SLEEP(100)</code></td> </tr><tr> <th scope="row"><code class="literal">A4</code></th> <td><code class="literal">LOCK WAIT</code></td> <td><code class="literal">2008-01-15 16:45:09</code></td> <td><code class="literal">A4:1:3:2</code></td> <td><code class="literal">2008-01-15 16:45:09</code></td> <td><code class="literal">2</code></td> <td><code class="literal">6</code></td> <td><code class="literal">SELECT b FROM t FOR UPDATE</code></td> </tr><tr> <th scope="row"><code class="literal">A5</code></th> <td><code class="literal">LOCK WAIT</code></td> <td><code class="literal">2008-01-15 16:45:14</code></td> <td><code class="literal">A5:1:3:2</code></td> <td><code class="literal">2008-01-15 16:45:14</code></td> <td><code class="literal">2</code></td> <td><code class="literal">7</code></td> <td><code class="literal">SELECT c FROM t FOR UPDATE</code></td> </tr></tbody></table>

The following table shows some sample contents of the `data_locks` table.

<table summary="Sample data from the Performance Schema data_locks table, showing the typical types of entries for each column."><col style="width: 26%"/><col style="width: 13%"/><col style="width: 14%"/><col style="width: 21%"/><col style="width: 16%"/><col style="width: 15%"/><col style="width: 29%"/><col style="width: 20%"/><thead><tr> <th scope="col">lock id</th> <th scope="col">lock trx id</th> <th scope="col">lock mode</th> <th scope="col">lock type</th> <th scope="col">lock schema</th> <th scope="col">lock table</th> <th scope="col">lock index</th> <th scope="col">lock data</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">A3:1:3:2</code></th> <td><code class="literal">A3</code></td> <td><code class="literal">X</code></td> <td><code class="literal">RECORD</code></td> <td><code class="literal">test</code></td> <td><code class="literal">t</code></td> <td><code class="literal">PRIMARY</code></td> <td><code class="literal">0x0200</code></td> </tr><tr> <th scope="row"><code class="literal">A4:1:3:2</code></th> <td><code class="literal">A4</code></td> <td><code class="literal">X</code></td> <td><code class="literal">RECORD</code></td> <td><code class="literal">test</code></td> <td><code class="literal">t</code></td> <td><code class="literal">PRIMARY</code></td> <td><code class="literal">0x0200</code></td> </tr><tr> <th scope="row"><code class="literal">A5:1:3:2</code></th> <td><code class="literal">A5</code></td> <td><code class="literal">X</code></td> <td><code class="literal">RECORD</code></td> <td><code class="literal">test</code></td> <td><code class="literal">t</code></td> <td><code class="literal">PRIMARY</code></td> <td><code class="literal">0x0200</code></td> </tr></tbody></table>

The following table shows some sample contents of the `data_lock_waits` table.

<table summary="Sample data from the Performance Schema data_lock_waits table, showing the typical types of entries for each column."><col style="width: 10%"/><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><thead><tr> <th scope="col">requesting trx id</th> <th scope="col">requested lock id</th> <th scope="col">blocking trx id</th> <th scope="col">blocking lock id</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">A4</code></th> <td><code class="literal">A4:1:3:2</code></td> <td><code class="literal">A3</code></td> <td><code class="literal">A3:1:3:2</code></td> </tr><tr> <th scope="row"><code class="literal">A5</code></th> <td><code class="literal">A5:1:3:2</code></td> <td><code class="literal">A3</code></td> <td><code class="literal">A3:1:3:2</code></td> </tr><tr> <th scope="row"><code class="literal">A5</code></th> <td><code class="literal">A5:1:3:2</code></td> <td><code class="literal">A4</code></td> <td><code class="literal">A4:1:3:2</code></td> </tr></tbody></table>

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

There may be inconsistencies between queries shown in the `INFORMATION_SCHEMA` `PROCESSLIST` and `INNODB_TRX` tables. For an explanation, see [Section 17.15.2.3, “Persistence and Consistency of InnoDB Transaction and Locking Information”](innodb-information-schema-internal-data.html "17.15.2.3 Persistence and Consistency of InnoDB Transaction and Locking Information").

The following table shows the contents of the `PROCESSLIST` table for a system running a heavy workload.

<table summary="Sample data from the INFORMATION_SCHEMA.PROCESSLIST table, showing the internal workings of MySQL processes under a heavy workload."><col style="width: 8%"/><col style="width: 11%"/><col style="width: 21%"/><col style="width: 10%"/><col style="width: 20%"/><col style="width: 10%"/><col style="width: 20%"/><col style="width: 25%"/><thead><tr> <th scope="col">ID</th> <th scope="col">USER</th> <th scope="col">HOST</th> <th scope="col">DB</th> <th scope="col">COMMAND</th> <th scope="col">TIME</th> <th scope="col">STATE</th> <th scope="col">INFO</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">384</code></th> <td><code class="literal">root</code></td> <td><code class="literal">localhost</code></td> <td><code class="literal">test</code></td> <td><code class="literal">Query</code></td> <td><code class="literal">10</code></td> <td><code class="literal">update</code></td> <td><code class="literal">INSERT INTO t2 VALUES …</code></td> </tr><tr> <th scope="row"><code class="literal">257</code></th> <td><code class="literal">root</code></td> <td><code class="literal">localhost</code></td> <td><code class="literal">test</code></td> <td><code class="literal">Query</code></td> <td><code class="literal">3</code></td> <td><code class="literal">update</code></td> <td><code class="literal">INSERT INTO t2 VALUES …</code></td> </tr><tr> <th scope="row"><code class="literal">130</code></th> <td><code class="literal">root</code></td> <td><code class="literal">localhost</code></td> <td><code class="literal">test</code></td> <td><code class="literal">Query</code></td> <td><code class="literal">0</code></td> <td><code class="literal">update</code></td> <td><code class="literal">INSERT INTO t2 VALUES …</code></td> </tr><tr> <th scope="row"><code class="literal">61</code></th> <td><code class="literal">root</code></td> <td><code class="literal">localhost</code></td> <td><code class="literal">test</code></td> <td><code class="literal">Query</code></td> <td><code class="literal">1</code></td> <td><code class="literal">update</code></td> <td><code class="literal">INSERT INTO t2 VALUES …</code></td> </tr><tr> <th scope="row"><code class="literal">8</code></th> <td><code class="literal">root</code></td> <td><code class="literal">localhost</code></td> <td><code class="literal">test</code></td> <td><code class="literal">Query</code></td> <td><code class="literal">1</code></td> <td><code class="literal">update</code></td> <td><code class="literal">INSERT INTO t2 VALUES …</code></td> </tr><tr> <th scope="row"><code class="literal">4</code></th> <td><code class="literal">root</code></td> <td><code class="literal">localhost</code></td> <td><code class="literal">test</code></td> <td><code class="literal">Query</code></td> <td><code class="literal">0</code></td> <td><code class="literal">preparing</code></td> <td><code class="literal">SELECT * FROM PROCESSLIST</code></td> </tr><tr> <th scope="row"><code class="literal">2</code></th> <td><code class="literal">root</code></td> <td><code class="literal">localhost</code></td> <td><code class="literal">test</code></td> <td><code class="literal">Sleep</code></td> <td><code class="literal">566</code></td> <td><code class="literal"></code></td> <td><code class="literal">NULL</code></td> </tr></tbody></table>

The following table shows the contents of the `INNODB_TRX` table for a system running a heavy workload.

<table summary="Sample data from the INFORMATION_SCHEMA.INNODB_TRX table, showing the internal workings of InnoDB transactions under a heavy workload."><col style="width: 8%"/><col style="width: 10%"/><col style="width: 19%"/><col style="width: 21%"/><col style="width: 19%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 31%"/><thead><tr> <th scope="col">trx id</th> <th scope="col">trx state</th> <th scope="col">trx started</th> <th scope="col">trx requested lock id</th> <th scope="col">trx wait started</th> <th scope="col">trx weight</th> <th scope="col">trx mysql thread id</th> <th scope="col">trx query</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">77F</code></th> <td><code class="literal">LOCK WAIT</code></td> <td><code class="literal">2008-01-15 13:10:16</code></td> <td><code class="literal">77F</code></td> <td><code class="literal">2008-01-15 13:10:16</code></td> <td><code class="literal">1</code></td> <td><code class="literal">876</code></td> <td><code class="literal">INSERT INTO t09 (D, B, C) VALUES …</code></td> </tr><tr> <th scope="row"><code class="literal">77E</code></th> <td><code class="literal">LOCK WAIT</code></td> <td><code class="literal">2008-01-15 13:10:16</code></td> <td><code class="literal">77E</code></td> <td><code class="literal">2008-01-15 13:10:16</code></td> <td><code class="literal">1</code></td> <td><code class="literal">875</code></td> <td><code class="literal">INSERT INTO t09 (D, B, C) VALUES …</code></td> </tr><tr> <th scope="row"><code class="literal">77D</code></th> <td><code class="literal">LOCK WAIT</code></td> <td><code class="literal">2008-01-15 13:10:16</code></td> <td><code class="literal">77D</code></td> <td><code class="literal">2008-01-15 13:10:16</code></td> <td><code class="literal">1</code></td> <td><code class="literal">874</code></td> <td><code class="literal">INSERT INTO t09 (D, B, C) VALUES …</code></td> </tr><tr> <th scope="row"><code class="literal">77B</code></th> <td><code class="literal">LOCK WAIT</code></td> <td><code class="literal">2008-01-15 13:10:16</code></td> <td><code class="literal">77B:733:12:1</code></td> <td><code class="literal">2008-01-15 13:10:16</code></td> <td><code class="literal">4</code></td> <td><code class="literal">873</code></td> <td><code class="literal">INSERT INTO t09 (D, B, C) VALUES …</code></td> </tr><tr> <th scope="row"><code class="literal">77A</code></th> <td><code class="literal">RUN­NING</code></td> <td><code class="literal">2008-01-15 13:10:16</code></td> <td><code class="literal">NULL</code></td> <td><code class="literal">NULL</code></td> <td><code class="literal">4</code></td> <td><code class="literal">872</code></td> <td><code class="literal">SELECT b, c FROM t09 WHERE …</code></td> </tr><tr> <th scope="row"><code class="literal">E56</code></th> <td><code class="literal">LOCK WAIT</code></td> <td><code class="literal">2008-01-15 13:10:06</code></td> <td><code class="literal">E56:743:6:2</code></td> <td><code class="literal">2008-01-15 13:10:06</code></td> <td><code class="literal">5</code></td> <td><code class="literal">384</code></td> <td><code class="literal">INSERT INTO t2 VALUES …</code></td> </tr><tr> <th scope="row"><code class="literal">E55</code></th> <td><code class="literal">LOCK WAIT</code></td> <td><code class="literal">2008-01-15 13:10:06</code></td> <td><code class="literal">E55:743:38:2</code></td> <td><code class="literal">2008-01-15 13:10:13</code></td> <td><code class="literal">965</code></td> <td><code class="literal">257</code></td> <td><code class="literal">INSERT INTO t2 VALUES …</code></td> </tr><tr> <th scope="row"><code class="literal">19C</code></th> <td><code class="literal">RUN­NING</code></td> <td><code class="literal">2008-01-15 13:09:10</code></td> <td><code class="literal">NULL</code></td> <td><code class="literal">NULL</code></td> <td><code class="literal">2900</code></td> <td><code class="literal">130</code></td> <td><code class="literal">INSERT INTO t2 VALUES …</code></td> </tr><tr> <th scope="row"><code class="literal">E15</code></th> <td><code class="literal">RUN­NING</code></td> <td><code class="literal">2008-01-15 13:08:59</code></td> <td><code class="literal">NULL</code></td> <td><code class="literal">NULL</code></td> <td><code class="literal">5395</code></td> <td><code class="literal">61</code></td> <td><code class="literal">INSERT INTO t2 VALUES …</code></td> </tr><tr> <th scope="row"><code class="literal">51D</code></th> <td><code class="literal">RUN­NING</code></td> <td><code class="literal">2008-01-15 13:08:47</code></td> <td><code class="literal">NULL</code></td> <td><code class="literal">NULL</code></td> <td><code class="literal">9807</code></td> <td><code class="literal">8</code></td> <td><code class="literal">INSERT INTO t2 VALUES …</code></td> </tr></tbody></table>

The following table shows the contents of the `data_lock_waits` table for a system running a heavy workload.

<table summary="Sample data from the Performance Schema data_lock_waits table, showing the internal workings of InnoDB locking under a heavy workload."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th scope="col">requesting trx id</th> <th scope="col">requested lock id</th> <th scope="col">blocking trx id</th> <th scope="col">blocking lock id</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">77F</code></th> <td><code class="literal">77F:806</code></td> <td><code class="literal">77E</code></td> <td><code class="literal">77E:806</code></td> </tr><tr> <th scope="row"><code class="literal">77F</code></th> <td><code class="literal">77F:806</code></td> <td><code class="literal">77D</code></td> <td><code class="literal">77D:806</code></td> </tr><tr> <th scope="row"><code class="literal">77F</code></th> <td><code class="literal">77F:806</code></td> <td><code class="literal">77B</code></td> <td><code class="literal">77B:806</code></td> </tr><tr> <th scope="row"><code class="literal">77E</code></th> <td><code class="literal">77E:806</code></td> <td><code class="literal">77D</code></td> <td><code class="literal">77D:806</code></td> </tr><tr> <th scope="row"><code class="literal">77E</code></th> <td><code class="literal">77E:806</code></td> <td><code class="literal">77B</code></td> <td><code class="literal">77B:806</code></td> </tr><tr> <th scope="row"><code class="literal">77D</code></th> <td><code class="literal">77D:806</code></td> <td><code class="literal">77B</code></td> <td><code class="literal">77B:806</code></td> </tr><tr> <th scope="row"><code class="literal">77B</code></th> <td><code class="literal">77B:733:12:1</code></td> <td><code class="literal">77A</code></td> <td><code class="literal">77A:733:12:1</code></td> </tr><tr> <th scope="row"><code class="literal">E56</code></th> <td><code class="literal">E56:743:6:2</code></td> <td><code class="literal">E55</code></td> <td><code class="literal">E55:743:6:2</code></td> </tr><tr> <th scope="row"><code class="literal">E55</code></th> <td><code class="literal">E55:743:38:2</code></td> <td><code class="literal">19C</code></td> <td><code class="literal">19C:743:38:2</code></td> </tr></tbody></table>

The following table shows the contents of the `data_locks` table for a system running a heavy workload.

<table summary="Sample data from the Performance Schema data_locks table, showing the internal workings of InnoDB locking under a heavy workload."><col style="width: 18%"/><col style="width: 9%"/><col style="width: 12%"/><col style="width: 12%"/><col style="width: 9%"/><col style="width: 8%"/><col style="width: 15%"/><col style="width: 17%"/><thead><tr> <th scope="col">lock id</th> <th scope="col">lock trx id</th> <th scope="col">lock mode</th> <th scope="col">lock type</th> <th scope="col">lock schema</th> <th scope="col">lock table</th> <th scope="col">lock index</th> <th scope="col">lock data</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">77F:806</code></th> <td><code class="literal">77F</code></td> <td><code class="literal">AUTO_INC</code></td> <td><code class="literal">TABLE</code></td> <td><code class="literal">test</code></td> <td><code class="literal">t09</code></td> <td><code class="literal">NULL</code></td> <td><code class="literal">NULL</code></td> </tr><tr> <th scope="row"><code class="literal">77E:806</code></th> <td><code class="literal">77E</code></td> <td><code class="literal">AUTO_INC</code></td> <td><code class="literal">TABLE</code></td> <td><code class="literal">test</code></td> <td><code class="literal">t09</code></td> <td><code class="literal">NULL</code></td> <td><code class="literal">NULL</code></td> </tr><tr> <th scope="row"><code class="literal">77D:806</code></th> <td><code class="literal">77D</code></td> <td><code class="literal">AUTO_INC</code></td> <td><code class="literal">TABLE</code></td> <td><code class="literal">test</code></td> <td><code class="literal">t09</code></td> <td><code class="literal">NULL</code></td> <td><code class="literal">NULL</code></td> </tr><tr> <th scope="row"><code class="literal">77B:806</code></th> <td><code class="literal">77B</code></td> <td><code class="literal">AUTO_INC</code></td> <td><code class="literal">TABLE</code></td> <td><code class="literal">test</code></td> <td><code class="literal">t09</code></td> <td><code class="literal">NULL</code></td> <td><code class="literal">NULL</code></td> </tr><tr> <th scope="row"><code class="literal">77B:733:12:1</code></th> <td><code class="literal">77B</code></td> <td><code class="literal">X</code></td> <td><code class="literal">RECORD</code></td> <td><code class="literal">test</code></td> <td><code class="literal">t09</code></td> <td><code class="literal">PRIMARY</code></td> <td><code class="literal">supremum pseudo-record</code></td> </tr><tr> <th scope="row"><code class="literal">77A:733:12:1</code></th> <td><code class="literal">77A</code></td> <td><code class="literal">X</code></td> <td><code class="literal">RECORD</code></td> <td><code class="literal">test</code></td> <td><code class="literal">t09</code></td> <td><code class="literal">PRIMARY</code></td> <td><code class="literal">supremum pseudo-record</code></td> </tr><tr> <th scope="row"><code class="literal">E56:743:6:2</code></th> <td><code class="literal">E56</code></td> <td><code class="literal">S</code></td> <td><code class="literal">RECORD</code></td> <td><code class="literal">test</code></td> <td><code class="literal">t2</code></td> <td><code class="literal">PRIMARY</code></td> <td><code class="literal">0, 0</code></td> </tr><tr> <th scope="row"><code class="literal">E55:743:6:2</code></th> <td><code class="literal">E55</code></td> <td><code class="literal">X</code></td> <td><code class="literal">RECORD</code></td> <td><code class="literal">test</code></td> <td><code class="literal">t2</code></td> <td><code class="literal">PRIMARY</code></td> <td><code class="literal">0, 0</code></td> </tr><tr> <th scope="row"><code class="literal">E55:743:38:2</code></th> <td><code class="literal">E55</code></td> <td><code class="literal">S</code></td> <td><code class="literal">RECORD</code></td> <td><code class="literal">test</code></td> <td><code class="literal">t2</code></td> <td><code class="literal">PRIMARY</code></td> <td><code class="literal">1922, 1922</code></td> </tr><tr> <th scope="row"><code class="literal">19C:743:38:2</code></th> <td><code class="literal">19C</code></td> <td><code class="literal">X</code></td> <td><code class="literal">RECORD</code></td> <td><code class="literal">test</code></td> <td><code class="literal">t2</code></td> <td><code class="literal">PRIMARY</code></td> <td><code class="literal">1922, 1922</code></td> </tr></tbody></table>


#### 17.15.2.2 InnoDB Lock and Lock-Wait Information

When a transaction updates a row in a table, or locks it with `SELECT FOR UPDATE`, `InnoDB` establishes a list or queue of locks on that row. Similarly, `InnoDB` maintains a list of locks on a table for table-level locks. If a second transaction wants to update a row or lock a table already locked by a prior transaction in an incompatible mode, `InnoDB` adds a lock request for the row to the corresponding queue. For a lock to be acquired by a transaction, all incompatible lock requests previously entered into the lock queue for that row or table must be removed (which occurs when the transactions holding or requesting those locks either commit or roll back).

A transaction may have any number of lock requests for different rows or tables. At any given time, a transaction may request a lock that is held by another transaction, in which case it is blocked by that other transaction. The requesting transaction must wait for the transaction that holds the blocking lock to commit or roll back. If a transaction is not waiting for a lock, it is in a `RUNNING` state. If a transaction is waiting for a lock, it is in a `LOCK WAIT` state. (The `INFORMATION_SCHEMA` `INNODB_TRX` table indicates transaction state values.)

The Performance Schema `data_locks` table holds one or more rows for each `LOCK WAIT` transaction, indicating any lock requests that prevent its progress. This table also contains one row describing each lock in a queue of locks pending for a given row or table. The Performance Schema `data_lock_waits` table shows which locks already held by a transaction are blocking locks requested by other transactions.


#### 17.15.2.3 Persistence and Consistency of InnoDB Transaction and Locking Information

The data exposed by the transaction and locking tables (`INFORMATION_SCHEMA` `INNODB_TRX` table, Performance Schema `data_locks` and `data_lock_waits` tables) represents a glimpse into fast-changing data. This is not like user tables, where the data changes only when application-initiated updates occur. The underlying data is internal system-managed data, and can change very quickly:

* Data might not be consistent between the `INNODB_TRX`, `data_locks`, and `data_lock_waits` tables.

  The `data_locks` and `data_lock_waits` tables expose live data from the `InnoDB` storage engine, to provide lock information about the transactions in the `INNODB_TRX` table. Data retrieved from the lock tables exists when the `SELECT` is executed, but might be gone or changed by the time the query result is consumed by the client.

  Joining `data_locks` with `data_lock_waits` can show rows in `data_lock_waits` that identify a parent row in `data_locks` that no longer exists or does not exist yet.

* Data in the transaction and locking tables might not be consistent with data in the `INFORMATION_SCHEMA` `PROCESSLIST` table or Performance Schema `threads` table.

  For example, you should be careful when comparing data in the `InnoDB` transaction and locking tables with data in the `PROCESSLIST` table. Even if you issue a single `SELECT` (joining `INNODB_TRX` and `PROCESSLIST`, for example), the content of those tables is generally not consistent. It is possible for `INNODB_TRX` to reference rows that are not present in `PROCESSLIST` or for the currently executing SQL query of a transaction shown in `INNODB_TRX.TRX_QUERY` to differ from the one in `PROCESSLIST.INFO`.


### 17.15.3 InnoDB INFORMATION\_SCHEMA Schema Object Tables

You can extract metadata about schema objects managed by `InnoDB` using `InnoDB` `INFORMATION_SCHEMA` tables. This information comes from the data dictionary. Traditionally, you would get this type of information using the techniques from Section 17.17, “InnoDB Monitors”, setting up `InnoDB` monitors and parsing the output from the [`SHOW ENGINE INNODB STATUS`](show-engine.html "15.7.7.17 SHOW ENGINE Statement") statement. The `InnoDB` `INFORMATION_SCHEMA` table interface allows you to query this data using SQL.

`InnoDB` `INFORMATION_SCHEMA` schema object tables include the tables listed here:

* `INNODB_DATAFILES`
* `INNODB_TABLESTATS`
* `INNODB_FOREIGN`
* `INNODB_COLUMNS`
* `INNODB_INDEXES`
* `INNODB_FIELDS`
* `INNODB_TABLESPACES`
* `INNODB_TABLESPACES_BRIEF`
* `INNODB_FOREIGN_COLS`
* `INNODB_TABLES`

The table names are indicative of the type of data provided:

* `INNODB_TABLES` provides metadata about `InnoDB` tables.

* `INNODB_COLUMNS` provides metadata about `InnoDB` table columns.

* `INNODB_INDEXES` provides metadata about `InnoDB` indexes.

* `INNODB_FIELDS` provides metadata about the key columns (fields) of `InnoDB` indexes.

* `INNODB_TABLESTATS` provides a view of low-level status information about `InnoDB` tables that is derived from in-memory data structures.

* `INNODB_DATAFILES` provides data file path information for `InnoDB` file-per-table and general tablespaces.

* `INNODB_TABLESPACES` provides metadata about `InnoDB` file-per-table, general, and undo tablespaces.

* `INNODB_TABLESPACES_BRIEF` provides a subset of metadata about `InnoDB` tablespaces.

* `INNODB_FOREIGN` provides metadata about foreign keys defined on `InnoDB` tables.

* `INNODB_FOREIGN_COLS` provides metadata about the columns of foreign keys that are defined on `InnoDB` tables.

`InnoDB` `INFORMATION_SCHEMA` schema object tables can be joined together through fields such as `TABLE_ID`, `INDEX_ID`, and `SPACE`, allowing you to easily retrieve all available data for an object you want to study or monitor.

Refer to the `InnoDB` INFORMATION\_SCHEMA documentation for information about the columns of each table.

**Example 17.2 InnoDB INFORMATION\_SCHEMA Schema Object Tables**

This example uses a simple table (`t1`) with a single index (`i1`) to demonstrate the type of metadata found in the `InnoDB` `INFORMATION_SCHEMA` schema object tables.

1. Create a test database and table `t1`:

   ```
   mysql> CREATE DATABASE test;

   mysql> USE test;

   mysql> CREATE TABLE t1 (
          col1 INT,
          col2 CHAR(10),
          col3 VARCHAR(10))
          ENGINE = InnoDB;

   mysql> CREATE INDEX i1 ON t1(col1);
   ```

2. After creating the table `t1`, query `INNODB_TABLES` to locate the metadata for `test/t1`:

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TABLES WHERE NAME='test/t1' \G
   *************************** 1. row ***************************
        TABLE_ID: 71
            NAME: test/t1
            FLAG: 1
          N_COLS: 6
           SPACE: 57
      ROW_FORMAT: Compact
   ZIP_PAGE_SIZE: 0
    INSTANT_COLS: 0
   ```

   Table `t1` has a `TABLE_ID` of 71. The `FLAG` field provides bit level information about table format and storage characteristics. There are six columns, three of which are hidden columns created by `InnoDB` (`DB_ROW_ID`, `DB_TRX_ID`, and `DB_ROLL_PTR`). The ID of the table's `SPACE` is 57 (a value of 0 would indicate that the table resides in the system tablespace). The `ROW_FORMAT` is Compact. `ZIP_PAGE_SIZE` only applies to tables with a `Compressed` row format. `INSTANT_COLS` shows number of columns in the table prior to adding the first instant column using `ALTER TABLE ... ADD COLUMN` with `ALGORITHM=INSTANT`.

3. Using the `TABLE_ID` information from `INNODB_TABLES`, query the `INNODB_COLUMNS` table for information about the table's columns.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_COLUMNS where TABLE_ID = 71\G
   *************************** 1. row ***************************
        TABLE_ID: 71
            NAME: col1
             POS: 0
           MTYPE: 6
          PRTYPE: 1027
             LEN: 4
     HAS_DEFAULT: 0
   DEFAULT_VALUE: NULL
   *************************** 2. row ***************************
        TABLE_ID: 71
            NAME: col2
             POS: 1
           MTYPE: 2
          PRTYPE: 524542
             LEN: 10
     HAS_DEFAULT: 0
   DEFAULT_VALUE: NULL
   *************************** 3. row ***************************
        TABLE_ID: 71
            NAME: col3
             POS: 2
           MTYPE: 1
          PRTYPE: 524303
             LEN: 10
     HAS_DEFAULT: 0
   DEFAULT_VALUE: NULL
   ```

   In addition to the `TABLE_ID` and column `NAME`, `INNODB_COLUMNS` provides the ordinal position (`POS`) of each column (starting from 0 and incrementing sequentially), the column `MTYPE` or “main type” (6 = INT, 2 = CHAR, 1 = VARCHAR), the `PRTYPE` or “precise type” (a binary value with bits that represent the MySQL data type, character set code, and nullability), and the column length (`LEN`). The `HAS_DEFAULT` and `DEFAULT_VALUE` columns only apply to columns added instantly using `ALTER TABLE ... ADD COLUMN` with `ALGORITHM=INSTANT`.

4. Using the `TABLE_ID` information from `INNODB_TABLES` once again, query `INNODB_INDEXES` for information about the indexes associated with table `t1`.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_INDEXES WHERE TABLE_ID = 71 \G
   *************************** 1. row ***************************
          INDEX_ID: 111
              NAME: GEN_CLUST_INDEX
          TABLE_ID: 71
              TYPE: 1
          N_FIELDS: 0
           PAGE_NO: 3
             SPACE: 57
   MERGE_THRESHOLD: 50
   *************************** 2. row ***************************
          INDEX_ID: 112
              NAME: i1
          TABLE_ID: 71
              TYPE: 0
          N_FIELDS: 1
           PAGE_NO: 4
             SPACE: 57
   MERGE_THRESHOLD: 50
   ```

   `INNODB_INDEXES` returns data for two indexes. The first index is `GEN_CLUST_INDEX`, which is a clustered index created by `InnoDB` if the table does not have a user-defined clustered index. The second index (`i1`) is the user-defined secondary index.

   The `INDEX_ID` is an identifier for the index that is unique across all databases in an instance. The `TABLE_ID` identifies the table that the index is associated with. The index `TYPE` value indicates the type of index (1 = Clustered Index, 0 = Secondary index). The `N_FILEDS` value is the number of fields that comprise the index. `PAGE_NO` is the root page number of the index B-tree, and `SPACE` is the ID of the tablespace where the index resides. A nonzero value indicates that the index does not reside in the system tablespace. `MERGE_THRESHOLD` defines a percentage threshold value for the amount of data in an index page. If the amount of data in an index page falls below the this value (the default is 50%) when a row is deleted or when a row is shortened by an update operation, `InnoDB` attempts to merge the index page with a neighboring index page.

5. Using the `INDEX_ID` information from `INNODB_INDEXES`, query `INNODB_FIELDS` for information about the fields of index `i1`.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FIELDS where INDEX_ID = 112 \G
   *************************** 1. row ***************************
   INDEX_ID: 112
       NAME: col1
        POS: 0
   ```

   `INNODB_FIELDS` provides the `NAME` of the indexed field and its ordinal position within the index. If the index (i1) had been defined on multiple fields, `INNODB_FIELDS` would provide metadata for each of the indexed fields.

6. Using the `SPACE` information from `INNODB_TABLES`, query `INNODB_TABLESPACES` table for information about the table's tablespace.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TABLESPACES WHERE SPACE = 57 \G
   *************************** 1. row ***************************
             SPACE: 57
             NAME: test/t1
             FLAG: 16417
       ROW_FORMAT: Dynamic
        PAGE_SIZE: 16384
    ZIP_PAGE_SIZE: 0
       SPACE_TYPE: Single
    FS_BLOCK_SIZE: 4096
        FILE_SIZE: 114688
   ALLOCATED_SIZE: 98304
   AUTOEXTEND_SIZE: 0
   SERVER_VERSION: 8.4.0
    SPACE_VERSION: 1
       ENCRYPTION: N
            STATE: normal
   ```

   In addition to the `SPACE` ID of the tablespace and the `NAME` of the associated table, `INNODB_TABLESPACES` provides tablespace `FLAG` data, which is bit level information about tablespace format and storage characteristics. Also provided are tablespace `ROW_FORMAT`, `PAGE_SIZE`, and several other tablespace metadata items.

7. Using the `SPACE` information from `INNODB_TABLES` once again, query `INNODB_DATAFILES` for the location of the tablespace data file.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_DATAFILES WHERE SPACE = 57 \G
   *************************** 1. row ***************************
   SPACE: 57
    PATH: ./test/t1.ibd
   ```

   The datafile is located in the `test` directory under MySQL's `data` directory. If a file-per-table tablespace were created in a location outside the MySQL data directory using the `DATA DIRECTORY` clause of the `CREATE TABLE` statement, the tablespace `PATH` would be a fully qualified directory path.

8. As a final step, insert a row into table `t1` (`TABLE_ID = 71`) and view the data in the `INNODB_TABLESTATS` table. The data in this table is used by the MySQL optimizer to calculate which index to use when querying an `InnoDB` table. This information is derived from in-memory data structures.

   ```
   mysql> INSERT INTO t1 VALUES(5, 'abc', 'def');
   Query OK, 1 row affected (0.06 sec)

   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TABLESTATS where TABLE_ID = 71 \G
   *************************** 1. row ***************************
            TABLE_ID: 71
                NAME: test/t1
   STATS_INITIALIZED: Initialized
            NUM_ROWS: 1
    CLUST_INDEX_SIZE: 1
    OTHER_INDEX_SIZE: 0
    MODIFIED_COUNTER: 1
             AUTOINC: 0
           REF_COUNT: 1
   ```

   The `STATS_INITIALIZED` field indicates whether or not statistics have been collected for the table. `NUM_ROWS` is the current estimated number of rows in the table. The `CLUST_INDEX_SIZE` and `OTHER_INDEX_SIZE` fields report the number of pages on disk that store clustered and secondary indexes for the table, respectively. The `MODIFIED_COUNTER` value shows the number of rows modified by DML operations and cascade operations from foreign keys. The `AUTOINC` value is the next number to be issued for any autoincrement-based operation. There are no autoincrement columns defined on table `t1`, so the value is 0. The `REF_COUNT` value is a counter. When the counter reaches 0, it signifies that the table metadata can be evicted from the table cache.

**Example 17.3 Foreign Key INFORMATION\_SCHEMA Schema Object Tables**

The `INNODB_FOREIGN` and `INNODB_FOREIGN_COLS` tables provide data about foreign key relationships. This example uses a parent table and child table with a foreign key relationship to demonstrate the data found in the `INNODB_FOREIGN` and `INNODB_FOREIGN_COLS` tables.

1. Create the test database with parent and child tables:

   ```
   mysql> CREATE DATABASE test;

   mysql> USE test;

   mysql> CREATE TABLE parent (id INT NOT NULL,
          PRIMARY KEY (id)) ENGINE=INNODB;

   mysql> CREATE TABLE child (id INT, parent_id INT,
       ->     INDEX par_ind (parent_id),
       ->     CONSTRAINT fk1
       ->     FOREIGN KEY (parent_id) REFERENCES parent(id)
       ->     ON DELETE CASCADE) ENGINE=INNODB;
   ```

2. After the parent and child tables are created, query `INNODB_FOREIGN` and locate the foreign key data for the `test/child` and `test/parent` foreign key relationship:

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FOREIGN \G
   *************************** 1. row ***************************
         ID: test/fk1
   FOR_NAME: test/child
   REF_NAME: test/parent
     N_COLS: 1
       TYPE: 1
   ```

   Metadata includes the foreign key `ID` (`fk1`), which is named for the `CONSTRAINT` that was defined on the child table. The `FOR_NAME` is the name of the child table where the foreign key is defined. `REF_NAME` is the name of the parent table (the “referenced” table). `N_COLS` is the number of columns in the foreign key index. `TYPE` is a numerical value representing bit flags that provide additional information about the foreign key column. In this case, the `TYPE` value is 1, which indicates that the `ON DELETE CASCADE` option was specified for the foreign key. See the `INNODB_FOREIGN` table definition for more information about `TYPE` values.

3. Using the foreign key `ID`, query `INNODB_FOREIGN_COLS` to view data about the columns of the foreign key.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FOREIGN_COLS WHERE ID = 'test/fk1' \G
   *************************** 1. row ***************************
             ID: test/fk1
   FOR_COL_NAME: parent_id
   REF_COL_NAME: id
            POS: 0
   ```

   `FOR_COL_NAME` is the name of the foreign key column in the child table, and `REF_COL_NAME` is the name of the referenced column in the parent table. The `POS` value is the ordinal position of the key field within the foreign key index, starting at zero.

**Example 17.4 Joining InnoDB INFORMATION\_SCHEMA Schema Object Tables**

This example demonstrates joining three `InnoDB` `INFORMATION_SCHEMA` schema object tables (`INNODB_TABLES`, `INNODB_TABLESPACES`, and `INNODB_TABLESTATS`) to gather file format, row format, page size, and index size information about tables in the employees sample database.

The following table aliases are used to shorten the query string:

* `INFORMATION_SCHEMA.INNODB_TABLES`: a

* `INFORMATION_SCHEMA.INNODB_TABLESPACES`: b

* `INFORMATION_SCHEMA.INNODB_TABLESTATS`: c

An `IF()` control flow function is used to account for compressed tables. If a table is compressed, the index size is calculated using `ZIP_PAGE_SIZE` rather than `PAGE_SIZE`. `CLUST_INDEX_SIZE` and `OTHER_INDEX_SIZE`, which are reported in bytes, are divided by `1024*1024` to provide index sizes in megabytes (MBs). MB values are rounded to zero decimal spaces using the `ROUND()` function.

```
mysql> SELECT a.NAME, a.ROW_FORMAT,
        @page_size :=
         IF(a.ROW_FORMAT='Compressed',
          b.ZIP_PAGE_SIZE, b.PAGE_SIZE)
          AS page_size,
         ROUND((@page_size * c.CLUST_INDEX_SIZE)
          /(1024*1024)) AS pk_mb,
         ROUND((@page_size * c.OTHER_INDEX_SIZE)
          /(1024*1024)) AS secidx_mb
       FROM INFORMATION_SCHEMA.INNODB_TABLES a
       INNER JOIN INFORMATION_SCHEMA.INNODB_TABLESPACES b on a.NAME = b.NAME
       INNER JOIN INFORMATION_SCHEMA.INNODB_TABLESTATS c on b.NAME = c.NAME
       WHERE a.NAME LIKE 'employees/%'
       ORDER BY a.NAME DESC;
+------------------------+------------+-----------+-------+-----------+
| NAME                   | ROW_FORMAT | page_size | pk_mb | secidx_mb |
+------------------------+------------+-----------+-------+-----------+
| employees/titles       | Dynamic    |     16384 |    20 |        11 |
| employees/salaries     | Dynamic    |     16384 |    93 |        34 |
| employees/employees    | Dynamic    |     16384 |    15 |         0 |
| employees/dept_manager | Dynamic    |     16384 |     0 |         0 |
| employees/dept_emp     | Dynamic    |     16384 |    12 |        10 |
| employees/departments  | Dynamic    |     16384 |     0 |         0 |
+------------------------+------------+-----------+-------+-----------+
```


### 17.15.4 InnoDB INFORMATION\_SCHEMA FULLTEXT Index Tables

The following tables provide metadata for `FULLTEXT` indexes:

```
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB_FT%';
+-------------------------------------------+
| Tables_in_INFORMATION_SCHEMA (INNODB_FT%) |
+-------------------------------------------+
| INNODB_FT_CONFIG                          |
| INNODB_FT_BEING_DELETED                   |
| INNODB_FT_DELETED                         |
| INNODB_FT_DEFAULT_STOPWORD                |
| INNODB_FT_INDEX_TABLE                     |
| INNODB_FT_INDEX_CACHE                     |
+-------------------------------------------+
```

#### Table Overview

* `INNODB_FT_CONFIG`: Provides metadata about the `FULLTEXT` index and associated processing for an `InnoDB` table.

* `INNODB_FT_BEING_DELETED`: Provides a snapshot of the `INNODB_FT_DELETED` table; it is used only during an [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") maintenance operation. When `OPTIMIZE TABLE` is run, the `INNODB_FT_BEING_DELETED` table is emptied, and `DOC_ID` values are removed from the `INNODB_FT_DELETED` table. Because the contents of `INNODB_FT_BEING_DELETED` typically have a short lifetime, this table has limited utility for monitoring or debugging. For information about running `OPTIMIZE TABLE` on tables with `FULLTEXT` indexes, see Section 14.9.6, “Fine-Tuning MySQL Full-Text Search”.

* `INNODB_FT_DELETED`: Stores rows that are deleted from the `FULLTEXT` index for an `InnoDB` table. To avoid expensive index reorganization during DML operations for an `InnoDB` `FULLTEXT` index, the information about newly deleted words is stored separately, filtered out of search results when you do a text search, and removed from the main search index only when you issue an `OPTIMIZE TABLE` statement for the `InnoDB` table.

* `INNODB_FT_DEFAULT_STOPWORD`: Holds a list of stopwords that are used by default when creating a `FULLTEXT` index on `InnoDB` tables.

  For information about the `INNODB_FT_DEFAULT_STOPWORD` table, see Section 14.9.4, “Full-Text Stopwords”.

* `INNODB_FT_INDEX_TABLE`: Provides information about the inverted index used to process text searches against the `FULLTEXT` index of an `InnoDB` table.

* `INNODB_FT_INDEX_CACHE`: Provides token information about newly inserted rows in a `FULLTEXT` index. To avoid expensive index reorganization during DML operations, the information about newly indexed words is stored separately, and combined with the main search index only when [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") is run, when the server is shut down, or when the cache size exceeds a limit defined by the `innodb_ft_cache_size` or `innodb_ft_total_cache_size` system variable.

Note

With the exception of the `INNODB_FT_DEFAULT_STOPWORD` table, these tables are empty initially. Before querying any of them, set the value of the `innodb_ft_aux_table` system variable to the name (including the database name) of the table that contains the `FULLTEXT` index (for example, `test/articles`).

**Example 17.5 InnoDB FULLTEXT Index INFORMATION\_SCHEMA Tables**

This example uses a table with a `FULLTEXT` index to demonstrate the data contained in the `FULLTEXT` index `INFORMATION_SCHEMA` tables.

1. Create a table with a `FULLTEXT` index and insert some data:

   ```
   mysql> CREATE TABLE articles (
            id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
            title VARCHAR(200),
            body TEXT,
            FULLTEXT (title,body)
          ) ENGINE=InnoDB;

   mysql> INSERT INTO articles (title,body) VALUES
          ('MySQL Tutorial','DBMS stands for DataBase ...'),
          ('How To Use MySQL Well','After you went through a ...'),
          ('Optimizing MySQL','In this tutorial we show ...'),
          ('1001 MySQL Tricks','1. Never run mysqld as root. 2. ...'),
          ('MySQL vs. YourSQL','In the following database comparison ...'),
          ('MySQL Security','When configured properly, MySQL ...');
   ```

2. Set the `innodb_ft_aux_table` variable to the name of the table with the `FULLTEXT` index. If this variable is not set, the `InnoDB` `FULLTEXT` `INFORMATION_SCHEMA` tables are empty, with the exception of `INNODB_FT_DEFAULT_STOPWORD`.

   ```
   mysql> SET GLOBAL innodb_ft_aux_table = 'test/articles';
   ```

3. Query the `INNODB_FT_INDEX_CACHE` table, which shows information about newly inserted rows in a `FULLTEXT` index. To avoid expensive index reorganization during DML operations, data for newly inserted rows remains in the `FULLTEXT` index cache until [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") is run (or until the server is shut down or cache limits are exceeded).

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_CACHE LIMIT 5;
   +------------+--------------+-------------+-----------+--------+----------+
   | WORD       | FIRST_DOC_ID | LAST_DOC_ID | DOC_COUNT | DOC_ID | POSITION |
   +------------+--------------+-------------+-----------+--------+----------+
   | 1001       |            5 |           5 |         1 |      5 |        0 |
   | after      |            3 |           3 |         1 |      3 |       22 |
   | comparison |            6 |           6 |         1 |      6 |       44 |
   | configured |            7 |           7 |         1 |      7 |       20 |
   | database   |            2 |           6 |         2 |      2 |       31 |
   +------------+--------------+-------------+-----------+--------+----------+
   ```

4. Enable the `innodb_optimize_fulltext_only` system variable and run [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") on the table that contains the `FULLTEXT` index. This operation flushes the contents of the `FULLTEXT` index cache to the main `FULLTEXT` index. `innodb_optimize_fulltext_only` changes the way the [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") statement operates on `InnoDB` tables, and is intended to be enabled temporarily, during maintenance operations on `InnoDB` tables with `FULLTEXT` indexes.

   ```
   mysql> SET GLOBAL innodb_optimize_fulltext_only=ON;

   mysql> OPTIMIZE TABLE articles;
   +---------------+----------+----------+----------+
   | Table         | Op       | Msg_type | Msg_text |
   +---------------+----------+----------+----------+
   | test.articles | optimize | status   | OK       |
   +---------------+----------+----------+----------+
   ```

5. Query the `INNODB_FT_INDEX_TABLE` table to view information about data in the main `FULLTEXT` index, including information about the data that was just flushed from the `FULLTEXT` index cache.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_TABLE LIMIT 5;
   +------------+--------------+-------------+-----------+--------+----------+
   | WORD       | FIRST_DOC_ID | LAST_DOC_ID | DOC_COUNT | DOC_ID | POSITION |
   +------------+--------------+-------------+-----------+--------+----------+
   | 1001       |            5 |           5 |         1 |      5 |        0 |
   | after      |            3 |           3 |         1 |      3 |       22 |
   | comparison |            6 |           6 |         1 |      6 |       44 |
   | configured |            7 |           7 |         1 |      7 |       20 |
   | database   |            2 |           6 |         2 |      2 |       31 |
   +------------+--------------+-------------+-----------+--------+----------+
   ```

   The `INNODB_FT_INDEX_CACHE` table is now empty since the [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") operation flushed the `FULLTEXT` index cache.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_CACHE LIMIT 5;
   Empty set (0.00 sec)
   ```

6. Delete some records from the `test/articles` table.

   ```
   mysql> DELETE FROM test.articles WHERE id < 4;
   ```

7. Query the `INNODB_FT_DELETED` table. This table records rows that are deleted from the `FULLTEXT` index. To avoid expensive index reorganization during DML operations, information about newly deleted records is stored separately, filtered out of search results when you do a text search, and removed from the main search index when you run `OPTIMIZE TABLE`.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_DELETED;
   +--------+
   | DOC_ID |
   +--------+
   |      2 |
   |      3 |
   |      4 |
   +--------+
   ```

8. Run `OPTIMIZE TABLE` to remove the deleted records.

   ```
   mysql> OPTIMIZE TABLE articles;
   +---------------+----------+----------+----------+
   | Table         | Op       | Msg_type | Msg_text |
   +---------------+----------+----------+----------+
   | test.articles | optimize | status   | OK       |
   +---------------+----------+----------+----------+
   ```

   The `INNODB_FT_DELETED` table should now be empty.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_DELETED;
   Empty set (0.00 sec)
   ```

9. Query the `INNODB_FT_CONFIG` table. This table contains metadata about the `FULLTEXT` index and related processing:

   * `optimize_checkpoint_limit`: The number of seconds after which an [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") run stops.

   * `synced_doc_id`: The next `DOC_ID` to be issued.

   * `stopword_table_name`: The *`database/table`* name for a user-defined stopword table. The `VALUE` column is empty if there is no user-defined stopword table.

   * `use_stopword`: Indicates whether a stopword table is used, which is defined when the `FULLTEXT` index is created.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_CONFIG;
   +---------------------------+-------+
   | KEY                       | VALUE |
   +---------------------------+-------+
   | optimize_checkpoint_limit | 180   |
   | synced_doc_id             | 8     |
   | stopword_table_name       |       |
   | use_stopword              | 1     |
   +---------------------------+-------+
   ```

10. Disable `innodb_optimize_fulltext_only`, since it is intended to be enabled only temporarily:

    ```
    mysql> SET GLOBAL innodb_optimize_fulltext_only=OFF;
    ```


### 17.15.5 InnoDB INFORMATION\_SCHEMA Buffer Pool Tables

The `InnoDB` `INFORMATION_SCHEMA` buffer pool tables provide buffer pool status information and metadata about the pages within the `InnoDB` buffer pool.

The `InnoDB` `INFORMATION_SCHEMA` buffer pool tables include those listed below:

```
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB_BUFFER%';
+-----------------------------------------------+
| Tables_in_INFORMATION_SCHEMA (INNODB_BUFFER%) |
+-----------------------------------------------+
| INNODB_BUFFER_PAGE_LRU                        |
| INNODB_BUFFER_PAGE                            |
| INNODB_BUFFER_POOL_STATS                      |
+-----------------------------------------------+
```

#### Table Overview

* `INNODB_BUFFER_PAGE`: Holds information about each page in the `InnoDB` buffer pool.

* `INNODB_BUFFER_PAGE_LRU`: Holds information about the pages in the `InnoDB` buffer pool, in particular how they are ordered in the LRU list that determines which pages to evict from the buffer pool when it becomes full. The `INNODB_BUFFER_PAGE_LRU` table has the same columns as the `INNODB_BUFFER_PAGE` table, except that the `INNODB_BUFFER_PAGE_LRU` table has an `LRU_POSITION` column instead of a `BLOCK_ID` column.

* `INNODB_BUFFER_POOL_STATS`: Provides buffer pool status information. Much of the same information is provided by [`SHOW ENGINE INNODB STATUS`](show-engine.html "15.7.7.17 SHOW ENGINE Statement") output, or may be obtained using `InnoDB` buffer pool server status variables.

Warning

Querying the `INNODB_BUFFER_PAGE` or `INNODB_BUFFER_PAGE_LRU` table can affect performance. Do not query these tables on a production system unless you are aware of the performance impact and have determined it to be acceptable. To avoid impacting performance on a production system, reproduce the issue you want to investigate and query buffer pool statistics on a test instance.

**Example 17.6 Querying System Data in the INNODB\_BUFFER\_PAGE Table**

This query provides an approximate count of pages that contain system data by excluding pages where the `TABLE_NAME` value is either `NULL` or includes a slash `/` or period `.` in the table name, which indicates a user-defined table.

```
mysql> SELECT COUNT(*) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME IS NULL OR (INSTR(TABLE_NAME, '/') = 0 AND INSTR(TABLE_NAME, '.') = 0);
+----------+
| COUNT(*) |
+----------+
|     1516 |
+----------+
```

This query returns the approximate number of pages that contain system data, the total number of buffer pool pages, and an approximate percentage of pages that contain system data.

```
mysql> SELECT
       (SELECT COUNT(*) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME IS NULL OR (INSTR(TABLE_NAME, '/') = 0 AND INSTR(TABLE_NAME, '.') = 0)
       ) AS system_pages,
       (
       SELECT COUNT(*)
       FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       ) AS total_pages,
       (
       SELECT ROUND((system_pages/total_pages) * 100)
       ) AS system_page_percentage;
+--------------+-------------+------------------------+
| system_pages | total_pages | system_page_percentage |
+--------------+-------------+------------------------+
|          295 |        8192 |                      4 |
+--------------+-------------+------------------------+
```

The type of system data in the buffer pool can be determined by querying the `PAGE_TYPE` value. For example, the following query returns eight distinct `PAGE_TYPE` values among the pages that contain system data:

```
mysql> SELECT DISTINCT PAGE_TYPE FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME IS NULL OR (INSTR(TABLE_NAME, '/') = 0 AND INSTR(TABLE_NAME, '.') = 0);
+-------------------+
| PAGE_TYPE         |
+-------------------+
| SYSTEM            |
| IBUF_BITMAP       |
| UNKNOWN           |
| FILE_SPACE_HEADER |
| INODE             |
| UNDO_LOG          |
| ALLOCATED         |
+-------------------+
```

**Example 17.7 Querying User Data in the INNODB\_BUFFER\_PAGE Table**

This query provides an approximate count of pages containing user data by counting pages where the `TABLE_NAME` value is `NOT NULL` and `NOT LIKE '%INNODB_TABLES%'`.

```
mysql> SELECT COUNT(*) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME IS NOT NULL AND TABLE_NAME NOT LIKE '%INNODB_TABLES%';
+----------+
| COUNT(*) |
+----------+
|     7897 |
+----------+
```

This query returns the approximate number of pages that contain user data, the total number of buffer pool pages, and an approximate percentage of pages that contain user data.

```
mysql> SELECT
       (SELECT COUNT(*) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME IS NOT NULL AND (INSTR(TABLE_NAME, '/') > 0 OR INSTR(TABLE_NAME, '.') > 0)
       ) AS user_pages,
       (
       SELECT COUNT(*)
       FROM information_schema.INNODB_BUFFER_PAGE
       ) AS total_pages,
       (
       SELECT ROUND((user_pages/total_pages) * 100)
       ) AS user_page_percentage;
+------------+-------------+----------------------+
| user_pages | total_pages | user_page_percentage |
+------------+-------------+----------------------+
|       7897 |        8192 |                   96 |
+------------+-------------+----------------------+
```

This query identifies user-defined tables with pages in the buffer pool:

```
mysql> SELECT DISTINCT TABLE_NAME FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME IS NOT NULL AND (INSTR(TABLE_NAME, '/') > 0 OR INSTR(TABLE_NAME, '.') > 0)
       AND TABLE_NAME NOT LIKE '`mysql`.`innodb_%';
+-------------------------+
| TABLE_NAME              |
+-------------------------+
| `employees`.`salaries`  |
| `employees`.`employees` |
+-------------------------+
```

**Example 17.8 Querying Index Data in the INNODB\_BUFFER\_PAGE Table**

For information about index pages, query the `INDEX_NAME` column using the name of the index. For example, the following query returns the number of pages and total data size of pages for the `emp_no` index that is defined on the `employees.salaries` table:

```
mysql> SELECT INDEX_NAME, COUNT(*) AS Pages,
ROUND(SUM(IF(COMPRESSED_SIZE = 0, @@GLOBAL.innodb_page_size, COMPRESSED_SIZE))/1024/1024)
AS 'Total Data (MB)'
FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
WHERE INDEX_NAME='emp_no' AND TABLE_NAME = '`employees`.`salaries`';
+------------+-------+-----------------+
| INDEX_NAME | Pages | Total Data (MB) |
+------------+-------+-----------------+
| emp_no     |  1609 |              25 |
+------------+-------+-----------------+
```

This query returns the number of pages and total data size of pages for all indexes defined on the `employees.salaries` table:

```
mysql> SELECT INDEX_NAME, COUNT(*) AS Pages,
       ROUND(SUM(IF(COMPRESSED_SIZE = 0, @@GLOBAL.innodb_page_size, COMPRESSED_SIZE))/1024/1024)
       AS 'Total Data (MB)'
       FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
       WHERE TABLE_NAME = '`employees`.`salaries`'
       GROUP BY INDEX_NAME;
+------------+-------+-----------------+
| INDEX_NAME | Pages | Total Data (MB) |
+------------+-------+-----------------+
| emp_no     |  1608 |              25 |
| PRIMARY    |  6086 |              95 |
+------------+-------+-----------------+
```

**Example 17.9 Querying LRU\_POSITION Data in the INNODB\_BUFFER\_PAGE\_LRU Table**

The `INNODB_BUFFER_PAGE_LRU` table holds information about the pages in the `InnoDB` buffer pool, in particular how they are ordered that determines which pages to evict from the buffer pool when it becomes full. The definition for this page is the same as for `INNODB_BUFFER_PAGE`, except this table has an `LRU_POSITION` column instead of a `BLOCK_ID` column.

This query counts the number of positions at a specific location in the LRU list occupied by pages of the `employees.employees` table.

```
mysql> SELECT COUNT(LRU_POSITION) FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE_LRU
       WHERE TABLE_NAME='`employees`.`employees`' AND LRU_POSITION < 3072;
+---------------------+
| COUNT(LRU_POSITION) |
+---------------------+
|                 548 |
+---------------------+
```

**Example 17.10 Querying the INNODB\_BUFFER\_POOL\_STATS Table**

The `INNODB_BUFFER_POOL_STATS` table provides information similar to [`SHOW ENGINE INNODB STATUS`](show-engine.html "15.7.7.17 SHOW ENGINE Statement") and `InnoDB` buffer pool status variables.

```
mysql> SELECT * FROM information_schema.INNODB_BUFFER_POOL_STATS \G
*************************** 1. row ***************************
                         POOL_ID: 0
                       POOL_SIZE: 8192
                    FREE_BUFFERS: 1
                  DATABASE_PAGES: 8173
              OLD_DATABASE_PAGES: 3014
         MODIFIED_DATABASE_PAGES: 0
              PENDING_DECOMPRESS: 0
                   PENDING_READS: 0
               PENDING_FLUSH_LRU: 0
              PENDING_FLUSH_LIST: 0
                PAGES_MADE_YOUNG: 15907
            PAGES_NOT_MADE_YOUNG: 3803101
           PAGES_MADE_YOUNG_RATE: 0
       PAGES_MADE_NOT_YOUNG_RATE: 0
               NUMBER_PAGES_READ: 3270
            NUMBER_PAGES_CREATED: 13176
            NUMBER_PAGES_WRITTEN: 15109
                 PAGES_READ_RATE: 0
               PAGES_CREATE_RATE: 0
              PAGES_WRITTEN_RATE: 0
                NUMBER_PAGES_GET: 33069332
                        HIT_RATE: 0
    YOUNG_MAKE_PER_THOUSAND_GETS: 0
NOT_YOUNG_MAKE_PER_THOUSAND_GETS: 0
         NUMBER_PAGES_READ_AHEAD: 2713
       NUMBER_READ_AHEAD_EVICTED: 0
                 READ_AHEAD_RATE: 0
         READ_AHEAD_EVICTED_RATE: 0
                    LRU_IO_TOTAL: 0
                  LRU_IO_CURRENT: 0
                UNCOMPRESS_TOTAL: 0
              UNCOMPRESS_CURRENT: 0
```

For comparison, [`SHOW ENGINE INNODB STATUS`](show-engine.html "15.7.7.17 SHOW ENGINE Statement") output and `InnoDB` buffer pool status variable output is shown below, based on the same data set.

For more information about [`SHOW ENGINE INNODB STATUS`](show-engine.html "15.7.7.17 SHOW ENGINE Statement") output, see Section 17.17.3, “InnoDB Standard Monitor and Lock Monitor Output”.

```
mysql> SHOW ENGINE INNODB STATUS\G
...
----------------------
BUFFER POOL AND MEMORY
----------------------
Total large memory allocated 137428992
Dictionary memory allocated 579084
Buffer pool size   8192
Free buffers       1
Database pages     8173
Old database pages 3014
Modified db pages  0
Pending reads 0
Pending writes: LRU 0, flush list 0, single page 0
Pages made young 15907, not young 3803101
0.00 youngs/s, 0.00 non-youngs/s
Pages read 3270, created 13176, written 15109
0.00 reads/s, 0.00 creates/s, 0.00 writes/s
No buffer pool page gets since the last printout
Pages read ahead 0.00/s, evicted without access 0.00/s, Random read ahead 0.00/s
LRU len: 8173, unzip_LRU len: 0
I/O sum[0]:cur[0], unzip sum[0]:cur[0]
...
```

For status variable descriptions, see Section 7.1.10, “Server Status Variables”.

```
mysql> SHOW STATUS LIKE 'Innodb_buffer%';
+---------------------------------------+-------------+
| Variable_name                         | Value       |
+---------------------------------------+-------------+
| Innodb_buffer_pool_dump_status        | not started |
| Innodb_buffer_pool_load_status        | not started |
| Innodb_buffer_pool_resize_status      | not started |
| Innodb_buffer_pool_pages_data         | 8173        |
| Innodb_buffer_pool_bytes_data         | 133906432   |
| Innodb_buffer_pool_pages_dirty        | 0           |
| Innodb_buffer_pool_bytes_dirty        | 0           |
| Innodb_buffer_pool_pages_flushed      | 15109       |
| Innodb_buffer_pool_pages_free         | 1           |
| Innodb_buffer_pool_pages_misc         | 18          |
| Innodb_buffer_pool_pages_total        | 8192        |
| Innodb_buffer_pool_read_ahead_rnd     | 0           |
| Innodb_buffer_pool_read_ahead         | 2713        |
| Innodb_buffer_pool_read_ahead_evicted | 0           |
| Innodb_buffer_pool_read_requests      | 33069332    |
| Innodb_buffer_pool_reads              | 558         |
| Innodb_buffer_pool_wait_free          | 0           |
| Innodb_buffer_pool_write_requests     | 11985961    |
+---------------------------------------+-------------+
```


### 17.15.6 InnoDB INFORMATION\_SCHEMA Metrics Table

The `INNODB_METRICS` table provides information about `InnoDB` performance and resource-related counters.

`INNODB_METRICS` table columns are shown below. For column descriptions, see Section 28.4.21, “The INFORMATION\_SCHEMA INNODB\_METRICS Table”.

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME="dml_inserts" \G
*************************** 1. row ***************************
           NAME: dml_inserts
      SUBSYSTEM: dml
          COUNT: 46273
      MAX_COUNT: 46273
      MIN_COUNT: NULL
      AVG_COUNT: 492.2659574468085
    COUNT_RESET: 46273
MAX_COUNT_RESET: 46273
MIN_COUNT_RESET: NULL
AVG_COUNT_RESET: NULL
   TIME_ENABLED: 2014-11-28 16:07:53
  TIME_DISABLED: NULL
   TIME_ELAPSED: 94
     TIME_RESET: NULL
         STATUS: enabled
           TYPE: status_counter
        COMMENT: Number of rows inserted
```

#### Enabling, Disabling, and Resetting Counters

You can enable, disable, and reset counters using the following variables:

* `innodb_monitor_enable`: Enables counters.

  ```
  SET GLOBAL innodb_monitor_enable = [counter-name|module_name|pattern|all];
  ```

* `innodb_monitor_disable`: Disables counters.

  ```
  SET GLOBAL innodb_monitor_disable = [counter-name|module_name|pattern|all];
  ```

* `innodb_monitor_reset`: Resets counter values to zero.

  ```
  SET GLOBAL innodb_monitor_reset = [counter-name|module_name|pattern|all];
  ```

* `innodb_monitor_reset_all`: Resets all counter values. A counter must be disabled before using `innodb_monitor_reset_all`.

  ```
  SET GLOBAL innodb_monitor_reset_all = [counter-name|module_name|pattern|all];
  ```

Counters and counter modules can also be enabled at startup using the MySQL server configuration file. For example, to enable the `log` module, `metadata_table_handles_opened` and `metadata_table_handles_closed` counters, enter the following line in the `[mysqld]` section of the MySQL server configuration file.

```
[mysqld]
innodb_monitor_enable = log,metadata_table_handles_opened,metadata_table_handles_closed
```

When enabling multiple counters or modules in a configuration file, specify the `innodb_monitor_enable` variable followed by counter and module names separated by a comma, as shown above. Only the `innodb_monitor_enable` variable can be used in a configuration file. The `innodb_monitor_disable` and `innodb_monitor_reset` variables are supported on the command line only.

Note

Because each counter adds a degree of runtime overhead, use counters conservatively on production servers to diagnose specific issues or monitor specific functionality. A test or development server is recommended for more extensive use of counters.

#### Counters

The list of available counters is subject to change. Query the Information Schema `INNODB_METRICS` table for counters available in your MySQL server version.

The counters enabled by default correspond to those shown in [`SHOW ENGINE INNODB STATUS`](show-engine.html "15.7.7.17 SHOW ENGINE Statement") output. Counters shown in [`SHOW ENGINE INNODB STATUS`](show-engine.html "15.7.7.17 SHOW ENGINE Statement") output are always enabled at a system level but can be disabled for the `INNODB_METRICS` table. Counter status is not persistent. Unless configured otherwise, counters revert to their default enabled or disabled status when the server is restarted.

If you run programs that would be affected by the addition or removal of counters, it is recommended that you review the releases notes and query the `INNODB_METRICS` table to identify those changes as part of your upgrade process.

```
mysql> SELECT name, subsystem, status FROM INFORMATION_SCHEMA.INNODB_METRICS ORDER BY NAME;
+---------------------------------------------+---------------------+----------+
| name                                        | subsystem           | status   |
+---------------------------------------------+---------------------+----------+
| adaptive_hash_pages_added                   | adaptive_hash_index | disabled |
| adaptive_hash_pages_removed                 | adaptive_hash_index | disabled |
| adaptive_hash_rows_added                    | adaptive_hash_index | disabled |
| adaptive_hash_rows_deleted_no_hash_entry    | adaptive_hash_index | disabled |
| adaptive_hash_rows_removed                  | adaptive_hash_index | disabled |
| adaptive_hash_rows_updated                  | adaptive_hash_index | disabled |
| adaptive_hash_searches                      | adaptive_hash_index | enabled  |
| adaptive_hash_searches_btree                | adaptive_hash_index | enabled  |
| buffer_data_reads                           | buffer              | enabled  |
| buffer_data_written                         | buffer              | enabled  |
| buffer_flush_adaptive                       | buffer              | disabled |
| buffer_flush_adaptive_avg_pass              | buffer              | disabled |
| buffer_flush_adaptive_avg_time_est          | buffer              | disabled |
| buffer_flush_adaptive_avg_time_slot         | buffer              | disabled |
| buffer_flush_adaptive_avg_time_thread       | buffer              | disabled |
| buffer_flush_adaptive_pages                 | buffer              | disabled |
| buffer_flush_adaptive_total_pages           | buffer              | disabled |
| buffer_flush_avg_page_rate                  | buffer              | disabled |
| buffer_flush_avg_pass                       | buffer              | disabled |
| buffer_flush_avg_time                       | buffer              | disabled |
| buffer_flush_background                     | buffer              | disabled |
| buffer_flush_background_pages               | buffer              | disabled |
| buffer_flush_background_total_pages         | buffer              | disabled |
| buffer_flush_batches                        | buffer              | disabled |
| buffer_flush_batch_num_scan                 | buffer              | disabled |
| buffer_flush_batch_pages                    | buffer              | disabled |
| buffer_flush_batch_scanned                  | buffer              | disabled |
| buffer_flush_batch_scanned_per_call         | buffer              | disabled |
| buffer_flush_batch_total_pages              | buffer              | disabled |
| buffer_flush_lsn_avg_rate                   | buffer              | disabled |
| buffer_flush_neighbor                       | buffer              | disabled |
| buffer_flush_neighbor_pages                 | buffer              | disabled |
| buffer_flush_neighbor_total_pages           | buffer              | disabled |
| buffer_flush_n_to_flush_by_age              | buffer              | disabled |
| buffer_flush_n_to_flush_by_dirty_page       | buffer              | disabled |
| buffer_flush_n_to_flush_requested           | buffer              | disabled |
| buffer_flush_pct_for_dirty                  | buffer              | disabled |
| buffer_flush_pct_for_lsn                    | buffer              | disabled |
| buffer_flush_sync                           | buffer              | disabled |
| buffer_flush_sync_pages                     | buffer              | disabled |
| buffer_flush_sync_total_pages               | buffer              | disabled |
| buffer_flush_sync_waits                     | buffer              | disabled |
| buffer_LRU_batches_evict                    | buffer              | disabled |
| buffer_LRU_batches_flush                    | buffer              | disabled |
| buffer_LRU_batch_evict_pages                | buffer              | disabled |
| buffer_LRU_batch_evict_total_pages          | buffer              | disabled |
| buffer_LRU_batch_flush_avg_pass             | buffer              | disabled |
| buffer_LRU_batch_flush_avg_time_est         | buffer              | disabled |
| buffer_LRU_batch_flush_avg_time_slot        | buffer              | disabled |
| buffer_LRU_batch_flush_avg_time_thread      | buffer              | disabled |
| buffer_LRU_batch_flush_pages                | buffer              | disabled |
| buffer_LRU_batch_flush_total_pages          | buffer              | disabled |
| buffer_LRU_batch_num_scan                   | buffer              | disabled |
| buffer_LRU_batch_scanned                    | buffer              | disabled |
| buffer_LRU_batch_scanned_per_call           | buffer              | disabled |
| buffer_LRU_get_free_loops                   | buffer              | disabled |
| buffer_LRU_get_free_search                  | Buffer              | disabled |
| buffer_LRU_get_free_waits                   | buffer              | disabled |
| buffer_LRU_search_num_scan                  | buffer              | disabled |
| buffer_LRU_search_scanned                   | buffer              | disabled |
| buffer_LRU_search_scanned_per_call          | buffer              | disabled |
| buffer_LRU_single_flush_failure_count       | Buffer              | disabled |
| buffer_LRU_single_flush_num_scan            | buffer              | disabled |
| buffer_LRU_single_flush_scanned             | buffer              | disabled |
| buffer_LRU_single_flush_scanned_per_call    | buffer              | disabled |
| buffer_LRU_unzip_search_num_scan            | buffer              | disabled |
| buffer_LRU_unzip_search_scanned             | buffer              | disabled |
| buffer_LRU_unzip_search_scanned_per_call    | buffer              | disabled |
| buffer_pages_created                        | buffer              | enabled  |
| buffer_pages_read                           | buffer              | enabled  |
| buffer_pages_written                        | buffer              | enabled  |
| buffer_page_read_blob                       | buffer_page_io      | disabled |
| buffer_page_read_fsp_hdr                    | buffer_page_io      | disabled |
| buffer_page_read_ibuf_bitmap                | buffer_page_io      | disabled |
| buffer_page_read_ibuf_free_list             | buffer_page_io      | disabled |
| buffer_page_read_index_ibuf_leaf            | buffer_page_io      | disabled |
| buffer_page_read_index_ibuf_non_leaf        | buffer_page_io      | disabled |
| buffer_page_read_index_inode                | buffer_page_io      | disabled |
| buffer_page_read_index_leaf                 | buffer_page_io      | disabled |
| buffer_page_read_index_non_leaf             | buffer_page_io      | disabled |
| buffer_page_read_other                      | buffer_page_io      | disabled |
| buffer_page_read_rseg_array                 | buffer_page_io      | disabled |
| buffer_page_read_system_page                | buffer_page_io      | disabled |
| buffer_page_read_trx_system                 | buffer_page_io      | disabled |
| buffer_page_read_undo_log                   | buffer_page_io      | disabled |
| buffer_page_read_xdes                       | buffer_page_io      | disabled |
| buffer_page_read_zblob                      | buffer_page_io      | disabled |
| buffer_page_read_zblob2                     | buffer_page_io      | disabled |
| buffer_page_written_blob                    | buffer_page_io      | disabled |
| buffer_page_written_fsp_hdr                 | buffer_page_io      | disabled |
| buffer_page_written_ibuf_bitmap             | buffer_page_io      | disabled |
| buffer_page_written_ibuf_free_list          | buffer_page_io      | disabled |
| buffer_page_written_index_ibuf_leaf         | buffer_page_io      | disabled |
| buffer_page_written_index_ibuf_non_leaf     | buffer_page_io      | disabled |
| buffer_page_written_index_inode             | buffer_page_io      | disabled |
| buffer_page_written_index_leaf              | buffer_page_io      | disabled |
| buffer_page_written_index_non_leaf          | buffer_page_io      | disabled |
| buffer_page_written_on_log_no_waits         | buffer_page_io      | disabled |
| buffer_page_written_on_log_waits            | buffer_page_io      | disabled |
| buffer_page_written_on_log_wait_loops       | buffer_page_io      | disabled |
| buffer_page_written_other                   | buffer_page_io      | disabled |
| buffer_page_written_rseg_array              | buffer_page_io      | disabled |
| buffer_page_written_system_page             | buffer_page_io      | disabled |
| buffer_page_written_trx_system              | buffer_page_io      | disabled |
| buffer_page_written_undo_log                | buffer_page_io      | disabled |
| buffer_page_written_xdes                    | buffer_page_io      | disabled |
| buffer_page_written_zblob                   | buffer_page_io      | disabled |
| buffer_page_written_zblob2                  | buffer_page_io      | disabled |
| buffer_pool_bytes_data                      | buffer              | enabled  |
| buffer_pool_bytes_dirty                     | buffer              | enabled  |
| buffer_pool_pages_data                      | buffer              | enabled  |
| buffer_pool_pages_dirty                     | buffer              | enabled  |
| buffer_pool_pages_free                      | buffer              | enabled  |
| buffer_pool_pages_misc                      | buffer              | enabled  |
| buffer_pool_pages_total                     | buffer              | enabled  |
| buffer_pool_reads                           | buffer              | enabled  |
| buffer_pool_read_ahead                      | buffer              | enabled  |
| buffer_pool_read_ahead_evicted              | buffer              | enabled  |
| buffer_pool_read_requests                   | buffer              | enabled  |
| buffer_pool_size                            | server              | enabled  |
| buffer_pool_wait_free                       | buffer              | enabled  |
| buffer_pool_write_requests                  | buffer              | enabled  |
| compression_pad_decrements                  | compression         | disabled |
| compression_pad_increments                  | compression         | disabled |
| compress_pages_compressed                   | compression         | disabled |
| compress_pages_decompressed                 | compression         | disabled |
| cpu_n                                       | cpu                 | disabled |
| cpu_stime_abs                               | cpu                 | disabled |
| cpu_stime_pct                               | cpu                 | disabled |
| cpu_utime_abs                               | cpu                 | disabled |
| cpu_utime_pct                               | cpu                 | disabled |
| dblwr_async_requests                        | dblwr               | disabled |
| dblwr_flush_requests                        | dblwr               | disabled |
| dblwr_flush_wait_events                     | dblwr               | disabled |
| dblwr_sync_requests                         | dblwr               | disabled |
| ddl_background_drop_tables                  | ddl                 | disabled |
| ddl_log_file_alter_table                    | ddl                 | disabled |
| ddl_online_create_index                     | ddl                 | disabled |
| ddl_pending_alter_table                     | ddl                 | disabled |
| ddl_sort_file_alter_table                   | ddl                 | disabled |
| dml_deletes                                 | dml                 | enabled  |
| dml_inserts                                 | dml                 | enabled  |
| dml_reads                                   | dml                 | disabled |
| dml_system_deletes                          | dml                 | enabled  |
| dml_system_inserts                          | dml                 | enabled  |
| dml_system_reads                            | dml                 | enabled  |
| dml_system_updates                          | dml                 | enabled  |
| dml_updates                                 | dml                 | enabled  |
| file_num_open_files                         | file_system         | enabled  |
| ibuf_merges                                 | change_buffer       | enabled  |
| ibuf_merges_delete                          | change_buffer       | enabled  |
| ibuf_merges_delete_mark                     | change_buffer       | enabled  |
| ibuf_merges_discard_delete                  | change_buffer       | enabled  |
| ibuf_merges_discard_delete_mark             | change_buffer       | enabled  |
| ibuf_merges_discard_insert                  | change_buffer       | enabled  |
| ibuf_merges_insert                          | change_buffer       | enabled  |
| ibuf_size                                   | change_buffer       | enabled  |
| icp_attempts                                | icp                 | disabled |
| icp_match                                   | icp                 | disabled |
| icp_no_match                                | icp                 | disabled |
| icp_out_of_range                            | icp                 | disabled |
| index_page_discards                         | index               | disabled |
| index_page_merge_attempts                   | index               | disabled |
| index_page_merge_successful                 | index               | disabled |
| index_page_reorg_attempts                   | index               | disabled |
| index_page_reorg_successful                 | index               | disabled |
| index_page_splits                           | index               | disabled |
| innodb_activity_count                       | server              | enabled  |
| innodb_background_drop_table_usec           | server              | disabled |
| innodb_dblwr_pages_written                  | server              | enabled  |
| innodb_dblwr_writes                         | server              | enabled  |
| innodb_dict_lru_count                       | server              | disabled |
| innodb_dict_lru_usec                        | server              | disabled |
| innodb_ibuf_merge_usec                      | server              | disabled |
| innodb_master_active_loops                  | server              | disabled |
| innodb_master_idle_loops                    | server              | disabled |
| innodb_master_purge_usec                    | server              | disabled |
| innodb_master_thread_sleeps                 | server              | disabled |
| innodb_mem_validate_usec                    | server              | disabled |
| innodb_page_size                            | server              | enabled  |
| innodb_rwlock_sx_os_waits                   | server              | enabled  |
| innodb_rwlock_sx_spin_rounds                | server              | enabled  |
| innodb_rwlock_sx_spin_waits                 | server              | enabled  |
| innodb_rwlock_s_os_waits                    | server              | enabled  |
| innodb_rwlock_s_spin_rounds                 | server              | enabled  |
| innodb_rwlock_s_spin_waits                  | server              | enabled  |
| innodb_rwlock_x_os_waits                    | server              | enabled  |
| innodb_rwlock_x_spin_rounds                 | server              | enabled  |
| innodb_rwlock_x_spin_waits                  | server              | enabled  |
| lock_deadlocks                              | lock                | enabled  |
| lock_deadlock_false_positives               | lock                | enabled  |
| lock_deadlock_rounds                        | lock                | enabled  |
| lock_rec_grant_attempts                     | lock                | enabled  |
| lock_rec_locks                              | lock                | disabled |
| lock_rec_lock_created                       | lock                | disabled |
| lock_rec_lock_removed                       | lock                | disabled |
| lock_rec_lock_requests                      | lock                | disabled |
| lock_rec_lock_waits                         | lock                | disabled |
| lock_rec_release_attempts                   | lock                | enabled  |
| lock_row_lock_current_waits                 | lock                | enabled  |
| lock_row_lock_time                          | lock                | enabled  |
| lock_row_lock_time_avg                      | lock                | enabled  |
| lock_row_lock_time_max                      | lock                | enabled  |
| lock_row_lock_waits                         | lock                | enabled  |
| lock_schedule_refreshes                     | lock                | enabled  |
| lock_table_locks                            | lock                | disabled |
| lock_table_lock_created                     | lock                | disabled |
| lock_table_lock_removed                     | lock                | disabled |
| lock_table_lock_waits                       | lock                | disabled |
| lock_threads_waiting                        | lock                | enabled  |
| lock_timeouts                               | lock                | enabled  |
| log_checkpoints                             | log                 | disabled |
| log_concurrency_margin                      | log                 | disabled |
| log_flusher_no_waits                        | log                 | disabled |
| log_flusher_waits                           | log                 | disabled |
| log_flusher_wait_loops                      | log                 | disabled |
| log_flush_avg_time                          | log                 | disabled |
| log_flush_lsn_avg_rate                      | log                 | disabled |
| log_flush_max_time                          | log                 | disabled |
| log_flush_notifier_no_waits                 | log                 | disabled |
| log_flush_notifier_waits                    | log                 | disabled |
| log_flush_notifier_wait_loops               | log                 | disabled |
| log_flush_total_time                        | log                 | disabled |
| log_free_space                              | log                 | disabled |
| log_full_block_writes                       | log                 | disabled |
| log_lsn_archived                            | log                 | disabled |
| log_lsn_buf_dirty_pages_added               | log                 | disabled |
| log_lsn_buf_pool_oldest_approx              | log                 | disabled |
| log_lsn_buf_pool_oldest_lwm                 | log                 | disabled |
| log_lsn_checkpoint_age                      | log                 | disabled |
| log_lsn_current                             | log                 | disabled |
| log_lsn_last_checkpoint                     | log                 | disabled |
| log_lsn_last_flush                          | log                 | disabled |
| log_max_modified_age_async                  | log                 | disabled |
| log_max_modified_age_sync                   | log                 | disabled |
| log_next_file                               | log                 | disabled |
| log_on_buffer_space_no_waits                | log                 | disabled |
| log_on_buffer_space_waits                   | log                 | disabled |
| log_on_buffer_space_wait_loops              | log                 | disabled |
| log_on_file_space_no_waits                  | log                 | disabled |
| log_on_file_space_waits                     | log                 | disabled |
| log_on_file_space_wait_loops                | log                 | disabled |
| log_on_flush_no_waits                       | log                 | disabled |
| log_on_flush_waits                          | log                 | disabled |
| log_on_flush_wait_loops                     | log                 | disabled |
| log_on_recent_closed_wait_loops             | log                 | disabled |
| log_on_recent_written_wait_loops            | log                 | disabled |
| log_on_write_no_waits                       | log                 | disabled |
| log_on_write_waits                          | log                 | disabled |
| log_on_write_wait_loops                     | log                 | disabled |
| log_padded                                  | log                 | disabled |
| log_partial_block_writes                    | log                 | disabled |
| log_waits                                   | log                 | enabled  |
| log_writer_no_waits                         | log                 | disabled |
| log_writer_on_archiver_waits                | log                 | disabled |
| log_writer_on_file_space_waits              | log                 | disabled |
| log_writer_waits                            | log                 | disabled |
| log_writer_wait_loops                       | log                 | disabled |
| log_writes                                  | log                 | enabled  |
| log_write_notifier_no_waits                 | log                 | disabled |
| log_write_notifier_waits                    | log                 | disabled |
| log_write_notifier_wait_loops               | log                 | disabled |
| log_write_requests                          | log                 | enabled  |
| log_write_to_file_requests_interval         | log                 | disabled |
| metadata_table_handles_closed               | metadata            | disabled |
| metadata_table_handles_opened               | metadata            | disabled |
| metadata_table_reference_count              | metadata            | disabled |
| module_cpu                                  | cpu                 | disabled |
| module_dblwr                                | dblwr               | disabled |
| module_page_track                           | page_track          | disabled |
| os_data_fsyncs                              | os                  | enabled  |
| os_data_reads                               | os                  | enabled  |
| os_data_writes                              | os                  | enabled  |
| os_log_bytes_written                        | os                  | enabled  |
| os_log_fsyncs                               | os                  | enabled  |
| os_log_pending_fsyncs                       | os                  | enabled  |
| os_log_pending_writes                       | os                  | enabled  |
| os_pending_reads                            | os                  | disabled |
| os_pending_writes                           | os                  | disabled |
| page_track_checkpoint_partial_flush_request | page_track          | disabled |
| page_track_full_block_writes                | page_track          | disabled |
| page_track_partial_block_writes             | page_track          | disabled |
| page_track_resets                           | page_track          | disabled |
| purge_del_mark_records                      | purge               | disabled |
| purge_dml_delay_usec                        | purge               | disabled |
| purge_invoked                               | purge               | disabled |
| purge_resume_count                          | purge               | disabled |
| purge_stop_count                            | purge               | disabled |
| purge_truncate_history_count                | purge               | disabled |
| purge_truncate_history_usec                 | purge               | disabled |
| purge_undo_log_pages                        | purge               | disabled |
| purge_upd_exist_or_extern_records           | purge               | disabled |
| sampled_pages_read                          | sampling            | disabled |
| sampled_pages_skipped                       | sampling            | disabled |
| trx_active_transactions                     | transaction         | disabled |
| trx_allocations                             | transaction         | disabled |
| trx_commits_insert_update                   | transaction         | disabled |
| trx_nl_ro_commits                           | transaction         | disabled |
| trx_on_log_no_waits                         | transaction         | disabled |
| trx_on_log_waits                            | transaction         | disabled |
| trx_on_log_wait_loops                       | transaction         | disabled |
| trx_rollbacks                               | transaction         | disabled |
| trx_rollbacks_savepoint                     | transaction         | disabled |
| trx_rollback_active                         | transaction         | disabled |
| trx_ro_commits                              | transaction         | disabled |
| trx_rseg_current_size                       | transaction         | disabled |
| trx_rseg_history_len                        | transaction         | enabled  |
| trx_rw_commits                              | transaction         | disabled |
| trx_undo_slots_cached                       | transaction         | disabled |
| trx_undo_slots_used                         | transaction         | disabled |
| undo_truncate_count                         | undo                | disabled |
| undo_truncate_done_logging_count            | undo                | disabled |
| undo_truncate_start_logging_count           | undo                | disabled |
| undo_truncate_usec                          | undo                | disabled |
+---------------------------------------------+---------------------+----------+
314 rows in set (0.00 sec)
```

#### Counter Modules

Each counter is associated with a particular module. Module names can be used to enable, disable, or reset all counters for a particular subsystem. For example, use `module_dml` to enable all counters associated with the `dml` subsystem.

```
mysql> SET GLOBAL innodb_monitor_enable = module_dml;

mysql> SELECT name, subsystem, status FROM INFORMATION_SCHEMA.INNODB_METRICS
       WHERE subsystem ='dml';
+-------------+-----------+---------+
| name        | subsystem | status  |
+-------------+-----------+---------+
| dml_reads   | dml       | enabled |
| dml_inserts | dml       | enabled |
| dml_deletes | dml       | enabled |
| dml_updates | dml       | enabled |
+-------------+-----------+---------+
```

Module names can be used with `innodb_monitor_enable` and related variables.

Module names and corresponding `SUBSYSTEM` names are listed below.

* `module_adaptive_hash` (subsystem = `adaptive_hash_index`)

* `module_buffer` (subsystem = `buffer`)

* `module_buffer_page` (subsystem = `buffer_page_io`)

* `module_compress` (subsystem = `compression`)

* `module_ddl` (subsystem = `ddl`)

* `module_dml` (subsystem = `dml`)

* `module_file` (subsystem = `file_system`)

* `module_ibuf_system` (subsystem = `change_buffer`)

* `module_icp` (subsystem = `icp`)

* `module_index` (subsystem = `index`)

* `module_innodb` (subsystem = `innodb`)

* `module_lock` (subsystem = `lock`)

* `module_log` (subsystem = `log`)

* `module_metadata` (subsystem = `metadata`)

* `module_os` (subsystem = `os`)

* `module_purge` (subsystem = `purge`)

* `module_trx` (subsystem = `transaction`)

* `module_undo` (subsystem = `undo`)

**Example 17.11 Working with INNODB\_METRICS Table Counters**

This example demonstrates enabling, disabling, and resetting a counter, and querying counter data in the `INNODB_METRICS` table.

1. Create a simple `InnoDB` table:

   ```
   mysql> USE test;
   Database changed

   mysql> CREATE TABLE t1 (c1 INT) ENGINE=INNODB;
   Query OK, 0 rows affected (0.02 sec)
   ```

2. Enable the `dml_inserts` counter.

   ```
   mysql> SET GLOBAL innodb_monitor_enable = dml_inserts;
   Query OK, 0 rows affected (0.01 sec)
   ```

   A description of the `dml_inserts` counter can be found in the `COMMENT` column of the `INNODB_METRICS` table:

   ```
   mysql> SELECT NAME, COMMENT FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME="dml_inserts";
   +-------------+-------------------------+
   | NAME        | COMMENT                 |
   +-------------+-------------------------+
   | dml_inserts | Number of rows inserted |
   +-------------+-------------------------+
   ```

3. Query the `INNODB_METRICS` table for the `dml_inserts` counter data. Because no DML operations have been performed, the counter values are zero or NULL. The `TIME_ENABLED` and `TIME_ELAPSED` values indicate when the counter was last enabled and how many seconds have elapsed since that time.

   ```
   mysql>  SELECT * FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME="dml_inserts" \G
   *************************** 1. row ***************************
              NAME: dml_inserts
         SUBSYSTEM: dml
             COUNT: 0
         MAX_COUNT: 0
         MIN_COUNT: NULL
         AVG_COUNT: 0
       COUNT_RESET: 0
   MAX_COUNT_RESET: 0
   MIN_COUNT_RESET: NULL
   AVG_COUNT_RESET: NULL
      TIME_ENABLED: 2014-12-04 14:18:28
     TIME_DISABLED: NULL
      TIME_ELAPSED: 28
        TIME_RESET: NULL
            STATUS: enabled
              TYPE: status_counter
           COMMENT: Number of rows inserted
   ```

4. Insert three rows of data into the table.

   ```
   mysql> INSERT INTO t1 values(1);
   Query OK, 1 row affected (0.00 sec)

   mysql> INSERT INTO t1 values(2);
   Query OK, 1 row affected (0.00 sec)

   mysql> INSERT INTO t1 values(3);
   Query OK, 1 row affected (0.00 sec)
   ```

5. Query the `INNODB_METRICS` table again for the `dml_inserts` counter data. A number of counter values have now incremented including `COUNT`, `MAX_COUNT`, `AVG_COUNT`, and `COUNT_RESET`. Refer to the `INNODB_METRICS` table definition for descriptions of these values.

   ```
   mysql>  SELECT * FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME="dml_inserts"\G
   *************************** 1. row ***************************
              NAME: dml_inserts
         SUBSYSTEM: dml
             COUNT: 3
         MAX_COUNT: 3
         MIN_COUNT: NULL
         AVG_COUNT: 0.046153846153846156
       COUNT_RESET: 3
   MAX_COUNT_RESET: 3
   MIN_COUNT_RESET: NULL
   AVG_COUNT_RESET: NULL
      TIME_ENABLED: 2014-12-04 14:18:28
     TIME_DISABLED: NULL
      TIME_ELAPSED: 65
        TIME_RESET: NULL
            STATUS: enabled
              TYPE: status_counter
           COMMENT: Number of rows inserted
   ```

6. Reset the `dml_inserts` counter and query the `INNODB_METRICS` table again for the `dml_inserts` counter data. The `%_RESET` values that were reported previously, such as `COUNT_RESET` and `MAX_RESET`, are set back to zero. Values such as `COUNT`, `MAX_COUNT`, and `AVG_COUNT`, which cumulatively collect data from the time the counter is enabled, are unaffected by the reset.

   ```
   mysql> SET GLOBAL innodb_monitor_reset = dml_inserts;
   Query OK, 0 rows affected (0.00 sec)

   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME="dml_inserts"\G
   *************************** 1. row ***************************
              NAME: dml_inserts
         SUBSYSTEM: dml
             COUNT: 3
         MAX_COUNT: 3
         MIN_COUNT: NULL
         AVG_COUNT: 0.03529411764705882
       COUNT_RESET: 0
   MAX_COUNT_RESET: 0
   MIN_COUNT_RESET: NULL
   AVG_COUNT_RESET: 0
      TIME_ENABLED: 2014-12-04 14:18:28
     TIME_DISABLED: NULL
      TIME_ELAPSED: 85
        TIME_RESET: 2014-12-04 14:19:44
            STATUS: enabled
              TYPE: status_counter
           COMMENT: Number of rows inserted
   ```

7. To reset all counter values, you must first disable the counter. Disabling the counter sets the `STATUS` value to `disabled`.

   ```
   mysql> SET GLOBAL innodb_monitor_disable = dml_inserts;
   Query OK, 0 rows affected (0.00 sec)

   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME="dml_inserts"\G
   *************************** 1. row ***************************
              NAME: dml_inserts
         SUBSYSTEM: dml
             COUNT: 3
         MAX_COUNT: 3
         MIN_COUNT: NULL
         AVG_COUNT: 0.030612244897959183
       COUNT_RESET: 0
   MAX_COUNT_RESET: 0
   MIN_COUNT_RESET: NULL
   AVG_COUNT_RESET: 0
      TIME_ENABLED: 2014-12-04 14:18:28
     TIME_DISABLED: 2014-12-04 14:20:06
      TIME_ELAPSED: 98
        TIME_RESET: NULL
            STATUS: disabled
              TYPE: status_counter
           COMMENT: Number of rows inserted
   ```

   Note

   Wildcard match is supported for counter and module names. For example, instead of specifying the full `dml_inserts` counter name, you can specify `dml_i%`. You can also enable, disable, or reset multiple counters or modules at once using a wildcard match. For example, specify `dml_%` to enable, disable, or reset all counters that begin with `dml_`.

8. After the counter is disabled, you can reset all counter values using the `innodb_monitor_reset_all` option. All values are set to zero or NULL.

   ```
   mysql> SET GLOBAL innodb_monitor_reset_all = dml_inserts;
   Query OK, 0 rows affected (0.00 sec)

   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME="dml_inserts"\G
   *************************** 1. row ***************************
              NAME: dml_inserts
         SUBSYSTEM: dml
             COUNT: 0
         MAX_COUNT: NULL
         MIN_COUNT: NULL
         AVG_COUNT: NULL
       COUNT_RESET: 0
   MAX_COUNT_RESET: NULL
   MIN_COUNT_RESET: NULL
   AVG_COUNT_RESET: NULL
      TIME_ENABLED: NULL
     TIME_DISABLED: NULL
      TIME_ELAPSED: NULL
        TIME_RESET: NULL
            STATUS: disabled
              TYPE: status_counter
           COMMENT: Number of rows inserted
   ```


### 17.15.7 InnoDB INFORMATION\_SCHEMA Temporary Table Info Table

`INNODB_TEMP_TABLE_INFO` provides information about user-created `InnoDB` temporary tables that are active in the `InnoDB` instance. It does not provide information about internal `InnoDB` temporary tables used by the optimizer.

```
mysql> SHOW TABLES FROM INFORMATION_SCHEMA LIKE 'INNODB_TEMP%';
+---------------------------------------------+
| Tables_in_INFORMATION_SCHEMA (INNODB_TEMP%) |
+---------------------------------------------+
| INNODB_TEMP_TABLE_INFO                      |
+---------------------------------------------+
```

For the table definition, see Section 28.4.27, “The INFORMATION\_SCHEMA INNODB\_TEMP\_TABLE\_INFO Table”.

**Example 17.12 INNODB\_TEMP\_TABLE\_INFO**

This example demonstrates characteristics of the `INNODB_TEMP_TABLE_INFO` table.

1. Create a simple `InnoDB` temporary table:

   ```
   mysql> CREATE TEMPORARY TABLE t1 (c1 INT PRIMARY KEY) ENGINE=INNODB;
   ```

2. Query `INNODB_TEMP_TABLE_INFO` to view the temporary table metadata.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
   *************************** 1. row ***************************
               TABLE_ID: 194
                   NAME: #sql7a79_1_0
                 N_COLS: 4
                  SPACE: 182
   ```

   The `TABLE_ID`  is a unique identifier for the temporary table. The `NAME` column displays the system-generated name for the temporary table, which is prefixed with “#sql”. The number of columns (`N_COLS`) is 4 rather than 1 because `InnoDB` always creates three hidden table columns (`DB_ROW_ID`, `DB_TRX_ID`, and `DB_ROLL_PTR`).

3. Restart MySQL and query `INNODB_TEMP_TABLE_INFO`.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
   ```

   An empty set is returned because `INNODB_TEMP_TABLE_INFO` and its data are not persisted to disk when the server is shut down.

4. Create a new temporary table.

   ```
   mysql> CREATE TEMPORARY TABLE t1 (c1 INT PRIMARY KEY) ENGINE=INNODB;
   ```

5. Query `INNODB_TEMP_TABLE_INFO` to view the temporary table metadata.

   ```
   mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
   *************************** 1. row ***************************
               TABLE_ID: 196
                   NAME: #sql7b0e_1_0
                 N_COLS: 4
                  SPACE: 184
   ```

   The `SPACE` ID may be different because it is dynamically generated when the server is started.


### 17.15.8 Retrieving InnoDB Tablespace Metadata from INFORMATION\_SCHEMA.FILES

The Information Schema `FILES` table provides metadata about all `InnoDB` tablespace types including [file-per-table tablespaces](glossary.html#glos_file_per_table "file-per-table"), [general tablespaces](glossary.html#glos_general_tablespace "general tablespace"), the system tablespace, [temporary table tablespaces](/doc/refman/8.4/en/glossary.html#glos_temporary_tablespace), and [undo tablespaces](glossary.html#glos_undo_tablespace "undo tablespace") (if present).

This section provides `InnoDB`-specific usage examples. For more information about data provided by the Information Schema `FILES` table, see Section 28.3.15, “The INFORMATION\_SCHEMA FILES Table”.

Note

The `INNODB_TABLESPACES` and `INNODB_DATAFILES` tables also provide metadata about `InnoDB` tablespaces, but data is limited to file-per-table, general, and undo tablespaces.

This query retrieves metadata about the `InnoDB` system tablespace from fields of the Information Schema `FILES` table that are pertinent to `InnoDB` tablespaces. `FILES` columns that are not relevant to `InnoDB` always return `NULL`, and are excluded from the query.

```
mysql> SELECT FILE_ID, FILE_NAME, FILE_TYPE, TABLESPACE_NAME, FREE_EXTENTS,
    ->     TOTAL_EXTENTS,  EXTENT_SIZE, INITIAL_SIZE, MAXIMUM_SIZE, AUTOEXTEND_SIZE, DATA_FREE, STATUS ENGINE
    ->     FROM INFORMATION_SCHEMA.FILES WHERE TABLESPACE_NAME LIKE 'innodb_system' \G
*************************** 1. row ***************************
        FILE_ID: 0
      FILE_NAME: ./ibdata1
      FILE_TYPE: TABLESPACE
TABLESPACE_NAME: innodb_system
   FREE_EXTENTS: 0
  TOTAL_EXTENTS: 12
    EXTENT_SIZE: 1048576
   INITIAL_SIZE: 12582912
   MAXIMUM_SIZE: NULL
AUTOEXTEND_SIZE: 67108864
      DATA_FREE: 4194304
         ENGINE: NORMAL
```

This query retrieves the `FILE_ID` (equivalent to the space ID) and the `FILE_NAME` (which includes path information) for `InnoDB` file-per-table and general tablespaces. File-per-table and general tablespaces have a `.ibd` file extension.

```
mysql> SELECT FILE_ID, FILE_NAME FROM INFORMATION_SCHEMA.FILES
    ->     WHERE FILE_NAME LIKE '%.ibd%' ORDER BY FILE_ID;
    +---------+---------------------------------------+
    | FILE_ID | FILE_NAME                             |
    +---------+---------------------------------------+
    |       2 | ./mysql/plugin.ibd                    |
    |       3 | ./mysql/servers.ibd                   |
    |       4 | ./mysql/help_topic.ibd                |
    |       5 | ./mysql/help_category.ibd             |
    |       6 | ./mysql/help_relation.ibd             |
    |       7 | ./mysql/help_keyword.ibd              |
    |       8 | ./mysql/time_zone_name.ibd            |
    |       9 | ./mysql/time_zone.ibd                 |
    |      10 | ./mysql/time_zone_transition.ibd      |
    |      11 | ./mysql/time_zone_transition_type.ibd |
    |      12 | ./mysql/time_zone_leap_second.ibd     |
    |      13 | ./mysql/innodb_table_stats.ibd        |
    |      14 | ./mysql/innodb_index_stats.ibd        |
    |      15 | ./mysql/slave_relay_log_info.ibd      |
    |      16 | ./mysql/slave_master_info.ibd         |
    |      17 | ./mysql/slave_worker_info.ibd         |
    |      18 | ./mysql/gtid_executed.ibd             |
    |      19 | ./mysql/server_cost.ibd               |
    |      20 | ./mysql/engine_cost.ibd               |
    |      21 | ./sys/sys_config.ibd                  |
    |      23 | ./test/t1.ibd                         |
    |      26 | /home/user/test/test/t2.ibd           |
    +---------+---------------------------------------+
```

This query retrieves the `FILE_ID` and `FILE_NAME` for the `InnoDB` global temporary tablespace. Global temporary tablespace file names are prefixed by `ibtmp`.

```
mysql> SELECT FILE_ID, FILE_NAME FROM INFORMATION_SCHEMA.FILES
       WHERE FILE_NAME LIKE '%ibtmp%';
+---------+-----------+
| FILE_ID | FILE_NAME |
+---------+-----------+
|      22 | ./ibtmp1  |
+---------+-----------+
```

Similarly, `InnoDB` undo tablespace file names are prefixed by `undo`. The following query returns the `FILE_ID` and `FILE_NAME` for `InnoDB` undo tablespaces.

```
mysql> SELECT FILE_ID, FILE_NAME FROM INFORMATION_SCHEMA.FILES
       WHERE FILE_NAME LIKE '%undo%';
```
