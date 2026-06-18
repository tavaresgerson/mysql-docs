### 10.13.1 Measuring the Speed of Expressions and Functions

To measure the speed of a specific MySQL expression or function,
invoke the [`BENCHMARK()`](information-functions.html#function_benchmark) function
using the [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") client program. Its syntax is
[`BENCHMARK(loop_count,expr)`](information-functions.html#function_benchmark).
The return value is always zero, but [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client")
prints a line displaying approximately how long the statement
took to execute. For example:

```
mysql> SELECT BENCHMARK(1000000,1+1);
+------------------------+
| BENCHMARK(1000000,1+1) |
+------------------------+
|                      0 |
+------------------------+
1 row in set (0.32 sec)
```

This result was obtained on a Pentium II 400MHz system. It shows
that MySQL can execute 1,000,000 simple addition expressions in
0.32 seconds on that system.

The built-in MySQL functions are typically highly optimized, but
there may be some exceptions.
[`BENCHMARK()`](information-functions.html#function_benchmark) is an excellent tool
for finding out if some function is a problem for your queries.