#### 13.6.6.2 Comando DECLARE de Cursor

```sql
DECLARE cursor_name CURSOR FOR select_statement
```

Este comando declara um **Cursor** e o associa a um comando `SELECT` que recupera as linhas a serem percorridas pelo **Cursor**. Para fazer o **fetch** das linhas posteriormente, use um comando `FETCH`. O número de colunas recuperadas pelo comando `SELECT` deve corresponder ao número de **output variables** especificadas no comando `FETCH`.

O comando `SELECT` não pode ter uma cláusula **INTO**.

As declarações de **Cursor** devem aparecer antes das declarações de **handler** e depois das declarações de **variable** e **condition**.

Um programa armazenado pode conter múltiplas declarações de **Cursor**, mas cada **Cursor** declarado em um determinado bloco deve ter um nome exclusivo. Para um exemplo, consulte a Seção 13.6.6, “Cursors”.

Para informações disponíveis através dos comandos `SHOW`, é possível em muitos casos obter informações equivalentes usando um **Cursor** com uma tabela **INFORMATION_SCHEMA**.