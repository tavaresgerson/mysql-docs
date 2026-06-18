### 15.1.34 Declaração DROP TRIGGER

```
DROP TRIGGER [IF EXISTS] [schema_name.]trigger_name
```

Esta declaração elimina um gatilho. O nome do esquema (banco de dados) é opcional. Se o esquema for omitido, o gatilho será eliminado do esquema padrão. `DROP TRIGGER` requer o privilégio `TRIGGER` para a tabela associada ao gatilho.

Use `IF EXISTS` para evitar que um erro ocorra para um gatilho que não existe. Um `NOTE` é gerado para um gatilho inexistente ao usar `IF EXISTS`. Veja a Seção 15.7.7.42, “Instrução SHOW WARNINGS”.

Os gatilhos de uma tabela também são removidos se você excluir a tabela.
