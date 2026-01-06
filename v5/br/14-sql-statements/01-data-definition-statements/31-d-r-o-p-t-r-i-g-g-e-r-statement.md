### 13.1.31 Declaração DROP TRIGGER

```sql
DROP TRIGGER [IF EXISTS] [schema_name.]trigger_name
```

Essa declaração elimina um gatilho. O nome do esquema (banco de dados) é opcional. Se o esquema for omitido, o gatilho será eliminado do esquema padrão. `DROP TRIGGER` requer o privilégio `TRIGGER` para a tabela associada ao gatilho.

Use `IF EXISTS` para evitar que um erro ocorra para um gatilho que não existe. Uma `NOTA` é gerada para um gatilho inexistente quando você usa `IF EXISTS`. Veja Seção 13.7.5.40, “Instrução SHOW WARNINGS”.

Os gatilhos de uma tabela também são removidos se você excluir a tabela.
