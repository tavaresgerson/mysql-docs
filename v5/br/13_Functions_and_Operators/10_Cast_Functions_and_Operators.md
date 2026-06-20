## 12.10 Funções e operadores de cast

**Tabela 12.15 Funções e operadores de cast**

<table frame="box" rules="all" summary="A reference that lists cast functions and operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>BINARY</code></td> <td>Arremessar uma cadeia para uma cadeia binária</td> </tr><tr><td><code>CAST()</code></td> <td>Atribua um valor a um determinado tipo</td> </tr><tr><td><code>CONVERT()</code></td> <td>Atribua um valor a um determinado tipo</td> </tr></tbody></table>

As funções e operadores de cast permitem a conversão de valores de um tipo de dados para outro.

* Descrições das funções e operadores de cast
* Conversões de conjuntos de caracteres
* Conversões de conjuntos de caracteres para comparações de strings
* Outros usos das operações de cast

### Descrições das funções e operadores de elenco

* `BINARY` *`expr`*

O operador `BINARY` converte a expressão em uma string binária (uma string que tem o conjunto de caracteres `binary` e a ordenação `binary`). Um uso comum do `BINARY` é forçar uma comparação de string de caracteres a ser feita byte por byte, usando valores numéricos de byte em vez de caracteres por caracteres. O operador `BINARY` também faz com que os espaços finais nas comparações sejam significativos. Para informações sobre as diferenças entre a ordenação `binary` do conjunto de caracteres `binary` e as ordenações `_bin` dos conjuntos de caracteres não binários, consulte a Seção 10.8.5, “A ordenação binária comparada às ordenações _bin”.

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

Em uma comparação, `BINARY` afeta toda a operação; ele pode ser dado antes de qualquer dos operandos com o mesmo resultado.

Para converter uma expressão de cadeia em uma cadeia binária, esses construtos são equivalentes:

  ```sql
  CONVERT(expr USING BINARY)
  CAST(expr AS BINARY)
  BINARY expr
  ```

Se um valor for uma literal de string, ele pode ser designado como uma string binária sem a necessidade de conversão, utilizando o conjunto de caracteres `_binary` introduzido:

  ```sql
  mysql> SELECT 'a' = 'A';
          -> 1
  mysql> SELECT _binary 'a' = 'A';
          -> 0
  ```

Para informações sobre introdutores, consulte a Seção 10.3.8, “Introdutores de Conjunto de Caracteres”.

O operador `BINARY` em expressões difere em efeito do atributo `BINARY` em definições de colunas de caracteres. Para uma coluna de caracteres definida com o atributo `BINARY`, o MySQL atribui o conjunto de caracteres padrão da tabela e a ordenação binária (`_bin`) desse conjunto de caracteres. Cada conjunto de caracteres não binário tem uma ordenação `_bin`. Por exemplo, se o conjunto de caracteres padrão da tabela é `utf8`, essas duas definições de coluna são equivalentes:

  ```sql
  CHAR(10) BINARY
  CHAR(10) CHARACTER SET utf8 COLLATE utf8_bin
  ```

O uso de `CHARACTER SET binary` na definição de uma coluna de `CHAR`, `VARCHAR` ou `TEXT` faz com que a coluna seja tratada como o tipo de dados correspondente de cadeia binária. Por exemplo, os seguintes pares de definições são equivalentes:

  ```sql
  CHAR(10) CHARACTER SET binary
  BINARY(10)

  VARCHAR(10) CHARACTER SET binary
  VARBINARY(10)

  TEXT CHARACTER SET binary
  BLOB
  ```

Se `BINARY` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O cliente de string de comando MySQL”.

* `CAST(expr AS type)`](cast-functions.html#function_cast)

`CAST(expr AS type`](cast-functions.html#function_cast) recebe uma expressão de qualquer tipo e produz um valor de resultado do tipo especificado. Essa operação também pode ser expressa como `CONVERT(expr, type)`](cast-functions.html#function_convert), que é equivalente.

Estes valores *`type` são permitidos:

+ `BINARY[(N)]`

Produz uma string com o tipo de dados `VARBINARY`, exceto que, quando a expressão *`expr`* é vazia (com comprimento zero), o tipo de resultado é `BINARY(0)`. Se a comprimento opcional *`N`* for fornecido, `BINARY(N)` faz com que o cast use no máximo *`N`* bytes do argumento. Valores mais curtos que *`N`* bytes são preenchidos com `0x00` bytes até um comprimento de *`N`*. Se o comprimento opcional *`N`* não for fornecido, o MySQL calcula o comprimento máximo a partir da expressão. Se o comprimento fornecido ou calculado for maior que um limite interno, o tipo de resultado é `BLOB`. Se o comprimento ainda for muito longo, o tipo de resultado é `LONGBLOB`.

Para uma descrição de como a projeção para `BINARY` afeta as comparações, consulte a Seção 11.3.3, “Os tipos BINARY e VARBINARY”.

+ `CHAR[(N)] [charset_info]`

Produz uma string com o tipo de dados `VARCHAR`, a menos que a expressão *`expr`* esteja vazia (com comprimento zero), no qual caso, o tipo de resultado é `CHAR(0)`. Se a comprimento opcional *`N`* for fornecido, `CHAR(N)` faz com que o cast use no máximo *`N`* caracteres do argumento. Não ocorre preenchimento para valores com menos de *`N`* caracteres. Se o comprimento opcional *`N`* não for fornecido, o MySQL calcula o comprimento máximo a partir da expressão. Se o comprimento fornecido ou calculado for maior que um limite interno, o tipo de resultado é `TEXT`. Se o comprimento ainda for muito longo, o tipo de resultado é `LONGTEXT`.

Sem a cláusula *`charset_info`*, `CHAR` produz uma string com o conjunto de caracteres padrão. Para especificar explicitamente o conjunto de caracteres, esses valores *`charset_info`* são permitidos:

- `CHARACTER SET charset_name`: Gera uma string com o conjunto de caracteres fornecido.

- `ASCII`: Abreviação de `CHARACTER SET latin1`.

- `UNICODE`: Abreviação de `CHARACTER SET ucs2`.

Em todos os casos, a cadeia tem o conjunto de caracteres de collation padrão.

+ `DATE`

Produz um valor `DATE`.

+ `DATETIME[(M)]`

Produz um valor de `DATETIME`. Se o valor opcional *`M`* for fornecido, ele especifica a precisão de segundos fracionários.

+ `DECIMAL[(M[,D])]`

Produz um valor `DECIMAL` - DECIMAL, NUMERIC") Se os valores opcionais *`M`* e *`D`* forem fornecidos, eles especificam o número máximo de dígitos (a precisão) e o número de dígitos após o ponto decimal (a escala). Se *`D`* for omitido, 0 é assumido. Se *`M`* for omitido, 10 é assumido.

+ `JSON`

Gera um valor de `JSON`. Para obter detalhes sobre as regras de conversão de valores entre `JSON` e outros tipos, consulte a comparação e ordenação de valores JSON.

+ `NCHAR[(N)]`

Como `CHAR`, mas produz uma string com o conjunto de caracteres nacional. Veja a Seção 10.3.7, “O Conjunto de Caracteres Nacional”.

Ao contrário de `CHAR`, `NCHAR` não permite que informações sobre o conjunto de caracteres finais sejam especificadas.

+ `SIGNED [INTEGER]`

Produz um valor assinado `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

+ `TIME[(M)]`

Produz um valor de `TIME`. Se o valor opcional *`M`* for fornecido, ele especifica a precisão de segundos fracionários.

+ `UNSIGNED [INTEGER]`

Produz um valor `BIGINT` não assinado - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

* `CONVERT(expr USING transcoding_name)`(cast-functions.html#function_convert)

  `CONVERT(expr,type)`

`CONVERT(expr USING transcoding_name)` é sintaxe SQL padrão. A forma não `USING` de `CONVERT()` é sintaxe ODBC.

`CONVERT(expr USING transcoding_name)`](cast-functions.html#function_convert) converte dados entre diferentes conjuntos de caracteres. No MySQL, as transcodificações de nomes são as mesmas que os nomes correspondentes dos conjuntos de caracteres. Por exemplo, esta declaração converte a string `'abc'` no conjunto de caracteres padrão para a string correspondente no conjunto de caracteres `utf8`:

  ```sql
  SELECT CONVERT('abc' USING utf8);
  ```

A sintaxe `CONVERT(expr, type)`(cast-functions.html#function_convert) (sem `USING`) recebe uma expressão e um valor *`type`*, especificando um tipo de resultado, e produz um valor de resultado do tipo especificado. Essa operação também pode ser expressa como [`CAST(expr AS type)`](cast-functions.html#function_cast), que é equivalente. Para mais informações, consulte a descrição de `CAST()`.

### Conversões de Conjunto de Caracteres

`CONVERT()` com uma cláusula `USING` converte dados entre conjuntos de caracteres:

```sql
CONVERT(expr USING transcoding_name)
```

Em MySQL, os nomes de transcodificação são os mesmos dos nomes dos conjuntos de caracteres correspondentes.

Exemplos:

```sql
SELECT CONVERT('test' USING utf8);
SELECT CONVERT(_latin1'Müller' USING utf8);
INSERT INTO utf8_table (utf8_column)
    SELECT CONVERT(latin1_column USING utf8) FROM latin1_table;
```

Para converter cadeias entre conjuntos de caracteres, você também pode usar a sintaxe `CONVERT(expr, type)`(cast-functions.html#function_convert) (sem `USING`), ou [`CAST(expr AS type)`](cast-functions.html#function_cast), que é equivalente:

```sql
CONVERT(string, CHAR[(N)] CHARACTER SET charset_name)
CAST(string AS CHAR[(N)] CHARACTER SET charset_name)
```

Exemplos:

```sql
SELECT CONVERT('test', CHAR CHARACTER SET utf8);
SELECT CAST('test' AS CHAR CHARACTER SET utf8);
```

Se você especificar `CHARACTER SET charset_name` como mostrado acima, o conjunto de caracteres e a correção do resultado são *`charset_name`* e a correção padrão de *`charset_name`*. Se você omitir `CHARACTER SET charset_name`, o conjunto de caracteres e a correção do resultado são definidos pelas variáveis de sistema `character_set_connection` e `collation_connection` que determinam o conjunto de caracteres e a correção padrão da conexão (consulte Seção 10.4, “Conjunto de caracteres e correções de conexão”).

Uma cláusula `COLLATE` não é permitida dentro de uma chamada `CONVERT()` ou `CAST()`, mas você pode aplicá-la ao resultado da função. Por exemplo, estas são legais:

```sql
SELECT CONVERT('test' USING utf8) COLLATE utf8_bin;
SELECT CONVERT('test', CHAR CHARACTER SET utf8) COLLATE utf8_bin;
SELECT CAST('test' AS CHAR CHARACTER SET utf8) COLLATE utf8_bin;
```

Mas essas são ilegais:

```sql
SELECT CONVERT('test' USING utf8 COLLATE utf8_bin);
SELECT CONVERT('test', CHAR CHARACTER SET utf8 COLLATE utf8_bin);
SELECT CAST('test' AS CHAR CHARACTER SET utf8 COLLATE utf8_bin);
```

Para as literais de cadeia, outra maneira de especificar o conjunto de caracteres é usar um introduzidor de conjunto de caracteres. `_latin1` e `_latin2` no exemplo anterior são exemplos de introdutores. Ao contrário das funções de conversão, como `CAST()`, ou `CONVERT()`, que convertem uma cadeia de caracteres de um conjunto de caracteres para outro, um introduzidor designa uma literal de cadeia como tendo um conjunto de caracteres específico, sem conversão envolvida. Para mais informações, consulte a Seção 10.3.8, “Introdutores de Conjunto de Caracteres”.

### Conversões de Conjunto de Caracteres para Comparação de String

Normalmente, você não pode comparar um valor `BLOB` ou outra string binária de forma sensível ao caso, porque as strings binárias usam o conjunto de caracteres `binary`, que não tem nenhuma ordenação com o conceito de maiúsculas e minúsculas. Para realizar uma comparação sensível ao caso, primeiro use a função `CONVERT()` ou `CAST()` para converter o valor em uma string não binária. As comparações da string resultante usam sua ordenação. Por exemplo, se a ordenação do resultado da conversão não for sensível ao caso, uma operação `LIKE` não é sensível ao caso. Isso é verdade para a operação seguinte porque a ordenação padrão `latin1` (`latin1_swedish_ci`) não é sensível ao caso:

```sql
SELECT 'A' LIKE CONVERT(blob_col USING latin1)
  FROM tbl_name;
```

Para especificar uma colagem particular para a string convertida, use uma cláusula `COLLATE` após a chamada `CONVERT()`:

```sql
SELECT 'A' LIKE CONVERT(blob_col USING latin1) COLLATE latin1_german1_ci
  FROM tbl_name;
```

Para usar um conjunto de caracteres diferente, substitua seu nome por `latin1` nas declarações anteriores (e, de forma semelhante, para usar uma codificação diferente).

`CONVERT()` e `CAST()` podem ser usados de forma mais geral para comparar strings representadas em diferentes conjuntos de caracteres. Por exemplo, uma comparação dessas strings resulta em um erro porque elas têm conjuntos de caracteres diferentes:

```sql
mysql> SET @s1 = _latin1 'abc', @s2 = _latin2 'abc';
mysql> SELECT @s1 = @s2;
ERROR 1267 (HY000): Illegal mix of collations (latin1_swedish_ci,IMPLICIT)
and (latin2_general_ci,IMPLICIT) for operation '='
```

Converter uma das cadeias em um conjunto de caracteres compatível com o outro permite que a comparação ocorra sem erros:

```sql
mysql> SELECT @s1 = CONVERT(@s2 USING latin1);
+---------------------------------+
| @s1 = CONVERT(@s2 USING latin1) |
+---------------------------------+
|                               1 |
+---------------------------------+
```

A conversão do conjunto de caracteres também é útil antes da conversão de maiúsculas e minúsculas de cadeias binárias. `LOWER()` e `UPPER()` são ineficazes quando aplicados diretamente a cadeias binárias, porque o conceito de maiúsculas e minúsculas não se aplica. Para realizar a conversão de maiúsculas e minúsculas de uma cadeia binária, primeiro converta-a em uma cadeia não binária usando um conjunto de caracteres apropriado para os dados armazenados na cadeia:

```sql
mysql> SET @str = BINARY 'New York';
mysql> SELECT LOWER(@str), LOWER(CONVERT(@str USING latin1));
+-------------+-----------------------------------+
| LOWER(@str) | LOWER(CONVERT(@str USING latin1)) |
+-------------+-----------------------------------+
| New York    | new york                          |
+-------------+-----------------------------------+
```

Tenha em atenção que, se aplicar `BINARY`, `CAST()` ou `CONVERT()` a uma coluna indexada, o MySQL pode não conseguir utilizar o índice de forma eficiente.

### Outros usos para operações de fundição

As funções de elenco são úteis para criar uma coluna com um tipo específico em uma declaração `CREATE TABLE ... SELECT`(create-table.html "13.1.18 CREATE TABLE Statement"):

```sql
mysql> CREATE TABLE new_table SELECT CAST('2000-01-01' AS DATE) AS c1;
mysql> SHOW CREATE TABLE new_table\G
*************************** 1. row ***************************
       Table: new_table
Create Table: CREATE TABLE `new_table` (
  `c1` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1
```

As funções de cast são úteis para ordenar as colunas `ENUM` em ordem lexical. Normalmente, a ordenação das colunas `ENUM` ocorre usando os valores numéricos internos. A cast dos valores para `CHAR` resulta em uma ordenação lexical:

```sql
SELECT enum_col FROM tbl_name ORDER BY CAST(enum_col AS CHAR);
```

`CAST()` também altera o resultado se você usá-lo como parte de uma expressão mais complexa, como [`CONCAT('Date: ',CAST(NOW() AS DATE))`](string-functions.html#function_concat).

Para valores temporais, é pouco necessário usar `CAST()` para extrair dados em diferentes formatos. Em vez disso, use uma função como `EXTRACT()`, `DATE_FORMAT()` ou `TIME_FORMAT()`. Veja a Seção 12.7, “Funções de Data e Hora”.

Para converter uma cadeia de caracteres em um número, normalmente é suficiente usar o valor da cadeia de caracteres em um contexto numérico:

```sql
mysql> SELECT 1+'1';
       -> 2
```

Isso também é verdade para os literais hexadecimais e de bits, que são strings binárias por padrão:

```sql
mysql> SELECT X'41', X'41'+0;
        -> 'A', 65
mysql> SELECT b'1100001', b'1100001'+0;
        -> 'a', 97
```

Uma cadeia de caracteres usada em uma operação aritmética é convertida em um número de ponto flutuante durante a avaliação da expressão.

Um número usado em contexto de string é convertido em uma string:

```sql
mysql> SELECT CONCAT('hello you ',2);
        -> 'hello you 2'
```

Para informações sobre a conversão implícita de números em strings, consulte a Seção 12.3, “Conversão de Tipo na Avaliação de Expressões”.

O MySQL suporta aritmética com valores de 64 bits assinados e não assinados. Para operadores numéricos (como `+` ou `-`) onde uma das operandos é um inteiro não assinado, o resultado é não assinado por padrão (consulte a Seção 12.6.1, “Operadores Aritméticos”). Para ignorar isso, use o operador de cast `SIGNED` ou `UNSIGNED` para converter um valor em um inteiro de 64 bits assinado ou não assinado, respectivamente.

```sql
mysql> SELECT 1 - 2;
        -> -1
mysql> SELECT CAST(1 - 2 AS UNSIGNED);
        -> 18446744073709551615
mysql> SELECT CAST(CAST(1 - 2 AS UNSIGNED) AS SIGNED);
        -> -1
```

Se qualquer dos operandos for um valor de ponto flutuante, o resultado é um valor de ponto flutuante e não é afetado pela regra anterior. (Neste contexto, os valores das colunas `DECIMAL` - DECIMAL, NUMERIC] são considerados valores de ponto flutuante.)

```sql
mysql> SELECT CAST(1 AS UNSIGNED) - 2.0;
        -> -1.0
```

O modo SQL afeta o resultado das operações de conversão (consulte a Seção 5.1.10, “Modos SQL do servidor”). Exemplos:

* Para a conversão de uma cadeia de caracteres de data "zero" para uma data, `CONVERT()` e `CAST()` retornam `NULL` e produzem um aviso quando o modo SQL `NO_ZERO_DATE` é habilitado.

* Para subtração de inteiros, se o modo SQL `NO_UNSIGNED_SUBTRACTION` estiver habilitado, o resultado da subtração é sinalizado mesmo que qualquer operando seja não sinalizado.