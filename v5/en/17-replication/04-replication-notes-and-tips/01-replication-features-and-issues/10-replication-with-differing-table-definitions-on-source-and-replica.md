#### 16.4.1.10 Replication with Differing Table Definitions on Source and Replica

Source and target tables for replication do not have to be identical. A table on the source can have more or fewer columns than the replica's copy of the table. In addition, corresponding table columns on the source and the replica can use different data types, subject to certain conditions.

Note

Replication between tables which are partitioned differently from one another is not supported. See [Section 16.4.1.23, “Replication and Partitioning”](replication-features-partitioning.html "16.4.1.23 Replication and Partitioning").

In all cases where the source and target tables do not have identical definitions, the database and table names must be the same on both the source and the replica. Additional conditions are discussed, with examples, in the following two sections.

##### 16.4.1.10.1 Replication with More Columns on Source or Replica

You can replicate a table from the source to the replica such that the source and replica copies of the table have differing numbers of columns, subject to the following conditions:

* Columns common to both versions of the table must be defined in the same order on the source and the replica.

  (This is true even if both tables have the same number of columns.)

* Columns common to both versions of the table must be defined before any additional columns.

  This means that executing an [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement on the replica where a new column is inserted into the table within the range of columns common to both tables causes replication to fail, as shown in the following example:

  Suppose that a table `t`, existing on the source and the replica, is defined by the following [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement:

  ```sql
  CREATE TABLE t (
      c1 INT,
      c2 INT,
      c3 INT
  );
  ```

  Suppose that the [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement shown here is executed on the replica:

  ```sql
  ALTER TABLE t ADD COLUMN cnew1 INT AFTER c3;
  ```

  The previous [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") is permitted on the replica because the columns `c1`, `c2`, and `c3` that are common to both versions of table `t` remain grouped together in both versions of the table, before any columns that differ.

  However, the following [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement cannot be executed on the replica without causing replication to break:

  ```sql
  ALTER TABLE t ADD COLUMN cnew2 INT AFTER c2;
  ```

  Replication fails after execution on the replica of the [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement just shown, because the new column `cnew2` comes between columns common to both versions of `t`.

* Each “extra” column in the version of the table having more columns must have a default value.

  A column's default value is determined by a number of factors, including its type, whether it is defined with a `DEFAULT` option, whether it is declared as `NULL`, and the server SQL mode in effect at the time of its creation; for more information, see [Section 11.6, “Data Type Default Values”](data-type-defaults.html "11.6 Data Type Default Values")).

In addition, when the replica's copy of the table has more columns than the source's copy, each column common to the tables must use the same data type in both tables.

**Examples.** The following examples illustrate some valid and invalid table definitions:

**More columns on the source.** The following table definitions are valid and replicate correctly:

```sql
source> CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT);
```

The following table definitions would raise an error because the definitions of the columns common to both versions of the table are in a different order on the replica than they are on the source:

```sql
source> CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
replica>  CREATE TABLE t1 (c2 INT, c1 INT);
```

The following table definitions would also raise an error because the definition of the extra column on the source appears before the definitions of the columns common to both versions of the table:

```sql
source> CREATE TABLE t1 (c3 INT, c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT);
```

**More columns on the replica.** The following table definitions are valid and replicate correctly:

```sql
source> CREATE TABLE t1 (c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
```

The following definitions raise an error because the columns common to both versions of the table are not defined in the same order on both the source and the replica:

```sql
source> CREATE TABLE t1 (c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c2 INT, c1 INT, c3 INT);
```

The following table definitions also raise an error because the definition for the extra column in the replica's version of the table appears before the definitions for the columns which are common to both versions of the table:

```sql
source> CREATE TABLE t1 (c1 INT, c2 INT);
replica>  CREATE TABLE t1 (c3 INT, c1 INT, c2 INT);
```

The following table definitions fail because the replica's version of the table has additional columns compared to the source's version, and the two versions of the table use different data types for the common column `c2`:

```sql
source> CREATE TABLE t1 (c1 INT, c2 BIGINT);
replica>  CREATE TABLE t1 (c1 INT, c2 INT, c3 INT);
```

##### 16.4.1.10.2 Replication of Columns Having Different Data Types

Corresponding columns on the source's and the replica's copies of the same table ideally should have the same data type. However, this is not always strictly enforced, as long as certain conditions are met.

It is usually possible to replicate from a column of a given data type to another column of the same type and same size or width, where applicable, or larger. For example, you can replicate from a `CHAR(10)` column to another `CHAR(10)`, or from a `CHAR(10)` column to a `CHAR(25)` column without any problems. In certain cases, it also possible to replicate from a column having one data type (on the source) to a column having a different data type (on the replica); when the data type of the source's version of the column is promoted to a type that is the same size or larger on the replica, this is known as attribute promotion.

Attribute promotion can be used with both statement-based and row-based replication, and is not dependent on the storage engine used by either the source or the replica. However, the choice of logging format does have an effect on the type conversions that are permitted; the particulars are discussed later in this section.

Important

Whether you use statement-based or row-based replication, the replica's copy of the table cannot contain more columns than the source's copy if you wish to employ attribute promotion.

**Statement-based replication.** When using statement-based replication, a simple rule of thumb to follow is, “If the statement run on the source would also execute successfully on the replica, it should also replicate successfully”. In other words, if the statement uses a value that is compatible with the type of a given column on the replica, the statement can be replicated. For example, you can insert any value that fits in a `TINYINT` column into a `BIGINT` column as well; it follows that, even if you change the type of a `TINYINT` column in the replica's copy of a table to `BIGINT`, any insert into that column on the source that succeeds should also succeed on the replica, since it is impossible to have a legal `TINYINT` value that is large enough to exceed a `BIGINT` column.

Prior to MySQL 5.7.1, when using statement-based replication, `AUTO_INCREMENT` columns were required to be the same on both the source and the replica; otherwise, updates could be applied to the wrong table on the replica. (Bug #12669186)

**Row-based replication: attribute promotion and demotion.** Row-based replication supports attribute promotion and demotion between smaller data types and larger types. It is also possible to specify whether or not to permit lossy (truncated) or non-lossy conversions of demoted column values, as explained later in this section.

**Lossy and non-lossy conversions.** In the event that the target type cannot represent the value being inserted, a decision must be made on how to handle the conversion. If we permit the conversion but truncate (or otherwise modify) the source value to achieve a “fit” in the target column, we make what is known as a lossy conversion. A conversion which does not require truncation or similar modifications to fit the source column value in the target column is a non-lossy conversion.

**Type conversion modes (slave\_type\_conversions variable).** The setting of the `slave_type_conversions` global server variable controls the type conversion mode used on the replica. This variable takes a set of values from the following table, which shows the effects of each mode on the replica's type-conversion behavior:

<table summary="Type conversion modes for the slave_type_conversions global server variable and the effects of each mode on the slave's type-conversion behavior."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Mode</th> <th>Effect</th> </tr></thead><tbody><tr> <td><code class="literal">ALL_LOSSY</code></td> <td><p> In this mode, type conversions that would mean loss of information are permitted. </p><p> This does not imply that non-lossy conversions are permitted, merely that only cases requiring either lossy conversions or no conversion at all are permitted; for example, enabling <span class="emphasis"><em>only</em></span> this mode permits an <code class="literal">INT</code> column to be converted to <code class="literal">TINYINT</code> (a lossy conversion), but not a <code class="literal">TINYINT</code> column to an <code class="literal">INT</code> column (non-lossy). Attempting the latter conversion in this case would cause replication to stop with an error on the replica. </p></td> </tr><tr> <td><code class="literal">ALL_NON_LOSSY</code></td> <td><p> This mode permits conversions that do not require truncation or other special handling of the source value; that is, it permits conversions where the target type has a wider range than the source type. </p><p> Setting this mode has no bearing on whether lossy conversions are permitted; this is controlled with the <code class="literal">ALL_LOSSY</code> mode. If only <code class="literal">ALL_NON_LOSSY</code> is set, but not <code class="literal">ALL_LOSSY</code>, then attempting a conversion that would result in the loss of data (such as <code class="literal">INT</code> to <code class="literal">TINYINT</code>, or <code class="literal">CHAR(25)</code> to <code class="literal">VARCHAR(20)</code>) causes the replica to stop with an error. </p></td> </tr><tr> <td><code class="literal">ALL_LOSSY,ALL_NON_LOSSY</code></td> <td><p> When this mode is set, all supported type conversions are permitted, whether or not they are lossy conversions. </p></td> </tr><tr> <td><code class="literal">ALL_SIGNED</code></td> <td><p> Treat promoted integer types as signed values (the default behavior). </p></td> </tr><tr> <td><code class="literal">ALL_UNSIGNED</code></td> <td><p> Treat promoted integer types as unsigned values. </p></td> </tr><tr> <td><code class="literal">ALL_SIGNED,ALL_UNSIGNED</code></td> <td><p> Treat promoted integer types as signed if possible, otherwise as unsigned. </p></td> </tr><tr> <td>[<span class="emphasis"><em>empty</em></span>]</td> <td><p> When <code class="literal">slave_type_conversions</code> is not set, no attribute promotion or demotion is permitted; this means that all columns in the source and target tables must be of the same types. </p><p> This mode is the default. </p></td> </tr></tbody></table>

When an integer type is promoted, its signedness is not preserved. By default, the replica treats all such values as signed. Beginning with MySQL 5.7.2, you can control this behavior using `ALL_SIGNED`, `ALL_UNSIGNED`, or both. (Bug#15831300) `ALL_SIGNED` tells the replica to treat all promoted integer types as signed; `ALL_UNSIGNED` instructs it to treat these as unsigned. Specifying both causes the replica to treat the value as signed if possible, otherwise to treat it as unsigned; the order in which they are listed is not significant. Neither `ALL_SIGNED` nor `ALL_UNSIGNED` has any effect if at least one of `ALL_LOSSY` or `ALL_NONLOSSY` is not also used.

Changing the type conversion mode requires restarting the replica with the new `slave_type_conversions` setting.

**Supported conversions.** Supported conversions between different but similar data types are shown in the following list:

* Between any of the integer types [`TINYINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), [`SMALLINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), [`MEDIUMINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), [`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), and [`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

  This includes conversions between the signed and unsigned versions of these types.

  Lossy conversions are made by truncating the source value to the maximum (or minimum) permitted by the target column. For ensuring non-lossy conversions when going from unsigned to signed types, the target column must be large enough to accommodate the range of values in the source column. For example, you can demote `TINYINT UNSIGNED` non-lossily to `SMALLINT`, but not to `TINYINT`.

* Between any of the decimal types [`DECIMAL`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC"), [`FLOAT`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE"), [`DOUBLE`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE"), and [`NUMERIC`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC").

  `FLOAT` to `DOUBLE` is a non-lossy conversion; `DOUBLE` to `FLOAT` can only be handled lossily. A conversion from `DECIMAL(M,D)` to `DECIMAL(M',D')` where `D' >= D` and `(M'-D') >= (M-D`) is non-lossy; for any case where `M' < M`, `D' < D`, or both, only a lossy conversion can be made.

  For any of the decimal types, if a value to be stored cannot be fit in the target type, the value is rounded down according to the rounding rules defined for the server elsewhere in the documentation. See [Section 12.21.4, “Rounding Behavior”](precision-math-rounding.html "12.21.4 Rounding Behavior"), for information about how this is done for decimal types.

* Between any of the string types [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), and [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types"), including conversions between different widths.

  Conversion of a `CHAR`, `VARCHAR`, or `TEXT` to a `CHAR`, `VARCHAR`, or `TEXT` column the same size or larger is never lossy. Lossy conversion is handled by inserting only the first *`N`* characters of the string on the replica, where *`N`* is the width of the target column.

  Important

  Replication between columns using different character sets is not supported.

* Between any of the binary data types [`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), and [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types"), including conversions between different widths.

  Conversion of a `BINARY`, `VARBINARY`, or `BLOB` to a `BINARY`, `VARBINARY`, or `BLOB` column the same size or larger is never lossy. Lossy conversion is handled by inserting only the first *`N`* bytes of the string on the replica, where *`N`* is the width of the target column.

* Between any 2 [`BIT`](bit-type.html "11.1.5 Bit-Value Type - BIT") columns of any 2 sizes.

  When inserting a value from a `BIT(M)` column into a `BIT(M')` column, where `M' > M`, the most significant bits of the `BIT(M')` columns are cleared (set to zero) and the *`M`* bits of the `BIT(M)` value are set as the least significant bits of the `BIT(M')` column.

  When inserting a value from a source `BIT(M)` column into a target `BIT(M')` column, where `M' < M`, the maximum possible value for the `BIT(M')` column is assigned; in other words, an “all-set” value is assigned to the target column.

Conversions between types not in the previous list are not permitted.
