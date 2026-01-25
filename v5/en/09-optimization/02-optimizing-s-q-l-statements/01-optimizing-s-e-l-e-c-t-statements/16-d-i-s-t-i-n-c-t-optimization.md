#### 8.2.1.16 Otimização de DISTINCT

`DISTINCT` combinado com `ORDER BY` requer uma tabela temporária em muitos casos.

Como `DISTINCT` pode usar `GROUP BY`, aprenda como o MySQL trabalha com colunas nas cláusulas `ORDER BY` ou `HAVING` que não fazem parte das colunas selecionadas. Consulte a Seção 12.19.3, “MySQL Handling of GROUP BY”.

Na maioria dos casos, uma cláusula `DISTINCT` pode ser considerada um caso especial de `GROUP BY`. Por exemplo, as duas seguintes Queries são equivalentes:

```sql
SELECT DISTINCT c1, c2, c3 FROM t1
WHERE c1 > const;

SELECT c1, c2, c3 FROM t1
WHERE c1 > const GROUP BY c1, c2, c3;
```

Devido a essa equivalência, as otimizações aplicáveis às Queries `GROUP BY` também podem ser aplicadas a Queries com uma cláusula `DISTINCT`. Assim, para mais detalhes sobre as possibilidades de otimização para Queries `DISTINCT`, consulte a Seção 8.2.1.15, “GROUP BY Optimization”.

Ao combinar `LIMIT row_count` com `DISTINCT`, o MySQL para assim que encontra *`row_count`* linhas únicas.

Se você não usar colunas de todas as tabelas nomeadas em uma Query, o MySQL para de escanear quaisquer tabelas não utilizadas assim que encontra a primeira correspondência. No caso a seguir, assumindo que `t1` é usada antes de `t2` (o que você pode verificar com `EXPLAIN`), o MySQL para de ler `t2` (para qualquer linha específica em `t1`) quando encontra a primeira linha em `t2`:

```sql
SELECT DISTINCT t1.a FROM t1, t2 where t1.a=t2.a;
```