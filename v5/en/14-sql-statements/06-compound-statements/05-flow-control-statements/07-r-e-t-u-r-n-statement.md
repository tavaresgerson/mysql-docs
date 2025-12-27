#### 13.6.5.7 RETURN Statement

```sql
RETURN expr
```

The [`RETURN`](return.html "13.6.5.7 RETURN Statement") statement terminates execution of a stored function and returns the value *`expr`* to the function caller. There must be at least one [`RETURN`](return.html "13.6.5.7 RETURN Statement") statement in a stored function. There may be more than one if the function has multiple exit points.

This statement is not used in stored procedures, triggers, or events. The [`LEAVE`](leave.html "13.6.5.4 LEAVE Statement") statement can be used to exit a stored program of those types.
