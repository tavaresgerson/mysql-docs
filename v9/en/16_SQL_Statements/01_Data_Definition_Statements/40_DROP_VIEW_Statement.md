### 15.1.40 DROP VIEW Statement

```
DROP VIEW [IF EXISTS]
    view_name [, view_name] ...
    [RESTRICT | CASCADE]
```

[`DROP VIEW`](drop-view.html "15.1.40 DROP VIEW Statement") removes one or more
views. You must have the [`DROP`](privileges-provided.html#priv_drop)
privilege for each view. `DROP VIEW` works with
SQL views (see [Section 27.6, “Using Views”](views.html "27.6 Using Views")) as well as with JSON
duality views (see [Section 27.7, “JSON Duality Views”](json-duality-views.html "27.7 JSON Duality Views")).

If any views named in the argument list do not exist, the
statement fails with an error indicating by name which nonexisting
views it was unable to drop, and no changes are made.

The `IF EXISTS` clause prevents an error from
occurring for views that don't exist. When this clause is given, a
`NOTE` is generated for each nonexistent view.
See [Section 15.7.7.43, “SHOW WARNINGS Statement”](show-warnings.html "15.7.7.43 SHOW WARNINGS Statement").

`RESTRICT` and `CASCADE`, if
given, are parsed and ignored.