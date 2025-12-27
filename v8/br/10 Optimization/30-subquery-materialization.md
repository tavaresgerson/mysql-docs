#### 10.2.2.2 Otimização de Subconsultas com Materialização

O otimizador utiliza a materialização para permitir um processamento mais eficiente das subconsultas. A materialização acelera a execução da consulta ao gerar o resultado de uma subconsulta como uma tabela temporária, normalmente na memória. A primeira vez que o MySQL precisa do resultado da subconsulta, ele materializa esse resultado em uma tabela temporária. Toda vez que o resultado for necessário, o MySQL faz referência novamente à tabela temporária. O otimizador pode indexar a tabela com um índice hash para tornar as consultas rápidas e econômicas. O índice contém valores únicos para eliminar duplicatas e tornar a tabela menor.

A materialização de subconsultas usa uma tabela temporária in-memory quando possível, revertendo para armazenamento em disco se a tabela se tornar muito grande. Veja a Seção 10.4.4, “Uso de Tabelas Temporárias Internas no MySQL”.

Se a materialização não for usada, o otimizador às vezes reescreve uma subconsulta não correlacionada como uma subconsulta correlacionada. Por exemplo, a seguinte subconsulta `IN` é não correlacionada (*`where_condition`* envolve apenas colunas de `t2` e não de `t1`):

```
SELECT * FROM t1
WHERE t1.a IN (SELECT t2.b FROM t2 WHERE where_condition);
```

O otimizador pode reescrever isso como uma subconsulta `EXISTS` correlacionada:

```
SELECT * FROM t1
WHERE EXISTS (SELECT t2.b FROM t2 WHERE where_condition AND t1.a=t2.b);
```

A materialização de subconsulta usando uma tabela temporária evita tais reescritas e torna possível executar a subconsulta apenas uma vez, em vez de uma vez por linha da consulta externa.

Para que a materialização de subconsulta seja usada no MySQL, a variável de sistema `optimizer_switch`  o sinalizador `materialization` deve estar habilitado. (Veja a Seção 10.9.2, “Otimizações Alternativas”). Com o sinalizador `materialization` habilitado, a materialização se aplica aos predicados da subconsulta que aparecem em qualquer lugar (na lista de seleção, `WHERE`, `ON`, `GROUP BY`, `HAVING` ou `ORDER BY`), para predicados que caibam em qualquer um desses casos de uso:

* O predicado tem essa forma, quando nenhuma expressão externa *`oe_i`* ou expressão interna *`ie_i`* é nula. *`N`* é 1 ou maior.

```
  (oe_1, oe_2, ..., oe_N) [NOT] IN (SELECT ie_1, i_2, ..., ie_N ...)
  ```
* O predicado tem essa forma, quando há uma única expressão externa *`oe`* e expressão interna *`ie`*. As expressões podem ser nulos.

  ```
  oe [NOT] IN (SELECT ie ...)
  ```
* O predicado é `IN` ou `NOT IN` e um resultado de `UNKNOWN` (`NULL`) tem o mesmo significado que um resultado de `FALSE`.

Os seguintes exemplos ilustram como o requisito de equivalência da avaliação do predicado `UNKNOWN` e `FALSE` afeta se a materialização de subconsulta pode ser usada. Suponha que *`where_condition`* envolva colunas apenas de `t2` e não de `t1`, de modo que a subconsulta não seja correlacionada.

Esta consulta está sujeita à materialização:

```
SELECT * FROM t1
WHERE t1.a IN (SELECT t2.b FROM t2 WHERE where_condition);
```

Aqui, não importa se o predicado `IN` retorna `UNKNOWN` ou `FALSE`. De qualquer forma, a linha de `t1` não é incluída no resultado da consulta.

Um exemplo em que a materialização de subconsulta não é usada é a seguinte consulta, onde `t2.b` é uma coluna nula:

```
SELECT * FROM t1
WHERE (t1.a,t1.b) NOT IN (SELECT t2.a,t2.b FROM t2
                          WHERE where_condition);
```

As seguintes restrições se aplicam ao uso da materialização de subconsulta:

* Os tipos das expressões internas e externas devem corresponder. Por exemplo, o otimizador pode ser capaz de usar a materialização se ambas as expressões forem inteiras ou ambas forem decimais, mas não pode se ambas forem inteiras e a outra for decimal.
* A expressão interna não pode ser um `BLOB`.

O uso de  `EXPLAIN` com uma consulta fornece alguma indicação de se o otimizador usa a materialização de subconsulta:

* Comparado à execução da consulta que não usa materialização, `select_type` pode mudar de `DEPENDENT SUBQUERY` para `SUBQUERY`. Isso indica que, para uma subconsulta que seria executada uma vez por linha externa, a materialização permite que a subconsulta seja executada apenas uma vez.
* Para a saída `EXPLAIN` estendida, o texto exibido por um `SHOW WARNINGS` subsequente inclui `materialize` e `materialized-subquery`.

O MySQL também pode aplicar a materialização de subconsulta a uma única instrução `UPDATE` ou `DELETE` que utiliza um predicado de subconsulta `[NOT] IN` ou `[NOT] EXISTS`, desde que a instrução não utilize `ORDER BY` ou `LIMIT`, e que a materialização de subconsulta seja permitida por uma dica do otimizador ou pela configuração `optimizer_switch`.