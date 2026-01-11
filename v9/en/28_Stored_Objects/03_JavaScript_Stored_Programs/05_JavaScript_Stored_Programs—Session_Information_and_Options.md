### 27.3.5 JavaScript Stored Programs—Session Information and Options

For general information about stored routines in MySQL, see Section 27.2, “Using Stored Routines”.

The MLE component provides a number of loadable functions for working with MLE user sessions. These functions are listed and described here:

* `mle_session_reset()`

  Calling this function with no arguments cleans up the current MLE session state, removing any observable output from `mle_session_state()`. It also resets the session time zone, so that subsequent calls to JavaScript stored routines use the time zone set most recently in the session.

  This function accepts an optional string argument. Possible values and their effects are listed here:

  + `"stdout"`: Clears `stdout`.

  + `"stderr"`: Clears `stderr`.

  + `"output"`: Clears both `stdout` and `stderr`.

  Calling this function with no arguments continues to work as it did in previous versions of MySQL, clearing both `stderr` and `stdout`, as well as clearing the stack trace and resetting the session time zone.

* `mle_session_state()`

  Use this loadable function to obtain session information about the MLE stored program that was most recently executed. `mle_session_state()` takes one argument, a session state key (a string), and displays a session state value. A session state value is limited to a maximum size of 64K (equivalent to 16000 4-byte characters). This is a cyclic buffer; when the available space has been used up, a new entry overwrites the oldest one. Possible session state keys are listed here, with their descriptions:

  + `is_active`: Returns `1` if the current MySQL user session is an MLE session, otherwise `0`.

  + `stdout`: Output anything written by the stored program using `console.log()`.

  + `stderr`: Output anything written by the stored program using `console.error()`.

  + `stack_trace`: If execution of the MLE stored program is unsuccessful, this contains a stack trace which may help in pinpointing the source of the error.

    Syntax and similar errors encountered by an unsuccessful `CREATE FUNCTION` or `CREATE PROCEDURE` statement are not written here, only runtime errors raised during execution of a stored function or stored procedure.

  + `stored_functions`: Returns the number of currently cached stored functions in the current session.

  + `stored_procedures`: Returns the number of currently cached stored procedures in the current session.

  + `stored_programs`: Returns the number of currently cached stored programs (stored functions and stored procedures) in the current session.

  The session state key is a literal string value and must be quoted.

  Prior to the invocation of any MLE stored programs, all three of these session state values are empty. Exiting the client and restarting the session clears all of them.

  The next two examples illustrate retrieval of the session state values. We begin by creating a stored procedure `mle_states()` that displays all session state values, like this:

  ```
  mysql> delimiter //
  mysql> CREATE PROCEDURE mle_states()
      -> BEGIN
      ->   SELECT
      ->     mle_session_state("is_active") AS '-ACTIVE-',
      ->     mle_session_state("stdout") AS '-STDOUT-',
      ->     mle_session_state("stderr") AS '-STDERR-',
      ->     mle_session_state("stack_trace") AS '-STACK-',
      ->     mle_session_state("stored_functions") AS '-FUNCS-',
      ->     mle_session_state("stored_procedures") AS '-PROCS-',
      ->     mle_session_state("stored_programs") AS '-PROGS-';
      -> END//
  Query OK, 0 rows affected (0.02 sec)

  mysql> delimiter ;
  ```

  Prior to running any MLE stored programs, all of the values in the output from `mle_states()` are `0` or empty, as shown here:

  ```
  mysql> CALL mle_states();
  +----------+----------+----------+---------+---------+---------+---------+
  | -ACTIVE- | -STDOUT- | -STDERR- | -STACK- | -FUNCS- | -PROCS- | -PROGS- |
  +----------+----------+----------+---------+---------+---------+---------+
  | 0        |          |          |         | 0       | 0       | 0       |
  +----------+----------+----------+---------+---------+---------+---------+
  1 row in set (0.00 sec)

  Query OK, 0 rows affected (0.00 sec)
  ```

  Now we create a JavaScript stored procedure `pc1()` that uses `console.log()` and `console.error()` in a short loop to write multiple times to `stdout` and to `stderr`, like this:

  ```
  mysql> CREATE PROCEDURE pc1()
      -> LANGUAGE JAVASCRIPT AS
      -> $$
      $>   let x = 0
      $>
      $>   do  {
      $>     console.log(`This is message #${++x} to stdout.`)
      $>     console.error(`This is message #${x} to stderr.`)
      $>   }
      $>   while(x < 3)
      $> $$
      -> ;
  Query OK, 0 rows affected (0.02 sec)
  ```

  Following the execution of the `CREATE PROCEDURE` statement just shown, `mle_states()` shows an active MLE session. No stored programs have yet been run, so none have been cached; this means the columns reflecting JavaScript stored functions, procedures, and programs all show `0`. The output is shown here:

  ```
  mysql> CALL mle_states;
  +----------+----------+----------+---------+---------+---------+---------+
  | -ACTIVE- | -STDOUT- | -STDERR- | -STACK- | -FUNCS- | -PROCS- | -PROGS- |
  +----------+----------+----------+---------+---------+---------+---------+
  | 1        |          |          |         | 0       | 0       | 0       |
  +----------+----------+----------+---------+---------+---------+---------+
  1 row in set (0.00 sec)

  Query OK, 0 rows affected (0.00 sec)
  ```

  Note

  Quoting strings with backtick (`` ` ``) characters allows us to use variable interpolation in the output. If you are unfamiliar with this quoting mechanism, see Template Literals at Mozilla Developer for more information.

  Invoking `pc1()` followed by `mle_states()` produces the result shown here:

  ```
  mysql> CALL pc1();
  Query OK, 0 rows affected (0.00 sec)

  mysql> CALL mle_states()\G
  *************************** 1. row ***************************
  -ACTIVE-: 1
  -STDOUT-: This is message #1 to stdout.
  This is message #2 to stdout.
  This is message #3 to stdout.

  -STDERR-: This is message #1 to stderr.
  This is message #2 to stderr.
  This is message #3 to stderr.

   -STACK-:
   -FUNCS-: 0
   -PROCS-: 1
   -PROGS-: 1
  1 row in set (0.00 sec)

  Query OK, 0 rows affected (0.00 sec)
  ```

  Executing the stored procedure starts an MLE session, so `is_active` (`-ACTIVE-`) is now `1`.

  Successive writes to `stdout` or `stderr` within the same session are appended to any existing content. To see this, call `pc1()` again, then check the output from `mle_states()`, as shown here:

  ```
  mysql> CALL pc1();
  Query OK, 0 rows affected (0.00 sec)

  mysql> CALL mle_states()\G
  *************************** 1. row ***************************
  -ACTIVE-: 1
  -STDOUT-: This is message #1 to stdout.
  This is message #2 to stdout.
  This is message #3 to stdout.
  This is message #1 to stdout.
  This is message #2 to stdout.
  This is message #3 to stdout.

  -STDERR-: This is message #1 to stderr.
  This is message #2 to stderr.
  This is message #3 to stderr.
  This is message #1 to stderr.
  This is message #2 to stderr.
  This is message #3 to stderr.

   -STACK-:
   -FUNCS-: 0
   -PROCS-: 1
   -PROGS-: 1
  1 row in set (0.00 sec)

  Query OK, 0 rows affected (0.00 sec)
  ```

  Since no errors were produced by `pc1()`, the stack trace remains empty. To test the stack trace, we can create a modified copy of `pc1()` in which we change the reference to `console.log()` to the undefined function `console.lob()`, like this:

  ```
  mysql> CREATE PROCEDURE pc2()
      -> LANGUAGE JAVASCRIPT AS
      -> $$
      $>   let x = 0
      $>   do  {
      $>     console.lob(`This is message #${++x} to stdout.`)
      $>     console.error(`This is message #${x} to stderr.`)
      $>   }
      $>   while(x < 3)
      $> $$
      -> ;
  Query OK, 0 rows affected (0.02 sec)
  ```

  ```
  CREATE PROCEDURE pc2()
  LANGUAGE JAVASCRIPT AS
    $$
     let x = 0
     do  {
       console.lob(`This is message #${++x} to stdout.`)
       console.error(`This is message #${x} to stderr.`)
     }
     while(x < 3)
    $$
  ;
  ```

  ```
  mysql> CREATE PROCEDURE pc2()
      -> LANGUAGE JAVASCRIPT AS
      -> $$
      $>   let x = 0
      $>   do  {
      $>     console.lob(`This is message #${++x} to stdout.`)
      $>     console.error(`This is message #${x} to stderr.`)
      $>   }
      $>   while(x < 3)
      $> $$
      -> ;
  Query OK, 0 rows affected (0.02 sec)
  ```

  The `CREATE PROCEDURE` statement runs successfully, but when we attempt to invoke `pc2()`, an error results, as shown here:

  ```
  mysql> CALL pc2();
  ERROR 6113 (HY000): JavaScript> TypeError: (intermediate value).lob is not a function
  ```

  Following this, when we invoke `mle_states()` again, we see that, since we are within the same session, the `stdout` and `stderr` fields still contain the content written to them previously. The stack trace from the error just shown is displayed in the last column of the output:

  ```
  mysql> CALL mle_states()\G
  *************************** 1. row ***************************
  -ACTIVE-: 1
  -STDOUT-: This is message #1 to stdout.
  This is message #2 to stdout.
  This is message #3 to stdout.
  This is message #1 to stdout.
  This is message #2 to stdout.
  This is message #3 to stdout.

  -STDERR-: This is message #1 to stderr.
  This is message #2 to stderr.
  This is message #3 to stderr.
  This is message #1 to stderr.
  This is message #2 to stderr.
  This is message #3 to stderr.

  -STACK-: <js> pc2:3:6-54

  -FUNCS-: 0
  -PROCS-: 2
  -PROGS-: 2
  1 row in set (0.00 sec)

  Query OK, 0 rows affected (0.00 sec)
  ```

  In addition the values of the `stored_functions`, `stored_procedures`, and `stored_programs` keys for `mle_session_state()` are `0`, `2`, and `2`, respectively—we have created 2 stored JavaScript procedures, and no JavaScript stored functions, for a total of 2 JavaScript stored programs.

  The stack trace does not persist between JavaScript stored program invocations.

  To clear all information from all fields in the output of `mle_states()`, call `mle_session_reset()`, like this:

  ```
  mysql> SELECT mle_session_reset();
  mysql> SELECT mle_session_reset();
  +------------------------------------------+
  | mle_session_reset()                      |
  +------------------------------------------+
  | The session state is successfully reset. |
  +------------------------------------------+
  1 row in set (0.00 sec)
  ```

  Invoking `mle_states()` again produces the same as the initial result, before any stored JavaScript stored programs had been used.

  ```
  mysql> CALL mle_states;
  +----------+----------+----------+---------+---------+---------+---------+
  | -ACTIVE- | -STDOUT- | -STDERR- | -STACK- | -FUNCS- | -PROCS- | -PROGS- |
  +----------+----------+----------+---------+---------+---------+---------+
  | 0        |          |          |         | 0       | 0       | 0       |
  +----------+----------+----------+---------+---------+---------+---------+
  1 row in set (0.00 sec)

  Query OK, 0 rows affected (0.00 sec)
  ```

  Alternatively, you can clear `stdout` and `stderr` from within a JavaScript routine using `console.clear()`.

* `mle_set_session_state()`

  The MLE component provides this function as a means for determining the rules in effect during the current session for converting MySQL integer types (`TINYINT`, `SMALLINT`, `MEDIUMINT`, `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `BIGINT`) and MySQL decimal types (`DECIMAL` - DECIMAL, NUMERIC"), `NUMERIC` - DECIMAL, NUMERIC")) to JavaScript values. These rules apply to input arguments to JavaScript programs as well as to values in result sets.

  Possible conversion rules for integer types (key: `integer_type`) are listed here by name:

  + `BIGINT`: Always convert to JavaScript `BigInt`.

  + `STRING`: Always convert to JavaScript `String`.

  + `UNSAFE_BIGINT`: If the value is safe, convert to JavaScript `Number`; otherwise convert to JavaScript `BigInt`.

  + `UNSAFE_STRING`: If the value is safe, convert to JavaScript `Number`; otherwise convert to JavaScript `String`. This is the default behavior if no rule is specified.

  In the context of these conversion rules, “safe” means that the value to be converted is in the range of `-(253-1)` (`-9007199254740991`) to `(253-1)` (`9007199254740991`), inclusive.

  MySQL decimal types can be converted to JavaScript `Number` or `String` values; to determine which of these types is used, call `mle_set_session_state()` with the key `decimal_type`. This can have either of the following two values:

  + `STRING`: a MySQL `DECIMAL` or `NUMERIC` value is converted to a JavaScript `String`.

  + `NUMBER`: a MySQL `DECIMAL` or `NUMERIC` value is converted to a JavaScript `Number`.

  If not overriden by `mle_set_session_state()` or, within a JavaScript stored routine, by `Session.setOptions()`, the default is to convert MySQL decimal types to JavaScript `String`.

  This function can be invoked only if there are no cached stored programs in the current user session. When successful, the function returns `1`. Otherwise, attempting to invoke it raises an error, as shown here:

  ```
  mysql> SELECT gcd(536, 1676); // Call JS stored function
  +----------------+
  | gcd(536, 1676) |
  +----------------+
  |              4 |
  +----------------+
  1 row in set (0.00 sec)

  mysql> SELECT mle_set_session_state('{"integer_type":"BIGINT"}');
  ERROR 1123 (HY000): Can't initialize function 'mle_set_session_state'; Cannot
  set options of an active session. Please reset the session first.
  ```

  As the error message suggests, you must reset the session to clear the active session. To do this, use `mle_session_reset()`, like this:

  ```
  mysql> SELECT mle_session_reset();
  +------------------------------------------+
  | mle_session_reset()                      |
  +------------------------------------------+
  | The session state is successfully reset. |
  +------------------------------------------+
  1 row in set (0.00 sec)
  ```

  Now you can call `mle_set_session_state()` as shown here:

  ```
  mysql> SELECT mle_set_session_state('{"integer_type":"BIGINT"}');
  +----------------------------------------------------+
  | mle_set_session_state('{"integer_type":"BIGINT"}') |
  +----------------------------------------------------+
  |                                                  1 |
  +----------------------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT mle_set_session_state('{"decimal_type":"Number"}');
  +----------------------------------------------------+
  | mle_set_session_state('{"decimal_type":"Number"}') |
  +----------------------------------------------------+
  |                                                  1 |
  +----------------------------------------------------+
  1 row in set (0.00 sec)
  ```

  You can set the conversion type for a specific query prior to executing it using JavaScript API `Session` methods such as `sql()`, `runSql()`, and `prepare()`. See the description of `Session.sql()` for more information and examples.

You can obtain information about resource usage by the MLE component by querying the Performance Schema `memory_summary_by_thread_by_event_name` and `memory_summary_global_by_event_name` tables using the key `memory/language_component/session`, which tracks memory usage by each MLE user session. This key is provided by the MLE component; it is included in the `setup_instruments` table when the MLE component is installed, as shown here:

```
mysql> SELECT * FROM performance_schema.setup_instruments
     > WHERE NAME LIKE '%language_component%'\G
*************************** 1. row ***************************
         NAME: memory/language_component/session
      ENABLED: YES
        TIMED: NULL
   PROPERTIES: controlled_by_default
        FLAGS: controlled
   VOLATILITY: 0
DOCUMENTATION: Session-specific allocations for the Language component
1 row in set (0.00 sec)
```

Prior to creating executing or executing any JavaScript stored programs, queries, MLE remains inactive, so that using this key returns results which are empty, or consist chiefly of zeroes, like those shown here:

```
mysql> SELECT * FROM performance_schema.memory_summary_by_thread_by_event_name
    -> WHERE
    ->   EVENT_NAME = 'memory/language_component/session'
    ->     AND
    ->   COUNT_ALLOC < 0\G
Empty set (0.02 sec)

mysql> SELECT * FROM performance_schema.memory_summary_global_by_event_name
    -> WHERE EVENT_NAME LIKE 'memory/language_component/%'\G
*************************** 1. row ***************************
                  EVENT_NAME: memory/language_component/session
                 COUNT_ALLOC: 0
                  COUNT_FREE: 0
   SUM_NUMBER_OF_BYTES_ALLOC: 0
    SUM_NUMBER_OF_BYTES_FREE: 0
              LOW_COUNT_USED: 0
          CURRENT_COUNT_USED: 0
             HIGH_COUNT_USED: 0
    LOW_NUMBER_OF_BYTES_USED: 0
CURRENT_NUMBER_OF_BYTES_USED: 0
   HIGH_NUMBER_OF_BYTES_USED: 0
1 row in set (0.01 sec)
```

After invoking a JavaScript stored function, the same queries now reflect the memory consumed by MLE, as shown here:

```
mysql> SELECT * FROM performance_schema.memory_summary_by_thread_by_event_name
    -> WHERE
    ->   EVENT_NAME = 'memory/language_component/session'
    ->     AND
    ->   COUNT_ALLOC < 0\G
*************************** 1. row ***************************
                   THREAD_ID: 46
                  EVENT_NAME: memory/language_component/session
                 COUNT_ALLOC: 25
                  COUNT_FREE: 20
   SUM_NUMBER_OF_BYTES_ALLOC: 4445
    SUM_NUMBER_OF_BYTES_FREE: 2989
              LOW_COUNT_USED: 0
          CURRENT_COUNT_USED: 5
             HIGH_COUNT_USED: 14
    LOW_NUMBER_OF_BYTES_USED: 0
CURRENT_NUMBER_OF_BYTES_USED: 1456
   HIGH_NUMBER_OF_BYTES_USED: 3239
1 row in set (0.00 sec)

mysql> SELECT * FROM performance_schema.memory_summary_global_by_event_name
    -> WHERE EVENT_NAME LIKE 'memory/language_component/%'\G
*************************** 1. row ***************************
                  EVENT_NAME: memory/language_component/session
                 COUNT_ALLOC: 25
                  COUNT_FREE: 20
   SUM_NUMBER_OF_BYTES_ALLOC: 4445
    SUM_NUMBER_OF_BYTES_FREE: 2989
              LOW_COUNT_USED: 0
          CURRENT_COUNT_USED: 5
             HIGH_COUNT_USED: 14
    LOW_NUMBER_OF_BYTES_USED: 0
CURRENT_NUMBER_OF_BYTES_USED: 1456
   HIGH_NUMBER_OF_BYTES_USED: 3239
1 row in set (0.00 sec)
```

For more information about these and related Performance Schema tables, see Section 29.12.20.10, “Memory Summary Tables”.

Memory usage by the MLE component in a given user session is subject to the limit imposed by the `connection_memory_limit` server system variable. See the description of this variable for more information.
