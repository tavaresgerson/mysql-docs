### 12.21.4 Comportamento de Arredondamento

Esta seção discute o arredondamento de precisão matemática para a função `ROUND()` e para inserções em colunas com tipos de valor exato (`DECIMAL`, `NUMERIC` e `INTEGER`).

A função `ROUND()` arredonda de forma diferente dependendo se seu argumento é exato ou aproximado:

* Para números de valor exato, `ROUND()` utiliza a regra de "arredondar metade para cima" (*round half up*): Um valor com uma parte fracionária igual ou superior a 0,5 é arredondado para o próximo `INTEGER` se for positivo, ou para baixo (em direção ao negativo) se for negativo. (Em outras palavras, é arredondado para longe do zero.) Um valor com uma parte fracionária menor que 0,5 é arredondado para baixo (em direção ao zero) se for positivo, ou para cima (em direção ao zero) se for negativo. (Em outras palavras, é arredondado em direção ao zero.)

* Para números de valor aproximado, o resultado depende da C library. Em muitos sistemas, isso significa que `ROUND()` usa a regra de "arredondar para o par mais próximo" (*round to nearest even*): Um valor com uma parte fracionária exatamente na metade do caminho entre dois `INTEGERs` é arredondado para o `INTEGER` par mais próximo.

O exemplo a seguir mostra como o arredondamento difere para valores exatos e aproximados:

```sql
mysql> SELECT ROUND(2.5), ROUND(25E-1);
+------------+--------------+
| ROUND(2.5) | ROUND(25E-1) |
+------------+--------------+
| 3          |            2 |
+------------+--------------+
```

Para inserções em uma coluna `DECIMAL` ou `INTEGER`, o destino é um tipo de dado exato, então o arredondamento utiliza "arredondar metade para longe do zero" (*round half away from zero*), independentemente de o valor a ser inserido ser exato ou aproximado:

```sql
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

A instrução `SHOW WARNINGS` exibe as notas geradas pelo truncamento devido ao arredondamento da parte fracionária. Tal truncamento não é um erro, mesmo no *strict SQL mode* (consulte a Seção 12.21.3, “Expression Handling”).