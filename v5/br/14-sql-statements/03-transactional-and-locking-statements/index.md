## 13.3 Instruções Transacionais e de Bloqueio

13.3.1 Instruções START TRANSACTION, COMMIT e ROLLBACK

13.3.2 Instruções Que Não Podem Ser Desfeitas (Rolled Back)

13.3.3 Instruções Que Causam um COMMIT Implícito

13.3.4 Instruções SAVEPOINT, ROLLBACK TO SAVEPOINT e RELEASE SAVEPOINT

13.3.5 Instruções LOCK TABLES e UNLOCK TABLES

13.3.6 Instrução SET TRANSACTION

13.3.7 Transações XA

O MySQL suporta local transactions (dentro de uma determinada sessão de cliente) através de instruções como `SET autocommit`, `START TRANSACTION`, `COMMIT` e `ROLLBACK`. Consulte Seção 13.3.1, “START TRANSACTION, COMMIT, and ROLLBACK Statements”. O suporte a XA transaction também permite que o MySQL participe de distributed transactions. Consulte Seção 13.3.7, “XA Transactions”.