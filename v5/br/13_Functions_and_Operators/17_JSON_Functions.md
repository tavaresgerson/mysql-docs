## 12.17 Funções JSON

As funções descritas nesta seção realizam operações em valores JSON. Para discussão sobre o tipo de dados `JSON` e exemplos adicionais que mostram como usar essas funções, consulte a Seção 11.5, “O tipo de dados JSON”.

Para funções que aceitam um argumento JSON, ocorre um erro se o argumento não for um valor JSON válido. Os argumentos que são analisados como JSON são indicados por *`json_doc`*; os argumentos indicados por *`val`* não são analisados.

As funções que retornam valores JSON sempre realizam a normalização desses valores (consulte Normalização, Fusão e Autoenrolado de Valores JSON), e, portanto, os ordenam. *O resultado preciso do tipo de ordenação pode ser alterado a qualquer momento; não confie nele para ser consistente entre as versões*.

A menos que indicado de outra forma, as funções JSON foram adicionadas no MySQL 5.7.8.

Também está disponível um conjunto de funções espaciais para operar com valores GeoJSON. Consulte a Seção 12.16.11, “Funções GeoJSON Espaciais”.

### 12.17.1 Referência de função JSON

**Tabela 12.22 Funções JSON**

<table frame="box" rules="all" summary="A reference that lists all JSON functions."><col style="width: 22%"/><col style="width: 55%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> <th>Deprecated</th> </tr></thead><tbody><tr><th><code>-&gt;</code></th> <td> Return value from JSON column after evaluating path; equivalent to JSON_EXTRACT(). </td> <td></td> <td></td> </tr><tr><th><code>-&gt;&gt;</code></th> <td> Return value from JSON column after evaluating path and unquoting the result; equivalent to JSON_UNQUOTE(JSON_EXTRACT()). </td> <td>5.7.13</td> <td></td> </tr><tr><th><code>JSON_APPEND()</code></th> <td> Append data to JSON document </td> <td></td> <td>Yes</td> </tr><tr><th><code>JSON_ARRAY()</code></th> <td> Create JSON array </td> <td></td> <td></td> </tr><tr><th><code>JSON_ARRAY_APPEND()</code></th> <td>Adicione dados ao documento JSON</td> <td></td> <td></td> </tr><tr><th><code>JSON_ARRAY_INSERT()</code></th> <td>Insira no array JSON</td> <td></td> <td></td> </tr><tr><th><code>JSON_CONTAINS()</code></th> <td>Se o documento JSON contém um objeto específico no caminho</td> <td></td> <td></td> </tr><tr><th><code>JSON_CONTAINS_PATH()</code></th> <td>Se o documento JSON contém algum dado no caminho</td> <td></td> <td></td> </tr><tr><th><code>JSON_DEPTH()</code></th> <td>Profundidade máxima do documento JSON</td> <td></td> <td></td> </tr><tr><th><code>JSON_EXTRACT()</code></th> <td>Retorno de dados de documento JSON</td> <td></td> <td></td> </tr><tr><th><code>JSON_INSERT()</code></th> <td>Insira dados em documento JSON</td> <td></td> <td></td> </tr><tr><th><code>JSON_KEYS()</code></th> <td>Matriz de chaves de um documento JSON</td> <td></td> <td></td> </tr><tr><th><code>JSON_LENGTH()</code></th> <td>Número de elementos no documento JSON</td> <td></td> <td></td> </tr><tr><th><code>JSON_MERGE()</code></th> <td> Merge JSON documents, preserving duplicate keys. Deprecated synonym for JSON_MERGE_PRESERVE() </td> <td></td> <td>5.7.22</td> </tr><tr><th><code>JSON_MERGE_PATCH()</code></th> <td>Mesclar documentos JSON, substituindo os valores de chaves duplicadas</td> <td>5.7.22</td> <td></td> </tr><tr><th><code>JSON_MERGE_PRESERVE()</code></th> <td>Mesclar documentos JSON, preservando chaves duplicadas</td> <td>5.7.22</td> <td></td> </tr><tr><th><code>JSON_OBJECT()</code></th> <td> Create JSON object </td> <td></td> <td></td> </tr><tr><th><code>JSON_PRETTY()</code></th> <td>Imprima um documento JSON em formato legível para humanos</td> <td>5.7.22</td> <td></td> </tr><tr><th><code>JSON_QUOTE()</code></th> <td> Quote JSON document </td> <td></td> <td></td> </tr><tr><th><code>JSON_REMOVE()</code></th> <td>Remova dados do documento JSON</td> <td></td> <td></td> </tr><tr><th><code>JSON_REPLACE()</code></th> <td>Substitua os valores no documento JSON</td> <td></td> <td></td> </tr><tr><th><code>JSON_SEARCH()</code></th> <td>Caminho para o valor dentro do documento JSON</td> <td></td> <td></td> </tr><tr><th><code>JSON_SET()</code></th> <td>Insira dados em documento JSON</td> <td></td> <td></td> </tr><tr><th><code>JSON_STORAGE_SIZE()</code></th> <td>Espaço utilizado para armazenamento da representação binária de um documento JSON</td> <td>5.7.22</td> <td></td> </tr><tr><th><code>JSON_TYPE()</code></th> <td>Tipo de valor JSON</td> <td></td> <td></td> </tr><tr><th><code>JSON_UNQUOTE()</code></th> <td> Unquote JSON value </td> <td></td> <td></td> </tr><tr><th><code>JSON_VALID()</code></th> <td>Se o valor JSON é válido</td> <td></td> <td></td> </tr></tbody></table>

O MySQL 5.7.22 e versões posteriores suportam duas funções agregadas de JSON `JSON_ARRAYAGG()` e `JSON_OBJECTAGG()`. Consulte a Seção 12.19, “Funções Agregadas”, para descrições dessas funções.

Também começando com o MySQL 5.7.22:

* A impressão bonita dos valores JSON em um formato fácil de ler pode ser obtida usando a função `JSON_PRETTY()`.

* Você pode ver quanto espaço de armazenamento um determinado valor JSON ocupa usando `JSON_STORAGE_SIZE()`.

Para descrições completas dessas duas funções, consulte a Seção 12.17.6, “Funções de Utilidade JSON”.

### 12.17.2 Funções que criam valores JSON

As funções listadas nesta seção compõem valores JSON a partir de elementos de componentes.

* `JSON_ARRAY([val[, val] ...])`(json-creation-functions.html#function_json-array)

Avalia uma lista (possivelmente vazia) de valores e retorna um array JSON contendo esses valores.

  ```sql
  mysql> SELECT JSON_ARRAY(1, "abc", NULL, TRUE, CURTIME());
  +---------------------------------------------+
  | JSON_ARRAY(1, "abc", NULL, TRUE, CURTIME()) |
  +---------------------------------------------+
  | [1, "abc", null, true, "11:30:24.000000"]   |
  +---------------------------------------------+
  ```

* `JSON_OBJECT([key, val[, key, val] ...])`(json-creation-functions.html#function_json-object)

Avalia uma lista (possivelmente vazia) de pares chave-valor e retorna um objeto JSON contendo esses pares. Um erro ocorre se qualquer nome de chave for `NULL` ou o número de argumentos for ímpar.

  ```sql
  mysql> SELECT JSON_OBJECT('id', 87, 'name', 'carrot');
  +-----------------------------------------+
  | JSON_OBJECT('id', 87, 'name', 'carrot') |
  +-----------------------------------------+
  | {"id": 87, "name": "carrot"}            |
  +-----------------------------------------+
  ```

* `JSON_QUOTE(string)`

Cita uma string como um valor JSON, envolvendo-a com caracteres de aspas duplas e escapando as aspas internas e outros caracteres, e, em seguida, retorna o resultado como uma string `utf8mb4`. Retorna `NULL` se o argumento for `NULL`.

Essa função é normalmente usada para produzir uma string literal JSON válida para inclusão dentro de um documento JSON.

Certos caracteres especiais são escapados com barras invertidas conforme as sequências de escape mostradas na Tabela 12.23, "Sequências de escape de caracteres especiais JSON_UNQUOTE()". Sequências de escape de caracteres especiais).

  ```sql
  mysql> SELECT JSON_QUOTE('null'), JSON_QUOTE('"null"');
  +--------------------+----------------------+
  | JSON_QUOTE('null') | JSON_QUOTE('"null"') |
  +--------------------+----------------------+
  | "null"             | "\"null\""           |
  +--------------------+----------------------+
  mysql> SELECT JSON_QUOTE('[1, 2, 3]');
  +-------------------------+
  | JSON_QUOTE('[1, 2, 3]') |
  +-------------------------+
  | "[1, 2, 3]"             |
  +-------------------------+
  ```

Você também pode obter valores JSON ao converter valores de outros tipos para o tipo `JSON` usando [`CAST(value AS JSON)`](cast-functions.html#function_cast); consulte Conversão entre valores JSON e não JSON, para mais informações.

Dois conjuntos de funções agregadas que geram valores JSON estão disponíveis (MySQL 5.7.22 e versões posteriores). `JSON_ARRAYAGG()` retorna um conjunto de resultados como um único array JSON, e `JSON_OBJECTAGG()` retorna um conjunto de resultados como um único objeto JSON. Para mais informações, consulte a Seção 12.19, “Funções Agregadas”.

### 12.17.3 Funções que buscam valores JSON

As funções desta seção realizam operações de pesquisa em valores JSON para extrair dados deles, relatar se os dados existem em um local dentro deles ou relatar o caminho para os dados dentro deles.

* `JSON_CONTAINS(target, candidate[, path])`(json-search-functions.html#function_json-contains)

Indica, retornando 1 ou 0, se um dado documento JSON *`candidate`* está contido em um documento JSON *`target`*, ou, se um argumento *`path`* foi fornecido, se o candidato é encontrado em um caminho específico dentro do alvo. Retorna `NULL` se qualquer argumento for `NULL`, ou se o argumento de caminho não identifica uma seção do documento alvo. Um erro ocorre se *`target`* ou *`candidate`* não for um documento JSON válido, ou se o argumento *`path`* não for uma expressão de caminho válida ou contém um `*` ou `**` wildcard.

Para verificar apenas se há algum dado no caminho, use `JSON_CONTAINS_PATH()` em vez disso.

As regras a seguir definem o contentamento:

Um escalar candidato está contido em um escalar alvo se e somente se forem comparáveis e iguais. Dois valores escalares são comparáveis se tiverem os mesmos tipos `JSON_TYPE()`, com exceção de que os valores dos tipos `INTEGER` e `DECIMAL` também são comparáveis entre si.

Um array candidato está contido em um array alvo se e somente se cada elemento do candidato estiver contido em algum elemento do alvo.

Um candidato não-vetor está contido em um vetor alvo se e somente se o candidato estiver contido em algum elemento do alvo.

Um objeto candidato está contido em um objeto alvo se e somente se, para cada chave no candidato, houver uma chave com o mesmo nome no alvo e o valor associado à chave do candidato esteja contido no valor associado à chave do alvo.

Caso contrário, o valor do candidato não está contido no documento-alvo.

  ```sql
  mysql> SET @j = '{"a": 1, "b": 2, "c": {"d": 4}}';
  mysql> SET @j2 = '1';
  mysql> SELECT JSON_CONTAINS(@j, @j2, '$.a');
  +-------------------------------+
  | JSON_CONTAINS(@j, @j2, '$.a') |
  +-------------------------------+
  |                             1 |
  +-------------------------------+
  mysql> SELECT JSON_CONTAINS(@j, @j2, '$.b');
  +-------------------------------+
  | JSON_CONTAINS(@j, @j2, '$.b') |
  +-------------------------------+
  |                             0 |
  +-------------------------------+

  mysql> SET @j2 = '{"d": 4}';
  mysql> SELECT JSON_CONTAINS(@j, @j2, '$.a');
  +-------------------------------+
  | JSON_CONTAINS(@j, @j2, '$.a') |
  +-------------------------------+
  |                             0 |
  +-------------------------------+
  mysql> SELECT JSON_CONTAINS(@j, @j2, '$.c');
  +-------------------------------+
  | JSON_CONTAINS(@j, @j2, '$.c') |
  +-------------------------------+
  |                             1 |
  +-------------------------------+
  ```

* `JSON_CONTAINS_PATH(json_doc, one_or_all, path[, path] ...)`(json-search-functions.html#function_json-contains-path)

Devolve 0 ou 1 para indicar se um documento JSON contém dados em um caminho ou caminhos específicos. Devolve `NULL` se qualquer argumento for `NULL`. Ocorre um erro se o argumento *`json_doc`* não for um documento JSON válido, qualquer argumento *`path`* não for uma expressão de caminho válida ou *`one_or_all`* não for `'one'` ou `'all'`.

Para verificar um valor específico em um caminho, use `JSON_CONTAINS()` em vez disso.

O valor de retorno é 0 se não houver um caminho especificado dentro do documento. Caso contrário, o valor de retorno depende do argumento *`one_or_all`*:

+ `'one'`: 1 se pelo menos uma trilha existir dentro do documento, 0 caso contrário.

+ `'all'`: 1 se todos os caminhos existirem dentro do documento, 0 caso contrário.

  ```sql
  mysql> SET @j = '{"a": 1, "b": 2, "c": {"d": 4}}';
  mysql> SELECT JSON_CONTAINS_PATH(@j, 'one', '$.a', '$.e');
  +---------------------------------------------+
  | JSON_CONTAINS_PATH(@j, 'one', '$.a', '$.e') |
  +---------------------------------------------+
  |                                           1 |
  +---------------------------------------------+
  mysql> SELECT JSON_CONTAINS_PATH(@j, 'all', '$.a', '$.e');
  +---------------------------------------------+
  | JSON_CONTAINS_PATH(@j, 'all', '$.a', '$.e') |
  +---------------------------------------------+
  |                                           0 |
  +---------------------------------------------+
  mysql> SELECT JSON_CONTAINS_PATH(@j, 'one', '$.c.d');
  +----------------------------------------+
  | JSON_CONTAINS_PATH(@j, 'one', '$.c.d') |
  +----------------------------------------+
  |                                      1 |
  +----------------------------------------+
  mysql> SELECT JSON_CONTAINS_PATH(@j, 'one', '$.a.d');
  +----------------------------------------+
  | JSON_CONTAINS_PATH(@j, 'one', '$.a.d') |
  +----------------------------------------+
  |                                      0 |
  +----------------------------------------+
  ```

* `JSON_EXTRACT(json_doc, path[, path] ...)`(json-search-functions.html#function_json-extract)

Retorna dados de um documento JSON, selecionados das partes do documento que correspondem aos argumentos *`path`*. Retorna `NULL` se algum argumento for `NULL` ou se nenhum caminho localizar um valor no documento. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou se algum argumento *`path`* não for uma expressão de caminho válida.

O valor de retorno consiste em todos os valores correspondidos pelos argumentos *`path`*. Se for possível que esses argumentos possam retornar múltiplos valores, os valores correspondidos são autoencapsulados como um array, na ordem correspondente aos caminhos que os produziram. Caso contrário, o valor de retorno é o único valor correspondido.

  ```sql
  mysql> SELECT JSON_EXTRACT('[10, 20, [30, 40]]', '$[1]');
  +--------------------------------------------+
  | JSON_EXTRACT('[10, 20, [30, 40]]', '$[1]') |
  +--------------------------------------------+
  | 20                                         |
  +--------------------------------------------+
  mysql> SELECT JSON_EXTRACT('[10, 20, [30, 40]]', '$[1]', '$[0]');
  +----------------------------------------------------+
  | JSON_EXTRACT('[10, 20, [30, 40]]', '$[1]', '$[0]') |
  +----------------------------------------------------+
  | [20, 10]                                           |
  +----------------------------------------------------+
  mysql> SELECT JSON_EXTRACT('[10, 20, [30, 40]]', '$[2][*]');
  +-----------------------------------------------+
  | JSON_EXTRACT('[10, 20, [30, 40]]', '$[2][*]') |
  +-----------------------------------------------+
  | [30, 40]                                      |
  +-----------------------------------------------+
  ```

MySQL 5.7.9 e versões posteriores suportam o operador `->` como abreviação para essa função, conforme usado com 2 argumentos, onde o lado esquerdo é um identificador de coluna `JSON` (não uma expressão) e o lado direito é o caminho JSON a ser correspondido dentro da coluna.

* `column->path`

Em MySQL 5.7.9 e versões posteriores, o operador `->` serve como um alias para a função `JSON_EXTRACT()` quando usado com dois argumentos, um identificador de coluna à esquerda e um caminho JSON (um literal de string) à direita que é avaliado contra o documento JSON (o valor da coluna). Você pode usar tais expressões no lugar de referências de coluna sempre que elas ocorrem em declarações SQL.

As duas declarações `SELECT` mostradas aqui produzem o mesmo resultado:

  ```sql
  mysql> SELECT c, JSON_EXTRACT(c, "$.id"), g
       > FROM jemp
       > WHERE JSON_EXTRACT(c, "$.id") > 1
       > ORDER BY JSON_EXTRACT(c, "$.name");
  +-------------------------------+-----------+------+
  | c                             | c->"$.id" | g    |
  +-------------------------------+-----------+------+
  | {"id": "3", "name": "Barney"} | "3"       |    3 |
  | {"id": "4", "name": "Betty"}  | "4"       |    4 |
  | {"id": "2", "name": "Wilma"}  | "2"       |    2 |
  +-------------------------------+-----------+------+
  3 rows in set (0.00 sec)

  mysql> SELECT c, c->"$.id", g
       > FROM jemp
       > WHERE c->"$.id" > 1
       > ORDER BY c->"$.name";
  +-------------------------------+-----------+------+
  | c                             | c->"$.id" | g    |
  +-------------------------------+-----------+------+
  | {"id": "3", "name": "Barney"} | "3"       |    3 |
  | {"id": "4", "name": "Betty"}  | "4"       |    4 |
  | {"id": "2", "name": "Wilma"}  | "2"       |    2 |
  +-------------------------------+-----------+------+
  3 rows in set (0.00 sec)
  ```

Essa funcionalidade não se limita ao `SELECT`, como mostrado aqui:

  ```sql
  mysql> ALTER TABLE jemp ADD COLUMN n INT;
  Query OK, 0 rows affected (0.68 sec)
  Records: 0  Duplicates: 0  Warnings: 0

  mysql> UPDATE jemp SET n=1 WHERE c->"$.id" = "4";
  Query OK, 1 row affected (0.04 sec)
  Rows matched: 1  Changed: 1  Warnings: 0

  mysql> SELECT c, c->"$.id", g, n
       > FROM jemp
       > WHERE JSON_EXTRACT(c, "$.id") > 1
       > ORDER BY c->"$.name";
  +-------------------------------+-----------+------+------+
  | c                             | c->"$.id" | g    | n    |
  +-------------------------------+-----------+------+------+
  | {"id": "3", "name": "Barney"} | "3"       |    3 | NULL |
  | {"id": "4", "name": "Betty"}  | "4"       |    4 |    1 |
  | {"id": "2", "name": "Wilma"}  | "2"       |    2 | NULL |
  +-------------------------------+-----------+------+------+
  3 rows in set (0.00 sec)

  mysql> DELETE FROM jemp WHERE c->"$.id" = "4";
  Query OK, 1 row affected (0.04 sec)

  mysql> SELECT c, c->"$.id", g, n
       > FROM jemp
       > WHERE JSON_EXTRACT(c, "$.id") > 1
       > ORDER BY c->"$.name";
  +-------------------------------+-----------+------+------+
  | c                             | c->"$.id" | g    | n    |
  +-------------------------------+-----------+------+------+
  | {"id": "3", "name": "Barney"} | "3"       |    3 | NULL |
  | {"id": "2", "name": "Wilma"}  | "2"       |    2 | NULL |
  +-------------------------------+-----------+------+------+
  2 rows in set (0.00 sec)
  ```

(Veja "Indicar uma coluna gerada para fornecer um índice de coluna JSON", para as declarações usadas para criar e preencher a tabela mostrada anteriormente.)

Isso também funciona com valores de matriz JSON, como mostrado aqui:

  ```sql
  mysql> CREATE TABLE tj10 (a JSON, b INT);
  Query OK, 0 rows affected (0.26 sec)

  mysql> INSERT INTO tj10
       > VALUES ("[3,10,5,17,44]", 33), ("[3,10,5,17,[22,44,66]]", 0);
  Query OK, 1 row affected (0.04 sec)

  mysql> SELECT a->"$[4]" FROM tj10;
  +--------------+
  | a->"$[4]"    |
  +--------------+
  | 44           |
  | [22, 44, 66] |
  +--------------+
  2 rows in set (0.00 sec)

  mysql> SELECT * FROM tj10 WHERE a->"$[0]" = 3;
  +------------------------------+------+
  | a                            | b    |
  +------------------------------+------+
  | [3, 10, 5, 17, 44]           |   33 |
  | [3, 10, 5, 17, [22, 44, 66]] |    0 |
  +------------------------------+------+
  2 rows in set (0.00 sec)
  ```

Os arrays aninhados são suportados. Uma expressão que usa `->` é avaliada como `NULL` se não for encontrada uma chave correspondente no documento JSON alvo, como mostrado aqui:

  ```sql
  mysql> SELECT * FROM tj10 WHERE a->"$[4][1]" IS NOT NULL;
  +------------------------------+------+
  | a                            | b    |
  +------------------------------+------+
  | [3, 10, 5, 17, [22, 44, 66]] |    0 |
  +------------------------------+------+

  mysql> SELECT a->"$[4][1]" FROM tj10;
  +--------------+
  | a->"$[4][1]" |
  +--------------+
  | NULL         |
  | 44           |
  +--------------+
  2 rows in set (0.00 sec)
  ```

Esse é o mesmo comportamento observado em casos semelhantes quando se usa `JSON_EXTRACT()`:

  ```sql
  mysql> SELECT JSON_EXTRACT(a, "$[4][1]") FROM tj10;
  +----------------------------+
  | JSON_EXTRACT(a, "$[4][1]") |
  +----------------------------+
  | NULL                       |
  | 44                         |
  +----------------------------+
  2 rows in set (0.00 sec)
  ```

* `column->>path`

Este é um operador de extração sem aspas aprimorado disponível no MySQL 5.7.13 e versões posteriores. Enquanto o operador `->` simplesmente extrai um valor, o operador `->>`, além disso, desasuga o resultado extraído. Em outras palavras, dado um valor da coluna `JSON` *`column`* e uma expressão de caminho *`path`* (uma literal de string), as seguintes três expressões retornam o mesmo valor:

+ `JSON_UNQUOTE(` [`JSON_EXTRACT(column, path) )`](json-search-functions.html#function_json-extract)

+ `JSON_UNQUOTE(column` `->` `path)`

+ `column->>path`

O operador `->>` pode ser usado sempre que o `JSON_UNQUOTE(JSON_EXTRACT())` seria permitido. Isso inclui (mas não se limita a) listas `SELECT`, cláusulas `WHERE` e `HAVING`, e cláusulas `ORDER BY` e `GROUP BY`.

As próximas declarações demonstram algumas equivalências do operador `->>` com outras expressões no cliente **mysql**:

  ```sql
  mysql> SELECT * FROM jemp WHERE g > 2;
  +-------------------------------+------+
  | c                             | g    |
  +-------------------------------+------+
  | {"id": "3", "name": "Barney"} |    3 |
  | {"id": "4", "name": "Betty"}  |    4 |
  +-------------------------------+------+
  2 rows in set (0.01 sec)

  mysql> SELECT c->'$.name' AS name
      ->     FROM jemp WHERE g > 2;
  +----------+
  | name     |
  +----------+
  | "Barney" |
  | "Betty"  |
  +----------+
  2 rows in set (0.00 sec)

  mysql> SELECT JSON_UNQUOTE(c->'$.name') AS name
      ->     FROM jemp WHERE g > 2;
  +--------+
  | name   |
  +--------+
  | Barney |
  | Betty  |
  +--------+
  2 rows in set (0.00 sec)

  mysql> SELECT c->>'$.name' AS name
      ->     FROM jemp WHERE g > 2;
  +--------+
  | name   |
  +--------+
  | Barney |
  | Betty  |
  +--------+
  2 rows in set (0.00 sec)
  ```

Veja "Indexação de uma coluna gerada para fornecer um índice de coluna JSON", para as declarações SQL usadas para criar e preencher a tabela `jemp` no conjunto de exemplos que foi mostrado anteriormente.

Esse operador também pode ser usado com arrays JSON, como mostrado aqui:

  ```sql
  mysql> CREATE TABLE tj10 (a JSON, b INT);
  Query OK, 0 rows affected (0.26 sec)

  mysql> INSERT INTO tj10 VALUES
      ->     ('[3,10,5,"x",44]', 33),
      ->     ('[3,10,5,17,[22,"y",66]]', 0);
  Query OK, 2 rows affected (0.04 sec)
  Records: 2  Duplicates: 0  Warnings: 0

  mysql> SELECT a->"$[3]", a->"$[4][1]" FROM tj10;
  +-----------+--------------+
  | a->"$[3]" | a->"$[4][1]" |
  +-----------+--------------+
  | "x"       | NULL         |
  | 17        | "y"          |
  +-----------+--------------+
  2 rows in set (0.00 sec)

  mysql> SELECT a->>"$[3]", a->>"$[4][1]" FROM tj10;
  +------------+---------------+
  | a->>"$[3]" | a->>"$[4][1]" |
  +------------+---------------+
  | x          | NULL          |
  | 17         | y             |
  +------------+---------------+
  2 rows in set (0.00 sec)
  ```

Assim como no caso de `->`, o operador `->>` é sempre expandido na saída de `EXPLAIN`, como demonstra o seguinte exemplo:

  ```sql
  mysql> EXPLAIN SELECT c->>'$.name' AS name
      ->     FROM jemp WHERE g > 2\G
  *************************** 1. row ***************************
             id: 1
    select_type: SIMPLE
          table: jemp
     partitions: NULL
           type: range
  possible_keys: i
            key: i
        key_len: 5
            ref: NULL
           rows: 2
       filtered: 100.00
          Extra: Using where
  1 row in set, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Note
     Code: 1003
  Message: /* select#1 */ select
  json_unquote(json_extract(`jtest`.`jemp`.`c`,'$.name')) AS `name` from
  `jtest`.`jemp` where (`jtest`.`jemp`.`g` > 2)
  1 row in set (0.00 sec)
  ```

Isso é semelhante à forma como o MySQL expande o operador `->` nas mesmas circunstâncias.

O operador `->>` foi adicionado no MySQL 5.7.13.

* `JSON_KEYS(json_doc[, path])`(json-search-functions.html#function_json-keys)

Retorna as chaves do valor de nível superior de um objeto JSON como um array JSON, ou, se um argumento *`path`* for fornecido, as chaves de nível superior do caminho selecionado. Retorna `NULL` se qualquer argumento for `NULL`, o argumento *`json_doc`* não for um objeto, ou *`path`*, se fornecido, não localizar um objeto. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou o argumento *`path`* não for uma expressão de caminho válida ou contenha um `*` ou `**` wildcard.

O array de resultados está vazio se o objeto selecionado estiver vazio. Se o valor do nível superior tiver subobjetos aninhados, o valor de retorno não incluirá as chaves desses subobjetos.

  ```sql
  mysql> SELECT JSON_KEYS('{"a": 1, "b": {"c": 30}}');
  +---------------------------------------+
  | JSON_KEYS('{"a": 1, "b": {"c": 30}}') |
  +---------------------------------------+
  | ["a", "b"]                            |
  +---------------------------------------+
  mysql> SELECT JSON_KEYS('{"a": 1, "b": {"c": 30}}', '$.b');
  +----------------------------------------------+
  | JSON_KEYS('{"a": 1, "b": {"c": 30}}', '$.b') |
  +----------------------------------------------+
  | ["c"]                                        |
  +----------------------------------------------+
  ```

* `JSON_SEARCH(json_doc, one_or_all, search_str[, escape_char[, path] ...])`(json-search-functions.html#function_json-search)

Retorna o caminho para a string fornecida dentro de um documento JSON. Retorna `NULL` se qualquer um dos argumentos *`json_doc`*, *`search_str`* ou *`path`* existir; não existe *`NULL`* dentro do documento; ou *`search_str`* não é encontrado. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido, qualquer argumento *`path`* não for uma expressão de caminho válida, *`one_or_all`* não for `'one'` ou `'all'`, ou *`escape_char`* não for uma expressão constante.

O argumento *`one_or_all`* afeta a pesquisa da seguinte forma:

+ `'one'`: A pesquisa termina após a primeira correspondência e retorna uma string de caminho. Não está definido qual correspondência é considerada a primeira.

+ `'all'`: A pesquisa retorna todas as strings de caminho correspondentes, de modo que nenhum caminho duplicado seja incluído. Se houver várias strings, elas são autoenroladas como um array. A ordem dos elementos do array é indefinida.

Dentro do argumento da string de busca *`search_str`*, os caracteres `%` e `_` funcionam como para o operador `LIKE`: `%` corresponde a qualquer número de caracteres (incluindo zero caracteres), e `_` corresponde exatamente a um caractere.

Para especificar um caractere literal `%` ou `_` na string de pesquisa, anteceda-o com o caractere de escape. O padrão é `\`, se o argumento *`escape_char`* estiver ausente ou `NULL`. Caso contrário, *`escape_char`* deve ser uma constante que seja vazia ou um caractere.

Para obter mais informações sobre o comportamento de correspondência e caracteres de escape, consulte a descrição de `LIKE` na Seção 12.8.1, “Funções e Operadores de Comparação de Cadeia”. Para o tratamento de caracteres de escape, uma diferença em relação ao comportamento de `LIKE` é que o caractere de escape para `JSON_SEARCH()` deve ser avaliado como uma constante no momento da compilação, e não apenas no momento da execução. Por exemplo, se `JSON_SEARCH()` é usado em uma declaração preparada e o argumento *`escape_char`* é fornecido usando um parâmetro `?`, o valor do parâmetro pode ser constante no momento da execução, mas não no momento da compilação.

*`search_str`* e *`path`* são sempre interpretados como strings utf8mb4, independentemente de sua codificação real. Este é um problema conhecido que é corrigido no MySQL 8.0 (Bug #32449181).

  ```sql
  mysql> SET @j = '["abc", [{"k": "10"}, "def"], {"x":"abc"}, {"y":"bcd"}]';

  mysql> SELECT JSON_SEARCH(@j, 'one', 'abc');
  +-------------------------------+
  | JSON_SEARCH(@j, 'one', 'abc') |
  +-------------------------------+
  | "$[0]"                        |
  +-------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', 'abc');
  +-------------------------------+
  | JSON_SEARCH(@j, 'all', 'abc') |
  +-------------------------------+
  | ["$[0]", "$[2].x"]            |
  +-------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', 'ghi');
  +-------------------------------+
  | JSON_SEARCH(@j, 'all', 'ghi') |
  +-------------------------------+
  | NULL                          |
  +-------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '10');
  +------------------------------+
  | JSON_SEARCH(@j, 'all', '10') |
  +------------------------------+
  | "$[1][0].k"                  |
  +------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '10', NULL, '$');
  +-----------------------------------------+
  | JSON_SEARCH(@j, 'all', '10', NULL, '$') |
  +-----------------------------------------+
  | "$[1][0].k"                             |
  +-----------------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '10', NULL, '$[*]');
  +--------------------------------------------+
  | JSON_SEARCH(@j, 'all', '10', NULL, '$[*]') |
  +--------------------------------------------+
  | "$[1][0].k"                                |
  +--------------------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '10', NULL, '$**.k');
  +---------------------------------------------+
  | JSON_SEARCH(@j, 'all', '10', NULL, '$**.k') |
  +---------------------------------------------+
  | "$[1][0].k"                                 |
  +---------------------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '10', NULL, '$[*][0].k');
  +-------------------------------------------------+
  | JSON_SEARCH(@j, 'all', '10', NULL, '$[*][0].k') |
  +-------------------------------------------------+
  | "$[1][0].k"                                     |
  +-------------------------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '10', NULL, '$[1]');
  +--------------------------------------------+
  | JSON_SEARCH(@j, 'all', '10', NULL, '$[1]') |
  +--------------------------------------------+
  | "$[1][0].k"                                |
  +--------------------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '10', NULL, '$[1][0]');
  +-----------------------------------------------+
  | JSON_SEARCH(@j, 'all', '10', NULL, '$[1][0]') |
  +-----------------------------------------------+
  | "$[1][0].k"                                   |
  +-----------------------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', 'abc', NULL, '$[2]');
  +---------------------------------------------+
  | JSON_SEARCH(@j, 'all', 'abc', NULL, '$[2]') |
  +---------------------------------------------+
  | "$[2].x"                                    |
  +---------------------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '%a%');
  +-------------------------------+
  | JSON_SEARCH(@j, 'all', '%a%') |
  +-------------------------------+
  | ["$[0]", "$[2].x"]            |
  +-------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '%b%');
  +-------------------------------+
  | JSON_SEARCH(@j, 'all', '%b%') |
  +-------------------------------+
  | ["$[0]", "$[2].x", "$[3].y"]  |
  +-------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '%b%', NULL, '$[0]');
  +---------------------------------------------+
  | JSON_SEARCH(@j, 'all', '%b%', NULL, '$[0]') |
  +---------------------------------------------+
  | "$[0]"                                      |
  +---------------------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '%b%', NULL, '$[2]');
  +---------------------------------------------+
  | JSON_SEARCH(@j, 'all', '%b%', NULL, '$[2]') |
  +---------------------------------------------+
  | "$[2].x"                                    |
  +---------------------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '%b%', NULL, '$[1]');
  +---------------------------------------------+
  | JSON_SEARCH(@j, 'all', '%b%', NULL, '$[1]') |
  +---------------------------------------------+
  | NULL                                        |
  +---------------------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '%b%', '', '$[1]');
  +-------------------------------------------+
  | JSON_SEARCH(@j, 'all', '%b%', '', '$[1]') |
  +-------------------------------------------+
  | NULL                                      |
  +-------------------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '%b%', '', '$[3]');
  +-------------------------------------------+
  | JSON_SEARCH(@j, 'all', '%b%', '', '$[3]') |
  +-------------------------------------------+
  | "$[3].y"                                  |
  +-------------------------------------------+
  ```

Para mais informações sobre a sintaxe de caminho JSON suportada pelo MySQL, incluindo as regras que regem os operadores de comodinho `*` e `**`, consulte Sintaxe de caminho JSON.

### 12.17.4 Funções que modificam valores JSON

As funções nesta seção modificam os valores do JSON e retornam o resultado.

* `JSON_APPEND(json_doc, path, val[, path, val] ...)`(json-modification-functions.html#function_json-append)

Adiciona valores ao final dos arrays indicados dentro de um documento JSON e retorna o resultado. Esta função foi renomeada para `JSON_ARRAY_APPEND()` no MySQL 5.7.9; o alias `JSON_APPEND()` é agora desatualizado no MySQL 5.7 e é removido no MySQL 8.0.

* `JSON_ARRAY_APPEND(json_doc, path, val[, path, val] ...)`(json-modification-functions.html#function_json-array-append)

Adiciona valores ao final dos arrays indicados dentro de um documento JSON e retorna o resultado. Retorna `NULL` se qualquer argumento for `NULL`. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou se qualquer argumento *`path`* não for uma expressão de caminho válida ou contiver um `*` ou `**` wildcard.

Os pares de valores de caminho são avaliados da esquerda para a direita. O documento produzido pela avaliação de um par se torna o novo valor contra o qual o próximo par é avaliado.

Se um caminho selecionar um valor escalar ou de objeto, esse valor é autoencapsulado em um array e o novo valor é adicionado a esse array. Os pares para os quais o caminho não identifica qualquer valor no documento JSON são ignorados.

  ```sql
  mysql> SET @j = '["a", ["b", "c"], "d"]';
  mysql> SELECT JSON_ARRAY_APPEND(@j, '$[1]', 1);
  +----------------------------------+
  | JSON_ARRAY_APPEND(@j, '$[1]', 1) |
  +----------------------------------+
  | ["a", ["b", "c", 1], "d"]        |
  +----------------------------------+
  mysql> SELECT JSON_ARRAY_APPEND(@j, '$[0]', 2);
  +----------------------------------+
  | JSON_ARRAY_APPEND(@j, '$[0]', 2) |
  +----------------------------------+
  | [["a", 2], ["b", "c"], "d"]      |
  +----------------------------------+
  mysql> SELECT JSON_ARRAY_APPEND(@j, '$[1][0]', 3);
  +-------------------------------------+
  | JSON_ARRAY_APPEND(@j, '$[1][0]', 3) |
  +-------------------------------------+
  | ["a", [["b", 3], "c"], "d"]         |
  +-------------------------------------+

  mysql> SET @j = '{"a": 1, "b": [2, 3], "c": 4}';
  mysql> SELECT JSON_ARRAY_APPEND(@j, '$.b', 'x');
  +------------------------------------+
  | JSON_ARRAY_APPEND(@j, '$.b', 'x')  |
  +------------------------------------+
  | {"a": 1, "b": [2, 3, "x"], "c": 4} |
  +------------------------------------+
  mysql> SELECT JSON_ARRAY_APPEND(@j, '$.c', 'y');
  +--------------------------------------+
  | JSON_ARRAY_APPEND(@j, '$.c', 'y')    |
  +--------------------------------------+
  | {"a": 1, "b": [2, 3], "c": [4, "y"]} |
  +--------------------------------------+

  mysql> SET @j = '{"a": 1}';
  mysql> SELECT JSON_ARRAY_APPEND(@j, '$', 'z');
  +---------------------------------+
  | JSON_ARRAY_APPEND(@j, '$', 'z') |
  +---------------------------------+
  | [{"a": 1}, "z"]                 |
  +---------------------------------+
  ```

* `JSON_ARRAY_INSERT(json_doc, path, val[, path, val] ...)`(json-modification-functions.html#function_json-array-insert)

Atualiza um documento JSON, inserindo-o em um array dentro do documento e retornando o documento modificado. Retorna `NULL` se qualquer argumento for `NULL`. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou se qualquer argumento *`path`* não for uma expressão de caminho válida ou contiver um `*` ou `**` wildcard ou não terminar com um identificador de elemento de array.

Os pares de valores de caminho são avaliados da esquerda para a direita. O documento produzido pela avaliação de um par se torna o novo valor contra o qual o próximo par é avaliado.

Os pares para os quais o caminho não identifica nenhum array no documento JSON são ignorados. Se um caminho identificar um elemento de array, o valor correspondente é inserido naquela posição do elemento, deslocando quaisquer valores subsequentes para a direita. Se um caminho identificar uma posição de array além do final de um array, o valor é inserido no final do array.

  ```sql
  mysql> SET @j = '["a", {"b": [1, 2]}, [3, 4]]';
  mysql> SELECT JSON_ARRAY_INSERT(@j, '$[1]', 'x');
  +------------------------------------+
  | JSON_ARRAY_INSERT(@j, '$[1]', 'x') |
  +------------------------------------+
  | ["a", "x", {"b": [1, 2]}, [3, 4]]  |
  +------------------------------------+
  mysql> SELECT JSON_ARRAY_INSERT(@j, '$[100]', 'x');
  +--------------------------------------+
  | JSON_ARRAY_INSERT(@j, '$[100]', 'x') |
  +--------------------------------------+
  | ["a", {"b": [1, 2]}, [3, 4], "x"]    |
  +--------------------------------------+
  mysql> SELECT JSON_ARRAY_INSERT(@j, '$[1].b[0]', 'x');
  +-----------------------------------------+
  | JSON_ARRAY_INSERT(@j, '$[1].b[0]', 'x') |
  +-----------------------------------------+
  | ["a", {"b": ["x", 1, 2]}, [3, 4]]       |
  +-----------------------------------------+
  mysql> SELECT JSON_ARRAY_INSERT(@j, '$[2][1]', 'y');
  +---------------------------------------+
  | JSON_ARRAY_INSERT(@j, '$[2][1]', 'y') |
  +---------------------------------------+
  | ["a", {"b": [1, 2]}, [3, "y", 4]]     |
  +---------------------------------------+
  mysql> SELECT JSON_ARRAY_INSERT(@j, '$[0]', 'x', '$[2][1]', 'y');
  +----------------------------------------------------+
  | JSON_ARRAY_INSERT(@j, '$[0]', 'x', '$[2][1]', 'y') |
  +----------------------------------------------------+
  | ["x", "a", {"b": [1, 2]}, [3, 4]]                  |
  +----------------------------------------------------+
  ```

As modificações anteriores afetam as posições dos seguintes elementos na matriz, portanto, os caminhos subsequentes na mesma chamada `JSON_ARRAY_INSERT()` devem levar isso em consideração. No exemplo final, o segundo caminho não insere nada porque o caminho não corresponde mais a nada após o primeiro inserido.

* `JSON_INSERT(json_doc, path, val[, path, val] ...)`(json-modification-functions.html#function_json-insert)

Insere dados em um documento JSON e retorna o resultado. Retorna `NULL` se qualquer argumento for `NULL`. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou se qualquer argumento *`path`* não for uma expressão de caminho válida ou contiver um `*` ou `**` wildcard.

Os pares de valores de caminho são avaliados da esquerda para a direita. O documento produzido pela avaliação de um par se torna o novo valor contra o qual o próximo par é avaliado.

Um par de valor de caminho para um caminho existente no documento é ignorado e não sobrescreve o valor existente do documento. Um par de valor de caminho para um caminho não existente no documento adiciona o valor ao documento se o caminho identificar um desses tipos de valores:

+ Um membro não presente em um objeto existente. O membro é adicionado ao objeto e associado ao novo valor.

+ Uma posição além do final de uma matriz existente. A matriz é estendida com o novo valor. Se o valor existente não for uma matriz, ela é autoenrolada como uma matriz, depois estendida com o novo valor.

Caso contrário, um par de valor de caminho para um caminho não existente no documento é ignorado e não tem efeito.

Para uma comparação de `JSON_INSERT()`, `JSON_REPLACE()` e `JSON_SET()`, veja a discussão de `JSON_SET()`.

  ```sql
  mysql> SET @j = '{ "a": 1, "b": [2, 3]}';
  mysql> SELECT JSON_INSERT(@j, '$.a', 10, '$.c', '[true, false]');
  +----------------------------------------------------+
  | JSON_INSERT(@j, '$.a', 10, '$.c', '[true, false]') |
  +----------------------------------------------------+
  | {"a": 1, "b": [2, 3], "c": "[true, false]"}        |
  +----------------------------------------------------+
  ```

O terceiro e último valor listado no resultado é uma string citada e não um array como o segundo (que não é citado na saída); nenhum tipo de conversão de valores para o tipo JSON é realizada. Para inserir o array como um array, você deve realizar tais conversões explicitamente, como mostrado aqui:

  ```sql
  mysql> SELECT JSON_INSERT(@j, '$.a', 10, '$.c', CAST('[true, false]' AS JSON));
  +------------------------------------------------------------------+
  | JSON_INSERT(@j, '$.a', 10, '$.c', CAST('[true, false]' AS JSON)) |
  +------------------------------------------------------------------+
  | {"a": 1, "b": [2, 3], "c": [true, false]}                        |
  +------------------------------------------------------------------+
  1 row in set (0.00 sec)
  ```

* `JSON_MERGE(json_doc, json_doc[, json_doc] ...)`(json-modification-functions.html#function_json-merge)

Combina dois ou mais documentos JSON. Sinônimo de `JSON_MERGE_PRESERVE()`; descontinuado no MySQL 5.7.22 e sujeito à remoção em uma versão futura.

  ```sql
  mysql> SELECT JSON_MERGE('[1, 2]', '[true, false]');
  +---------------------------------------+
  | JSON_MERGE('[1, 2]', '[true, false]') |
  +---------------------------------------+
  | [1, 2, true, false]                   |
  +---------------------------------------+
  1 row in set, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Warning
     Code: 1287
  Message: 'JSON_MERGE' is deprecated and will be removed in a future release. \
   Please use JSON_MERGE_PRESERVE/JSON_MERGE_PATCH instead
  1 row in set (0.00 sec)
  ```

Para exemplos adicionais, consulte a entrada para `JSON_MERGE_PRESERVE()`.

* `JSON_MERGE_PATCH(json_doc, json_doc[, json_doc] ...)`(json-modification-functions.html#function_json-merge-patch)

Realiza uma fusão conforme a [RFC 7396][(https://tools.ietf.org/html/rfc7396)] de dois ou mais documentos JSON e retorna o resultado fusão, sem preservar membros com chaves duplicadas. Arrisca um erro se pelo menos um dos documentos passados como argumentos para esta função não for válido.

Nota

Para uma explicação e um exemplo das diferenças entre esta função e `JSON_MERGE_PRESERVE()`, veja JSON_MERGE_PATCH() em comparação com JSON_MERGE_PRESERVE() em comparação com JSON_MERGE_PRESERVE()).

`JSON_MERGE_PATCH()` realiza uma fusão da seguinte forma:

1. Se o primeiro argumento não for um objeto, o resultado da fusão é o mesmo como se um objeto vazio tivesse sido fundido com o segundo argumento.

2. Se o segundo argumento não for um objeto, o resultado da fusão é o segundo argumento.

3. Se ambos os argumentos forem objetos, o resultado da fusão será um objeto com os seguintes membros:

+ Todos os membros do primeiro objeto que não tenham um membro correspondente com a mesma chave no segundo objeto.

+ Todos os membros do segundo objeto que não tenham uma chave correspondente no primeiro objeto, e cujo valor não seja o literal JSON `null`.

+ Todos os membros com uma chave que existe tanto no primeiro quanto no segundo objeto, e cujo valor no segundo objeto não é o literal JSON `null`. Os valores desses membros são os resultados da fusão recursiva do valor no primeiro objeto com o valor no segundo objeto.

Para obter informações adicionais, consulte Normalização, Fusão e Autoembalamento de Valores JSON.

  ```sql
  mysql> SELECT JSON_MERGE_PATCH('[1, 2]', '[true, false]');
  +---------------------------------------------+
  | JSON_MERGE_PATCH('[1, 2]', '[true, false]') |
  +---------------------------------------------+
  | [true, false]                               |
  +---------------------------------------------+

  mysql> SELECT JSON_MERGE_PATCH('{"name": "x"}', '{"id": 47}');
  +-------------------------------------------------+
  | JSON_MERGE_PATCH('{"name": "x"}', '{"id": 47}') |
  +-------------------------------------------------+
  | {"id": 47, "name": "x"}                         |
  +-------------------------------------------------+

  mysql> SELECT JSON_MERGE_PATCH('1', 'true');
  +-------------------------------+
  | JSON_MERGE_PATCH('1', 'true') |
  +-------------------------------+
  | true                          |
  +-------------------------------+

  mysql> SELECT JSON_MERGE_PATCH('[1, 2]', '{"id": 47}');
  +------------------------------------------+
  | JSON_MERGE_PATCH('[1, 2]', '{"id": 47}') |
  +------------------------------------------+
  | {"id": 47}                               |
  +------------------------------------------+

  mysql> SELECT JSON_MERGE_PATCH('{ "a": 1, "b":2 }',
       >     '{ "a": 3, "c":4 }');
  +-----------------------------------------------------------+
  | JSON_MERGE_PATCH('{ "a": 1, "b":2 }','{ "a": 3, "c":4 }') |
  +-----------------------------------------------------------+
  | {"a": 3, "b": 2, "c": 4}                                  |
  +-----------------------------------------------------------+

  mysql> SELECT JSON_MERGE_PATCH('{ "a": 1, "b":2 }','{ "a": 3, "c":4 }',
       >     '{ "a": 5, "d":6 }');
  +-------------------------------------------------------------------------------+
  | JSON_MERGE_PATCH('{ "a": 1, "b":2 }','{ "a": 3, "c":4 }','{ "a": 5, "d":6 }') |
  +-------------------------------------------------------------------------------+
  | {"a": 5, "b": 2, "c": 4, "d": 6}                                              |
  +-------------------------------------------------------------------------------+
  ```

Você pode usar essa função para remover um membro, especificando `null` como o valor do mesmo membro no segundo argumento, como mostrado aqui:

  ```sql
  mysql> SELECT JSON_MERGE_PATCH('{"a":1, "b":2}', '{"b":null}');
  +--------------------------------------------------+
  | JSON_MERGE_PATCH('{"a":1, "b":2}', '{"b":null}') |
  +--------------------------------------------------+
  | {"a": 1}                                         |
  +--------------------------------------------------+
  ```

Este exemplo mostra que a função opera de forma recursiva; ou seja, os valores dos membros não se limitam a escalares, mas sim podem ser documentos JSON por si mesmos:

  ```sql
  mysql> SELECT JSON_MERGE_PATCH('{"a":{"x":1}}', '{"a":{"y":2}}');
  +----------------------------------------------------+
  | JSON_MERGE_PATCH('{"a":{"x":1}}', '{"a":{"y":2}}') |
  +----------------------------------------------------+
  | {"a": {"x": 1, "y": 2}}                            |
  +----------------------------------------------------+
  ```

`JSON_MERGE_PATCH()` é suportado no MySQL 5.7.22 e versões posteriores.

**JSON_MERGE_PATCH() em comparação com JSON_MERGE_PRESERVE().** O comportamento do `JSON_MERGE_PATCH()` é o mesmo do `JSON_MERGE_PRESERVE()`, com as seguintes duas exceções:

+ `JSON_MERGE_PATCH()` remove qualquer membro no primeiro objeto com uma chave correspondente no segundo objeto, desde que o valor associado à chave no segundo objeto não seja JSON `null`.

+ Se o segundo objeto tiver um membro com uma chave que corresponde a um membro no primeiro objeto, `JSON_MERGE_PATCH()` *substitui* o valor no primeiro objeto pelo valor no segundo objeto, enquanto `JSON_MERGE_PRESERVE()` *apresenta* o segundo valor ao valor do primeiro.

Este exemplo compara os resultados da fusão dos mesmos 3 objetos JSON, cada um com uma chave correspondente `"a"`, com cada uma dessas duas funções:

  ```sql
  mysql> SET @x = '{ "a": 1, "b": 2 }',
       >     @y = '{ "a": 3, "c": 4 }',
       >     @z = '{ "a": 5, "d": 6 }';

  mysql> SELECT  JSON_MERGE_PATCH(@x, @y, @z)    AS Patch,
      ->         JSON_MERGE_PRESERVE(@x, @y, @z) AS Preserve\G
  *************************** 1. row ***************************
     Patch: {"a": 5, "b": 2, "c": 4, "d": 6}
  Preserve: {"a": [1, 3, 5], "b": 2, "c": 4, "d": 6}
  ```

* `JSON_MERGE_PRESERVE(json_doc, json_doc[, json_doc] ...)`(json-modification-functions.html#function_json-merge-preserve)

Conjunta dois ou mais documentos JSON e retorna o resultado combinado. Retorna `NULL` se qualquer argumento for `NULL`. Um erro ocorre se qualquer argumento não for um documento JSON válido.

A fusão ocorre de acordo com as regras a seguir. Para informações adicionais, consulte Normalização, Fusão e Autoembalamento de Valores JSON.

+ Arrays adjacentes são mesclados em um único array.
  + Objetos adjacentes são mesclados em um único objeto.
  + Um valor escalar é autoenrolado como um array e mesclado como um array.

+ Um array adjacente e um objeto são mesclados ao envolver automaticamente o objeto como um array e mesclar os dois arrays.

  ```sql
  mysql> SELECT JSON_MERGE_PRESERVE('[1, 2]', '[true, false]');
  +------------------------------------------------+
  | JSON_MERGE_PRESERVE('[1, 2]', '[true, false]') |
  +------------------------------------------------+
  | [1, 2, true, false]                            |
  +------------------------------------------------+

  mysql> SELECT JSON_MERGE_PRESERVE('{"name": "x"}', '{"id": 47}');
  +----------------------------------------------------+
  | JSON_MERGE_PRESERVE('{"name": "x"}', '{"id": 47}') |
  +----------------------------------------------------+
  | {"id": 47, "name": "x"}                            |
  +----------------------------------------------------+

  mysql> SELECT JSON_MERGE_PRESERVE('1', 'true');
  +----------------------------------+
  | JSON_MERGE_PRESERVE('1', 'true') |
  +----------------------------------+
  | [1, true]                        |
  +----------------------------------+

  mysql> SELECT JSON_MERGE_PRESERVE('[1, 2]', '{"id": 47}');
  +---------------------------------------------+
  | JSON_MERGE_PRESERVE('[1, 2]', '{"id": 47}') |
  +---------------------------------------------+
  | [1, 2, {"id": 47}]                          |
  +---------------------------------------------+

  mysql> SELECT JSON_MERGE_PRESERVE('{ "a": 1, "b": 2 }',
       >    '{ "a": 3, "c": 4 }');
  +--------------------------------------------------------------+
  | JSON_MERGE_PRESERVE('{ "a": 1, "b": 2 }','{ "a": 3, "c":4 }') |
  +--------------------------------------------------------------+
  | {"a": [1, 3], "b": 2, "c": 4}                                |
  +--------------------------------------------------------------+

  mysql> SELECT JSON_MERGE_PRESERVE('{ "a": 1, "b": 2 }','{ "a": 3, "c": 4 }',
       >    '{ "a": 5, "d": 6 }');
  +----------------------------------------------------------------------------------+
  | JSON_MERGE_PRESERVE('{ "a": 1, "b": 2 }','{ "a": 3, "c": 4 }','{ "a": 5, "d": 6 }') |
  +----------------------------------------------------------------------------------+
  | {"a": [1, 3, 5], "b": 2, "c": 4, "d": 6}                                         |
  +----------------------------------------------------------------------------------+
  ```

Essa função foi adicionada no MySQL 5.7.22 como sinônimo de `JSON_MERGE()`. A função `JSON_MERGE()` é agora desaconselhada e está sujeita à remoção em uma versão futura do MySQL.

Essa função é semelhante, mas difere de `JSON_MERGE_PATCH()` em aspectos significativos; consulte JSON_MERGE_PATCH() em comparação com JSON_MERGE_PRESERVE() em comparação com JSON_MERGE_PRESERVE()"), para mais informações.

* `JSON_REMOVE(json_doc, path[, path] ...)`(json-modification-functions.html#function_json-remove)

Remove dados de um documento JSON e retorna o resultado. Retorna `NULL` se qualquer argumento for `NULL`. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou se qualquer argumento *`path`* não for uma expressão de caminho válida ou for `$` ou contém um `*` ou `**` wildcard.

Os argumentos *`path`* são avaliados da esquerda para a direita. O documento produzido ao avaliar um caminho se torna o novo valor contra o qual o próximo caminho é avaliado.

Não é um erro se o elemento a ser removido não existir no documento; nesse caso, o caminho não afeta o documento.

  ```sql
  mysql> SET @j = '["a", ["b", "c"], "d"]';
  mysql> SELECT JSON_REMOVE(@j, '$[1]');
  +-------------------------+
  | JSON_REMOVE(@j, '$[1]') |
  +-------------------------+
  | ["a", "d"]              |
  +-------------------------+
  ```

* `JSON_REPLACE(json_doc, path, val[, path, val] ...)`(json-modification-functions.html#function_json-replace)

Substitui os valores existentes em um documento JSON e retorna o resultado. Retorna `NULL` se *`json_doc`* ou qualquer *`path`* argumento é `NULL`. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou qualquer *`path`* argumento não for uma expressão de caminho válida ou contenha um `*` ou `**` wildcard.

Os pares de valores de caminho são avaliados da esquerda para a direita. O documento produzido pela avaliação de um par se torna o novo valor contra o qual o próximo par é avaliado.

Uma combinação de valor de caminho para um caminho existente no documento sobrescreve o valor existente do documento com o novo valor. Uma combinação de valor de caminho para um caminho não existente no documento é ignorada e não tem efeito.

Para uma comparação de `JSON_INSERT()`, `JSON_REPLACE()` e `JSON_SET()`, veja a discussão de `JSON_SET()`.

  ```sql
  mysql> SET @j = '{ "a": 1, "b": [2, 3]}';
  mysql> SELECT JSON_REPLACE(@j, '$.a', 10, '$.c', '[true, false]');
  +-----------------------------------------------------+
  | JSON_REPLACE(@j, '$.a', 10, '$.c', '[true, false]') |
  +-----------------------------------------------------+
  | {"a": 10, "b": [2, 3]}                              |
  +-----------------------------------------------------+

  mysql> SELECT JSON_REPLACE(NULL, '$.a', 10, '$.c', '[true, false]');
  +-------------------------------------------------------+
  | JSON_REPLACE(NULL, '$.a', 10, '$.c', '[true, false]') |
  +-------------------------------------------------------+
  | NULL                                                  |
  +-------------------------------------------------------+

  mysql> SELECT JSON_REPLACE(@j, NULL, 10, '$.c', '[true, false]');
  +----------------------------------------------------+
  | JSON_REPLACE(@j, NULL, 10, '$.c', '[true, false]') |
  +----------------------------------------------------+
  | NULL                                               |
  +----------------------------------------------------+

  mysql> SELECT JSON_REPLACE(@j, '$.a', NULL, '$.c', '[true, false]');
  +-------------------------------------------------------+
  | JSON_REPLACE(@j, '$.a', NULL, '$.c', '[true, false]') |
  +-------------------------------------------------------+
  | {"a": null, "b": [2, 3]}                              |
  +-------------------------------------------------------+
  ```

* `JSON_SET(json_doc, path, val[, path, val] ...)`(json-modification-functions.html#function_json-set)

Insere ou atualiza dados em um documento JSON e retorna o resultado. Retorna `NULL` se *`json_doc`* ou *`path`* é `NULL`, ou se *`path`*, quando fornecido, não localiza um objeto. Caso contrário, ocorre um erro se o argumento *`json_doc`* não for um documento JSON válido ou se qualquer argumento *`path`* não for uma expressão de caminho válida ou contenha um `*` ou `**` wildcard.

Os pares de valores de caminho são avaliados da esquerda para a direita. O documento produzido pela avaliação de um par se torna o novo valor contra o qual o próximo par é avaliado.

Uma combinação de valor de caminho para um caminho existente no documento sobrescreve o valor existente do documento com o novo valor. Uma combinação de valor de caminho para um caminho não existente no documento adiciona o valor ao documento se o caminho identificar um desses tipos de valores:

+ Um membro não presente em um objeto existente. O membro é adicionado ao objeto e associado ao novo valor.

+ Uma posição além do final de uma matriz existente. A matriz é estendida com o novo valor. Se o valor existente não for uma matriz, ela é autoenrolada como uma matriz, depois estendida com o novo valor.

Caso contrário, um par de valor de caminho para um caminho não existente no documento é ignorado e não tem efeito.

As funções `JSON_SET()`, `JSON_INSERT()` e `JSON_REPLACE()` estão relacionadas:

+ `JSON_SET()` substitui os valores existentes e adiciona valores não existentes.

+ `JSON_INSERT()` insere valores sem substituir os valores existentes.

+ `JSON_REPLACE()` substitui apenas os valores existentes.

Os exemplos a seguir ilustram essas diferenças, usando um caminho que existe no documento (`$.a`) e outro que não existe (`$.c`):

  ```sql
  mysql> SET @j = '{ "a": 1, "b": [2, 3]}';
  mysql> SELECT JSON_SET(@j, '$.a', 10, '$.c', '[true, false]');
  +-------------------------------------------------+
  | JSON_SET(@j, '$.a', 10, '$.c', '[true, false]') |
  +-------------------------------------------------+
  | {"a": 10, "b": [2, 3], "c": "[true, false]"}    |
  +-------------------------------------------------+
  mysql> SELECT JSON_INSERT(@j, '$.a', 10, '$.c', '[true, false]');
  +----------------------------------------------------+
  | JSON_INSERT(@j, '$.a', 10, '$.c', '[true, false]') |
  +----------------------------------------------------+
  | {"a": 1, "b": [2, 3], "c": "[true, false]"}        |
  +----------------------------------------------------+
  mysql> SELECT JSON_REPLACE(@j, '$.a', 10, '$.c', '[true, false]');
  +-----------------------------------------------------+
  | JSON_REPLACE(@j, '$.a', 10, '$.c', '[true, false]') |
  +-----------------------------------------------------+
  | {"a": 10, "b": [2, 3]}                              |
  +-----------------------------------------------------+
  ```

* `JSON_UNQUOTE(json_val)`

Desfaz o valor JSON e retorna o resultado como uma string `utf8mb4`. Retorna `NULL` se o argumento for `NULL`. Um erro ocorre se o valor começar e terminar com aspas duplas, mas não for um literal válido de string JSON.

Dentro de uma cadeia, certas sequências têm um significado especial, a menos que o modo `NO_BACKSLASH_ESCAPES` SQL esteja habilitado. Cada uma dessas sequências começa com uma barra invertida (`\`), conhecida como *caractere de escape*. O MySQL reconhece as sequências de escape mostradas na Tabela 12.23, “Sequências de escape de caracteres especiais JSON_UNQUOTE() (Sequências de escape de caracteres especiais)”. Para todas as outras sequências de escape, a barra invertida é ignorada. Ou seja, o caractere escapado é interpretado como se não tivesse sido escapado. Por exemplo, `\x` é apenas `x`. Essas sequências são sensíveis ao caso. Por exemplo, `\b` é interpretado como um espaço de volta, mas `\B` é interpretado como `B`.

**Tabela 12.23 Sequências de Caracteres de Escape JSON_UNQUOTE()**

  <table><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Escape Sequence</th> <th>Personagem representado por sequência</th> </tr></thead><tbody><tr> <td><code>\"</code></td> <td>Uma citação dupla (<code>"</code>) personagem</td> </tr><tr> <td><code>\b</code></td> <td>Um caractere de recuo</td> </tr><tr> <td><code>\f</code></td> <td>Um caractere de quebra de página</td> </tr><tr> <td><code>\n</code></td> <td>Um caractere de nova string (linefeed)</td> </tr><tr> <td><code>\r</code></td> <td>Um caractere de retorno de carro</td> </tr><tr> <td><code>\t</code></td> <td>Um caractere de tabulação</td> </tr><tr> <td><code>\\</code></td> <td>Um traço de barra (<code>\</code>) personagem</td> </tr><tr> <td><code>\u<code>XXXX</code></code></td> <td>Bytes UTF-8 para valor Unicode<code>XXXX</code></td> </tr></tbody></table>

Dois exemplos simples do uso dessa função são mostrados aqui:

  ```sql
  mysql> SET @j = '"abc"';
  mysql> SELECT @j, JSON_UNQUOTE(@j);
  +-------+------------------+
  | @j    | JSON_UNQUOTE(@j) |
  +-------+------------------+
  | "abc" | abc              |
  +-------+------------------+
  mysql> SET @j = '[1, 2, 3]';
  mysql> SELECT @j, JSON_UNQUOTE(@j);
  +-----------+------------------+
  | @j        | JSON_UNQUOTE(@j) |
  +-----------+------------------+
  | [1, 2, 3] | [1, 2, 3]        |
  +-----------+------------------+
  ```

O conjunto de exemplos a seguir mostra como o `JSON_UNQUOTE` lida com escapamentos com o `NO_BACKSLASH_ESCAPES` desativado e ativado:

  ```sql
  mysql> SELECT @@sql_mode;
  +------------+
  | @@sql_mode |
  +------------+
  |            |
  +------------+

  mysql> SELECT JSON_UNQUOTE('"\\t\\u0032"');
  +------------------------------+
  | JSON_UNQUOTE('"\\t\\u0032"') |
  +------------------------------+
  |       2                           |
  +------------------------------+

  mysql> SET @@sql_mode = 'NO_BACKSLASH_ESCAPES';
  mysql> SELECT JSON_UNQUOTE('"\\t\\u0032"');
  +------------------------------+
  | JSON_UNQUOTE('"\\t\\u0032"') |
  +------------------------------+
  | \t\u0032                     |
  +------------------------------+

  mysql> SELECT JSON_UNQUOTE('"\t\u0032"');
  +----------------------------+
  | JSON_UNQUOTE('"\t\u0032"') |
  +----------------------------+
  |       2                         |
  +----------------------------+
  ```

### 12.17.5 Funções que retornam atributos de valor JSON

As funções nesta seção retornam atributos de valores JSON.

* `JSON_DEPTH(json_doc)`

Retorna a profundidade máxima de um documento JSON. Retorna `NULL` se o argumento for `NULL`. Um erro ocorre se o argumento não for um documento JSON válido.

Um array vazio, um objeto vazio ou um valor escalar tem profundidade 1. Um array não vazio que contém apenas elementos de profundidade 1 ou um objeto não vazio que contém apenas valores de membro de profundidade 1 tem profundidade 2. Caso contrário, um documento JSON tem profundidade maior que 2.

  ```sql
  mysql> SELECT JSON_DEPTH('{}'), JSON_DEPTH('[]'), JSON_DEPTH('true');
  +------------------+------------------+--------------------+
  | JSON_DEPTH('{}') | JSON_DEPTH('[]') | JSON_DEPTH('true') |
  +------------------+------------------+--------------------+
  |                1 |                1 |                  1 |
  +------------------+------------------+--------------------+
  mysql> SELECT JSON_DEPTH('[10, 20]'), JSON_DEPTH('[[], {}]');
  +------------------------+------------------------+
  | JSON_DEPTH('[10, 20]') | JSON_DEPTH('[[], {}]') |
  +------------------------+------------------------+
  |                      2 |                      2 |
  +------------------------+------------------------+
  mysql> SELECT JSON_DEPTH('[10, {"a": 20}]');
  +-------------------------------+
  | JSON_DEPTH('[10, {"a": 20}]') |
  +-------------------------------+
  |                             3 |
  +-------------------------------+
  ```

* `JSON_LENGTH(json_doc[, path])`(json-attribute-functions.html#function_json-length)

Retorna o comprimento de um documento JSON, ou, se um argumento *`path`* for fornecido, o comprimento do valor dentro do documento identificado pelo caminho. Retorna `NULL` se qualquer argumento for `NULL` ou o argumento *`path` não identificar um valor no documento. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou o argumento *`path`* não for uma expressão de caminho válida ou contenha um `*` ou `**` wildcard.

O comprimento de um documento é determinado da seguinte forma:

+ O comprimento de um escalar é 1.  
+ O comprimento de um array é o número de elementos do array.  
+ O comprimento de um objeto é o número de membros do objeto.  
+ O comprimento não conta o comprimento de arrays ou objetos aninhados.

  ```sql
  mysql> SELECT JSON_LENGTH('[1, 2, {"a": 3}]');
  +---------------------------------+
  | JSON_LENGTH('[1, 2, {"a": 3}]') |
  +---------------------------------+
  |                               3 |
  +---------------------------------+
  mysql> SELECT JSON_LENGTH('{"a": 1, "b": {"c": 30}}');
  +-----------------------------------------+
  | JSON_LENGTH('{"a": 1, "b": {"c": 30}}') |
  +-----------------------------------------+
  |                                       2 |
  +-----------------------------------------+
  mysql> SELECT JSON_LENGTH('{"a": 1, "b": {"c": 30}}', '$.b');
  +------------------------------------------------+
  | JSON_LENGTH('{"a": 1, "b": {"c": 30}}', '$.b') |
  +------------------------------------------------+
  |                                              1 |
  +------------------------------------------------+
  ```

* `JSON_TYPE(json_val)`

Retorna uma string `utf8mb4` que indica o tipo de um valor JSON. Isso pode ser um objeto, um array ou um tipo escalar, conforme mostrado aqui:

  ```sql
  mysql> SET @j = '{"a": [10, true]}';
  mysql> SELECT JSON_TYPE(@j);
  +---------------+
  | JSON_TYPE(@j) |
  +---------------+
  | OBJECT        |
  +---------------+
  mysql> SELECT JSON_TYPE(JSON_EXTRACT(@j, '$.a'));
  +------------------------------------+
  | JSON_TYPE(JSON_EXTRACT(@j, '$.a')) |
  +------------------------------------+
  | ARRAY                              |
  +------------------------------------+
  mysql> SELECT JSON_TYPE(JSON_EXTRACT(@j, '$.a[0]'));
  +---------------------------------------+
  | JSON_TYPE(JSON_EXTRACT(@j, '$.a[0]')) |
  +---------------------------------------+
  | INTEGER                               |
  +---------------------------------------+
  mysql> SELECT JSON_TYPE(JSON_EXTRACT(@j, '$.a[1]'));
  +---------------------------------------+
  | JSON_TYPE(JSON_EXTRACT(@j, '$.a[1]')) |
  +---------------------------------------+
  | BOOLEAN                               |
  +---------------------------------------+
  ```

`JSON_TYPE()` retorna `NULL` se o argumento for `NULL`:

  ```sql
  mysql> SELECT JSON_TYPE(NULL);
  +-----------------+
  | JSON_TYPE(NULL) |
  +-----------------+
  | NULL            |
  +-----------------+
  ```

Um erro ocorre se o argumento não for um valor JSON válido:

  ```sql
  mysql> SELECT JSON_TYPE(1);
  ERROR 3146 (22032): Invalid data type for JSON data in argument 1
  to function json_type; a JSON string or JSON type is required.
  ```

Para um resultado não `NULL`, não erro, a lista a seguir descreve os possíveis valores de retorno `JSON_TYPE()`:

+ Tipos puramente JSON:

- `OBJECT`: Objetos JSON
    - `ARRAY`: Arrays JSON
    - `BOOLEAN`: Os literais JSON true e false

- `NULL`: O literal nulo JSON
  + Tipos numéricos:

- `INTEGER`: MySQL `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") escalares

- `DOUBLE`: MySQL `DOUBLE` - FLOAT, DOUBLE") `FLOAT` - FLOAT, DOUBLE") escalares

- `DECIMAL`: escalares MySQL `DECIMAL` - DECIMAL, NUMERIC") e `NUMERIC` - DECIMAL, NUMERIC")

+ Tipos temporais:

- `DATETIME`: escalares MySQL `DATETIME` e `TIMESTAMP`

- `DATE`: Escalares MySQL `DATE`

- `TIME`: Escalares MySQL `TIME`

+ Tipos de string:

- `STRING`: Escalares do tipo de caractere MySQL `utf8`: `CHAR`, `VARCHAR`, `TEXT`, `ENUM` e `SET`

+ Tipos binários:

- `BLOB`: Escalares do tipo binário do MySQL: `BINARY`, `VARBINARY`, `BLOB`

- `BIT`: escalares MySQL `BIT`

+ Todos os outros tipos:

- `OPAQUE` (bits brutos)
* `JSON_VALID(val)`

Retorna 0 ou 1 para indicar se um valor é JSON válido. Retorna `NULL` se o argumento for `NULL`.

  ```sql
  mysql> SELECT JSON_VALID('{"a": 1}');
  +------------------------+
  | JSON_VALID('{"a": 1}') |
  +------------------------+
  |                      1 |
  +------------------------+
  mysql> SELECT JSON_VALID('hello'), JSON_VALID('"hello"');
  +---------------------+-----------------------+
  | JSON_VALID('hello') | JSON_VALID('"hello"') |
  +---------------------+-----------------------+
  |                   0 |                     1 |
  +---------------------+-----------------------+
  ```

### 12.17.6 Funções utilitárias do JSON

Esta seção documenta funções utilitárias que atuam em valores JSON, ou strings que podem ser analisadas como valores JSON. `JSON_PRETTY()` exibe um valor JSON em um formato fácil de ler. `JSON_STORAGE_SIZE()` mostra a quantidade de espaço de armazenamento usado por um dado valor JSON.

* `JSON_PRETTY(json_val)`

Fornece impressão bonita dos valores JSON semelhantes àquela implementada em PHP e por outros idiomas e sistemas de banco de dados. O valor fornecido deve ser um valor JSON ou uma representação de string válida de um valor JSON. Espaços em branco e novas strings excedentes presentes neste valor não têm efeito na saída. Para um valor `NULL`, a função retorna `NULL`. Se o valor não for um documento JSON ou não puder ser analisado como um, a função falha com um erro.

A formatação do resultado desta função segue as seguintes regras:

+ Cada elemento de matriz ou membro de objeto aparece em uma string separada, indentado em um nível adicional em comparação com seu pai.

+ Cada nível de indentação adiciona dois espaços antes.  
+ Uma vírgula que separa elementos de matriz individuais ou membros de objeto é impressa antes da nova string que separa os dois elementos ou membros.

+ A chave e o valor de um membro de objeto são separados por um colon seguido de um espaço (`:`).

+ Um objeto ou array vazio é impresso em uma única string. Não é impresso espaço entre a brace de abertura e fechamento.

+ Caracteres especiais em escalares de string e nomes de chave são escapados empregando as mesmas regras usadas pela função `JSON_QUOTE()`.

  ```sql
  mysql> SELECT JSON_PRETTY('123'); # scalar
  +--------------------+
  | JSON_PRETTY('123') |
  +--------------------+
  | 123                |
  +--------------------+

  mysql> SELECT JSON_PRETTY("[1,3,5]"); # array
  +------------------------+
  | JSON_PRETTY("[1,3,5]") |
  +------------------------+
  | [
    1,
    3,
    5
  ]      |
  +------------------------+

  mysql> SELECT JSON_PRETTY('{"a":"10","b":"15","x":"25"}'); # object
  +---------------------------------------------+
  | JSON_PRETTY('{"a":"10","b":"15","x":"25"}') |
  +---------------------------------------------+
  | {
    "a": "10",
    "b": "15",
    "x": "25"
  }   |
  +---------------------------------------------+

  mysql> SELECT JSON_PRETTY('["a",1,{"key1":
       >    "value1"},"5",     "77" ,
       >       {"key2":["value3","valueX",
       > "valueY"]},"j", "2"   ]')\G  # nested arrays and objects
  *************************** 1. row ***************************
  JSON_PRETTY('["a",1,{"key1":
               "value1"},"5",     "77" ,
                  {"key2":["value3","valuex",
            "valuey"]},"j", "2"   ]'): [
    "a",
    1,
    {
      "key1": "value1"
    },
    "5",
    "77",
    {
      "key2": [
        "value3",
        "valuex",
        "valuey"
      ]
    },
    "j",
    "2"
  ]
  ```

Adicionado no MySQL 5.7.22.

* `JSON_STORAGE_SIZE(json_val)`

Essa função retorna o número de bytes usados para armazenar a representação binária de um documento JSON. Quando o argumento é uma coluna `JSON`, este é o espaço usado para armazenar o documento JSON. *`json_val`* deve ser um documento JSON válido ou uma string que pode ser analisada como uma. No caso em que é uma string, a função retorna a quantidade de espaço de armazenamento na representação binária JSON que é criada pela análise da string como JSON e conversão para binário. Ela retorna `NULL` se o argumento for `NULL`.

Um erro resulta quando *`json_val`* não é `NULL`, e não é — ou não pode ser analisado com sucesso como — um documento JSON.

Para ilustrar o comportamento dessa função quando usada com uma coluna `JSON` como seu argumento, criamos uma tabela chamada `jtable` contendo uma coluna `JSON`, inserimos um valor JSON na tabela e, em seguida, obtemos o espaço de armazenamento usado por essa coluna com `JSON_STORAGE_SIZE()`, conforme mostrado aqui:

  ```sql
  mysql> CREATE TABLE jtable (jcol JSON);
  Query OK, 0 rows affected (0.42 sec)

  mysql> INSERT INTO jtable VALUES
      ->     ('{"a": 1000, "b": "wxyz", "c": "[1, 3, 5, 7]"}');
  Query OK, 1 row affected (0.04 sec)

  mysql> SELECT
      ->     jcol,
      ->     JSON_STORAGE_SIZE(jcol) AS Size
      -> FROM jtable;
  +-----------------------------------------------+------+
  | jcol                                          | Size |
  +-----------------------------------------------+------+
  | {"a": 1000, "b": "wxyz", "c": "[1, 3, 5, 7]"} |   47 |
  +-----------------------------------------------+------+
  1 row in set (0.00 sec)
  ```

De acordo com a saída de `JSON_STORAGE_SIZE()`, o documento JSON inserido na coluna ocupa 47 bytes. Após uma atualização, a função mostra o armazenamento usado para o valor recém-definido:

  ```sql
  mysql> UPDATE jtable
  mysql>     SET jcol = '{"a": 4.55, "b": "wxyz", "c": "[true, false]"}';
  Query OK, 1 row affected (0.04 sec)
  Rows matched: 1  Changed: 1  Warnings: 0

  mysql> SELECT
      ->     jcol,
      ->     JSON_STORAGE_SIZE(jcol) AS Size
      -> FROM jtable;
  +------------------------------------------------+------+
  | jcol                                           | Size |
  +------------------------------------------------+------+
  | {"a": 4.55, "b": "wxyz", "c": "[true, false]"} |   56 |
  +------------------------------------------------+------+
  1 row in set (0.00 sec)
  ```

Essa função também mostra o espaço atualmente utilizado para armazenar um documento JSON em uma variável do usuário:

  ```sql
  mysql> SET @j = '[100, "sakila", [1, 3, 5], 425.05]';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT @j, JSON_STORAGE_SIZE(@j) AS Size;
  +------------------------------------+------+
  | @j                                 | Size |
  +------------------------------------+------+
  | [100, "sakila", [1, 3, 5], 425.05] |   45 |
  +------------------------------------+------+
  1 row in set (0.00 sec)

  mysql> SET @j = JSON_SET(@j, '$[1]', "json");
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT @j, JSON_STORAGE_SIZE(@j) AS Size;
  +----------------------------------+------+
  | @j                               | Size |
  +----------------------------------+------+
  | [100, "json", [1, 3, 5], 425.05] |   43 |
  +----------------------------------+------+
  1 row in set (0.00 sec)

  mysql> SET @j = JSON_SET(@j, '$[2][0]', JSON_ARRAY(10, 20, 30));
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT @j, JSON_STORAGE_SIZE(@j) AS Size;
  +---------------------------------------------+------+
  | @j                                          | Size |
  +---------------------------------------------+------+
  | [100, "json", [[10, 20, 30], 3, 5], 425.05] |   56 |
  +---------------------------------------------+------+
  1 row in set (0.00 sec)
  ```

Para um literal JSON, essa função também retorna o espaço de armazenamento atual utilizado, conforme mostrado aqui:

  ```sql
  mysql> SELECT
      ->     JSON_STORAGE_SIZE('[100, "sakila", [1, 3, 5], 425.05]') AS A,
      ->     JSON_STORAGE_SIZE('{"a": 1000, "b": "a", "c": "[1, 3, 5, 7]"}') AS B,
      ->     JSON_STORAGE_SIZE('{"a": 1000, "b": "wxyz", "c": "[1, 3, 5, 7]"}') AS C,
      ->     JSON_STORAGE_SIZE('[100, "json", [[10, 20, 30], 3, 5], 425.05]') AS D;
  +----+----+----+----+
  | A  | B  | C  | D  |
  +----+----+----+----+
  | 45 | 44 | 47 | 56 |
  +----+----+----+----+
  1 row in set (0.00 sec)
  ```

Essa função foi adicionada no MySQL 5.7.22.