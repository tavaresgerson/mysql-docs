### 13.8.2 EXPLAIN Statement

```sql
{EXPLAIN | DESCRIBE | DESC}
    tbl_name [col_name | wild]

{EXPLAIN | DESCRIBE | DESC}
    [explain_type]
    {explainable_stmt | FOR CONNECTION connection_id}

explain_type: {
    EXTENDED
  | PARTITIONS
  | FORMAT = format_name
}

format_name: {
    TRADITIONAL
  | JSON
}

explainable_stmt: {
    SELECT statement
  | DELETE statement
  | INSERT statement
  | REPLACE statement
  | UPDATE statement
}
```

The [`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement") and [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") statements are synonyms. In practice, the [`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement") keyword is more often used to obtain information about table structure, whereas [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") is used to obtain a query execution plan (that is, an explanation of how MySQL would execute a query).

The following discussion uses the [`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement") and [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") keywords in accordance with those uses, but the MySQL parser treats them as completely synonymous.

* [Obtaining Table Structure Information](explain.html#explain-table-structure "Obtaining Table Structure Information")
* [Obtaining Execution Plan Information](explain.html#explain-execution-plan "Obtaining Execution Plan Information")

#### Obtaining Table Structure Information

[`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement") provides information about the columns in a table:

```sql
mysql> DESCRIBE City;
+------------+----------+------+-----+---------+----------------+
| Field      | Type     | Null | Key | Default | Extra          |
+------------+----------+------+-----+---------+----------------+
| Id         | int(11)  | NO   | PRI | NULL    | auto_increment |
| Name       | char(35) | NO   |     |         |                |
| Country    | char(3)  | NO   | UNI |         |                |
| District   | char(20) | YES  | MUL |         |                |
| Population | int(11)  | NO   |     | 0       |                |
+------------+----------+------+-----+---------+----------------+
```

[`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement") is a shortcut for [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement"). These statements also display information for views. The description for [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") provides more information about the output columns. See [Section 13.7.5.5, “SHOW COLUMNS Statement”](show-columns.html "13.7.5.5 SHOW COLUMNS Statement").

By default, [`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement") displays information about all columns in the table. *`col_name`*, if given, is the name of a column in the table. In this case, the statement displays information only for the named column. *`wild`*, if given, is a pattern string. It can contain the SQL `%` and `_` wildcard characters. In this case, the statement displays output only for the columns with names matching the string. There is no need to enclose the string within quotation marks unless it contains spaces or other special characters.

The [`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement") statement is provided for compatibility with Oracle.

The [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement"), [`SHOW TABLE STATUS`](show-table-status.html "13.7.5.36 SHOW TABLE STATUS Statement"), and [`SHOW INDEX`](show-index.html "13.7.5.22 SHOW INDEX Statement") statements also provide information about tables. See [Section 13.7.5, “SHOW Statements”](show.html "13.7.5 SHOW Statements").

#### Obtaining Execution Plan Information

The [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") statement provides information about how MySQL executes statements:

* [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") works with [`SELECT`](select.html "13.2.9 SELECT Statement"), [`DELETE`](delete.html "13.2.2 DELETE Statement"), [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`REPLACE`](replace.html "13.2.8 REPLACE Statement"), and [`UPDATE`](update.html "13.2.11 UPDATE Statement") statements.

* When [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") is used with an explainable statement, MySQL displays information from the optimizer about the statement execution plan. That is, MySQL explains how it would process the statement, including information about how tables are joined and in which order. For information about using [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") to obtain execution plan information, see [Section 8.8.2, “EXPLAIN Output Format”](explain-output.html "8.8.2 EXPLAIN Output Format").

* When [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") is used with `FOR CONNECTION connection_id` rather than an explainable statement, it displays the execution plan for the statement executing in the named connection. See [Section 8.8.4, “Obtaining Execution Plan Information for a Named Connection”](explain-for-connection.html "8.8.4 Obtaining Execution Plan Information for a Named Connection").

* For [`SELECT`](select.html "13.2.9 SELECT Statement") statements, [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") produces additional execution plan information that can be displayed using [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement"). See [Section 8.8.3, “Extended EXPLAIN Output Format”](explain-extended.html "8.8.3 Extended EXPLAIN Output Format").

  Note

  In older MySQL releases, extended information was produced using [`EXPLAIN EXTENDED`](explain.html "13.8.2 EXPLAIN Statement"). That syntax is still recognized for backward compatibility but extended output is now enabled by default, so the `EXTENDED` keyword is superfluous and deprecated. Its use results in a warning, and it is removed from [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") syntax in MySQL 8.0.

* [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") is useful for examining queries involving partitioned tables. See [Section 22.3.5, “Obtaining Information About Partitions”](partitioning-info.html "22.3.5 Obtaining Information About Partitions").

  Note

  In older MySQL releases, partition information was produced using [`EXPLAIN PARTITIONS`](explain.html "13.8.2 EXPLAIN Statement"). That syntax is still recognized for backward compatibility but partition output is now enabled by default, so the `PARTITIONS` keyword is superfluous and deprecated. Its use results in a warning, and it is removed from [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") syntax in MySQL 8.0.

* The `FORMAT` option can be used to select the output format. `TRADITIONAL` presents the output in tabular format. This is the default if no `FORMAT` option is present. `JSON` format displays the information in JSON format.

  For complex statements, the JSON output can be quite large; in particular, it can be difficult when reading it to pair the closing bracket and opening brackets; to cause the JSON structure's key, if it has one, to be repeated near the closing bracket, set [`end_markers_in_json=ON`](server-system-variables.html#sysvar_end_markers_in_json). You should be aware that while this makes the output easier to read, it also renders the JSON invalid, causing JSON functions to raise an error.

[`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") requires the same privileges required to execute the explained statement. Additionally, [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") also requires the [`SHOW VIEW`](privileges-provided.html#priv_show-view) privilege for any explained view.

With the help of [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement"), you can see where you should add indexes to tables so that the statement executes faster by using indexes to find rows. You can also use [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") to check whether the optimizer joins the tables in an optimal order. To give a hint to the optimizer to use a join order corresponding to the order in which the tables are named in a [`SELECT`](select.html "13.2.9 SELECT Statement") statement, begin the statement with `SELECT STRAIGHT_JOIN` rather than just [`SELECT`](select.html "13.2.9 SELECT Statement"). (See [Section 13.2.9, “SELECT Statement”](select.html "13.2.9 SELECT Statement").)

The optimizer trace may sometimes provide information complementary to that of [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement"). However, the optimizer trace format and content are subject to change between versions. For details, see [Section 8.15, “Tracing the Optimizer”](optimizer-tracing.html "8.15 Tracing the Optimizer").

If you have a problem with indexes not being used when you believe that they should be, run [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") to update table statistics, such as cardinality of keys, that can affect the choices the optimizer makes. See [Section 13.7.2.1, “ANALYZE TABLE Statement”](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement").

Note

MySQL Workbench has a Visual Explain capability that provides a visual representation of [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") output. See [Tutorial: Using Explain to Improve Query Performance](/doc/workbench/en/wb-tutorial-visual-explain-dbt3.html).
