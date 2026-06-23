## 14.17 Funções JSON

As funções descritas nesta seção realizam operações em valores JSON. Para discussão sobre o tipo de dados `JSON` e exemplos adicionais que mostram como usar essas funções, consulte a Seção 13.5, “O tipo de dados JSON”.

Para funções que aceitam um argumento JSON, ocorre um erro se o argumento não for um valor JSON válido. Os argumentos que são analisados como JSON são indicados por *`json_doc`*; os argumentos indicados por *`val`* não são analisados.

As funções que retornam valores JSON sempre realizam a normalização desses valores (consulte Normalização, Fusão e Autoenrolado de Valores JSON), e, portanto, os ordenam. *O resultado preciso do tipo de ordenação pode ser alterado a qualquer momento; não confie nele para ser consistente entre as versões*.

Também está disponível um conjunto de funções espaciais para operar com valores GeoJSON. Consulte a Seção 14.16.11, “Funções GeoJSON Espaciais”.

### 14.17.1 Referência de função JSON

**Tabela 14.22 Funções JSON**

<table frame="box" rules="all" summary="A reference that lists all JSON functions."><col style="width: 22%"/><col style="width: 55%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> <th>Deprecated</th> </tr></thead><tbody><tr><th scope="row"><code>-&gt;</code></th> <td> Return value from JSON column after evaluating path; equivalent to JSON_EXTRACT(). </td> <td></td> <td></td> </tr><tr><th scope="row"><code>-&gt;&gt;</code></th> <td> Return value from JSON column after evaluating path and unquoting the result; equivalent to JSON_UNQUOTE(JSON_EXTRACT()). </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_ARRAY()</code></th> <td> Create JSON array </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_ARRAY_APPEND()</code></th> <td>Adicione dados ao documento JSON</td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_ARRAY_INSERT()</code></th> <td>Insira no array JSON</td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_CONTAINS()</code></th> <td>Se o documento JSON contém um objeto específico no caminho</td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_CONTAINS_PATH()</code></th> <td>Se o documento JSON contém algum dado no caminho</td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_DEPTH()</code></th> <td>Profundidade máxima do documento JSON</td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_EXTRACT()</code></th> <td>Retorno de dados de documento JSON</td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_INSERT()</code></th> <td>Insira dados em documento JSON</td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_KEYS()</code></th> <td>Matriz de chaves de um documento JSON</td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_LENGTH()</code></th> <td>Número de elementos no documento JSON</td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_MERGE()</code></th> <td> Merge JSON documents, preserving duplicate keys. Deprecated synonym for JSON_MERGE_PRESERVE() </td> <td></td> <td>Yes</td> </tr><tr><th scope="row"><code>JSON_MERGE_PATCH()</code></th> <td>Mesclar documentos JSON, substituindo os valores de chaves duplicadas</td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_MERGE_PRESERVE()</code></th> <td>Mesclar documentos JSON, preservando chaves duplicadas</td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_OBJECT()</code></th> <td> Create JSON object </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_OVERLAPS()</code></th> <td>Compara dois documentos JSON, retorna TRUE (1) se esses tiverem quaisquer pares de chave-valor ou elementos de matriz em comum, caso contrário, FALSE (0)</td> <td>8.0.17</td> <td></td> </tr><tr><th scope="row"><code>JSON_PRETTY()</code></th> <td>Imprima um documento JSON em formato legível para humanos</td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_QUOTE()</code></th> <td> Quote JSON document </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_REMOVE()</code></th> <td>Remova dados do documento JSON</td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_REPLACE()</code></th> <td>Substitua os valores no documento JSON</td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_SCHEMA_VALID()</code></th> <td> Validate JSON document against JSON schema; returns TRUE/1 if document validates against schema, or FALSE/0 if it does not </td> <td>8.0.17</td> <td></td> </tr><tr><th scope="row"><code>JSON_SCHEMA_VALIDATION_REPORT()</code></th> <td>Validar o documento JSON contra um esquema JSON; retornar um relatório no formato JSON sobre o resultado da validação, incluindo sucesso ou falha e razões para a falha.</td> <td>8.0.17</td> <td></td> </tr><tr><th scope="row"><code>JSON_SEARCH()</code></th> <td>Caminho para o valor dentro do documento JSON</td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_SET()</code></th> <td>Insira dados em documento JSON</td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_STORAGE_FREE()</code></th> <td>Espaço liberado dentro da representação binária do valor da coluna do JSON após a atualização parcial</td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_STORAGE_SIZE()</code></th> <td>Espaço utilizado para armazenamento da representação binária de um documento JSON</td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_TABLE()</code></th> <td>Retorne dados de uma expressão JSON como uma tabela relacional</td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_TYPE()</code></th> <td>Tipo de valor JSON</td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_UNQUOTE()</code></th> <td> Unquote JSON value </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_VALID()</code></th> <td>Se o valor JSON é válido</td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_VALUE()</code></th> <td>Extraia o valor do documento JSON na localização apontada pelo caminho fornecido; retorne esse valor como VARCHAR(512) ou o tipo especificado</td> <td>8.0.21</td> <td></td> </tr><tr><th scope="row"><code>MEMBER OF()</code></th> <td>Retorna verdadeiro (1) se o primeiro operando corresponder a qualquer elemento do array JSON passado como segundo operando, caso contrário, retorna falso (0)</td> <td>8.0.17</td> <td></td> </tr></tbody></table>

O MySQL suporta duas funções agregadas de JSON `JSON_ARRAYAGG()` e `JSON_OBJECTAGG()`. Consulte a Seção 14.19, “Funções Agregadas”, para descrições dessas funções.

O MySQL também suporta a “impressão bonita” dos valores JSON em um formato fácil de ler, usando a função `JSON_PRETTY()`. Você pode ver quanto espaço de armazenamento um determinado valor JSON ocupa e quanto espaço permanece para armazenamento adicional, usando `JSON_STORAGE_SIZE()` e `JSON_STORAGE_FREE()`, respectivamente. Para descrições completas dessas funções, consulte a Seção 14.17.8, “Funções de Utilidade JSON”.

### 14.17.2 Funções que criam valores JSON

As funções listadas nesta seção compõem valores JSON a partir de elementos de componentes.

* `JSON_ARRAY([val[, val] ...])`(json-creation-functions.html#function_json-array)

Avalia uma lista (possivelmente vazia) de valores e retorna um array JSON contendo esses valores.

  ```
  mysql> SELECT JSON_ARRAY(1, "abc", NULL, TRUE, CURTIME());
  +---------------------------------------------+
  | JSON_ARRAY(1, "abc", NULL, TRUE, CURTIME()) |
  +---------------------------------------------+
  | [1, "abc", null, true, "11:30:24.000000"]   |
  +---------------------------------------------+
  ```

* `JSON_OBJECT([key, val[, key, val] ...])`(json-creation-functions.html#function_json-object)

Avalia uma lista (possivelmente vazia) de pares chave-valor e retorna um objeto JSON contendo esses pares. Um erro ocorre se qualquer nome de chave for `NULL` ou o número de argumentos for ímpar.

  ```
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

Certos caracteres especiais são escapados com barras invertidas conforme as sequências de escape mostradas na Tabela 14.23, "Sequências de escape de caracteres especiais JSON_UNQUOTE()". Sequências de escape de caracteres especiais).

  ```
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

Dois conjuntos de funções agregadas que geram valores JSON estão disponíveis. `JSON_ARRAYAGG()` retorna um conjunto de resultados como um único array JSON, e `JSON_OBJECTAGG()` retorna um conjunto de resultados como um único objeto JSON. Para mais informações, consulte a Seção 14.19, “Funções Agregadas”.

### 14.17.3 Funções que buscam valores JSON

As funções desta seção realizam operações de busca ou comparação em valores JSON para extrair dados deles, relatar se os dados existem em um local dentro deles ou relatar o caminho para os dados dentro deles. O operador `MEMBER OF()` também é documentado aqui.

* `JSON_CONTAINS(target, candidate[, path])`(json-search-functions.html#function_json-contains)

Indica, retornando 1 ou 0, se um dado documento JSON *`candidate`* está contido em um documento JSON *`target`*, ou, se um argumento *`path`* foi fornecido, se o candidato é encontrado em um caminho específico dentro do alvo. Retorna `NULL` se qualquer argumento for `NULL`, ou se o argumento de caminho não identifica uma seção do documento alvo. Um erro ocorre se *`target`* ou *`candidate`* não for um documento JSON válido, ou se o argumento *`path`* não for uma expressão de caminho válida ou contém um `*` ou `**` wildcard.

Para verificar apenas se há algum dado no caminho, use `JSON_CONTAINS_PATH()` em vez disso.

As regras a seguir definem o contentamento:

Um escalar candidato está contido em um escalar alvo se e somente se forem comparáveis e iguais. Dois valores escalares são comparáveis se tiverem os mesmos tipos de `JSON_TYPE()`, com exceção de que os valores dos tipos `INTEGER` e `DECIMAL` também são comparáveis entre si.

Um array candidato está contido em um array alvo se e somente se cada elemento do candidato estiver contido em algum elemento do alvo.

Um candidato não-vetor está contido em um vetor alvo se e somente se o candidato estiver contido em algum elemento do alvo.

Um objeto candidato está contido em um objeto alvo se e somente se, para cada chave no candidato, houver uma chave com o mesmo nome no alvo e o valor associado à chave do candidato esteja contido no valor associado à chave do alvo.

Caso contrário, o valor do candidato não está contido no documento-alvo.

A partir do MySQL 8.0.17, as consultas que utilizam `JSON_CONTAINS()` em tabelas `InnoDB` podem ser otimizadas usando índices de múltiplos valores; consulte Índices de múltiplos valores, para mais informações.

  ```
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

+ `'one'`: 1 se pelo menos um caminho existir dentro do documento, 0 caso contrário.

+ `'all'`: 1 se todos os caminhos existirem dentro do documento, 0 caso contrário.

  ```
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

Retorna dados de um documento JSON, selecionados das partes do documento que correspondem aos argumentos *`path`*. Retorna `NULL` se algum argumento for `NULL` ou se nenhum caminho localizar um valor no documento. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou se qualquer argumento *`path`* não for uma expressão de caminho válida.

O valor de retorno consiste em todos os valores correspondidos pelos argumentos *`path`*. Se for possível que esses argumentos possam retornar múltiplos valores, os valores correspondidos são autoencapsulados como um array, na ordem correspondente aos caminhos que os produziram. Caso contrário, o valor de retorno é o único valor correspondido.

  ```
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

O MySQL suporta o operador `->` como abreviação para essa função, conforme usado com 2 argumentos, onde o lado esquerdo é um identificador de coluna `JSON` (não uma expressão) e o lado direito é o caminho JSON a ser correspondido dentro da coluna.

* `column->path`

O operador `->` serve como um alias para a função `JSON_EXTRACT()` quando usado com dois argumentos, um identificador de coluna à esquerda e um caminho JSON (um literal de string) à direita que é avaliado contra o documento JSON (o valor da coluna). Você pode usar tais expressões no lugar de referências de coluna sempre que elas ocorrem em declarações SQL.

As duas declarações `SELECT` mostradas aqui produzem o mesmo resultado:

  ```
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

  ```
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

  ```
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

  ```
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

  ```
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

Este é um operador de extração sem aspas aprimorado. Enquanto o operador `->` simplesmente extrai um valor, o operador `->>` também desfaz as aspas do resultado extraído. Em outras palavras, dado um valor da coluna `JSON` *`column`* e uma expressão de caminho *`path`* (um literal de string), as seguintes três expressões retornam o mesmo valor:

+ `JSON_UNQUOTE(` [`JSON_EXTRACT(column, path) )`](json-search-functions.html#function_json-extract)

+ `JSON_UNQUOTE(column` `->` `path)`

+ `column->>path`

O operador `->>` pode ser usado sempre que o `JSON_UNQUOTE(JSON_EXTRACT())` seria permitido. Isso inclui (mas não se limita a) listas `SELECT`, cláusulas `WHERE` e `HAVING`, e cláusulas `ORDER BY` e `GROUP BY`.

As próximas declarações demonstram algumas equivalências dos operadores `->>` com outras expressões no cliente **mysql**:

  ```
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

  ```
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

  ```
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

* `JSON_KEYS(json_doc[, path])`(json-search-functions.html#function_json-keys)

Retorna as chaves do valor de nível superior de um objeto JSON como um array JSON, ou, se um argumento *`path`* for fornecido, as chaves de nível superior do caminho selecionado. Retorna `NULL` se qualquer argumento for `NULL`, o argumento *`json_doc`* não for um objeto, ou *`path`*, se fornecido, não localizar um objeto. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou o argumento *`path`* não for uma expressão de caminho válida ou contenha um `*` ou `**` wildcard.

O array de resultados está vazio se o objeto selecionado estiver vazio. Se o valor do nível superior tiver subobjetos aninhados, o valor de retorno não incluirá as chaves desses subobjetos.

  ```
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

* `JSON_OVERLAPS(json_doc1, json_doc2)`(json-search-functions.html#function_json-overlaps)

Compara dois documentos JSON. Retorna verdadeiro (1) se os dois documentos tiverem quaisquer pares chave-valor ou elementos de matriz em comum. Se ambos os argumentos forem escalares, a função realiza um teste de igualdade simples. Se qualquer argumento for `NULL`, a função retorna `NULL`.

Essa função serve como contraparte para `JSON_CONTAINS()`, que exige que todos os elementos da matriz pesquisada estejam presentes na matriz pesquisada. Assim, `JSON_CONTAINS()` realiza uma operação `AND` em chaves de pesquisa, enquanto `JSON_OVERLAPS()` realiza uma operação `OR`.

As consultas em colunas JSON das tabelas `InnoDB` usando `JSON_OVERLAPS()` na cláusula `WHERE` podem ser otimizadas usando índices de múltiplos valores. Índices de múltiplos valores, que fornecem informações detalhadas e exemplos.

Ao comparar dois arrays, `JSON_OVERLAPS()` retorna verdadeiro se eles compartilharem um ou mais elementos em comum, e falso se não o fizerem:

  ```
  mysql> SELECT JSON_OVERLAPS("[1,3,5,7]", "[2,5,7]");
  +---------------------------------------+
  | JSON_OVERLAPS("[1,3,5,7]", "[2,5,7]") |
  +---------------------------------------+
  |                                     1 |
  +---------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT JSON_OVERLAPS("[1,3,5,7]", "[2,6,7]");
  +---------------------------------------+
  | JSON_OVERLAPS("[1,3,5,7]", "[2,6,7]") |
  +---------------------------------------+
  |                                     1 |
  +---------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT JSON_OVERLAPS("[1,3,5,7]", "[2,6,8]");
  +---------------------------------------+
  | JSON_OVERLAPS("[1,3,5,7]", "[2,6,8]") |
  +---------------------------------------+
  |                                     0 |
  +---------------------------------------+
  1 row in set (0.00 sec)
  ```

Jogos parciais são tratados como sem jogo, conforme mostrado aqui:

  ```
  mysql> SELECT JSON_OVERLAPS('[[1,2],[3,4],5]', '[1,[2,3],[4,5]]');
  +-----------------------------------------------------+
  | JSON_OVERLAPS('[[1,2],[3,4],5]', '[1,[2,3],[4,5]]') |
  +-----------------------------------------------------+
  |                                                   0 |
  +-----------------------------------------------------+
  1 row in set (0.00 sec)
  ```

Ao comparar objetos, o resultado é verdadeiro se eles tiverem pelo menos um par chave-valor em comum.

  ```
  mysql> SELECT JSON_OVERLAPS('{"a":1,"b":10,"d":10}', '{"c":1,"e":10,"f":1,"d":10}');
  +-----------------------------------------------------------------------+
  | JSON_OVERLAPS('{"a":1,"b":10,"d":10}', '{"c":1,"e":10,"f":1,"d":10}') |
  +-----------------------------------------------------------------------+
  |                                                                     1 |
  +-----------------------------------------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT JSON_OVERLAPS('{"a":1,"b":10,"d":10}', '{"a":5,"e":10,"f":1,"d":20}');
  +-----------------------------------------------------------------------+
  | JSON_OVERLAPS('{"a":1,"b":10,"d":10}', '{"a":5,"e":10,"f":1,"d":20}') |
  +-----------------------------------------------------------------------+
  |                                                                     0 |
  +-----------------------------------------------------------------------+
  1 row in set (0.00 sec)
  ```

Se dois escalares forem usados como argumentos para a função, `JSON_OVERLAPS()` realiza um teste simples de igualdade:

  ```
  mysql> SELECT JSON_OVERLAPS('5', '5');
  +-------------------------+
  | JSON_OVERLAPS('5', '5') |
  +-------------------------+
  |                       1 |
  +-------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT JSON_OVERLAPS('5', '6');
  +-------------------------+
  | JSON_OVERLAPS('5', '6') |
  +-------------------------+
  |                       0 |
  +-------------------------+
  1 row in set (0.00 sec)
  ```

Ao comparar um escalar com um array, `JSON_OVERLAPS()` tenta tratar o escalar como um elemento do array. Neste exemplo, o segundo argumento `6` é interpretado como `[6]`, como mostrado aqui:

  ```
  mysql> SELECT JSON_OVERLAPS('[4,5,6,7]', '6');
  +---------------------------------+
  | JSON_OVERLAPS('[4,5,6,7]', '6') |
  +---------------------------------+
  |                               1 |
  +---------------------------------+
  1 row in set (0.00 sec)
  ```

A função não realiza conversões de tipo:

  ```
  mysql> SELECT JSON_OVERLAPS('[4,5,"6",7]', '6');
  +-----------------------------------+
  | JSON_OVERLAPS('[4,5,"6",7]', '6') |
  +-----------------------------------+
  |                                 0 |
  +-----------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT JSON_OVERLAPS('[4,5,6,7]', '"6"');
  +-----------------------------------+
  | JSON_OVERLAPS('[4,5,6,7]', '"6"') |
  +-----------------------------------+
  |                                 0 |
  +-----------------------------------+
  1 row in set (0.00 sec)
  ```

`JSON_OVERLAPS()` foi adicionado no MySQL 8.0.17.

* `JSON_SEARCH(json_doc, one_or_all, search_str[, escape_char[, path] ...])`(json-search-functions.html#function_json-search)

Retorna o caminho para a string fornecida dentro de um documento JSON. Retorna `NULL` se qualquer um dos argumentos *`json_doc`*, *`search_str`* ou *`path`* for `NULL`; não existe *`path`* dentro do documento; ou *`search_str`* não é encontrado. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido, qualquer argumento *`path`* não for uma expressão de caminho válida, *`one_or_all`* não for `'one'` ou `'all'`, ou *`escape_char`* não é uma expressão constante.

O argumento *`one_or_all`* afeta a pesquisa da seguinte forma:

+ `'one'`: A pesquisa termina após a primeira correspondência e retorna uma string de caminho. Não está definido qual correspondência é considerada a primeira.

+ `'all'`: A pesquisa retorna todas as strings de caminho correspondentes, de modo que nenhum caminho duplicado seja incluído. Se houver várias strings, elas são autoenroladas como um array. A ordem dos elementos do array é indefinida.

Dentro do argumento da string de busca *`search_str`*, os caracteres `%` e `_` funcionam como para o operador `LIKE`: `%` corresponde a qualquer número de caracteres (incluindo zero caracteres), e `_` corresponde exatamente a um caractere.

Para especificar um caractere literal `%` ou `_` na string de pesquisa, anteceda-o com o caractere de escape. O padrão é `\` se o argumento *`escape_char`* estiver ausente ou `NULL`. Caso contrário, *`escape_char`* deve ser uma constante que seja vazia ou um caractere.

Para obter mais informações sobre o comportamento de correspondência e caracteres de escape, consulte a descrição de `LIKE` na Seção 14.8.1, “Funções e Operadores de Comparação de Cadeia”. Para o tratamento de caracteres de escape, uma diferença em relação ao comportamento de `LIKE` é que o caractere de escape para `JSON_SEARCH()` deve ser avaliado como uma constante no momento da compilação, e não apenas no momento da execução. Por exemplo, se `JSON_SEARCH()` é usado em uma declaração preparada e o argumento *`escape_char`* é fornecido usando um parâmetro `?`, o valor do parâmetro pode ser constante no momento da execução, mas não no momento da compilação.

*`search_str`* e *`path`* são sempre interpretados como strings utf8mb4, independentemente de sua codificação real. Este é um problema conhecido que é corrigido no MySQL 8.0.24 (Bug #32449181).

  ```
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

* `JSON_VALUE(json_doc, path)`(json-search-functions.html#function_json-value)

Extrai um valor de um documento JSON no caminho especificado no documento especificado e retorna o valor extraído, convertendo-o opcionalmente em um tipo desejado. A sintaxe completa é mostrada aqui:

  ```
  JSON_VALUE(json_doc, path [RETURNING type] [on_empty] [on_error])

  on_empty:
      {NULL | ERROR | DEFAULT value} ON EMPTY

  on_error:
      {NULL | ERROR | DEFAULT value} ON ERROR
  ```

*`json_doc`* é um documento JSON válido. Se este for `NULL`, a função retorna `NULL`.

*`path`* é um caminho JSON que aponta para um local no documento. Isso deve ser um valor literal de string.

*`type`* é um dos seguintes tipos de dados:

+ `FLOAT` - FLOAT, DOUBLE")
  + `DOUBLE` - FLOAT, DOUBLE")
  + `DECIMAL` - DECIMAL, NUMERIC")
  + `SIGNED`
  + `UNSIGNED`
  + `DATE`
  + `TIME`
  + `DATETIME`
  + `YEAR` (MySQL 8.0.22 e posterior)

Os valores de `YEAR` de um ou dois dígitos não são suportados.

+ `CHAR`
  + `JSON`

Os tipos listados acima são os mesmos que os tipos (não de matriz) suportados pela função `CAST()`.

Se não for especificado por uma cláusula `RETURNING`, o tipo de retorno da função `JSON_VALUE()` é `VARCHAR(512)`. Quando não é especificado nenhum conjunto de caracteres para o tipo de retorno, o `JSON_VALUE()` usa `utf8mb4` com a ordenação binária, que é sensível ao caso; se `utf8mb4` é especificado como o conjunto de caracteres para o resultado, o servidor usa a ordenação padrão para este conjunto de caracteres, que não é sensível ao caso.

Quando os dados no caminho especificado consistem em ou resolvem em um literal JSON nulo, a função retorna SQL `NULL`.

*`on_empty`*, se especificado, determina como o `JSON_VALUE()` se comporta quando não são encontrados dados no caminho especificado; esta cláusula assume um dos seguintes valores:

+ `NULL ON EMPTY`: A função retorna `NULL`; este é o comportamento padrão do `ON EMPTY`.

+ `DEFAULT value ON EMPTY`: o *`value`* fornecido é retornado. O tipo do valor deve corresponder ao tipo de retorno.

+ `ERROR ON EMPTY`: A função lança um erro.

Se utilizado, *`on_error`* assume um dos seguintes valores com o resultado correspondente quando ocorre um erro, conforme listado aqui:

+ `NULL ON ERROR`: `JSON_VALUE()` retorna `NULL`; este é o comportamento padrão se nenhuma cláusula `ON ERROR` for usada.

+ `DEFAULT value ON ERROR`: Esse é o valor retornado; seu valor deve corresponder ao do tipo de retorno.

+ `ERROR ON ERROR`: Um erro é lançado.

`ON EMPTY`, se usado, deve preceder qualquer cláusula `ON ERROR`. Especificá-los na ordem errada resulta em um erro de sintaxe.

**Tratamento de erros.** Em geral, os erros são tratados por `JSON_VALUE()` da seguinte forma:

+ Todos os dados JSON (documento e caminho) são verificados quanto à validade. Se algum deles não for válido, um erro SQL é lançado sem acionar a cláusula `ON ERROR`.

+ `ON ERROR` é acionado sempre que ocorrer qualquer um dos seguintes eventos:

- Tentar extrair um objeto ou uma matriz, como o resultado de um caminho que resolve em múltiplos locais dentro do documento JSON.

- Erros de conversão, como tentar converter `'asdf'` para um valor de `UNSIGNED`

- Retrucamento de valores
+ Um erro de conversão sempre aciona uma advertência, mesmo que `NULL ON ERROR` ou `DEFAULT ... ON ERROR` seja especificado.

+ A cláusula `ON EMPTY` é acionada quando o documento JSON de origem (*`expr`*) não contém dados na localização especificada (*`path`*).

`JSON_VALUE()` foi introduzido no MySQL 8.0.21.

**Exemplos.** Dois exemplos simples são mostrados aqui:

  ```
  mysql> SELECT JSON_VALUE('{"fname": "Joe", "lname": "Palmer"}', '$.fname');
  +--------------------------------------------------------------+
  | JSON_VALUE('{"fname": "Joe", "lname": "Palmer"}', '$.fname') |
  +--------------------------------------------------------------+
  | Joe                                                          |
  +--------------------------------------------------------------+

  mysql> SELECT JSON_VALUE('{"item": "shoes", "price": "49.95"}', '$.price'
      -> RETURNING DECIMAL(4,2)) AS price;
  +-------+
  | price |
  +-------+
  | 49.95 |
  +-------+
  ```

Exceto nos casos em que `JSON_VALUE()` retorna `NULL`, a declaração `SELECT JSON_VALUE(json_doc, path RETURNING type)` é equivalente à seguinte declaração:

  ```
  SELECT CAST(
      JSON_UNQUOTE( JSON_EXTRACT(json_doc, path) )
      AS type
  );
  ```

`JSON_VALUE()` simplifica a criação de índices em colunas JSON, tornando desnecessário, em muitos casos, criar uma coluna gerada e, em seguida, um índice na coluna gerada. Você pode fazer isso ao criar uma tabela `t1` que tenha uma coluna `JSON`, criando um índice em uma expressão que usa `JSON_VALUE()` operando nessa coluna (com um caminho que corresponde a um valor nessa coluna), como mostrado aqui:

  ```
  CREATE TABLE t1(
      j JSON,
      INDEX i1 ( (JSON_VALUE(j, '$.id' RETURNING UNSIGNED)) )
  );
  ```

O seguinte `EXPLAIN` de saída mostra que uma consulta contra `t1`, empregando a expressão de índice na cláusula `WHERE`, utiliza o índice assim criado:

  ```
  mysql> EXPLAIN SELECT * FROM t1
      ->     WHERE JSON_VALUE(j, '$.id' RETURNING UNSIGNED) = 123\G
  *************************** 1. row ***************************
             id: 1
    select_type: SIMPLE
          table: t1
     partitions: NULL
           type: ref
  possible_keys: i1
            key: i1
        key_len: 9
            ref: const
           rows: 1
       filtered: 100.00
          Extra: NULL
  ```

Isso alcança um efeito muito semelhante ao de criar uma tabela `t2` com um índice em uma coluna gerada (veja "Indicar uma coluna gerada para fornecer um índice de coluna JSON"), como esta:

  ```
  CREATE TABLE t2 (
      j JSON,
      g INT GENERATED ALWAYS AS (j->"$.id"),
      INDEX i1 (g)
  );
  ```

A saída `EXPLAIN` para uma consulta nesta tabela, referenciando a coluna gerada, mostra que o índice é usado da mesma forma que na consulta anterior à tabela `t1`:

  ```
  mysql> EXPLAIN SELECT * FROM t2 WHERE g  = 123\G
  *************************** 1. row ***************************
             id: 1
    select_type: SIMPLE
          table: t2
     partitions: NULL
           type: ref
  possible_keys: i1
            key: i1
        key_len: 5
            ref: const
           rows: 1
       filtered: 100.00
          Extra: NULL
  ```

Para obter informações sobre o uso de índices em colunas geradas para indexação indireta de colunas de `JSON`, consulte Indexação de uma coluna gerada para fornecer um índice de coluna JSON.

* `value MEMBER OF(json_array)`(json-search-functions.html#operator_member-of)

Retorna verdadeiro (1) se *`value`* é um elemento de *`json_array`*, caso contrário, retorna falso (0). *`value`* deve ser um escalar ou um documento JSON; se for um escalar, o operador tenta tratá-lo como um elemento de um array JSON. Se *`value`* ou *`json_array`* é *`NULL`*, a função retorna *`NULL`*.

As consultas que utilizam `MEMBER OF()` em colunas JSON das tabelas `InnoDB` na cláusula `WHERE` podem ser otimizadas usando índices de múltiplos valores. Consulte Índices de Múltiplos Valores, para informações detalhadas e exemplos.

Os escalares simples são tratados como valores de matriz, como mostrado aqui:

  ```
  mysql> SELECT 17 MEMBER OF('[23, "abc", 17, "ab", 10]');
  +-------------------------------------------+
  | 17 MEMBER OF('[23, "abc", 17, "ab", 10]') |
  +-------------------------------------------+
  |                                         1 |
  +-------------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT 'ab' MEMBER OF('[23, "abc", 17, "ab", 10]');
  +---------------------------------------------+
  | 'ab' MEMBER OF('[23, "abc", 17, "ab", 10]') |
  +---------------------------------------------+
  |                                           1 |
  +---------------------------------------------+
  1 row in set (0.00 sec)
  ```

Os jogos parciais dos valores dos elementos da matriz não correspondem:

  ```
  mysql> SELECT 7 MEMBER OF('[23, "abc", 17, "ab", 10]');
  +------------------------------------------+
  | 7 MEMBER OF('[23, "abc", 17, "ab", 10]') |
  +------------------------------------------+
  |                                        0 |
  +------------------------------------------+
  1 row in set (0.00 sec)
  ```

  ```
  mysql> SELECT 'a' MEMBER OF('[23, "abc", 17, "ab", 10]');
  +--------------------------------------------+
  | 'a' MEMBER OF('[23, "abc", 17, "ab", 10]') |
  +--------------------------------------------+
  |                                          0 |
  +--------------------------------------------+
  1 row in set (0.00 sec)
  ```

As conversões para e a partir dos tipos de string não são realizadas:

  ```
  mysql> SELECT
      -> 17 MEMBER OF('[23, "abc", "17", "ab", 10]'),
      -> "17" MEMBER OF('[23, "abc", 17, "ab", 10]')\G
  *************************** 1. row ***************************
  17 MEMBER OF('[23, "abc", "17", "ab", 10]'): 0
  "17" MEMBER OF('[23, "abc", 17, "ab", 10]'): 0
  1 row in set (0.00 sec)
  ```

Para usar este operador com um valor que é ele mesmo uma matriz, é necessário castá-lo explicitamente como uma matriz JSON. Você pode fazer isso com `CAST(... AS JSON)`:

  ```
  mysql> SELECT CAST('[4,5]' AS JSON) MEMBER OF('[[3,4],[4,5]]');
  +--------------------------------------------------+
  | CAST('[4,5]' AS JSON) MEMBER OF('[[3,4],[4,5]]') |
  +--------------------------------------------------+
  |                                                1 |
  +--------------------------------------------------+
  1 row in set (0.00 sec)
  ```

É também possível realizar o cálculo necessário usando a função `JSON_ARRAY()`, da seguinte forma:

  ```
  mysql> SELECT JSON_ARRAY(4,5) MEMBER OF('[[3,4],[4,5]]');
  +--------------------------------------------+
  | JSON_ARRAY(4,5) MEMBER OF('[[3,4],[4,5]]') |
  +--------------------------------------------+
  |                                          1 |
  +--------------------------------------------+
  1 row in set (0.00 sec)
  ```

Qualquer objeto JSON utilizado como valor a ser testado ou que apareça no array de destino deve ser convertido para o tipo correto usando `CAST(... AS JSON)` ou `JSON_OBJECT()`. Além disso, um array de destino contendo objetos JSON deve ser convertido usando `JSON_ARRAY`. Isso é demonstrado na seguinte sequência de declarações:

  ```
  mysql> SET @a = CAST('{"a":1}' AS JSON);
  Query OK, 0 rows affected (0.00 sec)

  mysql> SET @b = JSON_OBJECT("b", 2);
  Query OK, 0 rows affected (0.00 sec)

  mysql> SET @c = JSON_ARRAY(17, @b, "abc", @a, 23);
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT @a MEMBER OF(@c), @b MEMBER OF(@c);
  +------------------+------------------+
  | @a MEMBER OF(@c) | @b MEMBER OF(@c) |
  +------------------+------------------+
  |                1 |                1 |
  +------------------+------------------+
  1 row in set (0.00 sec)
  ```

O operador `MEMBER OF()` foi adicionado no MySQL 8.0.17.

### 14.17.4 Funções que modificam valores JSON

As funções nesta seção modificam os valores do JSON e retornam o resultado.

* `JSON_ARRAY_APPEND(json_doc, path, val[, path, val] ...)`(json-modification-functions.html#function_json-array-append)

Adiciona valores ao final dos arrays indicados dentro de um documento JSON e retorna o resultado. Retorna `NULL` se qualquer argumento for `NULL`. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou se qualquer argumento *`path`* não for uma expressão de caminho válida ou contiver um `*` ou `**` wildcard.

Os pares de valores de caminho são avaliados da esquerda para a direita. O documento produzido pela avaliação de um par se torna o novo valor contra o qual o próximo par é avaliado.

Se um caminho selecionar um valor escalar ou de objeto, esse valor é autoencapsulado em um array e o novo valor é adicionado a esse array. Os pares para os quais o caminho não identifica qualquer valor no documento JSON são ignorados.

  ```
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

Em MySQL 5.7, essa função era chamada de `JSON_APPEND()`. Esse nome não é mais suportado no MySQL 8.0.

* `JSON_ARRAY_INSERT(json_doc, path, val[, path, val] ...)`(json-modification-functions.html#function_json-array-insert)

Atualiza um documento JSON, inserindo-o em um array dentro do documento e retornando o documento modificado. Retorna `NULL` se qualquer argumento for `NULL`. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou se qualquer argumento *`path`* não for uma expressão de caminho válida ou contiver um `*` ou `**` wildcard ou não terminar com um identificador de elemento de array.

Os pares de valores de caminho são avaliados da esquerda para a direita. O documento produzido pela avaliação de um par se torna o novo valor contra o qual o próximo par é avaliado.

Os pares para os quais o caminho não identifica nenhum array no documento JSON são ignorados. Se um caminho identificar um elemento de array, o valor correspondente é inserido naquela posição do elemento, deslocando quaisquer valores subsequentes para a direita. Se um caminho identificar uma posição de array além do final de um array, o valor é inserido no final do array.

  ```
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

  ```
  mysql> SET @j = '{ "a": 1, "b": [2, 3]}';
  mysql> SELECT JSON_INSERT(@j, '$.a', 10, '$.c', '[true, false]');
  +----------------------------------------------------+
  | JSON_INSERT(@j, '$.a', 10, '$.c', '[true, false]') |
  +----------------------------------------------------+
  | {"a": 1, "b": [2, 3], "c": "[true, false]"}        |
  +----------------------------------------------------+
  ```

O terceiro e último valor listado no resultado é uma string citada e não um array como o segundo (que não é citado na saída); nenhum tipo de conversão de valores para o tipo JSON é realizada. Para inserir o array como um array, você deve realizar tais conversões explicitamente, como mostrado aqui:

  ```
  mysql> SELECT JSON_INSERT(@j, '$.a', 10, '$.c', CAST('[true, false]' AS JSON));
  +------------------------------------------------------------------+
  | JSON_INSERT(@j, '$.a', 10, '$.c', CAST('[true, false]' AS JSON)) |
  +------------------------------------------------------------------+
  | {"a": 1, "b": [2, 3], "c": [true, false]}                        |
  +------------------------------------------------------------------+
  1 row in set (0.00 sec)
  ```

* `JSON_MERGE(json_doc, json_doc[, json_doc] ...)`(json-modification-functions.html#function_json-merge)

Combina dois ou mais documentos JSON. Sinônimo de `JSON_MERGE_PRESERVE()`; descontinuado no MySQL 8.0.3 e sujeito à remoção em uma versão futura.

  ```
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

Para exemplos adicionais, veja a entrada para `JSON_MERGE_PRESERVE()`.

* `JSON_MERGE_PATCH(json_doc, json_doc[, json_doc] ...)`(json-modification-functions.html#function_json-merge-patch)

Realiza uma fusão compatível com [RFC 7396][(https://tools.ietf.org/html/rfc7396)] de dois ou mais documentos JSON e retorna o resultado combinado, sem preservar membros com chaves duplicadas. Arrisca um erro se pelo menos um dos documentos passados como argumentos para esta função não for válido.

Nota

Para uma explicação e um exemplo das diferenças entre esta função e `JSON_MERGE_PRESERVE()`, veja JSON_MERGE_PATCH() em comparação com JSON_MERGE_PRESERVE() em comparação com JSON_MERGE_PRESERVE()").

`JSON_MERGE_PATCH()` realiza uma fusão da seguinte forma:

1. Se o primeiro argumento não for um objeto, o resultado da fusão é o mesmo como se um objeto vazio tivesse sido fundido com o segundo argumento.

2. Se o segundo argumento não for um objeto, o resultado da fusão é o segundo argumento.

3. Se ambos os argumentos forem objetos, o resultado da fusão será um objeto com os seguintes membros:

+ Todos os membros do primeiro objeto que não tenham um membro correspondente com a mesma chave no segundo objeto.

+ Todos os membros do segundo objeto que não tenham uma chave correspondente no primeiro objeto, e cujo valor não seja o literal JSON `null`.

+ Todos os membros com uma chave que existe tanto no primeiro quanto no segundo objeto, e cujo valor no segundo objeto não é o literal JSON `null`. Os valores desses membros são os resultados da fusão recursiva do valor no primeiro objeto com o valor no segundo objeto.

Para obter informações adicionais, consulte Normalização, Fusão e Autoembalamento de Valores JSON.

  ```
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

  ```
  mysql> SELECT JSON_MERGE_PATCH('{"a":1, "b":2}', '{"b":null}');
  +--------------------------------------------------+
  | JSON_MERGE_PATCH('{"a":1, "b":2}', '{"b":null}') |
  +--------------------------------------------------+
  | {"a": 1}                                         |
  +--------------------------------------------------+
  ```

Este exemplo mostra que a função opera de forma recursiva; ou seja, os valores dos membros não se limitam a escalares, mas sim podem ser documentos JSON por si mesmos:

  ```
  mysql> SELECT JSON_MERGE_PATCH('{"a":{"x":1}}', '{"a":{"y":2}}');
  +----------------------------------------------------+
  | JSON_MERGE_PATCH('{"a":{"x":1}}', '{"a":{"y":2}}') |
  +----------------------------------------------------+
  | {"a": {"x": 1, "y": 2}}                            |
  +----------------------------------------------------+
  ```

`JSON_MERGE_PATCH()` é suportado no MySQL 8.0.3 e versões posteriores.

**JSON_MERGE_PATCH() em comparação com JSON_MERGE_PRESERVE().** O comportamento do `JSON_MERGE_PATCH()` é o mesmo do `JSON_MERGE_PRESERVE()`, com as seguintes duas exceções:

+ `JSON_MERGE_PATCH()` remove qualquer membro no primeiro objeto com uma chave correspondente no segundo objeto, desde que o valor associado à chave no segundo objeto não seja JSON `null`.

+ Se o segundo objeto tiver um membro com uma chave que corresponde a um membro no primeiro objeto, `JSON_MERGE_PATCH()` *replaca* o valor no primeiro objeto com o valor no segundo objeto, enquanto `JSON_MERGE_PRESERVE()` *apresenta* o segundo valor ao valor do primeiro.

Este exemplo compara os resultados da fusão dos mesmos 3 objetos JSON, cada um com uma chave correspondente `"a"`, com cada uma dessas duas funções:

  ```
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

  ```
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

Essa função foi adicionada no MySQL 8.0.3 como sinônimo de `JSON_MERGE()`. A função `JSON_MERGE()` é agora desatualizada e está sujeita à remoção em uma versão futura do MySQL.

Essa função é semelhante, mas difere de `JSON_MERGE_PATCH()` em aspectos significativos; consulte JSON_MERGE_PATCH() em comparação com JSON_MERGE_PRESERVE() em comparação com JSON_MERGE_PRESERVE()"), para mais informações.

* `JSON_REMOVE(json_doc, path[, path] ...)`(json-modification-functions.html#function_json-remove)

Remove dados de um documento JSON e retorna o resultado. Retorna `NULL` se qualquer argumento for `NULL`. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou qualquer argumento *`path`* não for uma expressão de caminho válida ou for `$` ou contém um `*` ou `**` wildcard.

Os argumentos do *`path`* são avaliados da esquerda para a direita. O documento produzido ao avaliar um caminho se torna o novo valor contra o qual o próximo caminho é avaliado.

Não é um erro se o elemento a ser removido não existir no documento; nesse caso, o caminho não afeta o documento.

  ```
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

No MySQL 8.0.4, o otimizador pode realizar uma atualização parcial, em lugar, de uma coluna `JSON` em vez de remover o documento antigo e escrever o novo documento na íntegra na coluna. Essa otimização pode ser realizada para uma declaração de atualização que utiliza a função `JSON_REPLACE()` e atende às condições descritas em Atualizações Parciais de Valores JSON.

Para uma comparação de `JSON_INSERT()`, `JSON_REPLACE()` e `JSON_SET()`, veja a discussão de `JSON_SET()`.

  ```
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

No MySQL 8.0.4, o otimizador pode realizar uma atualização parcial, em lugar, de uma coluna `JSON`, em vez de remover o documento antigo e escrever o novo documento na íntegra na coluna. Essa otimização pode ser realizada para uma declaração de atualização que utiliza a função `JSON_SET()` e atende às condições descritas em Atualizações Parciais de Valores JSON.

As funções `JSON_SET()`, `JSON_INSERT()` e `JSON_REPLACE()` estão relacionadas:

+ `JSON_SET()` substitui os valores existentes e adiciona valores não existentes.

+ `JSON_INSERT()` insere valores sem substituir os valores existentes.

+ `JSON_REPLACE()` substitui apenas os valores existentes.

Os exemplos a seguir ilustram essas diferenças, usando um caminho que existe no documento (`$.a`) e outro que não existe (`$.c`):

  ```
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

Dentro de uma cadeia, certas sequências têm um significado especial, a menos que o modo `NO_BACKSLASH_ESCAPES` SQL esteja habilitado. Cada uma dessas sequências começa com uma barra invertida (`\`), conhecida como *caractere de escape*. O MySQL reconhece as sequências de escape mostradas na Tabela 14.23, “Sequências de escape de caracteres especiais JSON_UNQUOTE() (Sequências de escape de caracteres especiais)”. Para todas as outras sequências de escape, a barra invertida é ignorada. Ou seja, o caractere escapado é interpretado como se não tivesse sido escapado. Por exemplo, `\x` é apenas `x`. Essas sequências são sensíveis ao caso. Por exemplo, `\b` é interpretado como um espaço de volta, mas `\B` é interpretado como `B`.

**Tabela 14.23 Sequências de escape de caracteres especiais JSON_UNQUOTE()**

  <table><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Escape Sequence</th> <th>Personagem representado por sequência</th> </tr></thead><tbody><tr> <td><code>\"</code></td> <td>Uma citação dupla (<code>"</code>) personagem</td> </tr><tr> <td><code>\b</code></td> <td>Um caractere de recuo</td> </tr><tr> <td><code>\f</code></td> <td>Um caractere de quebra de página</td> </tr><tr> <td><code>\n</code></td> <td>Um caractere de nova linha (linefeed)</td> </tr><tr> <td><code>\r</code></td> <td>Um caractere de retorno de carro</td> </tr><tr> <td><code>\t</code></td> <td>Um caractere de tabulação</td> </tr><tr> <td><code>\\</code></td> <td>Um traço de barra (<code>\</code>) personagem</td> </tr><tr> <td><code>\u<em class="replaceable"><code>XXXX</code></em></code></td> <td>Bytes UTF-8 para valor Unicode<em class="replaceable"><code>XXXX</code></em></td> </tr></tbody></table>

Dois exemplos simples do uso dessa função são mostrados aqui:

  ```
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

  ```
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

### 14.17.5 Funções que retornam atributos de valor JSON

As funções nesta seção retornam atributos de valores JSON.

* `JSON_DEPTH(json_doc)`

Retorna a profundidade máxima de um documento JSON. Retorna `NULL` se o argumento for `NULL`. Um erro ocorre se o argumento não for um documento JSON válido.

Um array vazio, um objeto vazio ou um valor escalar tem profundidade 1. Um array não vazio que contém apenas elementos de profundidade 1 ou um objeto não vazio que contém apenas valores de membro de profundidade 1 tem profundidade 2. Caso contrário, um documento JSON tem profundidade maior que 2.

  ```
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

Retorna o comprimento de um documento JSON, ou, se um argumento *`path`* for fornecido, o comprimento do valor dentro do documento identificado pelo caminho. Retorna `NULL` se qualquer argumento for `NULL` ou o argumento *`path` não identificar um valor no documento. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou o argumento *`path`* não for uma expressão de caminho válida. Antes do MySQL 8.0.26, um erro também é gerado se a expressão de caminho contiver um `*` ou `**` wildcard.

O comprimento de um documento é determinado da seguinte forma:

+ O comprimento de um escalar é 1.  
+ O comprimento de um array é o número de elementos do array.  
+ O comprimento de um objeto é o número de membros do objeto.  
+ O comprimento não conta o comprimento de arrays ou objetos aninhados.

  ```
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

  ```
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

  ```
  mysql> SELECT JSON_TYPE(NULL);
  +-----------------+
  | JSON_TYPE(NULL) |
  +-----------------+
  | NULL            |
  +-----------------+
  ```

Um erro ocorre se o argumento não for um valor JSON válido:

  ```
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

- `TIME`: escalares MySQL `TIME`

+ Tipos de string:

- `STRING`: Escalares do tipo de caractere MySQL `utf8mb3`: `CHAR`, `VARCHAR`, `TEXT`, `ENUM` e `SET`

+ Tipos binários:

- `BLOB`: Escalares do tipo binário do MySQL, incluindo `BINARY`, `VARBINARY`, `BLOB` e `BIT`

+ Todos os outros tipos:

- `OPAQUE` (bits brutos)
* `JSON_VALID(val)`

Retorna 0 ou 1 para indicar se um valor é JSON válido. Retorna `NULL` se o argumento for `NULL`.

  ```
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

### 14.17.6 Funções de tabela JSON

Esta seção contém informações sobre funções JSON que convertem dados JSON em dados tabelados. O MySQL 8.0 suporta uma dessas funções, `JSON_TABLE()`.

[`JSON_TABLE(expr, path COLUMNS (column_list) [AS] alias)`](json-table-functions.html#function_json-table)

Extrai dados de um documento JSON e os retorna como uma tabela relacional com as colunas especificadas. A sintaxe completa para essa função é mostrada aqui:

```
JSON_TABLE(
    expr,
    path COLUMNS (column_list)
)   [AS] alias

column_list:
    column[, column][, ...]

column:
    name FOR ORDINALITY
    |  name type PATH string path [on_empty] [on_error]
    |  name type EXISTS PATH string path
    |  NESTED [PATH] path COLUMNS (column_list)

on_empty:
    {NULL | DEFAULT json_string | ERROR} ON EMPTY

on_error:
    {NULL | DEFAULT json_string | ERROR} ON ERROR
```

*`expr`*: Esta é uma expressão que retorna dados em formato JSON. Pode ser uma constante (`'{"a":1}'`), uma coluna (`t1.json_data`, dada a tabela `t1` especificada antes de `JSON_TABLE()` na cláusula `FROM`, ou uma chamada de função (`JSON_EXTRACT(t1.json_data,'$.post.comments')`).

*`path`*: Uma expressão de caminho JSON, que é aplicada à fonte de dados. Referimos ao valor JSON que corresponde ao caminho como a *fonte de linha*; isso é usado para gerar uma linha de dados relacionais. A cláusula `COLUMNS` avalia a fonte de linha, encontra valores JSON específicos dentro da fonte de linha e retorna esses valores JSON como valores SQL em colunas individuais de uma linha de dados relacionais.

O *`alias` é necessário. As regras usuais para aliases de tabela se aplicam (consulte a Seção 11.2, “Nomes de Objetos do Esquema”).

A partir do MySQL 8.0.27, essa função compara os nomes dos colunas de forma insensível a maiúsculas e minúsculas.

`JSON_TABLE()` suporta quatro tipos de colunas, descritos na lista a seguir:

1. `name FOR ORDINALITY`: Este tipo enumera linhas na cláusula `COLUMNS`; a coluna denominada *`name`* é um contador cujo tipo é `UNSIGNED INT`, e cujo valor inicial é 1. Isso é equivalente a especificar uma coluna como `AUTO_INCREMENT` em uma declaração `CREATE TABLE`, e pode ser usado para distinguir linhas parentes com o mesmo valor para várias linhas geradas por uma cláusula `NESTED [PATH]`.

2. `name type PATH string_path [on_empty] [on_error]`: As colunas deste tipo são usadas para extrair valores especificados por *`string_path`*. *`type`* é um tipo de dados escalar do MySQL (ou seja, não pode ser um objeto ou uma matriz). `JSON_TABLE()` extrai dados como JSON e, em seguida, os coerce para o tipo da coluna, usando a conversão automática regular aplicável aos dados JSON no MySQL. Um valor ausente aciona a cláusula *`on_empty`*. Salvar um objeto ou matriz aciona a cláusula opcional *`on error`*; isso também ocorre quando ocorre um erro durante a coerção do valor salvo como JSON para a coluna da tabela, como tentar salvar a string `'asd'` em uma coluna de inteiro.

3. `name type EXISTS PATH path`: Esta coluna retorna 1 se houver algum dado presente na localização especificada por *`path`*, e 0 caso contrário. *`type`* pode ser qualquer tipo de dados válidos do MySQL, mas normalmente deve ser especificado como alguma variedade de `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

4. `NESTED [PATH] path COLUMNS (column_list)`: Isso achatará objetos ou matrizes aninhadas nos dados JSON em uma única linha, juntamente com os valores JSON do objeto ou matriz pai. O uso de várias opções `PATH` permite a projeção de valores JSON de múltiplos níveis de aninhamento em uma única linha.

O *`path` está relacionado ao caminho da linha de caminho do pai de `JSON_TABLE()`, ou ao caminho da cláusula pai `NESTED [PATH]` no caso de caminhos aninhados.

*`on empty`*, se especificado, determina o que o `JSON_TABLE()` faz no caso de os dados estarem ausentes (dependendo do tipo). Esta cláusula também é acionada em uma coluna de uma cláusula `NESTED PATH` quando esta última não tem correspondência e uma linha complementada `NULL` é produzida para ela. *`on empty`* assume um dos seguintes valores:

* `NULL ON EMPTY`: A coluna está definida como `NULL`; este é o comportamento padrão.

* `DEFAULT json_string ON EMPTY`: o *`json_string`* fornecido é analisado como JSON, desde que seja válido, e armazenado em vez do valor ausente. As regras de tipo de coluna também se aplicam ao valor padrão.

* `ERROR ON EMPTY`: Um erro é lançado.

Se utilizado, *`on_error`* assume um dos seguintes valores com o resultado correspondente, conforme mostrado aqui:

* `NULL ON ERROR`: A coluna está definida como `NULL`; esse é o comportamento padrão.

* `DEFAULT json string ON ERROR`: O *`json_string`* é analisado como JSON (desde que seja válido) e armazenado em vez do objeto ou do array.

* `ERROR ON ERROR`: Um erro é lançado.

Antes do MySQL 8.0.20, um aviso era exibido se ocorrer um erro de conversão de tipo com `NULL ON ERROR` ou `DEFAULT ... ON ERROR` sendo especificado ou implícito. No MySQL 8.0.20 e versões posteriores, isso não é mais o caso. (Bug #30628330)

Anteriormente, era possível especificar as cláusulas `ON EMPTY` e `ON ERROR` em qualquer ordem. Isso vai contra o padrão SQL, que estipula que `ON EMPTY`, se especificado, deve preceder qualquer cláusula `ON ERROR`. Por essa razão, a partir do MySQL 8.0.20, especificar `ON ERROR` antes de `ON EMPTY` é desaconselhável; tentar fazer isso faz com que o servidor emita um aviso. Espera-se que o suporte para a sintaxe não padrão seja removido em uma versão futura do MySQL.

Quando um valor salvo em uma coluna é truncado, como salvar 3,14159 em uma coluna `DECIMAL(10,1)` - DECIMAL, NUMERIC"), um aviso é emitido independentemente de qualquer opção `ON ERROR`. Quando vários valores são truncados em uma única declaração, o aviso é emitido apenas uma vez.

Antes do MySQL 8.0.21, quando a expressão e o caminho passados para essa função eram resolvidos a JSON null, `JSON_TABLE()` gerava um erro. No MySQL 8.0.21 e versões posteriores, ele retorna SQL `NULL` nesses casos, de acordo com o padrão SQL, conforme mostrado aqui (Bug #31345503, Bug #99557):

```
mysql> SELECT *
    ->   FROM
    ->     JSON_TABLE(
    ->       '[ {"c1": null} ]',
    ->       '$[*]' COLUMNS( c1 INT PATH '$.c1' ERROR ON ERROR )
    ->     ) as jt;
+------+
| c1   |
+------+
| NULL |
+------+
1 row in set (0.00 sec)
```

A consulta a seguir demonstra o uso de `ON EMPTY` e `ON ERROR`. A linha correspondente a `{"b":1}` está vazia para o caminho `"$.a"`, e ao tentar salvar `[1,2]` como um escalar, é gerado um erro; essas linhas são destacadas na saída mostrada.

```
mysql> SELECT *
    -> FROM
    ->   JSON_TABLE(
    ->     '[{"a":"3"},{"a":2},{"b":1},{"a":0},{"a":[1,2]}]',
    ->     "$[*]"
    ->     COLUMNS(
    ->       rowid FOR ORDINALITY,
    ->       ac VARCHAR(100) PATH "$.a" DEFAULT '111' ON EMPTY DEFAULT '999' ON ERROR,
    ->       aj JSON PATH "$.a" DEFAULT '{"x": 333}' ON EMPTY,
    ->       bx INT EXISTS PATH "$.b"
    ->     )
    ->   ) AS tt;

+-------+------+------------+------+
| rowid | ac   | aj         | bx   |
+-------+------+------------+------+
|     1 | 3    | "3"        |    0 |
|     2 | 2    | 2          |    0 |
|     3 | 111  | {"x": 333} |    1 |
|     4 | 0    | 0          |    0 |
|     5 | 999  | [1, 2]     |    0 |
+-------+------+------------+------+
5 rows in set (0.00 sec)
```

Os nomes dos colunas estão sujeitos às regras e limitações habituais que regem os nomes dos colunas de tabela. Veja a Seção 11.2, “Nomes de Objetos do Esquema”.

Todas as expressões JSON e de caminho JSON são verificadas quanto à validade; uma expressão inválida de qualquer tipo causa um erro.

Cada partida para o *`path`* que precede a palavra-chave `COLUMNS` corresponde a uma linha individual na tabela de resultados. Por exemplo, a seguinte consulta mostra o resultado mostrado aqui:

```
mysql> SELECT *
    -> FROM
    ->   JSON_TABLE(
    ->     '[{"x":2,"y":"8"},{"x":"3","y":"7"},{"x":"4","y":6}]',
    ->     "$[*]" COLUMNS(
    ->       xval VARCHAR(100) PATH "$.x",
    ->       yval VARCHAR(100) PATH "$.y"
    ->     )
    ->   ) AS  jt1;

+------+------+
| xval | yval |
+------+------+
| 2    | 8    |
| 3    | 7    |
| 4    | 6    |
+------+------+
```

A expressão `"$[*]"` corresponde a cada elemento do array. Você pode filtrar as linhas no resultado modificando o caminho. Por exemplo, usando `"$[1]"`, limita a extração ao segundo elemento do array JSON usado como fonte, como mostrado aqui:

```
mysql> SELECT *
    -> FROM
    ->   JSON_TABLE(
    ->     '[{"x":2,"y":"8"},{"x":"3","y":"7"},{"x":"4","y":6}]',
    ->     "$[1]" COLUMNS(
    ->       xval VARCHAR(100) PATH "$.x",
    ->       yval VARCHAR(100) PATH "$.y"
    ->     )
    ->   ) AS  jt1;

+------+------+
| xval | yval |
+------+------+
| 3    | 7    |
+------+------+
```

Dentro de uma definição de coluna, `"$"` passa toda a correspondência para a coluna; `"$.x"` e `"$.y"` passam apenas os valores correspondentes às chaves `x`, respetivamente, dentro dessa correspondência. Para mais informações, consulte a Sintaxe de Caminhos JSON.

`NESTED PATH` (ou simplesmente `NESTED`; `PATH` é opcional) produz um conjunto de registros para cada partida na cláusula `COLUMNS` à qual pertence. Se não houver correspondência, todas as colunas do caminho aninhado são definidas como `NULL`. Isso implementa uma união externa entre a cláusula mais alta e `NESTED [PATH]`. Uma união interna pode ser emulada aplicando uma condição adequada na cláusula `WHERE`, como mostrado aqui:

```
mysql> SELECT *
    -> FROM
    ->   JSON_TABLE(
    ->     '[ {"a": 1, "b": [11,111]}, {"a": 2, "b": [22,222]}, {"a":3}]',
    ->     '$[*]' COLUMNS(
    ->             a INT PATH '$.a',
    ->             NESTED PATH '$.b[*]' COLUMNS (b INT PATH '$')
    ->            )
    ->    ) AS jt
    -> WHERE b IS NOT NULL;

+------+------+
| a    | b    |
+------+------+
|    1 |   11 |
|    1 |  111 |
|    2 |   22 |
|    2 |  222 |
+------+------+
```

Caminhos aninhados de irmãos, ou seja, duas ou mais instâncias de `NESTED [PATH]` na mesma cláusula `COLUMNS`, são processados um após o outro, um de cada vez. Enquanto um caminho aninhado de irmãos está produzindo registros, as colunas de qualquer expressão de caminho aninhado de irmãos são definidas como `NULL`. Isso significa que o número total de registros para uma única correspondência dentro de uma única cláusula `COLUMNS` é a soma e não o produto de todos os registros produzidos pelos modificadores `NESTED [PATH]`, como mostrado aqui:

```
mysql> SELECT *
    -> FROM
    ->   JSON_TABLE(
    ->     '[{"a": 1, "b": [11,111]}, {"a": 2, "b": [22,222]}]',
    ->     '$[*]' COLUMNS(
    ->         a INT PATH '$.a',
    ->         NESTED PATH '$.b[*]' COLUMNS (b1 INT PATH '$'),
    ->         NESTED PATH '$.b[*]' COLUMNS (b2 INT PATH '$')
    ->     )
    -> ) AS jt;

+------+------+------+
| a    | b1   | b2   |
+------+------+------+
|    1 |   11 | NULL |
|    1 |  111 | NULL |
|    1 | NULL |   11 |
|    1 | NULL |  111 |
|    2 |   22 | NULL |
|    2 |  222 | NULL |
|    2 | NULL |   22 |
|    2 | NULL |  222 |
+------+------+------+
```

Uma coluna `FOR ORDINALITY` enumera os registros produzidos pela cláusula `COLUMNS`, e pode ser usada para distinguir registros parentais de um caminho aninhado, especialmente se os valores nos registros parentais forem os mesmos, como pode ser visto aqui:

```
mysql> SELECT *
    -> FROM
    ->   JSON_TABLE(
    ->     '[{"a": "a_val",
    '>       "b": [{"c": "c_val", "l": [1,2]}]},
    '>     {"a": "a_val",
    '>       "b": [{"c": "c_val","l": [11]}, {"c": "c_val", "l": [22]}]}]',
    ->     '$[*]' COLUMNS(
    ->       top_ord FOR ORDINALITY,
    ->       apath VARCHAR(10) PATH '$.a',
    ->       NESTED PATH '$.b[*]' COLUMNS (
    ->         bpath VARCHAR(10) PATH '$.c',
    ->         ord FOR ORDINALITY,
    ->         NESTED PATH '$.l[*]' COLUMNS (lpath varchar(10) PATH '$')
    ->         )
    ->     )
    -> ) as jt;

+---------+---------+---------+------+-------+
| top_ord | apath   | bpath   | ord  | lpath |
+---------+---------+---------+------+-------+
|       1 |  a_val  |  c_val  |    1 | 1     |
|       1 |  a_val  |  c_val  |    1 | 2     |
|       2 |  a_val  |  c_val  |    1 | 11    |
|       2 |  a_val  |  c_val  |    2 | 22    |
+---------+---------+---------+------+-------+
```

O documento fonte contém uma matriz com dois elementos; cada um desses elementos produz duas linhas. Os valores de `apath` e `bpath` são os mesmos em todo o conjunto de resultados; isso significa que eles não podem ser usados para determinar se os valores de `lpath` vieram de pais iguais ou diferentes. O valor da coluna `ord` permanece o mesmo que o conjunto de registros que têm `top_ord` igual a 1, portanto, esses dois valores são de um único objeto. Os dois valores restantes são de objetos diferentes, uma vez que eles têm valores diferentes na coluna `ord`.

Normalmente, você não pode se juntar a uma tabela derivada que depende de colunas de tabelas anteriores na mesma cláusula `FROM`. O MySQL, de acordo com o padrão SQL, faz uma exceção para funções de tabela; essas são consideradas tabelas derivadas laterais, mesmo em versões do MySQL que ainda não suportam a palavra-chave `LATERAL` (8.0.13 e anteriores). Em versões onde `LATERAL` é suportada (8.0.14 e posteriores), é implícito, e por essa razão não é permitido antes de `JSON_TABLE()`, também de acordo com o padrão.

Suponha que você tenha uma tabela `t1` criada e preenchida usando as declarações mostradas aqui:

```
CREATE TABLE t1 (c1 INT, c2 CHAR(1), c3 JSON);

INSERT INTO t1 () VALUES
	ROW(1, 'z', JSON_OBJECT('a', 23, 'b', 27, 'c', 1)),
	ROW(1, 'y', JSON_OBJECT('a', 44, 'b', 22, 'c', 11)),
	ROW(2, 'x', JSON_OBJECT('b', 1, 'c', 15)),
	ROW(3, 'w', JSON_OBJECT('a', 5, 'b', 6, 'c', 7)),
	ROW(5, 'v', JSON_OBJECT('a', 123, 'c', 1111))
;
```

Você pode, então, executar junções, como esta, na qual `JSON_TABLE()` atua como uma tabela derivada, ao mesmo tempo em que se refere a uma coluna em uma tabela previamente referenciada:

```
SELECT c1, c2, JSON_EXTRACT(c3, '$.*')
FROM t1 AS m
JOIN
JSON_TABLE(
  m.c3,
  '$.*'
  COLUMNS(
    at VARCHAR(10) PATH '$.a' DEFAULT '1' ON EMPTY,
    bt VARCHAR(10) PATH '$.b' DEFAULT '2' ON EMPTY,
    ct VARCHAR(10) PATH '$.c' DEFAULT '3' ON EMPTY
  )
) AS tt
ON m.c1 > tt.at;
```

Tentar usar a palavra-chave `LATERAL` com esta consulta gera `ER_PARSE_ERROR`.

### 14.17.7 Funções de Validação de Esquema JSON

A partir do MySQL 8.0.17, o MySQL suporta a validação de documentos JSON contra esquemas JSON que estejam de acordo com o [Projeto 4 da especificação do JSON Schema][(https://json-schema.org/specification-links.html#draft-4)]. Isso pode ser feito usando qualquer uma das funções detalhadas nesta seção, ambas as quais levam dois argumentos, um esquema JSON e um documento JSON que é validado contra o esquema. `JSON_SCHEMA_VALID()` retorna verdadeiro se o documento validar contra o esquema, e falso se não o fizer; `JSON_SCHEMA_VALIDATION_REPORT()` fornece um relatório em formato JSON sobre a validação.

Ambas as funções tratam entradas nulos ou inválidas da seguinte forma:

* Se pelo menos um dos argumentos for `NULL`, a função retorna `NULL`.

* Se pelo menos um dos argumentos não for um JSON válido, a função gera um erro (`ER_INVALID_TYPE_FOR_JSON`)

* Além disso, se o esquema não for um objeto JSON válido, a função retorna `ER_INVALID_JSON_TYPE`.

O MySQL suporta o atributo `required` nos esquemas JSON para impor a inclusão de propriedades obrigatórias (consulte os exemplos nas descrições das funções).

O MySQL suporta os atributos `id`, `$schema`, `description` e `type` nos esquemas JSON, mas não exige nenhum desses.

O MySQL não suporta recursos externos em esquemas JSON; o uso da palavra-chave `$ref` faz com que `JSON_SCHEMA_VALID()` falhe com `ER_NOT_SUPPORTED_YET`.

Nota

O MySQL suporta padrões de expressão regular em esquema JSON, que suporta, mas ignora silenciosamente padrões inválidos (veja a descrição de `JSON_SCHEMA_VALID()` para um exemplo).

Essas funções são descritas em detalhe na lista a seguir:

* `JSON_SCHEMA_VALID(schema,document)`

Valida um JSON *`document`* contra um JSON *`schema`*. Ambos *`schema`* e *`document`* são necessários. O esquema deve ser um objeto JSON válido; o documento deve ser um documento JSON válido. Desde que essas condições sejam atendidas: Se o documento validar contra o esquema, a função retorna true (1); caso contrário, retorna false (0).

Neste exemplo, definimos uma variável de usuário `@schema` com o valor de um esquema JSON para coordenadas geográficas, e outra `@document` com o valor de um documento JSON contendo uma dessas coordenadas. Em seguida, verificamos que `@document` valida de acordo com `@schema` usando-os como argumentos para `JSON_SCHEMA_VALID()`:

  ```
  mysql> SET @schema = '{
      '>  "id": "http://json-schema.org/geo",
      '> "$schema": "http://json-schema.org/draft-04/schema#",
      '> "description": "A geographical coordinate",
      '> "type": "object",
      '> "properties": {
      '>   "latitude": {
      '>     "type": "number",
      '>     "minimum": -90,
      '>     "maximum": 90
      '>   },
      '>   "longitude": {
      '>     "type": "number",
      '>     "minimum": -180,
      '>     "maximum": 180
      '>   }
      '> },
      '> "required": ["latitude", "longitude"]
      '>}';
  Query OK, 0 rows affected (0.01 sec)

  mysql> SET @document = '{
      '> "latitude": 63.444697,
      '> "longitude": 10.445118
      '>}';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT JSON_SCHEMA_VALID(@schema, @document);
  +---------------------------------------+
  | JSON_SCHEMA_VALID(@schema, @document) |
  +---------------------------------------+
  |                                     1 |
  +---------------------------------------+
  1 row in set (0.00 sec)
  ```

Como o `@schema` contém o atributo `required`, podemos definir o `@document` para um valor que seja válido, mas que não contenha as propriedades necessárias, e, em seguida, testá-lo contra o `@schema`, da seguinte forma:

  ```
  mysql> SET @document = '{}';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT JSON_SCHEMA_VALID(@schema, @document);
  +---------------------------------------+
  | JSON_SCHEMA_VALID(@schema, @document) |
  +---------------------------------------+
  |                                     0 |
  +---------------------------------------+
  1 row in set (0.00 sec)
  ```

Se agora definirmos o valor de `@schema` para o mesmo esquema JSON, mas sem o atributo `required`, o `@document` valida porque é um objeto JSON válido, mesmo que não contenha propriedades, como mostrado aqui:

  ```
  mysql> SET @schema = '{
      '> "id": "http://json-schema.org/geo",
      '> "$schema": "http://json-schema.org/draft-04/schema#",
      '> "description": "A geographical coordinate",
      '> "type": "object",
      '> "properties": {
      '>   "latitude": {
      '>     "type": "number",
      '>     "minimum": -90,
      '>     "maximum": 90
      '>   },
      '>   "longitude": {
      '>     "type": "number",
      '>     "minimum": -180,
      '>     "maximum": 180
      '>   }
      '> }
      '>}';
  Query OK, 0 rows affected (0.00 sec)


  mysql> SELECT JSON_SCHEMA_VALID(@schema, @document);
  +---------------------------------------+
  | JSON_SCHEMA_VALID(@schema, @document) |
  +---------------------------------------+
  |                                     1 |
  +---------------------------------------+
  1 row in set (0.00 sec)
  ```

**JSON_SCHEMA_VALID() e restrições CHECK.** `JSON_SCHEMA_VALID()` também pode ser usado para impor restrições `CHECK`.

Considere a tabela `geo` criada conforme mostrado aqui, com uma coluna JSON `coordinate` representando um ponto de latitude e longitude em um mapa, regido pelo esquema JSON usado como argumento em uma chamada `JSON_SCHEMA_VALID()` que é passada como a expressão para uma restrição `CHECK` nesta tabela:

  ```
  mysql> CREATE TABLE geo (
      ->     coordinate JSON,
      ->     CHECK(
      ->         JSON_SCHEMA_VALID(
      ->             '{
      '>                 "type":"object",
      '>                 "properties":{
      '>                       "latitude":{"type":"number", "minimum":-90, "maximum":90},
      '>                       "longitude":{"type":"number", "minimum":-180, "maximum":180}
      '>                 },
      '>                 "required": ["latitude", "longitude"]
      '>             }',
      ->             coordinate
      ->         )
      ->     )
      -> );
  Query OK, 0 rows affected (0.45 sec)
  ```

Nota

Como uma restrição MySQL `CHECK` não pode conter referências a variáveis, você deve passar o esquema JSON para `JSON_SCHEMA_VALID()` inline ao usá-lo para especificar tal restrição para uma tabela.

Atribuímos valores JSON que representam coordenadas a três variáveis, conforme mostrado aqui:

  ```
  mysql> SET @point1 = '{"latitude":59, "longitude":18}';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SET @point2 = '{"latitude":91, "longitude":0}';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SET @point3 = '{"longitude":120}';
  Query OK, 0 rows affected (0.00 sec)
  ```

O primeiro desses valores é válido, como pode ser visto na seguinte declaração `INSERT`:

  ```
  mysql> INSERT INTO geo VALUES(@point1);
  Query OK, 1 row affected (0.05 sec)
  ```

O segundo valor JSON é inválido e, portanto, não atende à restrição, conforme mostrado aqui:

  ```
  mysql> INSERT INTO geo VALUES(@point2);
  ERROR 3819 (HY000): Check constraint 'geo_chk_1' is violated.
  ```

Em MySQL 8.0.19 e versões posteriores, você pode obter informações precisas sobre a natureza do erro — neste caso, que o valor `latitude` excede o máximo definido no esquema — emitindo uma declaração `SHOW WARNINGS` (show-warnings.html "15.7.7.42 SHOW WARNINGS Statement"):

  ```
  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Error
     Code: 3934
  Message: The JSON document location '#/latitude' failed requirement 'maximum' at
  JSON Schema location '#/properties/latitude'.
  *************************** 2. row ***************************
    Level: Error
     Code: 3819
  Message: Check constraint 'geo_chk_1' is violated.
  2 rows in set (0.00 sec)
  ```

O terceiro valor de coordenada definido acima também é inválido, pois está faltando a propriedade `latitude`. Como antes, você pode ver isso ao tentar inserir o valor na tabela `geo`, e em seguida emitir `SHOW WARNINGS` posteriormente:

  ```
  mysql> INSERT INTO geo VALUES(@point3);
  ERROR 3819 (HY000): Check constraint 'geo_chk_1' is violated.
  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Error
     Code: 3934
  Message: The JSON document location '#' failed requirement 'required' at JSON
  Schema location '#'.
  *************************** 2. row ***************************
    Level: Error
     Code: 3819
  Message: Check constraint 'geo_chk_1' is violated.
  2 rows in set (0.00 sec)
  ```

Veja a Seção 15.1.20.6, “Restrições CHECK”, para mais informações.

O JSON Schema tem suporte para especificar padrões de expressão regular para strings, mas a implementação usada pelo MySQL ignora silenciosamente padrões inválidos. Isso significa que `JSON_SCHEMA_VALID()` pode retornar verdadeiro mesmo quando um padrão de expressão regular é inválido, como mostrado aqui:

  ```
  mysql> SELECT JSON_SCHEMA_VALID('{"type":"string","pattern":"("}', '"abc"');
  +---------------------------------------------------------------+
  | JSON_SCHEMA_VALID('{"type":"string","pattern":"("}', '"abc"') |
  +---------------------------------------------------------------+
  |                                                             1 |
  +---------------------------------------------------------------+
  1 row in set (0.04 sec)
  ```

* `JSON_SCHEMA_VALIDATION_REPORT(schema,document)`

Valida um JSON *`document`* contra um JSON *`schema`*. Ambos *`schema`* e *`document`* são necessários. Assim como em JSON_VALID_SCHEMA(), o esquema deve ser um objeto JSON válido, e o documento deve ser um documento JSON válido. Desde que essas condições sejam atendidas, a função retorna um relatório, como um documento JSON, sobre o resultado da validação. Se o documento JSON for considerado válido de acordo com o JSON Schema, a função retorna um objeto JSON com uma propriedade `valid` que tem o valor "true". Se o documento JSON falhar a validação, a função retorna um objeto JSON que inclui as propriedades listadas aqui:

+ `valid`: Sempre "false" para uma validação de esquema falha

+ `reason`: Uma string legível por humanos que contém o motivo do erro

+ `schema-location`: Um identificador de fragmento de URI de ponteiro JSON que indica onde a validação falhou (consulte a Nota a seguir desta lista)

+ `document-location`: Um identificador de fragmento de URI de ponteiro JSON que indica onde o erro de validação ocorreu no documento JSON (consulte a Nota a seguir desta lista)

+ `schema-failed-keyword`: Uma string contendo o nome da palavra-chave ou propriedade no esquema JSON que foi violado

Nota

Os identificadores de fragmentos de URI de ponteiros JSON são definidos em [RFC 6901 - JavaScript Object Notation (JSON) Pointer][(https://tools.ietf.org/html/rfc6901#page-5)]. (Estes não são *mesmos* que a notação de caminho JSON usada por `JSON_EXTRACT()` e outras funções JSON do MySQL.) Nesta notação, `#` representa todo o documento, e `#/myprop` representa a porção do documento incluída na propriedade de nível superior denominada `myprop`. Consulte a especificação citada anteriormente e os exemplos mostrados mais adiante nesta seção para obter mais informações.

Neste exemplo, definimos uma variável de usuário `@schema` com o valor de um esquema JSON para coordenadas geográficas, e outra `@document` com o valor de um documento JSON contendo uma dessas coordenadas. Em seguida, verificamos que `@document` valida de acordo com `@schema` usando-os como argumentos para `JSON_SCHEMA_VALIDATION_REORT()`:

  ```
  mysql> SET @schema = '{
      '>  "id": "http://json-schema.org/geo",
      '> "$schema": "http://json-schema.org/draft-04/schema#",
      '> "description": "A geographical coordinate",
      '> "type": "object",
      '> "properties": {
      '>   "latitude": {
      '>     "type": "number",
      '>     "minimum": -90,
      '>     "maximum": 90
      '>   },
      '>   "longitude": {
      '>     "type": "number",
      '>     "minimum": -180,
      '>     "maximum": 180
      '>   }
      '> },
      '> "required": ["latitude", "longitude"]
      '>}';
  Query OK, 0 rows affected (0.01 sec)

  mysql> SET @document = '{
      '> "latitude": 63.444697,
      '> "longitude": 10.445118
      '>}';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT JSON_SCHEMA_VALIDATION_REPORT(@schema, @document);
  +---------------------------------------------------+
  | JSON_SCHEMA_VALIDATION_REPORT(@schema, @document) |
  +---------------------------------------------------+
  | {"valid": true}                                   |
  +---------------------------------------------------+
  1 row in set (0.00 sec)
  ```

Agora, definimos `@document` de tal forma que especifica um valor ilegal para uma de suas propriedades, assim:

  ```
  mysql> SET @document = '{
      '> "latitude": 63.444697,
      '> "longitude": 310.445118
      '> }';
  ```

A validação de `@document` agora falha quando testada com `JSON_SCHEMA_VALIDATION_REPORT()`. A saída da chamada de função contém informações detalhadas sobre a falha (com a função envolvida por `JSON_PRETTY()` para fornecer uma melhor formatação), conforme mostrado aqui:

  ```
  mysql> SELECT JSON_PRETTY(JSON_SCHEMA_VALIDATION_REPORT(@schema, @document))\G
  *************************** 1. row ***************************
  JSON_PRETTY(JSON_SCHEMA_VALIDATION_REPORT(@schema, @document)): {
    "valid": false,
    "reason": "The JSON document location '#/longitude' failed requirement 'maximum' at JSON Schema location '#/properties/longitude'",
    "schema-location": "#/properties/longitude",
    "document-location": "#/longitude",
    "schema-failed-keyword": "maximum"
  }
  1 row in set (0.00 sec)
  ```

Como o `@schema` contém o atributo `required`, podemos definir o `@document` para um valor que é válido, mas não contém as propriedades necessárias, e então testá-lo contra o `@schema`. A saída do `JSON_SCHEMA_VALIDATION_REPORT()` mostra que a validação falha devido à falta de um elemento necessário, assim:

  ```
  mysql> SET @document = '{}';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT JSON_PRETTY(JSON_SCHEMA_VALIDATION_REPORT(@schema, @document))\G
  *************************** 1. row ***************************
  JSON_PRETTY(JSON_SCHEMA_VALIDATION_REPORT(@schema, @document)): {
    "valid": false,
    "reason": "The JSON document location '#' failed requirement 'required' at JSON Schema location '#'",
    "schema-location": "#",
    "document-location": "#",
    "schema-failed-keyword": "required"
  }
  1 row in set (0.00 sec)
  ```

Se agora definirmos o valor de `@schema` para o mesmo esquema JSON, mas sem o atributo `required`, o `@document` valida porque é um objeto JSON válido, mesmo que não contenha propriedades, como mostrado aqui:

  ```
  mysql> SET @schema = '{
      '> "id": "http://json-schema.org/geo",
      '> "$schema": "http://json-schema.org/draft-04/schema#",
      '> "description": "A geographical coordinate",
      '> "type": "object",
      '> "properties": {
      '>   "latitude": {
      '>     "type": "number",
      '>     "minimum": -90,
      '>     "maximum": 90
      '>   },
      '>   "longitude": {
      '>     "type": "number",
      '>     "minimum": -180,
      '>     "maximum": 180
      '>   }
      '> }
      '>}';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT JSON_SCHEMA_VALIDATION_REPORT(@schema, @document);
  +---------------------------------------------------+
  | JSON_SCHEMA_VALIDATION_REPORT(@schema, @document) |
  +---------------------------------------------------+
  | {"valid": true}                                   |
  +---------------------------------------------------+
  1 row in set (0.00 sec)
  ```

### 14.17.8 Funções utilitárias do JSON

Esta seção documenta funções utilitárias que atuam em valores JSON, ou strings que podem ser analisadas como valores JSON. `JSON_PRETTY()` exibe um valor JSON em um formato fácil de ler. `JSON_STORAGE_SIZE()` e `JSON_STORAGE_FREE()` mostram, respectivamente, a quantidade de espaço de armazenamento usado por um dado valor JSON e a quantidade de espaço restante em uma coluna `JSON` após uma atualização parcial.

* `JSON_PRETTY(json_val)`

Fornece impressão bonita dos valores JSON semelhantes àquela implementada em PHP e por outros idiomas e sistemas de banco de dados. O valor fornecido deve ser um valor JSON ou uma representação de string válida de um valor JSON. Espaços em branco e novas linhas excedentes presentes neste valor não têm efeito na saída. Para um valor `NULL`, a função retorna `NULL`. Se o valor não for um documento JSON ou não puder ser analisado como um, a função falha com um erro.

A formatação do resultado desta função segue as seguintes regras:

+ Cada elemento de matriz ou membro de objeto aparece em uma linha separada, indentado em um nível adicional em comparação com seu pai.

+ Cada nível de indentação adiciona dois espaços antes.  
+ Uma vírgula que separa elementos de matriz individuais ou membros de objeto é impressa antes da nova linha que separa os dois elementos ou membros.

+ A chave e o valor de um membro de objeto são separados por um colon seguido de um espaço (`:`).

+ Um objeto ou array vazio é impresso em uma única linha. Não é impresso espaço entre a brace de abertura e fechamento.

+ Caracteres especiais em escalares de string e nomes de chave são escapados empregando as mesmas regras usadas pela função `JSON_QUOTE()`.

  ```
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
      '>    "value1"},"5",     "77" ,
      '>       {"key2":["value3","valueX",
      '> "valueY"]},"j", "2"   ]')\G  # nested arrays and objects
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

* `JSON_STORAGE_FREE(json_val)`

Para um valor da coluna `JSON`, esta função mostra quanto espaço de armazenamento foi liberado em sua representação binária após ser atualizado no local usando `JSON_SET()`, `JSON_REPLACE()` ou `JSON_REMOVE()`. O argumento também pode ser um documento JSON válido ou uma string que pode ser analisada como uma — seja como um valor literal ou como o valor de uma variável do usuário — nesse caso, a função retorna 0. Retorna um valor positivo e não nulo se o argumento for um valor da coluna `JSON` que foi atualizado como descrito anteriormente, de modo que sua representação binária ocupe menos espaço do que antes. Para uma coluna `JSON` que foi atualizada de forma que sua representação binária seja a mesma ou maior que antes, ou se a atualização não conseguiu aproveitar uma atualização parcial, ela retorna 0; ela retorna `NULL` se o argumento for `NULL`.

Se *`json_val`* não for `NULL`, e nem seja um documento JSON válido nem possa ser analisado com sucesso como um, resulta em um erro.

Neste exemplo, criamos uma tabela contendo uma coluna `JSON`, e depois inserimos uma linha contendo um objeto JSON:

  ```
  mysql> CREATE TABLE jtable (jcol JSON);
  Query OK, 0 rows affected (0.38 sec)

  mysql> INSERT INTO jtable VALUES
      ->     ('{"a": 10, "b": "wxyz", "c": "[true, false]"}');
  Query OK, 1 row affected (0.04 sec)

  mysql> SELECT * FROM jtable;
  +----------------------------------------------+
  | jcol                                         |
  +----------------------------------------------+
  | {"a": 10, "b": "wxyz", "c": "[true, false]"} |
  +----------------------------------------------+
  1 row in set (0.00 sec)
  ```

Agora, atualizamos o valor da coluna usando `JSON_SET()` para que uma atualização parcial possa ser realizada; neste caso, substituímos o valor apontado pela chave `c` (o array `[true, false]`) por um que ocupe menos espaço (o inteiro `1`):

  ```
  mysql> UPDATE jtable
      ->     SET jcol = JSON_SET(jcol, "$.a", 10, "$.b", "wxyz", "$.c", 1);
  Query OK, 1 row affected (0.03 sec)
  Rows matched: 1  Changed: 1  Warnings: 0

  mysql> SELECT * FROM jtable;
  +--------------------------------+
  | jcol                           |
  +--------------------------------+
  | {"a": 10, "b": "wxyz", "c": 1} |
  +--------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT JSON_STORAGE_FREE(jcol) FROM jtable;
  +-------------------------+
  | JSON_STORAGE_FREE(jcol) |
  +-------------------------+
  |                      14 |
  +-------------------------+
  1 row in set (0.00 sec)
  ```

Os efeitos das atualizações parciais sucessivas neste espaço livre são cumulativos, conforme demonstrado neste exemplo, usando `JSON_SET()` para reduzir o espaço ocupado pelo valor com chave `b` (e sem fazer outras alterações):

  ```
  mysql> UPDATE jtable
      ->     SET jcol = JSON_SET(jcol, "$.a", 10, "$.b", "wx", "$.c", 1);
  Query OK, 1 row affected (0.03 sec)
  Rows matched: 1  Changed: 1  Warnings: 0

  mysql> SELECT JSON_STORAGE_FREE(jcol) FROM jtable;
  +-------------------------+
  | JSON_STORAGE_FREE(jcol) |
  +-------------------------+
  |                      16 |
  +-------------------------+
  1 row in set (0.00 sec)
  ```

Atualizar a coluna sem usar `JSON_SET()`, `JSON_REPLACE()` ou `JSON_REMOVE()` significa que o otimizador não pode realizar a atualização no local; nesse caso, `JSON_STORAGE_FREE()` retorna 0, como mostrado aqui:

  ```
  mysql> UPDATE jtable SET jcol = '{"a": 10, "b": 1}';
  Query OK, 1 row affected (0.05 sec)
  Rows matched: 1  Changed: 1  Warnings: 0

  mysql> SELECT JSON_STORAGE_FREE(jcol) FROM jtable;
  +-------------------------+
  | JSON_STORAGE_FREE(jcol) |
  +-------------------------+
  |                       0 |
  +-------------------------+
  1 row in set (0.00 sec)
  ```

Atualizações parciais de documentos JSON podem ser realizadas apenas nos valores das colunas. Para uma variável de usuário que armazena um valor JSON, o valor é sempre completamente substituído, mesmo quando a atualização é realizada usando `JSON_SET()`:

  ```
  mysql> SET @j = '{"a": 10, "b": "wxyz", "c": "[true, false]"}';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SET @j = JSON_SET(@j, '$.a', 10, '$.b', 'wxyz', '$.c', '1');
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT @j, JSON_STORAGE_FREE(@j) AS Free;
  +----------------------------------+------+
  | @j                               | Free |
  +----------------------------------+------+
  | {"a": 10, "b": "wxyz", "c": "1"} |    0 |
  +----------------------------------+------+
  1 row in set (0.00 sec)
  ```

Para um literal JSON, essa função sempre retorna 0:

  ```
  mysql> SELECT JSON_STORAGE_FREE('{"a": 10, "b": "wxyz", "c": "1"}') AS Free;
  +------+
  | Free |
  +------+
  |    0 |
  +------+
  1 row in set (0.00 sec)
  ```

* `JSON_STORAGE_SIZE(json_val)`

Essa função retorna o número de bytes usados para armazenar a representação binária de um documento JSON. Quando o argumento é uma coluna `JSON`, este é o espaço usado para armazenar o documento JSON conforme ele foi inserido na coluna, antes de quaisquer atualizações parciais que possam ter sido realizadas posteriormente. *`json_val`* deve ser um documento JSON válido ou uma string que possa ser analisada como uma. No caso em que é uma string, a função retorna a quantidade de espaço de armazenamento na representação binária JSON que é criada pela análise da string como JSON e conversão para binário. Ela retorna `NULL` se o argumento for `NULL`.

Um erro resulta quando *`json_val`* não é `NULL`, e não é — ou não pode ser analisado com sucesso como — um documento JSON.

Para ilustrar o comportamento dessa função quando usada com uma coluna `JSON` como seu argumento, criamos uma tabela chamada `jtable` contendo uma coluna `JSON` `jcol`, inserimos um valor JSON na tabela e, em seguida, obtemos o espaço de armazenamento usado por essa coluna com `JSON_STORAGE_SIZE()`, conforme mostrado aqui:

  ```
  mysql> CREATE TABLE jtable (jcol JSON);
  Query OK, 0 rows affected (0.42 sec)

  mysql> INSERT INTO jtable VALUES
      ->     ('{"a": 1000, "b": "wxyz", "c": "[1, 3, 5, 7]"}');
  Query OK, 1 row affected (0.04 sec)

  mysql> SELECT
      ->     jcol,
      ->     JSON_STORAGE_SIZE(jcol) AS Size,
      ->     JSON_STORAGE_FREE(jcol) AS Free
      -> FROM jtable;
  +-----------------------------------------------+------+------+
  | jcol                                          | Size | Free |
  +-----------------------------------------------+------+------+
  | {"a": 1000, "b": "wxyz", "c": "[1, 3, 5, 7]"} |   47 |    0 |
  +-----------------------------------------------+------+------+
  1 row in set (0.00 sec)
  ```

De acordo com a saída de `JSON_STORAGE_SIZE()`, o documento JSON inserido na coluna ocupa 47 bytes. Também verificamos a quantidade de espaço liberada por quaisquer atualizações parciais anteriores da coluna usando `JSON_STORAGE_FREE()`; uma vez que ainda não foram realizadas atualizações, isso é 0, conforme esperado.

Em seguida, realizamos um `UPDATE` na tabela que deve resultar em uma atualização parcial do documento armazenado em `jcol`, e, em seguida, testamos o resultado conforme mostrado aqui:

  ```
  mysql> UPDATE jtable SET jcol =
      ->     JSON_SET(jcol, "$.b", "a");
  Query OK, 1 row affected (0.04 sec)
  Rows matched: 1  Changed: 1  Warnings: 0

  mysql> SELECT
      ->     jcol,
      ->     JSON_STORAGE_SIZE(jcol) AS Size,
      ->     JSON_STORAGE_FREE(jcol) AS Free
      -> FROM jtable;
  +--------------------------------------------+------+------+
  | jcol                                       | Size | Free |
  +--------------------------------------------+------+------+
  | {"a": 1000, "b": "a", "c": "[1, 3, 5, 7]"} |   47 |    3 |
  +--------------------------------------------+------+------+
  1 row in set (0.00 sec)
  ```

O valor retornado por `JSON_STORAGE_FREE()` na consulta anterior indica que uma atualização parcial do documento JSON foi realizada e que isso liberou 3 bytes de espaço usado para armazená-lo. O resultado retornado por `JSON_STORAGE_SIZE()` não foi alterado pela atualização parcial.

As atualizações parciais são suportadas para atualizações que utilizam `JSON_SET()`, `JSON_REPLACE()` ou `JSON_REMOVE()`. A atribuição direta de um valor a uma coluna `JSON` não pode ser parcialmente atualizada; após essa atualização, `JSON_STORAGE_SIZE()` sempre mostra o armazenamento usado para o valor recém-definido:

  ```
  mysql> UPDATE jtable
  mysql>     SET jcol = '{"a": 4.55, "b": "wxyz", "c": "[true, false]"}';
  Query OK, 1 row affected (0.04 sec)
  Rows matched: 1  Changed: 1  Warnings: 0

  mysql> SELECT
      ->     jcol,
      ->     JSON_STORAGE_SIZE(jcol) AS Size,
      ->     JSON_STORAGE_FREE(jcol) AS Free
      -> FROM jtable;
  +------------------------------------------------+------+------+
  | jcol                                           | Size | Free |
  +------------------------------------------------+------+------+
  | {"a": 4.55, "b": "wxyz", "c": "[true, false]"} |   56 |    0 |
  +------------------------------------------------+------+------+
  1 row in set (0.00 sec)
  ```

Uma variável de usuário JSON não pode ser parcialmente atualizada. Isso significa que esta função sempre mostra o espaço atualmente utilizado para armazenar um documento JSON em uma variável de usuário:

  ```
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

Para um literal JSON, essa função sempre retorna o espaço de armazenamento atual utilizado:

  ```
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
