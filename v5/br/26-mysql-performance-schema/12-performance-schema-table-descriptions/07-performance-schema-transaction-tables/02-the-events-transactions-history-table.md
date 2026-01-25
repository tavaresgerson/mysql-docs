#### 25.12.7.2 A Tabela events_transactions_history

A tabela [`events_transactions_history`](performance-schema-events-transactions-history-table.html "25.12.7.2 The events_transactions_history Table") contém os *`N`* eventos de transação mais recentes que terminaram por Thread. Os eventos de transação não são adicionados à tabela até que tenham terminado. Quando a tabela contém o número máximo de linhas para um determinado Thread, a linha mais antiga desse Thread é descartada quando uma nova linha para esse Thread é adicionada. Quando um Thread termina, todas as suas linhas são descartadas.

O Performance Schema autoajusta o valor de *`N`* durante a inicialização do servidor. Para definir o número de linhas por Thread explicitamente, defina a variável de sistema [`performance_schema_events_transactions_history_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_transactions_history_size) na inicialização do servidor.

A tabela [`events_transactions_history`](performance-schema-events-transactions-history-table.html "25.12.7.2 The events_transactions_history Table") tem as mesmas colunas que [`events_transactions_current`](performance-schema-events-transactions-current-table.html "25.12.7.1 The events_transactions_current Table"). Consulte a [Seção 25.12.7.1, “The events_transactions_current Table”](performance-schema-events-transactions-current-table.html "25.12.7.1 The events_transactions_current Table").

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para a tabela [`events_transactions_history`](performance-schema-events-transactions-history-table.html "25.12.7.2 The events_transactions_history Table"). Ele remove as linhas.

Para mais informações sobre a relação entre as três tabelas de eventos de transação, consulte a [Seção 25.9, “Performance Schema Tables for Current and Historical Events”](performance-schema-event-tables.html "25.9 Performance Schema Tables for Current and Historical Events").

Para informações sobre como configurar a coleta de eventos de transação, consulte a [Seção 25.12.7, “Performance Schema Transaction Tables”](performance-schema-transaction-tables.html "25.12.7 Performance Schema Transaction Tables").