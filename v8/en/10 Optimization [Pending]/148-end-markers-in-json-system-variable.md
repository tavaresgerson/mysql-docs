--- title: MySQL 8.4 Reference Manual :: 10.15.9 The end_markers_in_json System Variable url: https://dev.mysql.com/doc/refman/8.4/en/end-markers-in-json-system-variable.html order: 148 ---



### 10.15.9 The end\_markers\_in\_json System Variable

When reading a very large JSON document, it can be difficult to pair its closing bracket and opening brackets; setting `end_markers_in_json=ON` repeats the structure's key, if it has one, near the closing bracket. This variable affects both optimizer traces and the output of `EXPLAIN FORMAT=JSON`.

::: info Note

If  `end_markers_in_json` is enabled, the repetition of the key means the result is not a valid JSON document, and causes JSON parsers to throw an error.


:::

