#### 13.6.6.2 Cursor DECLARE Statement

```sql
DECLARE cursor_name CURSOR FOR select_statement
```

This statement declares a cursor and associates it with a [`SELECT`](select.html "13.2.9 SELECT Statement") statement that retrieves the rows to be traversed by the cursor. To fetch the rows later, use a [`FETCH`](fetch.html "13.6.6.3 Cursor FETCH Statement") statement. The number of columns retrieved by the [`SELECT`](select.html "13.2.9 SELECT Statement") statement must match the number of output variables specified in the [`FETCH`](fetch.html "13.6.6.3 Cursor FETCH Statement") statement.

The [`SELECT`](select.html "13.2.9 SELECT Statement") statement cannot have an `INTO` clause.

Cursor declarations must appear before handler declarations and after variable and condition declarations.

A stored program may contain multiple cursor declarations, but each cursor declared in a given block must have a unique name. For an example, see [Section 13.6.6, “Cursors”](cursors.html "13.6.6 Cursors").

For information available through [`SHOW`](show.html "13.7.5 SHOW Statements") statements, it is possible in many cases to obtain equivalent information by using a cursor with an `INFORMATION_SCHEMA` table.
