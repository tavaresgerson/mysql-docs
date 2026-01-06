#### 13.2.10.12 Restrições sobre subconsultas

- Em geral, você não pode modificar uma tabela e selecionar dela em uma subconsulta. Por exemplo, essa limitação se aplica a declarações dos seguintes formatos:

  ```sql
  DELETE FROM t WHERE ... (SELECT ... FROM t ...);
  UPDATE t ... WHERE col = (SELECT ... FROM t ...);
  {INSERT|REPLACE} INTO t (SELECT ... FROM t ...);
  ```

  Exceção: A proibição anterior não se aplica se você estiver usando uma tabela derivada para a tabela modificada e essa tabela derivada estiver materializada, em vez de estar integrada à consulta externa. (Consulte Seção 8.2.2.4, “Otimização de tabelas derivadas e referências de visualizações com junção ou materialização”). Exemplo:

  ```sql
  UPDATE t ... WHERE col = (SELECT * FROM (SELECT ... FROM t...) AS dt ...);
  ```

  Aqui, o resultado da tabela derivada é materializado como uma tabela temporária, portanto, as linhas relevantes em `t` já foram selecionadas no momento em que a atualização em `t` ocorre.

- As operações de comparação de linhas são suportadas apenas parcialmente:

  - Para `expr [NOT] IN subquery`, *`expr`* pode ser um *`n`*-tuplo (especificado usando a sintaxe do construtor de linha) e a subconsulta pode retornar linhas de *`n`*-tuplos. A sintaxe permitida é, portanto, expressa de forma mais específica como `construtor_linha [NOT] IN subconsulta_tabela`

  - Para `expr op {ALL|ANY|SOME} subquery`, *`expr`* deve ser um valor escalar e a subconsulta deve ser uma subconsulta de coluna; ela não pode retornar linhas com múltiplas colunas.

  Em outras palavras, para uma subconsulta que retorna linhas de *`n`*-tuplas, isso é suportado:

  ```sql
  (expr_1, ..., expr_n) [NOT] IN table_subquery
  ```

  Mas isso não é suportado:

  ```sql
  (expr_1, ..., expr_n) op {ALL|ANY|SOME} subquery
  ```

  A razão para suportar comparações de linhas para `IN`, mas não para as outras é que `IN` é implementado reescrevendo-o como uma sequência de comparações de `=` e operações de `AND`. Essa abordagem não pode ser usada para `ALL`, `ANY` ou `SOME`.

- As subconsultas na cláusula `FROM` não podem ser subconsultas correlacionadas. Elas são materializadas no todo (avaliadas para produzir um conjunto de resultados) durante a execução da consulta, portanto, não podem ser avaliadas por linha da consulta externa. O otimizador adista a materialização até que o resultado seja necessário, o que pode permitir que a materialização seja evitada. Veja Seção 8.2.2.4, “Otimização de tabelas derivadas e referências de visualizações com fusão ou materialização”.

- O MySQL não suporta `LIMIT` em subconsultas para certos operadores de subconsulta:

  ```sql
  mysql> SELECT * FROM t1
         WHERE s1 IN (SELECT s2 FROM t2 ORDER BY s1 LIMIT 1);
  ERROR 1235 (42000): This version of MySQL does not yet support
   'LIMIT & IN/ALL/ANY/SOME subquery'
  ```

- O MySQL permite que uma subconsulta faça referência a uma função armazenada que tenha efeitos colaterais que modifiquem dados, como inserir linhas em uma tabela. Por exemplo, se `f()` insere linhas, a seguinte consulta pode modificar os dados:

  ```sql
  SELECT ... WHERE x IN (SELECT f() ...);
  ```

  Esse comportamento é uma extensão do padrão SQL. No MySQL, ele pode produzir resultados não determinísticos porque o `f()` pode ser executado um número diferente de vezes para diferentes execuções de uma consulta específica, dependendo de como o otimizador decide lidar com isso.

  Para a replicação baseada em declarações ou em formato misto, uma implicação desse indeterminismo é que uma consulta desse tipo pode produzir resultados diferentes na fonte e em suas réplicas.
