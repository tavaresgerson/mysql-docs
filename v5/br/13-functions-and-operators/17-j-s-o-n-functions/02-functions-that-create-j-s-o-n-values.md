### 12.17.2 Funções que criam valores JSON

As funções listadas nesta seção compõem valores JSON a partir de elementos de componentes.

- [`JSON_ARRAY([val[, val] ...])`](json-creation-functions.html#função_json-array)

  Avalia uma lista (possívelmente vazia) de valores e retorna um array JSON contendo esses valores.

  ```sql
  mysql> SELECT JSON_ARRAY(1, "abc", NULL, TRUE, CURTIME());
  +---------------------------------------------+
  | JSON_ARRAY(1, "abc", NULL, TRUE, CURTIME()) |
  +---------------------------------------------+
  | [1, "abc", null, true, "11:30:24.000000"]   |
  +---------------------------------------------+
  ```

- [`JSON_OBJECT([chave, valor[, chave, valor] ...])`](json-creation-functions.html#função_json_object)

  Avalia uma lista (possívelmente vazia) de pares chave-valor e retorna um objeto JSON contendo esses pares. Um erro ocorre se qualquer nome de chave for `NULL` ou se o número de argumentos for ímpar.

  ```sql
  mysql> SELECT JSON_OBJECT('id', 87, 'name', 'carrot');
  +-----------------------------------------+
  | JSON_OBJECT('id', 87, 'name', 'carrot') |
  +-----------------------------------------+
  | {"id": 87, "name": "carrot"}            |
  +-----------------------------------------+
  ```

- `JSON_QUOTE(string)`

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

Você também pode obter valores JSON ao converter valores de outros tipos para o tipo `JSON` usando `CAST(value AS JSON`); consulte Conversão entre valores JSON e não JSON para obter mais informações.

Dois funções agregadas que geram valores JSON estão disponíveis (MySQL 5.7.22 e versões posteriores). `JSON_ARRAYAGG()` retorna um conjunto de resultados como um único array JSON, e `JSON_OBJECTAGG()` retorna um conjunto de resultados como um único objeto JSON. Para mais informações, consulte a Seção 12.19, “Funções Agregadas”.
