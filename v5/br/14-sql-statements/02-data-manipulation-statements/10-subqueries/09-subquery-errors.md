#### 13.2.10.9 Erros em Subqueries

Existem alguns erros que se aplicam apenas a subqueries. Esta seção os descreve.

* Syntax de subquery não suportada:

  ```sql
  ERROR 1235 (ER_NOT_SUPPORTED_YET)
  SQLSTATE = 42000
  Message = "This version of MySQL does not yet support
  'LIMIT & IN/ALL/ANY/SOME subquery'"
  ```

  Isso significa que o MySQL não suporta comandos do seguinte formato:

  ```sql
  SELECT * FROM t1 WHERE s1 IN (SELECT s2 FROM t2 ORDER BY s1 LIMIT 1)
  ```

* Número incorreto de Columns de uma subquery:

  ```sql
  ERROR 1241 (ER_OPERAND_COL)
  SQLSTATE = 21000
  Message = "Operand should contain 1 column(s)"
  ```

  Este erro ocorre em casos como este:

  ```sql
  SELECT (SELECT column1, column2 FROM t2) FROM t1;
  ```

  Você pode usar uma subquery que retorna múltiplas columns, se o propósito for a comparação de Row. Em outros contextos, a subquery deve ser um operando escalar. Consulte [Section 13.2.10.5, “Row Subqueries”](row-subqueries.html "13.2.10.5 Row Subqueries").

* Número incorreto de Rows de uma subquery:

  ```sql
  ERROR 1242 (ER_SUBSELECT_NO_1_ROW)
  SQLSTATE = 21000
  Message = "Subquery returns more than 1 row"
  ```

  Este erro ocorre em comandos onde a subquery deve retornar no máximo uma Row, mas retorna múltiplas Rows. Considere o seguinte exemplo:

  ```sql
  SELECT * FROM t1 WHERE column1 = (SELECT column1 FROM t2);
  ```

  Se `SELECT column1 FROM t2` retornar apenas uma Row, a Query anterior funciona. Se a subquery retornar mais de uma Row, ocorre o erro 1242. Nesse caso, a Query deve ser reescrita como:

  ```sql
  SELECT * FROM t1 WHERE column1 = ANY (SELECT column1 FROM t2);
  ```

* Uso incorreto de table na subquery:

  ```sql
  Error 1093 (ER_UPDATE_TABLE_USED)
  SQLSTATE = HY000
  Message = "You can't specify target table 'x'
  for update in FROM clause"
  ```

  Este erro ocorre em casos como o seguinte, que tenta modificar uma table e selecionar a partir da mesma table na subquery:

  ```sql
  UPDATE t1 SET column2 = (SELECT MAX(column1) FROM t1);
  ```

  Você pode usar uma subquery para atribuição dentro de um comando [`UPDATE`](update.html "13.2.11 UPDATE Statement") porque subqueries são permitidas em comandos [`UPDATE`](update.html "13.2.11 UPDATE Statement") e [`DELETE`](delete.html "13.2.2 DELETE Statement"), assim como em comandos [`SELECT`](select.html "13.2.9 SELECT Statement"). No entanto, você não pode usar a mesma table (neste caso, a table `t1`) tanto para a cláusula `FROM` da subquery quanto para o alvo do UPDATE.

Para Storage Engines transacionais, a falha de uma subquery causa a falha de todo o comando. Para Storage Engines não transacionais, as modificações de dados feitas antes que o erro fosse encontrado são preservadas.