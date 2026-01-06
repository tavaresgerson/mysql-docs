#### 13.7.5.26 Declaração de PRÉMIOS DE MOSTRA

```sql
SHOW PRIVILEGES
```

`SHOW PRIVILEGES` mostra a lista de privilégios do sistema que o servidor MySQL suporta. A lista exata dos privilégios depende da versão do seu servidor.

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

Os privilégios pertencentes a um usuário específico são exibidos pela declaração `SHOW GRANTS`. Consulte Seção 13.7.5.21, “Declaração SHOW GRANTS” para obter mais informações.
