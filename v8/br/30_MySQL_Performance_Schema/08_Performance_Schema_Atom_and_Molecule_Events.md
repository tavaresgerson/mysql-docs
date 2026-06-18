## 29.8 Eventos de Átomo e Molécula do Schema de Desempenho

Para um evento de I/O de tabela, geralmente há duas linhas no `events_waits_current`, não uma. Por exemplo, uma linha de consulta pode resultar em linhas como esta:

```
Row# EVENT_NAME                 TIMER_START TIMER_END
---- ----------                 ----------- ---------
   1 wait/io/file/myisam/dfile        10001 10002
   2 wait/io/table/sql/handler        10000 NULL
```

A consulta de linha causa uma leitura de arquivo. No exemplo, o evento de leitura de I/O de tabela começou antes do evento de leitura de I/O de arquivo, mas ainda não terminou (seu valor `TIMER_END` é `NULL`). O evento de leitura de I/O de arquivo está "aninhado" dentro do evento de leitura de I/O de tabela.

Isso ocorre porque, ao contrário de outros eventos de espera "atômicos", como para mútues ou E/S de arquivos, os eventos de E/S de tabela são "moleculares" e incluem (sobrepõem-se com) outros eventos. No `events_waits_current`, o evento de E/S de tabela geralmente tem duas linhas:

- Uma linha para o evento de espera de I/O da tabela mais recente
- Uma linha para o evento de espera mais recente de qualquer tipo

Normalmente, mas nem sempre, o evento de espera "de qualquer tipo" difere do evento de entrada/saída da tabela. À medida que cada evento subsidiário é concluído, ele desaparece de `events_waits_current`. Neste ponto, e até que o próximo evento subsidiário comece, a espera de entrada/saída da tabela também é a espera mais recente de qualquer tipo.
