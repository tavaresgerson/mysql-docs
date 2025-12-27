### 5.6.4 As Linhas que Retêm o Máximo de um Cálculo por Grupo de uma Cálculo Específica

*Tarefa: Para cada artigo, encontre o(s) revendedor(es) com o(s) preço(s) mais caro(s).*

Este problema pode ser resolvido com uma subconsulta como esta:

```
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

O exemplo anterior usa uma subconsulta correlacionada, o que pode ser ineficiente (veja a Seção 15.2.15.7, “Subconsultas Correlacionadas”). Outras possibilidades para resolver o problema são usar uma subconsulta não correlacionada na cláusula `FROM`, uma `JOIN` esquerda ou uma expressão de tabela comum com uma função de janela.

Subconsulta não correlacionada:

```
SELECT s1.article, dealer, s1.price
FROM shop s1
JOIN (
  SELECT article, MAX(price) AS price
  FROM shop
  GROUP BY article) AS s2
  ON s1.article = s2.article AND s1.price = s2.price
ORDER BY article;
```

`JOIN` esquerda:

```
SELECT s1.article, s1.dealer, s1.price
FROM shop s1
LEFT JOIN shop s2 ON s1.article = s2.article AND s1.price < s2.price
WHERE s2.article IS NULL
ORDER BY s1.article;
```

A `JOIN` esquerda funciona com base no fato de que, quando `s1.price` está no seu valor máximo, não há `s2.price` com um valor maior e, portanto, o valor correspondente de `s2.article` é `NULL`. Veja a Seção 15.2.13.2, “Cláusula JOIN”.

Expressão de tabela comum com função de janela:

```
WITH s1 AS (
   SELECT article, dealer, price,
          RANK() OVER (PARTITION BY article
                           ORDER BY price DESC
                      ) AS `Rank`
     FROM shop
)
SELECT article, dealer, price
  FROM s1
  WHERE `Rank` = 1
ORDER BY article;
```