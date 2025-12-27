#### 30.4.4.27 Procedimento `table_exists()`

Verifica se uma tabela específica existe como uma tabela regular, uma tabela `TEMPORARY` ou uma visão. O procedimento retorna o tipo de tabela em um parâmetro `OUT`. Se existir uma tabela temporária e uma permanente com o nome especificado, `TEMPORARY` é retornado.

##### Parâmetros

* `in_db VARCHAR(64)`: O nome do banco de dados em que verificar a existência da tabela.

* `in_table VARCHAR(64)`: O nome da tabela para verificar a existência.

* `out_exists ENUM('', 'TABELA BÁSICA', 'VISÃO', 'TEMPORARY')`: O valor de retorno. Este é um parâmetro `OUT`, então ele deve ser uma variável na qual o tipo de tabela pode ser armazenado. Quando o procedimento retornar, a variável terá um dos seguintes valores para indicar se a tabela existe:

  + `''`: O nome da tabela não existe como tabela base, tabela `TEMPORARY` ou visão.

  + `TABELA BÁSICA`: O nome da tabela existe como tabela base (permanente).

  + `VISÃO`: O nome da tabela existe como visão.

  + `TEMPORARY`: O nome da tabela existe como tabela `TEMPORARY`.

##### Exemplo

```
mysql> CREATE DATABASE db1;
Query OK, 1 row affected (0.01 sec)

mysql> USE db1;
Database changed

mysql> CREATE TABLE t1 (id INT PRIMARY KEY);
Query OK, 0 rows affected (0.03 sec)

mysql> CREATE TABLE t2 (id INT PRIMARY KEY);
Query OK, 0 rows affected (0.20 sec)

mysql> CREATE view v_t1 AS SELECT * FROM t1;
Query OK, 0 rows affected (0.02 sec)

mysql> CREATE TEMPORARY TABLE t1 (id INT PRIMARY KEY);
Query OK, 0 rows affected (0.00 sec)

mysql> CALL sys.table_exists('db1', 't1', @exists); SELECT @exists;
Query OK, 0 rows affected (0.01 sec)

+-----------+
| @exists   |
+-----------+
| TEMPORARY |
+-----------+
1 row in set (0.00 sec)

mysql> CALL sys.table_exists('db1', 't2', @exists); SELECT @exists;
Query OK, 0 rows affected (0.02 sec)

+------------+
| @exists    |
+------------+
| BASE TABLE |
+------------+
1 row in set (0.00 sec)

mysql> CALL sys.table_exists('db1', 'v_t1', @exists); SELECT @exists;
Query OK, 0 rows affected (0.02 sec)

+---------+
| @exists |
+---------+
| VIEW    |
+---------+
1 row in set (0.00 sec)

mysql> CALL sys.table_exists('db1', 't3', @exists); SELECT @exists;
Query OK, 0 rows affected (0.00 sec)

+---------+
| @exists |
+---------+
||
+---------+
1 row in set (0.00 sec)
```