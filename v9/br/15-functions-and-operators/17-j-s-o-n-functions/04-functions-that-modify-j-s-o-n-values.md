### 14.17.4 Funções que modificam valores JSON

As funções desta seção modificam valores JSON e retornam o resultado.

* `JSON_ARRAY_APPEND(json_doc, path, val[, path, val] ...)`

  Apresenta valores no final dos arrays indicados dentro de um documento JSON e retorna o resultado. Retorna `NULL` se qualquer argumento for `NULL`. Ocorre um erro se o argumento *`json_doc`* não for um documento JSON válido ou se qualquer argumento *`path`* não for uma expressão de caminho válida ou contiver um caractere `*` ou `**`.

  As pares de caminho-valor são avaliados da esquerda para a direita. O documento produzido pela avaliação de um par torna-se o novo valor contra o qual o próximo par é avaliado.

  Se um caminho selecionar um valor escalar ou objeto, esse valor é encapsulado dentro de um array e o novo valor é adicionado a esse array. Os pares para os quais o caminho não identifica nenhum valor no documento JSON são ignorados.

  ```
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

* `JSON_ARRAY_INSERT(json_doc, path, val[, path, val] ...)`

  Atualiza um documento JSON, inserindo em um array dentro do documento e retorna o documento modificado. Retorna `NULL` se qualquer argumento for `NULL`. Ocorre um erro se o argumento *`json_doc`* não for um documento JSON válido ou se qualquer argumento *`path`* não for uma expressão de caminho válida ou contiver um caractere `*` ou `**` ou não terminar com um identificador de elemento de array.

  Os pares de caminho-valor são avaliados da esquerda para a direita. O documento produzido pela avaliação de um par torna-se o novo valor contra o qual o próximo par é avaliado.

Os pares para os quais o caminho não identifica nenhum array no documento JSON são ignorados. Se um caminho identifica um elemento de array, o valor correspondente é inserido naquela posição do elemento, deslocando quaisquer valores subsequentes para a direita. Se um caminho identifica uma posição de array além do final de um array, o valor é inserido no final do array.

```
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

As modificações anteriores afetam as posições dos elementos subsequentes no array, então os caminhos subsequentes na mesma chamada `JSON_ARRAY_INSERT()` devem levar isso em consideração. No exemplo final, o segundo caminho não insere nada porque o caminho não corresponde a nada após a primeira inserção.

* `JSON_INSERT(json_doc, path, val[, path, val] ...)`

  Insere dados em um documento JSON e retorna o resultado. Retorna `NULL` se algum argumento for `NULL`. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou se algum argumento *`path`* não for uma expressão de caminho válida ou contiver um caractere `*` ou `**` wildcard.

  As pares caminho-valor são avaliados da esquerda para a direita. O documento produzido pela avaliação de um par se torna o novo valor contra o qual o próximo par é avaliado.

  Um par caminho-valor para um caminho existente no documento é ignorado e não sobrescreve o valor do documento existente. Um par caminho-valor para um caminho não existente no documento adiciona o valor ao documento se o caminho identificar um desses tipos de valores:

  + Um membro não presente em um objeto existente. O membro é adicionado ao objeto e associado ao novo valor.

  + Uma posição além do final de um array existente. O array é estendido com o novo valor. Se o valor existente não for um array, ele é autoenrolado como um array, então estendido com o novo valor.

Caso contrário, um par de valor de caminho para um caminho não existente no documento é ignorado e não tem efeito.

Para uma comparação entre `JSON_INSERT()`, `JSON_REPLACE()` e `JSON_SET()`, consulte a discussão sobre `JSON_SET()`.

```
  mysql> SET @j = '{ "a": 1, "b": [2, 3]}';
  mysql> SELECT JSON_INSERT(@j, '$.a', 10, '$.c', '[true, false]');
  +----------------------------------------------------+
  | JSON_INSERT(@j, '$.a', 10, '$.c', '[true, false]') |
  +----------------------------------------------------+
  | {"a": 1, "b": [2, 3], "c": "[true, false]"}        |
  +----------------------------------------------------+
  ```

O terceiro e último valor listado no resultado é uma string com aspas e não um array, como o segundo (que não está entre aspas na saída); nenhum tipo de conversão de valores para o tipo JSON é realizada. Para inserir o array como um array, você deve realizar essas conversões explicitamente, como mostrado aqui:

```
  mysql> SELECT JSON_INSERT(@j, '$.a', 10, '$.c', CAST('[true, false]' AS JSON));
  +------------------------------------------------------------------+
  | JSON_INSERT(@j, '$.a', 10, '$.c', CAST('[true, false]' AS JSON)) |
  +------------------------------------------------------------------+
  | {"a": 1, "b": [2, 3], "c": [true, false]}                        |
  +------------------------------------------------------------------+
  1 row in set (0.00 sec)
  ```

* `JSON_MERGE(json_doc, json_doc[, json_doc] ...)`

Símbolo desatualizado para `JSON_MERGE_PRESERVE()`.

* `JSON_MERGE_PATCH(json_doc, json_doc[, json_doc] ...)`

Realiza uma fusão [RFC 7396](https://tools.ietf.org/html/rfc7396) de dois ou mais documentos JSON e retorna o resultado fusão, sem preservar membros com chaves duplicadas. Arrisca um erro se pelo menos um dos documentos passados como argumentos para esta função não for válido.

Nota

Para uma explicação e exemplo das diferenças entre esta função e `JSON_MERGE_PRESERVE()`, consulte `JSON_MERGE_PATCH()` comparado com `JSON_MERGE_PRESERVE()` comparado com `JSON_MERGE_PRESERVE()"`).

`JSON_MERGE_PATCH()` realiza uma fusão da seguinte forma:

1. Se o primeiro argumento não for um objeto, o resultado da fusão é o mesmo se um objeto vazio tivesse sido fundido com o segundo argumento.

2. Se o segundo argumento não for um objeto, o resultado da fusão é o segundo argumento.

3. Se ambos os argumentos forem objetos, o resultado da fusão é um objeto com os seguintes membros:

     + Todos os membros do primeiro objeto que não têm um membro correspondente com a mesma chave no segundo objeto.

+ Todos os membros do segundo objeto que não têm uma chave correspondente no primeiro objeto e cujo valor não é o literal `null` do JSON.

+ Todos os membros com uma chave que existe tanto no primeiro quanto no segundo objeto, e cujo valor no segundo objeto não é o literal `null` do JSON. Os valores desses membros são os resultados da fusão recursiva do valor no primeiro objeto com o valor no segundo objeto.

Para informações adicionais, consulte Normalização, Fusão e Autoenrolagem de Valores JSON.

```
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

Você pode usar essa função para remover um membro especificando `null` como o valor do mesmo membro no segundo argumento, como mostrado aqui:

```
  mysql> SELECT JSON_MERGE_PATCH('{"a":1, "b":2}', '{"b":null}');
  +--------------------------------------------------+
  | JSON_MERGE_PATCH('{"a":1, "b":2}', '{"b":null}') |
  +--------------------------------------------------+
  | {"a": 1}                                         |
  +--------------------------------------------------+
  ```

Este exemplo mostra que a função opera de forma recursiva; ou seja, os valores dos membros não são limitados a escalares, mas podem ser documentos JSON:

```
  mysql> SELECT JSON_MERGE_PATCH('{"a":{"x":1}}', '{"a":{"y":2}}');
  +----------------------------------------------------+
  | JSON_MERGE_PATCH('{"a":{"x":1}}', '{"a":{"y":2}}') |
  +----------------------------------------------------+
  | {"a": {"x": 1, "y": 2}}                            |
  +----------------------------------------------------+
  ```

**JSON_MERGE_PATCH() em comparação com JSON_MERGE_PRESERVE().** O comportamento de `JSON_MERGE_PATCH()` é o mesmo de `JSON_MERGE_PRESERVE()`, com as seguintes duas exceções:

+ `JSON_MERGE_PATCH()` remove qualquer membro no primeiro objeto com uma chave correspondente no segundo objeto, desde que o valor associado à chave no segundo objeto não seja `null` do JSON.

+ Se o segundo objeto tiver um membro com uma chave que corresponde a um membro no primeiro objeto, `JSON_MERGE_PATCH()` *replaca* o valor no primeiro objeto com o valor no segundo objeto, enquanto `JSON_MERGE_PRESERVE()` *apende* o segundo valor ao primeiro valor.

Este exemplo compara os resultados da fusão dos mesmos 3 objetos JSON, cada um com uma chave correspondente `"a"`, com cada uma dessas duas funções:

```
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

Combina dois ou mais documentos JSON e retorna o resultado combinado. Retorna `NULL` se algum argumento for `NULL`. Um erro ocorre se algum argumento não for um documento JSON válido.

A combinação ocorre de acordo com as seguintes regras. Para obter informações adicionais, consulte Normalização, Combinação e Autoenrolagem de Valores JSON.

+ Matrizes adjacentes são combinadas em uma única matriz.
+ Objetos adjacentes são combinados em um único objeto.
+ Um valor escalar é enrolado automaticamente como uma matriz e combinado como uma matriz.

+ Uma matriz e um objeto adjacentes são combinados enrolando automaticamente o objeto como uma matriz e combinando as duas matrizes.

```
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

Esta função é semelhante, mas difere significativamente de `JSON_MERGE_PATCH()`; consulte JSON_MERGE_PATCH() em comparação com JSON_MERGE_PRESERVE() em comparação com JSON_MERGE_PRESERVE()"), para mais informações.

* `JSON_REMOVE(json_doc, path[, path] ...)`

  Remove dados de um documento JSON e retorna o resultado. Retorna `NULL` se algum argumento for `NULL`. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou se qualquer argumento *`path`* não for uma expressão de caminho válida ou for `$` ou contiver um `*` ou `**` wildcard.

  Os argumentos *`path`* são avaliados da esquerda para a direita. O documento produzido ao avaliar um caminho se torna o novo valor contra o qual o próximo caminho é avaliado.

  Não é um erro se o elemento a ser removido não existir no documento; nesse caso, o caminho não afeta o documento.

```
  mysql> SET @j = '["a", ["b", "c"], "d"]';
  mysql> SELECT JSON_REMOVE(@j, '$[1]');
  +-------------------------+
  | JSON_REMOVE(@j, '$[1]') |
  +-------------------------+
  | ["a", "d"]              |
  +-------------------------+
  ```

* `JSON_REPLACE(json_doc, path, val[, path, val] ...)`

Substitui os valores existentes em um documento JSON e retorna o resultado. Retorna `NULL` se *`json_doc`* ou qualquer argumento *`path`* for `NULL`. Um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou se qualquer argumento *`path`* não for uma expressão de caminho válida ou contiver um caractere `*` ou `**`.

As pares de caminho-valor são avaliados da esquerda para a direita. O documento produzido pela avaliação de um par torna-se o novo valor contra o qual o próximo par é avaliado.

Um par de caminho-valor para um caminho existente no documento sobrescreve o valor do documento existente com o novo valor. Um par de caminho-valor para um caminho não existente no documento é ignorado e não tem efeito.

O otimizador pode realizar uma atualização parcial, in-place, de uma coluna `JSON` em vez de remover o documento antigo e escrever o novo documento na íntegra na coluna. Essa otimização pode ser realizada para uma instrução de atualização que usa a função `JSON_REPLACE()` e atende às condições descritas em Atualizações Parciais de Valores JSON.

Para uma comparação de `JSON_INSERT()`, `JSON_REPLACE()` e `JSON_SET()`, consulte a discussão sobre `JSON_SET()`.

```
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

  Insere ou atualiza dados em um documento JSON e retorna o resultado. Retorna `NULL` se *`json_doc`* ou *`path`* for `NULL`, ou se *`path`*, quando fornecido, não localizar um objeto. Caso contrário, um erro ocorre se o argumento *`json_doc`* não for um documento JSON válido ou se qualquer argumento *`path`* não for uma expressão de caminho válida ou contiver um caractere `*` ou `**`.

  Os pares de caminho-valor são avaliados da esquerda para a direita. O documento produzido pela avaliação de um par torna-se o novo valor contra o qual o próximo par é avaliado.

Uma combinação de caminho e valor para um caminho existente no documento sobrescreve o valor existente no documento com o novo valor. Uma combinação de caminho e valor para um caminho não existente no documento adiciona o valor ao documento se o caminho identificar um desses tipos de valores:

  + Um membro não presente em um objeto existente. O membro é adicionado ao objeto e associado ao novo valor.

  + Uma posição além do final de um array existente. O array é estendido com o novo valor. Se o valor existente não for um array, ele é autoenrolado como um array, depois estendido com o novo valor.

  Caso contrário, uma combinação de caminho e valor para um caminho não existente no documento é ignorada e não tem efeito.

O otimizador pode realizar uma atualização parcial, in-place, de uma coluna `JSON` em vez de remover o documento antigo e escrever o novo documento na íntegra na coluna. Essa otimização pode ser realizada para uma declaração de atualização que usa a função `JSON_SET()`.

As funções `JSON_SET()`, `JSON_INSERT()` e `JSON_REPLACE()` estão relacionadas:

  + `JSON_SET()` substitui valores existentes e adiciona valores não existentes.

  + `JSON_INSERT()` insere valores sem substituir valores existentes.

  + `JSON_REPLACE()` substitui *apenas* valores existentes.

Os seguintes exemplos ilustram essas diferenças, usando um caminho que existe no documento (`$.a`) e outro que não existe (`$.c`):

```
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

  Desunquote o valor JSON e retorna o resultado como uma string `utf8mb4`. Retorna `NULL` se o argumento for `NULL`. Um erro ocorre se o valor começar e terminar com aspas duplas, mas não for um literal válido de string JSON.

Dentro de uma string, certas sequências têm um significado especial, a menos que o modo SQL `NO_BACKSLASH_ESCAPES` esteja habilitado. Cada uma dessas sequências começa com uma barra invertida (`\`), conhecida como *caractere de escape*. O MySQL reconhece as sequências de escape mostradas na Tabela 14.23, "Sequências de escape de caracteres especiais JSON_UNQUOTE()". Para todas as outras sequências de escape, a barra invertida é ignorada. Ou seja, o caractere escapado é interpretado como se não tivesse sido escapado. Por exemplo, `\x` é apenas `x`. Essas sequências são sensíveis ao caso. Por exemplo, `\b` é interpretado como um espaço de volta, mas `\B` é interpretado como `B`.

**Tabela 14.23 Sequências de escape de caracteres especiais JSON_UNQUOTE()**

<table><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Sequência de Escape</th> <th>Caractere Representado pela Sequência</th> </tr></thead><tbody><tr> <td><code>"</code></td> <td>O caractere de aspas duplas (<code>"</code>)</td> </tr><tr> <td><code>\b</code></td> <td>O caractere de retrocesso</td> </tr><tr> <td><code>\f</code></td> <td>O caractere de feed de formulário</td> </tr><tr> <td><code>\n</code></td> <td>O caractere de nova linha (linefeed)</td> </tr><tr> <td><code>\r</code></td> <td>O caractere de retorno de carro</td> </tr><tr> <td><code>\t</code></td> <td>O caractere de tabulação</td> </tr><tr> <td><code>\u<em class="replaceable"><code>XXXX</code></em></code></td> <td>Bytes UTF-8 para o valor Unicode <em class="replaceable"><code>XXXX</code></em></td> </tr></tbody></table>

Aqui estão dois exemplos simples do uso dessa função:

```
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

O seguinte conjunto de exemplos mostra como o `JSON_UNQUOTE` lida com escapamentos com `NO_BACKSLASH_ESCAPES` desativado e ativado:

```
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