### 23.5.1 View Syntax

The [`CREATE VIEW`](create-view.html "13.1.21 CREATE VIEW Statement") statement creates a
new view (see [Section 13.1.21, “CREATE VIEW Statement”](create-view.html "13.1.21 CREATE VIEW Statement")). To alter the
definition of a view or drop a view, use
[`ALTER VIEW`](alter-view.html "13.1.10 ALTER VIEW Statement") (see
[Section 13.1.10, “ALTER VIEW Statement”](alter-view.html "13.1.10 ALTER VIEW Statement")), or [`DROP
VIEW`](drop-view.html "13.1.32 DROP VIEW Statement") (see [Section 13.1.32, “DROP VIEW Statement”](drop-view.html "13.1.32 DROP VIEW Statement")).

A view can be created from many kinds of
[`SELECT`](select.html "13.2.9 SELECT Statement") statements. It can refer to
base tables or other views. It can use joins,
[`UNION`](union.html "13.2.9.3 UNION Clause"), and subqueries. The
[`SELECT`](select.html "13.2.9 SELECT Statement") need not even refer to any
tables. The following example defines a view that selects two
columns from another table, as well as an expression calculated
from those columns:

```sql
mysql> CREATE TABLE t (qty INT, price INT);
mysql> INSERT INTO t VALUES(3, 50), (5, 60);
mysql> CREATE VIEW v AS SELECT qty, price, qty*price AS value FROM t;
mysql> SELECT * FROM v;
+------+-------+-------+
| qty  | price | value |
+------+-------+-------+
|    3 |    50 |   150 |
|    5 |    60 |   300 |
+------+-------+-------+
mysql> SELECT * FROM v WHERE qty = 5;
+------+-------+-------+
| qty  | price | value |
+------+-------+-------+
|    5 |    60 |   300 |
+------+-------+-------+
```