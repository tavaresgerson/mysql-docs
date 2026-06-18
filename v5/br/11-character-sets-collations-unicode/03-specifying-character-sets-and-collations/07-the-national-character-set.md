### 10.3.7 O Conjunto de Caracteres Nacional

O SQL Padrão define `NCHAR` ou `NATIONAL CHAR` como uma forma de indicar que uma coluna `CHAR` deve usar um `character set` predefinido. O MySQL usa `utf8` como esse `character set` predefinido. Por exemplo, estas declarações de tipo de dados são equivalentes:

```sql
CHAR(10) CHARACTER SET utf8
NATIONAL CHARACTER(10)
NCHAR(10)
```

E estas também são equivalentes:

```sql
VARCHAR(10) CHARACTER SET utf8
NATIONAL VARCHAR(10)
NVARCHAR(10)
NCHAR VARCHAR(10)
NATIONAL CHARACTER VARYING(10)
NATIONAL CHAR VARYING(10)
```

Você pode usar `N'literal'` (ou `n'literal'`) para criar uma `string` no `national character set`. Estas declarações são equivalentes:

```sql
SELECT N'some text';
SELECT n'some text';
SELECT _utf8'some text';
```