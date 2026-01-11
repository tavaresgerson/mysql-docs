### 15.1.17 CREATE JSON DUALITY VIEW Statement

```
CREATE [OR REPLACE]
    [ALGORITHM = {UNDEFINED | MERGE}]
    [DEFINER = user]
    [SQL SECURITY {DEFINER | INVOKER}]
    JSON [RELATIONAL] DUALITY VIEW
    [IF NOT EXISTS] [schema_name.]view_name
    AS json_duality_select_statement

json_duality_select_statement:
    SELECT json_duality_object_expression
    FROM [schema_name.]root_table_name [AS table_alias]

json_duality_object_expression:
    JSON_DUALITY_OBJECT(...)
```

This statement creates a JSON duality view named *`view_name`*. Using `OR REPLACE` causes any existing JSON duality view of that name to be replaced by a new JSON duality view having the same name. Specifying `IF NOT EXISTS` causes view creation to be attempted only if there is no existing JSON duality view with the same name, rather than returning an error.

JSON duality views use the same namespace as SQL views. This means that you cannot create a JSON duality view having the same name as an existing SQL view; it also means that you cannot create an SQL view with the same name as an existing JSON duality view. `CREATE OR REPLACE` does not work to replace an SQL view with a JSON duality view, or a JSON duality view with an SQL view.

`DEFINER` and `SQL SECURITY` work with this statement as they do for `CREATE VIEW`. For `ALGORITHM`, using `TEMPTABLE` returns an error.

The `RELATIONAL` keyword is optional, has no effect, and is omitted from our examples.

*`schema_name`*, if used with the view name, must be the name of an existing schema. If the schema name is omitted, the JSON duality view is created in the current schema; if no schema is currently selected and none is specified, the statement is rejected with an error. *`schema_name`* and *`view_name`* must conform to the rules for MySQL identifiers; see Section 11.2, “Schema Object Names”, as well as Section 11.2.1, “Identifier Length Limits”, for information about these rules.

The `WITH ... CHECK OPTION` clause works with `CREATE JSON DUALITY VIEW` as it does with `CREATE VIEW`. See the description of that statement for more information.

*`json_duality_select_statement`* selects a JSON object expression (*`json_duality_object_expression`*) constructed using columns from the table *`root_table_name`* in schema *`schema_name`*. If *`schema_name`* is omitted, MySQL assumes that the table is in the current schema; if no schema is specified and none is currently selected, the statement is rejected with an error. Both *`schema_name`* and *`root_table_name`* must follow the usual rules for MySQL identifiers.

*`json_duality_select_statement`* must contain one and only one `JSON_DUALITY_OBJECT()` expression and one `FROM` clause. Set operations (`UNION`, `INTERSECT`, `EXCEPT`) and common table expressions (`WITH`")) are not supported. The `FROM` clause must reference a single table. `WHERE`, `JOIN`, `GROUP BY`, `ORDER BY`, `HAVING`, `WINDOW`, and `LIMIT` clauses are not supported.

*`json_duality_object_expression`* is a value returned by `JSON_DUALITY_OBJECT()`. See the description of that function for information about its arguments.

The `JSON_DUALITY_OBJECT()` function returns a JSON duality object for use in `CREATE JSON DUALITY VIEW` or `ALTER JSON DUALITY VIEW`. Attempting to invoke it in any other context results in an error.

`JSON_DUALITY_OBJECT()` takes one or two arguments: an optional table annotations expression, and a set of key-value pairs in JSON object format.

Requirements:

* It must include a key named `_id` in the root object representing the primary key of the root table. Absence of this key results in an error. No sub-key may be named `_id`.

* All participating tables, including the root table and any tables referenced within *`nested_descendent_json_objects`* and *`singleton_descendent_json_object`*, must be base tables and have a primary key.

* The table projection must include the primary key of every participating table.

* Child tables being projected can be related to parent tables in one of two ways:

  + `PK - FK` relationship: If a child table is projected as *`singleton_descendent_json_object`*, the `WHERE` clause must enforce the format `child_table.PK = parent_table.FK`. If a child table is projected as *`nested_descendent_json_objects`*, the `WHERE` clause must enforce the format `child_table.FK = parent_table.PK`.

  + `PK - Any Column` relationship: If a child table is projected as *`singleton_descendent_json_object`*, the `WHERE` clause must enforce the format `child_table.PK = parent_table.any_column`. If a child table is projected as *`nested_descendent_json_objects`*, the `WHERE` clause must enforce the format `child_table.any_column = parent_table.PK`.

The complete syntax for the arguments to this function is shown here, with additional notes following:

```
table_annotations:
    WITH (table_annotation[, table_annotation]...)

table_annotation:
    INSERT | UPDATE | DELETE

json_duality_key_value_pairs:
    json_duality_key_value_pair[, json_duality_key_value_pair]...

json_duality_key_value_pair:
    key_name:value_expression

value_expression:
    column_name
    | (singleton_descendent_json_object)
    | (nested_descendent_json_objects)

singleton_descendent_json_object:
    SELECT json_duality_object_expression
    FROM child_table_name [AS table_alias]
    WHERE json_duality_join_condition

nested_descendent_json_objects:
    SELECT JSON_ARRAYAGG(json_duality_object_expression [json_constructor_null_clause])
    FROM child_table_name [AS table_alias]
    WHERE json_duality_join_condition

json_constructor_null_clause:
    NULL ON NULL | ABSENT ON NULL

json_duality_join_condition:
    [schema_name.]child_table_name.column_name
    = [schema_name.]parent_table_name.column_name

json_duality_object_expression:
    JSON_DUALITY_OBJECT(
        [table_annotations_expression] json_duality_key_value_pairs
    )
```

*`json_duality_key_value_pairs`* is a set of key-value pairs in *`key_name`*:*`value_expression`* format. There must be a key named `_id` in the root object, and it must correspond to a primary key column of the table being projected; sub-keys named `_id` are not allowed.

*`value_expression`* must be one of: a column name; an object returned by `JSON_DUALITY_OBJECT()` (singleton descendant); an object returned by `JSON_ARRAYAGG()` (nested descendant).

*`column_name`* must reference a valid column in the table that is being projected (*`root_table_name`* or *`current_table_name`*). The same *`column_name`* cannot be used more than once in a single invocation of `JSON_DUALITY_OBJECT()`. Functions and operators cannot be used with *`column_name`*. Columns of types `JSON`, `VECTOR`, and `GEOMETRY` (including all derivatives such as `POINT`, `LINESTRING`, and `POLYGON`) are not supported, nor are generated columns. The column having the key `_id` in the root table for *`json_duality_key_value_pairs`* must be a primary key of that table.

The *`singleton_descendent_json_object`* consists of a `SELECT` statement with a `FROM` clause. The `SELECT` list and `FROM` clause follow the same rules as those described for the top-level query in a `CREATE JSON DUALITY VIEW` statement.

*`nested_descendent_json_objects`* selects a single expression (*`json_duality_object_expression`*) using `JSON_ARRAYAGG()`, which must contain a non-empty `JSON_DUALITY_OBJECT()`. The select list and `FROM` clause follow the same rules as those described for *`singleton_descendent_json_object`*. The optional *`json_constructor_null_clause`* specifies the behavior of this function when *`json_duality_object_expression`* evaluates to null. It takes either of the values `ABSENT ON NULL` or `NULL ON NULL` (the default). `NULL ON NULL` returns the JSON `null` value; `ABSENT ON NULL` causes the value to be omitted from the output JSON array.

*`singleton_descendent_json_object`* and *`nested_descendent_json_objects`* also support a `WHERE` clause. This must contain one expression only, having the form shown here:

```
[schema_name.]child_table_name.column_name
    = [schema_name.]parent_table_name.column_name
```

No types of conditions other than equality are supported in this `WHERE` clause. Multiple conditions using `AND` or `OR` operators are also not supported.

`JSON_DUALITY_OBJECT()` takes an optional *`table_annotations_expression`*. This expression consists of a comma-separated list that must include the annotation values `INSERT`, `UPDATE`, and `DELETE`, in any order. No annotation value may be listed more than once. The function returns a mapping between columns of *`table`* and the JSON collection defined by *`json_duality_key_value_pairs`*. The value used with each key can be one of three types:

* The name of a column in *`table`*. This must be the name of the column only, and cannot be an expression.

* A *`singleton_descendent_json_object`* which consists of a `SELECT` with a `FROM` clause. The `SELECT` list and `FROM` clause follow the same rules as those described for the top-level query in `CREATE JSON DUALITY VIEW`.

* A set of *`nested_descendent_json_objects`* selects an expression using `JSON_ARRAYAGG()`, which in turn contains `JSON_DUALITY_OBJECT()`.

If the table is projected multiple times, the set of columns projected must be consistent across all instances of the table projection.

See Section 27.7, “JSON Duality Views”, for more information and examples.
