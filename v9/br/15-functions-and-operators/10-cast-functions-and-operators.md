## 14.10 Funções e Operadores de Castagem

**Tabela 14.15 Funções e Operadores de Castagem**

<table frame="box" rules="all" summary="Uma referência que lista as funções e operadores de castagem.">
<col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/>
<thead><tr><th>Nome</th> <th>Descrição</th> <th>Desatualizado</th> </tr></thead><tbody>
<tr><th scope="row"><a class="link" href="cast-functions.html#operator_binary"><code class="literal">BINARY</code></a></th> <td> Casta uma string para uma string binária </td> <td>Sim</td> </tr>
<tr><th scope="row"><a class="link" href="cast-functions.html#function_cast"><code class="literal">CAST()</code></a></th> <td> Casta um valor como um determinado tipo </td> <td></td> </tr>
<tr><th scope="row"><a class="link" href="cast-functions.html#function_convert"><code class="literal">CONVERT()</code></a></th> <td> Casta um valor como um determinado tipo </td> <td></td> </tr>
</tbody></table>

As funções e operadores de castagem permitem a conversão de valores de um tipo de dado para outro.

* Descrições das Funções e Operadores de Castagem
* Conversões de Conjunto de Caracteres
* Conversões de Conjunto de Caracteres para Comparação de Strings
* Operações de Castagem em Tipos Espaciais
* Outros Usos para Operações de Castagem

### Descrições das Funções e Operadores de Castagem

* `BINARY` *`expr`*

O operador `BINARY` converte a expressão em uma string binária (uma string que tem o conjunto de caracteres `binary` e a collation `binary`). Um uso comum do `BINARY` é forçar uma comparação de string de caracteres a ser feita caractere por caractere usando valores de byte numéricos em vez de byte por byte. O operador `BINARY` também faz com que os espaços finais nas comparações sejam significativos. Para informações sobre as diferenças entre a collation `binary` do conjunto de caracteres `binary` e as collation `_bin` dos conjuntos de caracteres não binários, consulte a Seção 12.8.5, “A collation binária comparada às collation \_bin”.

O operador `BINARY` está desatualizado; você deve esperar sua remoção em uma versão futura do MySQL. Use `CAST(... AS BINARY)` em vez disso.

```
  mysql> SET NAMES utf8mb4 COLLATE utf8mb4_general_ci;
          -> OK
  mysql> SELECT 'a' = 'A';
          -> 1
  mysql> SELECT BINARY 'a' = 'A';
          -> 0
  mysql> SELECT 'a' = 'a ';
          -> 1
  mysql> SELECT BINARY 'a' = 'a ';
          -> 0
  ```

Em uma comparação, o `BINARY` afeta toda a operação; ele pode ser dado antes de qualquer operando com o mesmo resultado.

Para converter uma expressão de string em uma string binária, esses construtores são equivalentes:

```
  CONVERT(expr USING BINARY)
  CAST(expr AS BINARY)
  BINARY expr
  ```

Se um valor é uma literal de string, ele pode ser designado como uma string binária sem ser convertido usando o introduziror de conjunto de caracteres `_binary`:

```
  mysql> SELECT 'a' = 'A';
          -> 1
  mysql> SELECT _binary 'a' = 'A';
          -> 0
  ```

Para informações sobre introdutores, consulte a Seção 12.3.8, “Introdutores de conjunto de caracteres”.

O operador `BINARY` em expressões difere em efeito do atributo `BINARY` em definições de colunas de caracteres. Para uma coluna de caracteres definida com o atributo `BINARY`, o MySQL atribui o conjunto de caracteres padrão da tabela e a collation binária (`_bin`) desse conjunto de caracteres. Cada conjunto de caracteres não binário tem uma collation `_bin`. Por exemplo, se o conjunto de caracteres padrão da tabela é `utf8mb4`, essas duas definições de coluna são equivalentes:

```
  CHAR(10) BINARY
  CHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
  ```

O uso de `CHARACTER SET binary` na definição de uma coluna `CHAR`, `VARCHAR` ou `TEXT` faz com que a coluna seja tratada como o tipo de dados correspondente de string binária. Por exemplo, os seguintes pares de definições são equivalentes:

  ```
  CHAR(10) CHARACTER SET binary
  BINARY(10)

  VARCHAR(10) CHARACTER SET binary
  VARBINARY(10)

  TEXT CHARACTER SET binary
  BLOB
  ```

  Se `BINARY` for invocado dentro do cliente **mysql**, as strings binárias são exibidas usando notação hexadecimal, dependendo do valor da opção `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O Cliente de Linha de Comando do MySQL”.

* `CAST(expr AS type [ARRAY])`

  `CAST(timestamp_value AT TIME ZONE timezone_specifier AS DATETIME[(precision)])`

  *`timezone_specifier`*: [INTERVAL] '+00:00' | 'UTC'

  Com a sintaxe `CAST(expr AS type`, a função `CAST` recebe uma expressão de qualquer tipo e produz um valor de resultado do tipo especificado. Essa operação também pode ser expressa como `CONVERT(expr, type)`, que é equivalente. Se *`expr`* é `NULL`, `CAST()` retorna `NULL`.

  Esses valores de *`type`* são permitidos:

  + `BINARY[(N)]`

    Produz uma string com o tipo de dados `VARBINARY`, exceto que quando a expressão *`expr`* é vazia (com comprimento zero), o tipo de resultado é `BINARY(0)`. Se o comprimento opcional *`N`* for fornecido, `BINARY(N)` faz com que o cast use não mais que *`N`* bytes do argumento. Valores menores que *`N`* bytes são preenchidos com bytes `0x00` até uma comprimento de *`N`*. Se o comprimento opcional *`N`* não for fornecido, o MySQL calcula o comprimento máximo a partir da expressão. Se o comprimento fornecido ou calculado for maior que um limiar interno, o tipo de resultado é `BLOB`. Se o comprimento ainda for muito longo, o tipo de resultado é `LONGBLOB`.

    Para uma descrição de como a conversão para `BINARY` afeta as comparações, consulte a Seção 13.3.3, “Os Tipos BINARY e VARBINARY”.

  + `CHAR[(N)] [charset_info]`

Produz uma string com o tipo de dados `VARCHAR`, a menos que a expressão *`expr`* esteja vazia (com comprimento zero), caso em que o tipo de resultado é `CHAR(0)`. Se o comprimento opcional *`N`* for fornecido, `CHAR(N)` faz com que o cast não use mais de *`N`* caracteres do argumento. Não ocorre preenchimento para valores com menos de *`N`* caracteres. Se o comprimento opcional *`N`* não for fornecido, o MySQL calcula o comprimento máximo a partir da expressão. Se o comprimento fornecido ou calculado for maior que um limiar interno, o tipo de resultado é `TEXT`. Se o comprimento ainda for muito longo, o tipo de resultado é `LONGTEXT`.

Sem a cláusula *`charset_info`*, `CHAR` produz uma string com o conjunto de caracteres padrão. Para especificar explicitamente o conjunto de caracteres, esses valores de *`charset_info`* são permitidos:

- `CHARACTER SET charset_name`: Produz uma string com o conjunto de caracteres fornecido.

- `ASCII`: Abreviação para `CHARACTER SET latin1`.

- `UNICODE`: Abreviação para `CHARACTER SET ucs2`.

Em todos os casos, a string tem a collation padrão do conjunto de caracteres.

  + `DATE`

    Produz um valor `DATE`.

  + `DATETIME[(M)]`

    Produz um valor `DATETIME`. Se o valor opcional *`M`* for fornecido, ele especifica a precisão de frações de segundo.

  + `DECIMAL[(M[,D])]`

    Produz um valor `DECIMAL` - DECIMAL, NUMERIC") . Se os valores opcionais *`M`* e *`D`* forem fornecidos, eles especificam o número máximo de dígitos (a precisão) e o número de dígitos após a vírgula decimal (a escala). Se *`D`* for omitido, 0 é assumido. Se *`M`* for omitido, 10 é assumido.

  + `DOUBLE`

    Produz um resultado `DOUBLE` - FLOAT, DOUBLE") .

  + `FLOAT[(p)]`

Se a precisão *`p`* não for especificada, produz um resultado do tipo `FLOAT` - FLOAT, DOUBLE"). Se *`p`* for fornecido e 0 <= < *`p`* <= 24, o resultado é do tipo `FLOAT`. Se 25 <= *`p`* <= 53, o resultado é do tipo `DOUBLE` - FLOAT, DOUBLE"). Se *`p`* for menor que 0 ou maior que 53, um erro é retornado.

  + `JSON`

    Produz um valor `JSON`. Para detalhes sobre as regras de conversão de valores entre `JSON` e outros tipos, consulte Comparação e Ordenação de Valores JSON.

  + `NCHAR[(N)]`

    Como `CHAR`, mas produz uma string com o conjunto de caracteres nacional. Veja a Seção 12.3.7, “O Conjunto de Caracteres Nacional”.

    Ao contrário de `CHAR`, `NCHAR` não permite que informações de conjunto de caracteres sejam especificadas.

  + `REAL`

    Produz um resultado do tipo `REAL` - FLOAT, DOUBLE"). Isso é na verdade `FLOAT` se o modo SQL `REAL_AS_FLOAT` estiver habilitado; caso contrário, o resultado é do tipo `DOUBLE`.

  + `SIGNED [INTEGER]`

    Produz um valor `BIGINT` assinado - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

  + *`spatial_type`*

    `CAST()` e `CONVERT()` suportam a conversão de valores de geometria de um tipo espacial para outro, para certas combinações de tipos espaciais. Para detalhes, consulte Operações de Castagem em Tipos Espaciais.

  + `TIME[(M)]`

    Produz um valor `TIME`. Se o valor opcional *`M`* for fornecido, ele especifica a precisão de segundos fracionários.

  + `UNSIGNED [INTEGER]`

    Produz um valor `BIGINT` não assinado - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

  + `YEAR`

    Produz um valor `YEAR`. Essas regras regem a conversão para `YEAR` da seguinte forma:

    - Para um número de quatro dígitos no intervalo de 1901-2155 inclusivo, ou para uma string que pode ser interpretada como um número de quatro dígitos neste intervalo, retorne o valor `YEAR` correspondente.

- Para um número composto por um ou dois dígitos, ou para uma string que pode ser interpretada como tal número, retorne um valor `YEAR` da seguinte forma:

  * Se o número estiver no intervalo de 1 a 69 (inclusive), adicione 2000 e retorne a soma.

  * Se o número estiver no intervalo de 70 a 99 (inclusive), adicione 1900 e retorne a soma.

- Para uma string que seja avaliada como 0, retorne 2000.

- Para o número 0, retorne 0.

- Para um valor `DATE`, `DATETIME` ou `TIMESTAMP`, retorne a parte `YEAR` do valor. Para um valor `TIME`, retorne o ano atual.

  Se você não especificar o tipo de um argumento `TIME`, poderá obter um resultado diferente do esperado, como mostrado aqui:

  ```
      mysql> SELECT CAST("11:35:00" AS YEAR), CAST(TIME "11:35:00" AS YEAR);
      +--------------------------+-------------------------------+
      | CAST("11:35:00" AS YEAR) | CAST(TIME "11:35:00" AS YEAR) |
      +--------------------------+-------------------------------+
      |                     2011 |                          2021 |
      +--------------------------+-------------------------------+
      ```

- Se o argumento for do tipo `DECIMAL` - `DECIMAL`, `NUMERIC`), `DOUBLE` - `FLOAT`, `DOUBLE`), `DECIMAL` - `DECIMAL`, `NUMERIC`), ou `REAL` - `FLOAT`, `DOUBLE`), arredonde o valor para o inteiro mais próximo, tente então converter o valor para `YEAR` usando as regras para valores inteiros, como mostrado aqui:

  ```
      mysql> SELECT CAST(1944.35 AS YEAR), CAST(1944.50 AS YEAR);
      +-----------------------+-----------------------+
      | CAST(1944.35 AS YEAR) | CAST(1944.50 AS YEAR) |
      +-----------------------+-----------------------+
      |                  1944 |                  1945 |
      +-----------------------+-----------------------+

      mysql> SELECT CAST(66.35 AS YEAR), CAST(66.50 AS YEAR);
      +---------------------+---------------------+
      | CAST(66.35 AS YEAR) | CAST(66.50 AS YEAR) |
      +---------------------+---------------------+
      |                2066 |                2067 |
      +---------------------+---------------------+
      ```

- Um argumento do tipo `GEOMETRY` não pode ser convertido para `YEAR`.

- Para um valor que não possa ser convertido com sucesso para `YEAR`, retorne `NULL`.

  Um valor de string contendo caracteres não numéricos que devem ser truncados antes da conversão gera uma mensagem de aviso, como mostrado aqui:

  ```
    mysql> SELECT CAST("1979aaa" AS YEAR);
    +-------------------------+
    | CAST("1979aaa" AS YEAR) |
    +-------------------------+
    |                    1979 |
    +-------------------------+
    1 row in set, 1 warning (0.00 sec)

    mysql> SHOW WARNINGS;
    +---------+------+-------------------------------------------+
    | Level   | Code | Message                                   |
    +---------+------+-------------------------------------------+
    | Warning | 1292 | Truncated incorrect YEAR value: '1979aaa' |
    +---------+------+-------------------------------------------+
    ```

O `InnoDB` permite o uso de uma palavra-chave adicional `ARRAY` para criar um índice de múltiplos valores em um array `JSON` como parte das instruções `CREATE INDEX`, `CREATE TABLE` e `ALTER TABLE`. O `ARRAY` não é suportado, exceto quando usado para criar um índice de múltiplos valores em uma dessas instruções, caso em que é obrigatório. A coluna que está sendo indexada deve ser um tipo de coluna `JSON`. Com o `ARRAY`, o *`type`* que segue a palavra-chave `AS` pode especificar qualquer um dos tipos suportados pelo `CAST()`, com exceções de `BINARY`, `JSON` e `YEAR`. Para informações de sintaxe e exemplos, bem como outras informações relevantes, consulte Índices de Múltiplos Valores.

Nota

`CONVERT()`, ao contrário de `CAST()`, *não* suporta a criação de índice de múltiplos valores ou a palavra-chave `ARRAY`.

`CAST()` suporta a recuperação de um valor `TIMESTAMP` como estando em UTC, usando o operador `AT TIMEZONE`. O único fuso horário suportado é UTC; isso pode ser especificado como `'+00:00'` ou `'UTC'`. O único tipo de retorno suportado por essa sintaxe é `DATETIME`, com um especificador opcional de precisão na faixa de 0 a 6, inclusive.

Valores `TIMESTAMP` que usam deslocamentos de fuso horário também são suportados.

```
  mysql> SELECT @@system_time_zone;
  +--------------------+
  | @@system_time_zone |
  +--------------------+
  | EDT                |
  +--------------------+
  1 row in set (0.00 sec)

  mysql> CREATE TABLE tz (c TIMESTAMP);
  Query OK, 0 rows affected (0.41 sec)

  mysql> INSERT INTO tz VALUES
      ->     ROW(CURRENT_TIMESTAMP),
      ->     ROW('2020-07-28 14:50:15+1:00');
  Query OK, 1 row affected (0.08 sec)

  mysql> TABLE tz;
  +---------------------+
  | c                   |
  +---------------------+
  | 2020-07-28 09:22:41 |
  | 2020-07-28 09:50:15 |
  +---------------------+
  2 rows in set (0.00 sec)

  mysql> SELECT CAST(c AT TIME ZONE '+00:00' AS DATETIME) AS u FROM tz;
  +---------------------+
  | u                   |
  +---------------------+
  | 2020-07-28 13:22:41 |
  | 2020-07-28 13:50:15 |
  +---------------------+
  2 rows in set (0.00 sec)

  mysql> SELECT CAST(c AT TIME ZONE 'UTC' AS DATETIME(2)) AS u FROM tz;
  +------------------------+
  | u                      |
  +------------------------+
  | 2020-07-28 13:22:41.00 |
  | 2020-07-28 13:50:15.00 |
  +------------------------+
  2 rows in set (0.00 sec)
  ```

Se você usar `'UTC'` como o especificador de fuso horário com essa forma de `CAST()`, e o servidor levantar um erro como `Unknown` ou `incorrect time zone: 'UTC'`, você pode precisar instalar as tabelas de fuso horário do MySQL (veja Populating the Time Zone Tables).

`AT TIME ZONE` não suporta a palavra-chave `ARRAY` e não é suportado pela função `CONVERT()`.

* `CONVERT(expr USING transcoding_name)`

  `CONVERT(expr,type)`

  `CONVERT(expr USING transcoding_name)` é a sintaxe padrão do SQL. A forma não `USING` do `CONVERT()` é a sintaxe ODBC. Independentemente da sintaxe usada, a função retorna `NULL` se *`expr`* for `NULL`.

`CONVERT(expr USING transcoding_name)` converte dados entre diferentes conjuntos de caracteres. No MySQL, os nomes de transcodificação são os mesmos que os nomes correspondentes dos conjuntos de caracteres. Por exemplo, esta instrução converte a string `'abc'` no conjunto de caracteres padrão para a string correspondente no conjunto de caracteres `utf8mb4`:

```
  SELECT CONVERT('abc' USING utf8mb4);
  ```

A sintaxe `CONVERT(expr, type)` (sem `USING`) recebe uma expressão e um valor de *`type`* que especifica um tipo de resultado e produz um valor de resultado do tipo especificado. Esta operação também pode ser expressa como `CAST(expr AS type)`, que é equivalente. Para mais informações, consulte a descrição de `CAST()`.

### Conversões de Conjuntos de Caracteres

`CONVERT()` com uma cláusula `USING` converte dados entre conjuntos de caracteres:

```
CONVERT(expr USING transcoding_name)
```

No MySQL, os nomes de transcodificação são os mesmos que os nomes correspondentes dos conjuntos de caracteres.

Exemplos:

```
SELECT CONVERT('test' USING utf8mb4);
SELECT CONVERT(_latin1'Müller' USING utf8mb4);
INSERT INTO utf8mb4_table (utf8mb4_column)
    SELECT CONVERT(latin1_column USING utf8mb4) FROM latin1_table;
```

Para converter strings entre conjuntos de caracteres, você também pode usar a sintaxe `CONVERT(expr, type)` (sem `USING`) ou `CAST(expr AS type)`, que é equivalente:

```
CONVERT(string, CHAR[(N)] CHARACTER SET charset_name)
CAST(string AS CHAR[(N)] CHARACTER SET charset_name)
```

Exemplos:

```
SELECT CONVERT('test', CHAR CHARACTER SET utf8mb4);
SELECT CAST('test' AS CHAR CHARACTER SET utf8mb4);
```

Se você especificar `CHARACTER SET charset_name` como mostrado, o conjunto de caracteres e a collation do resultado são `charset_name` e a collation padrão de `charset_name`. Se você omitir `CHARACTER SET charset_name`, o conjunto de caracteres e a collation do resultado são definidos pelas variáveis de sistema `character_set_connection` e `collation_connection` que determinam o conjunto de caracteres e a collation de conexão padrão (consulte a Seção 12.4, “Conexões de Conjuntos de Caracteres e Collations”).

Uma cláusula `COLLATE` não é permitida dentro de uma chamada `CONVERT()` ou `CAST()`, mas você pode aplicá-la ao resultado da função. Por exemplo, estes são legais:

```
SELECT CONVERT('test' USING utf8mb4) COLLATE utf8mb4_bin;
SELECT CONVERT('test', CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_bin;
SELECT CAST('test' AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_bin;
```

Mas estes são ilegais:

```
SELECT CONVERT('test' USING utf8mb4 COLLATE utf8mb4_bin);
SELECT CONVERT('test', CHAR CHARACTER SET utf8mb4 COLLATE utf8mb4_bin);
SELECT CAST('test' AS CHAR CHARACTER SET utf8mb4 COLLATE utf8mb4_bin);
```

Para literais de string, outra maneira de especificar o conjunto de caracteres é usar um introduzir de conjunto de caracteres. `_latin1` e `_latin2` no exemplo anterior são instâncias de introdutores. Ao contrário das funções de conversão, como `CAST()` ou `CONVERT()`, que convertem uma string de um conjunto de caracteres para outro, um introdutores designa uma literal de string como tendo um conjunto de caracteres particular, sem conversão envolvida. Para mais informações, consulte a Seção 12.3.8, “Introdutores de Conjunto de Caracteres”.

### Conversões de Conjunto de Caracteres para Comparação de Strings

Normalmente, você não pode comparar um valor `BLOB` ou outra string binária de forma case-insensitive porque strings binárias usam o conjunto de caracteres `binary`, que não tem uma ordenação com o conceito de maiúsculas e minúsculas. Para realizar uma comparação case-insensitive, primeiro use a função `CONVERT()` ou `CAST()` para converter o valor para uma string não binária. As comparações da string resultante usam sua ordenação. Por exemplo, se a ordenação do resultado da conversão não for case-sensitive, uma operação `LIKE` não é case-insensitive. Isso é verdade para a operação seguinte porque a ordenação padrão `utf8mb4` (`utf8mb4_0900_ai_ci`) não é case-sensitive:

```
SELECT 'A' LIKE CONVERT(blob_col USING utf8mb4)
  FROM tbl_name;
```

Para especificar uma ordenação particular para a string convertida, use uma cláusula `COLLATE` após a chamada `CONVERT()`:

```
SELECT 'A' LIKE CONVERT(blob_col USING utf8mb4) COLLATE utf8mb4_unicode_ci
  FROM tbl_name;
```

Para usar um conjunto de caracteres diferente, substitua seu nome por `utf8mb4` nas declarações anteriores (e de forma semelhante para usar uma ordenação diferente).

`CONVERT()` e `CAST()` podem ser usados de forma mais geral para comparar strings representadas em diferentes conjuntos de caracteres. Por exemplo, uma comparação dessas strings resulta em um erro porque elas têm conjuntos de caracteres diferentes:

```
mysql> SET @s1 = _latin1 'abc', @s2 = _latin2 'abc';
mysql> SELECT @s1 = @s2;
ERROR 1267 (HY000): Illegal mix of collations (latin1_swedish_ci,IMPLICIT)
and (latin2_general_ci,IMPLICIT) for operation '='
```W4a2WoGdrk```
mysql> SELECT @s1 = CONVERT(@s2 USING latin1);
+---------------------------------+
| @s1 = CONVERT(@s2 USING latin1) |
+---------------------------------+
|                               1 |
+---------------------------------+
```DBCXisR9rq```
mysql> SET @str = BINARY 'New York';
mysql> SELECT LOWER(@str), LOWER(CONVERT(@str USING utf8mb4));
+-------------+------------------------------------+
| LOWER(@str) | LOWER(CONVERT(@str USING utf8mb4)) |
+-------------+------------------------------------+
| New York    | new york                           |
+-------------+------------------------------------+
```FFcYI4mGJT```
mysql> CREATE TABLE new_table SELECT CAST('2000-01-01' AS DATE) AS c1;
mysql> SHOW CREATE TABLE new_table\G
*************************** 1. row ***************************
       Table: new_table
Create Table: CREATE TABLE `new_table` (
  `c1` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```owphfSvuRD```
SELECT enum_col FROM tbl_name
  ORDER BY CAST(enum_col AS CHAR);
```3Ofya9iciJ```
mysql> SELECT 1+'1';
       -> 2
```SILdHoEgyd```
mysql> SELECT X'41', X'41'+0;
        -> 'A', 65
mysql> SELECT b'1100001', b'1100001'+0;
        -> 'a', 97
```rFY2If287A```
mysql> SELECT CONCAT('hello you ',2);
        -> 'hello you 2'
```kgknaBALky```
mysql> SELECT 1 - 2;
        -> -1
mysql> SELECT CAST(1 - 2 AS UNSIGNED);
        -> 18446744073709551615
mysql> SELECT CAST(CAST(1 - 2 AS UNSIGNED) AS SIGNED);
        -> -1
```oxwQ2xolmK```

O modo SQL afeta o resultado das operações de conversão (consulte a Seção 7.1.11, “Modos SQL do Servidor”). Exemplos:

* Para a conversão de uma string de data “zero” para uma data, `CONVERT()` e `CAST()` retornam `NULL` e produzem uma mensagem de aviso quando o modo SQL `NO_ZERO_DATE` está habilitado.

* Para a subtração de inteiros, se o modo SQL `NO_UNSIGNED_SUBTRACTION` está habilitado, o resultado da subtração é assinado, mesmo que qualquer operando seja não assinado.