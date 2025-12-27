### 26.4.3 sys Schema Views

26.4.3.1 The host\_summary and x$host\_summary Views

26.4.3.2 The host\_summary\_by\_file\_io and x$host\_summary\_by\_file\_io Views

26.4.3.3 The host\_summary\_by\_file\_io\_type and x$host\_summary\_by\_file\_io\_type Views

26.4.3.4 The host\_summary\_by\_stages and x$host\_summary\_by\_stages Views

26.4.3.5 The host\_summary\_by\_statement\_latency and x$host\_summary\_by\_statement\_latency Views

26.4.3.6 The host\_summary\_by\_statement\_type and x$host\_summary\_by\_statement\_type Views

26.4.3.7 The innodb\_buffer\_stats\_by\_schema and x$innodb\_buffer\_stats\_by\_schema Views

26.4.3.8 The innodb\_buffer\_stats\_by\_table and x$innodb\_buffer\_stats\_by\_table Views

26.4.3.9 The innodb\_lock\_waits and x$innodb\_lock\_waits Views

26.4.3.10 The io\_by\_thread\_by\_latency and x$io\_by\_thread\_by\_latency Views

26.4.3.11 The io\_global\_by\_file\_by\_bytes and x$io\_global\_by\_file\_by\_bytes Views

26.4.3.12 The io\_global\_by\_file\_by\_latency and x$io\_global\_by\_file\_by\_latency Views

26.4.3.13 The io\_global\_by\_wait\_by\_bytes and x$io\_global\_by\_wait\_by\_bytes Views

26.4.3.14 The io\_global\_by\_wait\_by\_latency and x$io\_global\_by\_wait\_by\_latency Views

26.4.3.15 The latest\_file\_io and x$latest\_file\_io Views

26.4.3.16 The memory\_by\_host\_by\_current\_bytes and x$memory\_by\_host\_by\_current\_bytes Views

26.4.3.17 The memory\_by\_thread\_by\_current\_bytes and x$memory\_by\_thread\_by\_current\_bytes Views

26.4.3.18 The memory\_by\_user\_by\_current\_bytes and x$memory\_by\_user\_by\_current\_bytes Views

26.4.3.19 The memory\_global\_by\_current\_bytes and x$memory\_global\_by\_current\_bytes Views

26.4.3.20 The memory\_global\_total and x$memory\_global\_total Views

26.4.3.21 The metrics View

26.4.3.22 The processlist and x$processlist Views

26.4.3.23 The ps\_check\_lost\_instrumentation View

26.4.3.24 The schema\_auto\_increment\_columns View

26.4.3.25 The schema\_index\_statistics and x$schema\_index\_statistics Views

26.4.3.26 The schema\_object\_overview View

26.4.3.27 The schema\_redundant\_indexes and x$schema\_flattened\_keys Views

26.4.3.28 The schema\_table\_lock\_waits and x$schema\_table\_lock\_waits Views

26.4.3.29 The schema\_table\_statistics and x$schema\_table\_statistics Views

26.4.3.30 The schema\_table\_statistics\_with\_buffer and x$schema\_table\_statistics\_with\_buffer Views

26.4.3.31 The schema\_tables\_with\_full\_table\_scans and x$schema\_tables\_with\_full\_table\_scans Views

26.4.3.32 The schema\_unused\_indexes View

26.4.3.33 The session and x$session Views

26.4.3.34 The session\_ssl\_status View

26.4.3.35 The statement\_analysis and x$statement\_analysis Views

26.4.3.36 The statements\_with\_errors\_or\_warnings and x$statements\_with\_errors\_or\_warnings Views

26.4.3.37 The statements\_with\_full\_table\_scans and x$statements\_with\_full\_table\_scans Views

26.4.3.38 The statements\_with\_runtimes\_in\_95th\_percentile and x$statements\_with\_runtimes\_in\_95th\_percentile Views

26.4.3.39 The statements\_with\_sorting and x$statements\_with\_sorting Views

26.4.3.40 The statements\_with\_temp\_tables and x$statements\_with\_temp\_tables Views

26.4.3.41 The user\_summary and x$user\_summary Views

26.4.3.42 The user\_summary\_by\_file\_io and x$user\_summary\_by\_file\_io Views

26.4.3.43 The user\_summary\_by\_file\_io\_type and x$user\_summary\_by\_file\_io\_type Views

26.4.3.44 The user\_summary\_by\_stages and x$user\_summary\_by\_stages Views

26.4.3.45 The user\_summary\_by\_statement\_latency and x$user\_summary\_by\_statement\_latency Views

26.4.3.46 The user\_summary\_by\_statement\_type and x$user\_summary\_by\_statement\_type Views

26.4.3.47 The version View

26.4.3.48 The wait\_classes\_global\_by\_avg\_latency and x$wait\_classes\_global\_by\_avg\_latency Views

26.4.3.49 The wait\_classes\_global\_by\_latency and x$wait\_classes\_global\_by\_latency Views

26.4.3.50 The waits\_by\_host\_by\_latency and x$waits\_by\_host\_by\_latency Views

26.4.3.51 The waits\_by\_user\_by\_latency and x$waits\_by\_user\_by\_latency Views

26.4.3.52 The waits\_global\_by\_latency and x$waits\_global\_by\_latency Views

The following sections describe `sys` schema views.

The `sys` schema contains many views that summarize Performance Schema tables in various ways. Most of these views come in pairs, such that one member of the pair has the same name as the other member, plus a `x$` prefix. For example, the `host_summary_by_file_io` view summarizes file I/O grouped by host and displays latencies converted from picoseconds to more readable values (with units);

```sql
mysql> SELECT * FROM sys.host_summary_by_file_io;
+------------+-------+------------+
| host       | ios   | io_latency |
+------------+-------+------------+
| localhost  | 67570 | 5.38 s     |
| background |  3468 | 4.18 s     |
+------------+-------+------------+
```

The `x$host_summary_by_file_io` view summarizes the same data but displays unformatted picosecond latencies:

```sql
mysql> SELECT * FROM sys.x$host_summary_by_file_io;
+------------+-------+---------------+
| host       | ios   | io_latency    |
+------------+-------+---------------+
| localhost  | 67574 | 5380678125144 |
| background |  3474 | 4758696829416 |
+------------+-------+---------------+
```

The view without the `x$` prefix is intended to provide output that is more user friendly and easier to read. The view with the `x$` prefix that displays the same values in raw form is intended more for use with other tools that perform their own processing on the data.

Views without the `x$` prefix differ from the corresponding `x$` views in these ways:

* Byte counts are formatted with size units using `format_bytes()` Function").

* Time values are formatted with temporal units using `format_time()` Function").

* SQL statements are truncated to a maximum display width using `format_statement()` Function").

* Path name are shortened using `format_path()` Function").
