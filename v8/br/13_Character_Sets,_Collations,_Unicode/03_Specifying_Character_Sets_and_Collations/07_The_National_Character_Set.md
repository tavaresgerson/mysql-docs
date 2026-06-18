### 12.3.7 O Conjunto Nacional de Caracteres

O SQL padrão define `NCHAR` ou `NATIONAL CHAR` como uma maneira de indicar que uma coluna `CHAR` deve usar algum conjunto de caracteres pré-definido. O MySQL usa `utf8` como esse conjunto de caracteres pré-definido. Por exemplo, essas declarações de tipo de dados são equivalentes:

```
CHAR(10) CHARACTER SET utf8
NATIONAL CHARACTER(10)
NCHAR(10)
```

Esses são alguns exemplos:

```
VARCHAR(10) CHARACTER SET utf8
NATIONAL VARCHAR(10)
NVARCHAR(10)
NCHAR VARCHAR(10)
NATIONAL CHARACTER VARYING(10)
NATIONAL CHAR VARYING(10)
```

Você pode usar `N'literal'` (ou `n'literal'`) para criar uma string no conjunto de caracteres nacional. Essas declarações são equivalentes:

```
SELECT N'some text';
SELECT n'some text';
SELECT _utf8'some text';
```

O MySQL 8.0 interpreta o conjunto de caracteres nacional como `utf8mb3`, que agora está desatualizado. Portanto, usar `NATIONAL CHARACTER` ou um de seus sinônimos para definir o conjunto de caracteres para um banco de dados, tabela ou coluna gera uma mensagem de aviso semelhante a esta:

```
NATIONAL/NCHAR/NVARCHAR implies the character set UTF8MB3, which will be
replaced by UTF8MB4 in a future release. Please consider using CHAR(x) CHARACTER
SET UTF8MB4 in order to be unambiguous.
```
