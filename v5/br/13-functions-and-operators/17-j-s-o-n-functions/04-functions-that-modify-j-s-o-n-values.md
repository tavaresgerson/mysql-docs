### 12.17.4 Funções que Modificam Valores JSON

As funções nesta seção modificam valores JSON e retornam o resultado.

* `JSON_APPEND(json_doc, path, val[, path, val] ...)`

  Anexa valores ao final dos `arrays` indicados em um `JSON document` e retorna o resultado. Esta função foi renomeada para `JSON_ARRAY_APPEND()` no MySQL 5.7.9; o apelido `JSON_APPEND()` está agora obsoleto no MySQL 5.7 e foi removido no MySQL 8.0.

* `JSON_ARRAY_APPEND(json_doc, path, val[, path, val] ...)`

  Anexa valores ao final dos `arrays` indicados em um `JSON document` e retorna o resultado. Retorna `NULL` se qualquer argumento for `NULL`. Um erro ocorre se o argumento *`json_doc`* não for um `JSON document` válido ou se qualquer argumento *`path`* não for uma expressão de `path` válida ou contiver um `wildcard` `*` ou `**`.

  Os pares `path`-valor são avaliados da esquerda para a direita. O `document` produzido pela avaliação de um par torna-se o novo valor contra o qual o próximo par é avaliado.

  Se um `path` selecionar um valor `scalar` ou `object`, esse valor é encapsulado automaticamente (autowrapped) em um `array` e o novo valor é adicionado a esse `array`. Pares para os quais o `path` não identifica nenhum valor no `JSON document` são ignorados.

  ```sql
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
  | "a", 2], ["b", "c"], "d"]      |
  +----------------------------------+
  mysql> SELECT JSON_ARRAY_APPEND(@j, '$[1][0]', 3);
  +-------------------------------------+
  | JSON_ARRAY_APPEND(@j, '$[1][0]', 3) |
  +-------------------------------------+
  | ["a", "b", 3], "c"], "d"]         |
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

* `JSON_ARRAY_INSERT(json_doc, path, val[, path, val] ...)`

  Atualiza um `JSON document`, inserindo em um `array` dentro do `document` e retornando o `document` modificado. Retorna `NULL` se qualquer argumento for `NULL`. Um erro ocorre se o argumento *`json_doc`* não for um `JSON document` válido, ou se qualquer argumento *`path`* não for uma expressão de `path` válida, ou contiver um `wildcard` `*` ou `**`, ou não terminar com um identificador de elemento de `array`.

  Os pares `path`-valor são avaliados da esquerda para a direita. O `document` produzido pela avaliação de um par torna-se o novo valor contra o qual o próximo par é avaliado.

  Pares para os quais o `path` não identifica nenhum `array` no `JSON document` são ignorados. Se um `path` identifica um elemento de `array`, o valor correspondente é inserido nessa posição do elemento, deslocando quaisquer valores seguintes para a direita. Se um `path` identifica uma posição de `array` após o final de um `array`, o valor é inserido no final do `array`.

  ```sql
  mysql> SET @j = '["a", {"b": [1, 2]}, [3, 4';
  mysql> SELECT JSON_ARRAY_INSERT(@j, '$[1]', 'x');
  +------------------------------------+
  | JSON_ARRAY_INSERT(@j, '$[1]', 'x') |
  +------------------------------------+
  | ["a", "x", {"b": [1, 2]}, [3, 4  |
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
  | ["a", {"b": ["x", 1, 2]}, [3, 4       |
  +-----------------------------------------+
  mysql> SELECT JSON_ARRAY_INSERT(@j, '$[2][1]', 'y');
  +---------------------------------------+
  | JSON_ARRAY_INSERT(@j, '$[2][1]', 'y') |
  +---------------------------------------+
  | ["a", {"b": [1, 2]}, [3, "y", 4     |
  +---------------------------------------+
  mysql> SELECT JSON_ARRAY_INSERT(@j, '$[0]', 'x', '$[2][1]', 'y');
  +----------------------------------------------------+
  | JSON_ARRAY_INSERT(@j, '$[0]', 'x', '$[2][1]', 'y') |
  +----------------------------------------------------+
  | ["x", "a", {"b": [1, 2]}, [3, 4                  |
  +----------------------------------------------------+
  ```

  Modificações anteriores afetam as posições dos elementos seguintes no `array`, então os `paths` subsequentes na mesma chamada `JSON_ARRAY_INSERT()` devem levar isso em consideração. No último exemplo, o segundo `path` não insere nada porque o `path` não corresponde mais a nada após a primeira inserção.

* `JSON_INSERT(json_doc, path, val[, path, val] ...)`

  Insere dados em um `JSON document` e retorna o resultado. Retorna `NULL` se qualquer argumento for `NULL`. Um erro ocorre se o argumento *`json_doc`* não for um `JSON document` válido ou se qualquer argumento *`path`* não for uma expressão de `path` válida ou contiver um `wildcard` `*` ou `**`.

  Os pares `path`-valor são avaliados da esquerda para a direita. O `document` produzido pela avaliação de um par torna-se o novo valor contra o qual o próximo par é avaliado.

  Um par `path`-valor para um `path` existente no `document` é ignorado e não sobrescreve o valor existente no `document`. Um par `path`-valor para um `path` não existente no `document` adiciona o valor ao `document` se o `path` identificar um destes tipos de valores:

  + Um membro não presente em um `object` existente. O membro é adicionado ao `object` e associado ao novo valor.

  + Uma posição após o final de um `array` existente. O `array` é estendido com o novo valor. Se o valor existente não for um `array`, ele é encapsulado automaticamente (autowrapped) como um `array`, e então estendido com o novo valor.

  Caso contrário, um par `path`-valor para um `path` não existente no `document` é ignorado e não tem efeito.

  Para uma comparação de `JSON_INSERT()`, `JSON_REPLACE()` e `JSON_SET()`, consulte a discussão sobre `JSON_SET()`.

  ```sql
  mysql> SET @j = '{ "a": 1, "b": [2, 3]}';
  mysql> SELECT JSON_INSERT(@j, '$.a', 10, '$.c', '[true, false]');
  +----------------------------------------------------+
  | JSON_INSERT(@j, '$.a', 10, '$.c', '[true, false]') |
  +----------------------------------------------------+
  | {"a": 1, "b": [2, 3], "c": "[true, false]"}        |
  +----------------------------------------------------+
  ```

  O terceiro e último valor listado no resultado é uma `string` entre aspas e não um `array` como o segundo (que não está entre aspas na saída); nenhuma conversão de valores para o tipo JSON é realizada. Para inserir o `array` como um `array`, você deve realizar tais conversões explicitamente, como mostrado aqui:

  ```sql
  mysql> SELECT JSON_INSERT(@j, '$.a', 10, '$.c', CAST('[true, false]' AS JSON));
  +------------------------------------------------------------------+
  | JSON_INSERT(@j, '$.a', 10, '$.c', CAST('[true, false]' AS JSON)) |
  +------------------------------------------------------------------+
  | {"a": 1, "b": [2, 3], "c": [true, false]}                        |
  +------------------------------------------------------------------+
  1 row in set (0.00 sec)
  ```

* `JSON_MERGE(json_doc, json_doc[, json_doc] ...)`

  Combina (Merges) dois ou mais `JSON documents`. Sinônimo de `JSON_MERGE_PRESERVE()`; obsoleto no MySQL 5.7.22 e sujeito a remoção em uma versão futura.

  ```sql
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

  Para exemplos adicionais, consulte a entrada para `JSON_MERGE_PRESERVE()`.

* `JSON_MERGE_PATCH(json_doc, json_doc[, json_doc] ...)`

  Realiza uma combinação (merge) [RFC 7396](https://tools.ietf.org/html/rfc7396) compatível de dois ou mais `JSON documents` e retorna o resultado combinado, sem preservar membros que possuam `keys` duplicadas. Gera um erro se pelo menos um dos `documents` passados como argumentos para esta função não for válido.

  **Nota**

  Para uma explicação e exemplo das diferenças entre esta função e `JSON_MERGE_PRESERVE()`, consulte JSON_MERGE_PATCH() compared with JSON_MERGE_PRESERVE() compared with JSON_MERGE_PRESERVE()").

  `JSON_MERGE_PATCH()` realiza uma combinação da seguinte forma:

  1. Se o primeiro argumento não for um `object`, o resultado da combinação é o mesmo que se um `object` vazio tivesse sido combinado com o segundo argumento.

  2. Se o segundo argumento não for um `object`, o resultado da combinação é o segundo argumento.

  3. Se ambos os argumentos forem `objects`, o resultado da combinação é um `object` com os seguintes membros:

     + Todos os membros do primeiro `object` que não possuem um membro correspondente com a mesma `key` no segundo `object`.

     + Todos os membros do segundo `object` que não possuem uma `key` correspondente no primeiro `object`, e cujo valor não é o literal JSON `null`.

     + Todos os membros com uma `key` que existe tanto no primeiro quanto no segundo `object`, e cujo valor no segundo `object` não é o literal JSON `null`. Os valores desses membros são os resultados da combinação recursiva do valor no primeiro `object` com o valor no segundo `object`.

  Para informações adicionais, consulte Normalization, Merging, and Autowrapping of JSON Values.

  ```sql
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

  Você pode usar esta função para remover um membro especificando `null` como o valor do mesmo membro no segundo argumento, conforme mostrado aqui:

  ```sql
  mysql> SELECT JSON_MERGE_PATCH('{"a":1, "b":2}', '{"b":null}');
  +--------------------------------------------------+
  | JSON_MERGE_PATCH('{"a":1, "b":2}', '{"b":null}') |
  +--------------------------------------------------+
  | {"a": 1}                                         |
  +--------------------------------------------------+
  ```

  Este exemplo mostra que a função opera de forma recursiva; ou seja, os valores dos membros não se limitam a `scalars`, mas podem ser eles próprios `JSON documents`:

  ```sql
  mysql> SELECT JSON_MERGE_PATCH('{"a":{"x":1}}', '{"a":{"y":2}}');
  +----------------------------------------------------+
  | JSON_MERGE_PATCH('{"a":{"x":1}}', '{"a":{"y":2}}') |
  +----------------------------------------------------+
  | {"a": {"x": 1, "y": 2}}                            |
  +----------------------------------------------------+
  ```

  `JSON_MERGE_PATCH()` é suportado no MySQL 5.7.22 e posterior.

  **JSON_MERGE_PATCH() comparada com JSON_MERGE_PRESERVE().** O comportamento de `JSON_MERGE_PATCH()` é o mesmo que o de `JSON_MERGE_PRESERVE()`, com as duas exceções seguintes:

  + `JSON_MERGE_PATCH()` remove qualquer membro no primeiro `object` com uma `key` correspondente no segundo `object`, desde que o valor associado à `key` no segundo `object` não seja JSON `null`.

  + Se o segundo `object` tiver um membro com uma `key` que corresponda a um membro no primeiro `object`, `JSON_MERGE_PATCH()` *substitui* o valor no primeiro `object` pelo valor no segundo `object`, enquanto `JSON_MERGE_PRESERVE()` *anexa* o segundo valor ao primeiro valor.

  Este exemplo compara os resultados da combinação dos mesmos 3 `JSON objects`, cada um com uma `key` correspondente `"a"`, usando cada uma destas duas funções:

  ```sql
  mysql> SET @x = '{ "a": 1, "b": 2 }',
       >     @y = '{ "a": 3, "c": 4 }',
       >     @z = '{ "a": 5, "d": 6 }';

  mysql> SELECT  JSON_MERGE_PATCH(@x, @y, @z)    AS Patch,
      ->         JSON_MERGE_PRESERVE(@x, @y, @z) AS Preserve\G
  *************************** 1. row ***************************
     Patch: {"a": 5, "b": 2, "c": 4, "d": 6}
  Preserve: {"a": [1, 3, 5], "b": 2, "c": 4, "d": 6}
  ```

* `JSON_MERGE_PRESERVE(json_doc, json_doc[, json_doc] ...)`

  Combina (Merges) dois ou mais `JSON documents` e retorna o resultado combinado. Retorna `NULL` se qualquer argumento for `NULL`. Um erro ocorre se qualquer argumento não for um `JSON document` válido.

  A combinação ocorre de acordo com as seguintes regras. Para informações adicionais, consulte Normalization, Merging, and Autowrapping of JSON Values.

  + `Arrays` adjacentes são combinados em um único `array`.
  + `Objects` adjacentes são combinados em um único `object`.
  + Um valor `scalar` é encapsulado automaticamente (autowrapped) como um `array` e combinado como um `array`.

  + Um `array` e um `object` adjacentes são combinados encapsulando o `object` automaticamente como um `array` e combinando os dois `arrays`.

  ```sql
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

  Esta função foi adicionada no MySQL 5.7.22 como sinônimo de `JSON_MERGE()`. A função `JSON_MERGE()` está agora obsoleta e sujeita a remoção em uma versão futura do MySQL.

  Esta função é semelhante, mas difere de `JSON_MERGE_PATCH()` em aspetos significativos; consulte JSON_MERGE_PATCH() compared with JSON_MERGE_PRESERVE() compared with JSON_MERGE_PRESERVE()") para mais informações.

* `JSON_REMOVE(json_doc, path[, path] ...)`

  Remove dados de um `JSON document` e retorna o resultado. Retorna `NULL` se qualquer argumento for `NULL`. Um erro ocorre se o argumento *`json_doc`* não for um `JSON document` válido, ou se qualquer argumento *`path`* não for uma expressão de `path` válida, ou for `$` ou contiver um `wildcard` `*` ou `**`.

  Os argumentos *`path`* são avaliados da esquerda para a direita. O `document` produzido pela avaliação de um `path` torna-se o novo valor contra o qual o próximo `path` é avaliado.

  Não é um erro se o elemento a ser removido não existir no `document`; nesse caso, o `path` não afeta o `document`.

  ```sql
  mysql> SET @j = '["a", ["b", "c"], "d"]';
  mysql> SELECT JSON_REMOVE(@j, '$[1]');
  +-------------------------+
  | JSON_REMOVE(@j, '$[1]') |
  +-------------------------+
  | ["a", "d"]              |
  +-------------------------+
  ```

* `JSON_REPLACE(json_doc, path, val[, path, val] ...)`

  Substitui valores existentes em um `JSON document` e retorna o resultado. Retorna `NULL` se *`json_doc`* ou qualquer argumento *`path`* for `NULL`. Um erro ocorre se o argumento *`json_doc`* não for um `JSON document` válido ou se qualquer argumento *`path`* não for uma expressão de `path` válida ou contiver um `wildcard` `*` ou `**`.

  Os pares `path`-valor são avaliados da esquerda para a direita. O `document` produzido pela avaliação de um par torna-se o novo valor contra o qual o próximo par é avaliado.

  Um par `path`-valor para um `path` existente no `document` sobrescreve o valor existente do `document` com o novo valor. Um par `path`-valor para um `path` não existente no `document` é ignorado e não tem efeito.

  Para uma comparação de `JSON_INSERT()`, `JSON_REPLACE()` e `JSON_SET()`, consulte a discussão sobre `JSON_SET()`.

  ```sql
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

* `JSON_SET(json_doc, path, val[, path, val] ...)`

  Insere ou atualiza dados em um `JSON document` e retorna o resultado. Retorna `NULL` se *`json_doc`* ou *`path`* for `NULL`, ou se *`path`*, quando fornecido, não localizar um `object`. Caso contrário, um erro ocorre se o argumento *`json_doc`* não for um `JSON document` válido ou se qualquer argumento *`path`* não for uma expressão de `path` válida ou contiver um `wildcard` `*` ou `**`.

  Os pares `path`-valor são avaliados da esquerda para a direita. O `document` produzido pela avaliação de um par torna-se o novo valor contra o qual o próximo par é avaliado.

  Um par `path`-valor para um `path` existente no `document` sobrescreve o valor existente do `document` com o novo valor. Um par `path`-valor para um `path` não existente no `document` adiciona o valor ao `document` se o `path` identificar um destes tipos de valores:

  + Um membro não presente em um `object` existente. O membro é adicionado ao `object` e associado ao novo valor.

  + Uma posição após o final de um `array` existente. O `array` é estendido com o novo valor. Se o valor existente não for um `array`, ele é encapsulado automaticamente (autowrapped) como um `array`, e então estendido com o novo valor.

  Caso contrário, um par `path`-valor para um `path` não existente no `document` é ignorado e não tem efeito.

  As funções `JSON_SET()`, `JSON_INSERT()` e `JSON_REPLACE()` estão relacionadas:

  + `JSON_SET()` substitui valores existentes e adiciona valores não existentes.

  + `JSON_INSERT()` insere valores sem substituir valores existentes.

  + `JSON_REPLACE()` substitui *apenas* valores existentes.

  Os exemplos a seguir ilustram essas diferenças, usando um `path` que existe no `document` (`$.a`) e outro que não existe (`$.c`):

  ```sql
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

  Remove as aspas (unquotes) do valor JSON e retorna o resultado como uma `string` `utf8mb4`. Retorna `NULL` se o argumento for `NULL`. Um erro ocorre se o valor começar e terminar com aspas duplas, mas não for um literal de `string` JSON válido.

  Dentro de uma `string`, certas sequências têm significado especial, a menos que o `SQL mode` `NO_BACKSLASH_ESCAPES` esteja habilitado. Cada uma dessas sequências começa com uma barra invertida (`\`), conhecida como *caractere de escape*. O MySQL reconhece as sequências de escape mostradas na Tabela 12.23, “Sequências de Escape de Caracteres Especiais JSON_UNQUOTE()”. Para todas as outras sequências de escape, a barra invertida é ignorada. Ou seja, o caractere escapado é interpretado como se não tivesse sido escapado. Por exemplo, `\x` é apenas `x`. Essas sequências diferenciam maiúsculas de minúsculas. Por exemplo, `\b` é interpretado como um `backspace`, mas `\B` é interpretado como `B`.

  **Tabela 12.23 Sequências de Escape de Caracteres Especiais JSON_UNQUOTE()**

  <table><thead><tr> <th>Sequência de Escape</th> <th>Caractere Representado pela Sequência</th> </tr></thead><tbody><tr> <td><code>\"</code></td> <td>Um caractere de aspas duplas (<code>"</code>)</td> </tr><tr> <td><code>\b</code></td> <td>Um caractere `backspace`</td> </tr><tr> <td><code>\f</code></td> <td>Um caractere `formfeed`</td> </tr><tr> <td><code>\n</code></td> <td>Um caractere de nova linha (`linefeed`)</td> </tr><tr> <td><code>\r</code></td> <td>Um caractere de retorno de carro (`carriage return`)</td> </tr><tr> <td><code>\t</code></td> <td>Um caractere `tab`</td> </tr><tr> <td><code>\\</code></td> <td>Um caractere de barra invertida (<code>\</code>)</td> </tr><tr> <td><code>\u<em><code>XXXX</code></em></code></td> <td>Bytes UTF-8 para o valor Unicode <em><code>XXXX</code></em></td> </tr></tbody></table>

  Dois exemplos simples do uso desta função são mostrados aqui:

  ```sql
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

  O conjunto de exemplos a seguir mostra como `JSON_UNQUOTE` lida com escapes com `NO_BACKSLASH_ESCAPES` desabilitado e habilitado:

  ```sql
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
