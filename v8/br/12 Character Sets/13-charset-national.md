### 12.3.7 O Conjunto de Caracteres Nacional

O SQL Padrão define `NCHAR` ou `NATIONAL CHAR` como uma maneira de indicar que uma coluna `CHAR` deve usar algum conjunto de caracteres pré-definido. O MySQL usa `utf8` como este conjunto de caracteres pré-definido. Por exemplo, estas declarações de tipo de dados são equivalentes:

```
CHAR(10) CHARACTER SET utf8
NATIONAL CHARACTER(10)
NCHAR(10)
```

E estas:

```
VARCHAR(10) CHARACTER SET utf8
NATIONAL VARCHAR(10)
NVARCHAR(10)
NCHAR VARCHAR(10)
NATIONAL CHARACTER VARYING(10)
NATIONAL CHAR VARYING(10)
```

Você pode usar `N'literal'` (ou `n'literal'`) para criar uma string no conjunto de caracteres nacional. Estas declarações são equivalentes:

```
SELECT N'some text';
SELECT n'some text';
SELECT _utf8'some text';
```

O MySQL 8.4 interpreta o conjunto de caracteres nacional como `utf8mb3`, que agora está desatualizado. Assim, usar `CHARACTER NACIONAIS` ou um de seus sinônimos para definir o conjunto de caracteres para um banco de dados, tabela ou coluna gera uma mensagem de aviso semelhante a esta:

```
NATIONAL/NCHAR/NVARCHAR implies the character set UTF8MB3, which will be
replaced by UTF8MB4 in a future release. Please consider using CHAR(x) CHARACTER
SET UTF8MB4 in order to be unambiguous.
```