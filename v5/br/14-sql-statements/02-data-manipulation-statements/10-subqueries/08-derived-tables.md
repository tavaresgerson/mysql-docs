#### 13.2.10.8 Tabelas Derivadas

Uma tabela derivada é uma expressão que gera uma tabela dentro do escopo de uma cláusula `FROM` de uma consulta. Por exemplo, uma subconsulta em uma cláusula `FROM` de uma instrução `SELECT` é uma tabela derivada:

```sql
SELECT ... FROM (subquery) [AS] tbl_name ...
```

A cláusula `[AS] tbl_name` é obrigatória porque toda tabela em uma cláusula `FROM` deve ter um nome. Quaisquer colunas na tabela derivada devem ter nomes únicos.

Por exemplo, vamos supor que você tenha esta tabela:

```sql
CREATE TABLE t1 (s1 INT, s2 CHAR(5), s3 FLOAT);
```

Veja como usar uma subconsulta na cláusula `FROM`, usando a tabela de exemplo:

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

Aqui está outro exemplo: Suponha que você queira saber a média de um conjunto de somas para uma tabela agrupada. Isso não funciona:

```sql
SELECT AVG(SUM(column1)) FROM t1 GROUP BY column1;
```

No entanto, essa consulta fornece as informações desejadas:

```sql
SELECT AVG(sum_column1)
  FROM (SELECT SUM(column1) AS sum_column1
        FROM t1 GROUP BY column1) AS t1;
```

Observe que o nome da coluna usado na subconsulta (`sum_column1`) é reconhecido na consulta externa.

Uma tabela derivada pode retornar um escalar, coluna, linha ou tabela.

As tabelas derivadas estão sujeitas a essas restrições:

- Uma tabela derivada não pode ser uma subconsulta correlacionada.

- Uma tabela derivada não pode conter referências a outras tabelas da mesma `SELECT`.

- Uma tabela derivada não pode conter referências externas. Essa é uma restrição do MySQL, e não da norma SQL.

O otimizador determina informações sobre tabelas derivadas de tal forma que o `EXPLAIN` não precise materializá-las. Veja Seção 8.2.2.4, “Otimização de tabelas derivadas e referências de visualização com fusão ou materialização”.

Em certas circunstâncias, é possível que o uso de `EXPLAIN SELECT` modifique os dados da tabela. Isso pode ocorrer se a consulta externa acessar qualquer tabela e uma consulta interna invocar uma função armazenada que altere uma ou mais linhas de uma tabela. Suponha que existam duas tabelas `t1` e `t2` no banco de dados `d1`, e uma função armazenada `f1` que modifica `t2`, criada conforme mostrado aqui:

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

Referenciar a função diretamente em um `EXPLAIN SELECT` não tem efeito sobre `t2`, como mostrado aqui:

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

Isso ocorre porque a instrução `SELECT` não fez referência a nenhuma tabela, como pode ser visto nas colunas `table` e `Extra` do resultado. Isso também é verdadeiro para as seguintes instruções `SELECT` aninhadas:

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

No entanto, se as referências externas do `SELECT` se referirem a quaisquer tabelas, o otimizador executa a instrução na subconsulta também, resultando na modificação de `t2`:

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
