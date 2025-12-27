### 14.19.2 Modificadores de GROUP BY

A cláusula `GROUP BY` permite um modificador `WITH ROLLUP` que faz com que a saída resumida inclua linhas extras que representam operações de resumo de nível superior (ou seja, superagregados). O `ROLLUP` permite, assim, responder a perguntas em vários níveis de análise com uma única consulta. Por exemplo, o `ROLLUP` pode ser usado para fornecer suporte para operações de processamento analítico online (OLAP).

Suponha que uma tabela `sales` tenha as colunas `year`, `country`, `product` e `profit` para registrar a rentabilidade das vendas:

```
CREATE TABLE sales
(
    year    INT,
    country VARCHAR(20),
    product VARCHAR(32),
    profit  INT
);
```

Para resumir o conteúdo da tabela por ano, use um `GROUP BY` simples assim:

```
mysql> SELECT year, SUM(profit) AS profit
       FROM sales
       GROUP BY year;
+------+--------+
| year | profit |
+------+--------+
| 2000 |   4525 |
| 2001 |   3010 |
+------+--------+
```

A saída mostra o lucro total (agregado) para cada ano. Para determinar também o lucro total somado por todos os anos, você deve somar os valores individuais manualmente ou executar uma consulta adicional. Ou você pode usar `ROLLUP`, que fornece ambos os níveis de análise com uma única consulta. Adicionar um modificador `WITH ROLLUP` à cláusula `GROUP BY` faz com que a consulta produza outra linha (superagregado) que mostra o total geral de todos os valores de ano:

```
mysql> SELECT year, SUM(profit) AS profit
       FROM sales
       GROUP BY year WITH ROLLUP;
+------+--------+
| year | profit |
+------+--------+
| 2000 |   4525 |
| 2001 |   3010 |
| NULL |   7535 |
+------+--------+
```

O valor `NULL` na coluna `year` identifica a linha superagregado do total geral.

O MySQL suporta uma sintaxe alternativa adicional para este modificador, conforme mostrado na Seção 15.2.13, “Instrução SELECT”. Usando a sintaxe alternativa, a consulta anterior pode ser realizada como mostrado aqui:

```
mysql> SELECT year, SUM(profit) AS profit
       FROM sales
       GROUP BY ROLLUP (year);
+------+--------+
| year | profit |
+------+--------+
| 2000 |   4525 |
| 2001 |   3010 |
| NULL |   7535 |
+------+--------+
```

O `ROLLUP` tem um efeito mais complexo quando há várias colunas `GROUP BY`. Neste caso, cada vez que há uma mudança de valor em qualquer coluna de agrupamento, exceto na última coluna de agrupamento, a consulta produz uma linha de resumo superagregado extra.

Por exemplo, sem o `ROLLUP`, um resumo da tabela `sales` baseado em `year`, `country` e `product` poderia parecer assim, onde a saída indica valores resumidos apenas no nível de análise de ano/país/produto:

```
mysql> SELECT year, country, product, SUM(profit) AS profit
       FROM sales
       GROUP BY year, country, product;
+------+---------+------------+--------+
| year | country | product    | profit |
+------+---------+------------+--------+
| 2000 | Finland | Computer   |   1500 |
| 2000 | Finland | Phone      |    100 |
| 2000 | India   | Calculator |    150 |
| 2000 | India   | Computer   |   1200 |
| 2000 | USA     | Calculator |     75 |
| 2000 | USA     | Computer   |   1500 |
| 2001 | Finland | Phone      |     10 |
| 2001 | USA     | Calculator |     50 |
| 2001 | USA     | Computer   |   2700 |
| 2001 | USA     | TV         |    250 |
+------+---------+------------+--------+
```

Com o `ROLLUP` adicionado, a consulta produz várias linhas extras:

```
mysql> SELECT year, country, product, SUM(profit) AS profit
       FROM sales
       GROUP BY year, country, product WITH ROLLUP;
+------+---------+------------+--------+
| year | country | product    | profit |
+------+---------+------------+--------+
| 2000 | Finland | Computer   |   1500 |
| 2000 | Finland | Phone      |    100 |
| 2000 | Finland | NULL       |   1600 |
| 2000 | India   | Calculator |    150 |
| 2000 | India   | Computer   |   1200 |
| 2000 | India   | NULL       |   1350 |
| 2000 | USA     | Calculator |     75 |
| 2000 | USA     | Computer   |   1500 |
| 2000 | USA     | NULL       |   1575 |
| 2000 | NULL    | NULL       |   4525 |
| 2001 | Finland | Phone      |     10 |
| 2001 | Finland | NULL       |     10 |
| 2001 | USA     | Calculator |     50 |
| 2001 | USA     | Computer   |   2700 |
| 2001 | USA     | TV         |    250 |
| 2001 | USA     | NULL       |   3000 |
| 2001 | NULL    | NULL       |   3010 |
| NULL | NULL    | NULL       |   7535 |
+------+---------+------------+--------+
```

Agora, a saída inclui informações resumidas em quatro níveis de análise, e não apenas em um:

* Após cada conjunto de linhas de produto para um determinado ano e país, uma linha de resumo super-agregado extra aparece, mostrando o total para todos os produtos. Essas linhas têm a coluna `product` definida como `NULL`.

* Após cada conjunto de linhas para um determinado ano, uma linha de resumo super-agregado extra aparece, mostrando o total para todos os países e produtos. Essas linhas têm as colunas `country` e `products` definidas como `NULL`.

* Finalmente, após todas as outras linhas, uma linha de resumo super-agregado extra aparece, mostrando o total geral para todos os anos, países e produtos. Essa linha tem as colunas `year`, `country` e `products` definidas como `NULL`.

Os indicadores `NULL` em cada linha super-agregado são produzidos quando a linha é enviada ao cliente. O servidor analisa as colunas nomeadas na cláusula `GROUP BY` após a coluna mais à esquerda que teve seu valor alterado. Para qualquer coluna no conjunto de resultados com um nome que corresponda a qualquer um desses nomes, seu valor é definido como `NULL`. (Se você especificar colunas de agrupamento por posição da coluna, o servidor identifica quais colunas devem ser definidas como `NULL` por posição.)

Como os valores `NULL` nas linhas de superagregado são inseridos no conjunto de resultados em uma etapa tão tardia no processamento da consulta, você pode testá-los como valores `NULL` apenas na lista de seleção ou na cláusula `HAVING`. Você não pode testá-los como valores `NULL` em condições de junção ou na cláusula `WHERE` para determinar quais linhas selecionar. Por exemplo, você não pode adicionar `WHERE product IS NULL` à consulta para eliminar, na saída, todas as linhas de superagregado.

Os valores `NULL` aparecem como `NULL` no lado do cliente e podem ser testados como tais usando qualquer interface de programação de cliente MySQL. No entanto, neste ponto, você não pode distinguir se um `NULL` representa um valor agrupado regular ou um valor de superagregado. Para testar a distinção, use a função `GROUPING()`, descrita mais adiante.

Para consultas `GROUP BY ... WITH ROLLUP`, para testar se os valores `NULL` no resultado representam valores de superagregado, a função `GROUPING()` está disponível para uso na lista de seleção, na cláusula `HAVING` e na cláusula `ORDER BY`. Por exemplo, `GROUPING(year)` retorna 1 quando `NULL` na coluna `year` ocorre em uma linha de superagregado, e 0 caso contrário. Da mesma forma, `GROUPING(country)` e `GROUPING(product)` retornam 1 para valores `NULL` de superagregado nas colunas `country` e `product`, respectivamente:

```
mysql> SELECT
         year, country, product, SUM(profit) AS profit,
         GROUPING(year) AS grp_year,
         GROUPING(country) AS grp_country,
         GROUPING(product) AS grp_product
       FROM sales
       GROUP BY year, country, product WITH ROLLUP;
+------+---------+------------+--------+----------+-------------+-------------+
| year | country | product    | profit | grp_year | grp_country | grp_product |
+------+---------+------------+--------+----------+-------------+-------------+
| 2000 | Finland | Computer   |   1500 |        0 |           0 |           0 |
| 2000 | Finland | Phone      |    100 |        0 |           0 |           0 |
| 2000 | Finland | NULL       |   1600 |        0 |           0 |           1 |
| 2000 | India   | Calculator |    150 |        0 |           0 |           0 |
| 2000 | India   | Computer   |   1200 |        0 |           0 |           0 |
| 2000 | India   | NULL       |   1350 |        0 |           0 |           1 |
| 2000 | USA     | Calculator |     75 |        0 |           0 |           0 |
| 2000 | USA     | Computer   |   1500 |        0 |           0 |           0 |
| 2000 | USA     | NULL       |   1575 |        0 |           0 |           1 |
| 2000 | NULL    | NULL       |   4525 |        0 |           1 |           1 |
| 2001 | Finland | Phone      |     10 |        0 |           0 |           0 |
| 2001 | Finland | NULL       |     10 |        0 |           0 |           1 |
| 2001 | USA     | Calculator |     50 |        0 |           0 |           0 |
| 2001 | USA     | Computer   |   2700 |        0 |           0 |           0 |
| 2001 | USA     | TV         |    250 |        0 |           0 |           0 |
| 2001 | USA     | NULL       |   3000 |        0 |           0 |           1 |
| 2001 | NULL    | NULL       |   3010 |        0 |           1 |           1 |
| NULL | NULL    | NULL       |   7535 |        1 |           1 |           1 |
+------+---------+------------+--------+----------+-------------+-------------+
```

Usando a sintaxe alternativa mencionada anteriormente, essa consulta pode ser reescrita da seguinte forma:

```
SELECT
    year, country, product, SUM(profit) AS profit,
    GROUPING(year) AS grp_year,
    GROUPING(country) AS grp_country,
    GROUPING(product) AS grp_product
FROM sales
GROUP BY ROLLUP (year, country, product);
```

Em vez de exibir os resultados da `GROUPING()` diretamente, você pode usar `GROUPING()` para substituir rótulos por valores `NULL` de superagregado:

```
mysql> SELECT
         IF(GROUPING(year), 'All years', year) AS year,
         IF(GROUPING(country), 'All countries', country) AS country,
         IF(GROUPING(product), 'All products', product) AS product,
         SUM(profit) AS profit
       FROM sales
       GROUP BY year, country, product WITH ROLLUP;
+-----------+---------------+--------------+--------+
| year      | country       | product      | profit |
+-----------+---------------+--------------+--------+
| 2000      | Finland       | Computer     |   1500 |
| 2000      | Finland       | Phone        |    100 |
| 2000      | Finland       | All products |   1600 |
| 2000      | India         | Calculator   |    150 |
| 2000      | India         | Computer     |   1200 |
| 2000      | India         | All products |   1350 |
| 2000      | USA           | Calculator   |     75 |
| 2000      | USA           | Computer     |   1500 |
| 2000      | USA           | All products |   1575 |
| 2000      | All countries | All products |   4525 |
| 2001      | Finland       | Phone        |     10 |
| 2001      | Finland       | All products |     10 |
| 2001      | USA           | Calculator   |     50 |
| 2001      | USA           | Computer     |   2700 |
| 2001      | USA           | TV           |    250 |
| 2001      | USA           | All products |   3000 |
| 2001      | All countries | All products |   3010 |
| All years | All countries | All products |   7535 |
+-----------+---------------+--------------+--------+
```

Com vários argumentos de expressão, o `GROUPING()` retorna um resultado que representa uma máscara de bits que combina os resultados para cada expressão, com o bit de menor ordem correspondendo ao resultado da expressão mais à direita. Por exemplo, `GROUPING(ano, país, produto)` é avaliado da seguinte forma:

```
  result for GROUPING(product)
+ result for GROUPING(country) << 1
+ result for GROUPING(year) << 2
```

O resultado de tal `GROUPING()` é diferente de zero se alguma das expressões representar um superagregado `NULL`, então você pode retornar apenas as linhas do superagregado e filtrar as linhas agrupadas regulares da seguinte forma:

```
mysql> SELECT year, country, product, SUM(profit) AS profit
       FROM sales
       GROUP BY year, country, product WITH ROLLUP
       HAVING GROUPING(year, country, product) <> 0;
+------+---------+---------+--------+
| year | country | product | profit |
+------+---------+---------+--------+
| 2000 | Finland | NULL    |   1600 |
| 2000 | India   | NULL    |   1350 |
| 2000 | USA     | NULL    |   1575 |
| 2000 | NULL    | NULL    |   4525 |
| 2001 | Finland | NULL    |     10 |
| 2001 | USA     | NULL    |   3000 |
| 2001 | NULL    | NULL    |   3010 |
| NULL | NULL    | NULL    |   7535 |
+------+---------+---------+--------+
```

A tabela `sales` não contém valores `NULL`, então todos os valores `NULL` em um resultado `ROLLUP` representam valores de superagregado. Quando o conjunto de dados contém valores `NULL`, os resumos `ROLLUP` podem conter valores `NULL` não apenas nas linhas de superagregado, mas também nas linhas agrupadas regulares. O `GROUPING()` permite que isso seja distinguido. Suponha que a tabela `t1` contenha um conjunto de dados simples com dois fatores de agrupamento para um conjunto de valores de quantidade, onde `NULL` indica algo como “outro” ou “desconhecido”:

```
mysql> SELECT * FROM t1;
+------+-------+----------+
| name | size  | quantity |
+------+-------+----------+
| ball | small |       10 |
| ball | large |       20 |
| ball | NULL  |        5 |
| hoop | small |       15 |
| hoop | large |        5 |
| hoop | NULL  |        3 |
+------+-------+----------+
```

Uma operação simples `ROLLUP` produz esses resultados, nos quais não é tão fácil distinguir os valores `NULL` nas linhas de superagregado dos valores `NULL` nas linhas agrupadas regulares:

```
mysql> SELECT name, size, SUM(quantity) AS quantity
       FROM t1
       GROUP BY name, size WITH ROLLUP;
+------+-------+----------+
| name | size  | quantity |
+------+-------+----------+
| ball | NULL  |        5 |
| ball | large |       20 |
| ball | small |       10 |
| ball | NULL  |       35 |
| hoop | NULL  |        3 |
| hoop | large |        5 |
| hoop | small |       15 |
| hoop | NULL  |       23 |
| NULL | NULL  |       58 |
+------+-------+----------+
```

Usar `GROUPING()` para substituir rótulos pelos valores `NULL` de superagregado torna o resultado mais fácil de interpretar:

```
mysql> SELECT
         IF(GROUPING(name) = 1, 'All items', name) AS name,
         IF(GROUPING(size) = 1, 'All sizes', size) AS size,
         SUM(quantity) AS quantity
       FROM t1
       GROUP BY name, size WITH ROLLUP;
+-----------+-----------+----------+
| name      | size      | quantity |
+-----------+-----------+----------+
| ball      | NULL      |        5 |
| ball      | large     |       20 |
| ball      | small     |       10 |
| ball      | All sizes |       35 |
| hoop      | NULL      |        3 |
| hoop      | large     |        5 |
| hoop      | small     |       15 |
| hoop      | All sizes |       23 |
| All items | All sizes |       58 |
+-----------+-----------+----------+
```

#### Outras Considerações ao usar ROLLUP

A discussão a seguir lista alguns comportamentos específicos da implementação MySQL de `ROLLUP`.

`ORDER BY` e `ROLLUP` podem ser usados juntos, o que permite o uso de `ORDER BY` e `GROUPING()` para alcançar uma ordem de classificação específica dos resultados agrupados. Por exemplo:

```
mysql> SELECT year, SUM(profit) AS profit
       FROM sales
       GROUP BY year WITH ROLLUP
       ORDER BY GROUPING(year) DESC;
+------+--------+
| year | profit |
+------+--------+
| NULL |   7535 |
| 2000 |   4525 |
| 2001 |   3010 |
+------+--------+
```ICBdRGTGMo```
mysql> SELECT year, country, product, SUM(profit) AS profit
       FROM sales
       GROUP BY year, country, product WITH ROLLUP
       LIMIT 5;
+------+---------+------------+--------+
| year | country | product    | profit |
+------+---------+------------+--------+
| 2000 | Finland | Computer   |   1500 |
| 2000 | Finland | Phone      |    100 |
| 2000 | Finland | NULL       |   1600 |
| 2000 | India   | Calculator |    150 |
| 2000 | India   | Computer   |   1200 |
+------+---------+------------+--------+
```M3GMOME4Dp```
mysql> SELECT year, country, SUM(profit) AS profit
       FROM sales
       GROUP BY year WITH ROLLUP;
+------+---------+--------+
| year | country | profit |
+------+---------+--------+
| 2000 | India   |   4525 |
| 2001 | USA     |   3010 |
| NULL | USA     |   7535 |
+------+---------+--------+
```oPvzjw3nkS```

Uma coluna de rollup não pode ser usada como argumento no `MATCH()` (e é rejeitada com um erro), exceto quando chamada em uma cláusula `WHERE`. Consulte a Seção 14.9, “Funções de Busca de Texto Completo”, para mais informações.