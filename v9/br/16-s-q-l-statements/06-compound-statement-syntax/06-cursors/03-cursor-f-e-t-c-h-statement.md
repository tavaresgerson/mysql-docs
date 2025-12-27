#### 15.6.6.3 Declaração `FETCH` do cursor

```
FETCH [[NEXT] FROM] cursor_name INTO var_name [, var_name] ...
```

Esta declaração recupera a próxima linha para a declaração `SELECT` associada ao cursor especificado (que deve estar aberto) e avança o ponteiro do cursor. Se existir uma linha, as colunas recuperadas são armazenadas nas variáveis nomeadas. O número de colunas recuperadas pela declaração `SELECT` deve corresponder ao número de variáveis de saída especificadas na declaração `FETCH`.

Se não houver mais linhas disponíveis, uma condição de "Nenhum dado" ocorre com o valor do SQLSTATE `'02000'`. Para detectar essa condição, você pode configurar um manipulador para ela (ou para uma condição `NOT FOUND`). Para um exemplo, consulte a Seção 15.6.6, “Cursors”.

Tenha em mente que outra operação, como uma `SELECT` ou outra `FETCH`, também pode fazer com que o manipulador seja executado ao levantar a mesma condição. Se for necessário distinguir qual operação levantou a condição, coloque a operação dentro de seu próprio bloco `BEGIN ... END` para que possa ser associada ao seu próprio manipulador.