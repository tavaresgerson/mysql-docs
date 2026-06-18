#### 7.4.4.4 Logging Format for Changes to mysql Database Tables

The contents of the grant tables in the `mysql`
database can be modified directly (for example, with
[`INSERT`](insert.html "15.2.7 INSERT Statement") or
[`DELETE`](delete.html "15.2.2 DELETE Statement")) or indirectly (for
example, with [`GRANT`](grant.html "15.7.1.6 GRANT Statement") or
[`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement")). Statements that
affect `mysql` database tables are written to
the binary log using the following rules:

* Data manipulation statements that change data in
  `mysql` database tables directly are logged
  according to the setting of the
  [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) system
  variable. This pertains to statements such as
  [`INSERT`](insert.html "15.2.7 INSERT Statement"),
  [`UPDATE`](update.html "15.2.17 UPDATE Statement"),
  [`DELETE`](delete.html "15.2.2 DELETE Statement"),
  [`REPLACE`](replace.html "15.2.12 REPLACE Statement"),
  [`DO`](do.html "15.2.3 DO Statement"), [`LOAD
  DATA`](load-data.html "15.2.9 LOAD DATA Statement"), [`SELECT`](select.html "15.2.13 SELECT Statement"), and
  [`TRUNCATE TABLE`](truncate-table.html "15.1.37 TRUNCATE TABLE Statement").

* Statements that change the `mysql` database
  indirectly are logged as statements regardless of the value
  of [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format). This
  pertains to statements such as
  [`GRANT`](grant.html "15.7.1.6 GRANT Statement"),
  [`REVOKE`](revoke.html "15.7.1.8 REVOKE Statement"),
  [`SET PASSWORD`](set-password.html "15.7.1.10 SET PASSWORD Statement"),
  [`RENAME USER`](rename-user.html "15.7.1.7 RENAME USER Statement"),
  `CREATE` (all forms except
  [`CREATE TABLE
  ... SELECT`](create-table.html "15.1.20 CREATE TABLE Statement")), `ALTER` (all forms),
  and `DROP` (all forms).

[`CREATE TABLE ...
SELECT`](create-table.html "15.1.20 CREATE TABLE Statement") is a combination of data definition and data
manipulation. The [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement")
part is logged using statement format and the
[`SELECT`](select.html "15.2.13 SELECT Statement") part is logged according
to the value of [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format).