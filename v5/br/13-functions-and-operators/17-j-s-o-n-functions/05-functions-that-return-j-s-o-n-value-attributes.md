### 12.17.5 Funções que Retornam Atributos de Valores JSON

As funções nesta seção retornam atributos de valores JSON.

* `JSON_DEPTH(json_doc)`

  Retorna a Depth máxima de um documento JSON. Retorna `NULL` se o argumento for `NULL`. Ocorre um erro se o argumento não for um documento JSON válido.

  Um Array vazio, Object vazio ou valor Scalar tem Depth 1. Um Array não vazio contendo apenas elementos de Depth 1 ou um Object não vazio contendo apenas valores de membros de Depth 1 tem Depth 2. Caso contrário, um documento JSON tem Depth maior que 2.

  ```sql
  mysql> SELECT JSON_DEPTH('{}'), JSON_DEPTH('[]'), JSON_DEPTH('true');
  +------------------+------------------+--------------------+
  | JSON_DEPTH('{}') | JSON_DEPTH('[]') | JSON_DEPTH('true') |
  +------------------+------------------+--------------------+
  |                1 |                1 |                  1 |
  +------------------+------------------+--------------------+
  mysql> SELECT JSON_DEPTH('[10, 20]'), JSON_DEPTH('], {}]');
  +------------------------+------------------------+
  | JSON_DEPTH('[10, 20]') | JSON_DEPTH('], {}]') |
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

  Retorna o Length de um documento JSON, ou, se um argumento *`path`* for fornecido, o Length do valor dentro do documento identificado pelo Path. Retorna `NULL` se qualquer argumento for `NULL` ou se o argumento *`path`* não identificar um valor no documento. Ocorre um erro se o argumento *`json_doc`* não for um documento JSON válido ou se o argumento *`path`* não for uma expressão Path válida ou contiver um curinga (`wildcard`) `*` ou `**`.

  O Length de um documento é determinado da seguinte forma:

  + O Length de um Scalar é 1.
  + O Length de um Array é o número de elementos do Array.
  + O Length de um Object é o número de membros do Object.
  + O Length não contabiliza o Length de Arrays ou Objects aninhados.

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

  Retorna uma string `utf8mb4` indicando o Type de um valor JSON. Este pode ser um Object, um Array ou um tipo Scalar, conforme mostrado aqui:

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

  Ocorre um erro se o argumento não for um valor JSON válido:

  ```sql
  mysql> SELECT JSON_TYPE(1);
  ERROR 3146 (22032): Invalid data type for JSON data in argument 1
  to function json_type; a JSON string or JSON type is required.
  ```

  Para um resultado não-`NULL` e sem erro, a lista a seguir descreve os possíveis valores de retorno de `JSON_TYPE()`:

  + Tipos puramente JSON:

    - `OBJECT`: Objects JSON
    - `ARRAY`: Arrays JSON
    - `BOOLEAN`: Os literais JSON `true` e `false`

    - `NULL`: O literal JSON `null`
  + Tipos Numéricos:

    - `INTEGER`: Scalars MySQL `TINYINT`, `SMALLINT`, `MEDIUMINT`, `INT` e `BIGINT`

    - `DOUBLE`: Scalars MySQL `DOUBLE` e `FLOAT`

    - `DECIMAL`: Scalars MySQL `DECIMAL` e `NUMERIC`

  + Tipos Temporais:

    - `DATETIME`: Scalars MySQL `DATETIME` e `TIMESTAMP`

    - `DATE`: Scalars MySQL `DATE`

    - `TIME`: Scalars MySQL `TIME`

  + Tipos String:

    - `STRING`: Scalars de tipo de caractere `utf8` do MySQL: `CHAR`, `VARCHAR`, `TEXT`, `ENUM` e `SET`

  + Tipos Binários:

    - `BLOB`: Scalars de tipo binário do MySQL: `BINARY`, `VARBINARY`, `BLOB`

    - `BIT`: Scalars MySQL `BIT`

  + Todos os outros tipos:

    - `OPAQUE` (raw bits)
* `JSON_VALID(val)`

  Retorna 0 ou 1 para indicar se um valor é um JSON válido. Retorna `NULL` se o argumento for `NULL`.

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