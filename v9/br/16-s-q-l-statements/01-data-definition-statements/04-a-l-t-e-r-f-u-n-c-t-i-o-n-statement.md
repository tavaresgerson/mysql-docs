### 15.1.4 Declaração `ALTER FUNCTION`

```
ALTER FUNCTION func_name [characteristic ...]

characteristic: {
    COMMENT 'string'
  | LANGUAGE {SQL | JAVASCRIPT}
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
  | USING([library_reference][, library_reference][, ...])
}
```

Esta declaração pode ser usada para alterar as características de uma função armazenada. Mais de uma alteração pode ser especificada em uma declaração `ALTER FUNCTION`. No entanto, você não pode alterar os parâmetros ou o corpo de uma função armazenada usando esta declaração; para fazer tais alterações, você deve descartar e recriar a função usando `DROP FUNCTION` e `CREATE FUNCTION`.

Você deve ter o privilégio `ALTER ROUTINE` para a função. (Esse privilégio é concedido automaticamente ao criador da função.) Se o registro binário estiver habilitado, a declaração `ALTER FUNCTION` também pode exigir o privilégio `SUPER`, conforme descrito na Seção 27.9, “Registro Binário de Programas Armazenados”.

A cláusula `USING` é específica para programas armazenados escritos em JavaScript (veja a Seção 27.3, “Programas Armazenados em JavaScript”), e permite que você especifique uma lista de zero ou mais bibliotecas a serem importadas pela função armazenada, causando a remoção de qualquer lista anterior, assim como faz com `ALTER PROCEDURE`. Consulte a Seção 15.1.9, “Declaração `ALTER PROCEDURE`”, para obter informações mais detalhadas.