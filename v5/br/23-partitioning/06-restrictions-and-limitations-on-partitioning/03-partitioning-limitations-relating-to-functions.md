### 22.6.3 Partitioning Limitations Relating to Functions

This section discusses limitations in MySQL Partitioning relating specifically to functions used in partitioning expressions.

Only the MySQL functions shown in the following list are allowed in partitioning expressions:

* [`ABS()`](mathematical-functions.html#function_abs)
* [`CEILING()`](mathematical-functions.html#function_ceiling) (see [CEILING() and FLOOR()](partitioning-limitations-functions.html#partitioning-limitations-ceiling-floor "CEILING() and FLOOR()"))

* [`DATEDIFF()`](date-and-time-functions.html#function_datediff)
* [`DAY()`](date-and-time-functions.html#function_day)
* [`DAYOFMONTH()`](date-and-time-functions.html#function_dayofmonth)
* [`DAYOFWEEK()`](date-and-time-functions.html#function_dayofweek)
* [`DAYOFYEAR()`](date-and-time-functions.html#function_dayofyear)
* [`EXTRACT()`](date-and-time-functions.html#function_extract) (see [EXTRACT() function with WEEK specifier](partitioning-limitations-functions.html#partitioning-limitations-extract "EXTRACT() function with WEEK specifier"))

* [`FLOOR()`](mathematical-functions.html#function_floor) (see [CEILING() and FLOOR()](partitioning-limitations-functions.html#partitioning-limitations-ceiling-floor "CEILING() and FLOOR()"))

* [`HOUR()`](date-and-time-functions.html#function_hour)
* [`MICROSECOND()`](date-and-time-functions.html#function_microsecond)
* [`MINUTE()`](date-and-time-functions.html#function_minute)
* [`MOD()`](mathematical-functions.html#function_mod)
* [`MONTH()`](date-and-time-functions.html#function_month)
* [`QUARTER()`](date-and-time-functions.html#function_quarter)
* [`SECOND()`](date-and-time-functions.html#function_second)
* [`TIME_TO_SEC()`](date-and-time-functions.html#function_time-to-sec)
* [`TO_DAYS()`](date-and-time-functions.html#function_to-days)
* [`TO_SECONDS()`](date-and-time-functions.html#function_to-seconds)
* [`UNIX_TIMESTAMP()`](date-and-time-functions.html#function_unix-timestamp) (with [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") columns)

* [`WEEKDAY()`](date-and-time-functions.html#function_weekday)
* [`YEAR()`](date-and-time-functions.html#function_year)
* [`YEARWEEK()`](date-and-time-functions.html#function_yearweek)

In MySQL 5.7, partition pruning is supported for the [`TO_DAYS()`](date-and-time-functions.html#function_to-days), [`TO_SECONDS()`](date-and-time-functions.html#function_to-seconds), [`YEAR()`](date-and-time-functions.html#function_year), and [`UNIX_TIMESTAMP()`](date-and-time-functions.html#function_unix-timestamp) functions. See [Section 22.4, “Partition Pruning”](partitioning-pruning.html "22.4 Partition Pruning"), for more information.

**CEILING() and FLOOR().** Each of these functions returns an integer only if it is passed an argument of an exact numeric type, such as one of the [`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") types or [`DECIMAL`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC"). This means, for example, that the following [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement fails with an error, as shown here:

```sql
mysql> CREATE TABLE t (c FLOAT) PARTITION BY LIST( FLOOR(c) )(
    ->     PARTITION p0 VALUES IN (1,3,5),
    ->     PARTITION p1 VALUES IN (2,4,6)
    -> );
ERROR 1490 (HY000): The PARTITION function returns the wrong type
```

**EXTRACT() function with WEEK specifier.** The value returned by the [`EXTRACT()`](date-and-time-functions.html#function_extract) function, when used as [`EXTRACT(WEEK FROM col)`](date-and-time-functions.html#function_extract), depends on the value of the [`default_week_format`](server-system-variables.html#sysvar_default_week_format) system variable. For this reason, [`EXTRACT()`](date-and-time-functions.html#function_extract) is not permitted as a partitioning function when it specifies the unit as `WEEK`. (Bug #54483)

See [Section 12.6.2, “Mathematical Functions”](mathematical-functions.html "12.6.2 Mathematical Functions"), for more information about the return types of these functions, as well as [Section 11.1, “Numeric Data Types”](numeric-types.html "11.1 Numeric Data Types").
