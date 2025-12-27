### 15.1.7 Declaração ALTER LIBRARY

```
ALTER LIBRARY library_name
    COMMENT "comment_text"
```

Esta declaração adiciona um comentário à biblioteca JavaScript nomeada ou substitui o comentário existente, se houver. Após a execução desta declaração, o comentário atualizado pode ser visualizado na saída de `SHOW CREATE LIBRARY` e na coluna `ROUTINE_COMMENT` da tabela `LIBRARIES` do Schema de Informações. O texto do comentário deve ser citado.

Para remover um comentário de uma biblioteca sem substituí-lo, especifique uma string de comentário vazia (`COMMENT ""` ou `COMMENT ''`).