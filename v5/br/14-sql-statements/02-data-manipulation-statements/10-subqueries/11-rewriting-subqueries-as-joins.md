#### 13.2.10.11 Reescrevendo Subqueries como Joins

Às vezes, existem outras maneiras de testar a inclusão em um conjunto de valores além de usar uma subquery. Além disso, em algumas ocasiões, não é apenas possível reescrever uma Query sem uma subquery, mas pode ser mais eficiente utilizar algumas dessas técnicas em vez de usar subqueries. Uma delas é o construto `IN()`:

Por exemplo, esta Query:

```sql
SELECT * FROM t1 WHERE id IN (SELECT id FROM t2);
```

Pode ser reescrita como:

```sql
SELECT DISTINCT t1.* FROM t1, t2 WHERE t1.id=t2.id;
```

As Queries:

```sql
SELECT * FROM t1 WHERE id NOT IN (SELECT id FROM t2);
SELECT * FROM t1 WHERE NOT EXISTS (SELECT id FROM t2 WHERE t1.id=t2.id);
```

Podem ser reescritas como:

```sql
SELECT table1.*
  FROM table1 LEFT JOIN table2 ON table1.id=table2.id
  WHERE table2.id IS NULL;
```

Um `LEFT [OUTER] JOIN` pode ser mais rápido do que uma subquery equivalente porque o Server pode otimizá-lo melhor – um fato que não é específico apenas do MySQL Server. Antes do SQL-92, os outer joins não existiam, então as subqueries eram a única maneira de realizar certas operações. Hoje, o MySQL Server e muitos outros sistemas de Database modernos oferecem uma ampla gama de tipos de outer join.

O MySQL Server suporta instruções [`DELETE`](delete.html "13.2.2 DELETE Statement") de múltiplas tabelas que podem ser usadas para apagar linhas eficientemente com base em informações de uma ou até mesmo de muitas tabelas simultaneamente. Instruções [`UPDATE`](update.html "13.2.11 UPDATE Statement") de múltiplas tabelas também são suportadas. Consulte [Seção 13.2.2, “DELETE Statement”](delete.html "13.2.2 DELETE Statement") e [Seção 13.2.11, “UPDATE Statement”](update.html "13.2.11 UPDATE Statement").