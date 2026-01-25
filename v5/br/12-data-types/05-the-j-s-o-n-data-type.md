## 11.5 O Tipo de Dados JSON

* Criação de Valores JSON
* Normalização, Fusão e Autowrapping de Valores JSON
* Busca e Modificação de Valores JSON
* Sintaxe JSON Path
* Comparação e Ordenação de Valores JSON
* Conversão entre Valores JSON e Não-JSON
* Agregação de Valores JSON

A partir do MySQL 5.7.8, o MySQL suporta um tipo de dados nativo `JSON` (JavaScript Object Notation), definido pelo [RFC 8259](https://datatracker.ietf.org/doc/html/rfc8259), que permite acesso eficiente a dados em documentos JSON. O tipo de dados `JSON` oferece as seguintes vantagens em relação ao armazenamento de strings no formato JSON em uma coluna de string:

* Validação automática de documentos JSON armazenados em colunas `JSON`. Documentos inválidos geram um erro.

* Formato de armazenamento otimizado. Documentos JSON armazenados em colunas `JSON` são convertidos para um formato interno que permite acesso de leitura rápido aos elementos do documento. Quando o servidor precisa ler um valor JSON armazenado neste formato binário, o valor não precisa ser analisado a partir de uma representação de texto. O formato binário é estruturado para permitir que o servidor pesquise subobjetos ou valores aninhados diretamente por Key ou array Index sem ler todos os valores anteriores ou posteriores no documento.

Note

Esta discussão usa `JSON` em monoespaçado para indicar especificamente o tipo de dados JSON e “JSON” em fonte regular para indicar dados JSON em geral.

O espaço necessário para armazenar um documento `JSON` é aproximadamente o mesmo que para `LONGBLOB` ou `LONGTEXT`; consulte a Seção 11.7, “Requisitos de Armazenamento de Tipos de Dados”, para obter mais informações. É importante ter em mente que o tamanho de qualquer documento JSON armazenado em uma coluna `JSON` é limitado ao valor da variável de sistema `max_allowed_packet`. (Quando o servidor está manipulando um valor JSON internamente na memória, ele pode ser maior que esse limite; o limite se aplica quando o servidor o armazena.)

Uma coluna `JSON` não pode ter um valor default que não seja `NULL`.

Junto com o tipo de dados `JSON`, um conjunto de funções SQL está disponível para permitir operações em valores JSON, como criação, manipulação e busca. A discussão a seguir mostra exemplos dessas operações. Para obter detalhes sobre funções individuais, consulte a Seção 12.17, “Funções JSON”.

Um conjunto de funções espaciais para operar em valores GeoJSON também está disponível. Consulte a Seção 12.16.11, “Funções Espaciais GeoJSON”.

Colunas `JSON`, assim como colunas de outros tipos binários, não são indexadas diretamente; em vez disso, você pode criar um Index em uma generated column que extrai um valor Scalar da coluna `JSON`. Consulte Indexando uma Generated Column para Fornecer um Index de Coluna JSON, para um exemplo detalhado.

O Optimizer do MySQL também busca Indexes compatíveis em virtual columns que correspondam a expressões JSON.

O MySQL NDB Cluster 7.5 (7.5.2 e posterior) suporta colunas `JSON` e funções JSON do MySQL, incluindo a criação de um Index em uma coluna gerada a partir de uma coluna `JSON` como uma solução alternativa para a incapacidade de indexar uma coluna `JSON`. É suportado um máximo de 3 colunas `JSON` por tabela `NDB`.

As próximas seções fornecem informações básicas sobre a criação e manipulação de valores JSON.

### Criação de Valores JSON

Um JSON array contém uma lista de Values separados por vírgulas e delimitados pelos caracteres `[` e `]`:

```sql
["abc", 10, null, true, false]
```

Um JSON object contém um conjunto de Key-Value pairs separados por vírgulas e delimitados pelos caracteres `{` e `}`:

```sql
{"k1": "value", "k2": 10}
```

Como ilustram os exemplos, JSON arrays e objects podem conter valores Scalar que são strings ou números, o literal JSON null, ou os literais booleanos JSON true ou false. As Keys em JSON objects devem ser strings. Valores Scalar temporais (data, hora ou datetime) também são permitidos:

```sql
["12:18:29.000000", "2015-07-29", "2015-07-29 12:18:29.000000"]
```

O aninhamento é permitido dentro dos elementos JSON array e dos valores Key do JSON object:

```sql
[99, {"id": "HK500", "cost": 75.99}, ["hot", "cold"
{"k1": "value", "k2": [10, 20]}
```

Você também pode obter valores JSON a partir de várias funções fornecidas pelo MySQL para essa finalidade (consulte a Seção 12.17.2, “Funções que Criam Valores JSON”), bem como convertendo valores de outros tipos para o tipo `JSON` usando `CAST(value AS JSON)` (consulte Conversão entre Valores JSON e Não-JSON). Os próximos parágrafos descrevem como o MySQL lida com valores JSON fornecidos como input.

No MySQL, os valores JSON são escritos como strings. O MySQL analisa qualquer string usada em um contexto que exija um valor JSON e produz um erro se não for válida como JSON. Esses contextos incluem a inserção de um valor em uma coluna que possui o tipo de dados `JSON` e a passagem de um argumento para uma função que espera um valor JSON (geralmente mostrado como *`json_doc`* ou *`json_val`* na documentação das funções JSON do MySQL), como demonstram os exemplos a seguir:

* A tentativa de inserir um valor em uma coluna `JSON` é bem-sucedida se o valor for um valor JSON válido, mas falha se não for:

  ```sql
  mysql> CREATE TABLE t1 (jdoc JSON);
  Query OK, 0 rows affected (0.20 sec)

  mysql> INSERT INTO t1 VALUES('{"key1": "value1", "key2": "value2"}');
  Query OK, 1 row affected (0.01 sec)

  mysql> INSERT INTO t1 VALUES('[1, 2,');
  ERROR 3140 (22032) at line 2: Invalid JSON text:
  "Invalid value." at position 6 in value (or column) '[1, 2,'.
  ```

  As posições para "at position *`N`*" nessas mensagens de erro são baseadas em 0, mas devem ser consideradas indicações aproximadas de onde o problema realmente ocorre em um valor.

* A função `JSON_TYPE()` espera um argumento JSON e tenta analisá-lo em um valor JSON. Ela retorna o tipo JSON do valor se for válido e produz um erro caso contrário:

  ```sql
  mysql> SELECT JSON_TYPE('["a", "b", 1]');
  +----------------------------+
  | JSON_TYPE('["a", "b", 1]') |
  +----------------------------+
  | ARRAY                      |
  +----------------------------+

  mysql> SELECT JSON_TYPE('"hello"');
  +----------------------+
  | JSON_TYPE('"hello"') |
  +----------------------+
  | STRING               |
  +----------------------+

  mysql> SELECT JSON_TYPE('hello');
  ERROR 3146 (22032): Invalid data type for JSON data in argument 1
  to function json_type; a JSON string or JSON type is required.
  ```

O MySQL trata as strings usadas em contexto JSON usando o conjunto de caracteres `utf8mb4` e a collation `utf8mb4_bin`. Strings em outros conjuntos de caracteres são convertidas para `utf8mb4` conforme necessário. (Para strings nos conjuntos de caracteres `ascii` ou `utf8`, nenhuma conversão é necessária porque `ascii` e `utf8` são subconjuntos de `utf8mb4`.)

Como alternativa à escrita de valores JSON usando literais de string, existem funções para compor valores JSON a partir de elementos componentes. `JSON_ARRAY()` aceita uma lista (possivelmente vazia) de valores e retorna um JSON array contendo esses valores:

```sql
mysql> SELECT JSON_ARRAY('a', 1, NOW());
+----------------------------------------+
| JSON_ARRAY('a', 1, NOW())              |
+----------------------------------------+
| ["a", 1, "2015-07-27 09:43:47.000000"] |
+----------------------------------------+
```

`JSON_OBJECT()` aceita uma lista (possivelmente vazia) de Key-Value pairs e retorna um JSON object contendo esses pares:

```sql
mysql> SELECT JSON_OBJECT('key1', 1, 'key2', 'abc');
+---------------------------------------+
| JSON_OBJECT('key1', 1, 'key2', 'abc') |
+---------------------------------------+
| {"key1": 1, "key2": "abc"}            |
+---------------------------------------+
```

`JSON_MERGE()` aceita dois ou mais documentos JSON e retorna o resultado combinado:

```sql
mysql> SELECT JSON_MERGE('["a", 1]', '{"key": "value"}');
+--------------------------------------------+
| JSON_MERGE('["a", 1]', '{"key": "value"}') |
+--------------------------------------------+
| ["a", 1, {"key": "value"}]                 |
+--------------------------------------------+
```

Para obter informações sobre as regras de fusão (Merging), consulte Normalização, Fusão e Autowrapping de Valores JSON.

Valores JSON podem ser atribuídos a user-defined variables:

```sql
mysql> SET @j = JSON_OBJECT('key', 'value');
mysql> SELECT @j;
+------------------+
| @j               |
+------------------+
| {"key": "value"} |
+------------------+
```

No entanto, user-defined variables não podem ser do tipo de dados `JSON`, portanto, embora `@j` no exemplo anterior pareça um valor JSON e tenha o mesmo conjunto de caracteres e collation que um valor JSON, ele *não* possui o tipo de dados `JSON`. Em vez disso, o resultado de `JSON_OBJECT()` é convertido em uma string quando atribuído à variável.

Strings produzidas pela conversão de valores JSON têm um conjunto de caracteres `utf8mb4` e uma collation `utf8mb4_bin`:

```sql
mysql> SELECT CHARSET(@j), COLLATION(@j);
+-------------+---------------+
| CHARSET(@j) | COLLATION(@j) |
+-------------+---------------+
| utf8mb4     | utf8mb4_bin   |
+-------------+---------------+
```

Como `utf8mb4_bin` é uma collation binária, a comparação de valores JSON diferencia maiúsculas de minúsculas (case-sensitive):

```sql
mysql> SELECT JSON_ARRAY('x') = JSON_ARRAY('X');
+-----------------------------------+
| JSON_ARRAY('x') = JSON_ARRAY('X') |
+-----------------------------------+
|                                 0 |
+-----------------------------------+
```

A diferenciação de maiúsculas e minúsculas também se aplica aos literais JSON `null`, `true` e `false`, que devem ser sempre escritos em letras minúsculas:

```sql
mysql> SELECT JSON_VALID('null'), JSON_VALID('Null'), JSON_VALID('NULL');
+--------------------+--------------------+--------------------+
| JSON_VALID('null') | JSON_VALID('Null') | JSON_VALID('NULL') |
+--------------------+--------------------+--------------------+
|                  1 |                  0 |                  0 |
+--------------------+--------------------+--------------------+

mysql> SELECT CAST('null' AS JSON);
+----------------------+
| CAST('null' AS JSON) |
+----------------------+
| null                 |
+----------------------+
1 row in set (0.00 sec)

mysql> SELECT CAST('NULL' AS JSON);
ERROR 3141 (22032): Invalid JSON text in argument 1 to function cast_as_json:
"Invalid value." at position 0 in 'NULL'.
```

A diferenciação de maiúsculas e minúsculas dos literais JSON difere daquela dos literais SQL `NULL`, `TRUE` e `FALSE`, que podem ser escritos em qualquer caixa de letra:

```sql
mysql> SELECT ISNULL(null), ISNULL(Null), ISNULL(NULL);
+--------------+--------------+--------------+
| ISNULL(null) | ISNULL(Null) | ISNULL(NULL) |
+--------------+--------------+--------------+
|            1 |            1 |            1 |
+--------------+--------------+--------------+
```

Às vezes, pode ser necessário ou desejável inserir caracteres de aspas (`"` ou `'`) em um documento JSON. Suponha, para este exemplo, que você deseja inserir alguns JSON objects contendo strings que representam frases que declaram alguns fatos sobre o MySQL, cada uma emparelhada com uma Key apropriada, em uma tabela criada usando a instrução SQL mostrada aqui:

```sql
mysql> CREATE TABLE facts (sentence JSON);
```

Entre esses pares Key-frase está este:

```sql
mascot: The MySQL mascot is a dolphin named "Sakila".
```

Uma maneira de inserir isso como um JSON object na tabela `facts` é usar a função `JSON_OBJECT()` do MySQL. Neste caso, você deve escapar cada caractere de aspas usando uma barra invertida (backslash), conforme mostrado aqui:

```sql
mysql> INSERT INTO facts VALUES
     >   (JSON_OBJECT("mascot", "Our mascot is a dolphin named \"Sakila\"."));
```

Isso não funciona da mesma forma se você inserir o valor como um literal de JSON object, caso em que você deve usar a sequência de escape de barra invertida dupla, assim:

```sql
mysql> INSERT INTO facts VALUES
     >   ('{"mascot": "Our mascot is a dolphin named \\"Sakila\\"."}');
```

Usar a barra invertida dupla impede que o MySQL execute o processamento da sequência de escape e, em vez disso, faz com que ele passe o literal de string para o storage engine para processamento. Depois de inserir o JSON object de qualquer uma das maneiras mostradas, você pode ver que as barras invertidas estão presentes no valor da coluna JSON fazendo um simples `SELECT`, assim:

```sql
mysql> SELECT sentence FROM facts;
+---------------------------------------------------------+
| sentence                                                |
+---------------------------------------------------------+
| {"mascot": "Our mascot is a dolphin named \"Sakila\"."} |
+---------------------------------------------------------+
```

Para buscar esta frase específica empregando `mascot` como a Key, você pode usar o operator column-path `->`, conforme mostrado aqui:

```sql
mysql> SELECT col->"$.mascot" FROM qtest;
+---------------------------------------------+
| col->"$.mascot"                             |
+---------------------------------------------+
| "Our mascot is a dolphin named \"Sakila\"." |
+---------------------------------------------+
1 row in set (0.00 sec)
```

Isso deixa as barras invertidas intactas, juntamente com as aspas circundantes. Para exibir o valor desejado usando `mascot` como a Key, mas sem incluir as aspas circundantes ou quaisquer escapes, use o operator inline path `->>`, assim:

```sql
mysql> SELECT sentence->>"$.mascot" FROM facts;
+-----------------------------------------+
| sentence->>"$.mascot"                   |
+-----------------------------------------+
| Our mascot is a dolphin named "Sakila". |
+-----------------------------------------+
```

Note

O exemplo anterior não funciona conforme mostrado se o modo SQL de servidor `NO_BACKSLASH_ESCAPES` estiver ativado. Se este modo estiver definido, uma única barra invertida em vez de barras invertidas duplas pode ser usada para inserir o literal de JSON object, e as barras invertidas são preservadas. Se você usar a função `JSON_OBJECT()` ao realizar a inserção e este modo estiver definido, você deve alternar aspas simples e duplas, assim:

```sql
mysql> INSERT INTO facts VALUES
     > (JSON_OBJECT('mascot', 'Our mascot is a dolphin named "Sakila".'));
```

Consulte a descrição da função `JSON_UNQUOTE()` para obter mais informações sobre os efeitos deste modo em caracteres escapados em valores JSON.

### Normalização, Fusão e Autowrapping de Valores JSON

Quando uma string é analisada e considerada um documento JSON válido, ela também é normalizada: Membros com Keys que duplicam uma Key encontrada anteriormente no documento são descartados (mesmo que os Values sejam diferentes). O valor object produzido pela seguinte chamada `JSON_OBJECT()` não inclui o segundo elemento `key1` porque esse nome de Key ocorre antes no valor:

```sql
mysql> SELECT JSON_OBJECT('key1', 1, 'key2', 'abc', 'key1', 'def');
+------------------------------------------------------+
| JSON_OBJECT('key1', 1, 'key2', 'abc', 'key1', 'def') |
+------------------------------------------------------+
| {"key1": 1, "key2": "abc"}                           |
+------------------------------------------------------+
```

Note

Este tratamento de Keys duplicadas de "a primeira Key vence" (first key wins) não é consistente com o [RFC 7159](https://tools.ietf.org/html/rfc7159). Este é um problema conhecido no MySQL 5.7, que foi corrigido no MySQL 8.0. (Bug #86866, Bug #26369555)

O MySQL também descarta espaços em branco extras entre Keys, Values ou elementos no documento JSON original e deixa (ou insere, quando necessário) um único espaço após cada vírgula (`,`) ou dois pontos (`:`) ao exibi-lo. Isso é feito para melhorar a legibilidade.

As funções MySQL que produzem valores JSON (consulte a Seção 12.17.2, “Funções que Criam Valores JSON”) sempre retornam valores normalizados.

Para tornar as buscas (lookups) mais eficientes, ele também ordena as Keys de um JSON object. *Você deve estar ciente de que o resultado desta ordenação está sujeito a alterações e não há garantia de que será consistente entre as releases*.

#### Fusão de Valores JSON

Em contextos que combinam múltiplos arrays, os arrays são fundidos em um único array pela concatenação de arrays nomeados posteriormente ao final do primeiro array. No exemplo a seguir, `JSON_MERGE()` funde seus argumentos em um único array:

```sql
mysql> SELECT JSON_MERGE('[1, 2]', '["a", "b"]', '[true, false]');
+-----------------------------------------------------+
| JSON_MERGE('[1, 2]', '["a", "b"]', '[true, false]') |
+-----------------------------------------------------+
| [1, 2, "a", "b", true, false]                       |
+-----------------------------------------------------+
```

A normalização também é executada quando os valores são inseridos em colunas JSON, conforme mostrado aqui:

```sql
mysql> CREATE TABLE t1 (c1 JSON);

mysql> INSERT INTO t1 VALUES
     >     ('{"x": 17, "x": "red"}'),
     >     ('{"x": 17, "x": "red", "x": [3, 5, 7]}');

mysql> SELECT c1 FROM t1;
+-----------+
| c1        |
+-----------+
| {"x": 17} |
| {"x": 17} |
+-----------+
```

Múltiplos objects quando fundidos produzem um único object. Se múltiplos objects tiverem a mesma Key, o Value para essa Key no object fundido resultante é um array contendo os Key Values:

```sql
mysql> SELECT JSON_MERGE('{"a": 1, "b": 2}', '{"c": 3, "a": 4}');
+----------------------------------------------------+
| JSON_MERGE('{"a": 1, "b": 2}', '{"c": 3, "a": 4}') |
+----------------------------------------------------+
| {"a": [1, 4], "b": 2, "c": 3}                      |
+----------------------------------------------------+
```

Valores não-array usados em um contexto que requer um valor array são autowrapped: O valor é cercado pelos caracteres `[` e `]` para convertê-lo em um array. Na instrução a seguir, cada argumento é autowrapped como um array (`[1]`, `[2]`). Estes são então fundidos para produzir um único array de resultado:

```sql
mysql> SELECT JSON_MERGE('1', '2');
+----------------------+
| JSON_MERGE('1', '2') |
+----------------------+
| [1, 2]               |
+----------------------+
```

Os valores Array e object são fundidos autowrapping o object como um array e fundindo os dois arrays:

```sql
mysql> SELECT JSON_MERGE('[10, 20]', '{"a": "x", "b": "y"}');
+------------------------------------------------+
| JSON_MERGE('[10, 20]', '{"a": "x", "b": "y"}') |
+------------------------------------------------+
| [10, 20, {"a": "x", "b": "y"}]                 |
+------------------------------------------------+
```

### Busca e Modificação de Valores JSON

Uma JSON Path Expression seleciona um valor dentro de um documento JSON.

As Path Expressions são úteis com funções que extraem partes ou modificam um documento JSON, para especificar onde dentro desse documento operar. Por exemplo, a seguinte Query extrai de um documento JSON o Value do membro com a Key `name`:

```sql
mysql> SELECT JSON_EXTRACT('{"id": 14, "name": "Aztalan"}', '$.name');
+---------------------------------------------------------+
| JSON_EXTRACT('{"id": 14, "name": "Aztalan"}', '$.name') |
+---------------------------------------------------------+
| "Aztalan"                                               |
+---------------------------------------------------------+
```

A sintaxe Path usa um caractere `$` inicial para representar o documento JSON em consideração, opcionalmente seguido por seletores que indicam sucessivamente partes mais específicas do documento:

* Um ponto seguido por um nome de Key nomeia o membro em um object com a Key fornecida. O nome da Key deve ser especificado entre aspas duplas se o nome sem aspas não for legal dentro das Path Expressions (por exemplo, se contiver um espaço).

* `[N]` anexado a um *`path`* que seleciona um array nomeia o valor na posição *`N`* dentro do array. As posições do array são números inteiros começando com zero. Se *`path`* não selecionar um valor array, *`path`*[0] avalia o mesmo valor que *`path`*:

  ```sql
  mysql> SELECT JSON_SET('"x"', '$[0]', 'a');
  +------------------------------+
  | JSON_SET('"x"', '$[0]', 'a') |
  +------------------------------+
  | "a"                          |
  +------------------------------+
  1 row in set (0.00 sec)
  ```

* Paths podem conter wildcards `*` ou `**`:

  + `.[*]` avalia os Values de todos os membros em um JSON object.

  + `[*]` avalia os Values de todos os elementos em um JSON array.

  + `prefix**suffix` avalia todos os Paths que começam com o prefixo nomeado e terminam com o sufixo nomeado.

* Um Path que não existe no documento (avalia dados inexistentes) avalia `NULL`.

Deixe `$` se referir a este JSON array com três elementos:

```sql
[3, {"a": [5, 6], "b": 10}, [99, 100
```

Então:

* `$[0]` avalia `3`.
* `$[1]` avalia `{"a": [5, 6], "b": 10}`.

* `$[2]` avalia `[99, 100]`.

* `$[3]` avalia `NULL` (refere-se ao quarto elemento do array, que não existe).

Como `$[1]` e `$[2]` avaliam valores não-Scalar, eles podem ser usados como base para Path Expressions mais específicas que selecionam valores aninhados. Exemplos:

* `$[1].a` avalia `[5, 6]`.

* `$[1].a[1]` avalia `6`.

* `$[1].b` avalia `10`.

* `$[2][0]` avalia `99`.

Conforme mencionado anteriormente, os componentes Path que nomeiam Keys devem ser citados se o nome da Key sem aspas não for legal em Path Expressions. Deixe `$` se referir a este valor:

```sql
{"a fish": "shark", "a bird": "sparrow"}
```

Ambas as Keys contêm um espaço e devem ser citadas:

* `$."a fish"` avalia `shark`.

* `$."a bird"` avalia `sparrow`.

Paths que usam wildcards avaliam um array que pode conter múltiplos valores:

```sql
mysql> SELECT JSON_EXTRACT('{"a": 1, "b": 2, "c": [3, 4, 5]}', '$.*');
+---------------------------------------------------------+
| JSON_EXTRACT('{"a": 1, "b": 2, "c": [3, 4, 5]}', '$.*') |
+---------------------------------------------------------+
| [1, 2, [3, 4, 5                                       |
+---------------------------------------------------------+
mysql> SELECT JSON_EXTRACT('{"a": 1, "b": 2, "c": [3, 4, 5]}', '$.c[*]');
+------------------------------------------------------------+
| JSON_EXTRACT('{"a": 1, "b": 2, "c": [3, 4, 5]}', '$.c[*]') |
+------------------------------------------------------------+
| [3, 4, 5]                                                  |
+------------------------------------------------------------+
```

No exemplo a seguir, o Path `$**.b` avalia múltiplos Paths (`$.a.b` e `$.c.b`) e produz um array dos valores Path correspondentes:

```sql
mysql> SELECT JSON_EXTRACT('{"a": {"b": 1}, "c": {"b": 2}}', '$**.b');
+---------------------------------------------------------+
| JSON_EXTRACT('{"a": {"b": 1}, "c": {"b": 2}}', '$**.b') |
+---------------------------------------------------------+
| [1, 2]                                                  |
+---------------------------------------------------------+
```

No MySQL 5.7.9 e posterior, você pode usar `column->path` com um identificador de coluna JSON e uma JSON Path Expression como um sinônimo para `JSON_EXTRACT(column, path)`. Consulte a Seção 12.17.3, “Funções que Buscam Valores JSON”, para obter mais informações. Consulte também Indexando uma Generated Column para Fornecer um Index de Coluna JSON.

Algumas funções aceitam um documento JSON existente, modificam-no de alguma forma e retornam o documento modificado resultante. As Path Expressions indicam onde no documento fazer alterações. Por exemplo, as funções `JSON_SET()`, `JSON_INSERT()` e `JSON_REPLACE()` aceitam um documento JSON, mais um ou mais pares Path/Value que descrevem onde modificar o documento e os valores a serem usados. As funções diferem na forma como lidam com valores existentes e não existentes dentro do documento.

Considere este documento:

```sql
mysql> SET @j = '["a", {"b": [true, false]}, [10, 20';
```

`JSON_SET()` substitui Values para Paths que existem e adiciona Values para Paths que não existem:.

```sql
mysql> SELECT JSON_SET(@j, '$[1].b[0]', 1, '$[2][2]', 2);
+--------------------------------------------+
| JSON_SET(@j, '$[1].b[0]', 1, '$[2][2]', 2) |
+--------------------------------------------+
| ["a", {"b": [1, false]}, [10, 20, 2      |
+--------------------------------------------+
```

Neste caso, o Path `$[1].b[0]` seleciona um valor existente (`true`), que é substituído pelo valor que segue o argumento Path (`1`). O Path `$[2][2]` não existe, então o valor correspondente (`2`) é adicionado ao valor selecionado por `$[2]`.

`JSON_INSERT()` adiciona novos Values, mas não substitui Values existentes:

```sql
mysql> SELECT JSON_INSERT(@j, '$[1].b[0]', 1, '$[2][2]', 2);
+-----------------------------------------------+
| JSON_INSERT(@j, '$[1].b[0]', 1, '$[2][2]', 2) |
+-----------------------------------------------+
| ["a", {"b": [true, false]}, [10, 20, 2      |
+-----------------------------------------------+
```

`JSON_REPLACE()` substitui Values existentes e ignora novos Values:

```sql
mysql> SELECT JSON_REPLACE(@j, '$[1].b[0]', 1, '$[2][2]', 2);
+------------------------------------------------+
| JSON_REPLACE(@j, '$[1].b[0]', 1, '$[2][2]', 2) |
+------------------------------------------------+
| ["a", {"b": [1, false]}, [10, 20             |
+------------------------------------------------+
```

Os pares Path/Value são avaliados da esquerda para a direita. O documento produzido pela avaliação de um par se torna o novo valor contra o qual o próximo par é avaliado.

`JSON_REMOVE()` aceita um documento JSON e um ou mais Paths que especificam Values a serem removidos do documento. O valor de retorno é o documento original menos os Values selecionados por Paths que existem dentro do documento:

```sql
mysql> SELECT JSON_REMOVE(@j, '$[2]', '$[1].b[1]', '$[1].b[1]');
+---------------------------------------------------+
| JSON_REMOVE(@j, '$[2]', '$[1].b[1]', '$[1].b[1]') |
+---------------------------------------------------+
| ["a", {"b": [true]}]                              |
+---------------------------------------------------+
```

Os Paths têm os seguintes efeitos:

* `$[2]` corresponde a `[10, 20]` e o remove.

* A primeira instância de `$[1].b[1]` corresponde a `false` no elemento `b` e o remove.

* A segunda instância de `$[1].b[1]` não corresponde a nada: Esse elemento já foi removido, o Path não existe mais e não tem efeito.

### Sintaxe JSON Path

Muitas das funções JSON suportadas pelo MySQL e descritas em outras partes deste Manual (consulte a Seção 12.17, “Funções JSON”) exigem uma Path Expression para identificar um elemento específico em um documento JSON. Um Path consiste no escopo do Path seguido por uma ou mais Path legs. Para Paths usados nas funções JSON do MySQL, o escopo é sempre o documento sendo pesquisado ou operado, representado por um caractere `$` inicial. As Path legs são separadas por caracteres de ponto (`.`). As células em arrays são representadas por `[N]`, onde *`N`* é um número inteiro não negativo. Os nomes das Keys devem ser strings entre aspas duplas ou ECMAScript identifiers válidos (consulte `http://www.ecma-international.org/ecma-262/5.1/#sec-7.6`). As Path Expressions, assim como o texto JSON, devem ser codificadas usando o conjunto de caracteres `ascii`, `utf8` ou `utf8mb4`. Outras codificações de caracteres são implicitamente coagidas a `utf8mb4`. A sintaxe completa é mostrada aqui:

```sql
pathExpression:
    scope[(pathLeg)*]

pathLeg:
    member | arrayLocation | doubleAsterisk

member:
    period ( keyName | asterisk )

arrayLocation:
    leftBracket ( nonNegativeInteger | asterisk ) rightBracket

keyName:
    ESIdentifier | doubleQuotedString

doubleAsterisk:
    '**'

period:
    '.'

asterisk:
    '*'

leftBracket:
    '['

rightBracket:
    ']'
```

Conforme observado anteriormente, no MySQL, o escopo do Path é sempre o documento que está sendo operado, representado como `$`. Você pode usar `'$'` como um sinônimo para o documento em JSON Path Expressions.

Note

Algumas implementações suportam referências de coluna para escopos de Paths JSON; atualmente, o MySQL não as suporta.

Os tokens wildcard `*` e `**` são usados da seguinte forma:

* `.*` representa os Values de todos os membros no object.

* `[*]` representa os Values de todas as células no array.

* `[prefix]**suffix` representa todos os Paths começando com *`prefix`* e terminando com *`suffix`*. *`prefix`* é opcional, enquanto *`suffix`* é obrigatório; em outras palavras, um Path não pode terminar em `**`.

  Além disso, um Path não pode conter a sequência `***`.

Para exemplos de sintaxe Path, consulte as descrições das várias funções JSON que aceitam Paths como argumentos, como `JSON_CONTAINS_PATH()`, `JSON_SET()` e `JSON_REPLACE()`. Para exemplos que incluem o uso dos wildcards `*` e `**`, consulte a descrição da função `JSON_SEARCH()`.

### Comparação e Ordenação de Valores JSON

Valores JSON podem ser comparados usando os operators `=`, `<`, `<=`, `>`, `>=`, `<>`, `!=` e `<=>`.

Os seguintes operators e funções de comparação ainda não são suportados com valores JSON:

* `BETWEEN`
* `IN()`
* `GREATEST()`
* `LEAST()`

Uma solução alternativa para os operators e funções de comparação listados é converter valores JSON para um tipo de dados Scalar numérico ou de string nativo do MySQL para que tenham um tipo Scalar não-JSON consistente.

A comparação de valores JSON ocorre em dois níveis. O primeiro nível de comparação é baseado nos tipos JSON dos valores comparados. Se os tipos diferirem, o resultado da comparação é determinado apenas por qual tipo tem precedência mais alta. Se os dois valores tiverem o mesmo tipo JSON, ocorre um segundo nível de comparação usando regras específicas do tipo.

A lista a seguir mostra as precedências dos tipos JSON, da precedência mais alta para a mais baixa. (Os nomes dos tipos são os retornados pela função `JSON_TYPE()`.) Os tipos mostrados juntos em uma linha têm a mesma precedência. Qualquer valor que tenha um tipo JSON listado anteriormente na lista é comparado como maior do que qualquer valor que tenha um tipo JSON listado posteriormente na lista.

```sql
BLOB
BIT
OPAQUE
DATETIME
TIME
DATE
BOOLEAN
ARRAY
OBJECT
STRING
INTEGER, DOUBLE
NULL
```

Para valores JSON da mesma precedência, as regras de comparação são específicas do tipo:

* `BLOB`

  Os primeiros *`N`* bytes dos dois valores são comparados, onde *`N`* é o número de bytes no valor mais curto. Se os primeiros *`N`* bytes dos dois valores forem idênticos, o valor mais curto é ordenado antes do valor mais longo.

* `BIT`

  Mesmas regras que para `BLOB`.

* `OPAQUE`

  Mesmas regras que para `BLOB`. Valores `OPAQUE` são valores que não são classificados como um dos outros tipos.

* `DATETIME`

  Um valor que representa um ponto no tempo anterior é ordenado antes de um valor que representa um ponto no tempo posterior. Se dois valores vierem originalmente dos tipos MySQL `DATETIME` e `TIMESTAMP`, respectivamente, eles são iguais se representarem o mesmo ponto no tempo.

* `TIME`

  O menor de dois valores de tempo é ordenado antes do maior.

* `DATE`

  A data anterior é ordenada antes da data mais recente.

* `ARRAY`

  Dois JSON arrays são iguais se tiverem o mesmo comprimento e os valores nas posições correspondentes nos arrays forem iguais.

  Se os arrays não forem iguais, sua ordem é determinada pelos elementos na primeira posição onde houver uma diferença. O array com o valor menor nessa posição é ordenado primeiro. Se todos os valores do array mais curto forem iguais aos valores correspondentes no array mais longo, o array mais curto é ordenado primeiro.

  Exemplo:

  ```sql
  [] < ["a"] < ["ab"] < ["ab", "cd", "ef"] < ["ab", "ef"]
  ```

* `BOOLEAN`

  O literal JSON false é menor do que o literal JSON true.

* `OBJECT`

  Dois JSON objects são iguais se tiverem o mesmo conjunto de Keys, e cada Key tiver o mesmo valor em ambos os objects.

  Exemplo:

  ```sql
  {"a": 1, "b": 2} = {"b": 2, "a": 1}
  ```

  A ordem de dois objects que não são iguais é não especificada, mas determinística.

* `STRING`

  As strings são ordenadas lexicalmente nos primeiros *`N`* bytes da representação `utf8mb4` das duas strings sendo comparadas, onde *`N`* é o comprimento da string mais curta. Se os primeiros *`N`* bytes das duas strings forem idênticos, a string mais curta é considerada menor do que a string mais longa.

  Exemplo:

  ```sql
  "a" < "ab" < "b" < "bc"
  ```

  Esta ordenação é equivalente à ordenação de strings SQL com collation `utf8mb4_bin`. Como `utf8mb4_bin` é uma collation binária, a comparação de valores JSON diferencia maiúsculas de minúsculas:

  ```sql
  "A" < "a"
  ```

* `INTEGER`, `DOUBLE`

  Valores JSON podem conter números de valor exato e números de valor aproximado. Para uma discussão geral sobre esses tipos de números, consulte a Seção 9.1.2, “Literais Numéricos”.

  As regras para comparação de tipos numéricos nativos do MySQL são discutidas na Seção 12.3, “Conversão de Tipo na Avaliação de Expressões”, mas as regras para comparação de números dentro de valores JSON diferem um pouco:

  + Em uma comparação entre duas colunas que usam os tipos numéricos nativos do MySQL `INT` e `DOUBLE`, respectivamente, sabe-se que todas as comparações envolvem um Integer e um Double, então o Integer é convertido para Double para todas as linhas. Ou seja, números de valor exato são convertidos para números de valor aproximado.

  + Por outro lado, se a Query comparar duas colunas JSON contendo números, não é possível saber antecipadamente se os números são Integer ou Double. Para fornecer o comportamento mais consistente em todas as linhas, o MySQL converte números de valor aproximado para números de valor exato. A ordenação resultante é consistente e não perde precisão para os números de valor exato. Por exemplo, dados os Scalars 9223372036854775805, 9223372036854775806, 9223372036854775807 e 9.223372036854776e18, a ordem é tal como esta:

    ```sql
    9223372036854775805 < 9223372036854775806 < 9223372036854775807
    < 9.223372036854776e18 = 9223372036854776000 < 9223372036854776001
    ```

  Se as comparações JSON usassem as regras de comparação numérica não-JSON, poderia ocorrer ordenação inconsistente. As regras usuais de comparação do MySQL para números resultam nessas ordenações:

  + Comparação Integer:

    ```sql
    9223372036854775805 < 9223372036854775806 < 9223372036854775807
    ```

    (não definido para 9.223372036854776e18)

  + Comparação Double:

    ```sql
    9223372036854775805 = 9223372036854775806 = 9223372036854775807 = 9.223372036854776e18
    ```

Para comparação de qualquer valor JSON com SQL `NULL`, o resultado é `UNKNOWN`.

Para comparação de valores JSON e não-JSON, o valor não-JSON é convertido para JSON de acordo com as regras na tabela a seguir e, em seguida, os valores são comparados conforme descrito anteriormente.

### Conversão entre Valores JSON e Não-JSON

A tabela a seguir fornece um resumo das regras que o MySQL segue ao fazer a conversão (`casting`) entre valores JSON e valores de outros tipos:

**Tabela 11.3 Regras de Conversão JSON**

<table summary="Regras de conversão para o tipo de dados JSON"><col style="width: 20%"/><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th>Outro Tipo</th> <th>CAST(Outro Tipo AS JSON)</th> <th>CAST(JSON AS Outro Tipo)</th> </tr></thead><tbody><tr> <th>JSON</th> <td>Nenhuma alteração</td> <td>Nenhuma alteração</td> </tr><tr> <th>Tipo de caractere utf8 (<code>utf8mb4</code>, <code>utf8</code>, <code>ascii</code>)</th> <td>A string é analisada em um valor JSON.</td> <td>O valor JSON é serializado em uma string <code>utf8mb4</code>.</td> </tr><tr> <th>Outros tipos de caractere</th> <td>Outras codificações de caracteres são implicitamente convertidas para <code>utf8mb4</code> e tratadas conforme descrito para o tipo de caractere utf8.</td> <td>O valor JSON é serializado em uma string <code>utf8mb4</code> e, em seguida, convertido para a outra codificação de caractere. O resultado pode não ser significativo.</td> </tr><tr> <th><code>NULL</code></th> <td>Resulta em um valor <code>NULL</code> do tipo JSON.</td> <td>Não aplicável.</td> </tr><tr> <th>Tipos Geometry</th> <td>O valor Geometry é convertido em um documento JSON chamando <code>ST_AsGeoJSON()</code>.</td> <td>Operação ilegal. Solução alternativa: Passe o resultado de <code>CAST(<em><code>json_val</code></em> AS CHAR)</code> para <code>ST_GeomFromGeoJSON()</code>.</td> </tr><tr> <th>Todos os outros tipos</th> <td>Resulta em um documento JSON consistindo em um único valor Scalar.</td> <td>É bem-sucedido se o documento JSON consistir em um único valor Scalar do tipo de destino e esse valor Scalar puder ser convertido para o tipo de destino. Caso contrário, retorna <code>NULL</code> e produz um Warning.</td> </tr> </tbody></table>

`ORDER BY` e `GROUP BY` para valores JSON funcionam de acordo com estes princípios:

* A ordenação de valores JSON Scalar usa as mesmas regras da discussão anterior.

* Para ordenações ascendentes, SQL `NULL` é ordenado antes de todos os valores JSON, incluindo o literal JSON null; para ordenações descendentes, SQL `NULL` é ordenado depois de todos os valores JSON, incluindo o literal JSON null.

* As Keys de ordenação para valores JSON são limitadas pelo valor da variável de sistema `max_sort_length`, portanto, Keys que diferem apenas após os primeiros `max_sort_length` bytes são comparadas como iguais.

* A ordenação de valores não-Scalar não é atualmente suportada e ocorre um Warning.

Para a ordenação, pode ser benéfico converter um Scalar JSON para algum outro tipo nativo do MySQL. Por exemplo, se uma coluna chamada `jdoc` contiver JSON objects com um membro que consiste em uma Key `id` e um valor não negativo, use esta expressão para ordenar pelos valores `id`:

```sql
ORDER BY CAST(JSON_EXTRACT(jdoc, '$.id') AS UNSIGNED)
```

Se houver uma generated column definida para usar a mesma expressão que no `ORDER BY`, o Optimizer do MySQL reconhece isso e considera usar o Index para o plano de execução da Query. Consulte a Seção 8.3.10, “Uso de Indexes de Generated Column pelo Optimizer”.

### Agregação de Valores JSON

Para a agregação de valores JSON, os valores SQL `NULL` são ignorados, assim como para outros tipos de dados. Valores não-`NULL` são convertidos para um tipo numérico e agregados, exceto para `MIN()`, `MAX()` e `GROUP_CONCAT()`. A conversão para número deve produzir um resultado significativo para valores JSON que são Scalars numéricos, embora (dependendo dos valores) possa ocorrer truncamento e perda de precisão. A conversão para número de outros valores JSON pode não produzir um resultado significativo.