#### 25.12.6.2 A Tabela events_statements_history

A tabela [`events_statements_history`](performance-schema-events-statements-history-table.html "25.12.6.2 The events_statements_history Table") contém os *`N`* eventos de statement mais recentes que foram concluídos por `thread`. Eventos de Statement só são adicionados à tabela depois de serem concluídos. Quando a tabela atinge o número máximo de linhas para um determinado `thread`, a linha mais antiga desse `thread` é descartada quando uma nova linha para esse `thread` é adicionada. Quando um `thread` é encerrado, todas as suas linhas são descartadas.

O Performance Schema ajusta automaticamente (autosizes) o valor de *`N`* durante a inicialização do server. Para definir explicitamente o número de linhas por `thread`, configure a variável de sistema [`performance_schema_events_statements_history_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_statements_history_size) na inicialização do server.

A tabela [`events_statements_history`](performance-schema-events-statements-history-table.html "25.12.6.2 The events_statements_history Table") possui as mesmas colunas que [`events_statements_current`](performance-schema-events-statements-current-table.html "25.12.6.1 The events_statements_current Table"). Consulte [Seção 25.12.6.1, “A Tabela events_statements_current”](performance-schema-events-statements-current-table.html "25.12.6.1 The events_statements_current Table").

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para a tabela [`events_statements_history`](performance-schema-events-statements-history-table.html "25.12.6.2 The events_statements_history Table"). Ele remove as linhas.

Para mais informações sobre o relacionamento entre as três tabelas de eventos `events_statements_xxx`, consulte [Seção 25.9, “Tabelas do Performance Schema para Eventos Atuais e Históricos”](performance-schema-event-tables.html "25.9 Performance Schema Tables for Current and Historical Events").

Para informações sobre como configurar a coleta de statement events, consulte [Seção 25.12.6, “Tabelas de Statement Events do Performance Schema”](performance-schema-statement-tables.html "25.12.6 Performance Schema Statement Event Tables").