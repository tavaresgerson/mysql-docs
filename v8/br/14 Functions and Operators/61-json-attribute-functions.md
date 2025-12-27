### 14.17.5 Funções que retornam atributos de valor JSON

As funções nesta seção retornam atributos de valores JSON.

*  `JSON_DEPTH(json_doc)`

  Retorna a profundidade máxima de um documento JSON. Retorna `NULL` se o argumento for `NULL`. Um erro ocorre se o argumento não for um documento JSON válido.

  Um array vazio, um objeto vazio ou um valor escalar tem profundidade 1. Um array não vazio contendo apenas elementos de profundidade 1 ou um objeto não vazio contendo apenas valores de membro de profundidade 1 tem profundidade 2. Caso contrário, um documento JSON tem profundidade maior que 2.

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
* `JSON_LENGTH(json_doc[, path])`

  Retorna o comprimento de um documento JSON, ou, se um argumento *`path`* for fornecido, o comprimento do valor dentro do documento identificado pelo caminho. Retorna `NULL` se qualquer argumento for `NULL` ou se o argumento *`path`* não identificar um valor no documento. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou se o argumento *`path`* não for uma expressão de caminho válida.

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
*  `JSON_TYPE(json_val)`

  Retorna uma string `utf8mb4` indicando o tipo de um valor JSON. Isso pode ser um objeto, um array ou um tipo escalar, conforme mostrado aqui:

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

  Para um resultado não `NULL`, não `erro`, a seguinte lista descreve os possíveis valores de retorno da `JSON_TYPE()`:

  + Tipos puramente JSON:

    - `OBJECT`: Objetos JSON
    - `ARRAY`: Arrays JSON
    - `BOOLEAN`: Os literais `true` e `false` JSON
    - `NULL`: O literal `null` JSON

- `INTEGER`: MySQL `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") escalares
- `DOUBLE`: MySQL `DOUBLE` - FLOAT, DOUBLE") escalares
- `DECIMAL`: MySQL `DECIMAL` - DECIMAL, NUMERIC") e `NUMERIC` - DECIMAL, NUMERIC") escalares
  + Tipos temporais:

    - `DATETIME`: MySQL `DATETIME` e `TIMESTAMP` escalares
    - `DATE`: MySQL `DATE` escalares
    - `TIME`: MySQL `TIME` escalares
  + Tipos de string:

    - `STRING`: escalares do tipo caractere `utf8mb3` MySQL: `CHAR`, `VARCHAR`, `TEXT`, `ENUM` e `SET`
  + Tipos binários:

    - `BLOB`: escalares do tipo binário MySQL, incluindo `BINARY`, `VARBINARY`, `BLOB` e `BIT`
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