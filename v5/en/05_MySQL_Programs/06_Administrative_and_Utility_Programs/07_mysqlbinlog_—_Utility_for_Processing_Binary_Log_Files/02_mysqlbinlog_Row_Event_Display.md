#### 4.6.7.2 mysqlbinlog Row Event Display

The following examples illustrate how
[**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") displays row events that specify
data modifications. These correspond to events with the
`WRITE_ROWS_EVENT`,
`UPDATE_ROWS_EVENT`, and
`DELETE_ROWS_EVENT` type codes. The
[`--base64-output=DECODE-ROWS`](mysqlbinlog.html#option_mysqlbinlog_base64-output)
and [`--verbose`](mysqlbinlog.html#option_mysqlbinlog_verbose) options may be
used to affect row event output.

Suppose that the server is using row-based binary logging and
that you execute the following sequence of statements:

```sql
CREATE TABLE t
(
  id   INT NOT NULL,
  name VARCHAR(20) NOT NULL,
  date DATE NULL
) ENGINE = InnoDB;

START TRANSACTION;
INSERT INTO t VALUES(1, 'apple', NULL);
UPDATE t SET name = 'pear', date = '2009-01-01' WHERE id = 1;
DELETE FROM t WHERE id = 1;
COMMIT;
```

By default, [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") displays row events
encoded as base-64 strings using
[`BINLOG`](binlog.html "13.7.6.1 BINLOG Statement") statements. Omitting
extraneous lines, the output for the row events produced by the
preceding statement sequence looks like this:

```sql
$> mysqlbinlog log_file
...
# at 218
#080828 15:03:08 server id 1  end_log_pos 258   Write_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAANoAAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBcBAAAAKAAAAAIBAAAQABEAAAAAAAEAA//8AQAAAAVhcHBsZQ==
'/*!*/;
...
# at 302
#080828 15:03:08 server id 1  end_log_pos 356   Update_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAC4BAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBgBAAAANgAAAGQBAAAQABEAAAAAAAEAA////AEAAAAFYXBwbGX4AQAAAARwZWFyIbIP
'/*!*/;
...
# at 400
#080828 15:03:08 server id 1  end_log_pos 442   Delete_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAJABAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBkBAAAAKgAAALoBAAAQABEAAAAAAAEAA//4AQAAAARwZWFyIbIP
'/*!*/;
```

To see the row events as comments in the form of
“pseudo-SQL” statements, run
[**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") with the
[`--verbose`](mysqlbinlog.html#option_mysqlbinlog_verbose) or
`-v` option. The output contains lines beginning
with `###`:

```sql
$> mysqlbinlog -v log_file
...
# at 218
#080828 15:03:08 server id 1  end_log_pos 258   Write_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAANoAAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBcBAAAAKAAAAAIBAAAQABEAAAAAAAEAA//8AQAAAAVhcHBsZQ==
'/*!*/;
### INSERT INTO test.t
### SET
###   @1=1
###   @2='apple'
###   @3=NULL
...
# at 302
#080828 15:03:08 server id 1  end_log_pos 356   Update_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAC4BAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBgBAAAANgAAAGQBAAAQABEAAAAAAAEAA////AEAAAAFYXBwbGX4AQAAAARwZWFyIbIP
'/*!*/;
### UPDATE test.t
### WHERE
###   @1=1
###   @2='apple'
###   @3=NULL
### SET
###   @1=1
###   @2='pear'
###   @3='2009:01:01'
...
# at 400
#080828 15:03:08 server id 1  end_log_pos 442   Delete_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAJABAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBkBAAAAKgAAALoBAAAQABEAAAAAAAEAA//4AQAAAARwZWFyIbIP
'/*!*/;
### DELETE FROM test.t
### WHERE
###   @1=1
###   @2='pear'
###   @3='2009:01:01'
```

Specify [`--verbose`](mysqlbinlog.html#option_mysqlbinlog_verbose) or
`-v` twice to also display data types and some
metadata for each column. The output contains an additional
comment following each column change:

```sql
$> mysqlbinlog -vv log_file
...
# at 218
#080828 15:03:08 server id 1  end_log_pos 258   Write_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAANoAAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBcBAAAAKAAAAAIBAAAQABEAAAAAAAEAA//8AQAAAAVhcHBsZQ==
'/*!*/;
### INSERT INTO test.t
### SET
###   @1=1 /* INT meta=0 nullable=0 is_null=0 */
###   @2='apple' /* VARSTRING(20) meta=20 nullable=0 is_null=0 */
###   @3=NULL /* VARSTRING(20) meta=0 nullable=1 is_null=1 */
...
# at 302
#080828 15:03:08 server id 1  end_log_pos 356   Update_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAC4BAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBgBAAAANgAAAGQBAAAQABEAAAAAAAEAA////AEAAAAFYXBwbGX4AQAAAARwZWFyIbIP
'/*!*/;
### UPDATE test.t
### WHERE
###   @1=1 /* INT meta=0 nullable=0 is_null=0 */
###   @2='apple' /* VARSTRING(20) meta=20 nullable=0 is_null=0 */
###   @3=NULL /* VARSTRING(20) meta=0 nullable=1 is_null=1 */
### SET
###   @1=1 /* INT meta=0 nullable=0 is_null=0 */
###   @2='pear' /* VARSTRING(20) meta=20 nullable=0 is_null=0 */
###   @3='2009:01:01' /* DATE meta=0 nullable=1 is_null=0 */
...
# at 400
#080828 15:03:08 server id 1  end_log_pos 442   Delete_rows: table id 17 flags: STMT_END_F

BINLOG '
fAS3SBMBAAAALAAAAJABAAAAABEAAAAAAAAABHRlc3QAAXQAAwMPCgIUAAQ=
fAS3SBkBAAAAKgAAALoBAAAQABEAAAAAAAEAA//4AQAAAARwZWFyIbIP
'/*!*/;
### DELETE FROM test.t
### WHERE
###   @1=1 /* INT meta=0 nullable=0 is_null=0 */
###   @2='pear' /* VARSTRING(20) meta=20 nullable=0 is_null=0 */
###   @3='2009:01:01' /* DATE meta=0 nullable=1 is_null=0 */
```

You can tell [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") to suppress the
[`BINLOG`](binlog.html "13.7.6.1 BINLOG Statement") statements for row events
by using the
[`--base64-output=DECODE-ROWS`](mysqlbinlog.html#option_mysqlbinlog_base64-output)
option. This is similar to
[`--base64-output=NEVER`](mysqlbinlog.html#option_mysqlbinlog_base64-output) but
does not exit with an error if a row event is found. The
combination of
[`--base64-output=DECODE-ROWS`](mysqlbinlog.html#option_mysqlbinlog_base64-output)
and [`--verbose`](mysqlbinlog.html#option_mysqlbinlog_verbose) provides a
convenient way to see row events only as SQL statements:

```sql
$> mysqlbinlog -v --base64-output=DECODE-ROWS log_file
...
# at 218
#080828 15:03:08 server id 1  end_log_pos 258   Write_rows: table id 17 flags: STMT_END_F
### INSERT INTO test.t
### SET
###   @1=1
###   @2='apple'
###   @3=NULL
...
# at 302
#080828 15:03:08 server id 1  end_log_pos 356   Update_rows: table id 17 flags: STMT_END_F
### UPDATE test.t
### WHERE
###   @1=1
###   @2='apple'
###   @3=NULL
### SET
###   @1=1
###   @2='pear'
###   @3='2009:01:01'
...
# at 400
#080828 15:03:08 server id 1  end_log_pos 442   Delete_rows: table id 17 flags: STMT_END_F
### DELETE FROM test.t
### WHERE
###   @1=1
###   @2='pear'
###   @3='2009:01:01'
```

Note

You should not suppress [`BINLOG`](binlog.html "13.7.6.1 BINLOG Statement")
statements if you intend to re-execute
[**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") output.

The SQL statements produced by
[`--verbose`](mysqlbinlog.html#option_mysqlbinlog_verbose) for row events are
much more readable than the corresponding
[`BINLOG`](binlog.html "13.7.6.1 BINLOG Statement") statements. However, they
do not correspond exactly to the original SQL statements that
generated the events. The following limitations apply:

* The original column names are lost and replaced by
  `@N`, where
  *`N`* is a column number.

* Character set information is not available in the binary
  log, which affects string column display:

  + There is no distinction made between corresponding
    binary and nonbinary string types
    ([`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") and
    [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"),
    [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") and
    [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"),
    [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") and
    [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types")). The output uses a
    data type of `STRING` for fixed-length
    strings and `VARSTRING` for
    variable-length strings.

  + For multibyte character sets, the maximum number of
    bytes per character is not present in the binary log, so
    the length for string types is displayed in bytes rather
    than in characters. For example,
    `STRING(4)` is used as the data type
    for values from either of these column types:

    ```sql
    CHAR(4) CHARACTER SET latin1
    CHAR(2) CHARACTER SET ucs2
    ```

  + Due to the storage format for events of type
    `UPDATE_ROWS_EVENT`,
    [`UPDATE`](update.html "13.2.11 UPDATE Statement") statements are
    displayed with the `WHERE` clause
    preceding the `SET` clause.

Proper interpretation of row events requires the information
from the format description event at the beginning of the binary
log. Because [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") does not know in
advance whether the rest of the log contains row events, by
default it displays the format description event using a
[`BINLOG`](binlog.html "13.7.6.1 BINLOG Statement") statement in the initial
part of the output.

If the binary log is known not to contain any events requiring a
[`BINLOG`](binlog.html "13.7.6.1 BINLOG Statement") statement (that is, no row
events), the
[`--base64-output=NEVER`](mysqlbinlog.html#option_mysqlbinlog_base64-output) option
can be used to prevent this header from being written.