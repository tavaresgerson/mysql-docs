### 22.2.7 Como o Partitioning do MySQL Lida com NULL

O Partitioning no MySQL não faz nada para impedir que `NULL` seja o valor de uma expressão de particionamento, seja um valor de coluna ou o valor de uma expressão fornecida pelo usuário. Embora seja permitido usar `NULL` como o valor de uma expressão que de outra forma deve retornar um inteiro, é importante ter em mente que `NULL` não é um número. A implementação de Partitioning do MySQL trata `NULL` como sendo menor do que qualquer valor não-`NULL`, assim como o `ORDER BY`.

Isso significa que o tratamento de `NULL` varia entre diferentes tipos de particionamento e pode produzir um comportamento que você não espera se não estiver preparado para isso. Sendo este o caso, discutimos nesta seção como cada tipo de Partitioning do MySQL lida com valores `NULL` ao determinar a partição na qual uma linha deve ser armazenada, e fornecemos exemplos para cada um.

**Como Lidar com NULL em Partitioning por RANGE.** Se você inserir uma linha em uma tabela particionada por `RANGE` de modo que o valor da coluna usado para determinar a partição seja `NULL`, a linha será inserida na partição mais baixa. Considere estas duas tabelas em um Database chamado `p`, criadas da seguinte forma:

```sql
mysql> CREATE TABLE t1 (
    ->     c1 INT,
    ->     c2 VARCHAR(20)
    -> )
    -> PARTITION BY RANGE(c1) (
    ->     PARTITION p0 VALUES LESS THAN (0),
    ->     PARTITION p1 VALUES LESS THAN (10),
    ->     PARTITION p2 VALUES LESS THAN MAXVALUE
    -> );
Query OK, 0 rows affected (0.09 sec)

mysql> CREATE TABLE t2 (
    ->     c1 INT,
    ->     c2 VARCHAR(20)
    -> )
    -> PARTITION BY RANGE(c1) (
    ->     PARTITION p0 VALUES LESS THAN (-5),
    ->     PARTITION p1 VALUES LESS THAN (0),
    ->     PARTITION p2 VALUES LESS THAN (10),
    ->     PARTITION p3 VALUES LESS THAN MAXVALUE
    -> );
Query OK, 0 rows affected (0.09 sec)
```

Você pode ver as partições criadas por estas duas instruções [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") usando a seguinte Query contra a tabela [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table") no Database `INFORMATION_SCHEMA`:

```sql
mysql> SELECT TABLE_NAME, PARTITION_NAME, TABLE_ROWS, AVG_ROW_LENGTH, DATA_LENGTH
     >   FROM INFORMATION_SCHEMA.PARTITIONS
     >   WHERE TABLE_SCHEMA = 'p' AND TABLE_NAME LIKE 't_';
+------------+----------------+------------+----------------+-------------+
| TABLE_NAME | PARTITION_NAME | TABLE_ROWS | AVG_ROW_LENGTH | DATA_LENGTH |
+------------+----------------+------------+----------------+-------------+
| t1         | p0             |          0 |              0 |           0 |
| t1         | p1             |          0 |              0 |           0 |
| t1         | p2             |          0 |              0 |           0 |
| t2         | p0             |          0 |              0 |           0 |
| t2         | p1             |          0 |              0 |           0 |
| t2         | p2             |          0 |              0 |           0 |
| t2         | p3             |          0 |              0 |           0 |
+------------+----------------+------------+----------------+-------------+
7 rows in set (0.00 sec)
```

(Para mais informações sobre esta tabela, consulte [Section 24.3.16, “The INFORMATION_SCHEMA PARTITIONS Table”](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table").) Agora vamos popular cada uma dessas tabelas com uma única linha contendo um `NULL` na coluna usada como chave de particionamento, e verificar se as linhas foram inseridas usando um par de instruções [`SELECT`](select.html "13.2.9 SELECT Statement"):

```sql
mysql> INSERT INTO t1 VALUES (NULL, 'mothra');
Query OK, 1 row affected (0.00 sec)

mysql> INSERT INTO t2 VALUES (NULL, 'mothra');
Query OK, 1 row affected (0.00 sec)

mysql> SELECT * FROM t1;
+------+--------+
| id   | name   |
+------+--------+
| NULL | mothra |
+------+--------+
1 row in set (0.00 sec)

mysql> SELECT * FROM t2;
+------+--------+
| id   | name   |
+------+--------+
| NULL | mothra |
+------+--------+
1 row in set (0.00 sec)
```

Você pode ver quais partições são usadas para armazenar as linhas inseridas, executando novamente a Query anterior contra [`INFORMATION_SCHEMA.PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table") e inspecionando o resultado:

```sql
mysql> SELECT TABLE_NAME, PARTITION_NAME, TABLE_ROWS, AVG_ROW_LENGTH, DATA_LENGTH
     >   FROM INFORMATION_SCHEMA.PARTITIONS
     >   WHERE TABLE_SCHEMA = 'p' AND TABLE_NAME LIKE 't_';
+------------+----------------+------------+----------------+-------------+
| TABLE_NAME | PARTITION_NAME | TABLE_ROWS | AVG_ROW_LENGTH | DATA_LENGTH |
+------------+----------------+------------+----------------+-------------+
| t1         | p0             |          1 |             20 |          20 |
| t1         | p1             |          0 |              0 |           0 |
| t1         | p2             |          0 |              0 |           0 |
| t2         | p0             |          1 |             20 |          20 |
| t2         | p1             |          0 |              0 |           0 |
| t2         | p2             |          0 |              0 |           0 |
| t2         | p3             |          0 |              0 |           0 |
+------------+----------------+------------+----------------+-------------+
7 rows in set (0.01 sec)
```

Você também pode demonstrar que essas linhas foram armazenadas na partição mais baixa de cada tabela, removendo essas partições e, em seguida, executando novamente as instruções [`SELECT`](select.html "13.2.9 SELECT Statement"):

```sql
mysql> ALTER TABLE t1 DROP PARTITION p0;
Query OK, 0 rows affected (0.16 sec)

mysql> ALTER TABLE t2 DROP PARTITION p0;
Query OK, 0 rows affected (0.16 sec)

mysql> SELECT * FROM t1;
Empty set (0.00 sec)

mysql> SELECT * FROM t2;
Empty set (0.00 sec)
```

(Para mais informações sobre `ALTER TABLE ... DROP PARTITION`, consulte [Section 13.1.8, “ALTER TABLE Statement”](alter-table.html "13.1.8 ALTER TABLE Statement").)

`NULL` também é tratado desta forma para expressões de particionamento que usam SQL functions. Suponha que definamos uma tabela usando uma instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") como esta:

```sql
CREATE TABLE tndate (
    id INT,
    dt DATE
)
PARTITION BY RANGE( YEAR(dt) ) (
    PARTITION p0 VALUES LESS THAN (1990),
    PARTITION p1 VALUES LESS THAN (2000),
    PARTITION p2 VALUES LESS THAN MAXVALUE
);
```

Assim como acontece com outras funções do MySQL, [`YEAR(NULL)`](date-and-time-functions.html#function_year) retorna `NULL`. Uma linha com um valor `NULL` na coluna `dt` é tratada como se a expressão de particionamento fosse avaliada para um valor menor do que qualquer outro valor, e é, portanto, inserida na partição `p0`.

**Como Lidar com NULL em Partitioning por LIST.** Uma tabela particionada por `LIST` admite valores `NULL` se e somente se uma de suas partições for definida usando uma lista de valores que contenha `NULL`. O inverso disso é que uma tabela particionada por `LIST` que não usa explicitamente `NULL` em uma lista de valores rejeita linhas que resultam em um valor `NULL` para a expressão de particionamento, conforme mostrado neste exemplo:

```sql
mysql> CREATE TABLE ts1 (
    ->     c1 INT,
    ->     c2 VARCHAR(20)
    -> )
    -> PARTITION BY LIST(c1) (
    ->     PARTITION p0 VALUES IN (0, 3, 6),
    ->     PARTITION p1 VALUES IN (1, 4, 7),
    ->     PARTITION p2 VALUES IN (2, 5, 8)
    -> );
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO ts1 VALUES (9, 'mothra');
ERROR 1504 (HY000): Table has no partition for value 9

mysql> INSERT INTO ts1 VALUES (NULL, 'mothra');
ERROR 1504 (HY000): Table has no partition for value NULL
```

Somente linhas que tenham um valor `c1` entre `0` e `8` (inclusive) podem ser inseridas em `ts1`. `NULL` cai fora deste intervalo, assim como o número `9`. Podemos criar as tabelas `ts2` e `ts3` com listas de valores que contenham `NULL`, conforme mostrado aqui:

```sql
mysql> CREATE TABLE ts2 (
    ->     c1 INT,
    ->     c2 VARCHAR(20)
    -> )
    -> PARTITION BY LIST(c1) (
    ->     PARTITION p0 VALUES IN (0, 3, 6),
    ->     PARTITION p1 VALUES IN (1, 4, 7),
    ->     PARTITION p2 VALUES IN (2, 5, 8),
    ->     PARTITION p3 VALUES IN (NULL)
    -> );
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE TABLE ts3 (
    ->     c1 INT,
    ->     c2 VARCHAR(20)
    -> )
    -> PARTITION BY LIST(c1) (
    ->     PARTITION p0 VALUES IN (0, 3, 6),
    ->     PARTITION p1 VALUES IN (1, 4, 7, NULL),
    ->     PARTITION p2 VALUES IN (2, 5, 8)
    -> );
Query OK, 0 rows affected (0.01 sec)
```

Ao definir listas de valores para particionamento, você pode (e deve) tratar `NULL` assim como trataria qualquer outro valor. Por exemplo, tanto `VALUES IN (NULL)` quanto `VALUES IN (1, 4, 7, NULL)` são válidos, assim como `VALUES IN (1, NULL, 4, 7)`, `VALUES IN (NULL, 1, 4, 7)`, e assim por diante. Você pode inserir uma linha com `NULL` para a coluna `c1` em cada uma das tabelas `ts2` e `ts3`:

```sql
mysql> INSERT INTO ts2 VALUES (NULL, 'mothra');
Query OK, 1 row affected (0.00 sec)

mysql> INSERT INTO ts3 VALUES (NULL, 'mothra');
Query OK, 1 row affected (0.00 sec)
```

Ao emitir a Query apropriada contra a tabela [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table") do Information Schema, você pode determinar quais partições foram usadas para armazenar as linhas recém-inseridas (assumimos, como nos exemplos anteriores, que as tabelas particionadas foram criadas no Database `p`):

```sql
mysql> SELECT TABLE_NAME, PARTITION_NAME, TABLE_ROWS, AVG_ROW_LENGTH, DATA_LENGTH
     >   FROM INFORMATION_SCHEMA.PARTITIONS
     >   WHERE TABLE_SCHEMA = 'p' AND TABLE_NAME LIKE 'ts_';
+------------+----------------+------------+----------------+-------------+
| TABLE_NAME | PARTITION_NAME | TABLE_ROWS | AVG_ROW_LENGTH | DATA_LENGTH |
+------------+----------------+------------+----------------+-------------+
| ts2        | p0             |          0 |              0 |           0 |
| ts2        | p1             |          0 |              0 |           0 |
| ts2        | p2             |          0 |              0 |           0 |
| ts2        | p3             |          1 |             20 |          20 |
| ts3        | p0             |          0 |              0 |           0 |
| ts3        | p1             |          1 |             20 |          20 |
| ts3        | p2             |          0 |              0 |           0 |
+------------+----------------+------------+----------------+-------------+
7 rows in set (0.01 sec)
```

Conforme mostrado anteriormente nesta seção, você também pode verificar quais partições foram usadas para armazenar as linhas, excluindo essas partições e, em seguida, executando um [`SELECT`](select.html "13.2.9 SELECT Statement").

**Como Lidar com NULL em Partitioning por HASH e KEY.** `NULL` é tratado de forma um pouco diferente para tabelas particionadas por `HASH` ou `KEY`. Nesses casos, qualquer expressão de partição que resulte em um valor `NULL` é tratada como se seu valor de retorno fosse zero. Podemos verificar esse comportamento examinando os efeitos no sistema de arquivos ao criar uma tabela particionada por `HASH` e populá-la com um registro contendo valores apropriados. Suponha que você tenha uma tabela `th` (também no Database `p`) criada usando a seguinte instrução:

```sql
mysql> CREATE TABLE th (
    ->     c1 INT,
    ->     c2 VARCHAR(20)
    -> )
    -> PARTITION BY HASH(c1)
    -> PARTITIONS 2;
Query OK, 0 rows affected (0.00 sec)
```

As partições pertencentes a esta tabela podem ser visualizadas usando a Query mostrada aqui:

```sql
mysql> SELECT TABLE_NAME,PARTITION_NAME,TABLE_ROWS,AVG_ROW_LENGTH,DATA_LENGTH
     >   FROM INFORMATION_SCHEMA.PARTITIONS
     >   WHERE TABLE_SCHEMA = 'p' AND TABLE_NAME ='th';
+------------+----------------+------------+----------------+-------------+
| TABLE_NAME | PARTITION_NAME | TABLE_ROWS | AVG_ROW_LENGTH | DATA_LENGTH |
+------------+----------------+------------+----------------+-------------+
| th         | p0             |          0 |              0 |           0 |
| th         | p1             |          0 |              0 |           0 |
+------------+----------------+------------+----------------+-------------+
2 rows in set (0.00 sec)
```

O `TABLE_ROWS` para cada partição é 0. Agora insira duas linhas em `th` cujos valores da coluna `c1` sejam `NULL` e 0, e verifique se essas linhas foram inseridas, conforme mostrado aqui:

```sql
mysql> INSERT INTO th VALUES (NULL, 'mothra'), (0, 'gigan');
Query OK, 1 row affected (0.00 sec)

mysql> SELECT * FROM th;
+------+---------+
| c1   | c2      |
+------+---------+
| NULL | mothra  |
+------+---------+
|    0 | gigan   |
+------+---------+
2 rows in set (0.01 sec)
```

Lembre-se de que para qualquer inteiro *`N`*, o valor de `NULL MOD N` é sempre `NULL`. Para tabelas que são particionadas por `HASH` ou `KEY`, este resultado é tratado como `0` para determinar a partição correta. Verificando a tabela [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table") do Information Schema mais uma vez, podemos ver que ambas as linhas foram inseridas na partição `p0`:

```sql
mysql> SELECT TABLE_NAME, PARTITION_NAME, TABLE_ROWS, AVG_ROW_LENGTH, DATA_LENGTH
     >   FROM INFORMATION_SCHEMA.PARTITIONS
     >   WHERE TABLE_SCHEMA = 'p' AND TABLE_NAME ='th';
+------------+----------------+------------+----------------+-------------+
| TABLE_NAME | PARTITION_NAME | TABLE_ROWS | AVG_ROW_LENGTH | DATA_LENGTH |
+------------+----------------+------------+----------------+-------------+
| th         | p0             |          2 |             20 |          20 |
| th         | p1             |          0 |              0 |           0 |
+------------+----------------+------------+----------------+-------------+
2 rows in set (0.00 sec)
```

Ao repetir o último exemplo usando `PARTITION BY KEY` no lugar de `PARTITION BY HASH` na definição da tabela, você pode verificar que `NULL` também é tratado como 0 para este tipo de particionamento.