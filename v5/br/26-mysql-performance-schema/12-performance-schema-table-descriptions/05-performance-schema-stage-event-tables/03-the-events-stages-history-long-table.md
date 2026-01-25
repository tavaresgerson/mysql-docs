#### 25.12.5.3 A Tabela events_stages_history_long

A Tabela [`events_stages_history_long`](performance-schema-events-stages-history-long-table.html "25.12.5.3 The events_stages_history_long Table") contém os *`N`* eventos de *stage* mais recentes que terminaram globalmente, em todos os *threads*. Os eventos de *stage* não são adicionados à *Table* até que tenham terminado. Quando a *Table* fica cheia, a *row* mais antiga é descartada quando uma nova *row* é adicionada, independentemente de qual *thread* gerou qualquer uma das *rows*.

O Performance Schema define automaticamente o tamanho do valor de *`N`* durante a inicialização do servidor (*server startup*). Para definir o tamanho da *Table* explicitamente, defina a variável de sistema [`performance_schema_events_stages_history_long_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_long_size) na inicialização do servidor.

A Tabela [`events_stages_history_long`](performance-schema-events-stages-history-long-table.html "25.12.5.3 The events_stages_history_long Table") possui as mesmas *columns* que a [`events_stages_current`](performance-schema-events-stages-current-table.html "25.12.5.1 The events_stages_current Table"). Consulte [Seção 25.12.5.1, “A Tabela events_stages_current”](performance-schema-events-stages-current-table.html "25.12.5.1 The events_stages_current Table").

O [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para a *Table* [`events_stages_history_long`](performance-schema-events-stages-history-long-table.html "25.12.5.3 The events_stages_history_long Table"). Ele remove as *rows*.

Para mais informações sobre a relação entre as três *tables* de eventos de *stage*, consulte [Seção 25.9, “Tabelas do Performance Schema para Eventos Atuais e Históricos”](performance-schema-event-tables.html "25.9 Performance Schema Tables for Current and Historical Events").

Para informações sobre a configuração de coleta de eventos de *stage*, consulte [Seção 25.12.5, “Tabelas de Eventos de Stage do Performance Schema”](performance-schema-stage-tables.html "25.12.5 Performance Schema Stage Event Tables").