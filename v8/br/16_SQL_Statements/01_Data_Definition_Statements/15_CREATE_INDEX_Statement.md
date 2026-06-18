### 15.1.15 Declaração CREATE INDEX

```
CREATE [UNIQUE | FULLTEXT | SPATIAL] INDEX index_name
    [index_type]
    ON tbl_name (key_part,...)
    [index_option]
    [algorithm_option | lock_option] ...

key_part: {col_name [(length)] | (expr)} [ASC | DESC]

index_option: {
    KEY_BLOCK_SIZE [=] value
  | index_type
  | WITH PARSER parser_name
  | COMMENT 'string'
  | {VISIBLE | INVISIBLE}
  | ENGINE_ATTRIBUTE [=] 'string'
  | SECONDARY_ENGINE_ATTRIBUTE [=] 'string'
}

index_type:
    USING {BTREE | HASH}

algorithm_option:
    ALGORITHM [=] {DEFAULT | INPLACE | COPY}

lock_option:
    LOCK [=] {DEFAULT | NONE | SHARED | EXCLUSIVE}
```

Normalmente, você cria todos os índices em uma tabela no momento em que a própria tabela é criada com `CREATE TABLE`. Veja a Seção 15.1.20, “Instrução CREATE TABLE”. Esta diretriz é especialmente importante para as tabelas `InnoDB`, onde a chave primária determina o layout físico das linhas no arquivo de dados. `CREATE INDEX` permite que você adicione índices a tabelas existentes.

`CREATE INDEX` é mapeado para uma instrução `ALTER TABLE` para criar índices. Veja a Seção 15.1.9, “Instrução ALTER TABLE”. `CREATE INDEX` não pode ser usado para criar um `PRIMARY KEY`; use `ALTER TABLE` em vez disso. Para mais informações sobre índices, consulte a Seção 10.3.1, “Como o MySQL Usa Índices”.

O `InnoDB` suporta índices secundários em colunas virtuais. Para mais informações, consulte a Seção 15.1.20.9, “Índices Secundários e Colunas Geradas”.

Quando a configuração `innodb_stats_persistent` estiver habilitada, execute a instrução `ANALYZE TABLE` para uma tabela `InnoDB` após criar um índice nessa tabela.

A partir do MySQL 8.0.17, o `expr` para uma especificação `key_part` pode assumir a forma `(CAST json_expression AS type ARRAY)` para criar um índice de múltiplos valores em uma coluna `JSON`. Veja Índices de Múltiplos Valores.

Uma especificação de índice do tipo `(key_part1, key_part2, ...)` cria um índice com várias partes de chave. Os valores das chaves do índice são formados pela concatenação dos valores das partes de chave fornecidas. Por exemplo, `(col1, col2, col3)` especifica um índice de múltiplas colunas com chaves de índice consistindo de valores de `col1`, `col2` e `col3`.

Uma especificação `key_part` pode terminar com `ASC` ou `DESC` para especificar se os valores de índice são armazenados em ordem crescente ou decrescente. O padrão é crescente se nenhum especificador de ordem for fornecido. `ASC` e `DESC` não são permitidos para índices `HASH`. `ASC` e `DESC` também não são suportados para índices de múltiplos valores. A partir do MySQL 8.0.12, `ASC` e `DESC` não são permitidos para índices `SPATIAL`.

As seções a seguir descrevem diferentes aspectos da declaração `CREATE INDEX`:

- Prefixo da coluna Chave de partes
- Peças-chave funcionais
- Índices Únicos
- Índices de texto completo
- Índices de múltiplos valores
- Índices Espaciais
- Opções de índice
- Opções de Copiar e Bloquear Tabelas

#### Prefixo da coluna Chave de partes

Para colunas de texto, podem ser criados índices que utilizam apenas a parte inicial dos valores das colunas, usando a sintaxe `col_name(length)` para especificar o comprimento do prefixo do índice:

- Prefixos podem ser especificados para as partes de chave `CHAR`, `VARCHAR`, `BINARY` e `VARBINARY`.

- Os prefixos *devem* ser especificados para as partes de chave `BLOB` e `TEXT`. Além disso, as colunas `BLOB` e `TEXT` só podem ser indexadas para as tabelas `InnoDB`, `MyISAM` e `BLACKHOLE`.

- Os prefixos *limits* são medidos em bytes. No entanto, os prefixos *lengths* para especificações de índice nas instruções `CREATE TABLE`, `ALTER TABLE` e `CREATE INDEX` são interpretados como número de caracteres para tipos de strings não binárias (`CHAR`, `VARCHAR`, `TEXT`) e número de bytes para tipos de strings binárias (`BINARY`, `VARBINARY`, `BLOB`). Tenha isso em mente ao especificar um comprimento de prefixo para uma coluna de string não binária que usa um conjunto de caracteres multibyte.

  O suporte a prefixos e as comprimentos dos prefixos (quando suportado) dependem do mecanismo de armazenamento. Por exemplo, um prefixo pode ter até 767 bytes de comprimento para tabelas `InnoDB` que usam o formato de linha `REDUNDANT` ou `COMPACT`. O limite de comprimento do prefixo é de 3072 bytes para tabelas `InnoDB` que usam o formato de linha `DYNAMIC` ou `COMPRESSED`. Para tabelas `MyISAM`, o limite de comprimento do prefixo é de 1000 bytes. O mecanismo de armazenamento `NDB` não suporta prefixos (veja a Seção 25.2.7.6, “Recursos Não Suportado ou Ausentes no NDB Cluster”).

Se um prefixo de índice especificado exceder o tamanho máximo do tipo de dados da coluna, o `CREATE INDEX` trata o índice da seguinte forma:

- Para um índice não único, ocorre um erro (se o modo SQL rigoroso estiver ativado) ou o comprimento do índice é reduzido para caber no tamanho máximo do tipo de dado da coluna e uma mensagem de aviso é exibida (se o modo SQL rigoroso não estiver ativado).

- Para um índice único, um erro ocorre independentemente do modo SQL, porque a redução do comprimento do índice pode permitir a inserção de entradas não únicas que não atendem ao requisito de unicidade especificado.

A declaração mostrada aqui cria um índice usando os primeiros 10 caracteres da coluna `name` (assumindo que `name` tenha um tipo de string não binário):

```
CREATE INDEX part_of_name ON customer (name(10));
```

Se os nomes na coluna geralmente diferirem nos primeiros 10 caracteres, as consultas realizadas usando esse índice não devem ser muito mais lentas do que usando um índice criado a partir de toda a coluna `name`. Além disso, o uso de prefixos de coluna para índices pode tornar o arquivo do índice muito menor, o que pode economizar muito espaço em disco e também acelerar as operações do `INSERT`.

#### Peças-chave funcionais

Um índice “normal” indexa os valores das colunas ou prefixos dos valores das colunas. Por exemplo, na tabela a seguir, a entrada do índice para uma linha específica de `t1` inclui o valor completo de `col1` e um prefixo do valor de `col2`, consistindo nos seus primeiros 10 caracteres:

```
CREATE TABLE t1 (
  col1 VARCHAR(10),
  col2 VARCHAR(20),
  INDEX (col1, col2(10))
);
```

O MySQL 8.0.13 e versões superiores suportam partes de chave funcional que indexam os valores da expressão em vez dos valores da coluna ou do prefixo da coluna. O uso de partes de chave funcional permite a indexação de valores que não estão armazenados diretamente na tabela. Exemplos:

```
CREATE TABLE t1 (col1 INT, col2 INT, INDEX func_index ((ABS(col1))));
CREATE INDEX idx1 ON t1 ((col1 + col2));
CREATE INDEX idx2 ON t1 ((col1 + col2), (col1 - col2), col1);
ALTER TABLE t1 ADD INDEX ((col1 * 40) DESC);
```

Um índice com várias partes-chave pode misturar partes-chave não funcionais e funcionais.

`ASC` e `DESC` são suportados para partes de chave funcionais.

As partes-chave funcionais devem seguir as seguintes regras. Um erro ocorre se uma definição de parte-chave contiver construções não permitidas.

- Nas definições de índices, coloque expressões entre parênteses para distingui-las de colunas ou prefixos de colunas. Por exemplo, isso é permitido; as expressões estão entre parênteses:

  ```
  INDEX ((col1 + col2), (col3 - col4))
  ```

  Isso produz um erro; as expressões não estão dentro de parênteses:

  ```
  INDEX (col1 + col2, col3 - col4)
  ```

- Uma chave funcional não pode consistir apenas no nome de uma coluna. Por exemplo, isso não é permitido:

  ```
  INDEX ((col1), (col2))
  ```

  Em vez disso, escreva as partes-chave como partes-chave não funcionais, sem parênteses:

  ```
  INDEX (col1, col2)
  ```

- Uma expressão de chave funcional não pode se referir a prefixos de coluna. Para uma solução alternativa, consulte a discussão sobre `SUBSTRING()` e `CAST()` mais adiante nesta seção.

- As partes-chave funcionais não são permitidas nas especificações de chave estrangeira.

Para `CREATE TABLE ... LIKE`, a tabela de destino preserva as partes da chave funcional da tabela original.

Os índices funcionais são implementados como colunas virtuais geradas de forma oculta, o que tem essas implicações:

- Cada parte de chave funcional conta para o limite do número total de colunas da tabela; consulte a Seção 10.4.7, “Limites de contagem de colunas da tabela e tamanho da linha”.

- As partes-chave funcionais herdam todas as restrições que se aplicam às colunas geradas. Exemplos:

  - Apenas as funções permitidas para as colunas geradas são permitidas para as partes da chave funcional.

  - Subconsultas, parâmetros, variáveis, funções armazenadas e funções carregáveis não são permitidas.

  Para obter mais informações sobre as restrições aplicáveis, consulte a Seção 15.1.20.8, “CREATE TABLE e Colunas Geradas”, e a Seção 15.1.9.2, “ALTER TABLE e Colunas Geradas”.

- A coluna gerada virtualmente não requer armazenamento. O próprio índice ocupa espaço de armazenamento como qualquer outro índice.

O `UNIQUE` é suportado para índices que incluem partes de chave funcional. No entanto, as chaves primárias não podem incluir partes de chave funcional. Uma chave primária exige que a coluna gerada seja armazenada, mas as partes de chave funcional são implementadas como colunas geradas virtuais, não como colunas geradas armazenadas.

Os índices `SPATIAL` e `FULLTEXT` não podem ter partes de chave funcional.

Se uma tabela não contiver uma chave primária, o `InnoDB` automaticamente promove o primeiro índice `UNIQUE NOT NULL` para a chave primária. Isso não é suportado para índices `UNIQUE NOT NULL` que possuem partes de chave funcional.

Os índices não funcionais alertam se houver índices duplicados. Os índices que contêm partes de chave funcional não possuem essa funcionalidade.

Para remover uma coluna que é referenciada por uma parte da chave funcional, o índice deve ser removido primeiro. Caso contrário, ocorrerá um erro.

Embora as partes de chave não funcionais suportem uma especificação de comprimento de prefixo, isso não é possível para as partes de chave funcionais. A solução é usar `SUBSTRING()` (ou `CAST()`, conforme descrito mais adiante nesta seção). Para que uma parte de chave funcional que contenha a função `SUBSTRING()` seja usada em uma consulta, a cláusula `WHERE` deve conter `SUBSTRING()` com os mesmos argumentos. No exemplo a seguir, apenas a segunda `SELECT` é capaz de usar o índice porque essa é a única consulta na qual os argumentos de `SUBSTRING()` correspondem à especificação do índice:

```
CREATE TABLE tbl (
  col1 LONGTEXT,
  INDEX idx1 ((SUBSTRING(col1, 1, 10)))
);
SELECT * FROM tbl WHERE SUBSTRING(col1, 1, 9) = '123456789';
SELECT * FROM tbl WHERE SUBSTRING(col1, 1, 10) = '1234567890';
```

As partes-chave funcionais permitem a indexação de valores que não podem ser indexados de outra forma, como os valores `JSON`. No entanto, isso deve ser feito corretamente para obter o efeito desejado. Por exemplo, essa sintaxe não funciona:

```
CREATE TABLE employees (
  data JSON,
  INDEX ((data->>'$.name'))
);
```

A sintaxe falha porque:

- O operador `->>` é traduzido para `JSON_UNQUOTE(JSON_EXTRACT(...))`.

- `JSON_UNQUOTE()` retorna um valor com um tipo de dados de `LONGTEXT`, e a coluna gerada oculta é, portanto, atribuída ao mesmo tipo de dados.

- O MySQL não pode indexar as colunas `LONGTEXT` especificadas sem um comprimento de prefixo na parte da chave, e comprimentos de prefixo não são permitidos em partes da chave funcional.

Para indexar a coluna `JSON`, você pode tentar usar a função `CAST()` da seguinte forma:

```
CREATE TABLE employees (
  data JSON,
  INDEX ((CAST(data->>'$.name' AS CHAR(30))))
);
```

A coluna gerada oculta é atribuída ao tipo de dados `VARCHAR(30)`, que pode ser indexado. Mas essa abordagem gera um novo problema ao tentar usar o índice:

- `CAST()` retorna uma string com a collation `utf8mb4_0900_ai_ci` (a collation padrão do servidor).

- `JSON_UNQUOTE()` retorna uma string com a collation `utf8mb4_bin` (hard coded).

Como resultado, há uma incompatibilidade de ordenação entre a expressão indexada na definição de tabela anterior e a expressão da cláusula `WHERE` na consulta seguinte:

```
SELECT * FROM employees WHERE data->>'$.name' = 'James';
```

O índice não é usado porque as expressões na consulta e no índice são diferentes. Para suportar esse tipo de cenário para partes de chave funcional, o otimizador remove automaticamente `CAST()` ao procurar um índice a ser usado, mas *apenas* se a collation da expressão indexada corresponder à do expressão da consulta. Para que um índice com uma parte de chave funcional seja usado, uma das duas soluções a seguir funciona (embora elas difiram um pouco em efeito):

- Solução 1. Atribua à expressão indexada a mesma codificação de caracteres que `JSON_UNQUOTE()`:

  ```
  CREATE TABLE employees (
    data JSON,
    INDEX idx ((CAST(data->>"$.name" AS CHAR(30)) COLLATE utf8mb4_bin))
  );
  INSERT INTO employees VALUES
    ('{ "name": "james", "salary": 9000 }'),
    ('{ "name": "James", "salary": 10000 }'),
    ('{ "name": "Mary", "salary": 12000 }'),
    ('{ "name": "Peter", "salary": 8000 }');
  SELECT * FROM employees WHERE data->>'$.name' = 'James';
  ```

  O operador `->>` é o mesmo que `JSON_UNQUOTE(JSON_EXTRACT(...))`, e `JSON_UNQUOTE()` retorna uma string com a collation `utf8mb4_bin`. A comparação é, portanto, sensível a maiúsculas e minúsculas, e apenas uma linha corresponde:

  ```
  +------------------------------------+
  | data                               |
  +------------------------------------+
  | {"name": "James", "salary": 10000} |
  +------------------------------------+
  ```

- Solução 2: Especifique a expressão completa na consulta:

  ```
  CREATE TABLE employees (
    data JSON,
    INDEX idx ((CAST(data->>"$.name" AS CHAR(30))))
  );
  INSERT INTO employees VALUES
    ('{ "name": "james", "salary": 9000 }'),
    ('{ "name": "James", "salary": 10000 }'),
    ('{ "name": "Mary", "salary": 12000 }'),
    ('{ "name": "Peter", "salary": 8000 }');
  SELECT * FROM employees WHERE CAST(data->>'$.name' AS CHAR(30)) = 'James';
  ```

  `CAST()` retorna uma string com a collation `utf8mb4_0900_ai_ci`, portanto, a comparação é case-insensitive e duas linhas correspondem:

  ```
  +------------------------------------+
  | data                               |
  +------------------------------------+
  | {"name": "james", "salary": 9000}  |
  | {"name": "James", "salary": 10000} |
  +------------------------------------+
  ```

Tenha em mente que, embora o otimizador suporte a remoção automática do `CAST()` com colunas geradas com índice, a seguinte abordagem não funciona porque produz um resultado diferente com e sem um índice (Bug#27337092):

```
mysql> CREATE TABLE employees (
         data JSON,
         generated_col VARCHAR(30) AS (CAST(data->>'$.name' AS CHAR(30)))
       );
Query OK, 0 rows affected, 1 warning (0.03 sec)

mysql> INSERT INTO employees (data)
       VALUES ('{"name": "james"}'), ('{"name": "James"}');
Query OK, 2 rows affected, 1 warning (0.01 sec)
Records: 2  Duplicates: 0  Warnings: 1

mysql> SELECT * FROM employees WHERE data->>'$.name' = 'James';
+-------------------+---------------+
| data              | generated_col |
+-------------------+---------------+
| {"name": "James"} | James         |
+-------------------+---------------+
1 row in set (0.00 sec)

mysql> ALTER TABLE employees ADD INDEX idx (generated_col);
Query OK, 0 rows affected, 1 warning (0.03 sec)
Records: 0  Duplicates: 0  Warnings: 1

mysql> SELECT * FROM employees WHERE data->>'$.name' = 'James';
+-------------------+---------------+
| data              | generated_col |
+-------------------+---------------+
| {"name": "james"} | james         |
| {"name": "James"} | James         |
+-------------------+---------------+
2 rows in set (0.01 sec)
```

#### Índices Únicos

Um índice `UNIQUE` cria uma restrição de forma que todos os valores no índice devem ser distintos. Um erro ocorre se você tentar adicionar uma nova linha com um valor de chave que corresponda a uma linha existente. Se você especificar um valor de prefixo para uma coluna em um índice `UNIQUE`, os valores da coluna devem ser únicos dentro do comprimento do prefixo. Um índice `UNIQUE` permite múltiplos valores `NULL` para colunas que podem conter `NULL`.

Se uma tabela tiver um índice `PRIMARY KEY` ou `UNIQUE NOT NULL` que consiste em uma única coluna com tipo inteiro, você pode usar `_rowid` para referenciar a coluna indexada nas instruções `SELECT`, da seguinte forma:

- `_rowid` se refere à coluna `PRIMARY KEY` se houver um `PRIMARY KEY` composto por uma única coluna de inteiro. Se houver um `PRIMARY KEY`, mas ele não for composto por uma única coluna de inteiro, `_rowid` não pode ser usado.

- Caso contrário, `_rowid` se refere à coluna no primeiro índice `UNIQUE NOT NULL` se esse índice consistir em uma única coluna de inteiro. Se o primeiro índice `UNIQUE NOT NULL` não consistir em uma única coluna de inteiro, `_rowid` não pode ser usado.

#### Índices de texto completo

Os índices `FULLTEXT` são suportados apenas para as tabelas `InnoDB` e `MyISAM` e podem incluir apenas as colunas `CHAR`, `VARCHAR` e `TEXT`. O índice é criado sempre sobre toda a coluna; o índice de prefixo de coluna não é suportado e qualquer comprimento de prefixo é ignorado se especificado. Consulte a Seção 14.9, “Funções de Busca de Texto Completo”, para obter detalhes sobre a operação.

#### Índices de múltiplos valores

A partir do MySQL 8.0.17, o `InnoDB` suporta índices de múltiplos valores. Um índice de múltiplos valores é um índice secundário definido em uma coluna que armazena um array de valores. Um índice “normal” tem um registro de índice para cada registro de dados (1:1). Um índice de múltiplos valores pode ter múltiplos registros de índice para um único registro de dados (N:1). Os índices de múltiplos valores são destinados para indexar arrays `JSON`. Por exemplo, um índice de múltiplos valores definido no array de códigos postais no seguinte documento JSON cria um registro de índice para cada código postal, com cada registro de índice referenciando o mesmo registro de dados.

```
{
    "user":"Bob",
    "user_id":31,
    "zipcode":[94477,94536]
}
```

##### Criando índices de múltiplos valores

Você pode criar um índice de múltiplos valores em uma declaração `CREATE TABLE`, `ALTER TABLE` ou `CREATE INDEX`. Isso requer o uso de `CAST(... AS ... ARRAY)` na definição do índice, que converte valores escalares do mesmo tipo em um array `JSON` para um array de tipos de dados SQL. Um campo virtual é então gerado de forma transparente com os valores no array de tipos de dados SQL; finalmente, um índice funcional (também conhecido como índice virtual) é criado na coluna virtual. É o índice funcional definido na coluna virtual dos valores do array de tipos de dados SQL que forma o índice de múltiplos valores.

Os exemplos na lista a seguir mostram as três maneiras diferentes de criar um índice multivalorado `zips` em um array `$.zipcode` em uma coluna `JSON` `custinfo` em uma tabela chamada `customers`. Em cada caso, o array JSON é convertido em um array de tipos de dados SQL de valores inteiros `UNSIGNED`.

- Apenas `CREATE TABLE`:

  ```
  CREATE TABLE customers (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      custinfo JSON,
      INDEX zips( (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)) )
      );
  ```

- `CREATE TABLE` mais `ALTER TABLE`:

  ```
  CREATE TABLE customers (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      custinfo JSON
      );

  ALTER TABLE customers ADD INDEX zips( (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)) );
  ```

- `CREATE TABLE` mais `CREATE INDEX`:

  ```
  CREATE TABLE customers (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      custinfo JSON
      );

  CREATE INDEX zips ON customers ( (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)) );
  ```

Um índice de múltiplos valores também pode ser definido como parte de um índice composto. Este exemplo mostra um índice composto que inclui duas partes de valor único (para as colunas `id` e `modified`) e uma parte de múltiplos valores (para a coluna `custinfo`):

```
CREATE TABLE customers (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    custinfo JSON
    );

ALTER TABLE customers ADD INDEX comp(id, modified,
    (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)) );
```

Apenas uma parte da chave de múltiplos valores pode ser usada em um índice composto. A parte da chave de múltiplos valores pode ser usada em qualquer ordem em relação às outras partes da chave. Em outras palavras, a declaração `ALTER TABLE` mostrada anteriormente poderia ter usado `comp(id, (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY), modified))` (ou qualquer outra ordem) e ainda ter sido válida.

##### Usando índices de múltiplos valores

O otimizador usa um índice de múltiplos valores para buscar registros quando as seguintes funções são especificadas em uma cláusula `WHERE`:

- `MEMBER OF()`
- `JSON_CONTAINS()`
- `JSON_OVERLAPS()`

Podemos demonstrar isso criando e preenchendo a tabela `customers` usando as seguintes instruções `CREATE TABLE` e `INSERT`:

```
mysql> CREATE TABLE customers (
    ->     id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ->     modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ->     custinfo JSON
    ->     );
Query OK, 0 rows affected (0.51 sec)

mysql> INSERT INTO customers VALUES
    ->     (NULL, NOW(), '{"user":"Jack","user_id":37,"zipcode":[94582,94536]}'),
    ->     (NULL, NOW(), '{"user":"Jill","user_id":22,"zipcode":[94568,94507,94582]}'),
    ->     (NULL, NOW(), '{"user":"Bob","user_id":31,"zipcode":[94477,94507]}'),
    ->     (NULL, NOW(), '{"user":"Mary","user_id":72,"zipcode":[94536]}'),
    ->     (NULL, NOW(), '{"user":"Ted","user_id":56,"zipcode":[94507,94582]}');
Query OK, 5 rows affected (0.07 sec)
Records: 5  Duplicates: 0  Warnings: 0
```

Primeiro, executamos três consultas na tabela `customers`, uma para cada uma das consultas `MEMBER OF()`, `JSON_CONTAINS()` e `JSON_OVERLAPS()`, com os resultados de cada consulta exibidos aqui:

```
mysql> SELECT * FROM customers
    ->     WHERE 94507 MEMBER OF(custinfo->'$.zipcode');
+----+---------------------+-------------------------------------------------------------------+
| id | modified            | custinfo                                                          |
+----+---------------------+-------------------------------------------------------------------+
|  2 | 2019-06-29 22:23:12 | {"user": "Jill", "user_id": 22, "zipcode": [94568, 94507, 94582]} |
|  3 | 2019-06-29 22:23:12 | {"user": "Bob", "user_id": 31, "zipcode": [94477, 94507]}         |
|  5 | 2019-06-29 22:23:12 | {"user": "Ted", "user_id": 56, "zipcode": [94507, 94582]}         |
+----+---------------------+-------------------------------------------------------------------+
3 rows in set (0.00 sec)

mysql> SELECT * FROM customers
    ->     WHERE JSON_CONTAINS(custinfo->'$.zipcode', CAST('[94507,94582]' AS JSON));
+----+---------------------+-------------------------------------------------------------------+
| id | modified            | custinfo                                                          |
+----+---------------------+-------------------------------------------------------------------+
|  2 | 2019-06-29 22:23:12 | {"user": "Jill", "user_id": 22, "zipcode": [94568, 94507, 94582]} |
|  5 | 2019-06-29 22:23:12 | {"user": "Ted", "user_id": 56, "zipcode": [94507, 94582]}         |
+----+---------------------+-------------------------------------------------------------------+
2 rows in set (0.00 sec)

mysql> SELECT * FROM customers
    ->     WHERE JSON_OVERLAPS(custinfo->'$.zipcode', CAST('[94507,94582]' AS JSON));
+----+---------------------+-------------------------------------------------------------------+
| id | modified            | custinfo                                                          |
+----+---------------------+-------------------------------------------------------------------+
|  1 | 2019-06-29 22:23:12 | {"user": "Jack", "user_id": 37, "zipcode": [94582, 94536]}        |
|  2 | 2019-06-29 22:23:12 | {"user": "Jill", "user_id": 22, "zipcode": [94568, 94507, 94582]} |
|  3 | 2019-06-29 22:23:12 | {"user": "Bob", "user_id": 31, "zipcode": [94477, 94507]}         |
|  5 | 2019-06-29 22:23:12 | {"user": "Ted", "user_id": 56, "zipcode": [94507, 94582]}         |
+----+---------------------+-------------------------------------------------------------------+
4 rows in set (0.00 sec)
```

Em seguida, executamos `EXPLAIN` em cada uma das três consultas anteriores:

```
mysql> EXPLAIN SELECT * FROM customers
    ->     WHERE 94507 MEMBER OF(custinfo->'$.zipcode');
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | customers | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    5 |   100.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM customers
    ->     WHERE JSON_CONTAINS(custinfo->'$.zipcode', CAST('[94507,94582]' AS JSON));
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | customers | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    5 |   100.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM customers
    ->     WHERE JSON_OVERLAPS(custinfo->'$.zipcode', CAST('[94507,94582]' AS JSON));
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | customers | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    5 |   100.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.01 sec)
```

Nenhuma das três consultas mostradas acima consegue usar nenhuma chave. Para resolver esse problema, podemos adicionar um índice de múltiplos valores na matriz `zipcode` na coluna `JSON` (`custinfo`), da seguinte forma:

```
mysql> ALTER TABLE customers
    ->     ADD INDEX zips( (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)) );
Query OK, 0 rows affected (0.47 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

Quando executamos as declarações anteriores `EXPLAIN` novamente, podemos observar agora que as consultas podem (e fazem) usar o índice `zips` que acabou de ser criado:

```
mysql> EXPLAIN SELECT * FROM customers
    ->     WHERE 94507 MEMBER OF(custinfo->'$.zipcode');
+----+-------------+-----------+------------+------+---------------+------+---------+-------+------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref   | rows | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+-------+------+----------+-------------+
|  1 | SIMPLE      | customers | NULL       | ref  | zips          | zips | 9       | const |    1 |   100.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+-------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM customers
    ->     WHERE JSON_CONTAINS(custinfo->'$.zipcode', CAST('[94507,94582]' AS JSON));
+----+-------------+-----------+------------+-------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table     | partitions | type  | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-----------+------------+-------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | customers | NULL       | range | zips          | zips | 9       | NULL |    6 |   100.00 | Using where |
+----+-------------+-----------+------------+-------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM customers
    ->     WHERE JSON_OVERLAPS(custinfo->'$.zipcode', CAST('[94507,94582]' AS JSON));
+----+-------------+-----------+------------+-------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table     | partitions | type  | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-----------+------------+-------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | customers | NULL       | range | zips          | zips | 9       | NULL |    6 |   100.00 | Using where |
+----+-------------+-----------+------------+-------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.01 sec)
```

Um índice de múltiplos valores pode ser definido como uma chave única. Se definido como uma chave única, tentar inserir um valor já presente no índice de múltiplos valores retorna um erro de chave duplicada. Se valores duplicados já estiverem presentes, tentar adicionar um índice de múltiplos valores único falha, como mostrado aqui:

```
mysql> ALTER TABLE customers DROP INDEX zips;
Query OK, 0 rows affected (0.55 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> ALTER TABLE customers
    ->     ADD UNIQUE INDEX zips((CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)));
ERROR 1062 (23000): Duplicate entry '[94507, ' for key 'customers.zips'
mysql> ALTER TABLE customers
    ->     ADD INDEX zips((CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)));
Query OK, 0 rows affected (0.36 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

##### Características dos índices de múltiplos valores

Os índices de múltiplos valores têm as características adicionais listadas aqui:

- As operações DML que afetam índices de múltiplos valores são tratadas da mesma maneira que as operações DML que afetam um índice normal, com a única diferença de que pode haver mais de um inserção ou atualização para um único registro de índice agrupado.

- Nulabilidade e índices de múltiplos valores:

  - Se uma parte de chave de múltiplos valores tiver um array vazio, nenhuma entrada será adicionada ao índice, e o registro de dados não será acessível por meio de uma varredura de índice.

  - Se a geração de partes de chave de múltiplos valores retornar um valor `NULL`, uma única entrada contendo `NULL` será adicionada ao índice de múltiplos valores. Se a parte da chave for definida como `NOT NULL`, um erro será relatado.

  - Se a coluna do array de tipos for definida como `NULL`, o mecanismo de armazenamento armazena um único registro contendo `NULL` que aponta para o registro de dados.

  - Valores nulos `JSON` não são permitidos em arrays indexados. Se qualquer valor retornado for `NULL`, ele é tratado como um valor JSON nulo e um erro de valor JSON inválido é relatado.

- Como os índices de múltiplos valores são índices virtuais em colunas virtuais, eles devem seguir as mesmas regras que os índices secundários em colunas geradas virtualmente.

- Os registros do índice não são adicionados para arrays vazios.

##### Limitações e restrições para índices de múltiplos valores

Os índices de múltiplos valores estão sujeitos às limitações e restrições listadas aqui:

- Apenas uma parte de chave múltipla é permitida por índice múltipla. No entanto, a expressão `CAST(... AS ... ARRAY)` pode se referir a múltiplos arrays dentro de um documento `JSON`, como mostrado aqui:

  ```
  CAST(data->'$.arr[*][*]' AS UNSIGNED ARRAY)
  ```

  Neste caso, todos os valores que correspondem à expressão JSON são armazenados no índice como um único array plano.

- Um índice com uma parte de chave de múltiplos valores não suporta a ordenação e, portanto, não pode ser usado como chave primária. Por esse mesmo motivo, um índice de múltiplos valores não pode ser definido usando as palavras-chave `ASC` ou `DESC`.

- Um índice de múltiplos valores não pode ser um índice de cobertura.

- O número máximo de valores por registro para um índice de múltiplos valores é determinado pela quantidade de dados que podem ser armazenados em uma única página de log de desfazer, que é de 65.221 bytes (64K menos 315 bytes de overhead), o que significa que o comprimento total máximo dos valores de chave também é de 65.221 bytes. O número máximo de chaves depende de vários fatores, o que impede a definição de um limite específico. Testes mostraram que um índice de múltiplos valores permite até 1.604 chaves inteiras por registro, por exemplo. Quando o limite é atingido, um erro semelhante ao seguinte é relatado: ERRO 3905 (HY000): Excedeu o número máximo de valores por registro para o índice de múltiplos valores 'idx' por 1 valor(es).

- O único tipo de expressão permitido em uma parte de chave de múltiplos valores é uma expressão `JSON`. A expressão não precisa referenciar um elemento existente em um documento JSON inserido na coluna indexada, mas deve ser sintaticamente válida.

- Como os registros de índice para o mesmo registro de índice agrupado estão dispersos em um índice de múltiplos valores, um índice de múltiplos valores não suporta varreduras de intervalo ou varreduras apenas de índice.

- Os índices de múltiplos valores não são permitidos nas especificações de chave estrangeira.

- Os prefixos de índice não podem ser definidos para índices de múltiplos valores.

- Índices de múltiplos valores não podem ser definidos em dados representados como `BINARY` (consulte a descrição da função `CAST()`).

- A criação online de um índice de múltiplos valores não é suportada, o que significa que a operação usa `ALGORITHM=COPY`. Veja Requisitos de desempenho e espaço.

- Os conjuntos de caracteres e as ordenações que não sejam as seguintes combinações de conjunto de caracteres e ordenação não são suportadas para índices de múltiplos valores:

  1. O conjunto de caracteres `binary` com a concordância padrão `binary`

  2. O conjunto de caracteres `utf8mb4` com a concordância padrão `utf8mb4_0900_as_cs`.

- Assim como outros índices em colunas de tabelas `InnoDB`, um índice de múltiplos valores não pode ser criado com `USING HASH`; tentar fazê-lo resulta em um aviso: Este mecanismo de armazenamento não suporta o algoritmo de índice HASH, o mecanismo de armazenamento padrão foi usado em vez disso. (`USING BTREE` é suportado como de costume.)

#### Índices Espaciais

Os motores de armazenamento `MyISAM`, `InnoDB`, `NDB` e `ARCHIVE` suportam colunas espaciais como `POINT` e `GEOMETRY`. (A seção 13.4, “Tipos de dados espaciais”, descreve os tipos de dados espaciais.) No entanto, o suporte para indexação de colunas espaciais varia entre os motores. Índices espaciais e não espaciais em colunas espaciais estão disponíveis de acordo com as seguintes regras.

Os índices espaciais em colunas espaciais têm essas características:

- Disponível apenas para as tabelas `InnoDB` e `MyISAM`. Especificar `SPATIAL INDEX` para outros motores de armazenamento resulta em um erro.

- A partir do MySQL 8.0.12, um índice em uma coluna espacial *deve* ser um índice `SPATIAL`. A palavra-chave `SPATIAL` é, portanto, opcional, mas implícita para criar um índice em uma coluna espacial.

- Disponível apenas para colunas espaciais individuais. Não é possível criar um índice espacial sobre múltiplas colunas espaciais.

- As colunas indexadas devem ser `NOT NULL`.

- As comprimentos dos prefixos das colunas são proibidos. A largura total de cada coluna é indexada.

- Não é permitido para uma chave primária ou índice único.

Os índices não espaciais em colunas espaciais (criados com `INDEX`, `UNIQUE` ou `PRIMARY KEY`) têm essas características:

- Permitido para qualquer mecanismo de armazenamento que suporte colunas espaciais, exceto `ARCHIVE`.

- As colunas podem ser `NULL` a menos que o índice seja uma chave primária.

- O tipo de índice para um índice não `SPATIAL` depende do mecanismo de armazenamento. Atualmente, o B-tree é usado.

- Permitido para uma coluna que pode ter valores `NULL` apenas para as tabelas `InnoDB`, `MyISAM` e `MEMORY`.

#### Opções de índice

Após a lista de partes-chave, as opções de índice podem ser fornecidas. Um valor `index_option` pode ser qualquer um dos seguintes:

- `KEY_BLOCK_SIZE [=] value`

  Para as tabelas `MyISAM`, `KEY_BLOCK_SIZE` especifica opcionalmente o tamanho em bytes a ser usado para os blocos de chave de índice. O valor é tratado como um indicativo; um tamanho diferente pode ser usado, se necessário. Um valor `KEY_BLOCK_SIZE` especificado para uma definição de índice individual substitui um valor `KEY_BLOCK_SIZE` em nível de tabela.

  `KEY_BLOCK_SIZE` não é suportado no nível de índice para tabelas de `InnoDB`. Veja a Seção 15.1.20, “Instrução CREATE TABLE”.

- `index_type`

  Alguns motores de armazenamento permitem que você especifique um tipo de índice ao criar um índice. Por exemplo:

  ```
  CREATE TABLE lookup (id INT) ENGINE = MEMORY;
  CREATE INDEX id_index ON lookup (id) USING BTREE;
  ```

  A Tabela 15.1, “Tipos de índice por motor de armazenamento”, mostra os valores permitidos dos tipos de índice suportados por diferentes motores de armazenamento. Quando vários tipos de índice são listados, o primeiro é o padrão quando não é fornecido um especificador de tipo de índice. Motores de armazenamento não listados na tabela não suportam a cláusula `index_type` nas definições de índices.

  **Tabela 15.1 Tipos de índice por motor de armazenamento**

  <table summary="Tipos de índice permitidos pelo motor de armazenamento."><thead><tr> <th>Motor de Armazenamento</th> <th>Tipos de índice permitidos</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>BTREE</code>]</td> <td>[[PH_HTML_CODE_<code>BTREE</code>]</td> </tr><tr> <td>[[<code>MyISAM</code>]]</td> <td>[[<code>BTREE</code>]]</td> </tr><tr> <td>[[<code>MEMORY</code>]]/[[<code>HEAP</code>]]</td> <td>[[<code>HASH</code>]], [[<code>BTREE</code>]]</td> </tr><tr> <td>[[<code>NDB</code>]]</td> <td>[[<code>HASH</code>]], [[<code>BTREE</code>]] (ver nota no texto)</td> </tr></tbody></table>

  A cláusula `index_type` não pode ser usada para especificações de `FULLTEXT INDEX` ou `SPATIAL INDEX` (antes do MySQL 8.0.12). A implementação de índices de texto completo depende do mecanismo de armazenamento. Os índices espaciais são implementados como índices R-tree.

  Se você especificar um tipo de índice que não é válido para um determinado mecanismo de armazenamento, mas outro tipo de índice está disponível e o mecanismo pode usá-lo sem afetar os resultados das consultas, o mecanismo usa o tipo disponível. O analisador reconhece `RTREE` como um nome de tipo. A partir do MySQL 8.0.12, isso é permitido apenas para índices `SPATIAL`. Antes do 8.0.12, `RTREE` não pode ser especificado para nenhum mecanismo de armazenamento.

  Os índices `BTREE` são implementados pelo mecanismo de armazenamento `NDB` como índices T-tree.

  Nota

  Para índices nas colunas da tabela `NDB`, a opção `USING` pode ser especificada apenas para um índice único ou chave primária. `USING HASH` impede a criação de um índice ordenado; caso contrário, a criação de um índice único ou chave primária em uma tabela `NDB` resulta automaticamente na criação de ambos um índice ordenado e um índice hash, cada um dos quais indexa o mesmo conjunto de colunas.

  Para índices únicos que incluem uma ou mais colunas `NULL` de uma tabela `NDB`, o índice de hash pode ser usado apenas para procurar valores literais, o que significa que as condições `IS [NOT] NULL` exigem uma varredura completa da tabela. Uma solução é garantir que um índice único usando uma ou mais colunas `NULL` nessa tabela seja sempre criado de maneira que inclua o índice ordenado; ou seja, evite usar `USING HASH` ao criar o índice.

  Se você especificar um tipo de índice que não é válido para um determinado mecanismo de armazenamento, mas outro tipo de índice está disponível e o mecanismo pode usá-lo sem afetar os resultados das consultas, o mecanismo usa o tipo disponível. O analisador reconhece `RTREE` como um nome de tipo, mas atualmente isso não pode ser especificado para nenhum mecanismo de armazenamento.

  Nota

  O uso da opção `index_type` antes da cláusula `ON tbl_name` é desaconselhável; espera-se que o suporte para o uso da opção nessa posição seja removido em uma futura versão do MySQL. Se uma opção `index_type` for fornecida tanto na posição anterior quanto na posterior, a opção final será aplicada.

  `TYPE type_name` é reconhecido como sinônimo de `USING type_name`. No entanto, `USING` é a forma preferida.

  As tabelas a seguir mostram as características do índice para os motores de armazenamento que suportam a opção `index_type`.

  **Tabela 15.2 Características do Engate de Armazenamento InnoDB**

  <table summary="Características do índice do motor de armazenamento InnoDB."><thead><tr> <th scope="col">Classe de índice</th> <th scope="col">Tipo de índice</th> <th scope="col">Armazene valores NULL</th> <th scope="col">Permite múltiplos valores NULL</th> <th scope="col">Tipo de varredura IS NULL</th> <th scope="col">Não é NULL Tipo de varredura</th> </tr></thead><tbody><tr> <th>Chave primária</th> <td>[[<code>BTREE</code>]]</td> <td>Não</td> <td>Não</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th>Único</th> <td>[[<code>BTREE</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th>Chave</th> <td>[[<code>BTREE</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th>[[<code>FULLTEXT</code>]]</th> <td>N/A</td> <td>Sim</td> <td>Sim</td> <td>Tabela</td> <td>Tabela</td> </tr><tr> <th>[[<code>SPATIAL</code>]]</th> <td>N/A</td> <td>Não</td> <td>Não</td> <td>N/A</td> <td>N/A</td> </tr></tbody></table>

  **Tabela 15.3 Características do Motor de Armazenamento MyISAM**

  <table summary="Características do índice do motor de armazenamento MyISAM."><thead><tr> <th scope="col">Classe de índice</th> <th scope="col">Tipo de índice</th> <th scope="col">Armazene valores NULL</th> <th scope="col">Permite múltiplos valores NULL</th> <th scope="col">Tipo de varredura IS NULL</th> <th scope="col">Não é NULL Tipo de varredura</th> </tr></thead><tbody><tr> <th>Chave primária</th> <td>[[<code>BTREE</code>]]</td> <td>Não</td> <td>Não</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th>Único</th> <td>[[<code>BTREE</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th>Chave</th> <td>[[<code>BTREE</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th>[[<code>FULLTEXT</code>]]</th> <td>N/A</td> <td>Sim</td> <td>Sim</td> <td>Tabela</td> <td>Tabela</td> </tr><tr> <th>[[<code>SPATIAL</code>]]</th> <td>N/A</td> <td>Não</td> <td>Não</td> <td>N/A</td> <td>N/A</td> </tr></tbody></table>

  **Tabela 15.4 Características do Índice do Motor de Armazenamento de MEMÓRIA**

  <table summary="Características do índice do motor de armazenamento de memória."><thead><tr> <th scope="col">Classe de índice</th> <th scope="col">Tipo de índice</th> <th scope="col">Armazene valores NULL</th> <th scope="col">Permite múltiplos valores NULL</th> <th scope="col">Tipo de varredura IS NULL</th> <th scope="col">Não é NULL Tipo de varredura</th> </tr></thead><tbody><tr> <th>Chave primária</th> <td>[[<code>BTREE</code>]]</td> <td>Não</td> <td>Não</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th>Único</th> <td>[[<code>BTREE</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th>Chave</th> <td>[[<code>BTREE</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th>Chave primária</th> <td>[[<code>HASH</code>]]</td> <td>Não</td> <td>Não</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th>Único</th> <td>[[<code>HASH</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th>Chave</th> <td>[[<code>HASH</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr></tbody></table>

  **Tabela 15.5 Características do Índice do Motor de Armazenamento NDB**

  <table summary="Características do índice do motor de armazenamento NDB."><thead><tr> <th scope="col">Classe de índice</th> <th scope="col">Tipo de índice</th> <th scope="col">Armazene valores NULL</th> <th scope="col">Permite múltiplos valores NULL</th> <th scope="col">Tipo de varredura IS NULL</th> <th scope="col">Não é NULL Tipo de varredura</th> </tr></thead><tbody><tr> <th>Chave primária</th> <td>[[<code>BTREE</code>]]</td> <td>Não</td> <td>Não</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th>Único</th> <td>[[<code>BTREE</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th>Chave</th> <td>[[<code>BTREE</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th>Chave primária</th> <td>[[<code>HASH</code>]]</td> <td>Não</td> <td>Não</td> <td>Tabela (ver nota 1)</td> <td>Tabela (ver nota 1)</td> </tr><tr> <th>Único</th> <td>[[<code>HASH</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Tabela (ver nota 1)</td> <td>Tabela (ver nota 1)</td> </tr><tr> <th>Chave</th> <td>[[<code>HASH</code>]]</td> <td>Sim</td> <td>Sim</td> <td>Tabela (ver nota 1)</td> <td>Tabela (ver nota 1)</td> </tr></tbody></table>

  Nota da tabela:

  1. `USING HASH` impede a criação de um índice ordenado implícito.

- `WITH PARSER parser_name`

  Esta opção só pode ser usada com índices `FULLTEXT`. Ela associa um plugin de processamento de texto a esse índice se as operações de indexação e busca de texto completo necessitarem de tratamento especial. Os índices `InnoDB` e `MyISAM` suportam plugins de processamento de texto de texto completo. Se você tiver uma tabela `MyISAM` com um plugin de processamento de texto de texto completo associado, você pode converter a tabela para `InnoDB` usando `ALTER TABLE`. Consulte Plugins de processamento de texto completo e como escrever plugins de processamento de texto completo para obter mais informações.

- `COMMENT 'string'`

  As definições do índice podem incluir um comentário opcional de até 1024 caracteres.

  O `MERGE_THRESHOLD` para páginas de índice pode ser configurado para índices individuais usando a cláusula `index_option` `COMMENT` da instrução `CREATE INDEX`. Por exemplo:

  ```
  CREATE TABLE t1 (id INT);
  CREATE INDEX id_index ON t1 (id) COMMENT 'MERGE_THRESHOLD=40';
  ```

  Se a porcentagem de página cheia para uma página de índice cair abaixo do valor `MERGE_THRESHOLD` quando uma linha é excluída ou quando uma linha é encurtada por uma operação de atualização, o `InnoDB` tenta combinar a página de índice com uma página de índice vizinha. O valor padrão `MERGE_THRESHOLD` é 50, que é o valor previamente codificado.

  `MERGE_THRESHOLD` também pode ser definido no nível de índice e tabela usando as instruções `CREATE TABLE` e `ALTER TABLE`. Para mais informações, consulte a Seção 17.8.11, “Configurando o Limiar de Fusão para Páginas de Índice”.

- `VISIBLE`, `INVISIBLE`

  Especifique a visibilidade do índice. Os índices são visíveis por padrão. Um índice invisível não é usado pelo otimizador. A especificação da visibilidade do índice se aplica a índices que não sejam chaves primárias (explícitos ou implícitos). Para mais informações, consulte a Seção 10.3.12, “Índices Invisíveis”.

- As opções `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` (disponíveis a partir do MySQL 8.0.21) são usadas para especificar atributos de índice para motores de armazenamento primário e secundário. As opções são reservadas para uso futuro.

  Os valores permitidos são uma literal de string que contém um documento válido `JSON` ou uma string vazia (''). O `JSON` inválido é rejeitado.

  ```
  CREATE INDEX i1 ON t1 (c1) ENGINE_ATTRIBUTE='{"key":"value"}';
  ```

  Os valores `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` podem ser repetidos sem erros. Nesse caso, o último valor especificado é usado.

  Os valores `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` não são verificados pelo servidor, nem são apagados quando o mecanismo de armazenamento da tabela é alterado.

#### Opções de Copiar e Bloquear Tabelas

As cláusulas `ALGORITHM` e `LOCK` podem ser usadas para influenciar o método de cópia da tabela e o nível de concorrência para leitura e escrita da tabela enquanto seus índices estão sendo modificados. Elas têm o mesmo significado que a declaração `ALTER TABLE`. Para mais informações, consulte a Seção 15.1.9, “Declaração ALTER TABLE”

O NDB Cluster suporta operações online usando a mesma sintaxe `ALGORITHM=INPLACE` usada com o servidor MySQL padrão. Consulte a Seção 25.6.12, “Operações online com ALTER TABLE no NDB Cluster”, para obter mais informações.
