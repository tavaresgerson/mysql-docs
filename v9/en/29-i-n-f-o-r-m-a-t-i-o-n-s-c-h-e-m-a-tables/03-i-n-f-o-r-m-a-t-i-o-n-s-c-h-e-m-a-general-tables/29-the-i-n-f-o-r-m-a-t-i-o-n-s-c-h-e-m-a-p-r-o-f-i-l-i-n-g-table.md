### 28.3.29 The INFORMATION_SCHEMA PROFILING Table

The `PROFILING` table provides statement profiling information. Its contents correspond to the information produced by the `SHOW PROFILE` and `SHOW PROFILES` statements (see Section 15.7.7.33, “SHOW PROFILE Statement”). The table is empty unless the `profiling` session variable is set to 1.

Note

This table is deprecated; expect it to be removed in a future MySQL release. Use the Performance Schema instead; see Section 29.19.1, “Query Profiling Using Performance Schema”.

The `PROFILING` table has these columns:

* `QUERY_ID`

  A numeric statement identifier.

* `SEQ`

  A sequence number indicating the display order for rows with the same `QUERY_ID` value.

* `STATE`

  The profiling state to which the row measurements apply.

* `DURATION`

  How long statement execution remained in the given state, in seconds.

* `CPU_USER`, `CPU_SYSTEM`

  User and system CPU use, in seconds.

* `CONTEXT_VOLUNTARY`, `CONTEXT_INVOLUNTARY`

  How many voluntary and involuntary context switches occurred.

* `BLOCK_OPS_IN`, `BLOCK_OPS_OUT`

  The number of block input and output operations.

* `MESSAGES_SENT`, `MESSAGES_RECEIVED`

  The number of communication messages sent and received.

* `PAGE_FAULTS_MAJOR`, `PAGE_FAULTS_MINOR`

  The number of major and minor page faults.

* `SWAPS`

  How many swaps occurred.

* `SOURCE_FUNCTION`, `SOURCE_FILE`, and `SOURCE_LINE`

  Information indicating where in the source code the profiled state executes.

#### Notes

* `PROFILING` is a nonstandard `INFORMATION_SCHEMA` table.

Profiling information is also available from the `SHOW PROFILE` and `SHOW PROFILES` statements. See Section 15.7.7.33, “SHOW PROFILE Statement”. For example, the following queries are equivalent:

```
SHOW PROFILE FOR QUERY 2;

SELECT STATE, FORMAT(DURATION, 6) AS DURATION
FROM INFORMATION_SCHEMA.PROFILING
WHERE QUERY_ID = 2 ORDER BY SEQ;
```
