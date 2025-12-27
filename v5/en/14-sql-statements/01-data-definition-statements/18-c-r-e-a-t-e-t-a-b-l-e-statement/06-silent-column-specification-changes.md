#### 13.1.18.6 Silent Column Specification Changes

In some cases, MySQL silently changes column specifications from those given in a [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") or [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement. These might be changes to a data type, to attributes associated with a data type, or to an index specification.

All changes are subject to the internal row-size limit of 65,535 bytes, which may cause some attempts at data type changes to fail. See [Section 8.4.7, “Limits on Table Column Count and Row Size”](column-count-limit.html "8.4.7 Limits on Table Column Count and Row Size").

* Columns that are part of a `PRIMARY KEY` are made `NOT NULL` even if not declared that way.

* Trailing spaces are automatically deleted from [`ENUM`](enum.html "11.3.5 The ENUM Type") and [`SET`](set.html "11.3.6 The SET Type") member values when the table is created.

* MySQL maps certain data types used by other SQL database vendors to MySQL types. See [Section 11.9, “Using Data Types from Other Database Engines”](other-vendor-data-types.html "11.9 Using Data Types from Other Database Engines").

* If you include a `USING` clause to specify an index type that is not permitted for a given storage engine, but there is another index type available that the engine can use without affecting query results, the engine uses the available type.

* If strict SQL mode is not enabled, a [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") column with a length specification greater than 65535 is converted to [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types"), and a [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") column with a length specification greater than 65535 is converted to [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types"). Otherwise, an error occurs in either of these cases.

* Specifying the `CHARACTER SET binary` attribute for a character data type causes the column to be created as the corresponding binary data type: [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") becomes [`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") becomes [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), and [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") becomes [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types"). For the [`ENUM`](enum.html "11.3.5 The ENUM Type") and [`SET`](set.html "11.3.6 The SET Type") data types, this does not occur; they are created as declared. Suppose that you specify a table using this definition:

  ```sql
  CREATE TABLE t
  (
    c1 VARCHAR(10) CHARACTER SET binary,
    c2 TEXT CHARACTER SET binary,
    c3 ENUM('a','b','c') CHARACTER SET binary
  );
  ```

  The resulting table has this definition:

  ```sql
  CREATE TABLE t
  (
    c1 VARBINARY(10),
    c2 BLOB,
    c3 ENUM('a','b','c') CHARACTER SET binary
  );
  ```

To see whether MySQL used a data type other than the one you specified, issue a [`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement") or [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") statement after creating or altering the table.

Certain other data type changes can occur if you compress a table using [**myisampack**](myisampack.html "4.6.5 myisampack — Generate Compressed, Read-Only MyISAM Tables"). See [Section 15.2.3.3, “Compressed Table Characteristics”](compressed-format.html "15.2.3.3 Compressed Table Characteristics").
