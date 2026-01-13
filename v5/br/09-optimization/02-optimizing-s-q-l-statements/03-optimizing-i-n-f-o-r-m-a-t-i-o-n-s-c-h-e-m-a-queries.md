### 8.2.3 Otimizando consultas do INFORMATION_SCHEMA

Aplicações que monitoram bancos de dados podem fazer uso frequente das tabelas do `INFORMATION_SCHEMA`. Certos tipos de consultas para as tabelas do `INFORMATION_SCHEMA` podem ser otimizados para serem executados mais rapidamente. O objetivo é minimizar as operações de arquivo (por exemplo, varredura de um diretório ou abertura de um arquivo de tabela) para coletar as informações que compõem essas tabelas dinâmicas.

Nota

O comportamento de comparação para nomes de banco de dados e tabelas em consultas do `INFORMATION_SCHEMA` pode diferir do que você espera. Para obter detalhes, consulte a Seção 10.8.7, “Usando a Codificação em Pesquisas do INFORMATION_SCHEMA”.

**1) Tente usar valores de consulta constantes para os nomes de banco de dados e tabelas na cláusula `WHERE`**

Você pode aproveitar esse princípio da seguinte forma:

- Para consultar bancos de dados ou tabelas, use expressões que resultem em uma constante, como valores literais, funções que retornam uma constante ou subconsultas escalares.

- Evite consultas que utilizam um valor de busca de nome de banco de dados não constante (ou nenhum valor de busca) porque elas exigem uma varredura do diretório de dados para encontrar nomes de diretórios de banco de dados correspondentes.

- Dentro de um banco de dados, evite consultas que utilizam um valor de busca de nome de tabela não constante (ou nenhum valor de busca) porque elas exigem uma varredura do diretório do banco de dados para encontrar arquivos de tabela correspondentes.

Este princípio se aplica às tabelas `INFORMATION_SCHEMA` mostradas na tabela a seguir, que exibe as colunas para as quais um valor de consulta constante permite que o servidor evite uma varredura de diretório. Por exemplo, se você estiver selecionando de `TABLES`, usar um valor de consulta constante para `TABLE_SCHEMA` na cláusula `WHERE` permite evitar uma varredura de diretório de dados.

<table summary="Tabelas do INFORMATION_SCHEMA e colunas de tabelas para as quais um valor de consulta constante permite que o servidor evite varreduras de diretório.">
  <thead>
    <tr>
      <th>Tabela</th>
      <th>Coluna a especificar para evitar a verificação do diretório de dados</th>
      <th>Coluna a especificar para evitar a verificação do diretório do banco de dados</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>COLUMNS</code></th>
      <td><code>TABLE_SCHEMA</code></td>
      <td><code>TABLE_NAME</code></td>
    </tr>
    <tr>
      <th><code>KEY_COLUMN_USAGE</code></th>
      <td><code>TABLE_SCHEMA</code></td>
      <td><code>TABLE_NAME</code></td>
    </tr>
    <tr>
      <th><code>PARTITIONS</code></th>
      <td><code>TABLE_SCHEMA</code></td>
      <td><code>TABLE_NAME</code></td>
    </tr>
    <tr>
      <th><code>REFERENTIAL_CONSTRAINTS</code></th>
      <td><code>CONSTRAINT_SCHEMA</code></td>
      <td><code>TABLE_NAME</code></td>
    </tr>
    <tr>
      <th><code>STATISTICS</code></th>
      <td><code>TABLE_SCHEMA</code></td>
      <td><code>TABLE_NAME</code></td>
    </tr>
    <tr>
      <th><code>TABLES</code></th>
      <td><code>TABLE_SCHEMA</code></td>
      <td><code>TABLE_NAME</code></td>
    </tr>
    <tr>
      <th><code>TABLE_CONSTRAINTS</code></th>
      <td><code>TABLE_SCHEMA</code></td>
      <td><code>TABLE_NAME</code></td>
    </tr>
    <tr>
      <th><code>TRIGGERS</code></th>
      <td><code>EVENT_OBJECT_SCHEMA</code></td>
      <td><code>EVENT_OBJECT_TABLE</code></td>
    </tr>
    <tr>
      <th><code>VIEWS</code></th>
      <td><code>TABLE_SCHEMA</code></td>
      <td><code>TABLE_NAME</code></td>
    </tr>
  </tbody>
</table>

A vantagem de uma consulta limitada a um nome específico de banco de dados é que as verificações precisam ser feitas apenas no diretório do banco de dados nomeado. Exemplo:

```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'test';
```

O uso do nome literal do banco de dados `test` permite que o servidor verifique apenas o diretório do banco de dados `test`, independentemente de quantos bancos de dados possam existir. Em contraste, a seguinte consulta é menos eficiente porque exige uma varredura do diretório de dados para determinar quais nomes de banco de dados correspondem ao padrão `'test%'`:

```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA LIKE 'test%';
```

Para uma consulta que é limitada a um nome específico de tabela constante, as verificações precisam ser feitas apenas para a tabela nomeada dentro do diretório do banco de dados correspondente. Exemplo:

```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'test' AND TABLE_NAME = 't1';
```

O uso do nome literal da tabela `t1` permite que o servidor verifique apenas os arquivos da tabela `t1`, independentemente de quantas tabelas possam existir no banco de dados `test`. Em contraste, a seguinte consulta exige uma varredura do diretório do banco de dados `test` para determinar quais nomes de tabela correspondem ao padrão `'t%'`:

```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'test' AND TABLE_NAME LIKE 't%';
```

A consulta a seguir requer uma varredura do diretório do banco de dados para determinar nomes de banco de dados correspondentes ao padrão `'test%'`, e, para cada banco de dados correspondente, requer uma varredura do diretório do banco de dados para determinar nomes de tabela correspondentes ao padrão `'t%'`:

```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'test%' AND TABLE_NAME LIKE 't%';
```

**2) Escreva consultas que minimizem o número de arquivos de tabela que precisam ser abertos**

Para consultas que se referem a certas colunas da tabela `INFORMATION_SCHEMA`, estão disponíveis várias otimizações que minimizam o número de arquivos de tabela que precisam ser abertos. Exemplo:

```sql
SELECT TABLE_NAME, ENGINE FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'test';
```

Neste caso, após o servidor ter escaneado o diretório do banco de dados para determinar os nomes das tabelas no banco de dados, esses nomes ficam disponíveis sem a necessidade de buscas adicionais no sistema de arquivos. Assim, `TABLE_NAME` não requer que arquivos sejam abertos. O valor `ENGINE` (motor de armazenamento) pode ser determinado abrindo o arquivo `.frm` da tabela, sem tocar em outros arquivos de tabela, como o arquivo `.MYD` ou `.MYI`.

Alguns valores, como `INDEX_LENGTH` para tabelas `MyISAM`, também exigem a abertura do arquivo `.MYD` ou `.MYI`.

Os tipos de otimização de abertura de arquivos são indicados da seguinte forma:

- `SKIP_OPEN_TABLE`: Os arquivos de tabela não precisam ser abertos. As informações já estão disponíveis na consulta ao digitalizar o diretório do banco de dados.

- `OPEN_FRM_ONLY`: Apenas o arquivo `.frm` da tabela precisa ser aberto.

- `OPEN_TRIGGER_ONLY`: Apenas o arquivo `.TRG` da tabela precisa ser aberto.

- `OPEN_FULL_TABLE`: Busca de informações não otimizada. Os arquivos `.frm`, `.MYD` e `.MYI` devem ser abertos.

A lista a seguir indica como os tipos de otimização anteriores se aplicam às colunas da tabela `INFORMATION_SCHEMA`. Para tabelas e colunas não nomeadas, nenhuma das otimizações se aplica.

- `COLUMNS`: `OPEN_FRM_ONLY` se aplica a todas as colunas

- `KEY_COLUMN_USAGE`: `OPEN_FULL_TABLE` se aplica a todas as colunas

- `PARTITIONS`: `OPEN_FULL_TABLE` se aplica a todas as colunas

- `REFERENTIAL_CONSTRAINTS`: `OPEN_FULL_TABLE` se aplica a todas as colunas

- `STATISTICS`:

  <table summary="Tipos de otimização que se aplicam às colunas da tabela INFORMATION_SCHEMA STATISTICS.">
    <thead>
      <tr>
        <th>Coluna</th>
        <th>Tipo de otimização</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>TABLE_CATALOG</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>TABLE_SCHEMA</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>TABLE_NAME</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>NON_UNIQUE</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>INDEX_SCHEMA</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>INDEX_NAME</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>SEQ_IN_INDEX</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>COLUMN_NAME</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>COLLATION</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>CARDINALITY</code></td>
        <td><code>OPEN_FULL_TABLE</code></td>
      </tr>
      <tr>
        <td><code>SUB_PART</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>PACKED</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>NULLABLE</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>INDEX_TYPE</code></td>
        <td><code>OPEN_FULL_TABLE</code></td>
      </tr>
      <tr>
        <td><code>COMMENT</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
    </tbody>
  </table>

- `TABLES`:

  <table summary="Tipos de otimização que se aplicam às colunas da tabela INFORMATION_SCHEMA TABLES.">
    <thead>
      <tr>
        <th>Coluna</th>
        <th>Tipo de otimização</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>TABLE_CATALOG</code></td>
        <td><code>SKIP_OPEN_TABLE</code></td>
      </tr>
      <tr>
        <td><code>TABLE_SCHEMA</code></td>
        <td><code>SKIP_OPEN_TABLE</code></td>
      </tr>
      <tr>
        <td><code>TABLE_NAME</code></td>
        <td><code>SKIP_OPEN_TABLE</code></td>
      </tr>
      <tr>
        <td><code>TABLE_TYPE</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>ENGINE</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>VERSION</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>ROW_FORMAT</code></td>
        <td><code>OPEN_FULL_TABLE</code></td>
      </tr>
      <tr>
        <td><code>TABLE_ROWS</code></td>
        <td><code>OPEN_FULL_TABLE</code></td>
      </tr>
      <tr>
        <td><code>AVG_ROW_LENGTH</code></td>
        <td><code>OPEN_FULL_TABLE</code></td>
      </tr>
      <tr>
        <td><code>DATA_LENGTH</code></td>
        <td><code>OPEN_FULL_TABLE</code></td>
      </tr>
      <tr>
        <td><code>MAX_DATA_LENGTH</code></td>
        <td><code>OPEN_FULL_TABLE</code></td>
      </tr>
      <tr>
        <td><code>INDEX_LENGTH</code></td>
        <td><code>OPEN_FULL_TABLE</code></td>
      </tr>
      <tr>
        <td><code>DATA_FREE</code></td>
        <td><code>OPEN_FULL_TABLE</code></td>
      </tr>
      <tr>
        <td><code>AUTO_INCREMENT</code></td>
        <td><code>OPEN_FULL_TABLE</code></td>
      </tr>
      <tr>
        <td><code>CREATE_TIME</code></td>
        <td><code>OPEN_FULL_TABLE</code></td>
      </tr>
      <tr>
        <td><code>UPDATE_TIME</code></td>
        <td><code>OPEN_FULL_TABLE</code></td>
      </tr>
      <tr>
        <td><code>CHECK_TIME</code></td>
        <td><code>OPEN_FULL_TABLE</code></td>
      </tr>
      <tr>
        <td><code>TABLE_COLLATION</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>CHECKSUM</code></td>
        <td><code>OPEN_FULL_TABLE</code></td>
      </tr>
      <tr>
        <td><code>CREATE_OPTIONS</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>TABLE_COMMENT</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
    </tbody>
  </table>

- `TABLE_CONSTRAINTS`: `OPEN_FULL_TABLE` se aplica a todas as colunas

- `TRIGGERS`: `OPEN_TRIGGER_ONLY` se aplica a todas as colunas

- `VIEWS`:

  <table>
    <thead>
      <tr>
        <th>Coluna</th>
        <th>Tipo de otimização</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>TABLE_CATALOG</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>TABLE_SCHEMA</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>TABLE_NAME</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>VIEW_DEFINITION</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>CHECK_OPTION</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>IS_UPDATABLE</code></td>
        <td><code>OPEN_FULL_TABLE</code></td>
      </tr>
      <tr>
        <td><code>DEFINER</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>SECURITY_TYPE</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>CHARACTER_SET_CLIENT</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
      <tr>
        <td><code>COLLATION_CONNECTION</code></td>
        <td><code>OPEN_FRM_ONLY</code></td>
      </tr>
    </tbody>
  </table>

**3) Use `EXPLAIN` para determinar se o servidor pode usar otimizações do `INFORMATION_SCHEMA` para uma consulta**

Isso se aplica especialmente às consultas do `INFORMATION_SCHEMA` que buscam informações de mais de um banco de dados, o que pode levar muito tempo e impactar o desempenho. O valor `Extra` na saída do `EXPLAIN` indica quais, se houver, das otimizações descritas anteriormente o servidor pode usar para avaliar as consultas do `INFORMATION_SCHEMA`. Os seguintes exemplos demonstram os tipos de informações que você pode esperar ver no valor `Extra`.

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

O uso de valores constantes de busca de banco de dados e tabela permite que o servidor evite varreduras de diretório. Para referências a `VIEWS.TABLE_NAME`, apenas o arquivo `.frm` precisa ser aberto.

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

Não são fornecidos valores de consulta (não há cláusula `WHERE`), então o servidor deve percorrer o diretório de dados e cada diretório de banco de dados. Para cada tabela assim identificada, o nome da tabela e o formato da linha são selecionados. `TABLE_NAME` não requer que mais arquivos de tabela sejam abertos (a otimização `SKIP_OPEN_TABLE` se aplica). `ROW_FORMAT` requer que todos os arquivos de tabela sejam abertos (`OPEN_FULL_TABLE` se aplica). `EXPLAIN` relata `OPEN_FULL_TABLE` porque é mais caro do que `SKIP_OPEN_TABLE`.

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

Não foi fornecido um valor de busca para o nome da tabela, então o servidor deve percorrer o diretório do banco de dados `test`. Para as colunas `TABLE_NAME` e `TABLE_TYPE`, as otimizações `SKIP_OPEN_TABLE` e `OPEN_FRM_ONLY` se aplicam, respectivamente. O relatório `EXPLAIN` indica `OPEN_FRM_ONLY` porque é mais caro.

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

Para a primeira linha de saída do `EXPLAIN`: Valores constantes de busca no banco de dados e na tabela permitem que o servidor evite varreduras de diretório para valores de `TABLES`. Referências a `TABLES.TABLE_NAME` não exigem mais arquivos de tabela.

Para a segunda linha de saída do `EXPLAIN`: Todos os valores da tabela `COLUMNS` são consultas `OPEN_FRM_ONLY`, então `COLUMNS.TABLE_NAME` exige que o arquivo `.frm` seja aberto.

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

Neste caso, nenhuma otimização é aplicada porque `COLLATIONS` não é uma das tabelas do `INFORMATION_SCHEMA` para as quais estão disponíveis otimizações.
