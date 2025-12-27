### 11.1.5 Literais de Valor de Bit

Os literais de valor de bit são escritos usando a notação `b'val'` ou `0bval`. *`val`* é um valor binário escrito usando zeros e uns. A maiúscula ou minúscula do caractere inicial `b` não importa. Um `0b` inicial é sensível a maiúsculas e minúsculas e não pode ser escrito como `0B`.

Literais de valor de bit legais:

```
b'01'
B'01'
0b01
```

Literais de valor de bit ilegais:

```
b'2'    (2 is not a binary digit)
0B01    (0B must be written as 0b)
```

Por padrão, um literal de valor de bit é uma string binária:

```
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

Um literal de valor de bit pode ter um introduzir opcional de conjunto de caracteres e a cláusula `COLLATE`, para designá-lo como uma string que usa um conjunto de caracteres e uma ordenação particulares:

```
[_charset_name] b'val' [COLLATE collation_name]
```

Exemplos:

```
SELECT _latin1 b'1000001';
SELECT _utf8mb4 0b1000001 COLLATE utf8mb4_danish_ci;
```

Os exemplos usam a notação `b'val'`, mas a notação `0bval` também permite introdutores. Para informações sobre introdutores, consulte  Seção 12.3.8, “Introdutores de Conjunto de Caracteres”.

Em contextos numéricos, o MySQL trata um literal de bit como um inteiro. Para garantir o tratamento numérico de um literal de bit, use-o em um contexto numérico. As maneiras de fazer isso incluem adicionar 0 ou usar `CAST(... AS UNSIGNED)`. Por exemplo, um literal de bit atribuído a uma variável definida pelo usuário é uma string binária por padrão. Para atribuir o valor como um número, use-o em um contexto numérico:

```
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

Um valor de bit vazio (`b''`) avalia-se como uma string binária de comprimento zero. Convertido para um número, produz 0:

```
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

A notação de valor de bit é conveniente para especificar valores a serem atribuídos a colunas `BIT`:

```
mysql> CREATE TABLE t (b BIT(8));
mysql> INSERT INTO t SET b = b'11111111';
mysql> INSERT INTO t SET b = b'1010';
mysql> INSERT INTO t SET b = b'0101';
```

Os valores de bit nos conjuntos de resultados são retornados como valores binários, que podem não ser exibidos bem. Para converter um valor de bit para uma forma imprimível, use-o em um contexto numérico ou use uma função de conversão como `BIN()` ou `HEX()`. Os dígitos de ordem alta 0 não são exibidos no valor convertido.

```
mysql> SELECT b+0, BIN(b), OCT(b), HEX(b) FROM t;
+------+----------+--------+--------+
| b+0  | BIN(b)   | OCT(b) | HEX(b) |
+------+----------+--------+--------+
|  255 | 11111111 | 377    | FF     |
|   10 | 1010     | 12     | A      |
|    5 | 101      | 5      | 5      |
+------+----------+--------+--------+
```

Para literais de valor de bit, as operações de bit são consideradas em contexto numérico, mas as operações de bit permitem argumentos de string binária ou numérica no MySQL 8.4 e superior. Para especificar explicitamente o contexto de string binária para literais de valor de bit, use um introdutores `_binary` para pelo menos um dos argumentos:

O resultado exibido parece semelhante para ambas as operações de bits, mas o resultado sem `_binary` é um valor `BIGINT`, enquanto o resultado com `_binary` é uma string binária. Devido à diferença nos tipos de resultado, os valores exibidos diferem: os dígitos de ordem alta não são exibidos para o resultado numérico.