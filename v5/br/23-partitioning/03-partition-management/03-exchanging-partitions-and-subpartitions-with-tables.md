### 22.3.3 Trocando Partições e Subpartições com Tabelas

No MySQL 5.7, é possível trocar uma Partition ou Subpartition de uma tabela com outra tabela usando `ALTER TABLE pt EXCHANGE PARTITION p WITH TABLE nt`, onde *`pt`* é a tabela particionada e *`p`* é a Partition ou Subpartition de *`pt`* a ser trocada com a tabela não particionada *`nt`*, desde que as seguintes condições sejam verdadeiras:

1. A tabela *`nt`* não é particionada.

2. A tabela *`nt`* não é uma tabela temporária.

3. As estruturas das tabelas *`pt`* e *`nt`* são idênticas em todos os outros aspectos.

4. A tabela `nt` não contém referências de Foreign Key, e nenhuma outra tabela possui Foreign Keys que se referem a `nt`.

5. Não há Rows em *`nt`* que estejam fora dos limites da definição da Partition para *`p`*. Esta condição não se aplica se a opção `WITHOUT VALIDATION` for usada. A opção `[{WITH|WITHOUT} VALIDATION]` foi adicionada no MySQL 5.7.5.

6. Ambas as tabelas devem usar o mesmo conjunto de caracteres (`character set`) e `collation`.

7. Para tabelas `InnoDB`, ambas as tabelas devem usar o mesmo Row Format. Para determinar o Row Format de uma tabela `InnoDB`, faça um Query na tabela [`INNODB_SYS_TABLES`](information-schema-innodb-sys-tables-table.html "24.4.23 The INFORMATION_SCHEMA INNODB_SYS_TABLES Table") do Information Schema.

8. Qualquer configuração de `MAX_ROWS` no nível da Partition para `p` deve ser a mesma que o valor de `MAX_ROWS` no nível da tabela definido para `nt`. A configuração para qualquer valor de `MIN_ROWS` no nível da Partition para `p` também deve ser a mesma que o valor de `MIN_ROWS` no nível da tabela definido para `nt`.

   Isso é verdadeiro, independentemente de *`pt`* ter ou não uma opção explícita de `MAX_ROWS` ou `MIN_ROWS` em vigor no nível da tabela.

9. O `AVG_ROW_LENGTH` não pode ser diferente entre as duas tabelas `pt` e `nt`.

10. `pt` não possui nenhuma Partition que use a opção `DATA DIRECTORY`. Esta restrição é removida para tabelas `InnoDB` no MySQL 5.7.25 e posterior.

11. O `INDEX DIRECTORY` não pode ser diferente entre a tabela e a Partition a ser trocada.

12. Nenhuma opção de `TABLESPACE` de tabela ou Partition pode ser usada em nenhuma das tabelas.

Além dos privilégios [`ALTER`](privileges-provided.html#priv_alter), [`INSERT`](privileges-provided.html#priv_insert) e [`CREATE`](privileges-provided.html#priv_create) geralmente exigidos para instruções [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), você deve ter o privilégio [`DROP`](privileges-provided.html#priv_drop) para executar [`ALTER TABLE ... EXCHANGE PARTITION`](alter-table.html "13.1.8 ALTER TABLE Statement").

Você também deve estar ciente dos seguintes efeitos de [`ALTER TABLE ... EXCHANGE PARTITION`](alter-table.html "13.1.8 ALTER TABLE Statement"):

* A execução de [`ALTER TABLE ... EXCHANGE PARTITION`](alter-table.html "13.1.8 ALTER TABLE Statement") não invoca nenhum Trigger, nem na tabela particionada, nem na tabela a ser trocada.

* Quaisquer colunas `AUTO_INCREMENT` na tabela trocada são resetadas.

* A palavra-chave `IGNORE` não tem efeito quando usada com `ALTER TABLE ... EXCHANGE PARTITION`.

A sintaxe da instrução [`ALTER TABLE ... EXCHANGE PARTITION`](alter-table.html "13.1.8 ALTER TABLE Statement") é mostrada aqui, onde *`pt`* é a tabela particionada, *`p`* é a Partition ou Subpartition a ser trocada, e *`nt`* é a tabela não particionada a ser trocada com *`p`*:

```sql
ALTER TABLE pt
    EXCHANGE PARTITION p
    WITH TABLE nt;
```

Opcionalmente, você pode anexar uma cláusula `WITH VALIDATION` ou `WITHOUT VALIDATION`. Quando `WITHOUT VALIDATION` é especificado, a operação [`ALTER TABLE ... EXCHANGE PARTITION`](alter-table.html "13.1.8 ALTER TABLE Statement") não realiza a Validation Row por Row ao trocar uma Partition com uma tabela não particionada, permitindo que os administradores de Database assumam a responsabilidade de garantir que as Rows estejam dentro dos limites da definição da Partition. `WITH VALIDATION` é o comportamento padrão e não precisa ser especificado explicitamente. A opção `[{WITH|WITHOUT} VALIDATION]` foi adicionada no MySQL 5.7.5.

Uma e apenas uma Partition ou Subpartition pode ser trocada com uma e apenas uma tabela não particionada em uma única instrução [`ALTER TABLE EXCHANGE PARTITION`](alter-table.html "13.1.8 ALTER TABLE Statement"). Para trocar múltiplas Partitions ou Subpartitions, use múltiplas instruções [`ALTER TABLE EXCHANGE PARTITION`](alter-table.html "13.1.8 ALTER TABLE Statement"). `EXCHANGE PARTITION` não pode ser combinada com outras opções de [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"). O Partitioning e o Subpartitioning (se aplicável) usados pela tabela particionada podem ser de qualquer tipo ou tipos suportados no MySQL 5.7.

#### Trocando uma Partition com uma Tabela Não Particionada

Suponha que uma tabela particionada `e` tenha sido criada e preenchida usando as seguintes instruções SQL:

```sql
CREATE TABLE e (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30)
)
    PARTITION BY RANGE (id) (
        PARTITION p0 VALUES LESS THAN (50),
        PARTITION p1 VALUES LESS THAN (100),
        PARTITION p2 VALUES LESS THAN (150),
        PARTITION p3 VALUES LESS THAN (MAXVALUE)
);

INSERT INTO e VALUES
    (1669, "Jim", "Smith"),
    (337, "Mary", "Jones"),
    (16, "Frank", "White"),
    (2005, "Linda", "Black");
```

Agora, criamos uma cópia não particionada de `e` chamada `e2`. Isso pode ser feito usando o cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), conforme mostrado aqui:

```sql
mysql> CREATE TABLE e2 LIKE e;
Query OK, 0 rows affected (1.34 sec)

mysql> ALTER TABLE e2 REMOVE PARTITIONING;
Query OK, 0 rows affected (0.90 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

Você pode ver quais Partitions na tabela `e` contêm Rows, executando um Query na tabela [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table") do Information Schema, da seguinte forma:

```sql
mysql> SELECT PARTITION_NAME, TABLE_ROWS
    ->     FROM INFORMATION_SCHEMA.PARTITIONS
    ->     WHERE TABLE_NAME = 'e';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p0             |          1 |
| p1             |          0 |
| p2             |          0 |
| p3             |          3 |
+----------------+------------+
4 rows in set (0.00 sec)
```

Nota

Para tabelas `InnoDB` particionadas, a contagem de Rows fornecida na coluna `TABLE_ROWS` da tabela [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table") do Information Schema é apenas um valor estimado usado na otimização SQL e nem sempre é exato.

Para trocar a Partition `p0` na tabela `e` com a tabela `e2`, você pode usar a instrução [`ALTER TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") mostrada aqui:

```sql
mysql> ALTER TABLE e EXCHANGE PARTITION p0 WITH TABLE e2;
Query OK, 0 rows affected (0.28 sec)
```

Mais precisamente, a instrução emitida faz com que quaisquer Rows encontradas na Partition sejam trocadas com aquelas encontradas na tabela. Você pode observar como isso ocorreu executando um Query na tabela [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table") do Information Schema, como antes. A Row da tabela que estava anteriormente na Partition `p0` não está mais presente:

```sql
mysql> SELECT PARTITION_NAME, TABLE_ROWS
    ->     FROM INFORMATION_SCHEMA.PARTITIONS
    ->     WHERE TABLE_NAME = 'e';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p0             |          0 |
| p1             |          0 |
| p2             |          0 |
| p3             |          3 |
+----------------+------------+
4 rows in set (0.00 sec)
```

Se você executar um Query na tabela `e2`, poderá ver que a Row "ausente" agora pode ser encontrada lá:

```sql
mysql> SELECT * FROM e2;
+----+-------+-------+
| id | fname | lname |
+----+-------+-------+
| 16 | Frank | White |
+----+-------+-------+
1 row in set (0.00 sec)
```

A tabela a ser trocada com a Partition não precisa necessariamente estar vazia. Para demonstrar isso, primeiro inserimos uma nova Row na tabela `e`, garantindo que esta Row seja armazenada na Partition `p0` ao escolher um valor de coluna `id` menor que 50, e verificando isso posteriormente executando um Query na tabela [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table"):

```sql
mysql> INSERT INTO e VALUES (41, "Michael", "Green");
Query OK, 1 row affected (0.05 sec)

mysql> SELECT PARTITION_NAME, TABLE_ROWS
    ->     FROM INFORMATION_SCHEMA.PARTITIONS
    ->     WHERE TABLE_NAME = 'e';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p0             |          1 |
| p1             |          0 |
| p2             |          0 |
| p3             |          3 |
+----------------+------------+
4 rows in set (0.00 sec)
```

Agora, trocamos novamente a Partition `p0` com a tabela `e2` usando a mesma instrução [`ALTER TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") que antes:

```sql
mysql> ALTER TABLE e EXCHANGE PARTITION p0 WITH TABLE e2;
Query OK, 0 rows affected (0.28 sec)
```

O resultado dos seguintes Queries mostra que a Row da tabela que estava armazenada na Partition `p0` e a Row da tabela que estava armazenada na tabela `e2`, antes de emitir a instrução [`ALTER TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations"), agora trocaram de lugar:

```sql
mysql> SELECT * FROM e;
+------+-------+-------+
| id   | fname | lname |
+------+-------+-------+
|   16 | Frank | White |
| 1669 | Jim   | Smith |
|  337 | Mary  | Jones |
| 2005 | Linda | Black |
+------+-------+-------+
4 rows in set (0.00 sec)

mysql> SELECT PARTITION_NAME, TABLE_ROWS
    ->     FROM INFORMATION_SCHEMA.PARTITIONS
    ->     WHERE TABLE_NAME = 'e';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p0             |          1 |
| p1             |          0 |
| p2             |          0 |
| p3             |          3 |
+----------------+------------+
4 rows in set (0.00 sec)

mysql> SELECT * FROM e2;
+----+---------+-------+
| id | fname   | lname |
+----+---------+-------+
| 41 | Michael | Green |
+----+---------+-------+
1 row in set (0.00 sec)
```

#### Rows Não Correspondentes

Você deve ter em mente que quaisquer Rows encontradas na tabela não particionada antes de emitir a instrução [`ALTER TABLE ... EXCHANGE PARTITION`](alter-table.html "13.1.8 ALTER TABLE Statement") devem atender às condições exigidas para serem armazenadas na Partition de destino; caso contrário, a instrução falha. Para ver como isso acontece, primeiro insira uma Row em `e2` que esteja fora dos limites da definição da Partition para a Partition `p0` da tabela `e`. Por exemplo, insira uma Row com um valor de coluna `id` muito grande; em seguida, tente trocar a tabela com a Partition novamente:

```sql
mysql> INSERT INTO e2 VALUES (51, "Ellen", "McDonald");
Query OK, 1 row affected (0.08 sec)

mysql> ALTER TABLE e EXCHANGE PARTITION p0 WITH TABLE e2;
ERROR 1707 (HY000): Found row that does not match the partition
```

Apenas a opção `WITHOUT VALIDATION` permitiria que esta operação fosse bem-sucedida:

```sql
mysql> ALTER TABLE e EXCHANGE PARTITION p0 WITH TABLE e2 WITHOUT VALIDATION;
Query OK, 0 rows affected (0.02 sec)
```

Quando uma Partition é trocada com uma tabela que contém Rows que não correspondem à definição da Partition, é responsabilidade do administrador do Database corrigir as Rows não correspondentes, o que pode ser feito usando [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") ou [`ALTER TABLE ... REPAIR PARTITION`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations").

#### Trocando Partitions Sem Validation Row por Row

Para evitar a Validation demorada ao trocar uma Partition com uma tabela que possui muitas Rows, é possível pular a etapa de Validation Row por Row, anexando `WITHOUT VALIDATION` à instrução [`ALTER TABLE ... EXCHANGE PARTITION`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations").

O exemplo a seguir compara a diferença entre os tempos de execução ao trocar uma Partition com uma tabela não particionada, com e sem Validation. A tabela particionada (tabela `e`) contém duas Partitions de 1 milhão de Rows cada. As Rows em p0 da tabela e são removidas e p0 é trocada com uma tabela não particionada de 1 milhão de Rows. A operação `WITH VALIDATION` leva 0,74 segundos. Em comparação, a operação `WITHOUT VALIDATION` leva 0,01 segundos.

```sql
# Create a partitioned table with 1 million rows in each partition

CREATE TABLE e (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30)
)
    PARTITION BY RANGE (id) (
        PARTITION p0 VALUES LESS THAN (1000001),
        PARTITION p1 VALUES LESS THAN (2000001),
);

SELECT COUNT(*) FROM e;
| COUNT(*) |
+----------+
|  2000000 |
+----------+
1 row in set (0.27 sec)

# View the rows in each partition

SELECT PARTITION_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.PARTITIONS WHERE TABLE_NAME = 'e';
+----------------+-------------+
| PARTITION_NAME | TABLE_ROWS  |
+----------------+-------------+
| p0             |     1000000 |
| p1             |     1000000 |
+----------------+-------------+
2 rows in set (0.00 sec)

# Create a nonpartitioned table of the same structure and populate it with 1 million rows

CREATE TABLE e2 (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30)
);

mysql> SELECT COUNT(*) FROM e2;
+----------+
| COUNT(*) |
+----------+
|  1000000 |
+----------+
1 row in set (0.24 sec)

# Create another nonpartitioned table of the same structure and populate it with 1 million rows

CREATE TABLE e3 (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30)
);

mysql> SELECT COUNT(*) FROM e3;
+----------+
| COUNT(*) |
+----------+
|  1000000 |
+----------+
1 row in set (0.25 sec)

# Drop the rows from p0 of table e

mysql> DELETE FROM e WHERE id < 1000001;
Query OK, 1000000 rows affected (5.55 sec)

# Confirm that there are no rows in partition p0

mysql> SELECT PARTITION_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.PARTITIONS WHERE TABLE_NAME = 'e';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p0             |          0 |
| p1             |    1000000 |
+----------------+------------+
2 rows in set (0.00 sec)

# Exchange partition p0 of table e with the table e2 'WITH VALIDATION'

mysql> ALTER TABLE e EXCHANGE PARTITION p0 WITH TABLE e2 WITH VALIDATION;
Query OK, 0 rows affected (0.74 sec)

# Confirm that the partition was exchanged with table e2

mysql> SELECT PARTITION_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.PARTITIONS WHERE TABLE_NAME = 'e';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p0             |    1000000 |
| p1             |    1000000 |
+----------------+------------+
2 rows in set (0.00 sec)

# Once again, drop the rows from p0 of table e

mysql> DELETE FROM e WHERE id < 1000001;
Query OK, 1000000 rows affected (5.55 sec)

# Confirm that there are no rows in partition p0

mysql> SELECT PARTITION_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.PARTITIONS WHERE TABLE_NAME = 'e';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p0             |          0 |
| p1             |    1000000 |
+----------------+------------+
2 rows in set (0.00 sec)

# Exchange partition p0 of table e with the table e3 'WITHOUT VALIDATION'

mysql> ALTER TABLE e EXCHANGE PARTITION p0 WITH TABLE e3 WITHOUT VALIDATION;
Query OK, 0 rows affected (0.01 sec)

# Confirm that the partition was exchanged with table e3

mysql> SELECT PARTITION_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.PARTITIONS WHERE TABLE_NAME = 'e';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p0             |    1000000 |
| p1             |    1000000 |
+----------------+------------+
2 rows in set (0.00 sec)
```

Se uma Partition for trocada com uma tabela que contenha Rows que não correspondem à definição da Partition, é responsabilidade do administrador do Database corrigir as Rows não correspondentes, o que pode ser feito usando [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") ou [`ALTER TABLE ... REPAIR PARTITION`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations").

#### Trocando uma Subpartition com uma Tabela Não Particionada

Você também pode trocar uma Subpartition de uma tabela subparticionada (veja [Seção 22.2.6, “Subpartitioning”](partitioning-subpartitions.html "22.2.6 Subpartitioning")) com uma tabela não particionada usando uma instrução [`ALTER TABLE ... EXCHANGE PARTITION`](alter-table.html "13.1.8 ALTER TABLE Statement"). No exemplo a seguir, primeiro criamos uma tabela `es` que é particionada por `RANGE` e subparticionada por `KEY`, preenchemos esta tabela como fizemos com a tabela `e` e, em seguida, criamos uma cópia vazia e não particionada, `es2`, da tabela, conforme mostrado aqui:

```sql
mysql> CREATE TABLE es (
    ->     id INT NOT NULL,
    ->     fname VARCHAR(30),
    ->     lname VARCHAR(30)
    -> )
    ->     PARTITION BY RANGE (id)
    ->     SUBPARTITION BY KEY (lname)
    ->     SUBPARTITIONS 2 (
    ->         PARTITION p0 VALUES LESS THAN (50),
    ->         PARTITION p1 VALUES LESS THAN (100),
    ->         PARTITION p2 VALUES LESS THAN (150),
    ->         PARTITION p3 VALUES LESS THAN (MAXVALUE)
    ->     );
Query OK, 0 rows affected (2.76 sec)

mysql> INSERT INTO es VALUES
    ->     (1669, "Jim", "Smith"),
    ->     (337, "Mary", "Jones"),
    ->     (16, "Frank", "White"),
    ->     (2005, "Linda", "Black");
Query OK, 4 rows affected (0.04 sec)
Records: 4  Duplicates: 0  Warnings: 0

mysql> CREATE TABLE es2 LIKE es;
Query OK, 0 rows affected (1.27 sec)

mysql> ALTER TABLE es2 REMOVE PARTITIONING;
Query OK, 0 rows affected (0.70 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

Embora não tenhamos nomeado explicitamente nenhuma das Subpartitions ao criar a tabela `es`, podemos obter nomes gerados para elas incluindo o `SUBPARTITION_NAME` da tabela [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table") do `INFORMATION_SCHEMA` ao selecionar a partir dessa tabela, conforme mostrado aqui:

```sql
mysql> SELECT PARTITION_NAME, SUBPARTITION_NAME, TABLE_ROWS
    ->     FROM INFORMATION_SCHEMA.PARTITIONS
    ->     WHERE TABLE_NAME = 'es';
+----------------+-------------------+------------+
| PARTITION_NAME | SUBPARTITION_NAME | TABLE_ROWS |
+----------------+-------------------+------------+
| p0             | p0sp0             |          1 |
| p0             | p0sp1             |          0 |
| p1             | p1sp0             |          0 |
| p1             | p1sp1             |          0 |
| p2             | p2sp0             |          0 |
| p2             | p2sp1             |          0 |
| p3             | p3sp0             |          3 |
| p3             | p3sp1             |          0 |
+----------------+-------------------+------------+
8 rows in set (0.00 sec)
```

A seguinte instrução [`ALTER TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") troca a Subpartition `p3sp0` da tabela `es` com a tabela não particionada `es2`:

```sql
mysql> ALTER TABLE es EXCHANGE PARTITION p3sp0 WITH TABLE es2;
Query OK, 0 rows affected (0.29 sec)
```

Você pode verificar se as Rows foram trocadas emitindo os seguintes Queries:

```sql
mysql> SELECT PARTITION_NAME, SUBPARTITION_NAME, TABLE_ROWS
    ->     FROM INFORMATION_SCHEMA.PARTITIONS
    ->     WHERE TABLE_NAME = 'es';
+----------------+-------------------+------------+
| PARTITION_NAME | SUBPARTITION_NAME | TABLE_ROWS |
+----------------+-------------------+------------+
| p0             | p0sp0             |          1 |
| p0             | p0sp1             |          0 |
| p1             | p1sp0             |          0 |
| p1             | p1sp1             |          0 |
| p2             | p2sp0             |          0 |
| p2             | p2sp1             |          0 |
| p3             | p3sp0             |          0 |
| p3             | p3sp1             |          0 |
+----------------+-------------------+------------+
8 rows in set (0.00 sec)

mysql> SELECT * FROM es2;
+------+-------+-------+
| id   | fname | lname |
+------+-------+-------+
| 1669 | Jim   | Smith |
|  337 | Mary  | Jones |
| 2005 | Linda | Black |
+------+-------+-------+
3 rows in set (0.00 sec)
```

Se uma tabela for subparticionada, você pode trocar apenas uma Subpartition da tabela—e não uma Partition inteira—com uma tabela não particionada, conforme mostrado aqui:

```sql
mysql> ALTER TABLE es EXCHANGE PARTITION p3 WITH TABLE es2;
ERROR 1704 (HY000): Subpartitioned table, use subpartition instead of partition
```

A comparação das estruturas de tabela usadas pelo MySQL é muito rigorosa. O número, a ordem, os nomes e os tipos de colunas e Indexes da tabela particionada e da tabela não particionada devem corresponder exatamente. Além disso, ambas as tabelas devem usar o mesmo Storage Engine:

```sql
mysql> CREATE TABLE es3 LIKE e;
Query OK, 0 rows affected (1.31 sec)

mysql> ALTER TABLE es3 REMOVE PARTITIONING;
Query OK, 0 rows affected (0.53 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW CREATE TABLE es3\G
*************************** 1. row ***************************
       Table: es3
Create Table: CREATE TABLE `es3` (
  `id` int(11) NOT NULL,
  `fname` varchar(30) DEFAULT NULL,
  `lname` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1
1 row in set (0.00 sec)

mysql> ALTER TABLE es3 ENGINE = MyISAM;
Query OK, 0 rows affected (0.15 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> ALTER TABLE es EXCHANGE PARTITION p3sp0 WITH TABLE es3;
ERROR 1497 (HY000): The mix of handlers in the partitions is not allowed in this version of MySQL
```
