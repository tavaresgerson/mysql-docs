## 13.3 Declarações Transacionais e de Bloqueio

13.3.1 Declarações de início de transação, commit e rollback

13.3.2 Declarações que não podem ser revertidas

13.3.3 Declarações que causam um compromisso implícito

13.3.4 Declarações SAVEPOINT, ROLLBACK TO SAVEPOINT e RELEASE SAVEPOINT

13.3.5 Declarações LOCK TABLES e UNLOCK TABLES

13.3.6 Declaração SET TRANSACTION

13.3.7 Transações XA

O MySQL suporta transações locais (dentro de uma sessão de cliente específica) por meio de instruções como `SET autocommit`, `START TRANSACTION`, `COMMIT` e `ROLLBACK`. Veja Seção 13.3.1, “Instruções START TRANSACTION, COMMIT e ROLLBACK”. O suporte para transações XA permite que o MySQL também participe de transações distribuídas. Veja Seção 13.3.7, “Transações XA”.
