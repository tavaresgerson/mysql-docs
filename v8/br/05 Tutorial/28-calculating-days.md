### 5.6.8 Cálculo das visitas por dia

O exemplo a seguir mostra como você pode usar as funções de grupo de bits para calcular o número de dias por mês que um usuário visitou uma página da Web.

```
CREATE TABLE t1 (year YEAR, month INT UNSIGNED,
             day INT UNSIGNED);
INSERT INTO t1 VALUES(2000,1,1),(2000,1,20),(2000,1,30),(2000,2,2),
            (2000,2,23),(2000,2,23);
```

A tabela de exemplo contém valores de ano-mês-dia representando visitas de usuários à página. Para determinar quantos dias diferentes em cada mês essas visitas ocorrem, use esta consulta:

```
SELECT year,month,BIT_COUNT(BIT_OR(1<<day)) AS days FROM t1
       GROUP BY year,month;
```

Que retorna:

```
+------+-------+------+
| year | month | days |
+------+-------+------+
| 2000 |     1 |    3 |
| 2000 |     2 |    2 |
+------+-------+------+
```

A consulta calcula quantos dias diferentes aparecem na tabela para cada combinação ano/mês, com a remoção automática de entradas duplicadas.
