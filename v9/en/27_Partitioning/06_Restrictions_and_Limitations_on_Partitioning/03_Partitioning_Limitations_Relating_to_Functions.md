### 26.6.3 Partitioning Limitations Relating to Functions

This section discusses limitations in MySQL Partitioning relating specifically to functions used in partitioning expressions.

Only the MySQL functions shown in the following list are allowed in partitioning expressions:

* `ABS()`
* `CEILING()` (see CEILING() and FLOOR() and FLOOR()"))

* `DATEDIFF()`
* `DAY()`
* `DAYOFMONTH()`
* `DAYOFWEEK()`
* `DAYOFYEAR()`
* `EXTRACT()` (see EXTRACT() function with WEEK specifier function with WEEK specifier"))

* `FLOOR()` (see CEILING() and FLOOR() and FLOOR()"))

* `HOUR()`
* `MICROSECOND()`
* `MINUTE()`
* `MOD()`
* `MONTH()`
* `QUARTER()`
* `SECOND()`
* `TIME_TO_SEC()`
* `TO_DAYS()`
* `TO_SECONDS()`
* `UNIX_TIMESTAMP()` (with `TIMESTAMP` columns)

* `WEEKDAY()`
* `YEAR()`
* `YEARWEEK()`

In MySQL 9.5, partition pruning is supported for the `TO_DAYS()`, `TO_SECONDS()`, `YEAR()`, and `UNIX_TIMESTAMP()` functions. See Section 26.4, “Partition Pruning”, for more information.

**CEILING() and FLOOR().** Each of these functions returns an integer only if it is passed an argument of an exact numeric type, such as one of the `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") types or `DECIMAL` - DECIMAL, NUMERIC"). This means, for example, that the following `CREATE TABLE` statement fails with an error, as shown here:

```
mysql> CREATE TABLE t (c FLOAT) PARTITION BY LIST( FLOOR(c) )(
    ->     PARTITION p0 VALUES IN (1,3,5),
    ->     PARTITION p1 VALUES IN (2,4,6)
    -> );
ERROR 1490 (HY000): The PARTITION function returns the wrong type
```

**EXTRACT() function with WEEK specifier.** The value returned by the `EXTRACT()` function, when used as `EXTRACT(WEEK FROM col)`, depends on the value of the `default_week_format` system variable. For this reason, `EXTRACT()` is not permitted as a partitioning function when it specifies the unit as `WEEK`. (Bug #54483)

See Section 14.6.2, “Mathematical Functions”, for more information about the return types of these functions, as well as Section 13.1, “Numeric Data Types”.
