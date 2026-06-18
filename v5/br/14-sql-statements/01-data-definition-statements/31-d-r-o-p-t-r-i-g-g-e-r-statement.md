### 13.1.31 Declaração DROP TRIGGER

```sql
DROP TRIGGER [IF EXISTS] [schema_name.]trigger_name
```

Esta declaração descarta um trigger. O nome do schema (database) é opcional. Se o schema for omitido, o trigger é descartado do schema padrão. O `DROP TRIGGER` exige o privilégio `TRIGGER` para a tabela associada ao trigger.

Use `IF EXISTS` para evitar que ocorra um erro para um trigger que não existe. Uma `NOTE` é gerada para um trigger inexistente ao usar `IF EXISTS`. Consulte Seção 13.7.5.40, “Declaração SHOW WARNINGS”.

Triggers associados a uma tabela também são descartados se você descartar a tabela.