#### 13.2.10.11 Reescrever subconsultas como junções

Às vezes, existem outras maneiras de testar a pertença a um conjunto de valores do que usar uma subconsulta. Além disso, em algumas ocasiões, não é apenas possível reescrever uma consulta sem uma subconsulta, mas pode ser mais eficiente utilizar algumas dessas técnicas em vez de usar subconsultas. Uma delas é o construtor `IN()`:

Por exemplo, esta consulta:

```sql
SELECT * FROM t1 WHERE id IN (SELECT id FROM t2);
```

Pode ser reescrito como:

```sql
SELECT DISTINCT t1.* FROM t1, t2 WHERE t1.id=t2.id;
```

As consultas:

```sql
SELECT * FROM t1 WHERE id NOT IN (SELECT id FROM t2);
SELECT * FROM t1 WHERE NOT EXISTS (SELECT id FROM t2 WHERE t1.id=t2.id);
```

Pode ser reescrito como:

```sql
SELECT table1.*
  FROM table1 LEFT JOIN table2 ON table1.id=table2.id
  WHERE table2.id IS NULL;
```

Uma `JOIN [OUTER] LEFT` pode ser mais rápida do que uma subconsulta equivalente, pois o servidor pode ser capaz de otimizá-la melhor — um fato que não é específico apenas para o MySQL Server. Antes do SQL-92, as junções externas não existiam, então as subconsultas eram a única maneira de fazer certas coisas. Hoje, o MySQL Server e muitos outros sistemas de banco de dados modernos oferecem uma ampla gama de tipos de junção externa.

O MySQL Server suporta múltiplas instruções `DELETE` de tabela que podem ser usadas para excluir eficientemente linhas com base em informações de uma tabela ou até mesmo de muitas tabelas ao mesmo tempo. As instruções de atualização de múltiplas tabelas também são suportadas. Veja Seção 13.2.2, “Instrução DELETE” e Seção 13.2.11, “Instrução UPDATE”.
