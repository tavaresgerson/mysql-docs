#### 25.12.5.3 A Tabela events_stages_history_long

A Tabela `events_stages_history_long` contém os *`N`* eventos de *stage* mais recentes que terminaram globalmente, em todos os *threads*. Os eventos de *stage* não são adicionados à *Table* até que tenham terminado. Quando a *Table* fica cheia, a *row* mais antiga é descartada quando uma nova *row* é adicionada, independentemente de qual *thread* gerou qualquer uma das *rows*.

O Performance Schema define automaticamente o tamanho do valor de *`N`* durante a inicialização do servidor (*server startup*). Para definir o tamanho da *Table* explicitamente, defina a variável de sistema `performance_schema_events_stages_history_long_size` na inicialização do servidor.

A Tabela `events_stages_history_long` possui as mesmas *columns* que a `events_stages_current`. Consulte Seção 25.12.5.1, “A Tabela events_stages_current”.

O `TRUNCATE TABLE` é permitido para a *Table* `events_stages_history_long`. Ele remove as *rows*.

Para mais informações sobre a relação entre as três *tables* de eventos de *stage*, consulte Seção 25.9, “Tabelas do Performance Schema para Eventos Atuais e Históricos”.

Para informações sobre a configuração de coleta de eventos de *stage*, consulte Seção 25.12.5, “Tabelas de Eventos de Stage do Performance Schema”.