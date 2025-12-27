### 26.6.1 Chaves de Partição, Chaves Primárias e Chaves Únicas

Esta seção discute a relação entre as chaves de partição e as chaves primárias e únicas. A regra que rege essa relação pode ser expressa da seguinte forma: Todas as colunas usadas na expressão de partição de uma tabela particionada devem fazer parte de cada chave única que a tabela possa ter.

Em outras palavras, *cada chave única na tabela deve usar todas as colunas na expressão de partição da tabela*. (Isso inclui também a chave primária da tabela, já que, por definição, é uma chave única. Este caso específico é discutido mais adiante nesta seção.) Por exemplo, cada uma das seguintes declarações de criação de tabela é inválida:

```
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

Em cada caso, a tabela proposta teria pelo menos uma chave única que não inclui todas as colunas usadas na expressão de partição.

Cada uma das seguintes declarações é válida e representa uma maneira de fazer a declaração de criação de tabela inválida funcionar:

```
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

Este exemplo mostra o erro produzido nesses casos:

```
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

A declaração `CREATE TABLE` falha porque tanto `col1` quanto `col3` estão incluídos na chave de partição proposta, mas nenhuma dessas colunas faz parte de ambas as chaves únicas na tabela. Isso mostra uma possível correção para a definição de tabela inválida:

```
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

Neste caso, a chave de partição proposta `col3` faz parte de ambas as chaves únicas, e a declaração de criação de tabela é bem-sucedida.

A tabela a seguir não pode ser particionada de forma alguma, porque não há como incluir em uma chave de partição colunas que pertencem a ambas as chaves únicas:

```
CREATE TABLE t4 (
    col1 INT NOT NULL,
    col2 INT NOT NULL,
    col3 INT NOT NULL,
    col4 INT NOT NULL,
    UNIQUE KEY (col1, col3),
    UNIQUE KEY (col2, col4)
);
```

Como toda chave primária é, por definição, uma chave única, essa restrição também inclui a chave primária da tabela, se ela existir. Por exemplo, as duas declarações a seguir são inválidas:

```
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

Em ambos os casos, a chave primária não inclui todas as colunas referenciadas na expressão de particionamento. No entanto, as duas declarações a seguir são válidas:

```
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

Se uma tabela não tiver chaves únicas—o que inclui não ter uma chave primária—então essa restrição não se aplica, e você pode usar qualquer coluna ou colunas na expressão de particionamento, desde que o tipo de coluna seja compatível com o tipo de particionamento.

Pelo mesmo motivo, você não pode adicionar uma chave única a uma tabela particionada, a menos que a chave inclua todas as colunas usadas pela expressão de particionamento da tabela. Considere a tabela particionada criada como mostrado aqui:

```
mysql> CREATE TABLE t_no_pk (c1 INT, c2 INT)
    ->     PARTITION BY RANGE(c1) (
    ->         PARTITION p0 VALUES LESS THAN (10),
    ->         PARTITION p1 VALUES LESS THAN (20),
    ->         PARTITION p2 VALUES LESS THAN (30),
    ->         PARTITION p3 VALUES LESS THAN (40)
    ->     );
Query OK, 0 rows affected (0.12 sec)
```

É possível adicionar uma chave primária a `t_no_pk` usando uma das seguintes declarações `ALTER TABLE`:

```
# possible PK
mysql> ALTER TABLE t_no_pk ADD PRIMARY KEY(c1);
Query OK, 0 rows affected (0.13 sec)
Records: 0  Duplicates: 0  Warnings: 0

# drop this PK
mysql> ALTER TABLE t_no_pk DROP PRIMARY KEY;
Query OK, 0 rows affected (0.10 sec)
Records: 0  Duplicates: 0  Warnings: 0

# use another possible PK
mysql> ALTER TABLE t_no_pk ADD PRIMARY KEY(c1, c2);
Query OK, 0 rows affected (0.12 sec)
Records: 0  Duplicates: 0  Warnings: 0

# drop this PK
mysql> ALTER TABLE t_no_pk DROP PRIMARY KEY;
Query OK, 0 rows affected (0.09 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

No entanto, a próxima declaração falha, porque `c1` faz parte da chave de particionamento, mas não faz parte da chave primária proposta:

```
# fails with error 1503
mysql> ALTER TABLE t_no_pk ADD PRIMARY KEY(c2);
ERROR 1503 (HY000): A PRIMARY KEY must include all columns in the table's partitioning function
```

Como `t_no_pk` tem apenas `c1` em sua expressão de particionamento, tentar adicionar uma chave única apenas em `c2` falha. No entanto, você pode adicionar uma chave única que use tanto `c1` quanto `c2`.

Essas regras também se aplicam a tabelas não particionadas existentes que você deseja particionar usando `ALTER TABLE ... PARTITION BY`. Considere uma tabela `np_pk` criada como mostrado aqui:

```
mysql> CREATE TABLE np_pk (
    ->     id INT NOT NULL AUTO_INCREMENT,
    ->     name VARCHAR(50),
    ->     added DATE,
    ->     PRIMARY KEY (id)
    -> );
Query OK, 0 rows affected (0.08 sec)
```

A seguinte declaração `ALTER TABLE` falha com um erro, porque a coluna `added` não faz parte de nenhuma chave única na tabela:

```
mysql> ALTER TABLE np_pk
    ->     PARTITION BY HASH( TO_DAYS(added) )
    ->     PARTITIONS 4;
ERROR 1503 (HY000): A PRIMARY KEY must include all columns in the table's partitioning function
```

No entanto, essa declaração usando a coluna `id` para a coluna de particionamento é válida, como mostrado aqui:

```
mysql> ALTER TABLE np_pk
    ->     PARTITION BY HASH(id)
    ->     PARTITIONS 4;
Query OK, 0 rows affected (0.11 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

No caso do `np_pk`, a única coluna que pode ser usada como parte de uma expressão de partição é `id`; se você deseja particionar essa tabela usando qualquer outra coluna ou colunas na expressão de partição, você deve primeiro modificar a tabela, adicionando a(s) coluna(s) desejada(s) à chave primária ou removendo a chave primária por completo.