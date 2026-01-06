#### 16.4.1.1 Replicação e AUTO\_INCREMENT

A replicação baseada em declarações de valores de `AUTO_INCREMENT`, `LAST_INSERT_ID()` e `TIMESTAMP` é feita corretamente, sujeito às seguintes exceções:

- Ao usar a replicação baseada em declarações antes do MySQL 5.7.1, as colunas `AUTO_INCREMENT` nas tabelas da replica devem corresponder às mesmas colunas na fonte; ou seja, as colunas `AUTO_INCREMENT` devem ser replicadas para colunas `AUTO_INCREMENT`.

- Uma declaração que invoca um gatilho ou função que causa uma atualização em uma coluna `AUTO_INCREMENT` não é replicada corretamente usando a replicação baseada em declarações. Essas declarações são marcadas como inseguras. (Bug #45677)

- Uma inserção em uma tabela que possui uma chave primária composta que inclui uma coluna `AUTO_INCREMENT` que não é a primeira coluna dessa chave composta não é segura para registro baseado em instruções ou replicação. Essas instruções são marcadas como inseguras. (Bug #11754117, Bug #45670)

  Este problema não afeta tabelas que utilizam o mecanismo de armazenamento `InnoDB`, uma vez que uma tabela `InnoDB` com uma coluna AUTO\_INCREMENT requer pelo menos uma chave onde a coluna de autoincremento é a única ou a coluna mais à esquerda.

- Adicionar uma coluna `AUTO_INCREMENT` a uma tabela com `ALTER TABLE` pode não produzir a mesma ordem das linhas na replica e na fonte. Isso ocorre porque a ordem em que as linhas são numeradas depende do motor de armazenamento específico usado para a tabela e da ordem em que as linhas foram inseridas. Se é importante ter a mesma ordem na fonte e na replica, as linhas devem ser ordenadas antes de atribuir um número `AUTO_INCREMENT`. Supondo que você queira adicionar uma coluna `AUTO_INCREMENT` a uma tabela `t1` que tem as colunas `col1` e `col2`, as seguintes instruções produzem uma nova tabela `t2` idêntica a `t1`, mas com uma coluna `AUTO_INCREMENT`:

  ```sql
  CREATE TABLE t2 LIKE t1;
  ALTER TABLE t2 ADD id INT AUTO_INCREMENT PRIMARY KEY;
  INSERT INTO t2 SELECT * FROM t1 ORDER BY col1, col2;
  ```

  Importante

  Para garantir a mesma ordem tanto na fonte quanto na replica, a cláusula `ORDER BY` deve nomear *todas* as colunas de `t1`.

  As instruções fornecidas acima estão sujeitas às limitações do `CREATE TABLE ... LIKE`: as definições de chave estrangeira são ignoradas, assim como as opções de tabelas `DATA DIRECTORY` e `INDEX DIRECTORY`. Se uma definição de tabela incluir alguma dessas características, crie `t2` usando uma declaração `CREATE TABLE` que seja idêntica àquela usada para criar `t1`, mas com a adição da coluna `AUTO_INCREMENT`.

  Independentemente do método usado para criar e povoar a cópia com a coluna `AUTO_INCREMENT`, a etapa final é excluir a tabela original e, em seguida, renomear a cópia:

  ```sql
  DROP t1;
  ALTER TABLE t2 RENAME t1;
  ```

  Veja também Seção B.3.6.1, “Problemas com ALTER TABLE”.
