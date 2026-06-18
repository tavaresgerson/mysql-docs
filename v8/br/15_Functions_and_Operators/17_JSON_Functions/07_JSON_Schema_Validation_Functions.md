### 14.17.7 Funções de Validação de Esquemas JSON

A partir do MySQL 8.0.17, o MySQL suporta a validação de documentos JSON contra esquemas JSON que estejam em conformidade com o Projeto 4 da especificação JSON Schema. Isso pode ser feito usando qualquer uma das funções detalhadas nesta seção, ambas as quais recebem dois argumentos: um esquema JSON e um documento JSON que é validado contra o esquema. `JSON_SCHEMA_VALID()` retorna verdadeiro se o documento validar contra o esquema e falso se não validar; `JSON_SCHEMA_VALIDATION_REPORT()` fornece um relatório no formato JSON sobre a validação.

Ambas as funções lidam com entradas nulos ou inválidas da seguinte forma:

- Se pelo menos um dos argumentos for `NULL`, a função retorna `NULL`.

- Se pelo menos um dos argumentos não for JSON válido, a função lança um erro (`ER_INVALID_TYPE_FOR_JSON`)

- Além disso, se o esquema não for um objeto JSON válido, a função retorna `ER_INVALID_JSON_TYPE`.

O MySQL suporta o atributo `required` nos esquemas JSON para impor a inclusão de propriedades obrigatórias (veja os exemplos nas descrições das funções).

O MySQL suporta os atributos `id`, `$schema`, `description` e `type` nos esquemas JSON, mas não exige nenhum desses.

O MySQL não suporta recursos externos em esquemas JSON; o uso da palavra-chave `$ref` faz com que `JSON_SCHEMA_VALID()` falhe com `ER_NOT_SUPPORTED_YET`.

Nota

O MySQL suporta padrões de expressão regular no esquema JSON, que suporta, mas ignora silenciosamente padrões inválidos (veja a descrição de `JSON_SCHEMA_VALID()` para um exemplo).

Essas funções são descritas em detalhes na lista a seguir:

- `JSON_SCHEMA_VALID(schema,document)`

  Valida um JSON `document` contra um JSON `schema`. Ambos `schema` e `document` são obrigatórios. O esquema deve ser um objeto JSON válido; o documento deve ser um documento JSON válido. Desde que essas condições sejam atendidas: Se o documento validar contra o esquema, a função retorna true (1); caso contrário, retorna false (0).

  Neste exemplo, definimos uma variável de usuário `@schema` com o valor de um esquema JSON para coordenadas geográficas, e outra `@document` com o valor de um documento JSON que contém uma dessas coordenadas. Em seguida, verificamos que `@document` valida de acordo com `@schema` usando-os como argumentos para `JSON_SCHEMA_VALID()`:

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

  Como o `@schema` contém o atributo `required`, podemos definir o `@document` para um valor que, de outra forma, seria válido, mas não contendo as propriedades necessárias, e então testá-lo contra o `@schema`, da seguinte maneira:

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

  Se agora definirmos o valor de `@schema` para o mesmo esquema JSON, mas sem o atributo `required`, `@document` será válido porque é um objeto JSON válido, mesmo que não contenha propriedades, como mostrado aqui:

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

  **JSON\_SCHEMA\_VALID() e restrições CHECK.** `JSON_SCHEMA_VALID()` também pode ser usado para impor restrições `CHECK`.

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

  Atribuímos valores JSON que representam as coordenadas a três variáveis, conforme mostrado aqui:

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

  O segundo valor JSON é inválido e, portanto, não cumpre a restrição, conforme mostrado aqui:

  ```
  mysql> INSERT INTO geo VALUES(@point2);
  ERROR 3819 (HY000): Check constraint 'geo_chk_1' is violated.
  ```

  No MySQL 8.0.19 e versões posteriores, você pode obter informações precisas sobre a natureza do erro — neste caso, que o valor `latitude` excede o máximo definido no esquema — emitindo uma instrução `SHOW WARNINGS`:

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

  O terceiro valor de coordenada definido acima também é inválido, pois está faltando a propriedade `latitude` necessária. Como antes, você pode ver isso ao tentar inserir o valor na tabela `geo`, e depois emitir `SHOW WARNINGS`:

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

  Consulte a Seção 15.1.20.6, “Restrições de verificação”, para obter mais informações.

  O JSON Schema tem suporte para especificar padrões de expressão regular para strings, mas a implementação usada pelo MySQL ignora silenciosamente padrões inválidos. Isso significa que `JSON_SCHEMA_VALID()` pode retornar true mesmo quando um padrão de expressão regular é inválido, como mostrado aqui:

  ```
  mysql> SELECT JSON_SCHEMA_VALID('{"type":"string","pattern":"("}', '"abc"');
  +---------------------------------------------------------------+
  | JSON_SCHEMA_VALID('{"type":"string","pattern":"("}', '"abc"') |
  +---------------------------------------------------------------+
  |                                                             1 |
  +---------------------------------------------------------------+
  1 row in set (0.04 sec)
  ```

- `JSON_SCHEMA_VALIDATION_REPORT(schema,document)`

  Valida um JSON `document` contra um JSON `schema`. Ambos `schema` e `document` são obrigatórios. Assim como em JSON\_VALID\_SCHEMA(), o esquema deve ser um objeto JSON válido, e o documento deve ser um documento JSON válido. Desde que essas condições sejam atendidas, a função retorna um relatório, como um documento JSON, sobre o resultado da validação. Se o documento JSON for considerado válido de acordo com o JSON Schema, a função retorna um objeto JSON com uma propriedade `valid` com o valor "true". Se o documento JSON falhar na validação, a função retorna um objeto JSON que inclui as propriedades listadas aqui:

  - `valid`: Sempre "false" para uma validação de esquema falha

  - `reason`: Uma string legível por humanos que contém a razão da falha

  - `schema-location`: Um identificador de fragmento de URI de ponteiro JSON que indica onde a validação falhou no esquema JSON (consulte a Nota a seguir desta lista)

  - `document-location`: Um identificador de fragmento de URI de ponteiro JSON que indica onde a validação falhou no documento JSON (consulte a Nota a seguir desta lista)

  - `schema-failed-keyword`: Uma string contendo o nome da palavra-chave ou propriedade no esquema JSON que foi violado

  Nota

  Os identificadores de fragmentos de URI de ponteiros JSON são definidos no RFC 6901 - JavaScript Object Notation (JSON) Pointer. (Esses não são *mesmos* que a notação de caminho JSON usada por `JSON_EXTRACT()` e outras funções JSON do MySQL.) Nesta notação, `#` representa todo o documento, e `#/myprop` representa a parte do documento incluída na propriedade de nível superior chamada `myprop`. Consulte a especificação citada anteriormente e os exemplos mostrados mais adiante nesta seção para obter mais informações.

  Neste exemplo, definimos uma variável de usuário `@schema` com o valor de um esquema JSON para coordenadas geográficas, e outra `@document` com o valor de um documento JSON que contém uma dessas coordenadas. Em seguida, verificamos que `@document` valida de acordo com `@schema` usando-os como argumentos para `JSON_SCHEMA_VALIDATION_REORT()`:

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

  Agora, definimos `@document` de tal forma que ele especifique um valor ilegal para uma de suas propriedades, assim:

  ```
  mysql> SET @document = '{
      '> "latitude": 63.444697,
      '> "longitude": 310.445118
      '> }';
  ```

  A validação de `@document` agora falha quando testada com `JSON_SCHEMA_VALIDATION_REPORT()`. A saída da chamada de função contém informações detalhadas sobre o erro (com a função envolvida por `JSON_PRETTY()` para fornecer um melhor formato), conforme mostrado aqui:

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

  Como o `@schema` contém o atributo `required`, podemos definir o valor de `@document` como um valor válido, mas que não contenha as propriedades necessárias, e então testá-lo contra `@schema`. A saída de `JSON_SCHEMA_VALIDATION_REPORT()` mostra que a validação falha devido à falta de um elemento necessário, da seguinte forma:

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

  Se agora definirmos o valor de `@schema` para o mesmo esquema JSON, mas sem o atributo `required`, `@document` será válido porque é um objeto JSON válido, mesmo que não contenha propriedades, como mostrado aqui:

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
