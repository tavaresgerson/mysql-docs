### 10.3.7 O Conjunto de Caracteres Nacional

O SQL Padrão define `NCHAR` ou `NATIONAL CHAR` como uma forma de indicar que uma coluna `CHAR` deve usar algum conjunto de caracteres predefinido. O MySQL usa `utf8` como esse conjunto de caracteres predefinido. Por exemplo, estas declarações de tipo de dado são equivalentes:

```sql
CHAR(10) CHARACTER SET utf8
NATIONAL CHARACTER(10)
NCHAR(10)
```

Assim como estas:

```sql
VARCHAR(10) CHARACTER SET utf8
NATIONAL VARCHAR(10)
NVARCHAR(10)
NCHAR VARCHAR(10)
NATIONAL CHARACTER VARYING(10)
NATIONAL CHAR VARYING(10)
```

Você pode usar `N'literal'` (ou `n'literal'`) para criar uma string no conjunto de caracteres nacional. Estas instruções são equivalentes:

```sql
SELECT N'some text';
SELECT n'some text';
SELECT _utf8'some text';
```