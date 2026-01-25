### 3.6.2 A Linha que Contém o Valor Máximo de uma Determinada Coluna

*Tarefa: Encontrar o número, o revendedor (dealer) e o preço do artigo mais caro.*

Isso é facilmente feito com uma Subquery:

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

Outra solução é usar um `LEFT JOIN`, conforme mostrado aqui:

```sql
SELECT s1.article, s1.dealer, s1.price
FROM shop s1
LEFT JOIN shop s2 ON s1.price < s2.price
WHERE s2.article IS NULL;
```

Você também pode fazer isso ordenando todas as linhas de forma decrescente pelo preço e obtendo apenas a primeira linha usando a cláusula `LIMIT`, específica do MySQL, assim:

```sql
SELECT article, dealer, price
FROM shop
ORDER BY price DESC
LIMIT 1;
```

Nota

Se houvesse vários artigos mais caros, cada um com um preço de 19.95, a solução com `LIMIT` mostraria apenas um deles.