### 27.3.8 Using JavaScript Libraries

This section provides information about and examples of use of JavaScript libraries in JavaScript stored programs as supported by the Multilingual Engine (MLE) in MySQL Enterprise Edition. (See Section 7.5.7, “Multilingual Engine Component (MLE)”")).

First we create a database `jslib`, and make it the current database, like this:

```
mysql> CREATE DATABASE IF NOT EXISTS jslib;
Query OK, 0 rows affected (0.02 sec)

mysql> USE jslib;
Database changed
```

Using the two `CREATE LIBRARY` statements shown here, we create two JavaScript libraries, each exporting one function. To be importable, the function must be declared with the `export` keyword. (This is true of all JavaScript values that you wish to import into another routine; see *export*, in the Mozilla Developer documentation for more information).

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
```

You can optionally declare one function within a given library as `export default`. In this case, the function must be called by the importing routine as `libname.default()`.

You can obtain general information about JavaScript libraries by querying the Information Schema `LIBRARIES` table; the Information Schema `ROUTINE_LIBRARIES` shows imports into stored routines. The rows corresponding to the libraries `jslib.lib1` and `jslib.lib2` in these two tables are shown by the following queries:

```
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

mysql> SELECT * FROM information_schema.ROUTINE_LIBRARIES
    -> WHERE LIBRARY_SCHEMA='jslib'\G
*************************** 1. row ***************************
ROUTINE_CATALOG: def
 ROUTINE_SCHEMA: jslib
   ROUTINE_NAME: foo
   ROUTINE_TYPE: FUNCTION
LIBRARY_CATALOG: def
 LIBRARY_SCHEMA: jslib
   LIBRARY_NAME: lib1
LIBRARY_VERSION: NULL
*************************** 2. row ***************************
ROUTINE_CATALOG: def
 ROUTINE_SCHEMA: jslib
   ROUTINE_NAME: foo
   ROUTINE_TYPE: FUNCTION
LIBRARY_CATALOG: def
 LIBRARY_SCHEMA: jslib
   LIBRARY_NAME: lib2
LIBRARY_VERSION: NULL
2 rows in set (0.00 sec)
```

The second query answers the question, “Which stored routines import from `jslib`, and what do they import?”

The `LIBRARIES` and `ROUTINE_LIBRARIES` tables are provided by the MLE component, and are not present if the component is not installed.

If you have the necessary privileges, you can also view a library's JavaScript code using the `SHOW CREATE LIBRARY` statement. See the description of this statement for more information and examples.

You can also use `SHOW LIBRARY STATUS` to obtain basic information about one or more JavaScript libraries, including name, database, creator (definer), and dates of creation and most recent modification. See Section 15.7.7.25, “SHOW LIBRARY STATUS Statement”, for more information and examples.

To create a JavaScript function that uses the two libraries, include the `USING` keyword together with a list of libraries to be imported as part of `CREATE FUNCTION`, like this:

```
mysql> CREATE FUNCTION foo(n INTEGER) RETURNS INTEGER LANGUAGE JAVASCRIPT
    ->         USING (jslib.lib1 AS mylib, jslib.lib2 AS yourlib)
    ->         AS $$
    $>           return mylib.f(n) + yourlib.g(n)
    $>         $$;
Query OK, 0 rows affected (0.00 sec)
```

The alias (`AS` keyword and clause) is generally optional, but if specified, you must use this for the library name when including functions from it in your own stored programs. A library identifier—the name, or its alias if there is one, exclusive of database name—must be unique within a given JavaScript stored function. You can use `AS` with `CREATE FUNCTION` to avoid name collisions between libraries. For example, to include a library named `ourlib` in the current database along with one having the same name but residing in the `other` database, you could use the statement shown here:

```
CREATE FUNCTION myfunc(x INTEGER) RETURNS INTEGER LANGUAGE JAVASCRIPT
    USING (ourlib, other.ourlib AS theirlib)
...
;
```

In the case just shown, there are two libraries having the same name; to avoid any conflicts, it is necessary to use an alias for at least one of them.

If one (or more) of the included libraries does not exist, or if the user does not have the required privileges to access it, the `CREATE FUNCTION` statement referencing it is rejected with an error.

References to an imported library within a JavaScript stored routine are expected to match the library name as declared. Note that the name as employed in the `USING` clause need not have the same lettercasing; for example, `USING (MY_LIB)` can be used to import a library named `my_lib`, although references to the library within the stored routine body must use `my_lib`.

You can verify that the function was created by checking the Information Schema `ROUTINES` table, with a query similar to that which is shown here:

```
mysql> SELECT
    ->   SPECIFIC_NAME, ROUTINE_NAME, ROUTINE_SCHEMA,
    ->   DATA_TYPE, ROUTINE_DEFINITION
    -> FROM information_schema.ROUTINES
    -> WHERE ROUTINE_NAME='foo'\G
*************************** 1. row ***************************
     SPECIFIC_NAME: foo
      ROUTINE_NAME: foo
    ROUTINE_SCHEMA: jslib
         DATA_TYPE: int
ROUTINE_DEFINITION:
      return mylib.f(n) + otherlib.g(n)
1 row in set (0.00 sec)
```

We can invoke the function just created just as we would any other stored function.

```
mysql> SELECT foo(2), foo(3), foo(-10), foo(1.5), foo(1.2);
+--------+--------+----------+----------+----------+
| foo(2) | foo(3) | foo(-10) | foo(1.5) | foo(1.2) |
+--------+--------+----------+----------+----------+
|      6 |      9 |      -30 |        6 |        3 |
+--------+--------+----------+----------+----------+
1 row in set (0.00 sec)
```

Because the input parameter is of type `INTEGER`, rounding as if using `Math.round()` takes place before the value is used in any calculations, 1.5 is evaluated as `2 + (2 * 2) = 6`, and 1.2 as `1 + (2 * 1) = 3`.

JavaScript syntax is checked at library creation time, as shown here:

```
mysql> CREATE LIBRARY IF NOT EXISTS jslib.lib3 LANGUAGE JAVASCRIPT
    ->     AS $$
    $>       export function f(n) {
    $>         return n $ 2
    $>       }
    $>     $$;
ERROR 6113 (HY000): JavaScript> SyntaxError: lib3:3:17 Expected ; but found $
        return n $ 2
                 ^
```

The `CREATE LIBRARY` statement executes successfully after correcting the typographical error, as shown here:

```
mysql> CREATE LIBRARY IF NOT EXISTS jslib.lib3 LANGUAGE JAVASCRIPT
    ->     AS $$
    $>       export function h(n) {
    $>         return n - 2
    $>       }
    $>     $$;
Query OK, 0 rows affected (0.01 sec)
```

It is also possible to perform dynamic imports, which do not have to be specified with a `USING` clause. You should be aware that a dynamic import returns a `Promise`; use `await` to obtain the imported library. In general, it is recommended that you use `await` to wait for any `Promise` created in your code.

You can use `await` in the top level of stored functions and stored procedures, as shown here:

```
mysql> CREATE DATABASE db1;
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE LIBRARY db1.lib1 LANGUAGE JAVASCRIPT
    -> AS $$
    $>   export function myAdd(x, y) {returns x + y}
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE FUNCTION use_dynamic_import() RETURNS INT LANGUAGE JAVASCRIPT
    -> AS $$
    $>   let m = await import("/db1/lib1")
    $>   return m.myAdd(1, 2)
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT use_dynamic_import();
+-----------------------+
| uses_dynamic_import() |
+-----------------------+
|                     3 |
+-----------------------+
1 row in set (0.00 sec)
```

Using `await` causes the `Promise` returned by `import()` to be resolved. Resolution can be pending, fulfilled, or rejected; a “resolved” or “settled” `Promise` is one that is no longer pending, and can be either fulfilled or rejected.

`import()` takes the path of the imported library, which must be a string of the form `"/db_name/lib_name"`; it returns a `Promise` of an ECMAScript module.

The following example demonstrates how you can determine which of multiple libraries to load at runtime. First we create two libraries—each of which exports multiple functions and objects, and has a default export—like this:

```
mysql> CREATE LIBRARY db1.lib_rectangle LANGUAGE JAVASCRIPT
    -> AS $$
    $>  export class Rectangle {
    $>    constructor(height, width) {
    $>      this.height = height
    $>      this.width = width
    $>    }
    $>    print() {
    $>      return "Rectangle of size " + this.height + " by " + this.width
    $>    }
    $>  }
    $>  export function area(x) {return x.height * x.width}
    $>  const r = new Rectangle(2, 3)
    $>  export default r
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE LIBRARY db1.lib_square LANGUAGE JAVASCRIPT
    -> AS $$
    $>  export class Square {
    $>    constructor(a) {
    $>      this.a = a
    $>    }
    $>    print() {return "Square of size " + this.a}
    $>  }
    $>  export function area(x) {return x.a * x.a}
    $>  const s = new Square(2)
    $>  export default s
    $> $$;
Query OK, 0 rows affected (0.01 sec)
```

The `printObject()` function determines the library to import at runtime, based on the value passed to it, as shown here:

```
mysql> CREATE FUNCTION printObject(object_type VARCHAR(16)) RETURNS TEXT LANGUAGE JAVASCRIPT
    -> AS $$
    $>  let module = await import(`/db1/lib_${object_type}`)
    $>  // both libraries have default exports with print methods
    $>  return module.default.print()
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT printObject("square");
+-----------------------+
| printObject("square") |
+-----------------------+
|      Square of size 2 |
+-----------------------+
1 row in set (0.00 sec)

mysql> SELECT printObject("rectangle");
+--------------------------+
| printObject("rectangle") |
+--------------------------+
| Rectangle of size 2 by 3 |
+--------------------------+
1 row in set (0.00 sec)
```

In addition, the namespace object returned after awaiting the `Promise` can be destructed like any other object; the default and other exports can easily be renamed for use within the importing stored program, as shown here:

```
mysql> CREATE FUNCTION computeRectangle() RETURNS INT LANGUAGE JAVASCRIPT
    -> AS $$
    $>  let {default: myRectangle, area: area} = await import(`/db1/lib_rectangle`)
    $>  return area(myRectangle)
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT computeRectangle();
+--------------------+
| computeRectangle() |
+--------------------+
|                  6 |
+--------------------+
1 row in set (0.00 sec)
```

It is possible to import libraries or portions of them into other libraries, as shown in this example where function `foo()` is imported from library `mylib` into library `theirlib` and used in a function `bar()` defined in `theirlib`, which is then imported into stored function `myfunc()` which invokes `bar()`:

```
mysql> CREATE LIBRARY mylib LANGUAGE JAVASCRIPT
    -> AS $$
    $>   export function foo(){return 42}
    $> $$;
Query OK, 0 rows affected (0.04 sec)

mysql> CREATE LIBRARY theirlib LANGUAGE JAVASCRIPT
    -> AS $$
    $>   import {foo} from "/db1/mylib"
    $>   export function bar(){return 2 * foo()}
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE FUNCTION myfunc(x INTEGER) RETURNS INT
    -> LANGUAGE JAVASCRIPT
    -> NO SQL
    -> USING (theirlib)
    -> AS $$
    $>   let result = theirlib.bar()
    $>
    $>   result += x
    $>
    $>   return result
    $> $$;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT myfunc(1), myfunc(10);
+-----------+------------+
| myfunc(1) | myfunc(10) |
+-----------+------------+
|        85 |         94 |
+-----------+------------+
1 row in set (0.00 sec)
```

Library functions can be invoked only within the library or stored routine into which their containing library is imported. For example, the following stored function `myfunc2()` imports `theirlib`, and `theirlib` imports `mylib`. The `CREATE FUNCTION` statement in this case succeeds, but a direct attempt to invoke a function originating in `mylib` is rejected at runtime, as shown here:

```
mysql> CREATE FUNCTION myfunc2(x INTEGER) RETURNS INT
    -> LANGUAGE JAVASCRIPT
    -> NO SQL
    -> USING (theirlib)
    -> AS $$
    $>   return mylib.foo()
    $> $$;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT myfunc2(1), myfunc2(10);
ERROR 6113 (HY000): JavaScript> ReferenceError: mylib is not defined
```

MLE JavaScript library code is executed only when invoked as part of a stored routine which includes the library. Library code is not executed by any of the following statements:

* `CREATE FUNCTION`
* `CREATE PROCEDURE`
* `CREATE LIBRARY`

For example, these are valid `CREATE LIBRARY` and `CREATE FUNCTION` statements, since the code is not actually executed:

```
mysql> CREATE LIBRARY my_lib LANGUAGE JAVASCRIPT
    -> AS $$
    $>   throw "MyError"
    $> $$;
Query OK, 0 rows affected (0.02 sec)

mysql> CREATE FUNCTION my_func(x INTEGER)
    -> RETURNS INTEGER LANGUAGE JAVASCRIPT NO SQL
    -> USING(my_lib)
    -> AS $$
    $>   return x * 10
    $> $$;
Query OK, 0 rows affected (0.02 sec)
```

Invoking the function that imports the library actually invokes the library code, which causes an error, as shown here:

```
mysql> SELECT my_func(8);
ERROR 6113 (HY000): JavaScript> MyError
```
