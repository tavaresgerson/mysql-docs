--- title: MySQL 8.4 Reference Manual :: 11.2.2 Identifier Qualifiers url: https://dev.mysql.com/doc/refman/8.4/en/identifier-qualifiers.html order: 12 ---



### 11.2.2 Identifier Qualifiers

Object names may be unqualified or qualified. An unqualified name is permitted in contexts where interpretation of the name is unambiguous. A qualified name includes at least one qualifier to clarify the interpretive context by overriding a default context or providing missing context.

For example, this statement creates a table using the unqualified name `t1`:

```
CREATE TABLE t1 (i INT);
```

Because `t1` includes no qualifier to specify a database, the statement creates the table in the default database. If there is no default database, an error occurs.

This statement creates a table using the qualified name `db1.t1`:

```
CREATE TABLE db1.t1 (i INT);
```

Because `db1.t1` includes a database qualifier `db1`, the statement creates `t1` in the database named `db1`, regardless of the default database. The qualifier *must* be specified if there is no default database. The qualifier *may* be specified if there is a default database, to specify a database different from the default, or to make the database explicit if the default is the same as the one specified.

Qualifiers have these characteristics:

* An unqualified name consists of a single identifier. A qualified name consists of multiple identifiers.
* The components of a multiple-part name must be separated by period (`.`) characters. The initial parts of a multiple-part name act as qualifiers that affect the context within which to interpret the final identifier.
* The qualifier character is a separate token and need not be contiguous with the associated identifiers. For example, *`tbl_name.col_name`* and *`tbl_name . col_name`* are equivalent.
* If any components of a multiple-part name require quoting, quote them individually rather than quoting the name as a whole. For example, write `` `my-table`.`my-column` ``, not `` `my-table.my-column` ``.
* A reserved word that follows a period in a qualified name must be an identifier, so in that context it need not be quoted.

The permitted qualifiers for object names depend on the object type:

* A database name is fully qualified and takes no qualifier:

  ```
  CREATE DATABASE db1;
  ```
* A table, view, or stored program name may be given a database-name qualifier. Examples of unqualified and qualified names in `CREATE` statements:

  ```
  CREATE TABLE mytable ...;
  CREATE VIEW myview ...;
  CREATE PROCEDURE myproc ...;
  CREATE FUNCTION myfunc ...;
  CREATE EVENT myevent ...;

  CREATE TABLE mydb.mytable ...;
  CREATE VIEW mydb.myview ...;
  CREATE PROCEDURE mydb.myproc ...;
  CREATE FUNCTION mydb.myfunc ...;
  CREATE EVENT mydb.myevent ...;
  ```
* A trigger is associated with a table, so any qualifier applies to the table name:

  ```
  CREATE TRIGGER mytrigger ... ON mytable ...;

  CREATE TRIGGER mytrigger ... ON mydb.mytable ...;
  ```
* A column name may be given multiple qualifiers to indicate context in statements that reference it, as shown in the following table.

  <table><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Column Reference</th> <th>Meaning</th> </tr></thead><tbody><tr> <td><em><code>col_name</code></em></td> <td>Column <em><code>col_name</code></em> from whichever table used in the statement contains a column of that name</td> </tr><tr> <td><em><code>tbl_name.col_name</code></em></td> <td>Column <em><code>col_name</code></em> from table <em><code>tbl_name</code></em> of the default database</td> </tr><tr> <td><em><code>db_name.tbl_name.col_name</code></em></td> <td>Column <em><code>col_name</code></em> from table <em><code>tbl_name</code></em> of the database <em><code>db_name</code></em></td> </tr></tbody></table>

  In other words, a column name may be given a table-name qualifier, which itself may be given a database-name qualifier. Examples of unqualified and qualified column references in `SELECT` statements:

  ```
  SELECT c1 FROM mytable
  WHERE c2 > 100;

  SELECT mytable.c1 FROM mytable
  WHERE mytable.c2 > 100;

  SELECT mydb.mytable.c1 FROM mydb.mytable
  WHERE mydb.mytable.c2 > 100;
  ```

You need not specify a qualifier for an object reference in a statement unless the unqualified reference is ambiguous. Suppose that column `c1` occurs only in table `t1`, `c2` only in `t2`, and `c` in both `t1` and `t2`. Any unqualified reference to `c` is ambiguous in a statement that refers to both tables and must be qualified as `t1.c` or `t2.c` to indicate which table you mean:

```
SELECT c1, c2, t1.c FROM t1 INNER JOIN t2
WHERE t2.c > 100;
```

Similarly, to retrieve from a table `t` in database `db1` and from a table `t` in database `db2` in the same statement, you must qualify the table references: For references to columns in those tables, qualifiers are required only for column names that appear in both tables. Suppose that column `c1` occurs only in table `db1.t`, `c2` only in `db2.t`, and `c` in both `db1.t` and `db2.t`. In this case, `c` is ambiguous and must be qualified but `c1` and `c2` need not be:

```
SELECT c1, c2, db1.t.c FROM db1.t INNER JOIN db2.t
WHERE db2.t.c > 100;
```

Table aliases enable qualified column references to be written more simply:

```
SELECT c1, c2, t1.c FROM db1.t AS t1 INNER JOIN db2.t AS t2
WHERE t2.c > 100;
```


