#### 26.4.4.26 O Procedure table_exists()

Testa se uma determinada table existe como uma table regular, uma table `TEMPORARY` ou uma view. O procedure retorna o tipo da table em um `OUT` parameter. Se existirem tanto uma table temporária quanto uma table permanente com o nome fornecido, `TEMPORARY` é retornado.

##### Parâmetros

* `in_db VARCHAR(64)`: O nome do Database no qual verificar a existência da table.

* `in_table VARCHAR(64)`: O nome da table cuja existência deve ser verificada.

* `out_exists ENUM('', 'BASE TABLE', 'VIEW', 'TEMPORARY')`: O valor de retorno. Este é um `OUT` parameter, portanto, deve ser uma variável na qual o tipo da table possa ser armazenado. Quando o procedure retorna, a variável assume um dos seguintes valores para indicar se a table existe:

  + `''`: O nome da table não existe como uma base table, table `TEMPORARY` ou view.

  + `BASE TABLE`: O nome da table existe como uma base table (permanente).

  + `VIEW`: O nome da table existe como uma view.

  + `TEMPORARY`: O nome da table existe como uma table `TEMPORARY`.

##### Exemplo

```sql
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
|         |
+---------+
1 row in set (0.00 sec)
```