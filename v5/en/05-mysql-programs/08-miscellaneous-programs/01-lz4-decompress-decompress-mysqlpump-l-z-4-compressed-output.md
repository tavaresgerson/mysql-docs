### 4.8.1 lz4_decompress — Decompress mysqlpump LZ4-Compressed Output

The **lz4_decompress** utility decompresses **mysqlpump** output that was created using LZ4 compression. **lz4_decompress** was added in MySQL 5.7.10.

Invoke **lz4_decompress** like this:

```sql
lz4_decompress input_file output_file
```

Example:

```sql
mysqlpump --compress-output=LZ4 > dump.lz4
lz4_decompress dump.lz4 dump.txt
```

To see a help message, invoke **lz4_decompress** with no arguments.

To decompress **mysqlpump** ZLIB-compressed output, use **zlib_decompress**. See Section 4.8.5, “zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output”.
