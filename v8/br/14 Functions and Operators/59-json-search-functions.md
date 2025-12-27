### 14.17.3 Funções que buscam valores JSON

As funções desta seção realizam operações de busca ou comparação em valores JSON para extrair dados deles, informar se um dado existe em uma localização dentro deles ou informar o caminho para os dados dentro deles. O operador `MEMBER OF()` também é documentado aqui.

* `JSON_CONTAINS(alvo, candidato[, caminho])`

  Indica, retornando 1 ou 0, se um dado *`candidato`* JSON está contido em um documento JSON *`alvo`*, ou, se um argumento `caminho` foi fornecido, se o candidato é encontrado em um caminho específico dentro do alvo. Retorna `NULL` se qualquer argumento for `NULL` ou se o argumento `caminho` não identificar uma seção do documento alvo. Um erro ocorre se *`alvo`* ou *`candidato`* não for um documento JSON válido, ou se o argumento `caminho` não for uma expressão de caminho válida ou contiver um `*` ou `**` wildcard.

  Para verificar apenas se algum dado existe no caminho, use `JSON_CONTAINS_PATH()` em vez disso.

  As seguintes regras definem o contido:

  + Um escalar candidato está contido em um escalar alvo se e somente se eles forem comparáveis e iguais. Dois valores escalares são comparáveis se tiverem os mesmos tipos `JSON_TYPE()`, com a exceção de que valores dos tipos `INTEGER` e `DECIMAL` também são comparáveis entre si.
  + Um array candidato está contido em um array alvo se e somente se cada elemento no candidato estiver contido em algum elemento do alvo.
  + Um não-array candidato está contido em um array alvo se e somente se o candidato estiver contido em algum elemento do alvo.
  + Um objeto candidato está contido em um objeto alvo se e somente se, para cada chave no candidato, houver uma chave com o mesmo nome no alvo e o valor associado à chave do candidato estiver contido no valor associado à chave do alvo.

  Caso contrário, o valor do candidato não está contido no documento alvo.

Consultas que utilizam `JSON_CONTAINS()` em tabelas `InnoDB` podem ser otimizadas usando índices de múltiplos valores; consulte Índices de Múltiplos Valores, para mais informações.

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
* `JSON_CONTAINS_PATH(json_doc, one_or_all, path[, path] ...)`

Retorna 0 ou 1 para indicar se um documento JSON contém dados em um caminho ou caminhos específicos. Retorna `NULL` se qualquer argumento for `NULL`. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido, qualquer argumento *`path`* não for uma expressão de caminho válida ou *`one_or_all`* não for `'one'` ou `'all'`.

Para verificar um valor específico em um caminho, use `JSON_CONTAINS()` em vez disso.

O valor de retorno é 0 se nenhum caminho especificado existir dentro do documento. Caso contrário, o valor de retorno depende do argumento *`one_or_all`*:

+ `'one'`: 1 se pelo menos um caminho existir dentro do documento, 0 caso contrário.
+ `'all'`: 1 se todos os caminhos existir dentro do documento, 0 caso contrário.

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
* `JSON_EXTRACT(json_doc, path[, path] ...)`

Retorna dados de um documento JSON, selecionados das partes do documento correspondidas pelos argumentos *`path`*. Retorna `NULL` se qualquer argumento for `NULL` ou se nenhum caminho localizar um valor no documento. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou se qualquer argumento *`path`* não for uma expressão de caminho válida.

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

O MySQL suporta o operador `->` como abreviação para esta função, usado com 2 argumentos onde o lado esquerdo é um identificador de coluna `JSON` (não uma expressão) e o lado direito é o caminho JSON a ser correspondido dentro da coluna.
* `column->path`

O operador `->` serve como um alias para a função `JSON_EXTRACT()` quando usado com dois argumentos, um identificador de coluna à esquerda e uma rota JSON (um literal de string) à direita que é avaliada contra o documento JSON (o valor da coluna). Você pode usar tais expressões no lugar de referências de coluna sempre que elas ocorrem em declarações SQL.

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

Essa funcionalidade não está limitada ao `SELECT`, como mostrado aqui:

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

(Veja  Indicando uma Coluna Gerada para Fornecer um Índice de Coluna JSON, para as declarações usadas para criar e popolar a tabela mostrada anteriormente.)

Isso também funciona com valores de arrays JSON, como mostrado aqui:

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

Arrays aninhados são suportados. Uma expressão usando `->` avalia como `NULL` se nenhuma chave correspondente for encontrada no documento JSON alvo, como mostrado aqui:

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

Esse é o mesmo comportamento visto em casos como esses ao usar `JSON_EXTRACT()`:

```
  mysql> SELECT JSON_EXTRACT(a, "$[4][1]") FROM tj10;
  +----------------------------+
  | JSON_EXTRACT(a, "$[4][1]") |
  +----------------------------+
  | NULL                       |
  | 44                         |
  +----------------------------+
  2 rows in set (0.00 sec)
  ```vk95P9VZUu```
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
  ```ojWsrM9VTX```
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
  ```BqQvBFucv0```
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
  ```8ZkAkbTQ12```
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
  ```igwZzhE870```
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
  ```uPoA7GkxS5```
  mysql> SELECT JSON_OVERLAPS('[[1,2],[3,4],5]', '[1,[2,3],[4,5]]');
  +-----------------------------------------------------+
  | JSON_OVERLAPS('[[1,2],[3,4],5]', '[1,[2,3],[4,5]]') |
  +-----------------------------------------------------+
  |                                                   0 |
  +-----------------------------------------------------+
  1 row in set (0.00 sec)
  ```QbZw6T1hYs```
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
  ```dNc2qzhHhI```
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
  ```keFIuIXp5J```
  mysql> SELECT JSON_OVERLAPS('[4,5,6,7]', '6');
  +---------------------------------+
  | JSON_OVERLAPS('[4,5,6,7]', '6') |
  +---------------------------------+
  |                               1 |
  +---------------------------------+
  1 row in set (0.00 sec)
  ```ybZirs3EOH```
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
  ```EtGTt7r1jq```
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
  ```I0bwCP4diH```
  JSON_VALUE(json_doc, path [RETURNING type] [on_empty] [on_error])

  on_empty:
      {NULL | ERROR | DEFAULT value} ON EMPTY

  on_error:
      {NULL | ERROR | DEFAULT value} ON ERROR
  ```uQDMx7HxVO```
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
  ```2H8nEf8BHl```
  SELECT CAST(
      JSON_UNQUOTE( JSON_EXTRACT(json_doc, path) )
      AS type
  );
  ```NwPl5heND6```
  CREATE TABLE t1(
      j JSON,
      INDEX i1 ( (JSON_VALUE(j, '$.id' RETURNING UNSIGNED)) )
  );
  ```1I9PQxuXSN```
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
  ```jLYvP8sUDB```
  CREATE TABLE t2 (
      j JSON,
      g INT GENERATED ALWAYS AS (j->"$.id"),
      INDEX i1 (g)
  );
  ```UjS1K90hM2```
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
  ```xKbcehS5lW```
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
  ```FQAdirB5u7```
  mysql> SELECT 7 MEMBER OF('[23, "abc", 17, "ab", 10]');
  +------------------------------------------+
  | 7 MEMBER OF('[23, "abc", 17, "ab", 10]') |
  +------------------------------------------+
  |                                        0 |
  +------------------------------------------+
  1 row in set (0.00 sec)
  ```nMvwsNv0HH```
  mysql> SELECT 'a' MEMBER OF('[23, "abc", 17, "ab", 10]');
  +--------------------------------------------+
  | 'a' MEMBER OF('[23, "abc", 17, "ab", 10]') |
  +--------------------------------------------+
  |                                          0 |
  +--------------------------------------------+
  1 row in set (0.00 sec)
  ```ZBlS4drD7k```
  mysql> SELECT
      -> 17 MEMBER OF('[23, "abc", "17", "ab", 10]'),
      -> "17" MEMBER OF('[23, "abc", 17, "ab", 10]')\G
  *************************** 1. row ***************************
  17 MEMBER OF('[23, "abc", "17", "ab", 10]'): 0
  "17" MEMBER OF('[23, "abc", 17, "ab", 10]'): 0
  1 row in set (0.00 sec)
  ```Kf8hRTO435```
  mysql> SELECT CAST('[4,5]' AS JSON) MEMBER OF('[[3,4],[4,5]]');
  +--------------------------------------------------+
  | CAST('[4,5]' AS JSON) MEMBER OF('[[3,4],[4,5]]') |
  +--------------------------------------------------+
  |                                                1 |
  +--------------------------------------------------+
  1 row in set (0.00 sec)
  ```hx9TrEnSYR```