## 13.7 Data Type Storage Requirements

*  InnoDB Table Storage Requirements
*  NDB Table Storage Requirements
*  Numeric Type Storage Requirements
*  Date and Time Type Storage Requirements
*  String Type Storage Requirements
*  Spatial Type Storage Requirements
*  JSON Storage Requirements

The storage requirements for table data on disk depend on several factors. Different storage engines represent data types and store raw data differently. Table data might be compressed, either for a column or an entire row, complicating the calculation of storage requirements for a table or column.

Despite differences in storage layout on disk, the internal MySQL APIs that communicate and exchange information about table rows use a consistent data structure that applies across all storage engines.

This section includes guidelines and information for the storage requirements for each data type supported by MySQL, including the internal format and size for storage engines that use a fixed-size representation for data types. Information is listed by category or storage engine.

The internal representation of a table has a maximum row size of 65,535 bytes, even if the storage engine is capable of supporting larger rows. This figure excludes `BLOB` or `TEXT` columns, which contribute only 9 to 12 bytes toward this size. For `BLOB` and `TEXT` data, the information is stored internally in a different area of memory than the row buffer. Different storage engines handle the allocation and storage of this data in different ways, according to the method they use for handling the corresponding types. For more information, see  Chapter 18, *Alternative Storage Engines*, and Section 10.4.7, “Limits on Table Column Count and Row Size”.

### InnoDB Table Storage Requirements

See  Section 17.10, “InnoDB Row Formats” for information about storage requirements for `InnoDB` tables.

### NDB Table Storage Requirements

Important

 `NDB` tables use 4-byte alignment; all `NDB` data storage is done in multiples of 4 bytes. Thus, a column value that would typically take 15 bytes requires 16 bytes in an `NDB` table. For example, in `NDB` tables, the `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), and `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ( `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")) column types each require 4 bytes storage per record due to the alignment factor.

Each `BIT(M)` column takes *`M`* bits of storage space. Although an individual `BIT` column is *not* 4-byte aligned, `NDB` reserves 4 bytes (32 bits) per row for the first 1-32 bits needed for `BIT` columns, then another 4 bytes for bits 33-64, and so on.

While a `NULL` itself does not require any storage space,  `NDB` reserves 4 bytes per row if the table definition contains any columns allowing `NULL`, up to 32 `NULL` columns. (If an NDB Cluster table is defined with more than 32 `NULL` columns up to 64 `NULL` columns, then 8 bytes per row are reserved.)

Every table using the  `NDB` storage engine requires a primary key; if you do not define a primary key, a “hidden” primary key is created by `NDB`. This hidden primary key consumes 31-35 bytes per table record.

You can use the  **ndb\_size.pl** Perl script to estimate  `NDB` storage requirements. It connects to a current MySQL (not NDB Cluster) database and creates a report on how much space that database would require if it used the  `NDB` storage engine. See  Section 25.5.29, “ndb\_size.pl — NDBCLUSTER Size Requirement Estimator” for more information.

### Numeric Type Storage Requirements

<table><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Data Type</th> <th>Storage Required</th> </tr></thead><tbody><tr> <td><code>TINYINT</code></td> <td>1 byte</td> </tr><tr> <td><code>SMALLINT</code></td> <td>2 bytes</td> </tr><tr> <td><code>MEDIUMINT</code></td> <td>3 bytes</td> </tr><tr> <td><code>INT</code>, <code>INTEGER</code></td> <td>4 bytes</td> </tr><tr> <td><code>BIGINT</code></td> <td>8 bytes</td> </tr><tr> <td><code>FLOAT(<em><code>p</code></em>)</code></td> <td>4 bytes if 0 &lt;= <em><code>p</code></em> &lt;= 24, 8 bytes if 25 &lt;= <em><code>p</code></em> &lt;= 53</td> </tr><tr> <td><code>FLOAT</code></td> <td>4 bytes</td> </tr><tr> <td><code>DOUBLE [PRECISION]</code>, <code>REAL</code></td> <td>8 bytes</td> </tr><tr> <td><code>DECIMAL(<em><code>M</code></em>,<em><code>D</code></em>)</code>, <code>NUMERIC(<em><code>M</code></em>,<em><code>D</code></em>)</code></td> <td>Varies; see following discussion</td> </tr><tr> <td><code>BIT(<em><code>M</code></em>)</code></td> <td>approximately (<em><code>M</code></em>+7)/8 bytes</td> </tr></tbody></table>

Values for  `DECIMAL` - DECIMAL, NUMERIC") (and `NUMERIC` - DECIMAL, NUMERIC")) columns are represented using a binary format that packs nine decimal (base 10) digits into four bytes. Storage for the integer and fractional parts of each value are determined separately. Each multiple of nine digits requires four bytes, and the “leftover” digits require some fraction of four bytes. The storage required for excess digits is given by the following table.

<table><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>Leftover Digits</th> <th>Number of Bytes</th> </tr></thead><tbody><tr> <td>0</td> <td>0</td> </tr><tr> <td>1</td> <td>1</td> </tr><tr> <td>2</td> <td>1</td> </tr><tr> <td>3</td> <td>2</td> </tr><tr> <td>4</td> <td>2</td> </tr><tr> <td>5</td> <td>3</td> </tr><tr> <td>6</td> <td>3</td> </tr><tr> <td>7</td> <td>4</td> </tr><tr> <td>8</td> <td>4</td> </tr></tbody></table>

### Date and Time Type Storage Requirements

For  `TIME`, `DATETIME`, and `TIMESTAMP` columns, the storage required for tables created before MySQL 5.6.4 differs from tables created from 5.6.4 on. This is due to a change in 5.6.4 that permits these types to have a fractional part, which requires from 0 to 3 bytes.

<table><col style="width: 20%"/><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th>Data Type</th> <th>Storage Required Before MySQL 5.6.4</th> <th>Storage Required as of MySQL 5.6.4</th> </tr></thead><tbody><tr> <th><code>YEAR</code></th> <td>1 byte</td> <td>1 byte</td> </tr><tr> <th><code>DATE</code></th> <td>3 bytes</td> <td>3 bytes</td> </tr><tr> <th><code>TIME</code></th> <td>3 bytes</td> <td>3 bytes + fractional seconds storage</td> </tr><tr> <th><code>DATETIME</code></th> <td>8 bytes</td> <td>5 bytes + fractional seconds storage</td> </tr><tr> <th><code>TIMESTAMP</code></th> <td>4 bytes</td> <td>4 bytes + fractional seconds storage</td> </tr></tbody></table>

As of MySQL 5.6.4, storage for `YEAR` and `DATE` remains unchanged. However, `TIME`, `DATETIME`, and `TIMESTAMP` are represented differently.  `DATETIME` is packed more efficiently, requiring 5 rather than 8 bytes for the nonfractional part, and all three parts have a fractional part that requires from 0 to 3 bytes, depending on the fractional seconds precision of stored values.

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Fractional Seconds Precision</th> <th>Storage Required</th> </tr></thead><tbody><tr> <td>0</td> <td>0 bytes</td> </tr><tr> <td>1, 2</td> <td>1 byte</td> </tr><tr> <td>3, 4</td> <td>2 bytes</td> </tr><tr> <td>5, 6</td> <td>3 bytes</td> </tr></tbody></table>

For example,  `TIME(0)`, `TIME(2)`, `TIME(4)`, and `TIME(6)` use 3, 4, 5, and 6 bytes, respectively.  `TIME` and `TIME(0)` are equivalent and require the same storage.

For details about internal representation of temporal values, see MySQL Internals: Important Algorithms and Structures.

### String Type Storage Requirements

In the following table, *`M`* represents the declared column length in characters for nonbinary string types and bytes for binary string types. *`L`* represents the actual length in bytes of a given string value.

<table><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Data Type</th> <th>Storage Required</th> </tr></thead><tbody><tr> <td><code>CHAR(<em><code>M</code></em>)</code></td> <td>The compact family of InnoDB row formats optimize storage for variable-length character sets. See COMPACT Row Format Storage Characteristics. Otherwise, <em><code>M</code></em> × <em><code>w</code></em> bytes, <code>&lt;= <em><code>M</code></em> &lt;=</code> 255, where <em><code>w</code></em> is the number of bytes required for the maximum-length character in the character set.</td> </tr><tr> <td><code>BINARY(<em><code>M</code></em>)</code></td> <td><em><code>M</code></em> bytes, 0 <code>&lt;= <em><code>M</code></em> &lt;=</code> 255</td> </tr><tr> <td><code>VARCHAR(<em><code>M</code></em>)</code>, <code>VARBINARY(<em><code>M</code></em>)</code></td> <td><em><code>L</code></em> + 1 bytes if column values require 0 − 255 bytes, <em><code>L</code></em> + 2 bytes if values may require more than 255 bytes</td> </tr><tr> <td><code>TINYBLOB</code>, <code>TINYTEXT</code></td> <td><em><code>L</code></em> + 1 bytes, where <em><code>L</code></em> &lt; 2<sup>8</sup></td> </tr><tr> <td><code>BLOB</code>, <code>TEXT</code></td> <td><em><code>L</code></em> + 2 bytes, where <em><code>L</code></em> &lt; 2<sup>16</sup></td> </tr><tr> <td><code>MEDIUMBLOB</code>, <code>MEDIUMTEXT</code></td> <td><em><code>L</code></em> + 3 bytes, where <em><code>L</code></em> &lt; 2<sup>24</sup></td> </tr><tr> <td><code>LONGBLOB</code>, <code>LONGTEXT</code></td> <td><em><code>L</code></em> + 4 bytes, where <em><code>L</code></em> &lt; 2<sup>32</sup></td> </tr><tr> <td><code>ENUM('<em><code>value1</code></em>','<em><code>value2</code></em>',...)</code></td> <td>1 or 2 bytes, depending on the number of enumeration values (65,535 values maximum)</td> </tr><tr> <td><code>SET('<em><code>value1</code></em>','<em><code>value2</code></em>',...)</code></td> <td>1, 2, 3, 4, or 8 bytes, depending on the number of set members (64 members maximum)</td> </tr></tbody></table>

Variable-length string types are stored using a length prefix plus data. The length prefix requires from one to four bytes depending on the data type, and the value of the prefix is *`L`* (the byte length of the string). For example, storage for a `MEDIUMTEXT` value requires *`L`* bytes to store the value plus three bytes to store the length of the value.

To calculate the number of bytes used to store a particular `CHAR`, `VARCHAR`, or `TEXT` column value, you must take into account the character set used for that column and whether the value contains multibyte characters. In particular, when using a UTF-8 Unicode character set, you must keep in mind that not all characters use the same number of bytes. `utf8mb3` and `utf8mb4` character sets can require up to three and four bytes per character, respectively. For a breakdown of the storage used for different categories of `utf8mb3` or `utf8mb4` characters, see Section 12.9, “Unicode Support”.

 `VARCHAR`, `VARBINARY`, and the `BLOB` and `TEXT` types are variable-length types. For each, the storage requirements depend on these factors:

* The actual length of the column value
* The column's maximum possible length
* The character set used for the column, because some character sets contain multibyte characters

For example, a `VARCHAR(255)` column can hold a string with a maximum length of 255 characters. Assuming that the column uses the `latin1` character set (one byte per character), the actual storage required is the length of the string (*`L`*), plus one byte to record the length of the string. For the string `'abcd'`, *`L`* is 4 and the storage requirement is five bytes. If the same column is instead declared to use the `ucs2` double-byte character set, the storage requirement is 10 bytes: The length of `'abcd'` is eight bytes and the column requires two bytes to store lengths because the maximum length is greater than 255 (up to 510 bytes).

The effective maximum number of *bytes* that can be stored in a  `VARCHAR` or `VARBINARY` column is subject to the maximum row size of 65,535 bytes, which is shared among all columns. For a  `VARCHAR` column that stores multibyte characters, the effective maximum number of *characters* is less. For example, `utf8mb4` characters can require up to four bytes per character, so a  `VARCHAR` column that uses the `utf8mb4` character set can be declared to be a maximum of 16,383 characters. See Section 10.4.7, “Limits on Table Column Count and Row Size”.

`InnoDB` encodes fixed-length fields greater than or equal to 768 bytes in length as variable-length fields, which can be stored off-page. For example, a `CHAR(255)` column can exceed 768 bytes if the maximum byte length of the character set is greater than 3, as it is with `utf8mb4`.

The  `NDB` storage engine supports variable-width columns. This means that a `VARCHAR` column in an NDB Cluster table requires the same amount of storage as would any other storage engine, with the exception that such values are 4-byte aligned. Thus, the string `'abcd'` stored in a `VARCHAR(50)` column using the `latin1` character set requires 8 bytes (rather than 5 bytes for the same column value in a `MyISAM` table).

 `TEXT`, `BLOB`, and `JSON` columns are implemented differently in the  `NDB` storage engine, wherein each row in the column is made up of two separate parts. One of these is of fixed size (256 bytes for `TEXT` and `BLOB`, 4000 bytes for `JSON`), and is actually stored in the original table. The other consists of any data in excess of 256 bytes, which is stored in a hidden blob parts table. The size of the rows in this second table are determined by the exact type of the column, as shown in the following table:

<table><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Type</th> <th>Blob Part Size</th> </tr></thead><tbody><tr> <td><code>BLOB</code>, <code>TEXT</code></td> <td>2000</td> </tr><tr> <td><code>MEDIUMBLOB</code>, <code>MEDIUMTEXT</code></td> <td>4000</td> </tr><tr> <td><code>LONGBLOB</code>, <code>LONGTEXT</code></td> <td>13948</td> </tr><tr> <td><code>JSON</code></td> <td>8100</td> </tr></tbody></table>

This means that the size of a `TEXT` column is 256 if *`size`* <= 256 (where *`size`* represents the size of the row); otherwise, the size is 256 + *`size`* + (2000 × (*`size`* − 256) % 2000).

No blob parts are stored separately by `NDB` for `TINYBLOB` or `TINYTEXT` column values.

You can increase the size of an `NDB` blob column's blob part to the maximum of 13948 using `NDB_COLUMN` in a column comment when creating or altering the parent table. `NDB` also supports setting the inline size for a `TEXT`, `BLOB`, or `JSON` column, using `NDB_TABLE` in a column comment. See NDB\_COLUMN Options, for more information.

The size of an  `ENUM` object is determined by the number of different enumeration values. One byte is used for enumerations with up to 255 possible values. Two bytes are used for enumerations having between 256 and 65,535 possible values. See  Section 13.3.5, “The ENUM Type”.

The size of a  `SET` object is determined by the number of different set members. If the set size is *`N`*, the object occupies `(N+7)/8` bytes, rounded up to 1, 2, 3, 4, or 8 bytes. A `SET` can have a maximum of 64 members. See  Section 13.3.6, “The SET Type”.

### Spatial Type Storage Requirements

MySQL stores geometry values using 4 bytes to indicate the SRID followed by the WKB representation of the value. The `LENGTH()` function returns the space in bytes required for value storage.

For descriptions of WKB and internal storage formats for spatial values, see  Section 13.4.3, “Supported Spatial Data Formats”.

### JSON Storage Requirements

In general, the storage requirement for a `JSON` column is approximately the same as for a `LONGBLOB` or `LONGTEXT` column; that is, the space consumed by a JSON document is roughly the same as it would be for the document's string representation stored in a column of one of these types. However, there is an overhead imposed by the binary encoding, including metadata and dictionaries needed for lookup, of the individual values stored in the JSON document. For example, a string stored in a JSON document requires 4 to 10 bytes additional storage, depending on the length of the string and the size of the object or array in which it is stored.

In addition, MySQL imposes a limit on the size of any JSON document stored in a `JSON` column such that it cannot be any larger than the value of `max_allowed_packet`.


