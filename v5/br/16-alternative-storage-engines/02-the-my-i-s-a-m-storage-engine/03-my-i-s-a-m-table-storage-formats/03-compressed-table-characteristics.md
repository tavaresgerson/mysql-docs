#### 15.2.3.3 Compressed Table Characteristics

Compressed storage format is a read-only format that is generated with the **myisampack** tool. Compressed tables can be uncompressed with **myisamchk**.

Compressed tables have the following characteristics:

* Compressed tables take very little disk space. This minimizes disk usage, which is helpful when using slow disks (such as CD-ROMs).

* Each row is compressed separately, so there is very little access overhead. The header for a row takes up one to three bytes depending on the biggest row in the table. Each column is compressed differently. There is usually a different Huffman tree for each column. Some of the compression types are:

  + Suffix space compression.
  + Prefix space compression.
  + Numbers with a value of zero are stored using one bit.
  + If values in an integer column have a small range, the column is stored using the smallest possible type. For example, a `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") column (eight bytes) can be stored as a `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") column (one byte) if all its values are in the range from `-128` to `127`.

  + If a column has only a small set of possible values, the data type is converted to `ENUM`.

  + A column may use any combination of the preceding compression types.

* Can be used for fixed-length or dynamic-length rows.

Note

While a compressed table is read only, and you cannot therefore update or add rows in the table, DDL (Data Definition Language) operations are still valid. For example, you may still use `DROP` to drop the table, and `TRUNCATE TABLE` to empty the table.
