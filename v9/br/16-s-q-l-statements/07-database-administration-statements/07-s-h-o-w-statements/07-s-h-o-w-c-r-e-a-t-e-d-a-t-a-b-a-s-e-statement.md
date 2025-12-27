#### 15.7.7.7 Declaração `SHOW CREATE DATABASE`

```
SHOW CREATE {DATABASE | SCHEMA} [IF NOT EXISTS] db_name
```

Mostra a declaração `CREATE DATABASE` que cria o banco de dados nomeado. Se a declaração `SHOW` incluir uma cláusula `IF NOT EXISTS`, a saída também inclui tal cláusula. `SHOW CREATE SCHEMA` é sinônimo de `SHOW CREATE DATABASE`.

```
mysql> SHOW CREATE DATABASE test\G
*************************** 1. row ***************************
       Database: test
Create Database: CREATE DATABASE `test` /*!40100 DEFAULT CHARACTER SET utf8mb4
                 COLLATE utf8mb4_0900_ai_ci */ /*!80014 DEFAULT ENCRYPTION='N' */

mysql> SHOW CREATE SCHEMA test\G
*************************** 1. row ***************************
       Database: test
Create Database: CREATE DATABASE `test` /*!40100 DEFAULT CHARACTER SET utf8mb4
                 COLLATE utf8mb4_0900_ai_ci */ /*!80014 DEFAULT ENCRYPTION='N' */
```

`SHOW CREATE DATABASE` cita os nomes de tabelas e colunas de acordo com o valor da opção `sql_quote_show_create`. Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”.