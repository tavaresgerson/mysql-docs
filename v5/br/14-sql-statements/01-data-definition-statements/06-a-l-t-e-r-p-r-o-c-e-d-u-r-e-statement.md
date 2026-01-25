### 13.1.6 Instrução ALTER PROCEDURE

```sql
ALTER PROCEDURE proc_name [characteristic ...]

characteristic: {
    COMMENT 'string'
  | LANGUAGE SQL
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
}
```

Esta instrução pode ser usada para alterar as características de uma stored procedure. Mais de uma alteração pode ser especificada em uma instrução [`ALTER PROCEDURE`](alter-procedure.html "13.1.6 ALTER PROCEDURE Statement"). No entanto, você não pode alterar os parâmetros ou o corpo de uma stored procedure usando esta instrução; para fazer tais alterações, você deve realizar o drop (excluir) e recriar a procedure usando [`DROP PROCEDURE`](drop-procedure.html "13.1.27 DROP PROCEDURE and DROP FUNCTION Statements") e [`CREATE PROCEDURE`](create-procedure.html "13.1.16 CREATE PROCEDURE and CREATE FUNCTION Statements").

Você deve ter o privilégio [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine) para a procedure. Por padrão, esse privilégio é concedido automaticamente ao criador da procedure. Esse comportamento pode ser alterado desabilitando a system variable [`automatic_sp_privileges`](server-system-variables.html#sysvar_automatic_sp_privileges). Consulte [Seção 23.2.2, “Stored Routines e Privilégios MySQL”](stored-routines-privileges.html "23.2.2 Stored Routines and MySQL Privileges").