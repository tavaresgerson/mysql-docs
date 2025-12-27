#### B.3.4.1 Sensibilidade à Letra na Busca de Cadeias

Para cadeias não binárias ( `CHAR`, `VARCHAR`, `TEXT`), as buscas de cadeia usam a collation da operação de comparação. Para cadeias binárias ( `BINARY`, `VARBINARY`, `BLOB`), as comparações usam os valores numéricos dos bytes nas operações; isso significa que, para caracteres alfabéticos, as comparações são sensíveis ao caso.

Uma comparação entre uma cadeia não binária e uma cadeia binária é tratada como uma comparação de cadeias binárias.

As operações de comparação simples (`>=, >, =, <, <=`, ordenação e agrupamento) são baseadas no "valor de ordenação" de cada caractere. Caracteres com o mesmo valor de ordenação são tratados como o mesmo caractere. Por exemplo, se `e` e `é` têm o mesmo valor de ordenação em uma collation dada, eles são comparados como iguais.

O conjunto de caracteres padrão e a collation são `utf8mb4` e `utf8mb4_0900_ai_ci`, então as comparações de cadeias não binárias são sensíveis ao caso por padrão. Isso significa que, se você pesquisar com `col_name LIKE 'a%'`, você obtém todos os valores da coluna que começam com `A` ou `a`. Para tornar essa pesquisa sensível ao caso, certifique-se de que uma das operações tem uma collation sensível ao caso ou binária. Por exemplo, se você está comparando uma coluna e uma cadeia que têm o conjunto de caracteres `utf8mb4`, você pode usar o operador `COLLATE` para fazer uma das operações ter a collation `utf8mb4_0900_as_cs` ou `utf8mb4_bin`:

```
col_name COLLATE utf8mb4_0900_as_cs LIKE 'a%'
col_name LIKE 'a%' COLLATE utf8mb4_0900_as_cs
col_name COLLATE utf8mb4_bin LIKE 'a%'
col_name LIKE 'a%' COLLATE utf8mb4_bin
```

Se você quiser que uma coluna seja sempre tratada de forma sensível ao caso, declare-a com uma collation sensível ao caso ou binária. Veja  Seção 15.1.20, “Instrução CREATE TABLE”.

Para fazer uma comparação sensível ao caso de cadeias não binárias ser sensível ao caso, use `COLLATE` para nomear uma collation sensível ao caso. As cadeias no exemplo a seguir são normalmente sensíveis ao caso, mas `COLLATE` muda a comparação para ser sensível ao caso:

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

Uma cadeia binária é sensível ao caso nas comparações. Para comparar a cadeia de forma sensível ao caso, converta-a em uma cadeia não binária e use `COLLATE` para nomear uma collation sensível ao caso:

Para determinar se um valor é comparado como uma string não binária ou binária, use a função  `COLLATION()`. Este exemplo mostra que  `VERSION()` retorna uma string que tem uma collation sensível a maiúsculas e minúsculas, então as comparações são sensíveis a maiúsculas e minúsculas:

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

Para strings binárias, o valor da collation é `binary`, então as comparações são sensíveis a maiúsculas e minúsculas. Um contexto em que você pode esperar ver `binary` é para funções de compressão, que retornam strings binárias como regra geral: string:

```
mysql> SELECT COLLATION(VERSION());
+----------------------+
| COLLATION(VERSION()) |
+----------------------+
| utf8mb3_general_ci   |
+----------------------+
```

Para verificar o valor de ordenação de uma string, a função  `WEIGHT_STRING()` pode ser útil. Veja a Seção 14.8, “Funções e Operadores de String”.