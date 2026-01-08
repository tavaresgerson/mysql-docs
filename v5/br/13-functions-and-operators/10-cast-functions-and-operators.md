## 12.10 Funções e operadores de cast

**Tabela 12.15 Funções e Operadores de Casting**

<table frame="box" rules="all" summary="Uma referência que lista funções e operadores de referência."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="cast-functions.html#operator_binary">[[<code>BINARY</code>]]</a></td> <td>Converte uma cadeia de caracteres em uma cadeia binária</td> </tr><tr><td><a class="link" href="cast-functions.html#function_cast">[[<code>CAST()</code>]]</a></td> <td>Atribua um valor a um determinado tipo</td> </tr><tr><td><a class="link" href="cast-functions.html#function_convert">[[<code>CONVERT()</code>]]</a></td> <td>Atribua um valor a um determinado tipo</td> </tr></tbody></table>

As funções e operadores de cast permitem a conversão de valores de um tipo de dado para outro.

- Função de elenco e descrições dos operadores
- Conversões de Conjunto de Caracteres
- Conversões de Conjunto de Caracteres para Comparação de Strings
- Outras utilizações das operações de fundição

### Função de elenco e descrições dos operadores

- `BINARY` *`expr`*

  O operador `BINARY` converte a expressão em uma string binária (uma string que tem o conjunto de caracteres `binary` e a collation `binary`). Um uso comum do operador `BINARY` é forçar uma comparação de string de caracteres a ser feita caractere por caractere usando valores de byte numéricos em vez de byte por byte. O operador `BINARY` também faz com que os espaços em branco finais nas comparações sejam significativos. Para obter informações sobre as diferenças entre a collation `binary` do conjunto de caracteres `binary` e as collation `_bin` dos conjuntos de caracteres não binários, consulte a Seção 10.8.5, “A collation binária em comparação com as collation \_bin”.

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

  Para converter uma expressão de cadeia em uma string binária, esses construtores são equivalentes:

  ```sql
  CONVERT(expr USING BINARY)
  CAST(expr AS BINARY)
  BINARY expr
  ```

  Se um valor for uma literal de string, ele pode ser designado como uma string binária sem a necessidade de conversão, usando o conjunto de caracteres `_binary`:

  ```sql
  mysql> SELECT 'a' = 'A';
          -> 1
  mysql> SELECT _binary 'a' = 'A';
          -> 0
  ```

  Para obter informações sobre introdutores, consulte a Seção 10.3.8, “Introdutores de Conjunto de Caracteres”.

  O operador `BINARY` em expressões difere em efeito do atributo `BINARY` em definições de colunas de caracteres. Para uma coluna de caracteres definida com o atributo `BINARY`, o MySQL atribui o conjunto de caracteres padrão da tabela e a collation binária (\_bin) desse conjunto de caracteres. Cada conjunto de caracteres não binário tem uma collation \_bin. Por exemplo, se o conjunto de caracteres padrão da tabela for `utf8`, essas duas definições de coluna são equivalentes:

  ```sql
  CHAR(10) BINARY
  CHAR(10) CHARACTER SET utf8 COLLATE utf8_bin
  ```

  O uso de `CHARACTER SET binary` na definição de uma coluna `CHAR`, `VARCHAR` ou `TEXT` faz com que a coluna seja tratada como o tipo de dados correspondente de string binária. Por exemplo, os seguintes pares de definições são equivalentes:

  ```sql
  CHAR(10) CHARACTER SET binary
  BINARY(10)

  VARCHAR(10) CHARACTER SET binary
  VARBINARY(10)

  TEXT CHARACTER SET binary
  BLOB
  ```

  Se `BINARY` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 4.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

- `CAST(expr AS type)`

  `CAST(expr AS type` recebe uma expressão de qualquer tipo e produz um valor de resultado do tipo especificado. Essa operação também pode ser expressa como `CONVERT(expr, type)`, que é equivalente.

  Estes valores de *`type`* são permitidos:

  - `BINARY[(N)]`

    Gera uma string com o tipo de dados `VARBINARY`, exceto que, quando a expressão `expr` é vazia (com comprimento zero), o tipo de resultado é `BINARY(0)`. Se o comprimento opcional `N` for fornecido, `BINARY(N)` faz com que o cast use no máximo `N` bytes do argumento. Valores menores que `N` bytes são preenchidos com `0x00` bytes até um comprimento de `N`. Se o comprimento opcional `N` não for fornecido, o MySQL calcula o comprimento máximo a partir da expressão. Se o comprimento fornecido ou calculado for maior que um limiar interno, o tipo de resultado é `BLOB`. Se o comprimento ainda for muito longo, o tipo de resultado é `LONGBLOB`.

    Para uma descrição de como a conversão para `BINARY` afeta as comparações, consulte a Seção 11.3.3, “Os tipos BINARY e VARBINARY”.

  - `CHAR[(N)] [charset_info]`

    Gera uma cadeia com o tipo de dados `VARCHAR`, a menos que a expressão *`expr`* esteja vazia (com comprimento zero), caso em que o tipo de resultado é `CHAR(0)`. Se a comprimento opcional *`N`* for fornecido, `CHAR(N)` faz com que o cast não use mais de *`N`* caracteres do argumento. Não ocorre preenchimento para valores com menos de *`N`* caracteres. Se o comprimento opcional *`N`* não for fornecido, o MySQL calcula o comprimento máximo a partir da expressão. Se o comprimento fornecido ou calculado for maior que um limiar interno, o tipo de resultado é `TEXT`. Se o comprimento ainda for muito longo, o tipo de resultado é `LONGTEXT`.

    Sem a cláusula `charset_info`, o `CHAR` produz uma string com o conjunto de caracteres padrão. Para especificar explicitamente o conjunto de caracteres, esses valores de `charset_info` são permitidos:

    - `CHARACTER SET charset_name`: Gera uma string com o conjunto de caracteres especificado.

    - `ASCII`: Abreviação para `CHARACTER SET latin1`.

    - `UNICODE`: Abreviação para `CHARACTER SET ucs2`.

    Em todos os casos, a cadeia tem a collation padrão do conjunto de caracteres.

  - `DATA`

    Gera um valor `DATE`.

  - `DATETIME[(M)]`

    Gera um valor `DATETIME`. Se o valor opcional *`M`* for fornecido, ele especifica a precisão de segundos fracionários.

  - `DECIMAL[(M[, D])]`

    Gera um valor `DECIMAL` - DECIMAL, NUMERIC") . Se os valores opcionais *`M`* e *`D`* forem fornecidos, eles especificam o número máximo de dígitos (a precisão) e o número de dígitos após o ponto decimal (a escala). Se *`D`* for omitido, 0 será assumido. Se *`M`* for omitido, 10 será assumido.

  - `JSON`

    Gera um valor `JSON`. Para obter detalhes sobre as regras de conversão de valores entre `JSON` e outros tipos, consulte Comparação e ordenação de valores JSON.

  - `NCHAR[(N)]`

    Como `CHAR`, mas produz uma string com o conjunto de caracteres nacional. Veja a Seção 10.3.7, “O Conjunto de Caracteres Nacionais”.

    Ao contrário de `CHAR`, `NCHAR` não permite que informações sobre o conjunto de caracteres sejam especificadas no final.

  - `ASSINADO [INTEIRO]`

    Gera um valor de `BIGINT` assinado - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  - `TEMPO[(M)]`

    Gera um valor `TIME`. Se o valor opcional *`M`* for fornecido, ele especifica a precisão de segundos fracionários.

  - `UNSIGNED [INTEGER]`

    Gera um valor `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT) não assinado.

- `CONVERT(expr USING transcoding_name)`

  `CONVERT(expr, type)`

  `CONVERT(expr USING transcoding_name)` é a sintaxe padrão do SQL. A forma sem `USING` do `CONVERT()` é a sintaxe ODBC.

  `CONVERT(expr USING transcoding_name)` converte dados entre diferentes conjuntos de caracteres. No MySQL, os nomes de transcodificação são os mesmos que os nomes dos conjuntos de caracteres correspondentes. Por exemplo, esta declaração converte a string `'abc'` no conjunto de caracteres padrão para a string correspondente no conjunto de caracteres `utf8`:

  ```sql
  SELECT CONVERT('abc' USING utf8);
  ```

  A sintaxe `CONVERT(expr, type)` (sem `USING`) recebe uma expressão e um valor de *`type`* que especifica um tipo de resultado e produz um valor de resultado do tipo especificado. Essa operação também pode ser expressa como `CAST(expr AS type)`, que é equivalente. Para mais informações, consulte a descrição de `CAST()`.

### Conversões de Conjunto de Caracteres

A função `CONVERT()` com uma cláusula `USING` converte dados entre conjuntos de caracteres:

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

Para converter cadeias entre conjuntos de caracteres, você também pode usar a sintaxe `CONVERT(expr, type)` (sem `USING`) ou `CAST(expr AS type)`, que é equivalente:

```sql
CONVERT(string, CHAR[(N)] CHARACTER SET charset_name)
CAST(string AS CHAR[(N)] CHARACTER SET charset_name)
```

Exemplos:

```sql
SELECT CONVERT('test', CHAR CHARACTER SET utf8);
SELECT CAST('test' AS CHAR CHARACTER SET utf8);
```

Se você especificar `CHARACTER SET charset_name` como mostrado acima, o conjunto de caracteres e a ordenação do resultado serão `charset_name` e a ordenação padrão de `charset_name`. Se você omitir `CHARACTER SET charset_name`, o conjunto de caracteres e a ordenação do resultado serão definidos pelas variáveis de sistema `character_set_connection` e `collation_connection`, que determinam o conjunto de caracteres e a ordenação de conexão padrão (consulte a Seção 10.4, “Conjunto de caracteres e ordenação de conexão”).

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

Para literais de cadeia, outra maneira de especificar o conjunto de caracteres é usar um introduzir de conjunto de caracteres. `_latin1` e `_latin2` no exemplo anterior são exemplos de introdutores. Ao contrário das funções de conversão, como `CAST()` ou `CONVERT()`, que convertem uma cadeia de caracteres de um conjunto de caracteres para outro, um introduzir designa um literal de cadeia como tendo um conjunto de caracteres específico, sem nenhuma conversão envolvida. Para mais informações, consulte a Seção 10.3.8, “Introdutores de Conjunto de Caracteres”.

### Conversões de Conjunto de Caracteres para Comparação de Strings

Normalmente, você não pode comparar um valor `BLOB` ou outra string binária de forma sensível a maiúsculas e minúsculas, porque as strings binárias usam o conjunto de caracteres `binary`, que não tem nenhuma ordenação com o conceito de maiúsculas e minúsculas. Para realizar uma comparação sensível a maiúsculas e minúsculas, primeiro use a função `CONVERT()` ou `CAST()` para converter o valor em uma string não binária. As comparações da string resultante usam sua ordenação. Por exemplo, se a ordenação do resultado da conversão não for sensível a maiúsculas e minúsculas, uma operação `LIKE` não será sensível a maiúsculas e minúsculas. Isso é verdade para a seguinte operação porque a ordenação `latin1` padrão (`latin1_swedish_ci`) não é sensível a maiúsculas e minúsculas:

```sql
SELECT 'A' LIKE CONVERT(blob_col USING latin1)
  FROM tbl_name;
```

Para especificar uma collation particular para a string convertida, use uma cláusula `COLLATE` após a chamada `CONVERT()`:

```sql
SELECT 'A' LIKE CONVERT(blob_col USING latin1) COLLATE latin1_german1_ci
  FROM tbl_name;
```

Para usar um conjunto de caracteres diferente, substitua seu nome por `latin1` nas declarações anteriores (e, de forma semelhante, para usar uma ordem de classificação diferente).

`CONVERT()` e `CAST()` podem ser usados de forma mais geral para comparar strings representadas em conjuntos de caracteres diferentes. Por exemplo, uma comparação dessas strings resulta em um erro porque elas têm conjuntos de caracteres diferentes:

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

A conversão do conjunto de caracteres também é útil antes da conversão de maiúsculas e minúsculas de strings binárias. `LOWER()` e `UPPER()` são ineficazes quando aplicados diretamente a strings binárias, porque o conceito de maiúsculas e minúsculas não se aplica. Para realizar a conversão de maiúsculas e minúsculas de uma string binária, primeiro converta-a em uma string não binária usando um conjunto de caracteres apropriado para os dados armazenados na string:

```sql
mysql> SET @str = BINARY 'New York';
mysql> SELECT LOWER(@str), LOWER(CONVERT(@str USING latin1));
+-------------+-----------------------------------+
| LOWER(@str) | LOWER(CONVERT(@str USING latin1)) |
+-------------+-----------------------------------+
| New York    | new york                          |
+-------------+-----------------------------------+
```

Tenha em mente que, se você aplicar `BINARY`, `CAST()` ou `CONVERT()` a uma coluna indexada, o MySQL pode não conseguir usar o índice de forma eficiente.

### Outras utilizações das operações de fundição

As funções de elenco são úteis para criar uma coluna com um tipo específico em uma instrução `CREATE TABLE ... SELECT`:

```sql
mysql> CREATE TABLE new_table SELECT CAST('2000-01-01' AS DATE) AS c1;
mysql> SHOW CREATE TABLE new_table\G
*************************** 1. row ***************************
       Table: new_table
Create Table: CREATE TABLE `new_table` (
  `c1` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1
```

As funções de cast são úteis para ordenar colunas `ENUM` em ordem lexical. Normalmente, a ordenação de colunas `ENUM` ocorre usando os valores numéricos internos. A conversão dos valores para `CHAR` resulta em uma ordenação lexical:

```sql
SELECT enum_col FROM tbl_name ORDER BY CAST(enum_col AS CHAR);
```

`CAST()` também altera o resultado se você usá-lo como parte de uma expressão mais complexa, como `CONCAT('Data: ',CAST(NOW() COMO DATA))`.

Para valores temporais, é pouco necessário usar `CAST()` para extrair dados em diferentes formatos. Em vez disso, use uma função como `EXTRACT()`, `DATE_FORMAT()` ou `TIME_FORMAT()`. Veja a Seção 12.7, “Funções de Data e Hora”.

Para converter uma string em um número, normalmente basta usar o valor da string em um contexto numérico:

```sql
mysql> SELECT 1+'1';
       -> 2
```

Isso também é verdade para literais hexadecimais e de bits, que são cadeias binárias por padrão:

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

Para obter informações sobre a conversão implícita de números em strings, consulte a Seção 12.3, “Conversão de Tipo na Avaliação de Expressões”.

O MySQL suporta aritmética com valores de 64 bits assinados e não assinados. Para operadores numéricos (como `+` ou `-`) onde um dos operandos é um inteiro não assinado, o resultado é não assinado por padrão (consulte a Seção 12.6.1, “Operadores Aritméticos”). Para contornar isso, use o operador de cast `SIGNED` ou `UNSIGNED` para converter um valor em um inteiro de 64 bits assinado ou não assinado, respectivamente.

```sql
mysql> SELECT 1 - 2;
        -> -1
mysql> SELECT CAST(1 - 2 AS UNSIGNED);
        -> 18446744073709551615
mysql> SELECT CAST(CAST(1 - 2 AS UNSIGNED) AS SIGNED);
        -> -1
```

Se qualquer dos operandos for um valor de ponto flutuante, o resultado será um valor de ponto flutuante e não será afetado pela regra anterior. (Neste contexto, os valores das colunas `DECIMAL` - DECIMAL e `NUMERIC` são considerados valores de ponto flutuante.)

```sql
mysql> SELECT CAST(1 AS UNSIGNED) - 2.0;
        -> -1.0
```

O modo SQL afeta o resultado das operações de conversão (consulte a Seção 5.1.10, “Modos SQL do servidor”). Exemplos:

- Para a conversão de uma string de data "zero" em uma data, o `CONVERT()` e o `CAST()` retornam `NULL` e produzem uma mensagem de aviso quando o modo SQL `NO_ZERO_DATE` está ativado.

- Para a subtração de inteiros, se o modo SQL `NO_UNSIGNED_SUBTRACTION` estiver habilitado, o resultado da subtração será assinado, mesmo que algum dos operandos seja não assinado.
