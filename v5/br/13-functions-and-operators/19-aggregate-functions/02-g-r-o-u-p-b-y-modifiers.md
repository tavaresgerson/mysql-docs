### 12.19.2 GROUP BY Modificadores

A cláusula `GROUP BY` permite um modificador `WITH ROLLUP` que faz com que a saída resumida inclua linhas extras que representam operações resumidas de nível superior (ou seja, super-agregados). O `ROLLUP` permite, assim, responder a perguntas em vários níveis de análise com uma única consulta. Por exemplo, o `ROLLUP` pode ser usado para fornecer suporte para operações OLAP (Processamento Analítico Online).

Suponha que uma tabela `vendas` tenha as colunas `ano`, `país`, `produto` e `lucro` para registrar a rentabilidade das vendas:

```sql
CREATE TABLE sales
(
    year    INT,
    country VARCHAR(20),
    product VARCHAR(32),
    profit  INT
);
```

Para resumir o conteúdo da tabela por ano, use um simples `GROUP BY` assim:

```sql
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

A saída mostra o lucro total (agregado) para cada ano. Para determinar também o lucro total somado ao longo de todos os anos, você deve somar os valores individuais manualmente ou executar uma consulta adicional. Ou você pode usar `ROLLUP`, que fornece ambos os níveis de análise com uma única consulta. Adicionar o modificador `WITH ROLLUP` à cláusula `GROUP BY` faz com que a consulta produza outra linha (super-agregada) que mostra o total geral sobre todos os valores do ano:

```sql
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

O valor `NULL` na coluna `ano` identifica a linha de superagregado do total geral.

O `ROLLUP` tem um efeito mais complexo quando há várias colunas `GROUP BY`. Nesse caso, toda vez que houver uma mudança no valor em qualquer coluna de agrupamento, exceto na última, a consulta produz uma linha de resumo de superagregado extra.

Por exemplo, sem o `ROLLUP`, um resumo da tabela `sales` baseado em `year`, `country` e `product` pode parecer assim, onde a saída indica valores resumidos apenas no nível de análise ano/país/produto:

```sql
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

```sql
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

- Após cada conjunto de linhas de produtos para um determinado ano e país, uma linha de resumo superagregado extra aparece, mostrando o total para todos os produtos. Essas linhas têm a coluna `product` definida como `NULL`.

- Após cada conjunto de linhas para um determinado ano, uma linha de resumo superagregado extra aparece, mostrando o total para todos os países e produtos. Essas linhas têm as colunas `country` e `products` definidas como `NULL`.

- Por fim, após todas as outras linhas, uma linha de resumo superagregado extra aparece, mostrando o total geral para todos os anos, países e produtos. Essa linha tem as colunas `ano`, `país` e `produtos` definidas como `NULL`.

Os indicadores `NULL` em cada linha do superagregado são gerados quando a linha é enviada ao cliente. O servidor analisa as colunas nomeadas na cláusula `GROUP BY` a partir da coluna mais à esquerda que teve seu valor alterado. Para qualquer coluna no conjunto de resultados com um nome que corresponda a qualquer um desses nomes, seu valor é definido como `NULL`. (Se você especificar a agregação de colunas por posição da coluna, o servidor identifica quais colunas devem ser definidas como `NULL` por posição.)

Como os valores `NULL` nas linhas do superagregado são inseridos no conjunto de resultados em uma etapa muito tardia do processamento da consulta, você pode testá-los como valores `NULL` apenas na lista de seleção ou na cláusula `HAVING`. Você não pode testá-los como valores `NULL` nas condições de junção ou na cláusula `WHERE` para determinar quais linhas selecionar. Por exemplo, você não pode adicionar `WHERE product IS NULL` à consulta para eliminar, da saída, todas as linhas exceto as do superagregado.

Os valores `NULL` aparecem como `NULL` no lado do cliente e podem ser testados como tal usando qualquer interface de programação de cliente MySQL. No entanto, neste momento, você não pode distinguir se um `NULL` representa um valor agrupado regular ou um valor super-agregado. No MySQL 8.0, você pode usar a função `GROUPING()` para testar a distinção.

#### Outras considerações ao usar o ROLLUP

A discussão a seguir lista alguns comportamentos específicos da implementação do `ROLLUP` no MySQL.

Quando você usa `ROLLUP`, não pode também usar uma cláusula `ORDER BY` para ordenar os resultados. Em outras palavras, `ROLLUP` e `ORDER BY` são mutuamente exclusivos no MySQL. No entanto, você ainda tem algum controle sobre a ordem de classificação. Para contornar a restrição que impede o uso de `ROLLUP` com `ORDER BY` e alcançar uma ordem de classificação específica dos resultados agrupados, gere o conjunto de resultados agrupados como uma tabela derivada e aplique `ORDER BY` a ele. Por exemplo:

```sql
mysql> SELECT * FROM
         (SELECT year, SUM(profit) AS profit
         FROM sales GROUP BY year WITH ROLLUP) AS dt
       ORDER BY year DESC;
+------+--------+
| year | profit |
+------+--------+
| 2001 |   3010 |
| 2000 |   4525 |
| NULL |   7535 |
+------+--------+
```

Nesse caso, as linhas de resumo do superagregado são ordenadas junto às linhas das quais são calculadas, e seu posicionamento depende da ordem de classificação (no início para classificação ascendente, no final para classificação descendente).

O `LIMIT` pode ser usado para restringir o número de linhas devolvidas ao cliente. O `LIMIT` é aplicado após o `ROLLUP`, então o limite se aplica às linhas extras adicionadas pelo `ROLLUP`. Por exemplo:

```sql
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
```

O uso de `LIMIT` com `ROLLUP` pode produzir resultados mais difíceis de interpretar, pois há menos contexto para entender as linhas de superagregado.

Uma extensão do MySQL permite que uma coluna que não aparece na lista `GROUP BY` seja nomeada na lista `SELECT`. (Para informações sobre colunas não agregadas e `GROUP BY`, consulte a Seção 12.19.3, “Tratamento do MySQL do GROUP BY”.) Neste caso, o servidor tem a liberdade de escolher qualquer valor desta coluna não agregada em linhas resumidas, e isso inclui as linhas extras adicionadas por `WITH ROLLUP`. Por exemplo, na seguinte consulta, `country` é uma coluna não agregada que não aparece na lista `GROUP BY` e os valores escolhidos para esta coluna são não determinísticos:

```sql
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
```

Esse comportamento é permitido quando o modo SQL `ONLY_FULL_GROUP_BY` não está habilitado. Se esse modo estiver habilitado, o servidor rejeitará a consulta como ilegal porque o `country` não está listado na cláusula `GROUP BY`. Com `ONLY_FULL_GROUP_BY` habilitado, você ainda pode executar a consulta usando a função `ANY_VALUE()` para colunas de valor não determinado:

```sql
mysql> SELECT year, ANY_VALUE(country) AS country, SUM(profit) AS profit
       FROM sales
       GROUP BY year WITH ROLLUP;
+------+---------+--------+
| year | country | profit |
+------+---------+--------+
| 2000 | India   |   4525 |
| 2001 | USA     |   3010 |
| NULL | USA     |   7535 |
+------+---------+--------+
```
