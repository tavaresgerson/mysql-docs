## 25.8 Eventos de Átomos e Moléculas do Schema de Desempenho

Para um evento de I/O de tabela, geralmente há duas linhas em `events_waits_current`, não uma. Por exemplo, uma linha de busca pode resultar em linhas como esta:

```sql
Row# EVENT_NAME                 TIMER_START TIMER_END
---- ----------                 ----------- ---------
   1 wait/io/file/myisam/dfile        10001 10002
   2 wait/io/table/sql/handler        10000 NULL
```

O fetch de linha causa uma leitura de arquivo. No exemplo, o evento de leitura de I/O de tabela foi iniciado antes do evento de leitura de I/O de arquivo, mas ainda não foi concluído (seu valor `TIMER_END` é `NULL`). O evento de leitura de I/O está "aninhado" dentro do evento de leitura de I/O de tabela.

Isso ocorre porque, ao contrário de outros eventos de espera "atômicos", como para mutantes ou I/O de arquivos, os eventos de I/O de tabela são "moleculares" e incluem (sobrepõem-se com) outros eventos. Em `events_waits_current`, o evento de I/O de tabela geralmente tem duas linhas:

* Uma linha para o evento de espera de I/O da tabela mais recente * Uma linha para o evento de espera de qualquer tipo mais recente

Normalmente, mas nem sempre, o evento de espera de "qualquer tipo" difere do evento de espera de I/O da tabela. À medida que cada evento subsidiário é completado, ele desaparece de `events_waits_current`. Neste ponto, e até que o próximo evento subsidiário comece, a espera de I/O da tabela também é a espera mais recente de qualquer tipo.