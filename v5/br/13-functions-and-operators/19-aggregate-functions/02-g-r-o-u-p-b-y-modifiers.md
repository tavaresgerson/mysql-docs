### 12.19.2 Modificadores GROUP BY

A cláusula `GROUP BY` permite o modificador `WITH ROLLUP`, que faz com que a saída de resumo inclua linhas extras que representam operações de resumo de nível superior (ou seja, super-agregadas). O `ROLLUP` permite, assim, responder a questões em múltiplos níveis de análise com uma única Query. Por exemplo, o `ROLLUP` pode ser usado para dar suporte a operações OLAP (Online Analytical Processing).

Suponha que uma tabela `sales` tenha colunas `year`, `country`, `product` e `profit` para registrar a lucratividade das vendas:

```sql
CREATE TABLE sales
(
    year    INT,
    country VARCHAR(20),
    product VARCHAR(32),
    profit  INT
);
```

Para resumir o conteúdo da tabela por ano, use um `GROUP BY` simples como este:

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

A saída mostra o lucro total (agregado) para cada ano. Para determinar também o lucro total somado ao longo de todos os anos, você deve somar os valores individuais ou executar uma Query adicional. Alternativamente, você pode usar o `ROLLUP`, que fornece ambos os níveis de análise com uma única Query. Adicionar um modificador `WITH ROLLUP` à cláusula `GROUP BY` faz com que a Query produza outra linha (super-agregada) que mostra o total geral em todos os valores de ano:

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

O valor `NULL` na coluna `year` identifica a linha super-agregada do total geral.

O `ROLLUP` tem um efeito mais complexo quando há múltiplas colunas no `GROUP BY`. Neste caso, sempre que houver uma alteração de valor em qualquer coluna de agrupamento, exceto a última, a Query produz uma linha de resumo super-agregada extra.

Por exemplo, sem o `ROLLUP`, um resumo da tabela `sales` baseado em `year`, `country` e `product` pode se parecer com isto, onde a saída indica valores de resumo apenas no nível de análise year/country/product:

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

Com o `ROLLUP` adicionado, a Query produz várias linhas extras:

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

Agora a saída inclui informações de resumo em quatro níveis de análise, e não apenas um:

*   Após cada conjunto de linhas de product para um determinado year e country, aparece uma linha de resumo super-agregada extra mostrando o total para todos os products. Nessas linhas, a coluna `product` é definida como `NULL`.

*   Após cada conjunto de linhas para um determinado year, aparece uma linha de resumo super-agregada extra mostrando o total para todos os countries e products. Nessas linhas, as colunas `country` e `products` são definidas como `NULL`.

*   Finalmente, após todas as outras linhas, aparece uma linha de resumo super-agregada extra mostrando o total geral para todos os years, countries e products. Nessa linha, as colunas `year`, `country` e `products` são definidas como `NULL`.

Os indicadores `NULL` em cada linha super-agregada são produzidos quando a linha é enviada ao cliente. O servidor analisa as colunas nomeadas na cláusula `GROUP BY` após a coluna mais à esquerda que teve seu valor alterado. Para qualquer coluna no result set (conjunto de resultados) com um nome que corresponda a um desses nomes, seu valor é definido como `NULL`. (Se você especificar as colunas de agrupamento pela posição da coluna, o servidor identifica quais colunas definir como `NULL` pela posição.)

Como os valores `NULL` nas linhas super-agregadas são inseridos no result set em um estágio tão tardio do processamento da Query, você pode testá-los como valores `NULL` apenas na lista de seleção (select list) ou na cláusula `HAVING`. Você não pode testá-los como valores `NULL` em condições de JOIN ou na cláusula `WHERE` para determinar quais linhas selecionar. Por exemplo, você não pode adicionar `WHERE product IS NULL` à Query para eliminar da saída todas as linhas, exceto as super-agregadas.

Os valores `NULL` aparecem como `NULL` no lado do cliente e podem ser testados como tal usando qualquer interface de programação de cliente MySQL. No entanto, neste ponto, você não consegue distinguir se um `NULL` representa um valor agrupado regular ou um valor super-agregado. No MySQL 8.0, você pode usar a função `GROUPING()` para testar essa distinção.

#### Outras Considerações ao usar ROLLUP

A discussão a seguir lista alguns comportamentos específicos da implementação do `ROLLUP` no MySQL.

Ao usar `ROLLUP`, você não pode usar uma cláusula `ORDER BY` para ordenar os resultados. Em outras palavras, `ROLLUP` e `ORDER BY` são mutuamente exclusivos no MySQL. No entanto, você ainda tem algum controle sobre a ordem de classificação (sort order). Para contornar a restrição que impede o uso de `ROLLUP` com `ORDER BY` e obter uma ordem de classificação específica dos resultados agrupados, gere o result set agrupado como uma tabela derivada (derived table) e aplique o `ORDER BY` a ela. Por exemplo:

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

Neste caso, as linhas de resumo super-agregadas são classificadas junto com as linhas a partir das quais são calculadas, e seu posicionamento depende da ordem de classificação (no início para classificação ascendente, no final para classificação descendente).

O `LIMIT` pode ser usado para restringir o número de linhas retornadas ao cliente. O `LIMIT` é aplicado após o `ROLLUP`, portanto, o limite se aplica às linhas extras adicionadas pelo `ROLLUP`. Por exemplo:

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

O uso de `LIMIT` com `ROLLUP` pode produzir resultados mais difíceis de interpretar, pois há menos contexto para a compreensão das linhas super-agregadas.

Uma extensão do MySQL permite que uma coluna que não aparece na lista `GROUP BY` seja nomeada na select list. (Para obter informações sobre colunas não agregadas e `GROUP BY`, consulte a Seção 12.19.3, “Tratamento de GROUP BY pelo MySQL”.) Neste caso, o servidor é livre para escolher qualquer valor dessa coluna não agregada nas linhas de resumo, e isso inclui as linhas extras adicionadas por `WITH ROLLUP`. Por exemplo, na seguinte Query, `country` é uma coluna não agregada que não aparece na lista `GROUP BY`, e os valores escolhidos para esta coluna são não determinísticos:

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

Este comportamento é permitido quando o modo SQL `ONLY_FULL_GROUP_BY` não está habilitado. Se esse modo estiver habilitado, o servidor rejeitará a Query como ilegal, pois `country` não está listado na cláusula `GROUP BY`. Com `ONLY_FULL_GROUP_BY` habilitado, você ainda pode executar a Query usando a função `ANY_VALUE()` para colunas com valores não determinísticos:

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
