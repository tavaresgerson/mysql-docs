### 27.6.1 Sintaxe de Visualização

A instrução `CREATE VIEW` cria uma nova visualização (consulte a Seção 15.1.27, “Instrução CREATE VIEW”). Para alterar a definição de uma visualização ou excluir uma visualização, use `ALTER VIEW` (consulte a Seção 15.1.13, “Instrução ALTER VIEW”) ou `DROP VIEW` (consulte a Seção 15.1.40, “Instrução DROP VIEW”).

Uma visualização pode ser criada a partir de vários tipos de instruções `SELECT`. Ela pode referenciar tabelas base ou outras visualizações. Ela pode usar junções, `UNION` e subconsultas. O `SELECT` não precisa até mesmo referenciar nenhuma tabela. O exemplo a seguir define uma visualização que seleciona duas colunas de outra tabela, bem como uma expressão calculada a partir dessas colunas:

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