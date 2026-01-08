### 3.6.2 A linha que contém o valor máximo de uma determinada coluna

*Tarefa: Encontre o número, o revendedor e o preço do artigo mais caro.*

Isso é facilmente feito com uma subconsulta:

```sql
SELECT article, dealer, price
FROM   shop
WHERE  price=(SELECT MAX(price) FROM shop);

+---------+--------+-------+
| article | dealer | price |
+---------+--------+-------+
|    0004 | D      | 19.95 |
+---------+--------+-------+
```

Outra solução é usar uma `LEFT JOIN`, como mostrado aqui:

```sql
SELECT s1.article, s1.dealer, s1.price
FROM shop s1
LEFT JOIN shop s2 ON s1.price < s2.price
WHERE s2.article IS NULL;
```

Você também pode fazer isso classificando todas as linhas em ordem decrescente por preço e obtendo apenas a primeira linha usando a cláusula `LIMIT` específica do MySQL, assim:

```sql
SELECT article, dealer, price
FROM shop
ORDER BY price DESC
LIMIT 1;
```

::: info Nota
Se houvesse vários artigos mais caros, cada um com um preço de R$ 19,95, a solução `LIMIT` mostraria apenas um deles.
:::
