#### B.3.4.1 Sensibilidade a Maiúsculas e Minúsculas em Buscas de Strings

Para strings não-binárias ([`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types")), as buscas de strings usam o Collation dos operandos de comparação. Para strings binárias ([`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types")), as comparações usam os valores numéricos dos bytes nos operandos; isso significa que, para caracteres alfabéticos, as comparações são *case-sensitive* (sensíveis a maiúsculas e minúsculas).

Uma comparação entre uma string não-binária e uma string binária é tratada como uma comparação de strings binárias.

Operações de comparação simples (`>=, >, =, <, <=`, *sorting* e *grouping*) são baseadas no “valor de ordenação” (*sort value*) de cada caractere. Caracteres com o mesmo *sort value* são tratados como o mesmo caractere. Por exemplo, se `e` e `é` tiverem o mesmo *sort value* em um determinado Collation, eles se comparam como iguais.

O conjunto de caracteres e o Collation padrão são `latin1` e `latin1_swedish_ci`, então as comparações de strings não-binárias são *case-insensitive* (não-sensíveis a maiúsculas e minúsculas) por padrão. Isso significa que, se você buscar com `col_name LIKE 'a%'`, você obterá todos os valores da coluna que começam com `A` ou `a`. Para tornar essa busca *case-sensitive*, certifique-se de que um dos operandos tenha um Collation *case-sensitive* ou binário. Por exemplo, se você estiver comparando uma coluna e uma string que ambas têm o conjunto de caracteres `latin1`, você pode usar o operador `COLLATE` para fazer com que qualquer um dos operandos tenha o Collation `latin1_general_cs` ou `latin1_bin`:

```sql
col_name COLLATE latin1_general_cs LIKE 'a%'
col_name LIKE 'a%' COLLATE latin1_general_cs
col_name COLLATE latin1_bin LIKE 'a%'
col_name LIKE 'a%' COLLATE latin1_bin
```

Se você deseja que uma coluna seja sempre tratada de forma *case-sensitive*, declare-a com um Collation *case-sensitive* ou binário. Consulte [Section 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement").

Para fazer com que uma comparação *case-sensitive* de strings não-binárias se torne *case-insensitive*, use `COLLATE` para nomear um Collation *case-insensitive*. As strings no exemplo a seguir são normalmente *case-sensitive*, mas `COLLATE` altera a comparação para ser *case-insensitive*:

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

Uma string binária é *case-sensitive* em comparações. Para comparar a string como *case-insensitive*, converta-a para uma string não-binária e use `COLLATE` para nomear um Collation *case-insensitive*:

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

Para determinar se um valor é comparado como uma string não-binária ou binária, use a função [`COLLATION()`](information-functions.html#function_collation). Este exemplo mostra que [`VERSION()`](information-functions.html#function_version) retorna uma string que tem um Collation *case-insensitive*, então as comparações são *case-insensitive*:

```sql
mysql> SELECT COLLATION(VERSION());
+----------------------+
| COLLATION(VERSION()) |
+----------------------+
| utf8_general_ci      |
+----------------------+
```

Para strings binárias, o valor do Collation é `binary`, então as comparações são *case-sensitive*. Um contexto no qual você pode ver `binary` é para funções de compressão, que retornam strings binárias como regra geral:

```sql
mysql> SELECT COLLATION(COMPRESS('x'));
+--------------------------+
| COLLATION(COMPRESS('x')) |
+--------------------------+
| binary                   |
+--------------------------+
```

Para verificar o *sort value* de uma string, a função [`WEIGHT_STRING()`](string-functions.html#function_weight-string) pode ser útil. Consulte [Section 12.8, “String Functions and Operators”](string-functions.html "12.8 String Functions and Operators").