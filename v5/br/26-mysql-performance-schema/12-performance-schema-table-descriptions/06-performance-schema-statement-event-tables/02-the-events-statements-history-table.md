#### 25.12.6.2 A Tabela events_statements_history

A tabela `events_statements_history` contém os *`N`* eventos de statement mais recentes que foram concluídos por `thread`. Eventos de Statement só são adicionados à tabela depois de serem concluídos. Quando a tabela atinge o número máximo de linhas para um determinado `thread`, a linha mais antiga desse `thread` é descartada quando uma nova linha para esse `thread` é adicionada. Quando um `thread` é encerrado, todas as suas linhas são descartadas.

O Performance Schema ajusta automaticamente (autosizes) o valor de *`N`* durante a inicialização do server. Para definir explicitamente o número de linhas por `thread`, configure a variável de sistema `performance_schema_events_statements_history_size` na inicialização do server.

A tabela `events_statements_history` possui as mesmas colunas que `events_statements_current`. Consulte Seção 25.12.6.1, “A Tabela events_statements_current”.

`TRUNCATE TABLE` é permitido para a tabela `events_statements_history`. Ele remove as linhas.

Para mais informações sobre o relacionamento entre as três tabelas de eventos `events_statements_xxx`, consulte Seção 25.9, “Tabelas do Performance Schema para Eventos Atuais e Históricos”.

Para informações sobre como configurar a coleta de statement events, consulte Seção 25.12.6, “Tabelas de Statement Events do Performance Schema”.