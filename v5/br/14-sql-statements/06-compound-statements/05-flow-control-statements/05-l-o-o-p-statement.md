#### 13.6.5.5 LOOP Statement

```sql
[begin_label:] LOOP
    statement_list
END LOOP [end_label]
```

[`LOOP`](loop.html "13.6.5.5 LOOP Statement") implements a simple loop construct, enabling repeated execution of the statement list, which consists of one or more statements, each terminated by a semicolon (`;`) statement delimiter. The statements within the loop are repeated until the loop is terminated. Usually, this is accomplished with a [`LEAVE`](leave.html "13.6.5.4 LEAVE Statement") statement. Within a stored function, [`RETURN`](return.html "13.6.5.7 RETURN Statement") can also be used, which exits the function entirely.

Neglecting to include a loop-termination statement results in an infinite loop.

A [`LOOP`](loop.html "13.6.5.5 LOOP Statement") statement can be labeled. For the rules regarding label use, see [Section 13.6.2, “Statement Labels”](statement-labels.html "13.6.2 Statement Labels").

Example:

```sql
CREATE PROCEDURE doiterate(p1 INT)
BEGIN
  label1: LOOP
    SET p1 = p1 + 1;
    IF p1 < 10 THEN
      ITERATE label1;
    END IF;
    LEAVE label1;
  END LOOP label1;
  SET @x = p1;
END;
```
