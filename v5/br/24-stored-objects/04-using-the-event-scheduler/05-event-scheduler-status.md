### 23.4.5 Status do Cronômetro de Eventos

O Agendamento de Eventos escreve informações sobre a execução de eventos que terminam com um erro ou aviso no log de erro do Servidor MySQL. Veja a Seção 23.4.6, “O Agendamento de Eventos e os Privilegios do MySQL”, para um exemplo.

Para obter informações sobre o estado do Agendamento de Eventos para fins de depuração e solução de problemas, execute **mysqladmin debug** (consulte a Seção 4.5.2, “mysqladmin — Um programa de administração do servidor MySQL”); após executar esse comando, o log de erros do servidor contém saída relacionada ao Agendamento de Eventos, semelhante ao que é mostrado aqui:

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

Em declarações que ocorrem como parte de eventos executados pelo Agendamento de Eventos, mensagens de diagnóstico (não apenas erros, mas também avisos) são escritas no log de erros e, no Windows, no log de eventos da aplicação. Para eventos executados com frequência, isso pode resultar em muitas mensagens registradas. Por exemplo, para declarações `SELECT ... INTO var_list`, se a consulta não retornar nenhuma linha, um aviso com o código de erro 1329 ocorre (`Nenhum dado`) e os valores das variáveis permanecem inalterados. Se a consulta retornar várias linhas, ocorre o erro 1172 (`O resultado consistiu em mais de uma linha`). Para qualquer uma dessas condições, é possível evitar que os avisos sejam registrados ao declarar um manipulador de condição; veja a Seção 13.6.7.2, “Declaração ... HANDLER”. Para declarações que podem recuperar várias linhas, outra estratégia é usar `LIMIT 1` para limitar o conjunto de resultados a uma única linha.
