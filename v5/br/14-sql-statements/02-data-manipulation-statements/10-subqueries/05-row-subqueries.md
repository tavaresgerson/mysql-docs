#### 13.2.10.5 Subconsultas de linhas

Subconsultas escalares ou de coluna retornam um único valor ou uma coluna de valores. Uma subconsulta *de linha* é uma variante de subconsulta que retorna uma única linha e, portanto, pode retornar mais de um valor de coluna. Os operadores legais para comparações de subconsultas de linha são:

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

Para ambas as consultas, se a tabela `t2` contiver uma única linha com `id = 10`, a subconsulta retorna uma única linha. Se essa linha tiver os valores de `col3` e `col4` iguais aos valores de `col1` e `col2` de quaisquer linhas em `t1`, a expressão `WHERE` é `TRUE` e cada consulta retorna aquelas linhas de `t1`. Se os valores de `col3` e `col4` da linha `t2` não forem iguais aos valores de `col1` e `col2` de qualquer linha de `t1`, a expressão é `FALSE` e a consulta retorna um conjunto de resultados vazio. A expressão é *desconhecida* (ou seja, `NULL`) se a subconsulta não produzir nenhuma linha. Um erro ocorre se a subconsulta produzir várias linhas, pois uma subconsulta de linha pode retornar no máximo uma linha.

Para obter informações sobre como cada operador funciona para comparações de linhas, consulte Seção 12.4.2, “Funções e Operadores de Comparação”.

As expressões `(1,2)` e `ROW(1,2)` são às vezes chamadas de construtores de linha. As duas são equivalentes. O construtor de linha e a linha retornada pela subconsulta devem conter o mesmo número de valores.

Um construtor de linha é usado para comparações com subconsultas que retornam duas ou mais colunas. Quando uma subconsulta retorna uma única coluna, isso é considerado um valor escalar e não como uma linha, portanto, um construtor de linha não pode ser usado com uma subconsulta que não retorne pelo menos duas colunas. Assim, a seguinte consulta falha com um erro de sintaxe:

```sql
SELECT * FROM t1 WHERE ROW(1) = (SELECT column1 FROM t2)
```

Os construtores de linhas são válidos em outros contextos. Por exemplo, as duas declarações a seguir são semanticamente equivalentes (e são tratadas da mesma maneira pelo otimizador):

```sql
SELECT * FROM t1 WHERE (column1,column2) = (1,1);
SELECT * FROM t1 WHERE column1 = 1 AND column2 = 1;
```

A consulta a seguir responde à solicitação “encontrar todas as linhas na tabela `t1` que também existem na tabela `t2`”:

```sql
SELECT column1,column2,column3
  FROM t1
  WHERE (column1,column2,column3) IN
         (SELECT column1,column2,column3 FROM t2);
```

Para obter mais informações sobre o otimizador e os construtores de linhas, consulte Seção 8.2.1.19, “Otimização da Expressão do Construtor de Linha”
