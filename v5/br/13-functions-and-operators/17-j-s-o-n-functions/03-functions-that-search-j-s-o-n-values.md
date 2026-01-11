### 12.17.3 Funções que buscam valores JSON

As funções desta seção realizam operações de busca em valores JSON para extrair dados deles, informar se os dados existem em uma localização dentro deles ou informar o caminho para os dados dentro deles.

- `JSON_CONTAINS(alvo, candidato[, caminho])`

  Indica, retornando 1 ou 0, se um dado documento JSON de *`candidate`* está contido em um documento JSON de *`target`*, ou, se um argumento *`path`* foi fornecido, se o candidato é encontrado em um caminho específico dentro do alvo. Retorna `NULL` se qualquer argumento for `NULL` ou se o argumento *`path`* não identificar uma seção do documento alvo. Um erro ocorre se *`target`* ou *`candidate`* não for um documento JSON válido ou se o argumento *`path`* não for uma expressão de caminho válida ou contiver um caractere curinga \* ou \*\*\`.

  Para verificar apenas se algum dado existe no caminho, use `JSON_CONTAINS_PATH()` em vez disso.

  As regras a seguir definem o confinamento:

  - Um escalar candidato está contido em um escalar alvo se e somente se eles forem comparáveis e iguais. Dois valores escalares são comparáveis se tiverem os mesmos tipos `JSON_TYPE()`, com a exceção de que valores dos tipos `INTEGER` e `DECIMAL` também são comparáveis entre si.

  - Um conjunto candidato está contido em um conjunto alvo se e somente se cada elemento do candidato estiver contido em algum elemento do alvo.

  - Um candidato não-vetor está contido em um vetor-alvo se e somente se o candidato estiver contido em algum elemento do alvo.

  - Um objeto candidato está contido em um objeto alvo se e somente se, para cada chave no candidato, houver uma chave com o mesmo nome no alvo e o valor associado à chave do candidato estiver contido no valor associado à chave do alvo.

  Caso contrário, o valor do candidato não está contido no documento de destino.

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

- `JSON_CONTAINS_PATH(json_doc, one_or_all, caminho[, caminho] ...)`

  Retorna 0 ou 1 para indicar se um documento JSON contém dados em um caminho ou caminhos específicos. Retorna `NULL` se qualquer argumento for `NULL`. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido, qualquer argumento *`path`* não for uma expressão de caminho válida ou *`one_or_all`* não for `'one'` ou `'all'`.

  Para verificar um valor específico em um caminho, use `JSON_CONTAINS()`.

  O valor de retorno é 0 se nenhum caminho especificado existir dentro do documento. Caso contrário, o valor de retorno depende do argumento *`one_or_all`*:

  - `'one'`: 1 se pelo menos um caminho existir dentro do documento, 0 caso contrário.

  - `'all'`: 1 se todos os caminhos existirem dentro do documento, 0 caso contrário.

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

- `JSON_EXTRACT(json_doc, caminho[, caminho] ...)`

  Retorna dados de um documento JSON, selecionados das partes do documento correspondidas pelos argumentos *`path`*. Retorna `NULL` se algum argumento for `NULL` ou se nenhum caminho localizar um valor no documento. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou se qualquer argumento *`path`* não for uma expressão de caminho válida.

  O valor de retorno consiste em todos os valores correspondentes aos argumentos `path`. Se for possível que esses argumentos possam retornar múltiplos valores, os valores correspondentes são autoencapsulados como um array, na ordem correspondente aos caminhos que os produziram. Caso contrário, o valor de retorno é o único valor correspondente.

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

  O MySQL 5.7.9 e versões posteriores suportam o operador `->` como uma abreviação para essa função, usado com 2 argumentos, onde o lado esquerdo é um identificador de coluna `JSON` (não uma expressão) e o lado direito é o caminho JSON a ser correspondido dentro da coluna.

- `coluna->caminho`

  No MySQL 5.7.9 e versões posteriores, o operador `->` serve como um alias para a função `JSON_EXTRACT()`, quando usado com dois argumentos: um identificador de coluna à esquerda e um caminho JSON (um literal de string) à direita, que é avaliado contra o documento JSON (o valor da coluna). Você pode usar tais expressões no lugar de referências de coluna sempre que elas ocorrem em instruções SQL.

  As duas instruções `SELECT` mostradas aqui produzem o mesmo resultado:

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

  (Consulte "Indexação de uma coluna gerada para fornecer um índice de coluna JSON", para as instruções usadas para criar e preencher a tabela mostrada anteriormente.)

  Isso também funciona com valores de matriz JSON, como mostrado aqui:

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

  Matrizes aninhadas são suportadas. Uma expressão que usa `->` avalia como `NULL` se nenhuma chave correspondente for encontrada no documento JSON de destino, como mostrado aqui:

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

  Esse é o mesmo comportamento observado em casos como esse quando se usa `JSON_EXTRACT()`:

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

- `coluna->>caminho`

  Este é um operador de extração sem aspas aprimorado, disponível no MySQL 5.7.13 e versões posteriores. Enquanto o operador `->` simplesmente extrai um valor, o operador `->>` também desasigna as aspas do resultado extraído. Em outras palavras, dado um valor da coluna `JSON` *`column`* e uma expressão de caminho *`path`* (um literal de string), as seguintes três expressões retornam o mesmo valor:

  - `JSON_UNQUOTE(` `JSON_EXTRACT(coluna, caminho) )`

  - `JSON_UNQUOTE(coluna` `->` `caminho)`

  - `coluna->>caminho`

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

  Consulte "Indexação de uma coluna gerada para fornecer um índice de coluna JSON", para obter as instruções SQL usadas para criar e preencher a tabela `jemp` no conjunto de exemplos mostrados anteriormente.

  Esse operador também pode ser usado com arrays JSON, como mostrado aqui:

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

  Assim como o operador `->`, o operador `->>` é sempre expandido na saída do `EXPLAIN`, como demonstra o seguinte exemplo:

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

- `JSON_KEYS(json_doc[, path])`

  Retorna as chaves do valor de nível superior de um objeto JSON como um array JSON, ou, se um argumento *`path`* for fornecido, as chaves de nível superior do caminho selecionado. Retorna `NULL` se qualquer argumento for `NULL`, o argumento *`json_doc`* não for um objeto ou *`path`*, se fornecido, não localizar um objeto. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou o argumento *`path`* não for uma expressão de caminho válida ou contiver um caractere curinga \* ou \*\*\*.

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

- [`JSON_SEARCH(json_doc, one_or_all, search_str[, escape_char[, path] ...])`](json-search-functions.html#function_json-search)

  Retorna o caminho para a string fornecida dentro de um documento JSON. Retorna `NULL` se qualquer um dos argumentos *`json_doc`*, *`search_str`* ou *`path`* for `NULL`; não existir *`path`* dentro do documento; ou *`search_str`* não for encontrado. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido, qualquer argumento *`path`* não for uma expressão de caminho válida, *`one_or_all`* não for `'one'` ou `'all'`, ou *`escape_char`* não for uma expressão constante.

  O argumento *`one_or_all`* afeta a pesquisa da seguinte forma:

  - `'one'`: A pesquisa termina após a primeira correspondência e retorna uma string de caminho. Não está definido qual correspondência é considerada a primeira.

  - `'all'`: A pesquisa retorna todas as cadeias de caminho correspondentes, de modo que nenhum caminho duplicado seja incluído. Se houver várias cadeias, elas são autoenroladas como um array. A ordem dos elementos do array é indefinida.

  Dentro do argumento de cadeia de caracteres de pesquisa *`search_str`*, os caracteres `%` e `_` funcionam como no operador `LIKE`: `%` corresponde a qualquer número de caracteres (incluindo zero caracteres), e `_` corresponde exatamente a um caractere.

  Para especificar um caractere literal `%` ou `_` na string de pesquisa, anteceda-o pelo caractere de escape. O padrão é `\` se o argumento *`escape_char`* estiver ausente ou `NULL`. Caso contrário, *`escape_char`* deve ser uma constante que seja vazia ou um caractere.

  Para obter mais informações sobre a correspondência e o comportamento dos caracteres de escape, consulte a descrição do `LIKE` na Seção 12.8.1, “Funções e Operadores de Comparação de Strings”. Para o tratamento de caracteres de escape, uma diferença em relação ao comportamento do `LIKE` é que o caractere de escape para o `JSON_SEARCH()` deve ser avaliado como uma constante no momento da compilação, e não apenas no momento da execução. Por exemplo, se o `JSON_SEARCH()` for usado em uma instrução preparada e o argumento `escape_char` for fornecido usando um parâmetro `?`, o valor do parâmetro pode ser constante no momento da execução, mas não no momento da compilação.

  *`search_str`* e *`path`* são sempre interpretados como strings utf8mb4, independentemente de sua codificação real. Esse é um problema conhecido que foi corrigido no MySQL 8.0 (Bug #32449181).

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

  Para obter mais informações sobre a sintaxe de caminho JSON suportada pelo MySQL, incluindo as regras que regem os operadores de ponto de interrogação `*` e `**`, consulte Sintaxe de caminho JSON.
