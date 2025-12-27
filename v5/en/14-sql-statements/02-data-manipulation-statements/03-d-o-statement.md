### 13.2.3 DO Statement

```sql
DO expr [, expr] ...
```

[`DO`](do.html "13.2.3 DO Statement") executes the expressions but does not return any results. In most respects, [`DO`](do.html "13.2.3 DO Statement") is shorthand for `SELECT expr, ...`, but has the advantage that it is slightly faster when you do not care about the result.

[`DO`](do.html "13.2.3 DO Statement") is useful primarily with functions that have side effects, such as [`RELEASE_LOCK()`](locking-functions.html#function_release-lock).

Example: This [`SELECT`](select.html "13.2.9 SELECT Statement") statement pauses, but also produces a result set:

```sql
mysql> SELECT SLEEP(5);
+----------+
| SLEEP(5) |
+----------+
|        0 |
+----------+
1 row in set (5.02 sec)
```

[`DO`](do.html "13.2.3 DO Statement"), on the other hand, pauses without producing a result set.:

```sql
mysql> DO SLEEP(5);
Query OK, 0 rows affected (4.99 sec)
```

This could be useful, for example in a stored function or trigger, which prohibit statements that produce result sets.

[`DO`](do.html "13.2.3 DO Statement") only executes expressions. It cannot be used in all cases where `SELECT` can be used. For example, `DO id FROM t1` is invalid because it references a table.
