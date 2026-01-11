#### 30.4.5.6 The format\_time() Function

Note

`format_time()` Function") is deprecated, and subject to removal in a future MySQL version. Applications that use it should be migrated to use the built-in `FORMAT_PICO_TIME()` function instead. See Section 14.22, “Performance Schema Functions”

Given a Performance Schema latency or wait time in picoseconds, converts it to human-readable format and returns a string consisting of a value and a units indicator. Depending on the size of the value, the units part is `ps` (picoseconds), `ns` (nanoseconds), `us` (microseconds), `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours), `d` (days), or `w` (weeks).

##### Parameters

* `picoseconds TEXT`: The picoseconds value to format.

##### Return Value

A `TEXT` value.

##### Example

```
mysql> SELECT sys.format_time(3501), sys.format_time(188732396662000);
+-----------------------+----------------------------------+
| sys.format_time(3501) | sys.format_time(188732396662000) |
+-----------------------+----------------------------------+
| 3.50 ns               | 3.15 m                           |
+-----------------------+----------------------------------+
```
