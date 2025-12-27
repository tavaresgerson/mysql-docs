### 28.3.22 The INFORMATION\_SCHEMA LIBRARIES Table

The `LIBRARIES` table contains information about JavaScript and WebAssembly libraries known to the MLE JavaScript component (see Section 7.5.7, “Multilingual Engine Component (MLE)”")).

The `LIBRARIES` table has these columns:

* `LIBRARY_CATALOG`

  Library catalog name. Currently, this is always `def`.

* `LIBRARY_SCHEMA`

  Schema (database) to which the library belongs.

* `LIBRARY_NAME`

  Name of the library.

* `LIBRARY_DEFINITION`

  Text of the JavaScript library definition. For WebAssembly libraries, this column is empty.

* `LANGUAGE`

  Language. In MySQL 9.5, this is `JAVASCRIPT` or `WASM`.

* `CREATED`

  Library creation date and time.

* `LAST_ALTERED`

  Most recent date and time that the library was altered.

* `SQL_MODE`

  SQL mode in effect at time of creation (see Section 7.1.11, “Server SQL Modes”). This is a set consisting of none or any one or more of the following: `REAL_AS_FLOAT`, `PIPES_AS_CONCAT`, `ANSI_QUOTES`, `IGNORE_SPACE`, `ONLY_FULL_GROUP_BY`, `NO_UNSIGNED_SUBTRACTION`, `NO_DIR_IN_CREATE`, `ANSI`, `NO_AUTO_VALUE_ON_ZERO`, `NO_BACKSLASH_ESCAPES`, `STRICT_TRANS_TABLES`, `STRICT_ALL_TABLES`, `NO_ZERO_IN_DATE`, `NO_ZERO_DATE`, `ALLOW_INVALID_DATES`, `ERROR_FOR_DIVISION_BY_ZERO`, `TRADITIONAL`, `HIGH_NOT_PRECEDENCE`, `NO_ENGINE_SUBSTITUTION`, `PAD_CHAR_TO_FULL_LENGTH`, `TIME_TRUNCATE_FRACTIONAL`. The default is `ONLY_FULL_GROUP_BY, STRICT_TRANS_TABLES, NO_ZERO_IN_DATE, NO_ZERO_DATE, ERROR_FOR_DIVISION_BY_ZERO, NO_ENGINE_SUBSTITUTION`.

* `LIBRARY_COMMENT`

  Comment specified, if any, when the library was created (or last altered, using `ALTER LIBRARY`).

* `CREATOR`

  User account which created the library.

Example:

```
mysql> CREATE LIBRARY IF NOT EXISTS jslib.lib1 LANGUAGE JAVASCRIPT
    ->     AS $$
    $>       export function f(n) {
    $>         return n
    $>       }
    $>     $$;
Query OK, 0 rows affected (0.02 sec)

mysql> CREATE LIBRARY IF NOT EXISTS jslib.lib2 LANGUAGE JAVASCRIPT
    ->     AS $$
    $>       export function g(n) {
    $>         return n * 2
    $>       }
    $>     $$;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT * FROM information_schema.LIBRARIES
    -> WHERE LIBRARY_SCHEMA='jslib'\G
*************************** 1. row ***************************
   LIBRARY_CATALOG: def
    LIBRARY_SCHEMA: jslib
      LIBRARY_NAME: lib1
LIBRARY_DEFINITION:
      export function f(n) {
        return n
      }

          LANGUAGE: JAVASCRIPT
           CREATED: 2024-12-16 09:20:26
      LAST_ALTERED: 2024-12-16 09:20:26
          SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,
NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
           CREATOR: me@localhost
*************************** 2. row ***************************
   LIBRARY_CATALOG: def
    LIBRARY_SCHEMA: jslib
      LIBRARY_NAME: lib2
LIBRARY_DEFINITION:
      export function g(n) {
        return n * 2
      }

          LANGUAGE: JAVASCRIPT
           CREATED: 2024-12-16 09:20:26
      LAST_ALTERED: 2024-12-16 09:20:26
          SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,
NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
           CREATOR: me@localhost
2 rows in set (0.00 sec)
```
