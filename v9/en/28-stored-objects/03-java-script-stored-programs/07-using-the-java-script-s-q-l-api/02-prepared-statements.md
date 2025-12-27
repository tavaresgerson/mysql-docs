#### 27.3.7.2 Prepared Statements

The prepared statement API allows supported SQL statements (see SQL Syntax Permitted in Prepared Statements) to be re-executed without incurring the cost of parsing and optimization each time.

Prepared statements support parametrization. The question mark or interrogation point (`?`) is used as a parameter marker; parameters are updated (bound to values) beforehand, each time the statement is executed, using `PreparedStatement.bind()`. See the description of this method for more information.

To free up resources taken up by parsed query and statement parameters, call `PreparedStatement.deallocate()`, which closes the prepared statement and frees its resources. Omitting deallocation does not produce an error but memory consumed during stored procedure execution is otherwise not freed until routine execution has finished. Once a prepared statement has been closed (deallocated), it is no longer available for execution.

Execution flow for prepared statements consists of the following steps:

1. Prepare statement (`prepare()`)

2. Update parameters (`bind()`)

3. Execute statement (`execute()`)

4. Close statement (`deallocate()`)

Steps 2 and 3 can be repeated any number of times prior to closing the prepared statement.

The JavaScript stored procedure `jssp_prep1()`, shown here, accepts an arbitrary SQL statement containing two parameter markers, prepares the statement, then executes it twice, binding different values to the parameters each time, and printing the result to `stdout`:

```
CREATE PROCEDURE jssp_prep1(IN query VARCHAR(200))
LANGUAGE JAVASCRIPT AS $$

  function print_result(result) {
    console.log(result.getColumnNames())
    let row = result.fetchOne()

    while(row) {
      console.log(row.toArray())
      row = result.fetchOne()
    }
  }

  function fetch_warnings(result) {
    console.log("Number of warnings: " + result.getWarningsCount())

    for (var w in result.getWarnings()) {
      console.log(w.level + ", " + w.code + ", " + w.message)
     }
  }

  let stmt = session.prepare(query)

  stmt.bind(3, 4)
  let res1 = stmt.execute()
  print_result(res1)
  fetch_warnings(res1)

  stmt.bind(2, 3)
  let res2 = stmt.execute()
  print_result(res2)
  fetch_warnings(res2)

  stmt.bind(5)
  let res3 = stmt.execute()
  print_result(res3)
  fetch_warnings(res3)

  stmt.deallocate()
$$;
```

When finished with the prepared statement, we close it, freeing up any resources used in preparing and executing it, by calling `deallocate()`.

Calling `bind()` with fewer arguments than there are parameters in the statement is allowed after all parameters have been bound at least once. In this case, calling `stmt.bind(5)` after previously having called `stmt.bind(2,3)` is the same as calling `stmt.bind(5,3)`—the missing second value is reused from the previous invocation, as we can see here:

```
mysql> CALL jssp_prep1("
    ">   SELECT *
    ">   FROM t1
    ">   WHERE c1 = ? OR c1 = ?
    "> ");
Query OK, 0 rows affected (0.03 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state('stdout'): c1,c2,c3
3,37,peach
4,221,watermelon
Number of warnings: 0
c1,c2,c3
2,139,apple
3,37,peach
Number of warnings: 0
c1,c2,c3
3,37,peach
5,83,pear
Number of warnings: 0

1 row in set (0.00 sec)
```
