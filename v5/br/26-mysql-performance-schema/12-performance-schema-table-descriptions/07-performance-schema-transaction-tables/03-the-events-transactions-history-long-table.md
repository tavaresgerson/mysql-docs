#### 25.12.7.3 A Tabela events_transactions_history_long

A tabela [`events_transactions_history_long`](performance-schema-events-transactions-history-long-table.html "25.12.7.3 The events_transactions_history_long Table") contém os *`N`* eventos de Transaction mais recentes que foram concluídos globalmente, em todos os Threads. Os eventos de Transaction não são adicionados à tabela até que sejam finalizados. Quando a tabela fica cheia, a linha mais antiga é descartada quando uma nova linha é adicionada, independentemente de qual Thread gerou qualquer uma das linhas.

O Performance Schema dimensiona automaticamente o valor de *`N`* na inicialização do servidor. Para definir o tamanho da tabela explicitamente, defina a variável de sistema [`performance_schema_events_transactions_history_long_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_transactions_history_long_size) na inicialização do servidor.

A tabela [`events_transactions_history_long`](performance-schema-events-transactions-history-long-table.html "25.12.7.3 The events_transactions_history_long Table") possui as mesmas colunas que [`events_transactions_current`](performance-schema-events-transactions-current-table.html "25.12.7.1 The events_transactions_current Table"). Consulte [Seção 25.12.7.1, “A Tabela events_transactions_current”](performance-schema-events-transactions-current-table.html "25.12.7.1 The events_transactions_current Table").

O [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para a tabela [`events_transactions_history_long`](performance-schema-events-transactions-history-long-table.html "25.12.7.3 The events_transactions_history_long Table"). Ele remove as linhas.

Para obter mais informações sobre a relação entre as três tabelas de eventos de Transaction, consulte [Seção 25.9, “Tabelas do Performance Schema para Eventos Atuais e Históricos”](performance-schema-event-tables.html "25.9 Performance Schema Tables for Current and Historical Events").

Para obter informações sobre como configurar a coleta de eventos de Transaction, consulte [Seção 25.12.7, “Tabelas de Transaction do Performance Schema”](performance-schema-transaction-tables.html "25.12.7 Performance Schema Transaction Tables").