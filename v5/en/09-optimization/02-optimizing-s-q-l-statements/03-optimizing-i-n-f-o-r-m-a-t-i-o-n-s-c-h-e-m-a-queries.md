### 8.2.3 Otimizando Queries no INFORMATION_SCHEMA

Aplicações que monitoram Databases podem fazer uso frequente das tabelas `INFORMATION_SCHEMA`. Certos tipos de Queries para tabelas `INFORMATION_SCHEMA` podem ser otimizadas para executar mais rapidamente. O objetivo é minimizar as operações de arquivo (por exemplo, escanear um diretório ou abrir um arquivo de tabela) para coletar as informações que compõem essas tabelas dinâmicas.

Nota

O comportamento de comparação para nomes de Database e tabela em Queries do `INFORMATION_SCHEMA` pode diferir do que você espera. Para detalhes, consulte a Seção 10.8.7, “Usando Collation em Buscas no INFORMATION_SCHEMA”.

**1) Tente usar valores de lookup constantes para nomes de Database e tabela na cláusula `WHERE`**

Você pode tirar proveito deste princípio da seguinte forma:

* Para buscar Databases ou tabelas (lookup), use expressões que avaliam um valor constante, como valores literais, funções que retornam uma constante ou subqueries escalares.

* Evite Queries que usam um valor de lookup de nome de Database não constante (ou nenhum valor de lookup) porque elas exigem um escaneamento do diretório de dados para encontrar nomes de diretório de Database correspondentes.

* Dentro de um Database, evite Queries que usam um valor de lookup de nome de tabela não constante (ou nenhum valor de lookup) porque elas exigem um escaneamento do diretório do Database para encontrar arquivos de tabela correspondentes.

Este princípio se aplica às tabelas `INFORMATION_SCHEMA` mostradas na tabela a seguir, que exibe as colunas para as quais um valor de lookup constante permite que o servidor evite um escaneamento de diretório. Por exemplo, se você estiver selecionando de `TABLES`, usar um valor de lookup constante para `TABLE_SCHEMA` na cláusula `WHERE` permite que um escaneamento de diretório de dados seja evitado.

<table summary="Tabelas INFORMATION_SCHEMA e colunas de tabela para as quais um valor de lookup constante permite que o servidor evite escaneamentos de diretório."><col style="width: 34%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th>Tabela</th> <th>Coluna a especificar para evitar o escaneamento do diretório de dados</th> <th>Coluna a especificar para evitar o escaneamento do diretório do Database</th> </tr></thead><tbody><tr> <th><code>COLUMNS</code></th> <td><code>TABLE_SCHEMA</code></td> <td><code>TABLE_NAME</code></td> </tr><tr> <th><code>KEY_COLUMN_USAGE</code></th> <td><code>TABLE_SCHEMA</code></td> <td><code>TABLE_NAME</code></td> </tr><tr> <th><code>PARTITIONS</code></th> <td><code>TABLE_SCHEMA</code></td> <td><code>TABLE_NAME</code></td> </tr><tr> <th><code>REFERENTIAL_CONSTRAINTS</code></th> <td><code>CONSTRAINT_SCHEMA</code></td> <td><code>TABLE_NAME</code></td> </tr><tr> <th><code>STATISTICS</code></th> <td><code>TABLE_SCHEMA</code></td> <td><code>TABLE_NAME</code></td> </tr><tr> <th><code>TABLES</code></th> <td><code>TABLE_SCHEMA</code></td> <td><code>TABLE_NAME</code></td> </tr><tr> <th><code>TABLE_CONSTRAINTS</code></th> <td><code>TABLE_SCHEMA</code></td> <td><code>TABLE_NAME</code></td> </tr><tr> <th><code>TRIGGERS</code></th> <td><code>EVENT_OBJECT_SCHEMA</code></td> <td><code>EVENT_OBJECT_TABLE</code></td> </tr><tr> <th><code>VIEWS</code></th> <td><code>TABLE_SCHEMA</code></td> <td><code>TABLE_NAME</code></td> </tr> </tbody></table>

O benefício de uma Query limitada a um nome de Database constante específico é que as verificações precisam ser feitas apenas no diretório de Database nomeado. Exemplo:

```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'test';
```

O uso do nome de Database literal `test` permite que o servidor verifique apenas o diretório do Database `test`, independentemente de quantos Databases possam existir. Por outro lado, a Query a seguir é menos eficiente porque exige um escaneamento do diretório de dados para determinar quais nomes de Database correspondem ao padrão `'test%'`:

```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA LIKE 'test%';
```

Para uma Query limitada a um nome de tabela constante específico, as verificações precisam ser feitas apenas para a tabela nomeada dentro do diretório de Database correspondente. Exemplo:

```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'test' AND TABLE_NAME = 't1';
```

O uso do nome de tabela literal `t1` permite que o servidor verifique apenas os arquivos da tabela `t1`, independentemente de quantas tabelas possam existir no Database `test`. Por outro lado, a Query a seguir exige um escaneamento do diretório do Database `test` para determinar quais nomes de tabela correspondem ao padrão `'t%'`:

```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'test' AND TABLE_NAME LIKE 't%';
```

A Query a seguir exige um escaneamento do diretório de Database para determinar nomes de Database correspondentes ao padrão `'test%'`, e para cada Database correspondente, exige um escaneamento do diretório do Database para determinar nomes de tabela correspondentes ao padrão `'t%'`:

```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'test%' AND TABLE_NAME LIKE 't%';
```

**2) Escreva Queries que minimizem o número de arquivos de tabela que devem ser abertos**

Para Queries que se referem a certas colunas da tabela `INFORMATION_SCHEMA`, várias otimizações estão disponíveis que minimizam o número de arquivos de tabela que devem ser abertos. Exemplo:

```sql
SELECT TABLE_NAME, ENGINE FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'test';
```

Neste caso, depois que o servidor escaneia o diretório de Database para determinar os nomes das tabelas no Database, esses nomes se tornam disponíveis sem outras buscas no sistema de arquivos. Assim, `TABLE_NAME` não exige que arquivos sejam abertos. O valor `ENGINE` (motor de armazenamento) pode ser determinado abrindo o arquivo `.frm` da tabela, sem tocar em outros arquivos de tabela, como o arquivo `.MYD` ou `.MYI`.

Alguns valores, como `INDEX_LENGTH` para tabelas `MyISAM`, exigem que o arquivo `.MYD` ou `.MYI` também seja aberto.

Os tipos de otimização de abertura de arquivo são denotados assim:

* `SKIP_OPEN_TABLE`: Arquivos de tabela não precisam ser abertos. A informação já se tornou disponível dentro da Query ao escanear o diretório do Database.

* `OPEN_FRM_ONLY`: Apenas o arquivo `.frm` da tabela precisa ser aberto.

* `OPEN_TRIGGER_ONLY`: Apenas o arquivo `.TRG` da tabela precisa ser aberto.

* `OPEN_FULL_TABLE`: A busca de informação não otimizada. Os arquivos `.frm`, `.MYD` e `.MYI` devem ser abertos.

A lista a seguir indica como os tipos de otimização anteriores se aplicam às colunas da tabela `INFORMATION_SCHEMA`. Para tabelas e colunas não nomeadas, nenhuma das otimizações se aplica.

* `COLUMNS`: `OPEN_FRM_ONLY` se aplica a todas as colunas

* `KEY_COLUMN_USAGE`: `OPEN_FULL_TABLE` se aplica a todas as colunas

* `PARTITIONS`: `OPEN_FULL_TABLE` se aplica a todas as colunas

* `REFERENTIAL_CONSTRAINTS`: `OPEN_FULL_TABLE` se aplica a todas as colunas

* `STATISTICS`:

  <table summary="Tipos de otimização que se aplicam às colunas da tabela INFORMATION_SCHEMA STATISTICS."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Coluna</th> <th>Tipo de Otimização</th> </tr></thead><tbody><tr> <td><code>TABLE_CATALOG</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>TABLE_SCHEMA</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>TABLE_NAME</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>NON_UNIQUE</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>INDEX_SCHEMA</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>INDEX_NAME</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>SEQ_IN_INDEX</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>COLUMN_NAME</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>COLLATION</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>CARDINALITY</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>SUB_PART</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>PACKED</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>NULLABLE</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>INDEX_TYPE</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>COMMENT</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr></tbody></table>

* `TABLES`:

  <table summary="Tipos de otimização que se aplicam às colunas da tabela INFORMATION_SCHEMA TABLES."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Coluna</th> <th>Tipo de Otimização</th> </tr></thead><tbody><tr> <td><code>TABLE_CATALOG</code></td> <td><code>SKIP_OPEN_TABLE</code></td> </tr><tr> <td><code>TABLE_SCHEMA</code></td> <td><code>SKIP_OPEN_TABLE</code></td> </tr><tr> <td><code>TABLE_NAME</code></td> <td><code>SKIP_OPEN_TABLE</code></td> </tr><tr> <td><code>TABLE_TYPE</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>ENGINE</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>VERSION</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>ROW_FORMAT</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>TABLE_ROWS</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>AVG_ROW_LENGTH</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>DATA_LENGTH</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>MAX_DATA_LENGTH</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>INDEX_LENGTH</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>DATA_FREE</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>AUTO_INCREMENT</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>CREATE_TIME</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>UPDATE_TIME</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>CHECK_TIME</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>TABLE_COLLATION</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>CHECKSUM</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>CREATE_OPTIONS</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>TABLE_COMMENT</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr></tbody></table>

* `TABLE_CONSTRAINTS`: `OPEN_FULL_TABLE` se aplica a todas as colunas

* `TRIGGERS`: `OPEN_TRIGGER_ONLY` se aplica a todas as colunas

* `VIEWS`:

  <table summary="Tipos de otimização que se aplicam às colunas da tabela INFORMATION_SCHEMA VIEWS."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Coluna</th> <th>Tipo de Otimização</th> </tr></thead><tbody><tr> <td><code>TABLE_CATALOG</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>TABLE_SCHEMA</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>TABLE_NAME</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>VIEW_DEFINITION</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>CHECK_OPTION</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>IS_UPDATABLE</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>DEFINER</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>SECURITY_TYPE</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>CHARACTER_SET_CLIENT</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>COLLATION_CONNECTION</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr></tbody></table>

**3) Use `EXPLAIN` para determinar se o servidor pode usar otimizações do `INFORMATION_SCHEMA` para uma Query**

Isso se aplica particularmente a Queries no `INFORMATION_SCHEMA` que buscam informações de mais de um Database, o que pode levar muito tempo e impactar a performance. O valor `Extra` na saída do `EXPLAIN` indica qual, ou quais, das otimizações descritas anteriormente o servidor pode usar para avaliar Queries no `INFORMATION_SCHEMA`. Os exemplos a seguir demonstram os tipos de informação que você pode esperar ver no valor `Extra`.

```sql
mysql> EXPLAIN SELECT TABLE_NAME FROM INFORMATION_SCHEMA.VIEWS WHERE
       TABLE_SCHEMA = 'test' AND TABLE_NAME = 'v1'\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: VIEWS
         type: ALL
possible_keys: NULL
          key: TABLE_SCHEMA,TABLE_NAME
      key_len: NULL
          ref: NULL
         rows: NULL
        Extra: Using where; Open_frm_only; Scanned 0 databases
```

O uso de valores de lookup constantes de Database e tabela permite que o servidor evite escaneamentos de diretório. Para referências a `VIEWS.TABLE_NAME`, apenas o arquivo `.frm` precisa ser aberto.

```sql
mysql> EXPLAIN SELECT TABLE_NAME, ROW_FORMAT FROM INFORMATION_SCHEMA.TABLES\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: TABLES
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: NULL
        Extra: Open_full_table; Scanned all databases
```

Nenhum valor de lookup é fornecido (não há cláusula `WHERE`), então o servidor deve escanear o diretório de dados e cada diretório de Database. Para cada tabela assim identificada, o nome da tabela e o formato da linha são selecionados. `TABLE_NAME` não exige que mais arquivos de tabela sejam abertos (a otimização `SKIP_OPEN_TABLE` se aplica). `ROW_FORMAT` exige que todos os arquivos de tabela sejam abertos (`OPEN_FULL_TABLE` se aplica). `EXPLAIN` reporta `OPEN_FULL_TABLE` porque é mais custoso do que `SKIP_OPEN_TABLE`.

```sql
mysql> EXPLAIN SELECT TABLE_NAME, TABLE_TYPE FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = 'test'\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: TABLES
         type: ALL
possible_keys: NULL
          key: TABLE_SCHEMA
      key_len: NULL
          ref: NULL
         rows: NULL
        Extra: Using where; Open_frm_only; Scanned 1 database
```

Nenhum valor de lookup de nome de tabela é fornecido, então o servidor deve escanear o diretório do Database `test`. Para as colunas `TABLE_NAME` e `TABLE_TYPE`, as otimizações `SKIP_OPEN_TABLE` e `OPEN_FRM_ONLY` se aplicam, respectivamente. `EXPLAIN` reporta `OPEN_FRM_ONLY` porque é mais custoso.

```sql
mysql> EXPLAIN SELECT B.TABLE_NAME
       FROM INFORMATION_SCHEMA.TABLES AS A, INFORMATION_SCHEMA.COLUMNS AS B
       WHERE A.TABLE_SCHEMA = 'test'
       AND A.TABLE_NAME = 't1'
       AND B.TABLE_NAME = A.TABLE_NAME\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: A
         type: ALL
possible_keys: NULL
          key: TABLE_SCHEMA,TABLE_NAME
      key_len: NULL
          ref: NULL
         rows: NULL
        Extra: Using where; Skip_open_table; Scanned 0 databases
*************************** 2. row ***************************
           id: 1
  select_type: SIMPLE
        table: B
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: NULL
        Extra: Using where; Open_frm_only; Scanned all databases;
               Using join buffer
```

Para a primeira linha de saída do `EXPLAIN`: Valores de lookup constantes de Database e tabela permitem que o servidor evite escaneamentos de diretório para valores de `TABLES`. Referências a `TABLES.TABLE_NAME` não exigem arquivos de tabela adicionais.

Para a segunda linha de saída do `EXPLAIN`: Todos os valores da tabela `COLUMNS` são lookups `OPEN_FRM_ONLY`, então `COLUMNS.TABLE_NAME` exige que o arquivo `.frm` seja aberto.

```sql
mysql> EXPLAIN SELECT * FROM INFORMATION_SCHEMA.COLLATIONS\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: COLLATIONS
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: NULL
        Extra:
```

Neste caso, nenhuma otimização se aplica porque `COLLATIONS` não é uma das tabelas do `INFORMATION_SCHEMA` para as quais otimizações estão disponíveis.