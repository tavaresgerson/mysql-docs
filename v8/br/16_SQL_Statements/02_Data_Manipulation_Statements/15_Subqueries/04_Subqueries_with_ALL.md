#### 15.2.15.4 Subconsultas com ALL

Sintaxe:

```
operand comparison_operator ALL (subquery)
```

A palavra `ALL`, que deve seguir um operador de comparação, significa “retorne `TRUE` se a comparação for `TRUE` para `ALL` dos valores na coluna que a subconsulta retorna”. Por exemplo:

```
SELECT s1 FROM t1 WHERE s1 > ALL (SELECT s1 FROM t2);
```

Suponha que haja uma linha na tabela `t1` contendo `(10)`. A expressão é `TRUE` se a tabela `t2` contiver `(-5,0,+5)` porque `10` é maior que os três valores em `t2`. A expressão é `FALSE` se a tabela `t2` contiver `(12,6,NULL,-100)` porque há um único valor `12` na tabela `t2` que é maior que `10`. A expressão é *desconhecida* (ou seja, `NULL`) se a tabela `t2` contiver `(0,NULL,1)`.

Por fim, a expressão é `TRUE` se a tabela `t2` estiver vazia. Portanto, a expressão seguinte é `TRUE` quando a tabela `t2` estiver vazia:

```
SELECT * FROM t1 WHERE 1 > ALL (SELECT s1 FROM t2);
```

Mas essa expressão é `NULL` quando a tabela `t2` está vazia:

```
SELECT * FROM t1 WHERE 1 > (SELECT s1 FROM t2);
```

Além disso, a seguinte expressão é `NULL` quando a tabela `t2` está vazia:

```
SELECT * FROM t1 WHERE 1 > ALL (SELECT MAX(s1) FROM t2);
```

Em geral, **tabelas que contêm valores de `NULL`** e **tabelas vazias** são **casos de borda**. Ao escrever subconsultas, sempre considere se você levou essas duas possibilidades em conta.

`NOT IN` é um alias para `<> ALL`. Assim, essas duas declarações são iguais:

```
SELECT s1 FROM t1 WHERE s1 <> ALL (SELECT s1 FROM t2);
SELECT s1 FROM t1 WHERE s1 NOT IN (SELECT s1 FROM t2);
```

O MySQL 8.0.19 suporta a instrução `TABLE`. Assim como com `IN`, `ANY` e `SOME`, você pode usar `TABLE` com `ALL` e `NOT IN`, desde que sejam atendidas as duas condições a seguir:

- A tabela na subconsulta contém apenas uma coluna
- A subconsulta não depende de uma expressão de coluna

Por exemplo, assumindo que a tabela `t2` consiste em uma única coluna, as duas últimas declarações mostradas anteriormente podem ser escritas usando `TABLE t2` da seguinte forma:

```
SELECT s1 FROM t1 WHERE s1 <> ALL (TABLE t2);
SELECT s1 FROM t1 WHERE s1 NOT IN (TABLE t2);
```

Uma consulta como `SELECT * FROM t1 WHERE 1 > ALL (SELECT MAX(s1) FROM t2);` não pode ser escrita usando `TABLE t2`, porque a subconsulta depende de uma expressão de coluna.
