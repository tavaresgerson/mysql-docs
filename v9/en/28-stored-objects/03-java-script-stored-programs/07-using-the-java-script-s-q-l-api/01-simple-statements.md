#### 27.3.7.1 Simple Statements

A simple statement returns a result set which can be used to access data (rows), metadata, and diagnostic information.

A simple statement is static, and cannot be modified after creation; in other words, it cannot be parametrized. A simple statement containing one or more `?` parameter markers raises an error. See Section 27.3.7.2, “Prepared Statements”, for information about prepared statements, which allow arbitrary values for parameters to be specified at execution time.

Most SQL statements which are valid in MySQL can be used as simple statements; for exceptions, see SQL Statements Not Permitted in Stored Routines. A minimal example of a stored procedure using the JavaScript simple statement API is shown here:

```
CREATE PROCEDURE jssp_vsimple(IN query VARCHAR(250))
LANGUAGE JAVASCRIPT AS $$

  let stmt = session.sql(query)
  let result = stmt.execute()

  console.log(result.getColumnNames())

  let row = result.fetchOne()

  while(row) {
    console.log(row.toArray())
    row = result.fetchOne()
  }

$$;
```

This stored procedure takes a single input parameter: the text of an SQL statement. We obtain an instance of `SqlExecute` by passing this text to the global `Session` object's `sql()` method. Calling this instance's `execute()` method yields an `SqlResult`; we can get the names of the columns in this result set using `getColumnNames()`, and iterate through all its rows by calling `fetchOne()` until it fails to return another row (that is, until the method returns `false`). The column names and row contents are written to `stdout` using `console.log()`.

We can test this procedure using a simple join on two tables in the **`world`** database and then checking **`stdout`** afterwards, like this:

```
mysql> CALL jssp_vsimple("
    ">   SELECT c.Name, c.LocalName, c.Population, l.Language
    ">   FROM country c
    ">   JOIN countrylanguage l
    ">   ON c.Code=l.CountryCode
    ">   WHERE l.Language='Swedish'
    "> ");
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_state('stdout')\G
*************************** 1. row ***************************
mle_session_state('stdout'): Name,LocalName,Population,Language
Denmark,Danmark,5330000,Swedish
Finland,Suomi,5171300,Swedish
Norway,Norge,4478500,Swedish
Sweden,Sverige,8861400,Swedish

1 row in set (0.00 sec)
```

The result set returned by a single simple statement cannot be greater than 1 MB.
