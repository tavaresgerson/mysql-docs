## 13.3 Instruções Transacionais e de Bloqueio

[13.3.1 Instruções START TRANSACTION, COMMIT e ROLLBACK](commit.html)

[13.3.2 Instruções Que Não Podem Ser Desfeitas (Rolled Back)](cannot-roll-back.html)

[13.3.3 Instruções Que Causam um COMMIT Implícito](implicit-commit.html)

[13.3.4 Instruções SAVEPOINT, ROLLBACK TO SAVEPOINT e RELEASE SAVEPOINT](savepoint.html)

[13.3.5 Instruções LOCK TABLES e UNLOCK TABLES](lock-tables.html)

[13.3.6 Instrução SET TRANSACTION](set-transaction.html)

[13.3.7 Transações XA](xa.html)

O MySQL suporta local transactions (dentro de uma determinada sessão de cliente) através de instruções como [`SET autocommit`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") e [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"). Consulte [Seção 13.3.1, “START TRANSACTION, COMMIT, and ROLLBACK Statements”](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"). O suporte a XA transaction também permite que o MySQL participe de distributed transactions. Consulte [Seção 13.3.7, “XA Transactions”](xa.html "13.3.7 XA Transactions").