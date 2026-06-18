### 12.17.3 Funções que Pesquisam Valores JSON

As funções nesta seção executam operações de busca em valores JSON para extrair dados deles, reportar se dados existem em um local específico dentro deles, ou reportar o Path para os dados dentro deles.

* `JSON_CONTAINS(target, candidate[, path])`

  Indica, retornando 1 ou 0, se um determinado documento JSON *`candidate`* está contido em um documento JSON *`target`*, ou—se um argumento *`path`* foi fornecido—se o *candidate* é encontrado em um Path específico dentro do *target*. Retorna `NULL` se qualquer argumento for `NULL`, ou se o argumento *path* não identificar uma seção do documento *target*. Ocorre um erro se *`target`* ou *`candidate`* não for um documento JSON válido, ou se o argumento *`path`* não for uma expressão Path válida ou contiver um Wildcard `*` ou `**`.

  Para verificar apenas se algum dado existe no Path, use `JSON_CONTAINS_PATH()` em vez disso.

  As seguintes regras definem a contenção:

  + Um Scalar *candidate* está contido em um Scalar *target* se e somente se eles forem comparáveis e iguais. Dois valores Scalar são comparáveis se tiverem os mesmos tipos `JSON_TYPE()`, com exceção de que valores dos tipos `INTEGER` e `DECIMAL` também são comparáveis entre si.

  + Um Array *candidate* está contido em um Array *target* se e somente se cada elemento no *candidate* estiver contido em algum elemento do *target*.

  + Um não-Array *candidate* está contido em um Array *target* se e somente se o *candidate* estiver contido em algum elemento do *target*.

  + Um Object *candidate* está contido em um Object *target* se e somente se para cada Key no *candidate* houver uma Key com o mesmo nome no *target* e o valor associado à Key *candidate* estiver contido no valor associado à Key *target*.

  Caso contrário, o valor *candidate* não está contido no documento *target*.

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

* `JSON_CONTAINS_PATH(json_doc, one_or_all, path[, path] ...)`

  Retorna 0 ou 1 para indicar se um documento JSON contém dados em um ou mais Paths fornecidos. Retorna `NULL` se qualquer argumento for `NULL`. Ocorre um erro se o argumento *`json_doc`* não for um documento JSON válido, qualquer argumento *`path`* não for uma expressão Path válida, ou *`one_or_all`* não for `'one'` ou `'all'`.

  Para verificar um valor específico em um Path, use `JSON_CONTAINS()` em vez disso.

  O valor de retorno é 0 se nenhum Path especificado existir dentro do documento. Caso contrário, o valor de retorno depende do argumento *`one_or_all`*:

  + `'one'`: 1 se pelo menos um Path existir dentro do documento, 0 caso contrário.

  + `'all'`: 1 se todos os Paths existirem dentro do documento, 0 caso contrário.

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

* `JSON_EXTRACT(json_doc, path[, path] ...)`

  Retorna dados de um documento JSON, selecionados a partir das partes do documento que correspondem aos argumentos *`path`*. Retorna `NULL` se qualquer argumento for `NULL` ou se nenhum Path localizar um valor no documento. Ocorre um erro se o argumento *`json_doc`* não for um documento JSON válido ou se qualquer argumento *`path`* não for uma expressão Path válida.

  O valor de retorno consiste em todos os valores correspondidos pelos argumentos *`path`*. Se for possível que esses argumentos possam retornar múltiplos valores, os valores correspondidos são automaticamente encapsulados (autowrapped) como um Array, na ordem correspondente aos Paths que os produziram. Caso contrário, o valor de retorno é o único valor correspondido.

  ```sql
  mysql> SELECT JSON_EXTRACT('[10, 20, [30, 40', '$[1]');
  +--------------------------------------------+
  | JSON_EXTRACT('[10, 20, [30, 40', '$[1]') |
  +--------------------------------------------+
  | 20                                         |
  +--------------------------------------------+
  mysql> SELECT JSON_EXTRACT('[10, 20, [30, 40', '$[1]', '$[0]');
  +----------------------------------------------------+
  | JSON_EXTRACT('[10, 20, [30, 40', '$[1]', '$[0]') |
  +----------------------------------------------------+
  | [20, 10]                                           |
  +----------------------------------------------------+
  mysql> SELECT JSON_EXTRACT('[10, 20, [30, 40', '$[2][*]');
  +-----------------------------------------------+
  | JSON_EXTRACT('[10, 20, [30, 40', '$[2][*]') |
  +-----------------------------------------------+
  | [30, 40]                                      |
  +-----------------------------------------------+
  ```

  MySQL 5.7.9 e posterior suporta o operador `->` como uma abreviação (shorthand) para esta função quando usada com 2 argumentos, onde o lado esquerdo é um identificador de coluna `JSON` (não uma expressão) e o lado direito é o JSON Path a ser correspondido dentro da coluna.

* `column->path`

  No MySQL 5.7.9 e posterior, o operador `->` serve como um alias para a função `JSON_EXTRACT()` quando usado com dois argumentos, um identificador de coluna na esquerda e um JSON Path (um literal de string) na direita que é avaliado contra o documento JSON (o valor da coluna). Você pode usar tais expressões no lugar de referências de coluna onde quer que ocorram em instruções SQL.

  As duas instruções `SELECT` mostradas aqui produzem a mesma saída:

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

  Esta funcionalidade não está limitada a `SELECT`, como mostrado aqui:

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

  (Consulte Indexing a Generated Column to Provide a JSON Column Index, para as instruções usadas para criar e popular a tabela que acabou de ser mostrada.)

  Isso também funciona com valores de JSON Array, como mostrado aqui:

  ```sql
  mysql> CREATE TABLE tj10 (a JSON, b INT);
  Query OK, 0 rows affected (0.26 sec)

  mysql> INSERT INTO tj10
       > VALUES ("[3,10,5,17,44]", 33), ("[3,10,5,17,[22,44,66", 0);
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
  | [3, 10, 5, 17, [22, 44, 66 |    0 |
  +------------------------------+------+
  2 rows in set (0.00 sec)
  ```

  Arrays aninhados são suportados. Uma expressão usando `->` é avaliada como `NULL` se nenhuma Key correspondente for encontrada no documento JSON *target*, como mostrado aqui:

  ```sql
  mysql> SELECT * FROM tj10 WHERE a->"$[4][1]" IS NOT NULL;
  +------------------------------+------+
  | a                            | b    |
  +------------------------------+------+
  | [3, 10, 5, 17, [22, 44, 66 |    0 |
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

  Este é o mesmo comportamento observado em tais casos ao usar `JSON_EXTRACT()`:

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

  Este é um operador de extração aprimorado, que remove as aspas (unquoting), disponível no MySQL 5.7.13 e posterior. Enquanto o operador `->` simplesmente extrai um valor, o operador `->>` adicionalmente remove as aspas do resultado extraído. Em outras palavras, dado um valor de coluna `JSON` *`column`* e uma expressão Path *`path`* (um literal de string), as três expressões a seguir retornam o mesmo valor:

  + `JSON_UNQUOTE(` `JSON_EXTRACT(column, path) )`

  + `JSON_UNQUOTE(column` `->` `path)`

  + `column->>path`

  O operador `->>` pode ser usado onde quer que `JSON_UNQUOTE(JSON_EXTRACT())` seja permitido. Isso inclui (mas não se limita a) listas `SELECT`, cláusulas `WHERE` e `HAVING`, e cláusulas `ORDER BY` e `GROUP BY`.

  As próximas instruções demonstram algumas equivalências do operador `->>` com outras expressões no cliente **mysql**:

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

  (Consulte Indexing a Generated Column to Provide a JSON Column Index, para as instruções SQL usadas para criar e popular a tabela `jemp` no conjunto de exemplos que acabou de ser mostrado.)

  Este operador também pode ser usado com JSON Arrays, como mostrado aqui:

  ```sql
  mysql> CREATE TABLE tj10 (a JSON, b INT);
  Query OK, 0 rows affected (0.26 sec)

  mysql> INSERT INTO tj10 VALUES
      ->     ('[3,10,5,"x",44]', 33),
      ->     ('[3,10,5,17,[22,"y",66', 0);
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

  Assim como `->`, o operador `->>` é sempre expandido na saída de `EXPLAIN`, como demonstra o exemplo a seguir:

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

* `JSON_KEYS(json_doc[, path])`

  Retorna as Keys do valor de nível superior de um JSON Object como um JSON Array, ou, se um argumento *`path`* for fornecido, as Keys de nível superior do Path selecionado. Retorna `NULL` se qualquer argumento for `NULL`, se o argumento *`json_doc`* não for um Object, ou se *`path`*, se fornecido, não localizar um Object. Ocorre um erro se o argumento *`json_doc`* não for um documento JSON válido ou se o argumento *`path`* não for uma expressão Path válida ou contiver um Wildcard `*` ou `**`.

  O Array resultante é vazio se o Object selecionado for vazio. Se o valor de nível superior tiver sub-Objects aninhados, o valor de retorno não inclui Keys desses sub-Objects.

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

* [`JSON_SEARCH(json_doc, one_or_all, search_str[, escape_char[, path] ...])`](json-search-functions.html#function_json-search)

  Retorna o Path para a string fornecida dentro de um documento JSON. Retorna `NULL` se qualquer um dos argumentos *`json_doc`*, *`search_str`* ou *`path`* for `NULL`; se nenhum *`path`* existir dentro do documento; ou se *`search_str`* não for encontrado. Ocorre um erro se o argumento *`json_doc`* não for um documento JSON válido, qualquer argumento *`path`* não for uma expressão Path válida, *`one_or_all`* não for `'one'` ou `'all'`, ou *`escape_char`* não for uma expressão constante.

  O argumento *`one_or_all`* afeta a busca da seguinte forma:

  + `'one'`: A busca termina após a primeira correspondência e retorna uma string Path. É indefinido qual correspondência é considerada a primeira.

  + `'all'`: A busca retorna todas as strings Path correspondentes, de modo que nenhum Path duplicado seja incluído. Se houver múltiplas strings, elas são automaticamente encapsuladas (autowrapped) como um Array. A ordem dos elementos do Array é indefinida.

  Dentro do argumento de string de busca *`search_str`*, os caracteres `%` e `_` funcionam como para o operador `LIKE`: `%` corresponde a qualquer número de caracteres (incluindo zero caracteres) e `_` corresponde a exatamente um caractere.

  Para especificar um caractere literal `%` ou `_` na string de busca, preceda-o pelo caractere de escape. O padrão é `\` se o argumento *`escape_char`* estiver ausente ou for `NULL`. Caso contrário, *`escape_char`* deve ser uma constante que é vazia ou de um único caractere.

  Para mais informações sobre correspondência e comportamento de caractere de escape, consulte a descrição de `LIKE` na Seção 12.8.1, “String Comparison Functions and Operators”. Para o tratamento do caractere de escape, uma diferença em relação ao comportamento de `LIKE` é que o caractere de escape para `JSON_SEARCH()` deve ser avaliado como uma constante no tempo de compilação, e não apenas no tempo de execução. Por exemplo, se `JSON_SEARCH()` for usado em uma prepared statement e o argumento *`escape_char`* for fornecido usando um parâmetro `?`, o valor do parâmetro pode ser constante no tempo de execução, mas não é no tempo de compilação.

  *`search_str`* e *`path`* são sempre interpretados como strings utf8mb4, independentemente de sua codificação real. Este é um problema conhecido que foi corrigido no MySQL 8.0 (Bug #32449181).

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

  Para mais informações sobre a sintaxe do JSON Path suportada pelo MySQL, incluindo regras que governam os operadores Wildcard `*` e `**`, consulte JSON Path Syntax.