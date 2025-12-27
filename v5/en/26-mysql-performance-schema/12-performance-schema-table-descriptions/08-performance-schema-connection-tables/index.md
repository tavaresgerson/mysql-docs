### 25.12.8 Performance Schema Connection Tables

[25.12.8.1 The accounts Table](performance-schema-accounts-table.html)

[25.12.8.2 The hosts Table](performance-schema-hosts-table.html)

[25.12.8.3 The users Table](performance-schema-users-table.html)

When a client connects to the MySQL server, it does so under a particular user name and from a particular host. The Performance Schema provides statistics about these connections, tracking them per account (user and host combination) as well as separately per user name and host name, using these tables:

* [`accounts`](performance-schema-accounts-table.html "25.12.8.1 The accounts Table"): Connection statistics per client account

* [`hosts`](performance-schema-hosts-table.html "25.12.8.2 The hosts Table"): Connection statistics per client host name

* [`users`](performance-schema-users-table.html "25.12.8.3 The users Table"): Connection statistics per client user name

The meaning of “account” in the connection tables is similar to its meaning in the MySQL grant tables in the `mysql` system database, in the sense that the term refers to a combination of user and host values. They differ in that, for grant tables, the host part of an account can be a pattern, whereas for Performance Schema tables, the host value is always a specific nonpattern host name.

Each connection table has `CURRENT_CONNECTIONS` and `TOTAL_CONNECTIONS` columns to track the current and total number of connections per “tracking value” on which its statistics are based. The tables differ in what they use for the tracking value. The [`accounts`](performance-schema-accounts-table.html "25.12.8.1 The accounts Table") table has `USER` and `HOST` columns to track connections per user and host combination. The [`users`](performance-schema-users-table.html "25.12.8.3 The users Table") and [`hosts`](performance-schema-hosts-table.html "25.12.8.2 The hosts Table") tables have a `USER` and `HOST` column, respectively, to track connections per user name and host name.

The Performance Schema also counts internal threads and threads for user sessions that failed to authenticate, using rows with `USER` and `HOST` column values of `NULL`.

Suppose that clients named `user1` and `user2` each connect one time from `hosta` and `hostb`. The Performance Schema tracks the connections as follows:

* The [`accounts`](performance-schema-accounts-table.html "25.12.8.1 The accounts Table") table has four rows, for the `user1`/`hosta`, `user1`/`hostb`, `user2`/`hosta`, and `user2`/`hostb` account values, each row counting one connection per account.

* The [`hosts`](performance-schema-hosts-table.html "25.12.8.2 The hosts Table") table has two rows, for `hosta` and `hostb`, each row counting two connections per host name.

* The [`users`](performance-schema-users-table.html "25.12.8.3 The users Table") table has two rows, for `user1` and `user2`, each row counting two connections per user name.

When a client connects, the Performance Schema determines which row in each connection table applies, using the tracking value appropriate to each table. If there is no such row, one is added. Then the Performance Schema increments by one the `CURRENT_CONNECTIONS` and `TOTAL_CONNECTIONS` columns in that row.

When a client disconnects, the Performance Schema decrements by one the `CURRENT_CONNECTIONS` column in the row and leaves the `TOTAL_CONNECTIONS` column unchanged.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is permitted for connection tables. It has these effects:

* Rows are removed for accounts, hosts, or users that have no current connections (rows with `CURRENT_CONNECTIONS = 0`).

* Nonremoved rows are reset to count only current connections: For rows with `CURRENT_CONNECTIONS > 0`, `TOTAL_CONNECTIONS` is reset to `CURRENT_CONNECTIONS`.

* Summary tables that depend on the connection table are implicitly truncated, as described later in this section.

The Performance Schema maintains summary tables that aggregate connection statistics for various event types by account, host, or user. These tables have `_summary_by_account`, `_summary_by_host`, or `_summary_by_user` in the name. To identify them, use this query:

```sql
mysql> SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = 'performance_schema'
       AND TABLE_NAME REGEXP '_summary_by_(account|host|user)'
       ORDER BY TABLE_NAME;
+------------------------------------------------------+
| TABLE_NAME                                           |
+------------------------------------------------------+
| events_stages_summary_by_account_by_event_name       |
| events_stages_summary_by_host_by_event_name          |
| events_stages_summary_by_user_by_event_name          |
| events_statements_summary_by_account_by_event_name   |
| events_statements_summary_by_host_by_event_name      |
| events_statements_summary_by_user_by_event_name      |
| events_transactions_summary_by_account_by_event_name |
| events_transactions_summary_by_host_by_event_name    |
| events_transactions_summary_by_user_by_event_name    |
| events_waits_summary_by_account_by_event_name        |
| events_waits_summary_by_host_by_event_name           |
| events_waits_summary_by_user_by_event_name           |
| memory_summary_by_account_by_event_name              |
| memory_summary_by_host_by_event_name                 |
| memory_summary_by_user_by_event_name                 |
+------------------------------------------------------+
```

For details about individual connection summary tables, consult the section that describes tables for the summarized event type:

* Wait event summaries: [Section 25.12.15.1, “Wait Event Summary Tables”](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables")

* Stage event summaries: [Section 25.12.15.2, “Stage Summary Tables”](performance-schema-stage-summary-tables.html "25.12.15.2 Stage Summary Tables")

* Statement event summaries: [Section 25.12.15.3, “Statement Summary Tables”](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables")

* Transaction event summaries: [Section 25.12.15.4, “Transaction Summary Tables”](performance-schema-transaction-summary-tables.html "25.12.15.4 Transaction Summary Tables")

* Memory event summaries: [Section 25.12.15.9, “Memory Summary Tables”](performance-schema-memory-summary-tables.html "25.12.15.9 Memory Summary Tables")

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is permitted for connection summary tables. It removes rows for accounts, hosts, or users with no connections, and resets the summary columns to zero for the remaining rows. In addition, each summary table that is aggregated by account, host, user, or thread is implicitly truncated by truncation of the connection table on which it depends. The following table describes the relationship between connection table truncation and implicitly truncated tables.

**Table 25.2 Implicit Effects of Connection Table Truncation**

<table summary="Which Performance Schema summary tables are implicity truncated by connection table truncation."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Truncated Connection Table</th> <th>Implicitly Truncated Summary Tables</th> </tr></thead><tbody><tr> <td><code class="literal">accounts</code></td> <td>Tables with names containing <code class="literal">_summary_by_account</code>, <code class="literal">_summary_by_thread</code></td> </tr><tr> <td><code class="literal">hosts</code></td> <td>Tables with names containing <code class="literal">_summary_by_account</code>, <code class="literal">_summary_by_host</code>, <code class="literal">_summary_by_thread</code></td> </tr><tr> <td><code class="literal">users</code></td> <td>Tables with names containing <code class="literal">_summary_by_account</code>, <code class="literal">_summary_by_user</code>, <code class="literal">_summary_by_thread</code></td> </tr></tbody></table>

Truncating a `_summary_global` summary table also implicitly truncates its corresponding connection and thread summary tables. For example, truncating [`events_waits_summary_global_by_event_name`](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables") implicitly truncates the wait event summary tables that are aggregated by account, host, user, or thread.
