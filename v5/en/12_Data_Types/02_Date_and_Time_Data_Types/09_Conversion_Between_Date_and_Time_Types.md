### 11.2.9 Conversion Between Date and Time Types

To some extent, you can convert a value from one temporal type
to another. However, there may be some alteration of the value
or loss of information. In all cases, conversion between
temporal types is subject to the range of valid values for the
resulting type. For example, although
[`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"),
[`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), and
[`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") values all can be
specified using the same set of formats, the types do not all
have the same range of values.
[`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") values cannot be
earlier than `1970` UTC or later than
`'2038-01-19 03:14:07'` UTC. This means that a
date such as `'1968-01-01'`, while valid as a
[`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") or
[`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") value, is not valid as a
[`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") value and is converted
to `0`.

Conversion of [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") values:

* Conversion to a [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") or
  [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") value adds a time
  part of `'00:00:00'` because the
  [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") value contains no time
  information.

* Conversion to a [`TIME`](time.html "11.2.3 The TIME Type") value is
  not useful; the result is `'00:00:00'`.

Conversion of [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") and
[`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") values:

* Conversion to a [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") value
  takes fractional seconds into account and rounds the time
  part. For example, `'1999-12-31
  23:59:59.499'` becomes
  `'1999-12-31'`, whereas
  `'1999-12-31 23:59:59.500'` becomes
  `'2000-01-01'`.

* Conversion to a [`TIME`](time.html "11.2.3 The TIME Type") value
  discards the date part because the
  [`TIME`](time.html "11.2.3 The TIME Type") type contains no date
  information.

For conversion of [`TIME`](time.html "11.2.3 The TIME Type") values to
other temporal types, the value of
[`CURRENT_DATE()`](date-and-time-functions.html#function_current-date) is used for the
date part. The [`TIME`](time.html "11.2.3 The TIME Type") is
interpreted as elapsed time (not time of day) and added to the
date. This means that the date part of the result differs from
the current date if the time value is outside the range from
`'00:00:00'` to `'23:59:59'`.

Suppose that the current date is
`'2012-01-01'`.
[`TIME`](time.html "11.2.3 The TIME Type") values of
`'12:00:00'`, `'24:00:00'`,
and `'-12:00:00'`, when converted to
[`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") or
[`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") values, result in
`'2012-01-01 12:00:00'`, `'2012-01-02
00:00:00'`, and `'2011-12-31
12:00:00'`, respectively.

Conversion of [`TIME`](time.html "11.2.3 The TIME Type") to
[`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") is similar but discards the
time part from the result: `'2012-01-01'`,
`'2012-01-02'`, and
`'2011-12-31'`, respectively.

Explicit conversion can be used to override implicit conversion.
For example, in comparison of
[`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") and
[`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") values, the
[`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") value is coerced to the
[`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") type by adding a time
part of `'00:00:00'`. To perform the comparison
by ignoring the time part of the
[`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") value instead, use the
[`CAST()`](cast-functions.html#function_cast) function in the following
way:

```sql
date_col = CAST(datetime_col AS DATE)
```

Conversion of [`TIME`](time.html "11.2.3 The TIME Type") and
[`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") values to numeric form
(for example, by adding `+0`) depends on
whether the value contains a fractional seconds part.
[`TIME(N)`](time.html "11.2.3 The TIME Type")
or
[`DATETIME(N)`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types")
is converted to integer when *`N`* is 0
(or omitted) and to a `DECIMAL` value with
*`N`* decimal digits when
*`N`* is greater than 0:

```sql
mysql> SELECT CURTIME(), CURTIME()+0, CURTIME(3)+0;
+-----------+-------------+--------------+
| CURTIME() | CURTIME()+0 | CURTIME(3)+0 |
+-----------+-------------+--------------+
| 09:28:00  |       92800 |    92800.887 |
+-----------+-------------+--------------+
mysql> SELECT NOW(), NOW()+0, NOW(3)+0;
+---------------------+----------------+--------------------+
| NOW()               | NOW()+0        | NOW(3)+0           |
+---------------------+----------------+--------------------+
| 2012-08-15 09:28:00 | 20120815092800 | 20120815092800.889 |
+---------------------+----------------+--------------------+
```