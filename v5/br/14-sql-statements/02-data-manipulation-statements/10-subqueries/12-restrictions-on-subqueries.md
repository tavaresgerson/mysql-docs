#### 13.2.10.12 Restrições em Subqueries

* Em geral, você não pode modificar uma table e selecionar da mesma table em uma Subquery. Por exemplo, esta limitação se aplica a statements das seguintes formas:

  ```sql
  DELETE FROM t WHERE ... (SELECT ... FROM t ...);
  UPDATE t ... WHERE col = (SELECT ... FROM t ...);
  {INSERT|REPLACE} INTO t (SELECT ... FROM t ...);
  ```

  Exceção: A proibição anterior não se aplica se, para a table modificada, você estiver usando uma Derived Table e essa Derived Table for Materialized em vez de mesclada na Outer Query. (Veja [Seção 8.2.2.4, “Otimizando Derived Tables e Referências de View com Merging ou Materialization”](derived-table-optimization.html "8.2.2.4 Optimizing Derived Tables and View References with Merging or Materialization").) Exemplo:

  ```sql
  UPDATE t ... WHERE col = (SELECT * FROM (SELECT ... FROM t...) AS dt ...);
  ```

  Aqui, o resultado da Derived Table é Materialized como uma temporary table, de modo que as linhas relevantes em `t` já foram selecionadas no momento em que o Update em `t` ocorre.

* Operações de comparação de linha (Row comparison operations) são suportadas apenas parcialmente:

  + Para `expr [NOT] IN subquery`, *`expr`* pode ser uma *`n`*-tuple (especificada usando a sintaxe de construtor de linha) e a subquery pode retornar linhas de *`n`*-tuples. A sintaxe permitida é, portanto, expressa de forma mais específica como `row_constructor [NOT] IN table_subquery`

  + Para `expr op {ALL|ANY|SOME} subquery`, *`expr`* deve ser um valor scalar e a subquery deve ser uma column subquery; ela não pode retornar linhas de múltiplas colunas.

  Em outras palavras, para uma subquery que retorna linhas de *`n`*-tuples, isto é suportado:

  ```sql
  (expr_1, ..., expr_n) [NOT] IN table_subquery
  ```

  Mas isto não é suportado:

  ```sql
  (expr_1, ..., expr_n) op {ALL|ANY|SOME} subquery
  ```

  A razão para suportar row comparisons para `IN`, mas não para os outros, é que `IN` é implementado reescrevendo-o como uma sequência de comparações [`=`](comparison-operators.html#operator_equal) e operações [`AND`](logical-operators.html#operator_and). Essa abordagem não pode ser usada para `ALL`, `ANY` ou `SOME`.

* Subqueries na cláusula `FROM` não podem ser correlated subqueries. Elas são Materialized integralmente (avaliadas para produzir um Result Set) durante a Query Execution, então não podem ser avaliadas por linha da Outer Query. O Optimizer atrasa a Materialization até que o resultado seja necessário, o que pode permitir que a Materialization seja evitada. Veja [Seção 8.2.2.4, “Otimizando Derived Tables e Referências de View com Merging ou Materialization”](derived-table-optimization.html "8.2.2.4 Optimizing Derived Tables e View References com Merging ou Materialization").

* O MySQL não suporta `LIMIT` em Subqueries para certos operadores de Subquery:

  ```sql
  mysql> SELECT * FROM t1
         WHERE s1 IN (SELECT s2 FROM t2 ORDER BY s1 LIMIT 1);
  ERROR 1235 (42000): This version of MySQL does not yet support
   'LIMIT & IN/ALL/ANY/SOME subquery'
  ```

* O MySQL permite que uma subquery se refira a uma Stored Function que tenha efeitos colaterais de modificação de dados, como a inserção de linhas em uma table. Por exemplo, se `f()` inserir linhas, a seguinte Query pode modificar dados:

  ```sql
  SELECT ... WHERE x IN (SELECT f() ...);
  ```

  Este comportamento é uma extensão ao padrão SQL. No MySQL, ele pode produzir resultados não determinísticos porque `f()` pode ser executada um número diferente de vezes para diferentes execuções de uma determinada Query, dependendo de como o Optimizer escolhe lidar com ela.

  Para Replication baseada em Statement ou em formato misto, uma implicação desse indeterminismo é que tal Query pode produzir resultados diferentes na Source e em suas réplicas.