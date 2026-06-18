### 14.19.3 MySQL: Gerenciamento do GROUP BY

O SQL-92 e versões anteriores não permitem consultas nas quais a lista de seleção, a condição `HAVING` ou a lista `ORDER BY` se referem a colunas não agregadas que não são nomeadas na cláusula `GROUP BY`. Por exemplo, essa consulta é ilegal no SQL-92 padrão porque a coluna não agregada `name` na lista de seleção não aparece na `GROUP BY`:

```
SELECT o.custid, c.name, MAX(o.payment)
  FROM orders AS o, customers AS c
  WHERE o.custid = c.custid
  GROUP BY o.custid;
```

Para que a consulta seja válida no SQL-92, a coluna `name` deve ser omitida da lista de seleção ou nomeada na cláusula `GROUP BY`.

SQL:1999 e versões posteriores permitem tais não agregados por recurso opcional T301, desde que estejam funcionalmente dependentes das colunas `GROUP BY`: Se houver uma relação entre `name` e `custid`, a consulta é válida. Esse seria o caso, por exemplo, se `custid` fosse uma chave primária de `customers`.

O MySQL implementa a detecção de dependência funcional. Se o modo SQL `ONLY_FULL_GROUP_BY` estiver habilitado (o que é o caso padrão), o MySQL rejeita consultas nas quais a lista de seleção, a condição `HAVING` ou a lista `ORDER BY` se referem a colunas não agregadas que não estão nomeadas na cláusula `GROUP BY` nem são funcionalmente dependentes delas.

O MySQL também permite uma coluna não agregada que não é nomeada em uma cláusula `GROUP BY` quando o modo SQL `ONLY_FULL_GROUP_BY` está habilitado, desde que essa coluna seja limitada a um único valor, como mostrado no exemplo a seguir:

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

É também possível ter mais de uma coluna não agregada na lista `SELECT` ao utilizar `ONLY_FULL_GROUP_BY`. Nesse caso, cada coluna desse tipo deve ser limitada a um único valor na cláusula `WHERE`, e todas essas condições de limitação devem ser unidas por uma lógica `AND`, conforme mostrado aqui:

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

Se `ONLY_FULL_GROUP_BY` estiver desativado, uma extensão MySQL para o uso padrão do SQL `GROUP BY` permite que a lista de seleção, a condição `HAVING` ou a lista `ORDER BY` se refiram a colunas não agregadas, mesmo que as colunas não estejam funcionalmente dependentes das colunas `GROUP BY`. Isso faz com que o MySQL aceite a consulta anterior. Neste caso, o servidor é livre para escolher qualquer valor de cada grupo, então, a menos que sejam os mesmos, os valores escolhidos são não determinísticos, o que provavelmente não é o que você deseja. Além disso, a seleção de valores de cada grupo não pode ser influenciada pela adição de uma cláusula `ORDER BY`. A ordenação do conjunto de resultados ocorre após os valores terem sido escolhidos, e `ORDER BY` não afeta qual valor dentro de cada grupo o servidor escolhe. Desativar `ONLY_FULL_GROUP_BY` é útil principalmente quando você sabe que, devido a alguma propriedade dos dados, todos os valores em cada coluna não agregada não nomeada no `GROUP BY` são os mesmos para cada grupo.

Você pode obter o mesmo efeito sem desabilitar `ONLY_FULL_GROUP_BY` usando `ANY_VALUE()` para se referir à coluna não agregada.

A discussão a seguir demonstra a dependência funcional, a mensagem de erro que o MySQL produz quando a dependência funcional está ausente, e as maneiras de fazer o MySQL aceitar uma consulta na ausência de dependência funcional.

Essa consulta pode ser inválida com `ONLY_FULL_GROUP_BY` habilitado porque a coluna não agregada `address` na lista de seleção não está nomeada na cláusula `GROUP BY`:

```
SELECT name, address, MAX(age) FROM t GROUP BY name;
```

A consulta é válida se `name` for uma chave primária de `t` ou se for uma coluna `NOT NULL` única. Nesse caso, o MySQL reconhece que a coluna selecionada depende funcionalmente de uma coluna de agrupamento. Por exemplo, se `name` for uma chave primária, seu valor determina o valor de `address`, pois cada grupo tem apenas um valor da chave primária e, portanto, apenas uma linha. Como resultado, não há aleatoriedade na escolha do valor de `address` em um grupo e não há necessidade de rejeitar a consulta.

A consulta é inválida se `name` não for uma chave primária de `t` ou uma coluna `NOT NULL` única. Nesse caso, não pode ser inferida nenhuma dependência funcional e ocorre um erro:

```
mysql> SELECT name, address, MAX(age) FROM t GROUP BY name;
ERROR 1055 (42000): Expression #2 of SELECT list is not in GROUP
BY clause and contains nonaggregated column 'mydb.t.address' which
is not functionally dependent on columns in GROUP BY clause; this
is incompatible with sql_mode=only_full_group_by
```

Se você sabe disso, *para um conjunto de dados específico*, cada valor de `name` na verdade determina de forma única o valor de `address`, e `address` depende funcionalmente efetivamente de `name`. Para dizer ao MySQL para aceitar a consulta, você pode usar a função `ANY_VALUE()`:

```
SELECT name, ANY_VALUE(address), MAX(age) FROM t GROUP BY name;
```

Alternativamente, desative `ONLY_FULL_GROUP_BY`.

No entanto, o exemplo anterior é bastante simples. Em particular, é improvável que você agrupe em uma única coluna de chave primária, porque cada grupo conterá apenas uma linha. Para exemplos adicionais que demonstram dependência funcional em consultas mais complexas, consulte a Seção 14.19.4, “Detecção de Dependência Funcional”.

Se uma consulta tiver funções agregadas e nenhuma cláusula `GROUP BY`, ela não pode ter colunas não agregadas na lista de seleção, na condição `HAVING` ou na lista `ORDER BY` com `ONLY_FULL_GROUP_BY` habilitada:

```
mysql> SELECT name, MAX(age) FROM t;
ERROR 1140 (42000): In aggregated query without GROUP BY, expression
#1 of SELECT list contains nonaggregated column 'mydb.t.name'; this
is incompatible with sql_mode=only_full_group_by
```

Sem `GROUP BY`, há um único grupo e não é determinado qual valor `name` deve ser escolhido para o grupo. Aqui, também pode ser usado `ANY_VALUE()`, se não for importante qual valor `name` o MySQL escolherá:

```
SELECT ANY_VALUE(name), MAX(age) FROM t;
```

`ONLY_FULL_GROUP_BY` também afeta o tratamento de consultas que utilizam `DISTINCT` e `ORDER BY`. Considere o caso de uma tabela `t` com três colunas `c1`, `c2` e `c3` que contém essas linhas:

```
c1 c2 c3
1  2  A
3  4  B
1  2  C
```

Suponha que executemos a seguinte consulta, esperando que os resultados sejam ordenados por `c3`:

```
SELECT DISTINCT c1, c2 FROM t ORDER BY c3;
```

Para ordenar o resultado, as duplicatas devem ser eliminadas primeiro. Mas para isso, devemos manter a primeira linha ou a terceira? Essa escolha arbitrária influencia o valor retido de `c3`, o que, por sua vez, influencia a ordem e torna-a arbitrária também. Para evitar esse problema, uma consulta que contém `DISTINCT` e `ORDER BY` é rejeitada como inválida se qualquer expressão `ORDER BY` não satisfazer pelo menos uma dessas condições:

- A expressão é igual a um na lista de seleção
- Todas as colunas referenciadas pela expressão e pertencentes às tabelas selecionadas da consulta são elementos da lista de seleção

Outra extensão do MySQL ao SQL padrão permite referências na cláusula `HAVING` a expressões aliadas na lista de seleção. Por exemplo, a seguinte consulta retorna valores `name` que ocorrem apenas uma vez na tabela `orders`:

```
SELECT name, COUNT(name) FROM orders
  GROUP BY name
  HAVING COUNT(name) = 1;
```

A extensão MySQL permite o uso de um alias na cláusula `HAVING` para a coluna agregada:

```
SELECT name, COUNT(name) AS c FROM orders
  GROUP BY name
  HAVING c = 1;
```

O SQL padrão permite apenas expressões de coluna em cláusulas `GROUP BY`, portanto, uma declaração como esta é inválida porque `FLOOR(value/100)` é uma expressão não de coluna:

```
SELECT id, FLOOR(value/100)
  FROM tbl_name
  GROUP BY id, FLOOR(value/100);
```

O MySQL estende o SQL padrão para permitir expressões não-coluna nas cláusulas `GROUP BY` e considera a declaração anterior válida.

O SQL padrão também não permite aliases em cláusulas `GROUP BY`. O MySQL estende o SQL padrão para permitir aliases, então outra maneira de escrever a consulta é da seguinte forma:

```
SELECT id, FLOOR(value/100) AS val
  FROM tbl_name
  GROUP BY id, val;
```

O alias `val` é considerado uma expressão de coluna na cláusula `GROUP BY`.

Na presença de uma expressão não-colunar na cláusula `GROUP BY`, o MySQL reconhece a igualdade entre essa expressão e as expressões na lista de seleção. Isso significa que, com o modo SQL `ONLY_FULL_GROUP_BY` habilitado, a consulta que contém `GROUP BY id, FLOOR(value/100)` é válida porque a mesma expressão `FLOOR()` ocorre na lista de seleção. No entanto, o MySQL não tenta reconhecer a dependência funcional em expressões não-colunares `GROUP BY`, portanto, a consulta a seguir é inválida com `ONLY_FULL_GROUP_BY` habilitado, mesmo que a terceira expressão selecionada seja uma fórmula simples da coluna `id` e a expressão `FLOOR()` na cláusula `GROUP BY`:

```
SELECT id, FLOOR(value/100), id+FLOOR(value/100)
  FROM tbl_name
  GROUP BY id, FLOOR(value/100);
```

Uma solução é usar uma tabela derivada:

```
SELECT id, F, id+F
  FROM
    (SELECT id, FLOOR(value/100) AS F
     FROM tbl_name
     GROUP BY id, FLOOR(value/100)) AS dt;
```
