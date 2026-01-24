## 25.10 Performance Schema Statement Digests

The MySQL server is capable of maintaining statement digest information. The digesting process converts each SQL statement to normalized form (the statement digest) and computes an MD5 hash value (the digest hash value) from the normalized result. Normalization permits statements that are similar to be grouped and summarized to expose information about the types of statements the server is executing and how often they occur. This section describes how statement digesting occurs and how it can be useful.

Digesting occurs in the parser regardless of whether the Performance Schema is available, so that other server components such as MySQL Enterprise Firewall and query rewrite plugins have access to statement digests.

* [Statement Digest General Concepts](performance-schema-statement-digests.html#statement-digests-general "Statement Digest General Concepts")
* [Statement Digests in the Performance Schema](performance-schema-statement-digests.html#statement-digests-performance-schema "Statement Digests in the Performance Schema")
* [Statement Digest Memory Use](performance-schema-statement-digests.html#statement-digests-memory-use "Statement Digest Memory Use")

### Statement Digest General Concepts

When the parser receives an SQL statement, it computes a statement digest if that digest is needed, which is true if any of the following conditions are true:

* Performance Schema digest instrumentation is enabled
* MySQL Enterprise Firewall is enabled
* A query rewrite plugin is enabled

The [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) system variable value determines the maximum number of bytes available per session for computation of normalized statement digests. Once that amount of space is used during digest computation, truncation occurs: no further tokens from a parsed statement are collected or figure into its digest value. Statements that differ only after that many bytes of parsed tokens produce the same normalized statement digest and are considered identical if compared or if aggregated for digest statistics.

Warning

Setting the [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) system variable to zero disables digest production, which also disables server functionality that requires digests.

After the normalized statement has been computed, an MD5 hash value is computed from it. In addition:

* If MySQL Enterprise Firewall is enabled, it is called and the digest as computed is available to it.

* If any query rewrite plugin is enabled, it is called and the statement digest and digest value are available to it.

* If the Performance Schema has digest instrumentation enabled, it makes a copy of the normalized statement digest, allocating a maximum of [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length) bytes for it. Consequently, if [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length) is less than [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length), the copy is truncated relative to the original. The copy of the normalized statement digest is stored in the appropriate Performance Schema tables, along with the MD5 hash value computed from the original normalized statement. (If the Performance Schema truncates its copy of the normalized statement digest relative to the original, it does not recompute the MD5 hash value.)

Statement normalization transforms the statement text to a more standardized digest string representation that preserves the general statement structure while removing information not essential to the structure:

* Object identifiers such as database and table names are preserved.

* Literal values are converted to parameter markers. A normalized statement does not retain information such as names, passwords, dates, and so forth.

* Comments are removed and whitespace is adjusted.

Consider these statements:

```sql
SELECT * FROM orders WHERE customer_id=10 AND quantity>20
SELECT * FROM orders WHERE customer_id = 20 AND quantity > 100
```

To normalize these statements, the parser replaces data values by `?` and adjusts whitespace. Both statements yield the same normalized form and thus are considered “the same”:

```sql
SELECT * FROM orders WHERE customer_id = ? AND quantity > ?
```

The normalized statement contains less information but is still representative of the original statement. Other similar statements that have different data values have the same normalized form.

Now consider these statements:

```sql
SELECT * FROM customers WHERE customer_id = 1000
SELECT * FROM orders WHERE customer_id = 1000
```

In this case, the normalized statements differ because the object identifiers differ:

```sql
SELECT * FROM customers WHERE customer_id = ?
SELECT * FROM orders WHERE customer_id = ?
```

If normalization produces a statement that exceeds the space available in the digest buffer (as determined by [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length)), truncation occurs and the text ends with “...”. Long normalized statements that differ only in the part that occurs following the “...” are considered the same. Consider these statements:

```sql
SELECT * FROM mytable WHERE cola = 10 AND colb = 20
SELECT * FROM mytable WHERE cola = 10 AND colc = 20
```

If the cutoff happens to be right after the `AND`, both statements have this normalized form:

```sql
SELECT * FROM mytable WHERE cola = ? AND ...
```

In this case, the difference in the second column name is lost and both statements are considered the same.

### Statement Digests in the Performance Schema

In the Performance Schema, statement digesting involves these elements:

* A `statements_digest` consumer in the [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") table controls whether the Performance Schema maintains digest information. See [Statement Digest Consumer](performance-schema-consumer-filtering.html#performance-schema-consumer-filtering-statement-digest "Statement Digest Consumer").

* The statement event tables ([`events_statements_current`](performance-schema-events-statements-current-table.html "25.12.6.1 The events_statements_current Table"), [`events_statements_history`](performance-schema-events-statements-history-table.html "25.12.6.2 The events_statements_history Table"), and [`events_statements_history_long`](performance-schema-events-statements-history-long-table.html "25.12.6.3 The events_statements_history_long Table")) have columns for storing normalized statement digests and the corresponding digest MD5 hash values:

  + `DIGEST_TEXT` is the text of the normalized statement digest. This is a copy of the original normalized statement that was computed to a maximum of [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) bytes, further truncated as necessary to [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length) bytes.

  + `DIGEST` is the digest MD5 hash value computed from the original normalized statement.

  See [Section 25.12.6, “Performance Schema Statement Event Tables”](performance-schema-statement-tables.html "25.12.6 Performance Schema Statement Event Tables").

* The [`events_statements_summary_by_digest`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables") summary table provides aggregated statement digest information. This table aggregates information for statements per `SCHEMA_NAME` and `DIGEST` combination. The Performance Schema uses MD5 hash values for aggregation because they are fast to compute and have a favorable statistical distribution that minimizes collisions. See [Section 25.12.15.3, “Statement Summary Tables”](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables").

The statement event tables also have an `SQL_TEXT` column that contains the original SQL statement. The maximum space available for statement display is 1024 bytes by default. To change this value, set the [`performance_schema_max_sql_text_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_sql_text_length) system variable at server startup.

The [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length) system variable determines the maximum number of bytes available per statement for digest value storage in the Performance Schema. However, the display length of statement digests may be longer than the available buffer size due to internal encoding of statement elements such as keywords and literal values. Consequently, values selected from the `DIGEST_TEXT` column of statement event tables may appear to exceed the [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length) value.

The [`events_statements_summary_by_digest`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables") summary table provides a profile of the statements executed by the server. It shows what kinds of statements an application is executing and how often. An application developer can use this information together with other information in the table to assess the application's performance characteristics. For example, table columns that show wait times, lock times, or index use may highlight types of queries that are inefficient. This gives the developer insight into which parts of the application need attention.

The [`events_statements_summary_by_digest`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables") summary table has a fixed size. By default the Performance Schema estimates the size to use at startup. To specify the table size explicitly, set the [`performance_schema_digests_size`](performance-schema-system-variables.html#sysvar_performance_schema_digests_size) system variable at server startup. If the table becomes full, the Performance Schema groups statements that have `SCHEMA_NAME` and `DIGEST` values not matching existing values in the table in a special row with `SCHEMA_NAME` and `DIGEST` set to `NULL`. This permits all statements to be counted. However, if the special row accounts for a significant percentage of the statements executed, it might be desirable to increase the summary table size by increasing [`performance_schema_digests_size`](performance-schema-system-variables.html#sysvar_performance_schema_digests_size).

### Statement Digest Memory Use

For applications that generate very long statements that differ only at the end, increasing [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) enables computation of digests that distinguish statements that would otherwise aggregate to the same digest. Conversely, decreasing [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) causes the server to devote less memory to digest storage but increases the likelihood of longer statements aggregating to the same digest. Administrators should keep in mind that larger values result in correspondingly increased memory requirements, particularly for workloads that involve large numbers of simultaneous sessions (the server allocates [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) bytes per session).

As described previously, normalized statement digests as computed by the parser are constrained to a maximum of [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) bytes, whereas normalized statement digests stored in the Performance Schema use [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length) bytes. The following memory-use considerations apply regarding the relative values of [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) and [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length):

* If [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) is less than [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length):

  + Server components other than the Performance Schema use normalized statement digests that take up to [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) bytes.

  + The Performance Schema does not further truncate normalized statement digests that it stores, but allocates more memory than [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) bytes per digest, which is unnecessary.

* If [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) equals [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length):

  + Server components other than the Performance Schema use normalized statement digests that take up to [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) bytes.

  + The Performance Schema does not further truncate normalized statement digests that it stores, and allocates the same amount of memory as [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) bytes per digest.

* If [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) is greater than [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length):

  + Server components other than the Performance Schema use normalized statement digests that take up to [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) bytes.

  + The Performance Schema further truncates normalized statement digests that it stores, and allocates less memory than [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) bytes per digest.

Because the Performance Schema statement event tables might store many digests, setting [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length) smaller than [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) enables administrators to balance these factors:

* The need to have long normalized statement digests available for server components outside the Performance Schema

* Many concurrent sessions, each of which allocates digest-computation memory

* The need to limit memory consumption by the Performance Schema statement event tables when storing many statement digests

The [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length) setting is not per session, it is per statement, and a session can store multiple statements in the [`events_statements_history`](performance-schema-events-statements-history-table.html "25.12.6.2 The events_statements_history Table") table. A typical number of statements in this table is 10 per session, so each session consumes 10 times the memory indicated by the [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length) value, for this table alone.

Also, there are many statements (and digests) collected globally, most notably in the [`events_statements_history_long`](performance-schema-events-statements-history-long-table.html "25.12.6.3 The events_statements_history_long Table") table. Here, too, *`N`* statements stored consume *`N`* times the memory indicated by the [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length) value.

To assess the amount of memory used for SQL statement storage and digest computation, use the [`SHOW ENGINE PERFORMANCE_SCHEMA STATUS`](show-engine.html "13.7.5.15 SHOW ENGINE Statement") statement, or monitor these instruments:

```sql
mysql> SELECT NAME
       FROM performance_schema.setup_instruments
       WHERE NAME LIKE '%.sqltext';
+------------------------------------------------------------------+
| NAME                                                             |
+------------------------------------------------------------------+
| memory/performance_schema/events_statements_history.sqltext      |
| memory/performance_schema/events_statements_current.sqltext      |
| memory/performance_schema/events_statements_history_long.sqltext |
+------------------------------------------------------------------+

mysql> SELECT NAME
       FROM performance_schema.setup_instruments
       WHERE NAME LIKE 'memory/performance_schema/%.tokens';
+----------------------------------------------------------------------+
| NAME                                                                 |
+----------------------------------------------------------------------+
| memory/performance_schema/events_statements_history.tokens           |
| memory/performance_schema/events_statements_current.tokens           |
| memory/performance_schema/events_statements_summary_by_digest.tokens |
| memory/performance_schema/events_statements_history_long.tokens      |
+----------------------------------------------------------------------+
```
