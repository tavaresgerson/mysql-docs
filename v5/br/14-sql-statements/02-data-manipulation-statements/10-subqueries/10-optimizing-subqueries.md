#### 13.2.10.10 Otimizando Subqueries

O desenvolvimento é contínuo, portanto, nenhuma dica de otimização é confiável a longo prazo. A lista a seguir fornece alguns truques interessantes que você pode querer experimentar. Consulte também [Seção 8.2.2, “Otimizando Subqueries, Derived Tables, and View References”](subquery-optimization.html "8.2.2 Otimizando Subqueries, Derived Tables, and View References").

* Use cláusulas de subquery que afetam o número ou a ordem das linhas na subquery. Por exemplo:

  ```sql
  SELECT * FROM t1 WHERE t1.column1 IN
    (SELECT column1 FROM t2 ORDER BY column1);
  SELECT * FROM t1 WHERE t1.column1 IN
    (SELECT DISTINCT column1 FROM t2);
  SELECT * FROM t1 WHERE EXISTS
    (SELECT * FROM t2 LIMIT 1);
  ```

* Substitua um JOIN por uma subquery. Por exemplo, tente isto:

  ```sql
  SELECT DISTINCT column1 FROM t1 WHERE t1.column1 IN (
    SELECT column1 FROM t2);
  ```

  Em vez disto:

  ```sql
  SELECT DISTINCT t1.column1 FROM t1, t2
    WHERE t1.column1 = t2.column1;
  ```

* Algumas subqueries podem ser transformadas em JOINs para compatibilidade com versões mais antigas do MySQL que não suportam subqueries. No entanto, em alguns casos, converter uma subquery para um JOIN pode melhorar o desempenho. Consulte [Seção 13.2.10.11, “Reescrevendo Subqueries como Joins”](rewriting-subqueries.html "13.2.10.11 Rewriting Subqueries as Joins").

* Mova cláusulas de fora para dentro da subquery. Por exemplo, use esta Query:

  ```sql
  SELECT * FROM t1
    WHERE s1 IN (SELECT s1 FROM t1 UNION ALL SELECT s1 FROM t2);
  ```

  Em vez desta Query:

  ```sql
  SELECT * FROM t1
    WHERE s1 IN (SELECT s1 FROM t1) OR s1 IN (SELECT s1 FROM t2);
  ```

  Para outro exemplo, use esta Query:

  ```sql
  SELECT (SELECT column1 + 5 FROM t1) FROM t2;
  ```

  Em vez desta Query:

  ```sql
  SELECT (SELECT column1 FROM t1) + 5 FROM t2;
  ```

* Use uma subquery de linha (row subquery) em vez de uma subquery correlacionada (correlated subquery). Por exemplo, use esta Query:

  ```sql
  SELECT * FROM t1
    WHERE (column1,column2) IN (SELECT column1,column2 FROM t2);
  ```

  Em vez desta Query:

  ```sql
  SELECT * FROM t1
    WHERE EXISTS (SELECT * FROM t2 WHERE t2.column1=t1.column1
                  AND t2.column2=t1.column2);
  ```

* Use `NOT (a = ANY (...))` em vez de `a <> ALL (...)`.

* Use `x = ANY (table containing (1,2))` em vez de `x=1 OR x=2`.

* Use `= ANY` em vez de `EXISTS`.

* Para subqueries não correlacionadas que sempre retornam uma linha, `IN` é sempre mais lento do que `=`. Por exemplo, use esta Query:

  ```sql
  SELECT * FROM t1
    WHERE t1.col_name = (SELECT a FROM t2 WHERE b = some_const);
  ```

  Em vez desta Query:

  ```sql
  SELECT * FROM t1
    WHERE t1.col_name IN (SELECT a FROM t2 WHERE b = some_const);
  ```

Estes truques podem fazer com que os programas executem mais rápido ou mais devagar. Usando recursos do MySQL como a função [`BENCHMARK()`](information-functions.html#function_benchmark), você pode ter uma ideia do que ajuda na sua própria situação. Consulte [Seção 12.15, “Information Functions”](information-functions.html "12.15 Information Functions").

Algumas otimizações que o próprio MySQL realiza são:

* O MySQL executa subqueries não correlacionadas apenas uma vez. Use [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") para garantir que uma determinada subquery seja realmente não correlacionada.

* O MySQL reescreve as subqueries `IN`, `ALL`, `ANY` e `SOME` na tentativa de tirar proveito da possibilidade de as colunas da lista de seleção (select-list columns) na subquery estarem indexadas.

* O MySQL substitui subqueries do seguinte formato por uma função de busca de Index (index-lookup function), que o [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") descreve como um tipo de JOIN especial ([`unique_subquery`](explain-output.html#jointype_unique_subquery) ou [`index_subquery`](explain-output.html#jointype_index_subquery)):

  ```sql
  ... IN (SELECT indexed_column FROM single_table ...)
  ```

* O MySQL aprimora expressões do seguinte formato com uma expressão que envolve [`MIN()`](aggregate-functions.html#function_min) ou [`MAX()`](aggregate-functions.html#function_max), a menos que valores `NULL` ou conjuntos vazios estejam envolvidos:

  ```sql
  value {ALL|ANY|SOME} {> | < | >= | <=} (uncorrelated subquery)
  ```

  Por exemplo, esta cláusula `WHERE`:

  ```sql
  WHERE 5 > ALL (SELECT x FROM t)
  ```

  pode ser tratada pelo Optimizer desta forma:

  ```sql
  WHERE 5 > (SELECT MAX(x) FROM t)
  ```

Consulte também [MySQL Internals: How MySQL Transforms Subqueries](/doc/internals/en/transformations.html).