## 13.5 Tipo de dados JSON

- Criando Valores JSON
- Normalização, fusão e autoembalagem de valores JSON
- Procurando e modificando valores JSON
- Sintaxe de caminho JSON
- Comparação e ordenação de valores JSON
- Conversão entre valores JSON e não JSON
- Agrupamento de Valores JSON

O MySQL suporta um tipo de dados nativo `JSON` (Notação de Objeto JavaScript) definido pelo RFC 8259 que permite o acesso eficiente aos dados em documentos JSON. O tipo de dados `JSON` oferece essas vantagens em relação ao armazenamento de strings no formato JSON em uma coluna de string:

- Validação automática de documentos JSON armazenados nas colunas `JSON`. Documentos inválidos produzem um erro.

- Formato de armazenamento otimizado. Os documentos JSON armazenados nas colunas `JSON` são convertidos para um formato interno que permite acesso rápido de leitura aos elementos do documento. Quando o servidor precisar ler um valor JSON armazenado nesse formato binário, o valor não precisa ser analisado a partir de uma representação de texto. O formato binário é estruturado para permitir que o servidor procure subobjetos ou valores aninhados diretamente por chave ou índice de array, sem precisar ler todos os valores antes ou depois deles no documento.

O MySQL também suporta o formato *JSON Merge Patch* definido no RFC 7396, usando a função `JSON_MERGE_PATCH()`. Veja a descrição dessa função, bem como a Normalização, Fusão e Autoenrolagem de Valores JSON, para exemplos e informações adicionais.

Nota

Essa discussão usa `JSON` em monotipo para indicar especificamente o tipo de dado JSON e “JSON” em fonte regular para indicar dados JSON em geral.

O espaço necessário para armazenar um documento `JSON` é aproximadamente o mesmo que para `LONGBLOB` ou `LONGTEXT`; consulte a Seção 13.7, “Requisitos de Armazenamento de Tipos de Dados”, para obter mais informações. É importante ter em mente que o tamanho de qualquer documento JSON armazenado em uma coluna `JSON` é limitado ao valor da variável de sistema `max_allowed_packet`. (Quando o servidor está manipulando um valor JSON internamente na memória, ele pode ser maior que este; o limite se aplica quando o servidor o armazena.) Você pode obter a quantidade de espaço necessária para armazenar um documento JSON usando a função `JSON_STORAGE_SIZE()`; observe que, para uma coluna `JSON`, o tamanho de armazenamento — e, portanto, o valor retornado por essa função — é o usado pela coluna antes de quaisquer atualizações parciais que possam ter sido realizadas nela (consulte a discussão sobre a otimização da atualização parcial JSON mais adiante nesta seção).

Antes do MySQL 8.0.13, uma coluna `JSON` não pode ter um valor padrão que não seja `NULL`.

Juntamente com o tipo de dados `JSON`, está disponível um conjunto de funções SQL para permitir operações em valores JSON, como criação, manipulação e busca. A discussão a seguir mostra exemplos dessas operações. Para obter detalhes sobre as funções individuais, consulte a Seção 14.17, “Funções JSON”.

Também está disponível um conjunto de funções espaciais para operar com valores GeoJSON. Consulte a Seção 14.16.11, “Funções GeoJSON Espaciais”.

Colunas `JSON` não são indexadas diretamente, assim como as colunas de outros tipos binários. Em vez disso, você pode criar um índice em uma coluna gerada que extrai um valor escalar da coluna `JSON`. Veja Como criar um índice de coluna JSON para fornecer um índice de coluna JSON, para um exemplo detalhado.

O otimizador do MySQL também procura por índices compatíveis em colunas virtuais que correspondem a expressões JSON.

No MySQL 8.0.17 e versões posteriores, o mecanismo de armazenamento `InnoDB` suporta índices de múltiplos valores em arrays JSON. Veja Índices de Múltiplos Valores.

O MySQL NDB Cluster 8.0 suporta colunas `JSON` e funções JSON do MySQL, incluindo a criação de um índice em uma coluna gerada a partir de uma coluna `JSON` como uma solução para a incapacidade de indexar uma coluna `JSON`. É suportado um máximo de 3 colunas `JSON` por tabela `NDB`.

### Atualizações Parciais de Valores JSON

No MySQL 8.0, o otimizador pode realizar uma atualização parcial, in-place, de uma coluna `JSON` em vez de remover o documento antigo e escrever o novo documento na íntegra na coluna. Essa otimização pode ser realizada para uma atualização que atenda às seguintes condições:

- A coluna que está sendo atualizada foi declarada como `JSON`.

- A declaração `UPDATE` usa qualquer uma das três funções `JSON_SET()`, `JSON_REPLACE()` ou `JSON_REMOVE()` para atualizar a coluna. Uma atribuição direta do valor da coluna (por exemplo, `UPDATE mytable SET jcol = '{"a": 10, "b": 25}'`) não pode ser realizada como uma atualização parcial.

  As atualizações de várias colunas `JSON` em uma única instrução `UPDATE` podem ser otimizadas dessa maneira; o MySQL pode realizar atualizações parciais apenas das colunas cujos valores são atualizados usando as três funções listadas acima.

- A coluna de entrada e a coluna de destino devem ser a mesma coluna; uma declaração como `UPDATE mytable SET jcol1 = JSON_SET(jcol2, '$.a', 100)` não pode ser realizada como uma atualização parcial.

  A atualização pode usar chamadas aninhadas a qualquer uma das funções listadas no item anterior, em qualquer combinação, desde que as colunas de entrada e destino sejam as mesmas.

- Todas as alterações substituem os valores existentes de arrays ou objetos por novos e não adicionam nenhum novo elemento ao objeto ou array pai.

- O valor que está sendo substituído deve ser pelo menos tão grande quanto o valor de substituição. Em outras palavras, o novo valor não pode ser maior que o antigo.

  Uma possível exceção a essa exigência ocorre quando uma atualização parcial anterior deixou espaço suficiente para o valor maior. Você pode usar a função `JSON_STORAGE_FREE()` para ver quanto espaço foi liberado por quaisquer atualizações parciais de uma coluna `JSON`.

Tais atualizações parciais podem ser escritas no log binário usando um formato compacto que economiza espaço; isso pode ser habilitado definindo a variável de sistema `binlog_row_value_options` para `PARTIAL_JSON`.

É importante distinguir a atualização parcial de um valor da coluna `JSON` armazenado em uma tabela da escrita da atualização parcial de uma linha no log binário. É possível que a atualização completa de uma coluna `JSON` seja registrada no log binário como uma atualização parcial. Isso pode acontecer quando uma das duas condições (ou ambas) das duas últimas condições da lista anterior não for atendida, mas as outras condições forem satisfeitas.

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

A nidificação é permitida dentro dos elementos de arrays JSON e valores de chaves de objetos JSON:

```
[99, {"id": "HK500", "cost": 75.99}, ["hot", "cold"]]
{"k1": "value", "k2": [10, 20]}
```

Você também pode obter valores JSON a partir de várias funções fornecidas pelo MySQL para esse propósito (veja a Seção 14.17.2, “Funções que criam valores JSON”) e também ao converter valores de outros tipos para o tipo `JSON` usando `CAST(value AS JSON)` (veja Conversão entre valores JSON e não JSON). Os próximos parágrafos descrevem como o MySQL lida com valores JSON fornecidos como entrada.

No MySQL, os valores JSON são escritos como strings. O MySQL analisa qualquer string usada em um contexto que requer um valor JSON e produz um erro se não for válido como JSON. Esses contextos incluem inserir um valor em uma coluna que tem o tipo de dados `JSON` e passar um argumento para uma função que espera um valor JSON (geralmente mostrado como `json_doc` ou `json_val` na documentação das funções JSON do MySQL), como os seguintes exemplos demonstram:

- Tentar inserir um valor em uma coluna `JSON` terá sucesso se o valor for um valor JSON válido, mas falhará se não for:

  ```
  mysql> CREATE TABLE t1 (jdoc JSON);
  Query OK, 0 rows affected (0.20 sec)

  mysql> INSERT INTO t1 VALUES('{"key1": "value1", "key2": "value2"}');
  Query OK, 1 row affected (0.01 sec)

  mysql> INSERT INTO t1 VALUES('[1, 2,');
  ERROR 3140 (22032) at line 2: Invalid JSON text:
  "Invalid value." at position 6 in value (or column) '[1, 2,'.
  ```

  As posições para “na posição `N`” nessas mensagens de erro são baseadas em 0, mas devem ser consideradas indicações gerais de onde o problema em um valor realmente ocorre.

- A função `JSON_TYPE()` espera um argumento JSON e tenta analisá-lo em um valor JSON. Ela retorna o tipo JSON do valor se ele for válido e produz um erro caso contrário:

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

O MySQL lida com strings usadas em contexto JSON usando o conjunto de caracteres `utf8mb4` e a ordenação `utf8mb4_bin`. As strings em outros conjuntos de caracteres são convertidas para `utf8mb4` conforme necessário. (Para strings em conjuntos de caracteres `ascii` ou `utf8mb3`, nenhuma conversão é necessária, pois `ascii` e `utf8mb3` são subconjuntos de `utf8mb4`.)

Como alternativa para escrever valores JSON usando strings literais, existem funções para compor valores JSON a partir de elementos componentes. `JSON_ARRAY()` recebe uma lista (possívelmente vazia) de valores e retorna um array JSON contendo esses valores:

```
mysql> SELECT JSON_ARRAY('a', 1, NOW());
+----------------------------------------+
| JSON_ARRAY('a', 1, NOW())              |
+----------------------------------------+
| ["a", 1, "2015-07-27 09:43:47.000000"] |
+----------------------------------------+
```

`JSON_OBJECT()` recebe uma lista (possívelmente vazia) de pares chave-valor e retorna um objeto JSON contendo esses pares:

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

Para obter informações sobre as regras de fusão, consulte Normalização, Fusão e Autoenquadramento de Valores JSON.

(O MySQL 8.0.3 e versões posteriores também suportam `JSON_MERGE_PATCH()`, que tem um comportamento um pouco diferente. Veja JSON\_MERGE\_PATCH() em comparação com JSON\_MERGE\_PRESERVE() em comparação com JSON\_MERGE\_PRESERVE()"), para obter informações sobre as diferenças entre essas duas funções.)

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

No entanto, as variáveis definidas pelo usuário não podem ser do tipo de dados `JSON`, então, embora `@j` no exemplo anterior pareça um valor JSON e tenha o mesmo conjunto de caracteres e ordenação que um valor JSON, ele *não* tem o tipo de dados `JSON`. Em vez disso, o resultado de `JSON_OBJECT()` é convertido em uma string quando atribuído à variável.

As cadeias produzidas pela conversão de valores JSON têm um conjunto de caracteres de `utf8mb4` e uma ordenação de `utf8mb4_bin`:

```
mysql> SELECT CHARSET(@j), COLLATION(@j);
+-------------+---------------+
| CHARSET(@j) | COLLATION(@j) |
+-------------+---------------+
| utf8mb4     | utf8mb4_bin   |
+-------------+---------------+
```

Como o `utf8mb4_bin` é uma ordenação binária, a comparação de valores JSON é sensível ao caso.

```
mysql> SELECT JSON_ARRAY('x') = JSON_ARRAY('X');
+-----------------------------------+
| JSON_ARRAY('x') = JSON_ARRAY('X') |
+-----------------------------------+
|                                 0 |
+-----------------------------------+
```

A sensibilidade à grafia maiúscula ou minúscula também se aplica aos literais JSON `null`, `true` e `false`, que devem ser sempre escritos em minúsculas:

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

A sensibilidade à grafia maiúscula ou minúscula dos literais JSON difere da dos literais SQL `NULL`, `TRUE` e `FALSE`, que podem ser escritos em qualquer caso de grafia:

```
mysql> SELECT ISNULL(null), ISNULL(Null), ISNULL(NULL);
+--------------+--------------+--------------+
| ISNULL(null) | ISNULL(Null) | ISNULL(NULL) |
+--------------+--------------+--------------+
|            1 |            1 |            1 |
+--------------+--------------+--------------+
```

Às vezes, pode ser necessário ou desejável inserir caracteres de citação (`"` ou `'`) em um documento JSON. Suponha, para este exemplo, que você queira inserir alguns objetos JSON contendo strings que representam frases que afirmam alguns fatos sobre o MySQL, cada uma emparelhada com uma palavra-chave apropriada, em uma tabela criada usando a instrução SQL mostrada aqui:

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

Isso não funciona da mesma maneira se você inserir o valor como um literal de objeto JSON, nesse caso, você deve usar a sequência de escape de barra dupla, assim:

```
mysql> INSERT INTO facts VALUES
     >   ('{"mascot": "Our mascot is a dolphin named \\"Sakila\\"."}');
```

Usar o duplo aspas impede que o MySQL processe sequências de escape e, em vez disso, faz com que ele passe o literal de string para o mecanismo de armazenamento para processamento. Após inserir o objeto JSON de qualquer das maneiras mostradas anteriormente, você pode ver que os aspas estão presentes no valor da coluna JSON fazendo um simples `SELECT`, assim:

```
mysql> SELECT sentence FROM facts;
+---------------------------------------------------------+
| sentence                                                |
+---------------------------------------------------------+
| {"mascot": "Our mascot is a dolphin named \"Sakila\"."} |
+---------------------------------------------------------+
```

Para consultar essa frase específica usando `mascot` como chave, você pode usar o operador de caminho de coluna `->`, como mostrado aqui:

```
mysql> SELECT col->"$.mascot" FROM qtest;
+---------------------------------------------+
| col->"$.mascot"                             |
+---------------------------------------------+
| "Our mascot is a dolphin named \"Sakila\"." |
+---------------------------------------------+
1 row in set (0.00 sec)
```

Isso deixa os backslashes intactos, juntamente com as aspas ao redor. Para exibir o valor desejado usando `mascot` como chave, mas sem incluir as aspas ao redor ou quaisquer escapamentos, use o operador de caminho inline `->>`, assim:

```
mysql> SELECT sentence->>"$.mascot" FROM facts;
+-----------------------------------------+
| sentence->>"$.mascot"                   |
+-----------------------------------------+
| Our mascot is a dolphin named "Sakila". |
+-----------------------------------------+
```

Nota

O exemplo anterior não funciona conforme mostrado se o modo SQL do servidor `NO_BACKSLASH_ESCAPES` estiver habilitado. Se esse modo estiver configurado, uma barra invertida simples, em vez de duas barras invertidas, pode ser usada para inserir o literal do objeto JSON, e as barras invertidas são preservadas. Se você usar a função `JSON_OBJECT()` ao realizar a inserção e esse modo estiver configurado, você deve alternar entre aspas simples e duplas, assim:

```
mysql> INSERT INTO facts VALUES
     > (JSON_OBJECT('mascot', 'Our mascot is a dolphin named "Sakila".'));
```

Consulte a descrição da função `JSON_UNQUOTE()` para obter mais informações sobre os efeitos deste modo em caracteres escavados em valores JSON.

### Normalização, fusão e autoembalagem de valores JSON

Quando uma string é analisada e descoberta como um documento JSON válido, ela também é normalizada. Isso significa que os membros com chaves que duplicam uma chave encontrada mais tarde no documento, lendo da esquerda para a direita, são descartados. O valor do objeto produzido pelo seguinte chamado `JSON_OBJECT()` inclui apenas o segundo elemento `key1`, porque esse nome de chave ocorre mais cedo no valor, como mostrado aqui:

```
mysql> SELECT JSON_OBJECT('key1', 1, 'key2', 'abc', 'key1', 'def');
+------------------------------------------------------+
| JSON_OBJECT('key1', 1, 'key2', 'abc', 'key1', 'def') |
+------------------------------------------------------+
| {"key1": "def", "key2": "abc"}                       |
+------------------------------------------------------+
```

A normalização também é realizada quando os valores são inseridos nas colunas do JSON, como mostrado aqui:

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

Esse comportamento de "última chave duplicada vence" é sugerido pelo RFC 7159 e é implementado pela maioria dos analisadores de JavaScript. (Bug #86866, Bug #26369555)

Em versões do MySQL anteriores à 8.0.3, os membros com chaves que duplicavam uma chave encontrada anteriormente no documento eram descartados. O valor do objeto produzido pela chamada `JSON_OBJECT()` a seguir não inclui o segundo elemento `key1`, porque esse nome de chave ocorre anteriormente no valor:

```
mysql> SELECT JSON_OBJECT('key1', 1, 'key2', 'abc', 'key1', 'def');
+------------------------------------------------------+
| JSON_OBJECT('key1', 1, 'key2', 'abc', 'key1', 'def') |
+------------------------------------------------------+
| {"key1": 1, "key2": "abc"}                           |
+------------------------------------------------------+
```

Antes do MySQL 8.0.3, essa normalização "o primeiro duplicado vence" também era realizada ao inserir valores em colunas JSON.

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

O MySQL também descarta espaços extras entre chaves, valores ou elementos no documento JSON original e deixa (ou insere, quando necessário) um único espaço após cada vírgula (`,`) ou dois-pontos (`:`) ao exibí-lo. Isso é feito para melhorar a legibilidade.

As funções do MySQL que produzem valores JSON (consulte a Seção 14.17.2, “Funções que criam valores JSON”) sempre retornam valores normalizados.

Para tornar as consultas mais eficientes, o MySQL também ordena as chaves de um objeto JSON. *Você deve estar ciente de que o resultado dessa ordenação pode mudar e não é garantido que seja consistente em todas as versões*.

#### Mesclando valores JSON

Dois algoritmos de fusão são suportados no MySQL 8.0.3 (e versões posteriores), implementados pelas funções `JSON_MERGE_PRESERVE()` e `JSON_MERGE_PATCH()`. Esses algoritmos diferem na forma como lidam com chaves duplicadas: `JSON_MERGE_PRESERVE()` retém os valores para chaves duplicadas, enquanto `JSON_MERGE_PATCH()` descarta todos, exceto o último valor. Os próximos parágrafos explicam como cada uma dessas duas funções lida com a fusão de diferentes combinações de documentos JSON (ou seja, de objetos e arrays).

Nota

`JSON_MERGE_PRESERVE()` é o mesmo que a função `JSON_MERGE()` encontrada nas versões anteriores do MySQL (renomeada no MySQL 8.0.3). `JSON_MERGE()` ainda é suportado como um alias para `JSON_MERGE_PRESERVE()` no MySQL 8.0, mas é desaconselhado e sujeito à remoção em uma futura versão.

**Mesclagem de matrizes.** Em contextos que combinam múltiplas matrizes, as matrizes são mescladas em uma única matriz. `JSON_MERGE_PRESERVE()` faz isso concatenando matrizes nomeadas posteriormente ao final da primeira matriz. `JSON_MERGE_PATCH()` considera cada argumento como uma matriz composta por um único elemento (tendo assim 0 como seu índice) e, em seguida, aplica a lógica "a chave duplicada mais recente vence" para selecionar apenas o último argumento. Você pode comparar os resultados mostrados por essa consulta:

```
mysql> SELECT
    ->   JSON_MERGE_PRESERVE('[1, 2]', '["a", "b", "c"]', '[true, false]') AS Preserve,
    ->   JSON_MERGE_PATCH('[1, 2]', '["a", "b", "c"]', '[true, false]') AS Patch\G
*************************** 1. row ***************************
Preserve: [1, 2, "a", "b", "c", true, false]
   Patch: [true, false]
```

Quando vários objetos são combinados, um único objeto é criado. O `JSON_MERGE_PRESERVE()` lida com vários objetos que possuem a mesma chave, combinando todos os valores únicos dessa chave em um array; esse array é então usado como o valor para essa chave no resultado. O `JSON_MERGE_PATCH()` descarta os valores para os quais chaves duplicadas são encontradas, trabalhando da esquerda para a direita, de modo que o resultado contenha apenas o último valor para essa chave. A consulta a seguir ilustra a diferença nos resultados para a chave duplicada `a`:

```
mysql> SELECT
    ->   JSON_MERGE_PRESERVE('{"a": 1, "b": 2}', '{"c": 3, "a": 4}', '{"c": 5, "d": 3}') AS Preserve,
    ->   JSON_MERGE_PATCH('{"a": 3, "b": 2}', '{"c": 3, "a": 4}', '{"c": 5, "d": 3}') AS Patch\G
*************************** 1. row ***************************
Preserve: {"a": [1, 4], "b": 2, "c": [3, 5], "d": 3}
   Patch: {"a": 4, "b": 2, "c": 5, "d": 3}
```

Valores não de array usados em um contexto que requer um valor de array são autoencapsulados: o valor é cercado pelos caracteres `[` e `]` para convertê-lo em um array. Na seguinte declaração, cada argumento é autoencapsulado como um array (`[1]`, `[2]`). Esses são então combinados para produzir um único array de resultado; como nos dois casos anteriores, `JSON_MERGE_PRESERVE()` combina valores com a mesma chave, enquanto `JSON_MERGE_PATCH()` descarta valores para todas as chaves duplicadas, exceto a última, como mostrado aqui:

```
mysql> SELECT
	  ->   JSON_MERGE_PRESERVE('1', '2') AS Preserve,
	  ->   JSON_MERGE_PATCH('1', '2') AS Patch\G
*************************** 1. row ***************************
Preserve: [1, 2]
   Patch: 2
```

Os valores de arrays e objetos são combinados ao autoenvolver o objeto como um array e combinar os arrays combinando valores ou por "a chave duplicada mais recente vence" de acordo com a escolha da função de combinação (`JSON_MERGE_PRESERVE()` ou `JSON_MERGE_PATCH()`, respectivamente), como pode ser visto neste exemplo:

```
mysql> SELECT
	  ->   JSON_MERGE_PRESERVE('[10, 20]', '{"a": "x", "b": "y"}') AS Preserve,
	  ->   JSON_MERGE_PATCH('[10, 20]', '{"a": "x", "b": "y"}') AS Patch\G
*************************** 1. row ***************************
Preserve: [10, 20, {"a": "x", "b": "y"}]
   Patch: {"a": "x", "b": "y"}
```

### Procurando e modificando valores JSON

Uma expressão de caminho JSON seleciona um valor dentro de um documento JSON.

As expressões de caminho são úteis com funções que extraem partes de um documento JSON ou o modificam, para especificar onde dentro desse documento você deseja operar. Por exemplo, a seguinte consulta extrai do documento JSON o valor do membro com a chave `name`:

```
mysql> SELECT JSON_EXTRACT('{"id": 14, "name": "Aztalan"}', '$.name');
+---------------------------------------------------------+
| JSON_EXTRACT('{"id": 14, "name": "Aztalan"}', '$.name') |
+---------------------------------------------------------+
| "Aztalan"                                               |
+---------------------------------------------------------+
```

A sintaxe de caminho usa o caractere `$` no início para representar o documento JSON em questão, opcionalmente seguido por seletores que indicam partes mais específicas do documento:

- Um período seguido por um nome chave nomeia o membro em um objeto com a chave especificada. O nome da chave deve ser especificado entre aspas duplas se o nome sem aspas não for válido em expressões de caminho (por exemplo, se contiver um espaço).

- `[N]` anexado a um `path` que seleciona um valor de um array é nomeado no índice `N` dentro do array. As posições dos arrays são inteiros que começam com zero. Se `path` não selecionar um valor do array, `path`\[0] avalia o mesmo valor que `path`:

  ```
  mysql> SELECT JSON_SET('"x"', '$[0]', 'a');
  +------------------------------+
  | JSON_SET('"x"', '$[0]', 'a') |
  +------------------------------+
  | "a"                          |
  +------------------------------+
  1 row in set (0.00 sec)
  ```

- `[M to N]` especifica um subconjunto ou intervalo de valores de matriz que começa com o valor na posição `M` e termina com o valor na posição `N`.

  `last` é suportado como sinônimo do índice do elemento de matriz mais à direita. O endereçamento relativo dos elementos da matriz também é suportado. Se `path` não selecionar um valor da matriz, `path`\[last] avalia o mesmo valor que `path`, conforme mostrado mais adiante nesta seção (veja Elemento de matriz mais à direita).

- Os caminhos podem conter `*` ou `**` wildcards:

  - `.[*]` avalia os valores de todos os membros de um objeto JSON.

  - `[*]` avalia os valores de todos os elementos em um array JSON.

  - `prefix**suffix` avalia todas as caminhos que começam com o prefixo nomeado e terminam com o sufixo nomeado.

- Um caminho que não existe no documento (avaliado como dados inexistentes) é avaliado como `NULL`.

Vamos chamar `$` deste array JSON com três elementos:

```
[3, {"a": [5, 6], "b": 10}, [99, 100]]
```

Então:

- `$[0]` avalia para `3`.

- `$[1]` avalia para `{"a": [5, 6], "b": 10}`.

- `$[2]` avalia para `[99, 100]`.

- `$[3]` avalia para `NULL` (ela se refere ao quarto elemento da matriz, que não existe).

Como `$[1]` e `$[2]` avaliam valores não escalares, eles podem ser usados como base para expressões de caminho mais específicas que selecionam valores aninhados. Exemplos:

- `$[1].a` avalia para `[5, 6]`.

- `$[1].a[1]` avalia para `6`.

- `$[1].b` avalia para `10`.

- `$[2][0]` avalia para `99`.

Como mencionado anteriormente, os componentes de caminho que nomeiam chaves devem ser citados se o nome da chave não citado não for legal em expressões de caminho. Deixe `$` referir-se a este valor:

```
{"a fish": "shark", "a bird": "sparrow"}
```

As chaves devem conter um espaço e devem ser citadas:

- `$."a fish"` avalia para `shark`.

- `$."a bird"` avalia para `sparrow`.

Caminhos que usam caracteres curinga são avaliados como um array que pode conter múltiplos valores:

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

No exemplo a seguir, o caminho `$**.b` avalia múltiplos caminhos (`$.a.b` e `$.c.b`) e produz um array dos valores de caminho correspondentes:

```
mysql> SELECT JSON_EXTRACT('{"a": {"b": 1}, "c": {"b": 2}}', '$**.b');
+---------------------------------------------------------+
| JSON_EXTRACT('{"a": {"b": 1}, "c": {"b": 2}}', '$**.b') |
+---------------------------------------------------------+
| [1, 2]                                                  |
+---------------------------------------------------------+
```

**Varia de arrays JSON.** Você pode usar intervalos com a palavra-chave `to` para especificar subconjuntos de arrays JSON. Por exemplo, `$[1 to 3]` inclui o segundo, terceiro e quarto elementos de um array, como mostrado aqui:

```
mysql> SELECT JSON_EXTRACT('[1, 2, 3, 4, 5]', '$[1 to 3]');
+----------------------------------------------+
| JSON_EXTRACT('[1, 2, 3, 4, 5]', '$[1 to 3]') |
+----------------------------------------------+
| [2, 3, 4]                                    |
+----------------------------------------------+
1 row in set (0.00 sec)
```

A sintaxe é `M to N`, onde `M` e `N` são, respectivamente, o primeiro e o último índices de uma faixa de elementos de um array JSON. `N` deve ser maior que `M`; `M` deve ser maior ou igual a 0. Os elementos do array são indexados a partir do 0.

Você pode usar intervalos em contextos onde os caracteres curinga são suportados.

Elemento da matriz mais à direita. A palavra-chave `last` é suportada como sinônimo do índice do último elemento em uma matriz. Expressões do tipo `last - N` podem ser usadas para endereçamento relativo e dentro de definições de intervalo, como este:

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

Você pode usar `column->path` com um identificador de coluna JSON e uma expressão de caminho JSON como sinônimo de `JSON_EXTRACT(column, path)`. Consulte a Seção 14.17.3, “Funções que buscam valores JSON”, para obter mais informações. Veja também Indexação de uma coluna gerada para fornecer um índice de coluna JSON.

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

Neste caso, o caminho `$[1].b[0]` seleciona um valor existente (`true`), que é substituído pelo valor que segue o argumento do caminho (`1`). O caminho `$[2][2]` não existe, então o valor correspondente (`2`) é adicionado ao valor selecionado por `$[2]`.

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

Os pares de valores de caminho são avaliados da esquerda para a direita. O documento produzido ao avaliar um par se torna o novo valor contra o qual o próximo par é avaliado.

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

- `$[2]` corresponde a `[10, 20]` e a remove.

- A primeira ocorrência de `$[1].b[1]` corresponde a `false` no elemento `b` e a remove.

- A segunda instância de `$[1].b[1]` não corresponde a nada: Esse elemento já foi removido, o caminho não existe mais e não tem efeito.

### Sintaxe de caminho JSON

Muitas das funções JSON suportadas pelo MySQL e descritas em outros lugares neste Manual (veja a Seção 14.17, “Funções JSON”) requerem uma expressão de caminho para identificar um elemento específico em um documento JSON. Um caminho consiste no escopo do caminho seguido por uma ou mais pernas do caminho. Para caminhos usados em funções JSON do MySQL, o escopo é sempre o documento que está sendo pesquisado ou operado, representado por um caractere `$` no início. As pernas do caminho são separadas por caracteres de ponto (`.`). As células em arrays são representadas por `[N]`, onde `N` é um inteiro não negativo. Os nomes das chaves devem ser cadeias de caracteres duplicadas ou identificadores válidos do ECMAScript (veja *Nomes de Identificadores e Identificadores*, na *Especificação da Linguagem ECMAScript*). As expressões de caminho, como o texto JSON, devem ser codificadas usando o conjunto de caracteres `ascii`, `utf8mb3` ou `utf8mb4`. Outras codificações de caracteres são implicitamente coercidas para `utf8mb4`. A sintaxe completa é mostrada aqui:

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

Os tokens de wildcard `*` e `**` são usados da seguinte forma:

- `.*` representa os valores de todos os membros do objeto.

- `[*]` representa os valores de todas as células do array.

- `[prefix]**suffix` representa todos os caminhos que começam com `prefix` e terminam com `suffix`. `prefix` é opcional, enquanto `suffix` é obrigatório; em outras palavras, um caminho não pode terminar em `**`.

  Além disso, um caminho não pode conter a sequência `***`.

Para exemplos de sintaxe de caminho, consulte as descrições das várias funções JSON que aceitam caminhos como argumentos, como `JSON_CONTAINS_PATH()`, `JSON_SET()` e `JSON_REPLACE()`. Para exemplos que incluem o uso dos caracteres curinga `*` e `**`, consulte a descrição da função `JSON_SEARCH()`.

O MySQL 8.0 também suporta a notação de intervalo para subconjuntos de arrays JSON usando a palavra-chave `to` (como `$[2 to 10]`), bem como a palavra-chave `last` como sinônimo do elemento mais à direita de um array. Veja Procurar e modificar valores JSON, para mais informações e exemplos.

### Comparação e ordenação de valores JSON

Os valores JSON podem ser comparados usando os operadores `=`, `<`, `<=`, `>`, `>=`, `<>`, `!=` e `<=>`.

Os seguintes operadores e funções de comparação ainda não são suportados com valores JSON:

- `BETWEEN`
- `IN()`
- `GREATEST()`
- `LEAST()`

Uma solução para os operadores e funções de comparação listados acima é converter os valores JSON para um tipo de dados numérico ou de string nativo do MySQL, para que eles tenham um tipo escalar não JSON consistente.

A comparação de valores JSON ocorre em dois níveis. O primeiro nível de comparação é baseado nos tipos JSON dos valores comparados. Se os tipos forem diferentes, o resultado da comparação é determinado exclusivamente pelo tipo que tem precedência maior. Se os dois valores tiverem o mesmo tipo JSON, ocorre um segundo nível de comparação usando regras específicas do tipo.

A lista a seguir mostra as precedências dos tipos JSON, do mais alto para o mais baixo. (Os nomes dos tipos são os retornados pela função `JSON_TYPE()`.) Os tipos mostrados juntos em uma linha têm a mesma precedência. Qualquer valor que tenha um tipo JSON listado anteriormente na lista é maior do que qualquer valor que tenha um tipo JSON listado mais tarde na lista.

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

- `BLOB`

  Os primeiros `N` bytes dos dois valores são comparados, onde `N` é o número de bytes no valor mais curto. Se os primeiros `N` bytes dos dois valores forem idênticos, o valor mais curto é ordenado antes do valor mais longo.

- `BIT`

  As mesmas regras que para `BLOB`.

- `OPAQUE`

  As mesmas regras que para `BLOB`. Os valores `OPAQUE` são valores que não são classificados como um dos outros tipos.

- `DATETIME`

  Um valor que representa um ponto de tempo anterior é ordenado antes de um valor que representa um ponto de tempo posterior. Se dois valores originalmente vêm dos tipos `DATETIME` e `TIMESTAMP` do MySQL, respectivamente, eles são iguais se representarem o mesmo ponto de tempo.

- `TIME`

  O menor dos dois valores de tempo é ordenado antes do maior.

- `DATE`

  A data anterior é ordenada antes da data mais recente.

- `ARRAY`

  Dois arrays JSON são iguais se tiverem o mesmo comprimento e os valores nas posições correspondentes dos arrays forem iguais.

  Se os arrays não forem iguais, sua ordem é determinada pelos elementos na primeira posição onde há uma diferença. O array com o valor menor nessa posição é ordenado primeiro. Se todos os valores do array mais curto forem iguais aos valores correspondentes no array mais longo, o array mais curto é ordenado primeiro.

  Exemplo:

  ```
  [] < ["a"] < ["ab"] < ["ab", "cd", "ef"] < ["ab", "ef"]
  ```

- `BOOLEAN`

  O literal JSON falso é menor que o literal JSON verdadeiro.

- `OBJECT`

  Dois objetos JSON são iguais se tiverem o mesmo conjunto de chaves e cada chave tiver o mesmo valor em ambos os objetos.

  Exemplo:

  ```
  {"a": 1, "b": 2} = {"b": 2, "a": 1}
  ```

  A ordem de dois objetos que não são iguais é não especificado, mas determinada.

- `STRING`

  As cadeias são ordenadas lexicograficamente nos primeiros `N` bytes da representação `utf8mb4` das duas cadeias que estão sendo comparadas, onde `N` é o comprimento da cadeia mais curta. Se os primeiros `N` bytes das duas cadeias forem idênticos, a cadeia mais curta é considerada menor que a cadeia mais longa.

  Exemplo:

  ```
  "a" < "ab" < "b" < "bc"
  ```

  Essa ordenação é equivalente à ordenação de strings SQL com a collation `utf8mb4_bin`. Como `utf8mb4_bin` é uma collation binária, a comparação de valores JSON é sensível ao caso:

  ```
  "A" < "a"
  ```

- `INTEGER`, `DOUBLE`

  Os valores JSON podem conter números de valor exato e números de valor aproximado. Para uma discussão geral sobre esses tipos de números, consulte a Seção 11.1.2, “Literais Numéricos”.

  As regras para comparar tipos numéricos nativos do MySQL são discutidas na Seção 14.3, “Conversão de Tipo na Avaliação de Expressões”, mas as regras para comparar números dentro de valores JSON diferem um pouco:

  - Em uma comparação entre duas colunas que usam os tipos numéricos nativos MySQL `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e `DOUBLE` - FLOAT, DOUBLE"), sabe-se que todas as comparações envolvem um inteiro e um número de ponto flutuante, então o inteiro é convertido para número de ponto flutuante para todas as linhas. Isso significa que os números de valor exato são convertidos em números de valor aproximado.

  - Por outro lado, se a consulta comparar duas colunas JSON que contêm números, não é possível saber antecipadamente se os números são inteiros ou decimais. Para fornecer o comportamento mais consistente em todas as linhas, o MySQL converte números de valor aproximado em números de valor exato. A ordem resultante é consistente e não perde precisão para os números de valor exato. Por exemplo, dados os escalares 9223372036854775805, 9223372036854775806, 9223372036854775807 e 9,223372036854776e18, a ordem é a seguinte:

    ```
    9223372036854775805 < 9223372036854775806 < 9223372036854775807
    < 9.223372036854776e18 = 9223372036854776000 < 9223372036854776001
    ```

  Se as comparações JSON usarem as regras de comparação numérica não JSON, pode ocorrer uma ordem inconsistente. As regras de comparação padrão do MySQL para números produzem essas ordens:

  - Comparações numéricas:

    ```
    9223372036854775805 < 9223372036854775806 < 9223372036854775807
    ```

    (não definido para 9,223372036854776e18)

  - Comparação dupla:

    ```
    9223372036854775805 = 9223372036854775806 = 9223372036854775807 = 9.223372036854776e18
    ```

Para a comparação de qualquer valor JSON com `NULL`, o resultado é `UNKNOWN`.

Para a comparação de valores JSON e não JSON, o valor não JSON é convertido para JSON de acordo com as regras da tabela a seguir, e os valores são então comparados conforme descrito anteriormente.

### Conversão entre valores JSON e não JSON

A tabela a seguir fornece um resumo das regras que o MySQL segue ao realizar conversões entre valores JSON e valores de outros tipos:

**Tabela 13.3 Regras de conversão JSON**

<table summary="Regras de conversão para o tipo de dados JSON"><thead><tr> <th scope="col">outro tipo</th> <th scope="col">CAST(outro tipo COMO JSON)</th> <th scope="col">CAST(JSON como outro tipo)</th> </tr></thead><tbody><tr> <th>JSON</th> <td>Sem alterações</td> <td>Sem alterações</td> </tr><tr> <th>tipo de caractere utf8 ([[PH_HTML_CODE_<code>ST_GeomFromGeoJSON()</code>], [[PH_HTML_CODE_<code>ST_GeomFromGeoJSON()</code>], [[<code>ascii</code>]])</th> <td>A string é analisada em um valor JSON.</td> <td>O valor JSON é serializado em uma string [[<code>utf8mb4</code>]].</td> </tr><tr> <th>Outros tipos de personagens</th> <td>Outras codificações de caracteres são implicitamente convertidas para [[<code>utf8mb4</code>]] e tratadas conforme descrito para esse tipo de caractere.</td> <td>O valor JSON é serializado em uma string [[<code>utf8mb4</code>]] e, em seguida, convertido para outra codificação de caracteres. O resultado pode não ter significado.</td> </tr><tr> <th>[[<code>NULL</code>]]</th> <td>O resultado é um valor [[<code>NULL</code>]] do tipo JSON.</td> <td>Não aplicável.</td> </tr><tr> <th>Tipos de geometria</th> <td>O valor da geometria é convertido em um documento JSON ao chamar [[<code>ST_AsGeoJSON()</code>]].</td> <td>Operação ilegal. Solução: Passe o resultado de [[<code>CAST(<em class="replaceable"><code>json_val</code>]]</em>AS CHAR)</code>para [[<code>ST_GeomFromGeoJSON()</code>]].</td> </tr><tr> <th>Todos os outros tipos</th> <td>O resultado é um documento JSON que consiste em um único valor escalar.</td> <td>É bem-sucedido se o documento JSON contiver um único valor escalar do tipo alvo e se esse valor escalar puder ser convertido para o tipo alvo. Caso contrário, retorna [[<code>utf8mb3</code><code>ST_GeomFromGeoJSON()</code>] e gera uma mensagem de aviso.</td> </tr></tbody></table>

`ORDER BY` e `GROUP BY` para valores JSON funcionam de acordo com esses princípios:

- A ordenação de valores JSON escalares segue as mesmas regras da discussão anterior.

- Para ordenações ascendentes, o SQL `NULL` ordena antes de todos os valores JSON, incluindo o literal JSON nulo; para ordenações descendentes, o SQL `NULL` ordena depois de todos os valores JSON, incluindo o literal JSON nulo.

- As chaves de classificação para os valores JSON são determinadas pelo valor da variável de sistema `max_sort_length`, portanto, as chaves que diferem apenas após os primeiros bytes `max_sort_length` são consideradas iguais.

- O triagem de valores não escalares não é suportada atualmente e um aviso é exibido.

Para a classificação, pode ser benéfico converter um escalar JSON em outro tipo nativo do MySQL. Por exemplo, se uma coluna chamada `jdoc` contém objetos JSON com um membro composto por uma chave `id` e um valor não negativo, use esta expressão para classificar por valores de `id`:

```
ORDER BY CAST(JSON_EXTRACT(jdoc, '$.id') AS UNSIGNED)
```

Se houver uma coluna gerada definida para usar a mesma expressão que no `ORDER BY`, o otimizador do MySQL reconhece isso e considera usar o índice para o plano de execução da consulta. Veja a Seção 10.3.11, “Uso do Otimizador de Índices de Colunas Geradas”.

### Agrupamento de Valores JSON

Para a agregação de valores JSON, os valores de `NULL` são ignorados, assim como outros tipos de dados. Os valores que não são `NULL` são convertidos em um tipo numérico e agregados, exceto para `MIN()`, `MAX()` e `GROUP_CONCAT()`. A conversão para número deve produzir um resultado significativo para valores JSON que são escalares numéricos, embora (dependendo dos valores) possa ocorrer truncação e perda de precisão. A conversão para número de outros valores JSON pode não produzir um resultado significativo.
