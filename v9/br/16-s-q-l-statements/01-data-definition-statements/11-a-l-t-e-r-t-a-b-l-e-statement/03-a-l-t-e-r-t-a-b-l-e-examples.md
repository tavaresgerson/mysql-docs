#### 15.1.11.3 Exemplos de ALTER TABLE

Comece com uma tabela `t1` criada conforme mostrado aqui:

```
CREATE TABLE t1 (a INTEGER, b CHAR(10));
```

Para renomear a tabela de `t1` para `t2`:

```
ALTER TABLE t1 RENAME t2;
```

Para alterar a coluna `a` de `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") para `TINYINT NOT NULL` (mantendo o nome igual), e para alterar a coluna `b` de `CHAR(10)` para `CHAR(20)` e renomeá-la de `b` para `c`:

```
ALTER TABLE t2 MODIFY a TINYINT NOT NULL, CHANGE b c CHAR(20);
```

Para adicionar uma nova coluna `TIMESTAMP` chamada `d`:

```
ALTER TABLE t2 ADD d TIMESTAMP;
```

Para adicionar um índice na coluna `d` e um índice `UNIQUE` na coluna `a`:

```
ALTER TABLE t2 ADD INDEX (d), ADD UNIQUE (a);
```

Para remover a coluna `c`:

```
ALTER TABLE t2 DROP COLUMN c;
```

Para adicionar uma nova coluna inteira `AUTO_INCREMENT` chamada `c`:

```
ALTER TABLE t2 ADD c INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ADD PRIMARY KEY (c);
```

Indexamos `c` (como `PRIMARY KEY`) porque colunas `AUTO_INCREMENT` devem ser indexadas, e declaramos `c` como `NOT NULL` porque colunas de chave primária não podem ser `NULL`.

Para tabelas `NDB`, também é possível alterar o tipo de armazenamento usado para uma tabela ou coluna. Por exemplo, considere uma tabela `NDB` criada conforme mostrado aqui:

```
mysql> CREATE TABLE t1 (c1 INT) TABLESPACE ts_1 ENGINE NDB;
Query OK, 0 rows affected (1.27 sec)
```

Para converter essa tabela para armazenamento baseado em disco, você pode usar a seguinte instrução `ALTER TABLE`:

```
mysql> ALTER TABLE t1 TABLESPACE ts_1 STORAGE DISK;
Query OK, 0 rows affected (2.99 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `c1` int(11) DEFAULT NULL
) /*!50100 TABLESPACE ts_1 STORAGE DISK */
ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.01 sec)
```

Não é necessário que o tablespace tenha sido referenciado quando a tabela foi originalmente criada; no entanto, o tablespace deve ser referenciado pela instrução `ALTER TABLE`:

```
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
ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.01 sec)
```

Para alterar o tipo de armazenamento de uma coluna individual, você pode usar `ALTER TABLE ... MODIFY [COLUNA]`. Por exemplo, suponha que você crie uma tabela `NDB Cluster Disk Data` com duas colunas, usando esta instrução `CREATE TABLE`:

```
mysql> CREATE TABLE t3 (c1 INT, c2 INT)
    ->     TABLESPACE ts_1 STORAGE DISK ENGINE NDB;
Query OK, 0 rows affected (1.34 sec)
```

Para alterar a coluna `c2` de armazenamento baseado em disco para armazenamento em memória, inclua uma cláusula `STORAGE MEMORY` na definição da coluna usada pela instrução `ALTER TABLE`, conforme mostrado aqui:

```
mysql> ALTER TABLE t3 MODIFY c2 INT STORAGE MEMORY;
Query OK, 0 rows affected (3.14 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

Você pode transformar uma coluna de memória em uma coluna baseada em disco usando `STORAGE DISK` de maneira semelhante.

A coluna `c1` usa armazenamento baseado em disco, já que essa é a opção padrão para a tabela (determinada pela cláusula `STORAGE DISK` no nível da tabela na instrução `CREATE TABLE`). No entanto, a coluna `c2` usa armazenamento de memória, como pode ser visto aqui na saída da `SHOW CREATE TABLE`:

```
mysql> SHOW CREATE TABLE t3\G
*************************** 1. row ***************************
       Table: t3
Create Table: CREATE TABLE `t3` (
  `c1` int(11) DEFAULT NULL,
  `c2` int(11) /*!50120 STORAGE MEMORY */ DEFAULT NULL
) /*!50100 TABLESPACE ts_1 STORAGE DISK */ ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.02 sec)
```

Quando você adiciona uma coluna `AUTO_INCREMENT`, os valores das colunas são preenchidos automaticamente com números de sequência. Para tabelas `MyISAM`, você pode definir o primeiro número de sequência executando `SET INSERT_ID=value` antes de `ALTER TABLE` ou usando a opção `AUTO_INCREMENT=value` da tabela.

Com tabelas `MyISAM`, se você não alterar a coluna `AUTO_INCREMENT`, o número de sequência não será afetado. Se você excluir uma coluna `AUTO_INCREMENT` e depois adicionar outra coluna `AUTO_INCREMENT`, os números são resequenciados a partir do 1.

Quando a replicação é usada, adicionar uma coluna `AUTO_INCREMENT` a uma tabela pode não produzir a mesma ordem das linhas na replica e na fonte. Isso ocorre porque a ordem em que as linhas são numeradas depende do motor de armazenamento específico usado para a tabela e da ordem em que as linhas foram inseridas. Se é importante ter a mesma ordem na fonte e na replica, as linhas devem ser ordenadas antes de atribuir um número `AUTO_INCREMENT`. Supondo que você queira adicionar uma coluna `AUTO_INCREMENT` à tabela `t1`, as seguintes instruções produzem uma nova tabela `t2` idêntica a `t1`, mas com uma coluna `AUTO_INCREMENT`:

```
CREATE TABLE t2 (id INT AUTO_INCREMENT PRIMARY KEY)
SELECT * FROM t1 ORDER BY col1, col2;
```

Isso assume que a tabela `t1` tem as colunas `col1` e `col2`.

Este conjunto de instruções também produz uma nova tabela `t2` idêntica a `t1`, com a adição de uma coluna `AUTO_INCREMENT`:

```
CREATE TABLE t2 LIKE t1;
ALTER TABLE t2 ADD id INT AUTO_INCREMENT PRIMARY KEY;
INSERT INTO t2 SELECT * FROM t1 ORDER BY col1, col2;
```

Importante

Para garantir a mesma ordem nos dois bancos, *todas* as colunas de `t1` devem ser referenciadas na cláusula `ORDER BY`.

Independentemente do método usado para criar e preencher a cópia com a coluna `AUTO_INCREMENT`, a etapa final é excluir a tabela original e, em seguida, renomear a cópia:

```
DROP TABLE t1;
ALTER TABLE t2 RENAME t1;
```