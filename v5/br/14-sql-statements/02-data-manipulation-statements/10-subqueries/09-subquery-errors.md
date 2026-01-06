#### 13.2.10.9 Erros de subconsultas

Existem alguns erros que se aplicam apenas a subconsultas. Esta seção descreve-os.

- Sintaxe de subconsulta não suportada:

  ```sql
  ERROR 1235 (ER_NOT_SUPPORTED_YET)
  SQLSTATE = 42000
  Message = "This version of MySQL does not yet support
  'LIMIT & IN/ALL/ANY/SOME subquery'"
  ```

  Isso significa que o MySQL não suporta declarações do seguinte formato:

  ```sql
  SELECT * FROM t1 WHERE s1 IN (SELECT s2 FROM t2 ORDER BY s1 LIMIT 1)
  ```

- Número incorreto de colunas da subconsulta:

  ```sql
  ERROR 1241 (ER_OPERAND_COL)
  SQLSTATE = 21000
  Message = "Operand should contain 1 column(s)"
  ```

  Esse erro ocorre em casos como este:

  ```sql
  SELECT (SELECT column1, column2 FROM t2) FROM t1;
  ```

  Você pode usar uma subconsulta que retorne várias colunas, se o propósito for a comparação de linhas. Em outros contextos, a subconsulta deve ser um operando escalar. Veja Seção 13.2.10.5, “Subconsultas de Linhas”.

- Número incorreto de linhas da subconsulta:

  ```sql
  ERROR 1242 (ER_SUBSELECT_NO_1_ROW)
  SQLSTATE = 21000
  Message = "Subquery returns more than 1 row"
  ```

  Esse erro ocorre para declarações em que a subconsulta deve retornar no máximo uma linha, mas retorna várias linhas. Considere o seguinte exemplo:

  ```sql
  SELECT * FROM t1 WHERE column1 = (SELECT column1 FROM t2);
  ```

  Se `SELECT column1 FROM t2` retornar apenas uma linha, a consulta anterior funciona. Se a subconsulta retornar mais de uma linha, ocorrerá o erro 1242. Nesse caso, a consulta deve ser reescrita da seguinte forma:

  ```sql
  SELECT * FROM t1 WHERE column1 = ANY (SELECT column1 FROM t2);
  ```

- Tabela usada incorretamente na subconsulta:

  ```sql
  Error 1093 (ER_UPDATE_TABLE_USED)
  SQLSTATE = HY000
  Message = "You can't specify target table 'x'
  for update in FROM clause"
  ```

  Esse erro ocorre em casos como os seguintes, que tenta modificar uma tabela e selecionar da mesma tabela na subconsulta:

  ```sql
  UPDATE t1 SET column2 = (SELECT MAX(column1) FROM t1);
  ```

  Você pode usar uma subconsulta para atribuição dentro de uma instrução `UPDATE` porque as subconsultas são legais em instruções `UPDATE` e `DELETE` assim como em instruções `SELECT`. No entanto, você não pode usar a mesma tabela (neste caso, a tabela `t1`) tanto para a cláusula `FROM` da subconsulta quanto para o alvo de atualização.

Para os motores de armazenamento transacionais, o erro de uma subconsulta faz com que toda a instrução falhe. Para os motores de armazenamento não transacionais, as modificações de dados feitas antes do erro são preservadas.
