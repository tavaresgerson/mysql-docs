#### 29.12.5.1 Tabela events\_stages\_current

A tabela `events_stages_current` contém eventos de estágio atual. A tabela armazena uma linha por thread, mostrando o status atual do evento de estágio mais recente monitorado da thread, portanto, não há uma variável de sistema para configurar o tamanho da tabela.

Das tabelas que contêm linhas de eventos de palco, `events_stages_current` é a mais fundamental. Outras tabelas que contêm linhas de eventos de palco são derivadas logicamente dos eventos atuais. Por exemplo, as tabelas `events_stages_history` e `events_stages_history_long` são coleções dos eventos de palco mais recentes que terminaram, até um número máximo de linhas por fio e globalmente em todos os fios, respectivamente.

Para obter mais informações sobre a relação entre as três tabelas de eventos em etapas, consulte a Seção 29.9, “Tabelas do Schema de Desempenho para Eventos Atuais e Históricos”.

Para obter informações sobre como configurar se os eventos de estágio devem ser coletados, consulte a Seção 29.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.

A tabela `events_stages_current` tem essas colunas:

- `THREAD_ID`, `EVENT_ID`

  O fio associado ao evento e o número atual do evento quando o evento começa. Os valores `THREAD_ID` e `EVENT_ID` juntos identificam de forma única a linha. Nenhuma linha tem o mesmo par de valores.

- `END_EVENT_ID`

  Essa coluna é definida como `NULL` quando o evento começa e atualizada para o número atual do evento da thread quando o evento termina.

- `EVENT_NAME`

  O nome do instrumento que produziu o evento. Este é um valor `NAME` da tabela `setup_instruments`. Os nomes dos instrumentos podem ter várias partes e formar uma hierarquia, conforme discutido na Seção 29.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.

- `SOURCE`

  O nome do arquivo fonte que contém o código instrumentado que produziu o evento e o número da linha no arquivo onde a instrumentação ocorre. Isso permite que você verifique a fonte para determinar exatamente qual código está envolvido.

- `TIMER_START`, `TIMER_END`, `TIMER_WAIT`

  Informações de temporização para o evento. A unidade desses valores é picosegundos (trilhésimos de segundo). Os valores `TIMER_START` e `TIMER_END` indicam quando o temporizador do evento começou e terminou. `TIMER_WAIT` é o tempo decorrido do evento (duração).

  Se um evento ainda não tiver terminado, `TIMER_END` é o valor atual do temporizador e `TIMER_WAIT` é o tempo que já passou (`TIMER_END` − `TIMER_START`).

  Se um evento for gerado a partir de um instrumento que tem `TIMED = NO`, as informações de temporização não são coletadas, e `TIMER_START`, `TIMER_END` e `TIMER_WAIT` são todos `NULL`.

  Para discussão sobre picossegundos como unidade para tempos de eventos e fatores que afetam os valores de tempo, consulte a Seção 29.4.1, “Tempo de Ocorrência do Schema de Desempenho”.

- `WORK_COMPLETED`, `WORK_ESTIMATED`

  Essas colunas fornecem informações sobre o progresso da etapa, para os instrumentos que foram implementados para produzir essas informações. `WORK_COMPLETED` indica quantos módulos de trabalho foram concluídos para a etapa, e `WORK_ESTIMATED` indica quantos módulos de trabalho são esperados para a etapa. Para mais informações, consulte Informações sobre o progresso de eventos da etapa.

- `NESTING_EVENT_ID`

  O valor `EVENT_ID` do evento dentro do qual este evento está aninhado. O evento de aninhamento para um evento de estágio geralmente é um evento de declaração.

- `NESTING_EVENT_TYPE`

  O tipo de evento de nidificação. O valor é `TRANSACTION`, `STATEMENT`, `STAGE` ou `WAIT`.

A tabela `events_stages_current` tem esses índices:

- Chave primária em (`THREAD_ID`, `EVENT_ID`)

`TRUNCATE TABLE` é permitido para a tabela `events_stages_current`. Ele remove as linhas.
