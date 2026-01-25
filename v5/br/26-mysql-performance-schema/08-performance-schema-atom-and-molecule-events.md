## 25.8 Eventos Atômicos e Moleculares do Performance Schema

Para um evento de `I/O` de tabela, geralmente há duas linhas em [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 A Tabela events_waits_current"), não apenas uma. Por exemplo, uma busca por linha (`row fetch`) pode resultar em linhas como estas:

```sql
Row# EVENT_NAME                 TIMER_START TIMER_END
---- ----------                 ----------- ---------
   1 wait/io/file/myisam/dfile        10001 10002
   2 wait/io/table/sql/handler        10000 NULL
```

A busca por linha causa uma leitura de arquivo (`file read`). No exemplo, o evento de busca de `I/O` de tabela começou antes do evento de `I/O` de arquivo, mas não terminou (seu valor `TIMER_END` é `NULL`). O evento de `I/O` de arquivo está “aninhado” (`nested`) dentro do evento de `I/O` de tabela.

Isso ocorre porque, diferentemente de outros eventos de espera “atômicos” (como para `mutexes` ou `I/O` de arquivo), os eventos de `I/O` de tabela são “moleculares” e incluem (se sobrepõem a) outros eventos. Em [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 A Tabela events_waits_current"), o evento de `I/O` de tabela geralmente tem duas linhas:

* Uma linha para o evento de espera de `I/O` de tabela mais recente
* Uma linha para o evento de espera mais recente de qualquer tipo

Geralmente, mas nem sempre, o evento de espera “de qualquer tipo” difere do evento de `I/O` de tabela. À medida que cada evento subsidiário é concluído, ele desaparece de [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 A Tabela events_waits_current"). Neste ponto, e até que o próximo evento subsidiário comece, a espera de `I/O` de tabela também é a espera mais recente de qualquer tipo.