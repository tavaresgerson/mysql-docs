### 15.2.4 Cláusula `EXCEPT`

```
query_expression_body EXCEPT [ALL | DISTINCT] query_expression_body
    [EXCEPT [ALL | DISTINCT] query_expression_body]
    [...]

query_expression_body:
    See Section 15.2.14, “Set Operations with UNION, INTERSECT, and EXCEPT”
```

A cláusula `EXCEPT` limita o resultado do primeiro bloco de consulta aos registros que também não são encontrados no segundo. Assim como `UNION` e `INTERSECT`, qualquer um dos blocos de consulta pode utilizar qualquer uma das cláusulas `SELECT`, `TABLE` ou `VALUES`. Um exemplo que utiliza as tabelas `a`, `b` e `c` definidas na Seção 15.2.8, “Cláusula `INTERSECT`”, é mostrado aqui:

```
mysql> TABLE a EXCEPT TABLE b;
+------+------+
| m    | n    |
+------+------+
|    2 |    3 |
+------+------+
1 row in set (0.00 sec)

mysql> TABLE a EXCEPT TABLE c;
+------+------+
| m    | n    |
+------+------+
|    1 |    2 |
|    2 |    3 |
+------+------+
2 rows in set (0.00 sec)

mysql> TABLE b EXCEPT TABLE c;
+------+------+
| m    | n    |
+------+------+
|    1 |    2 |
+------+------+
1 row in set (0.00 sec)
```

Assim como `UNION` e `INTERSECT`, se nenhuma das cláusulas `DISTINCT` ou `ALL` for especificada, o padrão é `DISTINCT`.

`DISTINCT` remove duplicatas encontradas em qualquer lado da relação, como mostrado aqui:

```
mysql> TABLE c EXCEPT DISTINCT TABLE a;
+------+------+
| m    | n    |
+------+------+
|    1 |    3 |
+------+------+
1 row in set (0.00 sec)

mysql> TABLE c EXCEPT ALL TABLE a;
+------+------+
| m    | n    |
+------+------+
|    1 |    3 |
|    1 |    3 |
+------+------+
2 rows in set (0.00 sec)
```

(A primeira declaração tem o mesmo efeito que `TABLE c EXCEPT TABLE a`.)

Ao contrário de `UNION` ou `INTERSECT`, `EXCEPT` não é *comutativo*, ou seja, o resultado depende da ordem dos operandos, como mostrado aqui:

```
mysql> TABLE a EXCEPT TABLE c;
+------+------+
| m    | n    |
+------+------+
|    1 |    2 |
|    2 |    3 |
+------+------+
2 rows in set (0.00 sec)

mysql> TABLE c EXCEPT TABLE a;
+------+------+
| m    | n    |
+------+------+
|    1 |    3 |
+------+------+
1 row in set (0.00 sec)
```

Assim como `UNION`, os conjuntos de resultados a serem comparados devem ter o mesmo número de colunas. Os tipos de colunas do conjunto de resultados também são determinados como para `UNION`.