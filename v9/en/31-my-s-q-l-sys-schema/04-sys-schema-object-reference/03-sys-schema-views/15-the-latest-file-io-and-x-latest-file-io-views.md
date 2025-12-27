#### 30.4.3.15 The latest\_file\_io and x$latest\_file\_io Views

These views summarize file I/O activity, grouped by file and thread. By default, rows are sorted with most recent I/O first.

The `latest_file_io` and `x$latest_file_io` views have these columns:

* `thread`

  For foreground threads, the account associated with the thread (and port number for TCP/IP connections). For background threads, the thread name and thread ID

* `file`

  The file path name.

* `latency`

  The wait time of the file I/O event.

* `operation`

  The type of operation.

* `requested`

  The number of data bytes requested for the file I/O event.
