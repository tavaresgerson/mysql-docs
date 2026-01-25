## 12.10 Funções e Operadores de Cast

**Tabela 12.15 Funções e Operadores de Cast**

<table frame="box" rules="all" summary="Uma referência que lista funções e operadores de cast."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>BINARY</code></td> <td> Converte uma string para uma string binária </td> </tr><tr><td><code>CAST()</code></td> <td> Converte um valor para um tipo específico </td> </tr><tr><td><code>CONVERT()</code></td> <td> Converte um valor para um tipo específico </td> </tr></tbody></table>

Funções e operadores de Cast permitem a conversão de valores de um tipo de dado para outro.

* Descrições de Funções e Operadores de Cast
* Conversões de Character Set
* Conversões de Character Set para Comparações de String
* Outros Usos para Operações de Cast

### Descrições de Funções e Operadores de Cast

* `BINARY` *`expr`*

  O operador `BINARY` converte a expression para uma binary string (uma string que possui o character set `binary` e a collation `binary`). Um uso comum para `BINARY` é forçar uma comparação de string de caracteres a ser feita byte a byte usando valores de byte numéricos em vez de caractere a caractere. O operador `BINARY` também faz com que espaços finais em comparações sejam significativos. Para informações sobre as diferenças entre a collation `binary` do character set `binary` e as collations `_bin` de character sets não binários, consulte a Seção 10.8.5, “A Collation binary Comparada às Collations _bin”.

  ```sql
  mysql> SELECT 'a' = 'A';
          -> 1
  mysql> SELECT BINARY 'a' = 'A';
          -> 0
  mysql> SELECT 'a' = 'a ';
          -> 1
  mysql> SELECT BINARY 'a' = 'a ';
          -> 0
  ```

  Em uma comparação, `BINARY` afeta toda a operação; ele pode ser fornecido antes de qualquer operando com o mesmo resultado.

  Para converter uma string expression para uma binary string, estas construções são equivalentes:

  ```sql
  CONVERT(expr USING BINARY)
  CAST(expr AS BINARY)
  BINARY expr
  ```

  Se um valor for um literal de string, ele pode ser designado como uma binary string sem convertê-lo, usando o introducer de character set `_binary`:

  ```sql
  mysql> SELECT 'a' = 'A';
          -> 1
  mysql> SELECT _binary 'a' = 'A';
          -> 0
  ```

  Para informações sobre introducers, consulte a Seção 10.3.8, “Character Set Introducers”.

  O operador `BINARY` em expressions difere no efeito do atributo `BINARY` em definições de coluna de caracteres. Para uma coluna de caracteres definida com o atributo `BINARY`, o MySQL atribui o character set padrão da tabela e a collation binária (`_bin`) desse character set. Cada character set não binário possui uma collation `_bin`. Por exemplo, se o character set padrão da tabela for `utf8`, estas duas definições de coluna são equivalentes:

  ```sql
  CHAR(10) BINARY
  CHAR(10) CHARACTER SET utf8 COLLATE utf8_bin
  ```

  O uso de `CHARACTER SET binary` na definição de uma coluna `CHAR`, `VARCHAR` ou `TEXT` faz com que a coluna seja tratada como o tipo de dado binary string correspondente. Por exemplo, os seguintes pares de definições são equivalentes:

  ```sql
  CHAR(10) CHARACTER SET binary
  BINARY(10)

  VARCHAR(10) CHARACTER SET binary
  VARBINARY(10)

  TEXT CHARACTER SET binary
  BLOB
  ```

  Se `BINARY` for invocado de dentro do cliente **mysql**, as binary strings são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O Cliente de Linha de Comando MySQL”.

* `CAST(expr AS type)`

  `CAST(expr AS type` recebe uma expression de qualquer tipo e produz um valor resultante do tipo especificado. Esta operação também pode ser expressa como `CONVERT(expr, type)`, que é equivalente.

  Estes valores de *`type`* são permitidos:

  + `BINARY[(N)]`

    Produz uma string com o tipo de dado `VARBINARY`, exceto que quando a expression *`expr`* está vazia (comprimento zero), o tipo resultante é `BINARY(0)`. Se o comprimento opcional *`N`* for fornecido, `BINARY(N)` faz com que o cast utilize no máximo *`N`* bytes do argumento. Valores menores que *`N`* bytes são preenchidos com bytes `0x00` até um comprimento de *`N`*. Se o comprimento opcional *`N`* não for fornecido, o MySQL calcula o comprimento máximo a partir da expression. Se o comprimento fornecido ou calculado for maior do que um limite interno, o tipo resultante é `BLOB`. Se o comprimento ainda for muito longo, o tipo resultante é `LONGBLOB`.

    Para uma descrição de como o cast para `BINARY` afeta comparações, consulte a Seção 11.3.3, “Os Tipos BINARY e VARBINARY”.

  + `CHAR[(N)] [charset_info]`

    Produz uma string com o tipo de dado `VARCHAR`, a menos que a expression *`expr`* esteja vazia (comprimento zero), caso em que o tipo resultante é `CHAR(0)`. Se o comprimento opcional *`N`* for fornecido, `CHAR(N)` faz com que o cast utilize no máximo *`N`* caracteres do argumento. Nenhum preenchimento ocorre para valores menores que *`N`* caracteres. Se o comprimento opcional *`N`* não for fornecido, o MySQL calcula o comprimento máximo a partir da expression. Se o comprimento fornecido ou calculado for maior do que um limite interno, o tipo resultante é `TEXT`. Se o comprimento ainda for muito longo, o tipo resultante é `LONGTEXT`.

    Sem uma cláusula *`charset_info`*, `CHAR` produz uma string com o character set padrão. Para especificar o character set explicitamente, estes valores de *`charset_info`* são permitidos:

    - `CHARACTER SET charset_name`: Produz uma string com o character set fornecido.

    - `ASCII`: Abreviação para `CHARACTER SET latin1`.

    - `UNICODE`: Abreviação para `CHARACTER SET ucs2`.

    Em todos os casos, a string tem a collation padrão do character set.

  + `DATE`

    Produz um valor `DATE`.

  + `DATETIME[(M)]`

    Produz um valor `DATETIME`. Se o valor opcional *`M`* for fornecido, ele especifica a precisão de segundos fracionários.

  + `DECIMAL[(M[,D])]`

    Produz um valor `DECIMAL`. Se os valores opcionais *`M`* e *`D`* forem fornecidos, eles especificam o número máximo de dígitos (a precisão) e o número de dígitos após o ponto decimal (a escala). Se *`D`* for omitido, 0 é assumido. Se *`M`* for omitido, 10 é assumido.

  + `JSON`

    Produz um valor `JSON`. Para detalhes sobre as regras de conversão de valores entre `JSON` e outros tipos, consulte Comparação e Ordenação de Valores JSON.

  + `NCHAR[(N)]`

    Semelhante a `CHAR`, mas produz uma string com o national character set. Consulte a Seção 10.3.7, “O National Character Set”.

    Diferentemente de `CHAR`, `NCHAR` não permite que informações de character set subsequentes sejam especificadas.

  + `SIGNED [INTEGER]`

    Produz um valor `BIGINT` assinado.

  + `TIME[(M)]`

    Produz um valor `TIME`. Se o valor opcional *`M`* for fornecido, ele especifica a precisão de segundos fracionários.

  + `UNSIGNED [INTEGER]`

    Produz um valor `BIGINT` não assinado.

* `CONVERT(expr USING transcoding_name)`

  `CONVERT(expr,type)`

  `CONVERT(expr USING transcoding_name)` é sintaxe SQL padrão. A forma não-`USING` de `CONVERT()` é sintaxe ODBC.

  `CONVERT(expr USING transcoding_name)` converte dados entre diferentes character sets. No MySQL, os nomes de transcoding são os mesmos que os nomes correspondentes de character set. Por exemplo, esta instrução converte a string `'abc'` no character set padrão para a string correspondente no character set `utf8`:

  ```sql
  SELECT CONVERT('abc' USING utf8);
  ```

  A sintaxe `CONVERT(expr, type)` (sem `USING`) recebe uma expression e um valor *`type`* especificando um tipo de resultado, e produz um valor resultante do tipo especificado. Esta operação também pode ser expressa como `CAST(expr AS type)`, que é equivalente. Para mais informações, consulte a descrição de `CAST()`.

### Conversões de Character Set

`CONVERT()` com uma cláusula `USING` converte dados entre character sets:

```sql
CONVERT(expr USING transcoding_name)
```

No MySQL, os nomes de transcoding são os mesmos que os nomes de character set correspondentes.

Exemplos:

```sql
SELECT CONVERT('test' USING utf8);
SELECT CONVERT(_latin1'Müller' USING utf8);
INSERT INTO utf8_table (utf8_column)
    SELECT CONVERT(latin1_column USING utf8) FROM latin1_table;
```

Para converter strings entre character sets, você também pode usar a sintaxe `CONVERT(expr, type)` (sem `USING`), ou `CAST(expr AS type)`, que é equivalente:

```sql
CONVERT(string, CHAR[(N)] CHARACTER SET charset_name)
CAST(string AS CHAR[(N)] CHARACTER SET charset_name)
```

Exemplos:

```sql
SELECT CONVERT('test', CHAR CHARACTER SET utf8);
SELECT CAST('test' AS CHAR CHARACTER SET utf8);
```

Se você especificar `CHARACTER SET charset_name` conforme mostrado, o character set e a collation do resultado são *`charset_name`* e a collation padrão de *`charset_name`*. Se você omitir `CHARACTER SET charset_name`, o character set e a collation do resultado são definidos pelas variáveis de sistema `character_set_connection` e `collation_connection` que determinam o character set e a collation de conexão padrão (consulte a Seção 10.4, “Character Sets e Collations de Conexão”).

Uma cláusula `COLLATE` não é permitida dentro de uma chamada `CONVERT()` ou `CAST()`, mas você pode aplicá-la ao resultado da função. Por exemplo, estas são legais:

```sql
SELECT CONVERT('test' USING utf8) COLLATE utf8_bin;
SELECT CONVERT('test', CHAR CHARACTER SET utf8) COLLATE utf8_bin;
SELECT CAST('test' AS CHAR CHARACTER SET utf8) COLLATE utf8_bin;
```

Mas estas são ilegais:

```sql
SELECT CONVERT('test' USING utf8 COLLATE utf8_bin);
SELECT CONVERT('test', CHAR CHARACTER SET utf8 COLLATE utf8_bin);
SELECT CAST('test' AS CHAR CHARACTER SET utf8 COLLATE utf8_bin);
```

Para literais de string, outra maneira de especificar o character set é usar um character set introducer. `_latin1` e `_latin2` no exemplo anterior são instâncias de introducers. Diferentemente das funções de conversão como `CAST()` ou `CONVERT()`, que convertem uma string de um character set para outro, um introducer designa um literal de string como tendo um character set específico, sem conversão envolvida. Para mais informações, consulte a Seção 10.3.8, “Character Set Introducers”.

### Conversões de Character Set para Comparações de String

Normalmente, você não pode comparar um valor `BLOB` ou outra binary string de maneira case-insensitive (não sensível a maiúsculas/minúsculas) porque binary strings usam o character set `binary`, que não possui uma collation com o conceito de caixa de letras. Para realizar uma comparação case-insensitive, primeiro use a função `CONVERT()` ou `CAST()` para converter o valor em uma string não binária. Comparações da string resultante usam sua collation. Por exemplo, se a collation do resultado da conversão não for case-sensitive, uma operação `LIKE` não será case-sensitive. Isso é verdade para a seguinte operação porque a collation `latin1` padrão (`latin1_swedish_ci`) não é case-sensitive:

```sql
SELECT 'A' LIKE CONVERT(blob_col USING latin1)
  FROM tbl_name;
```

Para especificar uma collation particular para a string convertida, use uma cláusula `COLLATE` após a chamada `CONVERT()`:

```sql
SELECT 'A' LIKE CONVERT(blob_col USING latin1) COLLATE latin1_german1_ci
  FROM tbl_name;
```

Para usar um character set diferente, substitua o nome dele por `latin1` nas instruções anteriores (e, de forma semelhante, para usar uma collation diferente).

`CONVERT()` e `CAST()` podem ser usados de forma mais geral para comparar strings representadas em diferentes character sets. Por exemplo, uma comparação destas strings resulta em um erro porque elas possuem character sets diferentes:

```sql
mysql> SET @s1 = _latin1 'abc', @s2 = _latin2 'abc';
mysql> SELECT @s1 = @s2;
ERROR 1267 (HY000): Illegal mix of collations (latin1_swedish_ci,IMPLICIT)
and (latin2_general_ci,IMPLICIT) for operation '='
```

A conversão de uma das strings para um character set compatível com a outra permite que a comparação ocorra sem erro:

```sql
mysql> SELECT @s1 = CONVERT(@s2 USING latin1);
+---------------------------------+
| @s1 = CONVERT(@s2 USING latin1) |
+---------------------------------+
|                               1 |
+---------------------------------+
```

A conversão de character set também é útil precedendo a conversão de caixa de letras (lettercase) de binary strings. `LOWER()` e `UPPER()` são ineficazes quando aplicados diretamente a binary strings porque o conceito de caixa de letras não se aplica. Para realizar a conversão de caixa de letras de uma binary string, primeiro converta-a para uma string não binária usando um character set apropriado para os dados armazenados na string:

```sql
mysql> SET @str = BINARY 'New York';
mysql> SELECT LOWER(@str), LOWER(CONVERT(@str USING latin1));
+-------------+-----------------------------------+
| LOWER(@str) | LOWER(CONVERT(@str USING latin1)) |
+-------------+-----------------------------------+
| New York    | new york                          |
+-------------+-----------------------------------+
```

Esteja ciente de que, se você aplicar `BINARY`, `CAST()` ou `CONVERT()` a uma coluna indexed, o MySQL pode não ser capaz de usar o Index de forma eficiente.

### Outros Usos para Operações de Cast

As funções de cast são úteis para criar uma coluna com um tipo específico em uma instrução `CREATE TABLE ... SELECT`:

```sql
mysql> CREATE TABLE new_table SELECT CAST('2000-01-01' AS DATE) AS c1;
mysql> SHOW CREATE TABLE new_table\G
*************************** 1. row ***************************
       Table: new_table
Create Table: CREATE TABLE `new_table` (
  `c1` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1
```

As funções de cast são úteis para ordenar colunas `ENUM` em ordem lexical. Normalmente, a ordenação de colunas `ENUM` ocorre usando os valores numéricos internos. Fazer o Cast dos valores para `CHAR` resulta em uma ordenação lexical:

```sql
SELECT enum_col FROM tbl_name ORDER BY CAST(enum_col AS CHAR);
```

`CAST()` também altera o resultado se você usá-lo como parte de uma expression mais complexa, como `CONCAT('Date: ',CAST(NOW() AS DATE))`.

Para valores temporais, há pouca necessidade de usar `CAST()` para extrair dados em formatos diferentes. Em vez disso, use uma função como `EXTRACT()`, `DATE_FORMAT()` ou `TIME_FORMAT()`. Consulte a Seção 12.7, “Funções de Data e Hora”.

Para converter uma string para um número, normalmente basta usar o valor da string em contexto numérico:

```sql
mysql> SELECT 1+'1';
       -> 2
```

Isso também é verdade para literais hexadecimais e de bit, que são binary strings por padrão:

```sql
mysql> SELECT X'41', X'41'+0;
        -> 'A', 65
mysql> SELECT b'1100001', b'1100001'+0;
        -> 'a', 97
```

Uma string usada em uma operação aritmética é convertida para um número de ponto flutuante durante a avaliação da expression.

Um número usado em contexto de string é convertido para uma string:

```sql
mysql> SELECT CONCAT('hello you ',2);
        -> 'hello you 2'
```

Para informações sobre a conversão implícita de números para strings, consulte a Seção 12.3, “Conversão de Tipo na Avaliação de Expression”.

O MySQL suporta aritmética com valores de 64 bits, tanto signed (assinados) quanto unsigned (não assinados). Para operadores numéricos (como `+` ou `-`) onde um dos operandos é um integer unsigned, o resultado é unsigned por padrão (consulte a Seção 12.6.1, “Operadores Aritméticos”). Para anular isso, use o operador de cast `SIGNED` ou `UNSIGNED` para converter um valor, respectivamente, para um integer de 64 bits signed ou unsigned.

```sql
mysql> SELECT 1 - 2;
        -> -1
mysql> SELECT CAST(1 - 2 AS UNSIGNED);
        -> 18446744073709551615
mysql> SELECT CAST(CAST(1 - 2 AS UNSIGNED) AS SIGNED);
        -> -1
```

Se qualquer operando for um valor de ponto flutuante, o resultado é um valor de ponto flutuante e não é afetado pela regra anterior. (Neste contexto, os valores de coluna `DECIMAL` são considerados valores de ponto flutuante.)

```sql
mysql> SELECT CAST(1 AS UNSIGNED) - 2.0;
        -> -1.0
```

O SQL mode afeta o resultado das operações de conversão (consulte a Seção 5.1.10, “SQL Modes do Servidor”). Exemplos:

* Para conversão de uma string de data “zero” para uma data, `CONVERT()` e `CAST()` retornam `NULL` e produzem um warning quando o SQL mode `NO_ZERO_DATE` está habilitado.

* Para subtração de integer, se o SQL mode `NO_UNSIGNED_SUBTRACTION` estiver habilitado, o resultado da subtração é signed mesmo que qualquer operando seja unsigned.