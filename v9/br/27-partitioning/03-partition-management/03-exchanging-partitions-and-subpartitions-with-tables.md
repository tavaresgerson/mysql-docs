### 26.3.3 Trocando Partições e Subpartições com Tabelas

No MySQL 9.5, é possível trocar uma tabela de partição ou subpartição por uma tabela usando `ALTER TABLE pt EXCHANGE PARTITION p WITH TABLE nt`, onde *`pt`* é a tabela particionada e *`p`* é a partição ou subpartição de *`pt`* a ser trocada com a tabela não particionada *`nt`*, desde que as seguintes condições sejam verdadeiras:

1. A tabela *`nt`* não esteja particionada.

2. A tabela *`nt`* não seja uma tabela temporária.

3. As estruturas das tabelas *`pt`* e *`nt`* sejam, de outra forma, idênticas.

4. A tabela `nt` não contenha referências de chave estrangeira e nenhuma outra tabela tenha chaves estrangeiras que se refiram a `nt`.

5. Não haja linhas em *`nt`* que estejam fora dos limites da definição de partição para *`p`*. Esta condição não se aplica se o `WITHOUT VALIDATION` for usado.

6. Ambas as tabelas devem usar o mesmo conjunto de caracteres e ordenação.

7. Para tabelas `InnoDB`, ambas as tabelas devem usar o mesmo formato de linha. Para determinar o formato de linha de uma tabela `InnoDB`, execute a consulta `INFORMATION_SCHEMA.INNODB_TABLES`.

8. Qualquer configuração de `MAX_ROWS` em nível de partição para `p` deve ser a mesma que o valor de `MAX_ROWS` em nível de tabela definido para `nt`. A configuração de qualquer configuração de `MIN_ROWS` em nível de partição para `p` também deve ser a mesma que o valor de `MIN_ROWS` em nível de tabela definido para `nt`.

Isso é verdadeiro em qualquer caso, independentemente de `pt` ter uma opção explícita de `MAX_ROWS` ou `MIN_ROWS` em nível de tabela em vigor.

9. A `AVG_ROW_LENGTH` não pode diferir entre as duas tabelas `pt` e `nt`.

10. O `INDEX DIRECTORY` não pode diferir entre a tabela e a partição a ser trocada com ela.

11. Nenhuma opção de tabela ou partição `TABLESPACE` pode ser usada em nenhuma das tabelas.

Além dos privilégios `ALTER`, `INSERT` e `CREATE` geralmente necessários para as instruções `ALTER TABLE`, você deve ter o privilégio `DROP` para executar `ALTER TABLE ... EXCHANGE PARTITION`.

Você também deve estar ciente dos seguintes efeitos de `ALTER TABLE ... EXCHANGE PARTITION`:

* Executar `ALTER TABLE ... EXCHANGE PARTITION` não invoca nenhum gatilho na tabela particionada ou na tabela a ser trocada.

* Quaisquer colunas `AUTO_INCREMENT` na tabela trocada são redefinidas.

* A palavra-chave `IGNORE` não tem efeito quando usada com `ALTER TABLE ... EXCHANGE PARTITION`.

A sintaxe para `ALTER TABLE ... EXCHANGE PARTITION` é mostrada aqui, onde *`pt`* é a tabela particionada, *`p`* é a partição (ou subpartição) a ser trocada, e *`nt`* é a tabela não particionada a ser trocada com *`p`*:

```
ALTER TABLE pt
    EXCHANGE PARTITION p
    WITH TABLE nt;
```

Opcionalmente, você pode anexar `WITH VALIDATION` ou `WITHOUT VALIDATION`. Quando `WITHOUT VALIDATION` é especificado, a operação `ALTER TABLE ... EXCHANGE PARTITION` não realiza nenhuma validação linha a linha ao trocar uma partição para uma tabela não particionada, permitindo que os administradores de banco de dados assumam a responsabilidade de garantir que as linhas estejam dentro dos limites da definição da partição. `WITH VALIDATION` é o padrão.

Uma e apenas uma partição ou subpartição pode ser trocada com uma e apenas uma tabela não particionada em uma única declaração `ALTER TABLE EXCHANGE PARTITION`. Para trocar múltiplas partições ou subpartições, use múltiplas declarações `ALTER TABLE EXCHANGE PARTITION`. `EXCHANGE PARTITION` não pode ser combinado com outras opções `ALTER TABLE`. O particionamento e (se aplicável) a subparticionamento usados pela tabela particionada podem ser de qualquer tipo ou tipos suportados no MySQL 9.5.

#### Trocando uma Partição com uma Tabela Não Particionada

Suponha que uma tabela particionada `e` tenha sido criada e preenchida usando os seguintes comandos SQL:

```
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

Agora, criamos uma cópia não particionada de `e` chamada `e2`. Isso pode ser feito usando o cliente **mysql** como mostrado aqui:

```
mysql> CREATE TABLE e2 LIKE e;
Query OK, 0 rows affected (0.04 sec)

mysql> ALTER TABLE e2 REMOVE PARTITIONING;
Query OK, 0 rows affected (0.07 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

Você pode ver quais partições na tabela `e` contêm linhas fazendo uma consulta à tabela do Schema de Informações `PARTITIONS`, assim:

```
mysql> SELECT PARTITION_NAME, TABLE_ROWS
           FROM INFORMATION_SCHEMA.PARTITIONS
           WHERE TABLE_NAME = 'e';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p0             |          1 |
| p1             |          0 |
| p2             |          0 |
| p3             |          3 |
+----------------+------------+
2 rows in set (0.00 sec)
```

Observação

Para tabelas `InnoDB` particionadas, o número de linhas fornecido na coluna `TABLE_ROWS` do Schema de Informações `PARTITIONS` é apenas um valor estimado usado na otimização do SQL e nem sempre é exato.

Para trocar a partição `p0` na tabela `e` com a tabela `e2`, você pode usar `ALTER TABLE`, como mostrado aqui:

```
mysql> ALTER TABLE e EXCHANGE PARTITION p0 WITH TABLE e2;
Query OK, 0 rows affected (0.04 sec)
```

Mais precisamente, a declaração que acabou de ser emitida faz com que quaisquer linhas encontradas na partição sejam trocadas com as encontradas na tabela. Você pode observar como isso aconteceu fazendo uma consulta à tabela do Schema de Informações `PARTITIONS`, como antes. A linha da tabela que estava anteriormente encontrada na partição `p0` não está mais presente:

```
mysql> SELECT PARTITION_NAME, TABLE_ROWS
           FROM INFORMATION_SCHEMA.PARTITIONS
           WHERE TABLE_NAME = 'e';
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

Se você fizer uma consulta à tabela `e2`, você pode ver que a linha “desaparecida” agora pode ser encontrada lá:

```
mysql> SELECT * FROM e2;
+----+-------+-------+
| id | fname | lname |
+----+-------+-------+
| 16 | Frank | White |
+----+-------+-------+
1 row in set (0.00 sec)
```

A tabela a ser trocada com a partição não precisa necessariamente estar vazia. Para demonstrar isso, primeiro inserimos uma nova linha na tabela `e`, garantindo que essa linha seja armazenada na partição `p0` escolhendo um valor de coluna `id` menor que 50, e verificando isso depois fazendo uma consulta à tabela `PARTITIONS`:

```
mysql> INSERT INTO e VALUES (41, "Michael", "Green");
Query OK, 1 row affected (0.05 sec)

mysql> SELECT PARTITION_NAME, TABLE_ROWS
           FROM INFORMATION_SCHEMA.PARTITIONS
           WHERE TABLE_NAME = 'e';
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

Agora, trocamos novamente a partição `p0` com a tabela `e2` usando a mesma declaração `ALTER TABLE` como anteriormente:

```
mysql> ALTER TABLE e EXCHANGE PARTITION p0 WITH TABLE e2;
Query OK, 0 rows affected (0.28 sec)
```

A saída das seguintes consultas mostra que a linha da tabela que foi armazenada na partição `p0` e a linha da tabela que foi armazenada na tabela `e2`, antes de emitir a instrução `ALTER TABLE`, agora trocou de lugar:

```
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
           FROM INFORMATION_SCHEMA.PARTITIONS
           WHERE TABLE_NAME = 'e';
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

#### Linhas Não Correspondentes

Você deve ter em mente que quaisquer linhas encontradas na tabela não particionada antes de emitir a instrução `ALTER TABLE ... EXCHANGE PARTITION` devem atender às condições necessárias para serem armazenadas na partição de destino; caso contrário, a instrução falhará. Para ver como isso ocorre, primeiro insira uma linha na `e2` que esteja fora dos limites da definição de partição para a partição `p0` da tabela `e`. Por exemplo, insira uma linha com um valor de coluna `id` que seja muito grande; então, tente trocar a tabela com a partição novamente:

```
mysql> INSERT INTO e2 VALUES (51, "Ellen", "McDonald");
Query OK, 1 row affected (0.08 sec)

mysql> ALTER TABLE e EXCHANGE PARTITION p0 WITH TABLE e2;
ERROR 1707 (HY000): Found row that does not match the partition
```

Apenas a opção `WITHOUT VALIDATION` permitiria que essa operação tivesse sucesso:

```
mysql> ALTER TABLE e EXCHANGE PARTITION p0 WITH TABLE e2 WITHOUT VALIDATION;
Query OK, 0 rows affected (0.02 sec)
```

Quando uma partição é trocada com uma tabela que contém linhas que não correspondem à definição da partição, é responsabilidade do administrador do banco de dados corrigir as linhas não correspondentes, o que pode ser feito usando `REPAIR TABLE` ou `ALTER TABLE ... REPAIR PARTITION`.

#### Trocando Partições Sem Validação Linha a Linha

Para evitar a validação demorada ao trocar uma partição com uma tabela que tem muitas linhas, é possível pular a etapa de validação linha a linha, adicionando `WITHOUT VALIDATION` à instrução `ALTER TABLE ... EXCHANGE PARTITION`.

O exemplo a seguir compara a diferença nos tempos de execução ao trocar uma partição com uma tabela não particionada, com e sem validação. A tabela particionada (tabela `e`) contém duas partições de 1 milhão de linhas cada. As linhas de p0 da tabela e são removidas e p0 é trocado por uma tabela não particionada de 1 milhão de linhas. A operação `WITH VALIDATION` leva 0,74 segundos. Em comparação, a operação `WITHOUT VALIDATION` leva 0,01 segundos.

```
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

mysql> SELECT COUNT(*) FROM e;
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

Se uma partição for trocada com uma tabela que contém linhas que não correspondem à definição da partição, cabe ao administrador do banco de dados corrigir as linhas que não correspondem, o que pode ser feito usando `REPAIR TABLE` ou `ALTER TABLE ... REPAIR PARTITION`.

#### Trocando uma Subpartição com uma Tabela Não Particionada

Você também pode trocar uma subpartição de uma tabela subparticionada (consulte a Seção 26.2.6, “Subparticionamento”) com uma tabela não particionada usando uma declaração `ALTER TABLE ... EXCHANGE PARTITION`. No exemplo a seguir, primeiro criamos uma tabela `es` que é particionada por `RANGE` e subparticionada por `KEY`, preenchendo essa tabela como fizemos com a tabela `e`, e depois criamos uma cópia vazia e não particionada `es2` da tabela, como mostrado aqui:

```
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

Embora não tenhamos nomeado explicitamente nenhuma das subpartições ao criar a tabela `es`, podemos obter nomes gerados para elas incluindo a coluna `SUBPARTITION_NAME` da tabela `PARTITIONS` de `INFORMATION_SCHEMA` ao selecionar dessa tabela, como mostrado aqui:

```
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

A seguinte declaração `ALTER TABLE` troca a subpartição `p3sp0` na tabela `es` com a tabela não particionada `es2`:

```
mysql> ALTER TABLE es EXCHANGE PARTITION p3sp0 WITH TABLE es2;
Query OK, 0 rows affected (0.29 sec)
```

Você pode verificar que as linhas foram trocadas emitindo as seguintes consultas:

```
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

Se uma tabela estiver subpartida, você pode trocar apenas uma subpartição da tabela — não toda a partição — com uma tabela não particionada, como mostrado aqui:

```
mysql> ALTER TABLE es EXCHANGE PARTITION p3 WITH TABLE es2;
ERROR 1704 (HY000): Subpartitioned table, use subpartition instead of partition
```

As estruturas das tabelas são comparadas de forma rigorosa; o número, a ordem, os nomes e os tipos de colunas e índices da tabela particionada e da tabela não particionada devem corresponder exatamente. Além disso, ambas as tabelas devem usar o mesmo mecanismo de armazenamento:

```
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)

mysql> ALTER TABLE es3 ENGINE = MyISAM;
Query OK, 0 rows affected (0.15 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> ALTER TABLE es EXCHANGE PARTITION p3sp0 WITH TABLE es3;
ERROR 1497 (HY000): The mix of handlers in the partitions is not allowed in this version of MySQL
```

A instrução `ALTER TABLE ... ENGINE ...` neste exemplo funciona porque a instrução `ALTER TABLE` anterior removeu a partição da tabela `es3`.