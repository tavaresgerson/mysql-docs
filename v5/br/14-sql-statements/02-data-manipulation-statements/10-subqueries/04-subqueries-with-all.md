#### 13.2.10.4 Subqueries com ALL

Sintaxe:

```sql
operand comparison_operator ALL (subquery)
```

A palavra `ALL`, que deve seguir um operador de comparação, significa "retorna `TRUE` se a comparação for `TRUE` para `ALL` (todos) os valores na coluna que a Subquery retorna." Por exemplo:

```sql
SELECT s1 FROM t1 WHERE s1 > ALL (SELECT s1 FROM t2);
```

Suponha que exista uma linha na tabela `t1` contendo `(10)`. A expressão é `TRUE` se a tabela `t2` contiver `(-5,0,+5)` porque `10` é maior que todos os três valores em `t2`. A expressão é `FALSE` se a tabela `t2` contiver `(12,6,NULL,-100)` porque há um único valor `12` na tabela `t2` que é maior que `10`. A expressão é *desconhecida* (ou seja, `NULL`) se a tabela `t2` contiver `(0,NULL,1)`.

Finalmente, a expressão é `TRUE` se a tabela `t2` estiver vazia. Assim, a seguinte expressão é `TRUE` quando a tabela `t2` estiver vazia:

```sql
SELECT * FROM t1 WHERE 1 > ALL (SELECT s1 FROM t2);
```

Mas esta expressão é `NULL` quando a tabela `t2` estiver vazia:

```sql
SELECT * FROM t1 WHERE 1 > (SELECT s1 FROM t2);
```

Além disso, a seguinte expressão é `NULL` quando a tabela `t2` estiver vazia:

```sql
SELECT * FROM t1 WHERE 1 > ALL (SELECT MAX(s1) FROM t2);
```

Em geral, *tabelas contendo valores `NULL`* e *tabelas vazias* são "casos extremos" (*edge cases*). Ao escrever Subqueries, sempre considere se você levou essas duas possibilidades em consideração.

`NOT IN` é um alias para `<> ALL`. Portanto, estas duas instruções são as mesmas:

```sql
SELECT s1 FROM t1 WHERE s1 <> ALL (SELECT s1 FROM t2);
SELECT s1 FROM t1 WHERE s1 NOT IN (SELECT s1 FROM t2);
```