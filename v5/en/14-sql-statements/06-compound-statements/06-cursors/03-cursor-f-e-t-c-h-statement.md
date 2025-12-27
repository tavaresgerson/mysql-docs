#### 13.6.6.3 Cursor FETCH Statement

```sql
FETCH [[NEXT] FROM] cursor_name INTO var_name [, var_name] ...
```

This statement fetches the next row for the [`SELECT`](select.html "13.2.9 SELECT Statement") statement associated with the specified cursor (which must be open), and advances the cursor pointer. If a row exists, the fetched columns are stored in the named variables. The number of columns retrieved by the [`SELECT`](select.html "13.2.9 SELECT Statement") statement must match the number of output variables specified in the [`FETCH`](fetch.html "13.6.6.3 Cursor FETCH Statement") statement.

If no more rows are available, a No Data condition occurs with SQLSTATE value `'02000'`. To detect this condition, you can set up a handler for it (or for a `NOT FOUND` condition). For an example, see [Section 13.6.6, “Cursors”](cursors.html "13.6.6 Cursors").

Be aware that another operation, such as a `SELECT` or another `FETCH`, may also cause the handler to execute by raising the same condition. If it is necessary to distinguish which operation raised the condition, place the operation within its own [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement") block so that it can be associated with its own handler.
