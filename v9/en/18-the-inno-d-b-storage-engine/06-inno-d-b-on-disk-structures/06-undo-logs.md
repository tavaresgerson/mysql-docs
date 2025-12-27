### 17.6.6 Undo Logs

An undo log is a collection of undo log records associated with a single read-write transaction. An undo log record contains information about how to undo the latest change by a transaction to a clustered index record. If another transaction needs to see the original data as part of a consistent read operation, the unmodified data is retrieved from undo log records. Undo logs exist within undo log segments, which are contained within rollback segments. Rollback segments reside in undo tablespaces and in the global temporary tablespace.

Undo logs that reside in the global temporary tablespace are used for transactions that modify data in user-defined temporary tables. These undo logs are not redo-logged, as they are not required for crash recovery. They are used only for rollback while the server is running. This type of undo log benefits performance by avoiding redo logging I/O.

For information about data-at-rest encryption for undo logs, see Undo Log Encryption.

Each undo tablespace and the global temporary tablespace individually support a maximum of 128 rollback segments. The `innodb_rollback_segments` variable defines the number of rollback segments.

The number of transactions that a rollback segment supports depends on the number of undo slots in the rollback segment and the number of undo logs required by each transaction. The number of undo slots in a rollback segment differs according to `InnoDB` page size.

<table summary="Number of undo slots in a rollback segment for each InnoDB page size"><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>InnoDB Page Size</th> <th>Number of Undo Slots in a Rollback Segment (InnoDB Page Size / 16)</th> </tr></thead><tbody><tr> <td><code class="literal">4096 (4KB)</code></td> <td><code class="literal">256</code></td> </tr><tr> <td><code class="literal">8192 (8KB)</code></td> <td><code class="literal">512</code></td> </tr><tr> <td><code class="literal">16384 (16KB)</code></td> <td><code class="literal">1024</code></td> </tr><tr> <td><code class="literal">32768 (32KB)</code></td> <td><code class="literal">2048</code></td> </tr><tr> <td><code class="literal">65536 (64KB)</code></td> <td><code class="literal">4096</code></td> </tr></tbody></table>

A transaction is assigned up to four undo logs, one for each of the following operation types:

1. `INSERT` operations on user-defined tables

2. `UPDATE` and `DELETE` operations on user-defined tables

3. `INSERT` operations on user-defined temporary tables

4. `UPDATE` and `DELETE` operations on user-defined temporary tables

Undo logs are assigned as needed. For example, a transaction that performs `INSERT`, `UPDATE`, and `DELETE` operations on regular and temporary tables requires a full assignment of four undo logs. A transaction that performs only `INSERT` operations on regular tables requires a single undo log.

A transaction that performs operations on regular tables is assigned undo logs from an assigned undo tablespace rollback segment. A transaction that performs operations on temporary tables is assigned undo logs from an assigned global temporary tablespace rollback segment.

An undo log assigned to a transaction remains attached to the transaction for its duration. For example, an undo log assigned to a transaction for an `INSERT` operation on a regular table is used for all `INSERT` operations on regular tables performed by that transaction.

Given the factors described above, the following formulas can be used to estimate the number of concurrent read-write transactions that `InnoDB` is capable of supporting.

Note

It is possible to encounter a concurrent transaction limit error before reaching the number of concurrent read-write transactions that `InnoDB` is capable of supporting. This occurs when a rollback segment assigned to a transaction runs out of undo slots. In such cases, try rerunning the transaction.

When transactions perform operations on temporary tables, the number of concurrent read-write transactions that `InnoDB` is capable of supporting is constrained by the number of rollback segments allocated to the global temporary tablespace, which is 128 by default.

* If each transaction performs either an `INSERT` **or** an `UPDATE` or `DELETE` operation, the number of concurrent read-write transactions that `InnoDB` is capable of supporting is:

  ```
  (innodb_page_size / 16) * innodb_rollback_segments * number of undo tablespaces
  ```

* If each transaction performs an `INSERT` **and** an `UPDATE` or `DELETE` operation, the number of concurrent read-write transactions that `InnoDB` is capable of supporting is:

  ```
  (innodb_page_size / 16 / 2) * innodb_rollback_segments * number of undo tablespaces
  ```

* If each transaction performs an `INSERT` operation on a temporary table, the number of concurrent read-write transactions that `InnoDB` is capable of supporting is:

  ```
  (innodb_page_size / 16) * innodb_rollback_segments
  ```

* If each transaction performs an `INSERT` **and** an `UPDATE` or `DELETE` operation on a temporary table, the number of concurrent read-write transactions that `InnoDB` is capable of supporting is:

  ```
  (innodb_page_size / 16 / 2) * innodb_rollback_segments
  ```
