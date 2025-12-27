#### 13.6.7.4 RESIGNAL Statement

```sql
RESIGNAL [condition_value]
    [SET signal_information_item
    [, signal_information_item] ...]

condition_value: {
    SQLSTATE [VALUE] sqlstate_value
  | condition_name
}

signal_information_item:
    condition_information_item_name = simple_value_specification

condition_information_item_name: {
    CLASS_ORIGIN
  | SUBCLASS_ORIGIN
  | MESSAGE_TEXT
  | MYSQL_ERRNO
  | CONSTRAINT_CATALOG
  | CONSTRAINT_SCHEMA
  | CONSTRAINT_NAME
  | CATALOG_NAME
  | SCHEMA_NAME
  | TABLE_NAME
  | COLUMN_NAME
  | CURSOR_NAME
}

condition_name, simple_value_specification:
    (see following discussion)
```

[`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") passes on the error condition information that is available during execution of a condition handler within a compound statement inside a stored procedure or function, trigger, or event. [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") may change some or all information before passing it on. [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") is related to [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement"), but instead of originating a condition as [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") does, [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") relays existing condition information, possibly after modifying it.

[`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") makes it possible to both handle an error and return the error information. Otherwise, by executing an SQL statement within the handler, information that caused the handler's activation is destroyed. [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") also can make some procedures shorter if a given handler can handle part of a situation, then pass the condition “up the line” to another handler.

No privileges are required to execute the [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") statement.

All forms of [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") require that the current context be a condition handler. Otherwise, [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") is illegal and a `RESIGNAL when handler not active` error occurs.

To retrieve information from the diagnostics area, use the [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") statement (see [Section 13.6.7.3, “GET DIAGNOSTICS Statement”](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement")). For information about the diagnostics area, see [Section 13.6.7.7, “The MySQL Diagnostics Area”](diagnostics-area.html "13.6.7.7 The MySQL Diagnostics Area").

* [RESIGNAL Overview](resignal.html#resignal-overview "RESIGNAL Overview")
* [RESIGNAL Alone](resignal.html#resignal-alone "RESIGNAL Alone")
* [RESIGNAL with New Signal Information](resignal.html#resignal-with-new-signal "RESIGNAL with New Signal Information")
* [RESIGNAL with a Condition Value and Optional New Signal Information](resignal.html#resignal-with-condition "RESIGNAL with a Condition Value and Optional New Signal Information")
* [RESIGNAL Requires Condition Handler Context](resignal.html#resignal-handler "RESIGNAL Requires Condition Handler Context")

##### RESIGNAL Overview

For *`condition_value`* and *`signal_information_item`*, the definitions and rules are the same for [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") as for [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement"). For example, the *`condition_value`* can be an `SQLSTATE` value, and the value can indicate errors, warnings, or “not found.” For additional information, see [Section 13.6.7.5, “SIGNAL Statement”](signal.html "13.6.7.5 SIGNAL Statement").

The [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") statement takes *`condition_value`* and `SET` clauses, both of which are optional. This leads to several possible uses:

* [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") alone:

  ```sql
  RESIGNAL;
  ```

* [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") with new signal information:

  ```sql
  RESIGNAL SET signal_information_item [, signal_information_item] ...;
  ```

* [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") with a condition value and possibly new signal information:

  ```sql
  RESIGNAL condition_value
      [SET signal_information_item [, signal_information_item] ...];
  ```

These use cases all cause changes to the diagnostics and condition areas:

* A diagnostics area contains one or more condition areas.
* A condition area contains condition information items, such as the `SQLSTATE` value, `MYSQL_ERRNO`, or `MESSAGE_TEXT`.

There is a stack of diagnostics areas. When a handler takes control, it pushes a diagnostics area to the top of the stack, so there are two diagnostics areas during handler execution:

* The first (current) diagnostics area, which starts as a copy of the last diagnostics area, but is overwritten by the first statement in the handler that changes the current diagnostics area.

* The last (stacked) diagnostics area, which has the condition areas that were set up before the handler took control.

The maximum number of condition areas in a diagnostics area is determined by the value of the [`max_error_count`](server-system-variables.html#sysvar_max_error_count) system variable. See [Diagnostics Area-Related System Variables](diagnostics-area.html#diagnostics-area-system-variables "Diagnostics Area-Related System Variables").

##### RESIGNAL Alone

A simple [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") alone means “pass on the error with no change.” It restores the last diagnostics area and makes it the current diagnostics area. That is, it “pops” the diagnostics area stack.

Within a condition handler that catches a condition, one use for [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") alone is to perform some other actions, and then pass on without change the original condition information (the information that existed before entry into the handler).

Example:

```sql
DROP TABLE IF EXISTS xx;
delimiter //
CREATE PROCEDURE p ()
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    SET @error_count = @error_count + 1;
    IF @a = 0 THEN RESIGNAL; END IF;
  END;
  DROP TABLE xx;
END//
delimiter ;
SET @error_count = 0;
SET @a = 0;
CALL p();
```

Suppose that the `DROP TABLE xx` statement fails. The diagnostics area stack looks like this:

```sql
DA 1. ERROR 1051 (42S02): Unknown table 'xx'
```

Then execution enters the `EXIT` handler. It starts by pushing a diagnostics area to the top of the stack, which now looks like this:

```sql
DA 1. ERROR 1051 (42S02): Unknown table 'xx'
DA 2. ERROR 1051 (42S02): Unknown table 'xx'
```

At this point, the contents of the first (current) and second (stacked) diagnostics areas are the same. The first diagnostics area may be modified by statements executing subsequently within the handler.

Usually a procedure statement clears the first diagnostics area. `BEGIN` is an exception, it does not clear, it does nothing. `SET` is not an exception, it clears, performs the operation, and produces a result of “success.” The diagnostics area stack now looks like this:

```sql
DA 1. ERROR 0000 (00000): Successful operation
DA 2. ERROR 1051 (42S02): Unknown table 'xx'
```

At this point, if `@a = 0`, [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") pops the diagnostics area stack, which now looks like this:

```sql
DA 1. ERROR 1051 (42S02): Unknown table 'xx'
```

And that is what the caller sees.

If `@a` is not 0, the handler simply ends, which means that there is no more use for the current diagnostics area (it has been “handled”), so it can be thrown away, causing the stacked diagnostics area to become the current diagnostics area again. The diagnostics area stack looks like this:

```sql
DA 1. ERROR 0000 (00000): Successful operation
```

The details make it look complex, but the end result is quite useful: Handlers can execute without destroying information about the condition that caused activation of the handler.

##### RESIGNAL with New Signal Information

[`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") with a `SET` clause provides new signal information, so the statement means “pass on the error with changes”:

```sql
RESIGNAL SET signal_information_item [, signal_information_item] ...;
```

As with [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") alone, the idea is to pop the diagnostics area stack so that the original information goes out. Unlike [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") alone, anything specified in the `SET` clause changes.

Example:

```sql
DROP TABLE IF EXISTS xx;
delimiter //
CREATE PROCEDURE p ()
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    SET @error_count = @error_count + 1;
    IF @a = 0 THEN RESIGNAL SET MYSQL_ERRNO = 5; END IF;
  END;
  DROP TABLE xx;
END//
delimiter ;
SET @error_count = 0;
SET @a = 0;
CALL p();
```

Remember from the previous discussion that [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") alone results in a diagnostics area stack like this:

```sql
DA 1. ERROR 1051 (42S02): Unknown table 'xx'
```

The `RESIGNAL SET MYSQL_ERRNO = 5` statement results in this stack instead, which is what the caller sees:

```sql
DA 1. ERROR 5 (42S02): Unknown table 'xx'
```

In other words, it changes the error number, and nothing else.

The [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") statement can change any or all of the signal information items, making the first condition area of the diagnostics area look quite different.

##### RESIGNAL with a Condition Value and Optional New Signal Information

[`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") with a condition value means “push a condition into the current diagnostics area.” If the `SET` clause is present, it also changes the error information.

```sql
RESIGNAL condition_value
    [SET signal_information_item [, signal_information_item] ...];
```

This form of [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") restores the last diagnostics area and makes it the current diagnostics area. That is, it “pops” the diagnostics area stack, which is the same as what a simple [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") alone would do. However, it also changes the diagnostics area depending on the condition value or signal information.

Example:

```sql
DROP TABLE IF EXISTS xx;
delimiter //
CREATE PROCEDURE p ()
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    SET @error_count = @error_count + 1;
    IF @a = 0 THEN RESIGNAL SQLSTATE '45000' SET MYSQL_ERRNO=5; END IF;
  END;
  DROP TABLE xx;
END//
delimiter ;
SET @error_count = 0;
SET @a = 0;
SET @@max_error_count = 2;
CALL p();
SHOW ERRORS;
```

This is similar to the previous example, and the effects are the same, except that if [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") happens, the current condition area looks different at the end. (The reason the condition adds to rather than replaces the existing condition is the use of a condition value.)

The [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") statement includes a condition value (`SQLSTATE '45000'`), so it adds a new condition area, resulting in a diagnostics area stack that looks like this:

```sql
DA 1. (condition 2) ERROR 1051 (42S02): Unknown table 'xx'
      (condition 1) ERROR 5 (45000) Unknown table 'xx'
```

The result of [`CALL p()`](call.html "13.2.1 CALL Statement") and [`SHOW ERRORS`](show-errors.html "13.7.5.17 SHOW ERRORS Statement") for this example is:

```sql
mysql> CALL p();
ERROR 5 (45000): Unknown table 'xx'
mysql> SHOW ERRORS;
+-------+------+----------------------------------+
| Level | Code | Message                          |
+-------+------+----------------------------------+
| Error | 1051 | Unknown table 'xx'               |
| Error |    5 | Unknown table 'xx'               |
+-------+------+----------------------------------+
```

##### RESIGNAL Requires Condition Handler Context

All forms of [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") require that the current context be a condition handler. Otherwise, [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") is illegal and a `RESIGNAL when handler not active` error occurs. For example:

```sql
mysql> CREATE PROCEDURE p () RESIGNAL;
Query OK, 0 rows affected (0.00 sec)

mysql> CALL p();
ERROR 1645 (0K000): RESIGNAL when handler not active
```

Here is a more difficult example:

```sql
delimiter //
CREATE FUNCTION f () RETURNS INT
BEGIN
  RESIGNAL;
  RETURN 5;
END//
CREATE PROCEDURE p ()
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION SET @a=f();
  SIGNAL SQLSTATE '55555';
END//
delimiter ;
CALL p();
```

[`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement") occurs within the stored function `f()`. Although `f()` itself is invoked within the context of the `EXIT` handler, execution within `f()` has its own context, which is not handler context. Thus, `RESIGNAL` within `f()` results in a “handler not active” error.
