### 27.3.11 JavaScript Stored Program Limitations and Restrictions

MySQL JavaScript stored programs are subject to the limitations and restrictions described in this section.

The `Global` object and the `globalThis` object property are supported, but their scope is limited to that of the current routine. For example, if a given JavaScript program sets `globalThis.myProp = 10`, this is not available to other JavaScript programs, even within the same session, and accessing `globalThis.myProp` in subsequent invocations of the same JavaScript program does not yield the same value.

A JavaScript variable, local or global, defined in one stored program is not accessible from any other connection executing the same program.

Neither file access nor network access from JavaScript stored program code is supported. JavaScript stored programs in MySQL do not provide for the use of third-party modules; for this reason, the `import` statement is not supported. In addition, there is no support for Node.js.

The MLE component uses a single-threaded execution model (one thread per query). This means that all asynchronous features like the JavaScript `Promise` object and `async` functions are simulated and can exhibit non-deterministic behavior. Promises which are not awaited are not processed until the end of stored program execution, which means that they are not able to impact the values of return arguments in stored functions or those of output arguments in stored procedures.

As with SQL stored routines, JavaScript stored routines with a variable number of arguments are not supported; each argument and its type must be specified at creation time. JavaScript functions within routines can have a variable number of arguments.

It is possible to call other stored programs from within the body of JavaScript stored program, and to invoke a JavaScript stored program from within SQL stored programs, including stored procedures, stored functions, events, and triggers, as shown elsewhere (see Section 27.3.12, “JavaScript Stored Program Examples”). JavaScript stored programs can also call themselves recursively; it is possible to call a pure JavaScript function or method recursively within a JavaScript stored program, as shown here:

```
mysql> CREATE FUNCTION recursive_sum(my_num INT)
    ->   RETURNS INT NO SQL LANGUAGE JAVASCRIPT AS
    -> $$
    $>   function sum(n) {
    $>     if(n <= 1) return n
    $>     else return n + sum(--n)
    $>   }
    $>
    $>   let x = sum(my_num)
    $>   return x
    $> $$
    -> ;
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT recursive_sum(1), recursive_sum(2),
    ->        recursive_sum(20), recursive_sum(100)\G
*************************** 1. row ***************************
  recursive_sum(1): 1
  recursive_sum(2): 3
 recursive_sum(20): 210
recursive_sum(100): 5050
1 row in set (0.00 sec)
```

The recursion depth is limited to 1000. Excessive recursion may cause a program to fail, like this:

```
mysql> SELECT recursive_sum(1000);
ERROR 6113 (HY000): JavaScript> Maximum frame limit of 1000 exceeded. Frames on stack: 1001.
```

JavaScript stored programs are supported by MySQL Replication, subject to the condition that the MLE component is installed on every server in the topology. For more information, see Section 19.5.1.18, “Replication and JavaScript Stored Programs”.
