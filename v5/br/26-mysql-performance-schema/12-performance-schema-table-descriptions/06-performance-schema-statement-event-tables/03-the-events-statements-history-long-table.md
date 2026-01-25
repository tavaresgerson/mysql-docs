#### 25.12.6.3 A Tabela events_statements_history_long

A tabela [`events_statements_history_long`](performance-schema-events-statements-history-long-table.html "25.12.6.3 A Tabela events_statements_history_long") contém os *`N`* eventos de statement mais recentes que terminaram globalmente, em todos os threads. Eventos de Statement não são adicionados à tabela até que tenham terminado. Quando a tabela fica cheia, a linha (row) mais antiga é descartada quando uma nova linha é adicionada, independentemente de qual thread gerou a linha.

O valor de *`N`* é dimensionado automaticamente (autosized) na inicialização do server. Para definir o tamanho da tabela explicitamente, defina a variável de sistema [`performance_schema_events_statements_history_long_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_statements_history_long_size) na inicialização do server.

A tabela [`events_statements_history_long`](performance-schema-events-statements-history-long-table.html "25.12.6.3 A Tabela events_statements_history_long") tem as mesmas colunas que a [`events_statements_current`](performance-schema-events-statements-current-table.html "25.12.6.1 A Tabela events_statements_current"). Consulte [Seção 25.12.6.1, “A Tabela events_statements_current”](performance-schema-events-statements-current-table.html "25.12.6.1 A Tabela events_statements_current").

O [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para a tabela [`events_statements_history_long`](performance-schema-events-statements-history-long-table.html "25.12.6.3 A Tabela events_statements_history_long"). Ele remove as linhas.

Para mais informações sobre o relacionamento entre as três tabelas de eventos `events_statements_xxx`, consulte [Seção 25.9, “Tabelas do Performance Schema para Eventos Atuais e Históricos”](performance-schema-event-tables.html "25.9 Performance Schema Tables for Current and Historical Events").

Para informações sobre como configurar a coleta de eventos de statement, consulte [Seção 25.12.6, “Tabelas de Eventos de Statement do Performance Schema”](performance-schema-statement-tables.html "25.12.6 Performance Schema Statement Event Tables").