### 13.3.3 Declarações que causam um compromisso implícito

As declarações listadas nesta seção (e quaisquer sinônimos para elas) encerram implicitamente qualquer transação ativa na sessão atual, como se você tivesse feito um `COMMIT` antes de executar a declaração.

A maioria dessas declarações também causa um commit implícito após a execução. A intenção é lidar com cada uma dessas declarações em sua própria transação especial, pois não pode ser revertida de qualquer maneira. As declarações de controle de transação e bloqueio são exceções: se um commit implícito ocorre antes da execução, outro não ocorre depois.

- **Linguagem de definição de dados (DDL) que definem ou modificam objetos de banco de dados.** `ALTER DATABASE ... UPGRADE DATA DIRECTORY NAME`, `ALTER EVENT`, `ALTER PROCEDURE`, `ALTER SERVER`, `ALTER TABLE`, `ALTER TABLESPACE`, `ALTER VIEW`, `CREATE DATABASE`, `CREATE EVENT`, `CREATE INDEX`, `CREATE PROCEDURE`, `CREATE SERVER`, `CREATE TABLE`, `CREATE TABLESPACE`, `CREATE TRIGGER`, `CREATE VIEW`, `DROP DATABASE`, `DROP EVENT`, `DROP INDEX`, `DROP PROCEDURE`, `DROP SERVER`, `DROP TABLE`, `DROP TABLESPACE`, `DROP TRIGGER`, `DROP VIEW`, `INSTALL PLUGIN`, `RENAME TABLE`, `TRUNCATE TABLE`, `UNINSTALL PLUGIN`.

  `ALTER FUNCTION` (alter-function.html), `CREATE FUNCTION` (create-function.html) e `DROP FUNCTION` (drop-function.html) também causam um commit implícito quando usados com funções armazenadas, mas não com funções carregáveis. (`ALTER FUNCTION` só pode ser usado com funções armazenadas.)

  As instruções `CREATE TABLE` e `DROP TABLE` não comprometem uma transação se a palavra-chave `TEMPORARY` for usada. (Isso não se aplica a outras operações em tabelas temporárias, como `ALTER TABLE` e `CREATE INDEX`, que causam um comprometimento.) No entanto, embora não haja um comprometimento implícito, a instrução também não pode ser revertida, o que significa que o uso dessas instruções viola a atomicidade transacional. Por exemplo, se você usar `CREATE TEMPORARY TABLE` e depois reverter a transação, a tabela permanece em existência.

  A instrução `CREATE TABLE` no `InnoDB` é processada como uma única transação. Isso significa que um `ROLLBACK` do usuário não desfaz as instruções `CREATE TABLE` que o usuário fez durante essa transação.

  `CREATE TABLE ... SELECT` causa um commit implícito antes e depois da execução da instrução quando você está criando tabelas não temporárias. (Não ocorre nenhum commit para `CREATE TEMPORARY TABLE ... SELECT`.)

- **Declarações que implicitamente utilizam ou modificam tabelas no banco de dados `mysql`.** `ALTER USER`, `CREATE USER`, `DROP USER`, `GRANT`, `RENAME USER`, `REVOKE`, `SET PASSWORD`.

- **Declarações de controle e bloqueio de transações.** `BEGIN`, `LOCK TABLES`, `SET autocommit = 1` (se o valor não já for 1), `START TRANSACTION`, `UNLOCK TABLES`.

  `UNLOCK TABLES` executa uma transação apenas se quaisquer tabelas estiverem atualmente bloqueadas com `LOCK TABLES` para adquirir bloqueios não transacionais de tabelas. Não há commit para `UNLOCK TABLES` após `FLUSH TABLES WITH READ LOCK`, pois a última instrução não adquire bloqueios de nível de tabela.

  As transações não podem ser aninhadas. Isso é uma consequência do commit implícito realizado para qualquer transação atual quando você emite uma declaração de `START TRANSACTION` ou um de seus sinônimos.

  As declarações que causam um compromisso implícito não podem ser usadas em uma transação XA enquanto a transação estiver no estado `ATIVO`.

  A instrução `BEGIN` difere do uso da palavra-chave `BEGIN` que inicia uma instrução composta `BEGIN ... END`. Esta última não causa um commit implícito. Veja Seção 13.6.1, “Instrução Composta `BEGIN ... END`.

- **Declarações de carregamento de dados.** `LOAD DATA`. O `LOAD DATA` causa um commit implícito apenas para tabelas que utilizam o mecanismo de armazenamento `NDB`.

- **Declarações administrativas.** `ANALYSE Tabela`, `CACHE INDEX`, `VERIFIQUE Tabela`, `LIMPE`, `CARREGUE ÍNDICE NA CACHE`, `OTIMIZE Tabela`, `REPARE Tabela`, `REESTÁBELEÇA`.

- **Declarações de controle de replicação**. `START SLAVE`, `STOP SLAVE`, `RESET SLAVE`, `CHANGE MASTER TO`.
