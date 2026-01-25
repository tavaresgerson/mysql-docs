#### 25.12.5.2 A Tabela events_stages_history

A tabela [`events_stages_history`](performance-schema-events-stages-history-table.html "25.12.5.2 The events_stages_history Table") contém os *`N`* stage events mais recentes que terminaram por Thread. Stage events não são adicionados à tabela até que tenham terminado. Quando a tabela contém o número máximo de linhas para um Thread específico, a linha mais antiga desse Thread é descartada quando uma nova linha é adicionada para ele. Quando um Thread termina, todas as suas linhas são descartadas.

O Performance Schema ajusta automaticamente (autosizes) o valor de *`N`* durante a inicialização do server. Para definir explicitamente o número de linhas por Thread, configure a variável de sistema [`performance_schema_events_stages_history_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_size) na inicialização do server.

A tabela [`events_stages_history`](performance-schema-events-stages-history-table.html "25.12.5.2 The events_stages_history Table") possui as mesmas colunas que [`events_stages_current`](performance-schema-events-stages-current-table.html "25.12.5.1 The events_stages_current Table"). Veja [Seção 25.12.5.1, “A Tabela events_stages_current”](performance-schema-events-stages-current-table.html "25.12.5.1 The events_stages_current Table").

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para a tabela [`events_stages_history`](performance-schema-events-stages-history-table.html "25.12.5.2 The events_stages_history Table"). Ele remove as linhas.

Para mais informações sobre o relacionamento entre as três tabelas de stage event, veja [Seção 25.9, “Tabelas do Performance Schema para Current e Historical Events”](performance-schema-event-tables.html "25.9 Performance Schema Tables for Current and Historical Events").

Para informações sobre como configurar a coleta de stage events, veja [Seção 25.12.5, “Tabelas de Stage Event do Performance Schema”](performance-schema-stage-tables.html "25.12.5 Performance Schema Stage Event Tables").