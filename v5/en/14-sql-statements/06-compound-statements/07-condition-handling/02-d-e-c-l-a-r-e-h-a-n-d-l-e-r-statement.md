#### 13.6.7.2 DECLARE ... HANDLER Statement

```sql
DECLARE handler_action HANDLER
    FOR condition_value [, condition_value] ...
    statement

handler_action: {
    CONTINUE
  | EXIT
  | UNDO
}

condition_value: {
    mysql_error_code
  | SQLSTATE [VALUE] sqlstate_value
  | condition_name
  | SQLWARNING
  | NOT FOUND
  | SQLEXCEPTION
}
```

The [`DECLARE ... HANDLER`](declare-handler.html "13.6.7.2 DECLARE ... HANDLER Statement") statement specifies a handler that deals with one or more conditions. If one of these conditions occurs, the specified *`statement`* executes. *`statement`* can be a simple statement such as `SET var_name = value`, or a compound statement written using `BEGIN` and `END` (see [Section 13.6.1, “BEGIN ... END Compound Statement”](begin-end.html "13.6.1 BEGIN ... END Compound Statement")).

Handler declarations must appear after variable or condition declarations.

The *`handler_action`* value indicates what action the handler takes after execution of the handler statement:

* `CONTINUE`: Execution of the current program continues.

* `EXIT`: Execution terminates for the [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement") compound statement in which the handler is declared. This is true even if the condition occurs in an inner block.

* `UNDO`: Not supported.

The *`condition_value`* for [`DECLARE ... HANDLER`](declare-handler.html "13.6.7.2 DECLARE ... HANDLER Statement") indicates the specific condition or class of conditions that activates the handler. It can take the following forms:

* *`mysql_error_code`*: An integer literal indicating a MySQL error code, such as 1051 to specify “unknown table”:

  ```sql
  DECLARE CONTINUE HANDLER FOR 1051
    BEGIN
      -- body of handler
    END;
  ```

  Do not use MySQL error code 0 because that indicates success rather than an error condition. For a list of MySQL error codes, see [Server Error Message Reference](/doc/mysql-errors/5.7/en/server-error-reference.html).

* SQLSTATE [VALUE] *`sqlstate_value`*: A 5-character string literal indicating an SQLSTATE value, such as `'42S01'` to specify “unknown table”:

  ```sql
  DECLARE CONTINUE HANDLER FOR SQLSTATE '42S02'
    BEGIN
      -- body of handler
    END;
  ```

  Do not use SQLSTATE values that begin with `'00'` because those indicate success rather than an error condition. For a list of SQLSTATE values, see [Server Error Message Reference](/doc/mysql-errors/5.7/en/server-error-reference.html).

* *`condition_name`*: A condition name previously specified with [`DECLARE ... CONDITION`](declare-condition.html "13.6.7.1 DECLARE ... CONDITION Statement"). A condition name can be associated with a MySQL error code or SQLSTATE value. See [Section 13.6.7.1, “DECLARE ... CONDITION Statement”](declare-condition.html "13.6.7.1 DECLARE ... CONDITION Statement").

* `SQLWARNING`: Shorthand for the class of SQLSTATE values that begin with `'01'`.

  ```sql
  DECLARE CONTINUE HANDLER FOR SQLWARNING
    BEGIN
      -- body of handler
    END;
  ```

* `NOT FOUND`: Shorthand for the class of SQLSTATE values that begin with `'02'`. This is relevant within the context of cursors and is used to control what happens when a cursor reaches the end of a data set. If no more rows are available, a No Data condition occurs with SQLSTATE value `'02000'`. To detect this condition, you can set up a handler for it or for a `NOT FOUND` condition.

  ```sql
  DECLARE CONTINUE HANDLER FOR NOT FOUND
    BEGIN
      -- body of handler
    END;
  ```

  For another example, see [Section 13.6.6, “Cursors”](cursors.html "13.6.6 Cursors"). The `NOT FOUND` condition also occurs for `SELECT ... INTO var_list` statements that retrieve no rows.

* `SQLEXCEPTION`: Shorthand for the class of SQLSTATE values that do not begin with `'00'`, `'01'`, or `'02'`.

  ```sql
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
      -- body of handler
    END;
  ```

For information about how the server chooses handlers when a condition occurs, see [Section 13.6.7.6, “Scope Rules for Handlers”](handler-scope.html "13.6.7.6 Scope Rules for Handlers").

If a condition occurs for which no handler has been declared, the action taken depends on the condition class:

* For `SQLEXCEPTION` conditions, the stored program terminates at the statement that raised the condition, as if there were an `EXIT` handler. If the program was called by another stored program, the calling program handles the condition using the handler selection rules applied to its own handlers.

* For `SQLWARNING` conditions, the program continues executing, as if there were a `CONTINUE` handler.

* For `NOT FOUND` conditions, if the condition was raised normally, the action is `CONTINUE`. If it was raised by [`SIGNAL`](signal.html "13.6.7.5 SIGNAL Statement") or [`RESIGNAL`](resignal.html "13.6.7.4 RESIGNAL Statement"), the action is `EXIT`.

The following example uses a handler for `SQLSTATE '23000'`, which occurs for a duplicate-key error:

```sql
mysql> CREATE TABLE test.t (s1 INT, PRIMARY KEY (s1));
Query OK, 0 rows affected (0.00 sec)

mysql> delimiter //

mysql> CREATE PROCEDURE handlerdemo ()
       BEGIN
         DECLARE CONTINUE HANDLER FOR SQLSTATE '23000' SET @x2 = 1;
         SET @x = 1;
         INSERT INTO test.t VALUES (1);
         SET @x = 2;
         INSERT INTO test.t VALUES (1);
         SET @x = 3;
       END;
       //
Query OK, 0 rows affected (0.00 sec)

mysql> CALL handlerdemo()//
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @x//
    +------+
    | @x   |
    +------+
    | 3    |
    +------+
    1 row in set (0.00 sec)
```

Notice that `@x` is `3` after the procedure executes, which shows that execution continued to the end of the procedure after the error occurred. If the [`DECLARE ... HANDLER`](declare-handler.html "13.6.7.2 DECLARE ... HANDLER Statement") statement had not been present, MySQL would have taken the default action (`EXIT`) after the second [`INSERT`](insert.html "13.2.5 INSERT Statement") failed due to the `PRIMARY KEY` constraint, and `SELECT @x` would have returned `2`.

To ignore a condition, declare a `CONTINUE` handler for it and associate it with an empty block. For example:

```sql
DECLARE CONTINUE HANDLER FOR SQLWARNING BEGIN END;
```

The scope of a block label does not include the code for handlers declared within the block. Therefore, the statement associated with a handler cannot use [`ITERATE`](iterate.html "13.6.5.3 ITERATE Statement") or [`LEAVE`](leave.html "13.6.5.4 LEAVE Statement") to refer to labels for blocks that enclose the handler declaration. Consider the following example, where the [`REPEAT`](repeat.html "13.6.5.6 REPEAT Statement") block has a label of `retry`:

```sql
CREATE PROCEDURE p ()
BEGIN
  DECLARE i INT DEFAULT 3;
  retry:
    REPEAT
      BEGIN
        DECLARE CONTINUE HANDLER FOR SQLWARNING
          BEGIN
            ITERATE retry;    # illegal
          END;
        IF i < 0 THEN
          LEAVE retry;        # legal
        END IF;
        SET i = i - 1;
      END;
    UNTIL FALSE END REPEAT;
END;
```

The `retry` label is in scope for the [`IF`](if.html "13.6.5.2 IF Statement") statement within the block. It is not in scope for the `CONTINUE` handler, so the reference there is invalid and results in an error:

```sql
ERROR 1308 (42000): LEAVE with no matching label: retry
```

To avoid references to outer labels in handlers, use one of these strategies:

* To leave the block, use an `EXIT` handler. If no block cleanup is required, the [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement") handler body can be empty:

  ```sql
  DECLARE EXIT HANDLER FOR SQLWARNING BEGIN END;
  ```

  Otherwise, put the cleanup statements in the handler body:

  ```sql
  DECLARE EXIT HANDLER FOR SQLWARNING
    BEGIN
      block cleanup statements
    END;
  ```

* To continue execution, set a status variable in a `CONTINUE` handler that can be checked in the enclosing block to determine whether the handler was invoked. The following example uses the variable `done` for this purpose:

  ```sql
  CREATE PROCEDURE p ()
  BEGIN
    DECLARE i INT DEFAULT 3;
    DECLARE done INT DEFAULT FALSE;
    retry:
      REPEAT
        BEGIN
          DECLARE CONTINUE HANDLER FOR SQLWARNING
            BEGIN
              SET done = TRUE;
            END;
          IF done OR i < 0 THEN
            LEAVE retry;
          END IF;
          SET i = i - 1;
        END;
      UNTIL FALSE END REPEAT;
  END;
  ```
