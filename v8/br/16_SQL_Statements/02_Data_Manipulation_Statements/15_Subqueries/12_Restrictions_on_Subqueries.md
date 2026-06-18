#### 15.2.15.12 Restrições sobre subconsultas

- Em geral, você não pode modificar uma tabela e selecionar dela em uma subconsulta. Por exemplo, essa limitação se aplica a declarações dos seguintes formatos:

  ```
  DELETE FROM t WHERE ... (SELECT ... FROM t ...);
  UPDATE t ... WHERE col = (SELECT ... FROM t ...);
  {INSERT|REPLACE} INTO t (SELECT ... FROM t ...);
  ```

  Exceção: A proibição anterior não se aplica se você estiver usando uma tabela derivada para a tabela modificada e essa tabela derivada estiver materializada, em vez de estar integrada à consulta externa. (Consulte a Seção 10.2.2.4, “Otimizando tabelas derivadas, referências de visualizações e expressões de tabela comuns com integração ou materialização”). Exemplo:

  ```
  UPDATE t ... WHERE col = (SELECT * FROM (SELECT ... FROM t...) AS dt ...);
  ```

  Aqui, o resultado da tabela derivada é materializado como uma tabela temporária, portanto, as linhas relevantes em `t` já foram selecionadas no momento em que a atualização para `t` ocorre.

  Em geral, você pode influenciar o otimizador para materializar uma tabela derivada adicionando uma dica de otimizador `NO_MERGE`. Veja a Seção 10.9.3, “Dicas de Otimizador”.

- As operações de comparação de linhas são suportadas apenas parcialmente:

  - Para `expr [NOT] IN subquery`, `expr` pode ser um `n`-tuplo (especificado usando a sintaxe do construtor de linha) e a subconsulta pode retornar linhas de `n`-tuplos. A sintaxe permitida é, portanto, expressa de forma mais específica como `row_constructor [NOT] IN table_subquery`

  - Para `expr op {ALL|ANY|SOME} subquery`, `expr` deve ser um valor escalar e a subconsulta deve ser uma subconsulta de coluna; ela não pode retornar linhas com múltiplas colunas.

  Em outras palavras, para uma subconsulta que retorna linhas de tuplas de `n`, isso é suportado:

  ```
  (expr_1, ..., expr_n) [NOT] IN table_subquery
  ```

  Mas isso não é suportado:

  ```
  (expr_1, ..., expr_n) op {ALL|ANY|SOME} subquery
  ```

  A razão para suportar comparações de linhas para `IN`, mas não para os outros é que `IN` é implementado reescrevendo-o como uma sequência de comparações de `=` e operações de `AND`. Essa abordagem não pode ser usada para `ALL`, `ANY` ou `SOME`.

- Antes do MySQL 8.0.14, as subconsultas na cláusula `FROM` não podem ser subconsultas correlacionadas. Elas são materializadas no todo (avaliadas para produzir um conjunto de resultados) durante a execução da consulta, portanto, não podem ser avaliadas por linha da consulta externa. O otimizador adista a materialização até que o resultado seja necessário, o que pode permitir que a materialização seja evitada. Veja a Seção 10.2.2.4, “Otimizando tabelas derivadas, referências de visualizações e expressões de tabela comuns com fusão ou materialização”.

- O MySQL não suporta `LIMIT` em subconsultas para certos operadores de subconsulta:

  ```
  mysql> SELECT * FROM t1
         WHERE s1 IN (SELECT s2 FROM t2 ORDER BY s1 LIMIT 1);
  ERROR 1235 (42000): This version of MySQL doesn't yet support
   'LIMIT & IN/ALL/ANY/SOME subquery'
  ```

  Consulte a Seção 15.2.15.10, “Erros de subconsultas”.

- O MySQL permite que uma subconsulta faça referência a uma função armazenada que tenha efeitos colaterais que modifiquem dados, como inserir linhas em uma tabela. Por exemplo, se `f()` insere linhas, a seguinte consulta pode modificar os dados:

  ```
  SELECT ... WHERE x IN (SELECT f() ...);
  ```

  Esse comportamento é uma extensão do padrão SQL. No MySQL, ele pode produzir resultados não determinísticos porque `f()` pode ser executado um número diferente de vezes para diferentes execuções de uma consulta específica, dependendo de como o otimizador decide lidar com isso.

  Para a replicação baseada em declarações ou em formato misto, uma implicação desse indeterminismo é que uma consulta desse tipo pode produzir resultados diferentes na fonte e em suas réplicas.
