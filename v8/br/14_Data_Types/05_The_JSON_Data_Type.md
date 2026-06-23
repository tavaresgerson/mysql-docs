## 13.5 O Tipo de Dados JSON

* Criando valores JSON
* Normalização, fusão e autoencapsulamento de valores JSON
* Procurando e modificando valores JSON
* Sintaxe de caminho JSON
* Comparação e ordenação de valores JSON
* Conversão entre valores JSON e não JSON
* Agrupamento de valores JSON

O MySQL suporta um tipo de dados nativo `JSON` (JavaScript Object Notation) definido pelo [RFC 8259][(https://datatracker.ietf.org/doc/html/rfc8259)] que permite o acesso eficiente aos dados em documentos JSON. O tipo de dados `JSON` oferece essas vantagens em relação ao armazenamento de strings no formato JSON em uma coluna de string:

* Validação automática de documentos JSON armazenados nas colunas `JSON`. Documentos inválidos produzem um erro.

* Formato de armazenamento otimizado. Os documentos JSON armazenados nas colunas `JSON` são convertidos em um formato interno que permite acesso rápido de leitura aos elementos do documento. Quando o servidor precisar ler um valor JSON armazenado neste formato binário, o valor não precisa ser analisado a partir de uma representação de texto. O formato binário é estruturado para permitir que o servidor procure subobjetos ou valores aninhados diretamente por chave ou índice de matriz, sem ler todos os valores antes ou depois deles no documento.

O MySQL também suporta o formato *JSON Merge Patch* definido em [RFC 7396][(https://datatracker.ietf.org/doc/html/rfc7396)], usando a função `JSON_MERGE_PATCH()`. Consulte a descrição dessa função, bem como a Normalização, Mesclagem e Autoenrolado de Valores JSON, para exemplos e informações adicionais.

Nota

Essa discussão utiliza `JSON` em monotipo para indicar especificamente o tipo de dados JSON e “JSON” em fonte normal para indicar dados JSON em geral.

O espaço necessário para armazenar um documento `JSON` é aproximadamente o mesmo que para `LONGBLOB` ou `LONGTEXT`; consulte a Seção 13.7, “Requisitos de Armazenamento de Tipo de Dados”, para mais informações. É importante ter em mente que o tamanho de qualquer documento JSON armazenado em uma coluna `JSON` é limitado ao valor da variável de sistema `max_allowed_packet`. (Quando o servidor está manipulando um valor JSON internamente na memória, ele pode ser maior que este; o limite se aplica quando o servidor o armazena.) Você pode obter a quantidade de espaço necessária para armazenar um documento JSON usando a função `JSON_STORAGE_SIZE()`; observe que, para uma coluna `JSON`, o tamanho de armazenamento—e, portanto, o valor retornado por essa função—é o usado pela coluna antes de quaisquer atualizações parciais que possam ter sido realizadas nela (consulte a discussão da otimização da atualização parcial JSON mais adiante nesta seção).

Antes do MySQL 8.0.13, uma coluna `JSON` não pode ter um valor padrão não `NULL`.

Juntamente com o tipo de dados `JSON`, um conjunto de funções SQL está disponível para permitir operações em valores JSON, como criação, manipulação e busca. A discussão a seguir mostra exemplos dessas operações. Para detalhes sobre as funções individuais, consulte a Seção 14.17, “Funções JSON”.

Também está disponível um conjunto de funções espaciais para operar com valores GeoJSON. Consulte a Seção 14.16.11, “Funções GeoJSON Espaciais”.

As colunas `JSON` são, como as colunas de outros tipos binários, não indexadas diretamente; em vez disso, você pode criar um índice em uma coluna gerada que extraia um valor escalar da coluna `JSON`. Consulte Indexação de uma Coluna Gerada para Fornecer um Índice de Coluna JSON, para um exemplo detalhado.

O otimizador do MySQL também procura índices compatíveis em colunas virtuais que correspondem a expressões JSON.

No MySQL 8.0.17 e versões posteriores, o mecanismo de armazenamento `InnoDB` suporta índices de vários valores em arrays JSON. Veja Índices de vários valores.

O MySQL NDB Cluster 8.0 suporta colunas `JSON` e funções JSON do MySQL, incluindo a criação de um índice em uma coluna gerada a partir de uma coluna `JSON` como uma solução para não poder indexar uma coluna `JSON`. É suportada uma quantidade máxima de 3 colunas `JSON` por tabela `NDB`.

### Atualizações Parciais dos Valores JSON

No MySQL 8.0, o otimizador pode realizar uma atualização parcial, em seu lugar, de uma coluna `JSON`, em vez de remover o documento antigo e escrever o novo documento na íntegra na coluna. Essa otimização pode ser realizada para uma atualização que atenda às seguintes condições:

* A coluna que está sendo atualizada foi declarada como `JSON`.

* A declaração `UPDATE` utiliza qualquer uma das três funções `JSON_SET()`, `JSON_REPLACE()` ou `JSON_REMOVE()` para atualizar a coluna. Uma atribuição direta do valor da coluna (por exemplo, `UPDATE mytable SET jcol = '{"a": 10, "b": 25}'`) não pode ser realizada como uma atualização parcial.

As atualizações de múltiplas colunas `JSON` em uma única declaração `UPDATE` podem ser otimizadas dessa maneira; o MySQL pode realizar atualizações parciais apenas das colunas cujos valores são atualizados usando as três funções listadas acima.

* A coluna de entrada e a coluna de destino devem ser a mesma coluna; uma declaração como `UPDATE mytable SET jcol1 = JSON_SET(jcol2, '$.a', 100)` não pode ser realizada como uma atualização parcial.

A atualização pode usar chamadas aninhadas para qualquer uma das funções listadas no item anterior, em qualquer combinação, desde que as colunas de entrada e alvo sejam as mesmas.

* Todas as alterações substituem os valores existentes do array ou objeto por novos, e não adicionam nenhum novo elemento ao objeto ou array pai.

* O valor que está sendo substituído deve ser pelo menos tão grande quanto o valor de substituição. Em outras palavras, o novo valor não pode ser maior que o antigo.

Uma possível exceção a essa exigência ocorre quando uma atualização parcial anterior deixou espaço suficiente para o valor maior. Você pode usar a função `JSON_STORAGE_FREE()` para ver quanto espaço foi liberado por qualquer atualização parcial de uma coluna `JSON`.

Tais atualizações parciais podem ser escritas no log binário usando um formato compacto que economiza espaço; isso pode ser habilitado definindo a variável de sistema `binlog_row_value_options` para `PARTIAL_JSON`.

É importante distinguir a atualização parcial de um valor da coluna `JSON` armazenado em uma tabela da escrita da atualização parcial de uma linha no log binário. É possível que a atualização completa de uma coluna `JSON` seja registrada no log binário como uma atualização parcial. Isso pode acontecer quando uma das duas condições (ou ambas) dos dois últimos itens da lista anterior não for atendida, mas as outras condições forem satisfeitas.

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

Como os exemplos ilustram, os arrays e objetos JSON podem conter valores escalares que são strings ou números, o literal JSON null ou os literais booleanos JSON true ou false. As chaves nos objetos JSON devem ser strings. Valores escalares temporais (data, hora ou datetime) também são permitidos:

```
["12:18:29.000000", "2015-07-29", "2015-07-29 12:18:29.000000"]
```

A nidificação é permitida dentro dos elementos de matriz JSON e nos valores de chave de objetos JSON:

```
[99, {"id": "HK500", "cost": 75.99}, ["hot", "cold"]]
{"k1": "value", "k2": [10, 20]}
```

Você também pode obter valores JSON de várias funções fornecidas pelo MySQL para esse propósito (consulte Seção 14.17.2, “Funções que criam valores JSON”) e também ao converter valores de outros tipos para o tipo `JSON` usando [`CAST(value AS JSON)`](cast-functions.html#function_cast) (consulte Conversão entre valores JSON e não JSON). Os próximos parágrafos descrevem como o MySQL lida com valores JSON fornecidos como entrada.

No MySQL, os valores JSON são escritos como strings. O MySQL analisa qualquer string usada em um contexto que requer um valor JSON e produz um erro se não for válido como JSON. Esses contextos incluem inserir um valor em uma coluna que tem o tipo de dados `JSON` e passar um argumento para uma função que espera um valor JSON (geralmente mostrado como *`json_doc`* ou *`json_val`* na documentação dos funções JSON do MySQL), como os seguintes exemplos demonstram:

* Tentar inserir um valor em uma coluna `JSON` é bem-sucedido se o valor for um valor JSON válido, mas falha se não o for:

  ```
  mysql> CREATE TABLE t1 (jdoc JSON);
  Query OK, 0 rows affected (0.20 sec)

  mysql> INSERT INTO t1 VALUES('{"key1": "value1", "key2": "value2"}');
  Query OK, 1 row affected (0.01 sec)

  mysql> INSERT INTO t1 VALUES('[1, 2,');
  ERROR 3140 (22032) at line 2: Invalid JSON text:
  "Invalid value." at position 6 in value (or column) '[1, 2,'.
  ```

As posições para “na posição *`N`” em mensagens de erro desse tipo são baseadas em 0, mas devem ser consideradas indicações gerais de onde o problema ocorre realmente em um valor.

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

O MySQL lida com strings usadas em contexto JSON usando o conjunto de caracteres `utf8mb4` e a ordenação `utf8mb4_bin`. As strings em outros conjuntos de caracteres são convertidas para `utf8mb4` conforme necessário. (Para strings nos conjuntos de caracteres `ascii` ou `utf8mb3`, não é necessária nenhuma conversão, pois `ascii` e `utf8mb3` são subconjuntos de `utf8mb4`.)

Como alternativa à escrita de valores JSON usando strings literais, existem funções para compor valores JSON a partir de elementos componentes. `JSON_ARRAY()` recebe uma lista (possivelmente vazia) de valores e retorna um array JSON contendo esses valores:

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

Para informações sobre as regras de fusão, consulte Normalização, Fusão e Autoencapsulamento de Valores JSON.

(O MySQL 8.0.3 e versões posteriores também suportam `JSON_MERGE_PATCH()`, que tem um comportamento um pouco diferente. Consulte JSON_MERGE_PATCH() em comparação com JSON_MERGE_PRESERVE() em comparação com JSON_MERGE_PRESERVE()"), para obter informações sobre as diferenças entre essas duas funções.)

Os valores JSON podem ser atribuídos a variáveis definidas pelo usuário:

```
mysql> SET @j = JSON_OBJECT('key', 'value');
mysql> SELECT @j;
+------------------+
| @j               |
+------------------+
| {"key": "value"} |
+------------------+
```

No entanto, as variáveis definidas pelo usuário não podem ser do tipo de dados `JSON`, portanto, embora `@j` no exemplo anterior pareça ser um valor JSON e tenha o mesmo conjunto de caracteres e ordenação de caracteres que um valor JSON, ele *não* tem o tipo de dados `JSON`. Em vez disso, o resultado de `JSON_OBJECT()` é convertido em uma string quando atribuído à variável.

As cadeias produzidas pela conversão de valores JSON têm um conjunto de caracteres de `utf8mb4` e uma ordenação de `utf8mb4_bin`:

```
mysql> SELECT CHARSET(@j), COLLATION(@j);
+-------------+---------------+
| CHARSET(@j) | COLLATION(@j) |
+-------------+---------------+
| utf8mb4     | utf8mb4_bin   |
+-------------+---------------+
```

Como o `utf8mb4_bin` é uma agregação binária, a comparação de valores JSON é sensível ao caso.

```
mysql> SELECT JSON_ARRAY('x') = JSON_ARRAY('X');
+-----------------------------------+
| JSON_ARRAY('x') = JSON_ARRAY('X') |
+-----------------------------------+
|                                 0 |
+-----------------------------------+
```

A sensibilidade ao caso também se aplica aos literais JSON `null`, `true` e `false`, que sempre devem ser escritos em minúsculas:

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

A sensibilidade ao caso das literais JSON difere daquela das literais SQL `NULL`, `TRUE` e `FALSE`, que podem ser escritas em qualquer caso de letra:

```
mysql> SELECT ISNULL(null), ISNULL(Null), ISNULL(NULL);
+--------------+--------------+--------------+
| ISNULL(null) | ISNULL(Null) | ISNULL(NULL) |
+--------------+--------------+--------------+
|            1 |            1 |            1 |
+--------------+--------------+--------------+
```

Às vezes, pode ser necessário ou desejável inserir caracteres de citação (`"` ou `'`) em um documento JSON. Suponha, para este exemplo, que você queira inserir alguns objetos JSON contendo strings que representam frases que afirmam alguns fatos sobre o MySQL, cada uma emparelhada com uma palavra-chave apropriada, em uma tabela criada usando a declaração SQL mostrada aqui:

```
mysql> CREATE TABLE facts (sentence JSON);
```

Entre esses pares de palavras-frases estão os seguintes:

```
mascot: The MySQL mascot is a dolphin named "Sakila".
```

Uma maneira de inserir isso como um objeto JSON na tabela `facts` é usar a função MySQL `JSON_OBJECT()`. Nesse caso, você deve escapar cada caractere de citação usando uma barra invertida, como mostrado aqui:

```
mysql> INSERT INTO facts VALUES
     >   (JSON_OBJECT("mascot", "Our mascot is a dolphin named \"Sakila\"."));
```

Isso não funciona da mesma maneira se você inserir o valor como uma literal de objeto JSON, nesse caso, você deve usar a sequência de escape de barra dupla, assim:

```
mysql> INSERT INTO facts VALUES
     >   ('{"mascot": "Our mascot is a dolphin named \\"Sakila\\"."}');
```

Usar o duplo travessão impede que o MySQL realize o processamento de sequência de escape e, em vez disso, faz com que ele passe o literal de string para o mecanismo de armazenamento para processamento. Após inserir o objeto JSON de qualquer uma das formas mostradas anteriormente, você pode ver que os travessões estão presentes no valor da coluna JSON fazendo um simples `SELECT`, assim:

```
mysql> SELECT sentence FROM facts;
+---------------------------------------------------------+
| sentence                                                |
+---------------------------------------------------------+
| {"mascot": "Our mascot is a dolphin named \"Sakila\"."} |
+---------------------------------------------------------+
```

Para consultar essa frase específica, empregando `mascot` como chave, você pode usar o operador de caminho de coluna `->`, conforme mostrado aqui:

```
mysql> SELECT col->"$.mascot" FROM qtest;
+---------------------------------------------+
| col->"$.mascot"                             |
+---------------------------------------------+
| "Our mascot is a dolphin named \"Sakila\"." |
+---------------------------------------------+
1 row in set (0.00 sec)
```

Isso deixa os traços de retorno intactos, juntamente com as aspas ao redor. Para exibir o valor desejado usando `mascot` como chave, mas sem incluir as aspas ao redor ou quaisquer escapamentos, use o operador de caminho inline `->>`, como este:

```
mysql> SELECT sentence->>"$.mascot" FROM facts;
+-----------------------------------------+
| sentence->>"$.mascot"                   |
+-----------------------------------------+
| Our mascot is a dolphin named "Sakila". |
+-----------------------------------------+
```

Nota

O exemplo anterior não funciona conforme mostrado se o modo SQL do servidor `NO_BACKSLASH_ESCAPES` estiver habilitado. Se esse modo estiver configurado, uma barra invertida única, em vez de duas barras invertidas, pode ser usada para inserir o literal do objeto JSON, e as barras invertidas são preservadas. Se você usar a função `JSON_OBJECT()` ao realizar a inserção e esse modo estiver configurado, você deve alternar entre aspas únicas e duplas, assim:

```
mysql> INSERT INTO facts VALUES
     > (JSON_OBJECT('mascot', 'Our mascot is a dolphin named "Sakila".'));
```

Veja a descrição da função `JSON_UNQUOTE()` para obter mais informações sobre os efeitos desse modo em caracteres escacados em valores JSON.

### Normalização, Fusão e Autoembalamento de Valores JSON

Quando uma string é analisada e descoberta como um documento JSON válido, ela também é normalizada. Isso significa que os membros com chaves que duplicam uma chave encontrada posteriormente no documento, lendo da esquerda para a direita, são descartados. O valor do objeto produzido pelo seguinte `JSON_OBJECT()` inclui apenas o segundo elemento `key1`, porque esse nome de chave ocorre anteriormente no valor, como mostrado aqui:

```
mysql> SELECT JSON_OBJECT('key1', 1, 'key2', 'abc', 'key1', 'def');
+------------------------------------------------------+
| JSON_OBJECT('key1', 1, 'key2', 'abc', 'key1', 'def') |
+------------------------------------------------------+
| {"key1": "def", "key2": "abc"}                       |
+------------------------------------------------------+
```

A normalização também é realizada quando os valores são inseridos em colunas JSON, como mostrado aqui:

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

Esse comportamento de "última chave duplicada ganha" é sugerido pelo [RFC 7159][(https://tools.ietf.org/html/rfc7159)] e é implementado pela maioria dos analisadores de JavaScript. (Bug #86866, Bug #26369555)

Em versões do MySQL anteriores à 8.0.3, os membros com chaves que duplicaram uma chave encontrada anteriormente no documento foram descartados. O valor do objeto produzido pelo seguinte `JSON_OBJECT()` não inclui o segundo elemento `key1` porque esse nome de chave ocorre anteriormente no valor:

```
mysql> SELECT JSON_OBJECT('key1', 1, 'key2', 'abc', 'key1', 'def');
+------------------------------------------------------+
| JSON_OBJECT('key1', 1, 'key2', 'abc', 'key1', 'def') |
+------------------------------------------------------+
| {"key1": 1, "key2": "abc"}                           |
+------------------------------------------------------+
```

Antes do MySQL 8.0.3, essa normalização de "primeiro duplicado vence" também era realizada ao inserir valores em colunas JSON.

```
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

O MySQL também descarta espaços extras entre chaves, valores ou elementos no documento JSON original e, ao exibí-lo, deixa (ou insere, quando necessário) um único espaço após cada vírgula (`,`) ou colon (`:`). Isso é feito para melhorar a legibilidade.

As funções do MySQL que produzem valores JSON (consulte a Seção 14.17.2, “Funções que criam valores JSON”) sempre retornam valores normalizados.

Para tornar as consultas mais eficientes, o MySQL também ordena as chaves de um objeto JSON. *Você deve estar ciente de que o resultado dessa ordenação está sujeito a alterações e não é garantido que seja consistente em todas as versões*.

#### Fusão de valores JSON

Dois algoritmos de fusão são suportados no MySQL 8.0.3 (e posterior), implementados pelas funções `JSON_MERGE_PRESERVE()` e `JSON_MERGE_PATCH()`. Esses diferem na forma como lidam com chaves duplicadas: `JSON_MERGE_PRESERVE()` retém valores para chaves duplicadas, enquanto `JSON_MERGE_PATCH()` descarta todos, exceto o último valor. Os próximos parágrafos explicam como cada uma dessas duas funções lida com a fusão de diferentes combinações de documentos JSON (ou seja, de objetos e arrays).

Nota

`JSON_MERGE_PRESERVE()` é o mesmo que a função `JSON_MERGE()`, encontrada nas versões anteriores do MySQL (renomeada no MySQL 8.0.3). `JSON_MERGE()` ainda é suportada como um alias para `JSON_MERGE_PRESERVE()` no MySQL 8.0, mas é descontinuada e sujeita à remoção em uma versão futura.

**Mesclagem de arrays.** Em contextos que combinam vários arrays, os arrays são mesclados em um único array. `JSON_MERGE_PRESERVE()` faz isso concatenando arrays nomeados posteriormente ao final do primeiro array. `JSON_MERGE_PATCH()` considera cada argumento como um array composto por um único elemento (tendo, assim, 0 como seu índice) e, em seguida, aplica a lógica de "última chave duplicada vence" para selecionar apenas o último argumento. Você pode comparar os resultados mostrados por esta consulta:

```
mysql> SELECT
    ->   JSON_MERGE_PRESERVE('[1, 2]', '["a", "b", "c"]', '[true, false]') AS Preserve,
    ->   JSON_MERGE_PATCH('[1, 2]', '["a", "b", "c"]', '[true, false]') AS Patch\G
*************************** 1. row ***************************
Preserve: [1, 2, "a", "b", "c", true, false]
   Patch: [true, false]
```

Múltiplos objetos quando combinados produzem um único objeto. `JSON_MERGE_PRESERVE()` lida com múltiplos objetos que possuem a mesma chave, combinando todos os valores únicos para essa chave em um array; esse array é então usado como o valor para essa chave no resultado. `JSON_MERGE_PATCH()` descarta os valores para os quais chaves duplicadas são encontradas, trabalhando de esquerda para direita, de modo que o resultado contenha apenas o último valor para essa chave. A consulta a seguir ilustra a diferença nos resultados para a chave duplicada `a`:

```
mysql> SELECT
    ->   JSON_MERGE_PRESERVE('{"a": 1, "b": 2}', '{"c": 3, "a": 4}', '{"c": 5, "d": 3}') AS Preserve,
    ->   JSON_MERGE_PATCH('{"a": 3, "b": 2}', '{"c": 3, "a": 4}', '{"c": 5, "d": 3}') AS Patch\G
*************************** 1. row ***************************
Preserve: {"a": [1, 4], "b": 2, "c": [3, 5], "d": 3}
   Patch: {"a": 4, "b": 2, "c": 5, "d": 3}
```

Os valores não de matriz usados em um contexto que requer um valor de matriz são autoencapsulados: O valor é cercado pelos caracteres `[` e `]` para convertê-lo em uma matriz. Na declaração a seguir, cada argumento é autoencapsulado como uma matriz (`[1]`, `[2]`). Esses são então combinados para produzir uma única matriz de resultado; como nos dois casos anteriores, `JSON_MERGE_PRESERVE()` combina valores com a mesma chave, enquanto `JSON_MERGE_PATCH()` descarta os valores para todas as chaves duplicadas, exceto a última, como mostrado aqui:

```
mysql> SELECT
	  ->   JSON_MERGE_PRESERVE('1', '2') AS Preserve,
	  ->   JSON_MERGE_PATCH('1', '2') AS Patch\G
*************************** 1. row ***************************
Preserve: [1, 2]
   Patch: 2
```

Os valores de matriz e objeto são combinados ao autoenvolver o objeto como uma matriz e combinar as matrizes ao combinar valores ou por "última chave duplicada vence" de acordo com a escolha da função de combinação (`JSON_MERGE_PRESERVE()` ou `JSON_MERGE_PATCH()`, respectivamente), como pode ser visto neste exemplo:

```
mysql> SELECT
	  ->   JSON_MERGE_PRESERVE('[10, 20]', '{"a": "x", "b": "y"}') AS Preserve,
	  ->   JSON_MERGE_PATCH('[10, 20]', '{"a": "x", "b": "y"}') AS Patch\G
*************************** 1. row ***************************
Preserve: [10, 20, {"a": "x", "b": "y"}]
   Patch: {"a": "x", "b": "y"}
```

### Procurando e Modificando Valores JSON

Uma expressão de caminho JSON seleciona um valor dentro de um documento JSON.

As expressões de caminho são úteis com funções que extraem partes de um documento JSON ou o modificam, para especificar onde, dentro desse documento, você deseja operar. Por exemplo, a seguinte consulta extrai do documento JSON o valor do membro com a chave `name`:

```
mysql> SELECT JSON_EXTRACT('{"id": 14, "name": "Aztalan"}', '$.name');
+---------------------------------------------------------+
| JSON_EXTRACT('{"id": 14, "name": "Aztalan"}', '$.name') |
+---------------------------------------------------------+
| "Aztalan"                                               |
+---------------------------------------------------------+
```

A sintaxe de caminho usa o caractere `$` no início para representar o documento JSON em questão, seguido, opcionalmente, por seletores que indicam partes sucessivamente mais específicas do documento:

* Um período seguido por um nome chave nomeia o membro em um objeto com a chave dada. O nome da chave deve ser especificado entre aspas duplas se o nome sem aspas não for legal em expressões de caminho (por exemplo, se ele contém um espaço).

* `[N]` anexado a um *`path`* que seleciona um array que nomeia o valor na posição *`N`* dentro do array. As posições dos arrays são inteiros que começam com zero. Se *`path`* não selecionar um valor do array, *`path`*[0] é avaliado com o mesmo valor que *`path`*:

  ```
  mysql> SELECT JSON_SET('"x"', '$[0]', 'a');
  +------------------------------+
  | JSON_SET('"x"', '$[0]', 'a') |
  +------------------------------+
  | "a"                          |
  +------------------------------+
  1 row in set (0.00 sec)
  ```

* `[M to N]` especifica um subconjunto ou intervalo de valores de matriz que começam com o valor na posição *`M`* e terminam com o valor na posição *`N`*.

`last` é suportado como sinônimo do índice do elemento da matriz mais à direita. O endereçamento relativo dos elementos da matriz também é suportado. Se *`path`* não selecionar um valor da matriz, *`path`*[last] é avaliado com o mesmo valor que *`path`*, conforme mostrado mais adiante nesta seção (ver Elemento da matriz mais à direita).

* Os caminhos podem conter `*` ou `**` wildcards:

+ `.[*]` avalia os valores de todos os membros em um objeto JSON.

+ `[*]` avalia os valores de todos os elementos em um array JSON.

+ `prefix**suffix` avalia todos os caminhos que começam com o prefixo nomeado e terminam com o sufixo nomeado.

* Um caminho que não existe no documento (evalua a dados inexistentes) é avaliado como `NULL`.

Deixe que `$` se refira a este array JSON com três elementos:

```
[3, {"a": [5, 6], "b": 10}, [99, 100]]
```

Então:

* `$[0]` é avaliado para `3`.
* `$[1]` é avaliado para `{"a": [5, 6], "b": 10}`.

* `$[2]` é avaliado para `[99, 100]`.

* `$[3]` é avaliado para `NULL` (se refere ao quarto elemento da matriz, que não existe).

Como `$[1]` e `$[2]` são avaliados a valores não escalares, eles podem ser usados como base para expressões de caminho mais específicas que selecionam valores aninhados. Exemplos:

* `$[1].a` é avaliado para `[5, 6]`.

* `$[1].a[1]` é avaliado para `6`.

* `$[1].b` é avaliado para `10`.

* `$[2][0]` é avaliado para `99`.

Como mencionado anteriormente, os componentes do caminho que nomeiam chaves devem ser citados se o nome da chave não citada não for legal em expressões de caminho. Deixe `$` referir-se a este valor:

```
{"a fish": "shark", "a bird": "sparrow"}
```

As chaves devem conter um espaço e devem ser citadas:

* `$."a fish"` é avaliado para `shark`.

* `$."a bird"` é avaliado para `sparrow`.

Caminhos que usam caracteres curinga são avaliados como um array que pode conter vários valores:

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

No exemplo a seguir, o caminho `$**.b` avalia vários caminhos (`$.a.b` e `$.c.b`) e produz um array dos valores do caminho correspondente:

```
mysql> SELECT JSON_EXTRACT('{"a": {"b": 1}, "c": {"b": 2}}', '$**.b');
+---------------------------------------------------------+
| JSON_EXTRACT('{"a": {"b": 1}, "c": {"b": 2}}', '$**.b') |
+---------------------------------------------------------+
| [1, 2]                                                  |
+---------------------------------------------------------+
```

**Varia de arrays JSON.** Você pode usar intervalos com a palavra-chave `to` para especificar subconjuntos de arrays JSON. Por exemplo, `$[1 to 3]` inclui os segundo, terceiro e quarto elementos de um array, como mostrado aqui:

```
mysql> SELECT JSON_EXTRACT('[1, 2, 3, 4, 5]', '$[1 to 3]');
+----------------------------------------------+
| JSON_EXTRACT('[1, 2, 3, 4, 5]', '$[1 to 3]') |
+----------------------------------------------+
| [2, 3, 4]                                    |
+----------------------------------------------+
1 row in set (0.00 sec)
```

A sintaxe é `M to N`, onde *`M`* e *`N`* são, respectivamente, o primeiro e o último índices de uma faixa de elementos de um array JSON. *`N`* deve ser maior que *`M`*; *`M`* deve ser maior ou igual a 0. Os elementos do array são indexados a partir do índice 0.

Você pode usar intervalos em contextos onde os caracteres curinga são suportados.

Elemento do último elemento da matriz. A palavra-chave `last` é suportada como sinônimo do índice do último elemento de uma matriz. Expressões do tipo `last - N` podem ser usadas para endereçamento relativo e dentro de definições de intervalo, como este:

```
mysql> SELECT JSON_EXTRACT('[1, 2, 3, 4, 5]', '$[last-3 to last-1]');
+--------------------------------------------------------+
| JSON_EXTRACT('[1, 2, 3, 4, 5]', '$[last-3 to last-1]') |
+--------------------------------------------------------+
| [2, 3, 4]                                              |
+--------------------------------------------------------+
1 row in set (0.01 sec)
```

Se o caminho for avaliado contra um valor que não é um array, o resultado da avaliação é o mesmo se o valor tivesse sido envolto em um array de um único elemento:

```
mysql> SELECT JSON_REPLACE('"Sakila"', '$[last]', 10);
+-----------------------------------------+
| JSON_REPLACE('"Sakila"', '$[last]', 10) |
+-----------------------------------------+
| 10                                      |
+-----------------------------------------+
1 row in set (0.00 sec)
```

Você pode usar `column->path` com um identificador de coluna JSON e expressão de caminho JSON como sinônimo de [`JSON_EXTRACT(column, path)`](json-search-functions.html#function_json-extract). Consulte a Seção 14.17.3, “Funções que buscam valores JSON”, para obter mais informações. Veja também Indexação de uma coluna gerada para fornecer um índice de coluna JSON.

Algumas funções recebem um documento JSON existente, modificam-no de alguma forma e retornam o documento modificado resultante. As expressões de caminho indicam onde, no documento, devem ser feitas as alterações. Por exemplo, as funções `JSON_SET()`, `JSON_INSERT()` e `JSON_REPLACE()` recebem um documento JSON, além de uma ou mais pares valor-caminho que descrevem onde modificar o documento e os valores a serem usados. As funções diferem na forma como lidam com valores existentes e não existentes dentro do documento.

Considere este documento:

```
mysql> SET @j = '["a", {"b": [true, false]}, [10, 20]]';
```

`JSON_SET()` substitui valores para caminhos que existem e adiciona valores para caminhos que não existem:

```
mysql> SELECT JSON_SET(@j, '$[1].b[0]', 1, '$[2][2]', 2);
+--------------------------------------------+
| JSON_SET(@j, '$[1].b[0]', 1, '$[2][2]', 2) |
+--------------------------------------------+
| ["a", {"b": [1, false]}, [10, 20, 2]]      |
+--------------------------------------------+
```

Neste caso, o caminho `$[1].b[0]` seleciona um valor existente (`true`), que é substituído pelo valor que segue o argumento do caminho (`1`). O caminho `$[2][2]` não existe, portanto, o valor correspondente (`2`) é adicionado ao valor selecionado por `$[2]`.

`JSON_INSERT()` adiciona novos valores, mas não substitui os valores existentes:

```
mysql> SELECT JSON_INSERT(@j, '$[1].b[0]', 1, '$[2][2]', 2);
+-----------------------------------------------+
| JSON_INSERT(@j, '$[1].b[0]', 1, '$[2][2]', 2) |
+-----------------------------------------------+
| ["a", {"b": [true, false]}, [10, 20, 2]]      |
+-----------------------------------------------+
```

`JSON_REPLACE()` substitui os valores existentes e ignora os novos valores:

```
mysql> SELECT JSON_REPLACE(@j, '$[1].b[0]', 1, '$[2][2]', 2);
+------------------------------------------------+
| JSON_REPLACE(@j, '$[1].b[0]', 1, '$[2][2]', 2) |
+------------------------------------------------+
| ["a", {"b": [1, false]}, [10, 20]]             |
+------------------------------------------------+
```

Os pares de valores de caminho são avaliados da esquerda para a direita. O documento produzido pela avaliação de um par se torna o novo valor contra o qual o próximo par é avaliado.

`JSON_REMOVE()` recebe um documento JSON e um ou mais caminhos que especificam os valores a serem removidos do documento. O valor de retorno é o documento original menos os valores selecionados pelos caminhos que existem dentro do documento:

```
mysql> SELECT JSON_REMOVE(@j, '$[2]', '$[1].b[1]', '$[1].b[1]');
+---------------------------------------------------+
| JSON_REMOVE(@j, '$[2]', '$[1].b[1]', '$[1].b[1]') |
+---------------------------------------------------+
| ["a", {"b": [true]}]                              |
+---------------------------------------------------+
```

Os caminhos têm esses efeitos:

* `$[2]` corresponde a `[10, 20]` e a remove.

* A primeira instância de `$[1].b[1]` corresponde a `false` no elemento `b` e a remove.

* A segunda instância de `$[1].b[1]` não corresponde a nada: Esse elemento já foi removido, o caminho não existe mais e não tem efeito.

### Sintaxe de caminho JSON

Muitas das funções JSON suportadas pelo MySQL e descritas em outros lugares neste Manual (ver Seção 14.17, “Funções JSON”) requerem uma expressão de caminho para identificar um elemento específico em um documento JSON. Um caminho consiste no escopo do caminho seguido por uma ou mais pernas do caminho. Para caminhos usados em funções JSON do MySQL, o escopo é sempre o documento que está sendo pesquisado ou operado de outra forma, representado por um caractere inicial `$`. As pernas do caminho são separadas por caracteres de ponto (`.`). As células em arrays são representadas por `[N]`, onde *`N`* é um inteiro não negativo. Os nomes das chaves devem ser cadeias de caracteres duplicadas ou identificadores válidos do ECMAScript (ver [*Nomes de Identificadores e Identificadores*](http://www.ecma-international.org/ecma-262/5.1/#sec-7.6), na *Especificação da Linguagem ECMAScript*). As expressões de caminho, como texto JSON, devem ser codificadas usando o conjunto de caracteres `ascii`, `utf8mb3`, ou `utf8mb4`. Outras codificações de caracteres são implicitamente coercidas para `utf8mb4`. A sintaxe completa é mostrada aqui:

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

Como mencionado anteriormente, no MySQL, o escopo do caminho é sempre o documento que está sendo operado, representado como `$`. Você pode usar `'$'` como sinônimo do documento em expressões de caminho JSON.

Nota

Algumas implementações suportam referências de coluna para escopos de caminhos JSON; o MySQL 8.0 não suporta essas referências.

Os tokens wildcard `*` e `**` são usados da seguinte forma:

* `.*` representa os valores de todos os membros do objeto.

* `[*]` representa os valores de todas as células do array.

* `[prefix]**suffix` representa todos os caminhos que começam com *`prefix`* e terminam com *`suffix`*. *`prefix`* é opcional, enquanto *`suffix`* é obrigatório; em outras palavras, um caminho não pode terminar em `**`.

Além disso, um caminho não pode conter a sequência `***`.

Para exemplos de sintaxe de caminho, consulte as descrições das várias funções JSON que aceitam caminhos como argumentos, como `JSON_CONTAINS_PATH()`, `JSON_SET()` e `JSON_REPLACE()`. Para exemplos que incluem o uso dos caracteres curinga `*` e `**`, consulte a descrição da função `JSON_SEARCH()`.

O MySQL 8.0 também suporta notação de intervalo para subconjuntos de arrays JSON usando a palavra-chave `to` (como `$[2 to 10]`) e a palavra-chave `last` como sinônimo do elemento mais à direita de um array. Consulte Procurando e modificando valores de JSON, para obter mais informações e exemplos.

### Comparação e Ordenação de Valores JSON

Os valores do JSON podem ser comparados usando os operadores `=`, `<`, `<=`, `>`, `>=`, `<>`, `!=` e `<=>`.

Os seguintes operadores e funções de comparação ainda não são suportados com valores JSON:

* `BETWEEN`
* `IN()`
* `GREATEST()`
* `LEAST()`

Uma solução para os operadores e funções de comparação listados acima é converter os valores JSON em um tipo de dados numérico ou de cadeia nativa do MySQL, para que eles tenham um tipo escalar consistente que não seja JSON.

A comparação de valores JSON ocorre em dois níveis. O primeiro nível de comparação é baseado nos tipos JSON dos valores comparados. Se os tipos diferirem, o resultado da comparação é determinado exclusivamente pelo tipo que tem precedência maior. Se os dois valores tiverem o mesmo tipo JSON, ocorre um segundo nível de comparação usando regras específicas do tipo.

A lista a seguir mostra as precedências dos tipos JSON, da precedência mais alta para a mais baixa. (Os nomes dos tipos são aqueles retornados pela função `JSON_TYPE()`. Os tipos mostrados juntos em uma linha têm a mesma precedência. Qualquer valor que tenha um tipo JSON listado anteriormente na lista é comparado a qualquer valor que tenha um tipo JSON listado mais tarde na lista.

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

Para valores JSON de mesma precedência, as regras de comparação são específicas do tipo:

* `BLOB`

Os primeiros *`N`* bytes dos dois valores são comparados, onde *`N`* é o número de bytes no valor mais curto. Se os primeiros *`N`* bytes dos dois valores forem idênticos, o valor mais curto é ordenado antes do valor mais longo.

* `BIT`

As mesmas regras que para `BLOB`.

* `OPAQUE`

As mesmas regras que para `BLOB`. Os valores de `OPAQUE` são valores que não são classificados como um dos outros tipos.

* `DATETIME`

Um valor que representa um ponto de tempo anterior é ordenado antes de um valor que representa um ponto de tempo posterior. Se dois valores originalmente vêm dos tipos MySQL `DATETIME` e `TIMESTAMP`, respectivamente, eles são iguais se representam o mesmo ponto de tempo.

* `TIME`

O menor dos dois valores de tempo é ordenado antes do maior.

* `DATE`

A data anterior é ordenada antes da data mais recente.

* `ARRAY`

Dois arrays JSON são iguais se tiverem o mesmo comprimento e os valores nas posições correspondentes nos arrays forem iguais.

Se os arrays não forem iguais, sua ordem é determinada pelos elementos na primeira posição onde há uma diferença. O array com o menor valor nessa posição é ordenado primeiro. Se todos os valores do array mais curto forem iguais aos valores correspondentes no array mais longo, o array mais curto é ordenado primeiro.

Exemplo:

  ```
  [] < ["a"] < ["ab"] < ["ab", "cd", "ef"] < ["ab", "ef"]
  ```

* `BOOLEAN`

O literal JSON falso é menor que o literal JSON verdadeiro.

* `OBJECT`

Dois objetos JSON são iguais se tiverem o mesmo conjunto de chaves, e cada chave tiver o mesmo valor em ambos os objetos.

Exemplo:

  ```
  {"a": 1, "b": 2} = {"b": 2, "a": 1}
  ```

A ordem de dois objetos que não são iguais é não especificado, mas determinada.

* `STRING`

As cadeias são ordenadas lexicograficamente nos primeiros *`N`* bytes da representação `utf8mb4` das duas cadeias que estão sendo comparadas, onde *`N`* é o comprimento da cadeia mais curta. Se os primeiros *`N`* bytes das duas cadeias forem idênticos, a cadeia mais curta é considerada menor que a cadeia mais longa.

Exemplo:

  ```
  "a" < "ab" < "b" < "bc"
  ```

Essa ordenação é equivalente à ordenação de strings SQL com a collation `utf8mb4_bin`. Como `utf8mb4_bin` é uma collation binária, a comparação de valores JSON é sensível ao caso:

  ```
  "A" < "a"
  ```

* `INTEGER`, `DOUBLE`

Os valores JSON podem conter números com valor exato e números com valor aproximado. Para uma discussão geral sobre esses tipos de números, consulte a Seção 11.1.2, “Literais Numéricos”.

As regras para comparar tipos numéricos nativos do MySQL são discutidas na Seção 14.3, “Conversão de Tipo na Avaliação de Expressões”, mas as regras para comparar números dentro dos valores JSON diferem um pouco:

Em uma comparação entre duas colunas que utilizam os tipos numéricos nativos MySQL `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e `DOUBLE` - FLOAT, DOUBLE", respectivamente, é sabido que todas as comparações envolvem um inteiro e um duplo, então o inteiro é convertido para duplo para todas as linhas. Isso significa que os números de valor exato são convertidos em números de valor aproximado.

+ Por outro lado, se a consulta comparar duas colunas JSON que contêm números, não pode ser conhecido antecipadamente se os números são inteiros ou decimais. Para fornecer o comportamento mais consistente em todas as linhas, o MySQL converte números de valor aproximado em números de valor exato. A ordem resultante é consistente e não perde precisão para os números de valor exato. Por exemplo, dados os escalares 9223372036854775805, 9223372036854775806, 9223372036854775807 e 9,223372036854776e18, a ordem é a seguinte:

    ```
    9223372036854775805 < 9223372036854775806 < 9223372036854775807
    < 9.223372036854776e18 = 9223372036854776000 < 9223372036854776001
    ```

Se as comparações JSON usarem as regras de comparação numérica não JSON, pode ocorrer uma ordem inconsistente. As regras de comparação normais do MySQL para números produzem essas ordens:

+ Comparação de números inteiros:

    ```
    9223372036854775805 < 9223372036854775806 < 9223372036854775807
    ```

(não definido para 9,223372036854776e18)

+ Dupla comparação:

    ```
    9223372036854775805 = 9223372036854775806 = 9223372036854775807 = 9.223372036854776e18
    ```

Para a comparação de qualquer valor JSON com o SQL `NULL`, o resultado é `UNKNOWN`.

Para a comparação de valores JSON e não JSON, o valor não JSON é convertido para JSON de acordo com as regras da tabela a seguir, e os valores são então comparados conforme descrito anteriormente.

### Converte entre valores JSON e não JSON

A tabela a seguir fornece um resumo das regras que o MySQL segue ao realizar conversões entre valores JSON e valores de outros tipos:

**Tabela 13.3 Regras de conversão JSON**

<table summary="Conversion rules for the JSON data type"><col style="width: 20%"/><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th scope="col">outro tipo</th> <th scope="col">CAST(outro tipo COMO JSON)</th> <th scope="col">CAST(JSON AS outro tipo)</th> </tr></thead><tbody><tr> <th scope="row">JSON</th> <td>No change</td> <td>No change</td> </tr><tr> <th scope="row">tipo de caractere utf8 (<code>utf8mb4</code>,<code>utf8mb3</code>,<code>ascii</code>)</th> <td>A cadeia é analisada em um valor JSON.</td> <td>O valor JSON é serializado em um<code>utf8mb4</code> string.</td> </tr><tr> <th scope="row">Outros tipos de personagens</th> <td>Outras codificações de caracteres são implicitamente convertidas em<code>utf8mb4</code>e tratada conforme descrito para este tipo de personagem.</td> <td>O valor JSON é serializado em um<code>utf8mb4</code>string, e então convertido para o outro tipo de codificação de caracteres. O resultado pode não ser significativo.</td> </tr><tr> <th scope="row"><code>NULL</code></th> <td>Resulta em<code>NULL</code>valor do tipo JSON.</td> <td>Não aplicável.</td> </tr><tr> <th scope="row">Tipos de geometria</th> <td>O valor da geometria é convertido em um documento JSON chamando<code>ST_AsGeoJSON()</code>.</td> <td>Operação ilegal. Solução: Passe o resultado de<a class="link" href="cast-functions.html#function_cast"><code>CAST(<em class="replaceable"><code>json_val</code></em> AS CHAR)</code></a>para<code>ST_GeomFromGeoJSON()</code>.</td> </tr><tr> <th scope="row">Todos os outros tipos</th> <td>Resulta em um documento JSON que consiste em um único valor escalar.</td> <td>É bem-sucedida se o documento JSON consiste em um único valor escalar do tipo alvo e esse valor escalar pode ser convertido para o tipo alvo. Caso contrário, retorna<code>NULL</code>e produz um aviso.</td> </tr></tbody></table>

`ORDER BY` e `GROUP BY` para valores JSON funcionam de acordo com esses princípios:

* A ordenação de valores JSON escalares utiliza as mesmas regras que na discussão anterior.

* Para ordenações ascendentes, o SQL `NULL` ordena antes de todos os valores JSON, incluindo o literal JSON nulo; para ordenações descendentes, o SQL `NULL` ordena após todos os valores JSON, incluindo o literal JSON nulo.

* As chaves para valores JSON são vinculadas pelo valor da variável de sistema `max_sort_length`, portanto, as chaves que diferem apenas após os primeiros bytes `max_sort_length` são consideradas iguais.

* O mapeamento de valores não escalares não é atualmente suportado e um aviso é exibido.

Para a classificação, pode ser benéfico converter um escalar JSON em algum outro tipo nativo do MySQL. Por exemplo, se uma coluna denominada `jdoc` contém objetos JSON com um membro composto por uma chave `id` e um valor não negativo, use esta expressão para classificar pelos valores de `id`:

```
ORDER BY CAST(JSON_EXTRACT(jdoc, '$.id') AS UNSIGNED)
```

Se houver uma coluna gerada definida para usar a mesma expressão que no `ORDER BY`, o otimizador do MySQL reconhece isso e considera o uso do índice para o plano de execução da consulta. Veja a Seção 10.3.11, “Uso do otimizador de índices de colunas geradas”.

### Agregação de Valores JSON

Para a agregação de valores JSON, os valores do SQL `NULL` são ignorados, assim como outros tipos de dados. Os valores que não são `NULL` são convertidos em um tipo numérico e agregados, exceto para `MIN()`, `MAX()` e `GROUP_CONCAT()`. A conversão em número deve produzir um resultado significativo para valores JSON que são escalares numéricos, embora (dependendo dos valores) possa ocorrer o corte e a perda de precisão. A conversão em número de outros valores JSON pode não produzir um resultado significativo.