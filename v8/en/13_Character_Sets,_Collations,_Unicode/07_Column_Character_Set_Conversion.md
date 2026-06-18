## 12.7 Column Character Set Conversion

To convert a binary or nonbinary string column to use a particular
character set, use [`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement"). For
successful conversion to occur, one of the following conditions
must apply:

* If the column has a binary data type
  ([`BINARY`](binary-varbinary.html "13.3.3 The BINARY and VARBINARY Types"),
  [`VARBINARY`](binary-varbinary.html "13.3.3 The BINARY and VARBINARY Types"),
  [`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types")), all the values that it
  contains must be encoded using a single character set (the
  character set you're converting the column to). If you use a
  binary column to store information in multiple character sets,
  MySQL has no way to know which values use which character set
  and cannot convert the data properly.

* If the column has a nonbinary data type
  ([`CHAR`](char.html "13.3.2 The CHAR and VARCHAR Types"),
  [`VARCHAR`](char.html "13.3.2 The CHAR and VARCHAR Types"),
  [`TEXT`](blob.html "13.3.4 The BLOB and TEXT Types")), its contents should be
  encoded in the column character set, not some other character
  set. If the contents are encoded in a different character set,
  you can convert the column to use a binary data type first,
  and then to a nonbinary column with the desired character set.

Suppose that a table `t` has a binary column
named `col1` defined as
`VARBINARY(50)`. Assuming that the information in
the column is encoded using a single character set, you can
convert it to a nonbinary column that has that character set. For
example, if `col1` contains binary data
representing characters in the `greek` character
set, you can convert it as follows:

```
ALTER TABLE t MODIFY col1 VARCHAR(50) CHARACTER SET greek;
```

If your original column has a type of
`BINARY(50)`, you could convert it to
`CHAR(50)`, but the resulting values are padded
with `0x00` bytes at the end, which may be
undesirable. To remove these bytes, use the
[`TRIM()`](string-functions.html#function_trim) function:

```
UPDATE t SET col1 = TRIM(TRAILING 0x00 FROM col1);
```

Suppose that table `t` has a nonbinary column
named `col1` defined as `CHAR(50)
CHARACTER SET latin1` but you want to convert it to use
`utf8mb4` so that you can store values from many
languages. The following statement accomplishes this:

```
ALTER TABLE t MODIFY col1 CHAR(50) CHARACTER SET utf8mb4;
```

Conversion may be lossy if the column contains characters that are
not in both character sets.

A special case occurs if you have old tables from before MySQL 4.1
where a nonbinary column contains values that actually are encoded
in a character set different from the server's default character
set. For example, an application might have stored
`sjis` values in a column, even though MySQL's
default character set was different. It is possible to convert the
column to use the proper character set but an additional step is
required. Suppose that the server's default character set was
`latin1` and `col1` is defined
as `CHAR(50)` but its contents are
`sjis` values. The first step is to convert the
column to a binary data type, which removes the existing character
set information without performing any character conversion:

```
ALTER TABLE t MODIFY col1 BLOB;
```

The next step is to convert the column to a nonbinary data type
with the proper character set:

```
ALTER TABLE t MODIFY col1 CHAR(50) CHARACTER SET sjis;
```

This procedure requires that the table not have been modified
already with statements such as
[`INSERT`](insert.html "15.2.7 INSERT Statement") or
[`UPDATE`](update.html "15.2.17 UPDATE Statement") after an upgrade to MySQL
4.1 or higher. In that case, MySQL would store new values in the
column using `latin1`, and the column would
contain a mix of `sjis` and
`latin1` values and cannot be converted properly.

If you specified attributes when creating a column initially, you
should also specify them when altering the table with
[`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement"). For example, if you
specified `NOT NULL` and an explicit
`DEFAULT` value, you should also provide them in
the [`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement") statement.
Otherwise, the resulting column definition does not include those
attributes.

To convert all character columns in a table, the `ALTER
TABLE ... CONVERT TO CHARACTER SET
charset` statement may be
useful. See [Section 15.1.9, “ALTER TABLE Statement”](alter-table.html "15.1.9 ALTER TABLE Statement").

Note

[`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement") statements which make
changes in table or column character sets or collations must be
performed using `ALGORITHM=COPY`. For more
information, see [Section 17.12.1, “Online DDL Operations”](innodb-online-ddl-operations.html "17.12.1 Online DDL Operations").