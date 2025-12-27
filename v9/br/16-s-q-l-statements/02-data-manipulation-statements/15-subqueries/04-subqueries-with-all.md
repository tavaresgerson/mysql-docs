#### 15.2.15.4 Subconsultas com ALL

Sintaxe:

```
operand comparison_operator ALL (subquery)
```

A palavra `ALL`, que deve seguir um operador de comparação, significa “retornar `TRUE` se a comparação for `TRUE` para `ALL` dos valores na coluna que a subconsulta retorna”. Por exemplo:

```
SELECT s1 FROM t1 WHERE s1 > ALL (SELECT s1 FROM t2);
```

Suponha que haja uma linha na tabela `t1` contendo `(10)`. A expressão é `TRUE` se a tabela `t2` contiver `(-5,0,+5)` porque `10` é maior que todos os três valores em `t2`. A expressão é `FALSE` se a tabela `t2` contiver `(12,6,NULL,-100)` porque há um único valor `12` em `t2` que é maior que `10`. A expressão é *desconhecida* (ou seja, `NULL`) se a tabela `t2` contiver `(0,NULL,1)`.

Finalmente, a expressão é `TRUE` se a tabela `t2` estiver vazia. Portanto, a seguinte expressão é `TRUE` quando a tabela `t2` estiver vazia:

```
SELECT * FROM t1 WHERE 1 > ALL (SELECT s1 FROM t2);
```

Mas essa expressão é `NULL` quando a tabela `t2` estiver vazia:

```
SELECT * FROM t1 WHERE 1 > (SELECT s1 FROM t2);
```

Além disso, a seguinte expressão é `NULL` quando a tabela `t2` estiver vazia:

```
SELECT * FROM t1 WHERE 1 > ALL (SELECT MAX(s1) FROM t2);
```

Em geral, *tabelas que contêm valores `NULL`* e *tabelas vazias* são “casos extremos”. Ao escrever subconsultas, sempre considere se você levou essas duas possibilidades em conta.

`NOT IN` é um alias para `<> ALL`. Assim, essas duas declarações são iguais:

```
SELECT s1 FROM t1 WHERE s1 <> ALL (SELECT s1 FROM t2);
SELECT s1 FROM t1 WHERE s1 NOT IN (SELECT s1 FROM t2);
```

Assim como com `IN`, `ANY`, e `SOME`, você pode usar `TABLE` com `ALL` e `NOT IN`, desde que as seguintes duas condições sejam atendidas:

* A tabela na subconsulta contenha apenas uma coluna
* A subconsulta não dependa de uma expressão de coluna

Por exemplo, assumindo que a tabela `t2` consiste em uma única coluna, as duas últimas declarações mostradas anteriormente podem ser escritas usando `TABLE t2` assim:

```
SELECT s1 FROM t1 WHERE s1 <> ALL (TABLE t2);
SELECT s1 FROM t1 WHERE s1 NOT IN (TABLE t2);
```

Uma consulta como `SELECT * FROM t1 WHERE 1 > ALL (SELECT MAX(s1) FROM t2);` não pode ser escrita usando `TABELA t2` porque a subconsulta depende de uma expressão de coluna.