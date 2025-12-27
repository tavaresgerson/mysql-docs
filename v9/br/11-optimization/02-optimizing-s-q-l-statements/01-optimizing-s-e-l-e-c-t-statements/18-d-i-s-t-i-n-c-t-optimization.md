#### 10.2.1.18 Otimização de DISTINCT

`DISTINCT` combinado com `ORDER BY` geralmente requer uma tabela temporária.

Como `DISTINCT` pode usar `GROUP BY`, aprenda como o MySQL lida com colunas em cláusulas `ORDER BY` ou `HAVING` que não fazem parte das colunas selecionadas. Veja a Seção 14.19.3, “Otimização do MySQL para GROUP BY”.

Na maioria dos casos, uma cláusula `DISTINCT` pode ser considerada um caso especial de `GROUP BY`. Por exemplo, as duas consultas a seguir são equivalentes:

```
SELECT DISTINCT c1, c2, c3 FROM t1
WHERE c1 > const;

SELECT c1, c2, c3 FROM t1
WHERE c1 > const GROUP BY c1, c2, c3;
```

Devido a essa equivalência, as otimizações aplicáveis às consultas `GROUP BY` também podem ser aplicadas a consultas com uma cláusula `DISTINCT`. Assim, para mais detalhes sobre as possibilidades de otimização para consultas `DISTINCT`, veja a Seção 10.2.1.17, “Otimização de GROUP BY”.

Quando se combina `LIMIT row_count` com `DISTINCT`, o MySQL para assim que encontrar *`row_count`* linhas únicas.

Se você não usar colunas de todas as tabelas mencionadas em uma consulta, o MySQL para de varrer tabelas não utilizadas assim que encontrar a primeira correspondência. No caso a seguir, assumindo que `t1` é usado antes de `t2` (o que você pode verificar com `EXPLAIN`), o MySQL para de ler de `t2` (para qualquer linha específica em `t1`) quando encontrar a primeira linha em `t2`:

```
SELECT DISTINCT t1.a FROM t1, t2 where t1.a=t2.a;
```