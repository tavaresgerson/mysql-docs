#### 16.4.1.5 Replication of CREATE ... IF NOT EXISTS Statements

MySQL applies these rules when various `CREATE ... IF NOT EXISTS` statements are replicated:

* Every [`CREATE DATABASE IF NOT EXISTS`](create-database.html "13.1.11 CREATE DATABASE Statement") statement is replicated, whether or not the database already exists on the source.

* Similarly, every [`CREATE TABLE IF NOT EXISTS`](create-table.html "13.1.18 CREATE TABLE Statement") statement without a [`SELECT`](select.html "13.2.9 SELECT Statement") is replicated, whether or not the table already exists on the source. This includes [`CREATE TABLE IF NOT EXISTS ... LIKE`](create-table-like.html "13.1.18.3 CREATE TABLE ... LIKE Statement"). Replication of [`CREATE TABLE IF NOT EXISTS ... SELECT`](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement") follows somewhat different rules; see [Section 16.4.1.6, “Replication of CREATE TABLE ... SELECT Statements”](replication-features-create-select.html "16.4.1.6 Replication of CREATE TABLE ... SELECT Statements"), for more information.

* [`CREATE EVENT IF NOT EXISTS`](create-event.html "13.1.12 CREATE EVENT Statement") is always replicated, whether or not the event named in the statement already exists on the source.
