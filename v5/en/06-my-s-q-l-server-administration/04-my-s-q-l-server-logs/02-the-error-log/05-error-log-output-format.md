#### 5.4.2.5 Error Log Output Format

The ID included in error log messages is that of the thread within [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") responsible for writing the message. This indicates which part of the server produced the message, and is consistent with general query log and slow query log messages, which include the connection thread ID.

The [`log_timestamps`](server-system-variables.html#sysvar_log_timestamps) system variable controls the time zone of timestamps in messages written to the error log (as well as to general query log and slow query log files).

Permitted [`log_timestamps`](server-system-variables.html#sysvar_log_timestamps) values are `UTC` (the default) and `SYSTEM` (the local system time zone). Timestamps are written using ISO 8601 / RFC 3339 format: `YYYY-MM-DDThh:mm:ss.uuuuuu` plus a tail value of `Z` signifying Zulu time (UTC) or `±hh:mm` (an offset that indicates the local system time zone adjustment relative to UTC). For example:

```sql
2020-08-07T15:02:00.832521Z            (UTC)
2020-08-07T10:02:00.832521-05:00       (SYSTEM)
```
