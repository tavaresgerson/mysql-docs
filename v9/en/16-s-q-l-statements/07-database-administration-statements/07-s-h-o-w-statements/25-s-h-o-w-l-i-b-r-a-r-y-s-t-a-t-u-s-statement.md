#### 15.7.7.25 SHOW LIBRARY STATUS Statement

```
SHOW LIBRARY STATUS
    [LIKE 'pattern' | WHERE expr]
```

This statement provides information about one or more JavaScript libraries. Like `SHOW FUNCTION STATUS` and `SHOW PROCEDURE STATUS`, it supports `LIKE` and `WHERE` clauses for filtering the output. See Section 15.7.7.31, “SHOW PROCEDURE STATUS Statement”, for information about how these clauses work.

`SHOW LIBRARY STATUS` contains the following columns:

* `Db`

  The name of the database containing the library.

* `Name`

  The name of the library.

* `Type`

  The library's type. This is always `LIBRARY`.

* `Creator`

  The account which created the library.

* `Modified`

  Timestamp showing when the library was last modified.

* `Created`

  Timestamp showing when the library was created.

* `Comment`

  Comment text, if any.

Example:

```
mysql> SHOW LIBRARY STATUS LIKE 'my_lib'\G
*************************** 1. row ***************************
                  Db: test
                Name: my_lib
                Type: LIBRARY
             Creator: jon@localhost
            Modified: 2025-03-21 08:42:17
             Created: 2025-01-13 17:24:08
             Comment: This is my_lib. There are many others like it, but
                      this one is mine.
1 row in set (0.00 sec)
```

See Section 27.3.8, “Using JavaScript Libraries”, for more information.
