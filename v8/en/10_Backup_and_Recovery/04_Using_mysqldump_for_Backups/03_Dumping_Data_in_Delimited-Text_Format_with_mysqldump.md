### 9.4.3 Dumping Data in Delimited-Text Format with mysqldump

This section describes how to use [**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program")
to create delimited-text dump files. For information about
reloading such dump files, see
[Section 9.4.4, “Reloading Delimited-Text Format Backups”](reloading-delimited-text-dumps.html "9.4.4 Reloading Delimited-Text Format Backups").

If you invoke [**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") with the
[`--tab=dir_name`](mysqldump.html#option_mysqldump_tab)
option, it uses *`dir_name`* as the
output directory and dumps tables individually in that directory
using two files for each table. The table name is the base name
for these files. For a table named `t1`, the
files are named `t1.sql` and
`t1.txt`. The `.sql` file
contains a [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") statement
for the table. The `.txt` file contains the
table data, one line per table row.

The following command dumps the contents of the
`db1` database to files in the
`/tmp` database:

```
$> mysqldump --tab=/tmp db1
```

The `.txt` files containing table data are
written by the server, so they are owned by the system account
used for running the server. The server uses
[`SELECT ... INTO
OUTFILE`](select-into.html "15.2.13.1 SELECT ... INTO Statement") to write the files, so you must have the
[`FILE`](privileges-provided.html#priv_file) privilege to perform this
operation, and an error occurs if a given
`.txt` file already exists.

The server sends the `CREATE` definitions for
dumped tables to [**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program"), which writes them
to `.sql` files. These files therefore are
owned by the user who executes [**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program").

It is best that [`--tab`](mysqldump.html#option_mysqldump_tab) be used
only for dumping a local server. If you use it with a remote
server, the [`--tab`](mysqldump.html#option_mysqldump_tab) directory
must exist on both the local and remote hosts, and the
`.txt` files are written by the server in the
remote directory (on the server host), whereas the
`.sql` files are written by
[**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") in the local directory (on the
client host).

For [**mysqldump --tab**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program"), the server by default
writes table data to `.txt` files one line
per row with tabs between column values, no quotation marks
around column values, and newline as the line terminator. (These
are the same defaults as for
[`SELECT ... INTO
OUTFILE`](select-into.html "15.2.13.1 SELECT ... INTO Statement").)

To enable data files to be written using a different format,
[**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") supports these options:

* [`--fields-terminated-by=str`](mysqldump.html#option_mysqldump_fields)

  The string for separating column values (default: tab).

* [`--fields-enclosed-by=char`](mysqldump.html#option_mysqldump_fields)

  The character within which to enclose column values
  (default: no character).

* [`--fields-optionally-enclosed-by=char`](mysqldump.html#option_mysqldump_fields)

  The character within which to enclose non-numeric column
  values (default: no character).

* [`--fields-escaped-by=char`](mysqldump.html#option_mysqldump_fields)

  The character for escaping special characters (default: no
  escaping).

* [`--lines-terminated-by=str`](mysqldump.html#option_mysqldump_lines-terminated-by)

  The line-termination string (default: newline).

Depending on the value you specify for any of these options, it
might be necessary on the command line to quote or escape the
value appropriately for your command interpreter. Alternatively,
specify the value using hex notation. Suppose that you want
[**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") to quote column values within
double quotation marks. To do so, specify double quote as the
value for the
[`--fields-enclosed-by`](mysqldump.html#option_mysqldump_fields)
option. But this character is often special to command
interpreters and must be treated specially. For example, on
Unix, you can quote the double quote like this:

```
--fields-enclosed-by='"'
```

On any platform, you can specify the value in hex:

```
--fields-enclosed-by=0x22
```

It is common to use several of the data-formatting options
together. For example, to dump tables in comma-separated values
format with lines terminated by carriage-return/newline pairs
(`\r\n`), use this command (enter it on a
single line):

```
$> mysqldump --tab=/tmp --fields-terminated-by=,
         --fields-enclosed-by='"' --lines-terminated-by=0x0d0a db1
```

Should you use any of the data-formatting options to dump table
data, you need to specify the same format when you reload data
files later, to ensure proper interpretation of the file
contents.