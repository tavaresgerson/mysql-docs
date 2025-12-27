#### 27.3.6.10 Stored Routine API

Two functions, listed here, provide JavaScript [`Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) objects reflecting MySQL stored routines:

* `getFunction()`: Get a `Function` instance given the name of a stored function.

* `getProcedure()`: Get a `Function` instance given the name of a stored procedure.

Use the `close()` method to close the resource associated with the stored routine. An error is thrown if the routine, after it is closed, is called again, or if its `close()` method is called again.

The following example creates two stored functions `getArea()` and `getDiag()`, then creates and runs a JavaScript stored procedure procRect which uses these functions by instantiating them and executing them by means of `Function` objects.

```
mysql> CREATE FUNCTION getArea(w INT, h INT)
    -> RETURNS INT DETERMINISTIC
    -> RETURN w * h;
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE FUNCTION getDiag(w INT, h INT)
    ->   RETURNS FLOAT DETERMINISTIC
    ->   RETURN Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE PROCEDURE procRect(IN x INT, IN y INT) LANGUAGE JAVASCRIPT
    -> AS $$
    $>   console.clear()
    $>
    $>   let s = session.getDefaultSchema()
    $>   let f = s.getFunction("getArea")
    $>   let g = s.getFunction("getDiag")
    $>
    $>   let a = x
    $>   let b = y
    $>
    $>   console.log (
    $>                 "Width: " + a + ", Height: " + b + "; Area: " +
    $>                 f(a,b) + "; Diagonal: " + g(a,b)
    $>               )
    $>
    $>   f.close()
    $>   g.close()
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> CALL procRect(5, 10);
Query OK, 0 rows affected (0.03 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state("stdout"): Width: 5, Height: 10; Area: 50; Diagonal: 11.180339813232422

1 row in set (0.00 sec)

mysql> CALL procRect(2, 25);
Query OK, 0 rows affected (0.02 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state("stdout"): Width: 2, Height: 25; Area: 50; Diagonal: 25.079872131347656

1 row in set (0.00 sec)
```

For stored functions, arguments are simply passed by value, as shown in the examples just shown with `getDiag()` and `getArea()`. For stored procedures, argument handling is as follows:

* `IN` parameter: Parameter values are passed directly.

* `OUT` or `INOUT` parameter: It is necessary to create a placeholder, using the `mysql.arg()`") function, in which to store the output value for the parameter. `my.arg()` is discussed in the next few paragraphs of this section.

**mysql.arg().** This function is always called as a method of the global `mysql` object. It creates an `Argument` object, which can be assigned a value on creation, or by a procedure call. Afterwards, the value can be retrieved as `argument.val`. This is shown in the following example, where argument instances `a` and `b` are created in `use_my_proc()` to act as placeholders for `y` and `z` in `my_proc()`:

```
mysql> CREATE PROCEDURE my_proc(
    ->   IN x INT,
    ->   OUT y VARCHAR(20),
    ->   INOUT z TEXT
    -> )
    -> LANGUAGE JAVASCRIPT
    -> AS $$
    $>     y = "Hello world " + x
    $>     z += "Hello again JS"
    $> $$;
Query OK, 0 rows affected (0.04 sec)

mysql> CREATE PROCEDURE use_my_proc() LANGUAGE JAVASCRIPT
    -> AS $$
    $>     console.clear()
    $>
    $>     let s = session.getDefaultSchema()
    $>     let p = s.getProcedure("my_proc")
    $>
    $>     let a = mysql.arg()
    $>     let b = mysql.arg("World ")
    $>
    $>     p(42, a, b)
    $>
    $>     console.log(a.val)
    $>     console.log(b.val)
    $>
    $>     p.close()
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> CALL use_my_proc();
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state("stdout"): Hello world 42
World Hello again JS

1 row in set (0.00 sec)
```

Note

An `Argument` can be instantiated only by calling `mysql.arg()`, and accessed only through its `val` property. It is otherwise inaccessible.

Equivalents between the MySQL types of `OUT` or `INOUT` parameters and JavaScript types are shown in the following table:

<table border="1" class="informaltable" summary="Descriptive text"><colgroup><col/><col/><col/></colgroup><thead><tr><th scope="col">MySQL Type</th><th scope="col">Javascript Type</th><th scope="col">Notes</th></tr></thead><tbody><tr><td scope="row"><code class="literal">NULL</code></td><td><code class="literal">null</code></td><td>-</td></tr><tr><td scope="row"><a class="link" href="integer-types.html" title="13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"><code class="literal">BIGINT</code></a></td><td><code class="literal">Number</code>, <code class="literal">String</code>, <code class="literal">BigInt</code></td><td>Depends on <a class="link" href="srjsapi-session.html#srjsapi-session-sql"><code class="literal">session.sql()</code></a> method <code class="literal">integerType</code> option value</td></tr><tr><td scope="row"><a class="link" href="fixed-point-types.html" title="13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC"><code class="literal">DECIMAL</code></a></td><td>-</td><td>Error: Unsupported type</td></tr><tr><td scope="row"><a class="link" href="floating-point-types.html" title="13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE"><code class="literal">DOUBLE</code></a></td><td><code class="literal">Number</code></td><td>-</td></tr><tr><td scope="row">Binary string (<a class="link" href="binary-varbinary.html" title="13.3.3 The BINARY and VARBINARY Types"><code class="literal">BINARY</code></a>, <a class="link" href="blob.html" title="13.3.4 The BLOB and TEXT Types"><code class="literal">BLOB</code></a>)</td><td><code class="literal">Uint8Array</code></td><td>-</td></tr><tr><td scope="row">Non-binary string (<a class="link" href="blob.html" title="13.3.4 The BLOB and TEXT Types"><code class="literal">TEXT</code></a>)</td><td><code class="literal">String</code></td><td>-</td></tr><tr><td scope="row"><a class="link" href="vector.html" title="13.3.5 The VECTOR Type"><code class="literal">VECTOR</code></a></td><td><code class="literal">Float32Array</code></td><td>-</td></tr><tr><td scope="row"><a class="link" href="json.html" title="13.5 The JSON Data Type"><code class="literal">JSON</code></a></td><td><code class="literal">Object</code></td><td>-</td></tr><tr><td scope="row"><a class="link" href="datetime.html" title="13.2.2 The DATE, DATETIME, and TIMESTAMP Types"><code class="literal">DATE</code></a>, <a class="link" href="datetime.html" title="13.2.2 The DATE, DATETIME, and TIMESTAMP Types"><code class="literal">DATETIME</code></a>, <a class="link" href="datetime.html" title="13.2.2 The DATE, DATETIME, and TIMESTAMP Types"><code class="literal">TIMESTAMP</code></a></td><td><code class="literal">Date</code></td><td>-</td></tr><tr><td scope="row"><a class="link" href="enum.html" title="13.3.6 The ENUM Type"><code class="literal">ENUM</code></a></td><td><code class="literal">String</code></td><td>-</td></tr><tr><td scope="row"><a class="link" href="set.html" title="13.3.7 The SET Type"><code class="literal">SET</code></a></td><td><code class="literal">Set</code> (<code class="literal">String</code>)</td><td>JavaScript <code class="literal">Set</code> can be converted to a comma-delimited string</td></tr></tbody></table>
