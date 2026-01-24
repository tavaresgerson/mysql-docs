### 23.5.4 The View WITH CHECK OPTION Clause

The `WITH CHECK OPTION` clause can be given for an updatable view to prevent inserts to rows for which the `WHERE` clause in the *`select_statement`* is not true. It also prevents updates to rows for which the `WHERE` clause is true but the update would cause it to be not true (in other words, it prevents visible rows from being updated to nonvisible rows).

In a `WITH CHECK OPTION` clause for an updatable view, the `LOCAL` and `CASCADED` keywords determine the scope of check testing when the view is defined in terms of another view. When neither keyword is given, the default is `CASCADED`.

Before MySQL 5.7.6, `WITH CHECK OPTION` testing works like this:

* With `LOCAL`, the view `WHERE` clause is checked, but no underlying views are checked.

* With `CASCADED`, the view `WHERE` clause is checked, then checking recurses to underlying views, adds `WITH CASCADED CHECK OPTION` to them (for purposes of the check; their definitions remain unchanged), and applies the same rules.

* With no check option, the view `WHERE` clause is not checked, and no underlying views are checked.

As of MySQL 5.7.6, `WITH CHECK OPTION` testing is standard-compliant (with changed semantics from previously for `LOCAL` and no check clause):

* With `LOCAL`, the view `WHERE` clause is checked, then checking recurses to underlying views and applies the same rules.

* With `CASCADED`, the view `WHERE` clause is checked, then checking recurses to underlying views, adds `WITH CASCADED CHECK OPTION` to them (for purposes of the check; their definitions remain unchanged), and applies the same rules.

* With no check option, the view `WHERE` clause is not checked, then checking recurses to underlying views, and applies the same rules.

Consider the definitions for the following table and set of views:

```sql
CREATE TABLE t1 (a INT);
CREATE VIEW v1 AS SELECT * FROM t1 WHERE a < 2
WITH CHECK OPTION;
CREATE VIEW v2 AS SELECT * FROM v1 WHERE a > 0
WITH LOCAL CHECK OPTION;
CREATE VIEW v3 AS SELECT * FROM v1 WHERE a > 0
WITH CASCADED CHECK OPTION;
```

Here the `v2` and `v3` views are defined in terms of another view, `v1`. Before MySQL 5.7.6, because `v2` has a `LOCAL` check option, inserts are tested only against the `v2` check. `v3` has a `CASCADED` check option, so inserts are tested not only against the `v3` check, but against those of underlying views. The following statements illustrate these differences:

```sql
mysql> INSERT INTO v2 VALUES (2);
Query OK, 1 row affected (0.00 sec)
mysql> INSERT INTO v3 VALUES (2);
ERROR 1369 (HY000): CHECK OPTION failed 'test.v3'
```

As of MySQL 5.7.6, the semantics for `LOCAL` differ from previously: Inserts for `v2` are checked against its `LOCAL` check option, then (unlike before 5.7.6), the check recurses to `v1` and the rules are applied again. The rules for `v1` cause a check failure. The check for `v3` fails as before:

```sql
mysql> INSERT INTO v2 VALUES (2);
ERROR 1369 (HY000): CHECK OPTION failed 'test.v2'
mysql> INSERT INTO v3 VALUES (2);
ERROR 1369 (HY000): CHECK OPTION failed 'test.v3'
```
