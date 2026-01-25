#### 13.7.5.26 SHOW PRIVILEGES Statement

```sql
SHOW PRIVILEGES
```

O [`SHOW PRIVILEGES`](show-privileges.html "13.7.5.26 SHOW PRIVILEGES Statement") mostra a lista de system privileges que o MySQL server suporta. A lista exata de privileges depende da versão do seu server.

```sql
mysql> SHOW PRIVILEGES\G
*************************** 1. row ***************************
Privilege: Alter
  Context: Tables
  Comment: To alter the table
*************************** 2. row ***************************
Privilege: Alter routine
  Context: Functions,Procedures
  Comment: To alter or drop stored functions/procedures
*************************** 3. row ***************************
Privilege: Create
  Context: Databases,Tables,Indexes
  Comment: To create new databases and tables
*************************** 4. row ***************************
Privilege: Create routine
  Context: Databases
  Comment: To use CREATE FUNCTION/PROCEDURE
*************************** 5. row ***************************
Privilege: Create temporary tables
  Context: Databases
  Comment: To use CREATE TEMPORARY TABLE
...
```

Privileges pertencentes a um user específico são exibidos pelo [`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement") Statement. Consulte a [Seção 13.7.5.21, “SHOW GRANTS Statement”](show-grants.html "13.7.5.21 SHOW GRANTS Statement"), para mais informações.