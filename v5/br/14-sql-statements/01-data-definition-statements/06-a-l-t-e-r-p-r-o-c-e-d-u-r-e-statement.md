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

Esta instrução pode ser usada para alterar as características de uma stored procedure. Mais de uma alteração pode ser especificada em uma instrução `ALTER PROCEDURE`. No entanto, você não pode alterar os parâmetros ou o corpo de uma stored procedure usando esta instrução; para fazer tais alterações, você deve realizar o drop (excluir) e recriar a procedure usando `DROP PROCEDURE` e `CREATE PROCEDURE`.

Você deve ter o privilégio `ALTER ROUTINE` para a procedure. Por padrão, esse privilégio é concedido automaticamente ao criador da procedure. Esse comportamento pode ser alterado desabilitando a system variable `automatic_sp_privileges`. Consulte Seção 23.2.2, “Stored Routines e Privilégios MySQL”.