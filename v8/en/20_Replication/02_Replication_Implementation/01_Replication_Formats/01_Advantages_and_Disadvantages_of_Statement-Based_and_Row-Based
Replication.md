#### 19.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication

Each binary logging format has advantages and disadvantages. For most users, the mixed replication format should provide the best combination of data integrity and performance. If, however, you want to take advantage of the features specific to the statement-based or row-based replication format when performing certain tasks, you can use the information in this section, which provides a summary of their relative advantages and disadvantages, to determine which is best for your needs.

* Advantages of statement-based replication

* Disadvantages of statement-based replication

* Advantages of row-based replication

* Disadvantages of row-based replication

##### Advantages of statement-based replication

* Proven technology.
* Less data written to log files. When updates or deletes affect many rows, this results in *much* less storage space required for log files. This also means that taking and restoring from backups can be accomplished more quickly.

* Log files contain all statements that made any changes, so they can be used to audit the database.

##### Disadvantages of statement-based replication

* **Statements that are unsafe for SBR.** Not all statements which modify data (such as `INSERT` `DELETE`, `UPDATE`, and `REPLACE` statements) can be replicated using statement-based replication. Any nondeterministic behavior is difficult to replicate when using statement-based replication. Examples of such Data Modification Language (DML) statements include the following:

  + A statement that depends on a loadable function or stored program that is nondeterministic, since the value returned by such a function or stored program depends on factors other than the parameters supplied to it. (Row-based replication, however, simply replicates the value returned by the function or stored program, so its effect on table rows and data is the same on both the source and replica.) See Section 19.5.1.16, “Replication of Invoked Features”, for more information.

  + `DELETE` and `UPDATE` statements that use a `LIMIT` clause without an `ORDER BY` are nondeterministic. See Section 19.5.1.18, “Replication and LIMIT”.

  + Locking read statements (`SELECT ... FOR UPDATE` and `SELECT ... FOR SHARE`) that use `NOWAIT` or `SKIP LOCKED` options. See Locking Read Concurrency with NOWAIT and SKIP LOCKED.

  + Deterministic loadable functions must be applied on the replicas.

  + Statements using any of the following functions cannot be replicated properly using statement-based replication:

    - `LOAD_FILE()`
    - `UUID()`, `UUID_SHORT()`

    - `USER()`
    - `FOUND_ROWS()`
    - `SYSDATE()` (unless both the source and the replica are started with the `--sysdate-is-now` option)

    - `GET_LOCK()`
    - `IS_FREE_LOCK()`
    - `IS_USED_LOCK()`
    - `MASTER_POS_WAIT()`
    - `RAND()`
    - `RELEASE_LOCK()`
    - `SOURCE_POS_WAIT()`
    - `SLEEP()`
    - `VERSION()`

    However, all other functions are replicated correctly using statement-based replication, including `NOW()` and so forth.

    For more information, see Section 19.5.1.14, “Replication and System Functions”.

  Statements that cannot be replicated correctly using statement-based replication are logged with a warning like the one shown here:

  ```
  [Warning] Statement is not safe to log in statement format.
  ```

  A similar warning is also issued to the client in such cases. The client can display it using `SHOW WARNINGS`.

* `INSERT ... SELECT` requires a greater number of row-level locks than with row-based replication.

* `UPDATE` statements that require a table scan (because no index is used in the `WHERE` clause) must lock a greater number of rows than with row-based replication.

* For `InnoDB`: An `INSERT` statement that uses `AUTO_INCREMENT` blocks other nonconflicting `INSERT` statements.

* For complex statements, the statement must be evaluated and executed on the replica before the rows are updated or inserted. With row-based replication, the replica only has to modify the affected rows, not execute the full statement.

* If there is an error in evaluation on the replica, particularly when executing complex statements, statement-based replication may slowly increase the margin of error across the affected rows over time. See Section 19.5.1.29, “Replica Errors During Replication”.

* Stored functions execute with the same `NOW()` value as the calling statement. However, this is not true of stored procedures.

* Table definitions must be (nearly) identical on source and replica. See Section 19.5.1.9, “Replication with Differing Table Definitions on Source and Replica”, for more information.

* As of MySQL 8.0.22, DML operations that read data from MySQL grant tables (through a join list or subquery) but do not modify them are performed as non-locking reads on the MySQL grant tables and are therefore not safe for statement-based replication. For more information, see Grant Table Concurrency.

##### Advantages of row-based replication

* All changes can be replicated. This is the safest form of replication.

  Note

  Statements that update the information in the `mysql` system schema, such as `GRANT`, `REVOKE` and the manipulation of triggers, stored routines (including stored procedures), and views, are all replicated to replicas using statement-based replication.

  For statements such as `CREATE TABLE ... SELECT`, a `CREATE` statement is generated from the table definition and replicated using statement-based format, while the row insertions are replicated using row-based format.

* Fewer row locks are required on the source, which thus achieves higher concurrency, for the following types of statements:

  + `INSERT ... SELECT`

  + `INSERT` statements with `AUTO_INCREMENT`

  + `UPDATE` or `DELETE` statements with `WHERE` clauses that do not use keys or do not change most of the examined rows.

* Fewer row locks are required on the replica for any `INSERT`, `UPDATE`, or `DELETE` statement.

##### Disadvantages of row-based replication

* RBR can generate more data that must be logged. To replicate a DML statement (such as an `UPDATE` or `DELETE` statement), statement-based replication writes only the statement to the binary log. By contrast, row-based replication writes each changed row to the binary log. If the statement changes many rows, row-based replication may write significantly more data to the binary log; this is true even for statements that are rolled back. This also means that making and restoring a backup can require more time. In addition, the binary log is locked for a longer time to write the data, which may cause concurrency problems. Use `binlog_row_image=minimal` to reduce the disadvantage considerably.

* Deterministic loadable functions that generate large `BLOB` values take longer to replicate with row-based replication than with statement-based replication. This is because the `BLOB` column value is logged, rather than the statement generating the data.

* You cannot see on the replica what statements were received from the source and executed. However, you can see what data was changed using **mysqlbinlog** with the options `--base64-output=DECODE-ROWS` and `--verbose`.

  Alternatively, use the `binlog_rows_query_log_events` variable, which if enabled adds a `Rows_query` event with the statement to **mysqlbinlog** output when the `-vv` option is used.

* For tables using the `MyISAM` storage engine, a stronger lock is required on the replica for `INSERT` statements when applying them as row-based events to the binary log than when applying them as statements. This means that concurrent inserts on `MyISAM` tables are not supported when using row-based replication.
