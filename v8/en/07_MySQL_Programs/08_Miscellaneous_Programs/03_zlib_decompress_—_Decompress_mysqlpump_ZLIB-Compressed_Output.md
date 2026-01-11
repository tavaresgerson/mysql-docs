### 6.8.3 zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output

The **zlib_decompress** utility decompresses **mysqlpump** output that was created using ZLIB compression.

Note

**zlib_decompress** is deprecated as of MySQL 8.0.34; expect it to be removed in a future version of MySQL. This is because the associated **mysqlpump** utility is deprecated as of MySQL 8.0.34.

Note

If MySQL was configured with the `-DWITH_ZLIB=system` option, **zlib_decompress** is not built. In this case, the system **openssl zlib** command can be used instead.

Invoke **zlib_decompress** like this:

```
zlib_decompress input_file output_file
```

Example:

```
mysqlpump --compress-output=ZLIB > dump.zlib
zlib_decompress dump.zlib dump.txt
```

To see a help message, invoke **zlib_decompress** with no arguments.

To decompress **mysqlpump** LZ4-compressed output, use **lz4_decompress**. See Section 6.8.1, “lz4_decompress — Decompress mysqlpump LZ4-Compressed Output”.
