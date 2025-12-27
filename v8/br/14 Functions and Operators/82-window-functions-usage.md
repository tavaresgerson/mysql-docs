### 14.20.2 Conceitos e Sintaxe de Funções de Janela

Esta seção descreve como usar funções de janela. Os exemplos utilizam o mesmo conjunto de dados de informações de vendas encontrado na discussão da função `GROUPING()` na Seção 14.19.2, “Modificadores GROUP BY”:

```
mysql> SELECT * FROM sales ORDER BY country, year, product;
+------+---------+------------+--------+
| year | country | product    | profit |
+------+---------+------------+--------+
| 2000 | Finland | Computer   |   1500 |
| 2000 | Finland | Phone      |    100 |
| 2001 | Finland | Phone      |     10 |
| 2000 | India   | Calculator |     75 |
| 2000 | India   | Calculator |     75 |
| 2000 | India   | Computer   |   1200 |
| 2000 | USA     | Calculator |     75 |
| 2000 | USA     | Computer   |   1500 |
| 2001 | USA     | Calculator |     50 |
| 2001 | USA     | Computer   |   1500 |
| 2001 | USA     | Computer   |   1200 |
| 2001 | USA     | TV         |    150 |
| 2001 | USA     | TV         |    100 |
+------+---------+------------+--------+
```

Uma função de janela realiza uma operação agregada semelhante a uma operação de agregação em um conjunto de linhas de consulta. No entanto, enquanto uma operação agregada agrupa linhas de consulta em uma única linha de resultado, uma função de janela produz um resultado para cada linha de consulta:

* A linha para a qual a avaliação da função ocorre é chamada de linha atual.
* As linhas de consulta relacionadas à linha atual sobre as quais ocorre a avaliação da função são as janelas para a linha atual.

Por exemplo, usando a tabela de informações de vendas, essas duas consultas realizam operações agregadas que produzem uma soma global única para todas as linhas tomadas como um grupo, e somas agrupadas por país:

```
mysql> SELECT SUM(profit) AS total_profit
       FROM sales;
+--------------+
| total_profit |
+--------------+
|         7535 |
+--------------+
mysql> SELECT country, SUM(profit) AS country_profit
       FROM sales
       GROUP BY country
       ORDER BY country;
+---------+----------------+
| country | country_profit |
+---------+----------------+
| Finland |           1610 |
| India   |           1350 |
| USA     |           4575 |
+---------+----------------+
```

Em contraste, as operações de janela não reduzem grupos de linhas de consulta a uma única linha de saída. Em vez disso, produzem um resultado para cada linha. Como as consultas anteriores, a seguinte consulta usa `SUM()`, mas desta vez como uma função de janela:

```
mysql> SELECT
         year, country, product, profit,
         SUM(profit) OVER() AS total_profit,
         SUM(profit) OVER(PARTITION BY country) AS country_profit
       FROM sales
       ORDER BY country, year, product, profit;
+------+---------+------------+--------+--------------+----------------+
| year | country | product    | profit | total_profit | country_profit |
+------+---------+------------+--------+--------------+----------------+
| 2000 | Finland | Computer   |   1500 |         7535 |           1610 |
| 2000 | Finland | Phone      |    100 |         7535 |           1610 |
| 2001 | Finland | Phone      |     10 |         7535 |           1610 |
| 2000 | India   | Calculator |     75 |         7535 |           1350 |
| 2000 | India   | Calculator |     75 |         7535 |           1350 |
| 2000 | India   | Computer   |   1200 |         7535 |           1350 |
| 2000 | USA     | Calculator |     75 |         7535 |           4575 |
| 2000 | USA     | Computer   |   1500 |         7535 |           4575 |
| 2001 | USA     | Calculator |     50 |         7535 |           4575 |
| 2001 | USA     | Computer   |   1200 |         7535 |           4575 |
| 2001 | USA     | Computer   |   1500 |         7535 |           4575 |
| 2001 | USA     | TV         |    100 |         7535 |           4575 |
| 2001 | USA     | TV         |    150 |         7535 |           4575 |
+------+---------+------------+--------+--------------+----------------+
```

Cada operação de janela na consulta é indicada pela inclusão de uma cláusula `OVER` que especifica como particionar as linhas de consulta em grupos para processamento pela função de janela:

* A primeira cláusula `OVER` é vazia, o que trata todo o conjunto de linhas de consulta como uma única partição. A função de janela, portanto, produz uma soma global, mas faz isso para cada linha.
* A segunda cláusula `OVER` particiona as linhas por país, produzindo uma soma por partição (por país). A função produz essa soma para cada linha da partição.

As funções de janela são permitidas apenas na lista de seleção e na cláusula `ORDER BY`. As linhas de resultado da consulta são determinadas a partir da cláusula `FROM`, após o processamento de `WHERE`, `GROUP BY` e `HAVING`, e a execução da janela ocorre antes de `ORDER BY`, `LIMIT` e `SELECT DISTINCT`.

A cláusula `OVER` é permitida para muitas funções agregadas, que podem, portanto, ser usadas como funções de janela ou não de janela, dependendo se a cláusula `OVER` está presente ou ausente:

```
AVG()
BIT_AND()
BIT_OR()
BIT_XOR()
COUNT()
JSON_ARRAYAGG()
JSON_OBJECTAGG()
MAX()
MIN()
STDDEV_POP(), STDDEV(), STD()
STDDEV_SAMP()
SUM()
VAR_POP(), VARIANCE()
VAR_SAMP()
```

Para detalhes sobre cada função agregada, consulte a Seção 14.19.1, “Descrição das Funções Agregadas”.

O MySQL também suporta funções não agregadas que são usadas apenas como funções de janela. Para essas, a cláusula `OVER` é obrigatória:

```
CUME_DIST()
DENSE_RANK()
FIRST_VALUE()
LAG()
LAST_VALUE()
LEAD()
NTH_VALUE()
NTILE()
PERCENT_RANK()
RANK()
ROW_NUMBER()
```

Para detalhes sobre cada função não agregada, consulte a Seção 14.20.1, “Descrição das Funções de Janela”.

Como exemplo de uma dessas funções não agregadas de janela, esta consulta usa `ROW_NUMBER()`, que produz o número da linha de cada linha dentro de sua partição. Neste caso, as linhas são numeradas por país. Por padrão, as linhas da partição são não ordenadas e a numeração de linhas é não determinística. Para ordenar as linhas da partição, inclua uma cláusula `ORDER BY` dentro da definição da janela. A consulta usa partições não ordenadas e ordenadas (as colunas `row_num1` e `row_num2`) para ilustrar a diferença entre omitir e incluir `ORDER BY`:

```
mysql> SELECT
         year, country, product, profit,
         ROW_NUMBER() OVER(PARTITION BY country) AS row_num1,
         ROW_NUMBER() OVER(PARTITION BY country ORDER BY year, product) AS row_num2
       FROM sales;
+------+---------+------------+--------+----------+----------+
| year | country | product    | profit | row_num1 | row_num2 |
+------+---------+------------+--------+----------+----------+
| 2000 | Finland | Computer   |   1500 |        2 |        1 |
| 2000 | Finland | Phone      |    100 |        1 |        2 |
| 2001 | Finland | Phone      |     10 |        3 |        3 |
| 2000 | India   | Calculator |     75 |        2 |        1 |
| 2000 | India   | Calculator |     75 |        3 |        2 |
| 2000 | India   | Computer   |   1200 |        1 |        3 |
| 2000 | USA     | Calculator |     75 |        5 |        1 |
| 2000 | USA     | Computer   |   1500 |        4 |        2 |
| 2001 | USA     | Calculator |     50 |        2 |        3 |
| 2001 | USA     | Computer   |   1500 |        3 |        4 |
| 2001 | USA     | Computer   |   1200 |        7 |        5 |
| 2001 | USA     | TV         |    150 |        1 |        6 |
| 2001 | USA     | TV         |    100 |        6 |        7 |
+------+---------+------------+--------+----------+----------+
```

Como mencionado anteriormente, para usar uma função de janela (ou tratar uma função agregada como uma função de janela), inclua uma cláusula `OVER` após a chamada da função. A cláusula `OVER` tem duas formas:

```
over_clause:
    {OVER (window_spec) | OVER window_name}
```

Ambas as formas definem como a função de janela deve processar as linhas da consulta. Elas diferem em se a janela é definida diretamente na cláusula `OVER`, ou fornecida por uma referência a uma janela nomeada definida em outro lugar na consulta:

* No primeiro caso, a especificação da janela aparece diretamente na cláusula `OVER`, entre os parênteses.
* No segundo caso, *`window_name`* é o nome para uma especificação de janela definida por uma cláusula `WINDOW` em outro lugar na consulta. Para detalhes, consulte a Seção 14.20.4, “Janelas Nomeadas”.

Para a sintaxe `OVER (window_spec)`, a especificação da janela tem várias partes, todas opcionais:

```
window_spec:
    [window_name] [partition_clause] [order_clause] [frame_clause]
```

Se `OVER()` estiver vazio, a janela consistirá em todas as linhas da consulta e a função de janela calculará um resultado usando todas as linhas. Caso contrário, as cláusulas presentes entre parênteses determinam quais linhas da consulta serão usadas para calcular o resultado da função e como elas serão particionadas e ordenadas:

* *`window_name`*: O nome de uma janela definido por uma cláusula `WINDOW` em outro lugar na consulta. Se *`window_name`* aparecer sozinho dentro da cláusula `OVER`, ele define completamente a janela. Se cláusulas de particionamento, ordenamento ou enquadramento também forem fornecidas, elas modificam a interpretação da janela nomeada. Para detalhes, consulte a Seção 14.20.4, “Janelas Nomeadas”.
* *`partition_clause`*: Uma cláusula `PARTITION BY` indica como dividir as linhas da consulta em grupos. O resultado da função de janela para uma linha dada é baseado nas linhas da partição que contém a linha. Se `PARTITION BY` for omitido, há uma única partição consistindo de todas as linhas da consulta.

  ::: info Nota

  A particionamento para funções de janela difere do particionamento de tabelas. Para informações sobre particionamento de tabelas, consulte o Capítulo 26, *Particionamento*.

  :::

  *`partition_clause`* tem esta sintaxe:

  ```
  partition_clause:
      PARTITION BY expr [, expr] ...
  ```

  O SQL padrão exige que `PARTITION BY` seja seguido apenas por nomes de colunas. Uma extensão do MySQL permite expressões, não apenas nomes de colunas. Por exemplo, se uma tabela contém uma coluna `TIMESTAMP` chamada `ts`, o SQL padrão permite `PARTITION BY ts`, mas não `PARTITION BY HOUR(ts)`, enquanto o MySQL permite ambos.
* *`order_clause`*: Uma cláusula `ORDER BY` indica como ordenar as linhas em cada partição. As linhas da partição que são iguais de acordo com a cláusula `ORDER BY` são consideradas iguais. Se `ORDER BY` for omitido, as linhas da partição não serão ordenadas, sem ordem de processamento implícita, e todas as linhas da partição são iguais.

  *`order_clause`* tem esta sintaxe:

  ```
  order_clause:
      ORDER BY expr [ASC|DESC] [, expr [ASC|DESC]] ...
  ```

Cada expressão `ORDER BY` pode ser opcionalmente seguida por `ASC` ou `DESC` para indicar a direção de ordenação. O padrão é `ASC` se nenhuma direção for especificada. Valores `NULL` são ordenados primeiro em ordenações ascendentes, e por último em ordenações descendentes.

Uma `ORDER BY` em uma definição de janela é aplicada dentro de partições individuais. Para ordenar o conjunto de resultados como um todo, inclua uma `ORDER BY` no nível superior da consulta.
* *`frame_clause`*: Uma frame é um subconjunto da partição atual e a cláusula frame especifica como definir o subconjunto. A cláusula frame tem muitas subcláusulas próprias. Para detalhes, consulte a Seção 14.20.3, “Especificação de Frame de Função de Janela”.