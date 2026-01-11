### 6.8.1 lz4_decompress — Decompress mysqlpump LZ4-Compressed Output

The **lz4_decompress** utility decompresses **mysqlpump** output that was created using LZ4 compression.

Note

**lz4_decompress** is deprecated as of MySQL 8.0.34; expect it to be removed in a future version of MySQL. This is because the associated **mysqlpump** utility is deprecated as of MySQL 8.0.34.

Note

If MySQL was configured with the `-DWITH_LZ4=system` option, **lz4_decompress** is not built. In this case, the system **lz4** command can be used instead.

Invoke **lz4_decompress** like this:

```
lz4_decompress input_file output_file
```

Example:

```
mysqlpump --compress-output=LZ4 > dump.lz4
lz4_decompress dump.lz4 dump.txt
```

To see a help message, invoke **lz4_decompress** with no arguments.

To decompress **mysqlpump** ZLIB-compressed output, use **zlib_decompress**. See Section 6.8.3, “zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output”.
