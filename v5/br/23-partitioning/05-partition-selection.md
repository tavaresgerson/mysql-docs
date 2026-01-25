## 22.5 Seleção de Partições

O MySQL 5.7 suporta a seleção explícita de partições e subpartições que, ao executar uma instrução, devem ser verificadas em busca de linhas que correspondam a uma dada condição `WHERE`. A seleção de partições é semelhante à *partition pruning* (poda de partição), pois apenas partições específicas são verificadas em busca de correspondências, mas difere em dois aspectos principais:

1. As partições a serem verificadas são especificadas por quem emite a instrução, diferente da *partition pruning*, que é automática.

2. Enquanto a *partition pruning* se aplica apenas a *queries*, a seleção explícita de partições é suportada tanto para *queries* quanto para várias instruções DML.

As instruções SQL que suportam a seleção explícita de partições estão listadas abaixo:

* [`SELECT`](select.html "13.2.9 SELECT Statement")
* [`DELETE`](delete.html "13.2.2 DELETE Statement")
* [`INSERT`](insert.html "13.2.5 INSERT Statement")
* [`REPLACE`](replace.html "13.2.8 REPLACE Statement")
* [`UPDATE`](update.html "13.2.11 UPDATE Statement")
* [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement").
* [`LOAD XML`](load-xml.html "13.2.7 LOAD XML Statement").

O restante desta seção discute a seleção explícita de partições conforme ela se aplica de forma geral às instruções listadas e fornece alguns exemplos.

A seleção explícita de partições é implementada usando a opção `PARTITION`. Para todas as instruções suportadas, esta opção utiliza a sintaxe mostrada aqui:

```sql
      PARTITION (partition_names)

      partition_names:
          partition_name, ...
```

Esta opção sempre segue o nome da tabela à qual a partição ou partições pertencem. *`partition_names`* é uma lista separada por vírgulas de partições ou subpartições a serem utilizadas. Cada nome nesta lista deve ser o nome de uma partição ou subpartição existente da tabela especificada; se alguma das partições ou subpartições não for encontrada, a instrução falhará com um erro (partition '*`partition_name`*' does not exist). Partições e subpartições nomeadas em *`partition_names`* podem ser listadas em qualquer ordem e podem se sobrepor.

Quando a opção `PARTITION` é usada, apenas as partições e subpartições listadas são verificadas em busca de linhas correspondentes. Esta opção pode ser usada em uma instrução [`SELECT`](select.html "13.2.9 SELECT Statement") para determinar quais linhas pertencem a uma dada partição. Considere uma tabela particionada chamada `employees`, criada e preenchida usando as instruções mostradas aqui:

```sql
SET @@SQL_MODE = '';

CREATE TABLE employees  (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(25) NOT NULL,
    lname VARCHAR(25) NOT NULL,
    store_id INT NOT NULL,
    department_id INT NOT NULL
)
    PARTITION BY RANGE(id)  (
        PARTITION p0 VALUES LESS THAN (5),
        PARTITION p1 VALUES LESS THAN (10),
        PARTITION p2 VALUES LESS THAN (15),
        PARTITION p3 VALUES LESS THAN MAXVALUE
);

INSERT INTO employees VALUES
    ('', 'Bob', 'Taylor', 3, 2), ('', 'Frank', 'Williams', 1, 2),
    ('', 'Ellen', 'Johnson', 3, 4), ('', 'Jim', 'Smith', 2, 4),
    ('', 'Mary', 'Jones', 1, 1), ('', 'Linda', 'Black', 2, 3),
    ('', 'Ed', 'Jones', 2, 1), ('', 'June', 'Wilson', 3, 1),
    ('', 'Andy', 'Smith', 1, 3), ('', 'Lou', 'Waters', 2, 4),
    ('', 'Jill', 'Stone', 1, 4), ('', 'Roger', 'White', 3, 2),
    ('', 'Howard', 'Andrews', 1, 2), ('', 'Fred', 'Goldberg', 3, 3),
    ('', 'Barbara', 'Brown', 2, 3), ('', 'Alice', 'Rogers', 2, 2),
    ('', 'Mark', 'Morgan', 3, 3), ('', 'Karen', 'Cole', 3, 2);
```

Você pode ver quais linhas estão armazenadas na partição `p1` assim:

```sql
mysql> SELECT * FROM employees PARTITION (p1);
+----+-------+--------+----------+---------------+
| id | fname | lname  | store_id | department_id |
+----+-------+--------+----------+---------------+
|  5 | Mary  | Jones  |        1 |             1 |
|  6 | Linda | Black  |        2 |             3 |
|  7 | Ed    | Jones  |        2 |             1 |
|  8 | June  | Wilson |        3 |             1 |
|  9 | Andy  | Smith  |        1 |             3 |
+----+-------+--------+----------+---------------+
5 rows in set (0.00 sec)
```

O resultado é o mesmo que o obtido pela *query* `SELECT * FROM employees WHERE id BETWEEN 5 AND 9`.

Para obter linhas de múltiplas partições, forneça seus nomes como uma lista delimitada por vírgulas. Por exemplo, `SELECT * FROM employees PARTITION (p1, p2)` retorna todas as linhas das partições `p1` e `p2`, excluindo as linhas das partições restantes.

Qualquer *query* válida contra uma tabela particionada pode ser reescrita com a opção `PARTITION` para restringir o resultado a uma ou mais partições desejadas. Você pode usar condições `WHERE`, opções `ORDER BY` e `LIMIT`, e assim por diante. Você também pode usar funções de agregação com opções `HAVING` e `GROUP BY`. Cada uma das seguintes *queries* produz um resultado válido quando executada na tabela `employees` conforme definida anteriormente:

```sql
mysql> SELECT * FROM employees PARTITION (p0, p2)
    ->     WHERE lname LIKE 'S%';
+----+-------+-------+----------+---------------+
| id | fname | lname | store_id | department_id |
+----+-------+-------+----------+---------------+
|  4 | Jim   | Smith |        2 |             4 |
| 11 | Jill  | Stone |        1 |             4 |
+----+-------+-------+----------+---------------+
2 rows in set (0.00 sec)

mysql> SELECT id, CONCAT(fname, ' ', lname) AS name
    ->     FROM employees PARTITION (p0) ORDER BY lname;
+----+----------------+
| id | name           |
+----+----------------+
|  3 | Ellen Johnson  |
|  4 | Jim Smith      |
|  1 | Bob Taylor     |
|  2 | Frank Williams |
+----+----------------+
4 rows in set (0.06 sec)

mysql> SELECT store_id, COUNT(department_id) AS c
    ->     FROM employees PARTITION (p1,p2,p3)
    ->     GROUP BY store_id HAVING c > 4;
+---+----------+
| c | store_id |
+---+----------+
| 5 |        2 |
| 5 |        3 |
+---+----------+
2 rows in set (0.00 sec)
```

Instruções que usam seleção de partições podem ser empregadas com tabelas que utilizam qualquer um dos tipos de particionamento suportados no MySQL 5.7. Quando uma tabela é criada usando particionamento `[LINEAR] HASH` ou `[LINEAR] KEY` e os nomes das partições não são especificados, o MySQL nomeia automaticamente as partições como `p0`, `p1`, `p2`, ..., `pN-1`, onde *`N`* é o número de partições. Para subpartições não nomeadas explicitamente, o MySQL atribui automaticamente às subpartições em cada partição `pX` os nomes `pXsp0`, `pXsp1`, `pXsp2`, ..., `pXspM-1`, onde *`M`* é o número de subpartições. Ao executar contra esta tabela uma instrução [`SELECT`](select.html "13.2.9 SELECT Statement") (ou outra instrução SQL para a qual a seleção explícita de partições é permitida), você pode usar esses nomes gerados na opção `PARTITION`, conforme mostrado aqui:

```sql
mysql> CREATE TABLE employees_sub  (
    ->     id INT NOT NULL AUTO_INCREMENT,
    ->     fname VARCHAR(25) NOT NULL,
    ->     lname VARCHAR(25) NOT NULL,
    ->     store_id INT NOT NULL,
    ->     department_id INT NOT NULL,
    ->     PRIMARY KEY pk (id, lname)
    -> )
    ->     PARTITION BY RANGE(id)
    ->     SUBPARTITION BY KEY (lname)
    ->     SUBPARTITIONS 2 (
    ->         PARTITION p0 VALUES LESS THAN (5),
    ->         PARTITION p1 VALUES LESS THAN (10),
    ->         PARTITION p2 VALUES LESS THAN (15),
    ->         PARTITION p3 VALUES LESS THAN MAXVALUE
    -> );
Query OK, 0 rows affected (1.14 sec)

mysql> INSERT INTO employees_sub   # re-use data in employees table
    ->     SELECT * FROM employees;
Query OK, 18 rows affected (0.09 sec)
Records: 18  Duplicates: 0  Warnings: 0

mysql> SELECT id, CONCAT(fname, ' ', lname) AS name
    ->     FROM employees_sub PARTITION (p2sp1);
+----+---------------+
| id | name          |
+----+---------------+
| 10 | Lou Waters    |
| 14 | Fred Goldberg |
+----+---------------+
2 rows in set (0.00 sec)
```

Você também pode usar uma opção `PARTITION` na porção [`SELECT`](select.html "13.2.9 SELECT Statement") de uma instrução [`INSERT ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement"), conforme mostrado aqui:

```sql
mysql> CREATE TABLE employees_copy LIKE employees;
Query OK, 0 rows affected (0.28 sec)

mysql> INSERT INTO employees_copy
    ->     SELECT * FROM employees PARTITION (p2);
Query OK, 5 rows affected (0.04 sec)
Records: 5  Duplicates: 0  Warnings: 0

mysql> SELECT * FROM employees_copy;
+----+--------+----------+----------+---------------+
| id | fname  | lname    | store_id | department_id |
+----+--------+----------+----------+---------------+
| 10 | Lou    | Waters   |        2 |             4 |
| 11 | Jill   | Stone    |        1 |             4 |
| 12 | Roger  | White    |        3 |             2 |
| 13 | Howard | Andrews  |        1 |             2 |
| 14 | Fred   | Goldberg |        3 |             3 |
+----+--------+----------+----------+---------------+
5 rows in set (0.00 sec)
```

A seleção de partições também pode ser usada com *joins*. Suponha que criemos e preenchamos duas tabelas usando as instruções mostradas aqui:

```sql
CREATE TABLE stores (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(30) NOT NULL
)
    PARTITION BY HASH(id)
    PARTITIONS 2;

INSERT INTO stores VALUES
    ('', 'Nambucca'), ('', 'Uranga'),
    ('', 'Bellingen'), ('', 'Grafton');

CREATE TABLE departments  (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
)
    PARTITION BY KEY(id)
    PARTITIONS 2;

INSERT INTO departments VALUES
    ('', 'Sales'), ('', 'Customer Service'),
    ('', 'Delivery'), ('', 'Accounting');
```

Você pode selecionar explicitamente partições (ou subpartições, ou ambas) de qualquer ou de todas as tabelas em um *join*. (A opção `PARTITION` usada para selecionar partições de uma determinada tabela segue imediatamente o nome da tabela, antes de todas as outras opções, incluindo qualquer *table alias*.) Por exemplo, a seguinte *query* obtém o nome, ID do empregado, departamento e cidade de todos os empregados que trabalham no departamento de Vendas (*Sales*) ou Entrega (*Delivery*) (partição `p1` da tabela `departments`) nas lojas em Nambucca ou Bellingen (partição `p0` da tabela `stores`):

```sql
mysql> SELECT
    ->     e.id AS 'Employee ID', CONCAT(e.fname, ' ', e.lname) AS Name,
    ->     s.city AS City, d.name AS department
    -> FROM employees AS e
    ->     JOIN stores PARTITION (p1) AS s ON e.store_id=s.id
    ->     JOIN departments PARTITION (p0) AS d ON e.department_id=d.id
    -> ORDER BY e.lname;
+-------------+---------------+-----------+------------+
| Employee ID | Name          | City      | department |
+-------------+---------------+-----------+------------+
|          14 | Fred Goldberg | Bellingen | Delivery   |
|           5 | Mary Jones    | Nambucca  | Sales      |
|          17 | Mark Morgan   | Bellingen | Delivery   |
|           9 | Andy Smith    | Nambucca  | Delivery   |
|           8 | June Wilson   | Bellingen | Sales      |
+-------------+---------------+-----------+------------+
5 rows in set (0.00 sec)
```

Para informações gerais sobre *joins* no MySQL, consulte [Section 13.2.9.2, “JOIN Clause”](join.html "13.2.9.2 JOIN Clause").

Quando a opção `PARTITION` é usada com instruções [`DELETE`](delete.html "13.2.2 DELETE Statement"), apenas aquelas partições (e subpartições, se houver) listadas com a opção são verificadas em busca de linhas a serem excluídas. Quaisquer outras partições são ignoradas, conforme mostrado aqui:

```sql
mysql> SELECT * FROM employees WHERE fname LIKE 'j%';
+----+-------+--------+----------+---------------+
| id | fname | lname  | store_id | department_id |
+----+-------+--------+----------+---------------+
|  4 | Jim   | Smith  |        2 |             4 |
|  8 | June  | Wilson |        3 |             1 |
| 11 | Jill  | Stone  |        1 |             4 |
+----+-------+--------+----------+---------------+
3 rows in set (0.00 sec)

mysql> DELETE FROM employees PARTITION (p0, p1)
    ->     WHERE fname LIKE 'j%';
Query OK, 2 rows affected (0.09 sec)

mysql> SELECT * FROM employees WHERE fname LIKE 'j%';
+----+-------+-------+----------+---------------+
| id | fname | lname | store_id | department_id |
+----+-------+-------+----------+---------------+
| 11 | Jill  | Stone |        1 |             4 |
+----+-------+-------+----------+---------------+
1 row in set (0.00 sec)
```

Apenas as duas linhas nas partições `p0` e `p1` que correspondiam à condição `WHERE` foram excluídas. Como você pode ver pelo resultado quando a instrução [`SELECT`](select.html "13.2.9 SELECT Statement") é executada uma segunda vez, resta uma linha na tabela que corresponde à condição `WHERE`, mas que reside em uma partição diferente (`p2`).

Instruções [`UPDATE`](update.html "13.2.11 UPDATE Statement") que usam seleção explícita de partições se comportam da mesma maneira; apenas as linhas nas partições referenciadas pela opção `PARTITION` são consideradas ao determinar as linhas a serem atualizadas, como pode ser visto pela execução das seguintes instruções:

```sql
mysql> UPDATE employees PARTITION (p0)
    ->     SET store_id = 2 WHERE fname = 'Jill';
Query OK, 0 rows affected (0.00 sec)
Rows matched: 0  Changed: 0  Warnings: 0

mysql> SELECT * FROM employees WHERE fname = 'Jill';
+----+-------+-------+----------+---------------+
| id | fname | lname | store_id | department_id |
+----+-------+-------+----------+---------------+
| 11 | Jill  | Stone |        1 |             4 |
+----+-------+-------+----------+---------------+
1 row in set (0.00 sec)

mysql> UPDATE employees PARTITION (p2)
    ->     SET store_id = 2 WHERE fname = 'Jill';
Query OK, 1 row affected (0.09 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> SELECT * FROM employees WHERE fname = 'Jill';
+----+-------+-------+----------+---------------+
| id | fname | lname | store_id | department_id |
+----+-------+-------+----------+---------------+
| 11 | Jill  | Stone |        2 |             4 |
+----+-------+-------+----------+---------------+
1 row in set (0.00 sec)
```

Da mesma forma, quando `PARTITION` é usado com [`DELETE`](delete.html "13.2.2 DELETE Statement"), apenas as linhas na partição ou partições nomeadas na lista de partições são verificadas para exclusão.

Para instruções que inserem linhas, o comportamento difere, pois a falha em encontrar uma partição adequada faz com que a instrução falhe. Isso é verdade tanto para instruções [`INSERT`](insert.html "13.2.5 INSERT Statement") quanto para [`REPLACE`](replace.html "13.2.8 REPLACE Statement"), conforme mostrado aqui:

```sql
mysql> INSERT INTO employees PARTITION (p2) VALUES (20, 'Jan', 'Jones', 1, 3);
ERROR 1729 (HY000): Found a row not matching the given partition set
mysql> INSERT INTO employees PARTITION (p3) VALUES (20, 'Jan', 'Jones', 1, 3);
Query OK, 1 row affected (0.07 sec)

mysql> REPLACE INTO employees PARTITION (p0) VALUES (20, 'Jan', 'Jones', 3, 2);
ERROR 1729 (HY000): Found a row not matching the given partition set

mysql> REPLACE INTO employees PARTITION (p3) VALUES (20, 'Jan', 'Jones', 3, 2);
Query OK, 2 rows affected (0.09 sec)
```

Para instruções que gravam múltiplas linhas em uma tabela particionada que usa o *storage engine* [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"): Se qualquer linha na lista que segue `VALUES` não puder ser gravada em uma das partições especificadas na lista *`partition_names`*, a instrução inteira falha e nenhuma linha é gravada. Isso é mostrado para instruções [`INSERT`](insert.html "13.2.5 INSERT Statement") no exemplo a seguir, reutilizando a tabela `employees` criada anteriormente:

```sql
mysql> ALTER TABLE employees
    ->     REORGANIZE PARTITION p3 INTO (
    ->         PARTITION p3 VALUES LESS THAN (20),
    ->         PARTITION p4 VALUES LESS THAN (25),
    ->         PARTITION p5 VALUES LESS THAN MAXVALUE
    ->     );
Query OK, 6 rows affected (2.09 sec)
Records: 6  Duplicates: 0  Warnings: 0

mysql> SHOW CREATE TABLE employees\G
*************************** 1. row ***************************
       Table: employees
Create Table: CREATE TABLE `employees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fname` varchar(25) NOT NULL,
  `lname` varchar(25) NOT NULL,
  `store_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1
/*!50100 PARTITION BY RANGE (id)
(PARTITION p0 VALUES LESS THAN (5) ENGINE = InnoDB,
 PARTITION p1 VALUES LESS THAN (10) ENGINE = InnoDB,
 PARTITION p2 VALUES LESS THAN (15) ENGINE = InnoDB,
 PARTITION p3 VALUES LESS THAN (20) ENGINE = InnoDB,
 PARTITION p4 VALUES LESS THAN (25) ENGINE = InnoDB,
 PARTITION p5 VALUES LESS THAN MAXVALUE ENGINE = InnoDB) */
1 row in set (0.00 sec)

mysql> INSERT INTO employees PARTITION (p3, p4) VALUES
    ->     (24, 'Tim', 'Greene', 3, 1),  (26, 'Linda', 'Mills', 2, 1);
ERROR 1729 (HY000): Found a row not matching the given partition set

mysql> INSERT INTO employees PARTITION (p3, p4, p5) VALUES
    ->     (24, 'Tim', 'Greene', 3, 1),  (26, 'Linda', 'Mills', 2, 1);
Query OK, 2 rows affected (0.06 sec)
Records: 2  Duplicates: 0  Warnings: 0
```

O precedente é verdadeiro tanto para instruções [`INSERT`](insert.html "13.2.5 INSERT Statement") quanto para instruções [`REPLACE`](replace.html "13.2.8 REPLACE Statement") que gravam múltiplas linhas.

No MySQL 5.7.1 e posterior, a seleção de partições está desabilitada para tabelas que empregam um *storage engine* que fornece particionamento automático, como `NDB`. (Bug #14827952)