### 15.2.19 Declaração de VALORES

`VALUES` é uma instrução DML introduzida no MySQL 8.0.19 que retorna um conjunto de uma ou mais linhas como uma tabela. Em outras palavras, é um construtor de valor de tabela que também funciona como uma instrução SQL autônoma.

```
VALUES row_constructor_list [ORDER BY column_designator] [LIMIT number]

row_constructor_list:
    ROW(value_list)[, ROW(value_list)][, ...]

value_list:
    value[, value][, ...]

column_designator:
    column_index
```

A declaração `VALUES` consiste na palavra-chave `VALUES` seguida de uma lista de um ou mais construtores de linha, separados por vírgulas. Um construtor de linha consiste na cláusula `ROW()` construtor de linha com uma lista de valores escalares, fechados entre parênteses. Um valor pode ser um literal de qualquer tipo de dado MySQL ou uma expressão que resolva a um valor escalar.

`ROW()` não pode estar vazio (mas cada um dos valores escalares fornecidos pode ser `NULL`). Cada `ROW()` na mesma declaração `VALUES` deve ter o mesmo número de valores em sua lista de valores.

A palavra-chave `DEFAULT` não é suportada pelo `VALUES` e causa um erro de sintaxe, exceto quando é usada para fornecer valores em uma declaração `INSERT`.

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

As colunas da tabela geradas a partir de `VALUES` têm as colunas com nomes implícitos `column_0`, `column_1`, `column_2` e assim por diante, sempre começando com `0`. Esse fato pode ser usado para ordenar as linhas por coluna usando uma cláusula opcional `ORDER BY` da mesma maneira que essa cláusula funciona com uma declaração `SELECT`, como mostrado aqui:

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

No MySQL 8.0.21 e versões posteriores, a instrução `VALUES` também suporta uma cláusula `LIMIT` para limitar o número de linhas na saída. (Anteriormente, `LIMIT` era permitido, mas não fazia nada.)

A declaração `VALUES` é permissiva em relação aos tipos de dados dos valores das colunas; você pode misturar tipos dentro da mesma coluna, como mostrado aqui:

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

`VALUES` com uma ou mais instâncias de `ROW()` atua como construtor de valor de tabela; embora possa ser usado para fornecer valores em uma declaração de `INSERT` ou `REPLACE`, não confunda com a palavra-chave `VALUES` que também é usada para esse propósito. Você também não deve confundi-lo com a função `VALUES()` que se refere a valores de coluna em `INSERT ... ON DUPLICATE KEY UPDATE`.

Você também deve ter em mente que `ROW()` é um construtor de valor de linha (veja a Seção 15.2.15.5, “Subconsultas de Linha”), enquanto `VALUES ROW()` é um construtor de valor de tabela; os dois não podem ser usados de forma intercambiável.

`VALUES` pode ser usado em muitos casos em que você poderia usar `SELECT`, incluindo os listados aqui:

- Com `UNION`, como mostrado aqui:

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

  Você pode unir tabelas construídas com mais de uma linha, como este:

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

  Você também pode (e geralmente é preferível) omitir completamente `UNION` nesses casos e usar uma única declaração `VALUES`, como esta:

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

  O `VALUES` também pode ser usado em uniões com declarações `SELECT` ou `TABLE`, ou ambas.

  As tabelas construídas no `UNION` devem conter o mesmo número de colunas, assim como se estivesse usando `SELECT`. Veja a Seção 15.2.18, “Cláusula UNION”, para mais exemplos.

  No MySQL 8.0.31 e versões posteriores, você pode usar `EXCEPT` e `INTERSECT` com `VALUES` de maneira muito semelhante a `UNION`, conforme mostrado aqui:

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

  Consulte a Seção 15.2.4, “Cláusula EXCEÇÃO”, e a Seção 15.2.8, “Cláusula INTERSEÇÃO”, para obter mais informações.

- Em junções. Veja a Seção 15.2.13.2, “Cláusula JOIN”, para mais informações e exemplos.

- No lugar de `VALUES()` em uma declaração `INSERT` ou `REPLACE`, nesse caso, sua semântica difere ligeiramente do que está descrito aqui. Consulte a Seção 15.2.7, “Declaração INSERT”, para obter detalhes.

- No lugar da tabela de origem em `CREATE TABLE ... SELECT` e `CREATE VIEW ... SELECT`. Consulte as descrições dessas declarações para obter mais informações e exemplos.
