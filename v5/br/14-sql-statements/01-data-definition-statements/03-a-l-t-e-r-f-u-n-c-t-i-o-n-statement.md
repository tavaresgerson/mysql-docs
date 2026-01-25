### 13.1.3 Declaração ALTER FUNCTION

```sql
ALTER FUNCTION func_name [characteristic ...]

characteristic: {
    COMMENT 'string'
  | LANGUAGE SQL
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
}
```

Esta declaração pode ser usada para alterar as características de uma stored function. Mais de uma alteração pode ser especificada em uma declaração [`ALTER FUNCTION`](alter-function.html "13.1.3 ALTER FUNCTION Statement"). No entanto, você não pode alterar os parâmetros ou o corpo de uma stored function usando esta declaração; para fazer tais alterações, você deve descartar e recriar a function usando [`DROP FUNCTION`](drop-function.html "13.1.24 DROP FUNCTION Statement") e [`CREATE FUNCTION`](create-function.html "13.1.13 CREATE FUNCTION Statement").

Você deve ter o privilégio [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine) para a function. (Esse privilégio é concedido automaticamente ao criador da function.) Se o binary logging estiver habilitado, a declaração [`ALTER FUNCTION`](alter-function.html "13.1.3 ALTER FUNCTION Statement") também pode exigir o privilégio [`SUPER`](privileges-provided.html#priv_super), conforme descrito na [Seção 23.7, “Stored Program Binary Logging”](stored-programs-logging.html "23.7 Stored Program Binary Logging").