### 15.2.8 Cláusula de Interseção

```
query_expression_body INTERSECT [ALL | DISTINCT] query_expression_body
    [INTERSECT [ALL | DISTINCT] query_expression_body]
    [...]

query_expression_body:
    See Section 15.2.14, “Set Operations with UNION, INTERSECT, and EXCEPT”
```

`INTERSECT` limita o resultado de vários blocos de consulta às linhas que são comuns a todos. Exemplo:

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

Assim como em `UNION` e `EXCEPT`, se não for especificado `DISTINCT` ou `ALL`, o padrão é `DISTINCT`.

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

(`TABLE c INTERSECT TABLE c` é o equivalente da primeira das duas declarações mostradas acima.)

Assim como no `UNION`, os operandos devem ter o mesmo número de colunas. Os tipos de colunas do conjunto de resultados também são determinados como no `UNION`.

`INTERSECT` tem precedência maior do que `UNION` e `EXCEPT`, e é avaliado antes deles, de modo que as duas declarações mostradas aqui são equivalentes:

```
TABLE r EXCEPT TABLE s INTERSECT TABLE t;

TABLE r EXCEPT (TABLE s INTERSECT TABLE t);
```

Para `INTERSECT ALL`, o número máximo de duplicatas de qualquer linha única na tabela à esquerda é `4294967295`.

`INTERSECT` foi adicionado no MySQL 8.0.31.
