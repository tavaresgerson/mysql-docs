### 11.2.5 2-Digit YEAR(2) Limitations and Migrating to 4-Digit YEAR

This section describes problems that can occur when using the 2-digit `YEAR(2)` data type and provides information about converting existing `YEAR(2)` columns to 4-digit year-valued columns, which can be declared as `YEAR` with an implicit display width of 4 characters, or equivalently as `YEAR(4)` with an explicit display width.

Although the internal range of values for `YEAR`/`YEAR(4)` and the deprecated `YEAR(2)` type is the same (`1901` to `2155`, and `0000`), the display width for `YEAR(2)` makes that type inherently ambiguous because displayed values indicate only the last two digits of the internal values and omit the century digits. The result can be a loss of information under certain circumstances. For this reason, avoid using `YEAR(2)` in your applications and use `YEAR`/`YEAR(4)` wherever you need a year-valued data type. As of MySQL 5.7.5, support for `YEAR(2)` is removed and existing 2-digit `YEAR(2)` columns must be converted to 4-digit `YEAR` columns to become usable again.

#### YEAR(2) Limitations

Issues with the `YEAR(2)` data type include ambiguity of displayed values, and possible loss of information when values are dumped and reloaded or converted to strings.

* Displayed `YEAR(2)` values can be ambiguous. It is possible for up to three `YEAR(2)` values that have different internal values to have the same displayed value, as the following example demonstrates:

  ```sql
  mysql> CREATE TABLE t (y2 YEAR(2), y4 YEAR);
  Query OK, 0 rows affected, 1 warning (0.01 sec)

  mysql> INSERT INTO t (y2) VALUES(1912),(2012),(2112);
  Query OK, 3 rows affected (0.00 sec)
  Records: 3  Duplicates: 0  Warnings: 0

  mysql> UPDATE t SET y4 = y2;
  Query OK, 3 rows affected (0.00 sec)
  Rows matched: 3  Changed: 3  Warnings: 0

  mysql> SELECT * FROM t;
  +------+------+
  | y2   | y4   |
  +------+------+
  |   12 | 1912 |
  |   12 | 2012 |
  |   12 | 2112 |
  +------+------+
  3 rows in set (0.00 sec)
  ```

* If you use **mysqldump** to dump the table created in the preceding example, the dump file represents all `y2` values using the same 2-digit representation (`12`). If you reload the table from the dump file, all resulting rows have internal value `2012` and display value `12`, thus losing the distinctions between them.

* Conversion of a 2-digit or 4-digit `YEAR` data value to string form uses the data type display width. Suppose that a `YEAR(2)` column and a `YEAR`/`YEAR(4)` column both contain the value `1970`. Assigning each column to a string results in a value of `'70'` or `'1970'`, respectively. That is, loss of information occurs for conversion from `YEAR(2)` to string.

* Values outside the range from `1970` to `2069` are stored incorrectly when inserted into a `YEAR(2)` column in a `CSV` table. For example, inserting `2211` results in a display value of `11` but an internal value of `2011`.

To avoid these problems, use the 4-digit `YEAR` or `YEAR(4)` data type rather than the 2-digit `YEAR(2)` data type. Suggestions regarding migration strategies appear later in this section.

#### Reduced/Removed YEAR(2) Support in MySQL 5.7

Before MySQL 5.7.5, support for `YEAR(2)` is diminished. As of MySQL 5.7.5, support for `YEAR(2)` is removed.

* `YEAR(2)` column definitions for new tables produce warnings or errors:

  + Before MySQL 5.7.5, `YEAR(2)` column definitions for new tables are converted (with an `ER_INVALID_YEAR_COLUMN_LENGTH` warning) to 4-digit `YEAR` columns:

    ```sql
    mysql> CREATE TABLE t1 (y YEAR(2));
    Query OK, 0 rows affected, 1 warning (0.04 sec)

    mysql> SHOW WARNINGS\G
    *************************** 1. row ***************************
      Level: Warning
       Code: 1818
    Message: YEAR(2) column type is deprecated. Creating YEAR(4) column instead.
    1 row in set (0.00 sec)

    mysql> SHOW CREATE TABLE t1\G
    *************************** 1. row ***************************
           Table: t1
    Create Table: CREATE TABLE `t1` (
      `y` year(4) DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1
    1 row in set (0.00 sec)
    ```

  + As of MySQL 5.7.5, `YEAR(2)` column definitions for new tables produce an `ER_INVALID_YEAR_COLUMN_LENGTH` error:

    ```sql
    mysql> CREATE TABLE t1 (y YEAR(2));
    ERROR 1818 (HY000): Supports only YEAR or YEAR(4) column.
    ```

* `YEAR(2)` column in existing tables remain as `YEAR(2)`:

  + Before MySQL 5.7.5, `YEAR(2)` is processed in queries as in older versions of MySQL.

  + As of MySQL 5.7.5, `YEAR(2)` columns in queries produce warnings or errors.

* Several programs or statements convert `YEAR(2)` columns to 4-digit `YEAR` columns automatically:

  + `ALTER TABLE` statements that result in a table rebuild.

  + `REPAIR TABLE` (which `CHECK TABLE` recommends you use, if it finds a table that contains `YEAR(2)` columns).

  + **mysql\_upgrade** (which uses `REPAIR TABLE`).

  + Dumping with **mysqldump** and reloading the dump file. Unlike the conversions performed by the preceding three items, a dump and reload has the potential to change data values.

  A MySQL upgrade usually involves at least one of the last two items. However, with respect to `YEAR(2)`, **mysql\_upgrade** is preferable to **mysqldump**, which, as noted, can change data values.

#### Migrating from YEAR(2) to 4-Digit YEAR

To convert 2-digit `YEAR(2)` columns to 4-digit `YEAR` columns, you can do so manually at any time without upgrading. Alternatively, you can upgrade to a version of MySQL with reduced or removed support for `YEAR(2)` (MySQL 5.6.6 or later), then have MySQL convert `YEAR(2)` columns automatically. In the latter case, avoid upgrading by dumping and reloading your data because that can change data values. In addition, if you use replication, there are upgrade considerations you must take into account.

To convert 2-digit `YEAR(2)` columns to 4-digit `YEAR` manually, use `ALTER TABLE` or `REPAIR TABLE`. Suppose that a table `t1` has this definition:

```sql
CREATE TABLE t1 (ycol YEAR(2) NOT NULL DEFAULT '70');
```

Modify the column using `ALTER TABLE` as follows:

```sql
ALTER TABLE t1 FORCE;
```

The `ALTER TABLE` statement converts the table without changing `YEAR(2)` values. If the server is a replication source, the `ALTER TABLE` statement replicates to replicas and makes the corresponding table change on each one.

Another migration method is to perform a binary upgrade: Upgrade MySQL in place without dumping and reloading your data. Then run **mysql\_upgrade**, which uses `REPAIR TABLE` to convert 2-digit `YEAR(2)` columns to 4-digit `YEAR` columns without changing data values. If the server is a replication source, the `REPAIR TABLE` statements replicate to replicas and make the corresponding table changes on each one, unless you invoke **mysql\_upgrade** with the `--skip-write-binlog` option.

Upgrades to replication servers usually involve upgrading replicas to a newer version of MySQL, then upgrading the source. For example, if a source and replica both run MySQL 5.5, a typical upgrade sequence involves upgrading the replica to 5.6, then upgrading the source to 5.6. With regard to the different treatment of `YEAR(2)` as of MySQL 5.6.6, that upgrade sequence results in a problem: Suppose that the replica has been upgraded but not yet the source. Then creating a table containing a 2-digit `YEAR(2)` column on the source results in a table containing a 4-digit `YEAR` column on the replica. Consequently, the following operations have a different result on the source and replica, if you use statement-based replication:

* Inserting numeric `0`. The resulting value has an internal value of `2000` on the source but `0000` on the replica.

* Converting `YEAR(2)` to string. This operation uses the display value of `YEAR(2)` on the source but `YEAR(4)` on the replica.

To avoid such problems, modify all 2-digit `YEAR(2)` columns on the source to 4-digit `YEAR` columns before upgrading. (Use `ALTER TABLE`, as described previously.) That makes it possible to upgrade normally (replica first, then source) without introducing any `YEAR(2)` to `YEAR(4)` differences between the source and replica.

One migration method should be avoided: Do not dump your data with **mysqldump** and reload the dump file after upgrading. That has the potential to change `YEAR(2)` values, as described previously.

A migration from 2-digit `YEAR(2)` columns to 4-digit `YEAR` columns should also involve examining application code for the possibility of changed behavior under conditions such as these:

* Code that expects selecting a `YEAR` column to produce exactly two digits.

* Code that does not account for different handling for inserts of numeric `0`: Inserting `0` into `YEAR(2)` or `YEAR(4)` results in an internal value of `2000` or `0000`, respectively.
