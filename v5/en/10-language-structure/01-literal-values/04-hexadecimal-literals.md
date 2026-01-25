### 9.1.4 Literais Hexadecimais

Valores de literais hexadecimais são escritos usando a notação `X'val'` ou `0xval`, onde *`val`* contém dígitos hexadecimais (`0..9`, `A..F`). A caixa das letras dos dígitos e de qualquer `X` inicial não importa. Um `0x` inicial diferencia maiúsculas de minúsculas (case-sensitive) e não pode ser escrito como `0X`.

Literais hexadecimais válidos:

```sql
X'01AF'
X'01af'
x'01AF'
x'01af'
0x01AF
0x01af
```

Literais hexadecimais inválidos:

```sql
X'0G'   (G is not a hexadecimal digit)
0X01AF  (0X must be written as 0x)
```

Valores escritos usando a notação `X'val'` devem conter um número par de dígitos, caso contrário, ocorre um erro de sintaxe. Para corrigir o problema, preencha o valor com um zero à esquerda:

```sql
mysql> SET @s = X'FFF';
ERROR 1064 (42000): You have an error in your SQL syntax;
check the manual that corresponds to your MySQL server
version for the right syntax to use near 'X'FFF''

mysql> SET @s = X'0FFF';
Query OK, 0 rows affected (0.00 sec)
```

Valores escritos usando a notação `0xval` que contenham um número ímpar de dígitos são tratados como se tivessem um `0` extra à esquerda. Por exemplo, `0xaaa` é interpretado como `0x0aaa`.

Por padrão, um literal hexadecimal é uma binary string, onde cada par de dígitos hexadecimais representa um caractere:

```sql
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

Um literal hexadecimal pode ter um character set introducer opcional e uma cláusula `COLLATE`, para designá-lo como uma string que utiliza um conjunto de caracteres e collation específicos:

```sql
[_charset_name] X'val' [COLLATE collation_name]
```

Exemplos:

```sql
SELECT _latin1 X'4D7953514C';
SELECT _utf8 0x4D7953514C COLLATE utf8_danish_ci;
```

Os exemplos usam a notação `X'val'`, mas a notação `0xval` também permite introducers. Para obter informações sobre introducers, consulte a Seção 10.3.8, “Character Set Introducers”.

Em contextos numéricos, o MySQL trata um literal hexadecimal como um `BIGINT UNSIGNED` (inteiro não assinado de 64 bits). Para garantir o tratamento numérico de um literal hexadecimal, use-o em um contexto numérico. Maneiras de fazer isso incluem adicionar 0 ou usar `CAST(... AS UNSIGNED)`. Por exemplo, um literal hexadecimal atribuído a uma variável definida pelo usuário é uma binary string por padrão. Para atribuir o valor como um número, use-o em um contexto numérico:

```sql
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

Um valor hexadecimal vazio (`X''`) é avaliado como uma binary string de comprimento zero. Convertido para um número, ele produz 0:

```sql
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

A notação `X'val'` é baseada no SQL padrão. A notação `0x` é baseada no ODBC, para o qual strings hexadecimais são frequentemente usadas para fornecer valores para colunas `BLOB`.

Para converter uma string ou um número para uma string em formato hexadecimal, use a função `HEX()`:

```sql
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