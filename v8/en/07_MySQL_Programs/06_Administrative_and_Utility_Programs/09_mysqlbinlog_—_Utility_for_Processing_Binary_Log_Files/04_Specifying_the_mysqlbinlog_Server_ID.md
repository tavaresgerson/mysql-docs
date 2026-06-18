#### 6.6.9.4 Specifying the mysqlbinlog Server ID

When invoked with the `--read-from-remote-server`
option, [**mysqlbinlog**](mysqlbinlog.html "6.6.9 mysqlbinlog — Utility for Processing Binary Log Files") connects to a MySQL
server, specifies a server ID to identify itself, and requests
binary log files from the server. You can use
[**mysqlbinlog**](mysqlbinlog.html "6.6.9 mysqlbinlog — Utility for Processing Binary Log Files") to request log files from a
server in several ways:

* Specify an explicitly named set of files: For each file,
  [**mysqlbinlog**](mysqlbinlog.html "6.6.9 mysqlbinlog — Utility for Processing Binary Log Files") connects and issues a
  `Binlog dump` command. The server sends the
  file and disconnects. There is one connection per file.

* Specify the beginning file and
  [`--to-last-log`](mysqlbinlog.html#option_mysqlbinlog_to-last-log):
  [**mysqlbinlog**](mysqlbinlog.html "6.6.9 mysqlbinlog — Utility for Processing Binary Log Files") connects and issues a
  `Binlog dump` command for all files. The
  server sends all files and disconnects.

* Specify the beginning file and
  [`--stop-never`](mysqlbinlog.html#option_mysqlbinlog_stop-never) (which
  implies [`--to-last-log`](mysqlbinlog.html#option_mysqlbinlog_to-last-log)):
  [**mysqlbinlog**](mysqlbinlog.html "6.6.9 mysqlbinlog — Utility for Processing Binary Log Files") connects and issues a
  `Binlog dump` command for all files. The
  server sends all files, but does not disconnect after
  sending the last one.

With
[`--read-from-remote-server`](mysqlbinlog.html#option_mysqlbinlog_read-from-remote-server)
only, [**mysqlbinlog**](mysqlbinlog.html "6.6.9 mysqlbinlog — Utility for Processing Binary Log Files") connects using a server ID
of 0, which tells the server to disconnect after sending the
last requested log file.

With
[`--read-from-remote-server`](mysqlbinlog.html#option_mysqlbinlog_read-from-remote-server)
and [`--stop-never`](mysqlbinlog.html#option_mysqlbinlog_stop-never),
[**mysqlbinlog**](mysqlbinlog.html "6.6.9 mysqlbinlog — Utility for Processing Binary Log Files") connects using a nonzero server
ID, so the server does not disconnect after sending the last log
file. The server ID is 1 by default, but this can be changed
with [`--connection-server-id`](mysqlbinlog.html#option_mysqlbinlog_connection-server-id).

Thus, for the first two ways of requesting files, the server
disconnects because [**mysqlbinlog**](mysqlbinlog.html "6.6.9 mysqlbinlog — Utility for Processing Binary Log Files") specifies a
server ID of 0. It does not disconnect if
[`--stop-never`](mysqlbinlog.html#option_mysqlbinlog_stop-never) is given
because [**mysqlbinlog**](mysqlbinlog.html "6.6.9 mysqlbinlog — Utility for Processing Binary Log Files") specifies a nonzero
server ID.