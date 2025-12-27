#### 13.2.10.9 Subquery Errors

There are some errors that apply only to subqueries. This section describes them.

* Unsupported subquery syntax:

  ```sql
  ERROR 1235 (ER_NOT_SUPPORTED_YET)
  SQLSTATE = 42000
  Message = "This version of MySQL does not yet support
  'LIMIT & IN/ALL/ANY/SOME subquery'"
  ```

  This means that MySQL does not support statements of the following form:

  ```sql
  SELECT * FROM t1 WHERE s1 IN (SELECT s2 FROM t2 ORDER BY s1 LIMIT 1)
  ```

* Incorrect number of columns from subquery:

  ```sql
  ERROR 1241 (ER_OPERAND_COL)
  SQLSTATE = 21000
  Message = "Operand should contain 1 column(s)"
  ```

  This error occurs in cases like this:

  ```sql
  SELECT (SELECT column1, column2 FROM t2) FROM t1;
  ```

  You may use a subquery that returns multiple columns, if the purpose is row comparison. In other contexts, the subquery must be a scalar operand. See [Section 13.2.10.5, “Row Subqueries”](row-subqueries.html "13.2.10.5 Row Subqueries").

* Incorrect number of rows from subquery:

  ```sql
  ERROR 1242 (ER_SUBSELECT_NO_1_ROW)
  SQLSTATE = 21000
  Message = "Subquery returns more than 1 row"
  ```

  This error occurs for statements where the subquery must return at most one row but returns multiple rows. Consider the following example:

  ```sql
  SELECT * FROM t1 WHERE column1 = (SELECT column1 FROM t2);
  ```

  If `SELECT column1 FROM t2` returns just one row, the previous query works. If the subquery returns more than one row, error 1242 occurs. In that case, the query should be rewritten as:

  ```sql
  SELECT * FROM t1 WHERE column1 = ANY (SELECT column1 FROM t2);
  ```

* Incorrectly used table in subquery:

  ```sql
  Error 1093 (ER_UPDATE_TABLE_USED)
  SQLSTATE = HY000
  Message = "You can't specify target table 'x'
  for update in FROM clause"
  ```

  This error occurs in cases such as the following, which attempts to modify a table and select from the same table in the subquery:

  ```sql
  UPDATE t1 SET column2 = (SELECT MAX(column1) FROM t1);
  ```

  You can use a subquery for assignment within an [`UPDATE`](update.html "13.2.11 UPDATE Statement") statement because subqueries are legal in [`UPDATE`](update.html "13.2.11 UPDATE Statement") and [`DELETE`](delete.html "13.2.2 DELETE Statement") statements as well as in [`SELECT`](select.html "13.2.9 SELECT Statement") statements. However, you cannot use the same table (in this case, table `t1`) for both the subquery `FROM` clause and the update target.

For transactional storage engines, the failure of a subquery causes the entire statement to fail. For nontransactional storage engines, data modifications made before the error was encountered are preserved.
