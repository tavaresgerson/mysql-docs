#### 15.2.15.12 Restrições sobre subconsultas

* Em geral, você não pode modificar uma tabela e selecionar dados da mesma tabela em uma subconsulta. Por exemplo, essa restrição se aplica a declarações dos seguintes formatos:

  ```
  DELETE FROM t WHERE ... (SELECT ... FROM t ...);
  UPDATE t ... WHERE col = (SELECT ... FROM t ...);
  {INSERT|REPLACE} INTO t (SELECT ... FROM t ...);
  ```

  Exceção: A proibição anterior não se aplica se, para a tabela modificada, você estiver usando uma tabela derivada e essa tabela derivada estiver materializada, em vez de ser mesclada na consulta externa. (Veja a Seção 10.2.2.4, “Otimização de tabelas derivadas, referências a vistas e expressões de tabela comuns com mesclagem ou materialização”.) Exemplo:

  ```
  UPDATE t ... WHERE col = (SELECT * FROM (SELECT ... FROM t...) AS dt ...);
  ```

  Aqui, o resultado da tabela derivada é materializado como uma tabela temporária, então as linhas relevantes em `t` já foram selecionadas no momento em que a atualização em `t` ocorre.

* Em geral, você pode influenciar o otimizador para materializar uma tabela derivada adicionando uma dica de otimizador `NO_MERGE`. Veja a Seção 10.9.3, “Dicas de otimizador”.

* Operações de comparação de linhas são suportadas apenas parcialmente:

  + Para `expr [NOT] IN subquery`, *`expr`* pode ser um *`n`*-tuplo (especificado usando a sintaxe de construtor de linha) e a subconsulta pode retornar linhas de *`n`*-tuplos. A sintaxe permitida é, portanto, expressa de forma mais específica como `construtor_de_linha [NOT] IN subconsulta_tabela`

  + Para `expr op {ALL|ANY|SOME} subquery`, *`expr`* deve ser um valor escalar e a subconsulta deve ser uma subconsulta de coluna; ela não pode retornar linhas de múltiplos colunas.

Por outras palavras, para uma subconsulta que retorna linhas de *`n`*-tuplos, isso é suportado:

```
  (expr_1, ..., expr_n) [NOT] IN table_subquery
  ```

Mas isso não é suportado:

```
  (expr_1, ..., expr_n) op {ALL|ANY|SOME} subquery
  ```

A razão para suportar comparações de linhas para `IN`, mas não para as outras, é que `IN` é implementada reescrevendo-a como uma sequência de comparações `=` e operações `AND`. Essa abordagem não pode ser usada para `ALL`, `ANY` ou `SOME`.

* O MySQL não suporta `LIMIT` em subconsultas para certos operadores de subconsulta:

  ```
  mysql> SELECT * FROM t1
         WHERE s1 IN (SELECT s2 FROM t2 ORDER BY s1 LIMIT 1);
  ERROR 1235 (42000): This version of MySQL doesn't yet support
   'LIMIT & IN/ALL/ANY/SOME subquery'
  ```

  Veja a Seção 15.2.15.10, “Erros de subconsulta”.

* O MySQL permite que uma subconsulta faça referência a uma função armazenada que tenha efeitos colaterais que modifiquem dados, como inserir linhas em uma tabela. Por exemplo, se `f()` insere linhas, a seguinte consulta pode modificar dados:

  ```
  SELECT ... WHERE x IN (SELECT f() ...);
  ```

  Esse comportamento é uma extensão do padrão SQL. No MySQL, pode produzir resultados não determinísticos porque `f()` pode ser executado um número diferente de vezes para diferentes execuções de uma consulta dada, dependendo de como o otimizador a trata.

  Para a replicação baseada em declarações ou de formato misto, uma implicação desse indeterminismo é que tal consulta pode produzir resultados diferentes na fonte e em suas réplicas.