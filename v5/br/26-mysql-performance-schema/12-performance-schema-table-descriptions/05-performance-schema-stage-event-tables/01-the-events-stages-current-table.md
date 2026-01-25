#### 25.12.5.1 A Tabela events_stages_current

A tabela [`events_stages_current`](performance-schema-events-stages-current-table.html "25.12.5.1 The events_stages_current Table") contém eventos de estágio atuais. A tabela armazena uma linha por `Thread`, mostrando o status atual do evento de estágio monitorado mais recente dessa `Thread`, portanto, não há uma variável de sistema para configurar o tamanho da tabela.

Dentre as tabelas que contêm linhas de evento de estágio, [`events_stages_current`](performance-schema-events-stages-current-table.html "25.12.5.1 The events_stages_current Table") é a mais fundamental. Outras tabelas que contêm linhas de evento de estágio são logicamente derivadas dos eventos atuais. Por exemplo, as tabelas [`events_stages_history`](performance-schema-events-stages-history-table.html "25.12.5.2 The events_stages_history Table") e [`events_stages_history_long`](performance-schema-events-stages-history-long-table.html "25.12.5.3 The events_stages_history_long Table") são coleções dos eventos de estágio mais recentes que terminaram, até um número máximo de linhas por `Thread` e globalmente em todas as `Threads`, respectivamente.

Para mais informações sobre a relação entre as três tabelas de eventos de estágio, consulte [Seção 25.9, “Tabelas do Performance Schema para Eventos Atuais e Históricos”](performance-schema-event-tables.html "25.9 Performance Schema Tables for Current and Historical Events").

Para informações sobre a configuração da coleta de eventos de estágio, consulte [Seção 25.12.5, “Tabelas de Eventos de Estágio do Performance Schema”](performance-schema-stage-tables.html "25.12.5 Performance Schema Stage Event Tables").

A tabela [`events_stages_current`](performance-schema-events-stages-current-table.html "25.12.5.1 The events_stages_current Table") possui estas colunas:

* `THREAD_ID`, `EVENT_ID`

  O `Thread` associado ao `Event` e o número do `Event` atual da `Thread` quando o `Event` começa. Os valores de `THREAD_ID` e `EVENT_ID` juntos identificam a linha de forma única. Não há duas linhas com o mesmo par de valores.

* `END_EVENT_ID`

  Esta coluna é definida como `NULL` quando o `Event` começa e é atualizada para o número do `Event` atual da `Thread` quando o `Event` termina.

* `EVENT_NAME`

  O nome do instrumento que produziu o `Event`. Este é um valor `NAME` da tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table"). Os nomes dos instrumentos podem ter múltiplas partes e formar uma hierarquia, conforme discutido na [Seção 25.6, “Convenções de Nomenclatura de Instrumentos do Performance Schema”](performance-schema-instrument-naming.html "25.6 Performance Schema Instrument Naming Conventions").

* `SOURCE`

  O nome do arquivo fonte contendo o código instrumentado que produziu o `Event` e o número da linha no arquivo onde a instrumentação ocorre. Isso permite que você verifique o código fonte para determinar exatamente qual código está envolvido.

* `TIMER_START`, `TIMER_END`, `TIMER_WAIT`

  Informações de tempo para o `Event`. A unidade para esses valores é picosegundos (trilionésimos de segundo). Os valores `TIMER_START` e `TIMER_END` indicam quando a cronometragem do `Event` começou e terminou. `TIMER_WAIT` é o tempo decorrido (`duration`) do `Event`.

  Se um `Event` não tiver terminado, `TIMER_END` é o valor atual do `Timer` e `TIMER_WAIT` é o tempo decorrido até agora (`TIMER_END` − `TIMER_START`).

  Se um `Event` for produzido por um instrumento que tem `TIMED = NO`, as informações de tempo não são coletadas, e `TIMER_START`, `TIMER_END` e `TIMER_WAIT` são todos `NULL`.

  Para discussão sobre picosegundos como unidade para tempos de `Event` e fatores que afetam os valores de tempo, consulte [Seção 25.4.1, “Cronometragem de Eventos do Performance Schema”](performance-schema-timing.html "25.4.1 Performance Schema Event Timing").

* `WORK_COMPLETED`, `WORK_ESTIMATED`

  Estas colunas fornecem informações de progresso do estágio, para instrumentos que foram implementados para produzir tais informações. `WORK_COMPLETED` indica quantas unidades de trabalho foram concluídas para o estágio, e `WORK_ESTIMATED` indica quantas unidades de trabalho são esperadas para o estágio. Para mais informações, consulte [Informações de Progresso de Eventos de Estágio](performance-schema-stage-tables.html#stage-event-progress "Stage Event Progress Information").

* `NESTING_EVENT_ID`

  O valor `EVENT_ID` do `Event` dentro do qual este `Event` está aninhado. O `Event` de aninhamento para um `Event` de estágio é geralmente um `Statement event`.

* `NESTING_EVENT_TYPE`

  O tipo do `Event` de aninhamento. O valor é `TRANSACTION`, `STATEMENT`, `STAGE` ou `WAIT`.

O [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para a tabela [`events_stages_current`](performance-schema-events-stages-current-table.html "25.12.5.1 The events_stages_current Table"). Ele remove as linhas.