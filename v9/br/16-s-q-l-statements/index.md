# Capítulo 15 Declarações SQL

**Índice**

15.1 Declarações de Definição de Dados:   15.1.1 Suporte a Declaração de Definição de Dados Atômica

    15.1.2 Declaração ALTER DATABASE

    15.1.3 Declaração ALTER EVENT

    15.1.4 Declaração ALTER FUNCTION

    15.1.5 Declaração ALTER INSTANCE

    15.1.6 Declaração ALTER JSON DUALITY VIEW

    15.1.7 Declaração ALTER LIBRARY

    15.1.8 Declaração ALTER LOGFILE GROUP

    15.1.9 Declaração ALTER PROCEDURE

    15.1.10 Declaração ALTER SERVER

    15.1.11 Declaração ALTER TABLE

    15.1.12 Declaração ALTER TABLESPACE

    15.1.13 Declaração ALTER VIEW

    15.1.14 Declaração CREATE DATABASE

    15.1.15 Declaração CREATE EVENT

    15.1.16 Declaração CREATE FUNCTION

    15.1.17 Declaração CREATE JSON DUALITY VIEW

    15.1.18 Declaração CREATE INDEX

    15.1.19 Declaração CREATE LIBRARY

    15.1.20 Declaração CREATE LOGFILE GROUP

    15.1.21 Declarações CREATE PROCEDURE e CREATE FUNCTION

    15.1.22 Declaração CREATE SERVER

    15.1.23 Declaração CREATE SPATIAL REFERENCE SYSTEM

    15.1.24 Declaração CREATE TABLE

    15.1.25 Declaração CREATE TABLESPACE

    15.1.26 Declaração CREATE TRIGGER

    15.1.27 Declaração CREATE VIEW

    15.1.28 Declaração DROP DATABASE

    15.1.29 Declaração DROP EVENT

    15.1.30 Declaração DROP FUNCTION

    15.1.31 Declaração DROP INDEX

    15.1.32 Declaração DROP LIBRARY

    15.1.33 Declaração DROP LOGFILE GROUP

    15.1.34 Declarações DROP PROCEDURE e DROP FUNCTION

    15.1.35 Declaração DROP SERVER

    15.1.36 Declaração DROP SPATIAL REFERENCE SYSTEM

    15.1.37 Declaração DROP TABLE

    15.1.38 Declaração DROP TABLESPACE

    15.1.39 Declaração DROP TRIGGER

    15.1.40 Declaração DROP VIEW

    15.1.41 Declaração RENAME TABLE

    15.1.42 Declaração TRUNCATE TABLE

15.2 Declarações de Manipulação de Dados:   15.2.1 Declaração CALL

    15.2.2 Declaração DELETE

    15.2.3 Declaração DO

    15.2.4 Cláusula EXCEPT

    15.2.5 Declaração HANDLER

    15.2.6 Declaração IMPORT TABLE

    15.2.7 Declaração INSERT

    15.2.8 Cláusula INTERSECT

    15.2.9 Declaração LOAD DATA

    15.2.10 Declaração LOAD XML

    15.2.11 Expressões de Consulta Parenthetizadas

    15.2.12 Declaração REPLACE

    15.2.13 Declaração SELECT

    15.2.14 Operações de Conjunto com UNION, INTERSECT e EXCEPT

    15.2.15 Subconsultas

    15.2.16 Declaração TABLE

    15.2.17 Declaração UPDATE

    15.2.18 Cláusula UNION

    15.2.19 Declaração VALUES

    15.2.20 Com DECLARE (Expressões Comuns de Tabela)

15.3 Declarações Transacionais e de Bloqueio:   15.3.1 Declarações START TRANSACTION, COMMIT e ROLLBACK

    15.3.2 Declarações que Não Podem Ser Revertidas

    15.3.3 Declarações que Causam um Commit Implícito

    15.3.4 Declarações SAVEPOINT, ROLLBACK TO SAVEPOINT e RELEASE SAVEPOINT

    15.3.5 Declarações LOCK INSTANCE FOR BACKUP e UNLOCK INSTANCE

    15.3.6 Declarações LOCK TABLES e UNLOCK TABLES

    15.3.7 Declaração SET TRANSACTION

    15.3.8 Transações XA

15.4 Declarações de Replicação:   15.4.1 Declarações SQL para Controle de Servidores de Fonte

    15.4.2 Declarações SQL para Controle de Servidores de Replicação

    15.4.3 Declarações SQL para Controle da Replicação em Grupo

15.5 Declarações Preparadas:   15.5.1 Declaração PREPARE

    15.5.2 Declaração EXECUTE

    15.5.3 Declaração DEALLOCATE PREPARE

15.6 Sintaxe de Declarações Compostas:   15.6.1 Declaração Composta BEGIN ... END

    15.6.2 Rótulos de Declaração

    15.6.3 Declaração DECLARE

    15.6.4 Variáveis em Programas Armazenados

    15.6.5 Declarações de Controle de Fluxo

    15.6.6 Cursors

    15.6.7 Tratamento de Condições

    15.6.8 Restrições no Tratamento de Condições

15.7 Declarações de Administração de Banco de Dados:   15.7.1 Declarações de Gerenciamento de Contas

    15.7.2 Declarações de Gerenciamento de Grupos de Recursos

    15.7.3 Declarações de Manutenção de Tabelas

    15.7.4 Declarações de Componentes, Plugins e Funções Carregáveis

    15.7.5 Declaração CLONE

    15.7.6 Declarações SET

    15.7.7 Declarações SHOW

    15.7.8 Outras Declarações Administrativas

15.8 Declarações de Utilidades:   15.8.1 Declaração DESCRIBE

    15.8.2 Declaração EXPLAIN

    15.8.3 Declaração HELP

    15.8.4 Declaração USE

Este capítulo descreve a sintaxe das declarações SQL suportadas pelo MySQL.