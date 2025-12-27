## 4.4 Corte de Partições

A otimização conhecida como corte de partições é baseada em um conceito relativamente simples, que pode ser descrito como “não varrer as partições onde não podem haver valores correspondentes”. Suponha que uma tabela particionada `t1` seja criada por esta declaração:

```
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

Suponha que você queira obter resultados de uma declaração `SELECT` como esta:

```
SELECT fname, lname, region_code, dob
    FROM t1
    WHERE region_code > 125 AND region_code < 130;
```

É fácil ver que nenhuma das linhas que deveriam ser retornadas está em nenhuma das partições `p0` ou `p3`; ou seja, precisamos procurar apenas nas partições `p1` e `p2` para encontrar linhas correspondentes. Ao limitar a busca, é possível gastar muito menos tempo e esforço para encontrar linhas correspondentes do que varrendo todas as partições da tabela. Esse “cortar” de partições desnecessárias é conhecido como corte. Quando o otimizador pode usar o corte de partições para realizar essa consulta, a execução da consulta pode ser uma ordem de magnitude mais rápida do que a mesma consulta em uma tabela não particionada que contenha as mesmas definições de colunas e dados.

O otimizador pode realizar o corte sempre que uma condição `WHERE` pode ser reduzida a um dos seguintes dois casos:

* `partition_column = constante`

* `partition_column IN (constante1, constante2, ..., constanteN)`

No primeiro caso, o otimizador simplesmente avalia a expressão de particionamento para o valor dado, determina em qual partição esse valor está, e varre apenas essa partição. Em muitos casos, o sinal de igual pode ser substituído por outra comparação aritmética, incluindo `<`, `>`, `<=`, `>=` e `<>`. Algumas consultas que usam `BETWEEN` na cláusula `WHERE` também podem aproveitar o corte de partições. Veja os exemplos mais adiante nesta seção.

No segundo caso, o otimizador avalia a expressão de particionamento para cada valor na lista, cria uma lista de partições correspondentes e, em seguida, examina apenas as partições nesta lista de partições.

As instruções `SELECT`, `DELETE` e `UPDATE` suportam o corte de particionamento. Uma instrução `INSERT` também acessa apenas uma partição por linha inserida; isso é verdadeiro mesmo para uma tabela que é particionada por `HASH` ou `KEY`, embora isso não seja atualmente mostrado na saída do `EXPLAIN`.

O corte também pode ser aplicado a faixas curtas, que o otimizador pode converter em listas equivalentes de valores. Por exemplo, no exemplo anterior, a cláusula `WHERE` pode ser convertida em `WHERE region_code IN (126, 127, 128, 129)`. Então, o otimizador pode determinar que os dois primeiros valores na lista estão na partição `p1`, os dois valores restantes na partição `p2`, e que as outras partições não contêm valores relevantes e, portanto, não precisam ser pesquisadas para encontrar linhas correspondentes.

O otimizador também pode realizar o corte para condições `WHERE` que envolvem comparações dos tipos anteriores em várias colunas para tabelas que usam particionamento `RANGE COLUMNS` ou `LIST COLUMNS`.

Esse tipo de otimização pode ser aplicado sempre que a expressão de particionamento consiste em uma igualdade ou uma faixa que pode ser reduzida a um conjunto de igualdades, ou quando a expressão de particionamento representa uma relação crescente ou decrescente. O corte também pode ser aplicado para tabelas particionadas em uma coluna `DATE` ou `DATETIME` quando a expressão de particionamento usa a função `YEAR()` ou `TO_DAYS()`. O corte também pode ser aplicado para tais tabelas quando a expressão de particionamento usa a função `TO_SECONDS()`.

Suponha que a tabela `t2`, particionada em uma coluna `DATE`, seja criada usando a instrução mostrada aqui:

```
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

As seguintes declarações que utilizam `t2` podem ser úteis para o corte de partições:

```
SELECT * FROM t2 WHERE dob = '1982-06-23';

UPDATE t2 SET region_code = 8 WHERE dob BETWEEN '1991-02-15' AND '1997-04-25';

DELETE FROM t2 WHERE dob >= '1984-06-21' AND dob <= '1999-06-21'
```

No caso da última declaração, o otimizador também pode agir da seguinte forma:

1. *Encontrar a partição que contém o extremo inferior da faixa*.

   `YEAR('1984-06-21')` gera o valor `1984`, que é encontrado na partição `d3`.

2. *Encontrar a partição que contém o extremo superior da faixa*.

   `YEAR('1999-06-21')` avalia para `1999`, que é encontrado na partição `d5`.

3. *Explorar apenas essas duas partições e quaisquer partições que possam estar entre elas*.

   Neste caso, isso significa que apenas as partições `d3`, `d4` e `d5` são exploradas. As partições restantes podem ser ignoradas com segurança (e são ignoradas).

Importante

Valores `DATE` e `DATETIME` inválidos referenciados na condição `WHERE` de uma declaração contra uma tabela particionada são tratados como `NULL`. Isso significa que uma consulta como `SELECT * FROM partitioned_table WHERE date_column < '2008-12-00'` não retorna nenhum valor (veja Bug
#40972).

Até agora, analisamos apenas exemplos usando particionamento `RANGE`, mas o corte também pode ser aplicado com outros tipos de particionamento.

Considere uma tabela particionada por `LIST`, onde a expressão de particionamento é crescente ou decrescente, como a tabela `t3` mostrada aqui. (Neste exemplo, assumimos, por simplicidade, que a coluna `region_code` está limitada a valores entre 1 e 10, inclusive.)

```
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

Para uma declaração como `SELECT * FROM t3 WHERE region_code BETWEEN 1 AND 3`, o otimizador determina em quais partições os valores 1, 2 e 3 são encontrados (`r0` e `r1`) e ignora os demais (`r2` e `r3`).

Para tabelas que são particionadas por `HASH` ou `[LINEAR] KEY`, o rastreamento de particionamento também é possível nos casos em que a cláusula `WHERE` usa uma relação simples `=` contra uma coluna usada na expressão de particionamento. Considere uma tabela criada da seguinte forma:

```
CREATE TABLE t4 (
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    region_code TINYINT UNSIGNED NOT NULL,
    dob DATE NOT NULL
)
PARTITION BY KEY(region_code)
PARTITIONS 8;
```

Uma declaração que compara o valor de uma coluna com uma constante pode ser rastreada:

```
UPDATE t4 WHERE region_code = 7;
```

O rastreamento também pode ser empregado para faixas curtas, porque o otimizador pode transformar tais condições em relações `IN`. Por exemplo, usando a mesma tabela `t4` definida anteriormente, consultas como estas podem ser rastreadas:

```
SELECT * FROM t4 WHERE region_code > 2 AND region_code < 6;

SELECT * FROM t4 WHERE region_code BETWEEN 3 AND 5;
```

Em ambos os casos, a cláusula `WHERE` é transformada pelo otimizador em `WHERE region_code IN (3, 4, 5)`.

Importante

Esta otimização é usada apenas se o tamanho da faixa for menor que o número de particionamentos. Considere esta declaração:

```
DELETE FROM t4 WHERE region_code BETWEEN 4 AND 12;
```

A faixa na cláusula `WHERE` cobre 9 valores (4, 5, 6, 7, 8, 9, 10, 11, 12), mas `t4` tem apenas 8 particionamentos. Isso significa que o `DELETE` não pode ser rastreado.

Quando uma tabela é particionada por `HASH` ou `[LINEAR] KEY`, o rastreamento pode ser usado apenas em colunas inteiras. Por exemplo, esta declaração não pode usar rastreamento porque `dob` é uma coluna `DATE`:

```
SELECT * FROM t4 WHERE dob >= '2001-04-14' AND dob <= '2005-10-15';
```

No entanto, se a tabela armazenar valores de ano em uma coluna `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")`, então uma consulta com `WHERE year_col >= 2001 AND year_col <= 2005` pode ser rastreada.

Tabelas que usam um mecanismo de armazenamento que fornece particionamento automático, como o mecanismo de armazenamento `NDB` usado pelo MySQL Cluster, podem ser rastreadas se estiverem explicitamente particionadas.