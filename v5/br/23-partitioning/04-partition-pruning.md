## 22.4 Eliminação de Partições (Partition Pruning)

Esta seção discute uma otimização conhecida como *partition pruning* (eliminação de partições). O conceito central por trás do *partition pruning* é relativamente simples e pode ser descrito como: "Não faça o *scan* de partições onde não pode haver valores correspondentes". Suponha que você tenha uma tabela particionada `t1` definida por esta instrução:

```sql
CREATE TABLE t1 (
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    region_code TINYINT UNSIGNED NOT NULL,
    dob DATE NOT NULL
)
PARTITION BY RANGE( region_code ) (
    PARTITION p0 VALUES LESS THAN (64),
    PARTITION p1 VALUES LESS THAN (128),
    PARTITION p2 VALUES LESS THAN (192),
    PARTITION p3 VALUES LESS THAN MAXVALUE
);
```

Considere o caso em que você deseja obter resultados de uma instrução [`SELECT`](select.html "13.2.9 SELECT Statement") como esta:

```sql
SELECT fname, lname, region_code, dob
    FROM t1
    WHERE region_code > 125 AND region_code < 130;
```

É fácil ver que nenhuma das linhas que deveriam ser retornadas está nas partições `p0` ou `p3`; ou seja, precisamos pesquisar apenas nas partições `p1` e `p2` para encontrar as linhas correspondentes. Ao fazer isso, é possível gastar muito menos tempo e esforço na localização de linhas correspondentes do que seria necessário para fazer o *scan* de todas as partições na tabela. Esse “corte” de partições desnecessárias é conhecido como *pruning*. Quando o *optimizer* pode usar o *partition pruning* ao executar essa *query*, a execução da *query* pode ser uma ordem de magnitude mais rápida do que a mesma *query* em uma tabela não particionada contendo as mesmas definições de coluna e dados.

Nota

Quando o *pruning* é executado em uma tabela particionada [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"), todas as partições são abertas, examinadas ou não, devido ao design do motor de armazenamento `MyISAM`. Isso significa que você deve ter um número suficiente de descritores de arquivo disponíveis para cobrir todas as partições da tabela. Consulte [Uso de descritores de arquivo MyISAM e de partição](partitioning-limitations.html#partitioning-limitations-myisam-file-descriptors "MyISAM and partition file descriptor usage").

Essa limitação não se aplica a tabelas particionadas que utilizam outros motores de armazenamento MySQL, como o [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine").

O *optimizer* pode executar o *pruning* sempre que uma condição `WHERE` puder ser reduzida a um dos dois casos a seguir:

* `partition_column = constant`

* `partition_column IN (constant1, constant2, ..., constantN)`

No primeiro caso, o *optimizer* simplesmente avalia a expressão de particionamento para o valor fornecido, determina qual partição contém esse valor e faz o *scan* apenas dessa partição. Em muitos casos, o sinal de igual pode ser substituído por outra comparação aritmética, incluindo `<`, `>`, `<=`, `>=`, e `<>`. Algumas *queries* que usam `BETWEEN` na cláusula `WHERE` também podem tirar proveito do *partition pruning*. Veja os exemplos mais adiante nesta seção.

No segundo caso, o *optimizer* avalia a expressão de particionamento para cada valor na lista, cria uma lista de partições correspondentes e, em seguida, faz o *scan* apenas das partições nesta lista de partições.

O MySQL pode aplicar o *partition pruning* às instruções [`SELECT`](select.html "13.2.9 SELECT Statement"), [`DELETE`](delete.html "13.2.2 DELETE Statement") e [`UPDATE`](update.html "13.2.11 UPDATE Statement"). Uma instrução [`INSERT`](insert.html "13.2.5 INSERT Statement") também acessa apenas uma partição por linha inserida; isso é verdade mesmo para uma tabela particionada por `HASH` ou `KEY`, embora isso não seja exibido atualmente na saída do [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement").

O *Pruning* também pode ser aplicado a *ranges* curtos, que o *optimizer* pode converter em listas de valores equivalentes. Por exemplo, no exemplo anterior, a cláusula `WHERE` pode ser convertida para `WHERE region_code IN (126, 127, 128, 129)`. Assim, o *optimizer* pode determinar que os dois primeiros valores na lista são encontrados na partição `p1`, os dois valores restantes na partição `p2`, e que as outras partições não contêm valores relevantes e, portanto, não precisam ser pesquisadas por linhas correspondentes.

O *optimizer* também pode executar o *pruning* para condições `WHERE` que envolvem comparações dos tipos precedentes em múltiplas colunas para tabelas que usam particionamento `RANGE COLUMNS` ou `LIST COLUMNS`.

Este tipo de otimização pode ser aplicado sempre que a expressão de particionamento consistir em uma igualdade ou em um *range* que possa ser reduzido a um conjunto de igualdades, ou quando a expressão de particionamento representar uma relação crescente ou decrescente. O *Pruning* também pode ser aplicado para tabelas particionadas em uma coluna [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") ou [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") quando a expressão de particionamento usa a função [`YEAR()`](date-and-time-functions.html#function_year) ou [`TO_DAYS()`](date-and-time-functions.html#function_to-days). Além disso, no MySQL 5.7, o *pruning* pode ser aplicado a tais tabelas quando a expressão de particionamento usa a função [`TO_SECONDS()`](date-and-time-functions.html#function_to-seconds).

Suponha que a tabela `t2`, definida conforme mostrado aqui, esteja particionada em uma coluna [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"):

```sql
CREATE TABLE t2 (
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    region_code TINYINT UNSIGNED NOT NULL,
    dob DATE NOT NULL
)
PARTITION BY RANGE( YEAR(dob) ) (
    PARTITION d0 VALUES LESS THAN (1970),
    PARTITION d1 VALUES LESS THAN (1975),
    PARTITION d2 VALUES LESS THAN (1980),
    PARTITION d3 VALUES LESS THAN (1985),
    PARTITION d4 VALUES LESS THAN (1990),
    PARTITION d5 VALUES LESS THAN (2000),
    PARTITION d6 VALUES LESS THAN (2005),
    PARTITION d7 VALUES LESS THAN MAXVALUE
);
```

As seguintes instruções usando `t2` podem fazer uso do *partition pruning*:

```sql
SELECT * FROM t2 WHERE dob = '1982-06-23';

UPDATE t2 SET region_code = 8 WHERE dob BETWEEN '1991-02-15' AND '1997-04-25';

DELETE FROM t2 WHERE dob >= '1984-06-21' AND dob <= '1999-06-21'
```

No caso da última instrução, o *optimizer* também pode agir da seguinte forma:

1. *Encontrar a partição contendo o limite inferior do range*.

   [`YEAR('1984-06-21')`](date-and-time-functions.html#function_year) retorna o valor `1984`, que é encontrado na partição `d3`.

2. *Encontrar a partição contendo o limite superior do range*.

   [`YEAR('1999-06-21')`](date-and-time-functions.html#function_year) é avaliado como `1999`, que é encontrado na partição `d5`.

3. *Fazer o scan apenas dessas duas partições e de quaisquer partições que possam estar entre elas*.

   Neste caso, isso significa que apenas as partições `d3`, `d4` e `d5` são escaneadas. As partições restantes podem ser ignoradas com segurança (e são ignoradas).

Importante

Valores `DATE` e `DATETIME` inválidos referenciados na condição `WHERE` de uma instrução contra uma tabela particionada são tratados como `NULL`. Isso significa que uma *query* como `SELECT * FROM partitioned_table WHERE date_column < '2008-12-00'` não retorna nenhum valor (consulte Bug #40972).

Até agora, analisamos apenas exemplos usando particionamento `RANGE`, mas o *pruning* também pode ser aplicado a outros tipos de particionamento.

Considere uma tabela particionada por `LIST`, onde a expressão de particionamento está aumentando ou diminuindo, como a tabela `t3` mostrada aqui. (Neste exemplo, assumimos, por uma questão de brevidade, que a coluna `region_code` está limitada a valores entre 1 e 10, inclusive.)

```sql
CREATE TABLE t3 (
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    region_code TINYINT UNSIGNED NOT NULL,
    dob DATE NOT NULL
)
PARTITION BY LIST(region_code) (
    PARTITION r0 VALUES IN (1, 3),
    PARTITION r1 VALUES IN (2, 5, 8),
    PARTITION r2 VALUES IN (4, 9),
    PARTITION r3 VALUES IN (6, 7, 10)
);
```

Para uma instrução como `SELECT * FROM t3 WHERE region_code BETWEEN 1 AND 3`, o *optimizer* determina em quais partições os valores 1, 2 e 3 são encontrados (`r0` e `r1`) e ignora as restantes (`r2` e `r3`).

Para tabelas particionadas por `HASH` ou `[LINEAR] KEY`, o *partition pruning* também é possível em casos em que a cláusula `WHERE` usa uma relação de `=` simples contra uma coluna usada na expressão de particionamento. Considere uma tabela criada assim:

```sql
CREATE TABLE t4 (
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    region_code TINYINT UNSIGNED NOT NULL,
    dob DATE NOT NULL
)
PARTITION BY KEY(region_code)
PARTITIONS 8;
```

Uma instrução que compara um valor de coluna com uma constante pode ser podada (*pruned*):

```sql
UPDATE t4 WHERE region_code = 7;
```

O *Pruning* também pode ser empregado para *ranges* curtos, porque o *optimizer* pode transformar tais condições em relações `IN`. Por exemplo, usando a mesma tabela `t4` definida anteriormente, *queries* como estas podem ser podadas:

```sql
SELECT * FROM t4 WHERE region_code > 2 AND region_code < 6;

SELECT * FROM t4 WHERE region_code BETWEEN 3 AND 5;
```

Em ambos os casos, a cláusula `WHERE` é transformada pelo *optimizer* em `WHERE region_code IN (3, 4, 5)`.

Importante

Esta otimização é usada somente se o tamanho do *range* for menor que o número de partições. Considere esta instrução:

```sql
DELETE FROM t4 WHERE region_code BETWEEN 4 AND 12;
```

O *range* na cláusula `WHERE` cobre 9 valores (4, 5, 6, 7, 8, 9, 10, 11, 12), mas `t4` tem apenas 8 partições. Isso significa que o `DELETE` não pode ser podado.

Quando uma tabela é particionada por `HASH` ou `[LINEAR] KEY`, o *pruning* pode ser usado apenas em colunas *integer*. Por exemplo, esta instrução não pode usar o *pruning* porque `dob` é uma coluna [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"):

```sql
SELECT * FROM t4 WHERE dob >= '2001-04-14' AND dob <= '2005-10-15';
```

No entanto, se a tabela armazena valores de ano em uma coluna [`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), então uma *query* com `WHERE year_col >= 2001 AND year_col <= 2005` pode ser podada.

Antes do MySQL 5.7.1, o *partition pruning* era desabilitado para todas as tabelas que usavam um motor de armazenamento que fornecia particionamento automático, como o motor de armazenamento `NDB` usado pelo NDB Cluster. (Bug #14672885) A partir do MySQL 5.7.1, essas tabelas podem ser podadas se forem explicitamente particionadas. (Bug #14827952)