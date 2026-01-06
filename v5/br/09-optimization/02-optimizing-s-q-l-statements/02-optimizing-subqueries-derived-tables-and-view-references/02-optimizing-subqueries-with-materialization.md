#### 8.2.2.2 Otimizando subconsultas com materialização

O otimizador utiliza a materialização para permitir um processamento mais eficiente das subconsultas. A materialização acelera a execução da consulta ao gerar o resultado de uma subconsulta como uma tabela temporária, normalmente na memória. A primeira vez que o MySQL precisa do resultado da subconsulta, ele materializa esse resultado em uma tabela temporária. Em qualquer momento subsequente em que o resultado seja necessário, o MySQL faz referência novamente à tabela temporária. O otimizador pode indexar a tabela com um índice hash para tornar as consultas rápidas e econômicas. O índice contém valores únicos para eliminar duplicatas e tornar a tabela menor.

A materialização de subconsultas usa uma tabela temporária em memória sempre que possível, revertendo para armazenamento em disco se a tabela se tornar muito grande. Veja a Seção 8.4.4, “Uso de Tabela Temporária Interna no MySQL”.

Se a materialização não for usada, o otimizador, por vezes, reescreve uma subconsulta não correlacionada como uma subconsulta correlacionada. Por exemplo, a seguinte subconsulta `IN` é não correlacionada (*`where_condition`* envolve apenas colunas de `t2` e não de `t1`):

```sql
SELECT * FROM t1
WHERE t1.a IN (SELECT t2.b FROM t2 WHERE where_condition);
```

O otimizador pode reescrever isso como uma subconsulta correlacionada `EXISTS`:

```sql
SELECT * FROM t1
WHERE EXISTS (SELECT t2.b FROM t2 WHERE where_condition AND t1.a=t2.b);
```

A materialização de subconsultas usando uma tabela temporária evita essas reescritas e permite que a subconsulta seja executada apenas uma vez, em vez de uma vez por linha da consulta externa.

Para que a materialização de subconsultas seja usada no MySQL, a variável de sistema `optimizer_switch` com a bandeira `materialization` deve estar habilitada. (Veja a Seção 8.9.2, “Otimizações Desligáveis”.) Com a bandeira `materialization` habilitada, a materialização se aplica a predicados de subconsultas que aparecem em qualquer lugar (na lista de seleção, `WHERE`, `ON`, `GROUP BY`, `HAVING` ou `ORDER BY`), para predicados que se enquadram em qualquer um desses casos de uso:

- O predicado tem essa forma quando nenhuma expressão externa *`oe_i`* ou expressão interna *`ie_i`* é opcional. *`N`* é 1 ou maior.

  ```sql
  (oe_1, oe_2, ..., oe_N) [NOT] IN (SELECT ie_1, i_2, ..., ie_N ...)
  ```

- O predicado tem essa forma quando há uma única expressão externa *`oe`* e uma expressão interna *`ie`*. As expressões podem ser nulas.

  ```sql
  oe [NOT] IN (SELECT ie ...)
  ```

- O predicado é `IN` ou `NOT IN` e um resultado de `UNKNOWN` (`NULL`) tem o mesmo significado que um resultado de `FALSE`.

Os exemplos a seguir ilustram como o requisito de equivalência na avaliação do predicado `UNKNOWN` e `FALSE` afeta se a materialização de subconsultas pode ser usada. Suponha que *`where_condition`* envolva apenas colunas de `t2` e não de `t1`, de modo que a subconsulta não seja correlacionada.

Essa consulta está sujeita à materialização:

```sql
SELECT * FROM t1
WHERE t1.a IN (SELECT t2.b FROM t2 WHERE where_condition);
```

Aqui, não importa se o predicado `IN` retorna `UNKNOWN` ou `FALSE`. De qualquer forma, a linha de `t1` não está incluída no resultado da consulta.

Um exemplo em que a materialização de subconsulta não é usada é a seguinte consulta, onde `t2.b` é uma coluna nula:

```sql
SELECT * FROM t1
WHERE (t1.a,t1.b) NOT IN (SELECT t2.a,t2.b FROM t2
                          WHERE where_condition);
```

As seguintes restrições se aplicam ao uso da materialização de subconsultas:

- Os tipos das expressões internas e externas devem corresponder. Por exemplo, o otimizador pode ser capaz de usar a materialização se ambas as expressões forem inteiras ou ambas forem decimais, mas não pode se uma expressão for inteira e a outra for decimal.

- A expressão interna não pode ser um `BLOB`.

O uso de `EXPLAIN` com uma consulta fornece uma indicação de se o otimizador utiliza a materialização de subconsultas:

- Comparado à execução de consultas que não utilizam materialização, `select_type` pode mudar de `DEPENDENT SUBQUERY` para `SUBQUERY`. Isso indica que, para uma subconsulta que seria executada uma vez por linha externa, a materialização permite que a subconsulta seja executada apenas uma vez.

- Para obter uma saída de `EXPLAIN` mais detalhada, o texto exibido por uma consulta `SHOW WARNINGS` subsequente inclui `materialize` e `materialized-subquery`.
