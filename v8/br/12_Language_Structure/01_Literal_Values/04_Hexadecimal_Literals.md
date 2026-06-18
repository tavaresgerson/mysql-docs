### 11.1.4 Literais hexadecimais

Os valores lógicos hexadecimais são escritos usando a notação `X'val'` ou `0xval`, onde `val` contém dígitos hexadecimais (`0..9`, `A..F`). A maiúscula das letras dos dígitos e de qualquer `X` inicial não importa. Um `0x` inicial é sensível à maiúscula e não pode ser escrito como `0X`.

Literais hexadecimais legais:

```
X'01AF'
X'01af'
x'01AF'
x'01af'
0x01AF
0x01af
```

Literais hexadecimais ilegais:

```
X'0G'   (G is not a hexadecimal digit)
0X01AF  (0X must be written as 0x)
```

Os valores escritos usando a notação `X'val'` devem conter um número par de dígitos, caso contrário, ocorrerá um erro sintático. Para corrigir o problema, adicione um zero no início do valor:

```
mysql> SET @s = X'FFF';
ERROR 1064 (42000): You have an error in your SQL syntax;
check the manual that corresponds to your MySQL server
version for the right syntax to use near 'X'FFF''

mysql> SET @s = X'0FFF';
Query OK, 0 rows affected (0.00 sec)
```

Os valores escritos com a notação `0xval` que contêm um número ímpar de dígitos são tratados como tendo um `0` adicional no início. Por exemplo, `0xaaa` é interpretado como `0x0aaa`.

Por padrão, uma literal hexadecimal é uma string binária, onde cada par de dígitos hexadecimais representa um caractere:

```
mysql> SELECT X'4D7953514C', CHARSET(X'4D7953514C');
+---------------+------------------------+
| X'4D7953514C' | CHARSET(X'4D7953514C') |
+---------------+------------------------+
| MySQL         | binary                 |
+---------------+------------------------+
mysql> SELECT 0x5461626c65, CHARSET(0x5461626c65);
+--------------+-----------------------+
| 0x5461626c65 | CHARSET(0x5461626c65) |
+--------------+-----------------------+
| Table        | binary                |
+--------------+-----------------------+
```

Um literal hexadecimal pode ter um introduzir de conjunto de caracteres opcional e a cláusula `COLLATE` para designá-lo como uma string que usa um conjunto de caracteres e uma ordenação específicos:

```
[_charset_name] X'val' [COLLATE collation_name]
```

Exemplos:

```
SELECT _latin1 X'4D7953514C';
SELECT _utf8mb4 0x4D7953514C COLLATE utf8mb4_danish_ci;
```

Os exemplos usam a notação `X'val'`, mas a notação `0xval` também permite introdutores. Para informações sobre introdutores, consulte a Seção 12.3.8, “Introdutores de Conjunto de Caracteres”.

Em contextos numéricos, o MySQL trata uma literal hexadecimal como um `BIGINT UNSIGNED` (inteiro sem sinal de 64 bits). Para garantir o tratamento numérico de uma literal hexadecimal, use-a em um contexto numérico. Existem várias maneiras de fazer isso, incluindo adicionar 0 ou usar `CAST(... AS UNSIGNED)`. Por exemplo, uma literal hexadecimal atribuída a uma variável definida pelo usuário é uma string binária por padrão. Para atribuir o valor como um número, use-a em um contexto numérico:

```
mysql> SET @v1 = X'41';
mysql> SET @v2 = X'41'+0;
mysql> SET @v3 = CAST(X'41' AS UNSIGNED);
mysql> SELECT @v1, @v2, @v3;
+------+------+------+
| @v1  | @v2  | @v3  |
+------+------+------+
| A    |   65 |   65 |
+------+------+------+
```

Um valor hexadecimal vazio (`X''`) é avaliado como uma string binária de comprimento zero. Convertido em número, ele produz 0:

```
mysql> SELECT CHARSET(X''), LENGTH(X'');
+--------------+-------------+
| CHARSET(X'') | LENGTH(X'') |
+--------------+-------------+
| binary       |           0 |
+--------------+-------------+
mysql> SELECT X''+0;
+-------+
| X''+0 |
+-------+
|     0 |
+-------+
```

A notação `X'val'` é baseada no SQL padrão. A notação `0x` é baseada no ODBC, para o qual cadeias hexadecimais são frequentemente usadas para fornecer valores para as colunas `BLOB`.

Para converter uma string ou um número para uma string no formato hexadecimal, use a função `HEX()`:

```
mysql> SELECT HEX('cat');
+------------+
| HEX('cat') |
+------------+
| 636174     |
+------------+
mysql> SELECT X'636174';
+-----------+
| X'636174' |
+-----------+
| cat       |
+-----------+
```

Para literais hexadecimais, as operações de bits são consideradas contexto numérico, mas as operações de bits permitem argumentos de string numérica ou binária no MySQL 8.0 e versões posteriores. Para especificar explicitamente o contexto de string binária para literais hexadecimais, use um `_binary` para pelo menos um dos argumentos:

```
mysql> SET @v1 = X'000D' | X'0BC0';
mysql> SET @v2 = _binary X'000D' | X'0BC0';
mysql> SELECT HEX(@v1), HEX(@v2);
+----------+----------+
| HEX(@v1) | HEX(@v2) |
+----------+----------+
| BCD      | 0BCD     |
+----------+----------+
```

O resultado exibido parece semelhante para ambas as operações de bits, mas o resultado sem `_binary` é um valor `BIGINT`, enquanto o resultado com `_binary` é uma string binária. Devido à diferença nos tipos de resultados, os valores exibidos diferem: os dígitos de ordem superior 0 não são exibidos para o resultado numérico.
