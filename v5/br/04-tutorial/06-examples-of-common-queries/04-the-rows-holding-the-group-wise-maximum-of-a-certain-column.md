### 3.6.4 As Linhas que Armazenam o Máximo por Grupo de uma Cálculo Específica

*Tarefa: Para cada artigo, encontre o revendedor ou revendedores com o preço mais caro.*

Esse problema pode ser resolvido com uma subconsulta como esta:

```sql
SELECT article, dealer, price
FROM   shop s1
WHERE  price=(SELECT MAX(s2.price)
              FROM shop s2
              WHERE s1.article = s2.article)
ORDER BY article;

+---------+--------+-------+
| article | dealer | price |
+---------+--------+-------+
|    0001 | B      |  3.99 |
|    0002 | A      | 10.99 |
|    0003 | C      |  1.69 |
|    0004 | D      | 19.95 |
+---------+--------+-------+
```

O exemplo anterior usa uma subconsulta correlacionada, o que pode ser ineficiente (veja [Seção 13.2.10.7, “Subconsultas Correlacionadas”](correlated-subqueries.html)). Outras possibilidades para resolver o problema são usar uma subconsulta não correlacionada na cláusula `FROM` ou uma `JOINes LEFT`.

Subconsulta não correlacionada:

```sql
SELECT s1.article, dealer, s1.price
FROM shop s1
JOIN (
  SELECT article, MAX(price) AS price
  FROM shop
  GROUP BY article) AS s2
  ON s1.article = s2.article AND s1.price = s2.price
ORDER BY article;
```

`JOIN LEFT`:

```sql
SELECT s1.article, s1.dealer, s1.price
FROM shop s1
LEFT JOIN shop s2 ON s1.article = s2.article AND s1.price < s2.price
WHERE s2.article IS NULL
ORDER BY s1.article;
```

A `JOIN LEFT` funciona com base no princípio de que, quando `s1.price` está no seu valor máximo, não há `s2.price` com um valor maior e, portanto, o valor correspondente de `s2.article` é `NULL`. Veja [Seção 13.2.9.2, “Cláusula JOIN”](join.html).
