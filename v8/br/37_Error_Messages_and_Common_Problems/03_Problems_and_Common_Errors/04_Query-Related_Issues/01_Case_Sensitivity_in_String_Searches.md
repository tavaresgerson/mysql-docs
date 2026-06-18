#### B.3.4.1 Sensibilidade à maiúscula e minúscula nas pesquisas de strings

Para cadeias não binárias (`CHAR`, `VARCHAR`, `TEXT`), as pesquisas de cadeia usam a collation dos operadores de comparação. Para cadeias binárias (`BINARY`, `VARBINARY`, `BLOB`), as comparações usam os valores numéricos dos bytes nos operadores; isso significa que, para caracteres alfabéticos, as comparações são sensíveis ao caso.

Uma comparação entre uma string não binária e uma string binária é tratada como uma comparação de strings binárias.

As operações de comparação simples (`>=, >, =, <, <=`, ordenação e agrupamento) são baseadas no "valor de ordenação" de cada caractere. Caracteres com o mesmo valor de ordenação são tratados como o mesmo caractere. Por exemplo, se `e` e `é` tiverem o mesmo valor de ordenação em uma determinada ordem de classificação, eles são considerados iguais.

O conjunto de caracteres padrão e a ordenação são `utf8mb4` e `utf8mb4_0900_ai_ci`, portanto, as comparações de cadeias não binárias são case-insensitive por padrão. Isso significa que, se você pesquisar com `col_name LIKE 'a%'`, você obterá todos os valores da coluna que começam com `A` ou `a`. Para tornar essa pesquisa case-sensitive, certifique-se de que um dos operadores tenha uma ordenação case-sensitive ou binária. Por exemplo, se você estiver comparando uma coluna e uma string que têm o conjunto de caracteres `utf8mb4`, você pode usar o operador `COLLATE` para fazer com que um dos operadores tenha a ordenação `utf8mb4_0900_as_cs` ou `utf8mb4_bin`:

```
col_name COLLATE utf8mb4_0900_as_cs LIKE 'a%'
col_name LIKE 'a%' COLLATE utf8mb4_0900_as_cs
col_name COLLATE utf8mb4_bin LIKE 'a%'
col_name LIKE 'a%' COLLATE utf8mb4_bin
```

Se você quiser que uma coluna seja tratada de forma sensível a maiúsculas e minúsculas, declare-a com uma collation sensível a maiúsculas e minúsculas ou binária. Veja a Seção 15.1.20, “Instrução CREATE TABLE”.

Para fazer uma comparação sensível ao caso das letras de cadeias não binárias ser insensível ao caso, use `COLLATE` para nomear uma ordenação insensível ao caso. As cadeias no exemplo a seguir são normalmente sensíveis ao caso, mas `COLLATE` altera a comparação para ser insensível ao caso:

```
mysql> SET NAMES 'utf8mb4';
mysql> SET @s1 = 'MySQL' COLLATE utf8mb4_bin,
           @s2 = 'mysql' COLLATE utf8mb4_bin;
mysql> SELECT @s1 = @s2;
+-----------+
| @s1 = @s2 |
+-----------+
|         0 |
+-----------+
mysql> SELECT @s1 COLLATE utf8mb4_0900_ai_ci = @s2;
+--------------------------------------+
| @s1 COLLATE utf8mb4_0900_ai_ci = @s2 |
+--------------------------------------+
|                                    1 |
+--------------------------------------+
```

Uma string binária é sensível ao caso em comparações. Para comparar a string de forma sensível ao caso, converta-a em uma string não binária e use `COLLATE` para nomear uma ordenação sensível ao caso:

```
mysql> SET @s = BINARY 'MySQL';
mysql> SELECT @s = 'mysql';
+--------------+
| @s = 'mysql' |
+--------------+
|            0 |
+--------------+
mysql> SELECT CONVERT(@s USING utf8mb4) COLLATE utf8mb4_0900_ai_ci = 'mysql';
+----------------------------------------------------------------+
| CONVERT(@s USING utf8mb4) COLLATE utf8mb4_0900_ai_ci = 'mysql' |
+----------------------------------------------------------------+
|                                                              1 |
+----------------------------------------------------------------+
```

Para determinar se um valor é comparado como uma string não binária ou binária, use a função `COLLATION()`. Este exemplo mostra que `VERSION()` retorna uma string que tem uma ordenação não sensível ao caso, então as comparações são não sensíveis ao caso:

```
mysql> SELECT COLLATION(VERSION());
+----------------------+
| COLLATION(VERSION()) |
+----------------------+
| utf8mb3_general_ci   |
+----------------------+
```

Para strings binárias, o valor da ordenação é `binary`, portanto, as comparações são sensíveis ao caso. Um contexto em que você pode esperar ver `binary` são as funções de compressão, que, como regra geral, retornam strings binárias: string:

```
mysql> SELECT COLLATION(COMPRESS('x'));
+--------------------------+
| COLLATION(COMPRESS('x')) |
+--------------------------+
| binary                   |
+--------------------------+
```

Para verificar o valor de classificação de uma string, o `WEIGHT_STRING()` pode ser útil. Veja a Seção 14.8, “Funções e Operadores de Strings”.
