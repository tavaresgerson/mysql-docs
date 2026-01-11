#### 19.2.5.1 Evaluation of Database-Level Replication and Binary Logging Options

When evaluating replication options, the replica begins by checking to see whether there are any `--replicate-do-db` or `--replicate-ignore-db` options that apply. When using `--binlog-do-db` or `--binlog-ignore-db`, the process is similar, but the options are checked on the source.

The database that is checked for a match depends on the binary log format of the statement that is being handled. If the statement has been logged using the row format, the database where data is to be changed is the database that is checked. If the statement has been logged using the statement format, the default database (specified with a `USE` statement) is the database that is checked.

Note

Only DML statements can be logged using the row format. DDL statements are always logged as statements, even when `binlog_format=ROW`. All DDL statements are therefore always filtered according to the rules for statement-based replication. This means that you must select the default database explicitly with a `USE` statement in order for a DDL statement to be applied.

For replication, the steps involved are listed here:

1. Which logging format is used?

   * **STATEMENT.** Test the default database.

   * **ROW.** Test the database affected by the changes.

2. Are there any `--replicate-do-db` options?

   * **Yes.** Does the database match any of them?

     + **Yes.** Continue to Step 4.

     + **No.** Ignore the update and exit.

   * **No.** Continue to step 3.

3. Are there any `--replicate-ignore-db` options?

   * **Yes.** Does the database match any of them?

     + **Yes.** Ignore the update and exit.

     + **No.** Continue to step 4.

   * **No.** Continue to step 4.

4. Proceed to checking the table-level replication options, if there are any. For a description of how these options are checked, see Section 19.2.5.2, “Evaluation of Table-Level Replication Options”.

   Important

   A statement that is still permitted at this stage is not yet actually executed. The statement is not executed until all table-level options (if any) have also been checked, and the outcome of that process permits execution of the statement.

For binary logging, the steps involved are listed here:

1. Are there any `--binlog-do-db` or `--binlog-ignore-db` options?

   * **Yes.** Continue to step 2.

   * **No.** Log the statement and exit.

2. Is there a default database (has any database been selected by `USE`)?

   * **Yes.** Continue to step 3.

   * **No.** Ignore the statement and exit.

3. There is a default database. Are there any `--binlog-do-db` options?

   * **Yes.** Do any of them match the database?

     + **Yes.** Log the statement and exit.

     + **No.** Ignore the statement and exit.

   * **No.** Continue to step 4.

4. Do any of the `--binlog-ignore-db` options match the database?

   * **Yes.** Ignore the statement and exit.

   * **No.** Log the statement and exit.

Important

For statement-based logging, an exception is made in the rules just given for the `CREATE DATABASE`, `ALTER DATABASE`, and `DROP DATABASE` statements. In those cases, the database being *created, altered, or dropped* replaces the default database when determining whether to log or ignore updates.

`--binlog-do-db` can sometimes mean “ignore other databases”. For example, when using statement-based logging, a server running with only `--binlog-do-db=sales` does not write to the binary log statements for which the default database differs from `sales`. When using row-based logging with the same option, the server logs only those updates that change data in `sales`.
