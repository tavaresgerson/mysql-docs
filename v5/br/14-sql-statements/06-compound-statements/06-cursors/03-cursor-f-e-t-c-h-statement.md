#### 13.6.6.3 Instrução FETCH do Cursor

```sql
FETCH NEXT] FROM] cursor_name INTO var_name [, var_name] ...
```

Esta instrução faz o `FETCH` (busca) da próxima linha para a instrução [`SELECT`](select.html "13.2.9 SELECT Statement") associada ao Cursor especificado (que deve estar aberto), e avança o ponteiro do Cursor. Se uma linha (`row`) existir, as colunas recuperadas são armazenadas nas variáveis nomeadas. O número de colunas recuperadas pela instrução [`SELECT`](select.html "13.2.9 SELECT Statement") deve corresponder ao número de variáveis de saída especificadas na instrução [`FETCH`](fetch.html "13.6.6.3 Cursor FETCH Statement").

Se não houver mais linhas disponíveis, ocorre uma condição `No Data` com o valor `SQLSTATE` `'02000'`. Para detectar esta condição, você pode configurar um `handler` para ela (ou para uma condição `NOT FOUND`). Para um exemplo, consulte [Seção 13.6.6, “Cursors”](cursors.html "13.6.6 Cursors").

Esteja ciente de que outra operação, como um `SELECT` ou outro `FETCH`, também pode fazer com que o `handler` seja executado ao acionar a mesma condição. Se for necessário distinguir qual operação acionou a condição, coloque a operação dentro de seu próprio bloco [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement") para que possa ser associada ao seu próprio `handler`.