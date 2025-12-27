### 15.2.16 Declaração `TABLE`

`TABLE` é uma declaração DML que retorna linhas e colunas da tabela nomeada.

```
TABLE table_name
    [ORDER BY column_name]
    [LIMIT number [OFFSET number]]
    [INTO OUTFILE 'file_name'
        [{FIELDS | COLUMNS}
            [TERMINATED BY 'string']
            [[OPTIONALLY] ENCLOSED BY 'char']
            [ESCAPED BY 'char']
        ]
        [LINES
            [STARTING BY 'string']
            [TERMINATED BY 'string']
        ]
    | INTO DUMPFILE 'file_name'
    | INTO var_name [, var_name] ...]
```

A declaração `TABLE`, de certa forma, age como `SELECT`. Dado a existência de uma tabela chamada `t`, as seguintes duas declarações produzem uma saída idêntica:

```
TABLE t;

SELECT * FROM t;
```

Você pode ordenar e limitar o número de linhas produzidas por `TABLE` usando as cláusulas `ORDER BY` e `LIMIT`, respectivamente. Essas funções funcionam de maneira idêntica às mesmas cláusulas quando usadas com `SELECT` (incluindo uma cláusula opcional `OFFSET` com `LIMIT`), como você pode ver aqui:

```
mysql> TABLE t;
+----+----+
| a  | b  |
+----+----+
|  1 |  2 |
|  6 |  7 |
|  9 |  5 |
| 10 | -4 |
| 11 | -1 |
| 13 |  3 |
| 14 |  6 |
+----+----+
7 rows in set (0.00 sec)

mysql> TABLE t ORDER BY b;
+----+----+
| a  | b  |
+----+----+
| 10 | -4 |
| 11 | -1 |
|  1 |  2 |
| 13 |  3 |
|  9 |  5 |
| 14 |  6 |
|  6 |  7 |
+----+----+
7 rows in set (0.00 sec)

mysql> TABLE t LIMIT 3;
+---+---+
| a | b |
+---+---+
| 1 | 2 |
| 6 | 7 |
| 9 | 5 |
+---+---+
3 rows in set (0.00 sec)

mysql> TABLE t ORDER BY b LIMIT 3;
+----+----+
| a  | b  |
+----+----+
| 10 | -4 |
| 11 | -1 |
|  1 |  2 |
+----+----+
3 rows in set (0.00 sec)

mysql> TABLE t ORDER BY b LIMIT 3 OFFSET 2;
+----+----+
| a  | b  |
+----+----+
|  1 |  2 |
| 13 |  3 |
|  9 |  5 |
+----+----+
3 rows in set (0.00 sec)
```

`TABLE` difere de `SELECT` em dois aspectos principais:

* `TABLE` sempre exibe todas as colunas da tabela.

  *Exceção*: A saída de `TABLE` *não* inclui colunas invisíveis. Veja a Seção 15.1.24.10, “Colunas Invisíveis”.

* `TABLE` não permite qualquer filtragem arbitrária de linhas; ou seja, `TABLE` não suporta nenhuma cláusula `WHERE`.

Para limitar quais colunas da tabela serão retornadas, filtrar linhas além do que pode ser realizado usando `ORDER BY` e `LIMIT`, ou ambos, use `SELECT`.

`TABLE` pode ser usado com tabelas temporárias.

`TABLE` também pode ser usado no lugar de `SELECT` em várias outras construções, incluindo as listadas aqui:

* Com operadores de conjunto como `UNION`, como mostrado aqui:

  ```
  mysql> TABLE t1;
  +---+----+
  | a | b  |
  +---+----+
  | 2 | 10 |
  | 5 |  3 |
  | 7 |  8 |
  +---+----+
  3 rows in set (0.00 sec)

  mysql> TABLE t2;
  +---+---+
  | a | b |
  +---+---+
  | 1 | 2 |
  | 3 | 4 |
  | 6 | 7 |
  +---+---+
  3 rows in set (0.00 sec)

  mysql> TABLE t1 UNION TABLE t2;
  +---+----+
  | a | b  |
  +---+----+
  | 2 | 10 |
  | 5 |  3 |
  | 7 |  8 |
  | 1 |  2 |
  | 3 |  4 |
  | 6 |  7 |
  +---+----+
  6 rows in set (0.00 sec)
  ```

  O `UNION` mostrado acima é equivalente à seguinte declaração:

  ```
  mysql> SELECT * FROM t1 UNION SELECT * FROM t2;
  +---+----+
  | a | b  |
  +---+----+
  | 2 | 10 |
  | 5 |  3 |
  | 7 |  8 |
  | 1 |  2 |
  | 3 |  4 |
  | 6 |  7 |
  +---+----+
  6 rows in set (0.00 sec)
  ```

  `TABLE` também pode ser usado junto em operações de conjunto com declarações `SELECT`, declarações `VALUES` ou ambas. Veja a Seção 15.2.18, “Cláusula UNION”, a Seção 15.2.4, “Cláusula EXCEPT” e a Seção 15.2.8, “Cláusula INTERSECT”, para mais informações e exemplos. Veja também a Seção 15.2.14, “Operações de Conjunto com UNION, INTERSECT e EXCEPT”.

* Com `INTO` para popule as variáveis do usuário e com `INTO OUTFILE` ou `INTO DUMPFILE` para escrever os dados da tabela em um arquivo. Veja a Seção 15.2.13.1, “Instrução SELECT ... INTO”, para obter informações e exemplos mais específicos.

* Em muitos casos, você pode usar subconsultas. Dada qualquer tabela `t1` com uma coluna chamada `a`, e uma segunda tabela `t2` com uma única coluna, declarações como as seguintes são possíveis:

  ```
  SELECT * FROM t1 WHERE a IN (TABLE t2);
  ```

  Supondo que a única coluna da tabela `t1` seja chamada `x`, o que precede é equivalente a cada uma das declarações mostradas aqui (e produz exatamente o mesmo resultado em ambos os casos):

  ```
  SELECT * FROM t1 WHERE a IN (SELECT x FROM t2);

  SELECT * FROM t1 WHERE a IN (SELECT * FROM t2);
  ```

  Veja a Seção 15.2.15, “Subconsultas”, para obter mais informações.

* Com as instruções `INSERT` e `REPLACE`, onde você normalmente usaria `SELECT *`. Veja a Seção 15.2.7.1, “Instrução INSERT ... SELECT”, para obter mais informações e exemplos.

* `TABLE` também pode ser usado em muitos casos no lugar do `SELECT` em `CREATE TABLE ... SELECT` ou `CREATE VIEW ... SELECT`. Veja as descrições dessas instruções para obter mais informações e exemplos.