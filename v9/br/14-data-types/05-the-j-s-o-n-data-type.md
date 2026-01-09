## 13.5 O Tipo de Dados JSON

* Criando Valores JSON
* Normalização, Fusão e Autoenrolagem de Valores JSON
* Procurando e Modificando Valores JSON
* Sintaxe de Caminhos JSON
* Comparação e Ordenação de Valores JSON
* Conversão entre Valores JSON e não JSON
* Agrupamento de Valores JSON

O MySQL suporta um tipo de dados nativo `JSON` (JavaScript Object Notation) definido por [RFC 8259](https://datatracker.ietf.org/doc/html/rfc8259) que permite o acesso eficiente aos dados em documentos JSON. O tipo de dados `JSON` oferece essas vantagens em relação ao armazenamento de strings no formato JSON em uma coluna de texto:

* Validação automática de documentos JSON armazenados em colunas `JSON`. Documentos inválidos produzem um erro.

* Formato de armazenamento otimizado. Documentos JSON armazenados em colunas `JSON` são convertidos para um formato interno que permite acesso rápido aos elementos do documento. Quando o servidor precisa ler um valor JSON armazenado neste formato binário, o valor não precisa ser analisado a partir de uma representação de texto. O formato binário é estruturado para permitir que o servidor procure subobjetos ou valores aninhados diretamente por chave ou índice de array sem ler todos os valores antes ou depois deles no documento.

O MySQL também suporta o formato *JSON Merge Patch* definido em [RFC 7396](https://datatracker.ietf.org/doc/html/rfc7396), usando a função `JSON_MERGE_PATCH()`. Veja a descrição desta função, bem como a Normalização, Fusão e Autoenrolagem de Valores JSON, para exemplos e informações adicionais.

Nota

Esta discussão usa `JSON` em fonte monótipo para indicar especificamente o tipo de dados JSON e “JSON” em fonte regular para indicar dados JSON em geral.

O espaço necessário para armazenar um documento `JSON` é aproximadamente o mesmo que para `LONGBLOB` ou `LONGTEXT`; consulte a Seção 13.7, “Requisitos de Armazenamento de Tipos de Dados”, para obter mais informações. É importante lembrar que o tamanho de qualquer documento `JSON` armazenado em uma coluna `JSON` é limitado ao valor da variável de sistema `max_allowed_packet`. (Quando o servidor manipula um valor JSON internamente na memória, ele pode ser maior que esse valor; o limite se aplica quando o servidor o armazena.) Você pode obter a quantidade de espaço necessária para armazenar um documento `JSON` usando a função `JSON_STORAGE_SIZE()`; note que, para uma coluna `JSON`, o tamanho de armazenamento — e, portanto, o valor retornado por essa função — é o usado pela coluna antes de quaisquer atualizações parciais que possam ter sido realizadas nela (consulte a discussão sobre a otimização da atualização parcial de JSON mais adiante nesta seção).

Juntamente com o tipo de dados `JSON`, está disponível um conjunto de funções SQL para realizar operações em valores `JSON`, como criação, manipulação e busca. A discussão a seguir mostra exemplos dessas operações. Para detalhes sobre funções individuais, consulte a Seção 14.17, “Funções JSON”.

Um conjunto de funções espaciais para operar em valores GeoJSON também está disponível. Consulte a Seção 14.16.11, “Funções GeoJSON Espaciais”.

Colunas `JSON`, como colunas de outros tipos binários, não são indexadas diretamente; em vez disso, você pode criar um índice em uma coluna gerada que extrai um valor escalar da coluna `JSON`. Consulte Indexando uma Coluna Gerada para Fornecer um Índice de Coluna JSON, para um exemplo detalhado.

O motor de armazenamento `InnoDB` também busca índices compatíveis em colunas virtuais que correspondem a expressões JSON.

O motor de armazenamento `InnoDB` suporta índices de múltiplos valores em arrays `JSON`. Consulte Índices de Múltiplos Valores.

O MySQL NDB Cluster suporta colunas `JSON` e funções JSON do MySQL, incluindo a criação de um índice em uma coluna gerada a partir de uma coluna `JSON` como uma solução para a impossibilidade de indexar uma coluna `JSON`. É suportado um máximo de 3 colunas `JSON` por tabela `NDB`.

### Atualizações Parciais de Valores JSON

No MySQL 9.5, o otimizador pode realizar uma atualização parcial, in-place, de uma coluna `JSON` em vez de remover o documento antigo e escrever o novo documento na íntegra na coluna. Essa otimização pode ser realizada para uma atualização que atenda às seguintes condições:

* A coluna sendo atualizada foi declarada como `JSON`.

* A instrução `UPDATE` usa qualquer uma das três funções `JSON_SET()`, `JSON_REPLACE()` ou `JSON_REMOVE()` para atualizar a coluna. Uma atribuição direta do valor da coluna (por exemplo, `UPDATE mytable SET jcol = '{"a": 10, "b": 25}'`) não pode ser realizada como uma atualização parcial.

  Atualizações de múltiplas colunas `JSON` em uma única instrução `UPDATE` podem ser otimizadas dessa maneira; o MySQL pode realizar atualizações parciais apenas das colunas cujos valores são atualizados usando as três funções listadas acima.

* A coluna de entrada e a coluna de destino devem ser a mesma coluna; uma instrução como `UPDATE mytable SET jcol1 = JSON_SET(jcol2, '$.a', 100)` não pode ser realizada como uma atualização parcial.

  A atualização pode usar chamadas aninhadas a qualquer uma das funções listadas no item anterior, em qualquer combinação, desde que a coluna de entrada e a coluna de destino sejam a mesma.

* Todas as alterações substituem valores de arrays ou objetos existentes por novos e não adicionam nenhum novo elemento ao objeto ou array pai.

* O valor que está sendo substituído deve ser pelo menos tão grande quanto o valor de substituição. Em outras palavras, o novo valor não pode ser maior que o antigo.

Uma possível exceção a essa exigência ocorre quando uma atualização parcial anterior deixou espaço suficiente para o valor maior. Você pode usar a função `JSON_STORAGE_FREE()` para ver quanto espaço foi liberado por quaisquer atualizações parciais de uma coluna `JSON`.

Tais atualizações parciais podem ser escritas no log binário usando um formato compacto que economiza espaço; isso pode ser habilitado definindo a variável de sistema `binlog_row_value_options` para `PARTIAL_JSON`.

É importante distinguir a atualização parcial do valor de uma coluna `JSON` armazenada em uma tabela da escrita da atualização parcial de uma linha no log binário. É possível que a atualização completa de uma coluna `JSON` seja registrada no log binário como uma atualização parcial. Isso pode acontecer quando uma das (ou ambas) das duas últimas condições da lista anterior não for atendida, mas as outras condições forem satisfeitas.

Veja também a descrição de `binlog_row_value_options`.

As próximas seções fornecem informações básicas sobre a criação e manipulação de valores JSON.

### Criando Valores JSON

Um array JSON contém uma lista de valores separados por vírgulas e encerrados entre os caracteres `[` e `]`:

```
["abc", 10, null, true, false]
```

Um objeto JSON contém um conjunto de pares chave-valor separados por vírgulas e encerrados entre os caracteres `{` e `}`:

```
{"k1": "value", "k2": 10}
```

Como os exemplos ilustram, arrays e objetos JSON podem conter valores escalares que são strings ou números, o literal JSON null ou os literais booleanos `true` ou `false` JSON. As chaves em objetos JSON devem ser strings. Valores escalares temporais (data, hora ou data e hora) também são permitidos:

```
["12:18:29.000000", "2015-07-29", "2015-07-29 12:18:29.000000"]
```

O nesting é permitido dentro dos elementos de arrays JSON e valores de chaves de objetos JSON:

```
[99, {"id": "HK500", "cost": 75.99}, ["hot", "cold"]]
{"k1": "value", "k2": [10, 20]}
```

Você também pode obter valores JSON a partir de várias funções fornecidas pelo MySQL para esse propósito (veja a Seção 14.17.2, “Funções que criam valores JSON”) e também ao converter valores de outros tipos para o tipo `JSON` usando `CAST(value AS JSON` (veja Conversão entre valores JSON e não JSON). Os próximos parágrafos descrevem como o MySQL lida com valores JSON fornecidos como entrada.

No MySQL, os valores JSON são escritos como strings. O MySQL analisa qualquer string usada em um contexto que requer um valor JSON e produz um erro se não for válido como JSON. Esses contextos incluem inserir um valor em uma coluna que tem o tipo de dados `JSON` e passar um argumento para uma função que espera um valor JSON (geralmente mostrado como *`json_doc`* ou *`json_val`* na documentação para funções JSON do MySQL), como os seguintes exemplos demonstram:

* Tentativa de inserir um valor em uma coluna `JSON` tem sucesso se o valor for um valor JSON válido, mas falha se não for:

  ```
  mysql> CREATE TABLE t1 (jdoc JSON);
  Query OK, 0 rows affected (0.20 sec)

  mysql> INSERT INTO t1 VALUES('{"key1": "value1", "key2": "value2"}');
  Query OK, 1 row affected (0.01 sec)

  mysql> INSERT INTO t1 VALUES('[1, 2,');
  ERROR 3140 (22032) at line 2: Invalid JSON text:
  "Invalid value." at position 6 in value (or column) '[1, 2,'.
  ```

  As posições para “na posição *`N`*” nesses mensagens de erro são baseadas em 0, mas devem ser consideradas indicações gerais de onde o problema em um valor realmente ocorre.

* A função `JSON_TYPE()` espera um argumento JSON e tenta analisá-lo em um valor JSON. Ela retorna o tipo JSON do valor se for válido e produz um erro caso contrário:

  ```
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

O MySQL lida com strings usadas em contexto JSON usando o conjunto de caracteres `utf8mb4` e a collation `utf8mb4_bin`. Strings em outros conjuntos de caracteres são convertidas para `utf8mb4` conforme necessário. (Para strings em conjuntos de caracteres `ascii` ou `utf8mb3`, nenhuma conversão é necessária porque `ascii` e `utf8mb3` são subconjuntos de `utf8mb4`.)

Como alternativa para escrever valores JSON usando strings literais, existem funções para compor valores JSON a partir de elementos componentes. `JSON_ARRAY()` recebe uma lista (possivelmente vazia) de valores e retorna um array JSON contendo esses valores:

```
mysql> SELECT JSON_ARRAY('a', 1, NOW());
+----------------------------------------+
| JSON_ARRAY('a', 1, NOW())              |
+----------------------------------------+
| ["a", 1, "2015-07-27 09:43:47.000000"] |
+----------------------------------------+
```

`JSON_OBJECT()` recebe uma lista (possivelmente vazia) de pares chave-valor e retorna um objeto JSON contendo esses pares:

```
mysql> SELECT JSON_OBJECT('key1', 1, 'key2', 'abc');
+---------------------------------------+
| JSON_OBJECT('key1', 1, 'key2', 'abc') |
+---------------------------------------+
| {"key1": 1, "key2": "abc"}            |
+---------------------------------------+
```

`JSON_MERGE_PRESERVE()` recebe dois ou mais documentos JSON e retorna o resultado combinado:

```
mysql> SELECT JSON_MERGE_PRESERVE('["a", 1]', '{"key": "value"}');
+-----------------------------------------------------+
| JSON_MERGE_PRESERVE('["a", 1]', '{"key": "value"}') |
+-----------------------------------------------------+
| ["a", 1, {"key": "value"}]                          |
+-----------------------------------------------------+
1 row in set (0.00 sec)
```

Para informações sobre as regras de mesclagem, consulte Normalização, Mesclagem e Autoenrolado de Valores JSON.

(O MySQL também suporta `JSON_MERGE_PATCH()`, que tem um comportamento um pouco diferente. Veja JSON_MERGE_PATCH() comparado com JSON_MERGE_PRESERVE() comparado com JSON_MERGE_PRESERVE()"), para informações sobre as diferenças entre essas duas funções.)

Valores JSON podem ser atribuídos a variáveis definidas pelo usuário:

```
mysql> SET @j = JSON_OBJECT('key', 'value');
mysql> SELECT @j;
+------------------+
| @j               |
+------------------+
| {"key": "value"} |
+------------------+
```

No entanto, as variáveis definidas pelo usuário não podem ser do tipo de dados `JSON`, então, embora `@j` no exemplo anterior pareça ser um valor JSON e tenha o mesmo conjunto de caracteres e ordenação que um valor JSON, ele *não* tem o tipo de dados `JSON`. Em vez disso, o resultado de `JSON_OBJECT()` é convertido em uma string ao ser atribuído à variável.

As strings produzidas pela conversão de valores JSON têm um conjunto de caracteres de `utf8mb4` e uma ordenação de `utf8mb4_bin`:

```
mysql> SELECT CHARSET(@j), COLLATION(@j);
+-------------+---------------+
| CHARSET(@j) | COLLATION(@j) |
+-------------+---------------+
| utf8mb4     | utf8mb4_bin   |
+-------------+---------------+
```

Como `utf8mb4_bin` é uma ordenação binária, a comparação de valores JSON é sensível ao caso.

```
mysql> SELECT JSON_ARRAY('x') = JSON_ARRAY('X');
+-----------------------------------+
| JSON_ARRAY('x') = JSON_ARRAY('X') |
+-----------------------------------+
|                                 0 |
+-----------------------------------+
```

A sensibilidade ao caso também se aplica aos literais `null`, `true` e `false` do JSON, que sempre devem ser escritos em minúsculas:

```
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

A sensibilidade ao caso dos literais JSON difere da dos literais `NULL`, `TRUE` e `FALSE` do SQL, que podem ser escritos em qualquer caso de letra:

Às vezes, pode ser necessário ou desejável inserir caracteres de citação (`"` ou `'`) em um documento JSON. Suponha, para este exemplo, que você queira inserir alguns objetos JSON contendo strings que representam frases que afirmam alguns fatos sobre o MySQL, cada uma emparelhada com uma palavra-chave apropriada, em uma tabela criada usando a instrução SQL mostrada aqui:

```
mysql> SELECT ISNULL(null), ISNULL(Null), ISNULL(NULL);
+--------------+--------------+--------------+
| ISNULL(null) | ISNULL(Null) | ISNULL(NULL) |
+--------------+--------------+--------------+
|            1 |            1 |            1 |
+--------------+--------------+--------------+
```

Entre esses pares de palavra-chave-frase está este:

```
mysql> CREATE TABLE facts (sentence JSON);
```

Uma maneira de inserir isso como um objeto JSON na tabela `facts` é usar a função `JSON_OBJECT()` do MySQL. Neste caso, você deve escapar cada caractere de citação usando uma barra invertida, como mostrado aqui:

```
mascot: The MySQL mascot is a dolphin named "Sakila".
```

Isso não funciona da mesma maneira se você inserir o valor como um literal de objeto JSON, no qual caso, você deve usar a sequência de escape dupla de barra invertida, assim:

```
mysql> INSERT INTO facts VALUES
     >   (JSON_OBJECT("mascot", "Our mascot is a dolphin named \"Sakila\"."));
```

Usar a barra invertida dupla mantém o MySQL de realizar o processamento de sequência de escape e, em vez disso, faz com que ele passe o literal de string para o motor de armazenamento para processamento. Após inserir o objeto JSON de qualquer das maneiras mostradas acima, você pode ver que as barras invertidas estão presentes no valor da coluna JSON fazendo um simples `SELECT`, assim:

```
mysql> INSERT INTO facts VALUES
     >   ('{"mascot": "Our mascot is a dolphin named \\"Sakila\\"."}');
```

Para procurar essa frase específica usando `mascot` como a chave, você pode usar o operador de caminho da coluna `->`, como mostrado aqui:

```
mysql> SELECT sentence FROM facts;
+---------------------------------------------------------+
| sentence                                                |
+---------------------------------------------------------+
| {"mascot": "Our mascot is a dolphin named \"Sakila\"."} |
+---------------------------------------------------------+
```

Isso deixa as barras invertidas intactas, juntamente com as aspas ao redor. Para exibir o valor desejado usando `mascot` como a chave, mas sem incluir as aspas ao redor ou quaisquer escapamentos, use o operador de caminho inline `->>`, assim:

```
mysql> SELECT col->"$.mascot" FROM qtest;
+---------------------------------------------+
| col->"$.mascot"                             |
+---------------------------------------------+
| "Our mascot is a dolphin named \"Sakila\"." |
+---------------------------------------------+
1 row in set (0.00 sec)
```

Nota

O exemplo anterior não funciona como mostrado se o modo SQL `NO_BACKSLASH_ESCAPES` estiver habilitado. Se esse modo estiver definido, uma barra invertida simples, em vez de duas barras invertidas, pode ser usada para inserir o literal do objeto JSON, e as barras invertidas são preservadas. Se você usar a função `JSON_OBJECT()` ao realizar a inserção e esse modo estiver definido, você deve alternar entre aspas simples e duplas, assim:

```
mysql> SELECT sentence->>"$.mascot" FROM facts;
+-----------------------------------------+
| sentence->>"$.mascot"                   |
+-----------------------------------------+
| Our mascot is a dolphin named "Sakila". |
+-----------------------------------------+
```

Veja a descrição da função `JSON_UNQUOTE()` para obter mais informações sobre os efeitos desse modo em caracteres escavados em valores JSON.

### Normalização, Fusão e Autoenrolagem de Valores JSON

Quando uma string é analisada e encontrada como um documento JSON válido, ela também é normalizada. Isso significa que os membros com chaves que duplicam uma chave encontrada mais tarde no documento, lendo da esquerda para a direita, são descartados. O valor do objeto produzido pelo seguinte chamado `JSON_OBJECT()` inclui apenas o segundo elemento `key1` porque esse nome de chave ocorre mais cedo no valor, como mostrado aqui:

```
mysql> INSERT INTO facts VALUES
     > (JSON_OBJECT('mascot', 'Our mascot is a dolphin named "Sakila".'));
```

A normalização também é realizada quando valores são inseridos em colunas JSON, como mostrado aqui:

```
mysql> SELECT JSON_OBJECT('key1', 1, 'key2', 'abc', 'key1', 'def');
+------------------------------------------------------+
| JSON_OBJECT('key1', 1, 'key2', 'abc', 'key1', 'def') |
+------------------------------------------------------+
| {"key1": "def", "key2": "abc"}                       |
+------------------------------------------------------+
```

Esse comportamento de “a chave duplicada final vence” é sugerido por [RFC 7159](https://tools.ietf.org/html/rfc7159) e é implementado pela maioria dos analisadores JavaScript. (Bug
#86866, Bug #26369555)

O MySQL descarta espaços extras entre chaves, valores ou elementos no documento JSON original e deixa (ou insere, quando necessário) um único espaço após cada vírgula (`,`) ou dois pontos (`:`) ao exibí-lo. Isso é feito para melhorar a legibilidade.

As funções do MySQL que produzem valores JSON (veja a Seção 14.17.2, “Funções que criam valores JSON”) sempre retornam valores normalizados.

Para tornar as consultas mais eficientes, o MySQL também ordena as chaves de um objeto JSON. *Você deve estar ciente de que o resultado dessa ordenação pode mudar e não é garantido que seja consistente em todas as versões*.

#### Fusão de Valores JSON

São suportados dois algoritmos de fusão, implementados pelas funções `JSON_MERGE_PRESERVE()` e `JSON_MERGE_PATCH()`. Esses diferem na forma como lidam com chaves duplicadas: `JSON_MERGE_PRESERVE()` retém os valores para chaves duplicadas, enquanto `JSON_MERGE_PATCH()` descarta todos, exceto o último valor. Os próximos parágrafos explicam como cada uma dessas duas funções lida com a fusão de diferentes combinações de documentos JSON (ou seja, de objetos e arrays).

**Fusão de arrays.** Em contextos que combinam múltiplos arrays, os arrays são fundidos em um único array. `JSON_MERGE_PRESERVE()` faz isso concatenando arrays nomeados mais tarde ao final do primeiro array. `JSON_MERGE_PATCH()` considera cada argumento como um array consistindo de um único elemento (tendo assim 0 como seu índice) e, em seguida, aplica a lógica "a chave duplicada ganha" para selecionar apenas o último argumento. Você pode comparar os resultados mostrados por essa consulta:

```
mysql> CREATE TABLE t1 (c1 JSON);

mysql> INSERT INTO t1 VALUES
     >     ('{"x": 17, "x": "red"}'),
     >     ('{"x": 17, "x": "red", "x": [3, 5, 7]}');

mysql> SELECT c1 FROM t1;
+------------------+
| c1               |
+------------------+
| {"x": "red"}     |
| {"x": [3, 5, 7]} |
+------------------+
```

Múltiplos objetos quando fundidos produzem um único objeto. `JSON_MERGE_PRESERVE()` lida com múltiplos objetos que têm a mesma chave combinando todos os valores únicos para essa chave em um array; esse array é então usado como o valor para essa chave no resultado. `JSON_MERGE_PATCH()` descarta valores para os quais chaves duplicadas são encontradas, trabalhando de esquerda para direita, de modo que o resultado contenha apenas o último valor para essa chave. A seguinte consulta ilustra a diferença nos resultados para a chave duplicada `a`:

```
mysql> SELECT
    ->   JSON_MERGE_PRESERVE('[1, 2]', '["a", "b", "c"]', '[true, false]') AS Preserve,
    ->   JSON_MERGE_PATCH('[1, 2]', '["a", "b", "c"]', '[true, false]') AS Patch\G
*************************** 1. row ***************************
Preserve: [1, 2, "a", "b", "c", true, false]
   Patch: [true, false]
```

Valores não de array usados em um contexto que requer um valor de array são autoencapsulados: O valor é cercado por caracteres `[` e `]` para convertê-lo em um array. Na seguinte declaração, cada argumento é autoencapsulado como um array (`[1]`, `[2]`). Esses são então combinados para produzir um único array de resultado; como nos dois casos anteriores, `JSON_MERGE_PRESERVE()` combina valores com a mesma chave enquanto `JSON_MERGE_PATCH()` descarta valores para todas as chaves duplicadas, exceto a última, como mostrado aqui:

```
mysql> SELECT
    ->   JSON_MERGE_PRESERVE('{"a": 1, "b": 2}', '{"c": 3, "a": 4}', '{"c": 5, "d": 3}') AS Preserve,
    ->   JSON_MERGE_PATCH('{"a": 3, "b": 2}', '{"c": 3, "a": 4}', '{"c": 5, "d": 3}') AS Patch\G
*************************** 1. row ***************************
Preserve: {"a": [1, 4], "b": 2, "c": [3, 5], "d": 3}
   Patch: {"a": 4, "b": 2, "c": 5, "d": 3}
```

Valores de array e objeto são combinados autoencapsulando o objeto como um array e combinando os arrays combinando valores ou "a chave duplicada final vence" de acordo com a escolha da função de combinação (`JSON_MERGE_PRESERVE()` ou `JSON_MERGE_PATCH()`, respectivamente), como pode ser visto neste exemplo:

```
mysql> SELECT
	  ->   JSON_MERGE_PRESERVE('1', '2') AS Preserve,
	  ->   JSON_MERGE_PATCH('1', '2') AS Patch\G
*************************** 1. row ***************************
Preserve: [1, 2]
   Patch: 2
```

### Procurando e Modificando Valores JSON

Uma expressão de caminho JSON seleciona um valor dentro de um documento JSON.

Expressões de caminho são úteis com funções que extraem partes de ou modificam um documento JSON, para especificar onde dentro desse documento operar. Por exemplo, a seguinte consulta extrai de um documento JSON o valor do membro com a chave `name`:

```
mysql> SELECT
	  ->   JSON_MERGE_PRESERVE('[10, 20]', '{"a": "x", "b": "y"}') AS Preserve,
	  ->   JSON_MERGE_PATCH('[10, 20]', '{"a": "x", "b": "y"}') AS Patch\G
*************************** 1. row ***************************
Preserve: [10, 20, {"a": "x", "b": "y"}]
   Patch: {"a": "x", "b": "y"}
```

A sintaxe de caminho usa um caractere `$` no início para representar o documento JSON em consideração, opcionalmente seguido por seletores que indicam partes sucessivamente mais específicas do documento:

* Um ponto seguido por um nome de chave nomeia o membro em um objeto com a chave dada. O nome da chave deve ser especificado entre aspas duplas se o nome sem aspas não for legal dentro das expressões de caminho (por exemplo, se contiver um espaço).

* `[N]` anexado a um `path` que seleciona um nome de array nomeia o valor na posição `N` dentro do array. As posições dos arrays são inteiros que começam com zero. Se `path` não selecionar um valor de array, `path[0]` avalia ao mesmo valor que `path`:

  ```
mysql> SELECT JSON_EXTRACT('{"id": 14, "name": "Aztalan"}', '$.name');
+---------------------------------------------------------+
| JSON_EXTRACT('{"id": 14, "name": "Aztalan"}', '$.name') |
+---------------------------------------------------------+
| "Aztalan"                                               |
+---------------------------------------------------------+
```

* `[M a N]` especifica um subconjunto ou intervalo de valores de array começando com o valor na posição `M` e terminando com o valor na posição `N`.

  `last` é suportado como sinônimo do índice do elemento de array mais à direita. O endereçamento relativo dos elementos de array também é suportado. Se `path` não selecionar um valor de array, `path[last]` avalia ao mesmo valor que `path`, como mostrado mais adiante nesta seção (veja Elemento de array mais à direita).

* Paths podem conter `*` ou `**` wildcards:

  + `.[*]` avalia os valores de todos os membros em um objeto JSON.

  + `[*]` avalia os valores de todos os elementos em um array JSON.

  + `prefix**suffix` avalia todos os paths que começam com o prefixo nomeado e terminam com o sufixo nomeado.

* Um path que não existe no documento (avalia-se a dados inexistentes) avalia a `NULL`.

Seja `$` referir-se a este array JSON com três elementos:

```
  mysql> SELECT JSON_SET('"x"', '$[0]', 'a');
  +------------------------------+
  | JSON_SET('"x"', '$[0]', 'a') |
  +------------------------------+
  | "a"                          |
  +------------------------------+
  1 row in set (0.00 sec)
  ```

Então:

* `$[0]` avalia a `3`.
* `$[1]` avalia a `{"a": [5, 6], "b": 10}`.

* `$[2]` avalia a `[99, 100]`.

* `$[3]` avalia a `NULL` (se refere ao quarto elemento de array, que não existe).

Como `$[1]` e `$[2]` avaliam a valores não escalares, eles podem ser usados como base para expressões de path mais específicas que selecionam valores aninhados. Exemplos:

* `$[1].a` avalia a `[5, 6]`.

* `$[1].a[1]` avalia a `6`.

* `$[1].b` avalia a `10`.

* `$[2][0]` avalia a `99`.

Como mencionado anteriormente, os componentes de caminho que nomeiam chaves devem ser entre aspas se o nome da chave não entre aspas não for legal em expressões de caminho. Deixe `$` referir-se a esse valor:

```
[3, {"a": [5, 6], "b": 10}, [99, 100]]
```

As chaves contêm um espaço e devem ser entre aspas:

* `$."um peixe"` avalia-se como `tubarão`.

* `$."um pássaro"` avalia-se como `pardal`.

Caminhos que usam caracteres curinga avaliam-se como um array que pode conter múltiplos valores:

```
{"a fish": "shark", "a bird": "sparrow"}
```

No exemplo a seguir, o caminho `$**.b` avalia-se como múltiplos caminhos (`$.a.b` e `$.c.b`) e produz um array dos valores de caminho correspondentes:

```
mysql> SELECT JSON_EXTRACT('{"a": 1, "b": 2, "c": [3, 4, 5]}', '$.*');
+---------------------------------------------------------+
| JSON_EXTRACT('{"a": 1, "b": 2, "c": [3, 4, 5]}', '$.*') |
+---------------------------------------------------------+
| [1, 2, [3, 4, 5]]                                       |
+---------------------------------------------------------+
mysql> SELECT JSON_EXTRACT('{"a": 1, "b": 2, "c": [3, 4, 5]}', '$.c[*]');
+------------------------------------------------------------+
| JSON_EXTRACT('{"a": 1, "b": 2, "c": [3, 4, 5]}', '$.c[*]') |
+------------------------------------------------------------+
| [3, 4, 5]                                                  |
+------------------------------------------------------------+
```

**Intervalos de arrays JSON.** Você pode usar intervalos com a palavra-chave `to` para especificar subconjuntos de arrays JSON. Por exemplo, `[1 to 3]` inclui o segundo, terceiro e quarto elementos de um array, como mostrado aqui:

```
mysql> SELECT JSON_EXTRACT('{"a": {"b": 1}, "c": {"b": 2}}', '$**.b');
+---------------------------------------------------------+
| JSON_EXTRACT('{"a": {"b": 1}, "c": {"b": 2}}', '$**.b') |
+---------------------------------------------------------+
| [1, 2]                                                  |
+---------------------------------------------------------+
```

A sintaxe é `M to N`, onde *`M`* e *`N`* são, respectivamente, o primeiro e o último índices de um intervalo de elementos de um array JSON. *`N`* deve ser maior que *`M`*; *`M`* deve ser maior ou igual a 0. Os elementos do array são indexados a partir de 0.

Você pode usar intervalos em contextos onde caracteres curinga são suportados.

**Último elemento do array.** A palavra-chave `last` é suportada como sinônimo do índice do último elemento em um array. Expressões do tipo `last - N` podem ser usadas para endereçamento relativo e dentro de definições de intervalo, como este:

```
mysql> SELECT JSON_EXTRACT('[1, 2, 3, 4, 5]', '$[1 to 3]');
+----------------------------------------------+
| JSON_EXTRACT('[1, 2, 3, 4, 5]', '$[1 to 3]') |
+----------------------------------------------+
| [2, 3, 4]                                    |
+----------------------------------------------+
1 row in set (0.00 sec)
```

Se o caminho for avaliado contra um valor que não é um array, o resultado da avaliação é o mesmo se o valor tivesse sido envolto em um array de um elemento:

```
mysql> SELECT JSON_EXTRACT('[1, 2, 3, 4, 5]', '$[last-3 to last-1]');
+--------------------------------------------------------+
| JSON_EXTRACT('[1, 2, 3, 4, 5]', '$[last-3 to last-1]') |
+--------------------------------------------------------+
| [2, 3, 4]                                              |
+--------------------------------------------------------+
1 row in set (0.01 sec)
```

Você pode usar `column->path` com um identificador de coluna JSON e uma expressão de caminho JSON como sinônimo de `JSON_EXTRACT(column, path)`. Veja a Seção 14.17.3, “Funções que buscam valores JSON”, para mais informações. Veja também Indexação de uma coluna gerada para fornecer um índice de coluna JSON.

Algumas funções recebem um documento JSON existente, o modificam de alguma maneira e retornam o documento modificado resultante. As expressões de caminho indicam onde no documento fazer as alterações. Por exemplo, as funções `JSON_SET()`, `JSON_INSERT()` e `JSON_REPLACE()` recebem um documento JSON, além de uma ou mais pares valor-caminho que descrevem onde modificar o documento e os valores a serem usados. As funções diferem na forma como lidam com valores existentes e não existentes dentro do documento.

Considere este documento:

```
mysql> SELECT JSON_REPLACE('"Sakila"', '$[last]', 10);
+-----------------------------------------+
| JSON_REPLACE('"Sakila"', '$[last]', 10) |
+-----------------------------------------+
| 10                                      |
+-----------------------------------------+
1 row in set (0.00 sec)
```

`JSON_SET()` substitui valores para caminhos que existem e adiciona valores para caminhos que não existem:

```
mysql> SET @j = '["a", {"b": [true, false]}, [10, 20]]';
```

Neste caso, o caminho `$[1].b[0]` seleciona um valor existente (`true`), que é substituído pelo valor seguinte ao argumento de caminho (`1`). O caminho `$[2][2]` não existe, então o valor correspondente (`2`) é adicionado ao valor selecionado por `$[2]`.

`JSON_INSERT()` adiciona novos valores, mas não substitui valores existentes:

```
mysql> SELECT JSON_SET(@j, '$[1].b[0]', 1, '$[2][2]', 2);
+--------------------------------------------+
| JSON_SET(@j, '$[1].b[0]', 1, '$[2][2]', 2) |
+--------------------------------------------+
| ["a", {"b": [1, false]}, [10, 20, 2]]      |
+--------------------------------------------+
```

`JSON_REPLACE()` substitui valores existentes e ignora novos valores:

```
mysql> SELECT JSON_INSERT(@j, '$[1].b[0]', 1, '$[2][2]', 2);
+-----------------------------------------------+
| JSON_INSERT(@j, '$[1].b[0]', 1, '$[2][2]', 2) |
+-----------------------------------------------+
| ["a", {"b": [true, false]}, [10, 20, 2]]      |
+-----------------------------------------------+
```

Os pares valor-caminho são avaliados da esquerda para a direita. O documento produzido ao avaliar um par se torna o novo valor contra o qual o próximo par é avaliado.

`JSON_REMOVE()` recebe um documento JSON e um ou mais caminhos que especificam valores a serem removidos do documento. O valor de retorno é o documento original menos os valores selecionados por caminhos que existem dentro do documento:

```
mysql> SELECT JSON_REPLACE(@j, '$[1].b[0]', 1, '$[2][2]', 2);
+------------------------------------------------+
| JSON_REPLACE(@j, '$[1].b[0]', 1, '$[2][2]', 2) |
+------------------------------------------------+
| ["a", {"b": [1, false]}, [10, 20]]             |
+------------------------------------------------+
```

Os caminhos têm esses efeitos:

* `$[2]` corresponde a `[10, 20]` e a remove.

* A primeira ocorrência de `$[1].b[1]` corresponde a `false` no elemento `b` e a remove.

* A segunda ocorrência de `$[1].b[1]` não corresponde a nada: Esse elemento já foi removido, o caminho não existe mais e não tem efeito.

### Sintaxe de Caminho JSON

Muitas das funções JSON suportadas pelo MySQL e descritas em outros lugares deste Manual (veja a Seção 14.17, “Funções JSON”) requerem uma expressão de caminho para identificar um elemento específico em um documento JSON. Um caminho consiste no escopo do caminho seguido por uma ou mais pernas do caminho. Para caminhos usados em funções JSON do MySQL, o escopo é sempre o documento sendo pesquisado ou operado, representado por um caractere `$` no início. As pernas do caminho são separadas por caracteres ponto (`.`). Células em arrays são representadas por `[N]`, onde *`N`* é um inteiro não negativo. Nomes de chaves devem ser cadeias de caracteres duplicadas ou identificadores válidos do ECMAScript (veja *Nomes de Identificadores e Identificadores*, na *Especificação da Linguagem ECMAScript*). Expressões de caminho, como texto JSON, devem ser codificadas usando o conjunto de caracteres `ascii`, `utf8mb3` ou `utf8mb4`. Outras codificações de caracteres são implicitamente coercidas para `utf8mb4`. A sintaxe completa é mostrada aqui:

```
mysql> SELECT JSON_REMOVE(@j, '$[2]', '$[1].b[1]', '$[1].b[1]');
+---------------------------------------------------+
| JSON_REMOVE(@j, '$[2]', '$[1].b[1]', '$[1].b[1]') |
+---------------------------------------------------+
| ["a", {"b": [true]}]                              |
+---------------------------------------------------+
```

Como observado anteriormente, no MySQL, o escopo do caminho é sempre o documento sendo operado, representado como `$`. Você pode usar `'$'` como sinônimo do documento em expressões de caminho JSON.

Nota

Algumas implementações suportam referências de coluna para escopos de caminhos JSON; o MySQL 9.5 não suporta essas funcionalidades.

Os tokens de ponto-e-vírgula `*` e `**` são usados da seguinte forma:

* `.*` representa os valores de todos os membros no objeto.

* `[*]` representa os valores de todas as células no array.

* `[prefix]**suffix` representa todos os caminhos que começam com `[prefix]` e terminam com `[suffix]`. `[prefix]` é opcional, enquanto `[suffix]` é obrigatório; em outras palavras, um caminho não pode terminar com `**`.

Além disso, um caminho não pode conter a sequência `***`.

Para exemplos de sintaxe de caminho, consulte as descrições das várias funções JSON que aceitam caminhos como argumentos, como `JSON_CONTAINS_PATH()`, `JSON_SET()` e `JSON_REPLACE()`. Para exemplos que incluem o uso dos asteriscos `*` e `**`, consulte a descrição da função `JSON_SEARCH()`.

O MySQL também suporta notação de intervalo para subconjuntos de arrays JSON usando a palavra-chave `to` (como `$[2 to 10]`), bem como a palavra-chave `last` como sinônimo do elemento mais à direita de um array. Veja Procurando e Modificando Valores JSON para mais informações e exemplos.

### Comparação e Ordenação de Valores JSON

Valores JSON podem ser comparados usando os operadores e funções `=`, `<`, `<=`, `>`, `>=`, `<>`, `!=` e `<=>`.

Os seguintes operadores e funções de comparação ainda não são suportados com valores JSON:

* `BETWEEN`
* `IN()`
* `GREATEST()`
* `LEAST()`

Uma solução para os operadores e funções de comparação listados acima é converter os valores JSON para um tipo de dados numérico ou de string nativo do MySQL para que tenham um tipo escalar não JSON consistente.

A comparação de valores JSON ocorre em dois níveis. O primeiro nível de comparação é baseado nos tipos JSON dos valores comparados. Se os tipos diferirem, o resultado da comparação é determinado apenas pelo tipo que tem precedência maior. Se os dois valores tiverem o mesmo tipo JSON, ocorre um segundo nível de comparação usando regras específicas do tipo.

A lista a seguir mostra as precedências dos tipos JSON, do mais alto para o mais baixo. (Os nomes dos tipos são os retornados pela função `JSON_TYPE()`. Os tipos mostrados juntos em uma linha têm a mesma precedência. Qualquer valor que tenha um tipo JSON listado anteriormente na lista é comparado como maior do que qualquer valor que tenha um tipo JSON listado mais tarde na lista.)

```
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

Para valores JSON da mesma precedência, as regras de comparação são específicas do tipo:

* `BLOB`

  Os primeiros *`N`* bytes dos dois valores são comparados, onde *`N`* é o número de bytes no valor mais curto. Se os primeiros *`N`* bytes dos dois valores forem idênticos, o valor mais curto é ordenado antes do valor mais longo.

* `BIT`

  As mesmas regras que para `BLOB`.

* `OPAQUE`

  As mesmas regras que para `BLOB`. Os valores `OPAQUE` são valores que não são classificados como um dos outros tipos.

* `DATETIME`

  Um valor que representa um ponto no tempo anterior é ordenado antes de um valor que representa um ponto no tempo posterior. Se dois valores originalmente vierem dos tipos `DATETIME` e `TIMESTAMP` do MySQL, respectivamente, eles são iguais se representarem o mesmo ponto no tempo.

* `TIME`

  O menor dos dois valores de tempo é ordenado antes do maior.

* `DATE`

  A data anterior é ordenada antes da data mais recente.

* `ARRAY`

  Dois arrays JSON são iguais se tiverem o mesmo comprimento e os valores nas posições correspondentes nos arrays forem iguais.

  Se os arrays não forem iguais, sua ordem é determinada pelos elementos na primeira posição onde há uma diferença. O array com o valor menor nessa posição é ordenado primeiro. Se todos os valores do array mais curto forem iguais aos valores correspondentes no array mais longo, o array mais curto é ordenado primeiro.

  Exemplo:

  ```
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

* `BOOLEAN`

O literal JSON falso é menor que o literal JSON verdadeiro.

* `OBJECT`

  Dois objetos JSON são iguais se tiverem o mesmo conjunto de chaves e cada chave tiver o mesmo valor em ambos os objetos.

  Exemplo:

  ```
  [] < ["a"] < ["ab"] < ["ab", "cd", "ef"] < ["ab", "ef"]
  ```

  A ordem de dois objetos que não são iguais não é especificada, mas é determinada.

* `STRING`

  As strings são ordenadas lexicograficamente nos primeiros *`N`* bytes da representação `utf8mb4` das duas strings sendo comparadas, onde *`N`* é a comprimento da string mais curta. Se os primeiros *`N`* bytes das duas strings forem idênticos, a string mais curta é considerada menor que a string mais longa.

  Exemplo:

  ```
  {"a": 1, "b": 2} = {"b": 2, "a": 1}
  ```

  Essa ordenação é equivalente à ordenação de strings SQL com a collation `utf8mb4_bin`. Como `utf8mb4_bin` é uma collation binária, a comparação de valores JSON é sensível ao caso:

  ```
  "a" < "ab" < "b" < "bc"
  ```

* `INTEGER`, `DOUBLE`

  Os valores JSON podem conter números de valor exato e números de valor aproximado. Para uma discussão geral desses tipos de números, consulte a Seção 11.1.2, “Números Literais”.

  As regras para comparar tipos numéricos nativos MySQL são discutidas na Seção 14.3, “Conversão de Tipo na Avaliação de Expressões”, mas as regras para comparar números dentro dos valores JSON diferem um pouco:

  + Em uma comparação entre duas colunas que usam os tipos numéricos nativos MySQL `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e `DOUBLE` - FLOAT, DOUBLE"), respectivamente, sabe-se que todas as comparações envolvem um inteiro e um duplo, então o inteiro é convertido para duplo para todas as linhas. Ou seja, os números de valor exato são convertidos para números de valor aproximado.

Por outro lado, se a consulta comparar duas colunas JSON que contêm números, não é possível saber antecipadamente se os números são inteiros ou decimais. Para fornecer o comportamento mais consistente em todas as linhas, o MySQL converte números de valor aproximado em números de valor exato. A ordem resultante é consistente e não perde precisão para os números de valor exato. Por exemplo, dados os escalares 9223372036854775805, 9223372036854775806, 9223372036854775807 e 9.223372036854776e18, a ordem é a seguinte:

```
  "A" < "a"
  ```

Se as comparações JSON usassem as regras de comparação numérica não JSON, poderia ocorrer uma ordem inconsistente. As regras de comparação de números comuns do MySQL produzem essas ordens:

+ Comparação de inteiros:

```
    9223372036854775805 < 9223372036854775806 < 9223372036854775807
    < 9.223372036854776e18 = 9223372036854776000 < 9223372036854776001
    ```

(não definida para 9.223372036854776e18)

+ Comparação de duplos:

```
    9223372036854775805 < 9223372036854775806 < 9223372036854775807
    ```

Para a comparação de qualquer valor JSON com `NULL` em SQL, o resultado é `UNKNOWN`.

Para a comparação de valores JSON e não JSON, o valor não JSON é convertido para JSON de acordo com as regras na tabela a seguir, e os valores são comparados conforme descrito anteriormente.

### Conversão entre valores JSON e não JSON

A tabela a seguir fornece um resumo das regras que o MySQL segue ao converter entre valores JSON e valores de outros tipos:

**Tabela 13.3 Regras de Conversão JSON**

<table summary="Regras de conversão para o tipo de dados JSON">
<col style="width: 20%"/><col style="width: 40%"/><col style="width: 40%"/>
<thead><tr>
<th>outro tipo</th>
<th>CAST(outro tipo AS JSON)</th>
<th>CAST(JSON AS outro tipo)</th>
</tr></thead><tbody>
<tr>
<th>JSON</th>
<td>Sem mudança</td>
<td>Sem mudança</td>
</tr>
<tr>
<th>tipo de caractere utf8 (<code>utf8mb4</code>, <code>utf8mb3</code>, <code>ascii</code>)</th>
<td>A string é analisada como um valor JSON.</td>
<td>O valor JSON é serializado em uma string <code>utf8mb4</code>.</td>
</tr>
<tr>
<th>Outros tipos de caractere</th>
<td>Outras codificações de caracteres são convertidas implicitamente em <code>utf8mb4</code> e tratadas conforme descrito para esse tipo de caractere.</td>
<td>O valor JSON é serializado em uma string <code>utf8mb4</code>, depois convertido para a outra codificação de caracteres. O resultado pode não ser significativo.</td>
</tr>
<tr>
<th><code>NULL</code></th>
<td>Resulta em um valor <code>NULL</code> do tipo JSON.</td>
<td>Não aplicável.</td>
</tr>
<tr>
<th>Tipos de geometria</th>
<td>O valor de geometria é convertido em um documento JSON chamando <code>ST_AsGeoJSON()</code>.</td>
<td>Operação ilegal. Solução: passe o resultado de <code>CAST(<em class="replaceable"><code>json_val</code></em> AS CHAR)</code> para <code>ST_GeomFromGeoJSON()</code>.</td>
</tr>
<tr>
<th>Todos os outros tipos</th>
<td>Resulta em um documento JSON consistindo de um único valor escalar.</td>
<td>Tem sucesso se o documento JSON consistir em um único valor escalar do tipo alvo e se esse valor escalar puder ser convertido para o tipo alvo. Caso contrário, retorna <code>NULL</code> e produz um aviso.</td>
</tr>
</tbody></table>

`ORDER BY` e `GROUP BY` para valores JSON funcionam de acordo com esses princípios:

* A ordenação de valores JSON escalares usa as mesmas regras discutidas anteriormente.

* Para ordenações ascendentes, o SQL `NULL` ordena antes de todos os valores JSON, incluindo o literal JSON `NULL`; para ordenações descendentes, o SQL `NULL` ordena depois de todos os valores JSON, incluindo o literal JSON `NULL`.

* As chaves de ordenação para valores JSON são limitadas pelo valor da variável de sistema `max_sort_length`, então chaves que diferem apenas após os primeiros `max_sort_length` bytes são consideradas iguais.

* A ordenação de valores não escalares não é suportada atualmente e um aviso é exibido.

Para a ordenação, pode ser benéfico converter um valor JSON escalar para outro tipo nativo do MySQL. Por exemplo, se uma coluna chamada `jdoc` contém objetos JSON com um membro que consiste em uma chave `id` e um valor não negativo, use esta expressão para ordenar por valores de `id`:

```
    9223372036854775805 = 9223372036854775806 = 9223372036854775807 = 9.223372036854776e18
    ```

Se houver uma coluna gerada definida para usar a mesma expressão que na `ORDER BY`, o otimizador do MySQL reconhece isso e considera usar o índice para o plano de execução da consulta. Veja a Seção 10.3.11, “Uso do Otimizador de Índices de Colunas Geradas”.

### Agrupamento de Valores JSON

Para o agrupamento de valores JSON, os valores `NULL` são ignorados como para outros tipos de dados. Valores não `NULL` são convertidos para um tipo numérico e agrupados, exceto para `MIN()`, `MAX()` e `GROUP_CONCAT()`. A conversão para número deve produzir um resultado significativo para valores JSON que são escalares numéricos, embora (dependendo dos valores) possa ocorrer truncação e perda de precisão. A conversão para número de outros valores JSON pode não produzir um resultado significativo.