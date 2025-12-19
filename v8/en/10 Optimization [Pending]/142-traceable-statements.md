--- title: MySQL 8.4 Reference Manual :: 10.15.3 Traceable Statements url: https://dev.mysql.com/doc/refman/8.4/en/traceable-statements.html order: 142 ---



### 10.15.3 Traceable Statements

Statements which are traceable are listed here:

*  `SELECT`
*  `INSERT`
*  `REPLACE`
*  `UPDATE`
*  `DELETE`
*  `EXPLAIN` with any of the preceding statements
*  `SET`
*  `DO`
*  `DECLARE`, `CASE`, `IF`, and `RETURN` as used in stored routines
*  `CALL`

Tracing is supported for both `INSERT` and `REPLACE` statements using `VALUES`, `VALUES ROW`, or `SELECT`.

Traces of multi-table `UPDATE` and `DELETE` statements are supported.

Tracing of `SET optimizer_trace` is not supported.

For statements which are prepared and executed in separate steps, preparation and execution are traced separately.


