### 13.1.23 Instrução DROP EVENT

```sql
DROP EVENT [IF EXISTS] event_name
```

Esta instrução remove o Event nomeado *`event_name`*. O Event imediatamente deixa de estar ativo e é excluído completamente do server.

Se o Event não existir, o erro ERROR 1517 (HY000): Unknown event '*`event_name`*' é retornado. Você pode sobrescrever isso e fazer com que a instrução gere um warning para Events inexistentes usando `IF EXISTS`.

Esta instrução requer o privilégio [`EVENT`](privileges-provided.html#priv_event) para o schema ao qual o Event a ser removido pertence.