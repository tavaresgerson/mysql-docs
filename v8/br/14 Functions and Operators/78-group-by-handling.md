### 14.19.3 Gerenciamento de GROUP BY no MySQL

O SQL-92 e versões anteriores não permitem consultas nas quais a lista de seleção, a condição `HAVING` ou a lista `ORDER BY` se referem a colunas não agregadas que não são nomeadas na cláusula `GROUP BY`. Por exemplo, esta consulta é ilegal no SQL-92 padrão porque a coluna `name` não agregada na lista de seleção não aparece na `GROUP BY`:

```
SELECT o.custid, c.name, MAX(o.payment)
  FROM orders AS o, customers AS c
  WHERE o.custid = c.custid
  GROUP BY o.custid;
```

Para que a consulta seja legal no SQL-92, a coluna `name` deve ser omitida da lista de seleção ou nomeada na cláusula `GROUP BY`.

O SQL:1999 e versões posteriores permitem tais não agregados como recurso opcional T301, desde que sejam funcionalmente dependentes das colunas `GROUP BY`: Se existir essa relação entre `name` e `custid`, a consulta é legal. Esse seria o caso, por exemplo, se `custid` fosse uma chave primária de `customers`.

O MySQL implementa a detecção de dependência funcional. Se o modo SQL `ONLY_FULL_GROUP_BY` estiver habilitado (o que é o caso padrão), o MySQL rejeita consultas nas quais a lista de seleção, a condição `HAVING` ou a lista `ORDER BY` se referem a colunas não agregadas que não são nomeadas na cláusula `GROUP BY` nem são funcionalmente dependentes delas.

O MySQL também permite uma coluna não agregada não nomeada em uma cláusula `GROUP BY` quando o modo SQL `ONLY_FULL_GROUP_BY` estiver habilitado, desde que essa coluna seja limitada a um único valor, como mostrado no exemplo a seguir:

```
mysql> CREATE TABLE mytable (
    ->    id INT UNSIGNED NOT NULL PRIMARY KEY,
    ->    a VARCHAR(10),
    ->    b INT
    -> );

mysql> INSERT INTO mytable
    -> VALUES (1, 'abc', 1000),
    ->        (2, 'abc', 2000),
    ->        (3, 'def', 4000);

mysql> SET SESSION sql_mode = sys.list_add(@@session.sql_mode, 'ONLY_FULL_GROUP_BY');

mysql> SELECT a, SUM(b) FROM mytable WHERE a = 'abc';
+------+--------+
| a    | SUM(b) |
+------+--------+
| abc  |   3000 |
+------+--------+
```

Também é possível ter mais de uma coluna não agregada na lista `SELECT` ao usar o modo `ONLY_FULL_GROUP_BY`. Nesse caso, cada coluna deve ser limitada a um único valor na cláusula `WHERE`, e todas essas condições de limitação devem ser unidas por `AND` lógico, como mostrado aqui:

```
mysql> DROP TABLE IF EXISTS mytable;

mysql> CREATE TABLE mytable (
    ->    id INT UNSIGNED NOT NULL PRIMARY KEY,
    ->    a VARCHAR(10),
    ->    b VARCHAR(10),
    ->    c INT
    -> );

mysql> INSERT INTO mytable
    -> VALUES (1, 'abc', 'qrs', 1000),
    ->        (2, 'abc', 'tuv', 2000),
    ->        (3, 'def', 'qrs', 4000),
    ->        (4, 'def', 'tuv', 8000),
    ->        (5, 'abc', 'qrs', 16000),
    ->        (6, 'def', 'tuv', 32000);

mysql> SELECT @@session.sql_mode;
+---------------------------------------------------------------+
| @@session.sql_mode                                            |
+---------------------------------------------------------------+
| ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION |
+---------------------------------------------------------------+

mysql> SELECT a, b, SUM(c) FROM mytable
    ->     WHERE a = 'abc' AND b = 'qrs';
+------+------+--------+
| a    | b    | SUM(c) |
+------+------+--------+
| abc  | qrs  |  17000 |
+------+------+--------+
```

Se `ONLY_FULL_GROUP_BY` estiver desativado, uma extensão MySQL para o uso padrão de `GROUP BY` na SQL permite que a lista de seleção, a condição `HAVING` ou a lista `ORDER BY` se refiram a colunas não agregadas, mesmo que as colunas não estejam funcionalmente dependentes das colunas `GROUP BY`. Isso faz com que o MySQL aceite a consulta anterior. Neste caso, o servidor é livre para escolher qualquer valor de cada grupo, então, a menos que sejam os mesmos, os valores escolhidos são não determinísticos, o que provavelmente não é o que você deseja. Além disso, a seleção de valores de cada grupo não pode ser influenciada pela adição de uma cláusula `ORDER BY`. A ordenação do conjunto de resultados ocorre após os valores terem sido escolhidos, e `ORDER BY` não afeta qual valor dentro de cada grupo o servidor escolhe. Desativar `ONLY_FULL_GROUP_BY` é útil principalmente quando você sabe que, devido a alguma propriedade dos dados, todos os valores em cada coluna não agregada não nomeada no `GROUP BY` são os mesmos para cada grupo.

Você pode alcançar o mesmo efeito sem desativar `ONLY_FULL_GROUP_BY` usando `ANY_VALUE()` para se referir à coluna não agregada.

A discussão a seguir demonstra dependência funcional, a mensagem de erro que o MySQL produz quando a dependência funcional está ausente e maneiras de fazer com que o MySQL aceite uma consulta na ausência de dependência funcional.

Esta consulta pode ser inválida com `ONLY_FULL_GROUP_BY` habilitado porque a coluna `address` não agregada na lista de seleção não está nomeada na cláusula `GROUP BY`:

```
SELECT name, address, MAX(age) FROM t GROUP BY name;
```

A consulta é válida se `name` for uma chave primária de `t` ou for uma coluna `NOT NULL` única. Nesse caso, o MySQL reconhece que a coluna selecionada é funcionalmente dependente de uma coluna de agrupamento. Por exemplo, se `name` for uma chave primária, seu valor determina o valor de `address` porque cada grupo tem apenas um valor da chave primária e, portanto, apenas uma linha. Como resultado, não há aleatoriedade na escolha do valor de `address` em um grupo e não há necessidade de rejeitar a consulta.

A consulta é inválida se `name` não for uma chave primária de `t` ou uma coluna `NOT NULL` única. Nesse caso, não pode ser inferida nenhuma dependência funcional e ocorre um erro:

```
mysql> SELECT name, address, MAX(age) FROM t GROUP BY name;
ERROR 1055 (42000): Expression #2 of SELECT list is not in GROUP
BY clause and contains nonaggregated column 'mydb.t.address' which
is not functionally dependent on columns in GROUP BY clause; this
is incompatible with sql_mode=only_full_group_by
```

Se você souber que, *para um conjunto de dados específico*, cada valor de `name` determina de fato de forma única o valor de `address`, `address` é efetivamente dependente funcionalmente de `name`. Para dizer ao MySQL que aceita a consulta, você pode usar a função  `ANY_VALUE()`:

```
SELECT name, ANY_VALUE(address), MAX(age) FROM t GROUP BY name;
```

Alternativamente, desative `ONLY_FULL_GROUP_BY`.

O exemplo anterior é bastante simples, no entanto. Em particular, é improvável que você agrupe em uma única coluna chave primária porque cada grupo conterá apenas uma linha. Para exemplos adicionais que demonstram dependência funcional em consultas mais complexas, consulte  Seção 14.19.4, “Detecção de Dependência Funcional”.

Se uma consulta tiver funções agregadas e nenhuma cláusula `GROUP BY`, ela não pode ter colunas não agregadas na lista de seleção, na condição `HAVING` ou na lista `ORDER BY` com `ONLY_FULL_GROUP_BY` habilitada:

```
mysql> SELECT name, MAX(age) FROM t;
ERROR 1140 (42000): In aggregated query without GROUP BY, expression
#1 of SELECT list contains nonaggregated column 'mydb.t.name'; this
is incompatible with sql_mode=only_full_group_by
```

Sem `GROUP BY`, há um único grupo e ele é não determinístico, que valor de `name` escolher para o grupo. Aqui, também, `ANY_VALUE()` pode ser usado, se não for importante qual valor de `name` o MySQL escolher.

`ONLY_FULL_GROUP_BY` também afeta o tratamento de consultas que usam `DISTINCT` e `ORDER BY`. Considere o caso de uma tabela `t` com três colunas `c1`, `c2` e `c3` que contém essas linhas:

```
SELECT ANY_VALUE(name), MAX(age) FROM t;
```

Suponha que executemos a seguinte consulta, esperando que os resultados sejam ordenados por `c3`:

```
c1 c2 c3
1  2  A
3  4  B
1  2  C
```

Para ordenar o resultado, os duplicados devem ser eliminados primeiro. Mas para isso, devemos manter a primeira linha ou a terceira? Esta escolha arbitrária influencia o valor retido de `c3`, o que, por sua vez, influencia a ordenação e a torna arbitrária também. Para prevenir esse problema, uma consulta que tem `DISTINCT` e `ORDER BY` é rejeitada como inválida se qualquer expressão `ORDER BY` não satisfazer pelo menos uma dessas condições:

* A expressão é igual a um na lista de seleção
* Todas as colunas referenciadas pela expressão e pertencentes às tabelas selecionadas da consulta são elementos da lista de seleção

Outra extensão do MySQL ao SQL padrão permite referências na cláusula `HAVING` para expressões com alias na lista de seleção. Por exemplo, a seguinte consulta retorna valores de `name` que ocorrem apenas uma vez na tabela `orders`:

```
SELECT DISTINCT c1, c2 FROM t ORDER BY c3;
```

A extensão do MySQL permite o uso de um alias na cláusula `HAVING` para a coluna agregada:

```
SELECT name, COUNT(name) FROM orders
  GROUP BY name
  HAVING COUNT(name) = 1;
```

O SQL padrão permite apenas expressões de coluna nas cláusulas `GROUP BY`, portanto, uma declaração como esta é inválida porque `FLOOR(value/100)` é uma expressão não de coluna:

```
SELECT name, COUNT(name) AS c FROM orders
  GROUP BY name
  HAVING c = 1;
```

O MySQL estende o SQL padrão para permitir expressões não de coluna nas cláusulas `GROUP BY` e considera a declaração anterior válida.

O SQL padrão também não permite aliases nas cláusulas `GROUP BY`. O MySQL estende o SQL padrão para permitir aliases, então outra maneira de escrever a consulta é a seguinte:

```
SELECT id, FLOOR(value/100)
  FROM tbl_name
  GROUP BY id, FLOOR(value/100);
```

O alias `val` é considerado uma expressão de coluna na cláusula `GROUP BY`.

Na presença de uma expressão não de coluna na cláusula `GROUP BY`, o MySQL reconhece a igualdade entre essa expressão e expressões na lista de seleção. Isso significa que, com o modo SQL `ONLY_FULL_GROUP_BY` habilitado, a consulta que contém `GROUP BY id, FLOOR(value/100)` é válida porque a mesma expressão `FLOOR()` ocorre na lista de seleção. No entanto, o MySQL não tenta reconhecer a dependência funcional em expressões não de coluna `GROUP BY`, então a seguinte consulta é inválida com `ONLY_FULL_GROUP_BY` habilitado, mesmo que a terceira expressão selecionada seja uma fórmula simples da coluna `id` e a expressão `FLOOR()` na cláusula `GROUP BY`:

```
SELECT id, FLOOR(value/100) AS val
  FROM tbl_name
  GROUP BY id, val;
```

Uma solução é usar uma tabela derivada:

```
SELECT id, FLOOR(value/100), id+FLOOR(value/100)
  FROM tbl_name
  GROUP BY id, FLOOR(value/100);
```