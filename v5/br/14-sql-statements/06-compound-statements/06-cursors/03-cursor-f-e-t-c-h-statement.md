#### 13.6.6.3 Declaração FETCH do cursor

```sql
FETCH [[NEXT] FROM] cursor_name INTO var_name [, var_name] ...
```

Essa declaração recupera a próxima linha da declaração `SELECT` associada ao cursor especificado (que deve estar aberto) e avança o ponteiro do cursor. Se uma linha existir, as colunas recuperadas são armazenadas nas variáveis nomeadas. O número de colunas recuperadas pela declaração `SELECT` deve corresponder ao número de variáveis de saída especificadas na declaração `FETCH`.

Se não houver mais linhas disponíveis, uma condição de "Nenhum dado" ocorre com o valor `'02000'` no SQLSTATE. Para detectar essa condição, você pode configurar um manipulador para isso (ou para uma condição `NOT FOUND`). Para um exemplo, consulte Seção 13.6.6, "Cursors".

Tenha em mente que outra operação, como uma `SELECT` ou outra `FETCH`, também pode fazer com que o manipulador seja executado ao levantar a mesma condição. Se for necessário distinguir qual operação levantou a condição, coloque a operação dentro de seu próprio bloco `[BEGIN ... END]` (begin-end.html) para que possa ser associada ao seu próprio manipulador.
