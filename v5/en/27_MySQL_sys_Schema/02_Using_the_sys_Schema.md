## 26.2 Using the sys Schema

You can make the [`sys`](sys-schema.html "Chapter 26 MySQL sys Schema") schema the
default schema so that references to its objects need not be
qualified with the schema name:

```sql
mysql> USE sys;
Database changed
mysql> SELECT * FROM version;
+-------------+------------------+
| sys_version | mysql_version    |
+-------------+------------------+
| 1.5.1       | 5.7.24-debug-log |
+-------------+------------------+
```

(The [`version`](sys-version.html "26.4.3.47 The version View") view shows the
[`sys`](sys-schema.html "Chapter 26 MySQL sys Schema") schema and MySQL server
versions.)

To access [`sys`](sys-schema.html "Chapter 26 MySQL sys Schema") schema objects while a
different schema is the default (or simply to be explicit),
qualify object references with the schema name:

```sql
mysql> SELECT * FROM sys.version;
+-------------+------------------+
| sys_version | mysql_version    |
+-------------+------------------+
| 1.5.1       | 5.7.24-debug-log |
+-------------+------------------+
```

The `sys` schema contains many views that
summarize Performance Schema tables in various ways. Most of these
views come in pairs, such that one member of the pair has the same
name as the other member, plus a `x$` prefix. For
example, the [`host_summary_by_file_io`](sys-host-summary-by-file-io.html "26.4.3.2 The host_summary_by_file_io and x$host_summary_by_file_io Views")
view summarizes file I/O grouped by host and displays latencies
converted from picoseconds to more readable values (with units);

```sql
mysql> SELECT * FROM sys.host_summary_by_file_io;
+------------+-------+------------+
| host       | ios   | io_latency |
+------------+-------+------------+
| localhost  | 67570 | 5.38 s     |
| background |  3468 | 4.18 s     |
+------------+-------+------------+
```

The [`x$host_summary_by_file_io`](sys-host-summary-by-file-io.html "26.4.3.2 The host_summary_by_file_io and x$host_summary_by_file_io Views") view
summarizes the same data but displays unformatted picosecond
latencies:

```sql
mysql> SELECT * FROM sys.x$host_summary_by_file_io;
+------------+-------+---------------+
| host       | ios   | io_latency    |
+------------+-------+---------------+
| localhost  | 67574 | 5380678125144 |
| background |  3474 | 4758696829416 |
+------------+-------+---------------+
```

The view without the `x$` prefix is intended to
provide output that is more user friendly and easier for humans to
read. The view with the `x$` prefix that displays
the same values in raw form is intended more for use with other
tools that perform their own processing on the data. For
additional information about the differences between
non-`x$` and `x$` views, see
[Section 26.4.3, “sys Schema Views”](sys-schema-views.html "26.4.3 sys Schema Views").

To examine [`sys`](sys-schema.html "Chapter 26 MySQL sys Schema") schema object
definitions, use the appropriate
[`SHOW`](show.html "13.7.5 SHOW Statements") statement or
[`INFORMATION_SCHEMA`](information-schema.html "Chapter 24 INFORMATION_SCHEMA Tables") query. For
example, to examine the definitions of the
[`session`](sys-session.html "26.4.3.33 The session and x$session Views") view and
[`format_bytes()`](sys-format-bytes.html "26.4.5.3 The format_bytes() Function") function, use these
statements:

```sql
mysql> SHOW CREATE VIEW sys.session;
mysql> SHOW CREATE FUNCTION sys.format_bytes;
```

However, those statements display the definitions in relatively
unformatted form. To view object definitions with more readable
formatting, access the individual `.sql` files
found under the `scripts/sys_schema` in MySQL
source distributions. Prior to MySQL 5.7.28, the sources are
maintained in a separate distribution available from the
[`sys`](sys-schema.html "Chapter 26 MySQL sys Schema") schema development website at
<https://github.com/mysql/mysql-sys>.

Neither [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") nor
[**mysqlpump**](mysqlpump.html "4.5.6 mysqlpump — A Database Backup Program") dump the
[`sys`](sys-schema.html "Chapter 26 MySQL sys Schema") schema by default. To generate a
dump file, name the [`sys`](sys-schema.html "Chapter 26 MySQL sys Schema") schema
explicitly on the command line using either of these commands:

```sql
mysqldump --databases --routines sys > sys_dump.sql
mysqlpump sys > sys_dump.sql
```

To reinstall the schema from the dump file, use this command:

```sql
mysql < sys_dump.sql
```