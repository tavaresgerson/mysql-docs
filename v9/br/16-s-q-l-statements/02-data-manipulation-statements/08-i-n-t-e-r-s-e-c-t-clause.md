### 15.2.8 Cláusula `INTERSECT`

```
query_expression_body INTERSECT [ALL | DISTINCT] query_expression_body
    [INTERSECT [ALL | DISTINCT] query_expression_body]
    [...]

query_expression_body:
    See Section 15.2.14, “Set Operations with UNION, INTERSECT, and EXCEPT”
```

A cláusula `INTERSECT` limita o resultado de múltiplos blocos de consulta aos registros comuns a todos. Exemplo:

```
mysql> TABLE a;
+------+------+
| m    | n    |
+------+------+
|    1 |    2 |
|    2 |    3 |
|    3 |    4 |
+------+------+
3 rows in set (0.00 sec)

mysql> TABLE b;
+------+------+
| m    | n    |
+------+------+
|    1 |    2 |
|    1 |    3 |
|    3 |    4 |
+------+------+
3 rows in set (0.00 sec)

mysql> TABLE c;
+------+------+
| m    | n    |
+------+------+
|    1 |    3 |
|    1 |    3 |
|    3 |    4 |
+------+------+
3 rows in set (0.00 sec)

mysql> TABLE a INTERSECT TABLE b;
+------+------+
| m    | n    |
+------+------+
|    1 |    2 |
|    3 |    4 |
+------+------+
2 rows in set (0.00 sec)

mysql> TABLE a INTERSECT TABLE c;
+------+------+
| m    | n    |
+------+------+
|    3 |    4 |
+------+------+
1 row in set (0.00 sec)
```

Assim como `UNION` e `EXCEPT`, se não forem especificados `DISTINCT` ou `ALL`, o padrão é `DISTINCT`.

`DISTINCT` pode remover duplicatas de qualquer lado da interseção, como mostrado aqui:

```
mysql> TABLE c INTERSECT DISTINCT TABLE c;
+------+------+
| m    | n    |
+------+------+
|    1 |    3 |
|    3 |    4 |
+------+------+
2 rows in set (0.00 sec)

mysql> TABLE c INTERSECT ALL TABLE c;
+------+------+
| m    | n    |
+------+------+
|    1 |    3 |
|    1 |    3 |
|    3 |    4 |
+------+------+
3 rows in set (0.00 sec)
```

(`TABLE c INTERSECT TABLE c` é o equivalente da primeira das duas declarações mostradas.)

Assim como `UNION`, os operandos devem ter o mesmo número de colunas. Os tipos de colunas do conjunto de resultados também são determinados como para `UNION`.

A `INTERSECT` tem precedência maior que e é avaliada antes de `UNION` e `EXCEPT`, de modo que as duas declarações mostradas aqui são equivalentes:

```
TABLE r EXCEPT TABLE s INTERSECT TABLE t;

TABLE r EXCEPT (TABLE s INTERSECT TABLE t);
```

Para `INTERSECT ALL`, o número máximo de duplicatas de qualquer linha única na tabela da esquerda é `4294967295`.