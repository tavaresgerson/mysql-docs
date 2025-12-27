### 15.1.39 Declaração DROP TRIGGER

```
DROP TRIGGER [IF EXISTS] [schema_name.]trigger_name
```

Esta declaração elimina um gatilho. O nome do esquema (banco de dados) é opcional. Se o esquema for omitido, o gatilho será eliminado do esquema padrão. O comando `DROP TRIGGER` requer o privilégio `TRIGGER` para a tabela associada ao gatilho.

Use `IF EXISTS` para evitar que um erro ocorra para um gatilho que não existe. Um `NOTA` é gerado para um gatilho inexistente ao usar `IF EXISTS`. Veja a Seção 15.7.7.43, “Declaração SHOW WARNINGS”.

Os gatilhos para uma tabela também serão eliminados se você eliminar a tabela.