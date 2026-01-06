## 11.5 Tipo de dados JSON

- Criando Valores JSON
- Normalização, fusão e autoembalagem de valores JSON
- Procurando e modificando valores JSON
- Sintaxe de caminho JSON
- Comparação e ordenação de valores JSON
- Conversão entre valores JSON e não JSON
- Agrupamento de Valores JSON

A partir do MySQL 5.7.8, o MySQL suporta um tipo de dados nativo `JSON` (JavaScript Object Notation) definido pelo [RFC 8259](https://datatracker.ietf.org/doc/html/rfc8259) que permite o acesso eficiente aos dados em documentos JSON. O tipo de dados `JSON` oferece essas vantagens em relação ao armazenamento de strings no formato JSON em uma coluna de string:

- Validação automática de documentos JSON armazenados nas colunas `JSON`. Documentos inválidos produzem um erro.

- Formato de armazenamento otimizado. Os documentos JSON armazenados nas colunas `JSON` são convertidos para um formato interno que permite acesso rápido aos elementos do documento. Quando o servidor precisar ler um valor JSON armazenado nesse formato binário, o valor não precisa ser analisado a partir de uma representação de texto. O formato binário é estruturado para permitir que o servidor procure subobjetos ou valores aninhados diretamente por chave ou índice de array, sem precisar ler todos os valores antes ou depois deles no documento.

Nota

Essa discussão usa `JSON` em monotipo para indicar especificamente o tipo de dados JSON e “JSON” em fonte regular para indicar dados JSON de forma geral.

O espaço necessário para armazenar um documento `JSON` é aproximadamente o mesmo que para `LONGBLOB` ou `LONGTEXT`; consulte a Seção 11.7, “Requisitos de Armazenamento de Tipos de Dados”, para obter mais informações. É importante ter em mente que o tamanho de qualquer documento `JSON` armazenado em uma coluna `JSON` é limitado ao valor da variável de sistema `max_allowed_packet`. (Quando o servidor manipula um valor JSON internamente na memória, ele pode ser maior que este; o limite se aplica quando o servidor o armazena.)

Uma coluna `JSON` não pode ter um valor padrão que não seja `NULL`.

Juntamente com o tipo de dados `JSON`, está disponível um conjunto de funções SQL para permitir operações em valores JSON, como criação, manipulação e busca. A discussão a seguir mostra exemplos dessas operações. Para obter detalhes sobre as funções individuais, consulte a Seção 12.17, “Funções JSON”.

Também está disponível um conjunto de funções espaciais para operar com valores GeoJSON. Consulte a Seção 12.16.11, “Funções GeoJSON Espaciais”.

As colunas `JSON`, assim como as colunas de outros tipos binários, não são indexadas diretamente. Em vez disso, você pode criar um índice em uma coluna gerada que extrai um valor escalar da coluna `JSON`. Veja Indexando uma Coluna Gerada para Fornecer um Índice de Coluna JSON, para um exemplo detalhado.

O otimizador do MySQL também procura por índices compatíveis em colunas virtuais que correspondem a expressões JSON.

O MySQL NDB Cluster 7.5 (7.5.2 e versões posteriores) suporta colunas `JSON` e funções JSON do MySQL, incluindo a criação de um índice em uma coluna gerada a partir de uma coluna `JSON`, como uma solução para a impossibilidade de indexar uma coluna `JSON`. É suportado um máximo de 3 colunas `JSON` por tabela `NDB`.

As próximas seções fornecem informações básicas sobre a criação e manipulação de valores JSON.

### Criando Valores JSON

Um array JSON contém uma lista de valores separados por vírgulas e encerrados entre os caracteres `[` e `]`:

```sql
["abc", 10, null, true, false]
```

Um objeto JSON contém um conjunto de pares chave-valor separados por vírgulas e encerrados entre os caracteres `{` e `}`:

```sql
{"k1": "value", "k2": 10}
```

Como os exemplos ilustram, os arrays e objetos JSON podem conter valores escalares que são strings ou números, o literal JSON null ou os literais booleanos JSON true ou false. As chaves nos objetos JSON devem ser strings. Valores escalares temporais (data, hora ou datetime) também são permitidos:

```sql
["12:18:29.000000", "2015-07-29", "2015-07-29 12:18:29.000000"]
```

A nidificação é permitida dentro dos elementos de arrays JSON e valores de chaves de objetos JSON:

```sql
[99, {"id": "HK500", "cost": 75.99}, ["hot", "cold"]]
{"k1": "value", "k2": [10, 20]}
```

Você também pode obter valores JSON a partir de várias funções fornecidas pelo MySQL para esse propósito (veja a Seção 12.17.2, “Funções que criam valores JSON”) e também ao converter valores de outros tipos para o tipo `JSON` usando `CAST(value AS JSON` (veja Conversão entre valores JSON e não JSON). Os próximos parágrafos descrevem como o MySQL lida com valores JSON fornecidos como entrada.

No MySQL, os valores JSON são escritos como strings. O MySQL analisa qualquer string usada em um contexto que requer um valor JSON e produz um erro se não for válido como JSON. Esses contextos incluem inserir um valor em uma coluna que tem o tipo de dados `JSON` e passar um argumento para uma função que espera um valor JSON (geralmente mostrado como *`json_doc`* ou *`json_val`* na documentação das funções JSON do MySQL), como os exemplos seguintes demonstram:

- A tentativa de inserir um valor em uma coluna `JSON` é bem-sucedida se o valor for um valor JSON válido, mas falha se não for:

  ```sql
  mysql> CREATE TABLE t1 (jdoc JSON);
  Query OK, 0 rows affected (0.20 sec)

  mysql> INSERT INTO t1 VALUES('{"key1": "value1", "key2": "value2"}');
  Query OK, 1 row affected (0.01 sec)

  mysql> INSERT INTO t1 VALUES('[1, 2,');
  ERROR 3140 (22032) at line 2: Invalid JSON text:
  "Invalid value." at position 6 in value (or column) '[1, 2,'.
  ```

  As posições para "na posição *`N`*" nessas mensagens de erro são baseadas em 0, mas devem ser consideradas indicações gerais de onde o problema em um valor realmente ocorre.

- A função `JSON_TYPE()` espera um argumento JSON e tenta analisá-lo em um valor JSON. Ela retorna o tipo JSON do valor se ele for válido e produz um erro caso contrário:

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

O MySQL lida com strings usadas em contexto JSON usando o conjunto de caracteres `utf8mb4` e a collation `utf8mb4_bin`. As strings em outros conjuntos de caracteres são convertidas para `utf8mb4` conforme necessário. (Para strings em conjuntos de caracteres `ascii` ou `utf8`, nenhuma conversão é necessária, pois `ascii` e `utf8` são subconjuntos de `utf8mb4`.)

Como alternativa para escrever valores JSON usando strings literais, existem funções para compor valores JSON a partir de elementos componentes. `JSON_ARRAY()` recebe uma lista (possivelmente vazia) de valores e retorna um array JSON contendo esses valores:

```sql
mysql> SELECT JSON_ARRAY('a', 1, NOW());
+----------------------------------------+
| JSON_ARRAY('a', 1, NOW())              |
+----------------------------------------+
| ["a", 1, "2015-07-27 09:43:47.000000"] |
+----------------------------------------+
```

`JSON_OBJECT()` recebe uma lista (possívelmente vazia) de pares chave-valor e retorna um objeto JSON contendo esses pares:

```sql
mysql> SELECT JSON_OBJECT('key1', 1, 'key2', 'abc');
+---------------------------------------+
| JSON_OBJECT('key1', 1, 'key2', 'abc') |
+---------------------------------------+
| {"key1": 1, "key2": "abc"}            |
+---------------------------------------+
```

`JSON_MERGE()` recebe dois ou mais documentos JSON e retorna o resultado combinado:

```sql
mysql> SELECT JSON_MERGE('["a", 1]', '{"key": "value"}');
+--------------------------------------------+
| JSON_MERGE('["a", 1]', '{"key": "value"}') |
+--------------------------------------------+
| ["a", 1, {"key": "value"}]                 |
+--------------------------------------------+
```

Para obter informações sobre as regras de fusão, consulte Normalização, Fusão e Autoenquadramento de Valores JSON.

Os valores JSON podem ser atribuídos a variáveis definidas pelo usuário:

```sql
mysql> SET @j = JSON_OBJECT('key', 'value');
mysql> SELECT @j;
+------------------+
| @j               |
+------------------+
| {"key": "value"} |
+------------------+
```

No entanto, as variáveis definidas pelo usuário não podem ser do tipo de dados `JSON`, então, embora `@j` no exemplo anterior pareça um valor JSON e tenha o mesmo conjunto de caracteres e ordenação que um valor JSON, ele *não* tem o tipo de dados `JSON`. Em vez disso, o resultado de `JSON_OBJECT()` é convertido em uma string quando atribuído à variável.

As cadeias produzidas pela conversão de valores JSON têm um conjunto de caracteres de `utf8mb4` e uma ordenação de `utf8mb4_bin`:

```sql
mysql> SELECT CHARSET(@j), COLLATION(@j);
+-------------+---------------+
| CHARSET(@j) | COLLATION(@j) |
+-------------+---------------+
| utf8mb4     | utf8mb4_bin   |
+-------------+---------------+
```

Como o `utf8mb4_bin` é uma codificação binária, a comparação de valores JSON é sensível ao caso.

```sql
mysql> SELECT JSON_ARRAY('x') = JSON_ARRAY('X');
+-----------------------------------+
| JSON_ARRAY('x') = JSON_ARRAY('X') |
+-----------------------------------+
|                                 0 |
+-----------------------------------+
```

A sensibilidade à grafia maiúscula ou minúscula também se aplica aos literais JSON `null`, `true` e `false`, que devem ser sempre escritos em minúsculas:

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

A sensibilidade à caixa das literais JSON difere da sensibilidade à caixa das literais SQL `NULL`, `TRUE` e `FALSE`, que podem ser escritas em qualquer caso de letra:

```sql
mysql> SELECT ISNULL(null), ISNULL(Null), ISNULL(NULL);
+--------------+--------------+--------------+
| ISNULL(null) | ISNULL(Null) | ISNULL(NULL) |
+--------------+--------------+--------------+
|            1 |            1 |            1 |
+--------------+--------------+--------------+
```

Às vezes, pode ser necessário ou desejável inserir caracteres de citação (`"` ou `'`) em um documento JSON. Suponha, para este exemplo, que você queira inserir alguns objetos JSON contendo strings que representam frases que afirmam alguns fatos sobre o MySQL, cada uma emparelhada com uma palavra-chave apropriada, em uma tabela criada usando a instrução SQL mostrada aqui:

```sql
mysql> CREATE TABLE facts (sentence JSON);
```

Entre esses pares de palavras-frases estão os seguintes:

```sql
mascot: The MySQL mascot is a dolphin named "Sakila".
```

Uma maneira de inserir isso como um objeto JSON na tabela `facts` é usar a função `JSON_OBJECT()` do MySQL. Nesse caso, você deve escapar cada caractere de citação usando uma barra invertida, como mostrado aqui:

```sql
mysql> INSERT INTO facts VALUES
     >   (JSON_OBJECT("mascot", "Our mascot is a dolphin named \"Sakila\"."));
```

Isso não funciona da mesma maneira se você inserir o valor como um literal de objeto JSON, nesse caso, você deve usar a sequência de escape de barra dupla, assim:

```sql
mysql> INSERT INTO facts VALUES
     >   ('{"mascot": "Our mascot is a dolphin named \\"Sakila\\"."}');
```

Usar o backslash duplo impede que o MySQL processe sequências de escape e, em vez disso, faz com que ele passe o literal de string para o mecanismo de armazenamento para processamento. Após inserir o objeto JSON de qualquer das maneiras mostradas, você pode ver que os backslashes estão presentes no valor da coluna JSON fazendo um simples `SELECT`, assim:

```sql
mysql> SELECT sentence FROM facts;
+---------------------------------------------------------+
| sentence                                                |
+---------------------------------------------------------+
| {"mascot": "Our mascot is a dolphin named \"Sakila\"."} |
+---------------------------------------------------------+
```

Para pesquisar essa frase específica usando `mascot` como chave, você pode usar o operador `->` para caminho da coluna, como mostrado aqui:

```sql
mysql> SELECT col->"$.mascot" FROM qtest;
+---------------------------------------------+
| col->"$.mascot"                             |
+---------------------------------------------+
| "Our mascot is a dolphin named \"Sakila\"." |
+---------------------------------------------+
1 row in set (0.00 sec)
```

Isso deixa os backslashes intactos, juntamente com as aspas ao redor. Para exibir o valor desejado usando `mascot` como chave, mas sem incluir as aspas ao redor ou quaisquer escapamentos, use o operador de caminho inline `->>`, assim:

```sql
mysql> SELECT sentence->>"$.mascot" FROM facts;
+-----------------------------------------+
| sentence->>"$.mascot"                   |
+-----------------------------------------+
| Our mascot is a dolphin named "Sakila". |
+-----------------------------------------+
```

Nota

O exemplo anterior não funciona conforme mostrado se o modo SQL do servidor `NO_BACKSLASH_ESCAPES` estiver habilitado. Se esse modo estiver configurado, uma barra invertida simples, em vez de duas barras invertidas, pode ser usada para inserir o literal do objeto JSON, e as barras invertidas são preservadas. Se você usar a função `JSON_OBJECT()` ao realizar a inserção e esse modo estiver configurado, você deve alternar entre aspas simples e duplas, assim:

```sql
mysql> INSERT INTO facts VALUES
     > (JSON_OBJECT('mascot', 'Our mascot is a dolphin named "Sakila".'));
```

Consulte a descrição da função `JSON_UNQUOTE()` para obter mais informações sobre os efeitos deste modo em caracteres escapados em valores JSON.

### Normalização, fusão e autoembalagem de valores JSON

Quando uma string é analisada e descoberta como um documento JSON válido, ela também é normalizada: os membros com chaves que duplicam uma chave encontrada anteriormente no documento são descartados (mesmo que os valores sejam diferentes). O valor do objeto produzido pelo seguinte chamado `JSON_OBJECT()` não inclui o segundo elemento `key1` porque esse nome de chave ocorre anteriormente no valor:

```sql
mysql> SELECT JSON_OBJECT('key1', 1, 'key2', 'abc', 'key1', 'def');
+------------------------------------------------------+
| JSON_OBJECT('key1', 1, 'key2', 'abc', 'key1', 'def') |
+------------------------------------------------------+
| {"key1": 1, "key2": "abc"}                           |
+------------------------------------------------------+
```

Nota

Esse tratamento de chaves duplicadas com "primeira chave ganha" não é consistente com [RFC 7159](https://tools.ietf.org/html/rfc7159). Esse é um problema conhecido no MySQL 5.7, que foi corrigido no MySQL 8.0. (Bug #86866, Bug #26369555)

O MySQL também elimina espaços extras entre chaves, valores ou elementos no documento JSON original e deixa (ou insere, quando necessário) um único espaço após cada vírgula (`,`) ou dois-pontos (`:`) ao exibí-lo. Isso é feito para melhorar a legibilidade.

As funções do MySQL que produzem valores JSON (consulte a Seção 12.17.2, “Funções que criam valores JSON”) sempre retornam valores normalizados.

Para tornar as consultas mais eficientes, ele também ordena as chaves de um objeto JSON. *Você deve estar ciente de que o resultado dessa ordenação pode mudar e não é garantido que seja consistente em todas as versões*.

#### Mesclando valores JSON

Em contextos que combinam múltiplos arrays, os arrays são mesclados em um único array ao concatenar arrays nomeados posteriormente ao final do primeiro array. No exemplo a seguir, `JSON_MERGE()` mescla seus argumentos em um único array:

```sql
mysql> SELECT JSON_MERGE('[1, 2]', '["a", "b"]', '[true, false]');
+-----------------------------------------------------+
| JSON_MERGE('[1, 2]', '["a", "b"]', '[true, false]') |
+-----------------------------------------------------+
| [1, 2, "a", "b", true, false]                       |
+-----------------------------------------------------+
```

A normalização também é realizada quando os valores são inseridos nas colunas do JSON, como mostrado aqui:

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

Quando vários objetos são combinados, eles formam um único objeto. Se vários objetos tiverem a mesma chave, o valor dessa chave no objeto combinado resultante será um array contendo os valores da chave:

```sql
mysql> SELECT JSON_MERGE('{"a": 1, "b": 2}', '{"c": 3, "a": 4}');
+----------------------------------------------------+
| JSON_MERGE('{"a": 1, "b": 2}', '{"c": 3, "a": 4}') |
+----------------------------------------------------+
| {"a": [1, 4], "b": 2, "c": 3}                      |
+----------------------------------------------------+
```

Valores não de array usados em um contexto que exige um valor de array são autoencapsulados: o valor é cercado por caracteres `[` e `]` para convertê-lo em um array. Na seguinte declaração, cada argumento é autoencapsulado como um array (`[1]`, `[2]`). Esses são então combinados para produzir um único array de resultado:

```sql
mysql> SELECT JSON_MERGE('1', '2');
+----------------------+
| JSON_MERGE('1', '2') |
+----------------------+
| [1, 2]               |
+----------------------+
```

Os valores de arrays e objetos são combinados ao autoencapsular o objeto como um array e combinar os dois arrays:

```sql
mysql> SELECT JSON_MERGE('[10, 20]', '{"a": "x", "b": "y"}');
+------------------------------------------------+
| JSON_MERGE('[10, 20]', '{"a": "x", "b": "y"}') |
+------------------------------------------------+
| [10, 20, {"a": "x", "b": "y"}]                 |
+------------------------------------------------+
```

### Procurando e modificando valores JSON

Uma expressão de caminho JSON seleciona um valor dentro de um documento JSON.

As expressões de caminho são úteis com funções que extraem partes de um documento JSON ou o modificam, para especificar onde dentro desse documento você deseja operar. Por exemplo, a seguinte consulta extrai do documento JSON o valor do membro com a chave `name`:

```sql
mysql> SELECT JSON_EXTRACT('{"id": 14, "name": "Aztalan"}', '$.name');
+---------------------------------------------------------+
| JSON_EXTRACT('{"id": 14, "name": "Aztalan"}', '$.name') |
+---------------------------------------------------------+
| "Aztalan"                                               |
+---------------------------------------------------------+
```

A sintaxe de caminho usa um caractere `$` no início para representar o documento JSON em questão, opcionalmente seguido por seletores que indicam partes mais específicas do documento:

- Um período seguido por um nome chave nomeia o membro em um objeto com a chave especificada. O nome da chave deve ser especificado entre aspas duplas se o nome sem aspas não for válido em expressões de caminho (por exemplo, se contiver um espaço).

- `[N]` anexado a um *`caminho`* que seleciona um valor de um array nomeia o valor na posição *`N`* dentro do array. As posições dos arrays são inteiros que começam com zero. Se *`caminho`* não selecionar um valor de array, *`caminho`*\[0] avalia para o mesmo valor que *`caminho`*:

  ```sql
  mysql> SELECT JSON_SET('"x"', '$[0]', 'a');
  +------------------------------+
  | JSON_SET('"x"', '$[0]', 'a') |
  +------------------------------+
  | "a"                          |
  +------------------------------+
  1 row in set (0.00 sec)
  ```

- Os caminhos podem conter caracteres curingas `*` ou `**`:

  - `.[*]` avalia os valores de todos os membros de um objeto JSON.

  - `[*]` avalia os valores de todos os elementos em um array JSON.

  - `prefix**suffix` avalia todas as caminhos que começam com o prefixo nomeado e terminam com o sufixo nomeado.

- Um caminho que não existe no documento (avaliado como dados inexistentes) é avaliado como `NULL`.

Vamos chamar esse array JSON de `$`, com três elementos:

```sql
[3, {"a": [5, 6], "b": 10}, [99, 100]]
```

Então:

- `$[0]` avalia como `3`.

- `$[1]` avalia para `{"a": [5, 6], "b": 10}`.

- `$[2]` avalia para `[99, 100]`.

- `$[3]` avalia como `NULL` (ela se refere ao quarto elemento do array, que não existe).

Como `$[1]` e `$[2]` retornam valores não escalares, eles podem ser usados como base para expressões de caminho mais específicas que selecionam valores aninhados. Exemplos:

- `$[1].a` avalia para `[5, 6]`.

- `$[1].a[1]` avalia para `6`.

- `$[1].b` avalia para `10`.

- `$[2][0]` avalia para `99`.

Como mencionado anteriormente, os componentes de caminho que nomeiam chaves devem ser citados se o nome da chave não citado não for legal em expressões de caminho. Deixe `$` referir-se a esse valor:

```sql
{"a fish": "shark", "a bird": "sparrow"}
```

As chaves devem conter um espaço e devem ser citadas:

- `$."um peixe"` avalia-se como `tubarão`.

- `$."um pássaro"` avalia-se como `coruja`.

Caminhos que usam caracteres curinga são avaliados como um array que pode conter múltiplos valores:

```sql
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

No exemplo a seguir, o caminho `$**.b` avalia múltiplos caminhos (`$.a.b` e `$.c.b`) e produz um array dos valores do caminho correspondente:

```sql
mysql> SELECT JSON_EXTRACT('{"a": {"b": 1}, "c": {"b": 2}}', '$**.b');
+---------------------------------------------------------+
| JSON_EXTRACT('{"a": {"b": 1}, "c": {"b": 2}}', '$**.b') |
+---------------------------------------------------------+
| [1, 2]                                                  |
+---------------------------------------------------------+
```

No MySQL 5.7.9 e versões posteriores, você pode usar `column->path` com um identificador de coluna JSON e uma expressão de caminho JSON como sinônimo de `JSON_EXTRACT(column, path)`. Consulte a Seção 12.17.3, “Funções que buscam valores JSON”, para obter mais informações. Veja também “Indexação de uma coluna gerada para fornecer um índice de coluna JSON”.

Algumas funções recebem um documento JSON existente, modificam-no de alguma forma e retornam o documento modificado resultante. As expressões de caminho indicam onde, no documento, devem ser feitas as alterações. Por exemplo, as funções `JSON_SET()`, `JSON_INSERT()` e `JSON_REPLACE()` recebem um documento JSON, além de uma ou mais pares de caminho/valor que descrevem onde modificar o documento e os valores a serem usados. As funções diferem na forma como lidam com valores existentes e não existentes dentro do documento.

Considere este documento:

```sql
mysql> SET @j = '["a", {"b": [true, false]}, [10, 20]]';
```

`JSON_SET()` substitui os valores para caminhos que existem e adiciona valores para caminhos que não existem.

```sql
mysql> SELECT JSON_SET(@j, '$[1].b[0]', 1, '$[2][2]', 2);
+--------------------------------------------+
| JSON_SET(@j, '$[1].b[0]', 1, '$[2][2]', 2) |
+--------------------------------------------+
| ["a", {"b": [1, false]}, [10, 20, 2]]      |
+--------------------------------------------+
```

Neste caso, o caminho `$[1].b[0]` seleciona um valor existente (`true`), que é substituído pelo valor que segue o argumento do caminho (`1`). O caminho `$[2][2]` não existe, então o valor correspondente (`2`) é adicionado ao valor selecionado por `$[2]`.

`JSON_INSERT()` adiciona novos valores, mas não substitui os valores existentes:

```sql
mysql> SELECT JSON_INSERT(@j, '$[1].b[0]', 1, '$[2][2]', 2);
+-----------------------------------------------+
| JSON_INSERT(@j, '$[1].b[0]', 1, '$[2][2]', 2) |
+-----------------------------------------------+
| ["a", {"b": [true, false]}, [10, 20, 2]]      |
+-----------------------------------------------+
```

`JSON_REPLACE()` substitui os valores existentes e ignora os novos valores:

```sql
mysql> SELECT JSON_REPLACE(@j, '$[1].b[0]', 1, '$[2][2]', 2);
+------------------------------------------------+
| JSON_REPLACE(@j, '$[1].b[0]', 1, '$[2][2]', 2) |
+------------------------------------------------+
| ["a", {"b": [1, false]}, [10, 20]]             |
+------------------------------------------------+
```

Os pares de caminho/valor são avaliados da esquerda para a direita. O documento produzido ao avaliar um par se torna o novo valor contra o qual o próximo par é avaliado.

`JSON_REMOVE()` recebe um documento JSON e uma ou mais caminhos que especificam os valores a serem removidos do documento. O valor de retorno é o documento original, menos os valores selecionados pelos caminhos que existem dentro do documento:

```sql
mysql> SELECT JSON_REMOVE(@j, '$[2]', '$[1].b[1]', '$[1].b[1]');
+---------------------------------------------------+
| JSON_REMOVE(@j, '$[2]', '$[1].b[1]', '$[1].b[1]') |
+---------------------------------------------------+
| ["a", {"b": [true]}]                              |
+---------------------------------------------------+
```

Os caminhos têm esses efeitos:

- `$[2]` corresponde a `[10, 20]` e a remove.

- A primeira instância de `$[1].b[1]` corresponde a `false` no elemento `b` e a remove.

- A segunda instância de `$[1].b[1]` não corresponde a nada: Esse elemento já foi removido, o caminho não existe mais e não tem efeito.

### Sintaxe de caminho JSON

Muitas das funções JSON suportadas pelo MySQL e descritas em outros lugares neste Manual (veja a Seção 12.17, “Funções JSON”) requerem uma expressão de caminho para identificar um elemento específico em um documento JSON. Um caminho consiste no escopo do caminho seguido por uma ou mais pernas do caminho. Para caminhos usados em funções JSON do MySQL, o escopo é sempre o documento que está sendo pesquisado ou operado, representado por um caractere `$` no início. As pernas do caminho são separadas por caracteres de ponto (`.`). As células em arrays são representadas por `[N]`, onde *`N`* é um inteiro não negativo. Os nomes das chaves devem ser cadeias de caracteres duplicadas ou identificadores válidos do ECMAScript (veja `http://www.ecma-international.org/ecma-262/5.1/#sec-7.6`). As expressões de caminho, como o texto JSON, devem ser codificadas usando o conjunto de caracteres `ascii`, `utf8` ou `utf8mb4`. Outras codificações de caracteres são coercidas implicitamente para `utf8mb4`. A sintaxe completa é mostrada aqui:

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

Como mencionado anteriormente, no MySQL, o escopo do caminho é sempre o documento que está sendo operado, representado como `$`. Você pode usar `'$'` como sinônimo do documento em expressões de caminho JSON.

Nota

Algumas implementações suportam referências de coluna para escopos de caminhos JSON; atualmente, o MySQL não suporta essas referências.

Os tokens `*` e `**` são usados da seguinte forma:

- `.*` representa os valores de todos os membros do objeto.

- `[*]` representa os valores de todas as células do array.

- `[prefix]**suffix` representa todos os caminhos que começam com *`prefix`* e terminam com *`suffix`*. *`prefix`* é opcional, enquanto *`suffix`* é obrigatório; em outras palavras, um caminho não pode terminar com `**`.

  Além disso, um caminho não pode conter a sequência `***`.

Para exemplos de sintaxe de caminho, consulte as descrições das várias funções JSON que aceitam caminhos como argumentos, como `JSON_CONTAINS_PATH()`, `JSON_SET()` e `JSON_REPLACE()`. Para exemplos que incluem o uso dos caracteres curingas `*` e `**`, consulte a descrição da função `JSON_SEARCH()`.

### Comparação e ordenação de valores JSON

Os valores JSON podem ser comparados usando os operadores `=`, `<`, `<=`, `>`, `>=`, `<>`, `!=` e `<=>`.

Os seguintes operadores e funções de comparação ainda não são suportados com valores JSON:

- `ENTRE`
- `IN()`
- MAIOR()
- `MENOS MAIORES()`

Uma solução para os operadores e funções de comparação listados acima é converter os valores JSON para um tipo de dados numérico ou de string nativo do MySQL, para que eles tenham um tipo escalar não JSON consistente.

A comparação de valores JSON ocorre em dois níveis. O primeiro nível de comparação é baseado nos tipos JSON dos valores comparados. Se os tipos forem diferentes, o resultado da comparação é determinado exclusivamente pelo tipo que tem precedência maior. Se os dois valores tiverem o mesmo tipo JSON, ocorre um segundo nível de comparação usando regras específicas do tipo.

A lista a seguir mostra as precedências dos tipos JSON, do mais alto para o mais baixo. (Os nomes dos tipos são os retornados pela função `JSON_TYPE()`. Os tipos mostrados juntos em uma linha têm a mesma precedência. Qualquer valor que tenha um tipo JSON listado anteriormente na lista é comparado como maior do que qualquer valor que tenha um tipo JSON listado mais tarde na lista.)

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

Para valores JSON de mesma precedência, as regras de comparação são específicas do tipo:

- `BLOB`

  Os primeiros `N` bytes dos dois valores são comparados, onde `N` é o número de bytes no valor mais curto. Se os primeiros `N` bytes dos dois valores forem idênticos, o valor mais curto é ordenado antes do valor mais longo.

- `BIT`

  As mesmas regras que para `BLOB`.

- `OPAQUE`

  As mesmas regras que para `BLOB`. Os valores `OPAQUE` são valores que não são classificados como um dos outros tipos.

- `DATETIME`

  Um valor que representa um ponto de tempo anterior é ordenado antes de um valor que representa um ponto de tempo posterior. Se dois valores originalmente vierem dos tipos `DATETIME` e `TIMESTAMP` do MySQL, respectivamente, eles são iguais se representarem o mesmo ponto de tempo.

- `TIME`

  O menor dos dois valores de tempo é ordenado antes do maior.

- `DATA`

  A data anterior é ordenada antes da data mais recente.

- `ARRAY`

  Dois arrays JSON são iguais se tiverem o mesmo comprimento e os valores nas posições correspondentes dos arrays forem iguais.

  Se os arrays não forem iguais, sua ordem é determinada pelos elementos na primeira posição onde há uma diferença. O array com o valor menor nessa posição é ordenado primeiro. Se todos os valores do array mais curto forem iguais aos valores correspondentes no array mais longo, o array mais curto é ordenado primeiro.

  Exemplo:

  ```sql
  [] < ["a"] < ["ab"] < ["ab", "cd", "ef"] < ["ab", "ef"]
  ```

- `BOOLEAN`

  O literal JSON falso é menor que o literal JSON verdadeiro.

- `OBJETO`

  Dois objetos JSON são iguais se tiverem o mesmo conjunto de chaves e cada chave tiver o mesmo valor em ambos os objetos.

  Exemplo:

  ```sql
  {"a": 1, "b": 2} = {"b": 2, "a": 1}
  ```

  A ordem de dois objetos que não são iguais é não especificado, mas determinada.

- `STRING`

  As cadeias são ordenadas lexicograficamente nos primeiros *`N`* bytes da representação `utf8mb4` das duas cadeias que estão sendo comparadas, onde *`N`* é a comprimento da cadeia mais curta. Se os primeiros *`N`* bytes das duas cadeias forem idênticos, a cadeia mais curta é considerada menor que a cadeia mais longa.

  Exemplo:

  ```sql
  "a" < "ab" < "b" < "bc"
  ```

  Essa ordenação é equivalente à ordenação de strings SQL com a collation `utf8mb4_bin`. Como `utf8mb4_bin` é uma collation binária, a comparação de valores JSON é sensível ao caso:

  ```sql
  "A" < "a"
  ```

- `INTEIRO`, `DOBLAR`

  Os valores JSON podem conter números de valor exato e números de valor aproximado. Para uma discussão geral sobre esses tipos de números, consulte a Seção 9.1.2, “Literais Numéricos”.

  As regras para comparar tipos numéricos nativos do MySQL são discutidas na Seção 12.3, “Conversão de Tipo na Avaliação de Expressões”, mas as regras para comparar números dentro de valores JSON diferem um pouco:

  - Em uma comparação entre duas colunas que usam os tipos numéricos nativos MySQL `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e `DOUBLE` - FLOAT, DOUBLE"), sabe-se que todas as comparações envolvem um inteiro e um duplo, então o inteiro é convertido para duplo para todas as linhas. Ou seja, os números de valor exato são convertidos em números de valor aproximado.

  - Por outro lado, se a consulta comparar duas colunas JSON que contêm números, não é possível saber antecipadamente se os números são inteiros ou decimais. Para fornecer o comportamento mais consistente em todas as linhas, o MySQL converte números de valor aproximado em números de valor exato. A ordem resultante é consistente e não perde precisão para os números de valor exato. Por exemplo, dados os escalares 9223372036854775805, 9223372036854775806, 9223372036854775807 e 9,223372036854776e18, a ordem é a seguinte:

    ```sql
    9223372036854775805 < 9223372036854775806 < 9223372036854775807
    < 9.223372036854776e18 = 9223372036854776000 < 9223372036854776001
    ```

  Se as comparações JSON usarem as regras de comparação numérica não JSON, pode ocorrer uma ordem inconsistente. As regras de comparação padrão do MySQL para números produzem essas ordens:

  - Comparações numéricas:

    ```sql
    9223372036854775805 < 9223372036854775806 < 9223372036854775807
    ```

    (não definido para 9,223372036854776e18)

  - Comparação dupla:

    ```sql
    9223372036854775805 = 9223372036854775806 = 9223372036854775807 = 9.223372036854776e18
    ```

Para comparação de qualquer valor JSON com `NULL` no SQL, o resultado é `DESCONHECIDO`.

Para a comparação de valores JSON e não JSON, o valor não JSON é convertido para JSON de acordo com as regras da tabela a seguir, e os valores são então comparados conforme descrito anteriormente.

### Conversão entre valores JSON e não JSON

A tabela a seguir fornece um resumo das regras que o MySQL segue ao realizar conversões entre valores JSON e valores de outros tipos:

**Tabela 11.3 Regras de conversão JSON**

<table summary="Regras de conversão para o tipo de dados JSON"><col style="width: 20%"/><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th scope="col">outro tipo</th> <th scope="col">CAST(outro tipo COMO JSON)</th> <th scope="col">CAST(JSON como outro tipo)</th> </tr></thead><tbody><tr> <th scope="row">JSON</th> <td>Sem alterações</td> <td>Sem alterações</td> </tr><tr> <th scope="row">tipo de caractere utf8 ([[PH_HTML_CODE_<code class="literal">ST_GeomFromGeoJSON()</code>], [[PH_HTML_CODE_<code class="literal">ST_GeomFromGeoJSON()</code>], [[<code class="literal">ascii</code>]])</th> <td>A string é analisada em um valor JSON.</td> <td>O valor JSON é serializado em uma string [[<code class="literal">utf8mb4</code>]].</td> </tr><tr> <th scope="row">Outros tipos de personagens</th> <td>Outras codificações de caracteres são implicitamente convertidas para [[<code class="literal">utf8mb4</code>]] e tratadas conforme descrito para o tipo de caractere utf8.</td> <td>O valor JSON é serializado em uma string [[<code class="literal">utf8mb4</code>]] e, em seguida, convertido para outra codificação de caracteres. O resultado pode não ter significado.</td> </tr><tr> <th scope="row">[[<code class="literal">NULL</code>]]</th> <td>O resultado é um valor [[<code class="literal">NULL</code>]] do tipo JSON.</td> <td>Não aplicável.</td> </tr><tr> <th scope="row">Tipos de geometria</th> <td>O valor da geometria é convertido em um documento JSON chamando<a class="link" href="spatial-geojson-functions.html#function_st-asgeojson">[[<code class="literal">ST_AsGeoJSON()</code>]]</a>.</td> <td>Operação ilegal. Solução: Passe o resultado de<a class="link" href="cast-functions.html#function_cast">[[<code class="literal">CAST(<em class="replaceable"><code>json_val</code>]]</em>AS CHAR)</code></a>para<a class="link" href="spatial-geojson-functions.html#function_st-geomfromgeojson">[[<code class="literal">ST_GeomFromGeoJSON()</code>]]</a>.</td> </tr><tr> <th scope="row">Todos os outros tipos</th> <td>O resultado é um documento JSON que consiste em um único valor escalar.</td> <td>É bem-sucedido se o documento JSON contiver um único valor escalar do tipo alvo e se esse valor escalar puder ser convertido para o tipo alvo. Caso contrário, retorna [[<code class="literal">utf8</code><code class="literal">ST_GeomFromGeoJSON()</code>] e gera uma mensagem de aviso.</td> </tr></tbody></table>

O comando `ORDER BY` e `GROUP BY` para valores JSON funcionam de acordo com esses princípios:

- A ordenação de valores JSON escalares segue as mesmas regras da discussão anterior.

- Para ordenações ascendentes, o SQL ordena o `NULL` antes de todos os valores JSON, incluindo o literal `NULL` JSON; para ordenações descendentes, o SQL ordena o `NULL` após todos os valores JSON, incluindo o literal `NULL` JSON.

- As chaves de classificação para os valores JSON são determinadas pelo valor da variável de sistema `max_sort_length`, portanto, as chaves que diferem apenas após os primeiros `max_sort_length` bytes são consideradas iguais.

- O triagem de valores não escalares não é suportada atualmente e um aviso é exibido.

Para a ordenação, pode ser benéfico converter um escalar JSON em outro tipo nativo do MySQL. Por exemplo, se uma coluna chamada `jdoc` contém objetos JSON com um membro que consiste em uma chave `id` e um valor não negativo, use esta expressão para ordenar por valores de `id`:

```sql
ORDER BY CAST(JSON_EXTRACT(jdoc, '$.id') AS UNSIGNED)
```

Se houver uma coluna gerada definida para usar a mesma expressão que na cláusula `ORDER BY`, o otimizador do MySQL reconhece isso e considera o uso do índice para o plano de execução da consulta. Veja a Seção 8.3.10, “Uso do Otimizador de Índices de Colunas Geradas”.

### Agrupamento de Valores JSON

Para a agregação de valores JSON, os valores `NULL` do SQL são ignorados, assim como outros tipos de dados. Os valores que não são `NULL` são convertidos para um tipo numérico e agregados, exceto para `MIN()`, `MAX()` e `GROUP_CONCAT()`. A conversão para número deve produzir um resultado significativo para valores JSON que são escalares numéricos, embora (dependendo dos valores) possa ocorrer truncação e perda de precisão. A conversão para número de outros valores JSON pode não produzir um resultado significativo.
