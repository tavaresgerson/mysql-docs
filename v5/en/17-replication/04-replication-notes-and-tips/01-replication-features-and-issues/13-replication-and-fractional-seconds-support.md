#### 16.4.1.13 Replication and Fractional Seconds Support

MySQL 5.7 permits fractional seconds for [`TIME`](time.html "11.2.3 The TIME Type"), [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), and [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") values, with up to microseconds (6 digits) precision. See [Section 11.2.7, “Fractional Seconds in Time Values”](fractional-seconds.html "11.2.7 Fractional Seconds in Time Values").

There may be problems replicating from a source server that understands fractional seconds to an older replica (MySQL 5.6.3 and earlier) that does not:

* For [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statements containing columns that have an *`fsp`* (fractional seconds precision) value greater than 0, replication fails due to parser errors.

* Statements that use temporal data types with an *`fsp`* value of 0 work with statement-based logging but not row-based logging. In the latter case, the data types have binary formats and type codes on the source that differ from those on the replica.

* Some expression results differ on source and replica. Examples: On the source, the `timestamp` system variable returns a value that includes a microseconds fractional part; on the replica, it returns an integer. On the source, functions that return a result that includes the current time (such as [`CURTIME()`](date-and-time-functions.html#function_curtime), [`SYSDATE()`](date-and-time-functions.html#function_sysdate), or [`UTC_TIMESTAMP()`](date-and-time-functions.html#function_utc-timestamp)) interpret an argument as an *`fsp`* value and the return value includes a fractional seconds part of that many digits. On the replica, these functions permit an argument but ignore it.
