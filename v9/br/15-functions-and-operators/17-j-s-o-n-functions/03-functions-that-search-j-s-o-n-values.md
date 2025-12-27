### 14.17.3 Funções que buscam valores JSON

As funções desta seção realizam operações de busca ou comparação em valores JSON para extrair dados deles, informar se um dado existe em uma localização dentro deles ou informar o caminho para os dados dentro deles. O operador `MEMBER OF()` também é documentado aqui.

* `JSON_CONTAINS(alvo, candidato[, caminho])`

  Indica, retornando 1 ou 0, se um dado *`candidato`* JSON está contido em um documento JSON *`alvo`*, ou, se um argumento *`caminho`* foi fornecido, se o candidato é encontrado em um caminho específico dentro do alvo. Retorna `NULL` se qualquer argumento for `NULL` ou se o argumento *`caminho`* não identificar uma seção do documento alvo. Um erro ocorre se *`alvo`* ou *`candidato`* não for um documento JSON válido, ou se o argumento *`caminho`* não for uma expressão de caminho válida ou contiver um `*` ou `**` wildcard.

  Para verificar apenas se algum dado existe no caminho, use `JSON_CONTAINS_PATH()` em vez disso.

  As seguintes regras definem o contido:

  + Um escalar candidato está contido em um escalar alvo se e somente se eles forem comparáveis e iguais. Dois valores escalares são comparáveis se tiverem os mesmos tipos `JSON_TYPE()`, com a exceção de que valores dos tipos `INTEGER` e `DECIMAL` também são comparáveis entre si.

  + Um array candidato está contido em um array alvo se e somente se cada elemento no candidato estiver contido em algum elemento do alvo.

  + Um não-array candidato está contido em um array alvo se e somente se o candidato estiver contido em algum elemento do alvo.

Um objeto candidato está contido em um objeto alvo se e somente se, para cada chave no candidato, houver uma chave com o mesmo nome no alvo e o valor associado à chave do candidato estiver contido no valor associado à chave do alvo.

Caso contrário, o valor candidato não está contido no documento alvo.

Consultas que usam `JSON_CONTAINS()` em tabelas `InnoDB` podem ser otimizadas usando índices de múltiplos valores; consulte Índices de Múltiplos Valores, para mais informações.

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

Para verificar um valor específico em um caminho, use `JSON_CONTAINS()`.

O valor de retorno é 0 se nenhum caminho especificado existir dentro do documento. Caso contrário, o valor de retorno depende do argumento *`one_or_all`*:

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

* `JSON_EXTRACT(json_doc, path[, path] ...)`

Retorna dados de um documento JSON, selecionados das partes do documento correspondidas pelos argumentos *`path`*. Retorna `NULL` se qualquer argumento for `NULL` ou se nenhum caminho localizar um valor no documento. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou se qualquer argumento *`path`* não for uma expressão de caminho válida.

O valor de retorno consiste em todos os valores correspondentes aos argumentos `*``path``. Se for possível que esses argumentos possam retornar múltiplos valores, os valores correspondentes são encapsulados automaticamente como um array, na ordem correspondente aos caminhos que os produziram. Caso contrário, o valor de retorno é o único valor correspondente.

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

Essa funcionalidade não é limitada ao `SELECT`, como mostrado aqui:

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

(Veja Indexing a Generated Column to Provide a JSON Column Index, para as declarações usadas para criar e preencher a tabela mostrada aqui.)

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

Arrays aninhados são suportados. Uma expressão usando `->` é avaliada como `NULL` se nenhuma chave correspondente for encontrada no documento JSON alvo, como mostrado aqui:

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
  ```

Este é um operador de extração de citação aprimorado. Enquanto o operador `->` simplesmente extrai um valor, o operador `->>` extrai além disso a citação do resultado extraído. Em outras palavras, dado um valor da coluna `JSON` *`column`* e uma expressão de caminho *`path`* (uma literal de string), as seguintes três expressões retornam o mesmo valor:

  + `JSON_UNQUOTE(` `JSON_EXTRACT(column, path) )`

  + `JSON_UNQUOTE(column` `->` `path)`

  + `column->>path`

  O operador `->>` pode ser usado sempre que o `JSON_UNQUOTE(JSON_EXTRACT())` seria permitido. Isso inclui (mas não se limita a) listas de `SELECT`, cláusulas `WHERE` e `HAVING`, e cláusulas `ORDER BY` e `GROUP BY`.

  As próximas declarações demonstram algumas equivalências do operador `->>` com outras expressões no cliente **mysql**:

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

  Veja Indexando uma Coluna Gerada para Fornecer um Índice de Coluna JSON, para as declarações SQL usadas para criar e preencher a tabela `jemp` no conjunto de exemplos mostrados.

  Este operador também pode ser usado com arrays JSON, como mostrado aqui:

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

  Como com `->`, o operador `->>` é sempre expandido na saída de `EXPLAIN`, como demonstra o seguinte exemplo:

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

  Isso é semelhante à maneira como o MySQL expande o operador `->` nas mesmas circunstâncias.

* `JSON_KEYS(json_doc[, path])`

  Retorna as chaves do valor de nível superior de um objeto JSON como um array JSON, ou, se um argumento *`path`* for dado, as chaves de nível superior do caminho selecionado. Retorna `NULL` se qualquer argumento for `NULL`, o argumento *`json_doc`* não for um objeto, ou *`path`*, se dado, não localizar um objeto. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou o argumento *`path`* não for uma expressão de caminho válida ou contenha um wildcard `*` ou `**`.

O array de resultados está vazio se o objeto selecionado estiver vazio. Se o valor do nível superior tiver subobjetos aninhados, o valor de retorno não incluirá chaves desses subobjetos.

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

* `JSON_OVERLAPS(json_doc1, json_doc2)`

  Compara dois documentos JSON. Retorna `true` (1) se os dois documentos tiverem quaisquer pares de chave-valor ou elementos de array em comum. Se ambos os argumentos forem escalares, a função realiza um teste de igualdade simples. Se qualquer argumento for `NULL`, a função retorna `NULL`.

  Esta função serve como contraparte da `JSON_CONTAINS()`, que exige que todos os elementos da matriz pesquisada estejam presentes na matriz pesquisada. Assim, a `JSON_CONTAINS()` realiza uma operação `AND` sobre as chaves de busca, enquanto a `JSON_OVERLAPS()` realiza uma operação `OR`.

  Consultas em colunas JSON de tabelas `InnoDB` usando `JSON_OVERLAPS()` na cláusula `WHERE` podem ser otimizadas usando índices de múltiplos valores. Múltiplos Valores, fornece informações detalhadas e exemplos.

  Ao comparar dois arrays, `JSON_OVERLAPS()` retorna `true` se eles compartilharem um ou mais elementos de array em comum e `false` se não o fizerem:

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

  Correspondências parciais são tratadas como nenhuma correspondência, como mostrado aqui:

  ```
  mysql> SELECT JSON_OVERLAPS('[[1,2],[3,4],5]', '[1,[2,3],[4,5]]');
  +-----------------------------------------------------+
  | JSON_OVERLAPS('[[1,2],[3,4],5]', '[1,[2,3],[4,5]]') |
  +-----------------------------------------------------+
  |                                                   0 |
  +-----------------------------------------------------+
  1 row in set (0.00 sec)
  ```

  Ao comparar objetos, o resultado é `true` se eles tiverem pelo menos uma chave-valor em comum.

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

  Se dois escalares forem usados como argumentos para a função, a `JSON_OVERLAPS()` realiza um teste simples de igualdade:

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

  Ao comparar um escalar com um array, a `JSON_OVERLAPS()` tenta tratar o escalar como um elemento de array. Neste exemplo, o segundo argumento `6` é interpretado como `[6]`, como mostrado aqui:

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

[`JSON_SEARCH(json_doc, one_or_all, search_str[, escape_char[, path] ...])`](json-search-functions.html#function_json-search)

  Retorna o caminho do string fornecido dentro de um documento JSON. Retorna `NULL` se qualquer um dos argumentos *`json_doc`*, *`search_str`* ou *`path`* for `NULL`; não existir *`path`* dentro do documento; ou *`search_str`* não for encontrado. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido, qualquer argumento *`path`* não for uma expressão de caminho válida, *`one_or_all`* não for `'one'` ou `'all'`, ou *`escape_char`* não for uma expressão constante.

  O argumento *`one_or_all`* afeta a pesquisa da seguinte forma:

  + `'one'`: A pesquisa termina após o primeiro correspondência e retorna uma string de caminho. Não está definido qual correspondência é considerada primeiro.

  + `'all'`: A pesquisa retorna todas as strings de caminho correspondentes, de modo que nenhum caminho duplicado seja incluído. Se houver várias strings, elas são autoenroladas como um array. A ordem dos elementos do array não está definida.

  Dentro do argumento de string de pesquisa *`search_str`*, os caracteres `%` e `_` funcionam como para o operador `LIKE`: `%` corresponde a qualquer número de caracteres (incluindo zero caracteres), e `_` corresponde exatamente a um caractere.

  Para especificar um caractere literal `%` ou `_` na string de pesquisa, anteceda-o pelo caractere de escape. O padrão é `\` se o argumento *`escape_char`* estiver ausente ou `NULL`. Caso contrário, *`escape_char`* deve ser uma expressão constante que seja vazia ou um caractere.

Para obter mais informações sobre a correspondência e o comportamento dos caracteres de escape, consulte a descrição do `LIKE` na Seção 14.8.1, “Funções e Operadores de Comparação de Strings”. Para o tratamento de caracteres de escape, uma diferença em relação ao comportamento do `LIKE` é que o caractere de escape para o `JSON_SEARCH()` deve ser avaliado como uma constante no tempo de compilação, e não apenas no tempo de execução. Por exemplo, se o `JSON_SEARCH()` for usado em uma instrução preparada e o argumento *`escape_char`* for fornecido usando um parâmetro `?`, o valor do parâmetro pode ser constante no tempo de execução, mas não no tempo de compilação.

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

Para obter mais informações sobre a sintaxe de caminho JSON suportada pelo MySQL, incluindo as regras que regem os operadores de ponto de interrogação `*` e `**`, consulte Sintaxe de Caminho JSON.

* `JSON_VALUE(json_doc, path)`

Extrai um valor de um documento JSON no caminho especificado no documento fornecido e retorna o valor extraído, convertendo-o opcionalmente para o tipo desejado. A sintaxe completa é mostrada aqui:

```
  JSON_VALUE(json_doc, path [RETURNING type] [on_empty] [on_error])

  on_empty:
      {NULL | ERROR | DEFAULT value} ON EMPTY

  on_error:
      {NULL | ERROR | DEFAULT value} ON ERROR
  ```

* `json_doc`* é um documento JSON válido. Se este for `NULL`, a função retorna `NULL`.

* `path`* é um caminho JSON que aponta para uma localização no documento. Deve ser um valor literal de string.

* `type`* é um dos seguintes tipos de dados:

  + `FLOAT` - FLOAT, DOUBLE")
  + `DOUBLE` - FLOAT, DOUBLE")
  + `DECIMAL` - DECIMAL, NUMERIC")
  + `SIGNED`
  + `UNSIGNED`
  + `DATE`
  + `TIME`
  + `DATETIME`
  + `YEAR`

    Os valores `YEAR` de um ou dois dígitos não são suportados.

  + `CHAR`
  + `JSON`

Os tipos listados acima são os mesmos que os tipos (não de array) suportados pela função `CAST()`.

Se não for especificado por uma cláusula `RETURNING`, o tipo de retorno da função `JSON_VALUE()` é `VARCHAR(512)`. Quando não é especificado nenhum conjunto de caracteres para o tipo de retorno, o `JSON_VALUE()` usa `utf8mb4` com a collation binária, que é case-sensitive; se `utf8mb4` for especificado como o conjunto de caracteres para o resultado, o servidor usa a collation padrão para esse conjunto de caracteres, que não é case-sensitive.

Quando os dados no caminho especificado consistem em ou resolvem a um literal nulo JSON, a função retorna `SQL NULL`.

*`on_empty`*, se especificado, determina como o `JSON_VALUE()` se comporta quando nenhum dado é encontrado no caminho fornecido; essa cláusula aceita um dos seguintes valores:

  + `NULL ON EMPTY`: A função retorna `NULL`; esse é o comportamento padrão do `ON EMPTY`.

  + `DEFAULT value ON EMPTY`: o valor fornecido é retornado. O tipo do valor deve corresponder ao do tipo de retorno.

  + `ERROR ON EMPTY`: A função lança um erro.

  Se usado, *`on_error`* aceita um dos seguintes valores com o resultado correspondente quando um erro ocorre, conforme listados aqui:

  + `NULL ON ERROR`: O `JSON_VALUE()` retorna `NULL`; esse é o comportamento padrão se nenhuma cláusula `ON ERROR` for usada.

  + `DEFAULT value ON ERROR`: Esse é o valor retornado; seu valor deve corresponder ao do tipo de retorno.

  + `ERROR ON ERROR`: Um erro é lançado.

  `ON EMPTY`, se usado, deve preceder qualquer cláusula `ON ERROR`. Especificá-los na ordem errada resulta em um erro sintático.

**Tratamento de erros.** De forma geral, os erros são tratados pelo `JSON_VALUE()` da seguinte forma:

  + Todos os inputs JSON (documento e caminho) são verificados quanto à validade. Se qualquer um deles não for válido, um erro SQL é lançado sem acionar a cláusula `ON ERROR`.

  + `ON ERROR` é acionado sempre que qualquer um dos seguintes eventos ocorrer:

- Tentativa de extrair um objeto ou um array, como o resultado de um caminho que resolve em múltiplos locais dentro do documento JSON

- Erros de conversão, como tentar converter `'asdf'` para um valor `UNSIGNED`

- Truncamento de valores
+ Um erro de conversão sempre aciona uma advertência, mesmo que `NULL ON ERROR` ou `DEFAULT ... ON ERROR` seja especificado.

+ A cláusula `ON EMPTY` é acionada quando o documento JSON de origem (*`expr`*) não contém dados na localização especificada (*`path`*).

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

Exceto nos casos em que `JSON_VALUE()` retorna `NULL`, a instrução `SELECT JSON_VALUE(json_doc, path RETURNING type)` é equivalente à seguinte instrução:

```
  SELECT CAST(
      JSON_UNQUOTE( JSON_EXTRACT(json_doc, path) )
      AS type
  );
  ```

`JSON_VALUE()` simplifica a criação de índices em colunas JSON, tornando desnecessário, em muitos casos, criar uma coluna gerada e, em seguida, um índice na coluna gerada. Você pode fazer isso ao criar uma tabela `t1` que tem uma coluna `JSON` criando um índice em uma expressão que usa `JSON_VALUE()` operando naquela coluna (com um caminho que corresponde a um valor naquela coluna), como mostrado aqui:

```
  CREATE TABLE t1(
      j JSON,
      INDEX i1 ( (JSON_VALUE(j, '$.id' RETURNING UNSIGNED)) )
  );
  ```

A seguinte saída `EXPLAIN` mostra que uma consulta contra `t1` que emprega a expressão de índice na cláusula `WHERE` usa o índice assim criado:

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

Isso alcança o mesmo efeito que criar uma tabela `t2` com um índice em uma coluna gerada (veja Criando um Índice em uma Coluna Gerada para Fornecer um Índice de Coluna JSON), assim:

```
  CREATE TABLE t2 (
      j JSON,
      g INT GENERATED ALWAYS AS (j->"$.id"),
      INDEX i1 (g)
  );
  ```

A saída `EXPLAIN` para uma consulta contra esta tabela, referenciando a coluna gerada, mostra que o índice é usado da mesma maneira que para a consulta anterior contra a tabela `t1`:

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

Para obter informações sobre o uso de índices em colunas geradas para indexação indireta de colunas `JSON`, consulte Indexação de uma Coluna Gerada para Fornecer um Índice de Coluna JSON.

* `value MEMBER OF(json_array)`

  Retorna verdadeiro (1) se *`value`* for um elemento de *`json_array`*, caso contrário, retorna falso (0). *`value`* deve ser um escalar ou um documento JSON; se for um escalar, o operador tenta tratá-lo como um elemento de um array JSON. Se *`value`* ou *`json_array`* for *`NULL`*, a função retorna *`NULL`*.

  Consultas que usam `MEMBER OF()` em colunas JSON de tabelas `InnoDB` na cláusula `WHERE` podem ser otimizadas usando índices de múltiplos valores. Consulte Índices de Múltiplos Valores, para informações detalhadas e exemplos.

  Escalares simples são tratados como valores de array, como mostrado aqui:

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

  Correspondências parciais de valores de elementos de array não correspondem:

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

  Conversões para e de tipos de string não são realizadas:

  ```
  mysql> SELECT
      -> 17 MEMBER OF('[23, "abc", "17", "ab", 10]'),
      -> "17" MEMBER OF('[23, "abc", 17, "ab", 10]')\G
  *************************** 1. row ***************************
  17 MEMBER OF('[23, "abc", "17", "ab", 10]'): 0
  "17" MEMBER OF('[23, "abc", 17, "ab", 10]'): 0
  1 row in set (0.00 sec)
  ```

  Para usar este operador com um valor que é ele mesmo um array, é necessário castá-lo explicitamente como um array JSON. Você pode fazer isso com `CAST(... AS JSON)`:

  ```
  mysql> SELECT CAST('[4,5]' AS JSON) MEMBER OF('[[3,4],[4,5]]');
  +--------------------------------------------------+
  | CAST('[4,5]' AS JSON) MEMBER OF('[[3,4],[4,5]]') |
  +--------------------------------------------------+
  |                                                1 |
  +--------------------------------------------------+
  1 row in set (0.00 sec)
  ```

  Também é possível realizar a conversão necessária usando a função `JSON_ARRAY()`, assim:

  ```
  mysql> SELECT JSON_ARRAY(4,5) MEMBER OF('[[3,4],[4,5]]');
  +--------------------------------------------+
  | JSON_ARRAY(4,5) MEMBER OF('[[3,4],[4,5]]') |
  +--------------------------------------------+
  |                                          1 |
  +--------------------------------------------+
  1 row in set (0.00 sec)
  ```

  Quaisquer objetos JSON usados como valores a serem testados ou que aparecem no array de destino devem ser coercidos para o tipo correto usando `CAST(... AS JSON)` ou `JSON_OBJECT()`. Além disso, um array de destino contendo objetos JSON deve ser castado usando `JSON_ARRAY`. Isso é demonstrado na seguinte sequência de instruções:

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