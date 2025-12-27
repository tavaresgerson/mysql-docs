### 26.2.7 Como o Partição do MySQL lida com NULL

A partição no MySQL não impede o uso de `NULL` como valor de uma expressão de partição, seja ele o valor de uma coluna ou o valor de uma expressão fornecida pelo usuário. Embora seja permitido usar `NULL` como valor de uma expressão que, de outra forma, deve retornar um inteiro, é importante lembrar que `NULL` não é um número. A implementação de partição do MySQL trata `NULL` como sendo menor que qualquer valor não `NULL`, assim como o `ORDER BY`.

Isso significa que o tratamento de `NULL` varia entre os tipos de partição e pode produzir comportamentos que você não espera se não estiver preparado para isso. Nesse caso, discutimos nesta seção como cada tipo de partição do MySQL lida com valores `NULL` ao determinar a partição em que uma linha deve ser armazenada, e fornecemos exemplos para cada um.

**Tratamento de NULL com partição RANGE.** Se você inserir uma linha em uma tabela particionada por `RANGE` de modo que o valor da coluna usado para determinar a partição seja `NULL`, a linha é inserida na partição mais baixa. Considere estas duas tabelas em um banco de dados chamado `p`, criado da seguinte forma:

```
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

Você pode ver as partições criadas por essas duas instruções `CREATE TABLE` usando a seguinte consulta contra a tabela `PARTITIONS` no banco de dados `INFORMATION_SCHEMA`:

```
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

(Para mais informações sobre esta tabela, consulte a Seção 28.3.26, “A Tabela de PARTITIONS do INFORMATION\_SCHEMA”.) Agora, vamos preencher cada uma dessas tabelas com uma única linha contendo um `NULL` na coluna usada como chave de partição, e verificar que as linhas foram inseridas usando um par de instruções `SELECT`:

```
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

Você pode ver quais partições estão sendo usadas para armazenar as linhas inseridas executando novamente a consulta anterior contra `INFORMATION_SCHEMA.PARTITIONS` e examinando a saída:

```
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

Você também pode demonstrar que essas linhas foram armazenadas na partição numerada mais baixa de cada tabela, eliminando essas partições e executando novamente as instruções `SELECT`:

```
mysql> ALTER TABLE t1 DROP PARTITION p0;
Query OK, 0 rows affected (0.16 sec)

mysql> ALTER TABLE t2 DROP PARTITION p0;
Query OK, 0 rows affected (0.16 sec)

mysql> SELECT * FROM t1;
Empty set (0.00 sec)

mysql> SELECT * FROM t2;
Empty set (0.00 sec)
```

(Para mais informações sobre `ALTER TABLE ... DROP PARTITION`, consulte a Seção 15.1.11, “Instrução ALTER TABLE”.)

`NULL` também é tratado dessa maneira para expressões de partição que usam funções SQL. Suponha que definamos uma tabela usando uma instrução `CREATE TABLE` como esta:

```
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

Como com outras funções MySQL, `YEAR(NULL)` retorna `NULL`. Uma linha com um valor na coluna `dt` de `NULL` é tratada como se a expressão de partição tivesse avaliado a um valor menor que qualquer outro valor, e assim é inserida na partição `p0`.

**Tratamento de NULL com partição LIST.** Uma tabela que é particionada por `LIST` admite valores `NULL` se e somente se uma de suas partições for definida usando aquela lista de valores que contém `NULL`. A contraparte disso é que uma tabela particionada por `LIST` que não usa explicitamente `NULL` em uma lista de valores rejeita linhas que resultam em um valor `NULL` para a expressão de partição, como mostrado neste exemplo:

```
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

Apenas linhas com um valor de `c1` entre `0` e `8` inclusive podem ser inseridas em `ts1`. `NULL` fica fora desse intervalo, assim como o número `9`. Podemos criar tabelas `ts2` e `ts3` com listas de valores que contêm `NULL`, como mostrado aqui:

```
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

Ao definir listas de valores para particionamento, você pode (e deve) tratar `NULL` da mesma forma que qualquer outro valor. Por exemplo, tanto `VALUES IN (NULL)` quanto `VALUES IN (1, 4, 7, NULL)` são válidos, assim como `VALUES IN (1, NULL, 4, 7)`, `VALUES IN (NULL, 1, 4, 7)`, e assim por diante. Você pode inserir uma linha com `NULL` para a coluna `c1` em cada uma das tabelas `ts2` e `ts3`:

```
mysql> INSERT INTO ts2 VALUES (NULL, 'mothra');
Query OK, 1 row affected (0.00 sec)

mysql> INSERT INTO ts3 VALUES (NULL, 'mothra');
Query OK, 1 row affected (0.00 sec)
```

Ao emitir a consulta apropriada contra `INFORMATION_SCHEMA.PARTITIONS`, você pode determinar quais particionamentos foram usados para armazenar as linhas recém-inseridas (assumimos, como nos exemplos anteriores, que as tabelas particionadas foram criadas no banco de dados `p`):

```
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

Como mostrado anteriormente nesta seção, você também pode verificar quais particionamentos foram usados para armazenar as linhas ao excluir essas particionamentos e, em seguida, executar uma `SELECT`.

**Tratamento de NULL com particionamento HASH e KEY.** `NULL` é tratado de maneira um pouco diferente para tabelas particionadas por `HASH` ou `KEY`. Nesses casos, qualquer expressão de particionamento que produza um valor `NULL` é tratada como se seu valor de retorno fosse zero. Podemos verificar esse comportamento examinando os efeitos no sistema de arquivos da criação de uma tabela particionada por `HASH` e sua população com um registro contendo valores apropriados. Suponha que você tenha uma tabela `th` (também no banco de dados `p`) criada usando a seguinte declaração:

```
mysql> CREATE TABLE th (
    ->     c1 INT,
    ->     c2 VARCHAR(20)
    -> )
    -> PARTITION BY HASH(c1)
    -> PARTITIONS 2;
Query OK, 0 rows affected (0.00 sec)
```

As particionamentos pertencentes a essa tabela podem ser visualizados usando a consulta mostrada aqui:

```
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

`TABLE_ROWS` para cada particionamento é 0. Agora, insira duas linhas em `th` cujos valores da coluna `c1` são `NULL` e 0, e verifique se essas linhas foram inseridas, como mostrado aqui:

```
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

Lembre-se de que, para qualquer inteiro *`N`*, o valor de `NULL MOD N` é sempre `NULL`. Para tabelas que são particionadas por `HASH` ou `KEY`, esse resultado é tratado para determinar a partição correta como `0`. Verificando novamente a tabela do esquema de informações `PARTITIONS`, podemos ver que ambas as linhas foram inseridas na partição `p0`:

```
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

Ao repetir o último exemplo usando `PARTITION BY KEY` no lugar de `PARTITION BY HASH` na definição da tabela, você pode verificar que `NULL` também é tratado como 0 para esse tipo de particionamento.