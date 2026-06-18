#### 8.2.1.16 Otimização de DISTINCT

`DISTINCT` combinado com `ORDER BY` precisa de uma tabela temporária em muitos casos.

Como o `DISTINCT` pode usar `GROUP BY`, aprenda como o MySQL funciona com colunas em cláusulas `ORDER BY` ou `HAVING` que não fazem parte das colunas selecionadas. Veja a Seção 12.19.3, “Tratamento do MySQL do GROUP BY”.

Na maioria dos casos, uma cláusula `DISTINCT` pode ser considerada um caso especial do `GROUP BY`. Por exemplo, as seguintes duas consultas são equivalentes:

```sql
SELECT DISTINCT c1, c2, c3 FROM t1
WHERE c1 > const;

SELECT c1, c2, c3 FROM t1
WHERE c1 > const GROUP BY c1, c2, c3;
```

Devido a essa equivalência, as otimizações aplicáveis às consultas `GROUP BY` também podem ser aplicadas a consultas com uma cláusula `DISTINCT`. Portanto, para mais detalhes sobre as possibilidades de otimização para consultas `DISTINCT`, consulte a Seção 8.2.1.15, “Otimização de GROUP BY”.

Ao combinar `LIMIT row_count` com `DISTINCT`, o MySQL para de funcionar assim que encontrar *`row_count`* linhas únicas.

Se você não usar colunas de todas as tabelas mencionadas em uma consulta, o MySQL para de analisar tabelas não utilizadas assim que encontrar a primeira correspondência. No caso a seguir, assumindo que `t1` é usado antes de `t2` (o que você pode verificar com `EXPLAIN`), o MySQL para de ler a partir de `t2` (para qualquer linha específica em `t1`) quando encontrar a primeira linha em `t2`:

```sql
SELECT DISTINCT t1.a FROM t1, t2 where t1.a=t2.a;
```
