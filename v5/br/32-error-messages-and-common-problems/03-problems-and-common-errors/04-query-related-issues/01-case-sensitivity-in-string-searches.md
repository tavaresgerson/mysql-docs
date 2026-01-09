#### B.3.4.1 Sensibilidade à maiúscula e minúscula nas pesquisas de strings

Para cadeias não binárias ([`CHAR`](char.html), [`VARCHAR`](char.html), [`TEXT`](blob.html)), as pesquisas de strings usam a collation dos operadores de comparação. Para strings binárias ([`BINARY`](binary-varbinary.html), [`VARBINARY`](binary-varbinary.html), [`BLOB`](blob.html)), as comparações usam os valores numéricos dos bytes nos operadores; isso significa que, para caracteres alfabéticos, as comparações são sensíveis ao caso.

Uma comparação entre uma string não binária e uma string binária é tratada como uma comparação de strings binárias.

As operações de comparação simples (`>=, >, =, <, <=`, ordenação e agrupamento) são baseadas no "valor de ordenação" de cada caractere. Caracteres com o mesmo valor de ordenação são tratados como o mesmo caractere. Por exemplo, se `e` e `é` têm o mesmo valor de ordenação em uma determinada ordenação, eles são considerados iguais.

O conjunto de caracteres padrão e a ordenação são `latin1` e `latin1_swedish_ci`, portanto, as comparações de cadeias não binárias são case-insensitive por padrão. Isso significa que, se você pesquisar com `col_name LIKE 'a%'`, você obterá todos os valores da coluna que começam com `A` ou `a`. Para tornar essa pesquisa case-sensitive, certifique-se de que um dos operadores tenha uma ordenação case-sensitive ou binária. Por exemplo, se você estiver comparando uma coluna e uma string que têm o conjunto de caracteres `latin1`, você pode usar o operador `COLLATE` para fazer com que um dos operadores tenha a ordenação `latin1_general_cs` ou `latin1_bin`:

```sql
col_name COLLATE latin1_general_cs LIKE 'a%'
col_name LIKE 'a%' COLLATE latin1_general_cs
col_name COLLATE latin1_bin LIKE 'a%'
col_name LIKE 'a%' COLLATE latin1_bin
```

Se você deseja que uma coluna seja tratada de forma sensível a maiúsculas e minúsculas, declare-a com uma collation sensível a maiúsculas e minúsculas ou binária. Consulte [Seção 13.1.18, “Instrução CREATE TABLE”](create-table.html).

Para fazer uma comparação sensível ao caso das letras de cadeias não binárias ser insensível ao caso, use `COLLATE` para nomear uma ordenação insensível ao caso. As cadeias no exemplo a seguir são normalmente sensíveis ao caso, mas `COLLATE` altera a comparação para ser insensível ao caso:

```sql
mysql> SET @s1 = 'MySQL' COLLATE latin1_bin,
    ->     @s2 = 'mysql' COLLATE latin1_bin;
mysql> SELECT @s1 = @s2;
+-----------+
| @s1 = @s2 |
+-----------+
|         0 |
+-----------+
mysql> SELECT @s1 COLLATE latin1_swedish_ci = @s2;
+-------------------------------------+
| @s1 COLLATE latin1_swedish_ci = @s2 |
+-------------------------------------+
|                                   1 |
+-------------------------------------+
```

Uma string binária é sensível ao caso em comparações. Para comparar a string de forma sensível ao caso, converta-a em uma string não binária e use `COLLATE` para nomear uma ordenação sensível ao caso:

```sql
mysql> SET @s = BINARY 'MySQL';
mysql> SELECT @s = 'mysql';
+--------------+
| @s = 'mysql' |
+--------------+
|            0 |
+--------------+
mysql> SELECT CONVERT(@s USING latin1) COLLATE latin1_swedish_ci = 'mysql';
+--------------------------------------------------------------+
| CONVERT(@s USING latin1) COLLATE latin1_swedish_ci = 'mysql' |
+--------------------------------------------------------------+
|                                                            1 |
+--------------------------------------------------------------+
```

Para determinar se um valor é uma string não binária ou binária, use a função [`COLLATION()`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator#function_collation). Este exemplo mostra que a função [`VERSION()`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator#function_version) retorna uma string com uma collation sensível a maiúsculas e minúsculas, portanto, as comparações são sensíveis a maiúsculas e minúsculas:

```sql
mysql> SELECT COLLATION(VERSION());
+----------------------+
| COLLATION(VERSION()) |
+----------------------+
| utf8_general_ci      |
+----------------------+
```

Para strings binárias, o valor de ordenação é `binary`, portanto, as comparações são sensíveis ao caso. Um contexto em que você pode ver `binary` é para funções de compressão, que, como regra geral, retornam strings binárias:

```sql
mysql> SELECT COLLATION(COMPRESS('x'));
+--------------------------+
| COLLATION(COMPRESS('x')) |
+--------------------------+
| binary                   |
+--------------------------+
```

Para verificar o valor de classificação de uma string, a função [`WEIGHT_STRING()`](string-functions.html#function_weight-string) pode ser útil. Veja [Seção 12.8, “Funções e Operadores de String”](string-functions.html).
