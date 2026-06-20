### 30.4.3 sys Schema Views

The following sections describe
[`sys`](sys-schema.html "Chapter 30 MySQL sys Schema") schema views.

The `sys` schema contains many views that
summarize Performance Schema tables in various ways. Most of
these views come in pairs, such that one member of the pair has
the same name as the other member, plus a `x$`
prefix. For example, the
[`host_summary_by_file_io`](sys-host-summary-by-file-io.html "30.4.3.2 The host_summary_by_file_io and x$host_summary_by_file_io Views") view
summarizes file I/O grouped by host and displays latencies
converted from picoseconds to more readable values (with units);

```
mysql> SELECT * FROM sys.host_summary_by_file_io;
+------------+-------+------------+
| host       | ios   | io_latency |
+------------+-------+------------+
| localhost  | 67570 | 5.38 s     |
| background |  3468 | 4.18 s     |
+------------+-------+------------+
```

The [`x$host_summary_by_file_io`](sys-host-summary-by-file-io.html "30.4.3.2 The host_summary_by_file_io and x$host_summary_by_file_io Views") view
summarizes the same data but displays unformatted picosecond
latencies:

```
mysql> SELECT * FROM sys.x$host_summary_by_file_io;
+------------+-------+---------------+
| host       | ios   | io_latency    |
+------------+-------+---------------+
| localhost  | 67574 | 5380678125144 |
| background |  3474 | 4758696829416 |
+------------+-------+---------------+
```

The view without the `x$` prefix is intended to
provide output that is more user friendly and easier to read.
The view with the `x$` prefix that displays the
same values in raw form is intended more for use with other
tools that perform their own processing on the data.

Views without the `x$` prefix differ from the
corresponding `x$` views in these ways:

* Byte counts are formatted with size units using
  [`format_bytes()`](sys-format-bytes.html "30.4.5.3 The format_bytes() Function").

* Time values are formatted with temporal units using
  [`format_time()`](sys-format-time.html "30.4.5.6 The format_time() Function").

* SQL statements are truncated to a maximum display width
  using [`format_statement()`](sys-format-statement.html "30.4.5.5 The format_statement() Function").

* Path name are shortened using
  [`format_path()`](sys-format-path.html "30.4.5.4 The format_path() Function").