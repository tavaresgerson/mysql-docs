### 27.3.12 JavaScript Stored Program Examples

This section contains examples illustrating a number of different aspects of using JavaScript programs under various circumstances.

The following example demonstrates the use of a JavaScript stored function with table column values. First we define a stored function `gcd()` which finds the greatest common denominator of two integers, shown here:

```
mysql> CREATE FUNCTION gcd(a INT, b INT)
    -> RETURNS INT NO SQL LANGUAGE JAVASCRIPT AS
    -> $mle$
    $>   let x = Math.abs(a)
    $>   let y = Math.abs(b)
    $>   while(y) {
    $>     var t = y
    $>     y = x % y
    $>     x = t
    $>   }
    $>   return x
    $> $mle$
    -> ;
Query OK, 0 rows affected (0.01 sec)
```

We can test the stored function, like this:

```
mysql> SELECT gcd(75, 220), gcd(75, 225);
+--------------+--------------+
| gcd(75, 220) | gcd(75, 225) |
+--------------+--------------+
|            5 |           75 |
+--------------+--------------+
1 row in set (0.00 sec)
```

Next we create a table `t1` with two integer columns and populate it with a few rows, like this:

```
mysql> CREATE TABLE t1 (c1 INT, c2 INT);
Query OK, 0 rows affected (0.02 sec)

mysql> INSERT INTO t1 VALUES ROW(12,70), ROW(17,3), ROW(81,9);
Query OK, 3 rows affected (0.01 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> TABLE t1;
+------+------+
| c1   | c2   |
+------+------+
|   12 |   70 |
|   17 |    3 |
|   81 |    9 |
+------+------+
3 rows in set (0.00 sec)
```

Now we can select from `t1`, using the `gcd()` function with the column values serving as argument values in the function call, as shown here:

```
mysql> SELECT c1, c2, gcd(c1, c2) AS G
    -> FROM t1
    -> WHERE gcd(c1, c2) > 1
    -> ORDER BY gcd(c1, c2);
+----+----+---+
| c1 | c2 | G |
+----+----+---+
| 12 | 70 | 2 |
| 81 |  9 | 9 |
+----+----+---+
8 rows in set (0.01 sec)
```

An argument value that is not of the specified type is coerced to the correct type when possible, as shown here:

```
mysql> SELECT gcd(500.3, 600), gcd(500.5, 600);
+-----------------+-----------------+
| gcd(500.3, 600) | gcd(500.5, 600) |
+-----------------+-----------------+
|             100 |               3 |
+-----------------+-----------------+
1 row in set (0.01 sec)
```

Rounding of floating point values to integers is accomplished using `Math.round()`; in this case, 500.3 is rounded down to 500, but 500.5 is rounded up to 501.

Next, we create a simple JavaScript stored procedure using a `CREATE PROCEDURE` statement that includes an `OUT` parameter for passing the current date and time in a human-readable format to a user variable. Since we are not certain how long this representation is, we use VARCHAR(25) for the parameter's type.

```
mysql> CREATE PROCEDURE d1 (OUT res VARCHAR(25))
    -> LANGUAGE JAVASCRIPT
    -> AS
    -> $$
    $>   let d = new Date().toString()
    $>   res = d
    $> $$
    -> ;
Query OK, 0 rows affected (0.01 sec)
```

We can now test the stored procedure, first verifying that the user variable @today has not yet been set to any value, like this:

```
mysql> SELECT @today;
+----------------------+
| @today               |
+----------------------+
| NULL                 |
+----------------------+
1 row in set (0.01 sec)

mysql> CALL d1(@today);
ERROR 1406 (22001): Data too long for column 'res' at row 1
```

The procedure is syntactically valid, but the data type of the `INOUT` parameter (`res`) does not allow for a sufficient number of characters; rather than truncating the value, the stored program rejects it. Since it is not possible to alter procedure code in place, we must drop the procedure and re-create it; this time we try doubling the length specified for the `INOUT` parameter:

```
mysql> DROP PROCEDURE d1;
Query OK, 0 rows affected (0.02 sec)

mysql> CREATE PROCEDURE d1 (OUT res VARCHAR(50))
    -> LANGUAGE JAVASCRIPT
    -> AS
    -> $$
    $>   let d = new Date().toString()
    $>   res = d
    $> $$
    -> ;
Query OK, 0 rows affected (0.01 sec)
```

Now we can repeat the test, like this:

```
mysql> SELECT @today;
+----------------------+
| @today               |
+----------------------+
| NULL                 |
+----------------------+
1 row in set (0.01 sec)
```

Prior to invoking the updated procedure with `CALL`, the value of `@today` remains unset, since the original version of `d1()` did not execute successfully. The updated version runs successfully, and we see afterwards that, this time, the value of the user variable is set as expected:

```
mysql> CALL d1(@today);
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @today;
+-----------------------------------------+
| @today                                  |
+-----------------------------------------+
| Mon Oct 30 2023 20:47:29 GMT+0000 (GMT) |
+-----------------------------------------+
1 row in set (0.00 sec)
```

Note

The value that you obtain from running this example is likely to differ to some extent from what is shown here, since the exact representation of dates is dependent upon your system locale, and possibly other settings. See the documentation for the JavaScript `Date` object for more information.

The next example demonstrates the use of a JavaScript stored function in a trigger.

First we create a table `t2` containing three integer columns, like this:

```
mysql> CREATE TABLE t2 (c1 INT, c2 INT, c3 INT);
Query OK, 0 rows affected (0.04 sec)
```

Now we can create a trigger on this table. This must be done using a `CREATE TRIGGER` statement written in the usual way using SQL (see Section 27.4, “Using Triggers”), but it can make use of stored routines written in JavaScript, such as the `js_pow()` function shown earlier in this section.

```
mysql> delimiter //
mysql> CREATE TRIGGER jst BEFORE INSERT ON t2
    -> FOR EACH ROW
    -> BEGIN
    ->   SET NEW.c2 = js_pow(NEW.c1, 2);
    ->   SET NEW.c3 = js_pow(NEW.c1, 3);
    -> END;
    -> //
Query OK, 0 rows affected (0.02 sec)

mysql> delimiter ;
mysql>
```

This trigger acts when a row is inserted into `t2`, taking the value inserted into the first column and inserting the square of this value into the second column, and its cube into the third. We test the trigger by inserting a few rows into the table; since the only value that is not thrown away is that which we supply for column `c1`, we can simply use `NULL` for each of the remaining two columns, as shown here:

```
mysql> INSERT INTO t2
    -> VALUES
    ->   ROW(1, NULL, NULL),
    ->   ROW(2.49, NULL, NULL),
    ->   ROW(-3, NULL, NULL),
    ->   ROW(4.725, NULL, NULL);
Query OK, 4 rows affected (0.01 sec)
Records: 4  Duplicates: 0  Warnings: 0
```

Since the function invoked by the trigger was written in JavaScript, JavaScript rounding rules apply, so that 2.49 is rounded down to 2, and 4.75 is rounded up to 5. We can see that this is the case when we check the result using a `TABLE` statement:

```
mysql> TABLE t2;
+------+------+------+
| c1   | c2   | c3   |
+------+------+------+
|    1 |    1 |    1 |
|    2 |    4 |    8 |
|   -3 |    9 |  -27 |
|    5 |   25 |  125 |
+------+------+------+
4 rows in set (0.00 sec)
```

The following examples demonstrate some of the basics of working with `VECTOR` values in MySQL JavaScript stored programs. We start by creating a table `v1` which contains a `VECTOR` column `c1`, like this:

```
mysql> CREATE TABLE v1 (
    ->   c1 VECTOR(3)
    -> );
Query OK, 0 rows affected (0.02 sec)
```

To insert some values into this table, we create a JavaScript stored procedure `vxin` that takes as its argument a string representation of a vector, converts it to a `VECTOR` value, and inserts it. We then call this procedure a number of times, as shown here:

```
mysql> CREATE PROCEDURE vxin (IN val VARCHAR(100))
    -> LANGUAGE JAVASCRIPT
    ->   AS $$
    $>     let q = "INSERT INTO v1 VALUES("
    $>     q += "STRING_TO_VECTOR(\"" + val + "\")"
    $>     q += ")"
    $>
    $>     let s = session.sql(q)
    $>
    $>     s.execute()
    $>   $$;
Query OK, 0 rows affected (0.00 sec)

mysql> CALL vxin("[50, 100, 50]");
Query OK, 1 row affected (0.01 sec)

mysql> CALL vxin("[100, 0, -50]");
Query OK, 1 row affected (0.00 sec)

mysql> CALL vxin("[250, 350, 450]");
Query OK, 1 row affected (0.01 sec)
```

After `v1` has been populated, the output from `TABLE v1` looks like this:

```
mysql> TABLE v1;
+----------------------------+
| c1                         |
+----------------------------+
| 0x000048420000C84200004842 |
| 0x0000C84200000000000048C2 |
| 0x00007A430000AF430000E143 |
+----------------------------+
3 rows in set (0.00 sec)
```

Next, we create a JavaScript stored procedure **`vxout1`**, which selects all of the rows in **`v1`**, retrieving the column values and writing them to `stdout`. The `CREATE PROCEDURE` statement used to create this procedure is shown here:

```
mysql> CREATE PROCEDURE vxout1 ()
    -> LANGUAGE JAVASCRIPT
    ->   AS $$
    $>     let s = session.sql("TABLE v1");
    $>
    $>     let res = s.execute()
    $>
    $>     console.log(res.getColumnNames())
    $>
    $>     let row = res.fetchOne()
    $>
    $>     while(row) {
    $>       console.log(row.toArray())
    $>       row = res.fetchOne()
    $>     }
    $>   $$;
Query OK, 0 rows affected (0.00 sec)
```

We can test this procedure like this:

```
mysql> SELECT mle_session_reset();
+------------------------------------------+
| mle_session_reset()                      |
+------------------------------------------+
| The session state is successfully reset. |
+------------------------------------------+
1 row in set (0.00 sec)

mysql> CALL vxout1();
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state("stdout"): c1
50,100,50
100,0,-50
250,350,450

1 row in set (0.00 sec)
```

You might be expecting to see the same binary representations shown in the output of the `TABLE` statement. Because JavaScript treats a `VECTOR` value as an array (an instance of `Float32Array`), it is displayed using array format. You can use the SQL `HEX()` function to force such values to be displayed using binary notation, if desired, like this:

```
mysql> CREATE PROCEDURE vxout2 ()
    -> LANGUAGE JAVASCRIPT
    ->   AS $$
    $>     let s = session.sql("SELECT HEX(c1) FROM v1");
    $>
    $>     let res = s.execute()
    $>
    $>     console.log(res.getColumnNames())
    $>
    $>     let row = res.fetchOne()
    $>
    $>     while(row) {
    $>       console.log(row.toArray())
    $>       row = res.fetchOne()
    $>     }
    $>   $$;
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_reset();
+------------------------------------------+
| mle_session_reset()                      |
+------------------------------------------+
| The session state is successfully reset. |
+------------------------------------------+
1 row in set (0.00 sec)

mysql> CALL vxout2();
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state("stdout"): HEX(c1)
000048420000C84200004842
0000C84200000000000048C2
00007A430000AF430000E143

1 row in set (0.00 sec)
```

The display format notwithstanding, `VECTOR` values are handled as vectors, and not as strings or arrays, as we can see from the following example which employs the (MySQL HeatWave-only) `DISTANCE()` function. First we create and populate a table `v2` containing two `VECTOR` columns, using the SQL statements shown here:

```
CREATE TABLE v2 (
  c1 VECTOR(3),
  c2 VECTOR(3)
);

INSERT INTO v2 VALUES
  ROW(STRING_TO_VECTOR("[50, 100, 50]"), STRING_TO_VECTOR("[0, 200, 0]")),
  ROW(STRING_TO_VECTOR("[100, 0, -50]"), STRING_TO_VECTOR("[5, 10, 5]")),
  ROW(STRING_TO_VECTOR("[250, 350, 450]"), STRING_TO_VECTOR("[-150, 1000, 50]"))
;
```

The following query shows the dot product of the two vectors in each row:

```
mysql> SELECT VECTOR_DISTANCE(c1, c2, "DOT") AS d FROM v2;
+--------+
| d      |
+--------+
|  20000 |
|    250 |
| 335000 |
+--------+
3 rows in set (0.00 sec)
```

Note

The dot product of two vectors is defined as the sum of the products of their components, in order. For example, for the vectors in the second row in table `v5` (`[100, 0, -50]` and `[5, 10, 5]`), the dot product is `(100)(5) + (0)(10) + (-50)(5) = 500 + 0 - 250 = 250`.

You can write your own JavaScript function for obtaining the dot product of two vectors, similar to this one:

```
mysql> CREATE FUNCTION dot_product (v1 VECTOR, v2 VECTOR)
    -> RETURNS FLOAT DETERMINISTIC
    -> LANGUAGE JAVASCRIPT
    ->   AS $$
    $>     if(v1.length !== v2.length)
    $>       throw new Error('Vectors must be of the same length')
    $>
    $>     let dot = 0, i=0
    $>
    $>     for(i=0; i<v1.length; i++)
    $>       dot += v1[i]*v2[i]
    $>
    $>     return dot
    $>   $$;

mysql> SELECT dot_product(c1, c2) AS dot FROM v5\G
*************************** 1. row ***************************
dot: 20000
*************************** 2. row ***************************
dot: 250
*************************** 3. row ***************************
dot: 335000
```

Next, we create a JavaScript stored procedure `vxout5` that executes the same query, like this:

```
mysql> CREATE PROCEDURE vxout5 ()
    -> LANGUAGE JAVASCRIPT
    ->   AS $$
    $>     let s = session.sql("SELECT VECTOR_DISTANCE(c1, c2, \"DOT\") AS d FROM v5");
    $>
    $>     let res = s.execute()
    $>
    $>     console.log(res.getColumnNames())
    $>
    $>     let row = res.fetchOne()
    $>
    $>     while(row) {
    $>       console.log(row.toArray())
    $>       row = res.fetchOne()
    $>     }
    $>   $$;
Query OK, 0 rows affected (0.01 sec)
```

When we run `vxout5` (first clearing the session state using `mle_session_reset()` as before), we can see that the column values from `v5` are handled as vectors, with the same result as from running the query directly in the **mysql** client:

```
mysql> SELECT mle_session_reset();
+------------------------------------------+
| mle_session_reset()                      |
+------------------------------------------+
| The session state is successfully reset. |
+------------------------------------------+
1 row in set (0.00 sec)

mysql> CALL vxout5();
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state("stdout"): d
20000
250
335000

1 row in set (0.00 sec)
```
