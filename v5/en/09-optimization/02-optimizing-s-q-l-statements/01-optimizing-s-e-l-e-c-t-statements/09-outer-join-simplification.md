#### 8.2.1.9 Simplificação de Outer Join

Expressões de tabela na cláusula `FROM` de uma Query são simplificadas em muitos casos.

Na fase de *parser*, Queries com operações de *right outer join* são convertidas para Queries equivalentes contendo apenas operações de *left join*. No caso geral, a conversão é realizada de forma que este *right join*:

```sql
(T1, ...) RIGHT JOIN (T2, ...) ON P(T1, ..., T2, ...)
```

Torna-se este *left join* equivalente:

```sql
(T2, ...) LEFT JOIN (T1, ...) ON P(T1, ..., T2, ...)
```

Todas as expressões de *inner join* do formato `T1 INNER JOIN T2 ON P(T1,T2)` são substituídas pela lista `T1,T2`, sendo `P(T1,T2)` unido como uma conjunção à `WHERE condition` (ou à *join condition* do *join* incorporador, se houver).

Quando o *optimizer* avalia planos para operações de *outer join*, ele leva em consideração apenas planos onde, para cada operação, as tabelas *outer* são acessadas antes das tabelas *inner*. As escolhas do *optimizer* são limitadas porque apenas tais planos permitem que *outer joins* sejam executados usando o algoritmo *nested-loop*.

Considere uma Query deste formato, onde `R(T2)` restringe bastante o número de linhas correspondentes da tabela `T2`:

```sql
SELECT * T1 FROM T1
  LEFT JOIN T2 ON P1(T1,T2)
  WHERE P(T1,T2) AND R(T2)
```

Se a Query for executada conforme escrita, o *optimizer* não tem escolha a não ser acessar a tabela menos restrita `T1` antes da tabela mais restrita `T2`, o que pode produzir um plano de execução muito ineficiente.

Em vez disso, o MySQL converte a Query para uma Query sem operação de *outer join* se a `WHERE condition` for *null-rejected*. (Ou seja, ele converte o *outer join* para um *inner join*.) Uma *condition* é dita *null-rejected* para uma operação de *outer join* se ela avaliar para `FALSE` ou `UNKNOWN` para qualquer linha complementada por `NULL` gerada para a operação.

Assim, para este *outer join*:

```sql
T1 LEFT JOIN T2 ON T1.A=T2.A
```

*Conditions* como estas são *null-rejected* porque não podem ser verdadeiras para nenhuma linha complementada por `NULL` (com as colunas de `T2` definidas como `NULL`):

```sql
T2.B IS NOT NULL
T2.B > 3
T2.C <= T1.C
T2.B < 2 OR T2.C > 1
```

*Conditions* como estas não são *null-rejected* porque podem ser verdadeiras para uma linha complementada por `NULL`:

```sql
T2.B IS NULL
T1.B < 3 OR T2.B IS NOT NULL
T1.B < 3 OR T2.B > 3
```

As regras gerais para verificar se uma *condition* é *null-rejected* para uma operação de *outer join* são simples:

* Ela é do formato `A IS NOT NULL`, onde `A` é um atributo de qualquer uma das tabelas *inner*

* É um *predicate* contendo uma referência a uma tabela *inner* que avalia para `UNKNOWN` quando um de seus argumentos é `NULL`

* É uma conjunção contendo uma *null-rejected condition* como uma conjunção

* É uma disjunção de *null-rejected conditions*

Uma *condition* pode ser *null-rejected* para uma operação de *outer join* em uma Query e não *null-rejected* para outra. Nesta Query, a `WHERE condition` é *null-rejected* para a segunda operação de *outer join*, mas não é *null-rejected* para a primeira:

```sql
SELECT * FROM T1 LEFT JOIN T2 ON T2.A=T1.A
                 LEFT JOIN T3 ON T3.B=T1.B
  WHERE T3.C > 0
```

Se a `WHERE condition` for *null-rejected* para uma operação de *outer join* em uma Query, a operação de *outer join* é substituída por uma operação de *inner join*.

Por exemplo, na Query anterior, o segundo *outer join* é *null-rejected* e pode ser substituído por um *inner join*:

```sql
SELECT * FROM T1 LEFT JOIN T2 ON T2.A=T1.A
                 INNER JOIN T3 ON T3.B=T1.B
  WHERE T3.C > 0
```

Para a Query original, o *optimizer* avalia apenas planos compatíveis com a única ordem de acesso à tabela `T1,T2,T3`. Para a Query reescrita, ele considera adicionalmente a ordem de acesso `T3,T1,T2`.

Uma conversão de uma operação de *outer join* pode desencadear uma conversão de outra. Assim, a Query:

```sql
SELECT * FROM T1 LEFT JOIN T2 ON T2.A=T1.A
                 LEFT JOIN T3 ON T3.B=T2.B
  WHERE T3.C > 0
```

É primeiro convertida para a Query:

```sql
SELECT * FROM T1 LEFT JOIN T2 ON T2.A=T1.A
                 INNER JOIN T3 ON T3.B=T2.B
  WHERE T3.C > 0
```

O que é equivalente à Query:

```sql
SELECT * FROM (T1 LEFT JOIN T2 ON T2.A=T1.A), T3
  WHERE T3.C > 0 AND T3.B=T2.B
```

A operação de *outer join* restante também pode ser substituída por um *inner join* porque a *condition* `T3.B=T2.B` é *null-rejected*. Isso resulta em uma Query sem *outer joins* de forma alguma:

```sql
SELECT * FROM (T1 INNER JOIN T2 ON T2.A=T1.A), T3
  WHERE T3.C > 0 AND T3.B=T2.B
```

Às vezes, o *optimizer* consegue substituir uma operação de *outer join* incorporada, mas não pode converter o *outer join* incorporador. A seguinte Query:

```sql
SELECT * FROM T1 LEFT JOIN
              (T2 LEFT JOIN T3 ON T3.B=T2.B)
              ON T2.A=T1.A
  WHERE T3.C > 0
```

É convertida para:

```sql
SELECT * FROM T1 LEFT JOIN
              (T2 INNER JOIN T3 ON T3.B=T2.B)
              ON T2.A=T1.A
  WHERE T3.C > 0
```

Que pode ser reescrita apenas para o formato que ainda contém a operação de *outer join* incorporadora:

```sql
SELECT * FROM T1 LEFT JOIN
              (T2,T3)
              ON (T2.A=T1.A AND T3.B=T2.B)
  WHERE T3.C > 0
```

Qualquer tentativa de converter uma operação de *outer join* incorporada em uma Query deve levar em consideração a *join condition* para o *outer join* incorporador juntamente com a `WHERE condition`. Nesta Query, a `WHERE condition` não é *null-rejected* para o *outer join* incorporado, mas a *join condition* do *outer join* incorporador `T2.A=T1.A AND T3.C=T1.C` é *null-rejected*:

```sql
SELECT * FROM T1 LEFT JOIN
              (T2 LEFT JOIN T3 ON T3.B=T2.B)
              ON T2.A=T1.A AND T3.C=T1.C
  WHERE T3.D > 0 OR T1.D > 0
```

Consequentemente, a Query pode ser convertida para:

```sql
SELECT * FROM T1 LEFT JOIN
              (T2, T3)
              ON T2.A=T1.A AND T3.C=T1.C AND T3.B=T2.B
  WHERE T3.D > 0 OR T1.D > 0
```