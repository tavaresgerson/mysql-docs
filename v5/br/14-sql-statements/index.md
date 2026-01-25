# Capítulo 13 Instruções SQL

**Sumário**

[13.1 Instruções de Definição de Dados](sql-data-definition-statements.html) :   [13.1.1 ALTER DATABASE Instrução](alter-database.html)

    [13.1.2 ALTER EVENT Instrução](alter-event.html)

    [13.1.3 ALTER FUNCTION Instrução](alter-function.html)

    [13.1.4 ALTER INSTANCE Instrução](alter-instance.html)

    [13.1.5 ALTER LOGFILE GROUP Instrução](alter-logfile-group.html)

    [13.1.6 ALTER PROCEDURE Instrução](alter-procedure.html)

    [13.1.7 ALTER SERVER Instrução](alter-server.html)

    [13.1.8 ALTER TABLE Instrução](alter-table.html)

    [13.1.9 ALTER TABLESPACE Instrução](alter-tablespace.html)

    [13.1.10 ALTER VIEW Instrução](alter-view.html)

    [13.1.11 CREATE DATABASE Instrução](create-database.html)

    [13.1.12 CREATE EVENT Instrução](create-event.html)

    [13.1.13 CREATE FUNCTION Instrução](create-function.html)

    [13.1.14 CREATE INDEX Instrução](create-index.html)

    [13.1.15 CREATE LOGFILE GROUP Instrução](create-logfile-group.html)

    [13.1.16 CREATE PROCEDURE e CREATE FUNCTION Instruções](create-procedure.html)

    [13.1.17 CREATE SERVER Instrução](create-server.html)

    [13.1.18 CREATE TABLE Instrução](create-table.html)

    [13.1.19 CREATE TABLESPACE Instrução](create-tablespace.html)

    [13.1.20 CREATE TRIGGER Instrução](create-trigger.html)

    [13.1.21 CREATE VIEW Instrução](create-view.html)

    [13.1.22 DROP DATABASE Instrução](drop-database.html)

    [13.1.23 DROP EVENT Instrução](drop-event.html)

    [13.1.24 DROP FUNCTION Instrução](drop-function.html)

    [13.1.25 DROP INDEX Instrução](drop-index.html)

    [13.1.26 DROP LOGFILE GROUP Instrução](drop-logfile-group.html)

    [13.1.27 DROP PROCEDURE e DROP FUNCTION Instruções](drop-procedure.html)

    [13.1.28 DROP SERVER Instrução](drop-server.html)

    [13.1.29 DROP TABLE Instrução](drop-table.html)

    [13.1.30 DROP TABLESPACE Instrução](drop-tablespace.html)

    [13.1.31 DROP TRIGGER Instrução](drop-trigger.html)

    [13.1.32 DROP VIEW Instrução](drop-view.html)

    [13.1.33 RENAME TABLE Instrução](rename-table.html)

    [13.1.34 TRUNCATE TABLE Instrução](truncate-table.html)

[13.2 Instruções de Manipulação de Dados](sql-data-manipulation-statements.html) :   [13.2.1 CALL Instrução](call.html)

    [13.2.2 DELETE Instrução](delete.html)

    [13.2.3 DO Instrução](do.html)

    [13.2.4 HANDLER Instrução](handler.html)

    [13.2.5 INSERT Instrução](insert.html)

    [13.2.6 LOAD DATA Instrução](load-data.html)

    [13.2.7 LOAD XML Instrução](load-xml.html)

    [13.2.8 REPLACE Instrução](replace.html)

    [13.2.9 SELECT Instrução](select.html)

    [13.2.10 Subqueries](subqueries.html)

    [13.2.11 UPDATE Instrução](update.html)

[13.3 Instruções Transacionais e de Bloqueio](sql-transactional-statements.html) :   [13.3.1 START TRANSACTION, COMMIT e ROLLBACK Instruções](commit.html)

    [13.3.2 Instruções Que Não Podem Ser Desfeitas (Rolled Back)](cannot-roll-back.html)

    [13.3.3 Instruções Que Causam um Commit Implícito](implicit-commit.html)

    [13.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT e RELEASE SAVEPOINT Instruções](savepoint.html)

    [13.3.5 LOCK TABLES e UNLOCK TABLES Instruções](lock-tables.html)

    [13.3.6 SET TRANSACTION Instrução](set-transaction.html)

    [13.3.7 XA Transactions](xa.html)

[13.4 Instruções de Replicação](sql-replication-statements.html) :   [13.4.1 Instruções SQL para Controle de Servidores de Origem (Source) de Replicação](replication-statements-master.html)

    [13.4.2 Instruções SQL para Controle de Servidores Replica](replication-statements-replica.html)

    [13.4.3 Instruções SQL para Controle de Replicação de Grupo](replication-statements-group.html)

[13.5 Instruções Preparadas](sql-prepared-statements.html) :   [13.5.1 PREPARE Instrução](prepare.html)

    [13.5.2 EXECUTE Instrução](execute.html)

    [13.5.3 DEALLOCATE PREPARE Instrução](deallocate-prepare.html)

[13.6 Instruções Compostas](sql-compound-statements.html) :   [13.6.1 BEGIN ... END Instrução Composta](begin-end.html)

    [13.6.2 Rótulos de Instrução](statement-labels.html)

    [13.6.3 DECLARE Instrução](declare.html)

    [13.6.4 Variáveis em Programas Armazenados (Stored Programs)](stored-program-variables.html)

    [13.6.5 Instruções de Controle de Fluxo](flow-control-statements.html)

    [13.6.6 Cursors](cursors.html)

    [13.6.7 Tratamento de Condição](condition-handling.html)

[13.7 Instruções de Administração de Database](sql-server-administration-statements.html) :   [13.7.1 Instruções de Gerenciamento de Conta](account-management-statements.html)

    [13.7.2 Instruções de Manutenção de Tabela](table-maintenance-statements.html)

    [13.7.3 Instruções de Plugin e Função Carregável](component-statements.html)

    [13.7.4 SET Instruções](set-statement.html)

    [13.7.5 SHOW Instruções](show.html)

    [13.7.6 Outras Instruções Administrativas](other-administrative-statements.html)

[13.8 Instruções de Utilidade](sql-utility-statements.html) :   [13.8.1 DESCRIBE Instrução](describe.html)

    [13.8.2 EXPLAIN Instrução](explain.html)

    [13.8.3 HELP Instrução](help.html)

    [13.8.4 USE Instrução](use.html)

Este capítulo descreve a sintaxe para as instruções [SQL](glossary.html#glos_sql "SQL") suportadas pelo MySQL.