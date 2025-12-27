## 14.21 Performance Schema Functions

MySQL includes built-in SQL functions that format or retrieve Performance Schema data, and that may be used as equivalents for the corresponding `sys` schema stored functions. The built-in functions can be invoked in any schema and require no qualifier, unlike the `sys` functions, which require either a `sys.` schema qualifier or that `sys` be the current schema.

**Table 14.31 Performance Schema Functions**

<table><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>FORMAT_BYTES()</code></td> <td> Convert byte count to value with units </td> </tr><tr><td><code>FORMAT_PICO_TIME()</code></td> <td> Convert time in picoseconds to value with units </td> </tr><tr><td><code>PS_CURRENT_THREAD_ID()</code></td> <td> Performance Schema thread ID for current thread </td> </tr><tr><td><code>PS_THREAD_ID()</code></td> <td> Performance Schema thread ID for given thread </td> </tr></tbody></table>

The built-in functions supersede the corresponding `sys` functions, which are deprecated; expect them to be removed in a future version of MySQL. Applications that use the `sys` functions should be adjusted to use the built-in functions instead, keeping in mind some minor differences between the `sys` functions and the built-in functions. For details about these differences, see the function descriptions in this section.

*  `FORMAT_BYTES(count)`

  Given a numeric byte count, converts it to human-readable format and returns a string consisting of a value and a units indicator. The string contains the number of bytes rounded to 2 decimal places and a minimum of 3 significant digits. Numbers less than 1024 bytes are represented as whole numbers and are not rounded. Returns `NULL` if *`count`* is `NULL`.

  The units indicator depends on the size of the byte-count argument as shown in the following table.

  <table><col style="width: 30%"/><col style="width: 25%"/><col style="width: 45%"/><thead><tr> <th>Argument Value</th> <th>Result Units</th> <th>Result Units Indicator</th> </tr></thead><tbody><tr> <th>Up to 1023</th> <td>bytes</td> <td>bytes</td> </tr><tr> <th>Up to 1024<sup>2</sup> − 1</th> <td>kibibytes</td> <td>KiB</td> </tr><tr> <th>Up to 1024<sup>3</sup> − 1</th> <td>mebibytes</td> <td>MiB</td> </tr><tr> <th>Up to 1024<sup>4</sup> − 1</th> <td>gibibytes</td> <td>GiB</td> </tr><tr> <th>Up to 1024<sup>5</sup> − 1</th> <td>tebibytes</td> <td>TiB</td> </tr><tr> <th>Up to 1024<sup>6</sup> − 1</th> <td>pebibytes</td> <td>PiB</td> </tr><tr> <th>1024<sup>6</sup> and up</th> <td>exbibytes</td> <td>EiB</td> </tr></tbody></table>

  ```
  mysql> SELECT FORMAT_BYTES(512), FORMAT_BYTES(18446644073709551615);
  +-------------------+------------------------------------+
  | FORMAT_BYTES(512) | FORMAT_BYTES(18446644073709551615) |
  +-------------------+------------------------------------+
  |  512 bytes        | 16.00 EiB                          |
  +-------------------+------------------------------------+
  ```

   `FORMAT_BYTES()` may be used instead of the `sys` schema `format_bytes()` Function") function, keeping in mind this difference:

  +  `FORMAT_BYTES()` uses the `EiB` units indicator. `sys.format_bytes()` Function") does not.
*  `FORMAT_PICO_TIME(time_val)`

  Given a numeric Performance Schema latency or wait time in picoseconds, converts it to human-readable format and returns a string consisting of a value and a units indicator. The string contains the decimal time rounded to 2 decimal places and a minimum of 3 significant digits. Times under 1 nanosecond are represented as whole numbers and are not rounded.

  If *`time_val`* is `NULL`, this function returns `NULL`.

  The units indicator depends on the size of the time-value argument as shown in the following table.

  <table><col style="width: 30%"/><col style="width: 25%"/><col style="width: 45%"/><thead><tr> <th>Argument Value</th> <th>Result Units</th> <th>Result Units Indicator</th> </tr></thead><tbody><tr> <th>Up to 10<sup>3</sup> − 1</th> <td>picoseconds</td> <td>ps</td> </tr><tr> <th>Up to 10<sup>6</sup> − 1</th> <td>nanoseconds</td> <td>ns</td> </tr><tr> <th>Up to 10<sup>9</sup> − 1</th> <td>microseconds</td> <td>us</td> </tr><tr> <th>Up to 10<sup>12</sup> − 1</th> <td>milliseconds</td> <td>ms</td> </tr><tr> <th>Up to 60×10<sup>12</sup> − 1</th> <td>seconds</td> <td>s</td> </tr><tr> <th>Up to 3.6×10<sup>15</sup> − 1</th> <td>minutes</td> <td>min</td> </tr><tr> <th>Up to 8.64×10<sup>16</sup> − 1</th> <td>hours</td> <td>h</td> </tr><tr> <th>8.64×10<sup>16</sup> and up</th> <td>days</td> <td>d</td> </tr></tbody></table>

  ```
  mysql> SELECT FORMAT_PICO_TIME(3501), FORMAT_PICO_TIME(188732396662000);
  +------------------------+-----------------------------------+
  | FORMAT_PICO_TIME(3501) | FORMAT_PICO_TIME(188732396662000) |
  +------------------------+-----------------------------------+
  | 3.50 ns                | 3.15 min                          |
  +------------------------+-----------------------------------+
  ```

   `FORMAT_PICO_TIME()` may be used instead of the `sys` schema `format_time()` Function") function, keeping in mind these differences:

  + To indicate minutes, `sys.format_time()` Function") uses the `m` units indicator, whereas `FORMAT_PICO_TIME()` uses `min`.
  +  `sys.format_time()` Function") uses the `w` (weeks) units indicator. `FORMAT_PICO_TIME()` does not.
*  `PS_CURRENT_THREAD_ID()`

  Returns a `BIGINT UNSIGNED` value representing the Performance Schema thread ID assigned to the current connection.

  The thread ID return value is a value of the type given in the `THREAD_ID` column of Performance Schema tables.

  Performance Schema configuration affects `PS_CURRENT_THREAD_ID()` the same way as for  `PS_THREAD_ID()`. For details, see the description of that function.

  ```
  mysql> SELECT PS_CURRENT_THREAD_ID();
  +------------------------+
  | PS_CURRENT_THREAD_ID() |
  +------------------------+
  |                     52 |
  +------------------------+
  mysql> SELECT PS_THREAD_ID(CONNECTION_ID());
  +-------------------------------+
  | PS_THREAD_ID(CONNECTION_ID()) |
  +-------------------------------+
  |                            52 |
  +-------------------------------+
  ```

   `PS_CURRENT_THREAD_ID()` may be used as a shortcut for invoking the `sys` schema  `ps_thread_id()` Function") function with an argument of `NULL` or `CONNECTION_ID()`.
*  `PS_THREAD_ID(connection_id)`

  Given a connection ID, returns a `BIGINT UNSIGNED` value representing the Performance Schema thread ID assigned to the connection ID, or `NULL` if no thread ID exists for the connection ID. The latter can occur for threads that are not instrumented, or if *`connection_id`* is `NULL`.

  The connection ID argument is a value of the type given in the `PROCESSLIST_ID` column of the Performance Schema  `threads` table or the `Id` column of `SHOW PROCESSLIST` output.

  The thread ID return value is a value of the type given in the `THREAD_ID` column of Performance Schema tables.

  Performance Schema configuration affects `PS_THREAD_ID()` operation as follows. (These remarks also apply to `PS_CURRENT_THREAD_ID()`.)

  + Disabling the `thread_instrumentation` consumer disables statistics from being collected and aggregated at the thread level, but has no effect on `PS_THREAD_ID()`.
  + If `performance_schema_max_thread_instances` is not 0, the Performance Schema allocates memory for thread statistics and assigns an internal ID to each thread for which instance memory is available. If there are threads for which instance memory is not available, `PS_THREAD_ID()` returns `NULL`; in this case, `Performance_schema_thread_instances_lost` is nonzero.
  + If `performance_schema_max_thread_instances` is 0, the Performance Schema allocates no thread memory and  `PS_THREAD_ID()` returns `NULL`.
  + If the Performance Schema itself is disabled, `PS_THREAD_ID()` produces an error.

  ```
  mysql> SELECT PS_THREAD_ID(6);
  +-----------------+
  | PS_THREAD_ID(6) |
  +-----------------+
  |              45 |
  +-----------------+
  ```

   `PS_THREAD_ID()` may be used instead of the `sys` schema `ps_thread_id()` Function") function, keeping in mind this difference:

  + With an argument of `NULL`, `sys.ps_thread_id()` Function") returns the thread ID for the current connection, whereas `PS_THREAD_ID()` returns `NULL`. To obtain the current connection thread ID, use `PS_CURRENT_THREAD_ID()` instead.

