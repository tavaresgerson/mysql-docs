## 22.4 Prunindo Partições

Esta seção discute uma otimização conhecida como poda de partição. O conceito central por trás da poda de partição é relativamente simples e pode ser descrito como "Não realize uma varredura em partições onde não podem haver valores correspondentes". Suponha que você tenha uma tabela dividida `t1` definida por esta declaração:

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

Considere o caso em que você deseja obter resultados de uma declaração `SELECT` como esta:

```sql
SELECT fname, lname, region_code, dob
    FROM t1
    WHERE region_code > 125 AND region_code < 130;
```

É fácil perceber que nenhuma das linhas que deveriam ser devolvidas está em nenhuma das partições `p0` ou `p3`; ou seja, precisamos procurar apenas nas partições `p1` e `p2` para encontrar as linhas correspondentes. Ao fazer isso, é possível gastar muito menos tempo e esforço na busca de linhas correspondentes do que o necessário para digitalizar todas as partições na tabela. Esse "cortar" das partições desnecessárias é conhecido como poda. Quando o otimizador pode fazer uso da poda de partições ao realizar essa consulta, a execução da consulta pode ser uma ordem de magnitude mais rápida do que a mesma consulta em uma tabela não particionada que contenha as mesmas definições de coluna e dados.

Nota

Quando a poda é realizada em uma tabela `MyISAM` particionada, todas as partições são abertas, independentemente de serem examinadas ou não, devido ao design do mecanismo de armazenamento `MyISAM`. Isso significa que você deve ter um número suficiente de descritores de arquivo disponíveis para cobrir todas as partições da tabela. Veja MyISAM e uso de descritores de arquivo de partição.

Essa limitação não se aplica a tabelas particionadas que utilizam outros motores de armazenamento do MySQL, como `InnoDB`.

O otimizador pode realizar a poda sempre que uma condição `WHERE` possa ser reduzida a um dos dois casos a seguir:

* `partition_column = constant`

* `partition_column IN (constant1, constant2, ..., constantN)`

No primeiro caso, o otimizador simplesmente avalia a expressão de particionamento para o valor dado, determina qual partição contém esse valor e só examina essa partição. Em muitos casos, o sinal de igual pode ser substituído por outra comparação aritmética, incluindo `<`, `>`, `<=`, `>=` e `<>`. Algumas consultas que utilizam `BETWEEN` na cláusula `WHERE` também podem aproveitar a poda de partição. Veja os exemplos mais adiante nesta seção.

No segundo caso, o otimizador avalia a expressão de particionamento para cada valor na lista, cria uma lista de particionamentos correspondentes e, em seguida, examina apenas as particionamentos nessa lista de particionamentos.

O MySQL pode aplicar o corte de partição aos `SELECT`, `DELETE` e `UPDATE` declarações. Uma declaração `INSERT` também acessa apenas uma partição por linha inserida; isso é verdadeiro mesmo para uma tabela que é particionada por `HASH` ou `KEY`, embora isso não seja atualmente mostrado na saída de `EXPLAIN`.

A poda também pode ser aplicada em intervalos curtos, que o otimizador pode converter em listas equivalentes de valores. Por exemplo, no exemplo anterior, a cláusula `WHERE` pode ser convertida em `WHERE region_code IN (126, 127, 128, 129)`. Então, o otimizador pode determinar que os dois primeiros valores na lista são encontrados na partição `p1`, os dois valores restantes na partição `p2`, e que as outras partições não contêm valores relevantes e, portanto, não precisam ser pesquisadas em busca de linhas correspondentes.

O otimizador também pode realizar poda para condições `WHERE` que envolvem comparações dos tipos anteriores em várias colunas para tabelas que utilizam `RANGE COLUMNS` ou `LIST COLUMNS` de particionamento.

Esse tipo de otimização pode ser aplicado sempre que a expressão de particionamento consiste em uma igualdade ou em uma faixa que possa ser reduzida a um conjunto de igualdades, ou quando a expressão de particionamento representa uma relação crescente ou decrescente. A poda também pode ser aplicada para tabelas particionadas em uma coluna `DATE` ou `DATETIME`, quando a expressão de particionamento utiliza a função `YEAR()` ou `TO_DAYS()`. Além disso, no MySQL 5.7, a poda pode ser aplicada para tais tabelas quando a expressão de particionamento utiliza a função `TO_SECONDS()`.

Suponha que a tabela `t2`, definida como mostrado aqui, seja particionada em uma coluna `DATE`:

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

As seguintes declarações que utilizam `t2` podem fazer uso de poda de partição:

```sql
SELECT * FROM t2 WHERE dob = '1982-06-23';

UPDATE t2 SET region_code = 8 WHERE dob BETWEEN '1991-02-15' AND '1997-04-25';

DELETE FROM t2 WHERE dob >= '1984-06-21' AND dob <= '1999-06-21'
```

No caso da última declaração, o otimizador também pode agir da seguinte forma:

1. *Encontre a partição que contém o extremo inferior da faixa*.

`YEAR('1984-06-21')` gera o valor `1984`, que é encontrado na partição `d3`.

2. *Encontre a partição que contém o alto extremo da faixa*.

`YEAR('1999-06-21')` é avaliado para `1999`, que é encontrado na partição `d5`.

3. *Analise apenas essas duas partições e quaisquer partições que possam estar entre elas*.

Neste caso, isso significa que apenas as partições `d3`, `d4` e `d5` são analisadas. As partições restantes podem ser ignoradas com segurança (e são ignoradas).

Importante

Os valores inválidos de `DATE` e `DATETIME` referenciados na condição `WHERE` de uma declaração contra uma tabela particionada são tratados como `NULL`. Isso significa que uma consulta como `SELECT * FROM partitioned_table WHERE date_column < '2008-12-00'` não retorna quaisquer valores (veja o Bug #40972).

Até agora, analisamos apenas exemplos que utilizavam a partição `RANGE`, mas o podamento pode ser aplicado com outros tipos de partição também.

Considere uma tabela que seja dividida por `LIST`, onde a expressão de divisão é crescente ou decrescente, como a tabela `t3` mostrada aqui. (Neste exemplo, assumimos, por economia de palavras, que a coluna `region_code` está limitada a valores entre 1 e 10, inclusive.)

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

Para uma declaração como `SELECT * FROM t3 WHERE region_code BETWEEN 1 AND 3`, o otimizador determina em quais partições os valores 1, 2 e 3 são encontrados (`r0` e `r1`) e ignora os restantes (`r2` e `r3`).

Para tabelas que são particionadas por `HASH` ou `[LINEAR] KEY`, o descarte de particionamento também é possível nos casos em que a cláusula `WHERE` usa uma relação simples `=` contra uma coluna usada na expressão de particionamento. Considere uma tabela criada da seguinte forma:

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

Uma declaração que compara o valor de uma coluna com uma constante pode ser simplificada:

```sql
UPDATE t4 WHERE region_code = 7;
```

A poda também pode ser empregada para faixas curtas, porque o otimizador pode transformar tais condições em relações `IN`. Por exemplo, usando a mesma tabela `t4` definida anteriormente, consultas como essas podem ser podadas:

```sql
SELECT * FROM t4 WHERE region_code > 2 AND region_code < 6;

SELECT * FROM t4 WHERE region_code BETWEEN 3 AND 5;
```

Em ambos os casos, a cláusula `WHERE` é transformada pelo otimizador em `WHERE region_code IN (3, 4, 5)`.

Importante

Essa otimização é usada apenas se o tamanho da faixa for menor que o número de partições. Considere esta afirmação:

```sql
DELETE FROM t4 WHERE region_code BETWEEN 4 AND 12;
```

A faixa na cláusula `WHERE` abrange 9 valores (4, 5, 6, 7, 8, 9, 10, 11, 12), mas `t4` tem apenas 8 divisões. Isso significa que o `DELETE` não pode ser podado.

Quando uma tabela é particionada por `HASH` ou `[LINEAR] KEY`, o podamento só pode ser usado em colunas inteiras. Por exemplo, esta declaração não pode usar o podamento porque `dob` é uma coluna `DATE`:

```sql
SELECT * FROM t4 WHERE dob >= '2001-04-14' AND dob <= '2005-10-15';
```

No entanto, se a tabela armazenar valores de ano em uma coluna `INT` (INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT), então uma consulta que contenha `WHERE year_col >= 2001 AND year_col <= 2005` pode ser reduzida.

Antes do MySQL 5.7.1, o corte de partições foi desativado para todas as tabelas que utilizam um mecanismo de armazenamento que oferece partição automática, como o mecanismo de armazenamento `NDB` usado pelo NDB Cluster. (Bug #14672885) A partir do MySQL 5.7.1, essas tabelas podem ser cortadas se estiverem explicitamente particionadas. (Bug #14827952)