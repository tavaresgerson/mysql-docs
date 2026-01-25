#### 13.2.10.8 Tabelas Derivadas

Uma *derived table* (tabela derivada) é uma expressão que gera uma tabela dentro do escopo de uma cláusula `FROM` de uma Query. Por exemplo, uma subquery na cláusula `FROM` de uma instrução [`SELECT`](select.html "13.2.9 SELECT Statement") é uma *derived table*:

```sql
SELECT ... FROM (subquery) [AS] tbl_name ...
```

A cláusula `[AS] tbl_name` é obrigatória porque toda tabela em uma cláusula `FROM` deve ter um nome. Quaisquer colunas na *derived table* devem ter nomes exclusivos.

Para fins de ilustração, assuma que você tem esta tabela:

```sql
CREATE TABLE t1 (s1 INT, s2 CHAR(5), s3 FLOAT);
```

Veja como usar uma subquery na cláusula `FROM`, usando a tabela de exemplo:

```sql
INSERT INTO t1 VALUES (1,'1',1.0);
INSERT INTO t1 VALUES (2,'2',2.0);
SELECT sb1,sb2,sb3
  FROM (SELECT s1 AS sb1, s2 AS sb2, s3*2 AS sb3 FROM t1) AS sb
  WHERE sb1 > 1;
```

Resultado:

```sql
+------+------+------+
| sb1  | sb2  | sb3  |
+------+------+------+
|    2 | 2    |    4 |
+------+------+------+
```

Aqui está outro exemplo: Suponha que você queira saber a média de um conjunto de somas para uma tabela agrupada. Isto não funciona:

```sql
SELECT AVG(SUM(column1)) FROM t1 GROUP BY column1;
```

No entanto, esta Query fornece a informação desejada:

```sql
SELECT AVG(sum_column1)
  FROM (SELECT SUM(column1) AS sum_column1
        FROM t1 GROUP BY column1) AS t1;
```

Observe que o nome da coluna usado dentro da subquery (`sum_column1`) é reconhecido na Query externa.

Uma *derived table* pode retornar um escalar, coluna, linha ou tabela.

*Derived tables* estão sujeitas a estas restrições:

* Uma *derived table* não pode ser uma subquery correlacionada.
* Uma *derived table* não pode conter referências a outras tabelas da mesma instrução [`SELECT`](select.html "13.2.9 SELECT Statement").

* Uma *derived table* não pode conter referências externas (*outer references*). Esta é uma restrição do MySQL, não uma restrição do padrão SQL.

O Optimizer determina informações sobre *derived tables* de tal forma que o [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") não precisa materializá-las. Consulte [Seção 8.2.2.4, “Otimizando Tabelas Derivadas e Referências de View com Mesclagem ou Materialização”](derived-table-optimization.html "8.2.2.4 Optimizing Derived Tables and View References with Merging or Materialization").

É possível, sob certas circunstâncias, que o uso de [`EXPLAIN SELECT`](explain.html "13.8.2 EXPLAIN Statement") modifique os dados da tabela. Isso pode ocorrer se a Query externa acessar quaisquer tabelas e uma Query interna invocar uma stored function que altere uma ou mais linhas de uma tabela. Suponha que existam duas tabelas `t1` e `t2` no Database `d1`, e uma stored function `f1` que modifica `t2`, criada conforme mostrado aqui:

```sql
CREATE DATABASE d1;
USE d1;
CREATE TABLE t1 (c1 INT);
CREATE TABLE t2 (c1 INT);
CREATE FUNCTION f1(p1 INT) RETURNS INT
  BEGIN
    INSERT INTO t2 VALUES (p1);
    RETURN p1;
  END;
```

Referenciar a função diretamente em um [`EXPLAIN SELECT`](explain.html "13.8.2 EXPLAIN Statement") não tem efeito em `t2`, conforme mostrado aqui:

```sql
mysql> SELECT * FROM t2;
Empty set (0.02 sec)

mysql> EXPLAIN SELECT f1(5)\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: NULL
   partitions: NULL
         type: NULL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: NULL
     filtered: NULL
        Extra: No tables used
1 row in set (0.01 sec)

mysql> SELECT * FROM t2;
Empty set (0.01 sec)
```

Isso ocorre porque a instrução [`SELECT`](select.html "13.2.9 SELECT Statement") não referenciou nenhuma tabela, como pode ser visto nas colunas `table` e `Extra` da saída. Isto também é verdade para a seguinte instrução [`SELECT`](select.html "13.2.9 SELECT Statement") aninhada:

```sql
mysql> EXPLAIN SELECT NOW() AS a1, (SELECT f1(5)) AS a2\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: NULL
         type: NULL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: NULL
     filtered: NULL
        Extra: No tables used
1 row in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS;
+-------+------+------------------------------------------+
| Level | Code | Message                                  |
+-------+------+------------------------------------------+
| Note  | 1249 | Select 2 was reduced during optimization |
+-------+------+------------------------------------------+
1 row in set (0.00 sec)

mysql> SELECT * FROM t2;
Empty set (0.00 sec)
```

No entanto, se a instrução [`SELECT`](select.html "13.2.9 SELECT Statement") externa referenciar quaisquer tabelas, o Optimizer também executa a instrução na subquery, resultando na modificação de `t2`:

```sql
mysql> EXPLAIN SELECT * FROM t1 AS a1, (SELECT f1(5)) AS a2\G
*************************** 1. row ***************************
           id: 1
  select_type: PRIMARY
        table: <derived2>
   partitions: NULL
         type: system
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 1
     filtered: 100.00
        Extra: NULL
*************************** 2. row ***************************
           id: 1
  select_type: PRIMARY
        table: a1
   partitions: NULL
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 1
     filtered: 100.00
        Extra: NULL
*************************** 3. row ***************************
           id: 2
  select_type: DERIVED
        table: NULL
   partitions: NULL
         type: NULL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: NULL
     filtered: NULL
        Extra: No tables used
3 rows in set (0.00 sec)

mysql> SELECT * FROM t2;
+------+
| c1   |
+------+
|    5 |
+------+
1 row in set (0.00 sec)
```