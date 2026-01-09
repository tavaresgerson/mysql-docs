#### 13.7.5.30 SHOW PROFILE Statement

```sql
SHOW PROFILE [type [, type] ... ]
    [FOR QUERY n]
    [LIMIT row_count [OFFSET offset]]

type: {
    ALL
  | BLOCK IO
  | CONTEXT SWITCHES
  | CPU
  | IPC
  | MEMORY
  | PAGE FAULTS
  | SOURCE
  | SWAPS
}
```

The [`SHOW PROFILE`](show-profile.html "13.7.5.30 SHOW PROFILE Statement") and [`SHOW PROFILES`](show-profiles.html "13.7.5.31 SHOW PROFILES Statement") statements display profiling information that indicates resource usage for statements executed during the course of the current session.

Note

The [`SHOW PROFILE`](show-profile.html "13.7.5.30 SHOW PROFILE Statement") and [`SHOW PROFILES`](show-profiles.html "13.7.5.31 SHOW PROFILES Statement") statements are deprecated; expect them to be removed in a future MySQL release. Use the [Performance Schema](performance-schema.html "Chapter 25 MySQL Performance Schema") instead; see [Section 25.19.1, “Query Profiling Using Performance Schema”](performance-schema-query-profiling.html "25.19.1 Query Profiling Using Performance Schema").

To control profiling, use the [`profiling`](server-system-variables.html#sysvar_profiling) session variable, which has a default value of 0 (`OFF`). Enable profiling by setting [`profiling`](server-system-variables.html#sysvar_profiling) to 1 or `ON`:

```sql
mysql> SET profiling = 1;
```

[`SHOW PROFILES`](show-profiles.html "13.7.5.31 SHOW PROFILES Statement") displays a list of the most recent statements sent to the server. The size of the list is controlled by the [`profiling_history_size`](server-system-variables.html#sysvar_profiling_history_size) session variable, which has a default value of 15. The maximum value is

100. Setting the value to 0 has the practical effect of disabling profiling.

All statements are profiled except [`SHOW PROFILE`](show-profile.html "13.7.5.30 SHOW PROFILE Statement") and [`SHOW PROFILES`](show-profiles.html "13.7.5.31 SHOW PROFILES Statement"), so neither of those statements appears in the profile list. Malformed statements are profiled. For example, `SHOW PROFILING` is an illegal statement, and a syntax error occurs if you try to execute it, but it shows up in the profiling list.

[`SHOW PROFILE`](show-profile.html "13.7.5.30 SHOW PROFILE Statement") displays detailed information about a single statement. Without the `FOR QUERY n` clause, the output pertains to the most recently executed statement. If `FOR QUERY n` is included, [`SHOW PROFILE`](show-profile.html "13.7.5.30 SHOW PROFILE Statement") displays information for statement *`n`*. The values of *`n`* correspond to the `Query_ID` values displayed by [`SHOW PROFILES`](show-profiles.html "13.7.5.31 SHOW PROFILES Statement").

The `LIMIT row_count` clause may be given to limit the output to *`row_count`* rows. If `LIMIT` is given, `OFFSET offset` may be added to begin the output *`offset`* rows into the full set of rows.

By default, [`SHOW PROFILE`](show-profile.html "13.7.5.30 SHOW PROFILE Statement") displays `Status` and `Duration` columns. The `Status` values are like the `State` values displayed by [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement"), although there might be some minor differences in interpretion for the two statements for some status values (see [Section 8.14, “Examining Server Thread (Process) Information”](thread-information.html "8.14 Examining Server Thread (Process) Information")).

Optional *`type`* values may be specified to display specific additional types of information:

* `ALL` displays all information
* `BLOCK IO` displays counts for block input and output operations

* `CONTEXT SWITCHES` displays counts for voluntary and involuntary context switches

* `CPU` displays user and system CPU usage times

* `IPC` displays counts for messages sent and received

* `MEMORY` is not currently implemented
* `PAGE FAULTS` displays counts for major and minor page faults

* `SOURCE` displays the names of functions from the source code, together with the name and line number of the file in which the function occurs

* `SWAPS` displays swap counts

Profiling is enabled per session. When a session ends, its profiling information is lost.

```sql
mysql> SELECT @@profiling;
+-------------+
| @@profiling |
+-------------+
|           0 |
+-------------+
1 row in set (0.00 sec)

mysql> SET profiling = 1;
Query OK, 0 rows affected (0.00 sec)

mysql> DROP TABLE IF EXISTS t1;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> CREATE TABLE T1 (id INT);
Query OK, 0 rows affected (0.01 sec)

mysql> SHOW PROFILES;
+----------+----------+--------------------------+
| Query_ID | Duration | Query                    |
+----------+----------+--------------------------+
|        0 | 0.000088 | SET PROFILING = 1        |
|        1 | 0.000136 | DROP TABLE IF EXISTS t1  |
|        2 | 0.011947 | CREATE TABLE t1 (id INT) |
+----------+----------+--------------------------+
3 rows in set (0.00 sec)

mysql> SHOW PROFILE;
+----------------------+----------+
| Status               | Duration |
+----------------------+----------+
| checking permissions | 0.000040 |
| creating table       | 0.000056 |
| After create         | 0.011363 |
| query end            | 0.000375 |
| freeing items        | 0.000089 |
| logging slow query   | 0.000019 |
| cleaning up          | 0.000005 |
+----------------------+----------+
7 rows in set (0.00 sec)

mysql> SHOW PROFILE FOR QUERY 1;
+--------------------+----------+
| Status             | Duration |
+--------------------+----------+
| query end          | 0.000107 |
| freeing items      | 0.000008 |
| logging slow query | 0.000015 |
| cleaning up        | 0.000006 |
+--------------------+----------+
4 rows in set (0.00 sec)

mysql> SHOW PROFILE CPU FOR QUERY 2;
+----------------------+----------+----------+------------+
| Status               | Duration | CPU_user | CPU_system |
+----------------------+----------+----------+------------+
| checking permissions | 0.000040 | 0.000038 |   0.000002 |
| creating table       | 0.000056 | 0.000028 |   0.000028 |
| After create         | 0.011363 | 0.000217 |   0.001571 |
| query end            | 0.000375 | 0.000013 |   0.000028 |
| freeing items        | 0.000089 | 0.000010 |   0.000014 |
| logging slow query   | 0.000019 | 0.000009 |   0.000010 |
| cleaning up          | 0.000005 | 0.000003 |   0.000002 |
+----------------------+----------+----------+------------+
7 rows in set (0.00 sec)
```

Note

Profiling is only partially functional on some architectures. For values that depend on the `getrusage()` system call, `NULL` is returned on systems such as Windows that do not support the call. In addition, profiling is per process and not per thread. This means that activity on threads within the server other than your own may affect the timing information that you see.

Profiling information is also available from the `INFORMATION_SCHEMA` [`PROFILING`](information-schema-profiling-table.html "24.3.19 The INFORMATION_SCHEMA PROFILING Table") table. See [Section 24.3.19, “The INFORMATION_SCHEMA PROFILING Table”](information-schema-profiling-table.html "24.3.19 The INFORMATION_SCHEMA PROFILING Table"). For example, the following queries are equivalent:

```sql
SHOW PROFILE FOR QUERY 2;

SELECT STATE, FORMAT(DURATION, 6) AS DURATION
FROM INFORMATION_SCHEMA.PROFILING
WHERE QUERY_ID = 2 ORDER BY SEQ;
```
