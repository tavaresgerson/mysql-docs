### 15.1.18 Declaração `CREATE INDEX`

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

Normalmente, você cria todos os índices em uma tabela no momento em que a própria tabela é criada com `CREATE TABLE`. Veja a Seção 15.1.24, “Declaração CREATE TABLE”. Esta diretriz é especialmente importante para tabelas `InnoDB`, onde a chave primária determina o layout físico das linhas no arquivo de dados. `CREATE INDEX` permite que você adicione índices a tabelas existentes.

`CREATE INDEX` é mapeado a uma declaração `ALTER TABLE` para criar índices. Veja a Seção 15.1.11, “Declaração ALTER TABLE”. `CREATE INDEX` não pode ser usado para criar uma `PRIMARY KEY`; use `ALTER TABLE` em vez disso. Para mais informações sobre índices, veja a Seção 10.3.1, “Como o MySQL Usa Índices”.

`InnoDB` suporta índices secundários em colunas virtuais. Para mais informações, veja a Seção 15.1.24.9, “Índices Secundários e Colunas Geradas”.

Quando a configuração `innodb_stats_persistent` é habilitada, execute a declaração `ANALYZE TABLE` para uma tabela `InnoDB` após criar um índice naquela tabela.

A *`expr`* para uma especificação de *`key_part`* também pode ter a forma `(CAST json_expression AS type ARRAY)` para criar um índice de múltiplos valores em uma coluna `JSON`. Veja Índices de Múltiplos Valores.

Uma especificação de índice na forma `(key_part1, key_part2, ...)` cria um índice com múltiplas partes de chave. Os valores da chave do índice são formados concatenando os valores das partes de chave fornecidas. Por exemplo, `(col1, col2, col3)` especifica um índice de múltiplas colunas com chaves de índice consistindo em valores de `col1`, `col2` e `col3`.

Uma especificação de *`key_part`* pode terminar com `ASC` ou `DESC` para especificar se os valores dos índices são armazenados em ordem ascendente ou descendente. O padrão é ascendente se nenhum especificador de ordem for fornecido.

`ASC` e `DESC` não são suportados para índices `HASH`, índices de múltiplos valores ou índices `SPATIAL`.

As seções a seguir descrevem diferentes aspectos da instrução `CREATE INDEX`:

* Partes do prefixo da coluna
* Partes funcionais da chave
* Índices únicos
* Índices de texto completo
* Índices de valores múltiplos
* Índices espaciais
* Opções de índice
* Opções de cópia e bloqueio da tabela

#### Partes do prefixo da coluna

Para colunas de texto, índices podem ser criados que usam apenas a parte inicial dos valores da coluna, usando a sintaxe `col_name(length)` para especificar o comprimento do prefixo do índice:

* Prefixos podem ser especificados para as partes de chave `CHAR`, `VARCHAR`, `BINARY` e `VARBINARY`.

* Prefixos *devem* ser especificados para as partes de chave `BLOB` e `TEXT`. Além disso, as colunas `BLOB` e `TEXT` podem ser indexadas apenas para tabelas `InnoDB`, `MyISAM` e `BLACKHOLE`.

* Os *limites* de prefixo são medidos em bytes. No entanto, os *comprimentos* de prefixo para especificações de índice nas instruções `CREATE TABLE`, `ALTER TABLE` e `CREATE INDEX` são interpretados como número de caracteres para tipos de string não binários (`CHAR`, `VARCHAR`, `TEXT`) e número de bytes para tipos de string binários (`BINARY`, `VARBINARY`, `BLOB`). Tenha isso em mente ao especificar um comprimento de prefixo para uma coluna de string não binária que usa um conjunto de caracteres multibyte.

* O suporte a prefixos e os comprimentos dos prefixos (onde suportado) dependem do mecanismo de armazenamento. Por exemplo, um prefixo pode ter até 767 bytes de comprimento para tabelas `InnoDB` que usam o formato de linha `REDUNDANT` ou `COMPACT`. O limite de comprimento do prefixo é de 3072 bytes para tabelas `InnoDB` que usam o formato de linha `DYNAMIC` ou `COMPRESSED`. Para tabelas `MyISAM`, o limite de comprimento do prefixo é de 1000 bytes. O mecanismo de armazenamento `NDB` não suporta prefixos (veja a Seção 25.2.7.6, “Recursos não suportados ou ausentes no NDB Cluster”).

Se um prefixo especificado de índice exceder o tamanho máximo do tipo de dado da coluna, o `CREATE INDEX` trata o índice da seguinte forma:

* Para um índice não único, ocorre um erro (se o modo SQL rigoroso estiver habilitado) ou o comprimento do índice é reduzido para caber no tamanho máximo do tipo de dado da coluna e uma mensagem de aviso é gerada (se o modo SQL rigoroso não estiver habilitado).

* Para um índice único, ocorre um erro, independentemente do modo SQL, porque a redução do comprimento do índice pode permitir a inserção de entradas não únicas que não atendem ao requisito de unicidade especificado.

A declaração mostrada aqui cria um índice usando os primeiros 10 caracteres da coluna `name` (assumindo que `name` tem um tipo de string não binário):

```
CREATE INDEX part_of_name ON customer (name(10));
```

Se os nomes na coluna geralmente diferirem nos primeiros 10 caracteres, as consultas realizadas usando este índice não devem ser muito mais lentas do que usar um índice criado a partir de toda a coluna `name`. Além disso, o uso de prefixos de coluna para índices pode tornar o arquivo de índice muito menor, o que poderia economizar muito espaço em disco e também poderia acelerar as operações de `INSERT`.

#### Partes Funcionais da Chave

Um “normal” índice indexa os valores da coluna ou prefixos dos valores da coluna. Por exemplo, na tabela a seguir, a entrada do índice para uma determinada linha `t1` inclui o valor completo de `col1` e um prefixo do valor de `col2`, consistindo em seus primeiros 10 caracteres:

```
CREATE TABLE t1 (
  col1 VARCHAR(10),
  col2 VARCHAR(20),
  INDEX (col1, col2(10))
);
```

Partes funcionais da chave que indexam valores de expressão também podem ser usadas no lugar de valores de coluna ou prefixos de coluna. O uso de partes funcionais da chave permite a indexação de valores que não são armazenados diretamente na tabela. Exemplos:

```
CREATE TABLE t1 (col1 INT, col2 INT, INDEX func_index ((ABS(col1))));
CREATE INDEX idx1 ON t1 ((col1 + col2));
CREATE INDEX idx2 ON t1 ((col1 + col2), (col1 - col2), col1);
ALTER TABLE t1 ADD INDEX ((col1 * 40) DESC);
```

Um índice com várias partes funcionais da chave pode misturar partes funcionais e não funcionais da chave.

`ASC` e `DESC` são suportados para partes funcionais da chave.

Partes funcionais da chave devem aderir às seguintes regras. Um erro ocorre se uma definição de parte da chave contiver construções não permitidas.

* Nas definições de índices, coloque expressões entre parênteses para distingui-las de colunas ou prefixos de coluna. Por exemplo, isso é permitido; as expressões estão entre parênteses:

  ```
  INDEX ((col1 + col2), (col3 - col4))
  ```

  Isso produz um erro; as expressões não estão entre parênteses:

  ```
  INDEX (col1 + col2, col3 - col4)
  ```

* Uma parte funcional da chave não pode consistir apenas em um nome de coluna. Por exemplo, isso não é permitido:

  ```
  INDEX ((col1), (col2))
  ```

  Em vez disso, escreva as partes da chave como partes da chave não funcionais, sem parênteses:

  ```
  INDEX (col1, col2)
  ```

* Uma expressão de parte funcional da chave não pode referenciar prefixos de coluna. Para uma solução alternativa, consulte a discussão sobre `SUBSTRING()` e `CAST()` mais adiante nesta seção.

* Partes da chave funcionais não são permitidas nas especificações de chave estrangeira.

Para `CREATE TABLE ... LIKE`, a tabela de destino preserva as partes da chave funcionais da tabela original.

Índices funcionais são implementados como colunas virtuais geradas ocultas, o que tem essas implicações:

* Cada parte funcional da chave conta para o limite do número total de colunas da tabela; consulte Seção 10.4.7, “Limites de Número de Colunas da Tabela e Tamanho da Linha”.

* As partes da chave funcionais herdam todas as restrições que se aplicam a colunas geradas. Exemplos:

  + Apenas funções permitidas para colunas geradas são permitidas para partes da chave funcionais.

  + Subconsultas, parâmetros, variáveis, funções armazenadas e funções carregáveis não são permitidas.

Para mais informações sobre as restrições aplicáveis, consulte Seção 15.1.24.8, “CREATE TABLE e Colunas Geradas”, e Seção 15.1.11.2, “ALTER TABLE e Colunas Geradas”.

* A própria coluna gerada virtual não requer armazenamento. O próprio índice ocupa espaço de armazenamento como qualquer outro índice.

`UNIQUE` é suportado para índices que incluem partes de chave funcional. No entanto, as chaves primárias não podem incluir partes de chave funcional. Uma chave primária exige que a coluna gerada seja armazenada, mas as partes de chave funcional são implementadas como colunas geradas virtuais, não colunas geradas armazenadas.

Os índices `SPATIAL` e `FULLTEXT` não podem ter partes de chave funcional.

Se uma tabela não contém uma chave primária, o `InnoDB` promove automaticamente o primeiro índice `UNIQUE NOT NULL` para a chave primária. Isso não é suportado para índices `UNIQUE NOT NULL` que têm partes de chave funcional.

Indicações não funcionais geram uma mensagem de aviso se houver índices duplicados. Indíces que contêm partes de chave funcional não têm essa funcionalidade.

Para remover uma coluna que é referenciada por uma parte de chave funcional, o índice deve ser removido primeiro. Caso contrário, ocorre um erro.

Embora as partes de chave não funcionais suportem uma especificação de comprimento de prefixo, isso não é possível para as partes de chave funcional. A solução é usar `SUBSTRING()` (ou `CAST()`, conforme descrito mais adiante nesta seção). Para que uma parte de chave funcional contendo a função `SUBSTRING()` seja usada em uma consulta, a cláusula `WHERE` deve conter `SUBSTRING()` com os mesmos argumentos. No exemplo a seguir, apenas o segundo `SELECT` é capaz de usar o índice porque essa é a única consulta na qual os argumentos de `SUBSTRING()` correspondem à especificação do índice:

```
CREATE TABLE tbl (
  col1 LONGTEXT,
  INDEX idx1 ((SUBSTRING(col1, 1, 10)))
);
SELECT * FROM tbl WHERE SUBSTRING(col1, 1, 9) = '123456789';
SELECT * FROM tbl WHERE SUBSTRING(col1, 1, 10) = '1234567890';
```

As partes de chave funcional permitem a indexação de valores que não poderiam ser indexados de outra forma, como valores `JSON`. No entanto, isso deve ser feito corretamente para obter o efeito desejado. Por exemplo, essa sintaxe não funciona:

```
CREATE TABLE employees (
  data JSON,
  INDEX ((data->>'$.name'))
);
```

A sintaxe falha porque:

* O operador `->>` se traduz em `JSON_UNQUOTE(JSON_EXTRACT(...))`.

* `JSON_UNQUOTE()` retorna um valor com um tipo de dados de `LONGTEXT`, e a coluna gerada oculta é, portanto, atribuída ao mesmo tipo de dados.

* O MySQL não pode indexar colunas `LONGTEXT` especificadas sem um comprimento de prefixo na parte da chave, e comprimentos de prefixo não são permitidos em partes da chave funcionais.

Para indexar a coluna `JSON`, você pode tentar usar a função `CAST()` da seguinte forma:

```
CREATE TABLE employees (
  data JSON,
  INDEX ((CAST(data->>'$.name' AS CHAR(30))))
);
```

A coluna gerada oculta é atribuída ao tipo de dados `VARCHAR(30)`, que pode ser indexado. Mas essa abordagem produz um novo problema ao tentar usar o índice:

* `CAST()` retorna uma string com a collation `utf8mb4_0900_ai_ci` (a collation padrão do servidor).

* `JSON_UNQUOTE()` retorna uma string com a collation `utf8mb4_bin` (hard coded).

Como resultado, há uma incompatibilidade de collation entre a expressão indexada na definição da tabela anterior e a expressão da cláusula `WHERE` na seguinte consulta:

```
SELECT * FROM employees WHERE data->>'$.name' = 'James';
```

O índice não é usado porque as expressões na consulta e no índice diferem. Para suportar esse tipo de cenário para partes de chave funcionais, o otimizador remove automaticamente `CAST()` ao procurar um índice para usar, mas *apenas* se a collation da expressão indexada corresponder à da expressão da consulta. Para que um índice com uma parte de chave funcional seja usado, uma das duas soluções a seguir funciona (embora elas difiram um pouco em efeito):

* Solução 1. Atribua a expressão indexada a mesma collation que `JSON_UNQUOTE()`:

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

  O operador `->>` é o mesmo que `JSON_UNQUOTE(JSON_EXTRACT(...))`, e `JSON_UNQUOTE()` retorna uma string com collation `utf8mb4_bin`. A comparação é, portanto, sensível ao caso, e apenas uma linha corresponde:

  ```
  +------------------------------------+
  | data                               |
  +------------------------------------+
  | {"name": "James", "salary": 10000} |
  +------------------------------------+
  ```

* Solução 2. Especifique a expressão completa na consulta:

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

Tenha em mente que, embora o otimizador suporte a remoção automática de `CAST()` com colunas geradas indexadas, a seguinte abordagem não funciona porque produz um resultado diferente com e sem um índice (Bug#27337092):

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

Um `UNIQUE` index cria uma restrição de modo que todos os valores no índice devem ser distintos. Um erro ocorre se você tentar adicionar uma nova linha com um valor de chave que corresponde a uma linha existente. Se você especificar um valor de prefixo para uma coluna em um `UNIQUE` index, os valores da coluna devem ser únicos dentro do comprimento do prefixo. Um `UNIQUE` index permite múltiplos valores `NULL` para colunas que podem conter `NULL`.

Se uma tabela tiver um `PRIMARY KEY` ou `UNIQUE NOT NULL` index que consiste em uma única coluna com tipo inteiro, você pode usar `_rowid` para referenciar a coluna indexada em instruções `SELECT`, da seguinte forma:

* `_rowid` refere-se à coluna `PRIMARY KEY` se houver um `PRIMARY KEY` consistindo de uma única coluna inteira. Se houver um `PRIMARY KEY` mas ele não consista de uma única coluna inteira, `_rowid` não pode ser usado.

* Caso contrário, `_rowid` refere-se à coluna no primeiro `UNIQUE NOT NULL` index se esse índice consistir de uma única coluna inteira. Se o primeiro `UNIQUE NOT NULL` index não consistir de uma única coluna inteira, `_rowid` não pode ser usado.

#### Índices de Texto Completo

Os índices `FULLTEXT` são suportados apenas para tabelas `InnoDB` e `MyISAM` e podem incluir apenas colunas `CHAR`, `VARCHAR` e `TEXT`. A indexação sempre ocorre sobre toda a coluna; a indexação de prefixo de coluna não é suportada e qualquer comprimento de prefixo é ignorado se especificado. Veja a Seção 14.9, “Funções de Busca de Texto Completo”, para detalhes da operação.

#### Índices de Múltiplos Valores

O `InnoDB` suporta índices de múltiplos valores. Um índice de múltiplos valores é um índice secundário definido em uma coluna que armazena um array de valores. Um índice “normal” tem um registro de índice para cada registro de dados (1:1). Um índice de múltiplos valores pode ter múltiplos registros de índice para um único registro de dados (N:1). Os índices de múltiplos valores são destinados para indexar arrays `JSON`. Por exemplo, um índice de múltiplos valores definido no array de códigos postais no seguinte documento JSON cria um registro de índice para cada código postal, com cada registro de índice referenciando o mesmo registro de dados.

```
{
    "user":"Bob",
    "user_id":31,
    "zipcode":[94477,94536]
}
```

##### Criação de Índices de Múltiplos Valores

Você pode criar um índice de múltiplos valores em uma declaração `CREATE TABLE`, `ALTER TABLE` ou `CREATE INDEX`. Isso requer o uso de `CAST(... AS ... ARRAY)` na definição do índice, que converte valores escalares do mesmo tipo em um array de tipo de dados SQL. Um colunã virtual é então gerado de forma transparente com os valores no array de tipo de dados SQL; finalmente, um índice funcional (também referido como índice virtual) é criado na coluna virtual. É o índice funcional definido na coluna virtual de valores do array de tipo de dados SQL que forma o índice de múltiplos valores.

Os exemplos na lista a seguir mostram as três maneiras diferentes de criar um índice de múltiplos valores `zips` em um array `$.zipcode` em uma coluna `JSON` `custinfo` em uma tabela chamada `clientes`. Em cada caso, o array JSON é convertido em um array de tipo de dados SQL de valores inteiros `UNSIGNED`.

* Apenas `CREATE TABLE`:

  ```
  CREATE TABLE customers (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      custinfo JSON,
      INDEX zips( (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)) )
      );
  ```

* `CREATE TABLE` mais `ALTER TABLE`:

  ```
  CREATE TABLE customers (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      custinfo JSON
      );

  ALTER TABLE customers ADD INDEX zips( (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)) );
  ```

* `CREATE TABLE` mais `CREATE INDEX`:

  ```
  CREATE TABLE customers (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      custinfo JSON
      );

  CREATE INDEX zips ON customers ( (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)) );
  ```

Um índice de múltiplos valores também pode ser definido como parte de um índice composto. Este exemplo mostra um índice composto que inclui duas partes de valor único (para as colunas `id` e `modified`) e uma parte de valor múltiplo (para a coluna `custinfo`):

```
CREATE TABLE customers (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    custinfo JSON
    );

ALTER TABLE customers ADD INDEX comp(id, modified,
    (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)) );
```

Apenas uma parte de chave de valor múltiplo pode ser usada em um índice composto. A parte de chave de valor múltiplo pode ser usada em qualquer ordem em relação às outras partes da chave. Em outras palavras, a declaração `ALTER TABLE` mostrada anteriormente poderia ter usado `comp(id, (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY), modified))` (ou qualquer outra ordem) e ainda ter sido válida.

##### Usando índices de múltiplos valores

O otimizador usa um índice de múltiplos valores para buscar registros quando as seguintes funções são especificadas em uma cláusula `WHERE`:

* `MEMBER OF()`
* `JSON_CONTAINS()`
* `JSON_OVERLAPS()`

Podemos demonstrar isso criando e preenchendo a tabela `customers` usando as seguintes declarações `CREATE TABLE` e `INSERT`:

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

Primeiro, executamos três consultas na tabela `customers`, uma para cada uma das funções `MEMBER OF()`, `JSON_CONTAINS()` e `JSON_OVERLAPS()`, com o resultado de cada consulta mostrado aqui:

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

Nenhuma das três consultas mostradas anteriormente consegue usar qualquer chave. Para resolver esse problema, podemos adicionar um índice de múltiplos valores à matriz `zipcode` na coluna `JSON` (`custinfo`), da seguinte forma:

```
mysql> ALTER TABLE customers
    ->     ADD INDEX zips( (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)) );
Query OK, 0 rows affected (0.47 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

Quando executamos as consultas anteriores novamente, podemos observar que as consultas podem (e fazem) usar o índice `zips` que acabou de ser criado:

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

##### Características dos Índices de Múltiplos Valores

Os índices de múltiplos valores têm as características adicionais listadas aqui:

* As operações de manipulação de dados de múltiplos valores que afetam índices de múltiplos valores são tratadas da mesma maneira que as operações de manipulação de dados de um índice normal, com a única diferença de que pode haver mais de uma inserção ou atualização para um único registro de índice agrupado.

* Nulabilidade e índices de múltiplos valores:

  + Se uma parte da chave de múltiplos valores tiver um array vazio, nenhuma entrada é adicionada ao índice, e o registro de dados não é acessível por uma varredura de índice.

  + Se a geração da parte da chave de múltiplos valores retornar um valor `NULL`, uma única entrada contendo `NULL` é adicionada ao índice de múltiplos valores. Se a parte da chave for definida como `NOT NULL`, um erro é relatado.

  + Se a coluna de matriz tipada for definida como `NULL`, o mecanismo de armazenamento armazena um único registro contendo `NULL` que aponta para o registro de dados.

  + Os valores `NULL` do tipo `JSON` não são permitidos em arrays indexados. Se qualquer valor retornado for `NULL`, ele é tratado como um `NULL` JSON e um erro de valor JSON inválido é relatado.

* Como os índices de múltiplos valores são índices virtuais em colunas virtuais, eles devem seguir as mesmas regras dos índices secundários em colunas geradas virtualmente.

* Os registros do índice não são adicionados para arrays vazios.

##### Limitações e Restrições para Índices de Múltiplos Valores

Os índices de múltiplos valores estão sujeitos às limitações e restrições listadas aqui:

* Apenas uma parte da chave de múltiplos valores é permitida por índice de múltiplos valores. No entanto, a expressão `CAST(... AS ... ARRAY)` pode referir-se a múltiplos arrays dentro de um documento `JSON`, como mostrado aqui:

  ```
  CAST(data->'$.arr[*][*]' AS UNSIGNED ARRAY)
  ```

  Neste caso, todos os valores que correspondem à expressão JSON são armazenados no índice como um único array plano.

* Um índice com uma parte da chave de múltiplos valores não suporta ordenação e, portanto, não pode ser usado como uma chave primária. Por essa mesma razão, um índice de múltiplos valores não pode ser definido usando a palavra-chave `ASC` ou `DESC`.

* Um índice de múltiplos valores não pode ser um índice coberto.
* O número máximo de valores por registro para um índice de múltiplos valores é determinado pela quantidade de dados que podem ser armazenados em uma única página de log de desfazer, que é de 65221 bytes (64K menos 315 bytes de overhead), o que significa que o comprimento total máximo dos valores da chave também é de 65221 bytes. O número máximo de chaves depende de vários fatores, o que impede a definição de um limite específico. Testes mostraram que um índice de múltiplos valores permite até 1604 chaves inteiras por registro, por exemplo. Quando o limite é atingido, um erro semelhante ao seguinte é relatado: ERRO 3905 (HY000): Excedeu o número máximo de valores por registro para o índice de múltiplos valores 'idx' por 1 valor(es).

* O único tipo de expressão permitido em uma parte de chave de múltiplos valores é uma expressão `JSON`. A expressão não precisa referenciar um elemento existente em um documento JSON inserido na coluna indexada, mas deve ser sintaticamente válida.

* Como os registros de índice para o mesmo registro de índice agrupado estão dispersos em um índice de múltiplos valores, um índice de múltiplos valores não suporta varreduras de intervalo ou varreduras apenas de índice.

* Índices de múltiplos valores não são permitidos nas especificações de chave estrangeira.

* Prefixos de índice não podem ser definidos para índices de múltiplos valores.
* Índices de múltiplos valores não podem ser definidos em dados com tipo `BINARY` (veja a descrição da função `CAST()`).

* A criação online de um índice de múltiplos valores não é suportada, o que significa que a operação usa `ALGORITHM=COPY`. Veja Requisitos de desempenho e espaço.

* Conjuntos de caracteres e colatações diferentes das seguintes combinações de conjunto de caracteres e colatação não são suportadas para índices de múltiplos valores:

  1. O conjunto de caracteres `binary` com a colatação `binary` padrão

  2. O conjunto de caracteres `utf8mb4` com a colatação `utf8mb4_0900_as_cs` padrão.

* Como outros índices em colunas de tabelas `InnoDB`, um índice de múltiplos valores não pode ser criado com `USING HASH`; tentar fazê-lo resulta em um aviso: Este motor de armazenamento não suporta o algoritmo de índice HASH, o motor de armazenamento padrão foi usado em vez disso. (`USING BTREE` é suportado como de costume.)

#### Índices Espaciais

Os motores de armazenamento `MyISAM`, `InnoDB`, `NDB` e `ARCHIVE` suportam colunas espaciais como `POINT` e `GEOMETRY`. (A seção 13.4, “Tipos de dados espaciais”, descreve os tipos de dados espaciais.) No entanto, o suporte para indexação de colunas espaciais varia entre os motores. Índices espaciais e não espaciais em colunas espaciais estão disponíveis de acordo com as seguintes regras.

Os índices espaciais em colunas espaciais têm essas características:

* Disponível apenas para tabelas `InnoDB` e `MyISAM`. Especificar `SPATIAL INDEX` para outros motores de armazenamento resulta em um erro.

* Um índice em uma coluna espacial *deve* ser um índice `SPATIAL`. A palavra-chave `SPATIAL` é, portanto, opcional, mas implícita para criar um índice em uma coluna espacial.

* Disponível apenas para colunas espaciais individuais. Um índice espacial não pode ser criado sobre múltiplas colunas espaciais.

* As colunas indexadas devem ser `NOT NULL`.
* Os comprimentos dos prefixos das colunas são proibidos. A largura total de cada coluna é indexada.

* Não é permitido para uma chave primária ou índice único.

Índices não espaciais em colunas espaciais (criados com `INDEX`, `UNIQUE` ou `PRIMARY KEY`) têm essas características:

* Permitido para qualquer motor de armazenamento que suporte colunas espaciais, exceto `ARCHIVE`.

* As colunas podem ser `NULL` a menos que o índice seja uma chave primária.

* O tipo de índice para um índice `não SPATIAL` depende do motor de armazenamento. Atualmente, o B-tree é usado.

* Permitido para uma coluna que pode ter valores `NULL` apenas para tabelas `InnoDB`, `MyISAM` e `MEMORY`.

#### Opções de Índice

Após a lista de partes-chave, as opções de índice podem ser fornecidas. Um valor de *`index_option`* pode ser qualquer um dos seguintes:

* `KEY_BLOCK_SIZE [=] value`

  Para tabelas `MyISAM`, `KEY_BLOCK_SIZE` especifica opcionalmente o tamanho em bytes a ser usado para os blocos de chaves do índice. O valor é tratado como um indicativo; um tamanho diferente pode ser usado se necessário. Um valor de `KEY_BLOCK_SIZE` especificado para uma definição de índice individual substitui um valor de `KEY_BLOCK_SIZE` a nível de tabela.

  `KEY_BLOCK_SIZE` não é suportado no nível do índice para tabelas `InnoDB`. Consulte a Seção 15.1.24, “Instrução CREATE TABLE”.

* *`index_type`*

Alguns motores de armazenamento permitem que você especifique um tipo de índice ao criar um índice. Por exemplo:

```
  CREATE TABLE lookup (id INT) ENGINE = MEMORY;
  CREATE INDEX id_index ON lookup (id) USING BTREE;
  ```

A Tabela 15.1, “Tipos de Índices por Motor de Armazenamento”, mostra os valores de tipo de índice permitidos suportados por diferentes motores de armazenamento. Quando vários tipos de índice são listados, o primeiro é o padrão quando nenhum especificador de tipo de índice é fornecido. Motores de armazenamento não listados na tabela não suportam uma cláusula *`index_type`* nas definições de índice.

**Tabela 15.1 Tipos de Índices por Motor de Armazenamento**

<table summary="Tipos de índice permitidos por motor de armazenamento."><col style="width: 20%"/><col style="width: 50%"/><thead><tr> <th>Motor de Armazenamento</th> <th>Tipos de Índices Permitidos</th> </tr></thead><tbody><tr> <td><code>InnoDB</code></td> <td><code>BTREE</code></td> </tr><tr> <td><code>MyISAM</code></td> <td><code>BTREE</code></td> </tr><tr> <td><code>MEMORY</code>>/<code>HEAP</code></td> <td><code>HASH</code>, <code>BTREE</code></td> </tr><tr> <td><a class="link" href="mysql-cluster.html" title="Capítulo 25 MySQL NDB Cluster 9.5"><code>NDB</code></td> <td><code>HASH</code>, <code>BTREE</code> (veja a nota no texto)</td> </tr></tbody></table>

A cláusula *`index_type`* não pode ser usada para especificações de ÍNDICE DE TEXTO COMPLETO. A implementação de índice de texto completo depende do motor de armazenamento. Índices espaciais são implementados como índices R-tree.

Se você especificar um tipo de índice que não é válido para um determinado motor de armazenamento, mas outro tipo de índice está disponível e o motor pode usá-lo sem afetar os resultados das consultas, o motor usa o tipo disponível. O analisador reconhece `RTREE` como um nome de tipo. Isso é permitido apenas para índices `SPATIAL`.

Os índices `BTREE` são implementados pelo motor de armazenamento `NDB` como índices T-tree.

Observação

Para índices em colunas de tabelas `NDB`, a opção `USING` pode ser especificada apenas para um índice único ou chave primária. `USING HASH` impede a criação de um índice ordenado; caso contrário, a criação de um índice único ou chave primária em uma tabela `NDB` resulta automaticamente na criação de um índice ordenado e um índice hash, cada um dos quais indexa o mesmo conjunto de colunas.

Para índices únicos que incluem uma ou mais colunas `NULL` de uma tabela `NDB`, o índice hash pode ser usado apenas para pesquisar valores literais, o que significa que as condições `IS [NOT] NULL` exigem uma varredura completa da tabela. Uma solução é garantir que um índice único usando uma ou mais colunas `NULL` em uma tabela desse tipo seja sempre criado de maneira que inclua o índice ordenado; ou seja, evitar o uso de `USING HASH` ao criar o índice.

Se você especificar um tipo de índice que não é válido para um determinado motor de armazenamento, mas outro tipo de índice está disponível e o motor pode usá-lo sem afetar os resultados das consultas, o motor usa o tipo disponível. O analisador reconhece `RTREE` como um nome de tipo, mas atualmente isso não pode ser especificado para nenhum motor de armazenamento.

Observação

O uso da opção *`index_type`* antes da cláusula `ON tbl_name` está desatualizado; espera-se que o suporte para o uso da opção nessa posição seja removido em uma futura versão do MySQL. Se uma opção *`index_type`* for fornecida tanto na posição anterior quanto na posterior, a opção final se aplica.

`TYPE type_name` é reconhecido como sinônimo de `USING type_name`. No entanto, `USING` é a forma preferida.

As tabelas a seguir mostram as características dos índices para os motores de armazenamento que suportam a opção *`index_type`*.

**Tabela 15.2 Características de Índice do Motor de Armazenamento InnoDB**

<table summary="Características de índice do motor de armazenamento InnoDB."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>Classe de Índice</th> <th>Tipo de Índice</th> <th>Armazena VALORES NULL</th> <th>Permite VÁRIOS VALORES NULL</th> <th>Tipo de Scan IS NULL</th> <th>Tipo de Scan IS NOT NULL</th> </tr></thead><tbody><tr> <th>Chave Primária</th> <td><code>BTREE</code></td> <td>Não</td> <td>Não</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th>Unieke</th> <td><code>BTREE</code></td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th>Chave</th> <td><code>BTREE</code></td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th><code>FULLTEXT</code></th> <td>N/A</td> <td>Sim</td> <td>Sim</td> <td>Tabela</td> <td>Tabela</td> </tr><tr> <th><code>SPATIAL</code></th> <td>N/A</td> <td>Não</td> <td>Não</td> <td>N/A</td> <td>N/A</td> </tr></tbody></table>

**Tabela 15.3 Características dos Índices do Motor de Armazenamento MyISAM**

<table summary="Características dos índices do motor de armazenamento MyISAM."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>Classe do Índice</th> <th>Tipo do Índice</th> <th>Armazena VALORES NULL</th> <th>Permite VÁRIOS VALORES NULL</th> <th>Tipo de Scan para IS NULL</th> <th>Tipo de Scan para IS NOT NULL</th> </tr></thead><tbody><tr> <th>Chave Primária</th> <td><code>BTREE</code></td> <td>Não</td> <td>Não</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th>Unico</th> <td><code>BTREE</code></td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th>Chave</th> <td><code>BTREE</code></td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th><code>FULLTEXT</code></th> <td>N/A</td> <td>Sim</td> <td>Sim</td> <td>Tabela</td> <td>Tabela</td> </tr><tr> <th><code>SPATIAL</code></th> <td>N/A</td> <td>Não</td> <td>Não</td> <td>N/A</td> <td>N/A</td> </tr></tbody></table>

  **Tabela 15.4 Características dos Índices do Motor de Armazenamento MEMORY**

<table summary="Características do motor de armazenamento de memória NDB">
<col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/>
<thead><tr>
<th>Classe do índice</th>
<th>Tipo de índice</th>
<th>Armazena VALORES NULL</th>
<th>Permite múltiplos valores NULL</th>
<th>Tipo de varredura IS NULL</th>
<th>Tipo de varredura IS NOT NULL</th>
</tr></thead><tbody>
<tr>
<th>Chave primária</th>
<td><code>BTREE</code></td>
<td>Não</td>
<td>Não</td>
<td>N/A</td>
<td>N/A</td>
</tr>
<tr>
<th>Unico</th>
<td><code>BTREE</code></td>
<td>Sim</td>
<td>Sim</td>
<td>Índice</td>
<td>Índice</td>
</tr>
<tr>
<th>Chave</th>
<td><code>BTREE</code></td>
<td>Sim</td>
<td>Sim</td>
<td>Índice</td>
<td>Índice</td>
</tr>
<tr>
<th>Chave primária</th>
<td><code>HASH</code></td>
<td>Não</td>
<td>Não</td>
<td>N/A</td>
<td>N/A</td>
</tr>
<tr>
<th>Unico</th>
<td><code>HASH</code></td>
<td>Sim</td>
<td>Sim</td>
<td>Índice</td>
<td>Índice</td>
</tr>
<tr>
<th>Chave</th>
<td><code>HASH</code></td>
<td>Sim</td>
<td>Sim</td>
<td>Índice</td>
<td>Índice</td>
</tr>
</tbody></table>

<table summary="Características do motor de armazenamento NDB."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>Classe do índice</th> <th>Tipo do índice</th> <th>Armazena VALORES NULL</th> <th>Permite múltiplos valores NULL</th> <th>Tipo de varredura IS NULL</th> <th>Tipo de varredura IS NOT NULL</th> </tr></thead><tbody><tr> <th>Chave primária</th> <td><code>BTREE</code></td> <td>Não</td> <td>Não</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th>Unico</th> <td><code>BTREE</code></td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th>Chave</th> <td><code>BTREE</code></td> <td>Sim</td> <td>Sim</td> <td>Índice</td> <td>Índice</td> </tr><tr> <th>Chave primária</th> <td><code>HASH</code></td> <td>Não</td> <td>Não</td> <td>Tabela (ver nota 1)</td> <td>Tabela (ver nota 1)</td> </tr><tr> <th>Unico</th> <td><code>HASH</code></td> <td>Sim</td> <td>Sim</td> <td>Tabela (ver nota 1)</td> <td>Tabela (ver nota 1)</td> </tr><tr> <th>Chave</th> <td><code>HASH</code></td> <td>Sim</td> <td>Sim</td> <td>Tabela (ver nota 1)</td> <td>Tabela (ver nota 1)</td> </tr></tbody></table>

  Nota da tabela:

  1. `USING HASH` impede a criação de um índice ordenado implícito.

* `WITH PARSER parser_name`

Esta opção só pode ser usada com índices `FULLTEXT`. Ela associa um plugin de analisador ao índice se as operações de indexação e busca de texto completo necessitarem de tratamento especial. O `InnoDB` e o `MyISAM` suportam plugins de analisadores de texto completo. Se você tiver uma tabela `MyISAM` com um plugin de analisador de texto completo associado, você pode converter a tabela para `InnoDB` usando `ALTER TABLE`. Veja Plugins de Analisadores de Texto Completo e Como Escrever Plugins de Analisadores de Texto Completo para mais informações.

* `COMMENT 'string'`

  As definições de índice podem incluir um comentário opcional de até 1024 caracteres.

  O `MERGE_THRESHOLD` para páginas de índice pode ser configurado para índices individuais usando a cláusula `COMMENT` do *`index_option`* da instrução `CREATE INDEX`. Por exemplo:

  ```
  CREATE TABLE t1 (id INT);
  CREATE INDEX id_index ON t1 (id) COMMENT 'MERGE_THRESHOLD=40';
  ```

  Se a porcentagem de páginas completas para uma página de índice cair abaixo do valor `MERGE_THRESHOLD` quando uma linha é excluída ou quando uma linha é encurtada por uma operação de atualização, o `InnoDB` tenta combinar a página de índice com uma página de índice vizinha. O valor padrão de `MERGE_THRESHOLD` é 50, que é o valor previamente codificado.

  `MERGE_THRESHOLD` também pode ser definido no nível do índice e no nível da tabela usando as instruções `CREATE TABLE` e `ALTER TABLE`. Para mais informações, consulte Seção 17.8.11, “Configurando o Limite de Fusão para Páginas de Índice”.

* `VISIBLE`, `INVISIBLE`

  Especifique a visibilidade do índice. Os índices são visíveis por padrão. Um índice invisível não é usado pelo otimizador. A especificação da visibilidade do índice aplica-se a índices que não são chaves primárias (explicitos ou implícitos). Para mais informações, consulte Seção 10.3.12, “Indizes Invisíveis”.

* O `ENGINE_ATTRIBUTE` e o `SECONDARY_ENGINE_ATTRIBUTE` são usados para especificar atributos de índice para motores de armazenamento primário e secundário. As opções são reservadas para uso futuro.

O valor atribuído a esta opção é uma literal de string que contém um documento JSON válido ou uma string vazia (''). O JSON inválido é rejeitado.

```
  CREATE INDEX i1 ON t1 (c1) ENGINE_ATTRIBUTE='{"key":"value"}';
  ```

Os valores `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` podem ser repetidos sem erro. Neste caso, o último valor especificado é utilizado.

Os valores `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` não são verificados pelo servidor, nem são apagados quando o motor de armazenamento da tabela é alterado.

#### Opções de Copiar e Bloquear Tabelas

As cláusulas `ALGORITHM` e `LOCK` podem ser fornecidas para influenciar o método de cópia da tabela e o nível de concorrência para leitura e escrita da tabela enquanto seus índices estão sendo modificados. Elas têm o mesmo significado que para a instrução `ALTER TABLE`. Para mais informações, consulte a Seção 15.1.11, “Instrução ALTER TABLE”.

O NDB Cluster suporta operações online usando a mesma sintaxe `ALGORITHM=INPLACE` usada com o servidor MySQL padrão. Consulte a Seção 25.6.12, “Operações Online com ALTER TABLE no NDB Cluster”, para mais informações.