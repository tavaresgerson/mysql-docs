#### 25.12.4.3 A Tabela events_waits_history_long

A tabela `events_waits_history_long` contém os *`N`* `wait events` mais recentes que terminaram globalmente, em todos os `threads`. Os `wait events` não são adicionados à tabela até que tenham sido concluídos. Quando a tabela fica cheia, a linha mais antiga é descartada quando uma nova linha é adicionada, independentemente de qual `thread` gerou qualquer uma das linhas.

O `Performance Schema` ajusta automaticamente (autosizes) o valor de *`N`* durante a inicialização do servidor. Para definir o tamanho da tabela explicitamente, defina a variável de sistema `performance_schema_events_waits_history_long_size` na inicialização do servidor.

A tabela `events_waits_history_long` possui as mesmas colunas que a `events_waits_current`. Consulte Seção 25.12.4.1, “A Tabela events_waits_current”.

O uso de `TRUNCATE TABLE` é permitido para a tabela `events_waits_history_long`. Ele remove as linhas.

Para mais informações sobre a relação entre as três tabelas de `wait event`, consulte Seção 25.9, “Tabelas do Performance Schema para Current e Historical Events”.

Para informações sobre como configurar a coleta de `wait events`, consulte Seção 25.12.4, “Tabelas de Wait Event do Performance Schema”.