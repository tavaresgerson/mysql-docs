### 4.8.1 lz4\_decompress — Decompress mysqlpump LZ4-Compressed Output

The **lz4\_decompress** utility decompresses **mysqlpump** output that was created using LZ4 compression. **lz4\_decompress** was added in MySQL 5.7.10.

Invoke **lz4\_decompress** like this:

```sql
lz4_decompress input_file output_file
```

Example:

```sql
mysqlpump --compress-output=LZ4 > dump.lz4
lz4_decompress dump.lz4 dump.txt
```

To see a help message, invoke **lz4\_decompress** with no arguments.

To decompress **mysqlpump** ZLIB-compressed output, use **zlib\_decompress**. See Section 4.8.5, “zlib\_decompress — Decompress mysqlpump ZLIB-Compressed Output”.
