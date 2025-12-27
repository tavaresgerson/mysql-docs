### 15.3.3 Declarações que Causam um Compromisso Implícito

As declarações listadas nesta seção (e quaisquer sinônimos para elas) encerram implicitamente qualquer transação ativa na sessão atual, como se você tivesse feito um `COMMIT` antes de executar a declaração.

A maioria dessas declarações também causa um compromisso implícito após a execução. A intenção é lidar com cada uma dessas declarações em sua própria transação especial. As declarações de controle de transação e bloqueio são exceções: se um compromisso implícito ocorre antes da execução, outro não ocorre depois.

* **Declarações de linguagem de definição de dados (DDL) que definem ou modificam objetos de banco de dados.** `ALTER EVENT`, `ALTER FUNCTION`, `ALTER PROCEDURE`, `ALTER SERVER`, `ALTER TABLE`, `ALTER TABLESPACE`, `ALTER VIEW`, `CREATE DATABASE`, `CREATE EVENT`, `CREATE FUNCTION`, `CREATE INDEX`, `CREATE PROCEDURE`, `CREATE ROLE`, `CREATE SERVER`, `CREATE SPATIAL REFERENCE SYSTEM`, `CREATE TABLE`, `CREATE TABLESPACE`, `CREATE TRIGGER`, `CREATE VIEW`, `DROP DATABASE`, `DROP EVENT`, `DROP FUNCTION`, `DROP INDEX`, `DROP PROCEDURE`, `DROP ROLE`, `DROP SERVER`, `DROP SPATIAL REFERENCE SYSTEM`, `DROP TABLE`, `DROP TABLESPACE`, `DROP TRIGGER`, `DROP VIEW`, `INSTALL PLUGIN`, `RENAME TABLE`, `TRUNCATE TABLE`, `UNINSTALL PLUGIN`.

As declarações `CREATE TABLE` e `DROP TABLE` não comprometem uma transação se a palavra-chave `TEMPORARY` for usada. (Isso não se aplica a outras operações em tabelas temporárias, como `ALTER TABLE` e `CREATE INDEX`, que causam um compromisso.) No entanto, embora não ocorra um compromisso implícito, a declaração também não pode ser revertida, o que significa que o uso dessas declarações viola a atomicidade transacional. Por exemplo, se você usar `CREATE TEMPORARY TABLE` e depois reverter a transação, a tabela permanece em existência.

A instrução `CREATE TABLE` no `InnoDB` é processada como uma única transação. Isso significa que um `ROLLBACK` do usuário não desfaz as instruções `CREATE TABLE` que o usuário fez durante essa transação.

`CREATE TABLE ... SELECT` causa um commit implícito antes e depois da execução da instrução ao criar tabelas não temporárias. (Não ocorre nenhum commit para `CREATE TEMPORARY TABLE ... SELECT`.)

* **Instruções que implicitamente usam ou modificam tabelas no banco de dados `mysql`. `ALTER USER`, `CREATE USER`, `DROP USER`, `GRANT`, `RENAME USER`, `REVOKE`, `SET PASSWORD`.**

* **Instruções de controle de transações e bloqueio.** `BEGIN`, `LOCK TABLES`, `SET autocommit = 1` (se o valor não já for 1), `START TRANSACTION`, `UNLOCK TABLES`.

`UNLOCK TABLES` confirma uma transação apenas se quaisquer tabelas atualmente estiverem bloqueadas com `LOCK TABLES` para adquirir bloqueios de tabela não transacionais. Não ocorre nenhum commit para `UNLOCK TABLES` após `FLUSH TABLES WITH READ LOCK` porque essa última instrução não adquire bloqueios de nível de tabela.

As transações não podem ser aninhadas. Essa é uma consequência do commit implícito realizado para qualquer transação atual quando você emite uma instrução `START TRANSACTION` ou uma de suas sinônimos.

As instruções que causam um commit implícito não podem ser usadas em uma transação XA enquanto a transação estiver no estado `ACTIVE`.

A instrução `BEGIN` difere do uso da palavra-chave `BEGIN` que inicia uma instrução composta `BEGIN ... END`. Esta última não causa um commit implícito. Veja a Seção 15.6.1, “Instrução Composta `BEGIN ... END`”.

* **Instruções de carregamento de dados.** `LOAD DATA`. `LOAD DATA` causa um commit implícito apenas para tabelas que usam o motor de armazenamento `NDB`.

* **Declarações administrativas.** `ANALYSE TÁBLIA`, `CACHE INDEX`, `VERIFIQUE TÁBLIA`, `FLUSH`, `CARREGAR ÍNDICE NA CACHE`, `OPTIMIZE TÁBLIA`, `REPAIR TÁBLIA`, `RESET` (mas não `RESET PERSIST`).

* **Declarações de controle de replicação.** `START REPLICA`, `STOP REPLICA`, `RESET REPLICA`, `CHANGE REPLICATION SOURCE TO`.