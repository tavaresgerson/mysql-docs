### 5.6.2 A Linha que Retém o Valor Máximo de uma Coluna Específica

*Tarefa: Encontrar o número, o revendedor e o preço do artigo mais caro.*

Isso é facilmente feito com uma subconsulta:

```
SELECT article, dealer, price
FROM   shop
WHERE  price=(SELECT MAX(price) FROM shop);

+---------+--------+-------+
| article | dealer | price |
+---------+--------+-------+
|    0004 | D      | 19.95 |
+---------+--------+-------+
```

Outra solução é usar uma `JOIN LEFT`, como mostrado aqui:

```
SELECT s1.article, s1.dealer, s1.price
FROM shop s1
LEFT JOIN shop s2 ON s1.price < s2.price
WHERE s2.article IS NULL;
```

Você também pode fazer isso ordenando todas as linhas em ordem decrescente de preço e obtendo apenas a primeira linha usando a cláusula `LIMIT` específica do MySQL, assim:

```
SELECT article, dealer, price
FROM shop
ORDER BY price DESC
LIMIT 1;
```

Observação

Se houvesse vários artigos mais caros, cada um com um preço de 19,95, a solução `LIMIT` mostraria apenas um deles.