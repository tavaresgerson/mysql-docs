#### 13.1.8.3 Exemplos de ALTER TABLE

Comece com uma tabela `t1` criada conforme mostrado aqui:

```sql
CREATE TABLE t1 (a INTEGER, b CHAR(10));
```

Para renomear a tabela de `t1` para `t2`:

```sql
ALTER TABLE t1 RENAME t2;
```

Para alterar a coluna `a` de [`INTEGER`](integer-types.html "11.1.2 Tipos de Inteiro (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") para `TINYINT NOT NULL` (mantendo o mesmo nome), e para alterar a coluna `b` de `CHAR(10)` para `CHAR(20)`, renomeando-a também de `b` para `c`:

```sql
ALTER TABLE t2 MODIFY a TINYINT NOT NULL, CHANGE b c CHAR(20);
```

Para adicionar uma nova coluna [`TIMESTAMP`](datetime.html "11.2.2 Os Tipos DATE, DATETIME e TIMESTAMP") chamada `d`:

```sql
ALTER TABLE t2 ADD d TIMESTAMP;
```

Para adicionar um Index na coluna `d` e um Index `UNIQUE` na coluna `a`:

```sql
ALTER TABLE t2 ADD INDEX (d), ADD UNIQUE (a);
```

Para remover a coluna `c`:

```sql
ALTER TABLE t2 DROP COLUMN c;
```

Para adicionar uma nova coluna inteira `AUTO_INCREMENT` chamada `c`:

```sql
ALTER TABLE t2 ADD c INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ADD PRIMARY KEY (c);
```

Indexamos `c` (como uma `PRIMARY KEY`) porque colunas `AUTO_INCREMENT` devem ser indexadas, e declaramos `c` como `NOT NULL` porque colunas de Primary Key não podem ser `NULL`.

Para tabelas [`NDB`](mysql-cluster.html "Capítulo 21 MySQL NDB Cluster 7.5 e NDB Cluster 7.6"), também é possível alterar o tipo de Storage usado para uma tabela ou coluna. Por exemplo, considere uma tabela [`NDB`](mysql-cluster.html "Capítulo 21 MySQL NDB Cluster 7.5 e NDB Cluster 7.6") criada conforme mostrado aqui:

```sql
mysql> CREATE TABLE t1 (c1 INT) TABLESPACE ts_1 ENGINE NDB;
Query OK, 0 rows affected (1.27 sec)
```

Para converter esta tabela para Storage baseado em disco, você pode usar a seguinte instrução [`ALTER TABLE`](alter-table.html "13.1.8 Instrução ALTER TABLE"):

```sql
mysql> ALTER TABLE t1 TABLESPACE ts_1 STORAGE DISK;
Query OK, 0 rows affected (2.99 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `c1` int(11) DEFAULT NULL
) /*!50100 TABLESPACE ts_1 STORAGE DISK */
ENGINE=ndbcluster DEFAULT CHARSET=latin1
1 row in set (0.01 sec)
```

Não é necessário que o tablespace tenha sido referenciado quando a tabela foi originalmente criada; no entanto, o tablespace deve ser referenciado pelo [`ALTER TABLE`](alter-table.html "13.1.8 Instrução ALTER TABLE"):

```sql
mysql> CREATE TABLE t2 (c1 INT) ts_1 ENGINE NDB;
Query OK, 0 rows affected (1.00 sec)

mysql> ALTER TABLE t2 STORAGE DISK;
ERROR 1005 (HY000): Can't create table 'c.#sql-1750_3' (errno: 140)
mysql> ALTER TABLE t2 TABLESPACE ts_1 STORAGE DISK;
Query OK, 0 rows affected (3.42 sec)
Records: 0  Duplicates: 0  Warnings: 0
mysql> SHOW CREATE TABLE t2\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t2` (
  `c1` int(11) DEFAULT NULL
) /*!50100 TABLESPACE ts_1 STORAGE DISK */
ENGINE=ndbcluster DEFAULT CHARSET=latin1
1 row in set (0.01 sec)
```

Para alterar o tipo de Storage de uma coluna individual, você pode usar `ALTER TABLE ... MODIFY [COLUMN]`. Por exemplo, suponha que você crie uma tabela NDB Cluster Disk Data com duas colunas, usando esta instrução [`CREATE TABLE`](create-table.html "13.1.18 Instrução CREATE TABLE"):

```sql
mysql> CREATE TABLE t3 (c1 INT, c2 INT)
    ->     TABLESPACE ts_1 STORAGE DISK ENGINE NDB;
Query OK, 0 rows affected (1.34 sec)
```

Para alterar a coluna `c2` de Storage baseado em disco para Storage in-memory, inclua uma cláusula STORAGE MEMORY na definição da coluna usada pela instrução ALTER TABLE, conforme mostrado aqui:

```sql
mysql> ALTER TABLE t3 MODIFY c2 INT STORAGE MEMORY;
Query OK, 0 rows affected (3.14 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

Você pode transformar uma coluna in-memory em uma coluna baseada em disco usando `STORAGE DISK` de maneira semelhante.

A coluna `c1` usa Storage baseado em disco, pois este é o default para a tabela (determinado pela cláusula `STORAGE DISK` em nível de tabela na instrução [`CREATE TABLE`](create-table.html "13.1.18 Instrução CREATE TABLE")). No entanto, a coluna `c2` usa Storage in-memory, como pode ser visto aqui na saída do SHOW [`CREATE TABLE`](create-table.html "13.1.18 Instrução CREATE TABLE"):

```sql
mysql> SHOW CREATE TABLE t3\G
*************************** 1. row ***************************
       Table: t3
Create Table: CREATE TABLE `t3` (
  `c1` int(11) DEFAULT NULL,
  `c2` int(11) /*!50120 STORAGE MEMORY */ DEFAULT NULL
) /*!50100 TABLESPACE ts_1 STORAGE DISK */ ENGINE=ndbcluster DEFAULT CHARSET=latin1
1 row in set (0.02 sec)
```

Ao adicionar uma coluna `AUTO_INCREMENT`, os valores da coluna são preenchidos automaticamente com números de sequência. Para tabelas `MyISAM`, você pode definir o primeiro número de sequência executando `SET INSERT_ID=value` antes de [`ALTER TABLE`](alter-table.html "13.1.8 Instrução ALTER TABLE") ou usando a opção de tabela `AUTO_INCREMENT=value`.

Com tabelas `MyISAM`, se você não alterar a coluna `AUTO_INCREMENT`, o número de sequência não será afetado. Se você remover (drop) uma coluna `AUTO_INCREMENT` e depois adicionar outra coluna `AUTO_INCREMENT`, os números serão resequenciados começando com 1.

Quando a Replication é usada, adicionar uma coluna `AUTO_INCREMENT` a uma tabela pode não produzir a mesma ordenação de linhas no Replica e no Source. Isso ocorre porque a ordem em que as linhas são numeradas depende do Storage Engine específico usado para a tabela e da ordem em que as linhas foram inseridas. Se for importante ter a mesma ordem no Source e no Replica, as linhas devem ser ordenadas antes de atribuir um número `AUTO_INCREMENT`. Assumindo que você deseja adicionar uma coluna `AUTO_INCREMENT` à tabela `t1`, as seguintes instruções produzem uma nova tabela `t2` idêntica a `t1`, mas com uma coluna `AUTO_INCREMENT`:

```sql
CREATE TABLE t2 (id INT AUTO_INCREMENT PRIMARY KEY)
SELECT * FROM t1 ORDER BY col1, col2;
```

Isso pressupõe que a tabela `t1` tenha as colunas `col1` e `col2`.

Este conjunto de instruções também produz uma nova tabela `t2` idêntica a `t1`, com a adição de uma coluna `AUTO_INCREMENT`:

```sql
CREATE TABLE t2 LIKE t1;
ALTER TABLE t2 ADD id INT AUTO_INCREMENT PRIMARY KEY;
INSERT INTO t2 SELECT * FROM t1 ORDER BY col1, col2;
```

Importante

Para garantir a mesma ordenação tanto no Source quanto no Replica, *todas* as colunas de `t1` devem ser referenciadas na cláusula `ORDER BY`.

Independentemente do método usado para criar e preencher a cópia que contém a coluna `AUTO_INCREMENT`, o passo final é remover (drop) a tabela original e então renomear a cópia:

```sql
DROP TABLE t1;
ALTER TABLE t2 RENAME t1;
```
