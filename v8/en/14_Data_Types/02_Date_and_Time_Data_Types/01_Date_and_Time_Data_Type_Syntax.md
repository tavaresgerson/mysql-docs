### 13.2.1 Date and Time Data Type Syntax

The date and time data types for representing temporal values
are [`DATE`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types"),
[`TIME`](time.html "13.2.3 The TIME Type"),
[`DATETIME`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types"),
[`TIMESTAMP`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types"), and
[`YEAR`](year.html "13.2.4 The YEAR Type").

For the [`DATE`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types") and
[`DATETIME`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types") range descriptions,
“supported” means that although earlier values
might work, there is no guarantee.

MySQL permits fractional seconds for
[`TIME`](time.html "13.2.3 The TIME Type"),
[`DATETIME`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types"), and
[`TIMESTAMP`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types") values, with up to
microseconds (6 digits) precision. To define a column that
includes a fractional seconds part, use the syntax
`type_name(fsp)`,
where *`type_name`* is
[`TIME`](time.html "13.2.3 The TIME Type"),
[`DATETIME`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types"), or
[`TIMESTAMP`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types"), and
*`fsp`* is the fractional seconds
precision. For example:

```
CREATE TABLE t1 (t TIME(3), dt DATETIME(6), ts TIMESTAMP(0));
```

The *`fsp`* value, if given, must be in
the range 0 to 6. A value of 0 signifies that there is no
fractional part. If omitted, the default precision is 0. (This
differs from the standard SQL default of 6, for compatibility
with previous MySQL versions.)

Any [`TIMESTAMP`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types") or
[`DATETIME`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types") column in a table can
have automatic initialization and updating properties; see
[Section 13.2.5, “Automatic Initialization and Updating for TIMESTAMP and DATETIME”](timestamp-initialization.html "13.2.5 Automatic Initialization and Updating for TIMESTAMP and DATETIME").

* [`DATE`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types")

  A date. The supported range is
  `'1000-01-01'` to
  `'9999-12-31'`. MySQL displays
  [`DATE`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types") values in
  `'YYYY-MM-DD'`
  format, but permits assignment of values to
  [`DATE`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types") columns using either
  strings or numbers.

* [`DATETIME[(fsp)]`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types")

  A date and time combination. The supported range is
  `'1000-01-01 00:00:00.000000'` to
  `'9999-12-31 23:59:59.499999'`. MySQL
  displays [`DATETIME`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types") values in
  `'YYYY-MM-DD
  hh:mm:ss[.fraction]'`
  format, but permits assignment of values to
  [`DATETIME`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types") columns using either
  strings or numbers.

  An optional *`fsp`* value in the
  range from 0 to 6 may be given to specify fractional seconds
  precision. A value of 0 signifies that there is no
  fractional part. If omitted, the default precision is 0.

  Automatic initialization and updating to the current date
  and time for [`DATETIME`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types") columns
  can be specified using `DEFAULT` and
  `ON UPDATE` column definition clauses, as
  described in [Section 13.2.5, “Automatic Initialization and Updating for TIMESTAMP and DATETIME”](timestamp-initialization.html "13.2.5 Automatic Initialization and Updating for TIMESTAMP and DATETIME").

* [`TIMESTAMP[(fsp)]`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types")

  A timestamp. The range is `'1970-01-01
  00:00:01.000000'` UTC to `'2038-01-19
  03:14:07.499999'` UTC.
  [`TIMESTAMP`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types") values are stored
  as the number of seconds since the epoch
  (`'1970-01-01 00:00:00'` UTC). A
  [`TIMESTAMP`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types") cannot represent
  the value `'1970-01-01 00:00:00'` because
  that is equivalent to 0 seconds from the epoch and the value
  0 is reserved for representing `'0000-00-00
  00:00:00'`, the “zero”
  [`TIMESTAMP`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types") value.

  An optional *`fsp`* value in the
  range from 0 to 6 may be given to specify fractional seconds
  precision. A value of 0 signifies that there is no
  fractional part. If omitted, the default precision is 0.

  The way the server handles `TIMESTAMP`
  definitions depends on the value of the
  [`explicit_defaults_for_timestamp`](server-system-variables.html#sysvar_explicit_defaults_for_timestamp)
  system variable (see
  [Section 7.1.8, “Server System Variables”](server-system-variables.html "7.1.8 Server System Variables")).

  If
  [`explicit_defaults_for_timestamp`](server-system-variables.html#sysvar_explicit_defaults_for_timestamp)
  is enabled, there is no automatic assignment of the
  `DEFAULT CURRENT_TIMESTAMP` or `ON
  UPDATE CURRENT_TIMESTAMP` attributes to any
  [`TIMESTAMP`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types") column. They must
  be included explicitly in the column definition. Also, any
  [`TIMESTAMP`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types") not explicitly
  declared as `NOT NULL` permits
  `NULL` values.

  If
  [`explicit_defaults_for_timestamp`](server-system-variables.html#sysvar_explicit_defaults_for_timestamp)
  is disabled, the server handles `TIMESTAMP`
  as follows:

  Unless specified otherwise, the first
  [`TIMESTAMP`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types") column in a table
  is defined to be automatically set to the date and time of
  the most recent modification if not explicitly assigned a
  value. This makes [`TIMESTAMP`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types")
  useful for recording the timestamp of an
  [`INSERT`](insert.html "15.2.7 INSERT Statement") or
  [`UPDATE`](update.html "15.2.17 UPDATE Statement") operation. You can
  also set any [`TIMESTAMP`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types") column
  to the current date and time by assigning it a
  `NULL` value, unless it has been defined
  with the `NULL` attribute to permit
  `NULL` values.

  Automatic initialization and updating to the current date
  and time can be specified using `DEFAULT
  CURRENT_TIMESTAMP` and `ON UPDATE
  CURRENT_TIMESTAMP` column definition clauses. By
  default, the first [`TIMESTAMP`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types")
  column has these properties, as previously noted. However,
  any [`TIMESTAMP`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types") column in a
  table can be defined to have these properties.

* [`TIME[(fsp)]`](time.html "13.2.3 The TIME Type")

  A time. The range is `'-838:59:59.000000'`
  to `'838:59:59.000000'`. MySQL displays
  [`TIME`](time.html "13.2.3 The TIME Type") values in
  `'hh:mm:ss[.fraction]'`
  format, but permits assignment of values to
  [`TIME`](time.html "13.2.3 The TIME Type") columns using either
  strings or numbers.

  An optional *`fsp`* value in the
  range from 0 to 6 may be given to specify fractional seconds
  precision. A value of 0 signifies that there is no
  fractional part. If omitted, the default precision is 0.

* [`YEAR[(4)]`](year.html "13.2.4 The YEAR Type")

  A year in 4-digit format. MySQL displays
  [`YEAR`](year.html "13.2.4 The YEAR Type") values in
  *`YYYY`* format, but permits
  assignment of values to [`YEAR`](year.html "13.2.4 The YEAR Type")
  columns using either strings or numbers. Values display as
  `1901` to `2155`, or
  `0000`.

  For additional information about
  [`YEAR`](year.html "13.2.4 The YEAR Type") display format and
  interpretation of input values, see [Section 13.2.4, “The YEAR Type”](year.html "13.2.4 The YEAR Type").

  Note

  As of MySQL 8.0.19, the
  [`YEAR(4)`](year.html "13.2.4 The YEAR Type") data type with an
  explicit display width is deprecated; you should expect
  support for it to be removed in a future version of MySQL.
  Instead, use [`YEAR`](year.html "13.2.4 The YEAR Type") without a
  display width, which has the same meaning.

  MySQL 8.0 does not support the 2-digit
  [`YEAR(2)`](year.html "13.2.4 The YEAR Type") data type permitted
  in older versions of MySQL. For instructions on converting
  to 4-digit [`YEAR`](year.html "13.2.4 The YEAR Type"), see
  [2-Digit YEAR(2) Limitations and Migrating to 4-Digit YEAR](/doc/refman/5.7/en/migrating-from-year2.html), in
  [MySQL 5.7 Reference Manual](/doc/refman/5.7/en/).

The [`SUM()`](aggregate-functions.html#function_sum) and
[`AVG()`](aggregate-functions.html#function_avg) aggregate functions do not
work with temporal values. (They convert the values to numbers,
losing everything after the first nonnumeric character.) To work
around this problem, convert to numeric units, perform the
aggregate operation, and convert back to a temporal value.
Examples:

```
SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(time_col))) FROM tbl_name;
SELECT FROM_DAYS(SUM(TO_DAYS(date_col))) FROM tbl_name;
```