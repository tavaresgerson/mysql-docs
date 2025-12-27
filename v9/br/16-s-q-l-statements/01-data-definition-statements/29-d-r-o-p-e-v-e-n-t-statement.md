### 15.1.29 Declaração de evento DROP

```
DROP EVENT [IF EXISTS] event_name
```

Esta declaração remove o evento denominado *`event_name`*. O evento imediatamente deixa de ser ativo e é completamente excluído do servidor.

Se o evento não existir, o erro ERROR 1517 (HY000): Evento desconhecido '*`event_name`*' será gerado. Você pode substituir isso e fazer com que a declaração gere uma mensagem de aviso para eventos inexistentes, usando `IF EXISTS`.

Esta declaração requer o privilégio `EVENT` para o esquema ao qual o evento a ser removido pertence.