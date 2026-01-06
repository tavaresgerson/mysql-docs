#### 13.2.10.10 Otimizando subconsultas

O desenvolvimento está em andamento, então nenhuma dica de otimização é confiável a longo prazo. A lista a seguir fornece alguns truques interessantes que você pode querer experimentar. Veja também Seção 8.2.2, “Otimização de Subconsultas, Tabelas Derivadas e Referências de Visualização”.

- Use cláusulas de subconsulta que afetam o número ou a ordem das linhas na subconsulta. Por exemplo:

  ```sql
  SELECT * FROM t1 WHERE t1.column1 IN
    (SELECT column1 FROM t2 ORDER BY column1);
  SELECT * FROM t1 WHERE t1.column1 IN
    (SELECT DISTINCT column1 FROM t2);
  SELECT * FROM t1 WHERE EXISTS
    (SELECT * FROM t2 LIMIT 1);
  ```

- Substitua uma junção por uma subconsulta. Por exemplo, tente o seguinte:

  ```sql
  SELECT DISTINCT column1 FROM t1 WHERE t1.column1 IN (
    SELECT column1 FROM t2);
  ```

  Em vez disso:

  ```sql
  SELECT DISTINCT t1.column1 FROM t1, t2
    WHERE t1.column1 = t2.column1;
  ```

- Algumas subconsultas podem ser transformadas em junções para compatibilidade com versões mais antigas do MySQL que não suportam subconsultas. No entanto, em alguns casos, a conversão de uma subconsulta em uma junção pode melhorar o desempenho. Veja Seção 13.2.10.11, “Reescrita de Subconsultas como Junções”.

- Mude as cláusulas de fora para dentro da subconsulta. Por exemplo, use esta consulta:

  ```sql
  SELECT * FROM t1
    WHERE s1 IN (SELECT s1 FROM t1 UNION ALL SELECT s1 FROM t2);
  ```

  Em vez dessa consulta:

  ```sql
  SELECT * FROM t1
    WHERE s1 IN (SELECT s1 FROM t1) OR s1 IN (SELECT s1 FROM t2);
  ```

  Para outro exemplo, use esta consulta:

  ```sql
  SELECT (SELECT column1 + 5 FROM t1) FROM t2;
  ```

  Em vez dessa consulta:

  ```sql
  SELECT (SELECT column1 FROM t1) + 5 FROM t2;
  ```

- Use uma subconsulta de linha em vez de uma subconsulta correlacionada. Por exemplo, use esta consulta:

  ```sql
  SELECT * FROM t1
    WHERE (column1,column2) IN (SELECT column1,column2 FROM t2);
  ```

  Em vez dessa consulta:

  ```sql
  SELECT * FROM t1
    WHERE EXISTS (SELECT * FROM t2 WHERE t2.column1=t1.column1
                  AND t2.column2=t1.column2);
  ```

- Use `NOT (a = ANY (...))` em vez de `a <> ALL (...)`

- Use `x = ANY (tabela contendo (1,2))` em vez de `x=1 OU x=2`.

- Use `= ANY` em vez de `EXISTS`.

- Para subconsultas não correlacionadas que sempre retornam uma única linha, `IN` é sempre mais lento que `=`. Por exemplo, use esta consulta:

  ```sql
  SELECT * FROM t1
    WHERE t1.col_name = (SELECT a FROM t2 WHERE b = some_const);
  ```

  Em vez dessa consulta:

  ```sql
  SELECT * FROM t1
    WHERE t1.col_name IN (SELECT a FROM t2 WHERE b = some_const);
  ```

Esses truques podem fazer com que os programas funcionem mais rápido ou mais devagar. Usando as facilidades do MySQL, como a função `BENCHMARK()`, você pode ter uma ideia do que ajuda na sua situação. Veja Seção 12.15, “Funções de Informação”.

Algumas otimizações que o próprio MySQL faz são:

- O MySQL executa subconsultas não correlacionadas apenas uma vez. Use `EXPLAIN` para garantir que uma subconsulta específica realmente não seja correlacionada.

- O MySQL reescreve as subconsultas `IN`, `ALL`, `ANY` e `SOME` na tentativa de aproveitar a possibilidade de que as colunas da lista de seleção na subconsulta estejam indexadas.

- O MySQL substitui as subconsultas da seguinte forma por uma função de busca em índice, que o `EXPLAIN` descreve como um tipo especial de junção (`unique_subquery` ou `index_subquery`):

  ```sql
  ... IN (SELECT indexed_column FROM single_table ...)
  ```

- O MySQL melhora as expressões da seguinte forma com uma expressão que envolve `MIN()` ou `MAX()`, a menos que sejam envolvidos valores `NULL` ou conjuntos vazios:

  ```sql
  value {ALL|ANY|SOME} {> | < | >= | <=} (uncorrelated subquery)
  ```

  Por exemplo, esta cláusula `WHERE`:

  ```sql
  WHERE 5 > ALL (SELECT x FROM t)
  ```

  pode ser tratado pelo otimizador da seguinte forma:

  ```sql
  WHERE 5 > (SELECT MAX(x) FROM t)
  ```

Veja também MySQL Internals: Como o MySQL Transforma Subconsultas.
