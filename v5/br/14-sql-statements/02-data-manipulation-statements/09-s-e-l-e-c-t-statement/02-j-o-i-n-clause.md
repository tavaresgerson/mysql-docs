#### 13.2.9.2 Cláusula de UNIFICAÇÃO

O MySQL suporta a seguinte sintaxe de `JOIN` para a parte `table_references` das instruções `SELECT` e das instruções `DELETE` e `UPDATE` de múltiplas tabelas:

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

Uma referência de tabela também é conhecida como expressão de junção.

Uma referência de tabela (quando se refere a uma tabela particionada) pode conter uma cláusula `PARTITION`, incluindo uma lista de particionações, subparticionações ou ambas, separadas por vírgulas. Esta opção segue o nome da tabela e precede qualquer declaração de alias. O efeito desta opção é que as linhas são selecionadas apenas das particionações ou subparticionações listadas. Quaisquer particionações ou subparticionações não mencionadas na lista são ignoradas. Para mais informações e exemplos, consulte Seção 22.5, “Seleção de Particionamento”.

A sintaxe de *`table_factor`* é estendida no MySQL em comparação com o SQL padrão. O padrão aceita apenas *`table_reference`*, não uma lista deles dentro de um par de parênteses.

Essa é uma extensão conservadora, onde cada vírgula em uma lista de itens de *`table_reference`* é considerada equivalente a uma junção interna. Por exemplo:

```sql
SELECT * FROM t1 LEFT JOIN (t2, t3, t4)
                 ON (t2.a = t1.a AND t3.b = t1.b AND t4.c = t1.c)
```

é equivalente a:

```sql
SELECT * FROM t1 LEFT JOIN (t2 CROSS JOIN t3 CROSS JOIN t4)
                 ON (t2.a = t1.a AND t3.b = t1.b AND t4.c = t1.c)
```

Em MySQL, `JOIN`, `CROSS JOIN` e `INNER JOIN` são equivalentes sintáticos (podem substituir um ao outro). No SQL padrão, eles não são equivalentes. `INNER JOIN` é usado com uma cláusula `ON`, `CROSS JOIN` é usado de outra forma.

Em geral, as chaves de parênteses podem ser ignoradas em expressões de junção que contenham apenas operações de junção interna. O MySQL também suporta junções aninhadas. Veja Seção 8.2.1.7, “Otimização de Junção Aninhada”.

Os indicadores de índice podem ser especificados para afetar a forma como o otimizador do MySQL utiliza os índices. Para mais informações, consulte Seção 8.9.4, “Indicadores de Índice”. Os indicadores do otimizador e a variável de sistema `optimizer_switch` são outras maneiras de influenciar o uso do otimizador dos índices. Consulte Seção 8.9.3, “Indicadores do Otimizador” e Seção 8.9.2, “Otimizações Alternativas”.

A lista a seguir descreve os fatores gerais a serem considerados ao escrever junções:

- Uma referência de tabela pode ser aliassificada usando `tbl_name AS alias_name` ou *`tbl_name alias_name`*:

  ```sql
  SELECT t1.name, t2.salary
    FROM employee AS t1 INNER JOIN info AS t2 ON t1.name = t2.name;

  SELECT t1.name, t2.salary
    FROM employee t1 INNER JOIN info t2 ON t1.name = t2.name;
  ```

- Uma *`table_subquery`* também é conhecida como tabela derivada ou subconsulta na cláusula `FROM`. Veja Seção 13.2.10.8, “Tabelas Derivadas”. Tais subconsultas *devem* incluir um alias para dar ao resultado da subconsulta um nome de tabela. Um exemplo trivial segue:

  ```sql
  SELECT * FROM (SELECT 1, 2, 3) AS t1;
  ```

- O número máximo de tabelas que podem ser referenciadas em uma única junção é de 61. Isso inclui uma junção realizada pela fusão de tabelas derivadas e visualizações na cláusula `FROM` no bloco de consulta externa (consulte Seção 8.2.2.4, "Otimização de Tabelas Derivadas e Referências de Visualizações com Fusão ou Materialização").

- `INNER JOIN` e `,` (vírgula) são semanticamente equivalentes na ausência de uma condição de junção: ambos produzem um produto cartesiano entre as tabelas especificadas (ou seja, cada linha da primeira tabela é unida a cada linha da segunda tabela).

  No entanto, a precedência do operador de vírgula é menor do que a do `INNER JOIN`, `CROSS JOIN`, `LEFT JOIN`, e assim por diante. Se você misturar junções por vírgula com os outros tipos de junção quando houver uma condição de junção, pode ocorrer um erro do tipo `Coluna desconhecida 'col_name' na cláusula 'on'`. Informações sobre como lidar com esse problema são fornecidas mais adiante nesta seção.

- O *`search_condition`* usado com `ON` é qualquer expressão condicional do tipo que pode ser usada em uma cláusula `WHERE`. Geralmente, a cláusula `ON` serve para condições que especificam como unir tabelas, e a cláusula `WHERE` restringe quais linhas serão incluídas no conjunto de resultados.

- Se não houver uma linha correspondente à tabela correta na parte `ON` ou `USING` de uma `LEFT JOIN`, uma linha com todas as colunas definidas como `NULL` será usada para a tabela correta. Você pode usar esse fato para encontrar linhas em uma tabela que não têm correspondência em outra tabela:

  ```sql
  SELECT left_tbl.*
    FROM left_tbl LEFT JOIN right_tbl ON left_tbl.id = right_tbl.id
    WHERE right_tbl.id IS NULL;
  ```

  Este exemplo encontra todas as linhas em `left_tbl` com um valor de `id` que não está presente em `right_tbl` (ou seja, todas as linhas em `left_tbl` sem uma linha correspondente em `right_tbl`). Veja Seção 8.2.1.8, “Otimização de Conjunções Externas”.

- A cláusula `USING(join_column_list)` nomeia uma lista de colunas que devem existir em ambas as tabelas. Se as tabelas `a` e `b` contiverem as colunas `c1`, `c2` e `c3`, a seguinte junção compara as colunas correspondentes das duas tabelas:

  ```sql
  a LEFT JOIN b USING (c1, c2, c3)
  ```

- A junção `NATURAL [LEFT]` de duas tabelas é definida como equivalente semanticamente a uma `INNER JOIN` ou a uma `LEFT JOIN` com uma cláusula `USING` que nomeia todas as colunas que existem em ambas as tabelas.

- A junção `RIGHT` funciona de forma análoga à junção `LEFT`. Para manter o código portátil em diferentes bancos de dados, recomenda-se que você use `LEFT JOIN` em vez de `RIGHT JOIN`.

- A sintaxe `{ OJ ... }`, mostrada na descrição da sintaxe de junção, existe apenas para compatibilidade com ODBC. As chaves angulares na sintaxe devem ser escritas literalmente; elas não são metacaracteres, como usados em outras descrições de sintaxe.

  ```sql
  SELECT left_tbl.*
      FROM { OJ left_tbl LEFT OUTER JOIN right_tbl
             ON left_tbl.id = right_tbl.id }
      WHERE right_tbl.id IS NULL;
  ```

  Você pode usar outros tipos de junções dentro de `{ OJ ... }`, como `INNER JOIN` ou `RIGHT OUTER JOIN`. Isso ajuda na compatibilidade com algumas aplicações de terceiros, mas não é a sintaxe oficial do ODBC.

- `STRAIGHT_JOIN` é semelhante a `JOIN`, exceto que a tabela esquerda é sempre lida antes da tabela direita. Isso pode ser usado para aqueles (poucos) casos em que o otimizador de junção processa as tabelas em uma ordem subótima.

Alguns exemplos de adesão:

```sql
SELECT * FROM table1, table2;

SELECT * FROM table1 INNER JOIN table2 ON table1.id = table2.id;

SELECT * FROM table1 LEFT JOIN table2 ON table1.id = table2.id;

SELECT * FROM table1 LEFT JOIN table2 USING (id);

SELECT * FROM table1 LEFT JOIN table2 ON table1.id = table2.id
  LEFT JOIN table3 ON table2.id = table3.id;
```

As junções naturais e as junções com `USING`, incluindo as variantes de junção externa, são processadas de acordo com o padrão SQL:2003:

- Colunas redundantes de uma junção `NATURAL` não aparecem. Considere este conjunto de declarações:

  ```sql
  CREATE TABLE t1 (i INT, j INT);
  CREATE TABLE t2 (k INT, j INT);
  INSERT INTO t1 VALUES(1, 1);
  INSERT INTO t2 VALUES(1, 1);
  SELECT * FROM t1 NATURAL JOIN t2;
  SELECT * FROM t1 JOIN t2 USING (j);
  ```

  Na primeira instrução `SELECT` (select.html), a coluna `j` aparece em ambas as tabelas e, portanto, se torna uma coluna de junção, então, de acordo com o SQL padrão, ela deve aparecer apenas uma vez no resultado, não duas vezes. Da mesma forma, na segunda instrução `SELECT`, a coluna `j` é nomeada na cláusula `USING` e deve aparecer apenas uma vez no resultado, não duas vezes.

  Assim, as declarações produzem este resultado:

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

  A eliminação de colunas redundantes e a ordenação de colunas ocorrem de acordo com o SQL padrão, produzindo este ordem de exibição:

  - Primeiro, colete as colunas comuns das duas tabelas unidas, na ordem em que elas ocorrem na primeira tabela.

  - Em segundo lugar, as colunas exclusivas da primeira tabela, na ordem em que ocorrem nessa tabela

  - Terceiro, colunas exclusivas da segunda tabela, na ordem em que ocorrem nessa tabela

  A coluna de resultado única que substitui duas colunas comuns é definida usando a operação coalesce. Ou seja, para dois `t1.a` e `t2.a`, a coluna de junção única resultante `a` é definida como `a = COALESCE(t1.a, t2.a)`, onde:

  ```sql
  COALESCE(x, y) = (CASE WHEN x IS NOT NULL THEN x ELSE y END)
  ```

  Se a operação de junção for qualquer outra junção, as colunas do resultado da junção consistem na concatenação de todas as colunas das tabelas unidas.

  Uma consequência da definição de colunas coalescidas é que, para junções externas, a coluna coalescida contém o valor da coluna não `NULL` se uma das duas colunas for sempre `NULL`. Se nenhuma ou ambas as colunas forem `NULL`, ambas as colunas comuns terão o mesmo valor, então não importa qual delas seja escolhida como o valor da coluna coalescida. Uma maneira simples de interpretar isso é considerar que uma coluna coalescida de uma junção externa é representada pela coluna comum da tabela interna de uma `JOIN`. Suponha que as tabelas `t1(a, b)` e `t2(a, c)` tenham os seguintes conteúdos:

  ```sql
  t1    t2
  ----  ----
  1 x   2 z
  2 y   3 w
  ```

  Então, para essa junção, a coluna `a` contém os valores de `t1.a`:

  ```sql
  mysql> SELECT * FROM t1 NATURAL LEFT JOIN t2;
  +------+------+------+
  | a    | b    | c    |
  +------+------+------+
  |    1 | x    | NULL |
  |    2 | y    | z    |
  +------+------+------+
  ```

  Em contraste, para esta junção, a coluna `a` contém os valores de `t2.a`.

  ```sql
  mysql> SELECT * FROM t1 NATURAL RIGHT JOIN t2;
  +------+------+------+
  | a    | c    | b    |
  +------+------+------+
  |    2 | z    | y    |
  |    3 | w    | NULL |
  +------+------+------+
  ```

  Compare esses resultados com as consultas equivalentes, mas diferentes, com `JOIN ... ON`:

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

- Uma cláusula `USING` pode ser reescrita como uma cláusula `ON` que compara colunas correspondentes. No entanto, embora `USING` e `ON` sejam semelhantes, não são exatamente a mesma coisa. Considere as seguintes duas consultas:

  ```sql
  a LEFT JOIN b USING (c1, c2, c3)
  a LEFT JOIN b ON a.c1 = b.c1 AND a.c2 = b.c2 AND a.c3 = b.c3
  ```

  Em relação à determinação de quais linhas satisfazem a condição de junção, ambas as junções são semanticamente idênticas.

  Em relação à determinação das colunas a serem exibidas para a expansão `SELECT *`, os dois junções não são semanticamente idênticas. A junção `USING` seleciona o valor coalescido das colunas correspondentes, enquanto a junção `ON` seleciona todas as colunas de todas as tabelas. Para a junção `USING`, `SELECT *` seleciona esses valores:

  ```sql
  COALESCE(a.c1, b.c1), COALESCE(a.c2, b.c2), COALESCE(a.c3, b.c3)
  ```

  Para a junção `ON`, `SELECT *` seleciona esses valores:

  ```sql
  a.c1, a.c2, a.c3, b.c1, b.c2, b.c3
  ```

  Com uma junção interna, `COALESCE(a.c1, b.c1)` é o mesmo que `a.c1` ou `b.c1`, pois ambas as colunas têm o mesmo valor. Com uma junção externa (como `LEFT JOIN`), uma das duas colunas pode ser `NULL`. Essa coluna é omitida do resultado.

- Uma cláusula `ON` pode se referir apenas aos seus operandos.

  Exemplo:

  ```sql
  CREATE TABLE t1 (i1 INT);
  CREATE TABLE t2 (i2 INT);
  CREATE TABLE t3 (i3 INT);
  SELECT * FROM t1 JOIN t2 ON (i1 = i3) JOIN t3;
  ```

  A declaração falha com um erro de `Coluna desconhecida 'i3' na cláusula ON` porque `i3` é uma coluna em `t3`, que não é um operando da cláusula `ON`. Para permitir que a junção seja processada, reescreva a declaração da seguinte forma:

  ```sql
  SELECT * FROM t1 JOIN t2 JOIN t3 ON (i1 = i3);
  ```

- O operador `JOIN` tem precedência maior que o operador vírgula (`,`), então a expressão `JOIN` `t1, t2 JOIN t3` é interpretada como `(t1, (t2 JOIN t3))`, e não como `((t1, t2) JOIN t3)`. Isso afeta as declarações que usam uma cláusula `ON` porque essa cláusula pode se referir apenas a colunas nos operandos do `JOIN`, e a precedência afeta a interpretação do que esses operandos são.

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

  O operador `JOIN` tem precedência sobre o operador vírgula, então os operandos para a cláusula `ON` são `t2` e `t3`. Como `t1.i1` não é uma coluna em nenhum dos operandos, o resultado é um erro `Coluna desconhecida 't1.i1' na cláusula `ON'\`.

  Para permitir que a junção seja processada, use uma das seguintes estratégias:

  - Agrupe as duas primeiras tabelas explicitamente entre parênteses para que os operandos para a cláusula `ON` sejam `(t1, t2)` e `t3`:

    ```sql
    SELECT * FROM (t1, t2) JOIN t3 ON (t1.i1 = t3.i3);
    ```

  - Evite o uso do operador de vírgula e use `JOIN` em vez disso:

    ```sql
    SELECT * FROM t1 JOIN t2 JOIN t3 ON (t1.i1 = t3.i3);
    ```

  A mesma interpretação de precedência também se aplica a declarações que misturam o operador de vírgula com `INNER JOIN`, `CROSS JOIN`, `LEFT JOIN` e `RIGHT JOIN`, todos os quais têm precedência maior que o operador de vírgula.

- Uma diferença entre uma extensão MySQL e o padrão SQL:2003 é que o MySQL permite que você qualifique as colunas comuns (coalescidas) das junções `NATURAL` ou `USING`, enquanto o padrão não permite isso.
