#### 16.2.1.3 Determination of Safe and Unsafe Statements in Binary Logging

The “safeness” of a statement in MySQL Replication, refers to whether the statement and its effects can be replicated correctly using statement-based format. If this is true of the statement, we refer to the statement as safe; otherwise, we refer to it as unsafe.

In general, a statement is safe if it deterministic, and unsafe if it is not. However, certain nondeterministic functions are *not* considered unsafe (see [Nondeterministic functions not considered unsafe](replication-rbr-safe-unsafe.html#replication-rbr-safe-unsafe-not "Nondeterministic functions not considered unsafe"), later in this section). In addition, statements using results from floating-point math functions—which are hardware-dependent—are always considered unsafe (see [Section 16.4.1.12, “Replication and Floating-Point Values”](replication-features-floatvalues.html "16.4.1.12 Replication and Floating-Point Values")).

**Handling of safe and unsafe statements.** A statement is treated differently depending on whether the statement is considered safe, and with respect to the binary logging format (that is, the current value of [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format)).

* When using row-based logging, no distinction is made in the treatment of safe and unsafe statements.

* When using mixed-format logging, statements flagged as unsafe are logged using the row-based format; statements regarded as safe are logged using the statement-based format.

* When using statement-based logging, statements flagged as being unsafe generate a warning to this effect. Safe statements are logged normally.

Each statement flagged as unsafe generates a warning. Formerly, if a large number of such statements were executed on the source, this could lead to excessively large error log files. To prevent this, MySQL 5.7 provides a warning suppression mechanism, which behaves as follows: Whenever the 50 most recent [`ER_BINLOG_UNSAFE_STATEMENT`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_binlog_unsafe_statement) warnings have been generated more than 50 times in any 50-second period, warning suppression is enabled. When activated, this causes such warnings not to be written to the error log; instead, for each 50 warnings of this type, a note `The last warning was repeated N times in last S seconds` is written to the error log. This continues as long as the 50 most recent such warnings were issued in 50 seconds or less; once the rate has decreased below this threshold, the warnings are once again logged normally. Warning suppression has no effect on how the safety of statements for statement-based logging is determined, nor on how warnings are sent to the client. MySQL clients still receive one warning for each such statement.

For more information, see [Section 16.2.1, “Replication Formats”](replication-formats.html "16.2.1 Replication Formats").

**Statements considered unsafe.** Statements with the following characteristics are considered unsafe:

* **Statements containing system functions that may return a different value on a replica.** These functions include [`FOUND_ROWS()`](information-functions.html#function_found-rows), [`GET_LOCK()`](locking-functions.html#function_get-lock), [`IS_FREE_LOCK()`](locking-functions.html#function_is-free-lock), [`IS_USED_LOCK()`](locking-functions.html#function_is-used-lock), [`LOAD_FILE()`](string-functions.html#function_load-file), [`MASTER_POS_WAIT()`](miscellaneous-functions.html#function_master-pos-wait), [`PASSWORD()`](encryption-functions.html#function_password), [`RAND()`](mathematical-functions.html#function_rand), [`RELEASE_LOCK()`](locking-functions.html#function_release-lock), [`ROW_COUNT()`](information-functions.html#function_row-count), [`SESSION_USER()`](information-functions.html#function_session-user), [`SLEEP()`](miscellaneous-functions.html#function_sleep), [`SYSDATE()`](date-and-time-functions.html#function_sysdate), [`SYSTEM_USER()`](information-functions.html#function_system-user), [`USER()`](information-functions.html#function_user), [`UUID()`](miscellaneous-functions.html#function_uuid), and [`UUID_SHORT()`](miscellaneous-functions.html#function_uuid-short).

  **Nondeterministic functions not considered unsafe.** Although these functions are not deterministic, they are treated as safe for purposes of logging and replication: [`CONNECTION_ID()`](information-functions.html#function_connection-id), [`CURDATE()`](date-and-time-functions.html#function_curdate), [`CURRENT_DATE()`](date-and-time-functions.html#function_current-date), [`CURRENT_TIME()`](date-and-time-functions.html#function_current-time), [`CURRENT_TIMESTAMP()`](date-and-time-functions.html#function_current-timestamp), [`CURTIME()`](date-and-time-functions.html#function_curtime), [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id), [`LOCALTIME()`](date-and-time-functions.html#function_localtime), [`LOCALTIMESTAMP()`](date-and-time-functions.html#function_localtimestamp), [`NOW()`](date-and-time-functions.html#function_now), [`UNIX_TIMESTAMP()`](date-and-time-functions.html#function_unix-timestamp), [`UTC_DATE()`](date-and-time-functions.html#function_utc-date), [`UTC_TIME()`](date-and-time-functions.html#function_utc-time), and [`UTC_TIMESTAMP()`](date-and-time-functions.html#function_utc-timestamp).

  For more information, see [Section 16.4.1.15, “Replication and System Functions”](replication-features-functions.html "16.4.1.15 Replication and System Functions").

* **References to system variables.** Most system variables are not replicated correctly using the statement-based format. See [Section 16.4.1.37, “Replication and Variables”](replication-features-variables.html "16.4.1.37 Replication and Variables"). For exceptions, see [Section 5.4.4.3, “Mixed Binary Logging Format”](binary-log-mixed.html "5.4.4.3 Mixed Binary Logging Format").

* **Loadable Functions.** Since we have no control over what a loadable function does, we must assume that it is executing unsafe statements.

* **Fulltext plugin.** This plugin may behave differently on different MySQL servers; therefore, statements depending on it could have different results. For this reason, all statements relying on the fulltext plugin are treated as unsafe (Bug
  #11756280, Bug #48183).

* **Trigger or stored program updates a table having an AUTO_INCREMENT column.** This is unsafe because the order in which the rows are updated may differ on the source and the replica.

  In addition, an [`INSERT`](insert.html "13.2.5 INSERT Statement") into a table that has a composite primary key containing an `AUTO_INCREMENT` column that is not the first column of this composite key is unsafe.

  For more information, see [Section 16.4.1.1, “Replication and AUTO_INCREMENT”](replication-features-auto-increment.html "16.4.1.1 Replication and AUTO_INCREMENT").

* **INSERT ... ON DUPLICATE KEY UPDATE statements on tables with multiple primary or unique keys.** When executed against a table that contains more than one primary or unique key, this statement is considered unsafe, being sensitive to the order in which the storage engine checks the keys, which is not deterministic, and on which the choice of rows updated by the MySQL Server depends.

  An [`INSERT ... ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") statement against a table having more than one unique or primary key is marked as unsafe for statement-based replication. (Bug #11765650, Bug #58637)

* **Updates using LIMIT.** The order in which rows are retrieved is not specified, and is therefore considered unsafe. See [Section 16.4.1.17, “Replication and LIMIT”](replication-features-limit.html "16.4.1.17 Replication and LIMIT").

* **Accesses or references log tables.** The contents of the system log table may differ between source and replica.

* **Nontransactional operations after transactional operations.** Within a transaction, allowing any nontransactional reads or writes to execute after any transactional reads or writes is considered unsafe.

  For more information, see [Section 16.4.1.33, “Replication and Transactions”](replication-features-transactions.html "16.4.1.33 Replication and Transactions").

* **Accesses or references self-logging tables.** All reads and writes to self-logging tables are considered unsafe. Within a transaction, any statement following a read or write to self-logging tables is also considered unsafe.

* **LOAD DATA statements.** [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") is treated as unsafe and when [`binlog_format=mixed`](replication-options-binary-log.html#sysvar_binlog_format) the statement is logged in row-based format. When [`binlog_format=statement`](replication-options-binary-log.html#sysvar_binlog_format) [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") does not generate a warning, unlike other unsafe statements.

* **XA transactions.** If two XA transactions committed in parallel on the source are being prepared on the replica in the inverse order, locking dependencies can occur with statement-based replication that cannot be safely resolved, and it is possible for replication to fail with deadlock on the replica. When [`binlog_format=STATEMENT`](replication-options-binary-log.html#sysvar_binlog_format) is set, DML statements inside XA transactions are flagged as being unsafe and generate a warning. When [`binlog_format=MIXED`](replication-options-binary-log.html#sysvar_binlog_format) or [`binlog_format=ROW`](replication-options-binary-log.html#sysvar_binlog_format) is set, DML statements inside XA transactions are logged using row-based replication, and the potential issue is not present.

For additional information, see [Section 16.4.1, “Replication Features and Issues”](replication-features.html "16.4.1 Replication Features and Issues").
