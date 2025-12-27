## Eventos de Schema de Desempenho de Átomos e Moléculas

Para um evento de leitura/escrita de tabela, geralmente há duas linhas em `events_waits_current`, e não uma. Por exemplo, uma linha de busca pode resultar em linhas como esta:

```
Row# EVENT_NAME                 TIMER_START TIMER_END
---- ----------                 ----------- ---------
   1 wait/io/file/myisam/dfile        10001 10002
   2 wait/io/table/sql/handler        10000 NULL
```

A linha de busca causa uma leitura de arquivo. No exemplo, o evento de leitura/escrita de tabela começou antes do evento de leitura de arquivo, mas ainda não terminou (seu valor `TIMER_END` é `NULL`). O evento de leitura de arquivo está "aninhado" dentro do evento de leitura/escrita de tabela.

Isso ocorre porque, ao contrário de outros eventos de espera "atômicos", como para mútuos ou leitura/escrita de arquivo, os eventos de leitura/escrita de tabela são "moleculares" e incluem (sobrepõem-se com) outros eventos. Em `events_waits_current`, o evento de leitura/escrita de tabela geralmente tem duas linhas:

* Uma linha para o evento de espera de leitura/escrita de tabela mais recente
* Uma linha para o evento de espera de qualquer tipo mais recente

Geralmente, mas nem sempre, o evento de espera de "qualquer tipo" difere do evento de leitura/escrita de tabela. À medida que cada evento subsidiário é completado, ele desaparece de `events_waits_current`. Neste ponto, e até que o próximo evento subsidiário comece, a espera de leitura/escrita de tabela também é a espera mais recente de qualquer tipo.