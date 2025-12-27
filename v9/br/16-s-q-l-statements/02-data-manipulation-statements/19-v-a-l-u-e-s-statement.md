### 15.2.19 Declaração de VALORES

`VALUES` é uma instrução DML que retorna um conjunto de uma ou mais linhas como uma tabela. Em outras palavras, é um construtor de valor de tabela que também funciona como uma instrução SQL autônoma.

```
VALUES row_constructor_list [ORDER BY column_designator] [LIMIT number]

row_constructor_list:
    ROW(value_list)[, ROW(value_list)][, ...]

value_list:
    value[, value][, ...]

column_designator:
    column_index
```

A instrução `VALUES` consiste na palavra-chave `VALUES` seguida de uma lista de um ou mais construtores de linha, separados por vírgulas. Um construtor de linha consiste na cláusula `ROW()` com uma lista de valores escalares, fechados entre parênteses. Um valor pode ser um literal de qualquer tipo de dado MySQL ou uma expressão que resolva a um valor escalar.

`ROW()` não pode ser vazio (mas cada um dos valores escalares fornecidos pode ser `NULL`). Cada `ROW()` na mesma instrução `VALUES` deve ter o mesmo número de valores em sua lista de valores.

A palavra-chave `DEFAULT` não é suportada por `VALUES` e causa um erro de sintaxe, exceto quando é usada para fornecer valores em uma instrução `INSERT`.

A saída de `VALUES` é uma tabela:

```
mysql> VALUES ROW(1,-2,3), ROW(5,7,9), ROW(4,6,8);
+----------+----------+----------+
| column_0 | column_1 | column_2 |
+----------+----------+----------+
|        1 |       -2 |        3 |
|        5 |        7 |        9 |
|        4 |        6 |        8 |
+----------+----------+----------+
3 rows in set (0.00 sec)
```

As colunas da tabela de saída de `VALUES` têm as colunas implicitamente nomeadas `column_0`, `column_1`, `column_2`, e assim por diante, sempre começando com `0`. Esse fato pode ser usado para ordenar as linhas por coluna usando uma cláusula `ORDER BY` opcional da mesma maneira que essa cláusula funciona com uma instrução `SELECT`, como mostrado aqui:

```
mysql> VALUES ROW(1,-2,3), ROW(5,7,9), ROW(4,6,8) ORDER BY column_1;
+----------+----------+----------+
| column_0 | column_1 | column_2 |
+----------+----------+----------+
|        1 |       -2 |        3 |
|        4 |        6 |        8 |
|        5 |        7 |        9 |
+----------+----------+----------+
3 rows in set (0.00 sec)
```

A instrução `VALUES` também suporta uma cláusula `LIMIT` para limitar o número de linhas na saída.

A instrução `VALUES` é permissiva em relação aos tipos de dados dos valores das colunas; você pode misturar tipos dentro da mesma coluna, como mostrado aqui:

```
mysql> VALUES ROW("q", 42, '2019-12-18'),
    ->     ROW(23, "abc", 98.6),
    ->     ROW(27.0002, "Mary Smith", '{"a": 10, "b": 25}');
+----------+------------+--------------------+
| column_0 | column_1   | column_2           |
+----------+------------+--------------------+
| q        | 42         | 2019-12-18         |
| 23       | abc        | 98.6               |
| 27.0002  | Mary Smith | {"a": 10, "b": 25} |
+----------+------------+--------------------+
3 rows in set (0.00 sec)
```

Importante

`VALUES` com uma ou mais instâncias de `ROW()` atua como um construtor de valor de tabela; embora possa ser usado para fornecer valores em uma instrução `INSERT` ou `REPLACE`, não confunda com a palavra-chave `VALUES` que também é usada para esse propósito. Você também não deve confundi-lo com a função `VALUES()` que se refere aos valores das colunas em `INSERT ... ON DUPLICATE KEY UPDATE`.

Você também deve ter em mente que `ROW()` é um construtor de valor de linha (veja Seção 15.2.15.5, “Subconsultas de Linha”), enquanto `VALUES ROW()` é um construtor de valor de tabela; os dois não podem ser usados de forma intercambiável.

`VALUES` pode ser usado em muitos casos em que você poderia empregar `SELECT`, incluindo aqueles listados aqui:

* Com `UNION`, como mostrado aqui:

  ```
  mysql> SELECT 1,2 UNION SELECT 10,15;
  +----+----+
  | 1  | 2  |
  +----+----+
  |  1 |  2 |
  | 10 | 15 |
  +----+----+
  2 rows in set (0.00 sec)

  mysql> VALUES ROW(1,2) UNION VALUES ROW(10,15);
  +----------+----------+
  | column_0 | column_1 |
  +----------+----------+
  |        1 |        2 |
  |       10 |       15 |
  +----------+----------+
  2 rows in set (0.00 sec)
  ```

  Você pode unir tabelas construídas com mais de uma linha, assim:

  ```
  mysql> VALUES ROW(1,2), ROW(3,4), ROW(5,6)
       >     UNION VALUES ROW(10,15),ROW(20,25);
  +----------+----------+
  | column_0 | column_1 |
  +----------+----------+
  |        1 |        2 |
  |        3 |        4 |
  |        5 |        6 |
  |       10 |       15 |
  |       20 |       25 |
  +----------+----------+
  5 rows in set (0.00 sec)
  ```

  Você também pode (e geralmente é preferível) omitir `UNION` completamente nesses casos e usar uma única declaração `VALUES`, assim:

  ```
  mysql> VALUES ROW(1,2), ROW(3,4), ROW(5,6), ROW(10,15), ROW(20,25);
  +----------+----------+
  | column_0 | column_1 |
  +----------+----------+
  |        1 |        2 |
  |        3 |        4 |
  |        5 |        6 |
  |       10 |       15 |
  |       20 |       25 |
  +----------+----------+
  ```

  `VALUES` também pode ser usado em uniões com declarações `SELECT`, `TABLE` ou ambas.

  As tabelas construídas na `UNION` devem conter o mesmo número de colunas, assim como se estivesse usando `SELECT`. Veja Seção 15.2.18, “Cláusula UNION”, para mais exemplos.

  Você pode usar `EXCEPT` e `INTERSECT` com `VALUES` de maneira muito semelhante a `UNION`, como mostrado aqui:

  ```
  mysql> VALUES ROW(1,2), ROW(3,4), ROW(5,6)
      ->   INTERSECT
      -> VALUES ROW(10,15), ROW(20,25), ROW(3,4);
  +----------+----------+
  | column_0 | column_1 |
  +----------+----------+
  |        3 |        4 |
  +----------+----------+
  1 row in set (0.00 sec)

  mysql> VALUES ROW(1,2), ROW(3,4), ROW(5,6)
      ->   EXCEPT
      -> VALUES ROW(10,15), ROW(20,25), ROW(3,4);
  +----------+----------+
  | column_0 | column_1 |
  +----------+----------+
  |        1 |        2 |
  |        5 |        6 |
  +----------+----------+
  2 rows in set (0.00 sec)
  ```

  Veja Seção 15.2.4, “Cláusula EXCEPT” e Seção 15.2.8, “Cláusula INTERSECT”, para mais informações.

* Em junções. Veja Seção 15.2.13.2, “Cláusula JOIN” para mais informações e exemplos.

* No lugar de `VALUES()` em uma instrução `INSERT` ou `REPLACE`, no caso, sua semântica difere ligeiramente daquela descrita aqui. Veja Seção 15.2.7, “Instrução INSERT” para detalhes.

* No lugar da tabela de origem em `CREATE TABLE ... SELECT` e `CREATE VIEW ... SELECT`. Consulte as descrições dessas instruções para obter mais informações e exemplos.