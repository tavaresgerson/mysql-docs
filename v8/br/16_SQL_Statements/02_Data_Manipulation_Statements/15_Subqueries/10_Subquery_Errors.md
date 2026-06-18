#### 15.2.15.10 Erros de subconsultas

Existem alguns erros que se aplicam apenas a subconsultas. Esta seção descreve-os.

- Sintaxe de subconsulta não suportada:

  ```
  ERROR 1235 (ER_NOT_SUPPORTED_YET)
  SQLSTATE = 42000
  Message = "This version of MySQL doesn't yet support
  'LIMIT & IN/ALL/ANY/SOME subquery'"
  ```

  Isso significa que o MySQL não suporta declarações como as seguintes:

  ```
  SELECT * FROM t1 WHERE s1 IN (SELECT s2 FROM t2 ORDER BY s1 LIMIT 1)
  ```

- Número incorreto de colunas da subconsulta:

  ```
  ERROR 1241 (ER_OPERAND_COL)
  SQLSTATE = 21000
  Message = "Operand should contain 1 column(s)"
  ```

  Esse erro ocorre em casos como este:

  ```
  SELECT (SELECT column1, column2 FROM t2) FROM t1;
  ```

  Você pode usar uma subconsulta que retorne várias colunas, se o propósito for a comparação de linhas. Em outros contextos, a subconsulta deve ser um operando escalar. Veja a Seção 15.2.15.5, “Subconsultas de Linhas”.

- Número incorreto de linhas da subconsulta:

  ```
  ERROR 1242 (ER_SUBSELECT_NO_1_ROW)
  SQLSTATE = 21000
  Message = "Subquery returns more than 1 row"
  ```

  Esse erro ocorre para declarações em que a subconsulta deve retornar no máximo uma linha, mas retorna várias linhas. Considere o seguinte exemplo:

  ```
  SELECT * FROM t1 WHERE column1 = (SELECT column1 FROM t2);
  ```

  Se `SELECT column1 FROM t2` retornar apenas uma linha, a consulta anterior funciona. Se a subconsulta retornar mais de uma linha, ocorrerá o erro 1242. Nesse caso, a consulta deve ser reescrita da seguinte forma:

  ```
  SELECT * FROM t1 WHERE column1 = ANY (SELECT column1 FROM t2);
  ```

- Tabela usada incorretamente na subconsulta:

  ```
  Error 1093 (ER_UPDATE_TABLE_USED)
  SQLSTATE = HY000
  Message = "You can't specify target table 'x'
  for update in FROM clause"
  ```

  Esse erro ocorre em casos como os seguintes, que tenta modificar uma tabela e selecionar da mesma tabela na subconsulta:

  ```
  UPDATE t1 SET column2 = (SELECT MAX(column1) FROM t1);
  ```

  Você pode usar uma expressão de tabela comum ou uma tabela derivada para contornar isso. Veja a Seção 15.2.15.12, “Restrições em subconsultas”.

No MySQL 8.0.19 e versões posteriores, todos os erros descritos nesta seção também se aplicam ao uso de `TABLE` em subconsultas.

Para os motores de armazenamento transacionais, o erro de uma subconsulta faz com que toda a instrução falhe. Para os motores de armazenamento não transacionais, as modificações de dados feitas antes do erro são preservadas.
