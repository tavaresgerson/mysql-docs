#### 15.6.6.2 Declaração de cursor DECLARE

```
DECLARE cursor_name CURSOR FOR select_statement
```

Esta declaração declara um cursor e o associa a uma instrução `SELECT` que recupera as linhas a serem percorridas pelo cursor. Para recuperar as linhas mais tarde, use uma instrução `FETCH`. O número de colunas recuperadas pela instrução `SELECT` deve corresponder ao número de variáveis de saída especificadas na instrução `FETCH`.

A instrução `SELECT` não pode ter uma cláusula `INTO`.

As declarações de cursor devem aparecer antes das declarações de manipulador e depois das declarações de variáveis e condições.

Um programa armazenado pode conter múltiplas declarações de cursor, mas cada cursor declarado em um bloco específico deve ter um nome único. Para um exemplo, consulte a Seção 15.6.6, “Cursors”.

Para informações disponíveis através das instruções `SHOW`, em muitos casos é possível obter informações equivalentes usando um cursor com uma tabela da tabela `INFORMATION_SCHEMA`.