### 23.4.5 Status do Event Scheduler

O Event Scheduler registra informações sobre a execução de eventos que terminam com erro ou aviso no error log do MySQL Server. Veja a Seção 23.4.6, “O Event Scheduler e Privilégios MySQL” para um exemplo.

Para obter informações sobre o estado do Event Scheduler para fins de debugging e troubleshooting, execute **mysqladmin debug** (veja a Seção 4.5.2, “mysqladmin — Um Programa de Administração do MySQL Server”); após a execução deste comando, o error log do servidor contém uma saída relacionada ao Event Scheduler, semelhante ao que é mostrado aqui:

```sql
Events status:
LLA = Last Locked At  LUA = Last Unlocked At
WOC = Waiting On Condition  DL = Data Locked

Event scheduler status:
State      : INITIALIZED
Thread id  : 0
LLA        : n/a:0
LUA        : n/a:0
WOC        : NO
Workers    : 0
Executed   : 0
Data locked: NO

Event queue status:
Element count   : 0
Data locked     : NO
Attempting lock : NO
LLA             : init_queue:95
LUA             : init_queue:103
WOC             : NO
Next activation : never
```

Em statements que ocorrem como parte de eventos executados pelo Event Scheduler, mensagens de diagnóstico (não apenas erros, mas também warnings) são escritas no error log e, no Windows, no log de eventos da aplicação. Para eventos executados frequentemente, é possível que isso resulte em muitas mensagens registradas. Por exemplo, para statements `SELECT ... INTO var_list`, se a Query não retornar linhas, ocorre um warning com código de erro 1329 (`No data`), e os valores das variáveis permanecem inalterados. Se a Query retornar múltiplas linhas, ocorre o erro 1172 (`Result consisted of more than one row`). Para ambas as condições, você pode evitar que os warnings sejam registrados declarando um condition handler; veja a Seção 13.6.7.2, “Instrução DECLARE ... HANDLER”. Para statements que possam recuperar múltiplas linhas, outra estratégia é usar `LIMIT 1` para limitar o result set a uma única linha.