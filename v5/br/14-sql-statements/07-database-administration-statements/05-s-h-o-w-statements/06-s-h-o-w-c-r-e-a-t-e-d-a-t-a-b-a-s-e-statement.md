#### 13.7.5.6 SHOW CREATE DATABASE Statement

```sql
SHOW CREATE {DATABASE | SCHEMA} [IF NOT EXISTS] db_name
```

Shows the [`CREATE DATABASE`](create-database.html "13.1.11 CREATE DATABASE Statement") statement that creates the named database. If the `SHOW` statement includes an `IF NOT EXISTS` clause, the output too includes such a clause. [`SHOW CREATE SCHEMA`](show-create-database.html "13.7.5.6 SHOW CREATE DATABASE Statement") is a synonym for [`SHOW CREATE DATABASE`](show-create-database.html "13.7.5.6 SHOW CREATE DATABASE Statement").

```sql
mysql> SHOW CREATE DATABASE test\G
*************************** 1. row ***************************
       Database: test
Create Database: CREATE DATABASE `test`
                 /*!40100 DEFAULT CHARACTER SET latin1 */

mysql> SHOW CREATE SCHEMA test\G
*************************** 1. row ***************************
       Database: test
Create Database: CREATE DATABASE `test`
                 /*!40100 DEFAULT CHARACTER SET latin1 */
```

[`SHOW CREATE DATABASE`](show-create-database.html "13.7.5.6 SHOW CREATE DATABASE Statement") quotes table and column names according to the value of the [`sql_quote_show_create`](server-system-variables.html#sysvar_sql_quote_show_create) option. See [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").
