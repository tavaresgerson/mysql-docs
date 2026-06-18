### 15.1.35 DROP VIEW Statement

```
DROP VIEW [IF EXISTS]
    view_name [, view_name] ...
    [RESTRICT | CASCADE]
```

[`DROP VIEW`](drop-view.html "15.1.35 DROP VIEW Statement") removes one or more
views. You must have the [`DROP`](privileges-provided.html#priv_drop)
privilege for each view.

If any views named in the argument list do not exist, the
statement fails with an error indicating by name which nonexisting
views it was unable to drop, and no changes are made.

Note

In MySQL 5.7 and earlier,
[`DROP VIEW`](drop-view.html "15.1.35 DROP VIEW Statement") returns an error if any
views named in the argument list do not exist, but also drops
all views in the list that do exist. Due to the change in
behavior in MySQL 8.0, a partially completed
[`DROP VIEW`](drop-view.html "15.1.35 DROP VIEW Statement") operation on a MySQL
5.7 replication source server fails when
replicated on a MySQL 8.0 replica. To avoid this
failure scenario, use `IF EXISTS` syntax in
[`DROP VIEW`](drop-view.html "15.1.35 DROP VIEW Statement") statements to prevent
an error from occurring for views that do not exist. For more
information, see [Section 15.1.1, “Atomic Data Definition Statement Support”](atomic-ddl.html "15.1.1 Atomic Data Definition Statement Support").

The `IF EXISTS` clause prevents an error from
occurring for views that don't exist. When this clause is given, a
`NOTE` is generated for each nonexistent view.
See [Section 15.7.7.42, “SHOW WARNINGS Statement”](show-warnings.html "15.7.7.42 SHOW WARNINGS Statement").

`RESTRICT` and `CASCADE`, if
given, are parsed and ignored.