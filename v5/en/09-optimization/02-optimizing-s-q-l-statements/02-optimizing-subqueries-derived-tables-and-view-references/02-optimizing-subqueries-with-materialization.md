#### 8.2.2.2 Otimizando Subqueries com Materialization

O optimizer utiliza materialization para permitir um processamento de Subquery mais eficiente. Materialization acelera a execução da Query gerando o resultado da Subquery como uma temporary table, normalmente em memória. Na primeira vez que o MySQL precisa do resultado da Subquery, ele materializa esse resultado em uma temporary table. Qualquer vez subsequente que o resultado for necessário, o MySQL se refere novamente à temporary table. O optimizer pode aplicar um Index na tabela com um hash index para tornar as buscas rápidas e de baixo custo. O Index contém valores exclusivos para eliminar duplicatas e tornar a tabela menor.

O materialization de Subquery utiliza uma temporary table em memória sempre que possível, recorrendo ao armazenamento em disco se a tabela se tornar muito grande. Consulte a Seção 8.4.4, “Uso de Temporary Table Interna no MySQL”.

Se o materialization não for usado, o optimizer às vezes reescreve uma Subquery não correlacionada como uma Subquery correlacionada. Por exemplo, a seguinte Subquery `IN` não é correlacionada (*`where_condition`* envolve apenas colunas de `t2` e não de `t1`):

```sql
SELECT * FROM t1
WHERE t1.a IN (SELECT t2.b FROM t2 WHERE where_condition);
```

O optimizer pode reescrever isso como uma Subquery correlacionada `EXISTS`:

```sql
SELECT * FROM t1
WHERE EXISTS (SELECT t2.b FROM t2 WHERE where_condition AND t1.a=t2.b);
```

O materialization de Subquery usando uma temporary table evita tais reescritas e torna possível executar a Subquery apenas uma vez, em vez de uma vez por linha da Query externa.

Para que o materialization de Subquery seja usado no MySQL, o flag `materialization` da variável de sistema `optimizer_switch` deve estar habilitado. (Consulte a Seção 8.9.2, “Otimizações Alternáveis”.) Com o flag `materialization` habilitado, o materialization se aplica a predicados de Subquery que aparecem em qualquer lugar (na select list, `WHERE`, `ON`, `GROUP BY`, `HAVING` ou `ORDER BY`), para predicados que se enquadram em qualquer um destes casos de uso:

* O predicado tem esta forma, quando nenhuma expressão externa *`oe_i`* ou interna *`ie_i`* é nullable. *`N`* é 1 ou maior.

  ```sql
  (oe_1, oe_2, ..., oe_N) [NOT] IN (SELECT ie_1, i_2, ..., ie_N ...)
  ```

* O predicado tem esta forma, quando há uma única expressão externa *`oe`* e expressão interna *`ie`*. As expressões podem ser nullable.

  ```sql
  oe [NOT] IN (SELECT ie ...)
  ```

* O predicado é `IN` ou `NOT IN` e um resultado de `UNKNOWN` (`NULL`) tem o mesmo significado que um resultado de `FALSE`.

Os exemplos a seguir ilustram como o requisito de equivalência da avaliação do predicado `UNKNOWN` e `FALSE` afeta se o materialization de Subquery pode ser usado. Suponha que *`where_condition`* envolva colunas apenas de `t2` e não de `t1`, de modo que a Subquery seja não correlacionada.

Esta Query está sujeita a materialization:

```sql
SELECT * FROM t1
WHERE t1.a IN (SELECT t2.b FROM t2 WHERE where_condition);
```

Aqui, não importa se o predicado `IN` retorna `UNKNOWN` ou `FALSE`. De qualquer forma, a linha de `t1` não é incluída no resultado da Query.

Um exemplo em que o materialization de Subquery não é usado é a seguinte Query, onde `t2.b` é uma coluna nullable:

```sql
SELECT * FROM t1
WHERE (t1.a,t1.b) NOT IN (SELECT t2.a,t2.b FROM t2
                          WHERE where_condition);
```

As seguintes restrições se aplicam ao uso de materialization de Subquery:

* Os tipos das expressões interna e externa devem corresponder. Por exemplo, o optimizer pode ser capaz de usar materialization se ambas as expressões forem integer ou ambas forem decimal, mas não pode se uma expressão for integer e a outra for decimal.

* A expressão interna não pode ser um `BLOB`.

O uso de `EXPLAIN` com uma Query fornece alguma indicação se o optimizer utiliza materialization de Subquery:

* Em comparação com a execução da Query que não utiliza materialization, o `select_type` pode mudar de `DEPENDENT SUBQUERY` para `SUBQUERY`. Isso indica que, para uma Subquery que seria executada uma vez por linha externa, o materialization permite que a Subquery seja executada apenas uma vez.

* Para o output estendido do `EXPLAIN`, o texto exibido por um subsequente `SHOW WARNINGS` inclui `materialize` e `materialized-subquery`.