### 12.17.4 Funções que modificam valores JSON

As funções nesta seção modificam os valores JSON e retornam o resultado.

- `JSON_APPEND(json_doc, path, val[, path, val] ...)`

  Apresenta valores no final dos arrays indicados dentro de um documento JSON e retorna o resultado. Esta função foi renomeada para `JSON_ARRAY_APPEND()` no MySQL 5.7.9; o alias `JSON_APPEND()` está agora desatualizado no MySQL 5.7 e será removido no MySQL 8.0.

- `JSON_ARRAY_APPEND(json_doc, path, val[, path, val] ...)`

  Apresenta valores no final dos arrays indicados dentro de um documento JSON e retorna o resultado. Retorna `NULL` se qualquer argumento for `NULL`. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou se qualquer argumento *`path`* não for uma expressão de caminho válida ou contiver um caractere curinga `*` ou `**`.

  Os pares de valores de caminho são avaliados da esquerda para a direita. O documento produzido ao avaliar um par se torna o novo valor contra o qual o próximo par é avaliado.

  Se um caminho selecionar um valor escalar ou de objeto, esse valor é encapsulado automaticamente em um array e o novo valor é adicionado a esse array. Os pares para os quais o caminho não identifica nenhum valor no documento JSON são ignorados.

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
  | [["a", 2], ["b", "c"], "d"]      |
  +----------------------------------+
  mysql> SELECT JSON_ARRAY_APPEND(@j, '$[1][0]', 3);
  +-------------------------------------+
  | JSON_ARRAY_APPEND(@j, '$[1][0]', 3) |
  +-------------------------------------+
  | ["a", [["b", 3], "c"], "d"]         |
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

- `JSON_ARRAY_INSERT(json_doc, path, val[, path, val] ...)`

  Atualiza um documento JSON, inserindo em um array dentro do documento e retornando o documento modificado. Retorna `NULL` se qualquer argumento for `NULL`. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou se qualquer argumento *`path`* não for uma expressão de caminho válida ou contiver um caractere curinga `*` ou `**` ou não terminar com um identificador de elemento de array.

  Os pares de valores de caminho são avaliados da esquerda para a direita. O documento produzido ao avaliar um par se torna o novo valor contra o qual o próximo par é avaliado.

  Os pares para os quais o caminho não identifica nenhum array no documento JSON são ignorados. Se um caminho identificar um elemento de array, o valor correspondente é inserido naquela posição do elemento, deslocando quaisquer valores seguintes para a direita. Se um caminho identificar uma posição de array além do final de um array, o valor é inserido no final do array.

  ```sql
  mysql> SET @j = '["a", {"b": [1, 2]}, [3, 4]]';
  mysql> SELECT JSON_ARRAY_INSERT(@j, '$[1]', 'x');
  +------------------------------------+
  | JSON_ARRAY_INSERT(@j, '$[1]', 'x') |
  +------------------------------------+
  | ["a", "x", {"b": [1, 2]}, [3, 4]]  |
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
  | ["a", {"b": ["x", 1, 2]}, [3, 4]]       |
  +-----------------------------------------+
  mysql> SELECT JSON_ARRAY_INSERT(@j, '$[2][1]', 'y');
  +---------------------------------------+
  | JSON_ARRAY_INSERT(@j, '$[2][1]', 'y') |
  +---------------------------------------+
  | ["a", {"b": [1, 2]}, [3, "y", 4]]     |
  +---------------------------------------+
  mysql> SELECT JSON_ARRAY_INSERT(@j, '$[0]', 'x', '$[2][1]', 'y');
  +----------------------------------------------------+
  | JSON_ARRAY_INSERT(@j, '$[0]', 'x', '$[2][1]', 'y') |
  +----------------------------------------------------+
  | ["x", "a", {"b": [1, 2]}, [3, 4]]                  |
  +----------------------------------------------------+
  ```

  As modificações anteriores afetam as posições dos seguintes elementos no array, portanto, os caminhos subsequentes na mesma chamada `JSON_ARRAY_INSERT()` devem levar isso em consideração. No exemplo final, o segundo caminho não insere nada porque o caminho já não corresponde a nada após a primeira inserção.

- `JSON_INSERT(json_doc, path, val[, path, val] ...)`

  Insere dados em um documento JSON e retorna o resultado. Retorna `NULL` se qualquer argumento for `NULL`. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou se qualquer argumento *`path`* não for uma expressão de caminho válida ou contiver um caractere curinga \* ou \*\*.

  Os pares de valores de caminho são avaliados da esquerda para a direita. O documento produzido ao avaliar um par se torna o novo valor contra o qual o próximo par é avaliado.

  Um par de valor de caminho para um caminho existente no documento é ignorado e não sobrescreve o valor existente do documento. Um par de valor de caminho para um caminho não existente no documento adiciona o valor ao documento se o caminho identificar um desses tipos de valores:

  - Um membro não presente em um objeto existente. O membro é adicionado ao objeto e associado ao novo valor.

  - Uma posição além do final de um array existente. O array é estendido com o novo valor. Se o valor existente não for um array, ele é autoenrolado como um array e, em seguida, estendido com o novo valor.

  Caso contrário, um par de valor de caminho para um caminho não existente no documento é ignorado e não tem efeito.

  Para uma comparação entre `JSON_INSERT()`, `JSON_REPLACE()` e `JSON_SET()`, consulte a discussão sobre `JSON_SET()`.

  ```sql
  mysql> SET @j = '{ "a": 1, "b": [2, 3]}';
  mysql> SELECT JSON_INSERT(@j, '$.a', 10, '$.c', '[true, false]');
  +----------------------------------------------------+
  | JSON_INSERT(@j, '$.a', 10, '$.c', '[true, false]') |
  +----------------------------------------------------+
  | {"a": 1, "b": [2, 3], "c": "[true, false]"}        |
  +----------------------------------------------------+
  ```

  O terceiro e último valor listado no resultado é uma string com aspas e não um array, como o segundo (que não está entre aspas na saída); nenhum tipo de conversão de valores para o tipo JSON é realizado. Para inserir o array como um array, você deve realizar essas conversões explicitamente, como mostrado aqui:

  ```sql
  mysql> SELECT JSON_INSERT(@j, '$.a', 10, '$.c', CAST('[true, false]' AS JSON));
  +------------------------------------------------------------------+
  | JSON_INSERT(@j, '$.a', 10, '$.c', CAST('[true, false]' AS JSON)) |
  +------------------------------------------------------------------+
  | {"a": 1, "b": [2, 3], "c": [true, false]}                        |
  +------------------------------------------------------------------+
  1 row in set (0.00 sec)
  ```

- `JSON_MERGE(json_doc, json_doc[, json_doc] ...)`

  Combina dois ou mais documentos JSON. Sinônimo de `JSON_MERGE_PRESERVE()`; descontinuado no MySQL 5.7.22 e sujeito à remoção em uma futura versão.

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

- `JSON_MERGE_PATCH(json_doc, json_doc[, json_doc] ...)`

  Realiza uma fusão compatível com a [RFC 7396](https://tools.ietf.org/html/rfc7396) de dois ou mais documentos JSON e retorna o resultado fusão, sem preservar membros com chaves duplicadas. Lança um erro se pelo menos um dos documentos passados como argumentos para esta função não for válido.

  Nota

  Para uma explicação e um exemplo das diferenças entre essa função e `JSON_MERGE_PRESERVE()`, consulte JSON\_MERGE\_PATCH() em comparação com JSON\_MERGE\_PRESERVE() em comparação com JSON\_MERGE\_PRESERVE()").

  `JSON_MERGE_PATCH()` realiza uma fusão da seguinte forma:

  1. Se o primeiro argumento não for um objeto, o resultado da fusão é o mesmo que se um objeto vazio tivesse sido fundido com o segundo argumento.

  2. Se o segundo argumento não for um objeto, o resultado da fusão será o segundo argumento.

  3. Se ambos os argumentos forem objetos, o resultado da fusão será um objeto com os seguintes membros:

     - Todos os membros do primeiro objeto que não têm um membro correspondente com a mesma chave no segundo objeto.

     - Todos os membros do segundo objeto que não tenham uma chave correspondente no primeiro objeto e cujo valor não seja o literal `null` do JSON.

     - Todos os membros com uma chave que existe tanto no primeiro quanto no segundo objeto, e cujo valor no segundo objeto não é o literal `null` do JSON. Os valores desses membros são os resultados da junção recursiva do valor no primeiro objeto com o valor no segundo objeto.

  Para obter informações adicionais, consulte Normalização, Fusão e Autoembalagem de Valores JSON.

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

  Você pode usar essa função para remover um membro, especificando `null` como o valor do mesmo membro no segundo argumento, como mostrado aqui:

  ```sql
  mysql> SELECT JSON_MERGE_PATCH('{"a":1, "b":2}', '{"b":null}');
  +--------------------------------------------------+
  | JSON_MERGE_PATCH('{"a":1, "b":2}', '{"b":null}') |
  +--------------------------------------------------+
  | {"a": 1}                                         |
  +--------------------------------------------------+
  ```

  Esse exemplo mostra que a função opera de forma recursiva; ou seja, os valores dos membros não se limitam a escalares, mas podem ser documentos JSON por si mesmos:

  ```sql
  mysql> SELECT JSON_MERGE_PATCH('{"a":{"x":1}}', '{"a":{"y":2}}');
  +----------------------------------------------------+
  | JSON_MERGE_PATCH('{"a":{"x":1}}', '{"a":{"y":2}}') |
  +----------------------------------------------------+
  | {"a": {"x": 1, "y": 2}}                            |
  +----------------------------------------------------+
  ```

  `JSON_MERGE_PATCH()` é suportado no MySQL 5.7.22 e versões posteriores.

  **JSON\_MERGE\_PATCH() em comparação com JSON\_MERGE\_PRESERVE().** O comportamento do `JSON_MERGE_PATCH()` é o mesmo do `JSON_MERGE_PRESERVE()`, com as seguintes duas exceções:

  - `JSON_MERGE_PATCH()` remove qualquer membro do primeiro objeto com uma chave correspondente no segundo objeto, desde que o valor associado à chave no segundo objeto não seja `null` JSON.

  - Se o segundo objeto tiver um membro com uma chave que corresponda a um membro no primeiro objeto, o `JSON_MERGE_PATCH()` *replaça* o valor no primeiro objeto pelo valor no segundo objeto, enquanto o `JSON_MERGE_PRESERVE()` *apresenta* o segundo valor ao valor do primeiro.

  Este exemplo compara os resultados da fusão dos mesmos 3 objetos JSON, cada um com uma chave correspondente `"a"`, com cada uma dessas duas funções:

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

- `JSON_MERGE_PRESERVE(json_doc, json_doc[, json_doc] ...)`

  Combina dois ou mais documentos JSON e retorna o resultado combinado. Retorna `NULL` se algum argumento for `NULL`. Um erro ocorre se algum argumento não for um documento JSON válido.

  A fusão ocorre de acordo com as seguintes regras. Para obter informações adicionais, consulte Normalização, Fusão e Autoenrolagem de Valores JSON.

  - Os arrays adjacentes são fundidos em um único array.

  - Objetos adjacentes são fundidos em um único objeto.

  - Um valor escalar é autoenrolado como um array e fundido como um array.

  - Um array adjacente e um objeto são fundidos ao autoenvolver o objeto como um array e fundir os dois arrays.

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

  Essa função foi adicionada no MySQL 5.7.22 como sinônimo de `JSON_MERGE()`. A função `JSON_MERGE()` já está desatualizada e está sujeita à remoção em uma futura versão do MySQL.

  Essa função é semelhante, mas difere significativamente da `JSON_MERGE_PATCH()`; consulte JSON\_MERGE\_PATCH() em comparação com JSON\_MERGE\_PRESERVE() em comparação com JSON\_MERGE\_PRESERVE()"), para mais informações.

- `JSON_REMOVE(json_doc, path[, path] ...)`

  Remove os dados de um documento JSON e retorna o resultado. Retorna `NULL` se qualquer argumento for `NULL`. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou se qualquer argumento *`path`* não for uma expressão de caminho válida ou for `$` ou contiver um caractere curinga `*` ou `**`.

  Os argumentos `path` são avaliados da esquerda para a direita. O documento produzido ao avaliar um caminho se torna o novo valor contra o qual o próximo caminho é avaliado.

  Não é um erro se o elemento a ser removido não existir no documento; nesse caso, o caminho não afeta o documento.

  ```sql
  mysql> SET @j = '["a", ["b", "c"], "d"]';
  mysql> SELECT JSON_REMOVE(@j, '$[1]');
  +-------------------------+
  | JSON_REMOVE(@j, '$[1]') |
  +-------------------------+
  | ["a", "d"]              |
  +-------------------------+
  ```

- `JSON_REPLACE(json_doc, path, val[, path, val] ...)`

  Substitui os valores existentes em um documento JSON e retorna o resultado. Retorna `NULL` se *`json_doc`* ou qualquer argumento *`path`* for `NULL`. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou se qualquer argumento *`path`* não for uma expressão de caminho válida ou contiver um caractere `*` ou `**` wildcard.

  Os pares de valores de caminho são avaliados da esquerda para a direita. O documento produzido ao avaliar um par se torna o novo valor contra o qual o próximo par é avaliado.

  Uma combinação de caminho e valor para um caminho existente no documento sobrescreve o valor existente do documento com o novo valor. Uma combinação de caminho e valor para um caminho não existente no documento é ignorada e não tem efeito.

  Para uma comparação entre `JSON_INSERT()`, `JSON_REPLACE()` e `JSON_SET()`, consulte a discussão sobre `JSON_SET()`.

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

- `JSON_SET(json_doc, path, val[, path, val] ...)`

  Insere ou atualiza dados em um documento JSON e retorna o resultado. Retorna `NULL` se *`json_doc`* ou *`path`* for `NULL`, ou se *`path`*, quando fornecido, não localizar um objeto. Caso contrário, ocorrerá um erro se o argumento *`json_doc`* não for um documento JSON válido ou se qualquer argumento *`path`* não for uma expressão de caminho válida ou contiver um caractere curinga \* ou \*\*\`.

  Os pares de valores de caminho são avaliados da esquerda para a direita. O documento produzido ao avaliar um par se torna o novo valor contra o qual o próximo par é avaliado.

  Uma combinação de caminho e valor para um caminho existente no documento sobrescreve o valor existente do documento com o novo valor. Uma combinação de caminho e valor para um caminho não existente no documento adiciona o valor ao documento se o caminho identificar um desses tipos de valores:

  - Um membro não presente em um objeto existente. O membro é adicionado ao objeto e associado ao novo valor.

  - Uma posição além do final de um array existente. O array é estendido com o novo valor. Se o valor existente não for um array, ele é autoenrolado como um array e, em seguida, estendido com o novo valor.

  Caso contrário, um par de valor de caminho para um caminho não existente no documento é ignorado e não tem efeito.

  As funções `JSON_SET()`, `JSON_INSERT()` e `JSON_REPLACE()` estão relacionadas:

  - `JSON_SET()` substitui os valores existentes e adiciona valores não existentes.

  - `JSON_INSERT()` insere valores sem substituir os valores existentes.

  - `JSON_REPLACE()` substitui *apenas* valores existentes.

  Os exemplos a seguir ilustram essas diferenças, usando um caminho que existe no documento ($.a) e outro que não existe ($.c):

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

- `JSON_UNQUOTE(json_val)`

  Desunquote o valor JSON e retorne o resultado como uma string `utf8mb4`. Retorna `NULL` se o argumento for `NULL`. Um erro ocorre se o valor começar e terminar com aspas duplas, mas não for um literal válido de string JSON.

  Dentro de uma string, certas sequências têm um significado especial, a menos que o modo SQL `NO_BACKSLASH_ESCAPES` esteja habilitado. Cada uma dessas sequências começa com uma barra invertida (`\`), conhecida como *caractere de escape*. O MySQL reconhece as sequências de escape mostradas na Tabela 12.23, "Sequências de escape de caracteres especiais JSON\_UNQUOTE()". Para todas as outras sequências de escape, a barra invertida é ignorada. Ou seja, o caractere escapado é interpretado como se não tivesse sido escapado. Por exemplo, `\x` é apenas `x`. Essas sequências são sensíveis ao caso. Por exemplo, `\b` é interpretado como uma tecla de retrocesso, mas `\B` é interpretado como `B`.

  **Tabela 12.23 Sequências de escape de caracteres especiais JSON\_UNQUOTE()**

  <table><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Sequência de fuga</th> <th>Personagem representado pela sequência</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>XXXX</code>]<a class="indexterm" name="id197822"></a><a class="indexterm" name="id197824"></a></td> <td>Um caractere de citação dupla ([[PH_HTML_CODE_<code>XXXX</code>])</td> </tr><tr> <td>[[<code>\b</code>]]<a class="indexterm" name="id197831"></a><a class="indexterm" name="id197833"></a></td> <td>Um caractere de retrocesso</td> </tr><tr> <td>[[<code>\f</code>]]<a class="indexterm" name="id197839"></a><a class="indexterm" name="id197841"></a></td> <td>Um caractere de quebra de linha</td> </tr><tr> <td>[[<code>\n</code>]]<a class="indexterm" name="id197847"></a><a class="indexterm" name="id197849"></a><a class="indexterm" name="id197851"></a><a class="indexterm" name="id197853"></a></td> <td>Um caractere de nova linha (linefeed)</td> </tr><tr> <td>[[<code>\r</code>]]<a class="indexterm" name="id197859"></a><a class="indexterm" name="id197861"></a><a class="indexterm" name="id197863"></a></td> <td>Um caractere de retorno de carro</td> </tr><tr> <td>[[<code>\t</code>]]<a class="indexterm" name="id197869"></a><a class="indexterm" name="id197871"></a></td> <td>Um caractere de tabulação</td> </tr><tr> <td>[[<code>\\</code>]]<a class="indexterm" name="id197877"></a><a class="indexterm" name="id197879"></a></td> <td>Um caractere barra invertida ([[<code>\</code>]])</td> </tr><tr> <td>[[<code>\u<em class="replaceable"><code>XXXX</code>]]</em></code><a class="indexterm" name="id197887"></a><a class="indexterm" name="id197889"></a></td> <td>Bytes UTF-8 para o valor Unicode<em class="replaceable">[[<code>XXXX</code>]]</em></td> </tr></tbody></table>

  Aqui estão dois exemplos simples do uso dessa função:

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

  O conjunto de exemplos a seguir mostra como o `JSON_UNQUOTE` lida com escapamentos com `NO_BACKSLASH_ESCAPES` desativado e ativado:

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
