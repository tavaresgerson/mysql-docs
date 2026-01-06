### 10.3.7 O Conjunto Nacional de Caracteres

O SQL padrão define `NCHAR` ou `NATIONAL CHAR` como uma maneira de indicar que uma coluna `CHAR` deve usar algum conjunto de caracteres pré-definido. O MySQL usa `utf8` como este conjunto de caracteres pré-definido. Por exemplo, essas declarações de tipo de dados são equivalentes:

```sql
CHAR(10) CHARACTER SET utf8
NATIONAL CHARACTER(10)
NCHAR(10)
```

Esses são alguns exemplos:

```sql
VARCHAR(10) CHARACTER SET utf8
NATIONAL VARCHAR(10)
NVARCHAR(10)
NCHAR VARCHAR(10)
NATIONAL CHARACTER VARYING(10)
NATIONAL CHAR VARYING(10)
```

Você pode usar `N'literal'` (ou `n'literal'`) para criar uma string no conjunto de caracteres nacional. Essas declarações são equivalentes:

```sql
SELECT N'some text';
SELECT n'some text';
SELECT _utf8'some text';
```
