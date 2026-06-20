#### 19.5.1.6 Replication of CREATE ... IF NOT EXISTS Statements

MySQL applies these rules when various `CREATE ... IF NOT EXISTS` statements are replicated:

* Every [`CREATE DATABASE IF NOT EXISTS`](create-database.html "15.1.12 CREATE DATABASE Statement") statement is replicated, whether or not the database already exists on the source.

* Similarly, every [`CREATE TABLE IF NOT EXISTS`](create-table.html "15.1.20 CREATE TABLE Statement") statement without a `SELECT` is replicated, whether or not the table already exists on the source. This includes [`CREATE TABLE IF NOT EXISTS ... LIKE`](create-table-like.html "15.1.20.3 CREATE TABLE ... LIKE Statement"). Replication of [`CREATE TABLE IF NOT EXISTS ... SELECT`](create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement") follows somewhat different rules; see Section 19.5.1.7, “Replication of CREATE TABLE ... SELECT Statements”, for more information.

* [`CREATE EVENT IF NOT EXISTS`](create-event.html "15.1.13 CREATE EVENT Statement") is always replicated, whether or not the event named in the statement already exists on the source.

* `CREATE USER` is written to the binary log only if successful. If the statement includes `IF NOT EXISTS`, it is considered successful, and is logged as long as at least one user named in the statement is created; in such cases, the statement is logged as written; this includes references to existing users that were not created. See CREATE USER Binary Logging, for more information.

* (*MySQL 8.0.29 and later*:) [`CREATE PROCEDURE IF NOT EXISTS`](create-procedure.html "15.1.17 CREATE PROCEDURE and CREATE FUNCTION Statements"), [`CREATE FUNCTION IF NOT EXISTS`](create-function.html "15.1.14 CREATE FUNCTION Statement"), or [`CREATE TRIGGER IF NOT EXISTS`](create-trigger.html "15.1.22 CREATE TRIGGER Statement"), if successful, is written in its entirety to the binary log (including the `IF NOT EXISTS` clause), whether or not the statement raised a warning because the object (procedure, function, or trigger) already existed.