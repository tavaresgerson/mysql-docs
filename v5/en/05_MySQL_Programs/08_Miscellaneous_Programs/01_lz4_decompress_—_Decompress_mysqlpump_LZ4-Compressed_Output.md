### 4.8.1 lz4\_decompress — Decompress mysqlpump LZ4-Compressed Output

The [**lz4\_decompress**](lz4-decompress.html "4.8.1 lz4_decompress — Decompress mysqlpump LZ4-Compressed Output") utility decompresses
[**mysqlpump**](mysqlpump.html "4.5.6 mysqlpump — A Database Backup Program") output that was created using LZ4
compression. [**lz4\_decompress**](lz4-decompress.html "4.8.1 lz4_decompress — Decompress mysqlpump LZ4-Compressed Output") was added in
MySQL 5.7.10.

Invoke [**lz4\_decompress**](lz4-decompress.html "4.8.1 lz4_decompress — Decompress mysqlpump LZ4-Compressed Output") like this:

```sql
lz4_decompress input_file output_file
```

Example:

```sql
mysqlpump --compress-output=LZ4 > dump.lz4
lz4_decompress dump.lz4 dump.txt
```

To see a help message, invoke [**lz4\_decompress**](lz4-decompress.html "4.8.1 lz4_decompress — Decompress mysqlpump LZ4-Compressed Output")
with no arguments.

To decompress [**mysqlpump**](mysqlpump.html "4.5.6 mysqlpump — A Database Backup Program") ZLIB-compressed
output, use [**zlib\_decompress**](zlib-decompress.html "4.8.5 zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output"). See
[Section 4.8.5, “zlib\_decompress — Decompress mysqlpump ZLIB-Compressed Output”](zlib-decompress.html "4.8.5 zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output").