### 13.1.31 DROP TRIGGER Statement

```sql
DROP TRIGGER [IF EXISTS] [schema_name.]trigger_name
```

This statement drops a trigger. The schema (database) name is optional. If the schema is omitted, the trigger is dropped from the default schema. [`DROP TRIGGER`](drop-trigger.html "13.1.31 DROP TRIGGER Statement") requires the [`TRIGGER`](privileges-provided.html#priv_trigger) privilege for the table associated with the trigger.

Use `IF EXISTS` to prevent an error from occurring for a trigger that does not exist. A `NOTE` is generated for a nonexistent trigger when using `IF EXISTS`. See [Section 13.7.5.40, “SHOW WARNINGS Statement”](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement").

Triggers for a table are also dropped if you drop the table.
