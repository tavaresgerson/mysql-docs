### 12.17.2 Funções que Criam Valores JSON

As funções listadas nesta seção compõem valores JSON a partir de elementos componentes.

* [`JSON_ARRAY([val[, val] ...])`](json-creation-functions.html#function_json-array)

  Avalia uma lista de valores (possivelmente vazia) e retorna um JSON array contendo esses valores.

  ```sql
  mysql> SELECT JSON_ARRAY(1, "abc", NULL, TRUE, CURTIME());
  +---------------------------------------------+
  | JSON_ARRAY(1, "abc", NULL, TRUE, CURTIME()) |
  +---------------------------------------------+
  | [1, "abc", null, true, "11:30:24.000000"]   |
  +---------------------------------------------+
  ```

* [`JSON_OBJECT([key, val[, key, val] ...])`](json-creation-functions.html#function_json-object)

  Avalia uma lista de pares key-value (possivelmente vazia) e retorna um JSON object contendo esses pares. Ocorre um erro se qualquer nome de key for `NULL` ou se o número de argumentos for ímpar.

  ```sql
  mysql> SELECT JSON_OBJECT('id', 87, 'name', 'carrot');
  +-----------------------------------------+
  | JSON_OBJECT('id', 87, 'name', 'carrot') |
  +-----------------------------------------+
  | {"id": 87, "name": "carrot"}            |
  +-----------------------------------------+
  ```

* `JSON_QUOTE(string)`

  Coloca aspas em uma string como um valor JSON, envolvendo-a com caracteres de aspas duplas e escapando aspas internas e outros caracteres, e então retorna o resultado como uma string `utf8mb4`. Retorna `NULL` se o argumento for `NULL`.

  Esta função é tipicamente usada para produzir um JSON string literal válido para inclusão em um documento JSON.

  Certos caracteres especiais são escapados com barras invertidas (backslashes) conforme as sequências de escape mostradas na Tabela 12.23, “JSON_UNQUOTE() Special Character Escape Sequences” (Sequências de Escape de Caracteres Especiais).

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

Você também pode obter valores JSON realizando o *casting* (conversão de tipo) de valores de outros tipos para o tipo `JSON` usando `CAST(value AS JSON)`; consulte Converting between JSON and non-JSON values para mais informações.

Duas funções de agregação que geram valores JSON estão disponíveis (MySQL 5.7.22 e posterior). `JSON_ARRAYAGG()` retorna um result set como um único JSON array, e `JSON_OBJECTAGG()` retorna um result set como um único JSON object. Para mais informações, consulte a Seção 12.19, “Aggregate Functions”.