### 13.1.6 Declaração ALTER PROCEDURE

```sql
ALTER PROCEDURE proc_name [characteristic ...]

characteristic: {
    COMMENT 'string'
  | LANGUAGE SQL
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
}
```

Essa declaração pode ser usada para alterar as características de um procedimento armazenado. Mais de uma alteração pode ser especificada em uma declaração de `ALTER PROCEDURE`. No entanto, você não pode alterar os parâmetros ou o corpo de um procedimento armazenado usando essa declaração; para fazer essas alterações, você deve descartar e recriar o procedimento usando `DROP PROCEDURE` e `CREATE PROCEDURE`.

Você deve ter o privilégio `ALTER ROUTINE` para o procedimento. Por padrão, esse privilégio é concedido automaticamente ao criador do procedimento. Esse comportamento pode ser alterado desabilitando a variável de sistema `automatic_sp_privileges`. Veja Seção 23.2.2, “Rotinas Armazenadas e Privilégios do MySQL”.
