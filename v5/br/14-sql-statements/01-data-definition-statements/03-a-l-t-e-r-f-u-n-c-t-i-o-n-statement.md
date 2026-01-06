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

Essa declaração pode ser usada para alterar as características de uma função armazenada. Mais de uma alteração pode ser especificada em uma declaração de `ALTER FUNCTION`. No entanto, você não pode alterar os parâmetros ou o corpo de uma função armazenada usando essa declaração; para fazer essas alterações, você deve descartar e recriar a função usando `DROP FUNCTION` e `CREATE FUNCTION`.

Você deve ter o privilégio `ALTER ROUTINE` para a função. (Esse privilégio é concedido automaticamente ao criador da função). Se o registro binário estiver habilitado, a instrução `ALTER FUNCTION` também pode exigir o privilégio `SUPER`, conforme descrito na Seção 23.7, “Registro Binário de Programas Armazenados”.
