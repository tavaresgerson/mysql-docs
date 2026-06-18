### 15.1.6 ALTER JSON DUALITY VIEW Statement

```
ALTER
    [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
    [DEFINER = user]
    [SQL SECURITY { DEFINER | INVOKER }]
    JSON DUALITY VIEW view_name
    AS json_duality_select_statement
    [WITH [CASCADED | LOCAL] CHECK OPTON]

json_duality_select_statement:
    SELECT json_duality_object_expression
    FROM [schema_name .] root_table_name [AS table_alias_name]
```

This statement updates a JSON duality view.

*`json_duality_select_statement`* follows
the same rules as for [`CREATE JSON DUALITY
VIEW`](create-json-duality-view.html "15.1.17 CREATE JSON DUALITY VIEW Statement").
*`json_duality_object_expression`* is a
value returned by
[`JSON_DUALITY_OBJECT()`](json-creation-functions.html#function_json-duality-object). See the
description of that function for information about its arguments.

For more information, see [Section 27.7, “JSON Duality Views”](json-duality-views.html "27.7 JSON Duality Views").