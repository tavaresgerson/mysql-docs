#### 15.2.13.2 Cláusula JOIN

O MySQL suporta a seguinte sintaxe de `JOIN` para a parte *`table_references`* das instruções `SELECT` e das instruções `DELETE` e `UPDATE` de múltiplas tabelas:

```
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
        [[AS] alias] [index_hint_list]
  | [LATERAL] table_subquery [AS] alias [(col_list)]
  | ( table_references )
}

joined_table: {
    table_reference {[INNER | CROSS] JOIN | STRAIGHT_JOIN} table_factor [join_specification]
  | table_reference {LEFT|RIGHT} [OUTER] JOIN table_reference join_specification
  | table_reference NATURAL [INNER | {LEFT|RIGHT} [OUTER]] JOIN table_factor
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

Uma referência de tabela também é conhecida como expressão de junção.

Uma referência de tabela (quando se refere a uma tabela particionada) pode conter uma cláusula `PARTITION`, incluindo uma lista de partições, subpartições ou ambas, separadas por vírgulas. Esta opção segue o nome da tabela e precede qualquer declaração de alias. O efeito desta opção é que as linhas são selecionadas apenas das partições ou subpartições listadas. Quaisquer partições ou subpartições não mencionadas na lista são ignoradas. Para mais informações e exemplos, consulte a Seção 26.5, “Seleção de Partições”.

A sintaxe de *`table_factor`* é estendida no MySQL em comparação com o SQL padrão. O padrão aceita apenas *`table_reference`*, não uma lista delas dentro de um par de parênteses.

Esta é uma extensão conservadora se cada vírgula em uma lista de itens de *`table_reference`* for considerada equivalente a uma junção interna. Por exemplo:

```
SELECT * FROM t1 LEFT JOIN (t2, t3, t4)
                 ON (t2.a = t1.a AND t3.b = t1.b AND t4.c = t1.c)
```

é equivalente a:

```
SELECT * FROM t1 LEFT JOIN (t2 CROSS JOIN t3 CROSS JOIN t4)
                 ON (t2.a = t1.a AND t3.b = t1.b AND t4.c = t1.c)
```

No MySQL, `JOIN`, `CROSS JOIN` e `INNER JOIN` são equivalentes sintáticos (podem substituir-se mutuamente). No SQL padrão, eles não são equivalentes. `INNER JOIN` é usado com uma cláusula `ON`, `CROSS JOIN` é usado de outra forma.

De forma geral, os parênteses podem ser ignorados em expressões de junção que contenham apenas operações de junção interna. O MySQL também suporta junções aninhadas. Veja a Seção 10.2.1.8, “Otimização de Junção Aninhada”.

As dicas de índice podem ser especificadas para influenciar a forma como o otimizador do MySQL utiliza os índices. Para mais informações, consulte a Seção 10.9.4, “Dicas de Índice”. As dicas do otimizador e a variável de sistema `optimizer_switch` são outras maneiras de influenciar o uso do otimizador de índices. Consulte a Seção 10.9.3, “Dicas do Otimizador”, e a Seção 10.9.2, “Otimizações Alternativas”.

A lista a seguir descreve os fatores gerais a serem considerados ao escrever junções:

* Uma referência de tabela pode ser aliased usando `tbl_name AS alias_name` ou *`tbl_name alias_name`*:

  ```
  SELECT t1.name, t2.salary
    FROM employee AS t1 INNER JOIN info AS t2 ON t1.name = t2.name;

  SELECT t1.name, t2.salary
    FROM employee t1 INNER JOIN info t2 ON t1.name = t2.name;
  ```

* Uma *`table_subquery`* também é conhecida como tabela derivada ou subconsulta na cláusula `FROM`. Consulte a Seção 15.2.15.8, “Tabelas Derivadas”. Tais subconsultas *devem* incluir um alias para dar ao resultado da subconsulta um nome de tabela, e podem opcionalmente incluir uma lista de nomes de colunas de tabela entre parênteses. Um exemplo trivial segue:

  ```
  SELECT * FROM (SELECT 1, 2, 3) AS t1;
  ```

* O número máximo de tabelas que podem ser referenciadas em uma única junção é 61. Isso inclui uma junção tratada pela fusão de tabelas derivadas e vistas na cláusula `FROM` no bloco de consulta externa (consulte a Seção 10.2.2.4, “Otimizando Tabelas Derivadas, Referências de Visões e Expressões de Tabela Comuns com Fusão ou Materialização”).

* `INNER JOIN` e `,` (vírgula) são semanticamente equivalentes na ausência de uma condição de junção: ambos produzem um produto cartesiano entre as tabelas especificadas (ou seja, cada e cada linha da primeira tabela é unida a cada e cada linha da segunda tabela).

No entanto, a precedência do operador de vírgula é menor do que a do `INNER JOIN`, `CROSS JOIN`, `LEFT JOIN`, e assim por diante. Se você misturar junções por vírgula com os outros tipos de junção quando houver uma condição de junção, pode ocorrer um erro do tipo `Coluna desconhecida 'col_name' na cláusula 'on'`. Informações sobre como lidar com esse problema são fornecidas mais adiante nesta seção.

* O *`search_condition`* usado com `ON` é qualquer expressão condicional do tipo que pode ser usada em uma cláusula `WHERE`. Geralmente, a cláusula `ON` serve para condições que especificam como unir tabelas, e a cláusula `WHERE` restringe quais linhas devem ser incluídas no conjunto de resultados.

* Se não houver uma linha correspondente à tabela correta na parte `ON` ou `USING` em um `LEFT JOIN`, uma linha com todas as colunas definidas como `NULL` é usada para a tabela correta. Você pode usar esse fato para encontrar linhas em uma tabela que não têm correspondência em outra tabela:

  ```
  SELECT left_tbl.*
    FROM left_tbl LEFT JOIN right_tbl ON left_tbl.id = right_tbl.id
    WHERE right_tbl.id IS NULL;
  ```

  Este exemplo encontra todas as linhas em `left_tbl` com um valor de `id` que não está presente em `right_tbl` (ou seja, todas as linhas em `left_tbl` sem uma linha correspondente em `right_tbl`). Veja a Seção 10.2.1.9, “Otimização de Junção Externa”.

* A cláusula `USING(join_column_list)` nomeia uma lista de colunas que devem existir em ambas as tabelas. Se as tabelas `a` e `b` contiverem as colunas `c1`, `c2` e `c3`, a seguinte junção compara colunas correspondentes das duas tabelas:

  ```
  a LEFT JOIN b USING (c1, c2, c3)
  ```

* A `NATURAL [LEFT] JOIN` de duas tabelas é definida como semanticamente equivalente a um `INNER JOIN` ou a um `LEFT JOIN` com uma cláusula `USING` que nomeia todas as colunas que existem em ambas as tabelas.

* A `RIGHT JOIN` funciona de forma análoga à `LEFT JOIN`. Para manter o código portável em diferentes bancos de dados, recomenda-se que você use `LEFT JOIN` em vez de `RIGHT JOIN`.

* A sintaxe `{ OJ ... }` mostrada na descrição da sintaxe de junção existe apenas para compatibilidade com ODBC. As chaves angulares na sintaxe devem ser escritas literalmente; elas não são sintaxes meta, como usadas em outras descrições de sintaxe.

  ```
  SELECT left_tbl.*
      FROM { OJ left_tbl LEFT OUTER JOIN right_tbl
             ON left_tbl.id = right_tbl.id }
      WHERE right_tbl.id IS NULL;
  ```

  Você pode usar outros tipos de junções dentro de `{ OJ ... }`, como `INNER JOIN` ou `RIGHT OUTER JOIN`. Isso ajuda com a compatibilidade com algumas aplicações de terceiros, mas não é sintaxe ODBC oficial.

* `STRAIGHT_JOIN` é semelhante a `JOIN`, exceto que a tabela esquerda é sempre lida antes da tabela direita. Isso pode ser usado para aqueles (poucos) casos para os quais o otimizador de junção processa as tabelas em uma ordem subótima.

Alguns exemplos de junções:

```
SELECT * FROM table1, table2;

SELECT * FROM table1 INNER JOIN table2 ON table1.id = table2.id;

SELECT * FROM table1 LEFT JOIN table2 ON table1.id = table2.id;

SELECT * FROM table1 LEFT JOIN table2 USING (id);

SELECT * FROM table1 LEFT JOIN table2 ON table1.id = table2.id
  LEFT JOIN table3 ON table2.id = table3.id;
```

Junções naturais e junções com `USING`, incluindo variantes de junção externa, são processadas de acordo com o padrão SQL:2003:

* Colunas redundantes de uma junção `NATURAL` não aparecem. Considere este conjunto de instruções:

  ```
  CREATE TABLE t1 (i INT, j INT);
  CREATE TABLE t2 (k INT, j INT);
  INSERT INTO t1 VALUES(1, 1);
  INSERT INTO t2 VALUES(1, 1);
  SELECT * FROM t1 NATURAL JOIN t2;
  SELECT * FROM t1 JOIN t2 USING (j);
  ```

  Na primeira instrução `SELECT`, a coluna `j` aparece em ambas as tabelas e, portanto, se torna uma coluna de junção, então, de acordo com o SQL padrão, ela deve aparecer apenas uma vez na saída, não duas vezes. Da mesma forma, na segunda instrução `SELECT`, a coluna `j` é nomeada na cláusula `USING` e deve aparecer apenas uma vez na saída, não duas vezes.

  Assim, as instruções produzem esta saída:

  ```
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

  A eliminação de coluna redundante e a ordenação de coluna ocorrem de acordo com o SQL padrão, produzindo esta ordem de exibição:

  + Primeiro, as colunas comuns coalescidas das duas tabelas juncionadas, na ordem em que ocorrem na primeira tabela

  + Segundo, as colunas únicas da primeira tabela, na ordem em que ocorrem nessa tabela

  + Terceiro, as colunas únicas da segunda tabela, na ordem em que ocorrem nessa tabela

A coluna de resultado única que substitui duas colunas comuns é definida usando a operação coalescer. Ou seja, para `t1.a` e `t2.a`, a coluna de junção única resultante `a` é definida como `a = COALESCE(t1.a, t2.a)`, onde:

```
  COALESCE(x, y) = (CASE WHEN x IS NOT NULL THEN x ELSE y END)
  ```

Se a operação de junção for qualquer outra junção, as colunas de resultado da junção consistem na concatenação de todas as colunas das tabelas unidas.

Uma consequência da definição de colunas coalescidas é que, para junções externas, a coluna coalescida contém o valor da coluna não `NULL` se uma das duas colunas for sempre `NULL`. Se nenhuma ou ambas as colunas forem `NULL`, ambas as colunas comuns terão o mesmo valor, então não importa qual delas seja escolhida como o valor da coluna coalescida. Uma maneira simples de interpretar isso é considerar que uma coluna coalescida de uma junção externa é representada pela coluna comum da tabela interna de uma `JOIN`. Suponha que as tabelas `t1(a, b)` e `t2(a, c)` tenham os seguintes conteúdos:

```
  t1    t2
  ----  ----
  1 x   2 z
  2 y   3 w
  ```

Então, para esta junção, a coluna `a` contém os valores de `t1.a`:

```
  mysql> SELECT * FROM t1 NATURAL LEFT JOIN t2;
  +------+------+------+
  | a    | b    | c    |
  +------+------+------+
  |    1 | x    | NULL |
  |    2 | y    | z    |
  +------+------+------+
  ```

Por outro lado, para esta junção, a coluna `a` contém os valores de `t2.a`.

```
  mysql> SELECT * FROM t1 NATURAL RIGHT JOIN t2;
  +------+------+------+
  | a    | c    | b    |
  +------+------+------+
  |    2 | z    | y    |
  |    3 | w    | NULL |
  +------+------+------+
  ```

Compare esses resultados com as consultas de outra forma equivalentes com `JOIN ... ON`:

```
  mysql> SELECT * FROM t1 LEFT JOIN t2 ON (t1.a = t2.a);
  +------+------+------+------+
  | a    | b    | a    | c    |
  +------+------+------+------+
  |    1 | x    | NULL | NULL |
  |    2 | y    |    2 | z    |
  +------+------+------+------+
  ```

```
  mysql> SELECT * FROM t1 RIGHT JOIN t2 ON (t1.a = t2.a);
  +------+------+------+------+
  | a    | b    | a    | c    |
  +------+------+------+------+
  |    2 | y    |    2 | z    |
  | NULL | NULL |    3 | w    |
  +------+------+------+------+
  ```

* Uma cláusula `USING` pode ser reescrita como uma cláusula `ON` que compara colunas correspondentes. No entanto, embora `USING` e `ON` sejam semelhantes, não são exatamente a mesma coisa. Considere as seguintes duas consultas:

```
  a LEFT JOIN b USING (c1, c2, c3)
  a LEFT JOIN b ON a.c1 = b.c1 AND a.c2 = b.c2 AND a.c3 = b.c3
  ```

Em relação à determinação de quais linhas satisfazem a condição de junção, ambas as junções são semanticamente idênticas.

Em relação à determinação das colunas a serem exibidas para a expansão `SELECT *`, as duas junções não são semânticamente idênticas. A junção `USING` seleciona o valor coalescido das colunas correspondentes, enquanto a junção `ON` seleciona todas as colunas de todas as tabelas. Para a junção `USING`, `SELECT *` seleciona esses valores:

```
  COALESCE(a.c1, b.c1), COALESCE(a.c2, b.c2), COALESCE(a.c3, b.c3)
  ```

Para a junção `ON`, `SELECT *` seleciona esses valores:

```
  a.c1, a.c2, a.c3, b.c1, b.c2, b.c3
  ```

Com uma junção interna, `COALESCE(a.c1, b.c1)` é a mesma que `a.c1` ou `b.c1`, porque ambas as colunas têm o mesmo valor. Com uma junção externa (como `LEFT JOIN`), uma das duas colunas pode ser `NULL`. Essa coluna é omitida do resultado.

* Uma cláusula `ON` pode referir-se apenas aos seus operandos.

  Exemplo:

  ```
  CREATE TABLE t1 (i1 INT);
  CREATE TABLE t2 (i2 INT);
  CREATE TABLE t3 (i3 INT);
  SELECT * FROM t1 JOIN t2 ON (i1 = i3) JOIN t3;
  ```

  A declaração falha com um erro `Unknown column 'i3' in 'on clause'` porque `i3` é uma coluna em `t3`, que não é um operador da cláusula `ON`. Para permitir que a junção seja processada, reescreva a declaração da seguinte forma:

  ```
  SELECT * FROM t1 JOIN t2 JOIN t3 ON (i1 = i3);
  ```

* A palavra-chave `JOIN` tem precedência maior que o operador vírgula (`,`), então a expressão de junção `t1, t2 JOIN t3` é interpretada como `(t1, (t2 JOIN t3))`, e não como `((t1, t2) JOIN t3)`. Isso afeta as declarações que usam uma cláusula `ON`, porque essa cláusula pode referir-se apenas às colunas dos operandos da junção, e a precedência afeta a interpretação do que são esses operandos.

  Exemplo:

  ```
  CREATE TABLE t1 (i1 INT, j1 INT);
  CREATE TABLE t2 (i2 INT, j2 INT);
  CREATE TABLE t3 (i3 INT, j3 INT);
  INSERT INTO t1 VALUES(1, 1);
  INSERT INTO t2 VALUES(1, 1);
  INSERT INTO t3 VALUES(1, 1);
  SELECT * FROM t1, t2 JOIN t3 ON (t1.i1 = t3.i3);
  ```

  A palavra-chave `JOIN` tem precedência sobre o operador vírgula, então os operandos para a cláusula `ON` são `t2` e `t3`. Como `t1.i1` não é uma coluna em nenhum dos operandos, o resultado é um erro `Unknown column 't1.i1' in 'on clause'`.

  Para permitir que a junção seja processada, use uma das seguintes estratégias:

+ Agrupe as duas primeiras tabelas explicitamente entre parênteses para que os operadores para a cláusula `ON` sejam `(t1, t2)` e `t3`:

    ```
    SELECT * FROM (t1, t2) JOIN t3 ON (t1.i1 = t3.i3);
    ```

  + Evite o uso do operador vírgula e use `JOIN` em vez disso:

    ```
    SELECT * FROM t1 JOIN t2 JOIN t3 ON (t1.i1 = t3.i3);
    ```

  A mesma interpretação de precedência também se aplica a instruções que misturam o operador vírgula com `INNER JOIN`, `CROSS JOIN`, `LEFT JOIN` e `RIGHT JOIN`, todos os quais têm precedência maior que o operador vírgula.

* Uma extensão do MySQL em comparação com o padrão SQL:2003 é que o MySQL permite que você qualifique as colunas comuns (coalescidas) das junções `NATURAL` ou `USING`, enquanto o padrão não permite isso.