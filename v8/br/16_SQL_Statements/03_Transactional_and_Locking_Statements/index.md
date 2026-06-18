## 15.3 Declarações transacionais e de bloqueio

15.3.1 Declarações START TRANSACTION, COMMIT e ROLLBACK

15.3.2 Declarações que não podem ser desfeitas

15.3.3 Declarações que causam um compromisso implícito

15.3.4 Declarações SAVEPOINT, ROLLBACK TO SAVEPOINT e RELEASE SAVEPOINT

15.3.5 Declarações para Bloquear Instância para Backup e Desbloquear Instância

15.3.6 Declarações LOCK TABLES e UNLOCK TABLES

15.3.7 Declaração SET TRANSACTION

15.3.8 Transações XA

O MySQL suporta transações locais (dentro de uma sessão de cliente específica) por meio de instruções como `SET autocommit`, `START TRANSACTION`, `COMMIT` e `ROLLBACK`. Veja a Seção 15.3.1, “Instruções START TRANSACTION, COMMIT e ROLLBACK”. O suporte para transações XA permite que o MySQL também participe de transações distribuídas. Veja a Seção 15.3.8, “Transações XA”.
