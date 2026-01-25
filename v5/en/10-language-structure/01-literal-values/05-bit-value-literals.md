### 9.1.5 Literais de Valor Bit

Literais de valor bit são escritos usando a notação `b'val'` ou `0bval`. *`val`* é um valor binário escrito usando zeros e uns. O uso de maiúsculas/minúsculas para qualquer `b` inicial não importa. Um `0b` inicial diferencia maiúsculas de minúsculas e não pode ser escrito como `0B`.

Literais de valor bit válidos:

```sql
b'01'
B'01'
0b01
```

Literais de valor bit inválidos:

```sql
b'2'    (2 is not a binary digit)
0B01    (0B must be written as 0b)
```

Por padrão, um literal de valor bit é uma *string* binária:

```sql
mysql> SELECT b'1000001', CHARSET(b'1000001');
+------------+---------------------+
| b'1000001' | CHARSET(b'1000001') |
+------------+---------------------+
| A          | binary              |
+------------+---------------------+
mysql> SELECT 0b1100001, CHARSET(0b1100001);
+-----------+--------------------+
| 0b1100001 | CHARSET(0b1100001) |
+-----------+--------------------+
| a         | binary             |
+-----------+--------------------+
```

Um literal de valor bit pode ter um *introducer* de *character set* opcional e uma cláusula `COLLATE`, para designá-lo como uma *string* que utiliza um *character set* e uma *collation* específicos:

```sql
[_charset_name] b'val' [COLLATE collation_name]
```

Exemplos:

```sql
SELECT _latin1 b'1000001';
SELECT _utf8 0b1000001 COLLATE utf8_danish_ci;
```

Os exemplos usam a notação `b'val'`, mas a notação `0bval` também permite *introducers*. Para obter informações sobre *introducers*, consulte a Seção 10.3.8, “Character Set Introducers”.

Em contextos numéricos, o MySQL trata um literal bit como um inteiro. Para garantir o tratamento numérico de um literal bit, use-o em um contexto numérico. Maneiras de fazer isso incluem adicionar 0 ou usar `CAST(... AS UNSIGNED)`. Por exemplo, um literal bit atribuído a uma variável definida pelo usuário é uma *string* binária por padrão. Para atribuir o valor como um número, use-o em um contexto numérico:

```sql
mysql> SET @v1 = b'1100001';
mysql> SET @v2 = b'1100001'+0;
mysql> SET @v3 = CAST(b'1100001' AS UNSIGNED);
mysql> SELECT @v1, @v2, @v3;
+------+------+------+
| @v1  | @v2  | @v3  |
+------+------+------+
| a    |   97 |   97 |
+------+------+------+
```

Um valor bit vazio (`b''`) é avaliado como uma *string* binária de comprimento zero. Convertido para um número, ele produz 0:

```sql
mysql> SELECT CHARSET(b''), LENGTH(b'');
+--------------+-------------+
| CHARSET(b'') | LENGTH(b'') |
+--------------+-------------+
| binary       |           0 |
+--------------+-------------+
mysql> SELECT b''+0;
+-------+
| b''+0 |
+-------+
|     0 |
+-------+
```

A notação de valor bit é conveniente para especificar valores a serem atribuídos a colunas `BIT`:

```sql
mysql> CREATE TABLE t (b BIT(8));
mysql> INSERT INTO t SET b = b'11111111';
mysql> INSERT INTO t SET b = b'1010';
mysql> INSERT INTO t SET b = b'0101';
```

Valores bit em *result sets* são retornados como valores binários, que podem não ser exibidos corretamente. Para converter um valor bit para um formato que possa ser impresso, use-o em um contexto numérico ou use uma função de conversão como `BIN()` ou `HEX()`. Os dígitos 0 de ordem superior não são exibidos no valor convertido.

```sql
mysql> SELECT b+0, BIN(b), OCT(b), HEX(b) FROM t;
+------+----------+--------+--------+
| b+0  | BIN(b)   | OCT(b) | HEX(b) |
+------+----------+--------+--------+
|  255 | 11111111 | 377    | FF     |
|   10 | 1010     | 12     | A      |
|    5 | 101      | 5      | 5      |
+------+----------+--------+--------+
```