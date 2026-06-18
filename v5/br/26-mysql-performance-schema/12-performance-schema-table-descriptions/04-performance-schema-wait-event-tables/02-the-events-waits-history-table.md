#### 25.12.4.2 A Tabela events_waits_history

A tabela `events_waits_history` contém os *`N`* eventos de wait mais recentes que foram encerrados por Thread. Os eventos de wait não são adicionados à tabela até que tenham sido encerrados. Quando a tabela atinge o número máximo de linhas para uma determinada Thread, a linha mais antiga dessa Thread é descartada quando uma nova linha para essa Thread é adicionada. Quando uma Thread termina, todas as suas linhas são descartadas.

O Performance Schema dimensiona automaticamente (autosizes) o valor de *`N`* durante a inicialização do server. Para definir o número de linhas por Thread explicitamente, configure a variável de sistema `performance_schema_events_waits_history_size` na inicialização do server.

A tabela `events_waits_history` possui as mesmas colunas que `events_waits_current`. Consulte Seção 25.12.4.1, “A Tabela events_waits_current”.

O `TRUNCATE TABLE` é permitido para a tabela `events_waits_history`. Ele remove as linhas.

Para mais informações sobre a relação entre as três tabelas de wait event, consulte Seção 25.9, “Tabelas do Performance Schema para Eventos Atuais e Históricos”.

Para informações sobre como configurar a coleta de wait events, consulte Seção 25.12.4, “Tabelas de Wait Event do Performance Schema”.