#### 25.12.4.3 A Tabela events_waits_history_long

A tabela [`events_waits_history_long`](performance-schema-events-waits-history-long-table.html "25.12.4.3 The events_waits_history_long Table") contém os *`N`* `wait events` mais recentes que terminaram globalmente, em todos os `threads`. Os `wait events` não são adicionados à tabela até que tenham sido concluídos. Quando a tabela fica cheia, a linha mais antiga é descartada quando uma nova linha é adicionada, independentemente de qual `thread` gerou qualquer uma das linhas.

O `Performance Schema` ajusta automaticamente (autosizes) o valor de *`N`* durante a inicialização do servidor. Para definir o tamanho da tabela explicitamente, defina a variável de sistema [`performance_schema_events_waits_history_long_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_waits_history_long_size) na inicialização do servidor.

A tabela [`events_waits_history_long`](performance-schema-events-waits-history-long-table.html "25.12.4.3 The events_waits_history_long Table") possui as mesmas colunas que a [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table"). Consulte [Seção 25.12.4.1, “A Tabela events_waits_current”](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table").

O uso de [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para a tabela [`events_waits_history_long`](performance-schema-events-waits-history-long-table.html "25.12.4.3 The events_waits_history_long Table"). Ele remove as linhas.

Para mais informações sobre a relação entre as três tabelas de `wait event`, consulte [Seção 25.9, “Tabelas do Performance Schema para Current e Historical Events”](performance-schema-event-tables.html "25.9 Performance Schema Tables for Current and Historical Events").

Para informações sobre como configurar a coleta de `wait events`, consulte [Seção 25.12.4, “Tabelas de Wait Event do Performance Schema”](performance-schema-wait-tables.html "25.12.4 Performance Schema Wait Event Tables").