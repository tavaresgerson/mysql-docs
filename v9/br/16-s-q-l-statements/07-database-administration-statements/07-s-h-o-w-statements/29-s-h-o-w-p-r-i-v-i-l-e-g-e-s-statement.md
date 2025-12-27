#### 15.7.7.29 Declaração de PRÉVILEGIOS

```
SHOW PRIVILEGES
```

`SHOW PRIVILEGES` exibe a lista de privilégios do sistema que o servidor MySQL suporta. Os privilégios exibidos incluem todos os privilégios estáticos e todos os privilégios dinâmicos atualmente registrados.

```
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
Privilege: Create role
  Context: Server Admin
  Comment: To create new roles
...
```

Os privilégios pertencentes a um usuário específico são exibidos pela declaração `SHOW GRANTS`. Consulte a Seção 15.7.7.23, “Declaração SHOW GRANTS”, para obter mais informações.