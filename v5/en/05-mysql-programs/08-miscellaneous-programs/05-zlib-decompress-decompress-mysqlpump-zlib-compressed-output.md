### 4.8.5 zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output

The **zlib_decompress** utility decompresses **mysqlpump** output that was created using ZLIB compression. **zlib_decompress** was added in MySQL 5.7.10.

Invoke **zlib_decompress** like this:

```sql
zlib_decompress input_file output_file
```

Example:

```sql
mysqlpump --compress-output=ZLIB > dump.zlib
zlib_decompress dump.zlib dump.txt
```

To see a help message, invoke **zlib_decompress** with no arguments.

To decompress **mysqlpump** LZ4-compressed output, use **lz4_decompress**. See Section 4.8.1, “lz4_decompress — Decompress mysqlpump LZ4-Compressed Output”.
