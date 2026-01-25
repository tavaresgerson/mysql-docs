#### 13.2.10.5 Row Subqueries

Subqueries escalares ou de coluna retornam um único valor ou uma coluna de valores. Uma *row subquery* é uma variante de subquery que retorna uma única linha e pode, portanto, retornar mais de um valor de coluna. Os operadores válidos para comparações de row subquery são:

```sql
=  >  <  >=  <=  <>  !=  <=>
```

Aqui estão dois exemplos:

```sql
SELECT * FROM t1
  WHERE (col1,col2) = (SELECT col3, col4 FROM t2 WHERE id = 10);
SELECT * FROM t1
  WHERE ROW(col1,col2) = (SELECT col3, col4 FROM t2 WHERE id = 10);
```

Para ambas as Queries, se a tabela `t2` contiver uma única linha com `id = 10`, a subquery retorna uma única linha. Se esta linha tiver valores de `col3` e `col4` iguais aos valores de `col1` e `col2` de quaisquer linhas em `t1`, a expressão `WHERE` será `TRUE` e cada Query retornará essas linhas de `t1`. Se os valores de `col3` e `col4` da linha de `t2` não forem iguais aos valores de `col1` e `col2` de nenhuma linha de `t1`, a expressão será `FALSE` e a Query retornará um conjunto de resultados vazio. A expressão é *desconhecida* (isto é, `NULL`) se a subquery não produzir nenhuma linha. Ocorre um erro se a subquery produzir múltiplas linhas, pois uma row subquery pode retornar no máximo uma linha.

Para obter informações sobre como cada operador funciona para comparações de linha, consulte [Section 12.4.2, “Comparison Functions and Operators”](comparison-operators.html "12.4.2 Comparison Functions and Operators").

As expressões `(1,2)` e `ROW(1,2)` são algumas vezes chamadas de *row constructors*. As duas são equivalentes. O *row constructor* e a linha retornada pela subquery devem conter o mesmo número de valores.

Um *row constructor* é usado para comparações com subqueries que retornam duas ou mais colunas. Quando uma subquery retorna uma única coluna, isso é considerado um valor escalar e não como uma linha, de modo que um *row constructor* não pode ser usado com uma subquery que não retorne pelo menos duas colunas. Assim, a seguinte Query falha com um erro de sintaxe:

```sql
SELECT * FROM t1 WHERE ROW(1) = (SELECT column1 FROM t2)
```

Os *row constructors* são válidos em outros contextos. Por exemplo, as duas instruções a seguir são semanticamente equivalentes (e são tratadas da mesma forma pelo Optimizer):

```sql
SELECT * FROM t1 WHERE (column1,column2) = (1,1);
SELECT * FROM t1 WHERE column1 = 1 AND column2 = 1;
```

A seguinte Query responde à solicitação, "encontrar todas as linhas na tabela `t1` que também existem na tabela `t2`":

```sql
SELECT column1,column2,column3
  FROM t1
  WHERE (column1,column2,column3) IN
         (SELECT column1,column2,column3 FROM t2);
```

Para mais informações sobre o Optimizer e os *row constructors*, consulte [Section 8.2.1.19, “Row Constructor Expression Optimization”](row-constructor-optimization.html "8.2.1.19 Row Constructor Expression Optimization")