### 15.1.25 Declaração de Evento de Queda

```
DROP EVENT [IF EXISTS] event_name
```

Esta declaração exclui o evento com o nome `event_name`. O evento imediatamente deixa de ser ativo e é completamente excluído do servidor.

Se o evento não existir, o erro ERROR 1517 (HY000): Resultados de evento desconhecido '`event_name`'. Você pode substituir isso e fazer com que a declaração gere uma mensagem de alerta para eventos inexistentes, usando `IF EXISTS`.

Esta declaração exige o privilégio `EVENT` para o esquema ao qual o evento a ser excluído pertence.
