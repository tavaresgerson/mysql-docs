#### 10.2.1.10 Simplificação da Conjunção Externa

As expressões de junção em cláusula `FROM` de uma consulta são simplificadas em muitos casos.

Na fase de análise sintática, as consultas com operações de junção externa direita são convertidas em consultas equivalentes que contêm apenas operações de junção esquerda. No caso geral, a conversão é realizada de modo que essa junção externa:

```
(T1, ...) RIGHT JOIN (T2, ...) ON P(T1, ..., T2, ...)
```

Se torne essa junção esquerda equivalente:

```
(T2, ...) LEFT JOIN (T1, ...) ON P(T1, ..., T2, ...)
```

Todas as expressões de junção interna na forma `T1 INNER JOIN T2 ON P(T1,T2)` são substituídas pela lista `T1,T2`, sendo `P(T1,T2)` unido como conjunção à condição `WHERE` (ou à condição de junção da junção embutida, se houver).

Quando o otimizador avalia os planos para operações de junção externa, ele considera apenas os planos onde, para cada operação desse tipo, as tabelas externas são acessadas antes das tabelas internas. As escolhas do otimizador são limitadas porque apenas tais planos permitem que as junções externas sejam executadas usando o algoritmo de laço aninhado.

Considere uma consulta dessa forma, onde `R(T2)` restringe muito o número de linhas correspondentes da tabela `T2`:

```
SELECT * T1 FROM T1
  LEFT JOIN T2 ON P1(T1,T2)
  WHERE P(T1,T2) AND R(T2)
```

Se a consulta for executada conforme escrito, o otimizador não tem escolha senão acessar a tabela menos restrita `T1` antes da tabela mais restrita `T2`, o que pode produzir um plano de execução muito ineficiente.

Em vez disso, o MySQL converte a consulta em uma consulta sem operação de junção externa se a condição `WHERE` for rejeitada por `NULL`. (Ou seja, converte a junção externa em uma junção interna.) Uma condição é dita ser rejeitada por `NULL` para uma operação de junção externa se ela avaliar para `FALSE` ou `UNKNOWN` para qualquer linha completada com `NULL` gerada para a operação.

Assim, para essa junção externa:

```
T1 LEFT JOIN T2 ON T1.A=T2.A
```

Condições como essas são rejeitadas por nulidade porque não podem ser verdadeiras para nenhuma linha completada com `NULL` (com as colunas `T2` definidas como `NULL`):

```
T2.B IS NOT NULL
T2.B > 3
T2.C <= T1.C
T2.B < 2 OR T2.C > 1
```

Condições como essas não são rejeitadas por nulidade porque podem ser verdadeiras para uma linha completada com `NULL`:

```
T2.B IS NULL
T1.B < 3 OR T2.B IS NOT NULL
T1.B < 3 OR T2.B > 3
```

As regras gerais para verificar se uma condição é rejeitada por nulidade para uma operação de junção externa são simples:

* É da forma `A IS NOT NULL`, onde `A` é um atributo de qualquer uma das tabelas internas

* É um predicado que contém uma referência a uma tabela interna que avalia como `UNKNOWN` quando um de seus argumentos é `NULL`

* É uma conjunção que contém uma condição rejeitada por nulidade como conjunção

* É uma disjunção de condições rejeitadas por nulidade

Uma condição pode ser rejeitada por nulidade para uma operação de junção externa em uma consulta e não ser rejeitada por nulidade para outra. Nesta consulta, a condição `WHERE` é rejeitada por nulidade para a segunda operação de junção externa, mas não é rejeitada por nulidade para a primeira:

```
SELECT * FROM T1 LEFT JOIN T2 ON T2.A=T1.A
                 LEFT JOIN T3 ON T3.B=T1.B
  WHERE T3.C > 0
```

Se a condição `WHERE` for rejeitada por nulidade para uma operação de junção externa em uma consulta, a operação de junção externa é substituída por uma operação de junção interna.

Por exemplo, na consulta anterior, a segunda junção externa é rejeitada por nulidade e pode ser substituída por uma junção interna:

```
SELECT * FROM T1 LEFT JOIN T2 ON T2.A=T1.A
                 INNER JOIN T3 ON T3.B=T1.B
  WHERE T3.C > 0
```

Para a consulta original, o otimizador avalia apenas planos compatíveis com a ordem de acesso a uma única tabela `T1,T2,T3`. Para a consulta reescrita, ele considera adicionalmente a ordem de acesso `T3,T1,T2`.

Uma conversão de uma operação de junção externa pode desencadear a conversão de outra. Assim, a consulta:

```
SELECT * FROM T1 LEFT JOIN T2 ON T2.A=T1.A
                 LEFT JOIN T3 ON T3.B=T2.B
  WHERE T3.C > 0
```

É convertida primeiro para a consulta:

```
SELECT * FROM T1 LEFT JOIN T2 ON T2.A=T1.A
                 INNER JOIN T3 ON T3.B=T2.B
  WHERE T3.C > 0
```

Que é equivalente à consulta:

```
SELECT * FROM (T1 LEFT JOIN T2 ON T2.A=T1.A), T3
  WHERE T3.C > 0 AND T3.B=T2.B
```

A operação de junção externa restante também pode ser substituída por uma junção interna porque a condição `T3.B=T2.B` é rejeitada por nulidade. Isso resulta em uma consulta sem junções externas:

```
SELECT * FROM (T1 INNER JOIN T2 ON T2.A=T1.A), T3
  WHERE T3.C > 0 AND T3.B=T2.B
```

Às vezes, o otimizador consegue substituir uma operação de junção externa embutida, mas não consegue converter a junção externa embutida. A seguinte consulta:

```
SELECT * FROM T1 LEFT JOIN
              (T2 LEFT JOIN T3 ON T3.B=T2.B)
              ON T2.A=T1.A
  WHERE T3.C > 0
```

É convertida em:

```
SELECT * FROM T1 LEFT JOIN
              (T2 INNER JOIN T3 ON T3.B=T2.B)
              ON T2.A=T1.A
  WHERE T3.C > 0
```

Isso pode ser reescrito apenas na forma que ainda contém a operação de junção externa embutida:

```
SELECT * FROM T1 LEFT JOIN
              (T2,T3)
              ON (T2.A=T1.A AND T3.B=T2.B)
  WHERE T3.C > 0
```

Qualquer tentativa de converter uma operação de junção externa embutida em uma consulta deve levar em conta a condição de junção para a junção externa embutida, juntamente com a condição `WHERE`. Nesta consulta, a condição `WHERE` não é rejeitada por nulidade para a junção externa embutida, mas a condição de junção da junção externa embutida `T2.A=T1.A E T3.C=T1.C` é rejeitada por nulidade:

```
SELECT * FROM T1 LEFT JOIN
              (T2 LEFT JOIN T3 ON T3.B=T2.B)
              ON T2.A=T1.A AND T3.C=T1.C
  WHERE T3.D > 0 OR T1.D > 0
```

Consequentemente, a consulta pode ser convertida em:

```
SELECT * FROM T1 LEFT JOIN
              (T2, T3)
              ON T2.A=T1.A AND T3.C=T1.C AND T3.B=T2.B
  WHERE T3.D > 0 OR T1.D > 0
```