### 6.8.1 lz4\_decompress — Decompress mysqlpump LZ4-Compressed Output

The [**lz4\_decompress**](lz4-decompress.html "6.8.1 lz4_decompress — Decompress mysqlpump LZ4-Compressed Output") utility decompresses
[**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") output that was created using LZ4
compression.

Note

[**lz4\_decompress**](lz4-decompress.html "6.8.1 lz4_decompress — Decompress mysqlpump LZ4-Compressed Output") is deprecated as of MySQL
8.0.34; expect it to be removed in a future version of MySQL.
This is because the associated [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program")
utility is deprecated as of MySQL 8.0.34.

Note

If MySQL was configured with the
[`-DWITH_LZ4=system`](source-configuration-options.html#option_cmake_with_lz4) option,
[**lz4\_decompress**](lz4-decompress.html "6.8.1 lz4_decompress — Decompress mysqlpump LZ4-Compressed Output") is not built. In this case,
the system **lz4** command can be used instead.

Invoke [**lz4\_decompress**](lz4-decompress.html "6.8.1 lz4_decompress — Decompress mysqlpump LZ4-Compressed Output") like this:

```
lz4_decompress input_file output_file
```

Example:

```
mysqlpump --compress-output=LZ4 > dump.lz4
lz4_decompress dump.lz4 dump.txt
```

To see a help message, invoke [**lz4\_decompress**](lz4-decompress.html "6.8.1 lz4_decompress — Decompress mysqlpump LZ4-Compressed Output")
with no arguments.

To decompress [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") ZLIB-compressed
output, use [**zlib\_decompress**](zlib-decompress.html "6.8.3 zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output"). See
[Section 6.8.3, “zlib\_decompress — Decompress mysqlpump ZLIB-Compressed Output”](zlib-decompress.html "6.8.3 zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output").