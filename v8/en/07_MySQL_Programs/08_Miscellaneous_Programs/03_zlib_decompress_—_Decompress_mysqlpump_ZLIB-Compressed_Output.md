### 6.8.3 zlib\_decompress — Decompress mysqlpump ZLIB-Compressed Output

The [**zlib\_decompress**](zlib-decompress.html "6.8.3 zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output") utility decompresses
[**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") output that was created using ZLIB
compression.

Note

[**zlib\_decompress**](zlib-decompress.html "6.8.3 zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output") is deprecated as of MySQL
8.0.34; expect it to be removed in a future version of MySQL.
This is because the associated [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program")
utility is deprecated as of MySQL 8.0.34.

Note

If MySQL was configured with the
[`-DWITH_ZLIB=system`](source-configuration-options.html#option_cmake_with_zlib) option,
[**zlib\_decompress**](zlib-decompress.html "6.8.3 zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output") is not built. In this case,
the system **openssl zlib** command can be used
instead.

Invoke [**zlib\_decompress**](zlib-decompress.html "6.8.3 zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output") like this:

```
zlib_decompress input_file output_file
```

Example:

```
mysqlpump --compress-output=ZLIB > dump.zlib
zlib_decompress dump.zlib dump.txt
```

To see a help message, invoke [**zlib\_decompress**](zlib-decompress.html "6.8.3 zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output")
with no arguments.

To decompress [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") LZ4-compressed
output, use [**lz4\_decompress**](lz4-decompress.html "6.8.1 lz4_decompress — Decompress mysqlpump LZ4-Compressed Output"). See
[Section 6.8.1, “lz4\_decompress — Decompress mysqlpump LZ4-Compressed Output”](lz4-decompress.html "6.8.1 lz4_decompress — Decompress mysqlpump LZ4-Compressed Output").