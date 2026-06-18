#### 15.6.6.2 Declaração Cursor DECLARE

```
DECLARE cursor_name CURSOR FOR select_statement
```

Esta declaração declara um cursor e o associa a uma declaração `SELECT` que recupera as linhas a serem percorridas pelo cursor. Para recuperar as linhas mais tarde, use uma declaração `FETCH`. O número de colunas recuperadas pela declaração `SELECT` deve corresponder ao número de variáveis de saída especificadas na declaração `FETCH`.

A declaração `SELECT` não pode ter uma cláusula `INTO`.

As declarações de cursor devem aparecer antes das declarações de manipulador e após as declarações de variáveis e condições.

Um programa armazenado pode conter várias declarações de cursor, mas cada cursor declarado em um bloco específico deve ter um nome único. Para um exemplo, consulte a Seção 15.6.6, “Cursors”.

Para obter informações disponíveis por meio das declarações `SHOW`, é possível, em muitos casos, obter informações equivalentes usando um cursor com uma tabela `INFORMATION_SCHEMA`.
