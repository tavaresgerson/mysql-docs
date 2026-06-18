#### 13.7.5.6 Instrução SHOW CREATE DATABASE

```sql
SHOW CREATE {DATABASE | SCHEMA} [IF NOT EXISTS] db_name
```

Mostra a instrução `CREATE DATABASE` que cria o Database nomeado. Se a instrução `SHOW` incluir uma cláusula `IF NOT EXISTS`, a saída também inclui essa cláusula. `SHOW CREATE SCHEMA` é um sinônimo para `SHOW CREATE DATABASE`.

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

`SHOW CREATE DATABASE` coloca aspas nos nomes de table e column de acordo com o valor da opção `sql_quote_show_create`. Consulte Seção 5.1.7, “Server System Variables”.