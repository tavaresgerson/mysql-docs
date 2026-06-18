### 12.19.3 Tratamento de GROUP BY pelo MySQL

SQL-92 e padrões anteriores não permitem Queries nas quais a lista de seleção, a condição `HAVING` ou a lista `ORDER BY` referenciem colunas não agregadas que não estão nomeadas na cláusula `GROUP BY`. Por exemplo, esta Query é ilegal no SQL-92 padrão porque a coluna não agregada `name` na lista de seleção não aparece no `GROUP BY`:

```sql
SELECT o.custid, c.name, MAX(o.payment)
  FROM orders AS o, customers AS c
  WHERE o.custid = c.custid
  GROUP BY o.custid;
```

Para que a Query seja legal no SQL-92, a coluna `name` deve ser omitida da lista de seleção ou nomeada na cláusula `GROUP BY`.

SQL:1999 e padrões posteriores permitem tais não agregados pelo recurso opcional T301 se eles forem funcionalmente dependentes das colunas do `GROUP BY`: Se tal relacionamento existir entre `name` e `custid`, a Query é legal. Este seria o caso, por exemplo, se `custid` fosse uma Primary Key de `customers`.

O MySQL 5.7.5 e posterior implementa a detecção de dependência funcional. Se o SQL mode `ONLY_FULL_GROUP_BY` estiver ativado (o que é por padrão), o MySQL rejeita Queries para as quais a lista de seleção, a condição `HAVING` ou a lista `ORDER BY` referenciem colunas não agregadas que não estão nomeadas na cláusula `GROUP BY` nem são funcionalmente dependentes delas. (Antes do 5.7.5, o MySQL não detecta dependência funcional e `ONLY_FULL_GROUP_BY` não é ativado por padrão.)

O MySQL 5.7.5 e posterior também permite uma coluna não agregada não nomeada em uma cláusula `GROUP BY` quando o SQL mode `ONLY_FULL_GROUP_BY` está ativado, desde que esta coluna esteja limitada a um único valor, como mostrado no exemplo a seguir:

```sql
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

Também é possível ter mais de uma coluna não agregada na lista `SELECT` ao usar `ONLY_FULL_GROUP_BY`. Neste caso, cada uma dessas colunas deve ser limitada a um único valor, e todas essas condições limitantes devem ser unidas por `AND` lógico, como mostrado aqui:

```sql
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

Se `ONLY_FULL_GROUP_BY` estiver desativado, uma extensão do MySQL ao uso padrão SQL de `GROUP BY` permite que a lista de seleção, a condição `HAVING` ou a lista `ORDER BY` referenciem colunas não agregadas, mesmo que as colunas não sejam funcionalmente dependentes das colunas do `GROUP BY`. Isso faz com que o MySQL aceite a Query anterior. Neste caso, o servidor está livre para escolher qualquer valor de cada grupo, então, a menos que sejam os mesmos, os valores escolhidos são não determinísticos, o que provavelmente não é o que você deseja. Além disso, a seleção de valores de cada grupo não pode ser influenciada pela adição de uma cláusula `ORDER BY`. A classificação do conjunto de resultados ocorre depois que os valores foram escolhidos, e o `ORDER BY` não afeta qual valor dentro de cada grupo o servidor escolhe. Desativar `ONLY_FULL_GROUP_BY` é útil principalmente quando você sabe que, devido a alguma propriedade dos dados, todos os valores em cada coluna não agregada não nomeada no `GROUP BY` são os mesmos para cada grupo.

Você pode obter o mesmo efeito sem desativar `ONLY_FULL_GROUP_BY` usando `ANY_VALUE()` para referenciar a coluna não agregada.

A discussão a seguir demonstra a dependência funcional, a mensagem de erro que o MySQL produz quando a dependência funcional está ausente e maneiras de fazer com que o MySQL aceite uma Query na ausência de dependência funcional.

Esta Query pode ser inválida com `ONLY_FULL_GROUP_BY` ativado porque a coluna não agregada `address` na lista de seleção não está nomeada na cláusula `GROUP BY`:

```sql
SELECT name, address, MAX(age) FROM t GROUP BY name;
```

A Query é válida se `name` for uma Primary Key de `t` ou for uma coluna `NOT NULL` exclusiva (unique). Nesses casos, o MySQL reconhece que a coluna selecionada é funcionalmente dependente de uma coluna de agrupamento. Por exemplo, se `name` é uma Primary Key, seu valor determina o valor de `address` porque cada grupo tem apenas um valor da Primary Key e, portanto, apenas uma linha. Como resultado, não há aleatoriedade na escolha do valor de `address` em um grupo e não há necessidade de rejeitar a Query.

A Query é inválida se `name` não for uma Primary Key de `t` ou uma coluna `NOT NULL` exclusiva. Neste caso, nenhuma dependência funcional pode ser inferida e ocorre um erro:

```sql
mysql> SELECT name, address, MAX(age) FROM t GROUP BY name;
ERROR 1055 (42000): Expression #2 of SELECT list is not in GROUP
BY clause and contains nonaggregated column 'mydb.t.address' which
is not functionally dependent on columns in GROUP BY clause; this
is incompatible with sql_mode=only_full_group_by
```

Se você souber que, *para um dado conjunto de dados*, cada valor de `name` de fato determina unicamente o valor de `address`, `address` é efetivamente funcionalmente dependente de `name`. Para instruir o MySQL a aceitar a Query, você pode usar a função `ANY_VALUE()`:

```sql
SELECT name, ANY_VALUE(address), MAX(age) FROM t GROUP BY name;
```

Alternativamente, desative `ONLY_FULL_GROUP_BY`.

O exemplo anterior é bastante simples, no entanto. Em particular, é improvável que você agrupe em uma única coluna de Primary Key, pois cada grupo conteria apenas uma linha. Para exemplos adicionais que demonstram dependência funcional em Queries mais complexas, consulte Seção 12.19.4, “Detection of Functional Dependence”.

Se uma Query tiver funções de agregação e nenhuma cláusula `GROUP BY`, ela não poderá ter colunas não agregadas na lista de seleção, condição `HAVING` ou lista `ORDER BY` com `ONLY_FULL_GROUP_BY` ativado:

```sql
mysql> SELECT name, MAX(age) FROM t;
ERROR 1140 (42000): In aggregated query without GROUP BY, expression
#1 of SELECT list contains nonaggregated column 'mydb.t.name'; this
is incompatible with sql_mode=only_full_group_by
```

Sem `GROUP BY`, há um único grupo e é não determinístico qual valor de `name` escolher para o grupo. Aqui, também, `ANY_VALUE()` pode ser usado, se for irrelevante qual valor de `name` o MySQL escolher:

```sql
SELECT ANY_VALUE(name), MAX(age) FROM t;
```

No MySQL 5.7.5 e posterior, `ONLY_FULL_GROUP_BY` também afeta o tratamento de Queries que usam `DISTINCT` e `ORDER BY`. Considere o caso de uma tabela `t` com três colunas `c1`, `c2` e `c3` que contém estas linhas:

```sql
c1 c2 c3
1  2  A
3  4  B
1  2  C
```

Suponha que executemos a seguinte Query, esperando que os resultados sejam ordenados por `c3`:

```sql
SELECT DISTINCT c1, c2 FROM t ORDER BY c3;
```

Para ordenar o resultado, os duplicados devem ser eliminados primeiro. Mas para fazer isso, devemos manter a primeira linha ou a terceira? Esta escolha arbitrária influencia o valor retido de `c3`, o que por sua vez influencia a ordenação e a torna arbitrária também. Para evitar este problema, uma Query que tenha `DISTINCT` e `ORDER BY` é rejeitada como inválida se qualquer expressão `ORDER BY` não satisfizer pelo menos uma destas condições:

* A expressão é igual a uma na lista de seleção
* Todas as colunas referenciadas pela expressão e pertencentes às tabelas selecionadas da Query são elementos da lista de seleção

Outra extensão do MySQL ao SQL padrão permite referências na cláusula `HAVING` a expressões com alias (aliased expressions) na lista de seleção. Por exemplo, a seguinte Query retorna valores de `name` que ocorrem apenas uma vez na tabela `orders`:

```sql
SELECT name, COUNT(name) FROM orders
  GROUP BY name
  HAVING COUNT(name) = 1;
```

A extensão do MySQL permite o uso de um alias na cláusula `HAVING` para a coluna agregada:

```sql
SELECT name, COUNT(name) AS c FROM orders
  GROUP BY name
  HAVING c = 1;
```

**Nota** Antes do MySQL 5.7.5, ativar `ONLY_FULL_GROUP_BY` desabilita esta extensão, exigindo assim que a cláusula `HAVING` seja escrita usando expressões sem alias.

O SQL padrão permite apenas expressões de coluna nas cláusulas `GROUP BY`, portanto, uma instrução como esta é inválida porque `FLOOR(value/100)` é uma expressão que não é uma coluna:

```sql
SELECT id, FLOOR(value/100)
  FROM tbl_name
  GROUP BY id, FLOOR(value/100);
```

O MySQL estende o SQL padrão para permitir expressões que não são colunas nas cláusulas `GROUP BY` e considera a instrução anterior válida.

O SQL padrão também não permite aliases nas cláusulas `GROUP BY`. O MySQL estende o SQL padrão para permitir aliases, então outra forma de escrever a Query é a seguinte:

```sql
SELECT id, FLOOR(value/100) AS val
  FROM tbl_name
  GROUP BY id, val;
```

O alias `val` é considerado uma expressão de coluna na cláusula `GROUP BY`.

Na presença de uma expressão que não é coluna na cláusula `GROUP BY`, o MySQL reconhece a igualdade entre essa expressão e as expressões na lista de seleção. Isso significa que, com o SQL mode `ONLY_FULL_GROUP_BY` ativado, a Query contendo `GROUP BY id, FLOOR(value/100)` é válida porque essa mesma expressão `FLOOR()` ocorre na lista de seleção. No entanto, o MySQL não tenta reconhecer a dependência funcional em expressões `GROUP BY` que não são colunas, então a Query a seguir é inválida com `ONLY_FULL_GROUP_BY` ativado, embora a terceira expressão selecionada seja uma fórmula simples da coluna `id` e da expressão `FLOOR()` na cláusula `GROUP BY`:

```sql
SELECT id, FLOOR(value/100), id+FLOOR(value/100)
  FROM tbl_name
  GROUP BY id, FLOOR(value/100);
```

Uma solução alternativa é usar uma tabela derivada:

```sql
SELECT id, F, id+F
  FROM
    (SELECT id, FLOOR(value/100) AS F
     FROM tbl_name
     GROUP BY id, FLOOR(value/100)) AS dt;
```
