## 14.10 Funções e operadores de cast

**Tabela 14.15 Funções e Operadores de Casting**

<table summary="Uma referência que lista funções e operadores de referência."><thead><tr><th>Nome</th> <th>Descrição</th> <th>Desatualizado</th> </tr></thead><tbody><tr><th>[[<code>BINARY</code>]]</th> <td>Converte uma cadeia de caracteres em uma cadeia binária</td> <td>8.0.27</td> </tr><tr><th>[[<code>CAST()</code>]]</th> <td>Atribua um valor a um determinado tipo</td> <td></td> </tr><tr><th>[[<code>CONVERT()</code>]]</th> <td>Atribua um valor a um determinado tipo</td> <td></td> </tr></tbody></table>

As funções e operadores de cast permitem a conversão de valores de um tipo de dado para outro.

- Função de elenco e descrições dos operadores
- Conversões de Conjunto de Caracteres
- Conversões de Conjunto de Caracteres para Comparação de Strings
- Operações de Castagem em Tipos Espaciais
- Outras utilizações das operações de fundição

### Função de elenco e descrições dos operadores

- `BINARY` `expr`

  O operador `BINARY` converte a expressão em uma string binária (uma string que tem o conjunto de caracteres `binary` e a ordenação `binary`). Um uso comum de `BINARY` é forçar uma comparação de string de caracteres a ser feita caractere por caractere usando valores numéricos de bytes em vez de caracteres. O operador `BINARY` também faz com que os espaços em branco finais nas comparações sejam significativos. Para obter informações sobre as diferenças entre a ordenação `binary` do conjunto de caracteres `binary` e as ordenações `_bin` dos conjuntos de caracteres não binários, consulte a Seção 12.8.5, “A ordenação binária comparada às ordenações \_bin”.

  O operador `BINARY` está desatualizado a partir do MySQL 8.0.27 e você deve esperar sua remoção em uma versão futura do MySQL. Use `CAST(... AS BINARY)` em vez disso.

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

  Para converter uma expressão de cadeia em uma string binária, esses construtores são equivalentes:

  ```
  CONVERT(expr USING BINARY)
  CAST(expr AS BINARY)
  BINARY expr
  ```

  Se um valor for uma literal de string, ele pode ser designado como uma string binária sem a necessidade de conversão, usando o conjunto de caracteres `_binary` introduzido:

  ```
  mysql> SELECT 'a' = 'A';
          -> 1
  mysql> SELECT _binary 'a' = 'A';
          -> 0
  ```

  Para obter informações sobre introdutores, consulte a Seção 12.3.8, “Introdutores de Conjunto de Caracteres”.

  O operador `BINARY` nas expressões difere em efeito do atributo `BINARY` nas definições de colunas de caracteres. Para uma coluna de caracteres definida com o atributo `BINARY`, o MySQL atribui o conjunto de caracteres padrão da tabela e a ordenação binária (`_bin`) desse conjunto de caracteres. Cada conjunto de caracteres não binário tem uma ordenação `_bin`. Por exemplo, se o conjunto de caracteres padrão da tabela é `utf8mb4`, essas duas definições de coluna são equivalentes:

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

  Se `BINARY` for invocado dentro do cliente **mysql**, as cadeias binárias são exibidas usando notação hexadecimal, dependendo do valor de `--binary-as-hex`. Para obter mais informações sobre essa opção, consulte a Seção 6.5.1, “mysql — O cliente de linha de comando do MySQL”.

- `CAST(expr AS type [ARRAY])`

  `CAST(timestamp_value AT TIME ZONE timezone_specifier AS DATETIME[(precision)])`

  `timezone_specifier`: \[INTERVAL] '+00:00' | 'UTC'

  Com a sintaxe `CAST(expr AS type`, a função `CAST()` recebe uma expressão de qualquer tipo e produz um valor de resultado do tipo especificado. Essa operação também pode ser expressa como `CONVERT(expr, type)`, que é equivalente. Se `expr` for `NULL`, `CAST()` retorna `NULL`.

  Estes valores `type` são permitidos:

  - `BINARY[(N)]`

    Gera uma string com o tipo de dados `VARBINARY`, exceto que, quando a expressão `expr` está vazia (com comprimento zero), o tipo de resultado é `BINARY(0)`. Se o comprimento opcional `N` for fornecido, `BINARY(N)` faz com que o cast use no máximo `N` bytes do argumento. Valores menores que `N` bytes são preenchidos com `0x00` bytes até um comprimento de `N`. Se o comprimento opcional `N` não for fornecido, o MySQL calcula o comprimento máximo a partir da expressão. Se o comprimento fornecido ou calculado for maior que um limiar interno, o tipo de resultado é `BLOB`. Se o comprimento ainda for muito longo, o tipo de resultado é `LONGBLOB`.

    Para uma descrição de como a conversão para `BINARY` afeta as comparações, consulte a Seção 13.3.3, “Os tipos BINARY e VARBINARY”.

  - `CHAR[(N)] [charset_info]`

    Gera uma string com o tipo de dados `VARCHAR`, a menos que a expressão `expr` esteja vazia (com comprimento zero), caso em que o tipo de resultado é `CHAR(0)`. Se o comprimento opcional `N` for fornecido, `CHAR(N)` faz com que o cast use no máximo `N` caracteres do argumento. Não ocorre preenchimento para valores com menos de `N` caracteres. Se o comprimento opcional `N` não for fornecido, o MySQL calcula o comprimento máximo a partir da expressão. Se o comprimento fornecido ou calculado for maior que um limiar interno, o tipo de resultado é `TEXT`. Se o comprimento ainda for muito longo, o tipo de resultado é `LONGTEXT`.

    Sem a cláusula `charset_info`, `CHAR` produz uma string com o conjunto de caracteres padrão. Para especificar explicitamente o conjunto de caracteres, esses valores `charset_info` são permitidos:

    - `CHARACTER SET charset_name`: Gera uma string com o conjunto de caracteres fornecido.

    - `ASCII`: Abreviação para `CHARACTER SET latin1`.

    - `UNICODE`: Abreviação para `CHARACTER SET ucs2`.

    Em todos os casos, a cadeia tem a collation padrão do conjunto de caracteres.

  - `DATE`

    Gera um valor `DATE`.

  - `DATETIME[(M)]`

    Gera um valor `DATETIME`. Se o valor opcional `M` for fornecido, ele especifica a precisão em segundos fracionários.

  - `DECIMAL[(M[,D])]`

    Gera um valor `DECIMAL` - DECIMAL, NUMERIC"). Se os valores opcionais `M` e `D` forem fornecidos, eles especificam o número máximo de dígitos (a precisão) e o número de dígitos após a vírgula decimal (a escala). Se `D` for omitido, 0 será assumido. Se `M` for omitido, 10 será assumido.

  - `DOUBLE`

    Gera um resultado de `DOUBLE` - FLOAT, DOUBLE") adicionado no MySQL 8.0.17.

  - `FLOAT[(p)]`

    Se a precisão `p` não for especificada, o resultado é do tipo `FLOAT` - FLOAT, DOUBLE"). Se `p` for fornecido e 0 <= < `p` <= 24, o resultado é do tipo `FLOAT`. Se 25 <= `p` <= 53, o resultado é do tipo `DOUBLE` - FLOAT, DOUBLE"). Se `p` for menor que 0 ou `p` for maior que 53, um erro é retornado. Adicionado no MySQL 8.0.17.

  - `JSON`

    Gera um valor `JSON`. Para obter detalhes sobre as regras de conversão de valores entre `JSON` e outros tipos, consulte Comparação e ordenação de valores JSON.

  - `NCHAR[(N)]`

    Como `CHAR`, mas produz uma string com o conjunto de caracteres nacional. Veja a Seção 12.3.7, “O Conjunto de Caracteres Nacional”.

    Ao contrário de `CHAR`, `NCHAR` não permite que informações sobre o conjunto de caracteres sejam especificadas.

  - `REAL`

    Produz um resultado do tipo `REAL` - FLOAT, DOUBLE"). Este é, na verdade, `FLOAT` se o modo SQL `REAL_AS_FLOAT` estiver habilitado; caso contrário, o resultado é do tipo `DOUBLE`.

  - `SIGNED [INTEGER]`

    Gera um valor assinado `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  - `spatial_type`

    A partir do MySQL 8.0.24, `CAST()` e `CONVERT()` suportam a conversão de valores de geometria de um tipo espacial para outro, para certas combinações de tipos espaciais. Para obter detalhes, consulte Operações de Castagem em Tipos Espaciais.

  - `TIME[(M)]`

    Gera um valor `TIME`. Se o valor opcional `M` for fornecido, ele especifica a precisão em segundos fracionários.

  - `UNSIGNED [INTEGER]`

    Gera um valor sem `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") assinado.

  - `YEAR`

    Gera um valor `YEAR`. Adicionado no MySQL 8.0.22. Essas regras regem a conversão para `YEAR`:

    - Para um número de quatro dígitos na faixa de 1901-2155 inclusiva, ou para uma string que pode ser interpretada como um número de quatro dígitos nesta faixa, retorne o valor correspondente ao \[\[`YEAR`] ].

    - Para um número composto por um ou dois dígitos, ou para uma string que possa ser interpretada como tal número, retorne um valor `YEAR` da seguinte forma:

      - Se o número estiver na faixa de 1 a 69, inclusivamente, adicione 2000 e retorne a soma.

      - Se o número estiver na faixa de 70 a 99 (incluindo), adicione 1900 e retorne a soma.

    - Para uma string que seja avaliada como 0, retorne 2000.

    - Para o número 0, retorne 0.

    - Para um valor de `DATE`, `DATETIME` ou `TIMESTAMP`, retorne a parte `YEAR` do valor. Para um valor de `TIME`, retorne o ano atual.

      Se você não especificar o tipo de um argumento `TIME`, poderá obter um resultado diferente do que você espera, como mostrado aqui:

      ```
      mysql> SELECT CAST("11:35:00" AS YEAR), CAST(TIME "11:35:00" AS YEAR);
      +--------------------------+-------------------------------+
      | CAST("11:35:00" AS YEAR) | CAST(TIME "11:35:00" AS YEAR) |
      +--------------------------+-------------------------------+
      |                     2011 |                          2021 |
      +--------------------------+-------------------------------+
      ```

    - Se o argumento for do tipo `DECIMAL` - DECIMAL, NUMERIC"), `DOUBLE` - FLOAT, DOUBLE"), `DECIMAL` - DECIMAL, NUMERIC"), ou `REAL` - FLOAT, DOUBLE"), arredonde o valor para o inteiro mais próximo, tente então converter o valor para `YEAR` usando as regras para valores inteiros, conforme mostrado aqui:

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

    Um valor de cadeia que contém caracteres não numéricos e que deve ser truncado antes da conversão gera uma mensagem de alerta, conforme mostrado aqui:

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

  No MySQL 8.0.17 e versões posteriores, `InnoDB` permite o uso de uma palavra-chave adicional `ARRAY` para criar um índice de múltiplos valores em um array `JSON` como parte das instruções `CREATE INDEX`, `CREATE TABLE` e `ALTER TABLE`. `ARRAY` não é suportado, exceto quando usado para criar um índice de múltiplos valores em uma dessas instruções, caso em que é necessário. A coluna que está sendo indexada deve ser uma coluna do tipo `JSON`. Com `ARRAY`, o `type` após a palavra-chave `AS` pode especificar qualquer um dos tipos suportados por `CAST()`, com exceções de `BINARY`, `JSON` e `YEAR`. Para informações de sintaxe e exemplos, bem como outras informações relevantes, consulte Índices de Múltiplos Valores.

  Nota

  `CONVERT()`, ao contrário de `CAST()`, *não* suporta a criação de índices de múltiplos valores ou a palavra-chave `ARRAY`.

  A partir do MySQL 8.0.22, o `CAST()` suporta a recuperação de um valor `TIMESTAMP` como sendo no UTC, usando o operador `AT TIMEZONE`. O único fuso horário suportado é o UTC; isso pode ser especificado como um dos `'+00:00'` ou `'UTC'`. O único tipo de retorno suportado por essa sintaxe é o `DATETIME`, com um especificador de precisão opcional na faixa de 0 a 6, inclusive.

  Os valores `TIMESTAMP` que utilizam desvios de fuso horário também são suportados.

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

  Se você usar `'UTC'` como especificador de fuso horário com esta forma de `CAST()`, e o servidor levantar um erro como "Fuso horário desconhecido" ou "Fuso horário incorreto: 'UTC'", você pode precisar instalar as tabelas de fuso horário do MySQL (veja Populando as tabelas de fuso horário).

  `AT TIME ZONE` não suporta a palavra-chave `ARRAY` e não é suportada pela função `CONVERT()`.

- `CONVERT(expr USING transcoding_name)`

  `CONVERT(expr,type)`

  `CONVERT(expr USING transcoding_name)` é a sintaxe SQL padrão. A forma não `USING` de `CONVERT()` é a sintaxe ODBC. Independentemente da sintaxe usada, a função retorna `NULL` se `expr` for `NULL`.

  `CONVERT(expr USING transcoding_name)` converte dados entre diferentes conjuntos de caracteres. No MySQL, a transcodificação de nomes é a mesma que os nomes dos conjuntos de caracteres correspondentes. Por exemplo, esta declaração converte a string `'abc'` no conjunto de caracteres padrão para a string correspondente no conjunto de caracteres `utf8mb4`:

  ```
  SELECT CONVERT('abc' USING utf8mb4);
  ```

  A sintaxe `CONVERT(expr, type)` (sem `USING`) recebe uma expressão e um valor `type` que especifica um tipo de resultado, e produz um valor de resultado do tipo especificado. Essa operação também pode ser expressa como `CAST(expr AS type)`, que é equivalente. Para mais informações, consulte a descrição de `CAST()`.

  Nota

  Antes do MySQL 8.0.28, essa função, às vezes, permitia conversões inválidas de valores `BINARY` para um conjunto de caracteres não binário. Quando `CONVERT()` era usado como parte da expressão para uma coluna gerada com índice, isso poderia levar à corrupção do índice após uma atualização de uma versão anterior do MySQL. Consulte Mudanças no SQL para obter informações sobre como lidar com essa situação.

### Conversões de Conjunto de Caracteres

O `CONVERT()` com uma cláusula `USING` converte dados entre conjuntos de caracteres:

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

Para converter cadeias entre conjuntos de caracteres, você também pode usar a sintaxe `CONVERT(expr, type)` (sem `USING`) ou `CAST(expr AS type)`, que é equivalente:

```
CONVERT(string, CHAR[(N)] CHARACTER SET charset_name)
CAST(string AS CHAR[(N)] CHARACTER SET charset_name)
```

Exemplos:

```
SELECT CONVERT('test', CHAR CHARACTER SET utf8mb4);
SELECT CAST('test' AS CHAR CHARACTER SET utf8mb4);
```

Se você especificar `CHARACTER SET charset_name` como mostrado acima, o conjunto de caracteres e a ordenação do resultado serão `charset_name` e a ordenação padrão de `charset_name`. Se você omitir `CHARACTER SET charset_name`, o conjunto de caracteres e a ordenação do resultado serão definidos pelas variáveis de sistema `character_set_connection` e `collation_connection` que determinam o conjunto de caracteres e a ordenação padrão da conexão (veja a Seção 12.4, “Conjunto de caracteres e ordenação de conexão”).

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

Para literais de string, outra maneira de especificar o conjunto de caracteres é usar um introduzir de conjunto de caracteres. `_latin1` e `_latin2` no exemplo anterior são exemplos de introdutores. Ao contrário das funções de conversão, como `CAST()`, ou `CONVERT()`, que convertem uma string de um conjunto de caracteres para outro, um introduzir designa um literal de string como tendo um conjunto de caracteres específico, sem conversão envolvida. Para mais informações, consulte a Seção 12.3.8, “Introdutores de Conjunto de Caracteres”.

### Conversões de Conjunto de Caracteres para Comparação de Strings

Normalmente, você não pode comparar um valor `BLOB` ou outra string binária de forma sensível a maiúsculas e minúsculas, porque as strings binárias usam o conjunto de caracteres `binary`, que não tem uma ordenação com o conceito de maiúsculas e minúsculas. Para realizar uma comparação sensível a maiúsculas e minúsculas, primeiro use a função `CONVERT()` ou `CAST()` para converter o valor em uma string não binária. As comparações da string resultante usam sua ordenação. Por exemplo, se a ordenação do resultado da conversão não for sensível a maiúsculas e minúsculas, uma operação `LIKE` não é sensível a maiúsculas e minúsculas. Isso é verdade para a seguinte operação porque a ordenação padrão `utf8mb4` (`utf8mb4_0900_ai_ci`) não é sensível a maiúsculas e minúsculas:

```
SELECT 'A' LIKE CONVERT(blob_col USING utf8mb4)
  FROM tbl_name;
```

Para especificar uma collation particular para a string convertida, use uma cláusula `COLLATE` após a chamada `CONVERT()`:

```
SELECT 'A' LIKE CONVERT(blob_col USING utf8mb4) COLLATE utf8mb4_unicode_ci
  FROM tbl_name;
```

Para usar um conjunto de caracteres diferente, substitua seu nome por `utf8mb4` nas declarações anteriores (e de forma semelhante para usar uma ordem de classificação diferente).

`CONVERT()` e `CAST()` podem ser usados de forma mais geral para comparar strings representadas em conjuntos de caracteres diferentes. Por exemplo, uma comparação dessas strings resulta em um erro porque elas têm conjuntos de caracteres diferentes:

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

A conversão do conjunto de caracteres também é útil antes da conversão para maiúsculas de cadeias binárias. `LOWER()` e `UPPER()` são ineficazes quando aplicados diretamente a cadeias binárias, porque o conceito de maiúsculas e minúsculas não se aplica. Para realizar a conversão para maiúsculas de uma cadeia binária, primeiro converta-a em uma cadeia não binária usando um conjunto de caracteres apropriado para os dados armazenados na cadeia:

```
mysql> SET @str = BINARY 'New York';
mysql> SELECT LOWER(@str), LOWER(CONVERT(@str USING utf8mb4));
+-------------+------------------------------------+
| LOWER(@str) | LOWER(CONVERT(@str USING utf8mb4)) |
+-------------+------------------------------------+
| New York    | new york                           |
+-------------+------------------------------------+
```

Tenha em mente que, se você aplicar `BINARY`, `CAST()` ou `CONVERT()` em uma coluna indexada, o MySQL pode não conseguir usar o índice de forma eficiente.

### Operações de Castagem em Tipos Espaciais

A partir do MySQL 8.0.24, `CAST()` e `CONVERT()` suportam a conversão de valores de geometria de um tipo espacial para outro, para certas combinações de tipos espaciais. A lista a seguir mostra as combinações de tipos permitidas, onde “extensão MySQL” designa conversões implementadas no MySQL além daquelas definidas no padrão SQL/MM:

- De `Point` para:

  - `MultiPoint`
  - `GeometryCollection`
- De `LineString` para:

  - `Polygon` (extensão MySQL)
  - `MultiPoint` (extensão MySQL)
  - `MultiLineString`
  - `GeometryCollection`
- De `Polygon` para:

  - `LineString` (extensão MySQL)
  - `MultiLineString` (extensão MySQL)
  - `MultiPolygon`
  - `GeometryCollection`
- De `MultiPoint` para:

  - `Point`
  - `LineString` (extensão MySQL)
  - `GeometryCollection`
- De `MultiLineString` para:

  - `LineString`
  - `Polygon` (extensão MySQL)
  - `MultiPolygon` (extensão MySQL)
  - `GeometryCollection`
- De `MultiPolygon` para:

  - `Polygon`
  - `MultiLineString` (extensão MySQL)
  - `GeometryCollection`
- De `GeometryCollection` para:

  - `Point`
  - `LineString`
  - `Polygon`
  - `MultiPoint`
  - `MultiLineString`
  - `MultiPolygon`

Nos moldes espaciais, `GeometryCollection` e `GeomCollection` são sinônimos do mesmo tipo de resultado.

Algumas condições se aplicam a todos os tipos de tipos de dados espaciais, e algumas condições se aplicam apenas quando o resultado do cast deve ter um tipo de dados espacial específico. Para obter informações sobre termos como “geometria bem formada”, consulte a Seção 13.4.4, “Formação e validade da geometria”.

- Condições Gerais para Moldes Espaciais
- Condições para os lançamentos apontarem
- Condições para Cintas serem convertidas em LineString
- Condições para os moldes serem feitos em polígono
- Condições para os moldes se conectarem ao MultiPoint
- Condições para Criação de Casts para MultiLineString
- Condições para Cintas em MultiPoligono
- Condições para Cintas em GeometriaColeção

#### Condições Gerais para Moldes Espaciais

Essas condições se aplicam a todos os moldes espaciais, independentemente do tipo de resultado:

- O resultado de um cast está no mesmo SRS que o da expressão para cast.

- A conversão entre tipos espaciais não altera os valores de coordenadas ou a ordem.

- Se a expressão para ser lançada for `NULL`, o resultado da função será `NULL`.

- A conversão para tipos espaciais usando a função `JSON_VALUE()` com uma cláusula `RETURNING` que especifica um tipo espacial não é permitida.

- A conversão para um `ARRAY` de tipos espaciais não é permitida.

- Se a combinação de tipos espaciais for permitida, mas a expressão a ser convertida não for uma geometria sintaticamente bem formada, ocorrerá um erro `ER_GIS_INVALID_DATA`.

- Se a combinação de tipos espaciais for permitida, mas a expressão a ser convertida for uma geometria sintaticamente bem formada em um sistema de referência espacial indefinido (SRS), ocorrerá um erro `ER_SRS_NOT_FOUND`.

- Se a expressão para o comando de lançamento tiver um SRS geográfico, mas tiver uma longitude ou latitude fora do intervalo, ocorrerá um erro:

  - Se um valor de longitude não estiver no intervalo (−180, 180], ocorrerá um erro `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE`.

  - Se um valor de latitude não estiver no intervalo \[−90, 90], ocorrerá um erro `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE`.

  As faixas mostradas são em graus. Se um SRS usar outra unidade, a faixa usa os valores correspondentes em sua unidade. Os limites exatos da faixa variam ligeiramente devido à aritmética de ponto flutuante.

#### Condições para os lançamentos apontarem

Quando o tipo de resultado do elenco for `Point`, essas condições se aplicam:

- Se a expressão para a cast for uma geometria bem formada do tipo `Point`, o resultado da função é `Point`.

- Se a expressão a ser lançada for uma geometria bem formada do tipo `MultiPoint` contendo um único `Point`, o resultado da função é `Point`. Se a expressão contiver mais de um `Point`, ocorre um erro `ER_INVALID_CAST_TO_GEOMETRY`.

- Se a expressão a ser lançada for uma geometria bem formada do tipo `GeometryCollection` contendo apenas um único `Point`, o resultado da função é `Point`. Se a expressão estiver vazia, contiver mais de um `Point` ou contiver outros tipos de geometria, ocorrerá um erro `ER_INVALID_CAST_TO_GEOMETRY`.

- Se a expressão para a consulta for uma geometria bem formada de outro tipo que não seja `Point`, `MultiPoint`, `GeometryCollection`, uma `ER_INVALID_CAST_TO_GEOMETRY` ocorre.

#### Condições para Cintas serem convertidas em LineString

Quando o tipo de resultado do elenco for `LineString`, essas condições se aplicam:

- Se a expressão para a cast for uma geometria bem formada do tipo `LineString`, o resultado da função é `LineString`.

- Se a expressão para a projeção for uma geometria bem formada do tipo `Polygon` que não possui anéis internos, o resultado da função é um `LineString` que contém os pontos do anel externo na mesma ordem. Se a expressão tiver anéis internos, ocorre um erro `ER_INVALID_CAST_TO_GEOMETRY`.

- Se a expressão a ser calculada for uma geometria bem formada do tipo `MultiPoint` contendo pelo menos dois pontos, o resultado da função será um `LineString` contendo os pontos do `MultiPoint` na ordem em que aparecem na expressão. Se a expressão contiver apenas um `Point`, ocorrerá um erro `ER_INVALID_CAST_TO_GEOMETRY`.

- Se a expressão a ser lançada for uma geometria bem formada do tipo `MultiLineString` contendo um único `LineString`, o resultado da função é `LineString`. Se a expressão contiver mais de um `LineString`, ocorre um erro `ER_INVALID_CAST_TO_GEOMETRY`.

- Se a expressão a ser lançada for uma geometria bem formada do tipo `GeometryCollection`, contendo apenas um único `LineString`, o resultado da função é `LineString`. Se a expressão estiver vazia, contiver mais de um `LineString` ou contiver outros tipos de geometria, ocorrerá um erro `ER_INVALID_CAST_TO_GEOMETRY`.

- Se a expressão para a consulta for uma geometria bem formada de outro tipo que não seja `LineString`, `Polygon`, `MultiPoint`, `MultiLineString` ou `GeometryCollection`, ocorrerá um erro `ER_INVALID_CAST_TO_GEOMETRY`.

#### Condições para os moldes serem feitos em polígono

Quando o tipo de resultado do elenco for `Polygon`, essas condições se aplicam:

- Se a expressão a ser projetada for uma geometria bem formada do tipo `LineString` que é um anel (ou seja, os pontos de início e fim são os mesmos), o resultado da função é um `Polygon` com um anel externo composto pelos pontos do `LineString` na mesma ordem. Se a expressão não for um anel, ocorre um erro `ER_INVALID_CAST_TO_GEOMETRY`. Se o anel não estiver na ordem correta (o anel externo deve ser no sentido anti-horário), ocorre um erro `ER_INVALID_CAST_POLYGON_RING_DIRECTION`.

- Se a expressão para a cast for uma geometria bem formada do tipo `Polygon`, o resultado da função é `Polygon`.

- Se a expressão a ser projetada for uma geometria bem formada do tipo `MultiLineString` onde todos os elementos são anéis, o resultado da função é um `Polygon` com o primeiro `LineString` como anel externo e quaisquer valores adicionais de `LineString` como anéis internos. Se qualquer elemento da expressão não for um anel, ocorre um erro `ER_INVALID_CAST_TO_GEOMETRY`. Se qualquer anel não estiver na ordem correta (o anel externo deve ser no sentido anti-horário, os anéis internos devem ser no sentido horário), ocorre um erro `ER_INVALID_CAST_POLYGON_RING_DIRECTION`.

- Se a expressão a ser lançada for uma geometria bem formada do tipo `MultiPolygon` contendo um único `Polygon`, o resultado da função é `Polygon`. Se a expressão contiver mais de um `Polygon`, ocorre um erro `ER_INVALID_CAST_TO_GEOMETRY`.

- Se a expressão a ser lançada for uma geometria bem formada do tipo `GeometryCollection` contendo apenas um único `Polygon`, o resultado da função é `Polygon`. Se a expressão estiver vazia, contiver mais de um `Polygon` ou contiver outros tipos de geometria, ocorrerá um erro `ER_INVALID_CAST_TO_GEOMETRY`.

- Se a expressão para a consulta for uma geometria bem formada de outro tipo que não seja `LineString`, `Polygon`, `MultiLineString`, `MultiPolygon` ou `GeometryCollection`, ocorrerá um erro `ER_INVALID_CAST_TO_GEOMETRY`.

#### Condições para os moldes se conectarem ao MultiPoint

Quando o tipo de resultado do elenco for `MultiPoint`, essas condições se aplicam:

- Se a expressão a ser lançada for uma geometria bem formada do tipo `Point`, o resultado da função é um `MultiPoint` que contém esse `Point` como seu único elemento.

- Se a expressão para a projeção for uma geometria bem formada do tipo `LineString`, o resultado da função será um `MultiPoint` que contém os pontos do `LineString` na mesma ordem.

- Se a expressão para a cast for uma geometria bem formada do tipo `MultiPoint`, o resultado da função é `MultiPoint`.

- Se a expressão para a projeção for uma geometria bem formada do tipo `GeometryCollection` contendo apenas pontos, o resultado da função será um `MultiPoint` contendo esses pontos. Se o `GeometryCollection` estiver vazio ou contiver outros tipos de geometria, ocorrerá um erro `ER_INVALID_CAST_TO_GEOMETRY`.

- Se a expressão para a consulta for uma geometria bem formada de outro tipo que não seja `Point`, `LineString`, `MultiPoint` ou `GeometryCollection`, ocorrerá um erro `ER_INVALID_CAST_TO_GEOMETRY`.

#### Condições para Criação de Casts para MultiLineString

Quando o tipo de resultado do elenco for `MultiLineString`, essas condições se aplicam:

- Se a expressão a ser lançada for uma geometria bem formada do tipo `LineString`, o resultado da função é um `MultiLineString` que contém esse `LineString` como seu único elemento.

- Se a expressão a ser calculada for uma geometria bem formada do tipo `Polygon`, o resultado da função será um `MultiLineString` que contém o anel externo do `Polygon` como seu primeiro elemento e quaisquer anéis internos como elementos adicionais na ordem em que aparecem na expressão.

- Se a expressão para a cast for uma geometria bem formada do tipo `MultiLineString`, o resultado da função é `MultiLineString`.

- Se a expressão a ser calculada for uma geometria bem formada do tipo `MultiPolygon` contendo apenas polígonos sem anéis internos, o resultado da função será um `MultiLineString` contendo os anéis dos polígonos na ordem em que aparecem na expressão. Se a expressão contiver polígonos com anéis internos, ocorrerá um erro `ER_WRONG_PARAMETERS_TO_STORED_FCT`.

- Se a expressão para a projeção for uma geometria bem formada do tipo `GeometryCollection` contendo apenas linhas, o resultado da função será um `MultiLineString` contendo essas linhas. Se a expressão estiver vazia ou contiver outros tipos de geometria, ocorrerá um erro `ER_INVALID_CAST_TO_GEOMETRY`.

- Se a expressão para a consulta for uma geometria bem formada de outro tipo que não seja `LineString`, `Polygon`, `MultiLineString`, `MultiPolygon` ou `GeometryCollection`, ocorrerá um erro `ER_INVALID_CAST_TO_GEOMETRY`.

#### Condições para Cintas em MultiPoligono

Quando o tipo de resultado do elenco for `MultiPolygon`, essas condições se aplicam:

- Se a expressão a ser lançada for uma geometria bem formada do tipo `Polygon`, o resultado da função é um `MultiPolygon` que contém o `Polygon` como seu único elemento.

- Se a expressão a ser projetada for uma geometria bem formada do tipo `MultiLineString` onde todos os elementos são anéis, o resultado da função é um `MultiPolygon` contendo um `Polygon` com apenas um anel externo para cada elemento da expressão. Se algum elemento não for um anel, ocorre um erro `ER_INVALID_CAST_TO_GEOMETRY`. Se algum anel não estiver na ordem correta (o anel externo deve ser no sentido anti-horário), ocorre um erro `ER_INVALID_CAST_POLYGON_RING_DIRECTION`.

- Se a expressão para a cast for uma geometria bem formada do tipo `MultiPolygon`, o resultado da função é `MultiPolygon`.

- Se a expressão para a projeção for uma geometria bem formada do tipo `GeometryCollection` contendo apenas polígonos, o resultado da função será um `MultiPolygon` contendo esses polígonos. Se a expressão estiver vazia ou contiver outros tipos de geometria, ocorrerá um erro `ER_INVALID_CAST_TO_GEOMETRY`.

- Se a expressão para a consulta for uma geometria bem formada de outro tipo que não seja `Polygon`, `MultiLineString`, `MultiPolygon` ou `GeometryCollection`, ocorrerá um erro `ER_INVALID_CAST_TO_GEOMETRY`.

#### Condições para Cintas em GeometriaColeção

Quando o tipo de resultado do elenco for `GeometryCollection`, essas condições se aplicam:

- `GeometryCollection` e `GeomCollection` são sinônimos do mesmo tipo de resultado.

- Se a expressão a ser lançada for uma geometria bem formada do tipo `Point`, o resultado da função é um `GeometryCollection` que contém esse `Point` como seu único elemento.

- Se a expressão a ser lançada for uma geometria bem formada do tipo `LineString`, o resultado da função é um `GeometryCollection` que contém esse `LineString` como seu único elemento.

- Se a expressão a ser lançada for uma geometria bem formada do tipo `Polygon`, o resultado da função é um `GeometryCollection` que contém esse `Polygon` como seu único elemento.

- Se a expressão a ser calculada for uma geometria bem formada do tipo `MultiPoint`, o resultado da função será um `GeometryCollection` que contém os pontos na ordem em que aparecem na expressão.

- Se a expressão a ser lançada for uma geometria bem formada do tipo `MultiLineString`, o resultado da função será um `GeometryCollection` que contém as linhas em ordem conforme aparecem na expressão.

- Se a expressão a ser calculada for uma geometria bem formada do tipo `MultiPolygon`, o resultado da função será um `GeometryCollection` que contém os elementos do `MultiPolygon` na ordem em que aparecem na expressão.

- Se a expressão para a cast for uma geometria bem formada do tipo `GeometryCollection`, o resultado da função é `GeometryCollection`.

### Outras utilizações das operações de fundição

As funções de elenco são úteis para criar uma coluna com um tipo específico em uma declaração `CREATE TABLE ... SELECT`:

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

`CAST()` também altera o resultado se você usá-lo como parte de uma expressão mais complexa, como `CONCAT('Date: ',CAST(NOW() AS DATE))`.

Para valores temporais, é pouco necessário usar `CAST()` para extrair dados em diferentes formatos. Em vez disso, use uma função como `EXTRACT()`, `DATE_FORMAT()` ou `TIME_FORMAT()`. Veja a Seção 14.7, “Funções de Data e Hora”.

Para converter uma string em um número, normalmente basta usar o valor da string em um contexto numérico:

```
mysql> SELECT 1+'1';
       -> 2
```

Isso também é verdade para literais hexadecimais e de bits, que são cadeias binárias por padrão:

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

Para obter informações sobre a conversão implícita de números em strings, consulte a Seção 14.3, “Conversão de Tipo na Avaliação de Expressões”.

O MySQL suporta aritmética com valores de 64 bits assinados e não assinados. Para operadores numéricos (como `+` ou `-`) onde um dos operandos é um inteiro não assinado, o resultado é não assinado por padrão (consulte a Seção 14.6.1, “Operadores Aritméticos”). Para contornar isso, use o operador de cast `SIGNED` ou `UNSIGNED` para converter um valor em um inteiro de 64 bits assinado ou não assinado, respectivamente.

```
mysql> SELECT 1 - 2;
        -> -1
mysql> SELECT CAST(1 - 2 AS UNSIGNED);
        -> 18446744073709551615
mysql> SELECT CAST(CAST(1 - 2 AS UNSIGNED) AS SIGNED);
        -> -1
```

Se qualquer dos operandos for um valor de ponto flutuante, o resultado será um valor de ponto flutuante e não será afetado pela regra anterior. (Neste contexto, os valores das colunas `DECIMAL` - DECIMAL, NUMERIC"] são considerados valores de ponto flutuante.)

```
mysql> SELECT CAST(1 AS UNSIGNED) - 2.0;
        -> -1.0
```

O modo SQL afeta o resultado das operações de conversão (consulte a Seção 7.1.11, “Modos SQL do servidor”). Exemplos:

- Para a conversão de uma string de data "zero" para uma data, `CONVERT()` e `CAST()` retornam `NULL` e produzem um aviso quando o modo SQL `NO_ZERO_DATE` está ativado.

- Para a subtração de inteiros, se o modo SQL `NO_UNSIGNED_SUBTRACTION` estiver habilitado, o resultado da subtração será assinado, mesmo que qualquer operando seja não assinado.
