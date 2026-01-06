### 22.2.7 Como o Partição do MySQL lida com NULL

A partição no MySQL não impede que `NULL` seja usado como valor de uma expressão de partição, seja ele o valor de uma coluna ou o valor de uma expressão fornecida pelo usuário. Embora seja permitido usar `NULL` como valor de uma expressão que, de outra forma, deve retornar um inteiro, é importante lembrar que `NULL` não é um número. A implementação de partição do MySQL trata `NULL` como sendo menor que qualquer valor que não seja `NULL`, assim como o faz a cláusula `ORDER BY`.

Isso significa que o tratamento de `NULL` varia entre os diferentes tipos de particionamento e pode produzir comportamentos que você não espera, se não estiver preparado para isso. Como este é o caso, discutimos nesta seção como cada tipo de particionamento do MySQL lida com os valores `NULL` ao determinar a partição na qual uma linha deve ser armazenada, e fornecemos exemplos para cada um.

**Tratamento de NULL com particionamento RANGE.** Se você inserir uma linha em uma tabela particionada por `RANGE` de tal forma que o valor da coluna usado para determinar a partição seja `NULL`, a linha será inserida na partição mais baixa. Considere essas duas tabelas em um banco de dados chamado `p`, criado da seguinte forma:

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

Você pode ver as partições criadas por essas duas instruções `CREATE TABLE` usando a seguinte consulta na tabela `PARTITIONS` no banco de dados `INFORMATION_SCHEMA`:

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

(Para mais informações sobre essa tabela, consulte Seção 24.3.16, “A Tabela INFORMATION\_SCHEMA PARTITIONS”.) Agora, vamos preencher cada uma dessas tabelas com uma única linha contendo um `NULL` na coluna usada como chave de partição, e verificar se as linhas foram inseridas usando um par de instruções `[SELECT`]\(select.html):

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

Você pode ver quais partições estão sendo usadas para armazenar as linhas inseridas, executando novamente a consulta anterior contra `INFORMATION_SCHEMA.PARTITIONS` e analisando o resultado:

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

Você também pode demonstrar que essas linhas foram armazenadas na partição mais baixa de cada tabela, eliminando essas partições e, em seguida, executando novamente as instruções `SELECT`:

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

(Para mais informações sobre `ALTER TABLE ... DROP PARTITION`, consulte Seção 13.1.8, “Instrução ALTER TABLE”.)

`NULL` também é tratado dessa maneira para expressões de partição que utilizam funções SQL. Suponha que definamos uma tabela usando uma declaração `CREATE TABLE` como esta:

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

Assim como outras funções do MySQL, \`YEAR(NULL) retorna `NULL`. Uma linha com o valor da coluna `dt`de`NULL`é tratada como se a expressão de partição tivesse avaliado a um valor menor que qualquer outro valor, e, portanto, é inserida na partição`p0\`.

**Tratamento de NULL com particionamento por LIST.** Uma tabela que é particionada por `LIST` admite valores `NULL` se e somente se uma de suas partições for definida usando essa lista de valores que contém `NULL`. A contrapartida disso é que uma tabela particionada por `LIST` que não usa explicitamente `NULL` em uma lista de valores rejeita linhas que resultam em um valor `NULL` para a expressão de particionamento, como mostrado neste exemplo:

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

Apenas as linhas com um valor de `c1` entre `0` e `8` (inclusive) podem ser inseridas em `ts1`. `NULL` está fora desse intervalo, assim como o número `9`. Podemos criar tabelas `ts2` e `ts3` com listas de valores que contêm `NULL`, como mostrado aqui:

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

Ao definir listas de valores para particionamento, você pode (e deve) tratar `NULL` da mesma forma que qualquer outro valor. Por exemplo, tanto `VALUES IN (NULL)` quanto `VALUES IN (1, 4, 7, NULL)` são válidos, assim como `VALUES IN (1, NULL, 4, 7)`, `VALUES IN (NULL, 1, 4, 7)`, e assim por diante. Você pode inserir uma linha com `NULL` para a coluna `c1` em cada uma das tabelas `ts2` e `ts3`:

```sql
mysql> INSERT INTO ts2 VALUES (NULL, 'mothra');
Query OK, 1 row affected (0.00 sec)

mysql> INSERT INTO ts3 VALUES (NULL, 'mothra');
Query OK, 1 row affected (0.00 sec)
```

Ao emitir a consulta apropriada contra a tabela do esquema de informações `PARTITIONS`, você pode determinar quais partições foram usadas para armazenar as linhas recém-inseridas (assumimos, como nos exemplos anteriores, que as tabelas particionadas foram criadas no banco de dados `p`):

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

Como mostrado anteriormente nesta seção, você também pode verificar quais partições foram usadas para armazenar as linhas, excluindo essas partições e, em seguida, executando uma consulta `SELECT`.

**Tratamento de NULL com particionamento HASH e KEY.** O `NULL` é tratado de maneira um pouco diferente para tabelas particionadas por `HASH` ou `KEY`. Nesses casos, qualquer expressão de particionamento que produza um valor `NULL` é tratada como se seu valor de retorno fosse zero. Podemos verificar esse comportamento examinando os efeitos no sistema de arquivos da criação de uma tabela particionada por `HASH` e sua população com um registro contendo valores apropriados. Suponha que você tenha uma tabela `th` (também no banco de dados `p`) criada usando a seguinte declaração:

```sql
mysql> CREATE TABLE th (
    ->     c1 INT,
    ->     c2 VARCHAR(20)
    -> )
    -> PARTITION BY HASH(c1)
    -> PARTITIONS 2;
Query OK, 0 rows affected (0.00 sec)
```

As partições pertencentes a esta tabela podem ser visualizadas usando a consulta mostrada aqui:

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

`TABLE_ROWS` para cada partição é 0. Agora, insira duas linhas no `th` cujos valores da coluna `c1` são `NULL` e 0, e verifique se essas linhas foram inseridas, conforme mostrado aqui:

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

Lembre-se de que, para qualquer inteiro *`N`*, o valor de `NULL MOD N` é sempre `NULL`. Para tabelas que são particionadas por `HASH` ou `KEY`, esse resultado é tratado como `0` para determinar a partição correta. Verificando novamente a tabela do esquema de informações `PARTITIONS`, podemos ver que ambas as linhas foram inseridas na partição `p0`:

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

Ao repetir o último exemplo usando `PARTITION BY KEY` no lugar de `PARTITION BY HASH` na definição da tabela, você pode verificar que `NULL` também é tratado como 0 para esse tipo de particionamento.
