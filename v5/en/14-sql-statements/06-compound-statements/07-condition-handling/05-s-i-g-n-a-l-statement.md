#### 13.6.7.5 SIGNAL Statement

```sql
SIGNAL condition_value
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

[`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") is the way to “return” an error. [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") provides error information to a handler, to an outer portion of the application, or to the client. Also, it provides control over the error's characteristics (error number, `SQLSTATE` value, message). Without [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement"), it is necessary to resort to workarounds such as deliberately referring to a nonexistent table to cause a routine to return an error.

No privileges are required to execute the [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") statement.

To retrieve information from the diagnostics area, use the [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") statement (see [Section 13.6.7.3, “GET DIAGNOSTICS Statement”](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement")). For information about the diagnostics area, see [Section 13.6.7.7, “The MySQL Diagnostics Area”](diagnostics-area.html "13.6.7.7 The MySQL Diagnostics Area").

* [SIGNAL Overview](signal.html#signal-overview "SIGNAL Overview")
* [Signal Condition Information Items](signal.html#signal-condition-information-items "Signal Condition Information Items")
* [Effect of Signals on Handlers, Cursors, and Statements](signal.html#signal-effects "Effect of Signals on Handlers, Cursors, and Statements")

##### SIGNAL Overview

The *`condition_value`* in a [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") statement indicates the error value to be returned. It can be an `SQLSTATE` value (a 5-character string literal) or a *`condition_name`* that refers to a named condition previously defined with [`DECLARE ... CONDITION`](declare-condition.html "13.6.7.1 DECLARE ... CONDITION Statement") (see [Section 13.6.7.1, “DECLARE ... CONDITION Statement”](declare-condition.html "13.6.7.1 DECLARE ... CONDITION Statement")).

An `SQLSTATE` value can indicate errors, warnings, or “not found.” The first two characters of the value indicate its error class, as discussed in [Signal Condition Information Items](signal.html#signal-condition-information-items "Signal Condition Information Items"). Some signal values cause statement termination; see [Effect of Signals on Handlers, Cursors, and Statements](signal.html#signal-effects "Effect of Signals on Handlers, Cursors, and Statements").

The `SQLSTATE` value for a [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") statement should not start with `'00'` because such values indicate success and are not valid for signaling an error. This is true whether the `SQLSTATE` value is specified directly in the [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") statement or in a named condition referred to in the statement. If the value is invalid, a `Bad SQLSTATE` error occurs.

To signal a generic `SQLSTATE` value, use `'45000'`, which means “unhandled user-defined exception.”

The [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") statement optionally includes a `SET` clause that contains multiple signal items, in a list of *`condition_information_item_name`* = *`simple_value_specification`* assignments, separated by commas.

Each *`condition_information_item_name`* may be specified only once in the `SET` clause. Otherwise, a `Duplicate condition information item` error occurs.

Valid *`simple_value_specification`* designators can be specified using stored procedure or function parameters, stored program local variables declared with [`DECLARE`](declare.html "13.6.3 DECLARE Statement"), user-defined variables, system variables, or literals. A character literal may include a *`_charset`* introducer.

For information about permissible *`condition_information_item_name`* values, see [Signal Condition Information Items](signal.html#signal-condition-information-items "Signal Condition Information Items").

The following procedure signals an error or warning depending on the value of `pval`, its input parameter:

```sql
CREATE PROCEDURE p (pval INT)
BEGIN
  DECLARE specialty CONDITION FOR SQLSTATE '45000';
  IF pval = 0 THEN
    SIGNAL SQLSTATE '01000';
  ELSEIF pval = 1 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'An error occurred';
  ELSEIF pval = 2 THEN
    SIGNAL specialty
      SET MESSAGE_TEXT = 'An error occurred';
  ELSE
    SIGNAL SQLSTATE '01000'
      SET MESSAGE_TEXT = 'A warning occurred', MYSQL_ERRNO = 1000;
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'An error occurred', MYSQL_ERRNO = 1001;
  END IF;
END;
```

If `pval` is 0, `p()` signals a warning because `SQLSTATE` values that begin with `'01'` are signals in the warning class. The warning does not terminate the procedure, and can be seen with [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement") after the procedure returns.

If `pval` is 1, `p()` signals an error and sets the `MESSAGE_TEXT` condition information item. The error terminates the procedure, and the text is returned with the error information.

If `pval` is 2, the same error is signaled, although the `SQLSTATE` value is specified using a named condition in this case.

If `pval` is anything else, `p()` first signals a warning and sets the message text and error number condition information items. This warning does not terminate the procedure, so execution continues and `p()` then signals an error. The error does terminate the procedure. The message text and error number set by the warning are replaced by the values set by the error, which are returned with the error information.

[`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") is typically used within stored programs, but it is a MySQL extension that it is permitted outside handler context. For example, if you invoke the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client program, you can enter any of these statements at the prompt:

```sql
SIGNAL SQLSTATE '77777';

CREATE TRIGGER t_bi BEFORE INSERT ON t
  FOR EACH ROW SIGNAL SQLSTATE '77777';

CREATE EVENT e ON SCHEDULE EVERY 1 SECOND
  DO SIGNAL SQLSTATE '77777';
```

[`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") executes according to the following rules:

If the [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") statement indicates a particular `SQLSTATE` value, that value is used to signal the condition specified. Example:

```sql
CREATE PROCEDURE p (divisor INT)
BEGIN
  IF divisor = 0 THEN
    SIGNAL SQLSTATE '22012';
  END IF;
END;
```

If the [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") statement uses a named condition, the condition must be declared in some scope that applies to the [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") statement, and must be defined using an `SQLSTATE` value, not a MySQL error number. Example:

```sql
CREATE PROCEDURE p (divisor INT)
BEGIN
  DECLARE divide_by_zero CONDITION FOR SQLSTATE '22012';
  IF divisor = 0 THEN
    SIGNAL divide_by_zero;
  END IF;
END;
```

If the named condition does not exist in the scope of the [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") statement, an `Undefined CONDITION` error occurs.

If [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") refers to a named condition that is defined with a MySQL error number rather than an `SQLSTATE` value, a `SIGNAL/RESIGNAL can only use a CONDITION defined with SQLSTATE` error occurs. The following statements cause that error because the named condition is associated with a MySQL error number:

```sql
DECLARE no_such_table CONDITION FOR 1051;
SIGNAL no_such_table;
```

If a condition with a given name is declared multiple times in different scopes, the declaration with the most local scope applies. Consider the following procedure:

```sql
CREATE PROCEDURE p (divisor INT)
BEGIN
  DECLARE my_error CONDITION FOR SQLSTATE '45000';
  IF divisor = 0 THEN
    BEGIN
      DECLARE my_error CONDITION FOR SQLSTATE '22012';
      SIGNAL my_error;
    END;
  END IF;
  SIGNAL my_error;
END;
```

If `divisor` is 0, the first [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") statement executes. The innermost `my_error` condition declaration applies, raising `SQLSTATE` `'22012'`.

If `divisor` is not 0, the second [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") statement executes. The outermost `my_error` condition declaration applies, raising `SQLSTATE` `'45000'`.

For information about how the server chooses handlers when a condition occurs, see [Section 13.6.7.6, “Scope Rules for Handlers”](handler-scope.html "13.6.7.6 Scope Rules for Handlers").

Signals can be raised within exception handlers:

```sql
CREATE PROCEDURE p ()
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    SIGNAL SQLSTATE VALUE '99999'
      SET MESSAGE_TEXT = 'An error occurred';
  END;
  DROP TABLE no_such_table;
END;
```

`CALL p()` reaches the [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") statement. There is no table named `no_such_table`, so the error handler is activated. The error handler destroys the original error (“no such table”) and makes a new error with `SQLSTATE` `'99999'` and message `An error occurred`.

##### Signal Condition Information Items

The following table lists the names of diagnostics area condition information items that can be set in a [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") (or [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement")) statement. All items are standard SQL except `MYSQL_ERRNO`, which is a MySQL extension. For more information about these items see [Section 13.6.7.7, “The MySQL Diagnostics Area”](diagnostics-area.html "13.6.7.7 The MySQL Diagnostics Area").

```sql
Item Name             Definition
---------             ----------
CLASS_ORIGIN          VARCHAR(64)
SUBCLASS_ORIGIN       VARCHAR(64)
CONSTRAINT_CATALOG    VARCHAR(64)
CONSTRAINT_SCHEMA     VARCHAR(64)
CONSTRAINT_NAME       VARCHAR(64)
CATALOG_NAME          VARCHAR(64)
SCHEMA_NAME           VARCHAR(64)
TABLE_NAME            VARCHAR(64)
COLUMN_NAME           VARCHAR(64)
CURSOR_NAME           VARCHAR(64)
MESSAGE_TEXT          VARCHAR(128)
MYSQL_ERRNO           SMALLINT UNSIGNED
```

The character set for character items is UTF-8.

It is illegal to assign `NULL` to a condition information item in a [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") statement.

A [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") statement always specifies an `SQLSTATE` value, either directly, or indirectly by referring to a named condition defined with an `SQLSTATE` value. The first two characters of an `SQLSTATE` value are its class, and the class determines the default value for the condition information items:

* Class = `'00'` (success)

  Illegal. `SQLSTATE` values that begin with `'00'` indicate success and are not valid for [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement").

* Class = `'01'` (warning)

  ```sql
  MESSAGE_TEXT = 'Unhandled user-defined warning condition';
  MYSQL_ERRNO = ER_SIGNAL_WARN
  ```

* Class = `'02'` (not found)

  ```sql
  MESSAGE_TEXT = 'Unhandled user-defined not found condition';
  MYSQL_ERRNO = ER_SIGNAL_NOT_FOUND
  ```

* Class > `'02'` (exception)

  ```sql
  MESSAGE_TEXT = 'Unhandled user-defined exception condition';
  MYSQL_ERRNO = ER_SIGNAL_EXCEPTION
  ```

For legal classes, the other condition information items are set as follows:

```sql
CLASS_ORIGIN = SUBCLASS_ORIGIN = '';
CONSTRAINT_CATALOG = CONSTRAINT_SCHEMA = CONSTRAINT_NAME = '';
CATALOG_NAME = SCHEMA_NAME = TABLE_NAME = COLUMN_NAME = '';
CURSOR_NAME = '';
```

The error values that are accessible after [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") executes are the `SQLSTATE` value raised by the [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") statement and the `MESSAGE_TEXT` and `MYSQL_ERRNO` items. These values are available from the C API:

* [`mysql_sqlstate()`](/doc/c-api/5.7/en/mysql-sqlstate.html) returns the `SQLSTATE` value.

* [`mysql_errno()`](/doc/c-api/5.7/en/mysql-errno.html) returns the `MYSQL_ERRNO` value.

* [`mysql_error()`](/doc/c-api/5.7/en/mysql-error.html) returns the `MESSAGE_TEXT` value.

At the SQL level, the output from [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement") and [`SHOW ERRORS`](show-errors.html "13.7.5.17 SHOW ERRORS Statement") indicates the `MYSQL_ERRNO` and `MESSAGE_TEXT` values in the `Code` and `Message` columns.

To retrieve information from the diagnostics area, use the [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") statement (see [Section 13.6.7.3, “GET DIAGNOSTICS Statement”](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement")). For information about the diagnostics area, see [Section 13.6.7.7, “The MySQL Diagnostics Area”](diagnostics-area.html "13.6.7.7 The MySQL Diagnostics Area").

##### Effect of Signals on Handlers, Cursors, and Statements

Signals have different effects on statement execution depending on the signal class. The class determines how severe an error is. MySQL ignores the value of the [`sql_mode`](server-system-variables.html#sysvar_sql_mode) system variable; in particular, strict SQL mode does not matter. MySQL also ignores `IGNORE`: The intent of [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") is to raise a user-generated error explicitly, so a signal is never ignored.

In the following descriptions, “unhandled” means that no handler for the signaled `SQLSTATE` value has been defined with [`DECLARE ... HANDLER`](declare-handler.html "13.6.7.2 DECLARE ... HANDLER Statement").

* Class = `'00'` (success)

  Illegal. `SQLSTATE` values that begin with `'00'` indicate success and are not valid for [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement").

* Class = `'01'` (warning)

  The value of the [`warning_count`](server-system-variables.html#sysvar_warning_count) system variable goes up. [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement") shows the signal. `SQLWARNING` handlers catch the signal.

  Warnings cannot be returned from stored functions because the [`RETURN`](return.html "13.6.5.7 RETURN Statement") statement that causes the function to return clears the diagnostic area. The statement thus clears any warnings that may have been present there (and resets [`warning_count`](server-system-variables.html#sysvar_warning_count) to 0).

* Class = `'02'` (not found)

  `NOT FOUND` handlers catch the signal. There is no effect on cursors. If the signal is unhandled in a stored function, statements end.

* Class > `'02'` (exception)

  `SQLEXCEPTION` handlers catch the signal. If the signal is unhandled in a stored function, statements end.

* Class = `'40'`

  Treated as an ordinary exception.
