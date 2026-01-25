#### 13.2.9.2 Cláusula JOIN

O MySQL suporta a seguinte sintaxe `JOIN` para a parte *`table_references`* das instruções [`SELECT`](select.html "13.2.9 SELECT Statement") e das instruções [`DELETE`](delete.html "13.2.2 DELETE Statement") e [`UPDATE`](update.html "13.2.11 UPDATE Statement") que envolvem múltiplas tabelas:

```sql
table_references:
    escaped_table_reference [, escaped_table_reference] ...

escaped_table_reference: {
    table_reference
  | { OJ table_reference }
}

table_reference: {
    table_factor
  | joined_table
}

table_factor: {
    tbl_name [PARTITION (partition_names)]
        AS] alias] [index_hint_list]
  | table_subquery [AS] alias
  | ( table_references )
}

joined_table: {
    table_reference [INNER | CROSS] JOIN table_factor [join_specification]
  | table_reference STRAIGHT_JOIN table_factor
  | table_reference STRAIGHT_JOIN table_factor ON search_condition
  | table_reference {LEFT|RIGHT} [OUTER] JOIN table_reference join_specification
  | table_reference NATURAL [{LEFT|RIGHT} [OUTER JOIN table_factor
}

join_specification: {
    ON search_condition
  | USING (join_column_list)
}

join_column_list:
    column_name[, column_name] ...

index_hint_list:
    index_hint[ index_hint] ...

index_hint: {
    USE {INDEX|KEY}
      [FOR {JOIN|ORDER BY|GROUP BY}] ([index_list])
  | {IGNORE|FORCE} {INDEX|KEY}
      [FOR {JOIN|ORDER BY|GROUP BY}] (index_list)
}

index_list:
    index_name [, index_name] ...
```

Uma referência de tabela também é conhecida como uma expressão JOIN.

Uma referência de tabela (quando se refere a uma tabela particionada) pode conter uma cláusula `PARTITION`, incluindo uma lista de PARTITIONs, subpartitions ou ambas, separadas por vírgulas. Esta opção segue o nome da tabela e precede qualquer declaração de ALIAS. O efeito desta opção é que as linhas são selecionadas apenas das PARTITIONs ou subpartitions listadas. Qualquer PARTITION ou subpartition não nomeada na lista é ignorada. Para mais informações e exemplos, consulte [Section 22.5, “Partition Selection”](partitioning-selection.html "22.5 Partition Selection").

A sintaxe de *`table_factor`* é estendida no MySQL em comparação com o SQL padrão. O padrão aceita apenas *`table_reference`*, e não uma lista delas dentro de um par de parênteses.

Esta é uma extensão conservadora se cada vírgula em uma lista de itens *`table_reference`* for considerada como equivalente a um INNER JOIN. Por exemplo:

```sql
SELECT * FROM t1 LEFT JOIN (t2, t3, t4)
                 ON (t2.a = t1.a AND t3.b = t1.b AND t4.c = t1.c)
```

é equivalente a:

```sql
SELECT * FROM t1 LEFT JOIN (t2 CROSS JOIN t3 CROSS JOIN t4)
                 ON (t2.a = t1.a AND t3.b = t1.b AND t4.c = t1.c)
```

No MySQL, `JOIN`, `CROSS JOIN` e `INNER JOIN` são equivalentes sintáticos (podem ser substituídos um pelo outro). No SQL padrão, eles não são equivalentes. `INNER JOIN` é usado com uma cláusula `ON`, e `CROSS JOIN` é usado no caso contrário.

Em geral, os parênteses podem ser ignorados em expressões JOIN que contenham apenas operações de INNER JOIN. O MySQL também suporta JOINs aninhados. Consulte [Section 8.2.1.7, “Nested Join Optimization”](nested-join-optimization.html "8.2.1.7 Nested Join Optimization").

Index hints podem ser especificados para influenciar como o otimizador do MySQL utiliza os Indexes. Para mais informações, consulte [Section 8.9.4, “Index Hints”](index-hints.html "8.9.4 Index Hints"). Optimizer hints e a variável de sistema `optimizer_switch` são outras formas de influenciar o uso de Indexes pelo otimizador. Consulte [Section 8.9.3, “Optimizer Hints”](optimizer-hints.html "8.9.3 Optimizer Hints") e [Section 8.9.2, “Switchable Optimizations”](switchable-optimizations.html "8.9.2 Switchable Optimizations").

A lista a seguir descreve fatores gerais a serem levados em consideração ao escrever JOINs:

* Uma referência de tabela pode receber um ALIAS (apelido) usando `tbl_name AS alias_name` ou *`tbl_name alias_name`*:

  ```sql
  SELECT t1.name, t2.salary
    FROM employee AS t1 INNER JOIN info AS t2 ON t1.name = t2.name;

  SELECT t1.name, t2.salary
    FROM employee t1 INNER JOIN info t2 ON t1.name = t2.name;
  ```

* Uma *`table_subquery`* também é conhecida como uma *derived table* ou subquery na cláusula `FROM`. Consulte [Section 13.2.10.8, “Derived Tables”](derived-tables.html "13.2.10.8 Derived Tables"). Tais subqueries *devem* incluir um ALIAS para dar um nome de tabela ao resultado da subquery. Segue um exemplo trivial:

  ```sql
  SELECT * FROM (SELECT 1, 2, 3) AS t1;
  ```

* O número máximo de tabelas que podem ser referenciadas em um único JOIN é 61. Isso inclui um JOIN tratado pela mesclagem de *derived tables* e *Views* na cláusula `FROM` no bloco de Query externo (consulte [Section 8.2.2.4, “Optimizing Derived Tables and View References with Merging or Materialization”](derived-table-optimization.html "8.2.2.4 Optimizing Derived Tables and View References with Merging or Materialization")).

* `INNER JOIN` e `,` (vírgula) são semanticamente equivalentes na ausência de uma condição JOIN: ambos produzem um produto cartesiano entre as tabelas especificadas (ou seja, cada linha na primeira tabela é unida a cada linha na segunda tabela).

  No entanto, a precedência do operador vírgula é menor do que a de `INNER JOIN`, `CROSS JOIN`, `LEFT JOIN` e assim por diante. Se você misturar JOINs por vírgula com os outros tipos de JOIN quando houver uma condição JOIN, um erro na forma `Unknown column 'col_name' in 'on clause'` pode ocorrer. Informações sobre como lidar com este problema são fornecidas mais adiante nesta seção.

* A *`search_condition`* usada com `ON` é qualquer expressão condicional na forma que pode ser utilizada em uma cláusula `WHERE`. Geralmente, a cláusula `ON` serve para condições que especificam como unir tabelas, e a cláusula `WHERE` restringe quais linhas incluir no conjunto de resultados.

* Se não houver uma linha correspondente para a tabela direita na parte `ON` ou `USING` em um `LEFT JOIN`, uma linha com todas as colunas definidas como `NULL` é usada para a tabela direita. Você pode usar este fato para encontrar linhas em uma tabela que não têm contrapartida em outra tabela:

  ```sql
  SELECT left_tbl.*
    FROM left_tbl LEFT JOIN right_tbl ON left_tbl.id = right_tbl.id
    WHERE right_tbl.id IS NULL;
  ```

  Este exemplo encontra todas as linhas em `left_tbl` com um valor `id` que não está presente em `right_tbl` (ou seja, todas as linhas em `left_tbl` sem linha correspondente em `right_tbl`). Consulte [Section 8.2.1.8, “Outer Join Optimization”](outer-join-optimization.html "8.2.1.8 Outer Join Optimization").

* A cláusula `USING(join_column_list)` nomeia uma lista de colunas que devem existir em ambas as tabelas. Se as tabelas `a` e `b` contiverem ambas as colunas `c1`, `c2` e `c3`, o seguinte JOIN compara as colunas correspondentes das duas tabelas:

  ```sql
  a LEFT JOIN b USING (c1, c2, c3)
  ```

* O `NATURAL [LEFT] JOIN` de duas tabelas é definido como semanticamente equivalente a um `INNER JOIN` ou a um `LEFT JOIN` com uma cláusula `USING` que nomeia todas as colunas que existem em ambas as tabelas.

* O `RIGHT JOIN` funciona analogamente ao `LEFT JOIN`. Para manter o código portável entre Databases, é recomendável que você use `LEFT JOIN` em vez de `RIGHT JOIN`.

* A sintaxe `{ OJ ... }` mostrada na descrição da sintaxe JOIN existe apenas para compatibilidade com ODBC. As chaves na sintaxe devem ser escritas literalmente; elas não são metassintaxe como usado em outras descrições de sintaxe.

  ```sql
  SELECT left_tbl.*
      FROM { OJ left_tbl LEFT OUTER JOIN right_tbl
             ON left_tbl.id = right_tbl.id }
      WHERE right_tbl.id IS NULL;
  ```

  Você pode usar outros tipos de JOINs dentro de `{ OJ ... }`, como `INNER JOIN` ou `RIGHT OUTER JOIN`. Isso ajuda na compatibilidade com alguns aplicativos de terceiros, mas não é uma sintaxe ODBC oficial.

* `STRAIGHT_JOIN` é semelhante a `JOIN`, exceto que a tabela esquerda é sempre lida antes da tabela direita. Isso pode ser usado nos (poucos) casos em que o otimizador JOIN processa as tabelas em uma ordem não ideal.

Alguns exemplos de JOIN:

```sql
SELECT * FROM table1, table2;

SELECT * FROM table1 INNER JOIN table2 ON table1.id = table2.id;

SELECT * FROM table1 LEFT JOIN table2 ON table1.id = table2.id;

SELECT * FROM table1 LEFT JOIN table2 USING (id);

SELECT * FROM table1 LEFT JOIN table2 ON table1.id = table2.id
  LEFT JOIN table3 ON table2.id = table3.id;
```

NATURAL JOINs e JOINs com `USING`, incluindo variantes de *Outer Join*, são processados de acordo com o padrão SQL:2003:

* Colunas redundantes de um `NATURAL JOIN` não aparecem. Considere este conjunto de instruções:

  ```sql
  CREATE TABLE t1 (i INT, j INT);
  CREATE TABLE t2 (k INT, j INT);
  INSERT INTO t1 VALUES(1, 1);
  INSERT INTO t2 VALUES(1, 1);
  SELECT * FROM t1 NATURAL JOIN t2;
  SELECT * FROM t1 JOIN t2 USING (j);
  ```

  Na primeira instrução [`SELECT`](select.html "13.2.9 SELECT Statement"), a coluna `j` aparece em ambas as tabelas e, portanto, se torna uma coluna JOIN; assim, de acordo com o SQL padrão, ela deve aparecer apenas uma vez na saída, e não duas vezes. Da mesma forma, na segunda instrução SELECT, a coluna `j` é nomeada na cláusula `USING` e deve aparecer apenas uma vez na saída, e não duas vezes.

  Assim, as instruções produzem esta saída:

  ```sql
  +------+------+------+
  | j    | i    | k    |
  +------+------+------+
  |    1 |    1 |    1 |
  +------+------+------+
  +------+------+------+
  | j    | i    | k    |
  +------+------+------+
  |    1 |    1 |    1 |
  +------+------+------+
  ```

  A eliminação de colunas redundantes e a ordenação de colunas ocorrem de acordo com o SQL padrão, produzindo esta ordem de exibição:

  + Primeiro, colunas comuns unidas (coalesced) das duas tabelas unidas, na ordem em que ocorrem na primeira tabela.

  + Segundo, colunas exclusivas da primeira tabela, na ordem em que ocorrem nessa tabela.

  + Terceiro, colunas exclusivas da segunda tabela, na ordem em que ocorrem nessa tabela.

  A coluna de resultado única que substitui duas colunas comuns é definida usando a operação COALESCE. Ou seja, para `t1.a` e `t2.a`, a única coluna JOIN resultante `a` é definida como `a = COALESCE(t1.a, t2.a)`, onde:

  ```sql
  COALESCE(x, y) = (CASE WHEN x IS NOT NULL THEN x ELSE y END)
  ```

  Se a operação JOIN for qualquer outra, as colunas de resultado do JOIN consistem na concatenação de todas as colunas das tabelas unidas.

  Uma consequência da definição de colunas unidas (coalesced) é que, para *Outer JOINs*, a coluna unida contém o valor da coluna não-`NULL` se uma das duas colunas for sempre `NULL`. Se nenhuma ou ambas as colunas forem `NULL`, ambas as colunas comuns terão o mesmo valor, portanto, não importa qual seja escolhida como o valor da coluna unida. Uma maneira simples de interpretar isso é considerar que uma coluna unida de um *Outer JOIN* é representada pela coluna comum da tabela INNER de um `JOIN`. Suponha que as tabelas `t1(a, b)` e `t2(a, c)` tenham o seguinte conteúdo:

  ```sql
  t1    t2
  ----  ----
  1 x   2 z
  2 y   3 w
  ```

  Então, para este JOIN, a coluna `a` contém os valores de `t1.a`:

  ```sql
  mysql> SELECT * FROM t1 NATURAL LEFT JOIN t2;
  +------+------+------+
  | a    | b    | c    |
  +------+------+------+
  |    1 | x    | NULL |
  |    2 | y    | z    |
  +------+------+------+
  ```

  Em contraste, para este JOIN, a coluna `a` contém os valores de `t2.a`.

  ```sql
  mysql> SELECT * FROM t1 NATURAL RIGHT JOIN t2;
  +------+------+------+
  | a    | c    | b    |
  +------+------+------+
  |    2 | z    | y    |
  |    3 | w    | NULL |
  +------+------+------+
  ```

  Compare esses resultados com as Querys de outra forma equivalentes com `JOIN ... ON`:

  ```sql
  mysql> SELECT * FROM t1 LEFT JOIN t2 ON (t1.a = t2.a);
  +------+------+------+------+
  | a    | b    | a    | c    |
  +------+------+------+------+
  |    1 | x    | NULL | NULL |
  |    2 | y    |    2 | z    |
  +------+------+------+------+
  ```

  ```sql
  mysql> SELECT * FROM t1 RIGHT JOIN t2 ON (t1.a = t2.a);
  +------+------+------+------+
  | a    | b    | a    | c    |
  +------+------+------+------+
  |    2 | y    |    2 | z    |
  | NULL | NULL |    3 | w    |
  +------+------+------+------+
  ```

* Uma cláusula `USING` pode ser reescrita como uma cláusula `ON` que compara colunas correspondentes. No entanto, embora `USING` e `ON` sejam semelhantes, eles não são exatamente iguais. Considere as duas Querys a seguir:

  ```sql
  a LEFT JOIN b USING (c1, c2, c3)
  a LEFT JOIN b ON a.c1 = b.c1 AND a.c2 = b.c2 AND a.c3 = b.c3
  ```

  No que diz respeito a determinar quais linhas satisfazem a condição JOIN, ambos os JOINs são semanticamente idênticos.

  No que diz respeito a determinar quais colunas exibir para a expansão `SELECT *`, os dois JOINs não são semanticamente idênticos. O JOIN `USING` seleciona o valor unido (coalesced) das colunas correspondentes, enquanto o JOIN `ON` seleciona todas as colunas de todas as tabelas. Para o JOIN `USING`, `SELECT *` seleciona estes valores:

  ```sql
  COALESCE(a.c1, b.c1), COALESCE(a.c2, b.c2), COALESCE(a.c3, b.c3)
  ```

  Para o JOIN `ON`, `SELECT *` seleciona estes valores:

  ```sql
  a.c1, a.c2, a.c3, b.c1, b.c2, b.c3
  ```

  Com um INNER JOIN, [`COALESCE(a.c1, b.c1)`](comparison-operators.html#function_coalesce) é o mesmo que `a.c1` ou `b.c1` porque ambas as colunas têm o mesmo valor. Com um *Outer JOIN* (como `LEFT JOIN`), uma das duas colunas pode ser `NULL`. Essa coluna é omitida do resultado.

* Uma cláusula `ON` pode se referir apenas aos seus operandos.

  Exemplo:

  ```sql
  CREATE TABLE t1 (i1 INT);
  CREATE TABLE t2 (i2 INT);
  CREATE TABLE t3 (i3 INT);
  SELECT * FROM t1 JOIN t2 ON (i1 = i3) JOIN t3;
  ```

  A instrução falha com um erro `Unknown column 'i3' in 'on clause'` porque `i3` é uma coluna em `t3`, que não é um operando da cláusula `ON`. Para permitir que o JOIN seja processado, reescreva a instrução da seguinte forma:

  ```sql
  SELECT * FROM t1 JOIN t2 JOIN t3 ON (i1 = i3);
  ```

* `JOIN` tem maior precedência do que o operador vírgula (`,`), de modo que a expressão JOIN `t1, t2 JOIN t3` é interpretada como `(t1, (t2 JOIN t3))`, e não como `((t1, t2) JOIN t3)`. Isso afeta instruções que usam uma cláusula `ON` porque essa cláusula pode se referir apenas a colunas nos operandos do JOIN, e a precedência afeta a interpretação de quais são esses operandos.

  Exemplo:

  ```sql
  CREATE TABLE t1 (i1 INT, j1 INT);
  CREATE TABLE t2 (i2 INT, j2 INT);
  CREATE TABLE t3 (i3 INT, j3 INT);
  INSERT INTO t1 VALUES(1, 1);
  INSERT INTO t2 VALUES(1, 1);
  INSERT INTO t3 VALUES(1, 1);
  SELECT * FROM t1, t2 JOIN t3 ON (t1.i1 = t3.i3);
  ```

  O `JOIN` tem precedência sobre o operador vírgula, então os operandos para a cláusula `ON` são `t2` e `t3`. Como `t1.i1` não é uma coluna em nenhum dos operandos, o resultado é um erro `Unknown column 't1.i1' in 'on clause'`.

  Para permitir que o JOIN seja processado, use uma destas estratégias:

  + Agrupe as duas primeiras tabelas explicitamente com parênteses para que os operandos da cláusula `ON` sejam `(t1, t2)` e `t3`:

    ```sql
    SELECT * FROM (t1, t2) JOIN t3 ON (t1.i1 = t3.i3);
    ```

  + Evite o uso do operador vírgula e use `JOIN` em vez disso:

    ```sql
    SELECT * FROM t1 JOIN t2 JOIN t3 ON (t1.i1 = t3.i3);
    ```

  A mesma interpretação de precedência também se aplica a instruções que misturam o operador vírgula com `INNER JOIN`, `CROSS JOIN`, `LEFT JOIN` e `RIGHT JOIN`, todos os quais têm precedência superior ao operador vírgula.

* Uma extensão do MySQL em comparação com o padrão SQL:2003 é que o MySQL permite qualificar as colunas comuns (unidas/coalesced) de JOINs `NATURAL` ou `USING`, enquanto o padrão não permite isso.