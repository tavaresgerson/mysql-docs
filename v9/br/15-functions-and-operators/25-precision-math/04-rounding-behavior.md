### 14.25.4 Comportamento de arredondamento

Esta seção discute o arredondamento de matemática de precisão para a função `ROUND()` e para inserções em colunas com tipos de valor exato (`DECIMAL` - DECIMAL, NUMERIC") e inteiro).

A função `ROUND()` arredonda de maneira diferente dependendo se seu argumento é exato ou aproximado:

* Para números de valor exato, `ROUND()` usa a regra de "arredondar para cima": Um valor com uma parte fracionária de .5 ou maior é arredondado para o próximo inteiro se positivo ou para o próximo inteiro se negativo. (Em outras palavras, é arredondado para longe de zero.) Um valor com uma parte fracionária menor que .5 é arredondado para o próximo inteiro se positivo ou para o próximo inteiro se negativo. (Em outras palavras, é arredondado em direção a zero.)

* Para números de valor aproximado, o resultado depende da biblioteca C. Em muitos sistemas, isso significa que `ROUND()` usa a regra de "arredondar para o próximo inteiro par": Um valor com uma parte fracionária exatamente no meio entre dois inteiros é arredondado para o próximo inteiro par.

O exemplo seguinte mostra como o arredondamento difere para valores exatos e aproximados:

```
mysql> SELECT ROUND(2.5), ROUND(25E-1);
+------------+--------------+
| ROUND(2.5) | ROUND(25E-1) |
+------------+--------------+
| 3          |            2 |
+------------+--------------+
```

Para inserções em uma coluna `DECIMAL` - DECIMAL, NUMERIC") ou inteiro, o alvo é um tipo de dado exato, então o arredondamento usa "arredondar para longe de zero", independentemente de o valor a ser inserido ser exato ou aproximado:

```
mysql> CREATE TABLE t (d DECIMAL(10,0));
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO t VALUES(2.5),(2.5E0);
Query OK, 2 rows affected, 2 warnings (0.00 sec)
Records: 2  Duplicates: 0  Warnings: 2

mysql> SHOW WARNINGS;
+-------+------+----------------------------------------+
| Level | Code | Message                                |
+-------+------+----------------------------------------+
| Note  | 1265 | Data truncated for column 'd' at row 1 |
| Note  | 1265 | Data truncated for column 'd' at row 2 |
+-------+------+----------------------------------------+
2 rows in set (0.00 sec)

mysql> SELECT d FROM t;
+------+
| d    |
+------+
|    3 |
|    3 |
+------+
2 rows in set (0.00 sec)
```

A instrução `SHOW WARNINGS` exibe as notas geradas por truncação devido ao arredondamento da parte fracionária. Tal truncação não é um erro, mesmo no modo SQL rigoroso (veja a Seção 14.25.3, “Tratamento de expressões”).