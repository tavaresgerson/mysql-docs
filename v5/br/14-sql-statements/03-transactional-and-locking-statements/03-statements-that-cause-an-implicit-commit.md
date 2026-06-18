### 13.3.3 Statements que Causam um Commit Implícito

As *statements* listadas nesta seção (e quaisquer sinônimos para elas) encerram implicitamente qualquer *transaction* ativa na sessão atual, como se você tivesse executado um `COMMIT` antes de executar a *statement*.

A maioria dessas *statements* também causa um *commit* implícito após a execução. A intenção é tratar cada uma dessas *statements* em sua própria *transaction* especial porque ela não pode ser revertida (*rolled back*) de qualquer maneira. *Statements* de controle de *transaction* e *locking* são exceções: se um *commit* implícito ocorrer antes da execução, outro não ocorrerá depois.

* **Statements de Data Definition Language (DDL) que definem ou modificam objetos do Database.** `ALTER DATABASE ... UPGRADE DATA DIRECTORY NAME`, `ALTER EVENT`, `ALTER PROCEDURE`, `ALTER SERVER`, `ALTER TABLE`, `ALTER TABLESPACE`, `ALTER VIEW`, `CREATE DATABASE`, `CREATE EVENT`, `CREATE INDEX`, `CREATE PROCEDURE`, `CREATE SERVER`, `CREATE TABLE`, `CREATE TABLESPACE`, `CREATE TRIGGER`, `CREATE VIEW`, `DROP DATABASE`, `DROP EVENT`, `DROP INDEX`, `DROP PROCEDURE`, `DROP SERVER`, `DROP TABLE`, `DROP TABLESPACE`, `DROP TRIGGER`, `DROP VIEW`, `INSTALL PLUGIN`, `RENAME TABLE`, `TRUNCATE TABLE`, `UNINSTALL PLUGIN`.

  `ALTER FUNCTION`, `CREATE FUNCTION` e `DROP FUNCTION` também causam um *commit* implícito quando usadas com *stored functions*, mas não com *loadable functions*. (`ALTER FUNCTION` só pode ser usada com *stored functions*.)

  As *statements* `CREATE TABLE` e `DROP TABLE` não fazem *commit* de uma *transaction* se a palavra-chave `TEMPORARY` for usada. (Isso não se aplica a outras operações em *temporary tables*, como `ALTER TABLE` e `CREATE INDEX`, que causam um *commit*.) No entanto, embora nenhum *commit* implícito ocorra, a *statement* também não pode ser revertida (*rolled back*), o que significa que o uso de tais *statements* causa violação da atomicidade *transactional*. Por exemplo, se você usar `CREATE TEMPORARY TABLE` e depois fizer *roll back* da *transaction*, a *table* permanece em existência.

  A *statement* `CREATE TABLE` no `InnoDB` é processada como uma única *transaction*. Isso significa que um `ROLLBACK` por parte do usuário não desfaz *statements* `CREATE TABLE` que o usuário executou durante aquela *transaction*.

  `CREATE TABLE ... SELECT` causa um *commit* implícito antes e depois que a *statement* é executada quando você está criando *tables* não-temporárias. (Nenhum *commit* ocorre para `CREATE TEMPORARY TABLE ... SELECT`.)

* **Statements que implicitamente usam ou modificam tables no database `mysql`.** `ALTER USER`, `CREATE USER`, `DROP USER`, `GRANT`, `RENAME USER`, `REVOKE`, `SET PASSWORD`.

* **Statements de controle de Transaction e locking.** `BEGIN`, `LOCK TABLES`, `SET autocommit = 1` (se o valor já não for 1), `START TRANSACTION`, `UNLOCK TABLES`.

  `UNLOCK TABLES` faz *commit* de uma *transaction* apenas se alguma *table* estiver atualmente bloqueada com `LOCK TABLES` para adquirir *table locks* não *transactional*. Um *commit* não ocorre para `UNLOCK TABLES` após `FLUSH TABLES WITH READ LOCK` porque esta última *statement* não adquire *locks* em nível de *table*.

  *Transactions* não podem ser aninhadas. Esta é uma consequência do *commit* implícito realizado para qualquer *transaction* atual quando você emite uma *statement* `START TRANSACTION` ou um de seus sinônimos.

  *Statements* que causam um *commit* implícito não podem ser usadas em uma *XA transaction* enquanto a *transaction* estiver no estado `ACTIVE`.

  A *statement* `BEGIN` difere do uso da palavra-chave `BEGIN` que inicia um *compound statement* `BEGIN ... END`. Este último não causa um *commit* implícito. Consulte Section 13.6.1, “BEGIN ... END Compound Statement”.

* **Statements de carregamento de Dados.** `LOAD DATA`. `LOAD DATA` causa um *commit* implícito apenas para *tables* que usam o *storage engine* `NDB`.

* **Statements Administrativas.** `ANALYZE TABLE`, `CACHE INDEX`, `CHECK TABLE`, `FLUSH`, `LOAD INDEX INTO CACHE`, `OPTIMIZE TABLE`, `REPAIR TABLE`, `RESET`.

* **Statements de controle de Replication**. `START SLAVE`, `STOP SLAVE`, `RESET SLAVE`, `CHANGE MASTER TO`.