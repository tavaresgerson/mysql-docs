#### 25.12.15.4 Transaction Summary Tables

The Performance Schema maintains tables for collecting current and recent transaction events, and aggregates that information in summary tables. [Section 25.12.7, “Performance Schema Transaction Tables”](performance-schema-transaction-tables.html "25.12.7 Performance Schema Transaction Tables") describes the events on which transaction summaries are based. See that discussion for information about the content of transaction events, the current and historical transaction event tables, and how to control transaction event collection, which is disabled by default.

Example transaction event summary information:

```sql
mysql> SELECT *
       FROM performance_schema.events_transactions_summary_global_by_event_name
       LIMIT 1\G
*************************** 1. row ***************************
          EVENT_NAME: transaction
          COUNT_STAR: 5
      SUM_TIMER_WAIT: 19550092000
      MIN_TIMER_WAIT: 2954148000
      AVG_TIMER_WAIT: 3910018000
      MAX_TIMER_WAIT: 5486275000
    COUNT_READ_WRITE: 5
SUM_TIMER_READ_WRITE: 19550092000
MIN_TIMER_READ_WRITE: 2954148000
AVG_TIMER_READ_WRITE: 3910018000
MAX_TIMER_READ_WRITE: 5486275000
     COUNT_READ_ONLY: 0
 SUM_TIMER_READ_ONLY: 0
 MIN_TIMER_READ_ONLY: 0
 AVG_TIMER_READ_ONLY: 0
 MAX_TIMER_READ_ONLY: 0
```

Each transaction summary table has one or more grouping columns to indicate how the table aggregates events. Event names refer to names of event instruments in the [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") table:

* [`events_transactions_summary_by_account_by_event_name`](performance-schema-transaction-summary-tables.html "25.12.15.4 Transaction Summary Tables") has `USER`, `HOST`, and `EVENT_NAME` columns. Each row summarizes events for a given account (user and host combination) and event name.

* [`events_transactions_summary_by_host_by_event_name`](performance-schema-transaction-summary-tables.html "25.12.15.4 Transaction Summary Tables") has `HOST` and `EVENT_NAME` columns. Each row summarizes events for a given host and event name.

* [`events_transactions_summary_by_thread_by_event_name`](performance-schema-transaction-summary-tables.html "25.12.15.4 Transaction Summary Tables") has `THREAD_ID` and `EVENT_NAME` columns. Each row summarizes events for a given thread and event name.

* [`events_transactions_summary_by_user_by_event_name`](performance-schema-transaction-summary-tables.html "25.12.15.4 Transaction Summary Tables") has `USER` and `EVENT_NAME` columns. Each row summarizes events for a given user and event name.

* [`events_transactions_summary_global_by_event_name`](performance-schema-transaction-summary-tables.html "25.12.15.4 Transaction Summary Tables") has an `EVENT_NAME` column. Each row summarizes events for a given event name.

Each transaction summary table has these summary columns containing aggregated values:

* `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

  These columns are analogous to the columns of the same names in the wait event summary tables (see [Section 25.12.15.1, “Wait Event Summary Tables”](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables")), except that the transaction summary tables aggregate events from [`events_transactions_current`](performance-schema-events-transactions-current-table.html "25.12.7.1 The events_transactions_current Table") rather than [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table"). These columns summarize read-write and read-only transactions.

* `COUNT_READ_WRITE`, `SUM_TIMER_READ_WRITE`, `MIN_TIMER_READ_WRITE`, `AVG_TIMER_READ_WRITE`, `MAX_TIMER_READ_WRITE`

  These are similar to the `COUNT_STAR` and `xxx_TIMER_WAIT` columns, but summarize read-write transactions only. The transaction access mode specifies whether transactions operate in read/write or read-only mode.

* `COUNT_READ_ONLY`, `SUM_TIMER_READ_ONLY`, `MIN_TIMER_READ_ONLY`, `AVG_TIMER_READ_ONLY`, `MAX_TIMER_READ_ONLY`

  These are similar to the `COUNT_STAR` and `xxx_TIMER_WAIT` columns, but summarize read-only transactions only. The transaction access mode specifies whether transactions operate in read/write or read-only mode.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is permitted for transaction summary tables. It has these effects:

* For summary tables not aggregated by account, host, or user, truncation resets the summary columns to zero rather than removing rows.

* For summary tables aggregated by account, host, or user, truncation removes rows for accounts, hosts, or users with no connections, and resets the summary columns to zero for the remaining rows.

In addition, each transaction summary table that is aggregated by account, host, user, or thread is implicitly truncated by truncation of the connection table on which it depends, or truncation of [`events_transactions_summary_global_by_event_name`](performance-schema-transaction-summary-tables.html "25.12.15.4 Transaction Summary Tables"). For details, see [Section 25.12.8, “Performance Schema Connection Tables”](performance-schema-connection-tables.html "25.12.8 Performance Schema Connection Tables").

##### Transaction Aggregation Rules

Transaction event collection occurs without regard to isolation level, access mode, or autocommit mode.

Transaction event collection occurs for all non-aborted transactions initiated by the server, including empty transactions.

Read-write transactions are generally more resource intensive than read-only transactions, therefore transaction summary tables include separate aggregate columns for read-write and read-only transactions.

Resource requirements may also vary with transaction isolation level. However, presuming that only one isolation level would be used per server, aggregation by isolation level is not provided.
