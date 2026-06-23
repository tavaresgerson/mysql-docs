## 14.10 Funções e operadores de cast

**Tabela 14.15 Funções e operadores de cast**

<table frame="box" rules="all" summary="A reference that lists cast functions and operators."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Name</th> <th>Description</th> <th>Deprecated</th> </tr></thead><tbody><tr><th scope="row"><code>BINARY</code></th> <td>Arremessar uma cadeia para uma cadeia binária</td> <td>8.0.27</td> </tr><tr><th scope="row"><code>CAST()</code></th> <td>Atribua um valor a um determinado tipo</td> <td></td> </tr><tr><th scope="row"><code>CONVERT()</code></th> <td>Atribua um valor a um determinado tipo</td> <td></td> </tr></tbody></table>

As funções e operadores de cast permitem a conversão de valores de um tipo de dados para outro.

* Descrições das funções e operadores de cast
* Conversões de conjuntos de caracteres
* Conversões de conjuntos de caracteres para comparações de strings
* Operações de cast em tipos espaciais
* Outros usos das operações de cast

### Descrições das funções e operadores de elenco

* `BINARY` *`expr`*

O operador `BINARY` converte a expressão em uma string binária (uma string que tem o conjunto de caracteres `binary` e a ordenação `binary`). Um uso comum do `BINARY` é forçar uma comparação de string de caracteres a ser feita byte por byte, usando valores numéricos de byte em vez de caracteres por caracteres. O operador `BINARY` também faz com que os espaços finais nas comparações sejam significativos. Para informações sobre as diferenças entre a ordenação `binary` do conjunto de caracteres `binary` e as ordenações `_bin` dos conjuntos de caracteres não binários, consulte a Seção 12.8.5, “A ordenação binária comparada às ordenações _bin”.

O operador `BINARY` é descontinuado a partir do MySQL 8.0.27, e você deve esperar sua remoção em uma versão futura do MySQL. Use `CAST(... AS BINARY)` (cast-functions.html#function_cast) em vez disso.

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

Em uma comparação, `BINARY` afeta toda a operação; ele pode ser dado antes de qualquer dos operandos com o mesmo resultado.

Para converter uma expressão de cadeia em uma cadeia binária, esses construtos são equivalentes:

  ```
  CONVERT(expr USING BINARY)
  CAST(expr AS BINARY)
  BINARY expr
  ```

Se um valor for uma literal de string, ele pode ser designado como uma string binária sem a necessidade de conversão, utilizando o conjunto de caracteres `_binary` introduzido:

  ```
  mysql> SELECT 'a' = 'A';
          -> 1
  mysql> SELECT _binary 'a' = 'A';
          -> 0
  ```

Para informações sobre introdutores, consulte a Seção 12.3.8, “Introdutores de Conjunto de Caracteres”.

O operador `BINARY` em expressões difere em efeito do atributo `BINARY` em definições de colunas de caracteres. Para uma coluna de caracteres definida com o atributo `BINARY`, o MySQL atribui o conjunto de caracteres padrão da tabela e a ordenação binária (`_bin`) desse conjunto de caracteres. Cada conjunto de caracteres não binário tem uma ordenação `_bin`. Por exemplo, se o conjunto de caracteres padrão da tabela é `utf8mb4`, essas duas definições de coluna são equivalentes:

  ```
  CHAR(10) BINARY
  CHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
  ```

O uso de `CHARACTER SET binary` na definição de uma coluna `CHAR`, `VARCHAR` ou `TEXT` faz com que a coluna seja tratada como o tipo de dados correspondente de cadeia binária. Por exemplo, os seguintes pares de definições são equivalentes:

  ```
  CHAR(10) CHARACTER SET binary
  BINARY(10)

  VARCHAR(10) CHARACTER SET binary
  VARBINARY(10)

  TEXT CHARACTER SET binary
  BLOB
  ```

Se `BINARY` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando MySQL”.

* `CAST(expr AS type [ARRAY])`(cast-functions.html#function_cast)

  [`CAST(timestamp_value AT TIME ZONE timezone_specifier AS DATETIME[(precision)])`](cast-functions.html#function_cast)

*`timezone_specifier`*: [INTERVAL] '+00:00' | 'UTC'

Com a sintaxe `CAST(expr AS type`(cast-functions.html#function_cast), a função `CAST()` recebe uma expressão de qualquer tipo e produz um valor de resultado do tipo especificado. Essa operação também pode ser expressa como `CONVERT(expr, type)`(cast-functions.html#function_convert), que é equivalente. Se *`expr`* é `NULL`, `CAST()` retorna `NULL`.

Estes valores *`type` são permitidos:

+ `BINARY[(N)]`

Produz uma string com o tipo de dados `VARBINARY`, exceto que, quando a expressão *`expr`* é vazia (com comprimento zero), o tipo de resultado é `BINARY(0)`. Se a comprimento opcional *`N`* for fornecido, `BINARY(N)` faz com que o cast use no máximo *`N`* bytes do argumento. Valores mais curtos que *`N`* bytes são preenchidos com `0x00` bytes até um comprimento de *`N`*. Se o comprimento opcional *`N`* não for fornecido, o MySQL calcula o comprimento máximo a partir da expressão. Se o comprimento fornecido ou calculado for maior que um limite interno, o tipo de resultado é `BLOB`. Se o comprimento ainda for muito longo, o tipo de resultado é `LONGBLOB`.

Para uma descrição de como a projeção para `BINARY` afeta as comparações, consulte a Seção 13.3.3, “Os tipos BINARY e VARBINARY”.

+ `CHAR[(N)] [charset_info]`

Produz uma string com o tipo de dados `VARCHAR`, a menos que a expressão *`expr`* esteja vazia (com comprimento zero), no qual caso, o tipo de resultado é `CHAR(0)`. Se a comprimento opcional *`N`* for fornecido, `CHAR(N)` faz com que o cast use no máximo *`N`* caracteres do argumento. Não ocorre preenchimento para valores com menos de *`N`* caracteres. Se o comprimento opcional *`N`* não for fornecido, o MySQL calcula o comprimento máximo a partir da expressão. Se o comprimento fornecido ou calculado for maior que um limite interno, o tipo de resultado é `TEXT`. Se o comprimento ainda for muito longo, o tipo de resultado é `LONGTEXT`.

Sem a cláusula *`charset_info`*, o `CHAR` produz uma string com o conjunto de caracteres padrão. Para especificar explicitamente o conjunto de caracteres, esses valores *`charset_info`* são permitidos:

- `CHARACTER SET charset_name`: Gera uma string com o conjunto de caracteres fornecido.

- `ASCII`: Abreviação de `CHARACTER SET latin1`.

- `UNICODE`: Abreviação de `CHARACTER SET ucs2`.

Em todos os casos, a cadeia tem o conjunto de caracteres de collation padrão.

+ `DATE`

Produz um valor de `DATE`.

+ `DATETIME[(M)]`

Produz um valor de `DATETIME`. Se o valor opcional *`M`* for fornecido, ele especifica a precisão de segundos fracionários.

+ `DECIMAL[(M[,D])]`

Produz um valor `DECIMAL` - DECIMAL, NUMERIC"). Se os valores opcionais *`M`* e *`D`* forem fornecidos, eles especificam o número máximo de dígitos (a precisão) e o número de dígitos após o ponto decimal (a escala). Se *`D`* for omitido, 0 é assumido. Se *`M`* for omitido, 10 é assumido.

+ `DOUBLE`

Produz um resultado `DOUBLE` - FLOAT, DOUBLE") adicionado no MySQL 8.0.17.

+ `FLOAT[(p)]`

Se a precisão *`p`* não for especificada, produz um resultado do tipo `FLOAT` - FLOAT, DOUBLE"). Se *`p`* for fornecido e 0 <= < *[[PH_ICD_121]]* <= 24, the result is of type [[PH_ICD_122]]. If 25 <= *[[PH_ICD_123]]* <= 53, the result is of type [[PH_ICD_124]] - FLOAT, DOUBLE"). If *[[PH_ICD_125]]* < 0 or *[[PH_ICD_126]]* > 53, um erro é retornado. Adicionado no MySQL 8.0.17.

+ `JSON`

Produz um valor `JSON`. Para obter detalhes sobre as regras de conversão de valores entre `JSON` e outros tipos, consulte a comparação e ordenação de valores JSON.

+ `NCHAR[(N)]`

Como `CHAR`, mas produz uma string com o conjunto de caracteres nacional. Veja a Seção 12.3.7, “O Conjunto de Caracteres Nacional”.

Ao contrário de `CHAR`, `NCHAR` não permite que informações sobre o conjunto de caracteres finais sejam especificadas.

+ `REAL`

Produz um resultado do tipo `REAL` - FLOAT, DOUBLE"). Este é, na verdade, `FLOAT` se o modo SQL `REAL_AS_FLOAT` estiver habilitado; caso contrário, o resultado é do tipo `DOUBLE`.

+ `SIGNED [INTEGER]`

Produz um valor assinado `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

+ *`spatial_type`*

A partir do MySQL 8.0.24, `CAST()` e `CONVERT()` suportam a conversão de valores de geometria de um tipo espacial para outro, para certas combinações de tipos espaciais. Para obter detalhes, consulte Operações de Castagem em Tipos Espaciais.

+ `TIME[(M)]`

Produz um valor de `TIME`. Se o valor opcional *`M`* for fornecido, ele especifica a precisão de segundos fracionários.

+ `UNSIGNED [INTEGER]`

Produz um valor `BIGINT` não assinado - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

+ `YEAR`

Produz um valor `YEAR`. Adicionado no MySQL 8.0.22. Essas regras regem a conversão para `YEAR`:

- Para um número de quatro dígitos na faixa de 1901-2155 inclusive, ou para uma cadeia que pode ser interpretada como um número de quatro dígitos nesta faixa, retorne o valor correspondente ao `YEAR`.

- Para um número composto por um ou dois dígitos, ou para uma cadeia que possa ser interpretada como tal número, retorne um valor `YEAR` conforme a seguir:

* Se o número estiver na faixa de 1 a 69 inclusive, adicione 2000 e retorne a soma.

* Se o número estiver na faixa de 70 a 99 inclusive, adicione 1900 e retorne a soma.

- Para uma string que avalie como 0, retorne 2000.
- Para o número 0, retorne 0.
- Para um valor de `DATE`, `DATETIME` ou `TIMESTAMP`, retorne a parte `YEAR` do valor. Para um valor de `TIME`, retorne o ano atual.

Se você não especificar o tipo de argumento `TIME`, pode obter um resultado diferente do que você espera, como mostrado aqui:

      ```
      mysql> SELECT CAST("11:35:00" AS YEAR), CAST(TIME "11:35:00" AS YEAR);
      +--------------------------+-------------------------------+
      | CAST("11:35:00" AS YEAR) | CAST(TIME "11:35:00" AS YEAR) |
      +--------------------------+-------------------------------+
      |                     2011 |                          2021 |
      +--------------------------+-------------------------------+
      ```

- Se o argumento for do tipo `DECIMAL` - DECIMAL, NUMERIC"), `DOUBLE` - FLOAT, DOUBLE"), `DECIMAL` - DECIMAL, NUMERIC"), ou `REAL` - FLOAT, DOUBLE"), arredonde o valor para o número inteiro mais próximo, e então tente converter o valor para `YEAR` usando as regras para valores inteiros, conforme mostrado aqui:

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

- Para um valor que não pode ser convertido com sucesso para `YEAR`, retorne `NULL`.

Um valor de cadeia que contém caracteres não numéricos e que deve ser truncado antes da conversão gera um aviso, conforme mostrado aqui:

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

Em MySQL 8.0.17 e superior, `InnoDB` permite o uso de uma palavra-chave adicional `ARRAY` para criar um índice de múltiplos valores em um `JSON` matriz como parte das declarações [`CREATE INDEX`](create-index.html "15.1.15 CREATE INDEX Statement"), [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement"), e [`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement"). `ARRAY` não é suportado, exceto quando usado para criar um índice de múltiplos valores em uma dessas declarações, no qual caso é necessário. A coluna que está sendo indexada deve ser uma coluna do tipo `JSON`. Com `ARRAY`, o *`type`* após a palavra-chave `AS` pode especificar qualquer um dos tipos suportados por `CAST()`, com exceções de `BINARY`, `JSON`, e `YEAR`. Para informações de sintaxe e exemplos, bem como outras informações relevantes, consulte Índices de Múltiplos Valores.

Nota

`CONVERT()`, ao contrário de `CAST()`, *não* suporta a criação de índice de múltiplos valores ou a palavra-chave `ARRAY`.

Começando com o MySQL 8.0.22, `CAST()` suporta a recuperação de um valor `TIMESTAMP` como estando em UTC, usando o operador `AT TIMEZONE`. O único fuso horário suportado é UTC; isso pode ser especificado como qualquer um dos `'+00:00'` ou `'UTC'`. O único tipo de retorno suportado por essa sintaxe é `DATETIME`, com um especificador de precisão opcional na faixa de 0 a 6, inclusive.

Os valores `TIMESTAMP` que utilizam deslocamentos de fuso horário também são suportados.

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

Se você usar `'UTC'` como especificador de fuso horário com esta forma de `CAST()`, e o servidor levantar um erro como Fuso horário desconhecido ou incorreto: 'UTC', você pode precisar instalar as tabelas de fuso horário do MySQL (veja Populando as tabelas de fuso horário).

`AT TIME ZONE` não suporta a palavra-chave `ARRAY`, e não é suportada pela função `CONVERT()`.

* `CONVERT(expr USING transcoding_name)`(cast-functions.html#function_convert)

  `CONVERT(expr,type)`

`CONVERT(expr USING transcoding_name)` é sintaxe SQL padrão. A forma não `USING` de `CONVERT()` é sintaxe ODBC. Independentemente da sintaxe utilizada, a função retorna `NULL` se *`expr`* é `NULL`.

`CONVERT(expr USING transcoding_name)`](cast-functions.html#function_convert) converte dados entre diferentes conjuntos de caracteres. No MySQL, as transcodificações de nomes são as mesmas que os nomes correspondentes dos conjuntos de caracteres. Por exemplo, esta declaração converte a string `'abc'` no conjunto de caracteres padrão para a string correspondente no conjunto de caracteres `utf8mb4`:

  ```
  SELECT CONVERT('abc' USING utf8mb4);
  ```

A sintaxe `CONVERT(expr, type)`(cast-functions.html#function_convert) (sem `USING`) recebe uma expressão e um valor *`type`*, especificando um tipo de resultado, e produz um valor de resultado do tipo especificado. Essa operação também pode ser expressa como [`CAST(expr AS type)`](cast-functions.html#function_cast), que é equivalente. Para mais informações, consulte a descrição de `CAST()`.

Nota

Antes do MySQL 8.0.28, essa função, às vezes, permitia conversões inválidas de valores de `BINARY` para um conjunto de caracteres não binário. Quando `CONVERT()` era usado como parte da expressão para uma coluna gerada indexada, isso poderia levar à corrupção do índice após uma atualização a partir de uma versão anterior do MySQL. Consulte Mudanças no SQL, para obter informações sobre como lidar com essa situação.

### Conversões de Conjunto de Caracteres

`CONVERT()` com uma cláusula `USING` converte dados entre conjuntos de caracteres:

```
CONVERT(expr USING transcoding_name)
```

Em MySQL, os nomes de transcodificação são os mesmos dos nomes dos conjuntos de caracteres correspondentes.

Exemplos:

```
SELECT CONVERT('test' USING utf8mb4);
SELECT CONVERT(_latin1'Müller' USING utf8mb4);
INSERT INTO utf8mb4_table (utf8mb4_column)
    SELECT CONVERT(latin1_column USING utf8mb4) FROM latin1_table;
```

Para converter cadeias entre conjuntos de caracteres, você também pode usar a sintaxe `CONVERT(expr, type)`(cast-functions.html#function_convert) (sem `USING`), ou [`CAST(expr AS type)`(cast-functions.html#function_cast), que é equivalente:

```
CONVERT(string, CHAR[(N)] CHARACTER SET charset_name)
CAST(string AS CHAR[(N)] CHARACTER SET charset_name)
```

Exemplos:

```
SELECT CONVERT('test', CHAR CHARACTER SET utf8mb4);
SELECT CAST('test' AS CHAR CHARACTER SET utf8mb4);
```

Se você especificar `CHARACTER SET charset_name` como mostrado acima, o conjunto de caracteres e a correção do resultado são *`charset_name`* e a correção padrão de *`charset_name`*. Se você omitir `CHARACTER SET charset_name`, o conjunto de caracteres e a correção do resultado são definidos pelas variáveis de sistema `character_set_connection` e `collation_connection` que determinam o conjunto de caracteres e a correção padrão da conexão (consulte Seção 12.4, “Conjunto de caracteres e correções de conexão”).

Uma cláusula `COLLATE` não é permitida dentro de uma chamada `CONVERT()` ou `CAST()`, mas você pode aplicá-la ao resultado da função. Por exemplo, estas são legais:

```
SELECT CONVERT('test' USING utf8mb4) COLLATE utf8mb4_bin;
SELECT CONVERT('test', CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_bin;
SELECT CAST('test' AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_bin;
```

Mas essas são ilegais:

```
SELECT CONVERT('test' USING utf8mb4 COLLATE utf8mb4_bin);
SELECT CONVERT('test', CHAR CHARACTER SET utf8mb4 COLLATE utf8mb4_bin);
SELECT CAST('test' AS CHAR CHARACTER SET utf8mb4 COLLATE utf8mb4_bin);
```

Para as literais de cadeia, outra maneira de especificar o conjunto de caracteres é usar um introduzir de conjunto de caracteres. `_latin1` e `_latin2` no exemplo anterior são exemplos de introdutores. Ao contrário das funções de conversão, como `CAST()`, ou `CONVERT()`, que convertem uma cadeia de caracteres de um conjunto de caracteres para outro, um introduzir designa uma literal de cadeia como tendo um conjunto de caracteres particular, sem conversão envolvida. Para mais informações, consulte a Seção 12.3.8, “Introdutores de Conjunto de Caracteres”.

### Conversões de Conjunto de Caracteres para Comparação de String

Normalmente, você não pode comparar um valor `BLOB` ou outra string binária de forma sensível ao caso, porque as strings binárias usam o conjunto de caracteres `binary`, que não tem nenhuma ordenação com o conceito de maiúsculas e minúsculas. Para realizar uma comparação sensível ao caso, primeiro use a função `CONVERT()` ou `CAST()` para converter o valor em uma string não binária. As comparações da string resultante usam sua ordenação. Por exemplo, se a ordenação do resultado da conversão não for sensível ao caso, uma operação `LIKE` não é sensível ao caso. Isso é verdade para a operação seguinte porque a ordenação padrão `utf8mb4` (`utf8mb4_0900_ai_ci`) não é sensível ao caso:

```
SELECT 'A' LIKE CONVERT(blob_col USING utf8mb4)
  FROM tbl_name;
```

Para especificar uma collation particular para a string convertida, use uma cláusula `COLLATE` após a chamada `CONVERT()`:

```
SELECT 'A' LIKE CONVERT(blob_col USING utf8mb4) COLLATE utf8mb4_unicode_ci
  FROM tbl_name;
```

Para usar um conjunto de caracteres diferente, substitua seu nome por `utf8mb4` nas declarações anteriores (e, de forma semelhante, para usar uma codificação diferente).

`CONVERT()` e `CAST()` podem ser usados de forma mais geral para comparar strings representadas em diferentes conjuntos de caracteres. Por exemplo, uma comparação dessas strings resulta em um erro porque elas têm conjuntos de caracteres diferentes:

```
mysql> SET @s1 = _latin1 'abc', @s2 = _latin2 'abc';
mysql> SELECT @s1 = @s2;
ERROR 1267 (HY000): Illegal mix of collations (latin1_swedish_ci,IMPLICIT)
and (latin2_general_ci,IMPLICIT) for operation '='
```

Converter uma das cadeias em um conjunto de caracteres compatível com o outro permite que a comparação ocorra sem erros:

```
mysql> SELECT @s1 = CONVERT(@s2 USING latin1);
+---------------------------------+
| @s1 = CONVERT(@s2 USING latin1) |
+---------------------------------+
|                               1 |
+---------------------------------+
```

A conversão do conjunto de caracteres também é útil antes da conversão de maiúsculas e minúsculas de cadeias binárias. `LOWER()` e `UPPER()` são ineficazes quando aplicados diretamente a cadeias binárias, porque o conceito de maiúsculas e minúsculas não se aplica. Para realizar a conversão de maiúsculas e minúsculas de uma cadeia binária, primeiro converta-a em uma cadeia não binária usando um conjunto de caracteres apropriado para os dados armazenados na cadeia:

```
mysql> SET @str = BINARY 'New York';
mysql> SELECT LOWER(@str), LOWER(CONVERT(@str USING utf8mb4));
+-------------+------------------------------------+
| LOWER(@str) | LOWER(CONVERT(@str USING utf8mb4)) |
+-------------+------------------------------------+
| New York    | new york                           |
+-------------+------------------------------------+
```

Tenha em atenção que, se aplicar `BINARY`, `CAST()` ou `CONVERT()` a uma coluna indexada, o MySQL pode não conseguir utilizar o índice de forma eficiente.

### Operações de Cast em Tipos Espaciais

A partir do MySQL 8.0.24, `CAST()` e `CONVERT()` suportam a conversão de valores de geometria de um tipo espacial para outro, para certas combinações de tipos espaciais. A lista a seguir mostra as combinações de tipos permitidas, onde “extensão MySQL” designa conversões implementadas no MySQL além das definidas no padrão [SQL/MM](spatial-types.html "13.4 Spatial Data Types"):

* De `Point` para:

+ `MultiPoint`
  + `GeometryCollection` * De `LineString` para:

+ `Polygon` (extensão MySQL)
  + `MultiPoint` (extensão MySQL)
  + `MultiLineString`
  + `GeometryCollection`
* De `Polygon` para:

+ `LineString` (extensão MySQL)
  + `MultiLineString` (extensão MySQL)
  + `MultiPolygon`
  + `GeometryCollection`
* De `MultiPoint` até:

+ `Point`
  + `LineString` (extensão MySQL)
  + `GeometryCollection`
* De `MultiLineString` para:

+ `LineString`
  + `Polygon` (extensão MySQL)
  + `MultiPolygon` (extensão MySQL)
  + `GeometryCollection`
* De `MultiPolygon` para:

+ `Polygon`
  + `MultiLineString` (extensão MySQL)
  + `GeometryCollection`
* De `GeometryCollection` para:

+ `Point`
+ `LineString`
+ `Polygon`
+ `MultiPoint`
+ `MultiLineString`
+ `MultiPolygon`

Nos moldes espaciais, `GeometryCollection` e `GeomCollection` são sinônimos do mesmo tipo de resultado.

Algumas condições se aplicam a todos os tipos de tipos espaciais, e algumas condições se aplicam apenas quando o resultado do cast deve ter um tipo espacial específico. Para informações sobre termos como “geometria bem formada”, consulte a Seção 13.4.4, “Bem-formação e validade da geometria”.

* Condições Gerais para Casts Espaciais
* Condições para Casts a Ponto
* Condições para Casts a Linha de String
* Condições para Casts a Poligono
* Condições para Casts a MultiPonto
* Condições para Casts a MultiLinha de String
* Condições para Casts a MultiPoligono
* Condições para Casts a Coleção de Geometria

#### Condições Gerais para Esportes de Lançamento Espacial

Essas condições se aplicam a todos os moldes espaciais, independentemente do tipo de resultado:

* O resultado de um cast está no mesmo SRS que o da expressão de cast.

* O casting entre tipos espaciais não altera os valores de coordenadas ou a ordem.

* Se a expressão para o lançamento for `NULL`, o resultado da função é `NULL`.

* O lançamento para tipos espaciais usando a função `JSON_VALUE()` com uma cláusula `RETURNING` que especifica um tipo espacial não é permitido.

* O lançamento em um `ARRAY` de tipos espaciais não é permitido.

* Se a combinação de tipo espacial for permitida, mas a expressão a ser lançada não for uma geometria sintaticamente bem formada, ocorre um erro `ER_GIS_INVALID_DATA`.

* Se a combinação de tipo espacial for permitida, mas a expressão a ser lançada for uma geometria sintaticamente bem formada em um sistema de referência espacial não definido (SRS), ocorre um erro `ER_SRS_NOT_FOUND`.

* Se a expressão para lançar tiver um SRS geográfico, mas tiver uma longitude ou latitude fora do intervalo, ocorre um erro:

+ Se um valor de longitude não estiver no intervalo (−180, 180], ocorre um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE`.

+ Se um valor de latitude não estiver na faixa de [−90, 90], ocorre um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE`.

As faixas mostradas são em graus. Se um SRS usa outra unidade, a faixa usa os valores correspondentes em sua unidade. Os limites exatos da faixa diferem ligeiramente devido à aritmética de ponto flutuante.

#### Condições para os Pontos de Casts

Quando o tipo de resultado do elenco é `Point`, essas condições se aplicam:

* Se a expressão para o lançamento for uma geometria bem formada do tipo `Point`, o resultado da função é que é `Point`.

* Se a expressão para o lançamento for uma geometria bem formada do tipo `MultiPoint` contendo um único `Point`, o resultado da função é que `Point`. Se a expressão contiver mais de um `Point`, ocorre um erro `ER_INVALID_CAST_TO_GEOMETRY`.

* Se a expressão para o lançamento for uma geometria bem formada do tipo `GeometryCollection` contendo apenas um único `Point`, o resultado da função é que `Point`. Se a expressão estiver vazia, contiver mais de um `Point` ou contiver outros tipos de geometria, ocorrerá um erro `ER_INVALID_CAST_TO_GEOMETRY`.

* Se a expressão para a projeção for uma geometria bem formada de outro tipo que não `Point`, `MultiPoint`, `GeometryCollection`, ocorre um erro de `ER_INVALID_CAST_TO_GEOMETRY`.

#### Condições para Casts em LineString

Quando o tipo de resultado do elenco é `LineString`, essas condições se aplicam:

* Se a expressão para o lançamento for uma geometria bem formada do tipo `LineString`, o resultado da função é que é `LineString`.

* Se a expressão para o lançamento for uma geometria bem formada do tipo `Polygon` que não possui anéis internos, o resultado da função é um `LineString` contendo os pontos do anel externo na mesma ordem. Se a expressão tiver anéis internos, ocorre um erro `ER_INVALID_CAST_TO_GEOMETRY`.

* Se a expressão para o lançamento for uma geometria bem formada do tipo `MultiPoint` contendo pelo menos dois pontos, o resultado da função é um `LineString` contendo os pontos do `MultiPoint` na ordem em que aparecem na expressão. Se a expressão contiver apenas um `Point`, ocorre um erro `ER_INVALID_CAST_TO_GEOMETRY`.

* Se a expressão para o lançamento for uma geometria bem formada do tipo `MultiLineString` contendo um único `LineString`, o resultado da função é que `LineString`. Se a expressão contiver mais de um `LineString`, ocorre um erro `ER_INVALID_CAST_TO_GEOMETRY`.

* Se a expressão para o lançamento for uma geometria bem formada do tipo `GeometryCollection`, contendo apenas um único `LineString`, o resultado da função é que `LineString`. Se a expressão estiver vazia, contiver mais de um `LineString` ou contiver outros tipos de geometria, ocorrerá um erro `ER_INVALID_CAST_TO_GEOMETRY`.

* Se a expressão para o lançamento for uma geometria bem formada de outro tipo que não `LineString`, `Polygon`, `MultiPoint`, `MultiLineString` ou `GeometryCollection`, ocorre um erro de `ER_INVALID_CAST_TO_GEOMETRY`.

#### Condições para Casts em Polygon

Quando o tipo de resultado do elenco é `Polygon`, essas condições se aplicam:

* Se a expressão para o lançamento for uma geometria bem formada do tipo `LineString` que é um anel (ou seja, os pontos de início e fim são os mesmos), o resultado da função é um `Polygon` com um anel externo composto pelos pontos do `LineString` na mesma ordem. Se a expressão não for um anel, ocorre um erro `ER_INVALID_CAST_TO_GEOMETRY`. Se o anel não estiver na ordem correta (o anel externo deve ser no sentido anti-horário), ocorre um erro `ER_INVALID_CAST_POLYGON_RING_DIRECTION`.

* Se a expressão para o lançamento for uma geometria bem formada do tipo `Polygon`, o resultado da função é que é `Polygon`.

* Se a expressão a ser projetada for uma geometria bem formada do tipo `MultiLineString` onde todos os elementos são anéis, o resultado da função é um `Polygon` com o primeiro `LineString` como anel externo e quaisquer valores adicionais de `LineString` como anéis internos. Se qualquer elemento da expressão não for um anel, ocorre um erro de `ER_INVALID_CAST_TO_GEOMETRY`. Se qualquer anel não estiver na ordem correta (o anel externo deve ser no sentido anti-horário, os anéis internos devem ser no sentido horário), ocorre um erro de `ER_INVALID_CAST_POLYGON_RING_DIRECTION`.

* Se a expressão para lançar for uma geometria bem formada do tipo `MultiPolygon` contendo um único `Polygon`, o resultado da função é que `Polygon`. Se a expressão contiver mais de um `Polygon`, ocorre um erro `ER_INVALID_CAST_TO_GEOMETRY`.

* Se a expressão para o lançamento for uma geometria bem formada do tipo `GeometryCollection` contendo apenas um único `Polygon`, o resultado da função é que `Polygon`. Se a expressão estiver vazia, contiver mais de um `Polygon` ou contiver outros tipos de geometria, ocorrerá um erro `ER_INVALID_CAST_TO_GEOMETRY`.

* Se a expressão para o lançamento for uma geometria bem formada de outro tipo que não `LineString`, `Polygon`, `MultiLineString`, `MultiPolygon` ou `GeometryCollection`, ocorre um erro de `ER_INVALID_CAST_TO_GEOMETRY`.

#### Condições para os Casts no MultiPoint

Quando o tipo de resultado do elenco é `MultiPoint`, essas condições se aplicam:

* Se a expressão para a projeção for uma geometria bem formada do tipo `Point`, o resultado da função é um `MultiPoint` contendo esse `Point` como seu único elemento.

* Se a expressão para a projeção for uma geometria bem formada do tipo `LineString`, o resultado da função é um `MultiPoint` contendo os pontos do `LineString` na mesma ordem.

* Se a expressão para o lançamento for uma geometria bem formada do tipo `MultiPoint`, o resultado da função é que é `MultiPoint`.

* Se a expressão para projetar for uma geometria bem formada do tipo `GeometryCollection` contendo apenas pontos, o resultado da função é um `MultiPoint` contendo esses pontos. Se o `GeometryCollection` estiver vazio ou contiver outros tipos de geometria, ocorre um erro `ER_INVALID_CAST_TO_GEOMETRY`.

* Se a expressão para o lançamento for uma geometria bem formada de outro tipo que não `Point`, `LineString`, `MultiPoint` ou `GeometryCollection`, ocorre um erro de `ER_INVALID_CAST_TO_GEOMETRY`.

#### Condições para Casts em MultiLineString

Quando o tipo de resultado do elenco é `MultiLineString`, essas condições se aplicam:

* Se a expressão para o lançamento for uma geometria bem formada do tipo `LineString`, o resultado da função é um `MultiLineString` contendo esse `LineString` como seu único elemento.

* Se a expressão para a projeção for uma geometria bem formada do tipo `Polygon`, o resultado da função é um `MultiLineString` que contém o anel externo do `Polygon` como seu primeiro elemento e quaisquer anéis internos como elementos adicionais na ordem em que aparecem na expressão.

* Se a expressão para o lançamento for uma geometria bem formada do tipo `MultiLineString`, o resultado da função é que é `MultiLineString`.

* Se a expressão para o lançamento for uma geometria bem formada do tipo `MultiPolygon` contendo apenas polígonos sem anéis internos, o resultado da função é um `MultiLineString` contendo os anéis poligonais na ordem em que aparecem na expressão. Se a expressão contiver polígonos com anéis internos, ocorre um erro `ER_WRONG_PARAMETERS_TO_STORED_FCT`.

* Se a expressão para a projeção for uma geometria bem formada do tipo `GeometryCollection` contendo apenas linhastrings, o resultado da função é um `MultiLineString` contendo essas linhastrings. Se a expressão estiver vazia ou contiver outros tipos de geometria, ocorre um erro `ER_INVALID_CAST_TO_GEOMETRY`.

* Se a expressão para o lançamento for uma geometria bem formada de outro tipo que não `LineString`, `Polygon`, `MultiLineString`, `MultiPolygon` ou `GeometryCollection`, ocorre um erro de `ER_INVALID_CAST_TO_GEOMETRY`.

#### Condições para Casts em MultiPolygon

Quando o tipo de resultado do elenco é `MultiPolygon`, essas condições se aplicam:

* Se a expressão para a projeção for uma geometria bem formada do tipo `Polygon`, o resultado da função é um `MultiPolygon` contendo o `Polygon` como seu único elemento.

* Se a expressão a ser projetada for uma geometria bem formada do tipo `MultiLineString` onde todos os elementos são anéis, o resultado da função é um `MultiPolygon` contendo um `Polygon` com apenas um anel externo para cada elemento da expressão. Se qualquer elemento não for um anel, ocorre um erro `ER_INVALID_CAST_TO_GEOMETRY`. Se qualquer anel não estiver na ordem correta (o anel externo deve ser no sentido anti-horário), ocorre um erro `ER_INVALID_CAST_POLYGON_RING_DIRECTION`.

* Se a expressão para o lançamento for uma geometria bem formada do tipo `MultiPolygon`, o resultado da função é que é `MultiPolygon`.

* Se a expressão para a projeção for uma geometria bem formada do tipo `GeometryCollection` contendo apenas polígonos, o resultado da função é um `MultiPolygon` contendo esses polígonos. Se a expressão estiver vazia ou contiver outros tipos de geometria, ocorrerá um erro `ER_INVALID_CAST_TO_GEOMETRY`.

* Se a expressão para o lançamento for uma geometria bem formada de outro tipo que não `Polygon`, `MultiLineString`, `MultiPolygon` ou `GeometryCollection`, ocorre um erro de `ER_INVALID_CAST_TO_GEOMETRY`.

#### Condições para Casts em GeometryCollection

Quando o tipo de resultado do elenco é `GeometryCollection`, essas condições se aplicam:

* `GeometryCollection` e `GeomCollection` são sinônimos para o mesmo tipo de resultado.

* Se a expressão para o lançamento for uma geometria bem formada do tipo `Point`, o resultado da função é um `GeometryCollection` contendo esse `Point` como seu único elemento.

* Se a expressão para o lançamento for uma geometria bem formada do tipo `LineString`, o resultado da função é um `GeometryCollection` contendo esse `LineString` como seu único elemento.

* Se a expressão para a classificação for uma geometria bem formada do tipo `Polygon`, o resultado da função é um `GeometryCollection` contendo esse `Polygon` como seu único elemento.

* Se a expressão para a projeção for uma geometria bem formada do tipo `MultiPoint`, o resultado da função é um `GeometryCollection` que contém os pontos na ordem em que aparecem na expressão.

* Se a expressão para a projeção for uma geometria bem formada do tipo `MultiLineString`, o resultado da função é um `GeometryCollection` que contém as linhas em ordem conforme aparecem na expressão.

* Se a expressão para a projeção for uma geometria bem formada do tipo `MultiPolygon`, o resultado da função é um `GeometryCollection` que contém os elementos do `MultiPolygon` na ordem em que aparecem na expressão.

* Se a expressão para o lançamento for uma geometria bem formada do tipo `GeometryCollection`, o resultado da função é que `GeometryCollection`.

### Outros usos para operações de fundição

As funções de elenco são úteis para criar uma coluna com um tipo específico em uma declaração `CREATE TABLE ... SELECT` (create-table.html "15.1.20 CREATE TABLE Statement"):

```
mysql> CREATE TABLE new_table SELECT CAST('2000-01-01' AS DATE) AS c1;
mysql> SHOW CREATE TABLE new_table\G
*************************** 1. row ***************************
       Table: new_table
Create Table: CREATE TABLE `new_table` (
  `c1` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

As funções de cast são úteis para ordenar as colunas `ENUM` em ordem lexical. Normalmente, a ordenação das colunas `ENUM` ocorre usando os valores numéricos internos. A cast dos valores para `CHAR` resulta em uma ordenação lexical:

```
SELECT enum_col FROM tbl_name
  ORDER BY CAST(enum_col AS CHAR);
```

`CAST()` também altera o resultado se você usá-lo como parte de uma expressão mais complexa, como [[`CONCAT('Date: ',CAST(NOW() AS DATE))`](string-functions.html#function_concat)].

Para valores temporais, é pouco necessário usar `CAST()` para extrair dados em diferentes formatos. Em vez disso, use uma função como `EXTRACT()`, `DATE_FORMAT()` ou `TIME_FORMAT()`. Veja a Seção 14.7, “Funções de Data e Hora”.

Para converter uma cadeia de caracteres em um número, normalmente é suficiente usar o valor da cadeia de caracteres em um contexto numérico:

```
mysql> SELECT 1+'1';
       -> 2
```

Isso também é verdade para os literais hexadecimais e de bits, que são strings binárias por padrão:

```
mysql> SELECT X'41', X'41'+0;
        -> 'A', 65
mysql> SELECT b'1100001', b'1100001'+0;
        -> 'a', 97
```

Uma cadeia de caracteres usada em uma operação aritmética é convertida em um número de ponto flutuante durante a avaliação da expressão.

Um número usado em contexto de string é convertido em uma string:

```
mysql> SELECT CONCAT('hello you ',2);
        -> 'hello you 2'
```

Para informações sobre a conversão implícita de números em strings, consulte a Seção 14.3, “Conversão de Tipo na Avaliação de Expressões”.

O MySQL suporta aritmética com valores de 64 bits assinados e não assinados. Para operadores numéricos (como `+` ou `-`) onde um dos operandos é um inteiro não assinado, o resultado é não assinado por padrão (consulte a Seção 14.6.1, “Operadores Aritméticos”). Para ignorar isso, use o operador de cast `SIGNED` ou `UNSIGNED` para converter um valor em um inteiro de 64 bits assinado ou não assinado, respectivamente.

```
mysql> SELECT 1 - 2;
        -> -1
mysql> SELECT CAST(1 - 2 AS UNSIGNED);
        -> 18446744073709551615
mysql> SELECT CAST(CAST(1 - 2 AS UNSIGNED) AS SIGNED);
        -> -1
```

Se qualquer dos operandos for um valor de ponto flutuante, o resultado é um valor de ponto flutuante e não é afetado pela regra anterior. (Neste contexto, os valores das colunas `DECIMAL` - DECIMAL e NUMERIC são considerados valores de ponto flutuante.)

```
mysql> SELECT CAST(1 AS UNSIGNED) - 2.0;
        -> -1.0
```

O modo SQL afeta o resultado das operações de conversão (consulte a Seção 7.1.11, “Modos SQL do servidor”). Exemplos:

* Para a conversão de uma cadeia de caracteres de data "zero" para uma data, `CONVERT()` e `CAST()` retornam `NULL` e produzem um aviso quando o modo SQL `NO_ZERO_DATE` é habilitado.

* Para subtração de inteiros, se o modo SQL `NO_UNSIGNED_SUBTRACTION` estiver habilitado, o resultado da subtração é sinalizado mesmo que qualquer operando seja não sinalizado.