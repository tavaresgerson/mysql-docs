### 23.5.1 Sintaxe de View

A instrução `CREATE VIEW` cria uma nova `VIEW` (consulte a Seção 13.1.21, “CREATE VIEW Statement”). Para alterar a definição de uma `VIEW` ou descartá-la, utilize `ALTER VIEW` (consulte a Seção 13.1.10, “ALTER VIEW Statement”) ou `DROP VIEW` (consulte a Seção 13.1.32, “DROP VIEW Statement”).

Uma `VIEW` pode ser criada a partir de diversos tipos de instruções `SELECT`. Ela pode fazer referência a `base tables` ou outras `VIEWs`. Pode utilizar `JOINs`, `UNION` e `subqueries`. A instrução `SELECT` nem precisa fazer referência a quaisquer `tables`. O exemplo a seguir define uma `VIEW` que seleciona duas colunas de outra `table`, além de uma expressão calculada a partir dessas colunas:

```sql
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