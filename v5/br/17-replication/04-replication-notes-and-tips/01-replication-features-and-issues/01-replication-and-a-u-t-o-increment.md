#### 16.4.1.1 Replication e AUTO_INCREMENT

A Replication baseada em Statement de valores `AUTO_INCREMENT`, [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id), e [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") é realizada corretamente, sujeita às seguintes exceções:

* Ao usar a Replication baseada em Statement antes do MySQL 5.7.1, as colunas `AUTO_INCREMENT` nas tabelas na replica devem corresponder às mesmas colunas na source; ou seja, colunas `AUTO_INCREMENT` devem ser replicadas para colunas `AUTO_INCREMENT`.

* Um Statement que invoca um trigger ou função que causa uma atualização em uma coluna `AUTO_INCREMENT` não é replicado corretamente usando a Replication baseada em Statement. Esses Statements são marcados como unsafe. (Bug #45677)

* Um [`INSERT`](insert.html "13.2.5 INSERT Statement") em uma tabela que possui uma Primary Key composta que inclui uma coluna `AUTO_INCREMENT` que não é a primeira coluna desta Primary Key composta não é seguro (safe) para logging ou Replication baseada em Statement. Esses Statements são marcados como unsafe. (Bug #11754117, Bug #45670)

  Este problema não afeta tabelas que usam o storage engine [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), visto que uma tabela `InnoDB` com uma coluna [AUTO_INCREMENT](glossary.html#glos_auto_increment "auto-increment") exige pelo menos uma Key onde a coluna auto-increment é a única ou a coluna mais à esquerda (leftmost).

* Adicionar uma coluna `AUTO_INCREMENT` a uma tabela com [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") pode não produzir a mesma ordenação das rows na replica e na source. Isso ocorre porque a ordem em que as rows são numeradas depende do storage engine específico usado para a tabela e da ordem em que as rows foram inseridas. Se for importante ter a mesma ordem na source e na replica, as rows devem ser ordenadas antes de atribuir um número `AUTO_INCREMENT`. Assumindo que você deseja adicionar uma coluna `AUTO_INCREMENT` a uma tabela `t1` que possui as colunas `col1` e `col2`, os seguintes Statements produzem uma nova tabela `t2` idêntica a `t1`, mas com uma coluna `AUTO_INCREMENT`:

  ```sql
  CREATE TABLE t2 LIKE t1;
  ALTER TABLE t2 ADD id INT AUTO_INCREMENT PRIMARY KEY;
  INSERT INTO t2 SELECT * FROM t1 ORDER BY col1, col2;
  ```

  Importante

  Para garantir a mesma ordenação tanto na source quanto na replica, a cláusula `ORDER BY` deve nomear *todas* as colunas de `t1`.

  As instruções recém-fornecidas estão sujeitas às limitações de [`CREATE TABLE ... LIKE`](create-table-like.html "13.1.18.3 CREATE TABLE ... LIKE Statement"): Definições de Foreign Key são ignoradas, assim como as opções de tabela `DATA DIRECTORY` e `INDEX DIRECTORY`. Se uma definição de tabela incluir alguma dessas características, crie `t2` usando um Statement [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") que seja idêntico ao usado para criar `t1`, mas com a adição da coluna `AUTO_INCREMENT`.

  Independentemente do método usado para criar e popular a cópia contendo a coluna `AUTO_INCREMENT`, o passo final é descartar (drop) a tabela original e depois renomear a cópia:

  ```sql
  DROP t1;
  ALTER TABLE t2 RENAME t1;
  ```

  Veja também [Seção B.3.6.1, “Problemas com ALTER TABLE”](alter-table-problems.html "B.3.6.1 Problemas com ALTER TABLE").