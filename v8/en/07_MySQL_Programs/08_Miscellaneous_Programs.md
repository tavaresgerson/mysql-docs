## 6.8 Miscellaneous Programs


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


### 6.8.2 perror — Display MySQL Error Message Information

**perror** displays the error message for MySQL or operating system error codes. Invoke **perror** like this:

```
perror [options] errorcode ...
```

**perror** attempts to be flexible in understanding its arguments. For example, for the `ER_WRONG_VALUE_FOR_VAR` error, **perror** understands any of these arguments: `1231`, `001231`, `MY-1231`, or `MY-001231`, or `ER_WRONG_VALUE_FOR_VAR`.

```
$> perror 1231
MySQL error code MY-001231 (ER_WRONG_VALUE_FOR_VAR): Variable '%-.64s'
can't be set to the value of '%-.200s'
```

If an error number is in the range where MySQL and operating system errors overlap, **perror** displays both error messages:

```
$> perror 1 13
OS error code   1:  Operation not permitted
MySQL error code MY-000001: Can't create/write to file '%s' (OS errno %d - %s)
OS error code  13:  Permission denied
MySQL error code MY-000013: Can't get stat of '%s' (OS errno %d - %s)
```

To obtain the error message for a MySQL Cluster error code, use the **ndb_perror** utility.

The meaning of system error messages may be dependent on your operating system. A given error code may mean different things on different operating systems.

**perror** supports the following options.

* `--help`, `--info`, `-I`, `-?`

  Display a help message and exit.

* `--ndb`

  Print the error message for a MySQL Cluster error code.

  This option was removed in MySQL 8.0.13. Use the **ndb_perror** utility instead.

* `--silent`, `-s`

  Silent mode. Print only the error message.

* `--verbose`, `-v`

  Verbose mode. Print error code and message. This is the default behavior.

* `--version`, `-V`

  Display version information and exit.


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
