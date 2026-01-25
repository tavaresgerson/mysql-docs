### 22.6.1 Chaves de Partitioning, Primary Keys e Unique Keys

Esta seção discute a relação das Chaves de Partitioning com Primary Keys e Unique Keys. A regra que rege essa relação pode ser expressa da seguinte forma: Todas as colunas usadas na expressão de Partitioning para uma tabela particionada devem fazer parte de cada Unique Key que a tabela possa ter.

Em outras palavras, *cada Unique Key na tabela deve usar todas as colunas na expressão de Partitioning da tabela*. (Isso também inclui a Primary Key da tabela, visto que, por definição, ela é uma Unique Key. Este caso específico é discutido mais adiante nesta seção.) Por exemplo, cada uma das seguintes instruções de criação de tabela é inválida:

```sql
CREATE TABLE t1 (
    col1 INT NOT NULL,
    col2 DATE NOT NULL,
    col3 INT NOT NULL,
    col4 INT NOT NULL,
    UNIQUE KEY (col1, col2)
)
PARTITION BY HASH(col3)
PARTITIONS 4;

CREATE TABLE t2 (
    col1 INT NOT NULL,
    col2 DATE NOT NULL,
    col3 INT NOT NULL,
    col4 INT NOT NULL,
    UNIQUE KEY (col1),
    UNIQUE KEY (col3)
)
PARTITION BY HASH(col1 + col3)
PARTITIONS 4;
```

Em cada caso, a tabela proposta teria pelo menos uma Unique Key que não inclui todas as colunas usadas na expressão de Partitioning.

Cada uma das seguintes instruções é válida e representa uma maneira pela qual a instrução de criação de tabela inválida correspondente poderia ser corrigida para funcionar:

```sql
CREATE TABLE t1 (
    col1 INT NOT NULL,
    col2 DATE NOT NULL,
    col3 INT NOT NULL,
    col4 INT NOT NULL,
    UNIQUE KEY (col1, col2, col3)
)
PARTITION BY HASH(col3)
PARTITIONS 4;

CREATE TABLE t2 (
    col1 INT NOT NULL,
    col2 DATE NOT NULL,
    col3 INT NOT NULL,
    col4 INT NOT NULL,
    UNIQUE KEY (col1, col3)
)
PARTITION BY HASH(col1 + col3)
PARTITIONS 4;
```

Este exemplo mostra o erro produzido em tais casos:

```sql
mysql> CREATE TABLE t3 (
    ->     col1 INT NOT NULL,
    ->     col2 DATE NOT NULL,
    ->     col3 INT NOT NULL,
    ->     col4 INT NOT NULL,
    ->     UNIQUE KEY (col1, col2),
    ->     UNIQUE KEY (col3)
    -> )
    -> PARTITION BY HASH(col1 + col3)
    -> PARTITIONS 4;
ERROR 1491 (HY000): A PRIMARY KEY must include all columns in the table's partitioning function
```

A instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") falha porque tanto `col1` quanto `col3` estão incluídas na Chave de Partitioning proposta, mas nenhuma dessas colunas faz parte de ambas as Unique Keys na tabela. Isto mostra uma possível correção para a definição de tabela inválida:

```sql
mysql> CREATE TABLE t3 (
    ->     col1 INT NOT NULL,
    ->     col2 DATE NOT NULL,
    ->     col3 INT NOT NULL,
    ->     col4 INT NOT NULL,
    ->     UNIQUE KEY (col1, col2, col3),
    ->     UNIQUE KEY (col3)
    -> )
    -> PARTITION BY HASH(col3)
    -> PARTITIONS 4;
Query OK, 0 rows affected (0.05 sec)
```

Neste caso, a Chave de Partitioning proposta `col3` faz parte de ambas as Unique Keys, e a instrução de criação de tabela é bem-sucedida.

A tabela a seguir não pode ser particionada de forma alguma, pois não há como incluir em uma Chave de Partitioning colunas que pertençam a ambas as Unique Keys:

```sql
CREATE TABLE t4 (
    col1 INT NOT NULL,
    col2 INT NOT NULL,
    col3 INT NOT NULL,
    col4 INT NOT NULL,
    UNIQUE KEY (col1, col3),
    UNIQUE KEY (col2, col4)
);
```

Visto que toda Primary Key é, por definição, uma Unique Key, esta restrição também inclui a Primary Key da tabela, se ela tiver uma. Por exemplo, as próximas duas instruções são inválidas:

```sql
CREATE TABLE t5 (
    col1 INT NOT NULL,
    col2 DATE NOT NULL,
    col3 INT NOT NULL,
    col4 INT NOT NULL,
    PRIMARY KEY(col1, col2)
)
PARTITION BY HASH(col3)
PARTITIONS 4;

CREATE TABLE t6 (
    col1 INT NOT NULL,
    col2 DATE NOT NULL,
    col3 INT NOT NULL,
    col4 INT NOT NULL,
    PRIMARY KEY(col1, col3),
    UNIQUE KEY(col2)
)
PARTITION BY HASH( YEAR(col2) )
PARTITIONS 4;
```

Em ambos os casos, a Primary Key não inclui todas as colunas referenciadas na expressão de Partitioning. No entanto, as duas instruções seguintes são válidas:

```sql
CREATE TABLE t7 (
    col1 INT NOT NULL,
    col2 DATE NOT NULL,
    col3 INT NOT NULL,
    col4 INT NOT NULL,
    PRIMARY KEY(col1, col2)
)
PARTITION BY HASH(col1 + YEAR(col2))
PARTITIONS 4;

CREATE TABLE t8 (
    col1 INT NOT NULL,
    col2 DATE NOT NULL,
    col3 INT NOT NULL,
    col4 INT NOT NULL,
    PRIMARY KEY(col1, col2, col4),
    UNIQUE KEY(col2, col1)
)
PARTITION BY HASH(col1 + YEAR(col2))
PARTITIONS 4;
```

Se uma tabela não tiver Unique Keys — o que inclui não ter uma Primary Key — então esta restrição não se aplica, e você pode usar qualquer coluna ou colunas na expressão de Partitioning, contanto que o tipo da coluna seja compatível com o tipo de Partitioning.

Pela mesma razão, você não pode adicionar posteriormente uma Unique Key a uma tabela particionada, a menos que a chave inclua todas as colunas usadas pela expressão de Partitioning da tabela. Considere a tabela particionada criada conforme mostrado aqui:

```sql
mysql> CREATE TABLE t_no_pk (c1 INT, c2 INT)
    ->     PARTITION BY RANGE(c1) (
    ->         PARTITION p0 VALUES LESS THAN (10),
    ->         PARTITION p1 VALUES LESS THAN (20),
    ->         PARTITION p2 VALUES LESS THAN (30),
    ->         PARTITION p3 VALUES LESS THAN (40)
    ->     );
Query OK, 0 rows affected (0.12 sec)
```

É possível adicionar uma Primary Key a `t_no_pk` usando qualquer uma destas instruções [`ALTER TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations"):

```sql
#  possible PK
mysql> ALTER TABLE t_no_pk ADD PRIMARY KEY(c1);
Query OK, 0 rows affected (0.13 sec)
Records: 0  Duplicates: 0  Warnings: 0

# drop this PK
mysql> ALTER TABLE t_no_pk DROP PRIMARY KEY;
Query OK, 0 rows affected (0.10 sec)
Records: 0  Duplicates: 0  Warnings: 0

#  use another possible PK
mysql> ALTER TABLE t_no_pk ADD PRIMARY KEY(c1, c2);
Query OK, 0 rows affected (0.12 sec)
Records: 0  Duplicates: 0  Warnings: 0

# drop this PK
mysql> ALTER TABLE t_no_pk DROP PRIMARY KEY;
Query OK, 0 rows affected (0.09 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

No entanto, a próxima instrução falha, porque `c1` faz parte da Chave de Partitioning, mas não faz parte da Primary Key proposta:

```sql
#  fails with error 1503
mysql> ALTER TABLE t_no_pk ADD PRIMARY KEY(c2);
ERROR 1503 (HY000): A PRIMARY KEY must include all columns in the table's partitioning function
```

Visto que `t_no_pk` tem apenas `c1` em sua expressão de Partitioning, a tentativa de adicionar uma Unique Key em `c2` sozinha falha. No entanto, você pode adicionar uma Unique Key que use tanto `c1` quanto `c2`.

Estas regras também se aplicam a tabelas existentes não particionadas que você deseja particionar usando [`ALTER TABLE ... PARTITION BY`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations"). Considere uma tabela `np_pk` criada conforme mostrado aqui:

```sql
mysql> CREATE TABLE np_pk (
    ->     id INT NOT NULL AUTO_INCREMENT,
    ->     name VARCHAR(50),
    ->     added DATE,
    ->     PRIMARY KEY (id)
    -> );
Query OK, 0 rows affected (0.08 sec)
```

A seguinte instrução [`ALTER TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") falha com um erro, porque a coluna `added` não faz parte de nenhuma Unique Key na tabela:

```sql
mysql> ALTER TABLE np_pk
    ->     PARTITION BY HASH( TO_DAYS(added) )
    ->     PARTITIONS 4;
ERROR 1503 (HY000): A PRIMARY KEY must include all columns in the table's partitioning function
```

No entanto, esta instrução que usa a coluna `id` para a coluna de Partitioning é válida, conforme mostrado aqui:

```sql
mysql> ALTER TABLE np_pk
    ->     PARTITION BY HASH(id)
    ->     PARTITIONS 4;
Query OK, 0 rows affected (0.11 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

No caso de `np_pk`, a única coluna que pode ser usada como parte de uma expressão de Partitioning é `id`; se você deseja particionar esta tabela usando qualquer outra coluna ou colunas na expressão de Partitioning, você deve primeiro modificar a tabela, adicionando a coluna ou colunas desejadas à Primary Key, ou removendo a Primary Key completamente.