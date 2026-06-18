### 27.5.1 Sintaxe de visualização

A declaração `CREATE VIEW` cria uma nova visualização (consulte a Seção 15.1.23, “Declaração CREATE VIEW”). Para alterar a definição de uma visualização ou excluir uma visualização, use `ALTER VIEW` (consulte a Seção 15.1.11, “Declaração ALTER VIEW”) ou `DROP VIEW` (consulte a Seção 15.1.35, “Declaração DROP VIEW”).

Uma visão pode ser criada a partir de vários tipos de declarações `SELECT`. Ela pode se referir a tabelas base ou outras visões. Ela pode usar junções, `UNION` e subconsultas. O `SELECT` nem precisa se referir a nenhuma tabela. O exemplo a seguir define uma visão que seleciona duas colunas de outra tabela, bem como uma expressão calculada a partir dessas colunas:

```
mysql> CREATE TABLE t (qty INT, price INT);
mysql> INSERT INTO t VALUES(3, 50), (5, 60);
mysql> CREATE VIEW v AS SELECT qty, price, qty*price AS value FROM t;
mysql> SELECT * FROM v;
+------+-------+-------+
| qty  | price | value |
+------+-------+-------+
|    3 |    50 |   150 |
|    5 |    60 |   300 |
+------+-------+-------+
mysql> SELECT * FROM v WHERE qty = 5;
+------+-------+-------+
| qty  | price | value |
+------+-------+-------+
|    5 |    60 |   300 |
+------+-------+-------+
```
