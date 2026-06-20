#### 7.4.4.4 Logging Format for Changes to mysql Database Tables

The contents of the grant tables in the `mysql` database can be modified directly (for example, with `INSERT` or `DELETE`) or indirectly (for example, with `GRANT` or `CREATE USER`). Statements that affect `mysql` database tables are written to the binary log using the following rules:

* Data manipulation statements that change data in `mysql` database tables directly are logged according to the setting of the `binlog_format` system variable. This pertains to statements such as `INSERT`, `UPDATE`, `DELETE`, `REPLACE`, `DO`, [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement"), `SELECT`, and `TRUNCATE TABLE`.

* Statements that change the `mysql` database indirectly are logged as statements regardless of the value of `binlog_format`. This pertains to statements such as `GRANT`, `REVOKE`, `SET PASSWORD`, `RENAME USER`, `CREATE` (all forms except [`CREATE TABLE ... SELECT`](create-table.html "15.1.20 CREATE TABLE Statement")), `ALTER` (all forms), and `DROP` (all forms).

[`CREATE TABLE ... SELECT`](create-table.html "15.1.20 CREATE TABLE Statement") is a combination of data definition and data manipulation. The `CREATE TABLE` part is logged using statement format and the `SELECT` part is logged according to the value of `binlog_format`.