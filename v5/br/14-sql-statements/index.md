# Capítulo 13 Instruções SQL

**Sumário**

13.1 Instruções de Definição de Dados :   13.1.1 ALTER DATABASE Instrução

    13.1.2 ALTER EVENT Instrução

    13.1.3 ALTER FUNCTION Instrução

    13.1.4 ALTER INSTANCE Instrução

    13.1.5 ALTER LOGFILE GROUP Instrução

    13.1.6 ALTER PROCEDURE Instrução

    13.1.7 ALTER SERVER Instrução

    13.1.8 ALTER TABLE Instrução

    13.1.9 ALTER TABLESPACE Instrução

    13.1.10 ALTER VIEW Instrução

    13.1.11 CREATE DATABASE Instrução

    13.1.12 CREATE EVENT Instrução

    13.1.13 CREATE FUNCTION Instrução

    13.1.14 CREATE INDEX Instrução

    13.1.15 CREATE LOGFILE GROUP Instrução

    13.1.16 CREATE PROCEDURE e CREATE FUNCTION Instruções

    13.1.17 CREATE SERVER Instrução

    13.1.18 CREATE TABLE Instrução

    13.1.19 CREATE TABLESPACE Instrução

    13.1.20 CREATE TRIGGER Instrução

    13.1.21 CREATE VIEW Instrução

    13.1.22 DROP DATABASE Instrução

    13.1.23 DROP EVENT Instrução

    13.1.24 DROP FUNCTION Instrução

    13.1.25 DROP INDEX Instrução

    13.1.26 DROP LOGFILE GROUP Instrução

    13.1.27 DROP PROCEDURE e DROP FUNCTION Instruções

    13.1.28 DROP SERVER Instrução

    13.1.29 DROP TABLE Instrução

    13.1.30 DROP TABLESPACE Instrução

    13.1.31 DROP TRIGGER Instrução

    13.1.32 DROP VIEW Instrução

    13.1.33 RENAME TABLE Instrução

    13.1.34 TRUNCATE TABLE Instrução

13.2 Instruções de Manipulação de Dados :   13.2.1 CALL Instrução

    13.2.2 DELETE Instrução

    13.2.3 DO Instrução

    13.2.4 HANDLER Instrução

    13.2.5 INSERT Instrução

    13.2.6 LOAD DATA Instrução

    13.2.7 LOAD XML Instrução

    13.2.8 REPLACE Instrução

    13.2.9 SELECT Instrução

    13.2.10 Subqueries

    13.2.11 UPDATE Instrução

13.3 Instruções Transacionais e de Bloqueio :   13.3.1 START TRANSACTION, COMMIT e ROLLBACK Instruções

    13.3.2 Instruções Que Não Podem Ser Desfeitas (Rolled Back)

    13.3.3 Instruções Que Causam um Commit Implícito

    13.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT e RELEASE SAVEPOINT Instruções

    13.3.5 LOCK TABLES e UNLOCK TABLES Instruções

    13.3.6 SET TRANSACTION Instrução

    13.3.7 XA Transactions

13.4 Instruções de Replicação :   13.4.1 Instruções SQL para Controle de Servidores de Origem (Source) de Replicação

    13.4.2 Instruções SQL para Controle de Servidores Replica

    13.4.3 Instruções SQL para Controle de Replicação de Grupo

13.5 Instruções Preparadas :   13.5.1 PREPARE Instrução

    13.5.2 EXECUTE Instrução

    13.5.3 DEALLOCATE PREPARE Instrução

13.6 Instruções Compostas :   13.6.1 BEGIN ... END Instrução Composta

    13.6.2 Rótulos de Instrução

    13.6.3 DECLARE Instrução

    13.6.4 Variáveis em Programas Armazenados (Stored Programs)

    13.6.5 Instruções de Controle de Fluxo

    13.6.6 Cursors

    13.6.7 Tratamento de Condição

13.7 Instruções de Administração de Database :   13.7.1 Instruções de Gerenciamento de Conta

    13.7.2 Instruções de Manutenção de Tabela

    13.7.3 Instruções de Plugin e Função Carregável

    13.7.4 SET Instruções

    13.7.5 SHOW Instruções

    13.7.6 Outras Instruções Administrativas

13.8 Instruções de Utilidade :   13.8.1 DESCRIBE Instrução

    13.8.2 EXPLAIN Instrução

    13.8.3 HELP Instrução

    13.8.4 USE Instrução

Este capítulo descreve a sintaxe para as instruções SQL suportadas pelo MySQL.