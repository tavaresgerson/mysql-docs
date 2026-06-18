### 4.8.5 zlib\_decompress — Decompress mysqlpump ZLIB-Compressed Output

The [**zlib\_decompress**](zlib-decompress.html "4.8.5 zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output") utility decompresses
[**mysqlpump**](mysqlpump.html "4.5.6 mysqlpump — A Database Backup Program") output that was created using ZLIB
compression. [**zlib\_decompress**](zlib-decompress.html "4.8.5 zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output") was added in
MySQL 5.7.10.

Invoke [**zlib\_decompress**](zlib-decompress.html "4.8.5 zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output") like this:

```sql
zlib_decompress input_file output_file
```

Example:

```sql
mysqlpump --compress-output=ZLIB > dump.zlib
zlib_decompress dump.zlib dump.txt
```

To see a help message, invoke [**zlib\_decompress**](zlib-decompress.html "4.8.5 zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output")
with no arguments.

To decompress [**mysqlpump**](mysqlpump.html "4.5.6 mysqlpump — A Database Backup Program") LZ4-compressed
output, use [**lz4\_decompress**](lz4-decompress.html "4.8.1 lz4_decompress — Decompress mysqlpump LZ4-Compressed Output"). See
[Section 4.8.1, “lz4\_decompress — Decompress mysqlpump LZ4-Compressed Output”](lz4-decompress.html "4.8.1 lz4_decompress — Decompress mysqlpump LZ4-Compressed Output").