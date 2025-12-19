--- title: MySQL 8.4 Reference Manual :: 14.20.5 Window Function Restrictions url: https://dev.mysql.com/doc/refman/8.4/en/window-function-restrictions.html order: 85 ---



### 14.20.5 Window Function Restrictions

The SQL standard imposes a constraint on window functions that they cannot be used in  `UPDATE` or `DELETE` statements to update rows. Using such functions in a subquery of these statements (to select rows) is permitted.

MySQL does not support these window function features:

* `DISTINCT` syntax for aggregate window functions.
* Nested window functions.
* Dynamic frame endpoints that depend on the value of the current row.

The parser recognizes these window constructs which nevertheless are not supported:

* The `GROUPS` frame units specifier is parsed, but produces an error. Only `ROWS` and `RANGE` are supported.
* The `EXCLUDE` clause for frame specification is parsed, but produces an error.
* `IGNORE NULLS` is parsed, but produces an error. Only `RESPECT NULLS` is supported.
* `FROM LAST` is parsed, but produces an error. Only `FROM FIRST` is supported.

A maximum of 127 windows is supported for a given `SELECT`. Note that a single query may use multiple `SELECT` clauses, and each of these clauses supports up to 127 windows. The number of distinct windows is defined as the sum of the named windows and any implicit windows specified as part of any window function's `OVER` clause. You should also be aware that queries using very large numbers of windows may require increasing the default thread stack size ( `thread_stack` system variable).


